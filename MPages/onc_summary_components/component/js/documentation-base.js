/**
 * A base class that represents and encapsulates a view.
 * A view represents the different ways that the user can perform documentation.
 * For example, free text data entry vs a structured hierarchy.
 *
 */
function DocumentationView() {
	this.m_namespace = "";                //Give the view a unique namespace
	this.m_id = "";                       //Gives the view a unique id
	this.m_rendered = false;
	this.m_component = null;
	//Id for the view's html element
	this.m_viewElementId = "";
	return this;
}

/**
 * This is the base method for finalizing a view (post render, so you can attach any necessary events)
 */
DocumentationView.prototype.finalize = function() {

};

/**
 * Gets the id of the HTML element that represents the view.
 *
 * @returns {string} view HTML element id
 */
DocumentationView.prototype.getViewElementId = function() {
	if (!this.m_viewElementId) {
		this.m_viewElementId = this.getNamespace() + ":" + this.getId();
	}

	return this.m_viewElementId;
};


/**
 * Shows the view
 */
DocumentationView.prototype.show = function() {
	$(document.getElementById(this.getViewElementId())).show();
};

/**
 * Hides the view
 */
DocumentationView.prototype.hide = function() {
	$(document.getElementById(this.getViewElementId())).hide();
};

/**
 * Determines if the the view has already been rendered
 * @returns {boolean} true, if the view has been rendered
 */
DocumentationView.prototype.isRendered = function() {
	return this.m_rendered;
};

/**
 * Sets whether the view has already been rendered
 *
 * @param {boolean} isRendered - indicates whether the view has been rendered
 */
DocumentationView.prototype.setIsRendered = function(isRendered) {
	this.m_rendered = isRendered;
};

/**
 * Renders the view
 *
 * @param {Object} data - an object containing data that is used for rendering
 */
DocumentationView.prototype.render = function(data) {
};

/**
 * Refresh the view by updating the already rendered view
 */
DocumentationView.prototype.refresh = function() {
};

/**
 * Sets the namespace for the view, used for generating ids/css classes
 *
 * @param {string} namespace - namespace used to generate ids/css classes
 */
DocumentationView.prototype.setNamespace = function(namespace) {
	if (typeof namespace !== "string") {
		throw new Error("Called setNamespace on DocumentationView with incorrect type, expecting string.");
	}
	this.m_namespace = namespace;
	return this;
};

/**
 * Gets the namespace for the view, used for generating ids/css classes
 *
 * @returns {string} the namespace used to generate ids/css classes
 */
DocumentationView.prototype.getNamespace = function() {
	return this.m_namespace;
};

/**
 * Sets the id for the view
 *
 * @param {string} id - an id for the view
 */
DocumentationView.prototype.setId = function(id) {
	if (typeof id !== "string") {
		throw new Error("Called setId on DocumentationView with incorrect type, expecting string.");
	}
	this.m_id = id;
	return this;
};

/**
 * Gets the id for the view
 *
 * @returns {string} - id for the view
 */
DocumentationView.prototype.getId = function() {
	return this.m_id;
};

/**
 * Gets the component that this view is associated to
 *
 * @returns {Object} the component that this view is associated to
 */
DocumentationView.prototype.getComponent = function() {
	return this.m_component;
};

/**
 * Sets the component that the view is associated to
 *
 * @param {Object} component - the component that this view is associated to
 */
DocumentationView.prototype.setComponent = function(component) {
	if (typeof component !== "object") {
		throw new Error("Called setComponent on DocumentationView with incorrect type, expecting object.");
	}
	this.m_component = component;
	return this;
};

/**
 * A narrative documentation view that provides a text editor that allows the user to type in free text documentation.
 */
function FreeTextDocumentationView() {
}
FreeTextDocumentationView.prototype = new DocumentationView();
FreeTextDocumentationView.prototype.constructor = DocumentationView;

/**
 * Gets the id of the HTML element that represents the view.
 * Overridden to get the id of the CKEditor's container element's id.
 *
 * @returns {string} view HTML element id
 */
FreeTextDocumentationView.prototype.getViewElementId = function() {
	var editor = this.getEditor();

	if (!this.m_viewElementId && editor) {
		this.m_viewElementId = editor.container.$.id;
	}

	return this.m_viewElementId;
};

/**
 * Returns the editor associated with the freetext view
 * @return {CKEDITOR.editor} editor instance of CKEditor editor
 */
FreeTextDocumentationView.prototype.getEditor = function() {
	return this.getComponent().getEditorInstance();
};


/**
 * Reuses existing rendering functions to render the free text
 *
 * @param {Object} recordData - a JSON object of the data coming back from the read CE blob script
 */
FreeTextDocumentationView.prototype.render = function(recordData) {
	this.m_component.renderComponent(recordData);
	this.m_viewElementId = null;
};

/**
 * Finalizes the free text view by instantiating a text editor
 */
FreeTextDocumentationView.prototype.finalize = function() {
	var component = this.m_component;
	//Schedule the editor to be instantiated whenever the current thread is free
	window.setTimeout(function() {
		component.createTextEditor($("#" + component.getStyles().getContentId() + " .documentation-content")[0]);
	}, 0);
};

/**
 * Resizes the free text view of the document component
 * @param  {Number} availableHeight The height that the editor should be resized to fit
 * @return {undefined}              undefined
 */
FreeTextDocumentationView.prototype.resize = function(availableHeight) {
	var editor = this.getEditor();
	if (editor){
		editor.fire("updateEditorMaxHeight", {
			"maxHeight" : availableHeight
		});
	}
};

/**
 * A structure documentation view that show a set of questions and answers in a hierarchical way.
 *
 * @returns {StructureDocumentationView}
 */
function StructureDocumentationView() {
	this.m_structureOrganizer = null;
	this.m_saveButton = null;

	//Element cache
	this.m_$viewContainer = null;
	this.m_$addTemplateButton = null;
	this.m_$questionContainer = null;
	this.m_$structureContainer = null;
	this.m_$structureOrganizerContents = null;
	this.m_$questionContents = null;
	this.m_$messageContainer = null;

	this.m_structureData = null;
	this.m_questionData = null;
	this.m_activityData = null;
	this.m_replyData = null;
	this.m_questionSet = null;
	this.m_answers = null;
	return this;
}
StructureDocumentationView.prototype = new DocumentationView();
StructureDocumentationView.prototype.constructor = DocumentationView;

/**
 * Retrieves the Add Template(s) button for Structured Documentation questions.
 * @returns {jQuery} The Add Template(s) button.
 */
StructureDocumentationView.prototype.getAddTemplateButton = function() {
	if(!this.m_$addTemplateButton || !this.m_$addTemplateButton.length) {
		this.m_$addTemplateButton = $("#" + this.m_namespace + "AddTemplateButton");
	}
	return this.m_$addTemplateButton;
};

/**
 * Sets the status of the response received from the call to mp_open_structured_section or mp_get_structured_template.
 * @param {string} status - The status of the response received from the call to mp_open_structured_section or
 * mp_get_structured_template.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setStatus = function(status) {
	if(typeof status !== "string") {
		throw new Error("StructureDocumentationView.prototype.setStatus expects a string");
	}
	this.m_status = status;
	return this;
};

/**
 * Sets the structured documentation data that was retrieved from a call to mp_get_structured_template
 * or mp_open_structured_section.
 * @param {Object} structureData - The structured documentation data.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setStructureData = function(structureData) {
	this.m_structureData = structureData;
	return this;
};

/**
 * Sets the structured documentation question data that was retrieved from a call to mp_get_structured_template
 * or mp_open_structured_section.
 * @param {Object} questionData - The user_options received from the call to mp_get_structured_template or
 * mp_open_structured_section.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setQuestionData = function(questionData) {
	this.m_questionData = questionData;
	return this;
};

/**
 * Sets the activity data for structured documentation that was retrieved from a call to mp_get_structured_template
 * or mp_open_structured_section.
 * @param {Object} activity - The activity data receieved from the call to mp_open_structured_section.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setActivityData = function(activity) {
	this.m_activityData = activity;
	return this;
};

/**
 * Sets the view container element. This element encapsulates the entire structured documentation view.
 * @param {jQuery} viewContainer - The view container element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setViewContainer = function(viewContainer) {
	if(typeof viewContainer !== "object") {
		throw new Error("StructureDocumentationView.prototype.setViewContainer expects a jQuery object.");
	}
	this.m_$viewContainer = viewContainer;
	return this;
};

/**
 * Sets the question container element. This element encapsulates all question related markup.
 * @param {jQuery} questionContainer - The question container element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setQuestionContainer = function(questionContainer) {
	if(typeof questionContainer !== "object") {
		throw new Error("StructureDocumentationView.prototype.setQuestionContainer expects a jQuery object.");
	}
	this.m_$questionContainer = questionContainer;
	return this;
};

/**
 * Sets the question contents element. This element contains the interchangable question markup.
 * @param {jQuery} questionContents - The question contents element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setQuestionContents = function(questionContents) {
	if(typeof questionContents !== "object") {
		throw new Error("StructureDocumentationView.prototype.setQuestionContents expects a jQuery object.");
	}
	this.m_$questionContents = questionContents;
	return this;
};

/**
 * Sets the add template button element.
 * @param {jQuery} addTemplateButton - The add template button element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setAddTemplateButton = function(addTemplateButton) {
	if(typeof addTemplateButton !== "object") {
		throw new Error("StructureDocumentationView.prototype.setAddTemplateButton expects a jQuery object.");
	}
	this.m_$addTemplateButton = addTemplateButton;
	return this;
};

/**
 * Sets the structure container element. This element encapsulates the structured documentation (organizer) markup.
 * @param {jQuery} structureContainer - The structure container element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setStructureContainer = function(structureContainer) {
	if(typeof structureContainer !== "object") {
		throw new Error("StructureDocumentationView.prototype.setStructureContainer expects a jQuery object.");
	}
	this.m_$structureContainer = structureContainer;
	return this;
};

/**
 * Sets the structure organizer content element. This element is where the structure organizer markup is injected.
 * @param {jQuery} structureOrganizerContents - The structure organizer content element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setStructureOrganizerContents = function(structureOrganizerContents) {
	if(typeof structureOrganizerContents !== "object") {
		throw new Error("StructureDocumentationView.prototype.setStructureOrganizerContents expects a jQuery object.");
	}
	this.m_$structureOrganizerContents = structureOrganizerContents;
	return this;
};

/**
 * Sets the message container element. This is the element where any error messages will be shown to the user.
 * @param {jQuery} messageContainer - The message container element.
 * @returns {StructureDocumentationView} Returns self to allow chaining.
 */
StructureDocumentationView.prototype.setMessageContainer = function(messageContainer) {
	if(typeof messageContainer !== "object") {
		throw new Error("StructureDocumentationView.prototype.setMessageContainer expects a jQuery object.");
	}
	this.m_$messageContainer = messageContainer;
	return this;
};

/**
 * Returns the structured organizer for the view.
 * @returns {StructureOrganizer} The structure organizer shown in the view.
 */
StructureDocumentationView.prototype.getOrganizer = function() {
	return this.m_structureOrganizer;
};

/**
 * Sets the structured organizer for the view.
 * @param {StructureOrganizer} organizer - the StructureOrganizer associated with the view
 */
StructureDocumentationView.prototype.setOrganizer = function(organizer) {
	this.m_structureOrganizer = organizer;
};


/**
 * Returns the save button for the StructureDocumentationView.
 * @returns {Object} - jQuery object containing the save button html element
 */
StructureDocumentationView.prototype.getSaveButtonElement = function() {
	if (!this.m_saveButton || !this.m_saveButton.length) {
		this.m_saveButton = $("#" + this.m_namespace + "StructureSaveButton");
	}
	return this.m_saveButton;
};

/**
 * Determines if there are questions that need to be displayed.
 * @returns {boolean} True if there is question data that needs to be displayed, otherwise false.
 */
StructureDocumentationView.prototype.hasQuestions = function() {
	return this.m_questionData !== null;
};

/**
 * Determines if the structured documentation view has structured documentation content as retrieved
 * by mp_get_structured_template or mp_open_structured_section.
 * @returns {boolean} True if the structured documentation data is not null, otherwise false.
 */
StructureDocumentationView.prototype.hasStructuredContent = function() {
	return (this.m_structureData && this.m_structureData.length > 0);
};

/**
 * Generates the question set objects.
 */
StructureDocumentationView.prototype.generateQuestionSet = function() {
	var self = this;
	var questionData = this.m_questionData;
	this.m_questionSet = (new JSONStructureOrganizerBuilder().setNamespace(this.m_namespace)).buildQuestionSet(questionData);
	this.m_questionSet.setOnCompleteCallback(function(complete){
		self.getAddTemplateButton().prop("disabled", !complete);
	});
	return this.m_questionSet;
};

/**
 * Handles the event when the user clicks the add template button when questions are being shown.
 */
StructureDocumentationView.prototype.onAddTemplateClick = function() {
	this.getAddTemplateButton().prop("disabled", true);
	this.m_answers = this.m_questionSet.getAnswers();
	this.completeRefresh();
};

/**
 * This will perform a complete refresh on the structured documentation view. It first determines if the view should
 * call mp_get_structured_template or mp_open_structured_section. Once the call has been made, the view will
 * visually refresh according to the response.
 */
StructureDocumentationView.prototype.completeRefresh = function() {
	var component = this.m_component;
	this.resetReplyData();
	if(component.hasMixedContent() || component.hasSectionActivity()) {
		this.openExisting();
	} else {
		this.queryTemplate();
	}
};

/**
 * Opens an existing structured documentation section. This occurs when structured activity has been documented on the
 * component.
 */
StructureDocumentationView.prototype.openExisting = function() {
	var self = this;
	var component = this.m_component;
	var criterion = component.getCriterion();
	var userOptionResponses = (this.m_answers && this.m_answers.length) ? '{ "user_option_responses" : { "options": '+this.m_answers + '} }' : null;
	var parameterArray = [
		"^MINE^",
		"^CLINICAL_EVENT^",
		component.getEventId() + ".0",
		criterion.person_id + ".0",
		criterion.encntr_id + ".0",
		criterion.position_cd + ".0",
		criterion.ppr_cd + ".0",
		"^" + component.getConceptCKI() + "^",
		criterion.provider_id + ".0"
	];
	var openStructureRequest = new ScriptRequest()
		.setProgramName("mp_open_structured_section")
		.setParameterArray(parameterArray)
		.setResponseHandler(function(reply){
			//The answers have been consumed.
			self.m_answers = null;
			//Store off the reply information (used to refresh the view)
			self.setReplyData(reply);
			//Refresh the view
			self.refresh();
		});
	//Only pass the user option responses if there are answers.
	if(userOptionResponses) {
		openStructureRequest.setDataBlob(userOptionResponses);
	}
	openStructureRequest.performRequest();
};

