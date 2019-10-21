/**
 * Create the component style object which will be used to style various aspects of our component.
 */
function RegistrationDischargeInfoComponentStyle() {
	this.initByNamespace("rdi2014");
}
RegistrationDischargeInfoComponentStyle.inherits(ComponentStyle);

/**
 * @constructor Initialize the Registration-and-discharge-info-o1 component.
 * @param {Criterion}
 *            The Criterion object which contains information needed to render the component.
 */
function RegistrationDischargeInfoComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new RegistrationDischargeInfoComponentStyle());
	var rdiI18n = i18n.accesshim.him.RegistrationDischargeInfoComponent;
	var nameSpace = this.getStyles().getNameSpace();

	this.setComponentLoadTimerName("USR:MPG.HIM_REGISTRATION_AND_DISCHARGE_INFO.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.HIM_REGISTRATION_AND_DISCHARGE_INFO.O1 - render component");
	
	/**
	 * @constructor Initialize the VIP object used for generating a VIP row for an HTML table.
	 * @return {VIP} The VIP object.
	 */
	function VIP() {
		var _enabled = false;
		
		/**
		 * Generates HTML for an HTML table.
		 * 
		 * @param recordData
		 *            Data used by generateHTML() to determine the VIP status of the person.
		 * @return {String} HTML to display. Empty if VIP is not enabled or the Person VIP
		 *            indicator is 0.
		 */
		function generateHTML(recordData) {
			if (!isEnabled() || recordData.PERSON.VIP_IND === 0) {
				return "";
			}
			return "<tr><td colspan='2' class='" + nameSpace + "-vip-title'>" + rdiI18n.VIP
				+ "</td></tr>";
		}
		
		/**
		 * Returns true if VIP is enabled for display, false otherwise.
		 * 
		 * @return {boolean} Indicates if VIP is enabled for display.
		 */
		function isEnabled() {
			return _enabled;
		}
		
		/**
		 * Sets if VIP is enabled.
		 * 
		 * @param enabled
		 *            Indicates if VIP is enabled for display.
		 */
		function setEnabled(enabled) {
			_enabled = enabled;
		}
		
		this.generateHTML = generateHTML;
		this.isEnabled = isEnabled;
		this.setEnabled = setEnabled;
	}
	
	this.vipHeader = new VIP();
	
	/**
	 * @constructor Initialize the Data Row object used for generating an HTML row for an HTML
	 *              table.
	 * @param displayName
	 *            Name to use when displaying the row.
	 * @param generateRightColumnValueHTML
	 *            Helper function to generate the html for the "value" or righthand column of the
	 *            row generateRowHTML() generates.
	 * @param enabled
	 *            Determines if the DataRow object is enabled by default.
	 * @return {DataRow} The default DataRow object.
	 */
	function DataRow(displayName, generateRightColumnValueHTML, enabled) {
		var _enabled = enabled;
		var _displayName = displayName;
		var _displaySequence = 0;

		/**
		 * Generates HTML for an HTML table row.
		 * 
		 * @param recordData
		 *            Data used by generateRightColumnValueHTML() to display the value of the
		 *            righthand column of the row generated.
		 * @return {String} HTML to display. Empty if the DataRow is not enabled.
		 */
		function generateRowHTML(recordData) {
			if (!isEnabled()) {
				return "";
			}
			var rowArray = [];
			rowArray.push("<tr><td class='" + nameSpace + "-row-title'>" + getDisplayName()
					+ "</td>");
			rowArray.push("<td>", generateRightColumnValueHTML(recordData), "</td></tr>");
			return rowArray.join("");
		}

		/**
		 * Returns true if the row is enabled for display, false otherwise.
		 * 
		 * @return {boolean} Indicates if the row is enabled for display.
		 */
		function isEnabled() {
			return _enabled;
		}

		/**
		 * Sets if the row is enabled.
		 * 
		 * @param enabled
		 *            Indicates if the row is enabled for display.
		 */
		function setEnabled(enabled) {
			_enabled = enabled;
		}

		/**
		 * Returns the display name for the row.
		 * 
		 * @return {String} The display name for the row.
		 */
		function getDisplayName() {
			return _displayName;
		}

		/**
		 * Sets the display name for the row, but only if the passed name is non-empty.
		 * 
		 * @param displayName
		 *            The display name for the row.
		 */
		function setDisplayName(displayName) {
			if (displayName) {
				_displayName = displayName;
			}
		}

		/**
		 * Returns the display sequence for the row.
		 * 
		 * @return {String} The display sequence for the row.
		 */
		function getDisplaySequence() {
			return _displaySequence;
		}

		/**
		 * Sets the display sequence for the row.
		 * 
		 * @param displaySequencePassed
		 *            Sets the display sequence for the row.
		 */
		function setDisplaySequence(displaySequence) {
			_displaySequence = parseInt(displaySequence);
		}

		this.generateRowHTML = generateRowHTML;
		this.isEnabled = isEnabled;
		this.setEnabled = setEnabled;
		this.setDisplayName = setDisplayName;
		this.getDisplaySequence = getDisplaySequence;
		this.setDisplaySequence = setDisplaySequence;
	}

	/**
	 * Formats a String representing a date time using locale specific time.
	 * 
	 * @param dateToFormat
	 *            The date String to format.
	 * @return {String} The formatted String.
	 */
	function formatTime(dateToFormat) {
		var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		if (dateToFormat == "") {
			return dateToFormat;
		}
		var dateTime = new Date();
		dateTime.setISO8601(dateToFormat);
		return dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	}

	var dataRowIndices = {
		'ENCOUNTER_TYPE_ROW' : 0,
		'ATTENDING_PHYSICIAN_ROW' : 1,
		'FACILITY_ROW' : 2,
		'PAYER_ROW' : 3,
		'SECONDARY_PAYER_ROW' : 4,
		'REGISTRATION_DATE_ROW' : 5,
		'ADMIT_DATE_ROW' : 6,
		'ADMIT_SOURCE_ROW' : 7,
		'DISCHARGE_DATE_ROW' : 8,
		'DISCHARGE_DISPOSITION_ROW' : 9,
		'DISCHARGE_LOCATION_ROW' : 10,
		'DECEASED_DATE_ROW' : 11,
		'CAUSE_OF_DEATH_ROW' : 12,
		'LENGTH_OF_STAY_ROW' : 13,
		'BIRTH_NUMBER' : 14,
		'DEATH_NUMBER' : 15,
		'NATIONAL_HEALTH_NUMBER' : 16
	}
	this.dataRowIndices = dataRowIndices;

	var dataRows = [];

	dataRows[dataRowIndices.ENCOUNTER_TYPE_ROW] = new DataRow(rdiI18n.ENCOUNTER_TYPE, function(
			recordData) {
		return recordData.ENCNTR.ENCNTR_TYPE;
	}, true);

	dataRows[dataRowIndices.ATTENDING_PHYSICIAN_ROW] = new DataRow(rdiI18n.ATTENDING_PHYSICIAN,
			function(recordData) {
				return recordData.ENCNTR.ATTENDING_PHYSICIAN;
			}, true);

	dataRows[dataRowIndices.FACILITY_ROW] = new DataRow(rdiI18n.FACILITY, function(recordData) {
		return recordData.ENCNTR.FACILITY;
	}, true);

	dataRows[dataRowIndices.PAYER_ROW] = new DataRow(rdiI18n.PAYER, function(recordData) {
		return recordData.ENCNTR.PAYER;
	}, true);

	dataRows[dataRowIndices.SECONDARY_PAYER_ROW] = new DataRow(rdiI18n.SECONDARY_PAYER, function(
			recordData) {
		return recordData.ENCNTR.SECONDARY_PAYER;
	}, true);

	dataRows[dataRowIndices.REGISTRATION_DATE_ROW] = new DataRow(rdiI18n.REGISTRATION_DATE,
			function(recordData) {
				return formatTime(recordData.ENCNTR.REGISTRATION_DATE);
			}, true);

	dataRows[dataRowIndices.ADMIT_DATE_ROW] = new DataRow(rdiI18n.ADMIT_DATE, function(recordData) {
		return formatTime(recordData.ENCNTR.ADMIT_DATE);
	}, true);

	dataRows[dataRowIndices.ADMIT_SOURCE_ROW] = new DataRow(rdiI18n.ADMIT_SOURCE, function(
			recordData) {
		return recordData.ENCNTR.ADMIT_SOURCE;
	}, true);

	dataRows[dataRowIndices.DISCHARGE_DATE_ROW] = new DataRow(rdiI18n.DISCHARGE_DATE, function(
			recordData) {
		return formatTime(recordData.ENCNTR.DISCHARGE_DATE);
	}, true);

	dataRows[dataRowIndices.DISCHARGE_DISPOSITION_ROW] = new DataRow(rdiI18n.DISCHARGE_DISPOSITION,
			function(recordData) {
				return recordData.ENCNTR.DISCHARGE_DISPOSITION;
			}, true);

	dataRows[dataRowIndices.DISCHARGE_LOCATION_ROW] = new DataRow(rdiI18n.DISCHARGE_LOCATION,
			function(recordData) {
				return recordData.ENCNTR.DISCHARGE_LOCATION;
			}, true);

	dataRows[dataRowIndices.DECEASED_DATE_ROW] = new DataRow(rdiI18n.DECEASED_DATE, function(
			recordData) {
		return formatTime(recordData.PERSON.DECEASED_DATE);
	}, true);

	dataRows[dataRowIndices.CAUSE_OF_DEATH_ROW] = new DataRow(rdiI18n.CAUSE_OF_DEATH, function(
			recordData) {
		return recordData.PERSON.CAUSE_OF_DEATH;
	}, true);
	
	dataRows[dataRowIndices.BIRTH_NUMBER] = new DataRow(rdiI18n.BIRTH_NUMBER, function(
			recordData) {
		return recordData.PERSON.BIRTH_NUMBER;
	}, false);
	
	dataRows[dataRowIndices.DEATH_NUMBER] = new DataRow(rdiI18n.DEATH_NUMBER, function(
			recordData) {
		return recordData.PERSON.DEATH_NUMBER;
	}, false);
	
	dataRows[dataRowIndices.NATIONAL_HEALTH_NUMBER] = new DataRow(rdiI18n.NATIONAL_HEALTH_NUMBER, function(
			recordData) {
		return recordData.PERSON.NATIONAL_HEALTH_NUMBER;
	}, false);

	/**
	 * Generates HTML for the value of the Length Of Stay column.
	 * 
	 * @param recordData
	 *            Record data containing the length of stay value.
	 */
	function generateLengthOfStayValueHTML(recordData) {
		var rowArray = [];
		if (recordData.ENCNTR.LENGTH_OF_STAY > 1) {
			rowArray.push(recordData.ENCNTR.LENGTH_OF_STAY + " <span class='" + nameSpace
					+ "-units'>" + rdiI18n.DAYS + "</span>");
		} else if (recordData.ENCNTR.LENGTH_OF_STAY == 1) {
			rowArray.push(recordData.ENCNTR.LENGTH_OF_STAY + " <span class='" + nameSpace
					+ "-units'>" + rdiI18n.DAY + "</span>");
		}
		return rowArray.join("");
	}

	dataRows[dataRowIndices.LENGTH_OF_STAY_ROW] = new DataRow(rdiI18n.LENGTH_OF_STAY,
			generateLengthOfStayValueHTML, true);
	this.dataRows = dataRows;
}

