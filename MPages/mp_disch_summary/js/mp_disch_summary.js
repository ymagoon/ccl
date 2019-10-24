/*
 * Project: mp_disch_summary.js
 * Version 1.0.0
 * Released 10/5/2010
 * @author Megha Rao (MR018925)
 * @author Randy Rogers (RR4690)
*/
 
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

function OpenDischargeProcess(encntrID,personID,userID){
	var dpObject = new Object(); 
    dpObject = window.external.DiscernObjectFactory("DISCHARGEPROCESS");
  //dpObject.Window = window;
    dpObject.person_id = personID;
    dpObject.encounter_id = encntrID;			
    dpObject.user_id = userID;
	dpObject.LaunchDischargeDialog();	
}



function RenderPage(){
    var js_criterion = JSON.parse(m_criterionJSON);
  	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var MPageName = "MP_DC_SUMMARY";
	var timerMPage = MP_Util.CreateTimer("CAP: MPG Launch MPage");
    if (timerMPage) 
		timerMPage.SubtimerName = MPageName;
    if (timerMPage) 
		timerMPage.Stop();
	
    var componentMapping = new Array(  

		new MP_Core.MapObject("mp_dc_readiness", DischargeIndicatorComponent),
		new MP_Core.MapObject("mp_dc_clin_doc", DocumentComponent),
		new MP_Core.MapObject("mp_dc_incomplete_orders", OrdersComponent),
		new MP_Core.MapObject("mp_dc_pat_ed", PatientFamilyEduSumComponent),
		new MP_Core.MapObject("mp_dc_pt_info", PatientInfoComponent),
		new MP_Core.MapObject("mp_dc_social", SocialComponent),
		new MP_Core.MapObject("mp_dc_results", ResultsComponent),
	    new MP_Core.MapObject("mp_dc_activities", ActivitiesComponent),
		new MP_Core.MapObject("mp_dc_followup", FollowUpComponent),
		new MP_Core.MapObject("mp_dc_diagnosis", DiagnosesComponent),
		new MP_Core.MapObject("mp_dc_order", DischargeOrdersComponent),
		new MP_Core.MapObject("mp_dc_med_rec", MedicationReconciliationComponent),
		new MP_Core.MapObject("mp_dc_care_mgmt", DischargePlanningComponent),
		new MP_Core.MapObject("mp_dc_qm", QualityMeasuresComponent)
    );
	
	var pageFuncFilterMapping = new Array(
	new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}') 
	);
	
	var compFuncFilterMapping = new Array(
		new MP_Core.MapObject('mp_dc_order','{"FUNCTIONS":[{"FILTER_MEAN": "DC_ORDER_SELECT", "NAME":"setCatalogCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}'),
		new MP_Core.MapObject('mp_dc_diagnosis','{"FUNCTIONS":[{"FILTER_MEAN": "DC_DIAGNOSIS_TYPE", "NAME":"setDiagnosisType", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}'),
		new MP_Core.MapObject('mp_dc_incomplete_orders','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "INCOMPLETE_ORDERS_CAT_TYPE", "NAME":"setCatalogCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "INCOMPLETE_ORDERS_STATUS", "NAME":"setOrderStatuses", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}'),
		new MP_Core.MapObject('mp_dc_pt_info', '{"FUNCTIONS":[' +
			'{"FILTER_MEAN": "CHIEF_COMP_CE", "NAME":"setChiefComplaint", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "RESUS_ORDER", "NAME":"setResusOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "ADV_DIRECTIVE", "NAME":"setAdvancedDirectives", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "MODE_ARRIVAL_CE", "NAME":"setModeofArrival", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NOTE_ES", "NAME":"setDocumentTypes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "TARGET_DC_DT", "NAME":"setEstimatedDischargeDate", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "ENC_TYPE", "NAME":"setVisitTypeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "REASON_IND", "NAME":"setRFVDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "PRIMARY_DR_IND", "NAME":"setPrimaryPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ED_CONTACT_IND", "NAME":"setEmergencyContactsDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ADMIT_DR_IND", "NAME":"setAdmittingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "RM_IND", "NAME":"setRoomBedDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ATTEND_DR_IND", "NAME":"setAttendingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ADM_DT_IND", "NAME":"setAdmitDateDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +			
			'{"FILTER_MEAN": "MED_SVC_IND", "NAME":"setMedicalServiceDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}]}'),
		new MP_Core.MapObject('mp_dc_care_mgmt', '{"FUNCTIONS":[' +
			'{"FILTER_MEAN": "DC_DC_PLAN_CE", "NAME":"setDischScreenPlan", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_DC_DISP_CE", "NAME":"setDischDisposition", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_TRANSP_ARR_CE", "NAME":"setDocTransArrangement", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_PROF_SKILL_ANT_CE", "NAME":"setProfSkillServices", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_DME_ANT_CE", "NAME":"setDurableMedEquipment", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_DME_COORD_CE", "NAME":"setDurableMedEquipmentCoordinated", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_PLAN_DC_DT_TM_CE", "NAME":"setPlannedDischDate", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "DC_ADM_MIM_CE", "NAME":"setAdmissionMIMSigned", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' +
			'{"FILTER_MEAN": "DC_DSCH_MIM_CE", "NAME":"setDischMIMGiven", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}'),
		new MP_Core.MapObject('mp_dc_qm','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "PLAN_STATUS", "NAME":"setPlanStatusCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "PLAN_CLASS", "NAME":"setPlanClassificationCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'+
			']}')
	);

	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
    loadingPolicy.setLoadPageDetails(true);
    loadingPolicy.setLoadComponentBasics(true);
    loadingPolicy.setLoadComponentDetails(true);
	loadingPolicy.setCategoryMean(MPageName)
    loadingPolicy.setCriterion(criterion);

	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
	
	var pgTitle = i18n.DISCHARGE_SUMMARY;
	mPage.setName(pgTitle);	
	mPage.addTitleAnchor("<a id=otherAnchors title='"+i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS+"' onclick='javascript:OpenDischargeProcess("+criterion.encntr_id+","+criterion.person_id+","+criterion.provider_id+");'>"+i18n.DISCHARGE_PROCESS+"</a>");
	mPage.setCustomizeEnabled(true);
	
	var components = mPage.getComponents();
	for (var y = 0, yl = components.length; y < yl; y++) {
        if (components[y] instanceof DischargeIndicatorComponent) {
            components[y].setPageGroupSequence(1);
        }
        else {
            components[y].setPageGroupSequence(2);
			
        }
    }
	mPage.getComponents().sort(SortMPageComponents);


	
	
	MP_Util.Doc.InitLayout(mPage, MPageName);
	//MP_Util.Doc.AddHelpURL(criterion.static_content, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=PlanofCare&culture=en-US&release=1");	
    if (criterion.help_file_local_ind == 1) {
		MP_Util.Doc.AddHelpLink(criterion.static_content, "index.html");
	}
	else 
		MP_Util.Doc.AddHelpURL(criterion.static_content, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=DischargeReadiness&culture=en-US&release=1");

	if (mPage.isBannerEnabled()) //if add patient demographic banner
	{
		var patDemo = _g("banner");
		CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}
	for (var x = components.length; x--;) {
		components[x].setMPageName(MPageName);
	}
	window.setTimeout("MP_Util.Doc.RenderLayout()",0);
	
}

	

	
