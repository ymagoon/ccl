/**
 * @class
 */
function PregAssessment2Style() {
	this.initByNamespace("pa2");
}

PregAssessment2Style.inherits(ComponentStyle);

function PregAssessment2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PregAssessment2Style());
	this.setIncludeLineNumber(true);
	this.setComponentLoadTimerName("USR:MPG.PREGASSESSMENT2.O1 - load component");
	this.setComponentRenderTimerName("USR:MPG.PREGASSESSMENT2.O1 - render component");

	//flag for resource required
	this.setResourceRequired(true);

	PregAssessment2Component.method("InsertData", function() {
		CERN_PREG_ASSESSMENT2_O1.GetPregAssessment2Data(this);
	});
	PregAssessment2Component.method("HandleSuccess", function(recordData) {
		CERN_PREG_ASSESSMENT_BASE_O1.RenderAssessmentSection(this, recordData, 2);
	});
	PregAssessment2Component.method("RetrieveRequiredResources", function() {
		var patientGenderInfo = criterion.getPatientInfo().getSex();
		var pai18n = i18n.discernabu.pregassessmentbase;
		if (patientGenderInfo === null) {
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>"+ pai18n.GENDER_UNDEFINED +"</span></h3><span class='res-none'>"+ pai18n.GENDER_UNDEFINED + "</span>";
			MP_Util.Doc.FinalizeComponent(messageHTML, this,"(0)");
			return;
		}
		
		var pregInfoObj = null;

		//Check to see if the pregnancyInfo object is available to use
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
	PregAssessment2Component.method("setAntepartumNote2", function(value) {
		this.m_antepartumNote2 = value;
	});
	PregAssessment2Component.method("getAntepartumNote2", function() {
		return this.m_antepartumNote2;
	});
	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.InsertData, this);
}

PregAssessment2Component.inherits(MPageComponent);

/**
 * Preg Assessment 2 methods
 * @namespace
 */
var CERN_PREG_ASSESSMENT2_O1 = function() {
	
	/** Add fundal height graph and labor graph to the component menu.  
	 * 	When clicked, new window will open for the graph. 
	 */
	function updateComponentMenu(component) {
		var compId = component.getComponentId();
		var criterion = component.getCriterion();
		var pai18n = i18n.discernabu.pregassessmentbase;
		var menuOptionNames = component.getMenuOptionNames();
		var menuOptions = this.getMenuOptions;
		var optionCnt = menuOptionNames.length;
		
		component.addMenuOption("laborGraph" + compId, "laborGraph" + compId, pai18n.LABOR_GRAPH, false, "click", function() {
			var fundalGraphItem = new MenuSelection("laborGraph" + compId);
			fundalGraphItem.setLabel(pai18n.LABOR_GRAPH);
			var pregInfoSR = null;
			var pregInfoObj = null;
			pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			pregInfoObj = pregInfoSR.getResourceData();
			var pregDiscernObject = null;
			try{
				pregDiscernObject = window.external.DiscernObjectFactory("PREGNANCY");
				MP_Util.LogDiscernInfo(this, "PREGNANCY", "pregnancyassessment2-o1.js", "menuItemOnClickHandler");
				pregDiscernObject.LaunchLaborGraph(window, criterion.person_id, pregInfoObj.getPregnancyId());
			}
			catch (discernErr) {
				MP_Util.LogJSError(discernErr, this, "pregnancyassessment2-o1.js", "menuItemOnClickHandler");
				return;
			}
		});
		component.addMenuOption("fundalGraph" + compId, "fundalGraph" + compId, pai18n.FUNDAL_HEIGHT, false, "click", function() {
			var fundalGraphItem = new MenuSelection("fundalGraph" + compId);
			fundalGraphItem.setLabel(pai18n.FUNDAL_HEIGHT);
			var pregInfoSR = null;
			var pregInfoObj = null;
			pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			pregInfoObj = pregInfoSR.getResourceData();
			var pregDiscernObject2 = null;
			try{
				pregDiscernObject2 = window.external.DiscernObjectFactory("PREGNANCY");
				MP_Util.LogDiscernInfo(this, "PREGNANCY", "pregnancyassessment2-o1.js", "menuItemOnClickHandler");
				pregDiscernObject2.LaunchFundalHeightGraph(window, criterion.person_id, pregInfoObj.getPregnancyId());
			}
			catch (discernErr) {
				MP_Util.LogJSError(discernErr, this, "pregnancyassessment2-o1.js", "menuItemOnClickHandler");
				return;
			}
		});
		component.createMenu();
	}
	
	return {
		GetPregAssessment2Data : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var messageHTML = "";
			var pai18n = i18n.discernabu.pregassessmentbase;
			var pregInfoObj = null;
			var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
			var pregnancyId = 0.0;
			var lookBackUnits = component.getLookbackUnits();
			var lookBackUnitTypeFlag = component.getLookbackUnitTypeFlag();
			var df = MP_Util.GetDateFormatter();

			//Check to make sure the patient is a female with an active pregnancy
			if(criterion.getPatientInfo().getSex().meaning !== "FEMALE") {
				//Male patient so just show a disclaimer
				messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pai18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + pai18n.NOT_FEMALE + "</span>";
				MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
				return;
			}
			else if(pregInfoSR && pregInfoSR.isResourceAvailable()) {
				pregInfoObj = pregInfoSR.getResourceData();
				pregnancyId = pregInfoObj.getPregnancyId();
				if(pregnancyId === -1) {
					//Error occurred while retrieving pregnancy information
					messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pai18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>" + pai18n.PREG_DATA_ERROR + "</span>";
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					return;
				}
				else if(!pregnancyId) {
					//Female patient with no active pregnancy.  Show disclaimer and give the option
					// to add a pregnancy
					messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pai18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + pai18n.NO_ACTIVE_PREG + "</span>";
					MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
					return;
				}
				else {
					sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", pregInfoObj.getLookBack(), "2");

					sendAr.push(MP_Util.CreateParamArray(component.getAntepartumNote2(), 1));

					var groups = component.getGroups();
					for(var i = 0; i < groups.length; i++) {
						var group = groups[i];
						if( group instanceof MPageEventSetGroup) {
							sendAr.push(MP_Util.CreateParamArray(group.getEventSets(), 1));
						}
					}
					updateComponentMenu(component);
					sendAr.push(lookBackUnits, lookBackUnitTypeFlag);
					MP_Core.XMLCclRequestWrapper(component, "MP_GET_PREG_ASSESSMENT", sendAr, true);
				}
			}
		}
	};
}();