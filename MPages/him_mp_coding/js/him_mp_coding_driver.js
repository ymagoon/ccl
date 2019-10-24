/**
 * Main entry point for him_mp_coding.html
 * 
 * @author Devin Kelly-Collins
 */
function RenderPage() {
	var timerMPage = MP_Util.CreateTimer("CAP:ACCESSHIM.Load CodingMpage");
	if (timerMPage) {
		timerMPage.Stop();
	}

	HIM_Coding_Util.setMpFormatterLocale();
	// Create criteria.
	var js_criterion = JSON.parse(m_criterionJSON);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var pageFuncFilterMapping = new Array(new MP_Core.MapObject('BANNER',
			'{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}'));
	var componentMapping = HIM_Coding_Util.createComponentMappings("mp_him");
	var funcMapping = HIM_Coding_Util.createFuncMapping("mp_him");

	// Retrieve bedrock page settings.
	var mpageName = "mp_him_code";
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true);
	loadingPolicy.setLoadComponentBasics(true);
	loadingPolicy.setLoadComponentDetails(true);
	loadingPolicy.setCategoryMean(mpageName)
	loadingPolicy.setCriterion(criterion);
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping,
			pageFuncFilterMapping, funcMapping);

	var components = mPage.getComponents();
	for ( var index = 0; index < components.length; index++) {
		var component = components[index];
		if (VitalSignComponent && component instanceof VitalSignComponent) {
			var groups = component.getGroups();
			if (groups != null) {
				for (z = 0; z < groups.length; z++) {
					group = groups[z];
					switch (group.getGroupName()) {
					case "TEMP_CE":
						group.setGroupName(i18n.discernabu.vitals_o1.TEMPERATURE);
						break;
					case "BP_CE":
						group.setGroupName(i18n.discernabu.vitals_o1.BLOOD_PRESSURE);
						break;
					case "HR_CE":
						group.setGroupName(i18n.discernabu.vitals_o1.HEART_RATE);
						break;
					case "VS_CE":
						group.setGroupName("");
						break;
					}
				}
			}
		} else if (PatientAssessmentComponent && component instanceof PatientAssessmentComponent) {
			var groups = component.getGroups();
			for (z = 0; z < groups.length; z++) {
				var group = groups[z];
				switch (group.getGroupName()) {
				case "NC_PT_ASSESS_GEN":
					group.setGroupName(i18n.GENERAL_ASSESSMENT);
					break;
				case "NC_PT_ASSESS_PAIN":
					group.setGroupName(i18n.PAIN);
					break;
				case "NC_PT_ASSESS_NEURO":
					group.setGroupName(i18n.NEURO);
					break;
				case "NC_PT_ASSESS_RESP":
					group.setGroupName(i18n.RESPIRATORY);
					break;
				case "NC_PT_ASSESS_CARD":
					group.setGroupName(i18n.CARDIO);
					break;
				case "NC_PT_ASSESS_GI":
					group.setGroupName(i18n.GI);
					break;
				case "NC_PT_ASSESS_GU":
					group.setGroupName(i18n.GU);
					break;
				case "NC_PT_ASSESS_MS":
					group.setGroupName(i18n.MUSCULOSKELETAL);
					break;
				case "NC_PT_ASSESS_INTEG":
					group.setGroupName(i18n.INTEGUMENTARY);
					break;
				}
			}
		} else if (DiagnosticsComponent && component instanceof DiagnosticsComponent) {
			var groups = component.getGroups();
			for (z = 0; z < groups.length; z++) {
				var group = groups[z];
				switch (group.getGroupName()) {
				case "CXR_ABD_CE":
					group.setGroupName(i18n.CHEST_ABD_XR);
					break;
				case "EKG_CE":
					group.setGroupName(i18n.EKG);
					break;
				case "OTHER_RAD_ES":
					group.setGroupName(i18n.OTHER_DIAGNOSTICS);
					break;
				}
			}
		} else if (LaboratoryComponent && component instanceof LaboratoryComponent) {
			var groups = component.getGroups();
			for (z = 0; z < groups.length; z++) {
				var group = groups[z];
				switch (group.getGroupName()) {
				case "LAB_PRIMARY_CE":
					group.setGroupName(i18n.PRIMARY_RESULTS);
					break;
				case "LAB_SECONDARY_ES":
					group.setGroupName(i18n.SECONDARY_RESULTS);
					break;
				}
			}
		}
	}

	mPage.setCustomizeEnabled(false);

	// Set up shells.
	mPage.setName(him_mp_coding_i18n.PAGE_TITLE);
	MP_Util.Doc.InitLayout(mPage);
	// Demographics banner needs to be loaded here.
	if (mPage.isBannerEnabled()) {
		CERN_DEMO_BANNER_O1.GetPatientDemographics(_g("banner"), criterion);
	}
	// Load data.
	HIM_Coding_Util.insertData(mPage);
}