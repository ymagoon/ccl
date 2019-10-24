var MPageComponents = MPageComponents ? MPageComponents : {};
(function() {
	var attribute = MPageObjectOriented.createAttribute;
	
	/**
	 * Wrapper class over the original home medications option 1 and 2 components. This class will 
	 * contain commmon methods used by both the summary and workflow Home Medications components.
	 */
	
	MPageComponents.HomeMedicationsBase = function(component) {
		this.setComponent(component);
		this.setSelectedRows([]);
		this.setHealthPlanSelector(null);
	};
	var HomeMedicationsBase = MPageComponents.HomeMedicationsBase;

	/**
	 * Instance of the component summary or workflow.
	 */
	attribute(HomeMedicationsBase, "Component");

	/*
	 * Criterion object used for getting patient and user details for script requests.
	 */
	attribute(HomeMedicationsBase, "Criterion");

	/*
	 * List of currently selected rows per component.
	 * Used for retrieving the CKI for a prescription from the data-cki attribute.
	 */
	attribute(HomeMedicationsBase, "SelectedRows");
	
	/**
	 *Instance of the HealthPlanSelector.
	 */
	
	attribute(HomeMedicationsBase, "HealthPlanSelector");
	
	/**
	 *The ID of the element which will be by the Error Cotainer for the AlertMessage.
	 */
	
	attribute(HomeMedicationsBase, "AlertMessageElementId");
	


	var prot = HomeMedicationsBase.prototype;

	/** Initializes the HealthPlanSelector 
	 *@param target, The target element to append the HealthPlan Selector.
	 */
	prot.initializeHealthPlanSelector = function(target) {
		if(typeof target === "undefined"){
			throw new Error("The target needs to be defined to append the HealthPlanSelector");
		}
		var component = this.getComponent();
		var compNS = component.getStyles().getNameSpace();
		var compId = component.getComponentId();
		var criterion = this.getCriterion();
		var self = this;
		var planSelector;
		var patientId;
		var userId
		var element = $("<div id='" + compNS + compId + "HealthPlanWrapper' class='hm-healthplan-selector'></div>");
		var formularyEle;
		if(!(target.find("#"+ element.attr("id")).children().length)){
			$(target).append(element);

			patientId = criterion.person_id;
			encounterId = criterion.encntr_id;
			userId = criterion.provider_id;

			planSelector = new HealthPlanSelector();
			planSelector.setElement(element);
			planSelector.setPatient(patientId);
			planSelector.setNamespace(compNS + compId);
			planSelector.setOnSelect(function(healthPlan) {
				if(healthPlan) {
					formularyEle = $('.' + compNS + '-info').find('.' + compNS + '-formulary');
					formularyEle.off("mouseenter").empty();
					formularyEle.empty();
					self.healthPlanSelectorCallback(healthPlan);
				}
			});
			planSelector.setUserId(userId);
			planSelector.setEncounterId(encounterId);
			planSelector.setErrorContainer(this.getAlertMessageElementId());
			this.setHealthPlanSelector(planSelector);
			planSelector.init();
		}
	};

	/**
	 * Callback to a selection of a health plan in the health plan dropdown.
	 */
	prot.healthPlanSelectorCallback = function(healthPlan) {
		var self = this;
		var ckiList = this.getCKIList();
		if(ckiList) {
			SharedPlanEligibilityInfo.retrieveEligibilityInfo(healthPlan.FORMULARY_BENEFIT_SET_UID, ckiList, function(ckiMap) {
				self.renderFormularyInfo(ckiMap);
			});
		}
	};

	/**
	 * Gets the cki from the currently selected medication rows.
	 */
	prot.getCKIList = function() {
		var selectedRows = this.getSelectedRows();
		var totalSelectedRows = selectedRows.length; 	
		var ckiList = [];
		var currentRow;
		var cki;
		for(var index = 0; index < totalSelectedRows; index++) {
			currentRow = selectedRows[index];
			cki = $(currentRow).data("cki");
			if(!cki) {
				continue;
			}
			ckiList[index] = cki;
		}
		return ckiList;
	};

	/**
	 * Takes in a ckiMap and renders the formulary info for the selected medication rows.
	 * @param {Object} ckiMap, A Map that contains the cki as key and the formulary information as value.
	 */
	prot.renderFormularyInfo = function(ckiMap) {
		var component = this.getComponent();
		var compNS = component.getStyles().getNameSpace();
		var compId = component.getComponentId();
		var formularyDetails = ckiMap[cki];
		var rating;
		var shortDisp;
		var longDesc;
		var element;
		var selectedRows;
		var currentElement;
		var selectedRows = this.getSelectedRows();
		var totalSelectedRows = selectedRows.length; 	 	
		var cki;
		for(var index = 0; index < totalSelectedRows; index++) {
			currentElement = $(selectedRows[index]);
			cki = currentElement.data("cki");
			if(ckiMap[cki]) {
				formularyDetails = ckiMap[cki];
				rating = formularyDetails.BENEFIT_RATING;
				shortDisp = formularyDetails.ANNOTATED_TEXT;
				longDesc = formularyDetails.FORMATTED_DETAILS;
				element = $(currentElement).find('.' + compNS + "-formulary");
				HealthPlanEligibilityInfo.generateIconHtml(element, rating, shortDisp, longDesc);
			}
		}
	};
})();