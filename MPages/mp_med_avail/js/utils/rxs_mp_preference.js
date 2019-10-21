/**
 * Retriever that gets preferences from the service
 * @returns
 */
function PreferenceRetriever(){
	
	this.serviceName = "GET_ADM_PREFERENCES";
	
	PreferenceRetriever.method("getPreferences", function(get_adm_preferences_request) {
		
		// convert to json
		var jsonReq = new Object();
		jsonReq.get_adm_preferences_request = get_adm_preferences_request;
		var jsonStr = JSON.stringify(jsonReq);
		
		// prepare raw request
		var sendAr = [];
		sendAr.push("^MINE^"
				, "^"+this.serviceName+"^"
				, "^" + jsonStr + "^");
		
		// call sync
		var call = new XMLCclRequest();
		call.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
		call.send(sendAr.join(","));
		
		// success
		if( call.status == 200 ){
			var jsonEval = JSON.parse(call.responseText);
			var recordData = jsonEval.RECORD_DATA;
			if (recordData.STATUS_DATA.STATUS == "Z") {
				throw "Service: "+this.serviceName+" Status: "+recordData.STATUS_DATA.STATUS;
			}
			else if (recordData.STATUS_DATA.STATUS == "S") {
				var replyData = recordData.REPLY_DATA;
				var preferenceSet = new PreferenceSet();
				if( replyData == null ){
					return preferenceSet;
				}
				
				// unpack preferences
				for (var pIdx = 0 in replyData.ADM_PREFS){
					var preferenceInst = replyData.ADM_PREFS[pIdx];
					var preference = new Preference(preferenceInst.ID, preferenceInst.NAME, preferenceInst.VALUE);
					preferenceSet.addPreference(preference);
				}
				
				return preferenceSet;
			}
			else {
				var errorAr = [];
				var statusData = recordData.STATUS_DATA;
				errorAr.push("Status:",
						statusData.STATUS,
						"\nOperationName:",
						statusData.SUBEVENTSTATUS.OPERATIONNAME,
						"\nOperationStatus:",
						statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
						"\nTargetObjectName:",
						statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
						"\nTargetObjectValue:",
						statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
				throw "Service: " + this.serviceName +"\n"+errorAr;
			}
		}else{
			throw "Service: " + this.serviceName +" Status: "+call.status;
		}	
	});
}

/**
 * Set of preferences
 * @returns
 */
function PreferenceSet(){

	this.preferences = new Array();
	
	PreferenceSet.method("addPreference", function(preference) {
		
		// nothing to add
		if( preference == null ){
			return;
		}
		
		this.preferences.push(preference);
		
	});
	
	PreferenceSet.method("getPreference", function(key) {
		
		// search preferences
		for(var pIdx=0 in this.preferences){
			if( this.preferences[pIdx].key == key ){
				return this.preferences[pIdx];
			}
		}
		
		return null;
		
	});
}

/**
 * Preference
 * @param key
 * @param value
 * @returns
 */
function Preference(id, key, value){
	this.id = id;
	
	// remove all white spaces
	this.key = key.replace(/^\s+|\s+$/g,'');
	this.value = value.replace(/^\s+|\s+$/g,'');
	
	Preference.method("split", function() {
		
		if( this.value == null ){
			return new Array();
		}
		
		var values = this.value.split(",");
		var splitPrefs = new Array();
		for(var vIdx=0 in values){
			var splitValue = values[vIdx].split("=");
			if( splitValue.length != 2 ){
				continue;
			}
			
			var splitPref = new Preference(this.id, splitValue[0], splitValue[1]);
			splitPrefs.push(splitPref);
		}
		
		return splitPrefs;
		
	});
	
	Preference.method("getValue", function() {
		return this.value;
		
	});
	

	Preference.method("getKey", function() {
		return this.key;
		
	});
}
