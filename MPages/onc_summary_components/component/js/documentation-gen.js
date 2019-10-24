/**
 * Create the Generic Documentation component style object
 * @constructor
 */
function DocumentationGenComponentStyle(){
    this.initByNamespace("documentation-gen");
}
DocumentationGenComponentStyle.prototype = new ComponentStyle();

/**
 * The Generic Documentation Component Constructor
 * @constructor
 * @param {Criterion} criterion
 */
function DocumentationGenComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DocumentationGenComponentStyle());

    //Set generic timer name as well load/render timer names
    this.setDocumentationTimerName("MPG.DOCUMENTATION_GEN.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + "_load_component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + "_render_component");

    this.setIncludeLineNumber(true);

    this.setConceptType('');

    this.setPlaceholderText('');
}

DocumentationGenComponent.prototype = new DocumentationBaseComponent();
DocumentationGenComponent.prototype.constructor = DocumentationBaseComponent;

/**
 * Override component's preProcessing method to disable the PLUS button in the header
 */
DocumentationGenComponent.prototype.preProcessing = function(){
    DocumentationBaseComponent.prototype.preProcessing.call(this);

    this.setPlusAddEnabled(false);
};


/**
 * Sets up callback methods to execute for given bedrock filters
 */
DocumentationGenComponent.prototype.loadFilterMappings = function(){
    this.addFilterMappingObject("WF_GDD_CKI_1", {
        setFunction: this.setConceptCKI
        , type: "STRING"
        , field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("WF_GDD_CKI_2", {
        setFunction: this.setConceptCKI
        , type: "STRING"
        , field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("WF_GDD_CKI_3", {
        setFunction: this.setConceptCKI
        , type: "STRING"
        , field: "FREETEXT_DESC"
    });

};

/**
 * Map the class to the bedrock filter mapping so the architecture will know what class to instantiate
 * when it sees the filter
 */
MP_Util.setObjectDefinitionMapping("WF_GDD_COMP_1", DocumentationGenComponent);
MP_Util.setObjectDefinitionMapping("WF_GDD_COMP_2", DocumentationGenComponent);
MP_Util.setObjectDefinitionMapping("WF_GDD_COMP_3", DocumentationGenComponent);