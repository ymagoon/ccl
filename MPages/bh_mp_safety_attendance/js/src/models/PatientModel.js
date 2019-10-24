/*
 * The PatientModel represents a Patient, including clinical info and event activities
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,ActivityCollection
  
 * File "translation.safety.json"
					Namespaces used: 
						"SafetyAttendanceCommon"
 */
var PatientModel = Backbone.Model.extend({

	/**
	 * Default Values
	 */
	defaults:{
		"location_activities":[],
		"person_id":0.0,
		"encntr_id":0.0,
		"encntr_type_cd":0.0,
		"name":"",
		"fin":0.0,
		"mrn":0.0,
		"age":0,
		"birth_dt":0,
		"birth_dt_js":0,
		"gender":"",
		"org_id":0.0,
		"facility":"",
		"facility_cd":0.0,
		"nurse_unit":"",
		"nurse_unit_cd":0.0,
		"room":"",
		"bed":"",
		"length_of_stay":"",
		"admit_dt":"",
		"admit_dt_js":"",
		"observation_level":"",
		"fall_risk":"",
		"suicide_risk" : "",
		"suicide_risk_seq": 0.0,
		"suicide_risk_disp": "",
		"image_data":"",
		"showimage_ind":0,
		"offunitevent" :{
			"cecd" : 0.0,
			"nomList":[]
		},
		"gender_dislpay": "",
		"age_display" :""
	},
	
	
	/**
	 * PatientModel Constructor
	 * 
	 * @constructor
	 */
	initialize:function(){
		_.bindAll(this);
		
		this.activities = new ActivityCollection;
		this.bind("change:bhinfo",this.getPatientImage);
		this.userPrefModel = new UserPrefModel;
	},
	
	/**
	 * Sets patient information from Patient's portion of data retrieved 
	 * from PtInfoModel
	 * 
	 * @param {Object} ptinfo Patient Object from PtInfoModel 
	 */
	setPtInfo:function(ptinfo){
		this.set({
			person_id:ptinfo.PT_ID,
			encntr_id:ptinfo.ENCNTR_ID,
			encntr_type_cd:ptinfo.ENCNTR_TYPECD,
			name:ptinfo.NAME,
			fin:ptinfo.FIN,
			mrn:ptinfo.MRN,
			age:ptinfo.AGE,
			birth_dt:ptinfo.BIRTH_DT,
			birth_dt_js:ptinfo.BIRTHDTJS,
			gender:ptinfo.GENDER,
			org_id:ptinfo.ORG_ID,
			facility:ptinfo.FACILITY,
			facility_cd:ptinfo.FACILITYCD,
			nurse_unit:ptinfo.NURSE_UNIT,
			nurse_unit_cd:ptinfo.NURSE_UNITCD,
			room:ptinfo.ROOM,
			bed:ptinfo.BED,
			length_of_stay:ptinfo.LOS,
			admit_dt:ptinfo.ADMIT_DT,
			admit_dt_js:ptinfo.ADMITDTJS,
			gender_display:this.getGenderToDisplay(ptinfo.GENDER),
			age_display:this.getAgeToDisplay(ptinfo.BIRTHDTJS)
		});
	},
	
	/**
	 * Sets patient information from Patient's portion of data retrieved 
	 * from BhInfoModel
	 * 
	 * @param {Object} bhinfo Patient Object from BhInfoModel 
	 */
	setBhInfo:function(bhinfo){
		this.set({
			name:bhinfo.NAME,
			person_id:bhinfo.PID,
			encntr_id:bhinfo.EID,
			birth_dt:bhinfo.BIRTHDT,
			encntr_type_cd:bhinfo.EIDTYPE,
			admit_dt:bhinfo.ADMITDT,
			nurse_unit:bhinfo.NURSEUNITDISP,
			nurse_unit_cd:bhinfo.NURSEUNIT,
			observation_level:bhinfo.OBSERVLVL,
			fall_risk:bhinfo.FALLRISK,
			suicide_risk:bhinfo.SRISK,
			suicide_risk_seq:bhinfo.SRISKSEQ,
			suicide_risk_disp:bhinfo.SRISKDISP
		});
		this.userPrefModel.set({
			offunitstatus: {
				isoffunit : (bhinfo.OFFUNITSTATUS.OFFUNITIND===1)?true:false,
				offunitstartdt : (new Date).toDate(bhinfo.OFFUNITSTATUS.OFFUNITSTARTDT),
				cecd : bhinfo.OFFUNITSTATUS.CECD,
				nomid : bhinfo.OFFUNITSTATUS.NOMID,
				nomdisp : fixedDecodeURIComponent(bhinfo.OFFUNITSTATUS.NOMDISP)
			}
		}, {
			silent: true
		});
		this.trigger("change:bhinfo");
		this.createActivityModelsFromEvents(bhinfo.EVENTS);
	},
	
	/**
	 * Creates ActivityModels from array of patient clinical events
	 * 
	 * @param {Array} EVENTS Clinical events
	 */
	createActivityModelsFromEvents : function(EVENTS){
		var that = this;
		var timestamp = [];
		_.each(EVENTS, function(event){
			timestamp.push(event.EVENT_DT);
		});
		//get unique event time
		timestamp = _.uniq(timestamp);
		//create model for each event time
		_.each(timestamp, function(ts){
			var ce = _.filter(EVENTS, function(event){
				return event.EVENT_DT === ts;
			})
			var activityData ={
				"CNT" : 0,
				"EVENT_DT" : ce[0].EVENT_DT,
				"EVENTDTDISP" : ce[0].EVENTDTDISP,
				"LIST": []
			};
			//create list in the model
			_.each(ce, function(v){
				activityData.CNT++;
				activityData.LIST.push({
					"TYPE" : v.TYPE,
					"EVENTID" : v.EVENTID,
					"NAME" : v.NAME,
					"CLINEVENTID" : v.CLINEVENTID,
					"EVENT_CD" : v.EVENT_CD,
					"EVENT_DISP" : v.EVENT_DISP,
					"EVENT_RESULT" : v.EVENT_RESULT,
					"FREETEXT": v.FREETEXT,
					"NOMID": v.NOMEN,
					"INPUTPRT": 0.0
				});
			});
			if(!that.isEventInActivityCollection(activityData)){
				var activityModel = new ActivityModel(activityData);
				activityModel.patient = that;
				that.activities.add(activityModel);
			}
		});
	},
	
	/**
	 * Determines if ActivityModel already exists for a specific event
	 * 
	 * @param {Object} EVENT Clinical event
	 * @returns {Boolean} true if ActivityModel already exists, false otherwise
	 */
	isEventInActivityCollection : function(EVENT){
		var models = this.activities.models;
		for(var i = 0,l = models.length;i < l; i++){
			if(models[i].get("EVENT_DT") === EVENT.EVENT_DT){
				return true;
			}
		}
		return false;
	},
	
	/**
		* Function to translate the Gender of the patient and returns that character
		* @param {object} gender
		* @returns {String} Returns the First character of a patient as string
	*/
	getGenderToDisplay: function(gender){
	
			return gender.length > 0 ? $.i18n.t("Common." + gender, {defaultValue : gender.toUpperCase().substring(0,1)}) : "";
			
	
	},
	
	
	/**
		* Function to calculate Age and translate the Years, Months and Days.
		* @param {object} DOB
		* @returns {Age} Returns the age of a patient with years,months & days with translation
	*/	
		getAgeToDisplay: function(dob){
			var age_disp =
			{
				"Count" : 0,
				"Unit" : $.i18n.t("SafetyAttendanceCommon.DAYS")
			}
			var currentDate=new Date();
			var birthDtJs = new Date(dob);
			var ageInYears=currentDate.getFullYear() - birthDtJs.getFullYear();
			var ageInMonths=currentDate.getMonth()-birthDtJs.getMonth();
			var ageInDays=currentDate.getDate()- birthDtJs.getDate();
			
			if (ageInDays < 0)
			{
				var temp = this.daysPrevInMonth(currentDate.getMonth(),currentDate.getFullYear());
				ageInDays = ageInDays + temp;
				ageInMonths--;
				if (ageInMonths < 0)
				{
					ageInMonths += 12;
					ageInYears--;
				}	
			}
			if (ageInMonths < 0)
			{
				ageInMonths += 12;
				ageInYears--;
			}
			
			if(dob.length == 0) return age_disp; 
			if(ageInYears >  0)
			{
				age_disp.Count= ageInYears;
				age_disp.Unit =$.i18n.t("SafetyAttendanceCommon.YEARS"); 
			}
			else if((ageInMonths) > 0)
			{
				age_disp.Count= ageInMonths ;
				age_disp.Unit = $.i18n.t("SafetyAttendanceCommon.MONTHS");
			}
			else
			{	
				age_disp.Count = ageInDays;
				age_disp.Unit = $.i18n.t("SafetyAttendanceCommon.DAYS");
			}
			return age_disp;
		},
		
		daysPrevInMonth : function (iMonth, iYear)
		{
			//subtracting one day from current month 1 day to know number of days in previous month
			return (new Date(new Date(iYear, iMonth, 1, 0, 0, 0, 0)-86400000)).getDate();
		},	
	/**
	 * Get Patient Image, using size specified in prefmaint,exe, or medium if no size is specified
	 */
	getPatientImage : function(){
		//set default of medium if no size is supplied in prefmaint.exe
		var imageSize = Criterion.image_size ? Criterion.image_size : 3;
		if(this.get("showimage_ind") == 1){
			PatientImageRetriever.setPatientImageThumbnailValue(this,imageSize);			
		}
	},
	
	/**
	 * Destroys model, any associated view, and any ActivityModels it contains
	 */
	destroyPatient : function(){
		for(var i = this.activities.length - 1; i >= 0;i--){			
			this.activities.models[i].destroyActivity();
		}
		//remove any circular reference
		if(this.view){
			this.view = null;
		}
		this.destroy();
		//unbind all events for model
		this.unbind();
	}
});
