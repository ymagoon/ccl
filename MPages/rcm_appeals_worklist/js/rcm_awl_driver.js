function RenderPage(){
    // Call functions to format html and populate sections
    var js_criterion = JSON.parse(m_criterionJSON);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var timerCAP = MP_Util.CreateTimer("CAP:RCM_APPEALS_WORKLIST.01");
	if(timerCAP){
		timerCAP.stop();
	}
    var componentMapping = new Array();
    var mPage = new BedrockMPage("MP_DCM_SUMMARY", componentMapping);
	mPage.setCriterion(criterion);
	mPage.setCustomizeEnabled(false);
	
	var controller = new RCM_AWLController(criterion);

	controller.setSequence(1);	
	controller.setColumn(0);
	controller.setExpanded(true);	
	mPage.addComponent(controller);

	MP_Util.Doc.InitLayout(mPage);
	//controller.getSectionContentNode().style.height = "1000px";
	controller.initialize();

}