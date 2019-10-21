/**
 * Defines a Millennium service delegate for denied days worklist transactions.
 *
 * @author Dana Estes - Revenue Cycle Access
 * @constructor
 */
function DeniedDaysWorklistDelegate(){
    this.getFilterDefaults = function(){
		var json = "^{\"GET_DENIAL_DEFAULTS_REQUEST\":{\"DUMMY_IND\":\"0\"}}^";

		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "11",json);

		var deniedDayDefaultFilters;
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
			if (info.readyState == 4 && info.status == 200) {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;

				if (recordData.STATUS_DATA.STATUS == "S") {
					deniedDayDefaultFilters = {
            			defaultAssignedTo: recordData.DEFAULT_ASSIGNED_TO,
            			defaultPrimarySortColumn: recordData.DEFAULT_PRIMARY_SORT_COLUMN,
            			defaultPrimarySortDir: recordData.DEFAULT_PRIMARY_SORT_DIR,
            			defaultSecondarySortColumn: recordData.DEFAULT_SECONDARY_SORT_COLUMN,
            			defaultSecondarySortDir: recordData.DEFAULT_SECONDARY_SORT_DIR,
            			showDenialsWithAppealsInd: recordData.SHOWDENIALSWITHAPPEALSIND
        			};
				}
				else {
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
				}
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
			else if (info.readyState == 4 && info.status != 200) {
				deniedDayDefaultFilters = {
            			defaultAssignedTo: "",
            			defaultPrimarySortColumn: 0,
            			defaultPrimarySortDir: "",
            			defaultSecondarySortColumn: "",
            			defaultSecondarySortDir:0,
            			showDenialsWithAppealsInd:1
        			};
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
		};
            info.open('GET', "RCM_DENIED_DAYS", 0);
			info.send(sendAr.join(","));

        return deniedDayDefaultFilters;
    };

	this.saveDefaults = function(deniedDayDefaultFilters){
		var jsonRequest = {
			"SAVE_DENIAL_DEFAULTS_REQUEST": {
				"DEFAULT_ASSIGNED_TO" : deniedDayDefaultFilters.defaultAssignedTo,
				"DEFAULT_PRIMARY_SORT_COLUMN" : deniedDayDefaultFilters.defaultPrimarySortColumn,
				"DEFAULT_PRIMARY_SORT_DIR" : deniedDayDefaultFilters.defaultPrimarySortDir,
				"DEFAULT_SECONDARY_SORT_COLUMN" : deniedDayDefaultFilters.defaultSecondarySortColumn,
				"DEFAULT_SECONDARY_SORT_DIR" : deniedDayDefaultFilters.defaultSecondarySortDir,
				"SHOWDENIALSWITHAPPEALSIND" : deniedDayDefaultFilters.showDenialsWithAppealsInd
			}
		};
		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "12", "^",JSON.stringify(jsonRequest),"^");

		var returnStatus = 0;
    	var info = new XMLCclRequest();
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
        		var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "F") {
                	returnStatus = -1;
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
            else if (info.readyState === 4 && info.status !== 200) {
            	returnStatus = -1;
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_DENIED_DAYS", 0);
        info.send(sendAr.join(","));
	};

    this.getWorklistItems = function(filtersObj){
        var jsonRequest = {
            "GET_DENIAL_WORKLIST_REQUEST": {
                "PRIMARY_SORT_COLUMN": filtersObj.primarySortColumn,
                "PRIMARY_SORT_DIRECTION": filtersObj.primarySortDir,
                "SECONDARY_SORT_COLUMN": filtersObj.secondarySortColumn,
                "SECONDARY_SORT_DIRECTION": filtersObj.secondarySortDir,
                "SHOWDENIALSWITHAPPEALSIND": filtersObj.showDenialsWithAppealsInd,
                "ARGUMENTS": [{
                    "NAME": filtersObj.name,
                    "VALUE": filtersObj.value,
					"PARENT_ENTITY_NAME": "",
					"PARENT_ENTITY_ID": ""
                }]
            }
        };

        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "10", "^",JSON.stringify(jsonRequest),"^");
		var worklistData = {};
		worklistData.worklistItems = [];
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (info.readyState == 4 && info.status == 200) {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "S") {
					worklistData.can_modify_denied_days_ind = recordData.CAN_MODIFY_DENIED_DAYS_IND;
                    for (var i = 0; i < recordData.RESULTS.length; i++) {
                        var worklistResult = recordData.RESULTS[i];

                        var tempDRGs = [];
                        var jsonDRGs = worklistResult.DRGS;
                        for(var j = 0; j < jsonDRGs.length; j++) {
                        	var jsonDRG = jsonDRGs[j];
                        	tempDRGs.push({
                				sourceIdentifier: jsonDRG.SOURCEIDENTIFIER,
                				description: jsonDRG.DESCRIPTION,
                				isFinal: jsonDRG.FINALINDICATOR === 1,
                				isTransferRuleDRG: jsonDRG.TRANSFERRULEINDICATOR === 1,
                				isCMWorkingDRG: jsonDRG.CMWORKINGDRGIND === 1,
                				contributorSystemName: jsonDRG.CONTRIBUTORSYSTEM,
								severityOfIllnessDisplay: jsonDRG.SEVERITYOFILLNESSDISPLAY,
								riskOfMortalityDisplay: jsonDRG.RISKOFMORTALITYDISPLAY,
								drgWeight: jsonDRG.DRGWEIGHT
                        	});
                        }

						var tempCareManagers = [];
						var jsonCareManagers = worklistResult.CAREMANAGERS;
						for(var k = 0; k < jsonCareManagers.length; k++){
							var jsonCareManager = jsonCareManagers[k];
							tempCareManagers.push({
								display : jsonCareManager.RELTNTYPEDISPLAY,
								name : jsonCareManager.PERSONNELNAME
							});
						}

                        worklistData.worklistItems.push({
                            encntr_denied_days_id: worklistResult.ENCNTR_DENIED_DAYS_ID,
                            person_id: worklistResult.PERSON_ID,
                            person_name: worklistResult.PATIENT_NAME_FULL,
                            encntr_id: worklistResult.ENCNTR_ID,
                            facility_org_id: worklistResult.FACILITY_ORG_ID,
                            facility_org_name: worklistResult.FACILITY_ORG_NAME,
                            age: worklistResult.PATIENT_AGE,
                            gender_cd: worklistResult.GENDER_CD,
                            gender_display: worklistResult.GENDER_DISPLAY,
                            finNumberAlias: worklistResult.FIN_NBR_ALIAS,
                            appeal_created_ind: worklistResult.APPEAL_CREATED_IND,
                            beg_dt_tm: worklistResult.BEG_DT_TM,
                            end_dt_tm: worklistResult.END_DT_TM,
                            denial_category_cd: worklistResult.DENIAL_CATEGORY_CD,
                            denial_category_display: worklistResult.DENIAL_CATEGORY_DISPLAY,
                            denial_category_meaning: worklistResult.DENIAL_CATEGORY_MEANING,
                            denial_type_cd: worklistResult.DENIAL_TYPE_CD,
                            denial_type_display: worklistResult.DENIAL_TYPE_DISPLAY,
                            denial_reason_cd: worklistResult.DENIAL_REASON_CD,
                            denial_reason_display: worklistResult.DENIAL_REASON_DISPLAY,
                            payer_org_id: worklistResult.PAYER_ORG_ID,
                            payer_org_name: worklistResult.PAYER_ORG_NAME,
                            letter_dt_tm: worklistResult.LETTER_DT_TM,
                            notice_received_dt_tm: worklistResult.NOTICE_RECEIVED_DT_TM,
                            appeal_by_dt_tm: worklistResult.APPEAL_BY_DT_TM,
                            denial_risk_amount: worklistResult.DENIAL_RISK_AMOUNT,
                            working_diagnosis: worklistResult.WORKING_DIAGNOSIS,
                            working_diagnosis_desc: worklistResult.WORKING_DIAGNOSIS_DESC,
                            working_drg: worklistResult.WORKING_DRG,
                            working_drg_desc: worklistResult.WORKING_DRG_DESC,
                            final_diagnosis: worklistResult.FINAL_DIAGNOSIS,
                            final_diagnosis_desc: worklistResult.FINAL_DIAGNOSIS_DESC,
                            final_drg: worklistResult.FINAL_DRG,
                            final_drg_desc: worklistResult.FINAL_DRG_DESC,
                            most_recent_drg_transfer_ind: worklistResult.MOST_RECENT_DRG_TRANSFER_IND,
                            denial_prsnl_id: worklistResult.DENIAL_PRSNL_ID,
                            denial_prsnl_name: worklistResult.DENIAL_PRSNL_NAME,
                            denied_days_link: recordData.DENIED_DAYS_LINK,
                            denied_days_viewpoint_link: recordData.DENIED_DAYS_VIEWPOINT_LINK,
                            denied_days_view_link: recordData.DENIED_DAYS_VIEW_LINK,
                            financial_class_cd: worklistResult.FINANCIAL_CLASS_CD,
                            financial_class_display: worklistResult.FINANCIAL_CLASS_DISPLAY,
                            drgs : tempDRGs,
							careManagers : tempCareManagers,
							updt_cnt : worklistResult.UPDT_CNT,
							canceled_denied_day_ind : worklistResult.CANCELED_DENIED_DAY_IND,
							claim_number : worklistResult.CLAIM_NUMBER
						});
                    }
                }
				else
                    if (info.readyState == 4 && info.status != 200) {
                    }
                else {
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
                    for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                        var ss = statusData.SUBEVENTSTATUS[x];
                        errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                    }
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_DENIED_DAYS", 0);
        info.send(sendAr.join(","));
        return worklistData;
    };

	this.modifyEncounterInformation = function(jsonRequest){
		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "16", "^", JSON.stringify(jsonRequest), "^");
		var reply;
		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState === 4 && info.status === 200) {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if(recordData.STATUS_DATA.STATUS === "S"){
					reply = {
						status: 0,
						updt_cnt: recordData.UPDT_CNT
					};
				}
				if (recordData.STATUS_DATA.STATUS === "F") {
					reply = {
						status: 1,
						updt_cnt: ""
					};
				}
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
			else if (info.readyState === 4 && info.status !== 200) {
				reply = {
					status: -1,
					updt_cnt: ""
				};
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
		};
		info.open('GET', "RCM_DENIED_DAYS", 0);
		info.send(sendAr.join(","));
		return reply;
	}

};
