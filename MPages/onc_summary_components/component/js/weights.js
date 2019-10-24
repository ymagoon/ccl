/*global
    CERN_MEASUREMENT_BASE_O1
*/

/**
 * The weight and measurements component style
 * @class
 */
function WeightsComponentStyle(){
    this.initByNamespace("wm");
}

WeightsComponentStyle.prototype = new ComponentStyle();
WeightsComponentStyle.prototype.constructor = ComponentStyle;


/**
 * The weight and measurements component
 * @param {Object} criterion : The criterion containing the requested information
 * @class
 */
function WeightsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new WeightsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.WEIGHTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.WEIGHTS.O1 - render component");
    this.m_includeAdmission = false;
    this.m_includeAdmissionChange = false;
    this.m_changeFlag = 1; //0 = % change, 1 = point change
    this.setIncludeLineNumber(true);
    this.m_graphLink = 1; //0 = no hyperlink, 1 = hyperlink
    this.m_showTodayValue = false;
    this.m_clinicalEventListenerAdded = false;
};

WeightsComponent.prototype = new MPageComponent();
WeightsComponent.prototype.constructor = MPageComponent;

/*
 * Calls retrieveComponentData to get add the data to the component
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.InsertData = function(){
    CERN_WEIGHTS_O1.GetWeightAndMeasurements(this);
};

/*
 * Sets the m_includeAdmission to the given value to tell 
 * the componenet whether or not to show admissions.
 * @params {boolean}value : Include admissions or not
 */
WeightsComponent.prototype.setIncludeAdmission = function(value){
    this.m_includeAdmission = value;
};

/*
 * Gets the m_includeAdmissions variable to tell the component 
 * whether to show admissions or not.
 * @returns {boolean}includeAdmission : include Admissions or not
 */
WeightsComponent.prototype.isAdmissionIncluded = function(){
    return (this.m_includeAdmission);
};

/*
 * Sets the m_includeAdmissionChange
 * @params {boolean}value : new value to set m_includeAdmissionChange to
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.setIncludeAdmissionChange = function(value){
    this.m_includeAdmissionChange = value;
};

/*
 * Gets the m_includeAdmissionChange 
 * @returns {boolean}includeAdmissionChange : isAdmissionChangIncluded
 */
WeightsComponent.prototype.isAdmissionChangeIncluded = function(){
    return (this.m_includeAdmissionChange);
};

/*
 * Sets the m_showTodayValue to the passed parameter
 * @params {boolean}value : new value that m_showTodayValue will be
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.setShowTodayValue = function(value){
    this.m_showTodayValue = value;
};

/*
 * Gets the m_showTodayValue and returns it
 * @returns {boolean}showTodayValue : show Today's value or not
 */
WeightsComponent.prototype.isShowTodayValue = function(){
    return (this.m_showTodayValue);
};

/*
 * Sets the m_changeFlag to the passed value
 * @params {number}value : value of 1 or 0
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.setChangeFlag = function(value){
    this.m_changeFlag = value;
};

/*
 * Gets the m_changeFlag and returns it
 * @returns {number}changeFlag : value of 1 or 0
 */
WeightsComponent.prototype.getChangeFlag = function(){
    return (this.m_changeFlag);
};

/*
 * Sets the m_graph flag to the given value
 * @params {number}value : GraphFlag's new value to be assigned
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.setGraphFlag = function(value){
    this.m_graphLink = value;
};

WeightsComponent.prototype.getGraphFlag = function(){
    return (this.m_graphLink);
};

/*
 * Sets the m_ClinicalEventListenerAdded to the passed value
 * @params {boolean}value : was event listener added
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.setClinicalEventListenerAdded = function(value){
    this.m_clinicalEventListenerAdded = value;
};

/*
 * Gets the m_ClinicalEventListenerAdded boolean that shows whether the
 * CLINICAL_EVENT listener was added to the component.
 * @returns {boolean} : has the eventListener been added
 */
