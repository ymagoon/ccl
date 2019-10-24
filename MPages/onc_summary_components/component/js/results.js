/**
 * The results component style
 * @class
 */
function ResultsComponentStyle(){
    this.initByNamespace("rslt");
}
ResultsComponentStyle.inherits(ComponentStyle);

/**
 * The results component
 * @param criterion  The criterion containing the requested information
 * @class
 */
function ResultsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ResultsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.RESULTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.RESULTS.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setLookbackUnits(24);
    this.setLookbackUnitTypeFlag(1);
	this.setResultCount(1);
    
	ResultsComponent.method("HandleSuccess", function(replyAr, component){
    	//results has only one group so pick of first record data to pass to render
		CERN_RESULTS_O1.RenderComponent(component, replyAr[0].getResponse());
    });
}
ResultsComponent.inherits(MeasurementBaseComponent);

/**
 * @namespace
 */
var CERN_RESULTS_O1 = function(){
    return {
    	/**
    	 * Renders the retrieved data for the component into HTML markup to display within the document
    	 * @param component  The component being rendered
    	 * @param recordData  The retrieved JSON to parser to generate the HTML markup from.
    	 */
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
				var sHTML = "", countText = "";
				var ar = [];
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
				var measureArray = CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArray(recordData, personnelArray, codeArray, SortByNormalcy);
	
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var measLen = measureArray.length;
	
				ar.push("<div class='", MP_Util.GetContentClass(component, measLen), "'>");
	
				for ( var i = 0, l = measureArray.length; i < l; i++) {
					var measObject = measureArray[i];
					var display = measObject.getEventCode().display;
					var oDate = measObject.getDateTime();
					var sDate = (oDate) ? df.format(oDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";
	
					ar.push("<dl class='rslt-info'><dt class='rslt-disp-lbl'>", display, "</dt><dd class='rslt-name'>", display, "</dd><dt class='rslt-res-lbl'>",
							i18n.discernabu.results_o1.RESULT, " </dt><dd class='rslt-res'>");
					ar.push(MP_Util.Measurement.GetNormalcyResultDisplay(measObject));
					ar.push("</dd><dt class='rsltdate'>", sDate,"</dt><dd class='rslt-dt'><span class='date-time'>", sDate, "</span></dd></dl>");
				}
				ar.push("</div>");
	
				sHTML = ar.join("");
				countText = MP_Util.CreateTitleText(component, measLen);
	
				var compNS = component.getStyles().getNameSpace();
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
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
    /**
     * Sorts the Measurement objects by their predetermined weight
     * @param a Measurement object 1 to compare
     * @param b Measurement object 2 to compare
     */
    function SortByNormalcy(a, b) {
		// Primary sort on normalcy mean, secondary sort on effective date desc
		var mean1 = getNormalcyWeight(a);
		var mean2 = getNormalcyWeight(b);

		if (mean1 > mean2) {
			return -1;
		} else if (mean1 < mean2) {
			return 1;
		}
		return CERN_MEASUREMENT_BASE_O1.SortByEffectiveDateDesc(a, b);
	}
    
    /**
     * Gets the predetermined weight of a measurement's normalcy
     * @param oMeasurement The Measurement Object to evaluate
     * @return Integer value representing the weight of the Measurement Object.
     */
    function getNormalcyWeight(oMeasurement) {
    	var oNomalcy = oMeasurement.getNormalcy();
		var mean = (oNomalcy) ? oNomalcy.meaning : null;

		if (mean) {
			switch (mean) {
			case "CRITICAL":
			case "PANICHIGH":
			case "PANICLOW":
			case "EXTREMEHIGH":
			case "EXTREMELOW":
				return 1;
			default:
				return 0;
			}
		}
		return 0;
	}
}();
