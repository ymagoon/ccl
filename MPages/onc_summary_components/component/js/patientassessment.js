/**
 * The patient assessment component style
 * @class
 */
function PatientAssessmentComponentStyle(){
    this.initByNamespace("pta");
}
PatientAssessmentComponentStyle.inherits(ComponentStyle);

/**
 * The patient assessment component
 * @param criterion  The criterion containing the requested information
 * @class
 */
function PatientAssessmentComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new PatientAssessmentComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.PATIENTASSESSMENT.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PATIENTASSESSMENT.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
	this.setResultCount(1);

	PatientAssessmentComponent.method("HandleSuccess", function(replyAr, component){
		CERN_PATIENT_ASSESSMENT_O1.RenderComponent(component, replyAr);
    });
}
PatientAssessmentComponent.inherits(MeasurementBaseComponent);

PatientAssessmentComponent.prototype.preProcessing = function(){
	//Call the base class implementation for future support
	MPageComponent.prototype.preProcessing.call(this); 
	
	var group = null;
	var groupArr = this.getGroups();
	var z = 0;
	if(groupArr && groupArr.length > 0) {
		for( z = groupArr.length; z--; ) {
			group = groupArr[z];
			switch (group.getGroupName()) {
				case "NC_PT_ASSESS_GEN":
					group.setGroupName(i18n.GENERAL_ASSESSMENT);
					break;
				case "NC_PT_ASSESS_PAIN":
					group.setGroupName(i18n.PAIN);
					break;
				case "NC_PT_ASSESS_NEURO":
					group.setGroupName(i18n.NEURO);
					break;
				case "NC_PT_ASSESS_RESP":
					group.setGroupName(i18n.RESPIRATORY);
					break;
				case "NC_PT_ASSESS_CARD":
					group.setGroupName(i18n.CARDIO);
					break;
				case "NC_PT_ASSESS_GI":
					group.setGroupName(i18n.GI);
					break;
				case "NC_PT_ASSESS_GU":
					group.setGroupName(i18n.GU);
					break;
				case "NC_PT_ASSESS_MS":
					group.setGroupName(i18n.MUSCULOSKELETAL);
					break;
				case "NC_PT_ASSESS_INTEG":
					group.setGroupName(i18n.INTEGUMENTARY);
					break;
			}
		}
	}
};

/**
 * Patient Assessment methods
 * @namespace
 */
var CERN_PATIENT_ASSESSMENT_O1 = function(){
    return {
    	/**
    	 * Renders the retrieved data for the component into html markup to display within the document
    	 * @param component  The component being rendered
    	 * @param replyAr  The retrieved JSON array to parser to generate the html markup
    	 */
        RenderComponent : function(component, replyAr) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try {
				var ar = [];
				var totalCnt = 0;
				var groups = component.getGroups();
				for (var x = 0, xl = groups.length; x < xl; x++){
					var group = groups[x];
					for (var y = replyAr.length; y--;){
						var reply = replyAr[y];
						if (group.getGroupName() === reply.getName()){
							totalCnt += getSubsection(group, reply.getResponse(), ar);
							break;
						}
					}
				}

	        	ar.unshift("<div class='", MP_Util.GetContentClass(component, totalCnt), "'>");
	        	ar.push("</div>");
				var sHTML = ar.join("");
				var countText = MP_Util.CreateTitleText(component, totalCnt);

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
    
    /**
     * Creates the HTML markup for a given subsection
     * @param group  The group associated to the results being created
     * @param recordData  The JSON to render into HTML
     * @param ar  (ref) The HTML array for which all HTML markup is being pushed into
     * @return Integer value of the number of measurements added within the subsection 
     */
    function getSubsection(group, recordData, ar){
		var sHTML = "", countText = "";
		var measAr = [];
		var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
		var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
		var measureArray = CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArrayNoSort(recordData, personnelArray, codeArray);

    	var df = MP_Util.GetDateFormatter();
		var measLen = measureArray.length;
		
		for (var x = 0; x < measLen; x++){
			var measObject = measureArray[x];
			var display = measObject.getEventCode().display;
			var oDate = measObject.getDateTime();
			var sDate = (oDate) ? df.format(oDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";

			measAr.push("<dl class='pta-info'><dt class='pta-disp-lbl'>", display, "</dt><dd class='pta-name'>", display, "</dd><dt class='pta-res-lbl'>",
					i18n.discernabu.patientassessment_o1.RESULT, " </dt><dd class ='pta-res'>");
			measAr.push(MP_Util.Measurement.GetNormalcyResultDisplay(measObject));
			measAr.push("</dd><dt class='ptadate'>", sDate,"</dt><dd class='pta-dt'><span class='date-time'>", sDate, "</span></dd></dl>");
		}
		
        ar.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", group.getGroupName(), " (", measLen, ")</span></h3>");
        if (measLen > 0) {
            ar.push("<div class='sub-sec-content'><div class='content-body'", ">", measAr.join(""), "</div></div>");
        }
        ar.push("</div>");
        return measLen;
    }
}();