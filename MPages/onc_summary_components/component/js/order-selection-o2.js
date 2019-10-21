function OrderSelectionComponentO2Style(){
    this.initByNamespace("ordsel-o2");
}

OrderSelectionComponentO2Style.prototype = new ComponentStyle();
OrderSelectionComponentO2Style.prototype.constructor = ComponentStyle;

/**
 * The Order Selection option 2 (OS-o2) component will allow a user to add multiple orders to the Pending Orders Scratchpad
 *   or the New Order Entry Option 1 Scratchpad if the MPage is not in a viewpoint.  The OS-o2 component will allow display
 *   Caresets, PowerPlans or individual orders only.
 *
 * @param {Criterion} criterion - the object that is used to build out the component
 * @returns {undefined} undefined
 */
function OrderSelectionComponentO2(criterion){
	this.m_FolderIds = null;
	this.m_ActiveDiv = null;
	this.m_ActiveScratchPad = null;
	this.m_modalScratchPadEnabled = false;
	this.m_saveOnExpandEnabled = null;
	this.m_subsectionDefaultExpanded = null;
	this.m_isPersonalFavorite = false;
	this.m_venueValue = 1; //default to inpatient
	
	this.setCriterion(criterion);
	this.os2i18n = i18n.discernabu.orderselection_o2;
	this.setStyles(new OrderSelectionComponentO2Style());
	this.setComponentLoadTimerName("USR:MPG.ORDERSELECTION.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ORDERSELECTION.O2 - render component");
	this.ordselo2PrefObj = {
		subFolderExpanded: {},
		//used only for personal favorite folders
		compLabel: "",
		compFolderId: ""
	};
	
	// Keep track of html and component tables in both venues 
	// Declare venueCache as an array
	this.venueCache = [];
	this.m_wasListenerAdded = false;
	// Ensure that all orders are deselected from both venues after order has been completed
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
OrderSelectionComponentO2.prototype = new MPageComponent();
OrderSelectionComponentO2.prototype.constructor = MPageComponent;

/**
 * Sets the m_wasListenerAdded member variable to the value provided.
 * @param {Boolean} value : true or false value to indicate if the event listener has been added. 
 * @returns {undefined} - undefined
 */
OrderSelectionComponentO2.prototype.setWasListenerAdded = function(value){
	this.m_wasListenerAdded = value;
};

/**
 * Gets the m_wasListenerAdded member variable value.
 * @returns {Boolean} - the wasListenerAdded flag
 */
OrderSelectionComponentO2.prototype.getWasListenerAdded = function(){
	return this.m_wasListenerAdded;
};

/**
 * built in scratchpad.  
 * 
 * @param {Integer} value - the value of the venue to be est
 * @returns {undefined} - undefined
 */	
OrderSelectionComponentO2.prototype.setVenue= function(value){
	this.m_venueValue = value;
};
/**
 * Retrieve the value of isPersonalFavorite
 * @returns {number} - the value of isPersonalFavorite
 */		
OrderSelectionComponentO2.prototype.getVenue = function(){
    return this.m_venueValue;
};


/**
 * Set the targeted favorite folder id (alt_sel_cat_id) set in bedrock.   
 *
 * @param {Array} value : Array of folder_ids.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.setFavFolderId = function(value){
    if (this.m_FolderIds === null) {
        this.m_FolderIds = [];
    }
    this.m_FolderIds.push(value);
};
/**
 * Get the targeted favorite folder id (alt_sel_cat_id) set in bedrock.
 * @return {array} - and array of folderIds
 */
OrderSelectionComponentO2.prototype.getFavFolderId =  function(){
    return this.m_FolderIds;
};
/**
 * Reset the component. Called when the all selections should be cleared.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.clearSelections = function(){
    this.dSelectAll(this);
};	
/**
 * Legacy method cache the current page level div (view).   
 *  
 * @param {Object} value : The current active div with class div-tab-item-selected.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.setActiveDiv = function(value){
    this.m_ActiveDiv = value;
};
/**
 * Legacy method to retrieve the current page level div (view).
 * @returns {object} activeDiv
 */
OrderSelectionComponentO2.prototype.getActiveDiv = function(){
    return this.m_ActiveDiv;
};
/**
 * Cache the New Order Entry - Option 1's scratchpad.
 * Use when the order selection component is to interact with the New Order Entry - Option 1's 
 * built in scratchpad.  
 * 
 * @param {Object} value : The scratchpad container attached to the noe-o1 component with class noe-scratch.
 * @returns {undefined} undefined
 */	
OrderSelectionComponentO2.prototype.setActiveScratchPad = function(value){
	this.m_ActiveScratchPad = value;
};
/**
 * Retrieve the value of isPersonalFavorite
 * @returns {undefined} undefined
 */		
OrderSelectionComponentO2.prototype.getIsPersonalFavorite = function(){
    return this.m_isPersonalFavorite;
};
/**
 * Sets if the component is a dynamically generated personal favorite folder
 *
 * @param {boolean} value : 1 - is a personal favorite folder, 0 otherwise
 */		
 
OrderSelectionComponentO2.prototype.setIsPersonalFavorite = function(value){
    this.m_isPersonalFavorite = (value === 1 ? true : false);
};

/**
 * Retrieve the New Order Entry - Option 1's scratchpad.
 * Use when the order selection component is to interact with the New Order Entry - Option 1's 
 * built in scratchpad.
 * @returns {object} activeScratchPad
 */		
OrderSelectionComponentO2.prototype.getActiveScratchPad = function(){
    return this.m_ActiveScratchPad;
};
/**
 * Set if the use of the modal scratch pad is needed.  Usually if the component is being used in a ViewPoint. 
 *
 * @param {boolean} value : 1 - Modal Scratchpad is being used. 0 - Use New Order Entry Option 1 Scratchpad.
 */		
 
OrderSelectionComponentO2.prototype.setModalScratchPadEnabled = function(value){
    this.m_modalScratchPadEnabled = (value === 1 ? true : false);
};

/**
 * Return if the Modal ScratchPad is being used.
 * @returns {boolean} m_modalScratchPadEnabled
 */	
OrderSelectionComponentO2.prototype.isModalScratchPadEnabled = function(){
    return this.m_modalScratchPadEnabled;
};

/*
 * Set if the subsection expand settings will be saved upon expand or collapse of subsection at a user level
 * 
 * @param {boolean} value : true - User-level preferences for subsection expansion will be saved during session.  false- user-preferences will not be saved
 */
OrderSelectionComponentO2.prototype.setSaveOnExpandEnabled = function(value){
	this.m_saveOnExpandEnabled = (value? true : false);
};

/*
 * Return if subsections expand settings will be saved based on user expand/collapse actions 
 */
OrderSelectionComponentO2.prototype.isSaveOnExpandEnabled = function(){
	return this.m_saveOnExpandEnabled;
};

/*
 * Set if folder subsections are expanded by default
 * 
 * @param {boolean} value: true - Folder subsections will be expanded by default. false - folder subsections will be contracted by default
 */
OrderSelectionComponentO2.prototype.setSubsectionDefaultExpanded = function(value){
	this.m_subsectionDefaultExpanded = (value? true : false);
};

/*
 * Return if folder subsections are expanded by default
 */
OrderSelectionComponentO2.prototype.isSubsectionDefaultExpanded = function(){
	return this.m_subsectionDefaultExpanded;
};

/**
 * Used to remove an item from the Order Selection component if requested from the Modal Scratchpad. 
 *
 * @param {Object} event : Dom Event triggered to remove an item.
 * @param {Object} removeObject : Object to remove.
 * @returns {undefined} undefined
 * 
 */	
OrderSelectionComponentO2.prototype.removeFavorite = function(event, removeObject){
    this.SPModalDialogRemovesFavorite(this, event, removeObject);
};

/**
 * Retrieve the components preferences.
 * @returns {object} Preference Object.
 */
OrderSelectionComponentO2.prototype.getPreferencesObj = function() {
	return MPageComponent.prototype.getPreferencesObj.call(this, null);
};

/**
 * Custom component method
 * sets the filter mapping object
 * moved from bedrock.js
 * @returns {Object} the filter mappings object
 */
OrderSelectionComponentO2.prototype.getFilterMappingsObj = function(){
	var reportMean = this.getReportMean().toUpperCase();
	var compNum=/[0-9]+$/.exec(reportMean);
	this.addFilterMappingObject("ORD_SEL_ORD_FOLDER_"+compNum, {type: "ARRAY", field: "PARENT_ENTITY_ID", setFunction: this.setFavFolderId});
	this.addFilterMappingObject("ORD_SEL_SUBSEC_DEFAULT_"+compNum, {type: "BOOLEAN", field: "FREETEXT_DESC", setFunction: this.setSubsectionDefaultExpanded});
	return this.m_filterMappingsObj;
};

OrderSelectionComponentO2.prototype.loadMappedSettings = function(mappedFilter, compFilter) {
		MPageComponent.prototype.loadMappedSettings.call(this, mappedFilter, compFilter);
};

OrderSelectionComponentO2.prototype.preProcessing = function(){
	var compMenu = this.getMenu();
	var compID = this.getComponentId();
	var style = this.getStyles();
	var savedUserPrefs = null;
	
	//Call the base class implementation for future support
	MPageComponent.prototype.preProcessing.call(this); 
	
	//Check to see if the component is within a viewpoint or a stand alone MPage
	var viewpointIndicator = (typeof m_viewpointJSON == "undefined") ? false : true;
	if(viewpointIndicator) {
		this.setModalScratchPadEnabled(1);
	}
	if (compMenu && this.getIsPersonalFavorite()) {
		var compMenuRemove = new MenuSelection("compMenuRemove" + compID);
		compMenuRemove.setLabel(this.os2i18n.REMOVE_FAVORITE);
		compMenuRemove.setIsDisabled(false);
		compMenu.addMenuItem(compMenuRemove);
		var returnFav = function(comp){
			return function(clickEvent){
				clickEvent.id = "mnuRemove" + compID;
				call(comp.removeFolder);
			};
		};
		compMenuRemove.setClickFunction(returnFav(this));
		MP_MenuManager.updateMenuObject(compMenu);
		//set preferences object from user preferences
	}
	//set auxillary preferences object from formal user preferences
	savedUserPrefs = this.getPreferencesObj();
	if (savedUserPrefs){
		this.ordselo2PrefObj = savedUserPrefs;
	}
	
};

/**
 * Add Cell Click's to the component table.
 * The cell click action will be routed depending on if the Modal Scratchpad is enabled.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.addCellClickExtension = function(){
    var component = this;
    var cellClickExtension = new TableCellClickCallbackExtension();
    
    cellClickExtension.setCellClickCallback(function(event, data){
        //timer should be created and used here
         var cellSelectionTimer = MP_Util.CreateTimer("CAP:MPG:ORDERSELECTION.O2_Cell_Click");
         if (cellSelectionTimer){
         	cellSelectionTimer.Start();
         	cellSelectionTimer.Stop();
         }
        
        if (component.isModalScratchPadEnabled()) {
            component.addItemToPendingOrdersSP(event, data);
        }
        else {
            component.addItemToNOESP(event, data);
            var noeScratchPadContainer = Util.Style.g('noe-scratch', component.getActiveDiv())[0];
        }
    });
    orderSelectionTable.addExtension(cellClickExtension);
};

/**
 * Adds a menu option to the main component menu to remove this component from the MPageView.  Used for personal favorite folders.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.addRemoveMenuOption = function(){
	
	var getRemoveClick = function(comp){
        return function(event){
			comp.removeFolder();
        };
    };	
	this.addMenuOption("mnuRemove", "mnuRemove" + this.getComponentId(), this.os2i18n.REMOVE_FAVORITE, false, "click", getRemoveClick(this));
	this.createMenu();
};





OrderSelectionComponentO2.prototype.changeViewVenue = function(event, venue) {
	var activeView = MP_Viewpoint.getActiveViewId();
	var ordselId = "ordsel-o2" + this.getComponentId();
	//Ensure that the order-selection component is on the active view
	var component = $('#' + activeView).find('#' + ordselId);
	if (component.length > 0) {
		var node = this.getSectionContentNode();
		var nodeHtml = $(node).html();
		var currVenue = this.getVenue();
		// Convert from 3 (from ambulatory -in office) to 1 for consistency 
		if (currVenue === 3) {
			currVenue = 1;
		}
		// Cache the latest html to ensure that orderable selections are saved
		// only if current page has been rendered at least once (cached object created)
		if (this.venueCache[currVenue]) {
			this.venueCache[currVenue].html = nodeHtml;
			this.venueCache[currVenue].comp_table = this.getComponentTable();
		}// check for cached html for new venue

		var pageLevelVenue = venue.VALUE;
		if (pageLevelVenue === 3) {
			pageLevelVenue = 1;
		}
		this.setVenue(pageLevelVenue);
		var cachedHtml = this.venueCache[pageLevelVenue];
		if (cachedHtml) {
			var cachedInnerHtml = cachedHtml.html;
			var cachedTable = cachedHtml.comp_table;

			// Use cached copy if exists
			if (cachedInnerHtml) {
				$(node).html(cachedInnerHtml);
				if (cachedTable) {
					this.setComponentTable(cachedTable);
					cachedTable.finalize();
				}
			}
		}
		// Retrieve component Data and rerender component with updated venue value if not cached
		else {
			$(node).html("<div class='ordsel-o2-preloader-icon'></div>");
			this.retrieveComponentData();
		}
	}
};


	


/**
 * Remove this folder from the DOM and update both the user preferences and the ViewQOCLayout object's personal folder count
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.removeFolder = function(){
	var i18nCore = i18n.discernabu;
	var removeFun = function(comp){
		return function(){$("#" + comp.getStyles().getId()).remove();
		$("#moreOptMenu" + comp.getComponentId()).remove();
		CERN_EventListener.fireEvent(comp, comp, EventListener.EVENT_REMOVE_PERSONAL_FAV_FOLDER, comp);
		MP_Core.AppUserPreferenceManager.SavePreferences(false);
		};
	};
	MP_Util.AlertConfirm(this.os2i18n.REMOVE_FAV_DIALOG, this.os2i18n.REMOVE_PERSONAL_FAV_COMP, this.os2i18n.CONFIRM_REMOVE, i18nCore.CONFIRM_CANCEL, true, removeFun(this));
	
};

/**
 * Add an item to the Pending Orders Scratchpad.
 * 		1. Add a CSS class to the Order Selection component to indicate the row is selected.
 *		2. Construct the scratchpadObj and push it to the Modal Scratchpad.
 *      3. Update the pending data shared resource.  If one or more items are selected this component is "dirty" and needs to be flagged.
 * Remove an item from the Pending Orders Scratchpad.
 * 		1. Remove a CSS class from the Order Selection component to indicate the row is NOT selected.
 *		2. Construct the scratchpadObj and indicated it needs to be removed from the Modal Scratchpad.
 *      3. Update the pending data shared resource.  If one or more items are selected this component is "dirty" and needs to be flagged.
 * @param {Object} event : Triggered click event.
 * @param {Object} data : data object bound to the component table cell.
 * @returns {undefined} undefined
 *      
 */
OrderSelectionComponentO2.prototype.addItemToPendingOrdersSP = function(event, data){
    
    //create scratchpad object
    var component = this;
    var componentId = component.getComponentId();
    var element = $(event.target).closest("dd.ordsel-o2-info")[0];
    var orderRecord = data.RESULT_DATA;
    var favType = orderRecord.FAV_TYPE;
    var favSynId = (favType === 2) ? orderRecord.PATH_CAT_ID : orderRecord.SYN_ID;
    var favSentId = (favType === 2) ? orderRecord.PW_CAT_SYN_ID : orderRecord.SENT_ID;
    
    /* Set venueType based on page-level venue
        For 'All' venue type, set venueType to 1 if RX_INDICATOR is set to 1
        For Inpatient/Ambulatory-In-office venue, set venueType to 0
        For Rx venue, set venueType to 1
    */
    var venueType = 0;
    switch(this.getVenue()){
        case 0:
            venueType = orderRecord.RX_INDICATOR;
            break;
        case 1:
            venueType = 0;
            break;
        case 2:
            venueType = 1;
            break;
    }

    var favParam = favSynId + ".0|" + venueType + "|" + favSentId + ".0";
    var favPPEvent = null;
    var favPPEventType = null;
    var scratchpadObj = {};
    scratchpadObj.componentId = componentId;
    scratchpadObj.addedFrom = "OrderSelection"; //Location where the favorite was added from
    scratchpadObj.favId = element.id; //used when removing items from the scratchpad. should be able to look inside the component and find this id
    scratchpadObj.favType = orderRecord.FAV_TYPE;
    //0: Orderable; 1: Careset; 2: PowerPlan
    scratchpadObj.favParam = favParam; //Orderable or Careset: Synonym Id + ".0|" + venueType + "|" + Sentence Id + ".0";  venueType: Inpatient=0, Discharge=1
    //PowerPlan: PATH_CAT_ID + ".0|" + PATH_CAT_SYN_ID + ".0"
    scratchpadObj.favSynId = null;
    scratchpadObj.favSentId = null;
    scratchpadObj.favOrdSet = 0;
    scratchpadObj.favVenueType = venueType;
    var params = favParam.split("|");
    if (favType === 2) {
        scratchpadObj.favSynId = params[0];
        scratchpadObj.favSentId = params[2];
        //Display name of orderable/Careset/PowerPlan
        scratchpadObj.favName = orderRecord.ITEM_DISP;
        //Displays customizable name of the powerplan
    	scratchpadObj.favOrderSentDisp = orderRecord.SENT_DISP;
        scratchpadObj.favPPEventType = 1;//all orders selection power plans are in the normal folder structure
    }
    else if (favType === 1) {
        scratchpadObj.favSynId = params[0];
        scratchpadObj.favSentId = params[2];
        scratchpadObj.favName = orderRecord.ITEM_DISP;
  	    //Display name of orderable/Careset/PowerPlan
   	    scratchpadObj.favOrderSentDisp = orderRecord.SENT_DISP;
   	    //Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
        scratchpadObj.favOrdSet = 6;
    }
    else {
        scratchpadObj.favSynId = params[0];
        scratchpadObj.favSentId = params[2];
        scratchpadObj.favName = orderRecord.ITEM_DISP;
        //Display name of orderable/Careset/PowerPlan
        scratchpadObj.favOrderSentDisp = orderRecord.SENT_DISP;
        //Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
        // Set the displayRxIcon flag to the Rx Indicator returned by the script
        scratchpadObj.displayRxIcon = orderRecord.RX_INDICATOR;
    }
    scratchpadObj.favNomenIds = '""';
    
    if (!Util.Style.ccss(element, "ordsel-o2-selected")) {
        Util.Style.acss(element, "ordsel-o2-selected");
        //Add item to scratchpad
        dataObj = component.addToOrRemoveFromScratchpadSR(scratchpadObj, false);
        component.checkPendingSR(componentId, 1);
    }
    else {
        //Remove Item from scratchpad
        dataObj = component.addToOrRemoveFromScratchpadSR(scratchpadObj, true);
        Util.Style.rcss(element, "ordsel-o2-selected");
        //check to see if component is still dirty after removing one scratchpad object
        if (dataObj) {
            var componentIsDirty = false;
            var scratchpadArr = dataObj.scratchpadObjArr;
            if (scratchpadArr) {
                var idx = scratchpadArr.length;
                while (idx--) {
                    if (scratchpadArr[idx].componentId == componentId) {
                        componentIsDirty = true;
                        break;
                    }
                }
            }
            
            if (!componentIsDirty) {
                component.checkPendingSR(componentId, 0);
            }
        }
    }
};


/**
 * Decrement count of Orders for Signature on New Order Entry scratchpad
 * @param {number} noeComponentId : The component ide of the new order entry component.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.decrementSPCount = function (noeComponentId) {	
        var scratchPadCountDiv = _g("noeScratchPadCount" + noeComponentId);
        if (scratchPadCountDiv) {
            var scratchPadCnt = parseInt(scratchPadCountDiv.innerHTML, 10);
            scratchPadCnt--;
            scratchPadCountDiv.innerHTML = scratchPadCnt;
        }
    };

/**
  * Increment count of Orders for Signature on New Order Entry scratchpad
  * @param {number} noeComponentId : The component ide of the new order entry component.
  * @returns {undefined} undefined
  */
OrderSelectionComponentO2.prototype.incrementSPCount = function (noeComponentId) {
        var scratchPadCountDiv = _g("noeScratchPadCount" + noeComponentId);
        if (scratchPadCountDiv) {
            var oldCount = parseInt(scratchPadCountDiv.innerHTML, 10);
            var newCount = oldCount + 1;
            scratchPadCountDiv.innerHTML = newCount;
        }
    };

/**
 * Add an item to the New Order Entry - Option 1 Scratchpad.
 * 		1. Add a CSS class to the Order Selection component to indicate the row is selected.
 *		2. Locate the New Order Entry - option 1 scratchpad and add an entry to it.
 *      3. Update the pending data shared resource.  If one or more items are selected this component is "dirty" and needs to be flagged.
 * Remove an item from the Pending Orders Scratchpad.
 * 		1. Remove a CSS class from the Order Selection component to indicate the row is NOT selected.
 *		2. Locate the New Order Entry - option 1 scratchpad and remove the targeted entry from it.
 *      3. Update the pending data shared resource.  If one or more items are selected this component is "dirty" and needs to be flagged.
 * @param {Object} event : Triggered click event.
 * @param {Object} data : data object bound to the component table cell.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.addItemToNOESP = function (event, data) {
	var component = this;
	var componentId = component.getComponentId();
	var element = $(event.target).closest("dd.ordsel-o2-info")[0];
	var orderRecord = data.RESULT_DATA;
    var venueType = (this.getVenue() === 2 ? 1 : 0);
    var favType = orderRecord.FAV_TYPE;
    var favSynId = (favType===2)?orderRecord.PATH_CAT_ID:orderRecord.SYN_ID;
    var favSentId = (favType===2)?orderRecord.PW_CAT_SYN_ID:orderRecord.SENT_ID;
    var favName = null;
    var favDisp = null;	
    var favParam = favSynId + ".0|" + venueType + "|" + favSentId + ".0";
    var favPPEvent = null;
    var favPPEventType = null;	
	var favHTML=[];
	
	if (favType === 2){
		favName = orderRecord.ITEM_DISP;
		favDisp = orderRecord.SENT_DISP;
	}
	else{
		favName = orderRecord.ITEM_DISP;
		favDisp = orderRecord.SENT_DISP;
	}
	if (!component.getActiveScratchPad()){
		var noeScratchPadContainer = Util.Style.g('noe-scratch', component.getActiveDiv())[0];
		component.setActiveScratchPad(noeScratchPadContainer);
	}
    var scratchPad = component.getActiveScratchPad();
    if (scratchPad) {
		//check checkbox or uncheck checkbox since scratchpad is present
		var noeNumId = parseInt(scratchPad.id.replace("noeScratchPad", ""), 10);
		var scratchPadCont = Util.gp(scratchPad);
		var noeComponent = MP_Util.GetCompObjById(noeNumId);
		var noeComponentId = noeComponent.getComponentId();
		var selectedOrdCnt = noeComponent.incSearchOrdersCnt();
		if (!Util.Style.ccss(element, "ordsel-o2-selected")) {
			Util.Style.acss(element, "ordsel-o2-selected");
			
			// Remove the "No orders selected" message
			var noOrdMsg = Util.Style.g("res-none", scratchPad, "SPAN");
			if (noOrdMsg) {
				Util.de(noOrdMsg[0]);
			}
			// Create scratch pad entry
			var scratchFav = Util.cep("dl", {
				"className": "noe-info",
				"id": "sp" + noeComponentId + "searchRow" + selectedOrdCnt
			});
			//Re-initialize the html array.
			favHTML.length = 0;
			if (favType === 1) { //Careset
				favHTML.push("<span class='noe-scr-remove-icon'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", "TODO: Order name", ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", "TODO: Order display line", ":</dt><dd class='noe-scr-disp'>", favDisp, "</dd><dt>", "TODO: Order paramaters", ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", "TODO: ORDER NOMEN", ":</dt><dd class='det-hd'></dd><dt>", "TODO: ORDER SET", ":</dt><dd class='det-hd'>6</dd><dt>", "TODO: Non Order Event", ":</dt><dd class='det-hd'>1</dd>");
			}
			else if (favType === 2) { //PowerPlan
				favPPEventType = 1;//all orders selection power plans are in the normal folder structure
				favPPEvent = 2;
				favHTML.push("<span class='noe-scr-remove-icon' ></span><span class='noe-pp-icon'>&nbsp;</span><dt>", "TODO: Order name", ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", "TODO: Order display line", ":</dt><dd class='noe-sys-name-disp'>", favDisp, "</dd><dt>", "TODO: Order paramaters", ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", "TODO: ORDER NOMEN", ":</dt><dd class='det-hd'></dd><dt>", "TODO: ORDER SET", ":</dt><dd class='det-hd'>0</dd>", "<dt>", "TODO: Non Order Event", ":</dt><dd class='det-hd'>", favPPEvent, "</dd>", "<dt>", "TODO: Powerplan Event Type", ":</dt><dd class='det-hd'>", favPPEventType, "</dd>");
			}
			else {
				favHTML.push("<span class='noe-scr-remove-icon'></span><dt>", "TODO: Order name", ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", "TODO: Order display line", ":</dt><dd class='noe-scr-disp'>", favDisp, "</dd><dt>", "TODO: Order paramaters", ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", "TODO: ORDER NOMEN", ":</dt><dd class='det-hd'></dd><dt>", "TODO: ORDER SET", ":</dt><dd class='det-hd'>0</dd>");
			}
			scratchFav.innerHTML = favHTML.join("");
			// Add entry to the scratch pad
			Util.ac(scratchFav, scratchPad);
			//increment items on scratchpad count
			component.incrementSPCount(noeComponentId);
			//Unhide the scratch pad container
			Util.Style.rcss(scratchPadCont, "hidden");
			//Flag component as "dirty"
			component.checkPendingSR(componentId, 1);
			$(scratchFav).click(component.removeFavHandler(component, noeComponentId, favSynId, favSentId));
		}
		else {
			//Unselect the item in the order selection component

			Util.Style.rcss(element, "ordsel-o2-selected");
			//Grab the selected items in the scratchpad
			var synIds = Util.Style.g("det-hd", scratchPad, "DD");
			//If the item is found in the scratchpad remove it.
			for (i = synIds.length; i--;) {
				var orderInfo = synIds[i].innerHTML.split('|');
				if (favSynId == parseInt(orderInfo[0], 10) && favSentId == parseInt(orderInfo[2], 10)) {
					var scratchPadRow = Util.gp(synIds[i]);
					Util.de(scratchPadRow);
					component.decrementSPCount(noeNumId);
					break;
				}
			}
			//Decrement the scratchpad counter
			noeComponent.m_searchOrdersCnt--;
			//Locate the scratpad 
			var scratchPadData = _gbt("DL", scratchPad);
			var scratchPadCnt = 0;
			if (scratchPadData) {
				scratchPadCnt = scratchPadData.length;
			}
			//re-hide the scratchpad container if necessary
			if (scratchPadCnt === 0 && scratchPadCont) {
				Util.Style.acss(scratchPadCont, "hidden");
			}
			//If no more orders are selected in this component remove it from the pending shared resource.							
			var selOrdRows = Util.Style.g("ordsel-o2-selected", component.getSectionContentNode(), "dl");
			if (selOrdRows.length === 0) {
				component.checkPendingSR(componentId, 0);
			}
		}
	}	
};

/**
 * Prepare the record data for consumption by the component table.
 * @param {Object} subFolder : Object containing an array of order selection items under a single component table group (subfolder).
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.processResultsForRender = function(subFolder){
    var component = this;
    var compId = component.getComponentId();
    var iconHTML = null;
    var subFolderLength = subFolder.length;
    var targetFavs = [];
    var arrHTML = [];
   
    for (var j = 0; j < subFolderLength; j++) {
        arrHTML = [];
        var curItem = subFolder[j];
        var sentDisp = (curItem.SENT_DISP) ? curItem.SENT_DISP : "";
        if (curItem.SENT_ALIAS) {
            sentDisp = curItem.SENT_ALIAS;
        }
        var itemDisp = (curItem.ITEM_ALIAS) ? curItem.ITEM_ALIAS : curItem.ITEM_DISP;
        if (curItem.TYPE_CD === 2) { //Order Synonym   
            if (curItem.ORDERABLE_TYPE_FLAG === 6) {
                iconHTML = "<span class='ordsel-o2-careset-icon'>&nbsp;</span>";
                curItem.FAV_TYPE = 1;
            }
            else {
                curItem.FAV_TYPE = 0;
                iconHTML = "";
            }
            arrHTML.push(iconHTML, "<span data-syn-id='", curItem.SYN_ID, "'>", itemDisp, "</span><span class='ordsel-o2-disp' data-sent-id='", curItem.SENT_ID, "'>", sentDisp, "</span>");
            
        }
        else 
            if (curItem.TYPE_CD === 6) { //PowerPlan
                iconHTML = "<span class='ordsel-o2-pp-icon'>&nbsp;</span>";
                arrHTML.push(iconHTML, "<span data-sent-id='", curItem.PW_CAT_SYN_ID, "'>", itemDisp, "</span><span class='ordsel-o2-disp' data-syn-id='", curItem.PATH_CAT_ID, "'>", sentDisp, "</span>");
                curItem.FAV_TYPE = 2;
            }
        curItem.ITEM_DISPLAY = arrHTML.join("");
        
        if (curItem.TYPE_CD === 6){
        	curItem.ITEM_HOVER = "<div class = 'ordsel-o2-hover'><dl class='ordsel-o2-det'><dt class='ordsel-o2-det-type'><span>" + component.os2i18n.POWERPLAN_DISPLAY + ":</span></dt><dd><span>" + curItem.ITEM_DISP + "</span></dd><dt class='ordsel-o2-det-type'><span>" + component.os2i18n.POWERPLAN_DESCRIPTION + ":</span></dt><dd><span>" + curItem.SENT_DISP + "</span></dd></dl></div>";
        }
        else{
	        curItem.ITEM_HOVER = "<div class = 'ordsel-o2-hover'><dl class='ordsel-o2-det'><dt class='ordsel-o2-det-type'><span>" + component.os2i18n.ORDER_SYNONYM + ":</span></dt><dd><span>" + curItem.ITEM_DISP + "</span></dd><dt class='ordsel-o2-det-type'><span>" + component.os2i18n.ORDER_SENTENCE + ":</span></dt><dd><span>" + curItem.SENT_DISP + "</span></dd></dl></div>";
    	}
    }
};

/**
 * Retrieve the component data from the database.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.retrieveComponentData = function(){
    // Construct the parameter string and call the CCL program
    var criterion = this.getCriterion();
    var sendAr = [];
    var folderId = MP_Util.CreateParamArray(this.getFavFolderId(), 1);
	if (!this.getWasListenerAdded()){
    	CERN_EventListener.addListener(this, EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT, this.removeFavorite, this);
    	CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.clearSelections, this);
    	CERN_EventListener.addListener(this, EventListener.EVENT_QOC_VIEW_VENUE_CHANGED, this.changeViewVenue, this);
    	this.setWasListenerAdded(true);
    }
	if (folderId == 0) {
		MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "Order folder not set"), this, "");
	}
	else {
		var currVenue = this.getVenue();
		sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", folderId, currVenue + ".0");
		var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
		request.setProgramName("mp_obtain_order_folders");
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(this, request, this.renderComponent);
	}
};

/**
 * Render the component table
 * @param {Object} reply : Object containing the order selection favorites.
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.renderComponent = function(reply){
    var recordData = reply.getResponse();
    var ordFolders;
    var orderFolderLength; 
    var hideSubfolder = 0;
	var rootFolderId = null;
    var subsecId = null;
    var curFolder = null;
    var i = 0;
    
    var component = reply.getComponent();
    var componentId = component.getComponentId();
    var subsecPreferences = component.getPreferencesObj();
    var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
    if(component.getIsPersonalFavorite() && recordData){
		component.sortRecordData(recordData);
	}
    function isGroupExpanded(subsecId, subsecPreferences){
    	var enabled = component.isSubsectionDefaultExpanded();
        var isExpanded = (component.isSubsectionDefaultExpanded()? true : false);
        if (subsecPreferences != null && component.isSaveOnExpandEnabled()) {
            $.each(subsecPreferences, function(){
                isExpanded = (subsecPreferences.subFolderExpanded[subsecId]) ? true : false;
            });
        }
        return isExpanded;
    }
	var currVenue = component.getVenue();
	var pageVenue; 
	var isCurrentVenue; 
    try {
			var finalizedHtml = "";
			if (reply.getStatus() !== "F") {
				ordFolders = recordData.FOLDER;
				orderFolderLength = ordFolders.length;
				pageVenue = recordData.VENUE_TYPE;
				//Used to ignore responses from other venues (when switching between venues before one has fully rendered)
				isCurrentVenue = (pageVenue === currVenue);
				//If component has previously been rendered for this venue response // return
				if(component.venueCache[pageVenue]){
					return;
				}
				if (reply.getStatus() === "S" && isCurrentVenue) {
					orderSelectionTable = new ComponentTable();
					orderSelectionTable.setNamespace(component.getStyles().getId() + "venue" + component.getVenue());
					orderSelectionTable.setIsHeaderEnabled(false);
					orderSelectionTable.setZebraStripe(false);
					orderSelectionTable.setNoresultsString(component.os2i18n.NO_FAVORITES_FOUND);

					//Create the name column
					var favoriteDisplayCol = new TableColumn();
					favoriteDisplayCol.setColumnId("DISPLAY_NAME");
					favoriteDisplayCol.setCustomClass("ordsel-o2-info");
					favoriteDisplayCol.setRenderTemplate('${ ITEM_DISPLAY }');

					//Add the columns to the table
					orderSelectionTable.addColumn(favoriteDisplayCol);

					for ( i = 0; i < orderFolderLength; i++) {
						curFolder = ordFolders[i];
						component.processResultsForRender(curFolder.ITEM);

						//DO NOT DISPLAY THE ROOT LEVEL IF THERE ARE NO ITEMS TO DISPLAY
						if (curFolder.ROOT_LEVEL_IND && curFolder.ITEM.length === 0) {
							hideSubfolder = 1;
						} else {
							hideSubfolder = 0;
						}
						if (!hideSubfolder) {
							//Process the results so rendering becomes more trivial
							if (curFolder.ROOT_LEVEL_IND) {
								rootFolderId = curFolder.FOLD_ID;
							}

							folderGrp = new TableGroup();
							folderHdr = curFolder.S_DESCRIP;
							folderGrp.setDisplay(folderHdr).setGroupId(curFolder.FOLD_ID).setShowCount(false);
							folderGrp.bindData(curFolder.ITEM);
							//Do not collapse the Root level favorites.
							if (!curFolder.ROOT_LEVEL_IND) {
								subsecId = componentId + "_" + curFolder.FOLD_ID;
								folderGrp.setIsExpanded(isGroupExpanded(subsecId, subsecPreferences));
							}
							orderSelectionTable.addGroup(folderGrp);
						}
					}

					var hoverExtension = new TableCellHoverExtension();

					//Bind the hover to the component table cell.
					hoverExtension.addHoverForColumn(favoriteDisplayCol, function(data) {
						return "<span>" + data.RESULT_DATA.ITEM_HOVER + "</span>";
					});
					orderSelectionTable.addExtension(hoverExtension);

					/*
					 * Add group toggle extension to handle saving subsection preferences if enabled.
					 */
					if (component.isSaveOnExpandEnabled()) {
						var grpToggleExtension = new TableGroupToggleCallbackExtension();
						grpToggleExtension.setGroupToggleCallback(function(event, data) {
							var compTable = component.m_componentTable;
							var gMap = compTable.getGroupMap();
							var gSequence = compTable.getGroupSequence();
							var idx = gSequence.length;
							while (idx--) {
								var subSecExpanded = gMap[gSequence[idx]].expanded;
								component.ordselo2PrefObj.subFolderExpanded[component.getComponentId() + "_" + gSequence[idx]] = subSecExpanded;
							}

							component.setPreferencesObj(component.ordselo2PrefObj);
							component.savePreferences(true);

						});
						orderSelectionTable.addExtension(grpToggleExtension);
					}
					//Store off the component table
					component.setComponentTable(orderSelectionTable);
					component.addCellClickExtension();

					//Finalize the component using the orderSelectionTable.render() method to create the table html
					finalizedHtml = orderSelectionTable.render();
					component.finalizeComponent(finalizedHtml, "");

					//The root level favorites should not be displayed under a subsection.  Hide it.
					if (rootFolderId) {
						rootGroup = orderSelectionTable.getGroupById(rootFolderId);
						var rootFolderDomId = component.getStyles().getId() + "venue" + component.getVenue() + ":" + rootFolderId + ":header";
						var rootFolderObj = _g(rootFolderDomId);
						Util.Style.acss(rootFolderObj, "ordsel-o2-root-subsec");
					}
				} else {
					if (reply.getStatus() === "Z" && isCurrentVenue) {
						finalizedHtml = "<h3 class='info-hd'><span class='res-normal'>" + component.os2i18n.NO_FAVORITES_FOUND + "</span></h3><span class='res-none'>" + component.os2i18n.NO_FAVORITES_FOUND + "</span>";
						MP_Util.Doc.FinalizeComponent(finalizedHtml, component, "");
					}
				}
			} else {//reply.getStatus() == "F" -> This status is not cached, since we are unable to determine the venue obtained from
				finalizedHtml = MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), reply.getError());
				MP_Util.Doc.FinalizeComponent(finalizedHtml, component, "");
			}
			//Cache the component table and html
			if (isCurrentVenue && !component.venueCache[pageVenue]) {
				// Check if valid pageVenue was returned by script
				if (pageVenue === 0 || pageVenue === 1 || pageVenue === 2) {
					component.venueCache[pageVenue] = {};
					component.venueCache[pageVenue].html = finalizedHtml;
					if (reply.getStatus() === "S"){
						component.venueCache[pageVenue].comp_table = component.getComponentTable();
					}
				}				
			}
    } 
    catch (err) {
        if (timerRenderComponent) {
            timerRenderComponent.Abort();
            timerRenderComponent = null;
        }
        throw (err);
    }
    finally {
        if (timerRenderComponent) {
            timerRenderComponent.Stop();
        }
    }
};