/**
 * Makes the call to mp_get_structured_template. This scenario occurs when loading structured documentation for the
 * first time, or there has been no structured documentation activity for the component.
 */
StructureDocumentationView.prototype.queryTemplate = function() {
	var component = this.m_component;
	var criterion = component.getCriterion();
	var userOptionResponses = (this.m_answers && this.m_answers.length) ? '{ "user_option_responses" : { "options": '+this.m_answers + '} }' : null;
	var self = this;
	var parameterArray = [
		"^MINE^",
		criterion.person_id + ".0",
		criterion.encntr_id + ".0",
		criterion.position_cd + ".0",
		criterion.ppr_cd + ".0",
		"^" + component.getConceptCKI() + "^",
		criterion.provider_id + ".0"
	];
	var getStructureTemplateRequest = new ScriptRequest()
		.setProgramName("mp_get_structured_template")
		.setParameterArray(parameterArray)
		.setResponseHandler(function(reply){
			//The ansers (if any) have been consumed.
			self.m_answers = null;
			//Store off the reply information (used to refresh the view)
			self.setReplyData(reply);
			//Refresh the view
			self.refresh();
		});
	if(userOptionResponses) {
		getStructureTemplateRequest.setDataBlob(userOptionResponses);
	}
	getStructureTemplateRequest.performRequest();
};

/**
 * Refreshes the view based on the response from mp_get_structured_template or mp_open_structured_section.
 */
StructureDocumentationView.prototype.refresh = function() {
	if(this.m_status !== "S") {
		this.m_$structureContainer.hide();
		this.m_$questionContainer.hide();
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_DOC_UNAVAILABLE);
		return;
	}
	//If questions were present in the reply data, show the questions, otherwise try to show structure
	if(this.hasQuestions()) {
		this.m_$structureContainer.hide();
		this.m_$messageContainer.hide();
		this.showQuestions();
	} else if(this.hasStructuredContent()) {
		this.m_$questionContainer.hide();
		this.m_$messageContainer.hide();
		this.showStructure();
		this.handleMergeActivity();
		this.finalizeStructure();
		this.m_component.resizeComponent();
	} else {
		//Hide both the structure and question containers since there was some sort of error
		this.m_$structureContainer.hide();
		this.m_$questionContainer.hide();
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_TEMPLATES_NOT_FOUND);
	}
};

/**
 * Show the list of questions. It first generates the question objects based on the m_questionData that was returned
 * by either mp_get_structured_template or mp_open_structured_section. The questions are then rendered into the question
 * container and the "Add Template(s)" button is disabled to start with.
 */
StructureDocumentationView.prototype.showQuestions = function() {
	var $questionContainer = this.m_$questionContainer;
	//Generate the question set
	var questionSet = this.generateQuestionSet();
	this.m_$questionContents.html(questionSet.render());
	this.getAddTemplateButton().prop("disabled", true);
	$questionContainer.show();
};

/**
 * Stores off the reply information retrieved from either the query or open existing.
 * @param {ScriptReply} reply - The script reply object returned from a call to
 * mp_get_structured_template or mp_open_structured_section.
 */
StructureDocumentationView.prototype.setReplyData = function(reply) {
	this.m_replyData = reply;
	var response = reply.getResponse();
	var status = reply.getStatus();
	var replyJSON = JSON.parse(response.REPLY_JSON);
	this.setStatus(status || "F");
	this.setStructureData(replyJSON.section_ref || null);
	this.setActivityData(replyJSON.section_act || null);
	if(replyJSON.user_options) {
		var userOptionsJSON = replyJSON.user_options;
		var questionData = userOptionsJSON.length ? userOptionsJSON : null;
		this.setQuestionData(questionData);
	}
};

/**
 * Resets the data received from the structured documentation services.
 */
StructureDocumentationView.prototype.resetReplyData = function() {
	this.m_replyData = null;
	this.m_structureData = null;
	this.m_activityData = null;
	this.m_questionData = null;
};

/**
 * Shows the structured documentation contents.
 */
StructureDocumentationView.prototype.showStructure = function() {
	this.m_$structureContainer.show();
	var component = this.m_component;
	var $structureContainer = this.m_$structureOrganizerContents;
	var structureData = this.m_structureData;
	var docI18N = i18n.discernabu.documentation_base;
	//If there is no structured content, inform that no templates were found
	if (!structureData || !structureData.length) {
		$structureContainer.append(docI18N.STRUCTURED_TEMPLATES_NOT_FOUND);
		return;
	}
	structureData = structureData[0];
	var builder = new JSONStructureOrganizerBuilder();
	builder.setNamespace(component.getStyles().getId());
	builder.setStructureJSON(structureData);
	var organizer = builder.buildStructureTree();
	this.m_structureOrganizer = organizer;
	this.m_saveButton = null;
	//Append the organizer html
	$structureContainer.html(organizer.renderHtml());
};

/**
 * Finalizes the structure view.
 */
StructureDocumentationView.prototype.finalizeStructure = function() {
	var organizer = this.m_structureOrganizer;
	var self = this;
	if(!organizer) {
		return;
	}
	//Provide a custom resize function for the structure organizer.
	organizer.setResizeFunction(function(elements) {
		//Height of the component content body decided by the framework. (Subtract 2 for border).
		var maxHeightInPx = parseFloat(self.m_$viewContainer.css("max-height").replace("px", "")) - 2;
		//Subtract the height of the footer.
		maxHeightInPx -= ($("#" + self.m_namespace + "StructureFooter")[0].offsetHeight);
		//Subtract the height of the tabs (include the margin).
		if(organizer.m_isMultiSection) {
			maxHeightInPx -= (elements.rootElement.find(".structure-tab-parent")[0].offsetHeight);
		}
		elements.rootElement.css({"overflow-y": "hidden"});
		elements.rootElement.find(".structure-navigator-panel").height((maxHeightInPx) + "px");
		elements.rootElement.find(".structure-navigator").css({
			"max-height": (maxHeightInPx - 34) + "px",
			"overflow-y": "auto"
		});
		elements.rootElement.find(".structure-body").css({"max-height": (maxHeightInPx) + "px"});
		//If this is a multi-section structure, each section must adjust it's content height element.
		if(organizer.m_isMultiSection && organizer.getActiveSection()) {
			organizer.getActiveSection().adjustContentHeight();
		}
		//Otherwise simply adjust the single-section.
		else {
			organizer.adjustContentHeight();
		}
	});
	//Set the callback function for when the organizer dirty state changes...
	organizer.setOnDirtyChangeCallback(function(isDirty) {
		self.getSaveButtonElement().prop("disabled", !isDirty);
		if (isDirty) {
			self.m_component.setDirty();
		}
		else {
			self.m_component.resetDirty();
		}
	});
	organizer.finalize();
	//Attach the interaction controllers.
	(new CycleStructureTermController()).attach(organizer);
	(new InputStructureTermController()).attach(organizer);
	(new StructureGroupController()).attach(organizer);
	(new YesNoStructureTermController()).attach(organizer);
	(new StructureTermGroupController()).attach(organizer);
	(new TableTermController()).attach(organizer);
	//Only attach the tab controller if it is a multi-section structure.
	if(organizer.isMultiSection()) {
		var tabController = new StructureTabController();
		tabController.attach(organizer);
		//Keep reference to the tab controller since it requires some resize logic later.
		this.m_tabController = tabController;
	}
};

/**
 * Render the structured documentation view into the specified element.
 * @param {jQuery} element - The jQuery element to render the structured documentation view into.
 */
StructureDocumentationView.prototype.renderInto = function(element) {
	element.append(this.render());
	this.handleMergeActivity();
	this.finalize();
};

/**
 * Use the activity data (if any) and update structured documentation with the activity.
 */
StructureDocumentationView.prototype.handleMergeActivity = function() {
	if(!this.m_structureOrganizer || !this.m_activityData) {
		return;
	}
	var updater = new JSONStructureOrganizerBuilder();
	updater.update(this.getOrganizer(), this.m_activityData);
	this.resetDirty();
};

/**
 * Renders the given section JSON into the view.
 *	<div id="x" class="structured-documentation-view">
 * 		<div id="namespaceQuestionContainer">
 *			<button id="namespaceAddTemplateButton" class="structure-add-template-btn">Add Template(s)</button>
 *			<div id="namespaceQuestionContents" class="structure-question-contents"> ... </div>
 *		</div>
 *		<div id="namespaceStructureContainer">
 *			<div id="namespaceStructureOrganizerContents"></div>
 *			<div id="namespaceFooter" class="structure-organizer-footer">
 *			    <span class="structure-last-saved-text">&nbsp;</span>
 *			    <button id="namespaceSaveButton" class="structure-save-button">Save</button>
 *			</div>
 *		</div>
 *	</div>
 * @returns {String} - The rendered HTML of the JSON
 */
StructureDocumentationView.prototype.render = function() {
	this.m_rendered = true;
	var docI18N = i18n.discernabu.documentation_base;
	var reply = this.m_replyData;
	var status = reply.getStatus();
	var self = this;
	var namespace = this.m_namespace;
	var id = this.m_id;

	//Always create at least the view wrapper.
	var $structureView = $("<div id='" + namespace + ":" + this.getId() +"' class='structured-documentation-view content-body'>");
	//Store off view and data to use later
	this.setViewContainer($structureView);

	//Create the container that will house structure template questions (if any).
	var $questionContainer = $("<div id='" + namespace + "QuestionContainer' class='structure-question-container'></div>").hide();
	this.setQuestionContainer($questionContainer);

	//Create the add template button.
	var $addTemplateButton = $("<button id='" + namespace + "AddTemplateButton' class='structure-add-template-btn' disabled>Add Template(s)</button>");
	$addTemplateButton.click(function(){
		self.onAddTemplateClick();
	});
	this.setAddTemplateButton($addTemplateButton);
	$questionContainer.append($addTemplateButton);

	//Add the blue info icon.
	var $infoIcon = $("<div class='structure-question-info-icon'></div>");
	$questionContainer.append($infoIcon);

	//Add the container where the actual question contents will be rendered.
	var $questionContents = $("<div id='" + namespace + "QuestionContents' class='structure-question-contents'></div>");
	$questionContainer.append($questionContents);
	this.setQuestionContents($questionContents);

	//Append the questions container into the structure view.
	$structureView.append($questionContainer);

	//The structure content container, structure content is injected here.
	var $structureContainer = $("<div id='" + namespace + "StructureContainer'></div>").hide();
	$structureView.append($structureContainer);
	this.setStructureContainer($structureContainer);

	//Organizer contents
	var $structureOrganizerContents = $("<div id='" + namespace + "StructureOrganizerContents'></div>");
	$structureContainer.append($structureOrganizerContents);
	this.setStructureOrganizerContents($structureOrganizerContents);
	$structureContainer.append(
		"<div id='" + namespace + "StructureFooter' class='structure-organizer-footer'>"+
			"<span class='structure-last-saved-text'>&nbsp</span>" +
			"<button id='" + namespace + "StructureSaveButton' disabled class='structure-save-button'>" + docI18N.STRUCTURED_SAVE + "</button>" +
		"</div>"
	);
	var $messageContainer = $("<div id='" + namespace + "StructureMessageContainer'></div>").hide();
	$structureView.append($messageContainer);
	this.setMessageContainer($messageContainer);
	//Handle a failure status
	if(status !== "S") {
		this.showStructureErrorMessage(docI18N.STRUCTURED_DOC_UNAVAILABLE);
		return $structureView;
	}
	//If there are questions when loading structure, display those before showing structure.
	if(this.hasQuestions()) {
		this.showQuestions();
	} else if(this.hasStructuredContent()) {
		this.showStructure();
	} else {
		this.showStructureErrorMessage(docI18N.STRUCTURED_TEMPLATES_NOT_FOUND);
	}
	return $structureView;
};

/**
 * Helper function to show an error message in the structured documentation view.
 * @param {string} message - The message to be displayed.
 */
StructureDocumentationView.prototype.showStructureErrorMessage = function(message) {
	this.m_$messageContainer.html(message);
	this.m_$messageContainer.show();
};

/**
 * Resizes the structure documentation view by also calling resize on the organizer.
 * @returns {undefined} undefined
 */
StructureDocumentationView.prototype.resize = function() {
	if (this.m_structureOrganizer) {
		this.m_structureOrganizer.resize();
	}
	//The tab controller has some specific resize logic.
	if(this.m_tabController) {
		this.m_tabController.resize();
	}
};

/**
 * Provide a convenient way to reset the dirtiness of the view and everything inside of it.
 */
StructureDocumentationView.prototype.resetDirty = function() {
	this.getSaveButtonElement().prop("disabled", true);
	this.m_structureOrganizer.resetDirty();
};

/**
 * Checks to see if the view is dirty.
 * @returns true, if the view is dirty.
 */
StructureDocumentationView.prototype.isDirty = function() {
	// if the organizer is dirty, the view is dirty.
	return this.m_structureOrganizer ? this.m_structureOrganizer.checkIsDirty() : false;
};


/**
 * Perform finalization on the StructureDocumentationView. This attaches necessary events which must be done
 * post-render.
 */
StructureDocumentationView.prototype.finalize = function() {
	var self = this;
	//Make the call to attach necessary events for structure.
	this.finalizeStructure();
	//Attach the click event to the save button
	this.getSaveButtonElement().click(function() {
		// call save with a call back function to reset dirty when the save is successful
		self.m_component.save(function(status) {
			if (status === "S") {
				self.resetDirty();
			}
		});
	});
	//Make the call to attach events for question functionality.
	this.finalizeQuestions();
};

/**
 * Finalizes the questions, attaching necessary delegates.
 */
