function TriageDocComponentStyleO2() {
	this.initByNamespace("tri-o2");
}

TriageDocComponentStyleO2.inherits(ComponentStyle);

/**
 * The Triage prototype component will retrieve the Triage data for an encounter
 * @param {Criterion} criterion
 */
function TriageDocComponentO2(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new TriageDocComponentStyleO2());
	
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.TRIAGE_DOC.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.TRIAGE_DOC.O2 - render component");

	//Set the flag to always show this component as expanded
	this.setAlwaysExpanded(true);
	
	this.m_cLookBack = 0;
	this.m_customLabel = "";
	this.m_generalInfoFlag = false;
	this.m_assesmentFlag = false;
	this.m_suicideRiskFlag = false;
	this.m_advanceDirFlag = false;
	this.m_fallRiskFlag = false;
	this.m_customFlag = false;
	this.m_pregnancyFlag = false;
	this.m_providerFlag = false;
	this.m_domesticFlag = false;
	this.m_nomenclatureCodes = [];
	
}


TriageDocComponentO2.prototype = new MPageComponent();
TriageDocComponentO2.prototype.constructor = MPageComponent;

/* Supporting functions */

/**
 * Sets the care notes look back range.
 * @param {Number} critcalNoteLookBack : Determines the look back range for care notes.
 */
TriageDocComponentO2.prototype.setCriticalNoteLookBack = function(critcalNoteLookBack) {
	this.m_cLookBack = critcalNoteLookBack;
};

/**
 * Retrieves the look back value for care notes.
 * @return {Number} look back value for care notes to be fetched
 */
TriageDocComponentO2.prototype.getCriticalNoteLookBack = function() {
	return this.m_cLookBack;
};

/**
 * Sets the Custom section Label.
 * @param {String} customLabel :value set in the bedrock.
 */
TriageDocComponentO2.prototype.setCustomLabel = function(customLabel) {
	this.m_customLabel = customLabel;
};

/**
 * Retrieves the value set for Custom section Label in bedrock.
 * @return {String} returns the label set in the bedrock
 */
TriageDocComponentO2.prototype.getCustomLabel = function() {
	return this.m_customLabel;
};

/**
 * Sets the generalInfo Flag.
 * @param {Boolean} genInfoFlag :Determines if general Info is configured in bedrock.
 */
TriageDocComponentO2.prototype.setGeneralInfoFlag = function(genInfoFlag) {
	this.m_generalInfoFlag = genInfoFlag;
};

/**
 * Returns the value set generalInfo flag.
 * @return {Boolean} returns the value set for generalInfo flag
 */
TriageDocComponentO2.prototype.getGeneralInfoFlag = function() {
	return this.m_generalInfoFlag;
};

/**
 * Sets AssesmentFlag value.
 * @param {Boolean} assesmentFlag :Determines if general Info is configured in bedrock.
 */
TriageDocComponentO2.prototype.setAssesmentFlag = function(assesmentFlag) {
	this.m_assesmentFlag = assesmentFlag;
};

/**
 * Returns the value set assesment Flag.
 * @return {Boolean} returns the value set for assesment flag
 */
TriageDocComponentO2.prototype.getAssesmentFlag = function() {
	return this.m_assesmentFlag;
};

/**
 * Sets the suicideRisk Flag.
 * @param {Boolean} suicideRiskFlag :Determines if suicide risk is configured in bedrock.
 */
TriageDocComponentO2.prototype.setSuicideRiskFlag = function(suicideRiskFlag) {
	this.m_suicideRiskFlag = suicideRiskFlag;
};

/**
 * Returns the value set suicideRisk Flag.
 * @return {Boolean} returns the value set for suicideRisk flag
 */
TriageDocComponentO2.prototype.getSuicideRiskFlag = function() {
	return this.m_suicideRiskFlag;
};

/**
 * Sets the advDirFlag Flag.
 * @param {Boolean} advDirFlag :Determines if advance directive is configured in bedrock.
 */
TriageDocComponentO2.prototype.setAdvanceDirFlag = function(advDirFlag) {
	this.m_advanceDirFlag = advDirFlag;
};

/**
 * Returns the value set advDirFlag flag.
 * @return {Boolean} returns the value set for advDirFlag flag
 */
TriageDocComponentO2.prototype.getAdvanceDirFlag = function() {
	return this.m_advanceDirFlag;
};

/**
 * Sets the fallRisk Flag.
 * @param {Boolean} fallRiskFlag :Determines if fall risk is configured in bedrock.
 */
TriageDocComponentO2.prototype.setFallRiskFlag = function(fallRiskFlag) {
	this.m_fallRiskFlag = fallRiskFlag;
};

/**
 * Returns the value set fallRisk flag.
 * @return {Boolean} returns the value set for fallRisk flag
 */
TriageDocComponentO2.prototype.getFallRiskFlag = function() {
	return this.m_fallRiskFlag;
};

/**
 * Sets the custom Flag.
 * @param {Boolean} customFlag :Determines if custom section is configured in bedrock.
 */
TriageDocComponentO2.prototype.setCustomFlag = function(customFlag) {
	this.m_customFlag = customFlag;
};

/**
 * Returns the value set custom flag.
 * @return {Boolean} returns the value set for custom flag
 */
TriageDocComponentO2.prototype.getCustomFlag = function() {
	return this.m_customFlag;
};

/**
 * Sets the pregnancy Flag.
 * @param {Boolean} pregnancyFlag :Determines if pregnancy is configured in bedrock.
 */
TriageDocComponentO2.prototype.setPregnancyFlag = function(pregnancyFlag) {
	this.m_pregnancyFlag = pregnancyFlag;
};

/**
 * Returns the value set pregnancy flag.
 * @return {Boolean} returns the value set for pregnancy flag
 */
TriageDocComponentO2.prototype.getPregnancyFlag = function() {
	return this.m_pregnancyFlag;
};

/**
 * Sets the provider Flag.
 * @param {Boolean} providerFlag :Determines if pre-provider section is configured in bedrock.
 */
TriageDocComponentO2.prototype.setProviderFlag = function(providerFlag) {
	this.m_providerFlag = providerFlag;
};

/**
 * Returns the value set provider flag.
 * @return {Boolean} returns the value set for provider flag
 */
TriageDocComponentO2.prototype.getProviderFlag = function() {
	return this.m_providerFlag;
};

/**
 * Sets the domestic Flag.
 * @param {Boolean} domesticFlag :Determines if domestic neglect/trauma section is configured in bedrock.
 */
TriageDocComponentO2.prototype.setDomesticFlag = function(domesticFlag) {
	this.m_domesticFlag = domesticFlag;
};

/**
 * Returns the value set domestic flag.
 * @return {Boolean} returns the value set for domestic flag
 */
TriageDocComponentO2.prototype.getDomesticFlag = function() {
	return this.m_domesticFlag;
};

/**
 * Sets the Nomenclature codes.
 * @param {[Array]} nomenclature :Nomenclature codes assigned in the bedrock.
 */
TriageDocComponentO2.prototype.setNomenclatureCode = function(nomenclature) {
	this.m_nomenclatureCodes = nomenclature;
};

/**
 * Retrieves Nomenclature codes set in bedrock.
 * @return {[Array]} returns nomenclature codes
 */