/**
 * Legacy - Sort order selection component IF the component is a personal order favorite folder
 * @param {Object} recordData : Object containing the order selection favorites.
 * @returns {undefined} undefined
 */ 
OrderSelectionComponentO2.prototype.sortRecordData = function(recordData){

    // Don't do anything if the preference is not set or we have no folders
    if (recordData.FAVORITES_SORT != 1 || !recordData.FOLDER) {
        return;
    }
    
    var rootLevelIndex = null;
    var rootFolder = null;
    // Sort the folder themselves
    recordData.FOLDER.sort(this.sortBy("S_DESCRIP"));
    
    // Sort folder items, and finds the root folder
    $.each(recordData.FOLDER, function(i, folder){
        if (folder.ROOT_LEVEL_IND === 1) {
            rootLevelIndex = i;
        }
        folder.ITEM.sort(OrderSelectionComponentO2.prototype.sortBy("ITEM_DISP"));
    });
    
    // Puts the root folder at the top
    if (rootLevelIndex !== null) {
        rootFolder = recordData.FOLDER.splice(rootLevelIndex, 1);
        recordData.FOLDER.unshift(rootFolder[0]);
    }
    
};
		
OrderSelectionComponentO2.prototype.sortBy = function(parameter){
    return function(a, b){
        var aName = a[parameter].toLowerCase();
        var bName = b[parameter].toLowerCase();
        
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };
};

        
/**
 * This function only gets called by the firing of the event listener within the
 * New Order Entry component. This deselects all favorites that have been selected.
 * @param {object} component : The Order Selection component
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.dSelectAll = function(component){
	var rootOrdSecCont = component.getSectionContentNode();
	var selOrdRows = Util.Style.g("ordsel-o2-selected", rootOrdSecCont, "dd");
	var selOrdLen = selOrdRows.length;
	for (var i = selOrdLen; i--;) {
		var selOrdRow = selOrdRows[i];
		Util.Style.rcss(selOrdRow, "ordsel-o2-selected");
	}

	// Remove order selection from cached html of all venues 
	for (var i = component.venueCache.length; i--;) {
		if (component.venueCache[i]) {
			if (component.venueCache[i].html.indexOf("ordsel-o2-selected") > -1) {
				component.venueCache[i].html = component.venueCache[i].html.replace(/ordsel-o2-selected/g, "");
			}
		}
	}

	component.setActiveDiv(Util.Style.g("div-tab-item-selected", document.body, "DIV")[0]);
	component.setActiveScratchPad(null);
	component.checkPendingSR(component.getComponentId(), 0);
};

/**
 * We need to remove the targeted item from the New Order Entry - option 1 componenent.
 * This is a wrapper to be bound to the click event.
 * @param {object} component : The Order Selection component
 * @param {string} noeComponentId : The id of the New Order Entry component, passed in as a string
 * @param {string} favSynId : The id of the order synonym, passed in as a string
 * @param {string} favSentId : The id of the order sentence, passed in as a string
 * @returns {undefined} undefined
 */		
