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
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
		//define function calls to filter means
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('MP_UR_READ_BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);
	var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_ur_read");
	var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_ur_read");
	//Loading Policy
	var mpageName = "MP_UM_READMISSION";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName) 
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);

	var columnOne = RCM_Clinical_Util.moveComponentsIntoOneColumn(mPage);
	mPage.setCustomizeEnabled(false);
    
	mPage.setName(RCMReadmissionAssessmentFormI18n.RCM_READMISSION_ASSESSMENT_TITLE);
	
	 // enable modify link on the utilization management component.
	var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage, UtilizationManagementRetrieveComponent);
	if (utilManRetrieveComponent) {
		utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
	}
    
	var readmissionFormComponent = new ReadmissionFormComponent(criterion);
	readmissionFormComponent.setColumn(columnOne+1);
	readmissionFormComponent.setSequence(1);
	readmissionFormComponent.setPageGroupSequence(1);
	readmissionFormComponent.setExpanded(true);
	mPage.addComponent(readmissionFormComponent);

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
	columns[0].style.width = "33%";
	columns[1].style.width = "66%";
	RCM_Clinical_Util.addColumnVerticalScrolling(mPage, columns[0], columns[1], 250);
	
	readmissionFormComponent.InsertData();

	RCM_Clinical_Util.componentInsertData(mPage, [readmissionFormComponent], "MP_UR_READ", mpageName);
}