StructureDocumentationView.prototype.finalizeQuestions = function() {
	var self = this;
	//Attach the delegate for answering questions.
	this.m_$questionContainer.on("change", ".structure-answer-box", function(event){
		var nodeId = $(this).attr("data-lookup");
		var node = self.m_questionSet.getLookup()[nodeId];
		if(!node) {
			logger.logWarning("StructureDocumentationView.prototype.finalizeQuestions: could not find answer node with id = " + nodeId);
			return;
		}
		node.cycleState();
	});
	//Attach a delegate for clicking on the answer display which will trigger the click event on the checkbox.
	this.m_$questionContainer.on("click", ".structure-answer-display", function(event){
		var nodeId = $(this).attr("data-lookup");
		var node = self.m_questionSet.getLookup()[nodeId];
		if(!node) {
			logger.logWarning("StructureDocumentationView.prototype.finalizeQuestions: could not find answer node with id = " + nodeId);
			return;
		}
		node.cycleState();
		//Now ensure that the checkbox is updated according to the state of the answer.
		$(this).siblings(".structure-answer-box").prop("checked", (node.getState().getValue() ? true : false));
	});
};

/**
 * Overrides the base DocumentationView.prototype.show function. If the navigator has an active navigation item
 * the onSelect method is performed. This ensures that switching between the freetext and structured views will not
 * change the user's scroll position in the structured content.
 */
StructureDocumentationView.prototype.show = function() {
	DocumentationView.prototype.show.call(this);
};

/**
 * Attempts to restore the users's navigation to the last selected navigation item that they chose.
 */
StructureDocumentationView.prototype.restoreNavigation = function() {
	var organizer = this.m_structureOrganizer;
	var activeSection = null;
	var activeNavigation = null;
	var navigator = null;
	var tabController = null;
	var $activeTab = null;
	var $structureTabWrapper = null;
	var miscPadding = 8;
	var tabPosition = 0;
	if (!organizer) {
		return;
	}
	if(organizer.isMultiSection()) {
		tabController = this.m_tabController;
		activeSection = organizer.getActiveSection();
		navigator = activeSection.getNavigator();

		//Switching views can cause the scroll position to reset, so we must attempt to restore it.
		if(tabController) {
			$activeTab = tabController.getStructureTabGroup().find(".structure-tab-active").closest(".structure-tab");
			$structureTabWrapper = tabController.getStructureTabWrapper();

			tabPosition = $activeTab.position().left + $structureTabWrapper.scrollLeft();
			$structureTabWrapper.scrollLeft(tabPosition - miscPadding);
		}
	} else {
		navigator = organizer.getNavigator();
	}
	if(!navigator) {
		return;
	}
	activeNavigation = navigator.getActiveNavigation();
	if(!activeNavigation) {
		return;
	}
	activeNavigation.onSelect();
};
/**
 * Create the documentation base component style object
 * @constructor
 */
function DocumentationBaseComponentStyle() {
	this.initByNamespace("documentation");
}
DocumentationBaseComponentStyle.prototype = new ComponentStyle();
DocumentationBaseComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The documentation component will instantiate an editor
 * The component load process is as follows:
 * preProcessing -> retrieveComponentData -> checkIfDynamicDocumentationAvailable -> initializeWorkflowInformation ->
 * (wait for resource...) -> processWorkflowInformation -> getDocumentation -> (wait for response...) -> handleSuccess
 * -> render default view.
 * @constructor
 * @param {Criterion} criterion - The component criterion.
 */
function DocumentationBaseComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new DocumentationBaseComponentStyle());
	this.m_documentationTimerName = "MPG.DOCUMENTATION_BASE.O1";
	this.setComponentLoadTimerName("USR:" + this.m_documentationTimerName + " - load component");
	this.setComponentRenderTimerName("ENG:" + this.m_documentationTimerName + " - render component");
	this.setIncludeLineNumber(false);
	this.setRefreshEnabled(false);

	this.m_loadTimer = null;
	this.m_workflowId = 0;
	this.m_conceptType = '';
	this.m_conceptCKI = '';
	this.m_eventId = 0;
	this.m_docContent = '';
	this.m_docVersion = 0;
	this.m_editorInstance = null;
	this.m_placeholderText = '';

	this.m_isDynDocAvailable = false;

	//Disable structured documentation by default
	this.m_enableStructuredDoc = false;

	//Disable hover by default
	this.m_hoverEnabled = false;
	this.m_emrEnabled = false;

	this.m_freetextView = null;
	this.m_structureView = null;
	this.m_defaultView = null;
	this.m_currentView = null;
	this.m_isLoadingStructured = false;
	this.setScope(2);
	this.m_preEMRIsEditorCheck = false;
	this.setContextualViewCompatible(true);
}

DocumentationBaseComponent.prototype = new MPageComponent();
DocumentationBaseComponent.prototype.constructor = MPageComponent;

/**
 * Enumeration for the Documentation Views.
 * 0 = Freetext View
 * 1 = Structure View
 * @type {{FREETEXT: number, STRUCTURE: number}}
 */
DocumentationBaseComponent.VIEWS = {
	"FREETEXT": 0,
	"STRUCTURE": 1
};

/**
 * Gets the concept CKI for this documentation component.
 * @returns {String} The concept CKI for this documentation component.
 */
DocumentationBaseComponent.prototype.getConceptCKI = function () {
	return this.m_conceptCKI;
};

/**
 * Sets the concept CKI for this documentation component.
 * @param {String} conceptCKI - The concept CKI for this documentation component.
 */
DocumentationBaseComponent.prototype.setConceptCKI = function (conceptCKI) {
	this.m_conceptCKI = conceptCKI;
};

/**
 * Gets the concept type meaning string for this documentation component.
 * @returns {String} The concept type meaning string for this documentation component.
 */
DocumentationBaseComponent.prototype.getConceptType = function () {
	return this.m_conceptType;
};

/**
 * Sets the concept type meaning string for this documentation component.
 * @param {String} conceptType - The concept type meaning string for this documentation component.
 */
DocumentationBaseComponent.prototype.setConceptType = function (conceptType) {
	this.m_conceptType = conceptType;
};

/**
 * Marks this component as dirty.
 */
DocumentationBaseComponent.prototype.setDirty = function () {
	this.checkPendingSR(true);
};

/**
 * Clears the framework level dirty flag for this component.
 */
DocumentationBaseComponent.prototype.resetDirty = function () {
	this.checkPendingSR(false);
};

/**
 * Gets documentation content.
 * @returns {String} The documentation content.
 */
DocumentationBaseComponent.prototype.getDocumentationContent = function () {
	return this.m_docContent;
};

/**
 * Sets documentation content.
 * @param {String} content - The documentation content.
 */
DocumentationBaseComponent.prototype.setDocumentationContent = function (content) {
	this.m_docContent = content;
};

/**
 * Gets the Documentation component timer name.
 * e.g. the "MPG.DOCUMENTATION_BASE.O1" portion of "ENG:MPG.DOCUMENTATION_BASE.O1".
 * @returns {String} The prefix portion of the documentation timer name.
 */
DocumentationBaseComponent.prototype.getDocumentationTimerName = function () {
	return this.m_documentationTimerName;
};

/**
 * Sets Documentation component timer name.
 * e.g. the "MPG.DOCUMENTATION_BASE.O1" portion of "ENG:MPG.DOCUMENTATION_BASE.O1".
 * @param {String} timerName - The prefix portion of the documentation timer name.
 */
DocumentationBaseComponent.prototype.setDocumentationTimerName = function (timerName) {
	this.m_documentationTimerName = timerName;
};

/**
 * Gets the documentation version.
 * @returns {Number} The documentation version.
 */
DocumentationBaseComponent.prototype.getDocumentationVersion = function () {
	return this.m_docVersion;
};

/**
 * Sets documentation version.
 * @param {Number} version - The documentation version.
 */
DocumentationBaseComponent.prototype.setDocumentationVersion = function (version) {
	this.m_docVersion = version;
};

/**
 * Gets the editor instance for this documentation component.
 * @returns {CKEDITOR.editor} A CKEditor instance.
 */
DocumentationBaseComponent.prototype.getEditorInstance = function () {
	return this.m_editorInstance;
};

/**
 * Sets the editor instance for this documentation component.
 * @param {CKEDITOR.editor} editorInstance - A CKEditor instance.
 */
DocumentationBaseComponent.prototype.setEditorInstance = function (editorInstance) {
	this.m_editorInstance = editorInstance;
};

/**
 * Gets the clinical event id associated with this documentation component.
 * @returns {Number} The event id associated with this documentation component.
 */
DocumentationBaseComponent.prototype.getEventId = function () {
	return this.m_eventId;
};

/**
 * Sets the clinical event id associated with this documentation component.
 * @param {Number} eventId - The event id associated with this documentation component.
 */
DocumentationBaseComponent.prototype.setEventId = function (eventId) {
	this.m_eventId = eventId;
};

/**
 * Retrieves the freetext view of the DocumentationBaseComponent.
 * @returns {FreeTextDocumentationView} The freetext view of the DocumentationBaseComponent.
 */
DocumentationBaseComponent.prototype.getFreetextView = function () {
	return this.m_freetextView;
};

/**
 * Gets the placeholder text for this documentation component.
 * @returns {String} The placeholder text for this documentation component.
 */
DocumentationBaseComponent.prototype.getPlaceholderText = function () {
	return this.m_placeholderText;
};

/**
 * Sets the placeholder text.
 * @param {String} text - The placeholder text.
 */
DocumentationBaseComponent.prototype.setPlaceholderText = function (text) {
	this.m_placeholderText = text;
};
/**
 * Returns whether or not the hover plugin is enabled for the component
 * @returns {Boolena} True iff component is hover enabled
 */
DocumentationBaseComponent.prototype.getHoverEnabled = function () {
	return this.m_hoverEnabled;
};

/**
 * Sets whether on not EMR content will be loaded and refreshed in component
 * @param {Boolean} enabled Whether EMR content is enabled for component
 */
DocumentationBaseComponent.prototype.setEmrEnabled = function(enabled) {
	this.m_emrEnabled = enabled;
};

/**
 * Returns whether or not EMR content is enabled/refreshed within the component
 * @return {Boolean} True iff EMR content is enabled
 */
DocumentationBaseComponent.prototype.isEmrEnabled = function(){
	return this.m_emrEnabled;
};

/**
 * Sets whether hover plugin is enabled for component
 * @param {Boolean} value - Whether hover plugin is enabled
 */
DocumentationBaseComponent.prototype.setHoverEnabled = function (value) {
	this.m_hoverEnabled = value;
};

/**
 * Retrieves the element associated with the save button.
 * @return {jQuery} jQuery element associated with save button
 */
DocumentationBaseComponent.prototype.getSaveButton = function(){
	var editor = this.getEditorInstance();
	return $('#' + editor.container.$.id + ' button.autosave.save');
};

/**
 * Enables the save button
 * @return {jQuery} jQuery element associated with save button
 */
DocumentationBaseComponent.prototype.enableSaving = function(){
	return this.getSaveButton().removeAttr('disabled');
};

/**
 * Disables the save button
 * @return {jQuery} jQuery element associated with save button
 */
DocumentationBaseComponent.prototype.disableSaving = function(){
	return this.getSaveButton().attr('disabled', 'disabled');
};
/*
* Retrieves whether the editor is dirty before the EMR is updated
* @return {Boolean} value - whether the editor is dirty before the EMR update.
*/
DocumentationBaseComponent.prototype.getPreEMRIsEditorDirtyCheck = function(){
	return this.m_preEMRIsEditorCheck;
};

/*
* Sets whether the editor is dirty before the EMR is updated
*/
DocumentationBaseComponent.prototype.setPreEMRIsEditorDirtyCheck = function(value){
	this.m_preEMRIsEditorCheck = value;
};

/**
 * This function resets the Dynamic Documentation component.
 */
DocumentationBaseComponent.prototype.reset = function() {
	var editor = this.getEditorInstance();
	if (editor) {
		editor.destroy();
	}
	// clean up structured view
	var structuredView = this.getStructuredView();
	if (structuredView) {
		structuredView.setOrganizer(null);
		structuredView.setIsRendered(false);
	}

	//Clean up freetext view
	this.m_freetextView = new FreeTextDocumentationView();
	this.m_freetextView.setNamespace(this.getStyles().getId()).setId("freetextView").setComponent(this);
	this.m_defaultView = this.m_freetextView;

	//Switch to free text view by calling the framework level activateHeaderToggle() method
	//It will switch to the correct header toggle along with calling the toggle handlers
	//It would be the same as if the user had clicked on the free text header toggle
	this.activateHeaderToggle(0);
};

/**
 * Override the base MPageComponent.prototype.refreshComponent function. We need to do some additional cleanup
 * before allowing the component to refresh.
 */