OrderSelectionComponentO2.prototype.removeFavHandler = function(component, noeComponentId, favSynId, favSentId){
    return function(){
        component.removeFavFromSP(this, component, noeComponentId, favSynId, favSentId);
    };
};
/**
 * When clicking on the remove button on an order inside the New Order Entry component,
 * 		we will REMOVE an order or careset favorite from the scratch pad,
 * 		and REMOVE the CSS added to the order in the corresponding Order Selection component
 * @param {Object} event : The button of the order favorite clicked by the user on the NOE scracthpad
 * @param {Object} component : Component Object.
 * @param {string} noeComponentId : The id of the New Order Entry component, passed in as a string
 * @param {string} synonymId : The id of the order synonym, passed in as a string
 * @param {string} sentenceId : The id of the order sentence, passed in as a string
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.removeFavFromSP = function(event, component, noeComponentId, synonymId, sentenceId){
    var componentId = this.getComponentId();
    var fav = event;
    
    var noei18n = i18n.discernabu.noe_o1;
    var scratchPad = _g("noeScratchPad" + noeComponentId);
    var scratchPadData = _gbt("DL", scratchPad);
    var scratchPadCnt = 0;
    if (scratchPadData) {
        scratchPadCnt = scratchPadData.length;
    }
    
    var intComponentId = parseInt(componentId, 10);
    var ordselComponent = MP_Util.GetCompObjById(intComponentId);
    if (!ordselComponent) {
        ordselComponent = MP_Util.GetCompObjById(componentId);
    }
    
    var selOrdRows = Util.Style.g("ordsel-o2-selected", ordselComponent.getSectionContentNode(), "dd");
    for (var i = selOrdRows.length; i--;) {
        var synId = $(selOrdRows[i]).find("span[data-syn-id]:first")[0];
        var sentId = Util.gns(synId);
        if (synId && sentId && parseInt(synonymId, 10) === parseInt(synId.getAttribute('data-syn-id'), 10) && parseInt(sentenceId, 10) === parseInt(sentId.getAttribute('data-sent-id'), 10)) {
            var checkbox = null;
            Util.Style.rcss(selOrdRows[i], "ordsel-o2-selected");
            if (fav) {
                Util.de(fav);
                scratchPadCnt--;
                component.decrementSPCount(noeComponentId);
            }
            break;
        }
    }
    
    //If no more orders are selected in this component remove it from the pending shared resource.
    if (Util.Style.g("ordsel-o2-selected", ordselComponent.getSectionContentNode(), "dl").length === 0) {
        component.checkPendingSR(componentId, 0);
    }
    
    if (scratchPadCnt === 0) {
        var scratchPadCont = _g("noeScratchPadCont" + noeComponentId);
        if (scratchPadCont) {
            Util.Style.acss(scratchPadCont, "hidden");
        }
    }
};

/**
 * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
 * @param {char} compId : The New Order Entry component_id
 * @param {boolean} pendingInd : true = current component has pending data.  Prompt the user before they navigate away from the chart
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.checkPendingSR = function(compId, pendingInd){
    var srObj = null;
    var strCompId = String(compId); //Convert to string to keep consistant.
    var dataObj = {};
    
    /**
     * Create pendingData Shared Resource.
     * @returns {object} srObj - It returns the shared resource object
     */
    function initPendingData(){
        var srObj = null;
        var dataObj = {};
        var pendingSR = MP_Resources.getSharedResource("pendingDataSR");
        srObj = new SharedResource("pendingDataSR");
        //Create the object that will be stored in the SharedResource 
        dataObj.pendingDataObj = (!CERN_BrowserDevInd) ? window.external.DiscernObjectFactory("PVFRAMEWORKLINK") : null;
        dataObj.pendingDataCompArr = [];
        //Set the available flag to true 
        srObj.setIsAvailable(true);
        //Set the shared resource data object 
        srObj.setResourceData(dataObj);
        //Add the shared resource so other components can access it 
        MP_Resources.addSharedResource("pendingDataSR", srObj);
        return srObj;
    }
    
    //Get the shared resource
    srObj = MP_Resources.getSharedResource("pendingDataSR");
    if (!srObj) {
        srObj = initPendingData();
    }
    //Retrieve the object from the shared resource.
    dataObj = srObj.getResourceData();
    if (!dataObj.pendingDataObj) {
        MP_Util.LogError("Unable to create PVFRAMEWORKLINK");
        return;
    }
    var pendingArr = dataObj.pendingDataCompArr;
    if (pendingInd) { //Add component to the array of pending components.  Keep a distinct list of component ID's
        if (pendingArr.join("|").indexOf(strCompId) === -1) {
            pendingArr.push(strCompId);
        }
    }
    else { //The component no longer has pending data.  Remove the component id from the array.
        var idx = pendingArr.length;
        while (idx--) {
            if (strCompId === pendingArr[idx]) {
                pendingArr.splice(idx, 1);
                break;
            }
        }
    }
    dataObj.pendingDataCompArr = pendingArr;
    //If there are no other components that have pending actions communicate to the PVFRAMEWORKLINK object that there is no pending components.
    dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
    //Update the SharedResource.
    MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
};
/**
 * Add or remove scratchpad object to the shared resource array of objects
 * @param {Object} scratchpadObj : Scratchpad object to add or remove
 * @param {boolean} isRemovingObj : true = remove object from scracthpad shared resource. false = add it to scracthpad shared resource
 * @return {Object} dataObj : Scratchpad shared resource data object
 */
