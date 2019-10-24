/**
 * @constructor
 * The CustomComponent object is used as an object wrapper for custom components developed
 * by clients.  It acts as the middleman between the MPages framework and the custom component
 * and translates functions/actions from the framework into corresponding actions at the custom
 * component level.
 **/
function CustomComponent(criterion) {
	this.m_compNamespace = "";
	this.m_compOptionsObjName = "";
	this.m_custCompRef = null;
	this.setCriterion(criterion);

	//Create an initialize the styles object
	var stylesObj = new ComponentStyle();
	stylesObj.initByNamespace("cust");
	this.setStyles(stylesObj);

	this.setComponentLoadTimerName("USR:MPG.CUSTOM_COMP.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.CUSTOM_COMP.O1 - render component");
}

/**
 * Inherit the functions and properties of the MPageComponent object
 **/
CustomComponent.prototype = new MPageComponent();
CustomComponent.prototype.constructor = MPageComponent;

/**
 * Sets the namespace string used to create the custom component object which will
 * be wrapped by this CustomComponent object.
 * @param {string} namespace The namespace of the custom component to create
 **/
CustomComponent.prototype.setComponentNamespace = function(namespace) {
	this.m_compNamespace = namespace;
};

/**
 * Gets the namespace string set for the custom component object
 * @return {string} The namespace of the custom component
 **/
CustomComponent.prototype.getComponentNamespace = function() {
	return this.m_compNamespace;
};

/**
 * Sets the options object identifier used to create the options object of the custom component
 * @param {string} optionsName The name of the options object for this custom component
 **/
CustomComponent.prototype.setComponentOptionsObjectName = function(optionsName) {
	this.m_compOptionsObjName = optionsName;
};

/**
 * Gets the options object identifier for the custom component
 * @return {string} The name of the options object to create for the custom component
 **/
CustomComponent.prototype.getComponentOptionsObjectName = function() {
	return this.m_compOptionsObjName;
};

/**
 * Sets a reference to the custom component object created from the custom component namespace.
 * @param {MPage.Component} customCompRef The custom component created from the custom component namespace
 **/
CustomComponent.prototype.setCustomComponentReference = function(customCompRef) {
	this.m_custCompRef = customCompRef;
};

/**
 * Gets the reference to the custom component object wrapped within the CustomComponent
 * @return {MPage.Component} A reference to the custom component object.
 **/
CustomComponent.prototype.getCustomComponentReference = function() {
	return this.m_custCompRef;
};

/**
 * This function is used to open the Millennium tab defined in Bedrock.  If the APPLINK functionality
 * is not available nothing will happen.
 **/
CustomComponent.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
	APPLINK(0, criterion.executable, sParms);
};

/**
 * This function is used to retrieve the specific filter mappings assigned to this instance of the
 * Custom Component.  Since this same object can be used for multiple custom components, different setSeconds
 * of filters need to be defined based on the custom component.
 * @return {object} An object containg key value pairs of filter identifiers and the associated filter type definition objects
 **/
CustomComponent.prototype.getFilterMappingsObj = function() {
	var reportMean = this.getReportMean().toUpperCase();
	var custCompNum = /[0-9]+$/.exec(reportMean)[0];
	var fullPageComp = (/.?_FP_.?/i.exec(reportMean)) ? "FP_" : "";

	//This is the custom component namespace.  When we updated the bedrock we could not switch out the old name passively
	this.addFilterMappingObject(fullPageComp + "CUSTOM_COMP_PRG_" + custCompNum, {
		type: "STRING",
		field: "FREETEXT_DESC",
		setFunction: this.setComponentNamespace
	});

	this.addFilterMappingObject(fullPageComp + "CUSTOM_COMP_OBJ_" + custCompNum, {
		type: "STRING",
		field: "FREETEXT_DESC",
		setFunction: this.setComponentOptionsObjectName
	});

	if(fullPageComp === "FP_") {
		this.addFilterMappingObject(fullPageComp + "CUSTOM_COMP_" + custCompNum + "_DISPLAY", {
			type: "Boolean",
			field: "FREETEXT_DESC",
			setFunction: this.setDisplayEnabled
		});
	}

	return this.m_filterMappingsObj;
};

