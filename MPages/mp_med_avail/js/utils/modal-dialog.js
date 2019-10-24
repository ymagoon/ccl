/**
 * The ModalDialog object contains information about the aspects of how the modal dialog will be created and what actions will take
 * place.  Depending on how the variables are set, the modal can flex based on the consumers needs.  Customizable options include the following;
 * size, modal title, onClose function, modal body content, variable footer buttons with dither options and onclick events.
 * @constructor
 */
function ModalDialog(modalId) {
	//The id given to the ModalDialog object.  Will be used to set/retrieve the modal dialog
	this.m_modalId = modalId;
	//A flag used to determine if the modal is active or not
	this.m_isModalActive = false;
	//A flag to determine if the modal should be fixed to the icon used to activate the modal
	this.m_isFixedToIcon = false;
	//A flag to determine if the modal dialog should grey out the background when being displayed or not.
	this.m_hasGrayBackground = true;
	//A flag to determine if the close icon should be shown or not
	this.m_showCloseIcon = true;

	//The margins object contains the margins that will be applied to the modal window.
	this.m_margins = {
		top: 5,
		right: 5,
		bottom: 5,
		left: 5
	};

	//The icon object contains information about the icon that the user will use to launch the modal dialog
	this.m_icon = {
		elementId: modalId + "icon",
		cssClass: "",
		text: "",
		hoverText: "",
		isActive: true
	};

	//The header object of the modal.  Contains all of the necessary information to render the header of the dialog
	this.m_header = {
		elementId: modalId + "header",
		title: "",
		closeFunction: null
	};

	//The body object of the modal.  Contains all of the necessary information to render the body of the dialog
	this.m_body = {
		elementId: modalId + "body",
		dataFunction: null,
		isBodySizeFixed: true
	};

	//The footer object of the modal.  Contains all of the necessary information to render the footer of the dialog
	this.m_footer = {
		isAlwaysShown: false,
		elementId: modalId + "footer",
		buttons: [],
		checkbox: {
			enabled: false,
			isChecked: false,
			onClick: function(){
				return false;
			},
			label: ""			
		}
	};
}

/** Adders **/

/**
 * Adds a ModalButton object to the list of buttons that will be used in the footer of to modal dialog.
 * Only ModalButtons will be used, no other object type will be accepted.
 * @param {ModalButton} modalButton The button to add to the footer.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.addFooterButton = function(modalButton) {
	if(!( modalButton instanceof ModalButton)) {
		MP_Util.LogError("ModalDialog.addFooterButton: Cannot add footer button which isnt a ModalButton object.\nModalButtons can be created using the ModalDialog.createModalButton function.");
		return this;
	}

	if(!modalButton.getId()) {
		MP_Util.LogError("ModalDialog.addFooterButton: All ModalButton objects must have an id assigned");
		return this;
	}

	this.m_footer.buttons.push(modalButton);
	return this;
};

/** Checkers **/

/**
 * Checks to see if the modal dialog object has a gray background or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.hasGrayBackground = function() {
	return this.m_hasGrayBackground;
};

/**
 * Checks to see if the modal dialog object is active or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isActive = function() {
	return this.m_isModalActive;
};

/**
 * Checks to see if the modal dialog body should have a fixed size or not
 * @return {boolean} True if the modal dialog body is a fixed size, false otherwise
 */
ModalDialog.prototype.isBodySizeFixed = function() {
	return this.m_body.isBodySizeFixed;
};

/**
 * Checks to see if the modal dialog footer should always be shown or not
 * @return {boolean} True if the modal dialog footer should always be shown
 */
ModalDialog.prototype.isFooterAlwaysShown = function() {
	return this.m_footer.isAlwaysShown;
};

/**
 * Checks to see if the modal dialog object is active or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isFixedToIcon = function() {
	return this.m_isFixedToIcon;
};

/**
 * Checks to see if the modal dialog icon is active or not
 * @return {boolean} True if the modal dialog icon is active, false otherwise
 */
ModalDialog.prototype.isIconActive = function() {
	return this.m_icon.isActive;
};

/**
 * Checks to see if the close icon should be shown in the modal dialog
 * @return {boolean} True if the close icon should be shown, false otherwise
 */
ModalDialog.prototype.showCloseIcon = function() {
	return this.m_showCloseIcon;
};

/** Getters **/

/**
 * Retrieves the function that will be used when attempting to populate the content of the modal dialog body.
 * @return {function} The function used when loading the modal dialog body
 */
ModalDialog.prototype.getBodyDataFunction = function() {
	return this.m_body.dataFunction;
};

/**
 * Retrieves the id associated to the modal dialog body element
 * @return {string} The id associated to the modal dialog body element
 */
ModalDialog.prototype.getBodyElementId = function() {
	return this.m_body.elementId;
};

/**
 * Retrieves the percentage set for the bottom margin of the modal dialog
 * @return {number} The percentage assigned to the bottom margin for the modal dialog
 */
ModalDialog.prototype.getBottomMarginPercentage = function() {
	return this.m_margins.bottom;
};

/**
 * Retrieves the button identified by the id passed into the function
 * @param {string} buttonId The if of the ModalButton object to retrieve
 * @return {ModalButton} The modal button with the id of buttonId, else null
 */
