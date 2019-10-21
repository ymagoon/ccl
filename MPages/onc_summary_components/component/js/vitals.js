//
/*global
	MPAGES_EVENT, MPageGrouper, MPageSequenceGroup, TableCellHoverExtension
*/

/**
 * The vital sign component style
 * @class
 */
function VitalSignComponentStyle(){
    this.initByNamespace("vs");
}

VitalSignComponentStyle.prototype = new ComponentStyle();
VitalSignComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The vital sign component
 * @param {Object} criterion : The  criterion containing the requested information
 * @class
 */
function VitalSignComponent(criterion) {
	this.setCriterion(criterion);
    this.setLookBackDropDown(true);
    this.setStyles(new VitalSignComponentStyle());
    this.setIncludeLineNumber(false);
    this.m_graphLink = 1;
    this.m_showTodayValue = false;
    this.m_iViewAdd = false;
    this.TYPE_STANDARD_GROUPING = 0;
    this.TYPE_TEMPERATURE = 1;
    this.TYPE_BLOOD_PRESSURE = 2;
    this.TYPE_DISCRETE_RESULT = 3;
    this.setComponentLoadTimerName("USR:MPG.VITALSIGNS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.VITALSIGNS.O1 - render component");
    this.bandName = "";
    this.sectionName = "";
    this.itemName = "";
    this.m_clinicalEventListenerAdded = false;
}

VitalSignComponent.prototype = new MPageComponent();
VitalSignComponent.prototype.constructor = MPageComponent;

/*
 * Sets the m_graph flag to the given value
 * @params {number}value : GraphFlag's new value to be assigned
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.setGraphFlag = function(value){
	this.m_graphLink = value;
};

/*
 * Gets the m_graph flag
 * @returns {number}graphLink : does graph have hyperlink
 */
VitalSignComponent.prototype.getGraphFlag = function() {
	return this.m_graphLink;
};

/*
 * Sets the IViewAdd to the passed value
 * @params {boolean}value : new value to be assigned to iViewAdd
 */
VitalSignComponent.prototype.setIViewAdd = function(value){
	this.m_iViewAdd = value;
};

/*
 * Gets whether to add IView or not
 * @returns {boolean}iViewAdd : add Iview or not
 */
VitalSignComponent.prototype.isIViewAdd = function(){
	return this.m_iViewAdd;
};

/*
 * Sets the m_showTodayValue to the passed parameter
 * @params {boolean}value : new value that m_showTodayValue will be
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.setShowTodayValue = function(value){
	this.m_showTodayValue = value;
};

/*
 * Gets the m_showTodayValue and returns it
 * @returns {boolean}showTodayValue : show Today's value or not
 */
VitalSignComponent.prototype.isShowTodayValue = function(){
	return this.m_showTodayValue;
};

/*
 * Sets the m_ClinicalEventListenerAdded to the passed value
 * @params {boolean}value : was event listener added
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.setClinicalEventListenerAdded = function(value){
	this.m_clinicalEventListenerAdded = value;
};

/*
 * Gets the m_ClinicalEventListenerAdded boolean that shows whether the
 * CLINICAL_EVENT listener was added to the component.
 * @returns {boolean} : has the eventListener been added
 */
VitalSignComponent.prototype.isClinicalEventListenerAdded = function(){
	return this.m_clinicalEventListenerAdded;
};

/*
 * Opens a Powerform window through CLINICAL_EVENT to add data
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "vitals.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
	CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "VitalSigns");
};

/*
 * Opens a Powerform window through CLINICAL_EVENT to add data
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.openDropDown = function(formID) {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "vitals.js", "openDropDown");
	MPAGES_EVENT("POWERFORM", paramString);
	CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "VitalSigns");
};

/*
 * Calls retrieve component data and refreshes the component
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.refresh = function() {
	this.setEditMode(true);
	MP_Util.Doc.HideHovers();
	this.retrieveComponentData();
};

VitalSignComponent.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + "," + criterion.encntr_id;
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "vitals.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.bandName, this.sectionName, this.itemName, criterion.person_id, criterion.encntr_id);

		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "VitalSigns");
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "vitals.js", "openIView");
	}
};

/*
 * Occurs after the component has been rendered, called automagically
 * @returns {undefined} : undefined/void
 */
