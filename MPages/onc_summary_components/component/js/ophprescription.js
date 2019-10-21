/**
 * The ophthalmology prescription component style
 * 
 * @class
 */
function OphPrescriptionComponentStyle() {
	this.initByNamespace("oph-prescribe");
}
OphPrescriptionComponentStyle.inherits(ComponentStyle);

/**
 * The Ophthalmology Prescription component
 * 
 * @param criterion
 *            The criterion containing the requested information
 * @class
 */
function OphPrescriptionComponent(criterion) {
	this.setCriterion(criterion);
	this.df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	this.setLookBackDropDown(true);
	this.setStyles(new OphPrescriptionComponentStyle());
	this.setIncludeLineNumber(false);
	this.m_iViewAdd = false;
	this.setComponentLoadTimerName("USR:MPG.OphPrescription.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.OphPrescription.O1 - render component");
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";
	this.ophpI18n = i18n.discernabu.oph_prescription_o1;
	this.ar = [];
	this.softContactResultInd = 0;
	this.softContactEventId = 0;
	this.softContactParams = [];
	this.gasContactResultInd = 0;
	this.gasContactEventId = 0;
	this.gasContactParams = [];
	this.compId = 0;
	this.comId = this.getComponentId();
	this.m_category_mean=this.getCriterion().category_mean;
	this.m_rowcount = "";
	this.m_fax_status_flag = true;
	this.m_isInternal = false;
	this.m_providerBox = {};
	this.m_faxNumber = "";
	this.m_provider_id = "";
	this.m_fax_PersonId = "";
	this.m_Entity_type = "";
	this.glassJson = {
		glass_type : []
	};
}
OphPrescriptionComponent.prototype = new MPageComponent();
OphPrescriptionComponent.prototype.constructor = MPageComponent;

/**
 * Sets MPageComponent variable 'm_iViewAdd'
 * 
 * @param value
 *            The value to which variable has to be set
 */
OphPrescriptionComponent.prototype.setIViewAdd = function(value) {
	this.m_iViewAdd = value;
};
/**
 * Returns MPageComponent variable 'm_iViewAdd'
 */
OphPrescriptionComponent.prototype.isIViewAdd = function() {
	return this.m_iViewAdd;
};
/**
 * Opens Powerform of Prescription component
 * 
 * @param formID
 *            Identifier value of current form
 */
OphPrescriptionComponent.prototype.openDropDown = function(formID) {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|"	+ formID + "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "ophprescription.js", "openDropDown");
	MPAGES_EVENT("POWERFORM", paramString);
};
/**
 * Opens Powerform of Prescription component
 */
OphPrescriptionComponent.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0	+ "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString,"ophprescription.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
};
/**
 * Opens IView of Prescription component
 */
OphPrescriptionComponent.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + ".0,"
			+ criterion.encntr_id + ".0";
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "ophprescription.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.bandName, this.sectionName,	this.itemName, criterion.person_id + ".0", criterion.encntr_id + ".0");
	} 
	catch (err) {
		MP_Util.LogJSError(err, null, "ophprescription.js", "openIView");
	}
};
/**
 * Loads bedrock filters
 */
OphPrescriptionComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("OPH_SCRIPTS_IND", {
		setFunction : this.setIViewAdd,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};
/**
 * Retrieve Glasses section data.
 * 
 * @param component
 *            The Component being rendered
 */
OphPrescriptionComponent.prototype.retrieveComponentData = function() {
	var groups = this.getGroups();
	this.compId = this.getComponentId();
	if (groups && groups.length > 0) {
		var sendAr = [];
		var self = this;
		var criterion = self.getCriterion();
		var reportId = self.getReportId();
		// check prsnl encounter security
		var encntrOption = (self.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
		var prsnlInfo = criterion.getPersonnelInfo();
		for (var x = 0, xl = groups.length; x < xl; x++) {
			var group = groups[x];
			var sEventSets = "0.0", sEventCodes = "0.0";
			var sBeginDate = "^^";
			var sEndDate = "^^";
			var sEncntr = encntrOption;
			if (group.getGroupName() === "GLASSES") {
				if (group instanceof MPageEventCodeGroup) {
					sEventCodes = MP_Util.CreateParamArray(group.getEventCodes(), 1);
				} else {
					continue;
				}
				sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr,
						criterion.provider_id + ".0", criterion.ppr_cd + ".0",
						1, "^^", sEventSets, sEventCodes, self.getLookbackUnits(), self.getLookbackUnitTypeFlag(), 1, sBeginDate,
						sEndDate, reportId + ".0");
				break;
			}
		}
		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("INN_MP_GET_OPH_GLASS_RESULTS");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(this);
		scriptRequest.setResponseHandler(function(scriptReply) {
			self.renderComponentGlass(scriptReply);
		});
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.performRequest();

	}
};
/**
 * Retrieve contact lens data.
 * 
 * @param component
 *            The Component being rendered
 */
OphPrescriptionComponent.prototype.getContactTable = function() {

	var groups = this.getGroups();
	if (groups && groups.length > 0) {
		var self = this;
		var sendAr = [];
		var criterion = this.getCriterion();
		var encntrOption = (this.getScope() == 2) ? (criterion.encntr_id + ".0"): "0.0";

		var prsnlInfo = criterion.getPersonnelInfo();
		var sEventCodesArr = [];
		var sEventSets = "0.0";
		var sEventCodes = "0.0";
		var sBeginDate = "^^";
		var sEndDate = "^^";
		var sEncntr = encntrOption;

		for (var x = 0, xl = groups.length; x < xl; x++) {
			var group = groups[x];
			var groupName = group.getGroupName();
			if (groupName.substring(0, 5) === "SOFT_"
					|| groupName.substring(0, 4) === "GAS_") {
				if (group instanceof MPageEventCodeGroup) {
					sEventCodesArr.push(group.getEventCodes());
				}

				else {
					continue;
				}
			}
		}
		sEventCodes = MP_Util.CreateParamArray(sEventCodesArr, 1);

		sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr,
				criterion.provider_id + ".0", criterion.ppr_cd + ".0", 1, "^^",
				sEventSets, sEventCodes, this.getLookbackUnits(), this
						.getLookbackUnitTypeFlag(), 1, sBeginDate, sEndDate, 0);
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("inn_mp_retrieve_oph_results");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(this);
		scriptRequest.setResponseHandler(function(scriptReply) {
			self.renderComponentContact(scriptReply);
		});
		scriptRequest.performRequest();

	}
};

/**
 * Renders the retrieved data for the component into HTML markup to display
 * within the document
 * 
 * @param reply
 *            The retrieved JSON array to parser to generate the HTML markup
 */

OphPrescriptionComponent.prototype.renderComponentGlass = function(reply) {
	var replyData = reply.getResponse();
	try {
		if (replyData !== null && replyData.STATUS_DATA.STATUS === "S") {
			this.ar.push(this.buildGlassHTML(replyData));

		}
		this.getContactTable();
	} catch (err) {
		MP_Util.LogJSError(err, null, "ophprescription.js", "renderComponent");
	} finally {
		this.setEditMode(false);
	}
};

/**
 * Renders the retrieved data for the soft contacts and gas permeable into HTML
 * markup to display within the document
 * 
 * @param component
 *            The component being rendered
 * @param replyAr
 *            The retrieved JSON array to parser to generate the HTML markup
 */
OphPrescriptionComponent.prototype.renderComponentContact = function(replyAr) {
	var replyData = replyAr.getResponse();
	var m_comp = this;
	try {
		if (replyData !== null && replyData.STATUS_DATA.STATUS === "S") {
			var softContactHTML = this.buildSoftContactHTML(replyData);

			var gasContactHTML = this.buildGasContactHTML(replyData);

			var eventsArray = replyData.EVENTS;
			if (this.softContactResultInd === 1) {
				this.softContactParams = this.retrieveFormParams(eventsArray,
						this.softContactEventId);
				this.ar.push(softContactHTML);
			}
			if (this.gasContactResultInd === 1) {
				this.gasContactParams = this.retrieveFormParams(eventsArray,
						this.gasContactEventId);
				this.ar.push(gasContactHTML);
			}
			this.ar.push("</div>");
		}
		var countText = "";
		if (this.ar.join("").length > 0) {
			var content = [];
			content.push("<div class ='", MP_Util.GetContentClass(m_comp,m_comp.ophpLen), "'>", m_comp.ar.join(""), "</div>");
			var sHTML = content.join("");
			this.finalizeComponent(sHTML, countText);
		}

		else {

			this.finalizeComponent(MP_Util.HandleNoDataResponse(m_comp
					.getStyles().getNameSpace()), countText);
		}

		this.attachListners();
	}

	catch (err) {
		MP_Util.LogJSError(err, null, "ophprescription.js",
				"renderComponentContact");
		throw (err);
	} finally {
		m_comp.setEditMode(false);
	}

};

/**
 * Opens Powerform of Glasses with the latest values for current encounter
 * 
 * @param params
 */
OphPrescriptionComponent.prototype.openExistingFormGlass = function(params) {
	var paramList = params.split(",");
	var dPersonId = paramList[0];
	var dEncounterId = paramList[1];
	var formId = 0.0;
	var activityId = paramList[2];
	var chartMode = 0;
	var mpObj = window.external.DiscernObjectFactory("POWERFORM");
	mpObj.OpenForm(dPersonId, dEncounterId, formId, activityId, chartMode);
};

/**
 * Opens Powerform of Soft contacts/Gas Permeable with the latest values for
 * current encounter
 * 
 * @param params
 */
OphPrescriptionComponent.prototype.openExistingFormContact = function(params) {
	var paramList = [];
	if (params === "soft") {
		paramList = this.softContactParams;
	} else if (params === "gas") {
		paramList = this.gasContactParams;
	}
	var dPersonId = paramList[0];
	var dEncounterId = paramList[1];
	var formId = 0.0;
	var activityId = paramList[2];
	var chartMode = 0;
	var mpObj = window.external.DiscernObjectFactory("POWERFORM");
	mpObj.OpenForm(dPersonId, dEncounterId, formId, activityId, chartMode);
};

