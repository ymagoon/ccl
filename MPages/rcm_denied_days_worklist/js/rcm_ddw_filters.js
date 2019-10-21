function RCMDDWFilters(criterion){
	var serviceDelegate = new DeniedDaysWorklistDelegate();
	var filtersListeners = [];
	var appliedFilters = [];
	var resizeendDate = new Date(1, 1, 2000, 12,00,00); 
	var resizeendTimeout = false; 
	var resizeendDelta = 20; 
	
	this.getFilterBoxHTML = function(){
		var htmlArray = [];
		htmlArray.push("<div id='ddwFilters'>");
		htmlArray.push("<div class='ddw-filters'>");
		createFilters();
		htmlArray.push(filterButton());
		htmlArray.push("</div>");
		htmlArray.push("<div id='ddwAppliedFilters' class='ddw-appliedFilters'></div>");
		htmlArray.push("<div id='ddwPatientCount' class='ddw-appliedFiltersPatientCount'></div>");
		htmlArray.push("<div class='ddw-surroundAllFloatingDivs'></div>");
		htmlArray.push("</div>");
		var deniedDayDefaultFilters = serviceDelegate.getFilterDefaults();
        setDefaultFilters(deniedDayDefaultFilters);
        setAppliedFilters();
		return htmlArray.join("");
	};
        
    this.addFiltersListener = function(listener){
		displayAppliedFilters();
        filtersListeners.push(listener);
     };

	 this.addPatientCountString = function(recordNum){
		 var patientCountString = "<div id='ddwPatientListCountDiv' class='ddw-patientCountWhitePipeLine'>" + rcm_ddw_worklist_i18n.PATIENTS + ": " + recordNum + "</div>";
		$("#ddwPatientCount").html(patientCountString);
		//reset the height so if the dswlFilters div was previously tall
		//and shrinks down, the dswlPatientCount div will shrink too
		$("#ddwPatientCount").height(0);
		$("#ddwPatientCount").height($("#ddwFilters").height());
		$("#ddwPatientListCountDiv").height($("#ddwPatientCount").height());
	};
	
	 this.getDefaultsObj = function(){
	 	return makeDefaultsObj();
	 };
        
     function notifyFiltersListeners(defaultsObj){
        for (var i = 0; i < filtersListeners.length; i++) {
            filtersListeners[i](defaultsObj);
        }
     };
		
	function getAppliedFilters(){
		return appliedFilters;
	};
        
    this.initialize = function(){			
        $("#ddw-filter-button-apply").click(function(){
            acceptFilters();
        });
        
        $("#ddw-filter-button-cancel").click(function(){
            cancelFilters();
        });
		
		$("#ddw-filter-button-image").mousedown(function(){
			$("#filterBox").toggle();
			if($("#filterBox").is(":visible")){
				resizeFilterBox();
			}
		});
		
		$("#ascendingPrimary").click(function(){
			uncheckOtherRadioButtons(this);
		});
		
		$("#descendingPrimary").click(function(){
			uncheckOtherRadioButtons(this);
		});
		
		$("#ascendingSecondary").click(function(){
			uncheckOtherRadioButtons(this);
		});
		
		$("#descendingSecondary").click(function(){
			uncheckOtherRadioButtons(this);
		});
		
		$(window).resize(function(){
			resizeendDate= new Date();
			if (resizeendTimeout  === false){
				resizeendTimeout  = true;
				setTimeout(resizeend, resizeendDelta);
			}	
		});
    };
		
    function displayAppliedFilters(){
    	var displayString = "";
        var appliedFiltersDiv = document.getElementById("ddwAppliedFilters");
        var relationshipFilterElement = document.getElementById('relationshipDropbox');
        var relationshipFilter = relationshipFilterElement.options[relationshipFilterElement.selectedIndex];
        displayString += relationshipFilter.text;
        
        if ($('#denialsWithAppealsCheckbox').prop("checked")){
        	if (displayString.length > 0){
            	displayString+=" | ";
    		}
        	displayString += rcm_ddw_worklist_i18n.DENIALS_WITH_APPEALS_INCLUDE;
        }
        
        appliedFiltersDiv.innerHTML = displayString;
    };
        
    function createFilters(){
		var boxDiv = document.createElement("div");
            boxDiv.id = "filterBox";
            boxDiv.className = "ddw-filter-box";
            
        var htmlArray = [];
        //htmlArray.push("<div id='filterBox' class='ddw-filter-box'>");
        
        // Header
        htmlArray.push("<div class='ddw-filter-title-bar'>");
        htmlArray.push("<label class='ddw-filter-title'>", rcm_ddw_worklist_i18n.FILTER_SETTINGS, "</label>");
        htmlArray.push("</div>");
        
		htmlArray.push("<div id = 'filterBox-scrollable-content'>");
		
        // Filters
        htmlArray.push(relationshipFilter());
        htmlArray.push("<div class='ddw-filter-include'>");
        htmlArray.push("<label>", rcm_ddw_worklist_i18n.INCLUDE_PATIENTS_WITH, "</label>");
        htmlArray.push("</div>");
        htmlArray.push(showDenialsWithAppealsFilter());
        
        // Sorting
        htmlArray.push("<div class='ddw-separator'></div>");
        htmlArray.push("<div class='ddw-filter-sorting'>");
        htmlArray.push("<label class='ddw-filter-sorting-header' for='primary'>", rcm_ddw_worklist_i18n.SORTING, "</label>");
        htmlArray.push("<div>");
        htmlArray.push(primarySort());
        htmlArray.push("</div>");
        htmlArray.push("<div>");
        htmlArray.push(secondarySort());
        htmlArray.push("</div>");
        htmlArray.push("</div>");
		
		htmlArray.push("</div>");
        
        // Save Checkbox and Accept/Cancel Buttons			
        htmlArray.push("<div class='ddw-filter-save-area' id='saveConfigurationDiv'>");
        htmlArray.push("<input type='checkbox' id='saveConfigurationCheckbox' name='saveConfigurationCheckbox' onClick=''></input>");
        htmlArray.push("<label  for='saveConfigurationCheckbox'>", rcm_ddw_worklist_i18n.SAVE_CONFIGURATION, "</label>");
        htmlArray.push("<button id='ddw-filter-button-apply' class='ddw-filter-button-apply'>", rcm_ddw_worklist_i18n.APPLY, "</button>&nbsp;");
        htmlArray.push("<button id='ddw-filter-button-cancel' class='ddw-filter-button-cancel'>", rcm_ddw_worklist_i18n.CANCEL, "</button>");
        htmlArray.push("</div>");
		
		var html = htmlArray.join("");
        boxDiv.innerHTML = html;
        document.body.appendChild(boxDiv);
    };
    
	function setAppliedFilters(){
		var relationshipFilterElement = document.getElementById('relationshipDropbox');
        var relationshipFilter = relationshipFilterElement.options[relationshipFilterElement.selectedIndex].text;
		appliedFilters.relationship = relationshipFilter;
		
		var primarySort = document.getElementById("primarySort").value;
		
		var primarySortAscending = document.getElementById("ascendingPrimary").checked;
		
		var secondarySort = document.getElementById("secondarySort").value;
		
		var secondarySortAscending = document.getElementById("ascendingSecondary").checked;
		
		var showDenialsWithAppealsInd = $('#denialsWithAppealsCheckbox').prop("checked");
		
		appliedFilters.primarySort = primarySort;
		appliedFilters.primarySortAscending = primarySortAscending;
		appliedFilters.secondarySort = secondarySort;
		appliedFilters.secondarySortAscending = secondarySortAscending;
		appliedFilters.showDenialsWithAppealsInd = showDenialsWithAppealsInd ? 1 : 0;
		
	};
	
    function acceptFilters(){
       	setAppliedFilters();
		displayAppliedFilters()
        $("#filterBox").hide();
		var defaultFilterObject = makeDefaultsObj();
        if (document.getElementById("saveConfigurationCheckbox").checked) {
            saveDefaultsToConfig(defaultFilterObject);
        }
        notifyFiltersListeners(defaultFilterObject);
    };
	
	function makeDefaultsObj(){
			var sendAssignedTo = $("#relationshipDropbox").val();
            var defaultPrimarySortColumn = $("#primarySort").val();
            var defaultPrimarySortDir = 1;
            if ($("#ascendingPrimary").is(":checked")) {
                defaultPrimarySortDir = 0;
            }
            
            var defaultSecondarySortColumn = $("#secondarySort").val();
            var defaultSecondarySortDir = 1;
            if ($("#ascendingSecondary").is(":checked")) {
                defaultSecondarySortDir = 0;
            }
            
            var showDenialsWithAppealsInd = 0;
            if ($('#denialsWithAppealsCheckbox').prop("checked")){
            	showDenialsWithAppealsInd = 1;
            }            
            
            var defaultsObj = {
                defaultAssignedTo: sendAssignedTo,
                defaultPrimarySortColumn: defaultPrimarySortColumn,
                defaultPrimarySortDir: defaultPrimarySortDir,
                defaultSecondarySortColumn: defaultSecondarySortColumn,
                defaultSecondarySortDir: defaultSecondarySortDir,
                showDenialsWithAppealsInd: showDenialsWithAppealsInd
            }
			return defaultsObj;
	};
		
    function saveDefaultsToConfig(defaultsObj){
			serviceDelegate.saveDefaults(defaultsObj);
            document.getElementById("saveConfigurationCheckbox").checked = false;
    };
        
    function cancelFilters(){
       $("#filterBox").hide();
        
        var appliedFilters = getAppliedFilters();
        
        //Relationship Dropdown Box
        var relFilter = document.getElementById('relationshipDropbox');
        for (var i = 0; i < relFilter.options.length; i++) {
            if (relFilter.options[i].text === appliedFilters.relationship) {
                relFilter.options[i].selected = true;
            }
        }
        
        //Primary Sort Dropdown Box
        var primString;
        if (appliedFilters.primarySort === "") {
            primString = "--";
        }
        else {
            primString = appliedFilters.primarySort;
        }
        var primSortFilter = document.getElementById('primarySort');
        for (var i = 0; i < primSortFilter.options.length; i++) {
            if (primSortFilter.options[i].value === primString) {
                primSortFilter.options[i].selected = true;
            }
        }
        
        //Primary Sort Radio Buttons
        if (appliedFilters.primarySortAscending === false) {
            document.getElementById('ascendingPrimary').checked = false;
            document.getElementById('descendingPrimary').checked = true;
        }
        else {
            document.getElementById('descendingPrimary').checked = false;
            document.getElementById('ascendingPrimary').checked = true;
        }
        
        //Secondary Sort Dropdown Box
        var secString;
        if (appliedFilters.secondarySort === "") {
            secString = "--";
        }
        else {
            secString = appliedFilters.secondarySort;
        }
        var secSortFilter = document.getElementById('secondarySort');
        for (var i = 0; i < secSortFilter.options.length; i++) {
            if (secSortFilter.options[i].value === secString) {
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
        
        if (appliedFilters.showDenialsWithAppealsInd === 1){
        	$('#denialsWithAppealsCheckbox').prop("checked", true);
        }
        else{
        	$('#denialsWithAppealsCheckbox').prop("checked", false);
        }
        
        document.getElementById('saveConfigurationCheckbox').checked = false;
    };
		
    function setDefaultFilters(deniedDayDefaultFilters){
        //Primary Sort(Column)
        var defaultPrimarySortColumn = deniedDayDefaultFilters.defaultPrimarySortColumn;
        var primarySort = document.getElementById('primarySort');
        if (defaultPrimarySortColumn) {
            for (var i = 0; i < primarySort.options.length; i++) {
                var opt = primarySort.options[i];
                if (opt.value === defaultPrimarySortColumn) {
                    opt.selected = true;
                    break;
                }
            }
        }
        else {
            var length = primarySort.options.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if (primarySort.options[i].value == "appealByDate") {
                        primarySort.options[i].selected = true;
                        break;
                    }
                }
            }
        }
        
        //Primary Sort(Direction)
        var defaultPrimarySortDirection = deniedDayDefaultFilters.defaultPrimarySortDir;
        var primarySortAscending = document.getElementById('ascendingPrimary');
        var primarySortDescending = document.getElementById('descendingPrimary');
        if (defaultPrimarySortDirection) {//1 equals descending, 0 equals ascending
            primarySortDescending.checked = true;
            primarySortAscending.checked = false;
        }
        else {
            primarySortAscending.checked = true;
            primarySortDescending.checked = false;
        }
        
        
        //Secondary Sort(Column)
        var defaultSecondarySortColumn = deniedDayDefaultFilters.defaultSecondarySortColumn;
        var secondarySort = document.getElementById('secondarySort');
        if (defaultPrimarySortColumn && defaultSecondarySortColumn) {
            for (var i = 0; i < secondarySort.options.length; i++) {
                var opt = secondarySort.options[i];
                if (opt.value === defaultSecondarySortColumn) {
                    opt.selected = true;
                    break;
                }
            }
        }
        else 
            if (defaultPrimarySortColumn && !defaultSecondarySortColumn) {
                for (var i = 0; i < secondarySort.options.length; i++) {
                    if (secondarySort.options[i].value == "empty") {
                        secondarySort.options[i].selected = true;
                        break;
                    }
                }
            }
            else {
                for (var i = 0; i < secondarySort.options.length; i++) {
                    if (secondarySort.options[i].value == "denialRiskAmount") {
                        secondarySort.options[i].selected = true;
                        break;
                    }
                }
            }
        
        //Secondary Sort(Direction)
        var defaultSecondarySortDirection = deniedDayDefaultFilters.defaultSecondarySortDir;
        var secondarySortAscending = document.getElementById('ascendingSecondary');
        var secondarySortDescending = document.getElementById('descendingSecondary');
        if (defaultSecondarySortDirection) {//1 equals descending, 0 equals ascending
            secondarySortDescending.checked = true;
            secondarySortAscending.checked = false;
        }
		else if (!defaultPrimarySortColumn && !defaultSecondarySortColumn){//set default
			secondarySortAscending.checked = false;
            secondarySortDescending.checked = true;
		}
        else {
            secondarySortAscending.checked = true;
            secondarySortDescending.checked = false;
        }
		
        //Relationship
        var defaultAssignedTo = deniedDayDefaultFilters.defaultAssignedTo;
        var relationshipElement = document.getElementById('relationshipDropbox');
        if (defaultAssignedTo) {
            if (defaultAssignedTo) {
                var selection = 0;
                if (defaultAssignedTo === "OTHERS") {
                    selection = 1;
                }
                else if (defaultAssignedTo === "ALL") {
					selection = 2;
				}
				else if (defaultAssignedTo === "UNASSIGNED") {
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
        
        //Show denials with appeals
        var showDenialsWithAppealsInd = deniedDayDefaultFilters.showDenialsWithAppealsInd;
        if (showDenialsWithAppealsInd === 1) {
        	$('#denialsWithAppealsCheckbox').prop("checked", true);
        }
        else{
        	$('#denialsWithAppealsCheckbox').prop("checked", false);
        }
        
    };
        
    function filterButton(){
        var loc = criterion.static_content;
        var filterHTML = "";
        var buttonHTMLArray = [];
        buttonHTMLArray.push("<input id='ddw-filter-button-image' class='ddw-filter-button-image' type='image' src='", loc, "\\images\\4342.ico' title='",rcm_ddw_worklist_i18n.FILTERS,"'/>");
        filterHTML = buttonHTMLArray.join("");
        return filterHTML;
    };

	function resizeend(){
		if (new Date() - resizeendDate < resizeendDelta){
			setTimeout(resizeend, resizeendDelta);
		}
	else{
			resizeendTimeout = false;
			if($("#filterBox").is(":visible")){
				resizeFilterBox();
			}
		}
	};
	function resizeFilterBox(){
		$("#filterBox-scrollable-content").css("height", "auto");
		$("#filterBox-scrollable-content").css("height-max", 215);
		$("#filterBox-scrollable-content").css("width", 525);
		$("#filterBox").css("width", 525);
		$("#filterBox-scrollable-content").css("overflow-y", "hidden")
		$("#filterBox-scrollable-content").css("overflow-x", "hidden");
		var htmlHeight = document.documentElement.clientHeight;
		var htmlWidth = document.documentElement.clientWidth;				
		if(htmlWidth <525){			
			$("#filterBox-scrollable-content").css("overflow-x", "scroll")
			$("#filterBox-scrollable-content").css("width", (htmlWidth -15));
			$("#filterBox").css("width", (htmlWidth-15));
		}	
		
		var filterBoxHeight = $("#filterBox").height();
		if((filterBoxHeight + 72) > htmlHeight){
			$("#filterBox-scrollable-content").css("height", (htmlHeight - 180));
			$("#filterBox-scrollable-content").css("overflow-y", "scroll");	
		}
	};
        
    function relationshipFilter(){
        var filterHTML = [];
        filterHTML.push("<div class='ddw-filter'>");
        filterHTML.push("<label for='relationshipFilterDropDown'>", rcm_ddw_worklist_i18n.RELATIONSHIP, "</label>");
        filterHTML.push("<select class='ddw-filterDropdown' id='relationshipDropbox' name='relationshipFilterDropDown'>");
        filterHTML.push("<option value='ME' selected='selected'>", rcm_ddw_worklist_i18n.ASSIGNED_TO_ME, "</option>");
        filterHTML.push("<option value='OTHERS'>", rcm_ddw_worklist_i18n.ASSIGNED_TO_OTHERS, "</option>");
        filterHTML.push("<option value='ALL'>", rcm_ddw_worklist_i18n.ALL, "</option>");
		filterHTML.push("<option value='UNASSIGNED'>", rcm_ddw_worklist_i18n.UNASSIGNED, "</option>");
        filterHTML.push("</select>");
        filterHTML.push("</div>");
        var relationshipHTML = filterHTML.join("");
        return relationshipHTML;
    };
    
    function showDenialsWithAppealsFilter(){
        var filterHTML = [];
        filterHTML.push("<div class='ddw-filter'>");
        filterHTML.push("<input type='checkbox' id='denialsWithAppealsCheckbox' name='denialsWithAppealsCheckbox' onClick=''></input>");
        filterHTML.push("<label for='denialsWithAppealsCheckbox'>", rcm_ddw_worklist_i18n.DENIALS_WITH_APPEALS, "</label>");
        filterHTML.push("</div>");
        var denialsWithAppealsHtml = filterHTML.join("");
        return denialsWithAppealsHtml;
    };
        
    function primarySort(){
        var sortHTML = [];
        var sortPrimaryHTMLString = "";
        sortHTML.push("<div class='ddw-filter-sorting-dropdown'>");
        sortHTML.push("<label class='ddw-prmySortLabel' for='primarySort'>", rcm_ddw_worklist_i18n.PRIMARY_SORT, "</label>");
        sortHTML.push("<select class='ddw-sortDropdown' id='primarySort' name='primarySort'>");
        sortHTML.push("<option value='facility'>",rcm_ddw_worklist_i18n.FACILITY,"</option>");
        sortHTML.push("<option value='patientName'>",rcm_ddw_worklist_i18n.PATIENT_NAME,"</option>");
        sortHTML.push("<option value='appealByDate'>",rcm_ddw_worklist_i18n.APPEAL_DEADLINE,"</option>");
        sortHTML.push("<option value='denialRiskAmount'>",rcm_ddw_worklist_i18n.RISK_AMOUNT,"</option>");
		sortHTML.push("<option value='begDate'>",rcm_ddw_worklist_i18n.DENIED_DAYS,"</option>");
		sortHTML.push("<option value='denialReason'>",rcm_ddw_worklist_i18n.REASON,"</option>");
		sortHTML.push("<option value='denialType'>",rcm_ddw_worklist_i18n.TYPE,"</option>");
		sortHTML.push("<option value='letterDate'>",rcm_ddw_worklist_i18n.LETTER_DATE,"</option>");
		sortHTML.push("<option value='payer'>",rcm_ddw_worklist_i18n.PAYER,"</option>");
		sortHTML.push("<option value='denialManager'>",rcm_ddw_worklist_i18n.DENIAL_MANAGER,"</option>");
        sortHTML.push("</select>");
        sortHTML.push("<input type='radio' id='ascendingPrimary' name='ascendingPrimary' value='ascendingPrimary'/>");
        sortHTML.push("<label for='ascendingPrimary'>", rcm_ddw_worklist_i18n.ASCENDING, "</label>");
        sortHTML.push("<input type='radio' id='descendingPrimary' name='descendingPrimary' value='descendingPrimary'/>");
        sortHTML.push("<label for='descendingPrimary'>", rcm_ddw_worklist_i18n.DESCENDING, "</label>");
        sortHTML.push("</div>");
        sortPrimaryHTMLString = sortHTML.join("");
        return sortPrimaryHTMLString;
    };
		
    function secondarySort(){
        var sortHTML = [];
        var sortSecondaryHTMLString = "";
        sortHTML.push("<div class='ddw-filter-sorting-dropdown'>");
        sortHTML.push("<label for='secondarySort'>", rcm_ddw_worklist_i18n.SECONDARY_SORT, "</label>");
        sortHTML.push("<select class='ddw-sortDropdown' id='secondarySort' name='secondarySort'>");
        sortHTML.push("<option value='empty'>--</option>");
        sortHTML.push("<option value='facility'>",rcm_ddw_worklist_i18n.FACILITY,"</option>");
        sortHTML.push("<option value='patientName'>",rcm_ddw_worklist_i18n.PATIENT_NAME,"</option>");
        sortHTML.push("<option value='appealByDate'>",rcm_ddw_worklist_i18n.APPEAL_DEADLINE,"</option>");
        sortHTML.push("<option value='denialRiskAmount'>",rcm_ddw_worklist_i18n.RISK_AMOUNT,"</option>");
		sortHTML.push("<option value='begDate'>",rcm_ddw_worklist_i18n.DENIED_DAYS,"</option>");
		sortHTML.push("<option value='denialReason'>",rcm_ddw_worklist_i18n.REASON,"</option>");
		sortHTML.push("<option value='denialType'>",rcm_ddw_worklist_i18n.TYPE,"</option>");
		sortHTML.push("<option value='letterDate'>",rcm_ddw_worklist_i18n.LETTER_DATE,"</option>");
		sortHTML.push("<option value='payer'>",rcm_ddw_worklist_i18n.PAYER,"</option>");
		sortHTML.push("<option value='denialManager'>",rcm_ddw_worklist_i18n.DENIAL_MANAGER,"</option>");
        sortHTML.push("</select>");
        sortHTML.push("<input type='radio' id='ascendingSecondary' name='ascendingSecondary' value='ascendingSecondary'/>");
        sortHTML.push("<label for='ascendingSecondary'>", rcm_ddw_worklist_i18n.ASCENDING, "</label>");
        sortHTML.push("<input type='radio' id='descendingSecondary' name='descendingSecondary' value='descendingSecondary'/>");
        sortHTML.push("<label for='descendingSecondary'>", rcm_ddw_worklist_i18n.DESCENDING, "</label>");
        sortHTML.push("</div>");
        sortSecondaryHTMLString = sortHTML.join("");
        return sortSecondaryHTMLString;
    };
		
    function uncheckOtherRadioButtons(radioSelected){
        if (radioSelected.id === "ascendingPrimary") {
            document.getElementById('descendingPrimary').checked = false;
        }
        if (radioSelected.id === "descendingPrimary") {
            document.getElementById('ascendingPrimary').checked = false;
        }
        if (radioSelected.id === "ascendingSecondary") {
            document.getElementById('descendingSecondary').checked = false;
        }
        if (radioSelected.id === "descendingSecondary") {
            document.getElementById('ascendingSecondary').checked = false;
        }
    };
    
};

