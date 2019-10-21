
 /*
  * File "translation.safety.json"
					Namespaces used: 
						"NewPatientHandlebar",
						"SafetyAttendanceCommon",
						"NewPatientModel".
 */
 
var NewPatientModel = Backbone.Model.extend({

/*
  Declaring constants for getBhInfo() 
   0 - To Skip Duplicate check ;when called from DashboardView
   1 - To check the duplicate patients exiting in patientlist;When Adhoc patient is added  from submitPatients() function of newPatientDialogView
   2 - To skip the duplicate patient check ; from setTimeRange() of Patientcollection
 */
	mode : {
		SKIP_DUPLICATE_PATIENT_ALERT : 0,
		DUPLICATE_PATIENT_CHECK : 1,
		SKIP_DUPLICATE_PATIENT_CHECK : 2
	},
	
	defaults : {
		"pt_cnt" : 0,
		"page_cnt" : 0,
		"patients" : [{
			"pageNum" : 0,
			"ptQualInd" : 0,
			"pt_id" : 0.0,
			"encntr_id" : 0.0,
			"encntr_typeCd" : 0.0,
			"name" : "",
			"fin" : "",
			"mrn" : "",
			"age" : "",
			"birth_dt" : "",
			"birthDtJs" : "",
			"gender" : "",
			"org_id" : 0.0,
			"facility" : "",
			"facilityCd" : 0.0,
			"nurse_unit" : "",
			"nurse_unitCd" : 0.0,
			"room" : "",
			"bed" : "",
			"los" : 0.0,
			"admit_dt" : "",
			"admitDtJs" : ""
		}]
	},

	flag : 0,

	initialize : function() {
		_.bindAll(this);

		if (!this.get("json_handler")) {
			var json_handler = new UtilJsonXml({
				"debug_mode_ind" : 0,
				"disable_firebug" : true
			});

			this.set({
				json_handler : json_handler
			});
		}
		this.json_handler = this.get("json_handler");
	},

	/**
	 * Calls script and retrieves data
	 */
	retrieve : function(patientList) {
		this.trigger("started-loading");
		var MPREQ = {
			PRSNLID : patientList.PRSNLID,
			PTLISTID : patientList.LISTID,
			PTLISTTYPE : patientList.LISTTYPECD,
			PTLISTLOCCD : patientList.DEFAULTLOCCD,
			fuQual : getNurseUnitList(patientList.NULIST)
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var targetDOM = _g('json-loader-message-ptlist');
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "dc_mp_get_ptpop",
				parameters : params
			},
			loadingDialog : {
				content : "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : this.receiveCCLresponse,
				parameters : [this]
			}
		});
	},

	/**
	 * Callback for receiving CCL from script
	 */
	receiveCCLresponse : function(json_response){
		this.trigger("finished-loading");
		if(json_response.response.PTREPLY.STATUS_DATA.STATUS==="S"){
			var ptreply = json_response.response.PTREPLY;
			this.set({
				page_cnt : ptreply.PAGE_CNT,
				pt_cnt : ptreply.PT_CNT,
				patients : ptreply.PATIENTS
			});
		}
		else{
			
			alert($.i18n.translate("NewPatientModel.ERROR_WHEN_RETRIEVING_PATIENT_LIST_DATA"));
		}
	},

	getPatientRequest :  function (patients){
		var patientData ={
				"PT_CNT" : 0,
				"PATIENTS": []
			};
			//Assigning values to patients[] from patients object
			//create list in the model
			_.each(patients, function(v){
				patientData.PT_CNT++;
				patientData.PATIENTS.push({
					"PT_ID" : v.PT_ID,
					"ENCNTR_ID" : v.ENCNTR_ID,
					"ENCNTR_TYPECD" : v.ENCNTR_TYPECD,
					"NURSE_UNITCD" :v.NURSE_UNITCD,
					 "NAME" : v.NAME,
					 "BIRTH_DT" : v.BIRTH_DT,
					 "ADMIT_DT" : v.ADMIT_DT
				});
			});
	return patientData;
	},
	
	getBhInfo : function(value){
	mConsole.log("newpatientmodel.getBhInfo"+value,mConsole.debug_level_info);
	//If value is '0' then increment the addFlag else set the addFlag to '1'and the value retrieved is passed as parameter to the response
		if( value == this.mode.SKIP_DUPLICATE_PATIENT_ALERT ){
			this.patients.addFlag++;
		}
		else{
			this.patients.addFlag = 1;
		}
		var MPREQ = this.getPatientRequest(this.get("patients"));
		
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var targetDOM = _g('json-loader-message');
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patient_details",
				parameters : params
			},
			loadingDialog : {
				content : $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : function(json_response) {
								that.receiveBhInfo(json_response, value) 
							},
				parameters : [this]
			}
		});
	},

	receiveBhInfo : function(json_response, mode){
	mConsole.log("newpatientmodel.receiveBhInfo"+json_response,mConsole.debug_level_info);
		if(json_response.response.BHREPLY.STATUS_DATA.STATUS==="S"){
			var bhinfo = json_response.response.BHREPLY;
			var that = this;
			//If mode is '2' then skip the entire 'if' part to get the activities on change of time range
				if(mode != that.mode.SKIP_DUPLICATE_PATIENT_CHECK){
					_.each(this.get("patients"), function(ptPatient){
						mConsole.log("newpatientmodel.receiveBhInfo in else",mConsole.debug_level_info);
						var foundPatient = that.patients.detect(function(patientModel) {
							return patientModel.get("encntr_id") === ptPatient.ENCNTR_ID;
						});
						if(foundPatient){
							mConsole.log("newpatientmodel.receiveBhInfo in foundPatient",mConsole.debug_level_info);
							//To check whether the selected patient already exists
							if(mode == that.mode.DUPLICATE_PATIENT_CHECK){//If it is calling from dashboard attach add patient no alert
								alert($.i18n.t("NewPatientHandlebar.PATIENT_IS_ALREADY_IN_THE_PATIENT_LIST") +foundPatient.get("name"));//leftout
							}
							var foundBhinfo = _.detect(bhinfo.LIST, function(bhPatient){
								return bhPatient.EID === foundPatient.get("encntr_id");
							});
							bhinfo.LIST = _.without(bhinfo.LIST, foundBhinfo);
							bhinfo.LISTCNT = bhinfo.LISTCNT-1;
						}
						else{
							mConsole.log("newpatientmodel.receiveBhInfo in foundPatient else",mConsole.debug_level_info);
							var patient = new PatientModel();
								patient.setPtInfo(ptPatient);
								patient.set({
									isAdded : true
								}, {silent: true});
								that.patients.add(patient, {
									silent : true
								});					
						}
				});
			}
			var timeRange = this.patients.selectedRange;
			var patientsForActivity ={
				"PT_CNT" : 0,
				"PAGE_CNT" : 1,
				"TIMERANGE" : timeRange,
				"PATIENTS": []
			};
			//Checks for the list length 
			if(bhinfo.LIST.length > 0){
				_.each(bhinfo.LIST, function(bhPatient){
						patientsForActivity.PATIENTS.push({
						"PAGENUM" :  1,
						"PT_ID" : bhPatient.PID,
						"ENCNTR_ID" : bhPatient.EID,
						"ENCNTR_TYPECD" : bhPatient.EIDTYPE
					});
				})
				/*If mode is not '2'then call the  getBhPatientsActivities() of BhInfomodel to get activities;
				to avoid "finished-loading" trigger which adds already added patient on change of time range
				Else call getBhPatientsActivities() of patientcollection to get the activities */
				
				if(mode == that.mode.SKIP_DUPLICATE_PATIENT_CHECK) {
				mConsole.log("newpatientmodel.skip if ",mConsole.debug_level_info);
					this.patients.BhInfoModel.getBhPatientsActivities(patientsForActivity ,timeRange);
					return;
				}
				else
				
				mConsole.log("newpatientmodel.skip if else",mConsole.debug_level_info);
					this.patients.getBhPatientsActivities(patientsForActivity ,timeRange);
			}
			_.each(bhinfo.LIST, function(bhPatient){
				var patient = that.patients.detect(function(patientModel) {
					return patientModel.get("encntr_id") === bhPatient.EID;
				});
				patient.set({
					showimage_ind : that.patients.BhInfoModel.get("APP_PREF").SHOWIMAGE_IND
				});
				patient.setBhInfo(bhPatient);
				patient.set({
					location_activities : that.patients.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
				});
				patient.set({
					offunitevent : bhinfo.OFFUNITEVENT
				});
				that.patients.trigger("add");
			
			var patientView = new PatientView({
					model : patient,
					collection : that.patients
				});
				
				var ptListModel = that.patients.patientListsModel;
				ptListModel.get("addedPatients").push(patient);
				$(".patient-dashboard tbody").append(patient.view.el);
				//if patient is marked off unit, Refresh the view
				patient.userPrefModel.trigger("change:offunitstatus");
			});
	// If mode is '1' add adhoc patient to window Storage
			if(mode == this.mode.DUPLICATE_PATIENT_CHECK){
				try{
					var addedPatient = WindowStorage.get("AddedPatients");
					if(addedPatient!=="undefined"){
						addedPatient = jQuery.parseJSON(addedPatient);
						var ptListModel = that.patients.patientListsModel;
						var foundPtlist = _.detect(addedPatient, function(ptlist){
							return _.isEqual(ptlist.selectedList, ptListModel.get("selectedList"));
						});
						if(foundPtlist){
							addedPatient = _.without(addedPatient, foundPtlist);
							addedPatient.push(ptListModel);
							WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
						}
						else{
							addedPatient.push(ptListModel);
							WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
						}
					}
					else{
						WindowStorage.set("AddedPatients", JSON.stringify([that.patients.patientListsModel]));
					}
				}
				catch(err){
					alert(err.message);
				}
			}
		}
		else{
			alert($.i18n.translate("NewPatientModel.ERROR_WHEN_RETRIEVING_BH_DATA"));
		}
	}
});