/*
The send button function is implemented in this function
*@param{string}-faxmodaldialog,providerReqDialogName,script name,encounterid,prescription name
@returns(string)-returns success or error message in adding the fax to the rrd queue
*/
OphPrescriptionComponent.prototype.SuccessFaxDialog = function(UI, FaxModalDialog, providerReqDialogName,report_name,encounter_id,prescription_name) {
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
	var pres_date = faxSearchTable.find("td#pres_date").html();
	var pres_time = faxSearchTable.find("td#pres_time").html();
	var  sMonth = new Date(pres_date.substr(0,3)+'-1-01').getMonth(); //convert month from string to number
	var  sDay   = pres_date.substr(4,2)
	var  sYear  = pres_date.substr(7,4);
	var  sHour  = pres_time.substr(0,2)
	var  sMin   = pres_time.substr(3,4)
	
	var dateTimeObjPlusMin  = new Date(sYear, sMonth, sDay, sHour, sMin, '0', '0');
	var dateTimeObjMinusMin = new Date(sYear, sMonth, sDay, sHour, sMin, '0', '0');
					
	dateTimeObjPlusMin.setMinutes(dateTimeObjPlusMin.getMinutes()+1); // Add 1 min to form TO date time
	dateTimeObjMinusMin.setMinutes(dateTimeObjMinusMin.getMinutes()-1); // Reduce 1 min to form FROM date time
	
	//Close dialog as we not more access its elements
	FaxModalDialog.closeModalDialog(providerReqDialogName);
	FaxModalDialog.deleteModalDialogObject(providerReqDialogName);
			
	m_fax_status_flag = true;			
	var ackFax = "ackDialog"
	var ButtonName = "ackDialogButton";
	var ackDialogButton;
	var modalIdentity = "vspModalDialog" + ackFax;
	var modal_a = MP_ModalDialog.retrieveModalDialogObject(modalIdentity);
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
						confirmDialog.setHeaderTitle(self.ophpI18n.FAX_STATUS_WINDOW);
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
								+ self.ophpI18n.FAX_SENDING_MSG
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
								+ "<span>" + self.ophpI18n.SHOW_TAB + "</span>"
								+ "</div>"
								+ "<button id='"
								+ compNS
								+ "-OK-button' class='"
								+ compNS
								+ "-OKButton'>"
								+ self.ophpI18n.MODIFY_OK
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
								+ self.ophpI18n.RECIPIENT
								+ "</th>"
								+ "<th class='"
								+ compNS
								+ "-ack-table-th' id = status_check >"
								+ self.ophpI18n.FAX_STATUS + "</th>" + "</tr>"
								+ "<tbody>" + "</tbody>" + "</thead>"
								+ "</table>" + "</div>";

						confirmDialog.setBodyHTML(ackModalHTML);
					
						$("#" + compNS + "-ackGrid").hide();
						var showDetails = function() {
							if ($("#showTableData"+ self.getComponentId()).hasClass("oph-prescribe-show-msg")) {
								$("#showTableData"+ self.getComponentId()).replaceWith(
												"<div class =' "
														+ compNS
														+ "-hide-msg' id = 'showTableData"
														+ self.getComponentId()
														+ "' ><img src='"
														+ CERN_static_content
														+ "/images/5570.png' class='"
														+ compNS
														+ "-img-dimensions'/><span>" + self.ophpI18n.HIDE_TAB + "</span></div>");
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
														+ "-img-dimensions' /><span>" + self.ophpI18n.SHOW_TAB + "</span></div>");
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
						
						
	fax_data.forEach(function(obj_Structure) {
		var sendAr = [ "^MINE^", "^" + report_name + "^", encounter_id + ".0",
				"^" + dateTimeObjMinusMin.format('yyyymmddHHMM')+'00' + "^",
				"^" + dateTimeObjPlusMin.format('yyyymmddHHMM')+ '00' + "^",
				"^" + obj_Structure.fnumber + "^","^" + obj_Structure.fname + "^" ];
	
		var loadTimer = new RTMSTimer(self.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(self.getComponentRenderTimerName());
		try{
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("mp_oph_fax_prescription");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(self);
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.setResponseHandler(callScript);
		scriptRequest.performRequest();
		}catch (err) {
		logger.logJSError(err, this, "ophprescription.js",
			"SuccessFaxDialog");
	}
	});
	
						
		function callScript(scriptReply) {

			var replyData = scriptReply.getResponse();
			var removeQuote = JSON.stringify(replyData.RECEIPTNAME).replace(/^"(.*)"$/, '$1');
			var removeQuoteNo = JSON.stringify(replyData.FAX_NUM).replace(/^"(.*)"$/, '$1');
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
							+ self.ophpI18n.FAX_FAILURE + " " + prescription_name
							+ " " + self.ophpI18n.RRD_QUEUE)
		} else {
			$("." + compNS + "-msg-ack")
					.html(
							"<img src='" + CERN_static_content
									+ "/images/4021.png' class='" + compNS
									+ "-img-dimensions'/>" + "&nbsp;&nbsp;"
									+ " " + prescription_name + " "
									+ self.ophpI18n.FAX_SUCCESS)
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
OphPrescriptionComponent.prototype.transmitFax = function(reportName,
		encounterId, powerform, prescriptionName) {
	var self = this;
	var faxPrescrptionTimer = new CapabilityTimer("CAP:MPG.OphPrescription - Fax Prescription", this.m_category_mean); 
	if(faxPrescrptionTimer)
	{
		faxPrescrptionTimer.capture();
	}


	var compID = self.getComponentId();
	m_provider_id = self.getCriterion().provider_id;
	var providerReqDialogName = "providerReqDialog"
	var ButtonName = "soProviderRequestButton";
	var soProviderRequestButton;
	var modalId = "vwpModalDialog" + providerReqDialogName;
	var modal = MP_ModalDialog.retrieveModalDialogObject(modalId);
	var confirmDialog = modal || new ModalDialog(providerReqDialogName);
	soProviderRequestButton = new ModalButton(ButtonName);
	soProviderRequestButton.setText(this.ophpI18n.CANCEL_FAX);
	soProviderRequestButton.setOnClickFunction(function() {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);
	});
	//clicked on close button of the dialog
	confirmDialog.setHeaderCloseFunction(function() {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);	
	});
	var modalSendBtn = new ModalButton("grpSendBtn" + self.getComponentId());
	modalSendBtn.setText(this.ophpI18n.FAX_SEND);
	confirmDialog.addFooterButton(modalSendBtn);
	confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(),true);
	modalSendBtn.setOnClickFunction(function() {
		self.SuccessFaxDialog(this, MP_ModalDialog, providerReqDialogName,reportName,encounterId,prescriptionName);
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
			+ this.ophpI18n.PRESCRIPTION_SEARCH
			+ "</span>"
			+ "</h3>"
			+ "<div class='"
			+ compNS
			+ "-fax-search-StartDate'>"
			+ "<h3 class='"
			+ compNS
			+ "-fax-date-title'>"
			+ this.ophpI18n.STARTDATE
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
			+ this.ophpI18n.ENDDATE
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
			+ this.ophpI18n.SEARCH
			+ "</button>"
			+ "</div>"
			+"<div class ='"
			+compNS
			+"-warning-message'>"
			+"</div>"
			+ "<h3 class='"
			+ compNS
			+ "-fax-sub-title'>"
			+ this.ophpI18n.PRESCRIPTIONS_HEADER
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
			+ "-fax-table-th' width='40%'>"
			+ this.ophpI18n.PRESCRIPTION_NAME
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-th' width='20%'>"
			+ this.ophpI18n.PRESCRIPTION_DATE
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-th' width='15%'>"
			+ this.ophpI18n.PRESCRIPTION_TIME
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-th' width='30%'>"
			+ this.ophpI18n.PRESCRIPTION_PREVIEW
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
			+ this.ophpI18n.ADD_RECIPIENT
			+ "</span>"
			+ "</h3>"
			+ "<h3 class='"
			+ compNS
			+ "-fax-add-recipient-span'>"
			+ this.ophpI18n.RECIPIENT
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
			+ this.ophpI18n.RECIPIENT_ADD_BUTTON
			+ "</button>"
			+ "</div>"
			+ "<h3 class='"
			+ compNS
			+ "-fax-sub-title'>"
			+ this.ophpI18n.RECIPIENT_DETAILS
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
			+ this.ophpI18n.RECIPIENT_TYPE
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-th' width='15%'>"
			+ this.ophpI18n.RECIPIENT_ENTITY
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-th' width='30%'>"
			+ this.ophpI18n.RECIPIENT_NAME
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-thnumber' width='30%'>"
			+ this.ophpI18n.FAX_NUMBER
			+ "</th>"
			+ "<th class='"
			+ compNS
			+ "-fax-table-thdelete' width='10%'>"
			+ this.ophpI18n.DELETE
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
				if(reportName ==="oph_softcontacts_print_report"){
					self.getCurrentDayHistory("OPTICALRXSOFTCONTACTSFORM", startDateTime,
							endDateTime, faxEncounterId, faxPersonId,
							prescriptionName);
				}
				if(reportName ==="oph_gp_print_report"){
					
					self.getCurrentDayHistory("OPTICALRXGASPERMEABLECONTACTSFORM",
							startDateTime, endDateTime, faxEncounterId, faxPersonId,
							prescriptionName);
				}
				if(reportName ==="oph_glasses_print_report"){
					self.getCurrentDayHistory("OPTICALRXGLASSESFORM", startDateTime, endDateTime,
							faxEncounterId, faxPersonId, prescriptionName);
				}
	
	
	
	
	var fromDate = new DateSelector();
	var toDate = new DateSelector();
	var startdate;
	var enddate;
	var OphFaxDetailsDateContainerFrom = $("#OphFaxDateControlFrom" + compNS);
	fromDate.retrieveRequiredResources(function() {
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
				+ fromDate.getUniqueId(), function() {
			startdate = fromDate.getSelectedDate();

		});
	});

	var OphFaxDetailsDateContainerTo = $("#OphFaxDateControlTo" + compNS);
	toDate.retrieveRequiredResources(function() {
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
				+ toDate.getUniqueId(), function() {
			enddate = toDate.getSelectedDate();
		});
	});

	$("#" + compNS + "-fax-search-button").click(
			function() {
				$("." + compNS + "-faxSearch-table tbody tr").remove();
				$("." + compNS + "-faxSearchButton").prop("disabled", true);
				var faxEncounterId = self.getCriterion().encntr_id;
				var faxPersonId = self.getCriterion().person_id;
				if(startdate > enddate){
					$("." + compNS +"-warning-message").text(self.ophpI18n.WARNING_MESSAGE);	 
				}
				else{
					$("." + compNS +"-warning-message").text("");
				}
				if(reportName ==="oph_softcontacts_print_report"){
					self.getHistory("OPTICALRXSOFTCONTACTSFORM", startdate,
							enddate, faxEncounterId, faxPersonId,
							prescriptionName);
				}
				if(reportName ==="oph_gp_print_report"){
					self.getHistory("OPTICALRXGASPERMEABLECONTACTSFORM",
							startdate, enddate, faxEncounterId, faxPersonId,
							prescriptionName);
				}
				if(reportName ==="oph_glasses_print_report"){
					self.getHistory("OPTICALRXGLASSESFORM", startdate, enddate,
							faxEncounterId, faxPersonId, prescriptionName);
				}
				$("." + compNS + "-faxSearch-table tbody").empty();
			});

	$("#oph-prescribeContentCtrl" + this.getComponentId())
			.keyup(
					function(event) {

						if ($("#oph-prescribeContentCtrl" + this.comId).val() === self.ophpI18n.NO_RESULTS_FOUND) {
							$("#" + compNS + "-fax-add-button").prop(
									"disabled", true);
						} else {

							$("#" + compNS + "-fax-add-button").prop(
									"disabled", false);
						}

					}

			);
			
			$("#oph-prescribeContentCtrl"+self.getComponentId()).addClass("oph-prescribe-search-tab");
	
	$("#oph-prescribe-fax-add-button")
			.click(
					function() {

						var fax_PersonName = m_providerBox.value;
						var imagepath = "";
						var unique_id = "";
						var prvd_type = "";
						m_rowcount = $("." + compNS + "-faxSearch-table tbody tr.highlighted").length;

						if (m_isInternal) {
							imagepath = (m_Entity_type.localeCompare("ORGANIZATION") == 0) ? "/images/4714.png"
									: "/images/4590.png"
							imagepath = CERN_static_content + imagepath;
							unique_id = m_fax_PersonId;
							prvd_type = self.ophpI18n.INTERNAL_PROVIDER;
						} else {
							imagepath = "";
							unique_id = fax_PersonName.replace(/[^a-zA-Z0-9]/g, '');
							prvd_type = self.ophpI18n.EXTERNAL_PROVIDER;
						}

						var fax_html = "";
						if (m_faxNumber == "") {
							fax_html = self.ophpI18n.ADD;
						} else {
							fax_html = m_faxNumber;
						}

						$(".oph-prescribe-fax-table tbody").append(
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
								.each(function() {
											var content = $(this).find("a")
													.text();
											if (content && content != self.ophpI18n.ADD && m_rowcount>0) {
												confirmDialog.setFooterButtonDither("grpSendBtn"+ self.getComponentId(),false);
											} else {
												confirmDialog.setFooterButtonDither("grpSendBtn"+ self.getComponentId(),true);
											}
										});

						$("." + compNS + "-btn-delete").bind("click",deleteFaxTableRow);

						$("#" + compNS + "-faxNumber-" + unique_id).bind("click", editFaxNumber);
						$("#oph-prescribeContentCtrl" + self.getComponentId()).val("");
						$("#" + compNS + "-fax-add-button").prop("disabled", true);
					});

	function editFaxNumber() {
		m_rowcount = $("." + compNS + "-faxSearch-table tbody tr.highlighted").length;
		var attributeId = $(this).attr('id');
		var popup = new MPageUI.Popup();
		var attributeValue = $("#" + attributeId).text();
		var addModify ="";
		if (attributeValue.localeCompare(self.ophpI18n.ADD) == 0) {
			attributeValue = "";
			addModify = self.ophpI18n.ADD_CAP;
		}else{
			addModify = self.ophpI18n.MODIFY;
		}
		popup.setAnchorId(attributeId);
		popup.setBodyContent("<div class='" + compNS
				+ "-faxpopup'>"+addModify+"&nbsp;"
				+ "<input type='text' class='" + compNS + "-popup_text' id='"+compNS+"popup_text' value='" + attributeValue
				+ "'>" + "<p id='"+compNS+"errormessage' class='" + compNS
				+ "-fax_Popup_ErrorMessage'></p>" + "</div>");
		popup.setFooter("<div class='" + compNS + "-fax_popup_button'>"
				+ "<button id='"+compNS+"faxpopupOk' class='" + compNS + "-faxpopupOK'>"
				+ self.ophpI18n.MODIFY_OK + "</button>" + "<button id='"
				+ compNS + "exit_but' class='" + compNS + "-faxpopupOK'>"
				+ self.ophpI18n.MODIFY_CANCEL + "</button>" + "</div>");
		popup.show();
		
		$("#"+compNS+"faxpopupOk").prop("disabled", true);
		$("#" + compNS + "exit_but").click(function() {
			popup.destroy();
		});

		
		
		
		$("#"+compNS+"popup_text").keyup(function(event) {

					var fax_number1 = $("#"+compNS+"popup_text").val();
					
							if (isNaN(fax_number1)) {
								$("#"+compNS+"errormessage").html(
										self.ophpI18n.MSG_INVALID_FAX_NUMBER);												
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
							if(fax_number1==""){
						$("#"+compNS+"faxpopupOk").prop("disabled",true);
						}
					}

			);
		
		
		
		$("#"+compNS+"faxpopupOk").click(function() {
							var fax_number1 = $("#"+compNS+"popup_text").val();
							if((addModify == self.ophpI18n.ADD_CAP)||(fax_number1 == attributeValue)){
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
											function() {
												var content = $(this).find("a").text();
												if (content && content != self.ophpI18n.ADD && m_rowcount>0) {
													confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(),false);
												} else {
													confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(),true);
												}
											})
						});
	};

	function deleteFaxTableRow() {
		$(this).closest('tr').remove();
		var content = $(this).find("a").html();

		$('#faxprovidertable tr').each(
				function() {
					if (content && content != self.ophpI18n.ADD && m_rowcount>0) {
						confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(), false);
					} else {
						confirmDialog.setFooterButtonDither("grpSendBtn" + self.getComponentId(), true);
					}
				});
};
$("#vwpModalDialogproviderReqDialog dyn-modal-hdr-close").on("click",closeWindow);
	var closeWindow = function() {
		MP_ModalDialog.closeModalDialog(providerReqDialogName);
		MP_ModalDialog.deleteModalDialogObject(providerReqDialogName);
	};

	MP_Util.AddAutoSuggestControl(self, self.searchProviders,self.handleSelection, self.createSuggestionLine);

}

