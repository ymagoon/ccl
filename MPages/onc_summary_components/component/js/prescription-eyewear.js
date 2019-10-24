/**
 * The prescription eyewear component style
 * @class
 */
function OphPrescriptionEyewearComponentStyle() {
	this.initByNamespace("pres-eye");
}

OphPrescriptionEyewearComponentStyle.inherits(ComponentStyle);

/**
 * The Prescription Eyewear component
 * @param criterion  The criterion containing the requested information
 * @class
 */
function OphPrescriptionEyewearComponent(criterion) {
	this.setCriterion(criterion);
	this.df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	this.setLookBackDropDown(true);
	this.setStyles(new OphPrescriptionEyewearComponentStyle());
	this.setIncludeLineNumber(false);
	this.setComponentLoadTimerName("USR:MPG.OphPresEyewear - Load Component");
	this.setComponentRenderTimerName("ENG:MPG.OphPresEyewear - Render Component");
	this.m_iViewAdd = false;
	this.m_bandName = "";
	this.m_sectionName = "";
	this.m_itemName = "";
	this.m_fax_status_flag = true;
	this.m_isInternal = false;
	this.m_providerBox = {};
	this.m_faxNumber = "";
	this.m_provider_id = "";
	this.m_fax_PersonId = "";
	this.m_Entity_type = "";
	this.m_rowcount = "";
	this.m_selParentEvtId = "";
	this.m_category_mean = this.getCriterion().category_mean;
	this.m_presI18n = i18n.discernabu.prescription_eyewear;
}
OphPrescriptionEyewearComponent.prototype = new MPageComponent();
OphPrescriptionEyewearComponent.prototype.constructor = MPageComponent;

/**
 * Sets MPageComponent variable 'm_iViewAdd'
 * @param value  The value to which variable has to be set
 */
OphPrescriptionEyewearComponent.prototype.setIViewAdd = function (value) {
	this.m_iViewAdd = value;
};
/**
 * Returns MPageComponent variable 'm_iViewAdd'
 * @return m_iViewAdd
 */
OphPrescriptionEyewearComponent.prototype.isIViewAdd = function () {
	return this.m_iViewAdd;
};
/**
 * Opens Powerform of Prescription Eyewear component
 * @param formID  Identifier value of current form
 */
OphPrescriptionEyewearComponent.prototype.openDropDown = function (formID) {
	var criterion = this.getCriterion();
	var self = this;
	var activityIdBefore = "";
	var activityIdAfter = "";
	var paramString_pf = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
	var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", formID + ".0"];
	//Get the dcp_activity_id before launching powerform
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function (scriptReply) {
		var recordData = scriptReply.getResponse();
		activityIdBefore = recordData.FORM_ACTIVITY_ID;
		MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString_pf, "prescription_eyewear.js", "openDropForm");
	});
	scriptRequest.performRequest();

	//Launching powerform
	MPAGES_EVENT("POWERFORM", paramString_pf);

	//Get the dcp_activity_id after launching powerform
	var scriptReq = new ScriptRequest();
	scriptReq.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
	scriptReq.setParameterArray(sendAr);
	scriptReq.setAsyncIndicator(true);
	scriptReq.setResponseHandler(function (scriptReply) {
		var recordData = scriptReply.getResponse();
		activityIdAfter = recordData.FORM_ACTIVITY_ID;
		MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString_pf, "prescription_eyewear.js", "openDropForm");

		//Link the other powerForm;If activity Id's are not equal the linking powerform script is called
		if (activityIdBefore == activityIdAfter) {
			return;
		}
		var param = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", +activityIdAfter + ".0"];
		var request = new ScriptRequest();
		request.setProgramName("MP_OPH_LINK_FRAME_OPTICAL");
		request.setParameterArray(param);
		request.setAsyncIndicator(false);
		request.setResponseHandler(function (scriptReply) {
			var recordReply = scriptReply.getResponse();
		});
		request.performRequest();
	});
	scriptReq.performRequest();
};

/**
 * Opens Powerform of Prescription Eyewear component
 */
OphPrescriptionEyewearComponent.prototype.openTab = function () {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "prescription_eyewear.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
};

/**
 * Loads bedrock filters
 */
