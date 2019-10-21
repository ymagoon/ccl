(function(oGlobal) {
	'use strict';
		var fnMockAndStubController = function() {
			var oMockController = jasmine.createSpyObj('controllerSpy', ['getCriterion', 'getPatientById', 'getBedrockPrefs']);
			oMockController.getCriterion.and.returnValue({
				CRITERION: {
					UTC_ON: 1
				}
			});
			oMockController.getBedrockPrefs.and.returnValue({
				GENERATE_COMMUNICATION: {
					PHONE_NOTE_TYPE: 0
				}
			});
			oMockController.getPatientById.and.returnValue({});
			return oMockController;
		},
		S_CANCEL_BUTTON_ID = 'ptPhoneCancel';
	describe('Popover UI', function() {
		var popover = null;
		beforeAll(function() {
			window.m_criterionJSON = Mock.Common.CRITERION;
			window.m_patientlists = Mock.Common.PATIENTLISTS;
			
			RenderDCPPatientList();
			spyOn(window.m_controller, 'getPatientById').and.returnValue(Mock.Common.PATIENT_OBJECTS.POPOVER_PATIENT);
			spyOn(window.m_controller, 'makeCall');
			spyOn(window.m_controller, 'getCriterion').and.returnValue(json_parse(Mock.Common.CRITERION));
			spyOn(window.m_controller, 'fnUpdatePatientPhoneCalls');
			spyOn(window.m_controller, 'getBedrockPrefs').and.returnValue({
				GENERATE_COMMUNICATION: {
					PHONE_NOTE_TYPE: 0
				}
			});
			var oProps = {
					sId: 'patientPendingCallPopover',
					sParentId: null,
					iXCord: 0,
					iYCord: 0,
					sDisplayPosition: 'up',
					iPatientId:  0
			};
			popover = new DWL_Utils.Component.Popover(oProps);
			popover.fnRender();
		});
		
		it('verify dialog is added to the DOM', function() {
			expect($('#patientPendingCallPopover')).toBeInDOM();
			expect($('#patientPendingCallPopover')).toBeVisible();
			expect($('#popoverContentDiv')).toBeInDOM();
			expect($('#popoverContentDiv')).toBeVisible();
		});
		
		it('verify header is added to the DOM', function() {
			expect($('#popoverHeader')).toBeInDOM();
			expect($('#popoverHeader')).toBeVisible();
		});
		
		it('verify body is added to the DOM', function() {
			expect($('#popoverBody')).toBeInDOM();
			expect($('#popoverBody')).toBeVisible();
		});
		
		it('verify footer is added to the DOM', function() {
			expect($('#popoverFooter')).toBeInDOM();
			expect($('#popoverFooter')).toBeVisible();
		});
		
		it('verify a completed call has the approriate class added', function() {
			expect($('#call17711498')).toBeInDOM();
			expect($('#call17711498')).toBeVisible();
			expect($('#call17711498')).toHaveClass('completedCall');
		});
		
		it('verify moving a pending call to complete updates the UI', function() {
			expect($('#checkcall17700525')).toBeInDOM();
			expect($('#checkcall17700525')).toBeVisible();
			$('#checkcall17700525').click();
			expect($('#call17700525')).toHaveClass('completedCall');
		});
		
		it('verify popover is removed from the DOM', function() {
			expect($('#patientPendingCallPopover')).toBeInDOM();
			expect($('#patientPendingCallPopover')).toBeVisible();
			expect($('#popoverContentDiv')).toBeInDOM();
			expect($('#popoverContentDiv')).toBeVisible();
			popover.fnRemove();
			expect($('#patientPendingCallPopover')).not.toBeInDOM();
			expect($('#popoverContentDiv')).not.toBeInDOM();
			expect($('#popoverHeader')).not.toBeInDOM();
			expect($('#popoverBody')).not.toBeInDOM();
			expect($('#popoverFooter')).not.toBeInDOM();
		});
	});
	describe('Popover', function() {
		var Popover = DWL_Utils.Component.Popover,
			oPreviousController = null;
		beforeEach(function() {
			oPreviousController = oGlobal.m_controller;
		});
		it('exposes a promise to attach callbacks which will get executed once the popover is closed', function() {
			var oPopover = null,
				fnPopoverRemovalSpy = jasmine.createSpy('popoverRemovalSpy');
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new Popover({}).fnRender();
			expect(oPopover.fnOnRemoval).toBeDefined();
			oPopover.fnOnRemoval(fnPopoverRemovalSpy);
			$('#' + S_CANCEL_BUTTON_ID).click();
			expect(fnPopoverRemovalSpy).toHaveBeenCalled();
		});
		afterEach(function() {
			oGlobal.m_controller = oPreviousController;
		});
	});
	describe('Overlaying popover', function() {
		var OverlayingPopover = DWL_Utils.Component.OverlayingPopover,
			oPreviousController = null;
		beforeEach(function() {
			oPreviousController = oGlobal.m_controller;
		});
		it('can be created', function() {
			var oPopover = null;
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new OverlayingPopover({
				oPopover: {},
				oOverlay: {}
			});
			expect(oPopover).toBeDefined();
		});
		it('renders to the body', function() {
			var oPopover = null,
				sExpectedOverlayId = 'someOverlayId',
				sExpectedOverlayClass = 'someOverlayClass',
				sExpectedPopoverId = 'somePopoverId';
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new OverlayingPopover({
				oPopover: {
					sId: sExpectedPopoverId
				},
				oOverlay: {
					sId: sExpectedOverlayId,
					sClasses: sExpectedOverlayClass
				}
			});
			expect('#' + sExpectedOverlayId).not.toBeInDOM();
			expect('.' + sExpectedOverlayClass).not.toBeInDOM();
			expect('#' + sExpectedOverlayId).not.toContainElement('#' + sExpectedPopoverId);
			oPopover.fnRender();
			expect('#' + sExpectedOverlayId).toBeInDOM();
			expect('.' + sExpectedOverlayClass).toBeInDOM();
			expect('#' + sExpectedOverlayId).toContainElement('#' + sExpectedPopoverId);
			$('#' + sExpectedOverlayId).remove();
		});
		it('provides access to the underlying popover element', function() {
			var oPopover = null,
				sExpectedOverlayId = 'someOverlayId',
				sExpectedPopoverId = 'somePopoverId';
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new OverlayingPopover({
				oPopover: {
					sId: sExpectedPopoverId
				},
				oOverlay: {
					sId: sExpectedOverlayId
				}
			});
			oPopover.fnRender();
			expect(oPopover.fnGetUnderlyingPopoverElement()).toEqual('#' + sExpectedPopoverId);
			$('#' + sExpectedOverlayId).remove();
		});
		it('exposes a promise to attach callbacks which will get executed once the popover is closed', function() {
			var oPopover = null,
				sExpectedOverlayId = 'someId',
				fnPopoverRemovalSpy = jasmine.createSpy('popoverRemovalSpy');
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new OverlayingPopover({
				oPopover: {},
				oOverlay: {
					sId: sExpectedOverlayId
				}
			}).fnRender();
			expect(oPopover.fnOnRemoval).toBeDefined();
			oPopover.fnOnRemoval(fnPopoverRemovalSpy);
			$('#' + S_CANCEL_BUTTON_ID).click();
			expect(fnPopoverRemovalSpy).toHaveBeenCalled();
			$('#' + sExpectedOverlayId).remove();
		});
		it('removes itself from DOM if its popover is closed', function() {
			var oPopover = null,
				sExpectedOverlayId = 'someId';
			oGlobal.m_controller = fnMockAndStubController();
			oPopover = new OverlayingPopover({
				oPopover: {},
				oOverlay: {
					sId: sExpectedOverlayId
				}
			}).fnRender();
			expect('#' + sExpectedOverlayId).toBeInDOM();
			expect('#' + S_CANCEL_BUTTON_ID).toBeInDOM();
			$('#' + S_CANCEL_BUTTON_ID).click();
			expect('#' + sExpectedOverlayId).not.toBeInDOM();
			expect('#' + S_CANCEL_BUTTON_ID).not.toBeInDOM();
		});
		describe('remove function', function() {
			it('removes itself from the DOM when invoked', function() {
				var oPopover = null,
					sExpectedOverlayId = 'someId';
				oGlobal.m_controller = fnMockAndStubController();
				oPopover = new OverlayingPopover({
					oPopover: {},
					oOverlay: {
						sId: sExpectedOverlayId
					}
				}).fnRender();
				expect('#' + sExpectedOverlayId).toBeInDOM();
				oPopover.fnRemove();
				expect('#' + sExpectedOverlayId).not.toBeInDOM();
			});
		});
		afterEach(function() {
			oGlobal.m_controller = oPreviousController;
		});
	});
})(this);