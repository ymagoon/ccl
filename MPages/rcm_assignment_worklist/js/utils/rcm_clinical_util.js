// TODO: Move these i18n strings to the core i18n file, 
i18n.RCM_COMMUNICATION = "Communication";

//cross-origin resource sharing 
$.support.cors = true;

var RCM_Clinical_Util = function() {
	return {		
		getOauthToken : function(component, service, callback) {
			var sendAr = [];
			sendAr.push("^MINE^", "0.0", "^GETOAUTHINFO^");
			json = {"get_oauth_info_request":{"webService":service}};
			sendAr.push("^",JSON.stringify(json),"^");
	    	RCM_Clinical_Util.makeTimerCCLRequest(component, "RCM_OAUTH", sendAr, true,
	    		function(status, recordData, errorInfo) {
	    			callback(status, recordData);
	    		});
		},
		
		/**
		 * Returns the first component whose constructor matches the specified constructor. 
		 * 
		 * @param {Object} mPage The MPage.
		 * @param {Function} componentConstructor The component constructor function. 
		 * 
		 * @return {Object} Returns the component(s) whose constructor matches the specified constructor. Otherwise returns no value.
		 */
		getMPageComponent : function(mPage, componentConstructor) {
			var components = mPage.getComponents();
			if (components) {
				var foundDocuments = [];
				for (var pos = 0, length = components.length; pos < length; pos++) {
					if (components[pos] instanceof componentConstructor) {	
						foundDocuments.push(components[pos]);
					}
				}
				if (foundDocuments.length === 1) {
					return foundDocuments[0];
				}
				// It could have more than one component matches the type.
				else if (foundDocuments.length > 1) {
					return foundDocuments;
				}
			}
			else {
				alert("The MPage configuration has not be completed.  See your system admistrator.");
			}
		},
		
		/**
		 * Move all components in the MPage to the another location.
		 * @param {Object} mPage The MPage
		 * @param {Array} a list of excluded component
		 * @param {Object} the location the components to move to
		 * 
		 * @return {Object} the array map of components and original parent sections
		 */
		moveMpageComponent : function(mPage, excludedComponents, movedParentNode) {
			var movedComponentMap = {};
			var movedComponentArray = [];
			var movedComponentParentArray = [];
			var components = mPage.getComponents();
			for (var pos = 0, length = components.length; pos < length; pos++) {
				var component = components[pos];
				var excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				if (excluded !== true) {
					// remember the old parent section.
					movedComponentArray.push(component.getRootComponentNode());
					movedComponentParentArray.push(component.getRootComponentNode().parentNode);
					// move components to new parent section.
					$(movedParentNode).append($(component.getRootComponentNode()));
				}
			}
			movedComponentMap["component"] = movedComponentArray;
			movedComponentMap["componetParent"] = movedComponentParentArray;
			return movedComponentMap;
		},
		
		/**
		 * Move back all components to original parent sections.
		 * @param {Object} the array map of components and original parent sections
		 */
		movebackMpageComponent : function(movedComponentMap) {
			var movedComponentArray = movedComponentMap["component"];
			var movedComponentParentArray = movedComponentMap["componetParent"];
			if (movedComponentArray && movedComponentParentArray) {
				for (var pos = 0, length = movedComponentArray.length; pos < length; pos++) {
					var componentNode = movedComponentArray[pos];
					var movebackNode = movedComponentParentArray[pos]; 
					$(movebackNode).append($(componentNode));
				}
			}
		},
		
		addNextMPageButton : function(parentNode, criterion, nextMPage, buttonLabel) {
			var button = Util.cep("input",{"type" : "button", "value" : buttonLabel, "className" : "next-mpage-button"});
			RCM_Clinical_Util.addNextMPageListener(criterion, nextMPage, button);
			parentNode.appendChild(button);
		},
		
		addNextMPageListener : function(criterion, nextMPage, button) {
			button.onclick = function() {	
				var pageParams = [];
				pageParams.push("^MINE^,");
				pageParams.push(criterion.person_id+",");		
				pageParams.push(criterion.encntr_id+",");
				pageParams.push(criterion.provider_id+",^");
				// Escape the backslashes in the static content path
				pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
				pageParams.push(nextMPage+"^,^powerchart.exe^,^");
				pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
				CCLLINK('mp_common_driver', pageParams.join(""), 1);
			};			
		},
		
		forwardNextMPage : function(criterion, nextMPage)
		{
			var pageParams = [];
			pageParams.push("^MINE^,");
			pageParams.push(criterion.person_id+",");		
			pageParams.push(criterion.encntr_id+",");
			pageParams.push(criterion.provider_id+",^");
			// Escape the backslashes in the static content path
			pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
			pageParams.push(nextMPage+"^,^powerchart.exe^,^");
			pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
			CCLLINK('mp_common_driver', pageParams.join(""), 1);
		},
		
		// Places the MPage components into the first column while maintaining their sequence order 
		moveComponentsIntoOneColumn : function(mPage) {
			var components = mPage.getComponents();
			var maxSequences = [];
			var firstColumn = 1;
			var length = components.length;
			var pos;
			var component;
			var column;			
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if (column < maxSequences.length) {
					maxSequences[column] = Math.max(maxSequences[column], component.getSequence());
				} 
				else {
					maxSequences[column] = component.getSequence();
				}
			}
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if(column > firstColumn) {
					var sequenceStart = 0;
					for(var nextColumn = firstColumn; nextColumn < column; nextColumn++) {
						sequenceStart += maxSequences[nextColumn];
					}
					component.setColumn(firstColumn);
					component.setSequence(component.getSequence()+sequenceStart);
				}
			}
			return firstColumn;
		}, 
		
		setColumnsToAvailableHeight : function(mPage, columnClasses) {			
			var columns = [];
			// The banner requires vertical space, hence the 0.90 multiplier
			var heightRatio = mPage.isBannerEnabled() ? 0.90 : 0.99;
			var height = gvs()[0] * heightRatio;
			for (var pos = 0, length = columnClasses.length; pos < length; pos++) {
				var column = Util.Style.g(columnClasses[pos], document, "div")[0];
				if (column) {
					column.style.height = height;
					columns.push(column);				
				}
			}
			return columns;
		}, 
		
		addDatePicker : function(component, textBoxId) {
			var defaultMonthDayYearForwardSlash = 'mm/dd/yyyy';
			var dayMonthYearForwardSlash = 'dd/mm/yyyy';
			var dayMonthYearPeriod = 'dd.mm.yyyy';
			var dayMonthYearDash = 'dd-mm-yyyy';
			var yearMonthDayForwardSlash = 'yyyy/mm/dd';
			var yearMonthDayDash = 'yyyy-mm-dd';
			var dateBoxId = "#"+textBoxId;
			var rcmDatePicker = {
				destroyDatePicker: function(component){
					$(document).ready(function(){
						$(dateBoxId).datepicker('destroy');
						var textBox = document.getElementById(textBoxId);
						textBox.invalidDate = false;
						if (textBox.dateSelectionListeners) {
							textBox.dateSelectionListeners = null;
						}
					});
				},			
				getDateFormat: function(component){
					var dateFormat = $(dateBoxId).datepicker('option', 'dateFormat');
					var newDateFormat;
					if(dateFormat == 'mm/dd/yy' || dateFormat == 'dd/mm/yy' || dateFormat == 'dd.mm.yy' || dateFormat == 'dd-mm-yy')
					{	
						newDateFormat = dateFormat + 'yy';
					}
					else{
						newDateFormat = 'yy' + dateFormat;
					}
					return newDateFormat;
				},
				clearDateTextBox: function(textbox){
					textbox.focus();
					textbox.select();
				},

				daysInTheMonth: function(monthToCheck, yearToCheck){
					if ((monthToCheck == "01") || (monthToCheck == "03") || (monthToCheck == "05") ||
					(monthToCheck == "07") ||
					(monthToCheck == "08") ||
					(monthToCheck == "10") ||
					(monthToCheck == "12")) {
						return 31;
					}
					
					if (monthToCheck == "02") {
						if ((yearToCheck % 100 === 0) && (yearToCheck % 400 === 0)) {
							return 29;
						}
						
						else {
							if ((yearToCheck % 4) === 0) {
								return 29;
							}
							return 28;
						}
					}
					
					if ((monthToCheck == "04") || (monthToCheck == "06") || (monthToCheck == "09") || (monthToCheck == "11")) {
						return 30;
					}
				},
				isDateValid: function(monthDigits, dayDigits, yearDigits){
					if (dayDigits > this.daysInTheMonth(monthDigits, yearDigits)) {
						return 0;
					}
					return 1;
				},
				checkDate: function(textbox){
					var dateString = textbox.value;
					var dateFormat = rcmDatePicker.getDateFormat(textbox);
					var firstMonthDigit;
					var secondMonthDigit;
					var firstDayDigit;
					var secondDayDigit;
					var monthDigits;
					var dayDigits;
					var yearDigits;
					// Date invalid if it's less than 10
					if (dateString.length < 10)
					{
						return 0;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash) {
						firstMonthDigit = parseInt(dateString.charAt(0));
						secondMonthDigit = parseInt(dateString.charAt(1));
						firstDayDigit = parseInt(dateString.charAt(3));
						secondDayDigit = parseInt(dateString.charAt(4));
						monthDigits = dateString.charAt(0) + dateString.charAt(1);
						dayDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == dayMonthYearForwardSlash || dateFormat == dayMonthYearPeriod || dateFormat == dayMonthYearDash){
						firstDayDigit = parseInt(dateString.charAt(0));
						secondDayDigit = parseInt(dateString.charAt(1));
						firstMonthDigit = parseInt(dateString.charAt(3));
						secondMonthDigit = parseInt(dateString.charAt(4));
						dayDigits = dateString.charAt(0) + dateString.charAt(1);
						monthDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == yearMonthDayForwardSlash || dateFormat == yearMonthDayDash){
						firstMonthDigit = parseInt(dateString.charAt(5));
						secondMonthDigit = parseInt(dateString.charAt(6));
						firstDayDigit = parseInt(dateString.charAt(8));
						secondDayDigit = parseInt(dateString.charAt(9));
						yearDigits = dateString.charAt(0) + dateString.charAt(1) + dateString.charAt(2) + dateString.charAt(3);
						monthDigits = dateString.charAt(5) + dateString.charAt(6);
						dayDigits = dateString.charAt(8) + dateString.charAt(9);
					}
					
					if ((firstMonthDigit !== 0) && (firstMonthDigit != 1)) {
						return 0;
					}
					
					else 
						if (firstMonthDigit == 1) {
							if ((secondMonthDigit < 0) || (secondMonthDigit > 2)) {
								return 0;
							}
						}
						
						else 
							if (firstMonthDigit === 0) {
								if ((secondMonthDigit < 1) || (secondMonthDigit > 9)) {
									return 0;
								}
							}
							
							else 
								if ((firstDayDigit < 0) || (firstDayDigit > 3)) {
									return 0;
								}
								else 
									if ((firstDayDigit === 0)) {
										if ((dateString.charAt(4) < 1) || (dateString.charAt(4) > 9)) {
											return 0;
										}
									}
									else 
										if ((firstDayDigit == 1) || (firstDayDigit == 2)) {
											if ((secondDayDigit < 0) || (secondDayDigit > 9)) {
												return 0;
											}
										}
										else 
											if (firstDayDigit == 3) {
												if ((secondDayDigit !== 0) || (secondDayDigit != 1)) {
													return 0;
												}
											}
					
					var isDate = this.isDateValid(monthDigits, dayDigits, yearDigits);
					if (isDate === 0) {
						return 0;
					}
					return 1;
				},
				setMaxDate : function(maxDate) {
					this.maxDate = maxDate;
					$(dateBoxId).datepicker("option", "maxDate", maxDate);
				},
				setMinDate : function(minDate) {
					this.minDate = minDate;
					$(dateBoxId).datepicker("option", "minDate", minDate);
				},
				adjustDateForMinMaxRange: function(){
					var date = $(dateBoxId).datepicker("getDate");
					if(date){
						if(this.maxDate && date > this.maxDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}
						if(this.minDate && date < this.minDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}						
					}
				},
				dateTextBoxLoseFocus: function(textbox){
					var validDate = rcmDatePicker.checkDate(textbox);
					// allow date to be blank out, and default date is null
					if (validDate === 0 && textbox.value.length != 0) {
						textbox.focus();
						textbox.select();
						textbox.style.background = '#FFF380';
						textbox.invalidDate = true;
						alert("Please enter a valid date in the format of " + rcmDatePicker.getDateFormat(textbox));
					}
					else {
						textbox.invalidDate = false;
						textbox.style.background = "#FFFFFF";
					}
				},
				dateTextBoxChange: function(textbox){
					if(textbox.value.length > 0){
						rcmDatePicker.adjustDateForMinMaxRange();
					}
				},
				applyMask: function(textbox){
					var dateText = textbox;
					dateText.value.replace("/", "");
					var length = dateText.value.length;
					var dateFormat = rcmDatePicker.getDateFormat(dateText);
					// ignore all others
					if( !(event.keyCode == 46                                   // delete
							|| (event.keyCode >= 35 && event.keyCode <= 40)     // arrow keys/home/end
						    || (event.keyCode >= 48 && event.keyCode <= 57)     // numbers on keyboard
						    || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
					   ) {
						return;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash || dateFormat == dayMonthYearForwardSlash) {
						if (length == 2) {
							dateText.value = dateText.value + '/';
						}
						
						if (length == 5) {
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == dayMonthYearPeriod){
						if(length == 2){
							dateText.value = dateText.value + '.';
						}
						if(length == 5){
							dateText.value = dateText.value + '.';
						}
					}
					else if (dateFormat == dayMonthYearDash){
						if(length == 2){
							dateText.value = dateText.value + '-';
						}
						if(length == 5){
							dateText.value = dateText.value + '-';
						}
					}
					
					else if(dateFormat == yearMonthDayForwardSlash){
						if(length == 4){
							dateText.value = dateText.value + '/';
						}
						if(length == 7){
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == yearMonthDayDash){
						if(length == 4){
							dateText.value = dateText.value + '-';
						}
						if(length == 7){
							dateText.value = dateText.value + "-";
						}
					}
				}
			};			
			// Initialize the date picker
			$(document).ready(function(){
				var dateTextBox = document.getElementById(textBoxId);
				dateTextBox.addDateSelectionListener = function(listener) {
					if (!this.dateSelectionListeners) {
						this.dateSelectionListeners = [];
					}
					this.dateSelectionListeners.push(listener);
				}
				$(function(){
					$.datepicker.setDefaults($.datepicker.regional['']);
					$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: 'button',
						buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
						dateFormat: dateFormat.masks.shortDate3,
						buttonImageOnly: true,
						buttonText: i18n.RCM_DATEPICKER_TEXT,
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						beforeShow : function() {
							//set maximum z-index on the calendar pop-up.
							$('#ui-datepicker-div').css('z-index',9999999);
						},
						onSelect : function(dateText, inst) {
							if (dateTextBox.dateSelectionListeners) {
								for (var listener = 0, length = dateTextBox.dateSelectionListeners.length; listener < length; listener++) {
									dateTextBox.dateSelectionListeners[listener]();
								}
							}
							dateTextBox.focus();
						}
					}));
					RCM_Clinical_Util.setDate(textBoxId, new Date());
					
				});
				dateTextBox.onfocus = function() {
					rcmDatePicker.clearDateTextBox(dateTextBox);
				};
				dateTextBox.onblur = function() {
					rcmDatePicker.dateTextBoxLoseFocus(dateTextBox);
				};
				dateTextBox.onchange = function() {
					rcmDatePicker.dateTextBoxChange(dateTextBox);
				};
				dateTextBox.onkeypress = function(e) {
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}

					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					
					if(keynum === 116){//t-today's date
						$(dateBoxId).datepicker('setDate', new Date());
					}
					else if(keynum === 119){//w-beginning of week
						var day = currentDate.getDay();
						var diff = currentDate.getDate() - day;
						var beginningOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', beginningOfWeek);
					}
					else if(keynum === 107){//k-end of week
						var day = 6 - currentDate.getDay();
						var diff = currentDate.getDate() + day;
						var endOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', endOfWeek);
					}
					else if(keynum === 121){//y-beginning of year
					  var beginningOfYear = new Date(currentYear, 0, 1);
					  $(dateBoxId).datepicker('setDate', beginningOfYear);
					}
					else if(keynum === 114){//r-end of year
					  var endOfYear = new Date(currentYear, 11, 31);
					   $(dateBoxId).datepicker('setDate', endOfYear);
					}
					else if(keynum === 109){//m-beginning of month
						var beginningOfMonth = new Date(currentYear, currentMonth, 1);
						$(dateBoxId).datepicker('setDate', beginningOfMonth);
					}
					else if(keynum === 104){//h-end of month
						var endOfMonth;
						
						if(currentMonth == 3 || currentMonth == 5  || currentMonth == 8 || currentMonth == 10){
							endOfMonth = new Date(currentYear, currentMonth, 30);
						}
						else if(currentMonth == 1){
							if(currentYear%400== 0 ||(currentYear%100 != 0 && currentYear%4 == 0)){
								endOfMonth = new Date(currentYear, currentMonth, 29);
							}
							else{
								endOfMonth = new Date(currentYear, currentMonth, 28);
							}
						}
						else{
							endOfMonth = new Date(currentYear, currentMonth, 31);
						}
						$(dateBoxId).datepicker('setDate', endOfMonth);
					}
					else if(keynum === 43 || keynum === 61){// + : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
					}
					else if(keynum === 45){// - : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
					}
					rcmDatePicker.applyMask(dateTextBox);
				};
				dateTextBox.onkeydown = function(e) {// For special characters
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}
					
					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					var currentDay = currentDate.getDate();
					
					if(keynum === 38){// UP ARROW : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 40){// DOWN ARROW : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
						return false;
					}
					else if(keynum === 33){// PAGE UP : increment month
						var incrementMonth = new Date(currentYear, currentMonth + 1, currentDay);
						$(dateBoxId).datepicker('setDate', incrementMonth);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 34){// PAGE DOWN : decrement month
						var decrementMonth = new Date(currentYear, currentMonth - 1, currentDay);
						$(dateBoxId).datepicker('setDate', decrementMonth);
						return false;
					}
					rcmDatePicker.applyMask(dateTextBox);
				};	
			});
			
			return rcmDatePicker;
		},
		//TODO: Is this used anywhere.  Seems outdated duplicate to previous function.
		addDatePickerButton : function(component, textBoxId, updateElementId) {
			$(document).ready(function(){
			var dateTextBox = document.getElementById(textBoxId);
			var dateBoxId = "#"+textBoxId;
			dateTextBox.style.display = "none";
			$(function(){
				var updateElement = document.getElementById(updateElementId);
				$.datepicker.setDefaults($.datepicker.regional['']);
				$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
					showOn: 'button',
					dateFormat: dateFormat.masks.shortDate3,
					buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
					buttonImageOnly: true,
					buttonText: i18n.RCM_DATEPICKER_TEXT,
					showOtherMonths: true,
					selectOtherMonths: true,
					showMonthAfterYear: false,
					beforeShow : function() {
						dateTextBox.style.display = "inline";
						dateTextBox.style.width = "1px";
						dateTextBox.style.height = "1px";
					},
					onClose : function() {
						var date = $(dateBoxId).datepicker("getDate");
						if (date) {
							updateElement.innerHTML = date.format('shortDate2'); 
						}
						dateTextBox.style.display = "none";
					}
				}));
				RCM_Clinical_Util.setDate(textBoxId, new Date());
			});
			});
		},
		
		showDatePicker : function(updateElement, anchorElementId) {	
			$(document).ready(function(){
			var anchorElement = document.getElementById(anchorElementId);
			if (anchorElement.isDateAttached) {				
				anchorElement.style.display = "inline";				
				$("#"+anchorElementId).datepicker('show');				
			}
			else {	
				$(function(){
					$("#"+anchorElementId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: "focus",
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						
						onClose: function() { 
							var date = $("#"+anchorElementId).datepicker("getDate");
							if (date) {
								updateElement.innerHTML = date.format('shortDate2'); 
							}
							anchorElement.style.display = "none";
						}
					}));
					anchorElement.isDateAttached = true;
					anchorElement.style.display = "inline";						
					$("#"+anchorElementId).datepicker('show');
				});					
			}
			});
		}, 
		getDate : function(dateElementId) {
			var date;
			$(document).ready(function(){
				date = $("#"+dateElementId).datepicker("getDate");
			});
			return date;
		},
        getTime : function(elementId) {
            var time;
            $(document).ready(function(){
                time = $("#"+elementId).timeEntry('getTime');
            });
            return time;
        },	
        formatLongDate : function(date){
        	if (date) {
        		return date.format("dd-mmm-yyyy HH:MM:ss");
        	}
        	return "";
        },	
		formatDate : function(date) {
			if (date) {
				return date.format('shortDate2');
			}
			return "";
		},
		formatJsonDateString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				formattedString = RCM_Clinical_Util.formatDate(date);
			}
			return formattedString;
		},
		formatJsonTimeString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if(i18n.SET24HOUR ){
					formattedString = date.format('HH:MM');
				}else{
					formattedString = date.format("hh:MM tt");
				}
			}
			return formattedString;
		},	
		formatJsonDateAndTimeString : function(dateString, format) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if (format && format !== "")
				{	
					formattedString = date.format(format);
				}
				else
				{
					formattedString = date.format("longDateTime2");
				}	
			}
			return formattedString;
		},
		getTodaysDate: function(){
			var tempDay = new Date();
			var date = tempDay.format('shortDate2');
			return date;
		},
		
		getTodaysTime: function(){
			var now = new Date();
			if(i18n.SET24HOUR){
				var date = now.format('HH:MM');
			}else{
				var date = now.format("hh:MM tt");
			}
			return date;			
		},
		
		getDateString : function(dateElementId) {
			return this.formatDate(this.getDate(dateElementId));
		},
		setDateString : function(dateElementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, null);
				});
			}
		},
		/**
		 * This should be used over the setDate function on the datepicker until the following jQuery bug is fixed:
		 * http://bugs.jqueryui.com/ticket/4198
		 * @param dateElementId The date element id.
		 * @param date The date to set.
		 */
		setDate : function(dateElementId, date) {
			var $dateField = $("#" + dateElementId);
			if(date) {
				var dateFormat = $dateField.datepicker('option', 'dateFormat');
				$dateField.val($.datepicker.formatDate(dateFormat, date));
			}
			else {
				$dateField.val("");
			}
		},
		setTimeString : function(elementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", null);
				});
			}
		},		
		
		/**
		 * <p>Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.</p>
		 *
		 * <p>NOTE: This method always sets the time in the returned string to (00:00:00). To preserve the time
		 * from the passed in date/time string use <code>formatDateAndTimeStringForSave</code> instead.</p> 
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateStringForSave : function(dateString) {
			var formattedString = [];
			if (dateString && dateString !== "") {
				var date = new Date();
				//TODO: setISO8601 would convert a string '10/19/2010' to '31-Dec-2009 00:00:00'
				date.setISO8601(dateString);
				formattedString.push(date.format("dd-mmm-yyyy"));
				formattedString.push(" 00:00:00");
			}
			return formattedString.join("");
		},	
		
		/**
		 * Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateAndTimeStringForSave : function(dateTimeString) {
			var formattedDateTime = "";		
			if (dateTimeString && dateTimeString !== "") {
				var date = new Date();
				date.setISO8601(dateTimeString);
				formattedDateTime = date.format("dd-mmm-yyyy HH:MM:ss");
			}
			return formattedDateTime;			
		},
		
		//turns HTML code and inserts escape codes to make it printable
		loggingHtmlToText : function(str) {
			return String(str).replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/"/g, '&quot');
		},

		loggingFunctionFormatter : function(str){
			str = str.replace(/{/g, "{<br>").replace(/;/g, ";<br>").replace(/}/g, "}<br>");
			for(line in indent = 1, lines = str.split("<br>")) {
				if(lines.hasOwnProperty(line)) {
					if(lines[line].indexOf("}") > -1) indent--;
					lines[line] = new Array(((indent-1)*4)+1).join("&nbsp;") + lines[line];
					if(lines[line].indexOf("{") > -1) indent++;
				}
			}
			return lines.join("<br>");
		},

		loggingJsonFormatter : function(object) {	
			if (object != null){
				return JSON.stringify(object, undefined, 4).replace(/[ ]/g, "&nbsp;").replace(/\n/g, "<br />");
			}
			else{
				return "";
			}
		},
		
		loggingIsValidJsonToParse : function(str){
			try{
				JSON.parse(str);
			}
			catch (err){
				return false;
			}
			return true;
		},
		
		loggingParseParamAr : function(tempParamAr){
			var temp = JSON.stringify (tempParamAr[3]);
			temp = temp.replace(/\^/g, "").replace(/\\\"/g, "\"").replace(/(^[\"])|([\"]$)/g, "");
			if (RCM_Clinical_Util.loggingIsValidJsonToParse(temp)){
				temp = RCM_Clinical_Util.loggingJsonFormatter(JSON.parse(temp));
			}
			else{
				temp = "";
			}
			return tempParamAr[0] + "<br />" +
				tempParamAr[1] + "<br />" +
				tempParamAr[2] + "<br />" + 
				temp;
		},
		
		loggingJqxhrFormatter: function(tempJQXHR){
			var str = "";
			var jsonTemp = JSON.stringify(tempJQXHR.responseText).substring(1,(JSON.stringify(tempJQXHR.responseText).length-1)).replace(/\\\"/g, "\"");
			if(RCM_Clinical_Util.loggingIsValidJsonToParse(jsonTemp)){
				jsonTemp = JSON.parse (jsonTemp);
			}
			else{
				jsonTemp = tempJQXHR.responseText;
			}
			str += "Ready State: " + tempJQXHR.readyState + "<br />" +
			"Response Text: " + RCM_Clinical_Util.loggingJsonFormatter (jsonTemp) + "<br />" +
			"Status: " + tempJQXHR.status + "<br />" +
			"Status Text: " + tempJQXHR.statusText;
			return str;
		},

		makeCCLRequest : function(program, paramAr, async, statusHandler, isDecodeJSON, skipDebug) {
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				var tempStatus;
				if (window.log && log.isBlackBirdActive()){
					tempStatus = RCM_Clinical_Util.loggingHtmlToText (statusHandler);
					tempStatus = RCM_Clinical_Util.loggingFunctionFormatter (tempStatus);
				}
				if (info.readyState === 4 && info.status === 200){	
					if (statusHandler) {
						var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
						var recordData = jsonEval.RECORD_DATA;
						var jsonParamARTempString = "";
						if (window.log && log.isBlackBirdActive()){
							jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
						}
						if (recordData.STATUS_DATA.STATUS === "Z") {
							if (window.log && !skipDebug && log.isBlackBirdActive()){
								log.debug(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
							}
							statusHandler("Z", recordData);
						}
						else if (recordData.STATUS_DATA.STATUS === "S") {
							if (recordData.STATUS === "STALE_DATA") {							
								statusHandler("STALE_DATA", recordData);
							} 
							else {
								if (window.log && !skipDebug && log.isBlackBirdActive()){
									log.debug(["Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ", tempStatus, 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
								statusHandler("S", recordData);
							}
						}
						else {
							if (window.log && log.isBlackBirdActive()){
								log.error(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							statusHandler("F", recordData);
						}
					}
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if(window.log && log.isBlackBirdActive()){
						log.error(["Program: ", program, 
						"<br />paramAr: ", paramAr.join(","), 
						"<br />Function: ", tempStatus, 
						"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
					}
					statusHandler("F", recordData);					
				}
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		},
		
		makeTimerCCLRequest : function(component, program, paramAr, async, statusHandler, isDecodeJSON) {
			var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				if (info.readyState === 4 && info.status === 200){
					try {
						if (statusHandler) {
							var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
							var recordData = jsonEval.RECORD_DATA;
							var jsonParamARTempString = ""; 
							if (window.log && log.isBlackBirdActive()){
								jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
							}
							if (recordData.STATUS_DATA.STATUS === "Z") {
								statusHandler("Z", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							}
							else if (recordData.STATUS_DATA.STATUS === "S") {
								statusHandler("S", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
							else {
								var exceptionInfo = [];
								var debugErrorMessage = recordData.debugErrorMessage;
								var exceptionType = recordData.exceptionType;
								var entityType = recordData.entityType;
								var entityId = recordData.entityId;
								var combinedIntoId = recordData.combinedIntoId;
								exceptionInfo.push(debugErrorMessage, exceptionType, entityType, entityId, combinedIntoId);
								statusHandler("F", recordData, exceptionInfo.join(""));
								if (window.log && log.isBlackBirdActive()){	
									log.error(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
						}
					}
					catch (err) {
						 if (timerLoadComponent) {
	                         timerLoadComponent.Abort();
	                         timerLoadComponent = null;
	                     }
					}
				    finally {
	                     if (timerLoadComponent) 
	                         timerLoadComponent.Stop();
	                }
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if (window.log && log.isBlackBirdActive()){
						log.error(["Component: ", ( component ? component.getLabel() : ""),
						"<br />ID: ", ( component ? component.getComponentId() : ""),
						"<br />Program: ", program, 
						"<br />paramAr: ", jsonParamARTempString,
						"<br />Function: ", statusHandler, 
						"<br />status: ", recordData.STATUS_DATA.STATUS, 
						"<br />RecordData: ", JSON.stringify(recordData.STATUS_DATA.STATUS)].join(""));
					}
					statusHandler("F", null, "Http status: " + info.status);	
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
					}
				}
				
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		}, 
		
		addColumnVerticalScrolling : function(mPage, column1, column2, minContentHeight) {
			if (column1) {
				column1.style.overflowY = "scroll";			
			}
			if (column2) {
				column2.style.overflowY = "scroll";
			}
			
			document.documentElement.style.overflowY = "hidden";
			window.scrollTo(0,0);
			
			var heightRatio = mPage.isBannerEnabled() ? 85 : 75;
			var resizeFunction = function() {				
				var height = gvs()[0] - heightRatio;
				var styleHeight;
				if (height < minContentHeight) {
					styleHeight = height + "px";
				}
				else {
					styleHeight = height + "px";
				}
				if (column1) {
					column1.style.height = styleHeight;
				}
				if (column2) {
					column2.style.height = styleHeight;
				}
			};
			Util.addEvent(window, "resize", resizeFunction);
			resizeFunction();
			return resizeFunction;
		},
		
		removeColumnVerticalScrolling : function(column1, column2, resizeFunction) {
			if (column1) {
				column1.style.overflowY = "";
				column1.style.height = "";
			}
			if (column2) {
				column2.style.overflowY = "";
				column2.style.height = "";
			}
			
			document.documentElement.style.overflowY = "scroll";
			if(resizeFunction) {
				Util.removeEvent(window, "resize", resizeFunction);
			}
		},
		
		getElementsByClassName : function(parentElement, tagName, className) {
			return Util.Style.g(className, parentElement, tagName);
		},
		/**
		 * The method uses jQuery masked input plugin to mask text box.  
		 * The method takes two arguments: the text box id and the mask string.
		 */
		addMaskToTextBox : function(textBoxId, maskString) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).mask(maskString, {placeholder : " "});});
		},
		
		/**
		 * The method uses jQuery masked input plugin to unmask text box.  
		 * The method takes one arguments: the text box id.
		 */
		unmaskTextBox : function(textBoxId) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).unmask();});
		},
		
		addRequiredDecorator : function(element) {
			// Prevent all labels from being decorated when the element doesn't have an id
			if (!element.id) {
				return;
			}			
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") === -1) {
						labels[i].innerHTML = "<span style='color:#cc0000'>*</span>" + labels[i].innerHTML;
				}
			}
		},
		
		removeRequiredDecorator : function(element) {
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") !== -1) {
					labels[i].innerHTML = labels[i].innerHTML.substring(37);
				}
			}
		},
		
		/**
		 * This method masks the required field decoration.  
		 */
		maskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				// Attempt to add the required decorator (red star) in case it hasn't been added yet.
				RCM_Clinical_Util.addRequiredDecorator(requiredTextBox);
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type === "select-multiple") {
						requiredTextBox.style.backgroundColor = '#FFFCE1';
				}	
			}
		},

		/**
		 * This method un-masks the required field decoration.
		 */
		umMaskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type == "select-multiple") {
					requiredTextBox.style.backgroundColor = 'transparent';
				}
			}
		},
		
		removeRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			if(element && element.requiredCheck) {
				switch(fieldType.toLowerCase()) {
				case "date":
					break;
				case "select":
					Util.removeEvent(element,"change",element.requiredCheck);
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					Util.removeEvent(element, "keydown", element.requiredCheckLater);
					Util.removeEvent(element, "paste", element.requiredCheckLater);
					Util.removeEvent(element, "cut", element.requiredCheckLater);
					Util.removeEvent(element, "drop", element.requiredCheckLater);
					break;
				case "radio":
					// TODO: Add a remove for radio buttons
					return;
					break;				
				}
				element.isRequired = undefined;
				element.requiredCheck = undefined;
				
				// Remove the element from the form object's required elements array.
				if (formObject.requiredElements) {
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === element) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
				}
				
				// Update the flex buttons if there are no remaining 
				var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
				if (flexButtonIds && flexButtonIds.length > 0) {
					for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
						var flexButton = document.getElementById(flexButtonIds[id]);
						if (flexButton) {
							flexButton.disabled = disabled;
						}
					}
				}
				
				RCM_Clinical_Util.removeRequiredDecorator(element);
				RCM_Clinical_Util.umMaskRequiredField(fieldId);
			}
		},
		
		/**
		 * Sets a search control's required state.
		 * 
		 * @param isRequired {Boolean} Whether the search control is required or not.
		 * @param formObject {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of the html element for the search control.
		 * @param {Object} searchControl The search control object.
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		setSearchControlRequired : function(isRequired, formObject, fieldId, searchControl, flexButtonIds) {
			var searchElement = document.getElementById(fieldId);
			if(searchElement) {
				if(isRequired && !searchElement.requiredCheck) {
					searchElement.isRequired = function() {
						return !searchControl.isVerified();
					};
					searchElement.requiredCheck = function() {
						var flexButtonsCount = flexButtonIds.length;
						if(flexButtonsCount > 0) {
							var disabled = searchElement.isRequired() || RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for(var i = 0; i < flexButtonsCount; i++) {
								var flexButton = document.getElementById(flexButtonIds[i]);
								if(flexButton) {
									flexButton.disabled = disabled;
								}
							}
						}
					};
					searchElement.requiredCheck();
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(searchElement);
					
					searchElement.verifyListener = function() {
						searchElement.requiredCheck();
					};
					searchControl.addVerifyStateChangeListener(searchElement.verifyListener);
				}
				else if(!isRequired && searchElement.requiredCheck) {
					searchElement.isRequired = undefined;
					searchElement.requiredCheck = undefined;
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === searchElement) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
					searchControl.removeVerifyStateChangeListener(searchElement.verifyListener);
					searchElement.verifyListener = undefined;
					var flexButtonsCount = flexButtonIds.length;
					if(flexButtonsCount > 0) {
						var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
						for(var i = 0; i < flexButtonsCount; i++) {
							var flexButton = document.getElementById(flexButtonIds[i]);
							if(flexButton) {
								flexButton.disabled = disabled;
							}
						}
					}
				}
				searchControl.setRequired(isRequired);
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of an html element.
		 * @param {String} fieldType The type of field. The following types are currently supported: "date", "select", "text", "textarea", "radio".
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		addRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			// If the field doesn't exist or is already required there is nothing to do here.
			if(element && !element.requiredCheck) {
				formObject.ignoreRequiredListeners = false;
				switch(fieldType.toLowerCase()) {
				case "date":
					var dateElement = element; 
					var validateListener = dateElement.onblur;
					var flexButtons = [];					
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					dateElement.isRequired = function() {
						var $dateInput = $("#" + fieldId);
						var dateVal = $dateInput.val();
						var dateFormat = $dateInput.datepicker('option', 'dateFormat');
						//TODO: We need to completely refactor how we handle dates so that I don't
						//      have to know that the date format from jquery is actually shorter than it displays.
						//      For example, mm/dd/yy is returned from jquery when something like 11/11/2010 is displayed.
						return (dateVal.length - 2 < dateFormat.length);
					};
					dateElement.requiredCheck = function() {
						var isRequired = false;
						if (validateListener) {
							validateListener();
							if (this.invalidDate) {
								isRequired = true;
							}
						}
						if(!isRequired) {
							isRequired = dateElement.isRequired();
							if(isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);	
							}
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}						
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}	
					formObject.requiredElements.push(dateElement);
					dateElement.onblur = dateElement.requiredCheck;		
					if (dateElement.addDateSelectionListener) {
						dateElement.addDateSelectionListener(dateElement.requiredCheck);
					}
					
					RCM_Clinical_Util.addRequiredDecorator(dateElement);
					dateElement.requiredCheck();
					break;
				case "select":
					var selectElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					selectElement.isRequired = function() {
						var index = selectElement.selectedIndex;
						return index === -1 || selectElement.options[index].text === "";
					};
					selectElement.requiredCheck = function() {
						// Show required decoration when blank option first option is selected
						var isRequired = false;
						if (!selectElement.isRequired()) {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.maskRequiredField(fieldId);
							isRequired = true;
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(selectElement);
					Util.addEvent(selectElement, "change", selectElement.requiredCheck);
	
					RCM_Clinical_Util.addRequiredDecorator(selectElement);
					selectElement.requiredCheck();
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					var textElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					textElement.isRequired = function() {
						if(fieldType.toLowerCase() === "maskedtext"){
							return $.trim(textElement.value).length === 0;
						}
						return textElement.value.length === 0;
					};
					textElement.requiredCheck = function() {
						var isRequired = textElement.isRequired();
						if (isRequired) {
							RCM_Clinical_Util.maskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(textElement);
					
					textElement.requiredCheckLater = function() {setTimeout(textElement.requiredCheck,1);};
					Util.addEvent(textElement, "keydown", textElement.requiredCheckLater);
					Util.addEvent(textElement, "paste", textElement.requiredCheckLater);
					Util.addEvent(textElement, "cut", textElement.requiredCheckLater);
					Util.addEvent(textElement, "drop", textElement.requiredCheckLater);
					
					RCM_Clinical_Util.addRequiredDecorator(textElement);
					textElement.requiredCheck();
					break;
				case "radio":					
					var firstRadioElement = element;
					// Find sibling radio buttons 
					var radioElements = $(firstRadioElement).nextAll("input[name='"+firstRadioElement.name+"']").get();
					radioElements.push(firstRadioElement);
					
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					// Add listener to each radio button
					$.each(radioElements, function(index, radioElement) {
						// Default to marking the radio buttons as not required if at least one of them 
						// is checked. A custom is required function could easily be passed in if needed. 
						radioElement.isRequired = function() {
							return !(firstRadioElement.checked || $(firstRadioElement).nextAll(
									"input[name='"+firstRadioElement.name+"']:checked").length > 0);
						};
						radioElement.requiredCheck = function() {
							var isRequired = radioElement.isRequired();
							if (isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);
							}
							if (flexButtons.length > 0) {								
								var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
								for (var button = 0, length = flexButtons.length; button < length; button++) {
									flexButtons[button].disabled = disabled;	
								}
							}
						};
						if (!formObject.requiredElements) {
							formObject.requiredElements = [];
						}
						formObject.requiredElements.push(radioElement);					
						Util.addEvent(radioElement, "click", radioElement.requiredCheck);					
						RCM_Clinical_Util.addRequiredDecorator(radioElement);
					});
					firstRadioElement.requiredCheck();					
					break;
				}
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 * @return {Boolean} Returns true if any required field is displaying its decoration. Otherwise returns false.
		 */
		isAnyFieldRequired : function(formObject) {
			if (!formObject.requiredElements) {
				return false;
			}
			for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
				if (formObject.requiredElements[element].isRequired()) {
					return true;
				}
			}
			return false;
		},		
		
		/**
		 * Calls the requiredCheck() method on each required field in a form. 
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 */
		performRequiredFieldChecks : function(formObject) {
			if (formObject.requiredElements) {
				for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
					formObject.requiredElements[element].requiredCheck();
				}
			}
		},
		
		/**
		 * Sets the mp formatter locale to the default locale, which is English US.
		 */
		setMpFormatterLocale : function() {
			// Sets the locale ($SOURCE_DIR$\js\formatter\locales\js\en_US.js) 
			// for the mp_formatter ($SOURCE_DIR$\formatter\formatter.js)
			if (!window.MPAGE_LOCALE) {
				window.MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
			}
		}, 
		
		/**
		 * Turns a JSON object into a string by calling JSON.stringify(). While doing so encodes the value 
		 * of each string field by calling the global encodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The JSON object to stringify.
		 * @return The string representation of the JSON object.
		 */
		stringifyJSON : function(jsonObject) {
			return JSON.stringify(jsonObject, function(key, value) {
				if (typeof value === "string" && key !== "reviewedDate") {
					return encodeURIComponent(value);
				}
				return value;
			});
		}, 
		
		/**
		 * Turns the string into a JSON object by calling JSON.parse(). While doing so decodes the value 
		 * of each string field by calling the global decodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The string to turn into a JSON object.
		 * @return The constructed JSON object.
		 */
		parseJSON : function(jsonString) {
			return JSON.parse(jsonString, function(key, value) {
				if (typeof value === "string") {
					return decodeURIComponent(value);
				}
				return value;
			});
		},
		
		/**
		 * Decodes the value of each string field in the JSON object by calling the global decodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The string to turn into a JSON object.
		 * @return The decoded JSON object.
		 */
		decodeJSON : function(jsonObject) {
			return RCM_Clinical_Util.parseJSON(JSON.stringify(jsonObject));
		},
		
		/**
		 * Encodes a string by calling the global encodeURIComponent().
		 *
		 * @param {String} value The string to encode.
		 * @param {Array} charactersToEncode (Optional) Limits the encoding to the characters contained 
		 * 	in the array. Each character should be passed as a separate value in the array, for example
		 *  ['^', '#'].
		 * @return The encoded string. 
		 */
		encodeString : function(value, charactersToEncode) {
			var encodedValue = "";
			if (value) {
				if (charactersToEncode) {
					var encodedCharsMap = {};
					for (var index = 0, length = charactersToEncode.length; index < length; index++) {
						var charToEncode = charactersToEncode[index];
						var encodedChar = encodeURIComponent(charToEncode);
						if (charToEncode !== encodedChar) {
							encodedCharsMap[charToEncode] = encodedChar;
						}
					}
					var encodedValueArray = [];
					for (var index = 0, length = value.length; index < length; index++) {
						var currentChar = value.charAt(index);
						var encodedChar = encodedCharsMap[currentChar];
						encodedValueArray.push(encodedChar ? encodedChar : currentChar);
					}
					encodedValue = encodedValueArray.join("");
				} else {
					encodedValue = encodeURIComponent(value);
				}
			}
			return encodedValue;
		}, 
		
		/**
		 * Decodes a string by calling the global decodeURIComponent().
		 *
		 * @param {String} value The string to decode.
		 * @return The decoded string. 
		 */
		decodeString : function(value) {
			return value ? decodeURIComponent(value) : value;
		},
		
		/**
		 * Returns an array of smaller segments of a long text string.
		 * This method will first encode the provided long text string.
		 * 
		 * @param longText The long text string.
		 * @param segmentName The name for each segment inside of the JSON array.
		 * @param maxSegmentLength The maximum length of each segment in the JSON array.  If not specified, 800 is assumed.
		 * @returns The JSON representation of the long text broken apart into segments.
		 */
		getLongTextJSON : function(longText, segmentName, maxSegmentLength) {
			var maxSegmentLength = maxSegmentLength || 800;
			var longTextEncoded = RCM_Clinical_Util.encodeString(longText);
			var segments = [];
			var start = 0;
			while(start < longTextEncoded.length) {
				var end = start + maxSegmentLength;
				var segment = {};
				segment[segmentName] = longTextEncoded.substring(start, end);
				segments.push(segment);
				start = end;
			}
			return segments;
		},

		componentInsertData : function(mPage, excludedComponents, prefix, categoryMeaning){
			excludedComponents = excludedComponents || [];
			var excluded;

            var components = mPage.getComponents();
			for (var pos = 0, componentsLength = components.length; pos < componentsLength; pos++) {
				var component = components[pos];
				if(typeof(DischargePlanningComponent) == "function" && component instanceof DischargePlanningComponent){
            		component.setCategoryMeaning(categoryMeaning);
            		component.setReportMeaning(prefix + "_DC_PLAN");
            		component.setDischargePlan("DCM_DC_PLAN_CE");
            		component.setEncntrTypes("VISIT_TYPE_READMISSION");
            		component.setVisitRelationshipTypes("DISCHARGE_RELTN");
            		component.setMedicareFinacialTypes("MEDICARE_FIN_CLASS");
            		component.setEventSets("DC_PLAN_CE");
            		component.setEventSetsSort("DC_PLAN_CE_SEQ");
            		component.setAdmitMIM("DCM_ADM_MIM_CE");
            		component.setDischargeMIM("DCM_DSCH_MIM_CE");
            		component.setReadmissionLink("READMISSION_LINK");
        		}
				
				if(typeof(UtilizationManagementRetrieveComponent) == "function" && component instanceof UtilizationManagementRetrieveComponent){
            		component.setCategoryMeaning(categoryMeaning);
        		}
				
				excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				
				if(!excluded) {
					if (typeof(VitalSignComponent) == "function" && component instanceof VitalSignComponent) {
						var groups = component.getGroups();
						if (groups != null) {
							for (var z = 0, groupsLength = groups.length; z < groupsLength; z++) {
								var group = groups[z];
								switch (group.getGroupName()) {
									case "TEMP_CE":
										group.setGroupName(i18n.TEMPERATURE);
										break;
									case "BP_CE":
										group.setGroupName(i18n.BLOOD_PRESSURE);
										break;
									case "HR_CE":
										group.setGroupName(i18n.HEART_RATE);
										break;
									case "VS_CE":
										group.setGroupName("");
										break;
								};
							}
						}
					}
					else if (typeof(LaboratoryComponent) == "function" && component instanceof LaboratoryComponent) {
						var groups = component.getGroups();
						if (groups != null) {
							for (var z = 0, groupsLength = groups.length; z < groupsLength; z++) {
								var group = groups[z];
								switch (group.getGroupName()) {
									case "LAB_PRIMARY_CE":
										group.setGroupName(i18n.PRIMARY_RESULTS);
										break;
									case "LAB_SECONDARY_ES":
										group.setGroupName(i18n.SECONDARY_RESULTS);
										break;
								}
							}
						}
					}
					
					component.InsertData();
				}
			}
		},
		
		addTimePicker : function(elementId) {
			var timeTextBox = document.getElementById(elementId);
			$(document).ready(function(){
				$(function(){
					$.timeEntry.setDefaults($.timeEntry.regional['']);
					if(i18n.SET24HOUR){
						$(timeTextBox).timeEntry($.extend({},$.timeEntry.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						ampmPrefix : ' ',
						show24Hours:true
						}));
					}else{
						$(timeTextBox).timeEntry($.extend({},$.timeEntry.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						ampmPrefix : ' '						
						}));
					}
					$(".timeEntry_control").remove();
					timeTextBox.onkeypress = function(e) {
						var keynum;
					
						if(window.event){
							keynum = event.keyCode;
						}
						else if(e.which){
							keynum = e.which;
						}
						if(keynum === 110) {// n : time for now
							$(timeTextBox).timeEntry('setTime', new Date());
						}
					};
				});
			});
		},
		
		/* Hover Setup */
		hs : function(e, n){
			var priorBgColor;
			var priorBorderColor;
			var colorsSet = false;
			if (n && n.tagName == "DIV") {
				e.onmouseenter = function(evt){
					e.onmouseover = null;
					e.onmouseout = null;
					hmo(evt, n);
				};
				e.onmouseover = function(evt){
					if(!colorsSet) {
						priorBgColor = e.style.backgroundColor;
						priorBorderColor = e.style.borderColor;
						colorsSet = true;
					}
					e.style.backgroundColor = "#FFFFCC";
					e.style.borderColor = "#CCCCCC";
					hmo(evt, n);
				};
				e.onmousemove = function(evt){
					if(!colorsSet) {
						priorBgColor = e.style.backgroundColor;
						priorBorderColor = e.style.borderColor;
						colorsSet = true;
					}
					e.style.backgroundColor = "#FFFFCC";
					e.style.borderColor = "#CCCCCC";
					hmm(evt, n);
				};
				e.onmouseout = function(evt){
					e.style.backgroundColor = priorBgColor;
					e.style.borderColor = priorBorderColor;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				e.onmouseleave = function(evt){
					e.style.backgroundColor = priorBgColor;
					e.style.borderColor = priorBorderColor;
					e.onmouseover = null;
					e.onmouseout = null;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				Util.Style.acss(n, "hover");
			}
		},
		
		hs2 : function(e, n, parentHoverClassName){
			var init = parentHoverClassName;
			var parentPriorClassName;
			
			if (n && n.tagName == "DIV") {
				e.onmouseenter = function(evt){
					e.onmouseover = null;
					e.onmouseout = null;
					hmo(evt, n);
				};
				e.onmouseover = function(evt){
					if(init) {
						parentPriorClassName = e.className;
						init = false;
					}

					if(parentHoverClassName) {
						e.className = parentHoverClassName;
					}
					hmo(evt, n);
				};
				e.onmousemove = function(evt){
					if(init) {
						parentPriorClassName = e.className;
						init = false;
					}
					
					if(parentHoverClassName) {
						e.className = parentHoverClassName;
					}
					hmm(evt, n);
				};
				e.onmouseout = function(evt){
					if(parentPriorClassName) {
						e.className = parentPriorClassName;
					}
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				e.onmouseleave = function(evt){
					if(parentPriorClassName) {
						e.className = parentPriorClassName;
					}
					e.onmouseover = null;
					e.onmouseout = null;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				Util.Style.acss(n, "hover");
			}
		},
		
		getCookie : function(key){
			var cookies = document.cookie.split(";");
			var value;
			$.each(cookies, function(i, cookie){
				var name = cookie.substr(0, cookie.indexOf("="));
				name=name.replace(/^\s+|\s+$/g,"");
				if(name==key){
					value = cookie.substr(cookie.indexOf("=") + 1);
					return false;
				}
			});
			return value;
		},
		
		setSessionCookie : function(key, value){
			document.cookie = key + "=" + value;
		},
		
		makeWebServiceCall : function(component, resourceUrl, successHandler, errorHandler, isNewSession) {
			function webServiceCall() {
				var fullUrl = RCM_Clinical_Util.getCookie("rcmBaseUrl") + "patient/"+component.getCriterion().person_id+"/encounter/"+
				  	component.getCriterion().encntr_id + resourceUrl;
				
				ajaxCall = $.ajax({
					contentType : "application/x-www-form-urlencoded",
					async : true,
					global : false,
					type : "GET",
					url : fullUrl,
					cache : false,
					beforeSend : function (xhr) {
						xhr.setRequestHeader("oAuthSession", RCM_Clinical_Util.getCookie("rcmOAuthSession"));
						xhr.setRequestHeader("clientMnemonic", RCM_Clinical_Util.getCookie("rcmClientMnemonic"));
					},
					success : function (data, textStatus, jqXHR) {
						if (jqXHR.readyState === 4){
							// Check for OAuth session refresh
							var refreshedOAuthSession = jqXHR.getResponseHeader("refreshedOAuthSession");
							if (window.log && log.isBlackBirdActive()){
								log.debug("Component: " + component.getLabel() +
								"<br />Text Status: " + textStatus +
								"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
								"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
							}
							if (refreshedOAuthSession) {
								RCM_Clinical_Util.setSessionCookie("rcmOAuthSession", refreshedOAuthSession);
							}
							successHandler(data, textStatus, jqXHR);
						} else {
							alert("Timeout");
							if (window.log && log.isBlackBirdActive()){
								log.debug("Component: " + component.getLabel() +
								"<br />Text Status: " + textStatus +
								"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
								"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
							}
						}
						
					},
					error : function (jqXHR, textStatus, errorThrown) {
						if (jqXHR.readyState === 4){
							// Try again if not new session since OAuth token may be expired
							if (jqXHR.status === 401 && !isNewSession) {
								RCM_Clinical_Util.makeWebServiceCall(component, resourceUrl, successHandler, errorHandler,true);
							} else {
								// TODO: Should still retry several times or give up after first failure?
								// TODO: Should have a common error dialog for a 401 error
								errorHandler(jqXHR, textStatus, errorThrown);
							}
						} else {
							alert("Timeout");
						}
					},
					timeout : 120000
				});
			}
			
			// old session
			if (RCM_Clinical_Util.getCookie("rcmOAuthSession") && !isNewSession) {
				webServiceCall();
			} 
			// new session
			else {
				function createOAuthSession(oAuthData) {
					var webServiceUrl = oAuthData.baseUrl + "patient/" + component.getCriterion().person_id + "/encounter/" +
						component.getCriterion().encntr_id + "/oauth/createSession";
					ajaxCall = $.ajax({
							contentType : "application/x-www-form-urlencoded",
							async : true,
							global : false,
							type : "GET",
							url : webServiceUrl,
							cache : false,
							beforeSend : function (xhr) {
								xhr.setRequestHeader("openIdFilter", oAuthData.openIdToken);
								xhr.setRequestHeader("clientMnemonic", oAuthData.clientMnemonic);
							},
							success : function (data, textStatus, jqXHR) {
								if (jqXHR.status === 200) {
									if (window.log && log.isBlackBirdActive()){
										log.debug("Component: " + component.getLabel() +
										"<br />Text Status: " + textStatus +
										"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
										"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
									}
									RCM_Clinical_Util.setSessionCookie("rcmOAuthSession", data);
									RCM_Clinical_Util.setSessionCookie("rcmBaseUrl", oAuthData.baseUrl);
									RCM_Clinical_Util.setSessionCookie("rcmClientMnemonic", oAuthData.clientMnemonic);
									webServiceCall();
								} else {
									alert("The Session Id call failed");
									if (window.log && log.isBlackBirdActive()){
										log.error("Component: " + component.getLabel() +
										"<br />Text Status: " + textStatus +
										"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
										"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
									}
								}
							},
							error : function (jqXHR, textStatus, errorThrown) {
								alert("Cannot create OAuth session: " + textStatus);
							},
							timeout : 120000
						});
				}
				
				var sendAr = [];
				sendAr.push("^MINE^", "0.0", "^GETOPENIDCLIENTMNEMONICURL^");
				sendAr.push("^^");
				RCM_Clinical_Util.makeTimerCCLRequest(component, "RCM_OPENID", sendAr, true,
					function (status, recordData, errorInfo) {
					if (status === "S") {
						var oAuthData = {};
						oAuthData.openIdToken = recordData.OPENIDTOKEN;
						oAuthData.baseUrl = recordData.BASEURL;
						oAuthData.clientMnemonic = recordData.CLIENTMNEMONIC;
						createOAuthSession(oAuthData);
					} else {
						alert("The open id service call failed");
					}
				}, true);
			}
		},
		
		checkNull :  function(value){
			return value ? value : "";
		},
		
		setFocus: function(elementId) {
			var element = document.getElementById(elementId);
			if (element && !element.disabled) {
				try {
					element.focus();
				} catch (ex) {
				}
			}
		},
		
		expandAll : function(){
			$(document.body).find(".section").removeClass("closed");
			$("#cm-collapse-all-components").show();
			$("#cm-expand-all-components").hide();
		},
		
		collapseAll : function(){
			$(document.body).find(".section").addClass("closed");
			$("#cm-expand-all-components").show();
			$("#cm-collapse-all-components").hide();
		},
		createExpandCollapseAll : function(){
			id1 = "#cm-expand-all-components";
			id2 = "#cm-collapse-all-components";
			$(".pg-hd").prepend("<div id='cm-expand-all-components' class='expand-collapse-all' onclick ='RCM_Clinical_Util.expandAll();'>"+rcm_clinical_util_i18n.EXPAND_ALL+"</div>");
			$(".pg-hd").prepend("<div id='cm-collapse-all-components'class='expand-collapse-all' onclick ='RCM_Clinical_Util.collapseAll();'>"+rcm_clinical_util_i18n.COLLAPSE_ALL+"</div>");
			$("#cm-collapse-all-components").hide();
		}
	};
}();