VitalSignComponent.prototype.postProcessing = function(){
	//Call the super class's implementation
	MPageComponent.prototype.postProcessing.call(this);

	//Add the even listener only if it hasn't been already
	if(!this.isClinicalEventListenerAdded()) {
		CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.refresh, this);
		this.setClinicalEventListenerAdded(true);
	}
};

/**
 * Retrieving the activities data on page load. This function handles the logic
 * to make a ccl script call and retrieve the activities data.
 * @function retrieveComponentData
 * @returns {undefined} : void/undefined
 */
VitalSignComponent.prototype.retrieveComponentData = function() {
	var sTempParams = "^^";
	var sHrParams = "^^";
	var sBpParams = "";
	var sOtherParams = "^^";
	var sSeqParams = "^^";
	var groups = this.getGroups();
	var groupLength = groups.length;
	var z = 0;
	var zl = 0;
	var xl = 0;
	var yl = 0;
	var x = 0;
	var y = 0;
	var result_count = 3;
	if (groups && groupLength > 0) {
		for ( x = 0, xl = groupLength; x < xl; x++) {
			var group = groups[x];
			switch (group.getGroupName()) {

				case "TEMP_CE":
					//values are event codes
					sTempParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					break;
				case "HR_CE":
					sHrParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					break;
				case "BP_CE":
					if ( group instanceof MPageGrouper) {
						var bpGroups = group.getGroups();
						for ( z = 0, zl = bpGroups.length; z < zl; z++) {
							var tParams = "";
							var bpCodes = bpGroups[z].getEventCodes();
							if (bpCodes.length === 2) {
								tParams = bpGroups[z].getGroupName() + "," + bpCodes[0] + "," + bpCodes[1];
								if (z > 0) {
									sBpParams += String.fromCharCode(42) + tParams;
								}
								else {
									sBpParams = tParams;
								}
							}
						}

					}
					sBpParams = sBpParams.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
					break;
				case "VS_CE":
				case "VS_CE_SEQ":
					if ( group instanceof MPageSequenceGroup) {
						var mapItems = group.getMapItems();
						var tGroupFilterIds = MP_Util.GetValueFromArray("BR_DATAMART_FILTER", mapItems);
						for ( y = 0, yl = tGroupFilterIds.length; y < yl; y++) {
							//Now loop through the existing groups to match up the Temp/Hr/BP groups
							for ( z = 0, zl = groupLength; z < zl; z++) {
								if (groups[z].getGroupId() === tGroupFilterIds[y]) {
									switch (groups[z].getGroupName()) {
										case "TEMP_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -11111;
											continue;
										case "HR_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -22222;
											continue;
										case "BP_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -33333;
											continue;
										default:
											//do nothing
									}
								}
							}
						}

						sOtherParams = MP_Util.CreateParamArray(MP_Util.GetValueFromArray("CODE_VALUE", mapItems), 1);
						sSeqParams = MP_Util.CreateParamArray(group.getItems(), 1);
					}
					else {
						sOtherParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					}
					break;
				default:

					break;
			}
		}
	}

	var sendAr = [];
	var criterion = this.getCriterion();
	var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
	var minMaxTemperatureLookBackHour = 24;
	sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), "^^", "^^", sTempParams, sHrParams, sOtherParams, "^" + sBpParams + "^", sSeqParams, result_count, minMaxTemperatureLookBackHour);
	MP_Core.XMLCclRequestWrapper(this, "MP_RETRIEVE_VITALS_GROUP_DATA", sendAr, true);

};


/**
 * This function returns the normalcy class associated with the result
 */

VitalSignComponent.prototype.GetNormalcyClass = function(result) {
	var normalcy = "res-normal";
	var normalcyMeaning = result;
	if (normalcyMeaning) {
		switch (normalcyMeaning) {
			case "NORMAL":
				normalcy = "res-normal";
				break;
			case "LOW":
				normalcy = "res-low";
				break;
			case "HIGH":
				normalcy = "res-high";
				break;
			case "ABNORMAL":
				normalcy = "res-abnormal";
				break;
			case "CRITICAL":
			case "EXTREMEHIGH":
			case "PANICHIGH":
			case "EXTREMELOW":
			case "PANICLOW":
			case "VABNORMAL":
			case "POSITIVE":
				normalcy = "res-severe";
				break;
		}
	}
	return normalcy;
};