RegistrationDischargeInfoComponent.prototype = new MPageComponent();
RegistrationDischargeInfoComponent.prototype.constructor = MPageComponent;

/**
 * This function is used to load the filters that are associated to this component. Each filter
 * mapping is associated to one specific component setting. The filter mapping lets the MPages
 * architecture know which functions to call for each filter.
 */
RegistrationDischargeInfoComponent.prototype.loadFilterMappings = function() {

	/**
	 * Adds filter mappings for a dataRow to modify their enabled setting, their display name, and
	 * their display sequence order.
	 * 
	 * @param registrationDischargeInfoComponent
	 *            RegistrationDischargeInfoComponent the DataRow is attached to.
	 * @param dataRowsIndex
	 *            Index of DataRow to be modified.
	 * @param filterNamePrefix
	 *            By convention, a unique prefix used to identify the filter mappings for the given
	 *            dataRow.
	 */
	function addFilterMappings(registrationDischargeInfoComponent, dataRowsIndex, filterNamePrefix) {
		registrationDischargeInfoComponent
				.addFilterMappingObject(
						filterNamePrefix + "_IS_ENABLED",
						{
							setFunction : registrationDischargeInfoComponent.dataRows[dataRowsIndex].setEnabled,
							type : "BOOLEAN",
							field : "FREETEXT_DESC"
						});

		registrationDischargeInfoComponent
				.addFilterMappingObject(
						filterNamePrefix + "_DISPLAY_NAME",
						{
							setFunction : registrationDischargeInfoComponent.dataRows[dataRowsIndex].setDisplayName,
							type : "STRING",
							field : "FREETEXT_DESC"
						});

		registrationDischargeInfoComponent
				.addFilterMappingObject(
						filterNamePrefix + "_DISPLAY_SEQ",
						{
							setFunction : registrationDischargeInfoComponent.dataRows[dataRowsIndex].setDisplaySequence,
							type : "STRING",
							field : "FREETEXT_DESC"
						});
	}
	addFilterMappings(this, this.dataRowIndices.ENCOUNTER_TYPE_ROW, "HIM_ENC_TYPE");
	addFilterMappings(this, this.dataRowIndices.ATTENDING_PHYSICIAN_ROW, "HIM_ATTEND_PHYS");
	addFilterMappings(this, this.dataRowIndices.FACILITY_ROW, "HIM_FACILITY");
	addFilterMappings(this, this.dataRowIndices.PAYER_ROW, "HIM_PAYER");
	addFilterMappings(this, this.dataRowIndices.SECONDARY_PAYER_ROW, "HIM_SECOND_PAYER");
	addFilterMappings(this, this.dataRowIndices.REGISTRATION_DATE_ROW, "HIM_REG_DATE");
	addFilterMappings(this, this.dataRowIndices.ADMIT_DATE_ROW, "HIM_ADMIT_DATE");
	addFilterMappings(this, this.dataRowIndices.ADMIT_SOURCE_ROW, "HIM_ADMIT_SOURCE");
	addFilterMappings(this, this.dataRowIndices.DISCHARGE_DATE_ROW, "HIM_DISCHG_DATE");
	addFilterMappings(this, this.dataRowIndices.DISCHARGE_DISPOSITION_ROW, "HIM_DISCHG_DISP");
	addFilterMappings(this, this.dataRowIndices.DISCHARGE_LOCATION_ROW, "HIM_DISCHG_LOC");
	addFilterMappings(this, this.dataRowIndices.DECEASED_DATE_ROW, "HIM_DATE_DEATH");
	addFilterMappings(this, this.dataRowIndices.CAUSE_OF_DEATH_ROW, "HIM_CAUSE_DEATH");
	addFilterMappings(this, this.dataRowIndices.LENGTH_OF_STAY_ROW, "HIM_LENGTH_STAY");
	addFilterMappings(this, this.dataRowIndices.BIRTH_NUMBER, "HIM_BIRTH_NUMBER");
	addFilterMappings(this, this.dataRowIndices.DEATH_NUMBER, "HIM_DEATH_NUMBER");
	addFilterMappings(this, this.dataRowIndices.NATIONAL_HEALTH_NUMBER, "HIM_NHN");

	this.addFilterMappingObject(
			"HIM_VIP_IS_ENABLED",
			{
				setFunction : this.vipHeader.setEnabled,
				type : "BOOLEAN",
				field : "FREETEXT_DESC"
			});
};