DocumentationBaseComponent.prototype.refreshComponent = function() {
	this.reset();
	MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * Retrieves a pre-save function. This gives an entry point before the saving process begings, allowing any pre-processing
 * of the data to take place.
 * @returns {Function} The pre-save function to be executed.
 */
DocumentationBaseComponent.prototype.getPreSaveFunction = function () {
	var self = this;
	var docI18N = i18n.discernabu.documentation_base;
	var busyHTML = ['<img src="', self.getCriterion().static_content, '/images/6439_16.gif" alt="', docI18N.SAVING, '"/>', docI18N.SAVING].join('');
	return function () {
		self.setLastSaveText(busyHTML);
		if (self.m_structureView && self.m_structureView.getOrganizer()) {
			self.enableMixedContent();
		}
	};
};

/**
 * Returns the save function to be used by the autosave plugin. For all other saving purposes, use the
 * DocumentationBaseComponent.prototype.save function.
 * @returns {Function} The function to be used by the autosave plugin.
 */
DocumentationBaseComponent.prototype.getSaveFunction = function () {
	var self = this;
	//Return a closure that contains everything it needs to perform the add/update calls
	return function (documentContent, statusCallback) {
		var structuredView = self.m_structureView;
		var organizer = structuredView.getOrganizer();
		if (structuredView && organizer && organizer.isDirty()) {
			self.saveBoth(documentContent, organizer.convertToJSON(), statusCallback);
		} else {
			self.saveFreetext(documentContent, statusCallback);
		}
	};
};

/**
 * Gets the indicator to enable/disable structured documentation.
 */
DocumentationBaseComponent.prototype.getStructuredDocInd = function () {
	return this.m_enableStructuredDoc;
};

/**
 * Sets the indicator to enable/disable structured documentation.
 */
DocumentationBaseComponent.prototype.setStructuredDocInd = function (isEnabled) {
	this.m_enableStructuredDoc = isEnabled;
};

/**
 * Retrieves the structured documentation view of the DocumentationBaseComponent.
 * @returns {StructureDocumentationView} The structured documentation view of the DocumentationBaseComponent.
 */
DocumentationBaseComponent.prototype.getStructuredView = function () {
	return this.m_structureView;
};

/**
 * Gets the workflow id for this documentation session
 */
DocumentationBaseComponent.prototype.getWorkflowId = function () {
	return this.m_workflowId;
};

/**
 * Sets the workflow id for this documentation session
 */
DocumentationBaseComponent.prototype.setWorkflowId = function (workflowId) {
	this.m_workflowId = workflowId;
};

/**
 * Sets the timezone for the given user in this documentation session
 * @param {Long} timeZone Time zone associated with user in documentation session
 */
DocumentationBaseComponent.prototype.setTimeZone = function(timeZone){
	this.m_timeZone = timeZone;
};

/**
 * Return the timezone for the given user in this documentation session
 * @return {Long} Timezone associated with user in documentation session
 */
DocumentationBaseComponent.prototype.getTimeZone = function(){
	return this.m_timeZone;
};

/**
 * Sets whether the structured content is currently being loaded
 * @param {Boolean} isLoading Whether structured content is currently being loaded
 */
DocumentationBaseComponent.prototype.setLoadingStructured = function(isLoading) {
	this.m_isLoadingStructured = isLoading;
};

/**
 * Returns whether structured content is currently being loaded
 * @return {Boolean} True iff structured content is in the process of being loaded
 */
DocumentationBaseComponent.prototype.isLoadingStructured = function() {
	return this.m_isLoadingStructured;
};

/**
 * Overrides the base preProcessing method
 */
DocumentationBaseComponent.prototype.preProcessing = function () {
	var docI18N = i18n.discernabu.documentation_base;
	//Enable toggle headers based on Bedrock settings
	if (this.getStructuredDocInd()) {
		this.setHeaderToggles([
				// Freetext button
				{
					active: "documentation-view-button documentation-view-button-active",
					inactive: "documentation-view-button",
					text: docI18N.FREETEXT_VIEW
				},
				// Structured button
				{
					active: "documentation-view-button documentation-view-button-no-left-border documentation-view-button-active",
					inactive: "documentation-view-button documentation-view-button-no-left-border",
					text: docI18N.STRUCTURE_VIEW
				}
			]
		);
	}
	//Add the two documentation views
	this.m_freetextView = new FreeTextDocumentationView();
	this.m_structureView = new StructureDocumentationView();
	this.m_freetextView.setNamespace(this.getStyles().getId()).setId("freetextView").setComponent(this);
	this.m_structureView.setNamespace(this.getStyles().getId()).setId("structureView").setComponent(this);

	//Set the default view to be the freetext view
	this.m_defaultView = this.m_freetextView;
	//Set current view to the default view
	this.m_currentView = this.m_defaultView;
};

/**
 * Override the base MPageComponent.prototype.retrieveComponentData function. In the context of the
 * DocumentationBaseComponent, this function will not retrieve component data in the standard sense. It will instead
 * make a call to checkIfDynamicDocumentationIsAvailable which begins the process of initializing the component.
 */
DocumentationBaseComponent.prototype.retrieveComponentData = function () {
	//If structure is enabled, start the toggle off as disabled to prevent rapidly switching before CKEditor is
	//initialized. That can result in a dangerous race-condition and erratic behavior.
	if (this.getStructuredDocInd()) {
		this.disableHeaderToggle(DocumentationBaseComponent.VIEWS.STRUCTURE);
	}
	//Create the load timer and start it
	this.checkIfDynamicDocumentationIsAvailable();
};

/**
 * This starts the true initialization of the DocumentationBaseComponent. This is called after some additional information
 * has been retrieved for the component, namely whether or not certain dynamic documentation services are available.
 */
DocumentationBaseComponent.prototype.beginInitialization = function () {
	var self = this;
	var docI18N = i18n.discernabu.documentation_base;
	//If Dynamic Documentation is not available, short circuit and simply finalize the component.
	if (!this.m_isDynDocAvailable) {
		this.finalizeComponent(docI18N.DYN_DOC_UNAVAILABLE, "");
		return;
	}
	//Subscribe to the Dyn Doc refresh broadcast message and reset the component when this occurs.
	BroadcastDispatcher.subscribe(BroadcastDispatcher.DYN_DOC_REFRESH, function (payload) {
		self.reset();
		self.refreshWorkflowInformation();
	});
	//Get the workflow data
	this.initializeWorkflowInformation();
};

/**
 * Performs the initialization of the workflow information.
 */
DocumentationBaseComponent.prototype.initializeWorkflowInformation = function () {
	var sendAr = null;
	var criterion = this.getCriterion();
	var workflowResource = MP_Resources.getSharedResource('documentationWorkflow');
	var self = this;

	//If the workflow shared resource already exists.
	if (workflowResource) {
		//Attach a listener to listen for future modifications (updates) to the shared resource.
		CERN_EventListener.addListener(this, 'documentationWorkflowAvailable', function (event, dataString) {
			self.processWorkflowInformation(event, dataString);
		}, this);

		if (workflowResource.isResourceAvailable()) {
			//At this point, the workflow data is already available, so manually call the handler immediately.
			this.processWorkflowInformation(null, workflowResource.getResourceData());
		} else {
			//At this point, this component is not the first to request the shared resource since it already exists.
			//It is likely that the data is already being retrieved. Simply attempt to retrieve the data, if it
			//has not already.
			workflowResource.retrieveSharedResourceData();
		}
	} else {
		//At this point, this component is the first to request the shared resource.
		sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"];
		workflowResource = MP_Resources.createSharedResourceObj('documentationWorkflow', this, 'MP_GET_WORKFLOW', sendAr, 'documentationWorkflowAvailable');
		if (workflowResource) {
			//Attach a listener to listen for future modifications (updates) to the shared resource.
			CERN_EventListener.addListener(this, 'documentationWorkflowAvailable', function (event, dataString) {
				self.processWorkflowInformation(event, dataString);
			}, this);
			workflowResource.retrieveSharedResourceData();
		}
	}
};

/**
 * Makes the actual call to retrieve the documentation content for this component. This is the content that the
 * user actually sees within the editor.
 *
 * If saved text for current event_id exists, will retrieve saved text
 * Else if a template exists related to the current cki, will retrieve template
 * Else will return empty string as contents
 */
DocumentationBaseComponent.prototype.getDocumentation = function () {	
	var concept = this.getConceptType() ? this.getConceptType():(this.getConceptCKI() ? this.getConceptCKI():"");
	var emrEnabled = this.isEmrEnabled() ? 1 : 0; 
	if(!concept){
		throw new Error("Attempted to pass an empty string for the concept parameter of the mp_get_dyn_doc_blob_contents script");
	}
	var sendAr = ["^MINE^", this.getWorkflowId() + ".0", "^"+ concept + "^", this.getEventId()+".0", emrEnabled];
	var loadTimer = new RTMSTimer(
		"ENG:" + this.getDocumentationTimerName() + " - get workflow documentation",
		this.getCriterion().category_mean
	);
	var self = this;
	var getDocumentationRequest = new ScriptRequest().
		setProgramName("mp_get_dyn_doc_blob_contents").
		setParameterArray(sendAr).
		setLoadTimer(loadTimer).
		setResponseHandler(function (reply) {
			if (reply.getStatus() === 'S') {
				self.handleSuccess(reply.getResponse());
			} else {
				logger.logError("mp_get_dyn_doc_blob_contents failed: unable to get documentation for " + self.getStyles().getNamespace() + self.getComponentId());
				self.finalizeComponent(self.generateScriptFailureHTML(), "");
				if (self.m_loadTimer) {
					self.m_loadTimer.fail();
					self.m_loadTimer = null;
				}
			}
		});
	getDocumentationRequest.performRequest();
};

/**
 * Overrides the base MPageComponent.prototype.renderComponent function.
 * @param {Object} recordData - The record data which contains the documentation content.
 */
DocumentationBaseComponent.prototype.renderComponent = function (recordData) {
	var content = null;
	var version = 0;
	var html = null;

	//Create and start render timer
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	renderTimer.start();

	try {
		content = ((recordData && recordData.BLOB_CONTENTS) ? recordData.BLOB_CONTENTS : '');
		version = ((recordData && recordData.BLOB_VERSION) ? recordData.BLOB_VERSION : 0);

		//remove any extra information from content outside the <body> tags
		var contentLowerCase = content.toLowerCase();
		var indexContentHTML = contentLowerCase.indexOf("<body>");
		var indexEndContentHTML = contentLowerCase.indexOf("</body>");
		var modContentBodyHTML = content.substring((indexContentHTML + 6), indexEndContentHTML);

		// convert html from div mode to paragraph mode
		content = modContentBodyHTML.replace(/[\n\r]/g, "");

		html = ['<div class="documentation-content">', content, '</div>'];

		this.setDocumentationContent(content);
		this.setDocumentationVersion(version);

		this.finalizeComponent(html.join(''), "");
	}
	catch (err) {
		var errMsg = ["<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>"];
		logger.logError(errMsg.join(""));
		this.finalizeComponent(this.generateScriptFailureHTML(), "");

		//Fail the render timer due to general script failure
		if (renderTimer) {
			renderTimer.fail();
			renderTimer = null;
		}
		//Fail the load timer due to general script failure
		if (this.m_loadTimer) {
			this.m_loadTimer.fail();
			this.m_loadTimer = null;
		}
		throw (err);
	}
	finally {
		//Stop render timer due to successful render
		if (renderTimer) {
			renderTimer.stop();
			renderTimer = null;
		}
		//Stop load timer due to successful load
		if (this.m_loadTimer) {
			this.m_loadTimer.stop();
			this.m_loadTimer = null;
		}
	}
};

/**
 * Custom getUrl method that the CKEditor will use to download resources.
 * @param resource the resource to be obtained. Some logic will be performed on the
 * resource to determine if it is a valid end path. If not, the appropriate static content
 * prefix is appended.
 */
DocumentationBaseComponent.prototype.customCKEditorGetUrl = function (resource) {
	if (!CKEDITOR.basePathStaticContent) {
		CKEDITOR.basePathStaticContent = JSON.parse(m_criterionJSON).CRITERION.STATIC_CONTENT + "/ckeditor/";
	}
	// If this is not a full or absolute path.
	if (resource.indexOf(CKEDITOR.basePathStaticContent) == -1 && resource.indexOf('/') !== 0) {
		resource = CKEDITOR.basePathStaticContent + resource;
	}
	return resource;
};

/**
 * Perform the cleanup post-editor creation.
 */
DocumentationBaseComponent.prototype.postEditorCleanup = function () {
	$("#" + this.getStyles().getContentId() + " .documentation-content").remove();
	// Perform remove comments
	var editor = this.getEditorInstance();
	var editableContent = editor.editable().$;
	editor.execCommand(DDCMD_SANITIZECONTENT, editableContent);
};

/**
 * This function attempts to inject a ddfreetext contenteditable element into the editing area as required
 * by the dynamic documentation services. If the element already exists, it will do some preparation on the element.
 */
DocumentationBaseComponent.prototype.injectFreeTextElement = function () {
	var editor = this.getEditorInstance();
	var editable = editor.editable();
	var $editableArea = $(editor.editable().$);
	//Force the editor into read only, editing will be accomplished through the below freetext element
	if (!editable.isReadOnly()) {
		editable.setReadOnly(true);
	}
	//If the editor already has a freetext elements, we must alter them.
	this.prepareExistingFreetext();

	//If parent section already contains child free text field, no need to append
	if ($editableArea.children(".ddfreetext").length) {
		return;
	}

	//Create the required inner freetext element
	var freetextElement = new CKEDITOR.dom.element('div');
	freetextElement.addClass("ddfreetext ddremovable");
	freetextElement.setAttribute("dd:btnfloatingstyle", "top-right");
	freetextElement.setAttribute("contenteditable", true);

	//Move the contents (if any) into the newly created ddfreetext element.
	if (!this.isEmrEnabled()){
		editable.moveChildren(freetextElement);
	}
	editable.append(freetextElement);

	//Changes have been made to the editor DOM, so reset the dirty state.
	editor.saveEditorSnapshot();
};

/**
 * Prepares existing ddfreetext element(s) that already exist in the editor. This ensures
 * they are editable.
 */
DocumentationBaseComponent.prototype.prepareExistingFreetext = function () {
	var $freeTextElement = $(this.getEditorInstance().editable().$).find(".ddfreetext");
	$freeTextElement.attr({
		"contenteditable": true,
		"dd:btnfloatingstyle": 'top-right'
	});
	//Changes have been made to the editor DOM, so reset the dirty state.
	this.getEditorInstance().saveEditorSnapshot();
};

/**
 * Instantiates an instance of CKEditor.
 * @param {HTMLElement} element - The element to be wrapped up into an instance of CKEditor.
 */
DocumentationBaseComponent.prototype.createTextEditor = function (element) {
	var self = this;
	var criterionLocale = this.getCriterion().locale_id;
	var configObj = {};

	//Helper function to replace the component area with a CKEditor instance. The instance is stored.
	function replaceEditor() {
		return function () {
			var editorInstance = CKEDITOR.replace(element, configObj);
			self.setEditorInstance(editorInstance);
			//See if we need to set the editor to mixed mode
			editorInstance.on('instanceReady', function () {
				//Perform any cleanup once the editor has been created.
				self.postEditorCleanup();
				//If we instantiated CKEditor on top of mixed content.. the editor alters content
				//We have to reset the content
				//Set the ddfreetext areas to be editable and apply css classes to top and bottom
				if (self.hasMixedContent()) {
					editorInstance.setData(self.getDocumentationContent());
					var $freetextAreas = $(editorInstance.editable().$).find('.ddfreetext');
					$freetextAreas.attr('contenteditable', 'true');
					editorInstance.saveEditorSnapshot();
					self.enableMixedContent();
					$(editorInstance.editable().$).attr("ddactive", true);
					editorInstance.fire('updateStructuredContent');		
				} else {
					self.injectFreeTextElement();
				}
				if (self.isEmrEnabled()){
					self.updateEMRContent();
				}
				//After we have made all these changes, make sure to reset the undo stack. (undoing immediately could
				//cause severe DOM corruption).
				editorInstance.resetUndo();
				//Ensure that undo can properly go back to current state
				var cernundo = editorInstance.plugins.cernundo;
				cernundo.handleBaseSnapshot(editorInstance);
				//If structure is enabled, enable the header toggle. The toggle was disabled until the editor instance
				//was ready, at which point it is considered safe to switch views.
				if (self.getStructuredDocInd()) {
					self.enableHeaderToggle(DocumentationBaseComponent.VIEWS.STRUCTURE);
				}
			});
			editorInstance.on('structureElementClicked', function(event) {
				if (event.data) {
					self.showStructuredView(event.data);
					self.captureNavigationTimer();
				}
			});
			editorInstance.on('refreshStateChange', function(){
				if(editorInstance.refreshState === 'stable'){
					self.postEMRRefresh();
				}
				// Disable refreshing when refresh starts, enable after ending
				self.updateSaveButton();
			});
			editorInstance.on('refreshEmrFail', function(event) {
				//Display error message if emr refresh fails
				self.displayEMRError();
			});
			editorInstance.on('afterddremovesection', function(){
				//Update styling after removing sections
				self.handleEmptySections();
			});

		};
	}

	//Validate the element being passed in and ensure the nodeType is 1 (element node)
	if (!element || (typeof element.nodeType === 'undefined') || element.nodeType !== 1) {
		return;
	}

	if ((typeof CKEDITOR !== 'undefined') && CKEDITOR) {
		//Convert local to lowercase and then set language
		criterionLocale = criterionLocale.toLowerCase();
		criterionLocale = {
			"fr_fr": "fr",
			"en_us": "en",
			"es_es": "es",
			"de_de": "de",
			"en_gb": "en-gb",
			"pt_br": "pt-br",
			"en_au": "en-au"
		}[criterionLocale] || "en";
		configObj.language = criterionLocale;
		// ensure that the editor starts without focus, to prevent the page from jumping
		configObj.startupFocus = false;

		//Remove the hover from the title attribute on the editor
		configObj.title = "";

		//Provide the saving functions
		configObj.preSaveFunction = this.getPreSaveFunction();
		configObj.autosaveFunction = this.getSaveFunction();

		configObj.setDirtyFunction = function (component) {
			return function () {
				component.setDirty();
			};
		}(this);

		configObj.resetDirtyFunction = function (component) {
			return function () {
				component.resetDirty();
			};
		}(this);

		configObj.canSaveFunction = function(component){
			return function(){
				return component.canSave();
			};
		}(this);

		//Store whether or not structure is enabled for this editor.
		configObj.structuredDocumentationEnabled = this.getStructuredDocInd() ? true : false;

		configObj.placeholderText = this.getPlaceholderText();
		configObj.hoverEnabled = this.getHoverEnabled();
		configObj.emrEnabled = this.isEmrEnabled();
		//Fill available height.  Uses default height (200px) if not found.
		configObj.cernGrow_maxHeight = this.getAvailableComponentHeight() || 200;

		//Allow for customized editor configuration if needed by component
		self.customizeEditorConfiguration(configObj);

		//Prevent ckeditor from loading any additional configs, by setting the it to empty string
		CKEDITOR.config.customConfig = '';

		//If the custom url method has not yet been set for the CKEditor object, set it.
		if (CKEDITOR.getUrl !== self.customCKEditorGetUrl) {
			//Overwrite the getUrl function for CKEditor so it will correctly point to the static content location
			CKEDITOR.getUrl = self.customCKEditorGetUrl;
		}
		//Make the initialization call. The first component to make this call will download the plugin.js file
		//for the mpage-master-plugin file. This file contains all the necessary plugins. Once initialized,
		//The callback is hit and the component creates an instance of CKEditor.
		CKEDITOR.plugins.initializePlugins(configObj, replaceEditor());
	}
};

/**
 * Customize the configuration of the current editor.  To be implemented by subclass. 
 * @param {Object} config - The configuration object utilized to configure the instance of CKEditor.editor utilized by the component
 * @returns {Object} returns the configuration object passed in after customizations have been made
 */
DocumentationBaseComponent.prototype.customizeEditorConfiguration = function(config){
	//To be overwritten by components with custom configuration
	return config;
};

/**
 * This function is used to capture the cap timer of the item navigates to structure view.
 */
DocumentationBaseComponent.prototype.captureNavigationTimer = function() {	
	var capTimer = new CapabilityTimer("CAP:MPG Structured Documentation - Navigate To Structured Element", this.getCriterion().category_mean);
	capTimer.addMetaData("rtms.legacy.metadata.1", this.m_reportMean);
	capTimer.capture();	
};

/**
 * Enables a mix of readonly and editable content on the editor.
 * It sets the editable area to be read only, creates editable free text areas (above and below), and
 * if applicable will wrap existing freetext in the upper free text area.
 */
DocumentationBaseComponent.prototype.enableMixedContent = function () {
	var editor = this.getEditorInstance();
	var editable = editor.editable();
	var $editingArea = $(editable.$);

	if (!editable.isReadOnly()) {
		editable.setReadOnly(true);
	}
	var wasDirty = editor.isEditorDirty();
	var $freeTextAreas = $editingArea.find(".ddfreetext");
	var $structuredArea = $editingArea.find(".ddstructuredtext");
	var foundStructured = $structuredArea.length > 0;

	/*
	 * The top free text area is considered found if...
	 * 1). There is only 1 ddfreetext area and no structured content (default editor state).
	 * 2). There is more than 1 ddfreetext area.
	 * 3). There is a ddstructuredtext element and a ddfreetext previous to that element.
	 */
	var foundFreetextTop = ($freeTextAreas.length > 1 || ($structuredArea.length && ($structuredArea.prev(".ddfreetext").length > 0)) || ($freeTextAreas.length === 1 && !foundStructured));
	/*
	 * The bottom free text area is considered found if...
	 * 1). There is more than 1 ddfreetext area.
	 * 2). There is a ddstructuredtext element and a ddfreetext after it.
	 */
	var foundFreetextBottom = $freeTextAreas.length > 1  || ($structuredArea.length && ($structuredArea.next(".ddfreetext").length > 0));

	var children;
	var freetextTopHtml = "<div class='ddfreetext ddremoveable' contenteditable='true' dd:btnfloatingstyle='top-right'></div>";
	//If a top free text element is needed, make sure to insert it as the first element in the editable area.
	if (!foundFreetextTop) {
		children = $editingArea.children();
		if (children.length) {
			$editingArea.children().first().before(freetextTopHtml);
		} else {
			$editingArea.append(freetextTopHtml);
		}
	}
	if (!foundStructured) {
		$editingArea.find(".ddfreetext:first").after('<div class="ddstructuredtext"></div>');
	}
	//If a bottom free text element is needed, simply append it as the last element in the editor.
	if (!foundFreetextBottom) {
		$editingArea.append(
			"<div class='ddfreetext ddremoveable' contenteditable='true' dd:btnfloatingstyle='top-right'></div>"
		);
	}

	//Reset dirty due to content change made by us
	if (!wasDirty) {
		editor.saveEditorSnapshot();
	}
	editor.resetUndo();
};

/**
 * Checks to see if the content is mixed.
 * If there exists an element with the ddstructured class then we can reasonably assume that mixed content should
 * be enabled. We can also assume mixed content is present if there is more than one ddfreetext area within the editor.
 * This scenario can occur if you have saved top/bottom freetext and subsequently un-document the structured
 * content.
 * @return {Boolean} True if the editor has mix content.
 */
DocumentationBaseComponent.prototype.hasMixedContent = function () {
	var editor = this.getEditorInstance();
	if (editor === null) {
		return false;
	}
	var $editableContainer = $(editor.editable().$);
	return $editableContainer.find('.ddstructuredtext').length > 0;
};

/**
 * Updates the read only content area in the editor to the provided html.
 *
 * If a read only region doesn't exist, it is created, and an editable region is also created below the read only region.
 *
 * Assumes that the editor is already in mixed content mode, expecting the editor to already have the following layout:
 * <div class="ddfreetext ddremoveable" dd:btnfloatingstyle="top-right">  [HTML Body Content BEFORE the structure output]  </div>
 * <div class="ddstructuredtext">  [HTML output from structured text generation]  </div>
 * <div class="ddfreetext ddremoveable" dd:btnfloatingstyle="top-right">  [HTML Body Content AFTER the structure output]  </div>
 */
DocumentationBaseComponent.prototype.updateReadOnlyContent = function (html) {
	var editor = this.getEditorInstance();
	var editable = editor.editable();
	var $editingArea = $(editable.$);

	var $readonlyElement = $editingArea.find('.ddstructuredtext');

	// let the browser parse the html and we will retrieve the generated structure text portion
	var tempContainer = document.createElement('div');
	tempContainer.innerHTML = html;
	var $structuredText = $(tempContainer).find('.ddstructuredtext');

	//If there's no structured text in the provided html then there is no reason to update the readonly content. It
	//may be necessary to erase any existing readonly content.
	if ($structuredText.length === 0) {
		//Clear out the structured text in the readonly element
		$readonlyElement.html('');
		return;
	}

	//If readonly area doesn't exist, create it
	var ckeditorElement;
	if (!$readonlyElement.length) {
		//The generated text already has ddstructuredtext wrapper
		editable.appendHtml($structuredText[0].outerHTML);

		//Create editable area underneath the read only area
		ckeditorElement = new CKEDITOR.dom.element('div');
		ckeditorElement.addClass('ddfreetext ddremoveable bottom');
		ckeditorElement.setAttribute("id", this.getStyles().getId() + "ddFreeTextBottom");
		ckeditorElement.setAttribute('contenteditable', true);
		ckeditorElement.setHtml("<div></div>");
		editable.append(ckeditorElement);
	} else {
		$readonlyElement[0].innerHTML = $structuredText.html();
	}
	
	// Highlight the selected structured elements in the freetext view.
	$(editor.editable().$).attr("ddactive", true);
	editor.fire('updateStructuredContent');
};

/**
 * Initializes the pendingDataSR shared resource if it has not already been initialized.
 */
DocumentationBaseComponent.prototype.initPendingSR = function () {
	var srObj = null;
	var dataObj = {};
	var pendingSR = MP_Resources.getSharedResource("pendingDataSR");
	if (!pendingSR) {
		srObj = new SharedResource("pendingDataSR");
		//Create the object that will be stored in the SharedResource
		dataObj.pendingDataObj = CERN_Platform.getDiscernObject("PVFRAMEWORKLINK");
		dataObj.pendingDataCompArr = [];
		//Set the available flag to true
		srObj.setIsAvailable(true);
		//Set the shared resource data object
		srObj.setResourceData(dataObj);
		//Add the shared resource so other components can access it
		MP_Resources.addSharedResource("pendingDataSR", srObj);
	} else { //The shared resource exists
		dataObj = pendingSR.getResourceData();
		var idx = dataObj.pendingDataCompArr.length;
		//Since the shared resource exists ONLY remove the current component from pending Array as other components may contain pending data.
		while (idx--) {
			//From testing JS wants to convert the componentID to string when added to the pendingDataCompArr.  DON'T change to '==='.
			if (this.getComponentId() == dataObj.pendingDataCompArr[idx]) {
				dataObj.pendingDataCompArr.splice(idx, 1);
				break;
			}
		}
		//Update the shared resource with current data.
		MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
	}
	//If components contain pending data notify the Powerchart framework
	dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
};

/**
 * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
 * @param {Boolean} pendingInd - Whether the component is dirty or not.
 */
DocumentationBaseComponent.prototype.checkPendingSR = function (pendingInd) {
	var srObj = null;
	var dataObj = {};
	var compId = this.getComponentId();
	//Get the shared resource
	var srObj = MP_Resources.getSharedResource("pendingDataSR");

	//This could happen if we are in browser dev mode
	if (!srObj) {
		return;
	}

	//Retrieve the object from the shared resource.
	dataObj = srObj.getResourceData();
	var pendingArr = dataObj.pendingDataCompArr;
	if (pendingInd) { //Add component to the array of pending components.  Keep a distinct list of component ID's
		if (pendingArr.join("|").indexOf(compId) === -1) {
			pendingArr.push(compId);
		}
	}
	else { //The component no longer has pending data.  Remove the component id from the array.
		var idx = pendingArr.length;
		while (idx--) {
			if (compId === pendingArr[idx]) {
				pendingArr.splice(idx, 1);
				break;
			}
		}
	}
	//dataObj.pendingDataCompArr = pendingArr;
	//If there are no other components that have pending actions communicate to the PVFRAMEWORKLINK object that there is no pending components.
	dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
	//Update the SharedResource.
	MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
};

/**
 * Handles the header toggle button click. This will switch between the
 * @param {Number} index - The index of the header toggle that was clicked.
 *        0 = Freetext View, 1 = Structured View
 */
DocumentationBaseComponent.prototype.handleHeaderToggleClick = function (index) {
	if (index === DocumentationBaseComponent.VIEWS.STRUCTURE && this.m_currentView !== this.m_structureView) {
		//showStructuredView is modified to accept the param navigationData which is being send for items navigation to strucure view
		//navigationData is not required for the toggle click, so sending the navigationData as null.
		this.showStructuredView(null);
	} else if (index === DocumentationBaseComponent.VIEWS.FREETEXT && this.m_currentView !== this.m_freetextView) {
		this.showFreetextView();
	}
};

/**
 * Disables one of the documentation component's header toggle buttons.
 * @param {Number} toggleIndex - The index of the header toggle button that is to be disabled.
 */
DocumentationBaseComponent.prototype.disableHeaderToggle = function (toggleIndex) {
	var $headerToggles = $("#" + this.getStyles().getId()).find(".documentation-view-button");
	if (toggleIndex < 0 || toggleIndex >= $headerToggles.length) {
		throw new Error("Attempted to call DocumentationBaseComponent.prototype.disableHeaderToggle with an out-of-range index");
	}
	$($headerToggles[toggleIndex]).prop("disabled", true);
};

/**
 * Enables one of the documentation component's header toggle buttons.
 * @param {Number} toggleIndex - The index of the header toggle button that is to be enabled.
 */
DocumentationBaseComponent.prototype.enableHeaderToggle = function (toggleIndex) {
	var $headerToggles = $("#" + this.getStyles().getId()).find(".documentation-view-button");
	if (toggleIndex < 0 || toggleIndex >= $headerToggles.length) {
		throw new Error("Attempted to call DocumentationBaseComponent.prototype.enableHeaderToggle with an out-of-range index");
	}
	$($headerToggles[toggleIndex]).prop("disabled", false);
};

/**
 * Shows the documentation component's freetext view. If the structured documentation view is dirty when switching
 * to the freetext view, first save the content of structured documentation then switch views. Otherwise, simply
 * switch views.
 */
DocumentationBaseComponent.prototype.showFreetextView = function () {
	var component = this;
	var self = this;
	var freetextView = this.getFreetextView();
	var structuredView = this.getStructuredView();
	var editor = this.getEditorInstance();
	var structureToggleIndex = DocumentationBaseComponent.VIEWS.STRUCTURE;

	//Check if the structured view is dirty
	if (structuredView.isDirty()) {
		this.disableHeaderToggle(structureToggleIndex);
		editor.save(function (status) {
			if (status === "S") {
				//Switch views
				structuredView.hide();
				freetextView.show();
				self.m_currentView = freetextView;
				self.resizeComponent();
				//Clean up dirty flags
				structuredView.resetDirty();
			} else {
				self.activateHeaderToggle(structureToggleIndex);
			}
			self.enableHeaderToggle(structureToggleIndex);
		});
		return;
	}
	//Switch views
	structuredView.hide();
	freetextView.show();
	component.m_currentView = freetextView;
	self.resizeComponent();
};

/**
 * Shows the documentation component's structured documentation view.
 * @param {navigationData} navigationData - is to identify the element which is being clicked to navigate to structure view.
 */
DocumentationBaseComponent.prototype.showStructuredView = function (navigationData) {
	var structureView = this.m_structureView;
	var freetextView = this.m_freetextView;
	var self = this;
	var freeTextToggleIndex = DocumentationBaseComponent.VIEWS.FREETEXT;
	var organizer = null;

	/**
	 * A script response handler that updates and renders structured data.
	 * If applicable, it updates existing organizer with activity data.
	 * It will render the reference data with answers prepopulated.
	 */
	var updateAndRenderResponse = function (reply) {
		self.setLoadingStructured(false);
		var $secContentNode = $(self.getSectionContentNode());
		self.enableHeaderToggle(freeTextToggleIndex);
		freetextView.hide();
		structureView.setReplyData(reply);
		if (!structureView.isRendered()){
			structureView.renderInto($secContentNode);
		}
		self.m_currentView = structureView;
		self.resizeComponent();
		if(navigationData) {
			self.activateHeaderToggle(DocumentationBaseComponent.VIEWS.STRUCTURE);
			if(structureView.getOrganizer()) {
				structureView.getOrganizer().navigateToNode(navigationData);
			}
		}
	};

	/**
	 * Retrieve structured data (existing vs new) and update view based on response
	 * @return {undefined}
	 */
	var retrieveStructuredData = function() {
		//If mixed content is present (a .ddstructuredtext element is present) OR we find section activity
		//on the component's current event_id, we know that structure has been saved so we must open
		//an existing section.
		self.setLoadingStructured(true);
		if (self.hasMixedContent() || self.hasSectionActivity()) {
			self.openExistingStructuredSection(updateAndRenderResponse);
		} else {
			self.getStructuredTemplate(updateAndRenderResponse);
		}
	};

	// If structured is already loading return early
	if (self.isLoadingStructured()){
		return;
	}
	//Check for existence of organizer, if not, get it, build it, and render it.
	//Unless the view is already rendered (which means that strcutured doc or templates are not available)
	var editor = this.getEditorInstance();
	if (!structureView.getOrganizer() && !structureView.isRendered()) {
		//Disable the freetext header toggle until we are sure the user has been navigated to structure (prevents
		//invalid toggle/content states if the user is trying to rapidly switch).
		this.disableHeaderToggle(freeTextToggleIndex);
		//Save existing freetext before switching to structured view
		if (editor && editor.isEditorDirty()) {
			editor.save(function (status) {
				if (status === "S") {
					retrieveStructuredData();
				} else {
					//If the save failed ensure the freetext toggle button is still usable.
					self.enableHeaderToggle(freeTextToggleIndex);
					//If the save was not successful, put the header toggle state back to the freetext view, otherwise
					//it will be out of sync.
					self.activateHeaderToggle(freeTextToggleIndex);
				}
			});
		} else {
			retrieveStructuredData();
		}
		//Finished with initial rendering
		return;
	}

	//The structure organizer already exists, proceed with switching to the structure view.
	//Save if freetext is dirty, before switching view.
	if (editor.isEditorDirty()) {
		this.disableHeaderToggle(freeTextToggleIndex);
		editor.save(function (status) {
			if (status === "S") {
				structureView.show();
				self.m_freetextView.hide();
				self.m_currentView = structureView;
				self.resizeComponent();
				organizer = structureView.getOrganizer();
				if(organizer) {
					organizer.clearHighlighter();
				}
				if(navigationData) {
					self.activateHeaderToggle(DocumentationBaseComponent.VIEWS.STRUCTURE);
					if(organizer) {
						organizer.navigateToNode(navigationData);
					}
				} else {
					structureView.restoreNavigation();
				}
			} else {
				//If the save was not successful, put the header toggle state back to the freetext view, otherwise
				//it will be out of sync.
				self.activateHeaderToggle(freeTextToggleIndex);
			}
			//Always re-enable the freetext toggle button so the user can navigate.
			self.enableHeaderToggle(freeTextToggleIndex);
		});
	} else {
		structureView.show();
		this.m_freetextView.hide();
		this.m_currentView = structureView;
		this.resizeComponent();
		organizer = structureView.getOrganizer();
		if(organizer) {
			organizer.clearHighlighter();
		}
		if(navigationData) {
			self.activateHeaderToggle(DocumentationBaseComponent.VIEWS.STRUCTURE);
			if(organizer) {
				organizer.navigateToNode(navigationData);
			}
		} else {
			structureView.restoreNavigation();
		}
	}
};

/**
 * This is a failsafe function to determine if structured activity has been documented for the component.
 * @returns {boolean} Whether structured documentation has been saved for the workflow event id.
 */
DocumentationBaseComponent.prototype.hasSectionActivity = function() {
	var eventId = this.getEventId();
	var hasActivity = false;
	var activityData = null;
	var hasActivityRequest = new ScriptRequest().
		setProgramName("mp_check_sdoc_section").
		setParameterArray(["^MINE^", eventId + ".0"]).
		setAsyncIndicator(false).
		setResponseHandler(function(reply){
			//If the script is not successful, assume no activity is present.
			if(reply.getStatus() !== 'S') {
				return;
			}
			activityData = reply.getResponse();
			hasActivity = (activityData.SDOC_RESULTS && activityData.SDOC_RESULTS.length > 0);
		});
	hasActivityRequest.performRequest();
	return hasActivity;
};

/**
 * Uses the MP_GET_WORKFLOW CCL script to retrieve the workflow id and event id for the documentation component.
 * If the workflow id or the event id has changed, the documentation component is considered stale. The request
 * to MP_GET_WORKFLOW is synchronous as subsequent operations rely on the information retrieved from the request.
 * @returns {boolean} the stale status of the documentation component. True if stale, otherwise false.
 */
DocumentationBaseComponent.prototype.isStaleWorkflow = function () {
	var self = this;
	var isStale = true;
	var criterion = this.getCriterion();
	var parameterArray = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"];
	var loadTimer = new RTMSTimer(
		"ENG:" + this.getDocumentationTimerName() + " - is stale workflow",
		criterion.category_mean
	);
	var isStaleRequest = new ScriptRequest().
		setProgramName("MP_GET_WORKFLOW").
		setParameterArray(parameterArray).
		setAsyncIndicator(false).
		setLoadTimer(loadTimer).
		setResponseHandler(function (reply) {
			var data = null;
			var componentsList = null;
			var concept = self.getConceptType();
			var conceptCKI = self.getConceptCKI();
			var i = 0;
			var componentRef = null;
			if (reply.getStatus() === 'S') {
				data = reply.getResponse();
				//Workflow data was found
				if (data) {
					//If the workflow id does not match the current workflow id, consider it stale.
					if (data.WORKFLOW_ID !== self.getWorkflowId()) {
						return;
					}
					componentsList = data.COMPONENTS;
					for (i = componentsList.length; i--;) {
						componentRef = componentsList[i];
						var componentConceptCKI = componentRef.CONCEPT_CKI;
						//Use conceptKI if available
						if (componentConceptCKI && (componentConceptCKI === conceptCKI)){
							if (self.getEventId() !== componentRef.EVENT_ID) {
								return;
							}
							break;
						}//Fall bak to using the concept
						else if (concept && concept === componentRef.CONCEPT) {
							//If the event id does not match the current event id, consider it stale
							if (self.getEventId() !== componentRef.EVENT_ID) {
								return;
							}
							break;
						}
					}
					//If this is reached, the workflow id and event id hasn't changed
					isStale = false;
				}
			} else {
				logger.logError("No workflow information was found.");
			}
		});
	isStaleRequest.performRequest();
	return isStale;
};

/**
 * Sets the last saved text for the documentation component.
 * @param {String} lastSaveText - The last saved text for the documentation component.
 */
DocumentationBaseComponent.prototype.setLastSaveText = function (lastSaveText) {
	var lastSavedElement = $(this.getSectionContentNode()).find('.cke .last-saved-text');
	if (lastSavedElement.length === 0) {
		$(this.getSectionContentNode()).find('.cke .autosave.save').after('<div class="last-saved-text">' + (lastSaveText ? lastSaveText : "&nbsp;") + '</div>');
	} else {
		$(this.getSectionContentNode()).find('.cke .last-saved-text').html((lastSaveText ? lastSaveText : "&nbsp;"));
	}
	var view = this.m_structureView;
	var organizer = view ? view.getOrganizer() : null;
	//Update the last saved text on the structured documentation view.
	if (organizer) {
		$("#" + view.getNamespace() + "StructureFooter .structure-last-saved-text").html(lastSaveText);
	}
};

/**
 * Escapes special characters in the html string passed in.
 * @param {String} html - The HTML string for which special characters will be escaped.
 * @returns {String} The escaped version of the HTML string.
 */
DocumentationBaseComponent.prototype.escapeSymbols = function (html) {
	return html.replace(/[$]/g, "&#36;").replace(/\^/g, "&#94;");
};

/**
 * Performs the save functionality. If structured content is enabled it will save both the structure content and
 * the freetext content. Otherwise, it will simply save the freetext content.
 * @param {Function} statusCallback - The callback function to be executed after saving.
 */
DocumentationBaseComponent.prototype.save = function (statusCallback) {
	var component = this;

	// TODO: move this to a reusable method?
	var docI18N = i18n.discernabu.documentation_base;
	var busyHTML = ['<img src="', component.getCriterion().static_content, '/images/6439_16.gif" alt="', docI18N.SAVING, '"/>', docI18N.SAVING].join('');
	var editor = this.getEditorInstance();

	this.setLastSaveText(busyHTML);

	var structuredView = this.m_structureView;
	if (structuredView && structuredView.getOrganizer()) {
		//Make sure that the component is ready for mixed content
		this.enableMixedContent();

		//Call save function to save both the structure activity data as well as free text view's content
		this.saveBoth(editor.getAutosaveData(), structuredView.getOrganizer().convertToJSON(), statusCallback);
	} else {
		//Call the script that saves only free text
		this.saveFreetext(editor.getAutosaveData(), statusCallback);
	}
};

/**
 * Saves the freetext content of the documentation component.
 * @param {String} content - The freetext content to be saved.
 * @param {Function} statusCallback - The callback function to execute after saving.
 */
DocumentationBaseComponent.prototype.saveFreetext = function (content, statusCallback) {
	var self = this;
	//We parse out the information between <body and </body> and
	//modify the content to change ^ to html &#94.  This is to allow proper saving.
	var lowerCaseBodyHTML = content.toLowerCase();
	var indexBodyHTML = lowerCaseBodyHTML.indexOf("<body>");
	var indexEndBodyHTML = lowerCaseBodyHTML.indexOf("</body>");
	var modifiedBodyHTML = content.substring((indexBodyHTML + 6), indexEndBodyHTML);
	var finalBodyHTML = modifiedBodyHTML.replace(/[$]/g, "&#36;");
	finalBodyHTML = finalBodyHTML.replace(/\^/g, "&#94;");

	content = content.replace(modifiedBodyHTML, finalBodyHTML);
	//Encode the content so it is safe to send. (Only encode when in browser)
	if (!CERN_Platform.inMillenniumContext()) {
		content = content.replace(/\u200b/g, "");
		content = encodeURIComponent(content);
	}

	//Perform workflow check
	var component = this;
	var docI18N = i18n.discernabu.documentation_base;
	var editor = null;
	//If stale workflow
	if (this.isStaleWorkflow()) {
		// 	present dialog box
		MP_Util.AlertConfirm(
			docI18N.REFRESH_REQUIRED_MSG,
			docI18N.REFRESH_REQUIRED_TITLE,
			i18n.discernabu.CONFIRM_OK,
			null,
			false,
			null
		);

		//Disable save button
		//In order to save, the user would have to enter new content or click refresh, if they enter new content, it will trigger that dialog box again.
		editor = component.getEditorInstance();
		this.disableSaving();

		//Suppress framework level dirty flag
		this.resetDirty();

		//Reset editor instance as clean
		editor.saveEditorSnapshot();
		//Remove busy indicator
		this.setLastSaveText(null);

		return;
	}


	/*  mp_add_wkf_txt_result
	 "Output to File/Printer/MINE" = "MINE"
	 , "Person Id:" = 0.0
	 , "Personnel Id:" = 0.0
	 , "Encounter Id:" = 0.0
	 , "Provider Patient Relationship Code:" = 0.0
	 , "Concept Type:" = ""
	 , "Workflow Id:" = 0.0
	 , "Document Contents:" = 0.0
	 , "Event Id:" = 0.0
	 , "Version Nbr:" = 0.0
	 */
	var eventId = component.getEventId();
	var version = component.getDocumentationVersion();
	var criterion = component.getCriterion();
	var parameterArray = [
		"^MINE^",
		criterion.person_id + ".0",
		criterion.provider_id + ".0",
		criterion.encntr_id + ".0",
		criterion.ppr_cd + ".0",
		"^" + this.getConceptType() + "^",
		this.getWorkflowId() + ".0",
		"^^",
		(eventId !== 0 ? eventId + ".0" : "0.0"),
		(version !== 0 ? version + ".0" : "0.0"),
		"^" + this.getConceptCKI() + "^"
	];
	var loadTimer = new RTMSTimer("ENG:" + this.getDocumentationTimerName() + " - save workflow documentation");
	var saveDocumentationRequest = new ScriptRequest().
		setProgramName("mp_add_wkf_txt_result").
		setParameterArray(parameterArray).
		setLoadTimer(loadTimer).
		setDataBlob(content).
		setResponseHandler(function (reply) {
			var response = reply.getResponse();
			var componentList = null;
			var componentRef = null;
			var concept = self.getConceptType();
			var conceptCKI = self.getConceptCKI();
			var i = 0;
			var df = null;
			var lastSavedText = null;

			if (reply.getStatus() === 'S') {
				componentList = response.SUCCEEDED_COMPONENTS;
				for (i = componentList.length; i--;) {
					componentRef = componentList[i];
					var componentConceptCKI = componentRef.CONCEPT_CKI;
					var isMatchingComponent = false;
					if (componentConceptCKI && (componentConceptCKI === conceptCKI)){
						isMatchingComponent = true;
					} else if (concept && concept === componentRef.COMPONENT_CONCEPT){
						isMatchingComponent = true;
					}
					if (isMatchingComponent) {
						self.setEventId(parseFloat(componentRef.EVENT_ID));
						self.setDocumentationVersion(parseFloat(componentRef.VERSION_NUMBER));

						//Suppress framework level dirty flag
						self.resetDirty();
						//Reset editor instance as clean
						self.getEditorInstance().saveEditorSnapshot();
						//Update last saved text
						df = MP_Util.GetDateFormatter();
						lastSavedText = docI18N.LAST_SAVE + df.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
						self.setLastSaveText(lastSavedText);

						//MUST call statusCallback function to let the caller know that the content was successfully saved
						if (typeof statusCallback === 'function') {
							statusCallback("S");
						}
						return;
					}
				}
			}
			//Could not find a matching concept in the succeeded list
			//Update last saved text
			lastSavedText = docI18N.SAVE_FAILED_MSG;
			self.setLastSaveText(lastSavedText);

			//MUST call statusCallback function to let the editor know that the content was NOT successfully saved
			if (typeof statusCallback === 'function') {
				statusCallback("F");
			}
		});
	//If we are not within the context of Millennium, overwrite the ScriptRequest.prototype.execute method
	//to use an http POST method to ensure we retain our document content. (encoding the URI will 'corrupt' our
	//document by replacing any special characters with the URL encoded equivalent.
	if (!CERN_Platform.inMillenniumContext()) {
		saveDocumentationRequest.execute = function () {
			if (!this.m_validEntry) {
				throw new Error("ScriptRequest.execute: The execute function should not be called directly.  Please utilize the performRequest function for starting data requests");
			}
			//Grab the necessary fields for our ScriptRequest
			var dataBlob = this.getDataBlob();
			var loadTimer = this.getLoadTimer();
			var parameterArray = this.getParameterArray();
			var programName = this.getProgramName();

			//Validate the elements necessary for this request
			this.validateScriptRequestFields();

			//Start the load timer
			if (loadTimer) {
				loadTimer.start();
			}
			var request = new XMLHttpRequest();
			request.onreadystatechange = this.generateStateChangeHandler();
			request.open("POST", programName, this.m_asyncInd);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send("parameters=" + parameterArray.join(",") + "&blobIn=" + dataBlob);
		};
	}
	saveDocumentationRequest.performRequest();
};

/**
 * Prepares and saves both free text and structured activity data.
 *
 * Preparation involves:
 *    Extracting the top and bottom portions of the freetext documentation area.
 *  Escaping the freetext content for safe passage.
 *  Converting the freetext content to div mode from paragraph mode.
 *
 * @param {String} content - Full (x)html of the editor content
 * @param {String} activityJson - Activity JSON object
 * @param {Function} statusCallback - Callback function that takes either "S" or "F" as an argument
 */
DocumentationBaseComponent.prototype.saveBoth = function (content, activityJson, statusCallback) {
	var editor = this.getEditorInstance();
	var docI18N = i18n.discernabu.documentation_base;
	var self = this;

	//Perform a check to see if the documentation component is stale.
	if (this.isStaleWorkflow()) {
		//Present dialog box informing the user that the documentation component is stale.
		MP_Util.AlertConfirm(docI18N.REFRESH_REQUIRED_MSG, docI18N.REFRESH_REQUIRED_TITLE, i18n.discernabu.CONFIRM_OK, null, false, null);
		/*
		 Disable the save button.
		 In order to save, the user would have to enter new content or click refresh. If they enter new content,
		 it will trigger that dialog box again)
		 */
		this.disableSaving();

		//Suppress framework level dirty flag.
		this.resetDirty();

		//Reset editor instance as clean.
		editor.saveEditorSnapshot();

		this.setLastSaveText(null);
		return;
	}

	//We parse out the information between <body> and </body> and then we
	//modify the content to change ^ to html &#94.  This is to allow proper saving.
	var lowerCaseBodyHTML = content.toLowerCase();
	var indexBodyHTML = lowerCaseBodyHTML.indexOf("<body>");
	var indexEndBodyHTML = lowerCaseBodyHTML.indexOf("</body>");
	var bodyContentHTML = content.substring((indexBodyHTML + 6), indexEndBodyHTML);

	// use a detached div element to hold and parse the html
	// so that we can extract the top and bottom portions
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = bodyContentHTML;

	var hasDDFreetext = false;
	var topFreetextPortion = "";
	var $structuredElement = $(tempDiv).find(".ddstructuredtext");
	var $topFreeText = $structuredElement.prev(".ddfreetext");
	if ($topFreeText.length > 0) {
		topFreetextPortion = editor.dataProcessor.toDataFormat($topFreeText[0].innerHTML);
		topFreetextPortion = this.escapeSymbols(topFreetextPortion);
		//Convert html from paragraph mode to div mode
		hasDDFreetext = true;
	}
	var bottomFreetextPortion = "";
	var $bottomFreeText = $structuredElement.next(".ddfreetext");
	if ($bottomFreeText.length > 0) {
		bottomFreetextPortion = editor.dataProcessor.toDataFormat($bottomFreeText[0].innerHTML);
		bottomFreetextPortion = this.escapeSymbols(bottomFreetextPortion);
		//Convert html from paragraph mode to div mode
		hasDDFreetext = true;
	}
	//If we weren't able to find any freetext/structured text but there's still content in the body
	//Then we use mp_save_structured_section as a regular save
	if (!hasDDFreetext && $(tempDiv).find('.ddstructuredtext').length === 0 && bodyContentHTML.length > 0) {
		topFreetextPortion = bodyContentHTML;
	}
	tempDiv = null;

	/*
	 * 	Call mp_save_structured_section script
	 *
	 "Output to File/Printer/MINE" = "MINE"
	 , "Person Id:" = 0.0
	 , "Encounter Id:" = 0.0
	 , "Personnel Id:" = 0.0
	 , "Author Id:" = 0.0
	 , "Section Activity JSON" = ""
	 */
	var component = this;
	var eventId = this.getEventId();
	var version = this.getDocumentationVersion();
	var criterion = this.getCriterion();
	var requestJson = [
		'"PARENT_ENTITY_ID" : ' + eventId + '.0',
		'"PARENT_ENTITY_NAME" : "CLINICAL_EVENT"',
		'"PARENT_ENTITY_VERSION" : ' + version,
		'"TOP_FREETEXT" : ' + '"' + topFreetextPortion.replace(/"/g, '\\"') + '"',
		activityJson,
		'"BOTTOM_FREETEXT" : ' + '"' + bottomFreetextPortion.replace(/"/g, '\\"') + '"'
	];
	var parameterArray = [
		"^MINE^",
		criterion.person_id + ".0",
		criterion.encntr_id + ".0",
		criterion.provider_id + ".0",
		//Safe to assume provider always == author in our case, due to Dyn Doc workflow is unique to each prsnl/encounter/person
		criterion.provider_id + ".0",
		this.getWorkflowId() + ".0",
		criterion.ppr_cd + ".0",
		"^" + this.getConceptType() + "^",
		//We use the request->blob_in to pass the activity json instead of this prompt parameter
		"~~"
	];
	var activityBlob = '{ "ACTIVITY" : {' + requestJson.join(',') + '}}';
	if(!CERN_Platform.inMillenniumContext()) {
		activityBlob = activityBlob.replace(/\u200b/g, "");
		activityBlob = encodeURIComponent(activityBlob);
	}
	var saveStructureRequest = new ScriptRequest().
		setProgramName("mp_save_structured_section").
		setParameterArray(parameterArray).
		setDataBlob(activityBlob).
		setResponseHandler(function (reply) {
			var response = reply.getResponse();
			var lastSavedText = "";

			if (reply.getStatus() === 'S') {
				var responseJson = JSON.parse(response.REPLY_JSON);

				self.setEventId(parseFloat(responseJson.parent_entity_id));
				self.setDocumentationVersion(parseInt(responseJson.parent_entity_version, 10));

				//Clear off existing activity data
				var organizer = self.m_structureView.getOrganizer();
				organizer.clear();

				var builder = new JSONStructureOrganizerBuilder();
				builder.update(organizer, responseJson.section_act);

				//Reset the dirty flag due to organizer changes from the update
				component.getStructuredView().resetDirty();

				//Remove any extra information from content outside the <body> tags
				var content = responseJson.generated_text;
				var contentLowerCase = content.toLowerCase();
				var indexContentHTML = contentLowerCase.indexOf("<body>");
				var indexEndContentHTML = contentLowerCase.indexOf("</body>");
				var modContentBodyHTML = content.substring((indexContentHTML + 6), indexEndContentHTML);

				content = modContentBodyHTML;

				component.updateReadOnlyContent(content);

				//Suppress framework level dirty flag
				self.resetDirty();
				//Reset editor instance as clean
				editor.saveEditorSnapshot();
				//Update last saved text
				var df = MP_Util.GetDateFormatter();
				lastSavedText = docI18N.LAST_SAVE + df.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				self.setLastSaveText(lastSavedText);

				//MUST call statusCallback function to let the editor know that the content was successfully saved
				if (typeof statusCallback === 'function') {
					statusCallback("S");
				}
			} else {
				logger.logError("Failed to save and generate structured text.");
				//The save failed, update the last saved text to inform as such.
				lastSavedText = docI18N.SAVE_FAILED_MSG;
				self.setLastSaveText(lastSavedText);
				// MUST call statusCallback function to let the editor know that the content was NOT successfully saved
				if (typeof statusCallback === 'function') {
					statusCallback("F");
				}
			}
		});
	//If we are not within the context of Millennium, overwrite the ScriptRequest.prototype.execute method
	//to use an http POST method to ensure we retain our document content. (encoding the URI will 'corrupt' our
	//document by replacing any special characters with the URL encoded equivalent.
	if (!CERN_Platform.inMillenniumContext()) {
		saveStructureRequest.execute = function () {
			if (!this.m_validEntry) {
				throw new Error("ScriptRequest.execute: The execute function should not be called directly.  Please utilize the performRequest function for starting data requests");
			}
			//Grab the necessary fields for our ScriptRequest
			var dataBlob = this.getDataBlob();
			var loadTimer = this.getLoadTimer();
			var parameterArray = this.getParameterArray();
			var programName = this.getProgramName();

			//Validate the elements necessary for this request
			this.validateScriptRequestFields();

			//Start the load timer
			if (loadTimer) {
				loadTimer.start();
			}
			var request = new XMLHttpRequest();
			request.onreadystatechange = this.generateStateChangeHandler();
			request.open("POST", programName, this.m_asyncInd);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send("parameters=" + parameterArray.join(",") + "&blobIn=" + dataBlob);
		};
	}
	saveStructureRequest.performRequest();
};

/**
 * Retrieves the structured documentation template by making a call to the MP_GET_STRUCTURED_TEMPLATE CCL script.
 * Once the script returns, the callback provided is called and the reply is passed as a parameter.
 * @param {Function} callback - The function to be called when the script returns.
 */
DocumentationBaseComponent.prototype.getStructuredTemplate = function (callback) {
	var criterion = this.getCriterion();
	var parameterArray = [
		"^MINE^",
		criterion.person_id + ".0",
		criterion.encntr_id + ".0",
		criterion.position_cd + ".0",
		criterion.ppr_cd + ".0",
		"^" + this.getConceptCKI() + "^",
		criterion.provider_id + ".0"
	];
	//Create the engineering timer which will capture the load time of the mp_get_structured_template script
	var loadTimer = new RTMSTimer(
		"ENG:" + this.getDocumentationTimerName() + " - get structured template",
		criterion.category_mean
	);
	//Create the script request object to retrieve the structured documentation template
	var structureTemplateRequest = new ScriptRequest().
		setProgramName("mp_get_structured_template").
		setParameterArray(parameterArray).
		setLoadTimer(loadTimer).
		setResponseHandler(function (reply) {
			if (reply.getStatus() !== 'S') {
				logger.logError("Unable to retrieve the structured documentation template");
			}
			callback(reply);
		});
	structureTemplateRequest.performRequest();
};

/**
 * Opens an existing structured documentation section with activity and reference data.
 * @param {Function} callback - The callback function to be performed once the call to mp_open_structured_section
 * returns.
 */
DocumentationBaseComponent.prototype.openExistingStructuredSection = function (callback) {
	var criterion = this.getCriterion();
	var parameterArray = [
		"^MINE^",
		"^CLINICAL_EVENT^",
		this.getEventId() + ".0",
		criterion.person_id + ".0",
		criterion.encntr_id + ".0",
		criterion.position_cd + ".0",
		criterion.ppr_cd + ".0",
		"^" + this.getConceptCKI() + "^",
		criterion.provider_id + ".0"
	];
	var loadTimer = new RTMSTimer(
		"ENG:" + this.getDocumentationTimerName() + " - open existing structure",
		this.getCriterion().category_mean
	);
	var openStructureRequest = new ScriptRequest().
		setProgramName("mp_open_structured_section").
		setParameterArray(parameterArray).
		setLoadTimer(loadTimer).
		setResponseHandler(function (reply) {
			if (reply.getStatus() !== 'S') {
				logger.logError("Unable to open existing structured section");
			}
			callback(reply);
		});
	openStructureRequest.performRequest();
};

/**
 * Processes and supplies the component with the relevant workflow data. This may be called multiple times
 * when new workflow information is retrieved.
 * @param {Object} event - The event that was triggered.
 * @param {String} dataString - The data retrieved by MP_GET_WORKFLOW.
 */
DocumentationBaseComponent.prototype.processWorkflowInformation = function (event, dataString) {
	var data = null;
	var componentsList = null;
	var concept = this.getConceptType();
	var conceptCKI = this.getConceptCKI();
	var i = 0;
	var componentRef = null;
	if (dataString) {
		data = JSON.parse(dataString);
		if (data) {
			data = data.RECORD_DATA;
		}
	}
	//Workflow data was found
	if (data) {
		//Clear out existing data, in case the current component doesn't exist in the new workflow data
		this.setEventId(0);
		this.setWorkflowId(data.WORKFLOW_ID);
		this.setTimeZone(data.TIME_ZONE);
		componentsList = data.COMPONENTS;
		
		for (i = componentsList.length; i--;) {
			var componentConceptCKI = componentsList[i].CONCEPT_CKI;
			//Use conceptCKI if available
			if (componentConceptCKI && (componentConceptCKI === conceptCKI)){
				componentRef = componentsList[i];
				this.setEventId(componentRef.EVENT_ID);
			}
			//Fall back to using the Concept
			else if (concept && concept === componentsList[i].CONCEPT) {
				componentRef = componentsList[i];
				this.setEventId(componentRef.EVENT_ID);
			}
		}
	}
	//At this point, the component is about to retrieve the actual document contents for the component
	//or simply render if there is no documentation contents on the component.
	this.m_loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), this.getCriterion().category_mean);
	this.m_loadTimer.start();
	//Perform initial read if applicable
	if (this.getEventId() <= 0 && !this.isEmrEnabled()) {
		this.handleSuccess(null);
	}
	else {
		this.getDocumentation();
	}
};

/**
 * Handles a successful retrieval of the documentation content. It renders the default view of the component and
 * subsequently finalizes the view.
 * @param {Object} recordData - The documentation data retrieved for the component.
 */
DocumentationBaseComponent.prototype.handleSuccess = function (recordData) {
	var self = this;
	// initialize dirty data shared resource
	if (CERN_Platform.inMillenniumContext()) {
		this.initPendingSR();
	}
	try {
		self.m_defaultView.render(recordData, self);
		self.m_defaultView.finalize();
	} catch (err) {
		var errMsg = [
			"<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME,
			": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ",
			err.description, "</li></ul>"
		];
		logger.logError(errMsg.join(""));
		this.finalizeComponent(this.generateScriptFailureHTML(), "");
	} finally {
		// stop load timer due to successful load
		if (this.m_loadTimer) {
			this.m_loadTimer.stop();
			this.m_loadTimer = null;
		}
	}
};

/**
 * Processes the data retrieved from the mp_check_dyndoc_services CCL program. It determines if the necessary
 * services are available to enable Dynamic Documentation.
 * @param {String} serviceData - The response (as a string) from mp_check_dyndoc_services.
 */
DocumentationBaseComponent.prototype.processServiceAvailability = function(serviceData) {
	var serviceDataJSON = JSON.parse(serviceData);
	serviceDataJSON = serviceDataJSON.RECORD_DATA;
	var status = serviceDataJSON.STATUS_DATA.STATUS;
	var hasNecessaryServices = false;
	if(status !== "S") {
		this.m_isDynDocAvailable = false;
	} else {
		hasNecessaryServices = serviceDataJSON.ENSURE_COMPONENT_SERVICE.STATUS === "S" &&
		serviceDataJSON.GET_WORKFLOW_SERVICE.STATUS === "S";
		//If within the context of Millennium, we are more strict about the Dyn Doc requirements.
		if(CERN_Platform.inMillenniumContext()) {
			//Perform the necessary checks to see if Dynamic Documentation is available
			var hasAutoText = (CERN_Platform.getDiscernObject("AUTOTEXTHELPER") !== null);
			var hasClipboard = (CERN_Platform.getDiscernObject("CLIPBOARDHELPER") !== null);
			var hasSpellcheck = (CERN_Platform.getDiscernObject("SPELLCHECKHELPER") !== null);
			var dynDoc = CERN_Platform.getDiscernObject("DYNDOC");
			var hasDynDoc = (dynDoc && ("OpenDynDocByWorkflowId" in dynDoc));
			this.m_isDynDocAvailable = hasDynDoc && hasAutoText && hasClipboard && hasSpellcheck && hasNecessaryServices;
		} else {
			this.m_isDynDocAvailable = hasNecessaryServices;
		}
	}
	//Now that we have enough information to determine if Dyn Doc is available, continue the initialization process.
	this.beginInitialization();
};

/**
 * Performs the check to see if Dynamic Documentation is available. Utilizes the shared resource functionality
 * and makes a call to check Dyn Doc service availability. Once the service availability information has been
 * retrieved, the Dyn Doc components will process this information and ultimately continue the initialization process.
 */
DocumentationBaseComponent.prototype.checkIfDynamicDocumentationIsAvailable = function () {
	var parameterArray = ["^MINE^"];
	var documentationServiceResource = MP_Resources.getSharedResource('documentationServiceAvailability');
	var self = this;

	//If the service availability shared resource already exists.
	if (documentationServiceResource) {
		//Attach a listener to listen for future modifications (updates) to the shared resource.
		CERN_EventListener.addListener(this, "documentationServiceAvailability", function (event, reply) {
			self.processServiceAvailability(reply);
		}, this);

		if (documentationServiceResource.isResourceAvailable()) {
			var serviceInfo = documentationServiceResource.getResourceData();
			this.processServiceAvailability(serviceInfo);
		} else {
			documentationServiceResource.retrieveSharedResourceData();
		}
	} else {
		documentationServiceResource = MP_Resources.createSharedResourceObj(
			"documentationServiceAvailability",
			this,
			"MP_CHECK_DYNDOC_SERVICES",
			parameterArray,
			"documentationServiceAvailability"
		);
		if (documentationServiceResource) {
			//Attach a listener to listen for future modifications (updates) to the shared resource.
			CERN_EventListener.addListener(this, "documentationServiceAvailability", function (event, reply) {
				self.processServiceAvailability(reply);
			}, this);
			documentationServiceResource.retrieveSharedResourceData();
		}
	}
	//
	// handle events fired when diagnoses are added in
	// consolidated-problems-o1, consolidated-problems-o2
	// and diagnosis-o1 and entity framework
	//
	this.listenForDiagnosisEvents();
	this.listenForOrderEvents();
};

/**
 * Add a listener to Dyn Doc components around ordering events
 */
DocumentationBaseComponent.prototype.listenForOrderEvents = function() {
    CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.onOrderAdded, this);
};

