/**
 * PtInfoModel handles dc_mp_get_ptpop script and all data returned from it
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 
 * File "translation.safety.json"
					Namespaces used: 
						"SafetyAttendanceCommon"
 
 */
var PtInfoModel = Backbone.Model.extend({

	defaults : {
		"PTINFO" : {}
	},

	initialize : function() {
		_.bindAll(this);
	},

	/**
	 * Retrieve data from CCL via dc_mp_get_ptpop script
	 * @param {Object} patientList Patient List info used to query patients
	 */
	retrieve : function(patientList) {
		var MPREQ = {
			PRSNLID : patientList.PRSNLID,
			PTLISTID : patientList.LISTID,
			PTLISTTYPE : patientList.LISTTYPECD,
			PTLISTLOCCD : patientList.DEFAULTLOCCD,
			fuQual : getNurseUnitList(patientList.NULIST)
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^";
		var targetDOM = _g('json-loader-message');
		this.json_handler.ajax_request({
			request : {
				async : false,
				type : "XMLCCLREQUEST",
				target : "dc_mp_get_ptpop",
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
	 * Receives data returned from dc_mp_get_ptpop script
	 * @param {Object} json_response json_response.response.PTREPLY is json returned
	 */
	receiveCCLresponse : function(json_response) {
		this.set({
			"PTINFO" : json_response.response.PTREPLY
		}, {
			silent : true
		});
		this.trigger("change");
	}

});
