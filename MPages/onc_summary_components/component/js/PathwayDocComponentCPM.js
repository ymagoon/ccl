var docComponentCnt = 0;

function PathwayDocComponentCPMStyle(cnt) {
	cnt = cnt || 0;

	this.initByNamespace("po_doc" + cnt);
}

PathwayDocComponentCPMStyle.inherits(ComponentStyle);

function PathwayDocComponentCPM(criterion) {
	var pathwaysDocI18n = i18n.innovations.cp_documentation_base;
	this.setCriterion(criterion);
	this.setLabel(pathwaysDocI18n.CRITERIA);
	this.setStyles(new PathwayDocComponentCPMStyle(docComponentCnt));
	docComponentCnt++;
}

PathwayDocComponentCPM.prototype = new CPDocumentationBaseComponent();
PathwayDocComponentCPM.prototype.constructor = PathwayDocComponentCPM;

PathwayDocComponentCPM.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig) {
	var compDetailsList;
	if(componentConfig.COMP_DETAIL_LIST)
		compDetailsList = componentConfig.COMP_DETAIL_LIST;
	else
		compDetailsList = componentConfig;
	
	this.processDocIds(compDetailsList);
};

PathwayDocComponentCPM.prototype.processDocIds = function(detailsList){
	var i = 0;
	for ( i = detailsList.length; i--; ) {
		var curCompDetail = detailsList[i];
		switch(curCompDetail.DETAIL_RELTN_CD_MEAN) {
			case "DOCCONTENT":
				this.setStructureDocClinIdent(curCompDetail.ENTITY_IDENT);
				break;
			case "DOCEVENTS":
				this.setDocEventsId(curCompDetail.ENTITY_ID);
				break;
			case "DOCTERMDEC":
				this.setDocDecorationsId(curCompDetail.ENTITY_ID);
				break;
		}
	}
};

PathwayDocComponentCPM.prototype.processPathwayActions = function(pathwayActions) {
	if (!pathwayActions) {
		return;
	}

	var x = 0;
	var xl = 0;
	var y = 0;
	var yl = 0;
	var action = null;
	var acitonDetails = null;

	//Details are in order by date/time so go in order and find first one
	//That will be the latest one to load.

	for ( x = 0, xl = pathwayActions.length; x < xl; x++) {
		action = pathwayActions[x];
		if (action.ACTION_TYPE_MEAN == "COMMITASSESS" || action.ACTION_TYPE_MEAN == "COMMITTREAT") {
			actionDetails = action.ACTION_DETAILS;
			for ( y = 0, yl = actionDetails.length; y < yl; y++) {
				if (actionDetails[y].ACTION_DETAIL_TYPE_MEAN == "INERRORDOC") {
					return;
				}
				if (actionDetails[y].ACTION_DETAIL_TYPE_MEAN == "SAVEDOC") {
					this.setPathwayDocEventId(actionDetails[y].ENTITY_ID);
					return;
				}
			}
		}
	}
};

CPMController.prototype.addComponentMapping("PATHWAY_DOC", PathwayDocComponentCPM); 