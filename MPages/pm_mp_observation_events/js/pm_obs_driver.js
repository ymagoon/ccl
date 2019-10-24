function RenderPage(){
	
	RCM_Clinical_Util.setMpFormatterLocale();
	var js_criterion = JSON.parse(m_criterionJSON);	
 	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var mpageName = 'MP_OBSERVE_EVENTS';
	
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);	
	var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_obs_events_dcm");	
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_obs_events_dcm");		
    	//Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
    mPage.setCustomizeEnabled(false);
	mPage.setName(reg_Observation_i18n.reg_obsrv_OBSERVATION_EVENTS);
	
	var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
	
	var obs_comp = new ObservationComponent(criterion);
	obs_comp.setColumn(columnOne + 1);
	obs_comp.setPageGroupSequence(1);
	mPage.addComponent(obs_comp);
	
	MP_Util.Doc.InitLayout(mPage);
	obs_comp.InsertData(obs_comp);
	
	
	if (mPage.isBannerEnabled()) //if add patient demographic banner
    {
        var patDemo = _g("banner");
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
    }
	
	
	
	var columns = RCM_Clinical_Util.setColumnsToAvailableHeight(mPage, ["col1", "col2"]);
	
	// TODO: Temporarily set widths for columns, eventually need update the css
	if (columns.length === 2) {
		columns[0].style.width = "27%";
		columns[1].style.width = "72%";			
	}
	 RCM_Clinical_Util.addColumnVerticalScrolling(mPage, columns[0], columns[1], 250);
	
	RCM_Clinical_Util.componentInsertData(mPage, [obs_comp], "MP_OBS_EVENTS_DCM", mpageName);
}