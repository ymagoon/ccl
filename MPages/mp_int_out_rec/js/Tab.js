/**
 * Creates a new Tab.
 * @class
 * @param {String}   id                 The desired ID to link the TabButton and TabContent.
 * @param {String}   buttonReferenceId  The ID of the element to refer to when adding the TabButton to the DOM.
 * @param {String}   buttonInjectMethod Either "append" or "insert".
 * @param {String}   buttonLabel        The label that should appear on the TabButton.
 * @param {Object[]} cssArr             A list of CSS styles to set. See {@link TabButton#setCssClasses|setCssClasses} for more information.
 * @param {String}   cssArr[].key       The CSS property to set.
 * @param {String}   cssArr[].css       The CSS class to set.
 * @param {String}   contentContainerId The ID of the parent element to append the TabContent to.
 * @param {String}   content            The HTML content to show in the TabContent.
 * @param {Boolean}  isSelected         True if the Tab is to be selected, false otherwise.
 */
var Tab = function(id, buttonReferenceId, buttonInjectMethod, buttonLabel, cssArr, contentContainerId, content, isSelected) {
    var tab = this,
        button = new TabButton(id + "Button", buttonReferenceId, buttonInjectMethod, buttonLabel, cssArr, isSelected);
        content = new TabContent(id + "Content", contentContainerId, content, isSelected);
    /**
     * Gets the TabButton.
     * @memberOf Tab
     * @public
     * @return {TabButton} The TabButton.
     */
    tab.getButton = function() {
        return button;
    };
    /**
     * Gets the TabContent.
     * @memberOf Tab
     * @public
     * @return {TabContent} The TabContent.
     */
    tab.getContent = function() {
        return content;
    };
};

/**
 * Gets if the tab is selected or not.
 * @memberOf  Tab
 * @return {Boolean} True if selected, false otherwise.
 */
Tab.prototype.isSelected = function() {
    return ((this.getButton().isSelected() === true) && (this.getContent().isSelected() === true));
};

/**
 * Sets the selected status of the Tab through both the TabButton and TabContent.
 * @memberOf  Tab
 * @param {Boolean} isSelected True if the tab is to be selected, false otherwise.
 * @return {Tab}               The Tab.
 */
Tab.prototype.setSelected = function(isSelected) {
    this.getButton().setSelected(isSelected);
    this.getContent().setSelected(isSelected);
    return this;
};

/**
 * Removes the corresponding elements from the DOM.
 * @memberOf  Tab
 * @return {Tab} The Tab.
 */
Tab.prototype.remove = function() {
    this.getButton().remove();
    this.getContent().remove();
    return this;
};
