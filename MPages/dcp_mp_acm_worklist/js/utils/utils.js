(function(){
	'use strict';
	/**
	 * An object that allows the creation of consistent HTML objects
	 * @namespace {Object} DWL_Utils
	 */
	this.DWL_Utils = $.extend(this.DWL_Utils || {}, {
		/**
		 * @returns {number} the width of the browser's scrollbar.
		 * @memberof DWL_Utils
		 * @public
		 */
		getScrollbarWidth: function() {
			var scrollbarWidth = 0;
			$('<div></div>')
			.css({
				width: '100px',
				height: '100px',
				overflow: 'scroll',
				position: 'absolute',
				top: '-200%'
			})
			.appendTo(document.body)
			.each(function () {
				scrollbarWidth = this.offsetWidth - this.clientWidth;
			})
			.remove();
			return scrollbarWidth;
		},
		/**
		 * Determines whether a given input is null or undefined
		 * @param {object} input - the input to check for null or undefined
		 * @return true if input is null or undefined false otherwise
		 * @memberOf DWL_Utils
		 * @public
		 */
		isNullOrUndefined: function(input) {
			return input === null || input === undefined;
		},

		/**
		 * Determines whether a given DOM element has truncated text
		 * @param {object} element - the DOM element to check
		 * @return true if the text has been truncated false otherwise
		 * @memberOf DWL_Utils
		 * @public
		 */
		fnIsTextOverflowed: function(oElement) {
			return oElement.offsetWidth < oElement.scrollWidth;
		},

		/**
		 * Gets the date string along with year
		 * @param {Date} dateLoc - Contains the date on when it is performed
		 * @param {number} iUTCOn - determines whether UTC is on or off
		 * @return {string} a string representing the date 
		 */
		fnGetDateString: function(dateLoc, iUTCOn) {
			var sTimeZone = iUTCOn === 1 ? " " + i18n.rwl.TIMEZONE + "": '';
			var dateStr = i18n.rwl.COMMENTDATEDISP.replace('{1}', sTimeZone);
			var separatorPosition = dateLoc.format(dateStr).indexOf(",");
			return dateLoc.format(dateStr).substr(0, separatorPosition) + " " + dateLoc.getFullYear() + dateLoc.format(dateStr).substr(separatorPosition);
		},

		/**
		 * Gets a given date as a display string
		 * @param {object} sSQLDate - the Date from the database
		 * @param {number} iUTCOn - determines whether UTC is on or off
		 * @return {string} a string representing the date
		 * @memberOf DWL_Utils
		 * @public
		 */
		fnGetDateDisplay: function(sSQLDate, iUTCOn) {
			var oJSDate = convertSQLDateStringToJS(sSQLDate);
			var oDateLoc = new Date();
			oDateLoc.setTime(oJSDate);
			var dateString = this.fnGetDateString(oDateLoc, iUTCOn);
			return dateString.replace('{2}', i18n.discernabu.MONTHNAMES[oDateLoc.getMonth()]);
		},

		/**
		 * Converts a JavaScript Date object into a SQL date string
		 * 		follows the following format: /Date(YYYY-MM-DDTHH:MM:SS.000+00:00)/
		 * @param {object} oDate - the date to convert
		 * @return the string representation of the date
		 * @memberOf DWL_Utils
		 * @public
		 */
		fnConvertJSDateToSQLString: function(oDate) {
			var iMonthOffset = 1;
			var sCurYear = oDate.getUTCFullYear();
			var sCurMonth = (oDate.getUTCMonth() + iMonthOffset).toString();
			var sCurDay = oDate.getUTCDate().toString();
			var sCurHour = oDate.getUTCHours().toString();
			var sCurMinute = oDate.getUTCMinutes().toString();
			var sCurSecond = oDate.getUTCSeconds().toString();
			var sSqlDateString = '/Date(' + sCurYear + '-';
			if(sCurMonth.length === 1) {
				sSqlDateString += '0' + sCurMonth;
			}
			else {
				sSqlDateString += sCurMonth;
			}
			sSqlDateString += '-';
			if(sCurDay.length === 1) {
				sSqlDateString += '0' + sCurDay;
			}
			else {
				sSqlDateString += sCurDay;
			}
			sSqlDateString += 'T';
			if(sCurHour.length === 1) {
				sSqlDateString += '0' + sCurHour;
			}
			else {
				sSqlDateString += sCurHour;
			}
			sSqlDateString += ':';
			if(sCurMinute.length === 1) {
				sSqlDateString += '0' + sCurMinute;
			}
			else {
				sSqlDateString += sCurMinute;
			}
			sSqlDateString += ':';
			if(sCurSecond.length === 1) {
				sSqlDateString += '0' + sCurSecond;
			}
			else {
				sSqlDateString += sCurSecond;
			}
			sSqlDateString += '.000+00:00)/';
			return sSqlDateString;
		},

		/**
		 * Populates an address object with all appropriate fields
		 * @param {object} oCurrentAddress - an address object to use for populating
		 * @return {object} a fully populated address object
		 * @memberOf DWL_Utils
		 * @public
		 */
		fnPopulateAddressObject: function(oCurrentAddress) {
			var oPopulatedAddress = {};
			oPopulatedAddress.SENDER_NAME = oCurrentAddress.SENDER_NAME || '';
			oPopulatedAddress.STREET_ADDR = oCurrentAddress.STREET_ADDR || '';
			oPopulatedAddress.STREET_ADDR2 = oCurrentAddress.STREET_ADDR2 || '';
			oPopulatedAddress.STREET_ADDR3 = oCurrentAddress.STREET_ADDR3 || '';
			oPopulatedAddress.STREET_ADDR4 = oCurrentAddress.STREET_ADDR4 || '';
			oPopulatedAddress.CITY = oCurrentAddress.CITY || '';
			oPopulatedAddress.STATE_CD = oCurrentAddress.STATE_CD || -1;
			oPopulatedAddress.S_STATE_CD =  oPopulatedAddress.STATE_CD.toString();
			oPopulatedAddress.STATE_DISP = oCurrentAddress.STATE_DISP || '';
			oPopulatedAddress.ZIPCODE = oCurrentAddress.ZIPCODE || '';
			oPopulatedAddress.COUNTRY_CD = oCurrentAddress.COUNTRY_CD || -1;
			oPopulatedAddress.S_COUNTRY_CD = oPopulatedAddress.COUNTRY_CD.toString();
			oPopulatedAddress.COUNTRY_DISP = oCurrentAddress.COUNTRY_DISP || '';

			return oPopulatedAddress;
		},

		/**
		 * Handles the creation and maintenance of a HTML Dialog object
		 * @constructor DWL_Utils.Dialog
		 * @param {string} id - the id that will be used in the creation of HTML element
		 * @param {string[]} cssArr - an array of CSS classes that will be added to the HTML element
		 * @param {string} parentId - the id of the parent HTML element that the Dialog will be appended to
		 * 								If parentId is null the Dialog will be appended to the body element
		 * @memberOf DWL_Utils
		 * @public
		 */
		Dialog: function(id, cssArr, parentId) {
			this.$dialog = null;
			var self = this;

			/**
			 * Creates the HTML Dialog object and attaches to the DOM
			 * @memberOf DWL_Utils.Dialog
			 * @private
			 */
			function init() {
				setDialog($('<div/>'));

				self.getDialog().attr('id', id);

				if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
					self.getDialog().addClass(cssArr.join(' '));
				}

				var $target = DWL_Utils.isNullOrUndefined(parentId) ? $('body') : $('#'+parentId);
				self.getDialog().appendTo($target);

				$target = null;
			}

			/**
			 * Sets the JQuery dialog object
			 * @param {object} $newDialog - the JQuery object to set the dialog to
			 * @memberOf DWL_Utils.Dialog
			 * @private
			 */
			function setDialog($newDialog) {
				self.$dialog = $newDialog;
			}

			/**
			 * Shows the HTML Dialog object
			 * @param {object} options - a map of additional options that are available to be used
			 * @memberOf DWL_Utils.Dialog
			 * @function show
			 * @public
			 */
			this.show = function(options) {
				self.getDialog().show(options);
			};

			/**
			 * Hides the HTML Dialog object
			 * @param {object} options - a map of additional options that are available to be used
			 * @memberOf DWL_Utils.Dialog
			 * @function hide
			 * @public
			 */
			this.hide = function(options) {
				self.getDialog().hide(options);
			};

			/**
			 * Removes the HTML Dialog object from the DOM
			 * @memberOf DWL_Utils.Dialog
			 * @function remove
			 * @public
			 */
			this.remove = function() {
				self.getDialog().remove();
			};

			/**
			 * Gets the JQuery dialog object
			 * @return {object} The JQuery object representing the dialog
			 * @memberOf DWL_Utils.Dialog
			 * @function getDialog
			 * @public
			 */
			this.getDialog = function() {
				return self.$dialog;
			};

			init();
		},

		/**
		 * Handles the creation and maintenance of a HTML Button object
		 * @constructor DWL_Utils.Button
		 * @param {string} id - the id that will be used in the creation of HTML element
		 * @param {string[]} cssArr - an array of CSS classes that will be added to the HTML element
		 * @param {string} label - the value that the HTML element will display
		 * @param {boolean} isDisabled - determines whether the HTML element is initially disabled or enabled
		 * @memberOf DWL_Utils
		 * @public
		 */
		Button: function(id, cssArr, label, isDisabled) {
			var $button = null;
			var oSelf = this;

			/**
			 * Sets the JQuery button object
			 * @param {object} $newButton - the JQuery object to set the button to
			 * @memberOf DWL_Utils.Button
			 * @function setButton
			 * @private
			 */
			function setButton($newButton) {
				$button = $newButton;
			}

			/**
			 * Creates the HTML button object and attaches to the DOM
			 * @return {object} the Button object
			 * @memberOf DWL_Utils.Button
			 * @public
			 */
			this.fnInit = function() {
				setButton($('<input type="button"/>').attr('id', id));

				if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
					oSelf.getButton().addClass(cssArr.join(' '));
				}

				if(DWL_Utils.isNullOrUndefined(label) === false) {
					oSelf.getButton().val(label);
				}

				if(isDisabled === true) {
					oSelf.disable();
				}

				return oSelf;
			};

			/**
			 * Enables the HTML button object
			 * @memberOf DWL_Utils.Button
			 * @function enable
			 * @public
			 */
			this.enable = function() {
				oSelf.getButton().prop('disabled', false);
			};

			/**
			 * Disables the HTML button object
			 * @memberOf DWL_Utils.Button
			 * @function disable
			 * @public
			 */
			this.disable = function() {
				oSelf.getButton().prop('disabled', true);
			};

			/**
			 * Gets the JQuery button object
			 * @return {object} the JQuery object representing the button
			 * @memberOf DWL_Utils.Button
			 * @function getButton
			 * @public
			 */
			this.getButton = function() {
				return $button;
			};

			return oSelf;
		},

		/**
		 * Handles the creation and maintenance of a HTML checkbox object
		 * @constructor DWL_Utils.Checkbox
		 * @param {string} id - the id that will be used in the creation of HTML element
		 * @param {string[]} cssArr - an array of CSS classes that will be added to the HTML element
		 * @param {string} name - the name of the HTML element
		 * @param {string} value - the value of the HTML element
		 * @param {string} label - the value that the HTML element will display
		 * @return a Checkbox object
		 * @memberOf DWL_Utils
		 * @public
		 */
		Checkbox: function(id, cssArr, name, value, label) {
			var $checkbox = null;
			var self = this;

			/**
			 * Sets the JQuery checkbox object
			 * @param {object} $newCheckbox - the JQuery object to set the checkbox to
			 * @memberOf DWL_Utils.Checkbox
			 * @private
			 */
			function setCheckbox($newCheckbox) {
				$checkbox = $newCheckbox;
			}

			/**
			 * Creates the HTML checkbox object
			 * @memberOf DWL_Utils.Checkbox
			 * @public
			 */
			this.init = function() {
				setCheckbox($('<input/>'));
				self.getCheckbox().attr({
					'id': id,
					'type': 'checkbox'
				});

				if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
					self.getCheckbox().addClass(cssArr.join(' '));
				}

				if(DWL_Utils.isNullOrUndefined(name) === false) {
					self.getCheckbox().attr('name', name);
				}

				if(DWL_Utils.isNullOrUndefined(value) === false) {
					self.getCheckbox().val(value);
				}

				var $label = $('<label/>');

				if(DWL_Utils.isNullOrUndefined(label) === false) {
					$label.text(label);
				}
				$label.prepend(self.getCheckbox());
				return self;
			};

			/**
			 * Gets the value of the HTML checkbox object
			 * @return {string|number} the value of the checkbox
			 * @memberOf DWL_Utils.Checkbox
			 * @function getValue
			 * @public
			 */
			this.getValue = function() {
				return self.getCheckbox().val();
			};

			/**
			 * Gets the checked property for the HTML checkbox object
			 * @return {boolean} whether the checkbox is checked
			 * @memberOf DWL_Utils.Checkbox
			 * @function isChecked
			 * @public
			 */
			this.isChecked = function() {
				return self.getCheckbox().prop('checked');
			};

			/**
			 * Gets the JQuery checkbox object
			 * @return {object} the JQuery object representing the checkbox
			 * @memberOf DWL_Utils.Checkbox
			 * @function getCheckbox
			 * @public
			 */
			this.getCheckbox = function() {
				return $checkbox;
			};

			return self;
		},

		/**
		 * Handles the creation and maintenance of a HTML dropdown object
		 * @constructor DWL_Utils.Dropdown
		 * @param {string} id - the id that will be used in the creation of HTML element
		 * @param {string[]} cssArr - an array of CSS classes that will be added to the HTML element
		 * @param {object[]} options - an array of objects that will be used to populate the HTML element
		 * @memberOf DWL_Utils
		 * @public
		 */
		Dropdown: function(id, cssArr, options) {
			var $dropdown = null;
			var self = this;

			/**
			 * Sets the JQuery dropdown object
			 * @param {object} $newDropdown - the JQuery object to set the dropdown to
			 * @memberOf DWL_Utils.Dropdown
			 * @private
			 */
			function setDropdown($newDropdown) {
				$dropdown = $newDropdown;
			}

			/**
			 * Creates the HTML dropdown object and attaches to the DOM
			 * @memberOf DWL_Utils.Dropdown
			 * @public
			 */
			this.init = function() {
				setDropdown($('<select/>'));

				self.getDropdown().attr('id', id);

				if(DWL_Utils.isNullOrUndefined(cssArr) === false && cssArr.length > 0) {
					self.getDropdown().addClass(cssArr.join(' '));
				}

				if(DWL_Utils.isNullOrUndefined(options) === false && options.length > 0) {
					self.populateDropdown(options);
				}

				return self;
			};

			/**
			 * Enables the HTML dropdown object
			 * @memberOf DWL_Utils.Dropdown
			 * @function enable
			 * @public
			 */
			this.enable = function() {
				self.getDropdown().prop('disabled', false);
			};

			/**
			 * Disables the HTML dropdown object
			 * @memberOf DWL_Utils.Dropdown
			 * @function disable
			 * @public
			 */
			this.disable = function() {
				self.getDropdown().prop('disabled', true);
			};

			/**
			 * Gets the text of the currently selected option
			 * @return {string} the text of the selected option
			 * @memberOf DWL_Utils.Dropdown
			 * @function getSelectedText
			 * @public
			 */
			this.getSelectedText = function() {
				return self.getDropdown().find(':selected').text();
			};

			/**
			 * Gets the value of the currently selected option
			 * @return {string|number} the value of the selected option
			 * @memberOf DWL_Utils.Dropdown
			 * @function getSelectedValue
			 * @public
			 */
			this.getSelectedValue = function() {
				return self.getDropdown().val();
			};

			/**
			 * Sets the value of the currently selected option
			 * @param {string|number} value - the value to set the selected option to
			 * @memberOf DWL_Utils.Dropdown
			 * @function fnSetSelectedValue
			 * @public
			 */
			this.fnSetSelectedValue = function(value) {
				self.getDropdown().val(value);
			};

			/**
			 * Builds the options for the dropdown and adds them to the dropdown
			 * @param {object[]} an array of objects that represent the options to be added to the dropdown
			 * @memberOf DWL_Utils.Dropdown
			 * @function populateDropdown
			 * @public
			 */
			this.populateDropdown = function(options) {
				var length = options.length;
				var html = '<option value="-1"/>';
				for(var i = 0; i < length; i ++) {
					html += '<option value="' + options[i].value + '">' + options[i].text + '</option>';
				}

				self.getDropdown().html(html);
			};

			/**
			 * Gets the JQuery dropdown object
			 * @return {object} the JQuery object representing the dropdown
			 * @memberOf DWL_Utils.Dropdown
			 * @function getDropdown
			 * @public
			 */
			this.getDropdown = function() {
				return $dropdown;
			};

			return self;
		},

		/**
		 * Handles the creation and maintenance of a HTML textbox object
		 * @constructor DWL_Utils.Textbox
		 * @param {string} sId - the id that will be used in the creation of HTML element
		 * @param {string[]} aCssClasses - an array of CSS classes that will be added to the HTML element
		 * @param {object} oAttributes - an object containing attributes to add to the element
		 * 		@param {number} oAttributes.iMaxLength - the max length of the element
		 * @memberOf DWL_Utils
		 * @public
		 */
		Textbox: function(sId, aCssClasses, oAttributes) {
			var $textbox = null;
			var oSelf = this;

			/**
			 * Sets the JQuery textbox object
			 * @param {object} $newTextbox - the JQuery object to set the textbox to
			 * @memberOf DWL_Utils.Textbox
			 * @private
			 */
			function fnSetTextbox($newTextbox) {
				$textbox = $newTextbox;
			}

			/**
			 * Creates the HTML textbox object
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnInit = function() {
				fnSetTextbox($('<input/>'));

				oSelf.fnGetTextbox().attr({
					'id': sId,
					'type': 'text'
				});

				if(DWL_Utils.isNullOrUndefined(aCssClasses) === false && aCssClasses.length > 0) {
					oSelf.fnGetTextbox().addClass(aCssClasses.join(' '));
				}

				if(DWL_Utils.isNullOrUndefined(oAttributes) === false && DWL_Utils.isNullOrUndefined(oAttributes.iMaxLength) === false) {
					oSelf.fnGetTextbox().attr('maxlength', oAttributes.iMaxLength);
				}

				return oSelf;
			};

			/**
			 * Enables the HTML textbox object
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnEnable = function() {
				oSelf.fnGetTextbox().prop('disabled', false);
			};

			/**
			 * Disables the HTML textbox object
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnDisable = function() {
				oSelf.fnGetTextbox().prop('disabled', true);
			};

			/**
			 * Shows the HTML textbox object
			 * @param {object} options - a map of additional options that are available to be used
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnShow = function(options) {
				oSelf.fnGetTextbox().show(options);
			};

			/**
			 * Hides the HTML textbox object
			 * @param {object} options - a map of additional options that are available to be used
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnHide = function(options) {
				oSelf.fnGetTextbox().hide(options);
			};

			/**
			 * Gets the text of the textbox
			 * @return {string} the text of the textbox
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnGetText = function() {
				return oSelf.fnGetTextbox().val();
			};

			/**
			 * Sets the text of the textbox
			 * @param {string} sText - the text to set the textbox to
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnSetText = function(sText) {
				oSelf.fnGetTextbox().val(sText);
			};

			/**
			 * Gets the JQuery textbox object
			 * @return {object} the JQuery object representing the textbox
			 * @memberOf DWL_Utils.Textbox
			 * @public
			 */
			this.fnGetTextbox = function() {
				return $textbox;
			};
		}
	});
}.call(this));
