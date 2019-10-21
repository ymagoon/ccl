/**
 * Creates a new TabContent.
 * @class
 * @param {String}  id                 The desired ID of the new TabContent.
 * @param {String}  contentContainerId The ID of the desired parent element.
 * @param {String}  cont               A HTML string of content to display.
 * @param {Boolean} isSelected         True if the TabCotnent is to be selected, false otherwise.
 */
var TabContent = function (id, contentContainerId, cont, isSelected) {
    var tabContent = this,
    /**
     * The selected CSS class.
     * @memberOf TabContent
     * @private
     * @type {String}
     */
    cssSelected = "contentSelected",
    /**
     * The unselected CSS class.
     * @memberOf TabContent
     * @private
     * @type {String}
     */
    cssUnselected = "contentUnselected",
    /**
     * The HTML DOM Element for the TabContent.
     * @memberOf TabContent
     * @private
     * @type {Object}
     */
    elem;

    /**
     * Gets the DOM Element of the TabContent.
     * @memberOf TabContent
     * @public
     * @return {Object} The DOM Element of the TabContent.
     */
    tabContent.getElement = function() {
        return elem;
    };

    /**
     * Sets the DOM Element of the TabContent.
     * @memberOf TabContent
     * @public
     * @param {Object}      contentElem The new DOM Element for the TabContent.
     * @return {TabContent}             The TabContent.
     */
    tabContent.setElement = function(contentElem) {
        if(typeof contentElem === "object" && contentElem !== null && contentElem.nodeName === "DIV") {
            elem = contentElem;
        } else {
            throw new Error(errorMessages.invalidParameter);
        }
        return tabContent;
    };

    /**
     * Sets the selected status of the TabContent by updating the CSS class of the DOM Element.
     * @memberOf TabContent
     * @public
     * @param  {Boolean}    isSelected True if selected, false otherwise.
     * @return {TabContent}            The TabContent
     */
    tabContent.setSelected = function(isSelected) {
        if(typeof isSelected === "boolean") {
            tabContent.getElement().className =  isSelected === true ? cssSelected : cssUnselected;
        } else {
            throw new Error(errorMessages.invalidParameter);
        }
        return tabContent;
    };

    /**
     * Gets the selected status of the TabContent.
     * @memberOf TabContent
     * @public
     * @return {Boolean} True if selected, false otherwise.
     */
    tabContent.isSelected = function() {
        return tabContent.getElement().className.indexOf(cssSelected) !== -1;
    };

    /**
     * Gets the Selected CSS class.
     * @memberOf TabContent
     * @public
     * @return {String} The selected CSS class.
     */
    tabContent.getCssSelected = function() {
        return cssSelected;
    };

    /**
     * Gets the Unselected CSS class.
     * @memberOf TabContent
     * @public
     * @return {String} The unselected CSS class.
     */
    tabContent.getCssUnselected = function() {
        return cssUnselected;
    };

    tabContent.initContentElement(id, contentContainerId, cont, isSelected);
};

/**
 * Gets the content of the TabContent.
 * @memberOf TabContent
 * @public
 * @return {String} The innerHTML of the TabContent.
 * @throws {invalidElement} Will throw an error if the element is invalid.
 */
TabContent.prototype.getContent = function() {
    var curElem = this.getElement();
    if(curElem !== null && typeof curElem === "object") {
        return curElem.innerHTML;
    } else {
        throw new Error(errorMessages.invalidElement);
    }
};

/**
 * Sets the content of the TabContent.
 * @memberOf TabContent
 * @public
 * @param  {String}     content The HTML string for the desired content.
 * @return {TabContent}         The TabContent;
 */
TabContent.prototype.setContent = function(content) {
    if(typeof content === "string") {
        this.getElement().innerHTML = content;
    } else {
        throw new Error(errorMessages.invalidParameter);
    }
    return this;
};

/**
 * Initializes the Element for the TabContent.
 * @memberOf TabContent
 * @public
 * @param  {String}     id                 The desired ID of the new TabContent.
 * @param  {String}     contentContainerId The ID of the parent element, where the TabContent element is to be appended.
 * @param  {String}     cont               The desired content HTML string.
 * @param  {Boolean}    isSelected         True if the TabContent is to be select, false otherwise.
 * @return {TabContent}                    The TabContent.
 */
TabContent.prototype.initContentElement = function(id, contentContainerId, cont, isSelected) {
    function createElem(tag, elemId, parentId) {
        var newElem = document.createElement(tag);
        newElem.setAttribute("id", elemId);
        document.getElementById(parentId).appendChild(newElem);
        return newElem;
    }
    return this.setElement(createElem("div", id, contentContainerId)).setContent(cont).setSelected(isSelected);
};

/**
 * Removes the TabContent Element from the DOM.
 * @memberOf TabContent
 * @public
 * @return {TabContent} The TabContent.
 */
TabContent.prototype.remove = function() {
    var tempElem = this.getElement();
    if(typeof tempElem === "object" && tempElem !== null && tempElem.nodeName === "DIV") {
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