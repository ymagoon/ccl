/**
 * @return {ABDComponentStyle} A instance of <code>ComponentStyle</code> associated to the ABD Component
 */
function ABDComponentStyle()
{
	this.initByNamespace("abd");
}
ABDComponentStyle.inherits(ComponentStyle);

function ABDComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new ABDComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ABD.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ABD.O1 - render component");
    this.setIncludeLineNumber(false);
	 
	ABDComponent.method("setAgeDays", function(value){
		this.m_ageDay = value;
	});
	ABDComponent.method("getAgeDays", function(){
		return ((this.m_ageDay==null)?365:this.m_ageDay);

	});
	
	ABDComponent.method("getApneaEventCds", function() {
		return (this.m_apnea);
	});
	ABDComponent.method("setApneaEventCds", function(value) {
		this.m_apnea = value;
	});
	ABDComponent.method("addApneaEventCd", function(value) {
		if (this.m_apnea == null){
			this.m_apnea = [];
		}
		this.m_apnea.push(value);
	});

	ABDComponent.method("getApneaNomenIds", function() {
		return (this.m_anomen);
	});
	ABDComponent.method("setApneaNomenIds", function(value) {
		this.m_anomen = value;
	});
	ABDComponent.method("addApneaNomenId", function(value) {
		if (this.m_anomen == null){
			this.m_anomen = [];
		}
		this.m_anomen.push(value);
	});

	ABDComponent.method("getBradyEventCds", function() {
		return (this.m_brady);
	});
	ABDComponent.method("setBradyEventCds", function(value) {
		this.m_brady = value;
	});
	ABDComponent.method("addBradyEventCd", function(value) {
		if (this.m_brady == null){
			this.m_brady = [];
		}
		this.m_brady.push(value);
	});

	ABDComponent.method("getBradyNomenIds", function() {
		return (this.m_bnomen);
	});
	ABDComponent.method("setBradyNomenIds", function(value) {
		this.m_bnomen = value;
	});
	ABDComponent.method("addBradyNomenId", function(value) {
		if (this.m_bnomen == null){
			this.m_bnomen = [];
		}
		this.m_bnomen.push(value);
	});

	ABDComponent.method("getDesatEventCds", function() {
		return (this.m_desat);
	});
	ABDComponent.method("setDesatEventCds", function(value) {
		this.m_desat = value;
	});
	ABDComponent.method("addDesatEventCd", function(value) {
		if (this.m_desat == null){
			this.m_desat = [];
		}
		this.m_desat.push(value);
	});

	ABDComponent.method("getDesatNomenIds", function() {
		return (this.m_dnomen);
	});
	ABDComponent.method("setDesatNomenIds", function(value) {
		this.m_dnomen = value;
	});
	ABDComponent.method("addDesatNomenId", function(value) {
		if (this.m_dnomen == null){
			this.m_dnomen = [];
		}
		this.m_dnomen.push(value);
	});

	ABDComponent.method("getO2SatCds", function() {
		return (this.m_o2);
	});
	ABDComponent.method("setO2SatCds", function(value) {
		this.m_o2 = value;
	});
	ABDComponent.method("addO2SatCd", function(value) {
		if (this.m_o2 == null){
			this.m_o2 = [];
		}
		this.m_o2.push(value);
	});

	ABDComponent.method("getHRCds", function() {
		return (this.m_hr);
	});
	ABDComponent.method("setHRCds", function(value) {
		this.m_hr = value;
	});
	ABDComponent.method("addHRCd", function(value) {
		if (this.m_hr == null){
			this.m_hr = [];
		}
		this.m_hr.push(value);
	});

	ABDComponent.method("getSkinColorCds", function() {
		return (this.m_skin);
	});
	ABDComponent.method("setSkinColorCds", function(value) {
		this.m_skin = value;
	});
	ABDComponent.method("addSkinColorCd", function(value) {
		if (this.m_skin == null){
			this.m_skin = [];
		}
		this.m_skin.push(value);
	});

	ABDComponent.method("getActivityCds", function() {
		return (this.m_act);
	});
	ABDComponent.method("setActivityCds", function(value) {
		this.m_act = value;
	});
	ABDComponent.method("addActivityCd", function(value) {
		if (this.m_act == null){
			this.m_act = [];
		}
		this.m_act.push(value);
	});

	ABDComponent.method("getPositionCds", function() {
		return (this.m_pos);
	});
	ABDComponent.method("setPositionCds", function(value) {
		this.m_pos = value;
	});
	ABDComponent.method("addPositionCd", function(value) {
		if (this.m_pos == null){
			this.m_pos = [];
		}
		this.m_pos.push(value);
	});

	ABDComponent.method("getStimulationCds", function() {
		return (this.m_stim);
	});
	ABDComponent.method("setStimulationCds", function(value) {
		this.m_stim = value;
	});
	ABDComponent.method("addStimulationCd", function(value) {
		if (this.m_stim == null){
			this.m_stim = [];
		}
		this.m_stim.push(value);
	});

	ABDComponent.method("getDurationCds", function() {
		return (this.m_dur);
	});
	ABDComponent.method("setDurationCds", function(value) {
		this.m_dur = value;
	});
	ABDComponent.method("addDurationCd", function(value) {
		if (this.m_dur == null){
			this.m_dur = [];
		}
		this.m_dur.push(value);
	});
	
	ABDComponent.method("InsertData", function(){
		CERN_ABD_O1.GetABDEvents(this);
	});
	
	ABDComponent.method("HandleSuccess", function(recordData){
		CERN_ABD_O1.RenderABD(this, recordData);
	});
}
/*
	MPageComponent is defined in js/core/mp_component_defs.js
*/
ABDComponent.inherits(MPageComponent);