OphPrescriptionEyewearComponent.prototype.loadFilterMappings = function () {
	this.addFilterMappingObject("OPH_PRES_EYEWEAR_IND", {
		setFunction : this.setIViewAdd,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * Opens IView of Prescription Eyewear component
 */
OphPrescriptionEyewearComponent.prototype.openIView = function () {
	var criterion = this.getCriterion();
	var paramString = "'" + this.m_bandName + "','" + this.m_sectionName + "','" + this.m_itemName + "'," + criterion.person_id + ".0," + criterion.encntr_id + ".0";
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "prescription_eyewear.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.m_bandName, this.m_sectionName, this.m_itemName, criterion.person_id + ".0", criterion.encntr_id + ".0");
	} catch (err) {
		MP_Util.LogJSError(err, null, "prescription_eyewear.js", "openIView");
	}
};

/**
 *Retrieves results for prescription Eyewear component
 */
OphPrescriptionEyewearComponent.prototype.retrieveComponentData = function () {
	var self = this;
	var criterion = self.getCriterion();
	var personId = self.getCriterion().person_id;
	var encounterId = self.getCriterion().encntr_id;
	var powerform_name = "FRAMELENSFORM";
	var startDateTime = "";
	var endDateTime = "";
	var recordData;
	var encntrId = (self.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
	try {
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("mp_oph_retrieve_results");
		scriptRequest.setParameterArray(["'MINE'," + personId + ".0,"
				 + encntrId + ",'" + powerform_name + "',"
				 + this.getLookbackUnits() + ","
				 + this.getLookbackUnitTypeFlag() + ",'" + startDateTime + "','"
				 + endDateTime + "'"]);
		scriptRequest.setComponent(this);
		scriptRequest.performRequest();
	} catch (err) {
		logger.logJSError(err, this, "prescription_eyewear.js",
			"RetrieveComponent");
	}
};

/**
 * Renders the retrieved results in the prescription eyewear component
 * @param replyAr - Response of the script from the retreiveComponent
 * @return - Returns the html to render the Prescription Eyewear Component
 */
OphPrescriptionEyewearComponent.prototype.renderComponent = function (replyAr) {

	var numberResults = 0;
	var results = replyAr.LIST;
	var self = this;
	var compId = this.getComponentId();

	this.processResultsForRender(results);

	var presEyeTable = new ComponentTable();
	presEyeTable.setNamespace(this.getStyles().getId());
	presEyeTable.setZebraStripe(true);

	// Create the prescription type column
	var presTypeColumn = new TableColumn();
	presTypeColumn.setColumnId("PRES_TYPE");
	presTypeColumn.setCustomClass("pres-eye-type");
	presTypeColumn.setColumnDisplay(this.m_presI18n.PRESCRIPTION_TYPE);
	presTypeColumn.setRenderTemplate("<p>&nbsp;<a class = 'pres-eye-launch-form' id = 'dcpFormActivityId" + compId + "' data-dcpForms = ${DCP_FORMS_ACTIVITY_ID} > " + this.m_presI18n.GLASSESRX + "&nbsp;(${PRES_GLASS_TYPE}) </a><span class=${MODIFY_ICON}> </span><br/><span class = 'pres-eye-corr' >" + this.m_presI18n.CORRECTION_FOR + "&nbsp;${PRES_FRAME_CORR} </span></p>");

	//Create the author column
	var authorColumn = new TableColumn();
	authorColumn.setColumnId("AUTHOR");
	authorColumn.setCustomClass("pres-eye-auth");
	authorColumn.setColumnDisplay(this.m_presI18n.AUTHOR);
	authorColumn.setRenderTemplate('&nbsp; <span class = "pres-eye-auth-content" > ${ PRES_AUTHOR_NAME } </span>');

	var outputContainerHTML = "";
	outputContainerHTML += "<div class = 'pres-eye-mhover' id = 'pres-eye-opt-hover-id'>"
	 + "<div class = 'pres-eye-modify-img' id = 'dcpFormActivityId" + compId + "' data-dcpForms = ${DCP_FORMS_ACTIVITY_ID} ></div>"
	 + "<div class ='pres-eye-print-img' id = 'presprintId" + compId + "' data-presPrintId = ${PRES_PARENT_EVENT_ID}></div>"
	 + "<div class ='pres-eye-fax-img' id = 'presfaxId" + compId + "' data-presFaxId = ${PRES_EYE_EVENT_ID}></div>"
	 + "</div>";

	// Create the date column
	var DateColumn = new TableColumn();
	DateColumn.setColumnId("DATE");
	DateColumn.setCustomClass("pres-eye-create");
	DateColumn.setColumnDisplay(this.m_presI18n.CREATED);
	DateColumn.setRenderTemplate("&nbsp;&nbsp;<span class = 'pres-eye-created-content'>${ REPORT_DATE_DISPLAY } &nbsp;&nbsp;" + outputContainerHTML);

	//Add the columns to the table
	presEyeTable.addColumn(presTypeColumn);
	presEyeTable.addColumn(authorColumn);
	presEyeTable.addColumn(DateColumn);

	// Bind the data to the results
	presEyeTable.bindData(results);
	this.setComponentTable(presEyeTable);

	// Finalize the component using the presEyeTable.render() method to create
	// the table html
	this.finalizeComponent(presEyeTable.render(), MP_Util.CreateTitleText(this,
			results));
	
	//Scroll bar within the component
	var numberResults = results.length;
	if (this.isScrollingEnabled() && this.getScrollNumber()) {
		var node = this.getSectionContentNode();

		//Approximate height of each row used by the framework to know when to add scrolling based on the bedrock configuration.
		var approximateRowHeight = '3.4';

		if (numberResults > this.getScrollNumber()) {
		  $('#' + this.getComponentTable().getNamespace() + 'tableBody').addClass('pres-eye-scrollable');
		  MP_Util.Doc.InitScrolling(Util.Style.g('pres-eye-scrollable', node, 'div'), this.getScrollNumber(), approximateRowHeight);
		}
    }
	//Update the component result count
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		"count" : results

	});

	$(".pres-eye-launch-form").click(function () {
		var attributeId = $(this).attr('data-dcpForms');
		self.modifyForm(attributeId);
	});

	$(".pres-eye-modify-img").click(function () {
		var attributeId = $(this).attr('data-dcpForms');
		self.modifyForm(attributeId);
	});

	$(".pres-eye-print-img").click(function () {
		var attributeId = $(this).attr('data-presPrintId');
		self.printPreview(attributeId);
	});
	$(".pres-eye-fax-img").click(function () {
		var attributeId = $(this).attr('data-presFaxId');
		self.faxClick(attributeId);
	});

	/* on mouseover showing the print/fax/modify icons */
	$(".result-info").on('mouseover', function () {
		var mHover = $(this);
		mHover.addClass("pres-eye-bgcolor");
		mHover.find("*").each(function () {
			var mShow = $(this);
			if (mShow.hasClass("pres-eye-create")) {
				mShow.find("#pres-eye-opt-hover-id").removeClass("pres-eye-mhover");
			}
		});
	});

	/* on mouseout hiding the print/fax/modify icons */
	$(".result-info").on('mouseout', function () {
		var mOut = $(this);
		mOut.removeClass("pres-eye-bgcolor");
		mOut.find("*").each(function () {
			var mHide = $(this);
			if (mHide.hasClass("pres-eye-create")) {
				mHide.find("#pres-eye-opt-hover-id").addClass("pres-eye-mhover");
			}
		});
	});

};
OphPrescriptionEyewearComponent.prototype.printPreview = function (parent_event_id) {
	var encounterId = this.getCriterion().encntr_id;
	var scriptName = "eyewear_print_pres_report";
	var parameterList = "'MINE'," + "'" + scriptName + "'," + encounterId + ".0," + parent_event_id + ".0";
	var printPrescriptionTimer = new CapabilityTimer("CAP:MPG.OphPresEyewear - Print Prescription", this.m_category_mean);
	if (printPrescriptionTimer) {
		printPrescriptionTimer.capture();
	}
	CCLLINK("eyewear_Prescription_wrapper", parameterList, 0);
};

/**
 * Creates JSON dynamically and returns the results to renderComponent
 * @param - event_id of the script
 */

OphPrescriptionEyewearComponent.prototype.modifyForm = function (event_id) {
	var personId = this.getCriterion().person_id;
	var encounterId = this.getCriterion().encntr_id;
	var formId = 0.0;
	var chartMode = 0;
	var mpObj = window.external.DiscernObjectFactory("POWERFORM");
	if (mpObj) {
		mpObj.OpenForm(personId, encounterId, formId, event_id, chartMode);
	}
};

OphPrescriptionEyewearComponent.prototype.faxClick = function (event_id) {
	var self = this;
	var faxEncounterId = this.getCriterion().encntr_id;
	self.transmitFax("eyewear_print_pres_report", faxEncounterId, self.m_presI18n.PRESCRIPTIONS_EYEWEAR_HEADER,
		self.m_presI18n.GLASSESRX);

};

/*
 * Gives the preview of the contents to be faxed. @param {string} - the
 * encounterID record data and event id @returns {string} - gives a preview of
 * the fax contents
 */
OphPrescriptionEyewearComponent.prototype.faxPreview = function (EncounterId, parentEventId) {

	var parameterList = "'MINE'," + "'eyewear_print_pres_report'," + EncounterId + ".0," + parentEventId + ".0";
	CCLLINK("eyewear_Prescription_wrapper", parameterList, 0);
};

/*
 * Gets the history of the charted results for the specified prescription.
 * @param {string} -the specified powerform name,start and end date,encounter
 * and person id @returns {string} - it gives all the charted results for the current day 
 */
OphPrescriptionEyewearComponent.prototype.getCurrentDayHistory = function(powerform_name,
		startDateTime, endDateTime, faxEncounterId, faxPersonId, prescriptionName){
	var self = this;
	var criterion = self.getCriterion();
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_oph_retrieve_results");
	scriptRequest.setParameterArray([ "'MINE'," + faxPersonId + ".0,"
			+ faxEncounterId + ".0,'" + powerform_name + "',0,0,'"
			+ startDateTime + "','" + endDateTime + "'" ])
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply) {
		recordData = scriptReply.getResponse();
		if (recordData.STATUS_DATA.STATUS === "F") {
			logger.logJSError(err, this, "prescription-eyewear.js","getCurrentDayHistory");
			$("." + compNS + "-faxSearchButton").prop("disabled", false);
		} else {
			self.processReceivedHistory(recordData, prescriptionName,
					faxEncounterId,powerform_name);
		}
	});
	scriptRequest.performRequest();
		}
