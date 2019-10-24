function HomeMedicationsComponentStyle() {
	this.initByNamespace("hml");
}
HomeMedicationsComponentStyle.prototype = new ComponentStyle();
HomeMedicationsComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The Home Medication component will retrieve all home medication information associated to the encounter
 *
 * @param {Criterion} criterion The criterion object used to build out the component
 * @returns {undefined} undefined
 */
function HomeMedicationsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new HomeMedicationsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.HOME_MEDS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.HOME_MEDS.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);
	this.m_medModInd = false;
	this.m_editMode = false;
	this.m_medModObj = {};
	this.m_origOrder = {};
	this.m_medRec = false;
	this.setHasActionsMenu(true);
	this.compliance = false;
	this.m_initialRenew = true;
	this.m_viewableEncntrs = "";
	this.setResourceRequired(true);
	this.m_base = null;
	this.m_wasListenerAdded = false;
	window.hm_mpage = criterion.category_mean;
	
	HomeMedicationsComponent.method("RetrieveRequiredResources", function() {
		//Create and/or retrieve Viewable Encounters shared resource
		var veObj = MP_Core.GetViewableEncntrs(this.getCriterion().person_id);

		if(veObj.isResourceAvailable() && veObj.getResourceData()) {
			//If veObj data is available, immediately load component.
			this.setViewableEncntrs(veObj.getResourceData());
			CERN_HOME_MEDS_O1.GetHomeMedications(this);
		} else {
			//If the data is not yet available, MP_Core.GetViewableEncntrs will fire the viewableEncntrInfoAvailable event when the data becomes available.
			CERN_EventListener.addListener(this, "viewableEncntrInfoAvailable", this.HandleViewableEncounters, this);
		}
	});	

	HomeMedicationsComponent.method("InsertData", function() {
		CERN_HOME_MEDS_O1.GetHomeMedications(this);
	});
	
	/**
	 * Handle the viewable encounters information for the patient and store within the component object.
	 * 
	 * @param {Object} event : an event object
	 * @param {object} srObj : The viewableEncntrs shared resource object
	 * @returns {undefined} undefined
	 */
	HomeMedicationsComponent.method("HandleViewableEncounters", function(event, srObj){
		if(srObj.isResourceAvailable() && srObj.getResourceData()){
			this.setViewableEncntrs(srObj.getResourceData());
			CERN_HOME_MEDS_O1.GetHomeMedications(this);
		} else {
			var errMsg = "No viewable encounters available for this patient";
			this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg), (this.isLineNumberIncluded() ? "(0)" : ""));
		}
	});


	HomeMedicationsComponent.method("setViewableEncntrs", function(value){
		this.m_viewableEncntrs = value;
	});
	
	HomeMedicationsComponent.method("getViewableEncntrs", function(value){
		return (this.m_viewableEncntrs);
	});	
	
	HomeMedicationsComponent.method("HandleSuccess", function(recordData) {
		CERN_HOME_MEDS_O1.RenderComponent(this, recordData);
	});

	HomeMedicationsComponent.method("isMedModInd", function() {
		return this.m_medModInd;
	});
	HomeMedicationsComponent.method("setMedModInd", function(value) {
		this.m_medModInd = (value == 1 ? true : false);
	});
	 HomeMedicationsComponent.method("setMedRec", function(value){
        this.m_medRec = (value == 1 ? true : false);
    });
    HomeMedicationsComponent.method("getMedRec", function(value){
        return (this.m_medRec);
    });
	HomeMedicationsComponent.method("openTab", function() {
		var criterion = this.getCriterion();
		var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
		APPLINK(0, criterion.executable, sParms);
		this.InsertData();
	});
	HomeMedicationsComponent.method("setAllData", function(recordData){
		this.allData = recordData;
	});
	HomeMedicationsComponent.method("getAllData", function(){
		return this.allData;
	});
	HomeMedicationsComponent.method("setCompliance", function(value){
		this.compliance = value;
	});
	HomeMedicationsComponent.method("hasCompliance", function(){
		return this.compliance;
	});
	HomeMedicationsComponent.method("setInitialRenew", function(value){
		this.m_initialRenew = value;
	});
	HomeMedicationsComponent.method("getInitialRenew", function(){
		return this.m_initialRenew;
	});
	HomeMedicationsComponent.method("createAccordionControls", function(){
		var i18nCore = i18n.discernabu;
		var mnuCompId = this.getComponentId();
		var pageControl = $("<div></div>").addClass("lb-pg-hd lb-page-ctrl");
		var uniqueComponentId = this.getStyles().getId();
		
		var clearAllControl = $("<a></a>").addClass("resetAll").html(i18nCore.RESET_ALL);
		
		clearAllControl.click(function(){ 
			var filterGroupingCheckBox = $("#filterGroupingCheckbox" + uniqueComponentId);
			if(filterGroupingCheckBox.is(":checked")) {
				filterGroupingCheckBox.trigger("click");
			}
		});
		pageControl.append(clearAllControl);
		
		return pageControl;
	});
	
	HomeMedicationsComponent.method("createAccordionContent", function(){
		var hmi18n = i18n.discernabu.homemeds_o1;
		var mnuDisplay = "";
		var compID = this.getComponentId();
		var style = this.getStyles();
		var groupNum = -1;
		var groupLen = this.m_grouper_arr.length;
		var firstGroupingLabel = "";
		var uniqueComponentId = style.getId();
		
		var groupingApplied = false;
		
		var self = this;

		var z = 0;
		
		function handleGroupingCheckboxClick() {
			return function() {
				groupingApplied = !groupingApplied;
				if(groupingApplied) {
					groupingControlContainer.css("color", "#000");
					//Select the first item when the user clicks the checkbox
					handleGroupingFilterClick(filterMenu.getMenuItemArray()[0], 0, firstGroupingLabel)();
					//Show the drop down arrow
					$("#filterMenu" + uniqueComponentId).show();
					var recordData = self.getAllData();
					if(recordData && recordData.ORDERS.length) {
						CERN_HOME_MEDS_O1.ShowGroupingLabel(self, compID);
					}
				} else {
					groupingControlContainer.css("color", "#808080");
					//Make the call to display all component data.
					CERN_HOME_MEDS_O1.DisplayAllData(compID, -1, firstGroupingLabel);
					//Reset the grouping label back to the first
					$("#filterGroupingSelectedLabel" + uniqueComponentId).html(firstGroupingLabel);
					//Hide the grouping drop down arrow if the checkbox is unchecked
					$("#filterMenu" + uniqueComponentId).hide();
					//Deselect all filter items
					var filterMenuItems = filterMenu.getMenuItemArray();
					for(var i = 0; i < filterMenuItems.length; i++) {
						filterMenuItems[i].setIsSelected(false);
					}
				}
			};
		}
		
		function handleGroupingFilterClick(filterMenuItem, index, label) {
			return function() {		
				if(filterMenuItem.isSelected()) {
					return;
				}
				var filterMenuItems = filterMenu.getMenuItemArray();
				for(var i = 0; i < filterMenuItems.length; i++) {
					filterMenuItems[i].setIsSelected(false);
				}
				filterMenuItem.setIsSelected(true);					
				var grouperCriteria = self.getGrouperCriteria(index);
				var recordData = self.getAllData();
				$("#filterGroupingSelectedLabel" + uniqueComponentId).html(label);
				$("#filterAppliedMessage" + uniqueComponentId).attr("title", label);
				self.setGrouperFilterLabel(label);
				self.setGrouperFilterCriteria(grouperCriteria);
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(compID);
				if(recordData) {
					CERN_HOME_MEDS_O1.RenderComponent(self, recordData);
				}
			};
		}
		
		//Create the lookback menu
		var filterMenu = new Menu("filterMenu" + uniqueComponentId);
		filterMenu.setTypeClass("filter-menu");
		filterMenu.setAnchorElementId("filterMenu" + uniqueComponentId);
		filterMenu.setAnchorConnectionCorner(["bottom", "left"]);
		filterMenu.setContentConnectionCorner(["top", "left"]);
		filterMenu.setIsRootMenu(true);		

		//Create the HTML elements
		var groupingCheckbox = $("<input></input>").attr({"id": "filterGroupingCheckbox" + uniqueComponentId, "type": "checkbox"});
		var homeMedsGroupContainer = $("<div></div>").attr("id", "filterGroupingContainer" + uniqueComponentId);
		var groupingClassContainer = $("<div></div>").addClass("filter-grouping-class-container").attr("id", "filterGroupingClassContainer" + uniqueComponentId);
		var groupingControlContainer = $("<div></div>").addClass("filter-grouping-control-container").attr("id", "filterGroupingControlContainer" + uniqueComponentId);
		var groupingSelectedLabel = $("<span></span>").addClass("selected-filter").attr("id", "filterGroupingSelectedLabel" + uniqueComponentId);
		var groupingFilterDropDownArrow = $("<div></div>").addClass("filter-arrow").attr("id", "filterMenu" + uniqueComponentId);
		//Start the filter arrow off hidden. It will show if a filter is applied
		groupingFilterDropDownArrow.hide();
		
		//Append HTML elements to create the structure
		homeMedsGroupContainer.append(groupingClassContainer);
		homeMedsGroupContainer.append(groupingControlContainer);
		groupingClassContainer.append(groupingCheckbox);
		groupingClassContainer.append($("<span></span>").addClass("filter-grouping-label").html(hmi18n.GROUPBYDRUGCLASS));
		groupingControlContainer.append($("<span></span>").addClass("filter-label").html(hmi18n.SEQUENCEBY));
		groupingControlContainer.append(groupingSelectedLabel);
		groupingControlContainer.append(groupingFilterDropDownArrow);
		groupingControlContainer.css("color", "#808080");
		//Grab the first grouper label that is set in bedrock
		for (var i = 0; i < 10; i++) {//10 is the maximum number of filter labels and filter criteria
			if (this.getGrouperLabel(i)) {
				mnuDisplay = this.getGrouperLabel(i);
				firstGroupingLabel = mnuDisplay;
				break;
			}
		}
		//If there is a filter applied
		if (this.getGrouperFilterLabel()) {
			mnuDisplay = this.getGrouperFilterLabel();
			groupingApplied = true;
			groupingCheckbox.attr("checked", "checked");
			groupingFilterDropDownArrow.show();
			groupingControlContainer.css("color", "#000");
		}
		groupingSelectedLabel.html(mnuDisplay);
		
		//Go through the grouper filters and create filter elements for them
		for(z = 0, c = 0; c < groupLen && z < 10; z++) {
			var currentLabel = this.getGrouperLabel(z);
			if(currentLabel) {
				c++;
				
				var filterMenuItem = new MenuSelection("filterMenuItem" + uniqueComponentId + "-" + z);
				filterMenuItem.setLabel(currentLabel);
				filterMenuItem.setCloseOnClick(true);
				if(groupingApplied && currentLabel == mnuDisplay) {
					filterMenuItem.setIsSelected(true);
				}
				filterMenuItem.setClickFunction(handleGroupingFilterClick(filterMenuItem, z, currentLabel));
				filterMenu.addMenuItem(filterMenuItem);
			}
		}
		var nonMultumLabel = hmi18n.NON_CATEGORIZED;
		var filterMenuItemNonMultum = new MenuSelection("filterMenuItemNonMultum" + uniqueComponentId + "-" + groupLen);
		filterMenuItemNonMultum.setLabel(nonMultumLabel);
		filterMenuItemNonMultum.setCloseOnClick(true);
		if (groupingApplied && nonMultumLabel == mnuDisplay) {
			filterMenuItemNonMultum.setIsSelected(true);
		}
		filterMenuItemNonMultum.setClickFunction(handleGroupingFilterClick(filterMenuItemNonMultum, groupLen, nonMultumLabel));
		filterMenu.addMenuItem(filterMenuItemNonMultum);

		MP_MenuManager.updateMenuObject(filterMenu);
		groupingFilterDropDownArrow.click(function () {
			if (!filterMenu.isActive()) {
				MP_MenuManager.showMenu("filterMenu" + uniqueComponentId);
			} else {
				MP_MenuManager.closeMenuStack(true);
			}
		});
		groupingCheckbox.on("click", handleGroupingCheckboxClick());
		return homeMedsGroupContainer;
	});
	
	/**
	 * DEPRECATED
	 * The following instantiates Home Medication's own "renderAccordion" function. All MPage components have this function, but the following is unique to Home Medication.
	 * Particularly, the following creates a drop down list in the accordion which will sort the drugs displayed in Home Medications by the drug class groupings defined in
	 * Bedrock. Additionally, any selected grouping will automatically be saved to the component upon refresh. Furthermore, there is also the ability to reset the component's
	 * preferences with the following function which is allowable by two elements, a checkbox (uncheck to reset the preferences, check to allow the user to select a grouping)
	 * and a "Reset All" button. If the preferences are cleared and no grouping is selected, the drugs will be sorted alphabetically by default.
	 * @param {object} component - The component that renderAccordion uses
	 * @returns {undefined} undefined
	 */
	HomeMedicationsComponent.method("renderAccordion", function(component){
	});

}

HomeMedicationsComponent.inherits(MPageComponent);
/**
 * Sets the m_wasListenerAdded member variable to the value provided.
 * @param {Boolean} value : true or false value to indicate if the event listener has been added. 
 * @returns {undefined} - undefined
 */
HomeMedicationsComponent.prototype.setWasListenerAdded = function(value){
	this.m_wasListenerAdded = value;
};
/**
 * Gets the m_wasListenerAdded member variable value.
 * @returns {Boolean} - the wasListenerAdded flag
 */
HomeMedicationsComponent.prototype.getWasListenerAdded = function(){
	return this.m_wasListenerAdded;
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} - undefined
 */