VitalSignComponent.prototype.GetResultValue = function(result) {
	var criterion = this.getCriterion();
	var person_id = criterion.person_id;
	var encntr_id = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
	var ar = [];
	var params = [person_id, encntr_id, result.EVENT_ID, "\"EVENT\""];
	var resVal;


	//checking for the result type and formatting the date/time result.
	//RES_TYPE = 3 is datetime result.
	if (result.RES_TYPE === 3) {
		var dateResult = new Date();
		dateResult.setISO8601(result.RESULT);
		resVal = dateResult.format("longDateTime3");

	}
	else
	{
		resVal = this.formatNumber(result.RESULT);
	}
    ar.push("<span class =", this.GetNormalcyClass(result.NORMALCY), "><span class='res-ind'>&nbsp;</span>");

	//Mobile Reach to Launch Result viewer
	if (CERN_BrowserDevInd) {
		var	 sParams = [];
		var formatResName = result.RESULT_NAME ? (result.RESULT_NAME).replace(/'/g, "&#39") : "";
		sParams.push(person_id + ".0" , encntr_id , result.EVENT_ID ,"\""+"\"" , "\"EVENT\"" , 0.0 , "\""+"\""  , 0.0 ,0,"\""+formatResName+"\"");
		ar.push("<a onclick='MD_reachViewerDialog.LaunchReachClinNoteViewer(", sParams, "); return false;' href='#'>", resVal, "</a></span>");
	} else {
		ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params, "); return false;' href='#'>", resVal, "</a></span>");
	}
    ar.push(this.getModifiedIcon(result.STATUS_MEAN));
	return ar.join("");
	
};

VitalSignComponent.prototype.LaunchClinNoteViewer_vitals = function(patient_id, encntr_id, event_id, docViewerType) {

	var m_dPersonId = parseFloat(patient_id);
	var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
	MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
	try {
		if (docViewerType === "EVENT") {

			viewerObj.CreateEventViewer(m_dPersonId);

				if(event_id)
				{
					viewerObj.AppendEvent(event_id);
				}

			viewerObj.LaunchEventViewer();

		}
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
		alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.discernabu.CONTACT_ADMINISTRATOR);
	}

};

/**
 * The getModifiedIcon function has the logic to append modified
 * indicator to the results.
 *
 * @param {String}isModified : indicates whether the value has been modified or not.
 * @returns {String} : span tag to show modification
 */
VitalSignComponent.prototype.getModifiedIcon = function(isModified) {
	// if isModified contains "MODIFIED" string, the modified icon is appended to the result.
	return (isModified == "MODIFIED" || isModified == "ALTERED") ? "<span class='res-modified'>&nbsp;</span>" : "";

};




VitalSignComponent.prototype.getGroupId = function(vitalsResult)
{
	var groups = this.getGroups();
	this.group_name = "";
	var group_type;
	switch (vitalsResult.GROUP_TYPE) {
	case 1:
		group_type = "TEMP_CE";
		this.group_name = i18n.discernabu.vitals_o1.TEMPERATURE;
	    break;
	case 2:
		group_type = "BP_CE";
		this.group_name = i18n.discernabu.vitals_o1.BLOOD_PRESSURE;
	    break;
	case 3:
		group_type = "HR_CE";
		this.group_name = i18n.discernabu.vitals_o1.HEART_RATE;
	    break;
	default:
		group_type = "VS_CE";
	    this.group_name = "";
	    break;
	}
	
    for (var x = groups.length; x--; ) {
            if( groups[x].m_groupName == group_type)
            	{
            	   return  groups[x].m_groupId;
            	}
          
    }
	
    return 0;

};

/**
 * Create a object containing the information need for construction of the HTML markup for a given measurement
 * @param oMeasure  The measurement object to construct the hover
 */
