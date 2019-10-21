if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
	var ieVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
	var ieVersion=0;
}

var fwrite = function(file, sText){
            try {
                var ForWriting = 2;
                var TriStateFalse = 0;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var newFile = fso.OpenTextFile("c:\\temp\\"+file, ForWriting, true, TriStateFalse);
                newFile.write(sText);
                newFile.close();
            } 
            catch (err) {
                var strErr = 'Error:';
                strErr += '\nNumber:' + err.number;
                strErr += '\nDescription:' + err.description;
                document.write(strErr);
            }
        };

function RenderPage()
{
	var js_criterion = JSON.parse(m_criterionJSON);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	var mpageName = "MP_NEWBORN_SUMMARY";

			 
	
	// In order to retrieve the common styles for components, each consumer will have to create
	// a mapping of the potential bedrock component names to a common component name.  Our examples is using the Inpatient Summary
	// MPage as our example.  We are just pulling in a few components for functionality.  Do note that the component has to be enabled
	// to display within bedrock otherwise your component may not display in our example.
	
	var inptComponentMapping = new Array(
		new MP_Core.MapObject("mp_nbs_overview", OverviewComponent),
		new MP_Core.MapObject("mp_nbs_task_timeline", TaskTimelineComponent),
		new MP_Core.MapObject("mp_nbs_lab", LaboratoryComponent),
		new MP_Core.MapObject("mp_nbs_micro", MicrobiologyComponent),
		new MP_Core.MapObject("mp_nbs_hyperbili", BilirubinComponent),
		new MP_Core.MapObject("mp_nbs_weight", MeasurementComponent),
		new MP_Core.MapObject("mp_nbs_vs", VitalSignComponent),
		new MP_Core.MapObject("mp_nbs_fld_bal", IntakeOutputComponent),
		new MP_Core.MapObject("mp_nbs_meds", MedicationsComponent),
		new MP_Core.MapObject("mp_nbs_diagnosis", DiagnosesComponent),
		new MP_Core.MapObject("mp_nbs_problem", ProblemsComponent),
		new MP_Core.MapObject("mp_nbs_proc_hx", ProcedureComponent),
		new MP_Core.MapObject("mp_nbs_rad", DiagnosticsComponent),
		new MP_Core.MapObject("mp_nbs_clin_doc", DocumentComponent),
		new MP_Core.MapObject("mp_nbs_education", EducationComponent),
		new MP_Core.MapObject("mp_nbs_dc_plan", DischargePlanComponent)
	);

	var compFuncFilterMapping = new Array( 
	new MP_Core.MapObject( 
	  'mp_nbs_meds', 
	  '{"FUNCTIONS":[' 
		  + '{"FILTER_MEAN": "MEDS_SCHED", "NAME":"setScheduled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_PRN", "NAME":"setPRN", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_DISC", "NAME":"setDiscontinued", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_ADM", "NAME":"setAdministered", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_SUS", "NAME":"setSuspended", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_CONT", "NAME":"setContinuous", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_ADM_LB_HRS", "NAME":"setAdministeredLookBkHrs", "TYPE":"Number", "FIELD": "FREETEXT_DESC"},' 
		  + '{"FILTER_MEAN": "MEDS_DISC_LB_HRS", "NAME":"setDiscontinuedLookBkHr", "TYPE":"Number", "FIELD": "FREETEXT_DESC"},' 
		  + ']}')); 
		  
	var pageFuncFilterMapping = new Array(
		new MP_Core.MapObject('BANNER','{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}')
	);	
		  
	//Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName) 
	loadingPolicy.setCriterion(criterion); 
	var inptMPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, inptComponentMapping, pageFuncFilterMapping, compFuncFilterMapping);	

	//setup filter to only display a component when the patient is female
	//var sexFilter = new MP_Core.CriterionFilters(criterion);
	//sexFilter.addFilter(MP_Core.CriterionFilters.SEX_MEANING, "FEMALE");

	//setup filter to only display a component when the patient is less than or equal to 22 years of age
	//var dateFilter = new MP_Core.CriterionFilters(criterion);
	// var dateCheck = new Date()
	// dateCheck.setFullYear(dateCheck.getFullYear() - 22)
	// dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);	
	
	var components = inptMPage.getComponents();
	inptMPage.setName(i18n_nb.NBS_MPAGE_TITLE);
	inptMPage.setHelpFileURL("https://wiki.ucern.com/display/r1mpagesHP/Nursing+Communication+Help");	
	
	if (components != null) {
		for (var y = components.length; y--;) {
			var component = components[y];
			if (component instanceof DiagnosticsComponent) {
				var groups = components[y].getGroups();
				for (var z = 0; z < groups.length; z++) {
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
					};
				}
			}
            else if (components[y] instanceof VitalSignComponent) {
                var groups = components[y].getGroups();
                if (groups != null) {
                    for (var z = groups.length; z--;) {
                        var group = groups[z];
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
                        };
                    }
                }
            } 
            else if (components[y] instanceof LaboratoryComponent) {
                var groups = components[y].getGroups();
                if (groups != null) {
                    for (var z = groups.length; z--;) {
                        var group = groups[z];
                        switch (group.getGroupName()) {
                            case "ED_LAB_PRIMARY_CE":
                                group.setGroupName(i18n.PRIMARY_RESULTS);
                                break;
                            case "ED_LAB_SECONDARY_ES":
                                group.setGroupName(i18n.SECONDARY_RESULTS);
                                break;
						}
                    }
                }
            }
		}
	}
	
	inptMPage.getComponents().sort(SortMPageComponents);
	//Setup Single MPage
	MP_Util.Doc.InitLayout(inptMPage);
	if(inptMPage.isBannerEnabled())
	{
		var patDemo = _g("banner");
		CERN_NB_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}

	if (CERN_MPageComponents != null){
		for (var x = CERN_MPageComponents.length;x--;){
			CERN_MPageComponents[x].InsertData();
		}
	}
}

