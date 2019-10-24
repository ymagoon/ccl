function NewOrderEntryComponentStyle(){
    this.initByNamespace("noe");
}

NewOrderEntryComponentStyle.prototype = new ComponentStyle();
NewOrderEntryComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The New Order Entry component will allow the user to enter new orders for the patient from within the MPage
 *
 * @param {Criterion} criterion
 */
function NewOrderEntryComponent(criterion){
	this.m_encntrTypeCd = null;
	this.m_facilityId = null;
	this.m_ordersSearchInd = false;
	this.m_searchIndicators = null;
	this.m_searchOrdersCnt = 0;
	this.m_suggestionLimit = 0;
	this.m_searchResultsLimit = 50;
	this.m_venueType = 1; //1 = inpatient, 2 = ambulatory
	this.m_dispOnlyProductLevelMeds = false;
	this.m_virtViewOrders = true;
	this.m_virtViewRxOrders = true;
	this.m_powerPlanEnabled = false;
	this.m_userFavEnabled = true;
	this.m_publicFavEnabled = false;
	this.m_sharedFavEnabled = false;
    this.m_planFavEnabled = false;
    this.m_modalScratchPadEnabled = false;
    this.m_favoritesSort = false;
	this.m_userFavLabel = "";
	this.m_publicFavLabel = "";
	this.m_sharedFavLabel = "";
	this.setCriterion(criterion);
    this.setStyles(new NewOrderEntryComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.NEW_ORDER_ENTRY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.NEW_ORDER_ENTRY.O1 - render component");
    this.setIncludeLineNumber(false);
    this.setHasActionsMenu(true);
    this.m_ambInd=false;
	this.venueValue = 1;
	this.m_venueTypeList = [];
	this.m_uid = "";
	this.m_eventsAdded = false;
    window.noe_mpage = criterion.category_mean;
	
    NewOrderEntryComponent.method("openTab", function(){
        var criterion = this.getCriterion();
		var params = criterion.person_id + '.0|' + criterion.encntr_id + '.0|{ORDER|0|0|0|0|0}|24|{2|127}{3|127}|8|0';
		MPAGES_EVENT("ORDERS",params);
		this.retrieveComponentData();
    });
	NewOrderEntryComponent.method("isOrderSearchInd", function(){
        return this.m_ordersSearchInd;
    });
    NewOrderEntryComponent.method("setOrderSearchInd", function(value){
        this.m_ordersSearchInd = (value == 1 ? true : false);
    });
	NewOrderEntryComponent.method("isVirtViewOrders", function(){
        return this.m_virtViewOrders;
    });
    NewOrderEntryComponent.method("setVirtViewOrders", function(value){
        this.m_virtViewOrders = (value == 1 ? true : false);
    });
	NewOrderEntryComponent.method("isVirtViewRxOrders", function(){
        return this.m_virtViewRxOrders;
    });
    NewOrderEntryComponent.method("setVirtViewRxOrders", function(value){
        this.m_virtViewRxOrders = (value == 1 ? true : false);
    });	
	NewOrderEntryComponent.method("isDispOnlyProductLevelMeds", function(){
        return this.m_dispOnlyProductLevelMeds;
    });
    NewOrderEntryComponent.method("setDispOnlyProductLevelMeds", function(value){
        this.m_dispOnlyProductLevelMeds = (value == 1 ? true : false);
    });	
	NewOrderEntryComponent.method("getVenueType", function(){
        return this.m_venueType;
    });
    NewOrderEntryComponent.method("setVenueType", function(value){
		this.m_venueType = (value ? 2 : 1);
    });	
	NewOrderEntryComponent.method("getFacilityId", function(){
        return this.m_facilityId;
    });
    NewOrderEntryComponent.method("setFacilityId", function(value){
        this.m_facilityId = value;
    });	
	NewOrderEntryComponent.method("getEncntrTypeCd", function(){
        return this.m_encntrTypeCd;
    });
    NewOrderEntryComponent.method("setEncntrTypeCd", function(value){
        this.m_encntrTypeCd = value;
    });		
	NewOrderEntryComponent.method("getSearchIndicators", function(){
        return this.m_searchIndicators;
    });
    NewOrderEntryComponent.method("setSearchIndicators", function(value){
        this.m_searchIndicators = value;
    });
	NewOrderEntryComponent.method("getSuggestionLimit", function(){
        return this.m_suggestionLimit;
    });
	NewOrderEntryComponent.method("setSuggestionLimit", function(value){
		this.m_suggestionLimit = value;
	});
	NewOrderEntryComponent.method("getSearchResultsLimit", function(){
        return this.m_searchResultsLimit;
    });
	NewOrderEntryComponent.method("setSearchResultsLimit", function(value){
		this.m_searchResultsLimit = value;
	});
	//Increment Search Orders Count Method
	NewOrderEntryComponent.method("incSearchOrdersCnt", function(){
		return ++this.m_searchOrdersCnt;
	});
	NewOrderEntryComponent.method("isPowerPlanEnabled", function(){
		return this.m_powerPlanEnabled;
	});	
    NewOrderEntryComponent.method("setPowerPlanEnabled", function(value){
        this.m_powerPlanEnabled = (value == 1 ? true : false);
    });
	NewOrderEntryComponent.method("isUserFavEnabled", function(){
		return this.m_userFavEnabled;
	});	
    NewOrderEntryComponent.method("setUserFavEnabled", function(value){
        this.m_userFavEnabled = (value == 1 ? true : false);
    });	
	NewOrderEntryComponent.method("isPublicFavEnabled", function(){
		return this.m_publicFavEnabled;
	});	
    NewOrderEntryComponent.method("setPublicFavEnabled", function(value){
        this.m_publicFavEnabled = (value == 1 ? true : false);
    });		
	NewOrderEntryComponent.method("isSharedFavEnabled", function(){
		return this.m_sharedFavEnabled;
	});	
    NewOrderEntryComponent.method("setSharedFavEnabled", function(value){
        this.m_sharedFavEnabled = (value == 1 ? true : false);
    });	
	NewOrderEntryComponent.method("isPlanFavEnabled", function(){
		return this.m_planFavEnabled;
	});	
    NewOrderEntryComponent.method("setPlanFavEnabled", function(value){
        this.m_planFavEnabled = (value == 1 ? true : false);
    });		
    NewOrderEntryComponent.method("setUserFavLabel", function(value){
        this.m_userFavLabel = value;
    });		
	NewOrderEntryComponent.method("getUserFavLabel", function(){
        return this.m_userFavLabel;
    });
    NewOrderEntryComponent.method("setPublicFavLabel", function(value){
        this.m_publicFavLabel = value;
    });		
	NewOrderEntryComponent.method("getPublicFavLabel", function(){
        return this.m_publicFavLabel;
    });
    NewOrderEntryComponent.method("setSharedFavLabel", function(value){
        this.m_sharedFavLabel = value;
    });		
	NewOrderEntryComponent.method("getSharedFavLabel", function(){
        return this.m_sharedFavLabel;
    });
    NewOrderEntryComponent.method("setModalScratchPadEnabled", function(value){
        this.m_modalScratchPadEnabled = (value === 1 ? true : false);
    });
    NewOrderEntryComponent.method("isModalScratchPadEnabled", function(){
        return this.m_modalScratchPadEnabled;
    });		
    NewOrderEntryComponent.method("setFavoritesSort", function(value){
        this.m_favoritesSort = (value === 1 ? true : false);
    });
    NewOrderEntryComponent.method("getFavoritesSort", function(){
        return this.m_favoritesSort;
    });
    NewOrderEntryComponent.method("isAmbulatoryEnctrGrpFLag", function() {
		return this.m_ambInd;
	});
	NewOrderEntryComponent.method("setAmbulatoryEnctrGrpFlag", function(value) {
		this.m_ambInd= (value == 2 ? true : false);
	});
	NewOrderEntryComponent.method("getEncntrVenueInd", function() {
		return this.venueValue;
	});
	NewOrderEntryComponent.method("setEncntrVenueInd", function(value) {
		this.venueValue= value;
	});
	NewOrderEntryComponent.method("getUid", function() {
		return this.m_uid;
	});
	NewOrderEntryComponent.method("setUid", function(value) {
		this.m_uid= value;
	});
	NewOrderEntryComponent.prototype.getVenueTypeList = function() {
		return this.m_venueTypeList;
	};
	NewOrderEntryComponent.prototype.setVenueTypeList =  function(value) {
		this.m_venueTypeList= value;
	};
	NewOrderEntryComponent.prototype.areEventsAdded = function(){
		return this.m_eventsAdded;
	};
	NewOrderEntryComponent.prototype.setEventsAdded = function(areEventsAdded){
		this.m_eventsAdded = areEventsAdded;
	};
	NewOrderEntryComponent.method("isDischargeAsRxVenue", function() {
		return (!this.isAmbulatoryEnctrGrpFLag() && this.getVenueType() === 2);
	});
    NewOrderEntryComponent.method("initPendingSR", function(){
        var srObj = null;
        var dataObj = {};
        var pendingSR = MP_Resources.getSharedResource("pendingDataSR");
		if (!pendingSR) {
            srObj = new SharedResource("pendingDataSR");
            //Create te object that will be stored in the SharedResource 
            dataObj.pendingDataObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
            dataObj.pendingDataCompArr = [];
            //Set the available flag to true 
            srObj.setIsAvailable(true);
            //Set the shared resource data object 
            srObj.setResourceData(dataObj);
            //Add the shared resource so other components can access it 
            MP_Resources.addSharedResource("pendingDataSR", srObj);			
			} else { //The shared resource exists
				dataObj = pendingSR.getResourceData();
				var idx = dataObj.pendingDataCompArr.length;
				//Since the shared resource exists ONLY remove the current component from pending Array as other components may contain pending data.
                while (idx--) {
					//From testing JS wants to convert the componentID to string when added to the pendingDataCompArr.  DON'T change to '==='.
                    if (this.getComponentId() == dataObj.pendingDataCompArr[idx]) {
                        dataObj.pendingDataCompArr.splice(idx, 1);
                        break;
                    }
                }
				//Update the shared resource with current data.
				MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
			}
			//If components contain pending data notify the Powerchart framework
			dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0:1);   
    });	
	NewOrderEntryComponent.method("RemoveFavorite", function(event, removeObject){
		CERN_NEW_ORDER_ENTRY_O1.SPModalDialogRemovesFavorite(this, event, removeObject);
	});	

   /*
    * Updates the venue type displayed in NOE component
    * @param {object} event: event that fired listener
    * @param {object} venue: An object containing venue display and value to switch to
    */
    NewOrderEntryComponent.prototype.ChangeViewVenue = function(event, venue){
    	var activeView = MP_Viewpoint.getActiveViewId();
    	var noeId = "noe" + this.getComponentId();
    	var venueTypeList = this.getVenueTypeList();
    	//Ensure that the NOE component is on the active view
    	var component = $('#' + activeView).find('#' + noeId);
    	if (component.length > 0 && venueTypeList.length){
			var pageLevelVenue = venue.VALUE;

			var oldVenueType = this.getVenueType();
			var newVenueType = pageLevelVenue;
			var venueTypeCnt = venueTypeList.length;
			var oldVenueDisplay = "";
			var newVenueDisplay = "";
			var componentId = this.getComponentId();
			
			// Ensure Ambulatory and Inpatient Encounters both have venue type of 1
			pageLevelVenue = (pageLevelVenue === 2) ? 2 : 1;
			if (pageLevelVenue === oldVenueType) {
				return;
			}

			// Determine new and old venue display values through comparison to the venueTypeList
			var venueValue = (venueTypeList[0].SOURCE_COMPONENT_LIST[0].VALUE === 2) ? 2 : 1;
			if (venueValue === newVenueType) {
				newVenueDisplay = venueTypeList[0].DISPLAY;
				oldVenueDisplay = venueTypeList[1].DISPLAY;
			} else {
				oldVenueDisplay = venueTypeList[0].DISPLAY;
				newVenueDisplay = venueTypeList[1].DISPLAY;
			}
			CERN_NEW_ORDER_ENTRY_O1.ChangeVenueType(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType); 
		}
	};	
    
}

NewOrderEntryComponent.inherits(MPageComponent);

NewOrderEntryComponent.prototype.preProcessing = function(){
	//Call the base class implementation for future support
	MPageComponent.prototype.preProcessing.call(this); 
	//Check to see if the component is within a viewpoint or a standalone MPage
	var viewpointIndicator = (typeof m_viewpointJSON == "undefined") ? false : true;
	if(viewpointIndicator) {
		this.setModalScratchPadEnabled(1);
	}
};

/**
 * Performs an actions based on selecting the given health plan
 * @param  {Object} healthPlan Object description of health plan
 */
NewOrderEntryComponent.prototype.selectHealthPlan = function(healthPlan){
	var self = this;
	var uid = healthPlan.FORMULARY_BENEFIT_SET_UID;
	this.setUid(uid);
	self.m_base.refreshEligibilityInfo(uid);
};

/**
 * Generates a health plan selector to render within the component
 */
NewOrderEntryComponent.prototype.retrieveHealthPlanSelector = function(){
	var self = this;
	var style = this.getStyles();
	var compId = style.getId();
	var element = $('#' + compId + 'HealthPlanWrapper');
	//Don't re-render selector if already added
	if (element.children().length){
		return;
	}
	var patientId = this.getCriterion().person_id;
	var encntrId = this.getCriterion().encntr_id;
	var userId = this.getCriterion().provider_id;
	var messageContainer = $('#' + 'noeEligibilityMessage' + this.getComponentId());
	var callback = function(healthPlan){
		self.selectHealthPlan(healthPlan);
	};
	var planSelector = new HealthPlanSelector();
	planSelector.setPatient(patientId);
	planSelector.setElement(element);
	planSelector.setEncounterId(encntrId);
	planSelector.setUserId(userId);
	planSelector.setNamespace(compId);
	planSelector.setOnSelect(callback);
	planSelector.setErrorContainer(messageContainer);
	planSelector.init();
	/* We need to add padding space to search box only if exists*/
	var noeSearchBoxDiv = $("#noeSearchBox"+this.getComponentId());
	if(noeSearchBoxDiv) {
		$(noeSearchBoxDiv).addClass("noe-search-box-padding");
	}
};

/**
 * Add event listeners to the component
 */
NewOrderEntryComponent.prototype.addEventListeners = function(){
	//add listener for component "refresh" after orders have been submitted
	CERN_EventListener.addListener(this,EventListener.EVENT_ORDER_ACTION, this.retrieveComponentData, this);
	//add listener to remove a favorite from the component
	CERN_EventListener.addListener(this, EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT, this.RemoveFavorite, this);
	//add listener to accept venue changes from view-level venue-selector in QOC
	CERN_EventListener.addListener(this, EventListener.EVENT_QOC_VIEW_VENUE_CHANGED, function(event, venue) {

		//NOE component should not change it's venue when 'All' is selected in page level venue selector
		if (venue.VALUE === 0) {
			return;
		}

		// This will prevent an error when the discharge new order pref is set to reject and the venue is changed from discharge meds as rx to Inpatient.
		if (this.m_base.getDischNewOrderPref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT || this.m_base.getFutureOrderMessagePref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT) {
			return;
		}
		this.ChangeViewVenue(event, venue);
	}, this); 

	this.setEventsAdded(true);
};

//Implementing the MPageComponent's retrieveComponentData
NewOrderEntryComponent.prototype.retrieveComponentData = function(){
	//Call the base class implementation for future support
	var self = this;
	CERN_NEW_ORDER_ENTRY_O1.GetNewOrderEntryData(this, function(recordData){
		CERN_NEW_ORDER_ENTRY_O1.RenderComponent(recordData, self);
	});
	//Event Listeners are now being added in retrieveComponentData to ensure that they are added only when
	//the component is active on the page, ensure events are added once
	if (!this.areEventsAdded()){
		this.addEventListeners();
	}
};

/**
 * Overwrite the isDisplayable() function to ensure the component is not displayed if MPAGES_EVENT is not available.
 */
