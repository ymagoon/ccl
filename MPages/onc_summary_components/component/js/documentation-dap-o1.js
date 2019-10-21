/**
 * The AP documentation component will instantiate an editor
 *
 * @constructor
 * @param {Criterion} criterion
 */
function DocumentationAPComponentStyle() {
	this.initByNamespace("documentation-ap");
}
DocumentationAPComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the DocumentationAPComponent component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function DocumentationAPComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new DocumentationAPComponentStyle());
    this.setIncludeLineNumber(true);
    this.setDocumentationTimerName("MPG.DOCUMENTATION_AP.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");
    
    // set concept CKI to AP
    this.setConceptCKI('CERNER!3AAB66F1-295B-4ADA-BE1C-D2E29461E861');
    this.setHoverEnabled(true);
    this.setEmrEnabled(true);
}

/**
 * Inherit from base Documentation Component
 */
DocumentationAPComponent.inherits(DocumentationBaseComponent);

/**
 * Update the EMR content within the component's editor when a diagnosis is added
 */
DocumentationAPComponent.prototype.onDiagnosisAdded = function() {
    DocumentationBaseComponent.prototype.onDiagnosisAdded.call(this);
    this.updateEMRContent();
};

/**
 * Update the EMR content within the component's editor when an order is placed
 * @return {[type]} [description]
 */
DocumentationAPComponent.prototype.onOrderAdded = function() {
    DocumentationBaseComponent.prototype.onOrderAdded.call(this);
    this.updateEMRContent();
};

/**
 * Map the DocumentationAPComponent object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ASSESSMENT_PLAN" filter 
 */
MP_Util.setObjectDefinitionMapping("WF_ASSESSMENT_PLAN", DocumentationAPComponent);
