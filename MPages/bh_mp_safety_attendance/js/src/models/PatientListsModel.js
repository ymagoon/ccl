/**
 * Patient Lists Model handles call to dc_mp_get_base_list script and all data
 * returned from it
 * 
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml

 * File "translation.safety.json"
					Namespaces used:"PatientListsModel",
									"SafetyAttendanceCommon".
 */
var PatientListsModel = Backbone.Model
		.extend({

			defaults:{
				"selectedList" : {},
				"addedPatients" : [],
				"fallLabel" : "",
				"suicideLabel" : "",
				"tabNavInd" : 0
			},

			PTLISTS : {},

			/**
			 * Contructor
			 * 
			 * @constructor
			 * @params {Object} UtilJsonXml creates one if none is supplied
			 */
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
			retrieve : function() {
				this.trigger("loading");
				var targetDOM = _g('patient-lists-loader-message');
				this.json_handler
						.ajax_request({
							request : {
								type : "XMLCCLREQUEST",
								target : "dc_mp_bhv_hlth_get_ptlist",
								parameters : "^MINE^"
							},
							loadingDialog : {
								content : $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
								targetDOM : _g('patient-lists-loader-message')
							},
							response : {
								type : "JSON",
								target : this.receiveCCLresponse,
								parameters : [ "t", 1, this ]
							}
						});
			},

			/**
			 * Callback for receiving CCL from script
			 */
			receiveCCLresponse : function(json_response) {
				this.PTLISTS = json_response.response.LISTREPLY, that = this;
				var messagePL = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_TO_QUALIFY");
				var messageFU = $.i18n.t("PatientListsModel.SELECT_FACILITY_AND_NURSE_UNITS_TO_QUALIFY");
				var messageBoth = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_OR_FACILITY");
				if (this.PTLISTS.STATUS_DATA.STATUS === "S") {
					//patient list
					if (this.PTLISTS.BWPTPOP === "1") {
						this.sortList();
						this.trigger("change:ptlists");

						if (WindowStorage.get("StoredIndex") != 'undefined') {
							this.setSelectedList(WindowStorage
									.get("StoredIndex"));
							this.clearWindowStorage();
							this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="1"){
								 this.setInitialSelectedList();
								this.trigger("change:selected");
							}
							else{
								$('#ptpopMessage').text(messagePL);
							}
						}
						$('#fu-label').remove();
						$('#falist').remove();
						$('#nuLink').remove();
					} 
					//facility nurse unit
					else if (this.PTLISTS.BWPTPOP === "2") {
						if (this.PTLISTS.BWWTS === "0") {
							this.PTLISTS.PTLIST = _.filter(this.PTLISTS.PTLIST,
									function(v) {
										return v.LISTID !== 0;
									});
						}
						this.sortList();
						this.trigger("change:ptlists");
						if (WindowStorage.get("StoredIndex") != 'undefined') {
							this.setSelectedList(WindowStorage
									.get("StoredIndex"));
							this.clearWindowStorage();
							this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="2"){
								 this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), true, 2);
							}
							else{
								$('#ptpopMessage').text(messageFU);
							}
						}
						$('#pt-label').remove();
						$('#ptlist').remove();
						$("#ptpopSubmit").remove();
					} 
					//both
					else {
						this.sortList();
						this.trigger("change:ptlists");

						if (WindowStorage.get("StoredIndex") != 'undefined') {
								this.setSelectedList(WindowStorage
										.get("StoredIndex"));
								this.clearWindowStorage();
								this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="1"){
								this.setInitialSelectedList();
								this.trigger("change:selected");
								// this.trigger("select:ptlist");
								this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), false, 3);
							}
							else if(this.PTLISTS.BWDEFPOP==="2"){
								 this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), true, 3);
								 // this.trigger("select:fulist");
							}
							else{
								$('#ptpopMessage').text(messageBoth);
							}
						}
					}
					this.setPageTitle();
					this.setRiskLabel();
					this.setTabNavInd();
				} else {
					throw Error("patientListsModel.retrieve() failure");
				}
			},

			/**
			 * Sorts patient list by CCL List Sequence
			 */
			sortList : function() {
				this.PTLISTS.PTLIST = _.sortBy(this.PTLISTS.PTLIST, function(
						list) {
					return list.LISTSEQ;
				});

			},

			/**
			 * Sets the initial sorted list silently on load
			 */
			setInitialSelectedList : function() {
				var selectedList = _.min(this.PTLISTS.PTLIST, function(list) {
					return list.LISTSEQ;
				});
				selectedList["NULIST"] = [];
				this.set({
					selectedList : selectedList
				});
			},

			/**
			 * Set the initial Nurse Unit
			 */
			setInitialSelectedFu:function(list, flag, defPop){
				var self = this;
				var messageFU = $.i18n.t("PatientListsModel.SELECT_FACILITY_AND_NURSE_UNITS_TO_QUALIFY");
				var messageBoth = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_OR_FACILITY");
				if(list.length>0){
					_.each(this.PTLISTS.FUQUAL, function(org){
						_.each(org.LOCQUAL, function(nu){
							if(nu.NULOCATIONCD===list[0].DEFAULTLOCCD){
								$("#falist").val(org.ORGID);
								$("#nuLink").text(nu.LOCATIONDISP);
								$("#nuLink").attr("title", nu.LOCATIONDISP);
								self.setSelectedNu(org,[nu.NULOCATIONCD], flag);
							}
						});
					});
				}
				else{
					if(defPop===2){
						$('#ptpopMessage').text(messageFU);
					}
					else if(defPop===3){
						$('#ptpopMessage').text(messageBoth);
					}
				}
			},

			/**
			 * Returns number of patient lists
			 * 
			 * @returns {Number} number of patient lists
			 */
			length : function() {
				return this.PTLISTS.PTLIST ? this.PTLISTS.PTLIST.length : 0;
			},

			/**
			 * Gets patient lists
			 * 
			 * @returns {Array} Patient Lists
			 */
			getLists : function() {
				return (this.PTLISTS && this.PTLISTS.PTLIST) ? this.PTLISTS.PTLIST
						: [];
			},

			/**
			 * Gets facilities lists
			 * 
			 * @returns {Array} Patient Lists
			 */
			getFacilities : function() {
				return (this.PTLISTS && this.PTLISTS.FUQUAL) ? this.PTLISTS.FUQUAL
						: [];
			},

			/**
			 * Gets single patient list from LISTID
			 * 
			 * @params {Number} listId
			 * @returns {Object} Single patient list info
			 */
			getSingleList : function(listId) {
				return _.detect(this.PTLISTS.PTLIST, function(ptlist) {
					return ptlist.LISTID === listId;
				});

			},

			/**
			 * Gets single facility list from ORGID
			 * 
			 * @params {Number} listId
			 * @returns {Object} Single facility list info
			 */
			getSelectedFacility : function(listid) {
				return _.find(this.PTLISTS.FUQUAL, function(facility) {
					return facility.ORGID == listid;
				});
			},

			/**
			 * Sets selected patient list based on listId
			 * 
			 * @params {Number} listId
			 */
			setSelectedList : function(listId) {
				var selected = _.detect(this.PTLISTS.PTLIST, function(list) {
					return list.LISTID == listId;
				});
				selected["NULIST"] = [];
				this.set({
					selectedList : selected
				});
				this.set({
					addedPatients : []
				}, {silent:true});
				this.trigger("change:selected");
			},

			setSelectedNu : function(facility, nucd, flag) {
				if (nucd.length > 0) {
					var selected = [];
					_.each(facility.LOCQUAL, function(nu) {
						if (_.indexOf(nucd, nu.NULOCATIONCD) != -1) {
							delete nu["OPEN"];
							delete nu["CLOSE"];
							selected.push(nu);
						}
					});
					var fac = _.clone(facility);
					fac.LOCQUAL = selected;
					var json = {
						"PRSNLID" : Criterion.personnel_id,
						"LISTID" : -1,
						"LISTTYPECD" : 0,
						"DEFAULTLOCCD" : 0,
						"NULIST" : [ fac ]
					};
					if(flag){
						this.set({
							selectedList : json
						});
					}
				}
			},

				//change text of nurse unit link
			changeNurseUnitText:function(selection){
				if(selection.length>0){
					var text="";
					$.each(selection, function(i, e){
						text = text + e + "; ";
					});
					text=text.slice(0, text.length-2);
					$("#nuLink").attr("title", text);
					if(text.length>50){
						text=text.slice(0, 50);
						text+="...";
					}
					$("#nuLink").text(text);
				}
			},

			/*
			 * Sets page title
			 */
			setPageTitle : function() {
				if (this.PTLISTS.PAGE_TITLE === "")
					$(".mpage-title").get(0).innerHTML = $.i18n.t("SafetyAttendanceCommon.SAFETY_AND_ATTENDANCE_MPAGE");
				else
					$(".mpage-title").get(0).innerHTML = this.PTLISTS.PAGE_TITLE;
			},

			/*
			 * Sets tab navigation indicator
			 */
			setTabNavInd : function() {
					this.set({
						tabNavInd : this.PTLISTS.TABNAV_IND
					},{silent:true});
			},

			/*
			 * Sets fall and suicide risk label
			 */
			setRiskLabel : function(){
				var fRiskLabel = this.PTLISTS.FALL_LABEL;
				var sRiskLabel = this.PTLISTS.SUICIDE_LABEL;
				if(fRiskLabel===""){
					this.set({
						fallLabel : "Fall"
					},{silent:true});
				}
				else{
					this.set({
						fallLabel : fRiskLabel
					},{silent:true});
				}

				if(sRiskLabel===""){
					this.set({
						suicideLabel : "Suicide"
					},{silent:true});
				}
				else{
					this.set({
						suicideLabel : sRiskLabel
					},{silent:true});
				}
			},

			clearWindowStorage : function(){
				WindowStorage.del("StoredFnu");
				WindowStorage.del("StoredIndex");
			},

			/**
			 * Destroy model
			 */
			destroyPatientListsModel : function() {
				// remove any circular reference
				if (this.view) {
					this.view = null;
				}
				this.destroy();
			}

		});
