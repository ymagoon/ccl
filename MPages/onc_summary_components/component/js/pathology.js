function PathologyComponentStyle(){
    this.initByNamespace("path");
}
PathologyComponentStyle.inherits(ComponentStyle);

/**
 * The Pathology component will retrieve all documents associated to the encounter for the
 * specified lookback days defined by the component.
 * @param {Criterion} criterion
 */
function PathologyComponent(criterion){
    this.setCriterion(criterion);
    this.setLookBackDropDown(true);
    this.setStyles(new PathologyComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PATHOLOGY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PATHOLOGY.O1 - render component");
	this.m_resultStatusCodes = null;
	//meanings is used to allow loading of the status codes
	//when needed aka 'lazy loading'.  Hence why the retrieval of
	//meanings is not exposed to the consumer.  Only retrieval of codes
	//is available.
	this.m_resultStatusMeanings = null;
	this.setIncludeLineNumber(true);
	this.setPregnancyLookbackInd(true);
	
	PathologyComponent.method("HandleSuccess", function(data) {
		CERN_PATHOLOGY_O1.RenderComponent(this, data);
	});
	
	PathologyComponent.method("InsertData", function() {
		if(this.getGrouperFilterEventSets()) {
			CERN_PATHOLOGY_O1.RefreshDocumentsTable(this, this.getGrouperFilterLabel(), this.getGrouperFilterEventSets());
		}
		else {
			CERN_PATHOLOGY_O1.GetDocumentsTable(this);
		}
	});
	PathologyComponent.method("setResultStatusCodes", function(value) {
		this.m_resultStatusCodes = value;
	});
	PathologyComponent.method("addResultStatusCode", function(value) {
		if(!this.m_resultStatusCodes) {
			this.m_resultStatusCodes = [];
		}
		this.m_resultStatusCodes.push(value);
	});
	PathologyComponent.method("getResultStatusCodes", function() {
		if(this.m_resultStatusCodes) {
			return this.m_resultStatusCodes;
		}
		else {
			if(this.m_resultStatusMeanings) {
				//load up codes from meanings
				var resStatusCodeSet = MP_Util.GetCodeSet(8, false);
				if(this.m_resultStatusMeanings && this.m_resultStatusMeanings.length > 0) {
					for(var x = this.m_resultStatusMeanings.length; x--; ) {
						var code = MP_Util.GetCodeByMeaning(resStatusCodeSet, this.m_resultStatusMeanings[x]);
						if(code) {
							this.addResultStatusCode(code.codeValue);
						}
					}
				}
			}
		}
		return this.m_resultStatusCodes;
	});
	PathologyComponent.method("addResultStatusMeaning", function(value) {
		if(!this.m_resultStatusMeanings) {
			this.m_resultStatusMeanings = [];
		}
		this.m_resultStatusMeanings.push(value);
	});
	PathologyComponent.method("setResultStatusMeanings", function(value) {
		this.m_resultStatusMeanings = value;
	});
	PathologyComponent.method("FilterRefresh", function(label, esArray) {
		CERN_PATHOLOGY_O1.RefreshDocumentsTable(this, label, esArray);
	});
}
PathologyComponent.inherits(MPageComponent);

var CERN_PATHOLOGY_O1 = function() {
	
	function getLatestParticipation(doc) {
		var returnPart = null;
		for(var x = doc.ACTION_PROVIDERS.length; x--; ) {
			var part = doc.ACTION_PROVIDERS[x];
			if(!returnPart || part.DATE > returnPart.DATE) {
				returnPart = part;
			}
		}
		return (returnPart);
	}

	function DocumentSorter(a, b) {
		var aDate = new Date();
		aDate.setISO8601(a.EFFECTIVE_DATE);
		var bDate = new Date();
		bDate.setISO8601(b.EFFECTIVE_DATE);

		if(aDate > bDate) {
			return -1;
		}
		else if(aDate < bDate) {
			return 1;
		}
		else {
			return 0;
		}
	}

	function getAuthorParticipant(doc) {
		//the author of a document, according to doc services, will be on the Contribution object.  It�s the PERFORM action in the participation list.
		var returnPart = null, type_cd = null, status_cd = null, part = null, strPerform = "PERFORM", strCompleted = "COMPLETED";
		for(var y = doc.ACTION_PROVIDERS.length; y--; ) {
			part = doc.ACTION_PROVIDERS[y];
			type_cd = part.TYPE_CD_MEANING;
			status_cd = part.STATUS_CD_MEANING;
			if((type_cd === strPerform) && (status_cd === strCompleted)) {
				returnPart = part;
				break;
			}
		}
		return (returnPart);
	}

	return {
		GetDocumentsTable : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var groups = component.getGroups();
			var codes = component.getResultStatusCodes();
			var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
			var results = (codes && codes.length > 0) ? codes : null;

			var encntrOption = (component.getScope() === 2) ? (criterion.encntr_id + ".0") : "0.0";
			sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", component.getLookbackUnits());
			sendAr.push(MP_Util.CreateParamArray(events, 1));
			sendAr.push(MP_Util.CreateParamArray(results, 1));
			var unitType = component.getLookbackUnitTypeFlag();
			sendAr.push(criterion.ppr_cd + ".0", unitType);
			/** 			
			* Reach - The script mp_retrieve_documents_json_dp will execute the subroutine getDocumentImages when the 
			* parameter getdocimages value is 1. This is required to open document reports with images through pathology component. 
			*/
			if(CERN_BrowserDevInd)
			{
				sendAr.push(1);
			}
			MP_Core.XMLCclRequestWrapper(component, "MP_RETRIEVE_DOCUMENTS_JSON_DP", sendAr);
		},
		RefreshDocumentsTable : function(component, filterLabel, filterESArray) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var codes = component.getResultStatusCodes();
			var encntrOption = (component.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
			sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", component.getLookbackUnits());
			sendAr.push(MP_Util.CreateParamArray(filterESArray, 1));
			sendAr.push(MP_Util.CreateParamArray(codes, 1));
			var unitType = component.getLookbackUnitTypeFlag();
			sendAr.push(criterion.ppr_cd + ".0", unitType);
			/** 			
			* Reach - The script mp_retrieve_documents_json_dp will execute the subroutine getDocumentImages when the 
			* parameter getdocimages value is 1. This is required to open document reports with images through pathology component. 
			*/
			if(CERN_BrowserDevInd)
			{
				sendAr.push(1);
			}
			MP_Core.XMLCclRequestWrapper(component, "MP_RETRIEVE_DOCUMENTS_JSON_DP", sendAr);
		},
		RenderComponent : function(component, recordData) {
			try {
				var criterion = component.getCriterion();
				var compNS = component.getStyles().getNameSpace();
				var DocI18n = i18n.discernabu.pathology_o1;
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var sHTML = "";
				var countText = "";
				var jsHTML = [];

				jsHTML.push("<div class='content-hdr'><dl class='", compNS, "-info-hdr hdr'><dd class='", compNS + "-cat-hd'><span>&nbsp;</span></dd>", "<dd class='", compNS, "-auth-hd'><span>", DocI18n.AUTHOR, "</span></dd><dd class='", compNS, "-dt-hd'><span>", DocI18n.DATE, "</span></dd>");

				if (component.getDateFormat() == 3) {////1 = date only,2= date/time and 3 = elapsed time
					jsHTML.push("<dd class='", compNS + "-cat-hd'><span>&nbsp;</span></dd><dd class='", compNS, "-auth-hd'><span>&nbsp;</span></dd><dd class='", compNS, "-dt-hd'><span>", DocI18n.WITHIN, "</span></dd>");
				}
				jsHTML.push("</dl></div>");
				recordData.DOCS.sort(DocumentSorter);

				jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.DOCS.length), "'>");
				for (var x = 0, xl = recordData.DOCS.length; x < xl; x++) {
					var dtHvr = "", lastPrsnl = "";
					var author = DocI18n.UNKNOWN;
					var docObj = recordData.DOCS[x];
					var patId = docObj.PERSON_ID + ".0";
					var enctrId = docObj.ENCNTR_ID + ".0";
					var evntId = docObj.EVENT_ID + ".0";
					var docStatus = docObj.RESULT_STATUS_CD_MEAN;
					var doc = docObj.EVENT_CD_DISP;
					var parentEventId = docObj.PARENT_EVENT_ID + ".0";
					var viewerType = docObj.VIEWER_TYPE;
					var dateOfService = null;
					var withinDateDos = null;
					var dateTime = new Date();
					var imageUrl = docObj.IMAGE_URL;
					var providerId = criterion.provider_id;
					var imageIndicator = 0;
					
					//FACE UP DATE
					if (docObj.EFFECTIVE_DT_TM) {
						dateTime.setISO8601(docObj.EFFECTIVE_DATE);
						dateOfService = MP_Util.DisplayDateByOption(component, dateTime);
						withinDateDos = MP_Util.CalcWithinTime(dateTime);

					}
					else {
						dateOfService = DocI18n.UNKNOWN;
						withinDateDos = DocI18n.UNKNOWN;
					}

					//info related to participation
					var recentPart = getLatestParticipation(docObj);
					var authorPart = getAuthorParticipant(docObj);

					if (authorPart) {
						author = authorPart.PRSNL_NAME;
					}

					if (recentPart && recentPart.PRSNL_NAME !== "") {
						lastPrsnl = recentPart.PRSNL_NAME;
						var dtTm = new Date();
						if (recentPart.DATE !== "") {
							dtTm.setISO8601(recentPart.DATE);
						}
					}
					else {
						lastPrsnl = DocI18n.UNKNOWN;
					}
					
					if(CERN_BrowserDevInd)
					{	
						var	sParams = [];
						var arDisplay = [];
						sParams.push(patId, enctrId, evntId, '"' + doc + '"', '"' + viewerType + '"', parentEventId, '"' + imageUrl + '"', providerId, imageIndicator, '"' + doc + '"');
						arDisplay.push("<a onclick='MD_reachViewerDialog.LaunchReachClinNoteViewer(", sParams, "); return false;' href='#'>", doc, "</a>");								
						var linkDisplay = arDisplay.join("");		
						
						jsHTML.push("<dl class='", compNS, "-info'><dd class='", compNS + "-cat'><span>", linkDisplay , "</span>");
					}
					else
					{
						jsHTML.push("<dl class='", compNS, "-info'><dd class='", compNS + "-cat'><span>", MP_Util.CreateClinNoteLink(patId, enctrId, evntId, doc, viewerType, parentEventId), "</span>");
					}					
					
					if (docStatus === "MODIFIED" || docStatus === "ALTERED") {
						jsHTML.push("<span class='res-modified'>&nbsp;</span>");
					}
					jsHTML.push("</dd>");
					jsHTML.push("<dd class='", compNS, "-auth'><span>", author, "</span></dd>");
					if (component.getDateFormat() == 3) {//1 = date only,2= date/time and 3 = elapsed time
						jsHTML.push("<dd class='", compNS, "-dt'><span class='date-time'>", withinDateDos, "</span></dd>");
					}
					else {
						jsHTML.push("<dd class='", compNS, "-dt'><span class='date-time'>", dateOfService, "</span></dd>");
					}
					jsHTML.push("</dl>");
				}
				jsHTML.push("</div>");
				sHTML = jsHTML.join("");
				countText = MP_Util.CreateTitleText(component, recordData.DOCS.length);
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
				//Shift column header if sroll bar is active
				if (component.isScrollingEnabled() && (recordData.DOCS.length >= component.getScrollNumber())) {
					var xNode = Util.Style.g(compNS + "-info-hdr", document.body, "DL");
					if (xNode[0]) {
						Util.Style.acss(xNode[0], "hdr-scroll");
					}
				}
			}
			catch(err) {
				MP_Util.LogJSError(err, null, "pathology.js", "RenderComponent");
				throw (err);
			}
		}

	};
}();