/**
 * Used to Calculate the maximum height of a workflow custom component.  Summary custom components
 * are not height restricted and will return null.
 * @return {number|null} The maximum height the component should allow in a workflow view or null if
 * the custom component is within a summary view.
 */
CustomComponent.prototype.getMaxHeight = function() {
	var compDOMObj = null;
	var compHeight = 0;
	var contentBodyHeight = 0;
	var calcHeight = null;
	var container = null;
	var contentBodyObj = null;
	var miscHeight = 20;
	var viewHeight = 0;

	if(this.getStyles().getComponentType() === CERN_COMPONENT_TYPE_WORKFLOW) {
		compDOMObj = $(this.getRootComponentNode());
		if(!compDOMObj.length) {
			return null;
		}
		container = $("#vwpBody");
		if(!container.length) {
			return null;
		}
		viewHeight = container.height();
		contentBodyObj = $(this.getSectionContentNode());
		if(contentBodyObj.length) {
			compHeight = compDOMObj.height();
			contentBodyHeight = contentBodyObj.height();
			calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight));
		}
	}
	return calcHeight;
};

/**
 * This function is for convenience. It returns the component menu for the
 * custom component. It is a workflow style menu regardless of whether the
 * component is workflow or summary and can be manipulated with the menu
 * API.
 *
 * @returns {Menu}
 */
CustomComponent.prototype.getMenu = function() {
    return MPageComponent.prototype.getMenu.call(this);
};

/**
 * This function is used to resize a custom component setting max-height and max-width.
 * It overrides the base class implementation since custom components in summary views
 * will also need to be notified of resize updates.
 */
CustomComponent.prototype.resizeComponent = function() {
	var maxHeight = null;
	var contentBodyObj = null;
	var maxWidth = null;
	var compObj = this.getCustomComponentReference();

	//Ensure a custom component was actually created
	if(!compObj) {
		return;
	}

	//Apply the max height if it is necessary
	maxHeight = this.getMaxHeight();
	compObj.setProperty("maxHeight", maxHeight);
	contentBodyObj = $(this.getSectionContentNode());
	if(maxHeight) {
		contentBodyObj.css({
			"max-height": maxHeight,
			"overflow-y": "auto"
		});
	}

	//Inform the custom component of the size change
	maxWidth = contentBodyObj.width();
	compObj.resize(maxWidth, maxHeight);
};

/**
 * This function is used to refresh the custom component that is wrapped within this CustomComponent.  It
 * overrides the base class implementation since the custom components require the retainment of the 'options'
 * and 'properties' settings.
 **/
CustomComponent.prototype.refreshComponent = function() {
	var customComp = this.getCustomComponentReference();
	if(customComp) {
		customComp.refresh();
	}
};

/**
 * This function is used when the custom component is refreshing.  The MPage.Component.refresh function handles
 * the preparation of the custom component for refresh and this function performs the actual reloading of the
 * custom component.
 **/
CustomComponent.prototype.reloadCustomComp = function() {
	var self = this;
	var customComp = this.getCustomComponentReference();
	try {
		var callback = function() {
			self.finalizeCustomComp(null);
		};
		customComp.generate(customComp.getTarget(), callback, null);
	}
	catch(err) {
		logger.logJSError(err, this, "customcomp.js", "reloadCustomComp");
		this.finalizeCustomComp(err);
	}
};

/**
 * This function is used to evaluate the literal values for the namespace and options literals.  In
 * order to prevent the use of 'eval' we normalize those literals and attempt to traverse the objects down
 * to the last leteral value.  If any value up until that point is not defined we return null to signifying
 * and invalid literal.
 *
 * Any non-required bracket notation will be converted to dot notation
 * Ex. cerner["namespace"].component -> cerner.namespace.component
 *
 * Any required bracket notation will be preserved and handled appropriately
 * Ex. cerner["namespace"].components["3rdComponent"] -> cerner.namespace.components["3rdComponent"]
 * Ex. cerner["namespace"].components["allergy-omponent"] -> cerner.namespace.components["allergy-omponent"]
 *
 * Any array indexing will be preserved and handled as an array value
 * Ex. cerner["namespace"].component[3] -> cerner.namespace.component[3]
 *
 * IMPORTANT: This fuction cannot currently handle adjacent bracketing
 * ex. cerner["namespace"]["components"]
 *
 * @param {string} objectLiteral The literal string used to reference an object.
 * @return {object} The object referenced by the literal
 **/