VitalSignComponent.prototype.BPHoverResults = function (vitalsSysMeas,vitalsDiaMeas,groupName) {
	    var vitalsI18n = i18n.discernabu.vitals_o1;
		var result_date = new Date();
		result_date.setISO8601(vitalsSysMeas.DTTM ? vitalsSysMeas.DTTM : (vitalsDiaMeas.DTTM ? vitalsDiaMeas.DTTM : "--"));
		result_date = result_date.format("longDateTime3");
		var sysResult = vitalsSysMeas.RESULT ?vitalsSysMeas.RESULT : "--";
		var diaResult = vitalsDiaMeas.RESULT ?vitalsDiaMeas.RESULT : "--";
		var sysStatus = vitalsSysMeas.STATUS_MEAN?vitalsSysMeas.STATUS : "--";
		var diaStatus = vitalsDiaMeas.STATUS_MEAN?vitalsDiaMeas.STATUS : "--";
		var sysNormLow = vitalsSysMeas.NLOW?vitalsSysMeas.NLOW : "--";
		var diaNormLow = vitalsDiaMeas.NLOW?vitalsDiaMeas.NLOW : "--";
		var sysNormHigh = vitalsSysMeas.NHIGH?vitalsSysMeas.NHIGH : "--";
		var diaNormHigh = vitalsDiaMeas.NHIGH?vitalsDiaMeas.NHIGH : "--";
		var sysCritLow = vitalsSysMeas.CLOW?vitalsSysMeas.CLOW : "--";
		var diaCritLow = vitalsDiaMeas.CLOW?vitalsDiaMeas.CLOW : "--";
		var sysCritHigh = vitalsSysMeas.CHIGH?vitalsSysMeas.CHIGH : "--";
		var diaCritHigh = vitalsDiaMeas.CHIGH?vitalsDiaMeas.CHIGH : "--";
		var status = "";
		var normLow = "";
		var normHigh = "";
		var critLow = "";
		var critHigh = "";
		if(sysStatus !== "--" || diaStatus !== "--")
		{
		    status = "<span>"+sysStatus+"</span>/<span>"+diaStatus+"</span>";
			   
		}
		if(sysNormLow !== "--" || diaNormLow !== "--")
		{
			normLow = "<span>"+sysNormLow+"</span>/<span>"+diaNormLow+"</span>";
		   
		}
		if(sysNormHigh !== "--" || diaNormHigh !== "--")
		{
			normHigh = "<span>"+sysNormHigh+"</span>/<span>"+diaNormHigh+"</span>";
		   
		}
		if(sysCritLow !== "--" || diaCritLow !== "--")
		{
			critLow = "<span>"+sysCritLow+"</span>/<span>"+diaCritLow+"</span>";
		   
		}
	    if(sysCritHigh !== "--" || diaCritHigh !== "--")
		{
			critHigh = "<span>"+sysCritHigh+"</span>/<span>"+diaCritHigh+"</span>";
		   
		}
				
	  var ar = ["<div class = 'vs-hover'><dl class='vs-det'><dt class='vs-det-type'><span>",groupName,":</span></dt><dd class='result'>" +
	  		"<span class='",this.GetNormalcyClass(vitalsSysMeas.NORMALCY),"'>", this.formatNumber(sysResult),"&nbsp;", vitalsSysMeas.UOM,"&nbsp;</span>/" +
	  		"<span class='",this.GetNormalcyClass(vitalsDiaMeas.NORMALCY),"'>", this.formatNumber(diaResult), "&nbsp;", vitalsDiaMeas.UOM,"&nbsp;</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.DATE_TIME, ":</span></dt><dd class='result'><span>", result_date, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.STATUS, ":</span></dt><dd class='result'><span>",status,"</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.NORMAL_LOW, ":</span></dt><dd class='result'><span>",normLow,"</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.NORMAL_HIGH, ":</span></dt><dd class='result'><span>",normHigh,"</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.CRITICAL_LOW, ":</span></dt><dd class='result'><span>",critLow,"</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>",critHigh,"</span></dd></dl></div>"];
	   return ar.join("");
};

