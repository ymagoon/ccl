/**
 * @class
 */
function PregnancyOverviewComponentStyle() {
	this.initByNamespace("po");
}

PregnancyOverviewComponentStyle.inherits(ComponentStyle);

/**
 * Overview component
 *
 * @class
 * @param {Criterion}
 *            criterion
 */
function PregnancyOverviewComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PregnancyOverviewComponentStyle());

	this.setComponentLoadTimerName("USR:MPG.PregnancyOverviewComponent.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PregnancyOverviewComponent.O1 - render component");

	// flag for resource required
	this.setResourceRequired(true);

	PregnancyOverviewComponent.method("InsertData", function() {
		retrieveGroups(this);
		CERN_PREG_OVERVIEW_O1.GetOverview(this);
	});
	
	PregnancyOverviewComponent.method("HandleSuccess", function(recordData) {
		CERN_PREG_OVERVIEW_O1.RenderComponent(this, recordData);
	});
	
	PregnancyOverviewComponent.method("RetrieveRequiredResources", function() {
		this.setGender();
		var poi18n = i18n.discernabu.pregnancyoverview_o1;
		if (this.getGender() === "") {
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>"+ poi18n.GENDER_UNDEFINED +"</span></h3><span class='res-none'>"+ poi18n.GENDER_UNDEFINED + "</span>";
			MP_Util.Doc.FinalizeComponent(messageHTML, this,"(0)");
			return;
		}
		var pregInfoObj = null;

		// Check to see if the pregnancyInfo object is available to use
		pregInfoObj = MP_Resources.getSharedResource("pregnancyInfo");
		if (pregInfoObj && pregInfoObj.isResourceAvailable()) {
			this.InsertData();
		}
		else {
			// Kick off the pregnancyInfo data retrieval
			PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
			// This component already listens for the pregnancyInfoAvailable
			// event so it will
			// load when the SharedResource is available.
		}
	});
	PregnancyOverviewComponent.method("setGravida", function(value) {
		this.m_gravida = value;
	});
	PregnancyOverviewComponent.method("getGravida", function() {
		return this.m_gravida;
	});
	PregnancyOverviewComponent.method("setPara", function(value) {
		this.m_para = value;
	});
	PregnancyOverviewComponent.method("getPara", function() {
		return this.m_para;
	});
	PregnancyOverviewComponent.method("setParaAbort", function(value) {
		this.m_paraAbort = value;
	});
	PregnancyOverviewComponent.method("getParaAbort", function() {
		return this.m_paraAbort;
	});
	PregnancyOverviewComponent.method("setParaPremature", function(value) {
		this.m_paraParaPremature = value;
	});
	PregnancyOverviewComponent.method("getParaPremature", function() {
		return this.m_paraParaPremature;
	});
	PregnancyOverviewComponent.method("setParaFullTerm", function(value) {
		this.m_paraFullTerm = value;
	});
	PregnancyOverviewComponent.method("getParaFullTerm", function() {
		return this.m_paraFullTerm;
	});
	PregnancyOverviewComponent.method("setLiving", function(value) {
		this.m_living = value;
	});
	PregnancyOverviewComponent.method("getLiving", function() {
		return this.m_living;
	});
	PregnancyOverviewComponent.method("setMulitBirths", function(value) {
		this.m_multiBirths = value;
	});
	PregnancyOverviewComponent.method("getMultiBirths", function() {
		return this.m_multiBirths;
	});
	PregnancyOverviewComponent.method("setEctopic", function(value) {
		this.m_ectopic = value;
	});
	PregnancyOverviewComponent.method("getEctopic", function() {
		return this.m_ectopic;
	});
	PregnancyOverviewComponent.method("setSpontAbort", function(value) {
		this.m_spontAbort = value;
	});
	PregnancyOverviewComponent.method("getSpontAbort", function() {
		return this.m_spontAbort;
	});
	PregnancyOverviewComponent.method("setInducedAbort", function(value) {
		this.m_inducedAbort = value;
	});
	PregnancyOverviewComponent.method("getInducedAbort", function() {
		return this.m_inducedAbort;
	});
	PregnancyOverviewComponent.method("setPrePregWeight", function(value) {
		this.m_prePregWeight = value;
	});
	PregnancyOverviewComponent.method("getPrePregWeight", function() {
		return this.m_prePregWeight;
	});
	PregnancyOverviewComponent.method("setHeight", function(value) {
		this.m_height = value;
	});
	PregnancyOverviewComponent.method("getHeight", function() {
		return this.m_height;
	});
	PregnancyOverviewComponent.method("setBMI", function(value) {
		this.m_bmi = value;
	});
	PregnancyOverviewComponent.method("getBMI", function() {
		return this.m_bmi;
	});
	PregnancyOverviewComponent.method("setABORhType", function(value) {
		this.m_aborhType = value;
	});
	PregnancyOverviewComponent.method("getABORhType", function() {
		return this.m_aborhType;
	});
	PregnancyOverviewComponent.method("setBloodType", function(value) {
		this.m_bloodType = value;
	});
	PregnancyOverviewComponent.method("getBloodType", function() {
		return this.m_bloodType;
	});
	PregnancyOverviewComponent.method("setRhType", function(value) {
		this.m_rhType = value;
	});
	PregnancyOverviewComponent.method("getRhType", function() {
		return this.m_rhType;
	});
	PregnancyOverviewComponent.method("setCurrentWeight", function(value) {
		this.m_curWeight = value;
	});
	PregnancyOverviewComponent.method("getCurrentWeight", function() {
		return this.m_curWeight;
	});
	PregnancyOverviewComponent.method("setFeeding", function(value) {
		this.m_feeding = value;
	});
	PregnancyOverviewComponent.method("getFeeding", function() {
		return this.m_feeding;
	});
	PregnancyOverviewComponent.method("getLabResults", function() {
		return this.m_labResults || [];
	});
	PregnancyOverviewComponent.method("setLabResults", function(value) {
		this.m_labResults = value;
	});
	PregnancyOverviewComponent.method("getAdditionalResults", function() {
		return this.m_additionalResults || [];
	});
	PregnancyOverviewComponent.method("setAdditionalResults", function(value) {
		this.m_additionalResults = value;
	});
	PregnancyOverviewComponent.method("getDemographicsTab", function() {
		return this.m_showDemographicsTab;
	});
	PregnancyOverviewComponent.method("setDemographicsTab", function(value) {
		this.m_showDemographicsTab = value;
	});
	PregnancyOverviewComponent.method("getROMDateTime", function() {
		return this.m_romData;
	});
	PregnancyOverviewComponent.method("setROMDateTime", function(value) {
		this.m_romData = value;
	});
	PregnancyOverviewComponent.method("getROMAbnormalAlert", function() {
		return this.m_romColorFlip;
	});
	PregnancyOverviewComponent.method("setROMAbnormalAlert", function(value) {
		this.m_romColorFlip = value;
	});
	PregnancyOverviewComponent.method("getFetalDeath", function() {
		return this.m_fetalDeath;
	});
	PregnancyOverviewComponent.method("setFetalDeath", function(value) {
		this.m_fetalDeath = value;
	});
	PregnancyOverviewComponent.method("getFatherOfBaby", function() {
		return this.m_fatherOfBaby;
	});
	PregnancyOverviewComponent.method("setFatherOfBaby", function(value) {
		this.m_fatherOfBaby = value;
	});
	/*
	 * Set the Patient Gender Information.If the Patient Gender is undefined set Gender as empty
	 * else set the defined Gender during patient Registration.
	 * 
	 */
	PregnancyOverviewComponent.method("setGender", function() {
		var patientGenderInfo = criterion.getPatientInfo().getSex();
		if (patientGenderInfo === null) {
			this.m_gender = "";	
		}
		else{
			this.m_gender = criterion.getPatientInfo().getSex().meaning;
		}

	});
	PregnancyOverviewComponent.method("getGender", function() {
		return this.m_gender;
	});
	
	PregnancyOverviewComponent.method("refresh", function() {
		var contentNode = this.getSectionContentNode();
		contentNode.innerHTML = "";
		PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
	});

	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.InsertData, this);

	/**
	 * Creates the filterMappings that will be used when loading the component's
	 * bedrock settings
	 */

	function retrieveGroups(component) {
		var groups = component.getGroups();
		for (var x = groups.length; x--; ) {
			var group = groups[x];
			switch (group.getGroupName()) {
				case "PREG_LAB_RESULTS":
					component.setLabResults(group.getEventSets());
					break;
				case "PREG_ADDITIONAL_INFO":
					component.setAdditionalResults(group.getEventSets());
					break;
			}
		}
	}

}

PregnancyOverviewComponent.prototype = new MPageComponent();
PregnancyOverviewComponent.prototype.constructor = MPageComponent;