/**
 * Prints the report into DiscernReportViewer for the appropriate section based
 * on parameter passed
 * 
 * @param scriptName
 *            Specifies .prg file name for the respective section to be printed
 * @param encounterId
 *            encounter Id of the patient
 * 
 */
OphPrescriptionComponent.prototype.printForm = function(scriptName, encounterId) {

	var dateObj = new Date();
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
	var endDateTime = year + month + dateString + hour + minute + second;
	var parameterList = "'MINE'," + "'" + scriptName + "'," + encounterId
			+ ".0,'" + startDateTime + "'," + "'" + endDateTime + "'";
	var mpageTimer = MP_Util.CreateTimer(
			"CAP:MPG.Oph_Wrapper_Print_Script - Print Prescription", null,
			scriptName);

	CCLLINK("oph_wrapper_print_Script", parameterList, 0);

	if (mpageTimer) {
		mpageTimer.Stop();
	}

};

/**
 * Returns HTML Markup required to build glasses section
 * 
 * @param component
 *            The component being rendered
 * @param reply
 *            JSON record structure
 * @return {string} : The display result for Glasses section
 */
OphPrescriptionComponent.prototype.buildGlassHTML = function(reply) {
	var sHTML = [];
	var x = 0;
	var xl = 0;
	var groups = this.getGroups();
	// display Glasses section
	if (reply.STATUS_DATA.STATUS === "S") {
		if (reply.QUAL.length > 0) {
			var reportName = "oph_glasses_print_report";
			sHTML.push("<div ><span class='oph-prescribe-print-icon-span'><h3 class='sub-sec-hd'>");
					sHTML.push("<a id='" + this.compId
					+ "-icon-fax-glass' class='oph-prescribe-fax-icon'>");
			sHTML.push(this.faxIconCell());
		
			sHTML.push("<a id='" + this.compId + "-icon-glass' class='oph-prescribe-print-icon'");
			sHTML.push(this.printIconCell());

			sHTML.push("<span>", this.ophpI18n.GLASS,
					"</span></h3></span></div>");
			for (x = 0, xl = reply.QUAL.length; x < xl; x++) {
				var qual = reply.QUAL[x];
				// display each glass type subsection
				// add glass type label
				var encntrId = qual.ENCNTR_ID;
				var activityId = qual.DCP_FORMS_ACTIVITY_ID;
				this.glassJson.glass_type[this.glassJson.glass_type.length] = {
					"encntr_id" : encntrId,
					"activity_id" : activityId
				};
				var glassId = this.compId + "-" + encntrId + "-" + activityId;
				var correctionDisp = this.populateGlassResultHTML(
						"GLASSES_CORRECT", qual);
				sHTML
						.push(
								"<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>",
								"<a id='" + glassId + "'>",
								"<span class='sub-sec-title'>",
								qual.GLASS_TYPE,
								"</span></a><span class='oph-prescribe-cor'>",
								correctionDisp, "</span></h3>");
				// add glass type content
				// add header row.
				sHTML
						.push(
								"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb'>",
								"<thead class='oph-prescribe-th'><tr><th>",
								this.ophpI18n.EYE, "</th><th>",
								this.ophpI18n.SPHERICAL, "</th><th>",
								this.ophpI18n.CYLIN, "</th><th>",
								this.ophpI18n.AXIS, "</th><th>",
								this.ophpI18n.ADD, "</th><th>",
								this.ophpI18n.HPRISM, "</th><th>",
								this.ophpI18n.HBASE, "</th><th>",
								this.ophpI18n.VPRISM, "</th><th>",
								this.ophpI18n.VBASE, "</th></tr></thead>");
				// add OD row.
				sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
				sHTML.push(this.populateGlassODHTML(qual));
				sHTML.push("</tr>");
				// add OS row.
				sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
				sHTML.push(this.populateGlassOSHTML(qual));
				sHTML.push("</tr></tbody></table>");
				var provider = this.populateGlassResultHTML("GLASSES_PROVIDER",
						qual);
				sHTML.push("<div class='order-pr'>", provider, "</div>");
				var prismType = this.populateGlassResultHTML("GLASSES_PRISM",
						qual);
				sHTML.push("<div class='prism-type'>", prismType, "</div>");
				var expDate = this.populateGlassResultHTML("GLASSES_EXP_DATE",
						qual);
				sHTML.push("<div class='exp-date'>", expDate, "</div>");
				var len = this.populateGlassResultHTML("GLASSES_LENS", qual);
				sHTML.push("<div class='len'>", len, "</div>");
				var lenSub = this.populateGlassResultHTML("GLASSES_LENS_SUB",
						qual);
				sHTML.push("<div class='len-sub'>", lenSub, "</div>");
				var comment = this.populateGlassResultHTML("GLASSES_COM", qual);
				sHTML.push("<div class='comment'>", comment,
						"</div></div></div></div>");

			}

			sHTML.push("</div>");

		}

	}
	return sHTML.join("");

};

