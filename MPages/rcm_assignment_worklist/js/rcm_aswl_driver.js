function RenderPage(){
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    
    var componentMapping = new Array();
    var mPage = new BedrockMPage("MP_DCM_SUMMARY", componentMapping)
    mPage.setCriterion(criterion);
    mPage.setCustomizeEnabled(false);
    
    var controller = new RCM_ASWL_Controller(criterion);
    
    controller.setSequence(1);
    controller.setColumn(0);
    controller.setExpanded(true);
    mPage.addComponent(controller);
    
    MP_Util.Doc.InitLayout(mPage);
    controller.initialize();
}