NewOrderEntryComponent.prototype.isDisplayable = function(){
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
NewOrderEntryComponent.prototype.isComponentFiltered = function(){
	if(!CERN_BrowserDevInd && !CERN_Platform.inMillenniumContext()){
		return true;
	}
	return(MPageComponent.prototype.isComponentFiltered.call(this));
};

/**
 * New Order Entry methods
 * @namespace CERN_NEW_ORDER_ENTRY_O1
 * @static
 * @global
 * @dependencies Script: mp_get_powerorder_favs_json
 */
var CERN_NEW_ORDER_ENTRY_O1 = function(){

	var resizeTimeoutId; //Only global added since only one dx table can be open at a time.
	
	function fireEvent(eventName, element) {
		// compatibility with IE8 and below
		if (element.fireEvent) {
			element.fireEvent("on" + eventName);
			return;
		}
		
		// IE9+
		var event = document.createEvent("HTMLEvents");
		event.initEvent(eventName,true,false);
		element.dispatchEvent(event);
	}

    return {
        GetNewOrderEntryData: function(component, callback){
        	var criterion = component.getCriterion();
			var componentId = component.getComponentId();
			var noei18n = i18n.discernabu.noe_o1;
			var tabMask = 0;

			// ------------------------------------------------------------
			// INITIALIZE BASE COMPONENT
			// ------------------------------------------------------------
    	    component.m_base = new MPageComponents.NewOrderEntry();
    	    component.m_base.setTargetElementId("noeContentBody" + componentId);
    	    component.m_base.setTemplates(MPageComponents.NewOrderEntry.Templates.option1);
    	    component.m_base.setSuggestionLimit(20);
    	    component.m_base.setTimerNames({
				"ORDER": {
					"MINE": "CAP:MPG NEW ORDER ENTRY O1 MINE ORDER",
					"PUBLIC": "CAP:MPG NEW ORDER ENTRY O1 PUBLIC ORDER",
					"SHARED": "CAP:MPG NEW ORDER ENTRY O1 SHARED ORDER",
					"SEARCHRESULTS": "CAP:MPG NEW ORDER ENTRY O1 CLICK ON ORDER FROM SEARCH"

				},
				"SEARCH": "CAP:MPG New Order Entry Search",
				"ORDER_ADDTOSCRATCHPAD":{				
					"MINE": "CAP:MPG NEW ORDER ENTRY O1 ADD TO SCRATCHPAD ORDER FROM MINE TAB",
					"PUBLIC": "CAP:MPG NEW ORDER ENTRY O1 ADD TO SCRATCHPAD ORDER FROM PUBLIC TAB",
					"SEARCHRESULTS": "CAP:MPG NEW ORDER ENTRY O1 ADD TO SCRATCHPAD FROM SEARCH"
				}
			});
    	    component.m_base.loadLegacyComponent(component, CERN_NEW_ORDER_ENTRY_O1, noei18n);
    	
			
			if (!CERN_BrowserDevInd) {
				component.initPendingSR();
			}
			if(!component.isModalScratchPadEnabled()){
				component.addMenuOption("mnuDxTable", "mnuDxTable" + componentId, noei18n.DX_TABLE, false, "click", function(){
				CERN_NEW_ORDER_ENTRY_O1.LaunchDxTable(component);
			});
			component.addMenuOption("mnuGoToOrders", "mnuGoToOrders" + componentId, noei18n.MODIFY, false, "click", function(){
				CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component, 1);
			});
			component.addMenuOption("mnuSign", "mnuSign" + componentId, noei18n.SIGN, false, "click", function(){
				CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component, 0);
			});
			component.createMenu();
			}
			//Decide what should be the tab mask
			tabMask =  component.isUserFavEnabled() ? 4 : (component.isPublicFavEnabled() ? 320 : 0);
			//Call the base class method for the same request.
			component.m_base.requestRecordData(callback, tabMask);
        },
        RenderComponent: function(replyAr, component){
        	var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
        	try {
        		var i,j,k,l;
        		var recordFavs = replyAr.getResponse();
        		var recordFavsSuccess = replyAr.getStatus();

        		var noei18n = i18n.discernabu.noe_o1;
                var criterion = component.getCriterion();
                var noeHTMLArr = [];
        		var componentId = component.getComponentId();
        		var compNameSpace = component.getStyles().getNameSpace();
                var noeHTML = "";
                var countText = "";                
                var noeBase = component.m_base; 
                
                noeBase.setShowOrderSentenceDetailUserPref(!!recordFavs.FILTER_ORDER_SENTENCES); //Double ! to ensure a boolean is being set, not 1/0
                
        		/* Construct HTML for component and group headings (tabs) */
        		noeHTMLArr.push("<div id='noeContentBody", componentId,"' class='content-body'>");	
        		
        		//setup arrays, mysearch, and values needed for executing scripts
        		var noeMineArr = null;
        		var noePublicArr = null;
        		var venueTypeList = null;
        
				if (recordFavsSuccess) {
					noeBase.setFutureOrderMessagePref(recordFavs.FUTURE_NEW_ORDER);
					noeBase.setDischNewOrderPref(recordFavs.DSCH_NEW_ORDER);
					if(noeBase.getDischNewOrderPref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT){
						component.setVenueType(2);
					}
					//If the FUTURE_NEW_ORDER is set to Reject, do not create the venue. 
					if (noeBase.getFutureOrderMessagePref() !== MPageComponents.NewOrderEntry.NewOrderPref.REJECT) {
						noeMineArr = recordFavs.USER_FAV;
						noePublicArr = recordFavs.PUBLIC_FAV;

						//Orders search settings retrieval
						component.setVirtViewOrders(recordFavs.VIRTVIEWVO);
						component.setVirtViewRxOrders(recordFavs.VIRTVIEWRX);
						component.setPlanFavEnabled(recordFavs.VIEWPLANFAVS);
						component.setDispOnlyProductLevelMeds(recordFavs.VIEWPLORDERS);
						component.setFacilityId(recordFavs.FACILITYID);
						component.setEncntrTypeCd(recordFavs.ENCNTRTYPECD);
						component.setFavoritesSort(recordFavs.FAVORITES_SORT);
						component.setAmbulatoryEnctrGrpFlag(recordFavs.ENCNTR_VENUE_FLAG);
						venueTypeList = recordFavs.VENUE_TYPE_LIST;
						component.setVenueTypeList(venueTypeList);
						//if venue type menu already exists, do not add another one.
						//this situation will occur after the event fires to "refresh" the component
						var venueTypeMenuDiv = _g("noeHdVenueType" + componentId);
						if (!venueTypeMenuDiv && venueTypeList) {
							
							//If the Discharge New Order Preference is set to Reject, just create a label for the single venue and prevent the
							//creation of the fully functional venue.
							if (noeBase.getDischNewOrderPref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT) {
								noeBase.createDisabledVenue(venueTypeList[0]);
								$("#noeHdVenueType" + componentId).addClass('sub-title-disp');
							} else {
								CERN_NEW_ORDER_ENTRY_O1.CreateVenueTypeMenu(componentId, venueTypeList);
							}

						}
					}
				}
                // Construct HTML for "Orders for Signature" section (formerly Scratch Pad)                
                noeHTMLArr.push("</div><div id='noeScratchPadCont", componentId, "' class='sub-sec hidden'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", noei18n.ORDERS_FOR_SIGNATURE, " (<span id='noeScratchPadCount", componentId, "'>0</span>)</span></h3><div id='noeScratchPad", componentId, "' class='sub-sec-content noe-scratch'><span class='res-none'>", noei18n.NO_ORDERS_FOR_SIGNATURE, "</span></div><div class='noe-scr-submit hdr'><input id='btnDx", componentId, "' type='button' class='noe-btn' value='", noei18n.DX_TABLE, "' /><input id='btnModify", componentId, "' type='button' class='noe-btn' value='", noei18n.MODIFY, "' /><input id='btnSign", componentId, "' type='button' class='noe-btn' value='", noei18n.SIGN, "' /></div></div></div>");
                // Finalize HTML and component
                noeHTML = noeHTMLArr.join("");
                MP_Util.Doc.FinalizeComponent(noeHTML, component, countText);
                
                var recordData = replyAr.getResponse();
                
                // ------------------------------------------------------------
				// INITIALIZE BASE COMPONENT
				// ------------------------------------------------------------
        	    noeBase.setRecordData(recordFavs);
        		noeBase.init();
        		CERN_NEW_ORDER_ENTRY_O1.ApplySearchSettings(component);
 
        		//Add the click action to the Dx Table button and the Sign Button
        		var btnDx = _g('btnDx' + componentId);
        		if (btnDx) {
        			Util.addEvent(btnDx, "click", function(){CERN_NEW_ORDER_ENTRY_O1.LaunchDxTable(component);});
        		}
        		//Add the click action to the Modify button
        		var btnModify=_g("btnModify"+componentId);
        		if(btnModify){
        			Util.addEvent(btnModify,"click",function()
        			{
        				// --- Code for Timers 
   						 var slaTimer =MP_Util.CreateTimer("CAP:MPG New Order Entry Modify");				
   						 if (slaTimer) {
   										slaTimer.SubtimerName = noe_mpage;          
   						                slaTimer.Start();
   						                slaTimer.Stop();
   										}
   						 //  ---- Code for Timers
        				CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component,1);});
        		}
        		//Add the click action to the Sign button
        		var btnSign = _g('btnSign' + componentId);
        		if(btnSign) {
        			Util.addEvent(btnSign, "click", function(){CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component, 0);});
        		}
        		//Add the health plan selector to the component
        		component.retrieveHealthPlanSelector();


        	} 
            catch (err) 
			{
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				var errMsg = [];
				if (err instanceof Error) {
					errMsg.push("<b>", i18n.CONTACT_ADMINISTRATOR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li></ul>");
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
				}
				else {
					throw (err);
				}
			}
            finally {
                if (timerRenderComponent) {
                    timerRenderComponent.Stop();
                }
            }
        },
        
        RenderSharedTab: function(component) {
        	 var componentId = component.getComponentId();
        	 var sharedSec = ["<div class='noe-group noe-shared-sec'>"];
             sharedSec.push(MP_Util.CreateAutoSuggestBoxHtml(component,"prsnlSearchCtrl"));
             sharedSec.push("<div id='sharedTabShell",componentId,"' class='noe-plan-group-shared-name'></div>",
             	"<div id='sharedTabHTML", componentId,"' class='noe-plan-group-shared-plans'>",
             	"</div>");
             
             sharedSec.push("</div>");
             
             return sharedSec.join('');
             
        },
        
        CreateSharedTabEvents: function(component, recordData) {
        	var componentId = component.getComponentId();
        	var noei18n = i18n.discernabu.noe_o1;

			MP_Util.AddAutoSuggestControl(component, 
					CERN_NEW_ORDER_ENTRY_O1.Debounce(CERN_NEW_ORDER_ENTRY_O1.SearchPrsnl), 
					CERN_NEW_ORDER_ENTRY_O1.HandlePrsnlSelection, 
					CERN_NEW_ORDER_ENTRY_O1.CreatePrsnlSuggestionLine,
					"prsnlSearchCtrl");		
    		
    		//Add the click action to the PrsnlSearchBox tab
			var prsnlSearchBoxDivId = component.getStyles().getNameSpace() + "prsnlSearchCtrl" + componentId;
    		var prsnlSearchBoxDiv = _g(prsnlSearchBoxDivId);
			
    		if(!prsnlSearchBoxDiv){
    			return;
    		}
    		
    		Util.Style.acss(prsnlSearchBoxDiv, "noe-prsnl-search-default");
			prsnlSearchBoxDiv.value = noei18n.PROVIDER_SEARCH;

			Util.addEvent(prsnlSearchBoxDiv, "focus", function(){
				Util.Style.rcss(prsnlSearchBoxDiv, "noe-prsnl-search-default");
				prsnlSearchBoxDiv.value = "";
				
			});
			Util.addEvent(prsnlSearchBoxDiv, "blur", function(){
				Util.Style.acss(prsnlSearchBoxDiv, "noe-prsnl-search-default");
				prsnlSearchBoxDiv.value = noei18n.PROVIDER_SEARCH;
			});			
    		
        },
        
        RenderPublicTab: function(component, jsonReply) {
        	var noei18n = i18n.discernabu.noe_o1;
        	var publicCnt = 0;
        	var publicSec = ["<div class='noe-group noe-public-sec'>"];
        	var venueType = (component.getVenueType() === 2 ? 1 : 0);
        	var noePublicArr = jsonReply.PUBLIC_FAV;
        	var componentId = component.getComponentId();
        	
            if(noePublicArr){
            	var publicLength = noePublicArr.length;
            	if (publicLength === 0){
                	publicSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
            	}
            	else{
            		var publicChildFavFolder = [];
            		var publicChildFavFolderItems = [];
            		var publicSecondaryFavFolder = [];
                	for (i = 0; i < publicLength; i++) {                    
                		var noePublicObj = noePublicArr[i];
                		
                		//account for multiple favorite folders per venue
                		//Only display folder path once
                		if (i === 0){
    	            		publicSec.push("<div id='rootPublic",componentId,"' class='noe-fav-path hdr'><dl id='folderPathPublic",componentId,"' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span id='folderPathPublicRoot", componentId, "'>",noePublicObj.SHORT_DESCRIPTION,"</span></dd></dl></div>",
    	            			"<div id='folderContentsPublic",componentId,"'>");
    	            		        	            		
    	            		//Create the rest of the folders/orders/caresets/PowerPlans
    	            		noeItemArr = noePublicObj.CHILD_LIST;
    	            		for (j = 0, k = noeItemArr.length; j < k; j++) {
    	            			noeItem = noeItemArr[j];
    	            			noeRow = [];
    	    		            noeType = noeItem.LIST_TYPE;
    	    		            switch(noeType){
    	    						case 1: //Favorite Folder
    	    							publicCnt++;
    	    	        				noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsFolderRow", publicCnt,"' class='noe-info noe-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID,"\", \"", componentId,"\", \"Public\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    	    	        				publicChildFavFolder = publicChildFavFolder.concat(noeRow);     
    	    							break;
    	    						case 2: //Order Synonym
    	    							publicCnt++;
    	    							if (noeItem.ORDERABLE_TYPE_FLAG === 6){
    	    								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsOrderRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-public'><button type='button' id='", "Public", componentId,"favsOrderRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 1)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
    	    							}
    	    							else{
    	    								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsOrderRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID,"' data-cki='", noeItem.CKI, "' class='noe-info' sort='orderable-public'><button type='button' id='", "Public", componentId,"favsOrderRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 0)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    	    							}
    	    							publicChildFavFolderItems = publicChildFavFolderItems.concat(noeRow); 
    	    							break;
    	    						case 3: //Home Health Problem
    	    							break;
    	    						case 4: //Reference Task
    	    							break;
    	    						case 5: //IV Favorites
    	    							break;
    	    						case 6: //PowerPlan
    	    							publicCnt++;
    	    							noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsPlanRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-public'><button type='button' id='", "Public", componentId,"favsPlanRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>",noeItem.PW_CAT_SYN_NAME,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
    	    							publicChildFavFolderItems = publicChildFavFolderItems.concat(noeRow); 
    	    							break;
    	    						case 7: //Regimen Synonym
    	    							break;	
    	    					}
    	    	        	}
                		}
                		else{
                			publicCnt++;
    	    				if (noePublicObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noePublicObj.SOURCE_COMPONENT_FLAG === 2 || noePublicObj.SOURCE_COMPONENT_FLAG === 3)){
    	    					folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
    	    					publicSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsFolderRow", publicCnt,"' class='noe-info noe-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noePublicObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Public\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noePublicObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    	    				}
    	    				else{
    	    					publicSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId,"favsFolderRow", publicCnt,"' class='noe-info noe-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noePublicObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Public\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noePublicObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noePublicObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    	    				}
                		}
                	}
                    if (!publicCnt) {
                        publicSec.push("<span class='res-none'>", (noePublicArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
                    }
                    else{
                		//add items in sorted order
                    	publicSec = publicSec.concat(publicChildFavFolder, publicSecondaryFavFolder, publicChildFavFolderItems);
                    }
                    publicSec.push("</div>"); //ends <div id='folderContentsPublic",componentId,"'>
            	}
            }
            
            return publicSec.join("");
        	
        },
        
        CreatePublicTabEvents: function(component, recordData) {
        	var componentId = component.getComponentId();
        	var publicFolderPathId = 'folderPathPublic' + componentId;
    		var publicFolderPath = _g(publicFolderPathId);
        	
    		if(publicFolderPath){
    			Util.addEvent(publicFolderPath, "click", 
    				function(e){
            			var folder = e.target || e.srcElement;
            			var folderId = Util.gps(Util.gp(folder));
            			if (folderId.innerHTML != "-1"){
            				CERN_NEW_ORDER_ENTRY_O1.DisplaySelectedFolder(component,folderId.innerHTML,"Public");
            			}
    				}
    			);
    		}
    		
    		if(component.getFavoritesSort()){
        		CERN_NEW_ORDER_ENTRY_O1.ApplySortToFavorites(componentId, "Shared");
    		}
    		
    		// applies scrolling
			var publicCnt = recordData.PUBLIC_FAV.length ? recordData.PUBLIC_FAV[0].CHILD_LIST.length : 0;
    		var mineCnt = recordData.USER_FAV.length ? recordData.USER_FAV[0].CHILD_LIST.length : 0;
    		CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, mineCnt, publicCnt);
        },
        
        RenderMineTab: function(component, jsonReply) {
        	var venueType = (component.getVenueType() === 2 ? 1 : 0);
        	var isAmbulatoryEncntr = component.isAmbulatoryEnctrGrpFLag();
        	var isDischargeAsRxVenue = (venueType && (!isAmbulatoryEncntr));
        	var noeMineArr = jsonReply.USER_FAV;
        	var componentId = component.getComponentId();
        	var mineSec = ["<div class='noe-group noe-mine-sec'>"];
        	var mineCnt = 0;
        	var noei18n = i18n.discernabu.noe_o1;
			var mineMyFavPlansFolder = [];
			if (component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()) {
				//create My Favorite Plans hardcoded folder
				mineCnt++;
				mineMyFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='",  "Mine", componentId, "favsFolderRow", mineCnt, "' class='noe-info noe-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
			}
			
            if(!noeMineArr){
            	return;
            }
            
        	var mineLength = noeMineArr.length;
        	if (mineLength+mineMyFavPlansFolder.length === 0){
        		mineSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
        		return;
        	}
        	
            var mineChildFavFolder = [];
            var mineChildFavFolderItems = [];
            var mineSecondaryFavFolder = [];
        	for (var i = 0; i < mineLength; i++) {                 
        		var noeFavsObj = noeMineArr[i];
        		//account for multiple favorite folders per venue
        		//Only display folder path and My Plan Favorites folder once
        		if (i === 0){
            		mineSec.push("<div id='rootMine",componentId,"' class='noe-fav-path hdr'><dl id='folderPathMine",componentId,"' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span id='folderPathMineRoot", componentId, "'>",noeFavsObj.SHORT_DESCRIPTION,"</span></dd></dl></div>",
            			"<div id='folderContentsMine",componentId,"'>");							
    				//Create the rest of the folders/orders/caresets/PowerPlans
            		noeItemArr = noeFavsObj.CHILD_LIST;
            		for (j = 0, k = noeItemArr.length; j < k; j++) {
            			noeItem = noeItemArr[j];
            			noeRow = [];
    		            noeType = noeItem.LIST_TYPE;
    		            switch(noeType){
    						case 1: //Favorite Folder
    							mineCnt++;
    	        				noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID,"\", \"", componentId,"\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    	        				mineChildFavFolder = mineChildFavFolder.concat(noeRow);     
    							break;
    						case 2: //Order Synonym
    							mineCnt++;
    							if (noeItem.ORDERABLE_TYPE_FLAG === 6){
    								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-mine'><button type='button' id='", "Mine", componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 1)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-active-icon'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
    							}
    							else{
    								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' data-cki='", noeItem.CKI, "' class='noe-info' sort='orderable-mine'><button type='button' id='", "Mine", componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 0)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-active-icon'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    							}
    							mineChildFavFolderItems = mineChildFavFolderItems.concat(noeRow); 
    							break;
    						case 3: //Home Health Problem
    							break;
    						case 4: //Reference Task
    							break;
    						case 5: //IV Favorites
    							break;
    						case 6: //PowerPlan
    							mineCnt++;
    							noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-mine'><button type='button' id='", "Mine", componentId,"favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-active-icon'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>",noeItem.PW_CAT_SYN_NAME,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
    							mineChildFavFolderItems = mineChildFavFolderItems.concat(noeRow);         							
    							break;
    						case 7: //Regimen Synonym
    							break;	
    					}
    	        	}
        		}
        		else{
        			mineCnt++;
    				if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
    					folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
    					mineSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    				}
    				else{
    					mineSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
    				}
        		}
        	}
            if (!mineCnt) {
                mineSec.push("<span class='res-none'>", (noeMineArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
            }
            else{
        		//add items in sorted order
        		mineSec = mineSec.concat(mineMyFavPlansFolder, mineChildFavFolder, mineSecondaryFavFolder, mineChildFavFolderItems);
            }
            mineSec.push("</div>"); //ends <div id='folderContentsMine",componentId,"'>
            mineSec.push("</div>");
            return mineSec.join("");
        },
        
        CreateMineTabEvents: function(component, recordData) {
        	var componentId = component.getComponentId();
        	
        	var folderPathId = 'folderPathMine' + componentId;
    		var folderPath = _g(folderPathId);
    		if(folderPath){
    			Util.addEvent(folderPath, "click", 
    				function(e){
            			var folder = e.target || e.srcElement;
            			var folderId = Util.gps(Util.gp(folder));
            			if (folderId.innerHTML != "-1"){
                			CERN_NEW_ORDER_ENTRY_O1.DisplaySelectedFolder(component,folderId.innerHTML,"Mine");
            			}
    				}
    			);
    		}
        	
        	if (component.getFavoritesSort()) {
        		CERN_NEW_ORDER_ENTRY_O1.ApplySortToFavorites(componentId, "Mine");
        	}
        	
        	// applies scrolling
			var publicCnt = recordData.PUBLIC_FAV.length ? recordData.PUBLIC_FAV[0].CHILD_LIST.length : 0;
    		var mineCnt = recordData.USER_FAV.length ? recordData.USER_FAV[0].CHILD_LIST.length : 0;
    		CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, mineCnt, publicCnt);
        },
        
        /**
         * Create menu just below component header to allow user to change the venue type
         * @param {int} componentId : Component Id, passed in as an int
         * @param {object} venueTypeList : A list of available venues (only discharge and inpatient),
         * 		pulled from the code set
         */
        CreateVenueTypeMenu:function(componentId, venueTypeList){
        	var noei18n = i18n.discernabu.noe_o1;
        	//get component object
        	var intComponentId = parseInt(componentId, 10);
        	var component = MP_Util.GetCompObjById(intComponentId);
        	if (!component){
        		component = MP_Util.GetCompObjById(componentId);
        	}
        	var venueType = component.getVenueType();
        	var style = component.getStyles();
        	var ns = style.getNameSpace();
        	var compId = style.getId();
        	var loc = component.getCriterion().static_content;
        	var mnuId = compId + "Mnu";
            var m_contentNode = component.getRootComponentNode();
            if (m_contentNode){
                var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
        		var mnuDisplay = "";	//currently selected menu option display
        		var mnuVenueType = 0;	//currently selected menu option venue type
        		var mnuNextDisplay = "";//next menu option display
        		var mnuNextVenueType = 0;//next menu option venue type
        		var x;
        		var xl;
        		var newVenue;
        		if (venueType === 1){//Inpatient or Ambulatory Encounter (venue type = 1 or 3)
        			for (x = 0, xl = venueTypeList.length; x < xl; x++){
        				newVenue = venueTypeList[x];
        				if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2){
        					//set next menu options
        					mnuNextDisplay = newVenue.DISPLAY;
        					mnuNextVenueType = 2;
        				}
        				else{
        					//set currently selected menu option
        					mnuDisplay = newVenue.DISPLAY;
        					mnuVenueType = 1;
        				}
        			}
        		}
        		else{ //Discharge Encounter (venue type = 2)
        			for (x = 0, xl = venueTypeList.length; x < xl; x++){
        				newVenue = venueTypeList[x];
        				if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2){
        					//set currently selected menu option
        					mnuDisplay = newVenue.DISPLAY;
        					mnuVenueType = 2;
        				}
        				else{
        					//set next menu options
        					mnuNextDisplay = newVenue.DISPLAY;
        					mnuNextVenueType = 1;
        				}
        			}
        		}
        	    var arr = [];
        	    arr.push("<div id='lb",mnuId,"'><div id='stt", compId,"' class='sub-title-disp'>",
        	    	"<span id='lbMnuDisplay",componentId,"' class='noe-drop-down' title='",noei18n.CHANGE_VENUE_TYPE,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',compId,"\");'>",mnuDisplay," </span><span class='noe-drop-down noe-venue-type-link' title='",noei18n.CHANGE_VENUE_TYPE,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',compId,"\");'></span><span id='cf",componentId,"msg' class='filter-applied-msg' title=''></span>",
        	    	"<div id='", compId,"HealthPlanWrapper' class='noe-healthplan-selector'></div></div>",
        	    	"<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='mnu-labelbox'>",mnuDisplay,"</div><div class='mnu-contentbox'>",
        			"<div><span class='lb-mnu' id='lb",compId,"2","' onclick='CERN_NEW_ORDER_ENTRY_O1.ChangeVenueType(\"",componentId,"\", \"", mnuDisplay,"\", \"", mnuVenueType,"\", \"", mnuNextDisplay,"\", \"", mnuNextVenueType,"\");'>", mnuNextDisplay, "</span></div>",
        			"</div></div></div>");
        	    var venueTypeDiv = Util.cep("span", {
        	        "className": "noe-venue-type-hdr",
        	        "id": "noeHdVenueType" + componentId
        	    });
        	    Util.ia(venueTypeDiv, m_contentNodeHd);
        	    var venueTypeDivHTML = arr.join("");
        	    $('#noeHdVenueType' + componentId).html(venueTypeDivHTML);
            }
        },
        /**
         * This function gets called when a user changes the venue in the venue type menu 
         * @param {string} componentId : Component Id, passed in as a string
         * @param {string} oldVenueDisplay : The previously selected venue type display, passed in as a string
         * @param {string} oldVenueType : The previously selected venue type, passed in as a string
         * @param {string} newVenueDisplay : The newly selected venue type display, passed in as a string
         * @param {string} newVenueType : The newly selected venue type, passed in as a string
         */
        ChangeVenueType:function(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType){
        	//get component object
        	var intComponentId = parseInt(componentId, 10);
        	var component = MP_Util.GetCompObjById(intComponentId);
        	if (!component){
        		component = MP_Util.GetCompObjById(componentId);
        	}
            if (newVenueType == 2){
                component.setVenueType(newVenueType);
            }
            else{
            	component.setVenueType();
            }
            //Toggle Venue Type menu selection
        	CERN_NEW_ORDER_ENTRY_O1.ToggleVenueTypeMenu(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType);
        	//re-apply search settings for My Search
        	CERN_NEW_ORDER_ENTRY_O1.ApplySearchSettings(component);
        	component.m_base.onVenueChange();
        	
        },
        /**
         * This function toggles the venue type menu between selected venues 
         * @param {string} componentId : Component Id, passed in as a string
         * @param {string} oldVenueDisplay : The previously selected venue type display, passed in as a string
         * @param {string} oldVenueType : The previously selected venue type, passed in as a string
         * @param {string} newVenueDisplay : The newly selected venue type display, passed in as a string
         * @param {string} newVenueType : The newly selected venue type, passed in as a string
         */
        ToggleVenueTypeMenu:function(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType){
        	var noei18n = i18n.discernabu.noe_o1;
        	var venueTypeDiv = _g("noeHdVenueType" + componentId);
        	if (venueTypeDiv){
            	//get component object
            	var intComponentId = parseInt(componentId, 10);
            	var component = MP_Util.GetCompObjById(intComponentId);
            	if (!component){
            		component = MP_Util.GetCompObjById(componentId);
            	}
        		var style = component.getStyles();
        		var ns = style.getNameSpace();
        		var compId = style.getId();
        		var loc = component.getCriterion().static_content;
        		var mnuId = compId + "Mnu";
				var venueTypeElement = $("#lbMnuDisplay" + componentId);
				var venueSelectElement = $("#" + mnuId);
				var venueTypeHtml = "<span id='lbMnuDisplay" + componentId +"' class='noe-drop-down' title='" + noei18n.CHANGE_VENUE_TYPE + "' onclick='MP_Util.LaunchMenu(\"" + mnuId + '", "' + compId + "\");'>" +newVenueDisplay +" </span>";
				var venueSelectHtml = "<div class='mnu-labelbox'>" + newVenueDisplay + "</div><div class='mnu-contentbox'>" + 
        			"<div><span class='lb-mnu' id='lb" + compId + "2" + "' onclick='CERN_NEW_ORDER_ENTRY_O1.ChangeVenueType(\"" + componentId + "\", \"" +  newVenueDisplay + "\", \"" +  newVenueType + "\", \"" + oldVenueDisplay + "\", \"" + oldVenueType + "\");'>" + oldVenueDisplay +  "</span></div>" +
        			"</div>";
        		venueTypeElement.replaceWith(venueTypeHtml);
        		venueSelectElement.html(venueSelectHtml);
        	}	
        },
        /**
         * When a folder is selected from the folder path, this will display that folder's contents, 
         * 		within any tab (Mine, Public, or Shared)
         * @param {object} component : The new order entry component
         * @param {int} folderId : Folder Id, passed in as an int
         * @param {string} tabName : The name of the tab (Freq, Mine, Public, or Shared)
         * @param {int} personnelId : The Personnel Id, passed in as an int
         * @param {int} personnelPosCd : The Personnel Position Cd, passed in as an int
         */
        DisplaySelectedFolder:function(component,folderId,tabName,personnelId,personnelPosCd){
        	var noei18n = i18n.discernabu.noe_o1;
        	var i,l;
        	var componentId = component.getComponentId();
			var venueType = component.getVenueType();
        	var folderPathObj = _g("root" + tabName + componentId);
            var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
            var curList = folderPath[0];
        	var curItem = _gbt("DT", curList);
            var curItemData = _gbt("DD", curList);

            //find index of folder id
            var locatedIdIndex = null;
        	for (i = 0, l = curItem.length; i < l; i++){
        		if (curItem[i].innerHTML == folderId){
        			locatedIdIndex = i;
        		}
        	}

        	//delete all folder names and ids that are after selected folder
        	if (locatedIdIndex !== null){
        		for (i = curItem.length; i--;){
        			var deleteId = curItem[i];
        			if (locatedIdIndex < i){
        			    Util.de(deleteId);
        			}
        		}
        		for (i = curItemData.length; i--;){
        			var deleteFolder = curItemData[i];
        			if (locatedIdIndex < i){
        			    Util.de(deleteFolder);
        			}
        		}
        		if (locatedIdIndex > 3){

        			Util.Style.acss(curItemData[locatedIdIndex-1],"noe-fav-separator");
        			Util.Style.rcss(curItemData[locatedIdIndex-1],"hidden");
            		Util.Style.acss(curItemData[locatedIdIndex-2],"noe-fav-folder");
        			Util.Style.rcss(curItemData[locatedIdIndex-2],"hidden");
        		}
        		
        		var prevFolderContent = _g("folderContents" + tabName + componentId);
        		if (prevFolderContent){
        			prevFolderContent.innerHTML = "";
        			prevFolderContent.style.overflowY = "auto";
        			Util.Style.acss(prevFolderContent,"noe-preloader-icon");
        		}

        		var criterion = component.getCriterion();
        		var virtualViewMask,orderMask,sendAr;
        		var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
        	    folderRequest.setProgramName("mp_get_powerorder_favs_json");
        	    folderRequest.setAsync(true);
        		//only situation where folderId == -10 is for hard coded My Plan Favorites folder in Mine and Shared tabs
        		if (folderId == -10 && tabName !== "Public"){
        			virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
        			var sharedPlanMask  = 32;
        			orderMask =  virtualViewMask + sharedPlanMask;
        			switch(tabName){
        				case"Mine":
                			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
                		    folderRequest.setParameters(sendAr);
                			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadMyFavPlansFolder(reply, tabName);});
        					break;
        				case"Shared":
        					sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
                		    folderRequest.setParameters(sendAr);
        					MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadMyFavPlansFolder(reply, tabName);});
        					break;	
        			}
        		}
        		else{
        			virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
        			var orderSearchMask = 4;
        			var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
        			var productLevelMask = 0;
        			if (venueType === 1){//inpatient
        				component.setDispOnlyProductLevelMeds(0);
        				productLevelMask = 0;
        			}
        			else{ //ambulatory/discharge
        				component.setDispOnlyProductLevelMeds(1);
        				productLevelMask = 16;
        			}

        			var publicMask = 64;
        			orderMask = virtualViewMask + orderSearchMask + planSearchMask + productLevelMask;
        			switch(tabName){
        				case"Mine":
                			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];			
                		    folderRequest.setParameters(sendAr);
                		    MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName);});
        					break;
        				case"Public":
        					orderMask =  orderMask + publicMask;
                			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];			
                		    folderRequest.setParameters(sendAr);
        					MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName);});
        					break;
        				case"Shared":
                			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];			
                		    folderRequest.setParameters(sendAr);
                			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName, personnelId, personnelPosCd);});
                			break;	
        			}
        		}
        	}
        },
        /**
         * When a folder is selected from the list of folders below the folder path, this will  
         * 		handle all UI actions and calling the script to load that folder's contents,
         *  	within any tab (Mine, Public, or Shared)
         * @param {node} folder : The selected folder node
         * @param {int} folderId : Folder Id, passed in as an int
         * @param {int} componentId : Component Id, passed in as an int
         * @param {string} tabName : The name of the tab (Freq, Mine, Public, or Shared)
         * @param {int} personnelId : The Personnel Id, passed in as an int
         * @param {int} personnelPosCd : The Personnel Position Cd, passed in as an int
         */
        DisplayNextFolder:function(folder, folderId, componentId, tabName, personnelId, personnelPosCd){
        	var noei18n = i18n.discernabu.noe_o1;
        	var curFolderData = _gbt("DD", folder);
            var curName = curFolderData[0];
            var curNameDisp = curName.innerHTML;
            var isMyPlanFavFolder = false;
        	
			//get component object
        	var intComponentId = parseInt(componentId, 10);
        	var component = MP_Util.GetCompObjById(intComponentId);
        	if (!component){
        		component = MP_Util.GetCompObjById(componentId);
        	}

            //grab all folder names and ids in DOM of component
            var folderPathObj = _g("root" + tabName + componentId);
            var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
            var curList = folderPath[0];
        	var curItem = _gbt("DT", curList);
            var curItemData = _gbt("DD", curList);
            var lastId = curItem[curItem.length-1];
            var lastFolder = curItemData[curItemData.length-1];
            
            var pathLength = curItemData.length;
            var separator = "...";
            
            if (folderId == -10 && component.isPlanFavEnabled()){
            	isMyPlanFavFolder = true; //value used in DisplaySelectedFolder
            }
            else{
            	if (pathLength !== 1){
                	separator = ">";
                }

                if (pathLength > 4){
                    for (var j = pathLength - 1; j--;) {
                    	if (j > 1){
                    		if (curItem[j].innerHTML == "-1"){
                    			Util.Style.acss(curItemData[j],"hidden");
                        		Util.Style.rcss(curItemData[j],"noe-fav-separator");
                    		}
                    		else{
                        		Util.Style.acss(curItemData[j],"hidden");
                        		Util.Style.rcss(curItemData[j],"noe-fav-folder");
                    		}
                    	}
                    }
                }
            }
            
            //create four new nodes for the folder id, folder name, separator id, and separator
            var newFolderId = Util.cep("DT", {"className": "hidden", "innerHTML": folderId});
            var newFolder = Util.cep("DD", {"className": "noe-fav-folder", "innerHTML": "<span>" + curNameDisp + "</span>"});
            var newSeparatorId = Util.cep("DT", {"className": "hidden", "innerHTML": "-1"});
            var newSeparator = Util.cep("DD", {"className": "noe-fav-separator", "innerHTML": "<span>" + separator + "</span>"});
            //add four new nodes to DOM
            Util.ia(newSeparatorId,lastFolder);
            Util.ia(newSeparator,newSeparatorId);
            Util.ia(newFolderId,newSeparator);
            Util.ia(newFolder,newFolderId);          
            
        	var prevFolderContent = _g("folderContents" + tabName + componentId);
        	if (prevFolderContent){
        		prevFolderContent.innerHTML = "";
        		prevFolderContent.style.overflowY = "auto";
        		Util.Style.acss(prevFolderContent,"noe-preloader-icon");
        	}

        	if (component){	
        		var criterion = component.getCriterion();
        		var virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
        		var orderSearchMask = 4;
        		var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
        		var venueType = component.getVenueType();
        		var productLevelMask = 0;
        		if (venueType === 1){//inpatient
        			component.setDispOnlyProductLevelMeds(0);
        			productLevelMask = 0;
        		}
        		else{ //ambulatory/discharge
        			component.setDispOnlyProductLevelMeds(1);
        			productLevelMask = 16;
        		}
        		var sharedPlanMask = 32;
        		var orderMask =  (isMyPlanFavFolder ? virtualViewMask + sharedPlanMask : virtualViewMask + orderSearchMask + planSearchMask + productLevelMask);
        	    var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
        	    folderRequest.setProgramName("mp_get_powerorder_favs_json");
        	    folderRequest.setAsync(true);
        	    var sendAr;
        		switch(tabName){
        			case"Mine":
            			sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
                	    folderRequest.setParameters(sendAr);
                	    if (isMyPlanFavFolder){
                	    	MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadMyFavPlansFolder(reply, tabName);});
        	    		}
        	    		else{
        	    			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName);});
        	    		}
                	    break;
        			case"Public":
            			var publicMask = 64;
            			orderMask =  orderMask + publicMask;
                		sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
                	    folderRequest.setParameters(sendAr);
                		MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName);});
        				break;
        			case"Shared":
        	    		sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
        	    	    folderRequest.setParameters(sendAr);
        	    		if (isMyPlanFavFolder){
        	    			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadMyFavPlansFolder(reply, tabName);});
        	    		}
        	    		else{
        	    			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadFolder(reply, tabName, personnelId, personnelPosCd);});
        	    		}
        	    	    break;	
        		}
        	}
        },
        /**
         * This gets called by DisplaySelectedFolder or DisplayNextFolder and is used to  
         * 		load a selected folder's contents,
         *  	within any tab (Mine, Public, or Shared)
         * @param {object} reply : A XMLCCLRequest Script Reply
         * @param {string} tabName : The name of the tab (Freq, Mine, Public, or Shared)
         * @param {int} personnelId : The Personnel Id, passed in as an int
         * @param {int} personnelPosCd : The Personnel Position Cd, passed in as an int
         */
        LoadFolder:function(reply, tabName, personnelId, personnelPosCd){
				var jsonReply = reply.getResponse();
				var repStatus = reply.getStatus();
				var folderHTML;
				var noeArr = null;
				if (jsonReply && repStatus !== "F"){
					switch(tabName){
						case"Mine":
							if (jsonReply.USER_FAV){
								noeArr = jsonReply.USER_FAV;
							}
							break;
						case"Public":
							if (jsonReply.PUBLIC_FAV){
								noeArr = jsonReply.PUBLIC_FAV;
							}
							break;
						case"Shared":
							if (jsonReply.USER_FAV){
								noeArr = jsonReply.USER_FAV;
							}
							break;	
						}
				}
				var noei18n = i18n.discernabu.noe_o1;
				var component = reply.getComponent();
				var componentId = component.getComponentId();
				var venueType = ( component.getVenueType() === 2 ? 1 : 0 );
				var tabNameClass = tabName.toLowerCase();
				var prevFolderContent = _g("folderContents" + tabName + componentId);
				if (prevFolderContent && repStatus !== "F") {
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
				var mineSec = ["<div class='noe-group noe-",tabNameClass,"-sec'>"];
				var myFavPlansFolder = [];
				var childFavFolder = [];
				var childFavFolderItems = [];
				var secondaryFavFolder = [];
					var mineCnt = 0;
				if(noeArr){
					//grab all folder names and ids in DOM of component
					var folderPathObj = _g("root" + tabName + componentId);
					var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
					var curList = folderPath[0];
					var curItem = _gbt("DT", curList);
					for (var i = 0, l = noeArr.length; i < l; i++) {
						var noeFavsObj = noeArr[i];
				 		//if curItem.length of one, that means we are at the root level. We need to rename the root level folder name in case the venue has been modified
						//only need to do it once so check if i === 0
				 		if (i === 0 && curItem.length === 1 && tabName !== "Shared"){
				 			var folderPatheTabRoot = _g("folderPath" + tabName + "Root" + componentId);
							if (folderPatheTabRoot){
								folderPatheTabRoot.innerHTML = noeFavsObj.SHORT_DESCRIPTION;
							}
						}
						//if length of one, that means we are at the root level and we need to add hardcoded My Plan Favorites folder
						if (i === 0 && curItem.length === 1 && tabName !== "Public" && component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()){
							//create My Favorite Plans hardcoded folder
							mineCnt++;
							if (tabName === "Shared"){
								myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, ","-10",", \"", componentId,"\", \"",tabName,"\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
							}
							else{//it is "Mine"
								myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, ","-10",", \"", componentId,"\", \"",tabName,"\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
							}
						}
						if (i === 0) {
							var noeItemArr = noeFavsObj.CHILD_LIST;

							for (var j = 0, k = noeItemArr.length; j < k; j++) {
								var noeItem = noeItemArr[j];
								var noeRow = [];
								var noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1: //Favorite Folder
										mineCnt++;
										if (tabName === "Shared"){
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										else{
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID,"\", \"", componentId,"\", \"",tabName,"\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										childFavFolder = childFavFolder.concat(noeRow);
										break;
									case 2: //Order Synonym
										mineCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6){
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-", tabNameClass,"'><button type='button' id='", tabName, componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 1)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "Mine" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else{
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' data-cki='", noeItem.CKI,"' class='noe-info' sort='orderable-", tabNameClass,"'><button type='button' id='", tabName, componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 0)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "Mine" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										childFavFolderItems = childFavFolderItems.concat(noeRow); 
										break;
									case 3: //Home Health Problem
										break;
									case 4: //Reference Task
										break;
									case 5: //IV Favorites
										break;
									case 6: //PowerPlan
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-", tabNameClass,"'><button type='button' id='", tabName, componentId,"favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "Mine" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>",noeItem.PW_CAT_SYN_NAME,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										childFavFolderItems = childFavFolderItems.concat(noeRow);
										break;
									case 7: //Regimen Synonym
										break;	
								}
							}
						}
						else {
							mineCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
								var folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
								if (tabName === "Shared"){
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else if (tabName === "Public"){
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Public\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else{
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
							}
							else{
								if (tabName === "Shared"){
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else if (tabName === "Public"){
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Public\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else{
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Mine\")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
							}
						}
					}
				}
				//add items in sorted order
				mineSec = mineSec.concat(myFavPlansFolder, childFavFolder, secondaryFavFolder, childFavFolderItems);

				if (!mineCnt){
					mineSec.push("<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>");
				}
				mineSec.push("</div>");
				folderHTML = mineSec.join("");
				prevFolderContent.innerHTML = folderHTML;

				//Apply component scrolling for chosen tab after folder has loaded
				switch(tabName){
					case"Mine":
						CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, mineCnt, null, null);
						break;
					case"Public":
						CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, null, mineCnt, null);
						break;
					case"Shared":
						CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, null, null, mineCnt);
						break;	
				}
				var currentTabElement = component.m_base.getTabGroup();
				component.m_base.renderFormularyInfo(component.getUid(), noeArr, tabName.toLowerCase());

				//Apply alphabetical sort to this tab
				if(component.getFavoritesSort()){
					if (tabName !== "Public"){
						CERN_NEW_ORDER_ENTRY_O1.ApplySortToFavorites(componentId, tabName);	
					}
				}
			}
			//TODO: Probably modify this. Sometimes we get a random script failure. Immediately re-loading the folder usually makes it work.
			else if ((prevFolderContent && repStatus === "F") || !noeArr) {
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
				var i18nCore = i18n.discernabu;
				var errMsg = [];
				errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
				folderHTML = errMsg.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
		},
        /**
         * This gets called by ReturnMoreSearchOrders and loads 50 results into the searchResults tab
         * @param {object} reply : A XMLCCLRequest Script Reply
         * @param {object} component : The new order entry component
         */
        LoadSearchResults:function(reply, component){
   			
   			var componentId = component.getComponentId();
   			var compBodyId = "noeContentBody" + componentId;
        	var tabId = "mineTab" + componentId;
        	
        	var segControlTab = _g(tabId);
			var segmentedControl = null;
			var segmentedControlTabs = null;
			if (segControlTab) {
	        	segmentedControl = Util.gp(segControlTab);
		        	if (segmentedControl) {
		            	segmentedControlTabs = Util.gcs(segmentedControl);
		        	}
			}

			var segCtrlLength = 0;
			if (segmentedControlTabs) {
				segCtrlLength  = segmentedControlTabs.length;
			}

        	//Deselect active tab and make searchResults tab active
        	// Remove selected from all classes and replace with inactive
        	for (var k = segCtrlLength; k--; ) {
        		var segCtrlTabDivs = Util.gcs(segmentedControlTabs[k]);
        		var segCtrlTabDivsLength = segCtrlTabDivs.length;
        		for (var j = segCtrlTabDivsLength; j--; ) {
        			var className = segCtrlTabDivs[j].className.replace("selected","inactive");
        			segCtrlTabDivs[j].className = className;
        		}
        	}
        	
        	var compBody = _g(compBodyId);
        	var filterName = "noe-search-results-filter";
        	
        	// Apply the filter to the component body
        	if (compBody) {
        		compBody.className = "content-body " + filterName;
        	}
            
            //Set up reply for pulling in results into new div
        	var repStatus = reply.RESULTS.STATUS_DATA.STATUS;
        	var noeArr = reply.RESULTS.ORDERS.concat(reply.RESULTS.PLANS);
        	var tabName = "SearchResults";

        	var noei18n = i18n.discernabu.noe_o1;
        	var tabNameClass = tabName.toLowerCase();
        	
        	//Set up header
        	var searchHeader = _g("searchHeader" + componentId);
			
			if (!searchHeader) {
				return;
			}//Do not try to modify DOM element that doesn't exist
			var headerStr = ["<div class='noe-base-sub-sec-title sub-sec-title left'>"];
			var venueType = ( component.getVenueType() === 2 ? 1 : 0 );
			var searchCnt = 0;
			var searchSec = ["<div>"];
        	var searchResultItems = [];
        	var searchContent = _g("folderContents" + tabName + componentId);
			var isOrderSentenceRestrictionsViewable = component.m_base.getShowOrderSentenceDetailUserPref();
			var ordersContainDemographicInformation = !!reply.RESULTS.RESULTS_FILTERED_IND;
        	if (searchContent && repStatus !== "F") {
        		Util.Style.rcss(searchContent,"noe-preloader-icon");
         		
         		//Create header title
         		headerStr.push(noeArr.length, " ", noei18n.RESULTS_HEADER, "</div>", "<div id='noe-base-checkBox-container" + componentId + "' class='noe-base-sub-sec-title sub-sec-title right hidden'><input type='checkbox' class='noe-base-filters-toggle' id='noe-base-filters-toggle" + componentId + "'");
         		if (component.m_base.getOrderSentencesEnabled()) {
				headerStr.push(" checked='checked'");
			}
			headerStr.push(">", noei18n.FILTERS, "</div>");
         		//Cycle through all results pulled back and add to new div
         		for (var i = 0, l = noeArr.length; i < l; i++) {
         			
         			var noeItem = noeArr[i];
				var ageInfo = (noeItem.AGEINFORMATION && noeItem.AGEINFORMATION.length) ? noeItem.AGEINFORMATION[0] : null;
				var weightInfo = (noeItem.WEIGHTINFORMATION && noeItem.WEIGHTINFORMATION.length) ? noeItem.WEIGHTINFORMATION[0] : null;
				var pmaInfo = (noeItem.PMAINFORMATION && noeItem.PMAINFORMATION.length) ? noeItem.PMAINFORMATION[0] : null;
	     			var noeRow = [];
				var orderDetailSentences = [];
				var hasDemographicInformation = (ageInfo || weightInfo || pmaInfo);

				if(hasDemographicInformation) {
	     			if (isOrderSentenceRestrictionsViewable) {
						orderDetailSentences = component.m_base.getOrderSentenceDetails(ageInfo, weightInfo, pmaInfo);
					}
					ordersContainDemographicInformation = true;
				}

         			//check to see if this is an order or PowerPlan
					if(noeItem.SYN_ID) //Order or Care set
					{
						searchCnt++;
						if (noeItem.ORDERABLE_TYPE_FLAG === 6) //Care set
						{
							noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId,"searchOrderRow", searchCnt, "Id", noeItem.SYN_ID,"' class='noe-info'><button type='button' id='", tabName, componentId,"searchOrderRow", searchCnt, "BtnId", noeItem.SYN_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 1)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "SearchResults" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, orderDetailSentences.join(" "), "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
						}
						else //Order
						{
							noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId,"searchOrderRow", searchCnt, "Id", noeItem.SYN_ID,"' data-cki='", noeItem.CKI, "' class='noe-info'><button type='button' id='", tabName, componentId,"searchOrderRow", searchCnt, "BtnId", noeItem.SYN_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 0)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "SearchResults" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, orderDetailSentences.join(" "), "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
					}
					if(noeItem.PATH_CAT_SYN_ID) //PowerPlan
					{
						searchCnt++;
						noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId,"searchOrderRow", searchCnt, "Id", noeItem.PATH_CAT_ID,"' class='noe-info'><button type='button' id='", tabName, componentId,"searchPlanRow", searchCnt, "BtnId", noeItem.PATH_CAT_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "SearchResults" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
					}
         			
	     			searchResultItems = searchResultItems.concat(noeRow);

	            }
    		}
    		//add items in sorted order
    		searchSec = searchSec.concat(searchResultItems);

    		if (!searchCnt){
    			searchSec.push("<span class='res-none'>", noei18n.NO_RESULTS, "</span>");
    		}
    		searchSec.push("</div>");
    		searchHeader.innerHTML = headerStr.join("");
    		searchContent.innerHTML = searchSec.join("");
    		component.m_base.renderFormularySearch(component.getUid(), noeArr);
    		//Apply component scrolling for searchResults tab after search results have loaded
        	CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, null, null, null, searchCnt);

			var searchBox = $("#" + component.m_base.getOrderSearchElementId()).find(".search-box");
			var searchBoxText = searchBox.val();
			var filtersCheckbox = $("#noe-base-filters-toggle" + componentId);

			//Add click event to orderFilter checkbox to trigger event on order searchbar to rerun search without filters
			//on or to alternativly turn them on again. 
			filtersCheckbox.on("click", function(e) {
				searchBox.val(searchBoxText);
				//toggle the orderSentencesEnabled property
				component.m_base.setOrderSentencesEnabled(!filtersCheckbox.attr("checked"));
				CERN_NEW_ORDER_ENTRY_O1.ApplySearchSettings(component);
				searchBox.trigger(jQuery.Event('keyup', {
					keyCode : 13,
					which : 13
				}));
			});

			var tooltip = new MPageTooltip().setShowDelay(1000);
			var checkboxContainer = $("#noe-base-checkBox-container" + componentId);

			//Adding mouseenter event for tooltip hover 
			checkboxContainer.on("mouseenter", function(e) {
				var xPos = e.pageX;
				var yPos = e.pageY;

				tooltip.setX(xPos).setY(yPos).setAnchor(checkboxContainer).setContent(noei18n.FILTERS_TOOLTIP);
				tooltip.show();
			});

			if(ordersContainDemographicInformation) {
				checkboxContainer.removeClass("hidden");
			}
		},
		
        /**
         * This gets called by DisplayNextFolder or DisplaySelectedFolder and is used to  
         * 		load a selected harcoded My Plan Favorites folder's contents,
         *  	within any tab (Mine, Public, or Shared)
         * @param {object} reply : A XMLCCLRequest Script Reply
         * @param {string} tabName : The name of the tab (Freq, Mine, Public, or Shared)
         */
        LoadMyFavPlansFolder:function(reply, tabName){
        	var repStatus = reply.getStatus();
        	var recordCustPlansSuccess = (repStatus !== "F");
        	var tabNameClass = tabName.toLowerCase();
        	var componentId = reply.getComponent().getComponentId();
        	var prevFolderContent = _g("folderContents" + tabName + componentId);
        	var mineSec = ["<div class='noe-group noe-",tabNameClass,"-sec'>"];
        	var folderHTML;
         	if (prevFolderContent){
	        	if(recordCustPlansSuccess){
	        		var jsonReply = reply.getResponse();
	        		var noeCustPlansArr = jsonReply.CUSTOMIZED_PLANS;
	            	var noei18n = i18n.discernabu.noe_o1;
	            	var venueType = ( reply.getComponent().getVenueType() === 2 ? 1 : 0 );
	            	
	        		Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
	        		var minePlanCnt = 0;
	        		if(noeCustPlansArr){
	                	for (var i = 0, l = noeCustPlansArr.length; i < l; i++) {
	                		var noeItem = noeCustPlansArr[i];
	                		var noeRow = [];
	        				minePlanCnt++;
	    					noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId,"favsPlanRow", minePlanCnt, "Id", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID, "' class='noe-info'><button type='button' id='", tabName, componentId,"favsPlanRow", minePlanCnt, "BtnId", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID, "' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='",(tabName === "Mine" ? "noe-fav-star-active-icon" : "noe-fav-star-disabled-icon"),"'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.NAME, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>",noeItem.PW_CAT_DISPLAY,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATHWAY_CATALOG_ID, ".0|", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>2</dd></dl>");
	        				mineSec = mineSec.concat(noeRow); 
	                	}
	        		}
	        		mineSec.push("</div>");
	        		if (minePlanCnt === 0){
	        			var emptySec = ["<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>"];
	        			folderHTML = emptySec.join("");
	        		}
	        		else{
	        			folderHTML = mineSec.join("");
	        		}
	        		prevFolderContent.innerHTML = folderHTML;
	        		
	        		//Apply component scrolling for chosen tab after My Plan Favorites folder has loaded
	        		switch(tabName){
	            		case"Mine":
	            			CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, minePlanCnt, null, null);
	            			break;
	            		case"Shared":
	            			CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, null, null, minePlanCnt);
	                		break;	
	            	}
	        	}
	        	else{
	    			Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
	    			mineSec.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
	    			mineSec.push("</div>");
	    			folderHTML = mineSec.join("");
	    			prevFolderContent.innerHTML = folderHTML;
	        	}
        	}
        },
        /**
         * Select/display the specified tab
         * @param {string} compBodyId : The id of the content-body element
         * @param {int} index : The index of the selected tab
         * @param {string} tabId : The id of the tab clicked by the user
         */
        SelectTab: function(compBodyId, index, tabId){
        	// Retrieve the segmented control
        	var segControlTab = _g(tabId);
        	var segmentedControl = Util.gp(segControlTab);
        	var segmentedControlTabs = Util.gcs(segmentedControl);
        	// Remove selected from all classes and replace with inactive
        	var segCtrlLength = segmentedControlTabs.length;
        	for (var i = segCtrlLength; i--; ) {
        		var segCtrlTabDivs = Util.gcs(segmentedControlTabs[i]);
        		var segCtrlTabDivsLength = segCtrlTabDivs.length;
        		for (var j = segCtrlTabDivsLength; j--; ) {
        			var className = segCtrlTabDivs[j].className.replace("selected","inactive");
        			segCtrlTabDivs[j].className = className;
        		}
        	}
        	// Add selected in place of inactive for selected tab classes
        	var selSegCtrlTabDivs = Util.gcs(segControlTab);
        	var selSegCtrlTabDivsLength = selSegCtrlTabDivs.length;
        	for (var k = selSegCtrlTabDivsLength; k--; ) {
        		var selClassName = selSegCtrlTabDivs[k].className.replace("inactive","selected");
        		selSegCtrlTabDivs[k].className = selClassName;
        	}
        	
        	// Retrieve the component body
        	var compBody = _g(compBodyId);
            var filterName = "";
            // Determine the appropriate filter to apply based on the selected tab
            switch (index) {
            	case 0:
                    filterName = "noe-freq-filter";
                    break;
                case 1:
                    filterName = "noe-mine-filter";
                    break;
                case 2:
                    filterName = "noe-public-filter";
                    break;
                case 3:
                    filterName = "noe-shared-filter";
                    break;
            }
            // Apply the filter to the component body
            compBody.className = "content-body " + filterName;
        },
        /**
         * Select an order, PowerPlan, or Careset favorite from the list and append it to the scratch pad html
         * @param {node} buttonFav : The button of the order favorite clicked by the user
		 * @param {string} componentId : The id of the component, passed in as a string
		 * @param {int} favType : 0:Order; 1:Care Set; 2:PowerPlan
         */
        SelectFav: function(buttonFav, componentId, favType){
            var noei18n = i18n.discernabu.noe_o1;
            var dataObj = null;
            var fav = Util.gp(buttonFav);
            //Grab component object
            var intComponentId = parseInt(componentId, 10);
            var component = MP_Util.GetCompObjById(intComponentId);
            if (!component) {
                component = MP_Util.GetCompObjById(componentId);
            }
            // Ensure the order was not previously selected
            if (fav) {
                // Retrieve relevant information about the selected order
                var favData = _gbt("DD", fav);
                var favName = favData[0].innerHTML;
                var favDisp = favData[1].innerHTML;
                var favParam = favData[2].innerHTML;
                var favOrdSet = favData[3].innerHTML;
                var favPPEvent = null;
                var favPPEventType = null;
                
                if (component.isModalScratchPadEnabled()) {
                    //create scratchpad object
                    var scratchpadObj = {};
                    scratchpadObj.componentId = componentId;
                    scratchpadObj.addedFrom = "NewOrderEntry"; //Location where the favorite was added from
                    scratchpadObj.favId = fav.id; //used when removing items from the scratchpad. should be able to look inside the component and find this id
                    scratchpadObj.favType = favType; //0: Orderable; 1: Careset; 2: PowerPlan
                    scratchpadObj.favName = favName; //Display name of orderable/Careset/PowerPlan
                    scratchpadObj.favOrderSentDisp = favDisp; //Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
                    scratchpadObj.favParam = favParam; //Orderable or Careset: Synonym Id + ".0|" + venueType + "|" + Sentence Id + ".0" | Pharmacy_Ind;  venueType: Inpatient=0, Discharge=1
                    //PowerPlan: PATH_CAT_ID + ".0|" + PATH_CAT_SYN_ID + ".0"
                    scratchpadObj.favSynId = null;
                    scratchpadObj.favVenueType = null;
                    scratchpadObj.favSentId = null;
                    scratchpadObj.favOrdSet = 0;
                    var params = favParam.split("|");
                    if (favType === 2) {
                        scratchpadObj.favSynId = params[0];
                        scratchpadObj.favSentId = params[1];
                        scratchpadObj.favPPEventType = favData[5].innerHTML;//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
                    }
                    else 
                        if (favType === 1) {
                            scratchpadObj.favSynId = params[0];
                            scratchpadObj.favVenueType = params[1];
                            scratchpadObj.favSentId = params[2];
                            scratchpadObj.favOrdSet = 6;
                        }
                        else {
                            scratchpadObj.favSynId = params[0];
                            scratchpadObj.favVenueType = params[1];
                            scratchpadObj.favSentId = params[2];
                            scratchpadObj.displayRxIcon = (parseInt(params[3], 10) === 1 && scratchpadObj.favVenueType === "1") ? 1 : 0;
                        }
                    scratchpadObj.favNomenIds = '""';

                    if (!Util.Style.ccss(fav, "noe-group-selected")) {
                        //add object to scratchpad shared reource
                        dataObj = CERN_NEW_ORDER_ENTRY_O1.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, false);
                        
                        //modify button value in component to display "Remove".
                        if (buttonFav.childNodes[0]) {
                            if (buttonFav.childNodes[0].nodeValue) {
                                buttonFav.childNodes[0].nodeValue = noei18n.REMOVE;
                            }
                        }
                        else 
                            if (buttonFav.value) {
                                buttonFav.value = noei18n.REMOVE;
                            }
                            else {
                                buttonFav.innerHTML = noei18n.REMOVE;
                            }
                        
                        //mark the order as selected
                        Util.Style.acss(fav, "noe-group-selected");
                        
                        //ensure component Id has been added to the pending data shared resource
                        CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId, 1);
                    }
                    else 
                        if (Util.Style.ccss(fav, "noe-group-selected")) {
                            //remove object from scratchpad shared reource
                            dataObj = CERN_NEW_ORDER_ENTRY_O1.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, true);
                            
                            //modify button value in component to display "Order"
                            if (buttonFav.childNodes[0]) {
                                if (buttonFav.childNodes[0].nodeValue) {
                                    buttonFav.childNodes[0].nodeValue = noei18n.ORDER;
                                }
                            }
                            else 
                                if (buttonFav.value) {
                                    buttonFav.value = noei18n.ORDER;
                                }
                                else {
                                    buttonFav.innerHTML = noei18n.ORDER;
                                }
                            
                            //remove the order as selected
                            Util.Style.rcss(fav, "noe-group-selected");
                            
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
                                    CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId, 0);
                                }
                            }
                        }
                }
                //If the modal dialog is not displayed use the traditional attached scratchpad.
                else {
                    var favHTML = [];
                    // Obtain the scratch pad node
                    var scratchPad = _g("noeScratchPad" + componentId);
                    // Obtain the scratch pad container node
                    var scratchPadCont = _g("noeScratchPadCont" + componentId);
                    //Obtain the item count on the scratchpad node
                    var scratchPadCountDiv = _g("noeScratchPadCount" + componentId);
                    if (scratchPad && scratchPadCont && !Util.Style.ccss(fav, "noe-group-selected") && scratchPadCountDiv) {
                        buttonFav.value = noei18n.REMOVE;
                        
                        // Mark the order as selected
                        Util.Style.acss(fav, "noe-group-selected");
                        
                        // Remove the "No orders selected" message
                        var noOrdMsg = Util.Style.g("res-none", scratchPad, "SPAN");
                        if (noOrdMsg) {
                            Util.de(noOrdMsg[0]);
                        }
                        // Create scratch pad entry
                        fav.id = fav.id.toUpperCase(); // necessary for IE8+ compatibility
                        var scratchFav = Util.cep("dl", {
                            "className": "noe-info",
                            "id": "SP" + fav.id
                        });

                        if (favType === 2) { //PowerPlan
                            favPPEvent = favData[4].innerHTML;
                            favPPEventType = favData[5].innerHTML;
							favDisp = (favDisp===""?favDisp:"("+favDisp+")"); //Do not display PLAN_DISPLAY_DESCRIPTION if there isn't one.  I.e. Autosuggest will not return this field.
                            favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"", fav.id, "\", \"", buttonFav.id, "\")'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", noei18n.POWERPLAN_SYS_NAME, ":</dt><dd class='noe-sys-name-disp'>", favDisp,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", noei18n.ORDER_NOMEN, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", favOrdSet, "</dd>", "<dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>", favPPEvent, "</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>", favPPEventType, "</dd>");
                        }
                        else 
                            if (favType === 1) { //Care set
                                favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"", fav.id, "\", \"", buttonFav.id, "\")'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-scr-disp'>", favDisp, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", noei18n.ORDER_NOMEN, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", favOrdSet, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd>");
                            }
                            else {
                                favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"", fav.id, "\", \"", buttonFav.id, "\")'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", favName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-scr-disp'>", favDisp, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", favParam, "</dd><dt>", noei18n.ORDER_NOMEN, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", favOrdSet, "</dd>");
                            }
                        scratchFav.innerHTML = favHTML.join("");
                        
                        // Add entry to the scratch pad
                        Util.ac(scratchFav, scratchPad);
                        //increment items on scratchpad count
                        var oldCount = parseInt(scratchPadCountDiv.innerHTML, 10);
                        var newCount = oldCount + 1;
                        scratchPadCountDiv.innerHTML = newCount;
                        //Unhide scratchpad now that something is being added to it
                        if (scratchPadCont) {
                            Util.Style.rcss(scratchPadCont, "hidden");
                        }
                        CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId, 1);
                    }
                    else 
                        if (fav && scratchPad && scratchPadCont && Util.Style.ccss(fav, "noe-group-selected") && scratchPadCountDiv) {
                            buttonFav.value = noei18n.ORDER;
                            // Remove the order as selected
                            Util.Style.rcss(fav, "noe-group-selected");
                            
                            var scratchPadCnt = parseInt(scratchPadCountDiv.innerHTML, 10);
                            
                            var scratchPadFavId = "sp" + fav.id;
                            var scratchPadFav = _g(scratchPadFavId);
                            if (scratchPadFav) {
                                Util.de(scratchPadFav);
                                //decrement items on scratchpad count
                                scratchPadCnt--;
                                scratchPadCountDiv.innerHTML = scratchPadCnt;
                            }
                            if (scratchPadCnt === 0) {
                                Util.Style.acss(scratchPadCont, "hidden");
                                CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId, 0);
                            }
                        }
                }
            }
        },
        /**
         * Remove an order, PowerPlan, or Careset favorite from the scratch pad
         * @param {node} buttonFav : The button of the order favorite clicked by the user
		 * @param {string} componentId : The id of the component, passed in as a string
		 * @param {string} favoriteId : The id of the favorite, passed in as a string
		 * @param {string} buttonId : The id of the button within the favorite, passed in as a string
         */
        RemoveFav: function(removeButton, componentId, favoriteId, buttonId){
        	var noei18n = i18n.discernabu.noe_o1;
        	//increment items on scratchpad count
        	var scratchPadCountDiv = _g("noeScratchPadCount" + componentId);
            var fav = null;
            if (scratchPadCountDiv){
                var scratchPadCnt = parseInt(scratchPadCountDiv.innerHTML, 10);
        	
        	    if (favoriteId.toUpperCase() === "MYSEARCHFAV"){
        	    	fav = Util.gp(removeButton);
        	        if (fav){
        	            Util.de(fav);
        	            scratchPadCnt--;
        	            scratchPadCountDiv.innerHTML = scratchPadCnt;	
        	        }
        	    }
        	    else{
        	    	var scratchPadFavId = "SP" + favoriteId;
        	        var scratchPadFav = _g(scratchPadFavId);
        	        if (scratchPadFav){
        	            Util.de(scratchPadFav);
        	            scratchPadCnt--;
        	            scratchPadCountDiv.innerHTML = scratchPadCnt;	
        	            
        	            var buttonFav = _g(buttonId);
        	            if (buttonFav){
        	            	buttonFav.value = noei18n.ORDER;
        	            }
        	            
        	            fav = _g(favoriteId);
        	            if(fav && Util.Style.ccss(fav, "noe-group-selected")){
        	            	// Remove the order as selected
        	                Util.Style.rcss(fav, "noe-group-selected");
        	            }
        	        }
        	    }
        	    if (scratchPadCnt === 0){
        			var scratchPadCont = _g("noeScratchPadCont" + componentId);
        			if (scratchPadCont){
        				Util.Style.acss(scratchPadCont, "hidden");
        			}
					CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId,0);
        	    }
            }
        },		
        /**
         * Add or remove scratchpad object to the shared resource array of objects
         * @param {Object} scratchpadObj : Scratchpad object to add or remove
         * @param {boolean} isRemovingFlag : true = remove object from scracthpad shared resource. false = add it to scracthpad shared resource
         * @return {Object} dataObj : Scratchpad shared resource data object
         */
        AddToOrRemoveFromScratchpadSR: function(component, scratchpadObj, isRemovingFlag){
        	var srObj = CERN_NEW_ORDER_ENTRY_O1.GetScratchpadSharedResourceObject();
        	if (srObj){
                //Retrieve the object from the shared resource.
                var dataObj = srObj.getResourceData();
                if (!dataObj) {
                    return null;
                }
                else{
                	var scratchpadArr = dataObj.scratchpadObjArr;
                	if (scratchpadArr){
    	            	if (isRemovingFlag){
    	                    var idx = scratchpadArr.length;
    	                    while (idx--) {
    	                    	if (scratchpadArr[idx].favSynId == scratchpadObj.favSynId &&
    	                    			scratchpadArr[idx].favSentId == scratchpadObj.favSentId){
    	                    		scratchpadArr.splice(idx, 1);
    	                            break;
    	                    	}
    	                    }
    	                }
    	                else{
							//Fire Timers releated to Search control when order is added to scratch add from Search textbox
							if(scratchpadObj.addedFrom === "MySearch") {
								component.m_base.fireOrderTimerFromSearch(scratchpadObj.favSynId);
							}
							else{
	    	                	component.m_base.fireOrderTimer(scratchpadObj.favSynId);
							}
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
        },
        /**
         * Get Scratchpad Shared Resource object
         * @return {Object} srObj : Scratchpad shared resource object
         */
        GetScratchpadSharedResourceObject: function(){
        	var srObj = null;
        	var sharedResourceName = "scratchpadSR";
            //Get the shared resource
            srObj = MP_Resources.getSharedResource(sharedResourceName);
            if (!srObj) {
                srObj = initScratchpadSR(sharedResourceName);
            }

            return srObj;
        },
        /**
         * When a favorite is removed from the scratchpad modal dialog, an event is fired and this function
         * 		is called to update the component
         * @param {node} component : The new order entry component
         * @param e {event} A builtin event passthrough
         * @param {Object} removeObject The object that has data to find the favorite and update its content
         */
    	SPModalDialogRemovesFavorite:function(component, event, removeObject){
    		var noei18n = i18n.discernabu.noe_o1;
    		//check NOE component and update "Remove" button to say "Order"
    		if (removeObject.componentId){//My Search has null
    			if (component.getComponentId() == removeObject.componentId){//if the favorite isn't in this specific component, don't go inside if statement
    				var noeCompFav = _g(removeObject.favoriteId);
    				if(noeCompFav && Util.Style.ccss(noeCompFav, "noe-group-selected")){
    					//remove the order as selected
    					Util.Style.rcss(noeCompFav,"noe-group-selected");
    					
    					var noeRemoveButton = Util.Style.g("noe-fav-order-button", noeCompFav, "button")[0];
    					if (noeRemoveButton){
    				        //modify button value in component to display "Order"
    						if (noeRemoveButton.childNodes[0]){
    							if (noeRemoveButton.childNodes[0].nodeValue){
    								noeRemoveButton.childNodes[0].nodeValue = noei18n.ORDER;
    							}
    						}
    						else if (noeRemoveButton.value){
    							noeRemoveButton.value = noei18n.ORDER;
    					    }
    						else{
    							noeRemoveButton.innerHTML = noei18n.ORDER;
    						}	
    					}
    			    }
    			}
    		}	
    	},
        /**
		 * Determine the search settings which will be passed into the mp_search_orders script and save the settings in the component.
		 * @param {node} component : The new order entry component
		 */
		ApplySearchSettings: function(component){
			var totSearchInds = 0;
			var isAmbulatoryEncntr=component.isAmbulatoryEnctrGrpFLag();
			if(isAmbulatoryEncntr){//Ambulatory
				totSearchInds = CERN_NEW_ORDER_ENTRY_O1.CalculateSearchIndicators(component, isAmbulatoryEncntr);
				component.setSearchIndicators(totSearchInds);
			}else{//Inpatient
				totSearchInds = CERN_NEW_ORDER_ENTRY_O1.CalculateSearchIndicators(component, isAmbulatoryEncntr);
				component.setSearchIndicators(totSearchInds);
			}
			
			if (component.m_base) {
				component.m_base.loadLegacyComponent(component, CERN_NEW_ORDER_ENTRY_O1, i18n.discernabu.noe_o1);
			}
		 },
		 /**
		 * Determine the search settings which will be passed into the mp_search_orders script.
		 * @param {node} component : The new order entry component
		 *  
		 */
		CalculateSearchIndicators: function(component,isAmbulatoryEnc){
			var searchInds = 0;
			var currentVenue = component.getVenueType();
			if(currentVenue === 1){ //Inpatient Meds or Ambulatory meds in office
				component.setEncntrVenueInd(currentVenue);
				//Apply search indicator settings	//Bit location- Setting ;Application
				if(component.isVirtViewOrders()){
					searchInds += (1 * Math.pow(2, 0));	//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
				}
				searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 1));	//1 - PLAN_VIRT_VIEW_IND ;Apply virtual view filters to plans
				searchInds += (1 * Math.pow(2, 2));	//2 - ORDERABLE_IND ;Return orderables from the search
                searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 3));	//3 - PLAN_IND ;Return plans from the search
				searchInds += (0 * Math.pow(2, 4));	//4 - ADMINISTRATION_IND ;Return orders which will be administered
				searchInds += (0 * Math.pow(2, 5));	//5 - PRESCRIPTION_IND ;Return orders which will be prescribed
				searchInds += (0 * Math.pow(2, 6));	//6 - HISTORICAL_IND ;Return historical prescriptions
				searchInds += (0 * Math.pow(2, 7)); //7 - PRODUCT_LEVEL_IND ;Return only product level med orders
				searchInds += (0 * Math.pow(2, 8)); //8 - VIRT_VIEW_ORDERS_IND ;Virtual view orders must be set if 
				searchInds += (0 * Math.pow(2, 9)); //9 - VIRT_VIEW_RX_ORDERS_IND ;Virtual view prescription orders
				searchInds += (!component.m_base.getOrderSentencesEnabled() * Math.pow(2,10)); //10 - ORDER_SENT_FILTER_IND ;Filter Ordersentences or not.
			}
			else if(currentVenue === 2){ //Discharge Meds or Ambulatory Meds as Rx
				//Since it is Rx venue type, we would like to make sure for this venue we have different indicators going into the mp_search_orders script
				if(isAmbulatoryEnc){ //Ambulatory meds as RX
					component.setEncntrVenueInd(currentVenue);
					//Apply search indicator settings	//Bit location- Setting ;Application
					//Apply virtual view only if rx or inpatient VV is on
					if(component.isVirtViewRxOrders() || component.isVirtViewOrders()){
						searchInds += (1 * Math.pow(2, 0));	//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
					}
					searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 1));	//1 - PLAN_VIRT_VIEW_IND ;Apply virtual view filters to plans
				}
				else{//Discharge Meds as Rx
					currentVenue = 3;//Setting this to 3 will allow the mp_search_orders script to populate the  PrescriptionVenueRequest, thus retrieving only prescriptions.	
					component.setEncntrVenueInd(currentVenue);
					// Honor rx virtual order catalog settings for discharge meds as rx venue
					if(component.isVirtViewRxOrders()){ 
						searchInds += (1 * Math.pow(2, 0));	//0 - VIRT_VIEW_IND ;Apply virtual view filters to prescirptions
					}
				}
				searchInds += (1 * Math.pow(2, 2));	//2 - ORDERABLE_IND ;Return orderables from the search
				searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 3));	
				searchInds += (0 * Math.pow(2, 4));	//4 - ADMINISTRATION_IND ;Return orders which will be administered
				searchInds += (1 * Math.pow(2, 5));	//5 - PRESCRIPTION_IND ;Return orders which will be prescribed
				searchInds += (0 * Math.pow(2, 6));	//6 - HISTORICAL_IND ;Return historical prescriptions
				if(component.isDispOnlyProductLevelMeds()){
					searchInds += (1 * Math.pow(2, 7)); //7 - PRODUCT_LEVEL_IND ;Return only product level med orders
				}
				if(component.isVirtViewOrders()){
					searchInds += (1 * Math.pow(2, 8)); //8 - VIRT_VIEW_ORDERS_IND ;Virtual view orders
				}
				if(component.isVirtViewRxOrders()){
					searchInds += (1 * Math.pow(2, 9)); //9 - VIRT_VIEW_RX_ORDERS_IND ;Virtual view prescription orders
				}

			}
			return searchInds;
		},
		 
        /**
         * Find shared order or plan favorites for a specified user
         * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
         * @param {object} reply : A XMLCCLRequest Script Reply
         */
        FindSharedFavorites:function(suggestionObj,component){
        	var criterion = component.getCriterion();
        	var virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
        	var orderSearchMask =  4;
        	var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
        	var venueType = component.getVenueType();
        	var productLevelMask = 0;
        	if (venueType === 1){//inpatient
        		component.setDispOnlyProductLevelMeds(0);
        		productLevelMask = 0;
        	}
        	else{ //ambulatory/discharge
        		component.setDispOnlyProductLevelMeds(1);
        		productLevelMask = 16;
        	}
        	var orderMask =  virtualViewMask + orderSearchMask + planSearchMask + productLevelMask;
        	var sendAr = ["^MINE^", criterion.person_id  + ".0", criterion.encntr_id + ".0", suggestionObj.PERSON_ID + ".0", "0.0", "^FAVORITES^", suggestionObj.POSITION_CD + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
        	var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
            folderRequest.setProgramName("mp_get_powerorder_favs_json");
            folderRequest.setParameters(sendAr);
            folderRequest.setAsync(true);
        	MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply){CERN_NEW_ORDER_ENTRY_O1.LoadSharedFavorites(reply,suggestionObj);});
        },
        /**
         * Load shared order or plan favorites on the specified tab
         * @param {object} reply : A XMLCCLRequest Script Reply
         * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
         */
        LoadSharedFavorites:function(reply,suggestionObj){
        	var prescriptionsVenueType = 1;
        	var normalOrderVenueType = 0;
        	var jsonReply = reply.getResponse();
        	//grab personnel id for use in DisplaySelectedSharedFolder and DisplayNextFolder
        	var personnelId = suggestionObj.PERSON_ID;
        	//grab personnel position code for use in DisplaySelectedSharedFolder and DisplayNextFolder
        	var personnelPosCd = suggestionObj.POSITION_CD;
        	var noei18n = i18n.discernabu.noe_o1;
        	var component = reply.getComponent();
        	var componentId = reply.getComponent().getComponentId();
        	//venueType for the scratch pad's favVenueType; 1- Prescriptions, 0- normal orders
        	//passed as orderOrigination to ORDERS MPAGES_EVENT
        	var venueType = (component.getVenueType() === 2 ? prescriptionsVenueType : normalOrderVenueType);
        	var noeMineArr = null;
        	if (jsonReply){
            	noeMineArr = jsonReply.USER_FAV;
            }
        	var tab = _g('sharedTabHTML' + componentId);
        	if (tab){
        		Util.Style.rcss(tab,"noe-preloader-icon");
            	var mineSec = ["<div class='noe-group noe-shared-sec'>"];
				var myFavPlansFolder = [];
            	var childFavFolder = [];
				var secondaryFavFolder = [];
            	var childFavFolderItems = [];
            	var mineCnt = 0;
        	    //create My Favorite Plans hardcoded folder
                if (component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()) {
					mineCnt++;
					myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsFolderRow", mineCnt, "' class='noe-info noe-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");					
				}				

                if(noeMineArr){
                	for (var i = 0, l = noeMineArr.length; i < l; i++) {
                		var noeFavsObj = noeMineArr[i];
                		
                		//account for multiple favorite folders per venue
                		//Only display folder path and My Plan Favorites folder once
                		if (i === 0){
        	        		mineSec.push("<div id='rootShared",componentId,"' class='noe-fav-path hdr'><dl id='folderPathShared",componentId,"' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span>",noeFavsObj.SHORT_DESCRIPTION,"</span></dd></dl></div>",
        	        			"<div id='folderContentsShared",componentId,"'>");

        					//Create the rest of the folders/orders/caresets/PowerPlans
        	        		var noeItemArr = noeFavsObj.CHILD_LIST;
        	        		for (var j = 0, k = noeItemArr.length; j < k; j++) {
        	        			var noeItem = noeItemArr[j];
        	        			var noeRow = [];
        			            var noeType = noeItem.LIST_TYPE;
        			            switch(noeType){
        							case 1: //Favorite Folder
        								mineCnt++;
        		        				noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
        		        				childFavFolder = childFavFolder.concat(noeRow);     
        								break;
        							case 2: //Order Synonym
        								mineCnt++;
        								if (noeItem.ORDERABLE_TYPE_FLAG === 6){
        	    							noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-shared'><button type='button' id='", "Shared", componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 1)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
        								}
        								else{
        	    							noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' data-cki='", noeItem.CKI, "' class='noe-info' sort='orderable-shared'><button type='button' id='", "Shared", componentId,"favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 0)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
        								}
        								childFavFolderItems = childFavFolderItems.concat(noeRow); 
        								break;
        							case 3: //Home Health Problem
        								break;
        							case 4: //Reference Task
        								break;
        							case 5: //IV Favorites
        								break;
        							case 6: //PowerPlan
        								mineCnt++;
        								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-info' sort='orderable-shared'><button type='button' id='", "Shared", componentId,"favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID,"' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='CERN_NEW_ORDER_ENTRY_O1.SelectFav(this, \"", componentId,"\", 2)'>", noei18n.ORDER, "</button><div class='noe-eligibility-info'></div><span class='noe-fav-star-disabled-icon'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>",noeItem.PW_CAT_SYN_NAME,"</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID,".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>",  noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>",  noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
        								childFavFolderItems = childFavFolderItems.concat(noeRow); 
        								break;
        							case 7: //Regimen Synonym
        								break;	
        						}
        		        	}
                		}
                		else{
                			//create My Favorite Plans hardcoded folder
                			mineCnt++;
            				if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
    	    					var folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
            					secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
            				}
            				else{
            					secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId,"favsFolderRow", mineCnt,"' class='noe-info noe-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O1.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", componentId,"\", \"Shared\", ", personnelId,", ", personnelPosCd,")'><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
            				}
                		}
                	}
               		//add items in sorted order
            		mineSec = mineSec.concat(myFavPlansFolder, childFavFolder, secondaryFavFolder, childFavFolderItems);
                    if (!mineCnt)
                    {
                    	mineSec.push("<span class='res-none'>", (noeMineArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
                    }
                    mineSec.push("</div>"); //ends <div id='folderContentsShared",componentId,"'>
                }
                        	
                var planSharedFavsHTML = mineSec.join("");
            	tab.innerHTML = planSharedFavsHTML;
            	
        		//Apply component scrolling for shared tab after folder has loaded
            	CERN_NEW_ORDER_ENTRY_O1.ApplyComponentScrolling(componentId, null, null, mineCnt);
            	
        		//Apply alphabetical sort to this tab
        		if(component.getFavoritesSort()){
        			CERN_NEW_ORDER_ENTRY_O1.ApplySortToFavorites(componentId, "Shared");
        		}

        	}
        	var folderPathId = 'folderPathShared' + componentId;
        	var folderPath = _g(folderPathId);
        	if(folderPath){
        		Util.addEvent(folderPath, "click", 
        			function(e){
            			var folder = e.target || e.srcElement;
            			var folderId = Util.gps(Util.gp(folder));
            			if (folderId.innerHTML != "-1"){
            				CERN_NEW_ORDER_ENTRY_O1.DisplaySelectedFolder(component, folderId.innerHTML, "Shared", personnelId, personnelPosCd);
            			}
        			}
        		);
        	}
        	component.m_base.renderFormularyInfo(component.getUid(), noeMineArr, "shared");
        },
		/**
		 * Call the mp_get_prsnl_json script with the text entered into the textBox
		 * @param {function} callback : The callback function used when the CCL script returns.
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {component} component : The new order entry component
		 */
        SearchPrsnl:function(callback,textBox,component){
        	if (textBox.value.length > 1) {
        		var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
                var returnData;
                var currentValue = textBox.value;
        		var compNs = component.getStyles().getNameSpace();
                var compId = component.getComponentId();
        		var pos = currentValue.indexOf(",", 1);
        		var lastName = "";
        		var firstName = "";
                xhr.onreadystatechange = function(){
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        MP_Util.LogScriptCallInfo(component, this, "neworderentry.js", "SearchPrsnl");
                        var msgSearch = xhr.responseText;
                        var jsonSearch = "";
                        if (msgSearch) {
                            jsonSearch = JSON.parse(msgSearch);
                        }
        				 if (jsonSearch) {
        				 	 returnData = jsonSearch.RECORD_DATA.PRSNL;

        				 }
                            if (textBox.value.length > 1) {
                                var searchBox = _g(compNs + "prsnlSearchCtrl" + compId);
                                if (searchBox && searchBox.value == currentValue) {
                                    callback.autosuggest(returnData);
                                }
                            }				 
                    }
                };
                
                if (currentValue.indexOf(",", 1) > 0) { //LastName, FirstName
                    lastName = currentValue.substr(0, pos);
                    firstName = currentValue.substring((pos) + 1);
                }
                else {
                    if (currentValue.indexOf(" ", 1) > 0) { //FirstName LastName
                        firstName = currentValue.substr(0, currentValue.indexOf(" ", 1));
                        lastName = currentValue.substring(currentValue.indexOf(" ", 1) + 1);
                    }
                    else { //LastName Only
                        lastName = currentValue;
                    }
                }
                
                var params = "^MINE^," + component.getCriterion().provider_id + ".0,^" + lastName + "^,^"+firstName+"^,10,1";
        		if(CERN_BrowserDevInd){
        			var url = "mp_get_prsnl_json?parameters=" + params;
        			xhr.open("GET", url);
        			xhr.send(null); 
        		}
        		else{
        			xhr.open('GET', "mp_get_prsnl_json");
        			xhr.send(params);
        		}
            }
		},
		/**
		 * Create the html for the suggestion which will be displayed in the suggestion drop down
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {string} searchVal : The value types into the search box.  This values is needed to highlight matches within the suggestions.
		 */
		CreatePrsnlSuggestionLine:function(suggestionObj,searchVal){
		    if (suggestionObj.PERSON_ID) {
		        return CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.NAME_FULL_FORMATTED, searchVal);
		    }
		
		},
		/**
		 * Retrieve the data from the selected object and call the mp_get_order_details script.
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {node} component : The new order entry component
		 */
		HandlePrsnlSelection:function(suggestionObj,textBox,component){
			var noei18n = i18n.discernabu.noe_o1;
			var componentId = component.getComponentId();
			if (suggestionObj) {
				var nameDiv = _g("sharedTabShell" + componentId);
		    	if (nameDiv){
		    		nameDiv.innerHTML = suggestionObj.NAME_FULL_FORMATTED;
		    		var nameFavDiv = _g("sharedTabHTML" + componentId);
			    	if (nameFavDiv){
			    		nameFavDiv.innerHTML = "";
			    		Util.Style.acss(nameFavDiv,"noe-preloader-icon");
			    	}
		    		CERN_NEW_ORDER_ENTRY_O1.FindSharedFavorites(suggestionObj,component);
		    	}
		    }
		},		
		/**
		 * Retrieve the data from the selected object and call the mp_get_order_details script.
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {node} component : The new order entry component
		 */
		 HandleSelection: function(suggestionObj, textBox, component){
			 if(suggestionObj) {
				 if(suggestionObj.SYN_ID){
					var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4 && xhr.status == 200) {
							MP_Util.LogScriptCallInfo(component, this, "neworderentry.js", "HandleSelection");
							var msgOrdDetail = xhr.responseText;
							var jsonOrdDetail = "";
							if (msgOrdDetail) {
								jsonOrdDetail = JSON.parse(msgOrdDetail);
							}
							if (jsonOrdDetail && jsonOrdDetail.RECORD_DATA) {
								var orderDetail = jsonOrdDetail.RECORD_DATA;
								if (suggestionObj.ORDERABLE_TYPE_FLAG === 6){
									CERN_NEW_ORDER_ENTRY_O1.AddSearchItemToScratchPad(orderDetail, component, 1);
								}
								else{
									CERN_NEW_ORDER_ENTRY_O1.AddSearchItemToScratchPad(orderDetail, component, 0);
								}
							}
						}
					};
					textBox.value = '';
					
					var params = "^MINE^, " + suggestionObj.SYN_ID + ".0," + suggestionObj.SENT_ID + ".0";
					if(CERN_BrowserDevInd){
						var url = "mp_get_order_sent_info?parameters=" + params;
						xhr.open("GET", url);
						xhr.send(null); 
					}
					else{
						xhr.open('GET', "mp_get_order_sent_info");
						xhr.send(params);
					}
				}
				if (suggestionObj.PATH_CAT_SYN_ID){
					CERN_NEW_ORDER_ENTRY_O1.AddSearchItemToScratchPad(suggestionObj, component, 2);
				}
			}
		 },
		 /**
		 * When an item is selected in the autosuggest dropdown add it to the scratch pad once the order details are retrieved
		 * @param {json} orderDetails : The json object containing the order details of the selected search item or details for PowerPlans
		 * @param {object} component : The new order entry component
		 * @param {int} favType : 0:Order; 1:Care Set; 2:PowerPlan
		 */
         AddSearchItemToScratchPad: function(orderDetails, component, favType){
         	// --- Code for Timers
         	var synonymID = orderDetails.SYN_ID;
         	var searchText = $("#" + "noeSearchBox" + component.m_componentId).find("input[type=text]").val();
			 var slaTimer =MP_Util.CreateTimer("CAP:MPG New Order Entry Search");				
			 if (slaTimer) {
							slaTimer.SubtimerName = noe_mpage;          
			                slaTimer.Start();
			                slaTimer.Stop();
							}
			 //  ---- Code for Timers
             var noei18n = i18n.discernabu.noe_o1;
             var componentId = component.getComponentId();
             var venueType = (component.getVenueType() == 2 ? 1 : 0);
             if (component.isModalScratchPadEnabled()) {
                 //create scratchpad object
                 var scratchpadObj = {};
                 scratchpadObj.componentId = componentId;
                 scratchpadObj.addedFrom = "MySearch"; //Location where the favorite was added from
                 scratchpadObj.favId = null;
                 scratchpadObj.favType = favType; //0: Orderable; 1: Careset; 2: PowerPlan
                 scratchpadObj.favName = null; //Display name of orderable/Careset/PowerPlan
                 scratchpadObj.favOrderSentDisp = null; //Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
                 scratchpadObj.favParam = null;
                 scratchpadObj.favSynId = null;
                 scratchpadObj.favVenueType = venueType;
                 scratchpadObj.favSentId = null;
                 scratchpadObj.favPPEventType = null;//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
                 scratchpadObj.favOrdSet = 0;
                 if (favType === 2) {//PowerPlan
                     scratchpadObj.favName = orderDetails.PW_CAT_SYN_NAME; //Display name of PowerPlan
                     scratchpadObj.favSynId = orderDetails.PATH_CAT_ID + ".0";
                     scratchpadObj.favSentId = orderDetails.PATH_CAT_SYN_ID + ".0";
                     scratchpadObj.favPPEventType = 0;//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
                     scratchpadObj.favParam = orderDetails.PATH_CAT_ID + ".0|" + orderDetails.PATH_CAT_SYN_ID + ".0";
                 }
                 else 
                     if (favType === 1) {//careset
                         scratchpadObj.favName = orderDetails.SYNONYM; //Display name of Careset
                         scratchpadObj.favOrderSentDisp = orderDetails.SENTENCE;
                         scratchpadObj.favSynId = orderDetails.SYN_ID + ".0";
                         scratchpadObj.favSentId = orderDetails.SENT_ID + ".0";
                         scratchpadObj.favParam = orderDetails.SYN_ID + ".0|" + venueType + "|" + orderDetails.SENT_ID + ".0";
                         scratchpadObj.favOrdSet = 6;
                     }
                     else {//order
                         scratchpadObj.favName = orderDetails.SYNONYM; //Display name of orderable
                         scratchpadObj.favOrderSentDisp = orderDetails.SENTENCE;
                         scratchpadObj.favSynId = orderDetails.SYN_ID + ".0";
                         scratchpadObj.favSentId = orderDetails.SENT_ID + ".0";
                         scratchpadObj.favParam = orderDetails.SYN_ID + ".0|" + venueType + "|" + orderDetails.SENT_ID + ".0";
                         // Set displayRxIcon to 1 for pharamacy order placed from a Rx venue
                         scratchpadObj.displayRxIcon = (orderDetails.PHARMACY_IND === 1 && scratchpadObj.favVenueType === 1) ? 1 : 0;
                     }
                 scratchpadObj.favNomenIds = '""';
                 
                 //add object to scratchpad shared reource
                 var dataObj = CERN_NEW_ORDER_ENTRY_O1.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, false);
             }
             else {
                 // Retreive the scratch pad html 
                 var scratchPad = _g("noeScratchPad" + componentId);
                 var selectedOrdCnt = component.incSearchOrdersCnt();
                 // Remove the "No orders selected" message
                 var noOrdMsg = Util.Style.g("res-none", scratchPad, "SPAN");
                 if (noOrdMsg) {
                     Util.de(noOrdMsg[0]);
                 }
                 // Create scratch pad entry
                 var scratchFav = Util.cep("dl", {
                     "className": "noe-info",
                     "id": ("SP" + component.getComponentId() + "SEARCHROW" + selectedOrdCnt).toUpperCase()
                 });

                 var favHTML = [];
                 if (favType === 2) {//PowerPlan
                     favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"MySearchFav\", \"MySearchFav\")'></span><span class='noe-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", orderDetails.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-scr-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", orderDetails.PATH_CAT_ID, ".0|", orderDetails.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_NOMEM, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd>", "<dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>0</dd>");
                 }
                 else 
                     if (favType === 1) {//Care set
                         favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"MySearchFav\", \"MySearchFav\")'></span><span class='noe-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", orderDetails.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-scr-disp'>", orderDetails.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", orderDetails.SYN_ID, ".0|", venueType, "|", orderDetails.SENT_ID, ".0</dd><dt>", noei18n.ORDER_NOMEM, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>6</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd>");
                     }
                     else {
                         favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_NEW_ORDER_ENTRY_O1.RemoveFav(this, \"", componentId, "\", \"MySearchFav\", \"MySearchFav\")'></span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-scr-name'>", orderDetails.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-scr-disp'>", orderDetails.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", orderDetails.SYN_ID, ".0|", venueType, "|", orderDetails.SENT_ID, ".0</dd><dt>", noei18n.ORDER_NOMEM, ":</dt><dd class='det-hd'></dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>0</dd>");
                     }
                 scratchFav.innerHTML = favHTML.join("");
                 // Add entry to the scratch pad
                 Util.ac(scratchFav, scratchPad);
                 //increment items on scratchpad count
                 var scratchPadCountDiv = _g("noeScratchPadCount" + component.getComponentId());
                 if (scratchPadCountDiv) {
                     var oldCount = parseInt(scratchPadCountDiv.innerHTML, 10);
                     var newCount = oldCount + 1;
                     scratchPadCountDiv.innerHTML = newCount;
                 }
                 //Unhide scratchpad now that something is being added to it
                 var scratchPadCont = _g("noeScratchPadCont" + component.getComponentId());
                 if (scratchPadCont) {
                     Util.Style.rcss(scratchPadCont, "hidden");
                 }
             }
			 //ensure component Id has been added to the pending data shared resource
             CERN_NEW_ORDER_ENTRY_O1.CheckPendingSR(componentId, 1);
         },
		 /**
		 * Create the html for the suggestion which will be displayed in the suggestion drop down
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {string} searchVal : The value types into the search box.  This values is needed to highlight matches within the suggestions.
		 */
		 CreateSuggestionLine: function(suggestionObj, searchVal){
			//check to see if this is an order or PowerPlan
			if(suggestionObj.SYN_ID) //Order or Care set
			{
				if (suggestionObj.ORDERABLE_TYPE_FLAG === 6) //Care set
				{
					//Need to check and see if there is a sentence to display
					if(suggestionObj.SENT_ID===0)
					{
						return "<span class='noe-careset-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.SYNONYM,searchVal);
					}
					else
					{
						return "<span class='noe-careset-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.SYNONYM,searchVal)+' <span class="det-txt">'+suggestionObj.SENTENCE+"</span>";
					}
				}
				else //Order
				{
					//Need to check and see if there is a sentence to display
					if(suggestionObj.SENT_ID===0)
					{
						return CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.SYNONYM,searchVal);
					}
					else
					{
						return CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.SYNONYM,searchVal)+' <span class="det-txt">'+suggestionObj.SENTENCE+"</span>";
					}
				}
			}
			if(suggestionObj.PATH_CAT_SYN_ID) //PowerPlan
			{
				return "<span class='noe-pp-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O1.HighlightValue(suggestionObj.PW_CAT_SYN_NAME,searchVal);
			}
		 },
		 /**
		 * Highlight specific portions of a string for display purposes
		 * @param {string} inString : The string to be highlighted
		 * @param {string] term : The string to highlight
		 * @return {string} outString : The string highlighted using HTML tags
		 */
		 HighlightValue: function(inString, term){
			return "<strong class='highlight'>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong class='highlight'>") + "</strong>";
		 },
		 /**
		  * Launch the Dx table to associate the scratchpad orders to diagnoses
		  * @param {object} component : The new order entry component
		  */
		  LaunchDxTable: function(component){
		  	// --- Code for Timers 
		 	 var slaTimer =MP_Util.CreateTimer("CAP:MPG New Order Entry LaunchDX");				
		 	 if (slaTimer) {
		 					slaTimer.SubtimerName = noe_mpage;          
		 	                slaTimer.Start();
		 	                slaTimer.Stop();
		 					}
		 	 //  ---- Code for Timers
		 	 
		 	var criterion = component.getCriterion();
		 	var noei18n = i18n.discernabu.noe_o1;
		 	var scratchPad = _g("noeScratchPad" + component.getComponentId());
		 	var scratchOrders = Util.Style.g("noe-info", scratchPad, "DL");
		 	var scrRowLen = scratchOrders.length;
		 	var ordDataJSON = '';
		 	var ordsJSON = [];
		 	var ordCnt = 0;
		 	var nonOrderFilter = 0; //0: Nothing filtered, Orders & Order Sets passed through; 1: PowerPlans filtered;
		 	var powerPlanFilter = false;
		 	if (scrRowLen) {
		 		for (var i = 0; i < scrRowLen; i++) {
		 			var orderRow = scratchOrders[i];
		 			var curRowData = _gbt("DD", orderRow);
		 			var curClass = orderRow.id.toUpperCase();
		 			var curOrdSyn = curRowData[0].innerHTML;
		 			var curOrdSent = curRowData[1].innerHTML;
		 			var ordParams = (curRowData[2].innerHTML).split('|');
		 			var curSynId = ordParams[0];
		 			var curSentId = ordParams[2];
		 			var curReq = 0; //default to 0 to send to BE
		 			var curNomenIds = '"' + curRowData[3].innerHTML + '"';
		 			var curOrdSet = curRowData[4].innerHTML;
		 			var nonOrderEvent = curRowData[5];
		 			if(!nonOrderEvent){
		 				ordCnt++;
		 				ordsJSON.push('{"SYN_MNE": "', curOrdSyn, '","SENT_DISP": "', curOrdSent, '","SYN_ID": ', curSynId, ',"SENT_ID": ', curSentId, ', "DIAG_REQ": ', curReq, ', "NOMEN_IDS": ', curNomenIds, ', "ROW_ID": "', curClass, '", "ORD_SELECTED": 1, "ORDER_SET": 0},');
		 			}
		 			else if (nonOrderEvent && curOrdSet && curOrdSet == 6){//Order Set
						ordCnt++;
						ordsJSON.push('{"SYN_MNE": "', curOrdSyn, '","SENT_DISP": "', curOrdSent, '","SYN_ID": ', curSynId, ',"SENT_ID": ', curSentId, ', "DIAG_REQ": ', curReq, ', "NOMEN_IDS": ', curNomenIds, ', "ROW_ID": "', curClass, '", "ORD_SELECTED": 1, "ORDER_SET": 6},');
		 			}
		 			else if(nonOrderEvent && parseInt(nonOrderEvent.innerHTML, 10) === 2){//PowerPlan
		 				powerPlanFilter = true;
		 			}
		 		}
		 		
		 		if(powerPlanFilter){//PowerPlans filtered
		 			nonOrderFilter = 1;
		 		}
		 		
		 		if (ordsJSON.length) {
		 			var strOrdsJSON = ordsJSON.join('');
		 			//remove last comma
		 			if (/,$/.test(strOrdsJSON)) {
		 				strOrdsJSON = strOrdsJSON.replace(/,$/, "");
		 			}
		 			var dxTblLoad = Util.cep("div", { "className": "dx-body-modal", "id": "dxTblLoad" + component.getComponentId() });
		 			dxTblLoad.innerHTML = "<div class='dx-load-wrap'><h2 class='dx-tbl-h2'>" + noei18n.DX_TABLE_HEADER + "</h2><div id='dxHdDiv" + component.getComponentId() + " class='dx-hd-div'><span class='dx-orders-hd'>" + noei18n.ORDERS + "</span>" + noei18n.DIAGNOSES + "</div><div id='dxTblLoadImg'>" + noei18n.DX_LOADING + "</div></div>";
		 			Util.ac(dxTblLoad, document.body);
		 			dxTblLoad.style.top = $(document).scrollTop();
		 			
		 			ordDataJSON += '{"ORDERDATA": {"COMPONENT_ID": "' + component.getComponentId() + '","ORDER_CNT": ' + ordCnt + ',"ORD_SET_FILTER": ' + nonOrderFilter + ',"ORDERS": [' + strOrdsJSON + ']}}';
		 			var paramString = [];
		 			paramString.push("^MINE^", criterion.person_id+ ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", criterion.position_cd + ".0", component.getVenueType(),"^" + ordDataJSON + "^");
		 			var request = new MP_Core.ScriptRequest(component, component.getAutoSuggestAddTimerName());					
		 			request.setProgramName("mp_order_diag_config");
		 			request.setParameters(paramString);
		 			request.setAsync(false);
		 			MP_Core.XMLCCLRequestCallBack(component, request, CERN_NEW_ORDER_ENTRY_O1.CreateDxTable);
		 		}
		 		else if (nonOrderFilter === 1) {
		 			alert(noei18n.DX_ASSOC_UNSUPPORTED_CARE_PLANS);
		 		}
		 		else {
		 			alert(noei18n.NO_ORDERS_SELECTED);
		 		}
		 	}
		 	else {
		 		alert(noei18n.NO_ORDERS_SELECTED);
		 	}
		  },
		  /**
		   * Create the outline and containers for the Dx Table
		   * @param {object} reply : A XMLCCLRequest Script Reply
		   */
		  CreateDxTable: function(reply){
		  	var orderConfig = reply.getResponse();
		  	var noei18n = i18n.discernabu.noe_o1;
		  	var orderData = orderConfig.ORDERDATA;
		  	var componentId = orderData.COMPONENT_ID;
		  	var dxData = orderConfig.DIAG_INFO;
		  	var dxLen = dxData.DIAGNOSIS.length;
		  	var dxTblLoad = _g("dxTblLoad" + componentId);
		  	var i;
		  	if(dxLen){
		  		var ordLen = orderData.ORDERS.length;
		  		var dxTbl = [];
		  		if (ordLen) {
		  			dxTbl.push("<h2 class='dx-tbl-h2'>", noei18n.DX_TABLE_HEADER, "</h2>",
		  						"<div class='dx-table-wrap'><div id='dxHdDiv", componentId, "' class='dx-hd-div'><span class='dx-orders-hd'>", noei18n.ORDERS, "</span>", noei18n.DIAGNOSES, "</div>",
		  						"<div class='dx-tbl-table-div'><table id='dxTable", componentId, "' class='dx-tbl'><thead>",
		  						"<tr><td class='dx-tbl-hd dx-col1 dx-adv'>", noei18n.DX_INSTRUCTIONS, "</td>");
		  			var ordTds = '';
		  			
		  			for (i = 0; i < dxLen; i++) {
		  				var curDx = dxData.DIAGNOSIS[i];
		  				dxTbl.push('<td class="dx-tbl-hd dx-tbl-cell-pointer dx-tbl-hd-col', i,'" col-index="', i,'" onclick="CERN_NEW_ORDER_ENTRY_O1.DxColClick(this, ', i,')"><dl class="dx-tbl-diag"><dt>', curDx.DISPLAY_AS, '</dt><dd>', curDx.CODE, '</dd></dl></td>');
		  			}
		  			
		  			dxTbl.push("</tr></thead>");
		  			
		  			dxTbl.push("<tbody>");
		  			for (i = 0; i < ordLen; i++) {
		  				var curOrdJSON = orderData.ORDERS[i];
		  				var newTrClass = curOrdJSON.ROW_ID;
		  				var nomenIds = curOrdJSON.NOMEN_IDS;
		  				var usePriority = false;
		  				var cellCntnt = "&nbsp;";
		  				ordTds = [];
		  				if (curOrdJSON.ORD_SELECTED) {		
		  					for (var j = 0; j < dxLen; j++) {
		  						if (nomenIds) {
		  							cellCntnt = 0;
		  							var nomenArr = nomenIds.split('|');
		  							for(var k = dxLen; k--;){
		  								if(nomenArr[k] === dxData.DIAGNOSIS[j].NOMEN_ID + ""){
		  									cellCntnt = k + 1;
		  								}
		  							}									
		  							if (cellCntnt === 0) {
		  								cellCntnt = "&nbsp;";
		  							}
		  						}
								else{
									if (dxData.DIAGNOSIS[j].PRIORITY !== 999) {
										usePriority = true;
										cellCntnt = dxData.DIAGNOSIS[j].PRIORITY;
									}
									else{
										cellCntnt = "&nbsp;";
									}
								}
		  						ordTds.push('<td class="dx-tbl-cell-pointer" nomen-id="', dxData.DIAGNOSIS[j].NOMEN_ID,'" col-index="', j,'">', cellCntnt, '</td>'); //added prefix
		  					}
		  					var curOrd = curOrdJSON.SYN_MNE;
		  					var curOrdDet = curOrdJSON.SENT_DISP;
		  					var curReq = curOrdJSON.DIAG_REQ;
		  					var curClass = newTrClass.toUpperCase();
		  					if (curReq == 1) {
		  						if (!nomenIds && !usePriority) {
		  							curClass += ' dx-req';
		  						}
		  						else {
		  							curClass += ' dx-prev-req';
		  						}
		  						curOrd = '<strong class="asc-req">' + curOrd + '*</strong>';
		  					}
		 					var curOrdHtml = "";
		 					if (curOrdJSON.ORDER_SET === 6) {//Care set
		 						curOrdHtml = "<dl class='dx-tbl-ord'><dt><span class='noe-careset-icon'>&nbsp;</span>" + curOrd + "</dt><dd>" + curOrdDet + "</dd></dl>";
		 					}
		 					else{//order
		 						curOrdHtml = "<dl class='dx-tbl-ord'><dt>" + curOrd + "</dt><dd>" + curOrdDet + "</dd></dl>";
		 					}
		 					dxTbl.push('<tr id="', componentId, 'row', (i + 1),'" class="', curClass, '"><th class="dx-col1">', curOrdHtml, '</th>', ordTds.join(''), '</tr>');
		  				}
		  			}
		  			dxTbl.push("</tbody></table></div></div>",
		  					"<div class='dx-btn-row'>",
		  					"<input type='button' id='dxSign", componentId,"' value='", noei18n.SIGN, "' class='dx-btn' /><input type='button' id='dxSubmit", componentId,"' value='", noei18n.SAVE, "' class='dx-btn' />",
		  					"<input type='button' id='dxModify", componentId, "' value='", noei18n.MODIFY, "' class='dx-btn' /><input type='button' id='dxCancel", componentId, "' value='", noei18n.CANCEL, "' class='dx-btn' /></div>");
		  			
		  			//clear loading page
		  			if (dxTblLoad) {
		  				Util.de(dxTblLoad);
		  			}
		  			CERN_NEW_ORDER_ENTRY_O1.ShowDxModal('dx', orderData.ORD_SET_FILTER, dxTbl.join(''), componentId);
		  			CERN_NEW_ORDER_ENTRY_O1.ToggleGroup(false);
		  			_g('dxHdDiv' + componentId).style.width = _g('dxTable' + componentId).offsetWidth + 'px';
		  		}
		  		else {
		  			alert(noei18n.NO_ORDERS_SELECTED);
		  		}				
		  	}
		  	else{
		  		alert(noei18n.NO_DX_FOUND);
		  		//Clear loading page
		  		if (dxTblLoad) {
		  			Util.de(dxTblLoad);
		  		}				
		  	}
		  },
		   /**
		   * Populate the Dx table with the required information
		   * @param {string} prefix : The prefix that will be appended to the ids of certain elements
		   * @param {int} nonOrderFilter : An indicator to tell whether or not to show the message of order sets, PowerPlans, or both being filtered
		   * 			//0: No filter, just Orders; 1: Order Sets filtered; 2: PowerPlans filtered; 3: Both Order Sets & PowerPlans filtered
		   * @param {string} modalHTML : The html of the "modal" window
		   * @param {int} componentId : A unique identifier for the component using the dx table
		   */
		  ShowDxModal: function(prefix, nonOrderFilter, modalHTML, componentId){
		    var noei18n = i18n.discernabu.noe_o1;
		    
		    //get component object
		    var intComponentId = parseInt(componentId, 10);
		    var component = MP_Util.GetCompObjById(intComponentId);
		    if (!component){
			    component = MP_Util.GetCompObjById(componentId);
		    }
			  
			//While the modal is open. We must manually resize certain portions.
		  	var windowResize = function(){CERN_NEW_ORDER_ENTRY_O1.WindowResize(componentId);};
		  	Util.addEvent(window, "resize", windowResize);
		  	
		  	var modalDiv = Util.cep("div", { "className": "dx-body-modal", "id": prefix + "ModalDxTable" + componentId });
		  	var mdlContent = Util.cep("div", { "className": "mdl-content", "id": "mdlContent" + componentId });
		  	mdlContent.innerHTML = modalHTML;
		  	Util.ac(mdlContent, modalDiv);
		  	var docBody = document.body;
		  	Util.ac(modalDiv, docBody);
		  	
		  	var dxTbl = _g('dxTable' + componentId);
		  	var dxTbody = _gbt('tbody', dxTbl)[0];
		  	var dxSaveBtn = _g('dxSubmit' + componentId); //save button
		  	var dxCnclBtn = _g('dxCancel' + componentId); //cancel button
		  	var dxSignBtn = _g('dxSign' + componentId); //sign button
		  	var dxModifyBtn = _g('dxModify' + componentId); //modify button
		 	
		  	//add filter warning if necessary
		  	var osFltrWarn = null;
		  	if (nonOrderFilter && nonOrderFilter === 1 && dxSignBtn) {
		  		osFltrWarn = Util.cep("span", { "className": "os-filt-warn", "id": "osFiltWarn" + componentId });
		  		osFltrWarn.innerHTML = "*" + noei18n.DX_ASSOC_UNSUPPORTED_CARE_PLANS;
		  		dxSignBtn.parentNode.insertBefore(osFltrWarn, dxSignBtn);
		 	}
		  	
		  	if (dxSaveBtn){
		  		// we have to use DOM0 event mode here, because of IE compatibility
		  		// see http://www.digitalenginesoftware.com/blog/archives/76-DOM-Event-Model-Compatibility-or-Why-fireEvent-Doesnt-Trigger-addEventListener.html
		  		dxSaveBtn.onclick = function() {
			  		// --- Code for Timers 
			  		var slaTimer =MP_Util.CreateTimer("CAP:MPG New Order Entry DXSave");	
			  		 if (slaTimer) {
			  						slaTimer.SubtimerName = noe_mpage;          
			  		                slaTimer.Start();
			  		                slaTimer.Stop();
			  						}
			  		 //  ---- Code for Timers
			  		var reqd = Util.Style.g('dx-req', dxTbl, 'tr');
			  		if (reqd.length > 0) {
			  			alert(noei18n.COMPLETE_ASSOCIATIONS);
			  		}
			  		else {
			  			var tRows = _gbt('tr', dxTbody);
			  			var trLen = tRows.length;
			  			for (var j = 0; j < trLen; j++) {
			  				var curRow = tRows[j];
			  				var tds = _gbt('td', curRow);
			  				var tdLen = tds.length;
			  				var dxAsoc = [];
			  				for (var i = 0; i < tdLen; i++) {
			  					var curTd = tds[i];
			  					//create array of nomen id associations
			  					if (curTd.innerHTML != "&nbsp;") {
			  						var idx = (parseInt(curTd.innerHTML, 10)) - 1;
			  						dxAsoc[idx] = curTd.getAttribute("nomen-id");
			  					}
			  				}
			  				var strDx = dxAsoc.join('|');
			  				var pendOrder; // this will actually be in the scratchpad because it gets by class name
			  				var orderData;
			  				var nomenIds;
			  				if (strDx) { //add nomen string to pending table
			  					if (Util.Style.ccss(curRow, "dx-prev-req")) {
			  						Util.Style.rcss(curRow, "dx-prev-req");
			  					}
			  					pendOrder = $("#" + curRow.className)[0];
			  					orderData = _gbt("dd", pendOrder);
			  					nomenIds = orderData[3];
			  					nomenIds.innerHTML = strDx;
			  				}
			  				else {
			  					pendOrder = $("#" + curRow.className)[0];
			  					orderData = _gbt("dd", pendOrder);
			  					nomenIds = orderData[3];
			  					nomenIds.innerHTML = '';
			  				}
			  			}
			  			//Since the modal is closing we no longer need to resize.
			  			Util.removeEvent(window, "resize", windowResize);
			  			CERN_NEW_ORDER_ENTRY_O1.HideDxModal(prefix, componentId);
			  		}
			  	}; //end save onclick
		  	}
		  	
		  	if (dxCnclBtn){
		  		
		  		// see comment on dxSaveBtn.onclick
		  		dxCnclBtn.onclick = 
				  		function(){
				  			//Since the modal is closing we no longer need to resize.
				  			Util.removeEvent(window, "resize", windowResize);
				  			CERN_NEW_ORDER_ENTRY_O1.HideDxModal(prefix, componentId);
				  		}; //end cancel onclick
		  	}
		  	
		  	if (dxSignBtn && dxSaveBtn){
		  			
		  		// see comment on dxSaveBtn
			  	dxSignBtn.onclick = 
			  		function(){
		  				//fire Save button event first, then can proceed to normal Sign
	  					fireEvent("click", dxSaveBtn);
			  			//Since the modal is closing we no longer need to resize.
			  			Util.removeEvent(window, "resize", windowResize);
						CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component, 0);
			  		};
				//end sign onclick
		  	}
		  	if (dxModifyBtn && dxSaveBtn){

		  		// see comment on dxSaveBtn
			  	dxModifyBtn.onclick = 
				  		function(){
			  				//fire Save button event first, then can proceed to normal Modify
			  				fireEvent("click", dxSaveBtn);
			  				
				  			//Since the modal is closing we no longer need to resize.
				  			Util.removeEvent(window, "resize", windowResize);
		       				// --- Code for Timers 
							 var slaTimer =MP_Util.CreateTimer("CAP:MPG New Order Entry Modify");				
							 if (slaTimer) {
											slaTimer.SubtimerName = noe_mpage;          
							                slaTimer.Start();
							                slaTimer.Stop();
											}
							 //  ---- Code for Timers
							 CERN_NEW_ORDER_ENTRY_O1.SubmitOrders(component,1);
				  		};
		  	}
		  	
		  	var nomTds = _gbt('td', dxTbody);
		  	var nomLen = nomTds.length;
		  	for (var j = nomLen; j--; ) {
		  		nomTds[j].onclick = CERN_NEW_ORDER_ENTRY_O1.DxCellClick;
		  	}	
		  },
		 /**
		  * When a cell is clicked within the Dx table we need to update the prioritty.
		  */
		 DxCellClick: function(){
		 	var prnt = Util.gp(this);
		 	var tds = _gbt('td', prnt);
		 	var tdLen = tds.length;
		 	var tbody = Util.gp(prnt);
		 	var trs = _gbt('tr', tbody);
		 	var trLen = trs.length;
		 	var th = null;
		 	var dxTbl = Util.gp(Util.gp(prnt)); //dx-tbl
		 	var divTable = Util.gp(dxTbl); //dx-tbl-table-div
		 	var dxThead = _gbt('thead', dxTbl)[0];
		 	var dxHeadTr = _gbt('tr', dxThead)[0];
		 	var dxTblInstructions = _gbt('td', dxHeadTr)[0];
		 	
		 	if (this.innerHTML != "&nbsp;") {
		 		var curVal = parseInt(this.innerHTML, 10);
		 		this.innerHTML = "&nbsp;";
		 		var nomCount = 0;
		 		for (var j = tdLen; j--; ) {
		 			tempCellVal = tds[j];
		 			var iCellVal = parseInt(tempCellVal.innerHTML, 10);
		 			if (tempCellVal.innerHTML != "&nbsp;") {
		 				nomCount++;
		 				if (iCellVal > curVal) {
		 					tempCellVal.innerHTML = iCellVal - 1;
		 				}
		 			}
		 		}
		 		if (nomCount === 0) {
		 			if (Util.Style.ccss(prnt, "dx-prev-req")) {
		 				Util.Style.rcss(prnt, "dx-prev-req");
		 				Util.Style.acss(prnt, "dx-req");
		 			}
		 		}
		 	}
		 	else {
		 		var newArr = [];
		 		if (Util.Style.ccss(prnt, "dx-req")) {
		 			Util.Style.rcss(prnt, "dx-req");
		 			Util.Style.acss(prnt, "dx-prev-req");
		 		}
		 		for (var i = tdLen; i--; ) {
		 			if (tds[i].innerHTML != "&nbsp;") {
		 				newArr[i] = parseInt(tds[i].innerHTML, 10);
		 			}
		 			else {
		 				newArr[i] = 0;
		 			}
		 		}
		 		var mx = (Math.max.apply(null, newArr)) + 1;
		 		this.innerHTML = mx;
		 	}
		 	//fix for scroll bar to keep the orders column "frozen"
		 	dxTblInstructions.style.left = divTable.scrollLeft;	
		 	for (var k = trLen; k--; ) {
		 		th = _gbt('th', trs[k])[0];
		 		th.style.left = divTable.scrollLeft;
		 	}
		 },
		 /**
		  * When the select all cell is clicked within the Dx table we need to update the prioritty for every cell in the column.
		  * @param {node} firstRowCell : The node of the cell that is in the first row of the selected column
		  * @param {int} columnNum : A column index for the table
		  */
		 DxColClick: function(firstRowCell, columnNum){
		 	var dxTbl = Util.gp(Util.gp(Util.gp(firstRowCell))); //dx-tbl
		 	var dxTbody = _gbt('tbody', dxTbl)[0];
		 	var dxBodyTds = _gbt('td', dxTbody);
		 	var dxBodyTdsLen = dxBodyTds.length;
		 	var hasFiredEvent = false;
		 	for (var i = dxBodyTdsLen; i--; ) {		 		
		 		if (dxBodyTds[i].getAttribute("col-index") == columnNum && dxBodyTds[i].innerHTML == "&nbsp;"){
		 			//fire event for every cell in chosen column only if it is blank
		 			fireEvent("click", dxBodyTds[i]);
		 			hasFiredEvent = true;
		 		}
		 	}
		 	
		 	//if no event has fired, that means every cell in the column is already associated to every order
		 	//so, we must remove all associations
		 	if (!hasFiredEvent){
		 		for (var j = dxBodyTdsLen; j--; ) {
		 			if (dxBodyTds[j].getAttribute("col-index") == columnNum){
		 				fireEvent("click", dxBodyTds[j]);
		 			}
		 		}
		 	}
		 },
		/**
         * Delete the diagnosis table html from the page
         * @param {string} prefix : The prefix that will be appended to the ids of certain elements
		 * @param {int} componentId : A unique identifier for the component using the dx table
         */
		HideDxModal: function(prefix, componentId){
			var modal = _g(prefix + 'ModalDxTable' + componentId);
			if (modal) {
				Util.de(modal);
			}
			CERN_NEW_ORDER_ENTRY_O1.ToggleGroup(true);
		},
		/**
         * Populate the Dx table with the required information
         * @param {boolean} show : An indicator to tell whether or not to show the mpage columns
         */
		ToggleGroup: function(show){
			var i;
			var colGroups = Util.Style.g('col-group');
			if (show) {
				for(i = colGroups.length; i--;){
					Util.Style.rcss(colGroups[i], "favHidden");
				}
			}
			else {
				for(i = colGroups.length; i--;){
					Util.Style.acss(colGroups[i], "favHidden");
				}
			}
		},
		/**
		 *Debounce the event so that it only gets fired once
		 * @param {function} func : The function being called on the debounced event
		 * @param {int} threshold : The amount of time to wait before firing the event
		 */
		Debounce: function(func, threshold) {
			var timeoutID;
			var timeout = threshold || 500;

			return function debounced() {
				var obj = this;
				var args = arguments;
				clearTimeout(timeoutID);
				timeoutID = setTimeout(function() {
					func.apply(obj, args);
				}, timeout);
			};
		},
		/**
         * Starts a timer in which call the WindowResizeTimeout function upon timeout.  Timeout needed for ie6 issues.
		 * @param {int} componentId : A unique identifier for the component using the dx table
         */
		WindowResize: function(componentId){
		    if (_g('dxTable' + componentId)) {
				window.clearTimeout(resizeTimeoutId);
				var windowResizeTimeout = function(){CERN_NEW_ORDER_ENTRY_O1.WindowResizeTimeout(componentId);};
				resizeTimeoutId = window.setTimeout(windowResizeTimeout, 10);
			}
		},
		/**
         * Resize the dx table header once the user stops resizing the window.
		 * @param {int} componentId : A unique identifier for the component using the dx table
         */
		WindowResizeTimeout: function(componentId){
			var dxTable = _g('dxTable' + componentId);
			_g('dxHdDiv' + componentId).style.width = dxTable.offsetWidth + 'px';
		 	//fix for scroll bar to keep the orders column "frozen"
			var divTable = Util.gp(dxTable); //dx-tbl-table-div
		 	var dxThead = _gbt('thead', dxTable)[0];
		 	var dxTbody = _gbt('tbody', dxTable)[0];
		 	var trs = _gbt('tr', dxTbody);
		 	var trLen = trs.length;
		 	var dxHeadTr = _gbt('tr', dxThead)[0];
			var dxTblInstructions = _gbt('td', dxHeadTr)[0];
			dxTblInstructions.style.left = divTable.scrollLeft;	
		 	for (var k = trLen; k--; ) {
		 		th = _gbt('th', trs[k])[0];
		 		th.style.left = divTable.scrollLeft;
		 	}
		},
		/**
         * Apply Component scrolling for each tab
		 * @param {int} componentId : The id of the component, passed in as a int
		 * @param {int} mineCnt : The count of items on the mine tab
		 * @param {int} publicCnt : The count of items on the public tab
		 * @param {int} sharedCnt : The count of items on the shared tab
		 * @param {int} searchCnt : The count of items on the searchResults tab
		 * NOTE: Frequent tab has yet to be defined, so this function will need to include that
         */
		ApplyComponentScrolling:function(componentId, mineCnt, publicCnt, sharedCnt, searchCnt){
			//get component object
			var intComponentId = parseInt(componentId, 10);
			var component = MP_Util.GetCompObjById(intComponentId);
			if (!component){
				component = MP_Util.GetCompObjById(componentId);
			}
			
			var mineDiv = _g("folderContentsMine" + componentId);
			var publicDiv = _g("folderContentsPublic" + componentId);
			var sharedDiv = _g("folderContentsShared" + componentId);
			var searchDiv = _g("folderContentsSearchResults" + componentId);
			
			var scrollNum = component.getScrollNumber();            
			// Apply scrolling to each favorite group if applicable
			if (scrollNum) {
				if (mineDiv && mineCnt){
				    if (scrollNum < mineCnt) {
				        MP_Util.Doc.InitSectionScrolling(mineDiv, scrollNum, "2.8");
				    }
				    else{//scrolling may have already been turned on, but shouldn't anymore
                        mineDiv.style.height = "auto";
                        mineDiv.style.overflowY = "auto";
				    }
				}
				if (publicDiv && publicCnt){
				    if (scrollNum < publicCnt) {
				        MP_Util.Doc.InitSectionScrolling(publicDiv, scrollNum, "2.8");
				    }
				    else{//scrolling may have already been turned on, but shouldn't anymore
                        publicDiv.style.height = "auto";
                        publicDiv.style.overflowY = "auto";
				    }
				}
				if (sharedDiv && sharedCnt){
				    if (scrollNum < sharedCnt) {
				        MP_Util.Doc.InitSectionScrolling(sharedDiv, scrollNum, "2.8");
				    }
				    else{//scrolling may have already been turned on, but shouldn't anymore
                        sharedDiv.style.height = "auto";
                        sharedDiv.style.overflowY = "auto";
				    }
				}
				if (searchDiv && searchCnt){
				    if (scrollNum < searchCnt) {
				        MP_Util.Doc.InitSectionScrolling(searchDiv, scrollNum, "2.8");
				    }
				    else{//scrolling may have already been turned on, but shouldn't anymore
                        searchDiv.style.height = "auto";
                        searchDiv.style.overflowY = "auto";
				    }
				}
			}
		},
		/**
		 * This gets called by RenderComponent or LoadFolder to sort the content based upon  
		 * 		the PowerOrders FAVORITES_SORT preference
		 *  	within any tab (Mine or Shared)
		 * @param {int} componentId : Component Id, passed in as an int
		 * @param {string} tabName : The name of the tab (Freq, Mine, Public, or Shared)
		 */
		ApplySortToFavorites:function(componentId, tabName){

			if (componentId && tabName){
				var tabNameClass = tabName.toLowerCase();
				var sort_by_name = function(a, b) {
			    	var aName = _gbt('dd', a)[0];
			    	var bName = _gbt('dd', b)[0];
			    	
			    	return aName.innerHTML.toLowerCase().localeCompare(bName.innerHTML.toLowerCase());
			   };
				
				var $folderContents = $('#folderContents' + tabName + componentId);
				if ($folderContents){
					var $listDlFoldersInTab = $('dl[sort="folder-' + tabNameClass + '"]', $folderContents);
					var $listDlOrderablesInTab = $('dl[sort="orderable-' + tabNameClass + '"]', $folderContents);
					if($listDlFoldersInTab){
						$listDlFoldersInTab.sort(sort_by_name);
						$listDlFoldersInTab.each(function(index) {
						    $folderContents.append($(this));
						});
					}
					if($listDlOrderablesInTab){
						$listDlOrderablesInTab.sort(sort_by_name);
						$listDlOrderablesInTab.each(function(index) {
						    $folderContents.append($(this));
						});	
					}
				}
			}
		},
		 /**
         * Submit selected orders on the scratch pad
         * @param {object} component : The New Order Entry component
         * @param {int} goToOrdersFlag : If set open the orders tab without signing.
         */
        SubmitOrders: function(component, goToOrdersFlag){   
        	var noei18n = i18n.discernabu.noe_o1;     
			var selectedCount = 0;
			var nomenIds, nomenStr, curParam, nonOrderEvent, powerPlanEventType;
			var orderParams = [];
			var criterion = component.getCriterion();
			var addPpRet = 0;
			var ordersExist = false;
			var m_hMOEW = 0;
			var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
			var isPowerPlanEnabled = component.isPowerPlanEnabled();
			var addPowerPlanMOEW_Exits = false;
			if ('AddPowerPlanMOEW' in PowerOrdersMPageUtils) {
				addPowerPlanMOEW_Exits = true;
			}
				
            // Obtain the scratch pad node
			var scratchPad = _g("noeScratchPad" + component.getComponentId());
            // Retrieve all orders on the scratch pad
            var scratchOrders = Util.Style.g("noe-info", scratchPad, "DL");

			if (!addPowerPlanMOEW_Exits && isPowerPlanEnabled) {
				MP_Util.LogError("File: neworderentry.js </br>  Function: SubmitOrders </br> Call to POWERORDERS DiscernObjectFactory.AddPowerPlanMOEW Failed.");
			}
			
            if (isPowerPlanEnabled && addPowerPlanMOEW_Exits){
            	m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(criterion.person_id, criterion.encntr_id, 24, 2, 127);
            	PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 2, 127);
            	PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 3, 127);
            }
            
            // Determine whether each order is checked
            for (var i = 0, l = scratchOrders.length; i < l; i++) {
                var curItem = scratchOrders[i];
                var curItemData = _gbt("DD", curItem);
				selectedCount++;
				curParam = curItemData[2].innerHTML;
				nomenStr = curItemData[3].innerHTML;
				nonOrderEvent = curItemData[5];
				if (nonOrderEvent && nonOrderEvent.innerHTML == 2)
				{
					var params = curParam.split("|");
					powerPlanEventType = curItemData[6];
					if (isPowerPlanEnabled && powerPlanEventType && addPowerPlanMOEW_Exits)
					{	
						//0: MySeacrh PowerPplan; 1: Mine or Shared tabs- Any PowerPlan saved to normal folder structure; 2: Mine or Shared tabs- My Plan Favorites Folder
                        if (powerPlanEventType.innerHTML == 2) {
                            addPpRet += PowerOrdersMPageUtils.AddPowerPlanMOEW(m_hMOEW, parseFloat(params[0]), parseFloat(params[1]));
                        }
                        else{
                        
                            addPpRet += PowerOrdersMPageUtils.AddPowerPlanMOEW(m_hMOEW, parseFloat(params[0]), 0.0);
                        }
					}						
				}
				else
				{
					if(nomenStr){
						nomenIds = "[" + nomenStr + "]";
					}
					else{
						nomenIds = 0;
					}
                    orderParams.push("{ORDER|", curParam, "|", nomenIds, "|1}");
					ordersExist = true;
				}
            }
            // Construct parameter string and submit orders if one or more are checked
			if(goToOrdersFlag !== 1 && selectedCount === 0){
				alert(noei18n.NO_ORDERS_SELECTED);
			}
			else if(goToOrdersFlag !== 1 && criterion.encntr_id === 0.0){
				alert(noei18n.NO_ENCNTR_SELECTED);				
			}
			else{
				//Default ORDER field if no orders selected.
				if(orderParams.length === 0){
					orderParams.push("{ORDER|0|0|0|0|0}");
				}
				
				var mpagesParams = [criterion.person_id, ".0|", criterion.encntr_id, ".0|"];
				mpagesParams = mpagesParams.concat(orderParams);
				
				if(goToOrdersFlag === 1){
					mpagesParams.push('|24|{2|127}{3|127}|32|0');
				}
				else {
					mpagesParams.push('|24|{2|127}{3|127}|32|1');
				}
				// Submit orders
				if (addPpRet || ordersExist) {
                    MP_Util.LogMpagesEventInfo(component, "ORDERS", mpagesParams.join(""), "neworderentry.js", "SubmitOrders");
                    MPAGES_EVENT("ORDERS", mpagesParams.join(""));
                }
				CERN_EventListener.fireEvent(null, component, EventListener.EVENT_ORDER_ACTION, 'NewOrderEntry');
			}
			if (isPowerPlanEnabled && addPowerPlanMOEW_Exits){
				PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
			}
		},
        /**
         * Hover over order/remove button
         * @param {string} itemId : The id of the tab clicked by the user
         */
        MouseOverButton: function(buttonFav)  {
			Util.Style.acss(Util.gp(buttonFav),"noe-group-mouseover");	
        },
        MouseOutButton: function(buttonFav)  {
			Util.Style.rcss(Util.gp(buttonFav),"noe-group-mouseover");	
        },
		 /**
         * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
         * @param {char} compId : The New Order Entry component_id
         * @param {boolean} pendingInd : true = current component has pending data.  Prompt the user before they navigate away from the chart
         */		
        CheckPendingSR: function(compId, pendingInd){
            var srObj = null;
			var strCompId = String(compId); //Convert to string to keep consistant.
            var dataObj = {};
            //Get the shared resource
            srObj = MP_Resources.getSharedResource("pendingDataSR");
             //Retrieve the object from the shared resource.
            if (srObj){
                //Retrieve the object from the shared resource.
                dataObj = srObj.getResourceData();
                if(dataObj){
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
                }
            }
        }       
    };
    
    /**
     * Create scratchpad Shared Resource.
     * @param {string} sharedResourceName : The name of the shared resource to create
     * @return {Object} srObj : Scratchpad shared resource object
     */
    function initScratchpadSR(sharedResourceName){
        var srObj = null;
        var dataObj = {};
        srObj = new SharedResource(sharedResourceName);
        //Create te object that will be stored in the SharedResource 
        dataObj.scratchpadObjArr = [];
        //Set the available flag to true 
        srObj.setIsAvailable(true);
        //Set the shared resource data object 
        srObj.setResourceData(dataObj);
        //Set the shared resource event listener object
        var object = {};
        srObj.setEventListenerObject(object);
        //Set the shared resource event listener flag 
        srObj.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
        //Add the shared resource so other components can access it 
        MP_Resources.addSharedResource(srObj.getName(), srObj);
        return srObj;
    }
}();