HomeMedicationsComponent.prototype.loadFilterMappings = function(){
	
	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("HOME_MEDS_INFO_BUTTON_IND", {
		setFunction: this.setHasInfoButton,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};

	/**
	 * The following will apply a drug class grouping sort on the drugs displayed in the component.
	 *
	 * @param {object} recordData [required] : The list of all of the drugs which includes the drug class[es] that the drug resides in.
	 * @param {object} sortCriteria [required] - The hierarchical list of the drug class grouping which the drugs will be sorted by.
	 * @param {object} component - The component who's drop down is being sorted.
	 * @returns {undefined} - undefined
	 */
	function SortByDropdownValue(recordData, sortCriteria, component) {

	var multumArray = [];
	var nonMultumArray = [];
	var homeMedsi18n = i18n.discernabu.homemeds_o1;
	var sortSequenceLength = sortCriteria.length;
	var homeMedOrders = recordData.ORDERS;
	var homeMedOrderCount = homeMedOrders.length;
	var homeMedOrderIndex = homeMedOrderCount;
	//Classification to Multum and Non Multum of Medications
	while (homeMedOrderIndex--) {
		var order = homeMedOrders[homeMedOrderIndex];
		var orderMedInfo = order.MEDICATION_INFORMATION;
		if (orderMedInfo.MULTUM_CATEGORY_IDS.length) {
			multumArray.push(order);
		}
		else {
			nonMultumArray.push(order);
		}
	}

	if (homeMedOrderCount && sortSequenceLength) {
		var sortedMultumArray = [];
		//Loops through all of the drug classes defined in the grouping set in Bedrock
		for (var seqIndex = sortSequenceLength; seqIndex--; ) {
			var currDrugClassId = sortCriteria[seqIndex];
			var multumArrIndex = multumArray.length;
			var likeMultumArr = [];
			var likeMultumCount = 0;
			while (multumArrIndex--) {
				var multOrder = multumArray[multumArrIndex];
				var multumCategoryObjArr = multOrder.MEDICATION_INFORMATION.MULTUM_CATEGORY_IDS;
				var categoryObjArrIndex = multumCategoryObjArr.length;
				var multumCategoryIdsArr = [];
				while (categoryObjArrIndex--) {
					multumCategoryIdsArr.push(multumCategoryObjArr[categoryObjArrIndex].MULTUM_CATEGORY_ID);
				}
				var seqMatchFound = multumCategoryIdsArr.indexOf(currDrugClassId);
				if (seqMatchFound !== -1) {
					likeMultumArr.push(multOrder);
					likeMultumCount = likeMultumCount + 1;
				}
			}
			if (likeMultumCount >= 1) {
				likeMultumArr.sort(CERN_HOME_MEDS_O1.SortByMedicationName);
			}
			var likeMultumArrLength = likeMultumArr.length;
			//Same Medication belonging to different Drug classes is considered duplicate and showed once.
			for (var multumIndex = 0; multumIndex < likeMultumArrLength; multumIndex++) {

				if ($.inArray(likeMultumArr[multumIndex], sortedMultumArray) === -1) {

					sortedMultumArray.push(likeMultumArr[multumIndex]);
				}
			}

		}
		nonMultumArray.sort(CERN_HOME_MEDS_O1.SortByMedicationName);
		var nonMultumArrayLength = nonMultumArray.length;
		for (var nonMultumArrayIndex = 0; nonMultumArrayIndex < nonMultumArrayLength; nonMultumArrayIndex++) {
			sortedMultumArray.push(nonMultumArray[nonMultumArrayIndex]);
		}
		recordData.ORDERS = sortedMultumArray;

	}
	else {
		//Sorts Medications alphabetically both Multum and Non-Multum when no filters exists from BedRock
		nonMultumArray.sort(CERN_HOME_MEDS_O1.SortByMedicationName);
		multumArray.sort(CERN_HOME_MEDS_O1.SortByMedicationName);

		var nonMultumCount = nonMultumArray.length;
		for (var sortIndex = 0; sortIndex < nonMultumCount; sortIndex++) {
			multumArray.push(nonMultumArray[sortIndex]);
		}
		recordData.ORDERS = multumArray;
	}
	return recordData;
}

/**
 * Document methods
 * @namespace CERN_HOME_MEDS_O1
 * @static
 * @global
 */

var CERN_HOME_MEDS_O1 = function() {
	var m_df = null;
	return {
		GetHomeMedications: function(component) {
			/*
			 LOAD INDICATOR						BASE10	INCLUDE
			 load_ordered_ind					1		YES
			 load_future_ind					2		YES
			 load_in_process_ind				4		YES
			 load_on_hold_ind					8		YES
			 load_suspended_ind					16		YES
			 load_incomplete_ind				32		NO
			 load_canceled_ind					64		NO
			 load_discontinued_ind				128		NO
			 load_completed_ind					256		NO
			 load_pending_complete_ind			512		NO
			 load_voided_with_results_ind		1024	NO
			 load_voided_without_results_ind	2048	NO
			 load_transfer_canceled_ind			4096	NO

			 1 + 2 + 4 + 8 + 16 + 32 = 63
			 */
			var sendAr = [];
			var criterion = component.getCriterion();
			var encntrs = component.getViewableEncntrs();
			var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
			var homeMedsInd = 1;
			if(!component.getWasListenerAdded()){
				CERN_EventListener.addListener(component, EventListener.EVENT_ORDER_ACTION, component.InsertData, component);
				component.setWasListenerAdded(true);
			}
			sendAr.push("^MINE^", criterion.person_id + ".0", encntrVal, criterion.provider_id + ".0", component.getScope(), criterion.ppr_cd + ".0", homeMedsInd);
			var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
			request.setProgramName("MP_GET_HOME_MEDICATIONS");
			request.setParameters(sendAr);
	        request.setAsync(true);
	        component.m_base = new MPageComponents.HomeMedicationsBase (component);
	        component.m_base.setCriterion(criterion);
			component.setInitialRenew(true);			
			MP_Core.XMLCCLRequestCallBack(component, request, function(reply){ 
				component.HandleSuccess(reply.getResponse());
			});
		},
		RenderComponent: function(component, recordData) {
			var criterion = component.getCriterion();
			var ipath = criterion.static_content;
			try {
				var sHTML="";
				var countText = "";
				var jsHTML = [];
				var currentDate = new Date();
				var meds = [];
				var medCnt = 0;
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
				var df = getDateFormatter();
				var hmI18n = i18n.discernabu.homemeds_o1;
				component.m_medModObj.jsonRoutes = null;
				component.setCompliance(false);
				var imgType = "";
				var imgClass = "";
				var edtCls = "";
				var catCodeList = "";
				var modHTML = "";
				var bMedMod = component.isMedModInd();
				var medCompId = component.getComponentId();
				var displayMedsRec = component.getMedRec();
				var componentId = component.getComponentId();
				//add link to launch meds rec

				//To save time from consistently calling the MP_GET_HOME_MEDICATIONS script, the drugs that are retrieved from the beginning of the session will be saved and then retrieved locally for each refresh.
				component.setAllData(recordData);
				if(recordData && component.getGrouperFilterLabel()){
					CERN_HOME_MEDS_O1.ShowGroupingLabel(component, componentId);
				}
				CERN_HOME_MEDS_O1.DisplayAllData(componentId);
				var compNS = component.getStyles().getNameSpace();
				var rootNode = component.getRootComponentNode();
				var loookBackContainer = $(rootNode).find('#stt' + compNS + medCompId);
				var healthPlanSelectorEle = loookBackContainer.find('.hm-healthplan-selector');
				if(healthPlanSelectorEle.length){
					healthPlanSelectorEle.remove();
				}
	
				//Add Info Button click events
				if (component.hasInfoButton()) {
					var hmlInfoIcons = $("#hmlContent" + componentId).find(".info-icon");
					$.each(hmlInfoIcons, function() {
						$(this).click( function(e) {
							//Get the values needed for the API
							var patId = $(this).attr("data-patId");
							var encId = $(this).attr("data-encId");
							var synonymId = $(this).attr("data-synonymId");
							var primaryCriteriaCd = $(this).attr("data-primaryCriteriaCd");
							var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
							try {
								if (launchInfoBtnApp) {
									launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(primaryCriteriaCd), 1, 2);
									launchInfoBtnApp.AddMedication(parseFloat(synonymId));
									launchInfoBtnApp.LaunchInfoButton();
								}
							}
							catch(err) {
								var error_msg = (err.message||i18n.discernabu.INFO_BUTTON_ERROR_MSG);
								MP_Util.LogError(err.name+error_msg);
								var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
								if(!errorModal){
									errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
									errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
									//Create and add the close button
									var closeButton = new ModalButton("closeButton");
									closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
									errorModal.addFooterButton(closeButton);
								}
								MP_ModalDialog.updateModalDialogObject(errorModal);	
								MP_ModalDialog.showModalDialog("errorModal");
								return;
							}
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
						});
					});
				}
				
				bMedMod = component.isMedModInd();
				if(bMedMod) {
					//add button click events
					Util.addEvent(_g("medRnwBtn" + medCompId), "click", queueOrder);
					Util.addEvent(_g("medCnclBtn" + medCompId), "click", queueOrder);
					Util.addEvent(_g("medCmpltBtn" + medCompId), "click", queueOrder);

					var medModRootId = 'hml' + medCompId;
					var medCompSec = _g(medModRootId);
					//disable native selection to use custom select
					medCompSec.onselectstart = function() {
						return false;
					};
					//build component actions menu
					component.addMenuOption("mnuRenew", "mnuRenew" + medCompId,  hmI18n.MED_RENEW_RX, true, "click", queueOrder);
					component.addMenuOption("mnuCancel", "mnuCancel" + medCompId, hmI18n.MED_CANCEL, true, "click", queueOrder);
					component.addMenuOption("mnuComplete", "mnuComplete" + medCompId, hmI18n.MED_COMPLETE, true, "click", queueOrder);
					component.addMenuOption("mnuRnwReset", "mnuRnwReset" + medCompId, hmI18n.MED_RESET, true, "click", resetRows);
					component.addMenuOption("mnuGtOrders", "mnuGtOrders" + medCompId, hmI18n.MED_GTO, true, "click", signMedMods);
					component.addMenuOption("mnuSign", "mnuSign" + medCompId, hmI18n.MED_SIGN, true, "click", signMedMods);
					
					component.createMenu();
					//add click events
					Util.addEvent(_g("medSgnBtn" + medCompId), "click", signMedMods);

					//add row click events
					var rootMedSecCont = component.getSectionContentNode();
					var medRows = Util.Style.g("hml-info", rootMedSecCont, "dl");
					var mrLen = medRows.length;
					for(var i = mrLen; i--; ) {
						if(component.hasCompliance() && i === 0) {
							continue;
						}
						else {
							Util.addEvent(medRows[i], "click", medRowSel);
						}
					}

					//reset after component refresh
					component.setEditMode(false);
				}
					 //add Meds Rec click event
				if(displayMedsRec) {
					Util.addEvent(_g("medRecLnk" + medCompId), "click", openMedsRec);	
				}	

			} 
			catch (err) {
				
				throw (err);
			} 
			finally {
				//do nothing
			}
		},
		/**
		 * The following function will display the drugs in the home medication's component. The function determines how the drugs will be sorted and will then display
		 * the drugs in the order that has been determined.
		 * 
		 * @param {number} componentId [required] - The id of the instantiated Home Medication's component.
		 * @param {number} groupNum [optional] - The grouping number of the selected drug class grouping.
		 * @param {string} sortName [optional] - The label of the drug class grouping that is currently selected.
		 * @returns {undefined} undefined
		 */
	DisplayAllData: function(componentId, groupNum, sortName){
		try{
			var parentDiv = _g("grouperSelect" + componentId);
			var infoClass = "";
				var suspendedMeds = "SUSPENDED";
			//Is the component first loading (without a grouping selected) or has an option other than the previously selected option been selected?
			if(!groupNum || groupNum == -1 || parentDiv.selectedVal != groupNum){

				var component = MP_Util.GetCompObjById(componentId);
				component.setInitialRenew(true);
				var recordData = component.getAllData();
				var medCompId = componentId;
				var hmI18n = i18n.discernabu.homemeds_o1;
				var meds = [];
					var suspendedOrdSubSecHTML = [];
				var displayMedsRec = component.getMedRec();
				
				if(isFinite(groupNum)){
					if(groupNum == -1){
						MP_Core.AppUserPreferenceManager.ClearCompPreferences(componentId);
						component.setGrouperFilterLabel("");
						//component.renderAccordion(component);
					}
				}
				
				var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
				
				if(displayMedsRec) {
		        	meds.push("<div class='hml-mrec'><span class='hml-mrec-link' id='medRecLnk", medCompId, "'>", hmI18n.MEDS_REC, "</span></div>");
		        }
		        meds.push("<div class='", MP_Util.GetContentClass(component, recordData.ORDERS.length), "'>");
        		var complianceText = getComplianceInfo(recordData.COMPLIANCE, personnelArray);
				if(complianceText && complianceText.length > 0) {
					meds.push(complianceText);
					component.setCompliance(true);
				}

				
				var criterion = component.getCriterion();
				var ipath = criterion.static_content;
				
				var sHTML = "";
				var countText = "";
				var jsHTML = [];
				var currentDate = new Date();
				
				var medCnt = 0;
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				
				var df = getDateFormatter();
				
				var imgType = "";
				var imgClass = "";
				var edtCls = "";
				var catCodeList = "";
				var modHTML = "";
				var bMedMod = component.isMedModInd();
				
				
				var setOptionsDropdown = false;
				var addOrRemoveClass;
				var grouperCriteria;
				var hasFilters = false;
					// new array for suspended orders
					var suspendedMedArray = [];

				if(recordData.ORDERS.length > 0) {

						
						
				

						//Checks to see if the user selected an item from the dropdown menu
						if(isFinite(groupNum)){
							parentDiv.selectedVal = groupNum;
							//If groupNum = -1, then the user cleared the preferences, this will reload the component and sort the drugs alphabetically (called below)
							if(groupNum != -1){	
								grouperCriteria = component.getGrouperCriteria(groupNum);
								component.setGrouperFilterCriteria(grouperCriteria);
								recordData = SortByDropdownValue(recordData, grouperCriteria);
								//Save the component preferences
								MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId);
								CERN_HOME_MEDS_O1.ShowGroupingLabel(component, componentId);
							}
						}
						else{
							for(var y = 0; y <= 10; y++){
								if(component.getGrouperLabel(y)){
									hasFilters = true;
									break;
								}
							}
							//The component has just loaded, check to see if any preferences are saved or not.
							if(!hasFilters || !component.getGrouperFilterLabel()){
								//No grouping has been selected, the drugs will be sorted alphabetically
								if(recordData.ORDERS.length){
									recordData.ORDERS.sort(CERN_HOME_MEDS_O1.SortByMedicationName);
								}
							}
							else{
								//A saved option is loaded and the drugs will be sorted according to the option
								$("#filter-grouping-selected-label-" + component.getStyles().getId()).html(component.getGrouperFilterLabel());
								var dummyCriteria = component.getGrouperFilterCriteria();
								if(!dummyCriteria){
									dummyCriteria = component.getGrouperFilterEventSets();
								}
								recordData = SortByDropdownValue(recordData, dummyCriteria, component);
							}
						}
						var medIdFrag = medCompId + "_"; //used to make id unique
						for(var x = 0, xl = recordData.ORDERS.length; x < xl; x++) {
							var orders = recordData.ORDERS[x];
			
							var orderStatus = MP_Util.GetValueFromArray(orders.CORE.STATUS_CD, codeArray);
							var medOrigDate = "";
							var lastDoesDate = "";
							var respProv = "&nbsp;";
							var compliance = "&nbsp;";
							
							var medName = getMedicationDisplayName(orders);
							var medNameHover = getMedicationDisplayNameForHover(orders);
							var dateTime = new Date();
							var compComment = orders.DETAILS.COMPLIANCE_COMMENT;
							var ordComment = orders.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />"); //replace new lines with <br /> tag
							
							if(orders.SCHEDULE.ORIG_ORDER_DT_TM !== "") {
								dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
								medOrigDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
							}
			
							if(orders.DETAILS.LAST_DOSE_DT_TM !== "") {
								dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
								lastDoesDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
							}
			
							if(orders.CORE.RESPONSIBLE_PROVIDER_ID > 0) {
			                    var provider = MP_Util.GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
								respProv = provider.fullName;
							}
			
							if(orders.DETAILS.COMPLIANCE_STATUS_CD > 0) {
								var code = MP_Util.GetValueFromArray(orders.DETAILS.COMPLIANCE_STATUS_CD, codeArray);
								compliance = code.display;
							}
			
							var ordersMedInfo = orders.MEDICATION_INFORMATION;
							var hxInd = ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND;
							var ordId = ordersMedInfo.ORDER_ID;
							var primaryCriteriaCd = ordersMedInfo.PRIMARY_CRITERIA_CD;
							var synonymId = ordersMedInfo.SYNONYM_ID;
							
							if(hxInd === 1) {
								imgType = 'hx.gif';
								imgClass = 'hml-hx';
								edtCls = "-hx";
							}
							else {//Prescribed
								imgType = 'rx.gif';
								imgClass = 'hml-rx';
								edtCls = "";
							}
			
							if(bMedMod) {
								component.m_medModObj.medModCompId = medCompId;
								component.m_medModObj.medModIdFrag = medIdFrag;
								var catCode = ordersMedInfo.CATALOG_CD;
								
								var sigLine = '';
			
								if(catCode) {
									catCodeList += catCode + ':';
								}
								//placeholders for number of refills and dispense quantity
								modHTML = '<dd class="hml-sig detail-line"></dd><dd class="hml-dur"></dd><dd class="hml-disp-qty-cd"></dd><dd class="hml-cat-cd">' + catCode + '</dd>';
							}//end bmedmod
							
							//Determine state of Info Button
							if (component.isInfoButtonEnabled() && component.hasInfoButton()) {
								infoClass = "info-icon disp";
							}
							else {
								infoClass = "info-icon hidden";
							}

							var homeMedsHtml = "<div class='hml-info-icon-div'>";
							homeMedsHtml += "<span data-patId='" + criterion.person_id + "' data-encId='" + criterion.encntr_id + "' data-synonymId='" + synonymId + "' data-primaryCriteriaCd='" + primaryCriteriaCd + "' class='" + infoClass + "'>&nbsp;</span>";

							homeMedsHtml += "<h3 class='info-hd'><span>" + medName + "</span></h3>";
							homeMedsHtml += "<div class ='hml-info-row'><dl class='hml-info' id='hmlInfo" + medIdFrag + ordId + "' data-synonymId='" + synonymId + "'><dd class ='hml-formulary'></dd><dd><span class='hml-rx-hx'><img src='" + ipath + "/images/" + imgType + "' alt='' class='" + imgClass + "' /></span></dd><dd class='hml-name'><span>" + medName + "</span><span class='hml-sig detail-line'>" + orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE + "</span></dd>" + modHTML + "</dl>";
							homeMedsHtml += "<h4 class='det-hd'><span>" + hmI18n.MED_DETAIL + "</span></h4>" + "<div class='hvr'><dl class='hml-det'>" + "<dt><span>" + hmI18n.HOME_MEDICATION + ":</span></dt><dd class='hml-det-name'><span>" + medNameHover + "</span></dd><dt><span>" + hmI18n.ORDER_DETAILS + ":</span></dt><dd class='hml-det-dt'><span>" + orders.DISPLAYS.CLINICAL_DISPLAY_LINE + "</span></dd><dt><span>" + hmI18n.ORDER_COMMENT + ":</span></dt><dd class='hml-det-dt'><span>" + ordComment + "</span><dt><span>" + hmI18n.ORDER_DATE + ":</span></dt><dd class='hml-det-dt'><span>" + medOrigDate + "</span></dd><dt><span>" + hmI18n.LAST_DOSE + ":</span></dt><dd class='hml-det-dt'><span>" + lastDoesDate + "</span></dd><dt><span>" + hmI18n.RESPONSIBLE_PROVIDER + ":</span></dt><dd class='hml-det-dt'><span>" + respProv + "</span></dd><dt><span>" + hmI18n.TYPE + ":</span></dt><dd class='hml-det-dt'><span>" + getHomeMedicationType(orders) + "</span></dd><dt><span>" + hmI18n.COMPLIANCE + ":</span></dt><dd class='hml-det-dt'><span>" + compliance + "</span></dd><dt><span>" + hmI18n.COMPLIANCE_COMMENT + ":</span></dt><dd class='hml-det-dt'><span>" + compComment + "</span></dd></dl></div></div>";

							homeMedsHtml += "</div>";
							// Check for suspendedMeds
							if (orderStatus.meaning === suspendedMeds) {
								suspendedMedArray.push(homeMedsHtml);
							}
							else {
								meds.push(homeMedsHtml);
							}
							medCnt++;
						}
						/*
						 * Display suspended subsection only if suspends meds are available
						 */
						var suspendedMedArrayLength = suspendedMedArray.length;
						if (suspendedMedArrayLength > 0) {
							suspendedOrdSubSecHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.discernabu.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SUSPENDED, " (", suspendedMedArrayLength, ")", "</span></h3><div class='sub-sec-content'>");
							suspendedOrdSubSecHTML.push(suspendedMedArray.join(""));
							suspendedOrdSubSecHTML.push("</div></div>");
							meds = meds.concat(suspendedOrdSubSecHTML);
						}
						component.m_medModObj.catCodeList = catCodeList;
					}
					else {
						bMedMod = false;
						if (recordData.COMPLIANCE.NO_KNOWN_HOME_MEDS_IND === 0 && recordData.COMPLIANCE.UNABLE_TO_OBTAIN_IND === 0) {
							meds.push("<span class='res-none'>", hmI18n.NO_RESULTS_FOUND, "</span>");
						}
						component.setMedModInd(0);
					}

				if(bMedMod) {
					if(_g("hmlFtr" + medCompId)) {
						Util.de(_g("hmlFtr" + medCompId));
					}
					var secCont = component.getSectionContentNode();
					var medModFt = Util.cep("div", {
						className: "hml-content-ft",
						id: "hmlFtr" + medCompId
					});
					var medModFtArr = [];
					medModFtArr.push("<div class='med-rnw-row' id='medRnwRow", medCompId, "'><button class='hml-rnw-btn' id='medRnwBtn", medCompId, "' disabled='true'><img id='medRnwImg", medCompId, "'  src='", ipath, "/images/renew_disabled.gif' alt='' /> ", hmI18n.MED_RENEW, "</button>", "<button class='hml-rnw-btn' id='medCnclBtn", medCompId, "' disabled='true'><img id='medCnclImg", medCompId, "' src='", ipath, "/images/cancel_disabled.gif' alt='' /> ", hmI18n.MED_CANCEL, "</button>", "<button class='hml-rnw-btn' id='medCmpltBtn", medCompId, "' disabled='true'><img id='medCmpltImg", medCompId, "' src='", ipath, "/images/complete_disabled.gif' alt='' /> ", hmI18n.MED_COMPLETE, "</button></div>", "<div class= 'hml-sgn-row' id='medSgnRow", medCompId, "'> <span class='hml-route'>", hmI18n.DEF_ROUTE_LBL, ": <a id='routeLink", medCompId, "' class='hml-route-link hml-dthrd' >", hmI18n.MED_NONE_SELECTED, "</a></span>", "<button class='hml-rnw-btn hml-sgn-btn' id='medSgnBtn", medCompId, "' disabled='true'> ", hmI18n.MED_SIGN, " </button></div>");
					medModFt.innerHTML = medModFtArr.join("");
					Util.ia(medModFt, secCont);
				}
		
				meds.push("</div>");
				sHTML = meds.join("");
				countText = MP_Util.CreateTitleText(component, medCnt);
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
			}
		}
		catch(e){
			//do nothing
 		}
	},
	 /**
     * Appends the target container for the AlertMessage control used to display various message related to formulary eligibility.
     * @param {number} compId : A double value representing the componentId
     * @returns {undefined} undefined
     */	
	appendNoHealthPlanContainer: function(compId){
		var component = MP_Util.GetCompObjById(compId);		
		var noHealthPlanDiv = _g("hml"+compId+"NoHealthPlans");
		if(noHealthPlanDiv){
			return;
		}
		noHealthPlanDiv = Util.cep("div", {
			"className": "message-container",
			"id": "hml"+ compId + "NoHealthPlans" 
		});
		
		var m_contentNode = $("#hmlContent"+compId);
		$(noHealthPlanDiv).prependTo(m_contentNode);
		component.m_base.setAlertMessageElementId(noHealthPlanDiv);
	},	
	/**
	 * The following will display the text "Drug class grouping has been applied." in the sub-header of the component. The sub-header rests directly above the accordion.
	 * The text is particularly important for the user for whenever the accordion is collapsed. This will indicate to the user that either a grouping has been applied to
	 * the component or if the drugs are sorted alphabetically (no grouping is selected).
	 * 
	 * @param {object} component [required] - The Home Medication's component.
	 * @param {number}compID [required] - The Home Medication's component id.
	 * @returns {undefined} undefined
	 */
	ShowGroupingLabel: function(component, compID){
		var uniqueComponentId = component.getStyles().getId();
		var filterAppliedSection = $("#filterAppliedMessage" + uniqueComponentId);
		var homeMedsi18n = i18n.discernabu.homemeds_o1;
		filterAppliedSection.html(homeMedsi18n.DRUGCLASSGROUPINGAPPLIED);
	},
		SetGroupingAndRefresh: function(compID, num, sortName){
			var component = MP_Util.GetCompObjById(compID);
			var grouperCriteria = component.getGrouperCriteria(num);
			var recordData = component.getAllData();
			component.setGrouperFilterCriteria(grouperCriteria);
			//A saved option is loaded and the drugs will be sorted according to the option
			$("#filter-grouping-selected-label-" + component.getStyles().getId()).html(sortName);
			component.setGrouperFilterLabel(sortName);
			MP_Core.AppUserPreferenceManager.SaveCompPreferences(compID);
			if(recordData){
				CERN_HOME_MEDS_O1.RenderComponent(component, recordData);
			}
		},
		
		SortByMedicationName: function (a, b) {
		var aName = getMedicationDisplayName(a);
		var bName = getMedicationDisplayName(b);
		var aUpper = (aName !== null) ? aName.toUpperCase() : "";
		var bUpper = (bName !== null) ? bName.toUpperCase() : "";

		if(aUpper > bUpper) {
			return 1;
		}
		else {
			if(aUpper < bUpper) {
				return -1;
			}
			return 0;
		}
	},
	
	/**
	*Adds the content required for renewal
	* @param {Number} medCompId : Component Id 
	* @param {Array} allRows : All the rows displayed in the component
	* @param {Array} orders : Order information for respective rows
	* @returns {undefined} undefined
	*/
	addRenewData: function (medCompId, allRows, orders) {
		var ordLen = orders.length;
		var hmI18n = i18n.discernabu.homemeds_o1;
		for(var i = 0; i < ordLen; i++){
			var curRow = allRows[i];
			var curOrder = orders[i];
			var imgSpan = Util.Style.g("hml-rx-hx", curRow, "span");
			var imgClass = Util.gc(imgSpan[0]).className;
			var documentedMedClass = '';
			if(imgClass !== 'hml-rx'){
				documentedMedClass = '-hx';
			}
			var ordMedInfo = curOrder.MEDICATION_INFORMATION;
			var orderId = ordMedInfo.ORDER_ID;
			var duration = ordMedInfo.DURATION;
			var dispenseQty = ordMedInfo.DISPENSE_QTY;
			var dispenseQtyUnit = ordMedInfo.DISPENSE_QTY_UNIT;
			var dispenseQtyCd = ordMedInfo.DISPENSE_QTY_UNIT_CD;
			var refillCount = ordMedInfo.NBR_REFILLS;
			var signatureLine = ' ';
			var cki = ordMedInfo.CKI;
			//Dispense quantity value is formatted to display and added to the row 
			if(dispenseQty) {
				var formattedDispenseQty = formatDispQ(dispenseQty);
				if(formattedDispenseQty[0]) {
					dispenseQty = formattedDispenseQty[0];
				}
				else {
					dispenseQty = 0;
				}
				signatureLine += ' <span class="hml-hide-sig-line hml-disp-q' + documentedMedClass + '" id="dq' + medCompId + '_' + orderId + '"><span class="hml-dq-qty" id="dqQty' + medCompId + '_' + orderId + '">' + dispenseQty + '</span><span class="hml-dq-tp"> ' + dispenseQtyUnit + '</span></span>';
			}
			
			//Number of refills is formatted to display and added to the row
			if(refillCount) {
				if(parseInt(refillCount, 10)) {
					refillCount = parseInt(refillCount, 10);
				}
				else {
					refillCount = 0;
				}
				signatureLine += ' <span class="hml-hide-sig-line hml-rfl' + documentedMedClass + '" id="rfl' + medCompId + '_' + orderId + '">' + refillCount + ' ' + hmI18n.REFILLS + '</span>';
			}
			else if(imgClass === 'hml-rx') {
				refillCount = 0;
				signatureLine += ' <span class="hml-hide-sig-line hml-rfl" id="rfl' + medCompId + '_' + orderId + '">' + refillCount + ' ' + hmI18n.REFILLS + '</span>';
			}
			
			Util.Style.g("hml-sig", curRow, "dd")[0].innerHTML = signatureLine;
			Util.Style.g("hml-disp-qty-cd", curRow, "dd")[0].innerHTML = dispenseQtyCd;
			Util.Style.g("hml-dur", curRow, "dd")[0].innerHTML = duration;
			var ckiFromRow = $(curRow).data("cki"); 
			if(!ckiFromRow){
				$(curRow).attr("data-cki", cki);
			}
		}
	}
};



	function getComplianceInfo(compliance, personnelArray) {

		var ar = [];
		var lastDocDate = "", lastDocBy = "", msg = "";
		var hmI18n = i18n.discernabu.homemeds_o1;

		if(compliance.NO_KNOWN_HOME_MEDS_IND === 0 && compliance.UNABLE_TO_OBTAIN_IND === 0) {
			return;
		}

		if(compliance.NO_KNOWN_HOME_MEDS_IND == 1) {
			msg = hmI18n.NO_KNOWN_HOME_MEDS;
		}
		else if(compliance.UNABLE_TO_OBTAIN_IND == 1) {
			msg = hmI18n.UNABLE_TO_OBTAIN_MED_HIST;
		}
		if(compliance.PERFORMED_PRSNL_ID > 0) {
            var provider = MP_Util.GetValueFromArray(compliance.PERFORMED_PRSNL_ID, personnelArray);
			lastDocBy = provider.fullName;
		}
		if(compliance.PERFORMED_DATE !== "") {
			var dateTime = new Date();
			dateTime.setISO8601(compliance.PERFORMED_DATE);
			var df = getDateFormatter();
			lastDocDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
		}
		ar.push("<dl class='hml-info'><dd><span class='important-icon'> </span><span>", msg, "</span></dd></dl><h4 class='det-hd'><span>", hmI18n.MED_DETAIL, "</span></h4>", "<div class='hvr'><dl class='hml-det'>", "<dt><span>", hmI18n.LAST_DOC_DT_TM, ":</span></dt><dd class='hml-det-name'><span>", lastDocDate, "</span></dd><dt><span>", i18n.discernabu.homemeds_o1.LAST_DOC_BY, ":</span></dt><dd class='hml-det-dt'><span>", lastDocBy, "</span></dd></dl></div>");
		return ar.join("");
	}	

	function getMedicationDisplayName(order) {
		var medName = "";
		if(order.DISPLAYS !== null) {
			medName = order.DISPLAYS.DISPLAY_NAME;			
		}
		return (medName);
	}

	function getMedicationDisplayNameForHover(order) {
		var medName = "";
		if(order.DISPLAYS !== null) {
			medName = order.DISPLAYS.HOVER_NAME;			
		}
		return (medName);
	}

	function getHomeMedicationType(order) {
		if(order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND == 1) {
			return i18n.discernabu.homemeds_o1.PRESCRIBED;
		}
		else if(order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND == 1) {
			return i18n.discernabu.homemeds_o1.DOCUMENTED;
		}
		else {
			return "";
		}
	}

	function getDateFormatter() {
		if(m_df === null) {
			m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		}
		return m_df;
	}

	function getRouteJSON(component) {
		try {
			MP_Util.LogDiscernInfo(component, "POWERORDERS", "homemedications.js", "getRouteJSON");
			var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
			var criterion = component.getCriterion();
			var m_dPersonId = criterion.person_id;
			var m_dEncounterId = criterion.encntr_id;
			var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);
			var m_routeListJSON = PowerOrdersMPageUtils.GetConsolidatedRoutingOptions(m_hMOEW, component.m_medModObj.catCodeList);
			if(m_routeListJSON) {
				component.m_medModObj.jsonRoutes = JSON.parse(m_routeListJSON);
			}
			PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
		} catch (err) {
			MP_Util.LogJSError(err, component, "homemedications.js", "getRouteJSON");
			alert(i18n.discernabu.homemeds_o1.ROUTE_LIST_ERROR + ": " + err.description);
		}
	}

	//add modification  functions
	/**
	 * Format numeric values for local display and api use
	 * @param {string} inVal : Value to be formatted
	 * @return {array}  : Array containing local display value and api value
	 */
	function formatDispQ(inVal) {
		var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
		var decSep = nf.lc.decimal_point;
		var thouSep = nf.lc.thousands_sep;
		var decPos = inVal.lastIndexOf(decSep);
		var thouPos = inVal.lastIndexOf(thouSep);

		var intSec = '';
		var decSec = '';
		var numArr = inVal.split(decSep);
		var localDispStr;
		var apiVal;
		var intParts;

		if(numArr.length === 2 && decPos > thouPos) {
			intParts = numArr[0].split(thouSep);
			numArr[0] = intParts.join("");
			if(!isNaN(numArr[0]) && !isNaN(numArr[1])) {
				intSec = numArr[0];
				decSec = numArr[1];
			}
			else {
				return [null, null];
			}

		}
		else if(numArr.length === 1) {
			intParts = numArr[0].split(thouSep);
			numArr[0] = intParts.join("");
			if(!isNaN(numArr[0])) {
				intSec = numArr[0];
			}
			else {
				return [null, null];
			}
		}
		else {
			return [null, null];
		}
		if(decSec) {
			localDispStr = intSec + decSep + decSec;
			apiVal = intSec + "." + decSec;
		}
		else {
			localDispStr = intSec;
			apiVal = intSec;
		}

		return [localDispStr, apiVal];
	}

	function medRowSel(e) {
		// --- Code for Timers
		var slaTimer = MP_Util.CreateTimer("CAP:MPG Home Medication Select");
		var parentContentSection = null;
		if (slaTimer) {
			slaTimer.SubtimerName = hm_mpage;
			slaTimer.Start();
			slaTimer.Stop();
		}
		//  ---- Code for Timers
		//check if a row under suspended med is selected
		var sectionContentElement = (Util.gp(Util.gp(Util.gp(this))));
		if ($(sectionContentElement).hasClass("sub-sec-content")) {
			parentContentSection = (Util.gp(Util.gp(Util.gp(sectionContentElement))));
		} else {
			parentContentSection = (Util.gp(sectionContentElement));			
		}
		var idFromContSec = parseInt(parentContentSection.id.replace('hmlContent', ''), 10);

		var medComp = MP_Util.GetCompObjById(idFromContSec);
		medComp.setEditMode(true);
		var medCompId = medComp.m_medModObj.medModCompId;
		var rootMedSecCont = medComp.getSectionContentNode();
		var curImg = null;
		var curSrc = null;
		var newSrc = null;
		var i = 0;
		var j = 0;
		if (!e) {
			e = window.event;
		}

		//allow multi select if shift key pressed
		if(e.shiftKey && medComp.m_medModObj.lastMedSel) {
			var startPos = _g(medComp.m_medModObj.lastMedSel);
			var strtIndx;
			var endIndx;
			var medRows = Util.Style.g("hml-info", rootMedSecCont, 'dl');
			var medLen = medRows.length;
			//get start and end position of multi select
			for ( i = 0; i < medLen; i++) {
				var curId = medRows[i].id;
				if(curId == medComp.m_medModObj.lastMedSel) {
					strtIndx = i;
				}
				else if(curId == this.id) {
					endIndx = i;
				}
			}
			//flip positions for multi select up
			if(strtIndx > endIndx) {
				var tempIndx = strtIndx;
				strtIndx = endIndx;
				endIndx = tempIndx;
			}

			for ( j = strtIndx; j <= endIndx; j++) {
				Util.Style.acss(medRows[j], "hml-med-selected");
				curImg = _gbt('img', medRows[j])[0];
				curSrc = curImg.src;
				if (curSrc.search(/_selected/) == -1) {
					newSrc = curSrc.replace(".gif", "_selected.gif");
					curImg.src = newSrc;
				}
			}
			//reset last med row selected
			medComp.m_medModObj.lastMedSel = null;
		}
		else {
			this.style.background = '#0000FF';

			curImg = _gbt('img', this)[0];
			curSrc = curImg.src;
			if (Util.Style.ccss(this, "hml-med-selected")) {
				Util.Style.rcss(this, "hml-med-selected");
				//reset last row selected on deselect
				medComp.m_medModObj.lastMedSel = null;
				//switch images for selected/unselected rows
				if (curSrc.search(/_selected/) > -1) {
					newSrc = curSrc.replace("_selected.gif", ".gif");
					curImg.src = newSrc;
					this.style.background = '#FFFFFF';
				}
			}
			else {
				Util.Style.acss(this, "hml-med-selected");
				//set last row selected for multi select
				medComp.m_medModObj.lastMedSel = this.id;
				if (curSrc.search(/_selected/) == -1) {
					newSrc = curSrc.replace(".gif", "_selected.gif");
					curImg.src = newSrc;
				}
			}
		}
		var selectedRows = Util.Style.g("hml-med-selected", rootMedSecCont, "dl");
		var selectLen = selectedRows.length;

		if(selectLen > 0) {
			//refresh hovers when not in edit mode
			if(selectLen == 1 && !medComp.m_medModObj.m_editMode) {
				var hmlDets = Util.Style.g('hvr');
				var detLen = hmlDets.length;
				for ( i = detLen; i--; ) {
					hmlDets[i].style.display = 'none';
				}

			}

			medComp.setEditMode(true);
			enableActions(medComp);

			//enable reset if row(s) selected
			for ( j = selectLen; j--; ) {
				if (Util.Style.ccss(selectedRows[j], "hml-rnwd") || Util.Style.ccss(selectedRows[j], "hml-cncld") || Util.Style.ccss(selectedRows[j], "hml-cmplt")) {
					medComp.removeMenuDither("mnuRnwReset");
					break;
				}
				else if(j === 0) {
					medComp.addMenuDither("mnuRnwReset");
				}
			}
		}
		else {
			var rnwdLen = Util.Style.g('hml-rnwd', rootMedSecCont, "dl").length;
			var cncldLen = Util.Style.g('hml-cncld', rootMedSecCont, "dl").length;
			var cmpltLen = Util.Style.g('hml-cmplt', rootMedSecCont, "dl").length;
			if(rnwdLen === 0 && cncldLen === 0 && cmpltLen === 0) {
				medComp.setEditMode(false);
			}
			disableActions(medComp);
		}
	}

	/**
	 * Enable buttons and switch to active image
	 * @param {obj} medComp : The Med component to enable actions in
	 * @returns {undefined} undefined
	 */
	function enableActions(medComp) {
		var criterion = medComp.getCriterion();
		var ipath = criterion.static_content;
		var medCompId = medComp.m_medModObj.medModCompId;
		var displayMedsRec = medComp.getMedRec();
		_g("medRnwBtn" + medCompId).disabled = false;
		_g("medCnclBtn" + medCompId).disabled = false;
		_g("medCmpltBtn" + medCompId).disabled = false;
		_g("medRnwImg" + medCompId).src = ipath + "/images/renew.gif";
		_g("medCnclImg" + medCompId).src = ipath + "/images/cancel.gif";
		_g("medCmpltImg" + medCompId).src = ipath + "/images/complete.gif";
		//activate menu items
		medComp.removeMenuDither("mnuRenew");
		medComp.removeMenuDither("mnuComplete");
		medComp.removeMenuDither("mnuCancel");
		//disable Meds Rec Link
		if(displayMedsRec) {
			Util.Style.acss(_g("medRecLnk" + medCompId), "hml-mrec-link-dthr");
	}
}

	/**
	 * Disable buttons and switch to disabled image
	 * @param {obj} medComp : The Med component to disable actions in
	 * @returns {undefined} undefined
	 */
	function disableActions(medComp) {
		var criterion = medComp.getCriterion();
		var ipath = criterion.static_content;
		var medCompId = medComp.m_medModObj.medModCompId;
		var displayMedsRec = medComp.getMedRec();
		_g("medRnwBtn" + medCompId).disabled = true;
		_g("medCnclBtn" + medCompId).disabled = true;
		_g("medCmpltBtn" + medCompId).disabled = true;
		_g("medRnwImg" + medCompId).src = ipath + "/images/renew_disabled.gif";
		_g("medCnclImg" + medCompId).src = ipath + "/images/cancel_disabled.gif";
		_g("medCmpltImg" + medCompId).src = ipath + "/images/complete_disabled.gif";
		//disable menu items
		medComp.addMenuDither("mnuRenew");
		medComp.addMenuDither("mnuComplete");
		medComp.addMenuDither("mnuCancel");
		//reset disable
		medComp.addMenuDither("mnuRnwReset");
		//enable Meds Rec Link if no meds mods are available to be signed
		if(_g("medSgnBtn" + medCompId).disabled && displayMedsRec) {
			Util.Style.rcss(_g("medRecLnk" + medCompId), "hml-mrec-link-dthr");
		}
	}

	/**
	 * marks row(s) with appropriate class for action to take on submit
	 * @param {obj} e : The event object
	 * @returns {undefined} undefined
	 */
	function queueOrder(e) {
		if (Util.Style.ccss(this, "hml-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
			if (!e) {
				e = window.event;
			}
			Util.cancelBubble(e);
		}
		else {
			try{
				var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
				var medComp = MP_Util.GetCompObjById(medCompId);
				var criterion = medComp.getCriterion();
				var ipath = criterion.static_content;
				var rootMedSecCont = medComp.getSectionContentNode();
				var rtUid = "";
				var hmI18n = i18n.discernabu.homemeds_o1;
	
				var rType;
				if(this.id == ('medRnwBtn' + medCompId) || this.id == ('mnuRenew' + medCompId)) {
					rType = 'hml-rnwd';
				}
				else if(this.id == ('medCnclBtn' + medCompId) || this.id == ('mnuCancel' + medCompId)) {
					rType = 'hml-cncld';
				}
				else if(this.id == ('medCmpltBtn' + medCompId) || this.id == ('mnuComplete' + medCompId)) {
					rType = 'hml-cmplt';
				}
				if(rType === 'hml-rnwd' && medComp.getInitialRenew()){
					
					//make a script call
					var isLoadSuccess = true;
					var allRows = Util.Style.g("hml-info", rootMedSecCont, "dl");
					var allRowsLen = allRows.length;
					var renewOrdIdsJson;
					//Replace the order id array with a json string containing order_id:synonym_id objects.
					// This would be helpful in using the synonym_id to retrieve the cki for each medication.
					if(allRowsLen) {
						renewOrdIdsJson =  "{ 'RENEW_ORDER_RECORD' : {'RENEWABLE_ORDERS':[";
						for(var rowIndx = 0; rowIndx < allRowsLen; rowIndx++){
							var orderId = allRows[rowIndx].id.split("_")[1];
							var synonymId = $(allRows[rowIndx]).data("synonymid");
							renewOrdIdsJson += "{'ORDER_ID':" + orderId +".0 ,'SYNONYM_ID':" + synonymId + ".0}";
							if(rowIndx < allRowsLen - 1){
								renewOrdIdsJson += ",";
							}
						}
						renewOrdIdsJson += "]}}";
					}									
					var renewTimer = new RTMSTimer("USR:MPG.HOME_MEDS.O1 - renew action");
					var renewRequest=new ScriptRequest();
					renewRequest.setProgramName("MP_GET_HOME_MEDICATIONS_RENEW");
					renewRequest.setParameterArray(["^MINE^", "^"+ renewOrdIdsJson +"^"]);
					renewRequest.setAsyncIndicator(false);
					
					renewRequest.setResponseHandler(function(scriptReply){
						var renewReply = scriptReply.getResponse();
						if (renewReply.STATUS_DATA.STATUS === "S") {
							var orders = renewReply.ORDERS;
							CERN_HOME_MEDS_O1.addRenewData(medCompId, allRows, orders);
							medComp.setInitialRenew(false);
						} else {
							isLoadSuccess = false;
						}
					});
					renewRequest.setLoadTimer(renewTimer);
					renewRequest.performRequest();
					if(!isLoadSuccess){
						var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
						if(!errorModal){
							var refreshButton = null;
							var cancelButton = null;
							errorModal = MP_Util.generateModalDialogBody("errorModal", "error", hmI18n.RENEW_SCRIPT_ERROR, hmI18n.RENEW_SCRIPT_ERROR_ACTION);
							errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
							//The refresh button is created and added to the footer
							refreshButton = new ModalButton("refreshButton");
							refreshButton.setText(i18n.REFRESH).setCloseOnClick(true);
							refreshButton.setOnClickFunction(function() {
								//Refreshes the component
								medComp.InsertData();
							});
							errorModal.addFooterButton(refreshButton);
							//The cancel button is created and added to the footer
							cancelButton = new ModalButton("cancelButton");
							cancelButton.setText(i18n.CANCEL).setCloseOnClick(true);
							errorModal.addFooterButton(cancelButton);
						}
						else{
							// resetting the error message
							errorModal = MP_Util.generateModalDialogBody("errorModal", "error", hmI18n.RENEW_SCRIPT_ERROR, hmI18n.RENEW_SCRIPT_ERROR_ACTION);
						}
						MP_ModalDialog.updateModalDialogObject(errorModal);
						MP_ModalDialog.showModalDialog("errorModal");
						return;
					}
				}
				var selectedRows = Util.Style.g("hml-med-selected", rootMedSecCont, "dl");
				medComp.m_base.setSelectedRows(selectedRows);
				var selRowLen = selectedRows.length;
				for(var i = 0; i < selRowLen; i++) {
					var selRow = selectedRows[i];
					var origDispQty;
					var origRflQty;
	
					var curDispQ = Util.Style.g("hml-disp-q", selRow, "span")[0];
					if(curDispQ) {
						origDispQty = Util.Style.g("hml-dq-qty", curDispQ, "span")[0].innerHTML;
						if(rType === "hml-rnwd"){
							Util.Style.rcss(curDispQ, "hml-hide-sig-line");
						}					
						Util.Style.acss(curDispQ, "hml-disp-q-rnw");
						Util.addEvent(curDispQ, "click", changeDispQ);
					}
	
					var curRfl = Util.Style.g("hml-rfl", selRow, "span")[0];
					if(curRfl) {
						if(rType === "hml-rnwd"){
							Util.Style.rcss(curRfl, "hml-hide-sig-line");
						}
						Util.Style.acss(curRfl, "hml-rfl-rnw");
						origRflQty = parseInt(curRfl.innerHTML, 10);
						Util.addEvent(curRfl, "click", changeRfl);
					}
	
					//clear route if exists
					var prevRt = Util.Style.g("hml-rt-spn", selRow, "span")[0];
					if(prevRt) {
						if(rType == 'hml-cncld' || rType == 'hml-cmplt') {
							Util.de(prevRt);
						}
					}
					else if(rType == 'hml-rnwd') {
						var curDur = Util.Style.g("hml-dur", selRow, "dd")[0];
						if(curDur) {
							if(!medComp.m_medModObj.jsonRoutes) {
								getRouteJSON(medComp);
							}

							var curCatCode = (Util.Style.g("hml-cat-cd", selRow, "dd")[0]).innerHTML;
							if (medComp.m_medModObj.jsonRoutes[curCatCode]) {
								var routeInfo = searchRoutes(curCatCode, null, medComp);
								var defRoute = routeInfo[3];
								var routeFrag = Util.cep("span", {
									className: "hml-rt-spn"
								});
								rtUid = routeInfo[0] + routeInfo[1] + routeInfo[2];
								routeFrag.innerHTML = '<span class="hml-route-opt-spn">' + defRoute + '</span><span class="hml-rt-uid cat-' + curCatCode + '">' + rtUid + "</span>";
								Util.addEvent(routeFrag, "click", routeSelect);
								curDur.parentNode.insertBefore(routeFrag, curDur);
							}
						}
					}
	
					var imgSpan = Util.Style.g("hml-rx-hx", selRow, "span");
					var curImg = Util.gc(imgSpan[0]);
					//create object to store original values if none exists
					if(!medComp.m_origOrder[selRow.id]) {
						var origSrc;
						if(curImg.src.search(/_selected/) > -1) {
							origSrc = curImg.src.replace("_selected.gif", ".gif");
						}
						else {
							origSrc = curImg.src;
						}
						setOrigOrder(medComp, selRow.id, origDispQty, origRflQty, origSrc);
					}
	
					Util.Style.rcss(selRow, "hml-med-selected");
					Util.Style.rcss(selRow, "hml-rnwd");
					Util.Style.rcss(selRow, "hml-cncld");
					Util.Style.rcss(selRow, "hml-cmplt");
					Util.Style.acss(selRow, rType);
	
					if(rType == "hml-rnwd") {
						curImg.src = ipath + '/images/renew.gif';
					}
					else if(rType == "hml-cncld") {
						curImg.src = ipath + '/images/cancel.gif';
					}
					else if(rType == "hml-cmplt") {
						curImg.src = ipath + '/images/complete.gif';
					}
				}
				checkIntersection(rtUid, medComp);
				_g("medSgnBtn" + medCompId).disabled = false;
				medComp.removeMenuDither("mnuSign");
				medComp.removeMenuDither("mnuGtOrders");
	
				var totRoutes = Util.Style.g("hml-rt-uid", rootMedSecCont, "span").length;
				if(totRoutes) {
					Util.Style.rcss(_g("routeLink" + medCompId), "hml-dthrd");
				}
				//When the action is renew, append a container to hold the AlertMessage, 
	            //initialize the HealthPlanSelector and display the formulary column
	                
				if (rType === "hml-rnwd") {
					CERN_HOME_MEDS_O1.appendNoHealthPlanContainer(medCompId);
					if (medComp.m_base.getHealthPlanSelector()) {
						if (medComp.m_base.getHealthPlanSelector().getCurrentPlan()) {
							medComp.m_base.healthPlanSelectorCallback(medComp.m_base.getHealthPlanSelector().getCurrentPlan());
						}
					} else {
						var compNS = medComp.getStyles().getNameSpace();
						var rootNode = medComp.getRootComponentNode();
						var lookBackContainer = $(rootNode).find('#stt' + compNS + medCompId);
						medComp.m_base.initializeHealthPlanSelector(lookBackContainer);
					}
				}
				disableActions(medComp);
			}
			catch(err){
				MP_Util.LogJSError(err, null, "homemedications.js", "queueOrder");
			}
		}
		//reset highlight
		Util.Style.rcss(this, "hml-mnu-hvr");
	}//end queueOrder

	/**
	 * Store some of the original order row details for use in reset
	 * @param {obj} medComp : The component the details are being stored for
	 * @param {string} ordId : Order Id
	 * @param {string} dispQty : Dispense quantity
	 * @param {string} rflQty : Refill Quantity
	 * @param {string} rxType : Rx or Hx
	 * @returns {undefined} undefined
	 */
	function setOrigOrder(medComp, ordId, dispQty, rflQty, rxType) {
		medComp.m_origOrder[ordId] = {};
		medComp.m_origOrder[ordId].ordId = ordId;
		medComp.m_origOrder[ordId].dispQty = dispQty;
		medComp.m_origOrder[ordId].rflQty = rflQty;
		medComp.m_origOrder[ordId].rxType = rxType;
	}

	/**
	 * Search route object for a match
	 * @param {string} curCatCode : Catalog Code of the Med
	 * @param {string} uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
	 * @param {obj} medComp : The component the routes are being searched in
	 * @return {array}  : Array containing Field Display Value, Field Value, Mean Id, and Route Display of matched route
	 */
	function searchRoutes(curCatCode, uid, medComp) {
		var fieldDispVal, fieldVal, meanId, defRoute;
		var curCatList = medComp.m_medModObj.jsonRoutes[curCatCode];
		var hmI18n = i18n.discernabu.homemeds_o1;
		var i = 0;

		if(curCatList.pharmacies.length) {
			var pharms = curCatList.pharmacies;
			var phLen = pharms.length;
			for ( i = phLen; i--; ) {
				var curPharm = pharms[i];
				if(uid) {
					if(uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
						defRoute = curPharm.display;
						return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
					}
				}
				else if(curPharm.bDefault) {
					defRoute = curPharm.display;
					return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
				}
			}
		}

		if(!defRoute) {
			if(curCatList.printers.length) {

				var printers = curCatList.printers;
				var prLen = printers.length;
				for ( i = prLen; i--; ) {
					var curPrint = printers[i];
					if(uid) {
						if(uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
							defRoute = curPrint.display;
							return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
						}
					}
					else if(curPrint.bDefault) {
						defRoute = curPrint.display;
						return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
					}
				}
			}

		}
		if(!defRoute) {
			if(curCatList.doNotSendReasons.length) {
				var dns = curCatList.doNotSendReasons;
				var dnsLen = dns.length;
				for ( i = dnsLen; i--; ) {
					var curDns = dns[i];
					if(uid) {
						if(uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
							defRoute = curDns.display;
							return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
						}
					}
					else if(curDns.bDefault) {
						defRoute = hmI18n.DNS_LABEL + ": " + curDns.display;
						return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
					}
				}
			}

		}

		//if no matches for default
		if(!uid) {
			return [null, null, null, hmI18n.NO_DEFAULTS];
		}
	}

	/**
	 * Search route object and return matched object to build intersection list
	 * @param {string} curCatCode : Catalog Code of the Med
	 * @param {string} uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
	 * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
	 * @param {obj} medComp : The component the routes are being searched in
	 * @return {obj}  : Matched route object
	 */
	function searchRouteInt(curCatCode, uid, interType, medComp) {
		var curCatList = medComp.m_medModObj.jsonRoutes[curCatCode];
		var i = 0;
		if (interType === "pharmInt") {
			if (curCatList.pharmacies) {
				var pharms = curCatList.pharmacies;
				var phLen = pharms.length;
				for ( i = 0; i < phLen; i++) {
					var curPharm = pharms[i];
					if(uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
						return curPharm;
					}
				}
			}
		}
		else if(interType === "printInt") {
			if(curCatList.printers) {
				var printers = curCatList.printers;
				var prLen = printers.length;
				for ( i = 0; i < prLen; i++) {
					var curPrint = printers[i];
					if(uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
						return curPrint;
					}
				}
			}
		}
		else if(interType === "dnsInt") {
			if(curCatList.doNotSendReasons) {
				var dns = curCatList.doNotSendReasons;
				var dnsLen = dns.length;
				for ( i = 0; i < dnsLen; i++) {
					var curDns = dns[i];
					if(uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
						return curDns;
					}
				}
			}
		}
	}

	/**
	 * Builds intersection list of routes and populates default routing link drop down
	 * @param {string} inUid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
	 * @param {obj} medComp : The med component intersection is being checked for
	 * @returns {undefined} undefined
	 */
	function checkIntersection(inUid, medComp) {
		var medCompId = medComp.m_medModObj.medModCompId;
		var jsonRoutes = medComp.m_medModObj.jsonRoutes;
		var uids = Util.Style.g("hml-rt-uid", _g("hml" + medCompId), "span");
		var uLen = uids.length;
		var rtLink = _g('routeLink' + medCompId);
		var hmI18n = i18n.discernabu.homemeds_o1;
		var catCd = null;
		if (uLen === 0) {
			rtLink.onclick = null;
			rtLink.innerHTML = hmI18n.MED_NONE_SELECTED;
		}
		else {
			var defRoute = Util.gps(uids[0]).innerHTML;

			if (uLen === 1) {
				var uid = uids[0].innerHTML;
				rtLink.innerHTML = '<span class="hml-route-opt-spn">' + defRoute + '</span><span class="hml-defrt-uid">' + uid + '</span>';
				catCd = uids[0].className.replace('hml-rt-uid cat-', '');
				jsonRoutes.intersectionList = {};
				jsonRoutes.intersectionList.pharmacies = jsonRoutes[catCd].pharmacies;
				jsonRoutes.intersectionList.printers = jsonRoutes[catCd].printers;
				jsonRoutes.intersectionList.doNotSendReasons = jsonRoutes[catCd].doNotSendReasons;

				rtLink.onclick = routeSelect;
			}
			else {
				var pharmIntersect = [];
				var printIntersect = [];
				var dnsIntersect = [];
				var multi = false;
				var matchUid;
				var defUid;

				if(inUid !== 'reset') {
					defUid = inUid;
				}
				else {
					defUid = uids[0].innerHTML;
				}

				for (var i = 0; i < uLen; i++) {
					catCd = uids[i].className.replace('hml-rt-uid cat-', '');
					if (i === 0) {
						pharmIntersect = jsonRoutes[catCd].pharmacies;
						printIntersect = jsonRoutes[catCd].printers;
						dnsIntersect = jsonRoutes[catCd].doNotSendReasons;
						matchUid = uids[i].innerHTML;
					}
					else {
						pharmIntersect = getIntersect(pharmIntersect, jsonRoutes[catCd].pharmacies, catCd, "pharmInt", medComp);
						printIntersect = getIntersect(printIntersect, jsonRoutes[catCd].printers, catCd, "printInt", medComp);
						dnsIntersect = getIntersect(dnsIntersect, jsonRoutes[catCd].doNotSendReasons, catCd, "dnsInt", medComp);
					}
					if(matchUid !== uids[i].innerHTML) {
						multi = true;
						defUid = hmI18n.DEF_ROUTE_MULTI;
					}
				}

				jsonRoutes.intersectionList = {};
				jsonRoutes.intersectionList.pharmacies = pharmIntersect;
				jsonRoutes.intersectionList.printers = printIntersect;
				jsonRoutes.intersectionList.doNotSendReasons = dnsIntersect;
				//take instersect list and build default menu
				if(multi) {
					defRoute = hmI18n.DEF_ROUTE_MULTI;
				}

				rtLink.onclick = routeSelect;
				rtLink.innerHTML = '<span class="hml-route-opt-spn">' + defRoute + '</span><span class="hml-defrt-uid">' + defUid + '</span>';

			}
		}
	}

	/**
	 * Compares two arrays of objects and returns array of matches
	 * @param {string} list1 : First array to compare
	 * @param {string} list2 : Second array to compare
	 * @param {string} catCd : Catalog Code of the Med
	 * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
	 * @param {obj} medComp : The component the routes are being searched in
	 * @return {array}  : returns array of matched objects
	 */
	function getIntersect(list1, list2, catCd, interType, medComp) {
		var intersection = [];
		var tempUids = [];

		var getCount = function(arr) {
			var countObj = {}, len = arr.length, tmp;
			for(var i = 0; i < len; i++) {
				tmp = countObj[arr[i]];
				countObj[arr[i]] = tmp ? tmp + 1 : 1;
			}
			return countObj;
		};
		var l1Len = list1.length;
		var l2Len = list2.length;

		for(var l1i = 0; l1i < l1Len; l1i++) {
			var curL1 = list1[l1i];
			var l1Uid = curL1.fieldDispValue + curL1.fieldValue + curL1.meanId;
			tempUids.push(l1Uid);
		}
		for(var l2i = 0; l2i < l2Len; l2i++) {
			var curL2 = list2[l2i];
			var l2Uid = curL2.fieldDispValue + curL2.fieldValue + curL2.meanId;
			tempUids.push(l2Uid);
		}

		var uidObj = getCount(tempUids);
		for(var uid in uidObj) {
			if(uidObj[uid] === 2) {
				intersection.push(searchRouteInt(catCd, uid, interType, medComp));
			}
		}

		return intersection;
	}

	/**
	 * Build and display menu of routes
	 * @returns {undefined} undefined
	 */
	function routeSelect() {
		var medComp;
		if(this.id) {
			var idFromRouteLink = parseInt(this.id.replace('routeLink', ''), 10);
			medComp = MP_Util.GetCompObjById(idFromRouteLink);
		}
		else {
			var parentContSec = searchParentByClass(this, "sec-content");
			var idFromContSec=parseInt(parentContSec.id.replace('hmlContent', ''), 10);
			medComp = MP_Util.GetCompObjById(idFromContSec);
		}

		var rtSpan = this;
		var catCode;
		var isIntList = false;
		var medCompId = medComp.m_medModObj.medModCompId;
		var i = 0;

		if(Util.Style.ccss(this, "hml-rt-spn")) {
			var catCodeEl = Util.gc(this, 1);
			catCode = catCodeEl.className.replace('hml-rt-uid cat-', '');

		}
		else {
			catCode = "intersectionList";
			isIntList = true;
		}

		var curUid = Util.gc(rtSpan, 1).innerHTML;
		var ofs = Util.goff(rtSpan);

		medComp.m_medModObj.routeOpt = Util.gc(rtSpan);
		medComp.m_medModObj.routeUid = Util.gc(rtSpan, 1);
		var pharmHTML = '';
		var printHTML = '';
		var dnsHTML = '';
		var extraPrinters = false;
		var hmI18n = i18n.discernabu.homemeds_o1;
		var jsonRoutes = medComp.m_medModObj.jsonRoutes;

		if(!jsonRoutes) {
			alert(hmI18n.NO_ROUTE_OPT);
		}

		if(jsonRoutes[catCode]) {
			var dispStr;
			var rtClass = 'hml-route-opt';
			var curCatList = jsonRoutes[catCode];
			var rtUid = null;

			if(curCatList.pharmacies.length) {
				var pharms = curCatList.pharmacies;
				var phLen = pharms.length;
				if(phLen > 3) {//Limit pharmacies to 3
					phLen = 3;
				}

				for ( i = 0; i < phLen; i++) {
					var curPharm = pharms[i];
					dispStr = curPharm.display;
					rtUid = curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId;

					if(curUid == rtUid) {
						rtClass += ' hml-rt-sel';
					}
					var addrs = curPharm.streetAddress;
					pharmHTML += '<div class="hml-rt-pharm ' + rtClass + '" >' + dispStr + ' - ' + addrs + '</div><span class="hml-rt-uid cat-' + catCode + '">' + rtUid + '</span><div class="hml-rt-hover"><div class="hml-rt-hover-hd">' + dispStr + ' - ' + curPharm.pharmNum + '</div><div class="hml-rt-addr"><div>' + curPharm.streetAddress + '</div><div>' + curPharm.city + ', ' + curPharm.state + ' ' + curPharm.zip + '</div><div>' + curPharm.country + '</div></div><div>' + hmI18n.MED_MOD_TEL + ': ' + curPharm.tel + '</div><div>' + hmI18n.MED_MOD_FAX + ': ' + curPharm.fax + '</div></div>';
					rtClass = rtClass.replace(' hml-rt-sel', '');
				}
			}

			if(curCatList.printers.length) {
				var printers = curCatList.printers;
				var prLen = printers.length;
				var curPrinter = null;
				if (prLen < 5) {
					for ( i = 0; i < prLen; i++) {
						curPrinter = printers[i];
						dispStr = curPrinter.display;
						rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
						if (curUid == rtUid) {
							rtClass += ' hml-rt-sel';
						}
						printHTML += '<div class="hml-rt-printer ' + rtClass + '" >' + dispStr + '</div><span class="hml-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
						rtClass = rtClass.replace(' hml-rt-sel', '');

					}
				}
				else {
					for ( i = 0; i < prLen; i++) {
						curPrinter = printers[i];
						dispStr = curPrinter.display;
						rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
						if (curUid == rtUid) {
							rtClass += ' hml-rt-sel';
						}
						if(i == 3) {
							extraPrinters = true;
							printHTML += '<div class="hml-rt-more-printer hml-route-opt" id="morePrinter' + medCompId + '">' + hmI18n.MORE_PRINTERS + '</div>';
							printHTML += '<div class="hml-rt-more-menu menu-hide cat' + catCode + '" id="morePrintMenu' + medCompId + '">';
							printHTML += '<div class="hml-rt-printer ' + rtClass + '" >' + dispStr + '</div>' + '<span class="hml-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
						}
						else {
							printHTML += '<div class="hml-rt-printer ' + rtClass + '" >' + dispStr + '</div>' + '<span class="hml-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
						}
						rtClass = rtClass.replace(' hml-rt-sel', '');
					}
					printHTML += '</div>';
				}
			}

			if(curCatList.doNotSendReasons.length) {
				var dns = curCatList.doNotSendReasons;
				var dnsLen = dns.length;
				if(dnsLen > 3) {//Limit DNS to 3
					dnsLen = 3;
				}
				for ( i = 0; i < dnsLen; i++) {
					var curDNS = dns[i];
					dispStr = curDNS.display;
					rtUid = curDNS.fieldDispValue + curDNS.fieldValue + curDNS.meanId;
					if (curUid == rtUid) {
						rtClass += ' hml-rt-sel';
					}
					dnsHTML += '<div class="' + rtClass + '" >' + hmI18n.DNS_LABEL + ': ' + dispStr + '</div>' + '<span class="hml-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
					rtClass = rtClass.replace(' hml-rt-sel', '');

				}
			}

		}

		if(pharmHTML) {
			pharmHTML += '<hr class="hml-rt-hr" />';
		}

		if(printHTML) {
			printHTML += '<hr class="hml-rt-hr" />';
		}

		var routeMnu = Util.cep("div", {
			"className": "hml-rt-menu",
			"id": "rtMnu" + medCompId
		});

		if(!pharmHTML && !printHTML && !dnsHTML) {
			routeMnu.innerHTML = hmI18n.NO_DEFAULTS;
		}
		else {
			routeMnu.innerHTML = pharmHTML + printHTML + dnsHTML;
		}

		var closeRtMnu = function(e) {
			if (!e) {
				e = window.event;
			}
			if(!_g("morePrintDiv" + medCompId)) {
				Util.de(this);
				Util.cancelBubble(e);
			}
		};
		if(window.attachEvent) {
			Util.addEvent(routeMnu, "mouseleave", closeRtMnu);
		}
		else {
			Util.addEvent(routeMnu, "mouseout", closeRtMnu);
		}

		var changeRoute = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			if(Util.Style.ccss(target, "hml-rt-menu")) {
				return;
			}
			unHltRouteRow.call(target);

			if(target.id != "morePrinter" + medCompId) {
				if(target.nodeName.toLowerCase() === 'div' && Util.Style.ccss(target, 'hml-route-opt')) {
					if(isIntList) {
						var uids = Util.Style.g("hml-rt-uid", _g("hml" + medCompId), "span");
						var uLen = uids.length;
						var newRoute = target.innerHTML;
						var newUid = Util.gns(target).innerHTML;
						var catCodes = [];
						var isPrinter = Util.Style.ccss(target, 'hml-rt-printer');

						for(var i = 0; i < uLen; i++) {
							var curUid = uids[i];
							if(isPrinter) {
								var catCd = curUid.className.replace('hml-rt-uid cat-', '');
								catCodes.push(catCd);
							}
							Util.gps(curUid).innerHTML = newRoute;
							curUid.innerHTML = newUid;

						}
						checkIntersection(newUid, medComp);
						if(isPrinter) {
							orderPrinters(catCodes, newUid, medComp);
						}
					}
					else {
						medComp.m_medModObj.routeOpt.innerHTML = target.innerHTML;
						medComp.m_medModObj.routeUid.innerHTML = Util.gns(target).innerHTML;

						checkIntersection(medComp.m_medModObj.routeUid.innerHTML, medComp);
					}
					Util.cancelBubble(e);
					Util.de(routeMnu);
					var mPrintDiv = _g('morePrintDiv' + medCompId);
					if(mPrintDiv) {
						Util.de(mPrintDiv);
					}
				}
			}
		};

		Util.addEvent(routeMnu, "click", changeRoute);

		var rtMenuRows = Util.Style.g("hml-route-opt", routeMnu, 'div');
		var rtMnLen = rtMenuRows.length;
		for(var i = rtMnLen; i--; ) {
			Util.addEvent(rtMenuRows[i], "mouseover", hltRouteRow);
			Util.addEvent(rtMenuRows[i], "mouseout", unHltRouteRow);
		}

		Util.ac(routeMnu, document.body);
		if(_g("morePrinter" + medCompId)) {
			Util.addEvent(_g("morePrinter" + medCompId), "click", function() {showMorePrinters(this, isIntList, medComp);});
		}
		var vp = gvs();

		if((ofs[0] + routeMnu.offsetWidth) >= vp[1]) {
			routeMnu.style.left = (vp[1] - routeMnu.offsetWidth - 5) + 'px';
		}
		else {
			routeMnu.style.left = ofs[0] + 'px';
		}

		if((vp[0]) >= (ofs[1] + routeMnu.offsetHeight)) {
			routeMnu.style.top = ofs[1] + 'px';
		}
		else {
			routeMnu.style.top = (ofs[1] - routeMnu.offsetHeight + 15) + 'px';
		}

		Util.cancelBubble();
	}

	/**
	 * Add hover to route menu rows and delayed tool tip for additional pharmacy info
	 * @returns {undefined} undefined
	 */
	function hltRouteRow() {
		var parentId = Util.gp(this).id;
		var idFromRouteMenu = parseInt(parentId.replace('rtMnu', ''), 10);
		var medComp = MP_Util.GetCompObjById(idFromRouteMenu);
		var medCompId = medComp.m_medModObj.medModCompId;
		if(this.id == "morePrinter" + medCompId) {
			Util.Style.acss(this, "hml-mp-hvr");
		}
		else {
			Util.Style.acss(this, "hml-mnu-hvr");
			var mpBtn = _g("morePrinter" + medCompId);
			if(mpBtn) {
				if(Util.Style.ccss(mpBtn, "hml-mp-hvr")) {
					Util.Style.rcss(mpBtn, "hml-mp-hvr");
				}
			}
		}
		if(Util.Style.ccss(this, "hml-rt-pharm")) {
			var ofs = Util.goff(this);
			var rtToolTip = Util.gns(Util.gns(this));
			var thisWidth = this.offsetWidth;

			var showRtDet = function() {
				var rtHTML = rtToolTip.innerHTML;
				var rtWidth = rtToolTip.offsetWidth;
				medComp.m_medModObj.rtDiv = Util.cep("div", {
					"className": "hml-rt-div"
				});
				medComp.m_medModObj.rtDiv.innerHTML = rtHTML;

				Util.ac(medComp.m_medModObj.rtDiv, document.body);

				var divOfs = medComp.m_medModObj.rtDiv.offsetWidth + 15;

				var vpOfs = ofs[0] - divOfs;
				if(vpOfs > 0) {
					medComp.m_medModObj.rtDiv.style.left = vpOfs + 'px';
					medComp.m_medModObj.ttArrow = Util.cep("span", {
						"className": "hml-tt-arr-lt"
					});
					medComp.m_medModObj.ttArrow.style.left = (ofs[0] - 18) + 'px';

				}
				else {
					medComp.m_medModObj.rtDiv.style.left = (ofs[0] + thisWidth + 16) + 'px';
					medComp.m_medModObj.ttArrow = Util.cep("span", {
						"className": "hml-tt-arr-rt"
					});
					medComp.m_medModObj.ttArrow.style.left = (ofs[0] + thisWidth + 3) + 'px';
				}
				medComp.m_medModObj.rtDiv.style.top = (ofs[1] - 5) + 'px';

				medComp.m_medModObj.ttArrow.style.top = (ofs[1] + 2) + 'px';
				Util.ac(medComp.m_medModObj.ttArrow, document.body);
			};

			medComp.m_medModObj.rtTimer = setTimeout(showRtDet, 500);
		}
	}

	/**
	 * Un-highlight menu rows of route menu and reset pharmacy tool tip
	 * @returns {undefined} undefined
	 */
	function unHltRouteRow() {
		var rootId = searchParentByClass(this, "hml-rt-menu");
		var parentId = rootId.id;
		var idFromRouteMenu = parseInt(parentId.replace('rtMnu', ''), 10);
		var medComp = MP_Util.GetCompObjById(idFromRouteMenu);
		var medCompId = medComp.m_medModObj.medModCompId;

		if(this.id == ("morePrinter" + medCompId)) {
			var mPrintDv = _g("morePrintDiv" + medCompId);
			if(!mPrintDv) {
				Util.Style.rcss(this, "hml-mp-hvr");
			}
		}
		else {
			Util.Style.rcss(this, "hml-mnu-hvr");

		}
		clearTimeout(medComp.m_medModObj.rtTimer);

		Util.de(medComp.m_medModObj.rtDiv);
		Util.de(medComp.m_medModObj.ttArrow);
	}

	/**
	 * Show additional menu of printers if more than 4
	 * @param {obj} that : this from call
	 * @param {bool} isIntList : is menu for intersection list
	 * @param {obj} medComp : The med component the menu is for
	 * @returns {undefined} undefined
	 */
	function showMorePrinters(that, isIntList, medComp) {
		var medCompId = medComp.m_medModObj.medModCompId;
		if(_g("morePrintDiv" + medCompId)) {
			Util.de(_g("morePrintDiv" + medCompId));
		}
		else {
			var ofs = Util.goff(that);
			var moreMenu = Util.gns(that);
			var thisWidth = that.offsetWidth;
			var mmClassName = moreMenu.className;
			var catCode = mmClassName.replace('hml-rt-more-menu menu-hide cat', '');
			var mpHTML = moreMenu.innerHTML;
			var mpDiv = Util.cep("div", {
				"className": "hml-mp-div",
				"id": "morePrintDiv" + medCompId
			});
			mpDiv.innerHTML = mpHTML;
			Util.ac(mpDiv, document.body);

			var divOfs = mpDiv.offsetWidth;

			var vpOfs = ofs[0] - divOfs;
			if(vpOfs > 0) {
				mpDiv.style.left = (vpOfs - 2) + 'px';
				Util.Style.acss(mpDiv, 'hml-mpd-lt');
			}
			else {
				mpDiv.style.left = (ofs[0] + thisWidth + 6) + 'px';
				Util.Style.acss(mpDiv, 'hml-mpd-rt');

			}
			mpDiv.style.top = (ofs[1] - 5) + 'px';

			var closePrintMnu = function(e) {
				if (!e) {
					e = window.event;
				}
				Util.de(mpDiv);
				var mpBtn = _g("morePrinter" + medCompId);
				if(mpBtn) {
					if(Util.Style.ccss(mpBtn, "hml-mp-hvr")) {
						Util.Style.rcss(mpBtn, "hml-mp-hvr");
					}
				}
				Util.cancelBubble(e);
			};
			var changePrinter = function() {

				var newPrinter = this.innerHTML;
				var newUidEl = Util.gns(this);
				var newUid = newUidEl.innerHTML;
				var catCodes = [];
				if(isIntList) {
					var uids = Util.Style.g("hml-rt-uid", _g("hml" + medCompId), "span");
					var uLen = uids.length;
					for(var i = 0; i < uLen; i++) {
						var catCd = uids[i].className.replace('hml-rt-uid cat-', '');
						Util.gps(uids[i]).innerHTML = newPrinter;
						uids[i].innerHTML = newUid;
						catCodes.push(catCd);
					}

					catCodes.push("intersectionList");
				}
				else {

					medComp.m_medModObj.routeOpt.innerHTML = newPrinter;
					medComp.m_medModObj.routeUid.innerHTML = newUid;
					catCodes.push(newUidEl.className.replace('hml-rt-uid cat-', ''));

				}

				checkIntersection(newUid, medComp);
				orderPrinters(catCodes, newUid, medComp);
				Util.de(mpDiv);
				Util.de(_g("rtMnu" + medCompId));
				Util.cancelBubble();
			};
			var mpOptions = Util.Style.g('hml-rt-printer', _g('morePrintDiv' + medCompId), 'div');
			var mpoLen = mpOptions.length;
			for(var i = 0; i < mpoLen; i++) {
				Util.addEvent(mpOptions[i], "click", changePrinter);
			}

			if(window.attachEvent) {
				Util.addEvent(mpDiv, "mouseleave", closePrintMnu);
			}
			else {
				Util.addEvent(mpDiv, "mouseout", closePrintMnu);
			}

			var mpMenuRows = Util.Style.g("hml-rt-printer", _g("morePrintDiv" + medCompId), 'div');
			var mpMnLen = mpMenuRows.length;
			for(var i = mpMnLen; i--; ) {
				Util.addEvent(mpMenuRows[i], "mouseover", hltMP);
				Util.addEvent(mpMenuRows[i], "mouseout", unHltMP);
			}

		}
		Util.cancelBubble();
	}

	/**
	 * If printer is selected from more printers secondary menu, move to top of list in printers object for display on relaunch of primary menu
	 * @param {array} catCodes : array of catalog codes
	 * @param {string} newUid : uid of the new selection
	 * @param {obj} medComp : The med component the menu is for
	 * @returns {undefined} undefined
	 */
	function orderPrinters(catCodes, newUid, medComp) {
		var jsonRoutes = medComp.m_medModObj.jsonRoutes;
		var catCdLen = catCodes.length;
		for(var j = 0; j < catCdLen; j++) {
			var catCode = catCodes[j];
			if(jsonRoutes[catCode].printers.length) {
				var printers = jsonRoutes[catCode].printers;
				var prLen = printers.length;
				for(var i = 0; i < prLen; i++) {
					var curPrinter = printers[i];
					var rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
					if(rtUid === newUid) {
						var prnToMove = printers.splice(i, 1);
						printers.splice(0, 0, prnToMove[0]);
						break;
					}
				}
			}
		}
	}

	/**
	 * Highlight more printer menu rows
	 * @returns {undefined} undefined
	 */
	function hltMP() {
		Util.Style.acss(this, "hml-mnu-hvr");
	}

	/**
	 * Un-highlight more printer menu rows
	 * @returns {undefined} undefined
	 */
	function unHltMP() {
		Util.Style.rcss(this, "hml-mnu-hvr");
	}

	/**
	 * Initialize and position refill table
	 * @param {obj} e : event object
	 * @param {string} tId : table id
	 * @param {string} selTable : HTML string of table contents
	 * @return {obj} tblAdded : The med component the menu is for
	 */
	function rflTblInit(e, tId, selTable) {
		var tempTbl = Util.ce('span');
		tempTbl.innerHTML = selTable;
		document.body.appendChild(tempTbl);
		var tblAdded = _g(tId);
		var p = getPosition(e), top = p.y - 10, left = p.x - 25;
		tblAdded.style.display = "block";
		tblAdded.style.left = left + "px";
		tblAdded.style.top = top + "px";

		var txtBox = _g('tb' + tId);
		txtBox.select();

		Util.addEvent(tblAdded, "click", function(e) {
			if (!e) {
				e = window.event;
			}
			Util.cancelBubble(e);
		});
		return tblAdded;
	}

	/**
	 * Traverse up the DOM to search for an ancestor by class name
	 * @param {obj} el : reference element to start search from
	 * @param {string} elClass : Class name of ancestor to match
	 * @return {obj} el : The matched ancestor element
	 */
	function searchParentByClass(el, elClass) {
		if(!el.parentNode) {
			return el;
		}
		el = el.parentNode;
		while(el.parentNode && !Util.Style.ccss(el, elClass)) {
			el = el.parentNode;
		}
		return el;
	}

	/**
	 * change dispense quantity
	 * @param {obj} e : event object
	 * @returns {undefined} undefined
	 */
	function changeDispQ(e) {
		var pContentSec = searchParentByClass(this, "sec-content");
		var idFromContentSec = parseInt(pContentSec.id.replace('hmlContent', ''), 10);
		var medComp = MP_Util.GetCompObjById(idFromContentSec);
		var medCompId = medComp.m_medModObj.medModCompId;

		if (!e) {
			e = window.event;
		}
		Util.cancelBubble(e);

		var medIdFrag = medComp.m_medModObj.medModIdFrag;
		var idStr = this.id;
		var idNum = idStr.replace('dq' + medIdFrag, '');
		var hmlInfoId = 'hmlInfo' + medIdFrag + idNum;
		var pRow = _g(hmlInfoId);
		var cDispQ = this;

		if(Util.Style.ccss(pRow, "hml-rnwd")) {

			if(Util.Style.ccss(cDispQ, "hml-disp-q-rnw")) {
				var dqTab = cDispQ.innerHTML;
				var dispSpnId = cDispQ.id;
				var tId = 'Tbl' + cDispQ.id;
				var qty = Util.Style.g("hml-dq-qty", cDispQ, "span")[0].innerHTML;
				var typ = Util.Style.g("hml-dq-tp", cDispQ, "span")[0].innerHTML;
				var curTable = _g(tId);
				if(curTable) {
					Util.Style.rcss(curTable, "hml-hide-tbl");
				}
				else {
					var selTable = "<table class='hml-hvr-tbl' id='" + tId + "'><tr><td class='hml-ref-tab'><span class='hml-rnw-t'>" + dqTab + "</span></td><td class='hml-rt-crnr'></td></tr><tr class='hml-row-hd'><td class='hml-row-tl'>&nbsp; </td><td class='hml-row-tr'>&nbsp;</td></tr><tr class='hml-row'><td class='hml-row-l' colspan='2'><input type='text' class='hml-qty-txt' id='tb" + tId + "' value='" + qty + "' /><span>" + typ + "</span> </td></tr><tr class='hml-row'><td class='hml-row-l' colspan='2'>&nbsp; </td></tr><tr class='hml-row-hd'><td class='hml-row-bl'>&nbsp; </td><td class='hml-row-br'>&nbsp;</td></tr></table>";

					var tblAdded = rflTblInit(e, tId, selTable);

					Util.Style.g("hml-row-tl", tblAdded, "td")[0].style.width = cDispQ.offsetWidth;
					var closeTbl = function(e) {
						if (!e) {
							e = window.event;
						}
						var curQ = Util.Style.g("hml-qty-txt", tblAdded, "input")[0].value;
						var newQty;
						var formatArr = formatDispQ(curQ);
						if(formatArr[0] > 0) {
							newQty = formatArr[0];
							Util.Style.acss(tblAdded, "hml-hide-tbl");
							Util.Style.g("hml-dq-qty", _g(dispSpnId), "span")[0].innerHTML = newQty;
							Util.cancelBubble(e);
						}
						else {
							alert(i18n.discernabu.homemeds_o1.INVALID_QTY);
						}
						Util.cancelBubble(e);
						Util.de(tblAdded);
					};
					if(window.attachEvent) {
						Util.addEvent(tblAdded, "mouseleave", closeTbl);
					}
					else {
						Util.addEvent(tblAdded, "mouseout", closeTbl);
					}

					var rtCorners = Util.Style.g("hml-rt-crnr", tblAdded, "td");
					Util.addEvent(rtCorners[0], "mouseover", closeTbl);
				}
			}
		}
	}//end change dispense quantity

	/**
	 * change number of refills
	 * @param {obj} e : event object
	 * @returns {undefined} undefined
	 */
	function changeRfl(e) {
		var pContentSec = searchParentByClass(this, "sec-content");
		var idFromContentSec = parseInt(pContentSec.id.replace('hmlContent', ''), 10);
		var medComp = MP_Util.GetCompObjById(idFromContentSec);
		var medCompId = medComp.m_medModObj.medModCompId;

		if (!e) {
			e = window.event;
		}
		Util.cancelBubble(e);

		var medIdFrag = medComp.m_medModObj.medModIdFrag;
		var idStr = this.id;
		var idNum = idStr.replace('rfl' + medIdFrag, '');
		var hmlInfoId = 'hmlInfo' + medIdFrag + idNum;
		var pRow = _g(hmlInfoId);
		var cRfl = this;

		if(Util.Style.ccss(pRow, "hml-rnwd")) {

			if(Util.Style.ccss(cRfl, "hml-rfl-rnw")) {
				var rflTab = cRfl.innerHTML;
				var rflId = cRfl.id;
				var tId = 'Tbl' + cRfl.id;
				var qty = parseInt(rflTab, 10);
				var curRflTbl = _g(tId);
				if(curRflTbl) {
					Util.Style.rcss(curRflTbl, "hml-hide-tbl");
				}
				else {
					var hmI18n = i18n.discernabu.homemeds_o1;
					var selTable = "<table class='hml-rfl-hvr-tbl' id='" + tId + "'><tr><td class='hml-ref-tab'><span class='hml-rnw-t'>" + rflTab + "</span></td><td class='hml-rt-crnr'></td></tr><tr class='hml-row-hd'><td class='hml-row-tl'>&nbsp; </td><td class='hml-row-tr'>&nbsp;</td></tr><tr class='hml-row'><td class='hml-row-l' colspan='2'><input type='text' class='hml-qty-txt' id='tb" + tId + "' value='" + qty + "' /><span> " + hmI18n.REFILLS + "</span> </td></tr><tr class='hml-row'><td class='hml-row-l' colspan='2'><label><input type='checkbox' class='hml-rfl-all' id='rflAll" + medCompId + "' value='Apply to All' />" + hmI18n.MED_APPLY_TO_ALL + "</label></td></tr><tr class='hml-row-hd'><td class='hml-row-bl'>&nbsp; </td><td class='hml-row-br'>&nbsp;</td></tr></table>";

					var tblAdded = rflTblInit(e, tId, selTable);

					Util.Style.g("hml-row-tl", tblAdded, "td")[0].style.width = cRfl.offsetWidth;

					var closeRflTbl = function(e) {
						if (!e) {
							e = window.event;
						}
						var newQty;
						var origQty = Util.Style.g("hml-qty-txt", tblAdded, "input")[0].value;
						var rootMedSecCont = medComp.getSectionContentNode();

						if(origQty == '0') {
							newQty = origQty;
						}
						else {
							newQty = parseInt(origQty, 10);
							if(newQty < 0) {
								newQty = null;
							}
						}
						if(newQty) {
							var refillAll = _g('rflAll' + medCompId);
							if(refillAll.checked) {
								var allRenewals = Util.Style.g("hml-rnwd", rootMedSecCont, "dl");
								var renLen = allRenewals.length;
								for(var i = renLen; i--; ) {
									var curRefill = Util.Style.g("hml-rfl-rnw", allRenewals[i], "span");
									if(curRefill[0]) {
										curRefill[0].innerHTML = newQty + ' ' + hmI18n.REFILLS;
									}
								}
							}
							else {
								_g(rflId).innerHTML = newQty + ' ' + hmI18n.REFILLS;
							}

							Util.Style.acss(tblAdded, "hml-hide-tbl");
							Util.cancelBubble(e);
						}
						else {
							alert(hmI18n.INVALID_QTY);
						}
						Util.cancelBubble(e);
						Util.de(tblAdded);
					};
					if(window.attachEvent) {
						Util.addEvent(tblAdded, "mouseleave", closeRflTbl);
					}
					else {
						Util.addEvent(tblAdded, "mouseout", closeRflTbl);
					}

					var rtCorners = Util.Style.g("hml-rt-crnr", tblAdded, "td");
					Util.addEvent(rtCorners[0], "mouseover", closeRflTbl);
				}
			}
		}
	}//change number of refills

	/**
	 * reset row(s) to initial state
	 * @param {obj} e : event object
	 * @returns {undefined} undefined
	 */
	function resetRows(e) {
		if (Util.Style.ccss(this, "hml-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
			if (!e) {
				e = window.event;
			}
			Util.cancelBubble(e);
		}
		else {
			var idFromResetBtn = parseInt(this.id.replace('mnuRnwReset', ''), 10);
			var medComp = MP_Util.GetCompObjById(idFromResetBtn);
			var medCompId = medComp.m_medModObj.medModCompId;
			var origOrder = medComp.m_origOrder;

			var rootMedSecCont = medComp.getSectionContentNode();
			var selectedRows = Util.Style.g("hml-med-selected", rootMedSecCont, "dl");
			var selRowLen = selectedRows.length;

			for(var i = selRowLen; i--; ) {
				var curRow = selectedRows[i];
				var curId = curRow.id;
				var imgSpan = Util.Style.g("hml-rx-hx", curRow, "span");
				var curImg = Util.gc(imgSpan[0]);
				var curSrc = curImg.src;
				var origDispQty;
				var origRflQty;
				if(origOrder[curId]) {
					origDispQty = origOrder[curId].dispQty;
					origRflQty = origOrder[curId].rflQty;
					//set to original image
					curImg.src = origOrder[curId].rxType;
				}
				else if(curSrc.search(/_selected/) > -1) {
					var newSrc = curSrc.replace("_selected.gif", ".gif");
					curImg.src = newSrc;
				}

				Util.Style.rcss(curRow, "hml-med-selected");
				Util.Style.rcss(curRow, "hml-cncld");
				Util.Style.rcss(curRow, "hml-rnwd");
				Util.Style.rcss(curRow, "hml-cmplt");
				var renewEl = Util.Style.g("hml-disp-q-rnw", curRow, "span")[0];
				if(renewEl) {
					Util.Style.rcss(renewEl, "hml-disp-q-rnw");
					Util.Style.acss(renewEl, "hml-hide-sig-line");
					if(origDispQty) {
						Util.Style.g("hml-dq-qty", renewEl, "span")[0].innerHTML = origDispQty;
					}
				}

				var rflEl = Util.Style.g("hml-rfl-rnw", curRow, "span")[0];
				if(rflEl) {
					var hmI18n = i18n.discernabu.homemeds_o1;
					Util.Style.rcss(rflEl, "hml-rfl-rnw");
					Util.Style.acss(rflEl, "hml-hide-sig-line");
					rflEl.innerHTML = origRflQty + ' ' + hmI18n.REFILLS;
				}
				var prevRt = Util.Style.g("hml-rt-spn", curRow, "span")[0];
				if(prevRt) {
					Util.de(prevRt);
				}
				checkIntersection('reset', medComp);
			}

			disableActions(medComp);

			var totRenews = Util.Style.g("hml-rnwd", rootMedSecCont, "dl").length;
			var totCancels = Util.Style.g("hml-cncld", rootMedSecCont, "dl").length;
			var totCompletes = Util.Style.g("hml-cmplt", rootMedSecCont, "dl").length;
			var displayMedsRec = medComp.getMedRec();
			if(totRenews === 0 && totCancels === 0 && totCompletes === 0) {
				_g("medSgnBtn" + medCompId).disabled = true;
				medComp.addMenuDither("mnuSign");
				medComp.addMenuDither("mnuGtOrders");
				if(displayMedsRec) {
					Util.Style.rcss(_g("medRecLnk" + medCompId), "hml-mrec-link-dthr");
				}
				medComp.setEditMode(false);
			}

			var totRoutes = Util.Style.g("hml-rt-uid", rootMedSecCont, "span").length;
			if(totRoutes === 0) {
				Util.Style.acss(_g("routeLink" + medCompId), "hml-dthrd");
			}

		}
		//reset highlight
		Util.Style.rcss(this, "hml-mnu-hvr");
	}//end resetRows

	/**
	 * loop through queued orders and add for the appropriate action
	 * can attempt to sign silently or launch MOEW depending on caller
	 * @param {obj} e : event object
	 * @returns {undefined} undefined
	 */
	function signMedMods(e) {

		if (Util.Style.ccss(this, "hml-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
			if (!e) {
				e = window.event;
			}
			Util.cancelBubble(e);
		}
		else {
			var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
			var medComp = MP_Util.GetCompObjById(medCompId);

			var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
			MP_Util.LogDiscernInfo(medComp, "POWERORDERS", "homemedication.js", "signMedMods");
			var criterion = medComp.getCriterion();
			var m_dPersonId = parseFloat(criterion.person_id);
			var m_dEncounterId = parseFloat(criterion.encntr_id);
			var bDefRt = true;
			if(this.id == ("routeLink" + medCompId) || this.id == ("mnuGtOrders" + medCompId)) {
				bDefRt = false;
			}

			var medSec = medComp.getSectionContentNode();
			var medIdFrag = medComp.m_medModObj.medModIdFrag;
			var failedOrders = "";

			//create moew
			var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);

			//cancel orders
			var cancels = Util.Style.g('hml-cncld', medSec, 'dl');
			var canLen = cancels.length;
			var curCancel;
			var i = 0;
			var l;
			if (canLen > 0) {
				var m_dCancelDCReason = 0.0;
				//default
				var d = new Date();
				//make sure leading zero is present
				var twoDigit = function(num) {
					num = (String(num).length < 2) ? String("0" + num) : String(num);
					return num;
				};
				//YYYYMMDDhhmmsscc -- cc is dropped but needed for format for API
				var cancelDate = "" + d.getFullYear() + twoDigit((d.getMonth() + 1)) + twoDigit(d.getDate()) + twoDigit(d.getHours()) + twoDigit(d.getMinutes()) + twoDigit(d.getSeconds()) + "99";

				for ( i = 0; i < canLen; i++) {
					var cancelId = parseFloat((cancels[i].id).replace('hmlInfo' + medIdFrag, '')) || 0.0;
					//add date time and reason
					curCancel = PowerOrdersMPageUtils.InvokeCancelDCAction(m_hMOEW, cancelId, cancelDate, m_dCancelDCReason);
					if(!curCancel) {
						failedOrders += Util.gc(Util.Style.g('hml-name', cancels[i], 'dd')[0]).innerHTML + "\n";
					}
				}
			}

			//complete orders
			var completes = Util.Style.g('hml-cmplt', medSec, 'dl');
			var curComplete;
			for ( i = 0, l = completes.length; i < l; i++) {
				var completeId = parseFloat((completes[i].id).replace('hmlInfo' + medIdFrag, '')) || 0.0;
				curComplete = PowerOrdersMPageUtils.InvokeCompleteAction(m_hMOEW, completeId);
				if(!curComplete) {
					failedOrders += Util.gc(Util.Style.g('hml-name', completes[i], 'dd')[0]).innerHTML + "\n";
				}
			}

			//renew orders
			var renewals = Util.Style.g('hml-rnwd', medSec, 'dl');
			var curRenewal;
			for ( i = 0, l = renewals.length; i < l; i++) {
				var numRfls, dispQty;
				curRenewal = renewals[i];
				var renewalId = parseFloat((curRenewal.id).replace('hmlInfo' + medIdFrag, '')) || 0.0;
				var dur = 0.0;
				//possible future api use, for now set to 0
				var durCd = 0.0;
				//possible future api use, for now set to 0
				var dispDur = 0.0;
				//possible future api use, for now set to 0
				var dispDurCd = 0.0;
				//possible future api use, for now set to 0

				var rflSpan = Util.Style.g('hml-rfl', curRenewal, 'span')[0];
				if(rflSpan) {
					numRfls = parseFloat(rflSpan.innerHTML) || 0;
				}
				else {
					numRfls = 0.0;
				}

				var dispQtySpan = Util.Style.g('hml-dq-qty', curRenewal, 'span')[0];
				if(dispQtySpan) {
					var formatArr = formatDispQ(dispQtySpan.innerHTML);

					if(formatArr[1]) {
						dispQty = formatArr[1];
					}
					else {
						dispQty = 0;
					}
				}
				else {
					dispQty = 0.0;
				}

				var dispQtyCd = parseFloat(Util.Style.g('hml-disp-qty-cd', curRenewal, 'dd')[0].innerHTML) || 0;
				var routeUidEl = Util.Style.g('hml-rt-uid', curRenewal, 'span')[0];
				var meanId, fieldVal, fieldDispVal;
				if(routeUidEl) {
					var routeUid = routeUidEl.innerHTML;
					var catCd = routeUidEl.className.replace('hml-rt-uid cat-', '');
					var routeInfo = searchRoutes(catCd, routeUid, medComp);

					if(routeInfo) {
						meanId = parseFloat(routeInfo[2]);
						fieldVal = parseFloat(routeInfo[1]);
						fieldDispVal = routeInfo[0];
					}
					else {
						meanId = 0.0;
						fieldVal = 0.0;
						fieldDispVal = 0;
					}
				}
				curRenewal = PowerOrdersMPageUtils.InvokeRenewActionWithRouting(m_hMOEW, renewalId, dur, durCd, dispDur, dispDurCd, numRfls, dispQty, dispQtyCd, meanId, fieldVal, fieldDispVal);
				if(!curRenewal) {
					failedOrders += Util.gc(Util.Style.g('hml-name', renewals[i], 'dd')[0]).innerHTML + "\n";
				}
			}

			//attempt to sign silently or display moew based on default routing
			var bSign;
			var showMOEW;
			var hmI18n = i18n.discernabu.homemeds_o1;
			if (failedOrders !== "") {
				if (curRenewal || curCancel || curComplete) {
					failedOrders = hmI18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + hmI18n.CONTINUE_SIGN;
					var confirmFailed = confirm(failedOrders);
					if(confirmFailed) {
						//continue to sign
						if(bDefRt) {
							bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
						}
						else {
							//displays moew
							showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
						}
					}
				}
				else {
					failedOrders = hmI18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + hmI18n.NO_VALID_ORDERS;
					alert(failedOrders);
				}
			}
			else if(bDefRt) {
				bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
			}
			else {
				//displays moew
				showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
			}
			

			PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);

			//destroy moew
			if(bSign || showMOEW) {
				medComp.InsertData();
			}
			else {
				_g("medSgnBtn" + medCompId).value = hmI18n.MED_SIGN;
			}
		}
	}//end signMedMods

	/**
	 * invoke the Orders API to open the Medications Reconciliation modal window and refresh the component when that action is complete
	 * @param {obj} e : event object
	 * @returns {undefined} undefined
	 */
	function openMedsRec(e) {
		if (Util.Style.ccss(this, "hml-mrec-link-dthr")) {
			if (!e) {
				e = window.event;
			}
			Util.cancelBubble(e);
		}
		else {
			var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
			var component = MP_Util.GetCompObjById(medCompId);
			var criterion = component.getCriterion();
			var mrObject = {};
			try {
				MP_Util.LogDiscernInfo(component, "ORDERS", "homemedications.js", "openMedsRec");
				mrObject = window.external.DiscernObjectFactory("ORDERS");
				mrObject.PersonId = criterion.person_id;
				mrObject.EncntrId = criterion.encntr_id;
				mrObject.reconciliationMode = 3; //Discharge
				mrObject.defaultVenue = getDischargeCode();
				mrObject.LaunchOrdersMode(2, 0, 0); //2 -  Meds Rec
				component.InsertData();
			}
			catch(err) {
				MP_Util.LogJSError(err, null, "homemedications.js", "openMedsRec");
				alert(i18n.discernabu.homemeds_o1.ERROR_MEDS_REC);
			}
		}
	}

	function getDischargeCode() {
		var dischargeMedCd = 0;
		var code = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", 54732);
		dischargeMedCd = (code) ? code.codeValue : 0;

		return dischargeMedCd;
	}

	/////////////////////////////////////////////end add mod functions
}();
