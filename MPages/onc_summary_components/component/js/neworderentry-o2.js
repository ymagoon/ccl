function NewOrderEntryO2ComponentStyle() {
	this.initByNamespace("noe2");
}

NewOrderEntryO2ComponentStyle.prototype = new ComponentStyle();
NewOrderEntryO2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The New Order Entry component will allow the user to enter new orders for the patient from within the MPage
 *
 * @param {Criterion} criterion - The data object used to build out the component.
 * @returns {undefined} undefined
 */
function NewOrderEntryO2Component(criterion) {
	this.m_encntrTypeCd = null;
	this.m_facilityId = null;
	this.m_ordersSearchInd = false;
	this.m_searchIndicators = null;
	this.m_searchOrdersCnt = 0;
	this.m_suggestionLimit = 0;
	this.m_searchResultsLimit = 50;
	this.m_refreshMineTab = false;
	//1 = inpatient, 2 = ambulatory
	this.m_venueType = 1;
	this.m_noeArray = null;
	this.m_noeMineItemArray = null;
	this.m_noeSharedItemArray = null;
	this.m_noePublicItemArray = null;
	this.m_noeHomeItemArray = null;
	this.m_prsnlId = null;
	this.m_prsnlPosCd = null;
	this.m_dispOnlyProductLevelMeds = false;
	this.m_virtViewOrders = true;
	this.m_virtViewRxOrders = true;
	this.m_powerPlanEnabled = false;
	this.m_userFavEnabled = false;
	this.m_homeFavEnabled = true;
	this.m_publicFavEnabled = false;
	this.m_sharedFavEnabled = false;
	this.m_displayNextFolderEnabled = true;
	this.m_planFavEnabled = false;
	this.m_userFavLabel = "";
	this.m_publicFavLabel = "";
	this.m_sharedFavLabel = "";
	this.m_modelessCache = [];
	this.m_resizeEnabled = true;
	this.m_enableTabChange = true;
	this.m_templates = new TemplateEngine.TemplateFactory(CERN_NEW_ORDER_ENTRY_O2_TEMPLATES);
	this.setCriterion(criterion);
	this.setStyles(new NewOrderEntryO2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.NEW_ORDER_ENTRY.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.NEW_ORDER_ENTRY.O2 - render component");
	this.setIncludeLineNumber(false);
	this.setHasActionsMenu(true);
	this.m_favoritesSortPref=false;
	this.m_homeOwnerId=false;
	this.m_ambInd=false;
	this.m_discardResizes = 0;
	this.venueValue = 1;
	this.m_uid = "";
	this.m_wasListenerAdded = false;
	
	NewOrderEntryO2Component.method("openTab", function() {
		var criterion = this.getCriterion();
		var params = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
		APPLINK(0, criterion.executable, params);
		this.retrieveComponentData();
	});
	NewOrderEntryO2Component.method("isOrderSearchInd", function() {
		return this.m_ordersSearchInd;
	});
	NewOrderEntryO2Component.method("setOrderSearchInd", function(value) {
		this.m_ordersSearchInd = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isVirtViewOrders", function() {
		return this.m_virtViewOrders;
	});
	NewOrderEntryO2Component.method("setVirtViewOrders", function(value) {
		this.m_virtViewOrders = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isVirtViewRxOrders", function() {
		return this.m_virtViewRxOrders;
	});
	NewOrderEntryO2Component.method("setVirtViewRxOrders", function(value) {
		this.m_virtViewRxOrders = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isDispOnlyProductLevelMeds", function() {
		return this.m_dispOnlyProductLevelMeds;
	});
	NewOrderEntryO2Component.method("setDispOnlyProductLevelMeds", function(value) {
		this.m_dispOnlyProductLevelMeds = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("getVenueType", function() {
		return this.m_venueType;
	});
	NewOrderEntryO2Component.method("setVenueType", function(value) {
		this.m_venueType = ( value ? 2 : 1);
	});
	NewOrderEntryO2Component.method("getFacilityId", function() {
		return this.m_facilityId;
	});
	NewOrderEntryO2Component.method("setFacilityId", function(value) {
		this.m_facilityId = value;
	});
	NewOrderEntryO2Component.method("getEncntrTypeCd", function() {
		return this.m_encntrTypeCd;
	});
	NewOrderEntryO2Component.method("setEncntrTypeCd", function(value) {
		this.m_encntrTypeCd = value;
	});
	NewOrderEntryO2Component.method("getSearchIndicators", function() {
		return this.m_searchIndicators;
	});
	NewOrderEntryO2Component.method("setSearchIndicators", function(value) {
		this.m_searchIndicators = value;
	});
	NewOrderEntryO2Component.method("getSuggestionLimit", function() {
		return this.m_suggestionLimit;
	});
	NewOrderEntryO2Component.method("setSuggestionLimit", function(value) {
		this.m_suggestionLimit = value;
	});
	NewOrderEntryO2Component.method("getSearchResultsLimit", function() {
		return this.m_searchResultsLimit;
	});
	NewOrderEntryO2Component.method("setSearchResultsLimit", function(value) {
		this.m_searchResultsLimit = value;
	});
	NewOrderEntryO2Component.method("getNOEArray", function() {
		return this.m_noeArray;
	});
	NewOrderEntryO2Component.method("setNOEArray", function(value) {
		this.m_noeArray = value;
	});
	NewOrderEntryO2Component.method("getNOEMineItemArray", function() {
		return this.m_noeMineItemArray;
	});
	NewOrderEntryO2Component.method("setNOEMineItemArray", function(value) {
		this.m_noeMineItemArray = value;
	});
	NewOrderEntryO2Component.method("getNOESharedItemArray", function() {
		return this.m_noeSharedItemArray;
	});
	NewOrderEntryO2Component.method("setNOESharedItemArray", function(value) {
		this.m_noeSharedItemArray = value;
	});
	NewOrderEntryO2Component.method("getNOEPublicItemArray", function() {
		return this.m_noePublicItemArray;
	});
	NewOrderEntryO2Component.method("setNOEPublicItemArray", function(value) {
		this.m_noePublicItemArray = value;
	});
	NewOrderEntryO2Component.method("getNOEHomeItemArray", function() {
		return this.m_noeHomeItemArray;
	});
	NewOrderEntryO2Component.method("setNOEHomeItemArray", function(value) {
		this.m_noeHomeItemArray = value;
	});	
	NewOrderEntryO2Component.method("getPrsnlId", function() {
		return this.m_prsnlId;
	});
	NewOrderEntryO2Component.method("setPrsnlId", function(value) {
		this.m_prsnlId = value;
	});
	NewOrderEntryO2Component.method("getPrsnlPosCd", function() {
		return this.m_prsnlPosCd;
	});
	NewOrderEntryO2Component.method("setPrsnlPosCd", function(value) {
		this.m_prsnlPosCd = value;
	});
	NewOrderEntryO2Component.method("incSearchOrdersCnt", function() {
		return ++this.m_searchOrdersCnt;
	});
	NewOrderEntryO2Component.method("isPowerPlanEnabled", function() {
		return this.m_powerPlanEnabled;
	});
	NewOrderEntryO2Component.method("setPowerPlanEnabled", function(value) {
		this.m_powerPlanEnabled = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isUserFavEnabled", function() {
		return this.m_userFavEnabled;
	});
	NewOrderEntryO2Component.method("setUserFavEnabled", function(value) {
		this.m_userFavEnabled = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isHomeFavEnabled", function() {
		return this.m_homeFavEnabled;
	});
	NewOrderEntryO2Component.method("setHomeFavEnabled", function(value) {
		this.m_homeFavEnabled = (value == 1 ? true : false);
	});	
	NewOrderEntryO2Component.method("isPublicFavEnabled", function() {
		return this.m_publicFavEnabled;
	});
	NewOrderEntryO2Component.method("setPublicFavEnabled", function(value) {
		this.m_publicFavEnabled = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isSharedFavEnabled", function() {
		return this.m_sharedFavEnabled;
	});
	NewOrderEntryO2Component.method("setSharedFavEnabled", function(value) {
		this.m_sharedFavEnabled = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("isPlanFavEnabled", function() {
		return this.m_planFavEnabled;
	});
	NewOrderEntryO2Component.method("setPlanFavEnabled", function(value) {
		this.m_planFavEnabled = (value == 1 ? true : false);
	});
	NewOrderEntryO2Component.method("setUserFavLabel", function(value) {
		this.m_userFavLabel = value;
	});
	NewOrderEntryO2Component.method("getUserFavLabel", function() {
		return this.m_userFavLabel;
	});
	NewOrderEntryO2Component.method("setPublicFavLabel", function(value) {
		this.m_publicFavLabel = value;
	});
	NewOrderEntryO2Component.method("getPublicFavLabel", function() {
		return this.m_publicFavLabel;
	});
	NewOrderEntryO2Component.method("setSharedFavLabel", function(value) {
		this.m_sharedFavLabel = value;
	});
	NewOrderEntryO2Component.method("getSharedFavLabel", function() {
		return this.m_sharedFavLabel;
	});
	NewOrderEntryO2Component.method("isAmbulatoryEnctrGrpFLag", function() {
		return this.m_ambInd;
	});
	NewOrderEntryO2Component.method("setAmbulatoryEnctrGrpFlag", function(value) {
		this.m_ambInd= (value == 2 ? true : false);
	});
	NewOrderEntryO2Component.method("getEncntrVenueInd", function() {
		return this.venueValue;
	});
	NewOrderEntryO2Component.method("setEncntrVenueInd", function(value) {
		this.venueValue= value;
	});
	NewOrderEntryO2Component.method("isDischargeAsRxVenue", function() {
		return (!this.isAmbulatoryEnctrGrpFLag() && this.getVenueType() === 2);
	});
	NewOrderEntryO2Component.method("getUid", function() {
		return this.m_uid;
	});
	NewOrderEntryO2Component.method("setUid", function(value) {
		this.m_uid= value;
	});
	NewOrderEntryO2Component.method("initPendingSR", function() {
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
		}
		else {//The shared resource exists
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
		dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
	});
	NewOrderEntryO2Component.method("RemoveFavorite", function(event, removeObject) {
		CERN_NEW_ORDER_ENTRY_O2.SPModalDialogRemovesFavorite(this, event, removeObject);
	});
	NewOrderEntryO2Component.method("setFavoritesSortPref", function(value){
        this.m_favoritesSortPref = (value === 1 ? true : false);
    });
    NewOrderEntryO2Component.method("getFavoritesSortPref", function(){
        return this.m_favoritesSortPref;
    });
	NewOrderEntryO2Component.method("setHomeOwnerId", function(value) {
		this.m_homeOwnerId = (value !== 0 ? true : false);
	});
	//Gets the owner id of the folder set as home folder
	NewOrderEntryO2Component.method("getHomeOwnerId", function() {
		return this.m_homeOwnerId;
	}); 
	NewOrderEntryO2Component.method("getActiveTab", function(){
		// Extremely UGLY and HACKISH placeholder for getting the activeTab.
		// This shall be removed during the refactor of the resizing.
		// Performing "if" logic per tab violates almost all object oriented logic.
		// Instead, this kind of resizing should be put inside the tab class in which
		// it will act.
		
		if (typeof(this.m_base) == "undefined" || !this.m_base.getTabGroup() || !this.m_base.getTabGroup().getCurrent()) {
			return "";
		}
		
		return this.m_base.getTabGroup().getCurrent().getAlias();
	});
	NewOrderEntryO2Component.method("resizeComponent", function() {
		var component = this;
		
		if (!component.m_resizeEnabled) {;
			return;
		}
		
		// this is a hack because the component framework fires resize events on each completed
		// ajax request. If we refactor the component so that it doesn't need to delete everything
		// and build the columns from scratch, we will not need this anymore.
		if (component.m_discardResizes > 0) {
			component.m_discardResizes--;
			return;
		}
		
		CERN_NEW_ORDER_ENTRY_O2.Debounce(function(e) {
			if(component.getActiveTab()!==null)
			{
				activeTab=component.getActiveTab();
				
			}
			
			// this can happen if we have no tabs at all, so we won't have to resize anything
			if (!component.m_base.getTabGroup() || !component.m_base.getTabGroup().getCurrent()) {
				return;
			}
			
			var noeArr = component.m_base.getTabGroup().getCurrent().getRecordData();
			if (noeArr === null) {
				return;
			}
			CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeArr, activeTab, component);
		}, 500)();
	});

}

NewOrderEntryO2Component.inherits(MPageComponent);
FavoriteModeless = null;
/**
 * Gets the value of the wasListenerAdded flag to determine if the event listener has been added yet
 * @returns {boolean} wasListenerAdded flag 
 */
NewOrderEntryO2Component.prototype.getWasListenerAdded = function(){
	return this.m_wasListenerAdded;
};
/**
 * Sets the wasListenerAdded flag to indicate whether the listener has been added.
 * @param {boolean} value - the value to set the flag to
 * @returns {undefined} undefined 
 */
NewOrderEntryO2Component.prototype.setWasListenerAdded = function(value){
	this.m_wasListenerAdded = value;
};

//Implementing the MPageComponent's retrieveComponentData	
NewOrderEntryO2Component.prototype.retrieveComponentData = function() {
	var self = this;
	if(!self.getWasListenerAdded()){
		CERN_EventListener.addListener(self, EventListener.EVENT_ORDER_ACTION, self.retrieveComponentData, self);
		CERN_EventListener.addListener(self, EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT, self.RemoveFavorite, self);
		self.setWasListenerAdded(true);
	}
	CERN_NEW_ORDER_ENTRY_O2.GetNewOrderEntryData(this, function(recordData) {
		CERN_NEW_ORDER_ENTRY_O2.RenderComponent(recordData, self);
	});
}; 

/**
 * Render a health plan selector for the new order entry workflow component
 * @returns {undefined} undefined
 */
NewOrderEntryO2Component.prototype.retrieveHealthPlanSelector = function(){
	var self = this;
	var root = this.getRootComponentNode();
	var namespace = "noeo2" + this.getComponentId();
	var healthPlanEl = $('#' + namespace + "HealthPlanWrapper");
	//Don't rerender selector if already present
	if (healthPlanEl && healthPlanEl.length){
		return;
	}
	var element = $("<div id='" + namespace + "HealthPlanWrapper' class='noe-o2-healthplan-selector'></div>");
	$(root).find('.sec-hd').append(element);
	var patientId = this.getCriterion().person_id;
	var encntrId = this.getCriterion().encntr_id;
	var userId = this.getCriterion().provider_id;
	var errorContainer = $('#' + 'eligibilityInfoMessage' + this.getComponentId());
	var wrappedCallback = function(healthPlan){
		self.selectHealthPlan(healthPlan);
	};
	var planSelector = new HealthPlanSelector();
	planSelector.setPatient(patientId);
	planSelector.setElement(element);
	planSelector.setEncounterId(encntrId);
	planSelector.setUserId(userId);
	planSelector.setNamespace(namespace);
	planSelector.setOnSelect(wrappedCallback);
	planSelector.setErrorContainer(errorContainer);
	planSelector.init();
};

/**
 * Overwrite the isDisplayable() function to ensure the component is not displayed if MPAGES_EVENT is not available.
 * @returns {boolean} compDisp
 */
NewOrderEntryO2Component.prototype.isDisplayable = function(){
	if(this.isComponentFiltered() || (!CERN_BrowserDevInd && !CERN_Platform.inMillenniumContext())){
		return false;
	}
	return this.m_compDisp;
};


/**
 * Overwrite the isComponentFiltered() function to account for whether the component should be displayed in the
 * page level menu
 * @returns {boolean} True if the component should not be displayed because of a filter or it's been removed because
 * 						win32 is not available, false otherwise.
 */
NewOrderEntryO2Component.prototype.isComponentFiltered = function(){
	if(!CERN_BrowserDevInd && !CERN_Platform.inMillenniumContext()){
		return true;
	}
	return(MPageComponent.prototype.isComponentFiltered.call(this));
};


/**
 * Performs actions after a health plan is selected to render the proper eligibility information
 * @param  {Object} healthPlan The healthplan object that has been selected
 * @returns {undefined} undefined
 */
NewOrderEntryO2Component.prototype.selectHealthPlan = function(healthPlan){
	var self = this;
	var uid = healthPlan.FORMULARY_BENEFIT_SET_UID;
	this.setUid(uid);
	self.m_base.refreshEligibilityInfo(uid);
};

/**
 * New Order Entry methods
 * @namespace CERN_NEW_ORDER_ENTRY_O2
 * @static
 * @global
 * @dependencies Script: mp_get_powerorder_favs_json
 */
var CERN_NEW_ORDER_ENTRY_O2 = function() {

	//Only global added since only one dx table can be open at a time.
	var resizeTimeoutId;

	// ________________________________________________________________________

	FavoriteModeless = function (containerDiv, component, tabName, starElement) {
		this.mDetailDialog = null;
		this.mSelector = null;
		this.mIsOpened = false;
		this.mOrderElement = null;
		this.mOrderElementId = "";
		this.mRootFolderId = 0;
		this.mContainerDiv = containerDiv;
		this.mComponent = component;
		this.mDdTree = null;
		this.mTabName = tabName;
		this.defaultCatId = 0;
		this.mSeq = FavoriteModeless.counter++;
		this.setStarElement(starElement);

		FavoriteModeless.all.push(this);
	};


	FavoriteModeless.current = null;
	FavoriteModeless.all = [];
	FavoriteModeless.counter = 0;

	FavoriteModeless.activeCls = "noe2-fav-star-active-icon";
	FavoriteModeless.disabledCls = "noe2-fav-star-disabled-icon";

	// ________________________________________________________________________
	FavoriteModeless.prototype.setStarElement = function(starElement) {
		// Ensures that the star has a valid id - this is necessary for mpage controls
		if (!starElement.attr("id")) {
			starElement.attr("id", "noe2star" + this.mSeq);
		}
		this.mStarElement = starElement;
	};

	// ________________________________________________________________________

	FavoriteModeless.disableAllFromTab = function(tabName) {
		$.each(FavoriteModeless.all, function() {
			if (this.mTabName == tabName) {
				this.mSelector.setEnabled(false);
			}
		});
	};

	// ________________________________________________________________________

	FavoriteModeless.enableAllFromTab = function(tabName) {
		$.each(FavoriteModeless.all, function() {
			if (this.mTabName == tabName) {
				this.mSelector.setEnabled(true);
			}
		});
	};

	// ________________________________________________________________________

	FavoriteModeless.destroyAllFromTab = function(tabName) {
		$.each(FavoriteModeless.all, function(i, modeless) {
			if (modeless.mTabName == tabName) {
				modeless.destroy();
			}
		});
	};

	// ________________________________________________________________________

	FavoriteModeless.hideCurrent = function() {
		var currentModeless = FavoriteModeless.current;

		if (!currentModeless || !currentModeless.mDetailDialog.getVisible()) {
			return;
		}

		currentModeless.hide();
		if (currentModeless.mSelector.getIsSelected()) {
			currentModeless.mSelector.performUnselection();
		}
		else {
			currentModeless.mSelector.performSelection();
		}

		FavoriteModeless.current = null;

	};

	// ________________________________________________________________________

	/**
	 * Creates a Selector control - the star - attached to the provided element
	 * @param {object} element - The element that the selector is being made for.
	 * @param {boolean} isActive - Flag to designate if the selector should be active or not.
	 * @returns {undefined} undefined
	 */
	FavoriteModeless.prototype.createSelector = function(element, isActive) {
		var self = this;
		this.mSelector = new MPageControls.Selector(element, FavoriteModeless.activeCls, FavoriteModeless.disabledCls);

		if (isActive) {
			this.mSelector.performSelection();
		}

		this.mOrderElement = element.closest(".noe2-order");
		this.mOrderElementId = this.mOrderElement.attr("id");
	};
	// ________________________________________________________________________

	/**
	 * Executed before a modeless is displayed. This ensures that
	 * other selectors are disabled, and that the user will not
	 * be able to open other dialogs in this component.
	 * @returns {undefined} undefined
	 */
	FavoriteModeless.prototype.beforeModelessDisplay = function(searchMoreInd) {
		FavoriteModeless.current = this;

		// when one is selected, we cannot select any other fav modeless
		// so we have to disable them all
		FavoriteModeless.disableAllFromTab(this.mTabName);
	};

	// ________________________________________________________________________

	/**
	 * Builds the controls for the modeless dialog and favorite star
	 */
	FavoriteModeless.prototype.build = function(isActive, searchMoreInd) {
		var self = this;
		var element = this.mStarElement;

		this.createSelector(element, isActive);

		// --------------------------------------------------------------------
		// Executed when the star is selected
		// --------------------------------------------------------------------
		this.mSelector.setOnSelect(function() {
			self.beforeModelessDisplay(searchMoreInd);			

			// creates the modeless window
			if (self.mDetailDialog === null) {
				self.createAddModeless(element);
			}
			self.mDetailDialog.show();
			self.mSelector.setEnabled(false);
		});
	};
	
	// ________________________________________________________________________
	
	FavoriteModeless.closeModeless = function() {
		var curModeless = FavoriteModeless.current;
		
		if(!curModeless){
			return;
		}
		else if(curModeless.mDdTree){
			//add favorite modeless is displayed
			curModeless.mSelector.setEnabled(true);
			curModeless.mSelector.unselect();
			curModeless.mDdTree.destroy();
			curModeless.mDetailDialog.destroy();
			curModeless.mDetailDialog = null;
			curModeless.onClose();
			FavoriteModeless.current = null;
		}
		else{
			//remove favorite modeless is displayed
			curModeless.mSelector.select();
			curModeless.mDetailDialog.destroy();
			curModeless.mDetailDialog = null;
			FavoriteModeless.current = null;			
			curModeless.onClose();
		}
	};

	// ________________________________________________________________________

	FavoriteModeless.prototype.buildRemove = function(searchMoreInd) {
		var self = this;
		var element = this.mStarElement;

		this.createSelector(element, true);

		// --------------------------------------------------------------------
		// Executed when the star is unselected, since they are selected by default
		// --------------------------------------------------------------------
		this.mSelector.setOnUnselect(function() {
			self.beforeModelessDisplay(searchMoreInd);

			if (self.mDetailDialog === null) {

				// --------------------------------------------------------------------
				// Dialog creation
				// --------------------------------------------------------------------
				var contents = self.createModelessFromTemplate(element, self.mComponent.m_templates.removeModeless);

				self.mDetailDialog.setOnForceHide(function() {
					self.mComponent.m_resizeEnabled = true;
					self.mComponent.m_base.getTabGroup().enableAll();
					self.mSelector.select();
				});

				// --------------------------------------------------------------------
				// Remove button
				// --------------------------------------------------------------------
				var removeBtn = contents.find(".noe2-btn-remove");
				removeBtn.click(function() {

					self.mOrderElement.addClass("hide");
					self.removeOrderFromFolder(self.mOrderElement);
					self.mDetailDialog.hide();
					FavoriteModeless.current = null;

					self.onClose();
				});

				// --------------------------------------------------------------------
				// Cancel button
				// --------------------------------------------------------------------
				contents.find(".noe2-btn-cancel").click(function() {
					FavoriteModeless.closeModeless();
				});
			}

			self.mDetailDialog.show();
			self.mSelector.setEnabled(false);
		});
	};

	// ________________________________________________________________________

	/**
	 * Executed when a modeless is closed by pressing a button
	 * @returns {undefined} undefined
	 */
	FavoriteModeless.prototype.onClose = function() {
		this.mComponent.m_resizeEnabled = true;
		this.mSelector.setEnabled(true);
		this.mSelector.getElement().css("visibility", "hidden");
		FavoriteModeless.enableAllFromTab(this.mTabName);
		this.mComponent.m_displayNextFolderEnabled = true;
	};

	// ________________________________________________________________________

	/**
	 * Hides the modeless
	 * @returns {undefined} undefined
	 */
	FavoriteModeless.prototype.hide = function() {

		if (!this.mDetailDialog) {
			return;
		}
		this.mDetailDialog.hide();

		if (this.mDdTree) {
			this.mDdTree.hide();
		}

		this.onClose();
	};

	// ________________________________________________________________________

	FavoriteModeless.prototype.createModelessFromTemplate = function(element, template) {

		// renders the template
		var contents = template.render({
			i18n: i18n.discernabu.noe_o2,
			id: "modeless" + this.mComponent.getComponentId() + "" + this.mSeq
		});
		this.mContainerDiv.append(contents);

		// creates the dialog itself
		this.mDetailDialog = new MPageControls.Modeless(element, contents);
		this.mDetailDialog.setFlipReference($("#noe2" + this.mComponent.getComponentId()));
		this.mDetailDialog.setContentsCorner(["top", "right"]);
		this.mDetailDialog.setElementCorner(["bottom", "right"]);

		return contents;
	};

	// ________________________________________________________________________

	FavoriteModeless.prototype.createAddModeless = function(element) {
		var self = this;

		// ----------------------------------------------------------------
		// Modeless creation
		// ----------------------------------------------------------------
		var contents = self.createModelessFromTemplate(element, self.mComponent.m_templates.modeless);

		self.mDetailDialog.setOnForceHide(function() {
			self.mComponent.m_resizeEnabled = true;
			self.mComponent.m_base.getTabGroup().enableAll();
			self.mSelector.unselect();
		});

		// ----------------------------------------------------------------
		// Favorite Folders
		// ----------------------------------------------------------------
		self.mDdTree = new MPageControls.DropDownTree(contents.find(".noe2-folder-dropdown"));
		self.mDdTree.getElement().append($("<div class='noe2-preloader-icon'></div>"));

		// Program parameters
		var catid = 0;
		var criterion = self.mComponent.getCriterion();
		var parms = {
			"Output": "^MINE^",
			"Person Id": criterion.person_id + ".0",
			"Encounter Id": criterion.encntr_id + ".0",
			"User id": criterion.provider_id + ".0",
			"Cat Id": catid + ".0",
			"Long desc": "^FAVORITES^",
			Position: criterion.position_cd + ".0",
			PPR: criterion.ppr_cd + ".0",
			"Order mask": 4,
			"Venue type": self.mComponent.getVenueType(),
			"Get CKI": 1
		};
		var parmsArr = [];
		$.each(parms, function() {
			parmsArr.push(this);
		});

		// disable resizing so that the modeless doesnt explode
		self.mComponent.m_resizeEnabled = false;
		
		// Creates the request object
		var folderRequest = new MP_Core.ScriptRequest(self.mComponent, self.mComponent.getComponentRenderTimerName());
		folderRequest.setProgramName("mp_get_powerorder_favs_json");
		folderRequest.setAsync(true);
		folderRequest.setParameters(parmsArr);

		// Perform the request and loop through the results
		MP_Core.XMLCCLRequestCallBack(self.mComponent, folderRequest, function(reply) {
			var rootFolders = reply.getResponse().USER_FAV;

			// Identifies the default root folder as the first one in the list
			if (rootFolders.length > 0) {
				self.defaultCatId = rootFolders[0].ALT_SEL_CATEGORY_ID;
				self.mDdTree.setValue("<span class='noe2-fav-folder-icon'>&nbsp;</span>" + rootFolders[0].SHORT_DESCRIPTION);
			}
			
			// Reenable resize
			self.mComponent.m_resizeEnabled = true;
			
			// But discard the next one, because the architecture always calls resizeComponent after an ajax request
			self.mComponent.m_discardResizes = 1;
		});

		self.mDdTree.setOnCreate(function() {
			self.mDdTree.getTree().getElement().find(".dynatree-container").append($("<div class='noe2-preloader-icon'></div>"));
			self.mDdTree.getTree().getElement().addClass("noe2-tree");
		});

		self.mDdTree.setOnLazyRead(function(node) {
			self.retrieveFavorites(node);
		});
		self.mDdTree.onSelect = function(node) {
			this.setValue("<span class='noe2-fav-folder-icon'>&nbsp;</span>" + node.data.title);
			this.getSelector().unselect();
		};
		

		// ----------------------------------------------------------------
		// Add and Cancel buttons
		// ----------------------------------------------------------------
		var addBtn = contents.find(".noe2-btn-add");
		addBtn.click(function() {

			
			self.saveOrderToFolder(self.mDdTree.getSelectedNode(), self.mOrderElement);
			self.hide();
			self.mSelector.setEnabled(true);
			self.mSelector.unselect();
			self.onClose();
			FavoriteModeless.current = null;
		});

		contents.find(".noe2-btn-cancel").click(function() {
			FavoriteModeless.closeModeless();
		});
	};

	// ________________________________________________________________________

	FavoriteModeless.prototype.removeOrderFromFolder = function(orderElement) {
		var criterion = this.mComponent.getCriterion();
		var order = orderFromElement(orderElement);
		var self = this;

		// creates the script parameters
		var parms = {
			"Output": "^MINE^",
			"User Id": criterion.provider_id + ".0",
			"Folder Id": this.mComponent.m_currentFolderCatId + ".0",
			"Operation": "^DEL^",
			"List type": order.LIST_TYPE,
			"Synonym ID": order.SYN_ID,
			"Sentence ID": order.SENT_ID,
			"Pathway Catalog Id": order.PATH_CAT_ID,
			"Pathway Synonym Id": order.PATH_CAT_SYN_ID
		};
		var parmsArr = [];
		$.each(parms, function() {
			parmsArr.push(this);
		});

		// creates the script request
		var folderRequest = new MP_Core.ScriptRequest(this.mComponent, this.mComponent.getComponentRenderTimerName());
		folderRequest.setProgramName("mp_powerorder_fav_maint");
		folderRequest.setAsync(true);
		folderRequest.setParameters(parmsArr);
		MP_Core.XMLCCLRequestCallBack(self.mComponent, folderRequest, function(reply) {

			// when the favorite is removed, DESTROY THE DOM!!!
			orderElement.remove();
		});
	};

	// ________________________________________________________________________

	/**
	 * Looks for the children favorite folders of "node" by calling
	 * mp_get_powerorder_favs_json, and attaches the result as new
	 * dynatree child nodes.
	 * @param {object} node - The object that holds the favorite folders.
	 * @returns {undefined} undefined
	 */
	FavoriteModeless.prototype.retrieveFavorites = function(node) {
		var self = this;
		var criterion = self.mComponent.getCriterion();

		// If the node has a catid, then we will use that for the query.
		// Otherwise, we default to root (0).
		var catid = self.defaultCatId;
		if (node.data.selCatId) {
			catid = node.data.selCatId;
		}
		
		// disable resizing so that the modeless doesnt explode
		self.mComponent.m_resizeEnabled = false;

		// creates the script parameters
		var parms = {
			"Output": "^MINE^",
			"Person Id": criterion.person_id + ".0",
			"Encounter Id": criterion.encntr_id + ".0",
			"User id": criterion.provider_id + ".0",
			"Cat Id": catid + ".0",
			"Long desc": "^FAVORITES^",
			"Position": criterion.position_cd + ".0",
			"PPR": criterion.ppr_cd + ".0",
			"Order mask": 4,
			"Venue type": self.mComponent.getVenueType(),
			"Get CKI": 1
		};
		var parmsArr = [];
		$.each(parms, function() {
			parmsArr.push(this);
		});

		// creates the script request
		var folderRequest = new MP_Core.ScriptRequest(self.mComponent, self.mComponent.getComponentRenderTimerName());
		folderRequest.setProgramName("mp_get_powerorder_favs_json");
		folderRequest.setAsync(true);
		folderRequest.setParameters(parmsArr);

		// sends the request and adds the result to the folder tree
		MP_Core.XMLCCLRequestCallBack(self.mComponent, folderRequest, function(reply) {
			// If we cant find the element of the tree, it is because the
			// modeless has been closed. So we just quit.
			if (!self.mDdTree.getTree().getElement()) {
				self.mComponent.m_resizeEnabled = true;
				self.mComponent.m_discardResizes = 1;
				return;
			}
		
			self.mDdTree.getTree().getElement().find(".noe2-preloader-icon").remove();

			// Since the node is already added during the creation of the modelesse children are added to the created node.
			node.addChild(jsonToNodes(reply.getResponse().USER_FAV[0].CHILD_LIST));
			node.setLazyNodeStatus(DTNodeStatus_Ok);
			
			// Reenable resize
			self.mComponent.m_resizeEnabled = true;
			self.mComponent.m_discardResizes = 1;
		});
	};

	// ________________________________________________________________________

	/**
	 * Calls mp_powerorder_fav_maint in order to save the order specified by
	 * the HTML element orderElement into the dynatree folder "folderNode".
	 */
	FavoriteModeless.prototype.saveOrderToFolder = function(folderNode, orderElement) {
		var criterion = this.mComponent.getCriterion();
		var order = orderFromElement(orderElement);
		var self = this;
		var selCatId = 0;

		//If the selectedNode is null or undefined set the  catid to the catid of the folder added as root while creating of the modeless.
		if (!folderNode) {

			selCatId = self.defaultCatId;
		} 
		else {

			selCatId = folderNode.data.selCatId;

		}

		// creates the script parameters
		var parms = {
			"Output": "^MINE^",
			"User Id": criterion.provider_id + ".0",
			"Folder Id": selCatId+ ".0",
			"Operation": "^ADD^",
			"List type": order.LIST_TYPE,
			"Synonym ID": order.SYN_ID,
			"Sentence ID": order.SENT_ID,
			"Pathway Catalog Id": order.PATH_CAT_ID,
			"Pathway Synonym Id": order.PATH_CAT_SYN_ID
		};
		var parmsArr = [];
		$.each(parms, function() {
			parmsArr.push(this);
		});

		// Shows a spinner on the mine tab, because it will be updated
		if (self.mComponent.m_base.tabs.mine) {
			self.mComponent.m_base.tabs.mine.showLoading();
		}
		
		// creates the script request
		var folderRequest = new MP_Core.ScriptRequest(this.mComponent, this.mComponent.getComponentRenderTimerName());
		var currentTab = self.mComponent.m_base.getTabGroup().getCurrent();
		folderRequest.setProgramName("mp_powerorder_fav_maint");
		folderRequest.setAsync(true);
		folderRequest.setParameters(parmsArr);
		MP_Core.XMLCCLRequestCallBack(self.mComponent, folderRequest, function(reply) {


			var folderId = selCatId;
			if (folderId == self.mRootFolderId) {
				folderId = 0;
			}

			// when the favorite is added, update mine tab
			self.mComponent.m_base.refreshRecordData(currentTab);
			
			// since refreshRecordData calls getNewOrderEntryData, this
			// counter has to be updated with the correct count for that
			// function, plus the current call
			self.mComponent.m_discardResizes = 3;
		});
	};

	// ________________________________________________________________________

	FavoriteModeless.prototype.destroy = function() {
		if (this.mDetailDialog) {
			this.mDetailDialog.destroy();
		}

		if (this.mDdTree) {
			this.mDdTree.destroy();
		}
		this.mSelector.destroy();
	};

	// ________________________________________________________________________

	/**
	 * Returns a dynatree node object from a given json returned
	 * from mp_get_powerorder_favs_json
	 */
	function jsonToNodes(json) {
		var nodes = [];

		$.each(json, function() {

			// we only want folders
			if (this.LIST_TYPE != 1) {
				return;
			}

			nodes.push({
				"title": this.SYNONYM,
				"selCatId": this.CHILD_ALT_SEL_CAT_ID,
				"isFolder": true,
				"isLazy": true
			});
		});

		return nodes;
	}

	// ________________________________________________________________________

	/**
	 * Retrieves order information from a given DOM element
	 */
	function orderFromElement(element) {
		var params = element.find(".noe2-params").html().split("|");
		var result = {
			"PATH_CAT_ID": "0.0",
			"PATH_CAT_SYN_ID": "0.0",
			"LIST_TYPE": "0",
			"SYN_ID": "0.0",
			"SENT_ID": "0.0"
		};

		if (params.length == 2) {
			// It's a powerorder

			result.PATH_CAT_ID = params[0];
			result.PATH_CAT_SYN_ID = params[1];
			result.LIST_TYPE = "6";
			return result;
		}
		//only two possibilities for Orders either normal order or powerplan
		if ((params.length == 3)||(params.length == 4)) {
			// It's a regular order

			result.SYN_ID = params[0];
			result.SENT_ID = params[2];
			result.LIST_TYPE = "2";
			return result;
		}

		return null;

	}

	// ________________________________________________________________________

	/**
	 * Gathers all the elements that have .noe2-order class and creates the
	 * star control on them.
	 */
	function createFavoriteStars(component, tabName) {

		/**
		 * "There is a theory which states that if anyone discovers exactly what
		 * the Universe is for and why it is here, it will instantly disappear
		 * and be replaced by something even more bizarre and inexplicable.
		 * There is another which states that this has already happened."
		 * -- Douglas Adams
		 */
        // --------------------------------------------------------------------
		// Do not add favorite maintenance to the Home tab
		// --------------------------------------------------------------------
		if (tabName == "Home"){
			return;
		}	
		component.m_resizeEnabled = false;

		// --------------------------------------------------------------------
		// Definitions
		// --------------------------------------------------------------------
		var tabClass = null;

		if (tabName === "SearchResults") {
			tabClass = ".noe2-search-results-sec";
		}
		else {
			tabClass = ".noe2-" + tabName.toLowerCase() + "-sec";
		}
		var containerDiv = $($("#noe2" + component.getComponentId()).find(".noe2-body").find(tabClass).get(0));
		var orders = containerDiv.find(".noe2-order");
		var modelessCache = component.m_modelessCache;
		var foundCurrent = false;
		var currentModeless = FavoriteModeless.current;

		// --------------------------------------------------------------------
		// Cycles through each order and builds the star with the modeless
		// --------------------------------------------------------------------
		$.each(orders, function(i, order){

			// --------------------------------------------------------------------
			// Finds the suitable div for the modeless and creates it
			// --------------------------------------------------------------------

			// Gets the star div
			var starDiv = $(order).find("." + FavoriteModeless.activeCls);
			var isActive = true;

			// If we don't get an active star, try to get an inactive one
			if (starDiv.length === 0) {
				starDiv = $(order).find("." + FavoriteModeless.disabledCls);
				isActive = false;
			}
			
			// Shared and Public have inactive stars by default
			if (tabName != "Mine") {
				isActive = false;
			}

			// --------------------------------------------------------------------
			// Add the hover events and display/hide favorites star
			// --------------------------------------------------------------------
			$(this).hover(function() {
				starDiv.css({
					"visibility": "visible"
				});
			}, function() {
				// do not hide if the dialog for the star is opened
				var current = FavoriteModeless.current;
				if (current && current.mOrderElementId == $(this).attr("id") && current.mDetailDialog && current.mDetailDialog.getVisible()) {
					return;
				}

				starDiv.css({
					"visibility": "hidden"
				});
			});

			// --------------------------------------------------------------------
			// Manage existing modeless
			// --------------------------------------------------------------------

			// If this order matches the current selected one, it means that
			// the star has already been created for this modeless. In this
			// case, we just change the element of the existing modeless.
			//
			// This can happen in the cases where createFavoriteStars is
			// called while there is a modeless open, like in the arrow
			// hovers or while resizing.
			if (currentModeless && currentModeless.mOrderElementId == $(order).attr("id")) {
				currentModeless.setStarElement(starDiv);
				
				// updates the selector
				currentModeless.mSelector.setElement(starDiv);
				currentModeless.mSelector.init();
				
				// updates the order element references
				currentModeless.mOrderElement = starDiv.closest(".noe2-order");
				currentModeless.mOrderElementId = currentModeless.mOrderElement.attr("id");

				// if a detail dialog was created, update that as well
				if (currentModeless.mDetailDialog) {
					currentModeless.mDetailDialog.setElement(starDiv);
					currentModeless.mDetailDialog.updatePosition();
					currentModeless.mDetailDialog.autoFlipUp();
				}

				foundCurrent = true;
				return true;
			}

			// --------------------------------------------------------------------
			// Builds the modeless instance
			// --------------------------------------------------------------------
			var modeless = new FavoriteModeless(containerDiv, component, tabName, starDiv);
			var searchMore = component.isOrderSearchInd();
			if (tabName == "Mine") {
				modeless.buildRemove(starDiv, searchMore);
			}
			else {
				modeless.build(isActive, searchMore);
			}
		});

		// if there is a modeless open, then disable the rest
		if (foundCurrent) {
			FavoriteModeless.disableAllFromTab(tabName);
		}

		component.m_resizeEnabled = true;
	}

	// ________________________________________________________________________

	return {
		
		GetNewOrderEntryData: function(component, callback) {
			if (!CERN_BrowserDevInd) {
				component.initPendingSR();
			}
			var criterion = component.getCriterion();
			var componentId = component.getComponentId();
			var noei18n = i18n.discernabu.noe_o2;
			
			component.m_base = new MPageComponents.NewOrderEntry();
			component.m_base.setTargetElementId("noe2Content" + componentId);
			component.m_base.setTemplates(MPageComponents.NewOrderEntry.Templates.option2);
			component.m_base.setSuggestionLimit(20);
			component.m_base.loadLegacyComponent(component, 
					CERN_NEW_ORDER_ENTRY_O2,
					noei18n);
			component.m_base.setTimerNames({
				"ORDER": {										
					"MINE": "CAP:MPG NEW ORDER ENTRY O2 MINE ORDER",
					"PUBLIC": "CAP:MPG NEW ORDER ENTRY O2 PUBLIC ORDER",
					"SHARED": "CAP:MPG NEW ORDER ENTRY O2 SHARED ORDER",
					"SEARCHRESULTS": "CAP:MPG NEW ORDER ENTRY O2 CLICK ON ORDER FROM SEARCH"
				},
				"SEARCH": "CAP:MPG NEW ORDER ENTRY O2 SEARCH",
				"ORDER_ADDTOSCRATCHPAD":{				
					"MINE": "CAP:MPG NEW ORDER ENTRY O2 ADD TO SCRATCHPAD ORDER FROM MINE TAB",
					"PUBLIC": "CAP:MPG NEW ORDER ENTRY O2 ADD TO SCRATCHPAD ORDER FROM PUBLIC TAB",
					"SEARCHRESULTS": "CAP:MPG NEW ORDER ENTRY O2 ADD TO SCRATCHPAD FROM SEARCH"
				}				
			});
			
			//Decide what should be the tab mask, default to home if either of tab is enabled.
			var tabMask = component.isUserFavEnabled() || component.isPublicFavEnabled() || component.isSharedFavEnabled()? 384 :0; 
			component.m_base.requestRecordData(callback, tabMask);
		},
		RenderComponent: function(replyAr, component) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try {
				var i, j, k, l;
				var recordFavs = replyAr.getResponse();
        		var recordFavsSuccess = replyAr.getStatus();
				var noei18n = i18n.discernabu.noe_o2;
				var componentId = component.getComponentId();
				var noeBase = component.m_base;
				var countText = "";

				noeBase.setShowOrderSentenceDetailUserPref(!!recordFavs.FILTER_ORDER_SENTENCES); //Double ! to ensure a boolean is being set, not 1/0

				//see whether the tab is set to on in Bedrock. *NOTE: For now the Frequent tab has no Bedrock filter so it will always be false
				var mineTabOn = component.isUserFavEnabled();
				var sharedTabOn = component.isSharedFavEnabled();
				
				//setup arrays, mysearch, and values needed for executing scripts
				var noeMineArr = null;
				var noePublicArr = null;
				var venueTypeList = null;
				if (recordFavsSuccess) {
					//Set the Future_New_Order at base so that other functions can use it.					
					noeBase.setFutureOrderMessagePref(recordFavs.FUTURE_NEW_ORDER);
					noeBase.setDischNewOrderPref(recordFavs.DSCH_NEW_ORDER);			
					if(noeBase.getDischNewOrderPref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT){
						component.setVenueType(2);
					}
					//Checks whether the FUTURE_NEW_ORDER is not set to Reject(2).
					// If it set, then prevent creation of the venue.   
					if(noeBase.getFutureOrderMessagePref() !== MPageComponents.NewOrderEntry.NewOrderPref.REJECT){ 
						noeMineArr = recordFavs.USER_FAV;
						noePublicArr = recordFavs.PUBLIC_FAV;
						noeHomeArr = recordFavs.HOME_FAV;
	                    
						if (noeHomeArr.length > 0) {
							component.setHomeFavEnabled(true);
							homeTabOn = true;
						}
						
						//Orders search settings retrieval
						component.setVirtViewOrders(recordFavs.VIRTVIEWVO);
						component.setVirtViewRxOrders(recordFavs.VIRTVIEWRX);
						component.setPlanFavEnabled(recordFavs.VIEWPLANFAVS);
						component.setDispOnlyProductLevelMeds(recordFavs.VIEWPLORDERS);
						component.setFacilityId(recordFavs.FACILITYID);
						component.setEncntrTypeCd(recordFavs.ENCNTRTYPECD);
						component.setFavoritesSortPref(recordFavs.FAVORITES_SORT);
						component.setAmbulatoryEnctrGrpFlag(recordFavs.ENCNTR_VENUE_FLAG);
						venueTypeList = recordFavs.VENUE_TYPE_LIST;
						//if venue type menu already exists, do not add another one.
						//this situation will occur after the event fires to "refresh" the component
						var venueTypeMenuDiv = _g("noeHdVenueType" + componentId);
						if (!venueTypeMenuDiv && venueTypeList) {
							if(noeBase.getDischNewOrderPref() === MPageComponents.NewOrderEntry.NewOrderPref.REJECT){
								noeBase.createDisabledVenue(venueTypeList[0]);
							}else{
								CERN_NEW_ORDER_ENTRY_O2.CreateVenueTypeMenu(componentId, venueTypeList);								
							}
							
						}
					}
					//This call to the CreateFutureOrderMessageBar method is a hack to
					//append a div that will hold the future order message. Will get rid of it once, 
					//standard menu is implemented for venues.
					CERN_NEW_ORDER_ENTRY_O2.CreateFutureOrderMessageBar(componentId);
					
					
				}

				//setup class variables
				var segCtrlClass = "noe2-seg-cont";
				var searchResultsActiveClass = "inactive";
				
				MP_Util.Doc.FinalizeComponent("", component, countText);

				//create Id used in SelectTab
				var compBodyId = "noeContentBody" + componentId;
				//Add the click action to the frequent tab
				var freqTabId = 'freqTab' + componentId;
				curTab = _g(freqTabId);
				if (curTab) {
					Util.addEvent(curTab, "click", function() {
						if (!component.m_enableTabChange) {
							return;
						}
						FavoriteModeless.closeModeless();
						CERN_NEW_ORDER_ENTRY_O2.SelectTab(compBodyId, 0, freqTabId);
						createFavoriteStars(component);
					});
				}
				
				// checks whether the FAVORITES_SORT value and calls the ApplySortToFavorites method for the Mine and the Shared tab					
				if (component.getFavoritesSortPref()) {
					if (mineTabOn) {
						CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, "Mine");
					}
					if (sharedTabOn) {
						CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, "Shared");
					}
					//Applies the sort to the Home tab if it has a user owned folder
					if (component.getHomeOwnerId()) {

						CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, "Home");
					}
				}
			
				// ------------------------------------------------------------
				// INITIALIZE BASE COMPONENT
				// ------------------------------------------------------------
				noeBase.setRecordData(recordFavs);
        		noeBase.init();
				//Add autosuggest control to the component if the search is on and noeMineArr or noePublicArr is not null
				if ((noeMineArr || noePublicArr) && component.isOrderSearchInd()) {
					//MP_Util.AddAutoSuggestControl(component, CERN_NEW_ORDER_ENTRY_O2.SearchOrders, CERN_NEW_ORDER_ENTRY_O2.HandleSelection, CERN_NEW_ORDER_ENTRY_O2.CreateSuggestionLine);
					CERN_NEW_ORDER_ENTRY_O2.ApplySearchSettings(component);
				}
        		//Add the health plan menu
        		component.retrieveHealthPlanSelector();

			}
			catch (err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				var errMsg = [];
				if ( err instanceof Error) {
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
		
		/**
		 * Creates tab scrolling, divides into columns, and creates the 
		 * favoriteStars once the tab has been added to the DOM
		 *
		 * @param component
         * @param jsonReply
		 * @param activeTab
		 */
		InitializeTab: function(component, jsonReply, activeTab) {
			var componentId = component.getComponentId();
			
			if (component.getFavoritesSortPref() && activeTab != "Home") {
				CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, activeTab);
			}
			
			//Build columns
			CERN_NEW_ORDER_ENTRY_O2.BuildColumns(jsonReply, activeTab, component);
			//Set dimensions for container div and wrapper
			CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(activeTab, componentId);
			//snap scrolling functionality
			CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(activeTab, componentId);
			//create favorite star icons
			createFavoriteStars(component, activeTab);	
		},
		
		
		RenderHomeTab: function(component, jsonReply) {
			var homeSec = ["<div class='noe2-group noe2-home-sec'>"];
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var venueType = (component.getVenueType() === 2 ? 1 : 0);
			var recordFavs = jsonReply;
			var noeHomeArr = recordFavs.HOME_FAV;
			
			//setup Home tab
			var homeCnt = 0;
			var homeMyFavPlansFolder = [];
			var rootHomeFolderOwnerId = 0;
			var rootHomeFolderName = "";
			if(recordFavs.HOME_FAV[0]) {
				rootHomeFolderOwnerId = recordFavs.HOME_FAV[0].OWNER_ID;
				rootHomeFolderName = recordFavs.HOME_FAV[0].LONG_DESCRIPTION_KEY_CAP;
			}
			if (component.isPowerPlanEnabled() && component.isPlanFavEnabled() && rootHomeFolderOwnerId > 0 && rootHomeFolderName === "FAVORITES" && !component.isDischargeAsRxVenue()) { //home folder is a user favorite
				//create My Favorite Plans hardcoded folder
				homeCnt++;
				homeMyFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsFolderRow", homeCnt, "' class='noe2-info noe2-info-folder' sort='folder-home' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"Home\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
			}
			if (noeHomeArr) {
				//component.m_noeHomeArr = noeHomeArr;

				var homeLength = noeHomeArr.length;
				if (homeLength === 0) {
					homeSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
				}
				else {
					var homeChildFavFolder = [];
					var homeChildFavFolderItems = [];
					var homeSecondaryFavFolder = [];
					for ( i = 0; i < homeLength; i++) {
						var noeFavsObj = noeHomeArr[i];
						//account for multiple favorite folders per venue
						//Only display folder path and My Plan Favorites folder once
						if (i === 0) {
							var folderOwnerId = noeFavsObj.OWNER_ID;
							if (folderOwnerId !== 0) {
								component.setHomeOwnerId(folderOwnerId);
							}

							homeSec.push("<div id='rootHome", componentId, "' class='noe2-fav-path hdr'><dl id='folderPathHome", componentId, "' class='noe2-folder-info'><dt>0</dt><dd class='noe2-fav-folder' sort='folder-home'><span id='folderPathHomeRoot", componentId, "' class='noe2-top-folder-icon'' title='" + noeFavsObj.SHORT_DESCRIPTION + "';>", "</span></dd><dt>0</dt><dd class='noe2-fav-folder'><span class='noe2-fav-folder-disp-name'>",noeFavsObj.SHORT_DESCRIPTION, "</span></dd></dl></div>", "<div id='folderContentsHome", componentId, "' class='noe2-main-container'>");
							//push column wrapper and first column
							homeSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers("Home", componentId));

							//Create the rest of the folders/orders/caresets/PowerPlans
							noeItemArr = noeFavsObj.CHILD_LIST;
							component.setNOEHomeItemArray(noeItemArr);
							for ( j = 0, k = noeItemArr.length; j < k; j++) {
								noeItem = noeItemArr[j];
								noeRow = [];
								noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1:
										//Favorite Folder
										homeCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsFolderRow", homeCnt, "' class='noe2-info noe2-info-folder' sort='folder-home' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"Home\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										homeChildFavFolder = homeChildFavFolder.concat(noeRow);
										break;
									case 2:
										//Order Synonym
										homeCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6) {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsOrderRow", homeCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-home'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Home", componentId, "favsOrderRow", homeCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0 |", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsOrderRow", homeCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' data-cki='", noeItem.CKI,"' class='noe2-info noe2-order' sort='orderable-home'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Home", componentId, "favsOrderRow", homeCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										homeChildFavFolderItems = homeChildFavFolderItems.concat(noeRow);
										break;
									case 3:
										//Home Health Problem
										break;
									case 4:
										//Reference Task
										break;
									case 5:
										//IV Favorites
										break;
									case 6:
										//PowerPlan
										homeCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsPlanRow", homeCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-home'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Home", componentId, "favsPlanRow", homeCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										homeChildFavFolderItems = homeChildFavFolderItems.concat(noeRow);
										break;
									case 7:
										//Regimen Synonym
										break;
								}
							}
						}
						else {
							homeCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
								folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								homeSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsFolderRow", homeCnt, "' class='noe2-info noe2-info-folder' sort='folder-home' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Home\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
							else {
								homeSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Home", componentId, "favsFolderRow", homeCnt, "' class='noe2-info noe2-info-folder' sort='folder-home' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Home\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
						}

					}
					if (!homeCnt) {
						homeSec.push("<span class='res-none'>", (noeHomeArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
					}
					else {
						//add items in sorted order
						homeSec = homeSec.concat(homeMyFavPlansFolder, homeChildFavFolder, homeSecondaryFavFolder, homeChildFavFolderItems);
					}
					homeSec.push("</div></div></div>");
					//Add the right side panel hover zone for scrolling
					homeSec.push("<div id='rightSidebar", "Home" + componentId, "' class='noe2-right-sidebar'></div>");
					homeSec.push("</div>");
					//ends <div id='folderContentsHome",componentId,"'>
				}
			}
			return homeSec.join("");
		},
		
		CreateHomeTabEvents: function(component, jsonReply) {
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var venueType = (component.getVenueType() === 2 ? 1 : 0);
			var recordFavs = jsonReply;
			
			if (component.getFavoritesSortPref() && component.getHomeOwnerId()) {
				CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, "Home");
			}
			
			CERN_NEW_ORDER_ENTRY_O2.InitializeTab(component, jsonReply.HOME_FAV, "Home");
			
			//Add the click action to the home tab
			var homeTabId = 'homeTab' + componentId;
			curTab = _g(homeTabId);
			if (curTab) {
				Util.addEvent(curTab, "click", function() {
					if (!component.m_enableTabChange) {
						return;
					}
					FavoriteModeless.closeModeless();
					createFavoriteStars(component, "Home");
					CERN_NEW_ORDER_ENTRY_O2.SelectTab(compBodyId, 4, homeTabId);
					CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeMineArr, "Home", component);
				});
			}

			var homeFolderPathId = 'folderPathHome' + componentId;
			var homeFolderPath = _g(homeFolderPathId);
			if (homeFolderPath) {
				Util.addEvent(homeFolderPath, "click", function(e) {
					if((e.srcElement.tagName).toLowerCase()=="span"){
						var folder = e.target || e.srcElement;
						var folderId = Util.gps(Util.gp(folder));
						if (folderId.innerHTML != "-1") {
							CERN_NEW_ORDER_ENTRY_O2.DisplaySelectedFolder(component, folderId.innerHTML, "Home");
						}
					}
				});
			}			
		},
		
		RenderMineTab: function(component, jsonReply) {
			var noeMineArr = jsonReply.USER_FAV;
			var noei18n = i18n.discernabu.noe_o2;
			var mineSec = ["<div class='noe2-group noe2-mine-sec'>"];
			var componentId = component.getComponentId();
			var venueType = (component.getVenueType() === 2 ? 1 : 0);
			var recordFavs = jsonReply;
			
			//setup Mine tab
			var mineCnt = 0;
			var mineMyFavPlansFolder = [];
			if (component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()) {
				//create My Favorite Plans hardcoded folder
				mineCnt++;
				mineMyFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
			}

			if (noeMineArr) {
				component.m_noeMineArr = noeMineArr;

				var mineLength = noeMineArr.length;
				if (mineLength + mineMyFavPlansFolder.length === 0) {
					mineSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
				}
				else {
					var mineChildFavFolder = [];
					var mineChildFavFolderItems = [];
					var mineSecondaryFavFolder = [];
					for ( i = 0; i < mineLength; i++) {
						var noeFavsObj = noeMineArr[i];
						//account for multiple favorite folders per venue
						//Only display folder path and My Plan Favorites folder once
						if (i === 0) {
							mineSec.push("<div id='rootMine", componentId, "' class='noe2-fav-path hdr'><dl id='folderPathMine", componentId, "' class='noe2-folder-info'><dt>0</dt><dd class='noe2-fav-folder'><span id='folderPathMineRoot", componentId, "' class='noe2-top-folder-icon' title='" + noeFavsObj.SHORT_DESCRIPTION + "';></span></dd><dt>0</dt><dd class='noe2-fav-folder'><span class='noe2-fav-folder-disp-name'>", noeFavsObj.SHORT_DESCRIPTION,"</span></dd></dl></div><div id='folderContentsMine", componentId, "' class='noe2-main-container'>");

							//push column wrapper and first column
							mineSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers("Mine", componentId));

							//Create the rest of the folders/orders/caresets/PowerPlans
							noeItemArr = noeFavsObj.CHILD_LIST;
							component.setNOEMineItemArray(noeItemArr);
							for ( j = 0, k = noeItemArr.length; j < k; j++) {
								noeItem = noeItemArr[j];
								noeRow = [];
								noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1:
										//Favorite Folder
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										mineChildFavFolder = mineChildFavFolder.concat(noeRow);
										break;
									case 2:
										//Order Synonym
										mineCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6) {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-mine'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Mine", componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' data-cki='", noeItem.CKI,"' class='noe2-info noe2-order' sort='orderable-mine'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Mine", componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										mineChildFavFolderItems = mineChildFavFolderItems.concat(noeRow);
										break;
									case 3:
										//Home Health Problem
										break;
									case 4:
										//Reference Task
										break;
									case 5:
										//IV Favorites
										break;
									case 6:
										//PowerPlan
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-mine'><span class='noe2-fav-star-active-icon'></span><button type='button' id='", "Mine", componentId, "favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										mineChildFavFolderItems = mineChildFavFolderItems.concat(noeRow);
										break;
									case 7:
										//Regimen Synonym
										break;
								}
							}
						}
						else {
							mineCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
								folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								mineSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
							else {
								mineSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Mine", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-mine' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
						}

					}
					if (!mineCnt) {
						mineSec.push("<span class='res-none'>", (noeMineArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
					}
					else {
						//add items in sorted order
						mineSec = mineSec.concat(mineMyFavPlansFolder, mineChildFavFolder, mineSecondaryFavFolder, mineChildFavFolderItems);
						component.m_currentFolderCatId = recordFavs.USER_FAV[0].ALT_SEL_CATEGORY_ID;
					}
					mineSec.push("</div></div></div>");
					//Add the right side panel hover zone for scrolling
					mineSec.push("<div id='rightSidebar", "Mine" + componentId, "' class='noe2-right-sidebar'></div>");
					mineSec.push("</div>");
					//ends <div id='folderContentsMine",componentId,"'>
				}				
				return mineSec.join("");
			}
		},
		
		CreateMineTabEvents: function(component, jsonReply) {
			var componentId = component.getComponentId();
			
			CERN_NEW_ORDER_ENTRY_O2.InitializeTab(component, jsonReply.USER_FAV, "Mine");
			
			//Add the click action to the favs tab
			var mineTabId = 'mineTab' + componentId;
			curTab = _g(mineTabId);
			if (curTab) {
				Util.addEvent(curTab, "click", function() {
					if (!component.m_enableTabChange) {
						return;
					}
					FavoriteModeless.closeModeless();
					createFavoriteStars(component, "Mine");
					CERN_NEW_ORDER_ENTRY_O2.SelectTab(compBodyId, 1, mineTabId);

					if (component.m_refreshMineTab) {
						CERN_NEW_ORDER_ENTRY_O2.DisplaySelectedFolder(component, 0, "Mine");
						createFavoriteStars(component, "Mine");
						component.m_refreshMineTab = false;
						return;
					}

					CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeMineArr, "Mine", component);
				});
			}
			var folderPathId = 'folderPathMine' + componentId;
			var folderPath = _g(folderPathId);
			if (folderPath) {
				Util.addEvent(folderPath, "click", function(e) {				
					if((e.srcElement.tagName).toLowerCase()=="span"){
						var folder = e.target || e.srcElement;
						var folderId = Util.gps(Util.gp(folder));
						if (folderId.innerHTML != "-1") {
							CERN_NEW_ORDER_ENTRY_O2.DisplaySelectedFolder(component, folderId.innerHTML, "Mine");
						}
					}
					
				});
			}
		},
		
		RenderSharedTab: function(component) {
			var componentId = component.getComponentId();
			var sharedSec = ["<div class='noe2-group noe2-shared-sec'>"];
			var prsnlSearchCtrl = "prsnlSearchCtrl";
			
			sharedSec.push("<div class='noe2-shared-search-container'>");
			sharedSec.push("<div id='rootShared", componentId, "' class='noe2-fav-path hdr'></div>");
			sharedSec.push(MP_Util.CreateAutoSuggestBoxHtml(component, prsnlSearchCtrl));
			sharedSec.push("<div id='clearPrsnlSearch", componentId, "' class='noe2-clear-search'><span class='noe2-clear-button'>", "</span></div>");
			sharedSec.push("<div style='clear:both'></div></div>");
			sharedSec.push("<div id='sharedTabShell", componentId, "' class='noe2-plan-group-shared-name'></div>", "<div id='sharedTabHTML", componentId, "' class='noe2-plan-group-shared-plans'>", "</div>");
			return sharedSec.join("");
		},
		
		CreateSharedTabEvents: function(component, recordData) {
			var componentId = component.getComponentId();
			var sharedTabId = 'sharedTab' + componentId;
			var compNameSpace = component.getStyles().getNameSpace();
			curTab = _g(sharedTabId);
			var prsnlSearchBoxDivId = compNameSpace + "prsnlSearchCtrl" + componentId;
			var prsnlSearchBoxDiv = _g(prsnlSearchBoxDivId);
			var prsnlSearchBoxObj = $(".noe2-shared-sec").find(".search-box-div");
			var prsnlInput = $("#noe2prsnlSearchCtrl" + componentId);
			var clearPrsnlButton = $("#clearPrsnlSearch" + componentId).find(".noe2-clear-button");
			var breadcrumbsDiv = $("#rootShared" + componentId);
			var prsnlInputInd = false;
			var prsnlSearchCtrl = "prsnlSearchCtrl";
			var noei18n = i18n.discernabu.noe_o2;
			
			//Add personnel autosuggest control to the component
			MP_Util.AddAutoSuggestControl(component, CERN_NEW_ORDER_ENTRY_O2.Debounce(CERN_NEW_ORDER_ENTRY_O2.SearchPrsnl), CERN_NEW_ORDER_ENTRY_O2.HandlePrsnlSelection, CERN_NEW_ORDER_ENTRY_O2.CreatePrsnlSuggestionLine, prsnlSearchCtrl);
			
			//Add the click action to the PrsnlSearchBox tab
			if (prsnlSearchBoxDiv) {
				Util.Style.acss(prsnlSearchBoxDiv, "noe2-search-default");
				prsnlSearchBoxDiv.value = noei18n.PROVIDER_SEARCH;
				
				prsnlSearchBoxObj.addClass("noe2-prsnl-search-box");
				if (breadcrumbsDiv.length !== 0) {
					breadcrumbsDiv.addClass("noe2-shared-fav-path");
				}
				Util.addEvent(prsnlSearchBoxDiv, "focus", function() {
					Util.Style.rcss(prsnlSearchBoxDiv, "noe2-search-default");
					Util.Style.acss(prsnlSearchBoxDiv, "noe2-search");
					if (!prsnlInputInd) {
						prsnlSearchBoxDiv.value = "";
					}
					FavoriteModeless.closeModeless();
				});
				Util.addEvent(prsnlSearchBoxDiv, "blur", function() {
					if (prsnlSearchBoxDiv.value === "") {
						prsnlInput.removeAttr("style");
						Util.Style.rcss(prsnlSearchBoxDiv, "noe2-search");
						Util.Style.acss(prsnlSearchBoxDiv, "noe2-search-default");
						prsnlSearchBoxDiv.value = noei18n.PROVIDER_SEARCH;
					}
				});
		
				prsnlSearchBoxObj.keyup(function() {
					prsnlInputInd = true;
					clearPrsnlButton.fadeIn("slow").css({
						"display": "inline-block"
					});
					if ($.trim(prsnlInput.val()) === "") {
						prsnlInputInd = false;
						clearPrsnlButton.fadeOut("slow");
					}
				});
				clearPrsnlButton.click(function() {
					prsnlInputInd = false;
					prsnlInput.val("");
					prsnlInput.removeAttr("style");
					Util.Style.acss(prsnlSearchBoxDiv, "noe2-search-default");
					prsnlSearchBoxDiv.value = noei18n.PROVIDER_SEARCH;
					$(this).hide();
				});
			}
		},
		
		RenderPublicTab: function(component, jsonReply) {
			var noePublicArr = jsonReply.PUBLIC_FAV;
			var publicSec = ["<div class='noe2-group noe2-public-sec'>"];
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var venueType = (component.getVenueType() === 2 ? 1 : 0);
			
			//setup Public tab
			var publicCnt = 0;
			if (noePublicArr) {
				var publicLength = noePublicArr.length;
				if (publicLength === 0) {
					publicSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
				}
				else {
					var publicChildFavFolder = [];
					var publicChildFavFolderItems = [];
					var publicSecondaryFavFolder = [];
					for ( i = 0; i < publicLength; i++) {
						var noePublicObj = noePublicArr[i];

						//account for multiple favorite folders per venue
						//Only display folder path once
						if (i === 0) {
							
							publicSec.push("<div id='rootPublic", componentId, "' class='noe2-fav-path hdr'><dl id='folderPathPublic", componentId, "' class='noe2-folder-info'><dt>0</dt><dd class='noe2-fav-folder'><span id='folderPathPublicRoot", componentId, "' class='noe2-top-folder-icon'' title='" + noePublicObj.SHORT_DESCRIPTION + "';>", "</span></dd><dt>0</dt><dd class='noe2-fav-folder'><span class='noe2-fav-folder-disp-name'>",noePublicObj.SHORT_DESCRIPTION, "</span></dd></dl></div>", "<div id='folderContentsPublic", componentId, "' class='noe2-main-container'>");

							//push column wrapper and first column
							publicSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers("Public", componentId));

							//Create the rest of the folders/orders/caresets/PowerPlans
							noeItemArr = noePublicObj.CHILD_LIST;
							component.setNOEPublicItemArray(noeItemArr);
							for ( j = 0, k = noeItemArr.length; j < k; j++) {
								noeItem = noeItemArr[j];
								noeRow = [];
								noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1:
										//Favorite Folder
										publicCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsFolderRow", publicCnt, "' class='noe2-info noe2-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"Public\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										publicChildFavFolder = publicChildFavFolder.concat(noeRow);
										break;
									case 2:
										//Order Synonym
										publicCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6) {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsOrderRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-public'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Public", componentId, "favsOrderRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsOrderRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID, "' data-cki='", noeItem.CKI, "' class='noe2-info noe2-order' sort='orderable-public'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Public", componentId, "favsOrderRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										publicChildFavFolderItems = publicChildFavFolderItems.concat(noeRow);
										break;
									case 3:
										//Home Health Problem
										break;
									case 4:
										//Reference Task
										break;
									case 5:
										//IV Favorites
										break;
									case 6:
										//PowerPlan
										publicCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsPlanRow", publicCnt, "Id", noePublicObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-public'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Public", componentId, "favsPlanRow", publicCnt, "BtnId", noePublicObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										publicChildFavFolderItems = publicChildFavFolderItems.concat(noeRow);
										break;
									case 7:
										//Regimen Synonym
										break;
								}
							}
						}
						else {
							publicCnt++;
							if (noePublicObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noePublicObj.SOURCE_COMPONENT_FLAG === 2 || noePublicObj.SOURCE_COMPONENT_FLAG === 3)) {
								folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								publicSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsFolderRow", publicCnt, "' class='noe2-info noe2-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noePublicObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Public\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noePublicObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
							else {
								publicSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Public", componentId, "favsFolderRow", publicCnt, "' class='noe2-info noe2-info-folder' sort='folder-public' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noePublicObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Public\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noePublicObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noePublicObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
						}
					}
					if (!publicCnt) {
						publicSec.push("<span class='res-none'>", (noePublicArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
					}
					else {
						//add items in sorted order
						publicSec = publicSec.concat(publicChildFavFolder, publicSecondaryFavFolder, publicChildFavFolderItems);
					}
					publicSec.push("</div></div></div>");
					//Add the right side panel hover zone for scrolling
					publicSec.push("<div id='rightSidebar", "Public" + componentId, "' class='noe2-right-sidebar'></div>");
					publicSec.push("</div>");
					//ends <div id='folderContentsPublic",componentId,"'>
				}
			}
			
			return publicSec.join("");

		},
		
		CreatePublicTabEvents: function(component, jsonReply) {
			var componentId = component.getComponentId();
			var publicFolderPathId = 'folderPathPublic' + componentId;
			var publicFolderPath = _g(publicFolderPathId);
			CERN_NEW_ORDER_ENTRY_O2.InitializeTab(component, jsonReply.PUBLIC_FAV, "Public");
			
			if (publicFolderPath) {
				Util.addEvent(publicFolderPath, "click", function(e) {
					if((e.srcElement.tagName).toLowerCase()=="span"){
						var folder = e.target || e.srcElement;
						var folderId = Util.gps(Util.gp(folder));
						if (folderId.innerHTML != "-1") {
							CERN_NEW_ORDER_ENTRY_O2.DisplaySelectedFolder(component, folderId.innerHTML, "Public");
						}
					}
				});
			}
			//Add the click action to the public tab
			var publicTabId = 'publicTab' + componentId;
			curTab = _g(publicTabId);
			if (curTab) {
				Util.addEvent(curTab, "click", function() {
					if (!component.m_enableTabChange) {
						return;
					}
					FavoriteModeless.closeModeless();
					createFavoriteStars(component, "Public");
					CERN_NEW_ORDER_ENTRY_O2.SelectTab(compBodyId, 2, publicTabId);
					CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeMineArr, "Public", component);
				});
			}
		},
		/**
		 * Create menu just below component header to allow user to change the venue type
		 * @param {int} componentId : Component Id, passed in as an int
		 * @param {object} venueTypeList : A list of available venues (only discharge and inpatient),
		 * 		pulled from the code set
		 */
		CreateVenueTypeMenu: function(componentId, venueTypeList) {
			var noei18n = i18n.discernabu.noe_o2;
			//get component object
			var intComponentId = parseInt(componentId, 10);
			var component = MP_Util.GetCompObjById(intComponentId);
			if (!component) {
				component = MP_Util.GetCompObjById(componentId);
			}
			var venueType = component.getVenueType();
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var compId = style.getId();
			var loc = component.getCriterion().static_content;
			var mnuId = compId + "Mnu";
			var m_contentNode = component.getRootComponentNode();
			if (m_contentNode) {
				var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
				var mnuDisplay = "";
				//currently selected menu option display
				var mnuVenueType = 0;
				//currently selected menu option venue type
				var mnuNextDisplay = "";
				//next menu option display
				var mnuNextVenueType = 0;
				
				//next menu option venue type
				var x;
				var xl;
				var newVenue;
				if (venueType === 1) {//Inpatient or Ambulatory Encounter (venue type = 1 or 3)
					for ( x = 0, xl = venueTypeList.length; x < xl; x++) {
						newVenue = venueTypeList[x];
						if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2) {
							//set next menu options
							mnuNextDisplay = newVenue.DISPLAY;
							mnuNextVenueType = 2;
						}
						else {
							//set currently selected menu option
							mnuDisplay = newVenue.DISPLAY;
							mnuVenueType = 1;
						}
					}
				}
				else {//Discharge Encounter (venue type = 2)
					for ( x = 0, xl = venueTypeList.length; x < xl; x++) {
						newVenue = venueTypeList[x];
						if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2) {
							//set currently selected menu option
							mnuDisplay = newVenue.DISPLAY;
							mnuVenueType = 2;
						}
						else {
							//set next menu options
							mnuNextDisplay = newVenue.DISPLAY;
							mnuNextVenueType = 1;
						}
					}
				}
				var arr = [];
				arr.push("<div id='lb", mnuId, "'><div id='stt", compId, "' class='sub-title-disp'>", "<span id='lbMnuDisplay", componentId, "' class='noe2-drop-down' title='", noei18n.CHANGE_VENUE_TYPE, "' onclick='MP_Util.LaunchMenu(\"", mnuId, '", "', compId, "\");'>", mnuDisplay, " </span><span class='noe2-drop-down noe2-venue-type-link' title='", noei18n.CHANGE_VENUE_TYPE, "' onclick='MP_Util.LaunchMenu(\"", mnuId, '", "', compId, "\");'></span><span id='cf", componentId, "msg' class='filter-applied-msg' title=''></span></div>", "<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='mnu-labelbox'>", mnuDisplay, "</div><div class='mnu-contentbox'>", "<div><span class='lb-mnu' id='lb", compId, "2", "' onclick='CERN_NEW_ORDER_ENTRY_O2.ChangeVenueType(\"", componentId, "\", \"", mnuDisplay, "\", \"", mnuVenueType, "\", \"", mnuNextDisplay, "\", \"", mnuNextVenueType, "\");'>", mnuNextDisplay, "</span></div>", "</div></div></div>");
				var venueTypeDiv = Util.cep("span", {
					"className": "noe2-venue-type-hdr",
					"id": "noeHdVenueType" + componentId
				});
				var venueTypeDivHTML = arr.join("");
				venueTypeDiv.innerHTML = venueTypeDivHTML;
				Util.ia(venueTypeDiv, m_contentNodeHd);
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
		ChangeVenueType: function(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType) {
			
			// the user can change venues while remaining in the same tab. This ensures that, if
			// that happens, the previous modeless will be cleaned up properly
			if (typeof(FavoriteModeless) != "undefined" && FavoriteModeless.current) {
				FavoriteModeless.closeModeless();
			}
			
			//get component object
			var intComponentId = parseInt(componentId, 10);
			var component = MP_Util.GetCompObjById(intComponentId);
			if (!component) {
				component = MP_Util.GetCompObjById(componentId);
			}
			if (newVenueType == 2) {
				component.setVenueType(newVenueType);
			}
			else {
				component.setVenueType();
			}
			//Toggle Venue Type menu selection
			CERN_NEW_ORDER_ENTRY_O2.ToggleVenueTypeMenu(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType);
			//re-apply search settings for My Search
			CERN_NEW_ORDER_ENTRY_O2.ApplySearchSettings(component);
			component.m_base.onVenueChange();
				
			//remove selescted shared user HTML
			var sharedTabShellDiv = _g("sharedTabShell" + componentId);
			if (sharedTabShellDiv) {
				sharedTabShellDiv.innerHTML = "";
			}
			var sharedTabDiv = _g("sharedTabHTML" + componentId);
			if (sharedTabDiv) {
				sharedTabDiv.innerHTML = "";
			}
		},
		/**
		 * This function toggles the venue type menu between selected venues
		 * @param {string} componentId : Component Id, passed in as a string
		 * @param {string} oldVenueDisplay : The previously selected venue type display, passed in as a string
		 * @param {string} oldVenueType : The previously selected venue type, passed in as a string
		 * @param {string} newVenueDisplay : The newly selected venue type display, passed in as a string
		 * @param {string} newVenueType : The newly selected venue type, passed in as a string
		 */
		ToggleVenueTypeMenu: function(componentId, oldVenueDisplay, oldVenueType, newVenueDisplay, newVenueType) {
			var noei18n = i18n.discernabu.noe_o2;
			var venueTypeDiv = _g("noeHdVenueType" + componentId);
			if (venueTypeDiv) {
				//get component object
				var intComponentId = parseInt(componentId, 10);
				var component = MP_Util.GetCompObjById(intComponentId);
				if (!component) {
					component = MP_Util.GetCompObjById(componentId);
				}
				var style = component.getStyles();
				var ns = style.getNameSpace();
				var compId = style.getId();
				var loc = component.getCriterion().static_content;
				var mnuId = compId + "Mnu";

				var arr = [];
				arr.push("<div id='lb", mnuId, "'><div id='stt", compId, "' class='sub-title-disp'>", "<span id='lbMnuDisplay", componentId, "' class='noe2-drop-down' title='", noei18n.CHANGE_VENUE_TYPE, "' onclick='MP_Util.LaunchMenu(\"", mnuId, '", "', compId, "\");'>", newVenueDisplay, " </span><span class='noe2-drop-down noe2-venue-type-link' title='", noei18n.CHANGE_VENUE_TYPE, "' onclick='MP_Util.LaunchMenu(\"", mnuId, '", "', compId, "\");'></span><span id='cf", componentId, "msg' class='filter-applied-msg' title=''></span></div>", "<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='mnu-labelbox'>", newVenueDisplay, "</div><div class='mnu-contentbox'>", "<div><span class='lb-mnu' id='lb", compId, "2", "' onclick='CERN_NEW_ORDER_ENTRY_O2.ChangeVenueType(\"", componentId, "\", \"", newVenueDisplay, "\", \"", newVenueType, "\", \"", oldVenueDisplay, "\", \"", oldVenueType, "\");'>", oldVenueDisplay, "</span></div>", "</div></div></div>");

				var venueTypeDivHTML = arr.join("");
				venueTypeDiv.innerHTML = venueTypeDivHTML;
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
		DisplaySelectedFolder: function(component, folderId, tabName, personnelId, personnelPosCd) {
			var noei18n = i18n.discernabu.noe_o2;
			var i, l;
			var componentId = component.getComponentId();
			var venueType = component.getVenueType();
			var folderPathObj = _g("root" + tabName + componentId);
			var folderPath = Util.Style.g("noe2-folder-info", folderPathObj, "DL");
			var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
			var curItemData = _gbt("DD", curList);

			// destroy old modals from this tab
			FavoriteModeless.destroyAllFromTab(tabName);

			//find index of folder id
			var locatedIdIndex = null;
			var lastIsHomeInd = false;
			for ( i = 0, l = curItem.length; i < l; i++) {
				if (curItem[i].innerHTML == folderId) {
					locatedIdIndex = i;
				}
			}

			//delete all folder names and ids that are after selected folder
			if (locatedIdIndex !== null) {
				if (locatedIdIndex !== (curItem.length - 1)) {
					for ( i = curItem.length; i--; ) {
						var deleteId = curItem[i];
						if (i !== 0 && locatedIdIndex <= i) {
							Util.de(deleteId);
						}
					}
					for ( i = curItemData.length; i--; ) {
						var deleteFolder = curItemData[i];
						if (i !== 0 && locatedIdIndex <= i) {
							Util.de(deleteFolder);
						}
					}
				
					if (locatedIdIndex > 1) {
						Util.Style.acss(curItemData[locatedIdIndex - 2], "noe2-fav-folder");
						Util.Style.rcss(curItemData[locatedIdIndex - 2], "hidden");
						Util.Style.acss(curItemData[locatedIdIndex - 1], "noe2-fav-folder");
						Util.Style.rcss(curItemData[locatedIdIndex - 1], "hidden");
					}
				}

				var prevFolderContent = _g("folderContents" + tabName + componentId);
				if (prevFolderContent) {
					prevFolderContent.innerHTML = "";
					prevFolderContent.style.overflowY = "auto";
					Util.Style.acss(prevFolderContent, "noe2-preloader-icon");
				}

				var criterion = component.getCriterion();
				var virtualViewMask, orderMask, sendAr;
				var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
				folderRequest.setProgramName("mp_get_powerorder_favs_json");
				folderRequest.setAsync(true);
				//only situation where folderId == -10 is for hard coded My Plan Favorites folder in Mine and Shared tabs
				if (folderId == -10 && tabName !== "Public") {
					virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
					var sharedPlanMask = (component.isPowerPlanEnabled() ? 32 : 0);
					orderMask = virtualViewMask + sharedPlanMask;
					switch(tabName) {
						case"Mine":
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadMyFavPlansFolder(reply, tabName);
							});
							break;
						case"Shared":
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadMyFavPlansFolder(reply, tabName);
							});
							break;
					}
				}
				else {
					virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
					var orderSearchMask = 4;
					var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
					var productLevelMask = 0;
					if (venueType === 1) {//inpatient
						component.setDispOnlyProductLevelMeds(0);
						productLevelMask = 0;
					}
					else {//ambulatory/discharge
						component.setDispOnlyProductLevelMeds(1);
						productLevelMask = 16;
					}

					var publicMask = 64;
					var homeMask = 128;
					orderMask = virtualViewMask + orderSearchMask + planSearchMask + productLevelMask;
					switch(tabName) {
						case"Mine":
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
							});
							break;
						case"Public":
							orderMask = orderMask + publicMask;
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
							});
							break;
						case"Shared":
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName, personnelId, personnelPosCd);
							});
							break;
						case"Home":
							orderMask = orderMask + homeMask;
							sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", 159, venueType, 1];
							folderRequest.setParameters(sendAr);
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
							});
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
		DisplayNextFolder: function(folder, folderId, componentId, tabName, personnelId, personnelPosCd) {
			var noei18n = i18n.discernabu.noe_o2;
			var curFolderData = _gbt("DD", folder);
			var curName = curFolderData[0];
			var curNameDisp = curName.innerHTML;
			var isMyPlanFavFolder = false;

			//get component object
			var intComponentId = parseInt(componentId, 10);
			var component = MP_Util.GetCompObjById(intComponentId);
			if (!component) {
				component = MP_Util.GetCompObjById(componentId);
			}

			// destroy old modals from this tab
			FavoriteModeless.destroyAllFromTab(tabName);

			// if the component has disabled displaying next folder (for example, another event with higher
			// priority was fired) then don't go ahead
			if (!component.m_displayNextFolderEnabled) {
				return;
			}

			//grab all folder names and ids in DOM of component
			var folderPathObj = _g("root" + tabName + componentId);
			var folderPath = Util.Style.g("noe2-folder-info", folderPathObj, "DL");
			var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
			var curItemData = _gbt("DD", curList);
			var lastId = parseInt(curItem[curItem.length - 1].innerHTML, 10);
			var lastFolder = curItemData[curItemData.length - 1];
			var rootFolder = $("#folderPath" + tabName + "Root" + componentId);
			var lastFolderName = rootFolder.attr("title");

			var pathLength = curItemData.length;
			var separator = "";

			if (folderId == -10 && component.isPlanFavEnabled()) {
				isMyPlanFavFolder = true;
				//value used in DisplaySelectedFolder
			}
			else {
					//get name of parent folder
					lastFolderName = curItemData[pathLength - 1].innerText;
					for (var j = pathLength; j--; ) {
						if (j > 0) {
							if (curItem[j].innerHTML == "-1") {
								Util.Style.acss(curItemData[j], "hidden");
								Util.Style.rcss(curItemData[j], "noe2-fav-separator");
							}
							else {
								Util.Style.acss(curItemData[j], "hidden");
								Util.Style.rcss(curItemData[j], "noe2-fav-folder");
							}
						}
					}
			}
			
			

			//create four new nodes for the folder id, folder name, separator id, and separator
			var newFolderId = Util.cep("DT", {
				"className": "hidden",
				"innerHTML": folderId
			});
			var newFolder = Util.cep("DD", {
				"className": "noe2-fav-folder",
				"innerHTML": "<span class='noe2-fav-folder-disp-name'>" + curNameDisp + "</span>"
			});
			var newLastFolderId = Util.cep("DT", {
				"className": "hidden",
				"innerHTML": lastId
			});
			var newLastFolder = Util.cep("DD", {
				"className": "noe2-fav-folder",
				"innerHTML": "<span class='noe2-up-one-level-icon' title='" + lastFolderName + "';>" + separator + "</span>"
			});
			
			//add four new nodes to DOM
			Util.ia(newLastFolderId, lastFolder);
			Util.ia(newLastFolder, newLastFolderId);
			Util.ia(newFolderId, newLastFolder);
			Util.ia(newFolder, newFolderId);

			var prevFolderContent = _g("folderContents" + tabName + componentId);
			if (prevFolderContent) {
				prevFolderContent.innerHTML = "";
				prevFolderContent.style.overflowY = "auto";
				Util.Style.acss(prevFolderContent, "noe2-preloader-icon");
			}

			if (component) {
				var criterion = component.getCriterion();
				var virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
				var orderSearchMask = 4;
				var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
				var venueType = component.getVenueType();
				var productLevelMask = 0;
				if (venueType === 1) {//inpatient
					component.setDispOnlyProductLevelMeds(0);
					productLevelMask = 0;
				}
				else {//ambulatory/discharge
					component.setDispOnlyProductLevelMeds(1);
					productLevelMask = 16;
				}
				var sharedPlanMask = 32;
				var orderMask = ( isMyPlanFavFolder ? virtualViewMask + sharedPlanMask : virtualViewMask + orderSearchMask + planSearchMask + productLevelMask);
				var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
				folderRequest.setProgramName("mp_get_powerorder_favs_json");
				folderRequest.setAsync(true);
				var sendAr;
				switch(tabName) {
					case"Mine":
						sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
						folderRequest.setParameters(sendAr);
						if (isMyPlanFavFolder) {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadMyFavPlansFolder(reply, tabName);
							});
						}
						else {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
							});
						}
						break;
					case"Public":
						var publicMask = 64;
						orderMask = orderMask + publicMask;
						sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
						folderRequest.setParameters(sendAr);
						MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
							CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
						});
						break;
					case"Shared":
						sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", personnelId + ".0", folderId + ".0", "^FAVORITES^", personnelPosCd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
						folderRequest.setParameters(sendAr);
						if (isMyPlanFavFolder) {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadMyFavPlansFolder(reply, tabName);
							});
						}
						else {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName, personnelId, personnelPosCd);
							});
						}
						break;
					case"Home":
						var homeMask = 128;
						orderMask = orderMask + homeMask;
						sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", folderId + ".0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
						folderRequest.setParameters(sendAr);
						if (isMyPlanFavFolder) {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadMyFavPlansFolder(reply, tabName);
							});
						}
						else {
							MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
								CERN_NEW_ORDER_ENTRY_O2.LoadFolder(reply, tabName);
							});
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
		LoadFolder: function(reply, tabName, personnelId, personnelPosCd) {
			var jsonReply = reply.getResponse();
			var repStatus = reply.getStatus();
			var folderHTML;
			var noeArr = null;
			var component = reply.getComponent();
			if (jsonReply && repStatus !== "F") {
				switch(tabName) {
					case"Mine":
						if (jsonReply.USER_FAV) {
							component.m_currentFolderCatId = jsonReply.USER_FAV[0].ALT_SEL_CATEGORY_ID;
							noeArr = jsonReply.USER_FAV;
						}
						break;
					case"Public":
						if (jsonReply.PUBLIC_FAV) {
							noeArr = jsonReply.PUBLIC_FAV;
						}
						break;
					case"Shared":
						if (jsonReply.USER_FAV) {
							noeArr = jsonReply.USER_FAV;
						}
						break;
					case"Home":
						if (jsonReply.HOME_FAV) {
							noeArr = jsonReply.HOME_FAV;
						}
						break;						
				}
			}
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var allowMyPlanFavs = ((component.isPowerPlanEnabled() && component.isPlanFavEnabled()) ? true : false);
			var venueType = (component.getVenueType() === 2 ? 1 : 0 );
			var tabNameClass = tabName.toLowerCase();

			var prevFolderContent = _g("folderContents" + tabName + componentId);
			if (prevFolderContent && repStatus !== "F") {
				Util.Style.rcss(prevFolderContent, "noe2-preloader-icon");
				var mineSec = [];
				var myFavPlansFolder = [];
				var childFavFolder = [];
				var childFavFolderItems = [];
				var secondaryFavFolder = [];
				var mineCnt = 0;

				mineSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers(tabName, componentId));

				if (noeArr) {
					//grab all folder names and ids in DOM of component
					var folderPathObj = _g("root" + tabName + componentId);
					var folderPath = Util.Style.g("noe2-folder-info", folderPathObj, "DL");
					var curList = folderPath[0];
					var curItem = _gbt("DT", curList);
					for (var i = 0, l = noeArr.length; i < l; i++) {
						var noeFavsObj = noeArr[i];
						//if curItem.length of one, that means we are at the root level. We need to rename the root level folder name in case the venue has been modified
						//only need to do it once so check if i === 0
						if (i === 0 && curItem.length === 1 && tabName !== "Shared") {
							var rootFolderPath = $("#folderPath" + tabName + "Root" + componentId);
							if (rootFolderPath) {
								rootFolderPath.attr("title", noeFavsObj.SHORT_DESCRIPTION);
								$(curList).append("<dt>0</dt><dd class='noe2-fav-folder'><span class='noe2-fav-folder-disp-name'>" + noeFavsObj.SHORT_DESCRIPTION + "</span></dd>");
							}
						}
						//if length of 2, that means we are at the root level and we need to add hardcoded My Plan Favorites folder
						if (i === 0 && curItem.length === 2 && tabName !== "Public" && component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()) {
							//create My Favorite Plans hardcoded folder
							mineCnt++;
							if (tabName === "Shared") {
								myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"", tabName, "\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
							} 
							else if ( tabName === "Home" && allowMyPlanFavs === true && noeFavsObj.OWNER_ID > 0 && noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES") { //HOME is a user favorite
								myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"", tabName, "\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");								
							}							
							else if (tabName === "Mine"){
								myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"", tabName, "\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
							}
						}
						if (i === 0) {
							var noeItemArr = noeFavsObj.CHILD_LIST;
							var folderOwnerId=noeFavsObj.OWNER_ID;
							component.setHomeOwnerId(folderOwnerId);
							switch(tabName) {
								case "Mine" :
									component.setNOEMineItemArray(noeItemArr);
									break;
								case "Shared" :
									component.setNOESharedItemArray(noeItemArr);
									break;
								case "Public" :
									component.setNOEPublicItemArray(noeItemArr);
									break;
								case"Home":component.setNOEHomeItemArray(noeItemArr);
									break;
							}

							for (var j = 0, k = noeItemArr.length; j < k; j++) {
								var noeItem = noeItemArr[j];
								var noeRow = [];
								var noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1:
										//Favorite Folder
										mineCnt++;
										if (tabName === "Shared") {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"", tabName, "\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										childFavFolder = childFavFolder.concat(noeRow);
										break;
									case 2:
										//Order Synonym
										mineCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6) {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-", tabNameClass,"'><span class='", (tabName === "Mine" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' data-cki='", noeItem.CKI,"' class='noe2-info noe2-order' sort='orderable-", tabNameClass,"'><span class='", (tabName === "Mine" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										childFavFolderItems = childFavFolderItems.concat(noeRow);
										break;
									case 3:
										//Home Health Problem
										break;
									case 4:
										//Reference Task
										break;
									case 5:
										//IV Favorites
										break;
									case 6:
										//PowerPlan
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-", tabNameClass,"'><span class='", (tabName === "Mine" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										childFavFolderItems = childFavFolderItems.concat(noeRow);
										break;
									case 7:
										//Regimen Synonym
										break;
								}
							}
						}
						else {
							mineCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
								var folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								if (tabName === "Shared") {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else if (tabName === "Public") {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Public\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
							}
							else {
								if (tabName === "Shared") {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else if (tabName === "Public") {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder'  onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Public\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
								else {
									secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-", tabNameClass,"'  onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Mine\")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								}
							}
						}
					}
				}
				//add items in sorted order
				mineSec = mineSec.concat(myFavPlansFolder, childFavFolder, secondaryFavFolder, childFavFolderItems);

				if (!mineCnt) {
					mineSec.push("<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>");
				}
				mineSec.push("</div></div></div>");
				//Add the right side panel hover zone for scrolling
				mineSec.push("<div id='rightSidebar", tabName + componentId, "' class='noe2-right-sidebar'></div>");
				mineSec.push("</div>");
				folderHTML = mineSec.join("");
				prevFolderContent.innerHTML = folderHTML;
				if (component.getFavoritesSortPref()) {
					if (tabName !== "Public" && component.getHomeOwnerId()) {
						CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, tabName);
					}
				}
					//For an empty folder, there is no need of calling the BuildColumns method.
					if (mineCnt) {
						//Build columns
						if (tabName === "Shared") {
							CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeArr, tabName, component, personnelId, personnelPosCd);
						} else {
							CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeArr, tabName, component);
						}
						//Set dimensions for container div and wrapper
						CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);

						createFavoriteStars(component, tabName);
					}

				//snap scrolling functionality
				CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId);



			}
			//TODO: Probably modify this. Sometimes we get a random script failure. Immediately re-loading the folder usually makes it work.
			else if ((prevFolderContent && repStatus === "F") || !noeArr) {
				Util.Style.rcss(prevFolderContent, "noe2-preloader-icon");
				var i18nCore = i18n.discernabu;
				var errMsg = [];
				errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
				folderHTML = errMsg.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
			var checkMineActive = $("#mineTab" + componentId).find(".noe2-seg-cont-center-selected");
			var checkPublicActive = $("#publicTab" + componentId).find(".noe2-seg-cont-center-selected");
			var checkSharedActive = $("#sharedTab" + componentId).find(".noe2-seg-cont-center-selected");
			var checkHomeActive = $("#homeTab" + componentId).find(".noe2-seg-cont-center-selected");
			if (checkMineActive.length !== 0 || checkPublicActive.length !== 0 || checkSharedActive.length !== 0 || checkHomeActive !== 0) {
				$(window).resize(CERN_NEW_ORDER_ENTRY_O2.Debounce(function(e) {
					CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeArr, tabName, component);
				}, 500));
			}
			createFavoriteStars(component, tabName);

			component.m_base.renderFormularyInfo(component.getUid(), noeArr, tabName.toLowerCase());
		},
		/**
		 * This gets called by ReturnMoreSearchOrders and loads 50 results into the searchResults tab
		 * @param {object} reply : A XMLCCLRequest Script Reply
		 * @param {object} component : The new order entry component
		 */
		LoadSearchResults: function(reply, component) {
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
				segCtrlLength = segmentedControlTabs.length;
			}

			//Deselect active tab and make searchResults tab active
			// Remove selected from all classes and replace with inactive
			for (var k = segCtrlLength; k--; ) {
				var segCtrlTabDivs = Util.gcs(segmentedControlTabs[k]);
				var segCtrlTabDivsLength = segCtrlTabDivs.length;
				for (var j = segCtrlTabDivsLength; j--; ) {
					var className = segCtrlTabDivs[j].className.replace("selected", "inactive");
					segCtrlTabDivs[j].className = className;
				}
			}

			var compBody = _g(compBodyId);
			var filterName = "noe2-search-results-filter";

			// Apply the filter to the component body
			if (compBody) {
				compBody.className = "content-body " + filterName;
			}

			//Set up reply for pulling in results into new div
			var repStatus = reply.RESULTS.STATUS_DATA.STATUS;
			var noeArr = reply.RESULTS.ORDERS.concat(reply.RESULTS.PLANS);
			var tabName = "SearchResults";

			var noei18n = i18n.discernabu.noe_o2;
			var tabNameClass = tabName.toLowerCase();

			//Set up header
			var searchHeader = _g("searchHeader" + componentId);
			if(!searchHeader) {return;} //If DOM element has not been rendered, do not try to modify and return
			var headerStr = ["<div class='sub-sec-title noe-base-sub-sec-title left'>"];

			var venueType = (component.getVenueType() === 2 ? 1 : 0 );
			var searchCnt = 0;
			var searchSec = [];
			var searchResultItems = [];
			var searchContent = _g("folderContents" + tabName + componentId);
			var isOrderSentenceRestrictionsViewable = component.m_base.getShowOrderSentenceDetailUserPref();
			var ordersContainDemographicInfo = !!reply.RESULTS.RESULTS_FILTERED_IND;

			if (searchContent && repStatus !== "F") {
				Util.Style.rcss(searchContent, "noe2-preloader-icon");

				//Create header title
				headerStr.push(noei18n.TOP_RESULTS.replace("{0}", noeArr.length), "</div>");
				
				//Add CCL filter disable checkbox
				headerStr.push("<div id='noe-base-checkBox-container" + componentId + "' class='sub-sec-title noe-base-sub-sec-title right hidden'>", "<input type='checkbox' class='noe-base-filters-toggle' id='noe-base-filters-toggle" + componentId + "'");
				if(component.m_base.getOrderSentencesEnabled()){ headerStr.push(" checked='checked'"); }
				headerStr.push("> ", noei18n.FILTERS, "</div>");

				//push scroll container, wrapper, and first column
				searchSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers(tabName, componentId));
				
				//Cycle through all results pulled back and add to new div
				for (var i = 0, l = noeArr.length; i < l; i++) {
					var noeItem = noeArr[i];
					var ageInfo = (noeItem.AGEINFORMATION && noeItem.AGEINFORMATION.length) ? noeItem.AGEINFORMATION[0] : null;
					var weightInfo = (noeItem.WEIGHTINFORMATION && noeItem.WEIGHTINFORMATION.length) ? noeItem.WEIGHTINFORMATION[0] : null; //In case script doesn't return an array.
					var pmaInfo = (noeItem.PMAINFORMATION && noeItem.PMAINFORMATION.length) ? noeItem.PMAINFORMATION[0] : null;
					var noeRow = [];
					var orderDetailSentences = [];
					var hasDemographicInformation =  (ageInfo || weightInfo || pmaInfo);

					if(hasDemographicInformation) {
						if(isOrderSentenceRestrictionsViewable) { 
							orderDetailSentences = component.m_base.getOrderSentenceDetails(ageInfo, weightInfo, pmaInfo);
						}
						ordersContainDemographicInfo = true;
					}

					//check to see if this is an order or PowerPlan
					if (noeItem.SYN_ID)//Order or Care set
					{
						searchCnt++;
						if (noeItem.ORDERABLE_TYPE_FLAG === 6)//Care set
						{
							noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId, "searchOrderRow", searchCnt, "Id", noeItem.SYN_ID, "' class='noe2-info noe2-order'><span class='", (tabName === "SearchResults" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "searchOrderRow", searchCnt, "BtnId", noeItem.SYN_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE);
							Array.prototype.push.apply(noeRow, orderDetailSentences);
							noeRow.push("</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
						}
						else//Order
						{
							noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId, "searchOrderRow", searchCnt, "Id", noeItem.SYN_ID, "' data-cki='", noeItem.CKI,"' class='noe2-info noe2-order'><span class='", (tabName === "SearchResults" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "searchOrderRow", searchCnt, "BtnId", noeItem.SYN_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE);
							Array.prototype.push.apply(noeRow, orderDetailSentences);
							noeRow.push("</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
					}
                    
                    if (noeItem.PATH_CAT_SYN_ID)//PowerPlan
                    {
                        searchCnt++;
                        noeRow.push("<h3 class='info-hd'>", noei18n.SEARCH_RESULT, "</h3><dl id='", tabName, componentId, "searchOrderRow", searchCnt, "Id", noeItem.PATH_CAT_ID, "' class='noe2-info noe2-order'><span class='", (tabName === "SearchResults" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "searchPlanRow", searchCnt, "BtnId", noeItem.PATH_CAT_ID, "' class='noe2-fav-order-button' onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
                    }

					searchResultItems = searchResultItems.concat(noeRow);
				}
			}
			//add items in sorted order
			searchSec = searchSec.concat(searchResultItems);

			if (!searchCnt) {
				searchSec.push("<span class='res-none'>", noei18n.NO_RESULTS, "</span>");
			}
			searchSec.push("</div></div></div>");
			//Add the right side panel hover zone for scrolling
			searchSec.push("<div id='rightSidebar", tabName + componentId, "' class='noe2-right-sidebar'></div>");
			searchSec.push("</div>");
			searchHeader.innerHTML = headerStr.join("");
			searchContent.innerHTML = searchSec.join("");

			//Build columns
			CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeArr, tabName, component);
			//Set dimensions for container div and wrapper
			CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);
			//snap scrolling functionality
			CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId);
			//create favorite stars
			createFavoriteStars(component, tabName);

			component.m_base.renderFormularySearch(component.getUid(), noeArr);
			//add resize event
			$(window).resize(CERN_NEW_ORDER_ENTRY_O2.Debounce(function(e) {
				CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeArr, tabName, component);
			}, 500));

			var searchBox = $("#" + component.m_base.getOrderSearchElementId()).find(".search-box");
			var searchBoxText = searchBox.val();

			//Add click event to orderFilter checkbox to trigger event on order searchbar to rerun search without filters
			//on or to alternativly turn them on again. 
			var filtersCheckbox = $("#noe-base-filters-toggle" + componentId);
			filtersCheckbox.on("click", function(e){
				searchBox.val(searchBoxText);
				//toggle the orderSentencesEnabled property
				component.m_base.setOrderSentencesEnabled(!filtersCheckbox.attr("checked"));
				CERN_NEW_ORDER_ENTRY_O2.ApplySearchSettings(component);
				searchBox.trigger(jQuery.Event('keyup', {keyCode: 13, which: 13}));
			});

			var tooltip = new MPageTooltip().setShowDelay(1500);
			var checkboxContainer = $("#noe-base-checkBox-container" + componentId);

			//Adding mouseEnter event for tooltip hover
			checkboxContainer.on("mouseenter", function(e){
				var xPos = e.pageX;
				var yPos = e.pageY;

				tooltip.setX(xPos).setY(yPos).setAnchor(checkboxContainer).setContent(noei18n.FILTERS_TOOLTIP);
				tooltip.show();
			});

			if(ordersContainDemographicInfo) {
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
		LoadMyFavPlansFolder: function(reply, tabName) {
			var repStatus = reply.getStatus();
			var recordCustPlansSuccess = (repStatus !== "F");
			var tabNameClass = tabName.toLowerCase();
			var component = reply.getComponent();
			var componentId = component.getComponentId();
			var prevFolderContent = _g("folderContents" + tabName + componentId);
			var mineSec = [];
			var folderHTML;

			mineSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers(tabName, componentId));
			if (prevFolderContent) {
				if (recordCustPlansSuccess) {
					var jsonReply = reply.getResponse();
					var noeCustPlansArr = jsonReply.CUSTOMIZED_PLANS;
					var noei18n = i18n.discernabu.noe_o2;
					var venueType = (reply.getComponent().getVenueType() === 2 ? 1 : 0 );

					Util.Style.rcss(prevFolderContent, "noe2-preloader-icon");
					var minePlanCnt = 0;
					if (noeCustPlansArr) {
						for (var i = 0, l = noeCustPlansArr.length; i < l; i++) {
							var noeItem = noeCustPlansArr[i];
							var noeRow = [];
							minePlanCnt++;
							noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", tabName, componentId, "favsPlanRow", minePlanCnt, "Id", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID, "' class='noe2-info noe2-order'><span class='", (tabName === "Mine" ? "noe2-fav-star-active-icon" : "noe2-fav-star-disabled-icon"), "'></span><button type='button' id='", tabName, componentId, "favsPlanRow", minePlanCnt, "BtnId", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.NAME, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_DISPLAY, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATHWAY_CATALOG_ID, ".0|", noeItem.PATHWAY_CUSTOMIZED_PLAN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>2</dd></dl>");
							mineSec = mineSec.concat(noeRow);
						}
					}
					mineSec.push("</div></div></div>");
					//Add the right side panel hover zone for scrolling
					mineSec.push("<div id='rightSidebar", tabName + componentId, "' class='noe2-right-sidebar'></div>");
					mineSec.push("</div>");
					if (minePlanCnt === 0) {
						var emptySec = ["<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>"];
						folderHTML = emptySec.join("");
					}
					else {
						folderHTML = mineSec.join("");
					}
					prevFolderContent.innerHTML = folderHTML;

					//Build columns
					CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeCustPlansArr, tabName, component);
					//Set dimensions for container div and wrapper
					CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);
					//snap scrolling functionality
					CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId);
				}
				else {
					Util.Style.rcss(prevFolderContent, "noe2-preloader-icon");
					mineSec.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
					mineSec.push("</div>");
					folderHTML = mineSec.join("");
					prevFolderContent.innerHTML = folderHTML;
				}
			}
			var checkMineActive = $("#mineTab" + componentId).find(".noe2-seg-cont-center-selected");
			var checkSharedActive = $("#sharedTab" + componentId).find(".noe2-seg-cont-center-selected");
			if (checkMineActive.length !== 0 || checkSharedActive.length !== 0) {
				$(window).resize(CERN_NEW_ORDER_ENTRY_O2.Debounce(function(e) {
					CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeCustPlansArr, tabName, component);
				}, 500));
			}
		},
		/**
		 * Select/display the specified tab
		 * @param {string} compBodyId : The id of the content-body element
		 * @param {int} index : The index of the selected tab
		 * @param {string} tabId : The id of the tab clicked by the user
		 */
		SelectTab: function(compBodyId, index, tabId) {
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
					var className = segCtrlTabDivs[j].className.replace("selected", "inactive");
					segCtrlTabDivs[j].className = className;
				}
			}
			// Add selected in place of inactive for selected tab classes
			var selSegCtrlTabDivs = Util.gcs(segControlTab);
			var selSegCtrlTabDivsLength = selSegCtrlTabDivs.length;
			for (var k = selSegCtrlTabDivsLength; k--; ) {
				var selClassName = selSegCtrlTabDivs[k].className.replace("inactive", "selected");
				selSegCtrlTabDivs[k].className = selClassName;
			}

			// Retrieve the component body
			var compBody = _g(compBodyId);
			var filterName = "";
			// Determine the appropriate filter to apply based on the selected tab
			switch (index) {
				case 0:
					filterName = "noe2-freq-filter";
					break;
				case 1:
					filterName = "noe2-mine-filter";
					break;
				case 2:
					filterName = "noe2-public-filter";
					break;
				case 3:
					filterName = "noe2-shared-filter";
					break;
				case 4:
					filterName = "noe2-home-filter";
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
		SelectFav: function(buttonFav, componentId, favType) {
			var noei18n = i18n.discernabu.noe_o2;
			var dataObj = null;
			var fav = Util.gp(buttonFav);
			var component = MP_Util.GetCompObjById(parseInt(componentId));

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

				//create scratchpad object
				var scratchpadObj = {};
				scratchpadObj.componentId = componentId;
				scratchpadObj.addedFrom = "NewOrderEntry";
				//Location where the favorite was added from
				scratchpadObj.favId = fav.id;
				//used when removing items from the scratchpad. should be able to look inside the component and find this id
				scratchpadObj.favType = favType;
				//0: Orderable; 1: Careset; 2: PowerPlan
				scratchpadObj.favName = favName;
				//Display name of orderable/Careset/PowerPlan
				scratchpadObj.favOrderSentDisp = favDisp;
				//Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
				scratchpadObj.favParam = favParam;
				//Orderable or Careset: Synonym Id + ".0|" + venueType + "|" + Sentence Id + ".0";  venueType: Inpatient=0, Discharge=1
				//PowerPlan: PATH_CAT_ID + ".0|" + PATH_CAT_SYN_ID + ".0"
				scratchpadObj.favSynId = null;
				scratchpadObj.favVenueType = null;
				scratchpadObj.favSentId = null;
				scratchpadObj.favOrdSet = 0;
				var params = favParam.split("|");
				if (favType === 2) {
					scratchpadObj.favSynId = params[0];
					scratchpadObj.favSentId = params[1];
					scratchpadObj.favPPEventType = favData[5].innerHTML;
					//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
				}
				else if (favType === 1) {
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

				if (!Util.Style.ccss(fav, "noe2-group-selected")) {
					//add object to scratchpad shared reource
					dataObj = CERN_NEW_ORDER_ENTRY_O2.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, false);

					//modify button value in component to display "Remove".
					if (buttonFav.childNodes[0]) {
						if (buttonFav.childNodes[0].nodeValue) {
							buttonFav.childNodes[0].nodeValue = noei18n.ORDER;
						}
					}
					else if (buttonFav.value) {
						buttonFav.value = noei18n.ORDER;
					}
					else {
						buttonFav.innerHTML = noei18n.ORDER;
					}

					//mark the order as selected
					Util.Style.acss(fav, "noe2-group-selected");

					$(buttonFav).addClass("noe2-fav-order-button-depressed");

					//ensure component Id has been added to the pending data shared resource
					CERN_NEW_ORDER_ENTRY_O2.CheckPendingSR(componentId, 1);
				}
				else if (Util.Style.ccss(fav, "noe2-group-selected")) {
					//remove object from scratchpad shared reource
					dataObj = CERN_NEW_ORDER_ENTRY_O2.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, true);

					//modify button value in component to display "Order"
					if (buttonFav.childNodes[0]) {
						if (buttonFav.childNodes[0].nodeValue) {
							buttonFav.childNodes[0].nodeValue = noei18n.ORDER;
						}
					}
					else if (buttonFav.value) {
						buttonFav.value = noei18n.ORDER;
					}
					else {
						buttonFav.innerHTML = noei18n.ORDER;
					}

					//remove the order as selected
					Util.Style.rcss(fav, "noe2-group-selected");
					$(buttonFav).removeClass("noe2-fav-order-button-depressed");
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
							CERN_NEW_ORDER_ENTRY_O2.CheckPendingSR(componentId, 0);
						}
					}
				}
			}
		},
		/**
		 * Add or remove scratchpad object to the shared resource array of objects
		 * @param {Object} scratchpadObj : Scratchpad object to add or remove
		 * @param {boolean} isRemovingObj : true = remove object from scracthpad shared resource. false = add it to scracthpad shared resource
		 * @return {Object} dataObj : Scratchpad shared resource data object
		 */
		AddToOrRemoveFromScratchpadSR: function(component, scratchpadObj, isRemovingObj) {
			var srObj = CERN_NEW_ORDER_ENTRY_O2.GetScratchpadSharedResourceObject();
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
								if (scratchpadArr[idx].favSynId == scratchpadObj.favSynId && scratchpadArr[idx].favSentId == scratchpadObj.favSentId) {
									scratchpadArr.splice(idx, 1);
									break;
								}
							}
						}
						else {
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
		GetScratchpadSharedResourceObject: function() {
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
		SPModalDialogRemovesFavorite: function(component, event, removeObject) {
			var noei18n = i18n.discernabu.noe_o2;
			//check NOE component and update "Remove" button to say "Order"
			if (removeObject.componentId) {//My Search has null
				if (component.getComponentId() == removeObject.componentId) {//if the favorite isn't in this specific component, don't go inside if statement
					var noeCompFav = _g(removeObject.favoriteId);
					if (noeCompFav && Util.Style.ccss(noeCompFav, "noe2-group-selected")) {
						//remove the order as selected
						Util.Style.rcss(noeCompFav, "noe2-group-selected");

						var noeRemoveButton = Util.Style.g("noe2-fav-order-button-depressed", noeCompFav, "button")[0];
						if (noeRemoveButton) {
							//modify button value in component to display "Order"
							$(noeRemoveButton).removeClass("noe2-fav-order-button-depressed");
							if (noeRemoveButton.childNodes[0]) {
								if (noeRemoveButton.childNodes[0].nodeValue) {
									noeRemoveButton.childNodes[0].nodeValue = noei18n.ORDER;
								}
							}
							else if (noeRemoveButton.value) {
								noeRemoveButton.value = noei18n.ORDER;
							}
							else {
								noeRemoveButton.innerHTML = noei18n.ORDER;
							}
						}
					}
				}
			}
		},
		/**
		 * Retrieve search settings for both Inpatient and Outpatient encounter, which will be passed into the mp_search_orders script and save the settings in the component.
		 * @param {node} component : The new order entry component
		 */
		ApplySearchSettings: function(component) {
			var totSearchInds = 0;
			var isAmbulatoryEncntr=component.isAmbulatoryEnctrGrpFLag();
			if(isAmbulatoryEncntr){//Ambulatory
				totSearchInds = CERN_NEW_ORDER_ENTRY_O2.CalculateSearchIndicators(component, isAmbulatoryEncntr);
				component.setSearchIndicators(totSearchInds);
			}else{//Inpatient
				totSearchInds = CERN_NEW_ORDER_ENTRY_O2.CalculateSearchIndicators(component, isAmbulatoryEncntr);
				component.setSearchIndicators(totSearchInds);
			}
			
			if (component.m_base) {
				component.m_base.loadLegacyComponent(component, CERN_NEW_ORDER_ENTRY_O2, i18n.discernabu.noe_o2);
			}
		},
		/**
		 * Determine the search settings which will be passed into the mp_search_orders script.
		 * @param {node} component : The new order entry component
		 *  
		 */
		CalculateSearchIndicators: function(component,isAmbulatoryEnc){
			var searchInds=0;
			var currentVenue = component.getVenueType();
			if (currentVenue === 1) {//Meds
				component.setEncntrVenueInd(currentVenue);
				//Apply search indicator settings	//Bit location- Setting ;Application
				if (component.isVirtViewOrders()) {
					searchInds += (1 * Math.pow(2, 0));
					//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
				}
				searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 1));
				//1 - PLAN_VIRT_VIEW_IND ;Apply virtual view filters to plans
				searchInds += (1 * Math.pow(2, 2));
				//2 - ORDERABLE_IND ;Return orderables from the search
				searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 3));
				//3 - PLAN_IND ;Return plans from the search
				searchInds += (0 * Math.pow(2, 4));
				//4 - ADMINISTRATION_IND ;Return orders which will be administered
				searchInds += (0 * Math.pow(2, 5));
				//5 - PRESCRIPTION_IND ;Return orders which will be prescribed
				searchInds += (0 * Math.pow(2, 6));
				//6 - HISTORICAL_IND ;Return historical prescriptions
				searchInds += (0 * Math.pow(2, 7));
				//7 - PRODUCT_LEVEL_IND ;Return only product level med orders
				searchInds += (0 * Math.pow(2, 8));
				//8 - VIRT_VIEW_ORDERS_IND ;Virtual view orders must be set if
				searchInds += (0 * Math.pow(2, 9));
				//9 - VIRT_VIEW_RX_ORDERS_IND ;Virtual view prescription orders	
				searchInds += (!component.m_base.getOrderSentencesEnabled() * Math.pow(2,10));
				//10 - ORDER_SENT_FILTER_IND ;Filter Ordersentences or not.
			}
			else if (currentVenue === 2) {//Discharge meds as RX and Ambulatory as Rx
				//Since it is Rx venue type, we would like to make sure for this venue we have different indicators going into the mp_search_orders script
				if(isAmbulatoryEnc){ //Ambulatory meds as RX
					component.setEncntrVenueInd(currentVenue);
					//Apply virtual view only if rx or inpatient VV is on
					if (component.isVirtViewOrders() || component.isVirtViewRxOrders()){
						searchInds += (1 * Math.pow(2, 0));	//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
					}
					searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 1));	//1 - PLAN_VIRT_VIEW_IND ;Apply virtual view filters to plans

				}
				else{//Discharge Meds as Rx
					currentVenue = 3;//Setting this to 3 will allow the mp_search_orders script to populate the  PrescriptionVenueRequest, thus retrieving only prescriptions.	
					component.setEncntrVenueInd(currentVenue);
					// Honor rx virtual order catalog settings for discharge meds as rx venue
					if(component.isVirtViewRxOrders()){
						searchInds += (1 * Math.pow(2, 0));	//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
					}
				}
				//Apply search indicator settings
				//0 - VIRT_VIEW_IND ;Apply virtual view filters to orders
				searchInds += (1 * Math.pow(2, 2));
				searchInds += (component.isPowerPlanEnabled() * Math.pow(2, 3));
				//3 - PLAN_IND ;Return plans from the search
				searchInds += (0 * Math.pow(2, 4));
				//4 - ADMINISTRATION_IND ;Return orders which will be administered
				searchInds += (1 * Math.pow(2, 5));
				//5 - PRESCRIPTION_IND ;Return orders which will be prescribed
				searchInds += (0 * Math.pow(2, 6));
				//6 - HISTORICAL_IND ;Return historical prescriptions
				if (component.isDispOnlyProductLevelMeds()) {
					searchInds += (1 * Math.pow(2, 7));
					//7 - PRODUCT_LEVEL_IND ;Return only product level med orders
				}
				if (component.isVirtViewOrders()) {
					searchInds += (1 * Math.pow(2, 8));
					//8 - VIRT_VIEW_ORDERS_IND ;Virtual view orders
				}
				if (component.isVirtViewRxOrders()) {
					searchInds += (1 * Math.pow(2, 9));
					//9 - VIRT_VIEW_RX_ORDERS_IND ;Virtual view prescription orders
				}
			}
			return searchInds;
		},
		/**
		 * Call the mp_search_orders script with the text entered into the textBox
		 * @param {function} callback : The callback function used when the CCL script returns.
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {component} component : The new order entry component
		 */
		SearchOrders: function(callback, textBox, component) {
			if (textBox.value.length > 1) {
				// Initialize the request object
				var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
				var returnData;
				var searchPhrase = textBox.value;
				var currentValue = textBox.value;
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) {
						MP_Util.LogScriptCallInfo(component, this, "neworderentry.js", "SearchOrders");
						var msgSearch = xhr.responseText;
						var jsonSearch = "";
						if (msgSearch) {
							jsonSearch = JSON.parse(msgSearch);
						}
						if (jsonSearch) {
							returnData = jsonSearch.RESULTS.ORDERS.concat(jsonSearch.RESULTS.PLANS);
							if (textBox.value.length > 1) {
								var searchox = MP_Util.RetrieveAutoSuggestSearchBox(component);
								if (searchox.value == currentValue) {
									callback.autosuggest(returnData, true);
								}
							}
						}
					}
				};
				var params = "^MINE^, ^" + searchPhrase + "^," + component.getSuggestionLimit() + "," + component.getEncntrTypeCd() + ".0," + component.getFacilityId() + ".0," + component.getCriterion().provider_id + ".0," + component.getCriterion().ppr_cd + ".0," +component.getEncntrVenueInd()+ "," +component.getSearchIndicators() + "," +  1;
				if (CERN_BrowserDevInd) {
					var url = "mp_search_orders?parameters=" + params;
					xhr.open("GET", url);
					xhr.send(null);
				}
				else {
					xhr.open('GET', "mp_search_orders");
					xhr.send(params);
				}
			}
		},
		/**
		 * Call the mp_search_orders script with the text entered into the textBox
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {component} component : The new order entry component
		 */
		ReturnMoreSearchOrders: function(textBox, component) {
			if (textBox.value.length > 1) {

				// Initialize the request object
				var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
				var searchPhrase = textBox.value;
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {

						MP_Util.LogScriptCallInfo(component, this, "neworderentry.js", "ReturnMoreSearchOrders");
						var msgSearch = xhr.responseText;
						var jsonSearch = "";

						if (msgSearch) {
							jsonSearch = JSON.parse(msgSearch);
						}

						if (jsonSearch) {
							CERN_NEW_ORDER_ENTRY_O2.LoadSearchResults(jsonSearch, component);
						}
					}
				};

				var params = ("^MINE^, ^" + searchPhrase + "^," 
					+ component.getSearchResultsLimit() + "," 
					+ component.getEncntrTypeCd() + ".0," 
					+ component.getFacilityId() + ".0," 
					+ component.getCriterion().provider_id + ".0," 
					+ component.getCriterion().ppr_cd + ".0," 
					+ component.getEncntrVenueInd() + "," 
					+ component.getSearchIndicators() + "," 
					+ 1 + ","
					+ cki + ","																//CKI
					+ prs_id + ","															//PersonID
					+ "^" + dob + "^,"														//BirthDate
					+ birthTz + ","															//BirthTimeZone
					+ weight + ","															//Weight
					+ weightUnit);															//WeightUnit
					
				//add CKI = 0, PersonID = 0.0, BirthDate = "", BirthTz = 0, Clinical Weight = 0.0, Clinical Weight Unit = 0.0

				if (CERN_BrowserDevInd) {
					var url = "mp_search_orders?parameters=" + params;
					xhr.open("GET", url);
					xhr.send(null);
				}
				else {
					xhr.open('GET', "mp_search_orders");
					xhr.send(params);
				}
			}
		},
		/**
		 * Find shared order or plan favorites for a specified user
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {object} reply : A XMLCCLRequest Script Reply
		 */
		FindSharedFavorites: function(suggestionObj, component) {
			var criterion = component.getCriterion();
			var virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
			var orderSearchMask = 4;
			var planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
			var venueType = component.getVenueType();
			var productLevelMask = 0;
			var componentId = component.getComponentId();
			var tabName = "Shared";
			if (venueType === 1) {//inpatient
				component.setDispOnlyProductLevelMeds(0);
				productLevelMask = 0;
			}
			else {//ambulatory/discharge
				component.setDispOnlyProductLevelMeds(1);
				productLevelMask = 16;
			}
			var orderMask = virtualViewMask + orderSearchMask + planSearchMask + productLevelMask;
			var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", suggestionObj.PERSON_ID + ".0", "0.0", "^FAVORITES^", suggestionObj.POSITION_CD + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
			var folderRequest = new MP_Core.ScriptRequest(component, component.getComponentRenderTimerName());
			folderRequest.setProgramName("mp_get_powerorder_favs_json");
			folderRequest.setParameters(sendAr);
			folderRequest.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(component, folderRequest, function(reply) {
				component.m_base.tabs.shared.setRecordData(reply.getResponse());
				CERN_NEW_ORDER_ENTRY_O2.LoadSharedFavorites(reply, suggestionObj);
			});

			var noeArr = component.getNOEArray();
			$(window).resize(CERN_NEW_ORDER_ENTRY_O2.Debounce(function(e) {
				CERN_NEW_ORDER_ENTRY_O2.ResizeColumns(noeArr, tabName, component);
			}, 500));

			createFavoriteStars(component, tabName);

		},
		/**
		 * Load shared order or plan favorites on the specified tab
		 * @param {object} reply : A XMLCCLRequest Script Reply
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 */
		LoadSharedFavorites: function(reply, suggestionObj) {
			var prescriptionsVenueType = 1;
			var normalOrderVenueType = 0;
			var jsonReply = reply.getResponse();
			//grab personnel id for use in DisplaySelectedSharedFolder and DisplayNextFolder
			var personnelId = suggestionObj.PERSON_ID;
			//grab personnel position code for use in DisplaySelectedSharedFolder and DisplayNextFolder
			var personnelPosCd = suggestionObj.POSITION_CD;
			var noei18n = i18n.discernabu.noe_o2;
			var component = reply.getComponent();
			var componentId = reply.getComponent().getComponentId();
			//venueType for the scratch pad's favVenueType; 1- Prescriptions, 0- normal orders
			//passed as orderOrigination to ORDERS MPAGES_EVENT
			var venueType = (component.getVenueType() === 2 ? prescriptionsVenueType : normalOrderVenueType);
			var noeMineArr = null;
			var tabName = null;
			if (jsonReply) {
				noeMineArr = jsonReply.USER_FAV;
				component.setNOEArray(noeMineArr);
			}
			var tab = _g('sharedTabHTML' + componentId);
			var breadCrumbsDiv = $("#rootShared" + componentId);
			breadCrumbsDiv.css({
				"padding-right": "10px"
			});

			if (tab) {
				Util.Style.rcss(tab, "noe2-preloader-icon");
				var mineSec = ["<div class='noe2-group noe2-shared-sec'>"];
				var favPath = [];
				var myFavPlansFolder = [];
				var childFavFolder = [];
				var secondaryFavFolder = [];
				var childFavFolderItems = [];
				var mineCnt = 0;
				tabName = "Shared";
				component.setPrsnlId(personnelId);
				component.setPrsnlPosCd(personnelPosCd);
				//create My Favorite Plans hardcoded folder
				if (component.isPowerPlanEnabled() && component.isPlanFavEnabled() && !component.isDischargeAsRxVenue()) {
					mineCnt++;
					myFavPlansFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, ", "-10", ", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noei18n.MY_PLAN_FAVORITES, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0.0|", venueType, "|0.0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd></dl>");
				}

				if (noeMineArr) {
					for (var i = 0, l = noeMineArr.length; i < l; i++) {
						var noeFavsObj = noeMineArr[i];

						//account for multiple favorite folders per venue
						//Only display folder path and My Plan Favorites folder once
						if (i === 0) {
							favPath.push("<dl id='folderPathShared", componentId, "' class='noe2-folder-info'><dt>0</dt><dd class='noe2-fav-folder'><span id='folderPathSharedRoot", componentId, "' class='noe2-top-folder-icon' title='" + noeFavsObj.SHORT_DESCRIPTION + "';>", "</span></dd><dt>0</dt><dd class='noe2-fav-folder'><span class='noe2-fav-folder-disp-name'>",noeFavsObj.SHORT_DESCRIPTION, "</span></dd></dl>");
							mineSec.push("<div id='folderContentsShared", componentId, "' class='noe2-main-container'>");

							//push scroll container and column wrapper
							mineSec.push(CERN_NEW_ORDER_ENTRY_O2.SetupContentContainers(tabName, componentId));

							//Create the rest of the folders/orders/caresets/PowerPlans
							var noeItemArr = noeFavsObj.CHILD_LIST;
							component.setNOESharedItemArray(noeItemArr);
							for (var j = 0, k = noeItemArr.length; j < k; j++) {
								var noeItem = noeItemArr[j];
								var noeRow = [];
								var noeType = noeItem.LIST_TYPE;
								switch(noeType) {
									case 1:
										//Favorite Folder
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										childFavFolder = childFavFolder.concat(noeRow);
										break;
									case 2:
										//Order Synonym
										mineCnt++;
										if (noeItem.ORDERABLE_TYPE_FLAG === 6) {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-shared'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Shared", componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 1)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-careset-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>1</dd></dl>");
										}
										else {
											noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsOrderRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' data-cki='", noeItem.CKI,"' class='noe2-info noe2-order' sort='orderable-shared'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Shared", componentId, "favsOrderRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 0)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.SYN_ID, ".0|", venueType, "|", noeItem.SENT_ID, ".0|", noeItem.PHARMACY_IND, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
										}
										childFavFolderItems = childFavFolderItems.concat(noeRow);
										break;
									case 3:
										//Home Health Problem
										break;
									case 4:
										//Reference Task
										break;
									case 5:
										//IV Favorites
										break;
									case 6:
										//PowerPlan
										mineCnt++;
										noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsPlanRow", mineCnt, "Id", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-info noe2-order' sort='orderable-shared'><span class='noe2-fav-star-disabled-icon'></span><button type='button' id='", "Shared", componentId, "favsPlanRow", mineCnt, "BtnId", noeFavsObj.ALT_SEL_CATEGORY_ID, "' class='noe2-fav-order-button'  onclick='CERN_NEW_ORDER_ENTRY_O2.SelectFav(this, \"", componentId, "\", 2)'>", noei18n.ORDER, "</button><div class='noe2-eligibility-info'></div><span class='noe2-pp-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeItem.PLAN_DISPLAY_DESCRIPTION, "</dd><dt>", noei18n.PLAN_DISPLAY_DESCRIPTION, ":</dt><dd class='hidden'>", noeItem.PW_CAT_SYN_NAME, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>", noeItem.PATH_CAT_ID, ".0|", noeItem.PATH_CAT_SYN_ID, ".0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'></dd><dt>", noei18n.NON_ORDER_EVENT, ":</dt><dd class='det-hd'>2</dd>", "<dt>", noei18n.POWERPLAN_EVENT_TYPE, ":</dt><dd class='det-hd'>1</dd></dl>");
										childFavFolderItems = childFavFolderItems.concat(noeRow);
										break;
									case 7:
										//Regimen Synonym
										break;
								}
							}
						}
						else {
							//create My Favorite Plans hardcoded folder
							mineCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
								var folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
							else {
								secondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl id='", "Shared", componentId, "favsFolderRow", mineCnt, "' class='noe2-info noe2-info-folder' sort='folder-shared' onclick='CERN_NEW_ORDER_ENTRY_O2.DisplayNextFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", componentId, "\", \"Shared\", ", personnelId, ", ", personnelPosCd, ")'><span class='noe2-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe2-name'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe2-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd noe2-params'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
						}
					}
					//add items in sorted order
					mineSec = mineSec.concat(myFavPlansFolder, childFavFolder, secondaryFavFolder, childFavFolderItems);
					if (!mineCnt) {
						mineSec.push("<span class='res-none'>", (noeMineArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
					}
					mineSec.push("</div></div></div>");
					//Add the right side panel hover zone for scrolling
					mineSec.push("<div id='rightSidebar", tabName + componentId, "' class='noe2-right-sidebar'></div>");
					mineSec.push("</div>");
					//ends <div id='folderContentsShared",componentId,"'>
				}

				var planSharedFavsHTML = mineSec.join("");
				tab.innerHTML = planSharedFavsHTML;
				breadCrumbsDiv.html(favPath.join(""));
			}
			var folderPathId = 'folderPathShared' + componentId;
			var folderPath = _g(folderPathId);
			if (folderPath) {
				Util.addEvent(folderPath, "click", function(e) {
					if((e.srcElement.tagName).toLowerCase()=="span"){
						var folder = e.target || e.srcElement;
						var folderId = Util.gps(Util.gp(folder));
						if (folderId.innerHTML != "-1") {
							CERN_NEW_ORDER_ENTRY_O2.DisplaySelectedFolder(component, folderId.innerHTML, "Shared", personnelId, personnelPosCd);
						}
					}
				});
			}

			
			//Checks for the sort preference and calls the ApplySortToFavorites method
			if (component.getFavoritesSortPref()) {
				CERN_NEW_ORDER_ENTRY_O2.ApplySortToFavorites(component, "Shared");
			}
			//Build columns
			CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeMineArr, tabName, component, personnelId, personnelPosCd);
			//Set dimensions for container div and wrapper
			CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);
			//snap scrolling functionality
			CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId);

			createFavoriteStars(component, tabName);
			component.m_base.renderFormularyInfo(component.getUid(), noeMineArr, "shared");
		},
		/**
		 * Call the mp_get_prsnl_json script with the text entered into the textBox
		 * @param {function} callback : The callback function used when the CCL script returns.
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {component} component : The new order entry component
		 */
		SearchPrsnl: function(callback, textBox, component) {
			if (textBox.value.length > 1) {
				var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
				var returnData;
				var currentValue = textBox.value;
				var compNs = component.getStyles().getNameSpace();
				var compId = component.getComponentId();
				var pos = currentValue.indexOf(",", 1);
				var lastName = "";
				var firstName = "";
				xhr.onreadystatechange = function() {
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

				if (currentValue.indexOf(",", 1) > 0) {//LastName, FirstName
					lastName = currentValue.substr(0, pos);
					firstName = currentValue.substring((pos) + 1);
				}
				else {
					if (currentValue.indexOf(" ", 1) > 0) {//FirstName LastName
						firstName = currentValue.substr(0, currentValue.indexOf(" ", 1));
						lastName = currentValue.substring(currentValue.indexOf(" ", 1) + 1);
					}
					else {//LastName Only
						lastName = currentValue;
					}
				}

				var params = "^MINE^," + component.getCriterion().provider_id + ".0,^" + lastName + "^,^" + firstName + "^,10,1";
				if (CERN_BrowserDevInd) {
					var url = "mp_get_prsnl_json?parameters=" + params;
					xhr.open("GET", url);
					xhr.send(null);
				}
				else {
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
		CreatePrsnlSuggestionLine: function(suggestionObj, searchVal) {
			if (suggestionObj.PERSON_ID) {
				return CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.NAME_FULL_FORMATTED, searchVal);
			}

		},
		/**
		 * Retrieve the data from the selected object and call the mp_get_order_details script.
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {node} component : The new order entry component
		 */
		HandlePrsnlSelection: function(suggestionObj, textBox, component) {
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var searchBox = $("#noe2prsnlSearchCtrl" + componentId);
			if (suggestionObj) {
				if (searchBox) {
					searchBox.val(suggestionObj.NAME_FULL_FORMATTED);
					searchBox.css({
						fontWeight: "bold"
					});
				}
				var nameDiv = _g("sharedTabShell" + componentId);
				if (nameDiv) {
					var nameFavDiv = _g("sharedTabHTML" + componentId);
					if (nameFavDiv) {
						nameFavDiv.innerHTML = "";
						Util.Style.acss(nameFavDiv, "noe2-preloader-icon");
					}
					CERN_NEW_ORDER_ENTRY_O2.FindSharedFavorites(suggestionObj, component);
				}
			}
		},
		/**
		 * Retrieve the data from the selected object and call the mp_get_order_details script.
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {node} textBox : The text box node which the user enters in search strings
		 * @param {node} component : The new order entry component
		 */
		HandleSelection: function(suggestionObj, textBox, component) {
			if (suggestionObj) {
				if (suggestionObj.SYN_ID) {
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
								if (suggestionObj.ORDERABLE_TYPE_FLAG === 6) {
									CERN_NEW_ORDER_ENTRY_O2.AddSearchItemToScratchPad(orderDetail, component, 1);
								}
								else {
									CERN_NEW_ORDER_ENTRY_O2.AddSearchItemToScratchPad(orderDetail, component, 0);
								}
							}
						}
					};
					textBox.value = '';

					var params = "^MINE^, " + suggestionObj.SYN_ID + ".0," + suggestionObj.SENT_ID + ".0";
					if (CERN_BrowserDevInd) {
						var url = "mp_get_order_sent_info?parameters=" + params;
						xhr.open("GET", url);
						xhr.send(null);
					}
					else {
						xhr.open('GET', "mp_get_order_sent_info");
						xhr.send(params);
					}
				}
				if (suggestionObj.PATH_CAT_SYN_ID) {
					CERN_NEW_ORDER_ENTRY_O2.AddSearchItemToScratchPad(suggestionObj, component, 2);
				}
			}
		},
		/**
		 * When an item is selected in the autosuggest dropdown add it to the scratch pad once the order details are retrieved
		 * @param {json} orderDetails : The json object containing the order details of the selected search item or details for PowerPlans
		 * @param {object} component : The new order entry component
		 * @param {int} favType : 0:Order; 1:Care Set; 2:PowerPlan
		 */
		AddSearchItemToScratchPad: function(orderDetails, component, favType) {
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var venueType = (component.getVenueType() == 2 ? 1 : 0 );

			//create scratchpad object
			var scratchpadObj = {};
			scratchpadObj.componentId = componentId;
			scratchpadObj.addedFrom = "MySearch";
			//Location where the favorite was added from
			scratchpadObj.favId = null;
			scratchpadObj.favType = favType;
			//0: Orderable; 1: Careset; 2: PowerPlan
			scratchpadObj.favName = null;
			//Display name of orderable/Careset/PowerPlan
			scratchpadObj.favOrderSentDisp = null;
			//Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
			scratchpadObj.favParam = null;
			scratchpadObj.favSynId = null;
			scratchpadObj.favVenueType = venueType;
			scratchpadObj.favSentId = null;
			scratchpadObj.favPPEventType = null;
			//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
			scratchpadObj.favOrdSet = 0;
			if (favType === 2) {//PowerPlan
				scratchpadObj.favName = orderDetails.PW_CAT_SYN_NAME;
				//Display name of PowerPlan
				scratchpadObj.favSynId = orderDetails.PATH_CAT_ID + ".0";
				scratchpadObj.favSentId = orderDetails.PATH_CAT_SYN_ID + ".0";
				scratchpadObj.favPPEventType = 0;
				//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
				scratchpadObj.favParam = orderDetails.PATH_CAT_ID + ".0|" + orderDetails.PATH_CAT_SYN_ID + ".0";
			}
			else if (favType === 1) {//careset
				scratchpadObj.favName = orderDetails.SYNONYM;
				//Display name of Careset
				scratchpadObj.favOrderSentDisp = orderDetails.SENTENCE;
				scratchpadObj.favSynId = orderDetails.SYN_ID + ".0";
				scratchpadObj.favSentId = orderDetails.SENT_ID + ".0";
				scratchpadObj.favParam = orderDetails.SYN_ID + ".0|" + venueType + "|" + orderDetails.SENT_ID + ".0";
				scratchpadObj.favOrdSet = 6;
			}
			else {//order
				scratchpadObj.favName = orderDetails.SYNONYM;
				//Display name of orderable
				scratchpadObj.favOrderSentDisp = orderDetails.SENTENCE;
				scratchpadObj.favSynId = orderDetails.SYN_ID + ".0";
				scratchpadObj.favSentId = orderDetails.SENT_ID + ".0";
				scratchpadObj.favParam = orderDetails.SYN_ID + ".0|" + venueType + "|" + orderDetails.SENT_ID + ".0";
				// Set displayRxIcon to 1 for pharamacy order placed from a Rx venue
				scratchpadObj.displayRxIcon = (orderDetails.PHARMACY_IND === 1 && scratchpadObj.favVenueType === 1) ? 1 : 0;
			}
			scratchpadObj.favNomenIds = '""';

			//add object to scratchpad shared reource
			var dataObj = CERN_NEW_ORDER_ENTRY_O2.AddToOrRemoveFromScratchpadSR(component, scratchpadObj, false);

			//ensure component Id has been added to the pending data shared resource
			CERN_NEW_ORDER_ENTRY_O2.CheckPendingSR(componentId, 1);
		},
		/**
		 * Create the html for the suggestion which will be displayed in the suggestion drop down
		 * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
		 * @param {string} searchVal : The value types into the search box.  This values is needed to highlight matches within the suggestions.
		 */
		CreateSuggestionLine: function(suggestionObj, searchVal) {
			//check to see if this is an order or PowerPlan
			if (suggestionObj.SYN_ID)//Order or Care set
			{
				if (suggestionObj.ORDERABLE_TYPE_FLAG === 6)//Care set
				{
					//Need to check and see if there is a sentence to display
					if (suggestionObj.SENT_ID === 0) {
						return "<span class='noe2-careset-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.SYNONYM, searchVal);
					}
					else {
						return "<span class='noe2-careset-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.SYNONYM, searchVal) + ' <span class="det-txt">' + suggestionObj.SENTENCE + "</span>";
					}
				}
				else//Order
				{
					//Need to check and see if there is a sentence to display
					if (suggestionObj.SENT_ID === 0) {
						return CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.SYNONYM, searchVal);
					}
					else {
						return CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.SYNONYM, searchVal) + ' <span class="det-txt">' + suggestionObj.SENTENCE + "</span>";
					}
				}
			}
			if (suggestionObj.PATH_CAT_SYN_ID)//PowerPlan
			{
				return "<span class='noe2-pp-icon'>&nbsp;</span>" + CERN_NEW_ORDER_ENTRY_O2.HighlightValue(suggestionObj.PW_CAT_SYN_NAME, searchVal);
			}
		},
		/**
		 * Highlight specific portions of a string for display purposes
		 * @param {string} inString : The string to be highlighted
		 * @param {string] term : The string to highlight
		 * @return {string} outString : The string highlighted using HTML tags
		 */
		HighlightValue: function(inString, term) {
			return "<strong class='highlight'>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong class='highlight'>") + "</strong>";
		},
		/**
		 *Push the scroll arrows and scroll, wrapper, and column containers for order results
		 * @param {string} tabName : The name of the tab that is currently displaying results
		 * @param {int} componentId : The id of the component, passed in as a int
		 */
		SetupContentContainers: function(tabName, componentId) {
			var tempArr = [];
			var columnPadding = 20;
			var thisComp = $("#noe2" + componentId);
			var compHdrWidth = $(thisComp).find(".sec-hd").width();
			var columnWidth = Math.floor(((compHdrWidth-40) - columnPadding) / 2);  //Now result items will already be word wrapped if necessary.
			//Left side panel hover zone for scrolling
			tempArr.push("<div id='leftSidebar", tabName + componentId, "' class='noe2-left-sidebar'></div>");
			//tempArr.push("<div id='rightSidebar", tabName + componentId, "' class='noe2-right-sidebar'><div id='rightArrow", tabName + componentId, "' class='noe2-scroll-arrow-right'></div></div>");
			//push container and wrapper
			tempArr.push("<div id='scrollContainer", tabName + componentId, "' class='noe2-results-container'>");
			tempArr.push("<div id='wrapper", tabName + componentId, "' class='noe2-column-wrapper'>");
			//Create a column with a width equal to half of the container's current  width. This is a fix when the columns are built for the first time. 
			tempArr.push("<div id='column1", tabName + componentId, "' class='noe2-results-column' style= 'width:", columnWidth, "px'>");

			return tempArr.join("");
		},
		/**
		 *Calculate the max height available for each column based on viewport height and component header/navigation
		 */
		CalculateContentHeight: function(componentId) {
			//function to find max results that can be displayed per column
			//Shifting to the current height of the window,
			
			var thisComp = $("#noe2" + componentId);
			var compHdrHeight = $(thisComp).find(".sec-hd").outerHeight(true);
			var compLbHeight = $(thisComp).find(".sub-title-disp").outerHeight(true);
			var futureNewOrderDivHeight = $("#noeFutureOrderMessage"+componentId).outerHeight(true);
			var searchFieldHeight = $("#noeSearchBox" + componentId).outerHeight(true);
			var navDivHeight = $(thisComp).find(".noe2-hd").outerHeight(true);
			var prsnlSearchHeight = $(thisComp).find("#noe2prsnlSearchCtrl" + componentId).outerHeight(true) ? $(thisComp).find("#noe2prsnlSearchCtrl" + componentId).outerHeight(true) : 0;
			var extraHeight = 0;
			var maxHeight = 0;
			var viewPortHeight = $('.wrkflw-views').height();
			
			if ($(thisComp).find(".sec-content").css("padding-top")) {
				var contentTopPadding = parseInt($(thisComp).find(".sec-content").css("padding-top").replace("px", ""), 10);
			} else {
				var contentTopPadding = 0;
			}
			
			//Odd Value which helps in preventing the very last row from getting under the view.
			var oddDifference=10;
			extraHeight = compHdrHeight + compLbHeight + contentTopPadding + searchFieldHeight + navDivHeight + prsnlSearchHeight+oddDifference;
			maxHeight = viewPortHeight - extraHeight;
			return maxHeight;
			
		},
		/**
		 *Debounce the event so that it only gets fired once (ex window resize)
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
		 * Resize the content divs based on which tab is currently face up
		 * @param {Array} noeArr : The array of results passed from the function
		 * @param {string} tabName : The name of the tab that is currently displaying results
		 * @param {int} componentId : The id of the component, passed in as a int
		 */
		ResizeColumns: function(noeArr, tabName, component) {

			if (!component.m_resizeEnabled) {
				return;
			}

			var componentId = component.getComponentId();		
			var personnelId = null;
			var personnelPosCd = null;
			var execAsap = false;

			 if (tabName === "Mine" || tabName === "Public" || tabName === "Home" || tabName === "SearchResults") {
				//call function to display mine results
				CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeArr, tabName, component);
				CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);
				CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId, true);
			}
			else if (tabName === "Shared") {
				personnelId = component.getPrsnlId();
				personnelPosCd = component.getPrsnlPosCd();
				//call function to display shared results
				CERN_NEW_ORDER_ENTRY_O2.BuildColumns(noeArr, tabName, component, personnelId, personnelPosCd);
				CERN_NEW_ORDER_ENTRY_O2.SetContainerDimensions(tabName, componentId);
				CERN_NEW_ORDER_ENTRY_O2.ApplyScrolling(tabName, componentId, true);
			}

			createFavoriteStars(component, tabName);
		},
		/**
		 * Build columns based on max height available
		 * @param {Array} noeArr : The array of results passed from the function
		 * @param {string} tabName : The name of the tab that is currently displaying results
		 * @param {int} componentId : The id of the component, passed in as a int
		 */
		BuildColumns: function(noeArr, tabName, component, personnelId, personnelPosCd) {
			var noei18n = i18n.discernabu.noe_o2;
			var componentId = component.getComponentId();
			var resultsContainer = $("#folderContents" + tabName + componentId);
			var wrapper = $("#wrapper" + tabName + componentId);
			var resultArr = null;
			var noeMineItemArr = component.getNOEMineItemArray();
			var noeSharedItemArr = component.getNOESharedItemArray();
			var noePublicItemArr = component.getNOEPublicItemArray();
			var maxHeight = CERN_NEW_ORDER_ENTRY_O2.CalculateContentHeight(componentId);
			var totalHeight = 0;
			var searchCnt = 0;
			var columnWidth = 0.0;
			var columnPadding = 21;
			var columnCnt = 1;
			//set column width

			if (resultsContainer.length !== 0 && resultsContainer.width() > 0 && resultsContainer.find('span.res-none').length!==1) {
				
				//Fix for when the BuildColumns is called upon resize. Calculate and set width of the column when it is being built initially. 
				columnWidth = Math.floor((resultsContainer.width() - columnPadding) / 2);
				resultArr=$(wrapper).find(".noe2-info");
				$("#noe2" + componentId).find(".noe2-results-column").width(columnWidth);
				//Column array to list all columns as jquery objects to be added to wrapper
				var columns = [];
				var column = $("<div id='column1" + tabName + componentId + "' class='noe2-results-column'></div>").width(columnWidth);
				columns.push(column);
				var orderCountOnColumns = [0];
				resultArr.each(function(index) {
					searchCnt++;
					var noeMineItem = null;
					var noeSharedItem = null;
					var noePublicItem = null;
					var thisId = $(this).attr("id");
					var thisClass = $(this).attr("class");
					var nextHeight = 0;
					var thisResultsHeight = $(this).height() + parseInt($(this).css("padding-top").replace("px", ""), 10) + parseInt($(this).css("padding-bottom").replace("px", ""), 10);
					if (noeMineItemArr) {
						noeMineItem = noeMineItemArr[index];
					}
					if (noeSharedItemArr) {
						noeSharedItem = noeSharedItemArr[index];
					}
					if (noePublicItemArr) {
						noePublicItem = noePublicItemArr[index];
					}
					totalHeight += thisResultsHeight;
					//Re-append orderable item in the correct column
					orderCountOnColumns[columnCnt-1]++;

					if (index < resultArr.length - 1){
							//calculates the height of the next element.
							nextHeight = $(resultArr.get(index+1)).height();
						}
					if ((maxHeight - totalHeight) < (nextHeight * 1.5) && searchCnt !== resultArr.length) {
						totalHeight = 0;
						column = $("<div id='column" +  columnCnt + tabName + componentId + "' class='noe2-results-column'></div>").width(columnWidth);
						columns.push(column);
						columnCnt++;
						orderCountOnColumns.push(0);
					}
				});

				//append the orders to the columns
				resultArr.detach();
				for (var i = 0; i < columns.length; i++){
					column = columns[i];
					column.append(resultArr.splice(0,orderCountOnColumns[i]));
				}

				//Re-append generated columns
				wrapper.empty();
				wrapper.append(columns);
			}
		},
		/**
		 *Apply snap-scrolling to columns on arrow hover
		 * @param {string} tabName : The name of the tab that is currently displaying results
		 * @param {int} componentId : The id of the component, passed in as a int
		 * @param {boolean} resizeInd : An optional parameter to determine if this function was called after a resize event
		 */
		ApplyScrolling: function(tabName, componentId, resizeInd) {
			var resultsContainer = $("#folderContents" + tabName + componentId);
			var scrollContainer = $(resultsContainer).find(".noe2-results-container");
			var leftSidebar = $("#leftSidebar" + tabName + componentId);
			var rightSidebar = $("#rightSidebar" + tabName + componentId);
			//Force these elements to have a height so they will actually have a presence on the DOM (thanks to those that wrote NOE for having horrible html structure).
			leftSidebar.height(scrollContainer.height());
			rightSidebar.height(scrollContainer.height());
			var wrapper = $("#wrapper" + tabName + componentId);
			var noe2Content = $("#noeContentBody" + componentId);
			var columnArr = wrapper.find(".noe2-results-column");
			var wrapperWidth = wrapper.width();
			var step = wrapperWidth / columnArr.length;
			var maxScroll = (columnArr.length - 2) * step;
			var tempInd = (columnArr.length - 3) * step;
			var scrollTimer = null;
			var rightInd = true;
			var leftInd = false;
			var component = MP_Util.GetCompObjById(componentId);
			var curCol = 0;
			var maxCol = columnArr.length-2;

			//when tempInd is 0, fadeOut is not triggered on right scroll arrow
			if (tempInd === 0) {
				tempInd++;
			}

			//reset scrollLeft
			scrollContainer.scrollLeft(0);

			//check for resize event, if it happened, remove events
			if (resizeInd) {
				//Unbind the noe-2 namespace (removes all events with this namespace)
				leftSidebar.unbind(".noe2");
				rightSidebar.unbind(".noe2");
				scrollContainer.off("scroll");
			}

			//check for left or rightmost scroll position and fade out arrows
			scrollContainer.scroll(function() {
				if (curCol === 0) {
					leftSidebar.removeClass("noe2-scroll-active");
					leftInd = false;
				}
				if (curCol >= maxCol) {
					rightSidebar.removeClass("noe2-scroll-active");
					rightInd = false;
				}
			});
			//fade out arrow on default
			if (scrollContainer.scrollLeft() === 0) {				
				leftSidebar.removeClass("noe2-scroll-active");
			}
			if (columnArr.length <= 2) {
				rightSidebar.removeClass("noe2-scroll-active");
				rightInd = true;
			}
			else if(rightInd) {
				rightSidebar.addClass("noe2-scroll-active");
			}
			//Handle user hovering over the left scroll zone. This will scroll the contents to the left.
			leftSidebar.on("mouseenter.noe2", function(){
				//If already at the leftmost position, do not perform the left scroll functionality
				if(curCol <= 0) {
					return;
				}
				FavoriteModeless.hideCurrent();
				
				leftInd = true;
				//If able to scroll left, perform the scroll left animation and decrement the current column index
				if(curCol > 0) {
					curCol--;
					scrollContainer.animate({
						scrollLeft: curCol * step
					}, "slow");
				}
				//Create an interval to continually trigger the hover function. This allows one to keep the mouse
				//in the hover zone without having to hover multiple times.
				if (scrollTimer === null) {
					scrollTimer = window.setInterval(function() {
						if(curCol > 0) {
							curCol--;
							scrollContainer.animate({
								scrollLeft: curCol * step
							}, "slow");
						}	
					}, 1000);
				}
				rightSidebar.addClass("noe2-scroll-active");
			});
			//Handle the mouseleave, preventing the interval from triggering again.
			leftSidebar.on("mouseleave.noe2", function(){
				scrollTimer = window.clearInterval(scrollTimer);
				scrollTimer = null;
				leftInd = false;
			});
			//Handle user hovering over the right scroll zone. This will scroll the contents to the right.
			rightSidebar.on("mouseenter.noe2", function(){
				//If already at the rightmost position, do not perform the right scroll functionality.
				if(curCol >= maxCol) {
					return;
				}
				FavoriteModeless.hideCurrent();

				rightInd = true;
				//If able to scroll right, perform the scroll right animation and increment the current column index.
				if(curCol < maxCol) {
					curCol++;
					scrollContainer.animate({
						scrollLeft: curCol * step
					}, "slow");
				}
				//Create an interval to continually trigger the hover function. This allows one to keep the mouse
				//in the hover zone without having to hover multiple times.
				if (scrollTimer === null) {
					scrollTimer = window.setInterval(function() {
						if (curCol < maxCol) {
							curCol++;
							scrollContainer.animate({
								scrollLeft: curCol * step
							}, "slow");
						}
					}, 1000);
				}
				leftSidebar.addClass("noe2-scroll-active");
			});
			//Handle the mouseleave, preventing the interval from triggering again.
			rightSidebar.on("mouseleave.noe2", function(){
				scrollTimer = window.clearInterval(scrollTimer);
				scrollTimer = null;
				rightInd = false;
			});
			noe2Content.css({
				"overflow-y": "visible"
			});	
		},
		/**
		 * Set min/max height for main container div based on heights of results
		 * And set width for column wrapper based on total width of all columns
		 * @param {string} tabName : The name of the tab that is currently displaying results
		 * @param {int} componentId : The id of the component, passed in as a int
		 */
		SetContainerDimensions: function(tabName, componentId) {
			var container = $("#scrollContainer" + tabName + componentId);
			var wrapper = $("#wrapper" + tabName + componentId);
			var columnArr = $(wrapper).find(".noe2-results-column");

			if (container.length == 0 || wrapper.length == 0 || columnArr.length == 0) {
			    return;
			}

            // Gets the spacing between one column and contents. This is already multiplied
            // by two (symmetrical), because we are calculating basing on widths.
            var spacing = columnArr.outerWidth(true) - columnArr.width();

			//Get the dimension each column should have. Since it is a 2 column view, we divide by 2.
			var columnDimension = (container.width() / 2);

            //Set the width of each column to the containerWidth / 2 minus the spacing.
            columnArr.width(columnDimension - spacing);

            // Wrapper width should cover all columns horizontally
            wrapper.width(columnDimension * columnArr.length);

		},
		
		/*
		 *Sorts the favorites list elements based upon the class of the element. Folders and orderables have different classes. Extracted from Standard NewOrderEntry component.
		 * @param {char} componentId : The New Order Entry component_id 
		 * @param {string} tabName : The name of the tab(Mine or Shared).
		 * */
		ApplySortToFavorites:function(component, tabName) {
			var componentId=component.getComponentId();
			if (componentId && tabName) {
				var tabNameClass = tabName.toLowerCase();
				var sort_by_name = function(a, b) {
					var aName = _gbt('dd', a)[0];

					var bName = _gbt('dd', b)[0];
					return aName.innerHTML.toLowerCase().localeCompare(bName.innerHTML.toLowerCase());
				};
				var $wrapperContents = $('#wrapper' + tabName + componentId);
				//Extracting the columns from the current wrapper container.
				var $resultColumns = $wrapperContents.find(".noe2-results-column");
					//Appending the sorted elements to the columns instead of the wrapper.
					$($resultColumns).each(function(index){
						var $listDlFoldersInTab = $('dl[sort="folder-' + tabNameClass + '"]', $wrapperContents);
						var $listDlOrderablesInTab = $('dl[sort="orderable-' + tabNameClass + '"]', $wrapperContents);
						if($listDlFoldersInTab){
						$listDlFoldersInTab.sort(sort_by_name);
						$listDlFoldersInTab.each(function(index) {
							$resultColumns.append($(this));
						});
					}
					if ($listDlOrderablesInTab) {
						
						$listDlOrderablesInTab.sort(sort_by_name);
						
						$listDlOrderablesInTab.each(function(index) {
							$resultColumns.append($(this));
						});
					}
						
					});
					
			}
		}
		,
		/**
		 * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
		 * @param {char} compId : The New Order Entry component_id
		 * @param {boolean} pendingInd : true = current component has pending data.  Prompt the user before they navigate away from the chart
		 */
		CheckPendingSR: function(compId, pendingInd) {
			var srObj = null;
			var dataObj = {};
			//Get the shared resource
			srObj = MP_Resources.getSharedResource("pendingDataSR");

			if (srObj) {
				//Retrieve the object from the shared resource.
				dataObj = srObj.getResourceData();
				if (dataObj) {
					var pendingArr = dataObj.pendingDataCompArr;
					if (pendingInd) {//Add component to the array of pending components.  Keep a distinct list of component ID's
						if (pendingArr.join("|").indexOf(compId) === -1) {
							pendingArr.push(compId);
						}
					}
					else {//The component no longer has pending data.  Remove the component id from the array.
						var idx = pendingArr.length;
						while (idx--) {
							if (compId === pendingArr[idx]) {
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
		},
		
		CreateFutureOrderMessageBar : function(compId) {
			var futureOrderDiv = _g("noeNewOrderPrefMessage" + compId);
			if(futureOrderDiv){
				return;
			}
			var newOrderPrefDiv = Util.cep("div", {
				"className" : "message-container",
				"id" : "noeNewOrderPrefMessage" + compId
			});

			var eligibilityInfoDiv = Util.cep("div", {
				"className" : "message-container",
				"id" : "eligibilityInfoMessage" + compId
			});

			var component = MP_Util.GetCompObjById(compId);
			var m_contentNode = component.getRootComponentNode();
			if (m_contentNode) {
				var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
				Util.ia(newOrderPrefDiv, m_contentNodeHd);
				Util.ia(eligibilityInfoDiv, newOrderPrefDiv);
			}
		}

	};

	/**
	 * Create scratchpad Shared Resource.
	 * @param {string} sharedResourceName : The name of the shared resource to create
	 * @return {Object} srObj : Scratchpad shared resource object
	 */
	function initScratchpadSR(sharedResourceName) {
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
	
    function createSegment(component, tabName, activeClass){
        var noei18n = i18n.discernabu.noe_o2;
        var tabArr = [];
        var segHTMLArr = [];
        var componentId = component.getComponentId();
        var homeTabIdx = (component.isHomeFavEnabled() ? 1 : 0);
        var mineTabIdx = (component.isUserFavEnabled() ? 1 : 0);
        var publicTabIdx = (component.isPublicFavEnabled() ? 1 : 0);
        var sharedTabIdx = (component.isSharedFavEnabled() ? 1 : 0);
        var tabSum = homeTabIdx + mineTabIdx + publicTabIdx + sharedTabIdx;
        var tabNameLower = tabName.toLowerCase();
        var segDivId = tabNameLower + "Tab" + componentId;
        var segDivClass = "noe2-" + tabNameLower + "-hd";
        var segCtrlClass = "noe2-seg-cont-center-" + activeClass;
        var segContentSpanClass = null;
		var tabLabel = null;
        
        if (homeTabIdx) {
            tabArr.push("Home");
        }
        if (mineTabIdx) {
            tabArr.push("Mine");
        }
        if (publicTabIdx) {
            tabArr.push("Public");
        }
        if (sharedTabIdx) {
            tabArr.push("Shared");
        }
        
        switch (tabName) {
            case "Home":
                segCtrlClass += " noe2-tabsection-left-edge";
                break;
            case "Mine":
                tabLabel = (component.getUserFavLabel() ? component.getUserFavLabel() : noei18n.MINE);
                break;
            case "Public":
                tabLabel = (component.getPublicFavLabel() ? component.getPublicFavLabel() : noei18n.PUBLIC);
                break;
            case "Shared":
                tabLabel = (component.getSharedFavLabel() ? component.getSharedFavLabel() : noei18n.SHARED);
				break;
        }
 
        if (tabArr.indexOf(tabName) + 1 === tabSum) {
            segCtrlClass += " noe2-tabsection-right-edge";
        }

        segHTMLArr.push("<div id='", segDivId, "' class='noe2-", tabNameLower, "-hd'><div class='", segCtrlClass, "'>");
        if (tabName === "Home") {
            segHTMLArr.push("<span class='noe2-home-icon'></span>");
        }
        else {
            segHTMLArr.push("<span>", tabLabel, "</span>");
        }
        segHTMLArr.push("</div></div>");
        
        return segHTMLArr.join("");
        
    }

}();
