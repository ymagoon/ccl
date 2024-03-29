/*global
	MPAGES_EVENT
*/
function GrowthChartComponentStyle() {
	this.initByNamespace("gc");
}

GrowthChartComponentStyle.prototype = new ComponentStyle();
GrowthChartComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @param {Object} criterion : criterion object for the component
 * @class
 */
function GrowthChartComponent(criterion) {
	this.tabRefId = 0;
	this.getFormCalled = false;
	this.setCriterion(criterion);
	this.setStyles(new GrowthChartComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.GROWTHCHART.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.GROWTHCHART.O1 - render component");
	this.m_clinicalEventListenerAdded = false;
};

GrowthChartComponent.prototype = new MPageComponent();
GrowthChartComponent.prototype.constructor = GrowthChartComponent;

/*
 * Calls retrieveComponentData to get add the data to the component
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.InsertData = function() {
	CERN_GROWTH_CHART_O1.retrieveComponentData(this);
};

/*
 * Function that is called after the CCL script returns
 * @params {Object}recordData : data returned from CCL call
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.HandleSuccess = function(recordData) {
	this.tabRefId = recordData.PLUS_ADD_FORM.REF_ID;
	CERN_GROWTH_CHART_O1.RenderComponent(this, recordData);
};

/*
 * Opens a Powerform window through CLINICAL_EVENT to add data
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.openTab = function() {
	if(this.tabRefId > 0.0) {
		var criterion = this.getCriterion();
		var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + this.tabRefId + "|0|0";
		MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "growthchart.js", "openTab");
		MPAGES_EVENT("POWERFORM", paramString);
		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "GrowthChart");
	}
};

/*
 * Sets the m_ClinicalEventListenerAdded to the passed value
 * @params {boolean}value : was event listener added
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.setClinicalEventListenerAdded = function(value){
	this.m_clinicalEventListenerAdded = value;
};

/*
 * Gets the m_ClinicalEventListenerAdded boolean that shows whether the
 * CLINICAL_EVENT listener was added to the component.
 * @returns {boolean} : has the eventListener been added
 */
GrowthChartComponent.prototype.isClinicalEventListenerAdded = function(){
	return this.m_clinicalEventListenerAdded;
};

/*
 * Occurs after the component has been rendered, called automagically
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.postProcessing = function(){
	//Call the super class's implementation
	MPageComponent.prototype.postProcessing.call(this);

	//Add the even listener only if it hasn't been already
	if(!this.isClinicalEventListenerAdded()){
		CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.InsertData, this);
		this.setClinicalEventListenerAdded(true);
	}
};

/**
 * Setup the display filters for the Growth Chart component
 * @returns {undefined} : undefined/void
 */
GrowthChartComponent.prototype.loadDisplayFilters = function() {
	var dateFilter = new MP_Core.CriterionFilters(this.getCriterion());
	var dateCheck = new Date();
	dateCheck.setFullYear(dateCheck.getFullYear() - 22);
	dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);
	this.addDisplayFilter(dateFilter);
};

/**
 * Growth Chart methods
 * @namespace CERN_GROWTH_CHART_O1
 * @static
 * @global
 * @dependencies Script: mp_growth_chart
 */
