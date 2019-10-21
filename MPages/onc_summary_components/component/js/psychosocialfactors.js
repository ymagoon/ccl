/**
 * The psychosocial factors component style
 * @class
 */
function PsychosocialFactorsComponentStyle(){
    this.initByNamespace("psy");
}
PsychosocialFactorsComponentStyle.inherits(ComponentStyle);

/**
 * The psychosocial factors component
 * @param criterion  The criterion containing the requested information
 * @class
 */
function PsychosocialFactorsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new PsychosocialFactorsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PSYCHSOC.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PSYCHSOC.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
	this.setResultCount(1);
    
    PsychosocialFactorsComponent.method("HandleSuccess", function(replyAr, component){
    	//psychosocial factors has only one group so pick of first record data to pass to render
    	CERN_PSY_FACTOR_O1.RenderComponent(component, replyAr[0].getResponse());
    });
}
PsychosocialFactorsComponent.inherits(MeasurementBaseComponent);

/**
 * @namespace
 */
var CERN_PSY_FACTOR_O1 = function(){
    return {
    	/**
    	 * Renders the retrieved data for the component into HTML markup to display within the document
    	 * @param component  The component being rendered
    	 * @param recordData  The retrieved JSON to parser to generate the HTML markup from.
    	 */
        RenderComponent : function(component, recordData) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try {
				var sHTML = "", countText = "";
				var ar = [];
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
				var measureArray = CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArrayNoSort(recordData, personnelArray, codeArray);
	
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var measLen = measureArray.length;
	
				ar.push("<div class='", MP_Util.GetContentClass(component, measLen), "'>");
	
				for ( var i = 0, l = measureArray.length; i < l; i++) {
					var measObject = measureArray[i];
					var display = measObject.getEventCode().display;
					var oDate = measObject.getDateTime();
					var sDate = (oDate) ? df.format(oDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";
	
					ar.push("<dl class='psy-info'><dt class='psy-disp-lbl'>", display, "</dt><dd class='psy-name'>", display, "</dd><dt class='psy-res-lbl'>",
							i18n.discernabu.psychosocialfactors_o1.RESULT, " </dt><dd class='psy-res'>");
					ar.push(MP_Util.Measurement.GetNormalcyResultDisplay(measObject));
					ar.push("</dd><dt class='psydate'>", sDate,"</dt><dd class='psy-dt'><span class='date-time'>", sDate, "</span></dd></dl>");
				}
				ar.push("</div>");
	
				sHTML = ar.join("");
				countText = MP_Util.CreateTitleText(component, measLen);
	
				var compNS = component.getStyles().getNameSpace();
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
			} catch (err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			} finally {
				if (timerRenderComponent) {
					timerRenderComponent.Stop();
				}
			}
		}
    };
}();
