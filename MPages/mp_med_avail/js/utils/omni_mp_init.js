
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
 * Omnicell MedicationComponent initializer
 * @param component
 */
function OmnicellMedicationComponentInitializer(component) {
    // default values
    var defaultLookBackHours = 2;
    var defaultLookAheadHours = 6;
    
    if (!(component instanceof MedicationsComponent)) {
        throw "Component must be MedicationsComponent"
    } else {
        this.component = component;
    }
    
    DefaultInitializer.method("initialize", function() {
        var lookBackHoursKey = "lookBackHours";
        var lookAheadHoursKey = "lookForwardHours";
        
        var lookBackHours = Session.get(lookBackHoursKey);
        var lookAheadHours = Session.get(lookAheadHoursKey);
        
        try{
            if (lookBackHours == undefined || lookAheadHours == undefined) {    
                lookBackHours = defaultLookBackHours;
                lookAheadHours = defaultLookAheadHours;
                
                var preferenceKey = "DUE_TASK_VIEW";
                var criterion = component.getCriterion();
                
                var get_adm_preferences_request = new Object();
                get_adm_preferences_request.adm_prefs_request_qualifiers = new Object();
                get_adm_preferences_request.adm_prefs_request_qualifiers.encounter_id = criterion.encntr_id + ".0";
                get_adm_preferences_request.adm_pref_names = new Array();
                
                var adm_pref_name = new Object();
                adm_pref_name.name = preferenceKey;
                get_adm_preferences_request.adm_pref_names.push(adm_pref_name);
                
                var preferenceRetriever = new PreferenceRetriever();
                var preferences = preferenceRetriever.getPreferences(get_adm_preferences_request);
                
                // get the preference
                var preference = preferences.getPreference(preferenceKey);
                if (preference == null) {
                    return;
                }
                
                // the preference is stored in the format of: lookBackHours=0, lookForwardHours=11
                var duePrefs = preference.split();
                
                // get values
                for (var pIdx = 0 in duePrefs) {
                    var pref = duePrefs[pIdx];
                    
                    var num = new Number(pref.getValue());
                    
                    if (pref.getKey() == lookBackHoursKey && num != Number.NaN) {
                        lookBackHours = num.valueOf();
                        Session.set(lookBackHoursKey, lookBackHours);
                    } else if (pref.getKey() == lookAheadHoursKey && num != Number.NaN) {
                        lookAheadHours = num.valueOf();
                        Session.set(lookAheadHoursKey, lookAheadHours);
                    }
                }
            }
        } catch (err) {
            var details = (err.message == null || err.message == "") ? err : err.message
            var message = i18n.ERROR_PREFERENCE_RETRIEVAL.replace("{0}", (details == null || details=="") ? "" : details);
        } finally {
            component.setLookBackHours(lookBackHours);
            component.setLookAheadHours(lookAheadHours);
        }
    });
}

OmnicellMedicationComponentInitializer.inherits(DefaultInitializer);