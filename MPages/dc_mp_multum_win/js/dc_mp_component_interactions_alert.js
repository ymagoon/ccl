//StubComponent -> inherits -> MpageComponent;
// Specify Component Methods
var InteractionsAlertComp = function(meaning){
    /**
     * NOTE: self.meaning, self.load, self.loadJsonData are REQUIRED for the component to load properly.
     * 		 Additional methods may be declared  to fill out the content inside the component
     * 		 self.dataListener is required if this component is expected to be called from another component
     */
    // self preserves the reference to the component instance
    var m_jsonUtil = new UtilJsonXml();
	var m_counts;
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
         
        var alertData = jsonData.ALERTDATA
        var contentHTML = [];
        // finishedLoading called to clear out any existing loading indicators..rft
        self.finishedLoading();
        // clear any existing content
        self.clearContentHTML()
        // append content HTML
        m_counts = getInteractionCounts(alertData.INTERACTIONS);
        contentHTML.push("<div class='alert-head' >")
        if (alertData.TRIGGERING_ORDER) {
            var triggeringOrder = alertData.TRIGGERING_ORDER;
			var orderOrigin = "";
			var imageHtml = [], imgType="", imgClass= "";
            switch (triggeringOrder.VENUE_TYPE) {
                case "InpatientOrder":
                    orderOrigin = "(Inpatient)";
                    break;
				case "PrescriptionOrder":
					//orderOrigin = "(Prescription)";
					imgType = '3621.gif';
					imgClass = 'inter-rx';
					imageHtml = ["<img src='", m_StaticContentLoc, "\\images\\", imgType, "' alt='' class='", imgClass, "' />"];
					break;
				case "OutpatientOrder":
					imgType = '0322.gif';
					imgClass = 'inter-op';
					imageHtml = ["<img src='", m_StaticContentLoc, "\\images\\", imgType, "' alt='' class='", imgClass, "' />"];
					break;
            }
            
            contentHTML.push("<div><span class='inter-alert-title'>The new order has been created with the following alerts:</span></div>"
				, "<div class='inter-alert-warn'><span class='alert-ord'>",imageHtml.join(""),"<a class='inter-ref'>",triggeringOrder.SUBJECT_ENTITY_NAME,"<span class='inter-det-info'>",triggeringOrder.SUBJECT_ENTITY_CKI,"|0|0", "|",triggeringOrder.SUBJECT_CATALOG_CD, "|", alertData.PERSON_ID, "|", alertData.ENCNTR_ID," </span></a>" 
				, "</span><span class='inter-alert-det'> ",  triggeringOrder.ORDER_DETAILS, "</span> ", orderOrigin , "</div>");
        }
        else 
            if (m_counts.isAllergyOnly()) {
                contentHTML.push("<div><span class='alert-title'>The following allergy alerts exists for this patient</span></div>");
            }

		if(m_counts.hiddenCnt > 0){
			//Add if statment to check pref
			contentHTML.push("<div><span class='inter-conf-msg'> Confidential patient information is hidden in this view.</span>");
			if(alertData.SEC_ALLOWOVERRIDE != 0){
			contentHTML.push(" <input id='overridePrivacy' type='submit' value='Override Privacy' />");
			}

		}
        
        contentHTML.push("</div>");
        
        self.appendContentHTML(contentHTML.join(""));
		self.onDOMLoad.push(adjustButtons);
        
        
    }
    
    function getInteractionCounts(interactions){
        var interactionCounts = new InteractionCounts(0, 0, 0, 0);
        for (var i = interactions.length; i--;) {
            switch (interactions[i].INTERACTION_TYPE) {
				case "DrugAllergy":
                case "AllergyDrug":
                    interactionCounts.allergyDrug++;
					if((interactions[i].IS_ALLERGY_HIDDEN || interactions[i].IS_ORDER_HIDDEN)  && interactions[i].ADDITIONAL_INFO != "INTFILTERED" ){
						 interactionCounts.allergyDrugHidden++;
						 interactionCounts.hiddenCnt++;
					}
                    break;
                case "DrugDrug":
                    interactionCounts.drugDrug++;
					if(interactions[i].IS_ORDER_HIDDEN && interactions[i].ADDITIONAL_INFO != "INTFILTERED" ){
						interactionCounts.drugDrugHidden++;
						interactionCounts.hiddenCnt++;
					}
                    break;
                case "DrugFood":
                    interactionCounts.drugFood++;
					if(interactions[i].IS_ORDER_HIDDEN && interactions[i].ADDITIONAL_INFO != "INTFILTERED" ){
						interactionCounts.drugDrugHidden++;
						interactionCounts.hiddenCnt++;
					}
                    break;
                case "DuplicateTherapy":
                    interactionCounts.duplicateTherapy++;
					if(interactions[i].IS_ORDER_HIDDEN && interactions[i].ADDITIONAL_INFO != "INTFILTERED" ){
						interactionCounts.drugDrugHidden++;
						interactionCounts.hiddenCnt++;
					}
                    break;
            }
            
        }
        return (interactionCounts);
        
    }
    
    function InteractionCounts(allergyDrugCnt, drugDrugCnt, drugFoodCnt, duplicateTherapyCnt){
        this.allergyDrug = allergyDrugCnt;
		this.allergyDrugHidden = 0;
        this.drugDrug = drugDrugCnt;
		this.drugDrugHidden = 0;
        this.drugFood = drugFoodCnt;
		this.drugFoodHidden = 0;
        this.duplicateTherapy = duplicateTherapyCnt;
		this.duplicateTherapyHidden = 0;
		this.hiddenCnt = 0;
		this.isAllergyOnly = function(){
			return(this.allergyDrug > 0 && this.drugDrug == 0 && this.drugFood == 0 && this.duplicateTherapy == 0)	
		}
    }
	
	var adjustButtons = function(){
		if(m_counts.isAllergyOnly()){
			//Hide remove new order button
			var removeOrderButton = _g('removeNewOrder');
			if(removeOrderButton){
				removeOrderButton.style.display = "none";
			}
		}	
	}
    
};
// inherit properties of MpageComponent
InteractionsAlertComp.inherits(MpageComponent);
// Register the component to the layout
var InteractionsAlertComp1 = new InteractionsAlertComp("Interaction-Alert");

MpageDriver.register([{
    "component": InteractionsAlertComp1,
    "componentType": "Alert"
}]);