/*
 * Gets the history of the charted results for the specified prescription.
 * @param {string} -the specified powerform name,start and end date,encounter
 * and person id @returns {string} - it gives all the charted results between
 * the specified dates
 */
OphPrescriptionEyewearComponent.prototype.getHistory = function (powerform_name,
	startdate, enddate, faxEncounterId, faxPersonId, prescriptionName) {
	var self = this;
	var criterion = self.getCriterion();
	var dateObj = new Date(startdate);
	var year = (dateObj.getFullYear()).toString();
	var month = (dateObj.getMonth() + 1).toString();
	if (month.length < 2) {
		month = "0" + month;
	}
	var dateString = (dateObj.getDate()).toString();
	if (dateString.length < 2) {
		dateString = "0" + dateString;
	}
	var hour = (dateObj.getHours()).toString();
	if (hour.length < 2) {
		hour = "0" + hour;
	}
	var minute = (dateObj.getMinutes()).toString();
	if (minute.length < 2) {
		minute = "0" + minute;
	}
	var second = (dateObj.getSeconds()).toString();
	if (second.length < 2) {
		second = "0" + second;
	}
	var startDateTime = year + month + dateString + "000000";
	var dateObj1 = new Date(enddate);
	var year1 = (dateObj1.getFullYear()).toString();
	var month1 = (dateObj1.getMonth() + 1).toString();
	if (month1.length < 2) {
		month1 = "0" + month1;
	}
	var dateString1 = (dateObj1.getDate()).toString();
	if (dateString1.length < 2) {
		dateString1 = "0" + dateString1;
	}
	var hour1 = (dateObj1.getHours()).toString();
	if (hour1.length < 2) {
		hour1 = "0" + hour1;
	}
	var minute1 = (dateObj1.getMinutes()).toString();
	if (minute1.length < 2) {
		minute1 = "0" + minute1;
	}
	var second1 = (dateObj1.getSeconds()).toString();
	if (second1.length < 2) {
		second1 = "0" + second1;
	}

	var endDateTime = year1 + month1 + dateString1 + "235959";
	var recordData;

	var searchFaxPrescriptionTimer = new RTMSTimer("ENG:MPG.OphPresEyewear - Fax Prescription Search", this.m_category_mean);
	if (searchFaxPrescriptionTimer) {
		searchFaxPrescriptionTimer.start();
	}

	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_oph_retrieve_results");
	scriptRequest.setParameterArray(["'MINE'," + faxPersonId + ".0,"
			 + faxEncounterId + ".0,'" + powerform_name + "',0,0,'"
			 + startDateTime + "','" + endDateTime + "'"]);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function (scriptReply) {
		if (searchFaxPrescriptionTimer) {
			searchFaxPrescriptionTimer.stop();
		}
		recordData = scriptReply.getResponse();
		if (recordData.STATUS_DATA.STATUS === "F") {
			logger.logJSError(err, this, "prescription-eyewear.js","getHistory");
			$("." + compNS + "-faxSearchButton").prop("disabled", false);
		} else {
			self.processReceivedHistory(recordData, prescriptionName,
				faxEncounterId);
		}
	});
	scriptRequest.performRequest();
};

/*
 * Calls the corresponding scripts to retrieve prescription history results
 * @param {string} - record data,prescription name,encounter id @returns
 * {string} - it gives all the charted results between the specified dates
 */
OphPrescriptionEyewearComponent.prototype.processReceivedHistory = function (
	recordData, prescriptionName, faxEncounterId) {
	var self = this;
	var compNS = self.getStyles().getNameSpace();
	var dispPrescriptionName = prescriptionName;
	
	for (var i = 0; i < recordData.LIST.length; i++) {
			for (var j = 0; j < recordData.LIST[i].RESULTS.length; j++) {
				if (recordData.LIST[i].RESULTS[j].DISPLAY_KEY === "FRAMEGLASSESTYPE") {
					dispPrescriptionName = prescriptionName + " (" + recordData.LIST[i].RESULTS[j].RESULT_VAL +")";
					break;
				}
			}
		var EventId = recordData.LIST[i].EVENT_ID;
		var parentEventId = recordData.LIST[i].PARENT_EVENT_ID;
		var charteddate = recordData.LIST[i].CHARTED_DATE;
		var chartedyear = charteddate.substring(0, 4);
		var chartedmonth = charteddate.substring(5, 7);
		var chartedday = charteddate.substring(8, 10);
		var chartedhours = charteddate.substring(11, 13);
		var chartedminutes = charteddate.substring(14, 16);
		var chartedDateObj = new Date(chartedyear, chartedmonth - 1, chartedday, chartedhours, chartedminutes);
		var dateString = chartedDateObj.format('mmm dd,yyyy');

		$("." + compNS + "-faxSearch-table tbody").append(
			"<tr class='" + compNS + "-faxtable-tr' id='tr-" + EventId
			 + "'>" + "<td class='" + compNS + "-faxtable-td'>"
			 + dispPrescriptionName + "</td>" + "<td class='" + compNS
			 + "-faxtable-td' id='pres_date'>" + dateString
			 + "</td>" + "<td class='" + compNS
			 + "-faxtable-td' id='pres_time'>"
			 + chartedDateObj.format('HH:MM') + "</td>"
			 + "<td  class='" + compNS + "-faxtable-td' >"
			 + "<img src='" + CERN_static_content
			 + "/images/5187.png' id='" + parentEventId + "' class='"
			 + compNS + "fax-preview' class = '" + compNS
			 + "-faximg-dimensions'/>" + "</td>" + "</tr>");
	}

	$("." + compNS + "fax-preview").click(function () {

		var attributeId = $(this).attr('id');
		self.faxPreview(faxEncounterId, attributeId);
	});

	$("." + compNS + "-faxSearchButton").prop("disabled", false);
	$("." + compNS + "-faxSearch-table tbody tr").click(
		function () {

		self.m_selParentEvtId = $(this).find("img").attr('id');

		$('.pres-eye-faxSearch-table tbody tr').removeClass('highlighted');
		$(this).addClass('highlighted');
		$("."+compNS+"-fax-table tbody tr")
		.each(
			function () {
			var content = $(this).find("a").text();
			if (content && content != self.m_presI18n.ADD) {
				$("#grpSendBtn" + self.getComponentId()).prop("disabled", false);
			} else {
				$("#grpSendBtn" + self.getComponentId()).prop("disabled", true);
			}
		});

	});
};

