function VisitsComponentStyle() {
	this.initByNamespace("vis");
}

VisitsComponentStyle.inherits(ComponentStyle);

function VisitsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new VisitsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.VISITS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.VISITS.O1 - render component");
	this.setScope(1);
	this.setIncludeLineNumber(true);
	this.m_futureMax = 0;
	this.m_previousMax = 0;
	this.m_viewableEncntrs = "";
	this.m_encounterTypeCodes = null;
	this.setResourceRequired(true);
	this.jsonToday = [];
	this.jsonPrevious = [];
	this.jsonFuture = [];
	
	VisitsComponent.method("RetrieveRequiredResources", function() {
		//Create and/or retrieve Viewable Encounters shared resource
		var veObj = MP_Core.GetViewableEncntrs(this.getCriterion().person_id);

		if (veObj.isResourceAvailable() && veObj.getResourceData()) {
			//If veObj data is available, immediately load component.
			this.setViewableEncntrs(veObj.getResourceData());
			CERN_VISITS_O1.GetVisits(this);
		} else {
			//If the data is not yet available, MP_Core.GetViewableEncntrs will fire the viewableEncntrInfoAvailable event when the data becomes available.
			CERN_EventListener.addListener(this, "viewableEncntrInfoAvailable", this.HandleViewableEncounters, this);
		}
	});

	/**
	 * Handle the viewable encounters information for the patient and store within the component object.
	 * @param {Object} event : an event object
	 * @param {Object} srObj : The viewableEncntrs shared resource object
	 * @return {undefined} : Returns nothing
	 */
	VisitsComponent.method("HandleViewableEncounters", function(event, srObj) {
		var component = this;
		if (srObj.isResourceAvailable() && srObj.getResourceData()) {
			this.setViewableEncntrs(srObj.getResourceData());
		} else {
			MP_Util.LogScriptCallInfo(component, this, "visits-o1.js", "No shared resource encounters found");
		}
		CERN_VISITS_O1.GetVisits(component);
	});

	VisitsComponent.method("setViewableEncntrs", function(value) {
		this.m_viewableEncntrs = value;
	});

	VisitsComponent.method("getViewableEncntrs", function() {
		return this.m_viewableEncntrs;
	});

	VisitsComponent.method("HandleSuccess", function(recordData) {
		CERN_VISITS_O1.RenderComponent(this, recordData);
	});

	VisitsComponent.method("InsertData", function() {
		CERN_VISITS_O1.GetVisits(this);
	});
	VisitsComponent.method("setFutureMax", function(value) {
		this.m_futureMax = value;
	});
	VisitsComponent.method("getFutureMax", function() {
		return this.m_futureMax;
	});
	VisitsComponent.method("setPreviousMax", function(value) {
		this.m_previousMax = value;
	});
	VisitsComponent.method("getPreviousMax", function() {
		return this.m_previousMax;
	});
	VisitsComponent.method("setEncounterTypeCodes", function(values) {
		if (!(values instanceof Array)){
			throw Error("Called setEncounterTypeCodes on VisitsOpt1 with non array type for values parameter.");
		}
		this.m_encounterTypeCodes = values;
	});
	VisitsComponent.method("getEncounterTypeCodes", function() {
		if (!this.m_encounterTypeCodes){
			return [];
		}
		return this.m_encounterTypeCodes;
	});
	VisitsComponent.method("loadFilterMappings", function() {
		this.addFilterMappingObject("VISITS_ENCNTR_TYPE", {
			setFunction: this.setEncounterTypeCodes,
			type: "ARRAY",
			field: "PARENT_ENTITY_ID"
		});
	});
}

VisitsComponent.inherits(MPageComponent);

/**
 * Visits methods
 * @static
 * @global
 */
