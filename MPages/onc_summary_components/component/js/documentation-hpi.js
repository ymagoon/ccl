/**
 * Create the HPI documentation component style object
 * @constructor
 */
function DocumentationHPIComponentStyle(){
    this.initByNamespace("documentation-hpi");
}
DocumentationHPIComponentStyle.inherits(ComponentStyle);

/**
 * The HPI documentation component will instantiate an editor
 *
 * @constructor
 * @param {Criterion} criterion
 */
function DocumentationHPIComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DocumentationHPIComponentStyle());
    
    // set generic timer name as well as load and render timer names
    this.setDocumentationTimerName("MPG.DOCUMENTATION_HPI.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");
    
    this.setIncludeLineNumber(true);
    
    // set concept type to HPI
    this.setConceptType('HPI');
    this.setConceptCKI('CERNER!FD654C23-C8A6-4393-9955-80D59015EE6F');
    
    this.setPlaceholderText(i18n.discernabu.documentation_hpi.PLACEDHOLDER_TEXT);
}

DocumentationHPIComponent.inherits(DocumentationBaseComponent);

DocumentationHPIComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_HX_PRESENT_STRUCTURE_DOC",{setFunction : this.setStructuredDocInd,type: "BOOLEAN", field : "FREETEXT_DESC"});
};


/**
 * Map the class to the bedrock filter mapping so the architecture will know what class to instantiate
 * when it sees the filter
 */
MP_Util.setObjectDefinitionMapping("WF_HX_PRESENT_ILL", DocumentationHPIComponent);
// Add mappings for structured version of this component
MP_Util.setObjectDefinitionMapping("WF_HX_PRESENT_ILL_STRUCT", DocumentationHPIComponent);