VitalSignComponent.prototype.formatNumber = function(value){
	var nf=MP_Util.GetNumericFormatter();
	return mp_formatter._isNumber(value)?nf.format(value,"^."+MP_Util.CalculatePrecision(value)):value;
}; 
/**
 * Create a object containing the information need for construction of the HTML markup for a given measurement
 * @param oMeasure  The measurement object to construct the hover
 */
VitalSignComponent.prototype.HoverResults = function (vitalsMeas,minMaxData,group_type) {
	 var vitalsI18n = i18n.discernabu.vitals_o1;
	 var result_date = new Date();
	 result_date.setISO8601(vitalsMeas.DTTM);
	 result_date = result_date.format("longDateTime3");
	 var resVal;
	//checking for the result type and formatting the date/time result.
		//RES_TYPE = 3 is datetime result.
		if (vitalsMeas.RES_TYPE === 3) {
			var dateResult = new Date();
			dateResult.setISO8601(vitalsMeas.RESULT);
			resVal = dateResult.format("longDateTime3");

		}
		else
		{
			resVal =  this.formatNumber(vitalsMeas.RESULT); 
		}
     var tempHTML =  [];
      if(group_type == 1)
    	  {
    	   	  if(minMaxData.MIN_VALUE){
						var tempMin = "";
						var tempMax = "";
						tempMin = this.GetNormalcyClass(minMaxData.MIN_NORMALCY);
						tempMax = this.GetNormalcyClass(minMaxData.MAX_NORMALCY);
			
						var max_date = "";
						var min_date = "";
						if (minMaxData.MIN_DTTM !== "") {
							var minDate = new Date();
							minDate.setISO8601(minMaxData.MIN_DTTM);
							min_date = minDate.format("longDateTime3");
						}
						if (minMaxData.MAX_DTTM !== "") {
							var maxDate = new Date(); 
							maxDate.setISO8601(minMaxData.MAX_DTTM);
							max_date = maxDate.format("longDateTime3");
						} 
							// creating the markup to append to the hover
						tempHTML.push("<dt class='vs-det-type'><span>", vitalsI18n.ONE_DAY_MAX, ":</span></dt><dd class='result'><span class='",tempMax,"'>",this.formatNumber(minMaxData.MAX_VALUE), this.getModifiedIcon(minMaxData.MAX_STATUS_MEAN),'&nbsp;', minMaxData.MAX_UOM,'</span>&nbsp;', max_date,"</dd><br /><dt class='vs-det-type'><span>", vitalsI18n.ONE_DAY_MIN, ":</span></dt><dd class='result'><span class='",tempMin,"'>",  this.formatNumber(minMaxData.MIN_VALUE), this.getModifiedIcon(minMaxData.MIN_STATUS_MEAN),'&nbsp;',minMaxData.MIN_UOM,'</span>&nbsp;', min_date, "</dd>");
					}else{
						// creating the markup to append to the hover
						tempHTML.push("<dt><span>", vitalsI18n.ONE_DAY_MAX, ":</span></dt><dt><span>", vitalsI18n.ONE_DAY_MIN, ":</span></dt>");
					}
    	  }
       
	  var ar = ["<div class = 'vs-hover'><dl class='vs-det'><dt class='vs-det-type'><span>",
	            vitalsMeas.RESULT_NAME,"</span>:</dt><dd class='result'><span class='",this.GetNormalcyClass(vitalsMeas.NORMALCY),"'>",resVal,"&nbsp;", vitalsMeas.UOM,"&nbsp;"+
	            "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.DATE_TIME, "</span>:</dt><dd class='result'><span>", result_date, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.STATUS, "</span>:</dt><dd class='result'><span>", vitalsMeas.STATUS, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.NORMAL_LOW, "</span>:</dt><dd class='result'><span>", vitalsMeas.NLOW, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.NORMAL_HIGH, "</span>:</dt><dd class='result'><span>", vitalsMeas.NHIGH, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.CRITICAL_LOW, "</span>:</dt><dd class='result'><span>", vitalsMeas.CLOW, "</span></dd><br /><dt class='vs-det-type'><span>",
             vitalsI18n.CRITICAL_HIGH, "</span>:</dt><dd class='result'><span>", vitalsMeas.CHIGH, "</span></dd><br />",tempHTML.join(""),"</dl></div>"];
	  return ar.join("");
};
/**
 * Process and render the results for the component table
 * @param recordData  The retrieved JSON to generate the HTML markup
 */

