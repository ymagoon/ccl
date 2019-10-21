function RWSearch(controller){
    $("#rwSearchDlg").remove();
    var bedrock_prefs = controller.getBedrockPrefs();
    var staticContentPath = controller.staticContentPath;
    var m_search = this;
    var m_sectionsOb = new RWSectionSelect(controller, m_search, bedrock_prefs);
    var $m_searchDlg = buildDialog();
    var m_sections;
    var rxDisallowedInput = /[^a-z0-9'_ \/\-]/gi;
    var activeList = {
        name: "",
        id: 0
    };
    var modifyStartState = "";
    controller.oPromise.then(function(){
        m_search.enableSaveButton = enableSaveButton;
        m_search.enablePrevNextBtns = enablePrevNextBtns;
        m_sections = m_sectionsOb.getSections();

        m_search.showDialog = showDialog; 
        m_search.getLocationHeirarchy = function (unitCd) {
            return m_sectionsOb.getLocationHeirarchy(unitCd);
        };
        m_search.buildLocationHierarchy = function (hierarchies) {
            return m_sectionsOb.buildLocationHierarchy(hierarchies);
        };
        m_search.getChildLocations = function (facilityCd, buildingCd) {
            return m_sectionsOb.getChildLocations(facilityCd, buildingCd);
        };
    });
	function buildDialog(){
		m_sectionsOb.applySectionDetails();
		var $newDlg =  $("<div id='rwSearchDlg'>")
			.append($("<div id='rwSearchDlgHeader' class='rwDlgHeader'>")
						.append($("<div><span>" + i18n.rwl.CREATENEWLIST + "</span></div>"),
								$("<div class='cancel'>")
									.append($("<img src='" + staticContentPath + "/images/6241_16.png'/>")
										.click(hideDialog))),
					$("<div id='rwSearchDlgNavigator' class='wklType'>")
						.append($("<div id='navigatorWklType' class='active'>")
									.append($("<span>" + i18n.rwl.WKLTYPE + "</span>")),
								$("<div id='navigatorCriteria' class='inactive'>")
									.append($("<span>" + i18n.rwl.CRITERIA + "</span>")),
								$("<div id='navigatorSummary' class='inactive'>")
									.append($("<span>" + i18n.rwl.SUMMARY + "</span>"))),
					$("<div id='rwSearchDlgContent'>")
						.append(m_sectionsOb.buildWklTypeContent(),
								m_sectionsOb.buildCriteriaContent(),
								m_sectionsOb.buildSummaryContent()),
					$("<div id='rwSearchDlgFooter'>")
						.append($("<div id='rwSearchDlgButtons'>")
									.append($("<input id='rwSearchDlgCancel' type='button' value='" + i18n.rwl.CANCEL + "'/>")
												.click(hideDialog),
											$("<input id='rwSearchDlgSave' type='button' value='" + i18n.rwl.FINISH + "' disabled=true/>")
												.click(createList),
											$("<div id='rwSearchDlgBtnDivider'>"),
											$("<input id='rwSearchDlgNext' type='button' value='" + i18n.rwl.NEXT + "'/>")
												.click(switchNext),
											$("<input id='rwSearchDlgPrev' type='button' value='" + i18n.rwl.PREV + "'/>")
												.click(switchPrev))))
		.resize(function () {
			var $searchDlg = $("#rwSearchDlg");
			var toolBarWidth = $("#divFilterPanelTopBarContent").outerWidth();
			var searchDlgWidth = $searchDlg.outerWidth();
			var remWidth = (toolBarWidth - searchDlgWidth) / 2;
			$searchDlg.css('left', remWidth + "px");
		});
		m_sectionsOb.populateSections();
		return $newDlg;
	}

	function switchPrev() {
		var $navigator = $("#rwSearchDlgNavigator");
		var $wklType = $("#navigatorWklType");
		var $criteria = $("#navigatorCriteria");
		var $summary = $("#navigatorSummary");
		var $content = $("#rwSearchDlgContent");
		var curSection = $navigator.attr("class");
		$navigator.removeClass();
		$content.removeClass().children().hide();
		if(curSection == "criteria") {
			$navigator.addClass("wklType");
			$content.addClass("wklType");
			$("#contentWklType").show();
			$("#rwSearchDlgPrev").hide();
			$wklType.removeClass().addClass("active");
			$criteria.removeClass().addClass("inactive");
			$summary.removeClass().addClass("inactive");
		}
		else if(curSection == "summary") {
			$navigator.addClass("criteria");
			$content.addClass("criteria");
			$("#contentCriteria").show();
			$wklType.removeClass().addClass("complete");
			$criteria.removeClass().addClass("active");
			$summary.removeClass().addClass("inactive");
			$("#rwSearchDlgSave").hide();
			$('#rwMedSearchInput').val("").keyup();
			$('#rwMedSearchList').remove();

			var $ccontent = $("#criteriaRightPane");
			$ccontent.children().hide();
			var $selected = $("#criteriaList").find(".selected");
			if($selected.length > 0) {
				var id = $selected.attr("id").replace("section", "");
				$("#" + id).show();
			}
		}
		enablePrevNextBtns();
		enableSaveButton();
	}

	function switchNext() {
		var $navigator = $("#rwSearchDlgNavigator");
		var $wklType = $("#navigatorWklType");
		var $criteria = $("#navigatorCriteria");
		var $summary = $("#navigatorSummary");
		var $content = $("#rwSearchDlgContent");
		var curSection = $navigator.attr("class");
		$navigator.removeClass();
		$content.children().hide();
		if(curSection == "wklType") {
			$navigator.addClass("criteria");
			$content.addClass("criteria");
			$("#contentCriteria").show();
			$("#rwSearchDlgPrev").show();
			$wklType.removeClass().addClass("complete");
			$criteria.removeClass().addClass("active");
			$summary.removeClass().addClass("inactive");

			var $ccontent = $("#criteriaRightPane");
			$ccontent.children().hide();
			var $selected = $("#criteriaList").find(".selected");
			if($selected.length > 0) {
				var id = $selected.attr("id").replace("section", "");
				$("#" + id).show();
			}
			if (m_controller.getRiskFlag() === 0) { //we check if Readmission risk is present if not we remove that filter from search dialog.
				$('#sectionRISK').remove();
			}
			if(m_controller.getCaseStatusFlag() === false) {
				$('#sectionCASESTATUS').remove();
			}
		}
		else if(curSection == "criteria") {
			$navigator.addClass("summary");
			$content.addClass("summary");
			$("#contentSummary").show();
			$wklType.removeClass().addClass("complete");
			$criteria.removeClass().addClass("complete");
			$summary.removeClass().addClass("active");
			$("#rwSearchDlgSave").show();
		}
		enablePrevNextBtns();
		enableSaveButton();
	}

	function enablePrevNextBtns() {
		var $navigator = $("#rwSearchDlgNavigator");
		var curSection = $navigator.attr("class");
		if (curSection == "wklType") {
			$("#rwSearchDlgNext").show();
			$("#rwSearchDlgPrev").attr("disabled", true);
			var selectedRelCount = GetRelationshipCount();
			var groups = $("#ACMPRSNLGROUPS").find(":checked").length;
			var providers = $("#SINGLEPROVIDER").find(":checked").length;
			var wklNameLength = $('#wklNameText').text().length;
			var hasListname = wklNameLength > 0;
			var isProviderTypeComplete = selectedRelCount > 0 && (groups > 0 || providers > 0);
			if(hasListname === true && (isProviderTypeComplete === true || m_sectionsOb.isLocationsComplete() === true)) {
				$("#rwSearchDlgNext").attr("disabled", false);
			}
			else {
				$("#rwSearchDlgNext").attr("disabled", true);
			}
		}
		else if(curSection == "criteria") {
			var numErrors = $("#criteriaList").find(".errorImg").filter(":visible").length;
				$("#rwSearchDlgNext").show();
			if(numErrors == 0) {
				$("#rwSearchDlgNext").attr("disabled", false);
			}
			else {
				$("#rwSearchDlgNext").attr("disabled", true);
			}
			$("#rwSearchDlgPrev").attr("disabled", false);
		}
		else if(curSection == "summary") {
			$("#rwSearchDlgPrev").attr("disabled", false);
			$("#rwSearchDlgNext").hide();
		}
	}
	 function updateWorklistType(type) {
		var $rightPane = $('#wklTypeRightPane');
		var $temp = null;
		$rightPane.children().hide();
		switch(type) {
			case 'groupProviderType':
				$rightPane
					.find('.relationshipsContainer')
						.show()
					.find('.providerRel')
						.show();
				$rightPane
					.find('.locationContainer')
						.find('.sectionHeader')
							.find('.clearSection')
								.click();
				break;
			case 'locationType':
				$temp = $('<span></span>');
				$rightPane
					.find('.locationContainer')
						.show()
						.append($temp)
						.end()
					.find('.relationshipsContainer .relClear')
						.click();
				collapseProviderSection($('#ACMPRSNLGROUPS'));
				collapseProviderSection($('#SINGLEPROVIDER'));
				m_sectionsOb.displayChildLocations(null, null);
				$temp.remove();
				break;
			default:
				$('#wklTypeLeftPane').find('input[name=listTypesGroup]').prop('checked', false);
				break;
		}
		$rightPane = null;
	}
    m_search.updateWorklistType = updateWorklistType;

	function showDialog(currentSearchArgs, activeListName, activeListID, bProxy) {
		var htmlString = "";
		var sListType = '';
		activeList.name = activeListName;
		activeList.id = activeListID;
		for(var i =0, sectionLength = m_sections.length; i<sectionLength;i++){
			var sectionName = m_sections[i].name;
			if(name.indexOf("result")!= -1){
				$("#rw"+ name +"Or").attr("checked","checked");
			}
		}
		$("#rwSearchDlgBackground").remove();
		$("body").append($m_searchDlg,$("<div id='rwSearchDlgBackground' class='rwDlgBackground overlayDimmed'>"),$("<div id='rwSearchDlgTooltip' class='rwSearchDlgTooltip'></div>"));

		$("#rwSearchDlg").show();
		$("#rwSearchDlgSave").hide();
		$("#rwSearchDlgPrev").hide();
		sListType = m_controller.fnGetListLocations(activeListID).length > 0 ? 'location' : 'groupProvider';
		$('#' + sListType + 'WklDetail').prop('checked', true);
		updateWorklistType(sListType + 'Type');
		if(activeListName) {
			$('#LOCATIONS').find('.sectionHeader').find('.clearSection').click();
			var data = currentSearchArgs || {};
			m_sectionsOb.setSectionData(data);
			$("#wklNameInput").addClass((bProxy?"hasProxy":"")).val(activeListName).keyup();
			$("#rwSearchDlgHeader").find("span").text(i18n.rwl.MODIFYLIST);
			$("#rwSearchDlgSave").attr("disabled",true);
			modifyStartState = JSON.stringify(m_sectionsOb.getSectionData());
		}
		else {
			$("#wklNameInput").val("").keyup();
			$("#rwSearchDlgHeader").find("span").text(i18n.rwl.CREATENEWLIST);
			modifyStartState = "";
			$('#groupProviderWklDetail').prop('checked', true).change();
		}
		enablePrevNextBtns();
		enableSaveButton();
	}
	function collapseProviderSection($section) {
		if($section) {
			$section
				.height('auto')
				.find('.sectionContent ').hide().end()
				.find('.expandBtn').show().end()
				.find('.collapseBtn').hide();
		}
	}
	function hideIndividualEncSection() {
		var $section = $('#groupIndividualEncounters'),
			$images = $section.find('.addIndividualEncLabel img');
		$images
			.last().hide().end()
			.first().show();
		$section.find('.addIndividualEncContent').hide();
	}

	function hideDialog(){
		m_sectionsOb.clearSections();
		$("#rwSearchDlg").hide();	// Just detach so it's not in DOM but we don't have to repopulate it
		$("#rwSearchDlgBackground").hide();
		$("#rwSearchDlgNavigator").removeClass().addClass("wklType");
		$("#rwSearchDlgContent").removeClass().addClass("wklType").children().hide();
		$("#contentWklType").show();
		$("#navigatorWklType").removeClass().addClass("active");
		$("#navigatorCriteria").add($("#navigatorSummary")).removeClass().addClass("inactive");
		$("#criteriaRightPane").children().hide();
		$("#criteriaList").find(".selected").removeClass();
		collapseProviderSection($('#ACMPRSNLGROUPS'));
		collapseProviderSection($('#SINGLEPROVIDER'));
		hideIndividualEncSection();
	}
	function enableSaveButton() {
		var $listName = $("#wklNameInput");
		var sectionState = JSON.stringify(m_sectionsOb.getSectionData());
		var selectedRelCount = GetRelationshipCount();
		var groups = $("#ACMPRSNLGROUPS").find(":checked").length;
		var providers = $("#SINGLEPROVIDER").find(":checked").length;
		var isProviderTypeComplete = (selectedRelCount > 0 && (groups > 0 || providers > 0));
		if((isProviderTypeComplete === true || m_sectionsOb.isLocationsComplete() === true) &&
				(modifyStartState.localeCompare(sectionState) !== 0 ||
					activeList.name.localeCompare($listName.find("input").val()) !== 0) &&
				$listName.hasClass("hasInput"))
		{
			$("#rwSearchDlgSave").attr("disabled",false);
		} else {
			$("#rwSearchDlgSave").attr("disabled",true);
		}
	}
	function GetRelationshipCount() {
		var count = 0;
		count += $('#PPRCODES').find('input:checked').length;
		count += $('#EPRCODES').find('input:checked').length;
		return count;
	}

	function createList(){
		function logLocationCapTimer() {
			if(m_sectionsOb.isLocationsComplete() === true) {
				controller.fnLogCapabilityTimer('CAP:MPG DWL Location Based List');
			}
		}

		var listName = $.trim($("#wklNameInput").val());
		var bModifying = (listName == activeList.name);
		var timerName = bModifying ? "USR:DWL-SAVEMODIFYLIST" : (activeList.name ? "USR:DWL-RENAMEMODIFYLIST" : "USR:DWL-CREATELIST");

		controller.createCheckpoint(timerName,"Start");

		if($("#filterShell").hasClass("noList")) {
			controller.setLoadingState(true);
		}

		var modifiedAr = m_sectionsOb.getSectionData();
		var modifiedArSearchString = JSON.stringify(modifiedAr).replace(/("ARGUMENT_NAME":"[^"]*)/g,"$1_SEARCH");
		var modifiedArSearch = json_parse(modifiedArSearchString);
		var criterion = controller.getCriterion();
		if(bModifying) {
			request = {
				patient_request: {
					patient_list_id: activeList.id,
					patient_list_name: listName,
					owner_prsnl_id: criterion.CRITERION.PRSNL_ID,
					search_arguments: modifiedArSearch,
					patients: [],
					clear_arg_ind: 1,
					clear_pat_ind: 0,
					return_arg_ind: 1
				}
			};
			controller.makeCall("mp_dcp_upd_static_patients",request,false,function(reply){
				controller.updateCurrentList(activeList.id, reply.ARGUMENTS);
			});
			hideDialog();
			var metaData = [
				{key: "List ID", value: activeList.id},
				{key: "Search Arguments", value: modifiedArSearchString},
				{key: "Number of Patients", value: m_controller.getStaticPatientListSize()}
			];
			controller.createCheckpoint(timerName, "Stop", metaData);
			logLocationCapTimer();
			return;
		}
		var patientLists = controller.getSavedList();
		for(var i=0,len=patientLists.length; i<len; i++){
			if(listName == patientLists[i].PATIENT_LIST_NAME) {
				alert(i18n.rwl.CHANGELISTNAME);
				return;
			}
		}

		controller.audit("Dynamic Worklist", "Create Worklist");
		controller.showListGenerating(true);
		controller.setCreatingList(true);
		controller.setWorklistMessage(i18n.rwl.NOWORKLIST, false);
		hideDialog();

		var request = {
			listrequest: {
				user_id: criterion.CRITERION.PRSNL_ID,
				pos_cd: criterion.CRITERION.POSITION_CD,
				search_indicator: 1,
				load_demographics: 0,
				arguments: modifiedAr,
				search_arguments: modifiedArSearch,
				patient_list_name: listName
			}
		};
		controller.makeCall("mp_dcp_get_pl_wrapper",request,true,function(reply){
			var listID = reply.PATIENT_LIST_ID;
			var metaData = [
				{key: "List ID", value: listID},
				{key: "Search Arguments",   value: modifiedArSearchString},
				{key: "Number of Patients", value: reply.PATIENTS.length}
			];
			controller.createCheckpoint(timerName, "Stop", metaData);
			controller.createCheckpoint("USR:DWL-SAVENEWLIST", "Start");

			controller.showListGenerating(false);
			var bShowList;
			if(patientLists.length > 0) {
				var htmlString = "";
				htmlString += "<div id = 'rwSwitchDlgHeader' class='rwDlgHeader'><span>" + i18n.rwl.CREATELIST + "</span></div>";
				htmlString += "<div id = 'dialogMiddle'>" + i18n.rwl.CONFIRMNEWLIST + "</div>";
				htmlString += "<div id = 'dialogButtons'><input id = 'dialogCancelBut' class = 'rwSearchDlgBtn shareButton' type = 'button' value = '" + i18n.rwl.CANCEL + "'/>";
				htmlString += "<input id = 'dialogOkBut' class = 'rwSearchDlgBtn shareButton' type ='button' value='" + i18n.rwl.OK + "'/></div>";
				var $dialog = $("<div id = 'dialog'>").html(htmlString);
				$("body").prepend("<div id = 'divSaveBackground' class='overlayDimmed'>", $dialog);
				$("#dialogOkBut").click(function() {
					controller.setWorklistMessage(i18n.rwl.NOPERSON,false);
					$("#divSaveBackground").remove();
					$("#dialog").remove();
					bShowList = true;
					controller.addStaticList(listID,listName,modifiedArSearch,bShowList);
				});
				$("#dialogCancelBut").click(function() {
					controller.setCreatingList(false);
					$("#divSaveBackground").remove();
					$("#dialog").remove();
					bShowList = false;
					controller.addStaticList(listID,listName,modifiedArSearch,bShowList);
				});
				controller.createCheckpoint("USR:DWL-SAVENEWLIST", "Stop", metaData);
			} else {
				bShowList = true;
				controller.addStaticList(listID,listName,modifiedArSearch,bShowList);
				controller.createCheckpoint("USR:DWL-SAVENEWLIST", "Stop", metaData);
			}
			logLocationCapTimer();
		}, function() {
			controller.createCheckpoint(timerName, "Fail");
			controller.showListGenerating(false);
		}, null, null, null, "create");
	}
}

