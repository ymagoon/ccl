/**
 * Create the PE documentation component style object
 * @constructor
 */
function DocumentationPEComponentStyle(){
    this.initByNamespace("documentation-pe");
}
DocumentationPEComponentStyle.inherits(ComponentStyle);

/**
 * The Physical Exam documentation component will instantiate an editor
 *
 * @constructor
 * @param {Criterion} criterion
 */
function DocumentationPEComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DocumentationPEComponentStyle());
    
    // set generic timer name as well as load and render timer names
    this.setDocumentationTimerName("MPG.DOCUMENTATION_PE.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");

    this.setIncludeLineNumber(true);
    
    // set concept type to PE
    this.setConceptType('PE');
    this.setConceptCKI('CERNER!6FBDAE1E-FCF5-4B54-86F7-C3B71DF04EEB');
    
    this.setPlaceholderText(i18n.discernabu.documentation_pe.PLACEDHOLDER_TEXT);
}

DocumentationPEComponent.inherits(DocumentationBaseComponent);

DocumentationPEComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_PHYSICAL_EXAM_STRUCTURE_DOC",{setFunction : this.setStructuredDocInd,type: "BOOLEAN", field : "FREETEXT_DESC"});
};


/**
 * Map the class to the bedrock filter mapping so the architecture will know what class to instantiate
 * when it sees the filter
 */
MP_Util.setObjectDefinitionMapping("WF_PHYSICAL_EXAM", DocumentationPEComponent);
//Add mappings for structured version of this component
MP_Util.setObjectDefinitionMapping("WF_PHYSICAL_EXAM_STRUCT", DocumentationPEComponent);
