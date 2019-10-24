var RCM_ASWL_Filters = function(){
    return {
        "filterHTMLArray": [],
        "filtersListeners": [],
        "encounterTypes": [],
        "selectedPatientListJson": null,
        "criterion": null,
        "appliedFilters": null,
		"cmDefined": 0,
		"dpDefined": 0,
		"dsDefined": 0,
		"secondarySortChanged": 0,
		"primarySortChanged": 0,
		"resizeendDate": null,
		"resizeTimeout": false,
		"resizeendDelta":20,
		"allPatientLists":[],

        initialize: function(criteria, patientLists){
            criterion = criteria;
			this.resizeendDate = new Date(1, 1, 2000, 12,00,00);
			this.allPatientLists = patientLists;
			this.resizeendTimeout = false;
			this.resizeendDelta = 20;
            this.filterHTMLArray = [];
            this.filterHTMLArray.push("<div id='filters'>");
            this.filterHTMLArray.push("<div class='aswl-filters'>");
            var patientListString = RCM_ASWL_Filters.patientListFilter();
            this.filterHTMLArray.push(patientListString);
            if(patientLists.length > 0){
                this.createFilters();
            }
            this.filterHTMLArray.push("</div>");
			this.filterHTMLArray.push("<div id='appliedFilters' class='aswl-appliedFilters'></div>");
			this.filterHTMLArray.push("<div id='patientCount' class='aswl-appliedFiltersPatientCount'></div>");
			this.filterHTMLArray.push("<div class='aswl-surroundAllFloatingDivs'></div>");
			this.filterHTMLArray.push("</div>");
        },

		patientListFilter: function(){
            var filterHTML = "";
            var patientListHTMLArray = [];
            var loc = criterion.static_content;

            patientListHTMLArray.push("<div class='aswl-patient-list-div'>");
            patientListHTMLArray.push("<label class='patient-list-label'>", rcm_assignment_worklist_i18n.ASWL_PATIENT_LIST, "</label>&nbsp;");
            patientListHTMLArray.push("<select class='aswl-filter-dropdown' id='patientListDropbox' name='unitFilterDropDown' onchange='RCM_ASWL_Filters.patientListFilterListener(this)'>");

            RCM_ASWL_Filters.selectedPatientListJson = this.allPatientLists.length > 0 ? RCM_ASWL_Filters.getDefaultPatientList(this.allPatientLists) : null;
            if(RCM_ASWL_Filters.selectedPatientListJson) {
                document.cookie = "rcm_aswl_pl=" + RCM_ASWL_Filters.selectedPatientListJson.id;
            }

            patientListHTMLArray.push("</select>");
			patientListHTMLArray.push(RCM_ASWL_Filters.filterButton());
            patientListHTMLArray.push("</div>");
            patientListHTMLArray.push("<div class='aswl-open-list-maintenance-div' onclick='RCM_ASWL_Filters.openListMaintenance()'>");
            patientListHTMLArray.push("<img class='aswl-list-maintenance-img' src='", loc, "\\images\\list-settings.png' ></div>");

            filterHTML = patientListHTMLArray.join("");
            return filterHTML;
        },

        populatePatientListFilter: function(){
            var $subType = $("#patientListDropbox");
            $subType.empty();
            for (var d = 0; d < this.allPatientLists.length; d++) {
            	$subType.append($('<option></option>').attr("value", this.allPatientLists[d].id).text(this.allPatientLists[d].name));
            }
            $subType.val(this.selectedPatientListJson.id);
        },

		createFilters: function(){
            if(document.getElementById("filterBox")){
                document.getElementById('patientListLabel').innerHTML = this.selectedPatientListJson.name + rcm_assignment_worklist_i18n.ASWL_DASH;
            }
            else{
                var patientListName = RCM_ASWL_Filters.selectedPatientListJson.name;

                var boxDiv = document.createElement("div");
                boxDiv.id = "filterBox";
                boxDiv.className = "aswl-filter-box";
                var injectHtmlArray = [];

                // Header
                injectHtmlArray.push("<div class='aswl-filter-title-bar'>");
                injectHtmlArray.push("<label class='aswl-filter-title' id='patientListLabel' for='filters'>", patientListName, rcm_assignment_worklist_i18n.ASWL_DASH, "</label>");
                injectHtmlArray.push("<label class='aswl-filter-subtitle' for='filters'>", rcm_assignment_worklist_i18n.ASWL_FILTER_SETTINGS, "</label>");
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("<div id = 'filterBox-scrollable-content'>");

                // Filters
                injectHtmlArray.push(this.encounterTypeFilter());
                injectHtmlArray.push(this.payerFilter());
                injectHtmlArray.push("<div id='careMgrCheckBox' class='aswl-checkboxes'>");
                injectHtmlArray.push("<input type='checkbox' name='Care Manager' value='Care Manager' checked onclick='RCM_ASWL_Filters.careManagerOnclick()' id=careManagerCheckBox /> ");
                injectHtmlArray.push("<label for='Care Manager' >",  rcm_assignment_worklist_i18n.ASWL_CHECKBOX_CARE_MANAGER, "</label> ");
                injectHtmlArray.push("</div>");
                injectHtmlArray.push(this.cmRelationshipFilter());
                injectHtmlArray.push(this.careManagerFilter());
                injectHtmlArray.push("<div id='dischargePlannerCheckBoxandlabel' class='aswl-checkboxes'>");
                injectHtmlArray.push("<input type='checkbox' name='Discharge Planner' value='Discharge Planner' checked  onclick='RCM_ASWL_Filters.dischargePlannerOnclick()' id=dischargePlannerCheckBox /> ");
                injectHtmlArray.push("<label for='Discharge Planner'>",  rcm_assignment_worklist_i18n.ASWL_CHECKBOX_DISCHARGE_PLANNER, "</label>");
                injectHtmlArray.push("</div>");
                injectHtmlArray.push(this.dpRelationshipFilter());
                injectHtmlArray.push(this.dischargePlannerFilter());
                injectHtmlArray.push("<div id='DocSpecialistCheckBox' class='aswl-checkboxes'>");
                injectHtmlArray.push("<input type='checkbox' name='Documentation Specialist' value='Documentation Specialist' checked onclick='RCM_ASWL_Filters.documentationSpecialistOnclick()' id=documentationSpecialistCheckBox />");
                injectHtmlArray.push("<label for='Documentation Specialist'>",  rcm_assignment_worklist_i18n.ASWL_CHECKBOX_DOCUMENTATION_SPECIALIST, "</label>");
                injectHtmlArray.push("</div>");
                injectHtmlArray.push(this.dsRelationshipFilter());
                injectHtmlArray.push(this.documentationSpecialistFilter());
                injectHtmlArray.push("<br/>");


                // Sorting
                injectHtmlArray.push("<div class='aswl-separator'></div>");
                injectHtmlArray.push("<div class='aswl-filter-sorting-div'>");
                injectHtmlArray.push("<label class='aswl-filter-sorting-header' for='primary'>", rcm_assignment_worklist_i18n.ASWL_SORTING, "</label>");
                injectHtmlArray.push("<div>");
                injectHtmlArray.push(this.primarySort());
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("<div>");
                injectHtmlArray.push(this.secondarySort());
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("</div>");

                injectHtmlArray.push("</div>");

                // Save Checkbox and Accept/Cancel Buttons
                injectHtmlArray.push("<div class='aswl-filter-apply-cancel-area' id='applyCancelDiv'>");
                injectHtmlArray.push("<input class='aswl-filter-checkbox-save-area ' type='checkbox' id='aswl-saveConfigurationCheckbox' name='aswl-saveConfigurationCheckbox'></input>");
                injectHtmlArray.push("<label class='aswl-filter-checkbox-save-area ' for='saveConfigurationCheckbox'>", rcm_assignment_worklist_i18n.ASWL_SAVE_CONFIGURATION, "</label>");
                injectHtmlArray.push("<button class='aswl-filter-button-apply' onclick='RCM_ASWL_Filters.acceptFilters()'>", rcm_assignment_worklist_i18n.ASWL_APPLY, "</button>&nbsp;");
                injectHtmlArray.push("<button class='aswl-filter-button-cancel' onclick='RCM_ASWL_Filters.cancelFilters()'>", rcm_assignment_worklist_i18n.ASWL_CANCEL, "</button>");
                injectHtmlArray.push("</div>");

                injectHtml = injectHtmlArray.join("");
                boxDiv.innerHTML = injectHtml;
                document.body.appendChild(boxDiv);
            }
        },


		careManagerOnclick :function(){
			if ($("#careManagerCheckBox").is(':checked')){

				$(".aswl-filter-button-apply").prop("disabled", false);
				$("#cmRelationshipDropbox").parent().show();
				$("#cmFilter").parent().show();
				if(!($("#cmRelationshipFilterDiv option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
					$("#cmFilter").prop("disabled", true);
				}
				if($("#cmPrimSort").length === 0){
					RCM_ASWL_Filters.createOption('primarySort', rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, 'FirstCareManager', 'cmPrimSort', 0);
					RCM_ASWL_Filters.createOption('secondarySort', rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, 'FirstCareManager', 'cmSecSort', 1);
				}

			}
			else{
				document.getElementById("cmFilter").selectedIndex = 0;
				document.getElementById("cmRelationshipDropbox").selectedIndex = 0;
				$("#cmRelationshipDropbox").parent().hide();
				$("#cmFilter").parent().hide();
				if ((!($("#dischargePlannerCheckBox").is(':checked'))) && (!($("#documentationSpecialistCheckBox").is(':checked')))){
					$(".aswl-filter-button-apply").prop("disabled", true);
				}
				$("#cmPrimSort").remove();
				$("#cmSecSort").remove();
			}

			RCM_ASWL_Filters.resetPrimSortDropDownSelection();
			RCM_ASWL_Filters.resetSecSortDropDownSelection();
		},

		dischargePlannerOnclick :function(){
			if ($("#dischargePlannerCheckBox").is(':checked')){
				$(".aswl-filter-button-apply").prop("disabled", false);
				$("#dpFilter").parent().show();
				$("#dpRelationshipDropbox").parent().show();
				if(!($("#dpRelationshipFilterDiv option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
						$("#dpFilter").prop("disabled", true);
				}
				var hasCareManager = false;
				var pindex = 0;
				var sindex = 1;
				if($("#cmPrimSort").val() && $("#cmPrimSort").val() !== ""){
					hasCareManager = true;
					pindex++;
					sindex++;
				}
				if($("#dpPrimSort").length === 0){
					RCM_ASWL_Filters.createOption('primarySort', rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, 'FirstDischargePlanner', 'dpPrimSort', pindex);
					RCM_ASWL_Filters.createOption('secondarySort', rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, 'FirstDischargePlanner', 'dpSecSort', sindex);
				}

			}
			else{
				document.getElementById("dpFilter").selectedIndex = 0;
				document.getElementById("dpRelationshipDropbox").selectedIndex = 0;
				$("#dpFilter").parent().hide();
				$("#dpRelationshipDropbox").parent().hide();
				if ((!($("#careManagerCheckBox").is(':checked'))) && (!($("#documentationSpecialistCheckBox").is(':checked')))){
					$(".aswl-filter-button-apply").prop("disabled", true);
				}
				$("#dpPrimSort").remove();
				$("#dpSecSort").remove();
			}

			RCM_ASWL_Filters.resetPrimSortDropDownSelection();
			RCM_ASWL_Filters.resetSecSortDropDownSelection();
		},

		documentationSpecialistOnclick :function(){
			if ($("#documentationSpecialistCheckBox").is(':checked')){
				$(".aswl-filter-button-apply").prop("disabled", false);
				$("#dsRelationshipDropbox").parent().show();
				$("#dsFilter").parent().show();
				if(!($("#dsRelationshipFilterDiv option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
						$("#dsFilter").prop("disabled", true);
				}
				var hasCareManager = false;
				var hasDischargePlanner = false;
				var pindex = 0;
				var sindex = 1;
				if($("#cmPrimSort").val() && $("#cmPrimSort").val() !== ""){
					hasCareManager = true;
				}
				if($("#dpPrimSort").val() && $("#dpPrimSort").val() !== ""){
					hasDischargePlanner = true;
				}
				if(hasCareManager){
					pindex++;
					sindex++;
				}
				if(hasDischargePlanner){
					pindex++;
					sindex++;
				}
				if($("#dsPrimSort").length === 0){
					RCM_ASWL_Filters.createOption('primarySort', rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, 'FirstDocSpecialist', 'dsPrimSort', pindex);
					RCM_ASWL_Filters.createOption('secondarySort', rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, 'FirstDocSpecialist', 'dsSecSort', sindex);
				}

			}
			else{
				document.getElementById("dsFilter").selectedIndex = 0;
				document.getElementById("dsRelationshipDropbox").selectedIndex = 0;
				$("#dsRelationshipDropbox").parent().hide();
				$("#dsFilter").parent().hide();
				if ((!($("#dischargePlannerCheckBox").is(':checked'))) && (!($("#careManagerCheckBox").is(':checked')))){
					$(".aswl-filter-button-apply").prop("disabled", true);
				}
				$('#dsPrimSort').remove();
				$('#dsSecSort').remove();

			}

			RCM_ASWL_Filters.resetPrimSortDropDownSelection();
			RCM_ASWL_Filters.resetSecSortDropDownSelection();
		},

		/**
		 * Resets the primary sort drop down box with appropriate values. If the user has not made any selection then then the priority is default to saved user perference.
		 * If the user perference is not allowed then it will default to nurse unit.
		 */
		resetPrimSortDropDownSelection:function(){
			if (!this.primarySortChanged) {
				if (this.appliedFilters.primarySort === 'FirstCareManager') {
					if ($("#careManagerCheckBox").is(':checked')) {
						$("#cmPrimSort").prop('selected', true);
					}
					else {
						$("#nurseUnitPrimSort").prop('selected', true);
					}
				}
				if (this.appliedFilters.primarySort === 'FirstDischargePlanner') {
					if ($("#dischargePlannerCheckBox").is(':checked')){
						$("#dpPrimSort").prop('selected', true);
					}
					else {
						$("#nurseUnitPrimSort").prop('selected', true);
					}
				}
				else if (this.appliedFilters.primarySort === 'FirstDocSpecialist') {
					if ($("#documentationSpecialistCheckBox").is(':checked')) {
						$("#dsPrimSort").prop('selected', true);
					}
					else {
						$("#nurseUnitPrimSort").prop('selected', true);
					}
				}
			}
		},

		/**
		 * Resets the secondary sort drop down box with appropriate values.  If the user has not made any selection then the priority is default to saved user preference.
		 * If the user perference is not allowed then the priority is 1) care manager, 2) discharge planner, 3) doc specialist, 4) empty.
		 */
		resetSecSortDropDownSelection:function() {
			if (!this.secondarySortChanged) {
				if (this.appliedFilters.secondarySort === 'FirstCareManager') {
					if ($("#careManagerCheckBox").is(':checked')) {
						$("#cmSecSort").prop('selected', true);
					} else if ($("#dischargePlannerCheckBox").is(':checked')) {
						$("#dpSecSort").prop('selected', true);
					} else if ($("#documentationSpecialistCheckBox").is(
							':checked')) {
						$("#dsSecSort").prop('selected', true);
					}
				} else if (this.appliedFilters.secondarySort === 'FirstDischargePlanner') {
					if ($("#dischargePlannerCheckBox").is(':checked')) {
						$("#dpSecSort").prop('selected', true);
					} else if ($("#careManagerCheckBox").is(':checked')) {
						$("#cmSecSort").prop('selected', true);
					} else if ($("#documentationSpecialistCheckBox").is(
							':checked')) {
						$("#dsSecSort").prop('selected', true);
					}
				} else if (this.appliedFilters.secondarySort === 'FirstDocSpecialist') {
					if ($("#documentationSpecialistCheckBox").is(':checked')) {
						$("#dsSecSort").prop('selected', true);
					} else if ($("#careManagerCheckBox").is(':checked')) {
						$("#cmSecSort").prop('selected', true);
					} else if ($("#dischargePlannerCheckBox").is(':checked')) {
						$("#dpSecSort").prop('selected', true);
					}
				} else if ($("#secondarySort option:selected").prop('value') === 'empty') {
					if ($("#careManagerCheckBox").is(':checked')) {
						$("#cmSecSort").prop('selected', true);
					} else if ($("#dischargePlannerCheckBox").is(':checked')) {
						$("#dpSecSort").prop('selected', true);
					} else if ($("#documentationSpecialistCheckBox").is(
							':checked')) {
						$("#dsSecSort").prop('selected', true);
					}
				}
			}
		},

		handleRelationshipShowCheckboxes:function(){
				this.careManagerOnclick();
				this.dischargePlannerOnclick();
				this.documentationSpecialistOnclick();
		},

		createOption: function(listName, optionText, optionValue, optionId, index){
			var sortSelectionList = document.getElementById(listName);
			var newOption = document.createElement('option');
			newOption.text = optionText;
			newOption.value = optionValue;
			newOption.id = optionId;
			sortSelectionList.add(newOption, index);
		},

		filterButton: function(){
            var loc = criterion.static_content;
            var filterHTML = "";
            var buttonHTMLArray = [];
            buttonHTMLArray.push("<input id='filterInput' onmousedown='RCM_ASWL_Filters.toggleFilterBox()' class='aswl-filter-button-image' type='image' src='", loc, "\\images\\4342.ico' title='",rcm_assignment_worklist_i18n.ASWL_FILTERS,"'/>");
            filterHTML = buttonHTMLArray.join("");
            return filterHTML;
        },

		toggleFilterBox: function(){
            var filters = document.getElementById("filterBox");

            if (filters.style.display === "inline") {
                filters.style.display = "none";
            }
            else {
                filters.style.display = "inline";
				this.resizeFilterBox();
            }
        },

        populateFilters: function(filters, cmInd, dpInd, dsInd){
			this.cmDefined = cmInd;
			this.dpDefined = dpInd;
			this.dsDefined = dsInd;

			this.populateEncounterTypeFilter(filters.encounterTypeFilters);
			this.populatePayerFilter(filters.payerFilters);
			this.populateCareManagerFilter(filters.careManagerFilters);
			this.populateDischargePlannerFilter(filters.dischargePlannerFilters);
			this.populateDocumentationSpecialistFilter(filters.documentationSpecialistFilters);

			if(this.appliedFilters !== null){
				 this.cancelFilters();
			}
			else{
				 this.setAppliedFilters();
			}
            this.displayAppliedFilters();
        },

        addFiltersListener: function(listener){
            if (listener) {
                this.filtersListeners.push(listener);
            }
        },

        getAppliedFilters: function(){
            return this.appliedFilters;
        },

        getFilterHTML: function(){
            var filterHTML = this.filterHTMLArray.join("");
            return filterHTML;
        },

        getSelectedPatientListJson: function(){
            if (this.appliedFilters === undefined) {
                return "";
            }
            var primarySort = this.appliedFilters.primarySort;
            var primarySortAscending = this.appliedFilters.primarySortAscending;

            var secondarySort = this.appliedFilters.secondarySort;
            var secondarySortAscending = this.appliedFilters.secondarySortAscending;

            this.selectedPatientListJson.primarySortCol = primarySort;

            if (primarySort === "" || primarySortAscending) {
                this.selectedPatientListJson.primarySortDir = 0;
            }
            else {
                this.selectedPatientListJson.primarySortDir = 1;
            }

            this.selectedPatientListJson.secondarySortCol = secondarySort;

            if (secondarySort === "" || secondarySortAscending) {
                this.selectedPatientListJson.secondarySortDir = 0;
            }
            else {
                this.selectedPatientListJson.secondarySortDir = 1;
            }

            return this.selectedPatientListJson;
        },

		setSelectedPatientListJson: function(){
			this.selectedPatientListJson.defaultEncounterTypes = [];
			for(var i = 0; i < this.appliedFilters.encounterTypes.length; i++){
				var encounterType = this.appliedFilters.encounterTypes[i];
				this.selectedPatientListJson.defaultEncounterTypes.push({typeCD:encounterType.value});
			}

			this.selectedPatientListJson.payerID = this.appliedFilters.payer.value;
			this.selectedPatientListJson.showCMInd = this.appliedFilters.cmRelationshipChecked;
			this.selectedPatientListJson.cmRel = this.appliedFilters.cmRelationship.value;
			this.selectedPatientListJson.cmID = this.appliedFilters.careManager.value;
			this.selectedPatientListJson.showDPInd = this.appliedFilters.dpRelationshipChecked;
			this.selectedPatientListJson.dpRel = this.appliedFilters.dpRelationship.value;
			this.selectedPatientListJson.dpID = this.appliedFilters.dischargePlanner.value;
			this.selectedPatientListJson.showDRInd = this.appliedFilters.dsRelationshipChecked;
			this.selectedPatientListJson.drRel = this.appliedFilters.dsRelationship.value;
			this.selectedPatientListJson.drID = this.appliedFilters.documentationSpecialist.value;

            var primarySort = this.appliedFilters.primarySort;
            var primarySortAscending = this.appliedFilters.primarySortAscending;

            var secondarySort = this.appliedFilters.secondarySort;
            var secondarySortAscending = this.appliedFilters.secondarySortAscending;

            this.selectedPatientListJson.primarySortCol = primarySort;

            if (primarySort === "" || primarySortAscending) {
                this.selectedPatientListJson.primarySortDir = 0;
            }
            else {
                this.selectedPatientListJson.primarySortDir = 1;
            }

            this.selectedPatientListJson.secondarySortCol = secondarySort;

            if (secondarySort === "" || secondarySortAscending) {
                this.selectedPatientListJson.secondarySortDir = 0;
            }
            else {
                this.selectedPatientListJson.secondarySortDir = 1;
            }
           for(var i = 0; i < this.allPatientLists.length; i++){
				if(Number(this.selectedPatientListJson.id) === Number(this.allPatientLists[i].id)){
					this.allPatientLists[i] = this.selectedPatientListJson;
				}
			}
        },

        /**
         * Pick a patient list drop down value trigger this listener to refresh assignment worklist.
         */
        patientListFilterListener: function(filterElement){
            var patientListId = $("#patientListDropbox").val();
			for(var i = 0; i < this.allPatientLists.length; i++){
				if(Number(patientListId) === Number(this.allPatientLists[i].id)){
					this.selectedPatientListJson = this.allPatientLists[i];
				}
			}
            this.selectedPatientListJson.name =this.selectedPatientListJson.name.split("N0A(e$s").join("'");
            document.cookie = "rcm_aswl_pl=" + this.selectedPatientListJson.id;

            var filters = document.getElementById("filterBox");
            if (filters.style.display === "inline") {
                filters.style.display = "none";
            }
			this.setDefaultAppliedFilters();
            this.notifyFiltersListeners();
			this.handleRelationshipShowCheckboxes();
            document.getElementById('patientListLabel').innerHTML = this.selectedPatientListJson.name + " - ";
        },

        /**
         * Notify listener to refresh assignment worklist.
         */
        notifyFiltersListeners: function(){
            if (this.filtersListeners !== null) {
                for (var listener = 0, length = this.filtersListeners.length; listener < length; listener++) {
                    this.filtersListeners[listener]();
                }
            }
        },

        /**
         * Apply button on the filter dialog trigger refresh assignment worklist.
         */
        acceptFilters: function(){
            this.setAppliedFilters();
            this.displayAppliedFilters();
            this.toggleFilterBox();
			if (document.getElementById("aswl-saveConfigurationCheckbox").checked){
				this.saveDefaultsToConfig();
			}
            this.notifyFiltersListeners();
        },
		getFloatingBarPosition : function(id){
			var idString = "#" + id;
			var position = $("#copiedtableHeader").position();
			if(position){
				$(idString).css("top", position.top + ($(window).height()-$(idString).height())/2);
			}
			else{
				$(idString).css("top", ($(window).height()-$(idString).height())/2);
			}
		},
		openSaveFailedDialogue: function(){
			$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_SAVE_FAILED);
			$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_SAVE_FILTERS_FAILED_MESSAGE);
			RCM_ASWL_Filters.getFloatingBarPosition("aswlOkDialog");
			$("#aswlOkDialog").show();
		},
        saveDefaultsToConfig: function(){
			if (this.appliedFilters) {

				this.setSelectedPatientListJson();
                var patientListName = this.selectedPatientListJson.name;

				var defaultEncounterArray = [];
				for (var i = 0; i < this.appliedFilters.encounterTypes.length; i++){
					defaultEncounterArray.push({"encounter_type_cd": this.appliedFilters.encounterTypes[i].value});
				}
				var defaultPayer = this.appliedFilters.payer.value;
				if (defaultPayer === ""){
					defaultPayer = "0.0";
				}
				var defaultcmInd = this.appliedFilters.cmRelationshipChecked ? 1: 0;
				var defaultcmRelationship = this.appliedFilters.cmRelationship.value;
				var defaultCareManager = this.appliedFilters.careManager.value;
				if (defaultCareManager === ""){
					defaultCareManager = "0.0";
				}
				var defaultdpInd = this.appliedFilters.dpRelationshipChecked ? 1: 0;
				var defaultdpRelationship = this.appliedFilters.dpRelationship.value;
				var defaultDischargePlanner = this.appliedFilters.dischargePlanner.value;
				if (defaultDischargePlanner === ""){
					defaultDischargePlanner = "0.0";
				}
				var defaultdsInd = this.appliedFilters.dsRelationshipChecked ? 1: 0;
				var defaultdsRelationship = this.appliedFilters.dsRelationship.value;
				var defaultDocumentationSpecialist = this.appliedFilters.documentationSpecialist.value;
				if (defaultDocumentationSpecialist === ""){
					defaultDocumentationSpecialist= "0.0";
				}
				var defaultPrimarySort = this.appliedFilters.primarySort;
				var defaultPrimarySortDescending = this.appliedFilters.primarySortAscending ? 0: 1;
				var defaultSecondarySort = this.appliedFilters.secondarySort;
				var defaultSecondarySortDescending = this.appliedFilters.secondarySortAscending ? 0: 1;


				var defaultsObj = {
					"save_worklist_defaults_request":{
						"patient_list_name": RCM_Clinical_Util.encodeString(patientListName),
						"encounter_types": defaultEncounterArray,
						"payer_id": defaultPayer,
						"show_care_manager_ind": defaultcmInd,
						"care_manager_relation": defaultcmRelationship,
						"care_manager_id": defaultCareManager,
						"show_discharge_planner_ind": defaultdpInd,
						"discharge_planner_relation": defaultdpRelationship,
						"discharge_planner_id": defaultDischargePlanner,
						"show_documentation_reviewer_ind": defaultdsInd,
						"documentation_reviewer_relation": defaultdsRelationship,
						"documentation_reviewer_id": defaultDocumentationSpecialist,
						"primary_sort_column": defaultPrimarySort,
						"primary_sort_dir": defaultPrimarySortDescending,
						"secondary_sort_column": defaultSecondarySort,
						"secondary_sort_dir" : defaultSecondarySortDescending
					}
                };
				var callback = function(status,recordData){
					if (status !== "S"){
						RCM_ASWL_Filters.openSaveFailedDialogue();
					}
				};
				var jsonString = JSON.stringify(defaultsObj);
				var sendAr = [];
				sendAr.push("^MINE^", "0.0", "^SAVE_WORKLIST_DEFAULTS^", "^"+jsonString+"^");
				RCM_Clinical_Util.makeCCLRequest("rcm_assignment_worklist", sendAr, true, callback);
				document.getElementById("aswl-saveConfigurationCheckbox").checked = false;
			}


		},
        cancelFilters: function(){
            $("#filterBox").hide();
            $(".aswl-filter-button-apply").prop("disabled", false);
			//Encounter Types
            var encounterFilter = document.getElementById('encounterTypeFilter');
             if(this.appliedFilters.encounterTypes.length === 0){
             	$("#encounterTypeFilter").val('empty');
             }
             else{
            	 var encounterArray = [];
         		for (var i = 0; i < this.appliedFilters.encounterTypes.length; i++){
         			encounterArray.push(this.appliedFilters.encounterTypes[i].value);
         		}
            	 $("#encounterTypeFilter").val(encounterArray);
             }

			 //Payer
             if(this.appliedFilters.payer.value){
            	 $("#payerFilter").val(String(Number(this.appliedFilters.payer.value)));
             }
             else{
            	 $("#payerFilter").val('empty');
             }

			//Care Manager Relationship
             $("#cmRelationshipDropbox").val(this.appliedFilters.cmRelationship.value);
			if(this.appliedFilters.cmRelationship.value === "ASSIGNED"){
				$("#cmFilter").prop("disabled", false);
			}
			else{
				$("#cmFilter").prop("disabled", true);
			}

			//Care Manager
             if(this.appliedFilters.careManager.value){
            	 $("#cmFilter").val(String(Number(this.appliedFilters.careManager.value)));
             }
             else{
            	 $("#cmFilter").val('empty');
             }

			//Discharge Planner Relationship
             $("#dpRelationshipDropbox").val(this.appliedFilters.dpRelationship.value);
			if(this.appliedFilters.dpRelationship.value === "ASSIGNED"){
				$("#dpFilter").prop("disabled", false);
			}
			else{
				$("#dpFilter").prop("disabled", true);
			}
			//Discharge Planner
             if(this.appliedFilters.dischargePlanner.value){
            	 $("#dpFilter").val(String(Number(this.appliedFilters.dischargePlanner.value)));
             }
             else{
            	 $("#dpFilter").val('empty');
             }

			//Documentation Specialist Relationship
            $("#dsRelationshipDropbox").val(this.appliedFilters.dsRelationship.value);
			if(this.appliedFilters.dsRelationship.value === "ASSIGNED"){
				$("#dsFilter").prop("disabled", false);
			}
			else{
				$("#dsFilter").prop("disabled", true);
			}
			//Documentation Specialist
            if(this.appliedFilters.documentationSpecialist.value){
            	$("#dsFilter").val(String(Number(this.appliedFilters.documentationSpecialist.value)));
            }
            else{
            	$("#dsFilter").val('empty');
            }

        	//Primary Sort
            $("#primarySort").val(this.appliedFilters.primarySort);

        	//Primary Sort Radio Buttons
        	if (!this.appliedFilters.primarySortAscending) {
            	document.getElementById('ascendingPrimary').checked = false;
            	document.getElementById('descendingPrimary').checked = true;
       	 	}
        	else {
            	document.getElementById('descendingPrimary').checked = false;
            	document.getElementById('ascendingPrimary').checked = true;
        	}

        	//Secondary Sort Dropdown Box
        	var secString;
        	if (this.appliedFilters.secondarySort === "") {
            	secString = "--";
        	}
        	else {
            	secString = this.appliedFilters.secondarySort;
        	}
        	$("#secondarySort").val(secString);

        	//Secondary Sort Radio Buttons
        	if (!this.appliedFilters.secondarySortAscending) {
            	document.getElementById('ascendingSecondary').checked = false;
            	document.getElementById('descendingSecondary').checked = true;
        	}
        	else {
            	document.getElementById('descendingSecondary').checked = false;
            	document.getElementById('ascendingSecondary').checked = true;
        	}


			document.getElementById('careManagerCheckBox').checked = this.appliedFilters.cmRelationshipChecked;
			if ($("#careManagerCheckBox").is(':checked')){
				$("#cmRelationshipDropbox").parent().show();
				$("#cmFilter").parent().show();
			}
			else{
				document.getElementById("cmFilter").selectedIndex = 0;
				document.getElementById("cmRelationshipDropbox").selectedIndex = 0;
				$("#cmRelationshipDropbox").parent().hide();
				$("#cmFilter").parent().hide();
			}

			document.getElementById('dischargePlannerCheckBox').checked = this.appliedFilters.dpRelationshipChecked;
			if ($("#dischargePlannerCheckBox").is(':checked')){
				$("#dpRelationshipDropbox").parent().show();
				$("#dpFilter").parent().show();
			}
			else{
				document.getElementById("dpFilter").selectedIndex = 0;
				document.getElementById("dpRelationshipDropbox").selectedIndex = 0;
				$("#dpRelationshipDropbox").parent().hide();
				$("#dpFilter").parent().hide();
			}

			document.getElementById('documentationSpecialistCheckBox').checked = this.appliedFilters.dsRelationshipChecked;
			if ($("#documentationSpecialistCheckBox").is(':checked')){
				$("#dsRelationshipDropbox").parent().show();
				$("#dsFilter").parent().show();
			}
			else{
				document.getElementById("dsFilter").selectedIndex = 0;
				document.getElementById("dsRelationshipDropbox").selectedIndex = 0;
				$("#dsRelationshipDropbox").parent().hide();
				$("#dsFilter").parent().hide();
			}
        },

		displayAppliedFilters: function(){
           	var appliedFiltersDiv = document.getElementById("appliedFilters");

            if (appliedFiltersDiv) {
                appliedFiltersDiv.innerHTML = this.createAppliedFiltersString();
            }
        },


		addPatientCountString: function(recordNum){
			var patientCountString = "<div id='patientListCountDiv' class='aswl-patientCountWhitePipeLine'>" + rcm_assignment_worklist_i18n.ASWL_PATIENTS + ": " + recordNum + "</div>";
			$("#patientCount").html(patientCountString);
			//reset the height so if the filters div was previously tall
			//and shrinks down, the patientCount div will shrink too
			$("#patientCount").height(0);
			$("#patientCount").height($("#filters").height());
			$("#patientListCountDiv").height($("#patientCount").height());
		},

		createAppliedFiltersString: function(){
            var filtersString = "";
			var encounterFilters = $("#encounterTypeFilter").val();
			if (encounterFilters && encounterFilters.length > 0) {
				$("#encounterTypeFilter option:selected").each(function(){
					if($(this).val() !== "empty"){
						filtersString += $(this).text();
						filtersString += ", ";
					}
				});
				var tempString = filtersString.substring(0, filtersString.length - 2);
                filtersString = tempString;
			}

			if ($("#payerFilter").length > 0 && $("#payerFilter").val() !== "empty") {
                if (filtersString.length > 0) {
                    filtersString += " | ";
                }
                filtersString += $("#payerFilter option:selected").text();
            }

			if($("#cmFilter").val() !== "empty"){
				if (filtersString.length > 0) {
                    filtersString += " | ";
                }
                filtersString += rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER + ": " + $("#cmFilter option:selected").text();
			}
			else{
	            if ($("#cmRelationshipDropbox").length > 0 && this.cmDefined === 1 && ($("#careManagerCheckBox").is(':checked'))) {
	                if (filtersString.length > 0) {
	                    filtersString += " | ";
	                }
	                filtersString += $("#cmRelationshipDropbox option:selected").text();
	            }
			}

			if($("#dpFilter").val() !== "empty"){
				if (filtersString.length > 0) {
                    filtersString += " | ";
                }
                filtersString += rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER + ": " + $("#dpFilter option:selected").text();
			}
			else{
	            if ($("#dpRelationshipDropbox").length > 0 && this.dpDefined === 1 && ($("#dischargePlannerCheckBox").is(':checked'))) {
	                if (filtersString.length > 0) {
	                    filtersString += " | ";
	                }
	                filtersString += $("#dpRelationshipDropbox option:selected").text();
	            }
			}
			if($("#dsFilter").val() !== "empty"){
				if (filtersString.length > 0) {
                    filtersString += " | ";
                }
                filtersString += rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST + ": " + $("#dsFilter option:selected").text();
			}
			else{
				if($("#dsRelationshipDropbox").length > 0 && this.dsDefined === 1 && ($("#documentationSpecialistCheckBox").is(':checked'))){
					if(filtersString.length > 0){
						filtersString += " | ";
					}
					filtersString += $("#dsRelationshipDropbox option:selected").text();
				}
			}

            return filtersString;
		},

        setAppliedFilters: function(){
            this.appliedFilters = new RCM_ASWL_Applied_Filters();
			this.appliedFilters.encounterTypes = this.getSelectedEncounterTypes();
            this.appliedFilters.payer = this.getSelectedPayer();
            this.appliedFilters.cmRelationship = this.getSelectedCMRelationship();
            this.appliedFilters.careManager = this.getSelectedCareManager();
            this.appliedFilters.dpRelationship = this.getSelectedDPRelationship();
            this.appliedFilters.dischargePlanner = this.getSelectedDischargePlanner();
			this.appliedFilters.dsRelationship = this.getSelectedDSRelationship();
			this.appliedFilters.documentationSpecialist = this.getSelectedDocumentationSpecialist();

            var primarySort = document.getElementById("primarySort").value;
            var primarySortAscending = document.getElementById("ascendingPrimary").checked;
            var secondarySort = document.getElementById("secondarySort").value;
            var secondarySortAscending = document.getElementById("ascendingSecondary").checked;

			var cmRelationshipChecked =document.getElementById("careManagerCheckBox").checked;
			var dpRelationshipChecked =document.getElementById("dischargePlannerCheckBox").checked;
            var dsRelationshipChecked =document.getElementById("documentationSpecialistCheckBox").checked;

			this.appliedFilters.cmRelationshipChecked  = cmRelationshipChecked;
			this.appliedFilters.dpRelationshipChecked  = dpRelationshipChecked;
			this.appliedFilters.dsRelationshipChecked  = dsRelationshipChecked;

            this.appliedFilters.primarySort = primarySort;
            this.appliedFilters.primarySortAscending = primarySortAscending;
            this.appliedFilters.secondarySort = secondarySort;
            this.appliedFilters.secondarySortAscending = secondarySortAscending;
        },

		setDefaultAppliedFilters: function(){
            this.appliedFilters = new RCM_ASWL_Applied_Filters();
			this.appliedFilters.encounterTypes = this.getSelectedEncounterTypes(true);
            this.appliedFilters.payer = this.getSelectedPayer(true);
            this.appliedFilters.cmRelationship = this.getSelectedCMRelationship(true);
            this.appliedFilters.careManager = this.getSelectedCareManager(true);
            this.appliedFilters.dpRelationship = this.getSelectedDPRelationship(true);
            this.appliedFilters.dischargePlanner = this.getSelectedDischargePlanner(true);
			this.appliedFilters.dsRelationship = this.getSelectedDSRelationship(true);
			this.appliedFilters.documentationSpecialist = this.getSelectedDocumentationSpecialist(true);

            var primarySort = this.selectedPatientListJson.primarySortCol;
            var primarySortAscending = this.selectedPatientListJson.primarySortDir;
            var secondarySort = this.selectedPatientListJson.secondarySortCol;
            var secondarySortAscending = this.selectedPatientListJson.secondarySortDir;

			var cmRelationshipChecked =this.selectedPatientListJson.showCMInd;
			var dpRelationshipChecked =this.selectedPatientListJson.showDPInd;
            var dsRelationshipChecked =this.selectedPatientListJson.showDRInd;

			this.appliedFilters.cmRelationshipChecked  = cmRelationshipChecked;
			this.appliedFilters.dpRelationshipChecked  = dpRelationshipChecked;
			this.appliedFilters.dsRelationshipChecked  = dsRelationshipChecked;

            this.appliedFilters.primarySort = primarySort;
            this.appliedFilters.primarySortAscending = primarySortAscending ? 0 : 1;
            this.appliedFilters.secondarySort = secondarySort;
            this.appliedFilters.secondarySortAscending = secondarySortAscending ? 0 : 1;
        },

        encounterTypeFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='aswl-filter'>");
            filterHTML.push("<label class='aswl-filter-encounter-type' for='encounterTypeFilter'>", rcm_assignment_worklist_i18n.ASWL_ENCOUNTER_TYPE, "</label>");
            filterHTML.push("<select multiple='multiple' class='aswl-filterDropdown' id='encounterTypeFilter' name='encounterTypeFilter'>");
            filterHTML.push("<option selected='true' value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var encounterTypeHTMLString = filterHTML.join("");
            return encounterTypeHTMLString;
        },

        populateEncounterTypeFilter: function(data){
            var encounterTypeFilterElement = document.getElementById('encounterTypeFilter');
            encounterTypeFilterElement.options.length = 0;

            if (data && data.length > 0) {
                var i;
                var len = data.length + 1;
                for (i = 0; i < len; i++) {
                    var encounterOption = document.createElement("option");
                    if (i === 0) {
                        encounterOption.value = "empty";
                        encounterOption.text = "--";
                        encounterOption.selected = true;
                        encounterTypeFilterElement.options.add(encounterOption);
                    }
                    else {
                        var encounterFilter = data[i - 1];
                        encounterOption.value = String(Number(encounterFilter.id));
                        encounterOption.text = encounterFilter.name;
                        encounterTypeFilterElement.options.add(encounterOption);
                    }
                }
                if (encounterTypeFilterElement.disabled === true) {
                    encounterTypeFilterElement.disabled = false;
                }
            }
        },

		getSelectedEncounterTypes: function(flag){
            var encounterTypeFilterElement = document.getElementById('encounterTypeFilter');

            if (encounterTypeFilterElement) {
                var encounterTypes = [];
                var i;
				if(flag){
					var len = this.selectedPatientListJson.defaultEncounterTypes.length;
					for (i = 0; i < len; i++) {
						var option = new RCM_Option(String(Number(this.selectedPatientListJson.defaultEncounterTypes[i].typeCD)), "");
						encounterTypes.push(option);
					}
				}else{
					var len = encounterTypeFilterElement.options.length;
					for (i = 0; i < len; i++) {
						if (encounterTypeFilterElement.options[i].selected) {
							if (encounterTypeFilterElement.options[i].value !== "empty") {
								var option = new RCM_Option(encounterTypeFilterElement.options[i].value, encounterTypeFilterElement.options[i].text);
								encounterTypes.push(option);
							}
						}
					}
				}

            }
            return encounterTypes;
        },

        payerFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='aswl-filter'>");
            filterHTML.push("<label for='payerFilter'>", rcm_assignment_worklist_i18n.ASWL_PAYER, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='payerFilter' name='payerFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var payerHTML = filterHTML.join("");
            return payerHTML;
        },

        populatePayerFilter: function(data){
            var payerFilter = document.getElementById('payerFilter');
            payerFilter.options.length = 0;
            var i;
            var length = data.length;
            for (i = 0; i < length + 1; i++) {
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "empty";
                    opt.text = "--";
                    payerFilter.options.add(opt);
                }
                else {
                    var payer = data[i - 1];
                    opt.value = String(Number(payer.id));
                    opt.text = payer.name;
                    payerFilter.options.add(opt);
                }
            }
        },

        getSelectedPayer: function(flag){
			var option;
			if(flag){
				if(this.selectedPatientListJson.payerID === "empty"){
					option = new RCM_Option("", "");
				}else{
					option = new RCM_Option(String(Number(this.selectedPatientListJson.payerID)), "");
				}
				return option;
			}else{
				var payerElement = document.getElementById('payerFilter');

            }
            if (payerElement) {
                var payerFilter = payerElement.options[payerElement.selectedIndex];


                if (payerFilter.value === "empty") {
                    option = new RCM_Option("", "");
                }
                else {
                    option = new RCM_Option(payerFilter.value, payerFilter.text);
                }
                return option;
            }
        },

        cmRelationshipFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='cmRelationshipFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='cmRelationshipFilterDropDown'>", rcm_assignment_worklist_i18n.ASWL_CM_RELATIONSHIP, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='cmRelationshipDropbox' name='cmRelationshipFilterDropDown'>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,"' selected='selected'>", rcm_assignment_worklist_i18n.ASWL_ALL, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_ASSIGNED, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_UNASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_UNASSIGNED, "</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var cmRelationshipHTML = filterHTML.join("");
            return cmRelationshipHTML;
        },

        getSelectedCMRelationship: function(flag){
			if(flag){
				var option = new RCM_Option(this.selectedPatientListJson.cmRel, "");
				return option;
			}else{
				var cmRelationshipFilterElement = document.getElementById('cmRelationshipDropbox');

				if (cmRelationshipFilterElement) {
					var cmRelationshipFilter = cmRelationshipFilterElement.options[cmRelationshipFilterElement.selectedIndex];
					var option = new RCM_Option(cmRelationshipFilter.value, cmRelationshipFilter.text);
					return option;
				}
			}
        },

		careManagerFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='cmFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='cmFilter'>", rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='cmFilter' name='cmFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var cmHTML = filterHTML.join("");
            return cmHTML;
        },

        populateCareManagerFilter: function(data){
            var careManagerFilter = document.getElementById('cmFilter');
            careManagerFilter.options.length = 0;
            var i;
            var length = data.length;
            for (i = 0; i < length + 1; i++) {
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "empty";
                    opt.text = "--";
                    careManagerFilter.options.add(opt);
                }
                else {
                    var cm = data[i - 1];
                    opt.value = String(Number(cm.id));
                    opt.text = cm.name;
                    careManagerFilter.options.add(opt);
                }
            }
			// If there are no care managers, hide the care manager filters.
			if(!this.cmDefined){
				$("#cmRelationshipFilterDiv").hide();
				$("#cmFilterDiv").hide();
				$("#cmPrimSort").remove();
				$("#cmSecSort").remove();
				$("#careMgrCheckBox").hide();
				if (!this.secondarySortChanged) {
					if(this.dpDefined){
						$("#dpSecSort").prop('selected', true);
					}
					else if(this.dsDefined){
						$("#dsSecSort").prop('selected', true);
					}
				}
			}
			else if (!this.secondarySortChanged) {
				$("#cmSecSort").prop('selected', true);
			}

			// The Care Manager filter should only be enabled if 'ASSIGNED' is selected in the CM Relationship filter.
			if(!($("#cmRelationshipDropbox option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
					$("#cmFilter").prop("disabled", true);
			}
			else{
				$("#cmFilter").prop("disabled", false);
			}

			$("#cmRelationshipDropbox").change(function(){
				if($("#cmRelationshipDropbox option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED){
					$("#cmFilter").prop("disabled", false);
				}
				else{
					$("#cmFilter").prop("disabled", true);
					$("#cmFilter").val("empty");
				}
			});
        },

        getSelectedCareManager: function(flag){
		if(flag){
			if(this.selectedPatientListJson.cmID === "empty"){
				option = new RCM_Option("", "");
			}else{
				option = new RCM_Option(String(Number(this.selectedPatientListJson.cmID)), "");
			}
            return option;
		}else{
            var careManagerElement = document.getElementById('cmFilter');

            if (careManagerElement) {
                var careManagerFilter = careManagerElement.options[careManagerElement.selectedIndex];

                var option;
                if (careManagerFilter.value === "empty") {
                    option = new RCM_Option("", "");
                }
                else {
                    option = new RCM_Option(careManagerFilter.value, careManagerFilter.text);
                }
                return option;
            }
		}
        },

        dpRelationshipFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='dpRelationshipFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='dpRelationshipFilterDropDown'>", rcm_assignment_worklist_i18n.ASWL_DP_RELATIONSHIP, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='dpRelationshipDropbox' name='dpRelationshipFilterDropDown'>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,"' selected='selected'>", rcm_assignment_worklist_i18n.ASWL_ALL, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_ASSIGNED, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_UNASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_UNASSIGNED, "</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var dpRelationshipHTML = filterHTML.join("");
            return dpRelationshipHTML;
        },

        getSelectedDPRelationship: function(flag){
			if(flag){
				var option = new RCM_Option(this.selectedPatientListJson.dpRel, "");

				return option;
			}else{
				var dpRelationshipFilterElement = document.getElementById('dpRelationshipDropbox');

				if (dpRelationshipFilterElement) {
					var dpRelationshipFilter = dpRelationshipFilterElement.options[dpRelationshipFilterElement.selectedIndex];
					var option = new RCM_Option(dpRelationshipFilter.value, dpRelationshipFilter.text);

					return option;
				}
			}
        },

		dischargePlannerFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='dpFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='dischargePlannerFilter'>", rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='dpFilter' name='dpFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var dpHTML = filterHTML.join("");
            return dpHTML;
        },

        populateDischargePlannerFilter: function(data){
            var dischargePlannerFilter = document.getElementById('dpFilter');
            dischargePlannerFilter.options.length = 0;
            var i;
            var length = data.length;
            for (i = 0; i < length + 1; i++) {
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "empty";
                    opt.text = "--";
                    dischargePlannerFilter.options.add(opt);
                }
                else {
                    var dp = data[i - 1];
                    opt.value = String(Number(dp.id));
                    opt.text = dp.name;
                    dischargePlannerFilter.options.add(opt);
                }
            }

			// If there are no discharge planners, hide the discharge planner filters.
			if(!this.dpDefined){
				$("#dpRelationshipFilterDiv").hide();
				$("#dpFilterDiv").hide();
				$("#dpPrimSort").remove();
				$("#dpSecSort").remove();
				$("#dischargePlannerCheckBoxandlabel").hide();
			}

			// The Discharge Planner filter should only be enabled if 'ASSIGNED' is selected in the DP Relationship filter.
			if(!($("#dpRelationshipDropbox option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
					$("#dpFilter").prop("disabled", true);
			}
			else{
				$("#dpFilter").prop("disabled", false);
			}

			$("#dpRelationshipDropbox").change(function(){
				if($("#dpRelationshipDropbox option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED){
					$("#dpFilter").prop("disabled", false);
				}
				else{
					$("#dpFilter").prop("disabled", true);
					$("#dpFilter").val("empty");
				}
			});
			$("#dpFilter").val(this.applied);
        },

        getSelectedDischargePlanner: function(flag){
			if(flag){
				if(this.selectedPatientListJson.dpID === "empty"){
					option = new RCM_Option("", "");
				}else{
					option = new RCM_Option(String(Number(this.selectedPatientListJson.dpID)), "");
				}
				return option;
			}else{
				var dischargePlannerElement = document.getElementById('dpFilter');

				if (dischargePlannerElement) {
					var dischargePlannerFilter = dischargePlannerElement.options[dischargePlannerElement.selectedIndex];

					var option;
					if (dischargePlannerFilter.value === "empty") {
						option = new RCM_Option("", "");
					}
					else {
						option = new RCM_Option(dischargePlannerFilter.value, dischargePlannerFilter.text);
					}
					return option;
				}
			}
        },

		dsRelationshipFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='dsRelationshipFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='dsRelationshipFilterDropDown'>", rcm_assignment_worklist_i18n.ASWL_DS_RELATIONSHIP, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='dsRelationshipDropbox' name='dsRelationshipFilterDropDown'>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,"' selected='selected'>", rcm_assignment_worklist_i18n.ASWL_ALL, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_ASSIGNED, "</option>");
            filterHTML.push("<option value='",rcm_assignment_worklist_i18n.ASWL_VALUE_UNASSIGNED,"'>", rcm_assignment_worklist_i18n.ASWL_UNASSIGNED, "</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var dsRelationshipHTML = filterHTML.join("");
            return dsRelationshipHTML;
        },

        getSelectedDSRelationship: function(flag){
			if(flag){
			    var option = new RCM_Option(this.selectedPatientListJson.drRel, "");
	            return option;
			}else{
	            var dsRelationshipFilterElement = document.getElementById('dsRelationshipDropbox');

	            if (dsRelationshipFilterElement) {
	                var dsRelationshipFilter = dsRelationshipFilterElement.options[dsRelationshipFilterElement.selectedIndex];
	                var option = new RCM_Option(dsRelationshipFilter.value, dsRelationshipFilter.text);

	                return option;
	            }
			}
        },

		documentationSpecialistFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div id='dsFilterDiv' class='aswl-filter'>");
            filterHTML.push("<label for='dsFilter'>", rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, "</label>");
            filterHTML.push("<select class='aswl-filterDropdown' id='dsFilter' name='dsFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var dsHTML = filterHTML.join("");
            return dsHTML;
        },

        populateDocumentationSpecialistFilter: function(data){
            var documentationSpecialistFilter = document.getElementById('dsFilter');
            documentationSpecialistFilter.options.length = 0;
            var i;
            var length = data.length;
            for (i = 0; i < length + 1; i++) {
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "empty";
                    opt.text = "--";
                    documentationSpecialistFilter.options.add(opt);
                }
                else {
                    var ds = data[i - 1];
                    opt.value = String(Number(ds.id));
                    opt.text = ds.name;
                    documentationSpecialistFilter.options.add(opt);
                }
            }

			// If there are no care managers, hide the care manager filters.
			if(!this.dsDefined){
				$("#dsRelationshipFilterDiv").hide();
				$("#dsFilterDiv").hide();
				$("#dsPrimSort").remove();
				$("#dsSecSort").remove();
				$("#DocSpecialistCheckBox").hide();
			}

			// The Care Manager filter should only be enabled if 'ASSIGNED' is selected in the CM Relationship filter.
			if(!($("#dsRelationshipFilterDiv option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED)){
					$("#dsFilter").prop("disabled", true);
			}
			else{
				$("#dsFilter").prop("disabled", false);
			}

			$("#dsRelationshipFilterDiv").change(function(){
				if($("#dsRelationshipFilterDiv option:selected").prop('value') === rcm_assignment_worklist_i18n.ASWL_VALUE_ASSIGNED){
					$("#dsFilter").prop("disabled", false);
				}
				else{
					$("#dsFilter").prop("disabled", true);
					$("#dsFilter").val("empty");
				}
			});
        },

        getSelectedDocumentationSpecialist: function(flag){
			if(flag){
				if(this.selectedPatientListJson.drID === "empty"){
					option = new RCM_Option("", "");
				}else{
					option = new RCM_Option(String(Number(this.selectedPatientListJson.drID)), "");
				}
                return option;
			}else{
				var documentationSpecialistElement = document.getElementById('dsFilter');

				if (documentationSpecialistElement) {
					var documentationSpecialistFilter = documentationSpecialistElement.options[documentationSpecialistElement.selectedIndex];

					var option;
					if (documentationSpecialistFilter.value === "empty") {
						option = new RCM_Option("", "");
					}
					else {
						option = new RCM_Option(documentationSpecialistFilter.value, documentationSpecialistFilter.text);
					}
					return option;
				}
			}
        },

        primarySort: function(){
            var sortHTML = [];
            var sortPrimaryHTMLString = "";
            sortHTML.push("<div class='aswl-filter-sorting-dropdown'>");
            sortHTML.push("<label class='aswl-filter-prmySortLabel' for='primarySort'>", rcm_assignment_worklist_i18n.ASWL_PRIMARY_SORT, "</label>");
            sortHTML.push("<select class='aswl-filter-dropdown' id='primarySort' name='primarySort' onchange='RCM_ASWL_Filters.primarySortListener()'>");
            sortHTML.push("<option id='cmPrimSort' value='FirstCareManager'>", rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, "</option>");
            sortHTML.push("<option id='dpPrimSort' value='FirstDischargePlanner'>", rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, "</option>");
			sortHTML.push("<option id='dsPrimSort' value='FirstDocSpecialist'>", rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, "</option>");
            sortHTML.push("<option value='EncounterType'>", rcm_assignment_worklist_i18n.ASWL_ENCOUNTER_TYPE, "</option>");
            sortHTML.push("<option value='FinancialClass'>", rcm_assignment_worklist_i18n.ASWL_FINANCIAL_CLASS, "</option>");
            sortHTML.push("<option id='nurseUnitPrimSort' selected='true' value='Location'>", rcm_assignment_worklist_i18n.ASWL_NURSE_UNIT, "</option>");
			sortHTML.push("<option value='locationExtended'>", rcm_assignment_worklist_i18n.ASWL_NURSE_UNIT_ROOM_BED, "</option>");
            sortHTML.push("<option value='PatientName'>", rcm_assignment_worklist_i18n.ASWL_PATIENT_NAME, "</option>");
            sortHTML.push("<option value='PayerName'>", rcm_assignment_worklist_i18n.ASWL_PAYER, "</option>");
            sortHTML.push("</select>");
            sortHTML.push("<input checked type='radio' id='ascendingPrimary' name='primarySortDirection' value='ascendingPrimary'/>");
            sortHTML.push("<label>", rcm_assignment_worklist_i18n.ASWL_ASCENDING, "</label>");
            sortHTML.push("<input type='radio' id='descendingPrimary' name='primarySortDirection' value='descendingPrimary'/>");
            sortHTML.push("<label>", rcm_assignment_worklist_i18n.ASWL_DESCENDING, "</label>");
            sortHTML.push("</div>");
            sortPrimaryHTMLString = sortHTML.join("");
            return sortPrimaryHTMLString;
        },

        secondarySort: function(){
            var sortHTML = [];
            var sortSecondaryHTMLString = "";
            sortHTML.push("<div class='aswl-filter-sorting-dropdown'>");
            sortHTML.push("<label for='secondarySort'>", rcm_assignment_worklist_i18n.ASWL_SECONDARY_SORT, "</label>");
            sortHTML.push("<select class='aswl-filter-dropdown' id='secondarySort' name='secondarySort' onchange='RCM_ASWL_Filters.secondarySortListener()'>");
            sortHTML.push("<option id='emptySecSort' value='empty'>--</option>");
            sortHTML.push("<option id='cmSecSort' value='FirstCareManager'>", rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, "</option>");
            sortHTML.push("<option id='dpSecSort' value='FirstDischargePlanner'>", rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, "</option>");
			sortHTML.push("<option id='dsSecSort' value='FirstDocSpecialist'>", rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, "</option>");
            sortHTML.push("<option value='EncounterType'>", rcm_assignment_worklist_i18n.ASWL_ENCOUNTER_TYPE, "</option>");
            sortHTML.push("<option value='FinancialClass'>", rcm_assignment_worklist_i18n.ASWL_FINANCIAL_CLASS, "</option>");
            sortHTML.push("<option value='locationExtended'>", rcm_assignment_worklist_i18n.ASWL_NURSE_UNIT_ROOM_BED, "</option>");
            sortHTML.push("<option value='PatientName'>", rcm_assignment_worklist_i18n.ASWL_PATIENT_NAME, "</option>");
            sortHTML.push("<option value='PayerName'>", rcm_assignment_worklist_i18n.ASWL_PAYER, "</option>");
            sortHTML.push("</select>");
            sortHTML.push("<input checked type='radio' id='ascendingSecondary' name='secondarySortDirection' value='ascendingSecondary'/>");
            sortHTML.push("<label for='ascendingSecondary'>", rcm_assignment_worklist_i18n.ASWL_ASCENDING, "</label>");
            sortHTML.push("<input type='radio' id='descendingSecondary' name='secondarySortDirection' value='descendingSecondary'/>");
            sortHTML.push("<label for='descendingSecondary'>", rcm_assignment_worklist_i18n.ASWL_DESCENDING, "</label>");
            sortHTML.push("</div>");
            sortSecondaryHTMLString = sortHTML.join("");
            return sortSecondaryHTMLString;
        },

        setSecondarySort: function(value){
        	if(!value || value === ""){
        		$("#secondarySort").val('empty');
        	}
        	else{
		    	$("#secondarySort option").each(function(i){
		    		if($(this).val().toUpperCase() === value.toUpperCase()){
		    			$(this).prop("selected", true);
		    			return false;
		    		}
		    	});
		    }
        	this.appliedFilters.secondarySort = $("#secondarySort").val();
        },

		/**
		 * secondary sort drop down listener.
		 */
        secondarySortListener : function() {
        	this.secondarySortChanged = 1;
		},

		primarySortListener : function() {
        	this.primarySortChanged = 1;
		},

		resizeFilterBox: function(){
			$("#filterBox-scrollable-content").css("height", "auto");
			$("#filterBox-scrollable-content").css("height-max", 500);
			$("#filterBox-scrollable-content").css("width", 500);
			$("#filterBox").css("width", 500);
			$("#filterBox-scrollable-content").css("overflow-y", "hidden");
			$("#filterBox-scrollable-content").css("overflow-x", "hidden");
			var htmlHeight = document.documentElement.clientHeight;
			var htmlWidth = document.documentElement.clientWidth;
			if(htmlWidth <500){
				$("#filterBox-scrollable-content").css("overflow-x", "scroll");
				$("#filterBox-scrollable-content").css("width", (htmlWidth -15));
				$("#filterBox").css("width", (htmlWidth-15));
			}

			var filterBoxHeight = $("#filterBox").height();
			if((filterBoxHeight + 72) > htmlHeight){
				$("#filterBox-scrollable-content").css("height", (htmlHeight - 167));
				$("#filterBox-scrollable-content").css("overflow-y", "scroll");
			}
		},

		/**
		 * Finish rendering all the UI and notify filter listener to make service call.
		 */
        finishRender: function(){
        	this.populatePatientListFilter();
			this.setDefaultAppliedFilters();
            this.notifyFiltersListeners();
			this.handleRelationshipShowCheckboxes();
        },

		/**
		 * Add resize event to window to change filter dialog size.
		 */
		addResizeForFilters: function(){
			$(window).resize(function(){
				RCM_ASWL_Filters.resizeendDate= new Date();
				if (RCM_ASWL_Filters.resizeendTimeout  === false){
					RCM_ASWL_Filters.resizeendTimeout  = true;
					setTimeout(RCM_ASWL_Filters.resizeend, RCM_ASWL_Filters.resizeendDelta);
				}
			});
		},

		resizeend:function(){
			if (new Date() - RCM_ASWL_Filters.resizeendDate < RCM_ASWL_Filters.resizeendDelta){
				setTimeout(RCM_ASWL_Filters.resizeend, RCM_ASWL_Filters.resizeendDelta);
			}
		else{
				RCM_ASWL_Filters.resizeendTimeout = false;
				//sets the height to the height of the breadcrumbs and adds 18 (1.5em) to account for the margin
				$("#patientCount").height($("#appliedFilters").height() + 18);
				$("#patientListCountDiv").height($("#patientCount").height());

				if($("#filterBox").css('display')=== "inline"){
					RCM_ASWL_Filters.resizeFilterBox();
				}
			}
		},

        setComponent: function(component){
            this.component = component;
        },

        openListMaintenance: function(){
            var maintenanceObj = window.external.DiscernObjectFactory("PMLISTMAINTENANCE");
            $("#listBlockingDiv").show();
            if (maintenanceObj.OpenListMaintenanceDialog() === 0){
                $("#listBlockingDiv").hide();
                return;
            }
            $("#listBlockingDiv").hide();
            this.filtersListeners = [];
            this.appliedFilters = null;
            this.component.initialize();
        },

        getDefaultPatientList: function(patientLists) {
            if(!patientLists || !patientLists.length) {
                return null;
            }

            var match = document.cookie.match(/rcm_aswl_pl=([^;]+)(;|\b|$)/);
            if (match && match[1]) {
                var patientListId = match[1];
                for(var i = 0; i < patientLists.length; i++) {
                    if(patientListId === patientLists[i].id) {
                        return patientLists[i];
                    }
                }
            }

            return patientLists[0];
        }
    };
}();
