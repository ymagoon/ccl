/**
 * The partogramInfo object is used to store information about a specific
 * partogram
 */
function PartogramInfo() {
	/* Private members */
	var criterion = null;
	var pregnancyId = 0.0;
	var pregnancyOnsetDate = null;
	var laborOnsetDate = null;
	var partogramStartDate = null;
	var pregnancyDescriptor = null;
	var multipRateInd = 0;
	var gravida = 0;
	var para = 0;
	var paraTerm = 0;
	var paraPremature = 0;
	var paraAbortions = 0;
	var paraLiving = 0;
	var ectopic = 0;
	var spontaneousAbortion = 0;
	var inducedAbortion = 0;
	var multipleBirths = 0;
	
	var epidural = [];

	/**
	 * Sets the pregnancy id.
	 */
	this.setPregnancyId = function (val) {
			pregnancyId = val;
	};
		
	/**
	 * Returns the pregnancy id.
	 */
	this.getPregnancyId = function() {
		return pregnancyId;
	};
	
	/**
	 * Sets the pregnancy onset date.
	 */
	this.setPregnancyOnsetDate = function (val) {
			pregnancyOnsetDate = val;
	};
		
	/**
	 * Returns the pregnancy onset date.
	 */
	this.getPregnancyOnsetDate = function() {
		return pregnancyOnsetDate;
	};

	/**
	 * Sets the labor onset date.
	 */
	this.setLaborOnsetDate = function (val) {
			laborOnsetDate = val;
	};
		
	/**
	 * Returns the labor onset date.
	 */
	this.getLaborOnsetDate = function() {
		return laborOnsetDate;
	};
	
	/**
	 * Sets the partogram start date.
	 */
	this.setPartogramStartDate = function (val) {
			partogramStartDate = val;
	};
		
	/**
	 * Returns the partogram start date.
	 */
	this.getPartogramStartDate = function() {
		return partogramStartDate;
	};
	
	/**
	 * Sets the pregnancy descriptor.
	 */
	this.setPregnancyDescriptor = function (val) {
			pregnancyDescriptor = val;
	};
		
	/**
	 * Returns the pregnancy descriptor.
	 */
	this.getPregnancyDescriptor = function() {
		return pregnancyDescriptor;
	};
	
	/**
	 * Sets the multip rate for labor curve indicator.
	 */
	this.setMultipRateInd = function (val) {
			multipRateInd = val;
	};
		
	/**
	 * Returns whether the patient should use the multip rate for labor curve.
	 */
	this.useMultipRate = function() {
		return (multipRateInd === 1 ? true : false);
	};
	
	/**
	 * Sets the gravida count.
	 */
	this.setGravida = function (val) {
			gravida = val;
	};
		
	/**
	 * Returns the gravida count.
	 */
	this.getGravida = function() {
		return gravida;
	};
	
	/**
	 * Sets the para count.
	 */
	this.setPara = function (val) {
			para = val;
	};
		
	/**
	 * Returns the para count.
	 */
	this.getPara = function() {
		return para;
	};
	
	/**
	 * Sets the para full term count.
	 */
	this.setParaTerm = function (val) {
			paraTerm = val;
	};
		
	/**
	 * Returns the para full term count.
	 */
	this.getParaTerm = function() {
		return paraTerm;
	};
	
	/**
	 * Sets the para premature count.
	 */
	this.setParaPremature = function (val) {
			paraPremature = val;
	};
		
	/**
	 * Returns the para premature count.
	 */
	this.getParaPremature = function() {
		return paraPremature;
	};
	
	/**
	 * Sets the para abortion count.
	 */
	this.setParaAbortions = function (val) {
			paraAbortions = val;
	};
		
	/**
	 * Returns the para abortion count.
	 */
	this.getParaAbortions = function() {
		return paraAbortions;
	};
	
	/**
	 * Sets the para living count.
	 */
	this.setParaLiving = function (val) {
			paraLiving = val;
	};
		
	/**
	 * Returns the para living count.
	 */
	this.getParaLiving = function() {
		return paraLiving;
	};
	
	/**
	 * Sets the ectopic count.
	 */
	this.setEctopic = function (val) {
			ectopic = val;
	};	
	
	/**
	 * Returns the ectopic count.
	 */
	this.getEctopic = function() {
		return ectopic;
	};
	
	/**
	 * Sets the spontaneous abortion count.
	 */
	this.setSpontaneousAbortion = function (val) {
			spontaneousAbortion = val;
	};
		
	/**
	 * Returns the spontaneous abortion count.
	 */
	this.getSpontaneousAbortion = function() {
		return spontaneousAbortion;
	};
	
	/**
	 * Sets the induced abortion count.
	 */
	this.setInducedAbortion = function (val) {
			inducedAbortion = val;
	};
		
	/**
	 * Returns the induced abortion count.
	 */
	this.getInducedAbortion = function() {
		return inducedAbortion;
	};
	
	/**
	 * Sets the multiple births count.
	 */
	this.setMultipleBirths = function (val) {
			multipleBirths = val;
	};
		
	/**
	 * Returns the multiple births count.
	 */
	this.getMultipleBirths = function() {
		return multipleBirths;
	};
	
	/**
	 * Sets the epidural results.
	 */
	this.setEpiduralResults = function (val) {
			epidural = val;
	};
		
	/**
	 * Returns the epidural.
	 */
	this.getEpiduralResults = function() {
		return epidural;
	};
}

