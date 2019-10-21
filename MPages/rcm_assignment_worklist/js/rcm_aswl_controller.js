function RCM_ASWL_ControllerStyle(){
    this.initByNamespace("aswlcon");
	this.setHeaderClass("aswl-sec-hd");
}

RCM_ASWL_ControllerStyle.inherits(ComponentStyle);

function RCM_ASWL_Controller(criterion){
    this.setCriterion(criterion);
	this.setAlwaysExpanded(true);
    this.setStyles(new RCM_ASWL_ControllerStyle());
    this.criterion = criterion;
    var delegate = new AssignmentWorklistDelegate();
    var worklist = new RCM_ASWL_Worklist();

    RCM_ASWL_Controller.method("initialize", function(){
    	var delegate = new AssignmentWorklistDelegate();
		var patientLists = delegate.getPatientLists();
        RCM_ASWL_Filters.setComponent(this);
        // add filter to the top of assignment worklist.
        RCM_ASWL_Filters.initialize(criterion, patientLists);
        var filtersHTML = RCM_ASWL_Filters.getFilterHTML();
		if(patientLists.length > 0) {
    		// this listener is called every time refresh event(assign or remove a relationship), filter event(apply on filter dialog).
    		// it is called when notifyRefreshListeners() is called.
    		var filterListener = function(){
    			var selectedPLJson = RCM_ASWL_Filters.getSelectedPatientListJson();
    			var selectedFilters = RCM_ASWL_Filters.getAppliedFilters();
    			var json = delegate.getWorklistItems(selectedPLJson, selectedFilters);
    			if(json){
					var worklistJson = json.worklistItems;
    				var filtersJson = json.filters;
    				var canAssignInd = json.canAssignInd;
    				var canUnassignInd = json.canUnassignInd;
					var isCMDefinedInd = json.isCMDefinedInd;
					var isDPDefinedInd = json.isDPDefinedInd;
					var isDSDefinedInd = json.isDSDefinedInd;
					var secondarySortValue = json.secondarySortValue;
					var currentUserId = json.currentUserId;
					var currentUserName = json.currentUserName;
					var patientNameLink = json.patientNameLink;
					var patientNameViewpointLink = json.patientNameViewpointLink;
					var patientNameViewLink = json.patientNameViewLink;
					var availablePersonnels = json.availablePersonnels;
					var defaultsJson = json.defaults;
					RCM_ASWL_Filters.populateFilters(filtersJson, isCMDefinedInd, isDPDefinedInd, isDSDefinedInd);
					// this recreates the 'aswlProviderDiv' so the older listener on aswlProviderDiv are all removed.
					$(window).unbind("resize");
					worklist.loadTableHeader();
					if(isCMDefinedInd){
						isCMDefinedInd = selectedFilters.cmRelationshipChecked;
					}
					if(isDPDefinedInd){
						isDPDefinedInd = selectedFilters.dpRelationshipChecked;
					}
					if(isDSDefinedInd){
						isDSDefinedInd = selectedFilters.dsRelationshipChecked;
					}
					worklist.loadTable(worklistJson, canAssignInd, canUnassignInd, isCMDefinedInd, isDPDefinedInd, isDSDefinedInd, patientNameLink, patientNameViewpointLink, patientNameViewLink, availablePersonnels);
					worklist.setUp(worklistJson);
					RCM_ASWL_Filters.addPatientCountString(worklistJson.length);
					worklist.setUpSearchControlAndButton(currentUserId, currentUserName);
					// make sure 'aswlProviderDiv' has the provider search control to be above the tableHeader.
					Rcm_Floating_Header.addFloatingDivAndTableHeader('tableHeader', 'aswlProviderDiv', worklist, worklist.floatingHeaderListener);

					}
    			else{
    				worklist.loadTable(null);
    				var filterItems = {
    						encounterTypeFilters: [],
    						payerFilters: [],
    						careManagerFilters: [],
    						dischargePlannerFilters: [],
							documentationSpecialistFilters: []
    				};
    				RCM_ASWL_Filters.populateFilters(filterItems);
					RCM_ASWL_Filters.addPatientCountString(0);
    			}
    			$("#aswl-clearButton").prop("disabled", true);
				$("#aswl-assignButton").prop("disabled", true);

	  			$("#copyaswl-clearButton").prop("disabled", true);
				$("#copyaswl-assignButton").prop("disabled", true);

				RCM_ASWL_Filters.addResizeForFilters();
				worklist.finishWorklist();
    		};

    		RCM_ASWL_Filters.addFiltersListener(filterListener);
    		worklist.addRefreshListener(filterListener);


    		var worklistHTML = worklist.initialize(criterion);
    		var htmlArray = [];
    		htmlArray.push("<div id='filtersDiv'  class='aswl-filtersContainer'>");
    		htmlArray.push(filtersHTML);
    		htmlArray.push("</div>");
    		htmlArray.push("<div id='worklistDiv' class='aswlworklistContainer'>");
    		htmlArray.push(worklistHTML);
    		htmlArray.push("</div>");
        	var html = htmlArray.join("");
        	MP_Util.Doc.FinalizeComponent(html, this, "");
        	RCM_ASWL_Filters.finishRender();
			RCM_ASWL_Filters.addResizeForFilters();
			worklist.finishWorklist();
    	}
    	else {
            var loc = criterion.static_content;
    		var htmlArray = [];
    		htmlArray.push("<div id='filtersDiv'  class='aswl-filtersContainer'>");
				htmlArray.push(filtersHTML);
            htmlArray.push("</div>");
            htmlArray.push("<div id='worklistDiv' class='aswl-no-worklist-container'>");
                htmlArray.push('<div class="aswl-no-patient-lists-image"><img src="', loc, '\\images\\search-large.png"></div>');
                htmlArray.push('<div class="aswl-no-patient-lists-primary-label">' + rcm_assignment_worklist_i18n.ASWL_NO_ACTIVE_LISTS + '</div>');
                htmlArray.push('<span class="aswl-no-patient-lists-secondary-label">' + rcm_assignment_worklist_i18n.ASWL_NO_ACTIVE_LISTS_LINE_2 + ' </span>');
                htmlArray.push('<span class="aswl-no-patient-lists-link" onclick="RCM_ASWL_Filters.openListMaintenance()">' + rcm_assignment_worklist_i18n.ASWL_LIST_MAINTENANCE + '</span>');
            htmlArray.push("</div>");
        	var html = htmlArray.join("");
        	MP_Util.Doc.FinalizeComponent(html, this, "");
            RCM_ASWL_Filters.addPatientCountString(0);
            $("#patientListDropbox").prop("disabled", true);
            $("#filterInput").prop("disabled", true);
            if($("#listBlockingDiv").length === 0){
				$("body").append("<div id='listBlockingDiv' class='transDiv'></div>");
			}
    	}

    });
}

RCM_ASWL_Controller.inherits(MPageComponent);

function RCM_ASWL_Applied_Filters(){
    this.encounterTypes; //RCM_Option
    this.payer; //RCM_Option
    this.cmRelationship; //RCM_Option
    this.careManager; //RCM_Option
    this.dpRelationship; //RCM_Option
    this.dischargePlanner; //RCM_Option
    this.dsRelationship; //RCM_Option
	this.documentationSpecialist; // RCM_Option
    this.primarySort; //string
    this.primarySortAscending; //boolean
    this.secondarySort; //string
    this.secondarySortAscending; //boolean
	this.cmRelationshipChecked; //boolean
	this.dpRelationshipChecked; //boolean
	this.dsRelationshipChecked; //boolean
}

function RCM_Option(value, display){
    this.value = value;
    this.display = display;
}