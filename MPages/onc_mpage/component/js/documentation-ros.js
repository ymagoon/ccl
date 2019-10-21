function DocumentationROSComponentStyle(){this.initByNamespace("documentation-ros");
}DocumentationROSComponentStyle.inherits(ComponentStyle);
function DocumentationROSComponent(criterion){this.setCriterion(criterion);
this.setStyles(new DocumentationROSComponentStyle());
this.setDocumentationTimerName("MPG.DOCUMENTATION_ROS.O1");
this.setComponentLoadTimerName("USR:"+this.getDocumentationTimerName()+" - load component");
this.setComponentRenderTimerName("ENG:"+this.getDocumentationTimerName()+" - render component");
this.setIncludeLineNumber(true);
this.setConceptType("ROS");
this.setConceptCKI("CERNER!4A1CCEE7-3912-4580-9CAC-8BB69492AA17");
this.setPlaceholderText(i18n.discernabu.documentation_ros.PLACEDHOLDER_TEXT);
}DocumentationROSComponent.inherits(DocumentationBaseComponent);
DocumentationROSComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WF_REVIEW_SYMPT_STRUCTURE_DOC",{setFunction:this.setStructuredDocInd,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
MP_Util.setObjectDefinitionMapping("WF_REVIEW_SYMPT",DocumentationROSComponent);
MP_Util.setObjectDefinitionMapping("WF_REVIEW_SYMPT_STRUCT",DocumentationROSComponent);