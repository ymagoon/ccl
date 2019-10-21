/**
 * A collection of messages to throw as errors.
 * @type {Object}
 * @readonly
 */
var errorMessages = {
    elementHasNoParent:      "The specified element has no parent element.",
    invalidCssMember:        "Invalid CSS member.",
    invalidCssStructure:     "Invalid CSS structure.",
    invalidElement:          "The element is not valid.",
    invalidInjectMethod:     "Invalid injectMethod specified.",
    invalidParameter:        "At least one specified parameter was invalid.",
    invalidReferenceElement: "The reference element specified by the referenceId was not found."
};

/**
 * Creates a TabsControl object.
 * @class
 * @param {String} id - The ID of the TabsControl.
 * @param {String} parent - The parent element for which to append the TabsControl.
 * @param {Object} [linkObjs[] - The information to create a link to another solution in the top right corner of the tabs.
 * @param {String} [linkObjs[].displayText] - The text to display as the link to open the modal.
 * @param {String} [linkObjs[].reportName] - The script name to call when launching the modal.
 * @param {String} [linkObjs[].reportParam] - The parameters used to call the script.
 */
var TabsControl = function (id, tabsControlParent, linkObjs) {
    var tabsControl = this,
    /**
     * The ID of the list containing each TabButton.
     * @memberOf TabsControl
     * @private
     * @type {String}
     */
    tabListId = id + "TabList",
    /**
     * The list DOM Element.
     * @memberOf TabsControl
     * @private
     * @type {Object}
     */
    tabList,
    /**
     * The ID of the container of each TabContent.
     * @memberOf TabsControl
     * @private
     * @type {String}
     */
    contentContainerId = id + "ContentContainer",
    /**
     * The content container DOM Element.
     * @memberOf TabsControl
     * @private
     * @type {Object}
     */
    contentContainer,
    /**
     * The container DOM Element for the entire TabsControl.
     * @memberOf TabsControl
     * @private
     * @type {Object}
     */
    tabsControlContainer,
    /**
     * The list of Tabs.
     * @memberOf TabsControl
     * @private
     * @type {Tab[]}
     */
    tabs = [];

    /**
     * Gets the list of tabs.
     * @memberOf TabsControl
     * @public
     * @return {Tab[]} The list of tabs.
     */
    tabsControl.getTabs = function() {
        return tabs;
    };

    /**
     * Clears the list of tabs.
     * @return {TabsControl} The TabsControl
     */
    tabsControl.clearTabs = function() {
        tabs = [];
        return tabsControl;
    };

    /**
     * Gets the element containing the entire TabsControl.
     * @return {Object} The container DOM Element for the entire TabsControl.
     */
    tabsControl.getControlContainer = function() {
        return tabsControlContainer;
    };

    /**
     * Gets the element containing the various TabContent elements.
     * @return {Object} The content container DOM Element.
     */
    tabsControl.getContentContainer = function() {
        return contentContainer;
    };

    /**
     * Appends a new tab to the list of tabs.
     * @memberOf TabsControl
     * @public
     * @param  {String}      tabId      The desired ID for the new tab.
     * @param  {String}      tabLabel   The desired label for the new tab button.
     * @param  {String}      tabContent A HTML string.
     * @return {TabsControl}            The TabsControl.
     */
    tabsControl.appendTab = function(tabId, tabLabel, tabContent) {
        var newTab = new Tab(tabId, tabListId, "append", tabLabel,  [], contentContainerId, tabContent, false);
        tabsControl.getTabs().push(newTab);
        return this;
    };

    /**
     * Creates a list for the tabs.
     * @memberOf TabsControl
     * @private
     * @param  {String} listId The desired ID for the list of TabButtons.
     * @param  {Object} parent The DOM Element that should be the parent of the new tab list.
     * @return {Object}        The new DOM Element for the tab list.
     */
    function createTabList(listId, parent) {
        var list = document.createElement("ul");
        list.setAttribute("id", listId);
        list.className = "tabButtonList";
        if(list.addEventListener === undefined) {   // IE8-
            list.attachEvent("onclick", function() {
                var clickedElement = window.event.srcElement;
                if(clickedElement.tagName === "SPAN") {
                    tabsControl.selectTab(clickedElement.parentElement.getAttribute("id"));
                }
            });
        } else {    // IE9+
            list.addEventListener("click", function(e) {
                if(e.target.tagName === "SPAN") {
                    tabsControl.selectTab(e.target.parentElement.getAttribute("id"));
                }
            });
        }
        parent.appendChild(list);
        return list;
    }
    
    /**
     * Sets the text of the link.
     * @memberOf TabsControl
     * @public
     * @param {String} linkId The id of the link.
     * @param {String} text The desired text for the link.
     */
    tabsControl.updateLinkText = function(linkId, text) {
        if(typeof linkId === "string" && typeof text === "string") {
            document.getElementById(linkId).innerText = text;
        }
    };

    /**
     * Creates the link to the right of the tabList.
     * @memberOf TabsControl
     * @private
     * @param  {String}   linkId      The desired ID for the link.
     * @param  {Object}   parent      The parent DOM Element to append to.
     * @param  {String}   [text]      The display text of the link.
     * @param  {Function} [onClickFn] The function to execute when the link is clicked.
     * @return {Object}   The DOM Element representing the link.
     */
    function createLink(linkId, parent, text, onClickFn) {
        var link = document.createElement("a");
        link.setAttribute("id", linkId);
        link.className = "linkText";

        if(typeof text === "string") {
            link.innerText = text;
        }
        if(typeof onClickFn === "function") {
            link.setAttribute("data-enabled", true);
            link.onclick = function() {
                onClickFn();
            };
        } else {
            link.setAttribute("data-enabled", false);
        }
        parent.appendChild(link);
        return link;
    }

    /**
     * Creates a container for the tabs contents.
     * @memberOf TabsControl
     * @private
     * @param  {String} containerId The desired ID for the TabContents container.
     * @param  {Object} parent      The DOM Element that should be the parent of each TabContent.
     * @return {Object}             The new DOM Element for the content container.
     */
    function createContentContainer(containerId, parent) {
        var container = document.createElement("div");
        container.setAttribute("id", containerId);
        container.className = "contentContainer";
        parent.appendChild(container);
        return container;
    }

    /**
     * Initializes the TabsControl.
     * @constructs TabsControl#
     * @private
     * @return {Object} The TabsControl.
     */
    function init() {
        tabsControlContainer = document.createElement("div");
        tabsControlContainer.setAttribute("id", id);
        tabsControlContainer.className = "tabsControlContainer";
        tabsControlParent.appendChild(tabsControlContainer);
     
        var tabBar = document.createElement("div");
        tabBar.className = "tabBar";
        tabsControlContainer.appendChild(tabBar);

        tabList = createTabList(tabListId, tabBar);

        if(Array.isArray(linkObjs) === true) {
            var linkList = document.createElement("div");
            linkList.className = "linkList";
            tabBar.appendChild(linkList);

            linkObjs.forEach(function(linkObj) {
                createLink(linkObj.id, linkList, linkObj.displayText, linkObj.onClickFn);
            });               
        }
        contentContainer = createContentContainer(contentContainerId, tabsControlContainer);
    }

    init();
};

