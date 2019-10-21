/**
 * Creates a new TabButton.
 * @class 
 * @param {String}   id           The desired ID of the new TabButton.
 * @param {String}   referenceId  The ID of a reference element.
 * @param {String}   injectMethod The method of injecting the new TabButton element into the DOM, either "append" or "insert".
 * @param {String}   label        The label / test to be stored in the new TabButton.
 * @param {Object[]} cssArr       A list of CSS styles to set. See {@link TabButton#setCssClasses|setCssClasses} for more information.
 * @param {String}   cssArr[].key The CSS property to set.
 * @param {String}   cssArr[].css The CSS class to set.
 * @param {Boolean}  isSelected   True if the new TabButton should be selected, false otherwise.
 */
var TabButton = function(id, referenceId, injectMethod, label, cssArr, isSelected) {
    var tabButton = this,
    /**
     * The selected CSS class.
     * @type {String}
     * @memberOf TabButton
     * @private
     */
    cssSelected = "tabButtonSelected",
    /** 
     * The unselected CSS class.
     * @type {String}
     * @memberOf TabButton
     * @private
     */
    cssUnselected = "tabButtonUnselected",
    /**
     * The HTML DOM Element for the TabButton.
     * @type {Object}
     * @memberOf TabButton
     * @private
     */
    elem;

    /**
     * Gets the HTML DOM Element for the TabButton.
     * @memberOf TabButton
     * @public
     * @return {Object} The HTML DOM Element for the TabButton.
     */
    tabButton.getElement = function() {
        return elem;
    };
    /**
     * Sets the HTML DOM Element for the TabButton.
     * @memberOf TabButton
     * @protected
     * @param  {Object}    newElem The desired HTML DOM Element for the TabButton.
     * @return {TabButton}         The TabButton.
     * @throws {invalidElement}    Will throw an error if newElem is not a list item.
     */
    tabButton.setElement = function(newElem) {
        if(typeof newElem === "object" && newElem !== null && newElem.nodeName === "LI") {
            elem = newElem;
        } else {
            throw new Error(errorMessages.invalidElement);
        }
        return tabButton;
    };

    /**
     * Gets the Selected CSS class.
     * @memberOf TabButton
     * @public
     * @return {String} The selected CSS class.
     */
    tabButton.getCssSelected = function() {
        return cssSelected;
    };

    /**
     * Gets the Unselected CSS class.
     * @return {String} The unselected CSS class.
     */
    tabButton.getCssUnselected = function() {
        return cssUnselected;
    };

    /**
     * Sets the selected status of the TabButton by updating the CSS class of the DOM Element.
     * @memberOf TabButton
     * @public
     * @param  {Boolean}          isSelected True if selected, false otherwise.
     * @return {TabButton}                   The TabButton.
     * @throws {invalidParameter}            Will throw an error if the paremeter is not a boolean.
     */
    tabButton.setSelected = function(isSelected) {
        if(typeof isSelected === "boolean") {
            tabButton.getElement().childNodes[0].className =  isSelected === true ? cssSelected : cssUnselected;
        } else {
            throw new Error(errorMessages.invalidParameter);
        }
        return tabButton;
    };

    /**
     * Sets the TabButton CSS class member variables.
     * @memberOf TabButton
     * @public
     * @param  {Object[]} cssArr       A list of CSS classes.
     * @param  {String}   cssArr[].key A unique identifier for the CSS class member to set, either "selected" or "unselected".
     * @param  {String}   cssArr[].css A CSS class name.
     * @return {TabButton}             The TabButton.
     * @throws {invalidCssStructure}   Will throw an error if the cssArr is not an array.
     * @throws {invalidCssMember}      Will throw an error if the cssArr contains non-supported CSS members.
     */
    tabButton.setCssClasses = function(cssArr) {
        if(Array.isArray(cssArr) === true) {
            for(var i=0,len=cssArr.length; i<len; i++) {
                if(cssArr[i] !== null && typeof cssArr[i] === "object" && typeof cssArr[i].key === "string" && typeof cssArr[i].css === "string") {
                    switch(cssArr[i].key.toUpperCase()) {
                        case "SELECTED":
                            cssSelected = cssArr[i].css;
                            break;
                        case "UNSELECTED":
                            cssUnselected = cssArr[i].css;
                            break;
                        default:
                            throw new Error(errorMessages.invalidCssMember);
                    }
                }
            }
        } else {
            throw new Error(errorMessages.invalidCssStructure);
        }
        return tabButton;
    };

    /**
     * Gets the selected status of the TabButton.
     * @memberOf TabButton
     * @public
     * @return {Boolean} True if selected, false otherwise.
     * @throws {invalidElement} Will throw an error if the current element does not exist.
     */
    tabButton.isSelected = function() {
        var curElem = tabButton.getElement().childNodes[0];
        if(curElem !== null && typeof curElem === "object") {
            return curElem.className.indexOf(cssSelected) !== -1;
        } else {
            throw new Error(errorMessages.invalidElement);
        }
    };

    /**
     * Initializes the TabButton.
     * @constructs TabButton#
     * @private
     */
    function init() {
        tabButton.setCssClasses(cssArr)
            .initTabButtonElement(id, label, isSelected);
        if(typeof injectMethod === "string") {
            if(injectMethod.toUpperCase() === "APPEND") {
                tabButton.appendElement(referenceId);
            } else if(injectMethod.toUpperCase() === "INSERT") {
                tabButton.insertElement(referenceId);
            }
        }
    }

    init();
};