ABDComponent.prototype.loadDisplayFilters = function(){
	var dateFilter = new MP_Core.CriterionFilters(this.getCriterion());
	var ageDays = this.getAgeDays();
	var myDate = new Date();
	myDate.setDate(myDate.getDate() - ageDays);
	dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, myDate);
	this.addDisplayFilter(dateFilter);
};

var CERN_ABD_O1 = function(){
	function formatCodes(codeArray)
	{
		var codeString = "0.0";
		if (codeArray) {
			var arrLen = codeArray.length;
			if (arrLen > 0) {
				codeString = "value(";
				for (var x = 0; x < arrLen; x++) {
					if (x > 0) {//append comma
						codeString += ",";
					}
					codeString += codeArray[x] + ".0";
				}
				codeString += ")";
			}
		}
		return (codeString);
	}
	return {
		RenderABD : function(component, recordData){
			var rowCnt = 0, rowClass = "", countText = "", sHTML = "", jsHTML = [], nameSpace = component.getStyles().getNameSpace();
				
			var apneaCds = component.getApneaEventCds();
			var apneaIds = component.getApneaNomenIds();
			var bradyCds = component.getBradyEventCds();
			var bradyIds = component.getBradyNomenIds();
			var desatCds = component.getDesatEventCds();
			var desatIds = component.getDesatNomenIds();
			var o2Cds = component.getO2SatCds();
			var hrCds = component.getHRCds();
			var skinCds = component.getSkinColorCds();
			var actCds = component.getActivityCds();
			var posCds = component.getPositionCds();
			var stimCds = component.getStimulationCds();
			var durCds = component.getDurationCds();
			
			/***************** Display ABD component *****************/
			// Do not show if no data to show
			if (recordData.CNT > 0)
			{
				jsHTML.push("<div class='",MP_Util.GetContentClass(component, recordData.CNT) ,"'><table class='abd-table'><thead><tr class='hdr content-hdr'><th class='abd-dt-tm'>Date/Time</th>");
				if(apneaCds != null || bradyCds != null || desatCds != null){
					 jsHTML.push("<th class='abd-event'>Event</th>");
				}
				if(o2Cds != null){
					 jsHTML.push("<th class='abd-oxy-sat'>O2 Sat</th>");
				}
				if(hrCds != null){
					 jsHTML.push("<th class='abd-hr'>HR</th>");
				}
				if(skinCds != null){
					 jsHTML.push("<th class='abd-skin-colour'>Skin Color</th>");
				}
				if(actCds != null){
					 jsHTML.push("<th class='abd-activity'>Activity</th>");
				}   
				if(posCds != null){
					 jsHTML.push("<th class='abd-position'>Position</th>");
				}  					
				if(stimCds != null){
					 jsHTML.push("<th class='abd-stimulation'>Stimulation</th>");
				}   
				if(durCds != null){
					 jsHTML.push("<th class='abd-duration'>Duration</th>");
				}   
				jsHTML.push("</tr></thead><tbody>");						
				for (var i=0;i<recordData.CNT;i++){
					rowCnt++;
					if (rowCnt%2){
						rowClass = "odd";
					}
					else{
						rowClass = "even";
					}

					var dataElem = recordData.QUAL[i];
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.FMT_DT_TM);
					var dataDtTm = resultDtTm.format("longDateTime2");
					var hvrDtTm = resultDtTm.format("longDateTime3");
					jsHTML.push("<tr class='" ,rowClass,"'><td class='date-time'>", dataDtTm, "</td>");
					if(apneaCds != null || bradyCds != null || desatCds != null)
					{
						jsHTML.push("<td class='result'>", dataElem.ABD_EVENT,"</td>");
					}
					if(o2Cds != null)
					{
						jsHTML.push("<td class='result'>", dataElem.O2_SAT,"</td>");
					}
					if(hrCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.HEART_RATE,"</td>");
					}
					if(skinCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.SKIN_COLOR,"</td>");
					}
					if(actCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.ACTIVITY,"</td>");
					}   
					if(posCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.POSITION,"</td>");
					}  					
					if(stimCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.STIMULATION,"</td>");
					}   
					if(durCds != null)
					{
						jsHTML.push("<td class='result'>",dataElem.DURATION,"</td>");
					}   
					jsHTML.push("</tr>");																		
				}
				jsHTML.push("</tbody></table></div>");
			}
			/***************** Close ABD component *****************/
			countText = "";
			sHTML = jsHTML.join("");
				
			MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

		    return;	
		},
		GetABDEvents : function(component){
			var criterion = component.getCriterion();
            var lookBackUnits = component.getLookbackUnits();
            var lookBackUnitTypeFlag = component.getLookbackUnitTypeFlag();
			var ageDays = component.getAgeDays();
			var apneaCds = component.getApneaEventCds();
			var apneaIds = component.getApneaNomenIds();
			var bradyCds = component.getBradyEventCds();
			var bradyIds = component.getBradyNomenIds();
			var desatCds = component.getDesatEventCds();
			var desatIds = component.getDesatNomenIds();
			var o2Cds = component.getO2SatCds();
			var hrCds = component.getHRCds();
			var skinCds = component.getSkinColorCds();
			var actCds = component.getActivityCds();
			var posCds = component.getPositionCds();
			var stimCds = component.getStimulationCds();
			var durCds = component.getDurationCds();
			
			var sApneaCds = "";
			sApneaCds = formatCodes(apneaCds);
			var sApneaIds = "";
			sApneaIds = formatCodes(apneaIds);
			var sBradyCds = "";
			sBradyCds = formatCodes(bradyCds);
			var sBradyIds = "";
			sBradyIds = formatCodes(bradyIds);
			var sDesatCds = "";
			sDesatCds = formatCodes(desatCds);
			var sDesatIds = "";
			sDesatIds = formatCodes(desatIds);
			var sO2Cds = "";
			sO2Cds = formatCodes(o2Cds);
			var sHRCds = "";
			sHRCds = formatCodes(hrCds);
			var sSkinCds = "";
			sSkinCds = formatCodes(skinCds);
			var sActivityCds = "";
			sActivityCds = formatCodes(actCds);
			var sPosCds = "";
			sPosCds = formatCodes(posCds);
			var sStimCds = "";
			sStimCds = formatCodes(stimCds);
			var sDurCds = "";
			sDurCds = formatCodes(durCds);

		    var sendArr = ["^MINE^", criterion.person_id + ".0", ((component.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0"), lookBackUnits, lookBackUnitTypeFlag, ageDays, sApneaCds, sApneaIds, sBradyCds, sBradyIds, sDesatCds, sDesatIds, sO2Cds, sHRCds, sSkinCds, sActivityCds, sPosCds, sStimCds, sDurCds];
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_ABD", sendArr, true);

		    return;
		}
	};
	

}();