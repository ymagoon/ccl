function ACM_ControllerStyle() {
	this.initByNamespace("con");
}
ACM_ControllerStyle.inherits(ComponentStyle);

function ACM_Controller(criterion, patientlists){
	var m_controller = this;
	var m_filter;
	var m_shareDialog;
	var m_customizeDialog;
	var m_genCommDialog;
	var m_search;
	var m_worklist;
	var m_patientController;
	var m_toolbar;
	var m_toolbarBtnWidths = [];
	var m_patientsSelected = [];
	var m_bedrockPrefs;
	var m_mousedownFunctions = [];
	var collapseBtnIsClicked = false;
	var GenCommSummaryDialog = DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog;
	var m_pvPatientFocusObj;
	var m_poiID =0;
	var m_pvFrameworkLinkObj;
	var toolbarHeight = 38; //the height of the toolbar and the default placement of the worklist
	var m_numDelta = 0;
	var m_batch = {
		PROVIDERRELTNS : 1,
		ENCOUNTERS : 1,
		HEALTHPLANS : 1,
		CONDITIONS : 1,
		RISKS : 1,
		IWORKITEMS: 1
	};
	var maxValues = {
		days: 546,
		weeks: 78,
		months: 18
	};
	var dropDownValues = {
		days: '0',
		weeks: '1',
		months: '2'
	};
	var m_risk_flag = 0; //0 if no risk values found, 1 if values found
	var m_caseStatusFlag = false; // false if no case status values found, true if values found
	this.staticContentPath = "";
	this.stripSplChars = /[^a-z0-9\s]/gi;
	this.stripBlankSpaces = /\s+/g;
	this.logObj = {
		refreshOverride : false
	};
	this.bIsGenerating = false;
	this.sortCriteria = {
					SORT_BY_NAME : 1,
					SORT_BY_RANK : 2,
					SORT_BY_QUALIFIED_DATE : 3,
					SORT_BY_LAST_ACTION: 4
			};
	this.logTimerObject = {
		"timers":[]
	};
	this.fuzzySearchValOnKeyUp = {
		before: "",
		after: ""
	};
	this.fuzzySearchValOnEnter = "";
	var m_fuzzySearchApplied = false;
	var m_retainFuzzySearch = false;
	var m_fuzzySearchText = "";
	var m_patientsToCompare = [];          // Holds the list of all the patients(after/before applying filters) on top of which the fuzzy search will be applied.
	this.m_currentlyDisplayedPatients = []; // Holds the list of patients who are currently displayed on the basis of filters or the fuzzy search.
	this.appliedFilters = false;
	var m_columnLoadBatchSize;
	this.replyFromFilterValues;
	var m_creatingList = false;
	this.delayDuration = 750;
	this.firstBatch = 75;
	this.availableFilters = [ // These filters must always be shown in search dialog box.
		'ACMPRSNLGROUPS',
		'SINGLEPROVIDER',
		'AUTOREMOVEPATIENTS',
		'PPRCODES',
		'EPRCODES'
	];
	this.imagePaths = {};
	var deferredObj = $.Deferred();
	this.oPromise = deferredObj.promise();
	var scriptBoundToCpmScriptRegex = /^(mp_dcp_get_pl_wrapper|mp_dcp_get_patient_delta|mp_dcp_dwl_get_best_encntr|dcp_acm_retrieve_filter_values)$/;
	m_controller.locations = null;
	$(document)
		.on('mouseup', 'input[type=text]', function() {	// Call the "clear" event if a text input "X" buton was clicked.
			var $textInput = $(this);
			var beforeValue = $textInput.val();
			if(beforeValue === '') {
				return false;
			}
			setTimeout(function() {
				var afterValue = $textInput.val();
				if(afterValue === '') {
					$textInput.trigger('clear');
				}
			}, 0);
		})
		.on('clear', 'input[type=text]', function() {	// A text box was cleared by clicking the "X".
			$(this).trigger('keyup');
		});
	function onPendingDataChange(event, dataName, dataValue) {
		if(DWL_Utils.isNullOrUndefined(dataName) === true) {
			return;
		}

		if(DWL_Utils.isNullOrUndefined(dataValue) === false) {
			m_controller.$pendingData.data(dataName, dataValue);
		} else {
			m_controller.$pendingData.removeData(dataName);
		}

		oPvFrameworkLink.SetPendingData(m_controller.isPendingData());
	}
	m_controller.$pendingData = $('<div></div>').on('change', onPendingDataChange);
	m_controller.getPendingData = function() {
		function isPending(curData) {
			return !!curData === true;
		}
		function getSinglePendingData(val, key) {
			if(isPending(val) === false) {
				return;
			}

			var data = {};

			data[key] = val;

			return data;
		}

		return $.map(m_controller.$pendingData.data(), getSinglePendingData);
	};
	m_controller.addDynamicFilterToolTip = function(spanAncestor) {
		$(spanAncestor).each(function() {
			var $filterSpan = $(this).find('.conditionSpan:first');
			if($filterSpan.length > 0 && DWL_Utils.fnIsTextOverflowed($filterSpan.get(0)) === true) {
				$filterSpan
				.addClass('hasTooltip')
					.tooltip({content: escapeHtmlString($filterSpan.text()),
								items: $filterSpan,
								show: false,
								hide: false,
								tooltipClass: 'dynamicFilterTooltip'});
			}
			else if($filterSpan.hasClass('hasTooltip') === true) {
				$filterSpan.removeClass('hasTooltip').tooltip('destroy');
			}
		});
	};
	m_controller.removeDynamicFilterToolTip = function(spanAncestor) {
		$(spanAncestor).each(function(){
			var $filterSpan = $(this).find('.conditionSpan:first');
			if($filterSpan.hasClass('hasTooltip') === true) {
				$filterSpan.removeClass('hasTooltip').tooltip('destroy');
			}
		});
	};
	m_controller.isPendingData = function() {
		return m_controller.getPendingData().length > 0;
	};
	this.isValidRangeInput = function(inputVal, timeUnit) {
		return 	((inputVal <= maxValues.days && inputVal >= 0 && timeUnit === dropDownValues.days) ||
				(inputVal <= maxValues.weeks && inputVal >= 0 && timeUnit === dropDownValues.weeks) ||
				(inputVal <= maxValues.months && inputVal >= 0 && timeUnit === dropDownValues.months));
	};
	this.isAppointmentInputValid = function(apptFromDate, apptToDate, apptDropVal) {
		var isValid = true;
		if (apptFromDate === '' || apptToDate === '') {
			isValid = false;
		}
		else if(apptDropVal !== dropDownValues.days && parseInt(apptFromDate, 10) === 0 && parseInt(apptToDate, 10) === 0) {
			isValid = false;
		}
		else if (this.isValidRangeInput(apptFromDate, apptDropVal) === false || this.isValidRangeInput(apptToDate, apptDropVal) === false) {
			isValid = false;
		}

		return isValid;
	};

	this.getRiskFlag = function() {
		return m_risk_flag;
	};
	this.setRiskFlag = function(flag) {
		m_risk_flag = flag;
	};
	this.getMaraFlag = function() {
		return m_controller.getBedrockPrefs().HEALTHE_INTENT.MARA_SCORE_FLAG || 0;
	};
	this.getCaseStatusFlag = function() {
		return m_caseStatusFlag;
	};
	this.setCaseStatusFlag = function(flag) {
		m_caseStatusFlag = !!flag;
	};
	this.setCreatingList = function(creating) {
		m_creatingList = creating;
	};
	this.currentlyDisplayedPatients = function() {
		return m_patientsToCompare;
	};

	this.resetPatientData = function() {
		m_patientsToCompare = [];
		m_controller.m_currentlyDisplayedPatients = [];
		m_patientController.patientDataById = [];
	};
	this.logErrorMessages = function(program,errorDetails,functionName) {
		var curDate = new Date();
		var message = "<b>DATE:</b> " + curDate + " <br /><b>FAILURE ON PROGRAM:</b> " + program + "<br /><b>ERROR DETAILS:</b> " + errorDetails + " <b>Function Name:</b> " + functionName;
		log.error(message);
	};
	this.fnLogWarningMessages = function(sProgram, sErrorDetails, sFunctionName) {
		var oCurDate = new Date();
		var sMessage = '<b>DATE:</b> ' + oCurDate +
			'<br /><b>FAILURE ON PROGRAM:</b> ' + sProgram +
			'<br /><b>ERROR DETAILS:</b> ' + sErrorDetails +
			'<b>Function Name:</b> ' + sFunctionName;
		log.warn(sMessage);
	};
	this.logTimerMessages = function(timerName,totalTime) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + " <br /><b>TIMER NAME:</b> " + timerName + "<br /><b>TOTAL TIME:</b> " + totalTime + "</p>";
		log.profile(message);
	};
	this.logRequests = function(program,requestDetails) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REQUEST:</b> " + JSON.stringify(requestDetails).toString() + "</p>";
		log.info(message);
	};
	this.logReplies = function(program,reply) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REPLY:</b> " + JSON.stringify(reply).toString() + "</p>";
		log.debug(message);
	};
	this.logPatInfo = function(patObj, patID) {
		var curDate = new Date();
		var dob = patObj.BIRTH_DT_TM;
		var sex = patObj.SEX_DISP;
		var patName = patObj.NAME_FULL_FORMATTED;
		var patMRN = patObj.MRN;
		var message = "<p class='centerText'><b>DATE:</b>" + curDate + "<br /><b>PATIENT NAME:</b>" + patName + "<br />";
		message += "<b>DOB:</b>" + dob + "<br />";
		message += "<b>SEX:</b>" + sex + "<br />";
		message += "<b>MRN:</b>" + patMRN + "<br />";
		message += "<b>PATIENT ID:</b>" + patID + "<br /></p>";
		log.warn(message);
	};
	this.debounce = function(dbFn, delay) {
		var timeOut;
		return function() {
			var dbThis = this,
				args  = arguments;  // Gets the arguments of the passed in function.
			clearTimeout(timeOut);
			timeOut = setTimeout(function() {
				timeOut = null;
				dbFn.apply(dbThis, args);    // Calls the function.
			}, delay);
		};
	};

	this.resetBatchCount = function() {
		m_batch.PROVIDERRELTNS = 1;
		m_batch.ENCOUNTERS = 1;
		m_batch.HEALTHPLANS = 1;
		m_batch.CONDITIONS = 1;
		m_batch.RISKS = 1;
		m_batch.IWORKITEMS = 1;
	};

	this.setData = function(criterion, patientlists){
		this.setCriterion(criterion);
		this.setStyles(new ACM_ControllerStyle());
		this.criterion = criterion;
		this.patientlists = patientlists;
		this.setAlwaysExpanded(true);
		m_controller.staticContentPath = this.criterion.CRITERION.STATIC_CONTENT;

		m_controller.imagePaths = {
			close: m_controller.staticContentPath + '/images/6241_16.png',
			genCommToolbarBtn: m_controller.staticContentPath + '/images/5702_32x32.gif'
		};
	};
	this.getCriterion = function(){
		return this.criterion;
	};
	this.getCurrentColData = function() {
		return m_worklist.getCurrentColData();
	};
	this.getColDefaults = function() {
		return m_worklist.getColDefaults();
	};

	this.setCurrentColData = function(newColDataObj) {
		m_worklist.setCurrentColData(newColDataObj);
	};

	this.redrawPatientList = function(worklistItems, sortBy) {
		m_worklist.redrawPatientList(worklistItems, sortBy);
	};

	this.markPatientsAsRemovable = function() {
		m_worklist.markPatientsAsRemovable(m_patientController.getRemovablePatients());
	};
	this.lastActionCellUpdate = function (personId, eventAction) {
		m_worklist.updateLastCompActionCell(personId, eventAction);
	};
	this.updateColumnPrefs = function(newColDataObj, bRedraw, callingFunction) {
		if(m_controller.getActiveList().OWNER_ID == m_controller.getCriterion().CRITERION.PRSNL_ID) {
			m_filter.updateColumnPrefs(newColDataObj, bRedraw, callingFunction);
		}
	};

	this.updateCurrentList = function(listID, newArguments) {
		m_filter.updateCurrentList(listID, newArguments);
	};
	this.getPatientById =  function(patientId){
		return m_patientController.getPatientById(patientId);
	};
	this.getAllPatients = function() {
		return m_patientController.getAllPatients();
	};
	this.getStaticPatientListSize = function(){
		return m_patientController.getStaticPatientListSize();
	};
	this.getPatientLists = function(){
		return this.patientlists;
	};
	this.getActivePatientListID = function(){
		return m_filter.m_selectedPatientListID;
	};
	this.getActiveList = function(){
		return m_filter.getActiveList();
	};
	this.getInaccessibleList = function() {
		return m_filter.getInaccessibleList();
	};
	this.setInaccessibleList = function(listID){
		m_filter.setInaccessibleList(listID);
	};
	this.getSavedList = function(){
		return m_filter.m_savedLists;
	};
	this.getFilterChecks = function(){
		return m_filter.getFilterChecks();
	};
	this.expandViewPatientCellScroll = function(paramArr){
		m_worklist.addPatientsOnNext(paramArr[0],paramArr[1]);
		m_worklist.refreshExpandView(paramArr[0],paramArr[1]);
	};
	this.removeSavedList =function(listID){
		m_filter.removeSavedList(listID);
	};
	this.setLoadingState = function(status){
		m_worklist.setLoadingState(status);
	};
	this.disableExpandViewButton= function(expandViewObj,buttonName){
		expandViewObj.enableButton(buttonName);
	};
	this.expandView = function(show,person,reltn) {
		m_worklist.expandViewWrapper(show,person,reltn);
	};
	this.disableOnExpandView = function(expandViewOpen){
		if(expandViewOpen){
			setTimeout(function(){
				m_filter.resetFilters();
			},2000);

			m_toolbar.enableButton("addPatient", false);
			m_toolbar.enableButton("listActions", false);
			m_toolbar.enableButton("removePatient", false);
		}
		else{
			m_toolbar.enableButton("addPatient", true);
			m_toolbar.enableButton("listActions", true);
		}
	};
	this.toggleAddPatient = function() {
		if (DWL_Utils.isNullOrUndefined(m_toolbar) === false) {
			m_toolbar.enableButton('addPatient', (m_filter.listAutoRemove) ? false : true);
		}
	};
	this.enableGenCommButton = function(bEnable) {
		if(DWL_Utils.isNullOrUndefined(m_toolbar) === false) {
			m_toolbar.enableButton('genComm', bEnable);
		}
	};
	this.toggleExportPatientSummary = function (bDisable) {
	    if (DWL_Utils.isNullOrUndefined(m_toolbar) === false) {
	        $('#trExportPatientSummary').toggleClass('disabledTableRow', bDisable);
	    }
	};
	this.getPrivilegeValue = function (sPrivilegeName) {
	    var privilegeValue = 0;
	    for (var i = 0, privCount = m_controller.criterion.CRITERION.PRIVILEGES.length; i < privCount; i++) {
	        if (m_controller.criterion.CRITERION.PRIVILEGES[i].NAME === sPrivilegeName) {
	            privilegeValue = m_controller.criterion.CRITERION.PRIVILEGES[i].VALUE;
	            break;
	        }
	    }
	    return privilegeValue;
	};

	this.updateProxies = function(newProxies) {
		this.getActiveList().PROXIES = newProxies;
	};

	this.getProxies = function(listId) {
		var lists = this.getSavedList();
		var person_id = this.criterion.CRITERION.PRSNL_ID;
		var proxies = {};
		for(var l = 0, lsize = lists.length; l < lsize; l++) {
			var list = lists[l];
			if(list.PATIENT_LIST_ID == listId) {
				proxies = list.PROXIES;
				break;
			}
		}
		return proxies;
	};

	this.getBedrockPrefs = function()
	{
		return m_bedrockPrefs;
	};

	this.addStaticList = function(listID,listName,listArguments,bShowList){
		m_filter.addStaticList(listID,listName,listArguments,bShowList);
	};

	this.getPOI = function(){
		return m_poiID;
	};
	this.clearPOI = function(){
		if(typeof m_pvPatientFocusObj !== 'undefined' && typeof m_pvPatientFocusObj.ClearPatientFocus !== 'undefined'){
			m_pvPatientFocusObj.ClearPatientFocus();
		}
	};
	this.setPOI = function(patientID){
		if(typeof m_pvPatientFocusObj !== 'undefined' && typeof m_pvPatientFocusObj.SetPatientFocus !== 'undefined'){
			var patientName = this.getPatientById(patientID).NAME_FULL_FORMATTED;
			m_pvPatientFocusObj.SetPatientFocus(patientID,0,patientName);
			m_poiID = patientID;
		}
	};
	this.getDisqualifyingText = function(personId, $disqualifyDiv) {
		var patientId = m_patientController.getPatientById(personId),
			patientDisqualify = (patientId !== undefined) ? patientId.disqualify : [],
			patientDisqualifyLength = patientDisqualify.length,
			text = '<div><div id="disqualifyContent">',
			m_sections = m_filter.m_sections,
			argLimit = 4, //we don't want to show more than 4 disqualifying arguments
			disqualifyingArgs = patientDisqualify.slice(0, argLimit), // get the first 4 disqualifying arguments
			argument,
			title,
			mArg;

		for(var p = 0, len = disqualifyingArgs.length; p < len; p++) {
			argument = disqualifyingArgs[p].DISQUALIFY_ARGUMENT;
			for(var m = 0, mlen = m_sections.length; m < mlen; m++) {
				mArg = m_sections[m].argument_name;
				if (mArg === argument ||
					argument.toLowerCase() === m_sections[m].type.toLowerCase() ||
					(argument === 'MEDICATIONS' && mArg === 'ORDERSTATUS')) {
					title = m_sections[m].title;
					break;
				}
			}
			if(argument === 'ENCOUNTER') {
				title = i18n.rwl.S_ENCOUNTER_L;
			}
			text += '<div class="disqualifyingArg">' + i18n.rwl.DISQUALIFYTEXT.replace('{43}', title.toLowerCase()) + '</div>';
		}

		text += '</div>'; // close inner div
		if(patientDisqualifyLength > argLimit) {
			text += '<div id="disqualifyMore" class="moreInModify">' + i18n.rwl.MOREINMODIFY + '</div>';
		}

		text += '</div>'; // close outer div

		if(patientDisqualifyLength !== 0) {
			$disqualifyDiv.append(text).appendTo('#wklBodyDiv');
		}
	};

	this.audit = function(eventName,eventType){
		try{
			m_pvFrameworkLinkObj.Audit(eventName,eventType);
		}
		catch (err) {
			m_controller.logErrorMessages("",JSON.stringify(err),"AUDIT");
		}
	};

	this.createCheckpoint = function(eventName, subeventName, metadata) {
		var m_checkpoint = window.external.DiscernObjectFactory("CHECKPOINT");
		m_checkpoint.EventName = eventName;
		m_checkpoint.SubeventName = subeventName;
		metadata = metadata || [];
		for(var m = 0, len = metadata.length; m < len; m++) {
			var data = metadata[m];
			m_checkpoint.Metadata(data.key) = data.value;
		}
		m_checkpoint.Publish();
		m_controller.handleConsoleTimers(eventName, subeventName, metadata);
	};
	this.fnLogCapabilityTimer = function(sTimerName) {
		if(typeof sTimerName !== 'string' || sTimerName.length <= 0) {
			return;
		}
		m_controller.createCheckpoint(sTimerName, 'Start');
		m_controller.createCheckpoint(sTimerName, 'Stop');
	};
	this.handleConsoleTimers = function(eventName, subeventName, metadata) {
		var curTime = (new Date()).getTime();
		for(var i = 0; i < this.logTimerObject.timers.length; i++) {
			if(eventName == this.logTimerObject.timers[i].timerName) {
				var timerStartTime = this.logTimerObject.timers[i].timerVal;
				var elapsedTime = curTime - timerStartTime;
				this.logTimerObject.timers.splice(i,1);
				this.logTimerMessages(eventName,elapsedTime);
			}
		}
		if(subeventName == "Start") {
			this.logTimerObject.timers.push({"timerName":eventName,"timerVal":curTime});
		}
	};
	this.getLocationHeirarchy = function(unitCd) {
		return m_search.getLocationHeirarchy(unitCd);
	};
	this.buildLocationHierarchy = function(hierarchies) {
		return m_search.buildLocationHierarchy(hierarchies);
	};

	function convertHtmlEntitiesIntoEquivalents(message) {
		return ($("<textarea/>").html(message).text());
	}
	function messageExists(message) {
		var found = false;
		$("#wklMessageBanner").find(".singleMessageDiv").each(function() {
			var curMessage = $(this).text();
			if(curMessage.localeCompare(convertHtmlEntitiesIntoEquivalents(message)) === 0) {
				found = true;
				return false;
			}
		});
		return found;
	}
	function fnAddGenCommMessage(sMessage, sImage) {
		var S_IMAGES_DIRECTORY = m_controller.staticContentPath + '/images/',
			S_TYPE = 'genComm',
			S_IMG_PATH = S_IMAGES_DIRECTORY + sImage,
			S_DISMISS = 'man',
			S_CLASSIFIER = 'gencomm',
			$messageDiv = m_controller.addDisplayMessage(S_TYPE, sMessage, S_CLASSIFIER, S_IMG_PATH, S_DISMISS);
		if ($messageDiv !== null) {
			$('#genCommMessage')
				.append($messageDiv.addClass('genCommMessageText'))
				.show();
		}
		return $messageDiv;
	}
	this.fnAddGenCommWarningMessage = function(sMessage) {
		var S_WARNING_IMAGE = 'warning_#4017.png',
			$messageDiv = fnAddGenCommMessage(sMessage, S_WARNING_IMAGE);
		if ($messageDiv !== null) {
			$messageDiv
				.parent('#genCommMessage')
				.attr('class', 'warnMessageContainer');
		}
		return $messageDiv;
	};
	this.fnAddGenCommInfoMessage = function(sMessage) {
		var S_GREEN_CHECKMARK_IMAGE = '4021_16.png',
			$messageDiv = fnAddGenCommMessage(sMessage, S_GREEN_CHECKMARK_IMAGE);
		if ($messageDiv !== null) {
			$messageDiv
				.parent('#genCommMessage')
				.attr('class', 'infoMessageContainer');
		}
		return $messageDiv;
	};
	this.fnAddGenCommErrorMessage = function(sMessage) {
		var S_IMAGES_DIRECTORY = m_controller.staticContentPath + '/images/',
			S_RED_X_IMAGE = '6275_16.png',
			S_TYPE = 'err',
			S_CLASSIFIER = 'gencomm',
			S_IMG_PATH = S_IMAGES_DIRECTORY + S_RED_X_IMAGE,
			S_DISMISS = 'man',
			$messageDiv = m_controller.addDisplayMessage(S_TYPE, sMessage, S_CLASSIFIER, S_IMG_PATH, S_DISMISS);
		return $messageDiv;
	};
	this.addDisplayMessage = function(type, message, classifier, imgPath, dismiss) {
		if (messageExists(message) ===  true) { return null; }
		var $banner = $('#wklMessageBanner'),
			$wklOuterDiv = $('#wklOuterDiv');
		$banner.show();
		var $messageSpan = $('<span>' + message + '</span>'),
			$messageDiv = $('<div class="singleMessageDiv ' + classifier + ' ' + dismiss + '">')
				.append('<img src="' + imgPath + '"/>')
				.append($messageSpan);
		if (type == 'err') {
			$messageDiv.appendTo($('#wklErrMessageDiv').show());
		} else if (type == 'info') {
			$messageDiv.appendTo($('#wklInfoMessageDiv').show());
		}
		if (classifier === 'bedrockprefs') { // If Bedrock script Fails DWL doesn't get loaded and we need to display error message at top
			$banner.css('position', 'absolute')
				.css('top', '0px')
				.css('left', '0px');
		}
		setTimeout(function() {
			var height = $banner.outerHeight() + toolbarHeight;
			$wklOuterDiv.css('top', height);
		}, 100);
		showDismiss();
		var $notifyHover = $('#notifyTooltip');
		if ($notifyHover.length === 0) { // Only add the tooltip to the DOM once.
			$wklOuterDiv.append('<div class="notifyMessageHover" id="notifyTooltip"></div>');
		}
		$messageSpan.hover(
			function(event) { // Display a tooltip if text in the notification area is truncated.
			    var $notifyHover = $('#notifyTooltip');
				var maxWidth = parseInt($notifyHover.css('max-width')),
					padding = parseInt($notifyHover.css('padding')),
					siblingsWidth = 0,
					x = event.offsetX,
					y = event.offsetY;
				$messageSpan.siblings().each(function() {
					siblingsWidth += $(this).outerWidth();
				});
				if (DWL_Utils.fnIsTextOverflowed($messageSpan.get(0)) === true) { // Text is overflowing.
					if (x + maxWidth + padding >= $wklOuterDiv.width()) { // Hovering near the right edge of the screen.
						x -= (maxWidth + padding); // Shift the tooltip to the left.
					}
					$notifyHover.text($messageSpan.text()).css('left', x).css('top', y).show();
				}
			},
			function() {
				var $notifyHover = $('#notifyTooltip');
				$notifyHover.hide();
			}
		);
		return $messageDiv;
	};
	function showDismiss() {
		var $info = $("#wklInfoMessageDiv");
		var auto_count = $info.find(".auto").length;
		var man_count = $info.find(".man").length;
		if(auto_count > 0 && man_count == 0) {
			$info.find(".wklMessageDismissAction").find("span").hide();
		}
		else {
			$info.find(".wklMessageDismissAction").find("span").show();
		}
	}
	this.clearSpecificMessages = function(messages) {
		var $banner = $("#wklMessageBanner");
		var $info = $("#wklInfoMessageDiv");
		var $error = $("#wklErrMessageDiv");
		$banner.find(messages).remove();

		if($banner.find(".singleMessageDiv").length == 0) {
			$error.hide();
			$info.hide();
			$("#wklOuterDiv").css("top", toolbarHeight);
			$banner.hide();
			$('#wklExpandedView').height('100%'); // Set the height of the patient expanded view to resize after the banner is hidden.
		}
		else {
			if($error.find(".singleMessageDiv").length == 0) {
				$error.hide();
			}
			if($info.find(".singleMessageDiv").length == 0) {
				$info.hide();
			}
			var height = $banner.outerHeight() + toolbarHeight;
			$("#wklOuterDiv").css("top", height);
		}
	};

	this.initialize = function(){
		m_pvPatientFocusObj = window.external.DiscernObjectFactory("PVPATIENTFOCUS");
		m_pvFrameworkLinkObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
		m_controller.audit("Dynamic Worklist", "Launch Dynamic Worklist");
		var fnGenerateDismissLink = function() {
				return $('<div></div>', {
					addClass: 'wklMessageDismissAction wklMessageBannerAction',
					append: $('<span></span>', {
						text: i18n.rwl.DISMISS
					})
				});
			},
			fnGenerateViewSummaryButton = function() {
				return $('<div></div>', {
					addClass: 'genCommMessageViewSummaryAction wklMessageBannerAction',
					append: $('<button></button>', {
						text: i18n.genComm.S_VIEW_SUMMARY,
						type: 'button'
					})
				});
			},
			oGenCommSummaryDialog = null,
			fnViewSummaryClickHandler = function() {
				var $genCommDismissAction = $(this).siblings('.wklMessageDismissAction'),
					oGenCommState = m_genCommDialog.fnGetState(),
					iListId = oGenCommState.iListId,
					bIsGenCommLetterPrintingInError = fnIsGenCommLetterPrintingInError(oGenCommState.oGenCommBuckets.aoLetters.length, oGenCommState.iLettersSentToPrinter);
				if(DWL_Utils.isNullOrUndefined(oGenCommSummaryDialog) === false) {
					$(oGenCommSummaryDialog.oEl).show();
					return;
				}
				oGenCommSummaryDialog = (bIsGenCommLetterPrintingInError === true ? fnRenderNewGenCommNotifyingSummaryDialog(oGenCommState) : fnRenderNewGenCommSummaryDialog(oGenCommState))
					.fnAfterAction(function(oState) {
						var S_PENDING_WORK_FILTER_NAME = 'pendingWork';
						m_controller.handleConsoleTimers('GenCommSummaryDialogViewListAction', 'Start', {bIsFilterByPendingPhoneCalls: oState.bIsFilterByPendingPhoneCalls});
						m_controller.clearSpecificMessages('.gencomm');
						$(oGenCommSummaryDialog.oEl).remove();
						$genCommDismissAction.click();
						m_filter.setActiveList(iListId);
						m_controller.enableGenCommButton(true);
						if (oState.bIsFilterByPendingPhoneCalls === true) {
							$('#' + S_PENDING_WORK_FILTER_NAME + 'Table')
								.find('input[value=PENDING_PHONE_CALLS]')
								.prop('checked', true);
							m_filter.collapseSelectFilterSection(S_PENDING_WORK_FILTER_NAME);
							m_filter.showSelectedFilterValues(S_PENDING_WORK_FILTER_NAME);
							$('#' + S_PENDING_WORK_FILTER_NAME + 'Selected').show();
							m_filter.fnOnClickApplyFilterButton();
						}
						oGenCommSummaryDialog = null;
						m_controller.handleConsoleTimers('GenCommSummaryDialogViewListAction', 'Stop');
					})
					.fnAfterCancel(function() {
						$(oGenCommSummaryDialog.oEl).remove();
						oGenCommSummaryDialog = null;
					});
			},
			fnRenderNewGenCommSummaryDialog = function(oGenCommState) {
				var oGenCommSummaryDialogProps = fnCreateGenCommSummaryDialogProps('summaryDialog', oGenCommState),
					oGenCommSummaryDialog = new GenCommSummaryDialog(oGenCommSummaryDialogProps).fnRender();
				$('body').append(oGenCommSummaryDialog.oEl);
				return oGenCommSummaryDialog;
			},
			fnRenderNewGenCommNotifyingSummaryDialog = function(oGenCommState) {
				var oGenCommSummaryDialogProps = fnCreateGenCommSummaryDialogProps('summaryDialog withNotification', oGenCommState),
					oNotifyingGenCommSummaryDialogProps = $.extend(oGenCommSummaryDialogProps, {
						sNotificationMessage: i18n.genComm.S_GEN_COMM_PRINT_ERROR.replace('{0}', (oGenCommState.oGenCommBuckets.aoLetters || []).length)
					}),
					oGenCommSummaryDialog = new GenCommSummaryDialog(oNotifyingGenCommSummaryDialogProps).fnRender();
				$('body').append(oGenCommSummaryDialog.oEl);
				oGenCommSummaryDialog.fnTooltipifyNotificationMessage();
				return oGenCommSummaryDialog;
			},
			fnCreateGenCommSummaryDialogProps = function(sClasses, oGenCommState) {
				var oGenCommBuckets = oGenCommState.oGenCommBuckets,
					sSubjectText = oGenCommState.sSubjectText,
					sListName = oGenCommState.sListName,
					iLettersSentToPrinter = oGenCommState.iLettersSentToPrinter;
				return {
					oEl: $('<div></div>', {
						addClass: sClasses
					}),
					sSubHeaderText: i18n.genComm.S_GENERATE_COMMUNCATION_CONTEXT
						.replace('{0}', sSubjectText)
						.replace('{1}', sListName),
					aoProcessSummaries: [
						fnCreatePendingCallsProcessSummaryProps(oGenCommBuckets.aoPhoneCalls.length),
						fnCreateSentMessagesProcessSummaryProps(oGenCommBuckets.aoMessages.length, oGenCommState.bMessagesSent),
						fnCreatePrintedLettersProcessSummaryProps(oGenCommBuckets.aoLetters.length, iLettersSentToPrinter)
					]
				};
			},
			fnCreatePendingCallsProcessSummaryProps = function(iNumPendingCalls) {
				var oProps = {
					iTotal: iNumPendingCalls,
					sText: i18n.genComm.PENDINGCALLS,
					oCssClasses: fnGetDefaultProcessSummaryCssClasses(),
					bIsDitherable: false
				};
				oProps.oCssClasses.sImage += ' pendingCall';
				return oProps;
			},
			fnCreateSentMessagesProcessSummaryProps = function(iNumSentMessages, bSentMessages) {
				var oProps = {
					iTotal: iNumSentMessages,
					sText: i18n.genComm.S_MESSAGES_SENT,
					oCssClasses: fnGetDefaultProcessSummaryCssClasses(),
					bIsDitherable: true
				};
				if(bSentMessages === true){
					oProps.oCssClasses.sEl += ' middle';
					oProps.oCssClasses.sImage += ' completed';
				}
				else {
					oProps.oCssClasses.sEl += ' middle';
					oProps.oCssClasses.sTotal += ' noPortal';
					oProps.oCssClasses.sImage += ' portalError';
				}
				return oProps;
			},
			fnCreatePrintedLettersProcessSummaryProps = function(iNumLettersToPrint, iNumLettersSentToPrinter) {
				var oProps = {
					iTotal: iNumLettersSentToPrinter,
					sText: i18n.genComm.S_LETTERS_PRINTED,
					oCssClasses: fnGetDefaultProcessSummaryCssClasses(),
					bIsDitherable: true
				};
				if (fnIsGenCommLetterPrintingInError(iNumLettersToPrint, iNumLettersSentToPrinter) === true) {
					oProps.oCssClasses.sTotal += ' noLetters';
					oProps.oCssClasses.sImage += ' printerError';
				} else {
					oProps.oCssClasses.sImage += ' completed';
				}
				return oProps;
			},
			fnIsGenCommLetterPrintingInError = function(iNumLettersToPrint, iNumLettersSentToPrinter) {
				return iNumLettersToPrint > 0 && iNumLettersSentToPrinter === 0;
			},
			fnGetDefaultProcessSummaryCssClasses = function() {
				return {
					sEl: 'singleProcessSummary',
					sImage: 'summaryImage',
					sText: 'singleProcessSummaryText',
					sTotal: 'singleProcessSummaryTotal'
				};
			},
			fnIsGenCommErrorMessageVisible = function() {
				return $wklErrMessageDiv.children('.gencomm').is(':visible');
			},
			fnIsGenCommInfoMessageVisible = function() {
				return $genCommMessageBanner.hasClass('infoMessageContainer') &&
					$genCommMessageBanner.is(':visible');
			},
			fnIsGenCommWarningMessageVisible = function() {
				return $genCommMessageBanner.hasClass('warnMessageContainer') &&
					$genCommMessageBanner.is(':visible');
			},
			fnGenerateCommunicationDismissActionClickHandler = function() {
				if (fnIsGenCommErrorMessageVisible() === true) {
					return;
				}
				m_controller.enableGenCommButton(true);
			},
			fnDismissActionClickHandler = function() {
				var	$dismissButton = $(this),
					fnUpdateGenCommButtonState = function() {
						if (fnIsGenCommInfoMessageVisible() === false && fnIsGenCommWarningMessageVisible() === false) {
							m_controller.enableGenCommButton(true);
						}
						return $.Deferred().resolve().promise();
					},
					fnRemoveBannerMessage = function() {
						var iBannerHeight = null,
							iNewOuterDivHeight = null,
							$wklMessageBanner = $dismissButton.parents('#wklMessageBanner'),
							$bannerToDismiss = $dismissButton.parent(),
							abOtherVisibleBanners = $.grep($bannerToDismiss.siblings(), function(oOtherBanner) {
								return $(oOtherBanner).is(':visible');
							}),
							bAreAllOtherBannersHidden = abOtherVisibleBanners.length === 0;
						$dismissButton.siblings('.singleMessageDiv').remove();
						if (bAreAllOtherBannersHidden === true) {
							$('#wklOuterDiv').css('top', toolbarHeight);
							$wklMessageBanner.hide();
							$bannerToDismiss.hide();
							$('#wklExpandedView').height($('#filterShell').height());
						} else {
							$bannerToDismiss.hide();
							iBannerHeight = $wklMessageBanner.outerHeight();
							iNewOuterDivHeight = iBannerHeight + toolbarHeight;
							$('#wklOuterDiv').css('top', iNewOuterDivHeight);
							$('#wklExpandedView').height($('#filterShell').height() - iBannerHeight);
						}
					};

				fnUpdateGenCommButtonState().then(fnRemoveBannerMessage);
			},
			$wklErrMessageDiv = $('<div id="wklErrMessageDiv"></div>'),
			$wklInfoMessageDiv = $('<div id="wklInfoMessageDiv" class="infoMessageContainer"></div>'),
			$genCommMessageBanner = $('<div id="genCommMessage" class="infoMessageContainer"></div>'),
			$m_errDisplayDiv = $('<div id="wklMessageBanner"></div>')
				.on('click', '.wklMessageDismissAction', fnDismissActionClickHandler)
				.on('click', '.genCommMessageViewSummaryAction', fnViewSummaryClickHandler)
				.on('click', '#genCommMessage .wklMessageDismissAction', fnGenerateCommunicationDismissActionClickHandler)
				.append($wklErrMessageDiv.append(fnGenerateDismissLink),
						$wklInfoMessageDiv.append(fnGenerateDismissLink),
						$genCommMessageBanner.append(fnGenerateDismissLink(), fnGenerateViewSummaryButton()))
				.appendTo($('body')),
			request = {'pref_req':{'pos_cd':m_controller.criterion.CRITERION.POSITION_CD}};
		m_bedrockPrefs = this.makeCall('mp_dcp_rwl_bedrock_prefs',request,false);

		$bodySpinner = $('<div id="bodySpinner" class="bodySpinner"></div>').appendTo($('body'));
		if(Array.isArray(m_bedrockPrefs.CUSTOMIZE_FILTERS) === false) {
			m_bedrockPrefs.CUSTOMIZE_FILTERS = [];
		}
		for(var i = 0, filterLen = m_bedrockPrefs.CUSTOMIZE_FILTERS.length; i < filterLen; i++) {
			m_controller.availableFilters.push(m_bedrockPrefs.CUSTOMIZE_FILTERS[i].FILTER);
		}

		m_filter = new ACM_Filter(this.criterion,this);
		m_search = new RWSearch(this);
		m_controller.oPromise.then(function () {
		    m_worklist = new wklWorklist(m_controller);

			if(!($m_errDisplayDiv.is(":hidden"))) {
				var height = $m_errDisplayDiv.height();
				$("#wklOuterDiv").css("top", height);
			}
			m_filter.initialize(m_controller);
			m_patientController = new ACM_Patient_Controller(m_controller);

			m_shareDialog = new ShareDialog(m_filter.getProviderGroups(), m_controller);
			m_customizeDialog = new CustomizeDialog(m_controller);
			m_genCommDialog = new GenComm(m_controller);
			m_toolbar = new RWToolbar(m_controller.staticContentPath, m_controller);

			var aDrop = [
					{title:i18n.rwl.CREATELIST,name:"Create",dcallback:createList},
					{title:i18n.rwl.MODIFY,name:"Modify",dcallback:modifyList},
					{title:i18n.rwl.REMOVEDQPATIENTS,name:'RemoveAll',dcallback:m_filter.launchRemoveAllDialog},
					{title:i18n.rwl.RENAME,name:"Rename",dcallback:m_filter.launchRenameDialog},
					{title:i18n.rwl.DELETELIST,name:"Delete",dcallback:m_filter.launchDeleteDialog},
					{title:i18n.rwl.SHARE,name:"Share",dcallback:launchShare},
					{title:i18n.rwl.CUSTOMIZECOLS,name:"Customize",dcallback:launchCustomize}
				];
			if ((m_bedrockPrefs.EXPORT_PATIENT_SUMMARY_FLAG === 1) && (m_controller.getPrivilegeValue('ADDMEDIA') === 1)) {
				aDrop.splice(aDrop.length - 1, 0, { title: i18n.rwl.EXPORTPATIENTSUMMARY, name:'ExportPatientSummary', dcallback: exportPatientSummary });
			}
			if(m_bedrockPrefs.EXPORT_FLAG == 1){
				aDrop.splice(aDrop.length-1,0,{title:i18n.rwl.EXPORT,name:'Export',dcallback:exportList});
			}

			var buttons = [
				{name:"listActions",label:i18n.rwl.LISTACTIONSBUTTON,icon:m_controller.staticContentPath+"/images/3738_32.png",callback:"",dropdown:aDrop, dropdownArrow:true},
				{name:'addPatient',label:i18n.rwl.ADDPATIENTBUTTON,icon:m_controller.staticContentPath+'/images/6693_32.png',callback:addPatient,dropdown:[], tooltip: i18n.rwl.AUTOADDPTTOOLTIP },
				{name:"removePatient",label:i18n.rwl.REMOVEPATIENTBUTTON,icon:m_controller.staticContentPath+"/images/6695_32.png",callback:m_controller.removePatients,dropdown:[], tooltip: "" + i18n.rwl.REMOVEPATIENTTOOLTIP + ""},
				{name:"help",label:i18n.rwl.HELPBUTTON,icon:m_controller.staticContentPath+"/images/3865_32.png",callback:getHelp,dropdown:[]}
			];

			if(m_bedrockPrefs.GENERATE_COMMUNICATION.ENABLE_IND === 1){
				buttons.splice(buttons.length-1,0,{name:'genComm',label:i18n.genComm.GENERATECOMMUNICATION,icon:m_controller.imagePaths.genCommToolbarBtn,callback:launchGenComm,dropdown:[]});
			}

			m_toolbar.addButton(buttons)
					.enableButton("help").enableButton("listActions")
					.getToolbar().addClass("mainToolbarSize").attr("id", "rwMainToolbar")
					.children(".rwToolbarButton").addClass("handleRowSelection").end()
					.appendTo($("#divFilterPanelTopBarContent"));

			m_toolbarBtnWidths = m_toolbar.determineWidths();
			createFuzzySearch();

			var prevTopbarWidth;
			if(typeof prevTopbarWidth !== 'number') {
				 prevTopbarWidth = -1;
			}
			function SetRefreshWindowControl(){
				if(m_controller.logObj.refreshOverride) {
					window.external.MPAGESOVERRIDEREFRESH('');
				} else {
					window.external.MPAGESOVERRIDEREFRESH('OnRefresh()');
				}
			}
			function TopBarContentResizeFn(element) {

				if(prevTopbarWidth === element.offsetWidth) {  // Do not hide/show buttons if width did not change.
					return;
				}
				prevTopbarWidth = element.offsetWidth;
				$('#rwSearchDlg').resize();
				m_toolbar.hideShowButtons(element.offsetWidth, m_toolbarBtnWidths);
				SetRefreshWindowControl();
			}
			var toolbarResizeObj = elementResizeDetectorMaker(); //Object for attaching resize listener
			toolbarResizeObj.listenTo(
				document.getElementById('divFilterPanelTopBarContent'),
				TopBarContentResizeFn
			);
			function windowResizeFunction (element) {
				var filterShellWidth = 15;
				$("#wklExpandedView").width($(window).width() - ($("#wklBodyFixed").width() + filterShellWidth));
				SetRefreshWindowControl();
			}

			var windowResizeObj = elementResizeDetectorMaker(); //Object for attaching resize listener
			windowResizeObj.listenTo(
				document.getElementById('wklOuterDiv'),
				windowResizeFunction
			  );

			if(m_filter.getActiveList()!=0)
			{
				m_toolbar.enableButton("addPatient", true);
			}
			else
			{
				m_toolbar.enableButton("addPatient", false);
			}

			$("#filterTab")
				.click(function(){
					collapseBtnIsClicked = true;
					$(this).not(".expandViewShown,.noList").toggleClass("collapsed").trigger("updateFilterState");
				})
				.bind("updateFilterState",function(){
					var filterAnimationSpeed = 200;
					var $this = $(this);
					var $filterShell = $("#filterShell");
					var filterShellWidth = {
						hidden :"0px" ,
						closed :"20px",
						open   :"360px"
					};

					$("#imgFilterCollapse").remove();
					$("#filterTabTooltip").removeClass("show");
					if($this.hasClass("noList")) {
						$filterShell.animate({width: filterShellWidth.hidden},0,"linear",function() {
						$("#wklOuterDiv").animate({left: filterShellWidth.hidden},0);
						$('#wklMessageBanner').css('width','100%')
											  .animate({left: filterShellWidth.hidden},0);
						});
						$("#divDisabledMenu").css("display","none");
						$this.addClass("collapsed");
					}
					else if($this.is('.collapsed,.expandViewShown')) {
						$filterShell.animate({width: filterShellWidth.closed},filterAnimationSpeed,"linear",function() {
						$("#wklOuterDiv").animate({left: filterShellWidth.closed},1);
						$('#wklMessageBanner').css('width','calc(100% - ' +filterShellWidth.closed +')')
											  .animate({left: filterShellWidth.closed},1);
						});
						$this.prepend("<img id='imgFilterCollapse' src='" +
										m_controller.staticContentPath + "/images/6364_right.png'/>");
						$("#divDisabledMenu").css("display","none");
					} else {
						$("#wklMessageBanner").animate({left: filterShellWidth.open},200)
											  .css('width','calc(100% - ' +filterShellWidth.open +')');
						$filterShell.animate({width: filterShellWidth.open},filterAnimationSpeed,"linear",function() {
						$("#wklOuterDiv").animate({left: filterShellWidth.open},1);});
						$this.prepend("<img id='imgFilterCollapse' src='" +
										m_controller.staticContentPath + "/images/6364_left.png'/>");
						$("#divDisabledMenu").css("display","inline");
					}
				})
				.mouseover(function(e){
					if(collapseBtnIsClicked){
						collapseBtnIsClicked = false;
						return;
					}
					var $target = $(e.target);
					if(($target.attr("id")=="imgFilterCollapse")){
						var $toolTip = $("#filterTabTooltip");
						if(!$(this).is('.collapsed,.expandViewShown')){
							$toolTip.css("top", "50px");
							$toolTip.css("left", "370px");
							$toolTip.text(i18n.rwl.COLLAPSE);
						}else{
							$toolTip.css("top", "50px");
							$toolTip.css("left", "30px");
							$toolTip.text(i18n.rwl.EXPAND);
						}
						$toolTip.addClass("show");
					}
					else{
						$("#filterTabTooltip").removeClass("show");
					}
				})
				.mouseleave(function(){
					$("#filterTabTooltip").removeClass("show");
				})
				.trigger("updateFilterState");

			$("body").data("user_id",m_controller.criterion.CRITERION.PRSNL_ID);
			$("html").mousedown(function(event){
				if(!event || !event.target || m_mousedownFunctions.length <= 0){
					return;
				}
				var $target = $(event.target);
				if(!$target.offset()){
					return;
				}
				var bScrollbarArea = ((event.clientX - $target.offset().left) > $target[0].clientWidth ||
							(event.clientY -  $target.offset().top) > $target[0].clientHeight);

				for(var i=0,len=m_mousedownFunctions.length; i<len; i++){
					m_mousedownFunctions[i]($target,bScrollbarArea,event);
				}
			}).on("customClick",function(){
				for(var i=0,len=m_mousedownFunctions.length; i<len; i++){
					m_mousedownFunctions[i]($('html'),false,null);
				}
			}).keydown(function(event){
				if(event.which === 9) {
					event.preventDefault();
				}
			}).keyup(function(event) {
				if (event.which === 114) {
					if(m_controller.logObj.refreshOverride) {
						m_controller.logObj.refreshOverride = false;
						window.external.MPAGESOVERRIDEREFRESH("OnRefresh()");
						event.stopPropagation();
					} else {
						m_controller.logObj.refreshOverride = true;
						window.external.MPAGESOVERRIDEREFRESH("");
						event.stopPropagation();
					}
				}
		    });
		});
	};
	this.resetFuzzySearch = function() {
		$("#fuzzySearchInput").val("");
		m_fuzzySearchApplied = false;
		m_fuzzySearchText = "";
	};

	function showFuzzySearchProcessing() {
		m_controller.setWorklistMessage(i18n.rwl.PROCESSING,true);
		$("#wklBodyFixed")
			.add("#wklBodyScroll")
			.add("#wklHeaderDiv").hide();
	}
	function applyFuzzySearch(searchString) {
		var sortBy = m_controller.getSortCriteria();
		var patients = m_patientController.sortPatientData(
			m_patientController.getFuzzySearchPatients(searchString,m_patientsToCompare,m_controller.appliedFilters));

		setTimeout(function() {
			m_controller.setWorklistMessage(i18n.rwl.PROCESSING,false);
			m_worklist.redrawPatientList(patients, sortBy);
			m_controller.updatePatientCounts(patients,true);
		}, 1000);
	}
	function fuzzySearchInputChanged(fuzzySearchInputVal) {
		m_controller.fuzzySearchValOnKeyUp.after = fuzzySearchInputVal;
		if(m_controller.fuzzySearchValOnKeyUp.before != m_controller.fuzzySearchValOnKeyUp.after) {
			m_controller.fuzzySearchValOnKeyUp.before = [m_controller.fuzzySearchValOnKeyUp.after,
														m_controller.fuzzySearchValOnKeyUp.after = m_controller.fuzzySearchValOnKeyUp.before][0];
			return true;
		}
		return false;
	}
	function fuzzySearchInputChangedOnEnter(fuzzySearchInputVal) {
		if(m_controller.fuzzySearchValOnEnter != fuzzySearchInputVal) {
			m_controller.fuzzySearchValOnEnter = fuzzySearchInputVal;
			return true;
		}
		return false;
	}
	function createFuzzySearch() {
		var $searchBox = $("<div id='fuzzySearchBox'>")
							.append($("<input id='fuzzySearchInput' type='text'/>")
								.keyup(function(e) {
									if(m_controller.getActivePatientListID() != 0 && (m_filter.getInaccessibleList() != m_controller.getActivePatientListID())) {
									var inputVal = $(this).val();
									if(e.keyCode == '13') {          // Return key is pressed in the search box.
										if(fuzzySearchInputChangedOnEnter(inputVal) || m_retainFuzzySearch) {
											showFuzzySearchProcessing();
											applyFuzzySearch(inputVal);

											m_fuzzySearchText = inputVal;
											m_fuzzySearchApplied = true;
										}
									} else {          // When characters are entered in the search box.
										if(fuzzySearchInputChanged(inputVal) || m_retainFuzzySearch) {
											var text = inputVal;
											setTimeout(function() {
												var newText = $("#fuzzySearchInput").val();
												if(m_fuzzySearchText != newText) {
													m_fuzzySearchApplied = false;
												}
												if(text == newText && (m_fuzzySearchApplied != true || m_retainFuzzySearch)) {
													showFuzzySearchProcessing();
													if(text == "" && m_controller.appliedFilters == true) {
														$("#filterButApply").click();
													} else {
														applyFuzzySearch(newText);
														m_fuzzySearchText = newText;
														m_fuzzySearchApplied = true;
													}
													m_retainFuzzySearch = false;
												}
											},1500);
										}
									}
									}

								})
								.mouseenter(function(e) {
									var $divTooltip = $("#rwFuzzySearchInputTooltip");
									$divTooltip.remove();
									$("#fuzzySearchBox")
										.append($("<div id='rwFuzzySearchInputTooltip'>" + i18n.rwl.SEARCHPATIENTS + "</div>")
										.click(function(event){
											event.stopPropagation();
										})
									);
									var width = $divTooltip.width();
									$divTooltip.css("left", (width/2));
								})
								.on("mouseleave mouseup",function(e){
									$("#rwFuzzySearchInputTooltip").remove();
								})
							);

		$("#divFilterPanelTopBarContent").append($searchBox);

		m_controller.resetFuzzySearch();
	}

	this.addMousedownFunction = function(fnMousedown){
		m_mousedownFunctions.push(fnMousedown);
	};
	this.notifyOnChangeActiveList = function(activeListID)
	{
		m_controller.resetFuzzySearch();
		$('html').trigger('customClick'); // simulate click to close dropdowns, etc.
		if(activeListID==0){
			if(m_toolbar){
				m_toolbar.enableButton("addPatient", false);
			}
			m_controller.createCheckpoint("USR:DWL-SWITCHLIST", "Stop", [{key: "List ID", value: activeListID}, {key: "Number of Patients", value: m_controller.getStaticPatientListSize()}]);
			return;
		}else {
			this.showSavedPatientList(activeListID);
			if(m_toolbar){
				m_toolbar.enableButton("addPatient", true);
			}
		}
	};
	this.notifyDiscernRefresh = function(){
		if(m_controller.getActivePatientListID() == 0) {
			return;
		}

		var expandViewPtId = m_worklist.getExpandViewPatientId();
		if(expandViewPtId > 0){
			m_worklist.refreshExpandView(expandViewPtId);
		}else {
			m_patientsSelected = [];
			m_controller.clearPOI();
			m_controller.clearPatientList();
			m_controller.showSavedPatientList(m_controller.getActivePatientListID());
		}
		if (m_controller.fnIsGenCommMessageBannerDisplayed() === true) {
			m_controller.enableGenCommButton(false);
		}
	};
	this.setSummaryContent = function(secContent, recommStatus) {
        if (Array.isArray(secContent) === false || Array.isArray(recommStatus) === false) {
           return '';
  		}
  		return secContent.map(function(expectation) {
    	return i18n.rwl.EXPECTLABEL
      	.replace('{36}', expectation)
      	.replace('{37}', recommStatus.join(' ' + i18n.rwl.OR.toLowerCase() + ' '))
  		}).join(' ' + i18n.rwl.OR.toUpperCase() + ' ');
	};
	this.fnIsGenCommMessageBannerDisplayed = function() {
		return $('#genCommMessage').is(':visible') === true;
	};

	this.launchSearchWindow = function(savedLists){
		createList();
	};

	this.clearPatientList = function(){
		m_controller.resetFuzzySearch();
		m_filter.resetFilters();
		m_worklist.clearList();
	};

	this.filterWorklist = function(){
		m_worklist.filterWorklist();
	};
	this.sortPatientList = function(sortBy){
		var patientsToSort = m_patientsToCompare.slice(0);
		var worklistItems = {};
		worklistItems = m_patientController.changeSortCriteria(sortBy,patientsToSort);
		m_worklist.showPatientList(worklistItems,sortBy,"",2);
		m_worklist.markPatientsAsRemovable(m_patientController.getRemovablePatients());
	};
	this.getSortCriteria = function() {
		return m_filter.getDefaultSortCriteria(this.getActivePatientListID());
	};
	this.callSaveDefaultSortCriteria = function(sortByParam) {
		m_filter.saveDefaultSortCriteria(sortByParam);
	};

	this.resetFilters = function() {
		m_filter.resetFilters();
	};
	this.setWorklistMessage = function(sMsg, bShow, bShowCreateBtn) {
		var showCreateBtn = bShowCreateBtn || false;
		var $listMsg = $("#NoPerson").children(".message");
		if(bShow === true && typeof sMsg == 'string' && sMsg.length > 0){
			$listMsg.text(sMsg).parent().show();
			$("#createListBtn").toggle(showCreateBtn);
			$("#NoListAccess").hide();
		} else if($listMsg.text() === sMsg) {
			$listMsg.parent().hide();
			$("#createListBtn").hide();
		}
	};
	this.getListGroups = function(listID) {
		var groups = [],
			savedLists = this.getSavedList(),
			currentList,
			listArguments,
			listArg;

		if(listID > 0) {
			for(var i=0, len=savedLists.length; i<len; i++) {
				if(savedLists[i].PATIENT_LIST_ID === listID) {
					currentList = savedLists[i];
					break;
				}
			}
		}
		if(currentList !== undefined) {
			listArguments = currentList.ARGUMENTS;

			for(var a = 0, alen = listArguments.length; a < alen; a++) {
				listArg = listArguments[a];
				if(listArg.ARGUMENT_NAME === 'ACMPRSNLGROUPS_SEARCH') {
					groups.push({
						group_name: listArg.ARGUMENT_VALUE,
						group_id: listArg.PARENT_ENTITY_ID
					});
				}
			}
		}

		savedLists = null;
		currentList = null;
		listArguments = null;
		return groups;
	};
	this.fnGetListArgument = function(iListId, sArugumentName, sArgumentProperty, sReturnValueKey) {
		var aoArgumentValues = [],
			aoSavedListsWithListIdInContext = $.grep(this.getSavedList(), function(oList) {
				return oList.PATIENT_LIST_ID === iListId;
			}),
			oListInContext = null;
		if (aoSavedListsWithListIdInContext.length === 0) {
			return aoArgumentValues;
		}
		oListInContext = aoSavedListsWithListIdInContext[0];
		aoArgumentValues = $.map(oListInContext.ARGUMENTS, function(oArgument) {
			var oArgumentNameValuePair = {};
			if (oArgument.ARGUMENT_NAME === sArugumentName) {
				oArgumentNameValuePair[sReturnValueKey] = oArgument[sArgumentProperty];
				return oArgumentNameValuePair;
			}
		});
		return aoArgumentValues;
	};
	this.fnGetActiveListProviders = function() {
		var aoProviderInProviderGroups = $.map(m_filter.fnGetProviderIdsInProviderGroups(), function(iProviderId) {
				return {
					provider_id: iProviderId
				};
			}),
			aoSingleProviders = this.fnGetListArgument(
				m_controller.getActiveList().PATIENT_LIST_ID,
				'SINGLEPROVIDER_SEARCH',
				'PARENT_ENTITY_ID',
				'provider_id');
		return $.extend({}, aoProviderInProviderGroups, aoSingleProviders);
	};
	this.fnGetActiveListEncounterTypes = function() {
		var S_ENCOUNTER_GROUP_PARENT_ENTITY_NAME = '',
			S_ENCOUNTER_GROUP_ARGUMENT_NAME = 'ENCOUNTERTYPE_SEARCH',
			aiEncounterTypeCodes = $.map(m_filter.getActiveList().ARGUMENTS, function(oArgument) {
				if (oArgument.ARGUMENT_NAME === S_ENCOUNTER_GROUP_ARGUMENT_NAME &&
					oArgument.PARENT_ENTITY_NAME === S_ENCOUNTER_GROUP_PARENT_ENTITY_NAME) {

					return m_filter.fnGetEncounterTypesIdsForEncounterGroup(oArgument.PARENT_ENTITY_ID);
				}
			});
		return $.map(aiEncounterTypeCodes, function(iEncounterTypeCode) {
			return {
				encntr_type_cd: iEncounterTypeCode
			};
		});
	};
	this.fnGetActiveListEprCodes = function() {
		return m_controller.fnGetListArgument(
			m_controller.getActiveList().PATIENT_LIST_ID,
			'EPRCODES_SEARCH',
			'PARENT_ENTITY_ID',
			'reltn_type_cd');
	};
	this.fnGetActiveListLocations = function() {
		return m_controller.fnGetListLocations(m_controller.getActiveList().PATIENT_LIST_ID);
	};
	this.fnGetListLocations = function(iListId) {
		return m_controller.fnGetListArgument(iListId, 'LOCATIONUNITS_SEARCH', 'PARENT_ENTITY_ID', 'location_cd');
	};
	this.getChildLocations = function(facilityCd, buildingCd) {
		return m_search.getChildLocations(facilityCd, buildingCd);
	};
	this.showSavedPatientList = function(listId){

		function loadListFailure(reply,listID){
			m_worklist.setLoadingState(false);
			m_worklist.removeColumnErrorImages();
			$("#NoListAccess").show();
			m_controller.resetPatientData();
			if(reply && reply.LIST_ALLOWED_IND===0){
				m_controller.enableGenCommButton(false);
				m_controller.removeSavedList(listID);
				m_controller.setInaccessibleList(listID);
				$("#filterTab").addClass("noList").trigger("updateFilterState");
				$("#wklOuterDiv").find("div.wklHorizScroller").addClass("hidden");
				if (m_toolbar) {
				    m_toolbar.enableButton("addPatient", false);
				}
			} else {
				m_patientController.resetListData();
				m_filter.showWorklistCount(0, 0, 1);
				m_worklist.redrawPatientList([]);
			}
			m_controller.createCheckpoint("USR:DWL-SWITCHLIST", "Fail", [{key: "List ID", value: listID}]);
		}

		$("#NoListAccess").hide();
		m_controller.setWorklistMessage(i18n.rwl.NOPERSON, false);
		m_worklist.setLoadingState(true);

		m_filter.showRemovableCount(0,0,1); //Reset the removable count to hide it.
		var newListColDataObj = {
			fixedSize : 0,
			scrollSize : 0,
			fixedWidth : 0,
			scrollWidth : 0,
			shadowWidth : 4,
			columns : m_filter.getColumnPrefs(listId)
		};
		var defaultCols = this.getColDefaults().columns;
		var cols = newListColDataObj.columns;
		var iMaraScoreFlag = m_controller.getMaraFlag();
		for(var i = 0, len = cols.length; i < len; i++) {
			var curCol = cols[i];
			if(curCol.key == "COL_RISK" && m_risk_flag == 0 && iMaraScoreFlag === 0) {
				cols.splice(i, 1);
				i--;
				len--;
				continue;
			}
			for(var j = 0, jlen = defaultCols.length; j < jlen; j++) {
				var defaultCol = defaultCols[j];
				if(defaultCol.key == curCol.key) {
					curCol.title = defaultCol.title;
					curCol.fixed = defaultCol.fixed;
					curCol.contentBuilder = (defaultCol.contentBuilder);
					curCol.id = defaultCol.id;
					curCol.delayedLoad = defaultCol.delayedLoad;
					curCol.dataSet = defaultCol.dataSet || "";
					curCol.columnLoadName = defaultCol.columnLoadName || "";
				}
				defaultCol = null;
			}
			curCol = null;
		}
		if(cols.length === 0) {
			cols = defaultCols;
		}
		newListColDataObj.columns = cols;
		m_worklist.setCurrentColData(newListColDataObj);
		var bIsListBuiltOnGroups = (m_controller.getListGroups(listId) || []).length > 0;
		var groups = m_filter.getProviderGroups();
		var locations = m_controller.fnGetListLocations(listId);
		groups.sort(function(a,b) {
			return a.group_id - b.group_id;
		}); // sort the groups before passing to the script -- the script expects them to be sorted and uses locatevalsort
		locations.sort(function(a,b) {
			return a.location_cd - b.location_cd;
		});

		var request = {
			list_request: {
				patient_list_id: listId
			}
		};
		if (bIsListBuiltOnGroups === true) {
			request.list_request.groups = groups;
		}
		this.makeCall('mp_dcp_load_static_list',request,true,m_controller.showDemographics,loadListFailure,1,this.getActivePatientListID());
		if(locations.length > 0) {
			var loc_request = {
				'loc_request': {
					'locations': locations,
					'skip_org_security_ind': 1,
					'skip_fill_reply_ind':   0
				}
			};
			this.makeCall('mp_dcp_get_loc_prnt_hierarchy', loc_request, true, function(reply) {
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

		m_controller.clearSpecificMessages('.loadstaticlist');

		groups = null;
		request = null;
		newListColDataObj = null;
		cols = null;
		defaultCols = null;
	};
	this.showDemographics = function(demogData,listId){
		m_controller.setInaccessibleList(0);
		m_worklist.setLoadingState(false);
		m_worklist.removeColumnErrorImages();
		var metaData = [
			{key: "List ID", value: listId},
			{key: "Number of Patients", value: m_controller.getStaticPatientListSize()}
		];
		if(!demogData){ //fail-safe
			m_controller.createCheckpoint("USR:DWL-SWITCHLIST", "Stop", metaData);
			return;
		}

		m_patientController.resetListData();
		m_patientController.setBasePatientData(demogData.PATIENTS);
		var filters = m_filter.getFilterChecks();
		if(JSON.stringify(filters).indexOf("QUALIFYING") > -1) {
			m_controller.setWorklistMessage(i18n.rwl.PROCESSING,true);
			$("#wklBodyFixed")
			.add("#wklBodyScroll")
			.add("#wklHeaderDiv").hide();
		}
		else {
			var sortCriteria = m_filter.getDefaultSortCriteria(listId);
			m_patientController.changeSortCriteria(sortCriteria,m_patientController.getAllPatients());
			var patientCount = demogData.PATIENTS.length;
			m_filter.showWorklistCount(patientCount, patientCount, 1);
			var worklistItems = this.getFilteredPatients(filters);
			m_worklist.redrawPatientList(worklistItems,sortCriteria);
			m_controller.m_currentlyDisplayedPatients = worklistItems.slice(0);
			m_patientsToCompare = m_controller.m_currentlyDisplayedPatients;

		}
		m_controller.createCheckpoint("USR:DWL-SWITCHLIST", "Stop", metaData);
		worklistItems = null;
		this.loadColumnsWhenWorklistDrawn(listId);
	};

	this.returnSortCriteria = function() {
		var sortCriteria = m_filter.getDefaultSortCriteria(this.getActivePatientListID());
		m_patientController.changeSortCriteria(sortCriteria,m_patientController.getAllPatients());
		return sortCriteria;
	};
	this.returnWorkListItems = function(firstSelectedId,lastSelectedId, worklistItemsList) {
		var worklistItems;
		if(worklistItemsList != undefined) {
			worklistItems = worklistItemsList;
		} else {
			worklistItems = this.getFilteredPatients(m_filter.getFilterChecks());
		}

		if(firstSelectedId != undefined && lastSelectedId != undefined) {
			var worklistPatientIDs = [];
			var bool = false;
			for(var i = 0, worklistItemsLength = worklistItems.length; i < worklistItemsLength; i++) {
				if(worklistItems[i].PERSON_ID == firstSelectedId) {
					bool = !bool;
					if(!bool) {
						worklistPatientIDs.push("" + worklistItems[i].PERSON_ID + "");
					}
				}
				if(worklistItems[i].PERSON_ID == lastSelectedId) {
					bool = !bool;
					if(!bool) {
						worklistPatientIDs.push("" + worklistItems[i].PERSON_ID + "");
					}
				}
				if(bool) {
					worklistPatientIDs.push("" + worklistItems[i].PERSON_ID + "");
				}
			}
			return worklistPatientIDs;
		}
		return worklistItems;
	};

	this.loadColumnsWhenWorklistDrawn = function(listId) {
		m_controller.toggleAddPatient();
		var scrollHeight = $("#wklBodyDiv").height();
		if(scrollHeight > 0) {
			var patCount = m_patientController.getAllPatients().length;
			if(patCount > 100) {
				m_columnLoadBatchSize = Math.ceil(patCount/4);
			}
			else {
				m_columnLoadBatchSize = patCount;
			}
			if(!m_creatingList) {
				m_controller.updateDeltaPatients(listId, m_filter.getCurrentListSearchArguments());
			}
			m_controller.resetBatchCount();
			m_controller.loadNextColumnData('workItems', listId, m_columnLoadBatchSize, m_batch.IWORKITEMS);
			m_controller.loadNextColumnData("providerReltns", listId, m_columnLoadBatchSize, m_batch.PROVIDERRELTNS);
			m_controller.loadNextColumnData("encounters", listId, m_columnLoadBatchSize, m_batch.ENCOUNTERS);
			m_controller.loadNextColumnData("healthPlans", listId, m_columnLoadBatchSize, m_batch.HEALTHPLANS);
			m_controller.loadNextColumnData("conditions", listId, m_columnLoadBatchSize, m_batch.CONDITIONS);
			if(m_controller.getRiskFlag() == 1 || m_controller.getMaraFlag() === 1) {
				m_controller.loadNextColumnData("risks", listId, m_columnLoadBatchSize, m_batch.RISKS);
			}
			m_controller.setCreatingList(false);
		} else {
			setTimeout(function(){
				m_controller.loadColumnsWhenWorklistDrawn(listId);
			}, 1000);
		}
	};
	this.loadNextColumnData = function (columnLoadName, listId, batchSize, batchNumber) {

		var keyName = columnLoadName + "" + batchNumber,
			startIndex = 0,
			endIndex = 0;

		m_controller.createCheckpoint("USR:DWL-COLUMNLOAD", "Start");
		switch (batchNumber) {
			case 1:
				startIndex = 0;
				if (batchSize > (m_controller.firstBatch * 2)) {
					endIndex = m_controller.firstBatch;
				}
				else if (batchSize > m_controller.firstBatch) {
					endIndex = Math.floor(batchSize / 2);
				}
				else {
					endIndex = batchSize;
				}
				break;
			case 2:
				if (batchSize > (m_controller.firstBatch * 2)) {
					startIndex = m_controller.firstBatch;
					endIndex = batchSize;
				}
				else if (batchSize > m_controller.firstBatch) {
					startIndex = Math.floor(batchSize / 2);
					endIndex = batchSize;
				}
				else {
					startIndex = batchSize;
					endIndex = batchSize * 2;
				}

				break;
			default:
				if (batchSize > m_controller.firstBatch) {
					startIndex = (batchNumber - 2) * batchSize;
					endIndex = startIndex + batchSize;
				}
				else {
					startIndex = (batchNumber - 1) * batchSize;
					endIndex = startIndex + batchSize;
				}
				break;
		}

		batchSize = endIndex - startIndex;

		var criterion = this.getCriterion();
		var patientIdsToCheckFirst = m_worklist.getPatientIds(startIndex, endIndex);
		var patientIdsToLoad = m_patientController.getPatientsNeedingColumnLoad(patientIdsToCheckFirst, columnLoadName, batchSize);

		if(patientIdsToLoad.length <= 0) {
			m_controller.createCheckpoint("USR:DWL-COLUMNLOAD", "Stop", [{key: "List ID", value: listId},{key: "Column", value: keyName}]);
			return;
		}
		var param = {"listrequest":{"user_id":criterion.CRITERION.PRSNL_ID,"pos_cd":criterion.CRITERION.POSITION_CD,"patients":[],"case_mgr":[],"pcp":[]}};
		for(var i = 0, szi = patientIdsToLoad.length; i < szi; i++) {
			param.listrequest.patients.push({"person_id":patientIdsToLoad[i]});
		}
		for(var j = 0, szj = m_bedrockPrefs.CASE_MGR_CD.length; j < szj; j++)
		{
			param.listrequest.case_mgr.push({"case_mgr_cd":m_bedrockPrefs.CASE_MGR_CD[j].CASE_MGR_CD_VALUE});
		}
		for(var k = 0, szk = m_bedrockPrefs.PCP_CD.length; k < szk; k++)
		{
			param.listrequest.pcp.push({"pcp_cd":m_bedrockPrefs.PCP_CD[k].PCP_CD_VALUE});
		}

		var callbackFunction;
		switch(columnLoadName) {
			case "providerReltns":
				param.listrequest.load_pcps_ind = 1;
				param.listrequest.load_casemgrs_ind = 1;
				callbackFunction = m_controller.updateProviderRelationData;
				break;

			case "encounters":
				param.listrequest.load_utilization_ind = 1;
				callbackFunction = m_controller.updateEncounterData;
				break;

			case "conditions":
				param.listrequest.condition_args = m_filter.getConditionArguments(true);
				param.listrequest.load_conditions_ind = 1;
				callbackFunction = m_controller.updateConditionData;
				break;

			case "healthPlans":
				param.listrequest.load_healthplan_ind = 1;
				callbackFunction = m_controller.updateHealthPlanData;
				break;

			case "risks":
				param.listrequest.load_risks_ind = 1;
				param.listrequest.load_mara_ind = m_controller.getMaraFlag();
				callbackFunction = m_controller.updateRiskData;
				break;

			case 'workItems':
				param.listrequest.load_comments_ind = 1;
				param.listrequest.load_phone_calls_ind = 1;
				callbackFunction = m_controller.fnUpdateWorkItemsData;
				break;

			default:
				m_controller.createCheckpoint("USR:DWL-COLUMNLOAD", "Stop", [{key: "List ID", value: listId},{key: "Column", value: keyName}]);
				return;
		}
		var callbackSuccFunction =
			(function(colName,cbFn){
				return (function(data, listId) {
					cbFn.call(m_controller,data, listId);
					m_controller.createCheckpoint("USR:DWL-COLUMNLOAD", "Stop", [{key: "List ID", value: listId},{key: "Column", value: colName}]);
				});
			}) (keyName,callbackFunction);
		var callbackFailFunction =
			(function(colName,patients,listId){
				return (function(/* reply */){
					m_worklist.columnLoadingFailed(patients,colName.toLowerCase());
					m_controller.createCheckpoint("USR:DWL-COLUMNLOAD", "Fail", [{key: "List ID", value: listId},{key: "Column", value: colName}]);
				});
			})(keyName,param.listrequest.patients,listId);

		this.makeCall("mp_dcp_pl_retrieve_col_data",param,true,callbackSuccFunction,callbackFailFunction,1,listId);
	};
	this.updateRiskData = function(riskData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(riskData, "risks");
		m_worklist.updateRiskData(updatePatients);
		m_batch.RISKS += 1;
		this.loadNextColumnData("risks", listId, m_columnLoadBatchSize, m_batch.RISKS);
	};
	this.fnUpdateWorkItemsData = function(workItemsData, listId) {
		if(this.getActivePatientListID() !== listId) {
			return;
		}

		var updatePatients = m_patientController.storePatientColumns(workItemsData, 'workItems');
		m_worklist.updatePhoneCallData(updatePatients);
		m_worklist.updateCommentData(updatePatients);

		m_batch.IWORKITEMS += 1;
		this.loadNextColumnData('workItems', listId, m_columnLoadBatchSize, m_batch.IWORKITEMS);
		updatePatients = null;
	};
	this.updatePhoneCallData = function(phoneData, listId) {
		if(this.getActivePatientListID() !== listId) {
			return;
		}
		var updatePatients = m_patientController.storePatientColumns(phoneData, 'phoneCalls');
		m_worklist.updatePhoneCallData(updatePatients);

		updatePatients = null;
	};
	this.fnUpdatePatientPhoneCalls = function(oPatient) {
		m_patientController.fnUpdatePatientPhoneCallData(oPatient);
		m_worklist.updatePhoneCallData([oPatient]);
	};
	this.updateCommentData = function(commentData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(commentData, "comments");
		m_worklist.updateCommentData(updatePatients);
		m_batch.COMMENTS += 1;
		this.loadNextColumnData("comments", listId, m_columnLoadBatchSize, m_batch.COMMENTS);
	};
	this.updateProviderRelationData = function(providerRelationshipData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(providerRelationshipData, "providerReltns");
		m_worklist.updateRelationshipData(updatePatients);
		m_batch.PROVIDERRELTNS += 1;
		this.loadNextColumnData("providerReltns", listId, m_columnLoadBatchSize, m_batch.PROVIDERRELTNS);
	};
	this.updateEncounterData = function(encounterData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(encounterData, "encounters");
		m_worklist.updateEncounterData(updatePatients);
		m_batch.ENCOUNTERS += 1;
		this.loadNextColumnData("encounters", listId, m_columnLoadBatchSize, m_batch.ENCOUNTERS);
	};
	this.getEncounterId = function(iPatientId) {
		return m_patientController.getPatientEncounterId(iPatientId);
	};
	this.fnGetEncounterIdForPatientsInActiveListAsynchronously = function(aiPatientIds) {
		var B_FETCH_ASYNCHRONOUSLY = true;
		return m_patientController.fnGetPatientsEncounterId(aiPatientIds, B_FETCH_ASYNCHRONOUSLY);
	};
	this.updateHealthPlanData = function(healthPlanData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(healthPlanData, "healthPlans");
		m_worklist.updateHealthPlanData(updatePatients);
		m_batch.HEALTHPLANS += 1;
		this.loadNextColumnData("healthPlans", listId, m_columnLoadBatchSize, m_batch.HEALTHPLANS);
	};
	this.updateConditionData = function(conditionData, listId) {
		if(this.getActivePatientListID() != listId) {
			return;//the list has changed. This data is no longer needed.
		}
		var updatePatients = m_patientController.storePatientColumns(conditionData, "conditions");
		m_worklist.updateConditionData(updatePatients);
		m_batch.CONDITIONS += 1;
		this.loadNextColumnData("conditions", listId, m_columnLoadBatchSize, m_batch.CONDITIONS);
	};

	this.returnRemovablePatients = function() {
		return m_patientController.getRemovablePatients();
	};
	this.currentlyRemovablePatients = function(worklistItems,removablePatients) {
		var currentRemovablePatients = [];
		for(var i = 0, len = worklistItems.length; i < len; i++) {
			if($.inArray(worklistItems[i].PERSON_ID, removablePatients) > -1) {
				currentRemovablePatients.push(worklistItems[i].PATIENT_ID);
			}
		}
		return currentRemovablePatients.length;
	};

	this.updatePatientCounts = function(worklistItems,fuzzySearchApplied){
		var removablePatients = m_patientController.getRemovablePatients();
		var allRemovablePatientCount = removablePatients.length;
		var markedPatientsCount = m_worklist.markPatientsAsRemovable(removablePatients);
		var filterArguments = m_filter.getFilterChecks();
		if(!worklistItems) {
			worklistItems = m_controller.getFilteredPatients(filterArguments);
		}
		markedPatientsCount = m_controller.currentlyRemovablePatients(worklistItems,removablePatients);

		var allPatientCount = m_patientController.getAllPatients().length;
		if(filterArguments.length <= 0 && worklistItems.length == allPatientCount) {
			m_filter.showWorklistCount(worklistItems.length, allPatientCount, 1);
			m_filter.showRemovableCount(markedPatientsCount, allRemovablePatientCount, 1);
		} else {
			m_filter.showWorklistCount(worklistItems.length, allPatientCount, 2);
			m_filter.showRemovableCount(markedPatientsCount, allRemovablePatientCount, 2);
		}
		m_controller.m_currentlyDisplayedPatients = worklistItems.slice(0);
		if(!fuzzySearchApplied) {
		    m_patientsToCompare = m_controller.m_currentlyDisplayedPatients;
		}
	};
	this.setFacilities = function(availableValues) {
		if($.isArray(availableValues) === false) {
			return;
		}

		var curFacility = null;
		var tempFacility = null;

		m_controller.locations = {'FACILITIES':[]};

		for(var i=0, iLen=availableValues.length; i<iLen; i++) {
			curFacility = availableValues[i];
			tempFacility = {
				'LOCATION_CD': curFacility.PARENT_ENTITY_ID,
				'LOCATION_DISP': curFacility.ARGUMENT_VALUE,
				'BUILDINGS': null
			};
			m_controller.locations.FACILITIES.push(tempFacility);
		}
	};
	this.setChildLocations = function(facilityCd, buildingCd, locations) {
		function getBuildings() {
			var buildings = [];
			for(var i=0, iLen=locations.length; i<iLen; i++) {
				buildings.push({
					'LOCATION_CD': locations[i].LOCATION_CD,
					'LOCATION_DISP': locations[i].LOCATION_DISP,
					'UNITS': null,
					'SELECTED_UNIT_COUNT': 0
				});
			}
			return buildings;
		}
		function getUnits() {
			var units = [];
			for(var i=0, iLen=locations.length; i<iLen; i++) {
				units.push({
					'LOCATION_CD': locations[i].LOCATION_CD,
					'LOCATION_DISP': locations[i].LOCATION_DISP,
					'SELECTED_IND': false
				});
			}
			return units;
		}

		if($.isNumeric(facilityCd) === false || $.isArray(locations) === false) {
			return;
		}

		var curFacility = null;
		var curBuilding = null;

		for(var i=0, iLen=m_controller.locations.FACILITIES.length; i<iLen; i++) {
			curFacility = m_controller.locations.FACILITIES[i];
			if(curFacility.LOCATION_CD !== facilityCd) {
				continue;
			}
			if($.isNumeric(buildingCd) === false) {
				curFacility.BUILDINGS = getBuildings();
				return;
			} else {
				for(var j=0, jLen=curFacility.BUILDINGS.length; j<jLen; j++) {
					curBuilding = curFacility.BUILDINGS[j];
					if(curBuilding.LOCATION_CD === buildingCd) {
						curBuilding.UNITS = getUnits();
						return;
					}
				}
			}
		}
	};
	this.callFilterValuesScript = function(createModDlgSections) {
		function fnSetLocations(aoFilterList) {
			for(var i=0, iLen=aoFilterList.length; i<iLen; i++) {
				if(aoFilterList[i].ARGUMENT_NAME === 'LOCATIONS') {
					m_controller.setFacilities(aoFilterList[i].AVAILABLE_VALUES);
					break;
				}
			}
			if($.isPlainObject(m_controller.locations) === false) {
				m_controller.setFacilities([]);
			}
		}

		var argumentNames = [];
		for(var i=0,len=createModDlgSections.length; i<len; i++){
			var curSection = createModDlgSections[i];
			if(curSection.skipScriptContentRetrieval) {
				if(curSection.contentBuilder){
					curSection.contentBuilder(curSection.name, curSection.title);
					continue;
				}
			}
			argumentNames.push({argument_name:curSection.name});
		}
		var filterSectionAr = m_filter.m_sections.slice(0);
		var argExists = 0;
		for(var i=0; i<filterSectionAr.length; i++) {
			if(filterSectionAr[i].parent_entity_name == "CODE_VALUE") {
				for(var j = 0; j < argumentNames.length; j++) {
					if(argumentNames[j].argument_name == filterSectionAr[i].argument_name)
					{
						argExists = 1;
						break;
					}
				}
				if(argExists == 0) {
					argumentNames.push({argument_name:filterSectionAr[i].argument_name});
				}
				argExists = 0;
			}
		}
		var criterion = m_controller.getCriterion();
		var request = {filter_request:{
					user_id:criterion.CRITERION.PRSNL_ID,
					pos_cd:criterion.CRITERION.POSITION_CD,
					query_type_cd:0,
					filter_list:argumentNames
		}};

		$("#bodySpinner").show();
		m_controller.makeCall("dcp_acm_retrieve_filter_values", request, true, (function (reply) {
			m_controller.replyFromFilterValues = reply;
			m_controller.setRiskFlag(reply.RISK_FLAG);
			m_controller.setCaseStatusFlag(reply.CASE_STATUS_FLAG);
			fnSetLocations(reply.FILTER_LIST);
			deferredObj.resolve();
		}),(function(reply){
			m_controller.replyFromFilterValues = reply;
			m_controller.setRiskFlag(reply.RISK_FLAG);
			m_controller.setCaseStatusFlag(reply.CASE_STATUS_FLAG);
			fnSetLocations(reply.FILTER_LIST);
			deferredObj.resolve();
		}));
	};

	this.showPatientsOnFilters = function(worklistItems) {
		setTimeout(function(){	// Allow for complete filter results to be gathered.
			m_worklist.showPatientList(worklistItems,"","",1);
			m_controller.setWorklistMessage(i18n.rwl.PROCESSING,false);
			m_worklist.setLoadingState(false);
			if(worklistItems.length == 0){
				$("#wklBodyFixed")
				.add("#wklBodyScroll")
				.add("#wklHeaderDiv").hide();
			}
			m_filter.onFiltersApplied();
			m_controller.updatePatientCounts(worklistItems);
		}, 1);
	};
	this.applyFilters = function(filterArguments, patientsToFilter) {
		m_worklist.setLoadingState(true);
		$("#wklBodyDiv").find("div.wklSpinner").hide();	// Shown by setting the load state. Unique case. Hide for aesthetic purposes.
		m_controller.setWorklistMessage(i18n.rwl.PROCESSING,true);
		setTimeout(function(){
			m_controller.getFilteredPatientsInBatches(filterArguments, patientsToFilter);
		},0);
	};
	this.getFilteredPatientsInBatches = function(filterArguments, patientsToFilter) {
		var inMemoryArguments = m_patientController.spliceOutFiltersSupportedInMemory(filterArguments);
		var filteredPatients = m_patientController.getQualifyingPatients(inMemoryArguments, m_controller.m_currentlyDisplayedPatients, patientsToFilter);
		if(filterArguments.length > 0) { //the remaining filters require a database call
			this.performDatabaseFilterInBatches(filterArguments, filteredPatients);
		} else {
			var worklistItems = filteredPatients;
			m_controller.showPatientsOnFilters(worklistItems);
		}
	};
	this.getFilteredPatients = function(filterArguments) {
		var inMemoryArguments = m_patientController.spliceOutFiltersSupportedInMemory(filterArguments);
		var filteredPatients = m_patientController.getQualifyingPatients(inMemoryArguments);
		if(filterArguments.length > 0) { //the remaining filters require a database call
			filteredPatients = this.performDatabaseFilters(filterArguments, filteredPatients);
		}
		inMemoryArguments = null;
		return m_patientController.sortPatientData(filteredPatients);
	};
	this.performDatabaseFilters = function(databaseFilterArguments, patientsToFilter) {
		var param = {LISTREQUEST: {
				user_id: this.criterion.CRITERION.PRSNL_ID,
				pos_cd: this.criterion.CRITERION.POSITION_CD,
				search_indicator: 0,
				load_demographics: 0,
				arguments : databaseFilterArguments,
				search_arguments: [],
				patient_list_name: ""}};

		param.LISTREQUEST.patients = [];
		for(var i = 0, sz = patientsToFilter.length; i < sz; i++) {
				param.LISTREQUEST.patients.push({person_id : patientsToFilter[i].PERSON_ID});
		}
		var reply = this.makeCall("mp_dcp_get_pl_wrapper",param,false);
		var filteredPatients = [];
		if(reply.PATIENTS != undefined) {
			for(var j = 0, szj = reply.PATIENTS.length; j < szj; j++) {
				filteredPatients.push(m_patientController.getPatientById(reply.PATIENTS[j].PERSON_ID));
			}
		}
		param = null;
		reply = null;
		return filteredPatients;
	};
	this.performDatabaseFilterInBatches = function(databaseFilterArguments, patientsToFilter) {
		var param = {LISTREQUEST: {
				user_id: this.criterion.CRITERION.PRSNL_ID,
				pos_cd: this.criterion.CRITERION.POSITION_CD,
				search_indicator: 0,
				load_demographics: 0,
				arguments: databaseFilterArguments,
				search_arguments: [],
				patient_list_name: ""}};

		var paramArray = [];
		var numberOfCalls = 0, numberOfReplies = 0;
		var filteredPatients = [];
		var scriptCallsFailed = false;
		var batchSize = 100;

		param.LISTREQUEST.patients = [];
		for(var i = 0, sz = patientsToFilter.length; i < sz; i++) {
			if((i % batchSize) == 0 && i != (patientsToFilter.length - 1) && i != 0) {
				paramArray[Math.floor(i/batchSize) - 1] = param;
				this.makeCall("mp_dcp_get_pl_wrapper",paramArray[Math.floor(i/batchSize) - 1],true,function(reply){
					if(reply.PATIENTS != undefined) {
						for(var j = 0, szj = reply.PATIENTS.length; j < szj; j++) {
							filteredPatients.push(m_patientController.getPatientById(reply.PATIENTS[j].PERSON_ID));
						}
					}
					numberOfReplies++;
				});

				numberOfCalls = numberOfCalls + 1;
				param.LISTREQUEST.patients.length = 0;
				param.LISTREQUEST.patients.push({person_id : patientsToFilter[i].PERSON_ID});
			} else if(i == (patientsToFilter.length - 1)) {
				param.LISTREQUEST.patients.push({person_id : patientsToFilter[i].PERSON_ID});
				paramArray[Math.floor(i/batchSize)] = param;
				this.makeCall("mp_dcp_get_pl_wrapper",paramArray[Math.floor(i/batchSize)],true,function(reply){
					if(reply.PATIENTS != undefined) {
						for(var j = 0, szj = reply.PATIENTS.length; j < szj; j++) {
							filteredPatients.push(m_patientController.getPatientById(reply.PATIENTS[j].PERSON_ID));
						}
					}
					numberOfReplies++;
				});

				numberOfCalls = numberOfCalls + 1;
			} else {
				param.LISTREQUEST.patients.push({person_id : patientsToFilter[i].PERSON_ID});
			}
		}
		function checkReply() {
			if(numberOfReplies == numberOfCalls) {
				var worklistItems = m_patientController.sortPatientData(filteredPatients);
				m_controller.showPatientsOnFilters(worklistItems);
			} else {
				setTimeout(function() {
					checkReply();
				},2000);
			}
		}

		checkReply();
	};

	this.createRankControl = function(defaultRank,id,fnCallback,disableRankPadding){
		var $newElement = $("<div class='rankContainer' data-rank-value='" + defaultRank + "'>").data("id",id);
		var sClass;
		if(disableRankPadding) {
			sClass = "rank noLeftPadding";
		} else {
			sClass = "rank blank";
			}
		for(var i=0; i<=5; i++) {	// 5 point rating plus blank reset target on left
			$newElement.append("<div class='" + sClass + "' data-rank-value='" + i +"'>");
				sClass = (i<defaultRank) ? "rank on" : "rank";
		}

		function setRank(rank){
			var children = $newElement.children("div.rank");
			for(var i=1; i<=5; i++){
				var $child = $(children[i]);
				var rankValue = $child.data('rank-value');
				if(rankValue<=rank){
					$child.addClass("on");
				}else{
					$child.removeClass("on");
				}
			}
		}
		$newElement.bind("setRank",function(e,value){
			$newElement.data('rank-value',value);
			setRank(value);
		});

		if(!disableRankPadding) {
				$newElement.children("div.rank").click(function(event){
				event.stopPropagation();
				var value = $(this).data('rank-value');
				if(value == $newElement.data('rank-value')){
					value--;
				}
				$newElement.data('rank-value',value);
				setRank(value);
				m_filter.onFilterModification();
			});
		}
		return $newElement;
	};
	this.setSinglePatientRank = function(rank,patId){
		var pat = [];
		if($.isArray(patId)) {
			for(var i = 0, selectedPatCnt = patId.length; i<selectedPatCnt;i++) {
				pat.push({person_id: parseFloat(patId[i]),rank: parseInt(rank,10),action_desc:"rank upgrade"});
			}
		} else {
			pat.push({person_id: parseFloat(patId),rank: parseInt(rank,10),action_desc:"rank upgrade"});
		}

		var patient_request = {patient_request:{patient_list_id: m_controller.getActivePatientListID(),patients:pat}};
		m_controller.makeCall("mp_dcp_update_static_patients",patient_request,true,function() {
			for(var p = 0, plen = pat.length; p < plen; p++) {
				m_patientController.setPatientProperty(pat[p].person_id,"RANK",rank);
			}
		},null,null,null,"rank");
	};
	this.doesValueMatch = function($inputObj, value) {
		return $inputObj.val() === value;
	};
	this.createSearchControl = function(){
		var bOrgSecOn = m_pvFrameworkLinkObj.GetPrefValue(0,"PROVIDER_ORG_FILTER_CONFIG") === "1";
		var $newSearchElem = $()
			.add($('<input type ="text" class="searchCtrlInput fullWidth"/>')
				.on('keyup focusin',null,m_controller.debounce(onInputChanged, m_controller.delayDuration)))
			.add($('<div class="searchCtrlList zeroHeight">'))
			.focusout(function(){
				if($(document.activeElement).closest($newSearchElem).length==0){
					$newSearchElem.filter("div.searchCtrlList").empty().height(0);
				}
			});

		return $newSearchElem;

		function onInputChanged(event){
			var $thisSearchInput = $(this),
				$thisSearchList = $(this).siblings('div.searchCtrlList'),
				sInput = $thisSearchInput.val();

			if(event.type === 'focusin') {
				if(sInput && $thisSearchList.height() <= 0) { // focusin
					$thisSearchInput.addClass('searching'); // Display the searching icon
					setTimeout(function(){initiateSearchAfterDelay(sInput);},400);
				}
			} else {
				if(sInput) { // keyup
					$thisSearchInput.addClass('searching'); // Display the searching icon
					setTimeout(function(){initiateSearchAfterDelay(sInput);},400);
				} else {
					$thisSearchInput.removeClass('searching');
					$thisSearchList.empty().height(0); // Hide the search list
				}
			}

			function initiateSearchAfterDelay(sOldInput){
				var sNewInput = $thisSearchInput.val(),
					request;
				if(sNewInput != sOldInput) {
					return;
				}

				request = {
					request: {
						max: 50,
						search_str: sNewInput,
						search_str_ind: 1,
						use_org_security_ind: bOrgSecOn ? 1 : 0
					}
				};
				m_controller.makeCall("mp_dcp_prsnl_search",request,false,function(reply) {
					$thisSearchInput.removeClass('searching'); // Remove the searching icon
					if(m_controller.doesValueMatch($thisSearchInput, sNewInput) === false) {
						return;
					}

					var names = reply.PRSNL || [],
						lhtml = '<div><select multiple="multiple">';

					$thisSearchInput.removeClass('searching'); // Remove the searching icon

					for(var i=0; i<names.length; i++){
						if(typeof names[i].NAME_FULL_FORMATTED !== 'string') {
							break;
						}
						lhtml += '<option value="' + names[i].PERSON_ID + '">' + names[i].NAME_FULL_FORMATTED.trim() + '</option>';
					}
					lhtml+="</select></div>";
					if(names.length > 0) {
						$thisSearchList.html(lhtml).height(
							$thisSearchList.find("select")
								.width($thisSearchInput.width())
								.attr({size:(names.length > 5) ? 5 : names.length,
										multiple:(names.length < 2) ? true : false})
								.on("change",null,function(e){
									$thisSearchList.empty().height(0);
									$thisSearchInput.val("").trigger("prsnlSelected",[$(e.target).find(":selected").val(),$(e.target).find(":selected").html()]);
								})
							.height()+4);
					} else {
						$thisSearchList.empty().height(0); // Hide the list if no results are returned for the current query.
					}
				},function(){ // fail condition
					$thisSearchInput.removeClass('searching');
					$thisSearchList.empty().height(0);
				});
			};
		}
	};
	this.fnMapSelectedDateValue = function(sSelectedVal) {
		var sReturnVal = '';
		switch(sSelectedVal) {
			case '0':
				sReturnVal = 'D';
			break;
			case '1':
				sReturnVal = 'W';
			break;
			case '2':
				sReturnVal = 'M';
			break;
			default:
				sReturnVal = '';
			break;
		}
		return sReturnVal;
	};
	this.handleHtmlMouseEvent = function(event){
		var $target = $(event.target);
		if(!$target.closest("div.filterToolbarDrop,div.wklPatientRow,div.worklistContentDiv,.handleRowSelection").length){
			if($("#divSaveBackground").length == 0) {
				if($target.is("#wklBodyDiv")){
					if((event.clientX - $target.offset().left) > $target[0].clientWidth){
						return;	// Click is in the scrollbar area
					}
				}
			}
			m_worklist.clearRowSelection();
		}
	};
	this.removeSelectedPatient = function(ID) {
		var indexOfPatient = $.inArray(ID, m_patientsSelected);
		if(indexOfPatient >= 0) {
			m_patientsSelected.splice(indexOfPatient, 1);
		}
	};
	this.handlePatientRowSelection = function(patientsSelected,selectionType){
		if(selectionType == "ctrl") {
			for(var i = 0, selectedPatientLength = m_patientsSelected.length; i < selectedPatientLength; i++) {
				if($.inArray(m_patientsSelected[i], patientsSelected) == -1) {
					patientsSelected.push(m_patientsSelected[i]);
				}
			}
		}

		m_patientsSelected = patientsSelected || [];

		var bEnableRemove = false;
		if(m_patientsSelected.length > 0){

			var removablePatients = m_patientController.getRemovablePatients();
			for(var i=0,len=m_patientsSelected.length; i<=len; i++){
				if(i==len){
					bEnableRemove = true;
				}else if($.inArray(parseFloat(m_patientsSelected[i]),removablePatients) < 0){
					bEnableRemove = false;
					break;
				}
			}
		}
		m_toolbar.enableButton("removePatient",bEnableRemove);
	};

	this.getPatientSelectedValue = function() {
		return m_patientsSelected;
	};
	this.arePatientsRemovable = function(patientsSelected){
		m_patientsSelected = patientsSelected || [];
		var removablePatients = m_patientController.getRemovablePatients();
		for(var i=0,len=m_patientsSelected.length; i<len; i++){
			if($.inArray(parseFloat(m_patientsSelected[i]),removablePatients) < 0){
				return false;
			}
		}
		return true;
	};
	function insertPatients(patients,callFrom,isAsync){
		if(!patients || patients.length <= 0){
			return;
		}

		var listID = m_controller.getActivePatientListID();
		var patient_request = {"patient_request":{
			"patient_list_id":listID,
			"patient_list_name": "",
			"owner_prsnl_id": parseFloat(m_controller.criterion.CRITERION.PRSNL_ID),
			"search_arguments": [],
			"patients": patients,
			"clear_arg_ind": 0,
			"clear_pat_ind": 0,
			"return_arg_ind": 0
		}};

		m_controller.makeCall('mp_dcp_upd_static_patients',patient_request,isAsync,function() {
			var firstVisibleRow = m_worklist.getFirstVisiblePatient();
			m_patientController.setBasePatientData(patients);

			var filterArguments = m_controller.getFilterChecks();
			var filteredPatients = m_controller.getFilteredPatients(filterArguments);
			m_patientsToCompare = filteredPatients;
			var filteredPatientsLength = filteredPatients.length;
			var previousPatientId = 0.0;
			for (var i=0;i<filteredPatientsLength;i++){
				var currentPatientId = filteredPatients[i].PERSON_ID;
				for (var j=0,patLength=patients.length; j<patLength; j++){
					if (patients[j].PERSON_ID == currentPatientId){
						if(callFrom == "add") {
							m_worklist.insertPatient(patients[j], previousPatientId, i);
						} else {
							m_worklist.insertPatient(patients[j], previousPatientId);
						}
						break;
					}
				}
				previousPatientId = currentPatientId;
			}
			m_worklist.setScrollPosition(firstVisibleRow);
			m_worklist.applyZebraStripes();

			var width = $("#wklExpandedView").width();
			if((width != null) && (width != 0) && (callFrom != "add"))
			{
				m_worklist.adjustGrayCovering();
			}
			var patientCount = m_patientController.getAllPatients().length;
			if (patientCount > 100) {
				m_columnLoadBatchSize = Math.ceil(patientCount / 4);
			}
			else {
				m_columnLoadBatchSize = patientCount;
			}
			m_controller.resetBatchCount();
			m_controller.loadNextColumnData('workItems', listID, m_columnLoadBatchSize, m_batch.IWORKITEMS);
			m_controller.loadNextColumnData("providerReltns", listID, m_columnLoadBatchSize, m_batch.PROVIDERRELTNS);
			m_controller.loadNextColumnData("encounters", listID, m_columnLoadBatchSize, m_batch.ENCOUNTERS);
			m_controller.loadNextColumnData("healthPlans", listID, m_columnLoadBatchSize, m_batch.HEALTHPLANS);
			m_controller.loadNextColumnData("conditions", listID, m_columnLoadBatchSize, m_batch.CONDITIONS);
			if(m_controller.getRiskFlag == 1 || m_controller.getMaraFlag() === 1) {
				m_controller.loadNextColumnData("risks", listID, m_columnLoadBatchSize, m_batch.RISKS);
			}

			if(callFrom == "delta" && patients.length > 0) {
				m_worklist.reloadPatientList();
			} else if(callFrom == "add" && patients.length == 1) {
				m_worklist.manageInsert();
			}
			m_controller.updatePatientCounts();
		});
	}
	function getHelp() {
		m_controller.createCheckpoint('USR:DWL-HELPLOAD', 'Start');
		CCLNEWSESSIONWINDOW('https://wiki.ucern.com/display/1101powerchartHP/Dynamic+Worklist+Help', '_blank', 'left=0,top=0,width=1200,height=700,status=no,toolbar=no,scrollbars=1,resizable =1', 0, 0);
		m_controller.createCheckpoint('USR:DWL-HELPLOAD', 'Stop', [{key: 'List ID', value: m_controller.getActivePatientListID()}]);
	}
	this.updateCurrentPatients = function(removablePatients) {
		for(var i = 0; i < removablePatients.length; i++) {
			for(var j = 0; j < m_patientsToCompare.length; j++) {
				if(m_patientsToCompare[j].PERSON_ID == removablePatients[i]) {
					m_patientsToCompare.splice(j, 1);
					break;
				}
			}
			for (var c = 0, clen = m_controller.m_currentlyDisplayedPatients.length; c < clen; c++) {
			    if (m_controller.m_currentlyDisplayedPatients[c].PERSON_ID == removablePatients[c]) {
			        m_controller.m_currentlyDisplayedPatients.splice(c, 1);
					break;
				}
			}
		}
	};
	this.removeAllPatients = function() {
		if ($('#filterTab').hasClass('expandViewShown') === true) {
		   m_controller.expandView(false);
		}
		m_patientsSelected = m_controller.returnRemovablePatients().slice();
		m_controller.removePatients(m_patientsSelected.length);
	};
	this.modifyRemovableCountText = function(removedCount) {
		if(removedCount > 0) {
				$('#filterPatientCountDiv')
					.add('#filterScrollDiv')
						.addClass('withRemovable');
				$('#displayRemovableCountDiv').show()
					.find('.removableImage').hide();
				$('#removableCountText1').text(i18n.rwl.REMOVEDQTEXT.replace('{0}',removedCount));
				$('#removableCountBold2')
					.add('#removableCountText2').text('');
		}
	};
	this.removePatients = function(patientCount) {
		m_controller.createCheckpoint("USR:DWL-REMOVEPATIENT", "Start");
		var patients = [];
		for(var i=0, len=m_patientsSelected.length; i<len; i++) {
			patients.push({
				person_id:parseFloat(m_patientsSelected[i]),
				remove_ind:1
			});
		}
		var patient_request = {patient_request:{patient_list_id: parseFloat(m_controller.getActivePatientListID()),patients:patients}};
		m_controller.makeCall("mp_dcp_update_static_patients",patient_request,true,function() {
			m_patientController.removePatientsById(m_patientsSelected);
			m_controller.updateCurrentPatients(m_patientsSelected);
			m_controller.clearPOI();
			m_worklist.manageRemoval(m_patientsSelected, patientCount);
			if(patientCount > 0) {
			    m_worklist.showPatientList(m_controller.m_currentlyDisplayedPatients, '', '', 1);
			}
			m_controller.updatePatientCounts(m_patientController.sortPatientData(m_controller.m_currentlyDisplayedPatients));
			if (m_controller.m_currentlyDisplayedPatients.length === 0) {
				$("#loadingMessage").remove(); //we are removing this spinner as we are still seeing that once we remove all the patients from the list.
				m_controller.setWorklistMessage(i18n.rwl.NOPERSON, true);
				$("#wklBodyFixed")
					.add("#wklBodyScroll")
					.add("#wklHeaderDiv").hide();
			}
			if(patientCount > 0) {
				m_controller.modifyRemovableCountText(patientCount);
			}
			m_controller.handlePatientRowSelection();
		},null,null,null,"remove");

		m_controller.audit("Dynamic Worklist", "Remove Patient");
		m_controller.createCheckpoint("USR:DWL-REMOVEPATIENT", "Stop", [{key: "Number of Patients", value: patients.length}, {key: "List ID", value: m_controller.getActivePatientListID()}]);
	};

	this.launchCreateDlg = function() {
		createList();
	};
	function createList(){
		m_filter.resetFilters();
		m_filter.updateModificationBuffer(2);
		m_search.showDialog(null);
	}
	function modifyList(){
		m_filter.resetFilters();
		var currentSearchArg = m_filter.getCurrentListSearchArguments();
		var argContentArr = { AGE: [], ADMISSION: [], DISCHARGE: [], CONDITION: [], ORDERSTATUS: [], RESULTFILTER1: [], RESULTFILTER2: [], RESULTFILTER3: [], RESULTFILTER4: [], RESULTFILTER5: [], EXPECTATIONS: [], ENCOUNTERTYPE: [], LOCATIONS: []};
		for(var i =0,len=currentSearchArg.length;i < len;i++){
			var individualElement = currentSearchArg[i];
			var strArgName = individualElement.ARGUMENT_NAME;
			if(strArgName.match(/^MED[0-9]{1,2}_/)){
				argContentArr.ORDERSTATUS.push(individualElement);
			}
			else if(strArgName.indexOf("RESULT1_") > -1 || strArgName.indexOf("RESULT2_") > -1 || strArgName.indexOf("RESULT3_") > -1){
				argContentArr.RESULTFILTER1.push(individualElement);
			}
			else if(strArgName.indexOf("RESULT4_") > -1 || strArgName.indexOf("RESULT5_") > -1 || strArgName.indexOf("RESULT6_") > -1){
				argContentArr.RESULTFILTER2.push(individualElement);
			}
			else if(strArgName.indexOf("RESULT7_") > -1 || strArgName.indexOf("RESULT8_") > -1 || strArgName.indexOf("RESULT9_") > -1){
				argContentArr.RESULTFILTER3.push(individualElement);
			}
			else if(strArgName.indexOf("RESULT10_") > -1 || strArgName.indexOf("RESULT11_") > -1 || strArgName.indexOf("RESULT12_") > -1){
				argContentArr.RESULTFILTER4.push(individualElement);
			}
			else if(strArgName.indexOf("RESULT13_") > -1 || strArgName.indexOf("RESULT14_") > -1 || strArgName.indexOf("RESULT15_") > -1){
				argContentArr.RESULTFILTER5.push(individualElement);
			}
			else if(strArgName.match(/^ADMISSION/)){
				argContentArr.ADMISSION.push(individualElement);
			}
			else if(strArgName.match(/^DISCHARGE/)){
				argContentArr.DISCHARGE.push(individualElement);
			}
			else if(strArgName.match(/^AGE(GREATER|LESS|EQUAL|FROM|TO|DAYS|WEEKS|MONTHS|YEARS)/)){
				argContentArr.AGE.push(individualElement);
			}
			else if(strArgName.match(/^RECOMMSTATUS$/)){
				argContentArr.EXPECTATIONS.push(individualElement);
			}
			else if(strArgName.match(/^CONDITION/)) {
				argContentArr.CONDITION.push(individualElement);
			}
			else if(strArgName.match(/^LOCATION/)) {
				argContentArr.LOCATIONS.push(individualElement)
			}
			else if(!argContentArr[strArgName]){
				argContentArr[strArgName] = [];
				argContentArr[individualElement.ARGUMENT_NAME] = [individualElement];
			}
			else{
				argContentArr[individualElement.ARGUMENT_NAME].push(individualElement);
			}
		}

		var list = m_controller.getActiveList();
		var bProxy = (list.OWNER_ID != m_controller.getCriterion().CRITERION.PRSNL_ID);
		m_search.showDialog(argContentArr, list.PATIENT_LIST_NAME, list.PATIENT_LIST_ID, bProxy);
	}

	function launchCustomize() {
		var $customizeDialog = m_customizeDialog.getDialog();
		$("body").prepend($("<div id='rwCustomizeDlgBackground' class='rwDlgBackground overlayDimmed'>"), $customizeDialog);
		$customizeDialog.show();
	}
	function launchShare() {
		var $shareDialog = m_shareDialog.getDialog();
		$("body").prepend($("<div id='rwShareDlgBackground' class='rwDlgBackground overlayDimmed'>"), $shareDialog);
		$shareDialog.show();
	}
	function launchGenComm() {
		function fnClearGenCommMessages() {
	        	m_controller.clearSpecificMessages('.genComm');
	    	}

		m_controller.enableGenCommButton(false);
		m_genCommDialog.launch(m_controller.getActiveList().PATIENT_LIST_NAME, getGenCommPatients());
		m_genCommDialog.oInitatePrintProcess
			.done(fnClearGenCommMessages, fnGenCommCompleted)
			.fail(fnClearGenCommMessages, fnShowGenCommPrintErrorMessage, fnShowGenCommIncompleteMessage);
	}
	function fnGenCommCompleted(oGenCommState) {
		if(oGenCommState.bMessagesSent === false){
			fnShowGenCommPortalErrorMessage();
		}
		if(oGenCommState.bPhoneCallsCompleted === true && oGenCommState.bMessagesSent === true) {
			fnShowGenCommCompletedMessage(oGenCommState);
		}
		else {
			fnShowGenCommIncompleteMessage(oGenCommState);
		}

	}
	function fnShowGenCommCompletedMessage(oGenCommState) {
		m_controller.clearSpecificMessages('.genComm');
		var sListName = m_controller.getActiveList().PATIENT_LIST_NAME,
			sSubjectText = oGenCommState.sSubjectText;
		m_controller.fnAddGenCommInfoMessage(i18n.genComm.S_GENERATE_COMMUNCATION_COMPLETED
				.replace('{0}', sSubjectText)
				.replace('{1}', sListName));
	}
	function fnShowGenCommIncompleteMessage(oGenCommState) {
		var sListName = m_controller.getActiveList().PATIENT_LIST_NAME,
			sSubjectText = oGenCommState.sSubjectText;
		m_controller.fnAddGenCommWarningMessage(i18n.genComm.S_GENERATE_COMMUNCATION_INCOMPLETE
				.replace('{0}', sSubjectText)
				.replace('{1}', sListName));
	}
	function fnShowGenCommPrintErrorMessage(oGenCommState) {
		m_controller.clearSpecificMessages('.genComm');
		var sNumberOfLetters = (oGenCommState.oGenCommBuckets.aoLetters || []).length,
			sMessage = i18n.genComm.S_GEN_COMM_PRINT_ERROR.replace('{0}', sNumberOfLetters);
		m_controller.fnAddGenCommErrorMessage(sMessage);
	}
	function fnShowGenCommPortalErrorMessage() {
		var sMessage = i18n.genComm.S_GEN_COMM_PORTAL_ERROR;
		m_controller.clearSpecificMessages('.genComm');
		m_controller.fnAddGenCommErrorMessage(sMessage);
	}
	function getGenCommPatients() {
		var patients = [];
		var expandedViewPatId = m_worklist.getExpandViewPatientId();

		if(expandedViewPatId > 0) {
			patients.push(m_patientController.getPatientById(expandedViewPatId));
		}
		else if(m_patientsSelected.length > 0) {
			var len = m_patientsSelected.length;
			for(var p = 0; p < len; p++) {
				patients.push(m_patientController.getPatientById(m_patientsSelected[p]));
			}
		}
		else {
		    patients = m_controller.m_currentlyDisplayedPatients;
		}

		return patients;
	}
    function exportPatientSummary() {
		m_controller.fnLogCapabilityTimer('CAP:MPG DWL Launch Data Export');
        var selectedPatients = m_controller.getPatientSelectedValue();
        var selectedPatientsLength = selectedPatients.length;
        var currentlyDisplayedPatients = m_controller.m_currentlyDisplayedPatients.slice(0);
        var currentlyDispPatientsLength = currentlyDisplayedPatients.length;
        var numberOfPatientsToExport = 0;
        var eDataExportPopUpDialog = 1;

            var param = { 'criterion': { 'prsnl_id': m_controller.getCriterion().CRITERION.PRSNL_ID, 'patient_person_ids': [] } };
            var nonSelectedSinglePatientId;
            if (selectedPatientsLength > 0) {
                for (var i = 0; i < selectedPatientsLength; i++) {
                    param.criterion.patient_person_ids.push({ 'person_id': parseFloat(selectedPatients[i]) });
                }
                numberOfPatientsToExport = selectedPatientsLength;
            } else {
                if (currentlyDispPatientsLength === 1) {
                    nonSelectedSinglePatientId = currentlyDisplayedPatients[0].PERSON_ID;
                }
                for (var j = 0; j < currentlyDispPatientsLength; j++) {
                    param.criterion.patient_person_ids.push({ 'person_id': currentlyDisplayedPatients[j].PERSON_ID });
                }
                numberOfPatientsToExport = currentlyDispPatientsLength;
            }
            var reportName = 'mp_pie_driver_data_export';
            var jsonCriterion = param ? JSON.stringify(param).replace(/(_id":|_cd":)'?([^,'}]*)'?/ig, '$1$2.0') : '';
            var reportParam = '^MINE^,^' + jsonCriterion + '^';
            try {
                if (DWL_Utils.isNullOrUndefined(m_pvFrameworkLinkObj) === false) {
                    m_pvFrameworkLinkObj.SetPopupStringProp('REPORT_NAME', reportName);
                    m_pvFrameworkLinkObj.SetPopupStringProp('REPORT_PARAM', reportParam);
                    m_pvFrameworkLinkObj.SetPopupBoolProp('SHOW_BUTTONS', 0);
                    m_pvFrameworkLinkObj.SetPopupLongProp('DLG_TYPE', eDataExportPopUpDialog);
                    m_pvFrameworkLinkObj.SetPopupBoolProp('CAN_AUTO_CLOSE', 0);
                    m_pvFrameworkLinkObj.SetPopupBoolProp('MODELESS', 1);
                    if (numberOfPatientsToExport === 1) {
                        if(selectedPatientsLength === 0) {
                            m_worklist.selectSinglePatient(nonSelectedSinglePatientId);
                        }
                        m_pvFrameworkLinkObj.SetPopupBoolProp('SHOW_DEMOG_BAR', 1);
                        m_pvFrameworkLinkObj.SetPopupStringProp('DLG_TITLE', i18n.rwl.DATAEXPORTDLGTITLESINGLEPATIENT);
                        m_pvFrameworkLinkObj.SetPopupStringProp('VIEW_CAPTION', i18n.rwl.DATAEXPORTDLGTITLESINGLEPATIENT);
                    } else {
                        m_pvFrameworkLinkObj.SetPopupBoolProp('SHOW_DEMOG_BAR', 0);
                        m_pvFrameworkLinkObj.SetPopupStringProp('DLG_TITLE', i18n.rwl.DATAEXPORTDLGTITLEMULTIPATIENT.replace('{0}', numberOfPatientsToExport));
                        m_pvFrameworkLinkObj.SetPopupStringProp('VIEW_CAPTION', i18n.rwl.DATAEXPORTDLGTITLEMULTIPATIENT.replace('{0}', numberOfPatientsToExport));
                    }
                    m_pvFrameworkLinkObj.LaunchPopup();
                }
            } catch (err) {
                m_controller.logErrorMessages('', JSON.stringify(err), 'exportPatientSummary');
            }
    }
	function exportList(){
		m_controller.createCheckpoint("USR:DWL-EXPORTLIST", "Start");
		var activeList = m_filter.getActiveList();
		var listName = activeList.PATIENT_LIST_NAME.replace(/[^\w\s]/gi, ' '); //Replace any special characters with white space.
		var listId = activeList.PATIENT_LIST_ID;
		var patientsToSave = m_controller.m_currentlyDisplayedPatients.slice(0);
		var strExport = m_patientController.getExportListString(patientsToSave,m_worklist.getCurrentColData());

		try{
			var strPath = m_pvFrameworkLinkObj.SaveStringToTempFile(listName+".csv", strExport);
			m_controller.audit("Dynamic Worklist", "Export Worklist");
			if(strPath){
				window.open(strPath,"_blank","height=1,width=1,left =5000,top = 5000");
			}
		} catch(err) {
		} finally {
			m_controller.createCheckpoint("USR:DWL-EXPORTLIST", "Stop", [{key: "List ID", value: listId}, {key: "Number of Patients", value: patientsToSave.length}]);
		}
	}
	this.exportLogData = function() {
		try {
			var curDate = new Date();
			var strExport = $("#blackbird").find(".mainBody").text();
			var strPath = m_pvFrameworkLinkObj.SaveStringToTempFile("DWL_LOG_"+Date.parse(curDate)+".log", strExport);
			if(strPath){
				window.open(strPath,"_blank");
			}
		} catch(err) {
		}
	};
	function addPatient(){
		var patientSearch = window.external.DiscernObjectFactory("PVPATIENTSEARCHMPAGE");
		var searchResult = patientSearch.SearchForPatientAndEncounter();
		m_controller.createCheckpoint("USR:DWL-ADDPATIENT", "Start");

		var listId = m_controller.getActivePatientListID();
		var personId = parseFloat(searchResult.PersonId);
		var metaData = [
			{key: "List ID", value: listId},
			{key: "Person ID", value: personId}
		];
		var encounterId = parseFloat(searchResult.EncounterId);
		var patient = m_patientController.getPatientById(personId);
		if(personId <= 0 || patient){
			m_controller.createCheckpoint("USR:DWL-ADDPATIENT", "Stop", metaData);
			if(patient) {
				m_controller.addDisplayMessage("info", i18n.rwl.PATIENTALREADYEXISTS.replace("{34}", patient.NAME_FULL_FORMATTED), "specific", m_controller.staticContentPath + "/images/5104_16.png", "man");
			}
			return;
		}

		var request = {
			demog_request:{patients:[{person_id:personId}]}
		};
		m_controller.makeCall('mp_dcp_retrieve_demog_info',request,false,function(reply){
			insertPatients(reply.PATIENTS,'add',false);
			if($("#fuzzySearchInput").val() != "") {
				m_retainFuzzySearch = true;
				$("#fuzzySearchInput").keyup();
			}
			var deltareq = {'listrequest':{
				'patient_list_id':0.0,
				'patient_id':personId,
				'arguments':m_filter.getCurrentListSearchArguments(),
				'delta_identifier':0,
				'pos_cd':m_controller.getCriterion().CRITERION.POSITION_CD
			}};

			m_controller.makeCall('mp_dcp_get_patient_delta',deltareq,false,function(reply){
				if(reply.PATIENTS_DEL.length==1 && reply.PATIENTS_DEL[0].PERSON_ID==personId){
					if(m_patientController.getPatientById(personId) !== undefined) {
						m_patientController.getPatientById(personId).disqualify = reply.PATIENTS_DEL[0].DISQUALIFY_ARGUMENT;
					}
					m_patientController.markPatientsAsRemovable([personId]);
					m_worklist.addFilteredOutPatientId(personId);
					m_controller.updatePatientCounts(m_controller.currentlyDisplayedPatients());
				}
			});

			m_controller.audit("Dynamic Worklist", "Add Patient");
			m_controller.createCheckpoint("USR:DWL-ADDPATIENT", "Stop", metaData);
		}, function() {m_controller.createCheckpoint("USR:DWL-ADDPATIENT", "Fail", metaData);});
	}
	this.setPatientProperty = function(patientId, property, value) {
		m_patientController.setPatientProperty(patientId, property, value);
	};
	this.updateCommentInd = function(personId,data) {
		m_worklist.updateCommentInd(personId,data);
	};
	this.getCommentsById = function(personId) {
		return m_worklist.getCommentsById(personId);
	};

	this.makeCall = function(program, params, async, callback, callbackFail, cbObj, listId, callingFunction){
		var returnValue="";
		var sParams = (params) ? JSON.stringify(params).replace(/(_id":|_cd":)"?([^,"}]*)"?/ig,"$1$2.0") : "";
		m_controller.logRequests(program,params);
		var info = new XMLCclRequest();
		info.onreadystatechange = function(){
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = json_parse(info.responseText);
					var recordData = jsonEval.REPLY || jsonEval.LOC_REPLY;
					if (recordData.STATUS_DATA.STATUS == "S" ||
						recordData.STATUS_DATA.STATUS == "Z") {
						returnValue = recordData;
						m_controller.logReplies(program,returnValue);
						if(callback){
							if(cbObj){
								var cbAr = [m_controller,m_worklist,m_filter];
								callback.call(cbAr[cbObj-1],returnValue,listId);
							}
							else{
								callback(returnValue,listId);
							}
						}
					}
					else {
						m_controller.logErrorMessages(program,JSON.stringify(recordData.STATUS_DATA),"MAKECALL");
						var errMessage = "";
						var classifier = "specific";
						switch(program) {
							case "mp_dcp_rwl_bedrock_prefs":
								errMessage = i18n.rwl.BEDROCKERRMESSAGE;
								classifier = "bedrockprefs";
								break;
							case "mp_dcp_get_pl_wrapper":
								if(callingFunction == "create") {
									errMessage = i18n.rwl.CREATELISTERRMESSAGE;
								}
								else {
									errMessage = i18n.rwl.RETRIEVEDATAERRMESSAGE;
									classifier = "nonspecific";
								}
								break;
							case "mp_dcp_get_patient_delta":
								errMessage = i18n.rwl.RETRIEVEDATAERRMESSAGE;
								break;
							case "mp_dcp_load_static_list":
								errMessage = i18n.rwl.RETRIEVEDATAERRMESSAGE;
								classifier = "loadstaticlist";
								break;
							case "mp_dcp_update_static_patients":
								if(callingFunction == "rank") {
									errMessage = i18n.rwl.RANKERRMESSAGE;
								}
								else if(callingFunction == "remove") {
									errMessage = i18n.rwl.REMOVEERRMESSAGE;
								}
								break;
							case "mp_dcp_upd_static_patients":
								errMessage = i18n.rwl.UPDATELISTERRMESSAGE;
								break;
							case "mp_dcp_sticky_note_wrapper":
								if(callingFunction == "action") {
									errMessage = i18n.rwl.ACTIONCOMMENTERRMESSAGE;
								}
								else if(callingFunction == "display") {
									errMessage = i18n.rwl.DISPLAYCOMMENTERRMESSAGE;
								}
								break;
							case "mp_dcp_upd_patient_list":
								classifier = "updpatientlist";
								if(callingFunction == "sort") {
									errMessage = i18n.rwl.SORTERRMESSAGE;
								}
								else if(callingFunction == "custcol") {
									errMessage = i18n.rwl.CUSTCOLERRMESSAGE;
								}
								else if(callingFunction == "resize") {
									errMessage = i18n.rwl.UNABLETOSAVEERRMESSAGE;
								}
								else if(callingFunction == "delete") {
									errMessage = i18n.rwl.DELETEERRMESSAGE;
								}
								else if(callingFunction == "rename") {
									errMessage = i18n.rwl.RENAMEERRMESSAGE;
								}
								break;
							case "mp_dcp_get_encounter":
								errMessage = i18n.rwl.ENCOUNTERERRMESSAGE;
								break;
							case "mp_dcp_result_options":
								errMessage = i18n.rwl.RESULTSERRMESSAGE;
								break;
							case "mp_dcp_get_drug_options":
								errMessage = i18n.rwl.MEDSERRMESSAGE;
								break;
								break;
							case "mp_dcp_retrieve_demog_info":
								errMessage = i18n.rwl.RETRIEVEDEMOGERRMESSAGE;
								break;

							case "dcp_acm_retrieve_filter_values":
								errMessage = i18n.rwl.FILTVALERRMESSAGE;
								classifier = "filtervalues"
								break;
						}
						if(errMessage.length > 0) {
							m_controller.addDisplayMessage("err", errMessage, classifier, m_controller.staticContentPath + "/images/6275_16.png","man");
							m_controller.setWorklistMessage(i18n.rwl.PROCESSING,false);
							m_controller.setWorklistMessage(i18n.rwl.NOPERSON, false);
						}
						if(callbackFail) {
							callbackFail(recordData,listId);
						}
						return;
					}
				}
				catch (err) {
					m_controller.logErrorMessages(program,JSON.stringify(err),"MAKECALL");
					if(callbackFail) {
						callbackFail(recordData,listId);
					}
				}
				finally {
					info = null;
				}
			}
			else {
				if (info.readyState == 4 && info.status != 200) {
					m_controller.logErrorMessages(program,"","MAKECALL");
					if(callbackFail) {
						callbackFail(recordData,listId);
					}
				}
			}
		};
		info.open('GET', program, async);
		var paramString = "MINE";
		var lenParams = sParams.length;
		if(lenParams > 32000){  // may exceed max char length
			info.setBlobIn(sParams);
		}else if(lenParams > 0){
			if (program == "mp_dcp_generate_communication") {
				paramString = "'MINE','" + sParams + "'";
			}
			else {
				paramString = "^MINE^,^" + sParams + "^";
			}
		}
		if(program.match(scriptBoundToCpmScriptRegex)){
			info.requestBinding = 'CpmScriptBatch';
		}
		info.send(paramString);
		return returnValue;
	};
	this.updateDeltaPatients = function(listID, listArguments){
		m_controller.addDisplayMessage("info", i18n.rwl.DELTARUNNING, "delta", m_controller.staticContentPath + "/images/6439_16_darker.gif","auto");
		m_numDelta++;
		var listrequest = {'listrequest':{
			'patient_list_id':listID,
			'patient_id':0.0,
			'pos_cd':m_controller.getCriterion().CRITERION.POSITION_CD,
			'arguments':listArguments,
			'delta_identifier': m_numDelta
		}};

		m_controller.makeCall("mp_dcp_get_patient_delta",listrequest,true,function(reply){
			if(m_numDelta == reply.DELTA_IDENTIFIER) {
				insertPatients(reply.PATIENTS,'delta',true);
				var markedPatientsCount = 0;
				var removeLength = reply.PATIENTS_DEL.length;
				if(removeLength > 0) {
					var removePatientIds = [];
					for(var i=0;i<removeLength;i++){
						var id = reply.PATIENTS_DEL[i].PERSON_ID;
						removePatientIds.push(id);
						if(m_patientController.getPatientById(id) !== undefined) {
							m_patientController.getPatientById(id).disqualify = reply.PATIENTS_DEL[i].DISQUALIFY_ARGUMENT;
						}
					}
					m_patientController.markPatientsAsRemovable(removePatientIds);
				}

				var filters = m_filter.getFilterChecks();
				if(JSON.stringify(filters).indexOf("QUALIFYING") > -1) {
					var worklistItems = m_controller.getFilteredPatients(filters);
					var sortCriteria = m_filter.getDefaultSortCriteria(listID);
					m_controller.setWorklistMessage(i18n.rwl.PROCESSING,false);
					m_worklist.redrawPatientList(worklistItems,sortCriteria);
				}
				m_controller.updatePatientCounts();
				m_worklist.stopDeltaCheck();
				if(m_filter.listAutoRemove > 0) {
					m_controller.removeAllPatients();
				}
			}
		},function() {
			m_controller.clearSpecificMessages(".delta");
		});
	};

	this.showListGenerating = function(bShow){
		if(bShow) {
			m_controller.addDisplayMessage("info", i18n.rwl.CREATINGLIST, "create", m_controller.staticContentPath + "/images/6439_16_darker.gif","auto");
		}
		else {
			m_controller.clearSpecificMessages(".create");
		}
		this.bIsGenerating = bShow;
	};
}
ACM_Controller.inherits(MPageComponent);