/*Highlight the search text in auto suggest drop down list.
 * @param {string} inString - provider name which is coming from back-end call.
 * @param {string} term - Entered search text in auto suggest control
 * @returns {string} - provider name with highlighted search text
 */
OphPrescriptionEyewearComponent.prototype.highlightValue = function (inString, term) {
	return "<strong >"
	 + inString
	.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("
			 + term.replace(
				/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,
				"\\$1").split(" ").join("|")
			 + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
		"</strong><strong class='oph-prescriptions-o1-highlight'>$1</strong><strong>")
	 + "</strong>";

};
/*
The send button function is implemented in this function
*@param{string}-faxmodaldialog,providerReqDialogName,script name,encounterid,prescription name
@returns(string)-returns success or error message in adding the fax to the rrd queue
*/
OphPrescriptionEyewearComponent.prototype.SuccessFaxDialog = function(UI, FaxModalDialog, providerReqDialogName,report_name,encounter_id,prescription_name) {
	
	var fax_data = [];
	var self = this;
	var compNS = self.getStyles().getNameSpace();			
	$("."+compNS+"-fax-table tbody tr").each(     
		function() {
			var obj_Structure = {};
			var faxNumber = $(this).find("a").text().replace(/\s/g, '');
			var providerName = $(this).find("td:nth-child(3)").text().replace(/\s/g, '');

			
			obj_Structure.fnumber = faxNumber;
			obj_Structure.fname = providerName;
			fax_data.push(obj_Structure);

		});
	var faxSearchTable = $("." + compNS + "-faxSearch-table")
	self.m_selParentEvtId = faxSearchTable.find("img").attr('id');
	//Close dialog as we not more access its elements
	FaxModalDialog.closeModalDialog(providerReqDialogName);
	FaxModalDialog.deleteModalDialogObject(providerReqDialogName);
			
	m_fax_status_flag = true;			
	var ackFax = "ackDialog"
	var ButtonName = "ackDialogButton";
	var ackDialogButton;
	var modalIdentity = "vspModalDialog" + ackFax
	var modal_a = MP_ModalDialog
			.retrieveModalDialogObject(modalIdentity)
	var confirmDialog = modal_a || new ModalDialog(ackFax);
	ackDialogButton = new ModalButton(ButtonName);
	confirmDialog.setLeftMarginPercentage(30);
	confirmDialog.setRightMarginPercentage(30);
	confirmDialog.setTopMarginPercentage(1);
	confirmDialog.setBottomMarginPercentage(50);
	if (!modal_a) {
		MP_ModalDialog.addModalDialogObject(confirmDialog);
	}
						
						MP_ModalDialog.showModalDialog(ackFax);
						confirmDialog.setHeaderTitle(self.m_presI18n.FAX_STATUS_WINDOW);
						var ackModalHTML = "<div class =' "
								+ compNS
								+ "-msg-ack'>"
								+ "<img src='"
								+ CERN_static_content
								+ "/images/5104.png'  class='"
								+ compNS
								+ "-img-dimensions'/>"
								+ "<span>&nbsp;&nbsp;"
								+ " "
								+ prescription_name
								+ " "
								+ self.m_presI18n.FAX_SENDING_MSG
								+ "</span></div>"
								+ "<div class='"
								+ compNS
								+ "-fax-btn-ctr'>"
								+ "<div class =' "
								+ compNS
								+ "-show-msg' id = 'showTableData"
								+ self.getComponentId()
								+ "' >"
								+ "<img src='"
								+ CERN_static_content
								+ "/images/5567.png' class='"
								+ compNS
								+ "-img-dimensions'/>"
								+ "<span>" + self.m_presI18n.SHOW_TAB + "</span>"
								+ "</div>"
								+ "<button id='"
								+ compNS
								+ "-OK-button' class='"
								+ compNS
								+ "-OKButton'>"
								+ self.m_presI18n.MODIFY_OK
								+ "</button>"
								+ "</div>"
								+ "<div class='"
								+ compNS
								+ "-ack-grid' id ='"
								+ compNS
								+ "-ackGrid' class='section'>"
								+ "<table class='"
								+ compNS
								+ "-ack-table' id='faxAcktable'>"
								+ "<thead>"
								+ "<tr >"
								+ "<th class='"
								+ compNS
								+ "-ack-table-th '>"
								+ self.m_presI18n.RECIPIENT
								+ "</th>"
								+ "<th class='"
								+ compNS
								+ "-ack-table-th' id = status_check >"
								+ self.m_presI18n.FAX_STATUS + "</th>" + "</tr>"
								+ "<tbody>" + "</tbody>" + "</thead>"
								+ "</table>" + "</div>";

						confirmDialog.setBodyHTML(ackModalHTML);
					
						$("#" + compNS + "-ackGrid").hide();
						var showDetails = function() {
							if ($("#showTableData"+ self.getComponentId()).hasClass("pres-eye-show-msg")) {
								$("#showTableData"+ self.getComponentId()).replaceWith(
												"<div class =' "
														+ compNS
														+ "-hide-msg' id = 'showTableData"
														+ self.getComponentId()
														+ "' ><img src='"
														+ CERN_static_content
														+ "/images/5570.png' class='"
														+ compNS
														+ "-img-dimensions'/><span>" + self.m_presI18n.HIDE_TAB + "</span></div>");
							} else {
								$("#showTableData"+ self.getComponentId()).replaceWith(
												"<div class ='"
														+ compNS
														+ "-show-msg' id = 'showTableData"
														+ self.getComponentId()
														+ "' ><img src='"
														+ CERN_static_content
														+ "/images/5567.png' class='"
														+ compNS
														+ "-img-dimensions' /><span>" +self.m_presI18n.SHOW_TAB + "</span></div>");
							}
							$("#showTableData"+ self.getComponentId()).off("click").on("click",showDetails);
							$("#" + compNS + "-ackGrid")
									.slideToggle();
							return false;
						};
						$("#showTableData"+ self.getComponentId()).off("click").on("click",showDetails);

				fax_data.forEach(function(obj_Structure) {
							$("." + compNS + "-ack-table tbody").append(
									"<tr class='" + compNS + "-ack-table-tr'>"
											+ "<td class='" + compNS
											+ "-ack-table-td'>" + obj_Structure.fname
											+ "</td>" + "<td class='" + compNS
											+ "-ack-table-td'>" + "<img src='"
											+ CERN_static_content
											+ "/images/6275.png' class='"
											+ compNS + "-img-dimensions'/>"
											+ "</td>" + "</tr>");

						});
						
						
		fax_data.forEach(function (obj_Structure) {
			var sendAr = ["^MINE^", "^" + report_name + "^", encounter_id + ".0", self.m_selParentEvtId + ".0", "^" + obj_Structure.fnumber + "^", "^" + obj_Structure.fname + "^"];

			var loadTimer = new RTMSTimer(self.getComponentLoadTimerName());
			var renderTimer = new RTMSTimer(self.getComponentRenderTimerName());
			try{
			var scriptRequest = new ComponentScriptRequest();
			scriptRequest.setProgramName("mp_oph_fax_eyewear_pres");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(self);
			scriptRequest.setLoadTimer(loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.setResponseHandler(callScript);
			scriptRequest.performRequest();
			}catch (err) {
		logger.logJSError(err, this, "prescription-eyewear.js",
			"SuccessFaxDialog");
	}
		});
	
						
		function callScript(scriptReply) {

			var replyData = scriptReply.getResponse();
			var removeQuote = JSON.stringify(replyData.RECEIPTNAME).replace(
					/^"(.*)"$/, '$1');
			var removeQuoteNo = JSON.stringify(replyData.FAX_NUM).replace(
					/^"(.*)"$/, '$1');
			var proName = removeQuote.replace(/\s/g, '');
			
			var foundIndex = -1;
			var compNS = self.getStyles().getNameSpace();
			
			for (var i = 0, len = fax_data.length; i < len; ++i) {
				if (fax_data[i].fname === proName
						&& fax_data[i].fnumber === removeQuoteNo) {
					foundIndex = i;
					break;
				}
			}
		if (foundIndex > -1) {
			
			$("." + compNS + "-ack-table tbody tr").each(
					function(index, tr) {
						
						if (foundIndex === index) {
							if (replyData.STATUS_DATA.STATUS === "S") {
								$(this).find("img").attr(
										"src",
										CERN_static_content
												+ "/images/4021.png");
							} else {
								m_fax_status_flag = false
							}
						}

					});

		}

		if (m_fax_status_flag === false) {
			$("." + compNS + "-msg-ack").html(
					"<img src='" + CERN_static_content
							+ "/images/6275.png' class='" + compNS
							+ "-img-dimensions'/>" + "&nbsp;&nbsp;"
							+ self.m_presI18n.FAX_FAILURE + " " + prescription_name
							+ " " + self.m_presI18n.RRD_QUEUE)
		} else {
			$("." + compNS + "-msg-ack").html("<img src='" + CERN_static_content
									+ "/images/4021.png' class='" + compNS
									+ "-img-dimensions'/>" + "&nbsp;&nbsp;"
									+ " " + prescription_name + " "
									+ self.m_presI18n.FAX_SUCCESS)
		}
	};


	$("#" + compNS + "-OK-button").click(function() {
		MP_ModalDialog.closeModalDialog(ackFax);
		MP_ModalDialog.deleteModalDialogObject(ackFax);

	});

};

/*
 * displays the main fax window where most of the fax functionalities occur
 * @param {string} script name to be executed,encounter id,powerform name and
 * prescription name @returns {Array} - Gives the UI for the main fax window
 * with all main functions in it
 */
OphPrescriptionEyewearComponent.prototype.transmitFax = function (scriptName,
	encounterId, powerform, prescriptionName) {
	var self = this;
	var faxPrescrptionTimer = new CapabilityTimer("CAP:MPG.OphPresEyewear - Fax Prescription", this.m_category_mean);
	if (faxPrescrptionTimer) {
		faxPrescrptionTimer.capture();
	}
	var compID = self.getComponentId();
	m_provider_id = self.getCriterion().provider_id;
	var providerReqDialogName = "providerReqDialog";
	var ButtonName = "soProviderRequestButton";
	var soProviderRequestButton;
	var modalId = "vwpModalDialog" + providerReqDialogName;
	var modal = MP_ModalDialog.retrieveModalDialogObject(modalId);
	var confirmDialog = modal || new ModalDialog(providerReqDialogName);
	soProviderRequestButton = new ModalButton(ButtonName);
	soProviderRequestButton.setText(this.m_presI18n.CANCEL_FAX);
	soProviderRequestButton.setOnClickFunction(function () {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);
	});
	//clicked on close button of the dialog
	confirmDialog.setHeaderCloseFunction(function() {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);	
	});
	var modalSendBtn = new ModalButton("grpSendBtn" + self.getComponentId());
	modalSendBtn.setText(this.m_presI18n.FAX_SEND);
	confirmDialog.addFooterButton(modalSendBtn);
	confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(), true);
	modalSendBtn.setOnClickFunction(function() {
		
		self.SuccessFaxDialog(this, MP_ModalDialog, providerReqDialogName,scriptName,encounterId,prescriptionName);
	});
	

	// Set properties for the deleted orders information modal dialog box.
	confirmDialog.setHeaderTitle(powerform);
	confirmDialog.setLeftMarginPercentage(30);
	confirmDialog.setRightMarginPercentage(30);
	confirmDialog.setTopMarginPercentage(1);
	confirmDialog.setBottomMarginPercentage(5);
	confirmDialog.addFooterButton(soProviderRequestButton);
	if (!modal) {
		MP_ModalDialog.addModalDialogObject(confirmDialog);
	}
	MP_ModalDialog.showModalDialog(providerReqDialogName);
	var compNS = self.getStyles().getNameSpace();
	var fwdSearchHTML = MP_Util.CreateAutoSuggestBoxHtml(self);
	var providerModalHTML = "<div id='providerSearchDlg' class='section'>"
		 + "<div class='fwd-edit-row'>" + "<div class='fwd-edit-col1'>"
		 + "<div class='"
		 + compNS
		 + "-main-container-fax' >"
		 + "<div class='"
		 + compNS
		 + "-fax-search-prescription'>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-search-title'>"
		 + "<span class='"
		 + compNS
		 + "-fax-search-title-span'>"
		 + this.m_presI18n.PRESCRIPTION_SEARCH
		 + "</span>"
		 + "</h3>"
		 + "<div class='"
		 + compNS
		 + "-fax-search-StartDate'>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-date-title'>"
		 + this.m_presI18n.STARTDATE
		 + "</h3>"
		 + "<dl>"
		 + "<dd class = 'oph-from-date' id='OphFaxDateControlFrom"
		 + compNS
		 + "'>"
		 + "</dd>"
		 + "</dl>"
		 + "</div>"
		 + "<div class='"
		 + compNS
		 + "-fax-search-EndDate'>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-date-title'>"
		 + this.m_presI18n.ENDDATE
		 + "</h3>"
		 + "<dl>"
		 + "<dd id='OphFaxDateControlTo"
		 + compNS
		 + "'>"
		 + "</dd>"
		 + "</dl>"
		 + "</div>"
		 + "<div class='"
		 + compNS
		 + "-fax-search-button'>"
		 + "<button id='"
		 + compNS
		 + "-fax-search-button' class='"
		 + compNS
		 + "-faxSearchButton' >"
		 + this.m_presI18n.SEARCH
		 + "</button>"
		 + "</div>"
		 +"<div class ='"
		 +compNS
		 +"-warning-message'>"
		 +"</div>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-sub-title'>"
		 + this.m_presI18n.PRESCRIPTIONS_HEADER
		 + "</h3>"
		 + "<div class='"
		 + compNS
		 + "-fax-grid'>"
		 + "<table class='"
		 + compNS
		 + "-faxSearch-table'>"
		 + "<thead>"
		 + "<tr>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='35%'>"
		 + this.m_presI18n.PRESCRIPTION_NAME
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='20%'>"
		 + this.m_presI18n.PRESCRIPTION_DATE
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='15%'>"
		 + this.m_presI18n.PRESCRIPTION_TIME
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='30%'>"
		 + this.m_presI18n.PRESCRIPTION_PREVIEW
		 + "</th>"
		 + "</tr>"
		 + "<tbody>"
		 + "</tbody>"
		 + "</thead>"
		 + "</table>"
		 + "</div>"
		 + "</div>"
		 + "<div class='"
		 + compNS
		 + "-fax-search-provider'>"
		 + "<h3  class='"
		 + compNS
		 + "-fax-search-title'>"
		 + "<span class='"
		 + compNS
		 + "-fax-add-recipient-span'>"
		 + this.m_presI18n.ADD_RECIPIENT
		 + "</span>"
		 + "</h3>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-add-recipient-span'>"
		 + this.m_presI18n.RECIPIENT
		 + "</h3>"
		 + "<div id='provider-search-fax' class='"
		 + compNS
		 + "-fax-autosearch'>"
		 + fwdSearchHTML
		 + "</div>"
		 + "<div class='"
		 + compNS
		 + "-faxAddButton'>"
		 + "<button id='"
		 + compNS
		 + "-fax-add-button' class='"
		 + compNS
		 + "-faxAddButton', disabled='disabled' >"
		 + this.m_presI18n.RECIPIENT_ADD_BUTTON
		 + "</button>"
		 + "</div>"
		 + "<h3 class='"
		 + compNS
		 + "-fax-sub-title'>"
		 + this.m_presI18n.RECIPIENT_DETAILS
		 + "</h3>"
		 + "<div class='"
		 + compNS
		 + "-fax-grid'>"
		 + "<table class='"
		 + compNS
		 + "-fax-table' id='faxprovidertable'>"
		 + "<thead>"
		 + "<tr >"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='10%'>"
		 + this.m_presI18n.RECIPIENT_TYPE
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='15%'>"
		 + this.m_presI18n.RECIPIENT_ENTITY
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-th' width='35%'>"
		 + this.m_presI18n.RECIPIENT_NAME
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-thnumber' width='30%'>"
		 + this.m_presI18n.FAX_NUMBER
		 + "</th>"
		 + "<th class='"
		 + compNS
		 + "-fax-table-thdelete' width='10%'>"
		 + this.m_presI18n.DELETE
		 + "</th>"
		 + "</tr>"
		 + "<tbody>"
		 + "</tbody>"
		 + "</thead>"
		 + "</table>"
		 + "</div>"
		 + "</div>" + "</div>" + "</div>" + "</div>"

		confirmDialog.setBodyHTML(providerModalHTML);
	var today = new Date();			
	var beginTime ="000000";
	var finishTime = "235959";
				var startDateTime = today.format("yyyymmdd") + beginTime;
				var endDateTime = today.format("yyyymmdd") + finishTime;
				var faxEncounterId = self.getCriterion().encntr_id;
				var faxPersonId = self.getCriterion().person_id;
					self.getCurrentDayHistory("FRAMELENSFORM", startDateTime,
							endDateTime, faxEncounterId, faxPersonId,
							prescriptionName);
				
	
	
	var fromDate = new DateSelector();
	var toDate = new DateSelector();
	var startdate;
	var enddate;
	var OphFaxDetailsDateContainerFrom = $("#OphFaxDateControlFrom" + compNS);
	fromDate.retrieveRequiredResources(function () {
		fromDate.setUniqueId("fromDateID");
		fromDate.setCriterion(self.getCriterion());
		fromDate.setFuzzyFlag(false);

		// Render the date control and append HTML to date container
		var dateControlHTML = fromDate.renderDateControl();
		OphFaxDetailsDateContainerFrom.append(dateControlHTML);
		// Finalized actions after all elements are shown
		fromDate.finalizeActions();
		
		startdate = new Date();
		startdate.setHours(0,0,0,0);
		var startdateStr = startdate.format(MP_Util.GetDateFormatter().lc.fulldate4yr);
		fromDate.datePickerControl.datepicker("setDate", startdateStr);
		
		CERN_EventListener.addListener(self, "selectedDateAvailable"
			 + fromDate.getUniqueId(), function () {
			startdate = fromDate.getSelectedDate();

		});
	});

	var OphFaxDetailsDateContainerTo = $("#OphFaxDateControlTo" + compNS);
	toDate.retrieveRequiredResources(function () {
		toDate.setUniqueId("toDateID");
		toDate.setCriterion(self.getCriterion());
		toDate.setFuzzyFlag(false);

		// Render the date control and append HTML to date container
		var dateControlHTML = toDate.renderDateControl();
		OphFaxDetailsDateContainerTo.append(dateControlHTML);

		// Finalized actions after all elements are shown
		toDate.finalizeActions();
		
		enddate = new Date();
		enddate.setHours(0,0,0,0);
		var endDateStr = enddate.format(MP_Util.GetDateFormatter().lc.fulldate4yr);
		toDate.datePickerControl.datepicker("setDate", endDateStr);
		
		CERN_EventListener.addListener(self, "selectedDateAvailable"
			 + toDate.getUniqueId(), function () {
			enddate = toDate.getSelectedDate();
		});
	});

	$("#" + compNS + "-fax-search-button").click(
		function () {
			$("." + compNS + "-faxSearch-table tbody tr").remove();
			$("." + compNS + "-faxSearchButton").prop("disabled", true);
		var faxEncounterId = self.getCriterion().encntr_id;
		var faxPersonId = self.getCriterion().person_id;
		if(startdate > enddate){
			$("." + compNS +"-warning-message").text(self.m_presI18n.WARNING_MESSAGE);	 
		}
		else{
			$("." + compNS +"-warning-message").text("");
		}
		self.getHistory("FRAMELENSFORM", startdate,
			enddate, faxEncounterId, faxPersonId,
			prescriptionName);

	});

	$("#pres-eyeContentCtrl" + compID)
	.keyup(
		function (event) {
		if ($("#pres-eyeContentCtrl" + compID).val() === self.m_presI18n.NO_RESULTS_FOUND) {
			$("#" + compNS + "-fax-add-button").prop(
				"disabled", true);
		} else {

			$("#" + compNS + "-fax-add-button").prop(
				"disabled", false);
		}

	});
	$("#pres-eyeContentCtrl" + compID).addClass("pres-eye-search-tab");


	$("#pres-eye-fax-add-button")
	.click(
		function () {

		var fax_PersonName = m_providerBox.value;
		var imagepath = "";
		var unique_id = "";
		var prvd_type = "";
		m_rowcount = $("." + compNS + "-faxSearch-table tbody tr.highlighted").length;
		if (m_isInternal) {
			imagepath = (m_Entity_type
				.localeCompare("ORGANIZATION") == 0) ? "/images/4714.png"
			 : "/images/4590.png"
			imagepath = CERN_static_content + imagepath;
			unique_id = m_fax_PersonId;
			prvd_type = self.m_presI18n.INTERNAL_PROVIDER;
		} else {
			imagepath = "";
			unique_id = fax_PersonName.replace(/[^a-zA-Z0-9]/g, '');
			prvd_type = self.m_presI18n.EXTERNAL_PROVIDER;
		}

		var fax_html = "";
		if (m_faxNumber == "") {
			
			fax_html = self.m_presI18n.ADD
		} else {
			fax_html = m_faxNumber;
		}

		$(".pres-eye-fax-table tbody").append(
			"<tr class='" + compNS + "-faxtable-tr'>"
			 + "<td class='" + compNS
			 + "-faxtable-td' id='" + unique_id
			 + "'>" + "<img src='" + imagepath
			 + "' class = '" + compNS
			 + "-faximg-dimensions'/>" + "</td>"
			 + "<td class='" + compNS
			 + "-faxtable-td'>" + prvd_type
			 + "</td>" + "<td class='" + compNS
			 + "-faxtable-td'>" + fax_PersonName
			 + "</td>" + "<td  class='" + compNS
			 + "-faxtable-td'>" + "<a id='" + compNS
			 + "-faxNumber-" + unique_id + "'>"
			 + fax_html + "</a>" + "</td>"
			 + "<td class='" + compNS
			 + "-faxtable-td'>" + "<img src='"
			 + CERN_static_content
			 + "/images/6457.png' class='" + compNS
			 + "-btn-delete " + compNS
			 + "-faximg-dimensions'/>" + "</td>"
			 + "</tr>");

		
		$("."+compNS+"-fax-table tbody tr")
		.each(
			function () {
			var content = $(this).find("a")
				.text();
			if (content && content != self.m_presI18n.ADD && m_rowcount > 0) {
				confirmDialog
				.setFooterButtonDither(
					"grpSendBtn"
					 + self
					.getComponentId(),
					false);
			} else {
				confirmDialog
				.setFooterButtonDither(
					"grpSendBtn"
					 + self
					.getComponentId(),
					true);
			}
		});

		$("." + compNS + "-btn-delete").bind("click",
			deleteFaxTableRow);

		$("#" + compNS + "-faxNumber-" + unique_id).bind(
			"click", editFaxNumber);
	$("#pres-eyeContentCtrl" + self.getComponentId()).val("");
	$("#" + compNS + "-fax-add-button").prop("disabled", true);
	});

	

	function editFaxNumber() {
		m_rowcount = $("." + compNS + "-faxSearch-table tbody tr.highlighted").length;
		var attributeId = $(this).attr('id');
		var popup = new MPageUI.Popup();
		var attributeValue = $("#" + attributeId).text();
		var addModify ="";
		if (attributeValue.localeCompare(self.m_presI18n.ADD) == 0) {
			attributeValue = "";
			addModify = self.m_presI18n.ADD_CAP;
		}else{
			addModify = self.m_presI18n.MODIFY;
		}
		popup.setAnchorId(attributeId);
		popup.setBodyContent("<div class='" + compNS
			 + "-faxpopup'>" + addModify + "&nbsp;"
			 + "<input type='text' class='" + compNS+ "-popup_text' id='"+compNS+"popup_text' value='" + attributeValue
			 + "'>" + "<p id='"+compNS+"errormessage' class='" + compNS
			 + "-fax_Popup_ErrorMessage'></p>" + "</div>");
		popup.setFooter("<div class='" + compNS + "-fax-popup-button'>"
			 + "<button id='"+compNS+"faxpopupOk' class='" + compNS + "-faxpopupOK'>"
			 + self.m_presI18n.MODIFY_OK + "</button>" + "<button id='"
			 + compNS + "exit_but' class='" + compNS + "-faxpopupOK'>"
			 + self.m_presI18n.MODIFY_CANCEL + "</button>" + "</div>");
		popup.show();
		$("#"+compNS+"faxpopupOk").prop("disabled", true);
		$("#" + compNS + "exit_but").click(function () {
			popup.destroy();
		});

		$("#"+compNS+"popup_text").keyup(function(event) {

					var fax_number1 = $("#"+compNS+"popup_text").val();
					
							if (isNaN(fax_number1)) {
								$("#"+compNS+"errormessage").html(
										self.m_presI18n.MSG_INVALID_FAX_NUMBER);
										$("#"+compNS+"faxpopupOk").prop("disabled", true);
							} else {
								if (fax_number1 == attributeValue) {
									$("#"+compNS+"faxpopupOk").prop("disabled", false);
									$("#"+compNS+"errormessage").html("");
								} else {
									$("#"+compNS+"faxpopupOk").prop("disabled", false);
									$("#"+compNS+"errormessage").html("");
								}
							}
								if(fax_number1 == ""){
								$("#"+compNS+"faxpopupOk").prop("disabled",true);
							}
							
					}

			);
		
		
		
			$("#"+compNS+"faxpopupOk").click(function() {
						var fax_number1 = $("#"+compNS+"popup_text").val();
				
							if((addModify == self.m_presI18n.ADD_CAP)||(fax_number1 == attributeValue)){
								popup.destroy();
								$("#" + attributeId).html(fax_number1);
							}else{
								if (fax_number1 == attributeValue) {
									popup.destroy();
									$("#" + attributeId).html(fax_number1);
								} else {
									popup.destroy();
									$("#" + attributeId)
											.html(
													fax_number1
															+ "&nbsp;&nbsp;<img src='"
															+ CERN_static_content
															+ "/images/6711.png' class='btnDelete' height='8' width='8'/>");
								}
							}
							
		
		
			$("."+compNS+"-fax-table tbody tr")
			.each(
				function () {
				var content = $(this).find("a").text();
				if (content && content != self.m_presI18n.ADD && m_rowcount > 0) {

					confirmDialog
					.setFooterButtonDither(
						"grpSendBtn"
						 + self
						.getComponentId(),
						false);
				} else {

					confirmDialog
					.setFooterButtonDither(
						"grpSendBtn"
						 + self
						.getComponentId(),
						true);
				}
			})

		});

	};

	function deleteFaxTableRow() {
		$(this).closest('tr').remove();
		var content = $(this).find("a").html();

		$('#faxprovidertable tr').each(
			function () {
			if (content && content != self.m_presI18n.ADD && m_rowcount > 0) {
				confirmDialog.setFooterButtonDither("grpSendBtn"
					 + self.getComponentId(), false);
			} else {
				confirmDialog.setFooterButtonDither("grpSendBtn"
					 + self.getComponentId(), true);
			}
		});
	};

	MP_Util.AddAutoSuggestControl(self, self.searchProviders,
		self.handleSelection, self.createSuggestionLine);

	$("#vwpModalDialogproviderReqDialog dyn-modal-hdr-close").on("click",closeWindow);
	var closeWindow = function() {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);
	};
};