VitalSignComponent.prototype.processResultsForRender = function(recordData) {
	var resultLength = recordData.RG.length;
	var results = recordData.RG;
	var bpResults = recordData.BP_RESULTS;
	var bpResultLength = bpResults.length;
	var vitalsResult;
	var vitalsMeas;
	var vitalsSysMeas;
	var vitalsDiaMeas;
	var resultObj = [];
	var x = 0;
	var y = 0;
    var faceUpDtTm = "";
    var result_date = new Date();
    var resArray = [];
	var resHover = [];
	var curDate = new Date();
	var sysResultObj = null;
	var diaResultObj = null;
	
  	for (x= 0; x<resultLength; x++)
  	{
  		
  		 vitalsResult = results[x];
  		 var compId = this.getComponentId();
    	 var groupId = this.getGroupId(vitalsResult);
         var eventCode = (vitalsResult.GROUP_TYPE === 4) ? vitalsResult.EVENT_CD : 0;
  		 var groupName = (this.group_name) ? this.group_name : vitalsResult.GROUP_NAME;
		if (this.getGraphFlag() === 1) { 
		    
	        vitalsResult["REPORT_NAME_DISPLAY"]  = "<span><a onClick='MP_Util.GraphResults("+eventCode+","+compId+","+groupId+");'>"+groupName+"</a></span>";
	    }
	    else {
	    	vitalsResult["REPORT_NAME_DISPLAY"] =  "<span>"+groupName+"</span>";
	       }
		
	    if(vitalsResult.GROUP_NAME == "BP")
	    	{
	    	    if(bpResultLength > 0)
	    		   {
	    	    		y=0;
		    		    this.todayFlag = 1;
		    		    resArray = [];
		    		    resHover = [];
		    		    while(y<3)
						{
	    		    	    if(bpResults[y])
	    		    	    	  {
		    		    	    	  vitalsSysMeas = bpResults[y].SYS_EVENTS[0] ? bpResults[y].SYS_EVENTS[0] : "";
				    			      vitalsDiaMeas = bpResults[y].DIA_EVENTS[0] ? bpResults[y].DIA_EVENTS[0] : "";
	    		    	    	 
	    		    	  	
		    			      if(vitalsSysMeas || vitalsDiaMeas)
		    			    	  {
				    			  	  sysResultObj = this.GetResultValue(vitalsSysMeas);
									  diaResultObj = this.GetResultValue(vitalsDiaMeas);
									  result_date.setISO8601(vitalsSysMeas.DTTM?vitalsSysMeas.DTTM : (vitalsDiaMeas.DTTM?vitalsDiaMeas.DTTM:""));
									  faceUpDtTm =  MP_Util.DisplayDateByOption(this,result_date);
										 
									  if(this.isShowTodayValue() && this.todayFlag)
							  			{
										     curDate = new Date();

							  			   if( (result_date.getDate() === curDate.getDate()) && (result_date.getMonth() === curDate.getMonth()) && (result_date.getFullYear() === curDate.getFullYear()))
							  			   {
							  				 resArray.push((vitalsSysMeas.RESULT ?sysResultObj : "--" ) + "/" +(vitalsDiaMeas.RESULT ?diaResultObj : "--" ) +"<br /><span class='within'>"+faceUpDtTm+"</span>");
							  				 resHover.push(this.BPHoverResults(vitalsSysMeas,vitalsDiaMeas,bpResults[y].BP_GROUP_NAME));
							  				 y++;
										  		
						  			    	}
						  			    else
						  			    	{
						  			    	     resArray.push("<span class='no-result'>--<br /><span>&nbsp;</span></span>");
						  			    	     resHover.push("");
						  			    	}
						  			   this.todayFlag = 0;
						  			   }
									  else
										  {
										     resArray.push((vitalsSysMeas.RESULT ?sysResultObj : "--" ) + "/" +(vitalsDiaMeas.RESULT ?diaResultObj : "--" ) +"<br /><span class='within'>"+faceUpDtTm+"</span>");
							  				 resHover.push(this.BPHoverResults(vitalsSysMeas,vitalsDiaMeas,bpResults[y].BP_GROUP_NAME));
							  				y++;
										    
										  }
							  			   
							  			}
									  
									  
		    			    	  }
	    		    	    
			    		    	    else
			  						  
									  {	  
									      resArray.push("<span class='no-result'>--<br /><span>&nbsp;</span></span>");
									      resHover.push("");
										  y++;
									  }
	    		    	  }
		    			    			   
		    			   
						}
	    		   
	    		   }
	       else
	    	{
	    	
	    	  if(vitalsResult.MEASUREMENTS.length > 0)
		    	{
	    		    y=0;
	    		    this.todayFlag = 1;
	    		    resArray = [];
	    		    resHover = [];
	    		    while(y<3)
					{
	    		    
			    	  
			    	  vitalsMeas = vitalsResult.MEASUREMENTS[y] ? vitalsResult.MEASUREMENTS[y] : "";
			    	
					  if(vitalsMeas)
			  			 {
						  
						  resultObj = this.GetResultValue(vitalsMeas);
						  result_date.setISO8601(vitalsMeas.DTTM);
						  faceUpDtTm =  MP_Util.DisplayDateByOption(this,result_date);
						 
						  
						  	
						  		if(this.isShowTodayValue() && this.todayFlag)
						  			{
						  			    curDate = new Date();

						  			   if( (result_date.getDate() === curDate.getDate()) && (result_date.getMonth() === curDate.getMonth()) && (result_date.getFullYear() === curDate.getFullYear()))
						  			   {
						  			            resArray.push(vitalsMeas.RESULT ?resultObj +"<br /><span class='within'>"+faceUpDtTm+"</span>" : "--");
						  				        resHover.push(this.HoverResults(vitalsMeas,recordData.MIN_MAX_TEMP,vitalsResult.GROUP_TYPE));
										  	    y++;
										  		
						  			    	}
						  			    else
						  			    	{
						  			    	     resArray.push("<span class='no-result'>--<br /><span>&nbsp;</span></span>");
						  			    	     resHover.push("");
						  			    	     
						  			    	}
						  			   this.todayFlag = 0;
						  			   }
						  			   
						  		
						  		else
						  			{
						  			    
						  			resArray.push(vitalsMeas.RESULT ?resultObj +"<br /><span class='within'>"+faceUpDtTm+"</span>" : "--");
			  				        resHover.push(this.HoverResults(vitalsMeas,recordData.MIN_MAX_TEMP,vitalsResult.GROUP_TYPE));
							  	    y++;
							  		
								  		
						  			}
						  		
						  		
						  
						  
			  			 }
					  else
						  
						  {
						      resArray.push("<span class='no-result'>--<br /><span>&nbsp;</span></span>");
						      resHover.push("");
							  y++;
						  }
					  }
			    	 
		    	}
	    	  
	    	 
	    	   
	    	}
	    
	    for(var z=0; z<3; z++)
		   {
		   
	 		   switch(z)
	 		   {
	 			case 0:
				  		 vitalsResult["REPORT_RESULT1"] = resArray[z];
				  		 vitalsResult["REPORT_RESULT1HOVER"] = resHover[z];
				  		 break;
				  	case 1:
				  		 vitalsResult["REPORT_RESULT2"] = resArray[z];
				  		 vitalsResult["REPORT_RESULT2HOVER"] = resHover[z];
				  		 break;
				  	case 2:
				  	     vitalsResult["REPORT_RESULT3"] = resArray[z];
				  	     vitalsResult["REPORT_RESULT3HOVER"] = resHover[z];
					     break;
	 		     
	 		   }
		   
		      
		   }
	  
		
		     
				
	
	}
  
	
  return results;
};


