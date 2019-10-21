function ACM_Patient_Controller(controller){
	this.patientDataById = []; //A list of patient objects keyed by patient id.
	var removablePatientIds = []; //A list of patient IDs that no longer qualify and can be removed
	var m_patientController = this;
	var m_controller = controller;
	var filterDefinition = {
		"GENDER": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceField": "SEX_CD"
		},
		"RACE": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceList": "RACES",
			"dataSourceField": "RACE_CD"
		},
		"LANGUAGE": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceField": "LANGUAGE_CD"
		},
		"HEALTHPLAN": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceList": "HEALTH_PLANS",
			"dataSourceField": "PLAN_TYPE_CD",
			"columnLoadInd": "healthPlans"
		},
		"CASEMANAGER": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceList": "PPRS",
			"dataSourceField": "PRSNL_ID",
			"columnLoadInd": "providerReltns"
		},
		"FINANCIALCLASS": {
			"realtime": true,
			"type": "multiParentIdValue",
			"dataSourceList": "HEALTH_PLANS",
			"dataSourceField": "FIN_CLASS_CD",
			"columnLoadInd": "healthPlans"
		},
		"CONDITION": {
			"realtime": true,
			"type": "multiStringValue",
			"dataSourceList": "CONDITIONS",
			"dataSourceField": "NAME",
			"columnLoadInd": "conditions"
		},
		"CONDITION_OPERATOR": {
			"realtime": true,
			"type": "multiStringValue",
			"dataSourceList": "CONDITIONS",
			"dataSourceField": "NAME",
			"columnLoadInd": "conditions"
		},
		"RANKINGFROM": {
			"realtime": true,
			"type": "rangeValue",
			"operator": ">=",
			"dataSourceField": "RANK"
		},
		"RANKINGTO": {
			"realtime": true,
			"type": "rangeValue",
			"operator": "<=",
			"dataSourceField": "RANK"
		},
		"AGELESS": {
			"realtime": true,
			"type": "age",
			"operator": ">",
			"dataSourceField": "BIRTH_DT_TM"
		}, //flip age operator since comparing to date X years back
		"AGEGREATER": {
			"realtime": true,
			"type": "age",
			"operator": "<",
			"dataSourceField": "BIRTH_DT_TM"
		},
		"AGEFROM": {
			"realtime": true,
			"type": "age",
			"operator": "<=",
			"dataSourceField": "BIRTH_DT_TM"
		},
		"AGETO": {
			"realtime": true,
			"type": "age",
			"operator": ">=",
			"dataSourceField": "BIRTH_DT_TM"
		},
		"AGEEQUAL": {
			"realtime": true,
			"type": "age",
			"operator": "==",
			"dataSourceField": "BIRTH_DT_TM"
		},
		"AGEDAYS": {
			"realtime": true,
			"type": "age"
		},
		"AGEWEEKS": {
			"realtime": true,
			"type": "age"
		},
		"AGEMONTHS": {
			"realtime": true,
			"type": "age"
		},
		"AGEYEARS": {
			"realtime": true,
			"type": "age"
		},
		"ADMISSIONDAYS": {
			"realtime": true,
			"type": "admission",
			"dataSourceList": "ENCOUNTERS",
			"dataSourceField": "REG_DATE",
			"columnLoadInd": "encounters"
		},
		"ADMISSIONWEEKS": {
			"realtime": true,
			"type": "admission",
			"dataSourceList": "ENCOUNTERS",
			"dataSourceField": "REG_DATE",
			"columnLoadInd": "encounters"
		},
		"ADMISSIONMONTHS": {
			"realtime": true,
			"type": "admission",
			"dataSourceList": "ENCOUNTERS",
			"dataSourceField": "REG_DATE",
			"columnLoadInd": "encounters"
		},
		'ENCOUNTERTYPE': {
			'realtime': true,
			'type': 'multiParentIdValue',
			'dataSourceList': 'ENCOUNTERS',
			'dataSourceField': 'ENCNTR_GROUPS',
			'columnLoadInd': 'encounters'
		},
		"REGISTRY": {
			"realtime": true,
			"type": "multiStringValue",
			"dataSourceList": "REGISTRY",
			"dataSourceField": "NAME",
			"columnLoadInd": "conditions"
		},
		"QUALIFYING": {
			"realtime": true,
			"type": "qualifying"
		},
		"RISK": {
			"realtime": true,
			"type": "multiStringValue",
			"dataSourceField": "RISK_TEXT",
			"columnLoadInd": "risks"
		},
		'COMMUNICATIONPREF': {
			'realtime': true,
			'type': 'multiParentIdValue',
			'dataSourceField': 'CONTACT_METHOD_CD'
		},
		'PENDING_WORK': {
			'realtime': true,
			'type': 'pendingWork',
			'columnLoadInd': 'workItems'
		}
	};
							
	var defaultSort = {field:"NAME_FULL_FORMATTED",
						fieldType:"alpha",
						direction:-1};

	var sortCriteria = {
					SORT_BY_NAME : 1,
					SORT_BY_RANK : 2,
					SORT_BY_QUALIFIED_DATE : 3,
					SORT_BY_LAST_ACTION : 4 };
	this.resetListData = function() {
		this.patientDataById = {};
		removablePatientIds = [];
		
		defaultSort.field = "NAME_FULL_FORMATTED";
		defaultSort.fieldType = "alpha";
		defaultSort.direction = -1;
	};
	this.setBasePatientData = function(patients) {
		for (var j = 0, x = patients.length; j < x; j++) {
			var patient = patients[j];
			var deceasedDate = new Date();
			if(patient.BIRTH_DT_TM && patient.BIRTH_DT_TM != "") {
				var birthDate = new Date();
				birthDate.setISO8601(patient.BIRTH_DT_TM);
				patient.BIRTH_DT_TM = birthDate;
				birthDate = null;
			} else {
				patient.BIRTH_DT_TM = null;
			}
			if(patient.DECEASED_DT_TM && patient.DECEASED_DT_TM != '') {
				deceasedDate.setISO8601(patient.DECEASED_DT_TM);
				patient.DECEASED_DT_TM = deceasedDate;
				deceasedDate = null;
			} else {
				patient.DECEASED_DT_TM = null;
			}
			if(patient.LAST_ACTION_DT_TM && patient.LAST_ACTION_DT_TM != "") {
				var qualifiedDate = new Date();
				qualifiedDate.setISO8601(patient.LAST_ACTION_DT_TM);
				patient.LAST_ACTION_DT_TM = qualifiedDate;
				qualifiedDate = null;
			} else {
				patient.LAST_ACTION_DT_TM = null;
			}
			
			if(patient.LAST_COMP_ACTION_DT_TM && patient.LAST_COMP_ACTION_DT_TM != "") {
				var actionDate = new Date();
				actionDate.setISO8601(patient.LAST_COMP_ACTION_DT_TM);
				patient.LAST_COMP_ACTION_DT_TM = actionDate;
				actionDate = null;
			} else {
				patient.LAST_COMP_ACTION_DT_TM = null;
			}
			patient.columnLoadIndicator = {providerReltns : 0, encounters : 0, conditions : 0, healthPlans : 0, risks: 0, workItems: 0};

			this.patientDataById[patients[j].PERSON_ID] = patient;
			patient = null;
		}
	};
	this.storePatientColumns = function(columnData, columnLoadName) {
		var incomingPatients = columnData.PATIENTS;
		var aoIncomingMaraScores = columnData.MARA_SCORES || [];
		var oParsedMaraJson = {};
		var I_NO_MARA_SCORE = -1;
		var updatedPatients = [];
		var bIsPatientPresentInMaraReply = false;
	
		for (var i = 0; i < incomingPatients.length ; i++) {
			var patientData = this.patientDataById[incomingPatients[i].PERSON_ID];
			if(patientData == undefined) {
				continue;
			}
			
			patientData.columnLoadIndicator[columnLoadName] = 2; //2 = loaded
			
			updatedPatients.push(patientData);

			var aPendingCallsList = incomingPatients[i].PENDING_CALLS;
			var aCompletedCallsList = incomingPatients[i].COMPLETED_CALLS;
			var incomingPPRs = incomingPatients[i].PPRS;
			if(incomingPPRs.length > 0) {
				patientData.PPRS = incomingPPRs;
			}
			
			var planList = incomingPatients[i].HEALTH_PLANS;
			if(planList.length > 0) {
				patientData.HEALTH_PLANS = planList;
			}
			
			var conditionList = incomingPatients[i].CONDITIONS;
			if(conditionList.length > 0) {
				patientData.CONDITIONS = conditionList;
			}
			
			var registryList = incomingPatients[i].REGISTRY;
			if(registryList.length > 0){
				patientData.REGISTRY = registryList;
			}
			
			var encounterList = incomingPatients[i].ENCOUNTERS;
			if(encounterList.length > 0) {
				patientData.ENCOUNTERS = encounterList;
			}
			
			var risk_text = incomingPatients[i].RISK_TEXT;
			var risk_value = incomingPatients[i].RISK_VALUE;
			if(risk_text.length > 0 && risk_value) {
				patientData.RISK_TEXT = risk_text;
				patientData.RISK_VALUE = risk_value;
			}
			
			if($.isArray(aoIncomingMaraScores) === true) {
				for(var j = 0, jLen = aoIncomingMaraScores.length; j < jLen; j++) {
					if(typeof aoIncomingMaraScores[j].MARA_SCORE_REPLY === 'string' && aoIncomingMaraScores[j].MARA_SCORE_REPLY.length > 0) {
						oParsedMaraJson = json_parse(aoIncomingMaraScores[j].MARA_SCORE_REPLY);
						for(var a = 0, aLen = oParsedMaraJson.persons.length; a < aLen; a++) {
							bIsPatientPresentInMaraReply = $.isPlainObject(oParsedMaraJson.persons[a]) === true &&
								$.isArray(oParsedMaraJson.persons[a].record_ids) &&
								$.grep(oParsedMaraJson.persons[a].record_ids, function(oRecord) {
									return parseInt(oRecord.data_partition_person_id, 10) === patientData.PERSON_ID;
								}).length > 0;
							if(bIsPatientPresentInMaraReply === true) {
								patientData.MARA_SCORE = (oParsedMaraJson.persons[a].mara_total_risk_score || I_NO_MARA_SCORE).toFixed(2);
							}
						}
					}
				} 
			}

			var commentList = incomingPatients[i].COMMENTS;
			if(commentList.length > 0) {
				patientData.COMMENTS = commentList;
				for(var j=0,len=commentList.length;j<len;j++){
					if(commentList[j].COMMENT_TYPE==2){
						var upDtTm = commentList[j].UPDT_DT_TM || null;
						var actionDate = new Date();
						actionDate.setISO8601(upDtTm);
						patientData.LAST_COMP_ACTION_DT_TM = actionDate;
						break; // only need the most recent 
					}
				}
			}

			if(aPendingCallsList.length > 0) {
				patientData.aPendingCalls = aPendingCallsList;
			}
			
			if(aCompletedCallsList.length > 0) {
				patientData.aCompletedCalls = aCompletedCallsList;
			}
			
			aPendingCallsList = null;
			aCompletedCallsList = null;
		}	
		if(columnData.ENCNTR_GROUP.length > 0) {
			this.processEncounters(columnData); 
		}	
		
		return updatedPatients;
	};
	this.fnUpdatePatientPhoneCallData = function(oPatient) {
		var oPatientData = this.patientDataById[oPatient.PERSON_ID];
		var aPendingCallsList = oPatient.aPendingCalls;
		var aCompletedCallsList = oPatient.aCompletedCalls;
		
		if(aPendingCallsList.length > 0) {
			oPatientData.PENDING_CALLS = aPendingCallsList;
		}
		
		if(aCompletedCallsList.length > 0) {
			oPatientData.COMPLETED_CALLS = aCompletedCallsList;
		}
		
		aPendingCallsList = null;
		aCompletedCallsList = null;
	};
	this.processEncounters = function(columnData) {
		var encounterGroupAr = columnData.ENCNTR_GROUP,
			dateNow = new Date(),
			date24HoursAgo = new Date(),
			date1900 = new Date(0,0),
			incomingPatient,
			dataPatient,
			incomingEncounter,
			curEncBucket,
			encntrGroup,
			dateBackRange,
			dischDate,
			admitDate;

		date24HoursAgo.setDate(dateNow.getDate() - 1);
		for(var i=0, iLength=columnData.PATIENTS.length; i<iLength; i++){
			incomingPatient = columnData.PATIENTS[i];
			dataPatient = this.patientDataById[columnData.PATIENTS[i].PERSON_ID];
			dataPatient.encounterBucketAr = $.extend(true,[],encounterGroupAr);
			for(var j=0, jLength=incomingPatient.ENCOUNTERS.length; j<jLength; j++){
				incomingEncounter = incomingPatient.ENCOUNTERS[j];
				
				for(var k=0, kLength=dataPatient.encounterBucketAr.length; k<kLength; k++){
					curEncBucket = dataPatient.encounterBucketAr[k];
					if(!curEncBucket.encounterAr){
						curEncBucket.encounterAr = [];
						curEncBucket.enc24HoursAdmAr = [];
						curEncBucket.enc24HoursDisAr = [];
					}
					for(var m=0, mLength=incomingEncounter.ENCNTR_GROUPS.length; m<mLength; m++){
						encntrGroup = incomingEncounter.ENCNTR_GROUPS[m].GROUP;
						if(encntrGroup === curEncBucket.ENCNTR_GROUP){
							dateBackRange = new Date();
							dischDate = convertSQLDateStringToJS(incomingEncounter.DISCH_DT_TM);
							admitDate = convertSQLDateStringToJS(incomingEncounter.REG_DATE);

							dateBackRange.setDate(dateNow.getDate() - curEncBucket.ENCNTR_GROUP_DAYS);

							if(admitDate >= date24HoursAgo && admitDate <= dateNow){
								curEncBucket.enc24HoursAdmAr.push(incomingEncounter);
							}
							if(dischDate >= date24HoursAgo && dischDate <= dateNow){
								curEncBucket.enc24HoursDisAr.push(incomingEncounter);
							}
							if(dischDate >= dateBackRange || (dischDate < date1900)){
								curEncBucket.encounterAr.push(incomingEncounter);
							}
						}
					}
				}
			}
		}
	};
	this.getExportListString = function(patientsToSave,oWorklist){
		if(!oWorklist || !oWorklist.columns || !patientsToSave){
			return;
		}
		
		var displayedCols = [
				{key:"NAME",title:i18n.rwl.PATIENTNAME},
				{key:"DOB",title:i18n.rwl.DOB.replace(/:/g,"")},
				{key:"AGE",title:i18n.rwl.AGE},
				{key:"SEX",title:i18n.rwl.SEX},
				{key:"MRN",title:i18n.rwl.MRN.replace(/:/g,"")},
				{key:"RANK",title:i18n.rwl.RANK}
			],
			possibleCols = [
				"COL_PRI_CARE_PHY",
				"COL_CONDITIONS",
				"COL_PAYER_HP_CLASS",
				"COL_ADM_DISCH_LAST_24HRS",
				"COL_VISITS_TIMEFRAME",
				"COL_CASE_MANAGER",
				"COL_REGISTRY_IMPORT",
				"COL_QUALIFIED_DATE",
				"COL_LAST_COMP_ACTION",
				'COL_RISK'
			];
		var bUTCDate = true;
		for(var x=0,len=oWorklist.columns.length;x<len;x++){
			if(/*oWorklist.columns[x].display &&*/   // show all columns
				$.inArray(oWorklist.columns[x].key,possibleCols)>=0)
				displayedCols.push({key:oWorklist.columns[x].key,title:oWorklist.columns[x].title});
		}
		var sHeader = "";
		for(var y=0,len=displayedCols.length;y<len;y++){
			sHeader += ((y>0)?",":"") + displayedCols[y].title;
		}
		
		var date1900 = new Date(0,0);
		var exportListString = "sep=,\n" + sHeader + "\n";
		for(var i=0,listLen=patientsToSave.length; i<listLen; i++){
			var patientObj = patientsToSave[i];
			var rowStr = "";
			var oData = {};
			for(var j=0,colLen=displayedCols.length; j<colLen; j++){
				var cellStr = "";
				var cnt = 0,oLen=0;
				switch(displayedCols[j].key) {
					case "NAME":
						cellStr += $.trim((patientObj.NAME_FULL_FORMATTED||""));
						break;
					case "DOB":	
						cellStr += patientObj.BIRTH_DT_TM ? patientObj.BIRTH_DT_TM.format(i18n.rwl_lc.fulldate4yr, bUTCDate) : "";
						break;
					case "AGE":	
						cellStr +=
							patientObj.BIRTH_DT_TM ?							 
							(patientObj.DECEASED_DT_TM ? 
								MP_Util.CalcAge(patientObj.BIRTH_DT_TM,patientObj.DECEASED_DT_TM) : 
									MP_Util.CalcAge(patientObj.BIRTH_DT_TM)) : "";
						break;
					case "SEX":
						cellStr += patientObj.SEX_DISP||"";
						break;
					case "MRN":	
						cellStr += patientObj.MRN||"";
						break;
					case "RANK":
						cellStr += patientObj.RANK||"";
						break;				
					case "COL_PRI_CARE_PHY":
					case "COL_CASE_MANAGER":
						if(!oData.PPRS){ // retain PPR data
							oData.PPRS = {1:"",2:""};
							if(patientObj.PPRS){ 
								for(cnt=0,oLen=patientObj.PPRS.length;cnt<oLen;cnt++){
									oData.PPRS[patientObj.PPRS[cnt].RELTN_GROUP||0] += 
										((cnt>0)?"\n":"") + $.trim(patientObj.PPRS[cnt].PRSNL_NAME||"");
								}
							}							
						}
						cellStr += (displayedCols[j].key=="COL_PRI_CARE_PHY") ? oData.PPRS[1].replace(/^\n/, "") : "";
						cellStr += (displayedCols[j].key=="COL_CASE_MANAGER") ? oData.PPRS[2].replace(/^\n/, "") : "";
						break;
					case "COL_CONDITIONS":
						if(patientObj.CONDITIONS){
							for(cnt=0,oLen=patientObj.CONDITIONS.length;cnt<oLen;cnt++){
								cellStr += ((cnt>0)?"\n":"") + $.trim(patientObj.CONDITIONS[cnt].NAME||"");
							}
						}
						break;
					case "COL_PAYER_HP_CLASS":
						if(patientObj.HEALTH_PLANS){
							for(cnt=0,oLen=patientObj.HEALTH_PLANS.length;cnt<oLen;cnt++){
								var plan = patientObj.HEALTH_PLANS[cnt];
								cellStr += ((cnt>0)?"\n":"") + 
											$.trim(plan.PLAN_NAME||"--") + "/" +
											$.trim(plan.PLAN_TYPE_CD_DISP||"--") + "/" +
											$.trim(plan.FIN_CLASS_CD_DISP||"--");
							}
						}
						break;
					case "COL_ADM_DISCH_LAST_24HRS":
					case "COL_VISITS_TIMEFRAME":
						if(!oData.ENCS){ // retain encounter data
							oData.ENCS = {"24hrs":"","Visits":""};
							if(patientObj.encounterBucketAr){ 
								for(cnt=0,oLen=patientObj.encounterBucketAr.length;cnt<oLen;cnt++){
									var curBucket = patientObj.encounterBucketAr[cnt];
									if((curBucket.enc24HoursAdmAr && curBucket.enc24HoursAdmAr.length) ||
										(curBucket.enc24HoursDisAr && curBucket.enc24HoursDisAr.length)){
										oData.ENCS["24hrs"] += ((cnt>0)?"\n":"") +
											(curBucket.enc24HoursAdmAr.length) ? curBucket.enc24HoursAdmAr.length:"-" +
											(curBucket.enc24HoursDisAr.length) ? curBucket.enc24HoursDisAr.length:"-";
									} else if(curBucket.encounterAr && curBucket.encounterAr.length){
										oData.ENCS["Visits"] += ((cnt>0)?"\n":"") +
											curBucket.encounterAr.length + " " + $.trim(curBucket.ENCNTR_GROUP_LABEL||"--") + 
											" / " + (curBucket.ENCNTR_GROUP_DAYS||"--") + " " + i18n.rwl.DAYSL;
									}
								}
							}							
						}
						cellStr += (displayedCols[j].key=="COL_ADM_DISCH_LAST_24HRS") ? oData.ENCS["24hrs"] : "";
						cellStr += (displayedCols[j].key=="COL_VISITS_TIMEFRAME") ? oData.ENCS["Visits"] : "";
						break;
					case "COL_REGISTRY_IMPORT":
						if(patientObj.REGISTRY){
							for(cnt=0,oLen=patientObj.REGISTRY.length;cnt<oLen;cnt++){
								var reg = patientObj.REGISTRY[cnt];
								for(var cnt2=0,oLen2=reg.CONDITIONS.length;cnt2<oLen2;cnt2++){
									cellStr += ((cnt>0)?"\n":"") + 
												$.trim(reg.NAME||"--") + "(" +
												$.trim(reg.CONDITIONS[cnt2].NAME||"--") + ")";
								}
							}
						}
						break;
					case "COL_QUALIFIED_DATE":
						cellStr += patientObj.LAST_ACTION_DT_TM ? 
									patientObj.LAST_ACTION_DT_TM.format(i18n.rwl_lc.fulldate4yr):"";
						break;
					case "COL_LAST_COMP_ACTION":
						if(patientObj.LAST_COMP_ACTION_DT_TM) {
							cellStr += ( patientObj.LAST_COMP_ACTION_DT_TM > date1900 ) ? 
									patientObj.LAST_COMP_ACTION_DT_TM.format(i18n.rwl_lc.fulldate4yr):"";
						} else {
							cellStr += "";
						}
						break;
					case 'COL_RISK':
						cellStr += patientObj.RISK_TEXT || '';
						
						break;
				}
				rowStr += ((j==0) ? "\"":",\"") + cellStr.replace(/"/g,"\"\"") + "\"";
			}
			exportListString += rowStr + "\n";
		}
		return exportListString;
		
	};
	this.getPatientsNeedingColumnLoad = function(patientIds, columnLoadName, numberToLoad) {
		var patientIdsNeedingColumnData = [];
		var patientForLoadCheck;
		for(var i = 0, suggestPtSz = patientIds.length; i < suggestPtSz; i++) {
			patientForLoadCheck = this.patientDataById[patientIds[i]];
			if(patientForLoadCheck !== undefined && patientForLoadCheck.columnLoadIndicator[columnLoadName] === 0) {
				patientIdsNeedingColumnData.push(patientForLoadCheck.PERSON_ID);
				if(patientIdsNeedingColumnData.length >= numberToLoad) {
					return patientIdsNeedingColumnData;
				}
			}
		}
		patientForLoadCheck = undefined;
		var allPatients = this.getAllPatients();
		for(var j = 0, szAllPatients = allPatients.length; j < szAllPatients; j++) {
			patientForLoadCheck = allPatients[j];
			if(patientForLoadCheck != undefined && patientForLoadCheck.columnLoadIndicator[columnLoadName] == 0 && 
				!jQuery.inArray(patientForLoadCheck.PERSON, patientIdsNeedingColumnData)) {
					patientIdsNeedingColumnData.push(patientForLoadCheck.PERSON_ID);
					if(patientIdsNeedingColumnData.length >= numberToLoad) {
						return patientIdsNeedingColumnData;
					}
			}
		}
		
		return patientIdsNeedingColumnData;
	};
	this.getAllPatients = function() {
		patientData = [];
		for(var key in this.patientDataById) {
			if(key > 0.0) {
				patientData.push(this.patientDataById[key]);
			}
		}
		return patientData;
	};
	this.getPatientById = function(patientId) {
		if(m_patientController.patientDataById[patientId] === undefined) {
			m_controller.logErrorMessages('','Could not find : ' + patientId + '','m_controller.getPatientById');
		}
		return m_patientController.patientDataById[patientId];		
	};
	this.getPatientEncounterId = function(iPatientId) {
		var B_FETCH_ASYNCHRONOUSLY = false,
			iEncounterId = null;
		this.fnGetPatientsEncounterId([iPatientId], B_FETCH_ASYNCHRONOUSLY)
			.done(function(oPersonToEncounter) {
				iEncounterId = oPersonToEncounter[iPatientId];
			});
		return iEncounterId;
	};
	this.fnGetPatientsEncounterId = function(aiPatientIds, bFetchAsynchronously) {
		if((aiPatientIds || []).length === 0) {
			return $.Deferred().resolve({}).promise();
		}
		var aiNonExistentPatients = $.grep(aiPatientIds, function(iPatientId) {
				return m_patientController.doesPatientExist(iPatientId) === false;
			}),
			aiPatientsWithNoCachedEncounter = [],
			oPatientsWithCachedEncounterId = {};

		if (aiNonExistentPatients.length > 0) {
			m_controller.logErrorMessages('', 'Could not find patients : ' + aiNonExistentPatients, 'm_controller.getPatientById');
			throw new Error('Could not find patients : ' + aiNonExistentPatients, 'dcp_pl_patient_controller');
		}

		aiPatientsWithNoCachedEncounter = $.grep(aiPatientIds, function(iPatientId) {
			return fnDoesPatientHaveEncounter(iPatientId) === false;
		});

		$.each(aiPatientIds, function(undefined, iPatientId) {
			if (fnDoesPatientHaveEncounter(iPatientId) === false) {
				return;
			}
			oPatientsWithCachedEncounterId[iPatientId] = m_patientController.patientDataById[iPatientId].ENCNTR_IDS[0].ENCNTR_ID;
		});
		return fnGetBestEncounterForPatients(aiPatientsWithNoCachedEncounter, bFetchAsynchronously)
			.then(function(oPersonToEncounter) {
				return $.extend({}, oPatientsWithCachedEncounterId, oPersonToEncounter);
			});
	};
	function fnDoesPatientHaveEncounter(iPatientId) {
		return $.isArray(m_patientController.patientDataById[iPatientId].ENCNTR_IDS) === true &&
			typeof m_patientController.patientDataById[iPatientId].ENCNTR_IDS[0] !== 'undefined';
	}
	this.doesPatientExist = function(patientId) {
		return (m_patientController.patientDataById[patientId] !== undefined);
	};
	function fnGetBestEncounterForPatients(aiPatientIds, bFetchAsynchronously) {
		if ((aiPatientIds || []).length === 0) {
			return $.Deferred().resolve({}).promise();
		}
		var I_NO_BEST_ENCOUNTER = 0,
			oScriptCall = $.Deferred(),
			fnScriptSuccess = function(oReply) {
				var aiPatientIdsWithNoBestEncounter = [],
					oPersonToEncounter = {};

				$.each(oReply.PERSONS, function(undefined, oPerson) {
					if (oPerson.ENCNTR_ID === I_NO_BEST_ENCOUNTER) {
						aiPatientIdsWithNoBestEncounter.push(oPerson.PERSON_ID);
					}
					oPersonToEncounter[oPerson.PERSON_ID] = oPerson.ENCNTR_ID;
					m_patientController.patientDataById[oPerson.PERSON_ID].ENCNTR_IDS = [{
						ENCNTR_ID: oPerson.ENCNTR_ID
					}];
				});

				if (aiPatientIdsWithNoBestEncounter.length > 0) {
					m_controller.fnLogWarningMessages('', 'Could not find encounter for the following patients: ' +
						aiPatientIdsWithNoBestEncounter +
						'. Used 0.0 instead.', 'm_patientController#fnGetBestEncounterForPatients');
				}

				oScriptCall.resolve(oPersonToEncounter);
			},
			encounterRequest = fnCreateBestEncounterRequest(aiPatientIds);

		m_controller.makeCall(
			'mp_dcp_dwl_get_best_encntr',
			encounterRequest,
			(bFetchAsynchronously === true),
			fnScriptSuccess,
			oScriptCall.reject
		);
		return oScriptCall.promise();
	}
	function fnCreateBestEncounterRequest(aiPatientIds) {
		var oBestEncounterRequestWrapper = {
				best_encntr_request: {}
			},
			oBestEncounterRequestStructure = oBestEncounterRequestWrapper.best_encntr_request,
			aoActiveListProviders = m_controller.fnGetActiveListProviders(),
			aoEprRelationshipTypes = m_controller.fnGetActiveListEprCodes(),
			aoLocationCodes = m_controller.fnGetActiveListLocations(),
			aoEncounterTypeCodes = m_controller.fnGetActiveListEncounterTypes();
		if ((aiPatientIds || []).length > 0) {
			oBestEncounterRequestStructure.persons = $.map(aiPatientIds, function(iPatientId) {
				return {
					person_id: iPatientId
				};
			});
		}
		if ((aoActiveListProviders || []).length > 0) {
			oBestEncounterRequestStructure.providers = aoActiveListProviders;
		}
		if ((aoEprRelationshipTypes || []).length > 0) {
			oBestEncounterRequestStructure.epr_reltn_types = aoEprRelationshipTypes;
		}
		if ((aoLocationCodes || []).length > 0) {
			oBestEncounterRequestStructure.location_cds = aoLocationCodes;
		}
		if ((aoEncounterTypeCodes || []).length > 0) {
			oBestEncounterRequestStructure.encntr_type_cds = aoEncounterTypeCodes;
		}
		return oBestEncounterRequestWrapper;
	}
	this.getStaticPatientListSize = function(){
		return m_patientController.getAllPatients().length;
	};
	this.removePatientsById = function(patientIds) {
		if(!patientIds){
			return;
		}

		var currentIds = this.patientDataById;
		for(var i = 0, idSize = patientIds.length; i < idSize; i++) {
			var patId = patientIds[i];
			if(currentIds[patId]){
				delete currentIds[patId];
			}
		}
		this.removePatientFromArray(patientIds);    
	};
	this.markPatientsAsRemovable = function(patientIds){
		var length = patientIds.length;
		for (var i=0;i<length;i++){
			var patientId = patientIds[i];
			if ($.inArray(patientId, removablePatientIds) < 0){
				removablePatientIds.push(patientId);
			}
		}
	};
	this.removePatientFromArray = function(patientIds){
		var indexOf;
		var length = patientIds.length;
		for (var i=0;i<length;i++){
			var patientId = parseInt(patientIds[i], 10);
			indexOf = $.inArray(patientId, removablePatientIds);
			if (indexOf >= 0){
				removablePatientIds.splice(indexOf,1);
			}
		}
	};
	this.getRemovablePatients = function(){
		return removablePatientIds;
	};
	this.setPatientProperty = function(patientId, property, value){
		if(!patientId || !property){
			return;
		}
		
		if(this.patientDataById[patientId]){
			this.patientDataById[patientId][property] = value;
		}
	};
	this.changeSortCriteria = function(sortBy,patientsToSort) { 
		if(sortBy == sortCriteria.SORT_BY_NAME){
			defaultSort.field = "NAME_FULL_FORMATTED";
			defaultSort.fieldType = "alpha";
			defaultSort.direction = 1; //name in ascending order by default
		}else if (sortBy == sortCriteria.SORT_BY_RANK){
			defaultSort.field = "RANK";
			defaultSort.fieldType = "numeric";
			defaultSort.direction = -1; //rank in descending order by default
		}else if (sortBy == sortCriteria.SORT_BY_QUALIFIED_DATE) {
			defaultSort.field = "LAST_ACTION_DT_TM";
			defaultSort.fieldType = "date";
			defaultSort.direction = -1; //qualified date in descending order by default, to see latest on top
		}else if (sortBy == sortCriteria.SORT_BY_LAST_ACTION) {
			defaultSort.field = "LAST_COMP_ACTION_DT_TM";
			defaultSort.fieldType = "date";
			defaultSort.direction = -1; //last completed action date in descending order by default, to see latest on top
		}		
		return this.sortPatientData(patientsToSort);
	};
	this.sortPatientData = function(patientData){
	
		var field = defaultSort.field;
		var fieldType = defaultSort.fieldType;
		var direction = defaultSort.direction;
		
		switch(fieldType) {
			case "alpha":
				patientData.sort(function(a,b){
					if(direction == -1) {
						return $.trim(b[field]).localeCompare($.trim(a[field])); //descending
					} else {
						return $.trim(a[field]).localeCompare($.trim(b[field])); //ascending
					}
			
				});
				break;
			case "numeric":
				patientData.sort(function(a,b){
					var compareValue;
					if(direction == -1) {     //descending
						compareValue = (b[field] - a[field]);
					} else {    //ascending
						compareValue =  (a[field] - b[field]);
					}
					if (compareValue == 0){
							return $.trim(a["NAME_FULL_FORMATTED"]).localeCompare($.trim(b["NAME_FULL_FORMATTED"])); 
					}
					return compareValue;
				});
				break;
			case "date":
				patientData.sort(function(a,b){
					var firstDate = new Date();
					firstDate.setTime(a[field]);
					firstDate.setMilliseconds(0);
					
					var secondDate = new Date();
					secondDate.setTime(b[field]);
					secondDate.setMilliseconds(0);

					var compareValue;
					if(direction == -1) {     //descending
						compareValue = (firstDate > secondDate) ? -1 : ((firstDate < secondDate) ?  1 : 0);
					} else {   //ascending
						compareValue = (firstDate < secondDate) ? -1 : ((firstDate > secondDate) ?  1 : 0);
					}
					firstDate = null;
					secondDate = null;
					if (compareValue == 0){
							return $.trim(a["NAME_FULL_FORMATTED"]).localeCompare($.trim(b["NAME_FULL_FORMATTED"])); 
					}
					return compareValue;
				});
				break;
		}
		
		return patientData;
	};
	this.spliceOutFiltersSupportedInMemory = function(filterArguments) {
		var argumentsSupportedInMemory = [];
		for(var i = filterArguments.length - 1; i >= 0; i--) {
			var argument = filterArguments[i];
			var argumentDefinition = filterDefinition[argument.ARGUMENT_NAME];
			if(argumentDefinition == undefined || argumentDefinition.realtime == false) {
				argumentDefintion = null;
				argument = null;
				continue;
			}
			if(argumentDefinition.columnLoadInd == undefined || this.isColumnLoadedForAllPatients(argumentDefinition.columnLoadInd) == true) {
				argumentsSupportedInMemory = argumentsSupportedInMemory.concat(filterArguments.splice(i,1));
			}
			argumentDefintion = null;
			argument = null;
		}
		return argumentsSupportedInMemory;
	};
	this.isColumnLoadedForAllPatients = function(columnLoadName) {
		for(var key in this.patientDataById) {
			if(key > 0.0) {
				var patient = this.patientDataById[key];
				if(patient.columnLoadIndicator[columnLoadName] != 2) { //2 = loaded
					return false;
				}
			}
		}
		return true;
	};
	this.getFuzzySearchPatients = function(value,visiblePatients,appliedFilters) {
		var allPatients;
		if(appliedFilters) {
				allPatients = visiblePatients.slice(0);	
		} else {
			allPatients = this.getAllPatients();
		}
		var qualifiedPatients = [];
		value = value.toLowerCase();
		
		for(var a = 0, alen = allPatients.length; a < alen; a++) {
			var patient = allPatients[a];
			var full = JSON.stringify(patient.NAME_FULL_FORMATTED).toLowerCase();
			var lname = JSON.stringify(patient.NAME_LAST_KEY).toLowerCase();
			var fname = JSON.stringify(patient.NAME_FIRST_KEY).toLowerCase();
			var mrn = JSON.stringify(patient.MRN).toLowerCase();
			var bd = patient.BIRTH_DT_TM;
			var dob = "";
			var bUTCDate = true;
			if(bd != null && bd != undefined) {
				dob = JSON.stringify(bd.format(i18n.rwl_lc.fulldate4yr, bUTCDate));
			}
			var id = patient.PERSON_ID;
			
			if(full.indexOf(value) > -1 || lname.indexOf(value) > -1 || fname.indexOf(value) > -1 || mrn.indexOf(value) > -1 || dob.indexOf(value) > -1) {
				qualifiedPatients.push(patient);
			}
		}
		return qualifiedPatients;
	};
	this.getQualifyingPatients = function (filterArguments, patients, patientsToFilter) {
		var qualifiedPatients = [];
		if(patientsToFilter == "filtered" && patients) {
			qualifiedPatients = patients;
		} else {
			qualifiedPatients = this.getAllPatients();
		}
		if(filterArguments.length == 0) {
			return this.sortPatientData(qualifiedPatients);
		}
		var argumentsByName = groupArgumentsByName(filterArguments);
		
		var age_unit = "";
		var age_greater = -1;
		var age_less = -1;
		var age_equal = -1;
		var age_from = -1;
		var age_to = -1;
		var andConditionArguments = false;
		var conditionOperatorArg = argumentsByName["CONDITION_OPERATOR"];
		if(conditionOperatorArg != undefined)
		{
			delete argumentsByName["CONDITION_OPERATOR"];
			if(conditionOperatorArg.length == 1) {
				if(conditionOperatorArg[0].ARGUMENT_VALUE == "AND") {
					andConditionArguments = true;
				}
			}
		}
		
		var admissionArg = argumentsByName.ADMISSIONDAYS || argumentsByName.ADMISSIONWEEKS || argumentsByName.ADMISSIONMONTHS,
			encounterTypeArgs = argumentsByName.ENCOUNTERTYPE;

		if(admissionArg && encounterTypeArgs) {
			delete argumentsByName.ADMISSIONDAYS;
			delete argumentsByName.ADMISSIONWEEKS;
			delete argumentsByName.ADMISSIONMONTHS;
			delete argumentsByName.ENCOUNTERTYPE;
			delete argumentsByName.INDIVIDUALENCOUNTER;
			qualifiedPatients = getMatchingEncounters(admissionArg, encounterTypeArgs, qualifiedPatients);
		}
		for(var argumentName in argumentsByName) {
			if(argumentName === 'addAll') {
				continue;
			}
			
			var argumentDefinition = filterDefinition[argumentName];
			if(argumentDefinition == undefined) {
				var undefinedFilter = i18n.rwl.UDEFINEDFILTER.replace("{29}",argumentName);
				alert(undefinedFilter);
				continue;
			}
			var argumentsAr = argumentsByName[argumentName];
			
			switch(argumentDefinition.type) {
				case "multiParentIdValue":
					qualifiedPatients = getPatientsWithMatchingValue(argumentsAr, argumentDefinition, qualifiedPatients, "PARENT_ENTITY_ID");
					break;
				case "multiStringValue":
					if(argumentName == "CONDITION" && andConditionArguments) {
						qualifiedPatients = getPatientsMatchingAllValues(argumentsAr, argumentDefinition, qualifiedPatients, "ARGUMENT_VALUE");
					} else {
						qualifiedPatients = getPatientsWithMatchingValue(argumentsAr, argumentDefinition, qualifiedPatients, "ARGUMENT_VALUE");
					}
					break;
				case "rangeValue":
					for(var i = 0, sz = argumentsAr.length; i<sz; i++) { //currently, there will only be one
						qualifiedPatients = getPatientsWithValueInRange(argumentsAr[i].ARGUMENT_VALUE, argumentDefinition.dataSourceField, argumentDefinition.operator, qualifiedPatients);
					}
					break;
				case "qualifying":
					var argValue = argumentsAr[0].ARGUMENT_VALUE;
					var patientsWhoQualify = [], 
						patientsWhoDoNotQualify = [];
					for(var i = 0, qualifiedPatLength = qualifiedPatients.length; i < qualifiedPatLength; i++) {
						var id = qualifiedPatients[i].PERSON_ID;
						if($.inArray(id, removablePatientIds) === -1) {
							patientsWhoQualify.push(qualifiedPatients[i]);
						} else {
							patientsWhoDoNotQualify.push(qualifiedPatients[i]);
						}
					}
					if(argValue === "still") {
						qualifiedPatients = patientsWhoQualify;
					} else { // argValue === "not"
						qualifiedPatients = patientsWhoDoNotQualify;
					}
					patientsWhoQualify = null;
					patientsWhoDoNotQualify = null;
					break;
				case "age":
					switch(argumentName) {
						case "AGEDAYS":
							age_unit = "days";
							break;
						case "AGEWEEKS":
							age_unit = "weeks";
							break;
						case "AGEMONTHS":
							age_unit = "months";
							break;
						case "AGEYEARS":
							age_unit = "years";
							break;
						case "AGEGREATER":
							age_greater = parseInt(argumentsAr[0].ARGUMENT_VALUE, 10);
							break;
						case "AGELESS":
							age_less = parseInt(argumentsAr[0].ARGUMENT_VALUE, 10);
							break;
						case "AGEEQUAL":
							age_equal = parseInt(argumentsAr[0].ARGUMENT_VALUE, 10);
							break;
						case "AGEFROM":
							age_from = parseInt(argumentsAr[0].ARGUMENT_VALUE, 10);
							break;
						case "AGETO":
							age_to = parseInt(argumentsAr[0].ARGUMENT_VALUE, 10);
							break;
					}
					if(age_unit.length > 0 && (age_greater >= 0 || age_less > 0 || age_equal >= 0 || (age_from >= 0 && age_to > 0))) {
						var age_begin_dt = new Date();
						var age_end_dt = new Date();
						if(age_greater >= 0) {
							age_begin_dt = new Date("January 1, 1800 00:00:00");
							age_greater++;
							switch(age_unit) {
								case "days":
									age_end_dt.setDate(age_end_dt.getDate() - age_greater);
									break;
								case "weeks":
									age_greater = age_greater * 7;
									age_end_dt.setDate(age_end_dt.getDate() - age_greater);
									break;
								case "months":
									age_end_dt.setMonth(age_end_dt.getMonth() - age_greater);
									break;
								case "years":
									age_end_dt.setFullYear(age_end_dt.getFullYear() - age_greater);
									break;
							}
						}
						else if(age_less > 0) {
							switch(age_unit) {
								case "days":
									age_begin_dt.setDate(age_begin_dt.getDate() - age_less);
									break;
								case "weeks":
									age_less = age_less * 7;
									age_begin_dt.setDate(age_begin_dt.getDate() - age_less);
									break;
								case "months":
									age_begin_dt.setMonth(age_begin_dt.getMonth() - age_less);
									break;
								case "years":
									age_begin_dt.setFullYear(age_begin_dt.getFullYear() - age_less);
									break;
							}
						}
						else if(age_equal >= 0) {
							switch(age_unit) {
								case "days":
									age_begin_dt.setDate(age_begin_dt.getDate() - (age_equal + 1));
									age_end_dt.setDate(age_end_dt.getDate() - age_equal);
									break;
								case "weeks":
									age_equal = age_equal * 7;
									age_begin_dt.setDate(age_begin_dt.getDate() - (age_equal + 7));
									age_end_dt.setDate(age_end_dt.getDate() - age_equal);
									break;
								case "months":
									age_begin_dt.setMonth(age_begin_dt.getMonth() - (age_equal + 1));
									age_end_dt.setMonth(age_end_dt.getMonth() - age_equal);									
									break;
								case "years":
									age_begin_dt.setFullYear(age_begin_dt.getFullYear() - (age_equal + 1));
									age_end_dt.setFullYear(age_end_dt.getFullYear() - (age_equal));
									break;
							}
						}
						else {
							age_to++;
							switch(age_unit) {
								case "days":
									age_begin_dt.setDate(age_begin_dt.getDate() - age_to);
									age_end_dt.setDate(age_end_dt.getDate() - age_from);
									break;
								case "weeks":
									age_to = age_to * 7;
									age_from = age_from * 7;
									age_begin_dt.setDate(age_begin_dt.getDate() - age_to);
									age_end_dt.setDate(age_end_dt.getDate() - age_from);
									break;
								case "months":
									age_begin_dt.setMonth(age_begin_dt.getMonth() - age_to);
									age_end_dt.setMonth(age_end_dt.getMonth() - age_from);
									break;
								case "years":
									age_begin_dt.setFullYear(age_begin_dt.getFullYear() - age_to);
									age_end_dt.setFullYear(age_end_dt.getFullYear() - age_from);
									break;
							}
						}
						
						qualifiedPatients = getPatientsWithValueInRange(age_begin_dt, argumentDefinition.dataSourceField, ">", qualifiedPatients);
						qualifiedPatients = getPatientsWithValueInRange(age_end_dt, argumentDefinition.dataSourceField, "<", qualifiedPatients);
						
						age_begin_dt = null;
						age_end_dt = null;
					}
					break;
				case "admission":         
					for(var k = 0, szk = argumentsAr.length; k<szk; k++) { 
						qualifiedPatients = getPatientsWithAdmissionRange(qualifiedPatients, argumentName, argumentsAr[k].ARGUMENT_VALUE, argumentDefinition);
					}				
					break;
				case 'pendingWork':
					qualifiedPatients = fnGetPatientsWithPendingWork(argumentsAr, qualifiedPatients);
					break;
				default:
					alert(i18n.rwl.UNKNOWNFILTER.replace("{30}",argumentDefinition.type));
					break;
			}
			
			argumentDefinition = null;
			argumentsAr = null;
		}
		conditionOperatorArg = null;
		argumentsByName = null;
		return this.sortPatientData(qualifiedPatients, defaultSort.field, defaultSort.fieldType, defaultSort.direction);
	};
	function fnGetPatientsWithPendingWork(aoFilterArguments, aoCandidatePatients) {
		return $.grep(aoCandidatePatients, function(oCandidatePatient) {
			return fnDoesPatientQualifyForPendingWork(oCandidatePatient, aoFilterArguments);
		});
	}
	function fnDoesPatientQualifyForPendingWork(oCandidatePatient, aoFilterArguments) {
		var bDidPatientMatch = false,
			oMatchTester = {
				'PENDING_PHONE_CALLS': {
					fnDoesQualify: fnDoesPatientHavePendingPhoneCalls
				},
				'PENDING_ACTIONS': {
					fnDoesQualify: fnDoesPatientHavePendingTodosForCurrentUser
				}
			};
		$.each(aoFilterArguments, function() {
			var oFilterArgument = this,
				oFilterMatchTester = oMatchTester[oFilterArgument.ARGUMENT_MEANING],
				bDoesPatientMatchFilter = oFilterMatchTester.fnDoesQualify(oCandidatePatient);
			bDidPatientMatch = bDidPatientMatch || bDoesPatientMatchFilter;
		});
		return bDidPatientMatch;
	}
	function fnDoesPatientHavePendingPhoneCalls(oPatient) {
		return (oPatient.aPendingCalls || []).length > 0;
	}
	function fnDoesPatientHavePendingTodosForCurrentUser(oCandidatePatient) {
		var aoComments = oCandidatePatient.COMMENTS || [],
			iCommentTypePendingTodo = 1,
			iCurrentUserId = m_controller.getCriterion().CRITERION.PRSNL_ID;
		return $.grep(aoComments, function(oComment) {
			return oComment.COMMENT_TYPE === iCommentTypePendingTodo && 
				oComment.UPDT_ID === iCurrentUserId;
		}).length > 0;
	}
	function groupArgumentsByName(filterArguments) {
		var argumentsByFilterName = [],
			argument = '',
			indexName = '';
		for(var j=0, argCount = filterArguments.length; j<argCount; j++){
			argument = filterArguments[j];
			indexName = argument.ARGUMENT_NAME;
			if(!argumentsByFilterName[indexName]) {
				argumentsByFilterName[indexName] = [];
			}
			argumentsByFilterName[indexName].push(argument);
		}
		return argumentsByFilterName;
	}
	function hasMatchingEncounterGroup(parentEntityId, encounterGroups) {
		var hasGroup = false,
			encntrGroups = encounterGroups || [];

		for(var x = 0, eLength = encntrGroups.length; x < eLength; x++) {
			if(parentEntityId === encntrGroups[x].GROUP.toString()) {
				hasGroup = true;
				break;
			}
		}

		return hasGroup;
	}
	function hasMatchingEncounterType(encounterTypes, encounterGroups, encounter) {
		var hasEncounter = false,
			encntrTypes = encounterTypes || [],
			parentEntityId;

		for(var x = 0, eLength = encntrTypes.length; x < eLength; x++) {
			parentEntityId = encntrTypes[x].PARENT_ENTITY_ID;
			if(parentEntityId === encounter || hasMatchingEncounterGroup(parentEntityId, encounterGroups) === true) {
				hasEncounter = true;
				break;
			}
		}

		return hasEncounter;
	}
	function getMatchingEncounters(admissionRange, encounterTypeArgs, patients) {
		var admissionArgName = admissionRange[0].ARGUMENT_NAME,
			admissionArgValue = admissionRange[0].ARGUMENT_VALUE,
			compareDate = new Date(),
			currentDateEnd  = new Date(),
			qualifyingPatients = [];
		compareDate.setHours(0,0,0);
		currentDateEnd.setHours(23,59,59);

		switch(admissionArgName) {
			case 'ADMISSIONDAYS':
				compareDate.setDate(compareDate.getDate() - admissionArgValue);
				break;
			case 'ADMISSIONWEEKS':
				compareDate.setDate(compareDate.getDate() - (7 * admissionArgValue));     //Multiplying the number of weeks with 7 days and subtracting the total number of days
				break;
			case 'ADMISSIONMONTHS':
				compareDate.setMonth(compareDate.getMonth() - admissionArgValue);
				break;   
		}
		for(var p = 0, plen = patients.length; p < plen; p++) {
			var curPatient = patients[p],
				curPatientEncntrs = curPatient.ENCOUNTERS;

			if(curPatientEncntrs) {
				for(var e = 0, elen = curPatientEncntrs.length; e < elen; e++) {
					var curEncounter = curPatientEncntrs[e],
						regDate = convertSQLDateStringToJS(curEncounter.REG_DATE),
						encounterGroups = curEncounter.ENCNTR_GROUPS,
						encounter = curEncounter.ENCNTR_TYPE_CD.toString();
					if(regDate >= compareDate && regDate<= currentDateEnd && hasMatchingEncounterType(encounterTypeArgs, encounterGroups, encounter) === true) {
						qualifyingPatients.push(curPatient);
						break;
					}
				}
			}
		}
		return qualifyingPatients;
	}
	function getPatientsWithAdmissionRange(patientCandidates, argumentName, argumentValue, argumentDefinition) { 
		var qualifyingPatients = [];
		var compareDate = new Date();
		compareDate.setHours(0,0,0);
		switch(argumentName) {
			case "ADMISSIONDAYS":
				compareDate.setDate(compareDate.getDate() - argumentValue);
				break;
			case "ADMISSIONWEEKS":
				compareDate.setDate(compareDate.getDate() - (7 * argumentValue));     //Multiplying the number of weeks with 7 days and subtracting the total number of days
				break;
			case "ADMISSIONMONTHS":
				compareDate.setMonth(compareDate.getMonth() - argumentValue);
				break;   
		}
		for(var i=0, ptSize = patientCandidates.length; i<ptSize; i++) {
			var candidatePatient = patientCandidates[i];
			if(patientAdmittedSince(candidatePatient, argumentName, compareDate, argumentDefinition.dataSourceList, argumentDefinition.dataSourceField)) {
				qualifyingPatients.push(candidatePatient);
				continue;
			}
		}
		return qualifyingPatients;
	}
	function patientAdmittedSince(patient, argumentName, compareDate, list, field) {
		var valueList = patient[list];
		if(valueList == undefined || valueList == null) {
			return false;
		}
		var currentDateEnd = new Date();
		currentDateEnd.setHours(23,59,59);
		for(var i = 0, sz = valueList.length; i < sz; i++) {
			var regDate = valueList[i][field];
			if(regDate != undefined || regDate != null) {    
				regDate = convertSQLDateStringToJS(regDate);
				if( regDate >= compareDate && regDate <= currentDateEnd ) {
					return true;
				}			
			}
		}
		return false;
	}
	function getPatientsWithMatchingValue(argumentsAr, argumentDefinition, patientCandidates, argumentFieldToMatch) {
		var qualifyingPatients = [],
			candidatePatient;
		for(var i = 0, ptSize = patientCandidates.length; i<ptSize; i++) {
			candidatePatient = patientCandidates[i];
			for(var j = 0, argSize = argumentsAr.length; j<argSize; j++) {
				if(argumentDefinition.dataSourceList === 'ENCOUNTERS') {
					argumentDefinition.dataSourceField = argumentsAr[j].PARENT_ENTITY_NAME === 'INDIVIDUALENCOUNTER' ? 'ENCNTR_TYPE_CD' : 'ENCNTR_GROUPS';
				}
				if(doesPatientHoldValue(candidatePatient, argumentsAr[j][argumentFieldToMatch], argumentDefinition.dataSourceList, argumentDefinition.dataSourceField) === true) {
					qualifyingPatients.push(candidatePatient);
					break;
				}
			}
		}
		return qualifyingPatients;
	}
	function getPatientsMatchingAllValues(argumentsAr, argumentDefinition, patientCandidates, argumentFieldToMatch) {
		var qualifyingPatients = [];
		for(var i = 0, ptSize = patientCandidates.length; i<ptSize; i++) {
			var candidatePatient = patientCandidates[i];
			var matchesAllValues = true;
			for(var j = 0, argSize = argumentsAr.length; j<argSize; j++) {
				if(doesPatientHoldValue(candidatePatient, argumentsAr[j][argumentFieldToMatch], argumentDefinition.dataSourceList, argumentDefinition.dataSourceField) == false) {
					matchesAllValues = false;
					break;
				}
			}
			if(matchesAllValues == true && jQuery.inArray(candidatePatient,qualifyingPatients) == -1) {
				qualifyingPatients.push(candidatePatient);
			}
		}
		return qualifyingPatients;
	}
	function getPatientsWithValueInRange(comparatorValue, dataSourceField, operator, patientCandidates) {
		var qualifyingPatients = [];
		for(var i = 0, ptSize = patientCandidates.length; i<ptSize; i++) {
			var candidatePatient = patientCandidates[i];
			if(candidatePatient[dataSourceField] == null || candidatePatient[dataSourceField] == undefined) {
				continue;
			}
			
			var inRange = false;
			switch(operator) {
				case ">=":
					inRange = (candidatePatient[dataSourceField] >= comparatorValue);
					break;
				case "<=":
					inRange = (candidatePatient[dataSourceField] <= comparatorValue);
					break;	
				case "<":
					inRange = (candidatePatient[dataSourceField] < comparatorValue);
					break;
				case ">":
					inRange = (candidatePatient[dataSourceField] > comparatorValue);
					break;	
				default:
					alert(i18n.rwl.UNKNOWNFILTER.replace("{31}",operator));
			}
			if(inRange == true) {
				qualifyingPatients.push(candidatePatient);
			}

		}
		return qualifyingPatients;
	}
	function hasMatchingPPRs(value, field, relationGroup) {
		return field === value && relationGroup === '2';
	}
	function doesPatientHoldValue(patient, value, list, field) {
		var valueList,
			encounter,
			encntrGroup;

		if(list === undefined || list === null) {
			return (patient[field] == value);
		}
	
		valueList = patient[list];

		if(valueList === undefined || valueList === null) {
			return false;
		}

		for(var i = 0, sz = valueList.length; i < sz; i++) {
			if(list  === 'PPRS' && hasMatchingPPRs(value, valueList[i][field].toString(), valueList[i]['RELTN_GROUP'].toString())) {
				return true;
			}
			else if(field  === 'ENCNTR_GROUPS' && hasMatchingEncounterGroup(value, valueList[i][field]) === true) {
				return true;
			}
			else if (list !== 'PPRS' && valueList[i][field] == value) {
				return true;
			}
		}
		return false;
	}
}