WeightsComponent.prototype.isClinicalEventListenerAdded = function(){
    return this.m_clinicalEventListenerAdded;
};

/*
 * Function that is called after the CCL script returns
 * @params {Object}recordData : data returned from CCL call
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.HandleSuccess = function(recordData){
    CERN_WEIGHTS_O1.RenderComponent(this, recordData);
};

/*
 * Occurs after the component has been rendered, called automagically
 * @returns {undefined} : undefined/void
 */
WeightsComponent.prototype.postProcessing = function(){
    //Call the super class's implementation
    MPageComponent.prototype.postProcessing.call(this);

    //Add the even listener only if it hasn't been already
    if(!this.isClinicalEventListenerAdded()) {
        CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.InsertData, this);
        this.setClinicalEventListenerAdded(true);
    }
};
/**
 * @namespace
 */
var CERN_WEIGHTS_O1 = function(){
    return {
        /**
    	 * Executes the retrieval of the data for the weight and measurements component
    	 * @param {Object}component : The component in which to retrieve data
         * @returns {undefined} : undefined/void
    	 */
        GetWeightAndMeasurements: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var groups = component.getGroups();
            var encntrOption = (component.getScope() === 1) ? "0.0" : (criterion.encntr_id + ".0");
            var lookBackUnits = (component.getLookbackUnits() !== 0) ? component.getLookbackUnits() : "365";
            var lookBackType =  component.getLookbackUnitTypeFlag();
            
            var eventSets = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
            var numResults = (component.isAdmissionIncluded() || component.isAdmissionChangeIncluded()) ? 1000 : 2; 
            var sEventSets = MP_Util.CreateParamArray(eventSets, 1);
            
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", criterion.ppr_cd + ".0", numResults, "^^", sEventSets, 0.0, lookBackUnits, lookBackType);
            MP_Core.XMLCclRequestWrapper(component, "MP_RETRIEVE_N_RESULTS_JSON", sendAr, true);
        },

    	/**
    	 * Renders the retrieved data for the component into HTML markup to display within the document
    	 * @param {Object} component : The component being rendered
    	 * @param {Object} recordData : The retrieved JSON to parser to generate the HTML markup from.
         * @returns {undefined} : undefined/void
    	 */
        RenderComponent: function(component, recordData){
           
            try {
                var weightsI18n = i18n.discernabu.weights_o1;
                var jsHTML = [];
                var sHTML = "";
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                
                var mapObjects = CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataMap(recordData, personnelArray, codeArray);
              
                if (mapObjects && mapObjects.length > 0) {
					var contentClass = MP_Util.GetContentClass(component, mapObjects.length);
					var headerClass = "content-hdr";
					if (component.isScrollingEnabled() && (mapObjects.length >= component.getScrollNumber())) {
						contentClass += " body-scroll";
						headerClass += " hdr-scroll";
					}
                    jsHTML.push("<div class='",headerClass,"'><table class='wm-tbl-full'><tr class='hdr'><th class='wm-res-nm'>&nbsp;</th><th class='wm-res'>");
                    if(component.isShowTodayValue()) {
                    	jsHTML.push(weightsI18n.TODAY);
                    } else {
                    	jsHTML.push(weightsI18n.LATEST);
                    }
                    
                    if (component.getDateFormat() == 3) {
                        jsHTML.push("<br/>", weightsI18n.WITHIN);
                    }
                    
                    jsHTML.push("</th><th class='wm-res'>", weightsI18n.PREVIOUS);
                    
                    if (component.getDateFormat() == 3) {
                        jsHTML.push("<br />", weightsI18n.WITHIN);
                    }
                    
                    jsHTML.push("</th><th class='wm-res-chn'>", weightsI18n.CHANGE, "</th>");
                    if (component.isAdmissionIncluded()) {
                        jsHTML.push("<th class='wm-res'>", weightsI18n.ADMISSION, "</th>");
                    }
                    if (component.isAdmissionChangeIncluded()) {
                        jsHTML.push("<th class='wm-res-chn'>", weightsI18n.CHANGE, "</th>");
                    }
                    jsHTML.push("</tr></table></div>");
                    
                    jsHTML.push("<div class='", contentClass, "'>");
                    jsHTML.push("<table class='wm-tbl-full'>");
                    for (var i = 0, l = mapObjects.length; i < l; i++) {
                    
                        jsHTML.push(createResultRow(mapObjects[i], i, codeArray, component));
                    }
                    jsHTML.push("</table></div>");
                    sHTML = jsHTML.join("");
                    var countText = MP_Util.CreateTitleText(component, mapObjects.length);
                    jsHTML.push("</div>");
                    MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                }
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
        }
    };
    
    /**
     * Creates the HTML markup for a single row to display within the component
     * @param mapObject  The results to display within the row
     * @param rowNbr  The index of the row to display in order to apply zebra stripes
     * @param codeArray  The array of code values loaded during retrieval of the data
     * @param component  The component in which is being rendered
     */
    function createResultRow(mapObject, rowNbr, codeArray, component){
        var compId = component.getComponentId();
        var ar = [];
        var rowClass = (rowNbr % 2) ? "even" : "odd";
        var rowDisplay = "";
        var m1 = null;
		var resAr = mapObject.value;
		var timeNow = new Date();
        if (resAr && resAr.length > 0) {
            m1 = resAr[0];
            rowDisplay = m1.getEventCode().display;
            
            if (component.getGraphFlag() == 1) {
                ar.push("<tr class='", rowClass, "'><td class='wm-res-nm'><span><a onClick='MP_Util.GraphResults(", m1.getEventCode().codeValue, ",", compId, ",0.0);'>", rowDisplay, "</a></span></td>");
            }
            else {
                ar.push("<tr class='", rowClass, "'><td class='wm-res-nm'><span>", rowDisplay, "</span></td>");
            }
            
            
            var changeFlag = component.getChangeFlag();
        	if(component.isShowTodayValue()) {
        		var measureDtTm = m1.getDateTime(); 
        		if(timeNow.getFullYear() === measureDtTm.getFullYear() && timeNow.getMonth() === measureDtTm.getMonth() && timeNow.getDate() === measureDtTm.getDate()) {
            ar.push(createResultCell(resAr[0], component, null, null)); //create current result
            ar.push(createResultCell(resAr[1], component, resAr[0], changeFlag)); //create previous result
            ar.push(createChangeCell(resAr[0], resAr[1], changeFlag)); //create change cell
            	} else {
            		ar.push(createResultCell(null, component, null, null)); //create current result
            		ar.push(createResultCell(resAr[0], component, null, changeFlag)); //create previous result
            		ar.push(createChangeCell(resAr[0], null, changeFlag)); //create change cell
            	}
            } else {
                ar.push(createResultCell(resAr[0], component, null, null)); //create current result
            	ar.push(createResultCell(resAr[1], component, resAr[0], changeFlag)); //create previous result
            	ar.push(createChangeCell(resAr[0], resAr[1], changeFlag)); //create change cell                    	
            }
            if (component.isAdmissionIncluded()) {
                ar.push(createResultCell(resAr[resAr.length - 1], component, resAr[0], changeFlag)); //create admission result
            }
            if (component.isAdmissionChangeIncluded()) {
                ar.push(createChangeCell(resAr[0], resAr[resAr.length - 1], changeFlag));//create change cell
            }
            ar.push("</tr>");
        }
        
        return ar.join("");
    }
    /**
     * Creates the cell denoting the change in the results from one measurement to another
     * @param curMeasurement  The measurement to evaluate
     * @param previousMeasurement  The previous measurement to compare against
     * @param changeFlag  Zero will return a percentage change, else numeric change
     * @return {String} The HTML markup for the change cell
     */
    function createChangeCell(curMeasurement, previousMeasurement, changeFlag){
        var ar = [];
        ar.push("<td class='wm-res-chn'><span>", getChangeResults(curMeasurement, previousMeasurement, changeFlag, false), "</span></td>");
        return ar.join("");
    }
    /**
     * Gets the actual value to display as the change in two measurements
     * @param curMeasurement  The measurement to evaluate
     * @param previousMeasurement  The previous measurement to compare against
     * @param changeFlag  Zero will return a percentage change, else numeric change
     * @param hoverFlag  A value of true will return a non-formatted string result
     * @return {String} The value of the change between two results
     */
    function getChangeResults(curMeasurement, previousMeasurement, changeFlag, hoverFlag){
        var ar = [];
		var res = 0;
        if (previousMeasurement && curMeasurement) {
            var curResult = curMeasurement.getResult();
            var prevResult = previousMeasurement.getResult();
            if (curResult instanceof MP_Core.QuantityValue && prevResult instanceof MP_Core.QuantityValue) {
            	var curUOM = (curResult.getUOM())? curResult.getUOM().meaning : "";
                var prevUOM = (prevResult.getUOM())? prevResult.getUOM().meaning : "";
            	if(curUOM === prevUOM) {
	                var diff = curResult.getRawValue() - prevResult.getRawValue();
	                if (changeFlag === 0) { //percentage change
	                    if (parseInt(curResult.getValue(),10) !== 0) { //check for divide by 0 error
	                        var val = diff / prevResult.getValue() * 100;
	                        res = MP_Util.Measurement.SetPrecision(val, 2);
	                        ar.push(res, "%");
	                    }
	                    else { //if curResult =0 ; the result is shown as 0%
	                        res = 0;
	                        ar.push(res, "%");
	                    }
	                }
	                else { //point change
	                    var prec = Math.max(curResult.getPrecision(), prevResult.getPrecision());
	                    res = MP_Util.Measurement.SetPrecision(diff, prec);
	                    var uom = (curResult.getUOM()) ? curResult.getUOM().display : "";
	                    if(curUOM === "OZ") {
	                    	var pounds = Math.floor(Math.abs(res)/16);
	                    	var ounces = Math.abs(res) % 16;
	                    	if(res < 0) {
	                    		pounds *= -1;
	                    	}
	                    	if(hoverFlag) {
	                    		ar.push(pounds, " lb ", ounces, " oz");
	                    	} else {
	                    		ar.push("<span class='res-value'>",pounds,"</span><span class='unit'>lb</span> <span class='res-value'>",ounces,"</span><span class='unit'>oz</span>");
	                    	}
	                    } else {
	                    	if(hoverFlag) {
	                    		ar.push(res," ",uom);
	                    	} else {
	                    		ar.push("<span class='res-value'>",res,"</span><span class='unit'>",uom,"</span>");
	                    	}
	                    }
	                }
            	} else {
            		ar.push("--");
            	}
            }
            else {
                ar.push("&nbsp;");
            }
        }
        else {
            ar.push("--");
        }
        return ar.join("");
    }
    /**
     * Creates a single results cell's HTML markup
     * @param measurement  The measurement to create the HTML markup
     * @param component  The component in which the result is being created
     * @param prevMeasurement  The previous measurement to compare against
     * @param changeFlag  Zero will return a percentage change, else numeric change.   If displaying the change
     * @return {String} The HTML markup for a given result cell
     */
    function createResultCell(measurement, component, prevMeasurement, changeFlag){
        var ar = [];
        var styleVal = (prevMeasurement) ? "wm-res": "wm-res wm-latest";
        
        if (measurement) {
            ar.push("<td class ='", styleVal, "'><dl class='wm-info'><dd><span class='res-normal'>", getResult(measurement, false), "</span>");
            if (component.getDateFormat() != 4) {
                ar.push("<br/><span class='within'>", MP_Util.DisplayDateByOption(component, measurement.getDateTime()));
            }
            ar.push("</span></dd></dl>", createResultHover(measurement, prevMeasurement, changeFlag), "</td>");
        }
        else {
            ar.push("<td class ='wm-res'><dl class='wm-info'><dd><span>--</span></dd></dl>");
        }
        return ar.join("");
    }
    /**
     * Creates a single results cell's HTML markup for the hover
     * @param measurement  The measurement to create the HTML hover markup
     * @param component  The component in which the result is being created
     * @param prevMeasurement  The previous measurement to compare against
     * @param changeFlag  Zero will return a percentage change, else numeric change.   If displaying the change
     * @return {String} The HTML markup for a single cell's hover
     */
    function createResultHover(measurement, prevMeasurement, changeFlag){
        var ar = [];
        var value = getResult(measurement, true);
        var oStatus = measurement.getStatus();
        var sStatus = (oStatus) ? oStatus.display : "";
        var weightsI18n = i18n.discernabu.weights_o1;
        var df = MP_Util.GetDateFormatter();
        var dateTime = df.format(measurement.getDateTime(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
        ar.push("<h4 class='det-hd'><span>", weightsI18n.MEASUREMENT_DETAILS, "</span></h4><div class='hvr'><dl class='wm-det'><dt><span>", weightsI18n.NAME, ":</span></dt><dd class='wm-det-name'><span>", measurement.getEventCode().display, "</span></dd><dt><span>", weightsI18n.RESULT, ":</span></dt><dd class='wm-det-val'><span>", value, "</span></dd><dt><span>", weightsI18n.DATE_TIME, ":</span></dt><dd class='wm-det-name'><span>", dateTime, "</span><dt><span>", weightsI18n.STATUS, ":</span></dt><dd class='wm-det-name'><span>", sStatus, "</span></dd>");
        if (prevMeasurement) {
            ar.push("<dt><span>", weightsI18n.CHANGE, ":</span></dt><dd class='wm-det-chn'><span>", getChangeResults(prevMeasurement, measurement, changeFlag, true), "</span></dd>");
        }
        ar.push("</dl></div>");
        return ar.join("");
    }
    /**
     * Creates the face up HTML markup or string result of the measurement
     * @param measurement  The measurement object to get the result display
     * @param hoverFlag  True value will return a non-formatted string result
     * @return {String} The HTML markup of the measurement
     */
    function getResult(measurement, hoverFlag){
        var value = "";
        var result = measurement.getResult();
        if (result instanceof MP_Core.QuantityValue) {
            var uom = (result.getUOM()) ? result.getUOM().meaning : "";

        	if(uom === "OZ") {
        		var num = parseInt(MP_Util.Measurement.GetString(measurement, null, null, true), 10);
        		var pounds = Math.floor(num/16);
        		var ounces = num % 16;
        		if(hoverFlag) {
        			value = pounds+" lb "+ounces+" oz";
        		} else {
        			value = "<span class='res-value'>"+pounds+"</span><span class='unit'>lb</span> <span class='res-value'>"+ounces+"</span><span class='unit'>oz</span>";
        			value = GetWMEventViewerLink(measurement, value)+MP_Util.Measurement.GetModifiedIcon(measurement);
        		}
        	} else {
        		if(hoverFlag) {
	    			value = result.toString();
	    		} else {
	    			
	    			if (uom)
                    {
                        value = "<span class='res-value'>"+result.getValue()+"</span><span class='unit'>"+result.getUOM().display+"</span>";
                    }else
                    {
                        value = "<span class='res-value'>"+result.getValue()+"</span>";
                    }
	    			value = GetWMEventViewerLink(measurement, value)+MP_Util.Measurement.GetModifiedIcon(measurement);
	    		}
        	}
        }
        else {
            if (result instanceof Date) {
                var df = MP_Util.GetDateFormatter();
                value = df.format(result, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
            }
            else {
                value = result;
            }
            if(!hoverFlag){
            	value = GetWMEventViewerLink(measurement, value);
            }
        }
        return value;
    }
    function GetWMEventViewerLink(oMeasurement, sResultDisplay){
		var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
		var ar = ["<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", sResultDisplay, "</a>"];
		return ar.join("");
    }
}();
