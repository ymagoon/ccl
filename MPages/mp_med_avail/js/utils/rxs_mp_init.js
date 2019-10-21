
/**
 * Default component initializer
 * @param component
 * @returns
 */
function DefaultInitializer(component){
	
	DefaultInitializer.method("initialize", function() {
		// do nothing
	});
}

/**
 * CFN MedicationComponent initializer
 * @param component
 */
function CFNMedicationComponentInitializer(component){
	
	if( !(component instanceof MedicationsComponent) ){
		throw "Component must be MedicationsComponent"
	}else{
		this.component = component;
	}
	
	DefaultInitializer.method("initialize", function() {
		
		// default values
		var lookBackHours = 2;
		var lookAheadHours = 6;
		
		try{
			var dueTaskViewKey = "DUE_TASK_VIEW";
			var hideMedRequestKey = "HIDE_MED_REQUEST";

			var preferenceKeys = [dueTaskViewKey, hideMedRequestKey];
			var criterion = component.getCriterion();
			
			var get_adm_preferences_request = new Object();
			get_adm_preferences_request.adm_prefs_request_qualifiers = new Object();
			get_adm_preferences_request.adm_prefs_request_qualifiers.encounter_id = criterion.encntr_id + ".0";
			get_adm_preferences_request.adm_pref_names = new Array();
			get_adm_preferences_request.adm_type_flag = 0;
			var admPrefNames = [];
			var noOfpreferenceKey = preferenceKeys.length;
		 		for (var idx = 0; idx < noOfpreferenceKey; idx++) {
				var admPrefName = {};
				admPrefName.name = preferenceKeys[idx];
				admPrefNames.push(admPrefName);
			}
			get_adm_preferences_request.adm_pref_names = admPrefNames;		
			
			
			
			var preferenceRetriever = new PreferenceRetriever();
			var preferences = preferenceRetriever.getPreferences(get_adm_preferences_request);
			
			var lookBackHoursKey = "lookBackHours";
			var lookForwardHours = "lookForwardHours";
			
			
			
			for (var idx = 0; idx < noOfpreferenceKey; idx++) {
				var prefKey = preferenceKeys[idx];
				var preference = preferences.getPreference(prefKey);
				if( preference == null ){
					return;	
				}
				//alert(JSON.stringify(preference, null, 4));
				if (preference) {
					switch(preference.key) {
						case dueTaskViewKey:
							var duePrefs = preference.split();
							// get values
							for(var pIdx=0 in duePrefs){
								var pref = duePrefs[pIdx];
								
								var num = new Number(pref.getValue());
								
								if(pref.getKey() == lookBackHoursKey && num != Number.NaN){
									lookBackHours = num.valueOf();
								}else if( pref.getKey() == lookForwardHours && num != Number.NaN){
									lookAheadHours = num.valueOf();
								}
							}
							break;
						case hideMedRequestKey:
							// default is to show the med request link
							var preferenceValue = false;
							if (preference && preference.getValue().toUpperCase() === "TRUE") {
								preferenceValue = true;
							}
							component.setHideMedRequest(preferenceValue);
							break;
					}
				}
			}
			
		}catch(err){
			var details = (err.message == null || err.message == "") ? err : err.message
			var message = i18n.ERROR_PREFERENCE_RETRIEVAL.replace("{0}", (details == null || details=="") ? "" : details);
		}finally{
			component.setLookBackHours(lookBackHours);
			component.setLookAheadHours(lookAheadHours);
		}
		
	});
}
CFNMedicationComponentInitializer.inherits(DefaultInitializer);