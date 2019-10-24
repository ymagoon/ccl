function RCM_ASWL_Worklist(){
	var refreshListeners = [];
	var providerSearchControl;
	var delegate = new AssignmentWorklistDelegate();
	var canAssign;
	var canUnassign;
	var cmDefined;
	var dpDefined;
	var dsDefined;
	var formObject = {};
	var splitButtonAssign;
	var personnelAssignment = [];
	var selected = 0;
	var nonRelationshipSelected = 0;
	var selectedOptionCurrentAssignment = 0;
	var worklistItemsResult;

	/**
	 * This listener is used to create a copy of the provider search control and to keep two provider search controls in sync.
	 */
	this.floatingHeaderListener = function() {
	   	 var floatingHeader = document.getElementById('copiedtableHeader');
		 var oldProviderSearchControl = providerSearchControl;
		 var oldProviderSearchTextId = 'aswlProviderSearch';
		 var copyproviderSearchText = $(floatingHeader).find('input[id='+ oldProviderSearchTextId +']:text').get(0);
		 copyproviderSearchText.id = 'copyaswlProviderSearch';

		 var oldBttons = $('#aswlProviderDiv').find(':button');
		 $.each(oldBttons, function(index, oldButton) {
		    $(floatingHeader).find('#'+ oldButton.id).attr("id", "copy" + oldButton.id);
		 });

		var oldSelect = $('#aswlProviderDiv').find('.aswl-currentAssignment-dropdown').attr('id');
		$(floatingHeader).find('#' + oldSelect).attr("id", "copy" + oldSelect);

		 if (oldProviderSearchControl && copyproviderSearchText) {
			 var oldProviderSearchText = document.getElementById(oldProviderSearchTextId);
		     var oldProviderId = oldProviderSearchControl.getSelectedProviderId();

		     //set copy provider search control
		     var copyProviderSearchControl = new ProviderSearchControl(copyproviderSearchText);
		     copyProviderSearchControl.setSelectedProvider(oldProviderId, oldProviderSearchText.value);
		 	 RCM_Clinical_Util.setSearchControlRequired(true, formObject, "copyaswlProviderSearch", copyProviderSearchControl, ["copyassignSplitButton"]);
		 	 requireDataElements();

		 	 var changeOldProviderSearch = true;
		 	 var changeCopyProviderSearchChanged = true;
		     // Always sync up the floating provider search control with the non-floating provider search control.
		     oldProviderSearchControl.addVerifyStateChangeListener(function() {
		   	 	if ( providerSearchControl.isVerified()) {
				 	copyproviderSearchText.value = oldProviderSearchText.value;
				 	copyProviderSearchControl.setSelectedProvider(providerSearchControl.getSelectedProviderId(), oldProviderSearchText.value);
			 	}
			});

		     $(oldProviderSearchText).change(function(){
		    	 if (! oldProviderSearchControl.isVerified()) {
		    		 copyproviderSearchText.value = "";
		    		 copyProviderSearchControl.setSelectedProvider(0, "");
		    	 }
		     });

		     $(copyproviderSearchText).change(function(){
		    	 if (! copyProviderSearchControl.isVerified())  {
		       		 oldProviderSearchText.value = "";
		    		 oldProviderSearchControl.setSelectedProvider(0, "");
		    	 }
		     });

			copyProviderSearchControl.addVerifyStateChangeListener(function() {
		   	 	if (copyProviderSearchControl.isVerified()) {
				 	oldProviderSearchText.value = copyproviderSearchText.value;
				 	oldProviderSearchControl.setSelectedProvider(copyProviderSearchControl.getSelectedProviderId(), copyproviderSearchText.value);
			 	}
			});
		 }

		 var resetButtonVisibility = function(){
			 var oldBttons = $('#aswlProviderDiv').find(':button');
			 $.each(oldBttons, function(index, oldButton) {
				 if ($(oldButton).is(':disabled')) {
			    	$(floatingHeader).find('#copy'+oldButton.id).prop("disabled", true);
			     }
			     else {
			    	$(floatingHeader).find('#copy'+oldButton.id).prop("disabled", false);
			     }

			     $(floatingHeader).find('#copy'+oldButton.id).val($(oldButton).val());
			 });
		 };

		 // Always sync up the buttons on the floating header with the non-floating buttons.
		 $(document).click(function() {
			resetButtonVisibility();
		 });


		$("#copydropdownSplitButton").click(function(){
			isOpen = !(isOpen);
			if(isOpen === true){
				$('#splitButton-dropdown-area-id').slideDown('fast', function(){});
				var buttonPosition = $(".splitButton-button-area").position();
				var buttonLeft = buttonPosition.left + 15;
				var buttonTop = buttonPosition.top - 12;
				$('.splitButton-dropdown-area').css("left", buttonLeft);
				$('.splitButton-dropdown-area').css("top", buttonTop);
			}
			else{
				$('#splitButton-dropdown-area-id').slideUp('fast', function(){});
			}
		});


		$("#copyassignSplitButton").click(function(){
			document.getElementById('assignSplitButton').click();
		});


		//syncs the dropdown and selects the personnel when changed
		 $('.aswl-currentAssignment-dropdown').change(function(){

			if(document.getElementById("copycurrentAssignment").selectedIndex === selectedOptionCurrentAssignment){
				document.getElementById("copycurrentAssignment").selectedIndex = document.getElementById("currentAssignment").selectedIndex;
				selectedOptionCurrentAssignment = document.getElementById("currentAssignment").selectedIndex;
			}

			if(document.getElementById("currentAssignment").selectedIndex === selectedOptionCurrentAssignment){
				document.getElementById("currentAssignment").selectedIndex = document.getElementById("copycurrentAssignment").selectedIndex;
				selectedOptionCurrentAssignment = document.getElementById("copycurrentAssignment").selectedIndex;
			}
			var selectedValue = document.getElementById("copycurrentAssignment").value;

			//not blank or current selection
			if((!(selectedValue === "Blank")) && (!(selectedValue === "Selected"))){
				 clearSelections();

				 //if select all
				if (selectedValue === "All"){
					if(cmDefined){
//						var careManagerColumnEntrys = $(".aswl-careManager");
						$(".aswl-careManager").each(function(){
							if(($(this).hasClass("aswl-managerPlannerContainingDiv") || ($(this).hasClass("aswl-oua") && canAssign)) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("assignSplitButton").disabled = false;
								document.getElementById("copyassignSplitButton").disabled = false;
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
							else if((!$(this).hasClass("aswl-ua")) && ($(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-selected-candidate");
							}
						});
					}

					if(dpDefined){
						var dischargePlannerColumnEntrys = $(".aswl-dischargePlanner");
						dischargePlannerColumnEntrys.each(function(){
							if(($(this).hasClass("aswl-managerPlannerContainingDiv") || ($(this).hasClass("aswl-oua") && canAssign)) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("assignSplitButton").disabled = false;
								document.getElementById("copyassignSplitButton").disabled = false;
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
							else if((!$(this).hasClass("aswl-ua")) && ($(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-selected-candidate");
							}
						});
					}

					if(dsDefined){
						var docSpecialistColumnEntrys = $(".aswl-documentationSpecialist");
						docSpecialistColumnEntrys.each(function(){
							if(($(this).hasClass("aswl-managerPlannerContainingDiv") || ($(this).hasClass("aswl-oua") && canAssign)) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("assignSplitButton").disabled = false;
								document.getElementById("copyassignSplitButton").disabled = false;
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
							else if((!$(this).hasClass("aswl-ua")) && ($(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-selected-candidate");
							}
						});
					}
					document.getElementById("assignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
					document.getElementById("copyassignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
				}
				//selected unassigned
				if (selectedValue === "Unassigned"){
						searchForRowAndHighlight("none", ".aswl-careManager");
						searchForRowAndHighlight("none", ".aswl-dischargePlanner");
						searchForRowAndHighlight("none", ".aswl-documentationSpecialist");
						handleNameChange();
				}
				//selects based on assignment name selected (index 5 and higher)
				if((!(selectedValue === "ClearSelection")) && (!(selectedValue === "Unassigned"))&& (!(selectedValue === "All"))){
					searchForRowAndHighlight("aswl" +selectedValue, ".aswl-careManager");
					searchForRowAndHighlight("aswl"+ selectedValue, ".aswl-dischargePlanner");
					searchForRowAndHighlight("aswl"+selectedValue, ".aswl-documentationSpecialist");
					handleNameChange();
				 }

				 //if clear selection option is selected, clear out the current assignment dropdown
				 if(selectedValue === "ClearSelection"){
					document.getElementById("currentAssignment").selectedIndex = 0;
					document.getElementById("copycurrentAssignment").selectedIndex = 0;
					selectedOptionCurrentAssignment = 0;
					$("#aswlCareManagerHeaderHover").removeClass("aswl-allRowsSelected");
					$("#aswlDischargePlannerHeaderHover").removeClass("aswl-allRowsSelected");
					$("#aswlDocSpecialistHeaderHover").removeClass("aswl-allRowsSelected");
				 }
			}
		});

		//sych for table refresh
		document.getElementById("currentAssignment").selectedIndex = 0;
		document.getElementById("copycurrentAssignment").selectedIndex = 0;
		selectedOptionCurrentAssignment = 0;
	};

	/**
	 * Function to initialize the worklist
	 */
    this.initialize = function(criterion){
        this.criterion = criterion;
        var html = [];
		var optionsArrayTest = [];
		optionsArrayTest[0] = rcm_assignment_worklist_i18n.ASWL_ADD_ASSIGNMENT;
		optionsArrayTest[1] =rcm_assignment_worklist_i18n.ASWL_REPLACE_ASSIGNMENT;
		splitButtonAssign = new splitButton("assignSplitButton", "dropdownSplitButton", optionsArrayTest, criterion);

        html.push("<div id='aswlProviderDiv'>");
        html.push("</div>");
        html.push("<div id='tableDiv' style='clear:both'>");
        html.push("<table id='aswlTable'>");
        html.push("<tr id='tableHeader'>");
        html.push("<th class='aswlworklist-th' scope='col'>", rcm_assignment_worklist_i18n.ASWL_LOCATION, "</th>");
        html.push("<th class='aswlworklist-th' scope='col'><span class='aswlworklist-th-patient'>", rcm_assignment_worklist_i18n.ASWL_PATIENT, "</span></th>");
        html.push("<th class='aswlworklist-th aswlCareManagerTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, "</th>");
        html.push("<th class='aswlworklist-th aswlDischargePlannerTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, "</th>");
		html.push("<th class='aswlworklist-th aswlDocSpecialistTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, "</th>");
        html.push("<th class='aswlworklist-th' scope='col'>", rcm_assignment_worklist_i18n.ASWL_PAYER, "<br />(", rcm_assignment_worklist_i18n.ASWL_CLASS, ")</th>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");

		html.push(getOkDialogHTML());
		html.push(getReplaceDialogHTML());
        return html.join("");
    };


    /**
	 * Creates the html for the current selection dropdown, provider search control, and add assignment/replace button
	 */
    this.loadTableHeader = function(){
    	var html = [];

		html.push("<div id='aswl-assignSplitButtonDiv' class='aswl-assignButton'>");
		html.push(splitButtonAssign.getHtml());
		html.push("</div>");

		html.push("<label id='currentAssignmentLabel' class='aswl-currentAssignment-label' for='currentAssignment'>", rcm_assignment_worklist_i18n.ASWL_CURRENT_ASSIGNMENT, ":</label>");
		html.push("<select class='aswl-currentAssignment-dropdown' id='currentAssignment' name='currentAssignment' >");
		html.push("<option id='currentAssignment-Blank' value='Blank'>", " ","</option>");
		html.push("<option id='currentAssignment-Current' value='Selected'>", rcm_assignment_worklist_i18n.ASWL_CURRENT_SELECTION,"</option>");
		html.push("<option id='currentAssignment-All' value='All'>", rcm_assignment_worklist_i18n.ASWL_ALL, "</option>");
		html.push("<option id='currentAssignment-Unassigned' value='Unassigned'>", rcm_assignment_worklist_i18n.ASWL_UNASSIGNED, "</option>");
		html.push("<option id='currentAssignment-Clear' value='ClearSelection'>", rcm_assignment_worklist_i18n.ASWL_CLEAR_SELECTION, "</option>");
		html.push("<option disabled value='Blank'>-------------------------</option>");
		html.push("</select>");
		html.push("<span id='aswl-providerSearchSpan'>");
        html.push("<label class='aswl-personnel-label' for='aswlProviderSearch'>", rcm_assignment_worklist_i18n.ASWL_PERSONNEL, ":</label>");
        html.push("<input type='text' class='searchText searchTextSpacing' id='aswlProviderSearch' name='aswlProviderSearch' />");
		html.push("</span>");

	    var headerDivString = html.join("");
	    var headerDiv = document.getElementById('aswlProviderDiv');
        if (headerDiv){
        	headerDiv.innerHTML = headerDivString;
            return null;
        }
        return headerDivString;
    };

	/**
	 * Used to refresh the worklist
	 */
	this.addRefreshListener = function(refreshListener){
		refreshListeners.push(refreshListener);
	};

	/**
	 * Creates the html for the worklist table
	 */
    this.loadTable = function(worklistItems, canAssignInd, canUnassignInd, isCMDefinedInd, isDPDefinedInd, isDSDefinedInd, patientNameLink, patientNameViewpointLink, patientNameViewLink, availablePersonnels){
		canAssign = canAssignInd;
		canUnassign = canUnassignInd;
		cmDefined = isCMDefinedInd;
		dpDefined = isDPDefinedInd;
		dsDefined = isDSDefinedInd;
		formObject = {};
		selected = 0;
		nonRelationshipSelected = 0;
        worklistItemsResult = worklistItems;
        zebraStriping = "";
        var html = [];
        html.push("<table id='aswlTable'>");
        html.push("<tr id='tableHeader'>");
        html.push("<th class='aswlworklist-th' scope='col'>", rcm_assignment_worklist_i18n.ASWL_LOCATION, "<br />(", rcm_assignment_worklist_i18n.ASWL_ENCOUNTER_TYPE, ")</th>");
        html.push("<th class='aswlworklist-th' scope='col'><span class='aswlworklist-th-patient'>", rcm_assignment_worklist_i18n.ASWL_PATIENT, "</span></th>");
        html.push("<th class='aswlworklist-th aswlCareManagerTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_CARE_MANAGER, "<div id='aswlCareManagerHeaderHover' class='aswl-tableHeaderHoverArea'></div></th>");
		getDownArrowHTML("aswlCareManagerDownArrow");
        html.push("<th class='aswlworklist-th aswlDischargePlannerTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_DISCHARGE_PLANNER, "<div id='aswlDischargePlannerHeaderHover' class='aswl-tableHeaderHoverArea'></div></th>");
		getDownArrowHTML("aswlDischargePlannerDownArrow");
		html.push("<th class='aswlworklist-th aswlDocSpecialistTableHeader' scope='col'>", rcm_assignment_worklist_i18n.ASWL_DOCUMENTATION_SPECIALIST, "<div id='aswlDocSpecialistHeaderHover' class='aswl-tableHeaderHoverArea'></div></th>");
		getDownArrowHTML("aswlDocSpecialistDownArrow");
        html.push("<th class='aswlworklist-th' scope='col'>", rcm_assignment_worklist_i18n.ASWL_PAYER, "<br />(", rcm_assignment_worklist_i18n.ASWL_CLASS, ")</th>");
        html.push("</tr>");
        if (!worklistItems) {
            html.push("<tr><td colspan='6'><b><center>", rcm_assignment_worklist_i18n.ASWL_ERROR_MESSAGE, "</center><b></td></tr>");
        }
        else if (worklistItems.length === 0) {
                html.push("<tr><td colspan='6'><b><center>", rcm_assignment_worklist_i18n.ASWL_NO_RESULTS_FOUND, "</center><b></td></tr>");
        }
		else {
			//Fill table component with data
			personnelAssignment = availablePersonnels;
			for (var j = 0, x = worklistItems.length; j < x; j++) {
				var person = worklistItems[j];
				if (j % 2 === 0) {
					zebraStriping = "aswlworklist-zebra-striping-white";
				}
				else {
					zebraStriping = "aswlworklist-zebra-striping-blue";
				}
				var personId = person.patientId;
				html.push("<tr class='", zebraStriping, "'>");

				//Location
				html.push("<td class='aswlworklist-td-border'><div>");
				if (person.nurseUnit || person.roomNumber || person.bedNumber) {
					html.push("<p><span class='aswlworklist-firstColumnItemFont'>", person.nurseUnit + ' ' + person.roomNumber + ' ' + person.bedNumber,"</span></p>");
				}
				if (person.encounterType) {
					html.push("<p class='aswlworklist-indention2'><span class='aswlworklist-basicFont'>", person.encounterType, "</span></p>");
				}
				html.push("</div></td>");

				//Patient
				var personName = person.name;
				var personId = person.patientId;
				var encounterId = person.encounterId;
				var appName = "Powerchart.exe";
				html.push("<td  class='aswlworklist-patientInfo'>");
				if (person.name) {
					html.push("<a id='aswlPatientName' href = 'javascript:VIEWLINK(0, \"" + appName + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + patientNameLink + "\", \"" + patientNameViewLink + "\", \"" + patientNameViewpointLink + "\");'>", person.name, "</a>");
				}
				else{
					html.push("<br/>");
				}

				html.push("<p class='aswlworklist-indention'><span class='secondary-basic'>");
				if (person.age) {
					html.push(person.age);
				}
				html.push("</span>&nbsp;&nbsp;&nbsp;");

				html.push("<span class='aswlworklist-basicFont'>");
				if (person.gender) {
					html.push(person.gender);
				}
				html.push("</span></p>");
				html.push("<p class='aswlworklist-indention'><span class='aswlworklist-basicFont'>", rcm_assignment_worklist_i18n.ASWL_FIN, ":</span>&nbsp;<span class='header-basic'>");
				if (person.fin) {
					html.push(person.fin);
				}
				html.push("</span></p></td>");

				//Invisible EncounterId
				html.push("<td id='aswl-Col", person.encounterId, "' class='aswl-encounterCol'></td>");

				//Invisible Version
				html.push("<td id='aswl-Col", person.version, "' class='aswl-versionCol'></td>");

				//Invisible PatientId
				html.push("<td id='aswl-Col", person.patientId, "' class='aswl-patientIdCol'></td>");

				//Determine the longest list length between care managers, discharge planners, and
				//documentation specialists so it can be used to insert necessary space to make the length
				//of each cell in a row the same length
				var careManagersLength = person.careManagers.length;
				var dischargePlannersLength = person.dischargePlanners.length;
				var documentationSpecialistLength = person.documentationSpecialists.length;

				var greatestLength1 = ((careManagersLength - dischargePlannersLength) > 0) ? careManagersLength : dischargePlannersLength;
				var greatestLength2 = ((greatestLength1 - documentationSpecialistLength) > 0) ? greatestLength1 : documentationSpecialistLength;


				//Care Managers
				if(cmDefined){
					html.push("<td class='aswlworklist-td-border aswlCareManagerColumn'>");
					if (person.careManagers) {
						var i;
						var length = person.careManagers.length;
						for (i = 0; i < length; i++){
							var careManager = person.careManagers[i];
							html.push("<div id='aswl",careManager.id,"' class='aswl-careManager aswl-managerPlannerContainingDiv'>");
								html.push("<div id='aswl",careManager.personnelId,"' class='aswl-managerPlannerName'>",careManager.name,"</div>");
								if (canUnassign) {
									html.push("<div id='hoverManagerNameX' title='",rcm_assignment_worklist_i18n.ASWL_REMOVE,"' class='aswlhmnx aswl-hoverManagerNameX'></div>");
								}
								html.push("<div class='aswl-spacerDiv'></div>");
							html.push("</div>");
						}
						if(length > 0){
							html.push(compareLists(person.careManagers.length, greatestLength2, "aswl-careManager"));
						}
						else{
							html.push(getSingleUnassignedElement("aswl-careManager"));
						}
					}
					else {
						html.push("<div>", rcm_assignment_worklist_i18n.ASWL_ERROR_MESSAGE, "</div>");
					}
					html.push("</td>");
				}

				//Discharge Planners
				if(dpDefined){
				   html.push("<td class='aswlworklist-td-border aswlDischargePlannerColumn'>");
					if (person.dischargePlanners) {
						var i;
						var length = person.dischargePlanners.length;
						for (i = 0; i < length; i++) {
							var dischargePlanner = person.dischargePlanners[i];
							html.push("<div id='aswl", dischargePlanner.id,"' class='aswl-dischargePlanner aswl-managerPlannerContainingDiv'>");
							html.push("<div id='aswl", dischargePlanner.personnelId, "' class='aswl-managerPlannerName'>", dischargePlanner.name,"</div>");
							if (canUnassign) {
								html.push("<div id='hoverManagerNameX' title='",rcm_assignment_worklist_i18n.ASWL_REMOVE,"' class='aswlhmnx aswl-hoverManagerNameX'></div>");
							}
							html.push("<div class='aswl-spacerDiv'></div>");
							html.push("</div>");
						}
						if (length > 0) {
							html.push(compareLists(person.dischargePlanners.length, greatestLength2, "aswl-dischargePlanner"));
						}
						else {
							html.push(getSingleUnassignedElement("aswl-dischargePlanner"));
						}
					}
					else {
						html.push("<div>", rcm_assignment_worklist_i18n.ASWL_ERROR_MESSAGE, "</div>");
					}
					html.push("</td>");
				}

				if(dsDefined){
					//Documentation Specialists
					html.push("<td class='aswlworklist-td-border aswlDocSpecialistColumn'>");
					if(person.documentationSpecialists){
						var i;
						var length = person.documentationSpecialists.length;
						for(i = 0; i < length; i++){
							var documentationSpecialist = person.documentationSpecialists[i];
							html.push("<div id='aswl", documentationSpecialist.id,"' class='aswl-documentationSpecialist aswl-managerPlannerContainingDiv'>");
							html.push("<div id='aswl", documentationSpecialist.personnelId, "' class='aswl-managerPlannerName'>", documentationSpecialist.name, "</div>");
							if(canUnassign){
								html.push("<div id='hoverManagerNameX' title='", rcm_assignment_worklist_i18n.ASWL_REMOVE,"' class='aswlhmnx aswl-hoverManagerNameX'></div>");
							}
							html.push("<div class='aswl-spacerDiv'></div>");
							html.push("</div>");
						}
						if(length > 0){
							html.push(compareLists(person.documentationSpecialists.length, greatestLength2, "aswl-documentationSpecialist"));
						}
						else{
							html.push(getSingleUnassignedElement("aswl-documentationSpecialist"));
						}
					}
					else{
						html.push("<div>", rcm_assignment_worklist_i18n.ASWL_ERROR_MESSAGE, "</div>");
					}
					html.push("</td>");
				}

				//Payer
				html.push("<td class='aswlworklist-td-border'>");
				html.push("<div><p>");
				if (person.primaryPayer) {
					html.push("<span class='aswlworklist-firstColumnItemFont'>", person.primaryPayer, "</span>");
				}

				if (person.financialClass) {
					html.push("<p class='aswlworklist-indention2'><span class='aswlworklist-basicFont'>", person.financialClass, "</span></p>");
				}
				html.push("</p></div></td>");
				html.push("</tr>");
			}
		}
        html.push("</table>");
		createRightClickDialog();
        var tableString = html.join("");
        var tableDiv = document.getElementById('tableDiv');
        if (tableDiv) {
            //already rendered.  Show the new table.
            document.getElementById('tableDiv').innerHTML = tableString;
            return null;
        }
        //used on first load, when table isn't rendered yet due to the way the html is built.
        return tableString;
    };

	/**
	 * Called after the worklist html has been rendered to setup element events,
	 * disable/enable elements, or hide/show elements
	 */
    this.setUp = function(){
		var $assignSplitButton = $("#assignSplitButton");

		$(document).bind("contextmenu", function(e){
			return false;
		});
		if(!canAssign && !canUnassign){
			$("#aswlProviderDiv").hide();
		}
		else{
			$("#aswlProviderDiv").show();
		}

		// care manager
		if(!cmDefined){
			$("#tableHeader .aswlCareManagerTableHeader").remove();
			$(".aswlCareManagerColumn").remove();
		}
		else{
			if (canAssign || canUnassign) {
				var $cmTableHeader = $("#tableHeader .aswlCareManagerTableHeader");
				var $cmHeaderHover = $("#aswlTable #aswlCareManagerHeaderHover");
				var $cmDownArrow =$("#aswlCareManagerDownArrow");

				var middle = $cmTableHeader.position().left + $cmTableHeader.width()/2;
				$cmDownArrow.css("left", middle);
				$cmHeaderHover.unbind("mouseover");
				$cmHeaderHover.mouseover(function(){
					var top = $(window).scrollTop() !== 0 ? ($(window).scrollTop() + $cmTableHeader.height()) : $cmTableHeader.position().top;
					var bottom = (top + $cmTableHeader.height() * 1.75 ) ;
					$cmDownArrow.css("top", bottom);
					var middle = $cmTableHeader.position().left + $cmTableHeader.width()/2;
					$cmDownArrow.css("left", middle);
					$cmDownArrow.show();
					$cmHeaderHover.css("cursor", "hand");
				});
				$cmHeaderHover.mouseout(function(){
					$cmDownArrow.hide();
					$cmHeaderHover.css("cursor", "pointer");
				});
				$cmHeaderHover.click(function(){
					$cmHeaderHover.css("cursor", "hand");
//					var careManagerColumnEntrys = $(".aswlCareManagerColumn .aswl-careManager");
					clearRelationshipSelections("aswl-careManager");
					if(!($cmHeaderHover.hasClass("aswl-allRowsSelected"))){
						// select all care manager rows by clicking on the care manager header.
						$(".aswlCareManagerColumn .aswl-careManager").each(function(){
							if((!$(this).hasClass("aswl-ua")) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("currentAssignment").selectedIndex = 1;
								document.getElementById("copycurrentAssignment").selectedIndex = 1;
								selectedOptionCurrentAssignment = 1;
								$assignSplitButton.prop('disabled', false);
								$("copyassignSplitButton").prop('disabled', false);
								$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
								document.getElementById("assignSplitButton").value= $assignSplitButton.val();
								document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
						});

						$cmHeaderHover.addClass("aswl-allRowsSelected");
					}
					else{
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						$cmHeaderHover.removeClass("aswl-allRowsSelected");
					}
					handleNameChange();
				});
				$cmDownArrow.mouseover(function(){
				var middle = $("#tableHeader .aswlCareManagerTableHeader").position().left + $("#tableHeader .aswlCareManagerTableHeader").width()/2;
				$cmDownArrow.css("left", middle);
					$cmDownArrow.show();
				});
				$cmDownArrow.mouseout(function(){
					$cmDownArrow.hide();
				});
				$cmDownArrow.click(function(){
					$cmHeaderHover.click();
				});
			}
		}


		// discharge planner
		if(!dpDefined){
			$(".aswlDischargePlannerTableHeader").remove();
			$(".aswlDischargePlannerColumn").remove();
		}
		else{
			if (canAssign || canUnassign) {
				var $dpTableHeader = $("#tableHeader .aswlDischargePlannerTableHeader");
				var $dpHeaderHover = $("#aswlTable #aswlDischargePlannerHeaderHover");
				var $dpDownArrow =$("#aswlDischargePlannerDownArrow");

				var middle = $dpTableHeader.position().left + $dpTableHeader.width()/2;
				$dpDownArrow.css("left", middle);
				$dpHeaderHover.unbind("mouseover");
				$dpHeaderHover.mouseover(function(){
					var top = $(window).scrollTop() !== 0 ? ($(window).scrollTop() + $dpTableHeader.height()) : $dpTableHeader.position().top;
					var bottom = top + $dpTableHeader.height() * 1.75;
					$dpDownArrow.css("top", bottom);
					var middle =$dpTableHeader.position().left + $dpTableHeader.width()/2;
					$dpDownArrow.css("left", middle);
					$dpDownArrow.show();
					$dpHeaderHover.css("cursor", "hand");
				});
				$dpHeaderHover.mouseout(function(){
					$dpDownArrow.hide();
					$dpHeaderHover.css("cursor", "pointer");
				});
				// select all discharge plans by clicking on the discharge planner header
				$dpHeaderHover.click(function(){
					$dpHeaderHover.css("cursor", "hand");
//					var dischargePlannerColumnEntrys = $(".aswl-dischargePlanner");
					clearRelationshipSelections("aswl-dischargePlanner");
					if(!($dpHeaderHover.hasClass("aswl-allRowsSelected"))){
						$(".aswl-dischargePlanner").each(function(){
							if((!$(this).hasClass("aswl-ua")) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("currentAssignment").selectedIndex = 1;
								document.getElementById("copycurrentAssignment").selectedIndex = 1;
								selectedOptionCurrentAssignment = 1;
								$assignSplitButton.prop('disabled', false);
								$("copyassignSplitButton").prop('disabled', false);
								$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
								document.getElementById("assignSplitButton").value= $assignSplitButton.val();
								document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
						});
						$dpHeaderHover.addClass("aswl-allRowsSelected");
					}
					else{
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						$dpHeaderHover.removeClass("aswl-allRowsSelected");
					}
					handleNameChange();
				});
				$dpDownArrow.mouseover(function(){
					var middle = $(".aswlDischargePlannerTableHeader").position().left + $(".aswlDischargePlannerTableHeader").width()/2;
					$dpDownArrow.css("left", middle);
					$dpDownArrow.show();
				});
				$dpDownArrow.mouseout(function(){
					$dpDownArrow.hide();
				});
				$dpDownArrow.click(function(){
					$dpHeaderHover.click();
				});
			}
		}


		// documentation specialist
		if(!dsDefined){
			$(".aswlDocSpecialistTableHeader").remove();
			$(".aswlDocSpecialistColumn").remove();
		}
		else{
			if (canAssign || canUnassign) {
				var $dsTableHeader = $("#tableHeader .aswlDocSpecialistTableHeader");
				var $dsHeaderHover = $("#aswlTable #aswlDocSpecialistHeaderHover");
				var $dsDownArrow =$("#aswlDocSpecialistDownArrow");

				var middle = $dsTableHeader.position().left + $dsTableHeader.width()/2;
				$dsDownArrow.css("left", middle);
				$dsHeaderHover.unbind("mouseover");
				$dsHeaderHover.mouseover(function(){
					var top = $(window).scrollTop() !== 0 ? ($(window).scrollTop() + $dsTableHeader.height()) : $dsTableHeader.position().top;
					var bottom = top + $dsTableHeader.height() * 1.75;
					$dsDownArrow.css("top", bottom);
					var middle = $dsTableHeader.position().left + $dsTableHeader.width()/2;
					$dsDownArrow.css("left", middle);
					$dsDownArrow.show();
					$dsHeaderHover.css("cursor", "hand");
				});
				$dsHeaderHover.mouseout(function(){
					$dsDownArrow.hide();
					$dsHeaderHover.css("cursor", "pointer");
				});
				$dsHeaderHover.click(function(){
					$dsHeaderHover.css("cursor", "hand");
//					var docSpecialistColumnEntrys = $(".aswl-documentationSpecialist");
					clearRelationshipSelections("aswl-documentationSpecialist");
					if(!($dsHeaderHover.hasClass("aswl-allRowsSelected"))){
						$(".aswl-documentationSpecialist").each(function(){
							if((!$(this).hasClass("aswl-ua")) && (!$(this).hasClass("aswl-selected-candidate"))){
								$(this).removeClass("aswl-ManagerNameHoverOver");
								$(this).addClass("aswl-selected-candidate");
								selected++;
								document.getElementById("currentAssignment").selectedIndex = 1;
								document.getElementById("copycurrentAssignment").selectedIndex = 1;
								selectedOptionCurrentAssignment = 1;
								$assignSplitButton.prop('disabled', false);
								$("copyassignSplitButton").prop('disabled', false);
								$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
								document.getElementById("assignSplitButton").value= $assignSplitButton.val();
								document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
								if($(this).hasClass("aswl-oua")){
									$(this).removeClass("aswl-only-unassigned");
								}
							}
						});
						$dsHeaderHover.addClass("aswl-allRowsSelected");
					}
					else{
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						$dsHeaderHover.removeClass("aswl-allRowsSelected");
					}
					handleNameChange();
				});
				$dsDownArrow.mouseover(function(){
					var middle = $(".aswlDocSpecialistTableHeader").position().left + $(".aswlDocSpecialistTableHeader").width()/2;
					$dsDownArrow.css("left", middle);
					$dsDownArrow.show();
				});
				$dsDownArrow.mouseout(function(){
					$dsDownArrow.hide();
				});
				$dsDownArrow.click(function(){
					$dsHeaderHover.click();
				});
			}
		}


		//sets up javascript for split button
		splitButtonAssign.jsSplitButton();


		//add personnel to dropdown
		for(var i = 0; i < personnelAssignment.length; i++){
			$('#currentAssignment').append( $('<option></option>').val(personnelAssignment[i].ID).html(personnelAssignment[i].FULLNAME));
		}

		$("#assignSplitButton").click(function(){

			switch(splitButtonAssign.getcurrentOption()){

				case"Add Assignment":
				assignButtonFunction();
				break;

				case"Replace Assignment":
				$("#assignSplitButton").prop('disabled', true);
				$("#copyassignSplitButton").prop('disabled', true);
				 openReplaceDialog();
				break;

				/*
				case"Remove Assignment":
				$("assignSplitButton").attr('disabled', 'disabled');
				removeButtonFunction();
				break;
				*/
			}
		});

		//scroll down for the split button's options
		$(window).scroll(function () {
			if(isOpen === true){
				$('.splitButton-dropdown-area').hide();
				isOpen = false;
			}
		});


		/**
		 * Creates hover for selecting each existing personnel relationships.
		 */
		// Add listeners to each care managers, discharge planners, documentation specialists relationships
		if (canAssign || canUnassign) {
			var $hoverManagerNames = $("#aswlTable .aswl-managerPlannerContainingDiv");
			$hoverManagerNames.each(function(){
				var $currentName = $(this);
				// The remove relationship button
				var hoverNameX = $currentName.children(".aswlhmnx").get(0);

				// hover in
				$currentName.mouseover(function(){
				if (!$currentName.hasClass("aswl-selected-candidate")) {
						$currentName.addClass("aswl-ManagerNameHoverOver");
						if (canUnassign) {
							$(hoverNameX).css("visibility", "visible");
						}
					}
				});

				// hover out
				$currentName.mouseout(function(){
					$currentName.removeClass("aswl-ManagerNameHoverOver");
					$(hoverNameX).css("visibility", "hidden");
				});

				$currentName.click(function(){
					// select current relationship
					if (!$currentName.hasClass("aswl-selected-candidate")) {
						$currentName.removeClass("aswl-ManagerNameHoverOver");
						$(hoverNameX).css("visibility", "hidden");
						document.getElementById("currentAssignment").selectedIndex = 1;
						document.getElementById("copycurrentAssignment").selectedIndex = 1;
						selectedOptionCurrentAssignment = 1;
						$currentName.addClass("aswl-selected-candidate");
						selected++;
						$assignSplitButton.prop('disabled', true);
						$("copyassignSplitButton").prop('disabled', true);
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
					}
					// unselect current relationship
					else {
						$currentName.addClass("aswl-ManagerNameHoverOver");
						$(hoverNameX).css("visibility", "visible");
						$currentName.removeClass("aswl-selected-candidate");
						selected--;
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						if(selected ===0){
						$assignSplitButton.prop('disabled', false);
						$("copyassignSplitButton").prop('disabled', false);
						}
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
					}
					handleNameChange();
				});

				// right mourse click on the relationship to select all names
				$currentName.mousedown(function(e){
					// right mouse event
					if(e.which === 3){
						e.stopPropagation();
						$("#aswlRightClickDiv").html("");
						var className;
						if($currentName.hasClass("aswl-careManager")){
							className = "aswl-careManager";
						}
						else if($currentName.hasClass("aswl-dischargePlanner")){
							className = "aswl-dischargePlanner";
						}
						else {
							className = "aswl-documentationSpecialist";
						}
						var name = $currentName.children(".aswl-managerPlannerName").get(0);
						var text = $(name).html();
						var id = $(name).attr("id");
						createInnerHTMLRightClick(this, id, className, text, e);
					}
				});
			});
		}

		// Add listeners for unassign buttons for each relationships
		if (canAssign) {
			var hoverUnassigned = $(".aswl-unassigned-div");
			hoverUnassigned.each(function(){
				var hoverUnassignedChild = $(this).children(".aswl-ua").get(0);
				$(this).mouseover(function(){
					if (!$(hoverUnassignedChild).hasClass("aswl-selected-candidate")) {
						$(this).addClass("aswl-ManagerNameHoverOver");
						$(hoverUnassignedChild).css("visibility", "visible");
					}
				});

				$(this).mouseout(function(){
					if (!$(hoverUnassignedChild).hasClass("aswl-selected-candidate")) {
						$(this).removeClass("aswl-ManagerNameHoverOver");
						$(hoverUnassignedChild).css("visibility", "hidden");
					}
				});

				$(this).click(function(){
					if (!$(hoverUnassignedChild).hasClass("aswl-selected-candidate")) {
						$(this).removeClass("aswl-ManagerNameHoverOver");
						$(hoverUnassignedChild).addClass("aswl-selected-candidate");
						selected++;
						nonRelationshipSelected++;
						document.getElementById("currentAssignment").selectedIndex = 1;
						document.getElementById("copycurrentAssignment").selectedIndex = 1;
						selectedOptionCurrentAssignment = 1;
						$assignSplitButton.prop('disabled', true);
						$("copyassignSplitButton").prop('disabled', true);
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
						$(hoverUnassignedChild).removeClass("aswl-unassigned");
						$(hoverUnassignedChild).css("visibility", "visible");
					}
					else {
						$(this).addClass("aswl-ManagerNameHoverOver");
						$(hoverUnassignedChild).removeClass("aswl-selected-candidate");
						selected--;
						nonRelationshipSelected--;
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						if(selected ===0){
						$assignSplitButton.prop('disabled', false);
						$("copyassignSplitButton").prop('disabled', false);
						}
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
						$(hoverUnassignedChild).addClass("aswl-unassigned");
						$(hoverUnassignedChild).css("visibility", "visible");
					}
					handleNameChange();
				});
			});

			// add listener for assign buttons for patients do not have any relationship
			var hoverOnlyUnassigned = $(".aswl-oua");
			hoverOnlyUnassigned.each(function(){
				$(this).mouseover(function(){
					if (!$(this).hasClass("aswl-selected-candidate")) {
						$(this).addClass("aswl-ManagerNameHoverOver");
					}
				});

				$(this).mouseout(function(){
					$(this).removeClass("aswl-ManagerNameHoverOver");
				});
				$(this).click(function(){
					if (!$(this).hasClass("aswl-selected-candidate")) {
						$(this).removeClass("aswl-ManagerNameHoverOver");
						$(this).removeClass("aswl-only-unassigned");
						$(this).addClass("aswl-selected-candidate");
						selected++;
						nonRelationshipSelected++;
						$assignSplitButton.prop('disabled', true);
						$("copyassignSplitButton").prop('disabled', true);
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
						document.getElementById("currentAssignment").selectedIndex = 1;
						document.getElementById("copycurrentAssignment").selectedIndex = 1;
						selectedOptionCurrentAssignment = 1;
					}
					else {
						$(this).removeClass("aswl-selected-candidate");
						selected--;
						nonRelationshipSelected--;
						var index = getCurrentAssignmentIndex();
						document.getElementById("currentAssignment").selectedIndex = index;
						document.getElementById("copycurrentAssignment").selectedIndex = index;
						selectedOptionCurrentAssignment = index;
						if(selected === 0){
						$assignSplitButton.prop('disabled', false);
						$("copyassignSplitButton").prop('disabled', false);
						}
						$assignSplitButton.val(splitButtonAssign.getcurrentOption() +"(" +selected+")" );
						document.getElementById("assignSplitButton").value= $assignSplitButton.val();
						document.getElementById("copyassignSplitButton").value= $assignSplitButton.val();
						$(this).addClass("aswl-only-unassigned");
						$(this).addClass("aswl-ManagerNameHoverOver");
					}
					handleNameChange();
				});
				$(this).mousedown(function(e){
					if(e.which === 3){
						e.stopPropagation();
						$("#aswlRightClickDiv").html("");
						var className;
						if($(this).hasClass("aswl-careManager")){
							className = "aswl-careManager";
						}
						else if($(this).hasClass("aswl-dischargePlanner")){
							className = "aswl-dischargePlanner";
						}
						else{
							className = "aswl-documentationSpecialist";
						}
						var text = rcm_assignment_worklist_i18n.ASWL_ASSIGN;
						var id = "none";
						createInnerHTMLRightClick(this, id, className, text,e);

					}
				});
			});
		}


		if(canUnassign){
			var hoverOverDeleteX = $(".aswlhmnx");
			hoverOverDeleteX.each(function(){
				$(this).mouseover(function(){
					$(this).removeClass("aswl-hoverManagerNameX");
					$(this).addClass("aswl-hoverOverManagerNameX");
				});

				$(this).mouseout(function(){
					$(this).removeClass("aswl-hoverOverManagerNameX");
					$(this).addClass("aswl-hoverManagerNameX");
				});

				$(this).click(function(eventObject){
					// Stops containing div from executing its click event
					eventObject.stopPropagation();
					var $rowParent = $(this).closest("tr");
					var $containerDiv = $(this).closest(".aswl-managerPlannerContainingDiv");

					var deleteDataInfo = getDeleteWorklistItem($rowParent, $containerDiv.attr("id").substring(4));
					maintainRelationships([deleteDataInfo]);
				});
			});
		}

		var $aswlRightClickDiv = $("#aswlRightClickDiv");

		$("#aswlBtnOk").unbind("click");
		$("#aswlBtnOk").click(function(){
			 $("#aswlOkDialog").hide();
		});

		$("#aswlBtnCancel").unbind("click");
		$("#aswlBtnCancel").click(function(){
			 $("#aswlReplaceUnassignDialog").hide();
			$("#assignSplitButton").prop('disabled', false);
			$("#copyassignSplitButton").prop('disabled', false);
		});



		if(!cmDefined && !dpDefined && !dsDefined){
			openBuildErrorDialog();
			$("#aswlProviderDiv").hide();
		}

		if(canUnassign || canAssign){
			$("#tableDiv").mousedown(function(e){
				if(canUnassign){
					if(e.which === 3){
						if(selected > 0){
							$aswlRightClickDiv.html("");
							createUnassignInnerHTMLRightClick(e);
						}
					}
				}
				if(e.which === 1){
					$aswlRightClickDiv.hide();
					$aswlRightClickDiv.html("");
				}
			});

			$("#aswlProviderDiv").mousedown(function(){
					$aswlRightClickDiv.hide();
					$aswlRightClickDiv.html("");
			});

			$("#filtersDiv").mousedown(function(){
					$aswlRightClickDiv.hide();
					$aswlRightClickDiv.html("");
			});
		}

		if(!canAssign){
			$("#currentAssignment-Unassigned").remove();
			$("#aswl-assignSplitButtonDiv").hide();
			$("#aswl-providerSearchSpan").hide();
		}

		if(canAssign && canUnassign){
			$("#dropdownSplitButton").show();
		}
		else{
			$("#dropdownSplitButton").hide();
			$(".splitButton-button-area").css("width", "160px");
		}
		splitButtonAssign.setcurrentOption(0);

    }; // end of setup method.

	/**
	 * Sets up the provider search control and disables the add assignment/replace button
	 */
	this.setUpSearchControlAndButton = function(currentUserId, currentUserName) {
		var providerSearchText = document.getElementById("aswlProviderSearch");
    	if (providerSearchText) {
    		providerSearchControl = new ProviderSearchControl(providerSearchText);
    		providerSearchControl.setSelectedProvider(currentUserId, currentUserName);
    	}
		RCM_Clinical_Util.setSearchControlRequired(true, formObject, "aswlProviderSearch", providerSearchControl, ["assignSplitButton", "copyassignSplitButton"]);
		requireDataElements();
		document.getElementById("assignSplitButton").disabled = true;
	};

	/**
	 * Adds creates assign/replace button and dropdown and adds resize event to window
	 */
	 this.finishWorklist = function(){
		$(window).resize(function(){
			var buttonPosition = $(".splitButton-button-area").position();
			var buttonLeft = buttonPosition.left+15;
			$('.splitButton-dropdown-area').css("left", buttonLeft);
		});
	 };

	/**
	 * Assigns relationships on click assign button
	 */
	var assignButtonFunction = function(){
		var newPersonnelId = providerSearchControl.getSelectedProviderId();
		var worklistItemArray = [];
		$("#aswlTable tr").each(function(){
			var worklistItem = getReassignWorklistItem($(this), newPersonnelId, 0);
			if(worklistItem){
				if(worklistItem.addCareManagers.length === 0 && worklistItem.addDischargePlanners.length === 0 && worklistItem.addDocSpecialists.length === 0 && worklistItem.removeRelationshipIds.length === 0){
					return true;
				}
				else{
					worklistItemArray.push(worklistItem);
				}
			}
		});

		if(worklistItemArray.length > 0){
			maintainRelationships(worklistItemArray);
		}
		else{
			document.getElementById("currentAssignment").selectedIndex = 0;
			document.getElementById("copycurrentAssignment").selectedIndex = 0;
			selectedOptionCurrentAssignment = 0;
			clearSelections();
		}
	};

	/**
	 * Replace relationships on click assign button
	 */
	var replaceButtonFunction = function(){
		var newPersonnelId = providerSearchControl.getSelectedProviderId();
		var worklistItemArray = [];
		$("#aswlTable tr").each(function(){
			var worklistItem = getReassignWorklistItem($(this), newPersonnelId, 1);
			if(worklistItem){
				if(worklistItem.addCareManagers.length === 0 && worklistItem.addDischargePlanners.length === 0 && worklistItem.addDocSpecialists.length === 0 && worklistItem.removeRelationshipIds.length === 0){
					return true;
				}
				else{
					worklistItemArray.push(worklistItem);
				}
			}
		});
		if(worklistItemArray.length > 0){
			maintainRelationships(worklistItemArray);
		}
		else{
			document.getElementById("currentAssignment").selectedIndex = 0;
			document.getElementById("copycurrentAssignment").selectedIndex = 0;
			selectedOptionCurrentAssignment = 0;
			clearSelections();
		}
	};

	/**
	 * Removes relationships on right-click unassign all option
	 */
	var removeButtonFunction = function(){
		var newPersonnelId = providerSearchControl.getSelectedProviderId();
		var worklistItemArray = [];
		$("#aswlTable tr").each(function(){
			var worklistItem = getReassignWorklistItem($(this), newPersonnelId, 2);
			if(worklistItem){
				worklistItemArray.push(worklistItem);
			}
		});
		maintainRelationships(worklistItemArray);
	};

	/**
	 * Clears all selected personnel
	 */
	var clearSelections = function(){
		selected = 0;
		nonRelationshipSelected = 0;
		splitButtonAssign.setcurrentOption(0);
		document.getElementById("assignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
		document.getElementById("copyassignSplitButton").value= document.getElementById("assignSplitButton").value;
		$(".aswl-selected-candidate").removeClass("aswl-selected-candidate");
		$(".aswl-ua").css("visibility", "hidden");
		$(".aswl-ua").addClass("aswl-unassigned");
		$("#assignSplitButton").prop('disabled', true);
		$("#copyassignSplitButton").prop('disabled', true);
	};

	/**
	 * Clears selections with the specified relationship class
	 */
	var clearRelationshipSelections = function(relationshipClassName){
		var allSelected = $(".aswl-selected-candidate");
		allSelected.each(function(){
			if($(this).hasClass(relationshipClassName)){
				$(this).removeClass("aswl-selected-candidate");
				if($(this).hasClass("aswl-ua")){
					nonRelationshipSelected--;
					$(this).css("visibility", "hidden");
					$(this).addClass("aswl-unassigned");
				}
				if($(this).hasClass("aswl-oua")){
					nonRelationshipSelected--;
				}
				selected--;
			}
		});
		document.getElementById("assignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
		document.getElementById("copyassignSplitButton").value= document.getElementById("assignSplitButton").value;
		if(selected === 0){
			$("#assignSplitButton").prop('disabled', true);
			$("#copyassignSplitButton").prop('disabled', true);
		}
		else{
			$("#assignSplitButton").prop('disabled', false);
			$("#copyassignSplitButton").prop('disabled', false);
		}

	};

	/**
	 * Creates the right-click dialog div
	 */
	var createRightClickDialog = function(){
		var rightClickDiv = document.createElement("div");
		rightClickDiv.id = "aswlRightClickDiv";
		rightClickDiv.className = "aswl-rightClickDiv";
		document.body.appendChild(rightClickDiv);
	};

	/**
	 * Creates the html to populate the right-click dialog with the select all text based on
	 * what was clicked on and also adds events to the dialog
	 */
	var createInnerHTMLRightClick = function(element, id, className, text, e){
		var html = [];
		var dialogText = rcm_assignment_worklist_i18n.ASWL_SELECT_ALL + ' "' + text + '"';
		html.push("<div id='aswlRightClickInnerDiv' class='aswlRightClickInnerDiv'><span id='",id,"' class='",className,"'>", dialogText, "</span></div>");

		$aswlRightClickDiv =$("#aswlRightClickDiv");

		$aswlRightClickDiv.html(html.join(""));
		$aswlRightClickDiv.css("top", e.pageY);
		$aswlRightClickDiv.css("left", e.pageX);
		$aswlRightClickDiv.css("display", "block");
		$aswlRightClickDiv.focus();


		$aswlRightClickDiv.blur(function(e){
			$(element).mouseout();
		});

		createInnerHTMLRightClickActions(element);

		if(selected > 0 && canUnassign){
			createUnassignInnerHTMLRightClick(e,element);
		}
	};

	/**
	 * Adds events to the right-click dialog
	 */
	var createInnerHTMLRightClickActions = function(element){
	$aswlRightClickInnerDiv = $("#aswlRightClickInnerDiv");
	$aswlRightClickDiv =$("#aswlRightClickDiv");

	$aswlRightClickInnerDiv.mouseover(function(){
			if(element)$(element).mouseover();
			$aswlRightClickInnerDiv.addClass("aswl-selected-candidate");
		});
		$aswlRightClickInnerDiv.mouseout(function(){
			if(element)$(element).mouseover();
			$aswlRightClickInnerDiv.removeClass("aswl-selected-candidate");
		});
		$aswlRightClickInnerDiv.click(function(){
			var idToSearchFor = $aswlRightClickInnerDiv.find("span").attr("id");
			$aswlRightClickDiv.hide();
			$aswlRightClickDiv.html("");
			if(element){
				$(element).mouseout();
			}

			searchForRowAndDeselect(idToSearchFor, ".aswl-careManager");
			searchForRowAndDeselect(idToSearchFor, ".aswl-dischargePlanner");
			searchForRowAndDeselect(idToSearchFor, ".aswl-documentationSpecialist");

			if(selected > 0 ){
				document.getElementById("currentAssignment").selectedIndex = 1;
				document.getElementById("copycurrentAssignment").selectedIndex = 1;
				selectedOptionCurrentAssignment = 1;
			}
			else{
				if(!(idToSearchFor === "none")){
					var newID = $.trim(idToSearchFor.substring(4));
				}
				else{
					newID = "Unassigned";
				}
				$("#currentAssignment").val(newID);
				document.getElementById("copycurrentAssignment").selectedIndex = document.getElementById("currentAssignment").selectedIndex;
				selectedOptionCurrentAssignment = document.getElementById("currentAssignment").selectedIndex;
			}


			searchForRowAndHighlight(idToSearchFor, ".aswl-careManager");
			searchForRowAndHighlight(idToSearchFor, ".aswl-dischargePlanner");
			searchForRowAndHighlight(idToSearchFor, ".aswl-documentationSpecialist");

			handleNameChange();
		});
	};

	/**
	 * Creates the html for the unassign option in the right-click dialog
	 */
	var createUnassignInnerHTMLRightClick = function(e, element){
		$aswlRightClickDiv =$("#aswlRightClickDiv");

		if((selected > 0) &&(selected > nonRelationshipSelected)){
			var html = [];
			var isCursorOnName = false;
			html.push("<div id='aswlUnassignRightClickInnerDiv' class='aswlRightClickInnerDiv'>", rcm_assignment_worklist_i18n.ASWL_UNASSIGN_ALL_SELECTED, "</div>");
			isCursorOnName = $aswlRightClickDiv.html() !== "";
			var htmlString = $aswlRightClickDiv.html() +html.join("");
			$aswlRightClickDiv.html(htmlString);
			$aswlRightClickDiv.css("top", e.pageY);
			$aswlRightClickDiv.css("left", e.pageX);
			$aswlRightClickDiv.css("display", "block");
			$aswlRightClickDiv.focus();

			$("#aswlUnassignRightClickInnerDiv").mouseover(function(){
				$("#aswlUnassignRightClickInnerDiv").addClass("aswl-selected-candidate");
			});
			$("#aswlUnassignRightClickInnerDiv").mouseout(function(){
				$("#aswlUnassignRightClickInnerDiv").removeClass("aswl-selected-candidate");
			});

			$("#aswlUnassignRightClickInnerDiv").click(function(){
				if(isCursorOnName){
					var hoverNameX = $(element).children(".aswlhmnx").get(0);
					$(element).removeClass("aswl-ManagerNameHoverOver");
					$(hoverNameX).css("visibility", "hidden");
					if(!($(element).hasClass("aswl-selected-candidate"))){
						$(element).addClass("aswl-selected-candidate");
						selected++;
					}
				}
				$aswlRightClickDiv.hide();
				$aswlRightClickDiv.html("");
				openUnassignDialog();
			 });

			 if(isCursorOnName){
				createInnerHTMLRightClickActions(element);
			 }
		}
	};

	/**
	 * Searches for all instances of a personnel within the worklist and highlights
	 * the personnel name
	 */
	var searchForRowAndHighlight = function(id, classString){
		var rowsToSearch = $(classString);
		if(id === "none"){
			rowsToSearch.each(function(){
				if($(this).hasClass("aswl-oua") && !($(this).hasClass("aswl-selected-candidate"))){
					$(this).removeClass("aswl-ManagerNameHoverOver");
					$(this).removeClass("aswl-only-unassigned");
					selected++;
					nonRelationshipSelected++;
					document.getElementById("assignSplitButton").disabled = false;
					document.getElementById("copyassignSplitButton").disabled = false;
					document.getElementById("assignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
					document.getElementById("copyassignSplitButton").value= document.getElementById("assignSplitButton").value;
					$(this).addClass("aswl-selected-candidate");
				}
			});
		}
		else{
			rowsToSearch.each(function(){
				 if(!($(this).hasClass("aswl-selected-candidate"))){
					var childDiv = $(this).children(".aswl-managerPlannerName").get(0);
					if($(childDiv).attr("id") == id){
						$(this).removeClass("aswl-ManagerNameHoverOver");
						if(!($(this).hasClass("aswl-selected-candidate"))){
							selected++;
						}
						$(this).addClass("aswl-selected-candidate");
						document.getElementById("assignSplitButton").disabled = false;
						document.getElementById("copyassignSplitButton").disabled = false;
						document.getElementById("assignSplitButton").value= splitButtonAssign.getcurrentOption() +"(" +selected+")";
						document.getElementById("copyassignSplitButton").value= document.getElementById("assignSplitButton").value;
					}
				}
			});
		}
	};

	/**
	 * Searches for all instances of a personnel within the worklist and removes highlights
	 * on the personnel name
	 */
	var searchForRowAndDeselect = function(id, classString){
		var rowsToSearch = $(classString);
		if(id === "none"){
			rowsToSearch.each(function(){
				if($(this).hasClass("aswl-oua") && ($(this).hasClass("aswl-selected-candidate"))){
					$(this).removeClass("aswl-selected-candidate");
					nonRelationshipSelected--;
					selected--;
				}
			});
		}
		else{
			rowsToSearch.each(function(){
				 if(($(this).hasClass("aswl-selected-candidate"))){
					var childDiv = $(this).children(".aswl-managerPlannerName").get(0);
					if($(childDiv).attr("id") == id){
						$(this).removeClass("aswl-selected-candidate");
						selected--;
					}
				}
			});
		}
	};


	/**
	 * Performs a required check on all required fields on the worklist
	 */
	var handleSelectionChange = function(){
		var selectedCanidateItems = $("#aswlTable").find(".aswl-selected-candidate");
		RCM_Clinical_Util.performRequiredFieldChecks(formObject);
	};

	/**
	 * Checks if personnel are selected and the provider search control has a
	 * value and enables/disables the add assignment/replace button
	 */
	var handleNameChange = function(){
		if(!(selected > 0 && $("#aswlProviderSearch").val().length > 0 )){
			document.getElementById("assignSplitButton").disabled = true;
			document.getElementById("copyassignSplitButton").disabled = true;
		}
		else{
			document.getElementById("assignSplitButton").disabled = false;
			document.getElementById("copyassignSplitButton").disabled = false;
		}
	};

	/**
	 * Determines whether or not the add assignment/replace button should be disabled
	 * based on whether the required fields have a value and personnel have been selected
	 */
	var requireDataElements = function() {
		var requiredDataElement = {};
			requiredDataElement.isRequired = function(){
				var selectedCandidateItems = $("#aswlTable").find(".aswl-selected-candidate");
				return selectedCandidateItems.length === 0;
			};
			requiredDataElement.requiredCheck = function() {
				var isRequired = requiredDataElement.isRequired();
				var disabled = isRequired || RCM_Clinical_Util.isAnyFieldRequired(formObject);
				if (document.getElementById("assignSplitButton")) {
					document.getElementById("assignSplitButton").disabled = true;
				}
				if (document.getElementById("copyassignSplitButton")) {
					document.getElementById("copyassignSplitButton").disabled = true;
				}
			};
		formObject.requiredElements.push(requiredDataElement);
	};

	/**
	 * Creates the html for the patients who don't have personnel relationships.
	 * A cell would contain the word "Assign" if the worklist user has the task access
	 * to assign.  A cell would contain the word "Unassign" if the worklist user did not
	 * have the task access to assign
	 */
    var getSingleUnassignedElement = function(className){
        var unHTML = [];
    	unHTML.push("<div class='",className," aswl-oua aswl-only-unassigned'>", canAssign ? rcm_assignment_worklist_i18n.ASWL_ASSIGN : rcm_assignment_worklist_i18n.ASWL_UNASSIGNED, "</div>");
        return unHTML.join("");
    };

	/**
	 * Creates the html for basic popup dialog with an OK button
	 */
	var getOkDialogHTML = function() {
		var boxDiv = document.createElement("div");
		boxDiv.id = "aswlOkDialog";
		boxDiv.className = "aswl-dialog";
		var html = [];
		html.push("<div class='aswl-dialog-title-bar'>");
			html.push("<label id='aswlOkDialogTitle'></label>");
		html.push("</div>");
		html.push("<div class='aswl-dialog-message-area'>");
			html.push("<label id='aswlOkDialogMessage'></label>");
		html.push("</div>");
		html.push("<div class='aswl-dialog-buttons'>");
			html.push("<input id='aswlBtnOk' type='button' value='",rcm_assignment_worklist_i18n.ASWL_OK,"' />");
		html.push("</div>");
		boxDiv.innerHTML = html.join("");
		document.body.appendChild(boxDiv);
	};

	/**
	 * Creates the html for a basic popup dialog with Replace and Cancel buttons
	 */
	var getReplaceDialogHTML = function() {
		var boxDiv = document.createElement("div");
		boxDiv.id = "aswlReplaceUnassignDialog";
		boxDiv.className = "aswl-dialog";
		var html = [];
		html.push("<div class='aswl-dialog-title-bar'>");
			html.push("<label id='aswlReplaceUnassignDialogTitle'></label>");
		html.push("</div>");
		html.push("<div class='aswl-dialog-message-area'>");
			html.push("<label id='aswlReplaceUnassignDialogMessage'></label>");
		html.push("</div>");
		html.push("<div class='aswl-dialog-buttons'>");
			html.push("<input id='aswlBtnCancel' type='button' value='",rcm_assignment_worklist_i18n.ASWL_CANCEL,"' />");
			html.push("<input id='aswlBtnReplace' type='button' class='aswlReplaceUnassignBtn' value='"," ","' />");
		html.push("</div>");
		boxDiv.innerHTML = html.join("");
		document.body.appendChild(boxDiv);
	};

	/**
	 * Creates the div with an arrow shown on a relationship column header when hovered over
	 */
	var getDownArrowHTML = function(id){
		var arrowDiv = document.createElement("div");
		arrowDiv.id = id;
		arrowDiv.className = "aswl-downArrow";
		document.body.appendChild(arrowDiv);
	};

	/**
	 * Populates the basic ok dialog with the text for a delete failed error
	 */
	var openDeleteFailedDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_DELETE_FAILED);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_DELETE_FAILED_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
	};

	/**
	 * Populates the basic ok dialog with the text for a care manager relationship cannot be
	 * established error
	 */
	var openCMEstablishFailedDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_REL_NOT_ESTABLISHED);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_CM_NOT_ESTABLISHED_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
	};

	/**
	 * Populates the basic ok dialog with the text for a discharge planner relationship cannot be
	 * established error
	 */
	var openDPEstablishFailedDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_REL_NOT_ESTABLISHED);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_DP_NOT_ESTABLISHED_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
	};

	/**
	 * Populates the basic ok dialog with the text for a documentation specialist relationship cannot
	 * be established error
	 */
	var openDSEstablishFailedDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_REL_NOT_ESTABLISHED);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_DS_NOT_ESTABLISHED_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
	};

	/**
	 * Populates the basic ok dialog with the text for a stale data error
	 */
	var openStaleDataDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_DELETE_FAILED);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_STALE_DATA_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
		document.getElementById("assignSplitButton").disabled = true;
		document.getElementById("copyassignSplitButton").disabled = true;
	};

	/**
	 * Populates the basic ok dialog with the text for a worklist build error
	 */
	var openBuildErrorDialog = function(){
		$("#aswlOkDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_BUILD_ERROR);
		$("#aswlOkDialogMessage").html(rcm_assignment_worklist_i18n.ASWL_BUILD_ERROR_MESSAGE);
		getFloatingBarPosition("aswlOkDialog");
		$("#aswlOkDialog").show();
	};

	/**
	 * Populates the basic replace dialog with the text for a replace warning
	 */
	var openReplaceDialog = function(){
		$aswlReplaceUnassignBtn = $(".aswl-dialog-buttons .aswlReplaceUnassignBtn");
		$("#aswlReplaceUnassignDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_REPLACE_RELATIONSHIPS);
		var middleString =rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_MIDDLE_SINGULAR;
		var endString = rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_END_SINGULAR;
		var beginString = rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_BEGIN_SINGULAR;
		if(selected > 1){
			beginString = rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_BEGIN;
			middleString =rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_MIDDLE;
			endString = rcm_assignment_worklist_i18n.ASWL_REPLACE_CONFIRM_END;
		}
		var messageString =  beginString+ ($("#aswlProviderSearch").val()) +middleString +selected +endString;

		$("#aswlReplaceUnassignDialogMessage").html(messageString);
		getFloatingBarPosition("aswlReplaceUnassignDialog");
		$aswlReplaceUnassignBtn.attr("id", "aswlBtnReplace");
		$aswlReplaceUnassignBtn.val(rcm_assignment_worklist_i18n.ASWL_REPLACE);
		$("#aswlReplaceUnassignDialog").show();
		$aswlReplaceUnassignBtn.focus();

		$aswlReplaceUnassignBtn.unbind("click");
		$aswlReplaceUnassignBtn.click(function(){
			$("#aswlBtnReplace").prop("disabled",true);
			$("#aswlBtnCancel").prop("disabled", true);
			replaceButtonFunction();
			$("#aswlBtnReplace").prop('disabled', false);
			$("#aswlBtnCancel").prop('disabled', false);
			$("#aswlReplaceUnassignDialog").hide();
		});
	};

	/**
	* Opens unassign dialog
	*/
	var openUnassignDialog = function(){
		$("#aswlReplaceUnassignDialogTitle").html(rcm_assignment_worklist_i18n.ASWL_UNASSIGN_RELATIONSHIPS);
		var messageString = rcm_assignment_worklist_i18n.ASWL_REMOVE_CONFIRM_SINGULAR;
		if(selected > 1){
			messageString = rcm_assignment_worklist_i18n.ASWL_REMOVE_CONFIRM;
		}
		$aswlReplaceUnassignBtn = $(".aswl-dialog-buttons .aswlReplaceUnassignBtn");

		$("#aswlReplaceUnassignDialogMessage").html(messageString);
		getFloatingBarPosition("aswlReplaceUnassignDialog");
		$aswlReplaceUnassignBtn.attr("id", "aswlBtnUnassign");
		$aswlReplaceUnassignBtn.val(rcm_assignment_worklist_i18n.ASWL_UNASSIGN);
		$("#aswlReplaceUnassignDialog").show();
		$aswlReplaceUnassignBtn.focus();
		document.getElementById("assignSplitButton").disabled = true;
		document.getElementById("copyassignSplitButton").disabled = true;

		$aswlReplaceUnassignBtn.unbind("click");
		$aswlReplaceUnassignBtn.click(function(){
			$("#aswlBtnUnassign").prop("disabled", true);
			$("#aswlBtnCancel").prop("disabled", true);
			removeButtonFunction();
			$("#aswlBtnUnassign").prop('disabled', false);
			$("#aswlBtnCancel").prop('disabled', false);
			$("#aswlReplaceUnassignDialog").hide();
		});
	};

	/**
	 *Returns the position of the floating bar
	 */
	var getFloatingBarPosition = function(id){
		var idString = "#" + id;
		var position = $("#copiedtableHeader").position();
		if(position){
			$(idString).css("top", position.top + ($(window).height()-$(idString).height())/2);
		}
		else{
			$(idString).css("top", ($(window).height()-$(idString).height())/2);
		}
	};

	/**
	 * Returns the mouse position
	 */
	var getMousePosition = function(name){
		var position = $(name).offset();
		var cursor = { x: 0, y: 0 };
		cursor.x = position.left + $(name).width()/2;
		cursor.y = position.top + $(name).height() + 3;
		return cursor;
	};

	/**
	 *Compares the lists of relationships for a patient so that all cells in
	 * a row will be the same height
	 */
    var compareLists = function(listLength, length, className){
        var html = [];
        var difference = length - listLength;
        while (difference !== 0) {
        	html.push("<div  class='aswl-blankLine'> <br/></div> ");
            difference--;
        }
        html.push("<br/>");
        html.push("<div class='aswl-unassigned-div'><div  class='", className, " aswl-ua aswl-unassigned'>", rcm_assignment_worklist_i18n.ASWL_ASSIGN, "</div></div>");
        return html.join("");
    };

	/**
	 * Returns the index of the option to be selected if there are personnel
	 * selected in the worklist (1=Current Selection) or there are no personnel
	 * selected (0=Blank)
	 */
	var getCurrentAssignmentIndex = function(){
		var index = 0;
		if(selected > 0){
			index = 1;
		}
		return index;
	};

    /**
     * Notify listener to refresh assignment worklist.
     */
	var notifyRefreshListeners = function(){
		for(var i = 0; i < refreshListeners.length; i++){
			refreshListeners[i]();
		}
	};

	/**
	 * Creates the object sent to the maintainRelationships function to add new personnel relationships
	 * and delete existing personnel relationships
	 */
	var getReassignWorklistItem = function($row, newPersonnelId, flagAssignReplace){
		var selectedCandidateItems = $row.find(".aswl-selected-candidate");
		if (selectedCandidateItems.length === 0) {
			return null;
		}
		var worklistItem = {};
		worklistItem.encounterId = getEncounterId($row);
		worklistItem.version = getVersionNum($row);
		worklistItem.patientId = getPatientId($row);
		worklistItem.addCareManagers = [];
		worklistItem.addDischargePlanners = [];
		worklistItem.addDocSpecialists = [];
		worklistItem.removeRelationshipIds = [];

		// Only assign the new personnel once for each relationship type (CM, DP, and DS).
		var isCMAssigned = false;
		var isDPAssigned = false;
		var isDSAssigned = false;
		selectedCandidateItems.each(function(){
			if ($(this).attr("id"))
				var personnelId = $(this).attr("id").substring(4);

			//add new relationship
			if (flagAssignReplace === 0){

				if ($(this).hasClass("aswl-careManager")) {
					if(!isCMAssigned) {
						var cmAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 1);
						if(!cmAlreadyAssigned){
							worklistItem.addCareManagers.push(String(newPersonnelId));
							isCMAssigned = true;
						}
					}
				}
				else if($(this).hasClass("aswl-dischargePlanner")){
					if(!isDPAssigned) {
						var dpAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 2);
						if(!dpAlreadyAssigned){
							worklistItem.addDischargePlanners.push(String(newPersonnelId));
							isDPAssigned = true;
						}
					}
				}
				else{
					if(!isDSAssigned){
						var dsAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 3);
						if(!dsAlreadyAssigned){
							worklistItem.addDocSpecialists.push(String(newPersonnelId));
							isDSAssigned = true;
						}
					}
				}
			}

			//replace current relationship
			if (flagAssignReplace === 1){
				if (!($(this).hasClass("aswl-ua") || $(this).hasClass("aswl-oua"))) {
				var relationshipId = $(this).find(".aswl-managerPlannerName").attr("id").substring(4);
					if(Number(newPersonnelId) !== Number(relationshipId)){
						worklistItem.removeRelationshipIds.push(personnelId);
					}

					if ($(this).hasClass("aswl-careManager")) {
						if(!isCMAssigned) {
							var cmAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 1);
							if(!cmAlreadyAssigned){
								worklistItem.addCareManagers.push(String(newPersonnelId));
								isCMAssigned = true;
							}
						}
					}
					else if($(this).hasClass("aswl-dischargePlanner")){
						if(!isDPAssigned) {
							var dpAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 2);
							if(!dpAlreadyAssigned){
								worklistItem.addDischargePlanners.push(String(newPersonnelId));
								isDPAssigned = true;
							}
						}
					}
					else{
						if(!isDSAssigned){
							var dsAlreadyAssigned = checkPersonnelRelationship(worklistItem.patientId, worklistItem.encounterId, newPersonnelId, 3);
							if(!dsAlreadyAssigned){
								worklistItem.addDocSpecialists.push(String(newPersonnelId));
								isDSAssigned = true;
							}
						}
					}
				}
			}

			//remove relationship
			if (flagAssignReplace === 2){
			    if ( !($(this).hasClass("aswl-ua") || $(this).hasClass("aswl-oua"))) {
					worklistItem.removeRelationshipIds.push(personnelId);
				}
			}
		});
		return worklistItem;
	};

	/**
	 * Checks patient and encounter id to see if personnel already has been added as the selected relationship
	 * to prevent double assignment of personnel under one relationship.
	 */
	var checkPersonnelRelationship = function(patientId, encounterId, personnelId, relationshipFlag){
		var personExistsForRelationship = false;

		// Relationship is for Care Managers
		if(relationshipFlag === 1){
			for(var index = 0; index < worklistItemsResult.length; index++){
				var worklistItemResult = worklistItemsResult[index];
				if(worklistItemResult.patientId === patientId && worklistItemResult.encounterId === encounterId){
					var worklistItemPatientResult = worklistItemResult.careManagers;
					for(var ind = 0; ind < worklistItemPatientResult.length; ind++){
						if(Number(worklistItemPatientResult[ind].personnelId) === Number(personnelId)){
							 personExistsForRelationship = true;
						}
					}
				}
			}
		}

		// Relationship is for Discharge Planners
		else if(relationshipFlag === 2){
			for(var index = 0; index < worklistItemsResult.length; index++){
				var worklistItemResult = worklistItemsResult[index];
				if(worklistItemResult.patientId === patientId && worklistItemResult.encounterId === encounterId){
					var worklistItemPatientResult = worklistItemResult.dischargePlanners;
					for(var ind = 0; ind < worklistItemPatientResult.length; ind++){
						if(Number(worklistItemPatientResult[ind].personnelId) === Number(personnelId)){
							personExistsForRelationship = true;
						}
					}
				}
			}
		}

		// Relationship is for Documentation Specialists (flag = 3)
		else{
			for(var index = 0; index < worklistItemsResult.length; index++){
				var worklistItemResult = worklistItemsResult[index];
				if(worklistItemResult.patientId === patientId && worklistItemResult.encounterId === encounterId){
					var worklistItemPatientResult = worklistItemResult.documentationSpecialists;
					for(var ind = 0; ind < worklistItemPatientResult.length; ind++){
						if(Number(worklistItemPatientResult[ind].personnelId) === Number(personnelId)){
							personExistsForRelationship = true;
						}
					}
				}
			}
		}
		return personExistsForRelationship;
	};

	/**
	 * Creates the object sent to the maintainRelationships function to delete personnel relationships
	 */
   	var getDeleteWorklistItem = function($row, managerPlannerId){
		var worklistItem = {};
		worklistItem.encounterId = getEncounterId($row);
		worklistItem.version = getVersionNum($row);
		worklistItem.patientId = getPatientId($row);
		worklistItem.addCareManagers = [];
		worklistItem.addDischargePlanners = [];
		worklistItem.addDocSpecialists = [];
		worklistItem.removeRelationshipIds = [];
		worklistItem.removeRelationshipIds.push(managerPlannerId);
		return worklistItem;

	};

	/**
	 * Returns the encounter id based on a given row
	 */
	var getEncounterId = function($row){
		var encounterColumnId = $row.find(".aswl-encounterCol").attr("id");
		var encounterId = encounterColumnId.substring(8);
		return encounterId;
	};

	/**
	 * Returns the patient encounter version number based on a given row
	 */
	var getVersionNum = function($row){
		var versionColumnId = $row.find(".aswl-versionCol").attr("id");
		var versionId = versionColumnId.substring(8);
		return parseInt(versionId);
	};

	/**
	 * Returns the patient id based on a given row
	 */
	var getPatientId = function($row){
		var patientIdColumnId = $row.find(".aswl-patientIdCol").attr("id");
		var patientId = patientIdColumnId.substring(8);
		return patientId;
	};

	/**
	 * Adds or removes personnel relationships with patients
	 */
	var maintainRelationships = function(worklistItemsArray){
		var status = delegate.maintainRelationships(worklistItemsArray);
		switch(status){
			case 0:
				clearSelections();
				document.getElementById("currentAssignment").selectedIndex = 0;
				document.getElementById("copycurrentAssignment").selectedIndex = 0;
				selectedOptionCurrentAssignment = 0;
				handleNameChange();
				// notify refresh listener on success service calls.
				notifyRefreshListeners();
				break;
			case 1:
				openCMEstablishFailedDialog();
				break;
			case 2:
				openDPEstablishFailedDialog();
				break;
			case 3:
				openDSEstablishFailedDialog();
				break;
			case 4:
				clearSelections();
				document.getElementById("currentAssignment").selectedIndex = 0;
				document.getElementById("copycurrentAssignment").selectedIndex = 0;
				selectedOptionCurrentAssignment = 0;
				handleNameChange();
				openStaleDataDialog();
				break;
			case -1:
				openDeleteFailedDialog();
				break;
		}
	};

	/**
	 * Creates split button for assgining, and replacing
	 */
	var splitButton = function(button_ID, button_ID2,optionsArray, criterion){
		var currentOption;
		var buttonID = button_ID;
		var buttonID2 = button_ID2;
		var copybuttonID2 = "copy"+buttonID2;
		var options = optionsArray;
		var htmlArray = [];
		var htmlArray2 = [];
		isOpen = false;
		var buttonIDDtag = "#" + buttonID;
		var location = criterion.static_content;
		var gradientLocation = "url("+location + "\\images\\buttonGradient.png)";
		var imageLocation = location + "\\images\\5323_16.png";
		if(options){
			currentOption = options[0];
		}

		htmlArray.push("<div>");
			htmlArray.push("<div id ='splitButton-button-area-id' class='splitButton-button-area' >");
				htmlArray.push("<button type = 'button' class='classButton1' id='", buttonID,"'>",currentOption+"(" +selected+")", "</button>");
				htmlArray.push("<button type = 'button' class='classButton2' id= '", buttonID2,"'><img src='", imageLocation ,"'alt=''/> </button>");
			htmlArray.push("</div>");
		htmlArray.push("</div>");

		html = htmlArray.join("");

		var dropDownDiv = document.createElement("div");
			htmlArray2.push("<div id='splitButton-dropdown-area-id' class='splitButton-dropdown-area'>");
				htmlArray2.push("<table>");
				for(var i=0; i < options.length; i++){
					var rowID = 'splitButton-row'+ i;
					var dataID = 'splitButton-data'+ i;
					htmlArray2.push("<tr id='",rowID,"' class='splitButton-row'>");
					htmlArray2.push("<td id='",dataID,"'>",options[i],"</td>");
					htmlArray2.push("</tr>");
					var i = i;
				}
				htmlArray2.push("</table>");
			htmlArray2.push("</div>");

		 html2 = htmlArray2.join("");
		 dropDownDiv.innerHTML = html2;
		 document.body.appendChild(dropDownDiv);

		 //The javascript for the split button
		this.jsSplitButton = function(){
			document.getElementById("assignSplitButton").disabled = true;

			$splitButtonButtonArea = $(".splitButton-button-area");

			$splitButtonButtonArea.css("background-image", gradientLocation);
			$splitButtonButtonArea.css("background-repeat", "repeat-x");

			$splitButtonDropDownAreaID =$('#splitButton-dropdown-area-id');
			$(document).ready(function(){
				var secondButton = document.getElementById(buttonID2);

				secondButton.onclick = function(){
					isOpen = !isOpen;

					if(isOpen === true){
						$splitButtonDropDownAreaID.slideDown('fast',function(){});
						var buttonPosition = $(".splitButton-button-area").position();
						var buttonLeft = buttonPosition.left + 15;
						var buttonTop = buttonPosition.top + ($(".splitButton-button-area").height() * 2);
						$('.splitButton-dropdown-area').css("left", buttonLeft);
						$('.splitButton-dropdown-area').css("top", buttonTop);
					}else{
						$splitButtonDropDownAreaID.slideUp('fast',function(){});
					}
				};

				createOnClicks = function(currentRow, rowData){
					currentRow.onclick = function(){
						currentDataID = "#" + currentRow;
						currentOption = rowData;
						document.getElementById(buttonID).value= splitButtonAssign.getcurrentOption() +"(" +selected+")" ;
						document.getElementById("copy"+buttonID).value= document.getElementById(buttonID).value ;
						$splitButtonDropDownAreaID.slideUp('fast',function(){});
						isOpen = !isOpen;
						switch(splitButtonAssign.getcurrentOption()){

							case"Add Assignment":
							assignButtonFunction();
							break;

							case"Replace Assignment":
							$("assignSplitButton").prop('disabled', true);
							$("copyassignSplitButton").prop('disabled', true);
							 openReplaceDialog();
							break;

							/*
							case"Remove Assignment":
							$("assignSplitButton").attr('disabled', 'disabled');
							removeButtonFunction();
							break;
							*/
						}
					};
				};
				createOnHover = function(currentRow){
					currentRow.onmouseover = function(){
						$(currentRow).addClass("aswl-dropdown-selected");
					};
					currentRow.onmouseout = function(){
						$(currentRow).removeClass("aswl-dropdown-selected");
					};
				};

				for(var i=0; i < options.length; i++){
					var currentRow ='splitButton-row'+ i;
					clickRow = document.getElementById(currentRow);
					var rowData = ($("#splitButton-data"+i).html());
					createOnClicks(clickRow, rowData);
					createOnHover(clickRow);
				}
			});
		};
		this.getcurrentOption = function(){
			return currentOption;
		};
		this.setcurrentOption = function(num){
			currentOption =  options[num];
		};
		this.getHtml = function(){
			return html;
		};
	};
};
