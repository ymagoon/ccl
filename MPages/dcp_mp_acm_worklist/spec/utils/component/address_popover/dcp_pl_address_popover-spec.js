(function() {
	'use strict';
	var oPosition = {
		iXCoord: 0,
		iYCoord: 0,
		iArrowYCoord: 0
	};
	describe('Address Popover', function() {
		var addressPopover = null;
		var fnOnApply;
		beforeAll(function() {
			window.m_criterionJSON = Mock.Common.CRITERION;
			window.m_patientlists = Mock.Common.PATIENTLISTS;

			RenderDCPPatientList();
			spyOn(m_controller, 'makeCall');
			//spyOn(window.m_controller, 'getCriterion').and.returnValue(json_parse(Mock.Common.CRITERION));
			fnOnApply = jasmine.createSpy('fnOnApply');


			addressPopover = new DWL_Utils.Component.AddressPopover('testAddressPopover',fnOnApply);
			addressPopover.fnSetLoadedData(Mock.Common.SCRIPT_REPLIES.ADDRESS_POPOVER_DATA);
			addressPopover.fnLaunch({}, oPosition);
			$('body').append(addressPopover.fnGetAddressPopover());
		});

		it('verify address popover is added to the DOM', function() {
			expect($('#testAddressPopover')).toBeInDOM();
			expect($('#testAddressPopover')).toBeVisible();
			expect($('#testAddressPopover .addressPopover')).toBeInDOM();
			expect($('#testAddressPopover .addressPopover')).toBeVisible();
			expect($('#testAddressPopover .addressPopoverArrow')).toBeInDOM();
			expect($('#testAddressPopover .addressPopoverArrow')).toBeVisible();
		});

		it('verify body is added to the DOM', function() {
			expect($('#testAddressPopover .addressPopoverBody')).toBeInDOM();
			expect($('#testAddressPopover .addressPopoverBody')).toBeVisible();
			expect($('#addressFromText')).toBeInDOM();
			expect($('#addressFromText')).toBeVisible();
			expect($('#addressFromText')).toEqual('input');
			expect($('#addressFromText')).toHaveValue('');
			expect($('#addressStreet1Text')).toBeInDOM();
			expect($('#addressStreet1Text')).toBeVisible();
			expect($('#addressStreet1Text')).toEqual('input');
			expect($('#addressStreet1Text')).toHaveValue('');
			expect($('#addressStreet2Text')).toBeInDOM();
			expect($('#addressStreet2Text')).toBeVisible();
			expect($('#addressStreet2Text')).toEqual('input');
			expect($('#addressStreet2Text')).toHaveValue('');
			expect($('#addressStreet3Text')).toBeInDOM();
			expect($('#addressStreet3Text')).toBeVisible();
			expect($('#addressStreet3Text')).toEqual('input');
			expect($('#addressStreet3Text')).toHaveValue('');
			expect($('#addressStreet4Text')).toBeInDOM();
			expect($('#addressStreet4Text')).toBeVisible();
			expect($('#addressStreet4Text')).toEqual('input');
			expect($('#addressStreet4Text')).toHaveValue('');
			expect($('#addressCityText')).toBeInDOM();
			expect($('#addressCityText')).toBeVisible();
			expect($('#addressCityText')).toEqual('input');
			expect($('#addressCityText')).toHaveValue('');
			expect($('#addressZipText')).toBeInDOM();
			expect($('#addressZipText')).toBeVisible();
			expect($('#addressZipText')).toEqual('input');
			expect($('#addressZipText')).toHaveValue('');
			expect($('#addressStateDrop')).toBeInDOM();
			expect($('#addressStateDrop')).toBeVisible();
			expect($('#addressStateDrop')).toEqual('select');
			expect($('#addressStateDrop')).toHaveValue('-1');
			expect($('#addressCountryDrop')).toBeInDOM();
			expect($('#addressCountryDrop')).toBeVisible();
			expect($('#addressCountryDrop')).toEqual('select');
			expect($('#addressCountryDrop')).toHaveValue('-1');
		});

		it('verify footer is added to the DOM', function() {
			expect($('#testAddressPopover .addressPopoverFooter')).toBeInDOM();
			expect($('#testAddressPopover .addressPopoverFooter')).toBeVisible();
			expect($('#addressPopoverFooterCancel')).toBeInDOM();
			expect($('#addressPopoverFooterCancel')).toBeVisible();
			expect($('#addressPopoverFooterCancel')).not.toBeDisabled();
			expect($('#addressPopoverFooterCancel')).toEqual('input');
			expect($('#addressPopoverFooterApply')).toBeInDOM();
			expect($('#addressPopoverFooterApply')).toBeVisible();
			expect($('#addressPopoverFooterApply')).not.toBeDisabled();
			expect($('#addressPopoverFooterApply')).toEqual('input');
		});

		it('verify address popover is not removed when focus is lost', function() {
			expect($('#testAddressPopover')).toBeInDOM();
			expect($('#testAddressPopover')).toBeVisible();
			$('body').click();
			expect($('#testAddressPopover')).toBeInDOM();
			expect($('#testAddressPopover')).toBeVisible();
		});

		it('verify address popover is removed from the DOM', function() {
			expect($('#testAddressPopover')).toBeInDOM();
			expect($('#testAddressPopover')).toBeVisible();
			$('#addressPopoverFooterApply').click();
			expect($('#testAddressPopover')).not.toBeInDOM();
			expect($('#testAddressPopover .addressPopover')).not.toBeInDOM();
			expect($('#testAddressPopover .addressPopoverBody')).not.toBeInDOM();
			expect($('#testAddressPopover .addressPopoverFooter')).not.toBeInDOM();
			expect(fnOnApply).toHaveBeenCalled();
		});

		afterAll(function() {
			$(addressPopover.fnGetAddressPopover()).remove();
		});
	});
	describe('Address popover', function() {
		describe('close', function() {
			it('should clear the popover from dom', function() {
				var sAddressPopoverId = 'addresspopoverId',
					oAddressPopover = new DWL_Utils.Component.AddressPopover(sAddressPopoverId, null);
				oAddressPopover.fnSetLoadedData(Mock.Common.SCRIPT_REPLIES.ADDRESS_POPOVER_DATA);
				oAddressPopover.fnLaunch({}, oPosition);
				setFixtures(oAddressPopover.fnGetAddressPopover());
				expect(oAddressPopover.fnGetAddressPopover()).toBeInDOM();
				oAddressPopover.fnClose();
				expect(oAddressPopover.fnGetAddressPopover()).not.toBeInDOM();
				expect(oAddressPopover.fnGetAddressPopover()).toBeNull();
			});
		});
	});
})();
