var docComponentCnt=0;
function PathwayDocComponentCPMStyle(cnt){cnt=cnt||0;
this.initByNamespace("po_doc"+cnt);
}PathwayDocComponentCPMStyle.inherits(ComponentStyle);
function PathwayDocComponentCPM(criterion){this.setCriterion(criterion);
this.setStyles(new PathwayDocComponentCPMStyle(docComponentCnt));
docComponentCnt++;
}PathwayDocComponentCPM.prototype=new CPDocumentationBaseComponent();
PathwayDocComponentCPM.prototype.constructor=PathwayDocComponentCPM;
PathwayDocComponentCPM.prototype.processComponentConfig=function(componentConfig){var cpComponentId=this.getCpComponentId();
var sharedResource=MP_Resources.getSharedResource("CP_SETTINGS_"+this.getPathwayId());
var detail;
var x;
for(x=componentConfig.length;
x--;
){detail=componentConfig[x];
switch(detail.DETAIL_RELTN_CD_MEAN){case"DOCCONTENT":this.setStructureDocClinIdent(detail.ENTITY_IDENT);
break;
case"DOCEVENTS":this.setDocEventsId(detail.ENTITY_ID);
break;
case"DOCTERMDEC":this.setDocDecorationsId(detail.ENTITY_ID);
break;
}}if(sharedResource){var resourceData=sharedResource.getResourceData();
if(resourceData){var instance=resourceData.PATHWAY_INSTANCE;
var actions,node,component,action,details,y,i,j,a,f;
if(instance){actions=instance.PATHWAY_ACTIONS;
for(x=actions.NODE_LIST.length;
x--;
){node=actions.NODE_LIST[x];
for(y=node.COMPONENT_LIST.length;
y--;
){component=node.COMPONENT_LIST[y];
if(component.COMPONENT_ID===cpComponentId){for(i=0,j=component.ACTIONS.length;
i<j;
i++){action=component.ACTIONS[i];
if(["COMMITASSESS","COMMITTREAT"].indexOf(action.ACTION_TYPE_MEAN)>-1){details=action.ACTION_DETAILS;
for(a=0,f=details.length;
a<f;
a++){if(details[a].ACTION_DETAIL_TYPE_MEAN==="INERRORDOC"){break;
}if(details[a].ACTION_DETAIL_TYPE_MEAN==="SAVEDOC"){this.setPathwayDocEventId(details[a].ENTITY_ID);
break;
}}break;
}}break;
}}}}}}};
MP_Util.setObjectDefinitionMapping("PW_QUESTION_PARAM",PathwayDocComponentCPM);