/**
 * Creates and initializes a TabButton Element.
 * @memberOf TabButton
 * @protected
 * @param  {String}    [id]       The desired ID for the new TabButton Element.
 * @param  {String}    label      The desired label for the new TabButton.
 * @param  {Boolean}   isSelected True if the TabButton is to be selected, false otherwise.
 * @return {TabButton}            The TabButton.
 */
TabButton.prototype.initTabButtonElement = function(id, label, isSelected) {
    /**
     * Creates a HTML DOM Element.
     * @memberOf TabButton.initTabButtonElement#
     * @private
     * @param  {String} tag The type of element to create.
     * @return {Object}     The HTML DOM Element.
     */
    function createElem(tag) {
        var tempElem = document.createElement(tag),
            tempSpan = document.createElement("span");
        if(typeof id === "string") {
            tempElem.setAttribute("id", id);
        }
        tempSpan.className = "tabButtonLabel";
        tempElem.appendChild(tempSpan);
        return tempElem;
    }
    return this.setElement(createElem("li")).setLabel(label).setSelected(isSelected);
};

/**
 * Appends the TabButton element to the specified parent element.
 * @memberOf TabButton
 * @public
 * @param  {String} parentId The ID of the DOM Element.
 * @return {TabButton}       The TabButton.
 * @throws {invalidReferenceElement} Will throw an error if the reference element does not exist.
 */
TabButton.prototype.appendElement = function(parentId) {
    var parentElement = document.getElementById(parentId);
    if(parentElement !== null) {
        parentElement.appendChild(this.getElement());
    } else {
        throw new Error(errorMessages.invalidReferenceElement);
    }
    return this;
};

/**
 * Inserts the Tabbutton element as the sibling before the specified element.
 * @memberOf TabButton
 * @public
 * @param  {String} siblingId The ID of the DOM Element.
 * @return {TabButton}        The TabButton.
 * @throws {invalidReferenceElement} Will throw an error if the reference element does not exist.
 * @throws {elementHasNoParent}      Will throw an error if the current element does not have a parent.
 */
TabButton.prototype.insertElement = function(siblingId) {
    var siblingElement = document.getElementById(siblingId);
    if(siblingElement !== null) {
        if(siblingElement.parentElement !== undefined) {
            siblingElement.parentElement.insertBefore(this.getElement(), siblingElement);
        } else {
            throw new Error(errorMessages.elementHasNoParent);
        }
    } else {
        throw new Error(errorMessages.invalidReferenceElement);
    }
    return this;
};

/**
 * Removes the current TabButton element from the DOM.
 * @memberOf TabButton
 * @public
 * @return {TabButton}          The TabButton.
 * @throws {invalidElement}     Will throw an error if the TabButton DOM Element is not a list item.
 * @throws {elementHasNoParent} Will throw an error if the TabButton DOM Element does not have a parent.
 */
TabButton.prototype.remove = function() {
    var tempElem = this.getElement();
    if(typeof tempElem === "object" && tempElem !== null && tempElem.nodeName === "LI") {
        if(tempElem.parentElement !== null) {
            tempElem.parentElement.removeChild(tempElem);
        } else {
            throw new Error(errorMessages.elementHasNoParent);
        }
    } else {
        throw new Error(errorMessages.invalidElement);
    }
    return this;
};

/**
 * Sets the label of the TabButton.
 * @memberOf TabButton
 * @public
 * @param  {String}           label The desired label for the TabButton.
 * @return {TabButton}              The TabButton.
 * @throws {invalidParameter}       Will throw an error if the label is not a string.
 */
TabButton.prototype.setLabel = function(label) {
    if(typeof label === "string") {
        this.getElement().childNodes[0].innerText = label;
    } else {
        throw new Error(errorMessages.invalidParameter);
    }
    return this;
};

/**
 * Gets the label of the TabButton.
 * @memberOf TabButton
 * @public
 * @return {String} The label of the TabButton.
 */
TabButton.prototype.getLabel = function() {
    return this.getElement().childNodes[0].innerText;
};