/** 
 * The Partogram Base Component is to allow for other 'partogram' based
 * components to share the same data. 
 */
function PartogramBaseComponentStyle() {
	this.initByNamespace("parto-base-wf");
}
PartogramBaseComponentStyle.prototype = new ComponentStyle();
PartogramBaseComponentStyle.prototype.constructor = ComponentStyle;

function PartogramBaseComponent (criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PartogramBaseComponentStyle());
	this.setRefreshEnabled(false);
	 
	this.m_retrievingData = false;
	this.m_partogramViewID = "";
}

PartogramBaseComponent.prototype = new MPageComponent();
PartogramBaseComponent.prototype.constructor = MPageComponent;

/**
 * loads the partogram data into a shared resource
 * @param {Object} criterion - the criterion JSON data
 * @param {Boolean} asynch - whether the data should be accessed via asynchronous call
 */
PartogramBaseComponent.prototype.loadPartogramData = function(criterion, asynch) {
	var callbackFunc = null;
			
	//set default value of asynch parameter
	asynch = typeof asynch !== 'undefined' ? asynch : true;
	        
	//Check to see if the data is currently being retrieved
	if(this.m_retrievingData) {
		//Data already being retrieved
		return;
	}

	//Indicate that data is being retrieved
	this.m_retrievingData = true;
						
	var scriptRequest = new ScriptRequest();
	scriptRequest.setName("Partogram Info Retrieval");
    scriptRequest.setProgramName("MP_GET_PARTOGRAM_INFO");
    scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.encntr_id +".0"]);
    scriptRequest.setAsyncIndicator(asynch);
    callbackFunc = function(recordData) {
		PartogramBaseComponent.prototype.getPartogramData(recordData, true);
	};
	scriptRequest.setResponseHandler(callbackFunc);
	scriptRequest.performRequest();
};

/**
 * Retrieves the partogram data and places into a shared resource
 * @param {Object} reply - the JSON script reply
 * @param {Boolean} notifyConsumers - whether the shared resource consumers should be notified
 */
