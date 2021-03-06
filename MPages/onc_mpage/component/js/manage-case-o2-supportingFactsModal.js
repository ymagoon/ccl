var ManageCaseWorkFlow=ManageCaseWorkFlow||{};
ManageCaseWorkFlow.supportingFactsModal=(function(){function modal(supportingFactsData,component,caseInformation){var i18nMcO2=component.i18n,modalId=component.getComponentId()+"supportingFactsModal",modalDialog;
MP_ModalDialog.deleteModalDialogObject(modalId);
modalDialog=new ModalDialog(modalId);
modalDialog.setHeaderTitle(i18nMcO2.SUPPORTING_FACTS_MODAL_TITLE).setTopMarginPercentage(20).setRightMarginPercentage(20).setBottomMarginPercentage(20).setLeftMarginPercentage(20).setIsBodySizeFixed(true).setIsFooterAlwaysShown(true);
var closeButton=new ModalButton(component.namespace+"close-modal").setText(i18nMcO2.CLOSE_TEXT).setCloseOnClick(true);
modalDialog.addFooterButton(closeButton);
modalDialog.setBodyDataFunction(function(modalObj){modalObj.setBodyHTML(supportingFactsData.template);
});
MP_ModalDialog.updateModalDialogObject(modalDialog);
MP_ModalDialog.showModalDialog(modalId);
}function supportingFacts(component,caseInformation){addSupportingFactFields(caseInformation.PROGRAMS,component.i18n);
return createSupportingFactsDisplay(caseInformation.PROGRAMS,component.i18n,component);
}function createTable(id,columns,namespace,i18nManageCaseO2){function toDashCase(string){return string.toLowerCase().replace(/([_])/g,"-");
}function createColumn(field,options,namespace){var column=new TableColumn();
column.setCustomClass(options.cssClass);
column.setColumnId(options.id||toDashCase(field));
column.setColumnDisplay(options.display||i18nManageCaseO2[field]);
column.setIsSortable(options.sortable||false);
column.setPrimarySortField(options.sort||field);
column.setRenderTemplate(options.template||"${"+field+"}");
return column;
}var supportingFactsTable=new ComponentTable();
supportingFactsTable.setCustomClass(namespace+"-table");
supportingFactsTable.setNamespace(namespace+"-"+id);
var supportingFactsColumns=$.map(columns,function(column,_){return createColumn(column.field,column.options,namespace);
});
$.each(supportingFactsColumns,function(_,column){supportingFactsTable.addColumn(column);
});
return supportingFactsTable;
}function addSupportingFactFields(programs,i18nManageCaseO2){$.each(programs,function(_,program){if(program.SUPPORTING_DATA_POINTS_STR){program.SUPPORTING_DATA_POINTS=(JSON.parse(program.SUPPORTING_DATA_POINTS_STR)).SUPPORTING_DATA_POINTS;
}program.SUPPORTING_DATA_POINTS=program.SUPPORTING_DATA_POINTS||[];
$.each(program.SUPPORTING_DATA_POINTS,function(type,supportingFact){if(supportingFact&&supportingFact.length>0){var data_partition_desc,source_type;
$.each(supportingFact,function(_,dataPoint){source_type=(dataPoint.SOURCE&&dataPoint.SOURCE.TYPE)?dataPoint.SOURCE.TYPE:i18nManageCaseO2.NO_DATA;
data_partition_desc=(dataPoint.SOURCE&&dataPoint.SOURCE.PARTITION_DESCRIPTION)?dataPoint.SOURCE.PARTITION_DESCRIPTION:i18nManageCaseO2.NO_DATA;
if(source_type===i18nManageCaseO2.NO_DATA){dataPoint.FORMATTED_SOURCE=data_partition_desc;
}else{dataPoint.FORMATTED_SOURCE=i18nManageCaseO2.FORMATTED_SOURCE.replace("{partition}",data_partition_desc).replace("{type}",source_type);
}dataPoint.TYPE=type;
dataPoint.IDENTIFICATION_DATE=dataPoint.DATE;
if(dataPoint.CODE&&dataPoint.CODE_SYSTEM){dataPoint.DESCRIPTION=i18nManageCaseO2.DESCRIPTION_BODY.replace("{name}",dataPoint.NAME).replace("{code_system}",dataPoint.CODE_SYSTEM).replace("{code}",dataPoint.CODE);
}else{dataPoint.DESCRIPTION=dataPoint.NAME;
}});
}});
});
}function createSupportingFactsTable(dataPointGroups,i18nManageCaseO2,component,tableId){var supportingFacts=[],groups=[];
$.each(dataPointGroups,function(type,dataPoints){if(dataPoints&&dataPoints.length>0){type=type.toUpperCase();
var group={key:"type",value:i18nManageCaseO2[type]||type,data:dataPoints};
groups=groups.concat(group);
supportingFacts=supportingFacts.concat(dataPoints);
}});
var columns=[{field:"DESCRIPTION",options:{id:"data-point-description",cssClass:"manageCaseWf-data-point",display:i18nManageCaseO2.DESCRIPTION}},{field:"FORMATTED_SOURCE",options:{id:"source",cssClass:"manageCaseWf-data-point",display:i18nManageCaseO2.SOURCE}},{field:"IDENTIFICATION_DATE",options:{id:"data-point-date",cssClass:"manageCaseWf-data-point",display:i18nManageCaseO2.SUPPORTING_FACT_DATE}}];
var supportingFactsTable=createTable("supporting-facts"+tableId,columns,component.namespace,i18nManageCaseO2).bindData(supportingFacts);
supportingFactsTable=addTableGroups(groups,supportingFactsTable);
return supportingFactsTable;
}function createSupportingFactsDisplay(programs,i18nManageCaseO2,component){var dateFormatter=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var supportingFactsHtml="";
var supportingDataPoints;
var supportingFactsTable;
var supportingFactsDisplay;
var dataPointsPresent=false;
var tables=$.map(programs,function(program,index){supportingDataPoints=program.SUPPORTING_DATA_POINTS;
if(supportingDataPoints){$.each(supportingDataPoints,function(_,dataPoint){dataPointsPresent=dataPoint.length>0;
if(dataPointsPresent){return false;
}});
if(dataPointsPresent){supportingFactsTable=createSupportingFactsTable(supportingDataPoints,i18nManageCaseO2,component,index);
supportingFactsDisplay=supportingFactsTable.render();
}else{supportingFactsDisplay="<div class='"+component.namespace+"-no-supporting-facts'>"+i18nManageCaseO2.NO_SUPPORTING_FACTS_PRESENT+"</div>";
}supportingFactsHtml=supportingFactsHtml.concat("<div class ='"+component.namespace+"-supporting-fact'><dl class ='"+component.namespace+"-inline-list "+component.namespace+"-program-header'><dt>"+i18nManageCaseO2.PROGRAM+"</dt><dd>"+program.NAME+"</dd><dt>"+i18nManageCaseO2.DATE_IDENTIFICATION+"</dt><dd>"+dateFormatter.formatISO8601(program.IDENTIFICATION_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR)+"</dt></dl>"+supportingFactsDisplay+"</div>");
return supportingFactsTable;
}});
return{template:supportingFactsHtml,tables:tables};
}function addTableGroups(groups,table){function capitalize(groupValue){return groupValue.charAt(0).toUpperCase()+groupValue.slice(1);
}$.each(groups,function(_,group){var id=group.value.toUpperCase(),tableGroup=new TableGroup();
tableGroup.setGroupId(id);
tableGroup.setKey(group.key);
tableGroup.setValue(group.value);
tableGroup.setDisplay(capitalize(group.value));
tableGroup.setCanCollapse(true);
tableGroup.setShowCount(true);
tableGroup.bindData(group.data);
table.addGroup(tableGroup);
});
var groupToggleExtension=new TableGroupToggleCallbackExtension().setGroupToggleCallback(function(event,data){if(data.GROUP_DATA.EXPANDED){table.openGroup(data.GROUP_DATA.GROUP_ID);
}else{table.collapseGroup(data.GROUP_DATA.GROUP_ID);
}});
table.addExtension(groupToggleExtension);
return table;
}ManageCaseWorkFlow.__supportingFactsModal={modal:modal};
return function(component,caseInformation){var supportingFactsData=supportingFacts(component,caseInformation);
modal(supportingFactsData,component,caseInformation);
$.each(supportingFactsData.tables,function(_,table){table.finalize();
});
};
})();
