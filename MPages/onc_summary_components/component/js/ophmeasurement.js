
/**
 * The ophthalmology measurement component style
 * @class
 */
function OphMeasurementComponentStyle(){
    this.initByNamespace("oph-measure");
}
OphMeasurementComponentStyle.inherits(ComponentStyle);


/**

 * The Oph Measurement component
	 * @constructor
 * @param criterion [REQUIRED] The criterion containing the requested information
  */
function OphMeasurementComponent(criterion) {    
	
	this.compId = 0;
	this.df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new OphMeasurementComponentStyle());
	this.setIncludeLineNumber(false);
	this.m_iViewAdd = false;
	this.m_displayGenerateMeasure = false;
	this.m_displayVisAcuity = false;
	this.m_displayGenerateMeasure = false;
	this.m_displayVisAcuity = false;
	this.m_displayRefract = false;
	this.m_displayAutoRefract = false;
	this.m_displayKerato = false;
	this.m_displayRetino = false;
	this.m_displayRetAcuity = false;
	this.m_displayGlare = false;
	this.m_displayPupEqual = false;
	this.m_displayIOP = false;
	this.m_displayDilation = false;
	this.m_displayMotility = false;
	this.m_displayVisFields = false;
	this.m_displayPachy = false;
	this.m_displayOCT = false;
	this.m_displayLID = false;
	this.m_displayColor = false;
	this.m_displayContrast = false;
	this.m_displayAmsler = false;
	this.m_displayTitmus = false;
	this.m_displayWorth = false;
	this.setResultCount(3);
	this.setIncludeEventSetInfo(true);
	this.setComponentLoadTimerName("USR:MPG.OphMeasurement.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.OphMeasurement.O1 - render component");
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";

	this.ophmI18n = i18n.discernabu.oph_measurement_o1;
	this.ophmLen = 0;
	this.paramVisualAcuity = 0;
	this.paramRefraction = 0;
			
	this.paramRetinal = 0;
	this.paramGlare = 0;
	this.paramPupil = 0;
	this.paramAutoRefract = 0;
	this.paramKerato = 0;
	this.paramRetino = 0;
	this.paramIOP = 0;
	this.paramDilation = 0;
	this.paramMotility = 0;
	this.paramVisualFields = 0;
	this.paramPachy = 0;
	this.paramOCT = 0;
	this.paramLid = 0;
	this.paramColor = 0;
	this.paramContrast = 0;
	this.paramAmsler = 0;
	this.paramTitmus = 0;
	this.paramWorth = 0;
	this.paramGraph = 0;
	
	this.m_resultCount = 0;
	this.m_isEventSetInfo = false;
	this.m_isComment = false;
	
	
	this.groupVisualAcuity = {};
	this.groupVisualFields = {};
	this.groupRefract = {};
	this.groupRefract2 = {};
	this.groupAutoRefract = {};
	this.groupKerato = {};
	this.groupRetino = {};
	this.groupRetAcuity = {};
	this.groupGlare = {};
	this.groupPupEqual = {};
	this.groupIOP = {};
	this.groupDilation = {};
	this.groupMotility = {};
	this.groupVisualFieldsTDiag = {};
	this.groupMotilityHDiag = {};
	this.groupPachy = {};
	this.groupOCT = {};
	this.groupLID = {};
	this.groupColor = {};
	this.groupContrast = {};
	this.groupAmsler = {};
	this.groupTitmus = {};
	this.groupWorth = {};
	this.EvtMap = {};
	this.GroupMap = {}; 
}

OphMeasurementComponent.prototype = new MPageComponent();
OphMeasurementComponent.prototype.constructor = MPageComponent;

OphMeasurementComponent.prototype.setResultCount = function(value){
this.m_resultCount = value;
};

/**
 * Gets result count.
 * @return {[float]} 
 */
OphMeasurementComponent.prototype.getResultCount = function(){
return this.m_resultCount;
};

OphMeasurementComponent.prototype.setIncludeEventSetInfo = function(value){
this.m_isEventSetInfo = value;
};

OphMeasurementComponent.prototype.includeEventSetInfo = function(){
return this.m_isEventSetInfo;
};

OphMeasurementComponent.prototype.setIncludeComments = function(value){
this.m_isComment = value;
};

OphMeasurementComponent.prototype.includeComments = function(){
return this.m_isComment;
};


/**
 * Sets variable 'm_displayGenerateMeasure'
 * @param value [REQUIRED] The value to which variable has to be set
 */
    OphMeasurementComponent.prototype.setDisplayGenerateMeasure = function(value){
        this.m_displayGenerateMeasure = value;
    };
	
/**
 * @return Returns variable 'm_displayGenerateMeasure'
 */
    OphMeasurementComponent.prototype.getDisplayGenerateMeasure = function(){
        return this.m_displayGenerateMeasure;
    }; 
	
/**
 * Sets variable 'm_displayVisAcuity'
 * @param value [REQUIRED] The value to which variable has to be set
 */
	OphMeasurementComponent.prototype.setDisplayVisAcuity = function(value){
        this.m_displayVisAcuity = value;
    };
/**
 * @return Returns variable 'm_displayVisAcuity'
 */
    OphMeasurementComponent.prototype.getDisplayVisAcuity = function(){
        return this.m_displayVisAcuity;
    }; 		
/**
 * Sets variable 'm_displayRefract'
 * @param value [REQUIRED] The value to which variable has to be set
 */
    OphMeasurementComponent.prototype.setDisplayRefract = function(value){
        this.m_displayRefract = value;
    };
/**
 * @return Returns variable 'm_displayRefract'
 */
    OphMeasurementComponent.prototype.getDisplayRefract = function(){
        return this.m_displayRefract;
    }; 	
/**
 * Sets variable 'm_displayAutoRefract'
 * @param value [REQUIRED] The value to which variable has to be set
 */
    OphMeasurementComponent.prototype.setDisplayAutoRefract = function(value){
        this.m_displayAutoRefract = value;
    };
/**
 * @return Returns variable 'm_displayAutoRefract'
 */
    OphMeasurementComponent.prototype.getDisplayAutoRefract = function(){
        return this.m_displayAutoRefract;
    }; 	
    OphMeasurementComponent.prototype.setDisplayKerato = function(value){
        this.m_displayKerato = value;
    };
    OphMeasurementComponent.prototype.getDisplayKerato = function(){
        return this.m_displayKerato;
    }; 		
	OphMeasurementComponent.prototype.setDisplayRetino = function(value){
        this.m_displayRetino = value;
    };
    OphMeasurementComponent.prototype.getDisplayRetino = function(){
        return this.m_displayRetino;
    };     
    OphMeasurementComponent.prototype.setDisplayRetAcuity = function(value){
        this.m_displayRetAcuity = value;
    };
    OphMeasurementComponent.prototype.getDisplayRetAcuity = function(){
        return this.m_displayRetAcuity;
    }; 
    OphMeasurementComponent.prototype.setDisplayGlare = function(value){
        this.m_displayGlare = value;
    };
    OphMeasurementComponent.prototype.getDisplayGlare = function(){
        return this.m_displayGlare;
    };   	  
    OphMeasurementComponent.prototype.setDisplayPupEqual = function(value){
        this.m_displayPupEqual = value;
    };
    OphMeasurementComponent.prototype.getDisplayPupEqual = function(){
        return this.m_displayPupEqual;
    };     	
    OphMeasurementComponent.prototype.setDisplayIOP = function(value){
        this.m_displayIOP = value;
    };
    OphMeasurementComponent.prototype.getDisplayIOP = function(){
        return this.m_displayIOP;
    };     
    OphMeasurementComponent.prototype.setDisplayDilation = function(value){
        this.m_displayDilation = value;
    };
    OphMeasurementComponent.prototype.getDisplayDilation = function(){
        return this.m_displayDilation;
    };     
    OphMeasurementComponent.prototype.setDisplayMotility = function(value){
        this.m_displayMotility = value;
    };
    OphMeasurementComponent.prototype.getDisplayMotility = function(){
        return this.m_displayMotility;
    };        
    OphMeasurementComponent.prototype.setDisplayVisFields = function(value){
        this.m_displayVisFields = value;
    };
    OphMeasurementComponent.prototype.getDisplayVisFields = function(){
        return this.m_displayVisFields;
    }; 
    OphMeasurementComponent.prototype.setDisplayPachy = function(value){
        this.m_displayPachy = value;
    };
    OphMeasurementComponent.prototype.getDisplayPachy = function(){
        return this.m_displayPachy;
    };     
    OphMeasurementComponent.prototype.setDisplayOCT = function(value){
        this.m_displayOCT = value;
    };
    OphMeasurementComponent.prototype.getDisplayOCT = function(){
        return this.m_displayOCT;
    };
    OphMeasurementComponent.prototype.setDisplayLID = function(value){
        this.m_displayLID = value;
    };
    OphMeasurementComponent.prototype.getDisplayLID = function(){
        return this.m_displayLID;
    };     
    OphMeasurementComponent.prototype.setDisplayColor = function(value){
        this.m_displayColor = value;
    };
    OphMeasurementComponent.prototype.getDisplayColor = function(){
        return this.m_displayColor;
    }; 
    OphMeasurementComponent.prototype.setDisplayContrast = function(value){
        this.m_displayContrast = value;
    };
    OphMeasurementComponent.prototype.getDisplayContrast = function(){
        return this.m_displayContrast;
    };       
    OphMeasurementComponent.prototype.setDisplayAmsler = function(value){
        this.m_displayAmsler = value;
    };
    OphMeasurementComponent.prototype.getDisplayAmsler = function(){
        return this.m_displayAmsler;
    };        
    OphMeasurementComponent.prototype.setDisplayTitmus = function(value){
        this.m_displayTitmus = value;
    };
    OphMeasurementComponent.prototype.getDisplayTitmus = function(){
        return this.m_displayTitmus;
    };   
    OphMeasurementComponent.prototype.setDisplayWorth = function(value){
        this.m_displayWorth = value;
    };
    OphMeasurementComponent.prototype.getDisplayWorth = function(){
        return this.m_displayWorth;
    };  
    OphMeasurementComponent.prototype.setIViewAdd = function(value){
        this.m_iViewAdd = value;
    };
    OphMeasurementComponent.prototype.isIViewAdd = function(){
        return this.m_iViewAdd;
    };
	
/**
 * Opens Powerform of Measurement component
 */
    OphMeasurementComponent.prototype.openTab = function () { 
	var criterion = this.getCriterion();
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
        MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "ophmeasurement.js", "openTab");
        MPAGES_EVENT("POWERFORM", paramString);
    };
/**
 * Opens Powerform of Measurement component
 * @param formID [REQUIRED] Identifier value of current form
 */
    OphMeasurementComponent.prototype.openDropDown = function (formID) {
        var criterion = this.getCriterion();
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
        MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "ophmeasurement.js", "openDropDown");
        MPAGES_EVENT("POWERFORM", paramString);  
    };
/**
 * Opens IView of Prescription component
 */
    OphMeasurementComponent.prototype.openIView = function () {
        var criterion = this.getCriterion();
        var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + ".0," + criterion.encntr_id + ".0";
        MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "ophmeasurement.js", "openIView");
        try {
            var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
            launchIViewApp.LaunchIView(this.bandName,this.sectionName,this.itemName,criterion.person_id+".0",criterion.encntr_id+".0");
        }
        catch (err) {
            MP_Util.LogJSError(err, null, "ophmeasurement.js", "openIView");
        }
    };
	
/**
 * Loads bedrock filters 
 */