function RWSectionSelect(controller, searchDialog, bedrock_prefs){
	var m_sections = [
		{name:"ACMPRSNLGROUPS",title:i18n.rwl.PROVIDERGROUP,contentBuilder: (buildProviderGroupContent),required:true, displayTab: "wklType"},
		{name:"SINGLEPROVIDER",title:i18n.rwl.SINGLEPROVIDER,contentBuilder: (buildSingleProviderContent),required:true, displayTab: "wklType"},
		{name:'AUTOREMOVEPATIENTS',title:i18n.rwl.AUTOREMOVETEXT,contentBuilder: (buildAutoRemoveContent),required:true, displayTab: 'wklType'},
		{name:'PPRCODES',title:i18n.rwl.LIFETIMERELATIONSHIP,required:true, displayTab: 'wklType'},
		{name:'EPRCODES',title:i18n.rwl.VISITRELATIONSHIP,required:true, displayTab: 'wklType'},
		{name:'LOCATIONS', title:i18n.rwl.LOCATION, required:true, displayTab: 'wklType'},
		{name:"AGE",title:i18n.rwl.AGE,contentBuilder:(buildAgeContent), skipScriptContentRetrieval: true, displayTab: "criteria", recommstatus: "recomm"},
		{name:"GENDER",title:i18n.rwl.SEX, displayTab: "criteria", recommstatus: "recomm"},
		{name:"LANGUAGE",title:i18n.rwl.LANGUAGE, displayTab: "criteria", recommstatus: "recomm"},
		{name:"RACE",title:i18n.rwl.RACE, displayTab: "criteria", recommstatus: "recomm"},
		{name:"CASEMANAGER",title:bedrock_prefs.CASE_MGR_HEADER,contentBuilder:(buildCaseMgrContent),skipScriptContentRetrieval: true, displayTab: "criteria", recommstatus: "recomm"},
		{name:"FINANCIALCLASS",title:i18n.rwl.FINANCIALCLASS, displayTab: "criteria", recommstatus: "recomm"},
		{name:"HEALTHPLAN",title:i18n.rwl.HEALTHPLAN, displayTab: "criteria", recommstatus: "recomm"},
		{name:"RISK", title:i18n.rwl.READMISSIONRISK, displayTab: "criteria", recommstatus: "recomm"},
		{name:'ADMISSION',title:i18n.rwl.ADMISSIONRANGE,contentBuilder:(buildAdmissionContent), skipScriptContentRetrieval: true, displayTab: 'criteria', recommstatus: 'recomm', classname: 'admissionDischargeFilter'},
		{name:'DISCHARGE',title:i18n.rwl.DISCHARGERANGE,contentBuilder:(buildDischargeContent), skipScriptContentRetrieval: true, displayTab: 'criteria', recommstatus: 'recomm', classname: 'admissionDischargeFilter'},
		{name:'ENCOUNTERTYPE',title:i18n.rwl.ENCOUNTERTYPE,contentBuilder:(buildEncounterTypeContent), skipScriptContentRetrieval: false, displayTab: 'criteria', recommstatus: 'recomm'},
		{name:'CASESTATUS', title:i18n.rwl.CASESTATUS, displayTab: 'criteria', recommstatus: 'recomm'},
		{name:"APPTSTATUS",title:bedrock_prefs.APPOINTMENT_HEADER,contentBuilder:(buildApptContent), skipScriptContentRetrieval: false, displayTab: "criteria", recommstatus: "recomm"},
		{name:"CONDITION",title:i18n.rwl.CONDITIONS, displayTab: "criteria", recommstatus: "add"},
		{name:"ORDERSTATUS",title:i18n.rwl.MEDICATIONS,contentBuilder:(buildMedsContent), skipScriptContentRetrieval: false, displayTab: "criteria", recommstatus: "add"},
		{name:"ORDERSSTATUS", title:bedrock_prefs.ORDERS_HEADER,contentBuilder:(buildOrderContent), skipScriptContentRetrieval: false, displayTab: "criteria", recommstatus: "add"},
		{name:"EXPECTATIONS", title:i18n.rwl.HEALTHMAINTENANCE, contentBuilder:(buildExpectationsContent),skipScriptContentRetrieval: false, displayTab: "criteria", recommstatus: "add"},
		{name:"REGISTRY",title:i18n.rwl.REGISTRY, displayTab: "criteria", recommstatus: "recomm"},
		{name:'COMMUNICATIONPREF',title:i18n.rwl.COMMUNICATIONPREF, displayTab: 'criteria', recommstatus: 'add'}
	];
	var m_maxDigits = {
		Values:10,
		Days:3
	};
	var m_searchDialog = searchDialog;
	var m_controller = controller;
	var staticContentPath = m_controller.staticContentPath;
	var $m_wklTypeContent = $();
	var $m_criteriaContent = $();
	var $m_summaryContent = $();
	var m_modifiedData = {};
	var child_arguments = [];
	var m_searchObj = this;
	var rxDisallowedInput = /[^a-z0-9'_ \/\-]/gi;

	this.getSections= function(){
		return m_sections;
	};

	this.clearSections = clearSections;
	this.getSectionData = function() {
		var sectionData = [];
		for(var key in m_modifiedData){
			var dataAr = m_modifiedData[key];
			for(var i=0,len=dataAr.length; i<len; i++){
				if(dataAr[i] && dataAr[i].CHILD_ARGUMENTS && dataAr[i].CHILD_ARGUMENTS.length > 0)
					sectionData.unshift(dataAr[i]);
				else
					sectionData.push(dataAr[i]);
			}
		}
		return sectionData;
	};

	this.setSectionData =  function(searchArgs) {
		m_modifiedData = searchArgs;
		for(var key in searchArgs) {
			if(searchArgs[key].length > 0) {
				$("#" + key).find(".sectionContent").trigger("setSectionData");
			}
			if(key === 'NOAPPT') {
				$('#APPTSTATUS').find('.sectionContent').trigger('setSectionData');
			}
		}
	};
	this.applySectionDetails = function()
	{
		var filterValues = bedrock_prefs.EVENT_FILTERS;
		var index;
		for(var m = 0; m < m_sections.length; m++)
		{
			if(m_sections[m].name == "ORDERSTATUS")
				index = m;
		}
		var section = [];
		for(var f = 0, filterValuesLength = filterValues.length; f < filterValuesLength; f++)
		{
			var values = filterValues[f].SETTINGS;
			section.push({
				name: filterValues[f].SECTION_NAME.toUpperCase(),
				contentBuilder: (buildResultsContent),
				skipScriptContentRetrieval: true,
				displayTab: "criteria",
				recommstatus: "add"
			});
			for(var v = 0, valuesLength = values.length; v < valuesLength; v++)
			{
				if(values[v].SETTING_NAME == "FILTER_NAME")
				{
					section[f].title = values[v].VALUES[0].VALUE;
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
					section[f].argument_name = event_set;
				}
				else if(values[v].SETTING_NAME == "VALUE_QUERY")
				{
					section[f].value_query = values[v].VALUES[0].VALUE;
				}
			}
			m_sections.splice(index+f,0,section[f]);
		}
	};
	function clearData() {
		var $clearBtn = $(this),
			$providerSection;
		if ($clearBtn.hasClass('relClear')) {
			$providerSection = $('#listProviders .sectionContent');
			if ($providerSection.find('input:checked').length > 0) {
				$providerSection.trigger('clearSectionData');
			}
		} else {
			$clearBtn.parent().next().trigger('clearSectionData');
		}

		$clearBtn = null;
		$providerSection = null;
	}
	function clearReltnData() {
		$('#PPRCODES').add('#EPRCODES').find('.relationsContent').trigger('clearSectionData');
	}
	function toggleProviderSection() {
		var $currentSection = $(this).parent(),
			$currentContent = $currentSection.find('.sectionContent'),
			$siblingSection = $currentSection.siblings(),
			$siblingContent = $siblingSection.find('.sectionContent'),
			sectionExpanded = $currentContent.is(':visible');

		if(sectionExpanded) {
			$currentContent.hide();
			$currentSection
				.height('auto')
				.find('.toggleSection').toggle().end()
				.find('.clickableHeaderExpanded')
					.removeClass('clickableHeaderExpanded')
					.addClass('clickableHeader');
		} else {
			$currentContent.show();
			$currentSection
				.height('90%')
				.find('.toggleSection').toggle().end()
				.find('.clickableHeader')
					.removeClass('clickableHeader')
					.addClass('clickableHeaderExpanded');
			if($currentSection.hasClass('acmprsnlgroups') === true) {
				var headerHeight = 72;
				$currentContent.find('.providerGroupList').height($('#providersSelection').height()-headerHeight);
			}
			else {
				var headerHeight = 95;
				$currentContent.find('.providerList').height($('#providersSelection').height()-headerHeight);
			}
			$siblingContent.hide();
			$siblingSection
				.height('auto')
				.find('.expandBtn').show().end()
				.find('.collapseBtn').hide();
			$siblingSection.find('.clickableHeaderExpanded')
				.removeClass('clickableHeaderExpanded')
				.addClass('clickableHeader');
		}
	}

	this.buildWklTypeContent = function() {
		$m_wklTypeContent = $("<div id='contentWklType'>");
		$m_wklTypeContent.append($("<div id='wklTypeLeftPane'>")
									.append($('<div id="listName" class="listNameDisp">')
												.append($('<div><span class="requiredIndicator">*</span><span class="name">' + i18n.rwl.LISTNAME + '</span></div>'),
														$('<input id="wklNameInput" class="listNameInput noInput" type="text" />')
															.bind("keyup paste",function(e){
																	var $input = $(this);
																	setTimeout(function() {
																		var oldVal = $input.val();
																		var newVal = oldVal.replace(rxDisallowedInput,"").slice(0,50);
																		if(newVal != oldVal){
																			$input.val(newVal);
																		}
																		if(newVal.length > 0) {
																			$input.removeClass('noInput').addClass('hasInput');
																			$("#wklNameText").text(newVal).parent().show();
																		}
																		else {
																			$input.removeClass('hasInput').addClass('noInput');
																			$("#wklNameText").text("").parent().hide();
																		}
																		m_searchDialog.enablePrevNextBtns();
																	},0);
															})
															.focus(function(e){ // only modify once, to remove proxy substring
																var $input = $(this);
																if($input.hasClass("hasProxy")){
																	var oldVal = $input.val();
																	var newVal = $.trim(oldVal.replace(/(\([^()]*\))$/,""));
																	$input.val(newVal).removeClass("hasProxy");
																	setTimeout(function(){$input[0].value = $input[0].value;},500);
																}
															})
												),
												$(buildListTypeSelector())
													.on('change', '.listTypeGroup input[name=listTypesGroup]:radio', function() {
														m_searchDialog.updateWorklistType($(this).val());
													}),
													$('<div id="autoRemovePatientSection" class="autoRemoveSection">')
														.append($('<div id="AUTOREMOVEPATIENTS">')
																	.append($('<div class="sectionContent">')))),
								$('<div id="wklTypeRightPane">')
									.append(
										$('<div class="relationshipsContainer">').append(
											$('<div class="providerRel">')
												.append(buildProviderRelations)
												.on('click', '.reltnClear', clearReltnData)
												.on('change', '.tabs input[name=relTabs]', function() {
													var $selectedInput = $(this),
														$selectedInputLabel = $selectedInput.parent('label');
													$selectedInputLabel
														.siblings()
														.each(function() {
															var $adjInput = $(this),
																$adjTabContent = $($adjInput.data('tab'));
															$adjTabContent
																.hide()
																.find('input:checked').prop('checked', false);
														});
													$($selectedInputLabel.data('tab')).show();
													m_searchDialog.enablePrevNextBtns();
												})
												.on('click', '.relClear', clearData)
												.on('click', '.sectionHeader.clickableHeader', toggleProviderSection)
												.on('click', '.sectionHeader.clickableHeaderExpanded', toggleProviderSection)
										),
										$('<div id="LOCATIONS" class="locationContainer">').append(m_searchObj.buildLocations())
									)
								);
		return $m_wklTypeContent;
	};
	function buildListTypeSelector() {
		return '<div class="listSelector">' +
					'<span class="requiredIndicator">*</span><span class="name">' + i18n.rwl.WORKLISTDETAILS + '</span>' +
					'<div class="listTypeGroup">' +
						'<p><label><input id="groupProviderWklDetail" type="radio" name="listTypesGroup" value="groupProviderType">' + i18n.rwl.GROUPPROVIDER + '</label></p>' +
						'<p><label><input id="locationWklDetail" type="radio" name="listTypesGroup" value="locationType">' + i18n.rwl.LOCATION + '</label></p>' +
					'</div>' +
				'</div>';
	}
	function buildProviderRelations() {
		function buildHeader() {
			return 	'<div class="sectionHeader">' +
						'<span>' + i18n.rwl.GROUPPROVIDER + '</span>' +
						'<div class="relClear">' + i18n.rwl.CLEAR + '</div>' +
					'</div>';
		}
		function buildAccordion() {
			return	'<div id="listProviders" class="listProvidersDisp">' +
						'<div id="providersSelection" class="providersSection">' +
							'<div id="ACMPRSNLGROUPS" class="acmprsnlgroups">' +
								'<div class="sectionHeader clickableHeader">' +
									'<span>' + i18n.rwl.PROVIDERGROUPS + '</span>' +
									'<div class="chkCntInd"></div>' +
								'</div>' +
								'<div class="sectionContent providerGroups">' +
								'</div>' +
							'</div>' +
							'<div id="SINGLEPROVIDER">' +
								'<div class="sectionHeader clickableHeader">' +
									'<span>' + i18n.rwl.SINGLEPROVIDERS + '</span>' +
									'<div class="chkCntInd"></div>' +
								'</div>' +
								'<div class="sectionContent singleProvider">' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
		}
		function buildRelationshipTypes() {
			return  '<span class="relationsLabel">' + i18n.rwl.RELATIONSHIPTYPE + '</span>' +
					'<div class="tabs">' +
						'<label data-tab="#PPRCODES" id="pprTab" class="activeTab">' +
							'<input type="radio" name="relTabs" checked="checked"/>' + i18n.rwl.LIFETIMERELATIONSHIP + '</label>' +
						'<label data-tab="#EPRCODES" id="eprTab" class="inactiveTab">' +
							'<input type="radio" name="relTabs"/>' + i18n.rwl.VISITRELATIONSHIP + '</label>' +
					'</div>' +
					'<div id="PPRCODES">' +
						'<div class="reltnClear"><span class="clearSection">' + i18n.rwl.CLEAR + '</span></div>' +
						'<div class="sectionContent relationsContent"></div>' +
					'</div>' +
					'<div id="EPRCODES" class="visitRelationship">' +
						'<div class="reltnClear"><span class="clearSection">' + i18n.rwl.CLEAR + '</span></div>' +
						'<div class="sectionContent relationsContent"></div>' +
					'</div>';
		}

		return 	buildHeader() +
				'<div class="relationsLeftCol">' +
					buildAccordion() +
				'</div>' +
				'<div class="relationsRightCol">' +
					buildRelationshipTypes() +
					'<div id="relationsRightColOverlay" class="relationsRightColOverlay"></div>' +
				'</div>';
	}
	m_searchObj.areLocationsSelected = function() {
		m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
		var aoSelectedLocations = m_modifiedData.LOCATIONS;
		var iSelLocationLength = aoSelectedLocations.length;
		for(var i = 0; i < iSelLocationLength; i++) {
			if(aoSelectedLocations[i].ARGUMENT_NAME === 'LOCATIONUNITS') {
				return true;
			}
		}
		return false;
	};
	m_searchObj.isLocationsComplete = function() {
		function isRangeValid() {
			m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
			var aoSelectedLocations = m_modifiedData.LOCATIONS;
			var iSelLocationLength = aoSelectedLocations.length;
			for(var i = 0; i < iSelLocationLength; i++) {
				if((aoSelectedLocations[i].ARGUMENT_NAME === 'LOCATIONDAYS' &&
				    parseInt(aoSelectedLocations[i].ARGUMENT_VALUE,10) >= 0) ||
				    (aoSelectedLocations[i].ARGUMENT_NAME === 'LOCATIONWEEKS' &&
				    parseInt(aoSelectedLocations[i].ARGUMENT_VALUE,10) > 0) ||
				    (aoSelectedLocations[i].ARGUMENT_NAME === 'LOCATIONMONTHS' &&
				    parseInt(aoSelectedLocations[i].ARGUMENT_VALUE,10) > 0)) {
					return true;
				}
			}
			return false;
		}
		if($.isPlainObject(m_modifiedData) === false || $.isArray(m_modifiedData.LOCATIONS) === false) {
			return false;
		}

		return m_searchObj.areLocationsSelected() === true && isRangeValid() === true;
	};
	m_searchObj.setUnitsSelected = function(facilityCd, buildingCd, unitCd, isSelected) {
		function setSelectedBuildingUnits(building) {
			function updateSelectedCount(building, isIncrement) {
				if($.isNumeric(building.SELECTED_UNIT_COUNT) === false) {
					building.SELECTED_UNIT_COUNT = 0;
				}
				if(isIncrement === true && building.SELECTED_UNIT_COUNT < building.UNITS.length) {
					building.SELECTED_UNIT_COUNT++;
				} else if(isIncrement === false && building.SELECTED_UNIT_COUNT > 0) {
					building.SELECTED_UNIT_COUNT--;
				}
			}
			function updateUnitCountInd(cnt) {
				var $rows      = $('#locationControl').find('.locationColumn.col2 .locationColumnOptionsSection li');
				var visibility = 'hidden';

				$rows.each(function() {
					if($(this).data('LOCATION_CD') === building.LOCATION_CD) {
						visibility = (cnt > 0) ? 'visible' : 'hidden';
						var spanElement = $(this).find('span').get(0);
						$(this).find('div.unitCntInd').text(cnt).css('visibility', visibility);
						$(spanElement).css('width', '75%');

						if(DWL_Utils.fnIsTextOverflowed(spanElement) === true) {
							$(spanElement).tooltip({ content: $(spanElement).text(),
										items: $(spanElement),
										hide: false,
										show: false,
										tooltipClass: 'locationTooltip'})
							.addClass('hasTooltip');
						}
						else if($(spanElement).hasClass('hasTooltip') === true) {
							$(spanElement).removeClass('hasTooltip').tooltip('destroy');
						}
					}
				});

				$rows = null;
			}
			function fnUpdateModifiedData(fLocationCd, sLocationDisp, bIsSelected) {
				function fnLocateLocation(aoLocationCds) {
					var iIndex = -1;

					if($.isArray(aoLocationCds) === true) {
						for(var i=0, len=aoLocationCds.length; i<len; i++) {
							if($.isPlainObject(aoLocationCds[i]) === true && aoLocationCds[i].PARENT_ENTITY_ID === fLocationCd) {
								iIndex = i;
								break;
							}
						}
					}

					return iIndex;
				}
				function fnCreateLocationUnitsArgument() {
					return {
						ARGUMENT_NAME: 'LOCATIONUNITS',
						ARGUMENT_VALUE: sLocationDisp,
						PARENT_ENTITY_NAME: 'LOCATION',
						PARENT_ENTITY_ID: fLocationCd
					};
				}
				m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
				var aoLocations   = m_modifiedData.LOCATIONS,
					iLocationIdx  = fnLocateLocation(aoLocations),
					bNeedToAppend = (bIsSelected === true  && iLocationIdx === -1),
					bNeedToRemove = (bIsSelected === false && iLocationIdx >   -1);

				if(bNeedToAppend === true) {
					aoLocations.push(fnCreateLocationUnitsArgument());
				} else if(bNeedToRemove === true) {
					aoLocations.splice(iLocationIdx, 1);
				}

				if(m_searchObj.isLocationsComplete() === false) {
					$('#wklLocationsText').empty();
					$('#summaryLOCATIONS').hide();
					return;
				}
				m_searchDialog.enablePrevNextBtns();
			}

			if($.isPlainObject(building) === false || $.isArray(building.UNITS) === false) {
				return;
			}

			var curUnit = null;
			for(var i=0, len=building.UNITS.length; i<len; i++) {
				curUnit = building.UNITS[i];
				if(curUnit.LOCATION_CD === unitCd || unitCd === null) {
					curUnit.SELECTED_IND = isSelected;
					updateSelectedCount(curBuilding, isSelected);
					updateUnitCountInd(curBuilding.SELECTED_UNIT_COUNT);
					fnUpdateModifiedData(curUnit.LOCATION_CD, curUnit.LOCATION_DISP, isSelected);
				}
				if(curUnit.LOCATION_CD === unitCd) {
					return;
				}
			}
		}

		var curFacility = null;
		var curBuilding = null;

		for(var i=0, iLen=m_controller.locations.FACILITIES.length; i<iLen; i++) {
			curFacility = m_controller.locations.FACILITIES[i];
			if(facilityCd === curFacility.LOCATION_CD || (facilityCd === null && buildingCd === null && unitCd === null)) {
				if($.isArray(curFacility.BUILDINGS) === false) {
					continue;
				}
				for(var j=0, jLen=curFacility.BUILDINGS.length; j<jLen; j++) {
					curBuilding = curFacility.BUILDINGS[j];
					if(buildingCd === curBuilding.LOCATION_CD || (buildingCd === null && unitCd === null)) {
						setSelectedBuildingUnits(curBuilding);
					}
					if(buildingCd === curBuilding.LOCATION_CD) {
						return;
					}
				}
			}
			if(facilityCd === curFacility.LOCATION_CD) {
				return;
			}
		}
	};
	m_searchObj.getLocationHeirarchy = function(unitCd) {
		function getLocation(location) {
			return {
				locationDisp: location.LOCATION_DISP,
				locationCd:   location.LOCATION_CD
			};
		}

		if($.isNumeric(unitCd) === false) {
			return null;
		}

		var facilities = m_controller.locations.FACILITIES;
		var curFacility = null;
		var curBuilding = null;
		var curUnit     = null;

		for(var i=0, iLen=facilities.length; i<iLen; i++) {
			curFacility = facilities[i];
			if(curFacility.BUILDINGS === null) {
				continue;
			}
			for(var j=0, jLen=curFacility.BUILDINGS.length; j<jLen; j++) {
				curBuilding = curFacility.BUILDINGS[j];
				if(curBuilding.UNITS === null) {
					continue;
				}
				for(var k=0, kLen=curBuilding.UNITS.length; k<kLen; k++) {
					curUnit = curBuilding.UNITS[k];
					if(curUnit.LOCATION_CD === unitCd) {
						return {
							facility: getLocation(curFacility),
							building: getLocation(curBuilding),
							unit:     getLocation(curUnit)
						};
					}
				}
			}
		}
		m_controller.logErrorMessages('dcp_pl_search.js', 'Hierarchy not retrieved: ' + unitCd, 'getLocationHeirarchy');
		return null;
	};
	m_searchObj.buildLocationHierarchy = function(hierarchies) {
		function createFacilities($container) {
			function createFacility(disp, cd) {
				return $('<div></div>')
							.attr('id', idPrefix + cd)
							.addClass('summaryFacility')
							.append(
								$('<span>')
									.addClass('summaryLocationTitle')
									.text(i18n.rwl.FACILITYTITLE),
								$('<span>')
									.addClass('summaryLocationName')
									.text(disp)
							);
			}

			var curFacility   = null;
			var $tempFacility = null;

			for (var i = 0, len = hierarchies.length; i < len; i++) {
			    if (hierarchies[i] !== null) {
			        curFacility = hierarchies[i].facility;
			        $tempFacility = $container.find('#' + idPrefix + curFacility.locationCd);
			        if ($tempFacility.length === 0) {
			            $container.append(createFacility(curFacility.locationDisp, curFacility.locationCd));
			        }
			    }
			}
		}
		function createBuildings($container) {
			function createStructure() {
				return $('<div>')
							.append(
								$('<span>')
									.addClass('summaryLocationTitle')
									.text(i18n.rwl.BUILDINGSTITLE),
								$('<div>')
									.addClass('buildingContainer')
							);
			}
			function createBuilding(disp, cd) {
				return $('<div>')
							.attr('id', idPrefix + cd)
							.addClass('summaryBuilding')
							.append(
								$('<span>')
									.addClass('summaryLocationName')
									.text(disp),
								$('<div>')
									.addClass('summaryLocationUnitList')
							);
			}

			var curBuilding = null;
			var $tempBuilding = null;
			$container.append(createStructure());
			for (var i = 0, len = hierarchies.length; i < len; i++) {
			    if (hierarchies[i] !== null) {
			        curBuilding = hierarchies[i].building;
			        $tempBuilding = $container.find('#' + idPrefix + curBuilding.locationCd);
			        if ($tempBuilding.length === 0) {
			            $container.find('.buildingContainer').append(createBuilding(curBuilding.locationDisp, curBuilding.locationCd));
			        }
			    }
			}
		}
		function createUnits($container) {
			function createStructure() {
				return [
					$('<span>')
						.addClass('summaryLocationTitle')
						.text(i18n.rwl.UNITSTITLE),
					$('<ul>')
						.addClass('unitList')
				];
			}
			function createUnit(disp, cd) {
				return $('<li>')
							.attr('id', idPrefix + cd)
							.addClass('summaryUnit')
							.text(disp);
			}

			var curBuilding = null;
			var curUnit = null;
			var $tempBuilding = null;
			var $tempUnit = null;

			for (var i = 0, len = hierarchies.length; i < len; i++) {
			    if (hierarchies[i] !== null) {
			        curUnit = hierarchies[i].unit;
			        $tempUnit = $container.find('#' + idPrefix + curUnit.locationCd);
			        if ($tempUnit.length === 0) {
			            curBuilding = hierarchies[i].building;
			            $tempBuilding = $container.find('#' + idPrefix + curBuilding.locationCd);
			            if ($tempBuilding.find('.summaryLocationUnitList > ul').length === 0) {
			                $tempBuilding.find('.summaryLocationUnitList').append(createStructure());
			            }
			            $tempBuilding.find('.summaryLocationUnitList > ul').append(createUnit(curUnit.locationDisp, curUnit.locationCd));
			        }
			    }
			}
		}

		var idPrefix   = 'summaryLocation';
		var $hierarchy = $('<div></div>');

		createFacilities($hierarchy);
		createBuildings($hierarchy);
		createUnits($hierarchy);

		return $hierarchy;
	};
	m_searchObj.getChildLocations = function(facilityCd, buildingCd) {
		function retrieveChildLocations() {
			var params = {'loc_request':{'location_cd': 0}};
			if($.isNumeric(buildingCd) === true) {
				params.loc_request.location_cd = buildingCd;
			} else if($.isNumeric(facilityCd) === true) {
				params.loc_request.location_cd = facilityCd;
			} else {
				return;
			}
			m_controller.makeCall('mp_dcp_get_child_locations', params, false, function(reply){
				m_controller.setChildLocations(facilityCd, buildingCd, reply.LOCATIONS);
			});
		}
		function getFacilities() {
			var facilities = [];
			if($.isArray(m_controller.locations.FACILITIES) === true) {
				facilities = m_controller.locations.FACILITIES;
			}
			return facilities;
		}
		function getBuildings(facility) {
			if($.isPlainObject(facility) === false) {
				return null;
			}
			if($.isArray(facility.BUILDINGS) === false) {
				retrieveChildLocations();
			}
			return facility.BUILDINGS;
		}
		function getUnits(building) {
			if($.isPlainObject(building) === false) {
				return null;
			}
			if($.isArray(building.UNITS) === false) {
				retrieveChildLocations();
			}
			return building.UNITS;
		}

		var childLocations = null;
		var curFacility    = null;
		var curBuilding    = null;
		var locationType   = '';
		if($.isNumeric(buildingCd) === true) {
			locationType = 'UNIT';
		} else if($.isNumeric(facilityCd) === true) {
			locationType = 'BUILDING';
		} else {
			locationType = 'FACILITY';
		}

		if(locationType === 'FACILITY') {
			childLocations = getFacilities();
		} else {
			for(var i=0, iLen=m_controller.locations.FACILITIES.length; i < iLen; i++) {
				curFacility = m_controller.locations.FACILITIES[i];
				if(curFacility.LOCATION_CD === facilityCd) {
					if(locationType === 'BUILDING') {
						childLocations = getBuildings(curFacility);
					} else {
						for(var j=0, jLen=curFacility.BUILDINGS.length; j < jLen; j++) {
							curBuilding = curFacility.BUILDINGS[j];
							if(locationType === 'UNIT' && curBuilding.LOCATION_CD === buildingCd) {
								childLocations = getUnits(curBuilding);
								break;
							}
						}
					}
					break;
				}
			}
		}

		return childLocations;
	};
	m_searchObj.displayChildLocations = function(facilityCd, buildingCd) {
		function displayRows(locationType, $listElement) {
			function createRow(displayText, code, selectable, isSelected) {
				var $row = $('<li>')
								.attr('id', 'location' + code)
								.addClass('locationColumnRow')
								.data('LOCATION_CD', code);
				if(selectable === false) {
					$row.append(
							$('<img>')
								.attr('src', staticContentPath + '/images/5323_collapsed_16.png'),
							$('<div>')
								.addClass('unitCntInd'),
							$('<span>')
								.text(displayText)
						);
				} else {
					$row.addClass('selectable')
						.append(
							$('<input>')
								.attr({
									'type': 'checkbox',
									'name': 'selectableLocations'
								})
								.prop('checked', isSelected)
								.val(code),
							$('<span>')
								.text(displayText)
						);
				}

				return $row;
			}
			function fnHandleOverflow(oElement) {
				if(DWL_Utils.fnIsTextOverflowed(oElement) === true) {
					$(oElement).tooltip({ content: $(oElement).text(),
										items: $(oElement),
										hide: false,
										show: false,
										tooltipClass: 'locationTooltip'})
							.addClass('hasTooltip');
			    }
			    else if($(oElement).hasClass('hasTooltip') === true) {
			    	$(oElement).removeClass('hasTooltip').tooltip('destroy');
			    }
			}

			var locations          = m_searchObj.getChildLocations(facilityCd, buildingCd);
			var numLocations       = locations.length;
			var hasLocations       = numLocations > 0;
			var rows               = [];
			var curLocation        = null;
			var isSelectableColumn = locationType === 'UNIT';
			var isSelected         = null;

			$listElement
				.siblings('.locationColumnInfoMessage').toggle(!hasLocations)
					.find('.infoMsg').toggle(hasLocations).end()
					.find('.infoMsg.none').toggle(!hasLocations);

			for(var i=0; i<numLocations; i++) {
				curLocation = locations[i];
				isSelected = (isSelectableColumn === true && curLocation.SELECTED_IND === true);
				rows.push(createRow(curLocation.LOCATION_DISP, curLocation.LOCATION_CD, isSelectableColumn, isSelected));
			}

			$listElement.empty().append(rows);

			$listElement.find('.locationColumnRow span')
						.each(function() { fnHandleOverflow(this); })
						.resize(function() { fnHandleOverflow(this); });
		}

		var location      = '';
		var locationIndex = 0;
		var $listElem     = null;

		if($.isNumeric(buildingCd) === true) {
			location = 'UNIT';
			locationIndex = 3;
		} else if($.isNumeric(facilityCd) === true) {
			location = 'BUILDING';
			locationIndex = 2;
		} else {
			location = 'FACILITY';
			locationIndex = 1;
		}

		$listElem = $('#locationControl').find('.col' + locationIndex).find('ul');
		displayRows(location, $listElem);

		$listElem = null;
	};
	m_searchObj.buildLocations = function() {
		function buildHeader() {
			function resetInputs() {
				m_searchObj.setUnitsSelected(null, null, null, false);
				$('#locationControl')
					.find('.col1')
						.data('SELECTED_LOCATION', '')
						.find('.locationColumnOptionsSection')
							.scrollTop(0)
							.find('.selected')
								.removeClass('selected')
								.end()
							.find('.dithered')
								.removeClass('dithered')
								.end()
							.end()
						.end()
					.find('.col2')
						.data('SELECTED_LOCATION', '')
						.find('ul')
							.empty()
							.end()
						.find('.locationColumnInfoMessage')
							.show()
							.find('.infoMsg')
								.show()
								.end()
							.find('.infoMsg.none')
								.hide()
								.end()
							.end()
						.end()
					.find('.col3')
						.data('SELECTED_LOCATION', '')
						.find('ul')
							.empty()
							.end()
						.find('.locationColumnInfoMessage')
							.show()
							.find('.infoMsg')
								.show()
								.end()
							.find('.infoMsg.none')
								.hide();

				$('#LOCATIONS')
					.find('.locationLookbackHeader')
						.children('.clearSection')
							.click();
			}
			return $('<div>')
						.addClass('sectionHeader')
						.append(
							$('<span>')
								.text(i18n.rwl.LOCATION),
							$('<span>')
								.addClass('clearSection')
								.text(i18n.rwl.CLEAR)
								.click(resetInputs)
						);
		}
		function buildControl() {
			var columnCount = 0;
			function buildColumn(title, infoMsg, emptyMsg, isSelectableColumn) {
				columnCount++;
				function buildHeader() {
					return $('<div>')
								.addClass('locationColumnHeader')
								.append(
									$('<span>')
										.addClass('locationColumnTitle')
										.text(title),
									$('<div>')
										.addClass('locationColumnSelectedInd')
								);
				}
				function buildSecondaryHeader() {
					if(isSelectableColumn === false) {
						return $();
					}
					return $('<div>')
								.addClass('locationColumnSecondaryHeader')
								.append(
									$('<span>')
										.addClass('secondaryClear')
										.text(i18n.rwl.CLEAR)
										.click(function() {
											var $unitColumn     = $(this).closest('.locationColumn');
											var $buildingColumn = $unitColumn.prev('.locationColumn');
											var $facilityColumn = $buildingColumn.prev('.locationColumn');
											var facilityCd      = $facilityColumn.data('SELECTED_LOCATION');
											var buildingCd      = $buildingColumn.data('SELECTED_LOCATION');

											m_searchObj.setUnitsSelected(facilityCd, buildingCd, null, false);
											$unitColumn.find('input:checked').prop('checked', false);
											$(this).closest('.sectionContent').trigger('updateSection');

											if(m_searchObj.areLocationsSelected() === true) {
												$facilityColumn
													.find('li:not(.selected)')
														.addClass('dithered');
											} else {
												$facilityColumn
													.find('li.dithered')
														.removeClass('dithered');
											}

											$unitColumn     = null;
											$buildingColumn = null;
											$facilityColumn = null;
										})
								);
				}
				function buildOptionsSection() {
					function buildInfoMessage() {
						return $('<div>')
									.addClass('locationColumnInfoMessage')
									.append(
										$('<span>')
											.addClass('infoMsg')
											.text(infoMsg),
										$('<span>')
											.addClass('infoMsg none')
											.text(emptyMsg)
											.hide()
									);
					}

					return $('<div>')
								.addClass('locationColumnOptionsSection')
								.append(
									buildInfoMessage(),
									$('<ul>')
										.click(function(event) {
											function isFacilityDisabled(facilityCd) {
												function isAnyUnitSelected(units) {
													if($.isArray(units) === false) {
														return false;
													}
													for(var i=0, len=units.length; i<len; i++) {
														if(units[i].SELECTED_IND === true) {
															return true;
														}
													}
													return false;
												}
												function isAnyBuildingsUnitsSelected(buildings) {
													if($.isArray(buildings) === false) {
														return false;
													}
													for(var i=0, len=buildings.length; i<len; i++) {
														if(isAnyUnitSelected(buildings[i].UNITS) === true) {
															return true;
														}
													}
													return false;
												}
												function isClickedFacilitysUnitsSelected(facilities) {
													if($.isArray(facilities) === false) {
														return false;
													}
													for(var i=0, len=facilities.length; i<len; i++) {
														if(facilities[i].LOCATION_CD === facilityCd && isAnyBuildingsUnitsSelected(facilities[i].BUILDINGS) === true) {
															return true;
														}
													}
													return false;
												}

												if($.isPlainObject(m_controller.locations) === false || $.isNumeric(facilityCd) === false || facilityCd < 0) {
													return false;
												}

												return isClickedFacilitysUnitsSelected(m_controller.locations.FACILITIES);
											}

											var $curColumn      = $(this).closest('.locationColumn');
											var $target         = $(event.target);
											var $facilityColumn = null;
											var $buildingColumn = null;
											var $unitColumn     = null;
											var isFacilityColumnClicked = $curColumn.hasClass('col1') === true;
											var isBuildingColumnClicked = $curColumn.hasClass('col2') === true;
											var isUnitColumnClicked     = $curColumn.hasClass('col3') === true;
											var NO_SELECTED_LOCATION    = null;

											if(isFacilityColumnClicked === true) {
												if($target.is('li') === false) {
													$target = $target.closest('li');
												}
												if($target.data('LOCATION_CD') === $curColumn.data('SELECTED_LOCATION')) { // Clicked on the currently selected Facility.
													return;
												}
												if(isFacilityDisabled($curColumn.data('SELECTED_LOCATION')) === true) {
													return;
												}

												$buildingColumn = $curColumn.next('.locationColumn');
												$unitColumn     = $buildingColumn.next('.locationColumn');

												$target
													.addClass('selected')
													.siblings('.selected')
														.removeClass('selected');
												$curColumn
													.data('SELECTED_LOCATION', $target.data('LOCATION_CD'));
												$buildingColumn
													.data('SELECTED_LOCATION', NO_SELECTED_LOCATION)
													.find('.locationColumnInfoMessage')
														.hide();
												$unitColumn
													.find('ul')
														.empty()
														.end()
													.find('.locationColumnInfoMessage')
														.show()
														.find('.infoMsg')
															.show()
															.end()
														.find('.infoMsg.none')
															.hide();
												m_searchObj.displayChildLocations($curColumn.data('SELECTED_LOCATION'), null);
											}
											else if(isBuildingColumnClicked === true) {
												if($target.is('li') === false) {
													$target = $target.closest('li');
												}
												if($target.data('LOCATION_CD') === $curColumn.data('SELECTED_LOCATION')) { // Clicked on the currently selected building.
													return;
												}

												$target
													.addClass('selected')
													.find('img')
														.attr('src', staticContentPath + '/images/arrow_white_right_click.png')
														.end()
													.siblings('.selected')
														.removeClass('selected')
														.find('img')
															.attr('src', staticContentPath + '/images/5323_collapsed_16.png');
												$curColumn.data('SELECTED_LOCATION', $target.data('LOCATION_CD'))
													.next('.locationColumn').find('.locationColumnInfoMessage').hide();
												m_searchObj.displayChildLocations($curColumn.prev('.locationColumn').data('SELECTED_LOCATION'), $curColumn.data('SELECTED_LOCATION'));
											} else if(isUnitColumnClicked === true) {
												if($target.is('input:checkbox') === false) { // If clicked elsewhere in the list item.
													$target = $target.closest('li').find('input:checkbox').prop('checked', function(undefined, val) { // Check/uncheck the checkbox and get it.
														return !val;
													});
												}

												$buildingColumn = $curColumn.prev('.locationColumn');
												$facilityColumn = $buildingColumn.prev('.locationColumn');

												var facilityCd = $facilityColumn.data('SELECTED_LOCATION');
												var buildingCd = $buildingColumn.data('SELECTED_LOCATION');
												var unitCd     = $target.closest('li').data('LOCATION_CD');
												var isSelected = $target.prop('checked');

												m_searchObj.setUnitsSelected(facilityCd, buildingCd, unitCd, isSelected);
												if(m_searchObj.areLocationsSelected() === true) {
													$facilityColumn
														.find('li:not(.selected)')
															.addClass('dithered');
												} else {
													$facilityColumn
														.find('li.dithered')
															.removeClass('dithered');
												}
												$target.closest('.sectionContent').trigger('updateSection');
											}

											$curColumn      = null;
											$target         = null;
											$facilityColumn = null;
											$buildingColumn = null;
											$unitColumn     = null;
										})
								);
				}

				return $('<div>')
							.addClass('locationColumn')
							.addClass('col' + columnCount.toString())
							.append(
								buildHeader(),
								buildSecondaryHeader(),
								buildOptionsSection()
							);
			}

			return $('<div>')
						.attr('id', 'locationControl')
						.addClass('locationControl')
						.append(
							buildColumn(i18n.rwl.FACILITY, '', i18n.rwl.NOFACILITIESFOUND, false),
							buildColumn(i18n.rwl.BUILDING, i18n.rwl.INFOMSGBUILDING, i18n.rwl.NOBUILDINGSFOUND, false),
							buildColumn(i18n.rwl.UNIT, i18n.rwl.INFOMSGUNIT, i18n.rwl.NOUNITSFOUND, true)
						);
		}
		function buildLookbackRange() {

			var elemIds = {
				past: 'locationLookbackPast',
				timeUnit: 'locationLookbackTimeUnit'
			};
			function buildHeader() {
				function resetInputs() {
					$('#' + elemIds.past).val('').keyup();
					$('#' + elemIds.timeUnit).val('0').change();
				}

				return $('<div>')
							.addClass('locationLookbackHeader')
							.append(
								$('<span>')
									.addClass('requiredIndicator')
									.text('*'),
								$('<span>')
									.addClass('locationLookbackTitle')
									.text(i18n.rwl.LOOKBACKRANGE),
								$('<span>')
									.addClass('clearSection hidden')
									.text(i18n.rwl.CLEAR)
									.click(resetInputs)
							);
			}
			function buildInput() {
				function buildPast() {
					function setModifiedData(parentEntityId, parentEntityName, argumentName, argumentValue) {
						m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
						var aoLocationData = m_modifiedData.LOCATIONS;
						var iLocationLength = aoLocationData.length;

						for(var i = 0; i < iLocationLength; i++) {
							if(aoLocationData[i].ARGUMENT_NAME === 'LOCATIONDAYS' ||
								aoLocationData[i].ARGUMENT_NAME === 'LOCATIONWEEKS' ||
								aoLocationData[i].ARGUMENT_NAME === 'LOCATIONMONTHS') {
								aoLocationData.splice(i,1);
								break;
							}
						}

						aoLocationData.push({
							'PARENT_ENTITY_ID':parentEntityId,
							'PARENT_ENTITY_NAME':parentEntityName,
							'ARGUMENT_NAME':argumentName,
							'ARGUMENT_VALUE':argumentValue.toString()
						});
					}
					function updateModifiedData(iRangeBack, iTimeUnit) {
						if(($.isNumeric(iRangeBack) === false || typeof iRangeBack !== 'number') || ($.isNumeric(iTimeUnit) === false || typeof iTimeUnit !== 'number')) {
							return;
						}

						if($.isArray(m_modifiedData.LOCATIONS) === false) {
							initModifiedData();
						}

						var sArgName    = '';

						switch(iTimeUnit) {
							case 0:
								sArgName = 'LOCATIONDAYS';
								break;
							case 1:
								sArgName = 'LOCATIONWEEKS';
								break;
							case 2:
								sArgName = 'LOCATIONMONTHS';
								break;
						}

						if(iRangeBack >= 0 && sArgName.length > 0) {
							setModifiedData(0, '', sArgName, iRangeBack);
							updateSection();
						}
					}
					function resetModifiedData() {
						m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
						var aoLocationData = m_modifiedData.LOCATIONS;
						var iLocationLength = aoLocationData.length;

						for(var i = 0; i < iLocationLength; i++) {
							if(aoLocationData[i].ARGUMENT_NAME === 'LOCATIONDAYS' ||
								aoLocationData[i].ARGUMENT_NAME === 'LOCATIONWEEKS' ||
								aoLocationData[i].ARGUMENT_NAME === 'LOCATIONMONTHS') {
								aoLocationData.splice(i,1);
								break;
							}
						}
					}

					return $('<div>')
								.addClass('locationLookbackPast')
								.append(
									$('<span>')
										.addClass('locationLookbackLabel')
										.text(i18n.rwl.PAST),
									$('<input>')
										.attr({
											'id': elemIds.past,
											'type': 'text',
											'maxlength': m_maxDigits.Days
										})
										.bind('keypress paste', getKeyPressValidatorEvent())
										.addClass('textInputHeight')
										.keyup(function() {
											var $pastInput     = $(this);
											var $timeUnitDrop  = $('#' + elemIds.timeUnit);
											var rangeBack      = $pastInput.val();
											var rangeBackNum   = parseInt(rangeBack, 10);
											var timeUnits      = $timeUnitDrop.val();
											var timeUnitsNum   = parseInt(timeUnits, 10);
											var isInvalidInput = m_controller.isValidRangeInput(rangeBack, timeUnits) === false || (rangeBackNum === 0 && timeUnitsNum !== 0) === true;

											$pastInput.toggleClass('divInputError', isInvalidInput);
											$timeUnitDrop.siblings('.invalidEntry').toggle(isInvalidInput);
											if(isInvalidInput === false && rangeBack !== '') {
												updateModifiedData(rangeBackNum, timeUnitsNum);
											} else {
												resetModifiedData();
											}
											m_searchDialog.enablePrevNextBtns();

											$pastInput    = null;
											$timeUnitDrop = null;
										})
								);
				}
				function buildTimeUnit() {
					var pastMaxId = 'locationLookbackPastMax';
					return $('<div>')
								.addClass('locationLookbackTimeUnit')
								.append(
									$('<div>')
										.addClass('locationLookbackLabel')
										.text(i18n.rwl.TIMEUNIT),
									$('<div>')
										.addClass('locationLookbackUnitContainer')
										.append(
											$('<select>')
												.attr('id', elemIds.timeUnit)
												.addClass('durationDrop')
												.append(
													$('<option>')
														.val('0')
														.text(i18n.rwl.DAYS),
													$('<option>')
														.val('1')
														.text(i18n.rwl.WEEKS),
													$('<option>')
														.val('2')
														.text(i18n.rwl.MONTHS)
												).change(function() {
													var $timeUnitDrop = $(this);
													var maxText       = '';

													switch($timeUnitDrop.val()) {
														case '0':
															maxText = i18n.rwl.DAYSMAX;
															break;
														case '1':
															maxText = i18n.rwl.WEEKSMAX;
															break;
														case '2':
															maxText = i18n.rwl.MONTHSMAX;
															break;
													}
													$('#' + pastMaxId).text(maxText);
													$('#' + elemIds.past).keyup();

													$timeUnitDrop = null;
												}),
											$('<span>')
												.attr('id', pastMaxId)
												.text(i18n.rwl.DAYSMAX),
											$('<span>')
												.addClass('invalidEntry')
												.text(i18n.rwl.INVALIDENTRY)
										)
								);
				}
				return $('<div>')
							.attr('id', 'locationLookbackRangeInputContainer')
							.addClass('locationLookbackRangeInputContainer')
							.append(
								buildPast(),
								buildTimeUnit()
							);
			}
			return $('<div>')
						.addClass('locationLookbackRangeContainer')
						.append(
							buildHeader(),
							buildInput()
						);
		}
		function initModifiedData() {
			m_modifiedData.LOCATIONS = [];
		}
		function updateSection() {
			if(m_searchObj.isLocationsComplete() === false) {
				$('#wklLocationsText').empty();
				$('#summaryLOCATIONS').hide();
				m_searchDialog.enablePrevNextBtns();
				return;
			}
			m_modifiedData.LOCATIONS = m_modifiedData.LOCATIONS || [];
			var locationData     = m_modifiedData.LOCATIONS;
			var locationLength   = locationData.length;
			var lookbackRange    = '';
			var lookbackUnits    = '';
			var locationCds      = [];

			for(var i = 0; i < locationLength; i++) {
				switch(locationData[i].ARGUMENT_NAME) {
					case 'LOCATIONDAYS':
						lookbackRange = locationData[i].ARGUMENT_VALUE;
						lookbackUnits = i18n.rwl.DAYS;
						break;
					case 'LOCATIONWEEKS':
						lookbackRange = locationData[i].ARGUMENT_VALUE;
						lookbackUnits = i18n.rwl.WEEKS;
						break;
					case 'LOCATIONMONTHS':
						lookbackRange = locationData[i].ARGUMENT_VALUE;
						lookbackUnits = i18n.rwl.MONTHS;
						break;
					case 'LOCATIONUNITS':
						locationCds.push(locationData[i]);
						break;
				}
			}

			 var lookbackDisplay  = i18n.rwl.PASTTEXT.replace('{32}', lookbackRange)
			.replace('{33}', lookbackUnits);
			var $summaryLookback = $('<span>').text(lookbackDisplay);
			var curLocId = 0;
			var locHierarchies = [];
			var $hierarchy = null;
			for(var i=0, numLocations=locationCds.length; i<numLocations; i++) {
				curLocId = locationCds[i].PARENT_ENTITY_ID;
				locHierarchies.push(m_searchObj.getLocationHeirarchy(curLocId));
			}
			$hierarchy = m_searchObj.buildLocationHierarchy(locHierarchies);
			$('#wklLocationsText').empty().append($summaryLookback).append($hierarchy);
			$('#summaryLOCATIONS').show();
		}
		function setSectionData() {
			var aiUnitCds = [];
			var oTempHierarchy = null;
			var iLookBackRange = 0;
			var iLookBackUnits = 0;
			var i = 0;
			var iLen = 0;
			var iCurFacility = 0;
			var iCurBuilding = 0;
			for(i=0, iLen=m_modifiedData.LOCATIONS.length; i<iLen; i++) {
				switch(m_modifiedData.LOCATIONS[i].ARGUMENT_NAME) {
					case 'LOCATIONUNITS':
						aiUnitCds.push(m_modifiedData.LOCATIONS[i].PARENT_ENTITY_ID);
						break;
					case 'LOCATIONDAYS':
						iLookBackUnits = 0;
						iLookBackRange = m_modifiedData.LOCATIONS[i].ARGUMENT_VALUE;
						break;
					case 'LOCATIONWEEKS':
						iLookBackUnits = 1;
						iLookBackRange = m_modifiedData.LOCATIONS[i].ARGUMENT_VALUE;
						break;
					case 'LOCATIONMONTHS':
						iLookBackUnits = 2;
						iLookBackRange = m_modifiedData.LOCATIONS[i].ARGUMENT_VALUE;
						break;
				}
			}

			$('#locationLookbackPast').val(iLookBackRange);
			$('#locationLookbackTimeUnit').val(iLookBackUnits).change();

			for(i=0, iLen=aiUnitCds.length; i<iLen; i++) {
				if($.isNumeric(aiUnitCds[i]) === false) {
					continue;
				}
				oTempHierarchy = m_searchObj.getLocationHeirarchy(aiUnitCds[i]);
				if($.isPlainObject(oTempHierarchy) === false) {
					continue;
				}
				if(iCurFacility !== oTempHierarchy.facility.locationCd) {
					iCurFacility = oTempHierarchy.facility.locationCd;
					$('#location' + iCurFacility).click();
				}
				if(iCurBuilding !== oTempHierarchy.building.locationCd) {
					iCurBuilding = oTempHierarchy.building.locationCd;
					$('#location' + iCurBuilding).click();
				}
				$('#location' + oTempHierarchy.unit.locationCd).click();
			}

			updateSection();
		}

		return [
			buildHeader(),
			$('<div>')
				.addClass('sectionContent')
				.bind('updateSection', updateSection)
				.bind('setSectionData', setSectionData)
				.append(
					buildControl(),
					buildLookbackRange()
				)
		];
	};

	this.buildCriteriaContent = function() {
		$m_criteriaContent = $('<div id="contentCriteria">');
		$m_criteriaContent.append($('<div id="criteriaLeftPane">')
									.append($("<span>" + i18n.rwl.SELECTCATEGORY + "</span>")),
								$("<div id='criteriaRightPane'>"));
		var tableHtml = [],
			customizeFiltersLength = bedrock_prefs.CUSTOMIZE_FILTERS.length;
		tableHtml.push("<table id='criteriaList'><tbody>");
		for(var i=0,len=m_sections.length; i<len; i++){
			var curSection = m_sections[i],
				sectionClass = curSection.classname || '';
			if(curSection.title && curSection.displayTab === 'criteria') {
				if(customizeFiltersLength === 0 || $.inArray(curSection.name, m_controller.availableFilters) > -1) {
					tableHtml.push("<tr id='section" + curSection.name + "'><td><div><img class='completeImg' src='" + staticContentPath + "/images/Checkmark_grey_13x10.png'/>" +
									"<img class='errorImg' src='" + staticContentPath + "/images/6275_16.png'/></div>" +
						"<span>" + curSection.title + "</span></td></tr>");
				}
				$('<div id="' + curSection.name + '" ' + getClassString(sectionClass) +  '>')
					.append($("<div class='sectionHeader'>")
								.append($("<span>" + curSection.title + "</span>"),
										$("<div>" + i18n.rwl.CLEAR + "</div>")
											.click(clearData)),
							$("<div class='sectionContent rightPaneContent'>"))
					.appendTo($m_criteriaContent.find("#criteriaRightPane"));
			}
		}
		tableHtml.push("</tbody></table>");
		$m_criteriaContent.find("#criteriaLeftPane")
							.append($(tableHtml.join(""))
										.on("click", "tr", function() {
											var $row = $(this);
											var $content = $("#criteriaRightPane");
											var $rows = $("#criteriaList tr");
											var $prevRow = $rows.filter(".selected");

											var id = $row.attr("id").replace("section", "");
											$content.children().hide();
											if($prevRow.length > 0 && $prevRow.find(".completeImg").is(":visible") == false) {
												var prevId = $prevRow.attr("id").replace("section", "");
												m_controller.removeDynamicFilterToolTip('#' + prevId + ' .checkContent');
												$("#" + prevId).find(".sectionContent").trigger("clearSectionData");
											}
											$rows.removeClass();
											$content.find("#" + id).show();
											m_controller.addDynamicFilterToolTip('#' + id + ' .checkContent');
											$row.addClass("selected");
										}));
		return $m_criteriaContent;
	};
	function getClassString(className) {
		return className ? 'class = "' + className + '"' : '';
	}

	this.buildSummaryContent = function() {
		$m_summaryContent = $("<div id='contentSummary'>");
		var criteriaHtml = "";
		for(var m = 0, mlen = m_sections.length; m < mlen; m++) {
			if(m_sections[m].displayTab == 'criteria') {
				criteriaHtml += "<div class='summaryDiv' id='summary" + m_sections[m].name + "'>";
				criteriaHtml += '<div class="summaryLabel">' + m_sections[m].title + i18n.rwl.COLON + '</div>';
				criteriaHtml += '<div class="summaryText"></div>';
				criteriaHtml += '</div>';
			}
		}
		$m_summaryContent.append(
				$("<div id='summaryWklType'>")
					.append($("<div class='summaryHeader'><span>" + i18n.rwl.WKLTYPEW + "</span></div>"),
							$("<div class='summaryContent'>")
								.append($("<div class='summaryDiv' id='summaryWklNameInput'>")
											.append($('<div class="summaryLabel">' + i18n.rwl.WKLNAME + '</div>'),
													$("<div class='summaryText' id='wklNameText'></div>")),
										$("<div class='summaryDiv' id='summaryACMPRSNLGROUPS'>")
											.append($('<div class="summaryLabel">' + i18n.rwl.GROUPS + '</div>'),
													$("<div class='summaryText' id='wklGroupText'></div>")),
										$("<div class='summaryDiv' id='summarySINGLEPROVIDER'>")
											.append($('<div class="summaryLabel">' + i18n.rwl.PROVIDERS + '</div>'),
													$("<div class='summaryText' id='wklProviderText'></div>")),
										$("<div class='summaryDiv' id='summaryPPRCODES'>")
											.append($('<div class="summaryLabel">' + i18n.rwl.RELATIONSHIPTYPES + '</div>'),
													$('<div class="summaryText" id="wklRelationshipText"></div>')),
										$('<div class="summaryDiv" id="summaryEPRCODES">')
											.append($('<div class="summaryLabel">' + i18n.rwl.RELATIONSHIPTYPES + '</div>'),
													$('<div class="summaryText" id="wklVisitRelationshipText"></div>')),
										$('<div class="summaryDiv" id="summaryLOCATIONS">')
											.append($('<div class="summaryLabel">' + i18n.rwl.LOCATIONTITLE + '</div>'),
													$('<div class="summaryText" id="wklLocationsText"></div>')),
										$('<div class="summaryDiv" id="summaryAUTOREMOVEPATIENTS">')
											.append($('<div class="summaryLabel summaryInfoImg">' + i18n.rwl.AUTOREMOVETEXT + i18n.rwl.COLON + '</div>')
											.mouseenter(function(event) {
												displayAutoRemoveToolTip(event, $('#rwSearchDlgTooltip'), i18n.rwl.AUTOSUMTOOLTIP);
											})
											.mouseleave(function() {
												hideTooltip($('#rwSearchDlgTooltip'));
											}),
											$('<div class="summaryText" id="wklAutoRemoveText"></div>')))),
				$('<div id="summaryCriteria">')
					.append($('<div class="summaryHeader"><span>' + i18n.rwl.CRITERIAW + '</span></div>'),
							$('<div class="summaryContent">')
								.append(criteriaHtml)));
		return $m_summaryContent;
	};
	function clearSections() {
		var $sectionList = $("#criteriaList tr");
		var $selectedCriteria = $sectionList.find(".completeImg")
				.add($sectionList.find(".errorImg"))
				.filter(function () {
					return $(this).css('display') !== "none";
				});
		$('#criteriaRightPane').find('.sectionContent').trigger('clearSectionData');

		$('#AUTOREMOVEPATIENTS').find('.sectionContent')
			.trigger('clearSectionData');
		$('#wklNameInput').val('').keyup();
		$('#ACMPRSNLGROUPS').find('.sectionContent')
			.add($('#SINGLEPROVIDER').find('.sectionContent'))
			.add($('#PPRCODES').find('.sectionContent'))
			.add($('#EPRCODES').find('.sectionContent'))
			.trigger('clearSectionData');
	}

	function findChildValues(argument_value)
	{
		for(var c = 0, childArgsLength = child_arguments.length; c < childArgsLength; c++)
		{
			if(child_arguments[c].argument_value == argument_value)
				return child_arguments[c].child_values;
		}
	}
	this.populateSections = function() {
		m_controller.callFilterValuesScript(m_sections);
		m_controller.oPromise.then(function(){
			$("#bodySpinner").hide();
			if(m_controller.getRiskFlag() == 0 || m_controller.getCaseStatusFlag() === false) {
				for(var m = 0, mlen = m_sections.length, flagCnt = 0; m < mlen; m++) {
					if((m_sections[m].argument_name === 'RISK' && m_controller.getRiskFlag() === 0) ||
						(m_sections[m].argument_name === 'CASESTATUS' && m_controller.getCaseStatusFlag() === false)) {
						m_sections.splice(m, 1);
						$m_criteriaContent.find('#' + m_sections[m].argument_name).remove();
						flagCnt++;
						mlen--;
					}
					if(flagCnt === 2) { // We are searching for 2 flags here.
						break;
					}
				}
			}
			addFilterValues();
			function addFilterValues() {
				reply = m_controller.replyFromFilterValues || {};
				var prsnlGroupValues = [];
				var filterArguments = reply.ARGUMENTS || reply.FILTER_LIST || [];
				for(var i=0,iLen=filterArguments.length; i<iLen; i++){
					for(var j=0,jLen=m_sections.length; j<jLen; j++){
						if(filterArguments[i].ARGUMENT_NAME == m_sections[j].name.toUpperCase()){
							var secValues = alphaSort(filterArguments[i].AVAILABLE_VALUES,"ARGUMENT_VALUE");
							if(filterArguments[i].ARGUMENT_NAME === 'ACMPRSNLGROUPS') {
								prsnlGroupValues = alphaSort(filterArguments[i].AVAILABLE_VALUES,"ARGUMENT_VALUE");
							}
							var numCols = filterArguments[i].ARGUMENT_NAME === 'PPRCODES' || filterArguments[i].ARGUMENT_NAME === 'EPRCODES' ? 2 : 3;
							if(m_sections[j].contentBuilder)
							{
								m_sections[j].contentBuilder(m_sections[j].name, secValues, m_sections[j].title);
								break;
							}
							var secContent = [];
							secContent.push("<table><tbody>");
							for(var k=0,kLen=secValues.length; k<kLen; k++) {
								if(k%numCols === 0) {
									if(k > 0) {
										secContent.push("</tr>");
									}
									secContent.push("<tr>");
								}
								secContent.push("<td class='checkContent'><label>" +
												"<input class='checkInput' type='checkbox' value=" + secValues[k].PARENT_ENTITY_ID + " parent_name='" + secValues[k].PARENT_ENTITY_NAME + "'></input>" +
												  (filterArguments[i].ARGUMENT_NAME === 'CONDITION'?'<span class="conditionSpan">':'<span>') +
												  escapeHtmlString(secValues[k].ARGUMENT_VALUE) + "</span></label></td>");

								child_arguments.push({
									argument_value: escapeHtmlString(secValues[k].ARGUMENT_VALUE),
									child_values: secValues[k].CHILD_VALUES
								});
							}
							prsnlGroupValues.forEach(function(argument){
								child_arguments.push({
									argument_value: escapeHtmlString(argument.ARGUMENT_VALUE),
									child_values: alphaSort(argument.CHILD_VALUES,'ARGUMENT_VALUE')
								});
							});
							if(numCols === 2) {
								if(k%2 === 1) {
									secContent.push('<td class="checkContent"></td></tr>');
								}
								else if(k%2 === 2) {
									secContent.push('</tr>');
								}
							}
							else if(numCols === 3) {
								if(k%3 === 1) {
									secContent.push('<td class="checkContent"></td><td class="checkContent"></td></tr>');
								}
								else if(k%3 === 2) {
									secContent.push('<td class="checkContent"></td></tr>');
								}
							}
							secContent.push('</tbody></table>');
							if(m_sections[j].name === 'LOCATIONS') {
								break;
							}
							else if(m_sections[j].displayTab == "wklType") {
								$m_wklTypeContent.find("#" + m_sections[j].name).children(".sectionContent")
									.bind("updateSection",updateSection)
									.bind("setSectionData",setSectionData)
									.bind("clearSectionData", clearSectionData)
									.empty()
									.append($(secContent.join(""))
												.on("click", "input", function() {
													$(this).parents(".sectionContent").trigger("updateSection");
												}));
							}
							else {
								$m_criteriaContent.find("#" + m_sections[j].name).children(".sectionContent")
									.bind("updateSection",updateSection)
									.bind("setSectionData",setSectionData)
									.bind("clearSectionData", clearSectionData)
									.empty()
									.append($(secContent.join(""))
												.on("click", "input", function() {
													$(this).parents(".sectionContent").trigger("updateSection");
												}));
							}

							if(m_sections[j].name == "CONDITION")
							{
								$m_criteriaContent.find("#" + m_sections[j].name)
									.children(".sectionContent")
									.prepend($("<div id='conditionOperator' class='topContent'>" +
													"<span>" + i18n.rwl.SELECTONE + "</span>" +
													"<label><input type ='radio' name='rwConditionOperatorType' value='or' id='rwConditionOr' checked='checked' class ='rwConditionRadio'>" + i18n.rwl.OR + "</label> &nbsp;&nbsp;" +
													"<label><input type ='radio' name='rwConditionOperatorType' value='and' id='rwConditionAnd' class ='rwConditionRadio'>" + i18n.rwl.AND + " </label><br/>" +
													"</div>"));
							}
							break;
						}
					}
				}
			}

			function clearSectionData() {
				$(this).find(".checkInput").filter(":checked").removeAttr("checked").trigger("updateSection");
				var secName = $(this).parent().attr("id");
				if(secName == "CONDITION") {
					$("#rwConditionOr").attr("checked", "checked");
				}
			}
			function setSectionData() {
				var $section = $(this);
				var id = $section.parent().attr("id");

				var secArguments = m_modifiedData[id] || [];
				var conditionOperator = "or";
				for(var y =0,len = secArguments.length; y <len; y++){
					if(secArguments[y].ARGUMENT_NAME == "CONDITION_OPERATOR" && secArguments[y].ARGUMENT_VALUE == "AND") {
						conditionOperator = "and";
					}
					else {
						$section.find("input[value=" + secArguments[y].PARENT_ENTITY_ID+"]").attr('checked', true);
					}
				}
				if(id == "CONDITION") {
					if(conditionOperator == "and") {
						$("#rwConditionAnd").attr("checked", "checked");
					}
					else {
						$("#rwConditionOr").attr("checked", "checked");
					}
				}

				$section.trigger("updateSection");
			}
			function updateSection(event) {
				function fnSelectProviderTypeListRadio() {
					$('#groupProviderWklDetail:not(:checked)').prop('checked', true).change();
				}
				var $section = $(this),
					id = $section.parent().attr('id'),
					$checked = $section.find('input:checked'),
					checkedText = '',
					secArguments = [],
					isRelationshipSection = (id === 'PPRCODES' || id === 'EPRCODES');
				if ($checked.length > 0) {
					if (id === 'PPRCODES') {
						fnSelectProviderTypeListRadio();
						$('#pprTab').find('input').prop('checked', true);
						$('#PPRCODES').show();
						$('#EPRCODES').hide();
						m_modifiedData.EPRCODES = [];
					} else if (id === 'EPRCODES') {
						fnSelectProviderTypeListRadio();
						$('#eprTab').find('input').prop('checked', true);
						$('#EPRCODES').show();
						$('#PPRCODES').hide();
						m_modifiedData.PPRCODES = [];
					}
				}
				if(id === 'LOCATIONS') {
					$('#locationWklDetail:not(:checked)').prop('checked', true).change();
				}

				$checked.each(function() {
					var $item = $(this);
					if($item.hasClass("rwConditionRadio"))
					{
						var argument_value = "";
						if($item.attr("id") == "rwConditionOr") {
							argument_value = "OR";
						}
						else {
							argument_value = "AND";
						}
						secArguments.push({
							ARGUMENT_NAME: "CONDITION_OPERATOR",
							ARGUMENT_VALUE: argument_value,
							PARENT_ENTITY_ID:0.0,
							PARENT_ENTITY_NAME:""
						});
					}
					else
					{
						var siblingspantext = $item.siblings("span").text();
						secArguments.push({
							ARGUMENT_NAME:id,
							ARGUMENT_VALUE:siblingspantext,
							PARENT_ENTITY_ID:parseFloat($item.val()),
							PARENT_ENTITY_NAME:$item.attr("parent_name"),
							CHILD_ARGUMENTS: findChildValues(siblingspantext)
						});
						if(checkedText.length === 0) {
							checkedText = siblingspantext;
						}
						else {
							checkedText += ", " + siblingspantext;
						}
					}
				});
				m_modifiedData[id] = secArguments;
				selectedWKLTypeSummary(id, checkedText);

				$("#section" + id).find(".completeImg").toggle(checkedText.length > 0);

				if (isRelationshipSection === true || id === 'LOCATIONS') {
					m_searchDialog.enablePrevNextBtns();
				}
				m_searchDialog.enableSaveButton();
			}
		});
	};
	function selectedWKLTypeSummary(id, checkedText) {
		var $summaryElement = $('#summary' + id),
			$summaryElementText = $summaryElement.find('.summaryText').text(checkedText);
		if (id === 'PPRCODES') {
			$summaryElementText
				.prepend('<span class="boldText paddedRight">' + i18n.rwl.LIFETIMERELATIONSHIP + i18n.rwl.COLON + '</span>');
			$('#summaryEPRCODES').hide();
		} else if (id === 'EPRCODES') {
			$summaryElementText
				.prepend('<span class="boldText paddedRight">' + i18n.rwl.VISITRELATIONSHIP + i18n.rwl.COLON + '</span>');
			$('#summaryPPRCODES').hide();
		}
		$summaryElement.toggle(checkedText.length > 0);
	}
	function enableRelationships() {
		function addDither() {
			$('#relationsRightColOverlay').show();
		}
		function removeDither() {
			$('#relationsRightColOverlay').hide();
		}
		var selectedProvidersLength = $('#SINGLEPROVIDER').find('input:checked').length,
			selectedGroupsLength = $('#ACMPRSNLGROUPS').find('input:checked').length,
			$wklTypeRightPane = $('#wklTypeRightPane'),
			$relationsContent = $wklTypeRightPane.find('.providerRel'),
			selectedEPRLength,
			selectedPPRLength;

		if (selectedGroupsLength > 0 || selectedProvidersLength > 0) {
			$relationsContent.show();
			removeDither();
			if ($wklTypeRightPane.find('input[type=radio]:checked').length === 0) {
				$('#pprTab').find('input:radio').prop('checked', true);
			}
		} else {
			resetRelationshipTabs();
			addDither();
			selectedEPRLength = $('#EPRCODES').find('input:checked').length;
			selectedPPRLength = $('#PPRCODES').find('input:checked').length;
			if (selectedEPRLength === 0) {
				m_modifiedData['EPRCODES'] = [];
				selectedWKLTypeSummary('EPRCODES', '');
			}
			if (selectedPPRLength === 0) {
				m_modifiedData['PPRCODES'] = [];
				selectedWKLTypeSummary('PPRCODES', '');
			}
		}
	}
	function resetRelationshipTabs() {
		$('#wklTypeRightPane').find('input[type=checkbox]:checked').prop('checked', false);
		$('#EPRCODES').hide();
		$('#PPRCODES').show();
		$('#pprTab').find('input[name=relTabs]').prop('checked', true);
		$('#eprTab').find('input[name=relTabs]').prop('checked', false);
	}
	function buildProviderGroupContent(name, content) {
		var secContent = [],
			contentLength = content.length;
		secContent.push('<div class="clearSection">' + i18n.rwl.CLEAR + '</div>');
		secContent.push('<div class="providerGroupList"><table><tbody>');
		if(contentLength > 0) {
			for(var k=0; k<contentLength; k++) {
				secContent.push(
					'<tr><td class="checkContent"><label>' +
					'<input class="checkInput" type="checkbox" value=' + content[k].PARENT_ENTITY_ID + ' parent_name=' + content[k].PARENT_ENTITY_NAME.toString() + '></input>' +
					'<span>' + content[k].ARGUMENT_VALUE + '</span>' +
					'</label></td></tr>'
				);
			}
		} else {
			secContent.push('<tr><td class="centerContent ditheredText">' + i18n.rwl.NOWKLGROUPS + '</td></tr>');
		}
		secContent.push('</tbody></table></div>');
		$m_wklTypeContent.find('#' + name).children('.sectionContent')
			.bind('updateSection',updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($(secContent.join("")))
					.on("click", "input", function() {
						$(this).parents(".sectionContent").trigger("updateSection");
					})
					.on('click', '.clearSection', function() {
						$(this).closest('.sectionContent').trigger('clearSectionData');
					});

		function updateSection() {
			var $section = $(this),
				id = $section.parent().attr('id'),
				$checked = $section.find('input:checked'),
				secArguments = [],
				$checkedCountInd = $section.siblings('.sectionHeader').find('.chkCntInd'),
				checkedLength = 0,
				secArgLength = 0,
				htmlStr='',
				htmlContent='',
				tagIndex = 425,
				minLength = 430,
				stringLength=0,
				showLess='',
				showMore='';

			$checked.each(function() {
				var $item = $(this);
				var siblingspantext = $item.siblings("span").text();
				secArguments.push({
					ARGUMENT_NAME:id,
					ARGUMENT_VALUE:siblingspantext,
					PARENT_ENTITY_ID:parseFloat($item.val()),
					PARENT_ENTITY_NAME:$item.attr("parent_name"),
					CHILD_ARGUMENTS: findChildValues(siblingspantext)
				});
				secArgLength = secArguments.length;
				htmlStr += '<b>'+i18n.rwl.DWLGROUP+' '+siblingspantext +i18n.rwl.COLON +' ' +i18n.rwl.SINGLEPROVIDERS+i18n.rwl.COLON+'</b>'+' ';
				htmlStr += secArguments
					.filter(function(secArg){return (secArg.ARGUMENT_VALUE === siblingspantext);})
					.map(function(argument){return argument.CHILD_ARGUMENTS.map(function(childArgument){return childArgument.ARGUMENT_VALUE;});})
					.reduce(function(childArguments, childArgument){return childArguments.concat(childArgument);})
					.join(i18n.rwl.SEMICOLON + ' ');
				htmlStr+='<br/>';
			});
			stringLength = htmlStr.length;
			if(stringLength > minLength) {
				var subString = htmlStr.substring(tagIndex,minLength);
				var lessThanIndex = subString.indexOf('<');
				var greaterThanIndex = subString.indexOf('>');
				if(lessThanIndex !== -1) {
					lessThanIndex += tagIndex;
					showLess = htmlStr.substring(0,lessThanIndex);
					showMore = htmlStr.substring(lessThanIndex,stringLength); 
				} 
				else if(greaterThanIndex !== -1) {
					greaterThanIndex += tagIndex;
					showLess = htmlStr.substring(0,greaterThanIndex+1);
					showMore = htmlStr.substring((greaterThanIndex+1),stringLength); 
				}
				else {
					showLess = htmlStr.substring(0, minLength);
					showMore = htmlStr.substring(minLength); 
				}
				if(showMore === '<br/>') {
					htmlContent = htmlStr;
				}
				else {
					htmlContent = showLess + '<span class="moreEllipsis">' + i18n.rwl.ELLIPSIS+ '</span>'+ '<span class="moreContent">'+  showMore + '</span><span class="moreLink">' + i18n.rwl.VIEWLINKTEXT + '</span>';
				}
			}
			else {
				htmlContent = htmlStr;
			}
			checkedLength = $checked.length;
			if(checkedLength > 0) {
				$checkedCountInd.css('visibility', 'visible').text(checkedLength);
			} else {
				$checkedCountInd.css('visibility', 'hidden');
			}
			m_modifiedData[id] = secArguments;
			$('#summary' + id).find('.summaryText').html(htmlContent).end().toggle(secArgLength > 0);
			$('.moreLink').toggle(function() {
			$(this)
			.siblings('.moreEllipsis').hide().end()
			.html(i18n.rwl.VIEWLESS).siblings('.moreContent').show();
			}, function() {
			$(this)
			.siblings('.moreEllipsis').show().end()
			.html(i18n.rwl.VIEWLINKTEXT).siblings('.moreContent').hide();
			});
			enableRelationships();
			m_searchDialog.enableSaveButton();
			m_searchDialog.enablePrevNextBtns();
		}

		function setSectionData() {
			var $section = $(this);
			var id = $section.parent().attr("id");
			$section.find("input").attr('checked', false);

			var secArguments = m_modifiedData[id] || [];
			for(var y =0,len = secArguments.length; y <len; y++){
				$section.find("input[value=" + secArguments[y].PARENT_ENTITY_ID+"]").attr('checked', true);
			}
			$section.trigger("updateSection");
		}

		function clearSectionData() {
			$(this).find(".checkInput").filter(":checked").removeAttr("checked").trigger("updateSection");
		}
	}
	function buildAutoRemoveContent(name) {
		$m_wklTypeContent.find('#' + name).children('.sectionContent')
			.bind('updateSection',updateSection)
			.bind('setSectionData',setSectionData)
			.bind('clearSectionData', clearSectionData)
			.html($('<div id="autoRemoveSelection">')
					.append($('<label><input type="checkbox" name="autoRemoveChk" id="autoRemoveCheck" class="checkInput">' + i18n.rwl.AUTOREMOVETEXT + '</label>')
					.mouseenter(function(event) {
						displayAutoRemoveToolTip(event, $('#rwSearchDlgTooltip'), i18n.rwl.AUTOCHKTOOLTIP);
					})
					.mouseleave(function() {
						hideTooltip($('#rwSearchDlgTooltip'));
					})
					.click(function() {
						$(this).parents('.sectionContent').trigger('updateSection');
					})
			));
		function updateSection() {
			var $section = $(this),
				id = $section.parent().attr('id'),
				autoRemove = $section.find('input').is(':checked'),
				secArguments = [],
				summaryText = '';

			if(autoRemove === true) {
				secArguments.push({
					ARGUMENT_NAME:id,
					ARGUMENT_VALUE:'',
					PARENT_ENTITY_ID:+autoRemove,
					PARENT_ENTITY_NAME:id
				});
				summaryText = i18n.rwl.YES;
			}
			m_modifiedData[name] = secArguments;

			$('#summaryAUTOREMOVEPATIENTS')
					.find('.summaryText').text(summaryText).end()
					.toggle(autoRemove);
		}
		function setSectionData() {
			var $section = $(this),
				id = $section.parent().attr('id'),
				secArguments = m_modifiedData[id] || [];

			for(var i = 0, len = secArguments.length; i < len; i++) {
				if(typeof secArguments[i] !== 'undefined' && secArguments[i] !== null) {
					$section.find('input').prop('checked', !!secArguments[i].PARENT_ENTITY_ID);
				}
			}
			$section.trigger('updateSection');
		}

		function clearSectionData() {
			$(this).find('.checkInput').prop('checked', false).trigger('updateSection');
		}
	}

	function buildSingleProviderContent(name) {
		$m_wklTypeContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($('<div id="singleProviderSearch" class="singleProviderSearch">')
				.append($('<div class="clearSection">' + i18n.rwl.CLEAR + '</div>')),
					$('<div class="singleProviderSearchInptWrapper">').append(m_controller.createSearchControl()),
					$('<div id="singleProviderList" class="providerList">')
				)
				.on('prsnlSelected',null,function(event,dPrsnlId,sName) {
					insertProvCheckbox(dPrsnlId,sName,$(this));
				})
				.on('click', '.clearSection', function() {
					$(this).closest('.sectionContent').trigger('clearSectionData');
				});
		function updateSection(){
			var $section = $(this),
				id = $section.parent().attr('id'),
				$checked = $section.find(':checked'),
				checkedText = '',
				secArguments = [],
				singleProviderNames = [],
				$checkedCountInd = $section.siblings('.sectionHeader').find('.chkCntInd'),
				checkedLength = 0;

			$checked.each(function() {
				var $item = $(this);
				var siblingspantext = $item.siblings("span").text();
				secArguments.push({
					ARGUMENT_NAME:id,
					ARGUMENT_VALUE:siblingspantext,
					PARENT_ENTITY_ID:parseFloat($item.val()),
					PARENT_ENTITY_NAME:$item.attr("parent_name"),
					CHILD_ARGUMENTS: findChildValues(siblingspantext)
				});
				singleProviderNames.push(siblingspantext);
			});
			checkedLength = $checked.length;
			if(checkedLength > 0) {
				$checkedCountInd.css('visibility','visible').text(checkedLength);
			} else {
				$checkedCountInd.css('visibility','hidden');
			}
			m_modifiedData[id] = secArguments;
			checkedText = singleProviderNames.sort().join(i18n.rwl.SEMICOLON + ' ');
			$("#summary" + id).find(".summaryText").text(checkedText).end().toggle(checkedText.length > 0);
			enableRelationships();

			m_searchDialog.enableSaveButton();
			m_searchDialog.enablePrevNextBtns();
		}

		function setSectionData(){
			var $section = $(this);
			var id = $section.parent().attr("id");
			$section.find("input").attr('checked', false);

			var secArguments = m_modifiedData[id] || [];
			for(var y =0,len = secArguments.length; y <len; y++){
				insertProvCheckbox(secArguments[y].PARENT_ENTITY_ID,secArguments[y].ARGUMENT_VALUE,$section);
			}
		}

		function clearSectionData() {
			$('#singleProviderList').empty().hide();
			$('#singleProviderSearch').find('.searchCtrlInput').val('');

			$(this).removeData().trigger('updateSection');
		}

		function insertProvCheckbox(dPrsnlId,sName,$section){
			var $singleProviderList = $('#singleProviderList');

			dPrsnlId = dPrsnlId.toString();
			if($section.data(dPrsnlId)){
				return;
			}
			var $html = $("<div class='singleProviderSelection'>")
							.append($("<label class='leftFloat'><input class='hidden-checkbox' type='checkbox' checked='true' value=" + dPrsnlId + " parent_name='" + escape(sName) + "'></input>" +
										"<span>" + sName + "</span></label>"),
									$("<div class='prsnlRemoveImg'></div>")
										.click(function() {
											var $item = $(this).parent();
											var $secContent = $item.parents(".sectionContent");
											var $checkbox = $item.find(".hidden-checkbox");
											var dPrsnlId = $checkbox.val();
											$item.remove();
											if($singleProviderList.is(':empty')) {
												$singleProviderList.hide();
											}
											$secContent.removeData(dPrsnlId)
												.trigger("updateSection");
										}))
							.hover(function() {
								$(this).find(".prsnlRemoveImg").toggle();
							});
			$section.data(dPrsnlId,sName);
			$singleProviderList.append($html).show();

			$section.trigger('updateSection');
		}
	}

	function buildAdmissionContent(name) {
		var selectContent = [
			"<select id='rwAdmissionDropDown' class='leftFloat'>",
			"<option value='ADMISSIONDAYS' title='" + i18n.rwl.DAYSMAX + "' label='Days'>" + i18n.rwl.DAYS + "</option>",
			"<option value='ADMISSIONWEEKS' title='" + i18n.rwl.WEEKSMAX + "' label='Weeks'>" + i18n.rwl.WEEKS + "</option>",
			"<option value='ADMISSIONMONTHS' title='" + i18n.rwl.MONTHSMAX + "' label='Months'>" + i18n.rwl.MONTHS + "</option>",
			"</select>"
		];
		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($("<div class='multiInputContent'>")
						.append($("<span>" + i18n.rwl.PAST + "<br/></span>"),
							$("<input id='createAdmissionInput' class='leftFloat textInputHeight' type='text' maxlength='" + m_maxDigits.Days + "'/>")
								.bind("keydown paste",function(e){
									var $input = $(this);
									setTimeout(function(){
										var newVal = $input.val().replace(/[^0-9]/g,"");
										if(newVal != $input.val()){
											$input.val(newVal);
										}

										var $section = $input.parent();
										var maxVal = parseInt($section.find("option:selected").attr("title").match(/[0-9]*/), 10);
										if(parseInt(newVal, 10) > maxVal){
											$input.add($input.siblings(".maxText")).addClass("maxExceeded").siblings(".invalidEntry").show();
											$("#sectionADMISSION").find(".errorImg").show();
										}else{
											$input.add($input.siblings(".maxText")).removeClass("maxExceeded").siblings(".invalidEntry").hide();
											$("#sectionADMISSION").find(".errorImg").hide();
										}
										$input.parents(".sectionContent").trigger("updateSection");
									},0);
								})
								.change(function(){
									var $input = $(this);
									if($input.val().length <= 0){
										$input.add($input.siblings(".maxText")).removeClass("maxExceeded");
									}
									$input.parents(".sectionContent").trigger("updateSection");
								}),
						$(selectContent.join(""))
							.change(function(){
								var $select = $(this);
								$select.siblings("input").change().keydown();
								$select.siblings("span.maxText").text($select.children("option:selected").attr("title"));
								$select.parents(".sectionContent").trigger("updateSection");
							}),
						$("<span class='maxText'/>"),
						$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>"))
						.each(function(){
							$(this).children("span.maxText").text($(this).find("option:selected").attr("title"));
						}));

		function clearSectionData() {
			$("#rwAdmissionDropDown").val("ADMISSIONDAYS").change();
			$("#createAdmissionInput").val("");
			$(this).trigger("updateSection");
		}
		function setSectionData(){
			var $section = $(this);
			var id = $section.parent().attr("id");
			var secArguments = m_modifiedData[id] || [];
			for(var y = 0, len = secArguments.length; y < len; y++){
				if(typeof secArguments[y] !== "undefined" && secArguments[y] !== null){
					$section.find("input").val(secArguments[y].ARGUMENT_VALUE);
					$section.find("select").val(secArguments[y].ARGUMENT_NAME).change();
				}
			}
		}
		function updateSection(){
			var $section = $(this);
			var inputVal = $section.find("input").val();
			var inputMax = parseInt($section.find("option:selected").attr("title").match(/[0-9]*/), 10);
			var secArguments = [];
			if(inputVal){
				var pastText = i18n.rwl.PASTTEXT.replace("{32}",inputVal);
				pastText = pastText.replace("{33}",$section.find("option:selected").text());

				if(inputVal <= inputMax){
					secArguments.push({
						ARGUMENT_NAME:$section.find("select").val(),
						ARGUMENT_VALUE:inputVal,
						PARENT_ENTITY_ID:0.0,
						PARENT_ENTITY_NAME:""
					});
					$("#summaryADMISSION").show().find(".summaryText").text(pastText);
					$("#sectionADMISSION").find(".completeImg").show();
				}
				else {
					$("#summaryADMISSION").hide().find(".summaryText").text("");
					$("#sectionADMISSION").find(".completeImg").hide();
				}
			}
			else {
				$("#summaryADMISSION").hide().find(".summaryText").text("");
				$("#sectionADMISSION").find(".completeImg").hide();
			}
			m_modifiedData[name] = secArguments;
			m_searchDialog.enablePrevNextBtns();
		}
	}
	function buildDischargeContent(name) {
		var selectContent = [
			'<select id="rwDischargeDropDown" class="leftFloat">',
			'<option value="DISCHARGEDAYS" title="' + i18n.rwl.DAYSMAX + '" label="Days">' + i18n.rwl.DAYS + '</option>',
			'<option value="DISCHARGEWEEKS" title="' + i18n.rwl.WEEKSMAX + '" label="Weeks">' + i18n.rwl.WEEKS + '</option>',
			'<option value="DISCHARGEMONTHS" title="' + i18n.rwl.MONTHSMAX + '" label="Months">' + i18n.rwl.MONTHS + '</option>',
			'</select>'
		];
		$m_criteriaContent.find('#' + name).children('.sectionContent')
			.bind('updateSection',updateSection)
			.bind('setSectionData',setSectionData)
			.bind('clearSectionData', clearSectionData)
			.empty()
			.append($('<div class="multiInputContent">')
						.append($('<span>' + i18n.rwl.PAST + '<br/></span>'),
							$('<input id="createDischargeInput" class="leftFloat textInputHeight" type="text" maxlength="' + m_maxDigits.Days + '"/>')
								.bind('keydown paste',function(){
									var $input = $(this);
									setTimeout(function(){
										var newVal = $input.val().replace(/[^0-9]/g,'');
										if(newVal !== $input.val()){
											$input.val(newVal);
										}

										var $section = $input.parent();
										var maxVal = parseInt($section.find('option:selected').attr('title').match(/[0-9]*/), 10);
										if(parseInt(newVal, 10) > maxVal){
											$input.add($input.siblings('.maxText')).addClass('maxExceeded').siblings('.invalidEntry').show();
											$('#sectionDISCHARGE').find('.errorImg').show();
										}else{
											$input.add($input.siblings('.maxText')).removeClass('maxExceeded').siblings('.invalidEntry').hide();
											$('#sectionDISCHARGE').find('.errorImg').hide();
										}
										$input.parents('.sectionContent').trigger('updateSection');
									},0);
								})
								.change(function(){
									var $input = $(this);
									if($input.val().length <= 0){
										$input.add($input.siblings('.maxText')).removeClass('maxExceeded');
									}
									$input.parents('.sectionContent').trigger('updateSection');
								}),
						$(selectContent.join(''))
							.change(function(){
								var $select = $(this);
								$select.siblings('input').change().keydown().end()
										.siblings('span.maxText').text($select.children('option:selected').attr('title')).end()
										.parents('.sectionContent').trigger('updateSection');
							}),
						$('<span class="maxText"/>'),
						$('<span class="invalidEntry"><br/>' + i18n.rwl.INVALIDENTRY + '</span>'))
						.each(function(){
							$(this).children('span.maxText').text($(this).find('option:selected').attr('title'));
						}));

		function clearSectionData() {
			$('#rwDischargeDropDown').val('DISCHARGEDAYS').change();
			$('#createDischargeInput').val('');
			$(this).trigger('updateSection');
		}
		function setSectionData(){
			var $section = $(this),
				id = $section.parent().attr('id'),
				secArguments = m_modifiedData[id] || [];

			for(var y = 0, len = secArguments.length; y < len; y++){
				if(typeof secArguments[y] !== 'undefined' && secArguments[y] !== null){
					$section.find('input').val(secArguments[y].ARGUMENT_VALUE).end()
							.find('select').val(secArguments[y].ARGUMENT_NAME).change();
				}
			}
		}
		function updateSection(){
			var $section = $(this),
			 	inputVal = $section.find('input').val(),
				inputMax = parseInt($section.find('option:selected').attr('title').match(/[0-9]*/), 10),
				secArguments = [],
				$summaryDischarge = $('#summaryDISCHARGE'),
				$sectionDischarge = $('#sectionDISCHARGE');

			if(inputVal && inputVal <= inputMax){
				var pastText = i18n.rwl.PASTTEXT.replace('{32}',inputVal).replace('{33}',$section.find('option:selected').text());

					secArguments.push({
						ARGUMENT_NAME:$section.find('select').val(),
						ARGUMENT_VALUE:inputVal,
						PARENT_ENTITY_ID:0.0,
						PARENT_ENTITY_NAME:''
					});
					$summaryDischarge.show().find('.summaryText').text(pastText);
					$sectionDischarge.find('.completeImg').show();
			} else {
				$summaryDischarge.hide().find('.summaryText').empty();
				$sectionDischarge.find('.completeImg').hide();
			}
			m_modifiedData[name] = secArguments;
			m_searchDialog.enablePrevNextBtns();
		}
	}

	function buildAgeContent(name) {
		var selectContent = [
			"<select id='rwAgeDropDown' class='leftFloat'>",
			"<option value='AGEGREATER' label='Greater than'>" + i18n.rwl.GREATERTHAN + "</option>",
			"<option value='AGELESS' label='Less than'>" + i18n.rwl.LESSTHAN + "</option>",
			"<option value='AGEEQUAL' label='Equal to'>" + i18n.rwl.EQUALTO + "</option>",
			"<option value='AGEFROM' label='Range'>" + i18n.rwl.RANGEFROM + "</option>",
			"</select>"
		];

		var timeDropContent = [
			"<select id='rwAgeTimeDrop' class='leftFloat'>",
				"<option value = 'AGEYEARS'>" + i18n.rwl.YEARS + "</option>",
				"<option value = 'AGEMONTHS'>" + i18n.rwl.MONTHS + "</option>",
				"<option value = 'AGEWEEKS'>" + i18n.rwl.WEEKS + "</option>",
				"<option value = 'AGEDAYS'>" + i18n.rwl.DAYS + "</option>",
			"</select>"
		];

		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($("<div class='multiInputContent ageFilter'>")
				.append(
					$(selectContent.join(""))
						.change(function(){
							var $select = $(this);
							if($select.val() == "AGEFROM") {
								$select.siblings("span.textTo,input.ageTo").show();
							}
							else {
								$select.siblings("span.textTo,input.ageTo").hide();
							}
							$("#ageFrom").val("").keyup();
							$("#ageTo").val("").keyup();
						}),
					$("<div class='leftFloat'>")
						.append($("<input class='ageFrom textInputHeight' id ='ageFrom' type='text' maxlength='" + m_maxDigits.Days + "'/>"),
								$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
					$("<span class='textTo leftFloat'>" + i18n.rwl.TOL + "</span>").hide(),
					$("<input class='ageTo leftFloat textInputHeight' id='ageTo' type='text' maxlength='" + m_maxDigits.Days + "'/>").hide(),
					$(timeDropContent.join(""))
						.change(function() {
							$(this).parents(".sectionContent").trigger("updateSection");
						})))
				.find("input")
					.bind("keyup paste",function(e){
						var $input = $(this);
						setTimeout(function(){
							var newVal = $input.val().replace(/[^0-9]/g,"");
							if(newVal != $input.val()){
								$input.val(newVal);
							}
						},0);

						var fromAge = $('#ageFrom').val(),
							toAge = $('#ageTo').val();

							var $newFromAge = $('#ageFrom'),
								$newToAge = $('#ageTo'),
								fromVal = $newFromAge.val(),
								toVal = $newToAge.val();
							if(fromVal != "" && toVal != "" && fromVal == fromAge && toVal == toAge && $newToAge.is(':visible')) {
									m_searchObj.compareFromToRange($newFromAge, $newToAge);
							}
							else {
								$newFromAge.removeClass("divInputError").siblings(".invalidEntry").hide();
								$("#sectionAGE").find(".errorImg").hide();
							}
							$input.parents(".sectionContent").trigger("updateSection");
					});

		function clearSectionData() {
			$("#sectionAGE").find("errorImg").hide();
			$("#rwAgeTimeDrop").val("AGEYEARS");
			$("#rwAgeDropDown").val("AGEGREATER").change();
		}
		function setSectionData(){
			var $section = $(this);
			var id = $section.parent().attr("id");
			var index = 0;
			var ageFrom = 0;
			var secArguments = m_modifiedData[id] || [];
			for(var y = 0, len = secArguments.length; y < len; y++){
				var argName = secArguments[y].ARGUMENT_NAME;
				if(argName=="AGETO") {
					$section.find("input.ageTo,span.textTo").show().filter("input").val(secArguments[y].ARGUMENT_VALUE);
				}
				else if(argName.match(/^AGE(GREATER|LESS|EQUAL|FROM)/)) {
					$("#rwAgeDropDown").val(argName).siblings("div").children("input").val(secArguments[y].ARGUMENT_VALUE);
				}
				else {
					$("#rwAgeTimeDrop").val(argName);
				}
			}
			$section.trigger("updateSection");
		}
		function updateSection(){
			var $section = $(this);
			var secInput = $section.find("input");
			var inputVal = [secInput.eq(0).val(),secInput.eq(1).val()];
			var secArguments = [];
			var ageDropVal = $("#rwAgeDropDown").val();
			if(inputVal[0] && ((inputVal[1] && !($('#ageFrom').hasClass("divInputError")))|| ageDropVal !="AGEFROM")){
				$section.find("select").each(function() {
					secArguments.push({
						ARGUMENT_NAME:$(this).val(),
						ARGUMENT_VALUE:inputVal[0],
						PARENT_ENTITY_ID:0.0,
						PARENT_ENTITY_NAME:""
					});
				});

				var strPrefix = $section.find("option:selected").text() + " ";
				var spanText = $("#rwAgeDropDown :selected").text() + " " + inputVal[0];
				if(inputVal[1] && ageDropVal =="AGEFROM"){
					secArguments.push({
						ARGUMENT_NAME:"AGETO",
						ARGUMENT_VALUE:inputVal[1],
						PARENT_ENTITY_ID:0.0,
						PARENT_ENTITY_NAME:""
					});
					spanText += " " + i18n.rwl.TOL + " " + inputVal[1];
				}
				spanText += " " + $("#rwAgeTimeDrop :selected").text().toLowerCase();
				$("#summaryAGE").show().find(".summaryText").text(spanText);
				$("#sectionAGE").find(".completeImg").show();
			}
			else {
				$("#summaryAGE").hide().find(".summaryText").text("");
				$("#sectionAGE").find(".completeImg").hide();
			}

			m_modifiedData[name] = secArguments;
			m_searchDialog.enablePrevNextBtns();
		}
	}

	function buildApptContent(name, content) {
		var checkboxContent = [];
		for(var c = 0, length = content.length; c < length; c++) {
			checkboxContent.push('<div><label class="rwSecSel_sectionLabel">' +
							'<input type="checkbox" value=' + content[c].PARENT_ENTITY_ID + ' parent_name="' + content[c].PARENT_ENTITY_NAME + '"></input>' +
							'<span>' + content[c].ARGUMENT_VALUE + '</span></label></div>');
		}
		var aDateDropdownOptions = [
				'<option value="0">' + i18n.rwl.DAYS + '</option>',
				'<option value="1">' + i18n.rwl.WEEKS + '</option>',
				'<option value="2">' + i18n.rwl.MONTHS + '</option>'
									];
		function fnResetDialogData(sId) {
			$('#summaryAPPTSTATUS').hide().find('.summaryText').text('');
			$('#sectionAPPTSTATUS').find('.completeImg').hide();
			m_modifiedData[sId] = [];
		}
		function fnUpdateSection() {
			var $section = $(this);
			var sId = $section.parent().attr('id');
			var sSecContent = '';
			var aSecArguments = [];
			var bNoAppt = ($('input[name="apptStatusRadio"]:checked').val() === 'noAppointment');
			var sApptFromDate = '';
			var sApptToDate = '';
			var sDropText = '';
			var sDropVal = '';
			var iApptStatusSelected = 0;
			var bAllInputValid = false;
			var $apptDateSelect = $('#rwApptDateSelect');
			var $noApptDateSelect = $('#rwNoApptDateSelect');
			var sStatus = '';

			if(bNoAppt === false) {
				sApptFromDate = $('#rwApptFromDate').val();
				sApptToDate = $('#rwApptToDate').val();
				sDropText = $apptDateSelect.find(':selected').text();
				sDropVal = $apptDateSelect.val();
				iApptStatusSelected = $('#rwAppointmentStatus').find('input:checked').length;
			}
			else {
				sApptFromDate = $('#rwNoApptFromDate').val();
				sApptToDate = $('#rwNoApptToDate').val();
				sDropText = $noApptDateSelect.find(':selected').text();
				sDropVal = $noApptDateSelect.val();
			}

			bAllInputValid = (m_controller.isAppointmentInputValid(sApptFromDate,sApptToDate,sDropVal) === true && (iApptStatusSelected > 0 || bNoAppt === true));

			if(bAllInputValid === false) {
				$('#sectionAPPTSTATUS').find('.errorImg').show();
			}
			else {
				$('#sectionAPPTSTATUS').find('.errorImg').hide();
			}

			if(bNoAppt === false) {
				$section.find('input:checkbox:checked')
					.each(function() {
						var $item = $(this);
						var sSiblingsSpanText = $item.siblings('span').text();
						aSecArguments.push({
							ARGUMENT_NAME:sId,
							ARGUMENT_VALUE:sSiblingsSpanText,
							PARENT_ENTITY_ID:parseFloat($item.val()),
							PARENT_ENTITY_NAME:$item.attr('parent_name'),
							CHILD_ARGUMENTS: findChildValues(sSiblingsSpanText)
						});
						sSecContent += sSiblingsSpanText + ', ';
					});
			}
			var iApptIndex = sSecContent.lastIndexOf(',');
			sSecContent = sSecContent.substring(0, iApptIndex);
			if(bAllInputValid === true && $('#sectionAPPTSTATUS').find('.errorImg').is(':visible') === false) {
				sStatus = (bNoAppt === true) ? i18n.rwl.NOAPPTSTR : i18n.rwl.APPTSTATUSSTR.replace('{13}',sSecContent);

				sStatus = sStatus.replace('{14}',sApptFromDate)
											.replace('{15}',sDropText.toLowerCase())
											.replace('{16}',sApptToDate)
											.replace('{17}',sDropText.toLowerCase());

				aSecArguments.push({
					ARGUMENT_NAME : 'NOAPPT',
					ARGUMENT_VALUE : bNoAppt.toString(),
					PARENT_ENTITY_ID : '0',
					PARENT_ENTITY_NAME : 'CODE_VALUE'
				},
				{
					ARGUMENT_NAME : 'APPTDATEUNIT',
					ARGUMENT_VALUE : m_controller.fnMapSelectedDateValue(sDropVal),
					PARENT_ENTITY_ID : '0',
					PARENT_ENTITY_NAME : 'CODE_VALUE'
				},
				{
					ARGUMENT_NAME : 'APPTFROM',
					ARGUMENT_VALUE : sApptFromDate,
					PARENT_ENTITY_ID : '0',
					PARENT_ENTITY_NAME : 'CODE_VALUE'
				},
				{
					ARGUMENT_NAME : 'APPTTO',
					ARGUMENT_VALUE : sApptToDate,
					PARENT_ENTITY_ID : '0',
					PARENT_ENTITY_NAME : 'CODE_VALUE'
				});

				sSecContent = sStatus;

				if(sSecContent.length > 0) {
					$('#summaryAPPTSTATUS').show().find('.summaryText').text(sSecContent);
					$('#sectionAPPTSTATUS').find('.completeImg').show();
					m_modifiedData[sId] = aSecArguments;
				}
				else {
					fnResetDialogData(sId);
				}
			}
			else {
				fnResetDialogData(sId);
			}
			if($('#APPTSTATUS').is(':visible') === false) {
				$('#sectionAPPTSTATUS').find('.errorImg').hide();
			}

			m_searchDialog.enablePrevNextBtns();
		}
		function fnClearNoApptData() {
			$('#rwNoApptLookbackSection').find('.rwApptDateInput').val('0').removeClass('divInputError').siblings('.invalidEntry').hide();
			$('#rwNoApptDateSelect').val('0');
			$('#rwNoApptTimeMax').removeClass('divAdmissionMaxColor').text(i18n.rwl.DAYSMAX);
			$('#rwApptRadio').prop('checked', true);
			$('#APPTSTATUS').find('.sectionContent').trigger('updateSection');
		}
		function fnClearApptData() {
			$('#rwAppointmentStatus').find('input:checked').attr('checked', false);
			$('#rwApptLookbackSection').find('.rwApptDateInput').val('0').removeClass('divInputError').siblings('.invalidEntry').hide();
			$('#rwApptDateSelect').val('0');
			$('#rwApptTimeMax').removeClass('divAdmissionMaxColor').text(i18n.rwl.DAYSMAX);
			$('#rwNoApptRadio').prop('checked', true);
			$('#APPTSTATUS').find('.sectionContent').trigger('updateSection');
		}
		function fnClearSectionData() {
			fnClearApptData();
			fnClearNoApptData();
			$('#rwApptRadio').prop('checked', false);
			$('#sectionAPPTSTATUS').find('.errorImg').hide();
			m_searchDialog.enablePrevNextBtns();
		}
		function fnIsSectionInError() {
			return $('#APPTSTATUS').find('.divInputError').length > 0;
		}
		function fnValidateApptInput(event) {
			var $element = $(event.target);
			var sInputVal = $element.val(),
				sApptFromDate,
				sApptToDate,
				sTimeVal,
				$timeMax,
				fnClearFunction;
			if($element.closest('#rwNoApptLookbackSection').length === 1) {
				sTimeVal = $('#rwNoApptDateSelect').val();
				$timeMax = $('#rwNoApptTimeMax');
				sApptFromDate = $('#rwNoApptFromDate').val();
				sApptToDate = $('#rwNoApptToDate').val();
				fnClearFunction = fnClearApptData;
			}
			else {
				sTimeVal = $('#rwApptDateSelect').val();
				$timeMax = $('#rwApptTimeMax');
				sApptFromDate = $('#rwApptFromDate').val();
				sApptToDate = $('#rwApptToDate').val();
				fnClearFunction = fnClearNoApptData;
			}
			if(sInputVal === '') {
				$element.addClass('divInputError').siblings('.invalidEntry').hide();
				$('#sectionAPPTSTATUS').find('.errorImg').show();
			}
			else if(m_controller.isValidRangeInput(parseInt(sInputVal, 10),sTimeVal) === false) {
					$element.addClass('divInputError').siblings('.invalidEntry').show();
					$timeMax.addClass('divAdmissionMaxColor');
					$('#sectionAPPTSTATUS').find('.errorImg').show();
			}
			else {
				$element.removeClass('divInputError').siblings('.invalidEntry').hide();
				if(fnIsSectionInError() === false) {
					$timeMax.removeClass('divAdmissionMaxColor');
					if(m_controller.isAppointmentInputValid(sApptFromDate,sApptToDate,sTimeVal) === true) {
						$('#sectionAPPTSTATUS').find('.errorImg').hide();
					}
				}
			}

			if (parseInt(sInputVal, 10) > 0 || sInputVal === ''){
				fnClearFunction();
			}
		}
		function fnSetSectionData() {
			var secArguments = m_modifiedData.APPTSTATUS || [];
			var fromDate = m_modifiedData.APPTFROM || [];
			var toDate = m_modifiedData.APPTTO || [];
			var drop = m_modifiedData.APPTDATEUNIT || [];
			var aNoApptArgs = m_modifiedData.NOAPPT || [];
			var bNoAppt = false;
			if(aNoApptArgs.length > 0) {
				bNoAppt = typeof m_modifiedData.NOAPPT[0].ARGUMENT_VALUE === 'string' && m_modifiedData.NOAPPT[0].ARGUMENT_VALUE.toLowerCase() === 'true';
			}

			if(bNoAppt === false) {
				for(var y =0,len = secArguments.length; y <len; y++){
					$(this).find('input[value=' + secArguments[y].PARENT_ENTITY_ID+']').attr('checked', true);
				}
			}
			if(fromDate.length > 0 && toDate.length > 0 && drop.length > 0) {
				var dateUnit = drop[0].ARGUMENT_VALUE;
				var dropValue = -1,
					fDate = fromDate[0].ARGUMENT_VALUE,
					tDate = toDate[0].ARGUMENT_VALUE;
				switch(dateUnit) {
					case 'D':
						dropValue = 0;
						break;
					case 'W':
						dropValue = 1;
						break;
					case 'M':
						dropValue = 2;
						break;
				}

				if(bNoAppt === false) {
					$('#rwApptDateSelect').val(dropValue);
					$('#rwApptFromDate').val(fDate);
					$('#rwApptToDate').val(tDate);
					$('#rwApptRadio').prop('checked', true);
				}
				else {
					$('#rwNoApptDateSelect').val(dropValue);
					$('#rwNoApptFromDate').val(fDate);
					$('#rwNoApptToDate').val(tDate);
					$('#rwNoApptRadio').prop('checked', true);
				}
			}
			delete m_modifiedData.APPTFROM;
			delete m_modifiedData.APPTTO;
			delete m_modifiedData.APPTDATEUNIT;
			delete m_modifiedData.NOAPPT;
			delete m_modifiedData.APPTSTATUS;
			$('#APPTSTATUS').find('.sectionContent').trigger('updateSection');
		}
		function fnBuildLookbackSection(sId) {
			var $lookbackSection = $('<div/>').attr('id', sId + 'LookbackSection').addClass('rwApptLookbackSection');
			$lookbackSection
				.append($('<div/>')
							.attr('id', sId + 'Past')
							.addClass('rwLookbackSection leftFloat')
							.text(i18n.rwl.PAST)
							.append($('<input/>')
										.attr({
											id: sId + 'FromDate',
											type: 'text',
											value: 0,
											maxlength: m_maxDigits.Days
											})
										.addClass('rwApptDateInput')
										.bind('keypress paste',getKeyPressValidatorEvent())
										.keyup(fnValidateApptInput),
									$('<span/>')
										.addClass('invalidEntry')
										.text(i18n.rwl.INVALIDENTRY)),
						$('<div/>')
							.attr('id', sId + 'Future')
							.addClass('leftFloat')
							.text(i18n.rwl.FUTURE)
							.append($('<input/>')
										.attr({
											id: sId + 'ToDate',
											type: 'text',
											value: 0,
											maxlength: m_maxDigits.Days
											})
										.addClass('rwApptDateInput')
										.bind('keypress paste',getKeyPressValidatorEvent())
										.keyup(fnValidateApptInput),
									$('<span/>')
										.addClass('invalidEntry')
										.text(i18n.rwl.INVALIDENTRY)),
						$('<div/>')
							.attr('id', sId + 'DateOption')
							.addClass('leftFloat rwApptDateOption')
							.append($('<select/>')
										.attr('id', sId + 'DateSelect')
										.html(aDateDropdownOptions)
										.change(fnChangeHandler),
									$('<span/>')
										.attr('id', sId + 'TimeMax')
										.addClass('rwApptTimeMaxSpan')
										.text(i18n.rwl.DAYSMAX)));
			return $lookbackSection;
		}
		function fnChangeHandler(event) {
			var $select = $(event.target);
			var sId = $select.attr('id').replace('DateSelect','');
			var sTimeMaxId = sId + 'TimeMax';
			var sLookbackSectionId = sId + 'LookbackSection';
			var sOption = $select.val();

			switch(sOption) {
				case '0':
					$('#' + sTimeMaxId).text(i18n.rwl.DAYSMAX);
					break;
				case '1':
					$('#' + sTimeMaxId).text(i18n.rwl.WEEKSMAX);
					break;
				case '2':
					$('#' + sTimeMaxId).text(i18n.rwl.MONTHSMAX);
					break;
			}
			sId = sId.toLowerCase();
			if(sId.localeCompare('rwappt') === 0) {
				fnClearNoApptData();
			}
			else {
				fnClearApptData();
			}

			$('#APPTSTATUS').find('.sectionContent').trigger('updateSection');
			$('#' + sLookbackSectionId).find('.rwApptDateInput').keyup();
		}

		$m_criteriaContent.find('#' + name).children('.sectionContent')
			.bind('updateSection',fnUpdateSection)
			.bind('setSectionData',fnSetSectionData)
			.bind('clearSectionData', fnClearSectionData)
			.empty()
			.append($('<div/>')
					.addClass('multiInputContent appointmentStatus')
					.append($('<label/>')
								.text(i18n.rwl.APPOINTMENTS)
								.prepend($('<input/>')
											.attr({
												id: 'rwApptRadio',
												type: 'radio',
												name: 'apptStatusRadio',
												value: 'appointment'
												}))
								.bind('click',fnClearNoApptData),
							fnBuildLookbackSection('rwAppt'),
							$('<div/>')
								.attr('id','rwAppointmentStatus')
								.addClass('apptOrderClearFloat rwAppointmentStatus')
								.append($('<span/>')
											.addClass('requiredIndicator')
											.text('*'),
										$('<span/>')
											.text(i18n.rwl.SELECTSTATUS),
										$(checkboxContent.join(''))
											.bind('click',fnClearNoApptData)),
							$('<label/>')
								.text(i18n.rwl.NOAPPOINTMENTS)
								.prepend($('<input/>')
											.attr({
												id: 'rwNoApptRadio',
												type: 'radio',
												name: 'apptStatusRadio',
												value: 'noAppointment'
												}))
											.bind('click',fnClearApptData),
							fnBuildLookbackSection('rwNoAppt')));
	}

	function buildCaseMgrContent(name) {
		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($("<div class='multiInputContent'>").append(
				$("<div id='caseManagerSearch'>").append(m_controller.createSearchControl())))
			.on("prsnlSelected",null,function(event,dPrsnlId,sName){
				insertProvCheckbox(dPrsnlId,sName,$(this).children(".multiInputContent"));
			});
		function updateSection(){
			var $section = $(this);
			var id = $section.parent().attr("id");
			var $checked = $section.find(":checked");
			var checkedText = "";
			var secArguments = [];
			$checked.each(function() {
				var $item = $(this);
				var siblingspantext = $item.siblings("span").text();
				secArguments.push({
					ARGUMENT_NAME:id,
					ARGUMENT_VALUE:siblingspantext,
					PARENT_ENTITY_ID:parseFloat($item.val()),
					PARENT_ENTITY_NAME:$item.attr("parent_name"),
					CHILD_ARGUMENTS: findChildValues(siblingspantext)
				});
				if(checkedText.length === 0) {
					checkedText = siblingspantext;
				}
				else {
					checkedText += ", " + siblingspantext;
				}
			});
			m_modifiedData[id] = secArguments;
			$("#summary" + id).find(".summaryText").text(checkedText).end().toggle(checkedText.length > 0);
			$("#section" + id).find(".completeImg").toggle(checkedText.length > 0);
		}

		function setSectionData(){
			var $section = $(this);
			var id = $section.parent().attr("id");

			var secArguments = m_modifiedData[id] || [];
			for(var y =0,len = secArguments.length; y <len; y++){
				insertProvCheckbox(secArguments[y].PARENT_ENTITY_ID,secArguments[y].ARGUMENT_VALUE,$section.children(".multiInputContent"));
			}
		}

		function clearSectionData(){
			$('.searchCtrlInput').val('').removeClass('searching');
			$(this).children(".multiInputContent").removeData().children("div").not("#caseManagerSearch").remove()
				.end().trigger("updateSection");
		}

		function insertProvCheckbox(dPrsnlId,sName,$table){
			dPrsnlId = dPrsnlId.toString();
			if($table.data(dPrsnlId)) {
				return;
			}

			var $html = $('<div class="singleProviderSelection fullWidth">')
							.append($("<label class='leftFloat'><input class='hidden-checkbox' type='checkbox' checked='true' value=" + dPrsnlId + " parent_name='" + escape(sName) + "'></input>" +
										"<span>" + sName + "</span></label>"),
									$("<div class='prsnlRemoveImg'></div>")
										.click(function() {
											var $item = $(this).parent();
											var $secContent = $item.parents(".sectionContent");
											var $multiInputContent = $item.parents(".multiInputContent");
											var $checkbox = $item.find(".hidden-checkbox");
											var dPrsnlId = $checkbox.val();
											$item.remove();
											$multiInputContent.removeData(dPrsnlId);
											$secContent.trigger("updateSection");
										}))
							.hover(function() {
								$(this).find(".prsnlRemoveImg").toggle();
							});

			var idx = -1;
			$table.data(dPrsnlId,sName)
				.find("label").each(function(index){
					if($(this).text().localeCompare(escape(sName))>0){
						idx = index;
						return false;
					}
				});
			(idx>=0) ? $table.children("div").not("#caseManagerSearch").eq(idx).before($html) : $("#caseManagerSearch").before($html);
			$table.parents(".sectionContent").trigger("updateSection");
		}
	}

	function buildExpectationsContent(name, content) {
		var expectContent = ["<table id='expectVals' class='floatTable moreContentTable'>", "<tbody>"];
		var statusContent = ["<table id='statusVals' class='floatTable moreContentTable'>", "<tbody>"];

		expectContent.push("<tr><th><span>" + i18n.rwl.HEALTHMAINTENANCE + "</span></th></tr>");
		statusContent.push("<tr><th><label class='rwSecSel_sectionLabel'>" +
							"<input type='checkbox' id='checkAllExpectStatus'/>" +
							"<span>" + i18n.rwl.STATUS + "</span></label></th></tr>");

		for(var e = 0, len = content.length; e < len; e++) {
			if(content[e].PARENT_ENTITY_NAME == "HM_EXPECT") {
				expectContent.push("<tr><td><label class='rwSecSel_sectionLabel'>" +
							'<input type="checkbox" value="' + content[e].PARENT_ENTITY_ID + '" fulltext="' + content[e].ARGUMENT_VALUE.toString() + '"/>' +
							'<span>' + content[e].ARGUMENT_VALUE + '</span></label></td></tr>');
			}
			else {
				var recommStatusDisplayValue;
				switch(content[e].ARGUMENT_VALUE){
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
						recommStatusDisplayValue = content[e].ARGUMENT_VALUE;
						break;
				}
				statusContent.push('<tr><td><label class="rwSecSel_sectionLabel">' +
							'<input type="checkbox" name ="' +encodeURI(content[e].ARGUMENT_VALUE).toString() +'" value="' + content[e].PARENT_ENTITY_ID + '" parent_name="' + content[e].PARENT_ENTITY_NAME + '"/>' +
							'<span>' + recommStatusDisplayValue+ '</span></label></td></tr>');
			}
		}
		expectContent.push("</tbody>","</table>");
		statusContent.push("</tbody>", "</table>");
		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($("<div class='expectList'>")
						.append($(expectContent.join(""))
									.on("click", "input", function() {
										$(this).parents(".sectionContent").trigger("updateSection");
									})),
					$("<div class='statusList'>")
						.append($(statusContent.join(""))
									.on("click", "input", function() {
										var $input = $(this);
										var $content = $input.parents(".sectionContent");
										var $statusListInput = $input.parents(".statusList").find("input");
										var id = $input.attr("id");
										if(id == "checkAllExpectStatus") {
											if($input.attr("checked") == "checked") {
												$statusListInput.attr("checked", "checked");
											}
											else {
												$statusListInput.removeAttr("checked");
											}
										}
										else {
											var checkedStatus = $input.attr("checked");
											if(checkedStatus != "checked") {
												$("#checkAllExpectStatus").removeAttr("checked");
											}
											else {
												var numInputs = $statusListInput.length;
												var numChecked = $statusListInput.filter(":checked").length;
												if(numChecked == (numInputs - 1)) {
													$("#checkAllExpectStatus").attr("checked", "checked");
												}
											}
										}
										$content.trigger("updateSection");
									})));

		function updateSection() {
			var $section = $(this);
			var id = $(this).parent().attr("id");
			var secContent = [];
			var recommStatus= [];
			var secArguments = [];
			$("#statusVals")
				.find("input:checked").not("#checkAllExpectStatus")
				.each(function(){
					var $item = $(this);
					var siblingsSpanText = $item.siblings("span").text();
					var recommStatusInputName = decodeURI($($item).attr('name'));
					secArguments.push({
						ARGUMENT_NAME:"RECOMMSTATUS",
						ARGUMENT_VALUE:recommStatusInputName,
						PARENT_ENTITY_ID:parseFloat($item.val()),
						PARENT_ENTITY_NAME: "HM_EXPECT"
					});
					
					recommStatus.push(siblingsSpanText.toLowerCase());
				});
			if(recommStatus.length > 0) {
				$("#expectVals").find("input:checked")
					.each(function () {
						var $item = $(this);
						var thisText = $item.attr("fulltext");
						secArguments.push({
							ARGUMENT_NAME: "EXPECTATIONS",
							ARGUMENT_VALUE: thisText,
							PARENT_ENTITY_ID: $item.val(),
							PARENT_ENTITY_NAME: "HM_EXPECT"
						});
						secContent.push(thisText);
					});

				if(secContent.length) {
					var summaryText = m_controller.setSummaryContent(secContent,recommStatus);
					$("#summaryEXPECTATIONS").show().find(".summaryText").text(summaryText);
					$("#sectionEXPECTATIONS").find(".completeImg").show();
					m_modifiedData[id] = secArguments;
				}
			}
			if(secContent.length === 0) {
				$("#summaryEXPECTATIONS").hide().find(".summaryText").text("");
				$("#sectionEXPECTATIONS").find(".completeImg").hide();
				m_modifiedData[id] = [];
			}
		}

		function setSectionData() {
			var expectations = m_modifiedData.EXPECTATIONS || [];
			for(var x = 0, xlen = expectations.length; x < xlen; x++){
				$(this).find("input[value=" + expectations[x].PARENT_ENTITY_ID+"]").attr('checked', true);
			}

			$(this).trigger("updateSection");
		}

		function clearSectionData() {
			$(this).find("input:checked").attr("checked", false);
			$("#rwExpectationsDrop :selected").removeAttr("selected");
			$(this).trigger("updateSection");
		}
	}

	function buildMedsContent(name, content, title) {
		var criterion = m_controller.getCriterion();
		var selectContent = [];
		selectContent.push("<select id = 'rwMedStatusDrop' disabled='disabled' multiple='multiple'>");
		for(var c = 0, contentLength = content.length; c < contentLength; c++)
		{
			selectContent.push("<option value='" + c + "' meaning='" + content[c].ARGUMENT_MEANING + "'>" + content[c].ARGUMENT_VALUE + "</option>");
		}
		selectContent.push("</select>");

		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
				.empty()
				.append($("<div id = 'rwSecSel_Meds'>")
					.append($("<div id='medicationsOperator' class='topContent'>" +
								"<span>" + i18n.rwl.SELECTONE + "</span>" +
								"<label><input type ='radio' name='rwMedicationsOperatorType' value='or' id='rwMedicationsOr' checked='checked'>" + i18n.rwl.OR + "</label> &nbsp;&nbsp;" +
								"<label><input type ='radio' name='rwMedicationsOperatorType' value='and' id='rwMedicationsAnd'>" + i18n.rwl.AND + " </label><br/>" +
								"</div>"),
							$("<div class= 'overflowDiv'>").append(
							$("<div class = 'multiInputContent medMinWidth'>")
								.append($("<div id='rwDivMedSearch' class='medNameClass leftFloat'>")
										.append($("<span>" + i18n.rwl.SELECTONE + "</span>" +
												"<label><input type ='radio' name='rwSearchType' value='name' id='rwMedSearchName' class='medRadioBut' checked='checked'>" + i18n.rwl.NAME + "</label> &nbsp;&nbsp;" +
												"<label><input type ='radio' name='rwSearchType' value='class' id='rwMedSearchClass' class='medRadioBut'>" + i18n.rwl.CLASSIFICATION + " </label><br/>")
													.change(function () {
														$("#rwMedSearchInput").val("").keyup();
														$("#rwMedSearchList").remove();
													}),
												$("<input type ='text' id='rwMedSearchInput' class='searchInput'/>")
													.bind("keyup paste", m_controller.debounce(function () {
														var $input = $(this);
														var med = $input.val();
														if(med)
														{
															$input.addClass('searching');
															var newMed = $("#rwMedSearchInput").val();
															if(newMed == med)
															{
																var med_request = {med_request:{
																	personnel_id: criterion.CRITERION.PRSNL_ID,
																	text: newMed,
																	catalog_flag: ''
																}};
																if($('#rwMedSearchName').attr('checked')){
																	med_request.med_request.catalog_flag = '0';
																}
																else {
																	med_request.med_request.catalog_flag = '1';
																}

																m_controller.makeCall("mp_dcp_get_drug_options",med_request,true,function(reply) {
																	$input.removeClass('searching');
																	if(m_controller.doesValueMatch($input, newMed) === false) {
																		return;
																	}

																	var catalog = reply.CATALOG;
																	$("#rwMedSearchList").remove();
																	if(catalog)
																	{
																		var options = "";
																		if(catalog == "MED") {
																			options = reply.MEDS;
																		} else {
																			options = reply.DRUG_CLASS;
																		}
																		var optionsLength = options.length;
																		var htmlString = "<select id ='rwMedSearchOptions' class='searchOptions' size ='6'>";
																		for(var i = 0; i < optionsLength; i++)
																		{
																			htmlString += "<option id = 'rwMedOption" + i + "'";
																			if(catalog == "MED")
																				htmlString += ">" + options[i].DRUG_NAME;
																			else
																				htmlString += " value='" + options[i].ID + "'>" + options[i].NAME;
																			htmlString += "</option>";
																		}
																		htmlString += "</select>";
																		if(optionsLength > 0)
																		{
																			$("#rwDivMedSearch").append($("<div id='rwMedSearchList' class='resultMedOptionList'>")
																				.html(htmlString));
																		}
																		$("#rwMedSearchOptions").change(function() {
																			var $selected = $("#rwMedSearchOptions :selected");
																			$("#rwMedSearchInput").val($selected.text()).attr("med_id", $selected.val());
																			$("#rwMedSearchList").remove();
																			if(m_searchObj.medResultExists("addedMeds", $selected.text(), "rwMedInput"))
																			{
																				$("#rwMedsAddBut").attr("disabled", "disabled").addClass("addButdisabled");
																				$("#rwDivMedAdd").find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled", "disabled");
																			}
																			else {
																				$("#rwMedsAddBut").removeAttr("disabled").removeClass("addButdisabled");
																				$("#rwDivMedAdd").find(".addImg").removeClass("addButdisabled").attr("src", staticContentPath + "/images/3941_16.png").parent().removeAttr("disabled");
																			}
																			var ordered = 0;
																			var count = 0;
																			$("#rwMedStatusDrop").children().each(function() {
																				if($(this).text() == "Ordered")
																					ordered = count;
																				else
																					count++;
																			});
																			$("#rwMedStatusDrop").removeAttr("disabled").val(ordered);
																			$("#rwMedTimeInput").removeAttr("disabled").val(546);
																			$("#rwMedTimeDrop").removeAttr("disabled").val(0);
																			$("#rwMedTimeMax").empty().append(i18n.rwl.DAYSMAX);
																		});
																	}
																});
															}
														}
														else
														{
															$input.removeClass('searching');
															$("#rwMedSearchList").remove();
															$("#rwMedStatusDrop").attr("disabled","disabled").val(0);
															$("#rwMedTimeInput").attr("disabled","disabled").val("");
															$("#rwMedTimeDrop").attr("disabled","disabled").val(0);
															$("#rwMedTimeMax").empty();
															$("#rwMedsAddBut").attr("disabled","disabled").addClass("addButdisabled");
															$("#rwDivMedAdd").find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled", "disabled");
														}
													}, m_controller.delayDuration))),
										$("<div class='medStatus leftFloat'>")
											.append($("<span class = 'rwMed'>" + i18n.rwl.STATUS + " <br/></span>"),
													$(selectContent.join(""))
														.change(function(){
															var $selected = $("#rwMedStatusDrop :selected");
															if($selected.length==0){
																$(this).addClass("divInputError").siblings(".invalidEntry").show();
																$("#sectionORDERSTATUS").find(".errorImg").show();
															}
															else{
																$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
																$("#sectionORDERSTATUS").find(".errorImg").hide();
															}
															onMedChange();
														}),
													$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
										$("<div class='medTime leftFloat'>")
											.append($("<input id='rwMedTimeInput' class = 'cwNumInput' type='text' maxLength= '" + m_maxDigits.Days + "' disabled='disabled'/>")
														.bind("keypress paste",getKeyPressValidatorEvent())
														.keyup(function() {
															var timeVal = $("#rwMedTimeDrop").val();
															var inputVal = $(this).val();
															if((inputVal > 546 && timeVal == 0) ||
																(inputVal > 78 && timeVal == 1) ||
																(inputVal > 18 && timeVal == 2) || (inputVal == ""))
															{
																$(this).addClass("divInputError").siblings(".invalidEntry").show();
																$("#rwMedTimeMax").addClass('divAdmissionMaxColor');
																$("#sectionORDERSTATUS").find(".errorImg").show();
															}
															else
															{
																$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
																$("#rwMedTimeMax").removeClass('divAdmissionMaxColor');
																$("#sectionORDERSTATUS").find(".errorImg").hide();
															}
															onMedChange();
														}),
													$("<span>&nbsp;&nbsp;</span><select id='rwMedTimeDrop' disabled='disabled'>" +
														"<option value = '0'>" + i18n.rwl.DAYS + "</option>" +
														"<option value = '1'>" + i18n.rwl.WEEKS + "</option>" +
														"<option value = '2'>" + i18n.rwl.MONTHS + "</option>" +
														"</select>")
															.change(function() {
																$("#rwMedTimeMax").empty();
																switch($(this).val()) {
																	case "0":
																		$("#rwMedTimeInput").keyup();
																		$("#rwMedTimeMax").append(i18n.rwl.DAYSMAX);
																		break;
																	case "1":
																		$("#rwMedTimeInput").keyup();
																		$("#rwMedTimeMax").append(i18n.rwl.WEEKSMAX);
																		break;
																	case "2":
																		$("#rwMedTimeInput").keyup();
																		$("#rwMedTimeMax").append(i18n.rwl.MONTHSMAX);
																		break;
																}
															}),
													$("<span id= 'rwMedTimeMax' class='padding'></span>"),
													$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
										$("<div id='rwDivMedAdd' class='medAdd leftFloat'>")
											.append($("<span disabled ='disabled'><img class='addImg addButdisabled' src='" + staticContentPath + "/images/3941_disabled_16.gif'/><br/></span>"),
													$("<span id = 'rwMedsAddBut' class='addButdisabled resultMedAddBut' disabled ='disabled'>" + i18n.rwl.ADD + "</span>"))
											.on("click", "span", function() {
												var medsAdded = $("#addedMeds").find(".rwMedsText").length;
												if($(this).is(':disabled')){
													return;
												}
												if(medsAdded < 3 && $("#rwMedSearchInput").val())
												{
													var text = "<div id = 'rwMed" + medsAdded + "' class = 'resultMedPadding rwMedsText";
													if(medsAdded % 2 === 0) {
														text += " zebra-white";
													}
													else {
														text += " zebra-blue";
													}
													if($("#rwMedSearchName").attr("checked"))
														text += " drugname'>";
													else
														text += " drugclass'>";
													text += getMedsText(medsAdded);
													text += "</div>";
													$("#addedMeds").append(text).find(".noMeds").hide();
													clear();
													medsAdded++;
													if(medsAdded == 3)
													{
														$("#rwMedSearchInput").attr("disabled","disabled");
													}
												}
												$(this).parents(".sectionContent").trigger("updateSection");
											}))),
							$("<div class='bottomContent'>")
								.append($("<div class='topContent'>")
										.append($("<span>" + i18n.rwl.ADDED + " " + title + "</span>")),
									$("<div id='addedMeds'>")
										.append($("<span class='noMeds'>" + i18n.rwl.NO + " " + title + " " + i18n.rwl.ADDEDL + "</span>")))));
		function getMedsText(medCount)
		{
			var htmlString = "";
			var $medInput = $("#rwMedSearchInput");
			if($medInput.val())
			{
				var count = 0;
				var med = $medInput.val();
				var days = $("#rwMedTimeInput").val();
				var $medTimeDrop = $('#rwMedTimeDrop :selected');
				var daysDrop = $medTimeDrop.text();
				var sDropVal = $medTimeDrop.val();
				var sClassName = '';

				switch(sDropVal) {
					case '0':
						sClassName = 'backDays';
					break;
					case '1':
						sClassName = 'backWeeks';
					break;
					case '2':
						sClassName = 'backMonths';
					break;
				}

				htmlString += "<tr><td><label>";
				htmlString += " <span id ='rwMedInput" + medCount + "' value='" + $medInput.attr("med_id") + "'>" + med + "</span> " + i18n.rwl.MEDINPUTTEXT + " ";
				$("#rwMedStatusDrop :selected").each(function() {
					htmlString += "<span class='rwMedStatus' meaning='" + $(this).attr("meaning") + "'>" + $(this).text() + "</span>, ";
					count++;
				});
				htmlString += i18n.rwl.INTHELAST + ' <span id ="rwMedBackTimeInput' + medCount + '"> ' + days + '</span>'
					+ ' <span id="rwMedBackTimeOption' + medCount + '" class="' + sClassName + '"> ' + daysDrop.toLowerCase() + '</span>';
				htmlString += "</label></td></tr>";
			}
			return htmlString;
		}
		function clear() {
			$("#rwMedSearchName").attr("checked","checked");
			$('#rwMedSearchInput').val('').removeClass('searching');
			$("#rwMedStatusDrop").attr("disabled","disabled").val(0).removeClass("divInputError").siblings(".invalidEntry").hide();
			$("#rwMedTimeInput").attr("disabled","disabled").val("").removeClass('divInputError').siblings(".invalidEntry").hide();
			$("#rwMedTimeDrop").attr("disabled","disabled").val(0);
			$("#rwMedTimeMax").empty().removeClass('divAdmissionMaxColor');
			$("#rwMedsAddBut").attr("disabled","disabled").addClass("addButdisabled");
			$("#rwDivMedAdd").find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled","disabled");
			$("#sectionORDERSTATUS").find(".errorImg").hide();
		}
		function clearSectionData() {
			clear();
			$('#rwMedSearchList').remove();
			$("#rwMedicationsOr").attr("checked", "checked");
			$("#rwMedSearchInput").removeAttr("disabled");
			$("#addedMeds").find(".rwMedsText").remove().end().find(".noMeds").show();
			$(this).trigger("updateSection");
		}
		function setSectionData() {
			var $section = $(this);
			var secArguments = m_modifiedData.ORDERSTATUS || [];
			for(var m = 1; m < 4; m++) {
				var medArray = [];
				var medArg = "MED" + m;
				for(var s = 0, length = secArguments.length; s < length; s++) {
					if(secArguments[s].ARGUMENT_NAME.indexOf("_OPERATOR") > -1) {
						if(secArguments[s].ARGUMENT_VALUE == "AND") {
							$("#rwMedicationsAnd").attr("checked", "checked");
						}
						else {
							$("#rwMedicationsOr").attr("checked", "checked");
						}
					}
					else if(secArguments[s].ARGUMENT_NAME.indexOf(medArg) > -1) {
						medArray.push(secArguments[s]);
					}
				}
				if(medArray.length > 0) {
					var text = "<div id = 'rwMed" + (m-1) + "' class = 'resultMedPadding rwMedsText";
					text += createMedString(medArray, (m-1));
					$("#addedMeds").append(text).find(".noMeds").hide();
				}
				else {
					break;
				}
			}
			$section.trigger("updateSection");
		}
		function createMedString(medArguments, medCount) {
			var drug = "<span id='rwMedInput" + medCount + "'";
			var type = "";
			var statuses = "";
			var statusCount = 0;
			var timeinput = "<span id='rwMedBackTimeInput" + medCount + "'>";
			var timeoption = '<span id="rwMedBackTimeOption' + medCount + '"';
			for(var a = 0, length = medArguments.length; a < length; a++) {
				var name = medArguments[a].ARGUMENT_NAME;
				var value = medArguments[a].ARGUMENT_VALUE;
				if(name.indexOf("_STATUS") > -1) {
					if(statuses.length > 0) {
						statuses += ", ";
					}
					statuses += "<span class='rwMedStatus' meaning='" + value + "'>";
					statuses += value.toLowerCase();
					statuses += "</span>";
					statusCount++;
				}
				else if(name.indexOf("_DRUGNAME") > -1) {
					type = "drugname";
					drug += " value='0'>" + value + "</span>";
				}
				else if(name.indexOf("_DRUGCLASSID") > -1) {
					type = "drugclass";
					drug += " value='" + medArguments[a].PARENT_ENTITY_ID + "'>" + value + "</span>";
				}
				else if(name.indexOf("_BACKDAYS") > -1) {
					timeinput += value + "</span>";
					timeoption += ' class = "backDays">' + i18n.rwl.DAYSL + '</span>';
				}
				else if(name.indexOf("_BACKWEEKS") > -1) {
					timeinput += value + "</span>";
					timeoption += ' class = "backWeeks">' + i18n.rwl.WEEKSL + '</span>';
				}
				else if(name.indexOf("_BACKMONTHS") > -1) {
					timeinput += value + "</span>";
					timeoption += ' class = "backMonths">' + i18n.rwl.MONTHSL + '</span>';
				}
			}
			var returnString = i18n.rwl.MEDSTR.replace("{18}",drug);
			returnString = returnString.replace("{19}",statuses);
			returnString = returnString.replace("{20}",timeinput);
			returnString = returnString.replace("{21}",timeoption);
			var stripeColor = "";
			if(medCount % 2 === 0) {
				stripeColor = " zebra-white ";
			}
			else {
				stripeColor = " zebra-blue ";
			}
			return stripeColor + type +"'>" + returnString + "</div>";
		}
		function updateSection() {
			var $section = $(this);
			var	DRUG_NAME = 'drugname';
			var	DRUG_CLASSIFICATION = 'drugclass';
			if($("#sectionORDERSTATUS").find(".errorImg").is(":visible") == true) {
				$("#summaryORDERSTATUS").hide().find(".summaryText").text("");
				$("#sectionORDERSTATUS").find(".completeImg").hide();
				m_modifiedData[name] = [];
				m_searchDialog.enablePrevNextBtns();
				return;
			}
			var secArguments = [];
			var numMeds = $("#addedMeds").find(".rwMedsText").length;
			var text = "";
			var meds = 1;
			var createSummaryViewMedContainer = null;
			var createSummaryViewMedItem = null;
			var summaryViewHtmlModel = {};
			var	summaryTextHtmlContainer = $('<div>');
			var $med = $();
			summaryViewHtmlModel[DRUG_NAME] = {
				showHeaderInSummaryView: false,
				headerInSummaryView: i18n.rwl.NAME + i18n.rwl.COLON,
				domItems: []
			};
			summaryViewHtmlModel[DRUG_CLASSIFICATION]= {
				showHeaderInSummaryView: true,
				headerInSummaryView: i18n.rwl.CLASSIFICATION + i18n.rwl.COLON,
				domItems: []
			};
			if(numMeds > 0)
			{
				for(var m = 0; m < numMeds; m++)
				{
					$med = $("#rwMed" + m);

					summaryViewHtmlModel[$med.hasClass(DRUG_NAME)?DRUG_NAME:DRUG_CLASSIFICATION].domItems.push($med);

					if(m === 0) {
						text += $med.text();
					}
					else {
						text += ", " + $med.text();
					}
					var $search = $med.find("#rwMedInput" + m);
					operator = "";
					id = 0.0;
					parent_name = "";
					if($("#rwMedicationsOr").attr("checked"))
					{
						operator = "OR";
					}
					else
					{
						operator = "AND";
					}
					secArguments.push({
						ARGUMENT_NAME: "MED" + meds + "_OPERATOR",
						ARGUMENT_VALUE: operator,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});
					argument_name = "";
					if($med.hasClass("drugname"))
					{
						argument_name ="MED" + meds + "_DRUGNAME";
					}
					else
					{
						argument_name = "MED" + meds + "_DRUGCLASSID";
						id = parseFloat($search.attr("value"));
						parent_name = "mltm_drug_categories";
					}
					secArguments.push({
						ARGUMENT_NAME: argument_name,
						ARGUMENT_VALUE: $search.text(),
						PARENT_ENTITY_ID : id,
						PARENT_ENTITY_NAME : parent_name
					});
					$med.find(".rwMedStatus").each(function() {
						secArguments.push({
							ARGUMENT_NAME: "MED" + meds + "_STATUS",
							ARGUMENT_VALUE: $(this).attr("meaning"),
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : ""
						});
					});
					var input = $med.find('#rwMedBackTimeInput' + m).text();
					var appendName = '';
					var $medBackTimeOption = $('#rwMedBackTimeOption' + m);
					if ($medBackTimeOption.hasClass('backDays') === true) {
						appendName = '_BACKDAYS';
					} else if ($medBackTimeOption.hasClass('backWeeks') === true) {
						appendName = '_BACKWEEKS';
					} else if ($medBackTimeOption.hasClass('backMonths') === true) {
						appendName = '_BACKMONTHS';
					}
					secArguments.push({
						ARGUMENT_NAME: "MED" + meds + appendName,
						ARGUMENT_VALUE: input,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});
					meds++;
				}
				createSummaryViewMedItem = function($domItem) {
					return $('<li>').text($domItem.text());
				};
				createSummaryViewMedContainer = function(medProps) {
					if (medProps.domItems.length === 0) {
						return;
					}
					var	$medsList = $('<ul>');
					var	$container = $('<div>');
					var medListItems = $.map(medProps.domItems, createSummaryViewMedItem);

					$medsList.append(medListItems);
					if (medProps.showHeaderInSummaryView === true) {
						$container.prepend($('<h3>').text(medProps.headerInSummaryView));
					}
					$container.append($medsList);
					return $container;
				};
				summaryTextHtmlContainer.append($.map(summaryViewHtmlModel, createSummaryViewMedContainer));
				$('#summaryORDERSTATUS').show().find('.summaryText').html(summaryTextHtmlContainer.html());
				$("#sectionORDERSTATUS").find(".completeImg").show();
				if(numMeds == 3) {
					$("#rwMedSearchInput").attr("disabled","disabled");
				}
			}
			else
			{
				$("#summaryORDERSTATUS").hide().find(".summaryText").text("");
				$("#sectionORDERSTATUS").find(".completeImg").hide();
			}
			m_modifiedData[name] = secArguments;
			m_searchDialog.enablePrevNextBtns();
		}
	}
	function buildEncounterTypeContent(name, content) {
		name = name || '';
		content = content || [];
		function removeGroupEncounter(imgId) {
			$('#groupIndividualEncounters').find('.groupEncContent input[type=checkbox][checked=checked][value=' + imgId +']').attr('checked', false);
		}
		function removeIndividualEncounter(imgId) {
			$('#groupIndividualEncounters').find('.addIndividualEncContent input[type=checkbox][checked=checked][value=' + imgId +']').attr('checked', false);
		}
		function removeEncounter($image) {
	    	if($image && $image.length) {
	    		var imgId = $image.attr('id');
		    	if ($image.data('type') === 'INDIVIDUAL') {
		    		removeIndividualEncounter(imgId);
		    	} else {
		    		removeGroupEncounter(imgId);
		    	}
	    	}
		}
		function toggleIndividualEncSection() {
			$('#groupIndividualEncounters')
				.find('.addIndividualEncLabel img').toggle().end()
				.find('.addIndividualEncContent').toggle();
		}
		function showIndividualEncSection() {
			var $section = $('#groupIndividualEncounters'),
				$images = $section.find('.addIndividualEncLabel img');
			$images
				.first().hide().end()
   				.last().show();
			$section.find('.addIndividualEncContent').show();
		}
		function showRemoveEncounterIcon($row) {
			if($row && $row.length) {
				$row.addClass('zebra-blue')
					.find('.removeEncounterType').css('visibility', 'visible');
			}
		}
		function hideRemoveEncounterIcon($row) {
			if($row && $row.length) {
				$row.removeClass('zebra-blue')
					.find('.removeEncounterType').css('visibility', 'hidden');
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
		function buildGroupEncSection(encounterGroups) {
	        var sortedGroups = sortedEncounterGroups(encounterGroups),
	        	encounterGroup,
	        	encounters = [],
		    	content = '';

		    content += '<div class="topContent">' + i18n.rwl.GROUPENCOUNTERS + '</div>';
		    content += '<table class="groupEncContent"><tbody><tr>';
		    for (var count = 0, eLength = sortedGroups.length; count < eLength; count++) {
		    	encounterGroup = sortedGroups[count];
		        for (var child = 0, cLength = encounterGroup.CHILD_VALUES.length; child < cLength; child++) {
		            encounters.push(encounterGroup.CHILD_VALUES[child].ARGUMENT_VALUE);
		        }

		        content += '<td class="checkContent"><label>';
	            content += '<input type="checkbox"';
	            content += 'value="' + encounterGroup.PARENT_ENTITY_ID + '" ';
				content += 'data-fulltext="' + encounterGroup.ARGUMENT_VALUE.toString() + '" ';
				content += 'name="' + encounterGroup.ARGUMENT_VALUE + '" ';
	            content += 'data-children="' + encounters + '" ';
	        	content += '/>';
				content += '<span class="encounterName" value="' + encounterGroup.ARGUMENT_VALUE + '" data-children="' + encounters + '">' + encounterGroup.ARGUMENT_VALUE + '</span>';
	            content += '</label></td>';
	            encounters.length = 0;
		    }

		    content += '</tr></tbody></table>';
		    return content;
		}
		function buildIndividualEncTable(encounters) {
			var encounter,
				content = '',
				colSize = 4; // Number of columns to be displayed on individual encounters section

	    	content += '<table><tbody>';

	        for (var count = 0, eLength = encounters.length; count < eLength; count++) {
				if(count % colSize === 0) {
					if(count > 0) {
						content += '</tr>';
					}
					content += '<tr>';
				}

	        	encounter = encounters[count];
				content += 	'<td class="checkContent">' +
								'<label id="search' + setEncounterId(encounter.ARGUMENT_VALUE) + '">' +
									'<input type="checkbox" value="' + encounter.PARENT_ENTITY_ID + '"data-fulltext="' + encounter.ARGUMENT_VALUE.toString() + '"/>' +
									'<span class="encounterName" data-type="INDIVIDUAL" value="' + encounter.ARGUMENT_VALUE + '">' +
										'<span>' + encounter.ARGUMENT_VALUE + '</span>' +
										'<span class="encGroups"></span>' +
									'</span>' +
								'</label>' +
							'</td>';
			}
	        for(var x = count % colSize; x > 0 && x < colSize; x++) {
	        	content += '<td class="checkContent"></td>';
		        if (x === colSize - 1) {
		        	content += '</tr>';
		        }
	        }

		    content += '</tbody></table>';
		    return content;
		}
		function buildIndividualEncSection(individualEncounters) {
	        var sortedEncounters = alphaSort(individualEncounters,'ARGUMENT_VALUE'),
		    	content = '';

			content += '<div class="addIndividualEncLabel">';
		    content += '<img src="' + staticContentPath + '/images/5323_collapsed_16.png"/>';
		    content += '<img class="expandImg" src="' + staticContentPath + '/images/5323_expanded_16.png"/>';
		    content += '<span>' + i18n.rwl.ADDINDIVIDUALENCOUNTERS + '</span>';
		    content += '</div>';
	        content += '<div class="addIndividualEncContent">';
        	content += buildIndividualEncTable(sortedEncounters);
		    content += '</div>';

		    return content;
		}
		function buildGroupIndividualEncSection(encounterGroups) {
			var groupEncounters = [],
				individualEncounters = [],
				encounterGroup,
				content = '';

			content += '<div id="groupIndividualEncounters" class="groupIndividualEncSection">';

			for (var count = 0, eLength = encounterGroups.length; count < eLength; count++) {
		    	encounterGroup = encounterGroups[count];
		    	if (encounterGroup.PARENT_ENTITY_NAME === 'INDIVIDUAL_ENC_TYPE') {
		    		if (encounterGroup.ARGUMENT_MEANING === '1') {
	    				individualEncounters = encounterGroup.CHILD_VALUES;
		    		}
		    	} else {
	    			groupEncounters.push(encounterGroup);
		    	}
		    }
		    if (groupEncounters.length > 0) {
		    	content += buildGroupEncSection(groupEncounters);
		    }
		    if (individualEncounters.length > 0) {
		    	content += buildIndividualEncSection(individualEncounters);
		    }

		    content += '</div>';

		    return content;
		}
		function buildAddedEncSection() {
		    return 	'<div id="addedEncounters" class="addedEncTypesSection">' +
		    			'<div class="addedEncTypesLabel topContent">' + i18n.rwl.ADDEDENCOUNTERTYPES + '</div>' +
		    			'<div class="addedEncTypesContent"></div>' +
	        		'</div>';
		}
		function groupAddedEncSection(groups, parentEntityIds, encounters) {
			var content = '',
				groups = groups || [],
				parentEntityIds = parentEntityIds || [],
				encounters = encounters || [],
	    		gLength = groups.length;

	    	if (gLength > 0) {
		        content += '<ul>';
	            for (var index = 0; index < gLength; index++) {
        			content +=	'<li>';
	                content += 	'<img class="removeEncounterType"' +
		            				' id="' + parentEntityIds[index] + '"' +
		            				' src="' + staticContentPath + '/images/6457_over_darkBG_16.png"' +
            					'/>';
                	content +=	'<div>' +
        							'<div class="encounterTypeLabel groupSummaryLabel">' + groups[index] + i18n.rwl.COLON + '</div>' +
        							'<div>' + encounters[index].replace(/,/g, ', ') + '</div>' +
                				'</div>';
        			content += 	'</li>';
	            }
	            content += '</ul>';
	        }
	        return content;
		}
		function individualAddedEncSection(encounters, parentEntityIds) {
			var content = '',
				encounters = encounters || [],
				parentEntityIds = parentEntityIds || [],
	    		iLength = encounters.length;

	    	if (iLength > 0) {
		        content += '<div class="encounterTypeLabel individualLabel topContent">' + i18n.rwl.INDIVIDUALENCOUNTERSHEADER + '</div>';

		        content += '<ul class="individualList">';
	            for (var index = 0; index < iLength; index++) {
        			content += '<li>';
	                content += '<img class="removeEncounterType"';
		            content += ' id="' + parentEntityIds[index] + '"';
		            content += ' data-type="INDIVIDUAL"'; // data-type is the key we will reference to get the value of 'INDIVIDUAL' for an IE
		            content += ' src="' + staticContentPath + '/images/6457_over_darkBG_16.png"';
                	content += '/>';
        			content += '<span>' + encounters[index] + '</span>';
        			content += '</li>';
	            }
	            content += '</ul>';
	        }
	        return content;
		}
	    function updateAddedEncSection(groups, groupParentEntityIds, groupEncounters, individualEncounters, individualEncParentEntityIds) {
	    	var content = groupAddedEncSection(groups, groupParentEntityIds, groupEncounters) +
    						individualAddedEncSection(individualEncounters, individualEncParentEntityIds);

	    	$('#ENCOUNTERTYPE').find('.addedEncTypesContent').html(content);
	    }
	    function groupEncSummary(groups, encounters) {
	    	var displayText = '',
	    		groups = groups || [],
	    		encounters = encounters || [],
	    		gLength = groups.length;

	    	if (gLength > 0) {
            	displayText += '<li><span class="encSummaryLabel">' + i18n.rwl.GROUPENCOUNTERSHEADER + '</span></li>';
		    	for (var count = 0; count < gLength; count++) {
	            	displayText += '<li><span class="groupSummaryLabel">' + groups[count] + '</span>' + '(' + encounters[count].replace(/,/g, ', ') + ')' + '</li>';
		    	}
	    	}
	    	return displayText;
	    }
	    function individualEncSummary(encounters) {
	    	var displayText = '',
	    		encounters = encounters || [];

	    	if (encounters.length > 0) {
            	displayText += '<li><span class="encSummaryLabel">' + i18n.rwl.INDIVIDUALENCOUNTERSHEADER + '</span></li>';
            	displayText += '<li>' + encounters.join(', ') + '</li>';
	    	}
	    	return displayText;
	    }
	    function updateSummaryTab(groups, groupEncounters, individualEncounters) {
	    	var displayText = '',
	    		individualEncounters = individualEncounters || [],
	    		groups = groups || [];

    		displayText += '<ul>';
	    	displayText += groupEncSummary(groups, groupEncounters);
	    	displayText += individualEncSummary(individualEncounters);
	    	displayText += '</ul>';

            $('#summaryENCOUNTERTYPE').find('.summaryText').html(displayText).end().toggle(groups.length + individualEncounters.length > 0);
	    }
	    function toggleCriteriaListCheckMark(numOfEncounters) {
            $('#sectionENCOUNTERTYPE').find('.completeImg').toggle(numOfEncounters > 0);
	    }
        function clearSectionData() {
	        $('#groupIndividualEncounters').find('input:checked').attr('checked', false);
	        $(this).trigger('updateSection');
	    }
	    function setSectionData() {
        	var $section = $(this),
        		$input,
        		encounters = m_modifiedData.ENCOUNTERTYPE || [],
        		eLength = encounters.length;

			if(eLength > 0) {
				$('#groupIndividualEncounters input:not(:checked)').each(function() {
					for (var x = 0; x < eLength; x++) {
						$input = $(this);
						if($input.val() === encounters[x].PARENT_ENTITY_ID.toString()) {
							$input.attr('checked', true);
						}
					}
				});
			}
			showIndividualEncSection();

	       	$section.trigger('updateSection');
   		}
	    function updateSection() {
	        var id = $(this).parent().attr('id'),
	        	secArguments = [],
	        	encounterGroups = [],
	        	encGroupsParentEntityIds = [],
	        	encGroupChildren = [],
	        	individualEncounters = [],
	        	individualEncParentEntityIds = [];
			$('#groupIndividualEncounters').find('.addIndividualEncContent input:disabled').each(function () {
				var encounterLabelId = $(this).parent().attr('id'),
					$encounterSelector = $('#' + encounterLabelId);

				$encounterSelector.find('input').prop({'checked':false, 'disabled':false}).end()
					.find('span').removeClass('disableEncounter').end()
					.find('.encounterName').removeClass('disableEncounter').end()
					.find('.encGroups').empty().end()
					.removeClass('encGroupAdded').addClass('encGroupRemoved');
			});
			$('#groupIndividualEncounters').find('.groupEncContent input:checked').each(function () {
				var $item = $(this),
					children = $item.data('children');

                encounterGroups.push($item.data('fulltext'));
                encGroupsParentEntityIds.push($item.val());
				encGroupChildren.push(children);
				disableIndividualEncounters(children.split(','), $item.data('fulltext'), false);

				secArguments.push({
					ARGUMENT_NAME: 'ENCOUNTERTYPE',
					ARGUMENT_VALUE: $item.data('fulltext'),
					PARENT_ENTITY_ID: parseFloat($item.val()),
					PARENT_ENTITY_NAME: ''
				});
			});
			$('#groupIndividualEncounters').find('.addIndividualEncContent input:checked:enabled').each(function () {
                var $item = $(this);
                individualEncounters.push($item.data('fulltext'));
                individualEncParentEntityIds.push($item.val());
	            secArguments.push({
	                ARGUMENT_NAME: 'ENCOUNTERTYPE',
	                ARGUMENT_VALUE: $item.data('fulltext'),
	                PARENT_ENTITY_ID: parseFloat($item.val()),
	                PARENT_ENTITY_NAME: 'INDIVIDUALENCOUNTER'
	            });
            });
            m_modifiedData[id] = secArguments;

            updateAddedEncSection(encounterGroups, encGroupsParentEntityIds, encGroupChildren, individualEncounters, individualEncParentEntityIds);

            updateSummaryTab(encounterGroups, encGroupChildren, individualEncounters);

            toggleCriteriaListCheckMark(secArguments.length);
	    }
	    var encounterTypesContent = '<div class="encounterTypesContent">';
	    encounterTypesContent += buildGroupIndividualEncSection(content);
	    encounterTypesContent += buildAddedEncSection();

	    encounterTypesContent += '</div>';
	    $m_criteriaContent.find('#' + name).children('.sectionContent')
            .bind('updateSection', updateSection)
            .bind('setSectionData', setSectionData)
            .bind('clearSectionData', clearSectionData)
            .empty()
            .append($(encounterTypesContent)
				.on('click', '#groupIndividualEncounters input', function() {
					$(this).parents('.sectionContent').trigger('updateSection');
				})
				.on('click', '#addedEncounters .removeEncounterType', function() {
					var $removeImg = $(this);
					removeEncounter($removeImg);
					$removeImg.parents('.sectionContent').trigger('updateSection');
				})
				.on('click', '#groupIndividualEncounters .addIndividualEncLabel', function() {
					toggleIndividualEncSection();
				})
				.on('mouseenter', '#addedEncounters .addedEncTypesContent li', function() {
					showRemoveEncounterIcon($(this));
				})
				.on('mouseleave', '#addedEncounters .addedEncTypesContent li', function() {
					hideRemoveEncounterIcon($(this));
				})
				.on('mouseenter', '#groupIndividualEncounters .encounterName', function(event) {
					displayEncounterTooltip($(this), event, $('#rwSearchDlgTooltip'));
				})
				.on('mouseleave', '#groupIndividualEncounters .encounterName', function() {
					hideTooltip($('#rwSearchDlgTooltip'));
				})
			);
	}

	function buildOrderContent(name, content) {
		var statusContent = ['<table id="orderStatusVals" class="floatTable moreContentTable">','<tbody>'];
		var typeContent = ['<table id="typeVals" class="floatTable moreContentTable">','<tbody'];

		typeContent.push('<tr><th><span>' + i18n.rwl.TYPE + '</span></th></tr>');
		statusContent.push("<tr><th><label class='rwSecSel_sectionLabel'>" +
							"<input type='checkbox' id='checkAllOrdersStatus'/>" +
							"<span>" + i18n.rwl.STATUS + "</span></label></th></tr>");

		for(var c = 0, length = content.length; c < length; c++) {
			if(content[c].ARGUMENT_TYPE == "status") {
				statusContent.push("<tr><td><label class='rwSecSel_sectionLabel'>" +
							"<input type='checkbox' value=" + content[c].PARENT_ENTITY_ID + " parent_name='" + content[c].PARENT_ENTITY_NAME + "'/>" +
							"<span>" + content[c].ARGUMENT_VALUE + "</span></label></td></tr>");
			}
			else {
				typeContent.push("<tr><td><label class='rwSecSel_sectionLabel'>" +
							'<input type="checkbox" value="' + content[c].PARENT_ENTITY_ID + '" fulltext="' + content[c].ARGUMENT_VALUE.toString() + '"/>' +
							'<span>' + content[c].ARGUMENT_VALUE + '</span></label></td></tr>');
			}
		}

		typeContent.push("</tbody>","</table>");
		statusContent.push("</tbody>", "</table>");

		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
				.empty()
				.append($("<div class='multiInputContent ordersContent'>")
					.append($("<div id='rwOrderDates' class=' leftFloat rwDates'>")
							.append($("<div id='rwOrderPast' class ='leftFloat'>")
								.append("<span>" + i18n.rwl.PAST + " <br/></span>",
										$("<input id='rwOrderFromDate' class='cwNumInput rwOrderDate' type='text' value ='0' maxlength='" + m_maxDigits.Days + "'>")
											.bind("keypress paste",getKeyPressValidatorEvent())
											.keyup(function() {
												var timeVal = $("#rwOrderDateDrop").val();
												var inputVal = $(this).val();
												var $from = $("#rwOrderFromDate");
												var $to = $("#rwOrderToDate");
												var fromVal = $from.val();
												var toVal = $to.val();
												if((inputVal > 546 && timeVal == 0) ||
													(inputVal > 78 && timeVal == 1) ||
													(inputVal > 18 && timeVal == 2)) {
														$(this).addClass("divInputError").siblings(".invalidEntry").show();
														$("#rwOrderTimeMax").addClass('divAdmissionMaxColor');
														$("#sectionORDERSSTATUS").find(".errorImg").show();
												}
												else {
													$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
													if(!($from.hasClass("divInputError")) && !($to.hasClass("divInputError"))) {
														$("#rwOrderTimeMax").removeClass('divAdmissionMaxColor');
														$("#sectionORDERSSTATUS").find(".errorImg").hide();
													}
												}
												$(this).parents(".sectionContent").trigger("updateSection");
											}),
										$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
							$("<div id='rwOrderFuture' class ='leftFloat'>")
								.append("<span>" + i18n.rwl.FUTURE + "<br/></span>",
										$("<input id='rwOrderToDate' class='cwNumInput rwOrderDate' type='text' value='0' maxlength='" + m_maxDigits.Days + "'>")
											.bind("keypress paste",getKeyPressValidatorEvent())
											.keyup(function() {
												var timeVal = $("#rwOrderDateDrop").val();
												var inputVal = $(this).val();
												var $from = $("#rwOrderFromDate");
												var $to = $("#rwOrderToDate");
												if((inputVal > 546 && timeVal == 0) ||
													(inputVal > 78 && timeVal == 1) ||
													(inputVal > 18 && timeVal == 2)) {
														$(this).addClass("divInputError").siblings(".invalidEntry").show();
														$("#rwOrderTimeMax").addClass('divAdmissionMaxColor');
														$("#sectionORDERSSTATUS").find(".errorImg").show();
												}
												else {
													$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
													if(!($from.hasClass("divInputError")) && !($to.hasClass("divInputError"))) {
														$("#rwOrderTimeMax").removeClass('divAdmissionMaxColor');
														$("#sectionORDERSSTATUS").find(".errorImg").hide();
													}
												}
												$(this).parents(".sectionContent").trigger("updateSection");
											}),
										$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>"))),
						$("<div id='rwOrderDate' class='leftFloat'>")
							.append($("<br/><select id='rwOrderDateDrop'>" +
										"<option value = '0'>" + i18n.rwl.DAYS + "</option>" +
										"<option value = '1'>" + i18n.rwl.WEEKS + "</option>" +
										"<option value = '2'>" + i18n.rwl.MONTHS + "</option>" +
									"</select>")
										.change(function() {
											var option = $(this).val();
											switch(option) {
												case "0":
													$("#rwOrderTimeMax").text(i18n.rwl.DAYSMAX);
													break;
												case "1":
													$("#rwOrderTimeMax").text(i18n.rwl.WEEKSMAX);
													break;
												case "2":
													$("#rwOrderTimeMax").text(i18n.rwl.MONTHSMAX);
													break;
											}
											$("#rwOrderDates").find(".rwOrderDate").keyup();
										}),
									"<span id= 'rwOrderTimeMax'>" + i18n.rwl.DAYSMAX + "</span>")),
						$("<div id='rwOrderType'>")
							.append($(typeContent.join(""))
										.on("click", "input", function() {
											$(this).parents(".sectionContent").trigger("updateSection");
										})
										.on("resize mousemove mouseout scroll",function(e){
											switch(e.type){
												case 'mousemove':
													showSearchMultiSelectTooltip(e);
													break;
												case 'mouseout':
												case 'scroll':
													hideSearchMultiSelectTooltip();
													break;
												case 'resize':
													truncateMultiSelectOptions(e);
													break;
											}
										})),
						$("<div id='rwOrderStatus'>")
							.append($(statusContent.join(""))
									.on("click", "input", function() {
										var $input = $(this);
										var $content = $input.parents(".sectionContent");
										var $statusListInput = $("#rwOrderStatus").find("input");
										var id = $input.attr("id");
										if(id == "checkAllOrdersStatus") {
											if($input.attr("checked") == "checked") {
												$statusListInput.attr("checked", "checked");
											}
											else {
												$statusListInput.removeAttr("checked");
											}
										}
										else {
											var checkedStatus = $input.attr("checked");
											if(checkedStatus != "checked") {
												$("#checkAllOrdersStatus").removeAttr("checked");
											}
											else {
												var numInputs = $statusListInput.length;
												var numChecked = $statusListInput.filter(":checked").length;
												if(numChecked == (numInputs - 1)) {
													$("#checkAllOrdersStatus").attr("checked", "checked");
												}
											}
										}
										$content.trigger("updateSection");
									})));

		function updateSection() {
			var $section = $(this);
			var id = $section.parent().attr("id");
			var secArguments = [];
			var secContent = "";
			var orderFromDate = $("#rwOrderFromDate").val();
			var orderToDate = $("#rwOrderToDate").val();
			var checked = [];
			var selected = [];
			var orderStatsString = i18n.rwl.ORDERSTATUSSTR;
			var statuses = "";
			var types = "";
			$("#rwOrderStatus")
				.find("input:checked").not("#checkAllOrdersStatus")
				.each(function(){
					var $item = $(this);
					var siblingsSpanText = $item.siblings("span").text();
					checked.push({
						ARGUMENT_NAME:id,
						ARGUMENT_VALUE:siblingsSpanText,
						PARENT_ENTITY_ID:parseFloat($item.val()),
						PARENT_ENTITY_NAME:$item.attr("parent_name")
					});
					statuses += siblingsSpanText + ", ";
				});
			var orderStatusIndex = statuses.lastIndexOf(",");
			statuses = statuses.substring(0, orderStatusIndex);

			$("#rwOrderType :checked").each(function(){
				var $item = $(this);
				var text = $item.siblings("span").text();
				selected.push({
					ARGUMENT_NAME:"ORDERTYPE",
					ARGUMENT_VALUE:text,
					PARENT_ENTITY_ID:parseFloat($item.val()),
					PARENT_ENTITY_NAME:"CODE_VALUE"
				});
				types += text + ", ";
			});
			var orderTypeIndex = types.lastIndexOf(",");
			types = types.substring(0, orderTypeIndex);

			if(orderFromDate && orderToDate && checked.length > 0 && selected.length > 0 &&
					$("#sectionORDERSSTATUS").find(".errorImg").is(":visible") == false) {
				secArguments = secArguments.concat(checked);
				secArguments = secArguments.concat(selected);
				secArguments.push({
					ARGUMENT_NAME : "ORDERFROM",
					ARGUMENT_VALUE : orderFromDate,
					PARENT_ENTITY_ID : "0",
					PARENT_ENTITY_NAME : "CODE_VALUE"
				});
				secArguments.push({
					ARGUMENT_NAME : "ORDERTO",
					ARGUMENT_VALUE : orderToDate,
					PARENT_ENTITY_ID : "0",
					PARENT_ENTITY_NAME : "CODE_VALUE"
				});
				var $orderDateDropSelected = $("#rwOrderDateDrop :selected");
				var drop = $orderDateDropSelected.text();
				var sDropVal = $orderDateDropSelected.val();
				secArguments.push({
					ARGUMENT_NAME : "ORDERDATEUNIT",
					ARGUMENT_VALUE : m_controller.fnMapSelectedDateValue(sDropVal),
					PARENT_ENTITY_ID : "0",
					PARENT_ENTITY_NAME : "CODE_VALUE"
				});

				orderStatsString = orderStatsString.replace("{7}",statuses);
				orderStatsString = orderStatsString.replace("{8}",types);
				orderStatsString = orderStatsString.replace("{9}",orderFromDate);
				orderStatsString = orderStatsString.replace("{10}",drop.toLowerCase());
				orderStatsString = orderStatsString.replace("{11}",orderToDate);
				orderStatsString = orderStatsString.replace("{12}",drop.toLowerCase());
				secContent = orderStatsString;

				$("#summaryORDERSSTATUS").show().find(".summaryText").text(secContent);
				$("#sectionORDERSSTATUS").find(".completeImg").show();
				m_modifiedData[id] = secArguments;
			}
			else {
				$("#summaryORDERSSTATUS").hide().find(".summaryText").text("");
				$("#sectionORDERSSTATUS").find(".completeImg").hide();
				m_modifiedData[id] = [];
			}
			m_searchDialog.enablePrevNextBtns();
		}

		function setSectionData() {
			var checked = m_modifiedData.ORDERSSTATUS || [];
			var selected = m_modifiedData.ORDERTYPE || [];
			var fromDate = m_modifiedData.ORDERFROM || [];
			var toDate = m_modifiedData.ORDERTO || [];
			var drop = m_modifiedData.ORDERDATEUNIT || [];

			for(var y =0, len = checked.length; y < len; y++) {
				$(this).find("input[value=" + checked[y].PARENT_ENTITY_ID+"]").attr('checked', true);
			}
			for(var s =0, slen = selected.length; s < slen; s++) {
				$(this).find("input[value=" + selected[s].PARENT_ENTITY_ID + "]").attr("checked", true);
			}

			if(fromDate.length > 0 && toDate.length > 0 && drop.length > 0) {
				var dateUnit = drop[0].ARGUMENT_VALUE;
				var dropValue = -1;
				switch(dateUnit) {
					case "D":
						dropValue = 0;
						break;
					case "W":
						dropValue = 1;
						break;
					case "M":
						dropValue = 2;
						break;
				}
				var fDate = fromDate[0].ARGUMENT_VALUE;
				var tDate = toDate[0].ARGUMENT_VALUE;
				$("#rwOrderFromDate").val(fDate);
				$("#rwOrderToDate").val(tDate);
				$("#rwOrderDateDrop").val(dropValue).change();
			}
			delete m_modifiedData.ORDERTYPE;
			delete m_modifiedData.ORDERFROM;
			delete m_modifiedData.ORDERTO;
			delete m_modifiedData.ORDERDATEUNIT;
		}

		function clearSectionData() {
			$(this).find("input:checked").attr("checked", false);
			$("#rwOrderDates").find(".rwOrderDate").val("0");
			$("#rwOrderDateDrop").val("0").change();
		}
	}

	function buildResultsContent(name, title) {
		var selectContent = [
			"<select id ='rwValueDrop" + name + "' class='rwValueSelect' disabled='disabled'>",
				"<option value='0'>" + i18n.rwl.ANY + "</option>",
				"<option value='1'>" + i18n.rwl.GREATERTHAN + "</option>",
				"<option value='2'>" + i18n.rwl.GREATERTHANEQ + "</option>",
				"<option value='3'>" + i18n.rwl.LESSTHAN + "</option>",
				"<option value='4'>" + i18n.rwl.LESSTHANEQ + "</option>",
				"<option value='5'>" + i18n.rwl.EQUAL + "</option>",
				"<option value='6'>" + i18n.rwl.BETWEEN + "</option>",
			"</select>"
		];

		$m_criteriaContent.find("#" + name).children(".sectionContent")
			.attr("rtype", name)
			.bind("updateSection",updateSection)
			.bind("setSectionData",setSectionData)
			.bind("clearSectionData", clearSectionData)
			.empty()
			.append($("<div id ='rwSecSel_" + name + "'>")
				.append($("<div id='" + name + "Operator' class='resultMedPadding topContent'>" +
							"<span>" + i18n.rwl.SELECTONE + "</span>" +
							"<label><input type ='radio' name='rw" + name + "OperatorType' value='or' class ='rwResultOr' id='rw" + name + "Or' checked='checked'>" + i18n.rwl.OR + "</label> &nbsp;&nbsp;" +
							"<label><input type ='radio' name='rw" + name + "OperatorType' value='and' id='rw" + name + "And'>" + i18n.rwl.AND + " </label><br/>" +
							"</div>"),
						$("<div class='overflowDiv'>")
							.append($("<div class='multiInputContent resultMinWidth'>")
									.append($("<div class='resultName borderedContent leftFloat'>")
												.append($("<span id = 'rwDivResultType" + name + "' class = 'rwResult" + name + " divResultMedType'>" + i18n.rwl.NAME + "<br/></span>"),
														$("<input type='text' id = 'rwResultType" + name + "' rtype='" + name + "' class='searchInput'/>")
															.bind("keyup paste", m_controller.debounce(function() {
																var $input = $(this);
																var type = $input.attr('rtype');
																var result = $.trim($input.val());
																if (result) {
																	$input.addClass('searching');
																		var newResult = $.trim($("#rwResultType" + name).val());
																		if (newResult === result) {
																			var result_request = {};
																			for (var m = 0, mSectionsLength = m_sections.length; m < mSectionsLength; m++) {
																				if (m_sections[m].name === name) {
																					var argument_names = m_sections[m].argument_name || '';
																					var argument_list = [];
																					var index = argument_names.indexOf(",");
																					while (index !== -1) {
																						var argument = argument_names.substring(0,index);
																						argument_list.push({
																							event_set: argument
																						});
																						argument_names = argument_names.substring(index+1);
																						index = argument_names.indexOf(",");
																					}
																					argument_list.push({
																						event_set: argument_names
																					});
																					result_request = {
																						result_request:{
																							text: newResult,
																							parent_event_set: argument_list,
																							concept: 'EVENT_SET_CONCEPT_' + type.substr(type.length - 1),
																							pos_cd: m_controller.getCriterion().CRITERION.POSITION_CD
																						}
																					};
																				}
																			}
																			m_controller.makeCall("mp_dcp_result_options",result_request,true,function(reply) {
																				$input.removeClass('searching');
																				if(m_controller.doesValueMatch($input, newResult) === false) {
																					return;
																				}

																				var options = reply.RESULT_OPTIONS || [];
																				var eventSetGroupList = reply.EVENT_SET_CONCEPTS || [];
																				$("#rwResultOptionList" + name).remove();
																				var optionsLength = options.length;
																				var eventSetGroupListLength = eventSetGroupList.length;
																				if (optionsLength > 0 || eventSetGroupListLength > 0) {
																					var htmlString = "<select id ='rwResultOptions" + name + "' class ='searchOptions' size ='7'>";
																					for (var j = 0; j < eventSetGroupListLength; j++) {
																						htmlString += "<option class='groupedItems' id ='rwGroupResult" + name + j + "' eventName = '" + eventSetGroupList[j].NAME + "'>";
																						htmlString += eventSetGroupList[j].NAME + i18n.rwl.GROUP;
																						htmlString += "</option>";
																					}
																					for (var i = 0; i < optionsLength; i++) {

																						htmlString += "<option class='singleItems' id ='rwResult" + name + i + "' eventName = '" + options[i].EVENT_SET_NAME + "'>";
																						htmlString += options[i].EVENT_SET_DISP;
																						htmlString += "</option>";
																					}
																					htmlString += "</select>";
																					$input.parent().append($("<div id='rwResultOptionList" + name + "' class='resultMedOptionList'>")
																						.html(htmlString));
																					for (var i = 0; i < eventSetGroupListLength; i++) {
																						$("#rwGroupResult" + name + i).data("groupingResultFilterData", eventSetGroupList[i].EVENT_CODES);
																					}
																					var $list = $("#rwResultOptions" + name);
																					var total = optionsLength + eventSetGroupListLength;
																					if (total === 1) {
																						$list.attr("size", 2);
																					} else if (total < 8) {
																						$list.attr("size", total);
																					}
																					$list.change(function() {
																						var $selected = $("#rwResultOptions" + name + " :selected");
																						var selectedText = $selected.text();
																						var $selectedID = $("#" + $selected.attr("id"));
																						var $textField = $("#rwResultType" + name);
																						$textField.val(selectedText).attr("eventName", $selected.attr("eventName"));
																						$textField.addClass($selected.attr("class")).removeClass("selectedGroup");
																						if ($selectedID.hasClass("groupedItems")) {
																							$textField.data("typeFieldGroupData", $selectedID.data("groupingResultFilterData")).addClass("selectedGroup");
																						}
																						$("#rwResultOptionList" + name).remove();
																						if (m_searchObj.medResultExists("addedResults" + name, selectedText, "rwEventset", name)) {
																							$("#rwResultsAddBut" + name).attr("disabled", "disabled").addClass("addButdisabled");
																							$("#rwDivAdd" + type).find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled","disabled");
																						} else {
																							$("#rwResultsAddBut" + name).removeAttr("disabled").removeClass("addButdisabled");
																							$("#rwDivAdd" + type).find(".addImg").removeClass("addButdisabled").attr("src", staticContentPath + "/images/3941_16.png").parent().removeAttr("disabled");
																						}
																						$("#rwResultsCountDrop" + name).removeAttr("disabled").val(0);
																						$("#rwResultsCountInput" + name).removeAttr("disabled").val(1);
																						$("#rwValueDrop" + name).removeAttr("disabled").val(0).change();
																						$("#rwTimeInput" + name).removeAttr("disabled").val(546).keyup();
																						$("#rwTimeDrop" + name).removeAttr("disabled").val(0);
																						$("#rwTimeMax" + name).empty().append(i18n.rwl.DAYSMAX);
																					});
																				}
																			});
																		}
																}
																else {
																	$("#rwResultOptionList" + name).remove();
																	$input.removeClass('searching');
																	$("#rwResultsCountDrop" + name).attr("disabled","disabled").val(0);
																	$("#rwResultsCountInput" + name).attr("disabled","disabled").val("");
																	$("#rwValueDrop" + name).val(0).attr("disabled","disabled").change();
																	$("#rwTimeInput" + name).attr("disabled","disabled").val("");
																	$("#rwTimeDrop" + name).attr("disabled","disabled").val(0);
																	$("#rwTimeMax" + name).empty();
																	$("#rwResultsAddBut" + name).attr("disabled", "disabled").addClass("addButdisabled");
																	$("#rwDivAdd" + type).find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled","disabled");
																}
															}, m_controller.delayDuration))),
											$("<div class='resultQuantity borderedContent leftFloat'>")
												.append($("<div class='leftFloat'>").append($("<span id = 'rwDivResultsCount" + name + "' class='rwResult" + name + "'>" + i18n.rwl.QUANTITY + "<br/></span>"),
														$("<select id = 'rwResultsCountDrop" + name + "' disabled='disabled'>" +
																"<option value='0'>" + i18n.rwl.ATLEAST + "</option>" +
																"<option value='1'>" + i18n.rwl.LESSTHAN + "</option>" +
															"</select><span>&nbsp;&nbsp;</span>")),
														$("<div class='leftFloat'><br/>").append($("<input id ='rwResultsCountInput" + name + "' class = 'cwNumInput' type = 'text' disabled='disabled' maxlength='" + m_maxDigits.Values + "'/>")
															.bind("keypress paste",getKeyPressValidatorEvent())
															.keyup(function() {
																if($(this).val()) {
																	$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
																	$("#section" + name).find(".errorImg").hide();
																}
																else {
																	$(this).addClass("divInputError").siblings(".invalidEntry").show();
																	$("#section" + name).find(".errorImg").show();
																}
																onResultChange(name);
															}),
															$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>"))),
										$("<div id='value" + name + "' class='resultValue borderedContent leftFloat'>"),
										$("<div class='resultTime borderedContent leftFloat'>")
											.append($("<span>" + i18n.rwl.LOOKBACKRANGE + " <br/></span>"),
													$("<input id='rwTimeInput" + name + "' class = 'cwNumInput' type='text' maxLength= '" + m_maxDigits.Days + "' disabled='disabled'/><span>&nbsp;&nbsp;</span>")
														.bind("keypress paste",getKeyPressValidatorEvent())
														.keyup(function() {
															var timeVal = $("#rwTimeDrop" + name).val();
															var inputVal = $(this).val();
															if((inputVal > 546 && timeVal == 0) ||
																(inputVal > 78 && timeVal == 1) ||
																(inputVal > 18 && timeVal == 2) || (inputVal == ""))
															{
																$(this).addClass("divInputError").siblings(".invalidEntry").show();
																$("#rwTimeMax" + name).addClass('divAdmissionMaxColor');
																$("#section" + name).find(".errorImg").show();
															}
															else
															{
																$(this).removeClass("divInputError").siblings(".invalidEntry").hide();
																$("#rwTimeMax" + name).removeClass('divAdmissionMaxColor');
																$("#section" + name).find(".errorImg").hide();
															}
															onResultChange(name);
														}),
													$("<select id='rwTimeDrop" + name + "' disabled='disabled'>" +
															"<option value = '0'>" + i18n.rwl.DAYS + "</option>" +
															"<option value = '1'>" + i18n.rwl.WEEKS + "</option>" +
															"<option value = '2'>" + i18n.rwl.MONTHS + "</option>" +
														"</select>")
														.change(function() {
															$("#rwTimeMax" + name).empty();
															switch($(this).val()) {
																case "0":
																	$("#rwTimeInput" + name).keyup();
																	$("#rwTimeMax" + name).append(i18n.rwl.DAYSMAX);
																	break;
																case "1":
																	$("#rwTimeInput" + name).keyup();
																	$("#rwTimeMax" + name).append(i18n.rwl.WEEKSMAX);
																	break;
																case "2":
																	$("#rwTimeInput" + name).keyup();
																	$("#rwTimeMax" + name).append(i18n.rwl.MONTHSMAX);
																	break;
															}
															onResultChange(name);
														}),
													$("<span id= 'rwTimeMax" + name + "' class='padding'></span>"),
													$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
										$("<div id = 'rwDivAdd" + name + "' class='resultAdd leftFloat'>")
											.append($("<span disabled='disabled'><img class='addImg addButdisabled' src='" + staticContentPath + "/images/3941_disabled_16.gif'/><br/></span>"),
												$("<span id = 'rwResultsAddBut" + name + "' class='addButdisabled resultMedAddBut' disabled='disabled'>" + i18n.rwl.ADD + "</span>"))
											.on("click", "span", function() {
													if($(this).is(':disabled')) {
															return;
													}
													var $textField = $("#rwResultType" + name);
													var resultsAdded = $("#addedResults" + name).find(".rwResultText").length;
													if(resultsAdded < 3 && $("#rwResultType" + name).val()){
														var text = "<div id = 'rwResult" + name + resultsAdded + "' class = 'resultMedPadding rwResultText";
														if(resultsAdded % 2 === 0) {
															text += " zebra-white'>";
														}
														else {
															text += " zebra-blue'>";
														}
														text += getResultsText(resultsAdded);
														text += "</div>";
														$("#addedResults" + name).append(text).find(".noResults").hide();
														if($textField.hasClass("selectedGroup")){
															$("#rwResult" + name + resultsAdded).data("resultTextFieldGroupData", $textField.data("typeFieldGroupData")).addClass("filterByGroup");
														}
														clear();
														resultsAdded++;
														if(resultsAdded == 3)
														{
															$("#rwResultType" + name).attr("disabled","disabled");
														}
														$(this).parents(".sectionContent").trigger("updateSection");
													}
											}))),
						$("<div class='bottomContent'>")
							.append($("<div class='topContent'>")
										.append($("<span>" + i18n.rwl.ADDED + " " + title + "</span>")),
									$("<div id='addedResults" + name + "' class='addedResults'>")
										.append($("<span class='noResults'>" + i18n.rwl.NO + " " + title + " " + i18n.rwl.ADDEDL + "</span>")))));

		var value_query;
		for(var m = 0; m < m_sections.length; m++)
		{
			if(name == m_sections[m].name)
				value_query = m_sections[m].value_query;
		}
		if(value_query == "1")
		{
			$("<div id = 'rwDivValues" + name + "' class = 'rwResult" + name + "'>" + i18n.rwl.VALUE + "<br/>")
				.append($("<div>").append($(selectContent.join(""))
							.change(function() {
								var value = $(this).val();
								if(value == 0) //0 is the Any option - no inputs will be displayed
								{
									$("#rwValueInputs" + name).hide().find("input").val("").hide();
									$("#section" + name).find(".errorImg").hide();
								}
								else if(value == 6) //6 is the Between option - both inputs will be displayed
								{
									$("#rwValueInputs" + name).show();
									$("#rwValueFromInput" + name).show().find("input").val("").show().keyup();
									$("#rwValueToInput" + name).show().find("input").val("").show().keyup();
									$("#rwValueAndText" + name).show();
								}
								else //otherwise only one input with be displayed
								{
									$("#rwValueInputs" + name).show();
									$("#rwValueFromInput" + name).show().find("input").val("").show().keyup();

									$("#rwValueToInput" + name).hide().find("input").val("").hide();
									$("#rwValueAndText" + name).hide();
								}
								onResultChange(name);
							})),
						$("<div id = 'rwValueInputs" + name + "' class='leftFloat'>")
							.append($("<div id='rwValueFromInput" + name + "' class='rwResultValueInputs leftFloat'>")
										.append($("<input id = 'rwValueInput1" + name + "' class = 'cwNumInput' type = 'text' maxlength='" + m_maxDigits.Values + "'/>")
													.bind("keypress paste",getKeyPressValidatorEvent(true,true))
													.keyup(function(){
														var $this = $(this);
														var resultFromVal = $this.val();
														if(resultFromVal) {
															$this.removeClass("divInputError").siblings(".invalidEntry").hide();
															$("#rwResultsAddBut" + name).removeAttr("disabled");
															$("#section" + name).find(".errorImg").hide();
														}
														else {
															$this.addClass("divInputError").siblings(".invalidEntry").show();
															$("#rwResultsAddBut" + name).attr("disabled", "disabled");
															$("#section" + name).find(".errorImg").show();
														}

														var newResultFromVal = $this.val();
														if(newResultFromVal == resultFromVal) {
															m_searchObj.compareFromToRange($this, $("#rwValueInput2" + name));
															onResultChange(name);
														}
														onResultChange(name);
													}),
												$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")),
									$("<div id='rwValueAndText" + name + "' class='rwResultValueInputs leftFloat'>")
										.text(i18n.rwl.ANDL),
									$("<div id='rwValueToInput" + name + "' class='rwResultValueInputs leftFloat'>")
										.append($("<input id = 'rwValueInput2" + name + "' class = 'cwNumInput' type = 'text' maxlength='" + m_maxDigits.Values + "'/>")
													.bind("keypress paste",getKeyPressValidatorEvent(true,true))
													.keyup(function(){
														var $this = $(this);
														var resultToVal = $this.val();
														if(resultToVal) {
															$this.removeClass("divInputError").siblings(".invalidEntry").hide();
															$("#rwResultsAddBut" + name).removeAttr("disabled");
															$("#section" + name).find(".errorImg").hide();
														}
														else {
															$this.addClass("divInputError").siblings(".invalidEntry").show();
															$("#rwResultsAddBut" + name).attr("disabled", "disabled");
															$("#section" + name).find(".errorImg").show();
														}

														var newResultToVal = $this.val();
														if(newResultToVal == resultToVal) {
															m_searchObj.compareFromToRange($("#rwValueInput1" + name), $this);
															onResultChange(name);
														}
														onResultChange(name);
													}),
												$("<span class='invalidEntry'><br/>" + i18n.rwl.INVALIDENTRY + "</span>")))).appendTo($m_criteriaContent.find("#value" + name).show());
		}
		function getResultsText(resultCount)
		{
			var htmlString = "";
			if($("#rwResultType" + name).val())
			{
				var resultResultType = $("#rwResultType" + name).val();
				var eventName = $("#rwResultType" + name).attr("eventName");
				var resultsDrop = $("#rwResultsCountDrop"+ name + " :selected").text();
				var resultsInput = $("#rwResultsCountInput" + name).val();
				var valueDrop = $("#rwValueDrop"+ name + " :selected").text();
				var valueInput1 = $("#rwValueInput1" + name).val();
				var valueInput2 = $("#rwValueInput2" + name).val();
				var daysInput = $("#rwTimeInput" + name).val();
				var daysDrop = $("#rwTimeDrop"+ name + " :selected").text();
				htmlString += "<div>";
				htmlString += "<span id ='rwCountOption" + resultCount + name + "'>" + resultsDrop + "</span> <span id='rwCountInput" + resultCount + name + "'>" + resultsInput + "</span>";
				htmlString += " <span id ='rwEventset" + resultCount + name + "' eventName ='" + eventName + "'>" + resultResultType + "</span>";
				if(valueDrop) {
					if(valueDrop == i18n.rwl.ANY) {
						htmlString += " <span id ='rwValOption" + resultCount + name + "'>" + i18n.rwl.OFANYVALUE + "</span>";
					}
					else if(valueDrop == i18n.rwl.BETWEEN) {
						htmlString += " <span id ='rwValOption" + resultCount + name + "'>" + i18n.rwl.BETWEENL + "</span> <span id='rwValInput1" + resultCount + name + "'>" + valueInput1 + "</span> " + i18n.rwl.ANDL + " <span id='rwValInput2" + resultCount + name + "'>" + valueInput2 + "</span>";
					}
					else {
						htmlString += " <span id ='rwValOption" + resultCount + name + "'>" + valueDrop.toLowerCase() + "</span> <span id='rwValInput1" + resultCount + name + "'>" + valueInput1 + "</span>";
					}
				}
				htmlString += " " + i18n.rwl.INTHELAST + " <span id='rwBackTimeInput" + resultCount + name + "'>" + daysInput + "</span> <span id='rwBackTimeOption" + resultCount + name + "'>" + daysDrop.toLowerCase() + "</span>";
			}
			return htmlString;
		}
		function clear()
		{
			$("#rwResultsCountDrop" + name).val(0).attr("disabled","disabled");
			$("#rwResultsCountInput" + name).val("").attr("disabled","disabled").removeClass("divInputError").siblings(".invalidEntry").hide();
			$('#rwResultType' + name).val('').removeClass('searching');
			$("#rwValueDrop" + name).val(0).attr("disabled","disabled").change();
			$("#rwTimeInput" + name).val("").attr("disabled","disabled").removeClass("divInputError").siblings(".invalidEntry").hide();
			$("#rwTimeDrop" + name).val(0).attr("disabled","disabled");
			$("#rwTimeMax" + name).empty().removeClass("divAdmissionMaxColor");
			$("#rwResultsAddBut" + name).attr("disabled", "disabled").addClass("addButdisabled");
			$("#rwDivAdd" + name).find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled","disabled");
			$("#section" + name).find(".errorImg").hide();
		}
		function clearSectionData() {
			clear();
			$("#rw" + name + "Or").attr("checked", "checked");
			$("#addedResults" + name).children().not(".noResults").remove().children(".noResults").show();
			$("#rwResultType" + name).removeAttr("disabled");
			$("#rwResultOptionList" + name).remove();
			$(this).trigger("updateSection");
		}
		function setSectionData() {
			var $section = $(this);
			var secType = $section.attr("rtype");
			var secNum = secType.substring(secType.length-1);
			var secArguments = m_modifiedData[secType.toUpperCase()] || [];
			var startNum;
			var resultArray;
			var resultArg;
			var resultCount = 0;
			switch(secNum) {
				case "1":
					startNum = 1;
					break;
				case "2":
					startNum = 4;
					break;
				case "3":
					startNum = 7;
					break;
				case "4":
					startNum = 10;
					break;
				case "5":
					startNum = 13;
					break;
			}
			for(var endNum = startNum + 3; startNum < endNum; startNum++) {
				resultArray = [];
				resultArg = "RESULT" + startNum;
				for(var r = 0, length = secArguments.length; r < length; r++) {
					if(secArguments[r].ARGUMENT_NAME.indexOf("_OPERATOR") > -1) {
						if(secArguments[r].ARGUMENT_VALUE == "AND") {
							$("#rw"+ name +"And").attr("checked","checked");
						}
						else {
							$("#rw"+ name +"Or").attr("checked","checked");
						}
					}
					else if(secArguments[r].ARGUMENT_NAME.indexOf(resultArg) > -1) {
						resultArray.push(secArguments[r]);
					}
				}
				if(resultArray.length > 0)
				{
					var text = "<div id='rwResult" + secType + resultCount + "' class = 'rwResultText'>";
					text += createResultString(resultArray, secType, resultCount);
					text += "</div>";
					$("#addedResults" + secType).append(text).find(".noResults").hide();
					resultCount++;
				}
				else {
					break;
				}
			}
			$section.trigger("updateSection");
		}
		function createResultString(resultArguments, type, resultCount) {
			var result = "<span id ='rwEventset" + resultCount + type + "'";
			var count = "<span id='rwCountInput" + resultCount + type + "'>";
			var countOption = "<span id ='rwCountOption" + resultCount + type + "'>";
			var val1 = "<span id='rwValInput1" + resultCount + type + "'>";
			var val2 = "<span id='rwValInput2" + resultCount + type + "'>";
			var valOption = "<span id ='rwValOption" + resultCount + type + "'>";
			var fromFlag = false;
			var toFlag = false;
			var ofAnyValue = true;
			var timeOption = "<span id='rwBackTimeOption" + resultCount + type + "'>";
			var time = "<span id='rwBackTimeInput" + resultCount + type + "'>";
			var eventSetGroupFound = false;
			for(var r = 0, length = resultArguments.length; r < length; r++)
			{
				var argName = resultArguments[r].ARGUMENT_NAME;
				var value = resultArguments[r].ARGUMENT_VALUE;
				var parentEntityName = resultArguments[r].PARENT_ENTITY_NAME;
				if (argName.indexOf("_EVENTSET") > -1) {
					if (parentEntityName.indexOf(i18n.rwl.GROUP) === -1) { //This is to check if it is a group
						result += "eventName = '" + value + "'>";
						result += value + "</span>";
					}
					else if (!eventSetGroupFound) { //we need to go through this code for first time so a counter is used.
						result += "eventName = '" + value + "'>";
						result += parentEntityName + "</span>"; //If it is a group add the group name.
						eventSetGroupFound = true;
					}
				}
				else if(argName.indexOf("_COUNTATLEAST") > -1) {
					count += value + "</span>";
					countOption += i18n.rwl.ATLEAST + "</span>";
				}
				else if(argName.indexOf("_COUNTLESS") > -1) {
					count += value + "</span>";
					countOption += i18n.rwl.LESSTHAN + "</span>";
				}
				else if(argName.indexOf("_VALLESS") > -1) {
					val1 += " " + value + " </span>";
					valOption += i18n.rwl.LESSTHANL + "</span>" + val1;
					ofAnyValue = false;
				}
				else if(argName.indexOf("_VALGREATER") > -1) {
					val1 += " " + value + " </span>";
					valOption += i18n.rwl.GREATERTHANL + "</span>" + val1;
					ofAnyValue = false;
				}
				else if(argName.indexOf("_VALFROM") > -1) {
					val1 += value + "</span>";
					fromFlag = true;
					ofAnyValue = false;
				}
				else if(argName.indexOf("_VALTO") > -1) {
					val2 += value + "</span>";
					toFlag = true;
					ofAnyValue = false;
				}
				else if(argName.indexOf("_VALEQUAL") > -1) {
					val1 += " " + value + " </span>";
					valOption += i18n.rwl.EQUALl + "</span>" + val1;
					ofAnyValue = false;
				}
				else if(argName.indexOf("_BACKDAYS") > -1) {
					time += value + "</span>";
					timeOption += i18n.rwl.DAYSL + "</span>";
				}
				else if(argName.indexOf("_BACKWEEKS") > -1) {
					time += value + "</span>";
					timeOption += i18n.rwl.WEEKSL + "</span>";
				}
				else if(argName.indexOf("_BACKMONTHS") > -1) {
					time += value + "</span>";
					timeOption += i18n.rwl.MONTHSL + "</span>";
				}
			}
			var resultString = "";
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
				valOption += i18n.rwl.OFANYVALUE + "</span>";
				resultString += " " + valOption;
			}
			else {
				resultString += " " + valOption.replace(".", i18n.rwl_lc.decimal_point);
			}
			resultString += " " + i18n.rwl.INTHELAST + " " + time + " " + timeOption;
			return resultString;
		}
		function updateSection() {
			var $section = $(this);
			if($("#section" + name).find(".errorImg").is(":visible") == true) {
				$("#summary" + name).hide().find(".summaryText").text("");
				$("#section" + name).find(".completeImg").hide();
				m_modifiedData[name] = [];
				m_searchDialog.enablePrevNextBtns();
				return;
			}
			var secArguments = [];
			var numResults = $("#addedResults" + name).find(".rwResultText").length;
			var text = "";
			var results;
			switch(name.toLowerCase()) {
				case "resultfilter1":
					results = 1;
					break;
				case "resultfilter2":
					results = 4;
					break;
				case "resultfilter3":
					results = 7;
					break;
				case "resultfilter4":
					results = 10;
					break;
				case "resultfilter5":
					results = 13;
					break;
			}

			if(numResults > 0)
			{
				for(var l = 0; l < numResults; l++)
				{
					secArguments.push({
						ARGUMENT_NAME: "RESULT" + results + "_GROUP",
						ARGUMENT_VALUE: name,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});

					var $result = $("#rwResult" + name + l);
					if(l === 0) {
						text += $result.text();
					}
					else {
						text += ", " + $result.text();
					}
					operator = "";
					if($("#rw" + name + "Or").attr("checked"))
					{
						operator = "OR";
					}
					else
					{
						operator = "AND";
					}
					secArguments.push({
						ARGUMENT_NAME: "RESULT" + results + "_OPERATOR",
						ARGUMENT_VALUE: operator,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});
					var $event = $("#rwEventset" + l + name);
					var resultString = $event.attr("eventName");
					var resultDisplay = $event.text();
					var $filterChoice = $("#rwResult" + name + l);
					if($filterChoice.hasClass("filterByGroup")){
						$event.data("resultGroupData", $filterChoice.data("resultTextFieldGroupData"));
						var groupData = $event.data("resultGroupData");
						for(var i = 0, groupDataLength = groupData.length; i < groupDataLength; i++){
							secArguments.push({
								ARGUMENT_NAME: "RESULT" + results + "_EVENTSET",
								ARGUMENT_VALUE: groupData[i].DISPLAY_NAME,
								PARENT_ENTITY_ID : 0.0,
								PARENT_ENTITY_NAME : resultDisplay
							});
						}
					}
					else{
						secArguments.push({
							ARGUMENT_NAME: "RESULT" + results + "_EVENTSET",
							ARGUMENT_VALUE: resultString,
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : resultDisplay
						});
					}
					value = $("#rwValOption" + l + name).text();
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
						secArguments.push({
							ARGUMENT_NAME: "RESULT" + results + "_VALFROM",
							ARGUMENT_VALUE: convertNumberInputToValue($("#rwValInput1" + l + name).text()),
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : ""
						});
						secArguments.push({
							ARGUMENT_NAME: "RESULT" + results + "_VALTO",
							ARGUMENT_VALUE: convertNumberInputToValue($("#rwValInput2" + l + name).text()),
							PARENT_ENTITY_ID : 0.0,
							PARENT_ENTITY_NAME : ""
						});
					}
					else if (argName !== '' && argName != i18n.rwl.OFANYVALUE) {
						var inputVal = $('#rwValInput1' + l + name).text();
						if (value == i18n.rwl.LESSTHANEQL && inputVal == '') {
							inputVal = $('#rwValInput2' + l + name).text();
						}
						secArguments.push({
							ARGUMENT_NAME: 'RESULT' + results + argName,
							ARGUMENT_VALUE: convertNumberInputToValue(inputVal),
							PARENT_ENTITY_ID: 0.0,
							PARENT_ENTITY_NAME: ''
						});
					}
					var input = $("#rwBackTimeInput" + l + name).text();
					var appendName = "";
					switch($("#rwBackTimeOption" + l + name).text())
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
					secArguments.push({
						ARGUMENT_NAME: "RESULT" + results + appendName,
						ARGUMENT_VALUE: input,
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});
					value = $("#rwCountOption" + l + name).text();
					switch(value) {
						case i18n.rwl.LESSTHAN:
							argName = "_COUNTLESS";
							break;
						case i18n.rwl.ATLEAST:
							argName = "_COUNTATLEAST";
							break;
					}
					secArguments.push({
						ARGUMENT_NAME: "RESULT" + results + argName,
						ARGUMENT_VALUE: $("#rwCountInput" + l + name).text(),
						PARENT_ENTITY_ID : 0.0,
						PARENT_ENTITY_NAME : ""
					});
					results++;
				}
				$("#summary" + name).show().find(".summaryText").text(text);
				$("#section" + name).find(".completeImg").show();
				if(numResults == 3)
				{
					$("#rwResultType" + name).attr("disabled","disabled");
				}
			}
			else
			{
				$("#summary" + name).hide().find(".summaryText").text("");
				$("#section" + name).find(".completeImg").hide();
			}
			m_modifiedData[name] = secArguments;
			m_searchDialog.enablePrevNextBtns();
		}
	}
	function truncateMultiSelectOptions(event){
		var $select = $(event.target),
			selWidth = $select.width();
		if(selWidth <= 0){
			return;
		}

		var $options = $select.children('option'),
			$hElem = $('<span/>')
				.css({visibility:'hidden'})
				.appendTo($('body'));

		for(var i=0,len=$options.length;i<len;i++){
			var curText = newText = $options.eq(i).prop('fulltext'),
				$hSel = $('<select><option>'+curText+'</option></select>').appendTo($hElem.empty());

			while($hSel.width() > selWidth){
				$hSel = $('<select><option>' + (newText = newText.slice(0,-1)) + '...</option></select>').appendTo($hElem.empty());
			}
			if(newText != curText){
				var curOpt = $options.eq(i).text(newText + "...").prop("truncated",true);
				curOpt.replaceWith(curOpt.clone());
			}
		}
		$hElem.remove();
	}

	function hideSearchMultiSelectTooltip(){
		$("#rwSearchDlgTooltip").text("").hide();
	}
	function showSearchMultiSelectTooltip(event){
		var $select = $(event.target),
			$options = $select.children('option'),
			selOffset = $select.offset(),
			selSize = $select.prop("size");

		if( (event.clientX - selOffset.left) > $select.prop("clientWidth") ){
			hideSearchMultiSelectTooltip();
			return;
		}

		var numScroll = // items scrolled past
				Math.floor(($options.length * $select.scrollTop()) / $select.prop("scrollHeight")),
			hoverIdx = // zero-based index of item hovering over - the 4 accounts for padding at top/bottom
				Math.floor((event.clientY - selOffset.top - 4 ) / ($select.prop("clientHeight")) * selSize);

		if(hoverIdx < 0 || hoverIdx >= selSize){
			hideSearchMultiSelectTooltip();
			return;
		}

		var $curOpt = $options.eq(hoverIdx + numScroll);
		if($curOpt.prop("truncated")!=true){
			hideSearchMultiSelectTooltip();
			return;
		}

		$("#rwSearchDlgTooltip")
			.text($curOpt.prop('fulltext'))
			.css({
				top: event.clientY - 14,
				left: event.clientX + 14
			})
			.show();
	}

	this.compareFromToRange = function(fromRange, toRange){
		var fromRangeValue = fromRange.val();
		var toRangeValue = toRange.val();
		var secName = fromRange.parents(".sectionContent").parent().attr("id");
		var $invalidEntry = fromRange.siblings(".invalidEntry");
		if(fromRangeValue && toRangeValue){
			if(parseFloat(fromRangeValue, 10) < parseFloat(toRangeValue, 10)){
				fromRange.removeClass("divInputError");
				$("#section" + secName).find(".errorImg").hide();
				$invalidEntry.hide();
			}
			else{
				fromRange.addClass("divInputError");
				$("#section" + secName).find(".errorImg").show();
				$invalidEntry.show();
			}
		}
	};
	this.medResultExists = function(div, value,idMedResultAdded,type) {
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
	function onResultChange(type) {
		var selected = $("#rwResultType" + type).val();
		if($("#" + type).find(".divInputError").filter(":visible").length === 0 && !(m_searchObj.medResultExists("addedResults" + type, selected, "rwEventset", type))) {
			$("#rwResultsAddBut" + type).removeAttr("disabled").removeClass("addButdisabled");
			$("#rwDivAdd" + type).find(".addImg").removeClass("addButdisabled").attr("src", staticContentPath + "/images/3941_16.png").parent().removeAttr("disabled");
		} else {
			$("#rwResultsAddBut" + type).attr("disabled", "disabled").addClass("addButdisabled");
			$("#rwDivAdd" + type).find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled", "disabled");
		}
		$("#" + type).find(".sectionContent").trigger("updateSection");
	}
	function onMedChange() {
		var selected = $("#rwMedSearchInput").val();
		if($("#rwSecSel_Meds").find(".divInputError").length === 0 &&!(m_searchObj.medResultExists("addedMeds", selected,"rwMedInput"))) {
			$("#rwMedsAddBut").removeAttr("disabled").removeClass("addButdisabled");
			$("#rwDivMedAdd").find(".addImg").removeClass("addButdisabled").attr("src", staticContentPath + "/images/3941_16.png").parent().removeAttr("disabled");
		}
		else {
			$("#rwMedsAddBut").attr("disabled", "disabled").addClass("addButdisabled");
			$("#rwDivMedAdd").find(".addImg").addClass("addButdisabled").attr("src", staticContentPath + "/images/3941_disabled_16.gif").parent().attr("disabled", "disabled");
		}
		$("#ORDERSTATUS").find(".sectionContent").trigger("updateSection");
	}
}
