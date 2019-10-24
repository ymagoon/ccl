/**
 * @author jr4171
 */
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
   var ieVersion = new Number(RegExp.$1); // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

function RenderPage(){
	//var mpAr = [];
	RCM_Clinical_Util.setMpFormatterLocale();
	var js_criterion = JSON.parse(m_criterionJSON);	
	//var criterion = MP_Util.GetCriterion(js_criterion);
	//var criterion = new MP_Core.Criterion(js_criterion.CRITERION.PERSON_ID, (js_criterion.CRITERION.ENCNTRS.length > 0) ? js_criterion.CRITERION.ENCNTRS[0].ENCNTR_ID : 0, js_criterion.CRITERION.PRSNL_ID, js_criterion.CRITERION.EXECUTABLE);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
		//define function calls to filter means
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('MP_UR_READ_BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);
	var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_ur_read");
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("MP_UR_READ");
	var mpageName = "MP_UM_READMISSION";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName) 
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);

//    	var mPage = MP_Bedrock.CreateBedrockMPage("MP_UM_READMISSION", componentMapping, criterion, pageFuncFilterMapping,funcMapping);

	var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
	mPage.setCustomizeEnabled(false);
    
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
		RCM_Clinical_Util.forwardNextMPage(criterion,"rcm_readmission_assessment.html");
	});
	// call retrieve data every time 'cancel' is clicked on the modify utilization management component. 
	utilManModifyComponent.addCancelListener(function() {
		RCM_Clinical_Util.forwardNextMPage(criterion,"rcm_readmission_assessment.html");
	});
	mPage.addComponent(utilManModifyComponent);

    MP_Util.Doc.InitLayout(mPage);
    if (mPage.isBannerEnabled()) //if add patient demographic banner
    {
        var patDemo = _g("banner");
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
    }
    
	// Set fixed heights for the 2 columns that is based on the MPage's window size
	// Unless the window size is known in advance this height must be set dynamically
	// The demographic banner requires vertical space, hence the 0.90 multiplier
	var columns = RCM_Clinical_Util.setColumnsToAvailableHeight(mPage, ["col1", "col2"]);
	
	// TODO: Temporarily set widths for columns, eventually need update the css
	// The horizontal scrollbar can't be hidden by itself through CSS2
	columns[0].style.width = "35%";
	columns[1].style.width = "64%";
	RCM_Clinical_Util.addColumnVerticalScrolling(mPage, columns[0], columns[1], 250);

    RCM_Clinical_Util.componentInsertData(mPage, [], "MP_UR_READ", mpageName);
}