ModalDialog.prototype.getFooterButton = function(buttonId) {
	var x = 0;
	var buttons = this.getFooterButtons();
	var buttonCnt = buttons.length;
	//Get the ModalButton
	for( x = buttonCnt; x--; ) {
		button = buttons[x];
		if(button.getId() === buttonId) {
			return buttons[x];
		}
	}
	return null;
};

/**
 * Retrieves the array of buttons which will be used in the footer of the modal dialog.
 * @return {ModalButton[]} An array of ModalButton objects which will be used in the footer of the modal dialog
 */
ModalDialog.prototype.getFooterButtons = function() {
	return this.m_footer.buttons;
};

/**
 * Retrieves the id associated to the modal dialog footer element
 * @return {string} The id associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterElementId = function() {
	return this.m_footer.elementId;
};

/**
 * Retrieves the footer checkbox object associated to the modal dialog
 * @return {object} The checkbox associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterCheckbox = function() {
	return this.m_footer.checkbox;
};

/**
 * Retrieves a boolean which determines if the checkbox is enabled in the modal dialog footer.
 * @return {boolean} The flag which determines if this modal dialog should display a checkbox in the footer
 */
ModalDialog.prototype.getIsFooterCheckboxEnabled = function() {
	return this.m_footer.checkbox.enabled;
};

/**
 * Retrieves a boolean which determines if the checkbox is checked in the modal dialog footer.
 * @return {boolean} The flag which returns the state of the modal dialog footer checkbox
 */
ModalDialog.prototype.getFooterCheckboxIsChecked = function() {
	return this.m_footer.checkbox.isChecked;
};

/**
 * Retrieves the string label for the checkbox in the modal dialog footer.
 * @return {string} The label that appears next to the checkbox in the modal dialog footer
 */
ModalDialog.prototype.getFooterCheckboxLabel = function() {
	return this.m_footer.checkbox.label;
};


/**
 * Retrieves a boolean which determines if the modal dialog should display a gray background or not
 * @return {boolean} The flag which determines if this modal dialog should display a gray background
 */
ModalDialog.prototype.getHasGrayBackground = function() {
	return this.m_hasGrayBackground;
};

/**
 * Retrieves the function that will be used when the user attempts to close the modal dialog.
 * @return {function} The function used when closing the modal dialog
 */
ModalDialog.prototype.getHeaderCloseFunction = function() {
	return this.m_header.closeFunction;
};

/**
 * Retrieves the id associated to the modal dialog header element
 * @return {string} The id associated to the modal dialog header element
 */
ModalDialog.prototype.getHeaderElementId = function() {
	return this.m_header.elementId;
};

/**
 * Retrieves the title which will be used in the header of the modal dialog
 * @return {string} The title given to the modal dialog header element
 */
ModalDialog.prototype.getHeaderTitle = function() {
	return this.m_header.title;
};

/**
 * Retrieves the css class which will be applied to the html span used to open the modal dialog
 * @return {string} The css which will be applied to the html span used ot open the modal dialog
 */
ModalDialog.prototype.getIconClass = function() {
	return this.m_icon.cssClass;
};

/**
 * Retrieves the id associated to the modal dialog icon element
 * @return {string} The id associated to the modal dialog icon element
 */
ModalDialog.prototype.getIconElementId = function() {
	return this.m_icon.elementId;
};

/**
 * Retrieves the text which will be displayed the user hovers over the modal dialog icon
 * @return {string} The text displayed when hovering over the modal dialog icon
 */
ModalDialog.prototype.getIconHoverText = function() {
	return this.m_icon.hoverText;
};

/**
 * Retrieves the text which will be displayed next to the icon used to open the modal dialog
 * @return {string} The text displayed next to the icon
 */
ModalDialog.prototype.getIconText = function() {
	return this.m_icon.text;
};

/**
 * Retrieves the id given to this modal dialog object
 * @return {string} The id given to this modal dialog object
 */
