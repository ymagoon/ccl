/**
 * Defines a Millennium service delegate for the assignment worklist.
 *
 * @author ms015619 - Revenue Cycle Access
 */
function AssignmentWorklistDelegate(){
    this.getPatientLists = function(){
        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^GET_PATIENT_LISTS^", "^^");

        var patientLists = [];
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (info.readyState === 4 && info.status === 200) {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;

                if (recordData.STATUS_DATA.STATUS === "S") {
                    var i;
                    for (i = 0; i < recordData.PATIENTLISTS.length; i++) {
                    	recordData.PATIENTLISTS[i].NAME = RCM_Clinical_Util.decodeString(recordData.PATIENTLISTS[i].NAME);
                        var patientList = recordData.PATIENTLISTS[i];

                        var args = patientList.ARGUMENTS;
                        var argumentArray = [];
                        if (args) {
                            var j;
                            for (j = 0; j < args.length; j++) {
                                var arg = args[j];

                                argumentArray.push({
                                    name: arg.NAME,
                                    value: arg.VALUE,
                                    parentEntityName: arg.PARENTENTITYNAME,
                                    parentEntityId: arg.PARENTENTITYID
                                });
                            }
                        }

                        var ets = patientList.ENCOUNTERTYPES;
                        var encounterTypeArray = [];
                        if (ets) {
                            var k;
                            for (k = 0; k < ets.length; k++) {
                                var et = ets[k];
                                encounterTypeArray.push({
                                    typeCd: et.TYPECD,
                                    typeDisp: et.TYPEDISP
                                });
                            }
                        }
						var defaultEncounterTypeArray = [];
						if(patientList.WORKLIST_DEFAULTS.length > 0 && patientList.WORKLIST_DEFAULTS[0].ENCOUNTER_TYPES){
							var dets = patientList.WORKLIST_DEFAULTS[0].ENCOUNTER_TYPES;

							if(dets){
								var l;
								for(l = 0; l <dets.length; l++){
									var det = dets[l];
									defaultEncounterTypeArray.push({
										typeCD: det.ENCOUNTER_TYPE_CD
									});
								}
							}
						}
                        var defaults = patientList.WORKLIST_DEFAULTS[0];
                        patientLists.push({
                            id: patientList.ID,
                            name: patientList.NAME,
                            typeCd: patientList.TYPECD,
                            arguments: argumentArray,
                            encounterTypes: encounterTypeArray,
							defaultEncounterTypes: defaultEncounterTypeArray,
							payerID: "empty",
							showCMInd: 1,
							cmRel:rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,
							cmID:"empty",
							showDPInd: 1,
							dpRel:rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,
							dpID: "empty",
							showDRInd: 1,
							drRel:rcm_assignment_worklist_i18n.ASWL_VALUE_ALL,
							drID: "empty",
							primarySortCol: "Location",
							primarySortDir: 0,
							secondarySortCol: "",
							secondarySortDir: 0
                        });
						if(patientList.WORKLIST_DEFAULTS.length > 0){
							patientLists[i].payerID=Number(defaults.PAYER_ID) === 0 ? "empty":defaults.PAYER_ID;
							patientLists[i].showCMInd= defaults.SHOW_CARE_MANAGER_IND;
							patientLists[i].cmRel= defaults.CARE_MANAGER_RELATION;
							patientLists[i].cmID=Number(defaults.CARE_MANAGER_ID) === "0" ? "empty":defaults.CARE_MANAGER_ID;
							patientLists[i].showDPInd= defaults.SHOW_DISCHARGE_PLANNER_IND;
							patientLists[i].dpRel= defaults.DISCHARGE_PLANNER_RELATION;
							patientLists[i].dpID= Number(defaults.DISCHARGE_PLANNER_ID) === 0 ? "empty":defaults.DISCHARGE_PLANNER_ID;
							patientLists[i].showDRInd= defaults.SHOW_DOCUMENTATION_REVIEWER_IND;
							patientLists[i].drRel= defaults.DOCUMENTATION_REVIEWER_RELATION;
							patientLists[i].drID= Number(defaults.DOCUMENTATION_REVIEWER_ID) === 0 ? "empty":defaults.DOCUMENTATION_REVIEWER_ID;
							patientLists[i].primarySortCol= defaults.PRIMARY_SORT_COLUMN;
							patientLists[i].primarySortDir= defaults.PRIMARY_SORT_DIR;
							patientLists[i].secondarySortCol= defaults.SECONDARY_SORT_COLUMN;
							patientLists[i].secondarySortDir= defaults.SECONDARY_SORT_DIR;
						}
                    }
                }
                else {
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
                    var x;
                    for (x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
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
        info.open('GET', "RCM_ASSIGNMENT_WORKLIST", 0);
        info.send(sendAr.join(","));

        return patientLists;
    };

    this.getWorklistItems = function(selectedPatientList, selectedFilters){
        //for sorts: 0 = ascending, 1 = descending

        var primarySortInd = 1;
        if (selectedFilters.primarySortAscending) {
            primarySortInd = 0;
        }

        var secondarySortInd = 1;
        if (selectedFilters.secondarySortAscending) {
            secondarySortInd = 0;
        }

		// Encounter types for patient list
        var encounterTypes = selectedPatientList.encounterTypes;
        var jsonEncounterTypes = [];
        for(var i = 0; i < encounterTypes.length; i++){
        	var encounterType = encounterTypes[i];
        	jsonEncounterTypes.push({
        		"typeCd" : encounterType.typeCd
        	});
        }

		// Selected filter encounter types
		var filterEncounterTypes = selectedFilters.encounterTypes;
		var jsonFilterEncounterTypes = [];
		for(var i = 0; i < filterEncounterTypes.length; i++){
			var filterEncounterType = filterEncounterTypes[i];
			jsonFilterEncounterTypes.push({
				"id" : filterEncounterType.value
			});
		}
        var jsonReq = {
            patientListId: selectedPatientList.id,
            patientListName: RCM_Clinical_Util.encodeString(selectedPatientList.name),
            patientListTypeCd: selectedPatientList.typeCd,
            arguments: selectedPatientList.arguments,
            encounterTypes: jsonEncounterTypes,
            encounterTypeFilters: jsonFilterEncounterTypes,
            payerIdFilter: selectedFilters.payer.value,
            careManagerReltnFilter: selectedFilters.cmRelationship.value,
            careManagerIdFilter: selectedFilters.careManager.value,
            dischargePlannerReltnFilter: selectedFilters.dpRelationship.value,
            dischargePlannerIdFilter: selectedFilters.dischargePlanner.value,
			docSpecialistReltnFilter: selectedFilters.dsRelationship.value,
			docSpecialistIdFilter: selectedFilters.documentationSpecialist.value,
            primarySortColumnNameKey: selectedFilters.primarySort,
            primarySortDirectionInd: primarySortInd,
            secondarySortColumnNameKey: selectedFilters.secondarySort,
            secondarySortDirectionInd: secondarySortInd
        };

        var sendJsonString = JSON.stringify(jsonReq);
        var sendJson = "^{\"get_worklist_request\":" + sendJsonString + "}^";
        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^GET_WORKLIST^", sendJson);

        var reply;
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (info.readyState === 4 && info.status === 200) {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;

                var worklistItems = [];
                var filterItems;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    var i;
                    for (i = 0; i < recordData.WORKLISTITEMS.length; i++) {
                        var item = recordData.WORKLISTITEMS[i];

                        var itemCM = item.ENCOUNTERCAREMANAGERS;
                        var careManagersArray = [];
                        if (itemCM && itemCM.length > 0) {
                            var j;
                            var cmLen = itemCM.length;
                            for (j = 0; j < cmLen; j++) {
								var cm = itemCM[j];
                                careManagersArray.push({
                                    id: cm.ID,
                                    personnelId: cm.PERSONNELID,
                                    name: cm.FULLPERSONNELNAME
                                });
                            }
                        }

                        var itemDP = item.ENCOUNTERDISCHARGEPLANNERS;
                        var dischargePlannersArray = [];
                        if (itemDP && itemDP.length > 0) {
                            var k;
                            var dpLen = itemDP.length;
                            for (k = 0; k < dpLen; k++) {
								var dp = itemDP[k];
                                dischargePlannersArray.push({
                                    id: dp.ID,
                                    personnelId: dp.PERSONNELID,
                                    name: dp.FULLPERSONNELNAME
                                });
                            }
                        }

						var itemDS = item.ENCOUNTERDOCSPECIALISTS;
						var documentationSpecialistsArray = [];
						if(itemDS && itemDS.length > 0){
							var v;
							var dsLen = itemDS.length;
							for(v = 0; v < dsLen; v++) {
								var ds = itemDS[v];
								documentationSpecialistsArray.push({
									id: ds.ID,
									personnelId: ds.PERSONNELID,
									name: ds.FULLPERSONNELNAME
								});
							}
						}

                        worklistItems.push({
                            patientId: item.PATIENTID,
                            encounterId: item.ENCOUNTERID,
                            version: item.VERSION,
                            name: item.PATIENTNAMEFULL,
                            gender: item.PATIENTGENDERDISP,
                            age: item.PATIENTAGE,
                            nurseUnit: item.NURSEUNITNAME,
                            roomNumber: item.ROOMNUMBER,
                            bedNumber: item.BEDNUMBER,
                            encounterTypeCd: item.ENCOUNTERTYPECD,
                            encounterType: item.ENCOUNTERTYPEDISP,
                            fin: item.ENCOUNTERFINANCIALNUMBER,
                            primaryPayer: item.PRIMARYPAYERNAME,
                            primaryPayerId: item.PRIMARYPAYERID,
                            financialClass: item.ENCOUNTERFINANCIALCLASSDISP,
                            careManagers: careManagersArray,
                            dischargePlanners: dischargePlannersArray,
							documentationSpecialists: documentationSpecialistsArray
                        });
                    }

                    var filterData = recordData.FILTERDATA;
                    if (filterData) {

                        var ets = filterData.ENCOUNTERTYPES;
                        var encounterTypeFilterArray = [];
                        if (ets && ets.length > 0) {
                            var l;
                            var etsLen = ets.length;
                            for (l = 0; l < etsLen; l++) {
                                var et = ets[l];
                                encounterTypeFilterArray.push({
                                    id: et.ID,
                                    name: et.NAME
                                });
                            }
                        }

                        var pfs = filterData.PAYERS;
                        var payerFilterArray = [];
                        if (pfs && pfs.length > 0) {
                            var m;
                            var pfsLen = pfs.length;
                            for (m = 0; m < pfsLen; m++) {
                                var pf = pfs[m];
                                payerFilterArray.push({
                                    id: pf.ID,
                                    name: pf.NAME
                                });
                            }
                        }
                        var cmfs = filterData.CAREMANAGERS;
                        var careManagerFilterArray = [];
                        if (cmfs && cmfs.length > 0) {
                            var n;
                            var cmfsLen = cmfs.length;
                            for (n = 0; n < cmfsLen; n++) {
                                var cmf = cmfs[n];
                                careManagerFilterArray.push({
                                    id: cmf.ID,
                                    name: cmf.NAME
                                });
                            }
                        }

                        var dpfs = filterData.DISCHARGEPLANNERS;
                        var dischargePlannerFilterArray = [];
                        if (dpfs && dpfs.length > 0) {
                            var o;
                            var dpfsLen = dpfs.length;
                            for (o = 0; o < dpfsLen; o++) {
                                var dpf = dpfs[o];
                                dischargePlannerFilterArray.push({
                                    id: dpf.ID,
                                    name: dpf.NAME
                                });
                            }
                        }

						var dsfs = filterData.DOCSPECIALISTS;
						var documentationSpecialistFilterArray = [];
						if(dsfs && dsfs.length > 0){
							var p;
							var dsfsLen = dsfs.length;
							for(p = 0; p < dsfsLen; p++){
								var dsf = dsfs[p];
								documentationSpecialistFilterArray.push({
									id: dsf.ID,
									name: dsf.NAME
								});
							}
						}

						filterItems = {
				            encounterTypeFilters: encounterTypeFilterArray,
				            payerFilters: payerFilterArray,
				            careManagerFilters: careManagerFilterArray,
				            dischargePlannerFilters: dischargePlannerFilterArray,
							documentationSpecialistFilters: documentationSpecialistFilterArray
				        }
                    }

					if (!filterItems){
						filterItems = {};
					}

					var canAssignRelationshipIndicator = recordData.CANASSIGNRELATIONSHIPIND;
					var canUnassignRelationshipIndicator = recordData.CANUNASSIGNRELATIONSHIPIND;
					var isCMDefinedIndicator = recordData.ISCMDEFINEDIND;
					var isDPDefinedIndicator = recordData.ISDPDEFINEDIND;
					var isDSDefinedIndicator = recordData.ISDSDEFINEDIND;
					var secondarySortValueName = recordData.SECONDARYSORTCOLUMNNAMEKEY;
					var currentUserId = recordData.CURRENTUSERID;
					var currentUserName = recordData.CURRENTUSERNAME;
					var patientNameLink = recordData.PATIENTNAMELINK;
					var patientNameViewpointLink = recordData.PATIENTNAMEVIEWPOINTLINK;
					var patientNameViewLink = recordData.PATIENTNAMEVIEWLINK;
					var availablePersonnels = recordData.AVAILABLEPERSONNELS;
                    reply = {
                        worklistItems: worklistItems,
                        filters: filterItems,
						canAssignInd: canAssignRelationshipIndicator,
						canUnassignInd: canUnassignRelationshipIndicator,
						isCMDefinedInd: isCMDefinedIndicator,
						isDPDefinedInd: isDPDefinedIndicator,
						isDSDefinedInd: isDSDefinedIndicator,
						secondarySortValue: secondarySortValueName,
						currentUserId: currentUserId,
						currentUserName: currentUserName,
						patientNameLink: patientNameLink,
						patientNameViewpointLink: patientNameViewpointLink,
						patientNameViewLink: patientNameViewLink,
						availablePersonnels: availablePersonnels
                    };
                }
                else {
                    return null;
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
            else {
                if (info.readyState === 4 && info.status !== 200) {
                    return null;
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            }
        };
        info.open('GET', "RCM_ASSIGNMENT_WORKLIST", 0);
        info.send(sendAr.join(","));
        return reply;
    };

    /**
     * Makes a maintain relationship service call.
     * @param worklistItems The array of worklist items that contain the maintain information for each patient/encounter.
     * @return The status of the operation.
     * 			0 = Success
     * 		   -1 = General Failure
     * 			1 = There is no relationship defined in the BedRock for Care Manager.
     * 			2 = There is no relationship defined in the BedRock for Discharge Manager.
     * 			3 = No authorization to assign new relationship for Care Manager.
     * 			4 = No authorization to assign new relationship for Discharge Planner.
     */
    this.maintainRelationships = function(worklistItems) {
    	var jsonWorklistItems = [];
    	for(var i = 0; i < worklistItems.length; i++) {
    		var worklistItem = worklistItems[i];

    		var jsonAddCareManagers = [];
			for (var j = 0; j < worklistItem.addCareManagers.length; j++) {
				jsonAddCareManagers.push({
					"ID": worklistItem.addCareManagers[j]
				});
			}

    		var jsonAddDischargePlanners = [];
			for (var j = 0; j < worklistItem.addDischargePlanners.length; j++) {
				jsonAddDischargePlanners.push({
					"ID": worklistItem.addDischargePlanners[j]
				});
			}

			var jsonAddDocSpecialists = [];
			for(var j = 0; j < worklistItem.addDocSpecialists.length; j++){
				jsonAddDocSpecialists.push({
					"ID": worklistItem.addDocSpecialists[j]
				});
			}

    		var jsonRemovePersonnelRelationships = [];
			for (var j = 0; j < worklistItem.removeRelationshipIds.length; j++) {
				jsonRemovePersonnelRelationships.push({
					"ID": worklistItem.removeRelationshipIds[j]
				});
			}
    		jsonWorklistItems.push({
    			"ENCOUNTERID" : worklistItem.encounterId,
    			"VERSION" : worklistItem.version,
    			"PATIENTID" : worklistItem.patientId,
    			"ADDCM" : jsonAddCareManagers,
    			"ADDDP" : jsonAddDischargePlanners,
				"ADDDS" : jsonAddDocSpecialists,
    			"REMOVE" : jsonRemovePersonnelRelationships
    		});
    	}

		var jsonRequest = {
				"MAINTAIN_PRSNL_RELTN_REQUEST": {
					"WORKLISTITEMS" : jsonWorklistItems
				}
		};

		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "^MAINTAIN_PRSNL_RELTN^", "^" + JSON.stringify(jsonRequest) + "^");

		var status = 0;
    	var info = new XMLCclRequest();
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
        		var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "F") {
                	var exceptions = recordData.EXCEPTIONINFORMATION;
                	if(exceptions.length > 0) {
                		var exception = exceptions[0];
                		switch(exception.EXCEPTIONTYPE) {
                		case "NO_MANAGER_AUTHORIZATION":
                			status = 1;
                			break;
                		case "NO_PLANNER_AUTHORIZATION":
                			status = 2;
                			break;
                		case "NO_DOCSPECIALIST_AUTHORIZATION":
                			status = 3;
                			break;
                		case "STALE_DATA":
                			status = 4;
                			break;
                		default:
                			status = -1;
                		}
                	}
                	else {
                		status = -1;
                	}
                }
                try {
                    info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            else if (info.readyState === 4 && info.status !== 200) {
                status = -1;
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_ASSIGNMENT_WORKLIST", 0);
        info.send(sendAr.join(","));
        return status;
    };
}