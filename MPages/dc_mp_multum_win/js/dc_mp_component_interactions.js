//StubComponent -> inherits -> MpageComponent;
// Specify Component Methods
var InteractionsComponent = function(meaning){
    /**
     * NOTE: self.meaning, self.load, self.loadJsonData are REQUIRED for the component to load properly.
     * 		 Additional methods may be declared  to fill out the content inside the component
     * 		 self.dataListener is required if this component is expected to be called from another component
     */
    // self preserves the reference to the component instance
    var m_jsonUtil = new UtilJsonXml();
	var m_overrideReasons = [];
	var m_isDisplayOnly = 0;

    var self = this;
    self.meaning = meaning;
    self.defaultLoad = true;
	
    self.load = function(criterion){
	    self.setCriterion(criterion);
	    //Page will have m_AlertData ready for use	
	    var jsonAlertData = m_jsonUtil.parse_json(m_AlertDataJSON);
	    self.loadJsonData(jsonAlertData);
    };
	
    self.loadJsonData = function(jsonData){
    
        //alert(m_jsonUtil.stringify_json(jsonData));
        var alertData = jsonData.ALERTDATA
		var contentHTML = [];
		var sectionHTML = "";
        //Tab delimited list of override reasons split into an array
        m_overrideReasons = alertData.OVERRIDE_REASONS
		m_isDisplayOnly = alertData.IS_DISPLAY_ONLY;
      
        // finishedLoading called to clear out any existing loading indicators..rft
        self.finishedLoading();
        // clear any existing content
        self.clearContentHTML()
        // append content HTML
		contentHTML.push("<div class='sec-content'>")
		try {
			switch (self.meaning) {
				case "Interaction-Alg":					
					contentHTML.push(buildAllergy(alertData));				
					break;
				case "Interaction-DrugDrug":
					contentHTML.push(buildDrugDrug(alertData));
					break;
				case "Interaction-DrugFood":
					contentHTML.push(buildDrugFood(alertData));
					break;
				case "Interaction-DupTherapy":
					contentHTML.push(buildDuplicateTherapry(alertData));
					break;
				default:
					var donothing = 1;
			}
		} 
		catch (err) {
			contentHTML.push(buildErrorMessage(err));
		}
		     
		contentHTML.push("</div>");
        
        self.appendContentHTML(contentHTML.join(""));
        
        
    }
	
   
	
	function buildErrorMessage(err){
		return("<b>JavaScript Error</b><br /><ul><li>"
					+ "Message: " + err.message + "</li><li>"
					+ "Name: " + err.name + "</li><li>"
					+ "Number: "+ (err.number & 0xFFFF)
					+"</li><li>Description: " + err.description + "</li></ul>");
	}
    
    function buildOverrideDropDown( interaction, overRideReasonList){
   		
		var orHtml = [];
		var previousOverrideReason = interaction.PREV_OVERRIDE_REASON;
		var previousOverrideReasonCd = interaction.PREV_OVERRIDE_REASON_CD;
		if (m_isDisplayOnly == 1) {
			orHtml.push(previousOverrideReason)
		}
		else {
			var orSelectClass = 'inter-or-reason ';
			
			if (previousOverrideReason) {
				orHtml.push("<span> Previous: </span> <span>", previousOverrideReason, "</span><br/>");
			}
			if (interaction.IS_OVERRIDE_REQUIRED == 1) {
				orSelectClass += ' inter-or-required ';
			}
			orHtml.push("<select class='", orSelectClass, "'>");
			orHtml.push("<option >&nbsp;</option>");
			if (previousOverrideReason) {
				orHtml.push("<option value='", interaction.SUBJECT_ENTITY_ID, "|", interaction.CAUSING_ENTITY_ID, "|", previousOverrideReasonCd, "'> Accept previous Override Reason </option ");
			}
			for (var i = 0, il = overRideReasonList.length; i < il; i++) {
			
				if (overRideReasonList[i].REASON_CD == previousOverrideReasonCd) {
					orHtml.push("<option selected='selected' value='", interaction.SUBJECT_ENTITY_ID, "|", interaction.CAUSING_ENTITY_ID, "|", overRideReasonList[i].REASON_CD, "' >", overRideReasonList[i].REASON_DISP, "</option>");
				}
				else {
					orHtml.push("<option value='", interaction.SUBJECT_ENTITY_ID, "|", interaction.CAUSING_ENTITY_ID, "|", overRideReasonList[i].REASON_CD, "' >", overRideReasonList[i].REASON_DISP, "</option>");
				}
			}
			orHtml.push("</select>");
		}
        return orHtml.join("");
    }
    
    function buildAllergy(alertdata){
         //Default in case nothing is found
		var interactions = alertdata.INTERACTIONS
        var interHTML = [];
        var interactionTypes = ["AllergyDrug", "DrugAllergy"];
        var interLength = interactions.length;
		var interCount = 0;
		var interStripeClass = "";
		
        if (interLength > 0) {
			//Build Header
			interHTML.push("<dl class='interaction hdr'>"
				,"<dt><span>text</span></dt>"
				,"<dd class='inter-sev-res'><span>Severity</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-alg-res'><span>Allergy</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-sub-res'><span>Medication</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-adet-res'><span>Details</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-reac-res'><span>Reaction Type</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-com-res'><span>Allergy Comments</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-or-res'><span>Override Reason</span></dd>"
				,"</dl>");
			//Build Body
            for (var i = 0, il = interLength; i < il; i++) {
                if ((interactions[i].INTERACTION_TYPE == interactionTypes[0] || interactions[i].INTERACTION_TYPE == interactionTypes[1] )  && interactions[i].ADDITIONAL_INFO != "INTFILTERED"   ) {
                    //Build HTML for DrugDrug
                    interCount++;
					if(interCount % 2){
						interStripeClass = "even";
					}
					else{
						interStripeClass = "odd";
					}
					
					var orderDets = interactions[i].ORDER_DETAILS ? interactions[i].ORDER_DETAILS : "&nbsp;"
					var substance = "", substanceCki = "";
					var allergy = "", allergyEntityId = "";
					var orderId = "";
					var source = "";
					var reactionType = "";
					var catalogCd = "0";
					var confSpanClass = "";
					var confSpanDetsClass = "";
					var severity = interactions[i].SEVERITY_LEVEL.length > 0 ? interactions[i].SEVERITY_LEVEL : "Allergy";
					
					if(interactions[i].IS_ALLERGY_HIDDEN == 1){
						//This will be used to identify confidential information
						//Will put original data in span but then display none. Will show if button is clicked.
						confSpanClass = " inter-conf-info";	
					}
					
					if(interactions[i].IS_ORDER_HIDDEN){
							confSpanDetsClass = " inter-conf-info"
						}
					
					if(interactions[i].INTERACTION_TYPE == interactionTypes[1]){
						substance = interactions[i].SUBJECT_ENTITY_NAME;
						catalogCd = interactions[i].SUBJECT_CATALOG_CD
						substanceCki = interactions[i].SUBJECT_ENTITY_CKI;
						allergy = interactions[i].CAUSING_ENTITY_NAME;
						allergyEntityId = interactions[i].CAUSING_ENTITY_ID;
						orderDets =	alertdata.TRIGGERING_ORDER.ORDER_DETAILS;
						orderId = interactions[i].SUBJECT_ENTITY_ID;
						source = interactions[i].ALLERGY_SOURCE;
						reactionType = interactions[i].ALLERGY_REACTION_TYPE;
					}
					else if(interactions[i].INTERACTION_TYPE == interactionTypes[0]){
						substance = interactions[i].CAUSING_ENTITY_NAME;
						substanceCki = interactions[i].CAUSING_ENTITY_CKI;
						catalogCd = interactions[i].CAUSING_CATALOG_CD
						if (interactions[i].SUBJECT_ENTITY_NAME == "") {
							allergy = alertdata.TRIGGERING_ALLERGY.ALLERGY_NAME;
							source = alertdata.TRIGGERING_ALLERGY.ALLERGY_SOURCE;
							reactionType = alertdata.TRIGGERING_ALLERGY.ALLERGY_REACTION_TYPE;
							allergyEntityId = 0.0
							
						}
						else {
							allergy = interactions[i].SUBJECT_ENTITY_NAME
							allergyEntityId = interactions[i].SUBJECT_ENTITY_ID;
							source = interactions[i].ALLERGY_SOURCE;
							reactionType = interactions[i].ALLERGY_REACTION_TYPE;
						}
						allergyEntityId = interactions[i].SUBJECT_ENTITY_ID;
						orderId = interactions[i].CAUSING_ENTITY_ID;
					}
					
					var severityClass = interactions[i].SEVERITY_LEVEL == "Major-Contraindicated" ? "res-severe": "res-normal";
                    interHTML.push("<dl class='interaction ", interStripeClass, "'>", "<dd class='inter-sev-res alg'>"
						,"<span>", severity, "</span></dd>"
						,"<dd class='inter-alg-res'><span class='", confSpanClass, "' ><a class='int-alg-ref'>", allergy, "<span class='inter-det-info'>",allergyEntityId," </span></a></span></dd>"
						,"<dd class='inter-sub-res'><span class='", confSpanDetsClass, "'>",buildOrderTypeImage(interactions[i]),"<a class='inter-ref'>",substance,"<span class='inter-det-info'>",substanceCki,"|",orderId, "|", substance,"|",catalogCd, "|", alertdata.PERSON_ID, "|", alertdata.ENCNTR_ID, "  </span></a></span></dd>"
						,"<dd class='inter-adet-res'><span class='inter-order-dets", confSpanDetsClass, "'>", orderDets, "</span><div class='inter-desc-info-det'>",orderId,"|", interactions[i].ORDERING_PHYSICIAN  , "</div></dd>"
						,"<dd class='inter-reac-res'><span class='", confSpanClass, "' >", reactionType, "</span></dd>"
						,"<dd class='inter-com-res'><span class='", confSpanClass, "' >",interactions[i].ALLERGY_COMMENTS, "</span></dd>"			
						,"<dd class='inter-or-res'>", buildOverrideDropDown( interactions[i], alertdata.OVERRIDE_ALLERGY), "</dd>"
						,"</dl>");
					interHTML.push("<dl class='interaction ", interStripeClass, "'>"
						,"<dd class='inter-sec-res'>&nbsp;</dd><dd ><span class='", confSpanClass, "'><span class='inter-text-lbl'> Reaction Symptoms:</span><span class='inter-alg-text'>", interactions[i].ALLERGY_REACTIONS , "</span>;<span class='inter-text-lbl'>Source:</span><span class='inter-alg-text' >", source,"  </span></span></dd>"
						,"</dl>");
					interHTML.push("<div style='clear:both'></div>");
                }
            }
        }
		if(interCount == 0){
			//Overwrite header
			interHTML = ["No Interactions found"];
		}
	
		//Update Header coutn + link to allergy profile
		self.componentHyperLinkDOM.innerHTML += " (" + interCount + ")";
		
		return(interHTML.join(""));
    }
    
    function buildDrugDrug(alertdata){
        //Default in case nothing is found
		var interactions = alertdata.INTERACTIONS
        var interHTML = [];
        var interactonType = "DrugDrug";
        var interLength = interactions.length;
		var interCount = 0;
		var interStripeClass = "";
		var confSpanClass = "";
        if (interLength > 0) {
			//Build Header
			interHTML.push("<dl class='interaction hdr'>"
				,"<dt><span>text</span></dt>"
				,"<dd class='inter-sev-res'><span>Severity</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-dsub-res'><span>Medication</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-det-res'><span>Details</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-stat-res'><span>Status</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-res'><span>Interaction Information</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-or-res'><span>Override Reason</span></dd>"
				,"</dl>");
			//Build Body
            for (var i = 0, il = interLength; i < il; i++) {
                if (interactions[i].INTERACTION_TYPE == interactonType && interactions[i].ADDITIONAL_INFO != "INTFILTERED") {
                    //Build HTML for DrugDrug
                    interCount++;
					if(interCount % 2){
						interStripeClass = "even";
					}
					else{
						interStripeClass = "odd";
					}
					
					var orderDets = interactions[i].ORDER_DETAILS ? interactions[i].ORDER_DETAILS : "&nbsp;"
					var orderStatusDtDisp  = "";
					var orderStatusDt = new Date();
					var confSpanClass = "";
					if (interactions[i].ORDER_STATUS_DATE) {
						orderStatusDt.setISO8601(interactions[i].ORDER_STATUS_DATE);
						orderStatusDtDisp = orderStatusDt.format("longDateTime2");
					}
					
					if(interactions[i].IS_ORDER_HIDDEN == 1){
						//This will be used to identify confidential information
						//Will put original data in span but then display none. Will show if button is clicked.
						confSpanClass = " inter-conf-info";
					}
					
					var severityClass = interactions[i].SEVERITY_LEVEL == "Major-Contraindicated" ? "res-severe": "res-normal";
                    interHTML.push("<dl class='interaction ", interStripeClass, "'>", "<dd class='inter-sev-res'>"
						,"<span class='",severityClass, "'>", interactions[i].SEVERITY_LEVEL, "</span></dd>"
						,"<dd class='inter-dsub-res'><span class='", confSpanClass, "'>",buildOrderTypeImage(interactions[i]),"<a class='inter-ref'>",interactions[i].CAUSING_ENTITY_NAME,"<span class='inter-det-info'>",interactions[i].CAUSING_ENTITY_CKI,"|",interactions[i].CAUSING_ENTITY_ID,"|", interactions[i].CAUSING_ENTITY_NAME, "|",interactions[i].CAUSING_CATALOG_CD, "|", alertdata.PERSON_ID, "|", alertdata.ENCNTR_ID," </span></a></span></dd>"
						,"<dd class='inter-det-res'><span class='inter-order-dets", confSpanClass,"'>", orderDets, "</span><div class='inter-desc-info-det'>",interactions[i].CAUSING_ENTITY_ID,"|", interactions[i].ORDERING_PHYSICIAN ," </div></dd>"
						,"<dd class='inter-stat-res'><span>", interactions[i].ORDER_STATUS, "<br/>", orderStatusDtDisp,"</span></dd>"
						,"<dd class='inter-res'><span class='", confSpanClass, "'><a class='inter-info'>",interactions[i].SUBJECT_COMPONENT_NAME , "-", interactions[i].CAUSING_COMPONENT_NAME, "</a><div class='inter-desc-info-det'><div class='inter-desc'>"
						, /*interactions[i].INTERACTION_DESC.replace(/\n\n/gi, "</div><div class='inter-desc'>")*/getDescription(interactions[i]).replace(/\n\n/gi, "</div><div class='inter-desc'>"), "</div></div></span></dd>"
						,"<dd class='inter-or-res'>",buildOverrideDropDown( interactions[i], alertdata.OVERRIDE_DRUGDRUG), "</dd>"
						,"</dl>");
					interHTML.push("<div style='clear:both'></div>");
                }
            }
        }
		if(interCount == 0){
			//Overwrite header
			interHTML = ["No Interactions found"];
		}
		else{
			//Update Header count
			self.componentHyperLinkDOM.innerHTML += " (" + interCount + ")";
		}
		return(interHTML.join(""));
    }
	
    
    
    function buildDrugFood(alertdata){
        //Default in case nothing is found
		var interactions = alertdata.INTERACTIONS
        var interHTML = [];
        var interactonType = "DrugFood";
        var interLength = interactions.length;
		var interCount = 0;
		var interStripeClass = "";
        if (interLength > 0) {
			//Build Header
			interHTML.push("<dl class='interaction hdr'>"
				,"<dt><span>text</span></dt>"
				,"<dd class='inter-sev-res'><span>Severity</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-fsub-res'><span>Medication</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-fres'><span>Interaction Information</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-or-res'><span>Override Reason</span></dd>"
				,"</dl>");
			//Build Body

            for (var i = 0, il = interLength; i < il; i++) {
                if (interactions[i].INTERACTION_TYPE == interactonType && interactions[i].ADDITIONAL_INFO != "INTFILTERED") {
                    //Build HTML for DrugDrug
                    interCount++;
					if(interCount % 2){
						interStripeClass = "even";
					}
					else{
						interStripeClass = "odd";
					}
					
					var orderDets = interactions[i].ORDER_DETAILS ? interactions[i].ORDER_DETAILS : "&nbsp;"
					var severityClass = interactions[i].SEVERITY_LEVEL == "Major-Contraindicated" ? "res-severe": "res-normal";
					var confSpanClass = "";
					if(interactions[i].IS_ORDER_HIDDEN == 1){
						//This will be used to identify confidential information
						//Will put original data in span but then display none. Will show if button is clicked.
						confSpanClass = " inter-conf-info";
					}		
                    interHTML.push("<dl class='interaction ", interStripeClass, "'>", "<dd class='inter-sev-res'>"
						,"<span class='",severityClass, "'>", interactions[i].SEVERITY_LEVEL, "</span></dd>"
						,""
						,"<dd class='inter-fsub-res'><span class='",confSpanClass, "'>",buildOrderTypeImage(interactions[i]),interactions[i].CAUSING_ENTITY_NAME, "</span></dd>"
						,"<dd class='inter-fres'><span class='",confSpanClass, "'><a class='inter-info'>",interactions[i].SUBJECT_COMPONENT_NAME , "-", interactions[i].CAUSING_ENTITY_NAME, "</a><div class='inter-desc-info-det'><div class='inter-desc'>", getDescription(interactions[i]).replace(/\n\n/gi, "</div><div class='inter-desc'>"), "</div></div></span></dd>"
						,"<dd class='inter-or-res'>",  buildOverrideDropDown( interactions[i] , alertdata.OVERRIDE_DRUGFOOD), "</dd>"
						,"</dl>");
					interHTML.push("<div style='clear:both'></div>");
                }
            }
        }
		if (interCount == 0) {
			//Overwrite header
			interHTML = ["No Interactions found"];
		}
		else {
			//Update Header count
			self.componentHyperLinkDOM.innerHTML += " (" + interCount + ")";
		}
		return(interHTML.join(""));
    }
    
    function buildDuplicateTherapry(alertdata){
		var interactions = alertdata.INTERACTIONS
         var interHTML = [];
        var interactonType = "DuplicateTherapy";
        var interLength = interactions.length;
		var interCount = 0;
		var interStripeClass = "";
        if (interLength > 0) {
			//Build Header
			interHTML.push("<dl class='interaction hdr'>"
				,"<dt><span>text</span></dt>"
				,"<dd class='inter-sev-res'><span>Severity</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-dsub-res'><span>Medication</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-det-res'><span>Details</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-stat-res'><span>Status</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-res'><span>Interaction Information</span></dd>"
				,"<dt>text</dt>"
				,"<dd class='inter-or-res'><span>Override Reason</span></dd>"
				,"</dl>");
			//Build Body
            for (var i = 0, il = interLength; i < il; i++) {
				//alert("LOOPING");
                if (interactions[i].INTERACTION_TYPE == interactonType && interactions[i].ADDITIONAL_INFO != "INTFILTERED") {
                    //Build HTML for DrugDrug
                    interCount++;
					if(interCount % 2){
						interStripeClass = "even";
					}
					else{
						interStripeClass = "odd";
					}
					var orderStatusDtDisp  = "";
					var orderStatusDt = new Date();
					if (interactions[i].ORDER_STATUS_DATE) {
						orderStatusDt.setISO8601(interactions[i].ORDER_STATUS_DATE);
						orderStatusDtDisp = orderStatusDt.format("longDateTime2");
					}
					var confSpanClass = "";
					if(interactions[i].IS_ORDER_HIDDEN == 1){
						//This will be used to identify confidential information
						//Will put original data in span but then display none. Will show if button is clicked.
						confSpanClass = " inter-conf-info";
					}
					
					var orderDets = interactions[i].ORDER_DETAILS ? interactions[i].ORDER_DETAILS : "&nbsp;"
					var sevLevel = 	interactions[i].SEVERITY_LEVEL ? interactions[i].SEVERITY_LEVEL : "Duplicate";
					var severityClass = interactions[i].SEVERITY_LEVEL == "Major-Contraindicated" ? "res-severe": "res-normal";
					var faceupCausingName = interactions[i].ORDERED_AS ? interactions[i].ORDERED_AS : interactions[i].CAUSING_ENTITY_NAME
					
                    interHTML.push("<dl class='interaction ", interStripeClass, "'>", "<dd class='inter-sev-res'>"
						,"<span class='",severityClass, "'>", sevLevel, "</span></dd>"
						,"<dd class='inter-dsub-res'><span class='", confSpanClass, "'>",buildOrderTypeImage(interactions[i]),"<a class='inter-ref'>",faceupCausingName,"<span class='inter-det-info'>",interactions[i].CAUSING_ENTITY_CKI,"|",interactions[i].CAUSING_ENTITY_ID,"|", interactions[i].CAUSING_ENTITY_NAME, "|",interactions[i].CAUSING_CATALOG_CD, "|", alertdata.PERSON_ID, "|", alertdata.ENCNTR_ID," </span></a></span></dd>"
						,"<dd class='inter-det-res'><span class='inter-order-dets", confSpanClass,"'>", orderDets, "</span><div class='inter-desc-info-det'>",interactions[i].CAUSING_ENTITY_ID,"|", interactions[i].ORDERING_PHYSICIAN ," </div></dd>"
						,"<dd class='inter-stat-res'><span>", interactions[i].ORDER_STATUS,"<br/>", orderStatusDtDisp,"</span></dd>"
						,"<dd class='inter-res'><span class='", confSpanClass,"'><a class='inter-info'>",interactions[i].SUBJECT_COMPONENT_NAME , "-", interactions[i].CAUSING_COMPONENT_NAME, "</a><div class='inter-desc-info-det'>", interactions[i].INTERACTION_DESC, "</div></span></dd>"
						,"<dd class='inter-or-res'>",  buildOverrideDropDown( interactions[i], alertdata.OVERRIDE_DUPTHERAPY), "</dd>"
						,"</dl>");
					interHTML.push("<div style='clear:both'></div>");
                }
            }
        }
		if(interCount == 0){
			//Overwrite header
			interHTML = ["No Interactions found"];
		}
		else{
			//Update Header count
			self.componentHyperLinkDOM.innerHTML += " (" + interCount + ")";
		}
		return(interHTML.join(""));
    }
	
	function buildOrderTypeImage(interaction){
        var imgType = "", imgClass = "", imageHtml = [];
		//Determine if interacting substance was Rx or Hx
        if (interaction.ORDERED_AS_FLAG == 1 || interaction.ORDERED_AS_FLAG == 2 || interaction.ORDER_VENUE_TYPE == "PrescriptionOrder") {
            if (interaction.ORDERED_AS_FLAG == 2) {
                imgType = '3796_16.gif';
                imgClass = 'inter-hx';
            }
            else 
                if (interaction.ORDERED_AS_FLAG == 1 || interaction.ORDER_VENUE_TYPE == "PrescriptionOrder") {
                    imgType = '3621.gif';
                    imgClass = 'inter-rx';
                }
            
            var imageHtml = ["<img src='", m_StaticContentLoc, "\\images\\", imgType, "' alt='' class='", imgClass, "' />"];
        }
		return(imageHtml.join(""));
    }
	
    function getDescription( interaction){
        var dCausingId = interaction.CAUSING_ENTITY_ID;
        var dSubjectId = interaction.SUBJECT_ENTITY_ID;
	    var sDescText = "";
        var formObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
        if (null != formObject) {
            sDescText = formObject.DiscernGetInteractionDesc(dCausingId, dSubjectId);
           
        }
        else {
            alert("Failed to initialize DISCERNMULTUMCOM!");
        }
		 return(sDescText);
    }

    
};


// inherit properties of MpageComponent
InteractionsComponent.inherits(MpageComponent);
// Register the component to the layout
function instantiateNeededComponents(prefs){
    var regComponents = [];
	var algCount = 0;
	for(var i =  prefs.INTERACTIONS.length; i--; ){
		if(prefs.INTERACTIONS[i].INTERACTION_TYPE == "DrugAllergy" || prefs.INTERACTIONS[i].INTERACTION_TYPE == "AllergyDrug" ){
			algCount++;
		}
	}
    if (prefs.MULREAT || algCount > 0) {
        regComponents.push({
            "component": new InteractionsComponent("Interaction-Alg")
        })
    }
	if (prefs.MULINTR) {
        regComponents.push({
            "component":  new InteractionsComponent("Interaction-DrugDrug")
        })
    }
	if (prefs.MULDFINTR) {
        regComponents.push({
            "component":  new InteractionsComponent("Interaction-DrugFood")
        })
    }
	if (prefs.MULDUP) {
        regComponents.push({
            "component": new InteractionsComponent("Interaction-DupTherapy")
        })
    }
    
	MpageDriver.register(regComponents);
}


