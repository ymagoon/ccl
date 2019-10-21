/**
 * BhInfoModel handles dc_mp_behavioral_hlth script and all data returned from it
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 
 * File "translation.safety.json"
					Namespaces used: 
						"SafetyAttendanceCommon"
 
 */
var BhInfoModel = Backbone.Model.extend({

	/**
	 * Default values
	 */
	defaults : {
		"BHINFO" : {},
		"ACTIVITIES" : {},
		"APP_PREF" : {}
	},

	/**
	 * Default Constructor
	 * @constructor
	 */
	initialize : function() {
		_.bindAll(this);
	},

	/**
	 * Retrieve data from CCL via bh_mp_sa_get_patients script
	 * @param {Object} patientList Patient List info used to query patients
	     This script loads the requested patients*/
	retrieve : function(patientList,Hours) {
	if(Hours === undefined){ Hours = 4;
	}
		var MPREQ = {
			PRSNLID : patientList.PRSNLID,
			PTLISTID : patientList.LISTID,
			PTLISTTYPE : patientList.LISTTYPECD,
			PTLISTLOCCD : patientList.DEFAULTLOCCD,
			fuQual : getNurseUnitList(patientList.NULIST),
			TIMERANGE :  Hours	
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var targetDOM = _g('json-loader-message');
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patients",
				parameters : params
			},
			loadingDialog : {
				content : $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
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
	 * Receives data returned from bh_mp_sa_get_patients script
	 * @param {Object} json_response json_response.response.BHREPLY is json returned
	  //If BHINFO is empty set the object else set each property that got retrieved  */
	 
	receiveCCLresponse : function(json_response) {
		if(_.isEmpty(this.get("BHINFO"))){
			this.set({
						"BHINFO" : json_response.response.BHREPLY
					}, 
					
					{
						silent : true
					});		
		}
		else{
			this.get("BHINFO").LIST = json_response.response.BHREPLY.LIST;
			this.get("BHINFO").OFFUNITEVENT = json_response.response.BHREPLY.OFFUNITEVENT;
		}
		this.trigger("change");
	},

	/**
	 * Gets Array of activities, based on location.  If location is not listed, default list
	 * is returned, if available
	 * @param {Number} location_cd location's Millennium LOCATION_CD
	 * @returns {Array} List of locations
	 */
	getActivitiesForLocation : function(location_cd) {
		var locations = (this.get("APP_PREF")).LOCNOMEN,
				locationResults = [],
				defaultLocationResults = [];
		
		//always return array
		if(_.isEmpty(this.get("BHINFO"))) {
			return [];
		}

		for(var i=0,l=locations.length;i<l;i++){
			if(location_cd == locations[i].LOCCD) {
				locationResults = locations[i].RESULTS;
			}
			else if(locations[i].NAME === "DEFAULT") {
				defaultLocationResults = locations[i].RESULTS;
			}
		}
		
		return locationResults.length ? locationResults : defaultLocationResults;
	},

	/*Calls the application prefrences script required for S & A 
	BatchSize for posting patients activities, retrieving patients activities, default nomens and so on..*/
	
	retrieveAppPrefForSA : function(){
			 this.json_handler
						.ajax_request({
							request : {
								async : false,
								type : "XMLCCLREQUEST",
								target : "bh_mp_sa_app_pref",
								parameters : "^MINE^"
							},
							response : {
								type : "JSON",
								target : this.receiveAppPrefForSA,
								parameters : [ "t", 1, this ]
							}
						});
			 },
			 
			 
		receiveAppPrefForSA : function(json_response){
			//If APP_PREF is empty initialize the batchsize to zero else set each property that got retrieved 
			var appPref = undefined;
			var bhreply = undefined;
			if(_.isEmpty(this.get("APP_PREF"))){
			    
				this.set({
					"APP_PREF" : {RETRIEVE_ACT_BATCHSIZE: 0, POST_ACT_BATCHSIZE:0,
									RETRIEVE_DEFAULT_TIME : 0}
				}, 
				{
					silent : true
				});
			}
			bhreply = json_response.response.BHREPLY;
			appPref = this.get("APP_PREF");
			appPref.LOCNOMEN = bhreply.LOCNOMEN; 
			appPref.LOCTIME = bhreply.LOCTIME;
			appPref.SHOWIMAGE_IND = bhreply.SHOWIMAGE_IND;
			appPref.RETRIEVE_ACT_BATCHSIZE = parseInt(bhreply.RETRIEVE_ACT_BATCHSIZE);
		    appPref.POST_ACT_BATCHSIZE = parseInt(bhreply.POST_ACT_BATCHSIZE);
			appPref.RETRIEVE_DEFAULT_TIME = parseInt(bhreply.RETRIEVE_DEFAULT_TIME);
			appPref.PCTABNM = bhreply.PCTABNM;
		},
		
	//For constructing mpreq needed to pass to activities
	getPatientRequest :  function (patients , timeRange){
		var retriveActBatchSize = (this.get("APP_PREF")).RETRIEVE_ACT_BATCHSIZE;
		var chunk = 0;
		var batchCount = -1;
		var MPREQ = [{
				"BATCHNUMBER" : batchCount,
				"PT_CNT" : 0,
				"PAGE_CNT" : 1,
				"TIMERANGE" : timeRange,
				"PATIENTS": []
			}];
			var j=1;
			//If retriveActBatchSize is null or undefined then maxnumber is passed else the batchsize which is parameterised in setup page is passed
			retriveActBatchSize = (retriveActBatchSize === undefined || retriveActBatchSize === null) ? Number.MAX_VALUE : retriveActBatchSize;		
			_.each(patients, function(patient){
				if(j > chunk) 
				{
					chunk = chunk + retriveActBatchSize;
					batchCount = batchCount + 1;
					
					MPREQ[batchCount] = {
						"BATCHNUMBER" : batchCount,
						"PT_CNT" : 0,
						"PAGE_CNT" : 1,
						"TIMERANGE" : timeRange,
						"PATIENTS": []
					};
				}
				
				MPREQ[batchCount].PATIENTS.push({
					"PAGENUM" :  0,
					"PT_ID" : patient.PT_ID,
					"ENCNTR_ID" : patient.ENCNTR_ID,
					"ENCNTR_TYPECD" : patient.ENCNTR_TYPECD
				});
				MPREQ[batchCount].PT_CNT++;
				j = j+1;
			});
		return MPREQ;
	},
	
	getBhPatientsActivities : function(patient, timeRange){	
	 //Chunk this requests
	var patientReq = this.getPatientRequest(patient.PATIENTS , timeRange); // patient contains entire bhreply,hence passing pat.PATIENTS in order to access patients[]
	_g('json-activity-loader-message').innerHTML = $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>";
	var threadID = waitUntil.getInstance("loadactivities");
	threadID.init(patientReq, this.check, this.onComplete);
	var that = this;
	_.each(patientReq,function(mpreq){
			mpreq.status = 0;
			that.getBhPatientsBatchActivities(mpreq);	
	 });
	this.flag = patientReq;
	},
	
	onComplete : function(){
		_g('json-activity-loader-message').innerHTML = "";
		waitUntil.dispose("loadactivities");	
	},
	
	check:function(request){
		var status = 1;
		for(var index = 0, count = request.length; index < count; index++){
			status = status & request[index].status;
		}
		return status;
	},
	
	getBhPatientsBatchActivities :function(patientReq){
	var MPREQ = {
			"BATCHNUMBER" : patientReq.BATCHNUMBER,
			"pt_cnt" : patientReq.PT_CNT,
			"page_cnt" : patientReq.PAGE_CNT,
			"TIMERANGE" : patientReq.TIMERANGE,
			"patients" : patientReq.PATIENTS
		}
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var startTimer = new Date((new Date()).toString());
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_activities",
				parameters : params	
			},
			response : {
				type : "JSON",
				target : function(json_response){
							that.receiveActivitiesResponse(json_response, patientReq.BATCHNUMBER, patientReq.PT_CNT, startTimer);
							patientReq.status = 1;

							var threadID = waitUntil.getInstance("loadactivities");
							threadID.checkStatus();
							},
				parameters : [this]
			}
		});
		return true;
	},
	
	
		receiveActivitiesResponse : function(json_response , BATCHNUMBER , patientCount, startTimer){
		var endTimer = new Date((new Date()).toString());
		mConsole.log("BhInfoModel.receiveActivitiesResponse - batchNumber:" +  BATCHNUMBER+ " Having: " + patientCount + " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		var response =  undefined;
		if(_.isEmpty(this.get("ACTIVITIES"))){
			this.set({
					"ACTIVITIES" : json_response.response.BHREPLY
					
				}, {
					silent : true
				});
				response = json_response.response.BHREPLY;
		}
		else{ 
			var activities = this.get("ACTIVITIES");
			 response = json_response.response.BHREPLY;
			
			//increment the patients that were got
			activities.LISTCNT += response.LISTCNT;
			//Add the activities to the existing array
			_.each(response.LIST, function(activity){
				activities.LIST.push(activity);
			});
			activities.OFFUNITEVENT = response.OFFUNITEVENT;
		}
		this.trigger("changeBatchActivities", response);
	}
});
