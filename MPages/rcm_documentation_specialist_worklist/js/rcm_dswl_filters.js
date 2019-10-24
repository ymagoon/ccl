function RCM_DSWL_Filters(){
	var serviceDelegate = new DocumentationSpecialistWorklistDelegate();
	var filtersListeners = [];
	var selectedPatientList;
	var appliedFilters = {};
	var allPatientLists = [];
	var resizeendDate = new Date(1, 1, 2000, 12,00,00);
	var resizeendTimeout = false;
	var resizeendDelta = 20;
	var payerFilters = [];

	this.getFilterBoxHTML = function(criterion){
		var htmlArray = [];
		htmlArray.push("<div id='dswlFilters' class='dswl-filtersDivClass'>");
		htmlArray.push("<div class='dswl-filters'>");
		htmlArray.push(createPatientListFilter(criterion));
		createFilters();
		htmlArray.push("</div>");
		htmlArray.push("<div id='dswlPatientCount' class='dswl-appliedFiltersPatientCount'></div>");
		htmlArray.push("<div id='dswlAppliedFilters' class='dswl-appliedFilters'></div>");
		htmlArray.push("</div>");
		return htmlArray.join("");
	};

	this.initialize = function(component){
		populatePatientListFilter();

		$("#dswlPatientListDropbox").unbind("change").change(function(){
			$("#dswlFilterBox").hide();
			patientListFilterListener();
		});

		$("#dswlApplyButton").unbind("click").click(function(){
			acceptFilters();
		});

		$("#dswlCancelButton").unbind("click").click(function(){
			cancelFilters();
		});

		$("#dswlFilterButton").unbind("mousedown").mousedown(function(){
			$("#dswlFilterBox").toggle();
			if($("#dswlFilterBox").is(":visible")){
				resizeFilterBox();
			}
		});

		$("#dswlAscendingPrimary").unbind("click").click(function(){
			uncheckOtherRadioButtons(this);
		});

		$("#dswlDescendingPrimary").unbind("click").click(function(){
			uncheckOtherRadioButtons(this);
		});

		$("#dswlAscendingSecondary").unbind("click").click(function(){
			uncheckOtherRadioButtons(this);
		});

		$("#dswlDescendingSecondary").unbind("click").click(function(){
			uncheckOtherRadioButtons(this);
		});

        $("#dswlOpenListMaintenance").unbind("click").click(function(){
            openListMaintenance(component);
        });

        $(document).ready(function(){
			$("#dswlPatientCount").height($("#dswlFilters").height());
			$("#dswlPatientListCountDiv").height($("#dswlPatientCount").height());
		});

		$(window).resize(function(){
				resizeendDate= new Date();
				if (resizeendTimeout  === false){
				 resizeendTimeout  = true;
				setTimeout(resizeend, resizeendDelta);
				}
		});
		patientListFilterListener();
		setPayerFilterSearch();
    };

	this.getSelectedPatientList = function(){
		return selectedPatientList;
	};

	this.getAppliedFilters = function(){
		return appliedFilters;
	};

	this.addPatientCountString = function(recordNum){
		var patientCountString = "<div id='dswlPatientListCountDiv' class='dswl-patientCountWhitePipeLine'>" + rcm_documentation_specialist_worklist_i18n.DSWL_PATIENTS + ": " + recordNum + "</div>";
		$("#dswlPatientCount").html(patientCountString);
	};

	this.addFiltersListener = function(listener){
		filtersListeners.push(listener);
	};

    this.setComponent = function(component){
        this.component = component;
    };

    function notifyFiltersListeners(){
        for (var i = 0; i < filtersListeners.length; i++) {
            filtersListeners[i](selectedPatientList, appliedFilters);
        }
     };

    /**
	* Function that runs when the page is finished resizing
	*/
	function resizeend(){
		if (new Date() - resizeendDate < resizeendDelta){
			setTimeout(resizeend, resizeendDelta);
		}
		else{
				resizeendTimeout = false;
				if($("#dswlPatientCount").width() > 0){
					//sets the height to the height of the breadcrumbs and adds 18 (1.5em) to account for the margin
					$("#dswlPatientCount").height($("#dswlAppliedFilters").height() + 18);
					$("#dswlPatientListCountDiv").height($("#dswlPatientCount").height());
				}
				if($("#dswlFilterBox").is(":visible")){
					resizeFilterBox();
				}
			}
	};

	function patientListFilterListener(){
		var selectedListId = $("#dswlPatientListDropbox option:selected").val();
		var selectedListName = $("#dswlPatientListDropbox option:selected").text();
		$("#payerTable").empty();
		payerFilters = [];
		
        if(selectedListId && selectedListName && selectedListName.length > 0){
            var patientListPreferences = serviceDelegate.getFilterPreferences(selectedListId, selectedListName);

            for(var i = 0; i < allPatientLists.length; i++){
                if(allPatientLists[i].id === selectedListId){
                    selectedPatientList = allPatientLists[i];
                    break;
                }
            }

            populateFilters(patientListPreferences);

            if(selectedPatientList){
                $("#dswlPatientListLabel").text(selectedPatientList.name + " - ");
            }
        }
        notifyFiltersListeners();
    };

	function createPatientListFilter(criterion){
		var patientLists = serviceDelegate.getPatientLists();
        var loc = criterion.static_content;
		for(var i = 0; i < patientLists.length; i++){
			allPatientLists.push(patientLists[i]);
		}

		var patientListHTML = "";
		var patientListHTMLArray = [];

		patientListHTMLArray.push("<div class='dswl-patient-list-div'>");
		patientListHTMLArray.push("<label class='dswl-patient-list-label' for='dswlLocationFilterDropDown'>",rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT_LIST, "</label>&nbsp;");
		patientListHTMLArray.push("<select class='dswl-filter-patientListDropdown' id='dswlPatientListDropbox' name='dswlLocationFilterDropDown'>");

		patientListHTMLArray.push("</select>");
		patientListHTMLArray.push(filterButton(criterion));
		patientListHTMLArray.push("</div>");
        patientListHTMLArray.push("<div id='dswlOpenListMaintenance' class='open-list-maintenance-div'>");
        patientListHTMLArray.push("<img class='list-maintenance-img' src='", loc, "\\images\\list-settings.png' ></div>");

		var filterHTML = patientListHTMLArray.join("");
		return filterHTML;
	};

	function populatePatientListFilter(){
        var $subType = $("#dswlPatientListDropbox");
        $subType.empty();
        for (var d = 0; d < allPatientLists.length; d++) {
        	$subType.append($('<option></option>').attr("value", allPatientLists[d].id).text(allPatientLists[d].name));
        }

        var match = document.cookie.match(/rcm_dswl_pl=([^;]+)(;|\b|$)/);
        if (match && match[1]) {
            var patientListId = match[1];
            for(var i = 0; i < allPatientLists.length; i++) {
                if(patientListId === allPatientLists[i].id) {
                    $subType.val(patientListId);
                    break;
                }
            }
        }
	};

	function createFilters(){
        if(!document.getElementById("dswlFilterBox")){
            var boxDiv = document.createElement("div");
            boxDiv.id= "dswlFilterBox";
            boxDiv.className = "dswl-filter-box";
            var filterHTMLArray = [];

            // Header
            filterHTMLArray.push("<div class='dswl-filter-title-bar'>");
            filterHTMLArray.push("<label class='dswl-filter-title' id='dswlPatientListLabel'></label>");
            filterHTMLArray.push("<label class='dswl-filter-subtitle'>",rcm_documentation_specialist_worklist_i18n.DSWL_FILTER_SETTINGS, "</label>");
            filterHTMLArray.push("</div>");

            filterHTMLArray.push("<div id = 'filterBox-scrollable-content'>");

            // Filters
            filterHTMLArray.push(encounterTypeFilter());
            filterHTMLArray.push(finClassFilter());
            filterHTMLArray.push(payerFilter());
            filterHTMLArray.push(nextDocumentReviewFilter());
            filterHTMLArray.push(myRelationship());
            filterHTMLArray.push("<br/>");

            // Checkboxes
            filterHTMLArray.push(checkboxDiv());

            // Sorting
            filterHTMLArray.push(sortingDiv());

            filterHTMLArray.push("</div>");

            // Save checkbox and Accept/Cancel Buttons
            filterHTMLArray.push(saveAndActionButtonDiv());

            var html = filterHTMLArray.join("");
            boxDiv.innerHTML = html;
            document.body.appendChild(boxDiv);
        }
	};

	function populateFilters(filters){
		populateEncounterFilter(filters.availableEncounterTypes);
		populateFinancialClassFilter(filters.availableFinancialClassValues);
		setDefaults(filters.preferences);
		setAppliedFilters();
		$("#dswlAppliedFilters").html(displayAppliedFilters());
	};

	/**
	* For resizing the filter box
	*/
	function resizeFilterBox(){
		$("#filterBox-scrollable-content").css("height", "auto");
		$("#filterBox-scrollable-content").css("height-max", 500);
		$("#filterBox-scrollable-content").css("width", 500);
		$("#dswlFilterBox").css("width", 500);
		$("#filterBox-scrollable-content").css("overflow-y", "hidden")
		$("#filterBox-scrollable-content").css("overflow-x", "hidden");

		var htmlWidth = document.documentElement.clientWidth;
		if(htmlWidth <500){
			$("#filterBox-scrollable-content").css("overflow-x", "scroll")
			$("#filterBox-scrollable-content").css("width", (htmlWidth -15));
			$("#dswlFilterBox").css("width", (htmlWidth-15));
		}
		var htmlHeight = document.documentElement.clientHeight;
		var filterBoxHeight = $("#dswlFilterBox").height();
		if((filterBoxHeight + 72) > htmlHeight){
			$("#filterBox-scrollable-content").css("height", (htmlHeight - 157));
			$("#filterBox-scrollable-content").css("overflow-y", "scroll");
		}
	};

    function encounterTypeFilter(){
        var filterHTML = [];
        filterHTML.push("<div class='dswl-filter'>");
        filterHTML.push("<label class='dswl-filter-encounter-type' for='dswlEncounterTypeFilter'>",rcm_documentation_specialist_worklist_i18n.DSWL_ENCOUNTER_TYPE, "</label>");
        filterHTML.push("<select multiple='multiple' class='dswl-filterDropdown' id='dswlEncounterTypeFilter' name='dswlEncounterTypeFilter'>");
        filterHTML.push("<option selected='true' value='empty'>--</option>");
        filterHTML.push("</select>");
        filterHTML.push("</div>");
        var encounterTypeHTMLString = filterHTML.join("");
        return encounterTypeHTMLString;
    };

	function populateEncounterFilter(encounterFilters){
		$("#dswlEncounterTypeFilter").html("");
		$("#dswlEncounterTypeFilter").append($("<option></option>").attr("value", 'empty').text('--'));
		if(selectedPatientList && selectedPatientList.encounterTypes.length > 0){
			for(var i = 0; i < selectedPatientList.encounterTypes.length; i++){
				$("#dswlEncounterTypeFilter").append($("<option></option>").attr("value", selectedPatientList.encounterTypes[i].typeCd).text(selectedPatientList.encounterTypes[i].typeDisp));
			}
		}
		else{
			for(var i = 0; i < encounterFilters.length; i++){
				$("#dswlEncounterTypeFilter").append($("<option></option>").attr("value", encounterFilters[i].id).text(encounterFilters[i].name));
			}
		}
	};

	function finClassFilter(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-filter'>");
		filterHTML.push("<label for='dswlFinClassFilter' class='dswl-filter-label'>", rcm_documentation_specialist_worklist_i18n.DSWL_FINANCIAL_CLASS, "</label>");
		filterHTML.push("<select multiple='multiple' class='dswl-filterDropdown' id='dswlFinClassFilter' name='dswlFinClassFilter'>");
		filterHTML.push("<option value='empty'>--</option>");
		filterHTML.push("</select>");
		filterHTML.push("</div>");
		var finClassHTML = filterHTML.join("");
		return finClassHTML;
	};

	function payerFilter(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-filter'>");
			filterHTML.push("<label for='payerFilter'>",rcm_documentation_specialist_worklist_i18n.DSWL_PAYER_PRIMARY," </label>");
			filterHTML.push("<input type='text' class='searchText'  id='payerFilter' name='payerFilter' />");
			filterHTML.push("<div id='payerTableContainer' class = 'dswl-payer-table-container'>");
				filterHTML.push("<table id='payerTable' class='dswl-filter-table'></table>");
			filterHTML.push("</div>");
		filterHTML.push("</div>");
		var payerHTML = filterHTML.join("");
		return payerHTML;
	};

	function populateFinancialClassFilter(finClassFilters){
		$("#dswlFinClassFilter").html("");
		$("#dswlFinClassFilter").append($("<option></option>").attr("value", 'empty').text('--'));
		for(var i = 0; i < finClassFilters.length; i++){
			$("#dswlFinClassFilter").append($("<option></option>").attr("value", finClassFilters[i].id).text(finClassFilters[i].name));
		}
	};

	function nextDocumentReviewFilter(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-filter'>");
        filterHTML.push("<label for='dswlRelativeRangeFilter'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENT_REVIEW, "</label>");
        filterHTML.push("<select class='dswl-filterDropdown' id='dswlRelativeRangeFilter' name='dswlRelativeRangeFilter'>");
        filterHTML.push("<option value='0'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_TODAY,"</option>");
        filterHTML.push("<option value='1'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_TOMORROW,"</option>");
        filterHTML.push("<option value='2'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_TWO,"</option>");
        filterHTML.push("<option value='3'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_THREE,"</option>");
        filterHTML.push("<option value='4'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_FOUR,"</option>");
        filterHTML.push("<option value='5'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_FIVE,"</option>");
        filterHTML.push("<option value='6'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_SIX,"</option>");
        filterHTML.push("<option value='7'>",rcm_documentation_specialist_worklist_i18n.DSWL_UP_TO_SEVEN,"</option>");
        filterHTML.push("<option value='8'>",rcm_documentation_specialist_worklist_i18n.DSWL_ALL_FUTURE_REVIEWS,"</option>");
        filterHTML.push("</select>");
        filterHTML.push("</div>");

		var relativeRangeHtml = filterHTML.join("");
		return relativeRangeHtml;
	};

	function myRelationship(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-filter'>");
		filterHTML.push("<label for='dswlMyRelationshipFilter'>", rcm_documentation_specialist_worklist_i18n.DSWL_MY_RELATIONSHIP, "</label>");
		filterHTML.push("<select class='dswl-filterDropdown' id='dswlMyRelationshipFilter' name='dswlMyRelationshipFilter'>");
		filterHTML.push("<option value='", rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_ALL, "'>", rcm_documentation_specialist_worklist_i18n.DSWL_ALL, "</option>");
		filterHTML.push("<option value='", rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_ASSIGNED_TO_ME, "' selected='selected'>", rcm_documentation_specialist_worklist_i18n.DSWL_ASSIGNED_TO_ME, "</option>");
		filterHTML.push("<option value='", rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_ASSIGNED_TO_OTHERS, "'>", rcm_documentation_specialist_worklist_i18n.DSWL_ASSIGNED_TO_OTHERS, "</option>");
		filterHTML.push("<option value='", rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_UNASSIGNED, "'>", rcm_documentation_specialist_worklist_i18n.DSWL_UNASSIGNED, "</option>");
		filterHTML.push("</select>");
		filterHTML.push("</div>");
		var myRelationshipHTML = filterHTML.join("");
		return myRelationshipHTML;
	};

	function checkboxDiv(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-filter-checkbox'>");
		filterHTML.push("<label class='dswl-filter-checkbox-header'>", rcm_documentation_specialist_worklist_i18n.DSWL_INCLUDE_PATIENTS_WITH, "</label>");
		filterHTML.push("<div class='dswl-filter-checkbox'>");
		filterHTML.push("<input type='checkbox' id='dswlCompleteDocRev' name='dswlCompleteDocRev'/>&nbsp;");
		filterHTML.push("<label for='dswlCompleteDocRev'>", rcm_documentation_specialist_worklist_i18n.DSWL_COMPLETED_DOCUMENTATION_REVIEWS, "</label>");
		filterHTML.push("</div>");

		filterHTML.push("<div class='dswl-filter-checkbox'>");
		filterHTML.push("<input type='checkbox' id='dswlNoDocReviewDate' name='dswlNoDocReviewDate'/>&nbsp;");
		filterHTML.push("<label for='dswlNoDocReviewDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_NO_DOCUMENTATION_REVIEW_DATE, "</label>");
		filterHTML.push("</div>");
		filterHTML.push("</div>");
		var checkboxHTML = filterHTML.join("");
		return checkboxHTML;
	};

	function sortingDiv(){
		var filterHTML = [];
		filterHTML.push("<div class='dswl-separator'></div>");
		filterHTML.push("<div class='dswl-filter-sorting-div'>");
		filterHTML.push("<label class='dswl-filter-sorting-header' for='dswlPrimarySort'>", rcm_documentation_specialist_worklist_i18n.DSWL_SORTING, "</label>");
		filterHTML.push("<div>");
		filterHTML.push(primarySort());
		filterHTML.push("</div>");
		filterHTML.push("<div>");
		filterHTML.push(secondarySort());
		filterHTML.push("</div>");
		filterHTML.push("</div>");
		var sortingDivHTML = filterHTML.join("");
		return sortingDivHTML;
	};

    function primarySort(){
	    var sortHTML = [];
	    var sortPrimaryHTMLString = "";
	    sortHTML.push("<div class='dswl-filter-sorting-dropdown'>");
	    sortHTML.push("<label class='dswl-filter-prmySortLabel' for='dswlPrimarySort'>", rcm_documentation_specialist_worklist_i18n.DSWL_PRIMARY_SORT, "</label>");
	    sortHTML.push("<select class='dswl-filter-prmySortDropdown' id='dswlPrimarySort' name='dswlPrimarySort'>");
	    sortHTML.push("<option value='admissionDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_ADMIT_DATE, "</option>");
	    sortHTML.push("<option value='attendingPhysician'>", rcm_documentation_specialist_worklist_i18n.DSWL_ATTENDING_PHYSICIAN, "</option>");
		sortHTML.push("<option value='dischargeDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_DISCHARGE_DATE, "</option>");
	    sortHTML.push("<option value='documentReviewStatus'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOCUMENTATION_REVIEW_STATUS, "</option>");
	    sortHTML.push("<option value='DRGCode'>", rcm_documentation_specialist_worklist_i18n.DSWL_DRG_CODE, "</option>");
	    sortHTML.push("<option value='estimatedLengthOfStay'>", rcm_documentation_specialist_worklist_i18n.DSWL_ESTIMATED_LENGTH_OF_STAY, "</option>");
	    sortHTML.push("<option value='encounterType'>", rcm_documentation_specialist_worklist_i18n.DSWL_ENCOUNTER_TYPE, "</option>");
	    sortHTML.push("<option value='financialClass'>", rcm_documentation_specialist_worklist_i18n.DSWL_FINANCIAL_CLASS, "</option>");
		sortHTML.push("<option value='financialNumber'>", rcm_documentation_specialist_worklist_i18n.DSWL_FINANCIAL_NUMBER, "</option>");
		sortHTML.push("<option value='gender'>", rcm_documentation_specialist_worklist_i18n.DSWL_GENDER, "</option>");
		sortHTML.push("<option value='lengthOfStay'>", rcm_documentation_specialist_worklist_i18n.DSWL_LENGTH_OF_STAY, "</option>");
		sortHTML.push("<option selected='true' value='documentReviewDueDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENTATION_REVIEW_DATE, "</option>");
		sortHTML.push("<option value='FirstDocSpecialist'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOCUMENTATION_SPECIALIST, "</option>");
		sortHTML.push("<option value='location'>", rcm_documentation_specialist_worklist_i18n.DSWL_NURSE_UNIT, "</option>");
		sortHTML.push("<option value='locationExtended'>", rcm_documentation_specialist_worklist_i18n.DSWL_NURSE_UNIT_ROOM_BED, "</option>");
		sortHTML.push("<option value='patientBirthDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT_AGE, "</option>");
		sortHTML.push("<option value='patientName'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT_NAME, "</option>");
		sortHTML.push("<option value='payerName'>", rcm_documentation_specialist_worklist_i18n.DSWL_PAYER, "</option>");
		sortHTML.push("<option value='readmissionAlert'>", rcm_documentation_specialist_worklist_i18n.DSWL_READMISSION, "</option>");
		sortHTML.push("<option value='visitReason'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_REASON, "</option>");
        sortHTML.push("<option value='authEndDate'>",rcm_documentation_specialist_worklist_i18n.RCM_AUTH_END_DATE,"</option>");
	    sortHTML.push("</select>");
	    sortHTML.push("<input checked type='radio' id='dswlAscendingPrimary' name='dswlPrimarySortDirection' value='ascendingPrimary'/>");
	    sortHTML.push("<label>", rcm_documentation_specialist_worklist_i18n.DSWL_ASCENDING, "</label>");
	    sortHTML.push("<input type='radio' id='dswlDescendingPrimary' name='dswlPrimarySortDirection' value='descendingPrimary'/>");
	    sortHTML.push("<label>", rcm_documentation_specialist_worklist_i18n.DSWL_DESCENDING, "</label>");
	    sortHTML.push("</div>");
	    sortPrimaryHTMLString = sortHTML.join("");
	    return sortPrimaryHTMLString;
	};

	function secondarySort(){
	    var sortHTML = [];
	    var sortSecondaryHTMLString = "";
	    sortHTML.push("<div class='dswl-filter-sorting-dropdown'>");
	    sortHTML.push("<label for='dswlSecondarySort'>", rcm_documentation_specialist_worklist_i18n.DSWL_SECONDARY, "</label>");
	    sortHTML.push("<select class='dswl-filter-secSortDropdown' id='dswlSecondarySort' name='dswlSecondarySort'>");
	    sortHTML.push("<option value='empty'>--</option>");
	    sortHTML.push("<option value='admissionDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_ADMIT_DATE, "</option>");
	    sortHTML.push("<option value='attendingPhysician'>", rcm_documentation_specialist_worklist_i18n.DSWL_ATTENDING_PHYSICIAN, "</option>");
		sortHTML.push("<option value='dischargeDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_DISCHARGE_DATE, "</option>");
	    sortHTML.push("<option value='documentReviewStatus'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOCUMENTATION_REVIEW_STATUS, "</option>");
	    sortHTML.push("<option selected='true' value='DRGCode'>", rcm_documentation_specialist_worklist_i18n.DSWL_DRG_CODE, "</option>");
	    sortHTML.push("<option value='estimatedLengthOfStay'>", rcm_documentation_specialist_worklist_i18n.DSWL_ESTIMATED_LENGTH_OF_STAY, "</option>");
	    sortHTML.push("<option value='encounterType'>", rcm_documentation_specialist_worklist_i18n.DSWL_ENCOUNTER_TYPE, "</option>");
	    sortHTML.push("<option value='financialClass'>", rcm_documentation_specialist_worklist_i18n.DSWL_FINANCIAL_CLASS, "</option>");
		sortHTML.push("<option value='financialNumber'>", rcm_documentation_specialist_worklist_i18n.DSWL_FINANCIAL_NUMBER, "</option>");
		sortHTML.push("<option value='gender'>", rcm_documentation_specialist_worklist_i18n.DSWL_GENDER, "</option>");
		sortHTML.push("<option value='lengthOfStay'>", rcm_documentation_specialist_worklist_i18n.DSWL_LENGTH_OF_STAY, "</option>");
		sortHTML.push("<option value='documentReviewDueDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENTATION_REVIEW_DATE, "</option>");
		sortHTML.push("<option value='FirstDocSpecialist'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOCUMENTATION_SPECIALIST, "</option>");
		sortHTML.push("<option value='locationExtended'>", rcm_documentation_specialist_worklist_i18n.DSWL_NURSE_UNIT_ROOM_BED, "</option>");
		sortHTML.push("<option value='patientBirthDate'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT_AGE, "</option>");
		sortHTML.push("<option value='patientName'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT_NAME, "</option>");
		sortHTML.push("<option value='payerName'>", rcm_documentation_specialist_worklist_i18n.DSWL_PAYER, "</option>");
		sortHTML.push("<option value='readmissionAlert'>", rcm_documentation_specialist_worklist_i18n.DSWL_READMISSION, "</option>");
		sortHTML.push("<option value='visitReason'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_REASON, "</option>");
        sortHTML.push("<option value='authEndDate'>",rcm_documentation_specialist_worklist_i18n.RCM_AUTH_END_DATE,"</option>");
	    sortHTML.push("</select>");
	    sortHTML.push("<input type='radio' id='dswlAscendingSecondary' name='dswlSecondarySortDirection' value='ascendingSecondary'/>");
	    sortHTML.push("<label for='dswlAscendingSecondary'>", rcm_documentation_specialist_worklist_i18n.DSWL_ASCENDING, "</label>");
	    sortHTML.push("<input checked type='radio' id='dswlDescendingSecondary' name='dswlSecondarySortDirection' value='descendingSecondary'/>");
	    sortHTML.push("<label for='dswlDescendingSecondary'>", rcm_documentation_specialist_worklist_i18n.DSWL_DESCENDING, "</label>");
	    sortHTML.push("</div>");
	    sortSecondaryHTMLString = sortHTML.join("");
	    return sortSecondaryHTMLString;
	};

	function saveAndActionButtonDiv(){
		var saveAndActionButtonHTML = [];
		saveAndActionButtonHTML.push("<div class='dswl-filter-checkbox-save-area' id='dswlSaveConfigurationDiv'>");
		saveAndActionButtonHTML.push("<input class='filter-checkbox-config' type='checkbox' id='dswlSaveConfigurationCheckbox' name='dswlSaveConfigurationCheckbox'/>");
		saveAndActionButtonHTML.push("<label class='filter-checkbox-config' for='dswlSaveConfigurationCheckbox'>", rcm_documentation_specialist_worklist_i18n.DSWL_SAVE_CONFIGURATION, "</label>");
		saveAndActionButtonHTML.push("<button id='dswlCancelButton' class='dswl-filter-button-cancel'>", rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL, "</button>");
		saveAndActionButtonHTML.push("<button id='dswlApplyButton' class='dswl-filter-button-apply'>",rcm_documentation_specialist_worklist_i18n.DSWL_APPLY, "</button>");
		saveAndActionButtonHTML.push("</div>");
		var saabHTML = saveAndActionButtonHTML.join("");
		return saabHTML;
	};

	function filterButton(criterion){
		var loc = criterion.static_content;
		var filterHTML = "";
		var buttonHTMLArray = [];
		buttonHTMLArray.push("<input id='dswlFilterButton' class='dswl-filter-button-image' type='image' src='", loc, "\\images\\4342.ico' alt='' title='",rcm_documentation_specialist_worklist_i18n.DSWL_FILTERS,"'/>");
		filterHTML = buttonHTMLArray.join("");
		return filterHTML;
	};

	function setDefaults(preferences){
		// Encounter Filter
		var $encounterFilter = $("#dswlEncounterTypeFilter");
		if($encounterFilter.length > 0){
			var selectedEncVals = preferences.encounterPreferences;
			var $optionsEnc = $('option', $encounterFilter);
			$optionsEnc.each(function(){
				$(this).prop('selected', false);
			});

			$optionsEnc.each(function(){
				for(var i = 0; i < selectedEncVals.length; i++){
					if($(this).val() === selectedEncVals[i].id){
						$(this).prop('selected', true);
						break;
					}
				}
			});
		}

		//Financial Class Filter
		var $financialClassFilter = $("#dswlFinClassFilter");
		if($financialClassFilter.length > 0){
			var selectedFinClassVals = preferences.financialClassPreferences;
			var $optionsFC = $('option', $financialClassFilter);
			$optionsFC.each(function(){
				$(this).prop('selected', false);
			});

			$optionsFC.each(function(){
				for(var i = 0; i < selectedFinClassVals.length; i++){
					if($(this).val() === selectedFinClassVals[i].id){
						$(this).prop('selected', true);
						break;
					}
				}
			});
		}

		//Payer Filter

		var defaultPayers = preferences.payerPreferences
        if(defaultPayers){
            for (var j = 0, length = defaultPayers.length; j < length; j++) {
                var payer = defaultPayers[j];
                addRowToPayerFilterTable(payer.id, payer.name);
            }
        }

		// Next Document Review Filter
		var defaultRelativeRange = preferences.relativeReviewRange;

		var $relativeDateDropdown = $("#dswlRelativeRangeFilter");
		if($relativeDateDropdown.length > 0){
			var $optionRelative = $('option', $relativeDateDropdown);
			$optionRelative.each(function(){
				if(parseInt($(this).val()) === defaultRelativeRange){
					$(this).prop('selected', true);
				}
			});
		}

		// Relationship Filter
		var $relationshipFilter = $("#dswlMyRelationshipFilter");
		if($relationshipFilter.length > 0){
			var selectedRelationshipVal = preferences.personnelReltn;
			if(!selectedRelationshipVal){
				selectedRelationshipVal = rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_ASSIGNED_TO_ME;
			}
			var $optionsRel = $('option', $relationshipFilter);
			$optionsRel.each(function(){
				if($(this).val() === selectedRelationshipVal){
					$(this).prop('selected', true);
				}
			});
		}

		// Complete Documentation Review Filter
		$("#dswlCompleteDocRev").prop('checked', preferences.includeCompleteDocReviewInd);

		// No Documentation Review Date
		$("#dswlNoDocReviewDate").prop('checked', preferences.includeNoNextDocReviewDateInd);

		// Primary Sort Dropdown
		var $primaryDropdown = $("#dswlPrimarySort");
		if($primaryDropdown.length > 0){
			var selectedPrimarySort = preferences.primarySortColumnNameKey;
			var $optionPrim = $('option', $primaryDropdown);
			$optionPrim.each(function(){
				if($(this).val() === selectedPrimarySort){
					$(this).prop('selected', true);
				}
			});
		}

		// Primary Sort Direction
		if (preferences.primarySortDirectionInd === 0) {
			$("#dswlAscendingPrimary").prop("checked", true);
		}
		else {
			$("#dswlDescendingPrimary").prop("checked", true);
		}

		// Secondary Sort Dropdown
		var $secondaryDropdown = $("#dswlSecondarySort");
		if($secondaryDropdown.length > 0){
			var selectedSecondarySort = preferences.secondarySortColumnNameKey;
			var $optionSec = $('option', $secondaryDropdown);
			$optionSec.each(function(){
				if($(this).val() === selectedSecondarySort){
					$(this).prop('selected', true);
				}
			});
		}

		// Secondary Sort Direction
		if(preferences.secondarySortDirectionInd === 0){
			$("#dswlAscendingSecondary").prop("checked", true);
		}
		else{
			$("#dswlDescendingSecondary").prop("checked", true);
		}

	};

	function acceptFilters(){
		$("#dswlFilterBox").hide();
		setAppliedFilters();
		$("#dswlAppliedFilters").html(displayAppliedFilters());
		if($("#dswlSaveConfigurationCheckbox").prop("checked")){
			serviceDelegate.saveFilterPreferences(selectedPatientList, appliedFilters);
			$("#dswlSaveConfigurationCheckbox").prop("checked", false);
		}
		notifyFiltersListeners();
	};

	function cancelFilters(){
		$("#dswlFilterBox").hide();
		$("#dswlEncounterTypeFilter").val(appliedFilters.encounterTypes.length === 0 ? "empty" : appliedFilters.encounterTypes);
		$("#dswlFinClassFilter").val(appliedFilters.financialClasses.length === 0 ? "empty" : appliedFilters.financialClasses);
		$("#dswlMyRelationshipFilter").val(appliedFilters.personnelReltn);

		$("#dswlCompleteDocRev").prop('checked', appliedFilters.includeCompleteDocReviewInd);
		$("#dswlNoDocReviewDate").prop('checked', appliedFilters.includeNoNextDocReviewDateInd);
		$("#dswlPrimarySort").val(appliedFilters.primarySortColumnNameKey);
		if(appliedFilters.primarySortDirectionInd === 0){
			$("#dswlAscendingPrimary").prop("checked", true);
		}
		else{
			$("#dswlDescendingPrimary").prop("checked", true);
		}
		$("#dswlSecondarySort").val(appliedFilters.secondarySortColumnNameKey);
		if(appliedFilters.secondarySortDirectionInd === 0){
			$("#dswlAscendingSecondary").prop("checked", true);
		}
		else{
			$("#dswlDescendingSecondary").prop("checked", true);
		}
		if($("#dswlSaveConfigurationCheckbox").prop("checked")){
			$("#dswlSaveConfigurationCheckbox").prop("checked", false);
		}

		//Payer Filters
		//restore any table rows that were deleted
		if (appliedFilters.payers.length >= payerFilters.length)
		{
			for (var k = 0; k < appliedFilters.payers.length; k++) {
				var payerFilter = appliedFilters.payers[k]
				addRowToPayerFilterTable(payerFilter.ID, payerFilter.NAME);
			}
		}
		for (var j = 0; j < payerFilters.length; j++) {
			var found = false;
			for (var i = 0; i < appliedFilters.payers.length; i++) {
				if (payerFilters[j].ID === appliedFilters.payers[i].ID) {
					found = true;
					break;
				}
			}
			if (!found)
			{
				removeRowFromPayerFilterTable($('#payerFilterRemoveX' + payerFilters[j].ID));
			}
		}
	};

	function uncheckOtherRadioButtons(radioSelected){
        if (radioSelected.id === "dswlAscendingPrimary") {
            document.getElementById('dswlDescendingPrimary').checked = false;
        }
        if (radioSelected.id === "dswlDescendingPrimary") {
            document.getElementById('dswlAscendingPrimary').checked = false;
        }
        if (radioSelected.id === "dswlAscendingSecondary") {
            document.getElementById('dswlDescendingSecondary').checked = false;
        }
        if (radioSelected.id === "dswlDescendingSecondary") {
            document.getElementById('dswlAscendingSecondary').checked = false;
        }
    };

	function setAppliedFilters(){
		var selectedEncounters = $("#dswlEncounterTypeFilter").val();
		if(!selectedEncounters || selectedEncounters.length === 1 && selectedEncounters[0] === 'empty'){
			appliedFilters.encounterTypes = [];
		}
		else{
			appliedFilters.encounterTypes = $("#dswlEncounterTypeFilter").val();
		}

		var selectedFinClasses = $("#dswlFinClassFilter").val();
		if(!selectedFinClasses || selectedFinClasses.length === 1 && selectedFinClasses[0] === 'empty'){
			appliedFilters.financialClasses = [];
		}
		else {
			appliedFilters.financialClasses = selectedFinClasses;
		}

		if(payerFilters.length > 0){
			appliedFilters.payers = [];
			for (var i = 0; i < payerFilters.length; i ++) {
				appliedFilters.payers.push(payerFilters[i]);
			}
		}
		else{
			appliedFilters.payers = [];
		}
		appliedFilters.personnelReltn = $("#dswlMyRelationshipFilter").val();

		var documentReviewedDateRange = parseInt($("#dswlRelativeRangeFilter").val());
		appliedFilters.documentReviewedDateRange = documentReviewedDateRange;

		appliedFilters.includeCompleteDocReviewInd = $("#dswlCompleteDocRev").prop("checked") ? 1 : 0;
		appliedFilters.includeNoNextDocReviewDateInd = $("#dswlNoDocReviewDate").prop("checked") ? 1 : 0;
		appliedFilters.primarySortColumnNameKey = $("#dswlPrimarySort").val();
		appliedFilters.primarySortDirectionInd = $("#dswlAscendingPrimary").prop("checked") ? 0 : 1;
		appliedFilters.secondarySortColumnNameKey = $("#dswlSecondarySort").val();
		appliedFilters.secondarySortDirectionInd = $("#dswlAscendingSecondary").prop("checked") ? 0 : 1;
	};

	function displayAppliedFilters(){
		var appliedFiltersString = "";
		var $encounterFilter = $("#dswlEncounterTypeFilter");
		if ($encounterFilter.length > 0) {
			var tempString = "";
			var $optionsEnc = $('option', $encounterFilter);
			$optionsEnc.each(function(){
				if ($(this).prop('selected') && $(this).val() !== 'empty') {
					tempString += $(this).text();
					tempString += ", ";
				}
			});
			if(tempString !== ""){
				tempString = tempString.substring(0, tempString.length - 2);
			}
			appliedFiltersString = tempString;
			if(tempString !== ""){
				appliedFiltersString += " | ";
			}
		}

		var $financialClassFilter = $("#dswlFinClassFilter");
		if ($financialClassFilter.length > 0) {
			var tempString2 = "";
			var $optionsFC = $('option', $financialClassFilter);
			$optionsFC.each(function(){
				if ($(this).prop('selected') && $(this).val() !== 'empty') {
					tempString2 += $(this).text();
					tempString2 += ", ";
				}
			});
			if(tempString2 !== ""){
				tempString2 = tempString2.substring(0, tempString2.length - 2);
			}
			appliedFiltersString += tempString2;
			if(tempString2 !== ""){
				appliedFiltersString += " | ";
			}
		}

		if (appliedFilters.payers && appliedFilters.payers.length > 0) {
			var filtersArr = [];
			var tempString2 = "";
			for (var i = 0; i < appliedFilters.payers.length; i++) {

				filtersArr.push(appliedFilters.payers[i].NAME);
				filtersArr.push(", ");
			}

			// Remove last comma
			filtersArr.pop();
			appliedFiltersString += filtersArr.join("");
			if (filtersArr.length > 0){
				appliedFiltersString+=" | ";
			}
		}

		appliedFiltersString += rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENT_REVIEW_LOWER;
		appliedFiltersString += $("#dswlRelativeRangeFilter option:selected").text();

		if (appliedFiltersString !== "") {
			appliedFiltersString += " | ";
		}
		appliedFiltersString += $("#dswlMyRelationshipFilter option:selected").text();

		if($("#dswlCompleteDocRev").prop("checked")){
			if (appliedFiltersString !== "") {
				appliedFiltersString += " | ";
			}
			appliedFiltersString += rcm_documentation_specialist_worklist_i18n.DSWL_INCLUDE_COMPLETED_DOCUMENTATION_REVIEWS;
		}

		if($("#dswlNoDocReviewDate").prop("checked")){
			if (appliedFiltersString !== "") {
				appliedFiltersString += " | ";
			}
			appliedFiltersString += rcm_documentation_specialist_worklist_i18n.DSWL_INCLUDE_NO_NEXT_DOCUMENTATION_REVIEW_DATE;
		}
		return appliedFiltersString;
	};

	function setPayerFilterSearch() {
		var orgSearchControl = new OrgSearchControl(document.getElementById("payerFilter"));
		var payerSearchControlListener = function(){
			var newPayerIdToBeAdded = String(orgSearchControl.getSelectedOrgId());
			var newPayerNameToBeAdded = $("#payerFilter").val();
			if(newPayerIdToBeAdded !== "" && newPayerNameToBeAdded !== ""){
				addRowToPayerFilterTable(newPayerIdToBeAdded, newPayerNameToBeAdded);
				//Reset orgSearchControl
				orgSearchControl.setSelectedOrg("","");
			}
		};
		orgSearchControl.setOrgType("INSCO");
		orgSearchControl.addVerifyStateChangeListener(payerSearchControlListener);

		//Payer Filter Table Events
		$( '#payerTable' ).on( 'mouseenter', 'tr', function () {
				highlightAndShowX(this);
		});
		$( '#payerTable' ).on( 'mouseleave', 'tr', function () {
			removeHighlightAndHideX(this);
		});
		$( '#payerTable' ).on( 'mouseenter', 'div', function () {
			switchXToOtherXImage(this);
		});
		$( '#payerTable' ).on( 'mouseleave', 'div', function () {
			switchXToOtherXImage(this);
		});
		$( '#payerTable' ).on( 'click', 'div', function () {
			removeRowFromPayerFilterTable(this);
		});
	};


	/**
	* Switches X hover into other image
	*/
	function switchXToOtherXImage(name){
		if($(name).hasClass("dswl-remove-x")){
			$(name).removeClass("dswl-remove-x");
			$(name).addClass("dswl-hover-over-remove-x");
		}
		else{
			$(name).removeClass("dswl-hover-over-remove-x");
			$(name).addClass("dswl-remove-x");
		}
	};

	function addRowToPayerFilterTable(newPayerIdToBeAdded, newPayerNameToBeAdded){
		var newPayerEntry = {
			"ID": newPayerIdToBeAdded,
			"NAME": newPayerNameToBeAdded
		};
		var isAlreadyInList = false;
		for(var i = 0; i < payerFilters.length; i++){
			if(Number(payerFilters[i].ID) === Number(newPayerEntry.ID) && payerFilters[i].NAME === newPayerEntry.NAME){
				isAlreadyInList = true;
				break;
			}
		}
		if(!isAlreadyInList){
			payerFilters.unshift(newPayerEntry);


			//Add new payer row to table
			var tableRowHTML = [];
			tableRowHTML.push("<tr id='",newPayerIdToBeAdded,"' class='payerFilterRowDisp'>");
				tableRowHTML.push("<td><p class='dswl-float-left'>",newPayerNameToBeAdded,"</p>");
					tableRowHTML.push("<div  id='payerFilterRemoveX",newPayerIdToBeAdded,"'class='dswl-X-float-right dswl-remove-x'></div></td></tr>");
			$("#payerTable").prepend(tableRowHTML.join(""));

		}
	};

	function removeRowFromPayerFilterTable(name){
		var payerIdToRemove = $(name).closest("tr").attr("id");
		payerIdToRemove = Number(payerIdToRemove);
		for(var i = 0; i < payerFilters.length; i++){
			if(Number(payerFilters[i].ID) === payerIdToRemove){
				payerFilters.splice(i, 1);
			}
		}
		$(name).closest("tr").remove();
	};
	/**
	* shows x hover over
	*/
	function highlightAndShowX(name){
		$(name).addClass("dswl-managerNameHoverOver");
		var hoverRemoveX = $(name).find(".dswl-X-float-right");
		$(hoverRemoveX).css("visibility", "visible")
	};

	/**
	* removes x hover over
	*/
	function removeHighlightAndHideX (name){
		$(name).removeClass("dswl-managerNameHoverOver");
		var hoverRemoveX = $(name).find(".dswl-X-float-right");
		$(hoverRemoveX).css("visibility", "hidden");
	};
	function getSelectedPayers() {
		return payerFilters;
	};

    function openListMaintenance(component){
        var maintenanceObj = window.external.DiscernObjectFactory("PMLISTMAINTENANCE");
        $("#listBlockingDiv").show();
        if (maintenanceObj.OpenListMaintenanceDialog() === 0){
            $("#listBlockingDiv").hide();
            return;
        }
        $("#listBlockingDiv").hide();
        component.initialize();
    }
};