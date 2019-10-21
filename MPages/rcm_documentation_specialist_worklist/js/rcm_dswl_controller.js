function RCM_DSWL_ControllerStyle(){
	this.initByNamespace("dswlcon");
	this.setHeaderClass("dswl-sec-hd");
}

RCM_DSWL_ControllerStyle.inherits(ComponentStyle);

function RCM_DSWL_Controller(criterion){
	this.setCriterion(criterion);
	this.setAlwaysExpanded(true);
	this.setStyles(new RCM_DSWL_ControllerStyle());
	var delegate = new DocumentationSpecialistWorklistDelegate();


	RCM_DSWL_Controller.method("initialize", function(){
        var filters = new RCM_DSWL_Filters();
        var worklist = new RCM_DSWL_Worklist(this);
		filters.setComponent(this);
		var htmlArray = [];
		htmlArray.push("<div id='dswlFiltersDiv' class='dswl-filtersContainer'>");
		htmlArray.push(filters.getFilterBoxHTML(criterion));
		htmlArray.push("</div>");
		htmlArray.push("<div id='dswlWorklistDiv' class='dswlwworklist-Container'>");
		htmlArray.push(worklist.getWorklistHTML());
		htmlArray.push("</div>");
		var html = htmlArray.join("");
        MP_Util.Doc.FinalizeComponent(html, this, "");

		filters.addFiltersListener(function(patientList, appliedFilters){
			if(patientList){
				var worklistItems = delegate.getWorklistItems(patientList, appliedFilters);
				worklist.loadTable(criterion, worklistItems);
				worklist.initialize();
				if(worklistItems.patients && worklistItems.patients.length !== null){
					filters.addPatientCountString(worklistItems.patients.length);
				}
				else{
					filters.addPatientCountString(0);
				}
                worklist.loadAuthRibbons();
				setVisitReasonMaximumWidth();
				document.cookie = "rcm_dswl_pl=" + patientList.id;
			}
			else{
				worklist.loadTable(criterion, null);
				filters.addPatientCountString(0);
                $("#dswlMaintenanceLink").click(function(){
                    worklist.openListMaintenance();
                });
                $("#dswlPatientListDropbox").prop("disabled", true);
                $("#dswlFilterButton").prop("disabled", true);
			}
			Rcm_Floating_Header.addFloatingTableHeader('floatingTableHeader');
		});
		filters.initialize(this);
    });
}
RCM_DSWL_Controller.inherits(MPageComponent);

function setVisitReasonMaximumWidth(){
		//sets maximum width of reason section to 25%
		if(($("#dswlTableDiv").width() * .25) <  $("#reasonHeader").width())
		{
			$(".visitReasonWidth").width("25%");
		}
}
