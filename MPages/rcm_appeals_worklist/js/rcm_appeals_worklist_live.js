/**
 * Defines a Millennium service delegate for denied days worklist transactions.
 *
 * @author Dana Estes - Revenue Cycle Access
 * @constructor
 */
function AppealsWorklistDelegate(){
    this.getFilterDefaults = function(){
		var json = "^{\"GET_APPEAL_DEFAULTS_REQUEST\":{\"DUMMY_IND\":\"0\"}}^";

		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "14",json);

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
            			defaultSecondarySortDir: recordData.DEFAULT_SECONDARY_SORT_DIR
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
            			defaultSecondarySortDir:0
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
			"SAVE_APPEAL_DEFAULTS_REQUEST": {
				"DEFAULT_ASSIGNED_TO" : deniedDayDefaultFilters.defaultAssignedTo,
				"DEFAULT_PRIMARY_SORT_COLUMN" : deniedDayDefaultFilters.defaultPrimarySortColumn,
				"DEFAULT_PRIMARY_SORT_DIR" : deniedDayDefaultFilters.defaultPrimarySortDir,
				"DEFAULT_SECONDARY_SORT_COLUMN" : deniedDayDefaultFilters.defaultSecondarySortColumn,
				"DEFAULT_SECONDARY_SORT_DIR" : deniedDayDefaultFilters.defaultSecondarySortDir
			}
		};
		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "15", "^",JSON.stringify(jsonRequest),"^");

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
            "GET_APPEAL_WORKLIST_REQUEST": {
                "PRIMARY_SORT_COLUMN": filtersObj.primarySortColumn,
                "PRIMARY_SORT_DIRECTION": filtersObj.primarySortDir,
                "SECONDARY_SORT_COLUMN": filtersObj.secondarySortColumn,
                "SECONDARY_SORT_DIRECTION": filtersObj.secondarySortDir,
                "ARGUMENTS": [{
                    "NAME": filtersObj.name,
                    "VALUE": filtersObj.value,
					"PARENT_ENTITY_NAME": "",
					"PARENT_ENTITY_ID": ""
                }]
            }
        };
        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "13", "^",JSON.stringify(jsonRequest),"^");

		var worklistItems = [];
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (info.readyState == 4 && info.status == 200) {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "S") {
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
						var tempConcurrDenials = [];
						var jsonConcurrDenials = worklistResult.CONCURRENTDENIALS;
						for(var l = 0; l < jsonConcurrDenials.length; l++){
							var jsonConcurrDenial = jsonConcurrDenials[l];
							tempConcurrDenials.push({
								meaning : jsonConcurrDenial.DENIAL_CATEGORY_MEANING,
								display : jsonConcurrDenial.DENIAL_CATEGORY_DISPLAY
							});
						}

                        worklistItems.push({
                            encntr_appeal_id: worklistResult.ENCNTR_APPEAL_ID,
                            person_id: worklistResult.PERSON_ID,
                            person_name: worklistResult.PATIENT_NAME_FULL,
                            encntr_id: worklistResult.ENCNTR_ID,
                            facility_org_id: worklistResult.FACILITY_ORG_ID,
                            facility_org_name: worklistResult.FACILITY_ORG_NAME,
                            age: worklistResult.PATIENT_AGE,
                            gender_cd: worklistResult.GENDER_CD,
                            gender_display: worklistResult.GENDER_DISPLAY,
                            finNumberAlias: worklistResult.FIN_NBR_ALIAS,
                            ext_appeal_agency_cd: worklistResult.EXT_APPEAL_AGENCY_CD,
							ext_appeal_agency_display: worklistResult.EXT_APPEAL_AGENCY_DISPLAY,
							payer_org_id: worklistResult.PAYER_ORG_ID,
							payer_org_name: worklistResult.PAYER_ORG_NAME,
                            appeal_prsnl_id: worklistResult.APPEAL_PRSNL_ID,
                            appeal_prsnl_name: worklistResult.APPEAL_PRSNL_NAME,
                            denied_days_link: recordData.DENIED_DAYS_LINK,
                            denied_days_viewpoint_link: recordData.DENIED_DAYS_VIEWPOINT_LINK,
                            denied_days_view_link: recordData.DENIED_DAYS_VIEW_LINK,
							appeal_expect_resp_dt_tm: worklistResult.APPEAL_EXPECT_RESP_DT_TM,
							appeal_sent_dt_tm: worklistResult.APPEAL_SENT_DT_TM,
							appeal_level_cd: worklistResult.APPEAL_LEVEL_CD,
							appeal_level_display: worklistResult.APPEAL_LEVEL_DISPLAY,
							appeal_status_cd: worklistResult.APPEAL_STATUS_CD,
							appeal_status_display: worklistResult.APPEAL_STATUS_DISPLAY,
							appeal_verified_dt_tm: worklistResult.APPEAL_VERIFIED_DT_TM,
							appeal_comm_type_cd: worklistResult.APPEAL_COMM_TYPE_CD,
							appeal_comm_type_display: worklistResult.APPEAL_COMM_TYPE_DISPLAY,
							tracking_nbr_text: worklistResult.TRACKING_NBR_TEXT,
                            working_diagnosis: worklistResult.WORKING_DIAGNOSIS,
                            working_diagnosis_desc: worklistResult.WORKING_DIAGNOSIS_DESC,
                            working_drg: worklistResult.WORKING_DRG,
                            working_drg_desc: worklistResult.WORKING_DRG_DESC,
                            final_diagnosis: worklistResult.FINAL_DIAGNOSIS,
                            final_diagnosis_desc: worklistResult.FINAL_DIAGNOSIS_DESC,
                            final_drg: worklistResult.FINAL_DRG,
                            final_drg_desc: worklistResult.FINAL_DRG_DESC,
                            most_recent_drg_transfer_ind: worklistResult.MOST_RECENT_DRG_TRANSFER_IND,
                            financial_class_cd: worklistResult.FINANCIAL_CLASS_CD,
                            financial_class_display: worklistResult.FINANCIAL_CLASS_DISPLAY,
                            drgs: tempDRGs,
							careManagers : tempCareManagers,
							concurrentDenials : tempConcurrDenials,
							canceledDeniedDaysInd: worklistResult.CANCELED_DENIED_DAY_IND,
							claim_numbers: worklistResult.CLAIM_NUMBERS
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

        return worklistItems;
    };
};
