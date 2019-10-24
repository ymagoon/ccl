/**
 * new_order_entry.js
 * @author Leonardo S�
 * 
 */

var MPageComponents = MPageComponents ? MPageComponents : {};

(function() {

	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------

	/**
	 * Wrapper over the original noe option 1 and 2 components. This class is 
	 * an abstraction layer for the NOE refactor. Initially, it will abstract 
	 * all calls to either the option 1 or option 2 instances. Ultimately, 
	 * once the refactor is done, this class shall replace the entire original 
	 * component.
	 */
	MPageComponents.NewOrderEntry = function() {
		this.setTabGroup(new MPageControls.TabGroup());
		this.setOrderSearchControl(null);
		this.setFaceUpSuggestionLimit(50);
		this.tabs = {};
	};
	var NewOrderEntry = MPageComponents.NewOrderEntry;

	NewOrderEntry.Venues = {
		INPATIENT : 1,
		AMBULATORY : 2
	};
	
	NewOrderEntry.NewOrderPref = {
		NOT_CONFIGURED :0,
		ALLOW : 1,
		REJECT : 2,
		WARN : 3
		
	};
	NewOrderEntry.MessageType = {
		WARNING : 1,
		INFORMATION : 2
	};

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	/**
	 * An object that contains all the templates used by this component
	 */
	attribute(NewOrderEntry, "Templates");

	/**
	 * The ID of the element into where the component will be rendered
	 */
	attribute(NewOrderEntry, "TargetElementId");

	/**
	 * A ID that uniquely identifies this component
	 */
	attribute(NewOrderEntry, "ComponentId");

	/**
	 * A TabGroup object that contains all enabled tabs
	 */
	attribute(NewOrderEntry, "TabGroup");

	/**
	 * The ID of the element which will be used for the order search
	 */
	attribute(NewOrderEntry, "OrderSearchElementId");

	/**
	 * The OrderSearch control instance
	 */
	attribute(NewOrderEntry, "OrderSearchControl");

	/**
	 * Whether the order search functionality will be displayed or not
	 */
	attribute(NewOrderEntry, "OrderSearchEnabled");

	/**
	 * Criterion to be used by the component's database queries
	 */
	attribute(NewOrderEntry, "Criterion");

	/**
	 * Maximum number of suggestions to be retrieved by the OrderSearch
	 * control.
	 */
	attribute(NewOrderEntry, "SuggestionLimit");

	/**
	 * Maximum number of suggestions that will be displayed face up
	 * when the user presses "enter" on the order search control
	 */
	attribute(NewOrderEntry, "FaceUpSuggestionLimit");

	/**
	 * The encounter type code for the component
	 */
	attribute(NewOrderEntry, "EncounterTypeCd");

	/**
	 * The facility id that will be used by the OrderSearch control
	 */
	attribute(NewOrderEntry, "FacilityId");

	/**
	 * Search indicator flags for the OrderSearch control
	 */
	attribute(NewOrderEntry, "SearchIndicators");

	/**
	 * The venue to be used in the search control
	 */
	attribute(NewOrderEntry, "SearchVenueType");

	/**
	 * The current venue type for the component
	 */
	attribute(NewOrderEntry, "VenueType");

	/**
	 * The instance of the old component, before the refactor. This will have
	 * to remain here until all the code is moved from the old component to
	 * noe-base.
	 */
	attribute(NewOrderEntry, "LegacyComponent");

	/**
	 * The namespace used in the old component.
	 */
	attribute(NewOrderEntry, "LegacyNamespace");

	/**
	 * A map of the tabs that have been enabled. This is used to access tab
	 * instance by name. For example: this.getTabInstances().public
	 */
	attribute(NewOrderEntry, "TabInstances");

	/**
	 * JSON containing data retrieved from the backend.
	 */
	attribute(NewOrderEntry, "RecordData");

	/**
	 * I18N object that contains component specific translations
	 */
	attribute(NewOrderEntry, "I18n");

	/**
	 * Points to the instance of the tab that has been loaded by default when
	 * the component first loads.
	 */
	attribute(NewOrderEntry, "DefaultTab");

	/**
	 * A dictionary with the names of the timers used through the component
	 */
	attribute(NewOrderEntry, "TimerNames");
	
	/**
	 * The ID of the element which will be used to display a message for the two New Order(DISCH/FUTURE) Preferences
	 */
	attribute(NewOrderEntry, "NewOrderPrefMsgElemId");
	
	/**
	 * Future New Order Preference Value from back-end
	 */
	attribute(NewOrderEntry, "FutureOrderMessagePref");

	/**
	 * Discharge New Order Preference value returned from back-end
	 */
	attribute(NewOrderEntry, "DischNewOrderPref");

	/**
	 * Describes whether orderSentences filters have been toggled off
	 */
	 attribute(NewOrderEntry, "OrderSentencesEnabled");

	/**
	 * Keeps track of the "displayOrderSentenceFilters" user preference
	 */
	 attribute(NewOrderEntry, "ShowOrderSentenceDetailUserPref");

	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	var prot = MPageComponents.NewOrderEntry.prototype;

	/**
	 * Renders the component template, initializes the order search control
	 * and creates the individual tabs.
	 */
	prot.init = function() {
		
		// check for incomplete configuration
		var template = null;
		if (!this.getTabGroup().getControls().length) {
			throw new Error(i18n.discernabu.CONFIG_INCOMPLETE +
					"&nbsp;" + i18n.CONTACT_ADMINISTRATOR);
		}
		//Check whether the Future_New_Order pref is neither empty nor set to Reject.
		var futureOrderPref = this.getFutureOrderMessagePref();
		if(futureOrderPref !== NewOrderEntry.NewOrderPref.REJECT || futureOrderPref === NewOrderEntry.NewOrderPref.NOT_CONFIGURED){
			// render the main template
			template = TemplateBuilder.buildTemplate(this.getTemplates().main);
			// create content
			$("#" + this.getTargetElementId()).html(
					template.render(this.makeRenderParams()));
			this.createOrderSearchControl();
			this.createTabs();	
		} else {
			//When Future_New_Order pref is reject, render only the warning.
				var newOrderPrefDiv = $("#noeNewOrderMessage"+this.getLegacyComponent().getComponentId());
				if(!newOrderPrefDiv.length){
					template = TemplateBuilder.buildTemplate(this.getTemplates().newOrderPref);
					$("#" + this.getTargetElementId()).html(
							template.render(this.makeRenderParams()));	
					}
					
		}
		//create the warning 
		this.createNewOrderPrefMessage();	
		
		//Default orderSentence Filtering on for NOE components
		this.setOrderSentencesEnabled(true);
	};

	// ________________________________________________________________________

	/**
	 * Returns an object with a component, compId, i18n set, warning and informational messages based
	 * upon the preferences. This is useful when passing those arguments to a template function.
	 */
	prot.makeRenderParams = function() {
		return {
			"component" : this,
			"compId" : this.getLegacyComponent().getComponentId(),
			"i18n" : this.getI18n(),
			"warningMessage" : this.getMessage(1),
			"informationMessage" : this.getMessage(2)
		};
	};
	
	// ________________________________________________________________________
	/**
	 *Taken the messageType{"WARNING/INFORMATION"} and returns the appropriate i18n Message.
	 * This will help and having single template which can use different messages.
	 */
	prot.getMessage = function(msgType) {
		var msg ="";
		var i18n = this.getI18n();
		if (this.getDischNewOrderPref() > 1) {
			msg += msgType === NewOrderEntry.MessageType.WARNING ? i18n.VIEWING_DISCHARGE_ENCOUNTER_MSG : i18n.PLACE_PRESCRIPTIONS_ONLY;
		} else if (this.getFutureOrderMessagePref() >= 1) {
			msg += msgType === NewOrderEntry.MessageType.WARNING ? i18n.VIEWING_FUTURE_ENCOUNTER_MSG : i18n.CANNOT_PLACE_ORDER;
		}
		return msg;
	}; 

	// ________________________________________________________________________

	/**
	 * Creates the order search bar that sits on the top of the component
	 */
	prot.createOrderSearchControl = function() {
		if (!this.getOrderSearchEnabled()) {
			return;
		}

		var self = this;

		// update the search indicators
		this.getLegacyNamespace().ApplySearchSettings(this.getLegacyComponent());

		// sets the element that will contain the textbox
		this.setOrderSearchElementId("noeSearchBox" +
				this.getLegacyComponent().getComponentId());

		// create the order search control
		var element = $("#" + this.getOrderSearchElementId());
		var control = new MPageControls.OrderSearch(element);
		this.setOrderSearchControl(control);

		// add a timer for when the user clicks the textbox
		control.getTextbox().click(function() {
			self.fireCapTimer(self.getTimerNames().SEARCH);
		});

		// set the parameters
		this.loadOrderSearchAttributes();
		control.activateCaption();

		// if the user presses "enter" in the search box, it will
		// display, face up, the number of results specified by
		// this.getFaceUpSuggestionLimit
		control.setOnEnter(function() {

			// display the search results tab with a spinning wheel
			self.getTabGroup().selectSingle(self.tabs.searchresults);
			self.tabs.searchresults.showLoading();

			// calls the order search script and fills in the response
			control.close();
			control.setSuggestionLimit(self.getFaceUpSuggestionLimit());
			control.searchOrders(function(response) {
				self.tabs.searchresults.onLoad();
				self.loadSearchResults(response);
			});
			control.setSuggestionLimit(self.getSuggestionLimit());
		});

		// Clicking an item in the dropdown will add it to the scratchpad
		// and make the box lose focus
		control.getList().setOnSelect(function() {
			control.close();
			self.addOrderToScratchpad(control.getList().getSelectedItem());
			control.activateCaption();
		});

		// pressing enter when an item is selected will add it to the
		// scratchpad, clear the box and remain in focus for more searching.
		control.getList().setOnEnter(function() {
			control.close();
			self.addOrderToScratchpad(control.getList().getSelectedItem());
			control.setValue("");
		});

	};

	// ________________________________________________________________________

	prot.loadOrderSearchAttributes = function() {
		var control = this.getOrderSearchControl();

		control.setCriterion(this.getCriterion());
		control.setSuggestionLimit(this.getSuggestionLimit());
		control.setEncounterTypeCd(this.getEncounterTypeCd());
		control.setFacilityId(this.getFacilityId());
		control.setSearchIndicators(this.getSearchIndicators());
		control.setVenueType(this.getSearchVenueType());
		control.setCaption(this.getI18n().SEARCH_ORDER);

	};

	// ________________________________________________________________________

	/**
	 * Sets the template for the tab buttons, renders all the tab buttons,
	 * and selects the default tab
	 */
	prot.createTabs = function() {
		var tabgroup = this.getTabGroup();
		var compId = this.getComponentId();
		tabgroup.setButtonsContainerId("noeTabButtons" + compId);
		tabgroup.setContentsContainerId("noeTabContent" + compId);
		tabgroup.setDefaultButtonTemplate(this.getTemplates().tabButtons);

		tabgroup.render();

		if (this.getDefaultTab() !== undefined) {
			tabgroup.selectSingle(this.getDefaultTab());
		}

	};

	// ========================================================================
	// From here on, these methods are just to maintain compatibility with the
	// old O1 and O2 components. The objective is to refactor those in the
	// future to the point that we don't need to reference O1 or O2 anymore.
	// ========================================================================

	// ________________________________________________________________________

	/**
	 * Copies all the relevant properties from an old option 1 or 2 component
	 * instance into the current object.
	 * 
	 */
	prot.loadLegacyComponent = function(instance, namespace, i18n) {

		// --------------------------------------------------------------------
		// Load options
		// --------------------------------------------------------------------
		this.setComponentId(instance.getComponentId());
		this.setFacilityId(instance.getFacilityId());
		this.setSearchIndicators(instance.getSearchIndicators());
		this.setEncounterTypeCd(instance.getEncntrTypeCd());
		this.setVenueType(instance.getVenueType());
		this.setLegacyComponent(instance);
		this.setLegacyNamespace(namespace);
		this.setCriterion(instance.getCriterion());
		this.setOrderSearchEnabled(instance.isOrderSearchInd());
		this.setSearchVenueType(instance.getEncntrVenueInd());
		this.setI18n(i18n);

		// --------------------------------------------------------------------
		// Load tabs
		// --------------------------------------------------------------------

		if (this.shouldHomeTabBeDisplayed(instance)) {
			this.addTab(NewOrderEntry.HomeTab);
		}
		if (instance.isUserFavEnabled()) {
			this.addTab(NewOrderEntry.MineTab);
		}
		if (instance.isPublicFavEnabled()) {
			this.addTab(NewOrderEntry.PublicTab);
		}
		if (instance.isSharedFavEnabled()) {
			this.addTab(NewOrderEntry.SharedTab);
		}
		if (this.getOrderSearchEnabled()) {
			this.addTab(NewOrderEntry.SearchTab);
		}

		// --------------------------------------------------------------------
		// Update search params if the control exists
		// --------------------------------------------------------------------
		if (this.getOrderSearchControl()) {
			this.loadOrderSearchAttributes();
		}

	};

	// ________________________________________________________________________

	/**
	 * The home tab will only be displayed if isHomeFav is set and at least
	 * one of the other tabs are visible
	 */
	prot.shouldHomeTabBeDisplayed = function(instance) {
		return instance.isHomeFavEnabled &&
				instance.isHomeFavEnabled() &&
				(instance.isUserFavEnabled() ||
					instance.isPublicFavEnabled() || 
					instance.isSharedFavEnabled());
	};

	// ________________________________________________________________________

	/**
	 * Adds a new tab to the TabGroup based on the tab class provided
	 */
	prot.addTab = function(TabClass) {
		// we won't be readding tabs here, but will be asking them to reload
		var tabName = TabClass.ALIAS.toLowerCase();
		if (this.tabs[tabName] !== undefined) {
			this.tabs[tabName].setLoaded(false);
			return;
		}

		var tab = new TabClass(this);
		this.tabs[tabName] = tab;
		this.getTabGroup().add(tab);
		
		// the default tab should never be the search results
		if (this.getDefaultTab() === undefined && tab != this.tabs.searchresults) {
			this.setDefaultTab(tab);
		}
	};

	// ________________________________________________________________________

	/**
	 * Displays the search results based on the response of the search CCL 
	 * script. This shall be refactored to use an array of Order instances 
	 * instead, when we start refactoring the list that displays the orders 
	 * and folders.
	 */
	prot.loadSearchResults = function(jsonResponse) {
		this.tabs.searchresults.setResultsJson(jsonResponse);
		this.getTabGroup().selectSingle(this.tabs.searchresults);
	};

	// ________________________________________________________________________

	/**
	 * Will call the CCL script responsible for the recordData in the script
	 */
	prot.refreshRecordData = function(excludeTabFromRefresh) {
		var self = this;
		var currentTabMask = this.getTabGroup().getCurrent().getTabMask();

		// Refresh all tabs except the one specified in the argument
		$.each(this.getTabGroup().getControls(), function() {
			if (this == excludeTabFromRefresh) {
				return;
			}
			this.showLoading();
		});

		// Requests a new RecordData
		this.requestRecordData(function(response, component) {
					self.setRecordData(response.getResponse());
					self.refreshTabs();
					self.refreshSearchIndicators();
					// Rerenders the tab if reloadCurrentTab is true AND we have
					// a current tab, or the tab being displayed is different
					// than the tab that requested the refresh in the first place
					if (self.getTabGroup().getCurrent() != excludeTabFromRefresh) {
						self.getTabGroup().getCurrent().onLoad();
					}
				}, currentTabMask);
	};

	// ________________________________________________________________________

	/**
	 * Will recalculate the order search indicators
	 */
	prot.refreshSearchIndicators = function() {
		var recordData = this.getRecordData();
		var component = this.getLegacyComponent();

		if (recordData.VIEWPLORDERS !== undefined) {
			component.setDispOnlyProductLevelMeds(recordData.VIEWPLORDERS);
		}
		this.getLegacyNamespace().ApplySearchSettings(component);

	};

	// ________________________________________________________________________

	/**
	 * Triggered whenever the venue has been changed. Will refresh the tabs,
	 * except for the search tab.
	 */
	prot.onVenueChange = function() {
		if (this.getTabGroup().getCurrent() == this.tabs.searchresults) {
			this.refreshRecordData(this.tabs.searchresults);
			return;
		}
		this.refreshRecordData();
	};

	// ________________________________________________________________________

	/**
	 * Marks all tabs as unloaded so they will reload once selected again
	 */
	prot.refreshTabs = function() {
		$.each(this.getTabGroup().getControls(), function() {
			this.setLoaded(false);
		});
	};

	// ________________________________________________________________________

	/**
	 * Makes all tabs display the spinner
	 */
	prot.showLoading = function() {
		$.each(this.getTabGroup().getControls(), function() {
			this.showLoading();
		});
	};

	// ________________________________________________________________________

	/**
	 * Adds an order to either the embedded scratchpad or the shared resource
	 * one.
	 * 
	 * God willing, this method will be temporary, and we shall rewrite it in
	 * the near future when we start refactoring NOE scratchpad logic. This 
	 * should take an actual Order object when refactored.
	 */
	prot.addOrderToScratchpad = function(order) {
		var Order = MPageComponents.NewOrderEntry.Order;

		// figure out what type the order is
		var favType = Order.Types.ORDER;
		if (order.PATH_CAT_ID) {
			favType = Order.Types.POWERPLAN;
		} else if (order.ORDERABLE_TYPE_FLAG == 6) {
			favType = Order.Types.CARESET;
		}

		// add to the scratchpad
		this.getLegacyNamespace().AddSearchItemToScratchPad(order,
				this.getLegacyComponent(), favType);
	};

	// ________________________________________________________________________

	/**
	 * Fires a CAP timer with the specified name
	 */
	prot.fireCapTimer = function(name) {
		var slaTimer = MP_Util.CreateTimer(name);
		if (slaTimer) {
			slaTimer.SubtimerName = this.getCriterion().category_mean;
			slaTimer.Start();
			slaTimer.Stop();
		}

	};

	// ________________________________________________________________________

	/**
	 * Fires the order timer and add to scratch pad timer for the selected tab
	 */
	prot.fireOrderTimer = function(synonymID) {
		// we don't have timer names for search, so don't fire it when there
		// are no tabs
		if (!this.getTabGroup().getCurrent()) {
			return;
		}
		if(!(isFinite(parseFloat(synonymID)))){
			// safety check for the synonymID
			synonymID = "";
		}
		var elementId = $("#" + this.getOrderSearchElementId());
		var inputElementLength = elementId.find("input[type=text]").length
		//Make sure that the jquery results aren't malformed. If they are, return.
		if(elementId && inputElementLength){
			searchText = elementId.find("input[type=text]").val();
		}
		else{
			return;
		} 
				
		var tabAlias = this.getTabGroup().getCurrent().getAlias().toUpperCase();
		var timerNames = this.getTimerNames().ORDER;
		if (tabAlias in timerNames) {
			this.fireCapTimer(timerNames[tabAlias]);
		}
		if("ORDER_ADDTOSCRATCHPAD" in this.getTimerNames()) {
			timerNames = this.getTimerNames().ORDER_ADDTOSCRATCHPAD;
			if (tabAlias in timerNames) {			
				var orderAddToScratchpadCAPTimer = new CapabilityTimer(timerNames[tabAlias],this.getCriterion().category_mean);
					orderAddToScratchpadCAPTimer.addMetaData("rtms.legacy.metadata.1", searchText);
					orderAddToScratchpadCAPTimer.addMetaData("rtms.legacy.metadata.2", synonymID);
					orderAddToScratchpadCAPTimer.capture();
			}
		}
	
	};
	
	// ________________________________________________________________________

	/**
	 * Fires the order timer if the order is selected from search dropdown
	 */
	prot.fireOrderTimerFromSearch = function(synonymID) {
		var elementId = $("#" + this.getOrderSearchElementId());
		var inputElementLength = elementId.find("input[type=text]").length
		//Make sure that the jquery results aren't malformed. If they are, return.
		if(elementId && inputElementLength){
			searchText = elementId.find("input[type=text]").val();
		}
		else{
			return;
		} 
		var timerName = this.getTimerNames().ORDER["SEARCHRESULTS"];		
		var clickOrderFromSearchCAPTimer = new CapabilityTimer(timerName,this.getCriterion().category_mean);
		if(!(isFinite(parseFloat(synonymID)))){
			// safety check for the synonymID
			synonymID = "";
		}
		clickOrderFromSearchCAPTimer.addMetaData("rtms.legacy.metadata.1", searchText);
		clickOrderFromSearchCAPTimer.addMetaData("rtms.legacy.metadata.2", synonymID);
		clickOrderFromSearchCAPTimer.capture();		
	 	timerName = this.getTimerNames().ORDER_ADDTOSCRATCHPAD["SEARCHRESULTS"];	 	
		var orderAddToScratchpadFromSearchCAPTimer = new CapabilityTimer(timerName,this.getCriterion().category_mean);
		orderAddToScratchpadFromSearchCAPTimer.capture();		

	};

	// ________________________________________________________________________

	/**
	 * Creates the Future new order or the Discharge new  order message control based
	 * upon the preference retrieved.
	 */
	prot.createNewOrderPrefMessage = function() {
	
		var template = null;
		var element = null;
		var message = null;
		var control = null;
		var messageType = null;
		var futureNewOrderPref = this.getFutureOrderMessagePref();
		var dschNewOrderPref = this.getDischNewOrderPref();
		var component = this.getLegacyComponent();

		//check whether the future_order_pref is not defined or not set.
		if (futureNewOrderPref === undefined || futureNewOrderPref === NewOrderEntry.NewOrderPref.NOT_CONFIGURED && (dschNewOrderPref === undefined || dschNewOrderPref === NewOrderEntry.NewOrderPref.NOT_CONFIGURED || dschNewOrderPref === NewOrderEntry.NewOrderPref.ALLOW)) {
			return;
		}
		this.setNewOrderPrefMsgElemId("noeNewOrderPrefMessage" + this.getLegacyComponent().getComponentId());
		
		//The element where the warning/information div would appear
		element = $("#" + this.getNewOrderPrefMsgElemId());
		//Generic template for both warning or information. 
		template = MPageControls.getDefaultTemplates().messageBar;
		
		//check whether to create a warning or information
		if (futureNewOrderPref === NewOrderEntry.NewOrderPref.WARN || futureNewOrderPref === NewOrderEntry.NewOrderPref.ALLOW || dschNewOrderPref === NewOrderEntry.NewOrderPref.WARN) {
			messageTemplate = this.getTemplates().warningMessage;
			messageType = MPageControls.AlertMessage.MessageTypes.WARNING;
		} else if(futureNewOrderPref === NewOrderEntry.NewOrderPref.REJECT || dschNewOrderPref === NewOrderEntry.NewOrderPref.REJECT){
			//Create the information message bar for  the Reject preference
			messageTemplate = this.getTemplates().informationMessage;
			messageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
		}
		message = TemplateBuilder.buildTemplate(messageTemplate);

		//Creates the AlertMessage control and renders it.
		control = new MPageControls.AlertMessage(element, template, messageType);
		control.render(message.render(this.makeRenderParams())); 

	};
	
	/**
	 *Creates a label for the single venue that is displayed when the  
	 *discharge new order preference set to Reject.  
	 */
	prot.createDisabledVenue = function(venue){
		var component = this.getLegacyComponent();
		var venueHtml = [];
		var componentId = this.getComponentId();
		var m_contentNode = component.getRootComponentNode();
            if (m_contentNode){
                var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
                var venueTypeEle = Util.cep("div", {        	 
        	        "id": "noeHdVenueType" + componentId
        	    });
        	    venueHtml.push("<span class='noe-disabled-venue'>",venue.DISPLAY,"</span>");
				Util.ia(venueTypeEle, m_contentNodeHd);
				$('#noeHdVenueType' + componentId).html(venueHtml.join(""));
			}
	};
	// ________________________________________________________________________
	
	/**
	 *  Implementation of the GetNewOrdeEntryData's call to mp_get_powerorder_favs_json at base level.
	 * 
	 */
	prot.requestRecordData = function(callback, tabMask) { 
		var component = this.getLegacyComponent();
		var criterion = this.getCriterion();
		var componentId = this.getComponentId();
		var venueType = this.getVenueType();
		var orderMask = 0;
		var virtualViewMask = 0;
		var orderSearchMask = 0;
		var planSearchMask = 0;
		var productLevelMask = 0;
		var sharedPlanMask = 0;
		var tabs = this.tabs;
		
		var favsRequest = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
		
		if (venueType === 1) {
			component.setDispOnlyProductLevelMeds(0);
			productLevelMask = 0;
		} else {
			component.setDispOnlyProductLevelMeds(1);
			productLevelMask = 16;
		}
		//If either of the tab is on, calculate the planSearch and sharedPlanMask
		if (tabs.mine || tabs["public"] || tabs.shared) { 
			planSearchMask = (component.isPowerPlanEnabled() ? 8 : 0);
			sharedPlanMask = (component.isPowerPlanEnabled() ? 32 : 0);
			//Temporary fix to get both orders and Mine data.
			orderSearchMask = tabMask===4?0:4;
		}
		
		virtualViewMask = (component.isVirtViewOrders() || component.isVirtViewRxOrders() ? 3 : 0);
		orderMask = virtualViewMask + planSearchMask + productLevelMask + sharedPlanMask + orderSearchMask + tabMask;
		var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "0.0", "^FAVORITES^", criterion.position_cd + ".0", criterion.ppr_cd + ".0", orderMask, venueType, 1];
		favsRequest.setProgramName("mp_get_powerorder_favs_json");
		favsRequest.setParameters(sendAr);
		favsRequest.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(component, favsRequest, callback);
	};


	/**
	 * Renders formulary eligibility information within the current tab based on provided orders and health plan uid
	 * @param  {Double} uid          eligibility UID for the healthplan to render eligibility information for
	 * @param  {Array} noeOrderList array of folders returned from mp_get_powerorder_favs_json
	 */
	prot.renderFormularyInfo = function(uid, noeOrderList, tabName){
		var baseComponent = this;
		if (uid){
			var component = baseComponent.getLegacyComponent();
			var recordData = this.getRecordData();
			var ckiList =  this.retrieveCKIFromReply(noeOrderList);
			var namespace = component.getStyles().getNameSpace();
			var currentTab = baseComponent.tabs[tabName];
			if (currentTab){
				var element = currentTab.getElement();
				this.retrieveEligibilityInfo(uid, ckiList, element);
			}
		}
	};

	/**
	 * Render formulary eligibility information with the search tab based on found orders and health plan uid
	 * @param  {Double} uid       eligibility UID for the health plan to render eligibility information for
	 * @param  {Array} orderList array of orders returned from mp_search_orders
	 */
	prot.renderFormularySearch = function(uid, orderList){
		var baseComponent = this;
		if (uid){
			var component = baseComponent.getLegacyComponent();
			var ckiList = this.retrieveCKIFromSearchReply(orderList);
			var currentTab = baseComponent.tabs["searchresults"];
			if (currentTab){
				var element = currentTab.getElement();
				this.retrieveEligibilityInfo(uid, ckiList, element);
			}
		}
	};

	/**
	 * Generate a list of CKIs based on the passed in list of orders
	 * @param  {Array} searchList list of orders as returned from mp_search_orders
	 * @return {Array} ckiList List of all CKIs found within the passed list
	 */
	prot.retrieveCKIFromSearchReply = function(searchList){
		var ckiList = [];
		var uniqueCKIObj = {};		
		var order;
		var cki;
		var orderCnt = searchList.length;
		//Obtain unique CKIs in uniqueCKIObj
		for (var i = 0; i < orderCnt; i++){
			order = searchList[i];
			cki = order.CKI;
			if (cki){
				if (!uniqueCKIObj[cki]){
					uniqueCKIObj[cki] = true;
				}
			}
		}
		// Convert uniqueCKIObj to array
		for (cki in uniqueCKIObj){
			ckiList.push(cki);
		}
		return ckiList;
	};

	/**
	 * Generate a list of CKIs based on the passed in array of orders
	 * @param  {Array} noeOrdersJSON list of order folders returned from mp_get_powerorder_favs_json
	 * @return {Array} ckiList List of CKIs found within the order list
	 */
	prot.retrieveCKIFromReply = function(noeOrdersJSON){
		var ckiList = [];
		var uniqueCKIObj = {};
		var noeFolder;
		var noeChildList;
		var noeChild;
		var cki;
		var noeFolderCnt = noeOrdersJSON.length;
		//Obtain unique CKIs in uniqueCKIObj
		for (var i = 0; i < noeFolderCnt; i++){
			noeFolder = noeOrdersJSON[i];
			noeChildList = noeFolder.CHILD_LIST;
			noeChildCnt = noeChildList.length;
			for (var j = 0; j < noeChildCnt; j++){
				noeChild = noeChildList[j];
				cki = noeChild.CKI;
				if (cki){
					if (!uniqueCKIObj[cki]){
						uniqueCKIObj[cki] = true;
					}
				}
			}
		}
		// Convert uniqueCKIObj to array
		for (cki in uniqueCKIObj){
			ckiList.push(cki);
		}
		return ckiList;
	};

	/**
	 * Rerender eligibility details in the component based on the newly selected health paln
	 * @param  {Double} uid       uid of health plan to retrieve eligibility details for
	 */
	prot.refreshEligibilityInfo = function(uid){
		var uniqueCKIObj = {};
		var ckiList = [];
		var component = this.getLegacyComponent();
		var rootNode = component.getRootComponentNode();
		var namespace = component.getStyles().getNameSpace();
		//Remove previous eligibility icons
		this.clearEligibilityIcons(rootNode);
		//Retrieve CKIs based off of one has been cached within the component rows
		//This is beging used to ensure that CKIs are sent for both active and previously visited tabs
		$('.' + namespace + '-info', rootNode).each(function(index, element){
			var cki = $(this).data('cki');
			if (cki){
				if(!uniqueCKIObj[cki]){
					uniqueCKIObj[cki] = true;
				}
			}
		});
		// generate list of unique CKIs
		for (cki in uniqueCKIObj){
			ckiList.push(cki);
		}
		this.retrieveEligibilityInfo(uid, ckiList, rootNode);
	};

	/**
	 * Retrieve eligibility details from the SharedPlanEligibilityInfo resource
	 * @param  {Double} uid     UID of the health plan to retrieve eligibility info for
	 * @param  {Array} ckiList  List of CKIs to retrieve eligibility info for
	 * @param  {HTML Element} element Element in which eligibility info is to be rendered
	 */
	prot.retrieveEligibilityInfo = function(uid, ckiList, element){
		var self = this;
		var wrappedCallback = function(ckiMap){
			self.renderEligibilityInformation(ckiMap, element);
		};
		if (uid && ckiList){
			SharedPlanEligibilityInfo.retrieveEligibilityInfo(uid, ckiList, wrappedCallback);
		}
	};

	/**
	 * Clears all eligibility icons within a specified element
	 * @param  {HTML element} element The html element to clear eligibility icons from
	 */
	prot.clearEligibilityIcons = function(element){
		var component = this.getLegacyComponent();
		var namespace = component.getStyles().getNameSpace();
		$('.' + namespace + '-info', element).find('.' + namespace + '-eligibility-info').empty();
	};

	/**
	 * Render the eligibility information within the specified element given provided CKIs and CKI to eligibility detail mappings
	 * @param  {Object} ckiMap  Map of CKI to eligibility Details
	 * @param  {HTML Element} element HTML Container in which eligibility information is to be rendered
	 */
	prot.renderEligibilityInformation = function(ckiMap, element){
		var component = this.getLegacyComponent();
		var namespace = component.getStyles().getNameSpace();
		var rootNode;
		// For each row, find matching eligibility information for the stored CKI
		$('.' + namespace + '-info', element).each(function(index, element){
			var cki = $(this).data('cki');
			var eligibilityElement = $(this).find('.' + namespace + '-eligibility-info');
			var eligibilityInfo;
			var annotatedText;
			var benefitRating;
			var formularyDetails;
			if(cki){
				eligibilityInfo = ckiMap[cki];
				if (eligibilityInfo){
					benefitRating = eligibilityInfo.BENEFIT_RATING;
					annotatedText = eligibilityInfo.ANNOTATED_TEXT || '';
					formularyDetails = eligibilityInfo.FORMATTED_DETAILS;
					//Render eligibility icon
					HealthPlanEligibilityInfo.generateIconHtml(eligibilityElement, benefitRating, annotatedText, formularyDetails);
				}
				else{
					eligibilityElement.empty();
				}
			}
		});
	};
	
	
		/**
		 * Creates a order sentence detail string array, which contains the specific order sentence filters
		 * that is to be joined an orderItem cell string in the orders table.
		 * @param {Object} ageFilter : Full AgeFilter orderSentence information containing ageMin, ageMax & ageUnit
		 * @param {Object} weightFilter : Full WeightFilter orderSentence filter information containing weightMin, weightMax & weightUnit
		 * @param {Object} pmaFilter : Full pmaFilter orderSentence filter information containing pmaMin, pmaMax & pmaUnit
		 * @return {Array} filterDetailString : Contains spoken filter information based on input. i.e [Less than ageMax ageUnit AND Equal or Greater than weightMin weightUnit]
		 */
		prot.getOrderSentenceDetails = function(ageFilter, weightFilter, pmaFilter) {
			var filterDetailStrings = [];
			var noei18n = this.getI18n();

			if(!ageFilter && !weightFilter && !pmaFilter){
				return filterDetailStrings;
			}

			var addSentenceFilterDetails = function(min, max, unit) 
				{
					var details = "";

					if(min && max) {
						details = (min + " " + noei18n.ORDER_SENT_BETWEEN + " " + max + " " + unit);
					} else if(max) { 
						details = (noei18n.ORDER_SENT_LESS_THAN + " " + max + " " + unit);
					} else if(min) {
						details = (noei18n.ORDER_SENT_GREATER_THAN_EQUAL +  " " + min +  " " + unit);
					}

					return details;
				};

				filterDetailStrings.push(" [");

				if(ageFilter) {
					filterDetailStrings.push(addSentenceFilterDetails(ageFilter.AGE_MINIMUM, ageFilter.AGE_MAXIMUM, ageFilter.AGE_UNIT));
				}

				if(ageFilter && weightFilter) {
					filterDetailStrings.push(" " + noei18n.AND + " ");
				}

				if(weightFilter) {
					filterDetailStrings.push(addSentenceFilterDetails(weightFilter.WEIGHT_MINIMUM, weightFilter.WEIGHT_MAXIMUM, weightFilter.WEIGHT_UNIT));
				}

				if((ageFilter && pmaFilter) || (weightFilter && pmaFilter)) { 
					filterDetailStrings.push(" " + noei18n.AND + " ");
				}

				if(pmaFilter){
					filterDetailStrings.push(noei18n.PMA + " " + addSentenceFilterDetails(pmaFilter.AGE_MINIMUM, pmaFilter.AGE_MAXIMUM, pmaFilter.AGE_UNIT));
				}
				
				filterDetailStrings.push("]");

			return filterDetailStrings;
		};
})();
MPageComponents.NewOrderEntry.Templates = {

	option1 : {

		header :

		"<div id=\"noeSearchBox${componentId}\"></div>"
				+ "<div id=\"searchHeader${componentId}\"></div>",

		main :
		"<div class ='message-container' id='noeNewOrderPrefMessage${compId}' />"
		+ "<div class = 'message-container' id='noeEligibilityMessage${compId}' />"
		+"<div id='noeSearchBox${compId}' />"
		+ "<div class='noe-hd hdr'>"
			+ "<div id='noeTabButtons${compId}' class='noe-buttons' />"
		+ "</div>"
		+ "<div id='noeTabContent${compId}' class='noe-body' />"
		+ "<div id='noeScratchPadCont${compId}' class='sub-sec hidden'>"
			+ "<h3 class='sub-sec-hd'>" 
				+ "<span class='sub-sec-title'>"
					+ "${i18n.ORDERS_FOR_SIGNATURE} " + "("
					+ "<span id='noeScratchPadCount${compId}'>0</span>" + ")"
				+ "</span>" 
			+ "</h3>" 
			+ "<div id='noeScratchPad${compId}' "
				+ "class='sub-sec-content noe-scratch'>"
				+ "<span class='res-none'>" 
					+ "${i18n.NO_ORDERS_FOR_SIGNATURE}"
				+ "</span>" 
			+ "</div>" 
			+ "<div class='noe-scr-submit hdr'>"
				+ "<input id='btnDx${compId}' " 
					+ "type='button' "
					+ "class='noe-btn' " 
					+ "value='${i18n.DX_TABLE}' />"
				+ "<input id='btnModify${compId}' " 
					+ "type='button' "
					+ "class='noe-btn' " 
					+ "value='${i18n.MODIFY}' />"
				+ "<input id='btnSign${compId}' " 
					+ "type='button' "
					+ "class='noe-btn' " 
					+ "value='${i18n.SIGN}' />" 
			+ "</div>"
		+ "</div>",

		tabButtons :
		"<div class='noe-seg-cont-center' id='${tabButtonId}'>"
				+ "${tab.getTitle()}" + "</div>",

		searchTab : "<div id='searchHeader${compId}' class='sub-sec-hd'></div>"
				+ "<div id='folderContentsSearchResults${compId}' class='noe-search-results'></div>",
				
		loading :
				"<div class='noe2-preloader-icon'></div>", 
		
		newOrderPref:"<div class ='message-container' id='noeNewOrderPrefMessage${compId}' />",
				
		warningMessage:"<span class='noe-future-warning'>${warningMessage}</span> "
				+"${i18n.APPLY_TO_ENCOUNTER}",
		
		informationMessage:"<span class='noe-future-warning'>${informationMessage}</span>"	
	},
	
	option2: {
		main :
			  "<div class='noe2-hd hdr'>" 
				+ "<div id='noeTabButtons${compId}' class='noe2-tab-container'></div>" 
				+ "<div id='noeSearchBox${compId}'></div>"
			+ "</div>" 
			+ "<div id='noeTabContent${compId}' class='noe2-body'></div>",
				
		tabButtons :
			"<div class='noe2-seg-cont-center' id='${tabButtonId}'>"
			+ "<span>${tab.getTitle()}</span>"
			+ "</div>",
			
		homeTabButton :
			"<div class='noe2-seg-cont-center home' id='${tabButtonId}'>"
			+ "<span class='noe2-home-icon'></span>"
			+ "</div>",
			
		searchTab : 
			"<div class='noe2-search-results-sec'>" +
			"<div id='searchHeader${compId}' class='sub-sec-hd'></div>" +
			"<div id='folderContentsSearchResults${compId}' class='noe2-main-container noe-search-results''></div>" +
			"</div>"
	}
};

