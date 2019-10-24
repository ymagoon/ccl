function MedicationsComponentStyle() {
	this.initByNamespace("med");
}

MedicationsComponentStyle.prototype = new ComponentStyle();
MedicationsComponentStyle.prototype.constructor = ComponentStyle;

function MedicationsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new MedicationsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.MEDS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.MEDS.O1 - render component");
	this.m_prnLookback = 0;
	this.setIncludeLineNumber(false);
	//indicator for loading the medicines depending on bedrosk settings
	this.m_scheduled = false;
	this.m_continuous = false;
	this.m_prn = false;
	this.m_admin = false;
	this.m_susp = false;
	this.m_discont = false;
	//Sorting indicators
	this.m_scheduledSort = 0;
	this.m_prnAdminSort = 0;
	this.m_prnUnschedAvailSort = 0;
	this.m_continuousSort = 0;
	//FaceUp Date indicator
	this.m_faceUpDtSched = false;
	this.m_faceUpDtPRN = false;
	//look back hours for admin
	this.m_lookBkHrsForAdm = 24;
	this.m_lookBkHrsForDisCont = 24;
	//Look forward hours scheduled
	this.m_schedNextTwelve = 0;
	this.m_prnLastFortyEight = 0;
	this.m_wasListenerAdded = false;

	MedicationsComponent.method("InsertData", function() {
		CERN_MEDS_O1.GetMedicationData(this);
	});
	//sections
	MedicationsComponent.method("setPRNLookbackDays", function(value) {
		this.m_prnLookback = value;
	});
	MedicationsComponent.method("getPRNLookbackDays", function() {
		return (this.m_prnLookback);
	});

	MedicationsComponent.method("setScheduled", function(value) {
		this.m_scheduled = value;
	});
	MedicationsComponent.method("isScheduled", function() {
		return this.m_scheduled;
	});
	MedicationsComponent.method("setContinuous", function(value) {
		this.m_continuous = value;
	});
	MedicationsComponent.method("isContinuous", function() {
		return (this.m_continuous);
	});
	MedicationsComponent.method("setPRN", function(value) {
		this.m_prn = value;
	});
	MedicationsComponent.method("isPRN", function() {
		return (this.m_prn);
	});
	MedicationsComponent.method("setAdministered", function(value) {
		this.m_admin = value;
	});
	MedicationsComponent.method("isAdministered", function() {
		return this.m_admin;
	});
	MedicationsComponent.method("setSuspended", function(value) {
		this.m_susp = value;
	});
	MedicationsComponent.method("isSuspended", function() {
		return this.m_susp;
	});
	MedicationsComponent.method("setDiscontinued", function(value) {
		this.m_discont = value;
	});
	MedicationsComponent.method("isDiscontinued", function() {
		return this.m_discont;
	});

	MedicationsComponent.method("setAdministeredLookBkHrs", function(value) {
		this.m_lookBkHrsForAdm = value;
	});
	MedicationsComponent.method("getAdministeredLookBkHrs", function() {
		return this.m_lookBkHrsForAdm;
	});

	MedicationsComponent.method("setDiscontinuedLookBkHr", function(value) {
		this.m_lookBkHrsForDisCont = value;
	});
	MedicationsComponent.method("getDiscontinuedLookBkHr", function() {
		return this.m_lookBkHrsForDisCont;
	});

	//Sort Getters/Setters
	MedicationsComponent.method("setScheduledSort", function(value) {
		this.m_scheduledSort = value;
	});
	MedicationsComponent.method("getScheduledSort", function() {
		return (this.m_scheduledSort);
	});
	MedicationsComponent.method("setPRNAdminSort", function(value) {
		this.m_prnAdminSort = value;
	});
	MedicationsComponent.method("getPRNAdminSort", function() {
		return (this.m_prnAdminSort);
	});
	MedicationsComponent.method("setPRNUnschedAvailSort", function(value) {
		this.m_prnUnschedAvailSort = value;
	});
	MedicationsComponent.method("getPRNUnschedAvailSort", function() {
		return (this.m_prnUnschedAvailSort);
	});
	MedicationsComponent.method("setContinuousSort", function(value) {
		this.m_continuousSort = value;
	});
	MedicationsComponent.method("getContinuousSort", function() {
		return (this.m_continuousSort);
	});
	MedicationsComponent.method("setDisplayPRNFaceUpDt", function(value) {
		this.m_faceUpDtPRN = value;
	});
	MedicationsComponent.method("getDisplayPRNFaceUpDt", function() {
		return (this.m_faceUpDtPRN);
	});
	MedicationsComponent.method("setScheduleNextDose", function(value) {
		this.m_faceUpDtSched = value;
	});
	MedicationsComponent.method("getScheduleNextDose", function() {
		return (this.m_faceUpDtSched);
	});
	MedicationsComponent.method("setPRNLastDose", function(value) {
		this.m_faceUpDtPRN = value;
	});
	MedicationsComponent.method("getPRNLastDose", function() {
		return (this.m_faceUpDtPRN);
	});
	MedicationsComponent.method("setSchedNextTwelve", function(value) {
		this.m_schedNextTwelve = value;
	});
	MedicationsComponent.method("getSchedNextTwelve", function() {
		return (this.m_schedNextTwelve);
	});
	MedicationsComponent.method("setPRNLastFortyEight", function(value) {
		this.m_prnLastFortyEight = value;
	});
	MedicationsComponent.method("getPRNLastFortyEight", function() {
		return (this.m_prnLastFortyEight);
	});
	MedicationsComponent.method("openTab", function() {
		var criterion = this.getCriterion();

		var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
		APPLINK(0, criterion.executable, sParms);
		this.InsertData();
	});

}

