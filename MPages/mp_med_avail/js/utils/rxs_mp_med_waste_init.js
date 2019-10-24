/**
* Default component initializer
* @param component
* @returns
*/
function DefaultInitializer(component) {

    DefaultInitializer.method("initialize", function () {
        // do nothing
    });
}

/**
* RxStation MedWasteComponent initializer
* @param component
*/
function RXSMedWasteComponentInitializer(component) {

    if (!(component instanceof RxsMedWasteComponent)) {
        throw "Component must be RxsMedWasteComponent"
    } else {
        this.component = component;
    }

    DefaultInitializer.method("initialize", function () {

        // default values
        var lookBackHours = 24;
        var defaultWasteMode = null;

        try {

            var preferenceKeys = ["default.waste.quantity", "waste.default.lookback"];

            var criterion = component.getCriterion();

            var get_adm_preferences_request = new Object();
            get_adm_preferences_request.adm_prefs_request_qualifiers = new Object();
            get_adm_preferences_request.adm_prefs_request_qualifiers.encounter_id = criterion.encntr_id + ".0";
            get_adm_preferences_request.adm_pref_names = new Array();
            get_adm_preferences_request.adm_type_flag = 1;
            var admPrefNames = [];
            for (var idx in preferenceKeys) {
                var admPrefName = new Object();
                admPrefName.name = preferenceKeys[idx];
                admPrefNames.push(admPrefName);
            }
            get_adm_preferences_request.adm_pref_names = admPrefNames;
            var preferenceRetriever = new PreferenceRetriever();
            var preferences = preferenceRetriever.getPreferences(get_adm_preferences_request);
           
            var defaultWasteKey = preferenceKeys[0];
            var lookBackHoursKey = preferenceKeys[1];

            for (var idx in preferenceKeys) {
                var prefKey = preferenceKeys[idx].toString();
                var preference = preferences.getPreference(prefKey);
                if (preference != null) {
                    if (preference.key == lookBackHoursKey && num != Number.NaN) {
                        var num = new Number(preference.getValue());
                        lookBackHours = num.valueOf();
                    } else if (preference.key == defaultWasteKey) {
                        defaultWasteMode = preference.value;
                    }

                }
            }

        } catch (err) {
            var details = (err.message == null || err.message == "") ? err : err.message
            var message = i18n.ERROR_PREFERENCE_RETRIEVAL.replace("{0}", (details == null || details == "") ? "" : details);
        } finally {
            component.setLookBackHours(lookBackHours);
            component.setWasteMode(defaultWasteMode);
        }

    });
}
RXSMedWasteComponentInitializer.inherits(DefaultInitializer);