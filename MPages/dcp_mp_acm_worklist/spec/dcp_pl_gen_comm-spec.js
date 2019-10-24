(function(){
	'use strict';
	this.CKEDITOR = {
			basePath: '',
			skins: {
				updatePaths: function(skin) {
					skin = '';
				}
			},
			editorConfig: function(config) {
				config = {};
			},
			config: {
				customConfig: ''
			},
			replace: function(id, configObj) {
				id = '';
				configObj = {};
				return {
					editorId: id,
					config: configObj,
					setData: function(data) {
						data = '';
					},
					execCommand: jasmine.createSpy('execCommandSpy')
				};
			},
			remove: function(instance) {
				instance = null;
			},
      plugins: {
          initializePlugins: function (configObj, callback) {
            callback();
          }
      }
	};
}.call(this));

(function() {
	'use strict';
	describe('genComm', function() {
		var oPreviousoPvGenerateCommunications = oPvGenerateCommunications;

		//Using criterion and patientlists from my own login
		var criterion = json_parse(Mock.Common.CRITERION);
		var patientlists = json_parse(Mock.Common.PATIENTLISTS);

		var iPatientListId = 12345;
		var sWorklistName = 'testName';
		var m_controller = new ACM_Controller();
		m_controller.setData(criterion,patientlists);

		var genComm = new GenComm(m_controller);

		beforeAll(function() {
			spyOn(m_controller, 'getActivePatientListID').and.returnValue(iPatientListId);
			spyOn(m_controller, 'createSearchControl').and.returnValue($('<input type ="text" class="searchCtrlInput fullWidth"/>'));
			genComm.setLoadedData(Mock.Common.SCRIPT_REPLIES.GEN_COMM_DATA);
			genComm.launch(sWorklistName, []);
		});

		it('verify grayed out background is added to the DOM', function() {
			expect($('#genCommDlgBackground')).toBeInDOM();
			expect($('#genCommDlgBackground')).toBeVisible();
		});

		it('verify dialog is added to the DOM', function() {
			expect($('#genCommDialog')).toBeInDOM();
			expect($('#genCommDialog')).toBeVisible();
		});

		describe('printing exception', function(){
			var oPrintingError = new Error('Throwing Error');
			beforeAll(function(){
				oPvGenerateCommunications = jasmine.createSpyObj('oPvGenerateCommunicationsSpy', ['PrintLetters']);
				oPvGenerateCommunications.PrintLetters.and.throwError(oPrintingError);
				spyOn(m_controller, 'logErrorMessages').and.callThrough();
			});
			it('throws an exception',function(){
				genComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPvGenerateCommunications.PrintLetters).toThrowError();
				expect(m_controller.logErrorMessages).toHaveBeenCalled();
			});
			it('triggers the printing intiation fail callback', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), oPrintingError);
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
			});
			afterAll(function() {
				oPvGenerateCommunications = oPreviousoPvGenerateCommunications;
			});
		});

		describe('printing', function() {
			beforeEach(function(){
				oPvGenerateCommunications = jasmine.createSpyObj('oPvGenerateCommunicationsSpy', ['PrintLetters']);
			});
			it('verify empty reply is handled',function(){
				genComm.fnPrintLetters({});
				expect(oPvGenerateCommunications.PrintLetters).not.toHaveBeenCalled();
			});

			it('verify undefined is handled',function(){
				genComm.fnPrintLetters(undefined);
				expect(oPvGenerateCommunications.PrintLetters).not.toHaveBeenCalled();
			});

			it('verify null is handled',function(){
				genComm.fnPrintLetters(null);
				expect(oPvGenerateCommunications.PrintLetters).not.toHaveBeenCalled();
			});

			it('verify com function is called',function(){
				genComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPvGenerateCommunications.PrintLetters).toHaveBeenCalled();
			});
			it('triggers the printing intiation success callback when proper reply comes back', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPrintFailureSpy).not.toHaveBeenCalled();
			});
			it('triggers the printing intiation failure callback when reply is null', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.fnPrintLetters(null);
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error('invalid reply from mp_dcp_generate_communication script'));
			});
			it('triggers the printing intiation failure callback when reply is empty object', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.fnPrintLetters(null);
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error('invalid reply from mp_dcp_generate_communication script'));
			});
			it('triggers the printing intiation failure callback when reply is in failure status', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.fnPrintLetters({
					STATUS_DATA: {
						STATUS: 'F'
					}
				});
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error('invalid reply from mp_dcp_generate_communication script'));
			});
			it('triggers the printing intiation failure callback when reply has no broadcast id', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oGenComm.fnPrintLetters({
					STATUS_DATA: {
						STATUS: 'S'
					},
					BROADCAST_ID: ''
				});
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error ('invalid communcation id'));
			});
			it('triggers the printing intiation failure callback when oPvGenerateCommunications is null', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oGenComm = new GenComm(m_controller);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oPvGenerateCommunications = null;
				oGenComm.fnPrintLetters({
					STATUS_DATA: {
						STATUS: 'S'
					},
					BROADCAST_ID: 'some id'
				});
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error ('oPvGenerateCommunications is undefined'));
			});
			it('should have correct number of letters sent to printer in the state', function() {
				var I_PRINT_BUTTON_OK = 1,
					oGenComm = new GenComm(m_controller),
					aoExpectedLettersPrinted = Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION.LETTERS_PATIENT_GROUP;
				oGenComm.fnGetState().oGenCommBuckets.aoLetters = Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION.LETTERS_PATIENT_GROUP;
				oPvGenerateCommunications.PrintLetters.and.returnValue(I_PRINT_BUTTON_OK);

				oGenComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPvGenerateCommunications.PrintLetters.calls.count()).toEqual(1);

				(oPvGenerateCommunications.PrintLetters.calls.argsFor(0)[3])();
				expect(m_controller.isPendingData()).toBe(false);
				expect(oGenComm.fnGetState().iLettersSentToPrinter).toEqual(aoExpectedLettersPrinted.length);
			});
			it('should have 0 in the print bucket if comm object status was 0 (i.e. print dialog was canceled)', function() {
				var oGenComm = new GenComm(m_controller),
					aoExpectedLettersPrinted = [];
				oPvGenerateCommunications.PrintLetters.and.returnValue(0);
				oGenComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oGenComm.fnGetState().oGenCommBuckets.aoLetters).toEqual(aoExpectedLettersPrinted);
			});
			it('should have 0 as the letters sent to printer if comm object status was 2 (i.e. print template was not found)', function() {
				var oPrintFailureSpy = jasmine.createSpy('printFailureSpy'),
					oPrintSuccessSpy = jasmine.createSpy('printSuccessSpy'),
					oController = jasmine.createSpyObj('controllerSpy', ['logErrorMessages']),
					oGenComm = new GenComm(oController);
				oGenComm.oInitatePrintProcess.done(oPrintSuccessSpy);
				oGenComm.oInitatePrintProcess.fail(oPrintFailureSpy);
				oPvGenerateCommunications.PrintLetters.and.returnValue(2);
				oGenComm.fnPrintLetters(Mock.Common.SCRIPT_REPLIES.GENERATE_COMMUNICATION);
				expect(oPrintSuccessSpy).not.toHaveBeenCalled();
				expect(oPrintFailureSpy).toHaveBeenCalledWith(oGenComm.fnGetState(), new Error ('print template could not be found'));
				expect(oController.logErrorMessages).toHaveBeenCalledWith('', 'print template could not be found','GenComm.fnPrintLetters');
				expect(oGenComm.fnGetState().iLettersSentToPrinter).toEqual(0);
			});
			it('should trigger print even if number of patients in letter bucket is 0', function() {
				var sCommId = 'some-id',
					sSendersAddress = '{}',
					oScriptReplyWithNoPrintPatients = {
						MESSAGE_PATIENTS_GROUP: [],
						LETTERS_PATIENT_GROUP: [],
						PHONE_CALLS_GROUP: [],
						BROADCAST_ID: sCommId,
						STATUS_DATA: {
							STATUS: 'S'
						}
					},
					oGenComm = new GenComm(m_controller);
				oPvGenerateCommunications.PrintLetters.and.returnValue(0);
				oGenComm.fnPrintLetters(oScriptReplyWithNoPrintPatients);
				expect(oPvGenerateCommunications.PrintLetters).toHaveBeenCalledWith(sCommId, sSendersAddress, 0, jasmine.any(Function));
			});
			afterAll(function() {
				oPvGenerateCommunications = oPreviousoPvGenerateCommunications;
			});
		});

		describe('state', function() {
			it('should have the worklist name in the state', function() {
				var oGenCommState = genComm.fnGetState();
				expect(oGenCommState.sListName).toEqual(sWorklistName);
			});
			it('should have the worklist id in the state', function() {
				var oGenCommState = genComm.fnGetState();
				expect(oGenCommState.iListId).toEqual(iPatientListId);
			});
		});

		it('verify header is added to the DOM', function() {
			expect($('#genCommHeader')).toBeInDOM();
			expect($('#genCommHeader')).toBeVisible();
		});

		it('verify body is added to the DOM', function() {
			expect($('#genCommBody')).toBeInDOM();
			expect($('#genCommBody')).toBeVisible();
		});

		it('verify left panel is added to the DOM', function() {
			expect($('#genCommLeftPanel')).toBeInDOM();
			expect($('#genCommLeftPanel')).toBeVisible();
			expect($('#genCommSubjectDrop')).toBeInDOM();
			expect($('#genCommSubjectDrop')).toBeVisible();
			expect($('#genCommSubjectDrop')).toEqual('select');
			expect($('#genCommSubjectDrop')).toHaveValue('-1');
			expect($('#genCommSubjectDrop')).toHaveClass('requiredNotSelected');
			expect($('#genCommFreetextSubject')).toBeInDOM();
			expect($('#genCommFreetextSubject')).toHaveClass('invisible');
			expect($('#genCommFreetextSubject')).toHaveValue('');
			expect($('#genCommSaveToChartCheck')).toBeInDOM();
			expect($('#genCommSaveToChartCheck')).toBeVisible();
			expect($('#genCommSaveToChartCheck')).toBeChecked();
			expect($('#genCommNoteTypeDrop')).toBeInDOM();
			expect($('#genCommNoteTypeDrop')).toBeVisible();
			expect($('#genCommNoteTypeDrop')).toEqual('select');
			expect($('#genCommNoteTypeDrop')).toHaveValue('-1');
			expect($('#genCommNoteTypeDrop')).not.toBeDisabled();
			expect($('#genCommSenderDetailsArea')).toBeInDOM();
			expect($('#genCommSenderDetailsArea')).toBeVisible();
			expect($('#senderDetailsHeader')).toBeInDOM();
			expect($('#senderDetailsHeader')).toBeVisible();
			var $providerSearch = $('#genCommSenderDetailsArea').find('.searchCtrlInput');
			expect($providerSearch).toBeInDOM();
			expect($providerSearch).toBeVisible();
			expect($providerSearch).toHaveValue('Jim  Bond');
			expect($('#senderAddressType')).toBeInDOM();
			expect($('#senderAddressType')).toBeVisible();
			expect($('#senderAddressType')).toEqual('select');
			expect($('#senderAddressType')).toHaveValue('-1');
			expect($('#senderAddressType')).not.toBeDisabled();
			expect($('#senderAddressArea')).toBeInDOM();
			expect($('#senderAddressArea')).toHaveClass('invisible');
			expect($('#senderAddressArea .senderAddressAreaHeader')).toBeInDOM();
			expect($('#senderAddressAreaText')).toBeInDOM();
			expect($('#senderAddressAreaText')).toBeEmpty();
			expect($('#senderAddressArea .senderAddressAreaEdit')).toBeInDOM();
		});

		it('verify right panel is added to the DOM', function() {
			expect($('#genCommRightPanel')).toBeInDOM();
			expect($('#genCommRightPanel')).toBeVisible();
			expect($('#genCommTextareaContainer')).toBeInDOM();
			expect($('#genCommTextareaContainer')).toBeVisible();
			expect($('#genCommCKEditor')).toBeInDOM();
			expect($('#genCommCKEditor')).toBeVisible();
			expect($('#genCommSubjectContainer')).toBeInDOM();
			expect($('#genCommSubjectContainer')).toBeVisible();
			expect($('#subjectContainerNoteType')).toBeInDOM();
			expect($('#subjectContainerNoteType')).toBeVisible();
			expect($('#subjectContainerSubject')).toBeInDOM();
			expect($('#subjectContainerSubject')).toBeVisible();
		});

		it('verify footer is added to the DOM', function() {
			expect($('#genCommFooter')).toBeInDOM();
			expect($('#genCommFooter')).toBeVisible();
			expect($('#genCommFooterClose')).toBeInDOM();
			expect($('#genCommFooterClose')).toBeVisible();
			expect($('#genCommFooterClose')).toEqual('input');
			expect($('#genCommFooterGenerate')).toBeInDOM();
			expect($('#genCommFooterGenerate')).toBeVisible();
			expect($('#genCommFooterGenerate')).toEqual('input');
			expect($('#genCommFooterGenerate')).toBeDisabled();
		});

		describe('verify elements are removed from DOM on close', function() {
			beforeAll(function() {
				spyOn(m_controller, 'enableGenCommButton');
				$('#genCommFooterClose').click();
			});

			it('verify gray background is removed', function() {
				expect($('#genCommDlgBackground')).not.toBeInDOM();
			});

			it('verify header is removed', function() {
				expect($('#genCommHeader')).not.toBeInDOM();
			});

			it('verify body is removed', function() {
				expect($('#genCommBody')).not.toBeInDOM();
			});

			it('verify left panel is removed', function() {
				expect($('#genCommLeftPanel')).not.toBeInDOM();
				expect($('#genCommSubjectDrop')).not.toBeInDOM();
				expect($('#genCommFreetextSubject')).not.toBeInDOM();
				expect($('#genCommNoteTypeDrop')).not.toBeInDOM();
				expect($('#genCommSaveToChartCheck')).not.toBeInDOM();
				expect($('#genCommSenderDetailsArea')).not.toBeInDOM();
				expect($('#senderDetailsHeader')).not.toBeInDOM();
				expect($('#genCommSenderDetailsArea .searchCtrlInput')).not.toBeInDOM();
				expect($('#senderAddressType')).not.toBeInDOM();
			});

			it('verify right panel is removed', function() {
				expect($('#genCommRightPanel')).not.toBeInDOM();
			});

			it('verify footer is removed', function() {
				expect($('#genCommFooter')).not.toBeInDOM();
				expect($('#genCommFooterClose')).not.toBeInDOM();
				expect($('#genCommFooterGenerate')).not.toBeInDOM();
			});

			it('leaves the gen comm button enabled if the dialog is closed', function() {
				expect(m_controller.enableGenCommButton).toHaveBeenCalledWith(true);
			});
		});
	});
})();
