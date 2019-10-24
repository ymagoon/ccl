/**
 * Create the component style object which will be used to style various aspects of our component
 */
function CheckoutComponentWFStyle() {
	this.initByNamespace("ckout");
}
CheckoutComponentWFStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the checkout-o1 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function CheckoutComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new CheckoutComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.CHECKOUT.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.CHECKOUT.O1 - render component");
	this.m_selectedVisit = 2;
	this.setScope(this.m_selectedVisit);	// display selected visit in component header.
	this.checkoutI18n=i18n.discernabu.CheckoutComponentWF;
	/*
	 * Medication Reconciliation attributes declaration
	 */
	this.m_medReconciliationOn = false;
	this.m_medReconciliationLabel = "";
	/*
	 * Patient Education attributes declaration
	 */

	this.m_patEducationOn = false;
	this.m_patEducationLabel = "";

	/*
	 * Follow-up attributes declaration
	 */

	this.m_followupOn = false;
	this.m_followupLabel = "";

	/*
	 * Visit Note attributes declaration
	 */

	this.m_visitNoteOn = false;
	this.m_visitNoteLabel = "";
	this.m_visitNoteLink = "";

	/*
	 * Visit Summary attributes declaration
	 */

	this.m_visitSummaryOn = false;
	this.m_visitSummaryLabel = "";
	this.m_visitSummaryLink = "";
	/*
	 * Visit Charge attributes declaration
	 */

	this.m_visitChargeOn = false;
	this.m_visitChargeLabel = "";
	this.m_visitChargeLinkOn = false;

	/*
	 * Setting up Discharge med indicator in constructor
	 * to avoid calling backend script multiple times.
	 */
	this.dischargeMedCodeset = 54732;
	var dischargeMedCodeValueMeaning = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", this.dischargeMedCodeset);
	this.m_dischargeMedCd = (dischargeMedCodeValueMeaning) ? dischargeMedCodeValueMeaning.codeValue : 0;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
CheckoutComponentWF.prototype = new MPageComponent();
CheckoutComponentWF.prototype.constructor = MPageComponent;

CheckoutComponentWF.prototype.getDischargeMedCode = function() {
	return this.m_dischargeMedCd;
};
/*
 * set and get methods for Medication Reconciliation
 */
CheckoutComponentWF.prototype.setMedReconciliationSwitch = function(value) {
	this.m_medReconciliationOn = value;
};
CheckoutComponentWF.prototype.isMedReconciliationOn = function() {
	return this.m_medReconciliationOn;
};

CheckoutComponentWF.prototype.setMedReconciliationLabel = function(value) {
	this.m_medReconciliationLabel = value;
};
CheckoutComponentWF.prototype.getMedReconciliationLabel = function() {
	return this.m_medReconciliationLabel;
};
/*
 * set and get methods for Patient Education
 */

CheckoutComponentWF.prototype.setPatEducationSwitch = function(value) {
	this.m_patEducationOn = value;
};
CheckoutComponentWF.prototype.isPatEducationOn = function() {
	return this.m_patEducationOn;
};

CheckoutComponentWF.prototype.setPatEducationLabel = function(value) {
	this.m_patEducationLabel = value;
};
CheckoutComponentWF.prototype.getPatEducationLabel = function() {
	return this.m_patEducationLabel;
};

/*
 * set and get methods for Follow-up
 */

CheckoutComponentWF.prototype.setFollowupSwitch = function(value) {
	this.m_followupOn = value;
};
CheckoutComponentWF.prototype.isFollowupOn = function() {
	return this.m_followupOn;
};

CheckoutComponentWF.prototype.setFollowupLabel = function(value) {
	this.m_followupLabel = value;
};
CheckoutComponentWF.prototype.getFollowupLabel = function() {
	return this.m_followupLabel;
};

/*
 * set and get methods for Visit Note
 */

CheckoutComponentWF.prototype.setVisitNoteSwitch = function(value) {
	this.m_visitNoteOn = value;
};
CheckoutComponentWF.prototype.isVisitNoteOn = function() {
	return this.m_visitNoteOn;
};

CheckoutComponentWF.prototype.setVisitNoteLabel = function(value) {
	this.m_visitNoteLabel = value;
};
CheckoutComponentWF.prototype.getVisitNoteLabel = function() {
	return this.m_visitNoteLabel;
};