MedicationsComponent.prototype = new MPageComponent();
MedicationsComponentStyle.prototype.constructor = MPageComponent;
/**
 * Sets the m_wasListenerAdded member variable to the value provided.
 * @param {Boolean} value - true or false value to indicate if the event listener has been added.
 * @returns {undefined} - undefined
 */
MedicationsComponent.prototype.setWasListenerAdded = function(value){
	this.m_wasListenerAdded = value;
};
/**
 * Gets the m_wasListenerAdded member variable value.
 * @returns {Boolean} - the wasListenerAdded flag
 */
MedicationsComponent.prototype.getWasListenerAdded = function(){
	return this.m_wasListenerAdded;
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} - undefined
 */
MedicationsComponent.prototype.loadFilterMappings = function() {

	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("MEDS_INFO_BUTTON_IND", {
		setFunction: this.setHasInfoButton,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};

/**
 * Medication methods
 * @namespace CERN_MEDS_O1
 * @static
 * @global
 */
var CERN_MEDS_O1 = function() {

	function createMedicationItem(orders, faceUpDateFlag, adminFlag, component) {
		var item = [];
		var medOrigDate = "", medHvrOrigDate = "", startDate = "", origOrderDate = "", stopDate = "", stopReason = "", nextDoseDate = "", lastDoesDate = "", respProv = "";
		var currentDate = new Date();
		var medsI18n = i18n.discernabu.medications_o1;
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var fullDateTime4Year = mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR;
		var dateTime = new Date();
		var sDate = getHeadsUpMedicationDate(orders);
		var criterion = component.getCriterion();

		var sRejIcn = "";
		var sHvrRej = "";
		var medIsRej = "";
		var infoClass = "";
		var synonymId = orders.MEDICATION_INFORMATION.SYNONYM_ID;
		var priCriteriaCd = orders.MEDICATION_INFORMATION.PRIMARY_CRITERIA_CD;

		if (orders.CORE.REJECTED_IND == 1) {
			sRejIcn = "<dd class='med-rejected'>&nbsp;</dd>";
			sHvrRej = "<dd class='med-det-name'><span class='res-severe'>" + medsI18n.REJECTED_BY_PHARMACY + "</span></dd>";
			medIsRej = "med-is-rej";
		}

		if (sDate) {
			dateTime.setISO8601(sDate);
			medOrigDate = df.formatISO8601(sDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			medHvrOrigDate = df.formatISO8601(sDate, fullDateTime4Year);
		}

		if (orders.SCHEDULE.CURRENT_START_DT_TM) {
			startDate = df.formatISO8601(orders.SCHEDULE.CURRENT_START_DT_TM, fullDateTime4Year);
		}
		if (orders.SCHEDULE.ORIG_ORDER_DT_TM) {
			origOrderDate = df.formatISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM, fullDateTime4Year);
		}
		if (orders.SCHEDULE.PROJECTED_STOP_DT_TM) {
			stopDate = df.formatISO8601(orders.SCHEDULE.PROJECTED_STOP_DT_TM, fullDateTime4Year);
			if (orders.SCHEDULE.STOP_REASON_DISPLAY) {
				stopReason = orders.SCHEDULE.STOP_REASON_DISPLAY;
			}
		}
		if (orders.DETAILS.NEXT_DOSE_DT_TM) {
			nextDoseDate = df.formatISO8601(orders.DETAILS.NEXT_DOSE_DT_TM, fullDateTime4Year);
		}
		else {
			nextDoseDate = medsI18n.NOT_AVAILABLE;
		}
		if (orders.DETAILS.LAST_DOSE_DT_TM) {
			lastDoesDate = df.formatISO8601(orders.DETAILS.LAST_DOSE_DT_TM, fullDateTime4Year);
		}

		var jsSeverity = "res-normal";

		if (orders.CORE.RESPONSIBLE_PROVIDER_ID !== 0) {
			respProv = orders.CORE.RESPONSIBLE_PROVIDER;
		}

		//for the date that is displayed heads up is either last given for PRN, no date for continous, and next does for scheduled
		item.push("<h3 class='info-hd'><span>", orders.DISPLAYS.DISPLAY_NAME, "</span></h3>");

		//Determine state of Info Button
		if (component.isInfoButtonEnabled() && component.hasInfoButton()) {
			infoClass = "info-icon";
		}
		else {
			infoClass = "info-icon hidden";
		}

		var faceupDate;
		if (faceUpDateFlag) {
			faceupDate = medOrigDate;
			//Show "--" when Next dose is not available face-up in Scheduled subsection
			if (!faceupDate && !(orders.SCHEDULE.PRN_IND == 1 || orders.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1 || orders.SCHEDULE.CONSTANT_IND == 1 || orders.CORE.STATUS_MEANING == "DISCONTINUED" || orders.CORE.STATUS_MEANING == "CANCELED" || orders.CORE.STATUS_MEANING == "SUSPENDED")) {
				faceupDate = "--";
			}
			item.push("<dl class='med-info ", medIsRej, " '><dd class='med-name'><span data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, "'>&nbsp;</span><span class='med-rej-ind'>&nbsp;</span><span class='", jsSeverity, "'>", orders.DISPLAYS.DISPLAY_NAME, "</span><span class='med-sig detail-line'>", orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE, "</span></dd><dd class='med-date'><span class='", jsSeverity, "'>", faceupDate, "</span></dd></dl>");
		}
		else if (adminFlag === "AdminMed") {
			item.push("<dl class='med-info ", medIsRej, " '><dd><span data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, "'>&nbsp;</span><span class='med-rej-ind'>&nbsp;</span><span class='", jsSeverity, "'>", orders.DISPLAYS.DISPLAY_NAME, "</span></dl>");
		}
		else {
			item.push("<dl class='med-info ", medIsRej, " '><dd><span data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, "'>&nbsp;</span><span class='med-rej-ind'>&nbsp;</span><span class='", jsSeverity, "'>", orders.DISPLAYS.DISPLAY_NAME, "</span><span class='med-sig detail-line'>", orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE, "</span></dd></dl>");
		}
		

		item.push("<h4 class='det-hd'><span>", medsI18n.MED_DETAIL, "</span></h4>", "<div class='hvr'><dl class='med-det'>", sRejIcn, sHvrRej, "<dt><span>", medsI18n.MED_NAME, ":</span></dt><dd class='med-det-name'><span>", orders.DISPLAYS.HOVER_NAME, "</span></dd>");
		if (adminFlag != "AdminMed") {
			item.push("<dt><span>", medsI18n.ORDER_DETAILS, ":</span></dt><dd class='med-det-dt'><span>", orders.DISPLAYS.CLINICAL_DISPLAY_LINE, "</span></dd>");
		}
		item.push("<dt><span>", medsI18n.ORDER_COMMENTS, ":</span></dt><dd class='med-det-dt'><span>", orders.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />"), "</span></dd>");
		//replace new lines with <br /> tag
		if (orders.DISPLAYS.DISPLAY_NAME) {
			item.push("<dt><span>", medsI18n.REQUESTED_START, ":</span></dt><dd class='med-det-dt'><span>", startDate, "</span></dd>");
		}
		else {
			item.push("<dt><span>", medsI18n.REQUESTED_START, ":</span></dt><dd class='med-det-dt'><span>&nbsp;</span></dd>");
		}

		item.push("<dt><span>", medsI18n.ORIG_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", origOrderDate, "</span></dd>");
		/*
		 STOP_DT_TM: "Stop Date/Time",
		 STOP_REASON: "Stop Reason",
		 */
		item.push("<dt><span>", medsI18n.LAST_DOSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", lastDoesDate, "</span></dd>");

		if (!(orders.SCHEDULE.PRN_IND == 1 || orders.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1 || orders.SCHEDULE.CONSTANT_IND == 1 || orders.CORE.STATUS_MEANING == "DISCONTINUED" || orders.CORE.STATUS_MEANING == "CANCELED" || orders.CORE.STATUS_MEANING == "SUSPENDED")) {
			item.push("<dt><span>", medsI18n.NEXT_DOSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", nextDoseDate, "</span></dd>");
		}
		item.push("<dt><span>", medsI18n.STOP_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", stopDate, "</span></dd>", "<dt><span>", medsI18n.STOP_REASON, ":</span></dt><dd class='med-det-dt'><span>", stopReason, "</span></dd>");
		item.push("<dt><span>", medsI18n.RESPONSIBLE_PROVIDER, ":</span></dt><dd class='med-det-dt'><span>", respProv, "</span></dd>");
		item.push("<dt><span>", medsI18n.STATUS, ":</span></dt><dd class='med-det-dt'><span>", orders.CORE.STATUS_DISPLAY, "</span></dd>");
		if (adminFlag === "AdminMed") {
			item.push("</dl></div>");
		}
		else {
			item.push("<dt><span>", medsI18n.DETAILS, ":</span></dt><dd class='med-det-dt'><span>", orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE, "</span></dd>", "</dl></div>");
		}

		return (item.join(""));
	}
	
	function createMedicationItemFromArray(ordersArray, faceUpDateFlag, component) {
		var jsMedItem = [];
		for (var z = 0, zl = ordersArray.length; z < zl; z++) {
			jsMedItem.push(createMedicationItem(ordersArray[z], faceUpDateFlag, null, component));
		}
		return jsMedItem;
	}

	function getHeadsUpMedicationDate(a) {
		if (a.SCHEDULE.PRN_IND === 1 || a.SCHEDULE.FREQUENCY.UNSCHEDULED_IND === 1) {
			return a.DETAILS.LAST_DOSE_DT_TM;
		}
		else if (a.SCHEDULE.CONSTANT_IND === 1) {
			return "";
		}
		else if (a.SCHEDULE.SUSPENDED_DT_TM === "") {
			return a.DETAILS.NEXT_DOSE_DT_TM;
		}
		else {
			return "";
		}	
	}

	function SortByMedicationName(a, b) {
		var aName = a.DISPLAYS.DISPLAY_NAME;
		var bName = b.DISPLAYS.DISPLAY_NAME;
		var aUpper = (aName) ? aName.toUpperCase() : "";
		var bUpper = (bName) ? bName.toUpperCase() : "";

		if (aUpper > bUpper) {
			return 1;
		}
		else if (aUpper < bUpper) {
			return -1;
		}
		return 0;
	}

	function SortByLastDose(a, b) {
		if (a.DETAILS.LAST_DOSE_DT_TM > b.DETAILS.LAST_DOSE_DT_TM) {
			return -1;
		}
		else if (a.DETAILS.LAST_DOSE_DT_TM < b.DETAILS.LAST_DOSE_DT_TM) {
			return 1;
		}
		else {
			return 0;
		}
	}

	function SortByNextDose(a, b) {
		if (!a.DETAILS.NEXT_DOSE_DT_TM || !b.DETAILS.NEXT_DOSE_DT_TM) {
			if (a.DETAILS.NEXT_DOSE_DT_TM > b.DETAILS.NEXT_DOSE_DT_TM) {
				return -1;
			}
			if (a.DETAILS.NEXT_DOSE_DT_TM < b.DETAILS.NEXT_DOSE_DT_TM) {
				return 1;
			}

		}
		if (a.DETAILS.NEXT_DOSE_DT_TM > b.DETAILS.NEXT_DOSE_DT_TM) {
			return 1;
		}
		else if (a.DETAILS.NEXT_DOSE_DT_TM < b.DETAILS.NEXT_DOSE_DT_TM) {
			return -1;
		}
		else {
			return 0;
		}
	}

	function sortMedications(orders, sortType) {
		switch (sortType) {
			case CERN_MEDS_O1.LastDoseDateTime:
				orders.sort(SortByLastDose);
				break;
			case CERN_MEDS_O1.NextDoseDateTime:
				orders.sort(SortByNextDose);
				break;
			default:
				orders.sort(SortByMedicationName);
		}
	}

	return {
		GetMedicationData: function(component) {
			var criterion = component.getCriterion();
			var medsProgramName = "MP_RETRIEVE_MEDICATIONS";
			var sendAr = null;
			var request = null;
			var disctLookbackUnits = null;
			var adminLookbackUnits = null;
			var sEncntr = null;
			var schContPRN = false;
			if (component.isScheduled() || component.isContinuous() || component.isPRN()) {
				schContPRN = true;
			}
			sendAr = [];
			if(!component.getWasListenerAdded()){
				CERN_EventListener.addListener(component, EventListener.EVENT_ORDER_ACTION, component.InsertData, component);
				component.setWasListenerAdded(true);
			}
			disctLookbackUnits = component.getDiscontinuedLookBkHr();
			adminLookbackUnits = component.getAdministeredLookBkHrs();
			sEncntr = (component.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
			sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", component.getLookbackUnits(), "^" + schContPRN + "^", "^" + component.isAdministered() + "^", "^" + component.isSuspended() + "^", "^" + component.isDiscontinued() + "^", disctLookbackUnits, adminLookbackUnits, component.getLookbackUnitTypeFlag());
			sendAr.push(criterion.ppr_cd + ".0", "^" + criterion.executable + "^");
			request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
			request.setProgramName(medsProgramName);
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(component, request, CERN_MEDS_O1.RenderReply);
		},
		RenderReply: function(replyObj) {
			var component = replyObj.getComponent();
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			var medsI18n = i18n.discernabu.medications_o1;
			var countText = "";
			try {
				var AdministeredCount = 0;
				var AdministeredRejCount = 0;
				var continousCount = 0;
				var continousRejCount = 0;
				var dateTime = new Date();
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var DiscontinuedCount = 0;
				var DiscontinuedRejCount = 0;
				var item;
				var jsAdministered = [];
				var jsContinous = [];
				var jsDiscontinued = [];
				var jsHTML = [];
				var jsPRNAdmin = [];
				var jsPRNUnschedAvail = [];
				var jsScheduled = [];
				var jsSuspended = [];
				var order;
				var prnCount = 0;
				var prnLast48Orders = [];
				var prnRejCount = 0;
				var prnUnschedAvailCount = 0;
				var prnUnschedAvailRejCount = 0;
				var recordData;
				var schedLookaheadHrs;
				var prnLastFortyEight = 0;
				var scheduledCount = 0;
				var scheduledRejCount = 0;
				var sDate;
				var sHTML = "";
				var strRejMedClass = "";
				var SuspendedCount = 0;
				var SuspendedRejCount = 0;
				var z;
				var zl;

				if (replyObj.getStatus() === "S") {
					recordData = replyObj.getResponse();
					recordData.SCHCONTPRN_ORDERS.sort(SortByMedicationName);

					if (component.getPRNLastFortyEight()) {
						prnLastFortyEight = 48;
					}

					var prnLastFortyEightDate = new Date();
					var lastFortyEightHrs = prnLastFortyEightDate.getHours() - prnLastFortyEight;
					prnLastFortyEightDate.setHours(lastFortyEightHrs);

					var prnLookbackDays = component.getPRNLookbackDays();
					var prnLookbackDate = new Date();
					var hrs = prnLookbackDate.getHours() - (24 * prnLookbackDays);
					prnLookbackDate.setHours(hrs);

					if (component.getSchedNextTwelve()) {
						schedLookaheadHrs = 12;
					}

					var schedLookaheadDate = new Date();
					var schedHrs = schedLookaheadDate.getHours() + schedLookaheadHrs;
					schedLookaheadDate.setHours(schedHrs);

					var orderPrnAdmin = [];
					var orderScheduled = [];
					var orderPRNUnschedAvail = [];
					var orderContinuous = [];

					//for PRN/Unscheduled, Scheduled, and Continous only retrieve these type of medications if
					//they are in the following status:
					//ordered, inprocess, future, incomplete, onhold.

					for (var y = 0, yl = recordData.SCHCONTPRN_ORDERS.length; y < yl; y++) {
						dateTime = new Date();
						order = recordData.SCHCONTPRN_ORDERS[y];

						if (order.CORE.STATUS_MEANING) {
							item = null;
							switch (order.CORE.STATUS_MEANING) {
								case "ORDERED":
								case "INPROCESS":
								case "FUTURE":
								case "INCOMPLETE":
								case "MEDSTUDENT":
									if (order.SCHEDULE.PRN_IND == 1 || order.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1) {
										if (prnLookbackDays > 0) {
											sDate = getHeadsUpMedicationDate(order);
											if (sDate) {
												dateTime.setISO8601(sDate);
												if (dateTime >= prnLookbackDate) {
													orderPrnAdmin.push(order);
													if (order.CORE.REJECTED_IND == 1) {
														prnRejCount++;
													}
													prnCount++;
												}

											}

										}

										if (prnLastFortyEight > 0) {
											var curDate = new Date();
											sDate = getHeadsUpMedicationDate(order);
											if (sDate) {
												dateTime.setISO8601(sDate);
												if ((dateTime >= prnLastFortyEightDate) && (dateTime <= curDate)) {
													orderPRNUnschedAvail.push(order);

													if (order.CORE.REJECTED_IND == 1) {
														prnUnschedAvailRejCount++;
													}
													prnUnschedAvailCount++;
												}

											}
										}
										else {
											orderPRNUnschedAvail.push(order);
											if (order.CORE.REJECTED_IND == 1) {
												prnUnschedAvailRejCount++;
											}
											prnUnschedAvailCount++;
										}

									}
									else if (order.SCHEDULE.CONSTANT_IND === 1) {
										orderContinuous.push(order);
										if (order.CORE.REJECTED_IND == 1) {
											continousRejCount++;
										}
										continousCount++;
									}
									else if (order.SCHEDULE.SUSPENDED_DT_TM === "") {
										if (schedLookaheadHrs > 0) {
											sDate = getHeadsUpMedicationDate(order);
											if (sDate) {
												dateTime.setISO8601(sDate);
												var curDateTime = new Date();
												if ((dateTime <= schedLookaheadDate) && (dateTime >= curDateTime)) {
													orderScheduled.push(order);
													if (order.CORE.REJECTED_IND == 1) {
														scheduledRejCount++;
													}
													scheduledCount++;
												}
											}
										}
										else {
											orderScheduled.push(order);
											if (order.CORE.REJECTED_IND == 1) {
												scheduledRejCount++;
											}
											scheduledCount++;
										}
									}
									break;
							}
						}
					}
					var prnSort = component.getPRNAdminSort();
					sortMedications(orderPrnAdmin, prnSort);

					jsPRNAdmin = createMedicationItemFromArray(orderPrnAdmin, true, component);

					var schedSort = component.getScheduledSort();

					if (component.getScheduleNextDose()) {
						sortMedications(orderScheduled, CERN_MEDS_O1.NextDoseDateTime);
					}
					else {
						sortMedications(orderScheduled, schedSort);
					}
					jsScheduled = createMedicationItemFromArray(orderScheduled, component.getScheduleNextDose(), component);

					var prnUnschedAvailSort = component.getPRNUnschedAvailSort();
					if (component.getPRNLastDose()) {
						sortMedications(orderPRNUnschedAvail, CERN_MEDS_O1.LastDoseDateTime);
					}
					else {
						sortMedications(orderPRNUnschedAvail, prnUnschedAvailSort);
					}

					jsPRNUnschedAvail = createMedicationItemFromArray(orderPRNUnschedAvail, component.getDisplayPRNFaceUpDt(), component);

					var continuousSort = component.getContinuousSort();
					sortMedications(orderContinuous, continuousSort);
					jsContinous = createMedicationItemFromArray(orderContinuous, null, component);

					//process Administered Results
					recordData.ADMIN_ORDERS.sort(SortByMedicationName);
					for ( z = 0, zl = recordData.ADMIN_ORDERS.length; z < zl; z++) {

						order = recordData.ADMIN_ORDERS[z];

						jsAdministered.push(createMedicationItem(order, null, "AdminMed", component));
						if (order.CORE.REJECTED_IND == 1) {
							AdministeredRejCount++;
						}
						AdministeredCount++;
					}
					//Process Suspended orders
					recordData.SUSP_ORDERS.sort(SortByMedicationName);
					for ( z = 0, zl = recordData.SUSP_ORDERS.length; z < zl; z++) {
						order = recordData.SUSP_ORDERS[z];
						item = createMedicationItem(order, null, null, component);
						jsSuspended.push(item);
						if (order.CORE.REJECTED_IND == 1) {
							SuspendedRejCount++;
						}
						SuspendedCount++;
					}
					//Process Discontinued Orders
					recordData.DISCONT_ORDERS.sort(SortByMedicationName);
					for ( z = 0, zl = recordData.DISCONT_ORDERS.length; z < zl; z++) {
						order = recordData.DISCONT_ORDERS[z];
						item = createMedicationItem(order, null, null, component);
						jsDiscontinued.push(item);
						if (order.CORE.REJECTED_IND == 1) {
							DiscontinuedRejCount++;
						}
						DiscontinuedCount++;
					}
				}

				if (component.isScheduled()) {
					var lookFwdText = "";
					if (schedLookaheadHrs > 0) {
						//Add Code for Nursing
						lookFwdText = " " + medsI18n.NEXT_N_HOURS.replace("{0}", schedLookaheadHrs);
					}

					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.SCHEDULED, " (", scheduledCount, ")", lookFwdText, " </span></h3>");
					if ((component.getScheduleNextDose()) && (scheduledCount > 0)) {
						strRejMedClass = "";
						if (scheduledRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr hdr'><dd class='med-name'></dd><dd class='med-date'>", medsI18n.NEXT_DOSE, "</dd></dl></div><div class='content-body ", strRejMedClass, " '>", jsScheduled.join(""), "</div></div>");
					}
					else if (scheduledCount > 0) {
						if (scheduledRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsScheduled.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}
				if (component.isContinuous()) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.CONTINOUS, " (", continousCount, ")</span></h3>");
					if (continousCount > 0) {
						strRejMedClass = "";
						if (continousRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsContinous.join(""), "</div></div>");
					}
					jsHTML.push("</div>");

				}

				if (component.getPRNLookbackDays() > 0) {

					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.PRN, "/", medsI18n.UNSCHEDULED, " (", prnCount, ")");
					jsHTML.push(" ", medsI18n.ADMIN_LAST_N_HOURS.replace("{0}", component.getPRNLookbackDays() * 24));
					jsHTML.push("</span></h3>");
					if (prnCount > 0) {
						strRejMedClass = "";
						if (prnRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr hdr'><dd class='med-name'></dd><dd class='med-date'>", medsI18n.LAST_GIVEN, "</dd></dl></div><div class='content-body ", strRejMedClass, " '>", jsPRNAdmin.join(""), "</div></div>");
					}
					jsHTML.push("</div>");

				}

				if (component.isPRN()) {

					var lastFortyEightText = "";
					if (prnLastFortyEight > 0) {
						//Add Code for Nursing
						lastFortyEightText = " " + medsI18n.LAST_N_HOURS.replace("{0}", prnLastFortyEight);
					}
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.PRN_UNSCHEDULED, " (", prnUnschedAvailCount, ")", lastFortyEightText);
					jsHTML.push("</span></h3>");
					if (prnUnschedAvailCount > 0) {
						strRejMedClass = "";
						if (prnUnschedAvailRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						if (component.getPRNLastDose()) {
							jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr hdr'><dd class='med-name'></dd><dd class='med-date'>", medsI18n.LAST_DOSE_DT_TM, "</dd></dl></div><div class='content-body ", strRejMedClass, " '>", jsPRNUnschedAvail.join(""), "</div></div>");
						}
						else {
							jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsPRNUnschedAvail.join(""), "</div></div>");
						}
					}
					jsHTML.push("</div>");
				}

				if (component.isAdministered()) {
					jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.ADMINISTERED, " (", AdministeredCount, ")");
					if (component.getAdministeredLookBkHrs() > 0) {
						jsHTML.push(" ", medsI18n.LAST_N_HOURS.replace("{0}", component.getAdministeredLookBkHrs()));
					}
					jsHTML.push("</span></h3>");
					if (AdministeredCount > 0) {
						strRejMedClass = "";
						if (AdministeredRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsAdministered.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.isSuspended()) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.SUSPENDED, " (", SuspendedCount, ")</span></h3>");
					if (SuspendedCount > 0) {
						strRejMedClass = "";
						if (SuspendedRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsSuspended.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.isDiscontinued()) {
					jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl ' title='", medsI18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'>", medsI18n.DISCONTINUED, " (", DiscontinuedCount, ")");
					if (component.getDiscontinuedLookBkHr() > 0) {
						jsHTML.push(" ", medsI18n.LAST_N_HOURS.replace("{0}", component.getDiscontinuedLookBkHr()));
					}
					jsHTML.push("</span></h3>");
					if (DiscontinuedCount > 0) {
						strRejMedClass = "";
						if (DiscontinuedRejCount > 0) {
							strRejMedClass = "med-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='content-body ", strRejMedClass, " '>", jsDiscontinued.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}
				var content = [];
				var totalLength = DiscontinuedCount + SuspendedCount + AdministeredCount + prnCount + continousCount + scheduledCount + prnUnschedAvailCount;
				content.push("<div class='", MP_Util.GetContentClass(component, totalLength), "'>", jsHTML.join(""), "</div>");
				sHTML = content.join("");
				countText = MP_Util.CreateTitleText(component, totalLength);
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

				//Add Info Button click events
				if (component.hasInfoButton()) {
					var secContentEl = component.getSectionContentNode();
					var secContentId = secContentEl.id;
					var medInfoIcons = $("#" + secContentId).find(".info-icon");
					$.each(medInfoIcons, function() {
						$(this).click(function(e) {
							//Get the values needed for the API
							var patId = $(this).attr("data-patId");
							var encId = $(this).attr("data-encId");
							var synonymId = $(this).attr("data-synonymId");
							var priCriteriaCd = $(this).attr("data-priCriteriaCd");
							var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
							try {
								if (launchInfoBtnApp) {
									launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
									launchInfoBtnApp.AddMedication(parseFloat(synonymId));
									launchInfoBtnApp.LaunchInfoButton();
								}
							}
							catch(err) {
								var error_msg = (err.message||i18n.discernabu.INFO_BUTTON_ERROR_MSG);
								MP_Util.LogError(err.name + error_msg);
								var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
								if (!errorModal) {
									errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
									errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
									//Create and add the close button
									var closeButton = new ModalButton("closeButton");
									closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
									errorModal.addFooterButton(closeButton);
								}
								MP_ModalDialog.updateModalDialogObject(errorModal);
								MP_ModalDialog.showModalDialog("errorModal");
								return;
							}
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
						});
					});
				}
			}
			catch (err) {
				var errMsg = [];
				errMsg.push("<b>", medsI18n.JS_ERROR, "</b><br><ul><li>", medsI18n.MESSAGE, ": ", err.message, "</li><li>", medsI18n.NAME, ": ", err.name, "</li><li>", medsI18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", medsI18n.DESCRIPTION, ": ", err.description, "</li></ul>");
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);

				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			}
			finally {
				if (timerRenderComponent) {
					timerRenderComponent.Stop();
				}
			}
		}
	};
}();
CERN_MEDS_O1.LastDoseDateTime = 1;
CERN_MEDS_O1.NextDoseDateTime = 2;