ModalDialog.prototype.getId = function() {
	return this.m_modalId;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is active or not
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsActive = function() {
	return this.m_isModalActive;
};

/**
 * Retrieves a boolean which determines if this body of the modal dialog object has a fixed height or not
 * @return {boolean} The flag which determines if the body of the modal dialog object is fixed or not
 */
ModalDialog.prototype.getIsBodySizeFixed = function() {
	return this.m_body.isBodySizeFixed;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is fixed to the icon used to launch it.
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsFixedToIcon = function() {
	return this.m_isFixedToIcon;
};

/**
 * Retrieves a boolean which determines if this modal dialog footer is always shown or not.
 * @return {boolean} The flag which determines if this modal dialog footer is always shown or not.
 */
ModalDialog.prototype.getIsFooterAlwaysShown = function() {
	return this.m_footer.isAlwaysShown;
};

/**
 * Retrieves a boolean which determines if this modal dialog icon is active or not.  If the icon is not active it should
 * not be clickable by the user and the cursor should not change when hovered over.
 * @return {boolean} The flag which determines if modal dialog icon is active or not.
 */
ModalDialog.prototype.getIsIconActive = function() {
	return this.m_icon.isActive;
};

/**
 * Retrieves the percentage set for the left margin of the modal dialog
 * @return {number} The percentage assigned to the left margin for the modal dialog
 */
ModalDialog.prototype.getLeftMarginPercentage = function() {
	return this.m_margins.left;
};

/**
 * Retrieves the percentage set for the right margin of the modal dialog
 * @return {number} The percentage assigned to the right margin for the modal dialog
 */
ModalDialog.prototype.getRightMarginPercentage = function() {
	return this.m_margins.right;
};

/**
 * Retrieves a boolean which determines if the close icon should be shown in the modal dialog.
 * @return {boolean} The flag which determines if the close icon should be shown or not.
 */
ModalDialog.prototype.getShowCloseIcon = function() {
	return this.m_showCloseIcon;
};

/**
 * Retrieves the percentage set for the top margin of the modal dialog
 * @return {number} The percentage assigned to the top margin for the modal dialog
 */
ModalDialog.prototype.getTopMarginPercentage = function() {
	return this.m_margins.top;
};

/** Setters **/
/**
 * Sets the function to be called when the modal dialog is shown.  This function will be passed ModalDialog object so that
 * it can interact with the modal dialog easily while the dialog is open.
 * @param {function} dataFunc The function used to populate the body of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyDataFunction = function(dataFunc) {

	//Check the proposed function
	if(!( typeof dataFunc === "function") && dataFunc !== null) {
		MP_Util.LogError("ModalDialog.setBodyDataFunction: dataFunc param must be a function or null");
		return this;
	}

	this.m_body.dataFunction = dataFunc;
	return this;
};

/**
 * Sets the html element id of the modal dialog body.  This id will be used to insert html into the body of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getBodyElementId()).attr("id", elementId);
		}
		this.m_body.elementId = elementId;
	}
	return this;
};

/**
 * Sets the html of the body element.
 * @param {string} html The HTML to insert into the body element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyHTML = function(html) {
	if(html && typeof html == "string") {
		//Update the existing html iff the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getBodyElementId()).html(html);
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the bottom margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the bottom margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBottomMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.bottom = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the close on click property of a specific button in the modal dialog.
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} closeOnClick A boolean used to determine if the button should close the dialog or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonCloseOnClick = function(buttonId, closeOnClick) {
	var button = null;
	var buttonElement = null;
	var onClickFunc = null;
	var modal = this;

	//check the closeOnClick type
	if(!( typeof closeOnClick === "boolean")) {
		MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: closeOnClick param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if(button) {
		//Update the closeOnClick flag
		button.setCloseOnClick(closeOnClick);
		//If the modal dialog is active, update the existing class
		if(this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			buttonElement.click(function() {
				onClickFunc = button.getOnClickFunction();
				if(onClickFunc && typeof onClickFunc == "function") {
					onClickFunc();
				}
				if(closeOnClick) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});

		}
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the dithered property of a specific button in the modal dialog
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonDither = function(buttonId, dithered) {
	var button = null;
	var buttonElement = null;

	//check the dithered type
	if(!( typeof dithered === "boolean")) {
		MP_Util.LogError("ModalDialog.setFooterButtonDither: Dithered param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if(button) {
		//Update the dithered flag
		button.setIsDithered(dithered);
		//If the modal dialog is active, update the existing class
		if(this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			if(dithered) {
				$(buttonElement).attr("disabled", true);
			}
			else {
				$(buttonElement).attr("disabled", false);
			}
		}
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonDither: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the onclick function of the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonOnClickFunction = function(buttonId, clickFunc) {
	var button = null;
	var modal = this;

	//Check the proposed function and make sure it is a function
	if(!( typeof clickFunc == "function") && clickFunc !== null) {
		MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: clickFunc param must be a function or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if(button) {
		//Set the onclick function of the button
		button.setOnClickFunction(clickFunc);
		//If the modal dialog is active, update the existing onClick function
		$("#" + buttonId).unbind("click").click(function() {
			if(clickFunc) {
				clickFunc();
			}
			if(button.closeOnClick()) {
				MP_ModalDialog.closeModalDialog(modal.getId());
			}
		});

	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the text displayed in the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {string} buttonText the text to display in the button
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonText = function(buttonId, buttonText) {
	var button = null;

	//Check the proposed text and make sure it is a string
	if(!( typeof buttonText === "string")) {
		MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must be a string");
		return this;
	}

	//Check make sure the string is not empty
	if(!buttonText) {
		MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must not be empty or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if(button) {
		//Set the onclick function of the button
		button.setText(buttonText);
		//If the modal dialog is active, update the existing onClick function
		$("#" + buttonId).html(buttonText);
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonText: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog footer.  This id will be used to interact with the footer of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getFooterElementId()).attr("id", elementId);
		}
		this.m_footer.elementId = elementId;
	}
	return this;
};

/**
 * Sets the label that will appear next to the checkbox in the modal dialog footer
 * @param {string} label A label that will appear next to the corresponding checkbox
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxLabel = function(label) {
	if(typeof label == "string" && label !== "") {
		this.m_footer.checkbox.label = label;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is visible or not.
 * @param {boolean} isEnabled A flag that will determine if the footer checkbox is visible or not.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxEnabled = function(isEnabled) {
	if(typeof isEnabled == "boolean") {
		this.m_footer.checkbox.enabled = isEnabled;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is checked or not checked.
 * @param {boolean} isChecked A flag that will determine the state of the footer checkbox.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxIsChecked = function(isChecked) {
	if(typeof isChecked == "boolean") {
		this.m_footer.checkbox.isChecked = isChecked;
	}
	return this;
};

/**
 * Sets the function that will be called when the footer checkbox is clicked.
 * @param {function} checkboxClickFunction A function that will be called whenever the footer
 * checkbox is clicked
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxClickFunction = function(checkboxClickFunction) {
	if(checkboxClickFunction && (typeof checkboxClickFunction == "function")) {
		//If the user defines the checkbox click function, assume they want it enabled
		this.setFooterCheckboxEnabled(true);
		this.m_footer.checkbox.onClick = checkboxClickFunction;
	}
	return this;
};

/**
 * Sets the indicator which determines if the icon to launch the modal dialog is active or not.  When this is
 * set, the icon and its interactions are updated if it is shown on the MPage.
 * @param {boolean} activeInd An indicator which determines if the modal dialog icon is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsIconActive = function(activeInd) {
	var modal = this;

	if( typeof activeInd == "boolean") {
		this.m_icon.isActive = activeInd;
		//Update the icon click event based on the indicator
		//Get the icon container and remove all events if there are any
		var iconElement = $("#" + this.getIconElementId());
		if(iconElement) {
			$(iconElement).unbind("click");
			$(iconElement).removeClass("vwp-util-icon");
			if(activeInd) {
				//Add the click event
				$(iconElement).click(function() {
					MP_ModalDialog.showModalDialog(modal.getId());
				});


				$(iconElement).addClass("vwp-util-icon");
			}
		}
	}
	return this;
};

/**
 * Sets the flag which determines if the modal dialog will have a gray backgound when rendered.  This property
 * will not update dynamically.
 * @param {boolean} hasGrayBackground The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHasGrayBackground = function(hasGrayBackground) {
	if( typeof hasGrayBackground == "boolean") {
		this.m_hasGrayBackground = hasGrayBackground;
	}
	return this;
};

/**
 * Sets the function to be called upon the user choosing to close the dialog via the exit button instead of one of the available buttons.
 * @param {function} closeFunc The function to call when the user closes the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderCloseFunction = function(closeFunc) {
	var modal = this;
	//Check the proposed function and make sure it is a function
	if(!( typeof closeFunc === "function") && closeFunc !== null) {
		MP_Util.LogError("ModalDialog.setHeaderCloseFunction: closeFunc param must be a function or null");
		return this;
	}

	//Update close function since it is valid
	this.m_header.closeFunction = closeFunc;

	//Update the header close function if the modal is active
	if(this.isActive()) {
		//Get the close element
		$('.dyn-modal-hdr-close').click(function() {
			if(closeFunc) {
				closeFunc();
			}
			//call the close mechanism of the modal dialog to cleanup everything
			MP_ModalDialog.closeModalDialog(modal.getId());
		});

	}
	return this;
};

/**
 * Sets the html element id of the modal dialog header.  This id will be used to interact with the header of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getHeaderElementId()).attr("id", elementId);
		}
		this.m_header.elementId = elementId;
	}
	return this;
};

/**
 * Sets the title to be displayed in the modal dialog header.
 * @param {string} headerTitle The string to be used in the modal dialog header as the title
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderTitle = function(headerTitle) {
	if(headerTitle && typeof headerTitle == "string") {
		this.m_header.title = headerTitle;
		//Update the existing header title if the modal dialog is active
		if(this.isActive()) {
			$('#' + this.getHeaderElementId() + " .dyn-modal-hdr-title").html(headerTitle);
		}
	}
	return this;
};

/**
 * Sets the css class to be used to display the modal dialog launch icon.  This class should contain a background and proper sizing
 * as to diaply the entire icon.
 * @param {string} iconClass The css class to be applied to the html element the user will use to launch the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconClass = function(iconClass) {
	if(iconClass && typeof iconClass == "string") {
		//Update the existing icon class
		$('#' + this.getIconElementId()).removeClass(this.m_icon.cssClass).addClass(iconClass);
		this.m_icon.cssClass = iconClass;
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog icon.  This id will be used to interact with the icon of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getIconElementId()).attr("id", elementId);
		}
		this.m_icon.elementId = elementId;
	}
	return this;
};

/**
 * Sets the test which will be displayed to the user when hovering over the modal dialog icon.
 * @param {string} iconHoverText The text to display in the icon hover
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconHoverText = function(iconHoverText) {
	if(iconHoverText !== null && typeof iconHoverText == "string") {
		this.m_icon.hoverText = iconHoverText;
		//Update the icon hover text
		if($('#' + this.getIconElementId()).length > 0) {
			$('#' + this.getIconElementId()).attr("title", iconHoverText);
		}
	}
	return this;
};

/**
 * Sets the text to be displayed next to the modal dialog icon.
 * @param {string} iconText The text to display next to the modal dialog icon.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconText = function(iconText) {
	if(iconText !== null && typeof iconText == "string") {
		this.m_icon.text = iconText;
		//Update the icon text
		if($('#' + this.getIconElementId()).length > 0) {
			$('#' + this.getIconElementId()).html(iconText);
		}
	}
	return this;
};

/**
 * Sets the id which will be used to identify a particular ModalDialog object.
 * @param {string} id The id that will be assigned to this ModalDialog object
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setId = function(id) {
	if(id && typeof id == "string") {
		this.m_modalId = id;
	}
	return this;
};

/**
 * Sets the flag which identifies the modal dialog as being active or not
 * @param {boolean} activeInd A boolean that can be used to determine if the modal is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsActive = function(activeInd) {
	if( typeof activeInd == "boolean") {
		this.m_isModalActive = activeInd;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog body is a fixed height or not.
 * @param {boolean} bodyFixed A boolean that can be used to determine if the modal dialog has a fixed size body or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsBodySizeFixed = function(bodyFixed) {
	if( typeof bodyFixed == "boolean") {
		this.m_body.isBodySizeFixed = bodyFixed;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog is fixed to the icon or not.  If this flag is set
 * the modal dialog will be displayed as an extension of the icon used to launch the dialog, much like a popup window.
 * In this case the Top and Right margins are ignored and the location of the icon will determine those margins.  If this
 * flag is set to false the modal dialog window will be displayed according to all of the margin settings.
 * @param {boolean} fixedToIcon A boolean that can be used to determine if the modal is fixed to the launch icon or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFixedToIcon = function(fixedToIcon) {
	if( typeof fixedToIcon == "boolean") {
		this.m_isFixedToIcon = fixedToIcon;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog footer is always shown or not
 * @param {boolean} footerAlwaysShown A boolean used to determine if the modal dialog footer is always shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFooterAlwaysShown = function(footerAlwaysShown) {
	if( typeof footerAlwaysShown == "boolean") {
		this.m_footer.isAlwaysShown = footerAlwaysShown;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the left margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the left margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setLeftMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.left = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the right margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the right margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setRightMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.right = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog close icon is shown or not
 * @param {boolean} showCloseIcon A boolean used to determine if the modal dialog close icon is shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setShowCloseIcon = function(showCloseIcon) {
	if( typeof showCloseIcon == "boolean") {
		this.m_showCloseIcon = showCloseIcon;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the top margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the top margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setTopMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.top = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * The ModalButton class is used specifically for adding buttons to the footer of a modal dialog.
 * @constructor
 */
function ModalButton(buttonId) {
	//The id given to the button.  This id will be used to identify individual buttons
	this.m_buttonId = buttonId;
	//The text that will be displayed in the button itself
	this.m_buttonText = "";
	//A flag to determine if the button shall be disabled or not
	this.m_dithered = false;
	//The function to call when the button is clicked
	this.m_onClickFunction = null;
	//A flag to determine if this button should be closed when clicked.
	this.m_closeOnClick = true;
	//A flag to determine if this button should be focused when the modal dialog is shown
	this.m_focusInd = false;
}

/** Checkers **/
/**
 * Check to see if the button click should close the modal dialog on click
 * @return {boolean} A boolean which determines if the button click should cause the modal dialog to close
 */
ModalButton.prototype.closeOnClick = function() {
	return this.m_closeOnClick;
};

/**
 * Check to see if the Modal Button is currently dithered
 * @return {boolean} A boolean flag that indicates if the modal button is dithered or not
 */
ModalButton.prototype.isDithered = function() {
	return this.m_dithered;
};

/** Getters **/
/**
 * Retrieves the id assigned the this ModalButton object
 * @return {string} The id assigned to this ModalButton object
 */
ModalButton.prototype.getId = function() {
	return this.m_buttonId;
};

/**
 * Retrieve the close on click flag of the ModalButton object
 * @return {boolean} The close on click flag of the ModalButton object
 */
ModalButton.prototype.getCloseOnClick = function() {
	return this.m_closeOnClick;
};

/**
 * Retrieve the focus indicator flag of the ModalButton object
 * @return {boolean} The focus indicator flag of the ModalButton object
 */
ModalButton.prototype.getFocusInd = function() {
	return this.m_focusInd;
};

/**
 * Retrieves the text used for the ModalButton display
 * @return {string} The text which will be used in the button display
 */
ModalButton.prototype.getText = function() {
	return this.m_buttonText;
};

/**
 * Retrieves the onClick function associated to this Modal Button
 * @return {function} The function executed when the button is clicked
 */
ModalButton.prototype.getOnClickFunction = function() {
	return this.m_onClickFunction;
};

/** Setters **/

/**
 * Sets the id of the ModalButton object.  The id must be a string otherwise it is ignored.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setId = function(buttonId) {
	if(buttonId && typeof buttonId == "string") {
		this.m_buttonId = buttonId;
	}
	return this;
};

/**
 * Sets the close on click flag of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setCloseOnClick = function(closeFlag) {
	if( typeof closeFlag == "boolean") {
		this.m_closeOnClick = closeFlag;
	}
	return this;
};

/**
 * Sets the focus indicator flag of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setFocusInd = function(focusInd) {
	if( typeof focusInd == "boolean") {
		this.m_focusInd = focusInd;
	}
	return this;
};

/**
 * Sets the text which will be shown in the button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setText = function(buttonText) {
	if(buttonText && typeof buttonText == "string") {
		this.m_buttonText = buttonText;
	}
	return this;
};

/**
 * Sets the dithered status of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setIsDithered = function(dithered) {
	if( typeof dithered == "boolean") {
		this.m_dithered = dithered;
	}
	return this;
};

/**
 * Sets the onClick function for the ModalButton
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setOnClickFunction = function(clickFunc) {
	this.m_onClickFunction = clickFunc;
	return this;
};

/**
 * A collection of functions which can be used to maintain, create, destroy and update modal dialogs.
 * The MP_ModalDialog function keeps a copy of all of the ModalDialog objects that have been created
 * for the current view.  If a ModalDialog object is updated outside of these functions, the updated
 * version of the object should replace the stale version that is stored here by using the
 * updateModalDialogObject functionality.
 * @namespace
 */
var MP_ModalDialog = function() {
	var modalDialogObjects = {};
	var whiteSpacePixels = 26;

	//A inner function used to the resize event that can be added and also removed from the window
	var resizeFunction = function() {
		MP_ModalDialog.resizeAllModalDialogs();
	};

	return {
		/**
		 * This function will be used to add ModalDialog objects to the collection of ModalDialog objects for the current
		 * View.  This list of ModalDialog objects will be the one source of this type of object and will be used when
		 * showing modal dialogs.
		 * @param {ModalDialog} modalObject An instance of the ModalDialog object
		 */
		addModalDialogObject: function(modalObject) {
			var modalId = "";
			//Check that he object is not null and that the object type is ModalDialog
			if(!( modalObject instanceof ModalDialog)) {
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject only accepts objects of type ModalDialog");
				return false;
			}

			//Check for a valid id.
			modalId = modalObject.getId();
			if(!modalId) {
				//Modal id is not populated
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: no/invalid ModalDialog id given");
				return false;
			}
			else if(modalDialogObjects[modalId]) {
				//Modal id is already in use
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: modal dialog id" + modalId + " is already in use");
				return false;
			}

			//Add the ModalDialog Object to the list of ModalDialog objects
			modalDialogObjects[modalId] = modalObject;
		},

		/**
		 * Add the modal dialog icon to the viewpoint framework.  This icon will be responsible for
		 * launching the correct modal dialog based on the ModalDialog object that it is associated to.
		 * @param {string} modalDialogId The id of the ModalDialog object to reference when creating the modal dialog icon
		 * @return null
		 */
		addModalDialogOptionToViewpoint: function(modalDialogId) {
			var modalObj = null;
			var iconElement = null;
			var vwpUtilElement = null;

			//Check to see if the ModalDialog exists
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				return;
			}

			//Check to see if the modal utility has already been added to the viewpoint
			if($("#" + modalDialogId).length > 0) {
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: Modal dialog " + modalDialogId + " already added");
				return;
			}
			
			//If the MP_Viewpoint function is defined call it
			if(typeof MP_Viewpoint.addModalDialogUtility != 'undefined'){
				MP_Viewpoint.addModalDialogUtility(modalObj);
			}
		},

		/**
		 * Closes all of the associated modal dialog windows and removes the resize event listener
		 * @return null
		 */
		closeModalDialog: function(modalDialogId) {
			var modalObj = null;

			//Check to see if the ModalDialog exists
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				return;
			}

			//destroy the modal dialog
			$("#vwpModalDialog" + modalObj.getId()).remove();
			//destroy the modal background
			$("#vwpModalBackground" + modalObj.getId()).remove();
			//remove modal dialog resize event from the window
			$(window).unbind("resize", resizeFunction);
			//Mark the modal dialog as inactive
			modalObj.setIsActive(false);
			$("body").css("overflow","auto");
		},

		/**
		 * Deletes the modal dialog object with the id modalDialogId.
		 * @param {string} modalDialogId The id of the modal dialog object to be deleted
		 * @return {boolean} True if a ModalDialog object was deleted, false otherwise
		 */
		deleteModalDialogObject: function(modalDialogId) {
			if(modalDialogObjects[modalDialogId]) {
				modalDialogObjects[modalDialogId] = null;
				return true;
			}
			return false;
		},

		/**
		 * Retrieves the ModalDialog object with the id of modalDialogId
		 * @param {string} modalDialogId The id of the modal dialog object to retrieve
		 */
		retrieveModalDialogObject: function(modalDialogId) {
			if(modalDialogObjects[modalDialogId]) {
				return modalDialogObjects[modalDialogId];
			}
			return null;
		},

		/**
		 * Resizes all of the active modal dialogs when the window itself is being resized.
		 * @param {string} modalDialogId The id of the modal dialog object to resize
		 */
		resizeAllModalDialogs: function() {
			var tempObj = null;
			var attr = "";
			//Get all of the modal dialog objects from the modalDialogObjects collection
			for(attr in modalDialogObjects) {
				if(modalDialogObjects.hasOwnProperty(attr)) {
					tempObj = modalDialogObjects[attr];
					if(( tempObj instanceof ModalDialog) && tempObj.isActive()) {
						MP_ModalDialog.resizeModalDialog(tempObj.getId());
					}
				}
			}
		},

		/**
		 * Resizes the modal dialog when the window itself is being resized.
		 * @param {string} modalDialogId The id of the modal dialog object to resize
		 */
		resizeModalDialog: function(modalDialogId) {
			var docHeight = 0;
			var docWidth = 0;
			var topMarginSize = 0;
			var leftMarginSize = 0;
			var bottomMarginSize = 0;
			var rightMarginSize = 0;
			var modalWidth = "";
			var modalHeight = "";
			var modalObj = null;

			//Get the ModalDialog object
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				MP_Util.LogError("MP_ModalDialog.resizeModalDialog: No modal dialog with the id " + modalDialogId + "exists");
				return;
			}

			if(!modalObj.isActive()) {
				MP_Util.LogError("MP_ModalDialog.resizeModalDialog: this modal dialog is not active it cannot be resized");
				return;
			}

			//Determine the new margins and update accordingly
			docHeight = $(window).height();
			docWidth = $(document.body).width();
			topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
			leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
			bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
			rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
			modalWidth = (docWidth - leftMarginSize - rightMarginSize);
			modalHeight = (docHeight - topMarginSize - bottomMarginSize);
			$("#vwpModalDialog" + modalObj.getId()).css({
				"top": topMarginSize,
				"left": leftMarginSize,
				"width": modalWidth + "px"
			});

			//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
			if(modalObj.isBodySizeFixed()) {
				$("#vwpModalDialog" + modalObj.getId()).css("height", modalHeight + "px");
				$("#" + modalObj.getBodyElementId()).height(modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels);
			}
			else {
				$("#vwpModalDialog" + modalObj.getId()).css("max-height", modalHeight + "px");
				$("#" + modalObj.getBodyElementId()).css("max-height", (modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels) + "px");
			}

			//Make sure the modal background is resized as well
			$("#vwpModalBackground" + modalObj.getId()).css({
				"height": "100%",
				"width": "100%"
			});
		},

		/**
		 * Render and show the modal dialog based on the settings applied in the ModalDialog object referenced by the
		 * modalDialogId parameter.
		 * @param {string} modalDialogId The id of the ModalDialog object to render
		 * @return null
		 */
		showModalDialog: function(modalDialogId) {
			var bodyDiv = null;
			var bodyLoadFunc = null;
			var bottomMarginSize = 0;
			var button = null;
			var dialogDiv = null;
			var docHeight = 0;
			var docWidth = 0;
			var focusButtonId = "";
			var footerDiv = null;
			var footerButtons = [];
			var footerButtonsCnt = 0;
			var footerButtonContainer = null;
			var headerDiv = null;
			var leftMarginSize = 0;
			var modalDiv = null;
			var modalObj = null;
			var modalHeight = "";
			var modalWidth = "";
			var rightMarginSize = 0;
			var topMarginSize = 0;
			var x = 0;
			var footerCheckbox = null;

			/**
			 * This function is used to create onClick functions for each button.  Using this function
			 * will prevent closures from applying the same action onClick function to all buttons.
			 */
			function createButtonClickFunc(buttonObj, modalDialogId) {
				var clickFunc = buttonObj.getOnClickFunction();
				var closeModal = buttonObj.closeOnClick();
				if(!clickFunc) {
					clickFunc = function() {
					};
					

				}
				return function() {
					clickFunc();
					if(closeModal) {
						MP_ModalDialog.closeModalDialog(modalDialogId);
					}
				};

			}

			//Get the ModalDialog object
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				MP_Util.LogError("MP_ModalDialog.showModalDialog: No modal dialog with the id " + modalDialogId + "exists");
				return;
			}

			//Check to see if the modal dialog is already displayed.  If so, return
			if(modalObj.isActive()) {
				return;
			}

			//Create the modal window based on the ModalDialog object
			//Create the header div element
			headerDiv = $('<div></div>').attr({
				id: modalObj.getHeaderElementId()
			}).addClass("dyn-modal-hdr-container").append($('<span></span>').addClass("dyn-modal-hdr-title").html(modalObj.getHeaderTitle()));
			if(modalObj.showCloseIcon()) {
				headerDiv.append($('<span></span>').addClass("dyn-modal-hdr-close").click(function() {
					var closeFunc = null;
					//call the close function of the modalObj
					closeFunc = modalObj.getHeaderCloseFunction();
					if(closeFunc) {
						closeFunc();
					}
					//call the close mechanism of the modal dialog to cleanup everything
					MP_ModalDialog.closeModalDialog(modalDialogId);
				}));

			}

			//Create the body div element
			bodyDiv = $('<div></div>').attr({
				id: modalObj.getBodyElementId()
			}).addClass("dyn-modal-body-container");

			//Grab the checkbox object
			footerCheckbox = modalObj.getFooterCheckbox();
			
			//Create the footer element if there are any buttons available
			footerButtons = modalObj.getFooterButtons();
			footerButtonsCnt = footerButtons.length;
			if(footerButtonsCnt || footerCheckbox.enabled) {
				//Create the footer element
				footerDiv = $('<div></div>').attr({
					id: modalObj.getFooterElementId()
				}).addClass("dyn-modal-footer-container");
				
				if (footerCheckbox.enabled){
					var checkboxContainer = $('<label></label>').addClass("dyn-modal-checkbox-container");
					var checkboxEle = $("<input type='checkbox' class='dyn-modal-checkbox'>");
					checkboxEle.get(0).checked = footerCheckbox.isChecked;
					checkboxEle.click(footerCheckbox.onClick).appendTo(checkboxContainer);
					$("<span>" + footerCheckbox.label + "</span>").addClass("dyn-modal-checkbox-label").appendTo(checkboxContainer);
					footerDiv.append(checkboxContainer);
				}
				if (footerButtonsCnt){
					footerButtonContainer = $('<div></div>').attr({
						id: modalObj.getFooterElementId() + "btnCont"
					}).addClass("dyn-modal-button-container");
					for( x = 0; x < footerButtonsCnt; x++) {
						button = footerButtons[x];
						buttonFunc = button.getOnClickFunction();
						footerButtonContainer.append($('<button></button>').attr({
							id: button.getId(),
							disabled: button.isDithered()
						}).addClass("dyn-modal-button").html(button.getText()).click(createButtonClickFunc(button, modalObj.getId())));

						//Check to see if we should focus on this button when loading the modal dialog
						if(!focusButtonId) {
							focusButtonId = (button.getFocusInd()) ? button.getId() : "";
						}
					}
					footerDiv.append(footerButtonContainer);
				}
				
			}
			else if(modalObj.isFooterAlwaysShown()) {
				footerDiv = $('<div></div>').attr({
					id: modalObj.getFooterElementId()
				}).addClass("dyn-modal-footer-container");
				footerDiv.append(footerButtonContainer);
			}

			//determine the dialog size
			docHeight = $(window).height();
			docWidth = $(document.body).width();
			topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
			leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
			bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
			rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
			modalWidth = (docWidth - leftMarginSize - rightMarginSize);
			modalHeight = (docHeight - topMarginSize - bottomMarginSize);
			dialogDiv = $('<div></div>').attr({
				id: "vwpModalDialog" + modalObj.getId()
			}).addClass("dyn-modal-dialog").css({
				"top": topMarginSize,
				"left": leftMarginSize,
				"width": modalWidth + "px"
			}).append(headerDiv).append(bodyDiv).append(footerDiv);

			//Create the modal background if set in the ModalDialog object.
			modalDiv = $('<div></div>').attr({
				id: "vwpModalBackground" + modalObj.getId()
			}).addClass((modalObj.hasGrayBackground()) ? "dyn-modal-div" : "dyn-modal-div-clear").height($(document).height());

			//Add the flash function to the modal if using a clear background
			if(!modalObj.hasGrayBackground()) {
				modalDiv.click(function() {
					var modal = $("#vwpModalDialog" + modalObj.getId());
					$(modal).fadeOut(100);
					$(modal).fadeIn(100);
				});

			}

			//Add all of these elements to the document body
			$(document.body).append(modalDiv).append(dialogDiv);
			//Set the focus of a button if indicated
			if(focusButtonId) {
				$("#" + focusButtonId).focus();
			}
			//disable page scrolling when modal is enabled
			$("body").css("overflow", "hidden");

			//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
			if(modalObj.isBodySizeFixed()) {
				$(dialogDiv).css("height", modalHeight + "px");
				$(bodyDiv).height(modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels);
			}
			else {
				$(dialogDiv).css("max-height", modalHeight + "px");
				$(bodyDiv).css("max-height", (modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels) + "px");
			}

			//This next line makes the modal draggable.  If this is commented out updates will need to be made
			//to resize functions and also updates to the ModalDialog object to save the location of the modal
			//$(dialogDiv).draggable({containment: "parent"});

			//Mark the displayed modal as active and save its id
			modalObj.setIsActive(true);

			//Call the onBodyLoadFunction of the modal dialog
			bodyLoadFunc = modalObj.getBodyDataFunction();
			if(bodyLoadFunc) {
				bodyLoadFunc(modalObj);
			}

			//Attempt to resize the window as it is being resized
			$(window).resize(resizeFunction);
		},

		/**
		 * Updates the existing ModalDialog with a new instance of the object.  If the modal objet does not exist it is added to the collection
		 * @param {ModalDialog} modalObject The updated instance of the ModalDialog object.
		 * @return null
		 */
		updateModalDialogObject: function(modalObject) {
			var modalDialogId = "";

			//Check to see if we were passed a ModalDialog object
			if(!modalObject || !( modalObject instanceof ModalDialog)) {
				MP_Util.LogError("MP_ModalDialog.updateModalDialogObject only accepts objects of type ModalDialog");
				return;
			}

			//Blindly update the ModalDialog object.  If it didnt previously exist, it will now.
			modalDialogId = modalObject.getId();
			modalDialogObjects[modalDialogId] = modalObject;
			return;
		}

	};
}();