TriageDocComponentO2.prototype.getNomenclatureCode = function() {
	return this.m_nomenclatureCodes;
};

/**
 * Sets order communication type codes set in bedrock.
 * @param {[Array]} orderTypes :sets order communication type codes
 */
TriageDocComponentO2.prototype.setOrderCommnTypes=function(orderTypes){
	this.m_orderTypes=orderTypes;
};

/**
 * Retrieves order communication type codes set in bedrock.
 * @return {[Array]} returns order communication type codes
 */
TriageDocComponentO2.prototype.getOrderCommnTypes=function(){
	return this.m_orderTypes;
};

TriageDocComponentO2.prototype.retrieveComponentData = function() {
/**************************************************************
creating json structure in the following format
  {"PARAMS":{
			"arrChiefComp":[],
			"arrCritical":[],
			"arrPreArriveNote":[],
			"arrTemp":[],
			"arrHR":[],
			"arrRespRate":[],
			"arrSaturation":[],
			"arrPain":[],
			"arrHeight":[],
			"arrWeight":[],
			"arrBMI":[],
			"arrVisualLeft":[],
			"arrVisualRight":[],
			"arrGCS":[],
			"arrFetalMont":[],
			"arrAccompBy":[],
			"arrADLink":[],
			"arrAD":[],
			"arrCodeChemo":[],
			"arrFallRisk":[],
			"arrMethodToHarmSelf":[],
			"arrSuicidePlan":[],
			"arrMethodToHarmOthers":[],
			"arrIndNamed":[],
			"arrVoilence":[],
			"arrPreArrivalTX":[],
			"arrOrders":[],
			"arrPTAlert":[]
	}}
	and sending the request as a blob input
 **********************************************************/
	var self = this;
	var sendAr;
	var criterion = this.getCriterion();
	var groups = this.getGroups();
	var groupLength = groups.length;
	var sBpParams = "";
	//creating the intial params
	var jsonBlobIn = '{"PARAMS":{';
	
	if (groups && groupLength > 0) {
		for ( x = 0, xl = groupLength; x < xl; x++) {
			var group = groups[x];
			switch (group.getGroupName()) {
				/*LOAD VITALS EVENT SETS */
				case "WF_TRIAGE_TEMP_CE":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrTemp"); 
					break;
				case "WF_TRIAGE_HR_CE":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrHR"); 
					break;
				case "WF_TRIAGE_BP_CE":
					if ( group instanceof MPageGrouper) {
						var bpGroups = group.getGroups();
						for ( z = 0, zl = bpGroups.length; z < zl; z++) {
							var tParams = "";
							var bpCodes = bpGroups[z].getEventCodes();
							if (bpCodes.length === 2) {
								tParams = bpGroups[z].getGroupName() + "," + bpCodes[0] + "," + bpCodes[1];
								if (z > 0) {
									sBpParams += String.fromCharCode(216) + tParams;
								}
								else {
									sBpParams = tParams;
								}
							}
						}

					}
					sBpParams = sBpParams.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
					break;
				case "WF_TRIAGE_PAIN":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrPain"); 
					break;
				case "WF_TRIAGE_RESP":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrRespRate"); 
					break;
				case "WF_TRIAGE_SAT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrSaturation"); 
					break;
				case "WF_TRIAGE_HEIGHT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrHeight"); 
					break;
				case "WF_TRIAGE_WEIGHT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrWeight"); 
					break;
				case "WF_TRIAGE_BMI":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrBMI"); 
					break;
				case "WF_TRIAGE_VISUAL_ACUITY_LEFT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrVisualLeft");
					break;
				case "WF_TRIAGE_VISUAL_ACUITY_RIGHT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrVisualRight");
					break;
				case "WF_TRIAGE_GCS":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrGCS"); 
					break;
				case "WF_TRIAGE_FHT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrFetalMont"); 
					break;
					
				/*LOAD PRE-ARRIVAL NOTES, CRTICIAL NOES, CHIEF COMPLAINT  EVENT SETS */	
				case "WF_TRIAGE_PRE_ARRIVE_NOTE" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrPreArriveNote"); 
					break;
				case "WF_TRIAGE_CARE_NOTE":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCritical"); 
					break;
				case "WF_TRIAGE_CHIEF_COMP_CE":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrChiefComp"); 
					break;
					
				/*GENERAl SECTION EVENT SETS*/	
				case "WF_TRIAGE_INFO_GIVEN_BY":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrInfoGiven"); 
					self.setGeneralInfoFlag(true);
					break;
				case "WF_TRIAGE_ACCOMPANIED_BY":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrAccompBy"); 
					self.setGeneralInfoFlag(true);
					break;
				case "WF_TRIAGE_MOA":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrMOA"); 
					self.setGeneralInfoFlag(true);
					break;
				case "WF_TRIAGE_LANGUAGE":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrLanguage"); 
					self.setGeneralInfoFlag(true);
					break;
				case "WF_TRIAGE_DOMESTIC_CONCERNS":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrDC"); 
					self.setGeneralInfoFlag(true);
					break;
				case "WF_TRIAGE_WOUND":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrWound"); 
					self.setGeneralInfoFlag(true);
					break;	
					
				/*LOAD ASSESSMENT EVENT SETS*/	
				case "WF_TRIAGE_LOC":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrLOC"); 
					self.setAssesmentFlag(true);
					break;
				case "WF_TRIAGE_ORIENTATION":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrOrient"); 
					self.setAssesmentFlag(true);
					break;
				case "WF_TRIAGE_AFFECT":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrAffect"); 
					self.setAssesmentFlag(true);
					break;
				case "WF_TRIAGE_SKIN_COLOR":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrSkinColor");
					self.setAssesmentFlag(true);
					break;
				case "WF_TRIAGE_SKIN_DESCRIPTION":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrSkinDesc");
					self.setAssesmentFlag(true);
					break;
				case "WF_TRIAGE_RESP_PATTERN":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrRespPatterns");
					self.setAssesmentFlag(true);
					break;	
				case "WF_TRIAGE_FLU" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrFLU");
					self.setAssesmentFlag(true);
					break;
				
				/*LOAD DOMESTIC NEGLECT OR TRAUMA EVENT SETS*/				
				case "WF_TRIAGE_DOMESTIC_VIOLENCE" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrVoilence");
					self.setDomesticFlag(true);
					break;
				case "WF_TRIAGE_DOMESTIC_TRAUMA" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrTruama");
					self.setDomesticFlag(true);
					break;
				
				/*LOAD PRE-PROVIDER TREATMENTS EVENT SETS*/		
				case "WF_TRIAGE_PRE_ARRIVAL_TX" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrPreArrivalTX");
					self.setProviderFlag(true);
					break;	
					
				/*LOAD PREGNANCY EVENT SETS*/		
				case "WF_TRIAGE_LAST_MENSTRUAL_PRD" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrMenstrualPeriod");
					self.setPregnancyFlag(true);
					break;	
				case "WF_TRIAGE_DUE_DATE" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrDueDate");
					self.setPregnancyFlag(true);
					break;
				case "WF_TRIAGE_GRAVIDA" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrGravida");
					self.setPregnancyFlag(true);
					break;
				case "WF_TRIAGE_PARITY" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrParity");
					self.setPregnancyFlag(true);
					break;
					
				/*LOAD SUICIDE RISK EVENT SETS*/	
				case "WF_TRIAGE_HARM_SELF" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrMethodToHarmSelf");
					self.setSuicideRiskFlag(true);
					break;
				case "WF_TRIAGE_SUICIDE_PLAN" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrSuicidePlan");
					self.setSuicideRiskFlag(true);
					break;	
				case "WF_TRIAGE_HARM_OTHERS" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrMethodToHarmOthers");
					self.setSuicideRiskFlag(true);
					break;	
				case "WF_TRIAGE_NAME" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrIndNamed");
					self.setSuicideRiskFlag(true);
					break;	
				
				/*LOAD ADVANCED DIRECTIVE EVENT SETS*/				
				case "WF_TRIAGE_ADV_DIRECTIVE" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrAD");
					self.setAdvanceDirFlag(true);
					break;
				case "WF_TRIAGE_ADV_DIR_LINK" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrADLink");
					break;
				case "WF_TRIAGE_CODE_CHEMO" :
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCodeChemo");
					self.setAdvanceDirFlag(true);
					break;
				/*LOAD FALL RISK EVENT SETS*/		
				case "WF_TRIAGE_FALL":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrFallRisk");
					self.setFallRiskFlag(true);
					break;
					
				/*LOAD CUSTOM EVENT SETS*/	
				case "WF_TRIAGE_CUSTOM_EVENT1":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCust1");
					self.setCustomFlag(true);
					break;
				case "WF_TRIAGE_CUSTOM_EVENT2":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCust2");
					self.setCustomFlag(true);
					break;
				case "WF_TRIAGE_CUSTOM_EVENT3":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCust3");
					self.setCustomFlag(true);
					break;
				case "WF_TRIAGE_CUSTOM_EVENT4":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCust4");
					self.setCustomFlag(true);
					break;
				case "WF_TRIAGE_CUSTOM_EVENT5":
					jsonBlobIn += TriageDocComponentO2.createTriageJSON(group.getEventSets(),"arrCust5");
					self.setCustomFlag(true);
					break;
				default:
					break;
			}
		}
	}

	var orderCommTypeArray = self.getOrderCommnTypes();
	var orderCommTypeCnt = (orderCommTypeArray) ? orderCommTypeArray.length : 0;
	if(orderCommTypeCnt > 0) {
		jsonBlobIn += TriageDocComponentO2.createTriageJSON(orderCommTypeArray,"arrOrders");
		self.setProviderFlag(true);
	}
	
	jsonBlobIn += TriageDocComponentO2.createTriageJSON(this.getNomenclatureCode(), "arrPTAlert");
	//closing braces for json string
	jsonBlobIn += '}}';
	// replacing the extra comma character with blank
	jsonBlobIn = jsonBlobIn.replace("}],}}","}]}}");

	var curEncounterId = (criterion.encntr_id) ? (criterion.encntr_id + ".0") : "0.0";  //This encounter will get filtered out.
	sendAr = ["^MINE^", criterion.person_id + ".0", curEncounterId,criterion.provider_id + ".0",criterion.ppr_cd+".0","^" + sBpParams + "^", "^^",this.getCriticalNoteLookBack()];
	
	request = new MP_Core.ScriptRequest(self, self.getComponentLoadTimerName());
	request.setProgramName("MP_RETRIEVE_TRIAGE");
	request.setParameters(sendAr);
	request.setAsync(true);
	request.setRequestBlobIn(jsonBlobIn); 
	
	MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
	
		self.renderComponent(reply);
	});  
};