var CERN_GROWTH_CHART_O1 = function() {
	var lookBackType = 0;
	var lookBackUnits = 0;

	function getEventViewerLink(criterion, eventId, res) {
		var ar = [];
		var params = [criterion.person_id, criterion.encntr_id, eventId, "\"EVENT\""];
		ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", res, "</a>");
		return ar.join("");
	}

	return {
		retrieveComponentData: function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			lookBackUnits = (component.getLookbackUnits() !== null) ? component.getLookbackUnits() : "0";
			lookBackType = (component.getLookbackUnitTypeFlag() !== null) ? component.getLookbackUnitTypeFlag() : "-1";
			var prsnlInfo = criterion.getPersonnelInfo();
			var encntrs = prsnlInfo.getViewableEncounters();
			var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
			var encntrValScope = (component.getScope() == 2) ? "value(" + criterion.encntr_id + ".0 )" : encntrVal;

			var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
			request.setProgramName("MP_RETRIEVE_GROWTH_CHART");
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrValScope, lookBackUnits, lookBackType, criterion.ppr_cd + ".0");
			request.setParameters(sendAr);
			request.setAsync(true);

			MP_Core.XMLCCLRequestCallBack(component, request, function(reply) {
				component.HandleSuccess(reply.getResponse());
			});
		},

		RenderComponent: function(component, recordData) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
			try {
				var criterion = component.getCriterion();
				var precision = 2;
				var dtFormat = component.getDateFormat();
				var jsGcHTML = [];
				var gcHTML = "";
				var gcLen = 0;
				var countText = "";
				var gcObj = recordData.AGC;
				gcLen = gcObj.length;
				if(gcLen === 0) {//Handle no data
					countText = MP_Util.CreateTitleText(component, gcLen);
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
					return;
				}

				var patBirthDtTm = new Date();
				patBirthDtTm.setISO8601(recordData.BIRTH_DT_TM);
				var gcI18n = i18n.discernabu.gc_o1;
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
				var latestText = dtFormat == 3 ? gcI18n.LATEST + "<br/>" + gcI18n.WITHIN : gcI18n.LATEST;
				var previousText = dtFormat == 3 ? gcI18n.PREVIOUS + "<br/>" + gcI18n.WITHIN : gcI18n.PREVIOUS;
				var contentClass = MP_Util.GetContentClass(component, gcLen);
				var headerClass = "hdr";
				if(component.isScrollingEnabled() && (gcLen >= component.getScrollNumber())) {
					contentClass += " gc-scrl-tbl";
					headerClass += " gc-scrl-tbl-hdr";
				}
				jsGcHTML.push("<div class='", headerClass, "'><table class='gc-table'><thead ><tr><th class='gc-lbl'><span>&nbsp;</span></th><th class='gc-res1 '><span>", latestText, "</span></th><th class='gc-res2'><span>", previousText, "</span></th></tr></thead></table></div>");
				jsGcHTML.push("<div class='", contentClass, "'><table class='gc-table'>");
				for(var i = 0; i < gcLen; i++) {
					var gcItem = gcObj[i];
					var gcName = gcItem.EVENT_NAME;

					var oddEven = "odd";
					if(i % 2 === 0) {
						oddEven = "even";
					}
					jsGcHTML.push("<tr class='", oddEven, "'><td class='gc-lbl'><span class='row-label'>", gcName, "</span></td>");
					var gcMeas = gcItem.MEASUREMENTS;
					var gcResLen = gcMeas.length;
					if(gcResLen > 3) {
						gcResLen = 3;
					}
					for(var j = 0; j < 3; j++) {
						if(j < gcResLen) {
							var gcRes = gcMeas[j];
							var gcVal = nf.format(gcRes.VALUE, "." + precision);
							var gcPct = nf.format(gcRes.PERCENTILE, "." + precision);
							var gcUnits = gcRes.RESULT_UNITS;
							var gcResultVal = "";
							var gcHvrVal = "";
							var resModified = (gcRes.MODIFIED_IND === 1) ? "<span class='res-modified'>&nbsp;</span>" : "";
							var measDate = new Date();
							measDate.setISO8601(gcRes.MEAS_DT_TM);
							var measAge = MP_Util.CalcAge(patBirthDtTm, measDate);
							var measDateDisp = df.format(measDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
							var faceUpMeasDateDisp = MP_Util.DisplayDateByOption(component, measDate);
							gcResultVal = gcVal + " " + gcUnits + " (" + gcPct + "%)";
							gcHvrVal = gcVal;

							jsGcHTML.push("<td class='gc-res", j + 1, "'><dl class='gc-info'><dt><span>", gcName, "</span></dt><dd class='gc-res'>", getEventViewerLink(criterion, gcRes.EVENT_ID, gcResultVal), resModified, "<br /><span class='within'>", faceUpMeasDateDisp, "</span></dd></dl><h4 class='det-hd'><span>", gcI18n.RESULT_DETAILS, ":</span></h4><div class='hvr'><dl class='gc-det-age'>", "<dt><span>", gcI18n.AGE, ":</span></dt><dd>", measAge, "</dd>", "<dt><span>", gcI18n.RESULT_DT_TM, ":</span></dt><dd>", measDateDisp, "</dd>", "<dt><span>", gcI18n.RESULT, ":</span></dt><dd>", gcHvrVal + " " + gcRes.RESULT_UNITS, "</dd><dt><span>", gcI18n.PERCENTILE, ":</span></dt><dd><span>", gcPct, "</span></dd><dt><span>", gcI18n.ZSCORE, ":</span></dt><dd><span>", nf.format(gcRes.Z_SCORE), "</span></dd><dt><span>", gcI18n.STATUS, ":</span></dt><dd><span>", gcRes.STATUS_DISP, "</span></dd></dl></div></td>");
						}
						else {
							jsGcHTML.push("<td class='gc-res", j + 1, "'><span>--</span></td>");
						}
					}
					jsGcHTML.push("</tr>");
				}

				jsGcHTML.push("</table>");
				jsGcHTML.push("</div>");
				gcHTML = jsGcHTML.join("");
				countText = MP_Util.CreateTitleText(component, gcLen);
				MP_Util.Doc.FinalizeComponent(gcHTML, component, countText);
			}
			catch (err) {
				if(timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			}
			finally {
				if(timerRenderComponent) {
					timerRenderComponent.Stop();
				}
			}
		}

	};
}();