/**
 * Returns HTML Markup required to build SoftContact section
 * 
 * @param component
 *            The component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for SoftContact section
 */
OphPrescriptionComponent.prototype.buildSoftContactHTML = function(replyAr) {
	var sHTML = [];
	var correctionDisp = "";
	var expDate = "";
	// display Soft Contacts section
	// add soft contacts label
	correctionDisp = this.populateContactResultHTML("SOFT_CORRECT", replyAr);
	var params = "soft";
	var reportName = "oph_softcontacts_print_report";
	sHTML
			.push(
					"<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'> </span><span class='oph-prescribe-print-icon-span' > <a id='"
							+ this.compId + "-soft-powerform' >",
					"<span class='sub-sec-title' >",
					this.ophpI18n.SOFT_CONTACT, "</span></a>");
	sHTML.push("<a id='" + this.compId	+ "-icon-fax-soft' class='oph-prescribe-fax-icon'>");
	sHTML.push(this.faxIconCell());
	sHTML.push("<a id='" + this.compId	+ "-icon-soft' class='oph-prescribe-print-icon'");
	sHTML.push(this.printIconCell());
	sHTML.push("<span class='oph-prescribe-cor'>", correctionDisp,	"</span></h3></span>");
	// add soft contact first header row.
	sHTML
			.push(
					"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb'>",
					"<thead class='oph-prescribe-th'><tr><th>",
					this.ophpI18n.EYE, "</th><th>", this.ophpI18n.SPHERICAL,
					"</th><th>", this.ophpI18n.CYLIN, "</th><th>",
					this.ophpI18n.AXIS, "</th><th>", this.ophpI18n.ADD,
					"</th><th>", this.ophpI18n.CONTACT_PRISM,
					"</th><th></th></tr></thead>");
	// add soft contact first OD row.
	sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
	sHTML.push(this.populateSoftContactODHTML_1(replyAr));
	sHTML.push("</tr>");
	// add soft contact first OS row.
	sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
	sHTML.push(this.populateSoftContactOSHTML_1(replyAr));
	sHTML.push("</tr>");
	// add soft contact second header row
	sHTML
			.push(
					"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb' >",
					"<thead class='oph-prescribe-th'><tr><th>",
					this.ophpI18n.EYE, "</th><th>", this.ophpI18n.MANUFACTURER,
					"</th><th>", this.ophpI18n.PRODUCT, "</th><th>",
					this.ophpI18n.COLOR, "</th><th>", this.ophpI18n.LENS_TYPE,
					"</th><th>", this.ophpI18n.BASE_CURVE, "</th><th>",
					this.ophpI18n.LENS_DIAMETER, "</th></tr></thead>");
	// add soft contact second OD row.
	sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
	sHTML.push(this.populateSoftContactODHTML_2(replyAr));
	sHTML.push("</tr>");
	// add soft contact second OS row.
	sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
	sHTML.push(this.populateSoftContactOSHTML_2(replyAr));
	sHTML.push("</tr></tbody></table>");
	var provider = this.populateContactResultHTML("SOFT_PROVIDER", replyAr);
	sHTML.push("<div class='order-pr'>", provider, "</div>");
	expDate = this.populateContactResultHTML("SOFT_EXP_DATE", replyAr);
	sHTML.push("<div class='exp-date'>", expDate, "</div>");
	disposalSch = this.populateContactResultHTML("SOFT_LENS", replyAr);
	sHTML.push("<div class='dis-sch'>", disposalSch, "</div>");
	var refill = this.populateContactResultHTML("SOFT_REFILLS", replyAr);
	sHTML.push("<div class='refill'>", refill, "</div>");
	var comment = this.populateContactResultHTML("SOFT_COMMENTS", replyAr);
	sHTML.push("<div class='comment'>", comment, "</div></div></div></div>");
	return sHTML.join("");
};

/**
 * Returns HTML Markup required to build Gas Permeable section
 * 
 * @param component
 * @param replyAr
 * @return {string} : The display result for Gas Permeable Section
 */
OphPrescriptionComponent.prototype.buildGasContactHTML = function(replyAr) {
	var sHTML = [];
	var correctionDisp = "";
	var expDate = "";
	// display Gas Permeable Contacts section
	// add gas permeable contacts label
	correctionDisp = this.populateContactResultHTML("GAS_CORRECT", replyAr);
	var params = "gas";
	var reportName = "oph_gp_print_report";
	sHTML.push(		"<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'></span>",
					"<span class='oph-prescribe-print-icon-span'><a id='"
							+ this.compId + "-gas-powerform'>",
					"<span class='sub-sec-title'>", this.ophpI18n.GAS_CONTACT,
					"</span></a>");
	sHTML.push("<a id ='" + this.compId
			+ "-icon-fax-gas' class='oph-prescribe-fax-icon'>");
	sHTML.push(this.faxIconCell());
	
	sHTML.push("<a id ='" + this.compId + "-icon-gas' class='oph-prescribe-print-icon'");
		sHTML.push(this.printIconCell());
	
	sHTML.push("<span class='oph-prescribe-cor'>", correctionDisp,
			"</span></h3></span>");
	// add first Gas Permeable Contacts header row.
	sHTML.push(		"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb'>",
					"<thead class='oph-prescribe-th'><tr><th>",
					this.ophpI18n.EYE, "</th><th>", this.ophpI18n.MANUFACTURER,
					"</th><th>", this.ophpI18n.PRODUCT, "</th><th>",
					this.ophpI18n.COLOR, "</th><th>", this.ophpI18n.BASE_CURVE,
					"</th><th>", this.ophpI18n.LENS_DIAMETER,
					"</th><th></th></tr></thead>");
	// add first Gas Permeable Contacts OD row.
	sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
	sHTML.push(this.populateGasContactODHTML_1(replyAr));
	sHTML.push("</tr>");
	// add first Gas Permeable Contacts OS row.
	sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
	sHTML.push(this.populateGasContactOSHTML_1(replyAr));
	sHTML.push("</tr></tbody></table>");
	// add second Gas Permeable Contacts header row.
	sHTML.push(		"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb'>",
					"<thead class='oph-prescribe-th'><tr><th>",
					this.ophpI18n.EYE, "</th><th>", this.ophpI18n.SPHERICAL,
					"</th><th>", this.ophpI18n.CYLIN, "</th><th>",
					this.ophpI18n.AXIS, "</th><th>", this.ophpI18n.ADD,
					"</th><th>", this.ophpI18n.CONTACT_PRISM,
					"</th><th></th></tr></thead>");
	// add second Gas Permeable Contacts OD row.
	sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
	sHTML.push(this.populateGasContactODHTML_2(replyAr));
	sHTML.push("</tr>");
	// add second Gas Permeable Contacts OS row.
	sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
	sHTML.push(this.populateGasContactOSHTML_2(replyAr));
	sHTML.push("</tr></tbody></table>");
	// add third Gas Permeable Contacts header row.
	sHTML.push(		"<div class='sub-sec-content'><div class='content-body'><table class='oph-prescribe-info oph-prescribe-tb'>",
					"<thead class='oph-prescribe-th'><tr><th>",
					this.ophpI18n.EYE, "</th><th>", this.ophpI18n.OPT_ZONE,
					"</th><th>", this.ophpI18n.INTER_RADIUS, "</th><th>",
					this.ophpI18n.INTER_WIDTH, "</th><th>",
					this.ophpI18n.PER_RADIUS, "</th><th>",
					this.ophpI18n.PER_WIDTH, "</th><th>",
					this.ophpI18n.PER_EDGE, "</th></tr></thead>");
	// add third Gas Permeable Contacts OD row.
	sHTML.push("<tbody><tr><td>", this.ophpI18n.OD, "</td>");
	sHTML.push(this.populateGasContactODHTML_3(replyAr));
	sHTML.push("</tr>");
	// add third Gas Permeable Contacts OS row.
	sHTML.push("<tr><td>", this.ophpI18n.OS, "</td>");
	sHTML.push(this.populateGasContactOSHTML_3(replyAr));
	sHTML.push("</tr></tbody></table>");
	var provider = this.populateContactResultHTML("GAS_PROVIDER", replyAr);
	sHTML.push("<div class='order-pr'>", provider, "</div>");
	expDate = this.populateContactResultHTML("GAS_EXP_DATE", replyAr);
	sHTML.push("<div class='exp-date'>", expDate, "</div>");
	disposalSch = this.populateContactResultHTML("GAS_DISPOSE", replyAr);
	sHTML.push("<div class='dis-sch'>", disposalSch, "</div>");
	var refill = this.populateContactResultHTML("GAS_REFILLS", replyAr);
	sHTML.push("<div class='refill'>", refill, "</div>");
	var comment = this.populateContactResultHTML("GAS_COMMENTS", replyAr);
	sHTML.push("<div class='comment'>", comment, "</div></div></div></div>");
	return sHTML.join("");
};

/**
 * Contains Print icon functionality
 * 
 * @param component
 *            The component being rendered
 * @param reportName
 *            Report name of the section to be printed
 * @return {string} : The display result for print icon
 */
OphPrescriptionComponent.prototype.printIconCell = function() {
	var iconHtml = [];
	var printEncounterId = this.getCriterion().encntr_id;
	var printIcon = CERN_static_content + this.ophpI18n.PRINT_ICON_IMG;
	iconHtml.push(">", "<img src = '", printIcon,
			"' height='16px' width='16px' alt='", this.ophpI18n.PRINT_TOOL_TIP,
			"' title='", this.ophpI18n.PRINT_TOOL_TIP, "' /> </a>");
	return iconHtml.join("");
};
/*
 * This function is used to set the fax icon image and the fax tool tip @param
 * -none @returns - sets the icon and the tool tip name
 */
OphPrescriptionComponent.prototype.faxIconCell = function() {
	var iconHtml = [];
	var printEncounterId = this.getCriterion().encntr_id;
	var printIcon = CERN_static_content + "/images/6671.png";
	iconHtml.push("<img src = '", printIcon,
			"' height='16px' width='16px' alt='", this.ophpI18n.FAX_TOOL_TIP,
			"' title='", this.ophpI18n.FAX_TOOL_TIP, "' /> </a>");
	return iconHtml.join("");
};

/**
 * Passes group-name parameter values for OD under glasses section
 * 
 * @param component
 *            The component being rendered
 * @param qual
 * @return {string} : The display result for OD cell
 */