/*
 ** This method will be called only one time, while rendering the component.
 * Display the Triage date to the left of component menu
 **/
TriageDocComponentO2.prototype.displayTimeInterval = function(reply) {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var date = new Date();
	var endDate = "";

	var triCompObject = $("#" + compNS + compID);

	if (!triCompObject.length) {
		return;
	}

	var titleObj = triCompObject.find(".sec-hd");

	if (!titleObj.length) {
		return;
	}

	if (reply.TRIAGE_DT_TM !== "") {
		date.setISO8601(reply.TRIAGE_DT_TM);
	}

	endDate = date.format("longDateTime2");
	
	var timeIntervalObj = $("." + compNS + "-time-interval");

	if (timeIntervalObj.length) {
		timeIntervalObj.text(endDate);
		return;
	}

	timeIntervalObj = "<span class='" + compNS + "-time-interval'>" + endDate + "</span>";
	titleObj.append(timeIntervalObj);
};

TriageDocComponentO2.prototype.getNormalcy = function(normaclyVal){
	// If the normalcy is critical
	var normalcy = "";
	switch(normaclyVal){
		case "CRITICAL" :
		case "EXTREMEHIGH":
		case "PANICHIGH":
		case "EXTREMELOW":
		case "PANICLOW":
		case "VABNORMAL":
		case "POSITIVE":
			normalcy = "tri-o2-severe";
			break;
		case "HIGH" :
			normalcy =  "tri-o2-high";
			break;
		case "LOW" :
			normalcy = "tri-o2-low";
			break;
		default:
			normalcy = "tri-o2-normal";
			break;
	}
	return normalcy;
};

TriageDocComponentO2.prototype.getModifyIndicator = function(statusMean) {
  return (statusMean === "MODIFIED" || statusMean === "ALTERED") ? "<span class='res-modified'>&nbsp</span>" : "";
};

TriageDocComponentO2.prototype.showHoverData = function (eventData) {
	var $self = eventData.data.scope;
	var $tooltipObj = eventData.data.tooltip;
		$self[$tooltipObj].setX(eventData.pageX).setY(eventData.pageY);
		if(this.offsetWidth < this.scrollWidth){
			$self[$tooltipObj].show();
		}
};

TriageDocComponentO2.prototype.postProcessing = function () {
	var $reasonForVisit,
	$probAlert;
	
	var compNS=this.getStyles().getNameSpace();
	var compId=this.getComponentId();
	$reasonForVisit = $("#"+compNS+"-visit-"+compId); 
	$probAlert = $("#"+compNS+"-prob-alert-"+compId);
	
	this.probAlertTooltip = new MPageTooltip();
	this.reasonForVisitTooltip = new MPageTooltip();
	this.probAlertTooltip.setContent("<span class=''>"+$probAlert.text()+"</span>");
	this.reasonForVisitTooltip.setContent("<span class=''>"+$reasonForVisit.text()+"</span>");
	this.probAlertTooltip.setAnchor($probAlert);
	$probAlert.mouseover({
		scope : this,
		tooltip : "probAlertTooltip"
	}, this.showHoverData);
	this.reasonForVisitTooltip.setAnchor($reasonForVisit);
	$reasonForVisit.mouseover({
		scope : this,
		tooltip : "reasonForVisitTooltip"
	}, this.showHoverData);
};

