/**
 * The pregnancyInfo object is used to store information about a specific
 * pregnancy.
 */
function PregnancyInfo() {
	/** @private */
	var m_criterion = null;
	//had to make this a global so that the inline function, addOrReopenPregnancy could consume it
	/** @private */
	var m_delGesAge = 0;
	/** @private */
	var m_deliveryDt = 0;
	/** @private */
	var m_eddDt = 0;
	/** @private */
	var m_eddId = 0.0;
	/** @private */
	var m_gesAge = 0;
	/** @private */
	var m_label = "";
	/** @private */
	var m_lookBack = 0;
	//based on today minus onset date
	/** @private */
	var m_onsetDate = null;
	/** @private */
	var m_pregId = 0.0;
	/** @private */
	var m_reopenPregInd = 0;
	/** @private */
	var m_rtLookBack = 0;
	/** @private */
	var m_patientDelivered = 0;
	/** @private */
	var m_calculatedEga = 0;
	//based on gestational age at delivery plus (today minus delivery date)

	/** Getters **/
	this.getDelGesAge = function() {
		return m_delGesAge;
	};
	this.getDeliveryDate = function() {
		return m_deliveryDt;
	};
	this.getEddId = function() {
		return m_eddId;
	};
	this.getEstDeliveryDate = function() {
		return m_eddDt;
	};
	this.getGesAge = function() {
		return m_gesAge;
	};
	this.getLookBack = function() {
		return m_lookBack;
	};
	this.getOnsetDate = function() {
		return m_onsetDate;
	};
	this.getPregnancyId = function() {
		return m_pregId;
	};
	this.getReopenPregInd = function() {
		return m_reopenPregInd;
	};
	this.getRtLookBack = function() {
		return m_rtLookBack;
	};
	/**
	 * This function indicates whether patient has delivered
	 * all the babies.
	 * 
	 * @returns m_patientDelivered {boolean} -  Returns true if
	 * the patient has delivered all the babies.
	 */
	this.isPatientDelivered = function() {
		return m_patientDelivered;
	};
	/**
	 * This functions returns the calculated EGA based on
	 * whether patient is delivered or not.
	 * 
	 * 
	 * @returns m_patientDelivered {int} -  Returns the
	 * EGA for the patient
	 */
	this.getCalculatedEga = function() {
		return m_calculatedEga;
	}; 
	/** Setters **/
	this.setDelGesAge = function(delgesAge) {
		m_delGesAge = delgesAge;
	};
	this.setDeliveryDate = function(deliveryDt) {
		m_deliveryDt = deliveryDt;
	};
	this.setEddId = function(eddId) {
		m_eddId = eddId;
	};
	this.setEstDeliveryDate = function(eddDt) {
		m_eddDt = eddDt;
	};
	this.setGesAge = function(gesAge) {
		m_gesAge = gesAge;
	};
	this.setLookBack = function(lookBack) {
		m_lookBack = lookBack;
	};
	this.setOnsetDate = function(onsetDate) {
		m_onsetDate = onsetDate;
	};
	this.setPregnancyId = function(pregId) {
		m_pregId = pregId;
	};
	this.setReopenPregInd = function(reopenInd) {
		m_reopenPregInd = reopenInd;
	};
	this.setRtLookBack = function(rtLookBack) {
		m_rtLookBack = rtLookBack;
	};
	/* This function sets patient delivery indicator.
	 * 
	 * @param patientDeliveredInd {int} - indicates whether
	 * all babies are delivered
	 */
	this.setIsPatientDelivered = function(patientDelivered) {
		m_patientDelivered = patientDelivered > 0 ? true : false;
	};
	/* This function calculates the current EGA for the patient 
	 * based on whether patient has single baby or multiple babies.
	 * 
	 * Mutiple Babies:
	 * The CURRENT_GEST_AGE continues to calculate until all the babies
	 * are delivered. Once all the babies are delivered, the CURRENT_GEST_AGE
	 * is set to the latest GEST_AGE_AT_DELIVERY.
	 * 
	 * Single Baby:
	 * CURRENT_GEST_AGE will be zero and GEST_AGE_AT_DELIVERY will be having
	 * delivery gestational age in days.
	 * 
	 */
	this.setCalculatedEga = function() {
		m_calculatedEga = (this.getGesAge() === 0) ? this.getDelGesAge() : this.getGesAge();
	}; 
}