OphPrescriptionComponent.prototype.populateGlassODHTML = function(qual) {
	var ODHTML = [];
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_SPH", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_CYL", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_AXIS", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_ADD", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_HOR_PRISM", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_HOR_BASE", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_VERT_PRISM", qual));
	ODHTML.push(this.populateGlassCellHTML("GLASSES_OD_VERT_BASE", qual));
	return ODHTML.join("");
};

/**
 * Passes group-name parameter values for OS under glasses section
 * 
 * @param component
 *            The component being rendered
 * @param qual
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateGlassOSHTML = function(qual) {
	var OSHTML = [];
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_SPH", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_CYL", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_AXIS", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_ADD", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_HOR_PRISM", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_HOR_BASE", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_VERT_PRISM", qual));
	OSHTML.push(this.populateGlassCellHTML("GLASSES_OS_VERT_BASE", qual));
	return OSHTML.join("");
};

/**
 * Returns HTML for OD/OS cell.
 * 
 * @param component
 *            The component being rendered
 * @param groupName
 *            The group name
 * @param qual
 * @return {string} : The display result for OD/OS cell
 */
OphPrescriptionComponent.prototype.populateGlassCellHTML = function(groupName,qual) {
	var cellHTML = [];
	var criterion = this.getCriterion();
	var groups = this.getGroups();
	for (var x = 0; x < groups.length; x++) {
		var group = groups[x];
		if (groupName === group.getGroupName()) {
			var eventCode = group.getEventCodes()[0];
			for (var y = 0; y < qual.RESULTS.length; y++) {
				var result = "";
				var resultUnits = "";
				var resModifiedIcon = "";
				var resNormalcy = "";
				var ceEndDate = "";
				var resEventId = 0.0;
				var resStatus = "";
				var curResult = qual.RESULTS[y];
				if (eventCode === curResult.EVENT_CD) {
					var dateTime = new Date();
					var modifiedIcon = "";
					var eventDisplay = curResult.EVENT_CD_DISP;
					// check to see if the result is in modified Status
					if (curResult.RESULT_STATUS_CD_MEAN === "MODIFIED"
							|| curResult.RESULT_STATUS_CD_MEAN === "ALTERED") {
						modifiedIcon = "<span class='res-modified'>&nbsp;</span>";
					}
					var tempResult = "";
					tempResult = this.getGrpResultDisplayValue(curResult);
					result = tempResult;
					resultUnits = curResult.RESULT_UNITS_CD_DISP;
					dateTime.setISO8601(curResult.EVENT_END_DT_TM);
					ceEndDate = dateTime.format("longDateTime2");
					ceEndDateLong = dateTime.format("longDateTime3");
					resEventId = curResult.EVENT_ID;
					resModifiedIcon = modifiedIcon;
					resNormalcy = curResult.NORMALCY_CD_MEAN;
					resStatus = curResult.RESULT_STATUS_CD_DISP;
					var resNormalcyDisp = this
							.getNormalcyFromCDMean(resNormalcy);
					// create eventViewer Link
					var params = [ criterion.person_id, criterion.encntr_id,
							resEventId, "\"EVENT\"" ];
					var link = [ "<a onclick='MP_Util.LaunchClinNoteViewer(",
							params.join(","), "); return false;' href='#'>",
							result, "</a>" ];
					resEventViewer = link.join("");
					// HTML for result cell
					cellHTML
							.push(
									"<td>",
									"<dl class='result-info'>",
									"<dt class='oph-prescribe-disp-lbl'>Disp Info</dt>",
									"<dd'><span class='",
									resNormalcyDisp,
									"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
									resEventViewer, "</span>", resModifiedIcon,
									"</span></dd>", "</dl>",
									"<div class='result-details'>",
									"<h4 class='det-hd'>Ophs Details</h4>",
									"<dl class='oph-prescribe-det'>",
									"<dt><span>", eventDisplay,
									":</span></dt>", "<dd><span class='",
									resNormalcyDisp, "'>", result, resultUnits,
									"</span></dd>", "<dt><span>",
									this.ophpI18n.RESULT_DT_TM,
									":</span></dt>", "<dd><span>",
									ceEndDateLong, "</span></dd>",
									"<dt><span>", this.ophpI18n.STATUS,
									":</span></dt>", "<dd><span>", resStatus,
									"</span></dd>", "</dl>", "</div>", "</td>");

					break;
				}
			}
			break;
		}
	}
	if (cellHTML.length === 0) {
		cellHTML.push("<td>--</td>");
	}
	return cellHTML.join("");
};

/**
 * Returns HTML for other values under glasses.
 * 
 * @param component
 *            The component being rendered
 * @param groupName
 *            The reply structure from json file
 * @param qual
 * @return {string} : The display result for OD/OS cell
 */
OphPrescriptionComponent.prototype.populateGlassResultHTML = function(
		groupName, qual) {
	var resultHTML = [];
	var criterion = this.getCriterion();
	var groupDisp = "";
	switch (groupName) {
	case "GLASSES_CORRECT":
		groupDisp = this.ophpI18n.CORRECTION;
		break;
	case "GLASSES_PROVIDER":
		groupDisp = this.ophpI18n.ORDER_PROVIDER;
		break;
	case "GLASSES_PRISM":
		groupDisp = this.ophpI18n.PRISM_TYPE;
		break;
	case "GLASSES_EXP_DATE":
		groupDisp = this.ophpI18n.EXP_DATE;
		break;
	case "GLASSES_LENS":
		groupDisp = this.ophpI18n.REC_LEN;
		break;
	case "GLASSES_LENS_SUB":
		groupDisp = this.ophpI18n.REC_LEN_SUB;
		break;
	case "GLASSES_COM":
		groupDisp = this.ophpI18n.COMMENTS;
		break;
	}
	var groups = this.getGroups();
	for (var x = 0; x < groups.length; x++) {
		var group = groups[x];
		if (groupName === group.getGroupName()) {
			var eventCode = group.getEventCodes()[0];
			for (var y = 0; y < qual.RESULTS.length; y++) {
				var result = "";
				var resultUnits = "";
				var resModifiedIcon = "";
				var resNormalcy = "";
				var ceEndDate = "";
				var resEventId = 0.0;
				var resStatus = "";
				var curResult = qual.RESULTS[y];
				if (eventCode === curResult.EVENT_CD) {
					var dateTime = new Date();
					var modifiedIcon = "";
					var eventDisplay = curResult.EVENT_CD_DISP;
					// check to see if the result is in modified Status
					if (curResult.RESULT_STATUS_CD_MEAN === "MODIFIED"
							|| curResult.RESULT_STATUS_CD_MEAN === "ALTERED") {
						modifiedIcon = "<span class='res-modified'>&nbsp;</span>";
					}
					var tempResult = "";
					if (groupName === "GLASSES_EXP_DATE") {
						// GLASSES_EXP_DATE is date only result. Display Date
						// only.
						if (curResult.DATE_RESULT.length > 0) {
							dateTime
									.setISO8601(curResult.DATE_RESULT[0].RESULT_DT_TM);
							tempResult = dateTime.format("shortDate2");
						}
					} else {
						tempResult = this.getGrpResultDisplayValue(curResult);
					}
					result = tempResult;
					resultUnits = curResult.RESULT_UNITS_CD_DISP;
					dateTime.setISO8601(curResult.EVENT_END_DT_TM);
					ceEndDate = dateTime.format("longDateTime2");
					ceEndDateLong = dateTime.format("longDateTime3");
					resEventId = curResult.EVENT_ID;
					resModifiedIcon = modifiedIcon;
					resNormalcy = curResult.NORMALCY_CD_MEAN;
					resStatus = curResult.RESULT_STATUS_CD_DISP;
					var resNormalcyDisp = this
							.getNormalcyFromCDMean(resNormalcy);
					// create eventViewer Link
					var params = [ criterion.person_id, criterion.encntr_id,
							resEventId, "\"EVENT\"" ];
					var link = [ "<a onclick='MP_Util.LaunchClinNoteViewer(",
							params.join(","), "); return false;' href='#'>",
							result, "</a>" ];
					resEventViewer = link.join("");
					// HTML for result

					resultHTML.push(
									"<dl class='result-info'>", /*
																 * "<dt class='oph-prescribe-disp-lbl'>Disp
																 * Info</dt>",
																 */
									"<dd><span>",
									groupDisp,
									"</span>",
									"<span class='",
									resNormalcyDisp,
									"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
									resEventViewer, "</span>", resModifiedIcon,
									"</span></dd>", "</dl>",
									"<div class='result-details'>",
									"<h4 class='det-hd'>Ophs Details</h4>",
									"<dl class='oph-prescribe-det'>",
									"<dt><span>", eventDisplay,
									":</span></dt>", "<dd><span class='",
									resNormalcyDisp, "'>", result, resultUnits,
									"</span></dd>", "<dt><span>",
									this.ophpI18n.RESULT_DT_TM,
									":</span></dt>", "<dd><span>",
									ceEndDateLong, "</span></dd>",
									"<dt><span>", this.ophpI18n.STATUS,
									":</span></dt>", "<dd><span>", resStatus,
									"</span></dd>", "</dl>", "</div>");
					break;
				}
			}
			break;
		}
	}
	return resultHTML.join("");
};
/**
 * Returns HTML for OD/OS cell for Soft Contacts under Table-1.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON Record structure
 * @return {string} : The display result for OD/OS cell
 */
OphPrescriptionComponent.prototype.populateSoftContactODHTML_1 = function(
		replyAr) {
	var ODHTML = [];
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_SPH", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_CYL", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_AXIS", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_ADD", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_PRISM", replyAr));
	return ODHTML.join("");
};
/**
 * Returns HTML for OD cell for Soft Contacts under Table-2.
 * 
 * @param component
 * @param replyAr
 * @return {string} : The display result for OD cell
 */
OphPrescriptionComponent.prototype.populateSoftContactODHTML_2 = function(
		replyAr) {
	var ODHTML = [];
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_MANU", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_PRODUCT", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_COLOR", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_LENS", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_BASE", replyAr));
	ODHTML.push(this.populateContactCellHTML("SOFT_OD_DIAM", replyAr));
	return ODHTML.join("");
};
/**
 * Returns HTML for OS cell for Soft Contacts under Table-1.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateSoftContactOSHTML_1 = function(
		replyAr) {
	var OSHTML = [];
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_SPH", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_CYL", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_AXIS", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_ADD", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_PRISM", replyAr));
	return OSHTML.join("");
};
/**
 * Returns HTML for OS cell for Soft Contacts under Table-2.
 * 
 * @param component
 * @param replyAr
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateSoftContactOSHTML_2 = function(
		replyAr) {
	var OSHTML = [];
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_MANU", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_PRODUCT", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_COLOR", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_LENS", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_BASE", replyAr));
	OSHTML.push(this.populateContactCellHTML("SOFT_OS_DIAM", replyAr));
	return OSHTML.join("");
};
/**
 * Returns HTML for OD cell for Gas Permeable under Table-1.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OD cell
 */