PartogramBaseComponent.prototype.getPartogramData = function(reply, notifyConsumers) {
	var partogramInfoObj = null;
	var partogramResource = null;
	var replyError = null;
	var tempDate = null;

	// Update the date retrieval flags
	this.m_retrievingData = false;
	replyError = reply.getError();
	if(replyError === "" && replyError.length === 0) {
		var recordData = reply.getResponse();
		var replyStatus = recordData.STATUS_DATA.STATUS;
		if(replyStatus == "S") { //success
			partogramInfoObj = new PartogramInfo();
			partogramInfoObj.setPregnancyId(recordData.PREGNANCY_ID);
			partogramInfoObj.setPregnancyDescriptor(recordData.PREG_DESCRIPTOR);
			partogramInfoObj.setGravida(recordData.GRAVIDA);
			partogramInfoObj.setPara(recordData.PARA);
			partogramInfoObj.setParaTerm(recordData.PARA_TERM);
			partogramInfoObj.setParaPremature(recordData.PARA_PREMATURE);
			partogramInfoObj.setParaAbortions(recordData.PARA_ABORTIONS);
			partogramInfoObj.setParaLiving(recordData.PARA_LIVING);
			partogramInfoObj.setEctopic(recordData.ECTOPIC);
			partogramInfoObj.setSpontaneousAbortion(recordData.SPONTANEOUS_ABORT);
			partogramInfoObj.setInducedAbortion(recordData.INDUCED_ABORT);
			partogramInfoObj.setMultipleBirths(recordData.MULTI_BIRTH);
			partogramInfoObj.setMultipRateInd(recordData.MULTIP_RATE_IND);

			// Set the pregnancy onset date information
			if(recordData.PREG_ONSET_DATE) {
				tempDate = new Date();
				tempDate.setISO8601(recordData.PREG_ONSET_DATE);
				partogramInfoObj.setPregnancyOnsetDate(tempDate);
			}
					
			// Set the labor onset date information
			if(recordData.LABOR_ONSET_DATE) {
				tempDate = new Date();
				tempDate.setISO8601(recordData.LABOR_ONSET_DATE);
				partogramInfoObj.setLaborOnsetDate(tempDate);
			}
					
			// Set the partogram start date information
			if(recordData.PARTOGRAM_START_DATE) {
				tempDate = new Date();
				tempDate.setISO8601(recordData.PARTOGRAM_START_DATE);
				partogramInfoObj.setPartogramStartDate(tempDate);
			}
							   
			var epiduralResults = [];
			var epiduralInfo = [];
			var e = 0;
			// Set the epidural information
			if (recordData.EPIDURAL_CNT > 0) {
				for(e = 0; e < recordData.EPIDURAL_CNT; e++) {
					epiduralInfo.push({
						EVENT_NAME : recordData.EPIDURAL[e].EVENT_NAME,
						EVENT_DATE : recordData.EPIDURAL[e].EVENT_DATE,
						EPIDURAL_TYPE : recordData.EPIDURAL[e].EPIDURAL_TYPE,
						EPIDURAL_VALUE : recordData.EPIDURAL[e].EPIDURAL_VALUE
					});
				}
			}
			epiduralResults.push({
				CNT : recordData.EPIDURAL_CNT,
				EPIDURAL_START_NAME : recordData.EPIDURAL_START_NAME,
				EPIDURAL_BOL_ANES_NAME : recordData.EPIDURAL_BOL_ANES_NAME,
				EPIDURAL_BOL_PAT_NAME : recordData.EPIDURAL_BOL_PAT_NAME,
				EPIDURAL_DISCONT_NAME : recordData.EPIDURAL_DISCONT_NAME,
				EPIDURAL_DATA : epiduralInfo
			});
			partogramInfoObj.setEpiduralResults(epiduralResults);
		}
		else if(recordData.STATUS_DATA.STATUS == "Z") { 
			// no partogram data / no active pregnancy
			partogramInfoObj = new PartogramInfo();
			partogramInfoObj.setPregnancyId(0);
		}
	}
	else { // Script error status = F
		partogramInfoObj = new PartogramInfo();
		pregInfoObj.setPregnancyId(-1);
	}

	// Create or update the Shared Resource for all partogram components to use.
	partogramResource = MP_Resources.getSharedResource("partogramInfo");
	if (partogramResource) {
		// Update the shared resource and notify consumers
		MP_Resources.setSharedResourceData("partogramInfo", partogramInfoObj);
	}
	else {
		partogramResource = new SharedResource("partogramInfo");
		partogramResource.setResourceData(partogramInfoObj);
		partogramResource.setIsAvailable(true);
		partogramResource.setIsBeingRetrieved(false);
		partogramResource.setEventListenerFlag("partogramInfoAvailable");
		// Set to null so all MPages and Components receive the event
		partogramResource.setEventListenerObject(new MPageComponent());
		MP_Resources.addSharedResource("partogramInfo", partogramResource);
	}

	// Need to check this flag because this resource may be retrieved prior to
	// rendering the MPage and notifying the consumers causes them to render.
	if (notifyConsumers) {
		partogramResource.notifyResourceConsumers();
	}
};

/**
 * Returns the partogram view id (i.e. category mean)
 */     	
PartogramBaseComponent.prototype.getPartogramViewID = function() {
	return this.m_partogramViewID;
};

/**
 * Sets the partogram view id to the category mean of the view
 * @param {String} partogramViewId - category mean
 */
PartogramBaseComponent.prototype.setPartogramViewID = function(partogramViewId) {
	this.m_partogramViewID = partogramViewId;
};