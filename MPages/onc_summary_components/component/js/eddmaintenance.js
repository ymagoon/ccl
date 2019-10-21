function EDDMaintenanceComponentStyle() {
	this.initByNamespace("edd");
}

EDDMaintenanceComponentStyle.inherits(ComponentStyle);

/**
 * The EDD Maintenance component will retrieve all EDD maintenance data
 * associated to the patient
 *
 * @param {Criterion} criterion
 */
function EDDMaintenanceComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new EDDMaintenanceComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.EDDMaintenance.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.EDDMaintenance.O1 - render component");
	this.setIncludeLineNumber(true);

	//flag for resource required
	this.setResourceRequired(true);

	EDDMaintenanceComponent.method("InsertData", function() {
		CERN_EDDMAINTENANCE_O1.GetEDDMaintenance(this);
	});
	EDDMaintenanceComponent.method("HandleSuccess", function(recordData) {
		CERN_EDDMAINTENANCE_O1.RenderComponent(this, recordData);
	});
	EDDMaintenanceComponent.method("RetrieveRequiredResources", function() {
		var patientGenderInfo = criterion.getPatientInfo().getSex();
		var eddi18n = i18n.discernabu.eddmaintenance_o1;
		if (patientGenderInfo === null) {
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>"+ eddi18n.GENDER_UNDEFINED +"</span></h3><span class='res-none'>"+ eddi18n.GENDER_UNDEFINED + "</span>";
			MP_Util.Doc.FinalizeComponent(messageHTML, this,"(0)");
			return;
		}

		var pregInfoObj = null;

		//Check to see if the pregnancyInfo Shared Resource is available to use
		pregInfoObj = MP_Resources.getSharedResource("pregnancyInfo");
		if(pregInfoObj && pregInfoObj.isResourceAvailable()) {
			this.InsertData();
		}
		else {
			//Kick off the pregnancyInfo data retrieval
			PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
			//This component already listens for the pregnancyInfoAvailable event so it will
			// load when the SharedResource is available.
		}
	});
	EDDMaintenanceComponent.method("openTab", function() {
		var criterion = this.getCriterion();
		var formObject = null;
		try {
			MP_Util.LogDiscernInfo(this, "PREGNANCY", "eddmaintenance.js", "openTab");
			formObject = window.external.DiscernObjectFactory('PREGNANCY');
		}
		catch(err) {
			MP_Util.LogError(err.name + " " + err.message);
			return;
		}
		if(!formObject) {
			MP_Util.LogError(i18n.DISCERN_ERROR);
			return;
		}

		var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
		var modified = false;
		try {
			if(pregInfoSR && pregInfoSR.isResourceAvailable()) {
				var pregInfoObj = pregInfoSR.getResourceData();
				modified = formObject.AddEDD(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
				if(modified) {
					//Refresh the pregnancy data.  This function will fire an event which will
					// refresh each component which uses this shared resource.
					PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
				}
			}
		}
		catch(error) {
			MP_Util.LogJSError(error, component, "edd-maintenance-o1.js", "getSharedResource");
		}

		//release pregnancy object
		formObject = null;
	});

	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.InsertData, this);
}

EDDMaintenanceComponent.inherits(MPageComponent);

/**
 * EDDMaintenance methods
 * @namespace CERN_EDDMAINTENANCE_O1
 * @static
 * @global
 * @dependencies Script: MP_PREG_EDD_MAINT
 */