OphMeasurementComponent.prototype.loadFilterMappings = function () {

	this.addFilterMappingObject("OPH_MEAS_IND", {
		setFunction : this.setIViewAdd,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("GEN_MEAS",{
	setFunction : this.setDisplayGenerateMeasure,
	type :"Boolean",
	field :"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("VIS_ACUITY",{
	setFunction :this.setDisplayVisAcuity,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("REFRAC",{
	setFunction :this.setDisplayRefract,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("AUTO_REFRAC",{
	setFunction :this.setDisplayAutoRefract,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("KERATO",{
	setFunction :this.setDisplayKerato,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("RETINO",{
	setFunction :this.setDisplayRetino,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("RET_ACUITY",{
	setFunction :this.setDisplayRetAcuity,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("GLARE",{
	setFunction :this.setDisplayGlare,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("PUP_MEAS",{
	setFunction :this.setDisplayPupEqual,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("IOP",{
	setFunction :this.setDisplayIOP,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("DILATION",{
	setFunction :this.setDisplayDilation,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("MOTILITY",{
	setFunction :this.setDisplayMotility,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("VIS_FIELDS",{
	setFunction :this.setDisplayVisFields,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("PACHY",{
	setFunction :this.setDisplayPachy,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("OCT",{
	setFunction :this.setDisplayOCT,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("LID",{
	setFunction :this.setDisplayLID,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("COLOR",{
	setFunction :this.setDisplayColor,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("CONTRAST",{
	setFunction :this.setDisplayContrast,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("AMSLER",{
	setFunction :this.setDisplayAmsler,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("TITMUS",{
	setFunction :this.setDisplayTitmus,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	this.addFilterMappingObject("WORTH",{
	setFunction :this.setDisplayWorth,
	type :"Boolean",
	field:"FREETEXT_DESC"
	});
	
	};

	/**
	* Executes the retrieval of each group data per a thread.
	* @param component [REQUIRED] The Component being rendered
	*/
	OphMeasurementComponent.prototype.retrieveComponentData = function(){

		var groups = this.getGroups();

		if(groups&&groups.length>0){
			var sendAr = [];
			var criterion = this.getCriterion();
			var encntrOption = (this.getScope() == 2)?(criterion.encntr_id+".0"):"0.0";
			var prsnlInfo = criterion.getPersonnelInfo();
			var sEventCodesArr = [];
			var sEventSets = "0.0";
			var sEventCodes = "0.0";
			var sBeginDate = "^^";
			var sEndDate = "^^";
			var sEncntr = encntrOption;
			for(var x = 0, xl = groups.length; x<xl; x++){
				var group = groups[x];
				this.setGroupMappings(group);
				if(group instanceof MPageEventCodeGroup) {
					var evtCds = [];
					evtCds = group.getEventCodes();
					for(var e = 0; e<evtCds.length; e++) {
						sEventCodesArr.push(evtCds[e]);
					}
				} 
				else {
					continue;
				}
			}
			sEventCodes = MP_Util.CreateParamArray(sEventCodesArr,1);
			var noOfresults = 100;
			sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0",
				criterion.ppr_cd + ".0",noOfresults, "^^",sEventSets, sEventCodes,
				this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), 1,
				sBeginDate,sEndDate,0);
				var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
				var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
			var scriptRequest = new ComponentScriptRequest();
			scriptRequest.setProgramName("inn_mp_retrieve_oph_results");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(this);
			scriptRequest.setLoadTimer(loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.performRequest();
		}
		
			
	};
	
OphMeasurementComponent.prototype.loadMeasurementDataMap = function(recordData,personnelArray,codeArray,sortOption){

var mapObjects = [];
var results = recordData.RESULTS;

if(!codeArray){codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
}if(!personnelArray){personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
}for(var i = 0,il = results.length;
i<il;
i++){var result = results[i];
if(result.CLINICAL_EVENTS.length>0){for(var j = 0,jl = result.CLINICAL_EVENTS.length;
j<jl;
j++){var measureArray = [];
var mapObject = null;
if(result.EVENT_CD>0){mapObject = new MP_Core.MapObject(result.EVENT_CD,measureArray);
}else{mapObject = new MP_Core.MapObject(result.EVENT_SET_NAME,measureArray);
}var meas = result.CLINICAL_EVENTS[j];
for(var k = 0,kl = meas.MEASUREMENTS.length;
k<kl;
k++){var measurement = new MP_Core.Measurement();
measurement.initFromRec(meas.MEASUREMENTS[k],codeArray);
measureArray.push(measurement);
}if(measureArray.length>0){if(sortOption){measureArray.sort(sortOption);
}else{measureArray.sort(this.sortByEffectiveDateDesc);
}mapObjects.push(mapObject);
}}}}

return mapObjects;
};

OphMeasurementComponent.prototype.sortByEffectiveDateDesc = function(a,b){if(a.getDateTime()>b.getDateTime()){return -1;
}else{if(a.getDateTime()<b.getDateTime()){return 1;
}}return 0;
};
	
	/**
	 * Renders the retrieved data for the component into HTML markup to display within the document
	 * @param component [REQUIRED] The component being rendered
	 * @param replyAr [REQUIRED] The retrieved JSON array to parser to generate the HTML markup
	 */
	OphMeasurementComponent.prototype.renderComponent = function(replyAr){
		var component = this;
		this.compId = this.getComponentId();
		var ophMeasureDiv = $(".section.oph-measure-sec");
		var ophMeasureContentDiv = ophMeasureDiv.find(".sec-content");
		ophMeasureContentDiv.addClass("oph-measure-sec-content");
		
		try{
		var x = 0;
		var y = 0;
		var xl = 0;
		var yl = 0;
		
		var groups = component.getGroups();
		var sHTML = [];
		sHTML.push("<div>");
		
		var resultDatesArray=replyAr.RESULT_DATES;
		
		var codeArray = MP_Util.LoadCodeListJSON(replyAr.CODES);
		var personnelArray = MP_Util.LoadPersonelListJSON(replyAr.PRSNL);
		var eventsArray = replyAr.EVENTS;
		
		var dateLength = resultDatesArray.length;
		
		for(var i = 0; i<dateLength;i++){

			var currentDate = new Date();
			currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);
			var resultLength = resultDatesArray[i].RESULTS.length;

			for(var j = 0; j<resultLength; j++){
				var evtCode = resultDatesArray[i].RESULTS[j].EVENT_CD;
				if(component.EvtMap[evtCode]){
					
					var group = component.EvtMap[evtCode][0];
					if(component.GroupMap[group]){

						var resultDisplay = "";
						var recordData = {};
						recordData.RESULTS = [];
						recordData.RESULTS.push(resultDatesArray[i].RESULTS[j]);
						var measureArray = this.loadMeasurementDataMap(recordData,personnelArray,codeArray);
						if(measureArray.length>0){
							var result = "";
							var measObject = measureArray[0].value[0];
							var resultHTML = [];
							var display = measObject.getEventCode().display;

							if(group === "iop_time"||group === "dilation_time"){var sTempDate = MP_Util.Measurement.GetString(measObject,null,"militaryTime");
							var timeAr = ["<span class='",MP_Util.Measurement.GetNormalcyClass(measObject),"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",component.getEventViewerLink(measObject,sTempDate),"</span>",MP_Util.Measurement.GetModifiedIcon(measObject),"</span>"];
							result = timeAr.join("");

							}else{

							result = MP_Util.Measurement.GetNormalcyResultDisplay(measObject);
							}var status = measObject.getStatus().display;
							var oDate = measObject.getDateTime();
							var sDate = (oDate)?this.df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
							var sDateHover = (oDate)?this.df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR):"";

							var eventId = measObject.getEventId();
							
							resultHTML.push("<dl class='result-info'>","<dt></dt>","<dd'><span>",result,"</span></dd>","</dl>","<div class='result-details'><h4 class='det-hd'>Ophs Details</h4>","<dl>","<dt><span>",display,":</span></dt>","<dd><span>",result,"</span></dd>","<dt><span>",component.ophmI18n.RESULT_DT_TM,":</span></dt>","<dd><span>",sDateHover,"</span></dd>","<dt><span>",component.ophmI18n.STATUS,":</span></dt>","<dd><span>",status,"</span></dd>","</dl>","</div>");

							resultDisplay = resultHTML.join("");
							component.GroupMap[group]["Result_"+i] = {};
							component.GroupMap[group]["Result_Date_"+i] = currentDate;
							component.GroupMap[group]["Result_"+i] = resultDisplay;

							component.setGroupResultInd(group,i,eventId);
						}
					}
				}
			}
		}
		if(component.getDisplayVisAcuity()&&component.groupVisualAcuity.ResultInd){
		sHTML.push(component.buildVisualAcuitySection(resultDatesArray,eventsArray));
		}
		component.groupVisualAcuity = null;
		if(component.getDisplayRefract()&&component.groupRefract.ResultInd){
		sHTML.push(component.buildRefractionSection(resultDatesArray,eventsArray));
		}
		component.groupRefract = null;
		if((component.getDisplayRetAcuity()&&component.groupRetAcuity.ResultInd)||(component.groupGlare.ResultInd&&component.getDisplayGlare())){
		sHTML.push(component.buildRetinalGlareSection(resultDatesArray,eventsArray));
		}
		component.groupGlare = null;
		component.groupRetAcuity = null;
		if(component.getDisplayPupEqual()&&component.groupPupEqual.ResultInd){
		sHTML.push(component.buildPupilSection(resultDatesArray,eventsArray));
		}component.groupPupEqual = null;
		if((component.getDisplayAutoRefract()&&component.groupAutoRefract.ResultInd)||(component.getDisplayKerato()&&component.groupKerato.ResultInd)||(component.getDisplayRetino()&&component.groupRetino.ResultInd)){
		sHTML.push(component.buildAutoKeratoRetinoSection(resultDatesArray,eventsArray));
		}component.groupAutoRefract = null;
		component.groupKerato = null;
		component.groupRetino = null;
		if((component.getDisplayIOP()&&component.groupIOP.ResultInd)||(component.getDisplayDilation()&&component.groupDilation.ResultInd)){
		sHTML.push(component.buildIntraocularDilationSection(resultDatesArray,eventsArray));
		}component.groupIOP = null;
		component.groupDilation = null;
		if((component.getDisplayMotility()&&component.groupMotility.ResultInd)||(component.getDisplayVisFields()&&component.groupVisualFields.ResultInd)){
		sHTML.push(component.buildMotilityVisFieldsSection(resultDatesArray,eventsArray));
		}component.groupMotility = null;
		component.groupVisualFields = null;
		component.groupVisualFieldsTDiag = null;
		component.groupMotilityHDiag = null;
		if((component.getDisplayPachy()&&component.groupPachy.ResultInd)||(component.getDisplayOCT()&&component.groupOCT.ResultInd)||(component.getDisplayLID()&&component.groupLID.ResultInd)){
		sHTML.push(component.buildPachyOCTLidSection(resultDatesArray,eventsArray));
		}component.groupPachy = null;
		component.groupOCT = null;
		component.groupLID = null;
		if((component.getDisplayColor()&&component.groupColor.ResultInd)||(component.getDisplayContrast()&&component.groupContrast.ResultInd)){
		sHTML.push(component.buildColorContrastSection(resultDatesArray,eventsArray));
		}component.groupColor = null;
		component.groupContrast = null;
		if((component.getDisplayAmsler()&&component.groupAmsler.ResultInd)||(component.getDisplayTitmus()&&component.groupTitmus.ResultInd)||(component.getDisplayWorth()&&component.groupWorth.ResultInd)){
		sHTML.push(component.buildStereoSection(resultDatesArray,eventsArray));
		}component.groupAmsler = null;
		component.groupTitmus = null;
		component.groupWorth = null;
		sHTML.push("</div>");
		var countText = "";
		this.finalizeComponent(sHTML.join(""),countText);
		}catch(err){
			MP_Util.LogJSError(err, null, "ophmeasurement.js", "renderComponent");
			throw (err);
		}
		finally{
			component.setEditMode(false);
		}
	this.attachListners();	
	};
	OphMeasurementComponent.prototype.attachListners = function(){	
		var self = this;
		var visAcuityObject = this.getObject(this.paramVisualAcuity);
		visAcuityObject.click(function(){
			self.getParam(self.paramVisualAcuity);
		});
		
		var refractionObject = this.getObject(this.paramRefraction);
		refractionObject.click(function(){
			self.getParam(self.paramRefraction);
		});
		
		var retinalObject =  this.getObject(this.paramRetinal);
		retinalObject.click(function(){
			self.getParam(self.paramRetinal);
		});
		
		var glareObject = this.getObject(this.paramGlare);
		glareObject.click(function(){
			self.getParam(self.paramGlare);
		});
		
		var pupilObject = this.getObject(this.paramPupil);
		pupilObject.click(function(){
			self.getParam(self.paramPupil);
		});
		
		var autoRefractObject = this.getObject(this.paramAutoRefract);
		autoRefractObject.click(function(){
			self.getParam(self.paramAutoRefract);
		});
		
		var keratoObject = this.getObject(this.paramKerato);
		keratoObject.click(function(){
			self.getParam(self.paramKerato);
		});
		
		var retinoObject = this.getObject(this.paramRetino);
		retinoObject.click(function(){
			self.getParam(self.paramRetino);
		});
		
		var iopObject = this.getObject(this.paramIOP);
		iopObject.click(function(){
			self.getParam(self.paramIOP);
		});
		
		var dilationObject = this.getObject(this.paramDilation);
		dilationObject.click(function(){
			self.getParam(self.paramDilation);
		});
		
		var motilityObject = this.getObject(this.paramMotility);
		motilityObject.click(function(){
			self.getParam(self.paramMotility);
		});
		
		var visualFieldsObject = this.getObject(this.paramVisualFields);
		visualFieldsObject.click(function(){
			self.getParam(self.paramVisualFields);
			});
			
		var pachyObject = this.getObject(this.paramPachy);
		pachyObject.click(function(){
		self.getParam(self.paramPachy);
		});
		
		var octObject = this.getObject(this.paramOCT);
		octObject.click(function(){
		self.getParam(self.paramOCT);
		});
		
		var lidObject = this.getObject(this.paramLid);
		lidObject.click(function(){
		self.getParam(self.paramLid);
		});
		
		var colorObject = this.getObject(this.paramColor);
		colorObject.click(function(){
		self.getParam(self.paramColor);
		});
		
		var contrastObject = this.getObject(this.paramContrast);
		contrastObject.click(function(){
		self.getParam(self.paramContrast);
		});
		
		var amslerObject = this.getObject(this.paramAmsler);
		amslerObject.click(function(){
		self.getParam(self.paramAmsler);
		});
		
		var titmusObject = this.getObject(this.paramTitmus);
		titmusObject.click(function(){
		self.getParam(self.paramTitmus);
		});
		
		var worthObject = this.getObject(this.paramWorth);
		worthObject.click(function(){
		self.getParam(self.paramWorth);
		});
		
		var graphObject_OD = $("#"+this.compId+"-"+self.paramGraph.eventCodeOD + "-" + self.paramGraph.eventCodeOS + "-" + self.paramGraph.groupId);
		graphObject_OD.click(function(){
		var eventCodeOD = self.paramGraph.eventCodeOD;
		var eventCodeOS = self.paramGraph.eventCodeOS;
		var groupId = self.paramGraph.groupId;
		self.graphResultsOPH(eventCodeOD,eventCodeOS,self.compId,groupId);
		});
		
		var graphObject_OS = $("#"+this.compId+"-"+self.paramGraph.eventCodeOD + "-" + self.paramGraph.eventCodeOS + "-" + self.paramGraph.groupId + "-2");
		graphObject_OS.click(function(){
		
		var eventCodeOD = self.paramGraph.eventCodeOD;
		var eventCodeOS = self.paramGraph.eventCodeOS;
		var groupId = self.paramGraph.groupId;
		self.graphResultsOPH(eventCodeOD,eventCodeOS,self.compId,groupId);
		});
	};
	OphMeasurementComponent.prototype.getParam = function(idString){
		var personId = this.getCriterion().person_id;
		var encntrId =idString.encntr_id;
		var activityId=idString.activity_id;
		var params = [personId, encntrId, activityId];
		this.openExistingForm(params.join(","));
	};
	OphMeasurementComponent.prototype.getObject = function(idString){
		var linkObject = $("#"+this.compId+"-"+ idString.encntr_id + "-" + idString.activity_id + "-"+idString.section);
		return linkObject;
	};
	/**
	 * Opens Powerform of Measurements with the latest values for current encounter
	 * @param params [REQUIRED] 
	 */
	
	
	OphMeasurementComponent.prototype.openExistingForm = function(params){
		var paramList = params.split(",");
		var dPersonId = paramList[0];
		var dEncounterId = paramList[1];
		var formId = 0;
		var activityId = paramList[2];
		var chartMode = 0;
		var mpObj = window.external.DiscernObjectFactory("POWERFORM");
		mpObj.OpenForm(dPersonId,dEncounterId,formId,activityId,chartMode);
	};
	
	/**
	 * 	Retrieves graph results														
	 * @param eventCdOD [REQUIRED] 
	 * @param eventCdOS [REQUIRED] 
	 * @param compID [REQUIRED] 
	 * @param groupID [REQUIRED] 
	 */	
		
	OphMeasurementComponent.prototype.graphResultsOPH = function(eventCdOD,eventCdOS,compID,groupID){
		
		var mpageTimer = MP_Util.CreateTimer( "USR:MPG.OphDiscreteGraph - load graph" );
		var component = MP_Util.GetCompObjById(compID);
		var lookBackUnits = 5;
		var lookBackType = 5;
		var i18nCore = i18n.discernabu;
		var subTitleText = "";
		var scope = component.getScope();
		var lookBackText = "";
		var criterion = component.getCriterion();
		component.setLookbackUnits(lookBackUnits);
		component.setLookbackUnitTypeFlag(lookBackType);

		var sEventCodesArr = [];
		sEventCodesArr.push(eventCdOD);
		sEventCodesArr.push(eventCdOS);
		var sEventCodes = MP_Util.CreateParamArray(sEventCodesArr,1);
		var replaceText = "";
		var encntrOption = "";
		if(scope>0){switch(lookBackType){
			case 1:replaceText = i18nCore.LAST_N_HOURS.replace("{0}",lookBackUnits);
			break;
			case 2:replaceText = i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
			break;
			case 3:replaceText = i18nCore.LAST_N_WEEKS.replace("{0}",lookBackUnits);
			break;
			case 4:replaceText = i18nCore.LAST_N_MONTHS.replace("{0}",lookBackUnits);
			break;
			case 5:replaceText = i18nCore.LAST_N_YEARS.replace("{0}",lookBackUnits);
			break;
			default:replaceText = i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
			break;
		}
		
		switch(scope){case 1:lookBackText = i18nCore.ALL_N_VISITS.replace("{0}",replaceText);
		encntrOption = "0.0";
		break;
		case 2:lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}",replaceText);
		encntrOption = criterion.encntr_id;
		break;
		}}
		var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
		var sParams = "^MINE^,"+criterion.person_id+".0,"+encntrOption+","+sEventCodes+",^"+criterion.static_content+"\\discrete-graphing^,"+groupID+".0,"+criterion.provider_id+".0,"+criterion.position_cd+".0,"+criterion.ppr_cd+".0,"+lookBackUnits+","+lookBackType+",200,^"+lookBackText+"^,^"+component.ophmI18n.INTRA_PRESSURE+"^,^OD IOP^,^OS IOP^";
		var graphCall = "CCLLINK('mp_retrieve_graph_results', '"+sParams+"',1)";
		MP_Util.LogCclNewSessionWindowInfo(null,graphCall,"ophmeasurement.js","GraphResultsOPH");
		CCLNEWSESSIONWINDOW(graphCall,"_self",wParams,0,1);
		if(mpageTimer){
		mpageTimer.Stop();
		}
		Util.preventDefault();
	};
    
	OphMeasurementComponent.prototype.groupMapResults = function(key,i)
	{
		var groupObj = this.GroupMap[key];
		var result = groupObj && groupObj["Result_" + i] ? groupObj["Result_" + i]  : "--";
		return(result);
	};
  
  /**
	 * Returns HTML Markup required to build  Visual Acuity Section				???
	 * @param component [REQUIRED] Component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Visual Acuity section
	 */
	OphMeasurementComponent.prototype.buildVisualAcuitySection = function( resultDatesArray, eventsArray) {
		var subSection = [];
		var subHTML = "";

		var subSectionText = this.ophmI18n.VISUAL_ACUITY;

           //get powerform params
		    var eventId = this.groupVisualAcuity.EventId;
			if (eventId > 0) {
			
				var params = this.retrieveFormParams(eventsArray, eventId);
				var sectionName = "visualAcuity";
				var visAcuityId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				
				this.paramVisualAcuity = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+ visAcuityId +"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}	
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			var prevResult = 1;
			for (var i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupVisualAcuity['ResultInd'+i]){
					continue;
				}
				
				var scODResult = this.groupMapResults('vis_acuity_od_sc',i);
				var ccODResult = this.groupMapResults('vis_acuity_od_cc',i);
				var cCLODResult = this.groupMapResults('vis_acuity_od_ccl',i);
				var phODResult =  this.groupMapResults('vis_acuity_od_ph',i);
				var LVODResult = this.groupMapResults('vis_acuity_od_lvt',i);
				var scOSResult = this.groupMapResults('vis_acuity_os_sc',i);
				var ccOSResult = this.groupMapResults('vis_acuity_os_cc',i);
				var cCLOSResult = this.groupMapResults('vis_acuity_os_ccl',i);
				var phOSResult = this.groupMapResults('vis_acuity_os_ph',i);
				var LVOSResult = this.groupMapResults('vis_acuity_os_lvt',i);
				var DCorrectionResult = this.groupMapResults('vis_acuity_dis',i);	
				var scnearODResult = this.groupMapResults('vis_acuity_od_sc_near',i);
				var ccnearODResult = this.groupMapResults('vis_acuity_od_cc_near',i);
				var cCLnearODResult = this.groupMapResults('vis_acuity_od_ccl_near',i);
				var TestingAtODResult = this.groupMapResults('vis_acuity_od_testing',i);
				var scnearOSResult = this.groupMapResults('vis_acuity_os_sc_near',i);
				var ccnearOSResult = this.groupMapResults('vis_acuity_os_cc_near',i);
				var cCLnearOSResult = this.groupMapResults('vis_acuity_os_ccl_near',i);
				var TestingAtOSResult = this.groupMapResults('vis_acuity_os_testing',i);
				var NCorrectionResult = this.groupMapResults('vis_acuity_near',i);
				var CommentResult = this.groupMapResults('vis_acuity_com',i);
				
				var currentDate = new Date();
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);
				
				
				
				if (i > 0 && prevResult) {
					var prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}
				if (i > 0){
					subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");
				} 
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-t1'>"+this.ophmI18n.DIST_CORRECTION +"</td><td class='oph-measure-refrac-t1'>" + DCorrectionResult + "</td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'>"+this.ophmI18n.NEAR_CORRECTION +"</td><td class='oph-measure-refrac-t1'>" + NCorrectionResult + "</td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td></tr>");
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.EYE +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.SC +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>cc</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.CCL +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>ph</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.LOW_VISION_TEST +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.EYE +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.SC_NEAR +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.CC_NEAR +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.CCL_NEAR +"</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>"+this.ophmI18n.TESTING_AT+"</td></tr>");
				subSection.push("<tr><td  class='oph-measure-refrac-t1'>"+this.ophmI18n.OD +"</td><td class='oph-measure-refrac-t1'>" + scODResult + "</td><td class='oph-measure-refrac-t1'>" + ccODResult + "</td><td class='oph-measure-refrac-t1'>" + cCLODResult + "</td><td class='oph-measure-refrac-t1'>" + phODResult + "</td><td class='oph-measure-refrac-t1'>" + LVODResult + "</td><td class='oph-measure-refrac-t1' oph-measure-vis-acuity-th'>"+this.ophmI18n.OD +"</td><td class='oph-measure-refrac-t1'>" + scnearODResult + "</td><td class='oph-measure-refrac-t1'>" + ccnearODResult + "</td><td class='oph-measure-refrac-t1'>" + cCLnearODResult + "</td><td class='oph-measure-refrac-t1'>" + TestingAtODResult + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-refrac-t1'>"+this.ophmI18n.OS +"</td><td class='oph-measure-refrac-t1'>" + scOSResult + "</td><td class='oph-measure-refrac-t1'>" + ccOSResult + "</td><td class='oph-measure-refrac-t1'>" + cCLOSResult + "</td><td class='oph-measure-refrac-t1'>" + phOSResult + "</td><td class='oph-measure-refrac-t1'>" + LVOSResult + "</td><td class='oph-measure-refrac-t1' oph-measure-vis-acuity-th'>"+this.ophmI18n.OS +"</td><td class='oph-measure-refrac-t1'>" + scnearOSResult + "</td><td class='oph-measure-refrac-t1'>" + ccnearOSResult + "</td><td class='oph-measure-refrac-t1'>" + cCLnearOSResult + "</td><td class='oph-measure-refrac-t1'>" + TestingAtOSResult + "</td></tr>");
				
				if(CommentResult !== "--"){
					subSection.push("<tr><td class='oph-measure-refrac-t1'>Comments</td><td colspan='10' class='oph-measure-refrac-t1'>"+CommentResult+"</td></tr>");
				}
				
				subSection.push("</table>");

				
			
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

		subHTML = subSection.join("");
		return subHTML;
	};
	
/**
	 * Returns HTML Markup required to build  Refraction Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for  Refraction section
	 */
    	
	OphMeasurementComponent.prototype.buildRefractionSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";
		
		var subSectionText = this.ophmI18n.REFRACTION ;


           //get powerform params
            var eventId = this.groupRefract.EventId;
			if (eventId > 0) {
				var params = this.retrieveFormParams(eventsArray, eventId);	
				var	sectionName	= "refraction";				
				var refractionId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramRefraction ={ "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='"+refractionId +"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else{
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
				
			}  
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			var prevResult = 1;
			for (var i = 0, il = resultDatesArray.length; i < il; i++) {
				
			if (i > 0 && !this.groupRefract['ResultInd'+i]){
					continue;
				}	
			
			var type = this.groupMapResults('refrac_type',i);
			var ODSpherical = this.groupMapResults('refrac_od_sph',i);
			var ODCylindrical = this.groupMapResults('refrac_od_cyl',i);
			var ODAxis = this.groupMapResults('refrac_od_axis',i);
			var ODVAFar = this.groupMapResults('refrac_od_va_far',i);
			var ODAdd = this.groupMapResults('refrac_od_add',i);
			var ODVANear = this.groupMapResults('refrac_od_va_near',i);
			var ODHPrism = this.groupMapResults('refrac_od_hor_prism',i);
			var ODHBase = this.groupMapResults('refrac_od_hor_base',i);
			var ODVPrsim = this.groupMapResults('refrac_od_vert_prism',i);
			var ODVBase = this.groupMapResults('refrac_od_vert_base',i);
			var ODVDist = this.groupMapResults('refrac_od_vd',i);
			var OSSpherical = this.groupMapResults('refrac_os_sph',i);
			var OSCylindrical = this.groupMapResults('refrac_os_cyl',i);
			var OSAxis = this.groupMapResults('refrac_os_axis',i);
			var OSVAFar = this.groupMapResults('refrac_os_va_far',i);
			var OSAdd = this.groupMapResults('refrac_os_add',i);
			var OSVANear = this.groupMapResults('refrac_os_va_near',i);
			var OSHPrism = this.groupMapResults('refrac_os_hor_prism',i);
			var OSHBase = this.groupMapResults('refrac_os_hor_base',i);
			var OSVPrsim = this.groupMapResults('refrac_os_vert_prism',i);
			var OSVBase = this.groupMapResults('refrac_os_vert_base',i);
			var OSVDist = this.groupMapResults('refrac_os_vd',i);
			var PDist = this.groupMapResults('refrac_pup',i);
			var CommentResult = this.groupMapResults('refrac_com',i);
			var currentDate = new Date();
			currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					var prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if (i > 0){
					subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");
				} 
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.TYPE + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SPHERICAL+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.CYLINDRICAL  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.AXIS  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VA_FAR+ "</td>");
				subSection.push("<td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.ADD + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VA_NEAR+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.HORIZONTAL_PRISM  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.HORIZONTAL_BASE  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTICAL_PRISM + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTICAL_BASE+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTEX_DISTANCE+ "</td></tr>");
				subSection.push("<tr><td class='oph-measure-refrac-t1'>" + type + "</td><td class='oph-measure-refrac-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-refrac-t1'>" + ODSpherical + "</td><td class='oph-measure-refrac-t1'>" + ODCylindrical + "</td><td class='oph-measure-refrac-t1'>" + ODAxis + "</td><td class='oph-measure-refrac-t1'>" + ODVAFar + "</td>");
				subSection.push("<td class='oph-measure-refrac-t1'>" + ODAdd  + "</td><td class='oph-measure-refrac-t1'>" + ODVANear + "</td><td class='oph-measure-refrac-t1'>" + ODHPrism + "</td><td class='oph-measure-refrac-t1'>" + ODHBase + "</td><td class='oph-measure-refrac-t1'>" + ODVPrsim + "</td><td class='oph-measure-refrac-t1'>" + ODVBase + "</td><td class='oph-measure-refrac-t1'>" + ODVDist + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-refrac-t1'> </td><td class='oph-measure-refrac-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-refrac-t1'>" + OSSpherical + "</td><td class='oph-measure-refrac-t1'>" + OSCylindrical + "</td><td class='oph-measure-refrac-t1'>" + OSAxis + "</td><td class='oph-measure-refrac-t1'>" + OSVAFar + "</td>");
				subSection.push("<td class='oph-measure-refrac-t1'>" + OSAdd  + "</td><td class='oph-measure-refrac-t1'>" + OSVANear + "</td><td class='oph-measure-refrac-t1'>" + OSHPrism + "</td><td class='oph-measure-refrac-t1'>" + OSHBase + "</td><td class='oph-measure-refrac-t1'>" + OSVPrsim + "</td><td class='oph-measure-refrac-t1'>" + OSVBase + "</td><td class='oph-measure-refrac-t1'>" + OSVDist + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-refrac-t1'>" + this.ophmI18n.PUPILLARY_DISTANCE + "</td><td class='oph-measure-refrac-t1'>" + PDist + "</td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td></tr>");
				
				
				if(CommentResult !== "--"){
					subSection.push("<tr><td class='oph-measure-refrac-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='12' class='oph-measure-refrac-t1'>"+CommentResult+"</td></tr>");
				}
				
				subSection.push("</table>");
											
				if(this.groupRefract2['ResultInd' + i]){
					var type2 = this.groupMapResults('refrac_type_2',i);
					var ODSpherical2 = this.groupMapResults('refrac_od_sph_2',i);
					var ODCylindrical2 = this.groupMapResults('refrac_od_cyl_2',i);
					var ODAxis2 = this.groupMapResults('refrac_od_axis_2',i);
					var ODVAFar2 = this.groupMapResults('refrac_od_va_far_2',i);
					var ODAdd2 = this.groupMapResults('refrac_od_add_2',i);
					var ODVANear2 = this.groupMapResults('refrac_od_va_near_2',i);
					var ODHPrism2 = this.groupMapResults('refrac_od_hor_prism_2',i);
					var ODHBase2 = this.groupMapResults('refrac_od_hor_base_2',i);
					var ODVPrsim2 = this.groupMapResults('refrac_od_vert_prism_2',i);
					var ODVBase2 = this.groupMapResults('refrac_od_vert_base_2',i);
					var ODVDist2 = this.groupMapResults('refrac_od_vd_2',i);
					var OSSpherical2 = this.groupMapResults('refrac_os_sph_2',i);
					var OSCylindrical2 = this.groupMapResults('refrac_os_cyl_2',i);
					var OSAxis2 = this.groupMapResults('refrac_os_axis_2',i);
					var OSVAFar2 = this.groupMapResults('refrac_os_va_far_2',i);
					var OSAdd2 = this.groupMapResults('refrac_os_add_2',i);
					var OSVANear2 = this.groupMapResults('refrac_os_va_near_2',i);
					var OSHPrism2 = this.groupMapResults('refrac_os_hor_prism_2',i);
					var OSHBase2 = this.groupMapResults('refrac_os_hor_base_2',i);
					var OSVPrsim2 = this.groupMapResults('refrac_os_vert_prism_2',i);
					var OSVBase2 = this.groupMapResults('refrac_os_vert_base_2',i);
					var OSVDist2 = this.groupMapResults('refrac_os_vd_2',i);
					var PDist2 = this.groupMapResults('refrac_pup_2',i);
					var CommentResult2 = this.groupMapResults('refrac_com_2',i);
					subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>Type</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SPHERICAL+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.CYLINDRICAL  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.AXIS  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VA_FAR+ "</td>");
					subSection.push("<td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.ADD + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VA_NEAR+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.HORIZONTAL_PRISM  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.HORIZONTAL_BASE  + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTICAL_PRISM + "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTICAL_BASE+ "</td><td class='oph-measure-refrac-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTEX_DISTANCE+ "</td></tr>");
					subSection.push("<tr><td class='oph-measure-refrac-t1'>" + type2 + "</td><td class='oph-measure-refrac-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-refrac-t1'>" + ODSpherical2 + "</td><td class='oph-measure-refrac-t1'>" + ODCylindrical2 + "</td><td class='oph-measure-refrac-t1'>" + ODAxis2 + "</td><td class='oph-measure-refrac-t1'>" + ODVAFar2 + "</td>");
					subSection.push("<td class='oph-measure-refrac-t1'>" + ODAdd2  + "</td><td class='oph-measure-refrac-t1'>" + ODVANear2 + "</td><td class='oph-measure-refrac-t1'>" + ODHPrism2 + "</td><td class='oph-measure-refrac-t1'>" + ODHBase2 + "</td><td class='oph-measure-refrac-t1'>" + ODVPrsim2 + "</td><td class='oph-measure-refrac-t1'>" + ODVBase2 + "</td><td class='oph-measure-refrac-t1'>" + ODVDist2 + "</td></tr>");
					subSection.push("<tr><td class='oph-measure-refrac-t1'> </td><td class='oph-measure-refrac-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-refrac-t1'>" + OSSpherical2 + "</td><td class='oph-measure-refrac-t1'>" + OSCylindrical2 + "</td><td class='oph-measure-refrac-t1'>" + OSAxis2 + "</td><td class='oph-measure-refrac-t1'>" + OSVAFar2 + "</td>");
					subSection.push("<td class='oph-measure-refrac-t1'>" + OSAdd2  + "</td><td class='oph-measure-refrac-t1'>" + OSVANear2 + "</td><td class='oph-measure-refrac-t1'>" + OSHPrism2 + "</td><td class='oph-measure-refrac-t1'>" + OSHBase2 + "</td><td class='oph-measure-refrac-t1'>" + OSVPrsim2 + "</td><td class='oph-measure-refrac-t1'>" + OSVBase2 + "</td><td class='oph-measure-refrac-t1'>" + OSVDist2 + "</td></tr>");
					
					
					subSection.push("<tr><td class='oph-measure-refrac-t1'>" + this.ophmI18n.PUPILLARY_DISTANCE + "</td><td class='oph-measure-refrac-t1'>" + PDist2 + "</td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td><td class='oph-measure-refrac-t1'></td></tr>");
					
					if(CommentResult2 !== "--"){
						subSection.push("<tr><td class='oph-measure-refrac-t1'>Comments Type2</td><td colspan='12' class='oph-measure-refrac-t1'>"+CommentResult2+"</td></tr>");
					}
					
					
					subSection.push("</table>");
									
				}	
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");


		subHTML = subSection.join("");
		return subHTML;
		
	};
	
	
	/**
	 * Returns HTML Markup required to build Retinal Glare Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered 
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Retinal Glare section
	 */

	OphMeasurementComponent.prototype.buildRetinalGlareSection = function(resultDatesArray, eventsArray) {
	
		var subSection = [];
		var subHTML = "";		
		var both = 0;
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";
		subSection.push("<div class='oph-measure-sub-sec-full'>");
		
		if ((this.getDisplayRetAcuity() && this.groupRetAcuity.ResultInd) && (this.groupGlare.ResultInd && this.getDisplayGlare())) {
			both = 1;
			subSection.push("<div class='oph-measure-ret-glare-sec'><div class='oph-measure-ret-sec'>");

		}
		if (this.getDisplayRetAcuity() && this.groupRetAcuity.ResultInd) {
			subSectionText = this.ophmI18n.RETINAL_ACUITY;
			
           //get powerform params
            eventId = this.groupRetAcuity.EventId;
            
			if (eventId > 0) {	
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName = "retinalAcuity";
				var retinalId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				
				this.paramRetinal = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='"+ retinalId +"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else{
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			} 
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;

			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupRetAcuity['ResultInd'+i]){
					continue;
				}
				
				var ODResult = this.groupMapResults('ret_acuity_od',i);
				var OSResult = this.groupMapResults('ret_acuity_os',i);
				var RetComments = this.groupMapResults('ret_acuity_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>"+ this.ophmI18n.EYE + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.LATEST  + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + ODResult + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + OSResult + "</td></tr>");
				
				if(RetComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td class='oph-measure-vis-acuity-t1'>"+RetComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				
				
				

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");
			if(both){
				subSection.push("</div>");	
			}
		}

		if (this.getDisplayGlare() && this.groupGlare.ResultInd) {
			if (both) {
				subSection.push("<div class='oph-measure-glare-sec'>");
			}

			subSectionText = this.ophmI18n.GLARE;
            //get powerform params		   
            eventId = this.groupGlare.EventId;

			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "glare";			
				var glareId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				
				this.paramGlare = { "encntr_id" : params[1], "activity_id" : params[2] , "section" : sectionName};				
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+glareId +"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");			
			}
			else{
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupGlare['ResultInd'+i]){
					continue;
				}
				
				var GSetting = this.groupMapResults('glare_setting',i);
				var GGlare = this.groupMapResults('glare_glare',i);
				var GODResult = this.groupMapResults('glare_od',i);
				var GOSResult = this.groupMapResults('glare_os',i);
				var GComments = this.groupMapResults('glare_com',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.SETTING + "</td><td  class='oph-measure-vis-acuity-t1'>" + GSetting + "</td><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.GLARE_LABEL + "</td><td class='oph-measure-vis-acuity-t1'>" + GGlare + "</td></tr>");
				
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'></td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.LATEST  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'></td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td  class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'>" + GODResult + "</td><td  class='oph-measure-vis-acuity-t1'></td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td  class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'>" + GOSResult + "</td><td  class='oph-measure-vis-acuity-t1'></td></tr>");
				
				if(GComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='3' class='oph-measure-vis-acuity-t1'>"+GComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
			


			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if (both) {
				subSection.push("</div></div>");
			}

		}
		
		subSection.push("</div>");
		subHTML = subSection.join("");
		
		return subHTML;
	};

	/**
	 * Returns HTML Markup required to build Pupil Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Pupil section
	 */
	OphMeasurementComponent.prototype.buildPupilSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";		

		var subSectionText = this.ophmI18n.PUPIL;
		
			subSection.push("<div class='oph-measure-sub-sec-full'>");
           //get powerform params
            var eventId = this.groupPupEqual.EventId;
			if (eventId > 0) {
				var params = this.retrieveFormParams(eventsArray, eventId);
				var	sectionName	= "pupil";
				var pupilId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramPupil = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id = '"+ pupilId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			var prevResult = 1;
			for (var i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupPupEqual['ResultInd'+i]){
					continue;
				}
				
				var pupEqual = this.groupMapResults('pup_equal',i);
				var pupODDid = this.groupMapResults('pup_od_did',i);
				var pupODRapdid = this.groupMapResults('pup_od_rapdid',i);
				var pupODSid = this.groupMapResults('pup_od_sid',i);
				var pupOSDid = this.groupMapResults('pup_os_did',i);
				var pupOSRapdid = this.groupMapResults('pup_os_rapdid',i);
				var pupOSSid = this.groupMapResults('pup_os_sid',i);
				var pupODDil = this.groupMapResults('pup_od_dil',i);
				var pupODRapdil = this.groupMapResults('pup_od_rapdil',i);
				var pupODSil = this.groupMapResults('pup_od_sil',i);
				var pupOSDil = this.groupMapResults('pup_os_dil',i);
				var pupOSRapdil = this.groupMapResults('pup_os_rapdil',i);
				var pupOSSil = this.groupMapResults('pup_os_sil',i);
				var pupComment = this.groupMapResults('pup_com',i);
				
				
				var currentDate = new Date();
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					var prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}
				
				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<table class='oph-measure-tbl'><tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.PUPILS_EQUAL + "</td><td class='oph-measure-vis-acuity-t1'>" + pupEqual + "</td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td></tr>");
				
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>------" + this.ophmI18n.IN_DARK+ "------</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th' >------" + this.ophmI18n.IN_LIGHT+ "------</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.DIAMETER  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.RAPD + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SHAPE+ "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.DIAMETER  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.RAPD + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SHAPE+ "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + pupODDid + "</td><td class='oph-measure-vis-acuity-t1'>"+ pupODRapdid + "</td><td class='oph-measure-vis-acuity-t1'>" + pupODSid + "</td><td class='oph-measure-vis-acuity-t1'>" + pupODDil+ "</td><td class='oph-measure-vis-acuity-t1'>" + pupODRapdil + "</td><td class='oph-measure-vis-acuity-t1'>" + pupODSil + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + pupOSDid + "</td><td class='oph-measure-vis-acuity-t1'>"+ pupOSRapdid + "</td><td class='oph-measure-vis-acuity-t1'>" + pupOSSid + "</td><td class='oph-measure-vis-acuity-t1'>" + pupOSDil+ "</td><td class='oph-measure-vis-acuity-t1'>" + pupOSRapdil + "</td><td class='oph-measure-vis-acuity-t1'>" + pupOSSil + "</td></tr>");
				
				if(pupComment !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='6' class='oph-measure-vis-acuity-t1'>"+pupComment+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				
				
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div></div>");

		subHTML = subSection.join("");
		
		return subHTML;
	};
	
/**
	 * Returns HTML Markup required to build Auto Kerato Retino Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Auto Kerato Retino section
	 */	
	OphMeasurementComponent.prototype.buildAutoKeratoRetinoSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";
		var sections = 0;
		var autoRefractDisp = 0;
		var retinoDisp = 0;
		var keratoDisp = 0;
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";
		
		
		
		
		if (this.getDisplayAutoRefract() && this.groupAutoRefract.ResultInd){
			sections = sections + 1;
			autoRefractDisp = 1;
		}
		if (this.getDisplayRetino() && this.groupRetino.ResultInd){
			sections = sections + 1;
			retinoDisp = 1;
		}
		if (this.getDisplayKerato() && this.groupKerato.ResultInd){
			sections = sections + 1;
			keratoDisp = 1;
		}
		
		var leftSec = false;
		var rightSec = false;

		if(sections === 3){
			subSection.push("<div class='oph-measure-three-sec-main'><div class='oph-measure-three-sec-left'>");
		}else if(sections === 2){
				subSection.push("<div class='oph-measure-three-sec-main'>");
		}else if(sections === 1){
			subSection.push("<div class='oph-measure-sub-sec-full'>");
		}
		
		if (autoRefractDisp === 1) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left1'>");
			}else if(sections === 2){
				subSection.push("<div class='oph-measure-two-sec-left'>");
				leftSec = true;
			}
			
			subSectionText = this.ophmI18n.AUTOREFRACTION;
           //get powerform params
            eventId = this.groupAutoRefract.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName = "autoRefract";
				var autoRefractId = this.compId+"-"+params[1]+"-"+params[2]+"-"+sectionName;
				
				this.paramAutoRefract = { "encntr_id" : params[1], "activity_id" : params[2] , "section": sectionName  };				
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+ autoRefractId + "'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupAutoRefract['ResultInd'+i]){
					continue;
				}
				
				var ODSph = this.groupMapResults('auto_refrac_od_sph',i);
				var ODCyl = this.groupMapResults('auto_refrac_od_cyl',i);
				var ODAxis = this.groupMapResults('auto_refrac_od_axis',i);
				var ODVertex = this.groupMapResults('auto_refrac_od_vertex',i);
				var OSSph = this.groupMapResults('auto_refrac_os_sph',i);
				var OSCyl = this.groupMapResults('auto_refrac_os_cyl',i);
				var OSAxis = this.groupMapResults('auto_refrac_os_axis',i);
				var OSVertex = this.groupMapResults('auto_refrac_os_vertex',i);
				var pupDist = this.groupMapResults('auto_refrac_pup',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SPHERICAL+ "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.CYLINDRICAL  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.AXIS  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.VERTEX_DISTANCE+ "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + ODSph + "</td><td class='oph-measure-vis-acuity-t1'>" + ODCyl + "</td><td class='oph-measure-vis-acuity-t1'>" + ODAxis + "</td><td class='oph-measure-vis-acuity-t1'>" + ODVertex + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + OSSph + "</td><td class='oph-measure-vis-acuity-t1'>" + OSCyl + "</td><td class='oph-measure-vis-acuity-t1'>" + OSAxis + "</td><td class='oph-measure-vis-acuity-t1'>" + OSVertex + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.PUPILLARY_DISTANCE + "</td><td class='oph-measure-vis-acuity-t1'>" + pupDist + "</td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td></tr>");
				subSection.push("</table>");
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");
			subSection.push("</div>");
		}
		
		if (keratoDisp === 1) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left2'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.KERATOMETRY;
           //get powerform params
            eventId = this.groupKerato.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName = "keratoMetry";
				var keratoId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				
				this.paramKerato = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName };	
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='" + keratoId +"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				if (i > 0 && !this.groupKerato['ResultInd'+i]){
					continue;
				}
				var KType = this.groupMapResults('kerato_type',i);
				var ODK1 = this.groupMapResults('kerato_od_k1',i);
				var ODK1Axis = this.groupMapResults('kerato_od_k1_axis',i);
				var ODK2 = this.groupMapResults('kerato_od_k2',i);
				var ODK2Axis = this.groupMapResults('kerato_od_k2_axis',i);
				var ODMires = this.groupMapResults('kerato_od_mires',i);
				var OSK1 = this.groupMapResults('kerato_os_k1',i);
				var OSK1Axis = this.groupMapResults('kerato_os_k1_axis',i);
				var OSK2 = this.groupMapResults('kerato_os_k2',i);
				var OSK2Axis = this.groupMapResults('kerato_os_k2_axis',i);
				var OSMires = this.groupMapResults('kerato_os_mires',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				//subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>Type</span><span class='oph-measure-vis-acuity-sec'>" + KType + "</span>");
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>Type</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.K1  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.K1_AXIS  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.K2  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.K2_AXIS  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.MIRES + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + KType + "</td><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + ODK1 + "</td><td class='oph-measure-vis-acuity-t1'>" + ODK1Axis + "</td><td class='oph-measure-vis-acuity-t1'>" + ODK2 + "</td><td class='oph-measure-vis-acuity-t1'>" + ODK2Axis + "</td><td class='oph-measure-vis-acuity-t1'>" + ODMires + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'></td><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS  + "</td><td class='oph-measure-vis-acuity-t1'>" + OSK1 + "</td><td class='oph-measure-vis-acuity-t1'>" + OSK1Axis + "</td><td class='oph-measure-vis-acuity-t1'>" + OSK2 + "</td><td class='oph-measure-vis-acuity-t1'>" + OSK2Axis + "</td><td class='oph-measure-vis-acuity-t1'>" + OSMires + "</td></tr>");
				subSection.push("</table>");
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
				if(leftSec && rightSec){
					subSection.push("</div></div>");
				}else{
					subSection.push("</div>");
				}
				
			}else{
			subSection.push("</div>");
			}

		}
		if (retinoDisp === 1) {
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-right'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.RETINOSCOPY;
           //get powerform params
            eventId = this.groupRetino.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);	
				sectionName = "retinoScopy";
				var retinoId = this.compId+"-"+params[1]+"-"+params[2]+"-"+sectionName;
				this.paramRetino = {"encntr_id" : params[1], "activity_id" : params[2] , "section" : sectionName};
				
				
				
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='" +retinoId + "'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				if (i > 0 && !this.groupRetino['ResultInd'+i]){
					continue;
				}
				var RType = this.groupMapResults('retino_type',i);
				var RODSph = this.groupMapResults('retino_od_sph',i);
				var RODCyl = this.groupMapResults('retino_od_cyl',i);
				var RODAxis = this.groupMapResults('retino_od_axis',i);
				var ROSSph = this.groupMapResults('retino_os_sph',i);
				var ROSCyl = this.groupMapResults('retino_os_cyl',i);
				var ROSAxis = this.groupMapResults('retino_os_axis',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>Type</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.SPHERICAL+ "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.CYLINDRICAL  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.AXIS  + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + RType + "</td><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + RODSph + "</td><td class='oph-measure-vis-acuity-t1'>" + RODCyl + "</td><td class='oph-measure-vis-acuity-t1'>" + RODAxis + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'></td><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + ROSSph + "</td><td class='oph-measure-vis-acuity-t1'>" + ROSCyl + "</td><td class='oph-measure-vis-acuity-t1'>" + ROSAxis + "</td></tr>");
				subSection.push("</table>");
	
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
					subSection.push("</div></div>");
			}else{
				subSection.push("</div>");
			}

		}
		
		
		subHTML = subSection.join("");

		return subHTML;
	};
	
/**
	 * Returns HTML Markup required to build Intra Ocular Dilation Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Intra Ocular Dilation section
	 */
	
	OphMeasurementComponent.prototype.buildIntraocularDilationSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";		
		var both = 0;
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";

		subSection.push("<div class='oph-measure-sub-sec-full'>");
		
		if((this.getDisplayIOP() && this.groupIOP.ResultInd) && (this.getDisplayDilation() && this.groupDilation.ResultInd)){
			both = 1;
			subSection.push("<div class='oph-measure-iop-dil-sec'><div class='oph-measure-ret-sec'>");

		}		
	
		if (this.getDisplayIOP() && this.groupIOP.ResultInd) {
			subSectionText = this.ophmI18n.IOP;
           //get powerform params
			eventId = this.groupIOP.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName = "iop";	
				var iopId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramIOP = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName };		
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+iopId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");
			
           
            var groupId = 0;
			
			var eventCodeOD = this.GroupMap.iop_od && this.GroupMap.iop_od.evtCode ? this.GroupMap.iop_od.evtCode : 0;
            var eventCodeOS = this.GroupMap.iop_os && this.GroupMap.iop_os.evtCode ? this.GroupMap.iop_os.evtCode : 0;
				
 			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupIOP['ResultInd'+i]){
					continue;
				}
				var IOPMethod = this.groupMapResults('iop_method',i);
				var IOPTime = this.groupMapResults('iop_time',i);
				var IOPOD = this.groupMapResults('iop_od',i);
				var IOPOS = this.groupMapResults('iop_os',i);
				var IOPComments = this.groupMapResults('iop_com',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				var graphId = this.compId+"-"+eventCodeOD+"-"+eventCodeOS+"-"+groupId;
				this.paramGraph = { "eventCodeOD" : eventCodeOD, "eventCodeOS" : eventCodeOS, "groupId" : groupId};
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.IOP_LABEL  + "</td></tr>");
			
				
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'><a id='"+graphId+"'>" + this.ophmI18n.OD + "</a></td><td class='oph-measure-vis-acuity-t1'>" + IOPOD + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'><a id='"+graphId+"-2"+"'>" + this.ophmI18n.OS + "</a></td><td class='oph-measure-vis-acuity-t1'>" + IOPOS + "</td></tr>");
				
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.METHOD + "</td><td class='oph-measure-vis-acuity-t1'>" + IOPMethod + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.TIME_OF_DAY + "</td><td class='oph-measure-vis-acuity-t1'>" + IOPTime + "</td></tr>");
				
				if(IOPComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td class='oph-measure-vis-acuity-t1'>"+IOPComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if (both) {
				subSection.push("</div>");
			}

		}

		if (this.getDisplayDilation() && this.groupDilation.ResultInd) {
			if (both) {
				subSection.push("<div class='oph-measure-glare-sec'>");
			}

			subSectionText = this.ophmI18n.DILATION;
           //get powerform params
             eventId = this.groupDilation.EventId;
			if (eventId > 0) {
				 params = this.retrieveFormParams(eventsArray, eventId);
				 sectionName = "dilation";
				var dilationId = this.compId+"-"+params[1]+"-"+params[2] + "-" +sectionName;
				this.paramDilation = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='" + dilationId + "'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupDilation['ResultInd'+i]){
					continue;
				}
				var DEye = this.groupMapResults('dilation_eye',i);
				var DTime = this.groupMapResults('dilation_time',i);
				var DMed = this.groupMapResults('dilation_med',i);
				var DComments = this.groupMapResults('dilation_com',i);
				var DResp = this.groupMapResults('dilation_resp',i);
				var DEdu = this.groupMapResults('dilation_edu',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE_DILATED  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.TIME_DILATED+ "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.MEDICATION_FOR_DILATION + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EDUCATION_DILATION  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.DILATION_RESPONSE  + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + DEye + "</td><td class='oph-measure-vis-acuity-t1'>" + DTime + "</td><td  class='oph-measure-vis-acuity-t1'>" + DMed + "</td><td class='oph-measure-vis-acuity-t1'>" + DEdu + "</td><td class='oph-measure-vis-acuity-t1'>" + DResp + "</td></tr>");
				
				if(DComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='4' class='oph-measure-vis-acuity-t1'>"+DComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if (both) {
				subSection.push("</div></div>");
			}

		}
		
		subSection.push("</div>");
			
		subHTML = subSection.join("");

		return subHTML;
	};

	/**
	 * Returns HTML Markup required to build Motility Visual Fields Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Motility Visual Fields section
	 */
OphMeasurementComponent.prototype.buildMotilityVisFieldsSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";		
		
		var both = 0;
		subSection.push("<div class='oph-measure-sub-sec-full'>");
		if((this.getDisplayMotility() && this.groupMotility.ResultInd) && (this.getDisplayVisFields() && this.groupVisualFields.ResultInd)) {
			both = 1;
			subSection.push("<div class='oph-measure-iop-dil-sec'><div class='oph-measure-ret-sec'>");
		}
		if(this.getDisplayMotility() && this.groupMotility.ResultInd){
			subSectionText = this.ophmI18n.MOTILITY;
           //get powerform params
            eventId = this.groupMotility.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);	
				sectionName	= "motility";
				var motilityId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramMotility = {"encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+motilityId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				
				if (i > 0 && !this.groupMotility['ResultInd'+i]){
					continue;
				}
				var MEvent = this.groupMapResults('motility_event',i);
				var MODIO = this.groupMapResults('motility_od_io',i);
				var MODMR = this.groupMapResults('motility_od_mr',i);
				var MODSO = this.groupMapResults('motility_od_so',i);
				var MODSR = this.groupMapResults('motility_od_sr',i);
				var MODLR = this.groupMapResults('motility_od_lr',i);
				var MODIR = this.groupMapResults('motility_od_ir',i);
				var MOSIO = this.groupMapResults('motility_os_io',i);
				var MOSMR = this.groupMapResults('motility_os_mr',i);
				var MOSSO = this.groupMapResults('motility_os_so',i);
				var MOSSR = this.groupMapResults('motility_os_sr',i);
				var MOSLR = this.groupMapResults('motility_os_lr',i);
				var MOSIR = this.groupMapResults('motility_os_ir',i);
				var MComments = this.groupMapResults('motility_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" + this.ophmI18n.OCULAR_MOTILITY + "</span><span class='oph-measure-vis-acuity-sec'>" + MEvent + "</span>");
				if(this.groupMotilityHDiag['ResultInd' + i]){
					
					subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-motility-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.OD + "</td><td class='oph-measure-motility-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-motility-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.OS + "</td><td class='oph-measure-motility-t1 oph-measure-vis-acuity-th'> </td><td class='oph-measure-vis-acuity-th'> </td></tr>");
					
					subSection.push("<tr><td class= 'oph-measure-motility-t1'>SR:</td><td class='oph-measure-motility-res oph-measure-border-right'>"+MODSR+"</td><td class='oph-measure-vis-acuity-t1'> </td><td class='oph-measure-motility-txt oph-measure-border-left'>IO:</td><td class='oph-measure-motility-t2'>"+MODIO+"</td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-motility-t1'>IO:</td><td class='oph-measure-motility-res oph-measure-border-right'>"+MOSIO+"</td><td class='oph-measure-vis-acuity-t1'> </td><td class='oph-measure-motility-txt oph-measure-border-left'>SR:</td><td class='oph-measure-motility-t2'>"+MOSSR+"</td></tr>");
					
					subSection.push("<tr><td  class='oph-measure-motility-t1'>LR:</td><td class='oph-measure-motility-res oph-measure-border-right'>"+MODLR+"</td><td class='oph-measure-vis-acuity-t1 oph-measure-border-bottom'></td><td class='oph-measure-motility-txt oph-measure-border-left'>MR:</td><td class='oph-measure-motility-t2'>"+MODMR+"</td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-motility-t1'>MR:</td><td class='oph-measure-motility-res oph-measure-border-right'>"+MOSMR+"</td><td class='oph-measure-vis-acuity-t1 oph-measure-border-bottom'> </td><td class='oph-measure-motility-txt oph-measure-border-left'>LR:</td><td class='oph-measure-motility-t2'>"+MOSLR+"</td></tr>");
					
					subSection.push("<tr><td  class='oph-measure-motility-t1 oph-measure-border-top'>IR:</td><td class='oph-measure-motility-res oph-measure-border-right oph-measure-border-top'>"+MODIR+"</td><td class='oph-measure-vis-acuity-t1 oph-measure-border-top'> </td><td class='oph-measure-motility-txt oph-measure-border-left oph-measure-border-top'>SO:</td><td class='oph-measure-motility-t2 oph-measure-border-top'>"+MODSO+"</td><td class='oph-measure-vis-acuity-t1 oph-measure-border-top'></td><td class='oph-measure-motility-t1 oph-measure-border-top'>SO:</td><td class='oph-measure-motility-res oph-measure-border-right oph-measure-border-top'>"+MOSSO+"</td><td class='oph-measure-vis-acuity-t1 oph-measure-border-top'> </td><td class='oph-measure-motility-t1 oph-measure-border-left oph-measure-border-top'>IR:</td><td class='oph-measure-motility-t2 oph-measure-border-top'>"+MOSIR+"</td></tr>");
					subSection.push("</table>");
					
					
				}		
				
				
				if(MComments !=="--" ){
					subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-txt'>" + this.ophmI18n.COMMENTS  + "</td><td>"+MComments+"</td></tr></table>");
				}
				

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");
			if(both){
				subSection.push("</div>");	
			}
			
		}
		
		if((this.getDisplayVisFields() && this.groupVisualFields.ResultInd)){
			
			if (both) {
				subSection.push("<div class='oph-measure-glare-sec'>");
			}
			subSectionText = this.ophmI18n.VISUAL_FIELDS;
           //get powerform params
			eventId = this.groupVisualFields.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "visualFields";					
				var visualFieldsId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName;
				this.paramVisualFields = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName };		
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+visualFieldsId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupVisualFields['ResultInd'+i]){
					continue;
				}
				var VFEvent = this.groupMapResults('vis_fields_event',i);
				var VFOSOutUp = this.groupMapResults('vis_fields_os_ctou',i);
				var VFOSInUp = this.groupMapResults('vis_fields_os_ctiu',i);
				var VFOSOutLow = this.groupMapResults('vis_fields_os_ctol',i);
				var VFOSInLow = this.groupMapResults('vis_fields_os_ctil',i);
				var VFODOutUp = this.groupMapResults('vis_fields_od_ctou',i);
				var VFODInUp = this.groupMapResults('vis_fields_od_ctiu',i);
				var VFODOutLow = this.groupMapResults('vis_fields_od_ctol',i);
				var VFODInLow = this.groupMapResults('vis_fields_od_ctil',i);
				var VFComments = this.groupMapResults('vis_fields_com',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" +this.ophmI18n.VISUAL_FIELDS+"</span><span class='oph-measure-vis-acuity-sec'>" + VFEvent + "</span>");
				
				if(this.groupVisualFieldsTDiag['ResultInd'+i]){
					subSection.push("<table class='oph-measure-tbl'><tr><td colspan='2' class='oph-measure-vis-acuity-th'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-th'> </td><td colspan='2' class='oph-measure-vis-acuity-th'>" + this.ophmI18n.OD + "</td></tr>");
					subSection.push("<tr><td  class='oph-measure-vis-fields-t1 oph-measure-vis-fields-right'>" + VFOSOutUp + "</td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-left'>" + VFOSInUp +"</td><td class='oph-measure-vis-fields-t1'> </td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-right'>" + VFODInUp + "</td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-left'>" + VFODOutUp + "</td></tr>");
					subSection.push("<tr><td  class='oph-measure-vis-fields-t1 oph-measure-border-bottom oph-measure-border-right'></td><td class='oph-measure-vis-fields-t1 oph-measure-border-bottom'></td><td class='oph-measure-vis-fields-t1'></td><td class='oph-measure-vis-fields-t1 oph-measure-border-right oph-measure-border-bottom'></td><td class='oph-measure-vis-fields-t1 oph-measure-border-bottom'></td></tr>");
					
					subSection.push("<tr><td  class='oph-measure-vis-fields-t1 oph-measure-vis-fields-right'>" + VFOSOutLow + "</td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-left'>" + VFOSInLow +"</td><td class='oph-measure-vis-fields-t1'> </td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-right'>" + VFODInLow + "</td><td class='oph-measure-vis-fields-t1 oph-measure-vis-fields-left'>" + VFODOutLow + "</td></tr>");
					subSection.push("<tr><td  class='oph-measure-vis-fields-t1 oph-measure-border-right'></td><td class='oph-measure-vis-fields-t1'></td><td class='oph-measure-vis-fields-t1'></td><td class='oph-measure-vis-fields-t1 oph-measure-border-right'></td><td class='oph-measure-vis-fields-t1'></td></tr>");
					subSection.push("</table>");
				}
				
				
				if(VFComments !=="--" ){
					subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-refrac-txt'>" + this.ophmI18n.COMMENTS  + "</td><td>"+VFComments+"</td></tr></table>");
				}
				
				
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");
			if (both) {
				subSection.push("</div></div>");
			}
			
			
		}
	
		subSection.push("</div>");

		subHTML = subSection.join("");
		
		return subHTML;
		
	};
	

	
/**
	 * Returns HTML Markup required to build Pachy OCT Lid Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Pachy OCT Lid section
	 */	
	
	OphMeasurementComponent.prototype.buildPachyOCTLidSection = function(resultDatesArray, eventsArray) {

		var subSection = [];
		var subHTML = "";
		var sections = 0;
		var patchyDisp = 0;
		var OCTDisp = 0;
		var LIDDisp = 0;
		var leftSec = false;
		var rightSec = false;
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";
		
		
		
		if (this.getDisplayPachy() && this.groupPachy.ResultInd){
			sections = sections + 1;
			patchyDisp = 1;
		}
		if (this.getDisplayOCT() && this.groupOCT.ResultInd){
			sections = sections + 1;
			OCTDisp = 1;
		}
		if (this.getDisplayLID() && this.groupLID.ResultInd){
			sections = sections + 1;
			LIDDisp = 1;
		}
		
		
		if(sections === 3){
			subSection.push("<div class='oph-measure-three-sec-main'><div class='oph-measure-three-sec-left'>");
		}else if(sections === 2){
				subSection.push("<div class='oph-measure-three-sec-main'>");
		}else if(sections === 1){
			subSection.push("<div class='oph-measure-sub-sec-full'>");
		}
		
		if (patchyDisp) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left1'>");
			}else if(sections === 2){
				subSection.push("<div class='oph-measure-two-sec-left'>");
				leftSec = true;
			}
			
			subSectionText = this.ophmI18n.PACHY;
           //get powerform params
            eventId = this.groupPachy.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "pachy";
				var pachyId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName;
				this.paramPachy = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+pachyId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupPachy['ResultInd'+i]){
					continue;
				}
				var PachyOD = this.groupMapResults('pachy_od',i);
				var PachyOS = this.groupMapResults('pachy_os',i);
				var PachyComments = this.groupMapResults('pachy_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.PACHYMETRY + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + PachyOD + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + PachyOS + "</td></tr>");
				
				if(PachyComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td class='oph-measure-vis-acuity-t1'>"+PachyComments+"</td></tr>");
				}
				
				
				
				
				subSection.push("</table>");
				

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			
			subSection.push("</div>");
			

		}
		
		if (OCTDisp) {
			
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left2'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.OCT;
           //get powerform params
            eventId = this.groupOCT.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "oct";
				var octId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName;
				this.paramOCT = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='"+octId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupOCT['ResultInd'+i]){
					continue;
				}
				
				var OCTODAnf = this.groupMapResults('oct_od_anf',i);
				var OCTODMt = this.groupMapResults('oct_od_mt',i);
				var OCTOSAnf = this.groupMapResults('oct_os_anf',i);
				var OCTOSMt = this.groupMapResults('oct_os_mt',i);
				var OCTComments = this.groupMapResults('oct_com',i);
				
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.AVERAGE_NERVE_FIBER  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.MACULAR_THICKNESS + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + OCTODAnf + "</td><td class='oph-measure-vis-acuity-t1'>" + OCTODMt + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + OCTOSAnf + "</td><td class='oph-measure-vis-acuity-t1'>" + OCTOSMt + "</td></tr>");
				
				if(OCTComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='2' class='oph-measure-vis-acuity-t1'>"+OCTComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				
				
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
				if(leftSec && rightSec){
					subSection.push("</div></div>");
				}else{
					subSection.push("</div>");
				}
				
			}else{
				subSection.push("</div>");
			}

		}
		if (LIDDisp) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-right'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.LID;
           //get powerform params
			eventId = this.groupLID.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "lid";
				var lidId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName;
				this.paramLid = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id ='"+lidId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupLID['ResultInd'+i]){
					continue;
				}
				
				var LIDODPf = this.groupMapResults('lid_od_pf',i);
				var LIDODLf = this.groupMapResults('lid_od_lf',i);
				var LIDODMrd1 = this.groupMapResults('lid_od_mrd1',i);
				var LIDOSPf = this.groupMapResults('lid_os_pf',i);
				var LIDOSLf = this.groupMapResults('lid_os_lf',i);
				var LIDOSMrd1 = this.groupMapResults('lid_os_mrd1',i);
				var LIDComments = this.groupMapResults('lid_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.PF + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.LF  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.MRD1 + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDODPf + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDODLf + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDODMrd1 + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDOSPf + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDOSLf + "</td><td class='oph-measure-vis-acuity-t1'>" + LIDOSMrd1 + "</td></tr>");
				
				if(LIDComments !== "--"){
						subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.COMMENTS  + "</td><td colspan='3' class='oph-measure-vis-acuity-t1'>"+LIDComments+"</td></tr>");
					}
				
				
				subSection.push("</table>");
				
				

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
					subSection.push("</div></div>");
			}else{
				subSection.push("</div>");
			}

		}
		

		subHTML = subSection.join("");
		
		
		return subHTML;
	};

/**
	 * Returns HTML Markup required to build Color Contrast Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Color Contrast section
	 */
	OphMeasurementComponent.prototype.buildColorContrastSection = function(resultDatesArray, eventsArray) {
		
		var subSection = [];
		var subHTML = "";		
		var both = 0;
		var eventId = "";
		var params = [];
		var subSectionText = "";
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";
			
		
		if ((this.getDisplayColor() && this.groupColor.ResultInd) && (this.groupContrast.ResultInd && this.getDisplayContrast())) {
			both = 1;
			subSection.push("<div class='oph-measure-iop-dil-sec'><div class='oph-measure-ret-sec'>");

		}else{
		
			subSection.push("<div class='oph-measure-sub-sec-full'>");
		
		}
		
		if (this.getDisplayColor() && this.groupColor.ResultInd) {
			
			subSectionText = this.ophmI18n.COLOR ;
           //get powerform params
            eventId = this.groupColor.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "color";
				var colorId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName;
				this.paramColor = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+colorId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupColor['ResultInd'+i]){
					continue;
				}
				
				var ColorType = this.groupMapResults('color_type',i);
				var ColorODCorrect = this.groupMapResults('color_od_correct',i);
				var ColorODPlate = this.groupMapResults('color_od_plate',i);
				var ColorODComments = this.groupMapResults('color_od_com',i);
				var ColorOSCorrect = this.groupMapResults('color_os_correct',i);
				var ColorOSPlate = this.groupMapResults('color_os_plate',i);
				var ColorOSComments = this.groupMapResults('color_os_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.TEST_TYPE + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorType + "</td><td class='oph-measure-vis-acuity-t1'></td><td class='oph-measure-vis-acuity-t1'></td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.EYE  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.CORRECT  + "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.TOTAL_PLATES+ "</td><td class='oph-measure-vis-acuity-t1 oph-measure-vis-acuity-th'>" + this.ophmI18n.COMMENTS  + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OD + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorODCorrect + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorODPlate + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorODComments + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.OS + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorOSCorrect + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorOSPlate + "</td><td class='oph-measure-vis-acuity-t1'>" + ColorOSComments + "</td></tr>");
				
				subSection.push("</table>");

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");
			subSection.push("</div>");

		}

		if (this.getDisplayContrast() && this.groupContrast.ResultInd) {
			if (both) {
				subSection.push("<div class='oph-measure-glare-sec'>");
			}

			 subSectionText = this.ophmI18n.CONTRAST;
           //get powerform params
             eventId = this.groupContrast.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);	
				sectionName	= "contrast";
				var contrastId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramContrast = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+contrastId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			 prevResult = 1;
			for ( i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupContrast['ResultInd'+i]){
					continue;
				}
				
				var ContrastResult = this.GroupMap.contrast_result && this.GroupMap.contrast_result['Result_' + i] ? this.GroupMap.contrast_result['Result_' + i] : "--";
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>"+this.ophmI18n.CONTRAST+"</span><span class='oph-measure-vis-acuity-sec'>" + ContrastResult + "</span>");

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if (both) {
				subSection.push("</div></div>");
			}else{
				subSection.push("</div>");
			}

		}
		
		subHTML = subSection.join("");
		
		return subHTML;
	};
	
/**
	 * Returns HTML Markup required to build Stereo Section
	 * @param component [REQUIRED] The component being rendered
	 * @param resultDatesArray [REQUIRED] Array of dates under which results were entered
	 * @param eventsArray [REQUIRED] Array of event level information
	 * @return {string} : The display result for Stereo section
	 */
	 
	OphMeasurementComponent.prototype.buildStereoSection = function(resultDatesArray, eventsArray) {
		

		var subSection = [];
		var subHTML = "";
		var titmusDisp = 0;
		var amslerDisp = 0;
		var worthDisp = 0;
		var leftSec = false;
		var rightSec = false;
		var subSectionText = "";
		var eventId = "";
		var params = [];
		var sectionName = "";
		var prevResult = 0;
		var i = 0;
		var il = 0;
		var currentDate = new Date(); 
		var prevSecText = "";
		
		var sections = 0;
		
		if (this.getDisplayTitmus() && this.groupTitmus.ResultInd){
			sections = sections + 1;
			titmusDisp = 1;
		}
		if (this.getDisplayAmsler() && this.groupAmsler.ResultInd){
			sections = sections + 1;
			amslerDisp = 1;
		}
		if (this.getDisplayWorth() && this.groupWorth.ResultInd){
			sections = sections + 1;
			worthDisp = 1;
		}
		
		
		if(sections === 3){
			subSection.push("<div class='oph-measure-three-sec-main'><div class='oph-measure-three-sec-left'>");
		}else if(sections === 2){
				subSection.push("<div class='oph-measure-three-sec-main'>");
		}else if(sections === 1){
			subSection.push("<div class='oph-measure-sub-sec-full'>");
		}
		
		if (amslerDisp) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left1'>");
			}else if(sections === 2){
				subSection.push("<div class='oph-measure-two-sec-left'>");
				leftSec = true;
			}
			
			subSectionText = this.ophmI18n.AMSLER;
		   //get powerform id
           //get powerform params
			eventId = this.groupAmsler.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "amsler";
				var amslerId = this.compId+"-"+params[1]+"-"+params[2]+ "-" + sectionName; 
				this.paramAmsler = { "encntr_id" : params[1], "activity_id" : params[2] ,"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+amslerId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for ( i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupAmsler['ResultInd'+i]){
					continue;
				}

				var AmslerResult = this.groupMapResults('amsler_result',i);
				var AmslerComments = this.groupMapResults('amsler_com',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" + this.ophmI18n.AMSLER_RESULT  + "</span><span class='vs-dc-res'>" + AmslerResult + "</span>");
				
				
				if(AmslerComments !=="--" ){
					subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" + this.ophmI18n.COMMENTS  + "</span><span class='oph-measure-vis-acuity-sec'>" + AmslerComments + "</span>");
				}
				
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			
			subSection.push("</div>");
			

		}
		
		if (titmusDisp) {
			
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-left2'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.TITMUS;
           //get powerform params
            eventId = this.groupTitmus.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "titmus";
				var titmusId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramTitmus = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName };
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+titmusId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupTitmus['ResultInd'+i]){
					continue;
				}

				var TitmusFly = this.groupMapResults('titmus_fly',i);
				var TitmusAnimal = this.groupMapResults('titmus_animal',i);
				var TitmusCircle = this.groupMapResults('titmus_circle',i);
				var TitmusComments = this.groupMapResults('titmus_com',i);
				
				if(TitmusAnimal !== "--/3"){
					var secInner = "--";
					var firstElement = $(TitmusAnimal)[0];
					var elementResult = $(firstElement).find('.res-value a')[0];
					if(elementResult){
					secInner = $(elementResult).text();
					elementResult.innerText = secInner + " /3";
					//$($($(TitmusAnimal)[0]).find('.res-value a')[0]).text(secInner + " /3");
						var titmusElement = $(TitmusAnimal);
						if(titmusElement){
						var resultHTML = firstElement.outerHTML;
						for(var elm = 1,el =titmusElement.length;elm<el;elm++){
							resultHTML = resultHTML + titmusElement[elm].outerHTML;
						
						}
						TitmusAnimal = resultHTML;
						}
					}
				}
				
				if(TitmusCircle !== "--/9"){
					var circleInner = "--";
					var circleElement = $(TitmusCircle)[0];
					var circleResult = $(circleElement).find('.res-value a')[0];
					if(circleResult){
					circleInner = $(circleResult).text();
					circleResult.innerText = circleInner + " /9";
					//$($($(TitmusAnimal)[0]).find('.res-value a')[0]).text(secInner + " /3");
						var titmusCircleElement = $(TitmusCircle);
						if(titmusCircleElement){
						var circleHTML = circleElement.outerHTML;
						for(var celm = 1,cel =titmusCircleElement.length;celm<cel;celm++){
							circleHTML = circleHTML + titmusCircleElement[celm].outerHTML;
						
						}
						TitmusCircle = circleHTML;
						}
					}
				
				}
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}				
				subSection.push("<table class='oph-measure-tbl'><tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.FLY + "</td><td class='oph-measure-vis-acuity-t1'>" +TitmusFly + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'> </td><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.CORRECT  + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.ANIMALS + "</td><td class='oph-measure-vis-acuity-t1'>" + TitmusAnimal + "</td></tr>");
				subSection.push("<tr><td  class='oph-measure-vis-acuity-t1'> </td><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.CORRECT  + "</td></tr>");
				subSection.push("<tr><td class='oph-measure-vis-acuity-t1'>" + this.ophmI18n.CIRCLES + "</td><td class='oph-measure-vis-acuity-t1'>" + TitmusCircle + "</td></tr>");
				
				subSection.push("</table>");
				if(TitmusComments !=="--" ){
					subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" + this.ophmI18n.COMMENTS  + "</span><span class='oph-measure-vis-acuity-sec'>" + TitmusComments + "</span>");
				}
			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
				if(leftSec && rightSec){
					subSection.push("</div></div>");
				}else{
					subSection.push("</div>");
				}
				
			}else{
				subSection.push("</div>");
			}

		}
		if (worthDisp) {
			
			if(sections === 3){
				subSection.push("<div class='oph-measure-three-sec-right'>");
			}else if(sections === 2){
				if(leftSec){
					subSection.push("<div class='oph-measure-two-sec-right'>");
					rightSec = true;
				}else{
					subSection.push("<div class='oph-measure-two-sec-left'>");
					leftSec = true;	
				}
				
			}
			
			subSectionText = this.ophmI18n.WORTH;
           //get powerform params
            eventId = this.groupWorth.EventId;
			if (eventId > 0) {
				params = this.retrieveFormParams(eventsArray, eventId);
				sectionName	= "worth";
				var worthId = this.compId+"-"+params[1]+"-"+params[2] + "-" + sectionName;
				this.paramWorth = { "encntr_id" : params[1], "activity_id" : params[2],"section" : sectionName};
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span>", "<a id='"+worthId+"'>", "<span class='sub-sec-title'>", subSectionText, "</span></a></h3>");
			}
			else {
				subSection.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>", subSectionText, "</span></h3>");
			}
			subSection.push("<div class='sub-sec-content'><div class='content-body'>");

			prevResult = 1;
			for (i = 0, il = resultDatesArray.length; i < il; i++) {
				
				if (i > 0 && !this.groupWorth['ResultInd'+i]){
					continue;
				}
				var WResult = this.groupMapResults('worth_result',i);
				
				currentDate.setISO8601(resultDatesArray[i].EVENT_END_DT_TM);

				if (i > 0 && prevResult) {
					prevSecText = this.ophmI18n.PREVIOUS;
					subSection.push("<div class='sub-sec closed'><h3 class='sub-sec-hd oph-measure-prev-bg'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>",prevSecText,"</span></h3>");
					subSection.push("<div class='sub-sec-content'><div class='content-body'>");

					prevResult = 0;
				}

				if(i > 0){subSection.push("<p class='oph-measure-vis-acuity-date'>" + currentDate.format("mediumDate") + "</p>");}
				
				subSection.push("<span class='oph-measure-vis-acuity-sec oph-measure-vis-acuity-th'>" + this.ophmI18n.COMMENTS  + "</span><span class='oph-measure-vis-acuity-sec'>" + WResult + "</span>");

			}

			if (prevResult === 0) {
				subSection.push("</div></div></div>");
			}
			subSection.push("</div></div></div>");

			if(sections === 3){
				subSection.push("</div></div>");
			}else if(sections === 2){
					subSection.push("</div></div>");
			}else{
				subSection.push("</div>");
			}

		}
		
		subHTML = subSection.join("");
		subHTML = subSection.join("");
		
		return subHTML;
	};
/**
	 * Sets Result indicator for corresponding group array 
	 * @param group [REQUIRED] group name
	 * @param i [REQUIRED] hash index position to be incremented by
	 * @param eventId [REQUIRED] event identifier value
	 */	
	OphMeasurementComponent.prototype.setGroupResultInd = function(group, i, eventId) {

		var groupSuffix = group.toLowerCase().split("_");
		var groupSplitLength = groupSuffix.length;
		switch (groupSuffix[0]) {
			case "vis":
			
				if (groupSuffix[0] + "_" + groupSuffix[1] == "vis_fields") { 
					if(groupSplitLength == 4){
						this.groupVisualFieldsTDiag['ResultInd' + i] = 1;
					}
					this.groupVisualFields['ResultInd' + i] = 1; 
					this.groupVisualFields.ResultInd = 1;
					if (i === 0) {
						this.groupVisualFields.EventId = eventId;
					}
				} 
				else {

					this.groupVisualAcuity['ResultInd' + i] = 1;
					this.groupVisualAcuity.ResultInd = 1;
					
					if (i === 0) {

						this.groupVisualAcuity.EventId = eventId;

					}
				}

				break;
			case "refrac":
				if (groupSuffix[0] + "_" + groupSuffix[groupSplitLength -1] == "refrac_2") {
					this.groupRefract2.ResultInd = 1;
					this.groupRefract2['ResultInd' + i] = 1; 
					if (i === 0) {
                        this.groupRefract2.EventId = eventId;
                    }
				}
					this.groupRefract['ResultInd' + i] = 1;
					this.groupRefract.ResultInd = 1;
                    if (i === 0) {
                        this.groupRefract.EventId = eventId;

                    }					
				
				
				break;
			case "auto":
				this.groupAutoRefract['ResultInd' + i] = 1;
				this.groupAutoRefract.ResultInd = 1;
                if (i === 0) {
                    this.groupAutoRefract.EventId = eventId;
                }				
				break;
			case "kerato":
				this.groupKerato['ResultInd' + i] = 1;
				this.groupKerato.ResultInd = 1;
                if (i === 0) {
                    this.groupKerato.EventId = eventId;
                }				
				break;
			case "retino":
				this.groupRetino['ResultInd' + i] = 1;
				this.groupRetino.ResultInd = 1;
                if (i === 0) {
                    this.groupRetino.EventId = eventId;
                }				

				break;
			case "ret":
				this.groupRetAcuity['ResultInd' + i] = 1;
				this.groupRetAcuity.ResultInd = 1;
                if (i === 0) {
                    this.groupRetAcuity.EventId = eventId;
                }				

				break;
			case "glare":
				this.groupGlare['ResultInd' + i] = 1;
				this.groupGlare.ResultInd = 1;
                if (i === 0) {
                    this.groupGlare.EventId = eventId;
                }				
				break;
			case "pup":
				this.groupPupEqual['ResultInd' + i] = 1;
				this.groupPupEqual.ResultInd = 1;
                if (i === 0) {
                    this.groupPupEqual.EventId = eventId;
                }
									
				break;
			case "iop":
				this.groupIOP['ResultInd' + i] = 1;
				this.groupIOP.ResultInd = 1;
                if (i === 0) {
                    this.groupIOP.EventId = eventId;
                }				
				
				break;
			case "dilation":
				this.groupDilation['ResultInd' + i] = 1;
				this.groupDilation.ResultInd = 1;
                if (i === 0) {
                    this.groupDilation.EventId = eventId;
                }
									
				break;
			case "motility":
				if(groupSplitLength === 3){
					this.groupMotilityHDiag['ResultInd' + i] = 1;
				}
				this.groupMotility['ResultInd' + i] = 1;
				this.groupMotility.ResultInd = 1;
                if (i === 0) {
                    this.groupMotility.EventId = eventId;
                }
									
				break;
			case "pachy":
				this.groupPachy['ResultInd' + i] = 1;
				this.groupPachy.ResultInd = 1;
                if (i === 0) {
                    this.groupPachy.EventId = eventId;
                }
				
				break;				
			case "oct":
				this.groupOCT['ResultInd' + i] = 1;
				this.groupOCT.ResultInd = 1;
                if (i === 0) {
                    this.groupOCT.EventId = eventId;
                }				
				break;
			case "lid":
				this.groupLID['ResultInd' + i] = 1;
				this.groupLID.ResultInd = 1;
                if (i === 0) {
                    this.groupLID.EventId = eventId;
                }				
				break;
			case "color":
				this.groupColor['ResultInd' + i] = 1;
				this.groupColor.ResultInd = 1;
                if (i === 0) {
                    this.groupColor.EventId = eventId;
                }				
				break;
			case "contrast":
				this.groupContrast['ResultInd' + i] = 1;
				this.groupContrast.ResultInd = 1;
                if (i === 0) {
                    this.groupContrast.EventId = eventId;
                }				
				break;
			case "amsler":
				this.groupAmsler['ResultInd' + i] = 1;
				this.groupAmsler.ResultInd = 1;
                if (i === 0) {
                    this.groupAmsler.EventId = eventId;
                }				
				break;
			case "titmus":
				this.groupTitmus['ResultInd' + i] = 1;
				this.groupTitmus.ResultInd = 1;
                if (i === 0) {
                    this.groupTitmus.EventId = eventId;
                }				
				break;
			case "worth":
				this.groupWorth['ResultInd' + i] = 1;
				this.groupWorth.ResultInd = 1;
                if (i === 0) {
                    this.groupWorth.EventId = eventId;
                }				
				break;
			default:
				break;
		}

	};

	/**
	 * Sets group name under corresponding event code into event map 
	 * @param group [REQUIRED] group object passed
	 */	

	OphMeasurementComponent.prototype.setGroupMappings = function(group) {
		var groupSuffix = group.getGroupName().toLowerCase().split("_");
		this.GroupMap[group.getGroupName().toLowerCase()] = {};
		var groupEventCode = group.getEventCodes()[0]; 
		if (groupEventCode) { // assign to a variable and use : PR
			this.GroupMap[group.getGroupName().toLowerCase()].evtCode = group.getEventCodes()[0];
			if (this.EvtMap[groupEventCode]) { //assign to a variable and use : PR
				this.EvtMap[groupEventCode].push(group.getGroupName().toLowerCase());

			} else {
				this.EvtMap[groupEventCode] = [];
				this.EvtMap[groupEventCode].push(group.getGroupName().toLowerCase());
			}
		}
	};


	/**
	 * Deletes arrays that were used for mapping under measurement component
	 */		
	
	OphMeasurementComponent.prototype.deleteMapObjects = function(){
		delete this.groupVisualAcuity;
		delete this.groupVisualFields;
		delete this.groupRefract;
		delete this.groupRefract2;
		delete this.groupAutoRefract;
		delete this.groupKerato;
		delete this.groupRetino;
		delete this.groupRetAcuity;
		delete this.groupGlare;
		delete this.groupPupEqual;
		delete this.groupIOP;
		delete this.groupDilation;
		delete this.groupMotility;
		delete this.groupVisualFieldsTDiag;
		delete this.groupMotilityHDiag;
		delete this.groupPachy;
		delete this.groupOCT;
		delete this.groupLID;
		delete this.groupColor;
		delete this.groupContrast;
		delete this.groupAmsler;
		delete this.groupTitmus;
		delete this.groupWorth;
		delete this.EvtMap;
		delete this.GroupMap; 
		this.EvtMap = null;
		this.GroupMap = null;
		
		
	};
	
/** Retrieves parameters to be passed by different subroutines      
     * @param component [REQUIRED] Components being rendered
     * @param eventsArray [REQUIRED] Array of event level information
     * @param eventId [REQUIRED] event identifier value
	 * @return {string} : The parameter to be passed
    */
	OphMeasurementComponent.prototype.retrieveFormParams = function(eventsArray, eventId){
	   //get powerform activity id
	   var encntrId = 0;
	   var activityId = 0;
	   
       for (var x = 0; x < eventsArray.length; x++){
            if (eventsArray[x].EVENT_ID === eventId){
                encntrId = eventsArray[x].ENCOUNTER_ID;                 
                activityId = eventsArray[x].DCP_FORMS_ACTIVITY_ID;
				//break;
				x = eventsArray.length;
            }
        }
        var personId = this.getCriterion().person_id;
        var params = [personId, encntrId, activityId];
            
        return params;
	};
	
	
/**  GetEventViewerLink function in mp_core is private function, need to define the function here.  			
     * @param oMeasurement [REQUIRED] 
     * @param sResultDisplay [REQUIRED] 
	 * @return {string} : 
    */  
	OphMeasurementComponent.prototype.getEventViewerLink = function(oMeasurement, sResultDisplay){

		// GetEventViewerLink function in mp_core is private function, need to define the function here.
        var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
        var ar = ["<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", sResultDisplay, "</a>"];
        return ar.join("");
    };
	
	MP_Util.setObjectDefinitionMapping("OPH_MEASUREMENTS", OphMeasurementComponent);
