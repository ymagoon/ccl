/**
 * @author Nick Neidig
 */
function RenderPage() {	
	RCM_Clinical_Util.setMpFormatterLocale();
	var js_criterion = JSON.parse(m_criterionJSON);	
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var mpageName = 'MP_UM_CLINICAL_REVIEW';
	
	//define function calls to filter means
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);	
	
    var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_ur_cr");	
	RCM_Clinical_Util.addComponentMapping(componentMapping, "mp_ur_clin_review_editor", ClinicalFormComponent);
	
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_ur_cr");		
    	//Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);

    mPage.setCustomizeEnabled(false);
	
	var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
	
	// care management
	var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
	}	
	
	// clinical review form 
	var formComponent = RCM_Clinical_Util.getMPageComponent(mPage, ClinicalFormComponent);
	if (formComponent) {	
		formComponent.setColumn(columnOne + 1);
		formComponent.setPageGroupSequence(1);
		formComponent.setExpanded(true);
		formComponent.setFaxLinkEnabled(true);
	}
	
	// clinical review fax form
	var clinicalReviewFaxComponent = new ClinicalReviewFaxComponent(criterion);
	clinicalReviewFaxComponent.setColumn(columnOne + 1);
	clinicalReviewFaxComponent.setPageGroupSequence(1);
	mPage.addComponent(clinicalReviewFaxComponent);
	
	// clinical review print form
	var clinicalReviewPrintComponent = new ClinicalReviewPrintComponent(criterion);
	clinicalReviewPrintComponent.setColumn(columnOne + 1);
	clinicalReviewPrintComponent.setPageGroupSequence(1);
	mPage.addComponent(clinicalReviewPrintComponent);
	
	// switch logic between clinical review form and clinical review fax.
    var showClinicalReviewForm = function() {
    	$(formComponent.getRootComponentNode()).show();
    	$(clinicalReviewFaxComponent.getRootComponentNode()).hide();
    	$(clinicalReviewPrintComponent.getRootComponentNode()).hide();
    };
    var showClinicalReviewFaxForm = function() {
    	$(formComponent.getRootComponentNode()).hide();
    	$(clinicalReviewPrintComponent.getRootComponentNode()).hide();
    	$(clinicalReviewFaxComponent.getRootComponentNode()).show();
    };
    var showClinicalReviewPrintForm = function() {
    	$(formComponent.getRootComponentNode()).hide();
    	$(clinicalReviewFaxComponent.getRootComponentNode()).hide();
    	$(clinicalReviewPrintComponent.getRootComponentNode()).show();
    };
    
	// clinical review list
    var otherComponentLoaded = false;
	var listComponent = RCM_Clinical_Util.getMPageComponent(mPage, ClinicalListComponent);
	if (listComponent) {
		listComponent.setMostCurrentReviewSelected(true);	
		listComponent.setResultLink(true);
		listComponent.setFaxLink(true);
		// Add component listeners	
		listComponent.addNewReviewListener(function() {
			// Turn off selecting the most current review after the first list load
			if (listComponent.isMostCurrentReviewSelected()) {
				listComponent.setMostCurrentReviewSelected(false);
			}
			// Show clinical review form.
			showClinicalReviewForm();
		    if (otherComponentLoaded === false) {
		    	otherComponentLoaded = true;
		    	formComponent.InsertData(null, function() {RCM_Clinical_Util.componentInsertData(mPage, [listComponent, formComponent, clinicalReviewFaxComponent, clinicalReviewPrintComponent], "MP_UR_CR", mpageName); });
		    }
		    else {
		    	formComponent.InsertData();
		    }
		});	
	
		listComponent.addReviewSelectedListener(function(reviewId) {	
			// Turn off selecting the most current review after the first list load
			if (listComponent.isMostCurrentReviewSelected()) {
				listComponent.setMostCurrentReviewSelected(false);
			}
			// Show clinical review form.
		    showClinicalReviewForm();
			// Delay insertData on the ClinicalFormComponent.  The form component insertData call will be decided by ClinicalListComponent. 
			// The fax component is not loaded until it is needed.
			if (otherComponentLoaded === false) {
				otherComponentLoaded = true;
				formComponent.InsertData(reviewId, 
					function() { RCM_Clinical_Util.componentInsertData(mPage, [listComponent, formComponent, clinicalReviewFaxComponent, clinicalReviewPrintComponent], "MP_UR_CR", mpageName); });
			}
			else {
				formComponent.InsertData(reviewId);
			}
			
		});
		
		listComponent.addFaxListener(function() {	
			// refresh fax component in case we added new clinical review(s).
			clinicalReviewFaxComponent.InsertData();
			// Show clinical review fax form.
			showClinicalReviewFaxForm();
		});
		
		listComponent.addPrintListener(function() {	
			// refresh fax component in case we added new clinical review(s).
			clinicalReviewPrintComponent.InsertData();
			// Show clinical review fax form.
			showClinicalReviewPrintForm();
		});
	}

    // add form component listener
    if (formComponent) {
    	formComponent.addSaveListener(function() {
    		// refresh the list component to show added clinical review(s).
    		listComponent.InsertData();
    	});	
    	formComponent.addDeleteListener(function() {
    		// refresh the list component to remove deleted clinical review(s).
    		listComponent.InsertData();
    	});	
		formComponent.addFaxListener(function() {	
			// refresh fax component in case we added new clinical review(s).
			clinicalReviewFaxComponent.InsertData(true);
			showClinicalReviewFaxForm();
		});
    }
    
    // add fax component listener
    if (clinicalReviewFaxComponent) {
    	clinicalReviewFaxComponent.addSaveListener(function() {
    		// refresh the list component to show communicated reviews.
    		listComponent.InsertData();
    		showClinicalReviewForm();
    		// show a new clinical review form.
    		formComponent.InsertData();
    	});
    	clinicalReviewFaxComponent.addCancelListener(function() {
    		showClinicalReviewForm();
    		// show a new clinical review form.
    		formComponent.InsertData();
    	});
    }
    
    // add print component listener
    if (clinicalReviewPrintComponent) {
    	clinicalReviewPrintComponent.addCancelListener(function() {
    		showClinicalReviewForm();
    		// show a new clinical review form.
    		formComponent.InsertData();
    	});
    }
    
	mPage.setName(rcm_um_summary_i18n.CLINICAL_REVIEW_MPAGE_TITLE);
    MP_Util.Doc.InitLayout(mPage);	
	var rootBox = formComponent.getRootComponentNode();
	var height = gvs()[0] *(mPage.isBannerEnabled() ? 0.80 : 0.83);
	rootBox.style.height = height;
    
	// Set fixed heights for the 2 columns that is based on the MPage's window size
	// Unless the window size is known in advance this height must be set dynamically
	// The demographic banner requires vertical space, hence the 0.90 multiplier
	var columns = RCM_Clinical_Util.setColumnsToAvailableHeight(mPage, ["col1", "col2"]);
	
	// TODO: Temporarily set widths for columns, eventually need update the css
	if (columns.length === 2) {
		columns[0].style.width = "35%";
		columns[1].style.width = "64%";			
	}
	RCM_Clinical_Util.addColumnVerticalScrolling(mPage, columns[0], columns[1], 500);
	if (formComponent) {
		formComponent.setScrollColumn(columns[1]);
	}	
    if (mPage.isBannerEnabled()) { //if add patient demographic banner
        var patDemo = _g("banner");        
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);        
    }
    listComponent.InsertData();
}