CheckoutComponentWF.prototype.setVisitNoteLink = function(value) {
	this.m_visitNoteLink = value;
};
CheckoutComponentWF.prototype.getVisitNoteLink = function() {
	return this.getValidatedUrl(this.m_visitNoteLink);
};

/*
 * set and get methods for Visit Summary
 */

CheckoutComponentWF.prototype.setVisitSummarySwitch = function(value) {
	this.m_visitSummaryOn = value;
};
CheckoutComponentWF.prototype.isVisitSummaryOn = function() {
	return this.m_visitSummaryOn;
};

CheckoutComponentWF.prototype.setVisitSummaryLabel = function(value) {
	this.m_visitSummaryLabel = value;
};
CheckoutComponentWF.prototype.getVisitSummaryLabel = function() {
	return this.m_visitSummaryLabel;
};

CheckoutComponentWF.prototype.setVisitSummaryLink = function(value) {
	this.m_visitSummaryLink = value;
};
CheckoutComponentWF.prototype.getVisitSummaryLink = function() {
	return this.getValidatedUrl(this.m_visitSummaryLink);
};

/*
 * set and get methods for Visit Charge
 */

CheckoutComponentWF.prototype.setVisitChargeSwitch = function(value) {
	this.m_visitChargeOn = value;
};
CheckoutComponentWF.prototype.isVisitChargeOn = function() {
	return this.m_visitChargeOn;
};

CheckoutComponentWF.prototype.setVisitChargeLabel = function(value) {
	this.m_visitChargeLabel = value;
};
CheckoutComponentWF.prototype.getVisitChargeLabel = function() {
	return this.m_visitChargeLabel;
};

CheckoutComponentWF.prototype.setVisitChargeLinkSwitch = function(value) {
	this.m_visitChargeLinkOn = value;
};
CheckoutComponentWF.prototype.isLinkToChargeOn = function() {
	return this.m_visitChargeLinkOn;
};

/* Supporting functions */
/**
 * This function is used to load the filters that are associated to this component.  Each filter mapping
 * is associated to one specific component setting.  The filter mapping lets the MPages architecture know 
 * which functions to call for each filter.
 */
