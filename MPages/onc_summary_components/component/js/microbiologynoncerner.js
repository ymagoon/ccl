function NonCernerMicrobiologyComponentStyle(){this.initByNamespace("nc-mic");
}NonCernerMicrobiologyComponentStyle.inherits(ComponentStyle);
function NonCernerMicrobiologyComponent(criterion){this.setCriterion(criterion);
this.setStyles(new NonCernerMicrobiologyComponentStyle());
this.setHoverEnabled(false);
this.setComponentLoadTimerName("USR:MPG.NON_CERNER_MICRO.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NON_CERNER_MICRO.O1 - render component");
}NonCernerMicrobiologyComponent.inherits(DocumentBaseComponent);
