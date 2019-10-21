var UserPrefModel = Backbone.Model.extend({
	defaults : {
		"offunitstatus" : {
			"isoffunit" : false,
			"offunitstartdt" : "",
			"cecd" : 0.0,
			"nomid" : 0.0,
			"nomdisp" : ""
		}
	},

	/**
	 * Default Constructor
	 * @constructor
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

	savePref : function(id, ind, dt, cecd, nomid, nomdisp) {
		var MPREQ = {
			PERSON_ID : id,
			OFFUNIT_IND : ind,
			OFFUNIT_STARTDT : dt,
			CECD : cecd,
			NOMID : nomid,
			NOMDISP : nomdisp
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var path = "DC_MP_BHV_HLTH_SETUP_SAVE_PREF";
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : this.receiveSaveresponse,
				parameters : [this]
			}
		});
	},

	receiveSaveresponse : function(json_response) {
		var reply = json_response.response.MPREP;
		if(reply.STATUS_DATA.STATUS === "S"){
			this.set({
				offunitstatus: {
					isoffunit : true,
					offunitstartdt : (new Date).toDate(reply.OFFUNIT_STARTDT),
					cecd : reply.CECD,
					nomid : reply.NOMID,
					nomdisp : fixedDecodeURIComponent(reply.NOMDISP)
				}
			});
		}
	},

	removePref : function(id){
		var MPREQ = {
			PERSON_ID : id,
			OFFUNIT_IND : 0,
			OFFUNIT_STARTDT : "",
			CECD : 0.0,
			NOMID : 0.0,
			NOMDISP : ""
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var path = "DC_MP_BHV_HLTH_SETUP_SAVE_PREF";
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : this.receiveRemoveresponse,
				parameters : [this]
			}
		});		
	},

	receiveRemoveresponse : function(json_response) {
		var reply = json_response.response.MPREP;
		if(reply.STATUS_DATA.STATUS === "S"){
			this.set({
				offunitstatus: {
					isoffunit : false,
					offunitstartdt : "",
					cecd : 0.0,
					nomid : 0.0,
					nomdisp : ""
				}
			});
		}
	}
});