/*CustomComponent.prototype.evaluateObjectReference = function(objectLiteral){
	//convert any bracket notation into dot notation
	//ex: cerner["namespace"].component -> cerner.namespace.component
	//ignores array notation and object references which are not valid in dot notation
	//ex: cerner["namespace"].component[3] -> cerner.namespace.component[3]
	//ex: cerner["namespace"].component["3rd-component"] -> cerner.namespace.component["3rd-component"]
	var arrayIndex = 0;
	var arrayReference = "";
	var arrayMatches = [];
	var currentReference = window;
	var objectMatches = [];
	var objectParent = "";
	var objectChild = "";
	var x = 0;

	//Regular expressions used to match different literal value types
	var normalizeRegex = /(\[["|'])([A-Za-z]+.*?)(["|']\])/;
	var arrayMatchRegex = /(\w+)\[([0-9]+)\]/;
	var requiredBracketNotationRegex = /(\w+)\[["|']([0-9]+.*?)["|']\]/;


	//Replace all bracket notations that start with an alpha character
	while(normalizeRegex.test(objectLiteral)){
		objectLiteral = objectLiteral.replace(normalizeRegex, '.$2');
	}

	//Split the literal into individual referencs
	var references = objectLiteral.split(".");
	for(x = 0; x < references.length; x++){
		if(arrayMatchRegex.test(references[x])){
			arrayMatches = arrayMatchRegex.exec(references[x])
			arrayReference = arrayMatches[1];
			arrayIndex = parseInt(arrayMatches[2], 10);
			currentReference = currentReference[arrayReference][arrayIndex];
		}
		else if(requiredBracketNotationRegex.test(references[x])){
			objectMatches = requiredBracketNotationRegex.exec(references[x])
			objectParent = objectMatches[1];
			objectChild = objectMatches[2];
			currentReference = currentReference[objectParent][objectChild];
		}
		else{
			currentReference = currentReference[references[x]];
		}

		//Check to see if the last reference update is valid
		if(!currentReference){
			//Last reference wasnt valid, return null signifying an invalid object reference
			return null;
		}
	}

	return currentReference;
};*/

/**
 * This function is used to create the custom component, set all of the expected options and properties
 * and to finally call the necessary MPage.Component function which will untimately render the custom
 * component
 **/