TriageDocComponentO2.prototype.renderComponent = function(reply) {
	
	var recordData = reply.getResponse();
	var triI18N = i18n.discernabu.triage_document_o2;
	var triHTML = "";
	var jsTriHTML = [];
	var compID =  this.getComponentId();
	var compNS=this.getStyles().getNameSpace();
	var criterion = this.getCriterion();
	var classNormalcy = "";
	var acuity = recordData.ACUITY;
	var personID = criterion.person_id;
	var encntID = criterion.encntr_id;
	var patientGender = criterion.getPatientInfo().getSex();
	var sHRCell="", sTempCell="",sRespCell="",sO2SatCell="",sPainCell="",sWeightCell =""; 
	var sHeightCell = "",sGascoComaScaleCell="",sFetalHeartRateCell="",sBodyMassIndexCell="",sVisualAcuitiesLeft="",sVisualAcuitiesRight="";
	var sInfoGiven = "", sAccompBy = "", sWound = "", sDomesticConcerns = "", sModeOfArrival= "",slanguage="";
	var sLevelOfConsciousness = "", sOrientation = "", sBehavior = "", sColor = "", sDesc= "",sRespPattern="",sFlu ="";
	var sPreArrival = "", sOrders ="",sLastMestrualPeriod = "",sExpectedDeliveryDate = "", sGravida = "" ,sParity = "";
	var sAdvDir = "", sCodeChemo = "",sFallRisk="",sHarmSelf="",sPlan = "", sHarmOthers="", sIndNamed="";
	var sCustom1 = "",sCustom2 = "",sCustom3 = "",sCustom4 = "",sCustom5 = "";
	var sDomesticViolence="", sNonAccidentalTrauma = "";
	var sVisualAcuitiesLeftTime="",sVisualAcuitiesRightTime="",sAcuityTime="";
	
	var sNOResultFoundHtml = "<span class='res-none'>"+triI18N.NO_RESULTS_FOUND+"</span>";
	var sNotConfigured = "<span class='res-none'>"+triI18N.NOT_CONFIGURED+"</span>";
	var sNoResultCell = "<span class='" + compNS+"-normal'></span><span class='"+compNS+"-normal-res'>--</span><span class='"+ compNS+"-unit'></span>" ;
	var resHtml = "";
	var date = new Date();
	var slaTimer =MP_Util.CreateTimer("CAP:MPG.TRIAGE_DOC.O2 - Rendering component");	
	
	if (slaTimer) {
		slaTimer.SubtimerName = criterion.category_mean;          
		slaTimer.Stop();
	}
	
	for(var vIndex=0;vIndex<recordData.RESULT_CNT;vIndex++){
		var result = recordData.RESULTS[vIndex];
		classNormalcy = this.getNormalcy(result.NORMALCY);
		
		if(result.RESULT_VAL_DATE_IND){
			if (result.RESULT_VAL !== "") {
				date.setISO8601(result.RESULT_VAL);
			}
			result.RESULT_VAL = date.format("longDateTime2");
		}
		if(result.UPDT_DT_TM){			
			if(result.UPDT_DT_TM !== ""){
				date.setISO8601(result.UPDT_DT_TM);
			}
			result.UPDT_DT_TM = date.format("longDateTime2");
		}
		if(result.TYPE === "VAL"){
			sVisualAcuitiesLeftTime = result.UPDT_DT_TM;
		}
		if(result.TYPE === "VAR"){
			sVisualAcuitiesRightTime = result.UPDT_DT_TM;
		}
		sAcuityTime=sVisualAcuitiesRightTime;
		if((sVisualAcuitiesLeftTime!=="")){
			if(sVisualAcuitiesLeftTime<sVisualAcuitiesRightTime){
				sAcuityTime=sVisualAcuitiesLeftTime;
			}
		}
		if((sVisualAcuitiesRightTime ==="")&&(sVisualAcuitiesLeftTime!=="")){
			sAcuityTime=sVisualAcuitiesLeftTime;
		}
		var sHtml = "<span class='"+ classNormalcy+"'></span><span class='"+classNormalcy+"-res'>"+result.RESULT_VAL+"</span>"+
					"<span class='"+compNS+"-unit'>"+result.RESULT_UOM || '&nbsp;'+"</span>" ;		
		var sTimeHtml="<div class='"+compNS+"-time'>"+result.UPDT_DT_TM+"&nbsp;</div>";		
		
		var sModifyHtml = this.getModifyIndicator(result.STATUS_MEAN);
		sHtml+= sModifyHtml;
		
		switch (result.TYPE){
			case "TEMP" :
				sTempCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";		
				break;
			case "HR" :
				sHRCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;
			case "RESP" :
				sRespCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;	
			case "O2SAT" :
				sO2SatCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;	
			case "PAIN" :
				sPainCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;		
			case "WEIGHT" :
				sWeightCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;	
			case "HEIGHT" :
				sHeightCell = sHtml + sTimeHtml;
				sHtml = "";
				break;
			case "BMI" :
				sBodyMassIndexCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;
			case "FHT" :
				sFetalHeartRateCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;		
			case "GCS" :
				sGascoComaScaleCell = sHtml + sTimeHtml;
				sHtml = "";
				sTimeHtml = "";
				break;
			case "VAL" :
				sVisualAcuitiesLeft = sHtml;
				sHtml = "";
				break;	
			case "VAR" :
				sVisualAcuitiesRight = sHtml;
				sHtml = "";
				break;	
			case "INFOGIVEN" :
				sInfoGiven = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.INFORMATION_GIVEN_BY + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							 "</dl>" ;
				break;		
			case "ACCOMPBY" :
				sAccompBy = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.ACCOMPNIED_BY + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;	
			case "MOA" :
				sModeOfArrival = "<dl class='"+compNS+"-result'>"+
								 	"<dt><span class='"+compNS+"-name'>" + triI18N.MODE_OF_ARRIVAL + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
								 "</dl>";
				break;
			case "LANG" :
				slanguage = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.LANGUAGE + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>"; 
				break;
			case "WOUND" :
				sWound = "<dl class='"+compNS+"-result'>"+
							 "<dt><span class='"+compNS+"-name'>" + triI18N.INCISIONS + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
							 "<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						 "</dl>"; 
				break;
			case "DC" :
				sDomesticConcerns = "<dl class='"+compNS+"-result'>"+
										"<dt><span class='"+compNS+"-name'>" + triI18N.DOMESTIC_CONCERNS + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
										"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
									"</dl>"; 
				break;
				
			case "LOC" :
				sLevelOfConsciousness = "<dl class='"+compNS+"-result'>"+
											"<dt><span class='"+compNS+"-name'>" + triI18N.LEVEL_OF_CONSCIOUSNESS+ "</span><span class='" + compNS + "-colon'>:</span></dt>"+
											"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
										"</dl>";
				break;		
			case "ORIENTATION" :
				sOrientation = "<dl class='"+compNS+"-result'>"+
									"<dt><span  class='"+compNS+"-name'>" +triI18N.ORIENTATION + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
								"</dl>";
				break;	
			case "BEHAVIOUR" :
				sBehavior = "<dl class='"+compNS+"-result'>"+
								"<dt><span  class='"+compNS+"-name'>" + triI18N.AFFECT_BEHAVIOR + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;
			case "COLOR" :
				sColor = "<dl class='"+compNS+"-result'>"+
							  "<dt><span class='"+compNS+"-name'>" + triI18N.SKIN_COLOR + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
							  "<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						 "</dl>"; 
				break;
			case "DESC" :
				sDesc = "<dl class='"+compNS+"-result'>"+
							"<dt><span class='"+compNS+"-name'>" +  triI18N.SKIN_DESCRIPTION + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
							"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						"</dl>"; 
				break;
			case "FLU" :
				sFlu = "<dl class='"+compNS+"-result'>"+
							"<dt><span class='"+compNS+"-name'>" + triI18N.FLU_LIKE_SYMPTOMS+ "</span><span class='" + compNS + "-colon'>:</span></dt>"+
							"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						"</dl>";
				break;	
			case "RESPPATTERN" :
				sRespPattern = "<dl class='"+compNS+"-result'>"+
									"<dt><span class='"+compNS+"-name'>" + triI18N.RESPIRATORY + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
								"</dl>"; 
				break;
				
			case "ADVDIR" :
				sAdvDir = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.DOCUMENTED_DIRECTIVE + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						  "</dl>";
				break;
			case "CODECHEMO" :
				sCodeChemo = "<dl class='"+compNS+"-result'>"+
									"<dt><span class='"+compNS+"-name'>" + triI18N.CODE_CHEMO+ "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							 "</dl>";
				break;	
				
			case "FALLRISK" :
				sFallRisk = "<dl class='"+compNS+"-result'>"+
								 "<dt><span class='"+compNS+"-name'>" + triI18N.MORSE_FALL_RISK + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								 "<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;	
			
			case "HARMTOSELF" :
				sHarmSelf = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.HARM_TO_SELF + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;
			case "SPLAN" :
				sPlan = "<dl class='"+compNS+"-result'>"+
							"<dt><span class='"+compNS+"-name'>" + triI18N.SUICIDE_PLAN + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
							"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						"</dl>";
				break;	
			case "HARMTOOTHERS" :
				sHarmOthers = "<dl class='"+compNS+"-result'>"+
									"<dt><span class='"+compNS+"-name'>" + triI18N.HARM_TO_OTHERS + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							  "</dl>";
				break;
			case "INDNAMED" :
				sIndNamed = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.INDIVIDUAL_NAMED + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;	
				
			case "CUSTLAB1" :
				sCustom1 = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + result.EVENT_TITLE_TEXT + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
							"</dl>";
				break;
			case "CUSTLAB2" :
				sCustom2 = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + result.EVENT_TITLE_TEXT + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						   "</dl>";
				break;	
			case "CUSTLAB3" :
				sCustom3 = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>"  + result.EVENT_TITLE_TEXT + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						   "</dl>";
				break;
			case "CUSTLAB4" :
				sCustom4 = "<dl class='"+compNS+"-result'>"+
								"<dt ><span class='"+compNS+"-name'>"  + result.EVENT_TITLE_TEXT + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						   "</dl>";
				break;
			case "CUSTLAB5" :
				sCustom5 = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>"  + result.EVENT_TITLE_TEXT  + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						   "</dl>";
				break;
				
			case "DV" :
				sDomesticViolence = "<dl class='"+compNS+"-result'>"+
										"<dt><span class='"+compNS+"-res-name'>" + triI18N.DOMESTIC_VIOLENCE+ "</span><span class='" + compNS + "-colon'>:</span></dt>"+
										"<dd class='"+compNS+"-res-val'>" + result.RESULT_VAL  + sModifyHtml+"</dd>"+
									"</dl>";
				break;	
			case "NATN" :
				sNonAccidentalTrauma = "<dl class='"+compNS+"-result'>"+
											"<dt><span class='"+compNS+"-res-name'>" +triI18N.TRAUMA_NEGLECT + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
											"<dd class='"+compNS+"-res-val'>" + result.RESULT_VAL  +sModifyHtml+ "</dd>"+
										"</dl>";
				break;
				
			case "EMS" :
				sPreArrival = "<dl class='"+compNS+"-result'>"+
									"<dt><span class='"+compNS+"-res-name'>" + triI18N.PRE_ARRIVAL + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
									"<dd class='"+compNS+"-res-val'>" + result.RESULT_VAL  + sModifyHtml+"</dd>"+
							  "</dl>"; 
				break;
			case "LMP" :
				sLastMestrualPeriod = "<dl class='"+compNS+"-result'>"+
											"<dt><span class='"+compNS+"-name'>" + triI18N.LAST_MENSTRUAL_PERIOD + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
											"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
									  "</dl>"; 
				break;
			case "EDD" :
				sExpectedDeliveryDate = "<dl class='"+compNS+"-result'>"+
											"<dt><span class='"+compNS+"-name'>" + triI18N.EXPECTED_DELIVERY_DATE + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
											"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
										"</dl>"; 
				break;
			case "GRAVIDA" :
				sGravida = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.GRAVIDA + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						   "</dl>"; 
				break;
			case "PARITY" :
				sParity = "<dl class='"+compNS+"-result'>"+
								"<dt><span class='"+compNS+"-name'>" + triI18N.PARITY + "</span><span class='" + compNS + "-colon'>:</span></dt>"+
								"<dd class='"+compNS+"-val'>" + result.RESULT_VAL  + sModifyHtml +"</dd>"+
						  "</dl>"; 
				break;	
			default:
				break;
		}
		
	}

	var standingOrdersArray = recordData.STANDING_ORDERS;
	var orderCount = (standingOrdersArray) ? standingOrdersArray.length : 0;
	if(orderCount > 0) {
		sOrders = "<dl class='" + compNS + "-result'>" + "<dt><span class='" + compNS + "-res-name'>" + triI18N.STANDING_ORDERS +
					"</span><span class='" + compNS + "-colon'>:</span></dt>";

		for (var index = 0; index < orderCount; index++) {
			sOrders += "<dd class='" + compNS + "-res-val " + compNS + "-order-items'>" + 
						standingOrdersArray[index].ORDER_NAME + "</dd>";
		}				
		sOrders += "</dl>";
	}
	/*****************************************************************************************************************************
	Create HTML for the Patient Information Header : which  has following fields
	ACUITY , REASON FOR VISIT, CHIEF COMPLAINT, PROBLEM ALERTS, CRITICAL NOTAES, PRE-ARRIVAL NOTES  
	
	CRITICAL NOTAES, PRE-ARRIVAL NOTES  : On selecting the link show the note within docucment viewer
	******************************************************************************************************************************/
	
	jsTriHTML.push("<div class='content-body'><div class='"+compNS+"-hdr'>"+
						"<div class='"+compNS+"-hdr-coll'>");
	
						/***ACUITY****/
						if(acuity){
							jsTriHTML.push("<span class='"+compNS+"-acuity-scale-"+ acuity + "'>" + acuity + "</span>");
						}
	
						/***REASON FOR VISIT and CHIEF COMPLAINT****/
						jsTriHTML.push( "<span id='"+compNS+"-visit-"+compID+"' class='"+compNS+"-visit'>"+
											"<span class='"+compNS+"-visit-ellipsis'>&nbsp;</span>"+
											"<span class='"+compNS+"-visit-reason'>"+ recordData.REASON_FOR_VISIT +"</span>"+
											"<span class='"+compNS+"-visit-prev'>" + recordData.REASON_FOR_VISIT_PREV +"</span>"+
										"</span>"+
										"<span class='"+compNS+"-chief-comp'>"+ recordData.CHIEF_COMPLAINT  +"</span></div>");
										
						jsTriHTML.push("<div class='"+compNS+"-hdr-colr'>");
						/***PROBLEM ALERTS****/	
						if(recordData.PROB_ALERT_DISP){				
							jsTriHTML.push("<div><span class='"+compNS+"-prob-img'></span>" + 
											   "<span id='"+compNS+"-prob-alert-"+compID+"' class='"+compNS+"-prob-val'>"+ recordData.PROB_ALERT_DISP +"</span>"+
										   "</div>");
						}	
						
						jsTriHTML.push("<div class='"+compNS+"-note-div'>");
										/***CRITICAL NOTE****/	
										if(recordData.CRITICAL_NOTE_CNT == 1){
											jsTriHTML.push("<span class='"+compNS+"-care-note-img'></span><span class='"+compNS+"-care-note-val'>"+
															MP_Util.CreateClinNoteLink(personID + ".0", encntID+".0",recordData.CRITICAL_NOTE[0].EVENT_ID+
															   ".0", recordData.CRITICAL_NOTE[0].EVENT_TEXT_TITLE, "DOC","0.0")+
															"</span>");
										}
										else if(recordData.CRITICAL_NOTE_CNT > 1){
											jsTriHTML.push("<span class='"+compNS+"-care-note-img'></span><span class='"+compNS+"-care-note-val'>"+
														   "<a id='critical-note-"+compID+"'>"+triI18N.CRITICAL_NOTE+"("+recordData.CRITICAL_NOTE_CNT+")"+"</a>"+
														   "</span>");
										}
										/***PRE ARRIVAL NOTE****/
										if(recordData.PRE_ARRIVAL_CNT == 1){
											jsTriHTML.push("<span class='"+compNS+"-pre-img'></span><span class='"+compNS+"-pre-val'>"+
											MP_Util.CreateClinNoteLink(personID + ".0", encntID+".0",recordData.PRE_ARRIVAL[0].EVENT_ID+
															   ".0", recordData.PRE_ARRIVAL[0].EVENT_TEXT_TITLE, "DOC","0.0")+
											"</span>");
										}
										else if(recordData.PRE_ARRIVAL_CNT > 1){
											jsTriHTML.push("<span class='"+compNS+"-pre-img'></span><span class='"+compNS+"-pre-val'>"+
											"<a id='pre-arrival-note-"+compID+"'>"+triI18N.PREARRIVAL_NOTE+"("+recordData.PRE_ARRIVAL_CNT+")"+"</a>"+
											"</span>");
										}
						jsTriHTML.push("</div></div></div>");
	
	/*****************************************************************************************************************************
	Create HTML for the Vital Section: Vital section has 2 rows and 12 column, in the Following order  
	
		TEMP		HR		 	BP  				RESPIRATORY RATE 	  O2 SATURATION 			PAIN
		HEIGHT		WEIGHT	 	BODY MASS INDEX		VISUAL ACUITIES		  GLASCOW COMA SCALE		FETAL HEART TONES
	
	******************************************************************************************************************************/
	
	sTempCell = sTempCell || sNoResultCell;  
	sHRCell =  sHRCell || sNoResultCell;
	sRespCell  = sRespCell || sNoResultCell;
	sO2SatCell = sO2SatCell || sNoResultCell;
	sPainCell = sPainCell|| sNoResultCell;
	sWeightCell = sWeightCell|| sNoResultCell;
	sHeightCell = sHeightCell|| sNoResultCell;
	sBodyMassIndexCell = sBodyMassIndexCell|| sNoResultCell;
	sGascoComaScaleCell  = sGascoComaScaleCell|| sNoResultCell;
	sFetalHeartRateCell  = sFetalHeartRateCell|| sNoResultCell;
	sVisualAcuitiesLeft =sVisualAcuitiesLeft|| sNoResultCell;
	sVisualAcuitiesRight =sVisualAcuitiesRight|| sNoResultCell;
	
	var bpResult = recordData.BP_RESULTS;
	var sysEvents = bpResult.SYS_EVENTS;
	var diaEvents = bpResult.DIA_EVENTS;
	
	
	if(sysEvents.EFFECTIVE_DT_TM){
		if(sysEvents.EFFECTIVE_DT_TM !== ""){
			date.setISO8601(sysEvents.EFFECTIVE_DT_TM);
		}
		sysEvents.EFFECTIVE_DT_TM = date.format("longDateTime2");
	}

	if(diaEvents.EFFECTIVE_DT_TM){
		if(diaEvents.EFFECTIVE_DT_TM !== ""){
			date.setISO8601(diaEvents.EFFECTIVE_DT_TM);
		}
		diaEvents.EFFECTIVE_DT_TM = date.format("longDateTime2");
	}

	var resultTime=diaEvents.EFFECTIVE_DT_TM;
	if(sysEvents.EFFECTIVE_DT_TM!==""){
		if(sysEvents.EFFECTIVE_DT_TM<diaEvents.EFFECTIVE_DT_TM){
		resultTime=sysEvents.EFFECTIVE_DT_TM;}
	}
	if((diaEvents.EFFECTIVE_DT_TM ==="")&&(sysEvents.EFFECTIVE_DT_TM!=="")){
		resultTime=sysEvents.EFFECTIVE_DT_TM;
	}
	
	var sysResult = (sysEvents.RESULT_VAL)? sysEvents.RESULT_VAL :"--" ;
	var diaResult = (diaEvents.RESULT_VAL)? diaEvents.RESULT_VAL :"--" ;
	var units = (sysEvents.RESULT_UOM) ? sysEvents.RESULT_UOM : 
				diaEvents.RESULT_UOM;
	var sysNormalcy = this.getNormalcy(sysEvents.NORMALCY);
	var diaNormalcy = this.getNormalcy(diaEvents.NORMALCY);
	var sysModInd = this.getModifyIndicator(sysEvents.STATUS_MEAN);
	var diaModInd = this.getModifyIndicator(diaEvents.STATUS_MEAN);
	
	jsTriHTML.push("<div class='"+compNS+"-vitals'>"+
						"<table class='"+compNS+"-table'>"+
							"<tbody class='"+compNS+"-tbody'>"+
								"<tr>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.TEMPERATURE+"</span><div>" +	sTempCell + "</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.HEART_RATE+"</span><div>"+ sHRCell +"</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.BLOOD_PRESSURE+"</span>"+
										"<div>"+
											"<span class='" +sysNormalcy +"'></span><span class='"+sysNormalcy+"-res'>"+sysResult+"</span>"+sysModInd+" / "+
											"<span class='" +diaNormalcy +"'></span><span class='"+diaNormalcy+"-res'>"+diaResult+"</span>"+diaModInd+
											"<span class='"+compNS+"-unit'>"+units+"</span><div class='"+compNS+"-time'>"+resultTime+"</div>" +
										"</div>"+
									"</td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.RESPIRATORY_RATE+"</span><div>" + sRespCell + "</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.O2_SATURATION+"</span><div>" + sO2SatCell + "</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.PAIN+"</span><div>"+ sPainCell + "</div></td>"+
								"</tr>"+
								"<tr>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.HEIGHT+"</span><div>" + sHeightCell + "</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.WEIGHT+"</span><div>" + sWeightCell + "</div></td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.BODY_MASS_INDEX +"</span><div>"+ sBodyMassIndexCell + "</div></td>"+
									"<td class='"+compNS+"-vitals-title'>"+triI18N.VISUAL_ACUITIES +
										"<div class='"+compNS+"-visual-align'><span class='"+compNS+"-vitals-left'>"+triI18N.VISUAL_ACUITY_LEFT+':'+"</span>"+
										"<span class='"+compNS+"-vitals-lvalue '>"+sVisualAcuitiesLeft+"</span>&nbsp;&nbsp;"+
										"<span class='"+compNS+"-vitals-right '>"+triI18N.VISUAL_ACUITY_RIGHT+':'+"</span>" +
										"<span class='"+compNS+"-vitals-lvalue '>"+sVisualAcuitiesRight+"</span><div class='"+compNS+"-time'>"+sAcuityTime+"&nbsp;</div>"+
										"</div>"+
									"</td>"+
									"<td><span class='"+compNS+"-vitals-title'>"+triI18N.GLASCOW_COMA_SCALE +"</span><div>" + sGascoComaScaleCell+ "</div></td>");
									if(patientGender !== null && patientGender.meaning === "FEMALE"){
										jsTriHTML.push("<td><span class='"+compNS+"-vitals-title'>"+triI18N.FETAL_HEART_TONES +"</span><div>"+ sFetalHeartRateCell+ "</div></td>");
									}else{
										jsTriHTML.push("<td></td>");
									}
	jsTriHTML.push("</tr></tbody></table></div>");	
	
	/*****************************************************************************************************************************
	Create HTML for the 1st Column Section
		1. GENERAL INFORMATION
		2. ASSESSMENT			
	******************************************************************************************************************************/
	jsTriHTML.push("<div id='"+compNS+"-section-"+compID+"' class='"+compNS+"-section'>");
		jsTriHTML.push("<div class='"+compNS+"-left'>");
			
		if (this.getGeneralInfoFlag()) {
			var generalInfoHtml = sInfoGiven + sModeOfArrival + slanguage+ sDomesticConcerns + sWound +	sAccompBy ;
			generalInfoHtml = generalInfoHtml || sNOResultFoundHtml;
			
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.GENERAL_INFO+"</span>" + generalInfoHtml+"</div>");
		}
		
		if (this.getAssesmentFlag()) {		
			var assessmentHtml = 	sLevelOfConsciousness+ sOrientation+ sBehavior+ sColor+ sDesc+ sFlu+ sRespPattern ;
			assessmentHtml = assessmentHtml || sNOResultFoundHtml;
			
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.ASSESSMENT+"</span>"+ assessmentHtml+"</div>");
		}
		
		jsTriHTML.push("</div>");

	/*****************************************************************************************************************************
	Create HTML for the 2nd Column for Section
		1. ADVANCE DIRECTIVE
		2. FALL RISK
		3. SUICIDAL RISK	
		3. CUSTOM SECTION			
	******************************************************************************************************************************/
		jsTriHTML.push("<div class='"+compNS+"-center'>");
		
		if (this.getAdvanceDirFlag()) {
			var advancceDirHtml = sAdvDir + sCodeChemo;
			advancceDirHtml = advancceDirHtml || sNOResultFoundHtml;
			
			var advArrow  =  (recordData.ADV_DIR_CNT > 0)? "<span class='wrkflw-selectArrow'></span>" : "";
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span id='AdvDirDiv"+compID+"' class='"+
						    compNS+"-sec-hdr "+compNS+"-q-hover'>"+
						    triI18N.ADVANCE_DIRECTIVE+advArrow+ "</span>"+ 
						    advancceDirHtml+ "</div>");
			
			if(recordData.ADV_DIR_CNT){
				jsTriHTML.push("<div id='"+compNS+"-spec-filter"+ compID+ "' class='"+compNS+"-q-filter'><div class='"+compNS+"-adv-separator'>");
				for(var advIndex=0; advIndex < recordData.ADV_DIR_CNT; advIndex++){
					var advDirList = [];
					var display = recordData.ADV_DIR_LINK[advIndex].EVENT_TEXT_TITLE;
					advDirList.push(recordData.ADV_DIR_LINK[advIndex].EVENT_ID,personID,compID,'"'+compNS+'"');
					jsTriHTML.push("<div  class='"+compNS+"-all-fil' onclick='TriageDocComponentO2.launchDocViewer("+
									advDirList.join(",")+");'>"+display+"</div>");
				}
				jsTriHTML.push("</div></div>");
			}
		}
		
		if (this.getFallRiskFlag()) {			
			var fallRiskHtml = sFallRisk;
			fallRiskHtml = fallRiskHtml || sNOResultFoundHtml;
			
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.FALL_RISK+"</span>" + fallRiskHtml + "</div>");
		}

		if (this.getSuicideRiskFlag()) {		
			var suicideRiskHtml = sHarmSelf + sPlan + sHarmOthers + sIndNamed ;
			suicideRiskHtml = suicideRiskHtml || sNOResultFoundHtml;
			
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.SUCIDIE_RISK+"</span>" + suicideRiskHtml+"</div>");
		}

		if (this.getCustomFlag()) {		
			var customHtml = sCustom1 + sCustom2 + sCustom3 + sCustom4  + sCustom5 ;
			customHtml = customHtml || sNOResultFoundHtml;
			
			if (this.getCustomLabel()){
				jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
								this.getCustomLabel()+"</span>"+ customHtml+"</div>");
			}
		}
		jsTriHTML.push("</div>");
	
	/*****************************************************************************************************************************
	Create HTML for the 3nd Column for Sections
		1. DOMESTIC VOILENCE or TRAUMA 
		2. PRE-PROVIDER TREATEMENTS
		3. PREGNANCY	
	******************************************************************************************************************************/
		jsTriHTML.push("<div class='"+compNS+"-right'>");
		
		if (this.getDomesticFlag()) {
			var domesticHtml = sDomesticViolence+ sNonAccidentalTrauma;
			domesticHtml = domesticHtml || sNOResultFoundHtml;
			
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.DOMESTIC_NEGLECT+"</span>"+domesticHtml+"</div>");
		}

		if (this.getProviderFlag()) {
			var providerHtml = sPreArrival + sOrders ;
			providerHtml = (providerHtml) ? "<div class='" + compNS + "-order-list'>" + providerHtml + "</div>" : sNOResultFoundHtml;
							
			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.PROVIDER_TREATMENTS+"</span>"+providerHtml +"</div>");
		}
							   
		if (this.getPregnancyFlag() && (patientGender !== null && patientGender.meaning === "FEMALE")) {
			var pregnancyHtml = sLastMestrualPeriod + sExpectedDeliveryDate + sGravida + sParity ;
			pregnancyHtml = pregnancyHtml || sNOResultFoundHtml;

			jsTriHTML.push("<div class='"+compNS+"-sec-separator'><span class='"+compNS+"-sec-hdr'>"+
							triI18N.PREGNANCY+"</span>"+pregnancyHtml+"</div>");
		}
		
	jsTriHTML.push("</div></div></div>");
		
	triHTML = jsTriHTML.join("");
	
	//Finalize the component
	this.finalizeComponent(triHTML, "");
	this.attachListeners(this);
	
	if(recordData.CRITICAL_NOTE_CNT > 1){
		this.addNoteMenu(recordData.CRITICAL_NOTE_CNT,recordData.CRITICAL_NOTE,"criticalNoteMenu"+compID,"critical-note-"+compID,"criticalItem");
	}
	if(recordData.PRE_ARRIVAL_CNT > 1){
		this.addNoteMenu(recordData.PRE_ARRIVAL_CNT,recordData.PRE_ARRIVAL,"preArrivalNoteMenu"+compID,"pre-arrival-note-"+compID,"preArrivalItem");
	}

};