MPageComponents.NewOrderEntry.Templates.option2.loading = MPageComponents.NewOrderEntry.Templates.option1.loading;
MPageComponents.NewOrderEntry.Templates.option2.warningMessage = MPageComponents.NewOrderEntry.Templates.option1.warningMessage;
MPageComponents.NewOrderEntry.Templates.option2.informationMessage = MPageComponents.NewOrderEntry.Templates.option1.informationMessage;
MPageComponents.NewOrderEntry.Templates.option2.newOrderPref = MPageComponents.NewOrderEntry.Templates.option1.newOrderPref;
(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var attribute = MPageObjectOriented.createAttribute;
	var inherits = MPageObjectOriented.inherits;
	var ns = MPageComponents.NewOrderEntry;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	
	/**
	 * Base class for all the NOE tabs.
	 */
	ns.NoeTab = function(component) {
		MPageControls.Tab.call(this);
		
		var self = this;
		
		this.setOnSelect(function() { self.performSelect(); });
		this.setComponent(component);
		this.setLoaded(false);
	};
	
	inherits(ns.NoeTab, MPageControls.Tab);
	
	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	
	/**
	 * Reference to the NewOrderEntry instance to where this tab belongs
	 */
	attribute(ns.NoeTab, "Component");
	
	/**
	 * Boolean. True when the tab has been accessed at least once. Set it to
	 * false to force the tab to reload on next click/selection.
	 */
	attribute(ns.NoeTab, "Loaded");
	
	/**
	 * A string that contains the tab name
	 */
	attribute(ns.NoeTab, "Alias");
	
	/**
	 * The jsonReply at tab level
	 */
	attribute(ns.NoeTab, "RecordData");
	
	/**
	 * The flag for script at tab level
	 */
	attribute(ns.NoeTab, "TabMask");
	
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	var prot = ns.NoeTab.prototype;
	
	prot.performSelect = function() {
		// Closes any previously opened modeless
		if (typeof(FavoriteModeless) != "undefined" && FavoriteModeless.current) {
			FavoriteModeless.closeModeless();
		}
		
		if (!this.getLoaded()) {
			this.onLoad();
			this.setLoaded(true);
		}
		
		this.onSelect();
	};
	
	// ________________________________________________________________________
	
	/**
	 * Will replace the tab contents with a spinning wheel
	 */
	prot.showLoading = function() {
		this.setLoaded(true);
		
		var template = TemplateBuilder.buildTemplate(this.getComponent().getTemplates().loading);
		$("#"+this.getContentId()).html(template.render({}));
	};
	
	// ________________________________________________________________________
	
	/**
	 * Abstract function that is supposed to return the recorddata used to
	 * render the tab. This is mostly used for the Debounce function for 
	 * legacy purposes.
	 */
	prot.getRecordDataArr = function() {
		return null;
	};
	
	// ________________________________________________________________________
	
	/**
	 * Executed every time a user clicks a tab
	 */
	prot.onSelect = function() {
		// meant to be overriden by child class
	};
	
	// ________________________________________________________________________
	
	/**
	 * Executed only once, during the first tab click or selection
	 */
	prot.onLoad = function() {
		// meant to be overriden by child class
		var self = this;
		var recordData = this.getComponent().getRecordData();	
		this.showLoading();
		if(this.getRecordDataArr().length){
			this.setRecordData(recordData);
			this.renderTabBody();	
		}else{
			this.updateScriptRequest(this.getTabMask());
		}
	};
	
	
	// ________________________________________________________________________
	
	/**
	 * Executed onLoad and when a new request is returns new data. 
	 */
	prot.renderTabBody = function(){
		//Meant to be overridden by child class.
	};
	
	/**
	 * Executed when a tab is clicked for the first time.
	 */
	prot.updateScriptRequest = function(tabMask){
		//Meant to be overridden by child class.
		var tab = this;
		this.getComponent().requestRecordData(function(recordData){
				tab.setRecordData(recordData.getResponse());
				tab.renderTabBody();
		},tabMask);
	};
})();(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var attribute = MPageObjectOriented.createAttribute;
	var inherits = MPageObjectOriented.inherits;
	var ns = MPageComponents.NewOrderEntry;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.MineTab = function(component) {
		ns.NoeTab.call(this, component);
		
		var legacyComponent = this.getComponent().getLegacyComponent();
		
		this.setTitle(legacyComponent.getUserFavLabel() ? 
				legacyComponent.getUserFavLabel() :
				this.getComponent().getI18n().MINE);
		
		this.setAlias(ns.MineTab.ALIAS);
		this.setTabMask(4);
	};
	
	ns.MineTab.ALIAS = "Mine";
	
	inherits(ns.MineTab, ns.NoeTab);
	
	var prot = ns.MineTab.prototype;
	
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	prot.ALIAS = ns.MineTab.ALIAS;
	
	
	prot.getRecordDataArr = function() {
		return this.getComponent().getRecordData().USER_FAV;
	};
	
	prot.renderTabBody = function(){
		var baseComponent = this.getComponent();
		var namespace = this.getComponent().getLegacyNamespace();
		var component = this.getComponent().getLegacyComponent();
		var recordData = this.getRecordData();
		var html = namespace.RenderMineTab(component, recordData);
		$("#" + this.getContentId()).html(html);
		baseComponent.renderFormularyInfo(component.getUid(), recordData.USER_FAV, "mine");
		namespace.CreateMineTabEvents(component, recordData);
	};
	/**
	 * Override the base onSelect method. The Mine tab overrides the onSelect and calls ApplyScrolling
	 * to ensure that the scrolling of the component is correct.
	 */
	prot.onSelect = function(){
		var namespace = this.getComponent().getLegacyNamespace();
		var componentNamespace = this.getComponent().getLegacyComponent().getStyles().getNameSpace();
		if(componentNamespace === "noe2"){
			//Fire CAP timer for Mine tab select
			var mineTabSelectCAPTimer = new CapabilityTimer("CAP:MPG NEW ORDER ENTRY O2 SELECT MINE TAB",this.getComponent().getCriterion().category_mean);
			mineTabSelectCAPTimer.capture();
		}
		//Resize the columns to ensure the view looks correct
		if(this.getRecordData() && typeof namespace.ResizeColumns !== "undefined") {
			namespace.ResizeColumns(this.getRecordData(), this.getAlias(), this.getComponent().getLegacyComponent());
		}
	};	
})();
(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var inherits = MPageObjectOriented.inherits;
	var ns = MPageComponents.NewOrderEntry;
	var attribute = MPageObjectOriented.createAttribute;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.PublicTab = function(component) {
		ns.NoeTab.call(this, component);
		
		var legacyComponent = this.getComponent().getLegacyComponent();
		
		this.setTitle(legacyComponent.getPublicFavLabel() ? 
				legacyComponent.getPublicFavLabel() :
				this.getComponent().getI18n().PUBLIC);
		
		this.setAlias(ns.PublicTab.ALIAS);
		this.setTabMask(320);
	};
	
	ns.PublicTab.ALIAS = "Public";
	
	inherits(ns.PublicTab, ns.NoeTab);
	attribute(ns.PublicTab, "LoadedVenue");
	
	var prot = ns.PublicTab.prototype;
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	prot.getRecordDataArr = function() {
		return this.getComponent().getRecordData().PUBLIC_FAV;
	};
	
	prot.renderTabBody = function(){
		var baseComponent = this.getComponent();
		var namespace = this.getComponent().getLegacyNamespace();
		var component = this.getComponent().getLegacyComponent();
		var recordData = this.getRecordData();
		var html = namespace.RenderPublicTab(component, recordData);
		$("#" + this.getContentId()).html(html);
		namespace.CreatePublicTabEvents(component, recordData);
		baseComponent.renderFormularyInfo(component.getUid(), recordData.PUBLIC_FAV, "public");
		this.setLoadedVenue(this.getComponent().getVenueType()); 
	};
	/**
	 * Override the base onSelect method. The Public tab overrides the onSelect and calls ApplyScrolling
	 * to ensure that the scrolling of the component is correct.
	 */
	prot.onSelect = function() {
		var namespace = this.getComponent().getLegacyNamespace();
		var componentNamespace = this.getComponent().getLegacyComponent().getStyles().getNameSpace();
		if(componentNamespace === "noe2"){
			//Fire CAP timer for Public tab select
			var publicTabSelectCAPTimer = new CapabilityTimer("CAP:MPG NEW ORDER ENTRY O2 SELECT PUBLIC TAB",this.getComponent().getCriterion().category_mean);
			publicTabSelectCAPTimer.capture();
		}
		//Resize the columns to ensure the view looks correct
		if(this.getRecordData() && typeof namespace.ResizeColumns !== "undefined") {
			namespace.ResizeColumns(this.getRecordData(), this.getAlias(), this.getComponent().getLegacyComponent());
		}
	};
})();
(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var attribute = MPageObjectOriented.createAttribute;
	var inherits = MPageObjectOriented.inherits;
	var ns = MPageComponents.NewOrderEntry;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.SharedTab = function(component) {
		ns.NoeTab.call(this, component);
		
		var legacyComponent = this.getComponent().getLegacyComponent();
		
		this.setTitle(legacyComponent.getSharedFavLabel() ? 
				legacyComponent.getSharedFavLabel() :
					this.getComponent().getI18n().SHARED);
		this.setAlias(ns.SharedTab.ALIAS);
	};
	
	ns.SharedTab.ALIAS = "Shared";
	
	inherits(ns.SharedTab, ns.NoeTab);
	
	attribute(ns.SharedTab, "RecordData");
	
	var prot = ns.SharedTab.prototype;
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	prot.onLoad = function() {				
		var component = this.getComponent().getLegacyComponent();
		var namespace = this.getComponent().getLegacyNamespace();
		
		// TODO refactor this out of the legacy component and into
		// individualized controls for this tab
		var html = namespace.RenderSharedTab(component);
		$("#" + this.getContentId()).html(html);
		namespace.CreateSharedTabEvents(component);		
	};
	/**
	 * Override the base onSelect method. The Shared tab overrides the onSelect and calls ApplyScrolling
	 * to ensure that the scrolling of the component is correct.
	 */
	prot.onSelect = function() {
		var namespace = this.getComponent().getLegacyNamespace();
		//Resize the columns to ensure the view looks correct
		if(this.getRecordData() && typeof namespace.ResizeColumns !== "undefined") {
			namespace.ResizeColumns(this.getRecordData(), this.getAlias(), this.getComponent().getLegacyComponent());
		}
	};
})();
(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;
	var ns = MPageComponents.NewOrderEntry;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.SearchTab = function(legacyComponent, namespace, i18n) {
		ns.NoeTab.call(this, legacyComponent, namespace);
		
		// this tab doesn't have a button
		this.setButtonTemplate("");
		this.setTitle("");
		this.setAlias(ns.SearchTab.ALIAS);
	};
	
	ns.SearchTab.ALIAS = "SearchResults";
	
	inherits(ns.SearchTab, ns.NoeTab);
	
	attribute(ns.SearchTab, "ResultsJson");
	
	var prot = ns.SearchTab.prototype;
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	prot.onLoad = function() {
		var comp = this.getComponent();
		var templateStr = comp.getTemplates().searchTab;
		var template = TemplateBuilder.buildTemplate(templateStr);
		
		$("#" + this.getContentId()).html(template.render(
				comp.makeRenderParams()));
	};
	
	prot.onSelect = function() {
		var comp = this.getComponent();
		
		if (this.getResultsJson() === undefined) {
			return;
		}
		
		comp.getLegacyNamespace().LoadSearchResults(
				JSON.parse(this.getResultsJson()), 
				comp.getLegacyComponent()
		);
	};
	
	
	
})();(function() {
	
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var attribute = MPageObjectOriented.createAttribute;
	var inherits = MPageObjectOriented.inherits;
	var ns = MPageComponents.NewOrderEntry;
	
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.HomeTab = function(component) {
		ns.NoeTab.call(this, component);
		
		var legacyComponent = this.getComponent().getLegacyComponent();
		
		this.setTitle(legacyComponent.getUserFavLabel() ? 
				legacyComponent.getUserFavLabel() :
				this.getComponent().getI18n().MINE);
		
		this.setAlias(ns.HomeTab.ALIAS);

		this.setButtonTemplate(this.getComponent().getTemplates().homeTabButton);
		this.setTabMask(384);
	};
	
	ns.HomeTab.ALIAS = "Home";
	
	inherits(ns.HomeTab, ns.NoeTab);
	
	var prot = ns.HomeTab.prototype;
	
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	prot.ALIAS = ns.HomeTab.ALIAS;
	
	prot.getRecordDataArr = function() {
		return this.getComponent().getRecordData().HOME_FAV;
	};
	prot.renderTabBody = function(){
		var baseComponent = this.getComponent();
		var namespace = this.getComponent().getLegacyNamespace();
		var component = this.getComponent().getLegacyComponent();
		var recordData = this.getRecordData();
		var html = namespace.RenderHomeTab(component, recordData);
		$("#" + this.getContentId()).html(html);
		baseComponent.renderFormularyInfo(component.getUid(), recordData.HOME_FAV, "home");
		namespace.CreateHomeTabEvents(component, recordData);
	};
	/**
	 * Override the base onSelect method. The Home tab overrides the onSelect and calls ApplyScrolling
	 * to ensure that the scrolling of the component is correct.
	 */
	prot.onSelect = function() {
		var namespace = this.getComponent().getLegacyNamespace();		
		//Resize the columns to ensure the view looks correct
		if(this.getRecordData() && typeof namespace.ResizeColumns !== "undefined") {
			namespace.ResizeColumns(this.getRecordData(), this.getAlias(), this.getComponent().getLegacyComponent());
		}
	};
})();
(function() {
	MPageComponents.NewOrderEntry.Order = function() {
		this.synonym = null;
		this.sentence = null;
		this.synId = null;
		this.senId = null;
		this.type = null;
	};
	
	var Order = MPageComponents.NewOrderEntry.Order;
	
	Order.Types = {
			ORDER: 0,
			CARESET: 1,
			POWERPLAN: 2
	};
	
})();