/**
 * Create the component style object which will be used to style various aspects of our component
 */
function DocumentsCPMComponentStyle(){
    this.initByNamespace("doc2");
}

DocumentsCPMComponentStyle.prototype = new ComponentStyle();
DocumentsCPMComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Existing Orders Intelligent Ordering Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 */
function DocumentsCPMComponent(criterion){
    var cpmDocI18n = i18n.discernabu.documents_cpm_o1;

    this.setCriterion(criterion);
    this.setStyles(new DocumentsCPMComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.RELRESDOC.CPM - load component");
	this.setComponentRenderTimerName("ENG:MPG.RELRESDOC.CPM - render component");
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);

    this.m_cpmEventSets = null;
    
    this.setConceptGroupMeanings("RELRESDOC");
}

/**
 * Inherits from the DocumentsWFMPageComponent which inherits from MPageComponent
 */
DocumentsCPMComponent.prototype = new DocumentComponent2();
DocumentsCPMComponent.prototype.constructor = DocumentsCPMComponent;

CPMMPageComponent.attachMethods(DocumentsCPMComponent);

/**
 * Grab the document eventsets from the CPM framework to load into the documents component.
 */
DocumentsCPMComponent.prototype.getCPMEventSets = function(){
    if (!this.m_cpmEventSets){
        this.m_cpmEventSets = [];
    }
    return this.m_cpmEventSets;
};

DocumentsCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
   
    if (!conceptGroupConfig){
        return;
    }

    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);

    var eventSets = this.getCPMEventSets();
    var componentDetailList = null;
    var detail;
    var cLen;
    var i;
    var x;
    var xl;

    cLen = conceptGroupConfig.length;
    for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "RELRESDOC"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            for(x = 0, xl = detailList.length; x < xl; x++){
                if (detailList[x].CONCEPT_ENTITY_NAME === "V500_EVENT_SET_CODE"){
                    eventSets.push(detailList[x].CONCEPT_ENTITY_ID);
                } else if (detailList[x].CONCEPT_ENTITY_NAME === "CODE_VALUE"){
                    eventSets.push(detailList[x].CONCEPT_ENTITY_ID);
                }
            }
        }
    }
};

DocumentsCPMComponent.prototype.createFilterHTML = function(){
	return "";
};
DocumentsCPMComponent.prototype.qFilterHover = function() {
	return;
};

//Overriding workflow component's implementation
DocumentsCPMComponent.prototype.retrieveComponentData = function() {
	var self = this;
	var criterion = this.getCriterion();
	var encntrSelection = 0.0;
	var eventSetArr = [];
	var eventSetsParam;
	var loadDocImages = 0;
	var loadPowerNoteFavs = 0;
	var paramArr = [];
	var scriptRequest = null;
	
    eventSetArr = this.getCPMEventSets();
    eventSetsParam = (eventSetArr.length) ? MP_Util.CreateParamArray(eventSetArr, 1) : "0.0";

	//Reset the specialty Event Set filter list	
	this.specEventFil = [];
	
	var replyHandler = function (reply) {
		var replyObj = reply;
		if(typeof CERN_DOCUMENT_O2 !== 'undefined'){
			CERN_DOCUMENT_O2.RenderReply(replyObj);	
		}
		else{
			self.renderComponent(replyObj);
		}
	};	
	
	//Prepare the parameter list for the script call
	encntrSelection = (this.getScope() === 2) ? (criterion.encntr_id + ".0") : "0.0";
	loadDocImages = (this.getDocImagesInd()) ? 1 : 0;
	if(this.isPlusAddEnabled()){
		loadPowerNoteFavs = this.getPowerNoteFavInd() ? 1 : 0;
	}

	paramArr.push("^MINE^", 
		criterion.person_id + ".0", 
		encntrSelection, 
		criterion.provider_id + ".0", 
		this.getLookbackUnits(),
		MP_Util.CreateParamArray(eventSetArr, 1),
		0.0,
		criterion.ppr_cd + ".0", 
		this.getLookbackUnitTypeFlag(),
		loadDocImages,
		loadPowerNoteFavs);
	
	this.isRetrievingData = true;
	scriptRequest = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	scriptRequest.setProgramName("MP_RETRIEVE_DOCUMENTS_JSON_DP");
	scriptRequest.setParameters(paramArr);
	scriptRequest.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(this, scriptRequest, replyHandler);
};

CPMController.prototype.addComponentMapping("CLIN_DC", DocumentsCPMComponent);
CPMController.prototype.addComponentMapping("CLIN_DOC", DocumentsCPMComponent);