OphPrescriptionComponent.prototype.populateGasContactODHTML_1 = function(
		replyAr) {
	var ODHTML = [];
	ODHTML.push(this.populateContactCellHTML("GAS_OD_MANU", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_PRODUCT", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_COLOR", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_BASE", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_LENS", replyAr));
	return ODHTML.join("");
};
/**
 * Returns HTML for OD cell for Gas Permeable under Table-2.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OD cell
 */
OphPrescriptionComponent.prototype.populateGasContactODHTML_2 = function(
		replyAr) {
	var ODHTML = [];
	ODHTML.push(this.populateContactCellHTML("GAS_OD_SPH", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_CYL", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_AXIS", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_ADD", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_VERT_PRISM", replyAr));
	return ODHTML.join("");
};
/**
 * Returns HTML for OD cell for Gas Permeable under Table-3.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OD cell
 */
OphPrescriptionComponent.prototype.populateGasContactODHTML_3 = function(
		replyAr) {
	var ODHTML = [];
	ODHTML.push(this.populateContactCellHTML("GAS_OD_OPT", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_ICR", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_ICW", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_PCR", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_PCW", replyAr));
	ODHTML.push(this.populateContactCellHTML("GAS_OD_EDGE", replyAr));
	return ODHTML.join("");
};
/**
 * Returns HTML for OS cell for Gas Permeable under Table-1.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateGasContactOSHTML_1 = function(
		replyAr) {
	var OSHTML = [];
	OSHTML.push(this.populateContactCellHTML("GAS_OS_MANU", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_PRODUCT", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_COLOR", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_BASE", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_LENS", replyAr));
	return OSHTML.join("");
};
/**
 * Returns HTML for OS cell for Gas Permeable under Table-2.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateGasContactOSHTML_2 = function(
		replyAr) {
	var OSHTML = [];
	OSHTML.push(this.populateContactCellHTML("GAS_OS_SPH", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_CYL", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_AXIS", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_ADD", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_VERT_PRISM", replyAr));
	return OSHTML.join("");
};
/**
 * Returns HTML for OS cell for Gas Permeable under Table-3.
 * 
 * @param component
 *            Component being rendered
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for OS cell
 */
OphPrescriptionComponent.prototype.populateGasContactOSHTML_3 = function(
		replyAr) {
	var OSHTML = [];
	OSHTML.push(this.populateContactCellHTML("GAS_OS_OPT", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_ICR", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_ICW", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_PCR", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_PCW", replyAr));
	OSHTML.push(this.populateContactCellHTML("GAS_OS_EDGE", replyAr));
	return OSHTML.join("");
};
/**
 * Returns HTML for other values under soft contacts/ gas permeable.
 * 
 * @param component
 *            Component being rendered
 * @param groupName
 *            Group name
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for other cells
 */
OphPrescriptionComponent.prototype.populateContactResultHTML = function(
		groupName, replyAr) {
	var resultHTML = [];
	var groupDisp = "";
	switch (groupName) {
	case "SOFT_CORRECT":
		groupDisp = this.ophpI18n.CORRECTION;
		break;
	case "SOFT_PROVIDER":
		groupDisp = this.ophpI18n.ORDER_PROVIDER;
		break;
	case "SOFT_EXP_DATE":
		groupDisp = this.ophpI18n.EXP_DATE;
		break;
	case "SOFT_LENS":
		groupDisp = this.ophpI18n.DISPOSAL_SCH;
		break;
	case "SOFT_REFILLS":
		groupDisp = this.ophpI18n.REFILL;
		break;
	case "SOFT_COMMENTS":
		groupDisp = this.ophpI18n.COMMENTS;
		break;
	case "GAS_CORRECT":
		groupDisp = this.ophpI18n.CORRECTION;
		break;
	case "GAS_PROVIDER":
		groupDisp = this.ophpI18n.ORDER_PROVIDER;
		break;
	case "GAS_EXP_DATE":
		groupDisp = this.ophpI18n.EXP_DATE;
		break;
	case "GAS_DISPOSE":
		groupDisp = this.ophpI18n.DISPOSAL_SCH;
		break;
	case "GAS_REFILLS":
		groupDisp = this.ophpI18n.REFILL;
		break;
	case "GAS_COMMENTS":
		groupDisp = this.ophpI18n.COMMENTS;
		break;
	}
	var groups = this.getGroups();
	var resultDatesArray = replyAr.RESULT_DATES[0];
	if (replyAr.STATUS_DATA.STATUS === "S") {
		var codeArray = MP_Util.LoadCodeListJSON(replyAr.CODES);
		var personnelArray = MP_Util.LoadPersonelListJSON(replyAr.PRSNL);
		var dateLength = resultDatesArray.length;
		var currentDate = new Date();
		currentDate.setISO8601(resultDatesArray.EVENT_END_DT_TM);
		var resultLength = resultDatesArray.RESULTS.length;
		for (var x = 0; x < groups.length; x++) {
			var group = groups[x];
			if (groupName === group.getGroupName()) {
				for (var y = 0; y < resultLength; y++) {
					var evtCode = resultDatesArray.RESULTS[y].EVENT_CD;
					if (evtCode === group.getEventCodes()[0]) {
						var groupSuffix = groupName.toLowerCase().split("_");
						var resultDisplay = "";
						var recordData = {};
						recordData.RESULTS = [];
						recordData.RESULTS.push(resultDatesArray.RESULTS[y]);
						var measureArray = this.loadMeasurementDataMap(
								recordData, personnelArray, codeArray);
						if (measureArray.length > 0) {
							var result = "";
							var measObject = measureArray[0].value[0];
							var display = measObject.getEventCode().display;
							if (groupName === "SOFT_EXP_DATE"
									|| groupName === "GAS_EXP_DATE") {
								// SOFT_EXP_DATE and GAS_EXP_DATE are date only
								// result. Display Date only.
								var sTempDate = MP_Util.Measurement.GetString(
										measObject, null, "shortDate2");
								var dateAr = [
										"<span class='",
										MP_Util.Measurement
												.GetNormalcyClass(measObject),
										"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
										this.getEventViewerLink(measObject,
												sTempDate),
										"</span>",
										MP_Util.Measurement
												.GetModifiedIcon(measObject),
										"</span>" ];
								result = dateAr.join("");
							} else {
								result = MP_Util.Measurement
										.GetNormalcyResultDisplay(measObject);
							}
							var status = measObject.getStatus().display;
							var oDate = measObject.getDateTime();
							var sDate = (oDate) ? this.df
									.format(
											oDate,
											mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)
									: "";
							var sDateHover = (oDate) ? this.df
									.format(
											oDate,
											mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)
									: "";
							if (groupSuffix[0] === "soft") {
								this.softContactResultInd = 1;
								this.softContactEventId = measObject
										.getEventId();
							} else if (groupSuffix[0] === "gas") {
								this.gasContactResultInd = 1;
								this.gasContactEventId = measObject
										.getEventId();
							}
							// HTML for result
							resultHTML.push("<dl class='result-info'>",
									"<dd><span>", groupDisp, "</span>",
									"<span>", result, "</span></dd>", "</dl>",
									"<div class='result-details'>",
									"<h4 class='det-hd'>Ophs Details</h4>",
									"<dl class='oph-prescribe-det'>",
									"<dt><span>", display, ":</span></dt>",
									"<dd><span>", result, "</span></dd>",
									"<dt><span>", this.ophpI18n.RESULT_DT_TM,
									":</span></dt>", "<dd><span>", sDateHover,
									"</span></dd>", "<dt><span>",
									this.ophpI18n.STATUS, ":</span></dt>",
									"<dd><span>", status, "</span></dd>",
									"</dl>", "</div>");

						}
						break;
					}
				}
				break;
			}
		}

	}
	return resultHTML.join("");
};
/**
 * Returns HTML for other values under soft contacts.
 * 
 * @param component
 *            Component being rendered
 * @param groupName
 *            Group name
 * @param replyAr
 *            JSON record structure
 * @return {string} : The display result for other cells
 */
OphPrescriptionComponent.prototype.populateContactCellHTML = function(
		groupName, replyAr) {
	var cellHTML = [];
	var x = 0;
	var groups = this.getGroups();
	var resultDatesArray = replyAr.RESULT_DATES[0];
	if (replyAr.STATUS_DATA.STATUS === "S") {
		var codeArray = MP_Util.LoadCodeListJSON(replyAr.CODES);
		var personnelArray = MP_Util.LoadPersonelListJSON(replyAr.PRSNL);
		var dateLength = resultDatesArray.length;
		var currentDate = new Date();
		currentDate.setISO8601(resultDatesArray.EVENT_END_DT_TM);
		var resultLength = resultDatesArray.RESULTS.length;
		for (x = 0; x < groups.length; x++) {
			var group = groups[x];
			if (groupName === group.getGroupName()) {
				for (var y = 0; y < resultLength; y++) {
					var evtCode = resultDatesArray.RESULTS[y].EVENT_CD;
					if (evtCode === group.getEventCodes()[0]) {
						var groupSuffix = groupName.toLowerCase().split("_");
						var resultDisplay = "";
						var recordData = {};
						recordData.RESULTS = [];
						recordData.RESULTS.push(resultDatesArray.RESULTS[y]);
						var measureArray = this.loadMeasurementDataMap(
								recordData, personnelArray, codeArray);
						if (measureArray.length > 0) {
							var measObject = measureArray[0].value[0];
							var display = measObject.getEventCode().display;
							var result = MP_Util.Measurement
									.GetNormalcyResultDisplay(measObject);
							var status = measObject.getStatus().display;
							var oDate = measObject.getDateTime();
							var sDate = (oDate) ? this.df
									.format(
											oDate,
											mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)
									: "";
							var sDateHover = (oDate) ? this.df
									.format(
											oDate,
											mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)
									: "";
							if (groupSuffix[0] === "soft") {
								this.softContactResultInd = 1;
								this.softContactEventId = measObject
										.getEventId();
							} else if (groupSuffix[0] === "gas") {
								this.gasContactResultInd = 1;
								this.gasContactEventId = measObject
										.getEventId();
							}
							// HTML for result
							cellHTML
									.push(
											"<td>",
											"<dl class='result-info'>",
											"<dt class='oph-prescribe-disp-lbl'>Disp Info</dt>",
											"<dd'><span>",
											result,
											"</span></dd>",
											"</dl>",
											"<div class='result-details'>",
											"<h4 class='det-hd'>Ophs Details</h4>",
											"<dl class='oph-prescribe-det'>",
											"<dt><span>", display,
											":</span></dt>", "<dd><span>",
											result, "</span></dd>",
											"<dt><span>",
											this.ophpI18n.RESULT_DT_TM,
											":</span></dt>", "<dd><span>",
											sDateHover, "</span></dd>",
											"<dt><span>", this.ophpI18n.STATUS,
											":</span></dt>", "<dd><span>",
											status, "</span></dd>", "</dl>",
											"</div>", "</td>");

						}
						break;
					}
				}
				break;
			}
		}
	}

	if (cellHTML.length === 0) {
		cellHTML.push("<td>--</td>");
	}
	return cellHTML.join("");
};