/**
 * Stub for implementation of how each Dyn Doc component wants to handle ordering events.
 */
DocumentationBaseComponent.prototype.onOrderAdded = function() {
	// To be implemented by individual components
};

/**
 * Implementation here of MPageComponent stub. This method will refresh the
 * component when the list of diagnoses changes in other components.
 */
DocumentationBaseComponent.prototype.onDiagnosisAdded = function() {
	var structureView = this.m_structureView;
	var editor = this.getEditorInstance();
	//Ignore the event if the structure view does not exist or has not been rendered
	if(!structureView || !structureView.isRendered()) {
		logger.logMessage("DocumentationBaseComponent.prototype.onDiagnosisAdded: ignoring event, structure has not been loaded");
		return;
	}
	//If the structure view is dirty, first save the content, then refresh, otherwise it's safe to refresh.
	if(structureView.isDirty()) {
		editor.save(function(status){
			if(status === "S") {
				logger.logMessage('DocumentationBaseComponent.prototype.onDiagnosisAdded: Refreshing the structured documentation view');
				structureView.completeRefresh();
			}
		});
	} else {
		logger.logMessage('DocumentationBaseComponent.prototype.onDiagnosisAdded: Refreshing the structured documentation view');
		structureView.completeRefresh();
	}
};

/**
 * Refreshes the existing and available workflow shared resource by making the ccl call to get data.
 * This method does nothing if workflow information hasn't been retrieved and available.
 */