/* The Pregnancy Base Component is to allow for other 'pregnancy' based
 * components to share the same data. */
function PregnancyBaseUtilComponentStyle() {
	this.initByNamespace("pregbase");
}

PregnancyBaseUtilComponentStyle.inherits(ComponentStyle);
var PREGNANCY_BASE_UTIL_O1 = function() {
	this.m_retrievingData = false;
	this.m_label = "PregnancyBaseUtil";
	this.m_componentId = 0.0;
	this.m_criterion = null;
	this.m_deliveryData = null;

	function GetDeliveryData(reply) {
		var replyError = reply.getError();
		if(replyError === "" && replyError.length === 0) {
			var recordData = reply.getResponse();
			var replyStatus = recordData.STATUS_DATA.STATUS;
			if(replyStatus !== "F") {//success
				this.m_deliveryData = recordData;
				return this.m_deliveryData;
			}
		}
		return null;
	}
	function fmtDt(dt, mask) {
		if (dt) {
			var dateTime = new Date();
			dateTime.setISO8601(dt);	
			if (mask) {
				return dateTime.format(mask);
			}
			else {
				return dateTime.format("longDateTime3");
			}
		}
		else {
			return "^^";
		}
	}
	return {
		/**
		 * loads the pregnancy data into a shared resource
		 * @param {Object} criterion - the criterion JSON data
		 * @param {Boolean} asynch - whether the data should be accessed via asynchronous call
		 */
		LoadPregnancyData : function(criterion, asynch) {
			var request = null;
			var sendArr = [];
			var callbackFunc = null;
			//set default value of asynch parameter
			asynch = typeof asynch !== 'undefined' ? asynch : true;

			//Store the criterion object for later use
			this.m_criterion = criterion;

			//Check to see if the data is currently being retrieved
			if(this.m_retrievingData) {
				//Data already being retrieved
				return;
			}

			//Indicate that data is being retrieved
			this.m_retrievingData = true;
			sendArr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.position_cd + ".0" );
			request = new MP_Core.ScriptRequest(PREGNANCY_BASE_UTIL_O1, "ENG:MPG.PregnancyBaseUtil.O1 - LoadPregnancyData");
			request.setProgramName("MP_GET_EGA_DATA");
			request.setParameters(sendArr);
			request.setAsync(asynch);
			callbackFunc = function(recordData) {
				PREGNANCY_BASE_UTIL_O1.GetPregnancyData(recordData, true);
			};
			MP_Core.XMLCCLRequestCallBack(PREGNANCY_BASE_UTIL_O1, request, callbackFunc);
		},
		LoadDeliveryData : function(sendVal, callback) {
			var request = new MP_Core.ScriptRequest(PREGNANCY_BASE_UTIL_O1, "ENG:MPG.PregnancyBaseUtil.O1 - LoadDeliveryData");
			request.setProgramName("MP_GET_DELIVERY_SUMMARY");
			request.setParameters(sendVal);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(PREGNANCY_BASE_UTIL_O1, request, function(reply) {
				//The GetDeliveryData function returns the deliveryData information needed
				callback(GetDeliveryData(reply));
			});
		},
		CheckPregnancySummaryLoadRequirement : function(viewPointInd) {
			var patInfo = this.m_criterion.getPatientInfo();
			var errorString = "";
			var addButtonHTML = "";
			var reopenButtonHTML = "";
			var errorOccured = false;
			var helpFile, helpURL;
			var bodyHTML = "";

			//if female
			if(patInfo.getSex().meaning === "FEMALE") {
				//check if the patient is pregnant -- pregnancy id -- if pregnancy id  < 0, show
				// error -- something went wrong
				if(m_pregId < 0) {
					errorString = pregnancyBaseUtili18n.RETREIVING_PREG_ERROR;
					errorOccured = true;
				}
				// pregnancy id -- if pregnancy id  == 0, show error need active preg
				else if(m_pregId === 0) {
					errorString = pregnancyBaseUtili18n.NOACTIVE_PREG_ERROR;
					addButtonHTML = '<input type="button" OnClick="PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(0);" value="' + pregnancyBaseUtili18n.ADD_PREGNANCY + '">';
					errorOccured = true;
					if(m_reopenPregInd == 1) {
						reopenButtonHTML = '<input type="button" OnClick="PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(1);" value="' + pregnancyBaseUtili18n.REOPEN_PREGNANCY + '">';
					}
				}
			}
			else {//else show not female error
				errorString = pregnancyBaseUtili18n.NOTFEMALE_ERROR;
				errorOccured = true;
			}
			if(errorOccured) {
				//add the help link
				if(this.m_criterion.help_file_local_ind == 1) {
					helpFile = this.m_criterion.static_content + "pregnancysummary/index.html";
				}
				else {
					helpURL = "https://wiki.ucern.com/display/r1mpagesHP/Pregnancy+Summary+Help";
				}

				//add the title
				if(viewPointInd) {
					MP_Util.Doc.AddPageTitle(pregnancyBaseUtili18n.PREGNANCY_SUMMARY, document.body, this.m_criterion.debug_ind, true, null, helpFile, helpURL, this.m_criterion, this.m_criterion.category_mean);
				}
				else {
					MP_Util.Doc.AddPageTitle(pregnancyBaseUtili18n.PREGNANCY_SUMMARY, document.body, this.m_criterion.debug_ind, true, null, helpFile, helpURL, this.m_criterion);
				}
				MP_Util.Doc.AddCustomizeLink(this.m_criterion);

				//store the current document body
				var demoHTML = ["<div class='pregbase-error-content'><span class=pregbase-alert-icon title=", pregnancyBaseUtili18n.ALERT, ":></span><span class=pregbase-error-text>", errorString, "</span><span class=pregbase-addpreg-button>", addButtonHTML, "</span><span class=pregbase-reopenpreg-button>", reopenButtonHTML, "</span></div>"];
				var demoarray = demoHTML.join('');

				if(viewPointInd) {
					bodyHTML = _g(this.m_criterion.category_mean);
					bodyHTML.innerHTML = bodyHTML.innerHTML + demoarray;
				}
				else {
					bodyHTML = document.body.innerHTML;
					document.body.innerHTML = bodyHTML + demoarray;
				}
			}

			return errorOccured;
		},
		addOrReopenPregnancy : function(addOrReOpenFlag) {
			var addOrOpenPregFormObject = null;
			try {
				addOrOpenPregFormObject = window.external.DiscernObjectFactory('PREGNANCY');
				MP_Util.LogDiscernInfo(null, "PREGNANCY", "pregnancybaseutil.js", "addOrOpenPregnancy");
			}
			catch(err) {
				MP_Util.LogError(i18n.discernabu.pregnancybaseutil_o1.DISCERN_OBJ_FACTORY_FAILURE + ': ' + err.name + ' ' + err.message);
				return;
			}
			if(!addOrOpenPregFormObject && addOrOpenPregFormObject === null) {
				MP_Util.LogError(i18n.discernabu.pregnancybaseutil_o1.PREG_FORM_OBJ_FAILURE);
				return false;
			}

			var success = false;
			try {
				if(addOrReOpenFlag === 0) {
					success = addOrOpenPregFormObject.AddPregnancy(window, this.m_criterion.person_id, this.m_criterion.encntr_id);
				}
				else if(addOrReOpenFlag === 1) {
					success = addOrOpenPregFormObject.ReopenPregnancy(window, this.m_criterion.person_id, this.m_criterion.encntr_id);
				}
				if(success) {
					PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.m_criterion);
				}
				return success;
			}
			catch(error) {
				if(addOrReOpenFlag === 0) {
					MP_Util.LogError(i18n.discernabu.pregnancybaseutil_o1.ADDPREGNANCY_EXCEPTION);
				}
				else {
					MP_Util.LogError(i18n.discernabu.pregnancybaseutil_o1.REOPENPREGNANCY_EXCEPTION);
				}
			}
		},
		GetPregnancyData : function(reply, notifyConsumers) {
			var dateDiff = null;
			var daysOfLife = null;
			var deliveryDate = null;
			var pregDeliveredInd = null;
			var pregInfoObj = null;
			var pregResource = null;
			var replyError = null;
			var tempDate = null;
			var todayDate = null;

			//Update the date retrieval flags
			this.m_retrievingData = false;
			replyError = reply.getError();
			if(replyError === "" && replyError.length === 0) {
				var recordData = reply.getResponse();
				var replyStatus = recordData.STATUS_DATA.STATUS;
				if(replyStatus == "S") {//success
					pregInfoObj = new PregnancyInfo();
					pregInfoObj.setPregnancyId(recordData.GESTATION_INFO[0].PREGNANCY_ID);
					pregInfoObj.setLookBack(recordData.LOOKBACK_DAYS);
					pregInfoObj.setReopenPregInd(recordData.REOPEN_PREG_IND);
					pregInfoObj.setGesAge(recordData.GESTATION_INFO[0].CURRENT_GEST_AGE);
					pregInfoObj.setDelGesAge(recordData.GESTATION_INFO[0].GEST_AGE_AT_DELIVERY);
					pregInfoObj.setCalculatedEga();
					pregInfoObj.setEstDeliveryDate(recordData.GESTATION_INFO[0].EST_DELIVERY_DATE_FORMATTED);
					pregInfoObj.setEddId(recordData.GESTATION_INFO[0].EDD_ID);
					pregInfoObj.setIsPatientDelivered(recordData.GESTATION_INFO[0].PATIENT_DELIVERED_IND);
					
					//Set the onset date information
					if(recordData.ONSET_DATE) {
						tempDate = new Date();
						tempDate.setISO8601(recordData.ONSET_DATE);
						pregInfoObj.setOnsetDate(tempDate);
					}

					//timeline lookback = gestational age if not delivered
					pregDeliveredInd = recordData.GESTATION_INFO[0].DELIVERED_IND;
					pregInfoObj.setRtLookBack(pregInfoObj.getCalculatedEga());
					// Check whether patient is delivered
					if(pregInfoObj.isPatientDelivered()) {
						todayDate = new Date();
						var deliveryDateFormatted = recordData.GESTATION_INFO[0].DELIVERY_DATE_FORMATTED;
						pregInfoObj.setDeliveryDate(deliveryDateFormatted);
						pregInfoObj.setRtLookBack(pregInfoObj.getDelGesAge());
						deliveryDate=new Date();
						deliveryDate.setISO8601(deliveryDateFormatted);
						dateDiff = todayDate - deliveryDate;
						daysOfLife = Math.round(dateDiff / (1000 * 60 * 60 * 24));
						pregInfoObj.setRtLookBack(pregInfoObj.getRtLookBack() + daysOfLife);
					}
				}
				else if(recordData.STATUS_DATA.STATUS == "Z") {//no pregnancy
					pregInfoObj = new PregnancyInfo();
					pregInfoObj.setPregnancyId(0);
					pregInfoObj.setReopenPregInd(recordData.REOPEN_PREG_IND);
					var mPageTimer = MP_Util.CreateTimer("CAP:MPG.Pregnancy Data Retrieval");
					if(mPageTimer) {
						mPageTimer.SubTimerName = "Patient Not Pregnant";
						mPageTimer.Stop();
					}
				}
			}
			else {
				pregInfoObj = new PregnancyInfo();
				pregInfoObj.setPregnancyId(-1);
			}

			//Create or update the Shared Resource for all pregnancy components to use.
			pregResource = MP_Resources.getSharedResource("pregnancyInfo");
			if(pregResource) {
				//Update the shared resource and notify consumers
				MP_Resources.setSharedResourceData("pregnancyInfo", pregInfoObj);
			}
			else {
				pregResource = new SharedResource("pregnancyInfo");
				pregResource.setResourceData(pregInfoObj);
				pregResource.setIsAvailable(true);
				pregResource.setIsBeingRetrieved(false);
				pregResource.setEventListenerFlag("pregnancyInfoAvailable");
				//Set to null so all MPages and Components receive the event
				pregResource.setEventListenerObject(new MPageComponent());
				MP_Resources.addSharedResource("pregnancyInfo", pregResource);
			}

			//Need to check this flag because this resource may be retrieved prior to
			// rendering the MPage and
			//notifying the consumers causes them to render.
			if(notifyConsumers) {
				pregResource.notifyResourceConsumers();
			}
		},
		getLabel : function() {
			return this.m_label;
		},
		getComponentId : function() {
			return this.m_componentId;
		},
		getDeliveryData : function(sendAr, callbackFunc) {
			if(!this.m_deliveryData) {
				PREGNANCY_BASE_UTIL_O1.LoadDeliveryData(sendAr, callbackFunc);
			}
			return this.m_deliveryData;
		},
		setCriterion : function(criterion) {
			this.m_criterion = criterion;
		}
	};
}();
