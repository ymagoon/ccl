(function() {
	'use strict';
	describe('dcp_pl_patient_controller', function() {
		describe('ACM_Patient_Controller', function() {
			it('can be created', function() {
				var oPatientController = new ACM_Patient_Controller();
				expect(oPatientController).toBeDefined();
			});
			describe('get qualifying patients', function() {
				it('should return empty patients when filter arguments is empty', function() {
					expect(new ACM_Patient_Controller().getQualifyingPatients([], [{}], 'some filter')).toEqual([]);
				});
				it('should return empty patients when patients object is empty', function() {
					expect(new ACM_Patient_Controller().getQualifyingPatients([{}], [], 'some filter')).toEqual([]);
				});
				it('should return empty patients when filter arguments is empty', function() {
					expect(new ACM_Patient_Controller().getQualifyingPatients([{}], [{}], 'all')).toEqual([]);
				});
				describe('filtered by pending work', function() {
					describe('filtered by pending phone calls', function() {
						it('should return all patients who have pending calls', function() {
							var sPatientsToFilter = 'all',
								sArgumentName = 'PENDING_WORK',
								sArgumentMeaning = 'PENDING_PHONE_CALLS',
								oExpectedPendingCall = {
									'COMM_PATIENT_ID': '17835295',
									'COMM_PRSNL_NAME': 'Some personnel',
									'COMM_SUBJECT_TEXT': 'Some subject',
									'COMM_STATUS_DT_TM': '/Date(2015-10-07T00:40:45.000+00:00)/'
								},
								oPatientWithPendingCall = {
									aPendingCalls: [oExpectedPendingCall]
								},
								oPatientWithNoPendingCalls = {
									aPendingCalls: []
								},
								oPatientWithNullPendingCalls = {
									aPendingCalls: null
								},
								oPatientWithUndefinedPendingCalls = {},
								oFilterArguments = [{
									'ARGUMENT_NAME': sArgumentName,
									'ARGUMENT_MEANING': sArgumentMeaning
								}],
								aoPatients = {
									'123': oPatientWithNoPendingCalls,
									'1786595': oPatientWithPendingCall,
									'456': oPatientWithNullPendingCalls,
									'789': oPatientWithUndefinedPendingCalls
								},
								oPatientController = new ACM_Patient_Controller(),
								aoActualPatients = null;
							oPatientController.patientDataById = aoPatients;

							aoActualPatients = oPatientController.getQualifyingPatients(oFilterArguments, null, sPatientsToFilter);
							expect(aoActualPatients).toBeArrayOfSize(1);
							expect(aoActualPatients).toContain(oPatientWithPendingCall);
							expect(aoActualPatients).not.toContain(oPatientWithNoPendingCalls);
							expect(aoActualPatients).not.toContain(oPatientWithNullPendingCalls);
							expect(aoActualPatients).not.toContain(oPatientWithUndefinedPendingCalls);
						});
					});
					describe('filtered by pending actions', function() {
						it('should return all patients who have pending actions', function() {
							var iCommentTypePendingTodo = 1,
								iCurrentPersonnelId = 666,
								iNonCurrentPersonnelId = 999,
								sPatientsToFilter = 'all',
								sArgumentName = 'PENDING_WORK',
								sArgumentMeaning = 'PENDING_ACTIONS',
								oMockController = jasmine.createSpyObj('mockController', ['getCriterion']),
								aoCommentsWithTodoForCurrentUser = [{
									'COMMENT_TYPE': 3
								}, {
									'COMMENT_TYPE': 2
								}, {
									'COMMENT_TYPE': iCommentTypePendingTodo,
									'UPDT_ID': iCurrentPersonnelId
								}],
								aoCommentsWithTodoForNonCurrentUser = [{
									'COMMENT_TYPE': 3
								}, {
									'COMMENT_TYPE': 2
								}, {
									'COMMENT_TYPE': iCommentTypePendingTodo,
									'UPDT_ID': iNonCurrentPersonnelId
								}],
								aoCommentsNoTodo = [{
									'COMMENT_TYPE': 0
								}, {
									'COMMENT_TYPE': 0
								}, {
									'COMMENT_TYPE': 7
								}],
								oPatientWithPendingTodoForCurrentUser = {
									COMMENTS: aoCommentsWithTodoForCurrentUser
								},
								oPatientWithPendingTodoForNonCurrentUser = {
									COMMENTS: aoCommentsWithTodoForNonCurrentUser
								},
								oPatientWithNoPendingTodos = {
									COMMENTS: aoCommentsNoTodo
								},
								oPatientWithNullComments = {
									COMMENTS: null
								},
								oPatientWithUndefinedComments = {},
								oFilterArguments = [{
									'ARGUMENT_NAME': sArgumentName,
									'ARGUMENT_MEANING': sArgumentMeaning
								}],
								aoPatients = {
									'17835295': oPatientWithPendingTodoForCurrentUser,
									'123': oPatientWithNoPendingTodos,
									'456': oPatientWithNullComments,
									'789': oPatientWithUndefinedComments,
									'989': oPatientWithPendingTodoForNonCurrentUser
								},
								oPatientController = new ACM_Patient_Controller(oMockController),
								aoActualPatients = null;
							oMockController.getCriterion.and.returnValue({
								CRITERION: {
									PRSNL_ID: iCurrentPersonnelId
								}
							});
							oPatientController.patientDataById = aoPatients;

							aoActualPatients = oPatientController.getQualifyingPatients(oFilterArguments, null, sPatientsToFilter);
							expect(aoActualPatients).toBeArrayOfSize(1);
							expect(aoActualPatients).toContain(oPatientWithPendingTodoForCurrentUser);
							expect(aoActualPatients).not.toContain(oPatientWithPendingTodoForNonCurrentUser);
							expect(aoActualPatients).not.toContain(oPatientWithNoPendingTodos);
							expect(aoActualPatients).not.toContain(oPatientWithNullComments);
							expect(aoActualPatients).not.toContain(oPatientWithUndefinedComments);
						});
					});
					describe('filtered by both pending actions and pending phone calls', function() {
						it('should return all patients who have either pending actions or pending phone calls', function() {
							var iCommentTypePendingTodo = 1,
								iCurrentPersonnelId = 666,
								iNonCurrentPersonnelId = 999,
								sPatientsToFilter = 'all',
								sArgumentName = 'PENDING_WORK',
								sArgumentMeaningPendingActions = 'PENDING_ACTIONS',
								sArgumentMeaningPendingCalls = 'PENDING_PHONE_CALLS',
								oMockController = jasmine.createSpyObj('mockController', ['getCriterion']),
								oPendingCall = {
									'COMM_PATIENT_ID': '123456789',
									'COMM_PRSNL_NAME': 'Some personnel',
									'COMM_SUBJECT_TEXT': 'Some subject',
									'COMM_STATUS_DT_TM': '/Date(2015-10-07T00:40:45.000+00:00)/'
								},
								aoCommentsWithTodoForCurrentUser = [{
									'COMMENT_TYPE': 3
								}, {
									'COMMENT_TYPE': 2
								}, {
									'COMMENT_TYPE': iCommentTypePendingTodo,
									'UPDT_ID': iCurrentPersonnelId
								}],
								aoCommentsWithTodoForNonCurrentUser = [{
									'COMMENT_TYPE': 3
								}, {
									'COMMENT_TYPE': 2
								}, {
									'COMMENT_TYPE': iCommentTypePendingTodo,
									'UPDT_ID': iNonCurrentPersonnelId
								}],
								aoCommentsNoTodo = [{
									'COMMENT_TYPE': 0
								}, {
									'COMMENT_TYPE': 0
								}, {
									'COMMENT_TYPE': 7
								}],
								oPatientWithPendingTodoForCurrentUser = {
									COMMENTS: aoCommentsWithTodoForCurrentUser
								},
								oPatientWithPendingTodoForNonCurrentUser = {
									COMMENTS: aoCommentsWithTodoForNonCurrentUser
								},
								oPatientWithPendingTodoForCurrentUserAndPhoneCall = {
									COMMENTS: aoCommentsWithTodoForCurrentUser,
									aPendingCalls: [oPendingCall]
								},
								oPatientWithPendingTodoForNonCurrentUserAndPhoneCall = {
									COMMENTS: aoCommentsWithTodoForNonCurrentUser,
									aPendingCalls: [oPendingCall]
								},
								oPatientWithPendingPhoneCall = {
									aPendingCalls: [oPendingCall]
								},
								oPatientWithNoPendingTodos = {
									COMMENTS: aoCommentsNoTodo
								},
								oPatientWithNullComments = {
									COMMENTS: null
								},
								oPatientWithUndefinedComments = {},
								oFilterArguments = [{
									'ARGUMENT_NAME': sArgumentName,
									'ARGUMENT_MEANING': sArgumentMeaningPendingActions
								}, {
									'ARGUMENT_NAME': sArgumentName,
									'ARGUMENT_MEANING': sArgumentMeaningPendingCalls
								}],
								aoPatients = {
									'123456789': oPatientWithPendingTodoForCurrentUser,
									'987654321': oPatientWithPendingTodoForNonCurrentUser,
									'56789': oPatientWithPendingPhoneCall,
									'126789': oPatientWithPendingTodoForCurrentUserAndPhoneCall,
									'132589': oPatientWithPendingTodoForNonCurrentUserAndPhoneCall,
									'123': oPatientWithNoPendingTodos,
									'456': oPatientWithNullComments,
									'789': oPatientWithUndefinedComments
								},
								oPatientController = new ACM_Patient_Controller(oMockController),
								aoActualPatients = null;
							oPatientController.patientDataById = aoPatients;

							oMockController.getCriterion.and.returnValue({
								CRITERION: {
									PRSNL_ID: iCurrentPersonnelId
								}
							});

							aoActualPatients = oPatientController.getQualifyingPatients(oFilterArguments, null, sPatientsToFilter);
							expect(aoActualPatients).toBeArrayOfSize(4);
							expect(aoActualPatients).toContain(oPatientWithPendingTodoForCurrentUser);
							expect(aoActualPatients).toContain(oPatientWithPendingPhoneCall);
							expect(aoActualPatients).toContain(oPatientWithPendingTodoForCurrentUserAndPhoneCall);
							expect(aoActualPatients).toContain(oPatientWithPendingTodoForNonCurrentUserAndPhoneCall);
							expect(aoActualPatients).not.toContain(oPatientWithNoPendingTodos);
							expect(aoActualPatients).not.toContain(oPatientWithNullComments);
							expect(aoActualPatients).not.toContain(oPatientWithUndefinedComments);
							expect(aoActualPatients).not.toContain(oPatientWithPendingTodoForNonCurrentUser);
						});
					});
				});
			});
			describe('get encounter id', function() {
				var B_MAKE_CALL_SYNCHRONOUSLY = false,
					B_MAKE_CALL_ASYNCHRONOUSLY = true,
					oPatientWithMultipleEncounters = {
						iId: 1,
						aiEncounters: [{
							ENCNTR_ID: 100
						}, {
							ENCNTR_ID: 200
						}]
					},
					oPatientWithOneEncounter = {
						iId: 2,
						aiEncounters: [{
							ENCNTR_ID: 300
						}]
					},
					oPatientWithNoEncounter = {
						iId: 3,
						aiEncounters: []
					},
					oPatientWithUndefinedEncounter = {
						iId: 4
					},
					fnCreateDummyPatientsById = function() {
						var oDummyPatientsById = {};
						oDummyPatientsById[oPatientWithMultipleEncounters.iId] = {};
						oDummyPatientsById[oPatientWithMultipleEncounters.iId].ENCNTR_IDS = oPatientWithMultipleEncounters.aiEncounters;
						oDummyPatientsById[oPatientWithOneEncounter.iId] = {};
						oDummyPatientsById[oPatientWithOneEncounter.iId].ENCNTR_IDS = oPatientWithOneEncounter.aiEncounters;
						oDummyPatientsById[oPatientWithNoEncounter.iId] = {};
						oDummyPatientsById[oPatientWithNoEncounter.iId].ENCNTR_IDS = oPatientWithNoEncounter.aiEncounters;
						oDummyPatientsById[oPatientWithUndefinedEncounter.iId] = {};
						return oDummyPatientsById;
					},
					fnCreateMockController = function() {
						return jasmine.createSpyObj('mockController', [
							'makeCall',
							'logErrorMessages',
							'fnLogWarningMessages',
							'fnGetActiveListProviders',
							'fnGetActiveListEprCodes',
							'fnGetActiveListLocations',
							'fnGetActiveListEncounterTypes'
						]);
					};
				describe('for single patient', function() {
					it('should bring back the cached encounter id for a patient with cached encounter id', function() {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iExpectedEncounterId = oPatientWithOneEncounter.aiEncounters[0].ENCNTR_ID;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						expect(oPatientController.getPatientEncounterId(oPatientWithOneEncounter.iId))
							.toEqual(iExpectedEncounterId);
						expect(oController.makeCall).not.toHaveBeenCalled();
					});
					it('should bring back the fresh encounter id for a patient without a cached encounter id', function() {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithNoEncounter = oPatientWithNoEncounter.iId,
							iExpectedEncounterId = 999;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oController.makeCall.and.callFake(function() {
							var fnSuccessCallback = arguments[3];
							fnSuccessCallback({
								PERSONS: [{
									PERSON_ID: iIdOfPatientWithNoEncounter,
									ENCNTR_ID: iExpectedEncounterId
								}]
							});
						});
						expect(oPatientController.getPatientEncounterId(iIdOfPatientWithNoEncounter))
							.toEqual(iExpectedEncounterId);
						expect(oController.makeCall).toHaveBeenCalledWith(
							'mp_dcp_dwl_get_best_encntr', {
								best_encntr_request: {
									persons: [{
										person_id: iIdOfPatientWithNoEncounter
									}]
								}
							},
							B_MAKE_CALL_SYNCHRONOUSLY,
							jasmine.any(Function),
							jasmine.any(Function)
						);
					});
				});
				describe('for multiple patients', function() {
					it('should return empty object if empty input is provided', function() {
						new ACM_Patient_Controller()
							.fnGetPatientsEncounterId([], B_MAKE_CALL_SYNCHRONOUSLY)
							.done(function(oActualReply) {
								expect(oActualReply).toEqual({});
							});
					});
					it('should treat null as an empty array and return empty object', function() {
						new ACM_Patient_Controller()
							.fnGetPatientsEncounterId(null, B_MAKE_CALL_SYNCHRONOUSLY)
							.done(function(oActualReply) {
								expect(oActualReply).toEqual({});
							});
					});
					it('should treat undefined as an empty array and return empty object', function() {
						new ACM_Patient_Controller()
							.fnGetPatientsEncounterId()
							.done(function(oActualReply) {
								expect(oActualReply).toEqual({});
							});
					});
					it('should throw an error if patient does not exist in memory', function() {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iExistentPatientId1 = oPatientWithMultipleEncounters.iId,
							iExistentPatientId2 = oPatientWithOneEncounter.iId,
							iNonExistentPatientId1 = 2198490,
							iNonExistentPatientId2 = 348957,
							sExpectedErrorMessage = 'Could not find patients : ' + iNonExistentPatientId1 + ',' + iNonExistentPatientId2;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						try {
							oPatientController.fnGetPatientsEncounterId([
								iExistentPatientId1,
								iExistentPatientId2,
								iNonExistentPatientId1,
								iNonExistentPatientId2
							], B_MAKE_CALL_SYNCHRONOUSLY);
						} catch (e) {
							expect(e.message).toBe(sExpectedErrorMessage);
						} finally {
							expect(oController.logErrorMessages).toHaveBeenCalledWith('', sExpectedErrorMessage, 'm_controller.getPatientById');
						}
					});
					it('should log a warning if get best encounter logic brought back no encounter and had to default to 0.0', function(fnDone) {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithNoEncounter = oPatientWithNoEncounter.iId,
							iIdOfPatientWithUndefinedEncounter = oPatientWithUndefinedEncounter.iId,
							sExpectedWarningMessage = 'Could not find encounter for the following patients: ' + iIdOfPatientWithNoEncounter + ',' + iIdOfPatientWithUndefinedEncounter + '. Used 0.0 instead.';
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oController.makeCall.and.callFake(function() {
							var fnSuccessCallback = arguments[3];
							fnSuccessCallback({
								PERSONS: [{
									PERSON_ID: iIdOfPatientWithNoEncounter,
									ENCNTR_ID: 0.0
								}, {
									PERSON_ID: iIdOfPatientWithUndefinedEncounter,
									ENCNTR_ID: 0.0
								}]
							});
						});

						oPatientController
							.fnGetPatientsEncounterId([
								iIdOfPatientWithNoEncounter,
								iIdOfPatientWithUndefinedEncounter
							], B_MAKE_CALL_SYNCHRONOUSLY)
							.done(function() {
								expect(oController.makeCall).toHaveBeenCalledWith('mp_dcp_dwl_get_best_encntr', {
										best_encntr_request: {
											persons: [{
												person_id: iIdOfPatientWithNoEncounter
											}, {
												person_id: iIdOfPatientWithUndefinedEncounter
											}]
										}
									},
									B_MAKE_CALL_SYNCHRONOUSLY,
									jasmine.any(Function),
									jasmine.any(Function));
								expect(oController.fnLogWarningMessages)
									.toHaveBeenCalledWith('', sExpectedWarningMessage, 'm_patientController#fnGetBestEncounterForPatients');
								fnDone();
							});
					});
					it('should bring back fresh encounter for patients without encounter and cache it', function(fnDone) {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithNoEncounter = oPatientWithNoEncounter.iId,
							iExpectedEncounterIdForPatientWithNoEncounter = 400,
							iIdOfPatientWithUndefinedEncounter = oPatientWithUndefinedEncounter.iId,
							iExpectedEncounterIdForPatientWithUndefinedEncounter = 500;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oController.makeCall.and.callFake(function() {
							var fnSuccessCallback = arguments[3];
							fnSuccessCallback({
								PERSONS: [{
									PERSON_ID: iIdOfPatientWithNoEncounter,
									ENCNTR_ID: iExpectedEncounterIdForPatientWithNoEncounter
								}, {
									PERSON_ID: iIdOfPatientWithUndefinedEncounter,
									ENCNTR_ID: iExpectedEncounterIdForPatientWithUndefinedEncounter
								}]
							});
						});
						oPatientController
							.fnGetPatientsEncounterId([
								iIdOfPatientWithNoEncounter,
								iIdOfPatientWithUndefinedEncounter
							], B_MAKE_CALL_SYNCHRONOUSLY)
							.done(function(oActualReply) {
								expect(oController.makeCall)
									.toHaveBeenCalledWith('mp_dcp_dwl_get_best_encntr', {
											best_encntr_request: {
												persons: [{
													person_id: iIdOfPatientWithNoEncounter
												}, {
													person_id: iIdOfPatientWithUndefinedEncounter
												}]
											}
										},
										B_MAKE_CALL_SYNCHRONOUSLY,
										jasmine.any(Function),
										jasmine.any(Function));
								expect(oActualReply[iIdOfPatientWithNoEncounter])
									.toBe(iExpectedEncounterIdForPatientWithNoEncounter);
								expect(oActualReply[iIdOfPatientWithUndefinedEncounter])
									.toBe(iExpectedEncounterIdForPatientWithUndefinedEncounter);
								expect(oPatientController.patientDataById[iIdOfPatientWithNoEncounter].ENCNTR_IDS[0].ENCNTR_ID)
									.toEqual(iExpectedEncounterIdForPatientWithNoEncounter);
								expect(oPatientController.patientDataById[iIdOfPatientWithUndefinedEncounter].ENCNTR_IDS[0].ENCNTR_ID)
									.toEqual(iExpectedEncounterIdForPatientWithUndefinedEncounter);
								fnDone();
							});
					});
					it('should not make a script call for best encounter if patient already has encoutner cached', function(fnDone) {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithMultipleEncounters = oPatientWithMultipleEncounters.iId,
							iIdOfPatientWithOneEncounter = oPatientWithOneEncounter.iId;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oPatientController
							.fnGetPatientsEncounterId([
								iIdOfPatientWithMultipleEncounters,
								iIdOfPatientWithOneEncounter
							], B_MAKE_CALL_SYNCHRONOUSLY)
							.done(function(oActualReply) {
								expect(oController.makeCall).not.toHaveBeenCalled();
								expect(oActualReply[iIdOfPatientWithMultipleEncounters])
									.toEqual(oPatientWithMultipleEncounters.aiEncounters[0].ENCNTR_ID);
								expect(oActualReply[iIdOfPatientWithOneEncounter])
									.toEqual(oPatientWithOneEncounter.aiEncounters[0].ENCNTR_ID);
								fnDone();
							});
					});
					it('should bring back cached encounter id for patient with cached encounter id and make script call for best encoutner for patient without cached encounter id', function(fnDone) {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithOneEncounter = oPatientWithOneEncounter.iId,
							iIdOfPatientWithNoEncounter = oPatientWithNoEncounter.iId,
							iExpectedEncounterIdForPatientWithNoEncounter = 400;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oController.makeCall.and.callFake(function() {
							var fnSuccessCallback = arguments[3];
							fnSuccessCallback({
								PERSONS: [{
									PERSON_ID: iIdOfPatientWithNoEncounter,
									ENCNTR_ID: iExpectedEncounterIdForPatientWithNoEncounter
								}]
							});
						});
						oPatientController
							.fnGetPatientsEncounterId([
								iIdOfPatientWithOneEncounter,
								iIdOfPatientWithNoEncounter
							])
							.done(function(oActualReply) {
								expect(oController.makeCall.calls.count()).toEqual(1);
								expect(oController.makeCall).toHaveBeenCalledWith('mp_dcp_dwl_get_best_encntr', {
										best_encntr_request: {
											persons: [{
												person_id: iIdOfPatientWithNoEncounter
											}]
										}
									},
									B_MAKE_CALL_SYNCHRONOUSLY,
									jasmine.any(Function),
									jasmine.any(Function));
								expect(oActualReply[iIdOfPatientWithOneEncounter])
									.toEqual(oPatientWithOneEncounter.aiEncounters[0].ENCNTR_ID);
								expect(oActualReply[iIdOfPatientWithNoEncounter])
									.toEqual(iExpectedEncounterIdForPatientWithNoEncounter);
								fnDone();
							});
					});
					it('should asynchronously bring back encounter id for a patient with no cached encounter id', function(fnDone) {
						var oController = fnCreateMockController(),
							oPatientController = new ACM_Patient_Controller(oController),
							iIdOfPatientWithNoEncounter = oPatientWithNoEncounter.iId,
							iExpectedEncounterIdForPatientWithNoEncounter = 400;
						oPatientController.patientDataById = fnCreateDummyPatientsById();
						oController.makeCall.and.callFake(function() {
							var fnSuccessCallback = arguments[3];
							fnSuccessCallback({
								PERSONS: [{
									PERSON_ID: iIdOfPatientWithNoEncounter,
									ENCNTR_ID: iExpectedEncounterIdForPatientWithNoEncounter
								}]
							});
						});
						oPatientController
							.fnGetPatientsEncounterId([
								iIdOfPatientWithNoEncounter
							], B_MAKE_CALL_ASYNCHRONOUSLY)
							.done(function(oActualReply) {
								expect(oController.makeCall.calls.count()).toEqual(1);
								expect(oController.makeCall).toHaveBeenCalledWith('mp_dcp_dwl_get_best_encntr', {
										best_encntr_request: {
											persons: [{
												person_id: iIdOfPatientWithNoEncounter
											}]
										}
									},
									B_MAKE_CALL_ASYNCHRONOUSLY,
									jasmine.any(Function),
									jasmine.any(Function));
								expect(oActualReply[iIdOfPatientWithNoEncounter])
									.toEqual(iExpectedEncounterIdForPatientWithNoEncounter);
								fnDone();
							});
					});
				});
			});
			describe('store patients column', function() {
				describe('mara score reply', function() {
					var fnCreateMockColDataForPatientWithId = function(iPatientId) {
						return {
							PERSON_ID: iPatientId,
							PPRS: [],
							HEALTH_PLANS: [],
							CONDITIONS: [],
							REGISTRY: [],
							ENCOUNTERS: [],
							RISK_TEXT: '',
							RISK_VALUE: '',
							COMMENTS: [],
							PENDING_CALLS: [],
							COMPLETED_CALLS: []
						};
					};
					it('stores the mara score when it\'s available in the mara reply', function() {
						var oPatientController = new ACM_Patient_Controller(),
							iMockPatientId = 123,
							oMockPatient = fnCreateMockColDataForPatientWithId(iMockPatientId),
							fExpectedMaraScore = 0.91,
							oMaraScoreReply = {
								persons: [{
									record_ids: [{
										data_partition_person_id: 123
									}],
									mara_total_risk_score: fExpectedMaraScore
								}]
							},
							oColumnData = {
								PATIENTS: [oMockPatient],
								MARA_SCORES: [{
									MARA_SCORE_REPLY: JSON.stringify(oMaraScoreReply)
								}],
								ENCNTR_GROUP: []
							},
							oActualReply = null;
						oPatientController.patientDataById = {};
						oPatientController.patientDataById[iMockPatientId] = {
							PERSON_ID: iMockPatientId,
							columnLoadIndicator: {}
						};

						oActualReply = oPatientController.storePatientColumns(oColumnData);
						expect(oActualReply[0].MARA_SCORE).toEqual(fExpectedMaraScore.toFixed(2));
					});
					it('stores undefined when the patient is not availabe in mara score reply', function() {
						var oPatientController = new ACM_Patient_Controller(),
							iMockPatientId = 123,
							oMockPatient = fnCreateMockColDataForPatientWithId(iMockPatientId),
							oMaraScoreReply = {
								persons: [{}]
							},
							oColumnData = {
								PATIENTS: [oMockPatient],
								MARA_SCORES: [{
									MARA_SCORE_REPLY: JSON.stringify({
										persons: []
									})
								}, {
									MARA_SCORE_REPLY: JSON.stringify(oMaraScoreReply)
								}],
								ENCNTR_GROUP: []
							},
							oActualReply = null;
						oPatientController.patientDataById = {};
						oPatientController.patientDataById[iMockPatientId] = {
							PERSON_ID: iMockPatientId,
							columnLoadIndicator: {}
						};

						oActualReply = oPatientController.storePatientColumns(oColumnData);
						expect(oActualReply[0].MARA_SCORE).not.toBeDefined();
					});
					it('stores -1 when the mara score is not availabe for a patient in mara score reply', function() {
						var oPatientController = new ACM_Patient_Controller(),
							iMockPatientId = 123,
							fNoMaraScore = -1.00,
							oMockPatient = fnCreateMockColDataForPatientWithId(iMockPatientId),
							oMaraScoreReply = {
								persons: [{
									record_ids: [{
										data_partition_person_id: iMockPatientId
									}]
								}]
							},
							oColumnData = {
								PATIENTS: [oMockPatient],
								MARA_SCORES: [{
									MARA_SCORE_REPLY: JSON.stringify(oMaraScoreReply)
								}],
								ENCNTR_GROUP: []
							},
							oActualReply = null;
						oPatientController.patientDataById = {};
						oPatientController.patientDataById[iMockPatientId] = {
							PERSON_ID: iMockPatientId,
							columnLoadIndicator: {}
						};

						oActualReply = oPatientController.storePatientColumns(oColumnData);
						expect(oActualReply[0].MARA_SCORE).toEqual(fNoMaraScore.toFixed(2));
					});
				});
			});
		});
	});
})();