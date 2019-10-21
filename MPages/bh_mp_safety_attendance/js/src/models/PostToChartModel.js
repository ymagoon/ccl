/**
 * Handles calls to scripts for posting new clinical events and uncharting old
 * ones
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,ActivityModel,JSON2
 */
var PostToChartModel = Backbone.Model.extend({

	/**
	 * Indicator object for whether all activity types have been charted.
	 */
	activitiesCharted : {
		draftActivities : false,
		inErrorActivities : false
	},

	/**
	 * Initializes Model on instantiation.
	 *
	 * @params {Object} UtilJsonXml creates one if none is provided
	 */
	initialize : function() {
		_.bindAll(this);

		if(!this.get("json_handler")) {
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
	 * Charts all activities
	 *
	 * @param {Array} activities ActivityModel collection
	 */
	chartAllActivities : function(activities , postActBatchsize){
		//fill loader message box
		_g('json-loader-message').innerHTML = $.i18n.t("SafetyAttendanceCommon.CHARTING");

	// check for inErrorActivities and set the flag to true, as receiveReply() checks for the flag to refresh.
		var activitiesInError = this.getInErrorActivities(activities);
		var inErrorRequest = this.getMPREQfromInErrorActivityArray(activitiesInError , postActBatchsize);
		if(inErrorRequest === undefined){
			this.activitiesCharted.inErrorActivities = true;
		}
		var draftActivities = this.getDraftActivities(activities);
		var draftRequest = this.getMPREQfromDraftActivityArray(draftActivities,postActBatchsize );
		var that = this; 
		var threaddraftAct = waitUntil.getInstance("draftactivities");
		threaddraftAct.init(draftRequest, this.check, this.onComplete);
		if(!(draftRequest === undefined)){
				_.each(draftRequest,function(mpreq){
					mpreq.status = 0;
					that.postDraftActivities(mpreq,
					{BATCHNUMBER : mpreq.BATCHNUMBER,
					LISTCNT : mpreq.LISTCNT});
			 });
		}else{
			this.activitiesCharted.draftActivities = true;
		}
		if(!(inErrorRequest === undefined)){
		var threadInError = waitUntil.getInstance("inerroractivities");
		threadInError.init(inErrorRequest, this.check, this.onComplete);

		_.each(inErrorRequest,function(mpreq){
					mpreq.status = 0;
					that.postInErrorActivities(mpreq, 
					{BATCHNUMBER : mpreq.BATCHNUMBER,
					LISTCNT : mpreq.LISTCNT});
			 });
		}
    },
	
	
	
	/**
	 * Returns array of draft activities from Array provided
	 *
	 * @param {Array} activities
	 * @returns {Array} Draft ActivityModel collection
	 */
	getDraftActivities : function(activities) {
		return _.select(activities, function(activity) {
			return activity.get("STATUS").toUpperCase() === "DRAFT";
		});

	},

	/**
	 * Returns array of In Error activities from Array provided
	 *
	 * @param {Array} activities
	 * @returns {Array} In Error ActivityModel collection
	 */
	getInErrorActivities : function(activities) {
		var activitiesErr = _.select(activities, function(activity) {
			
			return activity.get("STATUS").toUpperCase() === "INERROR";
		});
        return activitiesErr;
	},

	/**
	 * Post Draft Activities, via dc_mp_post_bhv_hlth script
	 *
	 * @param {String} mpreq	Stringified JSON of Array of DRAFT activities
	 */
	postDraftActivities : function(mpreq,  batchNumber) {
		var path = "DC_MP_POST_BHV_HLTH", params = "^MINE^," + "^{'MPREQ':" + JSON.stringify(mpreq) + "}^";
		var startTimer = new Date((new Date()).toString());
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : function(json_response) {
													that.receiveDraftActivitiesReply(json_response, batchNumber, startTimer);
													mpreq.status = 1;
													var threadID = waitUntil.getInstance("draftactivities");
													threadID.checkStatus();
												},
				parameters : ["t", 1]
			}
		});
	},

	/**
	 * Post In Error Activities, via dc_mp_ie_bhv_hlth script
	 *
	 * @param {String} mpreq	Stringified JSON of Array of INERROR activities
	 */
	postInErrorActivities : function(mpreq, batchNumber) {
		var path = "DC_MP_IE_BHV_HLTH", params = "^MINE^," + "^{'MPREQ':" +AjaxHandler.stringify_json(mpreq) + "}^";
		var startTimer = new Date((new Date()).toString());
		var targetDOM = _g('json-loader-message');
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : function(json_response) {
													that.receiveInErrorActivitiesReply(json_response, batchNumber, startTimer);
													mpreq.status = 1;
													var threadID = waitUntil.getInstance("inerroractivities");
													threadID.checkStatus();
												},
				parameters : ["t", 1]
			}
		});
	},

	/**
	 * Creates Stringified JSON from Array of Draft Activities
	 *
	 * @param {Array} activities Draft ActivityModel collection
	 * @returns {String} Stringified JSON
	 */
	getMPREQfromDraftActivityArray : function(activities , postActBatchsize) {
		var requestChunk = 0, MPREQ ;
		var batchCount = -1;
		if(activities.length > 0){
			MPREQ = [{LIST : []}];
		}
		for(var indexActivities = 0, requestCnt = 1, activitiesTotalCount = activities.length; indexActivities < activitiesTotalCount; indexActivities++){
			_.each(activities[indexActivities].get("LIST"), function(event){
			
				if(requestCnt > requestChunk) 
				{
					requestChunk = requestChunk + postActBatchsize;
					batchCount = batchCount + 1;
					MPREQ[batchCount] = {LIST : [] ,  LISTCNT : 0, BATCHNUMBER : batchCount};
				}
				MPREQ[batchCount].LIST[MPREQ[batchCount].LIST.length] = {
						INPUTPERSONID : activities[indexActivities].patient.get("person_id").toFixed(1),
						INPUTPROVIDERID: Criterion.personnel_id.toFixed(1),
						INPUTENCOUNTERID : activities[indexActivities].patient.get("encntr_id").toFixed(1),
						INPUTEVENTCD: event.EVENT_CD.toFixed(1),
						ENDDTTM: activities[indexActivities].get("EVENT_DT").toString(),
						INPUTNOMENCLATUREID: event.NOMID,
						INPUTFREETEXT: event.FREETEXT,
						INPUTPPR: event.INPUTPRT.toFixed(1)
					};
				MPREQ[batchCount].LISTCNT++;
				requestCnt++;
		});
		}
	 return MPREQ; 
	},

	/**
	 * Creates Stringified JSON from Array of In Error Activities
	 *
	 * @param {Array} activities InError ActivityModel collection
	 * @returns {String} Stringified JSON
	 */
	 
	getMPREQfromInErrorActivityArray : function(activities , postActBatchsize)
	{
			var requestChunk = 0, MPREQ;
			var batchCount = -1;
			if(activities.length > 0){
				MPREQ = [{LIST : []}];
			}
			for(var indexInErrActivities = 0, requestCntInErr = 1, activitiesTotalCount = activities.length; indexInErrActivities < activitiesTotalCount; indexInErrActivities++){
				_.each(activities[indexInErrActivities].get("LIST"), function(event){
				
					if(requestCntInErr > requestChunk) 
					{
						requestChunk = requestChunk + postActBatchsize;
						batchCount = batchCount + 1;
						MPREQ[batchCount] = {LIST : [] ,  LISTCNT : 0, BATCHNUMBER : batchCount};
					}
					
					MPREQ[batchCount].LIST[MPREQ[batchCount].LIST.length] ={
						INPUTPERSONID : activities[indexInErrActivities].patient.get("person_id").toFixed(1),
						INPUTPROVIDERID: Criterion.personnel_id.toFixed(1),
						INPUTENCOUNTERID : activities[indexInErrActivities].patient.get("encntr_id").toFixed(1),
						INPUTEVENTCD: event.EVENT_CD.toFixed(1),
						INPUTEVENTID : event.EVENTID.toFixed(1),
						INPUTPPR: event.INPUTPRT.toFixed(1)
					};
					MPREQ[batchCount].LISTCNT++;
					
					requestCntInErr++;
				});
			}
			return MPREQ;
	},

	/**
	 * Callback function for all scripts called.  Once notification has been
	 * received, function fires
	 * a "posted" event, so that MPage knows to retrieve new patient data.
	 *
	 * @param {object} json_response  json_respons.response.OBJECT is the reply from
	 * the script
	 */
	receiveInErrorActivitiesReply : function(json_response, batchNumber, startTimer) {
		var endTimer = new Date((new Date()).toString());	
		mConsole.log("PostToChartModel.receiveInErrorActivitiesReply- batchNumber:" +  batchNumber.BATCHNUMBER+ " Having: " + batchNumber.LISTCNT+  " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		if(json_response.response.IEREPLY) {
			this.activitiesCharted.inErrorActivities = true;
			var status_data = json_response.response.IEREPLY.STATUS_DATA;
		}
	},
	
	receiveDraftActivitiesReply : function(json_response, batchNumber, startTimer) {
		var endTimer = new Date((new Date()).toString());
		mConsole.log("PostToChartModel.receiveDraftActivitiesReply - batchNumber:" +  batchNumber.BATCHNUMBER+ " Having: " + batchNumber.LISTCNT+  " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		if(json_response.response.POSTREPLY) {
			
			this.activitiesCharted.draftActivities = true;
			var status_data = json_response.response.POSTREPLY.STATUS_DATA;
		}
	},
	
	check : function (request){
		var status = 1;
		for(var index = 0, count = request.length; index < count; index++){
			status = status & request[index].status;
		}
		return status;
	},
	
	onComplete : function(){
		if(this.areAllActivitiesCharted()) {
			this.resetActivitiesChartedIndicators();
			waitUntil.dispose("draftactivities");
			waitUntil.dispose("inerroractivites");
			this.trigger("posted");
		}
	},

	/**
	 * Determines if all Activities have been charted
	 *
	 * @returns {Boolean} true if all Activities charted, false otherwise
	 */
	areAllActivitiesCharted : function() {
		return _.all(this.activitiesCharted, function(value, key) {
			return value;
		});

	},

	/**
	 * Resets the ActivitiesCharted indicator object
	 */
	resetActivitiesChartedIndicators : function() {
		this.activitiesCharted.draftActivities = false;
		this.activitiesCharted.inErrorActivities = false;
	}

});