DocumentationBaseComponent.prototype.refreshWorkflowInformation = function () {
	var workflowResource = MP_Resources.getSharedResource('documentationWorkflow');
	if (workflowResource && workflowResource.isResourceAvailable()) {
		workflowResource.retrieveSharedResourceData();
	}
};

/**
 * Overrides the resize function to also resize the current view.
 */
DocumentationBaseComponent.prototype.resizeComponent = function () {
	MPageComponent.prototype.resizeComponent.call(this);
	if (this.m_currentView && this.m_currentView.resize) {
		this.m_currentView.resize(this.getAvailableComponentHeight());
	}
};

/**
 * Resizes the editor to take up the available height of the workflow view
 * @return {undefined} undefined
 */
DocumentationBaseComponent.prototype.getAvailableComponentHeight = function() {
	var viewContainer = $("#vwpBody");
	if (!viewContainer.length) {
		return 0;
	}
	var miscPadding = 22; //Handle component padding and allow some space below component
	var viewHeight = viewContainer.height();
	var sectionHeaderElement = this.getRootComponentNode().firstChild;
	var sectionHeaderHeight = $(sectionHeaderElement).outerHeight(true);
	return viewHeight - sectionHeaderHeight - miscPadding;
};

/**
 * Update (or initialize) the EMR content within the current note.
 * Executes command that is handled from the CKEditor 'cernrefresh' plugin
 */