/**
 * This is the RegistrationDischargeInfoComponent implementation of the retrieveComponentData
 * function. It creates the necessary parameter array for the data acquisition script call and the
 * associated Request object. This function will be called from the MPages architecture when it is
 * ready for the component to render its content.
 */
RegistrationDischargeInfoComponent.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), this.getCriterion().category_mean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
		
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("him_mp_get_reg_dsch_info");
	scriptRequest.setParameterArray(["^MINE^", criterion.person_id+".0", criterion.encntr_id+".0"]);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};

/**
 * This is the RegistrationDischargeInfoComponent implementation of the renderComponent function. It
 * takes the information retrieved from the script call and renders the component's visuals.
 * 
 * @param {MP_Core.ScriptReply}
 *            The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack
 *            function in the retrieveComponentData function of this object.
 */
RegistrationDischargeInfoComponent.prototype.renderComponent = function(reply) {
	var nameSpace = this.getStyles().getNameSpace();

	/**
	 * Compares two DataRows by their displaySequence variable.
	 * 
	 * @param dataRow1
	 *            First DataRow to compare.
	 * @param dataRow2
	 *            Second DataRow to compare.
	 * 
	 * @return {Number}
	 *         <ul>
	 *         <li>1 if dataRow1 is greater in value.</li>
	 *         <li>-1 if dataRow1 is lesser in value.</li>
	 *         <li>0 if dataRow1 is equal in value.</li>
	 *         </ul>
	 */
	var compareDataRowsByDisplaySequence = function(dataRow1, dataRow2) {
		if (dataRow1.getDisplaySequence() > dataRow2.getDisplaySequence()) {
			return 1;
		} else if (dataRow1.getDisplaySequence() < dataRow2.getDisplaySequence()) {
			return -1;
		}
		return 0;
	}

	/**
	 * Generates an HTML used to render the readmission banner for the
	 * RegistrationDischargeInfoComponent.
	 * 
	 * @param readmissionIndicator
	 *            Indicates length of readmission (e.g. 24 hrs, 72 hrs).
	 * @param criterion
	 *            The Criterion which holds data used to build the banner.
	 * @return {String} HTML used to render the readmission banner for the component, and "" if not
	 *         applicable.
	 */
	var generateReadmissionBannerHTML = function(readmissionIndicator, criterion) {
		var rdiI18n = i18n.accesshim.him.RegistrationDischargeInfoComponent;

		iconImagePath = criterion.static_content.replace(/%5C/g, "\\");
		iconImagePath = iconImagePath.replace(/%20/g, " ");
		var bannerHTMLArray = [];
		if (readmissionIndicator && readmissionIndicator != "0") {
			bannerHTMLArray.push("<table class='rdi2014-banner' id='" + nameSpace
					+ "-banner-message-table'>");
			bannerHTMLArray.push("<tr><td class='" + nameSpace + "-banner-image'>");
			bannerHTMLArray.push('<img src="' + iconImagePath + '\\images\\4015_16.gif"/></td>');
			var readmissionHours = "";
			switch (readmissionIndicator) {
				case "1":
					readmissionHours = rdiI18n.READMISSION_24;
					break;
				case "2":
					readmissionHours = rdiI18n.READMISSION_72;
					break;
			}
			if (readmissionHours) {
				bannerHTMLArray.push("<td class='him-banner-text'>" + "<b>" + readmissionHours
						+ rdiI18n.READMISSION_HR_ADMISSION + "</b>" + rdiI18n.READMISSION_MSG_1
						+ readmissionHours + rdiI18n.READMISSION_MSG_2 + "</td>");
				bannerHTMLArray.push("</table></br>");
			}
		}
		return (bannerHTMLArray.join(""));
	}

	var mainHTMLArray = [];

	mainHTMLArray.push(generateReadmissionBannerHTML(reply.ENCNTR.READMISSION_IND, this
			.getCriterion()));
	mainHTMLArray.push("<table id='" + nameSpace + "-admt-dchg-table' class='" + nameSpace
			+ "-table'>");
	mainHTMLArray.push(this.vipHeader.generateHTML(reply));
	
	var orderedDataRowsArray = this.dataRows.sort(compareDataRowsByDisplaySequence);
	for (var index = 0; index < orderedDataRowsArray.length; index++) {
		mainHTMLArray.push(orderedDataRowsArray[index].generateRowHTML(reply));
	}

	mainHTMLArray.push("</table>");
	MP_Util.Doc.FinalizeComponent(mainHTMLArray.join(""), this);
};

MP_Util.setObjectDefinitionMapping("HIM_REG_DISCH_INFO",
		RegistrationDischargeInfoComponent);
