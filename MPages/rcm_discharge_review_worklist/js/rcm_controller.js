function RCM_ControllerStyle(){
    this.initByNamespace("con");
}
RCM_ControllerStyle.inherits(ComponentStyle);

function RCM_Controller(criterion){
	this.setComponentLoadTimerName("USR:MPG.DischargeReviewWorklist");
	this.setCriterion(criterion);
	this.setStyles(new RCM_ControllerStyle());
	this.criterion = criterion;
	this.setAlwaysExpanded(true);
	RCM_Controller.method("initialize", function(){
        RCM_Filters.setComponent(this);
		RCM_Filters.initialize(criterion);
		var filtersHTML = RCM_Filters.getFilterHTML();
		var patientListSelected = RCM_Filters.getSelectedPatientListJson();
		var worklistHTML;
		if (patientListSelected !== "") {
			RCM_Worklist.initialize(this, patientListSelected, criterion, RCM_Filters.getAppliedFilters());
			worklistHTML = RCM_Worklist.getWorklistHTML();

			var htmlArray = [];
			htmlArray.push("<div id='filtersDiv'  class='filtersContainer'>");
			htmlArray.push(filtersHTML);
			htmlArray.push("</div>");
			htmlArray.push("<div id='worklistDiv' class='worklistContainer'>");
			htmlArray.push(worklistHTML);
			htmlArray.push("</div>");

			var html = htmlArray.join("");
			MP_Util.Doc.FinalizeComponent(html, this, "");
			RCM_Filters.setDiscernOrderLabel(RCM_Worklist.getDiscernOrderLabel());
			RCM_Filters.finishRender(this);
			RCM_Filters.populatePatientLists(patientListSelected.getWorklistReq.PATIENTLIST_ID);
            var pageLink = RCM_Worklist.getPageLink();
            if($("#worklistPageLink").length === 0){
                $("body").prepend('<div id="worklistPageLink" class="button-print" onclick = "RCM_Worklist.openPageLink()">' + pageLink +'</div>');
            }
            if($("#worklistPrintLink").length === 0){
                $("body").prepend("<div id='worklistPrintLink' class='button-print' onclick = 'RCM_Worklist.printWorklist()'>"+rcm_discharge_i18n.RCM_PRINT+"</div>");
            }
            RCM_Worklist.loadAuthRibbons();
			var loadingImg = criterion.static_content + "\\images\\6439_48.gif";
			$("body").prepend("<div class='printTransparentDiv'><img class ='worklistPrintImg' src='"+loadingImg+ "'/></div>");
			setVisitReasonMaximumWidth();
		}
		else{
            var loc = this.criterion.static_content;
			var htmlArray = [];
			htmlArray.push("<div id='filtersDiv'  class='filtersContainer'>");
            htmlArray.push(filtersHTML);
            htmlArray.push("</div>");
            htmlArray.push("<div id='worklistDiv' class='noWorklistContainer'>");
                htmlArray.push('<div class="no-patient-lists-image"><img src="', loc, '\\images\\search-large.png"></div>');
                htmlArray.push('<div class="no-patient-lists-primary-label">' + rcm_discharge_i18n.RCM_NO_ACTIVE_LISTS + '</div>');
                htmlArray.push('<span class="no-patient-lists-secondary-label">' + rcm_discharge_i18n.RCM_NO_ACTIVE_LISTS_LINE_2 + ' </span>');
                htmlArray.push('<span class="no-patient-lists-link" onclick="RCM_Filters.openListMaintenance()">' + rcm_discharge_i18n.RCM_LIST_MAINTENANCE + '</span>');
            htmlArray.push("</div>");
			var html = htmlArray.join("");
			MP_Util.Doc.FinalizeComponent(html, this, "");
            $("#patientListDropbox").prop("disabled", true);
            $("#filterInput").prop("disabled", true);
            $("#worklistPrintLink").hide();
            if($("#listBlockingDiv").length === 0){
				$("body").append("<div id='listBlockingDiv' class='transDiv'></div>");
			}
		}

		RCM_Filters.addFiltersListener(function(){
			RCM_Worklist.loadNewPatientList(RCM_Filters.getSelectedPatientListJson(), RCM_Filters.getAppliedFilters());
			RCM_Worklist.setupHovers();
            RCM_Worklist.loadAuthRibbons();
			RCM_Filters.addPatientCountString(RCM_Worklist.getWorklistItemCount());
			RCM_Filters.setDiscernOrderLabel(RCM_Worklist.getDiscernOrderLabel());
			Rcm_Floating_Header.addFloatingTableHeader('floatingPersonListHeader');
		});

		RCM_Worklist.setupHovers();
		RCM_Filters.addPatientCountString(RCM_Worklist.getWorklistItemCount());
		Rcm_Floating_Header.addFloatingTableHeader('floatingPersonListHeader');
	});
}
RCM_Controller.inherits(MPageComponent);


function RCM_Applied_Filters(){
	this.encounterTypes; //RCM_Option
	this.financialClasses; //RCM_Option
	this.relationship; //RCM_Option
	this.nextAssessmentDateRange; //short
	this.includeCompleteDischargePlanStatus; //boolean
	this.includeNotNeededDischargePlanStatus; //boolean
	this.includeNoNextAssessement; //boolean
	this.primarySort;  //string
	this.primarySortAscending; //boolean
	this.secondarySort; //string
	this.secondarySortAscending; //boolean
	this.tertiarySort; //string
	this.tertiarySortAscending; //boolean
	this.includeUnassignedWithOrder; //boolean
	this.payer; //RCM_Option
}

function setVisitReasonMaximumWidth(){
		//sets maximum width of reason section to 25%
		if(($("#tableDiv").width() * .25) <  $("#reasonHeader").width())
		{
			$(".visitReasonWidth").width("25%");
		}
}

function RCM_Option(value, display){
	this.value = value;
	this.display = display;
}
