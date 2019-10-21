function DocumentationPEComponentStyle(){this.initByNamespace("documentation-pe");
}DocumentationPEComponentStyle.inherits(ComponentStyle);
function DocumentationPEComponent(criterion){this.setCriterion(criterion);
this.setStyles(new DocumentationPEComponentStyle());
this.setDocumentationTimerName("MPG.DOCUMENTATION_PE.O1");
this.setComponentLoadTimerName("USR:"+this.getDocumentationTimerName()+" - load component");
this.setComponentRenderTimerName("ENG:"+this.getDocumentationTimerName()+" - render component");
this.setIncludeLineNumber(true);
this.setConceptType("PE");
this.setConceptCKI("CERNER!6FBDAE1E-FCF5-4B54-86F7-C3B71DF04EEB");
this.setPlaceholderText(i18n.discernabu.documentation_pe.PLACEDHOLDER_TEXT);
}DocumentationPEComponent.inherits(DocumentationBaseComponent);
DocumentationPEComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WF_PHYSICAL_EXAM_STRUCTURE_DOC",{setFunction:this.setStructuredDocInd,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
MP_Util.setObjectDefinitionMapping("WF_PHYSICAL_EXAM",DocumentationPEComponent);
MP_Util.setObjectDefinitionMapping("WF_PHYSICAL_EXAM_STRUCT",DocumentationPEComponent);