/*
 * Highlight the search text in auto suggest drop down list. @param {object}
 * suggestionObj - the object containing the providers information @param
 * {string} searchVal - Entered search text in auto suggest control @returns
 * {Array} - provider names with highlighted search text
 */
OphPrescriptionEyewearComponent.prototype.createSuggestionLine = function (
	suggestionObj, searchVal) {

	return this.component.highlightValue(suggestionObj.NAME_FULL_FORMATTED,
		searchVal);
};

/*
 * Search the providers and create auto suggestion drop down menu based on the
 * input characters entered by the user. @param {function} callback - Callback
 * is given component as a scope @param {DOM Element} textBox - Text box DOM
 * information @param {MPageComponent} component - component object for which
 * the script is being called. @returns {null}
 */
OphPrescriptionEyewearComponent.prototype.searchProviders = function (callback,
	textBox, component) {
	var searchText = textBox.value;
	var self = this;
	var component = this;
	m_isInternal = false;
	m_faxNumber = "";
	m_providerBox = textBox;
	if (searchText.length < 3) {
		return;
	}

	var searchProviderTimer = new RTMSTimer("ENG:MPG.OphPresEyewear - Fax Provider Search", this.m_category_mean);
	if (searchProviderTimer) {
		searchProviderTimer.start();
	}

	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_oph_fax_prvdr_search_wrap");
	scriptRequest.setParameterArray(["^MINE^",
			"^" + searchText + "^," + m_provider_id]);
	scriptRequest.setAsyncIndicator(true);

	scriptRequest.setResponseHandler(function (scriptReply) {
		if (searchProviderTimer) {
			searchProviderTimer.stop();
		}
		var recordData = scriptReply.getResponse();
		if (recordData.STATUS_DATA.STATUS === "Z") {
			recordData.PRSNL = [];
			recordData.PRSNL.push({
				'NAME_FULL_FORMATTED' : self.m_presI18n.MSG_NO_RESULTS_FOUND
			});
		} else if (recordData.STATUS_DATA.STATUS === "F") {
			recordData.PRSNL = [];
			recordData.PRSNL.push({
				'NAME_FULL_FORMATTED' : self.m_presI18n.MSG_NO_RESULTS_FOUND
			});
		}
		callback.autosuggest(recordData.PRSNL);

	});
	scriptRequest.performRequest();

};

