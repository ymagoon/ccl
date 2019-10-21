(function() {
	'use strict';
	var oGlobal = this;
	
	/**
	 * Handles the creation and management of the Address Popover
	 * @param {string} sId - the ID to be used in the creation of the Popover
	 * @param {function} fnOnApply - a function that handles what happens when an address is applied
	 * @constructor AddressPopver 
	 * @memberOf DWL_Utils.Component
	 * @public
	 */
	function AddressPopover(sId, fnOnApply) {
		var oSelf = this;
		var $addressPopover = null;
		var oLoadedData = {};
		var oCurrentAddress = {};
		var oElementStrings = {
				sBody: 'addressPopoverBody',
				sFooter: 'addressPopoverFooter',
				sArrow: 'addressPopoverArrow',
				sButton: 'addressPopoverBtn',
				sCancelButton: 'addressPopoverFooterCancel',
				sApplyButton: 'addressPopoverFooterApply',
				sClose: 'close',
				sApply: 'apply',
				sFromSection: 'addressFromSection',
				sStreet1Section: 'addressStreet1Section',
				sStreet2Section: 'addressStreet2Section',
				sStreet3Section: 'addressStreet3Section',
				sStreet4Section: 'addressStreet4Section',
				sCityStateZip: 'addressCityStateZipSection',
				sCitySection: 'addressCitySection',
				sStateSection: 'addressStateSection',
				sZipSection: 'addressZipSection',
				sCountrySection: 'addressCountrySection',
				sFromText: 'addressFromText',
				sStreet1Text: 'addressStreet1Text',
				sStreet2Text: 'addressStreet2Text',
				sStreet3Text: 'addressStreet3Text',
				sStreet4Text: 'addressStreet4Text',
				sCityText: 'addressCityText',
				sStateDrop: 'addressStateDrop',
				sZipText: 'addressZipText',
				sCountryDrop: 'addressCountryDrop',
				sAddressLabel: 'addressLabel',
				sAddressStreetLine: 'addressStreetLine',
				sAddressCityLine: 'addressCityLine',
				sAddressStateLine: 'addressStateLine',
				sAddressZipLine: 'addressZipLine',
				sAddressCountryLine: 'addressCountryLine',
				sAddressFromExample: 'addressFromExample',
				sLeftFloat: 'leftFloat',
				sPaddingRight: 'paddingRight',
				sPaddingBottom: 'paddingBottom'
		};
		
		var oTextboxAttributes = {
			oAddressLineAttributes: {
				iMaxLength: 100
			},
			oZipAttributes: {
				iMaxLength: 25
			}
		};
		
		/**
		 * Builds the body of the Address Popover
		 * @return {object} a JQuery object representing the body
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		function fnBuildBody() {
			var $body = $('<div/>').addClass(oElementStrings.sBody);
			oCurrentAddress = DWL_Utils.fnPopulateAddressObject(oCurrentAddress);
			var aoStates = oLoadedData.aoStates || [];
			var aoCountries = oLoadedData.aoCountries || [];
			var oSenderNameTextbox = new DWL_Utils.Textbox(oElementStrings.sFromText, [oElementStrings.sAddressStreetLine, oElementStrings.sFromText], oTextboxAttributes.oAddressLineAttributes);
			var oStreetAddr1Textbox = new DWL_Utils.Textbox(oElementStrings.sStreet1Text, [oElementStrings.sAddressStreetLine, oElementStrings.sStreet1Text], oTextboxAttributes.oAddressLineAttributes);
			var oStreetAddr2Textbox = new DWL_Utils.Textbox(oElementStrings.sStreet2Text, [oElementStrings.sAddressStreetLine, oElementStrings.sStreet2Text], oTextboxAttributes.oAddressLineAttributes);
			var oStreetAddr3Textbox = new DWL_Utils.Textbox(oElementStrings.sStreet3Text, [oElementStrings.sAddressStreetLine, oElementStrings.sStreet3Text], oTextboxAttributes.oAddressLineAttributes);
			var oStreetAddr4Textbox = new DWL_Utils.Textbox(oElementStrings.sStreet4Text, [oElementStrings.sAddressStreetLine, oElementStrings.sStreet4Text], oTextboxAttributes.oAddressLineAttributes);
			var oCityTextbox = new DWL_Utils.Textbox(oElementStrings.sCityText, [oElementStrings.sAddressCityLine, oElementStrings.sCityText], oTextboxAttributes.oAddressLineAttributes);
			var oStateDrop = new DWL_Utils.Dropdown(oElementStrings.sStateDrop, [oElementStrings.sAddressStateLine, oElementStrings.sStateDrop], aoStates);
			var oZipTextbox = new DWL_Utils.Textbox(oElementStrings.sZipText, [oElementStrings.sAddressZipLine, oElementStrings.sZipText], oTextboxAttributes.oZipAttributes);
			var oCountryDrop = new DWL_Utils.Dropdown(oElementStrings.sCountryDrop, [oElementStrings.sAddressCountryLine, oElementStrings.sCountryDrop], aoCountries);

			oSenderNameTextbox.fnInit().fnSetText(oCurrentAddress.SENDER_NAME);
			oStreetAddr1Textbox.fnInit().fnSetText(oCurrentAddress.STREET_ADDR);
			oStreetAddr2Textbox.fnInit().fnSetText(oCurrentAddress.STREET_ADDR2);
			oStreetAddr3Textbox.fnInit().fnSetText(oCurrentAddress.STREET_ADDR3);
			oStreetAddr4Textbox.fnInit().fnSetText(oCurrentAddress.STREET_ADDR4);
			oCityTextbox.fnInit().fnSetText(oCurrentAddress.CITY);
			oZipTextbox.fnInit().fnSetText(oCurrentAddress.ZIPCODE);
			oStateDrop.init().fnSetSelectedValue(oCurrentAddress.S_STATE_CD);
			oCountryDrop.init().fnSetSelectedValue(oCurrentAddress.S_COUNTRY_CD);
			
			$body
				.append($('<div/>')
							.addClass(oElementStrings.sFromSection)
							.append($('<span/>')
										.addClass(oElementStrings.sAddressLabel)
										.text(i18n.genComm.S_FROM),
									oSenderNameTextbox.fnGetTextbox(),
									$('<span/>')
										.addClass(oElementStrings.sAddressFromExample)
										.text(i18n.genComm.S_FROM_EXAMPLE)),
						$('<div/>')
							.addClass(oElementStrings.sStreet1Section)
							.append($('<span/>')
										.addClass(oElementStrings.sAddressLabel)
										.text(i18n.genComm.S_STREET_ADDR_1),
									oStreetAddr1Textbox.fnGetTextbox()),
						$('<div/>')
							.addClass(oElementStrings.sStreet2Section)
							.append($('<span/>')
										.addClass(oElementStrings.sAddressLabel)
										.text(i18n.genComm.S_STREET_ADDR_2),
									oStreetAddr2Textbox.fnGetTextbox()),
						$('<div/>')
							.addClass(oElementStrings.sStreet3Section)
							.append($('<span/>')
										.addClass(oElementStrings.sAddressLabel)
										.text(i18n.genComm.S_STREET_ADDR_3),
									oStreetAddr3Textbox.fnGetTextbox()),
						$('<div/>')
							.addClass(oElementStrings.sStreet4Section)
							.append($('<span/>')
										.addClass(oElementStrings.sAddressLabel)
										.text(i18n.genComm.S_STREET_ADDR_4),
									oStreetAddr4Textbox.fnGetTextbox()),
						$('<div/>')
							.addClass(oElementStrings.sCityStateZip)
							.append($('<div/>')
										.addClass(oElementStrings.sCitySection + ' ' + oElementStrings.sLeftFloat + ' ' +  oElementStrings.sPaddingRight)
										.append($('<span/>')
													.addClass(oElementStrings.sAddressLabel)
													.text(i18n.genComm.S_CITY),
												oCityTextbox.fnGetTextbox()),
									$('<div/>')
										.addClass(oElementStrings.sStateSection + ' ' + oElementStrings.sLeftFloat + ' ' +  oElementStrings.sPaddingRight + ' ' + oElementStrings.sPaddingBottom)
										.append($('<span/>')
													.addClass(oElementStrings.sAddressLabel)
													.text(i18n.genComm.S_STATE),
												oStateDrop.getDropdown()),
									$('<div/>')
										.addClass(oElementStrings.sZipSection + ' ' + oElementStrings.sLeftFloat + ' ' +  oElementStrings.sPaddingRight)
										.append($('<span/>')
													.addClass(oElementStrings.sAddressLabel)
													.text(i18n.genComm.S_ZIP),
												oZipTextbox.fnGetTextbox()),
									$('<div/>')
										.addClass(oElementStrings.sCountrySection + ' ' + oElementStrings.sLeftFloat + ' ' + oElementStrings.sPaddingBottom)
										.append($('<span/>')
													.addClass(oElementStrings.sAddressLabel)
													.text(i18n.genComm.S_COUNTRY),
												oCountryDrop.getDropdown())));
			
			return $body;
		}
		
		/**
		 * Builds the footer of the Address Popover
		 * @return {object} the JQuery object representing the footer
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		function fnBuildFooter() {
			var $footer = $('<div/>').addClass(oElementStrings.sFooter);
			var oCancelButton = new DWL_Utils.Button(oElementStrings.sCancelButton,[oElementStrings.sClose, oElementStrings.sButton], i18n.rwl.CANCEL, false);
			var oApplyButton = new DWL_Utils.Button(oElementStrings.sApplyButton,[oElementStrings.sApply, oElementStrings.sButton], i18n.rwl.APPLY, false);
			
			$footer
				.append(oCancelButton.fnInit().getButton(),
						oApplyButton.fnInit().getButton());
			
			return $footer;
		}
		
		/**
		 * Attaches the event listeners to the Address Popover
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		function fnAttachEventListeners() {
			$addressPopover.click(fnClickHandler).focusout(fnFocusOutHandler);
		}
		
		/**
		 * Handles the click events on the Address Popover
		 * @param {object} oEvent - represents the event that was fired
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		function fnClickHandler(oEvent) {
			if($(oEvent.target).hasClass(oElementStrings.sClose) === true) {
				oSelf.fnClose();
			}
			
			if($(oEvent.target).hasClass(oElementStrings.sApply) === true) {
				fnOnApply(oCurrentAddress);
				oSelf.fnClose();
			}
		}
		
		/**
		 * Handles the focusout events on the Address Popover
		 * @param {object} oEvent - represents the event that was fired
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		function fnFocusOutHandler(oEvent) {
			var $target = $(oEvent.target);
			var iDropVal = -1;

			if($target.hasClass(oElementStrings.sFromText) === true) {
				oCurrentAddress.SENDER_NAME = $target.val();
			}
			else if($target.hasClass(oElementStrings.sStreet1Text) === true) {
				oCurrentAddress.STREET_ADDR = $target.val();
			}
			else if($target.hasClass(oElementStrings.sStreet2Text) === true) {
				oCurrentAddress.STREET_ADDR2 = $target.val();
			}
			else if($target.hasClass(oElementStrings.sStreet3Text) === true) {
				oCurrentAddress.STREET_ADDR3 = $target.val();
			}
			else if($target.hasClass(oElementStrings.sStreet4Text) === true) {
				oCurrentAddress.STREET_ADDR4 = $target.val();
			}
			else if($target.hasClass(oElementStrings.sCityText) === true) {
				oCurrentAddress.CITY = $target.val();
			}
			else if($target.hasClass(oElementStrings.sZipText) === true) {
				oCurrentAddress.ZIPCODE = $target.val();
			}
			else if($target.hasClass(oElementStrings.sStateDrop) === true) {
				iDropVal = parseInt($target.val(), 10);
				oCurrentAddress.STATE_CD = iDropVal;
				oCurrentAddress.STATE_DISP = $target.find(':selected').text();
			}
			else if($target.hasClass(oElementStrings.sCountryDrop) === true) {
				iDropVal = parseInt($target.val(), 10);
				oCurrentAddress.COUNTRY_CD = iDropVal;
				oCurrentAddress.COUNTRY_DISP = $target.find(':selected').text();
			}
		}
		
		/**
		 * Creates the HTML Address Popover object
		 * @param {object} oAddress - an object containing an address to populate the Popover with
		 * @param {object} oPosition - an object containing needed positioning information
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @public
		 */
		this.fnLaunch = function(oAddress, oPosition) {
			if(DWL_Utils.isNullOrUndefined(oLoadedData.aoStates) === true || DWL_Utils.isNullOrUndefined(oLoadedData.aoCountries) === true) {
				m_controller.makeCall('mp_dcp_get_addr_data',null,false, oSelf.fnSetLoadedData);
			}

			oCurrentAddress = oAddress;

			$addressPopover = $('<div/>')
								.attr('id', sId)
								.addClass('addressPopoverOuterDiv')
								.css({
									left: oPosition.iXCoord,
									top: oPosition.iYCoord
								})
								.append($('<div/>')
											.addClass(oElementStrings.sArrow)
											.css('top', oPosition.iArrowYCoord),
										$('<div/>')
											.addClass('addressPopover leftFloat')
											.append(fnBuildBody(), 
													fnBuildFooter()));

			fnAttachEventListeners();
		};
		
		/**
		 * Sets the retrieved data to the oLoadedData object
		 * @param {object} reply - the retrieved data to save
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @public
		 */
		this.fnSetLoadedData = function(reply) {
			if(DWL_Utils.isNullOrUndefined(reply) === true || $.isEmptyObject(reply) === true || reply.STATUS_DATA.STATUS.toUpperCase() !== 'S') {
				m_controller.logErrorMessages('', 'mp_dcp_retrieve_gen_comm_data script failed','GenComm.setLoadedData');
				return;
			}
			
			var aoStates = reply.STATES;
			var aoNewStates = [];
			var aoCountries = reply.COUNTRIES;
			var aoNewCountries = [];
			
			for(var s = 0, iStateLen = aoStates.length; s < iStateLen; s++) {
				aoNewStates.push({value: aoStates[s].STATE_CD, text: aoStates[s].STATE_DISP});
			}
			oLoadedData.aoStates = aoNewStates;
			
			for(var c = 0, iCountryLen = aoCountries.length; c < iCountryLen; c++) {
				aoNewCountries.push({value: aoCountries[c].COUNTRY_CD, text: aoCountries[c].COUNTRY_DISP});
			}
			oLoadedData.aoCountries = aoNewCountries;
		};
		
		/**
		 * Gets the JQuery Address Popover object
		 * @return {object} The JQuery object representing the Address Popover
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @public
		 */
		this.fnGetAddressPopover = function() {
			return $addressPopover;
		};
		
		/**
		 * Closes the Address Popover and clears the data
		 * @memberOf DWL_Utils.Component.AddressPopover
		 * @private
		 */
		this.fnClose = function() {
			oSelf.fnGetAddressPopover().remove();
			$addressPopover = null;
			oCurrentAddress = {};
		};
		
		return oSelf;
	}
	
	oGlobal.DWL_Utils.Component.AddressPopover = AddressPopover;
}).call(this);