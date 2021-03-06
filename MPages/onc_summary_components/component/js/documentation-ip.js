function DocumentationIPComponentStyle(){this.initByNamespace("documentation-ip");
}DocumentationIPComponentStyle.inherits(ComponentStyle);
function DocumentationIPComponent(criterion){this.setCriterion(criterion);
this.setStyles(new DocumentationIPComponentStyle());
this.setDocumentationTimerName("MPG.DOCUMENTATION_IP.O1");
this.setComponentLoadTimerName("USR:"+this.getDocumentationTimerName()+" - load component");
this.setComponentRenderTimerName("ENG:"+this.getDocumentationTimerName()+" - render component");
this.setIncludeLineNumber(true);
this.setConceptType("IP");
this.setPlaceholderText(i18n.discernabu.documentation_ip.PLACEDHOLDER_TEXT);
}DocumentationIPComponent.inherits(DocumentationBaseComponent);