/*
 * Store the selected provider name & provider id and display the selected
 * provider name in the side panel. @param {object} suggestionObj - the object
 * containing the providers information @param {DOM Element} textBox - Text box
 * DOM information @param {MPageComponent} component - component object for
 * which the script is being called. @returns {null}
 *
 */
OphPrescriptionEyewearComponent.prototype.handleSelection = function (suggestionObj,
	textBox, component) {
	if (!suggestionObj) {
		return;
	}
	textBox.value = suggestionObj.NAME_FULL_FORMATTED;
	m_isInternal = true;
	var providerId = suggestionObj.PERSON_ID;
	m_faxNumber = "";
	if (suggestionObj.PHONE[0] == null) {
		m_faxNumber = "";
	} else {
		for (var i = 0; i < suggestionObj.PHONE.length; i++) {
			if (suggestionObj.PHONE[i].PHONE_TYPE_CD == 166) {
				m_faxNumber = suggestionObj.PHONE[i].PHONE_NUM;
				break;
			} else {
				m_faxNumber = "";
			}
		}
	}
	m_Entity_type = suggestionObj.ENTITY_TYPE;
	m_fax_PersonId = suggestionObj.PERSON_ID;
	if (textBox.value && providerId) {
		$("#" + this.component.getComponentId() + "providerName").html(
			textBox.value);

	}
};