DocumentationBaseComponent.prototype.updateEMRContent = function() {
	var editor = this.getEditorInstance();
	if (!editor) {
		logger.logMessage("DocumentationBaseComponent.prototype.updateEMRContent: EMR content not updated if editor doesn't exist");
		return;
	}
	var version = this.getDocumentationVersion();
	var emrRetrievalType = g_sATTRIBUTE_REFRESHING;
	if (version < 1){
		emrRetrievalType = g_sATTRIBUTE_INITIALIZING;
	}

	this.populateCKEditorCriteria();
	var editable = editor.editable();
	var $editableArea = $(editor.editable().$);
	var editorIsDirty = editor.isEditorDirty();
	//This would set false to the m_preEMRIsEditorDirtyCheck attribute as the editor is not marked as dirty before the EMR update. 
	this.setPreEMRIsEditorDirtyCheck(editorIsDirty);
	//Retrieve EMR Content into emrcontent placeholders
	if ($editableArea.length){
		editor.execCommand(DDCMD_REFRESHELEMENT, {
			element:    $editableArea,
			type:       emrRetrievalType
		});
	}
};

/**
 * Displays an EMR error message to handle an error of EMR content refresh
 */
DocumentationBaseComponent.prototype.displayEMRError = function() {
	var $contentNode = $(this.getSectionContentNode());
	var docI18N = i18n.discernabu.documentation_base;
	var errorBanner = new MPageUI.AlertBanner();
	errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	errorBanner.setPrimaryText(docI18N.ERROR_RETRIEVING_DATA);
	errorBanner.setSecondaryText(docI18N.CONTACT_SYS_ADMIN);
	errorMessageHTML = errorBanner.render();		
	$contentNode.prepend(errorMessageHTML);
};