OrderSelectionComponentO2.prototype.addToOrRemoveFromScratchpadSR = function(scratchpadObj, isRemovingObj){
    var srObj = this.getScratchpadSharedResourceObject();
    if (srObj) {
        //Retrieve the object from the shared resource.
        var dataObj = srObj.getResourceData();
        if (!dataObj) {
            return null;
        }
        else {
            var scratchpadArr = dataObj.scratchpadObjArr;
            if (scratchpadArr) {
                if (isRemovingObj) {
                    var idx = scratchpadArr.length;
                    while (idx--) {
                        if (scratchpadArr[idx].favSynId == scratchpadObj.favSynId &&
                        scratchpadArr[idx].favSentId == scratchpadObj.favSentId && 
                        scratchpadArr[idx].favVenueType == scratchpadObj.favVenueType) {
                            scratchpadArr.splice(idx, 1);
                            break;
                        }
                    }
                }
                else {
                    scratchpadArr.push(scratchpadObj);
                }
            }
            
            dataObj.scratchpadObjArr = scratchpadArr;
            
            //Update the SharedResource.
            MP_Resources.setSharedResourceData(srObj.getName(), dataObj);
            
            //notify consumers that something has been added to or deleted from the shared resource
            srObj.notifyResourceConsumers();
            
            return dataObj;
        }
    }
};
/**
 * Get Scratchpad Shared Resource object
 * @return {Object} srObj : Scratchpad shared resource object
 */