OphPrescriptionEyewearComponent.prototype.processResultsForRender = function (results) {

	var resultLength = results.length;
	for (resultLength; resultLength--; ) {
		var presEyeResult = results[resultLength];
		presEyeResult.REPORT_DATE_DISPLAY = this.getDateObject(results[resultLength]);
		presEyeResult.PRES_AUTHOR_NAME = results[resultLength].PROVIDER_NAME;
		presEyeResult.PRES_GLASS_TYPE = this.processResultsForGlassType(results[resultLength], "FRAMEGLASSESTYPE");
		presEyeResult.PRES_FRAME_CORR = this.processResultsForGlassType(results[resultLength], "FRAMECORRECTIONFOR");
		presEyeResult.PRES_EYE_EVENT_ID = results[resultLength].EVENT_ID;
		presEyeResult.PRES_PARENT_EVENT_ID = results[resultLength].PARENT_EVENT_ID;

		// retreive dcp forms_activity_id to open existing form

		presEyeResult.DCP_FORMS_ACTIVITY_ID = results[resultLength].DCP_FORMS_ACTIVITY_ID;
		presEyeResult.RESULT_STATUS_CD = this.getModifiedStatus(results[resultLength]);
		if (presEyeResult.RESULT_STATUS_CD === "MODIFIED" || presEyeResult.RESULT_STATUS_CD === "ALTERED") {
			presEyeResult.MODIFY_ICON = "pres-eye-res-modified";
		} else {
			presEyeResult.MODIFY_ICON = "pres-eye-res-no-modify";
		}

	}

};

