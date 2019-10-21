/**
 * Driver for the RCM avoidable days components. Renders the components for display in an MPage.
 * 
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
    var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_ur_ad");

	var mpageName = "MP_UM_AVOIDABLE_DAYS";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName) 
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
    mPage.setCustomizeEnabled(false);
    
    var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);

    // Sets up the avoidable days form component.
    var avoidableDaysFormComponent = new RCMAvoidableDaysFormComponent(criterion);
    avoidableDaysFormComponent.setColumn(columnOne + 1);
    avoidableDaysFormComponent.setPageGroupSequence(1);
    avoidableDaysFormComponent.setSequence(1);
    avoidableDaysFormComponent.setExpanded(true);
    mPage.addComponent(avoidableDaysFormComponent);
    
    // Retrieves the avoidable days list component so that it can be set up.
    var avoidableDaysListComponent = RCM_Clinical_Util.getMPageComponent(mPage, RCMAvoidableDaysListComponent);
    avoidableDaysListComponent.setResultLinksVisible(true);
    
    // Adds listeners to the avoidable days list component for the form.
    avoidableDaysListComponent.addAvoidableDaySelectedListener(function(avoidableDayId) {
        avoidableDaysFormComponent.InsertData(avoidableDayId);
    });
    avoidableDaysListComponent.addNewAvoidableDayListener(function() {
        avoidableDaysFormComponent.InsertData();
    });
	var renderSuccessListener = function(){
		avoidableDaysListComponent.removeRenderSuccessListener(renderSuccessListener);
		var isAddAuthorized = avoidableDaysListComponent.isAddAuthorized();
		var avoidDayIdList = avoidableDaysListComponent.getAvoidDaysIds();
		avoidableDaysFormComponent.InsertData((avoidDayIdList.length === 0 || isAddAuthorized) ? "0" : avoidDayIdList[0]);
	};
	avoidableDaysListComponent.addRenderSuccessListener(renderSuccessListener);
    // Adds listeners to the avoidable days form component for the list.
    avoidableDaysFormComponent.addSaveListener(function() {
        avoidableDaysListComponent.InsertData();
    });

    avoidableDaysFormComponent.addDeleteListener(function() {
        avoidableDaysListComponent.InsertData();
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
    
    // Performs InsertData calls for the avoidable days list and form so that their asynchronous
    // loads are more likely to finish before the other standard components, resulting in them being
    // rendered more quickly.
    avoidableDaysListComponent.InsertData();
    avoidableDaysFormComponent.InsertData();
    RCM_Clinical_Util.componentInsertData(mPage, [avoidableDaysListComponent,avoidableDaysFormComponent], "MP_UR_AD", mpageName);  
};