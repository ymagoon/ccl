
function GenComm(controller) {
	'use strict';
	var m_GenComm = this;
	var m_dialog;
	var m_header;
	var m_footer;
	var m_leftPanel;
	var m_rightPanel;
	var m_errorMessages;
	var m_logMessages;
	var m_loadedData = {};
	var S_INFO_MESSAGE_CLASSIFIER = 'genComm';
	var oElementStrings = {
			dialog: 'genCommDialog',
			header: 'genCommHeader',
			footer: 'genCommFooter',
			body: 'genCommBody',
			leftPanel: 'genCommLeftPanel',
			rightPanel: 'genCommRightPanel',
			background: 'genCommDlgBackground',
			textareaContainer: 'genCommTextareaContainer',
			subjectContainer: 'genCommSubjectContainer',
			subjectContainerSubject: 'subjectContainerSubject',
			subjectContainerNoteType: 'subjectContainerNoteType',
			ckeditor: 'genCommCKEditor',
			sOption: 'genCommOption',
			sDrop: 'genCommDrop',
			sSaveToChart: 'genCommSaveToChart',
			sNoteType: 'genCommNoteType',
			sSubject: 'genCommSubject',
			sFreetextSubject: 'genCommFreetextSubject',
			sRequiredNotSelected: 'requiredNotSelected',
			sRequiredSelected: 'requiredSelected',
			sRequiredIndicator: 'requiredIndicator',
			sInvisible: 'invisible',
			sVisible: 'visible',
			sNoteTypeLabel: 'genCommNoteTypeLabel',
			sSenderHeader: 'senderDetailsHeader',
			sSenderNameArea: 'senderNameArea',
			sSenderAddressType: 'senderAddressType',
			sSenderAddressArea: 'senderAddressArea',
			sSenderAddressHeader: 'senderAddressAreaHeader',
			sSenderAddressText: 'senderAddressAreaText',
			sSenderAddressEdit: 'senderAddressAreaEdit'
	};
	var CKEDITOR_HIDE_AUTOTEXT_COMMAND = 'ddhideautotext'; // from mpagesckeditor.js:51
	var m_blankDropValue = -1;
	var m_patients = [];
	var iSubjectOtherCd = -1;
	var oSenderAddress = {};
	var iNoteType = 0;
	var fnCreateFreshState = function() {
		return {
			sSubjectText: null,
			oGenCommBuckets: {
				aoLetters: [],
				aoMessages: [],
				aoPhoneCalls: []
			},
			iLettersSentToPrinter: 0,
			iListId: null,
			sListName: null,
			bPhoneCallsCompleted: false,
			bMessagesSent: false
		};
	};
	var oGenCommState = fnCreateFreshState();
	var oPrintProcessInitation = $.Deferred();
	this.fnGetState = function() {
		return oGenCommState;
	};
	this.launch = function(listName, patients) {
		oSenderAddress = DWL_Utils.fnPopulateAddressObject({}); //ensure that it's blank when the dialog opens
		oGenCommState = fnCreateFreshState();
		m_patients = patients;
		if(DWL_Utils.isNullOrUndefined(m_loadedData.noteTypes) === true || DWL_Utils.isNullOrUndefined(m_loadedData.subjects) === true ||
				DWL_Utils.isNullOrUndefined(m_loadedData.aAddressTypes) === true) {
			controller.makeCall('mp_dcp_retrieve_gen_comm_data',null,false, m_GenComm.setLoadedData);
		}

		$('body').prepend($('<div id="' + oElementStrings.background + '" class="rwDlgBackground">'));
		m_dialog = new DWL_Utils.Dialog(oElementStrings.dialog, ['genCommDlg']);
		buildHeader(listName);
		buildBody();
		buildFooter();
		attachEventHandlers();
		oGenCommState.iListId = controller.getActivePatientListID();
		oGenCommState.sListName = listName;
		oPrintProcessInitation = $.Deferred();
		this.oInitatePrintProcess = oPrintProcessInitation.promise();
	};
	function close() {
		var selections = m_leftPanel.getSelectionCriterion();

		iNoteType = selections.bSaveToChart ? selections.noteTypeValue : 0;
		oSenderAddress = m_leftPanel.fnGetSenderAddress(); //persist this so that printing has access to it
		m_dialog.remove();
		$('#'+ oElementStrings.background).remove();
		m_dialog = null;
		m_header = null;
		m_footer = null;
		m_leftPanel = null;
		m_rightPanel.removeEditor();
		m_rightPanel = null;
		m_errorMessages = null;
		m_logMessages = null;
		m_patients = null;
		$(window).off('resize', fnDialogResizeHandler);
	}
	this.setLoadedData = function(reply) {
		if(DWL_Utils.isNullOrUndefined(reply) === true || $.isEmptyObject(reply) === true || reply.STATUS_DATA.STATUS.toUpperCase() !== 'S') {
			fnAddGenCommErrorMessage();
			controller.logErrorMessages('', 'mp_dcp_retrieve_gen_comm_data script failed','GenComm.setLoadedData');
			return;
		}

		var aoNoteTypes = reply.NOTE_TYPES;
		var aoNewNoteTypes = [];
		var aoSubjects = reply.SUBJECTS;
		var aoNewSubjects = [];
		var aoAddressTypes = reply.ADDRESS_TYPES;
		var aoNewAddressTypes = [];

		for(var n = 0, iNoteLen = aoNoteTypes.length; n < iNoteLen; n++) {
			aoNewNoteTypes.push({value: aoNoteTypes[n].NOTE_TYPE_CD, text: aoNoteTypes[n].NOTE_TYPE_DISP});
		}
		
		aoNewNoteTypes.sort(function(a, b) {
  			var noteTypeA = a.text.toUpperCase(); 
  			var noteTypeB = b.text.toUpperCase(); 
  			if (noteTypeA < noteTypeB) {
   				 return -1;
  			}
  			if (noteTypeA > noteTypeB) {
   				 return 1;
  			}

  			return 0;
  		})
		
		m_loadedData.noteTypes = aoNewNoteTypes;

		for(var s = 0, iSubLen = aoSubjects.length; s < iSubLen; s++) {
			aoNewSubjects.push({value: aoSubjects[s].SUBJECT_CD, text: aoSubjects[s].SUBJECT_DISP});
		}
		m_loadedData.subjects = aoNewSubjects;
		iSubjectOtherCd = reply.SUBJECT_OTHER_CD;

		for(var a = 0, iAddrTypeLen = aoAddressTypes.length; a < iAddrTypeLen; a++) {
			aoNewAddressTypes.push({value: aoAddressTypes[a].ADDRESS_TYPE_CD, text: aoAddressTypes[a].ADDRESS_TYPE_DISP});
		}
		m_loadedData.aAddressTypes = aoNewAddressTypes;
	};
	this.fnPrintLetters = function(oReply) {
		function fnSetPrintingPendingStatus(bStatus) {
			var sDataName = 'generateCommunication';
			var bDataVal  = bStatus === true ? true : null;
			m_controller.$pendingData.trigger('change', [sDataName, bDataVal]);
		}
		function fnEndPrinting() {
			fnSetPrintingPendingStatus(false);

			oGenCommState.iLettersSentToPrinter = oGenCommState.oGenCommBuckets.aoLetters.length;
			oPrintProcessInitation.resolve(oGenCommState);
		}

		if (fnHasPrintLetterPreconditionBeenMet(oReply) === false) {
			return fnHandleUnmetPrintLetterPreconditions(oReply);
		}

		var sCommunicationId = oReply.BROADCAST_ID;
		var sSenderAddress = JSON.stringify(oSenderAddress);
		var bCommObjectStatus = null;
		var I_PRINT_DIALOG_CANCEL = 0;
		var I_PRINT_TEMPLATE_NOT_FOUND = 2;
		try {
			fnSetPrintingPendingStatus(true);
			bCommObjectStatus = oPvGenerateCommunications.PrintLetters(sCommunicationId, sSenderAddress, iNoteType, fnEndPrinting);
		} catch(oError) {
			fnSetPrintingPendingStatus(false);
			oPrintProcessInitation.reject(oGenCommState, oError);
			controller.logErrorMessages('', oError.name + ': ' + oError.message, 'GenComm.fnPrintLetters');
			return;
		}
		if (parseInt(bCommObjectStatus, 10) === I_PRINT_TEMPLATE_NOT_FOUND) {
			fnSetPrintingPendingStatus(false);
			oPrintProcessInitation.reject(oGenCommState, new Error('print template could not be found'));
			controller.logErrorMessages('', 'print template could not be found','GenComm.fnPrintLetters');
			return;
		}
		if (parseInt(bCommObjectStatus, 10) === I_PRINT_DIALOG_CANCEL) {
			oGenCommState.oGenCommBuckets.aoLetters = [];
			controller.fnLogWarningMessages('', 'print dialog was canceled','GenComm.fnPrintLetters');
			fnEndPrinting();
		}
	};
	this.oInitatePrintProcess = oPrintProcessInitation.promise();
	function fnHasPrintLetterPreconditionBeenMet(oReply) {
		return  DWL_Utils.isNullOrUndefined(oReply) === false &&
			fnIsValidBroadcastId(oReply.BROADCAST_ID) === true &&
			fnIsComObjectDefined() === true;
	}
	function fnIsSuccessfulGenerateCommuncationScriptReply(oReply) {
		return DWL_Utils.isNullOrUndefined(oReply) === false &&
			$.isEmptyObject(oReply) === false &&
			oReply.STATUS_DATA.STATUS.toUpperCase() === 'S';
	}
	function fnIsValidBroadcastId(sBroadcastId) {
		return DWL_Utils.isNullOrUndefined(sBroadcastId) === false &&
			sBroadcastId !== '';
	}
	function fnIsComObjectDefined() {
		return DWL_Utils.isNullOrUndefined(oPvGenerateCommunications) === false;
	}
	function fnHandleUnmetPrintLetterPreconditions(oReply) {
		if (fnIsSuccessfulGenerateCommuncationScriptReply(oReply) === false) {
			oPrintProcessInitation.reject(oGenCommState, new Error('invalid reply from mp_dcp_generate_communication script'));
			fnAddGenCommErrorMessage();
			controller.logErrorMessages('', 'mp_dcp_generate_communication failed','GenComm.fnPrintLetters');
			return;
		}
		if (fnIsValidBroadcastId(oReply.BROADCAST_ID) === false) {
			oPrintProcessInitation.reject(oGenCommState, new Error('invalid communcation id'));
			controller.logErrorMessages('', 'Communication Id is null or undefined','GenComm.fnPrintLetters');
			fnAddGenCommErrorMessage();
			return;
		}
		if (fnIsComObjectDefined() === false) {
			oPrintProcessInitation.reject(oGenCommState, new Error('oPvGenerateCommunications is undefined'));
			controller.logErrorMessages('', 'GenerateCommunications is empty','GenComm.fnPrintLetters');
			return;
		}
	}
	function buildHeader(listName) {
		m_header = new Header(oElementStrings.header, oElementStrings.dialog, ['rwDlgHeader'], listName);
	}
	function buildBody() {
		$('<div id="' + oElementStrings.body + '" class="' + oElementStrings.body + '">').appendTo($('#' + oElementStrings.dialog));
		buildLeftPanel();
		buildRightPanel();
	}
	function buildLeftPanel() {
		m_leftPanel = new LeftPanel(oElementStrings.leftPanel, oElementStrings.body, [oElementStrings.leftPanel]);
	}
	function buildRightPanel() {
		m_rightPanel = new RightPanel(oElementStrings.rightPanel, oElementStrings.body, [oElementStrings.rightPanel]);
	}
	function buildFooter() {
		m_footer = new Footer(oElementStrings.footer, oElementStrings.dialog, ['rwDlgFooter']);
	}
	function validateForm() {
		var selections = m_leftPanel.getSelectionCriterion();
		var generateBtn = m_footer.getButtons().generate;
		var iSubjectValue = parseInt(selections.subjectValue, 10);
		var sFreetextSubject = m_leftPanel.fnGetTextboxes().oFreetextSubject.fnGetText();
		if(isNaN(iSubjectValue) === false &&
				((iSubjectValue === iSubjectOtherCd && sFreetextSubject.length > 0) ||
						(iSubjectValue !== iSubjectOtherCd && iSubjectValue > m_blankDropValue)) &&
				(selections.bSaveToChart === true && selections.noteTypeValue > 0 || selections.bSaveToChart === false) &&
				m_rightPanel.getEditorText().length > 0 && m_leftPanel.fnGetIsSenderSelected() === true) {
			generateBtn.enable();
		}
		else {
			generateBtn.disable();
		}
	}
	function generateBroadcastMessage() {
		var selections = m_leftPanel.getSelectionCriterion();
		var iSenderPrsnlId = m_leftPanel.fnGetSenderPrsnlId();
		var noteType = selections.noteTypeValue;
		var bSaveToChart = selections.bSaveToChart;
		var iSaveToChartInd = 0;
		var sEditorContent = m_rightPanel.getEditorContent();
		var iListIdInContext = controller.getActivePatientListID();
		var aoPatientsInContext = m_patients.slice();
		var aiPatientIds = $.map(aoPatientsInContext, function(oPatient) {
			return oPatient.PERSON_ID;
		});
		if(bSaveToChart === true) {
			iSaveToChartInd = 1;
		}
		oGenCommState.sSubjectText = selections.subjectText;
		fnAddGeneratingCommuncationInfoMessage(oGenCommState.sSubjectText, oGenCommState.sListName);
		controller
			.fnGetEncounterIdForPatientsInActiveListAsynchronously(aiPatientIds)
			.done(function(oPatientBestEncounters) {
				var patientArr = [];
				for (var p = 0, len = aoPatientsInContext.length; p < len; p++) {
					var curPatient = aoPatientsInContext[p];
					patientArr.push({
						person_id: curPatient.PERSON_ID,
						comm_pref_cd: curPatient.CONTACT_METHOD_CD,
						encounter_id: oPatientBestEncounters[curPatient.PERSON_ID]
					});
				}

				var broadcastId = uuid.v1();

				var genCommReq = {
					genComm_request: {
						patients: patientArr,
						prsnl_id: controller.criterion.CRITERION.PRSNL_ID,
						sender_prsnl_id: iSenderPrsnlId,
						broadcast_ident: broadcastId,
						comm_subject_text: selections.subjectText,
						comm_subject_cd: selections.subjectValue,
						comm_msg_text: buildFullMessageDocument(sEditorContent),
						save_to_chart_ind: iSaveToChartInd,
						event_cd: noteType,
						list_id: iListIdInContext,
						send_broadcast_flag: 1
					}
				};
				controller.makeCall('mp_dcp_generate_communication', genCommReq, true, fnMpDcpGenerateCommunicationSuccessHandler, fnMpDcpGenerateCommunicationFailureHandler);
			})
			.fail(function(oReply) {
				controller.logErrorMessages(
					'mp_dcp_dwl_get_best_encntr',
					oReply,
					'GenComm#generateBroadcastMessage'
				);
				fnAddGenCommErrorMessage();
			});
		close();
	}
	function fnAddGeneratingCommuncationInfoMessage(sSubjectText, sListName) {
		var S_GENERATING_COMMUNCATION_INFO_MESSAGE = (i18n.genComm.S_GENERATING_COMMUNICATION
				.replace('{0}', sSubjectText)
				.replace('{1}', sListName)),
			S_SPINNER_IMG_PATH = controller.staticContentPath + '/images/6439_16_darker.gif',
			S_AUTO_DISMISS = 'auto',
			S_INFO_MESSAGE_TYPE = 'info';
		fnRemoveGeneratingCommuncationInfoMessage();
		controller.addDisplayMessage(S_INFO_MESSAGE_TYPE, S_GENERATING_COMMUNCATION_INFO_MESSAGE, S_INFO_MESSAGE_CLASSIFIER, S_SPINNER_IMG_PATH, S_AUTO_DISMISS);
	}
	function fnRemoveGeneratingCommuncationInfoMessage() {
		controller.clearSpecificMessages('.' + S_INFO_MESSAGE_CLASSIFIER);
	}
	function fnMpDcpGenerateCommunicationSuccessHandler(oReply) {
		if (DWL_Utils.isNullOrUndefined(oReply) === true) {
			return fnHandleUnmetPrintLetterPreconditions(oReply);
		}
		oGenCommState.bPhoneCallsCompleted = oReply.PHONE_CALLS_IND === 1;
		oGenCommState.bMessagesSent = oReply.MESSAGE_SENT_IND === 1;
		oGenCommState.oGenCommBuckets.aoLetters = (oReply.LETTERS_PATIENT_GROUP || []).slice();
		oGenCommState.oGenCommBuckets.aoMessages = (oReply.MESSAGE_PATIENTS_GROUP || []).slice();
		oGenCommState.oGenCommBuckets.aoPhoneCalls = (oReply.PHONE_CALLS_GROUP || []).slice();
		m_GenComm.fnPrintLetters(oReply);
	}
	function fnMpDcpGenerateCommunicationFailureHandler(oReply) {
		fnAddGenCommErrorMessage();
		m_GenComm.fnPrintLetters(oReply);
	}
	function fnAddGenCommErrorMessage() {
		fnRemoveGeneratingCommuncationInfoMessage();
		controller.fnAddGenCommErrorMessage(i18n.genComm.S_GEN_COMM_ERROR);
	}
	function buildFullMessageDocument(docText) {
		var htmlDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"' +
							' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
							'<html xmlns="http://www.w3.org/1999/xhtml">' +
							'<head><title></title></head>' +
							'<body><div>';
		htmlDocument += docText;
		htmlDocument += '</div></body></html>';
		return htmlDocument;
	}
	function attachEventHandlers() {
		m_dialog.getDialog()
			.click(clickHandlers)
			.change(changeHandlers)
			.keyup(fnKeyupHandlers);
		$(window).on('resize', controller.debounce(fnDialogResizeHandler, controller.delayDuration));
	}
	function clickHandlers(event) {
		if($(event.target).hasClass('close') === true) {
			close();
			controller.enableGenCommButton(true);
		}

		if ($(event.target).hasClass('generate') === true &&
			$(event.target).prop('disabled') === false) {

			controller.fnLogCapabilityTimer('CAP:MPG DWL Broadcast Message');
			generateBroadcastMessage();
		}

		if($(event.target).hasClass(oElementStrings.sSenderAddressEdit) === true) {
			m_leftPanel.fnLaunchAddressPopover();
		}
	}
	function changeHandlers(event) {
		var $target = $(event.target);
		var iValue = -1;
		if($target.hasClass(oElementStrings.sSaveToChart) === true) {
			var oNoteTypesDrop = m_leftPanel.fnGetDropdowns().oNoteType;
			var bIsSaveToChartChecked = m_leftPanel.fnGetCheckboxes().oSaveToChart.isChecked();
			var $noteTypesDrop = oNoteTypesDrop.getDropdown();
			var $noteTypeRequiredIndicator = $('#' + oElementStrings.sNoteTypeLabel).children('.' + oElementStrings.sRequiredIndicator);
			if(bIsSaveToChartChecked === true) {
				oNoteTypesDrop.enable();
				$noteTypeRequiredIndicator.addClass(oElementStrings.sVisible).removeClass(oElementStrings.sInvisible);
			}
			else {
				oNoteTypesDrop.fnSetSelectedValue(-1);
				oNoteTypesDrop.disable();
				$noteTypesDrop.change();
				$noteTypeRequiredIndicator.addClass(oElementStrings.sInvisible).removeClass(oElementStrings.sVisible);
			}
			$noteTypesDrop.toggleClass(oElementStrings.sRequiredNotSelected, bIsSaveToChartChecked);
		}

		if($target.hasClass(oElementStrings.sSubject) === true) {
			iValue = parseInt($target.val(), 10);
			var oFreetextSubject = m_leftPanel.fnGetTextboxes().oFreetextSubject;
			var $freetextSubject = oFreetextSubject.fnGetTextbox();
			if(iValue === iSubjectOtherCd) {
				$freetextSubject.addClass(oElementStrings.sVisible).removeClass(oElementStrings.sInvisible);
			}
			else {
				oFreetextSubject.fnSetText('');
				$freetextSubject.addClass(oElementStrings.sInvisible).removeClass(oElementStrings.sVisible).keyup();
			}
		}

		if($target.hasClass(oElementStrings.sSenderAddressType) === true) {
			if($target.val() > 0) {
				m_leftPanel.fnRetrievePrsnlAddress();
			}
			else {
				m_leftPanel.fnResetAddressInfo();
			}
		}

		if($target.hasClass(oElementStrings.sOption) === true) {
			validateForm();
		}

		if($target.hasClass(oElementStrings.sDrop)  === true) {
			iValue = parseInt($target.val(), 10);
			if(iValue > 0 && $target.hasClass(oElementStrings.sRequiredNotSelected) === true) {
				$target.addClass(oElementStrings.sRequiredSelected).removeClass(oElementStrings.sRequiredNotSelected);
			}
			else if(iValue === -1 && $target.hasClass(oElementStrings.sRequiredSelected) === true) {
				$target.addClass(oElementStrings.sRequiredNotSelected).removeClass(oElementStrings.sRequiredSelected);
			}
			m_rightPanel.updateSubjectContainer(m_leftPanel.getSelectionCriterion());
		}
	}
	function fnKeyupHandlers(event) {
		var $target = $(event.target);
		if($target.hasClass(oElementStrings.sFreetextSubject) === true) {
			$target.toggleClass('textboxHasInput', $target.val().length > 0);
			validateForm();
			m_rightPanel.updateSubjectContainer(m_leftPanel.getSelectionCriterion());
		}
		if($target.hasClass('searchCtrlInput') === true) {
			$target.addClass(oElementStrings.sRequiredNotSelected)
				.removeClass(oElementStrings.sRequiredSelected);
			m_leftPanel.fnResetAddressInfo();
			m_leftPanel.fnSetIsSenderSelected(false);
			validateForm();
		}
	}
	function fnDialogResizeHandler() {
		if ($('#' + oElementStrings.body).is(':visible') === false) {
			return;
		}
		var iWindowHeight = $(window).height(),
			iDialogVerticalPadding = 2 * m_dialog.getDialog().offset().top,
			iDialogHeaderHeight = m_header.getHeader().height(),
			iDialogFooterHeight = m_footer.getFooter().height(),
			$dialogBody = $('#' + oElementStrings.body),
			iDialogBodyPaddingTop = parseInt($dialogBody.css('padding-top'), 10),
			iDialogBodyPaddingBottom = parseInt($dialogBody.css('padding-bottom'), 10),
			iHeightOfOtherElements = iDialogVerticalPadding + iDialogHeaderHeight + iDialogFooterHeight + iDialogBodyPaddingTop + iDialogBodyPaddingBottom;
		$dialogBody
			.add($('#' + oElementStrings.leftPanel))
			.height(iWindowHeight - iHeightOfOtherElements);
		if (m_leftPanel.fnIsSenderDetailsPopoverVisible() === true) {
			m_leftPanel.fnCloseSenderDetailsPopover();
		}
	}
	function Header(id, parentId, cssArr, listName) {
		var self = this;
		self.$header = null;
		function init() {
			setHeader($('<div/>'));

			self.getHeader().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getHeader().addClass(cssArr.join(' '));
			}

			var headerHtml = '<div><span>' + i18n.genComm.GENERATECOMMUNICATION + ' - ' + listName;
				headerHtml += ' (' + m_patients.length + ')</span></div>';
				headerHtml += '<div class="cancel"><img class="close" src="' + controller.imagePaths.close + '"/></div>';

			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			self.getHeader().append(headerHtml).appendTo($target);

			$target = null;
		}
		function setHeader($newHeader) {
			self.$header = $newHeader;
		}
		this.show = function() {
			self.getHeader().show();
		};
		this.hide = function() {
			self.getHeader().hide();
		};
		this.getHeader = function() {
			return self.$header;
		};

		init();
	}
	function Footer(id, parentId, cssArr) {
		var self = this;
		self.$footer = null;
		var m_buttons = {};
		function init() {
			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			setFooter($('<div/>'));

			self.getFooter().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getFooter().addClass(cssArr.join(' '));
			}

			m_buttons.close = new DWL_Utils.Button('genCommFooterClose',['close', 'genCommDlgBtn'], i18n.rwl.CANCEL, false);
			m_buttons.generate = new DWL_Utils.Button('genCommFooterGenerate',['generate', 'genCommDlgBtn'], i18n.genComm.GENERATE, true);

			self.getFooter()
				.append(m_buttons.close.fnInit().getButton(),
						m_buttons.generate.fnInit().getButton()).appendTo($target);
			$target = null;
		}
		function setFooter($newFooter) {
			self.$footer = $newFooter;
		}
		this.show = function() {
			self.getFooter().show();
		};
		this.hide = function() {
			self.getFooter().hide();
		};
		this.getButtons = function() {
			return m_buttons;
		};
		this.getFooter = function() {
			return self.$footer;
		};

		init();
	}
	function LeftPanel(id, parentId, cssArr) {
		var self = this;
		self.$leftPanel = null;
		var oDropdowns = {};
		var oCheckboxes = {};
		var oTextboxes = {};
		var oSenderDetails = null;
		function init() {
			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			var oTextboxAttributes = {
					iMaxLength: 40
			};
			setLeftPanel($('<div/>'));

			self.getLeftPanel().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getLeftPanel().addClass(cssArr.join(' '));
			}

			oDropdowns.oSubject = new DWL_Utils.Dropdown('genCommSubjectDrop', [oElementStrings.sOption, oElementStrings.sDrop, oElementStrings.sSubject, oElementStrings.sRequiredNotSelected], m_loadedData.subjects);
			oDropdowns.oNoteType = new DWL_Utils.Dropdown('genCommNoteTypeDrop', [oElementStrings.sOption, oElementStrings.sDrop, oElementStrings.sNoteType], m_loadedData.noteTypes);
			oCheckboxes.oSaveToChart = new DWL_Utils.Checkbox('genCommSaveToChartCheck', [oElementStrings.sOption, oElementStrings.sSaveToChart], null, 'saveToChart', i18n.genComm.SAVETOCHART);
			oTextboxes.oFreetextSubject = new DWL_Utils.Textbox(oElementStrings.sFreetextSubject, [oElementStrings.sInvisible, oElementStrings.sFreetextSubject], oTextboxAttributes);

			oDropdowns.oSubject.init();
			oDropdowns.oNoteType.init();
			oCheckboxes.oSaveToChart.init();
			oTextboxes.oFreetextSubject.fnInit();

			oSenderDetails = new SenderDetailsContainer('genCommSenderDetailsArea', ['senderDetailsArea']);
			oSenderDetails.fnInit();

			var $saveToChartCheckbox = oCheckboxes.oSaveToChart.getCheckbox();
			var $saveToChartLabel = $saveToChartCheckbox.parent('label');

			self.getLeftPanel().append($('<div><span class="requiredIndicator">*</span>' + i18n.genComm.SUBJECT + '</div>'),
					oDropdowns.oSubject.getDropdown(),
					oTextboxes.oFreetextSubject.fnGetTextbox(),
					$saveToChartLabel,
					$('<div/>')
						.attr('id',oElementStrings.sNoteTypeLabel)
						.addClass(oElementStrings.sNoteTypeLabel)
						.append($('<span/>')
									.addClass(oElementStrings.sRequiredIndicator)
									.text('*'),
								$('<span/>')
									.text(i18n.genComm.NOTETYPE)),
					oDropdowns.oNoteType.getDropdown().addClass(oElementStrings.sRequiredNotSelected),
					oSenderDetails.fnGetDetailsContainer());

			$saveToChartCheckbox.prop('checked',true);
			$saveToChartLabel.addClass('genCommSaveToChartLabel');
			self.getLeftPanel().appendTo($target);

			$target = null;
		}
		function setLeftPanel($newLeftPanel) {
			self.$leftPanel = $newLeftPanel;
		}
		this.fnGetSenderAddress = function() {
			return oSenderDetails.fnGetSenderAddress();
		};
		this.fnGetSenderPrsnlId = function () {
			return oSenderDetails.fnGetSenderPrsnlId();
		};
		this.fnGetIsSenderSelected = function () {
			return oSenderDetails.fnGetIsSenderSelected();
		};
		this.fnSetIsSenderSelected = function (bSetSenderSelected) {
			oSenderDetails.fnSetIsSenderSelected(bSetSenderSelected);
		};
		this.fnLaunchAddressPopover = function() {
			oSenderDetails.fnLaunchAddressPopover();
		};
		this.fnRetrievePrsnlAddress = function() {
			oSenderDetails.fnRetrievePrsnlAddress();
		};
		this.fnResetAddressInfo = function() {
			oSenderDetails.fnResetAddressInfo();
		};
		this.fnIsSenderDetailsPopoverVisible = function() {
			var oAddressPopover = oSenderDetails.fnGetAddressPopover(),
				$addressPopover = null;
			if (DWL_Utils.isNullOrUndefined(oAddressPopover) === true) {
				return false;
			}
			$addressPopover = oAddressPopover.fnGetAddressPopover();
			if (DWL_Utils.isNullOrUndefined($addressPopover) === true) {
				return false;
			}
			return $addressPopover.is(':visible');
		};
		this.fnCloseSenderDetailsPopover = function() {
			var oAddressPopover = oSenderDetails.fnGetAddressPopover();
			if (DWL_Utils.isNullOrUndefined(oAddressPopover) === false) {
				oAddressPopover.fnClose();
			}
		};
		this.show = function() {
			self.getLeftPanel().show();
		};
		this.hide = function() {
			self.getLeftPanel().hide();
		};
		this.getSelectionCriterion = function getSelectionCriterion() {
			var selections = {};
			var sSubjectText = oDropdowns.oSubject.getSelectedText();
			var sFreetext = oTextboxes.oFreetextSubject.fnGetText();
			if($('#' + oElementStrings.sFreetextSubject).is(':hidden') === false && sFreetext.length > 0) {
				sSubjectText += ': ' + sFreetext;
			}

			selections.subjectValue = oDropdowns.oSubject.getSelectedValue();
			selections.subjectText = sSubjectText;
			selections.noteTypeValue = oDropdowns.oNoteType.getSelectedValue();
			selections.noteTypeText = oDropdowns.oNoteType.getSelectedText();
			selections.bSaveToChart = oCheckboxes.oSaveToChart.isChecked();

			return selections;
		};
		this.fnGetDropdowns = function() {
			return oDropdowns;
		};
		this.fnGetCheckboxes = function() {
			return oCheckboxes;
		};
		this.fnGetTextboxes = function() {
			return oTextboxes;
		};
		this.getLeftPanel = function() {
			return self.$leftPanel;
		};

		init();
	}
	function RightPanel(id, parentId, cssArr) {
		var self = this;
		self.$rightPanel = null;
		var textareaContainer;
		var subjectContainer;
		function init() {
			setRightPanel($('<div/>'));

			self.getRightPanel().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getRightPanel().addClass(cssArr.join(' '));
			}

			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			self.getRightPanel().appendTo($target);

			subjectContainer = new SubjectContainer(oElementStrings.subjectContainer, oElementStrings.rightPanel,[oElementStrings.subjectContainer]);
			textareaContainer = new TextareaContainer(oElementStrings.textareaContainer, oElementStrings.rightPanel, [oElementStrings.textareaContainer]);

			$target = null;
		}
		function setRightPanel($newRightPanel) {
			self.$rightPanel = $newRightPanel;
		}
		this.show = function() {
			self.getRightPanel().show();
		};
		this.hide = function() {
			self.getRightPanel().hide();
		};
		function getTextareaContainer() {
			return textareaContainer;
		}
		this.getEditorContent = function() {
			return getTextareaContainer().getContent();
		};
		this.getEditorText = function() {
			return getTextareaContainer().getText();
		};
		function getSubjectContainer() {
			return subjectContainer;
		}
		this.updateSubjectContainer = function(selections) {
			getSubjectContainer().updateContainerText(selections);
		};
		this.getRightPanel = function() {
			return self.$rightPanel;
		};
		this.removeEditor = function() {
			textareaContainer.removeEditor();
		};

		init();
	}
	function SenderDetailsContainer(sId, asCssClasses) {
		var oSelf = this;
		var $detailsContainer = null;
		var $providerSearch = null;
		var sSenderPrsnlName = '';
		var oSenderAddress = DWL_Utils.fnPopulateAddressObject({});
		var oAddressTypeDrop = null;
		var oAddressPopover = null;
		var iSenderPrsnlId = -1;
		this.fnGetSenderPrsnlId = function () {
			return iSenderPrsnlId;
		};
		this.fnGetIsSenderSelected = function () {
			return (iSenderPrsnlId > 0);
		};
		this.fnSetIsSenderSelected = function (bSetSenderSelected) {
			if(bSetSenderSelected === false)
			{
				iSenderPrsnlId = 0;
			}
		};
		function fnOnProviderSelected(oEvent, sPrsnlId, sName) {
			var iPrsnlId = parseInt(sPrsnlId, 10);
			if(isNaN(iPrsnlId) === false) {
				iSenderPrsnlId = iPrsnlId;
			}
			sSenderPrsnlName = sName;
			$(oEvent.target).val(sSenderPrsnlName)
				.addClass(oElementStrings.sRequiredSelected)
				.removeClass(oElementStrings.sRequiredNotSelected);

			oSelf.fnSetIsSenderSelected(true);
			validateForm();

			oAddressTypeDrop.enable();
		}
		function fnResizeTooltip(oEvent, oTooltip) {
			var iScrollWidth = 0;
			if($(oEvent.target).hasClass(oElementStrings.sSenderAddressText) === true) {
				iScrollWidth = $('#' + oElementStrings.sSenderAddressText)[0].scrollWidth;
				oTooltip.tooltip.css('max-width',iScrollWidth);
			}
		}
		function fnBuildAddressText(oAddress) {
			oSenderAddress = DWL_Utils.fnPopulateAddressObject(oAddress);
			var $addressText = $('#' + oElementStrings.sSenderAddressText);
			var sAddressHtml = '';

			if(oSenderAddress.SENDER_NAME.length > 0) {
				sAddressHtml += oSenderAddress.SENDER_NAME + '<br/>';
			}
			if(oSenderAddress.STREET_ADDR.length > 0) {
				sAddressHtml += oSenderAddress.STREET_ADDR + '<br/>';
			}
			if(oSenderAddress.STREET_ADDR2.length > 0) {
				sAddressHtml += oSenderAddress.STREET_ADDR2 + '<br/>';
			}
			if(oSenderAddress.STREET_ADDR3.length > 0) {
				sAddressHtml += oSenderAddress.STREET_ADDR3 + '<br/>';
			}
			if(oSenderAddress.STREET_ADDR4.length > 0) {
				sAddressHtml += oSenderAddress.STREET_ADDR4 + '<br/>';
			}
			if(oSenderAddress.CITY.length > 0 || oSenderAddress.STATE_DISP.length > 0 || oSenderAddress.ZIPCODE.length > 0) {
				if(oSenderAddress.CITY.length > 0) {
					sAddressHtml += oSenderAddress.CITY + i18n.genComm.S_CITY_STATE_SEPARATOR;
				}
				sAddressHtml += oSenderAddress.STATE_DISP + ' ' + oSenderAddress.ZIPCODE;
				if(oSenderAddress.COUNTRY_DISP.length > 0) {
					sAddressHtml += '<br/>';
				}
			}
			if(oSenderAddress.COUNTRY_DISP.length > 0) {
				sAddressHtml += oSenderAddress.COUNTRY_DISP;
			}

			$addressText.html(sAddressHtml);

			if(DWL_Utils.fnIsTextOverflowed($addressText.get(0)) === true) {
				$addressText
					.addClass('hasTooltip')
					.tooltip({content: sAddressHtml,
								items: $addressText,
								show: false,
								hide: false,
								open: fnResizeTooltip,
								tooltipClass: 'addressPopoverTooltip'});
			}
			else if($addressText.hasClass('hasTooltip') === true) {
				$addressText.removeClass('hasTooltip').tooltip('destroy');
			}
		}
		this.fnInit = function() {
			$detailsContainer = $('<div/>').attr('id', sId);
			$providerSearch = controller.createSearchControl();
			oAddressTypeDrop = new DWL_Utils.Dropdown(oElementStrings.sSenderAddressType, [oElementStrings.sSenderAddressType], m_loadedData.aAddressTypes);
			var oCriterion = controller.getCriterion().CRITERION;
			iSenderPrsnlId = oCriterion.PRSNL_ID;
			sSenderPrsnlName = oCriterion.PRSNL_NAME;
			oAddressPopover = new DWL_Utils.Component.AddressPopover('genCommAddressPopover', fnBuildAddressText);

			if($.isArray(asCssClasses) === true && asCssClasses.length > 0) {
				$detailsContainer.addClass(asCssClasses.join(' '));
			}

			oAddressTypeDrop.init();

			$detailsContainer
				.append($('<div/>')
							.attr('id', oElementStrings.sSenderHeader)
							.addClass(oElementStrings.sSenderHeader)
							.text(i18n.genComm.S_ON_BEHALF_OF),
						$('<div/>')
							.attr('id', oElementStrings.sSenderNameArea)
							.append($('<span/>')
								.addClass(oElementStrings.sRequiredIndicator)
								.text('*'),
						$('<span/>')
							.addClass('senderPrsnlNameLabel')
							.text(i18n.genComm.S_NAME)),
						$providerSearch
							.val(sSenderPrsnlName),
						$('<span/>')
							.addClass('senderAddressTypeLabel')
							.text(i18n.genComm.S_ADDRESS_TYPE),
						oAddressTypeDrop.getDropdown(),
						$('<div/>')
							.attr('id', oElementStrings.sSenderAddressArea)
							.addClass(oElementStrings.sSenderAddressArea + ' ' + oElementStrings.sInvisible)
							.append($('<div/>')
										.addClass(oElementStrings.sSenderAddressHeader)
										.text(i18n.genComm.S_ADDRESS),
									$('<div/>')
										.attr('id', oElementStrings.sSenderAddressText)
										.addClass(oElementStrings.sSenderAddressText),
									$('<div/>')
										.append($('<span/>')
													.addClass(oElementStrings.sSenderAddressEdit)
													.text(i18n.genComm.S_EDIT))))
				.bind('prsnlSelected', fnOnProviderSelected);
		};
		this.fnGetSenderAddress = function() {
			return oSenderAddress;
		};
		this.fnLaunchAddressPopover = function() {
			if($('#genCommAddressPopover').length === 0) {
				var $editTextSpan = $('#' + oElementStrings.sSenderAddressArea).find('.' + oElementStrings.sSenderAddressEdit);
				var iEditTextWidth = $editTextSpan.outerWidth(true);
				var oEditTextOffset = $editTextSpan.offset();
				var iEditTextLeft = oEditTextOffset.left;
				var iEditTextTop = oEditTextOffset.top;
				var iDialogHeight = $('#genCommDialog').outerHeight(true);
				var iMinAddressPopoverHeight = 360;
				var oPosition = {
					iXCoord: (iEditTextLeft + iEditTextWidth),
					iYCoord: (iDialogHeight - iMinAddressPopoverHeight),
					iArrowYCoord: (iEditTextTop - (iDialogHeight - iMinAddressPopoverHeight))
				};
				oAddressPopover.fnLaunch(oSenderAddress, oPosition);
				$('body').append(oAddressPopover.fnGetAddressPopover());
			}
		};
		this.fnRetrievePrsnlAddress = function() {
			var retrieveAddrReq = {
					retrieve_addresses_request: {
						prsnl: [{prsnl_id: iSenderPrsnlId}],
						address_types: [{address_type_cd: parseInt(oAddressTypeDrop.getSelectedValue(), 10)}]
					}
			};
			controller.makeCall('mp_dcp_retrieve_addresses', retrieveAddrReq, false, oSelf.fnUpdateAddress);
		};
		this.fnUpdateAddress = function(oPrsnlAddressInfo) {
			var $oSenderAddressAreaText = $('#' + oElementStrings.sSenderAddressText);
			var $oSenderAddressArea = $('#' + oElementStrings.sSenderAddressArea);

			if(DWL_Utils.isNullOrUndefined(oPrsnlAddressInfo) === false) {
				var aoPrsnlList = oPrsnlAddressInfo.PRSNL || [];
				var iPrsnlId = 0;
				var aoAddressList;
				var iAddrLen = 0;
				for(var p = 0, iPrsnlLen = aoPrsnlList.length; p < iPrsnlLen; p++) {
					iPrsnlId = aoPrsnlList[p].PRSNL_ID;
					if(iPrsnlId === iSenderPrsnlId) {
						aoAddressList = aoPrsnlList[p].ADDRESSES || [];
						iAddrLen = aoAddressList.length;
						if(iAddrLen > 0) {
							var oAddress = aoAddressList[0];
							oAddress.SENDER_NAME = sSenderPrsnlName;
							fnBuildAddressText(oAddress);
						}
						else {
							$oSenderAddressAreaText
								.html($('<span/>')
											.addClass('noAddr')
											.text(i18n.genComm.S_NO_ADDRESS));

							if($oSenderAddressAreaText.hasClass('hasTooltip') === true) {
								$oSenderAddressAreaText.removeClass('hasTooltip').tooltip('destroy');
							}

							oSenderAddress = DWL_Utils.fnPopulateAddressObject({});
						}
					}
				}
				$oSenderAddressArea.addClass(oElementStrings.sVisible).removeClass(oElementStrings.sInvisible);
			}
			else {
				$oSenderAddressArea.addClass(oElementStrings.sInvisible).removeClass(oElementStrings.sVisible);
				$oSenderAddressAreaText.html('');
				oSenderAddress = DWL_Utils.fnPopulateAddressObject({});
			}
		};
		this.fnResetAddressInfo = function() {
			var sCurrentProviderInput = $providerSearch.val();
			if(iSenderPrsnlId > 0 && sCurrentProviderInput.localeCompare(sSenderPrsnlName) !== 0) {
				iSenderPrsnlId = 0;
				sSenderPrsnlName = '';
				oAddressTypeDrop.fnSetSelectedValue('-1');
				oAddressTypeDrop.disable();
			}

			oSelf.fnUpdateAddress(null);
		};
		this.fnGetDetailsContainer = function() {
			return $detailsContainer;
		};
		this.fnGetAddressPopover = function() {
			return oAddressPopover;
		};

		return oSelf;
	}
	function TextareaContainer(id, parentId, cssArr) {
		var self = this;
		self.$textareaContainer = null;
		self.editorInstance = null;
		function init() {
			setContainer($('<div/>'));

			self.getContainer().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getContainer().addClass(cssArr.join(' '));
			}

			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			self.getContainer().appendTo($target);

			$target = null;

			createTextEditor();
		}
		function setContainer($newContainer) {
			self.$textareaContainer = $newContainer;
		}
		function setEditorFocus() {
			self.editorInstance.focus();
		}
		function createTextEditor() {
			self.getContainer().append($('<textarea id="' + oElementStrings.ckeditor + '"/>'));
			var basePath = controller.staticContentPath + '/js/utils/ckeditor/';
			var configObj = {};
			CKEDITOR.basePath = basePath;
			CKEDITOR.editorConfig(configObj);
			configObj.language = getLocale();
      configObj.on = {
				instanceReady : fnEditorReady
			};
			CKEDITOR.plugins.initializePlugins(configObj, function () {
			    self.editorInstance = CKEDITOR.replace(oElementStrings.ckeditor, configObj);
			});
		}
		function fnEditorReady(oEvent) {
			oEvent.editor.dataProcessor.writer.lineBreakChars = '';
			oEvent.editor.dataProcessor.writer.indentationChars = '';
			fnAddEventListeners();
		}
		function fnAddEventListeners() {
			$($('#cke_' + oElementStrings.ckeditor)).on('keyup mouseup', validateForm)
			                                        .on('click', setEditorFocus);
		}
		function getLocale() {
			var criterionLocale = controller.criterion.CRITERION.LOCALE_ID.toLowerCase();
			switch (criterionLocale) {
				case 'fr_fr':
					criterionLocale = 'fr';
					break;
				case 'en_us':
					criterionLocale = 'en';
					break;
				case 'en_au':
					criterionLocale = 'en-au';
					break;
				case 'es_es':
					criterionLocale = 'es';
					break;
				case 'de_de':
					criterionLocale = 'de';
					break;
				case 'en_gb':
					criterionLocale = 'en-gb';
					break;
				default:
					criterionLocale = 'en';
					break;
			}
			return criterionLocale;
		}
		this.getContent = function() {
			return self.editorInstance.getData();
		};
		this.getText = function() {
			return self.editorInstance.getData();
		};
		this.getContainer = function() {
			return self.$textareaContainer;
		};
		this.removeEditor = function() {
			self.editorInstance.setData('');
			self.editorInstance.execCommand(CKEDITOR_HIDE_AUTOTEXT_COMMAND);
			CKEDITOR.remove(self.editorInstance);
		};

		init();
	}
	function SubjectContainer(id, parentId, cssArr) {
		var self = this;
		self.$subjectContainer = null;
		function init() {
			setContainer($('<div/>'));

			self.getContainer().attr('id', id);

			if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
				self.getContainer().addClass(cssArr.join(' '));
			}

			var html = '<div id="' + oElementStrings.subjectContainerSubject + '"/>' +
						'<div id="' + oElementStrings.subjectContainerNoteType + '"/>';

			var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
			self.getContainer().append(html).appendTo($target);

			$target = null;
		}
		function setContainer($newContainer) {
			self.$subjectContainer = $newContainer;
		}
		this.updateContainerText = function(selections) {
			var bSubjectSelected = false;
			var subject = '';
			var noteType = '';
			if(DWL_Utils.isNullOrUndefined(selections.subjectText) === false && selections.subjectText.length > 0) {
				subject = selections.subjectText;
				bSubjectSelected = true;
			}
			$('#' + oElementStrings.subjectContainerSubject).html(subject);

			if(DWL_Utils.isNullOrUndefined(selections.noteTypeText) === false && selections.noteTypeText.length > 0) {
				noteType = selections.noteTypeText;
				if(bSubjectSelected === true) {
					noteType = '- ' + noteType;
				}
			}
			$('#' + oElementStrings.subjectContainerNoteType).html(noteType);
		};
		this.getContainer = function() {
			return self.$subjectContainer;
		};

		init();
	}
}