/**
 * Retrieves the glass type and returns to processResultsForRender( ) method for
 * rendering
 * @param1 -  Response of the script as JSON
 * @param2 - display key
 * @return - resultValue returns the glass type
 */
OphPrescriptionEyewearComponent.prototype.processResultsForGlassType = function (results, dispKey) {
	for (var j = 0; j < results.RESULTS.length; j++) {
		if (results.RESULTS[j].DISPLAY_KEY === dispKey) {
			var resultValue = results.RESULTS[j].RESULT_VAL;
			return resultValue;
		}
	}
};

/**
 * Retrieves the glass type and returns to processResultsForRender( ) method for
 * rendering
 * @param -  Response of the script as JSON
 * @return - resultValue returns the glass type
 */
OphPrescriptionEyewearComponent.prototype.getModifiedStatus = function (results) {
	var res = results.RESULTS;
	for (var j = 0; j < res.length; j++) {
		if (res[j].RESULT_STATUS_CD == "MODIFIED" || res[j].RESULT_STATUS_CD == "ALTERED") {
			return (res[j].RESULT_STATUS_CD);
		}
	}
	return "";
};

/**
 * Receives the date as string, converts to date object and returns back to the processResultsForRender( )
 * @param - Response of the script as JSON
 * @return - dateString
 */
OphPrescriptionEyewearComponent.prototype.getDateObject = function (results) {
	var chartedDate = results.CHARTED_DATE;
	var chartedYear = chartedDate.substring(0, 4);
	var chartedMonth = chartedDate.substring(5, 7);
	var chartedDay = chartedDate.substring(8, 10);
	var chartedHours = chartedDate.substring(11, 13);
	var chartedMinutes = chartedDate.substring(14, 16);
	var chartedDateObj = new Date(chartedYear, chartedMonth - 1, chartedDay, chartedHours, chartedMinutes);
	var dateString = this.df.format(chartedDateObj, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
	return dateString;
};

MP_Util.setObjectDefinitionMapping("OPH_PRES_EYEWEAR", OphPrescriptionEyewearComponent);
