/**
 * <p>
 * The documentation review editor form driver.
 * </p>
 * <p style="font-style:italic;font-variant:small-caps;font-size:80%">
 * Copyright &copy; Cerner Corporation 2010 All rights reserved.
 * </p>
 * 
 * @author Leonardo Ji (LJ015625)
 */
function RenderPage(){
	RCM_Clinical_Util.setMpFormatterLocale();
	var js_criterion = JSON.parse(m_criterionJSON);	
 	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
 	var mpageName = 'MP_DOC_REVIEW';
	
	//define function calls to filter means
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);	
	
    var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_doc_rvw");	
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_doc_rvw");		
    //Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
	mPage.setCustomizeEnabled(false);
    mPage.setName(rcm_um_summary_i18n.DOCUMENTATION_REVIEW_SUMMARY);
	
	var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
	
	var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
	}
	var docListComponent = RCM_Clinical_Util.getMPageComponent(mPage, DocumentListComponent);
	if (docListComponent) {
		docListComponent.setColumn(1);
		docListComponent.setPageGroupSequence(1);
		docListComponent.setResultLink(true);
		// Add component listeners	
		docListComponent.addNewReviewListener(function() {
			docFormComponent.InsertData();
		});	
	
		docListComponent.addReviewSelectedListener(function(reviewId) {	
			docFormComponent.InsertData(reviewId, false);
		});
		docListComponent.InsertData();
	}
	
	var docFormComponent = RCM_Clinical_Util.getMPageComponent(mPage, DocumentationFormComponent);
	if (docFormComponent) {
		docFormComponent.setColumn(2);
		docFormComponent.setPageGroupSequence(1);	
		docFormComponent.setExpanded(true);	
		
		docFormComponent.addSaveListener(function(){
			docListComponent.InsertData();
		});
		docFormComponent.addDeleteListener(function(){
			docListComponent.InsertData();
		});
		docFormComponent.addRetrieveListener(function() {
			if (docListComponent.isFirstTimeLoad()) {
				RCM_Clinical_Util.componentInsertData(mPage, [docListComponent,docFormComponent], "mp_doc_rvw", mpageName);
				docListComponent.setFirstTimeLoad(false);
			}
		});
		// do not have the review id at initial loading. 
		docFormComponent.InsertData(0.0);
	}
	
    MP_Util.Doc.InitLayout(mPage);
    
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
    if (mPage.isBannerEnabled()) //if add patient demographic banner
    {
        var patDemo = _g("banner");
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
    }
}