var CERN_EDDMAINTENANCE_O1 = function() {
	//global variables
	var eddMaintenancei18n = i18n.discernabu.eddmaintenance_o1;
	return {
		GetEDDMaintenance : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var eddi18n = i18n.discernabu.eddmaintenance_o1;
			var messageHTML = "";
			var pregInfoObj = null;
			var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			var pregnancyId = 0.0;

			//Check to make sure the patient is a female with an active pregnancy
			if(criterion.getPatientInfo().getSex().meaning !== "FEMALE") {
				//Male patient so just show a disclaimer
				messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + eddi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + eddi18n.NOT_FEMALE + "</span>";
				MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
				return;
			}
			else if(pregInfoSR && pregInfoSR.isResourceAvailable()) {
				pregInfoObj = pregInfoSR.getResourceData();
				pregnancyId = pregInfoObj.getPregnancyId();
				if(pregnancyId === -1) {
					//Error occurred while retrieving pregnancy information
					messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + eddi18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>" + eddi18n.PREG_DATA_ERROR + "</span>";
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					return;
				}
				else if(!pregnancyId) {
					//Female patient with no active pregnancy.  Show disclaimer and give the option
					// to add a pregnancy
					messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + eddi18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + eddi18n.NO_ACTIVE_PREG + "</span>";
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					return;
				}
				else {
					//Female patient with an open pregnancy so render the component
					sendAr.push("^MINE^", pregnancyId);
					MP_Core.XMLCclRequestWrapper(component, "MP_PREG_EDD_MAINTS", sendAr, true);
					return;
				}
			}
		},
		RenderComponent : function(component, recordData) {

			var countText = "";
			var criterion = component.getCriterion();
			var jsEddHTML = [];
			var eddHTML = "";
			var dateTime = new Date();
			var eddMaintenanceArray = recordData.QUAL;
			var eddGesAge = 0;
			var egaWeeks = 0;
			var egaDays = 0;
			var eddDate = "";
			var docDate = "";
			var confDate = "";
			var eddId = 0;
			var compId = component.getComponentId();

			var getFormattedDateTime = function FormatDate(dateThatNeedsFormating, dtTmFormatterFlag) {
				var dateFormat = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var dateTime = new Date();
				dateTime.setISO8601(dateThatNeedsFormating);
				if(dtTmFormatterFlag === 0) {//shortdate or shortdate3
					return dateFormat.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				}
				else if(dtTmFormatterFlag === 1) {//longdate with HH:MM -- longDateTime3
					return dateFormat.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				}
				else if(dtTmFormatterFlag === 2) {
					//full date, no time
					return dateFormat.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
				}
				else if(dtTmFormatterFlag === 3) {
					//full date, 4 year
					return dateFormat.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				}
			};
			//build the heading
			jsEddHTML.push("<dl class='edd-info-hdr hdr'><dd class='edd-status-hd'><span>", eddMaintenancei18n.STATUS, "</span></dd><dd class='edd-edd-hd'><span>", eddMaintenancei18n.EDD, "</span></dd><dd class='edd-ega-hd'><span>", eddMaintenancei18n.EGA_ON_METHOD_DT, "</span></dd><dd class='edd-method-hd'><span>", eddMaintenancei18n.METHOD, "</span></dd><dd class='edd-methoddt-hd'><span>", eddMaintenancei18n.METHOD_DATE, "</span></dd></dl><div class='", MP_Util.GetContentClass(component, eddMaintenanceArray.length), "'>");

			for(var i = 0, eddArrLen = eddMaintenanceArray.length; i < eddArrLen; i++) {
				var dateInQuestion = (eddMaintenanceArray[i].DATE_IN_QUESTION === 1) ? "edd-status-pic" : "";
				eddGesAge = eddMaintenanceArray[i].EST_GEST_AGE_DAYS;
				egaWeeks = Math.floor(eddGesAge / 7);
				egaDays = eddGesAge % 7;
				eddDate = getFormattedDateTime(eddMaintenanceArray[i].EST_DELIVERY_DT_TM, 2);
				docDate = getFormattedDateTime(eddMaintenanceArray[i].ENTERED_DT_TM, 1);
				methodDate = getFormattedDateTime(eddMaintenanceArray[i].METHOD_DT_TM, 2);
				methodDateFullYear = getFormattedDateTime(eddMaintenanceArray[i].METHOD_DT_TM, 3);
				pregEstId = eddMaintenanceArray[i].PREGNANCY_ESTIMATE_ID;

				jsEddHTML.push("<dl class='edd-info'><dd class='edd-status'><span class='"+dateInQuestion+"'>",eddMaintenanceArray[i].STATUS_DISPLAY,"</span></dd><dd class='edd-edd'><span class='edd-date'>",eddDate,"</span><a id = 'modifyEDD_"+i+"_"+compId+"' class='edd-modify' ><span >",eddMaintenancei18n.MODIFY_EDD,"</span></a></dd>");

				//populate data under the EGA
				if(egaDays === 0) {
					jsEddHTML.push("<dd class='edd-ega'><span>", egaWeeks, "&nbsp;", eddMaintenancei18n.WEEKS, "</span></dd>");
				}
				else {
					jsEddHTML.push("<dd class='edd-ega'><span>", egaWeeks, "</span>&nbsp;<span>", egaDays, "</span>/7&nbsp;", eddMaintenancei18n.WEEKS, "<dd>");
				}

				var description = [];
				if(eddMaintenanceArray[i].ULTRASOUND_MEASUREMENTS.length > 0) {
					description.push("<dt class='edd-result'><span>", eddMaintenancei18n.CROWN_RUMP, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].ULTRASOUND_MEASUREMENTS[0].CROWN_RUMP, "&nbsp", eddMaintenancei18n.CM, "</span></dd>", "<dt class='edd-result'><span>", eddMaintenancei18n.BIPARIETAL_DIAMETER, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].ULTRASOUND_MEASUREMENTS[0].BIPARIETAL_DIAMETER, "&nbsp", eddMaintenancei18n.CM, "</span></dd>", "<dt class='edd-result'><span>", eddMaintenancei18n.HEAD_CIRCUMFERENCE, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].ULTRASOUND_MEASUREMENTS[0].HEAD_CIRCUMFERENCE, "&nbsp", eddMaintenancei18n.CM, "</span></dd>");
				}
				else {
					description.push("<dt class='edd-result'><span>", eddMaintenancei18n.DESCRIPTION, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].DESCRIPTION, "</span></dd>");
				}

				//populate data under method
				jsEddHTML.push("<dd class='edd-method'><span>", eddMaintenanceArray[i].METHOD_DISPLAY, "</span></dd><dd class='edd-methoddt'><span>", methodDate, "</span></dd></dl>", "<h4 class='det-hd'><span>", eddMaintenancei18n.EDDDETAILS, "</span></h4><div class='hvr'><dl class='edd-det'><dt class='edd-result'><span>", eddMaintenancei18n.STATUS, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].STATUS_DISPLAY, "</span></dd><dt class='edd-result'><span>", eddMaintenancei18n.METHOD_DATE, ":</span></dt><dd class='edd-det-type'><span>", methodDateFullYear, "</span></dd>", description.join(""), "<dt class='edd-result'><span>", eddMaintenancei18n.DOCUMENTED_BY, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].AUTHOR_NAME, "</span></dd><dt class='edd-result'><span>", eddMaintenancei18n.ENTERED_DATE, ":</span></dt><dd class='edd-det-type'><span>", docDate, "</span></dd><dt class='edd-result'><span>", eddMaintenancei18n.COMMENTS, ":</span></dt><dd class='edd-det-type'><span>", eddMaintenanceArray[i].COMMENT, "</span></dd></dl></div>");
			}
			//close the GetContentClass div
			jsEddHTML.push("</div>");
			eddHTML = jsEddHTML.join("");
			countText = MP_Util.CreateTitleText(component, eddMaintenanceArray.length);
			MP_Util.Doc.FinalizeComponent(eddHTML, component, countText);
		
			// Creates the Modify click callback extension for the EDD column which invokes Win32 component of EDD Maintenance
			var rootNode = component.getRootComponentNode();
			$(rootNode).find('.edd-modify').click(function() {
				var modifyEDDiDLink = this.id;
				var modifyEDDiD = modifyEDDiDLink.split("_")[1];
				var index = parseInt(modifyEDDiD, 10);
				pregEstId = eddMaintenanceArray[index].PREGNANCY_ESTIMATE_ID;
				
				// Open win32 component of EDD Maintenance 
				CERN_EDDMAINTENANCE_O1.modifyEddMaintenanceResult(criterion.person_id, criterion.encntr_id, pregEstId, component.getComponentId());
			});
		},
		modifyEddMaintenanceResult : function(person_id, encounter_id, pregnanceEst_id, componentId) {
			var eddMaintenanceFormObject = null;
			var component = MP_Util.GetCompObjById(componentId);
			try {
				eddMaintenanceFormObject = window.external.DiscernObjectFactory('PREGNANCY');
				MP_Util.LogDiscernInfo(null, "PREGNANCY", "eddmaintenance.js", "modifyEddMaintenanceResult");
			}
			catch(err) {
				MP_Util.LogError(eddMaintenancei18n.DISCERN_OBJ_FACTORY_FAILURE + ': ' + err.name + ' ' + err.message);
				return;
			}
			if(!eddMaintenanceFormObject || eddMaintenanceFormObject === null) {
				MP_Util.LogError(eddMaintenancei18n.PREG_FORM_OBJ_FAILURE);
				return false;
			}
			var success = false;
			try {
				success = eddMaintenanceFormObject.ModifyEDD(window, person_id, encounter_id, pregnanceEst_id);

				if(success) {
					//Refresh the pregnancy data.  This function will fire an event which will
					// refresh each component which uses this shared resource.
					PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(component.getCriterion());
				}
			}
			catch(error) {
				MP_Util.LogJSError(error, component, "edd-maintenance-o1.js", "modifyEddMaintenanceResult");
			}
			//release pregnancy object
			eddMaintenanceFormObject = null;
		}
	};
}();
