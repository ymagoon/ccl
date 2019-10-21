/**
 * Medication Reuest MedicationComponent initializer
 * @param component
 */
function MReqMedicationComponentInitializer(component) {

	if (!( component instanceof MedicationsComponent)) {
		throw "Component must be MedicationsComponent";
	} else {
		this.component = component;
	}

	DefaultInitializer.method("initialize", function() {

		try {

			var displayDispLctnKey = "default.med.displayDispLctn";
			var displayQueueButtonKey = "default.med.displayQueueButton";
			var allowPriorityAssignmentKey = "default.med.allowPriorityAssignment";

			var preferenceKeys = [displayDispLctnKey, displayQueueButtonKey, allowPriorityAssignmentKey];

			var criterion = component.getCriterion();

			var get_adm_preferences_request = {};
			get_adm_preferences_request.adm_prefs_request_qualifiers = {};
			get_adm_preferences_request.adm_prefs_request_qualifiers.encounter_id = criterion.encntr_id + ".0";
			get_adm_preferences_request.adm_pref_names = [];
			get_adm_preferences_request.adm_type_flag = 1;
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

			for (var idx = 0; idx < noOfpreferenceKey; idx++) {
				var prefKey = preferenceKeys[idx];
				var preference = preferences.getPreference(prefKey);
				var preferenceValue = false;
				if (preference && preference.getValue() === "TRUE") {
					preferenceValue = true;
				}
				if (preference) {
					switch(preference.key) {
						case displayDispLctnKey:
							component.setDisplayDispenseLocation(preferenceValue);
							break;
						case displayQueueButtonKey:
							component.setDisplayQueueButton(preferenceValue);
							break;
						case allowPriorityAssignmentKey:
							component.setAllowPriorityAssignment(preferenceValue);
							break;
					}
				}
			}
		} catch(err) {
			var details = (err.message == null || err.message == "") ? err : err.message
			var message = i18n.ERROR_PREFERENCE_RETRIEVAL.replace("{0}", (details == null || details == "") ? "" : details);
		}

	});
}

MReqMedicationComponentInitializer.inherits(DefaultInitializer);