var CERN_VISITS_O1 = function() {
	var criterion;

	function seperateTodayDate(subsection, filteredArray, todayArray){
		var visitsDateFormat;
		var visitsDate = new Date();
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var todaysDateFormat = df.format(visitsDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
		var subsectionLength = subsection.length;
		for(var i = 0; i < subsectionLength; i++){
			visitsDate.setISO8601(subsection[i].DATE);
			visitsDateFormat = df.format(visitsDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
			if (todaysDateFormat === visitsDateFormat) {
				todayArray.push(subsection[i]);
			} else {
				filteredArray.push(subsection[i]);
			}
		}
	}

	function VisitSorter(a, b) {
		var aDate = a.DATE;
		var bDate = b.DATE;
		if (aDate > bDate) {
			return 1;
		} else if (aDate < bDate) {
			return -1;
		} else {
			return 0;
		}
	}

	function VisitSorterRev(a, b) {
		var aDate = a.DATE;
		var bDate = b.DATE;

		if (aDate > bDate) {
			return -1;
		} else if (aDate < bDate) {
			return 1;
		} else {
			return 0;
		}
	}

	function populateSubSections(jsData, sectionName, maxBedrock) {
		var DataCount = jsData.length;
		var jsSection = [];
		var jsHTMLContent = [];
		var filterText = "";
		var visitsI18n = i18n.discernabu.visits_o1;
		var dateTimeFormat = "";
		var dateTimeLink = "";
		var patientId = criterion.person_id;
		var encntrId = criterion.encntr_id;
		var providerId = criterion.provider_id;
		var positionCd = criterion.position_cd;

		for (var p = 0; p < DataCount; p++) {
			var DataObj = jsData[p];
			var dateTime = new Date();
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			dateTime.setISO8601(DataObj.DATE);
			dateTimeFormat = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			var currentlyViewingPar = "<p class='vis1-currentlyViewing-text secondary-text'> (" + visitsI18n.CURRENTLY_VIEWING + ")</p>"; 
			if (CERN_BrowserDevInd) {
				var sParams = [];
				var arDate = [];
				sParams.push(patientId, encntrId, providerId, positionCd, "\"" + DataObj.DATE + "\"");
				arDate.push("<a onclick='MD_reachViewerDialog.LaunchReachVisitsDetailViewer(" + sParams + "); return false;' href='#'>", dateTimeFormat);
				if (DataObj.ENCOUNTER_ID === encntrId) {
					arDate.push(currentlyViewingPar);
				}
				arDate.push("</a>");
				dateTimeLink = arDate.join("");
			} else {
				dateTimeLink = dateTimeFormat;
				if (DataObj.ENCOUNTER_ID === encntrId) {
					dateTimeLink += currentlyViewingPar;
				} 
			}
			jsSection.push("<dl class='vis-info'>", "<dt class='vis-dt'>", visitsI18n.DATE, "</dt>", "<dd class='vis-dt'><span>", dateTimeLink, "</span></dd><dt class='vis-tp'>", visitsI18n.TYPE, "</dt>", "<dd class='vis-tp'><span>", DataObj.TYPE, "</span></dd>", "<dt class='vis-lc'>", visitsI18n.LOCATION, "</dt>", "<dd class='vis-lc'><span>", DataObj.LOCATION, "</span></dd></dl>", "<h4 class='det-hd'><span>", visitsI18n.VISIT_DETAILS, "</span></h4>", "<div class='hvr'><dl class='vis-det'>", "<dt class='vis-det-vr'><span>", visitsI18n.VISIT_REASON, ":</span></dt>", "<dd class='vis-det-vr'><span>", DataObj.DESCRIPTION, "</span></dd></dl> </div>");
		}
		// section
		if (sectionName === visitsI18n.FUTURE && maxBedrock > 0) {
			//Add Code for Future Visits
			filterText = " " + "-" + " " + visitsI18n.NEXT_N_VISITS.replace("{0}", maxBedrock);

		}

		if (sectionName === visitsI18n.PREVIOUS && maxBedrock > 0) {

			//Add Code for Previous Visits
			filterText = " " + "-" + " " + visitsI18n.LAST_N_VISITS.replace("{0}", maxBedrock);
		}
		if (sectionName === visitsI18n.PREVIOUS) {
			jsHTMLContent.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'>", sectionName, " (", DataCount, ")", filterText, "</span></h3>", "<div class='sub-sec-content'>");
		} else {
			jsHTMLContent.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", visitsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", sectionName, " (", DataCount, ")", filterText, "</span></h3>", "<div class='sub-sec-content'>");
		}

		if (jsSection.length > 0) {
			jsHTMLContent.push("<div class='content-hdr'><dl class ='vis-info-hdr hdr'>", "<dd class ='vis-dt'><span>", visitsI18n.DATE, "</span></dd>", "<dd class ='vis-tp'><span>", visitsI18n.TYPE, "</span></dd>", "<dd class ='vis-lc'><span>", visitsI18n.LOCATION, "</span></dd></dl></div>", "<div class='content-body'>", jsSection.join(""));
		} else {
			jsHTMLContent.push("<div class='content-body'>", "<span class='res-none'>", visitsI18n.NO_RESULTS_FOUND, "</span>");
		}
		jsHTMLContent.push("</div></div></div>");
		return jsHTMLContent;
	}

	return {
		GetVisits: function(component) {
			// Gets the viewable encounters for rendering the component
			var sendAr = null;
			var program = "mp_get_visits";
			var prsnlInfo = "";
			var encntrs = component.getViewableEncntrs();
			var currentEncounterId = "0.0";
			var encntrVal = "";
			var encounterTypeCodes = "0.0";
			var encounterTypeFilter = "";
			var prevSchAppt = 1;
			criterion = component.getCriterion();
			if (!encntrs) {
				prsnlInfo = criterion.getPersonnelInfo();
				encntrs = prsnlInfo.getViewableEncounters();
				component.setViewableEncntrs(encntrs);
			}
			//Create parameter array for script call
			encntrVal = encntrs ? "value(" + encntrs + ")" : "0.0";
			encounterTypeCodes = component.getEncounterTypeCodes();
			encounterTypeFilter = encounterTypeCodes ? MP_Util.CreateParamArray(encounterTypeCodes, 1) : "0.0"; //If values are defined, these encounter types will be shown
			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrVal, encounterTypeFilter, currentEncounterId, prevSchAppt];

			MP_Core.XMLCclRequestWrapper(component, program, sendAr, true);
		},

		RenderComponent: function(component, recordData) {

			try {
				var countText = "";
				var jsHTML = [];
				var prevMax = component.getPreviousMax();
				var futureMax = component.getFutureMax();
				var visitsI18n = i18n.discernabu.visits_o1;
				// criterion data is retrieved in the GetVisits function, but if this point is reached without defining criterion,
				// it is defined.
				criterion = criterion || component.getCriterion();

				var prevVisitCount = 0;
				var futureVisitCount = 0;
				var todayVisitCount = 0;


				if (recordData.VISIT.length || recordData.FUTURE_VISIT.length) {
					//Move dates with the current date from the visits to the today and previous subsection.
					seperateTodayDate(recordData.VISIT, component.jsonPrevious, component.jsonToday);

					//Move dates with the current date from the future visits to the today and future subsection.
					seperateTodayDate(recordData.FUTURE_VISIT, component.jsonFuture, component.jsonToday);

					//Sorting future visits in ascending order
					component.jsonFuture.sort(VisitSorter);

					//Sorting previous visits in descending order
					component.jsonPrevious.sort(VisitSorterRev);

					//Sorting today visits in ascending order
					component.jsonToday.sort(VisitSorter);

					prevVisitCount = component.jsonPrevious.length;
					futureVisitCount = component.jsonFuture.length;
					todayVisitCount = component.jsonToday.length;

					//Follow the bedrock configurations set
					if (prevMax && prevMax < prevVisitCount) {
						component.jsonPrevious.splice(prevMax, prevVisitCount);
						prevVisitCount = prevMax;
					}
					if (futureMax && futureMax < futureVisitCount) {
						component.jsonFuture.splice(futureMax, futureVisitCount);
						futureVisitCount = futureMax;
					}
					//populate individual html array for respective section
					if (todayVisitCount > 0) {
						jsHTML = populateSubSections(component.jsonToday, visitsI18n.TODAY, 0);
					}
					jsHTML = jsHTML.concat(populateSubSections(component.jsonFuture, visitsI18n.FUTURE, futureMax));
					jsHTML = jsHTML.concat(populateSubSections(component.jsonPrevious, visitsI18n.PREVIOUS, prevMax));

				} else {
					component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), "(0)");
					return;
				}

				var visLen = prevVisitCount + futureVisitCount + todayVisitCount;
				var content = [];
				content.push("<div class ='", MP_Util.GetContentClass(component, visLen), "'>", jsHTML.join(""), "</div>");
				var vishtml = content.join("");

				countText = MP_Util.CreateTitleText(component, visLen);
				MP_Util.Doc.FinalizeComponent(vishtml, component, countText);
			} catch (err) {
				MP_Util.LogJSError(this, err, "visits-o1.js", "renderComponent");
				throw (err);
			} finally {
				//do nothing
			}
		}
	};
}();
