if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ // test for MSIE x.x;
    var ieVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
} else {
    var ieVersion=0;
}

function RenderPage() {
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    var mpageName = i18n.MPAGE_NAME;
	
	//check the adm_domain_type for current encounter to determine if current mPage should be displayed
	if(validateAdmDomainTypeAndRenderBlankPage(i18n.MED_HEADER,criterion)){
		return;
	}
    
    var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage) 
        timerMPage.SubtimerName = mpageName;
    if (timerMPage) 
        timerMPage.Stop();
    
    var pageFuncFilterMapping = new Array(
        new MP_Core.MapObject('IS_BANNER', '{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
    );

    var compFuncFilterMapping = new Array(
    );

    // In order to retrieve the common styles for components, each consumer will have to create
    // a mapping of the potential component names to a common component name.
    var inptComponentMapping = new Array(        
        new MP_Core.MapObject("mp_med_availability", MedicationsComponent),
        new MP_Core.MapObject("mp_med_waste", MedWasteComponent),
        new MP_Core.MapObject("mp_med_override", MedOverrideComponent),
        new MP_Core.MapObject("mp_user_maint", UserMaintComponent)
    );
    
    var inptMPage = new MPage();
    
    criterion.category_mean = mpageName;
    inptMPage.mean = mpageName;
    inptMPage.setCriterion(criterion);
    inptMPage.setName(i18n.MED_HEADER);
    inptMPage.componentMapping = inptComponentMapping;
    
    //Set up the Components before we render them on the mPage
    var componentAr = [];
    
    var componentType = MP_Util.GetValueFromArray("mp_med_availability", inptComponentMapping);
    var component = new componentType(criterion);
    component.setExpanded(true);
    component.setLabel(i18n.MED_COMPONENT);
    component.setResultsDisplayEnabled(true);
    componentAr.push(component);
    
    var initializer = new OmnicellMedicationComponentInitializer(component);
    initializer.initialize();
    
    var medOverrideComponentType = MP_Util.GetValueFromArray("mp_med_override", inptComponentMapping);
    var medOverrideComponent = new medOverrideComponentType(criterion);
    medOverrideComponent.setExpanded(true);
    medOverrideComponent.setLabel(i18n.MED_OVERRIDE_COMPONENT);
    medOverrideComponent.setResultsDisplayEnabled(true);
    componentAr.push(medOverrideComponent);

    var medWasteComponentType = MP_Util.GetValueFromArray("mp_med_waste", inptComponentMapping);
    var medWasteComponent = new medWasteComponentType(criterion);
    medWasteComponent.setExpanded(true);
    medWasteComponent.setLabel(i18n.MED_WASTE_COMPONENT);
    medWasteComponent.setResultsDisplayEnabled(true);
    componentAr.push(medWasteComponent);
    
    var userMaintComponentType = MP_Util.GetValueFromArray("mp_user_maint", inptComponentMapping);
    var userMaintComponent = new userMaintComponentType(criterion);
    userMaintComponent.setExpanded(true);
    userMaintComponent.setLabel(i18n.USER_MAINTENANCE_COMPONENT);
    userMaintComponent.setResultsDisplayEnabled(true);
    componentAr.push(userMaintComponent);
    
    inptMPage.setComponents(componentAr);
    //inptMPage.setHelpFileURL("https://wiki.ucern.com/display/r1mpagesHP/Nursing+Communication+Help");
    
    //Setup Single MPage
    MP_Util.Doc.InitLayout(inptMPage);

    MP_Util.Doc.RenderLayout();
}