/**
 * Selects the specified tab and deselects any other selected tabs.
 * @memberOf TabsControl
 * @public
 * @param  {String}      tabButtonId The ID of the TabButton to be selected.
 * @return {TabsControl}             The TabsControl.
 */
TabsControl.prototype.selectTab = function(tabButtonId) {
    var tabsArr = this.getTabs(),
        curTab;
    for(var i=0, len=tabsArr.length; i<len; i++) {
        curTab = tabsArr[i];
        curTab.setSelected(curTab.getButton().getElement().getAttribute("id") === tabButtonId);
    }
    return this;
};

/**
 * Select a tab from the TabsControl by its index in the tab list.
 * @memberOf TabsControl
 * @public
 * @param  {Number} index Integer value for the index of the tab to be selected.
 */
TabsControl.prototype.selectTabByIndex = function(index) {
    var tabsArr = this.getTabs(),
        curTab;
    for(var i=0, len=tabsArr.length; i<len; i++) {
        curTab = tabsArr[i];
        curTab.setSelected(index === i);
    }
};

/**
 * Remove a tab from the TabsControl by its index in the tab list.
 * @memberOf TabsControl
 * @public
 * @param  {Number} index Integer value for the index of the tab to be removed.
 */
TabsControl.prototype.removeTabByIndex = function(index) {
    if(index >= 0 && index < this.getTabs().length) {
        this.getTabs()[index].remove();
        this.getTabs().splice(index,1);
    } else {
        throw new Error(errorMessages.invalidParameter);
    }
};

/**
 * Remove all tabs from the TabsControl and then remove the tab container.
 * @memberOf TabsControl
 * @public
 */
TabsControl.prototype.remove = function() {
    function removeElement(elem) {
        elem.parentElement.removeChild(elem);
    }
    var tabs = this.getTabs();
    for(var i=0, len=tabs.length; i<len; i++) {
        tabs[i].remove();
    }
    this.clearTabs();
    removeElement(this.getControlContainer());
};
