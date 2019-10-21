/*******************************
 * Labs
 * @constructor
 */
function LabsCPMComponentStyle(){
    this.initByNamespace("cpmLAB");
}
LabsCPMComponentStyle.prototype = new ComponentStyle();
LabsCPMComponentStyle.prototype.constructor = ComponentStyle;

function LabsCPMComponent(criterion){
	var cpmDocI18n = i18n.discernabu.laboratory_cpm_o1;
	this.setComponentLoadTimerName("USR:MPG.LABORATORY.CPM - load component");
    this.setComponentRenderTimerName("ENG:MPG.LABORATORY.CPM - render component");
	
    this.setCriterion(criterion);
    this.setStyles(new LabsCPMComponentStyle());
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);
    this.SIDE_PANEL_AVAILABLE = false;

    this.m_labelColumnWidth = 200;
    this.m_eventSets = null;
    this.m_secondaryEventSets = null;
    this.m_grouper_arr = [];
    
    this.setConceptGroupMeanings("RELRESLAB");
    this.setShowAmbulatoryView(true);
    this.SHOW_SIDE_PANEL = false;
    this.m_ambulatoryColumnCount = 3;
}

LabsCPMComponent.prototype = new LaboratoryComponentWF();
LabsCPMComponent.prototype.constructor = LabsCPMComponent;

CPMMPageComponent.attachMethods(LabsCPMComponent);

LabsCPMComponent.prototype.getEventSets = function(){
    if (!this.m_eventSets){
        this.m_eventSets = [];
    }
    return this.m_eventSets;
};

LabsCPMComponent.prototype.setEventSets = function(eSets){
    this.m_eventSets = eSets;
};

LabsCPMComponent.prototype.getSecondaryEventSets = function(){
    if (!this.m_secondaryEventSets){
        this.m_secondaryEventSets = [];
    }
    return this.m_secondaryEventSets;
};

LabsCPMComponent.prototype.setSecondaryEventSets = function(eSets){
    this.m_secondaryEventSets = eSets;
};

LabsCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
    
    if (!conceptGroupConfig){
        return;
    }
    
    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);

    this.setEventSets(null);
    var eventSetList = this.getEventSets();
    var secondaryEventSetList = this.getSecondaryEventSets();
    var componentDetailList;
    var detailList;
    var cLen;
    var i;
    var x;
    var xl;

    cLen = conceptGroupConfig.length;
    for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "RELRESLAB"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            for(x = 0, xl = detailList.length; x < xl; x++){
                if (detailList[x].CONCEPT_ENTITY_NAME === "V500_EVENT_SET_CODE"){
                    eventSetList.push(detailList[x].CONCEPT_ENTITY_ID);
                } else if (detailList[x].CONCEPT_ENTITY_NAME === "CODE_VALUE"){
                    eventSetList.push(detailList[x].CONCEPT_ENTITY_ID);
                }
            }
        }
    }
    
    cLen = componentConfig.length;
    for (i = 0; i < cLen; i++){
        if (componentConfig[i].ENTITY_NAME === "V500_EVENT_SET_CODE" || componentConfig[i].ENTITY_NAME === "CODE_VALUE") {
            eventSetList.push(componentConfig[i].ENTITY_ID);
        }
    }
};

LabsCPMComponent.prototype.retrieveComponentData = function(){
    var self = this;
    var criterion = this.getCriterion();
    var sendAr = [];

    var replyHandler = function (reply) {
        var replyObj = reply;
        self.renderComponent(replyObj.getResponse());
    };

    var encntrSelection = (this.getScope() === 2) ? (criterion.encntr_id + ".0") : "0.0";

    sendAr.push("^MINE^"
        , criterion.person_id + ".0"
        , encntrSelection
        , criterion.provider_id + ".0"
        , criterion.ppr_cd + ".0"
        , this.getLookbackUnits()
        , this.getLookbackUnitTypeFlag()
        , "^^" //Begin Date/Time
        , "^^" //End Date/Time
        , MP_Util.CreateParamArray(this.getEventSets(), 1)
        , MP_Util.CreateParamArray(this.getSecondaryEventSets(), 1)
        , 4000);
   
    scriptRequest = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
    scriptRequest.setProgramName("MP_RETRIEVE_LABS_GROUP_DATA");
    scriptRequest.setParameters(sendAr);
    scriptRequest.setAsync(true);
    MP_Core.XMLCCLRequestCallBack(this, scriptRequest, replyHandler);

};

LabsCPMComponent.prototype.resetSizingCalculations = function(){
    this.m_latestColumnCap = 0;
    this.m_contentTableWidth = 0;
    this.m_contentTableBodyHeight = 0;
    this.m_contentTableContentsHeight = 0;
};

CPMController.prototype.addComponentMapping("LAB", LabsCPMComponent);
CPMController.prototype.addComponentMapping("LABS", LabsCPMComponent); //"LABS"