/**
 * Retrieves parameters to be passed by different subroutines
 * 
 * @param component
 *            Component being rendered
 * @param eventsArray
 * @param eventId
 *            event identifier value
 * @return {string} : The parameter to be passed
 */
OphPrescriptionComponent.prototype.retrieveFormParams = function(eventsArray,
		eventId) {
	// get powerform activity id
	var encntrId = 0;
	var activityId = 0;
	for (var x = 0; x < eventsArray.length; x++) {
		if (eventsArray[x].EVENT_ID === eventId) {
			encntrId = eventsArray[x].ENCOUNTER_ID;
			activityId = eventsArray[x].DCP_FORMS_ACTIVITY_ID;
			break;

		}
	}
	var personId = this.getCriterion().person_id;
	var params = [ personId, encntrId, activityId ];
	return params;
};
/**
 * getEventViewerLink function in mp_core is private function, need to define
 * the function here.
 * 
 * @param oMeasurement
 * @param sResultDisplay
 * @return {string} :
 */
OphPrescriptionComponent.prototype.getEventViewerLink = function(oMeasurement,
		sResultDisplay) {

	var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(),
			oMeasurement.getEventId(), "\"EVENT\"" ];
	var ar = [ "<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),
			"); return false;' href='#'>", sResultDisplay, "</a>" ];
	return ar.join("");
};
/**
 * Gets display value for group
 * 
 * @param curRes
 * @return {string} :
 */
OphPrescriptionComponent.prototype.getGrpResultDisplayValue = function(curRes) {

	var tempResult = "";
	var dateTime = new Date();
	switch (curRes.EVENT_CLASS_CD_MEAN) {
	case "NUM":
		if (curRes.SOURCE_CD_MEAN == "CALCULATED") {

			if (curRes.CALCULATION_RESULT_LIST.length > 0) {
				tempResult = curRes.CALCULATION_RESULT_LIST[0].CALCULATION_RESULT;
			}
		} else if (curRes.STRING_RESULT.length > 0) {
			tempResult = curRes.STRING_RESULT[0].STRING_RESULT_TEXT;

		}
		break;

	case "DATE":
		if (curRes.DATE_RESULT.length > 0) {
			dateTime.setISO8601(curRes.DATE_RESULT[0].RESULT_DT_TM);

			switch (curRes.DATE_RESULT[0].DATE_TYPE_FLAG) {
			case 1:
				tempResult = dateTime.format("longDate3");
				break;

			case 2:
				tempResult = dateTime.format("longTime3");
				break;
			default:
				tempResult = dateTime.format("longDateTime3");
			}

		}

		break;

	case "TXT":
		if (curRes.CODED_RESULT_LIST.length > 0) {
			var codedResLength = curRes.CODED_RESULT_LIST.length;
			for (var l = 0; l < codedResLength; l++) {
				switch (curRes.NOMEN_STRING_FLAG) {
				case 1:
					tempResult += curRes.CODED_RESULT_LIST[l].MNEMONIC;
					break;
				case 2:
					tempResult += curRes.CODED_RESULT_LIST[l].SOURCE_STRING;
					break;
				default:
					tempResult += curRes.CODED_RESULT_LIST[l].SHORT_STRING;
				}

				if (l !== codedResLength - 1) {
					tempResult += ", ";
				}

			}
		} else if (curRes.STRING_RESULT.length > 0) {
			tempResult = curRes.STRING_RESULT[0].STRING_RESULT_TEXT;

		}
		break;

	case "IO":
		if (curRes.SOURCE_CD_MEAN == "CALCULATED") {

			if (curRes.CALCULATION_RESULT_LIST.length > 0) {
				tempResult = curRes.CALCULATION_RESULT_LIST[0].CALCULATION_RESULT;
			}
		} else if (curRes.IO_RESULT_LIST.length > 0) {
			tempResult = curRes.IO_RESULT_LIST[0].VOLUME;

		}
		break;
	}

	if (tempResult === "") {
		tempResult = curRes.EVENT_TAG;
	}

	return tempResult;
};
/**
 * Sets CSS property based on Normalcy code
 * 
 * @param meaning
 * @return {string} : returns normalcy value
 */
OphPrescriptionComponent.prototype.getNormalcyFromCDMean = function(meaning) {
	var normalcy = "res-normal";
	var nc = meaning;
	if (nc !== null) {
		var normalcyMeaning = nc;
		if (normalcyMeaning !== null) {
			if (normalcyMeaning === "LOW") {
				normalcy = "res-low";
			} else if (normalcyMeaning === "HIGH") {
				normalcy = "res-high";
			} else if (normalcyMeaning === "CRITICAL"
					|| normalcyMeaning === "EXTREMEHIGH"
					|| normalcyMeaning === "PANICHIGH"
					|| normalcyMeaning === "EXTREMELOW"
					|| normalcyMeaning === "PANICLOW"
					|| normalcyMeaning === "VABNORMAL"
					|| normalcyMeaning === "POSITIVE") {
				normalcy = "res-severe";
			} else if (normalcyMeaning === "ABNORMAL") {
				normalcy = "res-abnormal";
			}
		}
	}

	return normalcy;

};

OphPrescriptionComponent.prototype.attachListners = function() {
	var self = this;
	var component = this;
	if (this.glassJson.glass_type.length > 0) {
		var glass_object1 = this.getGlassId(0);
		glass_object1.click(function() {
			self.getParamForGlass(0);
		});
	}
	if (this.glassJson.glass_type.length > 1) {
		var glass_object2 = this.getGlassId(1);
		glass_object2.click(function() {
			self.getParamForGlass(1);
		});
	}
	if (this.glassJson.glass_type.length > 2) {
		var glass_object3 = this.getGlassId(2);
		glass_object3.click(function() {
			self.getParamForGlass(2);
		});
	}
	if (this.glassJson.glass_type.length > 3) {
		var glass_object4 = this.getGlassId(3);
		glass_object4.click(function() {
			self.getParamForGlass(3);
		});
	}
	$("#" + self.compId + "-soft-powerform").click(function() {

		self.openExistingFormContact('soft');

	});

	$("#" + self.compId + "-gas-powerform").click(function() {

		self.openExistingFormContact('gas');
	});
	$("#" + self.compId + "-icon-fax-soft").click(
			function() {
				var faxEncounterId = self.getCriterion().encntr_id;
				self.transmitFax("oph_softcontacts_print_report", faxEncounterId, self.ophpI18n.PRESCRIPTIONS_HEADER_SC,
						 self.ophpI18n.PRESCRIPTION_SOFT_CONTACTS);
			});

	$("#" + self.compId + "-icon-fax-gas").click(
			function() {
				var faxEncounterId = self.getCriterion().encntr_id;
				self.transmitFax("oph_gp_print_report", faxEncounterId,	self.ophpI18n.PRESCRIPTIONS_HEADER_GP,
						self.ophpI18n.PRESCRIPTION_GAS_PERMEABLE);
			});
	$("#" + self.compId + "-icon-fax-glass").click(
			function() {
				var faxEncounterId = self.getCriterion().encntr_id;
				self.transmitFax("oph_glasses_print_report", faxEncounterId,
						self.ophpI18n.PRESCRIPTIONS_HEADER_G, self.ophpI18n.PRESCRIPTION_GLASSES);
			});

	$("#" + self.compId + "-icon-soft").click(function() {
		var printEncounterId = self.getCriterion().encntr_id;
		self.printForm("oph_softcontacts_print_report", printEncounterId);
	});

	$("#" + self.compId + "-icon-gas").click(function() {
		var printEncounterId = self.getCriterion().encntr_id;
		self.printForm("oph_gp_print_report", printEncounterId);
	});

	$("#" + self.compId + "-icon-glass").click(function() {
		var printEncounterId = self.getCriterion().encntr_id;
		self.printForm("oph_glasses_print_report", printEncounterId);
	});

};

/*
 * Search the providers and create auto suggestion drop down menu based on the
 * input characters entered by the user. @param {function} callback - Callback
 * is given component as a scope @param {DOM Element} textBox - Text box DOM
 * information @param {MPageComponent} component - component object for which
 * the script is being called. @returns {null}
 */