CheckoutComponentWF.prototype.loadFilterMappings = function(){
	/*
	 * Reading Medication reconciliation bedrock setting
	 */
	this.addFilterMappingObject("WF_CHECKOUT_MEDREC", {
		setFunction : this.setMedReconciliationSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_MEDREC_LABEL", {
		setFunction : this.setMedReconciliationLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	/*
	 * Reading Patient Education bedrock setting
	 */
	this.addFilterMappingObject("WF_CHECKOUT_PATED", {
		setFunction : this.setPatEducationSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_PATED_LABEL", {
		setFunction : this.setPatEducationLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	/*
	 * Reading Follow-up bedrock setting
	 */
	this.addFilterMappingObject("WF_CHECKOUT_FOLLOWUP", {
		setFunction : this.setFollowupSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_FOLLOWUP_LABEL", {
		setFunction : this.setFollowupLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	/*
	 * Reading Visit Note bedrock setting
	 */

	this.addFilterMappingObject("WF_CHECKOUT_NOTE", {
		setFunction : this.setVisitNoteSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_NOTE_LABEL", {
		setFunction : this.setVisitNoteLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_NOTE_LINK", {
		setFunction : this.setVisitNoteLink,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	/*
	 * Reading Visit Summary bedrock setting
	 */

	this.addFilterMappingObject("WF_CHECKOUT_SUMMARY", {
		setFunction : this.setVisitSummarySwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_SUMM_LABEL", {
		setFunction : this.setVisitSummaryLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_SUMM_LINK", {
		setFunction : this.setVisitSummaryLink,
		type : "STRING",
		field : "FREETEXT_DESC"
	});

	/*
	 * Reading Visit Charge bedrock setting
	 */

	this.addFilterMappingObject("WF_CHECKOUT_CHARGE", {
		setFunction : this.setVisitChargeSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CHECKOUT_CHARGE_LABEL", {
		setFunction : this.setVisitChargeLabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/*
	 * This is a switch to display NOE or Charge
	 */
	this.addFilterMappingObject("WF_CHECKOUT_CHARGE_LINK", {
		setFunction : this.setVisitChargeLinkSwitch,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * This is the CheckoutComponentWF implementation of the retrieveComponentData function.  
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 */
CheckoutComponentWF.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var groups = this.getGroups();
	var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
	var checkoutComponent = [];

	if (this.isMedReconciliationOn()) {
		checkoutComponent.push('\'MED_REC\'');
	}
	if (this.isPatEducationOn()) {
		checkoutComponent.push('\'WF_PFE\'');
	}
	if (this.isFollowupOn()) {
		checkoutComponent.push('\'WF_FOLLOWUP\'');
	}
	if (this.isVisitNoteOn()) {
		checkoutComponent.push('\'VISIT_NOTE\'');
	}
	if (this.isVisitSummaryOn()) {
		checkoutComponent.push('\'VISIT_SUMMARY\'');
	}
	if (this.isVisitChargeOn()) {
		checkoutComponent.push('\'WF_CHARGES\'');
	}

	if (checkoutComponent && checkoutComponent.length > 0) {

		var sendArray = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", MP_Util.CreateParamArray(events, 1), 1, "value(" + checkoutComponent.join(",") + ")"];
		MP_Core.XMLCclRequestWrapper(this, "MP_GET_CHECKOUT_STATUS", sendArray, true);
	} else {
		// throw error
		var errorHtml = MP_Core.generateUserMessageHTML("error", this.checkoutI18n.NOT_CONFIGURED_BEDROCK_ERR, "", "ckout-request-alert-msg ckout-request-msg ckout-request-blue-cross-image");
		MP_Util.Doc.FinalizeComponent(errorHtml, this, "");
	}

};

/**
 * This is the CheckoutComponentWF implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the 
 * retrieveComponentData function of this object.
 */
CheckoutComponentWF.prototype.renderComponent = function(reply) {
	try {

		var compId = this.getComponentId();
		var container = [];
		var sHTML = "";
		var self = this;
		var dataRow = [];
		var dataRowString = "";
		var maxLabelLength = 30;
		/*
		 * default value set to label is "". Hence it safe to read and
		 * assign to a variable.
		 */
		var medReconciliationLabel = this.getMedReconciliationLabel();
		var patientEduLabel = this.getPatEducationLabel();
		var followupLabel = this.getFollowupLabel();
		var visitNoteLabel = this.getVisitNoteLabel();
		var visitSummaryLabel = this.getVisitSummaryLabel();
		var visitChargeLabel = this.getVisitChargeLabel();

		/*
		 * Register event listener.
		 * This is called when a checkout component is clicked and corresponding
		 * component is not available in the navigator.
		 */

		CERN_EventListener.addListener(this, EventListener.EVENT_NAVIGATOR_ERR, this.onCheckoutNavigationErr, this);

		var checkoutStatus = this.setCheckoutIndicators(reply);

		container.push("<div class='", MP_Util.GetContentClass(this, "1"), "'>");

		dataRow.push("<div align='center' class='ckout-container'>");
		/*
		 * check if Medication Reconciliation is on
		 */
		if (this.isMedReconciliationOn()) {
			/*
			 * Check the context of execution - Browser or millennium.
			 * If Browser hide the hyperlink
			 * 
	 		 * Restrict the label to 30 chars and add ellipsis faceup.
			 * Display full label in hover			 
			 */
			
			var medRecLengthFormattedLabel = this.getLengthFormattedLabel(medReconciliationLabel);			
			var medRecFaceupLabel = this.getValidatedLabel(medRecLengthFormattedLabel);			

			if (CERN_Platform.inMillenniumContext()) {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isMedReconciliationComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isMedReconciliationComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div id= '", "medRecon" + compId, "' title ='",(medReconciliationLabel.length > maxLabelLength )? this.getValidatedLabel(medReconciliationLabel):"" ,"'><span class='ckout-text'>", medRecFaceupLabel, "</span></div></div>");
			} else {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isMedReconciliationComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isMedReconciliationComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div title ='", (medReconciliationLabel.length > maxLabelLength )? this.getValidatedLabel(medReconciliationLabel):"" ,"' ><span>", medRecFaceupLabel, "</span></div></div>");
			}

		}
		/*
		 * check if Patient Education is on
		 */
		if (this.isPatEducationOn()) {
			/*
	 		 * Restrict the label to 30 chars and add ellipsis faceup.
			 * Display full label in hover
			 */
			var patientEduLengthFormattedLabel = this.getLengthFormattedLabel(patientEduLabel);			
			var patEduFaceupLabel = this.getValidatedLabel(patientEduLengthFormattedLabel);

			dataRow.push("<div class='ckout-comp ", (checkoutStatus.isPatEducationComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isPatEducationComplete) ? "ckout-complete " : "ckout-incomplete", "'></div><div id= '", "patSum" + compId, "' title ='",(patientEduLabel.length > maxLabelLength )? this.getValidatedLabel(patientEduLabel):"","'><span class='ckout-text'>", patEduFaceupLabel, "</span></div></div>");
		}
		/*
		 * check if Follow Up is on
		 */
		if (this.isFollowupOn()) {
		
			var FollowupLengthFormattedLabel = this.getLengthFormattedLabel(followupLabel);			
			var followupFaceupLabel = this.getValidatedLabel(FollowupLengthFormattedLabel);

			/*
	 		 * Restrict the label to 30 chars and add ellipsis faceup.
			 * Display full label in hover
			 */
			dataRow.push("<div class='ckout-comp ", (checkoutStatus.isFollowupComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isFollowupComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div id='", "followUp" + compId, "' nameSpace='fu-o2' title ='",(followupLabel.length > maxLabelLength )? this.getValidatedLabel(followupLabel):"","'><span class='ckout-text' >", followupFaceupLabel, "</span></div></div>");
			
		}
		/*
		 * check if Visit Note is on
		 */
		if (this.isVisitNoteOn()) {
			var visitNoteLengthFormattedLabel = this.getLengthFormattedLabel(visitNoteLabel);			
			var visitNoteFaceupLabel = this.getValidatedLabel(visitNoteLengthFormattedLabel);

			/*
			 * Check the context of execution - Browser or millennium.
			 * If Browser hide the hyperlink.
			 * Restrict the label to 30 chars and add ellipsis faceup.
			 * Display full label in hover			  
			 */

			if (CERN_Platform.inMillenniumContext()) {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isVisitNoteComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isVisitNoteComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div  id= '", "visitNote" + compId, "' title='",(visitNoteLabel.length > maxLabelLength )? this.getValidatedLabel(visitNoteLabel):"","'><span class='ckout-text' >", visitNoteFaceupLabel, "</span></div></div>");
			} else {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isVisitNoteComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isVisitNoteComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div title='",(visitNoteLabel.length > maxLabelLength )? this.getValidatedLabel(visitNoteLabel):"","'><span>", visitNoteFaceupLabel, "</span></div></div>");
			}

		}
		/*
		 * check if Visit Summary is on
		 */
		if (this.isVisitSummaryOn()) {
			var VisitSummLengthFormattedLabel = this.getLengthFormattedLabel(visitSummaryLabel);			
			var visitSummaryFaceupLabel = this.getValidatedLabel(VisitSummLengthFormattedLabel);

			/*
			 * Check the context of execution - Browser or millennium.
			 * If Browser hide the hyperlink
			 * Restrict the label to 30 chars and add ellipsis faceup.
		 	 * Display full label in hover
			 */

			if (CERN_Platform.inMillenniumContext()) {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isVisitSummaryComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isVisitSummaryComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div id='", "visitSum" + compId, "' title='",(visitSummaryLabel.length > maxLabelLength )? this.getValidatedLabel(visitSummaryLabel):"","'><span class='ckout-text' >", visitSummaryFaceupLabel, "</span></div></div>");
			} else {
				dataRow.push("<div class='ckout-comp ", (checkoutStatus.isVisitSummaryComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isVisitSummaryComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div title='",(visitSummaryLabel.length > maxLabelLength )? this.getValidatedLabel(visitSummaryLabel):"","'><span>", visitSummaryFaceupLabel, "</span></div></div>");
			}

		}
		/*
		 * check if Visit Charge is on.
		 * Restrict the label to 30 chars and add ellipsis faceup.
		 * Display full label in hover
		 */
		if (this.isVisitChargeOn()) {

			var VisitChargeLengthFormattedLabel = this.getLengthFormattedLabel(visitChargeLabel);			
			var visitChargeFaceupLabel = this.getValidatedLabel(VisitChargeLengthFormattedLabel);

			dataRow.push("<div class='ckout-comp ", (checkoutStatus.isVisitChargeComplete) ? "ckout-complete-bgcolour " : "ckout-incomplete-bgcolour", "'><div class='", (checkoutStatus.isVisitChargeComplete) ? "ckout-complete" : "ckout-incomplete", "'></div><div id='", "charge" + compId, "' title='",(visitChargeLabel.length > maxLabelLength )? this.getValidatedLabel(visitChargeLabel):"","'><span class='ckout-text' >", visitChargeFaceupLabel, "</span></div></div>");
		}

		dataRowString = dataRow.join("");
		container.push(dataRowString, "</div>");

		sHTML = container.join("");

		MP_Util.Doc.FinalizeComponent(sHTML, this, "");

		/*
		 * Trigger handleClick function to handle click event
		 */
		$("#patSum" + compId).on("click", {
			nameSpace : "pe-o2",
			self : this
		}, this.handleClick);
		$("#followUp" + compId).on("click", {
			nameSpace : "fu-o2",
			self : this
		}, this.handleClick);
		$("#charge" + compId).on("click", {
			nameSpace : "charge",
			self : this
		}, this.handleClick);
		$("#medRecon" + compId).on("click", {
			nameSpace : "medRecon",
			self : this
		}, this.handleClick);
		$("#visitNote" + compId).on("click", {
			nameSpace : "visitNote",
			self : this
		}, this.handleClick);
		$("#visitSum" + compId).on("click", {
			nameSpace : "visitSum",
			self : this
		}, this.handleClick);

	} catch(err) {
		MP_Util.LogJSError(this, err, "checkout-o1.js", "renderComponent");
	} finally {
		// do nothing.
	}
};

/**
 * Function to set the status of checkout components..
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
CheckoutComponentWF.prototype.setCheckoutIndicators = function(reply) {

	var scriptReplyComponent = reply.COMPONENTS;
	var checkout = {
		isFollowupComplete : false,
		isPatEducationComplete : false,
		isMedReconciliationComplete : false,
		isVisitNoteComplete : false,
		isVisitSummaryComplete : false,
		isVisitChargeComplete : false
	};

	if (scriptReplyComponent) {
		
		for (var x=scriptReplyComponent.length; x--;){

			switch(scriptReplyComponent[x].MEANING) {

				case "WF_FOLLOWUP":
					checkout.isFollowupComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				case "WF_PFE":
					checkout.isPatEducationComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				case "MED_REC":
					checkout.isMedReconciliationComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				case "VISIT_NOTE":
					checkout.isVisitNoteComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				case "VISIT_SUMMARY":
					checkout.isVisitSummaryComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				case "WF_CHARGES":
					checkout.isVisitChargeComplete = (scriptReplyComponent[x].STATUS_FLAG === 1) ? true : false;
					break;
				default:
					alert("No components used within the Checkout Component are mapped to this view.");
			}

		}

	}

	return checkout;

};
/**
 * Function to handle click event.
 * @param{event} click event from user interaction.
 */
CheckoutComponentWF.prototype.handleClick = function(event) {
	var nameSpace = event.data.nameSpace;
	var self = event.data.self;
	var criterion = self.getCriterion();

	switch(nameSpace) {
		/*
		 * Same event handling for patient education and follow up components.
		 */
		case "pe-o2":	// patient education
		case "fu-o2":	// follow up
			CERN_EventListener.fireEvent(self, self, EventListener.EVENT_SCROLL, nameSpace);
			break;

		case "charge":
			// check what component to link to - NOE or CHARGE
			var nameSpce = (self.isLinkToChargeOn()) ? "charges" : "noe2";
			CERN_EventListener.fireEvent(self, self, EventListener.EVENT_SCROLL, nameSpce);
			break;
		// medical reconciliation.
		case "medRecon":
			var medReconciliationObject = {};
			try {
				MP_Util.LogDiscernInfo(self, "ORDERS", "checkout.js", "handleClick");
				medReconciliationObject = window.external.DiscernObjectFactory("ORDERS");
				medReconciliationObject.PersonId = criterion.person_id;
				medReconciliationObject.EncntrId = criterion.encntr_id;
				medReconciliationObject.reconciliationMode = 3;		//Discharge
				medReconciliationObject.defaultVenue = self.getDischargeMedCode();
				medReconciliationObject.LaunchOrdersMode(2, 0, 0);	//2 -  Meds Rec
			} catch(err) {
				MP_Util.LogJSError(err, null, "checkout.js", "handleClick");
			}
			break;

		case "visitNote":
			APPLINK(0, "powerchart.exe", "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + "/FIRSTTAB=^" + self.getVisitNoteLink() + "^");
			break;

		case "visitSum":
			APPLINK(0, "powerchart.exe", "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + "/FIRSTTAB=^" + self.getVisitSummaryLink() + "^");
			break;

		case "default":
			// do nothing
			break;
	}

};
/**
 * Handle event function to  when user clicks of Checkout component link
 * and corresponding component in the navigator is missing or not configured.
 * @param {component}	checkout component.
 * @param{args}		component name space.
 */
CheckoutComponentWF.prototype.onCheckoutNavigationErr = function(component, args) {
	/*
	 * check the name space and get the appropriate label from bedrock.
	 */
	var componentLabel = "";

	switch(args) {
		case "pe-o2":
			// patient education
			componentLabel = this.getPatEducationLabel();
			break;
		case "fu-o2":
			// follow up
			componentLabel = this.getFollowupLabel();
			break;
		case "charges":
		case "noe2":
			componentLabel = this.getVisitChargeLabel();
			break;
		default:
			componentLabel = "";
	}
	
	try {
		var errorMessage = this.checkoutI18n.NOT_CONFIGURED_NAVIGATOR_ERR.replace("{0}", this.getValidatedLabel(componentLabel));
		var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");

		if (!errorModal) {
			errorModal = MP_Util.generateModalDialogBody("errorModal", "error", errorMessage, "");
			errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
			var closeButton = new ModalButton("closeButton");
			closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
			errorModal.addFooterButton(closeButton);
		} else {
			// reset the error message else old message would be displayed.
			errorModal = MP_Util.generateModalDialogBody("errorModal", "error", errorMessage, "");
		}

		MP_ModalDialog.updateModalDialogObject(errorModal);
		MP_ModalDialog.showModalDialog("errorModal");
		
	} catch(err) {
		MP_Util.LogJSError(this, err, "checkout-o1.js", "onCheckoutNavigationErr");
	}


};
/**
 * Function to handle special chars  
 * @param {label}	checkout label
 * @returns {string} formated label
 * @throws {TypeError}  if input label is NOT a String
 */
CheckoutComponentWF.prototype.getValidatedLabel = function(label) {
	var tempObj = null;

	if (label && typeof label === "string") {		
		//Force jQuery to interpret the S as HTML so it will convert the ASCII codes to characters
		tempObj = $("<div>").html(label);
		return tempObj.html();
	} else {
		throw new TypeError("Invalid input Label!");
	}
};

/**
 * Function to check number of chars
 *  and add ellipsis for long labels.
 *
 * @param {label}	checkout label
 * @returns {string} formated label
 * @throws {TypeError}  if input label is NOT a String
 */
CheckoutComponentWF.prototype.getLengthFormattedLabel = function(label) {
	
	var componentLabel = label;
	var maxLabelLength = 30;// max 30 chars

	if (label && typeof label === "string") {	

		if (label.length > maxLabelLength) {
			//restrict the label to 30 characters and add ellipsis
			componentLabel = label.substr(0, maxLabelLength) + "...";
		}
		return componentLabel;

	} else {
		throw new TypeError("Invalid input Label! ");
	}
};
/**
 * Function to check special char in URL
 *
 * @param {label}	checkout label.
 * @returns {string} formated URL 
 * @throws {TypeError}  if input label is NOT a String
 */

CheckoutComponentWF.prototype.getValidatedUrl = function(label) {
	var tempObj = null;

	if (label && typeof label === "string") {
		//Force jQuery to interpret the S as HTML so it will convert the ASCII codes to characters
		tempObj = $("<div>").html(label);
		//Cleanup special characters
		return tempObj.html().replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">");

	} else {
		throw new TypeError("Invalid input Label! ");
	}
};

MP_Util.setObjectDefinitionMapping("WF_CHECKOUT", CheckoutComponentWF);
