var RCM_Filters = function(criterion){

    function EncounterType(code){
        this.encounterTypeCd = code;
    }

    function FinancialClassFilter(code) {
        this.finClassCd = code;
    }

    function PayerFilter(id) {
        this.payerId = id;
    }

    return {
        "filtersListeners": [],
        "encounterTypes": [],
        "resizeendDate": null,
        "resizeTimeout": false,
        "resizeendDelta":20,
        "payerFilters": [],
        "dropdownOptions": [],

        addFiltersListener: function(listener){
            if (listener) {
                this.filtersListeners.push(listener);
            }
        },

        notifyFiltersListeners: function(){
            for (var listener = 0, length = this.filtersListeners.length; listener < length; listener++) {
                this.filtersListeners[listener]();
            }
        },

        getAppliedFilters: function(){
            return this.appliedFilters;
        },

        /**
         * Create filter div.
         */
        initialize: function(criterion){
            this.criterion = criterion;
            this.resizeendDate = new Date(1, 1, 2000, 12,00,00);
            this.resizeendTimeout = false;
            this.filterHTMLArray = [];

            this.addFiltersListener(function(){
                RCM_Filters.displayAppliedFilters();
            });
            this.filterHTMLArray.push("<div id='filters' class='filtersDivClass'>");
            this.filterHTMLArray.push("<div id='patientListAndImageDiv' class='filters'>");
            // get the patient lists
            var patientListString = this.patientListFilter();

            this.filterHTMLArray.push(patientListString);
            // create filter view
            if (this.jsonData && this.jsonData.PATIENTLIST && this.jsonData.PATIENTLIST.length > 0) {
                this.createFilters();
                this.filterHTMLArray.push("</div>");
                this.populateFilters();
                this.setPayerFilterSearch();
                this.setDefaultFilters();
                this.setAppliedFilters();
                this.filterHTMLArray.push("<div id='patientCount' class='appliedFiltersPatientCount'></div>");
                this.filterHTMLArray.push("<div id='appliedFilters' class='appliedFilters'></div>");
                this.filterHTMLArray.push("</div>");
                this.defaultsChanged = false;
            }
            else
            {
                this.filterHTMLArray.push("</div>");
            }
        },

        /**
         * Create the applied filters information.
         */
        createAppliedFiltersString: function(){
            var filters = this.getAppliedFilters();
            var filtersString="";

            if (filters.encounterTypes && filters.encounterTypes.length > 0){
                for (var i = 0; i < filters.encounterTypes.length; i++){
                    if(filters.encounterTypes[i].value !== "empty"){
                        filtersString+=filters.encounterTypes[i].display;
                        filtersString+=", ";
                    }
                }
                var tempString = filtersString.substring(0, filtersString.length-2);
                filtersString = tempString;
            }

            if (filters.financialClasses && filters.financialClasses.length > 0) {
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                var filtersArr = [];
                for (var i = 0; i < filters.financialClasses.length; i++) {
                    if (filters.financialClasses[i].value !== "empty") {
                        filtersArr.push(filters.financialClasses[i].display);
                        filtersArr.push(", ");
                    }
                }
                // Remove last comma
                filtersArr.pop();
                filtersString += filtersArr.join("");
            }

            if (filters.payers && filters.payers.length > 0) {
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                var filtersArr = [];
                for (var i = 0; i < filters.payers.length; i++) {
                    if (filters.payers[i].value !== "empty") {
                        filtersArr.push(filters.payers[i].display);
                        filtersArr.push(", ");
                    }
                }
                // Remove last comma
                filtersArr.pop();
                filtersString += filtersArr.join("");
            }

            if (filters.relationship){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=filters.relationship.display;
            }

            if (filters.nextAssessmentDateRange){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=filters.nextAssessmentDateRange.display;
            }

            if (filters.includeCompleteDischargePlanStatus){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=rcm_discharge_i18n.RCM_DISPLAY_INCLUDE_COMPLETE_DISCHARGE_PLAN_STATUS;
            }

            if (filters.includeNotNeededDischargePlanStatus){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=rcm_discharge_i18n.RCM_DISPLAY_INCLUDE_NOT_NEEDED_DISCHARGE_PLAN_STATUS;
            }

            if (filters.includeNoNextAssessement){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=rcm_discharge_i18n.RCM_DISPLAY_INCLUDE_NO_NEXT_REVIEW_DATE;
            }

            if (filters.includeUnassignedWithOrder){
                if (filtersString.length > 0){
                    filtersString+=" | ";
                }
                filtersString+=rcm_discharge_i18n.RCM_SHOW_UNASSIGNED_WITH_ORDER;
            }

            return filtersString;
        },

        displayAppliedFilters: function(appliedFiltersDiv){
            var injectHtmlArray = [];

            if (!appliedFiltersDiv) {
                var appliedFiltersDiv = document.getElementById("appliedFilters");
            }

            appliedFiltersDiv.innerHTML=this.createAppliedFiltersString();
        },

        addPatientCountString: function(recordNum){
            var patientCountString = "<div id='patientListCountDiv' class='patientCountWhitePipeLine'>" + rcm_discharge_i18n.RCM_PATIENTS + ": " + recordNum + "</div>";
            $("#patientCount").html(patientCountString);
        },

        /**
         * Creates the worklist filter view.
         */
        createFilters: function(){
            if(document.getElementById("filterBox")){
                document.getElementById('patientListLabel').innerHTML = this.selectedPatientListJson.PATIENTLIST_NAME + rcm_discharge_i18n.RCM_DASH;
            }
            else{
                var patientListName = this.selectedPatientListJson.PATIENTLIST_NAME;
                var boxDiv = document.createElement("div");
                boxDiv.id = "filterBox";
                boxDiv.className = "filter-box";
                var injectHtmlArray = [];


                // Header
                injectHtmlArray.push("<div class='filter-title-bar'>");
                injectHtmlArray.push("<label class='filter-title' id='patientListLabel' for='filters'>", patientListName, rcm_discharge_i18n.RCM_DASH, "</label>");
                injectHtmlArray.push("<label class='filter-subtitle' for='filters'>", rcm_discharge_i18n.RCM_FILTER_SETTINGS, "</label>");
                injectHtmlArray.push("</div>");

                injectHtmlArray.push("<div id = 'filterBox-scrollable-content'>");

                // Filters
                injectHtmlArray.push(this.encounterTypeFilter());
                injectHtmlArray.push(this.financialClassFilter());
                injectHtmlArray.push(this.payerFilter());
                injectHtmlArray.push(this.relationshipFilter());
                injectHtmlArray.push(this.nextAssessmentFilter());
                injectHtmlArray.push("<br/>");

                // Checkboxes
                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<label class='filter-checkbox-header' for='include'>", rcm_discharge_i18n.RCM_CHECKBOX_FILTER_HEADER, "</label>");
                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<input type='checkbox' id='dischargePlanStatusCompleteCheckbox' name='dischargePlanStatusCompleteCheckbox'></input>");
                injectHtmlArray.push("<label for='dischargePlanStatusCompleteCheckbox'>", rcm_discharge_i18n.RCM_INCLUDE_COMPLETED_DISCHARGE_PLAN, "</label>");
                injectHtmlArray.push("</div>");

                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<input type='checkbox' id='dischargePlanStatusNotNeededCheckbox' name='dischargePlanStatusNotNeededCheckbox'></input>");
                injectHtmlArray.push("<label for='dischargePlanStatusNotNeededCheckbox'>", rcm_discharge_i18n.RCM_INCLUDE_NOT_NEEDED_DISCHARGE_PLAN, "</label>");
                injectHtmlArray.push("</div>");

                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<input type='checkbox' id='assessmentCheckbox' name='assessmentCheckbox'></input>");
                injectHtmlArray.push("<label for='assessmentCheckbox'>", rcm_discharge_i18n.RCM_NO_NEXT_ASSESSMENT, "</label>");
                injectHtmlArray.push("</div>");

                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<input type='checkbox' id='unassignedWithOrderCheck' name='unassignedWithOrderCheck'></input>");
                injectHtmlArray.push("<label for='unassignedWithOrderCheck'>", rcm_discharge_i18n.RCM_UNASSIGNED_WITH_ORDER, "</label>");
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("</div>");

                // Sorting
                injectHtmlArray.push("<div class='separator'></div>");
                injectHtmlArray.push("<div class='filter-checkbox'>");
                injectHtmlArray.push("<label class='filter-sorting-header' for='primary'>", rcm_discharge_i18n.RCM_SORTING, "</label>");
                injectHtmlArray.push("<div>");
                injectHtmlArray.push(this.primarySort());
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("<div>");
                injectHtmlArray.push(this.secondarySort());
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("<div>");
                injectHtmlArray.push(this.tertiarySort());
                injectHtmlArray.push("</div>");
                injectHtmlArray.push("</div>");


                injectHtmlArray.push("</div>");
                // Save Checkbox and Accept/Cancel Buttons
                injectHtmlArray.push("<div class='filter-checkbox-save-area' id='saveConfigurationDiv'>");
                injectHtmlArray.push("<input class='filter-checkbox-config' type='checkbox' id='saveConfigurationCheckbox' name='saveConfigurationCheckbox' onClick=''></input>");
                injectHtmlArray.push("<label class='filter-checkbox-config' for='saveConfigurationCheckbox'>", rcm_discharge_i18n.RCM_SAVE_CONFIGURATION, "</label>");
                injectHtmlArray.push("<button class='filter-button-cancel' onclick='RCM_Filters.cancelFilters()'>",rcm_discharge_i18n.RCM_CANCEL,"</button>");
                injectHtmlArray.push("<button class='filter-button-apply' onclick='RCM_Filters.acceptFilters()'>",rcm_discharge_i18n.RCM_APPLY,"</button>");
                injectHtmlArray.push("</div>");

                injectHtml = injectHtmlArray.join("");
                boxDiv.innerHTML = injectHtml;
                document.body.appendChild(boxDiv);
            }
        },

        acceptFilters: function(){
            this.setAppliedFilters();
            this.toggleFilterBox();

            if (document.getElementById("saveConfigurationCheckbox").checked){
                this.saveDefaultsToConfig();
                this.defaultsChanged = true;
            }

            this.notifyFiltersListeners();
        },

        saveDefaultsToConfig: function(){
            if (this.appliedFilters) {
                var patientListName = this.selectedPatientListJson.PATIENTLIST_NAME;
                var defaultAssignedTo = this.appliedFilters.relationship.display;
                var nextAssessmentDateRange = parseInt(this.appliedFilters.nextAssessmentDateRange.value);

                var sendAssignedTo = "";
                if (defaultAssignedTo === rcm_discharge_i18n.RCM_ASSIGNED_TO_ME) {
                    sendAssignedTo = "ME";
                }else if (defaultAssignedTo === rcm_discharge_i18n.RCM_ASSIGNED_TO_OTHERS) {
                    sendAssignedTo = "OTHERS";
                }else if (defaultAssignedTo === rcm_discharge_i18n.RCM_ALL) {
                    sendAssignedTo = "ALL";
                }else {
                    sendAssignedTo = "NONE";
                }

                var defaultShowCompleteDischargeStatusInd = 0;
                if (this.appliedFilters.includeCompleteDischargePlanStatus) {
                    defaultShowCompleteDischargeStatusInd = 1;
                }

                var defaultShowNotNeededDischargeStatusInd = 0;
                if(this.appliedFilters.includeNotNeededDischargePlanStatus) {
                    defaultShowNotNeededDischargeStatusInd = 1;
                }

                var defaultShowNoNextAssessmentInd = 0;
                if (this.appliedFilters.includeNoNextAssessement) {
                    defaultShowNoNextAssessmentInd = 1;
                }

                var includeUnassignedWithOrder = 0;
                if (this.appliedFilters.includeUnassignedWithOrder) {
                    includeUnassignedWithOrder = 1;
                }

                var defaultEncounterTypes = [];
                for(var i =0; i < this.appliedFilters.encounterTypes.length; i++){
                    var et = this.appliedFilters.encounterTypes[i];
                    if(et){
                        var encounterTypeCd = et.value;
                        var et = new EncounterType(encounterTypeCd);
                        defaultEncounterTypes.push(et);
                    }
                }

                var defaultFinancialClasses = [];
                for(var i = 0; i < this.appliedFilters.financialClasses.length; i++){
                    var finClass = this.appliedFilters.financialClasses[i];
                    if (finClass) {
                        defaultFinancialClasses.push(new FinancialClassFilter(finClass.value));
                    }
                }

                var defaultPayers = [];
                for(var i = 0; i < this.appliedFilters.payers.length; i++){
                    var payer = this.appliedFilters.payers[i];
                    if (payer) {
                        defaultPayers.push(new PayerFilter(payer.value));
                    }
                }

                var defaultPrimarySortColumn = this.appliedFilters.primarySort;
                // 1 = descending
                var defaultPrimarySortDir = 1;
                if (this.appliedFilters.primarySortAscending === false) {
                    // 0 = ascending;
                    defaultPrimarySortDir = 0;
                }

                var defaultSecondarySortColumn = this.appliedFilters.secondarySort;
                // 1 = descending
                var defaultSecondarySortDir = 1;
                if (this.appliedFilters.secondarySortAscending === false) {
                    // 0 = ascending;
                    defaultSecondarySortDir = 0;
                }

                var defaultTertiarySortColumn = this.appliedFilters.tertiarySort;
                // 1 = descending
                var defaultTertiarySortDir = 1;
                if (this.appliedFilters.tertiarySortAscending === false) {
                    // 0 = ascending;
                    defaultTertiarySortDir = 0;
                }

                var defaultsObj = {
                    "patientListName": RCM_Clinical_Util.encodeString(patientListName),
                    "defaultFinancialClassCd": "",
                    "defaultAssignedTo": sendAssignedTo,
                    "completedPlanStatusInd": defaultShowCompleteDischargeStatusInd,
                    "notNeededStatusInd": defaultShowNotNeededDischargeStatusInd,
                    "noNextAssessmentInd": defaultShowNoNextAssessmentInd,
                    "includeUnassignedWithOrdersInd": includeUnassignedWithOrder,
                    "defaultPrimarySortColumn": defaultPrimarySortColumn,
                    "defaultPrimarySortDir": defaultPrimarySortDir,
                    "defaultSecondarySortColumn": defaultSecondarySortColumn,
                    "defaultSecondarySortDir": defaultSecondarySortDir,
                    "defaultTertiarySortColumn": defaultTertiarySortColumn,
                    "defaultTertiarySortDir": defaultTertiarySortDir,
                    "defaultEncounterTypes": defaultEncounterTypes,
                    "defaultFinancialClasses" : defaultFinancialClasses,
                    "defaultRelativeReviewRange" : nextAssessmentDateRange,
                    "defaultPayers": defaultPayers
                };

                var jsonString = JSON.stringify(defaultsObj);

                var json = "^{\"saveWorklistDefaultsReq\":" + jsonString + "}^";
                var paramAr = [];
                paramAr.push("^MINE^", "0.0", "^SAVEWORKLISTDEFAULTS^", json);
                var recordData = this.makeCall("rcm_discharge_worklist", paramAr, false);
                document.getElementById("saveConfigurationCheckbox").checked = false;
            }

        },

        setAppliedFilters: function(){
            var appliedFilters = new RCM_Applied_Filters();
            appliedFilters.encounterTypes = this.getSelectedEncounterTypes();
            appliedFilters.financialClasses = this.getSelectedFinancialClasses();
            appliedFilters.relationship = this.getSelectedRelationship();
            appliedFilters.nextAssessmentDateRange = this.getNextAssessmentDateRange();
            appliedFilters.includeCompleteDischargePlanStatus = document.getElementById('dischargePlanStatusCompleteCheckbox').checked;
            appliedFilters.includeNotNeededDischargePlanStatus = document.getElementById('dischargePlanStatusNotNeededCheckbox').checked;
            appliedFilters.includeNoNextAssessement = document.getElementById('assessmentCheckbox').checked;
            appliedFilters.includeUnassignedWithOrder = document.getElementById('unassignedWithOrderCheck').checked;
            appliedFilters.payers = this.getSelectedPayers();

            var primarySort = document.getElementById("primarySort").value;

            var primarySortAscending = document.getElementById("ascendingPrimary").checked;

            var secondarySort = document.getElementById("secondarySort").value;

            var secondarySortAscending = document.getElementById("ascendingSecondary").checked;

            var tertiarySort = document.getElementById("tertiarySort").value;

            var tertiarySortAscending = document.getElementById("ascendingTertiary").checked;

            appliedFilters.primarySort = primarySort;
            appliedFilters.primarySortAscending = primarySortAscending;
            appliedFilters.secondarySort = secondarySort;
            appliedFilters.secondarySortAscending = secondarySortAscending;
            appliedFilters.tertiarySort = tertiarySort;
            appliedFilters.tertiarySortAscending = tertiarySortAscending;

            this.appliedFilters = appliedFilters;
        },



        cancelFilters: function(){
            this.toggleFilterBox();

            var appliedFilters = this.getAppliedFilters();
            //Encounter Type Dropdown Box
            var encounterFilter = document.getElementById('encounterTypeFilter');
            if (appliedFilters.encounterTypes.length === 0) {
                for (var k = 0; k < encounterFilter.options.length; k++) {
                    encounterFilter.options[k].selected = false;
                }
            }
            else {
                for (var j = 0; j < encounterFilter.options.length; j++) {
                    encounterFilter.options[j].selected = false;
                    for (var i = 0; i < appliedFilters.encounterTypes.length; i++) {
                        var encounterOption = encounterFilter.options[j].value;
                        var appliedOption = appliedFilters.encounterTypes[i].value;
                        if (encounterOption === appliedOption) {
                            encounterFilter.options[j].selected = true;
                            break;
                        }
                    }
                }
            }

            //Financial Class Dropdown Box
            var finFilter = document.getElementById('finClassFilter');
            if (appliedFilters.financialClasses.length === 0) {
                for (var k = 0; k < finFilter.options.length; k++) {
                    finFilter.options[k].selected = false;
                }
            }
            else {
                for (var j = 0; j < finFilter.options.length; j++) {
                    var finOption = finFilter.options[j];
                    finOption.selected = false;
                    for (var i = 0; i < appliedFilters.financialClasses.length; i++) {
                        if (finOption.value === appliedFilters.financialClasses[i].value) {
                            finOption.selected = true;
                            break;
                        }
                    }
                }
            }

            //Payer Filters
            //restore any table rows that were deleted
            if (appliedFilters.payers.length >= this.payerFilters.length)
            {
                for (var k = 0; k < appliedFilters.payers.length; k++) {
                    var payerFilter = appliedFilters.payers[k]
                    this.addRowToPayerFilterTable(payerFilter.value, payerFilter.display);
                }
            }
            for (var j = 0; j < this.payerFilters.length; j++) {
                var found = false;
                for (var i = 0; i < appliedFilters.payers.length; i++) {
                    if (this.payerFilters[j].ID === appliedFilters.payers[i].value) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    this.removeRowFromPayerFilterTable($('#payerFilterRemoveX' + this.payerFilters[j].ID));
                }
            }


            //Relationship Dropdown Box
            var relFilter = document.getElementById('relationshipDropbox');
                for(var i = 0; i < relFilter.options.length; i++){
                    if(relFilter.options[i].text === appliedFilters.relationship.display){
                        relFilter.options[i].selected = true;
                    }
                }

            //next assessment date range
            var dateRangeFilter = document.getElementById('nextAssessmentDropbox');
            for(var i = 0; i < dateRangeFilter.options.length; i++){
                if(dateRangeFilter.options[i].value === appliedFilters.nextAssessmentDateRange.value){
                    dateRangeFilter.options[i].selected = true;
                }
            }

            //Include Complete Discharge Plan Status Checkbox
            var completeDischargePlanFilter = document.getElementById('dischargePlanStatusCompleteCheckbox');
            completeDischargePlanFilter.checked = appliedFilters.includeCompleteDischargePlanStatus;

            //Include Not Needed Discharge Plan Status Checkbox
            var notNeededDischargePlanFilter = document.getElementById('dischargePlanStatusNotNeededCheckbox');
            notNeededDischargePlanFilter.checked = appliedFilters.includeNotNeededDischargePlanStatus;

            //Include No Next Assessment Checkbox
            var noAssessmentFilter = document.getElementById('assessmentCheckbox');
            noAssessmentFilter.checked = appliedFilters.includeNoNextAssessement;

            //show unassigned with discharge order Checkbox
            var unassignedWithOrderFilter = document.getElementById('unassignedWithOrderCheck');
            unassignedWithOrderFilter.checked = appliedFilters.includeUnassignedWithOrder;

            //Primary Sort Dropdown Box
            var primString;
            if(appliedFilters.primarySort === ""){
                primString = "--";
            }
            else{
                primString = appliedFilters.primarySort;
            }
            var primSortFilter = document.getElementById('primarySort');
            for(var i = 0; i < primSortFilter.options.length; i++){
                if(primSortFilter.options[i].value === primString){
                    primSortFilter.options[i].selected = true;
                }
            }


            //Primary Sort Radio Buttons
            if(appliedFilters.primarySortAscending === false){
                document.getElementById('ascendingPrimary').checked = false;
                document.getElementById('descendingPrimary').checked = true;
            }
            else{
                document.getElementById('descendingPrimary').checked = false;
                document.getElementById('ascendingPrimary').checked = true;
            }

            //Secondary Sort Dropdown Box
            var secString;
            if(appliedFilters.secondarySort === ""){
                secString = "--";
            }
            else{
                secString = appliedFilters.secondarySort;
            }
            var secSortFilter = document.getElementById('secondarySort');
            for(var i = 0; i < secSortFilter.options.length; i++){
                if(secSortFilter.options[i].value === secString){
                    secSortFilter.options[i].selected = true;
                }
            }

            //Secondary Sort Radio Buttons
            if (appliedFilters.secondarySortAscending === false) {
                document.getElementById('ascendingSecondary').checked = false;
                document.getElementById('descendingSecondary').checked = true;
            }
            else {
                document.getElementById('descendingSecondary').checked = false;
                document.getElementById('ascendingSecondary').checked = true;
            }

            //Tertiary Sort Dropdown Box
            var terString;
            if(appliedFilters.tertiarySort === ""){
                terString = "--";
            }
            else{
                terString = appliedFilters.tertiarySort;
            }
            var terSortFilter = document.getElementById('tertiarySort');
            for(var i = 0; i < terSortFilter.options.length; i++){
                if(terSortFilter.options[i].value === terString){
                    terSortFilter.options[i].selected = true;
                }
            }

            //Tertiary Sort Radio Buttons
            if (appliedFilters.tertiarySortAscending === false) {
                document.getElementById('ascendingTertiary').checked = false;
                document.getElementById('descendingTertiary').checked = true;
            }
            else {
                document.getElementById('descendingTertiary').checked = false;
                document.getElementById('ascendingTertiary').checked = true;
            }

            document.getElementById('saveConfigurationCheckbox').checked = false;
        },

        /**
         * Populate filter dialog's encounter types and financial types drop down.
         */
        populateFilters: function(){
//            var sendAr = [];
//            sendAr.push("^MINE^", "0.0", "^GETREVIEWFILTERS^", "^dummy^");
//            var recordData = this.makeCall("rcm_discharge_worklist", sendAr, false);
            if (this.selectedPatientListJson.ENCOUNTER_TYPES.length > 0) {
                this.populateEncounterTypeFilter(this.selectedPatientListJson.ENCOUNTER_TYPES);
            }
            else {
                this.populateEncounterTypeFilter(this.allEncounterTypes);
            }
            this.populateFinancialClassFilter(this.allFinancialClasses);
        },
        setPayerFilterSearch: function() {
            var orgSearchControl = new OrgSearchControl(document.getElementById("payerFilter"));
            var payerSearchControlListener = function(){
                var newPayerIdToBeAdded = String(orgSearchControl.getSelectedOrgId());
                var newPayerNameToBeAdded = $("#payerFilter").val();
                if(newPayerIdToBeAdded !== "" && newPayerNameToBeAdded !== ""){
                    RCM_Filters.addRowToPayerFilterTable(newPayerIdToBeAdded, newPayerNameToBeAdded);
                    //Reset orgSearchControl
                    orgSearchControl.setSelectedOrg("","");
                }
            };
            orgSearchControl.setOrgType("INSCO");
            orgSearchControl.addVerifyStateChangeListener(payerSearchControlListener);
        },

        setDefaultFilters: function(){
            var listJson = this.selectedPatientListJson;
            if (listJson){
                //Financial Class
                var defaultFinClasses = listJson.DEFAULT_FIN_CLASSES;
                var finFilter = document.getElementById('finClassFilter');
                if (defaultFinClasses && defaultFinClasses.length > 0) {
                    for (var i = 0, len = finFilter.options.length; i < len; i++) {
                        var optionSelected = false;
                        for (var j = 0, length = defaultFinClasses.length; j < length; j++) {
                            var listOption = finFilter.options[i].value;
                            var defaultOption = defaultFinClasses[j].DEFAULT_FIN_CLASS_CD;
                            if (listOption === defaultOption) {
                                optionSelected = true;
                                break;
                            }
                        }
                        finFilter.options[i].selected = optionSelected;
                    }
                }
                else {
                    for (var i = 0, len = finFilter.options.length; i < len; i++) {
                        finFilter.options[i].selected = false;
                    }
                }


                //Payer
                var defaultPayers = listJson.DEFAULT_PAYERS;
                for (var j = 0, length = defaultPayers.length; j < length; j++) {
                    var payer = defaultPayers[j];
                    RCM_Filters.addRowToPayerFilterTable(payer.DEFAULT_PAYER_ID, payer.DEFAULT_PAYER_DISPLAY);
                }
                //Primary Sort(Column)
                var defaultPrimarySortColumn = listJson.PRIMARY_SORT_COLUMN;
                var primarySort = document.getElementById('primarySort');
                if(defaultPrimarySortColumn){
                    for(var i = 0; i < primarySort.options.length; i++){
                        var opt = primarySort.options[i];
                        if(opt.value === defaultPrimarySortColumn){
                            opt.selected = true;
                            break;
                        }
                    }
                }
                else{
                    var length = primarySort.options.length;
                    if(length > 0){
                        for (var i = 0; i < length; i++) {
                            if (primarySort.options[i].value == "dischargePlanStatus") {
                                primarySort.options[i].selected = true;
                                break;
                            }
                        }
                    }
                }

                //Primary Sort(Direction) 0 = ascending; 1 = descending
                var defaultPrimarySortDirection = listJson.PRIMARY_SORT_DIRECTION;
                var primarySortAscending = document.getElementById('ascendingPrimary');
                var primarySortDescending = document.getElementById('descendingPrimary');
                if(defaultPrimarySortDirection){
                    primarySortAscending.checked = true;
                    primarySortDescending.checked = false;
                }
                else{
                    primarySortAscending.checked = false;
                    primarySortDescending.checked = true;
                }


                //Secondary Sort(Column)
                var defaultSecondarySortColumn = listJson.SECONDARY_SORT_COLUMN;
                var secondarySort = document.getElementById('secondarySort');
                if(defaultPrimarySortColumn && defaultSecondarySortColumn){
                    for(var i = 0; i < secondarySort.options.length; i++){
                        var opt = secondarySort.options[i];
                        if(opt.value === defaultSecondarySortColumn){
                            opt.selected = true;
                            break;
                        }
                    } 
                }
                else if(defaultPrimarySortColumn && !defaultSecondarySortColumn){
                    for(var i = 0; i < secondarySort.options.length; i++){
                        if(secondarySort.options[i].value == "locationExtended"){
                            secondarySort.options[i].selected = true;
                            break;
                        }
                    }
                }
                else{
                    for(var i = 0; i < secondarySort.options.length; i++){
                        if(secondarySort.options[i].value == "locationExtended"){
                            secondarySort.options[i].selected = true;
                            break;
                        }
                    }
                }

                //Secondary Sort(Direction) 0 = ascending; 1 = descending
                var defaultSecondarySortDirection = listJson.SECONDARY_SORT_DIRECTION;
                var secondarySortAscending = document.getElementById('ascendingSecondary');
                var secondarySortDescending = document.getElementById('descendingSecondary');
                if(defaultSecondarySortDirection){
                    secondarySortAscending.checked = true;
                    secondarySortDescending.checked = false;
                }
                else{
                    secondarySortAscending.checked = false;
                    secondarySortDescending.checked = true;
                }

                //Tertiary Sort(Column)
                var defaultTertiarySortColumn = listJson.TERTIARY_SORT_COLUMN;
                var tertiarySort = document.getElementById('tertiarySort');
                if(defaultPrimarySortColumn && defaultSecondarySortColumn && defaultTertiarySortColumn){
                    for(var i = 0; i < tertiarySort.options.length; i++){
                        var opt = tertiarySort.options[i];
                        if(opt.value === defaultTertiarySortColumn){
                            opt.selected = true;
                            break;
                        }
                    }
                }
                else if(defaultPrimarySortColumn && defaultSecondarySortColumn && !defaultTertiarySortColumn){
                    for(var i = 0; i < tertiarySort.options.length; i++){
                        if(tertiarySort.options[i].value == "empty"){
                            tertiarySort.options[i].selected = true;
                            break;
                        }
                    }
                }
                else{
                    for(var i = 0; i < tertiarySort.options.length; i++){
                        if(tertiarySort.options[i].value == "empty"){
                            tertiarySort.options[i].selected = true;
                            break;
                        }
                    }
                }

                //Tertiary Sort(Direction) 0 = ascending; 1 = descending
                var defaultTertiarySortDirection = listJson.TERTIARY_SORT_DIRECTION;
                var tertiarySortAscending = document.getElementById('ascendingTertiary');
                var tertiarySortDescending = document.getElementById('descendingTertiary');
                if(defaultTertiarySortDirection){
                    tertiarySortAscending.checked = true;
                    tertiarySortDescending.checked = false;
                }
                else{
                    tertiarySortAscending.checked = false;
                    tertiarySortDescending.checked = true;
                }


                //Encounter Type
                var defaultEncounterTypes = listJson.DEFAULT_ENCNTR_TYPES;
                var encounterTypeFilterElement = document.getElementById('encounterTypeFilter');
                //Clear encounter type selections
                var length = encounterTypeFilterElement.options.length;
                for (var i = 0, len = encounterTypeFilterElement.options.length; i < len; i++) {
                    encounterTypeFilterElement.options[i].selected = false;
                }

                if (defaultEncounterTypes && defaultEncounterTypes.length > 0) {
                    for (var i = 0, len = encounterTypeFilterElement.options.length; i < len; i++) {
                        for (j = 0, length = defaultEncounterTypes.length; j < length; j++) {
                            var listOption = encounterTypeFilterElement.options[i].value;
                            var defaultOption = defaultEncounterTypes[j].DEFAULT_ENCNTR_TYPE_CD;
                            if (listOption === defaultOption) {
                                encounterTypeFilterElement.options[i].selected = true;
                            }
                        }
                    }
                }
                else {
                    var length = encounterTypeFilterElement.options.length;
                    if (length > 0) {
                        for (var i = 0, len = encounterTypeFilterElement.options.length; i < len; i++) {
                            encounterTypeFilterElement.options[i].selected = false;
                        }
                    }
                }

                //Relationship
                var defaultAssignedTo = listJson.DEFAULT_ASSIGNED_TO;
                var relationshipElement = document.getElementById('relationshipDropbox');
                if (defaultAssignedTo) {
                    if (defaultAssignedTo) {
                        var selection = 0;
                        if (defaultAssignedTo === "OTHERS") {
                            selection = 1;
                        }
                        else if (defaultAssignedTo === "NONE") {
                            selection = 2;
                         }
                        else if (defaultAssignedTo === "ALL") {
                            selection = 3;
                         }
                        relationshipElement.options[selection].selected = true;
                    }
                }
                else {
                    var length = relationshipElement.options.length;
                    if (length > 0) {
                        relationshipElement.options[0].selected = true;
                    }
                }

                //Complete Discharge Status
                var defaultShowCompleteDischargePlanStatus = listJson.COMPLETED_PLAN_STATUS_IND;
                var completeStatusBox = document.getElementById('dischargePlanStatusCompleteCheckbox');
                if (defaultShowCompleteDischargePlanStatus) {
                    if (defaultShowCompleteDischargePlanStatus === 1) {
                        completeStatusBox.checked = true;
                    }
                }
                else {
                    completeStatusBox.checked = false;
                }

                //Not Needed Discharge Plan Status
                var defaultShowNotNeededDischargePlanStatus = listJson.NOT_NEEDED_STATUS_IND;
                var notNeededStatusBox = document.getElementById('dischargePlanStatusNotNeededCheckbox');
                if(defaultShowNotNeededDischargePlanStatus){
                    if(defaultShowNotNeededDischargePlanStatus === 1){
                        notNeededStatusBox.checked = true;
                    }
                }
                else{
                    notNeededStatusBox.checked = false;
                }

                //No Next Assessment
                var defaultShowNoNextAssessment = listJson.NO_NEXT_ASSESSMENT_IND;
                var assessmentBox = document.getElementById('assessmentCheckbox');
                if (defaultShowNoNextAssessment) {
                    if (defaultShowNoNextAssessment === 1) {
                        assessmentBox.checked = true;
                    }
                }
                else {
                    assessmentBox.checked = false;
                }

                //unassigned with discharge date
                var showUnassignedWithDischargeOrders = listJson.INCLUDE_UNASSIGNED_IND;
                var unassignedWithOrderCheckBox = document.getElementById('unassignedWithOrderCheck');
                if (showUnassignedWithDischargeOrders) {
                    if (showUnassignedWithDischargeOrders === 1) {
                        unassignedWithOrderCheckBox.checked = true;
                    }
                }
                else {
                    unassignedWithOrderCheckBox.checked = false;
                }

                var defaultRelativeRange = listJson.RELATIVE_REVIEW_DATE_RANGE;
                var relativeDateElement = document.getElementById('nextAssessmentDropbox');
                relativeDateElement.options[defaultRelativeRange].selected = true;
            }
        },
        /**
         * Get the filter html.
         */
        getFilterHTML: function(){
            var filterHTML = this.filterHTMLArray.join("");
            return filterHTML;
        },

           getSelectedPatientListJson: function(){
               // Error: Do not proceed if  filter is undefined.
            if(!this.appliedFilters){
                return "";
            }

            this.selectedPatientListJson.PRIMARY_SORT_COLUMN = this.appliedFilters.primarySort;
            // 0 = ascending; 1 = descending
            if (this.appliedFilters.primarySort === "" || this.appliedFilters.primarySortAscending) {
                this.selectedPatientListJson.PRIMARY_SORT_DIRECTION = 1;
            }
            else {
                this.selectedPatientListJson.PRIMARY_SORT_DIRECTION = 0;
            }

            this.selectedPatientListJson.SECONDARY_SORT_COLUMN = this.appliedFilters.secondarySort;
            // 0 = ascending; 1 = descending
            if (this.appliedFilters.secondarySort==="" || this.appliedFilters.secondarySortAscending) {
                this.selectedPatientListJson.SECONDARY_SORT_DIRECTION = 1;
            }
            else {
                this.selectedPatientListJson.SECONDARY_SORT_DIRECTION = 0;
            }

            this.selectedPatientListJson.TERTIARY_SORT_COLUMN = this.appliedFilters.tertiarySort;
            // 0 = ascending; 1 = descending
            if (this.appliedFilters.tertiarySort==="" || this.appliedFilters.tertiarySortAscending) {
                this.selectedPatientListJson.TERTIARY_SORT_DIRECTION = 1;
            }
            else {
                this.selectedPatientListJson.TERTIARY_SORT_DIRECTION = 0;
            }

            var encounterTypes = [];
            if (this.appliedFilters.encounterTypes) {
                if (this.appliedFilters.encounterTypes.length >= 1
                        && this.appliedFilters.encounterTypes[0].value !== "empty") {
                    for ( var i = 0; i < this.appliedFilters.encounterTypes.length; i++) {
                        encounterTypes.push({"ID":this.appliedFilters.encounterTypes[i].value});
                    }
                }
            }

            var finClasses = [];
            if (this.appliedFilters.financialClasses) {
                if (this.appliedFilters.financialClasses.length > 0
                        && this.appliedFilters.financialClasses[0].value !== "empty") {
                    for ( var i = 0; i < this.appliedFilters.financialClasses.length; i++) {
                        finClasses.push({"ID":this.appliedFilters.financialClasses[i].value});
                    }
                }
            }

            var payers = [];
            if (this.appliedFilters.payers) {
                if (this.appliedFilters.payers.length > 0
                        && this.appliedFilters.payers[0].value !== "empty") {
                    for ( var i = 0; i < this.appliedFilters.payers.length; i++) {
                        payers.push({"ID":this.appliedFilters.payers[i].value});
                    }
                }
            }

            var getWorklistSortedJson = {
                    "getWorklistReq" : {
                        "PATIENTLIST_ID" : this.selectedPatientListJson.PATIENTLIST_ID,
                        "PATIENTLIST_NAME" : RCM_Clinical_Util.encodeString(this.selectedPatientListJson.PATIENTLIST_NAME),
                        "PATIENTLIST_DESCRIPTION" : this.selectedPatientListJson.PATIENTLIST_DESCRIPTION,
                        "PATIENTLIST_TYPE_CD" : this.selectedPatientListJson.PATIENTLIST_TYPE_CD,
                        "PRIMARY_SORT_COLUMN" : this.selectedPatientListJson.PRIMARY_SORT_COLUMN,
                        "PRIMARY_SORT_DIRECTION" : this.selectedPatientListJson.PRIMARY_SORT_DIRECTION,
                        "SECONDARY_SORT_COLUMN" : this.selectedPatientListJson.SECONDARY_SORT_COLUMN,
                        "SECONDARY_SORT_DIRECTION" : this.selectedPatientListJson.SECONDARY_SORT_DIRECTION,
                        "TERTIARY_SORT_COLUMN" : this.selectedPatientListJson.TERTIARY_SORT_COLUMN,
                        "TERTIARY_SORT_DIRECTION" : this.selectedPatientListJson.TERTIARY_SORT_DIRECTION,
                        "ARGUMENTS" : this.selectedPatientListJson.ARGUMENTS,
                        "ENCOUNTER_TYPES" : this.selectedPatientListJson.ENCOUNTER_TYPES,
                        "FILTERDATA" :     {"ENCOUNTERTYPES" : encounterTypes,
                                         "FINANCIALCLASSES" : finClasses,
                                         "PERSONNELRELTN" : this.appliedFilters.relationship.value,
                                         "nextAssessmentDateRange": parseInt(this.appliedFilters.nextAssessmentDateRange.value),
                                         "includeCompletedDPSInd": this.appliedFilters.includeCompleteDischargePlanStatus ? 1 : 0,
                                         "includeNotNeededDPSInd": this.appliedFilters.includeNotNeededDischargePlanStatus ? 1 : 0,
                                         "includeNoNextAssessmentInd": this.appliedFilters.includeNoNextAssessement ? 1 : 0,
                                         "includeUnassignedWithOrderInd" : this.appliedFilters.includeUnassignedWithOrder ? 1 : 0,
                                         "PAYERS": payers
                                        }
                        }
                    };
                    
            return getWorklistSortedJson;
        },

        loadListOptions: function(list){
            this.patientListJson = list;
            var listOptions = [];
            for (var pos = 0, length = list.length; pos < length; pos++) {
                list[pos].PATIENTLIST_NAME = RCM_Clinical_Util.decodeString(list[pos].PATIENTLIST_NAME);

                var listItem = list[pos];

                var listOption = {
                    "listItem": listItem,
                    getId: function(){
                        return this.listItem.PATIENTLIST_ID;
                    },
                    getArguments: function(){
                        return this.listItem.ARGUMENTS;
                    },
                    toString: function(){
                        return this.listItem.PATIENTLIST_NAME;
                    },
                    getJson: function(){
                        return this.listItem;
                    }
                };
                listOptions.push(listOption);
            }
            return listOptions;
        },

        makeCall: function(program, paramAr, async){
            var returnValue;
            var info = new XMLCclRequest();
            info.onreadystatechange = function(){
                if (info.readyState == 4 && info.status == 200) {
                    try {
                        var jsonEval = JSON.parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            //TODO HANDLE
                        }
                        else {
                            if (recordData.STATUS_DATA.STATUS == "S") {
                                returnValue = recordData;
                            }
                            else {
                                var errAr = [];
                                var statusData = recordData.STATUS_DATA;
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                                }
                                var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            }
                        }
                    }
                    catch (err) {
                        alert(JSON.stringify(err));
                    }
                    finally {

                    }
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
                else
                    if (info.readyState == 4 && info.status != 200) {
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            };
            info.open('GET', program, async);
            info.send(paramAr.join(","));
            return returnValue;
        },

        /**
         * The method retrieves the patient lists and returns the drop down list HTML.
         */
        patientListFilter: function(){
            var sendAr = [];
            sendAr.push("^MINE^", "0.0", "^GETPATIENTLISTS^", "^dummy_ind^");
            this.jsonData = this.makeCall("rcm_discharge_worklist", sendAr, false);
            var loc = this.criterion.static_content;

            this.allEncounterTypes = this.jsonData.ALL_ENCNTR_TYPES;
            this.allFinancialClasses = this.jsonData.ALL_FIN_CLASSES;

            this.dropdownOptions = this.loadListOptions(this.jsonData.PATIENTLIST);
            this.selectedPatientListJson = this.dropdownOptions.length ? this.dropdownOptions[0].getJson() : null;
            if(this.dropdownOptions.length > 1) {
                var match = document.cookie.match(/rcm_drwl_pl=([^;]+)(;|\b|$)/);
                if (match && match[1]) {
                    var patientListId = match[1];
                    for(var i = 0; i < this.dropdownOptions.length; i++) {
                        if(patientListId === this.dropdownOptions[i].getId()) {
                            this.selectedPatientListJson = this.dropdownOptions[i].getJson();
                            break;
                        }
                    }
                }
            }

            var filterHTML = "";
            var patientListHTMLArray = [];
            patientListHTMLArray.push("<div class='dropDown'>");
            patientListHTMLArray.push("<label class='patient-list-label' for='unitFilterDropDown'>", rcm_discharge_i18n.RCM_PATIENT_LIST, "</label>&nbsp;");
            patientListHTMLArray.push("<select class='filterPrimSecPatientDropdown' id='patientListDropbox' name='unitFilterDropDown' onchange='RCM_Filters.patientListFilterListener(this)'>");
            patientListHTMLArray.push("</select>");
            patientListHTMLArray.push(this.filterButton());
            patientListHTMLArray.push("</div>");
            patientListHTMLArray.push("<div class='open-list-maintenance-div' onclick='RCM_Filters.openListMaintenance()'>");
            patientListHTMLArray.push("<img class='list-maintenance-img' src='", loc, "\\images\\list-settings.png' ></div>");

            filterHTML = patientListHTMLArray.join("");
            return filterHTML;
        },

        populatePatientLists:function(selectedId){
            if(this.dropdownOptions == null){
                var sendAr = [];
                sendAr.push("^MINE^", "0.0", "^GETPATIENTLISTS^", "^dummy^");
                this.jsonData = this.makeCall("rcm_discharge_worklist", sendAr, false);
            }

            if ((this.jsonData && this.jsonData.PATIENTLIST && this.jsonData.PATIENTLIST.length > 0) || this.dropdownOptions != null) {

                if(this.dropdownOptions == null){
                    this.dropdownOptions = this.loadListOptions(this.jsonData.PATIENTLIST);
                }

                var patientListDropdown = document.getElementById('patientListDropbox');
                patientListDropdown.options.length = 0;
                for (var d = 0; d < this.dropdownOptions.length; d++) {
                    if (this.dropdownOptions[d] != "") {
                        var patientListOption = document.createElement("option");
                        patientListOption.value = JSON.stringify(this.dropdownOptions[d].getJson());
                        patientListOption.text = this.dropdownOptions[d].toString();
                        patientListDropdown.options.add(patientListOption);
                    }
                }

                for (var i = 0, len = patientListDropdown.options.length; i < len; i++) {
                    var option = patientListDropdown.options[i];

                    var json = JSON.parse(option.value);
                    if (json.PATIENTLIST_ID === selectedId) {
                        option.selected = true;
                        this.selectedPatientListJson = json;
                    }
                }
                this.dropdownOptions = null;
            }
            this.defaultsChanged = false;
        },

        patientListFilterListener: function(filterElement){
            //reset payer filter table;
            $("#payerTable").empty();
            this.payerFilters = [];
            //Close any inline editing dialogs on the worklist
            RCM_Worklist.removeDialogandLine();

            //Change patient list
            var jsonString = filterElement.options[filterElement.selectedIndex].value;
            var json = JSON.parse(jsonString);
            if (this.defaultsChanged === true) {
                this.populatePatientLists(json.PATIENTLIST_ID);
            }
            else{
                this.selectedPatientListJson = json;
            }

            var filters = document.getElementById("filterBox");
            if (filters.style.display === "inline") {
                filters.style.display = "none";
            }
            this.populateFilters();
            this.setDefaultFilters();
            this.setAppliedFilters();
            this.displayAppliedFilters();
            this.notifyFiltersListeners();
            document.getElementById('patientListLabel').innerHTML = this.selectedPatientListJson.PATIENTLIST_NAME + rcm_discharge_i18n.RCM_DASH;
        },

        filterButton: function(){
            var loc = this.criterion.static_content;
            var buttonHTMLArray = [];
            buttonHTMLArray.push("<input id='filterInput' onmousedown='RCM_Filters.toggleFilterBox()' class='filter-button-image' type='image' src='", loc, "\\images\\4342.ico' title='",rcm_discharge_i18n.RCM_FILTERS,"'/>");
            return buttonHTMLArray.join("");
        },

        toggleFilterBox: function(){
            //Close any inline editing dialogs on the worklist
            RCM_Worklist.removeDialogandLine();

            //Toggle filter box
            var filters = document.getElementById("filterBox");

            if (filters.style.display === "inline") {
                filters.style.display = "none";
            }
            else {
                filters.style.display = "inline";
                this.resizeFilterBox();
            }
        },


        finishRender: function(component){
            this.setDefaultFilters();
            this.setAppliedFilters();
            this.notifyFiltersListeners();
            $(document).ready(function(){
                //reset the height so if the filters div was previously tall
                //and shrinks down, the patientCount div will shrink too
                $("#patientCount").height($("#filters").height());
                $("#patientListCountDiv").height($("#patientCount").height());
            });

            $(window).resize(function(){
                RCM_Filters.resizeendDate= new Date();
                if (RCM_Filters.resizeendTimeout  === false){
                    RCM_Filters.resizeendTimeout  = true;
                    setTimeout(RCM_Filters.resizeend, RCM_Filters.resizeendDelta);
                }
            });
        },

        resizeend:function(){
            if (new Date() -RCM_Filters.resizeendDate < RCM_Filters.resizeendDelta){
                setTimeout(RCM_Filters.resizeend, RCM_Filters.resizeendDelta);
            }
        else{
                RCM_Filters.resizeendTimeout = false;
                if($("#patientCount").width() > 0){
                    //sets the height to the height of the breadcrumbs and adds 18 (1.5em) to account for the margin
                    $("#patientCount").height($("#appliedFilters").height() + 18);
                    $("#patientListCountDiv").height($("#patientCount").height());
                }
                if($("#filterBox").css('display')=== "inline"){
                    RCM_Filters.resizeFilterBox();
                }
            }
        },

        resizeFilterBox: function(){
            $("#filterBox-scrollable-content").css("height", "auto");
            $("#filterBox-scrollable-content").css("height-max", 500);
            $("#filterBox-scrollable-content").css("width", 500);
            $("#filterBox").css("width", 500);
            $("#filterBox-scrollable-content").css("overflow-y", "hidden")
            $("#filterBox-scrollable-content").css("overflow-x", "hidden");
            var htmlHeight = document.documentElement.clientHeight;
            var htmlWidth = document.documentElement.clientWidth;
            if(htmlWidth <500){
                $("#filterBox-scrollable-content").css("overflow-x", "scroll")
                $("#filterBox-scrollable-content").css("width", (htmlWidth -15));
                $("#filterBox").css("width", (htmlWidth-15));
            }

            var filterBoxHeight = $("#filterBox").height();
            if((filterBoxHeight + 72) > htmlHeight){
                $("#filterBox-scrollable-content").css("height", (htmlHeight - 157));
                $("#filterBox-scrollable-content").css("overflow-y", "scroll");
            }
        },


        encounterTypeFilter: function(){
            var filterHTML = [];
            var encounterTypeHTMLString = "";
            filterHTML.push("<div class='filter'>");
            filterHTML.push("<label class='filter-encounter-type' for='encounterTypeFilter'>", rcm_discharge_i18n.RCM_ENCOUNTER_TYPE, "</label>");
            filterHTML.push("<select multiple='multiple' class='filterDropdown' id='encounterTypeFilter' name='encounterTypeFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            encounterTypeHTMLString = filterHTML.join("");
            return encounterTypeHTMLString;
        },


        populateEncounterTypeFilter: function(encounterTypes){
            var encounterTypeFilterElement = document.getElementById('encounterTypeFilter');
            encounterTypeFilterElement.options.length = 0;
            var encounterOption = document.createElement("option");
            encounterOption.value = "empty";
            encounterOption.text = "--";
            encounterTypeFilterElement.options.add(encounterOption);

            if (encounterTypes && encounterTypes.length > 0) {
                for (var i = 0, len = encounterTypes.length; i < len; i++) {
                    var encounterFilter = encounterTypes[i];
                    var encounterOption = document.createElement("option");
                    encounterOption.value = encounterFilter.ENCOUNTER_TYPE_CD;
                    encounterOption.text = encounterFilter.ENCOUNTER_TYPE_DISPLAY;
                    encounterTypeFilterElement.options.add(encounterOption);
                }
                if (encounterTypeFilterElement.disabled === true) {
                    encounterTypeFilterElement.disabled = false;
                }
            }
        },

        getSelectedEncounterTypes: function(){
            var encounterTypeFilterElement = document.getElementById('encounterTypeFilter');

            var encounterTypes = new Array();
            for (var i = 0; i < encounterTypeFilterElement.options.length; i++){
                if (encounterTypeFilterElement.options[ i ].selected){
                    if (encounterTypeFilterElement.options[i].value !== "empty") {
                        var opt = new RCM_Option(encounterTypeFilterElement.options[i].value, encounterTypeFilterElement.options[i].text);
                        encounterTypes.push(opt);
                    }
                }
            }

            return encounterTypes;
        },

        financialClassFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='filter'>");
            filterHTML.push("<label for='finClassFilter' class='filter-label'>", rcm_discharge_i18n.RCM_FINANCIAL_CLASS, "</label>");
            filterHTML.push("<select multiple='multiple' class='filterDropdown' id='finClassFilter' name='finClassFilter'>");
            filterHTML.push("<option value='empty'>--</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var financialHTML = filterHTML.join("");
            return financialHTML;
        },

        populateFinancialClassFilter: function(data){
            var finFilter = document.getElementById('finClassFilter');
            finFilter.options.length = 0;
            var opt = document.createElement("option");
            opt.value = "empty";
            opt.text = "--";
            finFilter.add(opt);
            for (var i = 0, length = data.length; i < length; i++) {
                var fin = data[i];
                var opt = document.createElement("option");
                opt.value = fin.FIN_CLASS_CD;
                opt.text = fin.FIN_CLASS_DISPLAY;
                finFilter.options.add(opt);
            }
        },

        getSelectedFinancialClasses: function(){
            var finFilterElement = document.getElementById('finClassFilter');
            var finClassFilters = [];
            for (var i = 0; i < finFilterElement.options.length; i++) {
                var finFilter = finFilterElement.options[i];
                if (finFilter.selected && finFilter.value !== "empty") {
                    var option = new RCM_Option(finFilter.value, finFilter.text);
                    finClassFilters.push(option);
                }
            }
            return finClassFilters;
        },


        payerFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='filter'>");
                filterHTML.push("<label for='payerFilter'>",rcm_discharge_i18n.RCM_PAYER_PRIMARY," </label>");
                filterHTML.push("<input type='text' class='searchText'  id='payerFilter' name='payerFilter' />");
                filterHTML.push("<div id='payerTableContainer' class = 'payerTableContainer'>");
                    filterHTML.push("<table id='payerTable' class='filterTable'></table>");
                filterHTML.push("</div>");
            filterHTML.push("</div>");
            var payerHTML = filterHTML.join("");
            return payerHTML;
        },

        getSelectedPayers: function(){
            var finFilterElement = document.getElementById('finClassFilter');
            var selected = [];
            for (var i = 0; i < this.payerFilters.length; i++) {
                var payerFilter = this.payerFilters[i];
                var option = new RCM_Option(payerFilter.ID, payerFilter.NAME);
                selected.push(option);

            }
            return selected;
        },
        relationshipFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='filter'>");
            filterHTML.push("<label for='relationshipFilterDropDown'>", rcm_discharge_i18n.RCM_MY_RELATIONSHIP, "</label>");
            filterHTML.push("<select class='filterDropdown' id='relationshipDropbox' name='relationshipFilterDropDown'>");
            filterHTML.push("<option value='ASSIGNED_TO_ME' selected='selected'>",rcm_discharge_i18n.RCM_ASSIGNED_TO_ME,"</option>");
            filterHTML.push("<option value='ASSIGNED_TO_OTHERS'>",rcm_discharge_i18n.RCM_ASSIGNED_TO_OTHERS,"</option>");
            filterHTML.push("<option value='UNASSIGNED'>",rcm_discharge_i18n.RCM_UNASSIGNED,"</option>");
            filterHTML.push("<option value='ALL'>",rcm_discharge_i18n.RCM_ALL,"</option>");
            filterHTML.push("</select>");
            filterHTML.push("</div>");
            var relationshipHTML = filterHTML.join("");
            return relationshipHTML;
        },

        getSelectedRelationship: function(){
            var relationshipFilterElement = document.getElementById('relationshipDropbox');

            var relationshipFilter = relationshipFilterElement.options[relationshipFilterElement.selectedIndex];
            var option = new RCM_Option(relationshipFilter.value, relationshipFilter.text);

            return option;
        },

        getNextAssessmentDateRange: function(){
            var nextAssessmentFilterElement = document.getElementById('nextAssessmentDropbox');

            var nextAssessmentFilter = nextAssessmentFilterElement.options[nextAssessmentFilterElement.selectedIndex];
            var option = new RCM_Option(nextAssessmentFilter.value, nextAssessmentFilter.text);

            return option;
        },

        nextAssessmentFilter: function(){
            var filterHTML = [];
            filterHTML.push("<div class='filter'>");
                filterHTML.push("<label for='nextAssessmentDropDown'>", rcm_discharge_i18n.RCM_NEXT_DISCHARGE_ASSESSMENT_LOWERCASE, "</label>");
                filterHTML.push("<select class='filterDropdown' id='nextAssessmentDropbox' name='nextAssessmentDropDown'>");
                filterHTML.push("<option value='0' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_TODAY,"</option>");
                filterHTML.push("<option value='1' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_TOMORROW,"</option>");
                filterHTML.push("<option value='2' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_TWO,"</option>");
                filterHTML.push("<option value='3' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_THREE,"</option>");
                filterHTML.push("<option value='4' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_FOUR,"</option>");
                filterHTML.push("<option value='5' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_FIVE,"</option>");
                filterHTML.push("<option value='6' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_SIX,"</option>");
                filterHTML.push("<option value='7' selected='selected'>",rcm_discharge_i18n.RCM_UP_TO_SEVEN,"</option>");
                filterHTML.push("<option value='8' selected='selected'>",rcm_discharge_i18n.RCM_ALL_FUTURE_ASSESSMENTS,"</option>");
                filterHTML.push("</select>");
            filterHTML.push("</div>");
            var dateHTML = filterHTML.join("");
            return dateHTML;
        },

        primarySort: function() {
            var sortHTML = [];
            var sortPrimaryHTMLString = "";
            sortHTML.push("<div class='filter-sorting-dropdown'>");
                   sortHTML.push("<label class='prmySortLabel' for='primarySort'>", rcm_discharge_i18n.RCM_PRIMARY_SORT, "&nbsp;&nbsp;&nbsp;&nbsp;</label>");
                sortHTML.push("<select class='filterPrimSecPatientDropdown' id='primarySort' name='primarySort'>");
                    sortHTML.push("<option value='admissionDate'>", rcm_discharge_i18n.RCM_ADMIT_DATE_LONG, "</option>");
                    sortHTML.push("<option value='attendingPhysician'>", rcm_discharge_i18n.RCM_ATTENDING_PHYSICIAN_LONG, "</option>");
                    sortHTML.push("<option value='dischargeDate'>", rcm_discharge_i18n.RCM_DISCHARGE_SHORT, "</option>");
                    sortHTML.push("<option value='DRGCode'>", rcm_discharge_i18n.RCM_DRG_CODE, "</option>");
                    sortHTML.push("<option value='consultOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_CONSULT_ORDER, "</option>");
                    sortHTML.push("<option value='dischargeOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_ORDER_OR_PENDING_DISCHARGE_ORDER, "</option>");
                    sortHTML.push("<option value='dischargePlanStatus'>", rcm_discharge_i18n.RCM_DISCHARGE_PLAN_STATUS, "</option>");
                    sortHTML.push("<option value='FirstDischargePlanner'>", rcm_discharge_i18n.RCM_DISCHARGE_PLANNER, "</option>");
                    sortHTML.push("<option value='estimatedLengthOfStay'>", rcm_discharge_i18n.RCM_ESTIMATED_LENGTH_OF_STAY, "</option>");
                    sortHTML.push("<option value='encounterType'>", rcm_discharge_i18n.RCM_ENCOUNTER_TYPE_SHORT, "</option>");
                    sortHTML.push("<option value='financialClass'>", rcm_discharge_i18n.RCM_FINANCIAL_CLASS_SHORT, "</option>");
                    sortHTML.push("<option value='financialNumber'>", rcm_discharge_i18n.RCM_FINANCIAL_NUMBER, "</option>");
                    sortHTML.push("<option value='gender'>", rcm_discharge_i18n.RCM_GENDER, "</option>");
                    sortHTML.push("<option value='lengthOfStay'>", rcm_discharge_i18n.RCM_LENGTH_OF_STAY, "</option>");
                    sortHTML.push("<option value='nextDischargeAssessment'>", rcm_discharge_i18n.RCM_NEXT_DISCHARGE_ASSESSMENT, "</option>");
                    sortHTML.push("<option value='location'>", rcm_discharge_i18n.RCM_NURSE_UNIT, "</option>");
                    sortHTML.push("<option value='locationExtended'>", rcm_discharge_i18n.RCM_NURSE_UNIT_ROOM_BED, "</option>");
                    sortHTML.push("<option value='age'>", rcm_discharge_i18n.RCM_PATIENT_AGE, "</option>");
                    sortHTML.push("<option value='patientName'>", rcm_discharge_i18n.RCM_PATIENT_NAME, "</option>");
                    sortHTML.push("<option value='payerName'>", rcm_discharge_i18n.RCM_PAYER_SHORT, "</option>");
                    sortHTML.push("<option value='readmissionAlert'>", rcm_discharge_i18n.RCM_READMISSION_ALERT, "</option>");
                    sortHTML.push("<option value='readmitRiskFactor'>", rcm_discharge_i18n.RCM_READMISSION_RISK_SCORE, "</option>");
                    sortHTML.push("<option value='visitReason'>", rcm_discharge_i18n.RCM_VISIT_REASON, "</option>");
                    sortHTML.push("<option value='discernOrder'></option>");
                    sortHTML.push("<option value='authEndDate'>", rcm_discharge_i18n.RCM_AUTH_END_DATE, "</option>");
                    sortHTML.push("<option value='lastPostAcuteUpdateDate'>", rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE, "</option>");
                sortHTML.push("</select>");
                sortHTML.push("<input type='radio' id='ascendingPrimary' name='ascendingPrimary' value='ascendingPrimary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='ascendingPrimary'>", rcm_discharge_i18n.RCM_ASCENDING, "</label>");
                sortHTML.push("<input type='radio' id='descendingPrimary' name='descendingPrimary' value='descendingPrimary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='descendingPrimary'>", rcm_discharge_i18n.RCM_DESCENDING, "</label>");
            sortHTML.push("</div>");
            sortPrimaryHTMLString = sortHTML.join("");
            return sortPrimaryHTMLString;
        },

        /**
        * shows x hover over
        */
        highlightAndShowX: function(name){
            $(name).addClass("dcWorklist-managerNameHoverOver");
            var hoverRemoveX = $(name).find(".dcWorklist-X-float-right");
            $(hoverRemoveX).css("visibility", "visible")
        },

        /**
        * removes x hover over
        */
        removeHighlightAndHideX: function(name){
            $(name).removeClass("dcWorklist-managerNameHoverOver");
            var hoverRemoveX = $(name).find(".dcWorklist-X-float-right");
            $(hoverRemoveX).css("visibility", "hidden");
        },

        /**
        * Switches X hover into other image
        */
        switchXToOtherXImage: function(name){
            if($(name).hasClass("dcWorklist-remove-x")){
                $(name).removeClass("dcWorklist-remove-x");
                $(name).addClass("dcWorklist-hover-over-remove-x");
            }
            else{
                $(name).removeClass("dcWorklist-hover-over-remove-x");
                $(name).addClass("dcWorklist-remove-x");
            }
        },
        addRowToPayerFilterTable: function(newPayerIdToBeAdded, newPayerNameToBeAdded){
            var newPayerEntry = {
                "ID": newPayerIdToBeAdded,
                "NAME": newPayerNameToBeAdded
            };
            var isAlreadyInList = false;
            for(var i = 0; i < RCM_Filters.payerFilters.length; i++){
                if(Number(RCM_Filters.payerFilters[i].ID) === Number(newPayerEntry.ID) && RCM_Filters.payerFilters[i].NAME === newPayerEntry.NAME){
                    isAlreadyInList = true;
                    break;
                }
            }
            if(!isAlreadyInList){
                RCM_Filters.payerFilters.unshift(newPayerEntry);

                //Add new payer row to table
                var tableRowHTML = [];
                tableRowHTML.push("<tr id='",newPayerIdToBeAdded,"' class='payerFilterRowDisp'");
                tableRowHTML.push("onMouseOver='RCM_Filters.highlightAndShowX(this)' onMouseOut='RCM_Filters.removeHighlightAndHideX(this)'>");
                    tableRowHTML.push("<td><div class='dcWorklist-float-left'>",newPayerNameToBeAdded,"</div>");
                        tableRowHTML.push("<div id='payerFilterRemoveX",newPayerIdToBeAdded,"'class='dcWorklist-X-float-right dcWorklist-remove-x'");
                        tableRowHTML.push("onMouseOver='RCM_Filters.switchXToOtherXImage(this)' onMouseOut='RCM_Filters.switchXToOtherXImage(this)'");
                        tableRowHTML.push("onclick='RCM_Filters.removeRowFromPayerFilterTable(this)'></div></td></tr>");
                $("#payerTable").prepend(tableRowHTML.join(""));
            }
        },
        removeRowFromPayerFilterTable: function(name){
            var payerIdToRemove = $(name).closest("tr").attr("id");
            payerIdToRemove = Number(payerIdToRemove);
            for(var i = 0; i < this.payerFilters.length; i++){
                if(Number(this.payerFilters[i].ID) === payerIdToRemove){
                    this.payerFilters.splice(i, 1);
                }
            }
            $(name).closest("tr").remove();
        },
        secondarySort: function(){
            var sortHTML = [];
            var sortSecondaryHTMLString = "";
            sortHTML.push("<div class='filter-sorting-dropdown'>");
                sortHTML.push("<label for='secondarySort'>", rcm_discharge_i18n.RCM_SECONDARY_SORT, "</label>");
                sortHTML.push("<select class='filterPrimSecPatientDropdown' id='secondarySort' name='secondarySort'>");
                    sortHTML.push("<option value='empty'>--</option>");
                    sortHTML.push("<option value='admissionDate'>",rcm_discharge_i18n.RCM_ADMIT_DATE_LONG,"</option>");
                    sortHTML.push("<option value='attendingPhysician'>",rcm_discharge_i18n.RCM_ATTENDING_PHYSICIAN_LONG,"</option>");
                    sortHTML.push("<option value='dischargeDate'>",rcm_discharge_i18n.RCM_DISCHARGE_SHORT,"</option>");
                    sortHTML.push("<option value='DRGCode'>",rcm_discharge_i18n.RCM_DRG_CODE,"</option>");
                    sortHTML.push("<option value='consultOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_CONSULT_ORDER, "</option>");
                    sortHTML.push("<option value='dischargeOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_ORDER_OR_PENDING_DISCHARGE_ORDER, "</option>");
                    sortHTML.push("<option value='dischargePlanStatus'>",rcm_discharge_i18n.RCM_DISCHARGE_PLAN_STATUS,"</option>");
                    sortHTML.push("<option value='FirstDischargePlanner'>",rcm_discharge_i18n.RCM_DISCHARGE_PLANNER,"</option>");
                    sortHTML.push("<option value='estimatedLengthOfStay'>",rcm_discharge_i18n.RCM_ESTIMATED_LENGTH_OF_STAY,"</option>");
                    sortHTML.push("<option value='encounterType'>",rcm_discharge_i18n.RCM_ENCOUNTER_TYPE_SHORT,"</option>");
                    sortHTML.push("<option value='financialClass'>",rcm_discharge_i18n.RCM_FINANCIAL_CLASS_SHORT,"</option>");
                    sortHTML.push("<option value='financialNumber'>",rcm_discharge_i18n.RCM_FINANCIAL_NUMBER,"</option>");
                    sortHTML.push("<option value='gender'>",rcm_discharge_i18n.RCM_GENDER,"</option>");
                    sortHTML.push("<option value='lengthOfStay'>",rcm_discharge_i18n.RCM_LENGTH_OF_STAY,"</option>");
                    sortHTML.push("<option value='nextDischargeAssessment'>",rcm_discharge_i18n.RCM_NEXT_DISCHARGE_ASSESSMENT,"</option>");
                    sortHTML.push("<option value='locationExtended'>",rcm_discharge_i18n.RCM_NURSE_UNIT_ROOM_BED,"</option>");
                    sortHTML.push("<option value='age'>",rcm_discharge_i18n.RCM_PATIENT_AGE,"</option>");
                    sortHTML.push("<option value='patientName'>",rcm_discharge_i18n.RCM_PATIENT_NAME,"</option>");
                    sortHTML.push("<option value='payerName'>",rcm_discharge_i18n.RCM_PAYER_SHORT,"</option>");
                    sortHTML.push("<option value='readmissionAlert'>",rcm_discharge_i18n.RCM_READMISSION_ALERT,"</option>");
                    sortHTML.push("<option value='readmitRiskFactor'>",rcm_discharge_i18n.RCM_READMISSION_RISK_SCORE,"</option>");
                    sortHTML.push("<option value='visitReason'>",rcm_discharge_i18n.RCM_VISIT_REASON,"</option>");
                    sortHTML.push("<option value='discernOrder'></option>");
                    sortHTML.push("<option value='authEndDate'>",rcm_discharge_i18n.RCM_AUTH_END_DATE,"</option>");
                    sortHTML.push("<option value='lastPostAcuteUpdateDate'>",rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE,"</option>"); 
                sortHTML.push("</select>");
                sortHTML.push("<input type='radio' id='ascendingSecondary' name='ascendingSecondary' value='ascendingSecondary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='ascendingSecondary'>", rcm_discharge_i18n.RCM_ASCENDING, "</label>");
                sortHTML.push("<input type='radio' id='descendingSecondary' name='descendingSecondary' value='descendingSecondary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='descendingSecondary'>", rcm_discharge_i18n.RCM_DESCENDING, "</label>");
            sortHTML.push("</div>");
            sortSecondaryHTMLString = sortHTML.join("");
            return sortSecondaryHTMLString;
        },

        tertiarySort: function(){
            var sortHTML = [];
            var sortTertiaryHTMLString = "";
            sortHTML.push("<div class='filter-sorting-dropdown'>");
                sortHTML.push("<label for='tertiarySort'>", rcm_discharge_i18n.RCM_TERTIARY_SORT, "&nbsp;&nbsp;&nbsp;&nbsp;</label>");
                sortHTML.push("<select class='filterPrimSecPatientDropdown' id='tertiarySort' name='tertiarySort'>");
                    sortHTML.push("<option value='empty'>--</option>");
                    sortHTML.push("<option value='admissionDate'>",rcm_discharge_i18n.RCM_ADMIT_DATE_LONG,"</option>");
                    sortHTML.push("<option value='attendingPhysician'>",rcm_discharge_i18n.RCM_ATTENDING_PHYSICIAN_LONG,"</option>");
                    sortHTML.push("<option value='dischargeDate'>",rcm_discharge_i18n.RCM_DISCHARGE_SHORT,"</option>");
                    sortHTML.push("<option value='DRGCode'>",rcm_discharge_i18n.RCM_DRG_CODE,"</option>");
                    sortHTML.push("<option value='consultOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_CONSULT_ORDER, "</option>");
                    sortHTML.push("<option value='dischargeOrder'>", rcm_discharge_i18n.RCM_DISCHARGE_ORDER_OR_PENDING_DISCHARGE_ORDER, "</option>");
                    sortHTML.push("<option value='dischargePlanStatus'>",rcm_discharge_i18n.RCM_DISCHARGE_PLAN_STATUS,"</option>");
                    sortHTML.push("<option value='FirstDischargePlanner'>",rcm_discharge_i18n.RCM_DISCHARGE_PLANNER,"</option>");
                    sortHTML.push("<option value='estimatedLengthOfStay'>",rcm_discharge_i18n.RCM_ESTIMATED_LENGTH_OF_STAY,"</option>");
                    sortHTML.push("<option value='encounterType'>",rcm_discharge_i18n.RCM_ENCOUNTER_TYPE_SHORT,"</option>");
                    sortHTML.push("<option value='financialClass'>",rcm_discharge_i18n.RCM_FINANCIAL_CLASS_SHORT,"</option>");
                    sortHTML.push("<option value='financialNumber'>",rcm_discharge_i18n.RCM_FINANCIAL_NUMBER,"</option>");
                    sortHTML.push("<option value='gender'>",rcm_discharge_i18n.RCM_GENDER,"</option>");
                    sortHTML.push("<option value='lengthOfStay'>",rcm_discharge_i18n.RCM_LENGTH_OF_STAY,"</option>");
                    sortHTML.push("<option value='nextDischargeAssessment'>",rcm_discharge_i18n.RCM_NEXT_DISCHARGE_ASSESSMENT,"</option>");
                    sortHTML.push("<option value='locationExtended'>",rcm_discharge_i18n.RCM_NURSE_UNIT_ROOM_BED,"</option>");
                    sortHTML.push("<option value='age'>",rcm_discharge_i18n.RCM_PATIENT_AGE,"</option>");
                    sortHTML.push("<option value='patientName'>",rcm_discharge_i18n.RCM_PATIENT_NAME,"</option>");
                    sortHTML.push("<option value='payerName'>",rcm_discharge_i18n.RCM_PAYER_SHORT,"</option>");
                    sortHTML.push("<option value='readmissionAlert'>",rcm_discharge_i18n.RCM_READMISSION_ALERT,"</option>");
                    sortHTML.push("<option value='readmitRiskFactor'>",rcm_discharge_i18n.RCM_READMISSION_RISK_SCORE,"</option>");
                    sortHTML.push("<option value='visitReason'>",rcm_discharge_i18n.RCM_VISIT_REASON,"</option>");
                    sortHTML.push("<option value='discernOrder'></option>");
                    sortHTML.push("<option value='authEndDate'>",rcm_discharge_i18n.RCM_AUTH_END_DATE,"</option>");
                    sortHTML.push("<option value='lastPostAcuteUpdateDate'>",rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE,"</option>");                 
                sortHTML.push("</select>");
                sortHTML.push("<input type='radio' id='ascendingTertiary' name='ascendingTertiary' value='ascendingTertiary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='ascendingTertiary'>", rcm_discharge_i18n.RCM_ASCENDING, "</label>");
                sortHTML.push("<input type='radio' id='descendingTertiary' name='descendingTertiary' value='descendingTertiary' onclick='RCM_Filters.uncheckOtherRadioButtons(this)'/>");
                sortHTML.push("<label for='descendingTertiary'>", rcm_discharge_i18n.RCM_DESCENDING, "</label>");
            sortHTML.push("</div>");
            sortTertiaryHTMLString = sortHTML.join("");
            return sortTertiaryHTMLString;
        },

        uncheckOtherRadioButtons: function(radioSelected){
            if(radioSelected.id === "ascendingPrimary"){
                document.getElementById('descendingPrimary').checked = false;
            }
            if(radioSelected.id === "descendingPrimary"){
                document.getElementById('ascendingPrimary').checked = false;
            }
            if(radioSelected.id === "ascendingSecondary"){
                document.getElementById('descendingSecondary').checked = false;
            }
            if(radioSelected.id === "descendingSecondary"){
                document.getElementById('ascendingSecondary').checked = false;
            }
            if(radioSelected.id === "ascendingTertiary"){
                document.getElementById('descendingTertiary').checked = false;
            }
            if(radioSelected.id === "descendingTertiary"){
                document.getElementById('ascendingTertiary').checked = false;
            }
        },

        setDiscernOrderLabel: function(discernOrderLabel){
            if(discernOrderLabel){
                $("#primarySort option[value='discernOrder']").text(discernOrderLabel);
                $("#secondarySort option[value='discernOrder']").text(discernOrderLabel);
                $("#tertiarySort option[value='discernOrder']").text(discernOrderLabel);
            }
            else{
                $("#primarySort option[value='discernOrder']").text(rcm_discharge_i18n.RCM_ADDITIONAL_ORDER);
                $("#secondarySort option[value='discernOrder']").text(rcm_discharge_i18n.RCM_ADDITIONAL_ORDER);
                $("#tertiarySort option[value='discernOrder']").text(rcm_discharge_i18n.RCM_ADDITIONAL_ORDER);
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
        }
    };
}();