(function($){

$.fn.disableSelection = function() {
	return this.each(function() {
		$(this).attr('unselectable', 'on')
			   .css({
				   '-moz-user-select':'none',
				   '-webkit-user-select':'none',
				   'user-select':'none',
				   '-ms-user-select':'none'
			   })
			   .each(function() {
				   this.onselectstart = function() { return false; };
			   });
	});
};

})(jQuery);


function CustomizeDialog(controller) {
	var $dialog = $();
	var colDataObj = controller.getCurrentColData();
	controller.addMousedownFunction(function($target) {
		if($target.is(".colRow") || $target.is(".colLeft") || $target.is(".colCheck") || $target.is("#colUp") || $target.is("#colDown")) {
			return;
		}
		$("#custColumnsList").find(".selected").removeClass("selected");
		$("#colUp").attr("disabled","disabled").addClass("disabled");
		$("#colDown").attr("disabled","disabled").addClass("disabled");
	});
	create();
	this.getDialog = function() {
		colDataObj = controller.getCurrentColData();
		$("#custColumnsList").empty().append(createColTable());
		return $dialog;
	};
	function create() {
		$dialog = $("<div id='custDlg' class='rwDlg'>");
		$dialog.append($("<div id='custDlgHeader' class='dlgHeader'>")
							.append("<span>" + i18n.rwl.CUSTOMIZECOLS + "</span>"),
							$("<div id='custDlgContent' class='rwDlgContent'>")
								.append(buildColumns(),
										buildControls()),
							$("<div id='custDlgFooter' class='rwDlgFooter'>")
								.append($("<input id='custReset' type='button' value='" + i18n.rwl.RESETTODEFAULTS + "' class='reset rwSearchDlgBtn shareButton'/>"),
										$("<input id='custCancel' class='cancel rwSearchDlgBtn shareButton' type='button' value='" + i18n.rwl.CANCEL + "'/>"),
										$("<input id='custSave' type='button' disabled='disabled' value='" + i18n.rwl.SAVE + "' class='save rwSearchDlgBtn shareButton'/>"))
								.on("click", "input", function() {
									controller.createCheckpoint("USR:DWL-CUSTOMIZE.COLUMN", "Start");
									var actId = $(this).attr("id")||"";
									if(actId == "custSave") {
										controller.updateColumnPrefs($.extend(true,{},colDataObj), true, "custcol");
									}
									else if(actId == "custReset") {
										controller.updateColumnPrefs({}, true, "custcol");
										colDataObj = controller.getColDefaults();
										$("#custColumnsList").empty().append(createColTable());
									}
									else if(actId == "custCancel") {
										colDataObj = controller.getCurrentColData();
										$("#custColumnsList").empty().append(createColTable());
									}
									$("#custSave").attr("disabled","disabled");
									$("#custDlg").add("#rwCustomizeDlgBackground").hide();
									controller.createCheckpoint("USR:DWL-CUSTOMIZE.COLUMN", "Stop", [{key: "List ID", value: m_controller.getActivePatientListID()}]);
								}));
	}
	function buildColumns() {
		var $columns = $("<div id='custColumnsList'>")
							.append(createColTable())
							.on("click", "div", function() {
								if($(this).attr("id") == "custColRows" || $(this).hasClass("custHeader") || $(this).hasClass("colLeft")) {
									return;
								}
								$(this).toggleClass("selected");
								var $list = $("#custColumnsList");
								$list.find(".colRow").not($(this)).removeClass("selected");
								if($list.find(".selected").length > 0) {
									if($(this).prev().length > 0) {
										$("#colUp").removeAttr("disabled").removeClass("disabled");
									}
									else {
										$("#colUp").attr("disabled", "disabled").addClass("disabled");
									}
									if($(this).next().length > 0) {
										$("#colDown").removeAttr("disabled").removeClass("disabled");
									}
									else {
										$("#colDown").attr("disabled", "disabled").addClass("disabled");
									}
								}
								else {
									$("#colUp").attr("disabled","disabled").addClass("disabled");
									$("#colDown").attr("disabled","disabled").addClass("disabled");
								}
							})
							.on("click", "input", function(e) {
								var $row = $(this).parents(".colRow");
								if(!($row.hasClass("selected"))) {
									$row.addClass("selected");
									$("#custColumnsList").find(".colRow").not($row).removeClass("selected");
									if($row.prev().length > 0) {
										$("#colUp").removeAttr("disabled").removeClass("disabled");
									}
									else {
										$("#colUp").attr("disabled", "disabled").addClass("disabled");
									}
									if($row.next().length > 0) {
										$("#colDown").removeAttr("disabled").removeClass("disabled");
									}
									else {
										$("#colDown").attr("disabled", "disabled").addClass("disabled");
									}
								}
								var title = $(this).parents(".colRow").find(".colTitle").text();
								if($(this).attr("checked") == "checked") {
									updateDisplay(true, title);
								}
								else {
									updateDisplay(false, title);
								}
								$("#custSave").removeAttr("disabled");
								e.stopPropagation();
							});
		return $columns;
	}
	function createColTable() {
		var colData = colDataObj.columns;
		var colString = "";
		var color = "white";
		colString = "<div id='custColHeaders' class='custHeader'>" +
					"<div id='custShowHide' class='custHeader'>" + i18n.rwl.SHOW + "</div>" +
					"<div id='custColName' class='custHeader'>" + i18n.rwl.CUSTCOLTITLE + "</div></div>";
		colString += "<div id='custColRows'>";
		for(var c = 2, clen = colData.length; c < clen; c++) {
			col = colData[c];
			if(color == "white") {
				colString += "<div id='colRow" + c + "' class='colRow zebra-white'>";
				color = "blue";
			}
			else {
				colString += "<div id='colRow" + c + "' class='colRow zebra-blue'>";
				color = "white";
			}
			if(col.display) {
				colString += "<div class='colShowHide colLeft'><input id='colShow" + c + "' class='colCheck' checked='checked' type='checkbox'/></div>";
			}
			else {
				colString += "<div class='colShowHide colLeft'><input id='colShow" + c + "' class='colCheck' type='checkbox'/></div>";
			}
			colString += "<div class='colTitle colLeft'>" + col.title + "</div></div>";
		}
		colString += "</div>";
		return colString;
	}
	function updateDisplay(display, title) {
		var columns = colDataObj.columns;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			var col = columns[c];
			if(col.title == title) {
				col.display = display;
				break;
			}
		}
	}
	function buildControls() {
		var $controls = $("<div id='custColControls'>")
							.append($("<div><input id='colUp' disabled='disabled' class='disabled' type='button'/></div>"),
									$("<div><input id='colDown' class='disabled' disabled='disabled' type='button'/></div>"))
							.on("click", "input", function() {
								var id = $(this).attr("id");
								if(id == "colUp") {
									moveRowUp();
									if($("#custColumnsList").find(".selected").prev().length === 0) {
										$(this).attr("disabled", "disabled").addClass("disabled");
									}
									if($("#custColumnsList").find(".selected").next().length !== 0) {
										$("#colDown").removeAttr("disabled").removeClass("disabled");
									}
								}
								else if(id == "colDown") {
									moveRowDown();
									if($("#custColumnsList").find(".selected").next().length === 0) {
										$(this).attr("disabled", "disabled").addClass("disabled");
									}
									if($("#custColumnsList").find(".selected").prev().length !== 0) {
										$("#colUp").removeAttr("disabled").removeClass("disabled");
									}
								}
								recolorRows();
								$("#custSave").removeAttr("disabled");
							});
		return $controls;
	}
	function moveRowUp() {
		var $row = $("#custColumnsList").find(".selected");
		var colName = $row.find(".colTitle").text();
		var $prevRow = $row.prev();
		$row.remove();
		$row.insertBefore($prevRow);
		var columns = colDataObj.columns;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			var col = columns[c];
			if(col.title == colName) {
				columns.splice(c-1, 0, col);
				columns.splice(c+1, 1);
				break;
			}
		}
	}
	function moveRowDown() {
		var $row = $("#custColumnsList").find(".selected");
		var colName = $row.find(".colTitle").text();
		var $nextRow = $row.next();
		$row.remove();
		$row.insertAfter($nextRow);
		var columns = colDataObj.columns;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			var col = columns[c];
			if(col.title == colName) {
				columns.splice(c+2, 0, col);
				columns.splice(c, 1);
				break;
			}
		}
	}
	function recolorRows() {
		var color = "white";
		$("#custColumnsList").find(".colRow").each(function() {
			$(this).removeClass("zebra-white zebra-blue");
			if(color == "white") {
				$(this).addClass("zebra-white");
				color = "blue";
			}
			else {
				$(this).addClass("zebra-blue");
				color = "white";
			}
		});
	}
}
function ShareDialog(workGroups, controller) {
	var $dialog = $();
	var groups = workGroups;
	var newProxies = {};
	var updProxies = {};
	var pvFrameworkLinkObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
	var bOrgSecOn = pvFrameworkLinkObj.GetPrefValue(0,"PROVIDER_ORG_FILTER_CONFIG") === "1";
	var maxTimeValues = {"days":546,"weeks":78,"months":18};
	create();

	controller.addMousedownFunction(function($target) {
		if($target.is(".proxyName") || $target.is(".proxyEnd") || $target.is("#shareRemove")) {
			return;
		}
		$("#shareListRows").find(".selected").removeClass("selected");
		enableRemoveButton(false);
	});

	this.getDialog = function() {
		getProxies();
		return $dialog;
	};

	function create() {
		$dialog = $("<div id='shareDlg' class='rwDlg'>");
		$dialog.append($("<div id='shareDlgHeader' class='dlgHeader'>")
							.append("<span>" + i18n.rwl.SHARELIST + "</span>"),
							$("<div id='shareDlgContent' class='rwDlgContent'>")
								.append(buildControls(),
										buildList()),
							$("<div id='shareDlgFooter' class='rwDlgFooter'>")
								.append($("<input id='shareClose' class='close rwSearchDlgBtn shareButton' type='button' value='" + i18n.rwl.CLOSE + "'/>"),
										$("<input id='shareRemove' type='button' disabled='disabled' value='" + i18n.rwl.REMOVE + "' class='remove rwSearchDlgBtn shareButton'/>"),
										$("<input id='shareAdd' type='button' disabled='disabled' value='" + i18n.rwl.ADD + "' class='add rwSearchDlgBtn shareButton'/>"))
									.on("click", "input", function($target) {
										if($(this).hasClass("add")) {
											addProxy();
										}
										else if($(this).hasClass("remove")) {
											removeProxy();
										}
										else if($(this).hasClass("close")) {
											m_controller.audit("Dynamic Worklist","Share Worklist");
											var listrequest = {
												listrequest: {
													patient_list_id: controller.getActivePatientListID(),
													proxy_ind: 1,
													proxies: []
												}
											};
											for(var key in newProxies) {
												if(newProxies[key].length !== 0) {
													listrequest.listrequest.proxies.push(newProxies[key]);
												}
											}
											controller.updateProxies(updProxies);
											newProxies = {};
											updProxies = {};
											$("#shareDlg").hide();
											$("#rwShareDlgBackground").hide();
											clearControls();
											$("#providerRadio").attr("checked", "checked").click();
											controller.makeCall("mp_dcp_upd_patient_list",listrequest,true);
										}
									}));
	}

	function getProxies() {
		$dialog.find("#shareListRows").empty();
		var proxies = controller.getProxies(controller.getActivePatientListID());
		updProxies = proxies;
		var date;
		var name = "";
		for(var p = 0, plen = proxies.length; p < plen; p++) {
			var proxy = proxies[p];
			if(proxy.END_EFFECTIVE_DT_TM.length > 10) {
				date = convertSQLDateStringToJS(proxy.END_EFFECTIVE_DT_TM);
			}
			else {
				date = proxy.END_EFFECTIVE_DT_TM;
			}
			if(proxy.PRSNL_NAME) {
				name = proxy.PRSNL_NAME;
			}
			else {
				name = proxy.PRSNL_GROUP_NAME;
			}
			var $newRow = $("<div id='proxyRow" + p + "' class='proxyRow'>");

			$newRow.append($("<span id='proxyName" + p + "' class='proxyName'></span>").text(name),
							$("<span id='proxyEnd" + p + "' class='proxyEnd'>" + date.format(i18n.rwl_lc.fulldate4yr) + "</span>"));

			var $rows = $dialog.find("#shareListRows");
			$rows.append($newRow).addClass("showBorder");
			recolorRows($rows);
			newProxies[name] =
				{
					prsnl_id: proxy.PRSNL_ID,
					prsnl_group_id: proxy.PRSNL_GROUP_ID,
					end_date: date.format("shortDate2").replace(/\//g, "")
				};
		}
	}

	function buildControls() {
		var selectContent = [];
		selectContent.push("<select id='groupSelect' disabled='disabled'>");
		selectContent.push("<option value='-1'></option>");
		for(var g = 0, glen = groups.length; g < glen; g++) {
			selectContent.push("<option value='"+ groups[g].group_id + "'>" + groups[g].group_name + "</option>");
		}
		selectContent.push("</select>");
		var $controls = $("<div id='shareControls'>")
							.on("click", "input", function() {
								if($(this).attr("id") == "providerRadio") {
									$("#groupSelect").attr("disabled", "disabled");
									$("#providerTextbox").removeAttr("disabled");
									$("#providerSearch").removeAttr("disabled");
									clearControls();
									enableAddButton();
								}
								else if($(this).attr("id") == "groupRadio") {
									$("#groupSelect").removeAttr("disabled");
									$("#providerTextbox").attr("disabled", "disabled");
									$("#providerSearch").attr("disabled", "disabled");
									clearControls();
									enableAddButton();
								}
							})
							.on("change", "select", function() {
								if($(this).attr("id") == "durationDrop") {
									$("#durationMax").empty();
									$("#durationInput").val("").keyup();
									switch($(this).val()) {
										case "0":
											$("#durationMax").append(i18n.rwl.DAYSMAX);
											break;
										case "1":
											$("#durationMax").append(i18n.rwl.WEEKSMAX);
											break;
										case "2":
											$("#durationMax").append(i18n.rwl.MONTHSMAX);
											break;
									}
								}
								else if($(this).attr("id") == "providerNameDrop") {
									var $selected = $("#providerNameDrop :selected");
									var text = $selected.val();
									var id = $selected.attr("id");
									$("#providerTextbox").val(text).attr("prsnlId", id);
									$("#namesList").remove();
								}
								enableAddButton();
							})
							.on("keyup","input", function() {
								if($(this).attr("id") == "durationInput") {
									var timeVal = $("#durationDrop").val();
									var inputVal = $(this).val();
									if((inputVal > maxTimeValues["days"] && timeVal == 0) ||
										(inputVal > maxTimeValues["weeks"] && timeVal == 1) ||
										(inputVal > maxTimeValues["months"] && timeVal == 2))
									{
										$(this).addClass("divInputError");
										$("#durationMax").addClass('divAdmissionMaxColor');
									}
									else
									{
										$(this).removeClass("divInputError");
										$("#durationMax").removeClass('divAdmissionMaxColor');
									}
								}
								else if($(this).attr("id") === "providerTextbox") {
										var input = $(this).val();
										if (input) {
											setTimeout(function () {
												var newInput = $("#providerTextbox").val();
												if (input === newInput) {
													var request = {
														request: {
															max: 50,
															search_str: newInput,
															search_str_ind: 1,
															use_org_security_ind: bOrgSecOn ? 1 : 0
														}
													};
													controller.makeCall("mp_dcp_prsnl_search", request, false, function (reply) {
														var names = reply.PRSNL || [];
														$("#namesList").remove();
														var list = "<select id='providerNameDrop' size='7'>";
														var userID = m_controller.criterion.CRITERION.PRSNL_ID;
														for (var n = 0, nlen = names.length; n < nlen; n++) {
															if (names[n].PERSON_ID != userID) {	// Don't display the current user in the list.
																list += "<option id='" + names[n].PERSON_ID + "'>" + names[n].NAME_FULL_FORMATTED + "</option>";
															}
														}
														list += "</select>";
														$("<div id='namesList' class='prsnlNamesList'>").html(list).insertAfter("#providerTextbox");
													}, function () { // fail condition
														$("#namesList").remove();
													});
												}
											}, 500);
										}
										else {
											$("#namesList").remove();
										}
								}
								enableAddButton();
							});
		$controls.append($("<div id='providerSelection'>")
							.append($("<label><input id='providerRadio' type='radio' name='shareRadio' checked='checked'>" + i18n.rwl.SHAREPROVIDER + "</label><br/>"),
									$("<input id='providerTextbox' type='text'>"),
									$("<div class='shareSpace'>")),
						$("<div id='groupSelection'>")
							.append($("<label><input id='groupRadio' type='radio' name='shareRadio'>" + i18n.rwl.SHAREPROVIDERGROUP + "</label><br/>"),
									$(selectContent.join("")),
									$("<div class='shareSpace'>")),
						$("<div id='duration'>" + i18n.rwl.DURATION + "<br/></div>")
							.append($("<input id='durationInput' class='numInput' type='text' maxlength='3'/><span>&nbsp;&nbsp;</span>")
										.keydown(function(event) {
											if(checkInput()){
												event.preventDefault();
											}
										}),
									$("<select id='durationDrop'>" +
										"<option value='0'>" + i18n.rwl.DAYS + "</option>" +
										"<option value='1'>" + i18n.rwl.WEEKS + "</option>" +
										"<option value='2'>" + i18n.rwl.MONTHS + "</option>" +
										"</select>"),
									$("<br/><span id='durationMax'>" + i18n.rwl.DAYSMAX + "</span>")));
		return $controls;
	}
	function checkInput() {
		if((event.keyCode < 48 || event.keyCode > 57) &&
			event.keyCode != 8 &&
			((event.keyCode < 96 || event.keyCode > 105) ||
			(event.shiftKey && (event.keyCode > 48 || event.keyCode < 57)))){
					return true;
		}
		return false;
	}

	function clearControls() {
		$("#durationDrop").val(0).change();
		$("#providerTextbox").val("");
		$("#groupSelect").val(-1);
	}

	function enableAddButton(bEnable) {
		if(typeof bEnable != 'undefined'){ //if boolean passed in, set button state based on that
			(bEnable == true) ? $("#shareAdd").removeAttr("disabled") : $("#shareAdd").attr("disabled", "disabled");
			return;
		}

		if(	(($("#providerRadio").attr("checked") == "checked" && $("#providerTextbox").val()) ||
			($("#groupRadio").attr("checked") == "checked" && $("#groupSelect").val() > -1)) &&
			$("#durationInput").val() && !($("#durationInput").hasClass("divInputError")) &&
			!bCheckDuplicate()) {
				$("#shareAdd").removeAttr("disabled");
			}
		else {
			$("#shareAdd").attr("disabled", "disabled");
		}
	}

	function enableRemoveButton(benable) {
		if(benable) {
			$("#shareRemove").removeAttr("disabled");
		}
		else {
			$("#shareRemove").attr("disabled", "disabled");
		}
	}

	function bCheckDuplicate() {
		var name;

		if($("#providerRadio").attr("checked") == "checked") {
			name = $("#providerTextbox").val();
		}
		else {
			name = $("#groupSelect :selected").text();
		}

		var duplicate = false;
		$("#shareListRows").find(".proxyRow").each(function() {
			var name2 = $(this).find(".proxyName").text();
			if(name2 == name) {
				duplicate = true;
				return false; //stop the loop found a match
			}
		});

		return duplicate;
	}

	function buildList() {
		var $list = $("<div id='shareList'>");
		$list.append($("<div id='shareListHeaders'>")
					.append($("<div id='shareListName'>" + i18n.rwl.SHAREWITH + "</div>"),
							$("<div id='shareListDuration'>" + i18n.rwl.SHAREEXPIRES + "</div>")),
					$("<div id='shareListRows'>")
						.on("click", "div", function() {
							$(this).toggleClass("selected");
							$("#shareListRows").find(".proxyRow").not($(this)).removeClass("selected");
							if($("#shareListRows").find(".selected").length > 0) {
								enableRemoveButton(true);
							}
							else {
								enableRemoveButton(false);
							}
						})
						.on("mouseenter", ".proxyName", function(event) {
							var $target = $(event.target);
							if($target.text().length<18){
								return;
							}
							var curPos = $(this).position();
							var fullTextTooltip = "<div id='shareListTooltip' class='name-tooltip' style='top:" + (curPos.top-1) +
													";left:" + (curPos.left+5) + "'>" + $target.text() + "</div>";
							$(this).append(fullTextTooltip);
						})
						.on("mouseleave", ".proxyName",function(){
							$("#shareListTooltip").remove();
						}));
		return $list;
	}

	function addProxy() {
		var name;
		var date;
		var groupId = 0.0;
		var providerId = 0.0;
		if($("#providerRadio").attr("checked") == "checked") {
			var $textbox = $("#providerTextbox");
			name = $textbox.val();
			providerId = $textbox.attr("prsnlId");
		}
		else {
			name = $("#groupSelect :selected").text();
			groupId = $("#groupSelect").val();
		}
		date = new Date();
		var dur = $("#durationInput").val();
		var drop = $("#durationDrop").val();
		switch(drop) {
			case "0": // days
				if(dur > maxTimeValues["days"]){
					enableAddButton(false);
					return;
				}
				date.setDate(date.getDate() + parseInt(dur, 10));
				break;
			case "1": // weeks
				if(dur > maxTimeValues["weeks"]){
					enableAddButton(false);
					return;
				}
				date.setDate(date.getDate() + (parseInt(dur, 10)*7));
				break;
			case "2": // months
				if(dur > maxTimeValues["months"]){
					enableAddButton(false);
					return;
				}
				date.setMonth(date.getMonth() + parseInt(dur, 10));
				break;
		}

		var newRowCount = $(".proxyRow").length;
		var $newRow = $("<div id='proxyRow" + newRowCount + "' class='proxyRow'>");
		$newRow.append($("<span id='proxyName" + newRowCount + "' class='proxyName'></span>").text(name),
						$("<span id='proxyEnd" + newRowCount + "' class='proxyEnd'>" + date.format(i18n.rwl_lc.fulldate4yr) + "</span>"));

		var $rows = $("#shareListRows");
		$rows.append($newRow).addClass("showBorder");
		recolorRows($rows);
		clearControls();
		$("#providerRadio").attr("checked", "checked").click();

		updProxies.push({
			PRSNL_GROUP_NAME: groupId > 0 ? name : "",
			PRSNL_NAME: providerId > 0 ? name : "",
			PRSNL_GROUP_ID: groupId,
			PRSNL_ID: providerId,
			END_EFFECTIVE_DT_TM: date
		});
		newProxies[name] =
			{
				prsnl_group_id: groupId,
				prsnl_id: providerId,
				end_date: date.format("shortDate2").replace(/\//g, "")
			};
	}

	function removeProxy() {
		var $rows = $("#shareListRows");
		var $selected = $rows.find(".selected");
		var name = $selected.find(".proxyName").text();
		$selected.remove();
		if($rows.find(".proxyRow").length === 0) {
			$rows.removeClass("showBorder");
		}
		recolorRows($rows);
		newProxies[name] = [];
		for(var u = 0, ulen = updProxies.length; u < ulen; u++) {
			proxy = updProxies[u];
			if((proxy.PRSNL_ID > 0 && proxy.PRSNL_NAME == name) ||
				(proxy.PRSNL_GROUP_ID > 0 && proxy.PRSNL_GROUP_NAME == name)) {
				updProxies.splice(u, 1);
				break;
			}
		}
		$("#shareRemove").attr("disabled","disabled");
	}

	function recolorRows(rows) {
		var color = "white";
		rows.find(".proxyRow").each(function() {
			$(this).removeClass("zebra-white zebra-blue");
			if(color == "white") {
				$(this).addClass("zebra-white");
				color = "blue";
			}
			else {
				$(this).addClass("zebra-blue");
				color = "white";
			}
		});
	}
}
function RWToolbar(staticContentPath, controller){
	var m_arBttn = [];
	var $m_toolbar = $();
	var m_controller = controller;
	var m_numHidden = 0;
	createToolbar();

	this.addButton = addButton;
	this.enableButton = enableButton;

	this.getToolbar = function(){return $m_toolbar;};

	function createToolbar(){
		$m_toolbar = $("<div class='rwToolbar'>").disableSelection();
		m_controller.addMousedownFunction(function($target){
			if($target.hasClass("menuItem") || $target.hasClass("vertAlignImages") || $target.hasClass("menuImg")|| $target.parent().hasClass("dropdown") || $target.hasClass("dropdown"))
			{
				return;
			}
			$("#divFilterPanelTopBarContent").find(".filterDropdownDiv").remove().end()
											.find(".dropdown").removeClass("menuOpen hover").end();
			$("#wklExpandedView").find(".filterDropdownDiv").remove().end()
								.find(".dropdown").removeClass("menuOpen hover").end();
		});
	}
	function addButton(bttns){
		if(!bttns){
			return;
		}
		var arBttn = [].concat(bttns);
		var tableName = [];
		var arrDropdownTitle = [];
		var arrDropdownName = [];
		var arrDropdownCallback = [];
		var arrDropdownId = [];
		var arrDropdownIcon = [];
		var arDropdown =[];
		for(var i=0,len=arBttn.length;i<len;i++){
			var propObj = arBttn[i];
			if(m_arBttn.length>0){
				$m_toolbar.append($("<div class='rwToolbarButtonSeparator'>"));
			}
			propObj.name = propObj.name || ("btn" + m_arBttn.length);
			propObj.label = propObj.label || "";
			propObj.icon = propObj.icon || "";
			propObj.callback = propObj.callback ||"";
			propObj.dropdown = propObj.dropdown || [];
			propObj.dropdownArrow = propObj.dropdownArrow || false;
			arDropdown =  [].concat(propObj.dropdown);
			var displayDropdownArrow ="";
			var icon = "";
			if(propObj.icon != "")
				icon = $("<img class='vertAlignImages' src='" + propObj.icon + "'/>");
			if(arDropdown.length > 0)
			{
				if(propObj.dropdownArrow) {
					displayDropdownArrow = $("<img class = 'addButtonDropdownArrow' src='" + staticContentPath + "/images/5323_16.png'/>");
				}
				for(var f=0,l=arDropdown.length;f<l;f++)
				{
					var dpObj = arDropdown[f];
					dpObj.title = dpObj.title || "";
					dpObj.name = dpObj.name || "";
					dpObj.dcallback = dpObj.dcallback || null;
					dpObj.id = dpObj.id || 0.0;
					dpObj.icon = dpObj.icon || "";
					arrDropdownTitle.push(dpObj.title);
					arrDropdownName.push(dpObj.name);
					arrDropdownCallback.push(dpObj.dcallback);
					arrDropdownId.push(dpObj.id);
					arrDropdownIcon.push(dpObj.icon);
				}
				tableName = propObj.name;
			}
			propObj.tooltip = propObj.tooltip || "";
			propObj.$button = $("<div class='rwToolbarButton " + propObj.name + "' id = '" + propObj.name + "'>")
				.mousedown(function(){$(this).addClass("down");})
				.mouseleave(function(){
					$(this).children("#rwToolbarButtonTooltip").remove();
					if(!($(this).hasClass("menuOpen"))) {
						$(this).removeClass("hover");
					}
				})
				.addClass( propObj.dropdown.length > 0 ? "dropdown" : "")
				.mouseenter(function(e){
					var tooltip = '';
					for(var i = 0; i < m_arBttn.length; i++)
					{
						if($(this).hasClass(m_arBttn[i].name) && !m_arBttn[i].$button.hasClass('enabled'))
						{
							tooltip = m_arBttn[i].tooltip;
							break;
						}
					}
					if(tooltip != "")
					{
						$(this).append($("<div id = 'rwToolbarButtonTooltip'>" + tooltip + "</div>")
							.click(function(event){
								event.stopPropagation();
							})
						);
						var $divTooltip = $("#rwToolbarButtonTooltip");
						var width = $divTooltip.width();
						$divTooltip.css("left", (width/2));
					}
					$(this).addClass("hover");
				})
				.mouseup(function(){
					$(this).removeClass("down");
				})
				.append(
					icon,
					$("<span>"+propObj.label+"</span>"),
					displayDropdownArrow,
					$("<div class='rwToolbarButtonMask overlayDisabled'>")
						.click(function(event){
							event.stopPropagation();
						})
				)
				.appendTo($m_toolbar);
				if(propObj.dropdown.length > 0){
					propObj.$button.click(function(){
						var title = "";
						var $curBtn = $(this);
						for(var i = 0; i < m_arBttn.length; i++)
						{
							if($curBtn.hasClass(m_arBttn[i].name))
							{
								title = m_arBttn[i].name;
								break;
							}
						}
						$curBtn.toggleClass("menuOpen");
						if($curBtn.hasClass("menuOpen")) {
							var $drop = buildDropdown(title,tableName,arrDropdownTitle,arrDropdownName,arrDropdownCallback,arrDropdownId,arrDropdownIcon);
							$curBtn.append($drop);
						}
						else
						{
							$("#filter" + title + "Menu").remove();
						}
						if($curBtn.hasClass("listActions")){
							if(m_controller.getActiveList().OWNER_ID == m_controller.getCriterion().CRITERION.PRSNL_ID){
								$("#trShare")
									.add("#trCustomize")
									.toggleClass("disabledTableRow",
									m_controller.getInaccessibleList() == m_controller.getActivePatientListID() || (m_controller.getActiveList().OWNER_ID != m_controller.getCriterion().CRITERION.PRSNL_ID));
							} else {
								$("#trModify")
									.add("#trRename")
									.add("#trDelete")
									.add("#trShare")
									.add("#trCustomize")
									.toggleClass("disabledTableRow",
									m_controller.getInaccessibleList() == m_controller.getActivePatientListID() || (m_controller.getActiveList().OWNER_ID != m_controller.getCriterion().CRITERION.PRSNL_ID));
							}
							$('#trRemoveAll').toggleClass('disabledTableRow',m_controller.returnRemovablePatients().length < 1);
							$("#trExport").toggleClass("disabledTableRow", m_controller.getInaccessibleList() == m_controller.getActivePatientListID());

							$curBtn.find('table tr').each(function () {
							     var trId = $(this).attr('id');
							     if (trId === 'trExportPatientSummary') {
							         var pvFrameworkLinkObj = window.external.DiscernObjectFactory('PVFRAMEWORKLINK');
							         if (DWL_Utils.isNullOrUndefined(pvFrameworkLinkObj) === false) {
							             var dataExportStatus = pvFrameworkLinkObj.IsDataExportDialogRegistered(); //1-data export dlg is in open status, 0- dlg is not in open status

							            if ((m_controller.getSavedList().length < 1) ||  //if there are no work lists, disable the button
                                            				(m_controller.m_currentlyDisplayedPatients.length < 1) ||   //if there are no patients, disable the button
                                            				(dataExportStatus === 1)) {               // if the data export dialog is already open disable the button else enable the button
							                m_controller.toggleExportPatientSummary(true);
							            } else {
							                m_controller.toggleExportPatientSummary(false);
							            }
							        }
							     }
							});

							if(m_controller.bIsGenerating && !$("#trModify").hasClass("disabledTableRow")){
								$("#trModify").addClass("disabledTableRow");
							};
							$("#trCreate").toggleClass("disabledTableRow",m_controller.bIsGenerating);
						}
						else if($curBtn.hasClass("hidden")) {
							var patients = m_controller.getPatientSelectedValue();
							if(patients.length == 0 || !m_controller.arePatientsRemovable(patients)) {
								$("#trremovePatient").addClass("disabledTableRow").find(".vertAlignImages").attr("src", staticContentPath + "/images/RemovePatient_Disabled_32.png");
							}
							else {
								$("#trremovePatient").removeClass("disabledTableRow").find(".vertAlignImages").attr("src", staticContentPath + "/images/6695_32.png");
							}
						}
					});
				}
				else {
					(function(pObj){
						pObj.$button.click(function(){
							pObj.callback(pObj.param);
						});
					})(propObj);
				}
			m_arBttn.push(propObj);
		}
		return this;
	}
	this.determineWidths = function() {
		var widths = [];
		for(var b = 0, blen = m_arBttn.length; b < blen; b++) {
			widths.push($("#" + m_arBttn[b].name).outerWidth());
		}
		return widths;
	};
	this.hideShowButtons = function(toolbarWidth, btnWidths) {
		var $listDrop = $("#filterToolbarListSelect");
		var $fuzzySearch = $("#fuzzySearchBox");
		var $rwToolbar = $("#rwMainToolbar");
		var $hiddenBar = $("#hiddenToolbar");
		var marginWidth=3; //Added to remove fuzzy search alignment issue in ie10
		var combinedWidth = $listDrop.outerWidth(true) + $fuzzySearch.outerWidth(true) + $rwToolbar.outerWidth(true) + $hiddenBar.outerWidth(true);

		if(toolbarWidth > combinedWidth) { //Try to show buttons
			if(m_numHidden == 0) { //All buttons are already shown
				return;
			}
			else {
				var numToShow = m_arBttn.length - m_numHidden;
				var dividerWidth = $("#rwMainToolbar").children(".rwToolbarButtonSeparator").outerWidth(true) + marginWidth;
				combinedWidth += btnWidths[numToShow] + dividerWidth;
				while(toolbarWidth > combinedWidth && m_numHidden > 0) { //Show as many as will fit
					showButton();
					numToShow = m_arBttn.length - m_numHidden;
					combinedWidth += btnWidths[numToShow] + dividerWidth;
				}
			}
		}
		else if(toolbarWidth < combinedWidth + 60) { //Hide buttons -- Add 60 to eliminate issues around edge cases and stop the code from going into an infinite loop
			if(m_numHidden == (m_arBttn.length - 1)) { //All buttons are already hidden
				return;
			}
			do {
				hideButton();
				var numToShow = m_arBttn.length - m_numHidden;
				var newWidth = combinedWidth - btnWidths[numToShow];
				combinedWidth = newWidth;
			} while(toolbarWidth < (newWidth + 60) && m_numHidden < (m_arBttn.length - 1));
		}
	};
	function hideButton() {
		if(m_numHidden < (m_arBttn.length - 1)) {
			m_numHidden++;
			$("#hiddenToolbar").remove();
			hide();
		}
	}
	function hide() {
		var hiddenDrop = [],
			hidden = [],
			icon = null,
			h = null,
			sHiddenDropDownButtonName = 'hiddenDropDown';
		m_arBttn.reverse();

		for(h = 0; h < m_numHidden; h++) {
			icon = m_arBttn[h].icon;

			hiddenDrop.unshift({
				title:m_arBttn[h].label,
				name:m_arBttn[h].name,
				dcallback:m_arBttn[h].callback,
				icon:icon
			});
			$('#' + m_arBttn[h].name).hide().prev().hide();
		}
		hidden.push({
			name:sHiddenDropDownButtonName,
			dropdown:hiddenDrop,
			dropdownArrow:false,
			icon: staticContentPath + '/images/MoreIcons_button_16x16.png'
		});
		hidden_toolbar = new RWToolbar(staticContentPath, m_controller);
		hidden_toolbar.addButton(hidden)
			.enableButton(sHiddenDropDownButtonName).getToolbar().addClass("mainToolbarSize").attr("id","hiddenToolbar")
			.prepend("<div class='rwToolbarButtonSeparator'>")
			.insertAfter($("#rwMainToolbar"));
		m_arBttn.reverse();
	};
	function showButton() {
		if(m_numHidden > 0) {
			m_numHidden--;
			$("#hiddenToolbar").remove();
			var numToShow = m_arBttn.length - m_numHidden;
			for(var s = 0; s < numToShow; s++) {
				$("#" + m_arBttn[s].name).show().resize().prev().show()
					.end().mouseleave(); //fixes displaying issues when the button was disabled going into the dropdown
			}
			if(m_numHidden > 0) {
				hide();
			}
		}
	}
	function buildDropdown(title, buttonName,dropdownLabel,dropdownName,dropdownCallback, dropdownId, dropdownIcon){
		var $m_dropdownMenu = $("<div id='filter"+ title + "Menu' class='filterDropdownDiv'>");
		var htmlString = "";

		for(var i=0,len=dropdownLabel.length;i<len;i++){
			htmlString +="<tr id='tr"+dropdownName[i]+"'>";
			if(dropdownIcon[i] != "") {
				htmlString += "<td class='menuImg'><img class='vertAlignImages' src='" + dropdownIcon[i] + "'/></td>";
			}
			else {
				htmlString += "<td class='menuImg'></td>";
			}
			htmlString += "<td class='menuItem'>" + dropdownLabel[i]+"</td></tr>";
		}
		$m_dropdownMenu.append($("<table id="+buttonName+" class='rwToolbarDropTable filterDropdownMenu'></table>")
			.append($(htmlString).click(function() {
						for(var i=0,len=dropdownName.length;i<len;i++){
							var idElement = "tr"+dropdownName[i];
							if($(this).attr("id") == idElement && !($(this).hasClass("disabledTableRow")))
							{
								if(dropdownId[i])
									dropdownCallback[i](dropdownId[i]);
								else
									dropdownCallback[i]();
								break;
							}
						}
						$(this).parents(".dropdown").removeClass("hover");
					})
			));
		return $m_dropdownMenu;
	}
	function enableButton(name,bEnabled){
		var btnLen = m_arBttn.length;
		if(!name || btnLen<=0){
			return;
		}
		bEnabled = (bEnabled!=undefined) ? bEnabled : true;

		for(var i=0;i<btnLen;i++){
			if(m_arBttn[i].name == name){
				var $btn = m_arBttn[i].$button;
				if(bEnabled){
					$btn.addClass("enabled").children(".rwToolbarButtonMask").hide();
				}else{
					$btn.removeClass("enabled").children(".rwToolbarButtonMask").show();
				}
				break;
			}
		}
		return this;
	}
}
var convertNumberInputToValue = function(input) {
	var bInputIsString = (typeof input === 'string');
	input += '';

	var aInput = input.split(i18n.rwl_lc.decimal_point || "."),
		newInput = parseFloat((aInput[0] || "").replace(/[^0-9-]+/g,"") + "." + (aInput[1] || "").replace(/[^0-9]+/g,""));

	return ( bInputIsString ? newInput.toString() : newInput );
};

var convertSQLDateStringToJS = function(sqlDate){
	var dateAr = sqlDate.replace(/.*Date\(([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).*/,"$1,$2,$3,$4,$5,$6").split(",");
	var newDate;
	if(m_controller.getCriterion().CRITERION.UTC_ON){
		newDate = new Date(Date.UTC(
			parseInt(dateAr[0],10),
			parseInt(dateAr[1],10)-1,
			parseInt(dateAr[2],10),
			parseInt(dateAr[3],10),
			parseInt(dateAr[4],10),
			parseInt(dateAr[5],10)));
	}else{
		newDate = new Date(
			parseInt(dateAr[0],10),
			parseInt(dateAr[1],10)-1,
			parseInt(dateAr[2],10),
			parseInt(dateAr[3],10),
			parseInt(dateAr[4],10),
			parseInt(dateAr[5],10));
	}
	return newDate;
};

var alphaSort = function(strArray,criterion){
	strArray.sort(function(a,b){
		var alphaRE = /[A-z\-]/g;
		var charA = a[criterion].match(alphaRE)||[];
		var numberA = parseInt(a[criterion].replace(alphaRE,""),10);
		var charB = b[criterion].match(alphaRE)||[];
		var numberB = parseInt(b[criterion].replace(alphaRE,""),10);

		var alphaA = charA.join("");
		var alphaB = charB.join("");

		var alphaCompare = alphaA.localeCompare(alphaB);
		if(alphaCompare==0){
			if(!isNaN(numberA) && !isNaN(numberB)){
				if(numberA< numberB){
					return -1;
				}else{
					return 1;
				}
			}
			else if(isNaN(numberA) && !isNaN(numberB)){
				return -1;
			}
			else if(!isNaN(numberA) && isNaN(numberB)){
				return 1;
			}
			else if(isNaN(numberA) && isNaN(numberB)){
				return 1;
			}
		}
		else{
			return $.trim(a[criterion]).localeCompare($.trim(b[criterion]));
		}
	});
	return strArray;
};

var getKeyPressValidatorEvent = function(allowNegativeRange,allowDecimalValues){
	var allowedChars = "0123456789";
	allowDecimalValues===true ?	allowedChars += ',\.' : null; // escape period
	allowNegativeRange===true ?	allowedChars += '-' : null;  // minus(range char) needs to be at end
	var charRegex = RegExp("[^" + allowedChars + "]+","g");

	return function(event){
		if(event.type==='paste'){
			var element = this;
			setTimeout(function(){
				var input = $(element).val();
				$(element).val(input.replace(charRegex,""));
			},0);
		} else if(event.type==='keypress'){
			if(allowedChars.indexOf(String.fromCharCode(event.keyCode))==-1){
				event.preventDefault();
			}
		}
	};
};
var disableIndividualEncounters = function(individualEncounters, groupName, isFilter) {
	var individualEncounters = individualEncounters || [],
		encounterLabelId,
		encounterLabel;

	for (var count = 0, iLength = individualEncounters.length; count < iLength; count++) {
		encounterLabel = setEncounterId(individualEncounters[count]);

		if(isFilter) {
			encounterLabelId = 'filter' + encounterLabel;
		} else {
			encounterLabelId = 'search' + encounterLabel;
		}

		$('#' + encounterLabelId)
			.removeClass('encGroupRemoved') // this class is present on search.
			.removeClass('filterEncGroupRemoved') // this class is present on filter.
			.addClass('encGroupAdded')
			.find('input')
			.prop({'checked': true, 'disabled': true});

		addGroupList(encounterLabelId, groupName);
	}
};
var addGroupList = function(encounterLabelId, groupName) {
	if (encounterLabelId && groupName) {
		var $item = $('#' + encounterLabelId).find('.encGroups'),
			itemText = $item.text(),
			groupNames = itemText ? itemText.replace(/\(|\)/g, '').split(', ') : [];

		groupNames.push(groupName);
		$item.text(encGroupText(groupNames));
	}
};
var encGroupText = function(groupNames) {
	if(groupNames.length) {
		return '(' + decodeURI(groupNames.toString().replace(/,/g, ', ')) + ')';
	} else {
		return '';
	}
};
var displayEncounterTooltip = function($encounter, event, $outerDiv) {
	var html = '';
	if ($encounter.data('type') === 'INDIVIDUAL') {
		var tableCell = $encounter.closest('td')[0];
		if (tableCell.offsetWidth < tableCell.scrollWidth) {
			var groupEncounters = $encounter.find('.encGroups').text(),
				encName = $encounter.text();
			html = encName + (groupEncounters ? ' ' + groupEncounters : '');
		}
	} else { // If encouner group, add the associated individual encounters in tooltip
		html = $encounter.data('children').replace(/,/g, ', ');
	}

	if (html !== '') {
		$('<div class="ptCommentHover">').appendTo($outerDiv)
			.html(html)
			.css({top:event.pageY - $outerDiv.offset().top + 15,
				left:event.pageX - $outerDiv.offset().left + 15})
			.show();
	}
};
var displayAutoRemoveToolTip = function(event, $outerDiv, toolTipText) {
	$('<div class="ptCommentHover">').appendTo($outerDiv)
		.html(toolTipText)
			.css({top:event.pageY - $outerDiv.offset().top + 35,
				left:event.pageX - $outerDiv.offset().left + 15})
			.show();
};
function hideTooltip($container) {
	if ($container) {
		$container.find('.ptCommentHover').remove();
	}
}
function toggleLoadingIndicator($searchInput, loading) {
	if ($searchInput.length > 0) {
		var img = (loading === 'load') ? '6439_16.gif' : '6428_11.png';
		$searchInput.css('background-image', 'url("' + m_controller.staticContentPath + '/images/' + img + '")');
	}
}
function setEncounterId(str) {
	return str.replace(m_controller.stripSplChars, '').replace(m_controller.stripBlankSpaces, '');
}
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