TriageDocComponentO2.createTriageJSON = function(ar,type){
			/* 
			ar  : array having the event_set
			Type: Array type for primitive event set e.g.: for Vitals : arrTemp for Temperature, arrHR for HR
		*/
		var tempJSON = '';
		if(ar && ar.length>0){
			tempJSON = '"'+ type + '"' + ':[';
			tempJSON = tempJSON  + '{"value":'+ar.join('.0},{"value":')+'.0}' + '],';
		}
		return tempJSON;
};

TriageDocComponentO2.launchDocViewer = function(eventID ,personID,compID,compNS){
	var personId = parseFloat(personID);
	var objPVViewerMPage = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
	
	$('#'+compNS+"-spec-filter" + compID).removeClass(compNS+"-visible");
	try{
		objPVViewerMPage.CreateDocViewer(personId);
		if(eventID > 0) {
			var eventId = parseFloat(eventID);
			objPVViewerMPage.AppendDocEvent(eventId);
			objPVViewerMPage.LaunchDocViewer();
		}
	}catch(err){
		MP_Util.LogJSError(err,this,"triage-o2.js","launchDocViewer");
	}
};

TriageDocComponentO2.prototype.loadFilterMappings = function(){
	//Add the filter mapping object for the Care Notes Look back
	this.addFilterMappingObject("WF_TRIAGE_CARE_PLAN_LOOKBACK", {
		setFunction: this.setCriticalNoteLookBack,
		type: "Number",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object to retrieve custom label
	this.addFilterMappingObject("WF_TRIAGE_CUSTOM_LABEL", {
		setFunction: this.setCustomLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object to retrieve nomeclature code for problem alerts
	this.addFilterMappingObject("WF_TRIAGE_PT_INFO_ALERT", {
		setFunction : this.setNomenclatureCode,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	//Add the filter mapping object to retrieve communication type code for orders
	this.addFilterMappingObject("WF_TRIAGE_ORDER_COMM_TYPE", {
		setFunction : this.setOrderCommnTypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};

/**
 * This method is used to create a context menu when more than 1 critical or pre-arrival note is configured in the bedrock.
 *  
 *  @param  {int}     noteCount	  : contains total no of notes
 * 	@param 	{[Array]} recordData  : contains either critical or pre-arrival note details. 
 *  @param  {string}  menuName    : name of the context menu.
 *  @param  {string}  menuId      : name of the Anchor Element Id to be set.
 *  @param  {string}  menuItem    : name of the Menu Item to be set.
 */
TriageDocComponentO2.prototype.addNoteMenu = function(noteCount,recordData,menuName,menuId,menuItem){
	var noteMenu = MP_MenuManager.getMenuObject(menuName);
	if (!noteMenu) {
		noteMenu = new ContextMenu(menuName).setAnchorElementId(menuId);
		noteMenu.setAnchorConnectionCorner([ "bottom", "left" ]).setContentConnectionCorner([ "top", "left" ]);
		
		for (var index = 0;index < noteCount ; index++) {
			var noteObject = recordData[index];
			var noteItem = new MenuSelection(menuItem + noteObject.EVENT_ID);
			
			noteItem.setLabel(noteObject.EVENT_TEXT_TITLE);
			noteItem.setClickFunction(this.createFilterClickFunction(noteObject.EVENT_ID));
			noteMenu.addMenuItem(noteItem);
		}
		MP_MenuManager.updateMenuObject(noteMenu);
	}
};


/**
 * This method is used to add the Click Event for each Menu item 
 *  
 *  @param  {float}   eventId: contains the selected note eventId
 */
TriageDocComponentO2.prototype.createFilterClickFunction = function(eventId) {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var criterion = this.getCriterion();
	return function() {
		if(eventId > 0){
			TriageDocComponentO2.launchDocViewer(eventId,criterion.person_id,compID,compNS);
		}
	};
};
					
TriageDocComponentO2.prototype.attachListeners=function(component){
	var compID =  this.getComponentId();
	var compNS=this.getStyles().getNameSpace();
	var componentContent = $(this.getSectionContentNode());
	
	//show menu when more than one critical note is configured in the bedrock.
	$("#critical-note-"+compID).click(function(event){
		var criticalNoteMenu = MP_MenuManager.getMenuObject("criticalNoteMenu"+compID);
		MP_MenuManager.showMenu("criticalNoteMenu"+compID);
		criticalNoteMenu.removeAnchorElement();
	});
	
	//show menu when more than one pre arrival note is configured in the bedrock.
	$("#pre-arrival-note-"+compID).click(function(event){
		var prearrivalNoteMenu = MP_MenuManager.getMenuObject("preArrivalNoteMenu"+compID);
		MP_MenuManager.showMenu("preArrivalNoteMenu"+compID);
		prearrivalNoteMenu.removeAnchorElement();
	});
	
	$(componentContent).on("mouseenter", "span."+compNS+"-name, span."+compNS+"-res-name, span."+compNS+"-care-note-val, span."+compNS+"-pre-val", function(event){ 
		var classAnchorName = $(this).attr("class"); 
		if(this.offsetWidth < this.scrollWidth){	
			var tooltip = new MPageTooltip(); 
			tooltip.setX(event.pageX).setY(event.pageY).setAnchor($("." +classAnchorName)).setContent("<span class=''>"+$(this).text()+"</span>"); 
			tooltip.show(); 
 
		}
	}); 
	
	$(componentContent).on("mouseenter", "dd."+compNS+"-val", function(event){ 
		if(this.offsetWidth < this.scrollWidth){	
			var tooltip = new MPageTooltip(); 
			tooltip.setX(event.pageX).setY(event.pageY).setAnchor($("."+compNS+"-val")).setContent("<span class=''>"+$(this).text()+"</span>"); 
			tooltip.show(); 
 
		}
	}); 
	
	// attach listeners to the Advance Directive Link.
	$('#AdvDirDiv'+ compID).click(function(event){ 
		var advId = '#'+compNS+"-spec-filter" + compID;
		$(advId).toggleClass(compNS+"-visible");
	});
	
	$(componentContent).on("mouseenter","span."+compNS+"-sec-hdr",function(event){
		if(this.offsetWidth<this.scrollWidth){
			var tooltip=new MPageTooltip();
			tooltip.setX(event.pageX).setY(event.pageY).setAnchor($("."+compNS+"-sec-hdr")).setContent("<span class=''>"+$(this).text()+"</span>");
			tooltip.show();
		}
	});
};

/**
 * Map the Triage Documentation option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_TRIAGE" filter 
 */
MP_Util.setObjectDefinitionMapping("WF_TRIAGE", TriageDocComponentO2);
