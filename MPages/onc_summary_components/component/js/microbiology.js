/**
 * The microbiology component style
 * @class
 */
function MicrobiologyComponentStyle() {
	this.initByNamespace("mic");
}
MicrobiologyComponentStyle.prototype = new ComponentStyle();
MicrobiologyComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The microbiology sign component
 * @param criterion  The criterion containing the requested information
 * @class
 */
function MicrobiologyComponent(criterion) {
	this.setLookBackDropDown(true);
	this.setCriterion(criterion);
	this.setStyles(new MicrobiologyComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.MICRO.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.MICRO.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setPregnancyLookbackInd(true);
}

MicrobiologyComponent.prototype = new MPageComponent();
MicrobiologyComponent.prototype.constructor = MPageComponent;

/**
 * InsertData will start the component data retrieval.
 * @returns {undefined} Does not return anything
 */
MicrobiologyComponent.prototype.InsertData = function() {
	CERN_MICROBIOLOGY_O1.GetMicrobiologyTable(this);
};

/**
 * HandleSuccess will render the component when data is retrieved.
 * @param {Object} recordData CCL reply JSON object
 * @returns {undefined} Does not return anything
 */
MicrobiologyComponent.prototype.HandleSuccess = function(recordData) {
	CERN_MICROBIOLOGY_O1.RenderComponent(this, recordData);
};

/**
 * @namespace
 */
var CERN_MICROBIOLOGY_O1 = function(){
    var encntrOption = 0;
	var lookBackUnits = 0;
	var lookBackType = 0;

	function SortByDate(a, b) {
		var sortDateA = (a.SPECIMEN_COLLECTION.COLLECTED_DATE === "") ? a.EFFECTIVE_DATE : a.SPECIMEN_COLLECTION.COLLECTED_DATE;
		var sortDateB = (b.SPECIMEN_COLLECTION.COLLECTED_DATE === "") ? b.EFFECTIVE_DATE : b.SPECIMEN_COLLECTION.COLLECTED_DATE;
		if (sortDateA > sortDateB) {
			return -1;
		}
		else if (sortDateA < sortDateB) {
			return 1;
		}
		return 0;
	}

	return {
		GetMicrobiologyTable: function(component) {
			var groups = component.getGroups();
			var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
			var sEvents = MP_Util.CreateParamArray(events, 1);
			var criterion = component.getCriterion();

			encntrOption = (component.getScope() === 1) ? "0.0" : (criterion.encntr_id + ".0");
			lookBackUnits = (component.getLookbackUnits() !== null) ? component.getLookbackUnits() : "0";
			lookBackType = (component.getLookbackUnitTypeFlag() !== null) ? component.getLookbackUnitTypeFlag() : "0";

			var sendAr = [ "^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", lookBackUnits, sEvents, criterion.position_cd + ".0", criterion.ppr_cd + ".0",lookBackType ];
			MP_Core.XMLCclRequestWrapper(component, "mp_get_micro_results_json", sendAr, true);
		},
		RenderComponent: function(component, recordData) {
			var micI18n = i18n.discernabu.microbiology_o1;
			var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			var jsMicHTML = [];
			var micObj = recordData.MICRO_CULTURE;
			micObj.sort(SortByDate);
			var micNum = micObj.length;
			var compNS = component.getStyles().getNameSpace();
			jsMicHTML.push("<div class='mic-info-hdr hdr' id = 'mic-info-hd", component.getComponentId(),"'><dl class='mic-info-hds'><dd class='mic-rep-hd'><span>", micI18n.REPORT, "</span></dd><dd class='mic-status-hd'><span>",
							micI18n.STATUS, "</span></dd><dd class='mic-growth-hd'><span>", micI18n.GROWTH, "</span></dd><dd class='mic-no-sc'><span>", micI18n.SUSC_HEADER,
							"</span></dd><dd class='mic-within-hd'><span>", micI18n.COLLECTED);
			if (component.getDateFormat() === 3) {
				jsMicHTML.push("<br/>", micI18n.WITHIN,"</span></dd></dl></div>");
			} else {
				jsMicHTML.push("</span></dd></dl></div>");
			}
			jsMicHTML.push("<div class='", MP_Util.GetContentClass(component, micNum), "'>");

			for ( var i = 0; i < micNum; i++) {
				var sRepStatus = "", sSusceptibility = "", sSusceptibilityClass = "mic-no-sc", sRepDisp = "", isGrowth = "", growthIndClass = "", orgList = "", site = "", source = "", sourceSite = "", resultDtTm = new Date();
				if (micObj[i].SPECIMEN_COLLECTION.COLLECTED_DATE && micObj[i].SPECIMEN_COLLECTION.COLLECTED_DATE !== "") {
					resultDtTm.setISO8601(micObj[i].SPECIMEN_COLLECTION.COLLECTED_DATE);
				}
				else {
					resultDtTm.setISO8601(micObj[i].EFFECTIVE_DATE);
				}
				var resultDtTmDisp = MP_Util.DisplayDateByOption(component, resultDtTm);
				sRepDisp = (micObj[i].EVENT_SET_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].EVENT_SET_CD, codeArray).display : "--";
				sRepStatus = (micObj[i].EVENT_STATUS_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].EVENT_STATUS_CD, codeArray).display : "--";
				if (micObj[i].MICRO_CLASS_IND === 1) {
					source = (micObj[i].SPECIMEN_COLLECTION.SOURCE_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.SOURCE_CD,codeArray).display : "";
					site = (micObj[i].SPECIMEN_COLLECTION.BODY_SITE_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.BODY_SITE_CD,codeArray).display : "";
					if ((site && site !== "") && (source && source !== "")) {
						sourceSite = source + " / " + site;
					}
					else {
						if (site && site !== "") {
							sourceSite = site;
						}
						else if (source && source !== "") {
							sourceSite = source;
						}
					}
					if (micObj[i].SUSCEPTIBILITY_IND === 1) {
						sSusceptibilityClass = "mic-sc";
						sSusceptibility = micI18n.DONE;
					}
					else {
						sSusceptibilityClass = "mic-no-sc";
						sSusceptibility = micI18n.NOT_DONE;
					}
					if (micObj[i].ORDERS[0] && micObj[i].ORDERS[0].DEPT_STATUS_CD > 0) {
						sRepStatus = MP_Util.GetValueFromArray(micObj[i].ORDERS[0].DEPT_STATUS_CD, codeArray).display;
					}
					if (micObj[i].SPECIMEN_COLLECTION.MICROBIOLOGY_INTERPRETATION_CD > 0) {
						var micInterp = MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.MICROBIOLOGY_INTERPRETATION_CD,codeArray);
						isGrowth = micInterp.display;
						if (micInterp.meaning === "POSITIVE") {
							growthIndClass = "res-severe";
						}
					}
					var organism = {};
					var orgArr = [];
					var isoObj = micObj[i].ISOLATE_WORKUPS;
					for ( var orgIdx = 0; orgIdx < isoObj.length; orgIdx++) {
						if (isoObj[orgIdx].ORGANISM_CD > 0) {
							organism = MP_Util.GetValueFromArray(isoObj[orgIdx].ORGANISM_CD, codeArray);
							orgArr.push(organism.display);
						}
					}
					orgList = orgArr.join(", ");
				}

				//Display Micro viewer for Reach
				if(CERN_BrowserDevInd) {
					var sParams = [];
					sParams.push(micObj[i].PERSON_ID + ".0", micObj[i].ENCNTR_ID + ".0", micObj[i].EVENT_ID + ".0", "\"" + sRepDisp + "\"", "\"" + micObj[i].VIEWER_TYPE + "\"", micObj[i].PARENT_EVENT_ID + ".0", "\"" + "\"", 0.0, 0, "\"" + "\"");
					
					jsMicHTML.push("<h3 class='info-hd'><span>", micI18n.MICRO, "</span></h3>", "<dl class='mic-info'>", "<dt><span>", micI18n.MICRO, ":</span></dt>","<dd class='mic-report'><span><a onclick='MD_reachViewerDialog.LaunchReachClinNoteViewer(",sParams,"); return false;' href='#'>",sRepDisp,"</a></span>");
				}
				else{
				jsMicHTML.push("<h3 class='info-hd'><span>", micI18n.MICRO, "</span></h3>", "<dl class='mic-info'>", "<dt><span>", micI18n.MICRO, ":</span></dt>","<dd class='mic-report'><span>", MP_Util.CreateClinNoteLink(micObj[i].PERSON_ID + ".0", micObj[i].ENCNTR_ID + ".0", micObj[i].EVENT_ID + ".0", sRepDisp,micObj[i].VIEWER_TYPE, micObj[i].PARENT_EVENT_ID + ".0"),"</span>");
					}
				if (MP_Util.GetValueFromArray(micObj[i].EVENT_STATUS_CD, codeArray).meaning == "MODIFIED" || MP_Util.GetValueFromArray(micObj[i].EVENT_STATUS_CD, codeArray).meaning == "ALTERED") {
					jsMicHTML.push("<span class='res-modified'>&nbsp;</span>");
				}
				jsMicHTML.push("</dd><dd class='mic-status'><span>", sRepStatus, "</span></dd><dd class='mic-growth'><span class='", growthIndClass, "'>", isGrowth,
						"</span></dd><dd class='", sSusceptibilityClass, "'><span>&nbsp;</span></dd><dd class='mic-within'><span class='date-time'>", resultDtTmDisp,
						"</span></dd></dl>",
						//Start Hover
						"<h4 class='det-hd'><span>", micI18n.MICRO_DETAILS,"</span></h4>", "<div class='hvr'><dl class = 'mic-det'>", "<dt><span>",
						micI18n.SOURCE_SITE, ":</span></dt><dd><span>", sourceSite, "</span></dd>", "<dt><span>",
						micI18n.ORGANISMS, ":</span></dt><dd><span>", orgList, "</span></dd>", "<dt><span>",
						micI18n.SUSCEPTIBILITY, ":</span></dt><dd><span>",sSusceptibility, "</span></dd>", "<dt><span>",
						micI18n.COLLECTED_DATE_TIME, ":</span></dt><dd><span>", resultDtTm.format("longDateTime3"),"</span></dd>","<dt><span>",
						micI18n.STATUS, ":</span></dt><dd><span>",sRepStatus, "</span></dd>","</dl></div>");
			}
			jsMicHTML.push("</div>");
			var sHTML = jsMicHTML.join("");
			var countText = MP_Util.CreateTitleText(component, micNum);
			MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
			if (component.isScrollingEnabled() && (micNum >= component.getScrollNumber())) {
				//scrollable
				var xNode = Util.Style.g(compNS + "-info-hdr", document.body, "DL");
				if (xNode[0]) {
					Util.Style.acss(xNode[0], "hdr-scroll");
				}
				//shift over field headers when scroll bar showing
				$("#mic-info-hd" + component.getComponentId()).addClass("shifted");
			}
		}
	};
}();