OphPrescriptionComponent.prototype.searchProviders = function(callback,
		textBox, component) {
	var searchText = textBox.value;
	var self = this;
	m_isInternal = false;
	m_faxNumber = "";
	m_providerBox = textBox;
	if (searchText.length < 3) {
		return;
	}
	var searchProviderTimer = new RTMSTimer("ENG:MPG.OphPrescription - Fax Provider Search", this.m_category_mean);
	if(searchProviderTimer){
		searchProviderTimer.start();
	}
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_oph_fax_prvdr_search_wrap");
	scriptRequest.setParameterArray([ "^MINE^",
			"^" + searchText + "^," + m_provider_id ]);
	scriptRequest.setAsyncIndicator(true);

	scriptRequest.setResponseHandler(function(scriptReply) {
	if(searchProviderTimer) {
				searchProviderTimer.stop();
	}
		var recordData = scriptReply.getResponse();
		if (recordData.STATUS_DATA.STATUS === "Z") {
			recordData.PRSNL = [];
			recordData.PRSNL.push({
				'NAME_FULL_FORMATTED' : self.ophpI18n.MSG_NO_RESULTS_FOUND
			});
		} else if (recordData.STATUS_DATA.STATUS === "F") {
			recordData.PRSNL = [];
			recordData.PRSNL.push({
				'NAME_FULL_FORMATTED' : self.ophpI18n.MSG_NO_RESULTS_FOUND
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
OphPrescriptionComponent.prototype.handleSelection = function(suggestionObj,
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

/*
 * Highlight the search text in auto suggest drop down list. @param {object}
 * suggestionObj - the object containing the providers information @param
 * {string} searchVal - Entered search text in auto suggest control @returns
 * {Array} - provider names with highlighted search text
 */
OphPrescriptionComponent.prototype.createSuggestionLine = function(
		suggestionObj, searchVal) {

	return this.component.highlightValue(suggestionObj.NAME_FULL_FORMATTED,
			searchVal);
};

/*
 * Gives the preview of the contents to be faxed. @param {string} - the
 * encounterID record data and event id @returns {string} - gives a preview of
 * the fax contents
 */
OphPrescriptionComponent.prototype.faxPreview = function(EncounterId,
		recordData, EventId, powerform_name) {
	var data_length = recordData.LIST.length;

	for (var i = 0; i < data_length; i++) {
		if (EventId == recordData.LIST[i].EVENT_ID) {
			
			var chartedDate = recordData.LIST[i].CHARTED_DATE;
			var chartedYear=chartedDate.substring(0,4);
			var chartedMonth=chartedDate.substring(5,7);
			var chartedDay=chartedDate.substring(8,10);
			var chartedHours=chartedDate.substring(11,13);
			var chartedMinutes=chartedDate.substring(14,16);
			

			var chartedDateObj = new Date(chartedYear, chartedMonth - 1,
					chartedDay, chartedHours, chartedMinutes);
			var startDate = new Date(chartedYear, chartedMonth - 1, chartedDay,
					chartedHours, chartedMinutes - 1);
			var endDate = new Date(chartedYear, chartedMonth - 1, chartedDay,
					chartedHours);
			endDate.setMinutes(chartedDateObj.getMinutes() + 1);

			var year = (startDate.getFullYear()).toString();
			var month = (startDate.getMonth() + 1).toString();
			if (month.length < 2) {
				month = "0" + month;
			}
			var dateString = (startDate.getDate()).toString();
			if (dateString.length < 2) {
				dateString = "0" + dateString;
			}
			var hour = (startDate.getHours()).toString();
			if (hour.length < 2) {
				hour = "0" + hour;
			}
			var minute = (startDate.getMinutes()).toString();
			if (minute.length < 2) {
				minute = "0" + minute;
			}
			var second = (startDate.getSeconds()).toString();
			if (second.length < 2) {
				second = "0" + second;
			}
			var startDateTime = year + month + dateString + hour + minute
					+ second;
			var year1 = (endDate.getFullYear()).toString();
			var month1 = (endDate.getMonth() + 1).toString();
			if (month1.length < 2) {
				month1 = "0" + month1;
			}
			var dateString1 = (endDate.getDate()).toString();
			if (dateString1.length < 2) {
				dateString1 = "0" + dateString1;
			}
			var hour1 = (endDate.getHours()).toString();
			if (hour1.length < 2) {
				hour1 = "0" + hour1;
			}
			var minute1 = (endDate.getMinutes()).toString();
			if (minute1.length < 2) {
				minute1 = "0" + minute1;
			}
			var second1 = (endDate.getSeconds()).toString();
			if (second1.length < 2) {
				second1 = "0" + second1;
			}
			var endDateTime = year1 + month1 + dateString1 + hour1 + minute1
					+ second1;
			
			var prg_name = "";
			if(powerform_name == "OPTICALRXSOFTCONTACTSFORM")
			{
				prg_name = "oph_softcontacts_print_report";
			}
			else if(powerform_name == "OPTICALRXGASPERMEABLECONTACTSFORM")
			{
				prg_name = "oph_gp_print_report";
			}
			else if(powerform_name == "OPTICALRXGLASSESFORM")
			{
				prg_name = "oph_glasses_print_report";
			}
			
			var parameterList = "'MINE'," + "'" + prg_name + "',"
					+ EncounterId + ".0,'" + startDateTime + "'," + "'"
					+ endDateTime + "'";

			CCLLINK("oph_wrapper_print_Script", parameterList, 0);
			break;
		}
	}
}

/*
 * Calls the corresponding scripts to retrieve prescription history results
 * @param {string} - record data,prescription name,encounter id @returns
 * {string} - it gives all the charted results between the specified dates
 */
OphPrescriptionComponent.prototype.processReceivedHistory = function(
		recordData, prescriptionName, faxEncounterId, powerform_name) {
	var self = this;
	var compNS = self.getStyles().getNameSpace();
	var dispPrescriptionName = prescriptionName;
	
	for (var i = 0; i < recordData.LIST.length; i++) {
		var EventId = recordData.LIST[i].EVENT_ID;
		var chartedDate = recordData.LIST[i].CHARTED_DATE;
		
		if(powerform_name == "OPTICALRXGLASSESFORM")
		{
			for (var j = 0; j < recordData.LIST[i].RESULTS.length; j++) {
				if (recordData.LIST[i].RESULTS[j].DISPLAY_KEY === "VISIONCORRECTIONTYPEGL") {
					dispPrescriptionName = prescriptionName + " (" + recordData.LIST[i].RESULTS[j].RESULT_VAL +")";
					break;
				}
			}
		}

		var chartedyear=chartedDate.substring(0,4);
		var chartedmonth=chartedDate.substring(5,7);
		var chartedday=chartedDate.substring(8,10);
		var chartedhours=chartedDate.substring(11,13);
		var chartedminutes=chartedDate.substring(14,16);
		var chartedDateObj=new Date(chartedyear,chartedmonth-1,chartedday,chartedhours,chartedminutes);
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
						+ "/images/5187.png' id='" + EventId + "' class='"
						+ compNS + "fax-preview' class = '" + compNS
						+ "-faximg-dimensions'/>" + "</td>" + "</tr>");
	}

	$("." + compNS + "fax-preview").click(function() {
		var attributeId = $(this).attr('id');
		self.faxPreview(faxEncounterId, recordData, attributeId, powerform_name);
	});
	
	$("." + compNS + "-faxSearchButton").prop("disabled", false);

	$("." + compNS + "-faxSearch-table tbody tr").click(function() {
				pres_id = $(this).attr('id');
				pres_date = $(this).find("td#pres_date").html();
				pres_time = $(this).find("td#pres_time").html();

				$('.oph-prescribe-faxSearch-table tbody tr').removeClass(
						'highlighted');
				$(this).addClass('highlighted');
				
						$("."+compNS+"-fax-table tbody tr")
								.each(
										function() {
											var content = $(this).find("a").text();
											if (content && content != self.ophpI18n.ADD ) {
												$("#grpSendBtn" + self.getComponentId()).prop("disabled",false);
											} else {
												$("#grpSendBtn" + self.getComponentId()).prop("disabled",true);
											}
										});
			
			});
};

/*
 * Gets the history of the charted results for the specified prescription.
 * @param {string} -the specified powerform name,start and end date,encounter
 * and person id @returns {string} - it gives all the charted results for the current day 
 */
OphPrescriptionComponent.prototype.getCurrentDayHistory = function(powerform_name,
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
		logger.logJSError(err, this, "ophprescription.js","getCurrentDayHistory");
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
OphPrescriptionComponent.prototype.getHistory = function(powerform_name,
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

	
		
		var searchFaxPrescriptionTimer = new RTMSTimer("ENG:MPG.OphPrescription - Fax Prescription Search", this.m_category_mean);
		if(searchFaxPrescriptionTimer){
			searchFaxPrescriptionTimer.start();
		}
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_oph_retrieve_results");
	scriptRequest.setParameterArray([ "'MINE'," + faxPersonId + ".0,"
			+ faxEncounterId + ".0,'" + powerform_name + "',0,0,'"
			+ startDateTime + "','" + endDateTime + "'" ])
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply) {
	if(searchFaxPrescriptionTimer){
				searchFaxPrescriptionTimer.stop();
			}
		recordData = scriptReply.getResponse();
		if (recordData.STATUS_DATA.STATUS === "F") {
			logger.logJSError(err, this, "ophprescription.js","getHistory");
	$("." + compNS + "-faxSearchButton").prop("disabled", false);
		} else {
			self.processReceivedHistory(recordData, prescriptionName,
					faxEncounterId,powerform_name);
		}
	});
	scriptRequest.performRequest();
};

/*Highlight the search text in auto suggest drop down list.
 * @param {string} inString - provider name which is coming from back-end call.
 * @param {string} term - Entered search text in auto suggest control 
 * @returns {string} - provider name with highlighted search text  
 */
OphPrescriptionComponent.prototype.highlightValue = function(inString, term) {
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

OphPrescriptionComponent.prototype.getParamForGlass = function(index) {
	var personId = this.getCriterion().person_id;
	var encntrId = this.glassJson.glass_type[index].encntr_id;
	var activityId = this.glassJson.glass_type[index].activity_id;
	var params = [ personId, encntrId, activityId ];
	this.openExistingFormGlass(params.join(","));
};

OphPrescriptionComponent.prototype.getGlassId = function(index) {
	var glass_object = $("#" + this.compId + "-"
			+ this.glassJson.glass_type[index].encntr_id + "-"
			+ this.glassJson.glass_type[index].activity_id);
	return glass_object;
};

OphPrescriptionComponent.prototype.loadMeasurementDataMap = function(
		recordData, personnelArray, codeArray, sortOption) {
	var mapObjects = [];
	var results = recordData.RESULTS;
	if (!codeArray) {
		codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	}
	if (!personnelArray) {
		personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
	}
	for (var i = 0, il = results.length; i < il; i++) {
		var result = results[i];
		if (result.CLINICAL_EVENTS.length > 0) {
			for (var j = 0, jl = result.CLINICAL_EVENTS.length; j < jl; j++) {
				var measureArray = [];
				var mapObject = null;
				if (result.EVENT_CD > 0) {
					mapObject = new MP_Core.MapObject(result.EVENT_CD,
							measureArray);
				} else {
					mapObject = new MP_Core.MapObject(result.EVENT_SET_NAME,
							measureArray);
				}
				var meas = result.CLINICAL_EVENTS[j];
				for (var k = 0, kl = meas.MEASUREMENTS.length; k < kl; k++) {
					var measurement = new MP_Core.Measurement();
					measurement.initFromRec(meas.MEASUREMENTS[k], codeArray);
					measureArray.push(measurement);
				}
				if (measureArray.length > 0) {
					if (sortOption) {
						measureArray.sort(sortOption);
					} else {
						measureArray.sort(this.sortByEffectiveDateDesc);
					}
					mapObjects.push(mapObject);
				}
			}
		}
	}
	return mapObjects;
};

OphPrescriptionComponent.prototype.sortByEffectiveDateDesc = function(a, b) {
	if (a.getDateTime() > b.getDateTime()) {
		return -1;
	} else {
		if (a.getDateTime() < b.getDateTime()) {
			return 1;
		}
	}
	return 0;
};

MP_Util.setObjectDefinitionMapping("OPH_SCRIPTS", OphPrescriptionComponent);