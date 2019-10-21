/**
 * Collection of PatientModel
 * @author Aaron Nordyke - AN015953
 * @requires
 * Backbone,Underscore,jQuery,BhInfoModel,PtInfoModel,PatientModel,UtilJsonXml,TimeIntervalGenerator
 * Dependency:	File "translation.safety.json"
					Namespaces used: 
						"DashboardDeaderHandlebar",
						"TimeIntervalSelectHandlebar" ,
						"PatientCollection".
 
 */
var PatientCollection = Backbone.Collection.extend({

	/**
	 * Collection model
	 */
	model : PatientModel,

	/**
	 * Array of time intervals
	 */
	timeIntervals : [],

	/**
	 * Currently selected time interval
	 */
	selectedInterval : 15,

	resetIntervalValue : "",
	/**
	 *  Currently selected time range
	 */
	selectedRange : 4,
	
	addFlag : 0,

	/**
	 * Initialized Collection.  Uses UtilJsonXml supplied or creates new one
	 * @example var patientCollection = new
	 * PatientCollection([[],{json_handler:json_handler});
	 */
	initialize : function() {
		//bind all callbacks that use certain member functions.
		_.bindAll(this);

		if(this.BhInfoModel) {
			this.BhInfoModel.destroy();
		}
		if(this.PtInfoModel) {
			this.PtInfoModel.destroy();
		}
		if(this.MultiSelectModel) {
			this.MultiSelectModel.destroy();
		}

		this.BhInfoModel = new BhInfoModel;
		this.PtInfoModel = new PtInfoModel;
		this.MultiSelectModel = new MultiSelectModel;
		this.BhInfoModel.bind("change", this.fillPatientsBhInfo);
		this.PtInfoModel.bind("change", this.fillPatientsPtInfo);
		this.BhInfoModel.bind("changeBatchActivities",this.getBatchActivities);
		this.bind("change:json_handler", function() {
			this.BhInfoModel.json_handler = this.json_handler;
			this.PtInfoModel.json_handler = this.json_handler;
			this.unbind("change:json_handler");
		});
	},
	/**
	 * Gets data via BhInfoModel and PtInfoModel
	 * @param {Object} patientList
	 */
	retrieve : function(patientList) {
		this.resetIntervalValue=true;
		
		this.addFlag = 0;
	
		this.trigger("started-loading");

		this.destroyCollection();

		this.BhInfoModel.clear({
			silent : true
		});
		this.PtInfoModel.clear({
			silent : true
		});
		this.MultiSelectModel.set({
			selectedPatient : []
		},{
			silent : true
		});
		this.BhInfoModel.retrieveAppPrefForSA();
		this.retrivePatients(patientList);//Get the patients details and respective activities
	},
	
	/**
	 * Gets each patient details from patient list and each patient respective activities 
	 * @param {Object} patientList*/
	
	retrivePatients: function(patientList){
		this.BhInfoModel.retrieve(patientList);
		var bhinfo  = this.BhInfoModel.get("BHINFO");
		this.PtInfoModel.retrieve(patientList);
		var patients = this.PtInfoModel.get("PTINFO"); // To retrieve bhreply from ptinfomodel
		var timeRange = this.selectedRange;
		//Checks for the patients length, if empty patientlist is selected then do not call
		if(patients.PATIENTS.length > 0){
			this.getBhPatientsActivities(patients , timeRange); //fills the activities for the patients that got loaded
		}
	},
		 
	getBhPatientsActivities	: function(patients , timeRange){
	mConsole.log("patientcollection.getBhPatientsActivities"+JSON.stringify(patients)+""+timeRange,mConsole.debug_level_info);
		this.BhInfoModel.getBhPatientsActivities(patients, timeRange);
	},
	
	getBatchActivities : function(response){
	mConsole.log("patientcollection.getBatchActivities"+JSON.stringify(response),mConsole.debug_level_info);
		var activities = response, patient;
		if (activities === undefined){
			activities = {LIST : []};
		}
		for(var index = 0, activitiesLength = activities.LIST.length; index < activitiesLength; index++) {
			patient = this.detect(function(patientModel) {
				return patientModel.get("encntr_id") === activities.LIST[index].EID;
			});
			if(!_.isEmpty(patient)){
				 patient.createActivityModelsFromEvents(activities.LIST[index].EVENTS);
				patient.trigger("changePatientActivities"); 	
			 }
			
		}
	},
	
	/**
	 * Callback after BhInfoModel is finished.  Creates PatientModel(s) or fills
	 * current ones.
	 * If PtInfoModel is also finished, this triggers an "add" event.
	 */
	fillPatientsBhInfo : function() {
		var bhinfo = this.BhInfoModel.get("BHINFO"), patient;
		var LIST = bhinfo.LIST;
		var offUnitEvent = bhinfo.OFFUNITEVENT;
		var defaultTime = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		for(var i = 0, l = bhinfo.LIST.length; i < l; i++) {
			patient = this.detect(function(patientModel) {
				return patientModel.get("encntr_id") === bhinfo.LIST[i].EID;
			});
			//if patient doesn't exist, then create it
			if(_.isEmpty(patient)) {
				patient = this.addNewPatientFromBhInfo(LIST[i]);
				patient.set({
					offunitevent : offUnitEvent
				});
			}
			//patient exists,so add to it
			else {
				patient.set({
					showimage_ind : this.BhInfoModel.get("APP_PREF").SHOWIMAGE_IND
				});
				patient.setBhInfo(LIST[i]);
				patient.set({
					location_activities : this.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
				});
				patient.set({
					offunitevent : offUnitEvent
				});
				this.trigger("add");
			}
			patient.userPrefModel.trigger("change:offunitstatus");
		}

		this.trigger("change:timeIntervalOptions");
		if (this.resetIntervalValue == true){
					if(defaultTime){
							var initialInterval = this.getDefaultTimeIntervalToDisplay();
					}
					else{
							var initialInterval = this.getIntervalForLocation();
					}
						if(initialInterval){
								this.createTimeIntervals(initialInterval.LOCTM);
							}
			}
			else{
				this.createTimeIntervals(this.selectedInterval);
			}

		//checked that other required data has come in
		if(!_.isEmpty(this.PtInfoModel.get("PTINFO"))) {
			this.trigger("finished-loading");
		}
	},
	/**
	 * Create new patient from BhInfo data and add it to collection
	 * @param {Object} bhPatient patient data from bhInfoModel
	 * @return {Object} patient
	 */
	addNewPatientFromBhInfo : function(bhPatient) {	
		var bhinfo = this.BhInfoModel.get("APP_PREF"), patient;
		patient = new PatientModel;
		patient.set({
			showimage_ind : bhinfo.SHOWIMAGE_IND
		});
		patient.setBhInfo(bhPatient);
		patient.set({
			location_activities : this.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
		});
		this.add(patient, {
			silent : true
		});
		return patient;
	},
	/**
	 * Callback after PtInfoModel is finished.  Creates PatientModel(s) or fills
	 * current ones.
	 * If BhInfoModel is also finished, this triggers an "add" event.
	 */
	fillPatientsPtInfo : function() {
		var ptinfo = this.PtInfoModel.get("PTINFO");
		var PATIENTS = ptinfo.PATIENTS;
		for(var i = 0, l = PATIENTS.length; i < l; i++) {

			//if patient model already exists, retrieve it
			var patient = this.detect(function(patientModel) {
				return patientModel.get("encntr_id") === PATIENTS[i].ENCNTR_ID;
			});
			//if patient doesn't exist, then create it
			if(_.isEmpty(patient)) {
				patient = this.addNewPatientFromPtInfo(PATIENTS[i]);
			}
			//patient exists,so add to it
			else {
				patient.setPtInfo(PATIENTS[i]);
				this.trigger("add");
			}
		}
		//check that other required data has come in
		if(!_.isEmpty(this.BhInfoModel.get("BHINFO"))) {
			this.trigger("finished-loading");
		}
	},
	/**
	 * Create new patient from PtInfo data and add it to collection
	 * @param {Object} ptPatient patient data from ptInfoModel
	 * @return {patient}
	 */
	addNewPatientFromPtInfo : function(ptPatient) {
		var patient = new PatientModel;
		patient.setPtInfo(ptPatient);
		this.add(patient, {
			silent : true
		});
		return patient;
	},
	/**
	 * Gets optional time intervals, in minutes, from BhInfoModel
	 * @return {Array} Time Intervals, sorted ascending by size of interval
	 */
	getTimeIntervalOptions : function() {

		var uniqueTimes =[], bhinfo = this.BhInfoModel.get("APP_PREF");
		var defaultTimeInterval = bhinfo.RETRIEVE_DEFAULT_TIME;
		
		//always return an array
		if(_.isEmpty(bhinfo)) {
			return [];
		}

		var LOCTIME = bhinfo.LOCTIME;
		//remove any duplicate time interval lengths
		if(!_.isEmpty(LOCTIME)){
			if(defaultTimeInterval){
			uniqueTimes.push({
				LOCCD : 0.0,
				LOCDISP : "DEFAULT",
				LOCDESC : "DEFAULT", 
				LOCTM: defaultTimeInterval});
			}
			for(var i = 0, l = LOCTIME.length; i < l; i++) {
				var contains = _.any(uniqueTimes, function(uniqueTime) {
					return uniqueTime.LOCTM === LOCTIME[i].LOCTM;
				});
				if(!contains) {
					uniqueTimes[uniqueTimes.length] = LOCTIME[i];
					//uniqueTimes.push(LOCTIME[i]);
				}
			}
			return uniqueTimes.sort(function(a, b) {
				return a.LOCTM - b.LOCTM;
			});
		}
		else{
			return this.getDefaultTimeIntervalOptions();
		}
	},
	/**
	 * Gets optional time ranges, in hours
	 * @return {Array} Time Ranges
	 */
	getTimeRangeOptions : function(){
		var ranges = _.range(4, 13);
		var hours = [];
		_.each(ranges, function(range){
			hours.push({HOUR:range+ " " + $.i18n.t("TimeIntervalSelectHandlebar.HOURS")});
		});
		return hours;
	},
	/**
	 * Get Default Time Interval Options, which are hard-coded to [15,30,60,120]
	 * @return {Array} Default Time Interval Option objects
	 */
	getDefaultTimeIntervalOptions : function() {
		var LOCTIME = [];
		var DEFAULTLOCTIME = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		if(DEFAULTLOCTIME){
			var defaultLocTm =  [DEFAULTLOCTIME,15,30,60,120];
			for(var i = 0, l = defaultLocTm.length; i < l; i++) {

				var contains = _.any(LOCTIME, function(locationTime) {
						return locationTime.LOCTM === defaultLocTm[i];
					});
					if(!contains) {
					
				LOCTIME[LOCTIME.length] = {
					LOCCD : 0.0,
					LOCDISP : "DEFAULT",
					LOCDESC : "DEFAULT",
					LOCTM : defaultLocTm[i]
				};			
					}
			}
			return LOCTIME.sort(function(a,b){
				return a.LOCTM - b.LOCTM;
			});	
		}
		else{
			var defaultLocTm =  [15,30,60,120];
				for(var i = 0, l = defaultLocTm.length; i < l; i++) {
					LOCTIME[LOCTIME.length] = {
						LOCCD : 0.0,
						LOCDISP : "DEFAULT",
						LOCDESC : "DEFAULT",
						LOCTM : defaultLocTm[i]
					};
				}
				return LOCTIME;	
		}	
	},
	
	//To retrieve default time interval when S & A is loaded
	getDefaultTimeIntervalToDisplay : function() {
		var defaultLocTm = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		var LOCTIME = [];
		if(defaultLocTm){
			LOCTIME = {
					LOCCD : 0.0,
					LOCDISP : "DEFAULT",
					LOCDESC : "DEFAULT",
					LOCTM : defaultLocTm
				}
			return LOCTIME;
		}
	},
	
	/**
	 * Get location time interval, based on location of first patient in the list.
	 * @return {Object} - Location Interval Object, based on location of first
	 * patient in list.
	 * If no location is found, the smallest interval in the list is returned.
	 */
	getIntervalForLocation : function() {
		var firstPatient = this.first(), bhinfo = this.BhInfoModel.get("APP_PREF");

		if(!_.isEmpty(firstPatient)) {
			var nurse_unit_cd = firstPatient.get("nurse_unit_cd");
			//find interval for location, if it exists
			var loctime = _.detect(bhinfo.LOCTIME, function(loctime) {
				return nurse_unit_cd == loctime.LOCCD;
			});
			var defaultTime = bhinfo.RETRIEVE_DEFAULT_TIME; 
			return !_.isEmpty(loctime) ? loctime : _.first(this.getTimeIntervalOptions());
		} else {
			return null;
		}
	},
	/**
	 * Creates time intervals from supplied interval and triggers a
	 * "change:timeInterval" event.
	 * @param {Integer} interval
	 */
	createTimeIntervals : function(interval) {
		this.timeIntervalGenerator = timeIntervalGenerator(interval, new Date(), this.selectedRange);
		this.timeIntervals = this.timeIntervalGenerator.getIntervals();
		this.selectedInterval = interval;
		this.trigger("change:timeIntervals");
	},
	/**
	 * Change the time range
	 * "change:timeRange" event.
	 * @param {Integer} interval
	 */
	setTimeRange : function(hour){
		//To retrieve patients activities on change of time range for patients in the patientlist
		mConsole.log("patientcollection.setTimeRange"+hour,mConsole.debug_level_info);
		this.selectedRange = hour;
		var patientList = this.patientListsModel.get("selectedList");	   
		this.retrivePatients(patientList);
		
		//To retrieve patients activities on change of time range for adhocly added  patients
		var addedPatients = WindowStorage.get("AddedPatients");
		if(addedPatients!=="undefined"){
			try{
				addedPatients = jQuery.parseJSON(addedPatients);
				var that = this;
				
				var foundPtlist = _.detect(addedPatients, function(ptlist){
					
					return _.isEqual(ptlist.selectedList, patientList);
				});
				
				if(foundPtlist){
					var jsonObj = {
						"pt_cnt" : foundPtlist.addedPatients.length,
						"page_cnt" : 0,
						"patients" : []
					};
					_.each(foundPtlist.addedPatients, function(patient){
						var ptObj = {
							"PT_ID": patient.person_id,
							"ENCNTR_ID": patient.encntr_id,
							"ENCNTR_TYPECD": patient.encntr_type_cd,
							"NAME": patient.name,
							"BIRTH_DT": patient.birth_dt,
							"ADMIT_DT": patient.admit_dt
						};
						jsonObj.patients.push(ptObj);
					});
					//To retrieve patient details and activities using newpatientmodel 
					var newPtModel = new NewPatientModel(jsonObj);
					newPtModel.patients = this;
					//'SKIP_DUPLICATE_PATIENT_CHECK' is passed to getBhInfo() of newpatientmodel  
					newPtModel.getBhInfo(newPtModel.mode.SKIP_DUPLICATE_PATIENT_CHECK);
				}
			}
			catch(err){
			alert(err.message);
			}
		}
	},
	
	resetInterval: function(){
		this.resetIntervalValue = true;
	},
	
	/**
	 * Sorts Collection by Location.  Triggers a "sort" event.
	 */
	sortPatientsByLocation : function() {
		if(this.updateIcon(".location-sort")===0){
		this.models = this.sortBy(function(patient) {
			return patient.get("nurse_unit")+patient.get("room")+patient.get("bed");
		});
		}
		else{
			this.models = this.sortBy(function(patient) {
				return -patient.get("nurse_unit")+patient.get("room")+patient.get("bed");
			}).reverse();
		}
		this.trigger("sort");
		this.resetIcon(".patient-sort");
		this.resetIcon(".suicide-sort");
		this.resetIcon(".fall-sort");
	},
	/**
	 * Sorts Collection by Patient Name.  Triggers a "sort" event.
	 */
	sortPatientsByName : function() {
		if(this.updateIcon(".patient-sort")===0){
		this.models = this.sortBy(function(patient) {
			return patient.get("name");
		});
		}
		else{
			this.models = this.sortBy(function(patient) {
				return -patient.get("name");
			}).reverse();
		}
		this.trigger("sort");
		this.resetIcon(".suicide-sort");
		this.resetIcon(".fall-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Sorts Collection by Fall Risk. Triggers a "sort" event.
	 */
	sortPatientsByFallRisk : function() {
		if(this.updateIcon(".fall-sort")===0){
			this.models = this.sortBy(function(patient) {
				return patient.get("fall_risk").length ? 0 : 1;
			});
		}
		else{
			this.models = this.sortBy(function(patient) {
				return patient.get("fall_risk").length ? 0 : 1;
			}).reverse();
		}
		this.trigger("sort");
		this.resetIcon(".patient-sort");
		this.resetIcon(".suicide-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Sorts Collection by Suicide Risk. Triggers a "sort" event.
	 */
	sortPatientsBySuicideRisk : function() {
		var max = this.max(function(patient){return patient.get("suicide_risk_seq");}).get("suicide_risk_seq")+1;
		var risk;
		if(this.updateIcon(".suicide-sort")===0){
			this.models = this.sortBy(function(patient) {
				risk=patient.get("suicide_risk_seq");
				if(risk===0)
					return max;
				else
					return patient.get("suicide_risk_seq");
			});
		}
		else{
			this.models = this.sortBy(function(patient) {
				risk=patient.get("suicide_risk_seq");
				if(risk===0)
					return max;
				else
					return patient.get("suicide_risk_seq");
			}).reverse();
		}

		this.trigger("sort");
		this.resetIcon(".patient-sort");
		this.resetIcon(".fall-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Update the sort icon
	 */
	updateIcon : function(classname) {
		var url = $(classname).attr("src");
		if(url.match(/bg.gif$/)) {
			$(classname).attr("src", url.replace(/bg.gif$/, $.i18n.t("PatientCollection.SORTING_ASC_WITHOUT_PATH")));
			return 0;
		} else if(url.match(/asc.gif$/)) {
			$(classname).attr("src", url.replace(/asc.gif$/, $.i18n.t("PatientCollection.SORTING_DESC_WITHOUT_PATH")));
			return 1;
		} else {
			$(classname).attr("src", url.replace(/desc.gif$/, $.i18n.t("PatientCollection.SORTING_ASC_WITHOUT_PATH")));
			return 0;
		}
	},
	/**
	 * Reset the sort icon
	 */
	resetIcon : function(classsname) {
		var url = $(classsname).attr("src");
		if(url.match(/asc.gif$/)){
			$(classsname).attr("src", url.replace(/asc.gif$/, $.i18n.t("DashboardHeaderHandlebar.BG_IMG_WITHOUT_PATH")));
		}
		else if(url.match(/desc.gif$/)){
			$(classsname).attr("src", url.replace(/desc.gif$/, $.i18n.t("DashboardHeaderHandlebar.BG_IMG_WITHOUT_PATH")));
		}
	},
	/**
	 * Gets all unsaved activities from Collection
	 * @returns {Array} unsaved ActivityModel(s)
	 */
	getUnsavedActivities : function() {
		var unsavedActivities = [];
		var patients = this.models;
		for(var i = 0, l = patients.length; i < l; i++) {
			unsavedActivities = unsavedActivities.concat(patients[i].activities.getUnsavedActivities());
		}

		return unsavedActivities;
	},
	/**
	 * Gets all InError activities from Collection
	 * @returns {Array} InError ActivityModel(s)
	 */
	getInErrorActivities : function() {
		var inErrorActivities = [];
		var patients = this.models;
		for(var i = 0, l = patients.length; i < l; i++) {
			inErrorActivities = inErrorActivities.concat(patients[i].activities.getInErrorActivities());
		}

		return inErrorActivities;
	},
	/**
	 * Destroys collection
	 */
	destroyCollection : function() {
		this.destroyPatients();
		this.reset();
	},
	/**
	 * Destroys each patient in collection
	 */
	destroyPatients : function() {
		var patient;
		for(var i = this.length - 1; i >= 0; i--) {
			patient = this.models[i];
			patient.destroyPatient();
		}
	}
});
