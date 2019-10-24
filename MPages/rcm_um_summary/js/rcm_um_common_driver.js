
/**
 * @author JR4171
 */
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1); // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

function RenderPage(){
	RCM_Clinical_Util.setMpFormatterLocale();
	var js_criterion = JSON.parse(m_criterionJSON);	
 	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var mpageName = "MP_UR_SUMMARY";
	
        //define function calls to filter means
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);
	var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_ur");
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_ur");
	//Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
	mPage.setCustomizeEnabled(false);
    mPage.setName(rcm_um_summary_i18n.UTILIZATION_MANAGEMENT_SUMMARY);
    
	var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
	}
	
    MP_Util.Doc.InitLayout(mPage);
    if (mPage.isBannerEnabled()) //if add patient demographic banner
    {
        var patDemo = _g("banner");
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
    }
    RCM_Clinical_Util.componentInsertData(mPage, [], "MP_UR", mpageName);
}