/**
 * Renders the retrieved data for the component into HTML markup to display within the document
 * @param recordData  The retrieved JSON array to parser to generate the HTML markup
 */
VitalSignComponent.prototype.renderComponent = function(recordData) {
    try {
		var numberResults = 10;
		var results = null;
		var vitalsI18n = i18n.discernabu.vitals_o1;
		var vitalsTable = null;
		var sHtml = [];
		//withingText is updated only when the date/time is set to "elapsed" in bedrock.
		var withinText = (this.getDateFormat() == 3) ? ("<span>" + vitalsI18n.WITHIN + "</span>") : "";
		//Get result information
		results = recordData.RG;
		numberResults = results.length;
		var firstColumnHeader = this.isShowTodayValue() ? vitalsI18n.TODAY : vitalsI18n.LATEST;
		var firstColumnText = "<span>" + firstColumnHeader + "</span><br />" + withinText;
		var prevColumnText = "<span>" + vitalsI18n.PREVIOUS + "</span><br />" + withinText;

		sHtml.push("<div class='vs-hdr-div'><div id='vs", this.getComponentId(), "hdr'><table><tr class=hdr><th class='vs-o1-name'></th><th class='vs-o1-frst-clmn-hdr'>", firstColumnText, "</th>");
		sHtml.push("<th class='vs-o1-prv-clmn'>", prevColumnText, "</th></tr></table></div></div>");

		//Process the results so rendering becomes more trivial
		this.processResultsForRender(recordData);
		//Get the component table (the first time this is called, it is created)
		vitalsTable = new ComponentTable();
		vitalsTable.setNamespace(this.getStyles().getId());
		vitalsTable.setIsHeaderEnabled(false);

		//Create the name column
		var nameColumn = new TableColumn();
		nameColumn.setColumnId("NAME");
		nameColumn.setCustomClass("vs-o1-name");
		nameColumn.setRenderTemplate('${ REPORT_NAME_DISPLAY}');

		var hover = new TableCellHoverExtension();
		//Create the result column
		var resultColumn1 = new TableColumn();
		resultColumn1.setColumnId("RESULT1");
		resultColumn1.setCustomClass("vs-o1-result");
		resultColumn1.setRenderTemplate("${REPORT_RESULT1}");
		hover.addHoverForColumn(resultColumn1, "<span>${RESULT_DATA.REPORT_RESULT1HOVER}</span>");

		//Create the result column
		var resultColumn2 = new TableColumn();
		resultColumn2.setColumnId("RESULT2");
		resultColumn2.setCustomClass("vs-o1-prev-result");
		resultColumn2.setRenderTemplate("${ REPORT_RESULT2}");
		hover.addHoverForColumn(resultColumn2, "<span>${RESULT_DATA.REPORT_RESULT2HOVER}</span>");

		//Create the result column
		var resultColumn3 = new TableColumn();
		resultColumn3.setColumnId("RESULT3");
		resultColumn3.setCustomClass("vs-o1-result");
		resultColumn3.setRenderTemplate("${ REPORT_RESULT3}");
		hover.addHoverForColumn(resultColumn3, "<span>${RESULT_DATA.REPORT_RESULT3HOVER}</span>");

		//Add the columns to the table
		vitalsTable.addColumn(nameColumn);
		vitalsTable.addColumn(resultColumn1);
		vitalsTable.addColumn(resultColumn2);
		vitalsTable.addColumn(resultColumn3);

		//Bind the data to the results
		vitalsTable.bindData(results);
		vitalsTable.addExtension(hover);

		//Store off the component table
		this.setComponentTable(vitalsTable);

		sHtml.push(vitalsTable.render());
		var vitalHtml = sHtml.join("");
		//Finalize the component using the activitiesTable.render() method to create the table html

		this.finalizeComponent(vitalHtml, MP_Util.CreateTitleText(this, numberResults));

		//honoring the bedrock setting for scroll.
		var node = this.getSectionContentNode();

		if (this.isScrollingEnabled() && this.getScrollNumber()) {

			//shifts the header only when the scroll is applied.
			if (numberResults > this.getScrollNumber()) {
				$('#vs' + this.getComponentId() + 'tableBody').addClass('scrollable');
				$('#vs' + this.getComponentId() + 'hdr').addClass('vs-hdr-shifted');
			}
			//enable scrolling - 3.5 is the line height for vitals row.
			MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), this.getScrollNumber(), "3.5");

		}

		//Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count": numberResults
		});
	}
	catch (err) {
		MP_Util.LogJSError(err, this, "vitals.js", "renderComponent");
		throw (err);
	}
	finally {
		this.setEditMode(false);
	}

}; 
