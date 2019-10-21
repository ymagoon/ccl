function DiagnosticsComponent2Style() {
	this.initByNamespace("dg2");
}

DiagnosticsComponent2Style.inherits(ComponentStyle);

function DiagnosticsComponent2(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new DiagnosticsComponent2Style());
	this.setComponentLoadTimerName("USR:MPG.DIAGNOSTICS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DIAGNOSTICS.O2 - render component");
	this.setIncludeLineNumber(true);
	
	//Flag for pregnancy onset date lookback time frame
	this.setPregnancyLookbackInd(true);
	
	this.DiagActiveList = [];
	this.SubSecLabels = [];
	this.m_docImagesInd = 0;
	var label1 = "", label2 = "", label3 = "", label4 = "", label5 = "", label6 = "", label7 = "", label8 = "", label9 = "", label10 = "";
	var events1 = "0.0", events2 = "0.0", events3 = "0.0", events4 = "0.0", events5 = "0.0", events6 = "0.0", events7 = "0.0", events8 = "0.0", events9 = "0.0", events10 = "0.0";

	DiagnosticsComponent2.method("InsertData", function() {
		CERN_DIAGNOSTICS_O2.getDiagnostics(this);
	});
	
	
	DiagnosticsComponent2.method("isDocImagesInd", function() {
		return this.m_docImagesInd;
	});
	DiagnosticsComponent2.method("setDocImagesInd", function(value) {
		this.m_docImagesInd = value;
	}); 


	DiagnosticsComponent2.method("HandleReply", function(reply) {
		var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		try {
			if (reply.getStatus() == "S") {
				CERN_DIAGNOSTICS_O2.renderComponent(this, reply.getResponse());
			} else {
				var errMsg = [];
				var countText = "(0)";

				if (reply.getStatus() == "F") {
					errMsg.push(reply.getError());
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), this, countText);
				} else {
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), this, countText);
				}
				// update count text in the navigation pane
				CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
					"count" : 0
				});
			}
		} catch(err) {
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
	});

	//Setters for all the group labels
	DiagnosticsComponent2.method("setLabel1", function(value) {
		label1 = value;
	});
	DiagnosticsComponent2.method("setLabel2", function(value) {
		label2 = value;
	});
	DiagnosticsComponent2.method("setLabel3", function(value) {
		label3 = value;
	});
	DiagnosticsComponent2.method("setLabel4", function(value) {
		label4 = value;
	});
	DiagnosticsComponent2.method("setLabel5", function(value) {
		label5 = value;
	});
	DiagnosticsComponent2.method("setLabel6", function(value) {
		label6 = value;
	});
	DiagnosticsComponent2.method("setLabel7", function(value) {
		label7 = value;
	});
	DiagnosticsComponent2.method("setLabel8", function(value) {
		label8 = value;
	});
	DiagnosticsComponent2.method("setLabel9", function(value) {
		label9 = value;
	});
	DiagnosticsComponent2.method("setLabel10", function(value) {
		label10 = value;
	});

	//Setters for all the event sets
	DiagnosticsComponent2.method("setEvents1", function(value) {
		events1 = value;
	});
	DiagnosticsComponent2.method("setEvents2", function(value) {
		events2 = value;
	});
	DiagnosticsComponent2.method("setEvents3", function(value) {
		events3 = value;
	});
	DiagnosticsComponent2.method("setEvents4", function(value) {
		events4 = value;
	});
	DiagnosticsComponent2.method("setEvents5", function(value) {
		events5 = value;
	});
	DiagnosticsComponent2.method("setEvents6", function(value) {
		events6 = value;
	});
	DiagnosticsComponent2.method("setEvents7", function(value) {
		events7 = value;
	});
	DiagnosticsComponent2.method("setEvents8", function(value) {
		events8 = value;
	});
	DiagnosticsComponent2.method("setEvents9", function(value) {
		events9 = value;
	});
	DiagnosticsComponent2.method("setEvents10", function(value) {
		events10 = value;
	});

	//Getters for all the group labels
	DiagnosticsComponent2.method("getLabel1", function() {
		return label1;
	});
	DiagnosticsComponent2.method("getLabel2", function() {
		return label2;
	});
	DiagnosticsComponent2.method("getLabel3", function() {
		return label3;
	});
	DiagnosticsComponent2.method("getLabel4", function() {
		return label4;
	});
	DiagnosticsComponent2.method("getLabel5", function() {
		return label5;
	});
	DiagnosticsComponent2.method("getLabel6", function() {
		return label6;
	});
	DiagnosticsComponent2.method("getLabel7", function() {
		return label7;
	});
	DiagnosticsComponent2.method("getLabel8", function() {
		return label8;
	});
	DiagnosticsComponent2.method("getLabel9", function() {
		return label9;
	});
	DiagnosticsComponent2.method("getLabel10", function() {
		return label10;
	});

	//Getters for all the event sets
	DiagnosticsComponent2.method("getEvents1", function() {
		return "value(" + events1 + ")";
	});
	DiagnosticsComponent2.method("getEvents2", function() {
		return "value(" + events2 + ")";
	});
	DiagnosticsComponent2.method("getEvents3", function() {
		return "value(" + events3 + ")";
	});
	DiagnosticsComponent2.method("getEvents4", function() {
		return "value(" + events4 + ")";
	});
	DiagnosticsComponent2.method("getEvents5", function() {
		return "value(" + events5 + ")";
	});
	DiagnosticsComponent2.method("getEvents6", function() {
		return "value(" + events6 + ")";
	});
	DiagnosticsComponent2.method("getEvents7", function() {
		return "value(" + events7 + ")";
	});
	DiagnosticsComponent2.method("getEvents8", function() {
		return "value(" + events8 + ")";
	});
	DiagnosticsComponent2.method("getEvents9", function() {
		return "value(" + events9 + ")";
	});
	DiagnosticsComponent2.method("getEvents10", function() {
		return "value(" + events10 + ")";
	});
	DiagnosticsComponent2.method("isEvents1Configured", function() {
		return (events1 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents2Configured", function() {
		return (events2 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents3Configured", function() {
		return (events3 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents4Configured", function() {
		return (events4 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents5Configured", function() {
		return (events5 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents6Configured", function() {
		return (events6 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents7Configured", function() {
		return (events7 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents8Configured", function() {
		return (events8 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents9Configured", function() {
		return (events9 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("isEvents10Configured", function() {
		return (events10 !== "0.0") ? true : false;
	});
	DiagnosticsComponent2.method("resizeComponent", function() {
		//Call the base class functionality to resize the component
		MPageComponent.prototype.resizeComponent.call(this);

		//Adjust the component headers if scrolling is applied
		var contentBody = $("#" + this.getStyles().getContentId()).find(".content-body");
		if (contentBody.length) {
			var maxHeight = parseInt($(contentBody).css("max-height").replace("px", ""), 10);

			//Get height of all sub sections
			var contentHeight = 0;
			contentBody.find(".sub-sec").each(function(index) {
				contentHeight += $(this).outerHeight(true);
			});

			if (!isNaN(maxHeight) && (contentHeight > maxHeight)) {
				$("#DiagHdrRow" + this.getComponentId()).addClass("shifted hdr-shift");
			} else {
				$("#DiagHdrRow" + this.getComponentId()).removeClass("shifted hdr-shift");
			}
		}
	});
}

DiagnosticsComponent2.inherits(MPageComponent);


DiagnosticsComponent2.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for the retrieving MMF Document URL Images
	this.addFilterMappingObject("WF_DIAG_URL_IMAGES", {
		setFunction: this.setDocImagesInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
}; 


/**
 * Document methods
 * @namespace CERN_DIAGNOSTICS_O2
 * @static
 * @global
 */
var CERN_DIAGNOSTICS_O2 = function() {
	var diagI18n = i18n.discernabu.diagnostics_o2;

	function getLatestParticipation(diag) {
		var returnPart = null;
		for (var x = diag.ACTION_PROVIDERS.length; x--; ) {
			var part = diag.ACTION_PROVIDERS[x];
			if (!returnPart || part.DATE > returnPart.DATE) {
				returnPart = part;
			}
		}
		return (returnPart);
	}

	function sortByEffectiveDate(a, b) {
		if (a.DT_TM > b.DT_TM) {
			return -1;
		} else if (a.DT_TM < b.DT_TM) {
			return 1;
		}
		return 0;
	}

	function generateHeaderRowHTML(component) {
		var compNS = component.getStyles().getNameSpace();
		var compID = component.getComponentId();
		var jsHTML = [];
		var result_dt_tm = diagI18n.DATE_TIME;
		var update_dt_tm = diagI18n.LAST_UPDT_DT;

		// add "ago" underneath the headers if showing elapsed time
		if (component.getDateFormat() == 3) {
			result_dt_tm += "<br/>" + diagI18n.AGO;
			update_dt_tm += "<br/>" + diagI18n.AGO;
		}

		jsHTML.push(
		// begin header row
		"<dl class='dg2-info-hdr hdr' id='DiagHdrRow", component.getComponentId(), "'>",
		// Exam header
		"<dd class='dg2-name-hd dg2-info-hdr-sortIcon'><span>", diagI18n.NAME, "</span></dd>",
		// Reason For Exam header
		"<dd class='dg2-reason-hd dg2-info-hdr-sortIcon'><span>", diagI18n.REASON, "</span></dd>",
		// Result Date/Time header
		"<dd class='dg2-within-hd dg2-info-hdr-sortIcon'><span>", result_dt_tm, "</span></dd>",
		// Last Updated Date/Time header
		"<dd class='dg2-within-hd dg2-info-hdr-sortIcon'><span>", update_dt_tm, "</span></dd>",
		// Status header
		"<dd class='dg2-within-hd dg2-info-hdr-sortIcon'><span>", diagI18n.STATUS, "</span></dd>",
		// Image header space
		"<dd class='dg2-image-hd'><span>&nbsp;</span></dd>");

		jsHTML.push("</dl>");

		return jsHTML.join('');
	}

	/**
	 *  function to generate an HTML string
	 */
	function singleRowDiagHTML(htmlData, compID) {
		var component = MP_Util.GetCompObjById(compID);

		var sHTML = "";
		var sNoData="--";
		var sHTMLArr = [];

		sHTMLArr.push("<h3 class='info-hd'>", htmlData.display, "</h3>");

		if (htmlData.statusMean === "MODIFIED" || htmlData.statusMean === "ALTERED") {
			sHTMLArr.push("<dt class=" + htmlData.zebraStriping + "'><span>", diagI18n.diagnostics, ":</span></dt><dd class='dg2-name'><span>", (htmlData.link)?htmlData.link:sNoData, "</span><span class='res-modified'>&nbsp;</span></dd>");
		} else {
			sHTMLArr.push("<dt class=" + htmlData.zebraStriping + "'><span>", diagI18n.diagnostics, ":</span></dt><dd class='dg2-name'><span>", (htmlData.link)?htmlData.link:sNoData, "</span></dd>");
		}

		sHTMLArr.push("<dt><span>", diagI18n.reason, ":</span></dt><dd class='dg2-reason'><span>", (htmlData.reason) ? htmlData.reason : sNoData, "</span></dd>");

		sHTMLArr.push("<dt><span>", diagI18n.dateTime, ":</span></dt><dd class='dg2-within'><span>", (htmlData.sDate) ? htmlData.sDate : sNoData, "</span></dd>");

		sHTMLArr.push("<dt><span>", diagI18n.lastUpdtTm, ":</span></dt><dd class='dg2-within'><span>", (htmlData.lDate) ? htmlData.lDate : sNoData, "</span></dd>");

		sHTMLArr.push("<dt><span>", diagI18n.status, ":</span></dt><dd class='dg2-within'><span>", (htmlData.status)?htmlData.status:sNoData, "</span></dd>");

		if (htmlData.imageUrl !== "") {
			sHTMLArr.push("<dd class='dg2-image'><span><a class='dg2-image-found' onclick='ResultViewer.launchAdHocImageViewer(" + htmlData.rec.EVENT_ID +")'>&nbsp;</a></span></dd>");
		} else {
			sHTMLArr.push("<dd class='dg2-image'><span>&nbsp;</span></dd>");
		}


		sHTML = sHTMLArr.join("");
		return sHTML;
	}

	/**
	 *  function to generate subsections on initial load
	 */
	function createSubsection(secFlag, recData, title, component, isConfigured) {
		if (!isConfigured) {
			//if component not configured, do not display the subsection
			return "";
		}
		var ar = [];
		var recSize = recData.length;
		var compID = component.getComponentId();
		var jsDiagHTML = [];
		var sDiagHTML = [];

		jsDiagHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title=", diagI18n.HIDE_SECTION, ">-</span><span class='sub-sec-title'>", title, " (", recSize, ")</span></h3>");
		jsDiagHTML.push("<div class='sub-sec-content'>");
		if (recSize > 0) {
			recData.sort(sortByEffectiveDate);
			for (var x = 0; x < recSize; x++) {
				var rec = recData[x];
				var sDate = "";
				var lDate = "";
				var lastUpdateDate = "";
				var zebraStriping = (x % 2 === 0) ? "odd" : "even";

				var effectiveDate = (rec.DT_TM.search("0000-00-00") !== -1) ? "" : new Date();

				if (effectiveDate) {
					effectiveDate.setISO8601(rec.DATE);
					sDate = MP_Util.DisplayDateByOption(component, effectiveDate);
				}

				var actProvSize = rec.ACTION_PROVIDERS.length;

				if (actProvSize === 0) {
					lastUpdateDate = "";
				}

				for (var y = 0; y < actProvSize; y++) {
					lastUpdateDate = (rec.ACTION_PROVIDERS[y].DATE.search("0000-00-00") !== -1) ? "" : new Date();

					//find last update date/time
					var recentPart = getLatestParticipation(rec);

					if (recentPart.DATE !== "") {
						lastUpdateDate.setISO8601(recentPart.DATE);
						lDate = MP_Util.DisplayDateByOption(component, lastUpdateDate);
					}
				}
				var recordDisplay = rec.DISPLAY || "&nbsp;";
				var link = "<a onclick='CERN_DIAGNOSTICS_O2.openResultViewer(" + rec.EVENT_ID + ",\""+ component.getCriterion().category_mean + "\")'>" + recordDisplay+ "</a>";
				var htmlData = {
					rec : recData[x],
					display : rec.DISPLAY,
					zebraStriping : zebraStriping,
					diagnostics : rec.DIAGNOSTICS,
					link : link,
					imageUrl : rec.IMAGE_URL,
					statusMean : rec.STATUS_MEAN,
					reason : rec.REASON_FOR_EXAM,
					dateTime : rec.DT_TM,
					lastUpdtTm : rec.DATE,
					status : rec.STATUS,
					sDate : sDate,
					lDate : lDate
				};

				//add zebra stripping class
				jsDiagHTML.push("<dl class='dg2-info " + zebraStriping + "'>");

				//get single row HTML string
				sDiagHTML = singleRowDiagHTML(htmlData, compID);

				jsDiagHTML.push(sDiagHTML);

				jsDiagHTML.push("</dl>");

				var thisDoc = {
					title : title,
					secFlag : secFlag,
					examDisp : rec.DISPLAY,
					url : rec.IMAGE_URL,
					examReason : rec.REASON_FOR_EXAM,
					resultDate : effectiveDate,
					updateDate : lastUpdateDate,
					examStatus : rec.STATUS,
					html : sDiagHTML
				};
				component.DiagActiveList.push(thisDoc);
			}
		} else {
			jsDiagHTML.push("<div><span class='res-none'>" + diagI18n.NO_RESULTS_FOUND + "</span></div>");
		}

		jsDiagHTML.push("</div></div>");
		return jsDiagHTML.join("");
	}

	/**
	 * displayCurrentSortIndicator: This function will display the current sorting icon indicator on the sorted column.
	 * @param nSortInd {number} number to indicator which column and ascending/descending
	 *                      (i.e. 11: 1st column (name), ascending
	 *                                12: 1st column (name), descending
	 */
	function displayCurrentSortIndicator(compID, nSortInd) {
		var component = MP_Util.GetCompObjById(compID);
		var spnPar = _g('DiagHdrRow' + compID);
		var tdAr = Util.Style.g(component.getStyles().getNameSpace() + "-info-hdr-sortIcon", spnPar, "DD");
		// invalid argument
		if (!nSortInd) {
			return;
		}

		var dd = tdAr[Math.floor(nSortInd / 10) - 1];
		// if it is an odd number, then the sort order is ascending
		Util.Style.acss(dd, (nSortInd % 2 === 1) ? "ascend" : "descend");

	}//end  displayCurrentSortIndicator

	/**
	 * Attaches listners to:
	 * 	the headings for sorting
	 *
	 * @param component the component to attach listeners to
	 */
	function attachListeners(component) {
		var compID = component.getComponentId();
		var namespace = component.getStyles().getNameSpace();
		var headerSelector = ['#', namespace, 'Content', compID, ' .', namespace, '-info-hdr-sortIcon'].join('');
		//eg. #dgContent1525653 .dg2-info-hdr-sortIcon

		// attach listeners to each header
		$(headerSelector).each(function(i, element) {
			$(element).click(function() {
				sortDiagnostics(i, compID);
				return false;
			});
		});

	}// end attachListeners

	/**
	 * To sort the array of Diagnostics.
	 * @param {Integer} colNum The column number.
	 * @param {Integer} compID The component ID for the Document.
	 * @function
	 * @memberof
	 * @name sortDiagnostics
	 */
	function sortDiagnostics(colNum, compID) {
		var sortOrd = 0;
		var component = MP_Util.GetCompObjById(compID);
		sortOrd = checkSortingOrder(compID, colNum);
		var sortRes = 0;
		switch (colNum) {
			case 0:
				// Exam Name
				function sortByExamName(a, b) {
					if (a.examDisp.toUpperCase() < b.examDisp.toUpperCase()) {
						sortRes = 1;
					} else {
						sortRes = -1;
					}
					if (sortOrd == 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}


				component.DiagActiveList.sort(sortByExamName);
				break;

			case 1:
				// Reason For Exam
				function sortByReasonForExam(a, b) {
					if (a.examReason.toUpperCase() < b.examReason.toUpperCase()) {
						sortRes = 1;
					} else {
						sortRes = -1;
					}
					if (sortOrd == 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}


				component.DiagActiveList.sort(sortByReasonForExam);
				break;

			case 2:
				//Result Date
				function sortByDate(a, b) {
					if (a.resultDate < b.resultDate) {
						sortRes = 1;
						if (sortOrd == 1) {
							sortRes = sortRes * -1;
						}
						return sortRes;
					} else if (a.resultDate > b.resultDate) {
						sortRes = -1;
						if (sortOrd == 1) {
							sortRes = sortRes * -1;
						}
						return sortRes;
					}
					return 0;
				}


				component.DiagActiveList.sort(sortByDate);
				break;

			case 3:
				// Update Date/Time
				function sortByUpdateDateTime(a, b) {
					if (a.updateDate < b.updateDate) {
						sortRes = 1;
						if (sortOrd == 1) {
							sortRes = sortRes * -1;
						}
						return sortRes;
					} else if (a.updateDate > b.updateDate) {
						sortRes = -1;
						if (sortOrd == 1) {
							sortRes = sortRes * -1;
						}
						return sortRes;
					}
					return 0;
				}


				component.DiagActiveList.sort(sortByUpdateDateTime);
				break;

			case 4:
				// Status
				function sortByDocStatus(a, b) {
					if (a.examStatus.toUpperCase() < b.examStatus.toUpperCase()) {
						sortRes = 1;
					} else {
						sortRes = -1;
					}
					if (sortOrd == 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}


				component.DiagActiveList.sort(sortByDocStatus);
				break;

		}

		//Find the component and refresh to display the order list in the component, need to do this way because the hover is needed to turn on from the FinalizeComponent
		filterDiag(compID);

		//Display sorting icon indicator on the sorted column
		var spnPar = _g('DiagHdrRow' + compID);
		var tdAr = Util.Style.g(component.getStyles().getNameSpace() + "-info-hdr-sortIcon", spnPar, "DD");
		var tlen = tdAr.length;

		for (var t = 0; t < tlen; t++) {
			var dd = tdAr[t];
			if (t == colNum && t < 5)//set sort indicator icon for the sorted column
			{
				if (sortOrd === 0)//descending
				{
					Util.Style.acss(dd, "descend");
					Util.Style.rcss(dd, "ascend");
				} else//ascending
				{
					Util.Style.acss(dd, "ascend");
					Util.Style.rcss(dd, "descend");
				}
			} else//remove sort indicator icon for other columns.
			{
				Util.Style.rcss(dd, "descend");
				Util.Style.rcss(dd, "ascend");
			}
		}

	}//end sortDiagnostics

	/**
	 * To check the current sorting order for a clicked column.
	 * @param {Integer} colNum The column number.
	 * @param {number} compID the component id.
	 * @return {Integer} The order of sorting will be used for the clicked column
	 *
	 * @name checkSortingOrder
	 */
	function checkSortingOrder(compID, colNum) {
		var sortOrd = 0;
		var component = MP_Util.GetCompObjById(compID);
		var spnPar = _g('DiagHdrRow' + compID);
		var tdAr = Util.Style.g(component.getStyles().getNameSpace() + "-info-hdr-sortIcon", spnPar, "DD");
		var tlen = tdAr.length;

		var td = tdAr[colNum];
		//check the current class of the clicked column to find out what its current sorting status is.
		if (Util.Style.ccss(td, "ascend") || Util.Style.ccss(td, "ascend-image")) {
			sortOrd = 0;
			//set sortOrd will be descending
		} else//column has not sorted or descending, start as ascending
		{
			sortOrd = 1;
			//set sortOrd will be ascending
		}
		return sortOrd;
	}// end checkSortingOrder

	/**
	 * To the click event on expand/collapse toggle to add call to resizeComponent function.
	 * @param {number} compID the component id.
	 *
	 * @name updateToggleClickEvent
	 */
	function updateToggleClickEvent(compID) {

		//The order the events fire are important to ensure the header row gets shifted correctly
		//if expanding a subsection creates a scrollbar (or collapsing hides it).
		//In IE9 and other modern browsers, events fire in the order they were added.
		//IE7 however, either chooses randomly, or fires in the reverse order, so it is necessary to
		//combine the two separate events into one event.
		var diagSecToggles = $("#dg2Content" + compID + " .sub-sec-hd-tgl");
		var comp = MP_Util.GetCompObjById(compID);

		diagSecToggles.each(function() {
			//Unbinding existing click event from the expand/collapse toggles for this component.
			//Using get(0) so the Healthe library can correctly read the element.
			//get(0) will always work since this is within 'each'
			Util.removeEvent($(this).get(0), "click", MP_Util.Doc.ExpandCollapse);

			$(this).on("click.diag2", function() {
				//Re-implement the expand/collapse functionality from mpage-core
				var i18nCore = i18n.discernabu;
				if ($(this).closest(".sub-sec").hasClass("closed")) {
					$(this).closest(".sub-sec").removeClass("closed");
					$(this).html("-");
					$(this).attr("title", i18nCore.HIDE_SECTION);
				} else {
					$(this).closest(".sub-sec").addClass("closed");
					$(this).html("+");
					$(this).attr("title", i18nCore.SHOW_SECTION);
				}
				//Logic to determine if header should shift
				comp.resizeComponent();
			});
		});

	}// end updateToggleClickEvent

	// A function to refresh the table after the column header is selected
	function filterDiag(compID) {
		var component = MP_Util.GetCompObjById(compID);
		var compNS = component.getStyles().getNameSpace();
		var jsHTML = [];
		var jsTempHTML = [];
		var diagCnt = component.DiagActiveList.length;
		var subSecCnt = component.SubSecLabels.length;

		jsHTML.push("<div class='dg2-outline'>");

		// generate HTML for the header row
		jsHTML.push(generateHeaderRowHTML(component));

		jsHTML.push("<div class='", MP_Util.GetContentClass(component, diagCnt), "'>");

		var activeLen = diagCnt;
		var subSecLen = subSecCnt;

		for (var b = 0; b < subSecLen; b++) {
			var secCnt = 0;
			var secFlag = component.SubSecLabels[b].secFlag;
			var jsTempHTML2 = [];
			var zebraRefresh = "even";

			for (var c = 0; c < activeLen; c++) {
				if (component.DiagActiveList[c].secFlag == secFlag) {
					zebraRefresh = (zebraRefresh == "odd") ? "even" : "odd";
					jsTempHTML2.push("<dl class='dg2-info " + zebraRefresh + "'>");
					jsTempHTML2.push(component.DiagActiveList[c].html);
					jsTempHTML2.push("</dl>");
					secCnt += 1;
				}
			}

			jsTempHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title=", diagI18n.HIDE_SECTION, ">-</span><span class='sub-sec-title'>", component.SubSecLabels[b].label, " (", secCnt, ")</span></h3>");
			jsTempHTML.push("<div class='sub-sec-content'>");

			if (secCnt === 0) {
				jsTempHTML.push("<div><span class='res-none'>" + diagI18n.NO_RESULTS_FOUND + "</span></div>");
				jsTempHTML.push("</div></div>");
			} else {
				$.merge(jsTempHTML, jsTempHTML2);
				jsTempHTML.push("</div></div>");
			}

		}
		jsTempHTML.push("</div></div>");

		jsHTML.push(jsTempHTML.join(""));

		var countText = MP_Util.CreateTitleText(component, diagCnt);
		MP_Util.Doc.FinalizeComponent(jsHTML.join(""), component, countText);

		//Call the post processing function again since the content of the component changed.
		component.resizeComponent();

		//Update click event for expand/collapse toggles
		updateToggleClickEvent(compID);

		// update count text in the navigation pane
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
			"count" : diagCnt
		});

		// attach listeners
		attachListeners(component);

		return;

	}// end filterDiag

	return {
		getDiagnostics : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var encntrOption = (component.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
			sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", criterion.ppr_cd + ".0", component.getLookbackUnits(), component.getLookbackUnitTypeFlag(), component.getEvents1(), component.getEvents2(), component.getEvents3(), component.getEvents4(), component.getEvents5(), component.getEvents6(), component.getEvents7(), component.getEvents8(), component.getEvents9(), component.getEvents10());
			sendAr.push(component.isDocImagesInd() ? 1 : 0);

			var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
			request.setProgramName("MP_RETRIEVE_DIAGNOSTICS_GROUPS");
			request.setParameters(sendAr);
			request.setAsync(true);

			MP_Core.XMLCCLRequestCallBack(component, request, function(reply) {
				component.HandleReply(reply);
			});
		},
		/*
		 * Opens the result viewer using the given eventId
		 * @param {number} eventId the id of the clinical event to view results for.
		 * @param {string} categoryMean the category mean of the view the component is on.
		 */
		openResultViewer : function(eventId, categoryMean) {
			var resultViewTimer = new CapabilityTimer("CAP:MPG Diagnostics O2 Open Result Viewer", categoryMean);
			resultViewTimer.capture();
			ResultViewer.launchAdHocViewer(eventId);
		},
		renderComponent : function(component, recordData) {
			var componentID = component.getComponentId();
			var arHTML = [];
			var totalCnt = recordData.EVENT1.length + recordData.EVENT2.length + recordData.EVENT3.length + recordData.EVENT4.length + recordData.EVENT5.length + recordData.EVENT6.length + recordData.EVENT7.length + recordData.EVENT8.length + recordData.EVENT9.length + recordData.EVENT10.length;
			// reset Array's
			component.DiagActiveList = [];
			component.SubSecLabels = [];

			arHTML.push("<div class='dg2-outline'>");

			// generate HTML for the header row
			arHTML.push(generateHeaderRowHTML(component));

			arHTML.push("<div class =\"", MP_Util.GetContentClass(component, totalCnt), "\">");

			// Store Sub Section labels in array to use when sorting
			if (component.isEvents1Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 0,
					"label" : component.getLabel1()
				});
			}
			if (component.isEvents2Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 1,
					"label" : component.getLabel2()
				});
			}
			if (component.isEvents3Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 2,
					"label" : component.getLabel3()
				});
			}
			if (component.isEvents4Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 3,
					"label" : component.getLabel4()
				});
			}
			if (component.isEvents5Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 4,
					"label" : component.getLabel5()
				});
			}
			if (component.isEvents6Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 5,
					"label" : component.getLabel6()
				});
			}
			if (component.isEvents7Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 6,
					"label" : component.getLabel7()
				});
			}
			if (component.isEvents8Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 7,
					"label" : component.getLabel8()
				});
			}
			if (component.isEvents9Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 8,
					"label" : component.getLabel9()
				});
			}
			if (component.isEvents10Configured()) {
				component.SubSecLabels.push({
					"secFlag" : 9,
					"label" : component.getLabel10()
				});
			}

			arHTML.push(createSubsection(0, recordData.EVENT1, component.getLabel1(), component, component.isEvents1Configured()));
			arHTML.push(createSubsection(1, recordData.EVENT2, component.getLabel2(), component, component.isEvents2Configured()));
			arHTML.push(createSubsection(2, recordData.EVENT3, component.getLabel3(), component, component.isEvents3Configured()));
			arHTML.push(createSubsection(3, recordData.EVENT4, component.getLabel4(), component, component.isEvents4Configured()));
			arHTML.push(createSubsection(4, recordData.EVENT5, component.getLabel5(), component, component.isEvents5Configured()));
			arHTML.push(createSubsection(5, recordData.EVENT6, component.getLabel6(), component, component.isEvents6Configured()));
			arHTML.push(createSubsection(6, recordData.EVENT7, component.getLabel7(), component, component.isEvents7Configured()));
			arHTML.push(createSubsection(7, recordData.EVENT8, component.getLabel8(), component, component.isEvents8Configured()));
			arHTML.push(createSubsection(8, recordData.EVENT9, component.getLabel9(), component, component.isEvents9Configured()));
			arHTML.push(createSubsection(9, recordData.EVENT10, component.getLabel10(), component, component.isEvents10Configured()));

			arHTML.push("</div></div>");

			var sHTML = arHTML.join("");
			var countText = MP_Util.CreateTitleText(component, totalCnt);
			MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

			//Update click event for expand/collapse toggles
			updateToggleClickEvent(componentID);

			// update sort indicator to indicate that the diagnotics are sorted by result date time by default, in descending order
			// 32 = third column ("Resulted date time"), descending order
			displayCurrentSortIndicator(component.getComponentId(), 32);

			//attach listeners
			attachListeners(component);

			// notifies whoever is listening that we have a new count
			var eventTotal = {
				"count" : totalCnt
			};
			CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, eventTotal);

		}
	};
}(); 
