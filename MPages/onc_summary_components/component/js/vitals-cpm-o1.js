/**
 * Create the component style object which will be used to style various aspects of our component
 */
function VitalsCPMComponentStyle(){
    this.initByNamespace("vitalsCPM");
}

VitalsCPMComponentStyle.prototype = new ComponentStyle();
VitalsCPMComponentStyle.prototype.constructor = ComponentStyle;


/**
 * @constructor
 * Initialize the Vital Signs CPM Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 */
function VitalsCPMComponent(criterion){
	var cpmDocI18n = i18n.discernabu.vitals_cpm_o1;
	// set timers
	this.setComponentLoadTimerName("USR:MPG.VITALSIGNS.CPM - load component");
	this.setComponentRenderTimerName("ENG:MPG.VITALSIGNS.CPM - render component");

    this.setCriterion(criterion);
    this.setStyles(new VitalsCPMComponentStyle());
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);
    this.SIDE_PANEL_AVAILABLE = false;
 	this.setConceptGroupMeanings("RELRESVITALS");

    this.m_cpmEventSets = null;
    this.SHOW_SIDE_PANEL = false;
    this.setShowAmbulatoryView(true);
    this.m_ambViewColumnCnt = 3;
}

/**
 * Inherits from the Workflow Vital Signs component
 */
VitalsCPMComponent.prototype = new VitalSignComponentWF();
VitalsCPMComponent.prototype.constructor = VitalsCPMComponent;

CPMMPageComponent.attachMethods(VitalsCPMComponent);

VitalsCPMComponent.prototype.getCPMEventSets = function(){
    if (!this.m_cpmEventSets){
        this.m_cpmEventSets = [];
    }
    return this.m_cpmEventSets;
};
VitalsCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){

    if (!conceptGroupConfig){
        return;
    }

    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);

    var eventSets = this.getCPMEventSets();
    var detailList;
    var cLen;
    var i;
    var x;
    var xl;

    cLen = conceptGroupConfig.length;
    for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "RELRESVITALS"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            for(x = 0, xl = detailList.length; x < xl; x++){
                if (detailList[x].CONCEPT_ENTITY_NAME === "CODE_VALUE"){
                    eventSets.push(detailList[x].CONCEPT_ENTITY_ID);
                }
            }
        }
    }
};

//Overriding workflow component's implementation
VitalsCPMComponent.prototype.retrieveComponentData = function(){
    var self = this;
    var criterion = this.getCriterion();
    var sendAr = [];
    var scriptRequest = null;
    var eventSets = this.getCPMEventSets();
    var eventSetsParam = (eventSets.length) ? MP_Util.CreateParamArray(eventSets, 1) : "0.0";

    var replyHandler = function (reply) {
        var replyObj = reply;
        self.renderComponent(replyObj.getResponse());
    };

    sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , criterion.ppr_cd + ".0"
        , this.getLookbackUnits()
        , this.getLookbackUnitTypeFlag()
        , "^^" //begin_dt_tm
        , "^^" //end_dt_tm
        , "0.0" //temperature codes
        , "0.0" //heart rate codes
        , eventSetsParam //other
        , "^^" //BP string
        , eventSetsParam
        , 4000
    );

    scriptRequest = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
    scriptRequest.setProgramName("MP_RETRIEVE_VITALS_GROUP_DATA");
    scriptRequest.setParameters(sendAr);
    scriptRequest.setAsync(true);
    MP_Core.XMLCCLRequestCallBack(this, scriptRequest, replyHandler);
};

CPMController.prototype.addComponentMapping("VITAL_MEAS", VitalsCPMComponent);
CPMController.prototype.addComponentMapping("VITALS_MEAS", VitalsCPMComponent);