CustomComponent.prototype.retrieveComponentData = function() {
	var callback = null;
	var compHeight = 0;
	var compId = "";
	var compNamespace = "";
	var contentBodyObj = null;
	var criterion = this.getCriterion();
	var custComp = null;
	var options = null;
	var optionsObjectName = "";
	var self = this;

	//Evaluate the component namespace and error if it isnt valid or not present
	try {
		compNamespace = this.getComponentNamespace();
		if(compNamespace) {
			eval("custComp = new " + compNamespace + "();");
		}
		else {
			//No namespace defined so we can throw an empty error since it will be discarded.
			throw new Error();
		}
	}
	catch(namespaceError) {
		var invalidNamespaceErr = null;
		if(compNamespace) {
			invalidNamespaceErr = new Error(i18n.discernabu.customcomponents_o1.INVALID_NAMESPACE.replace("{0}", compNamespace));
		}
		else {
			invalidNamespaceErr = new Error(i18n.discernabu.customcomponents_o1.UNDEFINED_NAMESPACE);
		}
		logger.logJSError(invalidNamespaceErr, this, "customcomp.js", "retrieveComponentData");
		this.finalizeCustomComp(invalidNamespaceErr);
		return;
	}

	//Evaluate the component options object and error if it isnt valid
	try {
		optionsObjectName = this.getComponentOptionsObjectName();
		if(optionsObjectName) {
			eval("options = " + optionsObjectName + ";");
		}
		else {
			options = null;
		}
	}
	catch(optionsObjectError) {
		var invalidOptionsErr = new Error(i18n.discernabu.customcomponents_o1.INVALID_OPTIONS.replace("{0}", optionsObjectName));
		logger.logJSError(invalidOptionsErr, this, "customcomp.js", "retrieveComponentData");
		this.finalizeCustomComp(invalidOptionsErr);
		return;
	}

	//Define the default properties of the custom component and kick off the rendering
	try {
		compId = this.getStyles().getId();
		custComp.setOption("id", compId);
		custComp.setOption("parentComp", this);
		custComp.setProperty("mine", "mine");
		custComp.setProperty("compId", this.getComponentId());
		custComp.setProperty("personId", criterion.person_id);
		custComp.setProperty("userId", criterion.provider_id);
		custComp.setProperty("encounterId", criterion.encntr_id);
		custComp.setProperty("pprCd", criterion.ppr_cd);
		custComp.setProperty("PPRCode", criterion.ppr_cd);
		custComp.setProperty("staticContent", criterion.static_content);
		custComp.setProperty("compSourceLocation", criterion.static_content.replace("UnifiedContent", "custom_mpage_content") + "/custom-components/");
		custComp.setProperty("positionCd", criterion.position_cd);
		custComp.setProperty("categoryMean", criterion.category_mean);
		custComp.setProperty("viewableEncounters", criterion.getPersonnelInfo().getViewableEncounters());
		custComp.setProperty("headerTitle", this.getLabel());
		custComp.setProperty("headerSubTitle", "");
		custComp.setProperty("headerOverflowState", (this.isScrollingEnabled()) ? true : false);

		//
		// Avoid the setter here because it also persists the preference
		// which is unnecessary and causes a race condition if two custom
		// components are placed on a view
		//
		custComp.properties["userPreferences"] = this.getPreferencesObj();

		compHeight = this.getMaxHeight();
		custComp.setProperty("maxHeight", compHeight);
		if(compHeight) {
			contentBodyObj = this.getSectionContentNode();
			$(contentBodyObj).css("max-height", compHeight).css("overflow-y", "auto");
		}
		custComp.setTarget(this.getSectionContentNode());
		MPage.addCustomComp(custComp);
		this.setCustomComponentReference(custComp);
		callback = function() {
			self.finalizeCustomComp(null);
		};
		custComp.generate(custComp.getTarget(), callback, options);
	}
	catch(renderError) {
		logger.logJSError(renderError, this, "customcomp.js", "retrieveComponentData");
		this.finalizeCustomComp(renderError);
	}
};

/**
 * This function is used to complete the rendering of the custom component.  In the event of an error the component
 * will show that standard error messaging.  Otherwist the header sub title will be updated if a value is available.
 **/
CustomComponent.prototype.finalizeCustomComp = function(error) {
	if(error) {
		logger.logJSError(error, this, "customcomp.js", "finalizeCustomComp");
		this.finalizeComponent(this.generateScriptFailureHTML(), "");
	}
	else {
		var custCompRef = this.getCustomComponentReference();
		var headerSubTitle = (custCompRef.getProperty("headerSubTitle") !== "undefined") ? custCompRef.getProperty("headerSubTitle") : "";
		this.updateSubLabel(headerSubTitle);
		//notify the aggregate timer that the component has finished loading
		this.notifyAggregateTimer();
	}
};

/**
 * Map the Custom-Component option 1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "Custom_Comp_#" or "FP_CUSTOM_COMP_#" filter
 */
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_1", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_2", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_3", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_4", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_5", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_6", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_7", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_8", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_9", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_10", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_11", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_12", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_13", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_14", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_15", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_16", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_17", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_18", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_19", CustomComponent);
MP_Util.setObjectDefinitionMapping("CUSTOM_COMP_20", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_1", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_2", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_3", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_4", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_5", CustomComponent);
MP_Util.setObjectDefinitionMapping("FP_CUSTOM_COMP_6", CustomComponent);