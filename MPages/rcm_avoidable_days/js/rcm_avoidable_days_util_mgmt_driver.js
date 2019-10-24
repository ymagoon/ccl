/**
 * Driver for the Utilization Management modify component when launched from within the Avoidable 
 * Days MPage. Renders the components for display in an MPage.
 * 
 * @author Leonardo Ji - Revenue Cycle Access
 * @author Brandon Rockhold - Revenue Cycle Access
 * @author Jason Roberts - Revenue Cycle Access
 */
function RenderPage() {
	RCM_Clinical_Util.setMpFormatterLocale();
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    
    var pageFuncFilterMapping = new Array(new MP_Core.MapObject('MP_UR_AD_BANNER',
            '{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}'));
    var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_ur_ad");
    var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("MP_UR_AD");

	var mpageName = "MP_UM_AVOIDABLE_DAYS";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName) 
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
    mPage.setCustomizeEnabled(false);
    
    RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
    
    // Retrieves the avoidable days list component so that it can be set up.
    var avoidableDaysListComponent = RCM_Clinical_Util.getMPageComponent(mPage, RCMAvoidableDaysListComponent);
    avoidableDaysListComponent.setPlusAddEnabled(false);

    var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(false);
    }
	
	var utilManModifyComponent = new UtilizationManagementModifyComponent(criterion);
	utilManModifyComponent.setColumn(2);
	utilManModifyComponent.setPageGroupSequence(1);
	if (utilManRetrieveComponent) {
		utilManModifyComponent.setLabel(utilManRetrieveComponent.getLabel());
	}	
	// call retrieve data every time 'save' is clicked on the modify utilization management component.
	utilManModifyComponent.addSaveListener(function() {
		RCM_Clinical_Util.forwardNextMPage(criterion,"rcm_avoidable_days.html");
	});
	// call retrieve data every time 'cancel' is clicked on the modify utilization management component. 
	utilManModifyComponent.addCancelListener(function() {
		RCM_Clinical_Util.forwardNextMPage(criterion,"rcm_avoidable_days.html");
	});
	mPage.addComponent(utilManModifyComponent);
	
    // Sets the MPage name and lays out the components' shells (prior to retrieving data).
    mPage.setName(rcm_avoidable_days_i18n.AVOIDABLE_DAYS_MPAGE_TITLE);
    MP_Util.Doc.InitLayout(mPage);
    
    if (mPage.isBannerEnabled()) {
        CERN_DEMO_BANNER_O1.GetPatientDemographics(_g("banner"), criterion);
    }
    
    // Set fixed heights for the 2 columns that is based on the MPage's window size.
    // Unless the window size is known in advance, this height must be set dynamically.
    // The demographic banner requires vertical space, hence the 0.90 multiplier.
    var columns = RCM_Clinical_Util.setColumnsToAvailableHeight(mPage, ["col1", "col2"]);
    
    // TODO: Temporarily set widths for columns. Eventually need update the css.
    columns[0].style.width = "35%";
    columns[1].style.width = "64%"; 
    RCM_Clinical_Util.addColumnVerticalScrolling(mPage, columns[0], columns[1], 250);
    
    // Performs the InsertData call for the utilization management modify component so that its 
    // asynchronous load is more likely to finish before the other standard components, resulting in
    // it being rendered more quickly.
    utilManModifyComponent.InsertData();
    RCM_Clinical_Util.componentInsertData(mPage, [utilManModifyComponent], "MP_UR_AD", mpageName);  
};
