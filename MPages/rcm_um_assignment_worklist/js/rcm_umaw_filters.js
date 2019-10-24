var RCM_UMAW_Filters = {

    payerData: [],

    setDefaultData: function() {
        if (!umaw.selectedPatientList.workListDefaults) {

            umaw.selectedPatientList.workListDefaults = {
                "patientListName": umaw.selectedPatientList.patientList.name,
                "encounterTypeCds": [],
                "payers": [],
                "careManagerRelationship": "ALL",
                "careManagerId": 0,
                "primarySortColumn": "NEXT_CLINICAL_REVIEW_DATE",
                "isPrimaryDescendingSort": false,
                "secondarySortColumn": "FIRST_CARE_MANAGER",
                "isSecondaryDescendingSort": false,
                "financialClassCds": [],
                "nextClinicalReviewDateRange": 0,
                "UMStatusCd": 0,
                "authStatusCd": 0,
                "isClosedUMReviews": false,
                "isClosedClinicalReviews": false
            };
        }
    },

    pullFilterDataFromFilterBox: function() {

        umaw.selectedPatientList.workListDefaults = {
            "patientListName": umaw.selectedPatientList.patientList.name,
            "encounterTypeCds": RCM_UMAW_Filters.getSelectedValues("encounterTypeFilter"),
            "payers": RCM_UMAW_Filters.payerData,
            "careManagerRelationship": $("#relationshipDropbox").val(),
            "careManagerId": $("#careManagerFilterDropbox").val(),
            "primarySortColumn": $("#primarySort").val(),
            "isPrimaryDescendingSort": $("#descendingPrimary").prop("checked") ? true : false,
            "secondarySortColumn": $("#secondarySort").val(),
            "isSecondaryDescendingSort": $("#descendingSecondary").prop("checked") ? true : false,
            "financialClassCds": RCM_UMAW_Filters.getSelectedValues("finClassFilter"),
            "nextClinicalReviewDateRange": $("#clinicalDateDropbox").val(),
            "UMStatusCd": $("#umStatusDropbox").val(),
            "authStatusCd": $("#authStatusDropbox").val(),
            "isClosedUMReviews": $("#umStatusCheckbox").prop("checked"),
            "isClosedClinicalReviews": $("#reviewCheckbox").prop("checked")
        };
    },

    getPayerFilterIds: function() {
        var ids = [];
        if (umaw.selectedPatientList.workListDefaults.payers) {
            for (var i = 0; i < umaw.selectedPatientList.workListDefaults.payers.length; i++) {
                ids.push(Number(umaw.selectedPatientList.workListDefaults.payers[i].payerId));
            }
        }
        return ids;
    },

    toggleFilters: function() {
        $(".filter-title-bar").toggle();
        if ($("#filterBox").is(":visible")) {
            RCM_UMAW_Filters.cancelFilters();
        } else {
            $("#filterBox").show();
        }
    },

    cancelFilters: function() {
        RCM_UMAW_Filters.setDefaults();
        $("#filterBox").hide();
        $(".filter-title-bar").hide();
        $("#filterBox-scrollable-content").scrollTop(0);
    },

    acceptFilters: function() {
        RCM_UMAW_Filters.pullFilterDataFromFilterBox();
        if ($("#saveConfigurationCheckbox").prop("checked")) {
            UMAssignmentWorklistDelegate.saveFilters();
        }
        $("#filterBox").hide();
        $(".filter-title-bar").hide();
        umaw.reloadPatientList();
        $("#filterBox-scrollable-content").scrollTop(0);
    },

    loadFilterBox: function() {

        if (umaw.worklistData.availableFilterData) {
            RCM_UMAW_Filters.loadSelectValues(umaw.worklistData.availableFilterData.encounterTypes, "encounterTypeFilter");
            RCM_UMAW_Filters.loadSelectValues(umaw.worklistData.availableFilterData.financialClasses, "finClassFilter");
            RCM_UMAW_Filters.loadSelectValues(umaw.worklistData.availableFilterData.careManagers, "careManagerFilterDropbox");
            RCM_UMAW_Filters.loadSelectValues(umaw.worklistData.availableFilterData.authStatuses, "authStatusDropbox");
            RCM_UMAW_Filters.loadSelectValues(umaw.worklistData.availableFilterData.UMStatuses, "umStatusDropbox");
        }

        $("#filterPatientListLabel").text(umaw.selectedPatientList.patientList.name + " ");
        RCM_UMAW_Filters.setDefaults();
        umaw.updatePatientCountforAssignButton();
    },

    handleUMStatusDropbox: function() {
        if ($("#umStatusDropbox").val() > 0) {
            document.getElementById("umStatusCheckbox").checked = false;
            $("#umStatusCheckbox").prop("disabled", true);
            $("#umStatusCheckboxLabel").addClass("filter-disabled-text");
        } else {
            $("#umStatusCheckbox").prop("disabled", false);
            $("#umStatusCheckboxLabel").removeClass("filter-disabled-text");
        }
    },

    setupEvents: function() {
        RCM_UMAW_Filters.setPayerFilterSearch();

        $("#umStatusDropbox").change(function() {
            if ($("#umStatusDropbox").val() > 0) {
                $("#umStatusCheckbox").prop("checked", false).prop("disabled", true);
                $("#umStatusCheckboxLabel").addClass("filter-disabled-text");
            } else {
                $("#umStatusCheckbox").prop("disabled", false);
                $("#umStatusCheckboxLabel").removeClass("filter-disabled-text");
            }
        });

        $("#payerFilterTable").on('mouseover mouseout', ".payerFilterRowDisp", function() {
            RCM_UMAW_Filters.toggleX(this);
        });
        $("#payerFilterTable").on('mouseover mouseout', ".worklist-X-float-right", function() {
            RCM_UMAW_Filters.switchXToOtherXImage(this);
        });
    },

    setDefaults: function() {
        RCM_UMAW_Filters.clearFilterBoxValues();

        if (umaw.selectedPatientList.workListDefaults.careManagerId) {
            $("#careManagerFilterDropbox").val(umaw.selectedPatientList.workListDefaults.careManagerId);
        }

        if (umaw.selectedPatientList.workListDefaults.authStatusCd) {
            $("#authStatusDropbox").val(umaw.selectedPatientList.workListDefaults.authStatusCd);
        }

        if (umaw.selectedPatientList.workListDefaults.UMStatusCd) {
            $("#umStatusDropbox").val(umaw.selectedPatientList.workListDefaults.UMStatusCd);
        }

        if (umaw.selectedPatientList.workListDefaults.nextClinicalReviewDateRange >= 0) {
            $("#clinicalDateDropbox").val(umaw.selectedPatientList.workListDefaults.nextClinicalReviewDateRange);
        }

        if (umaw.selectedPatientList.workListDefaults.careManagerRelationship) {
            $("#relationshipDropbox").val(umaw.selectedPatientList.workListDefaults.careManagerRelationship);
        }

        if (umaw.selectedPatientList.workListDefaults.primarySortColumn) {
            $("#primarySort").val(umaw.selectedPatientList.workListDefaults.primarySortColumn);
        }

        if (umaw.selectedPatientList.workListDefaults.secondarySortColumn) {
            $("#secondarySort").val(umaw.selectedPatientList.workListDefaults.secondarySortColumn);
        }

        if (umaw.selectedPatientList.workListDefaults.encounterTypeCds) {
            for (var i = 0; i < umaw.selectedPatientList.workListDefaults.encounterTypeCds.length; i++) {
                $("#encounterTypeFilter option[value='" + umaw.selectedPatientList.workListDefaults.encounterTypeCds[i] + "']").prop("selected", true);
            }
        }

        if (umaw.selectedPatientList.workListDefaults.financialClassCds) {
            for (var i = 0; i < umaw.selectedPatientList.workListDefaults.financialClassCds.length; i++) {
                $("#finClassFilter option[value='" + umaw.selectedPatientList.workListDefaults.financialClassCds[i] + "']").prop("selected", true);
            }
        }

        if (umaw.selectedPatientList.workListDefaults.payers) {
            for (var x = 0; x < umaw.selectedPatientList.workListDefaults.payers.length; x++) {
                RCM_UMAW_Filters.addRowToPayerFilterTable(umaw.selectedPatientList.workListDefaults.payers[x].payerId, umaw.selectedPatientList.workListDefaults.payers[x].payerName);
            }
        }

        document.getElementById("umStatusCheckbox").checked = umaw.selectedPatientList.workListDefaults.isClosedUMReviews;
        document.getElementById("reviewCheckbox").checked = umaw.selectedPatientList.workListDefaults.isClosedClinicalReviews;

        if (umaw.selectedPatientList.workListDefaults.isPrimaryDescendingSort) {
            document.getElementById("ascendingPrimary").checked = false;
            document.getElementById("descendingPrimary").checked = true;
        } else {
            document.getElementById("ascendingPrimary").checked = true;
            document.getElementById("descendingPrimary").checked = false;
        }

        if (umaw.selectedPatientList.workListDefaults.isSecondaryDescendingSort) {
            document.getElementById("descendingSecondary").checked = true;
            document.getElementById("ascendingSecondary").checked = false;
        } else {
            document.getElementById("descendingSecondary").checked = false;
            document.getElementById("ascendingSecondary").checked = true;
        }

        RCM_UMAW_Filters.relationshipSelectPersonnelToggle();
        RCM_UMAW_Filters.handleUMStatusDropbox();
        RCM_UMAW_Filters.setAppliedFiltersString();
    },

    clearFilterBoxValues: function() {
        //clears out selects
        $("#encounterTypeFilter :selected").prop("selected", false);
        $("#finClassFilter :selected").prop("selected", false);
        $("#careManagerFilterDropbox").val(0);
        $("#authStatusDropbox").val(0);
        $("#umStatusDropbox").val(0);
        document.getElementById("saveConfigurationCheckbox").checked = false;
        document.getElementById("reviewCheckbox").checked = false;
        document.getElementById("umStatusCheckbox").checked = false;
        $("#payerFilterTable > tbody").empty();
        RCM_UMAW_Filters.payerData = [];
        RCM_UMAW_Filters.handleUMStatusDropbox();
    },

    relationshipSelectPersonnelToggle: function() {
        if ($("#relationshipDropbox").val() === "ALL" || $("#relationshipDropbox").val() === "UNASSIGNED") {
            $("#careManagerFilterDropbox").val(0).prop("disabled", true);
        } else {
            $("#careManagerFilterDropbox").prop("disabled", false);
        }
    },

    getSelectedValues: function(id) {
        var elements = document.getElementById(id).options;
        var values = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].selected && elements[i].value != 0)
                values.push(elements[i].value);
        }
        return values;
    },

    getSelectedStrings: function(id) {
        var elements = document.getElementById(id).options;
        var text = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].selected)
                text.push(elements[i].text);
        }
        return text;
    },

    loadSelectValues: function(objects, id) {
        var selectID = document.getElementById(id);
        selectID.options.length = 0;
        var option = document.createElement("option");
        option.value = 0;
        option.text = "--";
        selectID.options.add(option);

        if (objects && objects.length > 0) {
            for (var i = 0, len = objects.length; i < len; i++) {
                var object = objects[i];
                var option = document.createElement("option");
                option.value = objects[i].id;
                option.text = objects[i].name;
                selectID.options.add(option);
            }
        }
    },

    createOption: function(listName, optionText, optionValue, optionId, index) {
        var sortSelectionList = document.getElementById(listName);
        var newOption = document.createElement("option");
        newOption.text = optionText;
        newOption.value = optionValue;
        newOption.id = optionId;
        sortSelectionList.add(newOption, index);
    },

    loadi18nValues: function() {

        //Filter Box Values
        $("#encouterTypeLabel").text(i18n.UMAW_ENCOUNTER_TYPE_LONG);
        $("#filterSettingsLabel").text(i18n.UMAW_FILTER_SETTINGS);
        $("#finClassLabel").text(i18n.UMAW_FIN_CLASS_PRIMARY_INS);
        $("#filterPayerPrimaryLabel").text(i18n.UMAW_PAYER_PRIMARY);
        $("#careMgrRelationshipLabel").text(i18n.UMAW_CARE_MANAGER_RELATIONSHIP);
        $("#filterCareManagerLabel").text(i18n.UMAW_CARE_MANAGER_FILTER);
        $("#filterNextClinicalReviewLabel").text(i18n.UMAW_NEXT_CLINICAL_REVIEW_LONG);
        $("#filterUMStatusLabel").text(i18n.UMAW_UM_STATUS);
        $("#filterAuthStatusLabel").text(i18n.UMAW_AUTH_STATUS);
        $("#filterCheckboxHeaderLabel").text(i18n.UMAW_INCLUDE_PATIENTS_WITH);
        $("#umStatusCheckboxLabel").text(i18n.UMAW_CLOSED_UM_REVIEWS);
        $("#reviewCheckboxLabel").text(i18n.UMAW_NO_NEXT_CLINICAL_REVIEW);
        $("#filterSortingLabel").text(i18n.UMAW_SORTING);
        $("#filterPrimaryLabel").text(i18n.UMAW_PRIMARY_SORT);
        $("#filterPrimarySortAscending").text(i18n.UMAW_ASCENDING);
        $("#filterPrimarySortDescending").text(i18n.UMAW_DESCENDING);
        $("#filterSecondaryLabel").text(i18n.UMAW_SECONDARY_SORT);
        $("#filterSecondarySortAscending").text(i18n.UMAW_ASCENDING);
        $("#filterSecondarySortDescending").text(i18n.UMAW_DESCENDING);
        $("#filterSaveConfigurationLabel").text(i18n.UMAW_SAVE_CONFIGURATION);
        $("#filterApplyBtnLabel").text(i18n.UMAW_APPLY);
        $("#filterCancelBtnLabel").text(i18n.UMAW_CANCEL);

        //Relationship Values
        $("#realtionshipSelectAssigned").text(i18n.UMAW_ASSIGNED);
        $("#realtionshipSelectUnassigned").text(i18n.UMAW_UNASSIGNED);
        $("#realtionshipSelectAll").text(i18n.UMAW_ALL);

        //Next Clinical Review Values
        $("#filterClinicalDateToday").text(i18n.UMAW_UP_TO_TODAY);
        $("#filterClinicalDateTomorrow").text(i18n.UMAW_UP_TO_TOMORROW);
        $("#filterClinicalDateTwo").text(i18n.UMAW_UP_TO_TWO);
        $("#filterClinicalDateThree").text(i18n.UMAW_UP_TO_THREE);
        $("#filterClinicalDateFour").text(i18n.UMAW_UP_TO_FOUR);
        $("#filterClinicalDateFive").text(i18n.UMAW_UP_TO_FIVE);
        $("#filterClinicalDateSix").text(i18n.UMAW_UP_TO_SIX);
        $("#filterClinicalDateSeven").text(i18n.UMAW_UP_TO_SEVEN);
        $("#filterClinicalDateAll").text(i18n.UMAW_ALL_FUTURE_REVIEWS);

        //Sorting values
        $(".filterSortCareManager").text(i18n.UMAW_CARE_MANAGER);
        $(".filterSortEncounterType").text(i18n.UMAW_ENCOUNTER_TYPE);
        $(".filterSortFINClass").text(i18n.UMAW_FINANCIAL_CLASS_SHORT);
        $(".filterSortGender").text(i18n.UMAW_GENDER);
        $(".filterSortNextClinicalReview").text(i18n.UMAW_NEXT_CLINICAL_REVIEW);
        $(".filterSortLocation").text(i18n.UMAW_NURSE_UNIT);
        $(".filterSortExtendedLocation").text(i18n.UMAW_NURSE_UNIT_ROOM_BED);
        $(".filterSortAge").text(i18n.UMAW_PATIENT_AGE);
        $(".filterSortPatientName").text(i18n.UMAW_PATIENT_NAME);
        $(".filterSortPayerName").text(i18n.UMAW_PAYER);
        $(".filterSortUMStatus").text(i18n.UMAW_UTILIZATION_MANAGEMENT_STATUS);
        $(".filterSortLastClinicalReview").text(i18n.UMAW_LAST_CLINICAL_REVIEW);
        $(".filterSortHealthPlanName").text(i18n.UMAW_HEALTH_PLAN_NAME);
        $(".filterSortAuthSatus").text(i18n.UMAW_AUTH_STATUS_SORT);
        $(".filterSortAuthEndDate").text(i18n.UMAW_AUTH_END_DATE);

    },

    /**
     * Create the applied filters information.
     */
    setAppliedFiltersString: function() {
        var filtersString = "";

        var breadCrumbsEncounterTypes = RCM_UMAW_Filters.getSelectedStrings("encounterTypeFilter");
        if (breadCrumbsEncounterTypes && breadCrumbsEncounterTypes.length > 0) {
            for (var i = 0; i < breadCrumbsEncounterTypes.length; i++) {
                filtersString += breadCrumbsEncounterTypes[i];
                filtersString += ", ";
            }
            var tempString = filtersString.substring(0, filtersString.length - 2);
            filtersString = tempString;
        }

        var breadCrumbsFinClass = RCM_UMAW_Filters.getSelectedStrings("finClassFilter");
        if (breadCrumbsFinClass && breadCrumbsFinClass.length > 0) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            var filtersArr = [];
            for (var i = 0; i < breadCrumbsFinClass.length; i++) {
                filtersArr.push(breadCrumbsFinClass[i]);
                filtersArr.push(", ");
            }
            // Remove last comma
            filtersArr.pop();
            filtersString += filtersArr.join("");
        }

        if (RCM_UMAW_Filters.payerData && RCM_UMAW_Filters.payerData.length > 0) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            var filtersArr = [];
            for (var i = 0; i < RCM_UMAW_Filters.payerData.length; i++) {
                filtersArr.push(RCM_UMAW_Filters.payerData[i].payerName);
                filtersArr.push(", ");
            }
            // Remove last comma
            filtersArr.pop();
            filtersString += filtersArr.join("");
        }

        if ($("#relationshipDropbox").text()) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            if ($("#relationshipDropbox option:selected").val() == "ASSIGNED" && $("#careManagerFilterDropbox option:selected").val() != 0) {
                filtersString += i18n.UMAW_CARE_MANAGER_FILTER + $("#careManagerFilterDropbox option:selected").text();
            } else {
                filtersString += $("#relationshipDropbox option:selected").text();
            }
        }

        if ($("#clinicalDateDropbox").val()) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            filtersString += $("#clinicalDateDropbox option:selected").text();
        }

        if ($("#umStatusDropbox").val() != 0) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            filtersString += $("#umStatusDropbox option:selected").text();
        }

        if ($("#authStatusDropbox").val() != 0) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            filtersString += $("#authStatusDropbox option:selected").text();
        }

        if ($("#umStatusCheckbox").prop("checked")) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            filtersString += i18n.UMAW_DISPLAY_INCLUDE_CLOSED_REVIEWS;
        }

        if ($("#reviewCheckbox").prop("checked")) {
            if (filtersString.length > 0) {
                filtersString += " | ";
            }
            filtersString += i18n.UMAW_DISPLAY_INCLUDE_NO_NEXT_REVIEW_DATE;
        }
        $("#filterLabel").text(filtersString);
    },

    uncheckOtherRadioButtons: function(radioSelected) {
        if (radioSelected.id === "ascendingPrimary") {
            document.getElementById("descendingPrimary").checked = false;
        }
        if (radioSelected.id === "descendingPrimary") {
            document.getElementById("ascendingPrimary").checked = false;
        }
        if (radioSelected.id === "ascendingSecondary") {
            document.getElementById("descendingSecondary").checked = false;
        }
        if (radioSelected.id === "descendingSecondary") {
            document.getElementById("ascendingSecondary").checked = false;
        }
    },

    toggleX: function(name) {
        $(name).toggleClass("worklist-manager-name-hover");
        var $hoverRemoveX = $(name).find(".worklist-X-float-right");
        if ($hoverRemoveX.css("visibility") === "hidden") {
            $hoverRemoveX.css("visibility", "visible");
        } else {
            $hoverRemoveX.css("visibility", "hidden");
        }

    },

    /**
     * Switches X hover into other image
     */
    switchXToOtherXImage: function(name) {
        $(name).toggleClass("worklist-remove-x");
        $(name).toggleClass("worklist-hover-over-remove-x");
    },

    addRowToPayerFilterTable: function(newPayerIdToBeAdded, newPayerNameToBeAdded) {
        var newPayerEntry = {
            "payerId": newPayerIdToBeAdded,
            "payerName": newPayerNameToBeAdded
        };

        var isAlreadyInList = false;
        for (var i = 0; i < RCM_UMAW_Filters.payerData.length; i++) {
            if (Number(RCM_UMAW_Filters.payerData[i].payerId) === Number(newPayerEntry.payerId)) {
                isAlreadyInList = true;
                break;
            }
        }
        if (!isAlreadyInList) {
            RCM_UMAW_Filters.payerData.unshift(newPayerEntry);
            //Add new payer row to table
            $("#payerFilterTable > tbody").append($("#payerRowTmpl").render(newPayerEntry));
        }
    },

    setPayerFilterSearch: function() {
        var orgSearchControl = new OrgSearchControl(document.getElementById("payerFilter"));
        var payerSearchControlListener = function() {
            var newPayerIdToBeAdded = String(orgSearchControl.getSelectedOrgId());
            var newPayerNameToBeAdded = $("#payerFilter").val();
            if (newPayerIdToBeAdded !== "") {
                RCM_UMAW_Filters.addRowToPayerFilterTable(newPayerIdToBeAdded, newPayerNameToBeAdded);
                //Reset orgSearchControl
                orgSearchControl.setSelectedOrg("", "");
            }
        };
        orgSearchControl.setOrgType("INSCO");
        orgSearchControl.addVerifyStateChangeListener(payerSearchControlListener);
    },

    removeRowFromPayerFilterTable: function(name) {
        var payerIdToRemove = $(name).closest("tr").attr("id");
        payerIdToRemove = Number(payerIdToRemove);
        for (var i = 0; i < RCM_UMAW_Filters.payerData.length; i++) {
            if (Number(RCM_UMAW_Filters.payerData[i].payerId) === payerIdToRemove) {
                RCM_UMAW_Filters.payerData.splice(i, 1);
                break;
            }
        }
        $(name).closest("tr").remove();
    }
};
