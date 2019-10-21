/**
 * Create the ROS documentation component style object
 * @constructor
 */
function DocumentationROSComponentStyle(){
    this.initByNamespace("documentation-ros");
}
DocumentationROSComponentStyle.inherits(ComponentStyle);

/**
 * The Review of System documentation component will instantiate an editor
 *
 * @constructor
 * @param {Criterion} criterion
 */
function DocumentationROSComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DocumentationROSComponentStyle());
    
    // set generic timer name as well as load and render timer names
    this.setDocumentationTimerName("MPG.DOCUMENTATION_ROS.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");
    
    this.setIncludeLineNumber(true);

    // set event type to ROS
    this.setConceptType('ROS');
    this.setConceptCKI('CERNER!4A1CCEE7-3912-4580-9CAC-8BB69492AA17');
    
    this.setPlaceholderText(i18n.discernabu.documentation_ros.PLACEDHOLDER_TEXT);
}

DocumentationROSComponent.inherits(DocumentationBaseComponent);

DocumentationROSComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_REVIEW_SYMPT_STRUCTURE_DOC",{setFunction : this.setStructuredDocInd,type: "BOOLEAN", field : "FREETEXT_DESC"});
};


/**
 * Map the class to the bedrock filter mapping so the architecture will know what class to instantiate
 * when it sees the filter
 */
MP_Util.setObjectDefinitionMapping("WF_REVIEW_SYMPT", DocumentationROSComponent);
//Add mappings for structured version of this component
MP_Util.setObjectDefinitionMapping("WF_REVIEW_SYMPT_STRUCT", DocumentationROSComponent);