/**
 * Handles updates required post EMR refresh
 */
DocumentationBaseComponent.prototype.postEMRRefresh = function() {
	var editor = this.getEditorInstance();
	var version = this.getDocumentationVersion();
	var editorIsDirtyPrePostUpdate = this.getPreEMRIsEditorDirtyCheck();
	var freeTextAreas = $(editor.editable().$).find('.ddfreetext');	
	var freeTextAreasText = freeTextAreas.text();	
	//Validates whether there is any text entered in the free text area during refresh.
	var isFreeTextDirty = $.trim(freeTextAreasText).length > 0;
	//After component has refreshed, make sure undo doesn't go back before current
	editor.resetUndo();
	//Update styling to change padding if empty sections exist
	this.handleEmptySections();

	//If the version of the documentation is zero, the implication is that the content in assessment and plan is unsaved and being loaded for the first time.
	//The m_preEMRIsEditorDirtyCheck attribute for version of the note would be false before the EMR update.
	//Update the pendingData shared resource to remove assessment and plan from the dirt component list.	
	if(!editorIsDirtyPrePostUpdate && version === 0 && !isFreeTextDirty){
		editor.saveEditorSnapshot();		
		this.resetDirty();
	}
};

/**
 * Handles styling around empty EMR sections
 */
DocumentationBaseComponent.prototype.handleEmptySections = function() {
	var editor = this.getEditorInstance();
	var editable = editor.editable();
	var $editableArea = $(editor.editable().$);
	var $emrContent = $editableArea.find(".ddemrcontent");
	// If emr content is empty ensure no padding added to free text
	if (! $emrContent.children().length){
		$editableArea.addClass('documentation-empty-emr');
	}
	else{
		$editableArea.removeClass('documentation-empty-emr');
	}
};

/**
 * Populate criterion variables in CKEditor necessary for use by CKEditor plugins
 * and DynDoc Services
 */
DocumentationBaseComponent.prototype.populateCKEditorCriteria = function(){
	var criterion = this.getCriterion();
	CKEDITOR.dPatientId = criterion.person_id;
	CKEDITOR.dNoteEncounterId = criterion.encntr_id;    
	CKEDITOR.dChartEncounterId = criterion.encntr_id;
	CKEDITOR.dUserId = criterion.provider_id;
	CKEDITOR.lUserTimezone = this.getTimeZone();
	CKEDITOR.dPPRCd = criterion.ppr_cd;
	CKEDITOR.dWorkflowId = this.getWorkflowId();
};

/**
 * Determines whether or not the editor is currently in a state that the user can save
 * @return {Boolean} Returns true if the user should be able to save the current state of the editor
 */
DocumentationBaseComponent.prototype.canSave = function(){
	var editor = this.getEditorInstance();
	//disable save when refreshing or data is clean
	if (editor.refreshState === 'refreshing' || !editor.isEditorDirty()){
		return false;
	}
	return true;
};

/**
 * Update the save button to reflect the current state of the editor
 * -> Disables if the user should not be able to save
 * -> Enable if the user should be able to save
 */
DocumentationBaseComponent.prototype.updateSaveButton = function(){
	if (this.canSave()){
		this.enableSaving();
	}
	else{
		this.disableSaving();
	}
};
