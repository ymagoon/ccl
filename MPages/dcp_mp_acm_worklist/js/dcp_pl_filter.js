function ACM_Filter(criterion, controller) {
	this.criterion = criterion;
	this.controller = controller;
	this.inaccessibleList = 0;
	this.m_inaccessibleListArr = [];
	this.m_selectedPatientListID = 0;
	this.m_defaultPatientListID = -1;
	this.lastExpandedFilter = null;
	this.m_savedLists = [];
	this.m_modifiedList = [];
	this.listAutoRemove = 0;
	var m_controller = controller;
	var staticContentPath = m_controller.staticContentPath;
	var m_filterObj = this;
	var m_curListSearchArguments = [];
	var m_filtersToShow = [];
	var m_filterValues = { FILTER_LIST:[] };
	var m_sLastAppliedFilterChecks = "[]";
	var m_filtersAppliedPreviously; // Used to store the state of filter arguments previously applied on the worklist.
	var bedrock_prefs = m_controller.getBedrockPrefs();
	var m_maxDigits = {
		Values:10,
		Days:3
	};
	var m_bLoadFailed = false;

	this.m_sections = [
		{
			title:i18n.rwl.AUTOREMOVETEXT,
			argument_name: 'AUTOREMOVEPATIENTS',
			parent_entity_name: 'PARAMETER',
			type:'autoRemove'
		},
		{
			title:i18n.rwl.PROVIDERGROUP,
			argument_name:"ACMPRSNLGROUPS",
			parent_entity_name:"PARAMETER",
			type:"provGrp"
		},
		{
			title:i18n.rwl.PROVIDERS,
			argument_name: "SINGLEPROVIDER",
			parent_entity_name: "PARAMETER",
			type:"singleProv"
		},
		{
			title:i18n.rwl.LIFETIMERELATIONSHIP,
			argument_name:"PPRCODES",
			parent_entity_name:"PARAMETER",
			type:'relTypePPR'
		},
		{
			title:i18n.rwl.VISITRELATIONSHIP,
			argument_name:'EPRCODES',
			parent_entity_name:'PARAMETER',
			type:'relTypeEPR'
		},
		{
			title:i18n.rwl.LOCATION,
			argument_name:'LOCATIONS',
			type:'location'
		},
		{
			title:i18n.rwl.AGE,
			argument_name:"AGE",
			parent_entity_name:"CODE_VALUE",
			type:"age"
		},
		{
			title:i18n.rwl.SEX,
			argument_name:"GENDER",
			parent_entity_name:"CODE_VALUE",
			type:"gender"
		},
		{
			title:i18n.rwl.LANGUAGE,
			argument_name:"LANGUAGE",
			parent_entity_name:"CODE_VALUE",
			type:"language"
		},
		{
			title:i18n.rwl.RACE,
			argument_name:"RACE",
			parent_entity_name:"CODE_VALUE",
			type:"race"
		},
		{
			title:i18n.rwl.ASSOCIATEPROVIDERS,
			argument_name:"ASSOC_PROVIDERS",
			parent_entity_name:"PRSNL",
			type:"associatedProviders"
		},
		{
			title: bedrock_prefs.CASE_MGR_HEADER,
			argument_name:"CASEMANAGER",
			parent_entity_name:"CODE_VALUE",
			type:"caseManager"
		},
		{
			title:i18n.rwl.FINANCIALCLASS,
			argument_name:"FINANCIALCLASS",
			parent_entity_name:"CODE_VALUE",
			type:"financialClass"
		},
		{
			title:i18n.rwl.HEALTHPLAN,
			argument_name:"HEALTHPLAN",
			parent_entity_name:"CODE_VALUE",
			type:"healthplan"
		},
		{
			title:i18n.rwl.READMISSIONRISK,
			argument_name:"RISK",
			parent_entity_name:"CODE_VALUE",
			type:"risk"
		},
		{
			title:i18n.rwl.ADMISSIONRANGE,
			argument_name:"ADMISSION",
			parent_entity_name:"CODE_VALUE",
			type:"admissionSince"
		},
		{
			title:i18n.rwl.DISCHARGERANGE,
			argument_name:'DISCHARGE',
			parent_entity_name:'CODE_VALUE',
			type:'dischargeSince'
		},
		{
			title:i18n.rwl.ENCOUNTERTYPE,
			argument_name:"ENCOUNTERTYPE",
			parent_entity_name:"CODE_VALUE",
			type:"encounterType"
		},
		{
			title:i18n.rwl.CASESTATUS,
			argument_name:'CASESTATUS',
			parent_entity_name:'CODE_VALUE',
			type:'caseStatus'
		},
		{
			title: bedrock_prefs.APPOINTMENT_HEADER,
			argument_name:"APPTSTATUS",
			parent_entity_name:"CODE_VALUE",
			type:"appointment"
		},
		{
			title:i18n.rwl.CONDITIONS,
			argument_name:"CONDITION",
			parent_entity_name:"CODE_VALUE",
			type:"condition"
		},
		{
			parent_entity_name: "br_datamart_value",
			type: "resultFilter1"
		},
		{
			parent_entity_name: "br_datamart_value",
			type: "resultFilter2"
		},
		{
			parent_entity_name: "br_datamart_value",
			type: "resultFilter3"
		},
		{
			parent_entity_name: "br_datamart_value",
			type: "resultFilter4"
		},
		{
			parent_entity_name: "br_datamart_value",
			type: "resultFilter5"
		},
		{
			title: i18n.rwl.MEDICATIONS,
			argument_name: "ORDERSTATUS",
			parent_entity_name: "CODE_VALUE",
			type: "medications"
		},
		{
			title: bedrock_prefs.ORDERS_HEADER,
			argument_name:"ORDERSSTATUS",
			parent_entity_name:"CODE_VALUE",
			type:"order"
		},
		{
			title:i18n.rwl.HEALTHMAINTENANCE,
			argument_name:"EXPECTATIONS",
			parent_entity_name:"HM_EXPECT",
			type:"expectation"
		},
		{
			title:i18n.rwl.REGISTRY,
			argument_name:'REGISTRY',
			parent_entity_name:'CODE_VALUE',
			type:'registry'
		},
		{
			title:i18n.rwl.COMMUNICATIONPREF,
			argument_name:'COMMUNICATIONPREF',
			parent_entity_name:'CODE_VALUE',
			type:'communicationPref'
		},
		{
			title:i18n.rwl.RANKING,
			argument_name:"RANKING",
			parent_entity_name:"CODE_VALUE",
			type:"ranking"
		},
		{
			title:i18n.rwl.QUALIFYING,
			argument_name:"QUALIFYING",
			parent_entity_name:"CODE_VALUE",
			type:"qualifying"
		},
		{
			title: i18n.rwl.S_PENDING_WORK,
			argument_name: 'PENDING_WORK',
			parent_entity_name: 'CODE_VALUE',
			type: 'pendingWork'
		}
	];
	this.fnOnClickApplyFilterButton = function() {
		m_controller.createCheckpoint('USR:DWL-APPLYFILTER', 'Start');
		m_controller.resetFuzzySearch();
		var allFilters = m_filterObj.getFilterChecks();
		var filters = m_filterObj.getNewlyAppliedFilters(allFilters);
		if (filters.length === 0 || JSON.stringify(filters) === JSON.stringify(allFilters) ||
			!m_filterObj.narrowFilteredPatients(allFilters, json_parse(m_filtersAppliedPreviously))) {
			m_controller.applyFilters(allFilters, 'all');
		} else {
			m_controller.applyFilters(filters, 'filtered');
		}
		m_filterObj.updateModificationBuffer(1);
		$('#filterButApply').attr('disabled', 'disabled');
		m_controller.appliedFilters = true;
		m_controller.createCheckpoint('USR:DWL-APPLYFILTER', 'Stop', [{key: 'List ID', value: m_controller.getActivePatientListID()},{key: 'Applied Filters', value: JSON.stringify(allFilters)}]);
	};
	this.initialize = function(){
		this.buildFilterBar();
		$("#filterButClearAll").click(function() {
			m_controller.createCheckpoint("USR:DWL-CLEAR.ALL.FILTERS", "Start");
			m_controller.resetFuzzySearch();
			m_filterObj.revertAllSections();
			hideFilterIndividualEncSection();
			if (m_controller.appliedFilters) {
				m_controller.applyFilters([], 'clear');
			}
			$("#filterButClearAll").attr("disabled","disabled");
			$("#filterButApply").attr("disabled", "disabled");
			m_controller.appliedFilters = false;
			m_controller.createCheckpoint("USR:DWL-CLEAR.ALL.FILTERS", "Stop", [{key: "List ID", value: m_controller.getActivePatientListID()}]);
		});
		$('#filterButApply').click(m_filterObj.fnOnClickApplyFilterButton);
		this.populateDropdowns();
		this.loadFilterValues();
		this.applySectionDetails();
		if(m_controller.getRiskFlag() == 0 || m_controller.getCaseStatusFlag() === false) {
			for(var m = 0, mlen = this.m_sections.length, flagCnt = 0; m < mlen; m++) {
				if((this.m_sections[m].argument_name === 'RISK' && m_controller.getRiskFlag() === 0) ||
					(this.m_sections[m].argument_name === 'CASESTATUS' && m_controller.getCaseStatusFlag() === false)) {
					this.m_sections.splice(m, 1);
					flagCnt++;
					mlen--;
				}
				if(flagCnt === 2) { // We are searching for 2 flags here.
					break;
				}
			}
		}
		var savedListAr = this.m_savedLists;

		m_controller.addMousedownFunction(function($target,bScrollbar){
			if($target.is("#filterToolbarListSelectDrop")){
				return;
			}
			var $filterToolbarButton = $target.closest(".down").not(".filterToolbarDrop");
			var $divDown = $("#divFilterPanelTopBar div.down");
			$divDown.not($filterToolbarButton).not($filterToolbarButton.next(".filterToolbarDrop")).removeClass("down");

			var $filterToolbarListActionButton = $target.closest(".down").not(".filterToolbarDrop");
			$divDown.not($filterToolbarListActionButton).not($filterToolbarListActionButton.next(".filterToolbarDrop")).removeClass("down");
			if(bScrollbar || $target.closest(".filterTitleBar").length){
				return;
			}
			if(!m_filterObj.checkAdmissionInputFilter()) {
				return;
			}
			m_filterObj.collapseSelectFilterSection(m_filterObj.lastExpandedFilter);
			m_filterObj.showSelectedFilterValues(m_filterObj.lastExpandedFilter);
			$("#"+m_filterObj.lastExpandedFilter+"Selected").show();
			m_filterObj.lastExpandedFilter = "";
		});
		$("#divDisabledMenu").css("display","inline");

		var providerID = this.criterion.CRITERION.PRSNL_ID,
			noDefaultList = true,
			savedListArLength = savedListAr.length,
			defaultListID,
			listArg;
		for(var i=0; i<savedListArLength; i++) {
			for(var j=0, argLength = savedListAr[i].ARGUMENTS.length; j<argLength; j++) {
				listArg = savedListAr[i].ARGUMENTS[j];
				if(listArg.ARGUMENT_NAME === 'LISTDEFAULT' && listArg.ARGUMENT_VALUE === '1' && listArg.PARENT_ENTITY_ID === providerID)
				{
					noDefaultList = false;
					defaultListID = savedListAr[i].PATIENT_LIST_ID;
					break;
				}
			}
		}
		if(noDefaultList === true && savedListArLength > 0) {
			defaultListID = savedListAr[0].PATIENT_LIST_ID;
			noDefaultList = false;
		}
		if(defaultListID) {
			this.m_defaultPatientListID = defaultListID;
			this.setActiveList(defaultListID);
		}
		$('#filterTab').toggleClass('collapsed noList',noDefaultList).trigger('updateFilterState');
	};
	this.getUniqueArgNames = function(filterArgs) {
		var uniqueArgNames = [];
		for(var i = 0, filterArgsSize = filterArgs.length; i < filterArgsSize; i++) {
			var argName = filterArgs[i].PARENT_FILTER_NAME;
			if($.inArray(argName, uniqueArgNames) === -1) {
				uniqueArgNames.push(argName);
			}
		}
		return uniqueArgNames;
	};
	this.narrowFilteredPatients = function(allAppliedFilters, previouslyAppliedFilters) {

		var allFiltersArgNames = [],
			previousFiltersArgNames = [];
		var filtersFound = 0;
		allFiltersArgNames = m_filterObj.getUniqueArgNames(allAppliedFilters);
		previousFiltersArgNames = m_filterObj.getUniqueArgNames(previouslyAppliedFilters);
		for (var i = 0, prevFilterArgSize = previousFiltersArgNames.length; i < prevFilterArgSize; i++) {
			if($.inArray(previousFiltersArgNames[i], allFiltersArgNames) > -1) {
				filtersFound = filtersFound + 1;
			}
		}

		if(allFiltersArgNames.length > filtersFound) {
			return true;
		}

		return false;
	};
	this.getNewlyAppliedFilters = function(allFilters) {
		var currentlyApplied = json_parse(m_sLastAppliedFilterChecks);
		var newlyApplied = [];

		var filterStatus = {
			age:[],
			gender:[],
			language:[],
			race:[],
			assoc_providers:[],
			casemanager:[],
			financialclass:[],
			healthplan:[],
			admission:[],
			discharge:[],
			encountertype:[],
			apptstatus:[],
			condition:[],
			results1:[],
			results2:[],
			results3:[],
			results4:[],
			results5:[],
			orderstatus:[],
			ordersstatus:[],
			expectations:[],
			ranking:[],
			qualifying:[],
			registry:[],
			risk:[],
			aoPendingWork:[]
		};

		if(currentlyApplied.length === 0) { //None were previously applied, so must send all
			return allFilters;
		}
		for(var a = 0, alen = allFilters.length; a < alen; a++) {
			var aFilterName = allFilters[a].ARGUMENT_NAME;

			if(aFilterName.match(/^MED[0-9]{1,2}_/)){
				filterStatus.orderstatus.push(allFilters[a]);
			}
			else if(aFilterName.indexOf("RESULT1") > -1 || aFilterName.indexOf("RESULT2") > -1 || aFilterName.indexOf("RESULT3") > -1){
				filterStatus.results1.push(allFilters[a]);
			}
			else if(aFilterName.indexOf("RESULT4") > -1 || aFilterName.indexOf("RESULT5") > -1 || aFilterName.indexOf("RESULT6") > -1){
				filterStatus.results2.push(allFilters[a]);
			}
			else if(aFilterName.indexOf("RESULT7") > -1 || aFilterName.indexOf("RESULT8") > -1 || aFilterName.indexOf("RESULT9") > -1){
				filterStatus.results3.push(allFilters[a]);
			}
			else if(aFilterName.indexOf("RESULT10") > -1 || aFilterName.indexOf("RESULT11") > -1 || aFilterName.indexOf("RESULT12") > -1){
				filterStatus.results4.push(allFilters[a]);
			}
			else if(aFilterName.indexOf("RESULT13") > -1 || aFilterName.indexOf("RESULT14") > -1 || aFilterName.indexOf("RESULT15") > -1){
				filterStatus.results5.push(allFilters[a]);
			}
			else if(aFilterName.match(/^ADMISSION/)){
				filterStatus.admission.push(allFilters[a]);
			}
			else if(aFilterName.match(/^DISCHARGE/)) {
				filterStatus.discharge.push(allFilters[a]);
			}
			else if(aFilterName.match(/^RANKING/)){
				filterStatus.ranking.push(allFilters[a]);
			}
			else if(aFilterName.match(/^PENDING_WORK/)){
				filterStatus.aoPendingWork.push(allFilters[a]);
			}
			else if(aFilterName.match(/^AGE(GREATER|LESS|EQUAL|FROM|TO|DAYS|WEEKS|MONTHS|YEARS)/)){
				filterStatus.age.push(allFilters[a]);
			}
			else if(aFilterName.match(/^ORDER(TYPE|SSTATUS|DATEUNIT|FROM|TO)/)){
				filterStatus.ordersstatus.push(allFilters[a]);
			}
			else if(aFilterName.match(/^APPT(STATUS|DATEUNIT|FROM|TO)/)){
				filterStatus.apptstatus.push(allFilters[a]);
			}
			else if(aFilterName.match(/^RECOMMSTATUS$/)){
				filterStatus.expectations.push(allFilters[a]);
			}
			else if (filterStatus[aFilterName.toLowerCase()]) {
				filterStatus[aFilterName.toLowerCase()].push(allFilters[a]);
			} else {
				filterStatus[aFilterName.toLowerCase()] = [allFilters[a]];
			}
		}

		for(var key in filterStatus) {
			var args = filterStatus[key];
			var numArgs = args.length;
			var numAdded = 0;
			var numExisting = 0;
			for(var i = 0; i < numArgs; i++) {
				var curArgString = JSON.stringify(args[i]);
				if(m_sLastAppliedFilterChecks.indexOf(curArgString) == -1) {
					newlyApplied.push(args[i]);
					numAdded++;
				}
				else {
					numExisting++;
				}
			}

			if(numAdded != numArgs && numExisting != numArgs) { //The current filter section was modified so return all filter args
				return allFilters;
			}
		}
		var sNewlyApplied = JSON.stringify(newlyApplied);
		if((sNewlyApplied.indexOf('ADMISSION') > -1 || sNewlyApplied.indexOf('DISCHARGE') > -1) && sNewlyApplied.indexOf('ENCOUNTER') === -1 && filterStatus.encountertype.length > 0) {
			for(var e = 0, elen = filterStatus.encountertype.length; e < elen; e++) {
				newlyApplied.push(filterStatus.encountertype[e]);
			}
		} else if(sNewlyApplied.indexOf('ENCOUNTER') > -1 && sNewlyApplied.indexOf('ADMISSION') === -1 && filterStatus.admission.length > 0) {
			newlyApplied.push(filterStatus.admission[0]);
		} else if(sNewlyApplied.indexOf('ENCOUNTER') > -1 && sNewlyApplied.indexOf('DISCHARGE') === -1 && filterStatus.discharge.length > 0) {
			newlyApplied.push(filterStatus.discharge[0]);
		}
		return newlyApplied;
	};

	this.buildFilterBar = function(){
		var sectionAr = this.m_sections;
		var htmlString = "";

		htmlString += "<div id='divFilterPanelTopBar'>";
		htmlString += "<div id='divFilterPanelTopBarContent'>";

		htmlString += "<div id='filterToolbarListSelect' class='mainToolbarSize'><div id='filterToolbarName'><span id='filterToolbarListName'></span></div><span id='filterToolbarListDetails'></span><img src='" + staticContentPath + "/images/5323_16.png'/></div>";
		htmlString += "<div id='filterToolbarListSelectDrop' class='filterToolbarDrop'></div>";
		htmlString += "</div></div>";
		htmlString += "<div id='filterShell'>";
		htmlString += "<div id='divDisabledMenu' class='overlayDimmed'></div>";
		htmlString += "<div id='filterPatientCountDiv'>";
		htmlString += "<div id='displayPatientCountDiv'>";
		htmlString += "<span class='patientCountText'>" + i18n.rwl.VIEWING + " </span> <span id='patCountBold' class='patientCountBold'></span> <span id='patientCountText2' class='patientCountText'></span> ";
		htmlString += "</div>";
		htmlString += "<div id='displayRemovableCountDiv'>";
		htmlString += "<img class='removableImage' src='" + staticContentPath + "/images/red_hatch_16.png'/> <span id='removableCountText1'></span><span id='removableCountBold2' class='removableCountBold'></span> <span id='removableCountText2' class='removableCountText'></span> ";
		htmlString += "</div>";
		htmlString += "</div>";
		htmlString += "<div id='filterScrollDiv' class='filterScroll'>";
		htmlString += "<div class='filterDiv'>";
		htmlString += "<table id='filterTable'>";
		htmlString += "</table></div></div>";
		htmlString += "<div id = 'filterBut'><input id ='filterButClearAll' class = 'rwSearchDlgBtn' type = 'button' value = '" + i18n.rwl.CLEARALL + "'/>" +
							"<input id ='filterButApply' class = 'rwSearchDlgBtn' type = 'button' value = '" + i18n.rwl.APPLY + "'/></div>";
		htmlString += "<div id='filterTab' class='collapsed'><img id='imgFilterCollapse' src='" +
							staticContentPath + "/images/6364_left.gif' alt='Collapse'/><div class = 'filterTabText'>&nbsp;&nbsp;" + i18n.rwl.FILTERS + "</div></div>";
		htmlString += "</div>";

		var htmlDetailsString = "<div id='divPLSearchDetails'><div id='divPLSearchContent'><table id='plSearchDetailsTable'></table></div><div id='divPLSearchMore' class='moreInModify'>" + i18n.rwl.MOREINMODIFY + "</div></div>";
		var htmlListNameTooltip = "<div id ='fullListNameTooltip'></div>";
		var htmlTooltip = "<div id='filterTabTooltip'></div><div id='filterMultiSelectTooltip'></div>";
		var htmlFilterTooltip = "<div id='filterTooltip'></div>";

		$("body").append(htmlString, htmlDetailsString, htmlListNameTooltip, htmlTooltip, htmlFilterTooltip);
		$("#filterPatientCountDiv")
			.add("#displayRemovableCountDiv")
			.hide();
	};

	this.buildExpectationsFilter = function() {
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";

		htmlString += "<div id='expectationTab' class='filterTitleBar'><span class='filterTitle'>" + i18n.rwl.HEALTHMAINTENANCE + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
			htmlString += "<div id ='expectationSelect' class='filterSelect'>";
				htmlString += "<div id ='expectations'>";
					htmlString += "<select id = 'filterExpectationsDrop' class='multiselect expectationsDrop' multiple='multiple' size='4'></select>";
				htmlString += "</div>";
				htmlString += "<table id='expectationTable' class='selectTable'></table>";
			htmlString += "</div>";

			htmlString += "<div id='expectationSelected' class='filterSelected'>";
				htmlString += "<table id='expectationSelectedTable' class='filterSelectedTable'></table></div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};

	this.buildOrdersFilter = function(title) {
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";

		htmlString += "<div id='orderTab' class='filterTitleBar'><span class='filterTitle'>" + title + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
			htmlString += "<div id ='orderSelect' class='filterSelect'>";
				htmlString += "<div id = 'orderPast' class ='apptOrderFloatLeft'>";
					htmlString += "<span>" + i18n.rwl.PAST + " <br/></span><input id='orderFromDate' class = 'orderDate textInputHeight' type='text' value='0' maxlength='" + m_maxDigits.Days + "'/>";
				htmlString += "</div>";
				htmlString += "<div id= 'orderFuture' class = 'apptOrderFloatLeft'>";
					htmlString += "<span>" + i18n.rwl.FUTURE + " <br/></span><input id='orderToDate' class = 'orderDate textInputHeight' type='text' value='0' maxlength='" + m_maxDigits.Days + "'/>";
				htmlString += "</div>";
				htmlString += "<div id='orderDate' class='apptOrderFloatLeft'>";
					htmlString += "<br/>";
					htmlString += "<select id='orderDateDrop'>";
						htmlString += "<option value = '0'>" + i18n.rwl.DAYS + "</option>";
						htmlString += "<option value = '1'>" + i18n.rwl.WEEKS + "</option>";
						htmlString += "<option value = '2'>" + i18n.rwl.MONTHS + "</option>";
					htmlString += "</select><br/>";
					htmlString += "<span id= 'filterOrderTimeMax' class = 'maxDaysLimit'>" + i18n.rwl.DAYSMAX + "</span>";
				htmlString += "</div>";
				htmlString += "<div id ='orderType' class = 'apptOrderClearFloat'>" + i18n.rwl.TYPE + " <br/>";
					htmlString += "<select id = 'filterOrderTypeDrop' class='multiselect orderTypeDrop' multiple='multiple' size='4'></select>";
				htmlString += "</div>";
				htmlString += "<table id='orderTable' class='selectTable'></table>";
			htmlString += "</div>";

			htmlString += "<div id='orderSelected' class='filterSelected'>";
				htmlString += "<table id='orderSelectedTable' class='filterSelectedTable'></table></div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};

	this.buildAppointmentsFilter = function(title) {
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";

		htmlString += "<div id='appointmentTab' class='filterTitleBar'><span class='filterTitle'>" + title + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
			htmlString += "<div id ='appointmentSelect' class='filterSelect'>";
				htmlString += this.buildAppointmentSection(false);
				htmlString += this.buildAppointmentSection(true);
			htmlString += "</div>";

			htmlString += "<div id='appointmentSelected' class='filterSelected'>";
				htmlString += "<table id='appointmentSelectedTable' class='filterSelectedTable'></table>";
			htmlString += "</div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};
	this.buildAppointmentSection = function (noAppt) {
		var noApptStr = (noAppt === true) ? 'noA' : 'a';

		var htmlString = '<label><input type = "radio" name = "apptStatusRadio" value = "' + noApptStr + 'ppointment" id = "' + noApptStr + 'pptRadio">';
		htmlString += (noAppt === true) ? i18n.rwl.NOAPPOINTMENTS : i18n.rwl.APPOINTMENTS;
		htmlString += '</label>';
		htmlString += '<div id = "' + noApptStr + 'ppointment" class ="appointmentRadio">';
			htmlString += '<div id = "' + noApptStr + 'ppointmentPast" class ="apptOrderFloatLeft">';
				htmlString += '<span>' + i18n.rwl.PAST + ' <br/></span><input id="' + noApptStr + 'pptFromDate" class = "' + noApptStr + 'pptDate textInputHeight" type="text" value="0" maxlength="' + m_maxDigits.Days + '"/>';
			htmlString += '</div>';
			htmlString += '<div id= "' + noApptStr + 'ppointmentFuture" class = "apptOrderFloatLeft">';
				htmlString += '<span>' + i18n.rwl.FUTURE + ' <br/></span><input id="' + noApptStr + 'pptToDate" class = "' + noApptStr + 'pptDate textInputHeight" type="text" value="0" maxlength="' + m_maxDigits.Days + '"/>';
			htmlString += '</div>';
			htmlString += '<div id="' + noApptStr + 'ppointmentDate" class="apptOrderFloatLeft">';
				htmlString += '<br/>';
				htmlString += '<select id="' + noApptStr + 'pptDateDrop">';
					htmlString += '<option value = "0">' + i18n.rwl.DAYS + '</option>';
					htmlString += '<option value = "1">' + i18n.rwl.WEEKS + '</option>';
					htmlString += '<option value = "2">' + i18n.rwl.MONTHS + '</option>';
				htmlString += '</select><br/>';
				htmlString += '<span id= "';
				htmlString += (noAppt === true) ? 'filterNoApptTimeMax' : 'filterApptTimeMax';
				htmlString += '" class= "maxDaysLimit">' + i18n.rwl.DAYSMAX + '</span>';
			htmlString += '</div>';
			htmlString += (noAppt === true) ? '' : '<table id="appointmentTable" class="selectTable apptOrderClearFloat"></table>';
		htmlString += '</div>';
		return htmlString;
	};

	this.buildQualifyingFilter = function() {
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";

		htmlString += "<div id='qualifyingTab' class='filterTitleBar'><span class='filterTitle'>" + i18n.rwl.QUALIFYING + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";

			htmlString += "<div id ='qualifyingSelect' class='filterSelect'>";
				htmlString += "<label><input type ='radio' name='qualifyingRadio' value='all' id='qualifyingAll' checked='checked' class='qualifying'>" + i18n.rwl.ALL + " </label><br/>";
				htmlString += "<label><input type ='radio' name='qualifyingRadio' value='still' id='qualifyingStill' class='qualifying'>" + i18n.rwl.STILLQUALIFYING + " </label><br/>";
				htmlString += "<label><input type ='radio' name='qualifyingRadio' value='not' id='qualifyingNot' class='qualifying'>" + i18n.rwl.NOTQUALIFYING + " </label><br/>";
			htmlString += "</div>";

			htmlString += "<div id='qualifyingSelected' class='filterSelected'>";
				htmlString += "<table id='qualifyingSelectedTable' class='filterSelectedTable'></table></div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};
	this.buildMedsFilter = function()
	{
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";

		htmlString += "<div id='medicationsTab' class='filterTitleBar'><span class='filterTitle'>" + i18n.rwl.MEDICATIONS + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
			htmlString += "<div id ='medicationsSelect' class='filterSelect'>";
				htmlString += "<div id='medicationOperator' class='resultMedPadding'>";
					htmlString += "<label><input type ='radio' name='medicationsOperatorType' value='or' id='medicationsOr' checked='checked' class = 'meds'>" + i18n.rwl.OR + "</label> &nbsp;&nbsp;";
					htmlString += "<label><input type ='radio' name='medicationsOperatorType' value='and' id='medicationsAnd' class = 'meds'>" + i18n.rwl.AND + " </label><br/>";
				htmlString += "</div>";
				htmlString += "<span id = 'filterDivMedText'></span>";
				htmlString += '<h3 id = "filterDivMedClassificationHeader" class = "hidden">' + i18n.rwl.CLASSIFICATION + i18n.rwl.COLON + '</h3>';
				htmlString += '<span id = "filterDivMedClassificationText"></span>';
				htmlString += "<div id ='filterDivMedSearch' class = 'filterMed resultMedPadding divResultMedType'>";
					htmlString += "<label><input type ='radio' name='searchType' value='name' id='filterMedSearchName' class='medRadioBut meds' checked='checked'>" + i18n.rwl.NAME + "</label> &nbsp;&nbsp;";
					htmlString += "<label><input type ='radio' name='searchType' value='class' id='filterMedSearchClass' class='medRadioBut meds'>" + i18n.rwl.CLASSIFICATION + " <label><br/>";
					htmlString += "<input type ='text' id='filterMedSearchInput' class='resultMedType meds'/>";
				htmlString += "</div>";
				htmlString += "<div id ='filterDivMedStatus' class = 'filterMed resultMedPadding'>" + i18n.rwl.STATUS + " <br/>";
					htmlString += "<select id = 'filterMedStatusDrop' class ='resultMedWidth meds' disabled='disabled' multiple='multiple'></select>";
				htmlString += "</div>";
				htmlString += "<div id='filterDivMedTime' class = 'filterMed resultMedPadding'>" + i18n.rwl.LOOKBACKRANGE + " <br/>";
					htmlString += "<input id='filterMedTimeInput' class = 'numInput filterTimeInput meds' type='text' maxLength= '" + m_maxDigits.Days + "' disabled='disabled'/>";
					htmlString += "&nbsp;&nbsp;<select id='filterMedTimeDrop' class = 'filterSecDropDown filterTimeDrop meds' disabled='disabled'>";
						htmlString += "<option value = '0'>" + i18n.rwl.DAYS + "</option>";
						htmlString += "<option value = '1'>" + i18n.rwl.WEEKS + "</option>";
						htmlString += "<option value = '2'>" + i18n.rwl.MONTHS + "</option>";
					htmlString += "</select>";
					htmlString += "<br/><span id= 'filterMedTimeMax'></span> </div>";
				htmlString += "<div id = 'filterDivMedAdd' class='filterMed'>";
					htmlString += "<span id = 'filterMedsAddBut' class='resultMedAddBut addButdisabled' disabled='disabled'>" + i18n.rwl.ADD + "</span></div>";
			htmlString += "</div>";

			htmlString += "<div id='medicationsSelected' class='filterSelected'>";
				htmlString += "<table id='medicationsSelectedTable' class='filterSelectedTable'></table></div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};
	this.buildResultsFilter = function(title, type, value)
	{
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";
		htmlString += "<div id='" + type + "Tab' class='filterTitleBar'><span class='filterTitle'>" + title + "</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
				htmlString += "<div id ='" + type + "Select' class='filterSelect overflowVisible'>";
				htmlString += "<div id='" + type + "Operator' class='resultMedPadding'>";
					htmlString += "<label><input type ='radio' name='" + type + "OperatorType' value='or' id='" + type + "Or' checked='checked' class= 'result'>"+ i18n.rwl.OR + "</label> &nbsp;&nbsp;";
					htmlString += "<label><input type ='radio' name='" + type + "OperatorType' value='and' id='" + type + "And' class = 'result'>" + i18n.rwl.AND + " </label><br/>";
				htmlString += "</div>";
				htmlString += "<span id = 'filterDivResultText" + type + "'></span>";
				htmlString += "<div id = 'filterDivResultType" + type + "' rtype='" + type + "' class = 'filterResult" + type + " resultMedPadding divResultMedType'>" + i18n.rwl.NAME + "<br/>";
					htmlString += "<input type='text' id = 'filterResultType" + type + "' rtype='" + type + "' class='result resultMedType filterResultType'/></div>";
				htmlString += "<div id = 'filterDivResultsCount" + type + "' rtype='" + type + "' class='filterResult" + type + " resultMedPadding divResultsCount'>" + i18n.rwl.QUANTITY + "<br/>";
					htmlString += "<select id = 'filterResultsCountDrop" + type + "' rtype='" + type + "' class ='filterSecDropDown filterResultsCountDrop result' disabled='disabled'>";
					htmlString += "<option value='0'>" + i18n.rwl.ATLEAST + "</option>";
					htmlString += "<option value='1'>" + i18n.rwl.LESSTHAN + "</option>";
					htmlString += "</select>";
					htmlString += "&nbsp;&nbsp;";
					htmlString += "<input id ='filterResultsCountInput" + type + "' rtype='" + type + "' class = 'numInput filterResultsCountInput result' type = 'text' disabled='disabled' maxlength='" + m_maxDigits.Values + "'/></div>";
				if(value && value == "1") {
					htmlString += "<div id = 'filterDivValues" + type + "' rtype='" + type + "' class = 'filterResult" + type + " resultMedPadding'>" + i18n.rwl.VALUE + "<br/>";
						htmlString += "<select id ='filterValueDrop" + type + "' rtype='" + type + "' class = 'resultMedWidth filterValueDrop result' disabled='disabled'>";
					htmlString += "<option value='0'>" + i18n.rwl.ANY + "</option>";
					htmlString += "<option value='1'>" + i18n.rwl.GREATERTHAN + "</option>";
					htmlString += "<option value='2'>" + i18n.rwl.GREATERTHANEQ + "</option>";
					htmlString += "<option value='3'>" + i18n.rwl.LESSTHAN + "</option>";
					htmlString += "<option value='4'>" + i18n.rwl.LESSTHANEQ + "</option>";
					htmlString += "<option value='5'>" + i18n.rwl.EQUAL + "</option>";
					htmlString += "<option value='6'>" + i18n.rwl.BETWEEN + "</option>";
					htmlString += "</select></div>";
				}
				htmlString += "<div id='filterDivTime" + type + "' rtype='" + type + "' class = 'filterResult" + type + " resultMedPadding'>" + i18n.rwl.LOOKBACKRANGE + " <br/>";
					htmlString += "<input id='filterResultTimeInput" + type + "' rtype='" + type + "' class = 'numInput filterTimeInput result' type='text' maxLength= '" + m_maxDigits.Days + "' disabled='disabled'/>";
					htmlString += "&nbsp;&nbsp;<select id='filterResultTimeDrop" + type + "' rtype='" + type + "' class = 'filterSecDropDown filterTimeDrop result' disabled='disabled'>";
						htmlString += "<option value = '0'>" + i18n.rwl.DAYS + "</option>";
						htmlString += "<option value = '1'>" + i18n.rwl.WEEKS + "</option>";
						htmlString += "<option value = '2'>" + i18n.rwl.MONTHS + "</option>";
					htmlString += "</select>";
					htmlString += "<br/><span id= 'filterResultTimeMax" + type + "' rtype='" + type + "'></span> </div>";
				htmlString += "<div id = 'filterDivAdd" + type + "' rtype='" + type + "' class='filterResult" + type + "'>";
					htmlString += "<span id = 'filterResultsAddBut" + type + "' rtype='" + type + "' class='addButdisabled filterResultsAddBut resultMedAddBut' disabled='disabled'>" + i18n.rwl.ADD + "</span></div>";
			htmlString += "</div>";

			htmlString += "<div id='" + type + "Selected' class='filterSelected'>";
				htmlString += "<table id='" + type + "SelectedTable' class='filterSelectedTable'></table></div>";

		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};

	this.buildAgeFilter = function(){
		var htmlString = '';
			htmlString += '<tr><td id="tabFilters" class="displayed">';
		htmlString += '<div id="ageTab" class="filterTitleBar"><span class="filterTitle">' + i18n.rwl.AGE + '</span><span class="butRevert">' + i18n.rwl.CLEAR + '</span>';
			htmlString += '<div id="ageSelect" class="filterSelect">';
			htmlString += '<div id="divAgeCombo">';
			htmlString += '<select id="ageFilterTypeCombo">';
			htmlString += '<option value="0">' + i18n.rwl.GREATERTHAN + '</option>';
			htmlString += '<option value="1">' + i18n.rwl.LESSTHAN + '</option>';
			htmlString += '<option value="2">' + i18n.rwl.EQUALTO + '</option>';
			htmlString += '<option value="3">' + i18n.rwl.RANGE + '</option>';
			htmlString += '</select>';
			htmlString += '</div>';
			htmlString += '<div id="divAgeInput"><input type="text" id="greaterThanAge" class="ageFilterField" maxlength="' + m_maxDigits.Days + '"></div>';
			htmlString += '<div id="divAgeTime" class="ageTimeDrop"><select id="filterAgeTimeDrop">';
				htmlString += '<option value = "0">' + i18n.rwl.YEARS + '</option>';
				htmlString += '<option value = "1">' + i18n.rwl.MONTHS + '</option>';
				htmlString += '<option value = "2">' + i18n.rwl.WEEKS + '</option>';
				htmlString += '<option value = "3">' + i18n.rwl.DAYS + '</option>';
			htmlString += '</select></div>';
			htmlString += '</div>';
			htmlString += '<div id="ageSelected" class="filterSelected">';
					htmlString += '<table id="ageSelectedTable" class="filterSelectedTable"></table></div>';
		htmlString += '</div>';
		htmlString += '</td></tr>';
		return htmlString;
	};
	this.buildAdmissionSinceFilter = function(){
		var htmlString = '';
		htmlString += '<tr><td id="tabFilters" class="displayed">';
		htmlString += '<div id="admissionSinceTab" class="filterTitleBar"><span class="filterTitle" id="admTitle">' + i18n.rwl.ADMISSIONRANGE + '</span><span class="butRevert" id="revert">' + i18n.rwl.CLEAR + '</span>';
			htmlString += '<div id="admissionSinceSelect" class="filterSelect">';
			htmlString += '<div id="divAdmissionPastText" class="admitDischargePastText"><span>' + i18n.rwl.PAST + '' + i18n.rwl.COLON + '</span></div>';
			htmlString += '<div id="divAdmissionFilterElements"><div id="divAdmissionInput" class="admitDischargeInput"><input type="text" id="admissionInput" class="admitDischargeFilterField textInputHeight" maxlength="' + m_maxDigits.Days + '"></div>';
			htmlString += '<div id="divAdmissionCombo" class="admitDischargeCombo"><select id="admissionSinceFilterCombo">';
			htmlString += '<option value="0">' + i18n.rwl.DAYS + '</option>';
			htmlString += '<option value="1">' + i18n.rwl.WEEKS + '</option>';
			htmlString += '<option value="2">' + i18n.rwl.MONTHS + '</option>';
			htmlString += '</select></div><div>';
			htmlString += '</div><div id="divAdmissionMax" class="maxDaysLimit admitDischargeMax">' + i18n.rwl.DAYSMAX + '</div></div>';
			htmlString += '</div>';
			htmlString += '<div id="admissionSinceSelected" class="filterSelected">';
					htmlString += '<table id="admissionSinceSelectedTable" class="filterSelectedTable"></table></div>';
		htmlString += '</div></td></tr>';
		return htmlString;
	};
	this.buildDischargeRangeFilter = function() {
		var htmlString = '';
		htmlString += '<tr><td id="tabFilters" class="displayed">';
		htmlString += '<div id="dischargeSinceTab" class="filterTitleBar"><span class="filterTitle" id="dischTitle">' + i18n.rwl.DISCHARGERANGE + '</span><span class="butRevert" id="revert">' + i18n.rwl.CLEAR + '</span>';
		htmlString += '<div id="dischargeSinceSelect" class="filterSelect">';
		htmlString += '<div id="divDischargePastText" class="admitDischargePastText"><span>' + i18n.rwl.PAST + '' + i18n.rwl.COLON + '</span></div>';
		htmlString += '<div id="divDischargeFilterElements"><div id="divDischargeInput" class="admitDischargeInput"><input type="text" id="dischargeInput" class="admitDischargeFilterField textInputHeight" maxlength="' + m_maxDigits.Days + '"></div>';
		htmlString += '<div id="divDischargeCombo" class="admitDischargeCombo"><select id="dischargeSinceFilterCombo">';
		htmlString += '<option value="0">' + i18n.rwl.DAYS + '</option>';
		htmlString += '<option value="1">' + i18n.rwl.WEEKS + '</option>';
		htmlString += '<option value="2">' + i18n.rwl.MONTHS + '</option>';
		htmlString += '</select></div><div>';
		htmlString += '</div><div id="divDischargeMax" class="maxDaysLimit admitDischargeMax">' + i18n.rwl.DAYSMAX + '</div></div>';
		htmlString += '</div>';
		htmlString += '<div id="dischargeSinceSelected" class="filterSelected">';
		htmlString += '<table id="dischargeSinceSelectedTable" class="filterSelectedTable"></table></div>';
		htmlString += '</div></td></tr>';
		return htmlString;
	};

	this.buildRankingFilter = function(){
		var htmlString = "";
		htmlString += "<tr><td id='tabFilters' class='displayed'>";
		htmlString += "<div id='rankingTab' class='filterTitleBar'><span class='filterTitle'>" + i18n.rwl.RANKING + "</span><span class='butRevert' id='revert'>" + i18n.rwl.CLEAR + "</span>";
			htmlString += "<div id='rankingSelect' class='filterSelect'>";
			htmlString += "<div id='divRanking'>";
			htmlString += "<span class='spanRank'>" + i18n.rwl.FROM + "</span><div class='displayInline' id='fromRankContainer' data-rank-value='0'></div>";
			htmlString += "<span class='spanRank'>" + i18n.rwl.TO + "</span><div class='displayInline' id='toRankContainer' data-rank-value='5'></div>";

			htmlString += "</div></div>";
			htmlString += "<div id='rankingSelected' class='filterSelected'>";
					htmlString += "<table id='rankingSelectedTable' class='filterSelectedTable'></table></div>";
		htmlString += "</div>";
		htmlString += "</td></tr>";
		return htmlString;
	};

	this.addSavedLists = function(newLists){
		try {
			var listAr = this.m_savedLists;
			for(var i=0;i<newLists.length;i++){
				listAr.push(newLists[i]);
			}
			this.m_savedLists = alphaSort(listAr,"PATIENT_LIST_NAME");
			this.refreshSavedListDrop();
		}
		catch(err) {
			m_controller.logErrorMessages("",JSON.stringify(err),"addSavedLists");
		}
	};
	this.buildEncounterTypeFilter = function(title, type) {
		var htmlString = '',
			encTitle = title || i18n.rwl.ENCOUNTERTYPE,
			encType = type || 'encounterType';

		htmlString += '<tr><td id="tabFilters" class="displayed">';
			htmlString += '<div id="' + encType + 'Tab" class="filterTitleBar">' +
							'<span class="filterTitle">' + encTitle + '</span>' +
							'<span class="butRevert">' + i18n.rwl.CLEAR + '</span>';
			htmlString += '<div id ="' + encType + 'Select" class="encounterType filterSelect">';
					htmlString += createEncGroupsSection(encType);
					htmlString += createIndividualEncSection();
				htmlString += '</div>';
				htmlString += createEncSummarySection(encType);
			htmlString += '</div>';
		htmlString += '</td></tr>';

		return htmlString;
	};

	this.removeSavedList = function(listID,deleteList){
		var savedAr = this.m_savedLists;
		for(var i=0, savedArLength = savedAr.length; i<savedArLength; i++){
			if(savedAr[i].PATIENT_LIST_ID == listID){
				if(deleteList) {
					savedAr.splice(i,1);
				}
				this.refreshSavedListDrop();
				break;
			}
		}
		if(this.m_selectedPatientListID == listID){
			this.clearArguments();
		}
		if(this.m_defaultPatientListID == listID){
			if(savedAr.length < 1) {
				this.m_defaultPatientListID = -1;
				this.m_selectedPatientListID = 0;
				m_controller.resetPatientData();
			}
		}
	};

	this.setActiveList = function(listID){

		m_controller.createCheckpoint('USR:DWL-SWITCHLIST', 'Start');
		var $filterTab = $('#filterTab'),
			iVal = 0;
		if ($filterTab.hasClass('expandViewShown') === true) {
		   m_controller.expandView(false);
		}

		this.clearAllListCount();
		if(this.m_defaultPatientListID == -1)
		{
			if(this.m_selectedPatientListID == 0)
			{
				$filterTab.addClass('noList').trigger('updateFilterState');
			}
		}
		if(listID > 0)
		{
			for(var i=0, savedListsLength = this.m_savedLists.length ;i<savedListsLength;i++){
				if(this.m_savedLists[i].PATIENT_LIST_ID == listID){
					iVal = i;
					this.m_selectedPatientListID = listID;
					this.updateDefaultPage();
					break;
				}
			}
		}

		this.clearAllListCount();
		var listName = this.m_savedLists[iVal].PATIENT_LIST_NAME;
		$('#filterToolbarListName').text(listName).attr('listID', this.m_savedLists[iVal].PATIENT_LIST_ID);
		$('#filterToolbarListDetails').html(i18n.rwl.DETAILS);
		m_curListSearchArguments = this.findSearchArguments(this.m_savedLists[iVal]);
		this.setAutoRemoveCriteria();
		this.buildFilterSection();
		this.populateFilterValues();
		m_sLastAppliedFilterChecks = '[]'; // assumes filters in new list are blank
		this.attachEventHandlers(this.controller);
		this.showSelectedFilters();
		this.controller.notifyOnChangeActiveList(listID);
		if(listName != '') {
			$('#divDisabledMenu').css('width','0px');
		}
		$('#filterPatientCountDiv').show();
		this.refreshSavedListDrop();
	};
	this.setAutoRemoveCriteria = function() {
		m_filterObj.listAutoRemove = 0;
		for(var i = 0, len = m_curListSearchArguments.length; i < len; i++) {
			if(m_curListSearchArguments[i].ARGUMENT_NAME === 'AUTOREMOVEPATIENTS') {
				m_filterObj.listAutoRemove = m_curListSearchArguments[i].PARENT_ENTITY_ID;
			}
		}
	};
	this.getCurrentListSearchArguments = function() {
		return m_curListSearchArguments;
	};

	this.updateCurrentList = function(listID, newArguments) {
		newArguments = newArguments || [];
		for(var l = 0, length = this.m_savedLists.length; l < length; l++)
		{
			if(listID == this.m_savedLists[l].PATIENT_LIST_ID) {
				this.m_savedLists[l].ARGUMENTS = newArguments;
				break;
			}
		}
		this.setActiveList(listID);
	};

	this.findSearchArguments = function(listObj){
		var searchArgsList = [];

		var listArguments = listObj.ARGUMENTS;
		for(var i=0, argsLen=listArguments.length; i<argsLen; i++){
			var length = (listArguments[i].ARGUMENT_NAME).length;
			var indexOf_ = (listArguments[i].ARGUMENT_NAME).lastIndexOf("_");

			if( indexOf_ > -1){
				var type = (listArguments[i].ARGUMENT_NAME).substring(indexOf_+1, length);
				var argName = (listArguments[i].ARGUMENT_NAME).substring(0, indexOf_);
				var childArgs = [];

				if( type == 'SEARCH'){
					if(argName === 'CONDITION') {
						childArgs = getChildConditionArguments(listArguments[i].PARENT_ENTITY_ID);
					} else if(argName === 'LOCATIONS') {
						childArgs = listArguments[i].CHILD_ARGUMENTS;
					}
					searchArgsList.push({
								ARGUMENT_NAME : argName,
								ARGUMENT_VALUE : listArguments[i].ARGUMENT_VALUE,
								PARENT_ENTITY_ID : listArguments[i].PARENT_ENTITY_ID,
								PARENT_ENTITY_NAME : listArguments[i].PARENT_ENTITY_NAME,
								CHILD_ARGUMENTS: childArgs
					});
				}
			}
		}

		return searchArgsList;
	};
	var getChildConditionArguments = function(parentId) {
		var filters = m_filterValues.FILTER_LIST;
		for(var i = 0, sz = filters.length; i < sz; i++) {
			var filter = filters[i];
			if(filter.ARGUMENT_NAME == "CONDITION") {
				for(var k = 0, kSz = filter.AVAILABLE_VALUES.length; k < kSz; k++) {
					var availableArgument = filter.AVAILABLE_VALUES[k];
					if(availableArgument.PARENT_ENTITY_ID == parentId) {
						return availableArgument.CHILD_VALUES;
					}
				}
			}
		}
		return [];
	};

	this.buildListDetailsSection = function(searchArgsList){
		var sectionAr = this.m_sections;
		var searchArguments = searchArgsList;
		var admissionArray = ["ADMISSIONDAYS", "ADMISSIONWEEKS", "ADMISSIONMONTHS", "ADMISSIONFROM"];
		var dischargeArray = ['DISCHARGEDAYS', 'DISCHARGEWEEKS', 'DISCHARGEMONTHS', 'DISCHARGEFROM'];
		var ageArray = ["AGEGREATER", "AGELESS", "AGEEQUAL", "AGEFROM"];
		var htmlSearchString = "";
		for(var i=0, arrLen=sectionAr.length; i<arrLen; i++){
			for(var k=0, argsLen=searchArguments.length; k<argsLen; k++){
				var argName = searchArguments[k].ARGUMENT_NAME;
				if((sectionAr[i].argument_name == argName ) ||
					(sectionAr[i].argument_name == "ADMISSION" && ( jQuery.inArray(argName,admissionArray) > -1) ) ||
					(sectionAr[i].argument_name === 'DISCHARGE' && ( jQuery.inArray(argName,dischargeArray) > -1) ) ||
					(sectionAr[i].argument_name == "AGE" && ( jQuery.inArray(argName,ageArray) > -1 )) ||
					(argName.indexOf("_GROUP") > -1 && sectionAr[i].type.toLowerCase() == searchArguments[k].ARGUMENT_VALUE.toLowerCase()) ||
					(sectionAr[i].argument_name == "ORDERSTATUS" && argName.indexOf("MED") == 0) ||
					(argName === 'NOAPPT' && searchArguments[k].ARGUMENT_VALUE.toLowerCase() === 'true' && sectionAr[i].argument_name === 'APPTSTATUS') ||
					(argName.indexOf('LOCATION') === 0 && sectionAr[i].argument_name === 'LOCATIONS')
				){
					htmlSearchString += "<tr><td>";
						htmlSearchString += '<div id="' + sectionAr[i].type + 'SearchParamTitle" class="filterTitleBar"><span class="filterTitle">';
						htmlSearchString += (sectionAr[i].type === 'relTypePPR' || sectionAr[i].type === 'relTypeEPR') ? i18n.rwl.RELATIONSHIPTYPE : sectionAr[i].title;
						htmlSearchString += '</span></div>';
						htmlSearchString += "<div id='"+sectionAr[i].type+"SearchParam ' >";
							htmlSearchString += "<table id='"+sectionAr[i].type+"SearchParamDisplayTbl' class='searchDisplayTable'>";
							htmlSearchString += "</table>";
						htmlSearchString += "</div>";
					htmlSearchString += "</td></tr>";
					break;
				}
			}
		}
		$("#plSearchDetailsTable").html(htmlSearchString);
	};

	this.buildFilterSection = function(){
		var sectionAr = this.m_sections,
			filterArguments = m_curListSearchArguments,
			admissionArray = ['ADMISSIONDAYS', 'ADMISSIONWEEKS', 'ADMISSIONMONTHS', 'ADMISSIONFROM'],
			dischargeArray = ['DISCHARGEDAYS', 'DISCHARGEWEEKS', 'DISCHARGEMONTHS', 'DISCHARGEFROM'],
			ageArray = ['AGEGREATER', 'AGELESS', 'AGEEQUAL', 'AGEFROM'],
			asFiltersToIgnore = ['LOCATIONS'],
			matchFound,
			htmlFilterString = '',
			customizeFiltersLength = bedrock_prefs.CUSTOMIZE_FILTERS.length,
			curSection = '';
		for(var i=0, arrLen=sectionAr.length; i<arrLen; i++) {
			matchFound = false;
			curSection = (sectionAr[i].type.indexOf('result') === 0) ? sectionAr[i].type.toUpperCase() : sectionAr[i].argument_name;
			if ($.inArray(curSection, asFiltersToIgnore) > -1) {
				continue;
			}
			if(sectionAr[i].title && (customizeFiltersLength === 0 || $.inArray(curSection, m_filterObj.controller.availableFilters) > -1)) {
				for(var k=0, argsLen=filterArguments.length; k<argsLen; k++) {
					var argName = filterArguments[k].ARGUMENT_NAME;
					if((curSection === argName ) ||
						(curSection === 'ADMISSION' && ( $.inArray(argName,admissionArray) > -1) ) ||
						(curSection === 'DISCHARGE' && ( $.inArray(argName,dischargeArray) > -1) ) ||
						(curSection === 'AGE' && ( $.inArray(argName,ageArray) > -1 )) ||
						(argName.indexOf('_GROUP') > -1 && sectionAr[i].type.toLowerCase() === filterArguments[k].ARGUMENT_VALUE.toLowerCase()) ||
						(curSection === 'ORDERSTATUS' && argName.indexOf('MED') === 0) ||
						(argName === 'NOAPPT' && filterArguments[k].ARGUMENT_VALUE.toLowerCase() === 'true' && sectionAr[i].argument_name === 'APPTSTATUS')
					){
							matchFound = true;
							break;
						}
				} // end of k for loop
				if(matchFound === false) {
					m_filtersToShow.push({
						title: sectionAr[i].title,
						argument_name: sectionAr[i].argument_name,
						parent_entity_name: sectionAr[i].parent_entity_name,
						type: sectionAr[i].type
					});

					if(sectionAr[i].parent_entity_name === "PARAMETER"){
						continue;
					}
					if(curSection.indexOf('RESULTFILTER') === 0) { // If the current section is a results filter.
						curSection = curSection.replace(/[0-9]/g, ''); // Strip the trailing index for comparison below.
					}
					switch(curSection) {
						case 'ADMISSION':
							htmlFilterString += this.buildAdmissionSinceFilter();
							break;
						case 'AGE':
							htmlFilterString += this.buildAgeFilter();
							break;
						case 'APPTSTATUS':
							htmlFilterString += this.buildAppointmentsFilter(sectionAr[i].title);
							break;
						case 'DISCHARGE':
							htmlFilterString += this.buildDischargeRangeFilter();
							break;
						case 'ENCOUNTERTYPE':
							htmlFilterString += this.buildEncounterTypeFilter(sectionAr[i].title, sectionAr[i].type);
							break;
						case 'EXPECTATIONS':
							htmlFilterString += this.buildExpectationsFilter();
							break;
						case 'ORDERSSTATUS':
							htmlFilterString += this.buildOrdersFilter(sectionAr[i].title);
							break;
						case 'ORDERSTATUS':
							htmlFilterString += this.buildMedsFilter();
							break;
						case 'QUALIFYING':
							htmlFilterString += this.buildQualifyingFilter();
							break;
						case 'RANKING':
							htmlFilterString += this.buildRankingFilter();
							break;
						case 'RESULTFILTER':
							htmlFilterString += this.buildResultsFilter(sectionAr[i].title, sectionAr[i].type, sectionAr[i].value_query);
							break;
						default:
							htmlFilterString += "<tr><td id='tabFilters' class='displayed'>";
								htmlFilterString += "<div id='"+sectionAr[i].type+"Tab' class='filterTitleBar'><span class='filterTitle'>"+sectionAr[i].title+"</span><span class='butRevert'>" + i18n.rwl.CLEAR + "</span>";
									htmlFilterString += "<div id='"+sectionAr[i].type+"Select' class='filterSelect'>";
									if(sectionAr[i].type == "condition")
									{
										htmlFilterString += "<div id='" + sectionAr[i].type + "Operator'>";
										htmlFilterString += "<label><input type ='radio' name='" + sectionAr[i].type + "OperatorType' value='or' id='" + sectionAr[i].type + "Or' checked='checked' class = '" + sectionAr[i].type + "Radio'>" + i18n.rwl.OR + "</label> &nbsp;&nbsp;";
										htmlFilterString += "<label><input type ='radio' name='" + sectionAr[i].type + "OperatorType' value='and' id='" + sectionAr[i].type + "And' class = '" + sectionAr[i].type + "Radio'>" + i18n.rwl.AND + " </label><br/>";
										htmlFilterString += "</div>";
									}
									htmlFilterString += "<table id='"+sectionAr[i].type+"Table' class='selectTable'>";
										htmlFilterString += "<tr><td></td></tr>";
									htmlFilterString += "</table>";
									if(sectionAr[i].type == "caseManager") {
										htmlFilterString += "<div id='caseManagerFilter'></div>";
									}
									htmlFilterString += "</div>";
									htmlFilterString += "<div id='"+sectionAr[i].type+"Selected' class='filterSelected'>";
										htmlFilterString += "<table id='"+sectionAr[i].type+"SelectedTable' class='filterSelectedTable'></table>";
								htmlFilterString += "</div></div>";
							htmlFilterString += "</td></tr>";
					}
				}
			}
		}
		if(htmlFilterString === '') {
			htmlFilterString = '<tr><td class="centerContent noFilterPadTop">' + i18n.rwl.NOFILTERSAVAILABLE + '</td></tr>';
		}
		$("#filterTable").html(htmlFilterString);
		$("#filterButClearAll").attr("disabled", "disabled");
		$("#filterButApply").attr("disabled", "disabled");
		$("#filterTab.noList").removeClass("noList").trigger("updateFilterState");
		$("#fromRankContainer").replaceWith(function(){
			var fromRankValue = $(this).data('rank-value');
			return m_controller.createRankControl(fromRankValue,0,m_filterObj.onFilterModification).addClass("from");
		});
		$("#toRankContainer").replaceWith(function(){
			var toRankValue = $(this).data('rank-value');
			return m_controller.createRankControl(toRankValue,0,m_filterObj.onFilterModification).addClass("to");
		});
		$("#caseManagerFilter")
			.empty()
			.append(m_controller.createSearchControl())
			.on("prsnlSelected",null,function(event,dPrsnlId,sName){
				var $table = $("#caseManagerTable");
				if($table.data(dPrsnlId)){
					return;
				}

				var html = "<tr><td><label><input class='cvFilterInput hidden-checkbox' name='" + encodeURI(sName) + "' value='" + dPrsnlId +
							"' type='checkbox' checked='true' /><span>" + sName + "</span></label></td></tr>";

				var idx = -1;
				$table.data(dPrsnlId,sName)
					.find("label").each(function(index){
						if($(this).text().localeCompare(encodeURI(sName))>0){
							idx = index;
							return false;
						}
					});
				(idx>=0) ? $table.find("tr").eq(idx).before(html) : $table.append(html);
			});
	};
	function buildEncounterTypeDetails(encounterTypes, isIndividualEncntr) {
		if(encounterTypes && encounterTypes.length > 0) {
			var $encntrTypeTable = $('#encounterTypeSearchParamDisplayTbl'),
				title = isIndividualEncntr ? i18n.rwl.INDIVIDUALENCOUNTERSHEADER : i18n.rwl.GROUPENCOUNTERSHEADER;

			$encntrTypeTable.append('<tr><td><span class="encntrDetailHeader">' + title + '</span></td></tr>');

			for(var count = 0, eLength = encounterTypes.length; count < eLength; count++) {
				$encntrTypeTable.append('<tr><td><span>' + encounterTypes[count].ARGUMENT_VALUE + '</span></td></tr>');
			}
		}
	}
	function sortedEncounterGroups(groups) {
		var groups = groups || [];

		if (groups.length > 1) {
			var switched = true,
				tempGroup = '';

			while (switched) {
				switched = false;
				for (var count = 0, gLength = groups.length; count < gLength - 1; count++) {
					if (groups[count].PARENT_ENTITY_ID > groups[count + 1].PARENT_ENTITY_ID) {
						tempGroup = groups[count + 1];
						groups[count + 1] = groups[count];
						groups[count] = tempGroup;

						switched = true;
					}
				}
			}
		}
		return groups;
	}

	this.showSearchParameters = function(searchArgsList, verOffset){
		function buildLocationTypeDetails(rangeVal, rangeUnit, locations) {
			function loadLocations() {
				var locObjs = [];
				for(var i=0, iLen=locations.length; i<iLen; i++) {
					locObjs.push({location_cd: locations[i]});
				}
				var loc_request = {
					'loc_request': {
						'locations': locObjs,
						'skip_org_security_ind': 1,
						'skip_fill_reply_ind':   0
					}
				};
				m_controller.makeCall('mp_dcp_get_loc_prnt_hierarchy', loc_request, false, function(reply) {
					var facility = null;
					var building = null;
					for(var i=0, iLen=reply.FACILITIES.length; i<iLen; i++) {
						facility = reply.FACILITIES[i];
						m_controller.getChildLocations(facility.FACILITY_CD);
						for(var j=0, jLen=facility.BUILDINGS.length; j<jLen; j++) {
							building = facility.BUILDINGS[j];
							m_controller.getChildLocations(facility.FACILITY_CD, building.BUILDING_CD);
						}
					}
				});
			}

			if((typeof rangeUnit !== 'string' || rangeUnit.length <= 0) || rangeVal < 0 || $.isArray(locations) === false) {
				$('#locationSearchParamTitle').closest('tr').remove();
				return;
			}
			var $locSection = $('#locationSearchParamDisplayTbl'),
				displayText = i18n.rwl.PASTTEXT.replace('{32}', rangeVal)
											   .replace('{33}', rangeUnit),
				hierarchies = [],
				tempHierarchy = null,
				$hierarchy = null;
			for(var i=0, len=locations.length; i<len; i++) {
				tempHierarchy = m_controller.getLocationHeirarchy(locations[i]);
				if(tempHierarchy === null) {
					loadLocations();
					tempHierarchy = m_controller.getLocationHeirarchy(locations[i]);
				}
				if(typeof tempHierarchy === 'object' && tempHierarchy !== null) {
					hierarchies.push(tempHierarchy);
				}
			}
			$hierarchy = m_controller.buildLocationHierarchy(hierarchies);
			$locSection
				.append('<tr><td><span>' + displayText + '</span></td></tr>')
				.append('<tr><td>' + $hierarchy.html() + '</td></tr>');
		}

		var searchArguments = $.extend(true, [], searchArgsList);
		var sectionArray = this.m_sections;
		var locationRangeVal  = -1;
		var locationRangeUnit = '';
		var locations         = [];
		var autoRemove = 0;
		var ageFrom = "";
		var ageTo = "";
		var age = "";
		var ageTime = "";
		var apptFrom = "";
		var apptTo = "";
		var apptDateUnit = "";
		var apptStatuses = "";
		var noAppt = false;
		var orderFrom = "";
		var orderTo = "";
		var orderDateUnit = "";
		var orderStatuses = [];
		var orderTypes = [];
		var expectations = [];
		var recommstatus = [];
		var encounterTypes = [];
		var sortGroupsObj = [];
		var encounterGroups = [];
		var individualEncounters = [];
		var offset = 60 + verOffset; //account for the fact that the tooltip isn't actually displayed at the very top of the page
		var clientHeight = document.documentElement.clientHeight - offset;
		clientHeight = clientHeight - (clientHeight%5); //to get rid of the cases of having a partial line of text show
		var tooltipHeight = clientHeight + 20; //Add 20 so that the extra line of text will fit
		$('#divPLSearchContent').css('max-height', clientHeight);
		$('#divPLSearchDetails').css('max-height', tooltipHeight);
		for(var j = 0, len = searchArguments.length; j < len; j++) {
			if(searchArguments[j].ARGUMENT_NAME == 'ACMPRSNLGROUPS') {
				sortGroupsObj.push({name: searchArguments[j].ARGUMENT_NAME, value: searchArguments[j].ARGUMENT_VALUE});
			}
		}
		sortGroupsObj = alphaSort(sortGroupsObj,'value');

		for(var i=0, argsLen=searchArguments.length; i<argsLen; i++){
			switch(searchArguments[i].ARGUMENT_NAME)
			{
				case 'LOCATIONDAYS':
					locationRangeUnit = i18n.rwl.DAYSL;
					locationRangeVal = searchArguments[i].ARGUMENT_VALUE;
					break;
				case 'LOCATIONWEEKS':
					locationRangeUnit = i18n.rwl.WEEKSL;
					locationRangeVal = searchArguments[i].ARGUMENT_VALUE;
					break;
				case 'LOCATIONMONTHS':
					locationRangeUnit = i18n.rwl.MONTHSL;
					locationRangeVal = searchArguments[i].ARGUMENT_VALUE;
					break;
				case 'LOCATIONUNITS':
					locations.push(searchArguments[i].PARENT_ENTITY_ID);
					break;
				case 'AUTOREMOVEPATIENTS':
					autoRemove = searchArguments[i].PARENT_ENTITY_ID;
					break;
				case "EXPECTATIONS":
					expectations.push(searchArguments[i].ARGUMENT_VALUE);
					break;
				case "RECOMMSTATUS":
					var recommStatusDisplayValue;
					switch(searchArguments[i].ARGUMENT_VALUE){
						case 'Due':
							recommStatusDisplayValue = i18n.rwl.DUE;
							break;
						case 'Near Due':
							recommStatusDisplayValue = i18n.rwl.NEAR_DUE;
							break;
						case 'Not Due':
							recommStatusDisplayValue = i18n.rwl.NOT_DUE;
							break;
						case 'Overdue':
							recommStatusDisplayValue = i18n.rwl.OVERDUE;
							break;
						default:
							recommStatusDisplayValue = searchArguments[i].ARGUMENT_VALUE;
							break;
					}
					recommstatus.push(recommStatusDisplayValue.toLowerCase());
					break;
				case "ORDERFROM":
					orderFrom = searchArguments[i].ARGUMENT_VALUE;
					break;
				case "ORDERTO":
					orderTo = searchArguments[i].ARGUMENT_VALUE;
					break;
				case "ORDERDATEUNIT":
					switch(searchArguments[i].ARGUMENT_VALUE) {
						case "D":
							orderDateUnit = i18n.rwl.DAYSL;
							break;
						case "W":
							orderDateUnit = i18n.rwl.WEEKSL;
							break;
						case "M":
							orderDateUnit = i18n.rwl.MONTHSL;
							break;
					}
					break;
				case "ORDERSSTATUS":
					orderStatuses.push(searchArguments[i].ARGUMENT_VALUE);
					break;
				case "ORDERTYPE":
					orderTypes.push(searchArguments[i].ARGUMENT_VALUE);
					break;
				case "APPTFROM":
					apptFrom = searchArguments[i].ARGUMENT_VALUE;
					break;
				case "APPTTO":
					apptTo = searchArguments[i].ARGUMENT_VALUE;
					break;
				case "APPTSTATUS":
					apptStatuses += searchArguments[i].ARGUMENT_VALUE + ", ";
					break;
				case "APPTDATEUNIT":
					switch(searchArguments[i].ARGUMENT_VALUE) {
						case "D":
							apptDateUnit = i18n.rwl.DAYSL;
							break;
						case "W":
							apptDateUnit = i18n.rwl.WEEKSL;
							break;
						case "M":
							apptDateUnit = i18n.rwl.MONTHSL;
							break;
					}
					break;
				case "NOAPPT":
					noAppt = searchArguments[i].ARGUMENT_VALUE.toLowerCase() === 'true';
					break;
				case "ADMISSIONDAYS":
					var admissionDays = i18n.rwl.ADMITDISCHARGEDAYS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$("#admissionSinceSearchParamDisplayTbl").append("<tr><td><span>" + admissionDays + "</span></td></tr>");
					break;
				case "ADMISSIONWEEKS":
					var admissionWeeks = i18n.rwl.ADMITDISCHARGEWEEKS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$("#admissionSinceSearchParamDisplayTbl").append("<tr><td><span>" + admissionWeeks + "</span></td></tr>");
					break;
				case "ADMISSIONMONTHS":
					var admissionMonths = i18n.rwl.ADMITDISCHARGEMONTHS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$("#admissionSinceSearchParamDisplayTbl").append("<tr><td><span>" + admissionMonths + "</span></td></tr>");
					break;
				case 'DISCHARGEDAYS':
					var dischargeDays = i18n.rwl.ADMITDISCHARGEDAYS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$('#dischargeSinceSearchParamDisplayTbl').append('<tr><td><span>' + dischargeDays + '</span></td></tr>');
					break;
				case 'DISCHARGEWEEKS':
					var dischargeWeeks = i18n.rwl.ADMITDISCHARGEWEEKS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$('#dischargeSinceSearchParamDisplayTbl').append('<tr><td><span>' + dischargeWeeks + '</span></td></tr>');
					break;
				case 'DISCHARGEMONTHS':
					var dischargeMonths = i18n.rwl.ADMITDISCHARGEMONTHS.replace('{2}',searchArguments[i].ARGUMENT_VALUE);
					$('#dischargeSinceSearchParamDisplayTbl').append('<tr><td><span>' + dischargeMonths + '</span></td></tr>');
					break;
				case "AGEDAYS":
					ageTime = i18n.rwl.DAYSL;
					break;
				case "AGEWEEKS":
					ageTime = i18n.rwl.WEEKSL;
					break;
				case "AGEMONTHS":
					ageTime = i18n.rwl.MONTHSL;
					break;
				case "AGEYEARS":
					ageTime = i18n.rwl.YEARSL;
					break;
				case 'AGEGREATER':
					age = i18n.rwl.AGEGREATER.replace("{2}",searchArguments[i].ARGUMENT_VALUE);
					break;
				case "AGELESS":
					age = i18n.rwl.AGELESS.replace("{2}",searchArguments[i].ARGUMENT_VALUE);
					break;
				case 'AGEEQUAL':
					age = i18n.rwl.AGEEQUAL.replace("{2}", searchArguments[i].ARGUMENT_VALUE);
					break;
				case 'AGEFROM':
					ageFrom = searchArguments[i].ARGUMENT_VALUE;
					break;
				case 'AGETO':
					ageTo = searchArguments[i].ARGUMENT_VALUE;
					break;
				case 'ENCOUNTERTYPE':
					if(searchArguments[i].PARENT_ENTITY_NAME === 'INDIVIDUALENCOUNTER') {
						individualEncounters.push(searchArguments[i]);
					} else {
						encounterGroups.push(searchArguments[i]);
					}
					break;
			}

			if(ageFrom.length > 0 && ageTo.length > 0) {
				age = i18n.rwl.AGERANGE.replace("{3}",ageFrom);
				age = age.replace("{4}",ageTo);
				ageFrom = "";
				ageTo = "";
			}
			if(searchArguments[i].ARGUMENT_NAME.indexOf("_GROUP") > -1)
			{
				var type = searchArguments[i].ARGUMENT_VALUE.substring(searchArguments[i].ARGUMENT_VALUE.length-1);
				var index = searchArguments[i].ARGUMENT_NAME.indexOf("_");
				var resultArg = searchArguments[i].ARGUMENT_NAME.substring(0, index);
				var resultCount;
                if (resultArg.substring(6,resultArg.length)<10) {
				resultCount = this.getResultCount(resultArg.substring(resultArg.length - 1), type);
			    }
			    else {
			    	resultCount = this.getResultCount(resultArg.substring(resultArg.length - 2), type);
			    }
				var resulthtml = createResultString(searchArguments, resultArg, resultCount, type, "display");
				$("#resultFilter" + type + "SearchParamDisplayTbl").append("<tr><td><span>" + resulthtml + "</span></td></tr>");
			}
			if(searchArguments[i].ARGUMENT_NAME.indexOf("DRUGNAME") > -1 || searchArguments[i].ARGUMENT_NAME.indexOf("DRUGCLASSID") > -1)
			{
				var medindex = searchArguments[i].ARGUMENT_NAME.indexOf("_");
				var medArg = searchArguments[i].ARGUMENT_NAME.substring(0, medindex);
				var medcount = medArg.substring(medArg.length-1) - 1;
				var medhtml = "<div class='" + createMedString(searchArguments, medArg, "display", medcount);
				$("#medicationsSearchParamDisplayTbl").append("<tr><td><span>" + medhtml + "</span></td></tr>");
			}

			for(var k=0; k<sectionArray.length; k++){
				if( sectionArray[k].argument_name == searchArguments[i].ARGUMENT_NAME &&
					searchArguments[i].ARGUMENT_NAME != "ACMPRSNLGROUPS" &&
					searchArguments[i].ARGUMENT_NAME != "ORDERSSTATUS" &&
					searchArguments[i].ARGUMENT_NAME != "APPTSTATUS" &&
					searchArguments[i].ARGUMENT_NAME != "EXPECTATIONS" &&
					searchArguments[i].ARGUMENT_NAME != 'ENCOUNTERTYPE' &&
					searchArguments[i].ARGUMENT_NAME !== 'LOCATIONUNITS' &&
					searchArguments[i].ARGUMENT_NAME !== 'LOCATIONDAYS' &&
					searchArguments[i].ARGUMENT_NAME !== 'LOCATIONWEEKS' &&
					searchArguments[i].ARGUMENT_NAME !== 'LOCATIONMONTHS'){

					var $relSection = $('#' + sectionArray[k].type + 'SearchParamDisplayTbl');

					if (sectionArray[k].type === 'relTypePPR' || sectionArray[k].type === 'relTypeEPR') {
						if ($relSection.find('.ditheredText').length < 1) {
							$relSection
								.append('<tr><td><span class="boldText ditheredText">' + sectionArray[k].title + i18n.rwl.COLON + '</span></td></tr>');
						}
					}
					$relSection.append('<tr><td><span>' + escapeHtmlString(searchArguments[i].ARGUMENT_VALUE) + '</span></td></tr>');
				}
			}
		}

		buildLocationTypeDetails(locationRangeVal, locationRangeUnit, locations);

		if(sortGroupsObj.length){
			var grpHtml = "";
			for(var gp=0; gp < sortGroupsObj.length; gp++){
				grpHtml += "<tr><td><span>" + sortGroupsObj[gp].value + "</span></td></tr>";
			}
			$("#provGrpSearchParamDisplayTbl").append(grpHtml);
		}
		if(autoRemove > 0) {
			$('#autoRemoveSearchParamDisplayTbl').append('<tr><td><span>' + i18n.rwl.YES + '</span></td></tr>');
		} else {
			$('#autoRemoveSearchParamTitle').remove();
		}
		if(age.length > 0 && ageTime.length > 0) {
			$("#ageSearchParamDisplayTbl").append("<tr><td><span>" + age.replace("{36}", ageTime) + "</span></td></tr>");
		}
		if(expectations.length > 0 && recommstatus.length > 0) {
			var summaryText= m_controller.setSummaryContent(expectations,recommstatus);
			$("#expectationSearchParamDisplayTbl").append("<tr><td><label>" + summaryText + "</label></td></tr>");
		}
		if(orderFrom.length > 0 && orderTo.length > 0 && orderStatuses.length > 0 && orderTypes.length > 0 && orderDateUnit.length > 0) {
			var orderStatusString = "";
			for(var os = 0, oslen = orderStatuses.length; os < oslen; os++) {
				orderStatusString += orderStatuses[os] + ", ";
			}
			var orderStatusIndex = orderStatusString.lastIndexOf(",");
			orderStatusString = orderStatusString.substring(0, orderStatusIndex);
			var orderTypeString = "";
			for(var ot = 0, otlen = orderTypes.length; ot < otlen; ot++) {
				orderTypeString += orderTypes[ot] + ", ";
			}
			var orderTypeIndex = orderTypeString.lastIndexOf(",");
			orderTypeString = orderTypeString.substring(0, orderTypeIndex);

			var orderStatsString = i18n.rwl.ORDERSTATUSSTR.replace("{7}",orderStatusString);
			orderStatsString = orderStatsString.replace("{8}",orderTypeString);
			orderStatsString = orderStatsString.replace("{9}",orderFrom);
			orderStatsString = orderStatsString.replace("{10}",orderDateUnit);
			orderStatsString = orderStatsString.replace("{11}",orderTo);
			orderStatsString = orderStatsString.replace("{12}",orderDateUnit);

			$("#orderSearchParamDisplayTbl").append("<tr><td><label>" + orderStatsString + "</label></td></tr>");

			orderFrom = "";
			orderTo = "";
		}
		if(apptFrom.length > 0 && apptTo.length > 0 && (apptStatuses.length > 0 || noAppt === true) && apptDateUnit.length > 0) {
			var apptIndex = apptStatuses.lastIndexOf(",");
			apptStatuses = apptStatuses.substring(0, apptIndex);
			var statusString = (noAppt === true) ? i18n.rwl.NOAPPTSTR : i18n.rwl.APPTSTATUSSTR.replace("{13}", apptStatuses);
			statusString = statusString.replace("{14}",apptFrom);
			statusString = statusString.replace("{15}",apptDateUnit);
			statusString = statusString.replace("{16}",apptTo);
			statusString = statusString.replace("{17}",apptDateUnit);
			$("#appointmentSearchParamDisplayTbl").prepend("<tr><td><label>" + statusString + "</label></td></tr>");
			apptFrom = "";
			apptTo = "";
		}
		buildEncounterTypeDetails(sortedEncounterGroups(encounterGroups), false);
		buildEncounterTypeDetails(individualEncounters, true);

		tooltipHeight = $("#divPLSearchDetails").height();
		if(tooltipHeight >= clientHeight) {
			$("#divPLSearchMore").show();
		}
		else {
			$("#divPLSearchMore").hide();
		}
	};
	function createMedString(allArguments, medArgument, spanId, count) {
		var type = "";
		var drug = "<span id='" + spanId + "MedInput" + count + "'";
		var statuses = "";
		var timeoption = "<span id='" + spanId + "MedBackTimeOption" + count + "'>";
		var timeinput = "<span id='" + spanId + "MedBackTimeInput" + count + "'>";
		for(var m = 0, arglen = allArguments.length; m < arglen; m++) {
			var value = allArguments[m].ARGUMENT_VALUE;
			var name = allArguments[m].ARGUMENT_NAME;
			if(name == medArgument + "_DRUGNAME") {
				type = "drugname";
				drug += " value='0'>" + value + "</span>";
			}
			else if(name == medArgument + "_DRUGCLASSID") {
				type = "drugclass";
				drug += " value='" + allArguments[m].PARENT_ENTITY_ID + "'>" + value + "</span>";
			}
			else if(name == medArgument + "_STATUS") {
				if(statuses.length > 0) {
					statuses += ", ";
				}
				statuses += "<span class='" + spanId + "MedStatus' meaning='" + value + "'>";
				statuses += value.toLowerCase();
				statuses += "</span>";
			}
			else if(name == medArgument + "_BACKDAYS") {
				timeinput += value + "</span>";
				timeoption += i18n.rwl.MEDSTRDAYS + "</span>";
			}
			else if(name == medArgument + "_BACKWEEKS") {
				timeinput += value + "</span>";
				timeoption += i18n.rwl.MEDSTRWEEKS + "</span>";
			}
			else if(name == medArgument + "_BACKMONTHS") {
				timeinput += value + "</span>";
				timeoption += i18n.rwl.MEDSTRMONTHS + "</span>";
			}
		}
		var returnString = i18n.rwl.MEDSTR.replace("{18}",drug);
			returnString = returnString.replace("{19}",statuses);
			returnString = returnString.replace("{20}",timeinput);
			returnString = returnString.replace("{21}",timeoption);

		return ' ' + type +'">' + returnString + '</div>';
	}
	function createResultString(allArguments, resultArg, resultCount, type, spanId)
	{
		var result = "<span id ='" + spanId + "Eventset" + resultCount + type + "'";
		var count = "<span id='" + spanId + "CountInput" + resultCount + type + "'>";
		var countOption = "<span id ='" + spanId + "CountOption" + resultCount + type + "'>";
		var val1 = "<span id='" + spanId + "ValInput1" + resultCount + type + "'>";
		var val2 = "<span id='" + spanId + "ValInput2" + resultCount + type + "'>";
		var valOption = "<span id ='" + spanId + "ValOption" + resultCount + type + "'>";
		var fromFlag = false;
		var toFlag = false;
		var ofAnyValue = true;
		var timeOption = "<span id='" + spanId + "BackTimeOption" + resultCount + type + "'>";
		var time = "<span id='" + spanId + "BackTimeInput" + resultCount + type + "'>";
		var eventSetGroupFound = false;
		for(var r = 0, length = allArguments.length; r < length; r++)
		{
			var name = allArguments[r].ARGUMENT_NAME;
			var value = allArguments[r].ARGUMENT_VALUE;
			var parentEntityName = allArguments[r].PARENT_ENTITY_NAME;
			if (name == resultArg + "_EVENTSET") {
				if (parentEntityName.indexOf(i18n.rwl.GROUP) > -1 && eventSetGroupFound) { //It checks if it is a group
					continue; //we want to skip all other event sets in that group.
				}
				if (parentEntityName.indexOf(i18n.rwl.GROUP) > -1) {
                    result += " eventName='" + value + "' class='selectedGroup'>" + parentEntityName + "</span>";
                    eventSetGroupFound = true;       //we want to skip from the second event set in a group.
           		}
               else {
               	    result += " eventName='" + value + "'>" + parentEntityName + "</span>";
                }
			}
			else if(name == resultArg + "_COUNTATLEAST") {
				count += value + "</span>";
				countOption += i18n.rwl.ATLEAST + "</span>";
			}
			else if(name == resultArg + "_COUNTLESS") {
				count += value + "</span>";
				countOption += i18n.rwl.LESSTHAN + "</span>";
			}
			else if(name == resultArg + "_VALLESS") {
				val1 += " " + value + " </span>";
				valOption += i18n.rwl.LESSTHANL + val1 + "</span>";
				ofAnyValue = false;
			}
			else if(name == resultArg + "_VALGREATER") {
				val1 += " " + value + " </span>";
				valOption += i18n.rwl.GREATERTHANL + val1 + "</span>";
				ofAnyValue = false;
			}
			else if(name == resultArg + "_VALFROM") {
				val1 += value + "</span>";
				fromFlag = true;
				ofAnyValue = false;
			}
			else if(name == resultArg + "_VALTO") {
				val2 += value + "</span>";
				toFlag = true;
				ofAnyValue = false;
			}
			else if(name == resultArg + "_VALEQUAL") {
				val1 += " " + value + " </span>";
				valOption += i18n.rwl.EQUALl + val1 + "</span>";
				ofAnyValue = false;
			}
			else if(name == resultArg + "_BACKDAYS") {
				time += value + "</span>";
				timeOption += i18n.rwl.DAYSL + "</span>";
			}
			else if(name == resultArg + "_BACKWEEKS") {
				time += value + "</span>";
				timeOption += i18n.rwl.WEEKSL + "</span>";
			}
			else if(name == resultArg + "_BACKMONTHS") {
				time += value + "</span>";
				timeOption += i18n.rwl.MONTHSL + "</span>";
			}
		}
		var resultString = "<div>";
		resultString += countOption + " " + count + " " + result;

		if(fromFlag && toFlag) {
			valOption += i18n.rwl.BETWEENL + "</span>";
			resultString += " " + valOption.replace(".", i18n.rwl_lc.decimal_point) + " " + val1 + " " + i18n.rwl.ANDL + " " + val2;
		}
		else if(fromFlag) {
			valOption += i18n.rwl.GREATERTHANEQL + "</span>";
			resultString += " " + valOption.replace(".", i18n.rwl_lc.decimal_point) + " " + val1;
		}
		else if(toFlag) {
			val1 = val2.replace("rwValueInput2", "rwValueInput1");
			valOption += i18n.rwl.LESSTHANEQL + "</span>";
			resultString += " " + valOption.replace(".", i18n.rwl_lc.decimal_point) + " " + val1;
		}
		else if(ofAnyValue)
		{
			valOption +=  i18n.rwl.OFANYVALUE + "</span>";
			resultString += " " + valOption;
		}
		else {
			resultString += " " + valOption.replace(".", i18n.rwl_lc.decimal_point);
		}
		resultString += " " + i18n.rwl.INTHELAST + " " + time + " " + timeOption;
		return resultString + "</div>";
	}

	this.getInaccessibleList = function() {
		return this.inaccessibleList;
	};

	this.setInaccessibleList = function(listID) {
		this.inaccessibleList = listID;
		this.m_inaccessibleListArr.push(listID);
	};

	this.setPatientListID = function() {
		this.m_selectedPatientListID = 0;
	};

	this.getActiveList = function(){
		var savedLists = this.m_savedLists;
		if(savedLists.length == 0) {
			this.setPatientListID();
		}
		if(this.m_selectedPatientListID > 0){
			for(var i=0;i<savedLists.length;i++){
				if(savedLists[i].PATIENT_LIST_ID == this.m_selectedPatientListID){
					return savedLists[i];
				}
			}
		}
		else{
			return [];
		}
	};
	this.clearAllListCount = function()
	{
			$("#patCountBold").html("");
			$("#patientCountText2").html(i18n.rwl.TOTALPATIENTS);
			$("#removableCountBold2").html("");
			$("#removableCountText1").html("");
			$("#removableCountText2").html(i18n.rwl.REMOVABLEPATIENTTEXT);
	};
	this.showWorklistCount = function(wkListCount, originalCount, searchType){
		if(searchType == 1){
			$("#patCountBold").html(wkListCount + " ");
			$("#patientCountText2").html(i18n.rwl.TOTALPATIENTS);
		}
		if(searchType == 2){
			$("#patCountBold").html(wkListCount + " ");
			var patientCountText = i18n.rwl.WKLPATIENTCOUNTETEXT.replace("{22}",originalCount);
			$("#patientCountText2").html(patientCountText);
		}

		if(wkListCount > 0 && this.controller.fnIsGenCommMessageBannerDisplayed() === false &&
				m_filterObj.getActiveList().OWNER_ID === m_controller.criterion.CRITERION.PRSNL_ID) {
			this.controller.enableGenCommButton(true);
		} else {
			this.controller.enableGenCommButton(false);
		}
	};
	this.showRemovableCount = function(wkListRemovableCount, originalRemovableCount, searchType){
		if (originalRemovableCount > 0){
			if(searchType == 1){
				$("#removableCountText1").html("");
				$("#removableCountBold2").html(originalRemovableCount + " ");
				$("#removableCountText2").html(i18n.rwl.REMOVABLEPATIENTTEXT);
			}
			else if(searchType == 2){
				$("#removableCountText1").html(i18n.rwl.VIEWING + " ");
				$("#removableCountBold2").html(wkListRemovableCount + " ");
				var removableText = i18n.rwl.NOLONGERMEET.replace("{39}",originalRemovableCount);
				$("#removableCountText2").html(removableText);
			}
			$('#displayRemovableCountDiv').show().find('.removableImage').show();
			$("#filterPatientCountDiv").add("#filterScrollDiv").addClass("withRemovable");
		}
		else{
			$("#displayRemovableCountDiv").hide();
			$("#filterPatientCountDiv").add("#filterScrollDiv").removeClass("withRemovable");
		}
	};

	this.clearArguments = function(){
		$("input").each(function(){
			$(this)[0].checked = false;
		});
		$('#FilterTypeCombo').val(0);
		this.createAgeField("0");
		$('#admissionSinceFilterCombo').val(0);
		this.createAdmissionField("0");
		$('#dischargeSinceFilterCombo').val(0);
		this.createDischargeField();
		$("#divRanking div.rankContainer.from").trigger("setRank",0);
		$("#divRanking div.rankContainer.to").trigger("setRank",5);
		this.showSelectedFilters();
		$("#filterPatientCountDiv").hide().removeClass("withRemovable");
		$("#displayRemovableCountDiv").hide();
		$("#filterScrollDiv").removeClass("withRemovable");
		$("#divDisabledMenu").css("width","340px");
		this.controller.clearPatientList();
	};

	this.setModifiedFlag = function(bModified){
		var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
		if(bModified){
			fwObj.SetPendingData(1);
		}
		else{
			fwObj.SetPendingData(0);
		}
	};

	this.isPatientListModified = function(patientListId){
		for(var i=0;i<this.m_modifiedList.length;i++) {
			if(this.m_modifiedList[i].PATIENT_LIST_ID==patientListId) {
				return true;
			}
		}
		return false;
	};
	this.updateModificationBuffer = function(type){
		switch(type) {
			case 0:
				var modifiedElementIndex = -1;
				for(var i=0;i<this.m_modifiedList.length;i++) {
					if(this.m_modifiedList[i].PATIENT_LIST_ID==this.m_selectedPatientListID) {
						modifiedElementIndex = i;
						break;
					}
				}
				if(modifiedElementIndex > -1) {
					this.m_modifiedList.splice(modifiedElementIndex,1);
					this.refreshSavedListDrop();
				}
				break;
			case 1:
				for(var j=0;j<this.m_modifiedList.length;j++) {
					if(this.m_modifiedList[j].PATIENT_LIST_ID==this.m_selectedPatientListID) {
						return;
					}
				}
				this.refreshSavedListDrop();
				break;
			case 2:
				break;
		}
	};
	this.fnGetProviderIdsInProviderGroups = function() {
		var aoFilters = m_filterValues.FILTER_LIST || [];
		return $.map(aoFilters, function(oFilter) {
			if (oFilter.ARGUMENT_NAME !== 'ACMPRSNLGROUPS') {
				return;
			}
			return $.map(oFilter.AVAILABLE_VALUES, function(oAvailableValue) {
				return $.map(oAvailableValue.CHILD_VALUES, function(oChildValue) {
					return oChildValue.PARENT_ENTITY_ID;
				});
			});
		});
	};
	this.fnGetEncounterTypesIdsForEncounterGroup = function(iEncounterGroupParentEntityId) {
		var aoFilters = m_filterValues.FILTER_LIST || [];
		return $.map(aoFilters, function(oFilter) {
			if (oFilter.ARGUMENT_NAME !== 'ENCOUNTERTYPE') {
				return;
			}
			return $.map(oFilter.AVAILABLE_VALUES, function(oAvailableValue) {
				if (oAvailableValue.PARENT_ENTITY_ID !== iEncounterGroupParentEntityId) {
					return;
				}
				return $.map(oAvailableValue.CHILD_VALUES, function(oChildValue) {
					return oChildValue.PARENT_ENTITY_ID;
				});
			});
		});
	};

	this.getProviderGroups = function() {
		var groups = [];
		var filters = m_filterValues.FILTER_LIST;
		for(var f = 0, flen = filters.length; f < flen; f++) {
			var argumentName = filters[f].ARGUMENT_NAME;
			if(argumentName == "ACMPRSNLGROUPS") {
				var availableArguments = filters[f].AVAILABLE_VALUES;
				for(var a = 0, alen = availableArguments.length; a < alen; a++) {
					groups.push({
						group_name: availableArguments[a].ARGUMENT_VALUE,
						group_id: availableArguments[a].PARENT_ENTITY_ID
						});
				}
			}
		}
		return groups;
	};

	this.attachEventHandlers = function(controller){
		var _this = this;
		for(var m = 2, mSectionsLength = _this.m_sections.length; m < mSectionsLength; m++)
		{
			var type = _this.m_sections[m].type;
			if(type === 'admission' || type === 'discharge')
			{
				this.addEvents(type+"Since");
			}
			else
			{
				this.addEvents(type);
			}
			if(type.indexOf("result") == 0) {
				$("#filterResultTimeInput"+type)
					.add("#filterResultsCountInput"+type)
				.bind("keypress paste",getKeyPressValidatorEvent());
			}
		}

		$("#greaterThanAge")
			.add("#admissionInput")
			.add('#dischargeInput')
			.add("#filterMedTimeInput")
			.add("#apptFromDate")
			.add("#apptToDate")
			.add('#noApptToDate')
			.add('#noApptFromDate')
			.add("#orderFromDate")
			.add("#orderToDate")
		.bind("keypress paste",getKeyPressValidatorEvent());

		$("#filterAgeTimeDrop").change(function() {
			_this.onFilterModification();
		});
		$('#appointmentTable').find('input').change(function () {
			$("#apptRadio").prop("checked", true).change();
		});
		$("#apptDateDrop").change(function() {
			var option = $(this).val();
			switch(option) {
				case "0":
					$("#filterApptTimeMax").text(i18n.rwl.DAYSMAX);
					break;
				case "1":
					$("#filterApptTimeMax").text(i18n.rwl.WEEKSMAX);
					break;
				case "2":
					$("#filterApptTimeMax").text(i18n.rwl.MONTHSMAX);
					break;
			}
			$("#appointmentTab").find(".apptDate").keyup();
			$("#apptRadio").prop("checked", true).change();
			_this.onFilterModification();
		});
		$('#noApptDateDrop').change(function() {
			var option = $(this).val();
			switch(option) {
				case '0':
					$('#filterNoApptTimeMax').text(i18n.rwl.DAYSMAX);
					break;
				case '1':
					$('#filterNoApptTimeMax').text(i18n.rwl.WEEKSMAX);
					break;
				case '2':
					$('#filterNoApptTimeMax').text(i18n.rwl.MONTHSMAX);
					break;
			}
			$('#appointmentTab').find('.noApptDate').keyup();
			$('#noApptRadio').prop('checked', true).change();
			_this.onFilterModification();
		});
		$('#appointmentTab').find('.apptDate').keyup(function() {
			var timeVal = $('#apptDateDrop').val();
			var inputVal = $(this).val();
			var $from = $('#apptFromDate');
			var $to = $('#apptToDate');
			if(m_controller.isValidRangeInput(inputVal, timeVal) === false) {
				$(this).addClass('divInputError');
				$('#filterApptTimeMax').removeClass('maxDaysLimit')
											.addClass('divAdmissionMaxColor');
			}
			else if(inputVal === '') {
				$(this).addClass('divInputError');
			}
			else {
				$(this).removeClass('divInputError');
				if($from.hasClass('divInputError') === false && $to.hasClass('divInputError') === false) {
					$('#filterApptTimeMax').removeClass('divAdmissionMaxColor')
											.addClass('maxDaysLimit');
				}
			}
			if (inputVal > 0 || inputVal === '') {
				$('#apptRadio').prop('checked', true).change();
			}
			_this.onFilterModification();
		});
		$('#appointmentTab').find('.noApptDate').keyup(function() {
			var timeVal = $('#noApptDateDrop').val();
			var inputVal = $(this).val();
			var $from = $('#noApptFromDate');
			var $to = $('#noApptToDate');
			if(m_controller.isValidRangeInput(inputVal, timeVal) === false) {
				$(this).addClass('divInputError');
				$('#filterNoApptTimeMax').removeClass('maxDaysLimit')
					.addClass('divAdmissionMaxColor');
			}
			else if(inputVal === '') {
				$(this).addClass('divInputError');
			}
			else {
				$(this).removeClass('divInputError');
				if($from.hasClass('divInputError') === false && $to.hasClass('divInputError') === false) {
					$('#filterNoApptTimeMax').removeClass('divAdmissionMaxColor')
						.addClass('maxDaysLimit');
				}
			}
			if (inputVal > 0 || inputVal === '') {
				$('#noApptRadio').prop('checked', true).change();
			}

			_this.onFilterModification();
		});
		$('#noApptRadio').change(function () {
			_this.revertYesApptSection();
			_this.onFilterModification();
		});
		$('#apptRadio').change(function () {
			_this.revertNoApptSection();
			_this.onFilterModification();
		});

		$("#orderDateDrop").change(function() {
			var option = $(this).val();
			switch(option) {
				case "0":
					$("#filterOrderTimeMax").text(i18n.rwl.DAYSMAX);
					break;
				case "1":
					$("#filterOrderTimeMax").text(i18n.rwl.WEEKSMAX);
					break;
				case "2":
					$("#filterOrderTimeMax").text(i18n.rwl.MONTHSMAX);
					break;
			}
			$("#orderTab").find(".orderDate").keyup();
			_this.onFilterModification();
		});

		$("#filterOrderTypeDrop").change(function() {
			_this.onFilterModification();
		});

		$("#orderTab").find(".orderDate").keyup(function() {
			var timeVal = $("#orderDateDrop").val();
			var inputVal = $(this).val();
			var $from = $("#orderFromDate");
			var $to = $("#orderToDate");
			var fromVal = $from.val();
			var toVal = $to.val();
			if((inputVal > 546 && timeVal == 0) ||
				(inputVal > 78 && timeVal == 1) ||
				(inputVal > 18 && timeVal == 2)) {
					$(this).addClass("divInputError");
				$("#filterOrderTimeMax").removeClass("maxDaysLimit")
											.addClass("divAdmissionMaxColor");
			}
			else {
				$(this).removeClass("divInputError");
				if(!($from.hasClass("divInputError")) && !($to.hasClass("divInputError"))) {
					$("#filterOrderTimeMax").removeClass("divAdmissionMaxColor")
											.addClass("maxDaysLimit");
				}
			}
			_this.onFilterModification();
		});

		$("#filterToolbarListName").hover(function() {
			var $name = $("#fullListNameTooltip");
			var listID = $(this).attr("listID");
			var listName = "";
			for(var i = 0; i < m_filterObj.m_savedLists.length; i++){
				if(listID == m_filterObj.m_savedLists[i].PATIENT_LIST_ID) {
					listName = m_filterObj.m_savedLists[i].PATIENT_LIST_NAME;
					break;
				}
			}
			if($(this).parent().width() == $(this).width()) {
				$name.text(listName).show();
			}
		}, function() {
			$("#fullListNameTooltip").hide();
		});

		$('#ageFilterTypeCombo').change(function() {
			var choice = $('#ageFilterTypeCombo').val();
			_this.createAgeField(choice);
		});

		$('#admissionSinceFilterCombo').change(function() {
			_this.onAdmissionComboChange();
		});

		$('#dischargeSinceFilterCombo').change(function() {
			_this.onDischargeComboChange();
			_this.onFilterModification();
		});

		$("input.cvFilterInput").change(function() {
			_this.onFilterModification();
		});

		$("#conditionOperator").find("input.conditionRadio").change(function() {
			_this.onFilterModification();
		});
		$("#filterExpectationsDrop").change(function(){
			_this.onFilterModification();
		});

		$("#inputAdmDateTo").change(function() {
			_this.onFilterModification();
		});
		$("#registry").change(function(){
			_this.onFilterModification();
		});
		$("#encounterType").change(function(){
			_this.onFilterModification();
		});
		$("#caseManagerFilter").change(function(){
			_this.onFilterModification();
		});
		$("#divAgeCombo").change(function(e){
			_this.onFilterModification();
		});
		$("#admissionSinceFilterCombo").change(function() {
			_this.onFilterModification();
		});
		$("#inputAdmDateFrom").change(function() {
			_this.onFilterModification();
		});


		$("#divAgeInput").keyup(function(e){
			var $divAgeInput = $("#divAgeInput").find(".ageFilterField");
			var ageText = $divAgeInput.val();
			setTimeout(function(){ //wait a second to see if the value changes (more typing).
				var newAgeText = $divAgeInput.val();
				if(newAgeText != ageText) {
					return;
				}
				if($("#rangeFromAge").val() != "" && $("#rangeToAge").val() != "") {
					_this.compareFromToRange($("#rangeFromAge"),$("#rangeToAge"));
				}
				_this.onFilterModification();
			}, 1000);
		});

		$('#divAdmissionInput').keyup(m_controller.debounce(handleAdmissionInputChange,m_controller.delayDuration));

		$('#divDischargeInput').keyup(m_controller.debounce(handleDischargeInputChange,m_controller.delayDuration));


		$("#filterMedStatusDrop").change(function() {
			var $selected = $("#filterMedStatusDrop :selected");
			if($selected.length==0){
				$(this).addClass("divInputError");
			}
			else{
				$(this).removeClass("divInputError");
			}
			_this.onMedChange();
		});
		var $filterShell = $("#filterShell");
		$filterShell.find(".qualifying").change(function() {
			_this.onFilterModification();
		});
		$filterShell.find(".multiselect").on("mousemove mouseout scroll",function(e){
			switch(e.type){
				case 'mousemove':
					showMultiSelectTooltips(e);
					break;
				case 'mouseout':
				case 'scroll':
					hideFilterMultiSelectTooltip();
					break;
			}
		}) ;
		$filterShell.find(".filterValueDrop").change(function() {
			var type = $(this).attr("rtype");
			var value = $(this).val();
			var htmlString;
			$("#filterValueInputs" + type).remove();
			if(value == 0)
			{
				$(this).width("93%");
			}
			else if(value == 6)
			{
				htmlString = "<span id = 'filterValueInputs" + type + "'>&nbsp;&nbsp;";
				htmlString += "<input id = 'filterValueInput1" + type + "' class = 'numInput' type = 'text' maxlength='" + m_maxDigits.Values + "'/>";
				htmlString += "&nbsp;&nbsp;"+ i18n.rwl.ANDL +"&nbsp;&nbsp;";
				htmlString += "<input id = 'filterValueInput2" + type + "' class = 'numInput' type = 'text' maxlength='" + m_maxDigits.Values + "'/>";
				htmlString += "</span>";
				$(this).width("48%").parent().append(htmlString);

				$("#filterValueInput1" + type)
				.bind("keypress paste",getKeyPressValidatorEvent(true,true))
				.keyup(function(){
					var $this = $(this);
					if($this.val())
						$this.removeClass("divInputError");
					else
						$this.addClass("divInputError");
					var resultFromVal = $this.val();
					var newResultFromVal = $this.val();
					if(newResultFromVal == resultFromVal){
						_this.compareFromToRange($this,$("#filterValueInput2" + type));
						_this.onResultChange(type);
					}
				}).keyup();
				$("#filterValueInput2" + type)
				.bind("keypress paste",getKeyPressValidatorEvent(true,true))
				.keyup(function(){
					var $this = $(this);
					if($this.val())
						$this.removeClass("divInputError");
					else
						$this.addClass("divInputError");
					var resultFromVal2 =$this.val();
						var newResultFromVal2 =$this.val();
						if(newResultFromVal2 ==resultFromVal2){
							_this.compareFromToRange($("#filterValueInput1" + type),$this);
							_this.onResultChange(type);
						}
				}).keyup();
			}
			else
			{
				htmlString = "<span id = 'filterValueInputs" + type + "'>&nbsp;&nbsp;";
				htmlString += "<input id = 'filterValueInput1" + type + "' class = 'numInput' type = 'text' maxlength='" + m_maxDigits.Values + "'/>";
				htmlString += "</span>";
				$(this).width("75%").parent().append(htmlString);
				$("#filterValueInput1" + type)
				.bind("keypress paste",getKeyPressValidatorEvent(true,true))
				.keyup(function(){
					if($(this).val())
						$(this).removeClass("divInputError");
					else
						$(this).addClass("divInputError");
					_this.onResultChange(type);
				}).keyup();
			}
			_this.onResultChange(type);
		});
		$filterShell.find(".filterResultsAddBut").click(function() {
			if($(this).is(':disabled')){
				return;
			}
			var type = $(this).attr("rtype");
			var $textField = $("#filterResultType" + type);
			var $resultField = $("#filterDivResultText" + type);
			var resultsAdded = $resultField.find(".resultText").length;
			if(resultsAdded < 3 && $("#filterResultType" + type).val())
			{
				var id = "filterResult" + type + resultsAdded;
				var text = "<div id = '" + id + "' class = 'resultMedPadding resultMedWidth resultText'>";
				text += m_filterObj.getResultsText(0, type, resultsAdded);
				text += "</div>";
				$resultField.append(text);
				if($textField.hasClass("selectedGroup")){
					$("#filterResult" + type + resultsAdded).data("resultTextFieldGroupData", $textField.data("typeFieldGroupData")).addClass("filterByGroup");
				}
				m_filterObj.revertResultsSection(0, type);
				resultsAdded++;
				if(resultsAdded == 3)
				{
					$("#" + type + "Select").find(".filterResult" + type).hide();
					$("#filterResultType" + type).attr("disabled","disabled");
				}
			}
			_this.onFilterModification();
		});
		$filterShell.find(".filterResultsCountInput").keyup(function() {
			if($(this).val())
				$(this).removeClass("divInputError");
			else
				$(this).addClass("divInputError");
			_this.onResultChange($(this).attr("rtype"));
		});
		$filterShell.find(".filterResultType").bind("keyup paste", m_controller.debounce(function(){
			var $input = $(this);
			var type = $input.attr("rtype");
			var result = $.trim($input.val());
			if (result) {
				toggleLoadingIndicator($input, 'load');
				var newResult = $.trim($("#filterResultType" + type).val());
				if (newResult === result) {
					var result_request = {};
					for (var m = 0, mSectionsLength = m_filterObj.m_sections.length; m < mSectionsLength; m++) {
						if (m_filterObj.m_sections[m].type === type) {
							var event_sets = m_filterObj.m_sections[m].argument_name || '';
							var argument_list = [];
							var index = event_sets.indexOf(",");
							while(index !== -1) {
								var argument = event_sets.substring(0,index);
								argument_list.push({
									event_set: argument
								});
								event_sets = event_sets.substring(index+1);
								index = event_sets.indexOf(",");
							}
							argument_list.push({
								event_set: event_sets
							});
							result_request = {
								result_request:{
									text: newResult,
									parent_event_set: argument_list,
									concept: 'EVENT_SET_CONCEPT_' + type.substr(type.length - 1),
									pos_cd: criterion.CRITERION.POSITION_CD
								}
							};
						}
					}
					m_controller.makeCall("mp_dcp_result_options",result_request,true,function(reply) {
						toggleLoadingIndicator($input, 'search');
						if(m_controller.doesValueMatch($input, newResult) === false) {
							return;
						}

						var options = reply.RESULT_OPTIONS || [];
						var eventSetGroupList = reply.EVENT_SET_CONCEPTS || [];
						$("#filterResultOptionList" + type).remove();

						var optionsLength = options.length;
						var eventSetGroupListLength = eventSetGroupList.length;

						var htmlString = "<select id ='filterResultOptions" + type + "' class='resultMedWidth' size ='7'>";
						for (var j = 0; j < eventSetGroupListLength; j++) {
							htmlString += '<option class="groupedItems" id ="filterGroupResult' + type + j + '" eventName="' + eventSetGroupList[j].NAME.toString() + '">';
							htmlString += eventSetGroupList[j].NAME.toString() + i18n.rwl.GROUP;
							htmlString += "</option>";
						}
						for (var i = 0; i < optionsLength; i++) {
							htmlString += '<option class="singleItems" id="filterResult' + type + i + '" eventName="' + options[i].EVENT_SET_NAME.toString() + '">';
							htmlString += options[i].EVENT_SET_DISP.toString();
							htmlString += "</option>";
						}
						htmlString += "</select>";

						if ((optionsLength > 0 || eventSetGroupListLength > 0) && $('#' + type + 'Tab').hasClass('filterSelectExpanded')) {
							$("#filterDivResultType" + type).append($("<div id='filterResultOptionList" + type + "' class='resultMedOptionList'>")
								.html(htmlString));
							for (var i = 0; i < eventSetGroupListLength; i++){
								$("#filterGroupResult" + type + i).data("groupingResultFilterData", eventSetGroupList[i].EVENT_CODES);
							}
							var $list = $("#filterResultOptions" + type);
							var total = optionsLength + eventSetGroupListLength;
							if (total === 1) {
								$list.attr("size", 2);
							}
							else if (total < 8) {
								$list.attr("size", total);
							}

							$list.change(function() {
								var $selected = $("#filterResultOptions" + type + " :selected");
								var selectedText = $selected.text();
								var $selectedID = $("#" + $selected.attr("id"));
								var $textField = $("#filterResultType" + type);
								$textField.val(selectedText).attr("eventName", $selected.attr("eventName"));
								$textField.addClass($selected.attr("class")).removeClass("selectedGroup");
								if ($selectedID.hasClass("groupedItems")) {
									$textField.data("typeFieldGroupData", $selectedID.data("groupingResultFilterData")).addClass("selectedGroup");
								}
								$("#filterResultOptionList" + type).remove();
								if (m_filterObj.medResultExists("filterDivResultText" + type, selectedText, "filterEventset", type)) {
									$("#filterResultsAddBut" + type).attr("disabled", "disabled").addClass("addButdisabled");
								}
								else {
									$("#filterResultsAddBut" + type).removeAttr("disabled").removeClass("addButdisabled");
								}
								$("#filterResultsCountDrop" + type).removeAttr("disabled").val(0);
								$("#filterResultsCountInput" + type).removeAttr("disabled").val(1);
								$("#filterValueDrop" + type).removeAttr("disabled").val(0);
								$("#filterResultTimeInput" + type).removeAttr("disabled").val(546).removeClass('divInputError');
								$("#filterResultTimeDrop" + type).removeAttr("disabled").val(0);
								$("#filterResultTimeMax" + type).empty().append(i18n.rwl.DAYSMAX).removeClass('divAdmissionMaxColor');
							});
						} else {
							$('#filterResultOptionList' + type).remove();
						}
					});
				}
			}
			else
			{
				$("#filterResultOptionList" + type).remove();
				toggleLoadingIndicator($input, 'search');
				$("#filterResultsCountDrop" + type).attr("disabled","disabled").val(2);
				$("#filterResultsCountInput" + type).attr("disabled","disabled").val("");
				var $valueDrop = $("#filterValueDrop" + type);
				if($valueDrop.val() < 7)
				{
					$("#filterValueInputs" + type).remove();
					$valueDrop.val(7).width("93%");
				}
				$valueDrop.attr("disabled","disabled");
				$("#filterResultTimeInput" + type).attr("disabled","disabled").val("");
				$("#filterResultTimeDrop" + type).attr("disabled","disabled").val(3);
				$("#filterResultTimeMax" + type).empty();
				$("#filterResultsAddBut" + type).attr("disabled","disabled").addClass("addButdisabled");
			}
		}, m_controller.delayDuration));
		$filterShell.find(".filterTimeInput").keyup(function() {
			var type = "";
			var rtype = "";
			if($(this).attr("id").indexOf("Med") > -1) {
				type = "Med";
			}
			else {
				type = "Result";
				rtype = $(this).attr("rtype");
			}
			var timeVal = $("#filter" + type + "TimeDrop" + rtype).val();
			var inputVal = $(this).val();
			if((inputVal > 546 && timeVal == 0) ||
				(inputVal > 78 && timeVal == 1) ||
				(inputVal > 18 && timeVal == 2) || (inputVal == "")) {
				$(this).addClass("divInputError");
				$("#filter" + type + "TimeMax" + rtype).addClass('divAdmissionMaxColor');
			} else {
				$(this).removeClass("divInputError");
				$("#filter" + type + "TimeMax" + rtype).removeClass('divAdmissionMaxColor');
			}
			if(rtype) {
				_this.onResultChange(rtype);
			}
			else {
				_this.onMedChange();
			}
		});
		$filterShell.find(".filterTimeDrop").change(function() {
			var type = "";
			var rtype = "";
			if($(this).attr("id").indexOf("Med") > -1) {
				type = "Med";
			}
			else {
				type = "Result";
				rtype = $(this).attr("rtype");
			}
			$("#filter" + type + "TimeMax" + rtype).empty();
			switch($(this).val()) {
				case "0":
					$("#filter" + type + "TimeInput" + rtype).keyup();
					$("#filter" + type + "TimeMax" + rtype).append(i18n.rwl.DAYSMAX);
					break;
				case "1":
					$("#filter" + type + "TimeInput" + rtype).keyup();
					$("#filter" + type + "TimeMax" + rtype).append(i18n.rwl.WEEKSMAX);
					break;
				case "2":
					$("#filter" + type + "TimeInput" + rtype).keyup();
					$("#filter" + type + "TimeMax" + rtype).append(i18n.rwl.MONTHSMAX);
					break;
			}
		});
		$filterShell.find(".medRadioBut").change(function () {
			$("#filterMedSearchInput").val("").keyup();
			$("#filterMedSearchList").remove();
		});

		$("#filterMedSearchInput").bind("keyup paste", m_controller.debounce(function() {
			var $input = $(this);
			var med = $input.val();
			if(med) {
				toggleLoadingIndicator($input, 'load');
				var newMed = $("#filterMedSearchInput").val();
				if(newMed == med)
				{
					var med_request = {med_request:{
						personnel_id: criterion.CRITERION.PRSNL_ID,
						text: newMed,
						catalog_flag: ""
					}};

					if($("#filterMedSearchName").attr("checked")){
						med_request.med_request.catalog_flag = "0";
					}
					else {
						med_request.med_request.catalog_flag = "1";
					}
					m_controller.makeCall("mp_dcp_get_drug_options",med_request,true,function(reply)
					{
						toggleLoadingIndicator($input, 'search');
						if(m_controller.doesValueMatch($input, newMed) === false) {
							return;
						}

						var catalog = reply.CATALOG;
						$("#filterMedSearchList").remove();

						if (catalog && $('#medicationsTab').hasClass('filterSelectExpanded')) {
							var options;
							if(catalog == "MED")
								options = reply.MEDS;
							else
								options = reply.DRUG_CLASS;

							var htmlString = "<select id ='filterMedSearchOptions' class ='resultMedWidth' size ='6'>";
							for(var i = 0; i < options.length; i++)
							{
								htmlString += "<option id = 'filterMedOption" + i + "'";
								if(catalog == "MED")
									htmlString += '>' + options[i].DRUG_NAME.toString();
								else
									htmlString += ' value="' + options[i].ID + '">' + options[i].NAME.toString();
								htmlString += "</option>";
							}
							htmlString += "</select>";
							if(options.length > 0)
							{
								$("#filterDivMedSearch").append($("<div id='filterMedSearchList' class='resultMedOptionList'>")
									.html(htmlString));
							}
							$("#filterMedSearchOptions").change(function() {
								var $selected = $("#filterMedSearchOptions :selected");
									var selectedText = $selected.text();
									$("#filterMedSearchInput").val(selectedText).attr("med_id", $selected.attr("value"));
									$("#filterMedSearchList").remove();
									if(m_filterObj.medResultExists('filterDivMedText', selectedText, 'filterMedInput') === true ||
										m_filterObj.medResultExists('filterDivMedClassificationText', selectedText, 'filterMedInput') === true) {

										$('#filterMedsAddBut').attr('disabled', 'disabled').addClass('addButdisabled');
									} else {
										$('#filterMedsAddBut').removeAttr('disabled').removeClass('addButdisabled');
									}
									var ordered = 0;
									var count = 0;
									$("#filterMedStatusDrop").children().each(function() {
										if($(this).text() == "Ordered")
										ordered = count;
									else
										count++;
								});
								$("#filterMedStatusDrop").removeAttr("disabled").val(ordered);
								$("#filterMedTimeInput").removeAttr("disabled").val(546);
								$("#filterMedTimeDrop").removeAttr("disabled").val(0);
								$("#filterMedTimeMax").empty().append(i18n.rwl.DAYSMAX);
							});
						} else {
							$('#filterMedSearchList').remove();
						}
					});
				}
			}
			else
			{
				toggleLoadingIndicator($input, 'search');
				$("#filterMedSearchList").remove();
				$("#filterMedStatusDrop").attr("disabled","disabled").val(0);
				$("#filterMedTimeInput").attr("disabled","disabled").val("");
				$("#filterMedTimeDrop").attr("disabled","disabled").val(3);
				$("#filterMedTimeMax").empty();
				$("#filterMedsAddBut").attr("disabled","disabled").addClass("addButdisabled");
			}
		}, m_controller.delayDuration));
		$('#filterMedsAddBut').click(function() {
			if($(this).is(':disabled')){
				return;
			}
			var isSearchByName = $('#filterMedSearchName').prop('checked');
			var DRUG_NAME = 'drugname';
			var DRUG_CLASSIFICATION = 'drugclass';
			var medsAdded = $('#filterDivMedText').add('#filterDivMedClassificationText').find('.medsText').length;
			var id = null;
			var $textContainer = null;
			var $text = null;
			var ADDED_MEDS_LIMIT = 3;
			if (medsAdded < ADDED_MEDS_LIMIT && $('#filterMedSearchInput').val() !== null && $('#filterMedSearchInput').val().length > 0) {
				id = 'filterMed' + medsAdded;
				$textContainer = $('<div>');
				$text = $('<div>')
					.attr('id', id)
					.addClass('resultMedPadding resultMedWidth medsText')
					.html(m_filterObj.getMedsText(0, medsAdded))
					.appendTo($textContainer);

				if(isSearchByName === true) {
					$text.addClass(DRUG_NAME);
					$('#filterDivMedText').append($textContainer.html());
				} else {
					$text.addClass(DRUG_CLASSIFICATION);
					$('#filterDivMedClassificationHeader').removeClass('hidden');
					$('#filterDivMedClassificationText').append($textContainer.html());
				}
				m_filterObj.revertMedsSection(0);
				medsAdded++;
				if(medsAdded === ADDED_MEDS_LIMIT)	{
					$('#medicationsSelect').find('.filterMed').hide();
					$('#filterMedSearchInput').attr('disabled','disabled');
				}
			}
			_this.onFilterModification();
		});
	};
	this.onResultChange = function(type) {
		var selected = $("#filterResultType" +type).val();
		if($("#" + type + "Select").find(".divInputError").length == 0 &&  !(m_filterObj.medResultExists("filterDivResultText", selected, "filterEventset", type))) {
			$("#filterResultsAddBut" + type).removeAttr("disabled").removeClass("addButdisabled");
		}
		else {
			$("#filterResultsAddBut" + type).attr("disabled", "disabled").addClass("addButdisabled");
		}
	};
	this.onMedChange = function() {
		var selected = $('#filterMedSearchInput').val();
		if($('#medicationsSelect').find('.divInputError').length === 0 &&
			!m_filterObj.medResultExists('filterDivMedText', selected, 'filterMedInput') &&
			!m_filterObj.medResultExists('filterDivMedClassificationText', selected, 'filterMedInput')) {

			$('#filterMedsAddBut').removeAttr('disabled').removeClass('addButdisabled');
		} else {
			$('#filterMedsAddBut').attr('disabled', 'disabled').addClass('addButdisabled');
		}
	};
	this.medResultExists = function(div, value, idMedResultAdded, type) {
		var exists = false;
		var count = 0;
		type = type || "";
		$("#" + div).children().each(function() {
			if($("#"+idMedResultAdded + count + type).text()==value) {
					exists = true;
					return false;
				}
			count++;
			});
		return exists;
	};
	this.onAdmissionComboChange = function() {
		var choice = $('#admissionSinceFilterCombo').val();
		$("#divAdmissionInput").keyup();

		switch(choice) {
			case "0":
				$("#divAdmissionMax").text(i18n.rwl.DAYSMAX);
			break;
			case "1":
				$("#divAdmissionMax").text(i18n.rwl.WEEKSMAX);
			break;
			case "2":
				$("#divAdmissionMax").text(i18n.rwl.MONTHSMAX);
			break;
		}
	};
	function handleAdmissionInputChange() {
		_this.checkAdmissionInputFilter();
		_this.onFilterModification();
	}
	this.onDischargeComboChange = function() {
		var choice = $('#dischargeSinceFilterCombo').val(),
			$divDischargeMax = $('#divDischargeMax');

		handleDischargeInputChange();

		switch(choice) {
			case '0':
				$divDischargeMax.text(i18n.rwl.DAYSMAX);
			break;
			case '1':
				$divDischargeMax.text(i18n.rwl.WEEKSMAX);
			break;
			case '2':
				$divDischargeMax.text(i18n.rwl.MONTHSMAX);
			break;
		}
	};
	function handleDischargeInputChange() {
		m_filterObj.checkDischargeInputFilter();
		m_filterObj.onFilterModification();
	}
	this.checkAdmissionInputFilter = function() {
		if(this.lastExpandedFilter == "admissionSince") {
			$("#admissionInput").removeClass("divInputError");
			$("#divAdmissionMax").removeClass('divAdmissionMaxColor');
			var filterComboVal = $("#admissionSinceFilterCombo").val();
			var admissionInput = $("#admissionInput").val();
			if(filterComboVal == 0 && admissionInput > 546 ||
				filterComboVal == 1 && admissionInput > 78 ||
				filterComboVal == 2 && admissionInput > 18) {
					$("#admissionInput").addClass("divInputError");
					$("#divAdmissionMax").addClass('divAdmissionMaxColor');
					return false;
			}
		}
		return true;
	};
	this.checkDischargeInputFilter = function() {
		if(this.lastExpandedFilter === 'dischargeSince') {

			var $dischargeInput = $('#dischargeInput'),
				$divDischargeMax = $('#divDischargeMax'),
				filterComboVal = parseInt($('#dischargeSinceFilterCombo').val(),10),
				dischargeInput = parseInt($dischargeInput.val(),10);

			$dischargeInput.removeClass('divInputError');
			$divDischargeMax.removeClass('divAdmissionMaxColor');

			if(filterComboVal === 0 && dischargeInput > 546 ||
				filterComboVal === 1 && dischargeInput > 78 ||
				filterComboVal === 2 && dischargeInput > 18) {
					$dischargeInput.addClass('divInputError');
					$divDischargeMax.addClass('divAdmissionMaxColor');
			}
		}
	};
	this.isMedResultValid = function() {
		var valid = true;
		$("#filterTable").find(".filterResultType").each(function() {
				if($(this).val())
				{
					valid = false;
					return false;
				}
			});
		if($("#filterMedSearchInput").val())
			valid = false;
		return valid;
	};
	function fnIsAppointmentsFilterValid() {
		var bIsValid = false;
		var sApptFromDate = '';
		var sApptToDate = '';
		var sApptDropVal = '';
		var iApptStatusSelected = 0;
		var $checkedAppt = $('input[name="apptStatusRadio"]:checked');
		var $noApptDateDrop = null;
		var $apptDateDrop = null;
		var bNoAppt = ($checkedAppt.val() === 'noAppointment');
		var bApptFilterNotSelected = ($checkedAppt.length === 0);
		var bApptFilterFilledCorrectly = false;

		if(bNoAppt === true) {
			sApptFromDate = $('#noApptFromDate').val();
			sApptToDate = $('#noApptToDate').val();
			$noApptDateDrop = $('#noApptDateDrop');
			sApptDropVal = $noApptDateDrop.val();
			$noApptDateDrop = null;
		}
		else {
			sApptFromDate = $('#apptFromDate').val();
			sApptToDate = $('#apptToDate').val();
			$apptDateDrop = $('#apptDateDrop');
			sApptDropVal = $apptDateDrop.val();
			iApptStatusSelected = $('#appointmentTable').find('input:checked').length;
			$apptDateDrop = null;
		}

		bApptFilterFilledCorrectly = (m_controller.isAppointmentInputValid(sApptFromDate,sApptToDate,sApptDropVal) === true && (iApptStatusSelected > 0 || bNoAppt === true));
		if (bApptFilterNotSelected === true || bApptFilterFilledCorrectly === true) {
			bIsValid = true;
		}

		$checkedAppt = null;

		return bIsValid;
	}
	this.onFilterModification = function(){
		var filters = this.getFilterChecks();
		if(filters.length > 0) {
			$("#filterButClearAll").removeAttr("disabled");
		}else{
			$("#filterButClearAll").attr("disabled","disabled");
		}
		m_filtersAppliedPreviously = m_sLastAppliedFilterChecks;
		var bFiltersChanged = (m_sLastAppliedFilterChecks.localeCompare(JSON.stringify(filters))!=0); // true if strings aren't identical
		if(bFiltersChanged && this.isMedResultValid() && fnIsAppointmentsFilterValid() === true && $('#filterTable').find('.divInputError').length === 0) {
			$("#filterButApply").removeAttr("disabled");
		} else {
			$("#filterButApply").attr("disabled", "disabled");
		}
	};

	this.createAgeField = function(option){
		switch(option){
			case "0":
				$("#divAgeInput")
					.empty()
					.append($("<input type='text' id='greaterThanAge' class='ageFilterField' maxlength='" + m_maxDigits.Days + "'>")
								.bind("keypress paste",getKeyPressValidatorEvent()));
				break;
			case "1":
				$("#divAgeInput")
					.empty()
					.append($("<input type='text' id='lessThanAge' class='ageFilterField' maxlength='" + m_maxDigits.Days + "'>")
								.bind("keypress paste",getKeyPressValidatorEvent()));
				break;
			case "2":
				$("#divAgeInput")
					.empty()
					.append($("<input type='text' id='equalToAge' class='ageFilterField' maxlength='" + m_maxDigits.Days + "'>")
								.bind("keypress paste",getKeyPressValidatorEvent()));
				break;
			case "3":
				$("#divAgeInput")
					.empty()
					.append($("<input type='text' id='rangeFromAge' class='ageFilterField' maxlength='" + m_maxDigits.Days + "'>")
										.bind("keypress paste",getKeyPressValidatorEvent()),
							$("<span class='rangeTo'>" + i18n.rwl.TOL + "</span>"),
							$("<input type='text' id='rangeToAge' class='ageFilterField' maxlength='" + m_maxDigits.Days + "'>")
										.bind("keypress paste",getKeyPressValidatorEvent()));
				break;
		}
	};

	this.createAdmissionField = function(option){
		switch(option){
			case "0":
			case "1":
			case "2":
				$("#admTitle").text(i18n.rwl.ADMISSIONRANGE);
				$("#divAdmissionInput")
					.empty()
					.append($('<input type="text" id="admissionInput" class="admitDischargeFilterField"  maxlength="' + m_maxDigits.Days + '">')
								.bind('keypress paste',getKeyPressValidatorEvent()));
				break;
			}
	};
	this.createDischargeField = function(){
		$('#dischTitle').text(i18n.rwl.DISCHARGERANGE);
		$('#divDischargeInput')
			.html($('<input type="text" id="dischargeInput" class="admitDischargeFilterField"  maxlength="' + m_maxDigits.Days + '">')
						.bind('keypress paste',getKeyPressValidatorEvent()));
	};
	this.launchRemoveAllDialog = function() {
		var list = m_filterObj.getActiveList(),
			removePatientsPrompt = i18n.rwl.REMOVENUMOFPATIENTS.replace('{0}','<span class="boldText">(' + m_controller.returnRemovablePatients().length + ')</span>'),
			htmlString = '';
		htmlString += '<div id = "divSaveBackground" class="overlayDimmed"/><div id = "dialog"><div id = "rwDeleteDlgHeader" class="dlgHeader"><span>' + i18n.rwl.REMOVEDQPATIENTS + '</span></div>';
		htmlString += '<div id = "dialogMiddle">' + removePatientsPrompt + '</div>';
		htmlString += '<div id = "dialogButtons"><input id = "removeDialogCancel" class = "shareButton rwSearchDlgBtn" type = "button" value = "' + i18n.rwl.CANCEL + '"/>';
		htmlString += '<input id = "removeDialogOk" class = "shareButton rwSearchDlgBtn" type ="button" value="' + i18n.rwl.REMOVE + '"/></div></div>';
		$('body').prepend(htmlString);

		$('#removeDialogOk').click(function() {
			m_controller.removeAllPatients();
			$('#divSaveBackground').add('#dialog').remove();
		});

		$('#removeDialogCancel').click(function() {
			$('#divSaveBackground').add('#dialog').remove();
		});
	};
	this.launchRenameDialog = function() {
		var htmlString = "";
		var list = m_filterObj.getActiveList();
		htmlString += "<div id = 'rwRenameDlgHeader' class='dlgHeader'><span>" + i18n.rwl.RENAMEWORKLIST + "</span></div>";
		htmlString += "<div id = 'dialogMiddle'><span><span class = 'reqField'>*</span>" + i18n.rwl.LISTNAME + "</span>";
		htmlString += "<input id = 'renameText' type = 'text' maxlength=50 value = '" + list.PATIENT_LIST_NAME + "'/></div>";
		htmlString += "<div id = 'dialogButtons'><input id = 'renameDialogCancelBut' class = 'shareButton rwSearchDlgBtn' type = 'button' value = '" + i18n.rwl.CANCEL + "'/>";
		htmlString += "<input id = 'renameDialogOkBut' class = 'shareButton rwSearchDlgBtn' type ='button' value='" + i18n.rwl.SAVE + "'/></div>";
		var $dialog = $("<div id = 'dialog'>").html(htmlString);
		$("body").prepend("<div id = 'divSaveBackground' class='overlayDimmed'>", $dialog);
		$("#renameDialogOkBut").click(function() {
			var listId = list.PATIENT_LIST_ID;
			m_controller.createCheckpoint("USR:DWL-SAVERENAMELIST", "Start");
			var $renameText = $("#renameText");
			var oldName = $renameText.val() || "";
			var newName = $.trim(oldName).replace(/([^0-9A-Za-z'_ \/\-])/g, "");
			if(newName!==oldName){
				$renameText.val(newName);
			}
			var metaData = [
			{key: 'List ID', value: listId},
			{key: 'Number of Patients', value: m_controller.getStaticPatientListSize()}
		    ];
			if(newName.length <= 0){
				alert(i18n.rwl.VALIDLIST);
				m_controller.createCheckpoint("USR:DWL-SAVERENAMELIST", "Stop", metaData);
				return;
			}
			for(var i=0,len=m_filterObj.m_savedLists.length;i<len;i++){
				if(newName == m_filterObj.m_savedLists[i].PATIENT_LIST_NAME) {
					alert(i18n.rwl.CHANGELISTNAME);
					m_controller.createCheckpoint("USR:DWL-SAVERENAMELIST", "Stop", metaData);
					return;
				}
			}

			var listName = newName;
			var listrequest = {listrequest:{
				patient_list_id:listId,
				name:listName.replace(/\\/g,"\\\\"),
				rename_ind:1,
				owner_prsnl_id:criterion.CRITERION.PRSNL_ID
			}};
			m_controller.makeCall("mp_dcp_upd_patient_list",listrequest,true,function() {
				for(var j=0,length=m_filterObj.m_savedLists.length;j<length;j++){
					if(listId==m_filterObj.m_savedLists[j].PATIENT_LIST_ID){
						m_filterObj.m_savedLists[j].PATIENT_LIST_NAME = listName;
						if(listId==m_filterObj.m_selectedPatientListID){
							$("#filterToolbarListSelect span").text(listName);
						}
						m_filterObj.m_savedLists = alphaSort(m_filterObj.m_savedLists,"PATIENT_LIST_NAME");
						break;
					}
				}
				m_filterObj.refreshSavedListDrop();
			},null,null,null,"rename");

			$("#divSaveBackground").remove();
			$("#dialog").remove();
			m_controller.createCheckpoint("USR:DWL-SAVERENAMELIST", "Stop", metaData);
		});
		$("#renameDialogCancelBut").click(function() {
			$("#divSaveBackground").remove();
			$("#dialog").remove();
		});
	};
	this.launchDeleteDialog = function() {
		var list = m_filterObj.getActiveList();
		var deleteListPrompt = i18n.rwl.DELETELISTPROMPT.replace("{23}","<b>" + list.PATIENT_LIST_NAME + "</b>");
		var htmlString = "";
		htmlString += "<div id = 'rwDeleteDlgHeader' class='dlgHeader'><span>" + i18n.rwl.DELETEWORKLIST + "</span></div>";
		htmlString += "<div id = 'dialogMiddle'>" + deleteListPrompt + "</div>";
		htmlString += "<div id = 'dialogButtons'><input id = 'deleteDialogCancelBut' class = 'shareButton rwSearchDlgBtn' type = 'button' value = '" + i18n.rwl.CANCEL + "'/>";
		htmlString += "<input id = 'deleteDialogOkBut' class = 'shareButton rwSearchDlgBtn' type ='button' value='" + i18n.rwl.DELETE + "'/></div>";
		var $dialog = $("<div id = 'dialog'>").html(htmlString);
		$("body").prepend("<div id = 'divSaveBackground' class='overlayDimmed'>", $dialog);
		$("#deleteDialogOkBut").click(function() {
			$("#displayRemovableCountDiv").hide();
			var listID = list.PATIENT_LIST_ID;
			m_controller.createCheckpoint("USR:DWL-DELETELIST", "Start");

			var listrequest = {listrequest:{
				patient_list_id:listID,
				delete_ind:1
			}};
			m_controller.makeCall("mp_dcp_upd_patient_list",listrequest,true,function(){
				m_filterObj.removeSavedList(listID,true);
				m_controller.createCheckpoint("USR:DWL-DELETELIST", "Stop", [{key: "List ID", value: listID}]);
				if(m_filterObj.m_savedLists.length < 1)
				{
					$("#filterTab").addClass("noList").trigger("updateFilterState");
					m_controller.setWorklistMessage(i18n.rwl.NOWORKLIST,true, true);
					$("#wklOuterDiv").find("div.wklHorizScroller").addClass("hidden");
					m_controller.notifyOnChangeActiveList(0);
					m_controller.clearSpecificMessages(".updpatientlist");
				}
				else
				{
					m_filterObj.setActiveList(m_filterObj.m_savedLists[0].PATIENT_LIST_ID);
				}
				m_controller.setWorklistMessage(i18n.rwl.NOPERSON,false);
			},null,null,null,"delete");

			m_controller.audit("Dynamic Worklist","Delete Worklist");

			$("#divSaveBackground").remove();
			$("#dialog").remove();
		});
		$("#deleteDialogCancelBut").click(function() {
			$("#divSaveBackground").remove();
			$("#dialog").remove();
		});
	};


	this.addStaticList = function(listID,listName,listArguments,bShowList){
		var listLen = this.m_savedLists.length;
		var iVal = 0;
		this.m_savedLists.push({
				PATIENT_LIST_ID:listID,
				PATIENT_LIST_NAME:listName,
				OWNER_ID: this.criterion.CRITERION.PRSNL_ID,
				ARGUMENTS: listArguments,
				PROXIES: []
				});
		iVal = this.m_savedLists.length - 1;
		this.addSavedLists(this.m_savedLists[iVal]);

		if(bShowList){
			$("#divRanking div.rankContainer.from").trigger("setRank",0);
			$("#divRanking div.rankContainer.to").trigger("setRank",5);
			this.setActiveList(listID);
			setTimeout(function() {
				$("#filterTab").removeClass("collapsed").trigger("updateFilterState");
			}, 1);
		}
	};

	this.filterList = function(){
		this.controller.filterWorklist();
	};

	this.getFilterChecks = function(){
		var argumentAr = [];
		var sectionAr = this.m_sections;
		var $divAgeFilterField = $("#divAgeInput").find(".ageFilterField");
		var admissionSinceFilterVal = $('#admissionSinceFilterCombo').val();
		var dischargeSinceFilterVal = $('#dischargeSinceFilterCombo').val();
		var admissionInputVal = $('#admissionInput').val();
		var dischargeInputVal = parseInt($('#dischargeInput').val(),10);
		var dischargeInputText = $('#dischargeInput').val();
		var ageTimeVal = $("#filterAgeTimeDrop").val();
		var apptFromDateVal = $("#apptFromDate").val();
		var apptToDateVal = $("#apptToDate").val();
		var $appointmentTableInput = $("#appointmentTable").find("input");
		var noApptFromDateVal = $('#noApptFromDate').val();
		var noApptToDateVal = $('#noApptToDate').val();
		var noAppt = ($('input[name="apptStatusRadio"]:checked').val() === 'noAppointment');

		for(var i=0, sectionArLength = sectionAr.length; i < sectionArLength; i++){
			if(sectionAr[i].argument_name == "QUALIFYING") {
				if($("#qualifyingStill").attr("checked")) {
					argumentAr.push({
						ARGUMENT_NAME : "QUALIFYING",
						ARGUMENT_VALUE : "still",
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
						PARENT_FILTER_NAME : "QUALIFYING"
					});
				}
				else if($("#qualifyingNot").attr("checked")) {
					argumentAr.push({
						ARGUMENT_NAME : "QUALIFYING",
						ARGUMENT_VALUE : "not",
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
						PARENT_FILTER_NAME : "QUALIFYING"
					});
				}
			}
			else if(sectionAr[i].argument_name == "AGE"){
				var timeArg = "";
				switch(ageTimeVal) {
					case "0":
						timeArg = "AGEYEARS";
						break;
					case "1":
						timeArg = "AGEMONTHS";
						break;
					case "2":
						timeArg = "AGEWEEKS";
						break;
					case "3":
						timeArg = "AGEDAYS";
						break;
				}

				$divAgeFilterField.each(function(){
					var argName = "";
					switch($(this).attr("id")){
						case "greaterThanAge":
							argName = "AGEGREATER";
							break;
						case "lessThanAge":
							argName = "AGELESS";
							break;
						case "equalToAge":
							argName = "AGEEQUAL";
							break;
						case "rangeToAge":
							argName = "AGETO";
							break;
						case "rangeFromAge":
							argName = "AGEFROM";
							break;
					}
					if(argName == "AGEFROM" || argName == "AGETO") {
						if($("#rangeFromAge").val() != "" && $("#rangeToAge").val() != "") {
							argumentAr.push({
								ARGUMENT_NAME : argName,
								ARGUMENT_VALUE : $(this)[0].value,
								PARENT_ENTITY_ID : 0.0,
								PARENT_ENTITY_NAME : "",
								PARENT_FILTER_NAME : "AGE"
							});
							argumentAr.push({
								ARGUMENT_NAME : timeArg,
								ARGUMENT_VALUE : 0,
								PARENT_ENTITY_ID : 0.0,
								PARENT_ENTITY_NAME : "",
								PARENT_FILTER_NAME : "AGE"
							});
						}
					} else {
						if($(this)[0].value != ""){
							argumentAr.push({
								ARGUMENT_NAME : argName,
								ARGUMENT_VALUE : $(this)[0].value,
								PARENT_ENTITY_ID : 0.0,
								PARENT_ENTITY_NAME : "",
								PARENT_FILTER_NAME : "AGE"
							});
							argumentAr.push({
								ARGUMENT_NAME : timeArg,
								ARGUMENT_VALUE : 0,
								PARENT_ENTITY_ID : 0.0,
								PARENT_ENTITY_NAME : "",
								PARENT_FILTER_NAME : "AGE"
							});
						}
					}

				});
				continue;
			}
			else if(sectionAr[i].argument_name == "ADMISSION"){
				var argAr = [];
				switch(admissionSinceFilterVal)
				{
				case "0":
					if(admissionInputVal <= 546) {
						argAr.push({
							Name : "ADMISSIONDAYS",
							Value : admissionInputVal
						});
					}
					break;
				case "1":
					if(admissionInputVal <= 78) {
						argAr.push({
							Name : "ADMISSIONWEEKS",
							Value : admissionInputVal
						});
					}
					break;
				case "2":
					if(admissionInputVal <= 18) {
						argAr.push({
						Name : "ADMISSIONMONTHS",
						Value : admissionInputVal
						});
					}
					break;
				}
				for(var j=0, argArLength = argAr.length; j<argArLength; j++)
				{
					if(argAr[j].Value){
						argumentAr.push({
							ARGUMENT_NAME : argAr[j].Name,
							ARGUMENT_VALUE : argAr[j].Value,
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : "",
							PARENT_FILTER_NAME : "ADMISSION"
						});
					}
				}
				continue;
			}
			else if(sectionAr[i].argument_name === 'DISCHARGE'){
				var argName = '';
				switch(dischargeSinceFilterVal)
				{
					case '0':
						if(dischargeInputVal <= 546) {
							argName = 'DISCHARGEDAYS';
						}
						break;
					case '1':
						if(dischargeInputVal <= 78) {
							argName = 'DISCHARGEWEEKS';
						}
						break;
					case '2':
						if(dischargeInputVal <= 18) {
							argName = 'DISCHARGEMONTHS';
						}
						break;
				}
				if(argName !== '') {
					argumentAr.push({
						ARGUMENT_NAME : argName,
						ARGUMENT_VALUE : dischargeInputText,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : '',
						PARENT_FILTER_NAME : 'DISCHARGE'
					});
				}
				continue;
			}
			else if(sectionAr[i].argument_name == "CONDITION"){
				var conditionArguments = this.getConditionArguments(false);
				argumentAr = conditionArguments.concat(argumentAr);
			}
			else if(sectionAr[i].argument_name == "RANKING"){
				var fromRank = $("#divRanking div.rankContainer.from").data('rank-value');
				var toRank = $("#divRanking div.rankContainer.to").data('rank-value');

				if(fromRank > 0) {//don't bother pushing min/max rankings as this causes unneeded processing.
					argumentAr.push({
						ARGUMENT_NAME : "RANKINGFROM",
						ARGUMENT_VALUE : fromRank,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
						PARENT_FILTER_NAME : "RANK"
					});
				}

				if(toRank < 5) {
					if(toRank === '-1') {   // Handle error case where toRank gets invalid value when clearing a rank of 0.
						toRank = 0;
					}
					argumentAr.push({
						ARGUMENT_NAME : "RANKINGTO",
						ARGUMENT_VALUE : toRank,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
						PARENT_FILTER_NAME : "RANK"
					});
				}
			}
			else if(sectionAr[i].type.indexOf("result") == 0)
			{
				argumentAr = getResultArguments(argumentAr, sectionAr[i].type);
			}
			else if(sectionAr[i].argument_name == "ORDERSTATUS")
			{
				argumentAr = getMedArguments(argumentAr);
			}
			else if (sectionAr[i].argument_name == "APPTSTATUS") {
				var checked = false,
					apptFromDate = 0,
					apptToDate = 0,
					apptDropVal = 0,
					apptDropChar = '';

				if(noAppt === true) {
					apptFromDate = noApptFromDateVal;
					apptToDate = noApptToDateVal;
					var $noApptDateDrop = $('#noApptDateDrop');
					apptDropVal = $noApptDateDrop.val();
					apptDropChar = m_controller.fnMapSelectedDateValue(apptDropVal);
				}
				else {
					apptFromDate = apptFromDateVal;
					apptToDate = apptToDateVal;
					var $apptDateDrop = $('#apptDateDrop');
					apptDropVal = $apptDateDrop.val();
					apptDropChar = m_controller.fnMapSelectedDateValue(apptDropVal);
				}

				if (m_controller.isAppointmentInputValid(apptFromDate,apptToDate,apptDropVal)) {
					$appointmentTableInput.each(function(){
						var chkObj = $(this)[0];
						if(chkObj.checked) {
							argumentAr.push({
								ARGUMENT_NAME : sectionAr[i].argument_name,
								ARGUMENT_VALUE : decodeURI(chkObj.name),
								PARENT_ENTITY_ID : chkObj.value,
								PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
								PARENT_FILTER_NAME : "APPOINTMENTS"
							});
							checked = true;
						}
					});
					if (checked || noAppt === true) {
						argumentAr.push({
							ARGUMENT_NAME: 'NOAPPT',
							ARGUMENT_VALUE: noAppt.toString(),
							PARENT_ENTITY_ID: '0',
							PARENT_ENTITY_NAME: sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME: 'APPOINTMENTS'
						});
						argumentAr.push({
							ARGUMENT_NAME : "APPTFROM",
							ARGUMENT_VALUE : apptFromDate,
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "APPOINTMENTS"
						});
						argumentAr.push({
							ARGUMENT_NAME : "APPTTO",
							ARGUMENT_VALUE : apptToDate,
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "APPOINTMENTS"
						});
						argumentAr.push({
							ARGUMENT_NAME : "APPTDATEUNIT",
							ARGUMENT_VALUE : apptDropChar,
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "APPOINTMENTS"
						});
					}
				}
			}
			else if(sectionAr[i].argument_name == "ORDERSSTATUS") {
				var orderFromDate = $("#orderFromDate").val();
				var orderToDate = $("#orderToDate").val();
				var ochecked = [];
				var selected = [];
				if(orderFromDate && orderToDate) {
					$("#orderTable").find("input").each(function(){
						var chkObj = $(this)[0];
						if(chkObj.checked) {
							ochecked.push({
								ARGUMENT_NAME : sectionAr[i].argument_name,
								ARGUMENT_VALUE : decodeURI(chkObj.name),
								PARENT_ENTITY_ID : chkObj.value,
								PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
								PARENT_FILTER_NAME : "ORDERS"
							});
						}
					});
					$("#filterOrderTypeDrop :selected").each(function() {
						selected.push({
							ARGUMENT_NAME : "ORDERTYPE",
							ARGUMENT_VALUE : $(this).text(),
							PARENT_ENTITY_ID : $(this).val(),
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "ORDERS"
						});
					});
					if(ochecked.length > 0 && selected.length > 0) {
						argumentAr = argumentAr.concat(selected);
						argumentAr = argumentAr.concat(ochecked);
						argumentAr.push({
							ARGUMENT_NAME : "ORDERFROM",
							ARGUMENT_VALUE : orderFromDate,
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "ORDERS"
						});
						argumentAr.push({
							ARGUMENT_NAME : "ORDERTO",
							ARGUMENT_VALUE : orderToDate,
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "ORDERS"
						});
						argumentAr.push({
							ARGUMENT_NAME : "ORDERDATEUNIT",
							ARGUMENT_VALUE : m_controller.fnMapSelectedDateValue($("#orderDateDrop :selected").val()),
							PARENT_ENTITY_ID : "0",
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "ORDERS"
						});
					}
				}
			}
			else if(sectionAr[i].argument_name == "EXPECTATIONS") {
				var $selected = $("#filterExpectationsDrop").find(":selected");
				var recomm = [];
				$("#expectationTable").find("input").each(function() {
					var chkObj = $(this)[0];
					if(chkObj.checked) {
						recomm.push({
							ARGUMENT_NAME : "RECOMMSTATUS",
							ARGUMENT_VALUE : decodeURI(chkObj.name),
							PARENT_ENTITY_ID : chkObj.value,
							PARENT_ENTITY_NAME : "RECOMMSTATUS",
							PARENT_FILTER_NAME : "EXPECTATIONS"
						});
					}
				});
				if($selected.length > 0 && recomm.length > 0) {
					$selected.each(function() {
						argumentAr = argumentAr.concat(recomm);
						argumentAr.push({
							ARGUMENT_NAME : "EXPECTATIONS",
							ARGUMENT_VALUE : $(this).attr('fulltext'),
							PARENT_ENTITY_ID : $(this).val(),
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : "EXPECTATIONS"
						});
					});
				}
			}
			else if (sectionAr[i].argument_name === 'ENCOUNTERTYPE') {
				$('#' + sectionAr[i].type + 'Table').find('input:checked').each(function () {
					argumentAr.push({
						ARGUMENT_NAME: sectionAr[i].argument_name,
						ARGUMENT_VALUE: decodeURI(this.name),
						PARENT_ENTITY_ID: this.value,
						PARENT_ENTITY_NAME: sectionAr[i].parent_entity_name,
						PARENT_FILTER_NAME: sectionAr[i].argument_name
					});
				});
				$('#individualEncountersTable').find('input:checked').each(function () {
					argumentAr.push({
						ARGUMENT_NAME: sectionAr[i].argument_name,
						ARGUMENT_VALUE: decodeURI(this.name),
						PARENT_ENTITY_ID: this.value,
						PARENT_ENTITY_NAME: 'INDIVIDUALENCOUNTER',
						PARENT_FILTER_NAME: sectionAr[i].argument_name
					});
				});
			} else if (sectionAr[i].argument_name === 'PENDING_WORK') {
				$('#' + sectionAr[i].type + 'Table').find('input:checked').each(function () {
					var $checkbox = $(this);
					argumentAr.push({
						ARGUMENT_NAME: sectionAr[i].argument_name,
						ARGUMENT_VALUE: decodeURI($checkbox.attr('name')),
						ARGUMENT_MEANING: $checkbox.val(),
						PARENT_ENTITY_NAME: 'CODE_VALUE'
					});
				});
			}
			else {
				var assocChecked = false;
				$("#" + sectionAr[i].type + "Table").find("input").each(function(){
					var chkObj = $(this)[0];
					if(chkObj.checked){
						if(sectionAr[i].argument_name == "ASSOC_PROVIDERS") {
							assocChecked = true;
						}
						argumentAr.push({
							ARGUMENT_NAME : sectionAr[i].argument_name,
							ARGUMENT_VALUE : decodeURI(chkObj.name),
							PARENT_ENTITY_ID : chkObj.value,
							PARENT_ENTITY_NAME : sectionAr[i].parent_entity_name,
							PARENT_FILTER_NAME : sectionAr[i].argument_name
						});
					}
				});
				if(sectionAr[i].argument_name == "ASSOC_PROVIDERS" && assocChecked) {
					for(var k = 0, ksize = m_curListSearchArguments.length; k < ksize; k++) {
						var curArg = m_curListSearchArguments[k];
						if(curArg.ARGUMENT_NAME == "PPRCODES") {
							argumentAr.push({
								ARGUMENT_NAME: "ASSOC_RELTN",
								ARGUMENT_VALUE: curArg.ARGUMENT_VALUE,
								PARENT_ENTITY_ID: curArg.PARENT_ENTITY_ID,
								PARENT_ENTITY_NAME: "RELTN_CD",
								PARENT_FILTER_NAME : "ASSOCPROVIDERS"
							});
						}
					}
				}
			}
		}
		return argumentAr;
	};
	function getResultArguments(filterArguments, type) {
		var results;
		switch(type) {
			case "resultFilter1":
				results = 1;
				break;
			case "resultFilter2":
				results = 4;
				break;
			case "resultFilter3":
				results = 7;
				break;
			case "resultFilter4":
				results = 10;
				break;
			case "resultFilter5":
				results = 13;
				break;
		}
		var operator;
		var numResults = $("#filterDivResultText" + type).find(".resultText").length;
		if(numResults > 0)
		{
			for(var l = 0; l < numResults; l++)
			{
				filterArguments.push({
					ARGUMENT_NAME: "RESULT" + results + "_GROUP",
					ARGUMENT_VALUE: type,
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
				});
				operator = $("#" + type + "And").attr("checked") ? "AND" : "OR";

				filterArguments.push({
					ARGUMENT_NAME: "RESULT" + results + "_OPERATOR",
					ARGUMENT_VALUE: operator,
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
				});
				var $event = $("#filterEventset" + l + type);
				var resultString = $event.attr("eventName");
				var resultDisplay = $event.text();
				var $filterChoice = $("#filterResult" + type + l);
				if($filterChoice.hasClass("filterByGroup")){
					$event.data("resultGroupData", $filterChoice.data("resultTextFieldGroupData"));
					var groupData = $event.data("resultGroupData");
					for(var i = 0, groupDataLength = groupData.length; i < groupDataLength; i++){
						filterArguments.push({
							ARGUMENT_NAME: "RESULT" + results + "_EVENTSET",
							ARGUMENT_VALUE: groupData[i].DISPLAY_NAME,
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : resultDisplay,
					PARENT_FILTER_NAME : "RESULT" + results
						});
					}
				}
				else{
					filterArguments.push({
						ARGUMENT_NAME: "RESULT" + results + "_EVENTSET",
						ARGUMENT_VALUE: resultString,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : resultDisplay,
					PARENT_FILTER_NAME : "RESULT" + results
					});
				}
				value = $("#filterValOption" + l + type).text();
				argName = "";
				switch(value) {
					case i18n.rwl.GREATERTHANL:
						argName = "_VALGREATER";
						break;
					case i18n.rwl.GREATERTHANEQL:
						argName = "_VALFROM";
						break;
					case i18n.rwl.LESSTHANL:
						argName = "_VALLESS";
						break;
					case i18n.rwl.LESSTHANEQL:
						argName = "_VALTO";
						break;
					case i18n.rwl.EQUALl:
						argName = "_VALEQUAL";
						break;
				}
				if(value == i18n.rwl.BETWEENL)
				{
					filterArguments.push({
						ARGUMENT_NAME: "RESULT" + results + "_VALFROM",
						ARGUMENT_VALUE: convertNumberInputToValue($("#filterValInput1" + l + type).text()),
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
					});
					filterArguments.push({
						ARGUMENT_NAME: "RESULT" + results + "_VALTO",
						ARGUMENT_VALUE: convertNumberInputToValue($("#filterValInput2" + l + type).text()),
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
					});
				}
				else if(value != i18n.rwl.OFANYVALUE && value != "")
				{
					filterArguments.push({
						ARGUMENT_NAME: "RESULT" + results + argName,
						ARGUMENT_VALUE: convertNumberInputToValue($("#filterValInput1" + l + type).text()),
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
					});
				}
				var input = $("#filterBackTimeInput" + l + type).text();
				var appendName = "";
				switch($("#filterBackTimeOption" + l + type).text())
				{
					case i18n.rwl.DAYSL:
						appendName = "_BACKDAYS";
						break;
					case i18n.rwl.WEEKSL:
						appendName = "_BACKWEEKS";
						break;
					case i18n.rwl.MONTHSL:
						appendName = "_BACKMONTHS";
						break;
				}
				filterArguments.push({
					ARGUMENT_NAME: "RESULT" + results + appendName,
					ARGUMENT_VALUE: input,
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
				});
				value = $("#filterCountOption" + l + type).text();
				argName = "";
				switch(value) {
					case i18n.rwl.LESSTHAN:
						argName = "_COUNTLESS";
						break;
					case i18n.rwl.ATLEAST:
						argName = "_COUNTATLEAST";
						break;
				}
				filterArguments.push({
					ARGUMENT_NAME: "RESULT" + results + argName,
					ARGUMENT_VALUE: $("#filterCountInput" + l + type).text(),
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "RESULT" + results
				});
				results++;
			}
		}
		return filterArguments;
	}
	function getMedArguments(argumentAr)
	{
		var meds = 1;
		var operator;
		var argument_name;
		var id = 0.0;
		var parent_name = "";
		var numMeds = $("#filterDivMedText").add('#filterDivMedClassificationText').find(".medsText").length;
		if(numMeds > 0)
		{
			for(var m = 0; m < numMeds; m++)
			{
				$med = $("#filterMed" + m);
				var $search = $med.find("#filterMedInput" + m);
				argument_name = "";
				id = 0.0;
				parent_name = "";
				if($med.hasClass("drugname"))
				{
					argument_name = "MED" + meds + "_DRUGNAME";
				}
				else
				{
					argument_name = "MED" + meds + "_DRUGCLASSID";
					id = parseFloat($search.attr("value"));
					parent_name = "mltm_drug_categories";
				}
				argumentAr.push({
					ARGUMENT_NAME: argument_name,
					ARGUMENT_VALUE: $search.text(),
					PARENT_ENTITY_ID : id,
					PARENT_ENTITY_NAME : parent_name,
					PARENT_FILTER_NAME : "MEDICATIONS"
				});
				operator = "";
				if($("#medicationsOr").attr("checked"))
				{
					operator = "OR";
				}
				else
				{
					operator = "AND";
				}
				argumentAr.push({
					ARGUMENT_NAME: "MED" + meds + "_OPERATOR",
					ARGUMENT_VALUE: operator,
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "MEDICATIONS"
				});
				$med.find(".filterMedStatus").each(function() {
					argumentAr.push({
						ARGUMENT_NAME: "MED" + meds + "_STATUS",
						ARGUMENT_VALUE: $(this).attr("meaning"),
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : "",
						PARENT_FILTER_NAME : "MEDICATIONS"
					});
				});
				var input = $med.find("#filterMedBackTimeInput" + m).text();
				var appendName = "";
				switch($med.find("#filterMedBackTimeOption" + m).text())
				{
					case i18n.rwl.DAYSL:
						appendName = "_BACKDAYS";
						break;
					case i18n.rwl.WEEKSL:
						appendName = "_BACKWEEKS";
						break;
					case i18n.rwl.MONTHSL:
						appendName = "_BACKMONTHS";
						break;
				}
				argumentAr.push({
					ARGUMENT_NAME: "MED" + meds + appendName,
					ARGUMENT_VALUE: input,
					PARENT_ENTITY_ID : 0.0,
					PARENT_ENTITY_NAME : "",
					PARENT_FILTER_NAME : "MEDICATIONS"
				});
				meds++;
			}
		}
		return argumentAr;
	}
	this.resetFilters = function() {
		var filterArguments = json_parse(m_sLastAppliedFilterChecks);

		this.revertAllSections();
		this.setFilterChecks(filterArguments);
		this.showSelectedFilters();
		this.onFilterModification();
		filterArguments = null;
	};
	this.getResultCount = function(count, type) {
		switch(type) {
			case "resultFilter1":
				count = count - 1;
				break;
			case "resultFilter2":
				count = count - 4;
				break;
			case "resultFilter3":
				count = count - 7;
				break;
			case "resultFilter4":
				count = count - 10;
				break;
			case "resultFilter5":
				count = count - 13;
				break;
		}
		return count;
	};

	this.setFilterChecks = function(filterArguments){
		function isGroupEncounter(id) {
			var groupEncounterIds = [1, 2, 4, 8, 16];
			return $.inArray(id, groupEncounterIds) >= 0;
		}
		function log2(val) {
			return Math.log(val || 0)/Math.log(2);
		}

		var argObj = filterArguments;
		var sectionAr = this.m_sections;
		var ageFromValue = '';
		var ageToValue = '';
		var modifiedList = this.m_modifiedList;
		var _this = this;
		var apptFrom = '';
		var apptTo = '';
		var apptDateUnit = '';
		var noAppt = 'false';
		var orderFrom = '';
		var orderTo = '';
		var orderDateUnit = '';
		var sPendingWorkArgName = null;
		var sPendingWorkArgMeaning = null;
		var sSectionType = null;
		var aoSectionWithMatchingArgName = [];
		var $pendingWorkTable = $();
		var S_INVALID_FILTER_ARG = 'Filter argument {{arg}} does not match any declared filter section';
		var S_MULTIPLE_FILTERS_WITH_SAME_ARG = 'Filter argument {{arg}} matches more than one filter section';
		var orderTypes = [];
		var expectations = [];
		var caseManagers = [];
		var rank = '';
		var medHtml = '';
		var currentArgObj = null;
		var argValue = null;
		var argName = null;
		var parentEntityId;
		var $medTextAppendTarget = null;
		var isDrugByName = false;
		var isDrugByClassification = false;
		$('#ageFilterTypeCombo').val(0);
		this.createAgeField('0');
		$('#admissionSinceFilterCombo').val(0);
		this.createAdmissionField('0');
		$('#dischargeSinceFilterCombo').val(0);
		this.createDischargeField();

		for(var k=0, argLength = argObj.length; k<argLength; k++) {
			currentArgObj = argObj[k];
			argName = currentArgObj.ARGUMENT_NAME;
			argValue = currentArgObj.ARGUMENT_VALUE;
			parentEntityId = currentArgObj.PARENT_ENTITY_ID;
			switch(argName) {
				case "QUALIFYING":
					if(argValue == 'still') {
						$("#qualifyingStill").attr("checked", "checked");
					}
					else {
						$("#qualifyingNot").attr("checked", "checked");
					}
					$("#qualifyingTab").addClass("modifiedSection");
					break;
				case "CASEMANAGER":
					caseManagers.push(argObj[k]);
					break;
				case "EXPECTATIONS":
					expectations.push(argObj[k].PARENT_ENTITY_ID);
					break;
				case "ORDERFROM":
					orderFrom = argValue;
					break;
				case "ORDERTO":
					orderTo = argValue;
					break;
				case "ORDERDATEUNIT":
					orderDateUnit = argValue;
					break;
				case "ORDERTYPE":
					orderTypes.push(argObj[k].PARENT_ENTITY_ID);
					break;
				case "APPTFROM":
					apptFrom = argValue;
					break;
				case "APPTTO":
					apptTo = argValue;
					break;
				case "APPTDATEUNIT":
					apptDateUnit = argValue;
					break;
				case 'NOAPPT' :
					noAppt = argObj[k].ARGUMENT_VALUE;
					break;
				case "ADMISSIONDAYS":
					$('#admissionSinceFilterCombo').val(0);
					$('#admissionInput').val(argValue);
					$("#admissionSinceTab").addClass("modifiedSection");
					break;
				case "ADMISSIONWEEKS":
					$('#admissionSinceFilterCombo').val(1);
					$('#admissionInput').val(argValue);
					$("#admissionSinceTab").addClass("modifiedSection");
					break;
				case "ADMISSIONMONTHS":
					$('#admissionSinceFilterCombo').val(2);
					$('#admissionInput').val(argValue);
					$("#admissionSinceTab").addClass("modifiedSection");
					break;
				case 'DISCHARGEDAYS':
					$('#dischargeSinceFilterCombo').val(0);
					$('#dischargeInput').val(argValue);
					$('#dischargeSinceTab').addClass('modifiedSection');
					break;
				case 'DISCHARGEWEEKS':
					$('#dischargeSinceFilterCombo').val(1);
					$('#dischargeInput').val(argValue);
					$('#dischargeSinceTab').addClass('modifiedSection');
					break;
				case 'DISCHARGEMONTHS':
					$('#dischargeSinceFilterCombo').val(2);
					$('#dischargeInput').val(argValue);
					$('#dischargeSinceTab').addClass('modifiedSection');
					break;
				case "AGEGREATER":
					$('#ageFilterTypeCombo').val(0);
					_this.createAgeField("0");
					$('#greaterThanAge').val(argValue);
					$("#ageTab").addClass("modifiedSection");
					break;
				case "AGELESS":
					$('#ageFilterTypeCombo').val(1);
					_this.createAgeField("1");
					$('#lessThanAge').val(argValue);
					$("#ageTab").addClass("modifiedSection");
					break;
				case "AGEEQUAL":
					$('#ageFilterTypeCombo').val(2);
					_this.createAgeField("2");
					$('#equalToAge').val(argValue);
					$("#ageTab").addClass("modifiedSection");
					break;
				case "AGEFROM":
					ageFromValue = argValue;
					break;
				case "AGETO":
					ageToValue = argValue;
					break;
				case "RANKINGFROM":
					rank = argValue;
					if(rank == "" || rank < 0) { //change bad data to default (no search) value
						rank = "0";
					}
					$("#divRanking div.rankContainer.from").trigger("setRank",rank);
					$("#rankingTab").addClass("modifiedSection");
					break;
				case "RANKINGTO":
					rank = argValue;
					if(rank == "" || rank > 5) { //change bad data to default (no search) value
						rank = "5";
					}
					$("#divRanking div.rankContainer.to").trigger("setRank",rank);
					$("#rankingTab").addClass("modifiedSection");
					break;
				case 'PENDING_WORK':
					sPendingWorkArgName = argObj[k].ARGUMENT_NAME;
					aoSectionWithMatchingArgName = $.grep(sectionAr, function(oSection) {
						return oSection.argument_name === sPendingWorkArgName;
					});
					if (aoSectionWithMatchingArgName.length === 0) {
						log.error(S_INVALID_FILTER_ARG.replace('{{arg}}', sPendingWorkArgName));
						throw S_INVALID_FILTER_ARG.replace('{{arg}}', sPendingWorkArgName);
					}
					if (aoSectionWithMatchingArgName.length > 1) {
						log.error(S_MULTIPLE_FILTERS_WITH_SAME_ARG.replace('{{arg}}', sPendingWorkArgName));
						throw S_MULTIPLE_FILTERS_WITH_SAME_ARG.replace('{{arg}}', sPendingWorkArgName);
					}
					sSectionType = aoSectionWithMatchingArgName[0].type;
					$pendingWorkTable = $('#' + sSectionType + 'Table');
					sPendingWorkArgMeaning = argObj[k].ARGUMENT_MEANING;
					$pendingWorkTable
						.find('input[type=checkbox]')
						.not(':checked')
						.each(function() {
							var $pendingWorkCheckbox = $(this),
								bCheckPendingWork = ($pendingWorkCheckbox.val() === sPendingWorkArgMeaning);
							$pendingWorkCheckbox.prop('checked', bCheckPendingWork);
						})
						.end()
						.toggleClass('modifiedSection', $pendingWorkTable.find('input[type=checkbox]:checked').length > 0);
					break;
				case 'ENCOUNTERTYPE':
					parentEntityId = parseInt(parentEntityId, 10);
					if(isGroupEncounter(parentEntityId) === true) {
						$('#encounterType')
							.find('input[type=checkbox][id="Encounter Type' + log2(parentEntityId) + '"]')
								.prop('checked', true)
								.click() // Click event handler requires the checkbox be checked, see addEvents() for more information.
								.prop('checked', true); // Need to re-check the checkbox since it get unchecked on click.
					} else {
						$('#filter' + setEncounterId(argValue))
							.find('input[type=checkbox]:not(:checked)')
								.prop('checked', true);
					}
					break;
			}

			if(apptFrom.length > 0 && apptTo.length > 0 && apptDateUnit.length > 0) {
				var choice = -1,
					$apptTab = $('#appointmentTab'),
					$dateDrop = null,
					$fromDate = null,
					$toDate = null,
					$radio = null;

				switch(apptDateUnit) {
					case 'D':
						choice = 0;
						break;
					case 'W':
						choice = 1;
						break;
					case 'M':
						choice = 2;
						break;
				}

				if(noAppt === 'true') {
					$dateDrop = $apptTab.find('#noApptDateDrop');
					$fromDate = $apptTab.find('#noApptFromDate');
					$toDate = $apptTab.find('#noApptToDate');
					$radio = $apptTab.find('#noApptRadio');
				}
				else {
					$dateDrop = $apptTab.find('#apptDateDrop');
					$fromDate = $apptTab.find('#apptFromDate');
					$toDate = $apptTab.find('#apptToDate');
					$radio = $apptTab.find('#apptRadio');
				}

				$dateDrop.val(choice).change();
				$fromDate.val(apptFrom).keyup();
				$toDate.val(apptTo).keyup();
				$radio.prop('checked', true).change();

				apptFrom = '';
				apptTo = '';
				$apptTab.addClass('modifiedSection');
			}
			if(orderFrom.length > 0 && orderTo.length > 0 && orderDateUnit.length > 0 && orderTypes.length > 0) {
				var ochoice = -1;
				switch(orderDateUnit) {
					case "D":
						ochoice = 0;
						break;
					case "W":
						ochocie = 1;
						break;
					case "M":
						ochoice = 2;
						break;
				}
				$("#orderDateDrop").val(ochoice).change();
				$("#orderFromDate").val(orderFrom).keyup();
				$("#orderToDate").val(orderTo).keyup();
				var $orderTab = $("#orderTab");
				for(var ot = 0, otlen = orderTypes.length; ot < otlen; ot++) {
					$orderTab.find("option[value=" + orderTypes[ot] + "]").attr("selected", true);
				}
				orderFrom = "";
				orderTo = "";
				$orderTab.addClass("modifiedSection");
				$orderTab = null;
			}
			isDrugByName = argName.indexOf('_DRUGNAME') > -1;
			isDrugByClassification = argName.indexOf('_DRUGCLASSID') > -1;
			if (isDrugByName === true || isDrugByClassification === true) {
				var medindex = argName.indexOf('_');
				var medArg = argName.substring(0, medindex);
				var medcount = medArg.substring(medArg.length - 1) - 1;
				if (isDrugByClassification && $('#filterDivMedClassificationHeader').length === 0) {
					medHtml += '<h3 id="filterDivMedClassificationHeader">' + i18n.rwl.CLASSIFICATION + i18n.rwl.COLON + '</h3>';
				}
				medHtml += '<div id="filterMed' + medcount + '" class="resultMedPadding resultMedWidth medsText' + createMedString(argObj, medArg, 'filter', medcount);
				$medTextAppendTarget = isDrugByName ? $('#filterDivMedText') : $('#filterDivMedClassificationText');
				$medTextAppendTarget.append(medHtml);
				$('#medicationsTab').addClass('modifiedSection');
			} else if (argName.indexOf("_GROUP") > -1) {
				var type = argValue.substring(argValue.length - 1);
				type = "resultFilter" + type;
				var index = argName.indexOf('_');
				var resultArg = argName.substring(0, index);
				var resultCount;
				if (resultArg.substring(6,resultArg.length)<10) {
					resultCount = this.getResultCount(resultArg.substring(resultArg.length - 1), type);
			    }
			    else {
			    	resultCount = this.getResultCount(resultArg.substring(resultArg.length - 2), type);
			    }
				var $textField = $("#filterResultType" + type);
				var $resultField = $("#filterDivResultText" + type);
				var resultsAdded = $resultField.find(".resultText").length;
				var resulthtml = "<div id='filterResult" + type + resultCount +  "' class='resultMedPadding resultMedWidth resultText'>" + createResultString(argObj, resultArg, resultCount, type, "filter") + "</div>";
			 	$resultField.append(resulthtml);
				if ($("#filterEventset" + resultCount + type).hasClass("selectedGroup")) {
					$("#filterResult" + type + resultCount).data("resultTextFieldGroupData", $textField.data("typeFieldGroupData")).addClass("filterByGroup");
				}
				m_filterObj.revertResultsSection(0, type);
				resultsAdded++;
				if (resultsAdded === 3) {
					$("#" + type + "Select").find(".filterResult" + type).hide();
					$textField.attr("disabled","disabled");
				}
				$("#" + type + "Tab").addClass("modifiedSection");
			}
		}
		if(ageFromValue.length > 0 && ageToValue.length > 0) {
			$('#ageFilterTypeCombo').val(3);
			this.createAgeField("3");
			$("#rangeFromAge").val(ageFromValue);
			$("#rangeToAge").val(ageToValue);
			$("#ageTab").addClass("modifiedSection");
		}
		if(caseManagers.length > 0) {
			var sorted = alphaSort(caseManagers, "ARGUMENT_VALUE");
			var html = "";
			var sName = "";
			var dPrsnlId = 0.0;
			for(var s = 0, slen = sorted.length; s < slen; s++) {
				sName = sorted[s].ARGUMENT_VALUE;
				dPrsnlId = sorted[s].PARENT_ENTITY_ID;
				html += "<tr><td><label><input class='cvFilterInput hidden-checkbox' name='" + encodeURI(sName) + "' value='" + dPrsnlId +
							"' type='checkbox' checked='true' /><span>" + sName + "</span></label></td></tr>";
			}
			$("#caseManagerTable").append(html);
			$("#caseManagerTab").addClass("modifiedSection");
		}
		var expectLength = expectations.length;
		if(expectLength > 0) {
			var $expectDrop = $("#filterExpectationsDrop");
			for(var e = 0, elen = expectLength; e < elen; e++) {
				$expectDrop.find("option[value=" + expectations[e] + "]").attr("selected", true);
			}
			$("#expectationTab").addClass("modifiedSection");
			$expectDrop = null;
		}

		for(var j=0; j<sectionAr.length; j++) {

			if (sectionAr[j].argument_name === 'PENDING_WORK' ||
				sectionAr[j].argument_name === 'ENCOUNTERTYPE') {
				continue;
			}
			$('#' + sectionAr[j].type + 'Table').find('input').not('.admitDischargeFilterField').not('.ageFilterField').each(function(){
				var chkObj = $(this)[0];
				chkObj.checked = false;
				for(var i=0;i<argObj.length;i++){
					if((argObj[i].ARGUMENT_NAME == sectionAr[j].argument_name ||
							(argObj[i].ARGUMENT_NAME == "RECOMMSTATUS" && sectionAr[j].argument_name == "EXPECTATIONS")) &&
							(argObj[i].PARENT_ENTITY_ID == chkObj.value)){
						chkObj.checked = true;
						$("#" + sectionAr[j].type + "Tab").addClass("modifiedSection");
						break;
					}
				}
				var tableId = sectionAr[j].type + "Table";
				for(var k=0;k<modifiedList.length;k++) {
					if((modifiedList[k].PATIENT_LIST_ID == _this.m_selectedPatientListID) && (modifiedList[k].REF_NODE_ID==tableId) && (modifiedList[k].ELEMENT == chkObj.value)){
						chkObj.checked = modifiedList[k].NEW_VALUE;
						$("#" + sectionAr[j].type + "Tab").addClass("modifiedSection");
						return;
					}
				}
			});
		}

		if(noAppt === 'true') {
			_this.revertYesApptSection();
		}

		argObj = null;
		sectionAr = null;
		modifiedList = null;
		_this = null;
		orderTypes = null;
		expectations = null;
		caseManagers = null;
	};

	this.refreshSavedListDrop = function(){
		var _this = this;

		var $element = $("#filterToolbarListSelectDrop");
		var $list = $("<table id='tablePatientLists' class = 'filterToolbarDropTable'></table>");
		for(var i=0, savedListsLength = _this.m_savedLists.length;i < savedListsLength;i++) {
			var listName = _this.m_savedLists[i].PATIENT_LIST_NAME;
			if(_this.m_selectedPatientListID == _this.m_savedLists[i].PATIENT_LIST_ID){
				$("#filterToolbarListName").text(listName).attr("listID", _this.m_savedLists[i].PATIENT_LIST_ID);
				$("#filterToolbarListDetails").html(i18n.rwl.DETAILS);
			} else {
				var addClassVal = "";
				if($.inArray(_this.m_savedLists[i].PATIENT_LIST_ID, _this.m_inaccessibleListArr) != -1) {
					addClassVal = "italics";
				}
				$list.append($("<tr id='trPL_" + _this.m_savedLists[i].PATIENT_LIST_ID + "'></tr>")
						.append($("<td></td>").append(
								$("<span class='listNameDrop'></span>").addClass(addClassVal).text(listName),
								$("<span id='plDetailId" + _this.m_savedLists[i].PATIENT_LIST_ID + "' class='listDetails'>" + i18n.rwl.DETAILS + "</span>"))));
			}
		}
		$element.empty().append($list);

		var listLength = (_this.m_savedLists.length > 12) ? 12 : _this.m_savedLists.length;
		if(listLength > 1 && this.m_defaultPatientListID != -1){
			$element.css("height",$("#tablePatientLists tr").css("height").replace("px","") * (listLength - 1));
		} else if(listLength >= 1 && this.m_defaultPatientListID == -1) {
			$element.css("height",$("#tablePatientLists tr").css("height").replace("px","") * (listLength));
		} else if(listLength == 1 && this.m_defaultPatientListID != -1) {
			$element.css("height",0);
		} else if(listLength == 0) {
			m_controller.setWorklistMessage(i18n.rwl.NOWORKLIST,true, true);  // show worklist message that no lists are created
			$('#wklBodyFixed,#wklBodyScroll,#wklHeaderDiv').hide();
			$("#filterToolbarListSelect").find("span").text("");
		}

		$("#filterToolbarListSelectDrop tr")
			.mousedown(function(){
				_this.updateModificationBuffer(2);
				_this.setActiveList(parseFloat($(this).attr("id").replace("trPL_","")));
			})
			.hover(function(){
				$(this).addClass("selected").find("span.listDetails")
					.mousedown(function(e){
						$("#divPLSearchDetails").removeClass("show");
					})
					.hover(function(e){
						var $elementDiv = $("#divPLSearchDetails");
						$elementDiv.css("top", e.pageY-12);
						$elementDiv.css("left", "332px");
						var patListId = $(this).attr('id').slice(10);
						var offset = e.pageY-44;
						_this.showPatientListDetails(patListId, offset);
						$elementDiv.addClass("show");
					}, function(){
						$("#divPLSearchDetails").removeClass("show");
				});
			}, function(){
				$(this).removeClass("selected");
			});
	};

	this.populateDropdowns = function(){
		var htmlString = "";
		var $element = {};
		var _this = this;
		var ptLists = this.controller.getPatientLists().PLREPLY.PATIENT_LISTS;
		this.addSavedLists(ptLists);
		$("#filterToolbarListSelect")
			.mousedown(function(){
				if(m_filterObj.m_savedLists.length <= 1) {
					return;
				}
				else
				{
					$(this).toggleClass("down");
					$(this).next(".filterToolbarDrop").toggleClass("down");
				}
			})
			.mouseup(function(){
				if(!$(this).next(".filterToolbarDrop")[0]){
					$(this).removeClass("down");

					if($(this).hasClass("")){
						_this.filterList();
					}
				}
			});
		$("#filterToolbarListDetails")
			.hover(function(){
				var $elementDiv = $("#divPLSearchDetails");
				$elementDiv.css("top", "32px");
				$elementDiv.css("left", "10px");
				_this.showPatientListDetails(_this.m_selectedPatientListID, 0);
				$elementDiv.addClass("show");
			}, function(){
				$("#divPLSearchDetails").removeClass("show");
			})
			.mousedown(function(e){
				e.stopPropagation();
			});
	};
	this.saveDefaultSortCriteria = function(defaultSortBy){
		var listrequest = {listrequest:{
						patient_list_id: this.m_selectedPatientListID,
						default_sort_ind:1,
						default_sort_by: defaultSortBy.toString()
					}};

		this.controller.makeCall("mp_dcp_upd_patient_list",listrequest,true,function() {
			m_controller.sortPatientList(defaultSortBy);
			var foundAndUpdated = false;
			for(var i=0,len=m_filterObj.m_savedLists.length;i<len;i++){
				if(m_filterObj.m_selectedPatientListID == m_filterObj.m_savedLists[i].PATIENT_LIST_ID){
					for(var j=0, argsLen=m_filterObj.m_savedLists[i].ARGUMENTS.length; j<argsLen; j++){
						if(m_filterObj.m_savedLists[i].ARGUMENTS[j].ARGUMENT_NAME == "SORTDEFAULT"){
							m_filterObj.m_savedLists[i].ARGUMENTS[j].ARGUMENT_VALUE = defaultSortBy;
							foundAndUpdated = true;
							break;
						}
					}

					if(!foundAndUpdated) {
						m_filterObj.m_savedLists[i].ARGUMENTS.push({
							ARGUMENT_NAME : "SORTDEFAULT",
							ARGUMENT_VALUE : defaultSortBy,
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : ""
						});
						break;
					}
				}
			}


			$('#tableWklDefaultSort tr').each(function() {
				$(this).find('td:first').empty();
			});
			var id = "";
			switch(defaultSortBy) {
				case 1:
					id = "trWklName";
					break;
				case 2:
					id = "trWklRank";
					break;
				case 3:
					id = "trWklQualifiedDate";
					break;
				case 4:
					id = "trWklLastAction";
					break;
			}
			$("#" + id).find('td:first').html("<span><img src='" + staticContentPath + "/images/6432_11.png'/></span>");

			var visiblePatients = m_controller.currentlyDisplayedPatients();
			m_controller.updatePatientCounts(visiblePatients);
			$("#wklOuterDiv")
				.add("#divFilterPanelTopBar")
				.add("#filterShell").css("cursor","default");
		},null,null,null,"sort");
	};
	this.updateColumnPrefs = function(newColDataObj, bRedraw, callingFunction) {
		var columnArgs = [],
			colArgRequest = [];
		var columns = (newColDataObj && newColDataObj.columns) ? newColDataObj.columns : [];
		for(var i = 0, len = columns.length; i < len; i++) {
			col = columns[i];
			var key = col.key;
			var width = col.width;
			var display = col.display === true ? 1 : 0;
			columnArgs.push({
				ARGUMENT_NAME: "COLUMNPREFS",
				ARGUMENT_VALUE: key + ";" + width + ";" + display,
				PARENT_ENTITY_NAME: "",
				PARENT_ENTITY_ID: 0
			});
			colArgRequest.push({
				ARGUMENT_NAME: "COLUMNPREFS",
				ARGUMENT_VALUE: key + ";" + width + ";" + display,
				SEQUENCE: i
			});
		}

		var listrequest = {listrequest:{
				patient_list_id:this.m_selectedPatientListID,
				column_prefs_ind: 1,
				arguments: colArgRequest
			}};
		this.controller.makeCall("mp_dcp_upd_patient_list",listrequest,true,function() {
			if(bRedraw){
				m_controller.setCurrentColData(newColDataObj);
				var worklistItems = m_controller.currentlyDisplayedPatients().slice(0);
				var sort = m_filterObj.getDefaultSortCriteria();
				m_controller.redrawPatientList(worklistItems, sort);
				m_controller.markPatientsAsRemovable();
				m_controller.resetFuzzySearch();
				$("#fuzzySearchInput").keyup();
				m_controller.updatePatientCounts(worklistItems);
			}
			var curListArgs = m_filterObj.getActiveList().ARGUMENTS;
			for(var j = 0, jlen = curListArgs.length; j < jlen; j++) {
				if(curListArgs[j].ARGUMENT_NAME == "COLUMNPREFS") {
					curListArgs.splice(j, 1);
					jlen--;
					j--;
				}
			}
			m_filterObj.getActiveList().ARGUMENTS = curListArgs.concat(columnArgs);
		},null,null,null,callingFunction);
	};
	this.getColumnPrefs = function(listID) {
		var lists = this.m_savedLists,
			columnArgs = [];
		for(var i = 0, len = lists.length; i < len; i++) {
			if(lists[i].PATIENT_LIST_ID == listID) {
				var curListArgs = lists[i].ARGUMENTS;
				for(var j = 0, jlen = curListArgs.length; j < jlen; j++) {
					if(curListArgs[j].ARGUMENT_NAME == "COLUMNPREFS") {
						var prefs = curListArgs[j].ARGUMENT_VALUE;
						var index1 = prefs.indexOf(";");
						var key = prefs.substring(0, index1);
						var index2 = prefs.lastIndexOf(";");
						var width = parseInt(prefs.substring(index1+1, index2), 10);
						var display = parseInt(prefs.substring(index2+1), 10) == 1 ? true : false;
						columnArgs.push({
							key: key,
							width: width,
							display: display
						});
					}
				}
				break;
			}
		}
		lists = null;
		return columnArgs;
	};
	this.getDefaultSortCriteria = function(listId){
		listId = listId || this.m_selectedPatientListID;
		var sortCriteria = 0;
		for(var i=0,len=this.m_savedLists.length;i<len;i++){
			if(listId == this.m_savedLists[i].PATIENT_LIST_ID){
				for(j=0, argsLen=this.m_savedLists[i].ARGUMENTS.length; j<argsLen; j++){
					if(this.m_savedLists[i].ARGUMENTS[j].ARGUMENT_NAME == "SORTDEFAULT"){
						sortCriteria = parseInt(this.m_savedLists[i].ARGUMENTS[j].ARGUMENT_VALUE,10);
						return sortCriteria;
					}
				}
			}
		}
		if(sortCriteria == 0)
			sortCriteria = this.controller.sortCriteria.SORT_BY_NAME;

		return sortCriteria;
	};

	this.addEvents = function(element_type){
		var thisObj = this;

		$("#"+element_type+"Tab").click(function(e){
			if($(e.target).is('a') || $(e.target).is('input') || $(e.target).is('select')){
				return;
			}

			if(((e.target==this && $(e.target).hasClass("filterSelectExpanded")) ||
				($(e.target).hasClass("filterTitle") && $(e.target).parent().attr("id")==$(this).attr("id") && $(this).hasClass("filterSelectExpanded")))) //target is the title text of this element & this element is expanded
			{

				if(thisObj.lastExpandedFilter) {
					if(thisObj.lastExpandedFilter == "admissionSince"){
						$("#divToDateCal").removeClass('show');
						$("#divFromDateCal").removeClass('show');
						if(! thisObj.compareFromToDates($("#inputAdmDateFrom").val(), $("#inputAdmDateTo").val() ))
						{
							alert(i18n.rwl.FROMTODATE); //temporary message for now.
							return;
						}
					}
					thisObj.collapseSelectFilterSection(thisObj.lastExpandedFilter);
					thisObj.showSelectedFilterValues(thisObj.lastExpandedFilter);
					$("#"+thisObj.lastExpandedFilter+"Selected").show();
				}
				thisObj.collapseSelectFilterSection(element_type);
				thisObj.showSelectedFilterValues(element_type);
				$("#"+element_type+"Selected").show();
				thisObj.lastExpandedFilter = element_type;
				return;
			}

			if(thisObj.lastExpandedFilter == "admissionSince" && element_type != "admissionSince") {
				$("#divToDateCal").removeClass('show');
				$("#divFromDateCal").removeClass('show');
				if(! thisObj.compareFromToDates($("#inputAdmDateFrom").val(), $("#inputAdmDateTo").val() ))
				{
					alert(i18n.rwl.FROMTODATE); //temporary message for now.
					return;
				}
			}

			if(thisObj.lastExpandedFilter != element_type) {
				thisObj.collapseSelectFilterSection(thisObj.lastExpandedFilter);
				thisObj.showSelectedFilterValues(thisObj.lastExpandedFilter);
				$("#"+thisObj.lastExpandedFilter+"Selected").show();
			}

			if (element_type === 'encounterType' && $('#individualEncountersTable').find('input:checked').length > 0) {
				showFilterIndividualEncSection();
			}
			$("#"+element_type+"Tab").removeClass("filterSelectCollapsed").addClass("filterTitleBarSelected filterSelectExpanded");
			$("#"+element_type+"Selected").hide();
			$("#"+element_type+"Select").show();
			m_controller.addDynamicFilterToolTip('#'+element_type+'Table > tbody > tr');
			if(element_type === 'expectation' || element_type === 'order'){
				var selectElementId = element_type;
				if (element_type === 'expectation') {
					selectElementId  += 's';
				}else if (element_type === 'order') {
					selectElementId += 'Type';
				}
				truncateMultiSelectOptions($('#'+selectElementId).find('.multiselect'));
			}
			thisObj.lastExpandedFilter = element_type;
		});

		if (element_type === 'encounterType') {
			$('#individualEncounters').find('.individualEncounterHead').on('click', function(event) {
				var $encData = $(this).parent().find('.individualEncounterData');

				if ($encData.is(':visible')) {
					hideFilterIndividualEncSection();
				} else {
					showFilterIndividualEncSection();
				}
				event.stopPropagation();
			});
			$('#encounterTypeTable').on('click', 'input', function(event) {
				var $encounterGroup = $(this),
					individualEnc = $encounterGroup.data('children').split(','),
					groupName = $encounterGroup.attr('name');

				if ($encounterGroup.is(':checked')) {
					disableIndividualEncounters(individualEnc, groupName, true);
				} else {
					enableIndividualEncounter(individualEnc, groupName);
				}
				event.stopPropagation();
			});

			var $filterTooltip = $('#filterTooltip');

			$('#encounterTypeTab')
				.on('mouseenter', '.encounterName', function(event) {
					displayEncounterTooltip($(this), event, $filterTooltip);
				})
				.on('mouseleave', '.encounterName', function() {
					hideTooltip($filterTooltip);
				})
				.on('mouseenter', '.encSummary', function(event) {
					displayEncounterTooltip($(this), event, $filterTooltip);
				})
				.on('mouseleave', '.encSummary', function() {
					hideTooltip($filterTooltip);
				});
		}
	};
	this.collapseSelectFilterSection = function (element_type) {
		_this = this;
		if(element_type) {
			$("#"+element_type+"Select").hide();
			m_controller.removeDynamicFilterToolTip('#'+element_type+'Table > tbody > tr');
			var $elementTypeTab = $("#"+element_type+"Tab")
				.addClass("filterSelectCollapsed filterTitleBar")
				.removeClass("filterSelectExpanded filterTitleBarSelect modifiedSection");

			for(i=0; i<_this.m_sections.length; i++) {
				if(_this.m_sections[i].type == element_type || element_type == 'admissionSince' || element_type === 'dischargeSince'){
					var modified = false;
					var choice;
					switch(element_type){
						case "qualifying":
							if($("#qualifyingStill").attr("checked") || $("#qualifyingNot").attr("checked")) {
								modified = true;
							}
							break;
						case "age":
							$("#"+element_type+"SelectedTable").toggleClass("divInvalidEntryColor", $("#rangeFromAge").hasClass("divInputError"));

							choice = $('#ageFilterTypeCombo').val();
							if(choice != 0 || document.getElementById('greaterThanAge').value != ""){
								modified = true;
							}
							break;
						case 'caseManager':
							modified = $('#caseManagerTable').find('input:checked').length > 0;
							$('#caseManagerFilter').find('input').val('').removeClass('searching');
							break;
						case "admissionSince":
							if($("#admissionInput").hasClass("divInputError")){
								$("#"+element_type+"SelectedTable").addClass("divInvalidEntryColor");
							}
							else{
								$("#"+element_type+"SelectedTable").removeClass("divInvalidEntryColor");
							}
							choice = $('#admissionSinceFilterCombo').val();
							if(choice != 0 || document.getElementById('admissionInput').value != ""){
								modified = true;
							}
							break;
						case 'dischargeSince':
							$('#'+element_type+'SelectedTable').toggleClass('divInvalidEntryColor',$('#dischargeInput').hasClass('divInputError'));
							choice = $('#dischargeSinceFilterCombo').val();
							if(choice !== 0 || document.getElementById('dischargeInput').value !== ''){
								modified = true;
							}
							break;
						case "ranking":
							var $divRanking = $('#divRanking'),
								fromRank = $divRanking.find('div.rankContainer.from').data('rank-value'),
								toRank = $divRanking.find('div.rankContainer.to').data('rank-value');
							if(fromRank != 0 || toRank != 5){
								modified = true;
							}
							break;
						case 'resultFilter1':
						case "resultFilter2":
						case "resultFilter3":
						case "resultFilter4":
						case "resultFilter5":
							this.revertResultsSection(0, element_type);
							modified = $('#filterDivResultText' + element_type).find('.resultText').length > 0;
							break;
						case "medications":
							this.revertMedsSection(0);
							if($("#filterDivMedText").add('#filterDivMedClassificationText').find(".medsText").length > 0)
								modified = true;
							break;
						case "appointment":
							var noAppt = $('input[name="apptStatusRadio"]:checked').val() === 'noAppointment',
								$apptFrom = null,
								$apptTo = null;

							if(noAppt === false) {
								$apptFrom = $('#apptFromDate');
								$apptTo = $('#apptToDate');
							}
							else {
								$apptFrom = $('#noApptFromDate');
								$apptTo = $('#noApptToDate');
							}

							if($apptFrom.val() && $apptTo.val()) {
								if($apptFrom.hasClass("divInputError") || $apptTo.hasClass("divInputError")){
									$("#"+element_type+"SelectedTable").addClass("divInvalidEntryColor");
								}
								else{
									$("#"+element_type+"SelectedTable").removeClass("divInvalidEntryColor");
									if(noAppt === true) {
										modified = true;
									}
								}
								$("#"+element_type+"Table").find("input").each(function() {
									var chkObj = $(this)[0];
									if(!chkObj.disabled && chkObj.checked){
										modified = true;
									}
								});
							}
							break;
						case "order":
							var checked = false;
							var selected = false;
							if($("#orderFromDate").val() && $("#orderToDate").val()) {
								if($("#orderFromDate").hasClass("divInputError") || $("#orderToDate").hasClass("divInputError")){
									$("#"+element_type+"SelectedTable").addClass("divInvalidEntryColor");
								}
								else{
									$("#"+element_type+"SelectedTable").removeClass("divInvalidEntryColor");
								}
								$("#"+element_type+"Table").find("input").each(function() {
									var chkObj = $(this)[0];
									if(!chkObj.disabled && chkObj.checked){
										checked = true;
									}
								});
								$("#filterOrderTypeDrop").find(":selected").each(function() {
									selected = true;
								});

								if(checked && selected) {
									modified = true;
								}
							}
							break;
						case "expectation":
							var echecked = false;
							$("#expectationTable").find("input").each(function() {
								var chkObj = $(this)[0];
								if(chkObj.checked){
									echecked = true;
								}
							});
							if($("#filterExpectationsDrop").find(":selected").length > 0 && echecked) {
								modified = true;
							}
							break;
						case 'encounterType':
							modified = ($('#encounterTypeTable').find(':checked').length > 0 ||
										$('#individualEncountersTable').find(':checked').length > 0);
							if (!modified) {
								hideFilterIndividualEncSection();
							}
							break;
						default:
							 $("#"+element_type+"Table").find("input").each(function() {
								 var chkObj = $(this)[0];
								 if(!chkObj.disabled && chkObj.checked){
									 modified = true;
								 }
							 });
							break;
					}
					if(modified == true){
						$elementTypeTab.addClass("modifiedSection");
						break;
					}
				}
			}
			_this.onFilterModification();
		}
	};

	this.showSelectedFilters = function() {
		for(var m = 2, length = this.m_sections.length; m < length; m++)
		{
			this.showSelectedFilterValues(this.m_sections[m].type);
		}
	};
	this.showSelectedFilterValues = function(element_type) {
		switch(element_type) {
			case 'qualifying':
				$('#'+element_type+'SelectedTable').empty();
				if($('#qualifyingStill').attr('checked')) {
					$('#'+element_type+'SelectedTable').append('<tr><td><label>'+ i18n.rwl.STILLQUALIFYING +'</label></td></tr>');
				}
				else if($('#qualifyingNot').attr('checked')) {
					$('#'+element_type+'SelectedTable').append('<tr><td><label>'+ i18n.rwl.NOTQUALIFYING +'</label></td></tr>');
				}
				break;
			case 'age':
				$("#"+element_type+"SelectedTable").empty();
				var choice = $('#ageFilterTypeCombo').val();
				var value = $("#ageFilterTypeCombo :selected").text();
				var time = $("#filterAgeTimeDrop :selected").text().toLowerCase();
				switch(choice){
				case "0":
					if($("#greaterThanAge").val()) {
						var yearsLabelText = value + " " + $("#greaterThanAge").val() + " " + time;
						$("#"+element_type+"SelectedTable").append("<tr><td><label>"+ yearsLabelText +"</label></td></tr>");
					}
					break;
				case "1":
					if($("#lessThanAge").val()) {
						var yearsLabelText = value + " " + $("#lessThanAge").val() + " " + time;
						$("#"+element_type+"SelectedTable").append("<tr><td><label>"+ yearsLabelText +"</label></td></tr>");
					}
					break;
				case "2":
					if($("#equalToAge").val()) {
						var yearsLabelText = value + " " + $("#equalToAge").val() + " " + time;
						$("#"+element_type+"SelectedTable").append("<tr><td><label>"+ yearsLabelText +"</label></td></tr>");
					}
					break;
				case "3":
					var ageFromRange = $("#rangeFromAge");
					var ageToRange = $("#rangeToAge");
					if(ageFromRange.val() && ageToRange.val()) {
						var yearsLabelText = i18n.rwl.AGERANGE.replace("{3}",ageFromRange.val());
						yearsLabelText = yearsLabelText.replace("{4}",ageToRange.val());
						yearsLabelText = yearsLabelText.replace(/\{36\}/g, time);
						$("#"+element_type+"SelectedTable").append("<tr><td><label>" + yearsLabelText + "</label></td></tr>");
					}
					ageFromRange = null;
					ageToRange = null;
					break;
				}
				break;
			case 'admissionSince':
				$("#"+element_type+"SelectedTable").empty();
				if($("#admissionInput").val()) {
					$("#admTitle").html(i18n.rwl.ADMISSIONRANGE);
					$("#"+element_type+"SelectedTable").append("<tr><td><label><span>" + i18n.rwl.PAST + " </span>"+$("#admissionInput").val()+" "+$("#admissionSinceFilterCombo :selected").text()+"</label></td></tr>");
				}
				break;
			case 'dischargeSince':
				$('#'+element_type+'SelectedTable').empty();
				if($('#dischargeInput').val()) {
					$('#dischTitle').text(i18n.rwl.DISCHARGERANGE);
					$('#'+element_type+'SelectedTable').append('<tr><td><label><span>' + i18n.rwl.PAST + ' </span>'+$('#dischargeInput').val()+' '+$('#dischargeSinceFilterCombo :selected').text()+'</label></td></tr>');
				}
				break;
			case 'ranking':
				$("#"+element_type+"SelectedTable").empty();

				var fromRank = $("#divRanking div.rankContainer.from").data('rank-value');
				var toRank = $("#divRanking div.rankContainer.to").data('rank-value');

				if(fromRank==0 && toRank==5){
					break;
				}

				var imgOffDot = "/images/Rating_Off.png";
				var imgOnDot = "/images/Rating_On.png";

				var htmlString = "";
				htmlString += "<tr><td><label class='displayInline'>From <div class='displayInline' >";
				for (var i=1; i<=5; i++)
				{
					if(i<=fromRank)
						htmlString += "<img class ='displayInline' src='" + staticContentPath + imgOnDot + "'/>";
					else
						htmlString += "<img class ='displayInline' src='" + staticContentPath + imgOffDot + "'/>";
				}
				htmlString += "</div>&nbsp &nbsp To <div class='displayInline'>";
				for (var j=1; j<=5; j++)
				{
					if(j<=toRank)
						htmlString += "<img class ='displayInline' src='" + staticContentPath + imgOnDot + "'/>";
					else
						htmlString += "<img class ='displayInline' src='" + staticContentPath + imgOffDot + "'/>";
				}
				htmlString += "</div></label></td></tr>";
				$("#"+element_type+"SelectedTable").append(htmlString);
				break;
			case 'resultFilter1':
			case 'resultFilter2':
			case 'resultFilter3':
			case 'resultFilter4':
			case 'resultFilter5':
				$("#"+element_type+"SelectedTable").empty().append(this.getResultsText(1, element_type));
				break;
			case 'medications':
				$("#"+element_type+"SelectedTable").empty().append(this.getMedsText(1));
				break;
			case 'appointment':
				$("#"+element_type+"SelectedTable").empty();
				htmlString = "";
				var noAppt = ($('input[name="apptStatusRadio"]:checked').val() === 'noAppointment'),
					from,
					to,
					drop,
					dropVal;

				if (noAppt === true) {
					from = $('#noApptFromDate').val();
					to = $('#noApptToDate').val();
					drop = $('#noApptDateDrop :selected').text().toLowerCase(),
					dropVal = $('#noApptDateDrop').val();
				}
				else {
					from = $('#apptFromDate').val();
					to = $('#apptToDate').val();
					drop = $('#apptDateDrop :selected').text().toLowerCase(),
					dropVal = $('#apptDateDrop').val();

					$("#"+element_type+"Table input").each(function() {
						var chkObj = $(this)[0];
						if(chkObj.checked){
							htmlString += decodeURI(chkObj.name) + ", ";
						}
					});
				}
				var apptIndex = htmlString.lastIndexOf(",");
				if(m_controller.isAppointmentInputValid(from, to, dropVal) && (htmlString.length > 0 || noAppt === true)) {
					var statusString = (noAppt === true) ? i18n.rwl.NOAPPTSTR : i18n.rwl.APPTSTATUSSTR.replace("{13}",htmlString.substring(0, apptIndex));
					statusString = statusString.replace("{14}",from);
					statusString = statusString.replace("{15}",drop);
					statusString = statusString.replace("{16}",to);
					statusString = statusString.replace("{17}",drop);

					htmlString = "<tr><td><label>" + statusString;
					htmlString += "</label></td></tr>";
					$("#"+element_type+"SelectedTable").append(htmlString);
				}
				else {
					this.revertApptSection();
				}
				break;
			case 'order':
				$("#"+element_type+"SelectedTable").empty();
				htmlString = "";
				checked = "";
				selected = "";
				var ofrom = $("#orderFromDate").val();
				var oto = $("#orderToDate").val();
				var odrop = $("#orderDateDrop :selected").text().toLowerCase();
				$("#"+element_type+"Table input").each(function() {
					var chkObj = $(this)[0];
					if(chkObj.checked){
						checked += decodeURI(chkObj.name)+", ";
					}
				});
				var orderStatusIndex = checked.lastIndexOf(",");
				$("#filterOrderTypeDrop :selected").each(function() {
					selected += $(this).text() + ", ";
				});
				var orderTypeIndex = selected.lastIndexOf(",");
				if(ofrom && oto && checked.length > 0 && selected.length > 0) {
					htmlString = "<tr><td><label>";

					var orderStatsString = i18n.rwl.ORDERSTATUSSTR.replace("{7}",checked.substring(0, orderStatusIndex));
					orderStatsString = orderStatsString.replace("{8}",selected.substring(0, orderTypeIndex));
					orderStatsString = orderStatsString.replace("{9}",ofrom);
					orderStatsString = orderStatsString.replace("{10}",odrop);
					orderStatsString = orderStatsString.replace("{11}",oto);
					orderStatsString = orderStatsString.replace("{12}",odrop);

					htmlString += orderStatsString;

					htmlString += "</label></td></tr>";
					$("#"+element_type+"SelectedTable").append(htmlString);
				}
				else {
					this.revertOrderSection();
				}
				break;
			case "expectation":
				$("#"+element_type+"SelectedTable").empty();
				var $selected = $("#filterExpectationsDrop :selected");
				var checked =[];
				var expectationSelected=[];
				$("#expectationTable input").each(function() {
					var chkObj = $(this)[0];
					var siblingSpanText = $(this).siblings("span").text();
					if(chkObj.checked) {
						checked.push(siblingSpanText);
					}
				});
				if($selected.length > 0 && checked.length > 0) {
					
					$selected.each(function() {
						expectationSelected.push($(this).attr('fulltext'));

					});
				    var summaryText= m_controller.setSummaryContent(expectationSelected,checked);
					$("#"+element_type+"SelectedTable").append("<tr><td><label>" + summaryText + "</label></td></tr>");
					$selected = null;
				}
				else {
					this.revertExpectationsSection();
				}
				break;
			case 'encounterType':
				if($('#encounterTypeTab').hasClass('filterSelectExpanded') === true) {
					break;
				}
				var html = '',
					selectedGroupEnc = [],
					selectedIndividualEnc = [],
					$summaryDiv = $('#' + element_type + 'Selected'),
					$summaryTable = $('#' + element_type + 'SelectedTable');

				$('#' + element_type + 'Table').find('input:checked').each(function () {
					selectedGroupEnc.push({grpName: decodeURI($(this).prop('name')), children: $(this).data('children')});
				});

				$('#individualEncountersTable').find('input:checked').each(function () {
					var $encounterLabel = $(this).closest('label');
					if ($encounterLabel.find('.encGroups').is(':empty')) {
						selectedIndividualEnc.push({encName: decodeURI($(this).prop('name'))});
					}
					$encounterLabel = null;
				});
				if (selectedIndividualEnc.length > 0) {
					alphaSort(selectedIndividualEnc, 'encName');
				}

				var numOfGroups = selectedGroupEnc.length,
					numOfIndividualEncs = selectedIndividualEnc.length;
				if (numOfGroups || numOfIndividualEncs) {
					$summaryDiv.show();
					if (numOfGroups) {
						html += '<tr><td class="appliedFilterTypeHeader"><span>' + i18n.rwl.GROUPENCOUNTERSHEADER + '</span></td></tr>';
						for (var x=0, grpEncLen=numOfGroups; x < grpEncLen; x++) {
							html += '<tr>' +
										'<td class="encounterSummaryList">' +
											'<span class="encSummary" data-children="' + selectedGroupEnc[x].children +'">' + selectedGroupEnc[x].grpName + '</span>' +
										'</td>' +
									'</tr>';
						}
					}
					if (numOfIndividualEncs) {
						html += '<tr><td class="appliedFilterTypeHeader"><span>' + i18n.rwl.INDIVIDUALENCOUNTERSHEADER + '</span></td></tr>';
						for (var x=0, iLength=numOfIndividualEncs; x < iLength; x++) {
							html += '<tr>' +
										'<td class="encounterSummaryList">' +
											'<span class="encSummary" data-type="INDIVIDUAL" value="' + selectedIndividualEnc[x].encName + '">' + selectedIndividualEnc[x].encName + '</span>' +
										'</td>' +
									'</tr>';
						}
					}
					$summaryTable.html(html);
				}
				else {
					$summaryDiv.hide();
					$summaryTable.empty();
				}
				selectedGroupEnc = null;
				selectedIndividualEnc = null;
				$summaryDiv = null;
				$summaryTable = null;
				break;
			default:
				var viewLinkText = "";
				if($("#"+element_type+"ViewAll").length > 0) {
					viewLinkText = $("#"+element_type+"ViewAll").text();
				}

				var k = 0;
				$("#"+element_type+"SelectedTable").empty();
				$("#"+element_type+"Table input").each(function() {
					var chkObj = $(this)[0];
					if(chkObj.checked){
						if(k<8) {
							$("#"+element_type+"SelectedTable").append("<tr><td><label>"+escapeHtmlString(decodeURI(chkObj.name))+"</label></td></tr>");
						} else {
							if(viewLinkText == i18n.rwl.VIEWLESS) {
								$("#"+element_type+"SelectedTable").append("<tr class='hiddenRow displayedRow'><td><label>"+escapeHtmlString(decodeURI(chkObj.name))+"</label></td></tr>");
							} else {
								$("#"+element_type+"SelectedTable").append("<tr class='hiddenRow'><td><label>"+escapeHtmlString(decodeURI(chkObj.name))+"</label></td></tr>");
							}
						}
						k++;
					}
					chkObj = null;
				});
				if(k>7) {
						viewLinkText = (viewLinkText == "" ? i18n.rwl.VIEWLINKTEXT : viewLinkText);
						$("#"+element_type+"SelectedTable").append("<tr><td><a id='"+element_type+"ViewAll' href=''>"+viewLinkText+"</a></td></tr>");
				}
				$("#"+element_type+"ViewAll").click(function (event)  {
					$("#"+element_type+"SelectedTable tr").each(function(){
						if($(this).hasClass("hiddenRow")) {
							$(this).toggleClass("displayedRow");
						}
					});
					$(this).text($(this).text() == i18n.rwl.VIEWLINKTEXT ? i18n.rwl.VIEWLESS : i18n.rwl.VIEWLINKTEXT);
					return false;
				});
		}
	};
	this.getMedsText = function(getAddedText, medCount)	{
		function appendMedTextFrom(medsTextElem) {
			var htmlString = '';
			htmlString += '<tr><td><label>';
			htmlString += $(medsTextElem).text();
			htmlString += '</label></td></tr>';
			return htmlString;
		}
		var htmlString = '';
		var $medsByName = $('#filterDivMedText').find('.medsText');
		var $medsByClassification = $('#filterDivMedClassificationText').find('.medsText');
		var $medInput = null;
		if(getAddedText == 1) {
			$.each($medsByName, function(index, medsTextElem) {
				htmlString += appendMedTextFrom(medsTextElem);
			});
			if ($medsByClassification.length > 0) {
				htmlString += '<tr><td class="appliedFilterTypeHeader"><span>' + i18n.rwl.CLASSIFICATION + i18n.rwl.COLON + '</span></td></tr>';
				$.each($medsByClassification, function(index, medsTextElem) {
					htmlString += appendMedTextFrom(medsTextElem);
				});
			}
		} else {
			$medInput = $('#filterMedSearchInput');
			if($medInput.val())
			{
				var statusCount = 0;
				var med = $medInput.val();
				var days = $('#filterMedTimeInput').val();
				var daysDrop = $('#filterMedTimeDrop :selected').text();
				htmlString += '<tr><td><label>';
				htmlString += '<span id ="filterMedInput' + medCount + '" value="' + $medInput.attr('med_id') + '">' + med + '</span> ' + i18n.rwl.MEDINPUTTEXT + ' ';
				$('#filterMedStatusDrop :selected').each(function() {
					htmlString += '<span class="filterMedStatus" meaning="' + $(this).attr('meaning') + '">' + $(this).text().toLowerCase() + '</span>, ';
					statusCount++;
				});
				htmlString += i18n.rwl.INTHELAST + ' <span id ="filterMedBackTimeInput' + medCount + '">' + days + '</span> <span id="filterMedBackTimeOption' + medCount + '">' + daysDrop.toLowerCase() + '</span>';
				htmlString += '</label></td></tr>';
			}
		}
		$medInput = null;
		return htmlString;
	};
	this.getResultsText = function(getAddedText, type, resultCount)
	{
		var htmlString = "";
		if(getAddedText == 1)
		{
			for(var i = 0, numResults = $("#filterDivResultText" + type).find(".resultText").length; i < numResults; i++)
			{
				htmlString += "<tr><td><label>";
				htmlString += $("#filterResult" + type + i).text();
				htmlString += "</tr></td></label>";
			}
		}
		else {
			var $filterResultType = $("#filterResultType" + type);
			if($filterResultType.val())
			{
				var resultType = $filterResultType.val();
				var eventName = $filterResultType.attr("eventName");
				var resultsDrop = $("#filterResultsCountDrop" + type + " :selected").text();
				var resultsInput = $("#filterResultsCountInput" + type).val();
				var valueDrop = $("#filterValueDrop" + type + " :selected").text();
				var valueInput1 = $("#filterValueInput1" + type).val();
				var valueInput2 = $("#filterValueInput2" + type).val();
				var daysInput = $("#filterResultTimeInput" + type).val();
				var daysDrop = $("#filterResultTimeDrop" + type + " :selected").text();
				htmlString += "<tr><td><label>";
				htmlString += "<span id ='filterCountOption" + resultCount + type + "'>" + resultsDrop + "</span> <span id='filterCountInput" + resultCount + type + "'>" + resultsInput + "</span>";
				htmlString += " <span id ='filterEventset" + resultCount + type + "' eventName='" + eventName + "'>" + resultType + "</span>";

				if(valueDrop) {
					if(valueDrop == i18n.rwl.ANY) {
						htmlString += " <span id ='filterValOption" + resultCount + type + "'>" + i18n.rwl.OFANYVALUE + "</span>";
					}
					else if(valueDrop == i18n.rwl.BETWEEN) {
						htmlString += " <span id ='filterValOption" + resultCount + type + "'>" + i18n.rwl.BETWEENL + "</span> <span id='filterValInput1" + resultCount + type + "'>" + valueInput1 + "</span> and <span id='filterValInput2" + resultCount + type + "'>" + valueInput2 + "</span>";
					}
					else {
						htmlString += " <span id ='filterValOption" + resultCount + type + "'>" + valueDrop.toLowerCase() + "</span> <span id='filterValInput1" + resultCount + type + "'>" + valueInput1 + "</span>";
					}
				}
				htmlString += " " + i18n.rwl.INTHELAST + " <span id='filterBackTimeInput" + resultCount + type + "'>" + daysInput + "</span> <span id='filterBackTimeOption" + resultCount + type + "'>" + daysDrop.toLowerCase() + "</span>";
				htmlString += "</label></td></tr>";
			}
		}
		$filterResultType = null;
		return htmlString;
	};

	this.loadFilterValues = function(){
		if(m_controller.replyFromFilterValues) {
			m_filterValues = m_controller.replyFromFilterValues;
		} else {
			m_filterValues = m_filterValues;
			m_bLoadFailed = true;
		}
	};

	this.getConditionArguments = function(getUncheckedAndChecked) {
		var filtersToReturn = [];
		var filters = m_filterValues.FILTER_LIST;
		for(var i = 0, sz = filters.length; i < sz; i++) {
			var filter = filters[i];
			if(filter.ARGUMENT_NAME == "CONDITION") {
				for(var k = 0, kSz = filter.AVAILABLE_VALUES.length; k < kSz; k++) {
					var availableArgument = filter.AVAILABLE_VALUES[k];
					if(getUncheckedAndChecked == true || $("#conditionTable").find("input[value='"+availableArgument.PARENT_ENTITY_ID+"']:checked").length > 0) {
						if(availableArgument.CHILD_VALUES)
						{
							filtersToReturn.unshift({ARGUMENT_NAME : filter.ARGUMENT_NAME,
								ARGUMENT_VALUE : availableArgument.ARGUMENT_VALUE,
								PARENT_ENTITY_ID : availableArgument.PARENT_ENTITY_ID,
								PARENT_ENTITY_NAME : availableArgument.PARENT_ENTITY_NAME,
								CHILD_ARGUMENTS: availableArgument.CHILD_VALUES});
						}
						else
						{
							filtersToReturn.push({ARGUMENT_NAME : filter.ARGUMENT_NAME,
								ARGUMENT_VALUE : availableArgument.ARGUMENT_VALUE,
								PARENT_ENTITY_ID : availableArgument.PARENT_ENTITY_ID,
								PARENT_ENTITY_NAME : availableArgument.PARENT_ENTITY_NAME,
								CHILD_ARGUMENTS: availableArgument.CHILD_VALUES});
						}
					}
				}
				break;
			}
		}
		if(filtersToReturn.length > 1)
		{
			var operator = "";
			if($("#conditionOr").attr("checked"))
			{
				operator = "OR";
			}
			else
			{
				operator = "AND";
			}
			filtersToReturn.push({
				ARGUMENT_NAME: "CONDITION_OPERATOR",
				ARGUMENT_VALUE: operator,
				PARENT_ENTITY_ID : 0.0,
				PARENT_ENTITY_NAME : "",
				PARENT_FILTER_NAME : "CONDITIONS"
			});
		}
		return filtersToReturn;
	};

	this.uncheckFilterSection = function(section) {
		if (section === 'condition') {
			$('#' + section + 'Or').attr('checked', 'checked');
		}

		$('#' + section + 'Table').find('input').each(function() {
			$input = $(this);
			if ($input.is(':disabled')) {
				return;
			}

			if ($input.attr('type') === 'radio' && $input.prop('defaultChecked') && !$input.is(':checked')) {
				$input.attr('checked', true);
			} else {
				$input.attr('checked', false);
			}
		});

		if (section === 'encounterType') {
			$('#individualEncountersTable').find('input:checked').each(function() {
				var $encounterLabel = $(this).closest('label');
				resetIndEncSelections($encounterLabel);
			});
		}

		$('#' + section + 'Tab').removeClass('modifiedSection');
	};

	this.revertAgeSection = function(){
		$('#ageFilterTypeCombo').val(0);
		this.createAgeField("0");

		$("#ageTab").removeClass("modifiedSection");
	};

	this.revertAdmissionSection = function(){
		this.createAdmissionField("0");
		$('#admissionSinceFilterCombo').val(0);
		$("#divAdmissionMax").text(i18n.rwl.DAYSMAX).removeClass('divAdmissionMaxColor');
		$("#admissionInput").removeClass("divInputError");

		$("#admissionSinceTab").removeClass("modifiedSection");
	};

	this.revertDischargeSection = function(){
		this.createDischargeField();
		$('#dischargeSinceFilterCombo').val(0);
		$('#divDischargeMax').text(i18n.rwl.DAYSMAX).removeClass('divAdmissionMaxColor');
		$('#dischargeInput').removeClass('divInputError');
		$('#dischargeSinceTab').removeClass('modifiedSection');
	};

	this.revertRankingSection = function(){
		$("#divRanking").find("div.rankContainer.from").trigger("setRank",0);
		$("#divRanking").find("div.rankContainer.to").trigger("setRank",5);

		$("#rankingTab").removeClass("modifiedSection");

	};

	this.revertExpectationsSection = function() {
		$("#filterExpectationsDrop :selected").removeAttr("selected");
		this.uncheckFilterSection("expectation");
	};

	this.revertCaseMgrSection = function() {
		$(".searchCtrlInput").val("");
		$("#caseManagerTable").empty().removeData();
		this.uncheckFilterSection("caseManager");
	};
	this.revertApptSection = function() {
		this.revertYesApptSection();
		this.revertNoApptSection();
		$('#apptDateDrop').val('0').change();
		$('#noApptDateDrop').val('0').change();
		$('#apptRadio').add('#noApptRadio').prop('checked', false);
		this.onFilterModification();
	};
	this.revertYesApptSection = function () {
		$('#appointmentTab').find('.apptDate').val('0').removeClass('divInputError');
		$('#filterApptTimeMax').removeClass('divAdmissionMaxColor').addClass('maxDaysLimit').text(i18n.rwl.DAYSMAX);
		$('#apptDateDrop').val('0');
		this.uncheckFilterSection('appointment');
		$('#apptRadio').prop('checked', false);
	};
	this.revertNoApptSection = function () {
		$('#appointmentTab').find('.noApptDate').val('0').removeClass('divInputError');
		$('#filterNoApptTimeMax').removeClass('divAdmissionMaxColor').addClass('maxDaysLimit').text(i18n.rwl.DAYSMAX);
		$('#noApptDateDrop').val('0');
		$('#noApptRadio').prop('checked', false);
	};

	this.revertOrderSection = function() {
		$("#orderDateDrop").val("0").change();
		$("#orderTab").find(".orderDate").val("0");
		$("#filterOrderTypeDrop :selected").removeAttr("selected");
		this.uncheckFilterSection("order");
	};
	this.revertMedsSection = function(revertAddedText) {
		var $medsInput = $('#filterMedSearchInput');
		if(revertAddedText == 1)
		{
			var $medText = $('#filterDivMedText').add('#filterDivMedClassificationText').find('.medsText');
			if($medText.length == 3) {
				$("#medicationsSelect").find(".filterMed").show();
			}
			$medText.remove();
			$medsInput.removeAttr("disabled");
			$("#medicationsOr").attr("checked", "checked");
			$('#filterDivMedClassificationHeader').addClass('hidden');
		}
		toggleLoadingIndicator($medsInput, 'search');
		$("#filterMedSearchList").remove();
		$("#filterMedSearchName").attr("checked","checked");
		$medsInput.val('');
		$("#filterMedStatusDrop").attr("disabled","disabled").val(0);
		$("#filterMedTimeInput").attr("disabled","disabled").val("").removeClass("divInputError");
		$("#filterMedTimeDrop").attr("disabled","disabled").val(3);
		$("#filterMedTimeMax").empty().removeClass("divAdmissionMaxColor");
		$("#filterMedsAddBut").attr("disabled","disabled").addClass("addButdisabled");
		$("#medicationsTab").removeClass("modifiedSection");
	};
	this.revertResultsSection = function(revertAddedText, type) {
		var $filterResultType = $('#filterResultType' + type);

		if(revertAddedText == 1)
		{
			var $resultText = $("#filterDivResultText" + type).find(".resultText");
			if($resultText.length == 3) {
				$("#" + type + "Select").find(".filterResult" + type).show();
			}
			$resultText.remove();
			$filterResultType.removeAttr('disabled');
			$("#" + type + "Or").attr("checked", "checked");
		}

		toggleLoadingIndicator($filterResultType, 'search');
		$("#filterResultOptionList" + type).remove();
		$("#filterResultsCountDrop" + type).val(2).attr("disabled","disabled");
		$("#filterResultsCountInput" + type).val("").attr("disabled","disabled");
		$filterResultType.val('');
		var $valueDrop = $("#filterValueDrop" + type);
		if($valueDrop.val() < 7)
		{
			$("#filterValueInputs" + type).remove();
			$valueDrop.val(7);
			$valueDrop.width("93%");
		}
		$valueDrop.attr("disabled","disabled");
		$("#filterResultTimeInput" + type).val("").attr("disabled","disabled").removeClass('divInputError');
		$("#filterResultTimeDrop" + type).val(3).attr("disabled","disabled");
		$("#filterResultTimeMax" + type).empty().removeClass('divAdmissionMaxColor');
		$("#filterResultsAddBut" + type).attr("disabled","disabled").addClass("addButdisabled");
		$("#" + type + "Tab").removeClass("modifiedSection");
	};

	this.revertQualifyingSection = function() {
		$("#qualifyingAll").attr("checked", "checked");
		$("#qualifyingTab").removeClass("modifiedSection");
	};

	this.revertAllSections = function(){
		var _this = this;
		for(i=0;i<_this.m_sections.length;i++){
			var section = _this.m_sections[i];
			if(section.parent_entity_name == "PARAMETER"){
				continue;
			}
			else{
				switch(section.type){
					case "qualifying":
						_this.revertQualifyingSection();
						break;
					case "age":
						_this.revertAgeSection();
						break;
					case "admissionSince":
						_this.revertAdmissionSection();
						break;
					case 'dischargeSince':
						_this.revertDischargeSection();
					case "ranking":
						_this.revertRankingSection();
						break;
					case "resultFilter1":
					case "resultFilter2":
					case "resultFilter3":
					case "resultFilter4":
					case "resultFilter5":
						_this.revertResultsSection(1, section.type);
						break;
					case "medications":
						_this.revertMedsSection(1);
						break;
					case "appointment":
						_this.revertApptSection();
						break;
					case "order":
						_this.revertOrderSection();
						break;
					case "expectation":
						_this.revertExpectationsSection();
						break;
					case "caseManager":
						_this.revertCaseMgrSection();
					default:
						_this.uncheckFilterSection(section.type);
						break;
				}
			}
		}
		_this.showSelectedFilters();
		_this.updateModificationBuffer(0);
		_this.onFilterModification();
	};
	this.applySectionDetails = function() {
		var filterValues = bedrock_prefs.EVENT_FILTERS;
		for(var f = 0; f < filterValues.length; f++)
		{
			var curValue = filterValues[f];
			for(var m = 0; m < m_filterObj.m_sections.length; m++)
			{
				if(m_filterObj.m_sections[m].type.toUpperCase() == curValue.SECTION_NAME)
				{
					var values = curValue.SETTINGS;
					for(var v = 0; v < values.length; v++)
					{
						if(values[v].SETTING_NAME == "FILTER_NAME")
						{
							m_filterObj.m_sections[m].title = values[v].VALUES[0].VALUE;
						}
						else if(values[v].SETTING_NAME == "EVENT_SET")
						{
							var event_set = "";
							for(var e = 0; e < values[v].VALUES.length; e++)
							{
								if(event_set.length > 0)
									event_set += ",";
								event_set += values[v].VALUES[e].VALUE;
							}
							m_filterObj.m_sections[m].argument_name = event_set;
						}
						else if(values[v].SETTING_NAME == "VALUE_QUERY")
						{
							m_filterObj.m_sections[m].value_query = values[v].VALUES[0].VALUE;
						}
					}
				}
			}
		}
	};
	function getListGroups() {
		var groups = [];
		for(var i = 0, len = m_curListSearchArguments.length; i < len; i++) {
			var argument = m_curListSearchArguments[i];
			if(argument.ARGUMENT_NAME == "ACMPRSNLGROUPS") {
				groups.push(argument.ARGUMENT_VALUE);
			}
		}
		return groups;
	}

	function truncateMultiSelectOptions($select){
		var selWidth = $select.width();
		if(selWidth <= 0){
			return;
		}

		var	$options = $select.children('option'),
			$hElem = $('<span/>')
				.css({visibility:'hidden'})
				.appendTo($('body'));

		for(var i=0,len=$options.length;i<len;i++){
			var curText = newText = $options.eq(i).attr('fulltext'),
				$hSel = $('<select><option>'+curText+'</option></select>').appendTo($hElem.empty());

			while($hSel.width() > selWidth){
				$hSel = $('<select><option>' + (newText = newText.slice(0,-1)) + '...</option></select>').appendTo($hElem.empty());
			}
			if(newText != curText){
				var curOpt = $options.eq(i).text(newText + "...").attr('truncated',true);
				curOpt.replaceWith(curOpt.clone());
			}
		}
		$hElem.remove();
	}

	function hideFilterMultiSelectTooltip(){
		$("#filterMultiSelectTooltip").text("").hide();
	}
	function showMultiSelectTooltips(event){
		var $select = $(event.target),
			$options = $select.children('option'),
			selOffset = $select.offset(),
			selSize = $select.prop("size");

		if( (event.clientX - selOffset.left) > $select.prop("clientWidth") ){
			hideFilterMultiSelectTooltip();
			return;
		}

		var numScroll = // items scrolled past
				Math.floor(($options.length * $select.scrollTop()) / $select.prop("scrollHeight")),
			hoverIdx = // zero-based index of item hovering over - the 4 accounts for padding at top/bottom
				Math.floor((event.clientY - selOffset.top - 4 ) / ($select.prop("clientHeight")) * selSize);

		if(hoverIdx < 0 || hoverIdx >= selSize){
			hideFilterMultiSelectTooltip();
			return;
		}

		var $curOpt = $options.eq(hoverIdx + numScroll);
		if($curOpt.attr('truncated') !== 'true'){
			hideFilterMultiSelectTooltip();
			return;
		}

		$("#filterMultiSelectTooltip")
			.text($curOpt.attr('fulltext'))
			.css({
				top: event.clientY - 14,
				left: event.clientX + 14
			})
			.show();
	}
	this.populateFilterValues = function(patientData,callFrom) {
		var sectionAr = this.m_sections;
		var _this = this;
		var filterInfo = m_filterValues;
		var listGroups = getListGroups();
		var addedProviders = [];
		var providers = [];
		var orderType = "";
		var recommStatus = "";
		var sPendingWorkHtml = '';
		var encounters = [];
		for(var j=0; j<filterInfo.FILTER_LIST.length; j++) {
			var filterType = filterInfo.FILTER_LIST[j];

			for(var i=0, sectionArLength = sectionAr.length; i<sectionArLength; i++) {
				if (filterType.ARGUMENT_NAME == sectionAr[i].argument_name && filterType.ARGUMENT_NAME != "CASEMANAGER" && filterType.ARGUMENT_NAME !== 'LOCATIONS') {
					var htmlString = "";
					if (filterType.ARGUMENT_NAME === 'ENCOUNTERTYPE') {
						var switched = true, temp, sortedArray = filterType.AVAILABLE_VALUES;
						while (switched) {
							switched = false;
							for (var group = 0, length = sortedArray.length; group < length - 1; group++) {
								if (sortedArray[group].PARENT_ENTITY_ID > sortedArray[group + 1].PARENT_ENTITY_ID) {
									temp = sortedArray[group + 1];
									sortedArray[group + 1] = sortedArray[group];
									sortedArray[group] = temp;

									switched = true;
								}
							}
						}
					}
					else {
						var sortedArray = alphaSort(filterType.AVAILABLE_VALUES, "ARGUMENT_VALUE");
					}
					for(var k=0; k<sortedArray.length; k++){
						var filterValue = sortedArray[k];
						var html = '<tr><td><label><input class="cvFilterInput" name="' + encodeURI(filterValue.ARGUMENT_VALUE).toString() +
						'" value="' + filterValue.PARENT_ENTITY_ID.toString() +
						'" id="' + sectionAr[i].title +  k + '" type="checkbox"/>'+
						(filterType.ARGUMENT_NAME === 'CONDITION'?'<span class="conditionSpan">':'<span>')+
						 escapeHtmlString(filterValue.ARGUMENT_VALUE) + '</span></label></td></tr>';
						if(filterType.ARGUMENT_NAME == "ACMPRSNLGROUPS" && jQuery.inArray(filterValue.ARGUMENT_VALUE, listGroups) > -1) {
							var groupproviders = alphaSort(filterValue.CHILD_VALUES, "ARGUMENT_VALUE");
							for(var p = 0, length = groupproviders.length; p < length; p++) {
								if(jQuery.inArray(groupproviders[p].ARGUMENT_VALUE, addedProviders) == -1) {
									addedProviders.push(groupproviders[p].ARGUMENT_VALUE);
									providers.push(groupproviders[p]);
								}
							}
						}
						if(filterType.ARGUMENT_NAME == "ORDERSSTATUS") {
							if(filterValue.ARGUMENT_TYPE == "type") {
								orderType += '<option value="' + filterValue.PARENT_ENTITY_ID + '" fulltext="' + filterValue.ARGUMENT_VALUE.toString() + '">' + filterValue.ARGUMENT_VALUE + '</option>';
							}
							else {
								htmlString += html;
							}
						}
						else if(filterType.ARGUMENT_NAME == "EXPECTATIONS") {
							if(filterValue.PARENT_ENTITY_NAME == "HM_EXPECT") {
								htmlString += '<option value="' + filterValue.PARENT_ENTITY_ID + '" fulltext="' + filterValue.ARGUMENT_VALUE.toString() + '">' + filterValue.ARGUMENT_VALUE + '</option>';
							}
							else {
								var recommStatusDisplayValue;
								switch(filterValue.ARGUMENT_VALUE){
									case 'Due':
										recommStatusDisplayValue = i18n.rwl.DUE;
										break;
									case 'Near Due':
										recommStatusDisplayValue = i18n.rwl.NEAR_DUE;
										break;
									case 'Not Due':
										recommStatusDisplayValue = i18n.rwl.NOT_DUE;
										break;
									case 'Overdue':
										recommStatusDisplayValue = i18n.rwl.OVERDUE;
										break;
									default:
										recommStatusDisplayValue = filterValue.ARGUMENT_VALUE;
										break;
								}
								recommStatus += '<tr><td><label><input class="cvFilterInput" name="' + encodeURI(filterValue.ARGUMENT_VALUE).toString() + '" value="' + filterValue.PARENT_ENTITY_ID + '" id="' + sectionAr[i].title +  k + '" type="checkbox" /><span>' + recommStatusDisplayValue + '</span></label></td></tr>';
							}
						}
						else if(filterType.ARGUMENT_NAME == "ORDERSTATUS") {
							htmlString += "<option value='" + k + "' meaning = '" + filterValue.ARGUMENT_MEANING + "'>" + filterValue.ARGUMENT_VALUE + "</option>";
						}
						else if (filterType.ARGUMENT_NAME === 'ENCOUNTERTYPE') {
							for (var n = 0, encLength = filterType.AVAILABLE_VALUES[k].CHILD_VALUES.length; n < encLength; n++) {
								encounters.push(filterType.AVAILABLE_VALUES[k].CHILD_VALUES[n].ARGUMENT_VALUE);
							}
							if (filterType.AVAILABLE_VALUES[k].PARENT_ENTITY_NAME !== 'INDIVIDUAL_ENC_TYPE') {
								htmlString += '<tr><td><label>' +
												'<input class="cvFilterInput"' +
													' name="' + encodeURI(filterValue.ARGUMENT_VALUE).toString() +
													'" value="' + filterValue.PARENT_ENTITY_ID +
													'" id="' + sectionAr[i].title +  k +
													'" data-children="' + encounters +
													'" type="checkbox" />' +
												'<span class="encounterName" data-children="' + encounters +'">' + filterValue.ARGUMENT_VALUE.toString() + '</span>' +
											'</label></td></tr>';
							}
							encounters = [];
						} else if (filterType.ARGUMENT_NAME === 'PENDING_WORK') {
							sPendingWorkHtml += '<tr><td><label>' +
													'<input class="cvFilterInput"' +
														' name="' + encodeURI(filterValue.ARGUMENT_VALUE).toString() +
														'" value="' + filterValue.ARGUMENT_MEANING +
														'" id="' + sectionAr[i].title +  k +
														'" type="checkbox" />' +
													'<span>' + filterValue.ARGUMENT_VALUE + '</span>' +
												'</label></td></tr>';
						}
						else {
							htmlString += html;
						}
					}

					if(filterType.ARGUMENT_NAME == "ORDERSTATUS")
					{
						$("#filterMedStatusDrop").html(htmlString);
					}
					else if(filterType.ARGUMENT_NAME == "EXPECTATIONS") {
						$("#filterExpectationsDrop").html(htmlString);
						$("#expectationTable").html(recommStatus);
					}
					else if(filterType.ARGUMENT_NAME == "ORDERSSTATUS") {
						$("#filterOrderTypeDrop").html(orderType);
						$("#orderTable").html(htmlString);
					}
					else if(filterType.ARGUMENT_NAME == "ACMPRSNLGROUPS") {
						var providerString = "";
						var providerCount = 0;
						providers = [].concat(alphaSort(providers, "ARGUMENT_VALUE"));
						for(var a = 0, size = providers.length; a < size; a++) {
							providerString += '<tr><td><label><input name="' + encodeURI(providers[a].ARGUMENT_VALUE).toString() + '" id="associatedProviders' + providerCount + '" class="cvFilterInput" value="' + providers[a].PARENT_ENTITY_ID + '" type="checkbox"/>' +
								'<span>' + providers[a].ARGUMENT_VALUE + '</span></label></td></tr>';
							providerCount++;
						}

						if(providerString.length){ //Populates Associated Providers section with the list of providers
							$("#associatedProvidersTable").html(providerString);
						}
					}
					else if (filterType.ARGUMENT_NAME === 'ENCOUNTERTYPE') {
						var individualEnc = '',
							encList = [],
							encGrpLength = filterType.AVAILABLE_VALUES.length,
							encLength,
							sortedEncListLength;
						$('#' + sectionAr[i].type + 'Table').html(htmlString);
						for (var m = 0; m < encGrpLength; m++) {
							encLength = filterType.AVAILABLE_VALUES[m].CHILD_VALUES.length;

							if (filterType.AVAILABLE_VALUES[m].PARENT_ENTITY_NAME === 'INDIVIDUAL_ENC_TYPE') {
								if (filterType.AVAILABLE_VALUES[m].ARGUMENT_MEANING === '1') {
									for (var n = 0; n < encLength; n++) {
										encList.push({
											groupName: filterType.AVAILABLE_VALUES[m].ARGUMENT_VALUE,
											encName: filterType.AVAILABLE_VALUES[m].CHILD_VALUES[n].ARGUMENT_VALUE,
											parentEntityId: filterType.AVAILABLE_VALUES[m].CHILD_VALUES[n].PARENT_ENTITY_ID
										});
									}
								}
							}
						}

						sortedEncListLength = encList.length;

						if (sortedEncListLength > 0) {
							$('#individualEncounters').find('.individualEncounterHead').show();
							alphaSort(encList, 'encName');
							for (var p = 0; p < sortedEncListLength; p++) {
								individualEnc += createIndividualEncChkBox(encList[p]);
							}

							$('#individualEncountersTable').html(individualEnc);
						} else {
							$('#individualEncounters').find('.individualEncounterHead').hide();
						}
					} else if (filterType.ARGUMENT_NAME === 'PENDING_WORK') {
						$('#pendingWorkTable').html(sPendingWorkHtml);
					}
					else {
						$("#" + sectionAr[i].type + "Table").html(htmlString);
					}
					break;
				}
			}
		}
		$("#filterShell").find(".butRevert").click(function(elemId){
			elemId.stopImmediatePropagation();
			var $parentDiv = $(this).parent();
			var section = $parentDiv.attr('id');
			var type = section.substring(0, section.length-3);
			$parentDiv.find(".numInput").removeClass('divInputError')
					  .find('.divAdmissionMaxColor').removeClass('divAdmissionMaxColor');
			if(section != null && section != "") {
				switch(section){
					case "qualifyingTab":
						_this.revertQualifyingSection();
						break;
					case "ageTab":
						_this.revertAgeSection();
						break;
					case "admissionSinceTab":
						_this.revertAdmissionSection();
						break;
					case 'dischargeSinceTab':
						_this.revertDischargeSection();
						break;
					case "rankingTab":
						_this.revertRankingSection();
						break;
					case "resultFilter1Tab":
					case "resultFilter2Tab":
					case "resultFilter3Tab":
					case "resultFilter4Tab":
					case "resultFilter5Tab":
						_this.revertResultsSection(1, section.substring(0,section.length-3));
						break;
					case "medicationsTab":
						_this.revertMedsSection(1);
						break;
					case "appointmentTab":
						_this.revertApptSection();
						break;
					case "orderTab":
						_this.revertOrderSection();
						break;
					case "expecationTab":
						_this.revertExpectationsSection();
						break;
					case "caseManagerTab":
						_this.revertCaseMgrSection();
						break;
					default:
						if(section.length > 2){
							for(var i=0, sectionsLength = _this.m_sections.length; i < sectionsLength; i++){
								if(section == _this.m_sections[i].type + "Tab"){
									_this.uncheckFilterSection(_this.m_sections[i].type);
									break;
								}
							}
						}
						break;
				}
				_this.onFilterModification();
				_this.showSelectedFilterValues(type);
				if(type != _this.lastExpandedFilter) {
					_this.showSelectedFilterValues(_this.lastExpandedFilter);
					_this.collapseSelectFilterSection(_this.lastExpandedFilter);
					$("#"+_this.lastExpandedFilter+"Selected").show();
				}
				if(_this.getFilterChecks().length <= 2 && _this.m_lastFromRank == 0 && _this.m_lastToRank == 5){
					_this.updateModificationBuffer(0);
				}
			}
		});
	};
	function showFilterIndividualEncSection() {
		$('#individualEncounters').find('.individualEncounterData').show();
		$('#individualEncounters .individualEncounterHead')
			.find('img')
			.attr('src', staticContentPath + '/images/5323_expanded_16.png');
	}
	function hideFilterIndividualEncSection() {
		$('#individualEncounters')
			.find('.individualEncounterData').hide().end()
			.find('.individualEncounterHead img').attr('src', staticContentPath + '/images/5323_collapsed_16.png').end();
	}
	function createEncSummarySection(encounterType) {
		var encId = encounterType || 'encounterType';

		return 	'<div id="' + encId + 'Selected" class="filterSelected">' +
					'<table id="' + encId + 'SelectedTable" class="filterSelectedTable"></table>' +
				'</div>';
	}
	function createIndividualEncSection() {
		return 	'<div id="individualEncounters">' +
					'<div class="individualEncounterHead">' +
						'<img alt="filterCollapsed" src="' + staticContentPath + '/images/5323_collapsed_16.png" />' +
						'<span>' + i18n.rwl.ADDINDIVIDUALENCOUNTERS + '</span>' +
					'</div>' +
					'<div class="individualEncounterData">' +
						'<table id="individualEncountersTable"></table>' +
					'</div>' +
				'</div>';
	}
	function createEncGroupsSection(encounterType) {
		var encId = encounterType || 'encounterType';

		return 	'<div class="topContent">' + i18n.rwl.GROUPENCOUNTERS + '</div>' +
				'<div id="' + encId + '">' +
					'<table id="' + encId + 'Table" class="selectTable"></table>' +
				'</div>';
	}
	function createIndividualEncChkBox(encounter) {
		var htmlString = '',
			encounterName = encounter.encName;

		if(encounter) {
			htmlString += '<tr><td><label id="filter' + setEncounterId(encounterName) + '">' +
							'<input name="' + encodeURI(encounterName).toString() +
								'" value="' + encounter.parentEntityId +
								'" class="cvFilterInput" type="checkbox" />' +
							'<span class="encounterName" data-type="INDIVIDUAL" value="' + encounterName + '">' +
								'<span>' + encounterName + '</span>' +
								'<span class="encGroups"></span>' +
							'</span>' +
						 '</label></td></tr>';
		}
		return htmlString;
	}
	function enableIndividualEncounter(disabledIndEnc, groupName) {
		var disabledIndEnc = disabledIndEnc || [],
			encounterLabelId,
			$individualEncLabel,
			$indEncGroupNames,
			groupNames;

		for (var count = 0, iLength = disabledIndEnc.length; count < iLength; count++) {
			encounterLabelId = 'filter' + setEncounterId(disabledIndEnc[count]);
			$individualEncLabel = $('#' + encounterLabelId);
			$indEncGroupNames = $individualEncLabel.find('.encGroups');
			groupNames = $indEncGroupNames.text().split(',');
			if (groupNames.length > 1) {
				removeGroupList($indEncGroupNames, groupName);
			} else {
				resetIndEncSelections($individualEncLabel);
			}
		}
	}
	function resetIndEncSelections($individualEncLabel) {
		if ($individualEncLabel) {
			$individualEncLabel.find('input').prop({'checked': false, 'disabled': false}).end()
				.find('span').removeClass('disableEncounter').end()
				.find('.encounterName').removeClass('disableEncounter').end()
				.find('.encGroups').empty().end()
				.removeClass('encGroupAdded').addClass('filterEncGroupRemoved');
		}
	}
	function removeGroupList($encGroupNameSpan, groupName) {
		if ($encGroupNameSpan && $encGroupNameSpan.length > 0) {
			var itemText = $encGroupNameSpan.text(),
				groupNames = itemText ? itemText.replace(/\(|\)/g, '').split(', ') : [];

			for(var i = 0, encGrpLength = groupNames.length; i < encGrpLength; i++) {
				if(groupNames[i] === decodeURI(groupName)) {
					groupNames.splice(i, 1);
				}
			}
			$encGroupNameSpan.text(encGroupText(groupNames));
		}
	}
	this.onFiltersApplied = function(){
		m_sLastAppliedFilterChecks = JSON.stringify(this.getFilterChecks());
	};
	this.showPatientListDetails = function(listID, verOffset){
		var searchArgsList = [];
		var iVal = -1;
		if(listID > 0)
		{
			for(var i=0, len=this.m_savedLists.length; i<len; i++){
				if(this.m_savedLists[i].PATIENT_LIST_ID == listID){
					iVal = i;
					break;
				}
			}
		}
		if(iVal == -1){
			return;
		}
		searchArgsList = this.findSearchArguments(this.m_savedLists[iVal]);
		this.buildListDetailsSection(searchArgsList);
		this.showSearchParameters(searchArgsList, verOffset);
	};

	this.compareFromToRange = function(fromRange,toRange){
		var fromRangeValue = convertNumberInputToValue(fromRange.val());
		var toRangeValue = convertNumberInputToValue(toRange.val());
		if(fromRangeValue && toRangeValue){
			if(parseFloat(fromRangeValue) < parseFloat(toRangeValue)){
				fromRange.removeClass("divInputError");
				return true;
			}
			else{
				fromRange.addClass("divInputError");
			}
		}
		return false;
	};
	this.compareFromToDates = function(FromDate, ToDate){
		var objFromDate = new Date(FromDate);
		var objToDate = new Date(ToDate);
		var objToday = new Date();

		if( objFromDate > objToDate)
		{
			return false;
		}
		return true;
	};
	this.validateDate = function(inputDate){
		var len,index,count;
		var day = "";
		var month = "";
		var year = "";

		len = inputDate.length;
		index=0;
		count=1;
		while(index < len )
		{
			var ch = inputDate.charAt(index);
			index++;
			if ( ch == "/")
			{
				count++;
				continue;
			}
			switch (count)
			{
				case 1:
					month += ch;
					break;
				case 2:
					day += ch;
					break;
				case 3:
					year +=ch;
					break;
			}
		}

		if (count == 1 || count == 2) //date is not in proper mm/dd/yyyy format
			return false;

		var dt = new Date(inputDate);
		if(dt.getDate()!=day)
			return false;
		else if(dt.getMonth()+1!=month) //this is for the purpose JavaScript starts the month from 0
			return false;
		else if(dt.getFullYear()!=year)
			return false;

		return(true);
	};

	this.getFormattedDate = function(textboxID,date)
	{
		var dateFormatted = "";
		if( date.getMonth()+1 < 10 )
			dateFormatted += "0";

		dateFormatted += date.getMonth()+1 + "/";
		if( date.getDate() < 10 )
			dateFormatted += "0";

		dateFormatted += date.getDate() + "/" + date.getFullYear();
		$("#" + textboxID).val(dateFormatted);
	};
	this.updateDefaultPage = function()
	{
		var defaultID = this.m_selectedPatientListID;
			var thisID = $(this).parent().attr("id");
			var listrequest = {listrequest:{
				patient_list_id:-1,
				default_change_flag:1,
				default_list_id:defaultID,
				owner_prsnl_id:criterion.CRITERION.PRSNL_ID
			}};

			this.controller.makeCall("mp_dcp_upd_patient_list",listrequest,true);
			this.m_defaultPatientListID = defaultID;
		return;
	};
}
