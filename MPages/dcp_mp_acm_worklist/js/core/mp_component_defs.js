/**
 * Project: mp_component_defs
 * Version 1.0.0
 * Released 7/6/2010
 * @author Greg Howdeshell
 */

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function (parent) {
    var d = {}, p = (this.prototype = new parent());
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }        
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});

function MPageComponent(){
	this.m_componentId = 0.0;
	this.m_reportId = 0;
	this.m_label = "";
	this.m_column = 0;
	this.m_sequence = 0;
	this.m_link = "";
	this.m_totalResults = false;
	this.m_xOFy = false;
	this.m_isExpanded = false;
	this.m_isAlwaysExpanded = false;
	this.m_scrollNumber = 0;
	this.m_isScrollEnabled = false;
	this.m_styles = null;
	this.m_groups = null;
	this.m_pageGroupSeq = 0;
	this.m_lookbackDays = 0;
	this.m_newLink = false;
	this.criterion = null;
	this.m_isPlusAdd = false;
	this.m_scope = 0;  //1=person,2=encounter
	this.m_rootComponentNode = null;
	this.m_sectionContentNode = null;
	this.m_compLoadTimerName = "";
	this.m_compRenderTimerName = "";
	this.m_includeLineNumber = false;
	this.m_lookbackUnitTypeFlag = 0; // 1 = hours,2=Days,3=Weeks,4= Months,5= Years
	this.m_lookbackUnits = 0;
	this.m_dateFormat = 2; //1 = date only,2= date/time and 3 = elapsed time
	this.m_isCustomizeView = false;
	this.m_menuItems = null;
	this.m_displayFilters = null;
	this.m_AutoSuggestScript = "";
	this.m_AutoSuggestAddTimerName = "";
	
	MPageComponent.method("isDisplayable", function(){
		if (this.m_displayFilters != null && this.m_displayFilters.length > 0) {
			for (var x = this.m_displayFilters.length; x--;) {
				var displayFilter = this.m_displayFilters[x];
				if (displayFilter.checkFilters() == false) {
					CERN_EventListener.removeAllListeners(this, this);
					return false;
				}
			}
		}
		return true;
	});
	
	MPageComponent.method("getDisplayFilters", function(){return this.m_displayFilters;})
	MPageComponent.method("setDisplayFilters", function(value){this.m_displayFilters = value;})
	MPageComponent.method("addDisplayFilter", function(value){
		if (this.m_displayFilters == null){
			this.m_displayFilters = new Array();
		}
		this.m_displayFilters.push(value);
	})


	MPageComponent.method("getMenuItems", function(){return this.m_menuItems;})
	MPageComponent.method("setMenuItems", function(value){this.m_menuItems = value;})
	MPageComponent.method("addMenuItem", function(value){
		if (this.m_menuItems == null){
			this.m_menuItems = new Array();
		}
		this.m_menuItems.push(value);
	})


	MPageComponent.method("getCustomizeView", function(){return this.m_isCustomizeView;})
	MPageComponent.method("setCustomizeView", function(value){this.m_isCustomizeView = value;})
	
	MPageComponent.method("InsertData", function(){
		alert("ERROR: InsertData has not been implemented within the component");
	});
	MPageComponent.method("HandleSuccess", function(){
		alert("ERROR: HandleSuccess has not been implemented within the component");
	});
	MPageComponent.method("openTab", function(){
		alert("ERROR: openTab has not been implemented within the component");
	});
	
	MPageComponent.method("getComponentLoadTimerName", function(){return (this.m_compLoadTimerName);});
	MPageComponent.method("setComponentLoadTimerName", function(value){this.m_compLoadTimerName = value;});
	MPageComponent.method("getComponentRenderTimerName", function(){return (this.m_compRenderTimerName);});
	MPageComponent.method("setComponentRenderTimerName", function(value){this.m_compRenderTimerName = value;});
	MPageComponent.method("getRootComponentNode", function(){
		if (this.m_rootComponentNode == null){
			var style = this.getStyles();
			this.m_rootComponentNode = _g(style.getId());
		}
		return (this.m_rootComponentNode);
	});
	MPageComponent.method("setRootComponentNode", function(value){this.m_rootComponentNode = value;});
	MPageComponent.method("getSectionContentNode", function(){
		if (this.m_sectionContentNode == null){
			var style = this.getStyles();
			this.m_sectionContentNode = _g(style.getContentId());
		}
		return (this.m_sectionContentNode);
	});
	MPageComponent.method("setSectionContentNode", function(value){this.m_sectionContentNode = value;});
	MPageComponent.method("getMPageName", function() {return (this.m_MPageName);});
	MPageComponent.method("setMPageName", function(value) {this.m_MPageName = value;});
	
	MPageComponent.method("getScope", function(){
		return (this.m_scope);
	});
	MPageComponent.method("setScope", function(value){
		this.m_scope = value;
	});
	MPageComponent.method("isPlusAddEnabled", function(){
		return (this.m_isPlusAdd);
	});
	MPageComponent.method("setPlusAddEnabled", function(value){
		this.m_isPlusAdd = value;
	});

	/**
	 * For each compoent a criterion is defined for usage.  This criterion contains information such
	 * as the person, encounter, personnel, etc.
	 * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
	 */
	MPageComponent.method("getCriterion", function(){
		return (this.criterion);
	});
	/**
	 * Sets the criterion
	 * @param {Criterion} value The Criterion object in which to initialize the component with.
	 */
	MPageComponent.method("setCriterion", function(value){
		this.criterion = value;
	});
	/**
	 * 
	 */
	MPageComponent.method("isNewLink", function(){
		return (this.m_newLink);
	});
	MPageComponent.method("setNewLink", function(value){
		this.m_newLink = value;
	});	
	MPageComponent.method("getPageGroupSequence", function(){
		return (this.m_pageGroupSeq);
	});
	MPageComponent.method("setPageGroupSequence", function(value){
		this.m_pageGroupSeq = value;
	});	
	MPageComponent.method("getLookbackDays", function(){
		return (this.m_lookbackDays);
	});
	MPageComponent.method("setLookbackDays", function(value){
		this.m_lookbackDays = value;
	});	

	MPageComponent.method("getComponentId", function(){
		return (this.m_componentId);
	});
	MPageComponent.method("setComponentId", function(value){
		this.m_componentId = value;
		var styles = this.getStyles();
		if (styles != null)
			styles.setComponentId(value);
	});	
	MPageComponent.method("getReportId", function(){
		return (this.m_reportId);
	});
	MPageComponent.method("setReportId", function(value){
		this.m_reportId = value;
	});	
	MPageComponent.method("getLabel", function(){
		return (this.m_label);
	});
	MPageComponent.method("setLabel", function(value){
		this.m_label = value;
	});
	MPageComponent.method("getColumn", function(){
		return (this.m_column);
	});
	MPageComponent.method("setColumn", function(value){
		this.m_column = value;
	});
	MPageComponent.method("getSequence", function(){
		return (this.m_sequence);
	});
	MPageComponent.method("setSequence", function(value){
		this.m_sequence = value;
	});
	MPageComponent.method("getLink", function(){
		return (this.m_link);
	});
	MPageComponent.method("setLink", function(value){
		this.m_link = value;
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */
	MPageComponent.method("isResultsDisplayEnabled", function(){
		return (this.m_totalResults);
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */	
	MPageComponent.method("setResultsDisplayEnabled", function(value){
		this.m_totalResults = value;
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */	
	MPageComponent.method("isXofYEnabled", function(){
		return (this.m_xOFy);
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */	
	MPageComponent.method("setXofYEnabled", function(value){
		this.m_xOFy = value;
	});
	MPageComponent.method("isExpanded", function(){
		return (this.m_isExpanded);
	});
	MPageComponent.method("setExpanded", function(value){
		this.m_isExpanded = value;
	});
	MPageComponent.method("isAlwaysExpanded", function(){
		return (this.m_isAlwaysExpanded);
	});
	MPageComponent.method("setAlwaysExpanded", function(value){
		this.m_isAlwaysExpanded = value;
	});
	MPageComponent.method("getScrollNumber", function(){
		return (this.m_scrollNumber);
	});
	MPageComponent.method("setScrollNumber", function(value){
		this.m_scrollNumber = value;
	});
	MPageComponent.method("isScrollingEnabled", function(){
		return (this.m_isScrollEnabled);
	});
	MPageComponent.method("setScrollingEnabled", function(value){
		this.m_isScrollEnabled = value;
	});
	MPageComponent.method("getStyles", function(){
		return (this.m_styles);
	});
	MPageComponent.method("setStyles", function(value){
		this.m_styles = value;
	});
	MPageComponent.method("getFilters", function(){
		return (this.m_filters);
	});
	MPageComponent.method("getGroups", function(){
		if (this.m_groups == null)
			this.m_groups = [];
		return (this.m_groups);
	});
	MPageComponent.method("setGroups", function(value){
		this.m_groups = value;
	});
	MPageComponent.method("addGroup", function(value){
		if (this.m_groups == null){
			this.m_groups = new Array();
		}
		this.m_groups.push(value);
	});

	MPageComponent.method("getLookbackUnitTypeFlag", function(){
		return (this.m_lookbackUnitTypeFlag);
	});
	MPageComponent.method("setLookbackUnitTypeFlag", function(value){
		this.m_lookbackUnitTypeFlag = value;
	});
	MPageComponent.method("getLookbackUnits", function(){
		return (this.m_lookbackUnits);
	});
	MPageComponent.method("setLookbackUnits", function(value){
		this.m_lookbackUnits = value;
	});

	/**
	 * Return true if the component has been defined as including the line number within the 
	 * title text of the component.
	 */
	MPageComponent.method("isLineNumberIncluded", function(){
		return this.m_includeLineNumber;
	});
	/**
	 * Allows each component to define, based on requirements, whether or not to display the number of
	 * line items within the title text of the component.
	 * @param {Boolean} value If true, the line number associated to the component will display within the
	 * title text of the component.  Else, the line number will not display within the title text of the
	 * component.
	 */
	MPageComponent.method("setIncludeLineNumber", function(value){
		this.m_includeLineNumber = value;
	});
	MPageComponent.method("getDateFormat", function(){
	return (this.m_dateFormat); //1 = date only,2= date/time and 3 = elapsed time
	});
	MPageComponent.method("setDateFormat", function(value){
		this.m_dateFormat = value;
	});	
	MPageComponent.method("setAutoSuggestAddScript", function(value){
		this.m_AutoSuggestScript = value;
	});	
	MPageComponent.method("getAutoSuggestAddScript", function(){
		return (this.m_AutoSuggestScript); 
	});
	MPageComponent.method("setAutoSuggestAddTimerName", function(value){
		this.m_AutoSuggestAddTimerName = value;
	});	
	MPageComponent.method("getAutoSuggestAddTimerName", function(){
		return (this.m_AutoSuggestAddTimerName); 
	});


}

/*
 * The MPage grouper provides a means in which to group MPageGroups together into an
 * array for results such as Blood Pressure where each group is a sequence of events.
 */
function MPageGrouper()
{
	this.m_groups = null;
	MPageGrouper.method("setGroups", function(value){
		this.m_groups = value;
	});
	MPageGrouper.method("getGroups", function(){
		return this.m_groups;
	});
	MPageGrouper.method("addGroup", function(value){
		if (this.m_groups == null)
			this.m_groups = new Array();
		this.m_groups.push(value);
	});
}
MPageGrouper.inherits(MPageGroup);

function MPageGroup()
{
	this.m_groupName = "";
	this.m_groupSeq = 0;
	this.m_groupId = 0;
	MPageGroup.method("setGroupId", function(value){
		this.m_groupId = value;
	});
	MPageGroup.method("getGroupId", function(){
		return this.m_groupId;
	});
	MPageGroup.method("setGroupName", function(value){
		this.m_groupName = value;
	});
	MPageGroup.method("getGroupName", function(){
		return this.m_groupName;
	});
	MPageGroup.method("setSequence", function(value){
		this.m_groupSeq = value;
	});
	MPageGroup.method("getSequence", function(){
		return this.m_groupSeq;
	});
}

function MPageEventSetGroup()
{
	this.m_eventSets = null;
	this.m_isSequenced = false;
	MPageEventSetGroup.method("isSequenced", function(){
		return this.m_isSequenced;
	});
	MPageEventSetGroup.method("setSequenced", function(value){
		this.m_isSequenced = value;
	});	
	MPageEventSetGroup.method("getEventSets", function(){
		return this.m_eventSets;
	});
	MPageEventSetGroup.method("setEventSets", function(value){
		this.m_eventSets = value;
	});	
	MPageEventSetGroup.method("addEventSet", function(value){
		if (this.m_eventSets == null)
			this.m_eventSets = new Array();
		this.m_eventSets.push(value);
	});	
}
MPageEventSetGroup.inherits(MPageGroup);

function MPageEventCodeGroup()
{
	this.m_eventCodes = null;
	this.m_isSequenced = false;
	MPageEventCodeGroup.method("isSequenced", function(){
		return this.m_isSequenced;
	});
	MPageEventCodeGroup.method("setSequenced", function(value){
		this.m_isSequenced = value;
	});	
	MPageEventCodeGroup.method("getEventCodes", function(){
		return this.m_eventCodes;
	});
	MPageEventCodeGroup.method("setEventCodes", function(value){
		this.m_eventCodes = value;
	});	
	MPageEventCodeGroup.method("addEventCode", function(value){
		if (this.m_eventCodes == null)
			this.m_eventCodes = new Array();
		this.m_eventCodes.push(value);
	});	
}
MPageEventCodeGroup.inherits(MPageGroup);

function MPageCodeValueGroup()
{
	this.m_codes = null;
	MPageCodeValueGroup.method("getCodes", function(){
		return this.m_codes;
	});
	MPageCodeValueGroup.method("setCodes", function(value){
		this.m_codes = value;
	});	
	MPageCodeValueGroup.method("addCode", function(value){
		if (this.m_codes == null)
			this.m_codes = new Array();
		this.m_codes.push(value);
	});	
}
MPageCodeValueGroup.inherits(MPageGroup);

//The MPageSequenceGroup is a grouper of items such as filter means, event codes, event sets, etc.
function MPageSequenceGroup()
{
	this.m_items = null;
	this.m_mapItems = null;
	this.m_isMultiType = false;
	MPageSequenceGroup.method("getItems", function(){
		return this.m_items;
	});
	MPageSequenceGroup.method("setItems", function(value){
		this.m_items = value;
	});		
	MPageSequenceGroup.method("addItem", function(value){
		if (this.m_items == null)
			this.m_items = new Array();
		this.m_items.push(value);
	});
	MPageSequenceGroup.method("setMultiValue", function(value){
		this.m_isMultiType = value;
	});
	MPageSequenceGroup.method("isMultiValue", function(){
		return (this.m_isMultiType);
	});
	MPageSequenceGroup.method("getMapItems", function(){
		return this.m_mapItems;
	})
	MPageSequenceGroup.method("setMapItems", function(value){
		this.m_mapItems = value;
	})
}
MPageSequenceGroup.inherits(MPageGroup);

function MPageGroupValue()
{
	this.m_id = 0.0;
	this.m_name = "";
	
	MPageGroupValue.method("getId", function(){
		return this.m_id;
	})
	MPageGroupValue.method("setId", function(value){
		this.m_id = value;
	})
	MPageGroupValue.method("getName", function(){
		return this.m_name;
	})
	MPageGroupValue.method("setName", function(value){
		this.m_name = value;
	})
}

function ComponentStyle()
{
	this.m_nameSpace = "";
	this.m_id = "";
	this.m_className = "section";
	this.m_contentId = "";
	this.m_contentClass = "sec-content";
	this.m_headerClass = "sec-hd";
	this.m_headToggle = "sec-hd-tgl";
	this.m_secTitle = "sec-title";
	this.m_aLink ="";
	this.m_secTotal = "sec-total"
	this.m_info = "";
	
	// If a component may be on a page multiple time, a unique identifier such as the component id will need to be set on the style
	// The unique identifier is only utilized on styles that are placeholders to be replaced at a later point.
	this.m_componentId = 0;
	
	/**
	 * Initializes the component style with the provided namespace to utilize throughout the component.
	 * @param {Object} value
	 */
	ComponentStyle.method("initByNamespace", function(value){
		this.m_nameSpace = value;
		this.m_id = value;
		this.m_className += (" " + value + "-sec");
		this.m_contentId = value + "Content";
		this.m_aLink = value + "Link";
		this.m_info = value + "-info";
	});
	
	ComponentStyle.method("getNameSpace", function(){
		return this.m_nameSpace;
	})
	ComponentStyle.method("getId", function(){
		return this.m_id + this.m_componentId;
//		return this.m_id;
	});
	ComponentStyle.method("getClassName", function(){
		return this.m_className;
	});
	ComponentStyle.method("getContentId", function(){
		return this.m_contentId + this.m_componentId;
//		return this.m_contentId;
	});
	ComponentStyle.method("getContentClass", function(){
		return this.m_contentClass;
	});
	ComponentStyle.method("getHeaderClass", function(){
		return this.m_headerClass;
	});
	ComponentStyle.method("getHeaderToggle", function(){
		return this.m_headToggle;
	});
	ComponentStyle.method("getTitle", function(){
		return this.m_secTitle;
	});
	ComponentStyle.method("getLink", function(){
		return this.m_aLink;
	});
	ComponentStyle.method("getTotal", function(){
		return this.m_secTotal;
	});
	ComponentStyle.method("getInfo", function(){
		return this.m_info;
	});
	
	ComponentStyle.method("setComponentId", function(value){
		this.m_componentId = value;
	});
	ComponentStyle.method("setNameSpace", function(value){
		this.m_nameSpace = value;
	});
	ComponentStyle.method("setId", function(value){
		this.m_id = value;
	})
	ComponentStyle.method("setClassName", function(value){
		this.m_className = value;
	})
	ComponentStyle.method("setContextId", function(value){
		this.m_contentId = value;
	})
	ComponentStyle.method("setContextClass", function(value){
		this.m_contentClass = value;
	})
	ComponentStyle.method("setHeaderClass", function(value){
		this.m_headerClass = value;
	})
	ComponentStyle.method("setHeaderToggle", function(value){
		this.m_headToggle = value;
	})
	ComponentStyle.method("setTitle", function(value){
		this.m_secTitle = value;
	})
	ComponentStyle.method("setLink", function(value){
		this.m_aLink = value;
	})
	ComponentStyle.method("setTotal", function(value){
		this.m_secTotal = value;
	})
	ComponentStyle.method("setInfo", function(value){
		this.m_info = value;
	})
}

/**
 * The MPage object
 * 
 * @author Greg Howdeshell
 */
function MPage(){
	this.pageId = 0.0;
	this.name = null;
	this.components = null;
	this.banner = true;
	this.helpFileName = "";
	this.helpFileURL = ""
	this.criterion = null;
	this.componentIds = null;
	this.isCustomizeView = false;
	this.m_isCustomizeEnabled = true;
	this.m_titleAnchors = null;

	MPage.method("getTitleAnchors", function(){return this.m_titleAnchors;})
	MPage.method("setTitleAnchors", function(value){this.m_titleAnchors = value;})
	MPage.method("addTitleAnchor", function(value){
		if (this.m_titleAnchors == null){
			this.m_titleAnchors = new Array();
		}
		this.m_titleAnchors.push(value);
	})
	MPage.method("getCustomizeEnabled", function(){return this.m_isCustomizeEnabled;})
	MPage.method("setCustomizeEnabled", function(value){this.m_isCustomizeEnabled = value;})

	MPage.method("getCustomizeView", function(){return this.isCustomizeView;})
	MPage.method("setCustomizeView", function(value){this.isCustomizeView = value;})

	MPage.method("getComponentIds", function(){
		return (this.componentIds);
	});
	MPage.method("setComponentIds", function(value){
		this.componentIds = value;
	});
	MPage.method("addComponentId", function(value){
		if (this.componentIds == null)
			this.componentIds = [];
		this.componentIds.push(value);
	});
	

	/**
	 * The criterion contains information such as the person, encounter, personnel, etc.
	 * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
	 */
	MPage.method("getCriterion", function(){
		return (this.criterion);
	});
	/**
	 * Sets the criterion
	 * @param {Criterion} value The Criterion object in which to initialize the MPage with.
	 */
	MPage.method("setCriterion", function(value){
		this.criterion = value;
	});
	
	/**
	 * Return the help file name that is to be loaded when the help file icon is clicked.
	 */
	MPage.method("getHelpFileName", function(){return this.helpFileName;})
	/**
	 * Sets the help file name that is to be loaded when the help file icon is clicked.
	 * @param {String} value The name of the help file to be loaded when the help icon is clicked. 
	 */
	MPage.method("setHelpFileName", function(value){this.helpFileName = value;})
	/**
	 * Return the help file name that is to be loaded when the help file icon is clicked.
	 */
	MPage.method("getHelpFileURL", function(){return this.helpFileURL;})
	/**
	 * Sets the help file name that is to be loaded when the help file icon is clicked.
	 * @param {String} value The name of the help file to be loaded when the help icon is clicked. 
	 */
	MPage.method("setHelpFileURL", function(value){this.helpFileURL = value;})
	/**
	 * Returns TRUE if the patient demographic banner is to be displayed within the MPage.  False otherwise.
	 */
	MPage.method("isBannerEnabled", function(){
		return this.banner;
	});
	/**
	 * Sets whether or not to display the patient demographic banner
	 * @param {Boolean} value The boolean value in which to note to display or not display the patient demographic banner.
	 */
	MPage.method("setBannerEnabled", function(value){
		this.banner = value;
	});
	
	/** Gets the primary key associated to the mpage */
	MPage.method("getPageId", function(){
		return this.pageId;
	})
	/**
	 * Sets the primary key associated to the mpage
	 * @param {Long} value the primary key to be associated to the mpage
	 */
	MPage.method("setPageId", function(value){
		this.pageId = value;
	});
	/** gets the name associated to the mpage */
	MPage.method("getName", function(){
		return this.name;
	})
	/**
	 * Sets the namme associated to the mpage
	 * @param {String} value the name to be assoicated to the mpage
	 */
	MPage.method("setName", function(value){
		this.name = value;
	});
	/** returns the components associated to the mpage */
	MPage.method('getComponents', function(){
		return this.components;
	});
	/**
	 * Sets the list of component objects to the mpage
	 * @param {Array} value The list of component objects to the MPage
	 */
	MPage.method('setComponents', function(value){
		this.components = value;
	});
	/**
	 * Adds a component to the existing MPage
	 * @param {MPageComponent} value The MPageComponent to add to the Mpage
	 */
	MPage.method('addComponent', function(value){
		if (this.components == null)
		{
			this.components = new Array();
		}
		this.components.push(value);
	});
}

/**
 * Sorts the MPage Components by group sequence, then by column, and lastly by row.
 * @param {MPageComponent} c1 Component one to compare against
 * @param {MPageComponent} c2 Component two to compare against
 * @return {Short} Returns the sequence in which the components should display.
 * 
 * @author Greg Howdeshell
 */
function SortMPageComponents(c1, c2)
{
	if (c1.getPageGroupSequence() < c2.getPageGroupSequence()) {return -1}
	if (c1.getPageGroupSequence() > c2.getPageGroupSequence()) {return 1}
	return SortMPageComponentCols(c1, c2);
}

function SortMPageComponentCols(c1,c2)
{
	if (c1.getColumn() < c2.getColumn()) {return -1}
	if (c1.getColumn() > c2.getColumn()) {return 1}
	return SortMPageComponentRows(c1, c2);
}

function SortMPageComponentRows(c1, c2)
{
	if (c1.getSequence() < c2.getSequence()) {return -1}
	if (c1.getSequence() > c2.getSequence()) {return 1}
	return 0;
}