OrderSelectionComponentO2.prototype.getScratchpadSharedResourceObject = function(){
    var srObj = null;
    var sharedResourceName = "scratchpadSR";
    //Get the shared resource
    srObj = MP_Resources.getSharedResource(sharedResourceName);
    if (!srObj) {
        srObj = MP_ScratchPadMgr.initScratchpadSR(sharedResourceName);
    }
    
    return srObj;
};
/**
 * When a favorite is removed from the scratchpad modal dialog, an event is fired and this function
 *  is called to update the component
 * @param {node} component : The order selection O2 component
 * @param {event} event : A builtin event passthrough
 * @param {Object} removeObject The object that has data to find the favorite and update its content
 * @returns {undefined} undefined
 */
OrderSelectionComponentO2.prototype.SPModalDialogRemovesFavorite = function(component, event, removeObject){
	//check Order Selection component and remove any targeted orders.

	if (removeObject.componentId) {
		if (component.getComponentId() == removeObject.componentId) {//if the favorite isn't in this specific component, don't go inside if statement
			var ordSelCompFav = _g(removeObject.favoriteId);

			var checkbox = null;
			if (ordSelCompFav) {
				Util.Style.rcss(ordSelCompFav, "ordsel-o2-selected");
			}  else {
				// If the orderable is not found in the current venue, search in the cached html of other venues and remove the selection
				var orderSelectedCSS = "class=\"table-cell ordsel-o2-info ordsel-o2-selected\"";
				var orderDeselectedCSS = "class=\"table-cell ordsel-o2-info\"";
				var id = "id=";

				var selectedRowHTML1 = id + removeObject.favoriteId + " " + orderSelectedCSS;
				var removeSelection1 = id + removeObject.favoriteId + " " + orderDeselectedCSS;

				var selectedRowHTML2 = id + "\"" + removeObject.favoriteId + "\"" + " " + orderSelectedCSS;
				var removeSelection2 = id + "\"" + removeObject.favoriteId + "\"" + " " + orderDeselectedCSS;

				var selectedRowHTML3 = orderSelectedCSS + " " + id + "\"" + removeObject.favoriteId +"\"";
				var removeSelection3 = orderDeselectedCSS + " " + id + "\"" + removeObject.favoriteId +"\""; 

				for (var i = component.venueCache.length; i--;) {
					if(component.venueCache[i]) {
						if (component.venueCache[i].html.indexOf(selectedRowHTML1) > -1) {
							component.venueCache[i].html = component.venueCache[i].html.replace(selectedRowHTML1, removeSelection1);
							matchFound = true;
							break;
						}
						if (component.venueCache[i].html.indexOf(selectedRowHTML2) > -1) {
							component.venueCache[i].html = component.venueCache[i].html.replace(selectedRowHTML2, removeSelection2);
							break;
						}
						if (component.venueCache[i].html.indexOf(selectedRowHTML3) > -1) {
							component.venueCache[i].html = component.venueCache[i].html.replace(selectedRowHTML3, removeSelection3);
							break;
						}
					}
				}
			}
		}
	}
};