PregnancyOverviewComponent.prototype.loadFilterMappings = function() {

	// Add the filter mapping object for the Demographics Tab
	this.addFilterMappingObject("PREG_DEMO_TAB_IND", {
		setFunction : this.setDemographicsTab,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	// Add the filter mapping object for the ROM Event Code
	this.addFilterMappingObject("PREG_ROM_DT_TM", {
		setFunction : this.setROMDateTime,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	
	// Add the filter mapping object for the ROM Color Flip
	this.addFilterMappingObject("PREG_ROM_ABNORMAL_ALERT", {
		setFunction : this.setROMAbnormalAlert,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	//Add the filter mapping object for the Fetal Death.
	this.addFilterMappingObject("PREG_OVERVIEW_FETAL_DEATH", {
		setFunction : this.setFetalDeath,
		type : "NUMBER",
		field : "FREETEXT_DESC"
	});
	
	//Add the filter mapping object for Father of baby.
	this.addFilterMappingObject("PREG_OVERVIEW_FOB", {
		setFunction : this.setFatherOfBaby,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};

MP_Util.setObjectDefinitionMapping("PREG_OVERVIEW", PregnancyOverviewComponent);
/**
 * Pregnancy Overview methods
 *
 * @namespace
 */
var CERN_PREG_OVERVIEW_O1 = function() {
	
	function updateComponentMenu(component, pregInfoObj) {
		//create/update menu items
		var compId = component.getComponentId();
		var poi18n = i18n.discernabu.pregnancyoverview_o1;
		var menuOptionNames = component.getMenuOptionNames();
		var menuOptions = component.getMenuOptions();
		var optionCnt = menuOptionNames.length;
		var option = null;
		var reopenInd = pregInfoObj.getReopenPregInd();
		var pregId = pregInfoObj.getPregnancyId();

		if (optionCnt) {
			for (var x = optionCnt; x--; ) {
				switch (menuOptionNames[x]) {
					case "cancelPreg" + compId:
					case "closePreg" + compId:
					case "modifyPreg" + compId:
						option = menuOptions[menuOptionNames[x]];
						option.isMenuDithered = (pregId > 0.0) ? false : true;
						option.ditherOnLoad = (pregId > 0.0) ? false : true;
						option.fn = (pregId > 0.0) ? function() {
							pregAction(component, this);
						} : function() {
						};
						break;
					case "addPreg" + compId:
						option = menuOptions[menuOptionNames[x]];
						option.isMenuDithered = (pregId > 0.0) ? true : false;
						option.ditherOnLoad = (pregId > 0.0) ? true : false;
						option.fn = (pregId > 0.0) ? function() {
						} : function() {
							PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(0);
						};
						break;
					case "reopenPreg" + compId:
						option = menuOptions[menuOptionNames[x]];
						option.isMenuDithered = (pregId > 0.0 || !reopenInd) ? true : false;
						option.ditherOnLoad = (pregId > 0.0 || !reopenInd) ? true : false;
						option.fn = (pregId > 0.0 || !reopenInd) ? function() {
						} : function() {
							PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(1);
						};
						break;
				}
			}
			component.createMenu();
		}
		else {
			if (!pregId) {
				component.addMenuOption("cancelPreg" + compId, "cancelPreg" + compId, poi18n.CANCEL_PREGNANCY, true, "click", function() {
				});
				component.addMenuOption("closePreg" + compId, "closePreg" + compId, poi18n.CLOSE_PREGNANCY, true, "click", function() {
				});
				component.addMenuOption("modifyPreg" + compId, "modifyPreg" + compId, poi18n.MODIFY_PREGNANCY, true, "click", function() {
				});
				if (component.getGender() !== "FEMALE") {
					//Male patient, so make sure all options are dithered
					component.addMenuOption("addPreg" + compId, "addPreg" + compId, poi18n.ADD_PREGNANCY, true, "click", function() {
					});
					component.addMenuOption("reopenPreg" + compId, "reopenPreg" + compId, poi18n.REOPEN_PREGNANCY, true, "click", function() {
					});
				}
				else {
					//Female patient, give the option to add and/or reopen
					component.addMenuOption("addPreg" + compId, "addPreg" + compId, poi18n.ADD_PREGNANCY, false, "click", function() {
						PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(0);
					});
					if (reopenInd) {
						component.addMenuOption("reopenPreg" + compId, "reopenPreg" + compId, poi18n.REOPEN_PREGNANCY, false, "click", function() {
							PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(1);
						});
					}
				}

			}
			else {
				component.addMenuOption("cancelPreg" + compId, "cancelPreg" + compId, poi18n.CANCEL_PREGNANCY, false, "click", function() {
					pregAction(component, this);
				});
				component.addMenuOption("closePreg" + compId, "closePreg" + compId, poi18n.CLOSE_PREGNANCY, false, "click", function() {
					pregAction(component, this);
				});
				component.addMenuOption("modifyPreg" + compId, "modifyPreg" + compId, poi18n.MODIFY_PREGNANCY, false, "click", function() {
					pregAction(component, this);
				});
				component.addMenuOption("addPreg" + compId, "addPreg" + compId, poi18n.ADD_PREGNANCY, true, "click", function() {
				});
				component.addMenuOption("reopenPreg" + compId, "reopenPreg" + compId, poi18n.REOPEN_PREGNANCY, true, "click", function() {
				});
			}
			component.createMenu();
		}
	}

	function pregAction(component, element) {
		var oI18n = i18n.discernabu.pregnancyoverview_o1;
		var criterion = component.getCriterion();
		var actionType = element.id.replace("Preg" + component.getComponentId(), "");
		var formObject = null;
		var pregInfoObj = null;
		var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
		
		try {
			formObject = window.external.DiscernObjectFactory("PREGNANCY");
			MP_Util.LogDiscernInfo(null, "PREGNANCY", "pregnancyoverview.js", "RenderComponent");
		}
		catch (err) {
			MP_Util.LogError(oI18n.ERROR_DOF + err.name + " " + err.message);
			return;
		}
		if (!formObject) {
			MP_Util.LogError(oI18n.ERROR_CREATE);
			return;
		}
		//Pregnancy action methods
		try {
			var modified = false;
			var cancel_close = false;
			pregInfoObj = pregInfoSR.getResourceData();
			if (pregInfoObj) {
				switch (actionType) {
					case "modify":
						modified = formObject.ModifyPregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
						break;
					case "close":
						cancel_close = formObject.ClosePregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
						break;
					case "cancel":
						cancel_close = formObject.CancelPregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
						break;
				}
				if (modified || cancel_close) {
					//Refresh the pregnancy data.  This function will fire an event which will
					// refresh each component which uses this shared resource.
					PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
				}
			}
		}
		catch (error) {
			MP_Util.LogError(oI18n.ERROR_EXCEPTION + " - " + error.name + " - " + error.message);
		}
		//release pregnancy object
		formObject = null;
	}
	
	return {
		GetOverview : function(component) {
			var sendAr = [];
			var compId = component.getComponentId();
			var criterion = component.getCriterion();
			var encntrs = null;
			var encntrStr = "";
			var events = [];
			var lookback = 0;
			var messageHTML = "";
			var poi18n = i18n.discernabu.pregnancyoverview_o1;
			var pregInfoObj = null;
			var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			var pregnancyId = 0.0;
			pregInfoObj = pregInfoSR.getResourceData();
			pregnancyId = pregInfoObj.getPregnancyId();
			var gestAgeInDays = pregInfoObj.getCalculatedEga();
			var gestAgeDays =  '"' + gestAgeInDays + '"';
			// Check to make sure the patient is a female with an active
			// pregnancy
			if (component.getGender() !== "FEMALE") {
				// Male patient so just show a disclaimer
				messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + poi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + poi18n.NOT_FEMALE + "</span>";
				updateComponentMenu(component, pregInfoObj);
				MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
				return;
			}
			else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
				if (pregnancyId === -1) {
					// Error occurred while retrieving pregnancy information
					messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + poi18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>" + poi18n.PREG_DATA_ERROR + "</span>";
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					return;
				}
				else if (!pregnancyId) {
					// Female patient with no active pregnancy. Show disclaimer
					// and give the option as face-up && menu options
					// to add a pregnancy
					var reopenInd = pregInfoObj.getReopenPregInd();
					var noPregMenuItems = [];
					noPregMenuItems.push("<table class='po-no-preg-menu-items'><tbody>");
					noPregMenuItems.push("<tr><td><div class='po-preg-menu-item'><a id='addPreg" + compId + "' class='value-with-link'>" + poi18n.ADD_PREGNANCY + "</a></div></td>");
					if(reopenInd){
						noPregMenuItems.push("<td><div class='po-preg-menu-item'><a id='reOpenPreg" + compId + "' class='value-with-link'>" + poi18n.REOPEN_PREGNANCY + "</a></div></td></tr>");
					}
					noPregMenuItems.push("</tbody></table>");					
					messageHTML = noPregMenuItems.join("");										
					messageHTML += "<h3 class='info-hd'><span class='res-normal'>" + poi18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + poi18n.NO_ACTIVE_PREG + "</span>";
					updateComponentMenu(component, pregInfoObj);
		
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					
					// Event for clicking link actions
					var sectionContentNode = component.getSectionContentNode();
					$(sectionContentNode).find('.value-with-link').click(function() {
						try {
							if (this.id == "addPreg" + compId) {
								PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(0);
							}
							if (this.id == "reOpenPreg" + compId) {
								PREGNANCY_BASE_UTIL_O1.addOrReopenPregnancy(1);
							}
						}
						catch (err) {
							MP_Util.LogError(oI18n.ERROR_EXCEPTION + " - " + err.name + " - " + err.message);
						}
					});
					return;
				}
				else {
					// Get the list of viewable encounters
					encntrs = criterion.getPersonnelInfo().getViewableEncounters();
					encntrStr = (encntrs) ? 'value(' + encntrs + ')' : "0";
					lookback = pregInfoObj.getLookBack();
					sendAr.push("^MINE^", criterion.person_id + ".0", encntrStr, pregnancyId, criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", lookback);
					events = [component.getGravida(), component.getPara(), component.getParaAbort(), component.getParaPremature(), component.getParaFullTerm(), component.getLiving(), component.getMultiBirths(), component.getEctopic(), component.getSpontAbort(), component.getInducedAbort(), component.getPrePregWeight(), component.getHeight(), component.getBMI(), component.getRhType(), component.getABORhType(), component.getBloodType(), component.getCurrentWeight(), component.getFeeding(), component.getLabResults(), component.getAdditionalResults(), component.getROMDateTime(),component.getFatherOfBaby()];
					for (var i = 0, l = events.length; i < l; i++) {
						sendAr.push(MP_Util.CreateParamArray(events[i], 1));
					}
					if (component.getFetalDeath()) {
						sendAr.push(gestAgeDays, component.getFetalDeath());
					}
					MP_Core.XMLCclRequestWrapper(component, "mp_get_preg_overview", sendAr, true);
				}
			}
		},
		RenderComponent : function(component, recordData) {
			var df = MP_Util.GetDateFormatter();
			var nf = MP_Util.GetNumericFormatter();
			var oI18n = i18n.discernabu.pregnancyoverview_o1;
			var contentId = component.getStyles().getContentId();
			var rootId = component.getStyles().getId();
			var criterion = component.getCriterion();
			var curPregTable = ["<table class='overview-table'>"];
			var patientPhoneDisplay = "";
			var ecPhoneDisplay = "";
			var pcpPhoneDisplay = "";
			var rowCount = 0;
			var i = 0;
			var j = 0;
			var k = 0;

			// Clear the existing component data before rendering more.
			jQuery("#" + contentId).html(' ');

			// Get the pregnancyInfo SharedResource
			var pregInfoObj = null;
			var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
				pregInfoObj = pregInfoSR.getResourceData();
			}

			// Get patient delivery status (is delivered or not) and EGA from pregnancy object
			var hasPatientDelivered = pregInfoObj.isPatientDelivered();
			var gestAgeInDays = pregInfoObj.getCalculatedEga();
			var egaWeeks = Math.floor(gestAgeInDays / 7);
			var egaDays = (gestAgeInDays % 7);
			var graphExtend = 40;

			if (egaWeeks > graphExtend) {
				graphExtend = egaWeeks;
				while (graphExtend % 4 !== 0) {
					graphExtend++;
				}
			}

			// If patient is not delivered show EGA in "XX Weeks, YY Days"
			var egaDisplay = "--";
			if (!hasPatientDelivered) {
				egaDisplay = (gestAgeInDays > 0) ? oI18n.EGA_FORMATTED.replace("{0}", egaWeeks).replace("{1}", egaDays) : "";
			}
			else {
				// If patient is delivered show EGA as "Delivered".
				egaDisplay = oI18n.DELIVERED;
			}

			var eddDateDisplay = "";
			var eddDisplayWithStatus = oI18n.ADD_EDD;
			var eddDetailData = [];
			var eddAction = "";
			var unknownEDDStyle = "";

			var showDemographicsTab = component.getDemographicsTab();

			function formatNumber(num) {
				var resultDisplay;
				try {
					resultDisplay = nf.format(num);
				}
				catch (err) {
					resultDisplay = num;
				}
				return resultDisplay;
			}

			function generateRow(n) {
				function generateCells(item) {
					var label = (!item) ? "&nbsp;" : item.LABEL + ": ";
					var value = (!item) ? "&nbsp;" : (item.VALUE === undefined || item.VALUE === "") ? "--" : item.VALUE;
					var style = (!item) ? "value" : (item.STYLE === undefined || item.STYLE === "") ? "value" : item.STYLE;
					var units = (!item) ? "&nbsp;" : item.UNITS === undefined ? "" : item.UNITS;
					var hoverHTML = "";

					// if it exists, invoke the hover generating callback for
					// this item
					if (item && item.HOVER_DATA && item.HOVER_DATA.length > 0 && item.VALUE !== "") {
						hoverHTML = item.HOVER_FXN(item.HOVER_DATA);
					}

					var dttm = value.indexOf("{date_value}");
					if (dttm > -1) {
						value = df.formatISO8601(value.substr(dttm + 12), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					}

					if (column4.length > 0) {
						if (item && item.ACTION) {
							return "<td class='label4'>" + label + "</td><td id='" + item.ACTION + "' class='value-with-link4 " + style + "4'><a>" + value + "</a>" + hoverHTML + "</td>";
						}

						return "<td class='label4'>" + label + "</td><td class='" + style + "4'>" + value + units + hoverHTML + "</td>";
					} else {
						if (item && item.ACTION) {
							return "<td class='label'>" + label + "</td><td id='" + item.ACTION + "' class='value-with-link " + style + "'><a>" + value + "</a>" + hoverHTML + "</td>";
						}

						return "<td class='label'>" + label + "</td><td class='" + style + "'>" + value + hoverHTML + "</td>";
					}
				}

				var rowHTML;
				if (column4.length > 0) {
					rowHTML = "<tr>" + generateCells(column1[n]) + generateCells(column2[n]) + generateCells(column3[n]) + generateCells(column4[n]) + "</tr>";
				}
				else {
					rowHTML = "<tr>" + generateCells(column1[n]) + generateCells(column2[n]) + generateCells(column3[n]) + "</tr>";
				}
				curPregTable.push(rowHTML);
			}

			// generic detail hover generating callback that expects an array of
			// objects
			// with LABEL and VALUE properties
			function generateDetails(detailData) {
				var i = 0;
				if (detailData.length === 0) {
					return "";
				}

				var detailsHTML = [];
				for ( i = 0; i < detailData.length; i++) {
					var separator = detailData[i].VALUE === "" ? "" : ": ";
					detailsHTML.push("<dt><span>" + detailData[i].LABEL + separator + "</span></dt><dd><span>" + detailData[i].VALUE + "</span></dd>");
				}

				return "<div class='hvr'><dl>" + detailsHTML.join("") + "</dl><div>";
			}

			function generateContactRow(n) {
				function generateCells(item) {
					var label = (!item) ? "&nbsp;" : item.LABEL + ":";
					var value = (!item) ? "&nbsp;" : (item.VALUE === undefined || item.VALUE === "") ? "--" : item.VALUE;
					var hoverHTML = "";

					// if it exists, invoke the hover generating callback for
					// this item
					if (item && item.HOVER_DATA && item.VALUE !== "") {
						hoverHTML = item.HOVER_FXN(item.HOVER_DATA);
					}

					return "<td class='label'>" + label + "</td><td class='value'><span>" + value + "</span>" + hoverHTML + "</td>";
				}

				var col1 = generateCells(patientContactCol[n]);
				var col2 = generateCells(emergContactCol[n]);
				var col3 = generateCells(pcpContactCol[n]);
				var rowHTML = "<tr>" + col1 + col2 + col3 + "</tr>";
				contactTableHTML.push(rowHTML);
			}

			function generateDemographicsRow(n) {
				function generateCells(item) {
					var label = (!item) ? "&nbsp;" : item.LABEL + ":";
					var value = (!item) ? "&nbsp;" : (item.VALUE === undefined || item.VALUE === "") ? "--" : item.VALUE;
					var hoverHTML = "";
					var raceClass = (label === oI18n.RACE+":") ? "po-race" : "";
					// if it exists, invoke the hover generating callback for
					// this item
					if (item && item.HOVER_DATA && item.VALUE !== "") {
						hoverHTML = item.HOVER_FXN(item.HOVER_DATA);
					}
					var style = (!item) ? "" : (item.STYLE === undefined || item.STYLE === "") ? "" : item.STYLE;
					var demographicsRowHTML = "<td class='label'>" + label + "</td><td class='value'><span class='" + style + "'>" + value + "</span>" + hoverHTML + "</td>";
					return demographicsRowHTML;
				}

				var col1 = generateCells(patientDemographics1[n]);
				var col2 = generateCells(patientDemographics2[n]);
				var rowHTML = "<tr>" + col1 + col2 + "</tr>";
				demographicsTableHTML.push(rowHTML);
			}

			if (pregInfoObj.getEstDeliveryDate()) {
				eddDateDisplay = df.formatISO8601(pregInfoObj.getEstDeliveryDate(), mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
				var status;
				switch (recordData.DEDDSTATUS) {
					case 0:
						status = oI18n.NON_AUTHORITATIVE;
						break;
					case 1:
						status = oI18n.INITIAL;
						break;
					case 2:
						status = oI18n.AUTHORITATIVE;
						break;
					case 3:
						status = oI18n.FINAL;
						break;
					case 4:
						status = oI18n.INITIAL_FINAL;
						break;
					default:
						status = oI18n.UNKNOWN;
				}
				eddDisplayWithStatus = eddDateDisplay + " (" + status + ")";

				var docDateDisplay = (recordData.SESTDATE !== "") ? df.formatISO8601(recordData.SESTDOCUMENTEDDATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) : "";

				eddDetailData.push({
					LABEL : oI18n.EDD,
					VALUE : eddDateDisplay
				});
				eddDetailData.push({
					LABEL : oI18n.EGA,
					VALUE : egaDisplay
				});
				eddDetailData.push({
					LABEL : oI18n.STATUS,
					VALUE : status
				});
				eddDetailData.push({
					LABEL : oI18n.CONFIRMATION,
					VALUE : recordData.SESTCONFIRMATIONSTATUS
				});
				eddDetailData.push({
					LABEL : oI18n.METHOD,
					VALUE : recordData.SESTMETHOD
				});
				eddDetailData.push({
					LABEL : oI18n.ENTERED_DATE,
					VALUE : docDateDisplay
				});

				if (recordData.ULTRASOUND_MEASUREMENTS.length > 0) {
					eddDetailData.push({
						LABEL : oI18n.CROWN_RUMP_LENGTH,
						VALUE : formatNumber(recordData.ULTRASOUND_MEASUREMENTS[0].CROWN_RUMP)
					});
					eddDetailData.push({
						LABEL : oI18n.BIPARIETAL_DIAMETER,
						VALUE : formatNumber(recordData.ULTRASOUND_MEASUREMENTS[0].BIPARIETAL_DIAMETER)
					});
					eddDetailData.push({
						LABEL : oI18n.HEAD_CIRCUMFERENCE,
						VALUE : formatNumber(recordData.ULTRASOUND_MEASUREMENTS[0].HEAD_CIRCUMFERENCE)
					});
				}
				else {
					var descriptionFlag = recordData.DESTDESCRIPTIONFLAG;
					var description = [];
					if (descriptionFlag & 1) {
						description.push(oI18n.NORMAL_AMT);
					}
					if (descriptionFlag & 2) {
						description.push(oI18n.ABNORMAL_AMT);
					}
					if (descriptionFlag & 4) {
						description.push(oI18n.DATE_APPROX);
						unknownEDDStyle = "edd-status-pic";
					}
					if (descriptionFlag & 8) {
						description.push(oI18n.DATE_DEFINITE);
					}
					if (descriptionFlag & 16) {
						description.push(oI18n.DATE_UNKNOWN);
						unknownEDDStyle = "edd-status-pic";
					}
					if (recordData.SESTDESCRIPTIONOTHER !== "") {
						description.push(recordData.SESTDESCRIPTIONOTHER);
					}
					eddDetailData.push({
						LABEL : oI18n.DESCRIPTION,
						VALUE : description.join(", ")
					});
				}

				eddDetailData.push({
					LABEL : oI18n.DOCUMENTED_BY,
					VALUE : recordData.SESTAUTHOR
				});
				eddDetailData.push({
					LABEL : oI18n.COMMENTS,
					VALUE : recordData.SESTCOMMENTS
				});
			}
			else {
				// Patient has no edd so give user the option to add one
				eddAction = "Add";
			}

			var gravidaDetails = [];
			gravidaDetails.push({
				LABEL : oI18n.ECTOPIC,
				VALUE : recordData.LECTOPIC
			});
			gravidaDetails.push({
				LABEL : oI18n.SPON_ABORT,
				VALUE : recordData.LSPONTANEOUSABORTIONS
			});
			gravidaDetails.push({
				LABEL : oI18n.INDUCED_ABORT,
				VALUE : recordData.LINDUCEDABORTIONS
			});
			gravidaDetails.push({
				LABEL : oI18n.MULT_BIRTH_PREG,
				VALUE : recordData.LMULTIPLEBIRTH
			});
			gravidaDetails.push({
				LABEL : oI18n.GRAVIDA,
				VALUE : recordData.LGRAVIDA
			});
			gravidaDetails.push({
				LABEL : oI18n.PARA_FULL_TERM,
				VALUE : recordData.LPARAFULLTERM
			});
			gravidaDetails.push({
				LABEL : oI18n.PARA_PRE_TERM,
				VALUE : recordData.LPARAPREMATURE
			});
			gravidaDetails.push({
				LABEL : oI18n.ABORTIONS,
				VALUE : recordData.LPARAABORTIONS
			});
			gravidaDetails.push({
				LABEL : oI18n.LIVING,
				VALUE : recordData.LLIVING
			});

			var gravidaDisplay = oI18n.G + recordData.LGRAVIDA + "," + oI18n.P + recordData.LPARA + "(" + recordData.LPARAFULLTERM + "," + recordData.LPARAPREMATURE + "," + recordData.LPARAABORTIONS + "," + recordData.LLIVING + ")";
			var column1 = [];
			
			var multiFetus = "";
			
			switch (recordData.DMULTIPLEPREGNANCY) {
				case 0: 
					multiFetus = oI18n.NO + ".";
					break;
				case 1: 
					multiFetus = oI18n.NO + ", " + oI18n.SINGLETON;
					break;
				case 2:  
					multiFetus = oI18n.YES + ", " + oI18n.TWINS;
					break;
				case 3:  
					multiFetus = oI18n.YES + ", " + oI18n.TRIPLETS;
					break;
				case 4:  
					multiFetus = oI18n.YES + ", " + oI18n.QUADRUPLETS;
					break;
				case 5:  
					multiFetus = oI18n.YES + ", " + oI18n.QUINTUPLETS;
					break;
				case 6:  
					multiFetus = oI18n.YES + ", " + oI18n.SEXTUPLETS;
					break;
				case 7:  
					multiFetus = oI18n.YES + ", " + oI18n.SEPTUPLETS;
					break;
				case 8:  
					multiFetus = oI18n.YES + ", " + oI18n.OCTUPLETS;
					break;
				case 9:  
					multiFetus = oI18n.YES + ", " + oI18n.NONUPLETS;
					break;
				case 10: 
					multiFetus = oI18n.YES + ", " + oI18n.DECAPLETS;
					break;
				default: multiFetus=oI18n.YES+".";
		}

			var eddLabel = oI18n.EDD;
			
			if(unknownEDDStyle !== "")
			{
				column1.push({
					LABEL : eddLabel,
					VALUE : eddDisplayWithStatus,
					HOVER_DATA : eddDetailData,
					HOVER_FXN : generateDetails,
					ACTION : eddAction,
					STYLE : unknownEDDStyle
				});
			}
			else {
				column1.push({
					LABEL : eddLabel,
					VALUE : eddDisplayWithStatus,
					HOVER_DATA : eddDetailData,
					HOVER_FXN : generateDetails,
					ACTION : eddAction
				});
			}
			column1.push({
				LABEL : oI18n.EGA,
				VALUE : egaDisplay
			});
			column1.push({
				LABEL : oI18n.GRAVIDA_PARITY,
				VALUE : gravidaDisplay,
				HOVER_DATA : gravidaDetails,
				HOVER_FXN : generateDetails,
				ACTION : "Histories",
				STYLE: "po-gravida"
			});
			
			var fetalDeathDetails = [];
			var multiFetusDeath = "";
			var fetalDeathLength = recordData.FETALDEATH.length;
			
			switch (recordData.DTOTALFETUSES) {
			case 0:
				multiFetusDeath = oI18n.NO + ".";
				break;
			case 1:
				multiFetusDeath = oI18n.SINGLETON;
				break;
			case 2:
				multiFetusDeath = oI18n.TWINS;
				break;
			case 3:
				multiFetusDeath = oI18n.TRIPLETS;
				break;
			case 4:
				multiFetusDeath = oI18n.QUADRUPLETS;
				break;
			case 5:
				multiFetusDeath = oI18n.QUINTUPLETS;
				break;
			case 6:
				multiFetusDeath = oI18n.SEXTUPLETS;
				break;
			case 7:
				multiFetusDeath = oI18n.SEPTUPLETS;
				break;
			case 8:
				multiFetusDeath = oI18n.OCTUPLETS;
				break;
			case 9:
				multiFetusDeath = oI18n.NONUPLETS;
				break;
			case 10:
				multiFetusDeath = oI18n.DECAPLETS;
				break;
			default:
				multiFetusDeath = ".";
			}
			
			fetalDeathDetails.push({
				LABEL :  oI18n.MULT_FETUS,
				VALUE : multiFetus
			});
			
			fetalDeathDetails.push({
				LABEL : oI18n.TOTAL_FETUSES,
				VALUE : multiFetusDeath
			});
			for (i = 0; i < fetalDeathLength; i++) {
				var egaResult = "";
				var eddGesAge = 0;
				eddGesAge = recordData.FETALDEATH[i].DAYS;
				egaWeeks = Math.floor(eddGesAge / 7);
				egaDays = eddGesAge % 7;

				fetalDeathDetails.push({
					LABEL : oI18n.FETAL_DEATH.replace("{0}",
							recordData.FETALDEATH[i].LABEL + " :").replace("{1}",
							egaWeeks).replace("{2}", egaDays),
					VALUE : ""
				});
			}	
			column1.push({
				LABEL : oI18n.MULT_FETUS,
				VALUE : multiFetus,
				HOVER_DATA : fetalDeathDetails,
				HOVER_FXN : generateDetails,
				ACTION : "Histories",
				STYLE : "po-gravida"
			});
			column1.push({
				LABEL : oI18n.FEEDING_PLAN,
				VALUE : recordData.SFEEDING
			});

			var curWeight = (recordData.SPATIENTWEIGHT > 0) ? formatNumber(recordData.SPATIENTWEIGHT) + recordData.SPATIENTWEIGHTUNITS : "";
			var prePregWeight = (recordData.SPATIENTPREPREGWEIGHT > 0) ? formatNumber(recordData.SPATIENTPREPREGWEIGHT) + recordData.SPATIENTPREPREGWEIGHTUNITS : "";
			var height = (recordData.SPATIENTHEIGHT > 0) ? formatNumber(recordData.SPATIENTHEIGHT) + recordData.SPATIENTHEIGHTUNITS : "";
			var bmi = (recordData.SPATIENTBMI > 0) ? formatNumber(recordData.SPATIENTBMI) + recordData.SPATIENTBMIUNITS : "";
			var prePregBMI;

			if (recordData.SPATIENTHEIGHTUNITS == "in") {
				// (lb/in^2)*703
				prePregBMI = (recordData.SPATIENTPREPREGWEIGHT / (recordData.SPATIENTHEIGHT * recordData.SPATIENTHEIGHT)) * 703;
				prePregBMI = Math.round(prePregBMI * 100) / 100;
			}
			else {
				// (kg/m^2)
				var prePregHeight = recordData.SPATIENTHEIGHT / 100;
				prePregBMI = recordData.SPATIENTPREPREGWEIGHT / (prePregHeight * prePregHeight);
				prePregBMI = Math.round(prePregBMI * 100) / 100;
			}

			var column2 = [];
			column2.push({
				LABEL : oI18n.CUR_WEIGHT,
				VALUE : curWeight,
				ACTION : "po-displayGraph",
				STYLE: "po-curWeight"
			});
			column2.push({
				LABEL : oI18n.PREPREG_WEIGHT,
				VALUE : prePregWeight
			});
			column2.push({
				LABEL : oI18n.HEIGHT,
				VALUE : height
			});
			column2.push({
				LABEL : oI18n.BMI,
				VALUE : bmi
			});

			var column3 = [];
			
			var blood = "";
			var bloodStyle = "";			
			//initialize blood
			if (recordData.SPATIENTBLOODTYPE!=="") {
				blood = recordData.SPATIENTBLOODTYPE;
			}			
			else if (recordData.SPATIENTABO !=="" && recordData.SPATIENTRHFACTOR !=="") {
					blood = recordData.SPATIENTABO.concat(recordData.SPATIENTRHFACTOR);
			}
	
			//changes bloodStyle to negative
			if (recordData.SPATIENTBLOODTYPE !=="") {
				var bloodTypeCaps = recordData.SPATIENTBLOODTYPE.toUpperCase();
				if(bloodTypeCaps.match(oI18n.NEGATIVE) || bloodTypeCaps.match(oI18n.NEG) ||	bloodTypeCaps.match(oI18n.N) ||	recordData.SPATIENTBLOODTYPE.match("-")){
							bloodStyle = "po-blood-type-rh-negative";
				}		
			}
			
			else if (recordData.SPATIENTRHFACTOR !=="") {
				var RHFactorCaps = recordData.SPATIENTRHFACTOR.toUpperCase();
				if (RHFactorCaps.match(oI18n.NEGATIVE)|| RHFactorCaps.match(oI18n.NEG) || RHFactorCaps.match(oI18n.N) ||recordData.SPATIENTRHFACTOR.match("-")) {
							bloodStyle = "po-blood-type-rh-negative";
				}
			}
	
			//pushes blood value to column
			if(bloodStyle !== ""){
				column3.push({
					LABEL : oI18n.BLOOD_TYPE,				
					VALUE : blood,
					STYLE : bloodStyle
				});
			} else {
				column3.push({
				LABEL : oI18n.BLOOD_TYPE,				
				VALUE : blood
				});
			}				
				
			/* Code added for ROM Duration */
			//Check to see if the ROM Date/Time exist for the patient
			 if(recordData.ROMDATETIME.length > 0){
				 var romData = [];
				 var noOfRoms = recordData.ROMDATETIME.length;
				 romData.push({
						LABEL : oI18n.ROM_DATE_TIME, 
						VALUE : ''
					 });
				 for(i=0; i<noOfRoms; i++){
					 romData.push({
						LABEL : (recordData.ROMDATETIME[i].DATE) ? df.formatISO8601(recordData.ROMDATETIME[i].DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "", //format the date
						VALUE : recordData.ROMDATETIME[i].DYNAMIC_LABEL
					 });
				 }

				 var firstRom=new Date();
				 firstRom.setISO8601(recordData.ROMDATETIME[0].DATE);
				 var curDate = new Date();
				 var romDuration = 0.0;
				 if (hasPatientDelivered) {
					 var deliveryDate = new Date();
					 deliveryDate.setISO8601(pregInfoObj.getDeliveryDate());
					  romDuration = Math.abs(deliveryDate.getTime() - firstRom.getTime());
				 }
				 else{
					  romDuration = Math.abs(curDate.getTime() - firstRom.getTime()); 
				 }
				 var hours =  romDuration / (1000 * 60 * 60);	
				 var minutes = (hours - Math.floor(hours)) * 60;

				 var value = [];
				 value.push(Math.floor(hours) + ' ' + oI18n.HOURS);
				 value.push(Math.floor(minutes) + ' '+ oI18n.MINUTES);
				 
				 var romStyle = '';
				 var flipROMColor = component.getROMAbnormalAlert();
				 if (flipROMColor && hours>=12) {
					 romStyle = "po-rom-abnormal-duration";
				 }
				 if(romStyle !== ''){
					 column3.push({
							LABEL : oI18n.ROM_DURATION,
							VALUE : value.join(" "),
							HOVER_DATA : romData,
							HOVER_FXN : generateDetails,
				            STYLE : romStyle
						});
				 }
				 else {
					 column3.push({
							LABEL : oI18n.ROM_DURATION,
							VALUE : value.join(" "),
							HOVER_DATA : romData,
							HOVER_FXN : generateDetails
						});
				 }

			 }
						
			//pushing the labs elements that are configured in bedrock, in the correct sequence
			var lSeqs = component.getLabResults();
			for (i = 0; i < lSeqs.length; i++) {
				for (j = 0; j < recordData.LABS.length; j++) {
					if (lSeqs[i] === recordData.LABS[j].ESID) {
						column3.push(recordData.LABS[j]);
					}
				}
			}
			//pushing the additional elements that are configured in bedrock, in the correct sequence
			var column4 = [];
			var aSeqs = component.getAdditionalResults();
			for (i = 0; i < aSeqs.length; i++) {
				for (j = 0; j < recordData.ADDITIONAL.length; j++) {
					if (aSeqs[i] === recordData.ADDITIONAL[j].ESID) {
						column4.push(recordData.ADDITIONAL[j]);
					}
				}
			}

			// generate as many rows as the needed for the column with the most
			// items
			if (column4.length > 0) {
				rowCount = Math.max(column1.length, column2.length, column3.length, column4.length);
			}
			else {
				rowCount = Math.max(column1.length, column2.length, column3.length);
			}

			for ( i = 0; i < rowCount; i++) {
				generateRow(i);
			}

			curPregTable.push("</table>");
			var curPregTableHTML = curPregTable.join("");

			// Generate the HTML table for the contacts tab
			var patientPhones = [];
			for ( i = 0; i < recordData.PATIENTPHONES.length; i++) {
				patientPhones.push({
					LABEL : recordData.PATIENTPHONES[i].SPHONENUMBERTYPE,
					VALUE : recordData.PATIENTPHONES[i].SPHONENUMBER
				});
			}
			if (patientPhones.length > 0) {
				patientPhoneDisplay = recordData.PATIENTPHONES[0].SPHONENUMBER;
			}

			var ecPhones = [];
			for ( i = 0; i < recordData.ECPHONES.length; i++) {
				ecPhones.push({
					LABEL : recordData.ECPHONES[i].SPHONENUMBERTYPE,
					VALUE : recordData.ECPHONES[i].SPHONENUMBER
				});
			}
			if (ecPhones.length > 0) {
				ecPhoneDisplay = recordData.ECPHONES[0].SPHONENUMBER;
			}

			var pcpPhones = [];
			for ( i = 0; i < recordData.PCPPHONES.length; i++) {
				pcpPhones.push({
					LABEL : recordData.PCPPHONES[i].SPHONENUMBERTYPE,
					VALUE : recordData.PCPPHONES[i].SPHONENUMBER
				});
			}
			if (pcpPhones.length > 0) {
				pcpPhoneDisplay = recordData.PCPPHONES[0].SPHONENUMBER;
			}

			var patientContactCol = [];
			patientContactCol.push({
				LABEL : oI18n.ADDRESS,
				VALUE : recordData.SPATIENTADDRESS
			});
			patientContactCol.push({
				LABEL : oI18n.CITY,
				VALUE : recordData.SPATIENTCITY
			});
			patientContactCol.push({
				LABEL : oI18n.STATE,
				VALUE : recordData.SPATIENTSTATE
			});
			patientContactCol.push({
				LABEL : oI18n.ZIP,
				VALUE : recordData.SPATIENTZIP
			});
			patientContactCol.push({
				LABEL : oI18n.PHONE,
				VALUE : patientPhoneDisplay,
				HOVER_DATA : patientPhones,
				HOVER_FXN : generateDetails
			});
			patientContactCol.push({
				LABEL : oI18n.EMAIL,
				VALUE : recordData.SPATIENTEMAIL
			});

			var emergContactCol = [];
			emergContactCol.push({
				LABEL : oI18n.NAME,
				VALUE : recordData.SECNAME
			});
			emergContactCol.push({
				LABEL : oI18n.RELATIONSHIP,
				VALUE : recordData.SECRELATIONSHIP
			});
			emergContactCol.push({
				LABEL : oI18n.PHONE,
				VALUE : ecPhoneDisplay,
				HOVER_DATA : ecPhones,
				HOVER_FXN : generateDetails
			});
			emergContactCol.push({
				LABEL : oI18n.EMAIL,
				VALUE : recordData.SECEMAIL
			});

			var pcpContactCol = [];
			pcpContactCol.push({
				LABEL : oI18n.NAME,
				VALUE : recordData.SPCPNAME
			});
			pcpContactCol.push({
				LABEL : oI18n.PHONE,
				VALUE : pcpPhoneDisplay,
				HOVER_DATA : pcpPhones,
				HOVER_FXN : generateDetails
			});
			pcpContactCol.push({
				LABEL : oI18n.EMAIL,
				VALUE : recordData.SPCPEMAIL
			});

			var contactTableHTML = [];
			// Create a separate table for the header so they will align better
			// over the
			// columns
			contactTableHTML.push("<table class='contact-table-header'><tr><td class='label'>" + oI18n.PATIENT + "</td><td class='label'>" + oI18n.EMERGENCY_CONTACT + "</td><td class='label'>" + oI18n.PRIMARY_PHYSICIAN + "</td></tr></table>");

			contactTableHTML.push("<table class='contact-table'>");
			rowCount = Math.max(patientContactCol.length, emergContactCol.length, pcpContactCol.length);
			for ( i = 0; i < rowCount; i++) {
				generateContactRow(i);
			}

			contactTableHTML.push("</table>");

			// Generate the HTML table for the demographics tab
			var dobDisplay = (recordData.SPATIENTDOB) ? df.formatISO8601(recordData.SPATIENTDOB, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR) : "";
			var raceHover = [];
			raceHover.push({LABEL:oI18n.RACE,VALUE:recordData.SPATIENTRACE});
			var patientdateOfBirth = new Date();
			patientdateOfBirth.setISO8601(recordData.SPATIENTDOB);
			var currentAge = MP_Util.CalcAge(patientdateOfBirth, null);
			
			var patientDemographics1 = [];
			patientDemographics1.push({
				LABEL : oI18n.AGE,
				VALUE : currentAge
			});
			// Returned with label appended (i.e. years)
			patientDemographics1.push({
				LABEL : oI18n.DOB,
				VALUE : dobDisplay
			});
			patientDemographics1.push({
				LABEL : oI18n.RACE,
				VALUE : recordData.SPATIENTRACE,
				HOVER_DATA:raceHover,
				HOVER_FXN:generateDetails,
				STYLE : "po-race po-fob-race-common"
			});
			patientDemographics1.push({
				LABEL : oI18n.ETHNICITY,
				VALUE : recordData.SPATIENTETHNICITY
			});
			patientDemographics1.push({
				LABEL : oI18n.LANGUAGE,
				VALUE : recordData.SPATIENTLANG
			});
			patientDemographics1.push({
				LABEL : oI18n.EDUCATION,
				VALUE : recordData.SPATIENTEDU
			});
			patientDemographics1.push({
				LABEL : oI18n.OCCUPATION,
				VALUE : recordData.SPATIENTOCCUPATION
			});

			var patientDemographics2 = [];
			var fobDetails = [];
			fobDetails.push({
				LABEL : oI18n.FOB,
				VALUE : recordData.SFATHEROFBABY
			});
			patientDemographics2.push({
				LABEL : oI18n.MARITAL_STATUS,
				VALUE : recordData.SPATIENTMARITALSTATUS
			});
			patientDemographics2.push({
				LABEL : oI18n.DOMESTIC_PARTNER,
				VALUE : recordData.SPATIENTDOMESTICPARTNER
			});
			patientDemographics2.push({
				LABEL : oI18n.FOB,
				VALUE : recordData.SFATHEROFBABY,
				HOVER_DATA : fobDetails,
				HOVER_FXN : generateDetails,
				STYLE : "po-fob po-fob-race-common"
			});
			patientDemographics2.push({
				LABEL : oI18n.INSURANCE,
				VALUE : recordData.SINSURANCE
			});

			var demographicsTableHTML = [];

			if (showDemographicsTab) {
				demographicsTableHTML.push("<table class='po-demographics-table'>");
				rowCount = Math.max(patientDemographics1.length, patientDemographics2.length);
				for ( i = 0; i < rowCount; i++) {
					generateDemographicsRow(i);
				}

				demographicsTableHTML.push("</table>");
			}

			function RemoveUndefinedFilters(array) {
				var events = [];
				var i = 0;
				for ( i = 0; i < array.length; i++) {
					if (!array[i]) {
						continue;
					}
					events.push(array[i]);
				}
				return events;
			}

			function placeholder(beg, end) {
				var str = "";
				var i = 0;
				for ( i = beg; i <= end; i++) {
					str += "&nbsp;";
				}
				return str;
			}

			// Build the HTML for the tab menu
			var tabMenuHTML = [];
			//Build the links for the face-up options
			var menuItems = [];
			menuItems.push('<table class="po-menu-items"><tbody>');
			
			var compId = component.getComponentId();
			var pregId = pregInfoObj.getPregnancyId();
			
			var link_class = "";
			if (column4.length > 0) {				
				 link_class = "value-with-link4";
			} else {
				 link_class = "value-with-link";
			}
			
			if (pregId) {
				menuItems.push("<tr><td><div class='po-preg-menu-item'><a id='menuCancelPreg" + compId + "' class='", link_class, "'>" + oI18n.CANCEL_PREGNANCY + "</a></div></td>");
				menuItems.push("<td><div class='po-preg-menu-item'><a id='menuClosePreg" + compId + "' class='", link_class, "'>" + oI18n.CLOSE_PREGNANCY + "</a></div></td>");
				menuItems.push("<td><div class='po-preg-menu-item'><a id='menuModifyPreg" + compId + "' class='", link_class, "'>" + oI18n.MODIFY_PREGNANCY + "</a></div></td></tr>");
				menuItems.push("</tbody></table>");
			}
			
			tabMenuHTML = menuItems.join("");
			
			if (showDemographicsTab) {
				tabMenuHTML += "<table><tr><td><ul class='po-tabmenu'><li><a id='overview-tab1' class='active' href=''>" + oI18n.CURRENT_PREG + placeholder(1, 12) + "</a></li><li><a id='overview-tab2' class='inactive' href=''>" + oI18n.CONTACT_INFO + placeholder(1, 19) + "</a></li><li><a id='overview-tab3' class='inactive' href=''>" + oI18n.DEMOGRAPHICS + placeholder(1, 15) + "</a></li></ul></td><td class='po-combo'></span></td>";
			}
			else {
				tabMenuHTML += "<table><tr><td><ul class='po-tabmenu'><li><a id='overview-tab1' class='active' href=''>" + oI18n.CURRENT_PREG + placeholder(1, 12) + "</a></li><li><a id='overview-tab2' class='inactive' href=''>" + oI18n.CONTACT_INFO + placeholder(1, 19) + "</a></li></ul></td><td class='po-combo'></span></td>";
			}
			
			jQuery("#" + contentId).append(tabMenuHTML);
			jQuery("#" + contentId).append("<div id='current-pregnancy-tab'>" + curPregTableHTML + "</div>");
			jQuery("#" + contentId).append("<div id='contact-info-tab' class='po-tab-inactive'>" + contactTableHTML.join("") + "</div>");
			jQuery("#" + contentId).append("<div id='demographics-tab' class='po-tab-inactive'>" + demographicsTableHTML.join("") + "</div>");
				
			updateComponentMenu(component, pregInfoObj);
			
			// Event for clicking link actions
			jQuery("." + link_class).click(function() {
				var formObject = null;

				if (this.id === "") {
					// Don't need to do anything
					return;
				}

				// Handle G/P link
				if (this.id === "Histories") {
					var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^Histories+^';
					// Does this need to be set in bedrock?
					APPLINK(0, criterion.executable, sParms);
					return;
				}
				
				// Handle Weight Graph link
				if (this.id === "po-displayGraph") {
					var graph = document.createElement('div');
					graph.setAttribute('id', 'displaybox' + compId);
					graph.setAttribute('class', 'po-displaybox');
					
					var graphHTML = "";
					
					/*
					 * Returns Pregnancy Overview graphhtml for different i18n text.
					 * @param {String}:i18n text
					 */
					var showPregnancyGraphMessage = function generateGraphHTML(oI18nText) {
						graphHTML = "<div class = 'po-graph-outerbox' id = 'graphOuterbox" + compId + "'>" + "<div class='po-no-graphbox-skin'>";
						graphHTML += "<p class = 'po-no-graph-data'>" + oI18nText + "</p>";
						graphHTML += "<a href='#' id='graphCloser" + compId + "' class='po-noGraph-close' title='"+oI18n.CLOSE+"'>X</a></div></div>";
						graph.innerHTML = graphHTML;
						document.body.appendChild(graph);
						closePregnancyGraph();
						};
                     
						/*
						 * Closes Pregnancy Overview Graph or Message window.
						 */
				    var closePregnancyGraph = function closePregnancyGraphEvent() {
						$("#graphCloser" + compId).click(function() {
							$("#displaybox" + compId).empty();
							var removeGraph = document.getElementById('displaybox' + compId);
							document.body.removeChild(graph);
							return;
						});
				    };
					
				    //Check for both Pre-Pregnancy weight and Height 
					if (recordData.SPATIENTPREPREGWEIGHT > 0 && recordData.SPATIENTHEIGHT > 0) {
						//Check for Current weight, if the Current weight is not documented then display a error message.
						if (recordData.SPATIENTWEIGHT <= 0) {
							showPregnancyGraphMessage(oI18n.NO_CURRENT_WEIGHT);
						}
						//Check whether EDD/EGA is added or not, if the EDD/EGA is not added then display a error message.
						else if(eddAction === "Add") {
							showPregnancyGraphMessage(oI18n.NO_EDD_FOR_GRAPH);
						}
						else {
							graphHTML = "<div class = 'po-graph-outerbox' id = 'graphOuterbox" + compId + "'>" + "<div class='po-graphbox-skin'>";
							graphHTML += "<div id='tableContents"+ compId + "' class = 'po-tableContents'></div>";
							graphHTML += "<div id='graphTitle" + compId + "' class = 'po-graphTitle'></div>";
							graphHTML += "<div id='graphContents" + compId + "' class = 'po-graphContents'></div></div>";
							graphHTML += "<a href='#' id='graphCloser" + compId + "' class='po-graph-close' title='"+oI18n.CLOSE+"'>X</a></div>";
							graph.innerHTML = graphHTML;
							document.body.appendChild(graph);
							closePregnancyGraph();
						}
						
					} 
					//if both Pre-Pregnancy weight and Height is not documented then display a error message.
					else {
						showPregnancyGraphMessage(oI18n.NO_DATA_FOR_GRAPH);
					}

					$("#displaybox" + compId).click(function(e) {
						e = e || window.event;
						var eventTarget = e.target || e.srcElement;

						if (eventTarget.id == "displaybox" + compId) {
							$("#displaybox" + compId).empty();
							var removeGraph = document.getElementById('displaybox' + compId);
							document.body.removeChild(removeGraph);
						}
						return;
					});

					if (recordData.SPATIENTPREPREGWEIGHT > 0 && recordData.SPATIENTHEIGHT > 0 && recordData.SPATIENTWEIGHT > 0 && eddAction !== "Add") {

						var title = oI18n.CUR_WEIGHT_GRAPH;
						var titleHover;
						var minRefCurve = [];
						var maxRefCurve = [];

						minRefCurve.push([0, 0]);
						minRefCurve.push([1, 0]);
						maxRefCurve.push([0, 0]);
						maxRefCurve.push([1, 0]);

						// Graph goes to 40 by default, more if
						// gestational weeks is more
						var extendReferenceCurve = graphExtend - 13;

						// Building arrays to use for reference
						// curves
						// Based on Pre-Pregnancy BMI
						if (prePregBMI > 0) {
							if (prePregBMI < 18.5) {
								title = oI18n.PREPREG_UNDERWEIGHT;
								titleHover = oI18n.WEIGHT_GAIN_RECOMMENDATIONS + "  (" + oI18n.SINGLETON + "):" + "</br>2.2 &mdash; 6.6 " + oI18n.POUNDS + ' ' + oI18n.GAIN + " (" + oI18n.FIRST + ' ' + oI18n.TRIMESTER + ")" + "</br>1 " + oI18n.POUND + ' ' + oI18n.GAIN + "/" + oI18n.WEEK + " (" + oI18n.SECOND + " & " + oI18n.THIRD + ' ' + oI18n.TRIMESTER + ")" + "</br>28 &mdash; 40 " + oI18n.POUNDS + ' ' + oI18n.TOTAL_WEIGHT_GAIN;

								for (i = 0; i <= 10; i++) {
									j = (2.2 / 11.0) * i;
									minRefCurve.push([i + 2, j]);

									k = (6.6 / 11.0) * i;
									maxRefCurve.push([i + 2, k]);
								}
								for (i = 0; i <= extendReferenceCurve; i++) {
									j = (25.8 / 27.0) * i;
									minRefCurve.push([i + 13, j + 2.2]);

									k = (33.4 / 27.0) * i;
									maxRefCurve.push([i + 13, k + 6.6]);
								}
							}
							else if (prePregBMI >= 18.5 && prePregBMI < 25.0) {
								title = oI18n.PREPREG_NORMAL_WEIGHT;
								titleHover = oI18n.WEIGHT_GAIN_RECOMMENDATIONS + "  (" + oI18n.SINGLETON + "):" + "</br>2.2 &mdash; 6.6 " + oI18n.POUNDS + ' ' + oI18n.GAIN + " (" + oI18n.FIRST + ' ' + oI18n.TRIMESTER + ")" + "</br>1 " + oI18n.POUND + ' ' + oI18n.GAIN + "/" + oI18n.WEEK + " (" + oI18n.SECOND + " & " + oI18n.THIRD + ' ' + oI18n.TRIMESTER + ")" + "</br>25 &mdash; 35 " + oI18n.POUNDS + ' ' + oI18n.TOTAL_WEIGHT_GAIN;

								for (i = 0; i <= 10; i++) {
									j = (2.2 / 11.0) * i;
									minRefCurve.push([i + 2, j]);

									k = (6.6 / 11.0) * i;
									maxRefCurve.push([i + 2, k]);
								}
								for (i = 0; i <= extendReferenceCurve; i++) {
									j = (22.8 / 27.0) * i;
									minRefCurve.push([i + 13, j + 2.2]);

									k = (28.4 / 27.0) * i;
									maxRefCurve.push([i + 13, k + 6.6]);
								}
							}
							else if (prePregBMI >= 25.0 && prePregBMI < 30.0) {
								title = oI18n.PREPREG_OVERWEIGHT;
								titleHover = oI18n.WEIGHT_GAIN_RECOMMENDATIONS + "  (" + oI18n.SINGLETON + "):" + "</br>2.2 &mdash; 6.6 " + oI18n.POUNDS + ' ' + oI18n.GAIN + " (" + oI18n.FIRST + ' ' + oI18n.TRIMESTER + ")" + "</br>0.6 " + oI18n.POUND + ' ' + oI18n.GAIN + "/" + oI18n.WEEK + " (" + oI18n.SECOND + " & " + oI18n.THIRD + ' ' + oI18n.TRIMESTER + ")" + "</br>15 &mdash; 25  " + oI18n.POUNDS + ' ' + oI18n.TOTAL_WEIGHT_GAIN;

								for (i = 0; i <= 10; i++) {
									j = (2.2 / 11.0) * i;
									minRefCurve.push([i + 2, j]);

									k = (6.6 / 11.0) * i;
									maxRefCurve.push([i + 2, k]);
								}
								for (i = 0; i <= extendReferenceCurve; i++) {
									j = (12.8 / 27.0) * i;
									minRefCurve.push([i + 13, j + 2.2]);

									k = (18.4 / 27.0) * i;
									maxRefCurve.push([i + 13, k + 6.6]);
								}
							}
							else {
								title = oI18n.PREPREG_OBESE;
								titleHover = oI18n.WEIGHT_GAIN_RECOMMENDATIONS + "  (" + oI18n.SINGLETON + "):" + "</br>1.1 &mdash; 4.4  " + oI18n.POUNDS + ' ' + oI18n.GAIN + " (" + oI18n.FIRST + ' ' + oI18n.TRIMESTER + ")" + "</br>0.5 " + oI18n.POUND + ' ' + oI18n.GAIN + "/" + oI18n.WEEK + " (" + oI18n.SECOND + " & " + oI18n.THIRD + ' ' + oI18n.TRIMESTER + ")" + "</br>11 &mdash; 20  " + oI18n.POUNDS + ' ' + oI18n.TOTAL_WEIGHT_GAIN;

								for (i = 0; i <= 10; i++) {
									j = (1.1 / 11.0) * i;
									minRefCurve.push([i + 2, j]);

									k = (4.4 / 11.0) * i;
									maxRefCurve.push([i + 2, k]);
								}
								for (i = 0; i <= extendReferenceCurve; i++) {
									j = (10.9 / 27.0) * i;
									minRefCurve.push([i + 13, j + 1.1]);

									k = (15.6 / 27.0) * i;
									maxRefCurve.push([i + 13, k + 4.4]);
								}
							}
						}

						// Code to construct the Data table below the graph
						var weightChartTable = "<table class='po-weight-table' border='1'><tbody class='po-weight-body'>";
						weightChartTable += "<tr class='po-weight-body'><td class='po-weight-body'><b>" + oI18n.DATE;
						weightChartTable += "</b></td><td class='po-weight-body'><b>" + oI18n.GESTATION_WEEKS;
						weightChartTable += "</b></td><td class='po-weight-body'><b>" + oI18n.WEIGHT;
						weightChartTable += "</b></td><td class='po-weight-body'><b>" + oI18n.WEIGHT_CHANGE;
						weightChartTable += " +/-</b></td></tr>";
						
						var generateWeightCells = function (item) {
							var date = (!item) ? "&nbsp;" : item.DATE;
							var gestationWeeks = (!item) ? "&nbsp;" : item.GESTATION_WEEKS;
							var weight = (!item) ? "&nbsp;" : item.WEIGHT;
							var weightChange = (!item) ? "&nbsp;" : item.WEIGHT_CHANGE;

							var weightCellsHTML = "<tr class='po-weight-body'><td class='po-weight-body' style='width: 115px;'>";
							weightCellsHTML += date + "</td><td class='po-weight-body' style='width: 65px;'>" + gestationWeeks;
							weightCellsHTML += "</td><td class='po-weight-body' style='width: 90px;'>" + weight;
							weightCellsHTML += "</td><td class='po-weight-body'>" + weightChange + "</td></tr>";
							return weightCellsHTML;
						};

						var weightRows = [];
						var healthyWeightGain = [];
						var unhealthyWeightGain = [];
						var highestPoint = 45;
						var lowestPoint = -5;
						var prePregWtInLB, prePregWtInKG;
						var kgToLb = 2.20462;

						if (recordData.SPATIENTPREPREGWEIGHTUNITS == oI18n.KILOGRAM) {
							prePregWtInLB = recordData.SPATIENTPREPREGWEIGHT * kgToLb;
							prePregWtInKG = recordData.SPATIENTPREPREGWEIGHT;
						}
						else {
							prePregWtInLB = recordData.SPATIENTPREPREGWEIGHT;
							prePregWtInKG = recordData.SPATIENTPREPREGWEIGHT / kgToLb;
						}
						//Keeps track of the count of how many values are added to the weightRows array, and used this variable is used to call the generateWeightCells function.
						var weightRowToDisplay=0;
						for ( i = 0; i < recordData.SPREGWEIGHTS.length; i++) {
							var dtWeightMeasured=new Date();
							dtWeightMeasured.setISO8601(recordData.SPREGWEIGHTS[i].DTPATIENTPREGWEIGHTDATE);
							dtWeightDisplay = dtWeightMeasured.format("longDateTime3"); 
							var dtToday = new Date();
							var dtdifference = dtToday - dtWeightMeasured;
							var daysSince = Math.round(dtdifference / (1000 * 60 * 60 * 24));
							var gestDaysRecorded = gestAgeInDays - daysSince;

							if (gestDaysRecorded >= 0) {
								var gestWeeksRecorded = Math.floor(gestDaysRecorded / 7);

								var weightInKG, weightInLB;
								if (recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHTUNITS == oI18n.KILOGRAM) {
									weightInKG = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT;
									weightInLB = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT * kgToLb;
								}
								else {
									weightInKG = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT / kgToLb;
									weightInLB = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT;
								}

								var weightChangeRecordedInLB = weightInLB - prePregWtInLB;
								var weightChangeRecordedInKG = weightInKG - prePregWtInKG;
								weightInLB = Math.round(weightInLB * 100) / 100;
								weightInKG = Math.round(weightInKG * 100) / 100;
								weightChangeRecordedInLB = Math.round(weightChangeRecordedInLB * 100) / 100;
								weightChangeRecordedInKG = Math.round(weightChangeRecordedInKG * 100) / 100;

								weightRows.push({
									DATE : dtWeightDisplay,
									GESTATION_WEEKS : gestWeeksRecorded,
									WEIGHT : weightInLB + ' ' + oI18n.POUNDS + '<br/>(' + weightInKG + ' ' + oI18n.KILOGRAM + ')',
									WEIGHT_CHANGE : weightChangeRecordedInLB + ' ' + oI18n.POUNDS + '<br/>(' + weightChangeRecordedInKG + ' ' + oI18n.KILOGRAM + ')'
								});

								weightChartTable = weightChartTable + generateWeightCells(weightRows[weightRowToDisplay++]);

								var weeksMaxGain = maxRefCurve[gestWeeksRecorded][1];
								var weeksMinGain = minRefCurve[gestWeeksRecorded][1];

								if (weightChangeRecordedInLB > weeksMaxGain || weightChangeRecordedInLB < weeksMinGain) {
									unhealthyWeightGain.push([gestWeeksRecorded, weightChangeRecordedInLB]);
								}
								else {
									healthyWeightGain.push([gestWeeksRecorded, weightChangeRecordedInLB]);
								}

								while (weightChangeRecordedInLB >= highestPoint) {
									highestPoint += 5;
								}
								while (weightChangeRecordedInLB <= lowestPoint) {
									lowestPoint -= 5;
								}
							}
						}

						weightChartTable = weightChartTable + "</tbody></table>";
						var tableData = document.getElementById("tableContents" + compId);
						tableData.innerHTML = weightChartTable;

						var graphTitle = document.getElementById("graphTitle" + compId);
						graphTitle.innerHTML = title;
						graphTitle.onmouseover = function() {
							var textBox = document.createElement('div');
							textBox.id = "textBox" + compId;
							textBox.setAttribute('class', 'po-textBox');
							textBox.innerHTML = titleHover;
							document.getElementById("graphOuterbox" + compId).appendChild(textBox);
						};
						graphTitle.onmouseout = function() {
							var textBox = document.getElementById("textBox" + compId);
							document.getElementById("graphOuterbox" + compId).removeChild(textBox);
						};

						var plot3 = $.jqplot('graphContents' + compId, [maxRefCurve, minRefCurve, healthyWeightGain, unhealthyWeightGain], {
							// Series options
							// are specified as
							// an array of
							// objects, one
							// object for each
							// series.
							series : [{
								label : 'maxRefCurve',
								lineWidth : 1,
								markerOptions : {
									size : 0
								},
								color : '#666666'
							}, {
								label : 'minRefCurve',
								lineWidth : 1,
								markerOptions : {
									size : 0
								},
								color : '#666666'
							}, {
								label : 'healthyWeightGain',
								showLine : false,
								markerOptions : {
									size : 4,
									style : "circle"
								},
								color : '#0101DF'
							}, {
								label : 'unhealthyWeightGain',
								showLine : false,
								markerOptions : {
									size : 4,
									style : "circle"
								},
								xaxis : 'x2axis',
								yaxis : 'y2axis',
								color : '#FF0000'
							}],
							axes : {
								xaxis : {
									min : 0,
									max : graphExtend,
									tickInterval : 4,
									label : oI18n.WEEKS_OF_GESTATION,
									tickOptions : {
										formatString : '%d'
									}
								},
								yaxis : {
									min : lowestPoint,
									max : highestPoint,
									tickInterval : 5,
									label : oI18n.WEIGHT_CHANGE + "<br />" + ' (' + oI18n.POUNDS + ')',
									labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
									labelOptions : {
										angle : -90
									}
								},
								x2axis : {
									min : 0,
									max : graphExtend,
									tickInterval : 1,
									tickOptions : {
										showMark : false,
										showLabel : false
									}
								},
								y2axis : {
									min : lowestPoint,
									max : highestPoint,
									tickInterval : 1,
									tickOptions : {
										showMark : false,
										showLabel : false
									}
								}
							},
							cursor : {
								showTooltip : false
							}

						});
						
						// Applying 90% or 590px which ever is lower of the visible screen height to the graph box.
						var visibleHeightRegion = $(window.top).height()*90/100;
						if(visibleHeightRegion > 590) {
							visibleHeightRegion = 590;
						}
						
						var graphboxHeight = visibleHeightRegion + "px";
						$("#graphOuterbox" + compId + " .po-graphbox-skin").css("height",graphboxHeight);

						// code for hover text box for the
						// datapoints in the graph. The hover
						// information has been set in a
						// variable tooltipText

						$('#graphContents' + compId).bind('jqplotDataMouseOver', function(ev, seriesIndex, pointIndex, data) {
							var x = data[0];
							var y = data[1];
							var tooltipText = '';

							if (plot3.series[seriesIndex].label === 'maxRefCurve' || plot3.series[seriesIndex].label === 'minRefCurve') {
								tooltipText = '';
							}
							else if (plot3.series[seriesIndex].label === 'healthyWeightGain' || plot3.series[seriesIndex].label === 'unhealthyWeightGain') {
								var dateFound = 0;
								for ( i = 0; i < recordData.SPREGWEIGHTS.length; i++) {
									if (dateFound === 0) {
										var dateWeightMeasured = new Date(df.formatISO8601(recordData.SPREGWEIGHTS[i].DTPATIENTPREGWEIGHTDATE, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR));
										var dateWeightDisplay = df.formatISO8601(recordData.SPREGWEIGHTS[i].DTPATIENTPREGWEIGHTDATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
										var dateToday = new Date();
										dateToday.setHours(0, 0, 0, 0);
										var datedifference = dateToday - dateWeightMeasured;
										var ndaysSince = Math.round(datedifference / (1000 * 60 * 60 * 24));
										var ngestDaysRecorded = gestAgeInDays - ndaysSince;

										if (ngestDaysRecorded >= 0) {
											var ngestWeeksRecorded = Math.floor(ngestDaysRecorded / 7);
											var cweightInLB, cprePregWtInLB;
											if (recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHTUNITS == oI18n.KILOGRAM) {
												cweightInLB = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT * kgToLb;
											}
											else {
												cweightInLB = recordData.SPREGWEIGHTS[i].SPATIENTPREGWEIGHT;
											}

											if (recordData.SPATIENTPREPREGWEIGHTUNITS == oI18n.KILOGRAM) {
												cprePregWtInLB = recordData.SPATIENTPREPREGWEIGHT * kgToLb;
											}
											else {
												cprePregWtInLB = recordData.SPATIENTPREPREGWEIGHT;
											}

											var cweightChangeRecordedInLB = cweightInLB - cprePregWtInLB;
											cweightChangeRecordedInLB = Math.round(cweightChangeRecordedInLB * 100) / 100;

											if (ngestWeeksRecorded == x && cweightChangeRecordedInLB == y) {
												tooltipText = tooltipText + dateWeightDisplay;
												dateFound = 1;
											}
										}
									}
								}
								tooltipText = tooltipText + "<br/>" + oI18n.WEIGHT + " " + oI18n.GAIN + ": " + Math.round(y * 100) / 100 + " " + oI18n.POUNDS;
							}

							if (tooltipText === '') {
								jQuery("#graphContents"+ compId + " .jqplot-highlighter-tooltip").empty();
								jQuery("#graphContents"+ compId + " .jqplot-highlighter-tooltip").hide();
							}
							else {
								var mouseX = plot3.axes.xaxis.u2p(x) - 140;
								var mouseY = plot3.axes.yaxis.u2p(y) - 50;
								var tooltipCss = {
									'position' : 'absolute',
									'left' : mouseX + 'px', // usually
									// needs
									// more
									// offset
									// here
									'top' : mouseY + 'px'
								};
								jQuery("#graphContents"+ compId + " .jqplot-highlighter-tooltip").css(tooltipCss);
								jQuery("#graphContents"+ compId + " .jqplot-highlighter-tooltip").html(tooltipText);
								jQuery("#graphContents"+ compId + " .jqplot-highlighter-tooltip").show();
							}
						});

					}

				}

				try {
					formObject = window.external.DiscernObjectFactory('PREGNANCY');
				}
				catch (err) {
					MP_Util.LogError(oI18n.ERROR_DOF + err.name + " " + err.message);
					return;
				}
				if (!formObject) {
					MP_Util.LogError(oI18n.ERROR_CREATE);
					return;
				}

				var modified = false;
				var cancel_close = false;
				try {
					if (this.id == "Add") {
						modified = formObject.AddEDD(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
					}
					else if (this.id == "Modify") {
						modified = formObject.ModifyEDD(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getEddId());
					}
					if (this.id == "menuModifyPreg" + compId) {
						modified = formObject.ModifyPregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
					}
					if (this.id == "menuClosePreg" + compId) {
						cancel_close = formObject.ClosePregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
					}
					if (this.id == "menuCancelPreg" + compId) {
						cancel_close = formObject.CancelPregnancy(window, criterion.person_id, criterion.encntr_id, pregInfoObj.getPregnancyId());
					}
				
					if (modified || cancel_close) {
						//Refresh the pregnancy data.  This function will fire an event which will
						// refresh each component which uses this shared resource.
						PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
					}
				}
				catch (error) {
					MP_Util.LogError(oI18n.ERROR_EXCEPTION + " - " + error.name + " - " + error.message);
				}

				// release pregnancy object
				formObject = null;
			});
			function refreshPage() {
				var paramString = [];
				paramString.push("^MINE^");
				paramString.push(criterion.person_id + ".0");
				paramString.push(criterion.encntr_id + ".0");
				paramString.push(criterion.provider_id + ".0");
				paramString.push(criterion.position_cd + ".0");
				paramString.push(criterion.ppr_cd + ".0");
				paramString.push("^" + criterion.executable + "^");
				paramString.push("^^");
				paramString.push("^" + CERN_static_content.replace(/\\/g, '\\\\') + "^");
				paramString.push("^" + criterion.category_mean + "^");
				CCLLINK('mp_unified_driver', paramString.join(","), 1);
			}

			var activateTab = function() {
				// define a mapping between the tab <a> elements and the tab
				// content <divs>
				var tab2div = {
					"overview-tab1" : "current-pregnancy-tab",
					"overview-tab2" : "contact-info-tab",
					"overview-tab3" : "demographics-tab"
				};
				return function(event) {
					// select all <a> elements containing "overview-tab" in the
					// id and inactivate them
					event.preventDefault();
					var tabs = jQuery("a[id*='overview-tab']");
					tabs.attr("class", "inactive");

					// and hide the div associated to each tab
					for (var i = 0; i < tabs.length; i++) {
						jQuery("#" + tab2div[tabs[i].id]).css("display", "none");
					}

					//and now activate the selected tab
					//(jQuery binds "this" in the event callback to the element on which the event was triggered)
					jQuery(this).attr("class", "active");
					//and display the div associated to it
					var tabKey = jQuery(this).attr("id");
					jQuery("#" + tab2div[tabKey]).css("display", "block");
				};
			}();

			//bind the click event on the tab <a>'s to our handler
			jQuery("a[id*='overview-tab']").click(activateTab);

			var divs = Util.Style.g('hvr', _g(rootId), 'div');
			for ( i = 0; i < divs.length; i++) {
				hs(Util.gp(divs[i]), divs[i], component);
			}

			var sResultText = MP_Util.CreateTitleText(component, 0);
			var totalCount = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
			totalCount[0].innerHTML = sResultText;
		}

	};
}();