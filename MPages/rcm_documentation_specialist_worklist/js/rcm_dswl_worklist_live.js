/**
 * Defines a live service delegate for the documentation specialist worklist.
 *
 * @author Dana Estes - Revenue Cycle Access
 */
function DocumentationSpecialistWorklistDelegate(){
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

                        patientLists.push({
                            id: patientList.ID,
                            name: patientList.NAME,
                            typeCd: patientList.TYPECD,
                            arguments: argumentArray,
                            encounterTypes: encounterTypeArray
                        });
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
        info.open('GET', "RCM_DOCUMENT_REVIEW_WORKLIST", 0);
        info.send(sendAr.join(","));
        return patientLists;
	};

	this.getFilterPreferences = function(listId, listName){
		var jsonReq = {
			patientListId: listId,
			patientListName: RCM_Clinical_Util.encodeString(listName)
		};
		var sendJsonString = JSON.stringify(jsonReq);
		var sendJson = "^{\"get_worklist_prefs_request\":" + sendJsonString + "}^";
		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "^GET_WORKLIST_PREFS^", sendJson);

		var reply;
		var filterAndPreferences = {};
		var info = new XMLCclRequest();
		info.onreadystatechange = function(){
			if(info.readyState === 4 && info.status === 200){
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;

				if(recordData.STATUS_DATA.STATUS === "S"){
					filterAndPreferences.availableEncounterTypes = new Array();
					filterAndPreferences.availableFinancialClassValues = new Array();
					for(var i = 0; i <  recordData.AVAILABLEFILTERDATA.ENCOUNTERTYPES.length; i++){
						var encounterType = recordData.AVAILABLEFILTERDATA.ENCOUNTERTYPES[i];
						filterAndPreferences.availableEncounterTypes.push(({name: encounterType.NAME, id: encounterType.ID}));
					}
					for(var i = 0; i < recordData.AVAILABLEFILTERDATA.FINANCIALCLASSVALUES.length; i++){
						var financialClass = recordData.AVAILABLEFILTERDATA.FINANCIALCLASSVALUES[i];
						filterAndPreferences.availableFinancialClassValues.push({name: financialClass.NAME, id:financialClass.ID});
					}
					var selectedEncounterTypes = new Array();
					for(var i = 0; i < recordData.SELECTEDFILTERDATA.ENCOUNTERTYPES.length; i++){
						var encounterTypePref = recordData.SELECTEDFILTERDATA.ENCOUNTERTYPES[i];
						selectedEncounterTypes.push({id: encounterTypePref.ID});
					}
					var selectedFinancialClassValues = new Array();
					for(var i = 0; i < recordData.SELECTEDFILTERDATA.FINANCIALCLASSVALUES.length; i++){
						var finClassPref = recordData.SELECTEDFILTERDATA.FINANCIALCLASSVALUES[i];
						selectedFinancialClassValues.push({id: finClassPref.ID});
					}

					var selectedPayerValues = new Array();
					for(var i = 0; i < recordData.SELECTEDFILTERDATA.PAYERS.length; i++){
						var payerPref = recordData.SELECTEDFILTERDATA.PAYERS[i];
						selectedPayerValues.push({id: payerPref.ID, name: payerPref.NAME });
					}

					filterAndPreferences.preferences = {
						encounterPreferences: selectedEncounterTypes,
						financialClassPreferences: selectedFinancialClassValues,
						documentReviewedRange: recordData.SELECTEDFILTERDATA.RELATIVEREVIEWRANGE,
						personnelReltn: recordData.SELECTEDFILTERDATA.PERSONNELRELTN,
						includeCompleteDocReviewInd: recordData.SELECTEDFILTERDATA.INCLUDECOMPLETEDOCREVIEWIND,
						includeNoNextDocReviewDateInd: recordData.SELECTEDFILTERDATA.INCLUDENONEXTDOCREVIEWDATEIND,
						primarySortColumnNameKey: recordData.SELECTEDFILTERDATA.PRIMARYSORTCOLUMNNAMEKEY,
						primarySortDirectionInd: recordData.SELECTEDFILTERDATA.PRIMARYSORTDIRECTIONIND,
						secondarySortColumnNameKey: recordData.SELECTEDFILTERDATA.SECONDARYSORTCOLUMNNAMEKEY,
						secondarySortDirectionInd: recordData.SELECTEDFILTERDATA.SECONDARYSORTDIRECTIONIND,
						relativeReviewRange: recordData.SELECTEDFILTERDATA.RELATIVEREVIEWRANGE,
						payerPreferences : selectedPayerValues
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
			else if (info.readyState === 4 && info.status != 200) {
				filterAndPreferences.availableEncounterTypes = [];
				filterAndPreferences.availableFinancialClassValues = [];
				filterAndPreferences.preferences = {
					encounterPreferences: [],
						financialClassPreferences: [],
						documentReviewedRange: 0,
						personnelReltn: rcm_documentation_specialist_worklist_i18n.DSWL_VALUE_ASSIGNED_TO_ME,
						includeCompleteDocReviewInd: 0,
						includeNoNextDocReviewDateInd: 0,
						primarySortColumnNameKey: "documentReviewDueDate",
						primarySortDirectionInd: 0,
						secondarySortColumnNameKey: "DRGCode",
						secondarySortDirectionInd: 1,
						relativeReviewRange: 0
				};
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
		};
		info.open('GET', "rcm_document_review_worklist", 0);
		info.send(sendAr.join(","));
		return filterAndPreferences;
	};

	this.saveFilterPreferences = function(list, filters){
		var filterEncounterTypes = filters.encounterTypes;
		var jsonFilterEncounterTypes = [];
		for(var i = 0; i < filterEncounterTypes.length; i++){
			var filterEncounterType = filterEncounterTypes[i];
			jsonFilterEncounterTypes.push({
				"id" : filterEncounterType
			});
		}

		var filterFinancialClasses = filters.financialClasses;
		var jsonFilterFinancialClasses = [];
		for(var i = 0; i < filterFinancialClasses.length; i++){
			var filterFinancialClass = filterFinancialClasses[i];
			jsonFilterFinancialClasses.push({
				"id" : filterFinancialClass
			});
		}

		var filterPayers = filters.payers;
		var jsonFilterPayers = [];
		for(var i = 0; i < filterPayers.length; i++){
			var filterPayer = filterPayers[i];
			jsonFilterPayers.push({
				"id" : filterPayer.ID
			});
		}

		var jsonRequest = {
			"save_worklist_prefs_request": {
				"patientListId": list.id,
				"patientListName": RCM_Clinical_Util.encodeString(list.name),
				"encounterTypes": jsonFilterEncounterTypes,
				"financialClassValues": jsonFilterFinancialClasses,
				"payerIds" : jsonFilterPayers,
				"personnelReltn": filters.personnelReltn,
				"includeCompleteDocReviewInd": filters.includeCompleteDocReviewInd,
				"includeNoNextDocReviewDateInd": filters.includeNoNextDocReviewDateInd,
				"primarySortColumnNameKey": filters.primarySortColumnNameKey,
				"primarySortDirectionInd": filters.primarySortDirectionInd,
				"secondarySortColumnNameKey": filters.secondarySortColumnNameKey,
				"secondarySortDirectionInd": filters.secondarySortDirectionInd,
				"relativeReviewRange" :filters.documentReviewedDateRange
			}
		};

		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "^SAVE_WORKLIST_PREFS^", "^"+JSON.stringify(jsonRequest) +"^");
		var returnStatus = 0;
		var info = new XMLCclRequest();
		info.onreadystatechange = function(){
			if(info.readyState === 4 && info.status === 200){
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if(recordData.STATUS_DATA.STATUS === "F"){
					returnStatus = -1;
				}
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
			else if(info.readyState === -4 && info.status !== 200){
				returnStatus = -1;
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
		};
		info.open('GET', "rcm_document_review_worklist", 0);
		info.send(sendAr.join(","));
	};

	this.getWorklistItems = function(list, filters){
		var listEncounterTypes = list.encounterTypes;
		var jsonListEncounterTypes = [];
		for(var i = 0; i < listEncounterTypes.length; i++){
			var listEncounterType = listEncounterTypes[i];
			jsonListEncounterTypes.push({
				"typeCd" : listEncounterType.typeCd
			});
		}

		var filterEncounterTypes = filters.encounterTypes;
		var jsonFilterEncounterTypes = [];
		for(var i = 0; i < filterEncounterTypes.length; i++){
			var filterEncounterType = filterEncounterTypes[i];
			jsonFilterEncounterTypes.push({
				"id" : filterEncounterType
			});
		}

		var filterFinancialClasses = filters.financialClasses;
		var jsonFilterFinancialClasses = [];
		for(var i = 0; i < filterFinancialClasses.length; i++){
			var filterFinancialClass = filterFinancialClasses[i];
			jsonFilterFinancialClasses.push({
				"id" : filterFinancialClass
			});
		}

		var filterPayers = filters.payers;
		var jsonFilterPayers = [];
		for(var i = 0; i < filterPayers.length; i++){
			var filterPayer = filterPayers[i];
			jsonFilterPayers.push({
				"id" : filterPayer.ID
			});
		}

		var jsonRequest = {
			"get_worklist_request": {
				"patientListId": list.id,
				"patientListName": RCM_Clinical_Util.encodeString(list.name),
				"patientListTypeCd": list.typeCd,
				"arguments": list.arguments,
				"encounterTypes": jsonListEncounterTypes,
				"filterData": {
					"encounterTypes": jsonFilterEncounterTypes,
					"financialClasses": jsonFilterFinancialClasses,
					"personnelreltn": filters.personnelReltn,
					"documentReviewedDateRange": filters.documentReviewedDateRange,
					"includeCompleteDocReviewInd": filters.includeCompleteDocReviewInd,
					"includeNoNextDocReviewDateInd": filters.includeNoNextDocReviewDateInd,
					"primarySortColumnNameKey": filters.primarySortColumnNameKey,
					"primarySortDirectionInd": filters.primarySortDirectionInd,
					"secondarySortColumnNameKey": filters.secondarySortColumnNameKey,
					"secondarySortDirectionInd": filters.secondarySortDirectionInd,
					"payers": jsonFilterPayers
				}
			}
		};

		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "^GET_WORKLIST^", "^", JSON.stringify(jsonRequest), "^");
		var worklistItems = {};
		var patientInformation = [];
		var info = new XMLCclRequest();
		info.onreadystatechange = function(){
			if (info.readyState === 4 && info.status === 200) {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;

				if (recordData.STATUS_DATA.STATUS === "S") {
					for (var i = 0; i < recordData.WORKLISTITEMS.length; i++) {
						var worklistResult = recordData.WORKLISTITEMS[i];
						var drgArray = new Array();
						for (var j = 0; j < worklistResult.DRGS.length; j++) {
							var drg = worklistResult.DRGS[j];
							drgArray.push({
								id: drg.ID,
								modifiableInd: drg.MODIFIABLEINDICATOR,
								sourceIdentifier: drg.SOURCEIDENTIFIER,
								description: drg.DESCRIPTION,
								elosHours: drg.ESTIMATEDLENGTHOFSTAYINHOURS,
								finalInd: drg.FINALINDICATOR,
								transferRuleInd: drg.TRANSFERRULEINDICATOR,
								cmWorkingDrgInd: drg.CMWORKINGDRGIND,
								contributerSystem: drg.CONTRIBUTORSYSTEM,
								severityOfIllnessDisplay: drg.SEVERITYOFILLNESSDISPLAY,
								riskOfMortalityDisplay: drg.RISKOFMORTALITYDISPLAY,
								drgWeight: drg.DRGWEIGHT,
								sourceVocabularyDisplay: drg.SOURCEVOCABULARYDISPLAY
							});
						}
						var docSpecialistArray = new Array();
						for(var k = 0; k < worklistResult.DOCSPECIALISTRELATIONSHIPS.length; k++){
							var ds = worklistResult.DOCSPECIALISTRELATIONSHIPS[k];
							docSpecialistArray.push({
								id: ds.ID,
								personnelId: ds.PERSONNELID,
								typeCd: ds.TYPECD,
								typeDisplay: ds.TYPEDISPLAY,
								name: ds.NAMEFULL
							});
						}
						var allDocSpecialistsArray = new Array();
						for(var l = 0; l < worklistResult.ALLDOCSPECIALISTRELATIONSHIPS.length; l++){
							var allDoc = worklistResult.ALLDOCSPECIALISTRELATIONSHIPS[l];
							allDocSpecialistsArray.push({
								id: allDoc.ID,
								personnelId: allDoc.PERSONNELID,
								typeCd: allDoc.TYPECD,
								typeDisplay: allDoc.TYPEDISPLAY,
								name: allDoc.NAMEFULL
							});
						}
						patientInformation.push({
							patientId: worklistResult.PATIENTID,
							encounterId: worklistResult.ENCOUNTERID,
							version: worklistResult.VERSION,
							patientName: worklistResult.PATIENTNAMEFULL,
							birthDate: worklistResult.PATIENTBIRTHDATE,
							age: worklistResult.PATIENTAGE,
							gender: worklistResult.PATIENTGENDERDISP,
							mrn: worklistResult.PATIENTMRN,
							encounterType: worklistResult.ENCOUNTERTYPEDISP,
							finNumber: worklistResult.ENCOUNTERFINANCIALNUMBER,
							finClass: worklistResult.ENCOUNTERFINANCIALCLASSDISP,
							visitReason: worklistResult.ENCOUNTERVISITREASON,
							admitDate: worklistResult.ENCOUNTERADMISSIONDATETIME,
							dischargeDate: worklistResult.ENCOUNTERDISCHARGEDATETIME,
							nurseUnit: worklistResult.NURSEUNITNAME,
							roomNumber: worklistResult.ROOMNUMBER,
							bedNumber: worklistResult.BEDNUMBER,
							attendingPhysician: worklistResult.ENCOUNTERATTENDINGPHYSICIANNAME,
							payer: worklistResult.PRIMARYPAYERNAME,
							healthPlan: worklistResult.PRIMARYHEALTHPLANNAME,
							readmissionFlag: worklistResult.READMISSIONALERTFLAG,
							lengthOfStayHours: worklistResult.LENGTHOFSTAYINHOURS,
							documentReviewStatus: worklistResult.DOCUMENTREVIEWSTATUSDISP,
							documentReviewStatusMean: worklistResult.DOCUMENTREVIEWSTATUSMEANING,
							documentReviewStatusCd: worklistResult.DOCUMENTREVIEWSTATUSCD,
							documentReviewDueDT: worklistResult.DOCUMENTREVIEWDUEDATETIME,
							lastDocumentReviewDT: worklistResult.LASTDOCUMENTREVIEWEDDATETIME,
							followUpResponsePastDueInd: worklistResult.FOLLOWUPRESPONSEPASTDUEIND,
							differingWorkingDrgInd: worklistResult.DIFFERINGWORKINGDRGIND,
							careNoteInd: worklistResult.CARE_NOTE_IND,
							drgs: drgArray,
							concurrentDenialInd: worklistResult.CONCURRENTDENIALIND,
							documentationSpecialist: docSpecialistArray,
							allDocSpecialists: allDocSpecialistsArray,
							notes: worklistResult.NOTES,
                            authorizationDate: worklistResult.EARLIEST_AUTH_END_DT_TM,
                            authorizationHours: worklistResult.EARLIEST_AUTH_END_DT_HOURS,
                            healthPlanAuthorizations: worklistResult.HEALTH_PLAN_AUTHORIZATIONS,
                            patPrsnReltns: worklistResult.PAT_PRSNL_RELTNS,
							nuanceFilterEnabledInd: worklistResult.NUANCEFILTERENABLEDIND,
							medicalService: worklistResult.MEDICALSERVICE
						});
					}
					var statusCodesArray = new Array();
					for(var i = 0; i < recordData.DOCUMENTREVIEWSTATUSCDS.length; i++){
						var sCd = recordData.DOCUMENTREVIEWSTATUSCDS[i];
						statusCodesArray.push({
							value: sCd.VALUE,
							display: sCd.DISPLAY
						});
					}
					var nuanceStatusCodesArray = new Array();
					if (recordData.NUANCEDOCREVIEWSTATUSCDS) {
					    for (var i = 0; i < recordData.NUANCEDOCREVIEWSTATUSCDS.length; i++) {
					        var sCd = recordData.NUANCEDOCREVIEWSTATUSCDS[i];
					        nuanceStatusCodesArray.push({
					            value: sCd.VALUE,
					            display: sCd.DISPLAY
					        });
					    }
					}
					var noteTypeObj = {};
					$.each(recordData.NOTETYPECDS, function(i, val){
	            		noteTypeObj[val.VALUE] = {
	        				"display": val.DISPLAY,
	        				"onlyImportant": val.ONLY_IMPORTANT_IND
	            		};
	            	});
					worklistItems = {
						patients: patientInformation,
						documentReviewDueDateLink: recordData.DOCUMENTREVIEWDUEDATELINK,
						documentReviewDueDateViewpointLink: recordData.DOCUMENTREVIEWDUEDATEVIEWPOINTLINK,
						documentReviewDueDateViewLink: recordData.DOCUMENTREVIEWDUEDATEVIEWLINK,
						readmissionLink: recordData.READMISSIONLINK,
						readmissionViewpointLink: recordData.READMISSIONVIEWPOINTLINK,
						readmissionViewLink: recordData.READMISSIONVIEWLINK,
						patientNameLink: recordData.PATIENTNAMELINK,
						patientNameViewpointLink: recordData.PATIENTNAMEVIEWPOINTLINK,
						patientNameViewLink: recordData.PATIENTNAMEVIEWLINK,
						statusCodes: statusCodesArray,
						nuanceStatusCodes: nuanceStatusCodesArray,
						canAddStatusAndDate: recordData.CANADDMODIFYDOCUMENTREVIEWIND,
						canAddRel: recordData.CANASSIGNRELATIONSHIPIND,
						canUnassignRel: recordData.CANUNASSIGNRELATIONSHIPIND,
						noteTypes: noteTypeObj,
						noteTaskAccess: recordData.CANMODIFYNOTEIND,
                        isEddOn: recordData.PLANNEDDISCHARGEDATEIND,
                        eddAlertInd: recordData.PLANNEDDISCHARGEALERTIND,
                        eddWarnThreshold: recordData.PLANNEDDISCHARGETHRESHOLD,
                        isAuthOn: recordData.AUTHORIZATIONDATEIND,
                        authAlertInd: recordData.AUTHORIZATIONALERTIND,
                        authWarnThreshold: recordData.AUTHORIZATIONTHRESHOLD,
                        isElosOn: recordData.ESTIMATEDLENGTHOFSTAYDATEIND,
                        elosAlertInd: recordData.ESTIMATEDLENGTHOFSTAYALERTIND,
                        elosWarnThreshold: recordData.ESTIMATEDLENGTHOFSTAYTHRESHOLD,
                        patReltTypeConfig : recordData.PAT_PRSNL_RELTN_TYPE_CONFIGS,
                        dueDateTimeInd: recordData.DUE_DATE_TIME_IND
					};
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
				}
				else {
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
				}
			}
		};
		info.open('GET', "rcm_document_review_worklist", 0);
		info.send(sendAr.join(","));
		return worklistItems;
	};

	this.modifyEncounterInformation = function(jsonRequest){
		var sendAr = [];
		sendAr.push("^MINE^", "0.0", "^MODIFY^", "^" + JSON.stringify(jsonRequest) + "^");
		var reply;
		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState === 4 && info.status === 200) {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if(recordData.STATUS_DATA.STATUS === "S"){
					var encounterRelationshipsArray = new Array();
					for(var i = 0; i < recordData.NEWENCOUNTERPERSONNELRELTNIDS.length; i++){
						var era = recordData.NEWENCOUNTERPERSONNELRELTNIDS[i];
						encounterRelationshipsArray.push({
							id: era.ENCOUNTERPERSONNELRELTNID,
							personnelId: era.PERSONNELID
						});
					}
					reply = {
						status: 0,
						entityId: "",
						entityName: "",
						newPersonnelIds: encounterRelationshipsArray
					};
				}
				if (recordData.STATUS_DATA.STATUS === "F") {
					var exceptions = recordData.EXCEPTIONINFORMATION;
					if(exceptions.length > 0) {
						var exception = exceptions[0];
						switch(exception.EXCEPTIONTYPE) {
						case "NO_DOCSPECIALIST_AUTHORIZATION":
							reply = {
								status: 1,
								entityId: exception.ENTITYID,
								entityName: exception.ENTITYNAME,
								newPersonnelIds: []
							};
							break;
						case "STALE_DATA":
							reply = {
								status: 2,
								entityId: "",
								entityName: "",
								newPersonnelIds: []
							};
							break;
						default:
							reply = {
								status: -1,
								entityId: "",
								entityName: "",
								newPersonnelIds: []
							};
						}
					}
					else {
						reply = {
							status: -1,
							entityId: "",
							entityName: "",
							newPersonnelIds: []
						};
					}
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
					entityId: "",
					entityName: "",
					newPersonnelIds: []
				};
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
		};
		info.open('GET', "RCM_MODIFY_UTILIZATION_MGMT", 0);
		info.send(sendAr.join(","));
		return reply;
	};

	this.addCareNote = function(jsonRequest,callback, async){
    	var sendAr = [];
    	sendAr.push("^MINE^", "0.0", "^ADDCAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
    	RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
    };

    this.deleteCareNote = function(jsonRequest,callback, async){
    	var sendAr = [];
    	sendAr.push("^MINE^", "0.0", "^DELETECAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
    	RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
    };

    this.modifyCareNote = function(jsonRequest,callback, async){
    	var sendAr = [];
    	sendAr.push("^MINE^", "0.0", "^MODIFYCAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
    	RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
    };

    this.getEddsByEncounterIds = function(personBatch, handler){
        var encounterIds = []
		for(var i=0; i < personBatch.length; i++){
            encounterIds.push(Math.abs(personBatch[i].encounterId));
        }
        jsonRequest = {
            encounterIds: encounterIds,
            topicMeaning: "MP_DOC_REVIEW_WKLST",
            reportMeaning: "MP_DOC_REVIEW_INFO"
        };
        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^GetPddsByEncounters^", "^" + JSON.stringify(jsonRequest) + "^");

        var businesses = [];

        var info = new XMLCclRequest();
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
                var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                var recordData = jsonEval.RECORD_DATA;
                var eddList;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    eddList = recordData.serviceData;
                    handler("S", eddList);
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                } else {
                    handler("F", eddList);
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            }
        };

        info.open('GET', "RCM_JSON_SERVICE", 1);
        info.send(sendAr.join(","));
    };
};