/**
 * Overwrite the isDisplayable() function to ensure the component is not displayed if MPAGES_EVENT is not available.
 * @returns {object} - is displayable
 */
OrderSelectionComponentO2.prototype.isDisplayable = function(){
	if(this.isComponentFiltered() || (!CERN_BrowserDevInd && !CERN_Platform.inMillenniumContext())){
		return false;
	}
	return this.m_compDisp;
};
 
 
/**
 * Overwrite the isComponentFiltered() function to account for whether the component should be displayed in the
 * page level menu
 * @return {boolean} True if the component should not be displayed because of a filter or it's been removed because
 * 						win32 is not available, false otherwise.
 */
OrderSelectionComponentO2.prototype.isComponentFiltered = function(){
	if(!CERN_BrowserDevInd && !CERN_Platform.inMillenniumContext()){
		return true;
	}
	return(MPageComponent.prototype.isComponentFiltered.call(this));
};
 
/**
 * Map the Order Selection option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "QOC_ORD_SEL_#" filter 
 */
MP_Util.setObjectDefinitionMapping("ORD_SEL_1", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_2", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_3", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_4", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_5", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_6", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_7", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_8", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_9", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_10", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_11", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_12", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_13", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_14", OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_15", OrderSelectionComponentO2);
//For personal favorite folders
MP_Util.setObjectDefinitionMapping("ORD_SEL_PRSNL", OrderSelectionComponentO2);//For personal favorite folders
