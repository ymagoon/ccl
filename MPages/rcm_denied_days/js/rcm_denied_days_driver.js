/**
 * Driver for the RCM denied days components with the denied days form. Renders the components for display in an MPage.
 * 
 * @author Jason Roberts - Revenue Cycle Access
 */
function RenderPage() {
    RCM_Clinical_Util.setMpFormatterLocale();
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    
    var pageFuncFilterMapping = new Array(new MP_Core.MapObject('MP_UM_DENIALS_BANNER',
            '{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}'));
    var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_um_denials");
    var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_um_denials");
    
	var mpageName = "MP_UM_DENIALS";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion);
	
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
    mPage.setCustomizeEnabled(false);
    
    var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);

    // Sets up the denied days form component.
    var deniedDaysFormComponent = new RCMDeniedDaysFormComponent(criterion);
    deniedDaysFormComponent.setColumn(columnOne + 1);
    deniedDaysFormComponent.setPageGroupSequence(1);
    deniedDaysFormComponent.setSequence(1);
    deniedDaysFormComponent.setExpanded(true);
    mPage.addComponent(deniedDaysFormComponent);
    
    // Sets up the denial appeal form component.
    var denialAppealFormComponent = new RCMDenialAppealFormComponent(criterion);
    denialAppealFormComponent.setColumn(columnOne + 1);
    denialAppealFormComponent.setPageGroupSequence(1);
    denialAppealFormComponent.setSequence(2);
    denialAppealFormComponent.setExpanded(true);
    mPage.addComponent(denialAppealFormComponent);
    
    var showAppealForm = function() {
    	$(deniedDaysFormComponent.getRootComponentNode()).hide();
    	$(denialAppealFormComponent.getRootComponentNode()).show();
    };
    
    var showDeniedDaysForm = function() {
    	$(denialAppealFormComponent.getRootComponentNode()).hide();
    	$(deniedDaysFormComponent.getRootComponentNode()).show();
    };
    
    // Retrieves the denied days list component so that it can be set up.
    var deniedDaysListComponent = RCM_Clinical_Util.getMPageComponent(mPage, RCMDeniedDaysListComponent);
    deniedDaysListComponent.setDateLinksVisible(true);
    deniedDaysListComponent.setAddAppealLinkVisible(true);
    deniedDaysListComponent.addDeniedDaySelectedListener(function(deniedDayId) {
    	deniedDaysFormComponent.InsertData(false, deniedDayId);
    	showDeniedDaysForm();
    });
    deniedDaysListComponent.addNewDeniedDayListener(function() {
    	deniedDaysFormComponent.InsertData(false);
    	showDeniedDaysForm();
    });
    deniedDaysListComponent.addAppealSelectedListener(function(appealId) {
    	denialAppealFormComponent.InsertData(false, "0", "0", appealId);
    	showAppealForm();
    });
    deniedDaysListComponent.addNewAppealListener(function() {
    	denialAppealFormComponent.InsertData(false);
    	showAppealForm();
    });
	
	var renderSuccessListener = function(){
		deniedDaysListComponent.removeRenderSuccessListener(renderSuccessListener);
		var isAddAuthorized = deniedDaysListComponent.isAddAuthorized();
		var deniedDayIdList = deniedDaysListComponent.getDeniedDaysIds();
		deniedDaysFormComponent.InsertData(true, (deniedDayIdList.length === 0 || isAddAuthorized) ? "0" : deniedDayIdList[0]);	
	};
	deniedDaysListComponent.addRenderSuccessListener(renderSuccessListener);

    // Adds listeners to the denied days form component for the list.
    deniedDaysFormComponent.addSaveListener(function() {
    	deniedDaysListComponent.InsertData();
    });
    
    deniedDaysFormComponent.addDeleteListener(function() {
    	deniedDaysListComponent.InsertData();
    });
    
    deniedDaysFormComponent.addAddAppealListener(function(payerOrgId, deniedDaysId) {
    	deniedDaysListComponent.InsertData();
    	denialAppealFormComponent.InsertData(false, payerOrgId, deniedDaysId);
    	showAppealForm();
    });
    
    // Adds listeners to the denial appeal form component for the list.
    denialAppealFormComponent.addSaveListener(function() {
    	deniedDaysListComponent.InsertData();
    });
    
    denialAppealFormComponent.addDeleteListener(function() {
    	deniedDaysListComponent.InsertData();
    });

    // Enables the Modify link on the utilization management component.
	var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
	}
	
    // Sets the MPage name and lays out the components' shells (prior to retrieving data).
    mPage.setName(rcm_denied_days_i18n.DENIED_DAYS_MPAGE_TITLE);
    MP_Util.Doc.InitLayout(mPage);
    showDeniedDaysForm();
    
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
    
    // Performs InsertData calls for the denied days list and form so that their asynchronous
    // loads are more likely to finish before the other standard components, resulting in them being
    // rendered more quickly.
    deniedDaysListComponent.InsertData();
    RCM_Clinical_Util.componentInsertData(mPage, [deniedDaysListComponent,deniedDaysFormComponent,denialAppealFormComponent], "MP_UM_DENIALS", mpageName);  
};