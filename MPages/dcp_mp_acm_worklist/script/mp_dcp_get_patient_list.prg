/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-2012 Cerner Corporation                 *
      *                                                                      *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
      *  This material contains the valuable properties and trade secrets of *
      *  Cerner Corporation of Kansas City, Missouri, United States of       *
      *  America (Cerner), embodying substantial creative efforts and        *
      *  confidential information, ideas and expressions, no part of which   *
      *  may be reproduced or transmitted in any form or by any means, or    *
      *  retained in any storage or retrieval system without the express     *
      *  written permission of Cerner.                                       *
      *                                                                      *
      *  Cerner is a registered mark of Cerner Corporation.                  *
      *                                                                      *
  ~BE~***********************************************************************/
 
/*****************************************************************************
 
        Author:                 NT012578
        Date Written:           28-Jun-2012
        Source file name:       mp_dcp_get_patient_list.PRG
        Object name:            mp_dcp_get_patient_list
        Request #:
 
        Product:                PCA
        Product Team:           PowerChart Framework
        HNA Version:
        CCL Version:
 
        Program purpose:        Filter a list of patients using a number of conditions
                                such as age, problems, or coditions. The patient list
                                call be passed in or determined by using a defined provider
                                group matched to patient relationships.
 
		Tables read:			PRSNL_GROUP_RELTN, PERSON_PRSNL_RELTN, PERSON_PLAN_RELTN,
                                HEALTH_PLAN, PERSON, ENCOUNTER, PERSON_ALIAS,
                                AC_CLASS_PERSON_RELTN
        Tables updated:         None
 
******************************************************************************/
 
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date        Engineer             Comment                          *
;    *--- --------    -------------------- -------------------------------- *
;    *001 28-Jun-2012 NT012578             Initial Release                  *
;    *002 24-Sep-2012 SB021661             Added filter on registry         *
;    *003 22-Oct-2012 NT012578             Added filter on results          *
;    *004 05-Nov-2012 NT012578             Added and/or logic               *
;    *005 12-Oct-2015 PC031930             Added filter on pending work     *
;    *006 23-Mar-2017 PK021483             Filter patients having active MRN*
;~DE~************************************************************************
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
drop program mp_dcp_get_patient_list:dba go
create program mp_dcp_get_patient_list:dba
 
declare mrn_alias_cd = f8 with constant(uar_get_code_by( "MEANING", 4, "MRN")), public
declare deceased_yes_cd = f8 with constant(uar_get_code_by( "MEANING", 268, "YES")), public
declare total_consequent_cnt = i4 with noconstant(0), protected
 
;must be created and populated with caller
/*
record listrequest
(
	1 patients[*]
	  2 person_id = f8
	1 arguments[*]
		2 argument_name = vc
		2 argument_value = vc
		2 parent_entity_name = vc
		2 parent_entity_id = f8
		2 child_arguments[*]
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
	;0 = Filter Given Patients (Filter), 1 = Determine Qualifying Patients (Create), 2 = Delta Mode (Delta)
	1 search_indicator = i2
    1 load_demographics = i2
    1 user_id = f8
    1 patient_list_name = vc
	1 search_arguments[*]
		2 argument_name = vc
		2 argument_value = vc
		2 parent_entity_name = vc
		2 parent_entity_id = f8
	1 pos_cd = f8
)
 */
 
if (not validate(reply,0))
record reply
(
	1 patients[*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
	1 patients_del[*]
		2 person_id = f8
		2 disqualify_argument[*]
			3 disqualify_argument = vc
	1 patient_list_id = f8
%i cclsource:status_block.inc
) with public
endif
 
free record query_arguments
record query_arguments
(
	1 prsnl_groups[*]
		2 prsnl_group_id = f8
	1 single_prsnl[*]
		2 prsnl_id = f8
	1 related_pprs[*]
		2 ppr_cd = f8
	1 related_eprs[*]
		2 epr_cd = f8
	1 hp_type[*]
		2 hp_type_cd = f8
	1 hp_financial_class[*]
		2 hp_financial_class_cd = f8
	1 case_manager[*]
		2 case_manager_id = f8
	1 encounter_grp[*]
		2 encounter_grp = vc
	1 individual_encounters[*]
		2 encounter_type_cd = f8
	1 encounter_type[*]
		2 encounter_type_cd = f8
	1 races[*]
		2 race_cd = f8
	1 genders[*]
		2 gender_cd = f8
    1 languages[*]
		2 language_cd = f8
	1 admission_begin_dt_tm = dq8
	1 age_begin_dt = dq8
	1 age_end_dt = dq8
	1 age_ind = i2
	1 age_greater = i4
	1 age_less = i4
	1 age_from = i4
	1 age_to = i4
	1 age_equal = i4
	1 age_unit = vc
	1 results[*]
	  2 id = i4 ;determined by front end code
	  2 event_sets[*]
	    3 name = vc
	  2 values[*]
	    3 operator = vc
	    3 value = vc
	  2 range_back_value = vc ;number
	  2 range_back_unit = vc ;days, weeks, months
	  2 result_count
	    3 operator = vc
	    3 value = vc
	  2 group_operator = vc
	  2 grouper = vc
	1 meds[*]
	  2 order_name = vc
	  2 class_id = vc
	  2 range_back_value = vc ;number
	  2 range_back_unit = vc ;days, weeks, months
	  2 status[*]
	    3 meaning = vc
	  2 operator = vc
	1 condition_operator = vc
	1 conditions[*]
	  2 class_def_id = f8
	  2 consequents[*]
	    3 name = vc
	1 registries[*]
	  2 class_def_id = f8
 
	1 conditions_ind = i2
	1 health_expert_query_ind = i2
	1 assoc_providers
		2 prsnl_ids[*]
			3 prsnl_id = f8
		2 reltn_ids[*]
			3 reltn_id = f8
	1 appointments
		2 range_back_value = vc
		2 range_forward_value = vc
		2 range_unit = vc
		2 no_appt = vc
		2 status[*]
			3 status_cd = f8
	1 orders
		2 range_back_value = vc
		2 range_forward_value = vc
		2 range_unit = vc
		2 status[*]
			3 status_cd = f8
		2 type[*]
			3 type_cd = f8
	1 expectations
		2 expectations[*]
			3 expect_id = f8
		2 recommendations[*]
			3 due_arg = vc
	1 risks[*]
		2 risk_text = vc
	1 discharge_dt_tm = dq8
	1 case_status[*]
		2 case_status_cd = f8
	1 communicate_pref[*]
		2 comm_pref_cd = f8
	1 pending_work[*]
		2 pending_work_type = vc
	1 locations
		2 range_back_value = i4
		2 range_back_unit  = vc ;D, W, M
		2 location_cds[*]
			3 location_cd  = f8
)
 
;contains the currently qualified patients
record patientlist
(
   1 patients[*]
		2 person_id = f8
		2 new_ind = i2
)
 
;contains the currently qualified patients to do a query on
;for batching purposes, this structure may be rounded up to the next batch size and padded with dulicate pt ids
;In delta mode this record will contain static patients and new qualifying patients.
record queryPatientlist
(
   1 patients[*]
		2 person_id = f8
		2 new_ind = i2
)
 
;request and reply for calling the demographics script
free record dem_request
record dem_request
(
     1 patients[*]
         2 person_id = f8
)
 
;the patients that have a registry condition and which condition was found
free record registry_conditions
record registry_conditions
(
     1 patients[*]
         2 person_id = f8
         2 conditions[*]
           3 arg_index = i4
           3 class_id = f8
)
 
;the operators and groupings that need to be applied to consequents returned by the Health Expert server
;allows conditional logic like: patient has consequent (1 or 2) and (3 and 4) and (5 or in alt list)
free record rule_operations
record rule_operations
(
	1 group[*]
		2 name = vc
		2 alt_qualifier_list = vc ;optional: a patient list if the consequent doesn't exist
		2 operator = vc ;AND or OR
		2 consequents[*]
			3 name = vc ;the consequent name (RESULT1)
)
 
free record dem_reply
record dem_reply
(
	1 patients[*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
%i cclsource:status_block.inc
)
 
;request and reply for calling the mp_dcp_upd_static_patients script
free record patient_request
record patient_request
(
     1 patient_list_id = f8
     1 patient_list_name = vc
     1 owner_prsnl_id = f8
     1 search_arguments[*]
         2 argument_name = vc
         2 argument_value = vc
         2 parent_entity_id = f8
         2 parent_entity_name = vc
     1 patients[*]
         2 person_id = f8
         2 encntr_id = f8
         2 prsnl_group_id = f8
         2 rank = f8
         2 action_desc = vc
     1 clear_arg_ind = i2
     1 clear_pat_ind = i2
     1 return_arg_ind = i2
)
 
free record upd_static_patients_reply
record upd_static_patients_reply
(
	1 patient_list_id = f8
	1 patients[*]
		2 patient_id = f8
	1 arguments[*]
		3 argument_name = vc
		3 argument_value = vc
		3 parent_entity_name = vc
		3 parent_entity_id = f8
%i cclsource:status_block.inc
)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_get_patient_list", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare GetSearchArguments(NULL) = NULL
declare SetBirthDate(NULL) = NULL
declare ParseResultArgument(rule = vc, value = vc) = NULL
declare ParseMedArgument(rule = vc, class_id = f8, value = vc) = NULL
declare GetPatientList(NULL) = NULL
declare GetLocationPatientList(NULL) = NULL
declare PrepQueryPatientList(size = i4) = NULL
declare FilterDemographics(NULL) = NULL
declare DeltaCheckDemographics(NULL) = NULL
declare FilterCaseManager(NULL) = NULL
declare FilterHealthPlan(NULL) = NULL
declare DeltaCheckHealthPlan(NULL) = NULL
declare FilterRegistry(NULL) = NULL
declare FilterAssocProviders(NULL) = NULL
declare FilterAppointments(NULL) = NULL
declare FilterYesAppointments(NULL) = NULL
declare FilterNoAppointments(NULL) = NULL
declare RetrieveEncntrTypeCdsFromBedrock(NULL) = NULL
declare BuildEncounterJoin(NULL) = NULL
declare GetIndividualEncounterTypes(NULL) = NULL
declare FilterEncounterDate(NULL) = NULL
declare DeltaCheckEncounterDate(NULL) = NULL
declare FilterOrders(NULL) = NULL
declare FilterExpectations(NULL) = NULL
declare FilterRisks(NULL) = NULL
declare GetPatientsWithRegistryConditions(NULL) = NULL
declare BuildRuleOperators(NULL) = NULL
declare ExecuteHealthExpertRules(NULL) = NULL
declare AddResultRules(NULL) = NULL
declare AddMedRules(NULL) = NULL
declare AddConditionRules(NULL) = NULL
declare CheckConsequents(consequents = vc, patientId = f8) = i2
declare DeltaCheck(disqualify_argument = vc) = NULL
declare DeltaCheckForSinglePatient(patientId = f8, disqualify_argument = vc) = NULL
declare FillDemographicInfo(NULL) = NULL
declare UpdateStaticPatients(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CopyArgumentsListrequestPatientrequest(NULL) = NULL
declare FilterCommunicatePref(NULL) = NULL
declare FilterPendingWork(NULL) = NULL
declare FilterPendingActions(NULL) = NULL
declare FilterPendingCalls(NULL) = NULL
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare hCondition  = i4
declare hParam      = i4
declare hValue      = i4
declare iRet        = i4
declare hRule       = i4
declare hitem       = i4
declare ageFrom = i4 with noconstant(-1)
declare ageTo = i4 with noconstant(-1)
declare cur_list_size = i4 with noconstant(0)
declare consequentSize = i4 with noconstant(0)
declare num = i4 with noconstant(0) ;Used for\locateval loop iterator
declare patientsDeleteCount = i4 with noconstant(0)
declare lookBackMaxDays = i4 with constant(546)
declare updatePatCnt = i4 with noconstant(0)
declare encntr_parser = vc with noconstant("")
declare ppr_cnt = i4 with noconstant(0)
declare epr_cnt = i4 with noconstant(0)
 
;Used for expands
declare idx = i4 with noconstant(0)
declare idx1 = i4 with noconstant(0)
declare idx2 = i4 with noconstant(0)
declare idx3 = i4 with noconstant(0)
declare idx4 = i4 with noconstant(0)
declare idx5 = i4 with noconstant(0)
declare default_batch_size = i4 with constant(50)
declare batch_size = i4 with noconstant(0)
declare nstart = i4 with noconstant(1)      ;Only use if expanding in batches
declare loop_cnt = i4 with noconstant(0)
declare truePatCnt = i4 with noconstant(0)  ;Stores the count of unique patients that we will be doing the delta check against
 
declare fail_operation = vc with noconstant(""), private
declare failed = i2 with noconstant(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)

declare SEARCH_CREATE_FLAG = i2 with constant(1)
declare SEARCH_DELTA_FLAG = i2 with constant(2)
 
/**************************************************************
; Execution
**************************************************************/
if(size(listrequest->arguments, 5) > 0)
   call GetSearchArguments(NULL)
   call SetBirthDate(NULL)
 
   ;Debugging
   call echo("Current list arguments")
   call echorecord(query_arguments)
 
   ;build the patient list from a group/reltn query or based on passed in patients
   if(listrequest->search_indicator = SEARCH_CREATE_FLAG or listrequest->search_indicator = SEARCH_DELTA_FLAG)
		if( ; Location-based list.
			query_arguments->locations.range_back_unit in ("D", "W", "M")	; Has valid units.
			and query_arguments->locations.range_back_value >= 0			; Has valid range value.
			and size(query_arguments->locations.location_cds, 5) > 0		; Has at least one location_cd.
		  )
			call GetLocationPatientList(NULL)
		else
			call GetPatientList(NULL)
		endif
	else ;Filtering the patients that are passed in
	  set patientCount = 1
	  set sentPatientCount = size(listrequest->patients, 5)
	  set stat = alterlist(patientlist->patients, sentPatientCount)
	  for(patientCount = 1 to sentPatientCount)
		 set patientlist->patients[patientCount].person_id = listrequest->patients[patientCount].person_id
	  endfor
	endif

   ;Apply filters
 
   ;Apply the demographic filters if filters are set.
   if((size(query_arguments->genders,5) > 0 or \
      size(query_arguments->races,5) > 0 or size(query_arguments->languages,5) > 0 or \
      query_arguments->age_ind > 0))
 
 		;If a subroutine handles mulitple criteria, we need to call a difference subroutine so we can break out the differenct pieces
		;If we are in delta checking mode and there are existing patients or new patients that still qualify
		  if(listrequest->search_indicator = SEARCH_DELTA_FLAG and size(querypatientlist->patients, 5) > 0)
	      	call DeltaCheckDemographics(NULL)
		;If we are in creation mode and there are still patient that qualify continue with the filter
	      elseif(size(patientlist->patients, 5) > 0)
	      	call FilterDemographics(NULL)
	      endif
   endif
 
   ;Apply the case manager filters if filters are set and we either have patients that still qualify while in creation mode or
   ;have existing patients or new patients that still qualify in delta checking mode.
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
   (size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
    (size(query_arguments->case_manager,5) > 0))
 
    ;Retrieve the Case Manager Codes from the bedrock build.
      call RetrieveCaseManagerFromBedrock(NULL)
   	  call FilterCaseManager(NULL)
   endif
 
   ;Apply the health plan filters if filters are set and we either have patients that still qualify while in creation mode or
   ;have existing patients or new patients that still qualify in delta checking mode.
   if(size(query_arguments->hp_type,5) > 0 or size(query_arguments->hp_financial_class,5) > 0)
 
    ;If a subroutine handles mulitple criteria, we need to call a difference subroutine so we can break out the differenct pieces
    ;If we are in delta checking mode and there are existing patients or new patients that still qualify
	  if(listrequest->search_indicator = SEARCH_DELTA_FLAG and size(querypatientlist->patients, 5) > 0)
      	call DeltaCheckHealthPlan(NULL)
    ;If we are in creation mode and there are still patient that qualify continue with the filter
      elseif(size(patientlist->patients, 5) > 0)
      	call FilterHealthPlan(NULL)
      endif
 
   endif
 
   ;Apply the Registry filter if filters are set and we either have patients that still qualify while in creation mode or
   ;have existing patients or new patients that still qualify in delta checking mode.
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
   (size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
   size(query_arguments->registries,5) > 0)
      call FilterRegistry(NULL)
   endif
 
   ;Apply the Associate Providers filter if filters are set and we either have patients that still qualify while in creation
   ;mode or have existing patients or new patients that still qualify in delta checking mode.
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
   (size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
   (size(query_arguments->assoc_providers->prsnl_ids, 5) > 0 and
   		size(query_arguments->assoc_providers->reltn_ids, 5) > 0))
   			call FilterAssocProviders(NULL)
    endif
 
   ;Apply the Appointment filter if filters are set and we either have patients that still qualify while in creation
   ;mode or have existing patients or new patients that still qualify in delta checking mode.
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
		(size(query_arguments->appointments->status, 5) > 0 or cnvtlower(query_arguments->appointments->no_appt) = "true"))
   		call FilterAppointments(NULL)
   	endif
 
   ;Retrieve the encoutner type codes if encounter group filters are set
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
        size(query_arguments->encounter_grp,5) > 0)
   		 call RetrieveEncntrTypeCdsFromBedrock(NULL)
   endif
 
   ;Retrieve the encoutner type codes if individual encounter filters are set
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
        size(query_arguments->individual_encounters,5) > 0)
   		 call GetIndividualEncounterTypes(NULL)
   endif
 
   ;Apply the encounter filters if filters are set and we either have patients that still qualify while in creation mode or
   ;have existing patients or new patients that still qualify in delta checking mode.
   if(query_arguments->admission_begin_dt_tm > 0 or
   		query_arguments->discharge_dt_tm > 0 or
   		size(bedrock_prefs->encntr_types,5) > 0 or
   		size(query_arguments->case_status, 5) > 0)
 
    ;If a subroutine handles mulitple criteria, we need to call a difference subroutine so we can break out the differenct pieces.
    ;If we are in delta checking mode and there are existing patients or new patients that still qualify
	  if(listrequest->search_indicator = SEARCH_DELTA_FLAG and size(querypatientlist->patients, 5) > 0)
      	call DeltaCheckEncounterDate(NULL)
     ;If we are in creation mode and there are still patients that qualify continue with the filter
      elseif(size(patientlist->patients, 5) > 0)
      	call FilterEncounterDate(NULL)
      endif
 
   endif
 
   ;Apply the order status filter if filters are set and we either have patients that still qualify while in creation
   ;mode or have existing patients or new patients that still qualify in delta checking mode.
   if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
   		size(query_arguments->orders->status, 5) > 0)
   		call FilterOrders(NULL)
   	endif
 
 	;Apply the expectation filter if filters are set and we either have patients that still qualify while in creation
    ;mode or have existing patients or new patients that still qualify in delta checking mode.
	if(((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
   		size(query_arguments->expectations->expectations, 5) > 0 and
   		size(query_arguments->expectations->recommendations, 5) > 0)
   			call FilterExpectations(NULL)
    endif
 
 	;Loads conditions tied to registries from lists that were imported.
   if(size(patientlist->patients, 5) > 0 and size(query_arguments->conditions, 5) > 0)
   	  call GetPatientsWithRegistryConditions(NULL)
   endif
 
 	;Apply the condition\results\medication filter if filters are set and we either have patients that still qualify
 	;while in creation mode or have existing patients or new patients that still qualify in delta checking mode.
   if((size(patientlist->patients, 5) > 0  and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
   (size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG))
      if(total_consequent_cnt > 0 or size(query_arguments->results,5) > 0 or size(query_arguments->meds,5) > 0)
      	 call BuildRuleOperators(NULL)
         call ExecuteHealthExpertRules(NULL)
      endif
   endif
 
	if(((size(patientlist->patients, 5) > 0 and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
   		size(query_arguments->risks, 5) > 0)
   		call FilterRisks(NULL)
   	endif
	if(((size(patientlist->patients, 5) > 0 and listrequest->search_indicator != SEARCH_DELTA_FLAG) or
		(size(querypatientlist->patients, 5) > 0  and listrequest->search_indicator = SEARCH_DELTA_FLAG)) and
		size(query_arguments->communicate_pref, 5) > 0)
		call FilterCommunicatePref(NULL)
	endif
   	
   	if((size(patientlist->patients, 5) > 0 and listrequest->search_indicator != SEARCH_DELTA_FLAG) and
   		size(query_arguments->pending_work, 5) > 0)
   		call FilterPendingWork(NULL)
   	endif
 
    ;if we are in delta checking mode we need to update the patientlist record with the new patients
    ;The patientlist record will then be used to get the demographics and populate the reply.
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
	 	set cur_list_size = size(queryPatientlist->patients, 5)
	 	set patientCount = 0
	 	set stat = initrec(patientlist)
 
	 	for(idx = 1 to cur_list_size)
 
	   		if(querypatientlist->patients[idx].new_ind = 1)
 
	   			set pos = locateval(num, 1, size(patientlist->patients, 5), querypatientlist->patients[idx].person_id,
	   				patientlist->patients[num].person_id)
 
	  			if(pos = 0)
 
	   				set patientCount = patientCount + 1
					if(mod(patientCount,50) = 1)
						set stat = alterlist (patientlist->patients, patientCount + 49)
					endif
 
	   				set patientlist->patients[patientCount].person_id = querypatientlist->patients[idx].person_id
 
	   			endif
 
	   		endif
 
		endfor
 
		set stat = alterlist(patientlist->patients, patientCount)
 
 
    endif
 
   ;Put qualified patients on reply - with demographics if requested
   if(size(patientlist->patients, 5) > 0)
      if(listrequest->load_demographics = 1)
         call FillDemographicInfo(NULL)
      else
        set patientCount = 1
        set qualifiedPatientCount = size(patientlist->patients, 5)
        set stat = alterlist(reply->patients, qualifiedPatientCount)
        for(patientCount = 1 to qualifiedPatientCount)
        	set reply->patients[patientCount].person_id = patientlist->patients[patientCount].person_id
 
            ;only set in record if in create mode
			if (listrequest->search_indicator = SEARCH_CREATE_FLAG)
		   		set updatePatCnt = updatePatCnt + 1
				if(mod(updatePatCnt,50) = 1)
					set stat = alterlist (patient_request->patients, updatePatCnt + 49)
				endif
 
				set patient_request->patients[updatePatCnt].person_id = patientlist->patients[patientCount].person_id
			endif
 
        endfor
      endif
   endif
 
   set stat = alterlist(patient_request->patients, updatePatCnt)
 
   if (listrequest->search_indicator = SEARCH_CREATE_FLAG)
      call UpdateStaticPatients(NULL)
   endif
 
endif
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine GetSearchArguments(NULL)
   call log_message("Begin GetSearchArguments()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
 
   declare count = i4 with noconstant(0), private
   declare listsize = i4 with noconstant(0), private
   declare encounter_grp_cnt = i4 with noconstant(0), private
   declare individual_cnt = i4 with noconstant(0), private
   declare acmgroup_cnt = i4 with noconstant(0), private
   declare hp_type_cnt = i4 with noconstant(0), private
   declare hp_financial_class_cnt = i4 with noconstant(0), private
   declare case_manager_cnt = i4 with noconstant(0), private
   declare race_cnt = i4 with noconstant(0), private
   declare gender_cnt = i4 with noconstant(0), private
   declare language_cnt = i4 with noconstant(0), private
   declare consequent_cnt = i4 with noconstant(0), private
   declare reg_cond_cnt = i4 with noconstant(0), private
   declare registry_cnt = i4 with noconstant(0), private
   declare assoc_provider_cnt = i4 with noconstant(0), private
   declare assoc_reltn_cnt = i4 with noconstant(0), private
   declare appt_status_cnt = i4 with noconstant(0), private
   declare order_status_cnt = i4 with noconstant(0), private
   declare order_type_cnt = i4 with noconstant(0), private
   declare expectations_cnt = i4 with noconstant(0), private
   declare recomm_cnt = i4 with noconstant(0), private
   declare risk_cnt = i4 with noconstant(0), private
   declare case_status_cnt = i4 with noconstant(0), private
   declare singleprov_cnt = i4 with noconstant(0), private
   declare comm_pref_cnt = i4 with noconstant(0), private
   declare pending_work_cnt = i4 with noconstant(0), private
   declare locations_cnt = i4 with noconstant(0), private
   declare locations_idx = i4 with noconstant(0), private
 
   set listsize = size(listrequest->arguments,5)
 
   for( count = 1 to listsize)
      case(listrequest->arguments[count]->argument_name)
       of ARGNAME_ACMGROUP:
			set acmgroup_cnt = acmgroup_cnt + 1
			set stat = alterlist (query_arguments->prsnl_groups, acmgroup_cnt)
			set query_arguments->prsnl_groups[acmgroup_cnt].prsnl_group_id = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_SINGLEPROVIDER:
	   		set singleprov_cnt = singleprov_cnt + 1
			set stat = alterlist (query_arguments->single_prsnl, singleprov_cnt)
			set query_arguments->single_prsnl[singleprov_cnt].prsnl_id = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_PPRCODE:
			set ppr_cnt = ppr_cnt + 1
			set stat = alterlist (query_arguments->related_pprs, ppr_cnt)
			set query_arguments->related_pprs[ppr_cnt].ppr_cd = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_EPRCODE:
			set epr_cnt = epr_cnt + 1
			set stat = alterlist (query_arguments->related_eprs, epr_cnt)
			set query_arguments->related_eprs[epr_cnt].epr_cd = listrequest->arguments[count].parent_entity_id
       of ARGNAME_CASEMANAGER:
			set case_manager_cnt = case_manager_cnt + 1
			set stat = alterlist (query_arguments->case_manager, case_manager_cnt)
			set query_arguments->case_manager[case_manager_cnt].case_manager_id =
				listrequest->arguments[count].parent_entity_id
	   of ARGNAME_ENCOUNTERTYPE:
			;set group based on 1,2,4,8,16. "INPT_ENC_TYPE","OUTPT_ENC_TYPE","ED_ENC_TYPE","GROUP1_ENC_TYPE","GROUP2_ENC_TYPE"
			if (listrequest->arguments[count]->parent_entity_id = 1)
				set encounter_grp_cnt = encounter_grp_cnt + 1
				set stat = alterlist (query_arguments->encounter_grp, encounter_grp_cnt)
				set query_arguments->encounter_grp[encounter_grp_cnt].encounter_grp = "INPT_ENC_TYPE"
			endif
			if (listrequest->arguments[count]->parent_entity_id = 2)
				set encounter_grp_cnt = encounter_grp_cnt + 1
				set stat = alterlist (query_arguments->encounter_grp, encounter_grp_cnt)
				set query_arguments->encounter_grp[encounter_grp_cnt].encounter_grp = "OUTPT_ENC_TYPE"
			endif
			if (listrequest->arguments[count]->parent_entity_id = 4)
				set encounter_grp_cnt = encounter_grp_cnt + 1
				set stat = alterlist (query_arguments->encounter_grp, encounter_grp_cnt)
				set query_arguments->encounter_grp[encounter_grp_cnt].encounter_grp = "ED_ENC_TYPE"
			endif
			if (listrequest->arguments[count]->parent_entity_id = 8)
				set encounter_grp_cnt = encounter_grp_cnt + 1
				set stat = alterlist (query_arguments->encounter_grp, encounter_grp_cnt)
				set query_arguments->encounter_grp[encounter_grp_cnt].encounter_grp = "GROUP1_ENC_TYPE"
			endif
			if (listrequest->arguments[count]->parent_entity_id = 16)
				set encounter_grp_cnt = encounter_grp_cnt + 1
				set stat = alterlist (query_arguments->encounter_grp, encounter_grp_cnt)
				set query_arguments->encounter_grp[encounter_grp_cnt].encounter_grp = "GROUP2_ENC_TYPE"
			endif
			if (listrequest->arguments[count]->parent_entity_name = "INDIVIDUALENCOUNTER")
				; Add any individual encounters to the individual_encounters array
				set individual_cnt = individual_cnt + 1
				set stat = alterlist (query_arguments->individual_encounters, individual_cnt)
 
				; Get the encounter type from the request
				set encounter_type_cd = listrequest->arguments[count]->parent_entity_id
				set query_arguments->individual_encounters[individual_cnt].encounter_type_cd = encounter_type_cd
			endif
       of ARGNAME_HEALTHPLAN:
			set hp_type_cnt = hp_type_cnt + 1
			set stat = alterlist (query_arguments->hp_type, hp_type_cnt)
			set query_arguments->hp_type[hp_type_cnt].hp_type_cd = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_FINANCIALCLASS:
			set hp_financial_class_cnt = hp_financial_class_cnt + 1
			set stat = alterlist (query_arguments->hp_financial_class, hp_financial_class_cnt)
			set query_arguments->hp_financial_class[hp_financial_class_cnt].hp_financial_class_cd =
				listrequest->arguments[count].parent_entity_id
       of ARGNAME_GENDER:
            set gender_cnt = gender_cnt + 1
			set stat = alterlist (query_arguments->genders, gender_cnt)
			set query_arguments->genders[gender_cnt].gender_cd =
				listrequest->arguments[count].parent_entity_id
       of ARGNAME_RACE:
            set race_cnt = race_cnt + 1
			set stat = alterlist (query_arguments->races, race_cnt)
			set query_arguments->races[race_cnt].race_cd =
				listrequest->arguments[count].parent_entity_id
	   of ARGNAME_LANGUAGE:
			set language_cnt = language_cnt + 1
			set stat = alterlist(query_arguments->languages, language_cnt)
			set query_arguments->languages[language_cnt].language_cd = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_ADMISSIONMONTHS:
		    set query_arguments->admission_begin_dt_tm = cnvtlookbehind(concat(listrequest->arguments[count]->argument_value, "M"),
			cnvtdatetime(curdate,000000))
	   of ARGNAME_ADMISSIONWEEKS:
		    set query_arguments->admission_begin_dt_tm = cnvtlookbehind(concat(listrequest->arguments[count]->argument_value, "W"),
			cnvtdatetime(curdate,000000))
       of ARGNAME_ADMISSIONDAYS:
		    set query_arguments->admission_begin_dt_tm = cnvtlookbehind(concat(listrequest->arguments[count]->argument_value, "D"),
			cnvtdatetime(curdate,000000))
	   of ARGNAME_DISCHARGEMONTHS:
	   		set query_arguments->discharge_dt_tm = cnvtlookbehind(concat(listrequest->arguments[
	   		count]->argument_value, "M"),cnvtdatetime(curdate,000000))
	   of ARGNAME_DISCHARGEWEEKS:
	   		set query_arguments->discharge_dt_tm = cnvtlookbehind(concat(listrequest->arguments[
	   		count]->argument_value, "W"),cnvtdatetime(curdate,000000))
	   of ARGNAME_DISCHARGEDAYS:
	   		set query_arguments->discharge_dt_tm = cnvtlookbehind(concat(listrequest->arguments[
	   		count]->argument_value, "D"),cnvtdatetime(curdate,000000))
	   of ARGNAME_AGEFROM: ;younger age = later birth time
			;set query_arguments->age_end_value = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_from = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_ind = 1
	   of ARGNAME_AGETO: ;older age = earlier birth time, inclusive
			;set query_arguments->age_begin_value = cnvtint(listrequest->arguments[count]->argument_value)+1
			set query_arguments->age_to = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_ind = 1
       of ARGNAME_AGEGREATER: ;exclude this year of age (+1)
			;set query_arguments->age_end_value = cnvtint(listrequest->arguments[count]->argument_value)+1
			set query_arguments->age_greater = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_ind = 2
       of ARGNAME_AGELESS:
			;set query_arguments->age_begin_value = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_less = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_ind = 3
       of ARGNAME_AGEEQUAL:
			;set query_arguments->age_end_value = cnvtint(listrequest->arguments[count]->argument_value)
			;set query_arguments->age_begin_value = cnvtint(listrequest->arguments[count]->argument_value)+1
			set query_arguments->age_equal = cnvtint(listrequest->arguments[count]->argument_value)
			set query_arguments->age_ind = 4
	   of ARGNAME_AGEDAYS:
	   		set query_arguments->age_unit = "D"
	   of ARGNAME_AGEWEEKS:
	   		set query_arguments->age_unit = "W"
	   of ARGNAME_AGEMONTHS:
	   		set query_arguments->age_unit = "M"
	   of ARGNAME_AGEYEARS:
	   		set query_arguments->age_unit = "Y"
       of ARGNAME_CONDITION:
       		set reg_cond_cnt = reg_cond_cnt + 1
       		set stat = alterlist(query_arguments->conditions, reg_cond_cnt)
	  		set query_arguments->conditions[reg_cond_cnt].class_def_id =
	  			listrequest->arguments[count].parent_entity_id
 
 
       		set consequentIndex = 0
       		set consequent_cnt = size(listrequest->arguments[count]->child_arguments, 5)
			set stat = alterlist(query_arguments->conditions[reg_cond_cnt].consequents, consequent_cnt)
			for(consequentIndex = 1 to consequent_cnt)
				set query_arguments->conditions[reg_cond_cnt].consequents[consequentIndex].name =
					listrequest->arguments[count]->child_arguments[consequentIndex].argument_value
				set total_consequent_cnt = total_consequent_cnt + 1
	        endfor
	   of ARGNAME_COND_OPERATOR:
	        set query_arguments->condition_operator = listrequest->arguments[count]->argument_value
	   of ARGNAME_REGISTRY:
	   	    set registry_cnt = registry_cnt + 1
	   	    set stat = alterlist(query_arguments->registries, registry_cnt)
	   	    set query_arguments->registries[registry_cnt].class_def_id =
	   	    	    listrequest->arguments[count].parent_entity_id
	   of (PATSTRING("MED*",0)):
            call ParseMedArgument(listrequest->arguments[count].argument_name,\
                                  listrequest->arguments[count].parent_entity_id,\
                                  listrequest->arguments[count].argument_value)
       of (PATSTRING("RESULT*",0)):
            call ParseResultArgument(listrequest->arguments[count].argument_name,\
                                  listrequest->arguments[count].argument_value)
       of ARGNAME_ASSOCPROVIDERS:
       		set assoc_provider_cnt = assoc_provider_cnt + 1
       		if(mod(assoc_provider_cnt,20) = 1)
				set stat = alterlist(query_arguments->assoc_providers->prsnl_ids, assoc_provider_cnt + 19)
			endif
			set query_arguments->assoc_providers->prsnl_ids[assoc_provider_cnt].prsnl_id =
					listrequest->arguments[count].parent_entity_id
		of ARGNAME_ASSOCRELTN:
			set assoc_reltn_cnt = assoc_reltn_cnt + 1
			if(mod(assoc_reltn_cnt,20) = 1)
				set stat = alterlist(query_arguments->assoc_providers->reltn_ids, assoc_reltn_cnt + 19)
			endif
			set query_arguments->assoc_providers->reltn_ids[assoc_reltn_cnt].reltn_id =
					listrequest->arguments[count].parent_entity_id
		of ARGNAME_APPTFROM:
			set query_arguments->appointments->range_back_value = listrequest->arguments[count].argument_value
		of ARGNAME_APPTTO:
			set query_arguments->appointments->range_forward_value = listrequest->arguments[count].argument_value
		of ARGNAME_APPTDATEUNIT:
			set query_arguments->appointments->range_unit = listrequest->arguments[count].argument_value
		of ARGNAME_APPTSTATUS:
			set appt_status_cnt = appt_status_cnt + 1
			if(mod(appt_status_cnt,20) = 1)
				set stat = alterlist(query_arguments->appointments->status, appt_status_cnt + 19)
			endif
			set query_arguments->appointments->status[appt_status_cnt].status_cd =
					listrequest->arguments[count].parent_entity_id
		of ARGNAME_NOAPPT:
			set query_arguments->appointments->no_appt = listrequest->arguments[count].argument_value
		of ARGNAME_ORDERFROM:
			set query_arguments->orders->range_back_value = listrequest->arguments[count].argument_value
		of ARGNAME_ORDERTO:
			set query_arguments->orders->range_forward_value = listrequest->arguments[count].argument_value
		of ARGNAME_ORDERDATEUNIT:
			set query_arguments->orders->range_unit = listrequest->arguments[count].argument_value
		of ARGNAME_ORDERSSTATUS:
			set order_status_cnt = order_status_cnt + 1
			if(mod(order_status_cnt,20) = 1)
				set stat = alterlist(query_arguments->orders->status, order_status_cnt + 19)
			endif
			set query_arguments->orders->status[order_status_cnt].status_cd =
					listrequest->arguments[count].parent_entity_id
		of ARGNAME_ORDERTYPE:
			set order_type_cnt = order_type_cnt + 1
			if(mod(order_type_cnt,20) = 1)
				set stat = alterlist(query_arguments->orders->type, order_type_cnt + 19)
			endif
			set query_arguments->orders->type[order_type_cnt].type_cd =
					listrequest->arguments[count].parent_entity_id
		of ARGNAME_EXPECTATIONS:
			set expectations_cnt = expectations_cnt + 1
			if(mod(expectations_cnt,20) = 1)
				set stat = alterlist(query_arguments->expectations->expectations, expectations_cnt + 19)
			endif
			set query_arguments->expectations->expectations[expectations_cnt].expect_id =
				listrequest->arguments[count].parent_entity_id
		of ARGNAME_RECOMMSTATUS:
			set pos = locateval(num,1,size(query_arguments->expectations->recommendations, 5),listrequest->arguments[count].argument_value,
				query_arguments->expectations->recommendations[num].due_arg)
				if (pos <= 0)
					set recomm_cnt = recomm_cnt + 1
					if(mod(recomm_cnt,20) = 1)
					set stat = alterlist(query_arguments->expectations->recommendations, recomm_cnt + 19)
					endif
			        set query_arguments->expectations->recommendations[recomm_cnt].due_arg =
				    listrequest->arguments[count].argument_value
				endif
		of ARGNAME_RISK:
			set risk_cnt = risk_cnt + 1
			if(mod(risk_cnt,20) = 1)
				set stat = alterlist(query_arguments->risks, risk_cnt + 19)
			endif
			set query_arguments->risks[risk_cnt].risk_text = listrequest->arguments[count].argument_value
	   of ARGNAME_CASESTATUS:
			set case_status_cnt = case_status_cnt + 1
			if(mod(case_status_cnt,20) = 1)
				set stat = alterlist(query_arguments->case_status, case_status_cnt + 19)
			endif
			set query_arguments->case_status[case_status_cnt].case_status_cd = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_AUTOREMOVE:
	   		; No easy way of breaking out of this case, so setting the recomm_cnt to itself to perform an operation
	   		set recomm_cnt = recomm_cnt
	   of ARGNAME_COMMUNICATE_PREF:
			set comm_pref_cnt = comm_pref_cnt + 1
			if(mod(comm_pref_cnt, 20) = 1)
				set stat = alterlist(query_arguments->communicate_pref, comm_pref_cnt + 19)
			endif
			set query_arguments->communicate_pref[comm_pref_cnt].comm_pref_cd = listrequest->arguments[count].parent_entity_id
	   of ARGNAME_PENDING_WORK:
			set pending_work_cnt = pending_work_cnt + 1
	   		if(mod(pending_work_cnt, 10) = 1)
	   			set stat = alterlist(query_arguments->pending_work, pending_work_cnt + 9)
			endif
	   		set query_arguments->pending_work[pending_work_cnt].pending_work_type = listrequest->arguments[count].argument_meaning
	   of ARGNAME_LOCATIONDAYS:
	   		set query_arguments->locations->range_back_value = CNVTINT(listrequest->arguments[count].argument_value)
			set query_arguments->locations->range_back_unit  = "D"
	   of ARGNAME_LOCATIONWEEKS:
	   		set query_arguments->locations->range_back_value = CNVTINT(listrequest->arguments[count].argument_value)
			set query_arguments->locations->range_back_unit  = "W"
	   of ARGNAME_LOCATIONMONTHS:
	   		set query_arguments->locations->range_back_value = CNVTINT(listrequest->arguments[count].argument_value)
			set query_arguments->locations->range_back_unit  = "M"
	   of ARGNAME_LOCATIONUNITS:
	   		set locations_cnt = locations_cnt + 1
			set stat = alterlist (query_arguments->locations.location_cds, locations_cnt)
			set query_arguments->locations.location_cds[locations_cnt].location_cd = listrequest->arguments[count].parent_entity_id
	   else
		   		call echo(build2("UNKNOWN argument: ", listrequest->arguments[count]->argument_name))
		        set failed = 1
		        set fail_operation  = "GetSearchArguments"
		        call replyFailure("")
	   endcase
 
   endfor
 
   set stat = alterlist(query_arguments->assoc_providers->reltn_ids, assoc_reltn_cnt)
   set stat = alterlist(query_arguments->assoc_providers->prsnl_ids, assoc_provider_cnt)
   set stat = alterlist(query_arguments->appointments->status, appt_status_cnt)
   set stat = alterlist(query_arguments->orders->status, order_status_cnt)
   set stat = alterlist(query_arguments->orders->type, order_type_cnt)
   set stat = alterlist(query_arguments->expectations->expectations, expectations_cnt)
   set stat = alterlist(query_arguments->expectations->recommendations, recomm_cnt)
   set stat = alterlist(query_arguments->risks, risk_cnt)
   set stat = alterlist(query_arguments->case_status, case_status_cnt)
   set stat = alterlist(query_arguments->communicate_pref, comm_pref_cnt)
   set stat = alterlist(query_arguments->pending_work, pending_work_cnt)
   call log_message(build2("Exit GetSearchArguments(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine SetBirthDate(NULL)
 
	if(query_arguments->age_ind = 2)
 
		set query_arguments->age_begin_dt = cnvtdatetime("01-JAN-1800 00:00:00.00")
		set query_arguments->age_end_dt = cnvtlookbehind(build2(query_arguments->age_greater+1, ",", query_arguments->age_unit),\
 												cnvtdatetime(curdate, 0))
 
	elseif(query_arguments->age_ind = 3)
 
		set query_arguments->age_begin_dt = cnvtlookbehind(build2(query_arguments->age_less, ",", query_arguments->age_unit),\
												cnvtdatetime(curdate, 0))
		set query_arguments->age_end_dt = cnvtdatetime(curdate, curtime3)
 
	elseif(query_arguments->age_ind = 4)
 
		set query_arguments->age_begin_dt = cnvtlookbehind(build2(query_arguments->age_equal+1, ",", query_arguments->age_unit),\
 												cnvtdatetime(curdate, 0))
		set query_arguments->age_end_dt = cnvtlookbehind(build2(query_arguments->age_equal, ",", query_arguments->age_unit),\
 												cnvtdatetime(curdate, 0))
 
	elseif(query_arguments->age_ind = 1)
 
		set query_arguments->age_begin_dt = cnvtlookbehind(build2(query_arguments->age_to+1, ",", query_arguments->age_unit),\
												 cnvtdatetime(curdate, 0))
		set query_arguments->age_end_dt = cnvtlookbehind(build2(query_arguments->age_from, ",", query_arguments->age_unit),\
												cnvtdatetime(curdate, 0))
 
	endif
end
 
 
subroutine ParseResultArgument(argumentName, value)
   call log_message("Begin ParseResultArgument()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
 
   ;Determine the result number being reference
   set endOfIdentifier = findstring("_", argumentName)
   set endOfResultText = 7;position after RESULT
   set resultNumberString = substring(endOfResultText, endOfIdentifier - endOfResultText, argumentName)
   if(size(resultNumberString) <= 0)
   		return
   endif
 
   ; Result properties may be sent in with any of a range of integers correlated with front end elements
   ; We need to ensure those integers exist and match them up together in the result array
   declare resultId = i4 with constant(cnvtreal(resultNumberString)), private
   declare resultIndex = i4 with noconstant(0)
   declare resultType = vc with constant(substring(endOfIdentifier + 1, size(argumentName,1) - endOfIdentifier, argumentName))
   declare resultSize = i4 with noconstant(size(query_arguments->results, 5))
   declare idx = i4 with noconstant(0), private
 
   if(resultId <= 0)
   		return
   endif
   call echo(build2("Result index: ", resultId))
   call echo(build2("Result type: ", resultType))
 
   for(idx = 1 to resultSize)
   		if(query_arguments->results[idx].id = resultId)
   			set resultIndex = idx
   		endif
   endfor
 
   if(resultIndex = 0)
   		set resultSize = resultSize + 1
   		set stat = alterlist(query_arguments->results, resultSize)
   		set query_arguments->results[resultSize].id = resultId
   		set resultIndex = resultSize
   endif
 
 
   if(resultType = "VALEQUAL" or resultType = "VALGREATER" or resultType = "VALLESS" \
      or resultType = "VALFROM" or resultType = "VALTO")
      set valueSize = size(query_arguments->results[resultIndex].values, 5) + 1
      set stat = alterlist(query_arguments->results[resultIndex].values, valueSize)
      set query_arguments->results[resultIndex].values[valueSize].value = value
      if(resultType = "VALEQUAL")
        set query_arguments->results[resultIndex].values[valueSize].operator = "=="
      elseif(resultType = "VALGREATER")
        set query_arguments->results[resultIndex].values[valueSize].operator = ">"
      elseif(resultType = "VALLESS")
        set query_arguments->results[resultIndex].values[valueSize].operator = "<"
      elseif(resultType = "VALFROM")
        set query_arguments->results[resultIndex].values[valueSize].operator = ">="
      elseif(resultType = "VALTO")
        set query_arguments->results[resultIndex].values[valueSize].operator = "<="
      endif
    elseif(resultType = "BACKDAYS")
      set query_arguments->results[resultIndex].range_back_value = value
      set query_arguments->results[resultIndex].range_back_unit = "Days"
    elseif(resultType = "BACKWEEKS")
      set query_arguments->results[resultIndex].range_back_value = value
      set query_arguments->results[resultIndex].range_back_unit = "Weeks"
    elseif(resultType = "BACKMONTHS")
      set query_arguments->results[resultIndex].range_back_value = value
      set query_arguments->results[resultIndex].range_back_unit = "Months"
    elseif(resultType = "COUNTATLEAST")
      set query_arguments->results[resultIndex].result_count.operator = ">="
      set query_arguments->results[resultIndex].result_count.value = value
    elseif(resultType = "COUNTLESS")
      set query_arguments->results[resultIndex].result_count.operator = "<"
      set query_arguments->results[resultIndex].result_count.value = value
    elseif(resultType = "EVENTSET")
      set eventSetSize = size(query_arguments->results[resultIndex].event_sets, 5) + 1
      set stat = alterlist(query_arguments->results[resultIndex].event_sets, eventSetSize)
      set query_arguments->results[resultIndex].event_sets[eventSetSize].name = value
    elseif(resultType = "GROUP")
      set query_arguments->results[resultIndex].grouper = value
    elseif(resultType = "OPERATOR")
      set query_arguments->results[resultIndex].group_operator = value
    endif
 
	call log_message(build2("Exit ParseResultArgument(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine ParseMedArgument(argumentName, class_id, value)
   call log_message("Begin ParseMedArgument()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
 
   ;Determine the result number being reference
   set endOfIdentifier = findstring("_", argumentName)
   set endOfMedText = 4;position after MED
   set medNumberString = substring(endOfMedText, endOfIdentifier - endOfMedText, argumentName)
   if(size(medNumberString) <= 0)
   		return
   endif
 
   declare medIndex = i4 with constant(cnvtreal(medNumberString)), private
   declare medArgType = vc with constant(substring(endOfIdentifier + 1, size(argumentName,1) - endOfIdentifier, argumentName))
   declare medSize = i4 with noconstant(size(query_arguments->meds, 5))
   call echo(build2("Med index: ", medIndex))
   call echo(build2("Med type: ", medArgType))
   if(medSize < medIndex)
      call echo(build2("Adjusting med size to ", medIndex))
      set stat = alterlist(query_arguments->meds, medIndex)
      set medSize = medIndex
   endif
 
   if(medArgType = "DRUGCLASSID")
      set query_arguments->meds[medIndex].class_id = trim(cnvtstring(class_id))
   elseif(medArgType = "DRUGNAME")
      set query_arguments->meds[medIndex].order_name = value
   elseif(medArgType = "STATUS")
      set new_status_size = size(query_arguments->meds[medIndex].status, 5) + 1
      set stat = alterlist(query_arguments->meds[medIndex].status, new_status_size)
      set query_arguments->meds[medIndex].status[new_status_size].meaning = value
   elseif(medArgType = "BACKDAYS")
      set query_arguments->meds[medIndex].range_back_value = value
      set query_arguments->meds[medIndex].range_back_unit = "Days"
   elseif(medArgType = "BACKWEEKS")
      set query_arguments->meds[medIndex].range_back_value = value
      set query_arguments->meds[medIndex].range_back_unit = "Weeks"
   elseif(medArgType = "BACKMONTHS")
      set query_arguments->meds[medIndex].range_back_value = value
      set query_arguments->meds[medIndex].range_back_unit = "Months"
   elseif(medArgType = "OPERATOR")
      set query_arguments->meds[medIndex].operator = value
   endif
 
   call log_message(build2("Exit ParseMedArgument(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine GetPatientList(NULL)
	call log_message("Begin GetPatientList()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare person_cnt = i4 with noconstant(0)
 
    set idx = 0
	set idx1 = size(query_arguments->single_prsnl,5)

    ; If any provider groups are selected, get all the unique prnsl_ids within those groups,
    ; and add them to query_arguments->single_prsnl 
	if(size(query_arguments->prsnl_groups,5) > 0)
		select into 'nl:'
		from prsnl_group_reltn pgr
		where
			expand(idx, 1, size(query_arguments->prsnl_groups,5), pgr.prsnl_group_id, query_arguments->prsnl_groups[idx].prsnl_group_id)
			and pgr.active_ind = 1
			and pgr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pgr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		order by
		    pgr.person_id
		head report
			; When size(query_arguments->single_prsnl,5) = 1, idx1 = 2 in the detail for the very first time
			; To avoid out of buffer error in the detail we need to increase the size by 49 
			stat = alterlist (query_arguments->single_prsnl, idx1 + 49)
		detail
			idx1 = idx1 + 1
			if(mod(idx1,50) = 1)
				stat = alterlist (query_arguments->single_prsnl, idx1 + 49)
			endif
			query_arguments->single_prsnl[idx1].prsnl_id = pgr.person_id
 
		foot report
			stat = alterlist(query_arguments->single_prsnl, idx1)
		with nocounter, expand = 1
	endif
 
 	if(size(query_arguments->related_pprs,5) > 0)
 
		select into 'nl:'
		from
			person_prsnl_reltn ppr,
		    	person p,
		    	person_alias pa
		plan ppr where
			expand(idx, 1, size(query_arguments->single_prsnl,5), ppr.prsnl_person_id, query_arguments->single_prsnl[idx].prsnl_id)
			and expand(idx, 1, size(query_arguments->related_pprs,5), ppr.person_prsnl_r_cd, query_arguments->related_pprs[idx].ppr_cd)
			and ppr.active_ind = 1
			and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		join p where
			ppr.person_id = p.person_id and
			p.deceased_cd != deceased_yes_cd and
			p.deceased_dt_tm = NULL
		join pa where
			p.person_id = pa.person_id
			and pa.active_ind = 1
			and pa.person_alias_type_cd = mrn_alias_cd
			and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		order by ppr.person_id
 
		head report
			person_cnt = 0
		head ppr.person_id
 
			person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = ppr.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
		with nocounter, expand = 1
 
	elseif(size(query_arguments->related_eprs,5) > 0)
 
		select into 'nl:'
		from
			encounter e,
		    	encntr_prsnl_reltn epr,
		    	person p,
		    	person_alias pa
		plan epr where
			expand(idx, 1, size(query_arguments->single_prsnl,5), epr.prsnl_person_id, query_arguments->single_prsnl[idx].prsnl_id)
			and expand(idx, 1, epr_cnt, epr.encntr_prsnl_r_cd, query_arguments->related_eprs[idx].epr_cd)
			and epr.active_ind = 1
			and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		join e where
			epr.encntr_id = e.encntr_id
			and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and e.active_ind = 1
		join p where
			e.person_id = p.person_id and
			p.deceased_cd != deceased_yes_cd and
			p.deceased_dt_tm = NULL
		join pa where
			p.person_id = pa.person_id
			and pa.active_ind = 1
			and pa.person_alias_type_cd = mrn_alias_cd
			and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		order by p.person_id
 
		head report
			person_cnt = 0
		head p.person_id
 
			person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = p.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
		with nocounter, expand = 1
 
	endif
 
	call echo(build2("List size after PRSNL_GROUP query: ", size(patientlist->patients, 5)))
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "GetPatientList"
       call replyFailure("SELECT")
    endif
 
	;call echorecord(patientlist)
 
    ;We now have the current qualifying patients in "patientlist" we need to compare that to what was passed in.
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_ACMGROUP)
 
    endif
 
	call log_message(build2("Exit GetPatientList(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","GetPatientList found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
subroutine GetLocationPatientList(NULL)
	call log_message("Begin GetLocationPatientList()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare location_range_back = vc with constant(
		build(query_arguments->locations.range_back_value, ",", query_arguments->locations.range_back_unit))
	declare location_cnt = i4 with constant(size(query_arguments->locations.location_cds, 5))
	declare person_cnt = i4 with noconstant(0)

	select into "nl:"
	from encntr_loc_hist elh
		,encounter e
		,person p
		,person_alias pa
	plan elh
		where expand(idx, 1, location_cnt, elh.loc_nurse_unit_cd, query_arguments->locations.location_cds[idx].location_cd)
			and elh.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and elh.end_effective_dt_tm >= cnvtlookbehind(location_range_back)
			and elh.active_ind = 1
	join e
		where e.encntr_id = elh.encntr_id
			and e.active_ind = 1
	join p
		where p.person_id = e.person_id
			and p.deceased_cd != deceased_yes_cd
			and p.deceased_dt_tm = NULL
			and p.active_ind = 1
	join pa 
		where p.person_id = pa.person_id
			and pa.active_ind = 1
			and pa.person_alias_type_cd = mrn_alias_cd
			and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by p.person_id
	head report
		person_cnt = 0
	head p.person_id
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
		patientlist->patients[person_cnt].person_id = p.person_id
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
	with nocounter, expand=1

	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "GetLocationPatientList"
		call replyFailure("SELECT")
	endif

	;call echorecord(patientlist)

	;We now have the current qualifying patients in "patientlist" we need to compare that to what was passed in.
	if(listrequest->search_indicator = search_delta_flag)
		call DeltaCheck(ARGNAME_LOCATIONS)
	endif

	call log_message(build2("Exit GetLocationPatientList(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","GetPatientList found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
;copies the contents of patientlist to queryPatientlist, rounds up to batch size and pads
;@PARAM size specifies the batch size for each expand or transaction call
subroutine PrepQueryPatientList(size)
	call log_message("Begin PrepQueryPatientList()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    declare new_list_size = i4 with noconstant(0)
    set batch_size = size
    call echo(build2("Batch Size: ", batch_size))
    call log_message(build2("Batch Size: ", batch_size), LOG_LEVEL_DEBUG)
 
	;if we are delta checking we don't want to put the latest query results in the queryPatientlist because we need to keep checking
	;all the static patients.
	if(listrequest->search_indicator != SEARCH_DELTA_FLAG)
 
		set stat = initrec(queryPatientlist)
		set stat = moverec(patientlist, queryPatientlist)
 
	endif
 
	;however we still want to properly batch size the record structure
	set cur_list_size = size(queryPatientlist->patients, 5)
	set loop_cnt = ceil(cnvtreal(cur_list_size) / batch_size)
	set new_list_size = loop_cnt * batch_size
	set stat = alterlist(queryPatientlist->patients, new_list_size)
	for(num = cur_list_size + 1 to new_list_size)
	   set queryPatientlist->patients[num].person_id = queryPatientlist->patients[cur_list_size].person_id
	   set queryPatientlist->patients[num].new_ind = queryPatientlist->patients[cur_list_size].new_ind
	endfor
 
	set nstart = 1
	set idx = 0
	set idx2 = 0
	set idx3 = 0
	set idx4 = 0
	set idx5 = 0
 
 call log_message(build2("Exit PrepQueryPatientList(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
;If modified, may need to modify DeltaCheckDemographics
;filters person demographics: age, race, gender, language
subroutine FilterDemographics(NULL)
	call log_message("Begin FilterDemographics()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
 	call echo("FilterDemographics")
 
	declare person_cnt = i4 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
	declare gender_size = i4 with noconstant(size(query_arguments->genders, 5))
	declare race_size = i4 with noconstant(size(query_arguments->races, 5))
	declare language_size = i4 with noconstant(size(query_arguments->languages, 5))
	set person_cnt = 0
 
 
select distinct p.person_id
    from
    person p,
        (left join person_code_value_r pr on
            (p.person_id = pr.person_id and
                pr.code_set = 282 and ;282 is the code set for race
                pr.active_ind = 1))
    plan p
    join pr
    where
    expand(idx,nstart,size(queryPatientlist->patients, 5),p.person_id, queryPatientlist->patients[idx].person_id) and
    	(gender_size <= 0 or expand(idx2, 1, gender_size, p.sex_cd, query_arguments->genders[idx2].gender_cd)) and
    	   (language_size <= 0 or expand(idx4, 1, language_size, p.language_cd, query_arguments->languages[idx4].language_cd)) and
    	   (query_arguments->age_ind <= 0 or
    			p.birth_dt_tm between cnvtdatetime(query_arguments->age_begin_dt) and cnvtdatetime(query_arguments->age_end_dt)) and
    	   (race_size <= 0 or
       	       expand(idx3, 1, race_size, p.race_cd, query_arguments->races[idx3].race_cd) or ;race_code exists in the person table
               expand(idx5, 1, race_size, pr.code_value, query_arguments->races[idx5].race_cd)) ;race_code exists in pr table
    order by p.person_id
 
	head report
		person_cnt = 0
 
	detail
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = p.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter, expand=1
 
	;call echorecord(patientlist)
 
	call echo(build2("List size after PERSON demog query: ", size(patientlist->patients, 5)))
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterDemographics"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit FilterDemographics(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterDemographics found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
 
;If modify, may need to modify FilterDemographics
;determines factor for person demographics: age, race, gender, language
subroutine DeltaCheckDemographics(NULL)
	call log_message("Begin DeltaCheckDemographics()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
 
	declare gender_size = i4 with noconstant(size(query_arguments->genders, 5))
	declare race_size = i4 with noconstant(size(query_arguments->races, 5))
	declare language_size = i4 with noconstant(size(query_arguments->languages, 5))
 
	set person_cnt = 0
 
	if(query_arguments->age_ind > 0)
 
 
		;Need to reset patientlist so we know what patients don't qualify for the specific filter
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
 
		call echo("AGE")
		select into "nl:"
		from (dummyt d1 with seq = value(loop_cnt)),
			 person p
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join p where
			expand(idx,nstart,nstart+(batch_size-1),p.person_id, queryPatientlist->patients[idx].person_id) and
			(query_arguments->age_ind <= 0 or
				p.birth_dt_tm between cnvtdatetime(query_arguments->age_begin_dt) and cnvtdatetime(query_arguments->age_end_dt))
	    order by p.person_id
 
		head report
			person_cnt = size(patientlist->patients, 5)
 
		detail
	 		person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = p.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter
 
		call DeltaCheck(ARGNAME_AGE)
 
	endif
 
 
	if(gender_size > 0)
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
 
		call echo("GENDER")
 
		select into "nl:"
		from (dummyt d1 with seq = value(loop_cnt)),
			 person p
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join p where
			expand(idx,nstart,nstart+(batch_size-1),p.person_id, queryPatientlist->patients[idx].person_id) and
			p.person_id > 0 and
	        expand(idx2, 1, gender_size, p.sex_cd, query_arguments->genders[idx2].gender_cd)
	    order by p.person_id
 
		head report
			person_cnt = 0
 
		detail
 
	 		person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = p.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter
 
		call DeltaCheck(ARGNAME_GENDER)
 
	endif
 
	if(race_size > 0)
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
 
		call echo("RACE")
        select distinct p.person_id
        from person p,
             (left join person_code_value_r pr on
                (p.person_id = pr.person_id and
                 pr.code_set = 282 and ;282 is the code set for race
                 pr.active_ind = 1))
        plan p
        join pr
        where expand(idx,nstart,size(queryPatientlist->patients, 5),p.person_id, queryPatientlist->patients[idx].person_id) and
              (expand(idx5, 1, race_size, p.race_cd, query_arguments->races[idx5].race_cd) or ;race_code exists in person table
               expand(idx2, 1, race_size, pr.code_value, query_arguments->races[idx2].race_cd)) ;race_code exists in pr table
    	order by p.person_id
 
 
		head report
			person_cnt = 0
 
		detail
 
	 		person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = p.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter, expand=1
 
		call DeltaCheck(ARGNAME_RACE)
 
	endif
 
	if(language_size > 0)
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
 
		call echo("language")
 
		select into "nl:"
		from (dummyt d1 with seq = value(loop_cnt)),
			 person p
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join p where
			expand(idx,nstart,nstart+(batch_size-1),p.person_id, queryPatientlist->patients[idx].person_id) and
			p.person_id > 0 and
	        expand(idx2, 1, language_size, p.language_cd, query_arguments->languages[idx2].language_cd)
	    order by p.person_id
 
		head report
			person_cnt = 0
 
		detail
 
	 		person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = p.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter
 
		call DeltaCheck(ARGNAME_LANGUAGE)
 
	endif
 
 
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "DeltaCheckDemographics"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit DeltaCheckDemographics(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","DeltaCheckDemographics found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
/****/
 
subroutine FilterRisks(NULL)
	call log_message("Begin FilterRisks()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare TABLE_EXISTS_WITH_ACCESS = i2 with constant(2), protect
 
	if(CHECKDIC("LH_CNT_READMIT_RISK", "T", 0) = TABLE_EXISTS_WITH_ACCESS
		AND CHECKDIC("LH_CNT_READMIT_WORKLIST", "T", 0) = TABLE_EXISTS_WITH_ACCESS)
 
		declare person_cnt = i4 with noconstant(0)
	    declare risks_size = i4 with constant(size(query_arguments->risks , 5))
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
 
	 	set person_cnt = 0
 
		select into "nl:"
		from (dummyt d1 with seq = value(loop_cnt)),
			 lh_cnt_readmit_risk lh,
			 lh_cnt_readmit_worklist lhw
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join lhw where
			expand(idx,nstart,nstart+(batch_size-1),lhw.person_id, queryPatientlist->patients[idx].person_id)
		join lh where
			lh.lh_cnt_readmit_worklist_id = lhw.lh_cnt_readmit_worklist_id and
			lh.active_ind = 1 and
			lh.risk_factor_flag = 5 and ;5 is the flag for All Cause Risk
			lh.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
	        lh.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) and
	        expand(idx,1, risks_size, cnvtupper(lh.risk_factor_txt) , cnvtupper(query_arguments->risks[idx].risk_text))
		order by
			lhw.person_id
		head report
			person_cnt = 0
		head lhw.person_id
	 		person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = lhw.person_id
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
		with nocounter
 
		set ERRCODE = ERROR(ERRMSG,0)
	    if(ERRCODE != 0)
	       set failed = 1
	       set fail_operation = "FILTERRISKS"
	       call replyFailure("SELECT")
	    endif
 
		if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
	    	call DeltaCheck(ARGNAME_RISK)
	    endif
 
	else
 
		call log_message("Tables lh_cnt_readmit_risk and lh_cnt_readmit_worklist do not exist.", LOG_LEVEL_DEBUG)
 
	endif
 
	call log_message(build2("Exit FilterRisk(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterRisk found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
subroutine FilterCommunicatePref(NULL)
	call log_message("Begin FilterCommunicatePref()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare person_cnt = i4 with noconstant(0)
	declare unknown_ind = i2 with noconstant(0)
	declare comm_cnt = i2 with noconstant(size(query_arguments->communicate_pref, 5))
	declare zeroPos = i4 with noconstant(locateval(idx4,1,comm_cnt,0.0,query_arguments->communicate_pref[idx4]->comm_pref_cd))
	if(zeroPos > 0)
		set unknown_ind = 1
	endif

	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)

	set person_cnt = 0

	select into "nl:"
	from 
		person_patient p
	where
		expand(idx,1,size(queryPatientlist->patients, 5),p.person_id,
			queryPatientlist->patients[idx].person_id) and
		expand(idx,1,size(query_arguments->communicate_pref, 5),
			p.contact_method_cd, query_arguments->communicate_pref[idx].comm_pref_cd) and
		(p.active_ind = 1 or (p.active_ind = 0 and unknown_ind = 1)) and
		p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3) and
		p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		person_cnt = 0
	head p.person_id
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif

		patientlist->patients[person_cnt].person_id = p.person_id

	with nocounter, expand = 1

	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "FilterCommunicationPreference"
		call replyFailure("SELECT")
	endif

	if(unknown_ind = 1)
		select into "nl:"
		from
			person p
		where
			expand(idx3,1,size(queryPatientlist->patients, 5),p.person_id, \
				queryPatientlist->patients[idx3].person_id) and
			not exists(select pp.person_id from person_patient pp
						where pp.person_id = p.person_id)
		head p.person_id
			person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif

			patientlist->patients[person_cnt].person_id = p.person_id

		with nocounter, expand = 1

		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
			set failed = 1
			set fail_operation = "FilterCommunicationPreference"
			call replyFailure("SELECT")
		endif
	endif

	set stat = alterlist(patientlist->patients, person_cnt)

	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
		call DeltaCheck(ARGNAME_COMMUNICATE_PREF)
	endif

	call log_message(build2("Exit FilterCommunicatePref(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterCommunicatePref found ", person_cnt), LOG_LEVEL_DEBUG)
end

/**
 * Subroutine that handles filtering the patient list by patients who have pending work.
 */
subroutine FilterPendingWork(NULL)
	call log_message("Begin FilterPendingWork()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare TYPE_CNT = i4 with constant(size(query_arguments->pending_work, 5)), private
	declare type_index = i4 with noconstant(0), private
	declare pending_work_person_cnt = i4 with noconstant(0), private
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)

	for(type_index = 1 to TYPE_CNT)
		if (validate(query_arguments->pending_work[type_index].pending_work_type) = 0)
			call replyFailure("pending_work_type not set")
		endif
		case(query_arguments->pending_work[type_index].pending_work_type)
			of "PENDING_ACTIONS":
				set pending_work_person_cnt = pending_work_person_cnt + FilterPendingActions(NULL)
			of "PENDING_PHONE_CALLS":
				set pending_work_person_cnt = pending_work_person_cnt + FilterPendingCalls(NULL)
		endcase
	endfor

	set stat = alterlist(patientlist->patients, pending_work_person_cnt)
	call log_message(build2("Exit FilterPendingWork(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ", "FilterPendingWork found ", pending_work_person_cnt), LOG_LEVEL_DEBUG)
end

/**
 * Subroutine that handles filtering the patient list by patients who have pending actions/todos
 * for the current user.
 * @return the number of patients that qualified for pending actions.
 */
subroutine FilterPendingActions(NULL)
	call log_message("Begin FilterPendingActions()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare NOTE_TYPE_CODESET = i4 with constant(14122), protect
	declare TODO_TYPE_CD = f8 with constant(uar_get_code_by("MEANING",NOTE_TYPE_CODESET,"RWLTODO")), protect
	declare pending_actions_person_cnt = i4 with noconstant(0), protect
	declare CURRENT_PERSONNEL_ID = f8 with constant(reqinfo->updt_id), protect
	declare current_patient_list_person_cnt = i4 with noconstant(size(patientlist->patients, 5)), protect
	select distinct into "nl:" s.parent_entity_id
	from
		sticky_note s
	where 
		expand(idx,1,size(queryPatientlist->patients, 5),s.parent_entity_id,
			queryPatientlist->patients[idx].person_id) and
		s.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3) and
		s.end_effective_dt_tm > cnvtdatetime(curdate, curtime3) and
		s.sticky_note_type_cd = TODO_TYPE_CD and
		s.parent_entity_name = 'PERSON' and 
		s.updt_id = CURRENT_PERSONNEL_ID
	detail
		current_patient_list_person_cnt = current_patient_list_person_cnt + 1
		pending_actions_person_cnt = pending_actions_person_cnt + 1
		if(current_patient_list_person_cnt >= size(patientlist->patients, 5))
			stat = alterlist (patientlist->patients, current_patient_list_person_cnt + 49)
		endif
		patientlist->patients[current_patient_list_person_cnt].person_id = s.parent_entity_id
	foot report
		stat = alterlist (patientlist->patients, current_patient_list_person_cnt)
	with nocounter, expand = 1
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "FilterPendingCalls"
		call replyFailure("SELECT")
	endif
	call log_message(build2("Exit FilterPendingActions(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterPendingActions found ", pending_actions_person_cnt), LOG_LEVEL_DEBUG)
	return (pending_actions_person_cnt)
end

/**
 * Subroutine that handles filtering the patient list by patients who have pending phone calls.
 * @return the number of patients that qualified for pending phone calls.
 */
subroutine FilterPendingCalls(NULL)
	call log_message("Begin FilterPendingCalls()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare GEN_COMM_STATUS_CODESET = i4 with constant(4116002), protect
	declare CREATED_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"CREATED")), protect
	declare pending_calls_person_cnt = i4 with noconstant(0), protect
	declare current_patient_list_person_cnt = i4 with noconstant(size(patientlist->patients, 5)), protect
	select distinct into "nl:" c.person_id
	from
		dcp_mp_pl_comm_patient c
	where 
		expand(idx,1,size(queryPatientlist->patients, 5),c.person_id,
			queryPatientlist->patients[idx].person_id) and
		c.active_ind = 1 and
		c.comm_type_flag = 0 and ; 0 for phone call type
		c.comm_status_cd = CREATED_CD
	detail
		current_patient_list_person_cnt = current_patient_list_person_cnt + 1
		pending_calls_person_cnt = pending_calls_person_cnt + 1
		if(current_patient_list_person_cnt >= size(patientlist->patients, 5))
			stat = alterlist (patientlist->patients, current_patient_list_person_cnt + 49)
		endif
		patientlist->patients[current_patient_list_person_cnt].person_id = c.person_id
	foot report
		stat = alterlist (patientlist->patients, current_patient_list_person_cnt)
	with nocounter, expand = 1
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "FilterPendingCalls"
		call replyFailure("SELECT")
	endif
	call log_message(build2("Exit FilterPendingCalls(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterPendingCalls found ", pending_calls_person_cnt), LOG_LEVEL_DEBUG)
	return (pending_calls_person_cnt)
end

subroutine FilterCaseManager(NULL)
	call log_message("Begin FilterCaseManager()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
 	call echo("Filter Case Manager")
	declare person_cnt = i4 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
 	set person_cnt = 0
 
	select into "nl:"
	from (dummyt d1 with seq = value(loop_cnt)),
		 person_prsnl_reltn ppr
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join ppr where
		expand(idx,nstart,nstart+(batch_size-1),ppr.person_id, queryPatientlist->patients[idx].person_id) and
		expand(idx2,1,size(query_arguments->case_manager, 5), \
		  ppr.prsnl_person_id, query_arguments->case_manager[idx2].case_manager_id) and
		expand(idx3,1,size(bedrock_prefs->case_mgr, 5),ppr.person_prsnl_r_cd, bedrock_prefs->case_mgr[idx3].case_mgr_cd) and
		ppr.active_ind = 1 and
		ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by ppr.person_id
 
	head report
		person_cnt = 0
	head ppr.person_id
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = ppr.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterCaseManager"
       call replyFailure("SELECT")
    endif
 
    ;We now have the current qualifying patients in patientlist we need to compare that to master list
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_CASEMANAGER)
 
    endif
 
	call log_message(build2("Exit FilterCaseManager(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterCaseManager found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
;If modified, may need tomodify DeltaCheckHealthPlan
subroutine FilterHealthPlan(NULL)
	call log_message("Begin FilterHealthPlan()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
 	call echo("Filter Health Plan")
	declare person_cnt = i4 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
	set hp_type_size = size(query_arguments->hp_type, 5)
	set financial_classes_size = size(query_arguments->hp_financial_class, 5)
 
	set person_cnt = 0
 
	select into 'nl:'
	from (dummyt d1 with seq = value(loop_cnt)),
	     person_plan_reltn phr,
		 health_plan hp
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join phr where
		expand(idx,nstart,nstart+(batch_size-1),phr.person_id, queryPatientlist->patients[idx].person_id) and
		phr.active_ind = 1 and
		phr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		phr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join hp where
		hp.health_plan_id = phr.health_plan_id and
        (hp_type_size = 0 or
		  expand(idx2,1,hp_type_size,hp.plan_type_cd, query_arguments->hp_type[idx2].hp_type_cd)) and
		(financial_classes_size = 0 or
		  expand(idx3,1,financial_classes_size,hp.financial_class_cd, \
			query_arguments->hp_financial_class[idx3].hp_financial_class_cd)) and
		hp.active_ind = 1
 
	order by phr.person_id
 
	head report
		person_cnt = 0
	head phr.person_id
 
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = phr.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter
 
	call echo(build2("List size after HEALTH_PLAN query: ", size(patientlist->patients, 5)))
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterHealthPlan"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit FilterHealthPlan(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterHealthPlan found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
;If modified, may need to modify FilterHealthPlan
;Determines the delta factors for Health Plan
subroutine DeltaCheckHealthPlan(NULL)
	call log_message("Begin DeltaCheckHealthPlan()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
 
	set hp_type_size = size(query_arguments->hp_type, 5)
	set financial_classes_size = size(query_arguments->hp_financial_class, 5)
 
	set person_cnt = 0
 
	if(hp_type_size > 0)
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
		set idx = 0
		set idx2 = 0
 
		select into 'nl:'
		from (dummyt d1 with seq = value(loop_cnt)),
		     person_plan_reltn phr,
			 health_plan hp
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join phr where
			expand(idx,nstart,nstart+(batch_size-1),phr.person_id, queryPatientlist->patients[idx].person_id) and
			phr.active_ind = 1 and
			phr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
			phr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		join hp where
			hp.health_plan_id = phr.health_plan_id and
	        expand(idx2,1,hp_type_size,hp.plan_type_cd, query_arguments->hp_type[idx2].hp_type_cd) and
			hp.active_ind = 1
 
		order by phr.person_id
 
		head report
			person_cnt = 0
		head phr.person_id
 
			person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = phr.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter
 
		call DeltaCheck(ARGNAME_HEALTHPLAN)
 
	endif
 
	if(financial_classes_size)
 
		call PrepQueryPatientList(default_batch_size)
		set stat = initrec(patientlist)
		set idx = 0
		set idx2 = 0
 
 
		select into 'nl:'
		from (dummyt d1 with seq = value(loop_cnt)),
		     person_plan_reltn phr,
			 health_plan hp
		plan d1 where
			initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
		join phr where
			expand(idx,nstart,nstart+(batch_size-1),phr.person_id, queryPatientlist->patients[idx].person_id) and
			phr.active_ind = 1 and
			phr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
			phr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		join hp where
			hp.health_plan_id = phr.health_plan_id and
			expand(idx2,1,financial_classes_size,hp.financial_class_cd, query_arguments->hp_financial_class[idx2].
			hp_financial_class_cd) and
			hp.active_ind = 1
 
		order by phr.person_id
 
		head report
			person_cnt = 0
		head phr.person_id
 
			person_cnt = person_cnt + 1
			if(mod(person_cnt,50) = 1)
				stat = alterlist (patientlist->patients, person_cnt + 49)
			endif
 
			patientlist->patients[person_cnt].person_id = phr.person_id
 
		foot report
			stat = alterlist(patientlist->patients, person_cnt)
 
		with nocounter
 
		call DeltaCheck(ARGNAME_FINANCIALCLASS)
 
	endif
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "DeltaCheckHealthPlan"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit DeltaCheckHealthPlan(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","DeltaCheckHealthPlan found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine FilterRegistry(NULL)
	call log_message("Begin FilterRegistry()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare idxClass = i4 with noconstant(0)
	declare person_cnt = i4 with noconstant(0)
 
	set registryCnt = size(query_arguments->registries,5)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
	select into "nl:"
	from (dummyt d1 with seq = value(loop_cnt)),
		 ac_class_person_reltn a
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join a where
		expand(idx,nstart,nstart+(batch_size-1),a.person_id, queryPatientlist->patients[idx].person_id) and
		expand(idxClass, 1, registryCnt, a.ac_class_def_id, query_arguments->registries[idxClass].class_def_id) and
		a.person_id > 0 and
    	a.active_ind = 1 and
    	a.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by a.person_id
 
	head report
		person_cnt = 0
	head a.person_id
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = a.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterRegistry"
       call replyFailure("SELECT")
    endif
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_REGISTRY)
 
    endif
 
	call log_message(build2("Exit FilterRegistry(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterRegistry found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine FilterAssocProviders(NULL)
	call log_message("Begin FilterAssocProviders()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
 
    call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
 	set person_cnt = 0
 
    select into "nl:"
    from (dummyt d1 with seq = value(loop_cnt)),
		 person_prsnl_reltn ppr
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join ppr where
    	expand(idx,nstart,nstart+(batch_size-1),ppr.person_id, queryPatientlist->patients[idx].person_id) and
		expand(idx2,1,size(query_arguments->assoc_providers->prsnl_ids, 5), \
		  ppr.prsnl_person_id, query_arguments->assoc_providers->prsnl_ids[idx2].prsnl_id) and
		expand(idx3,1,size(query_arguments->assoc_providers->reltn_ids, 5), \
		  ppr.person_prsnl_r_cd, query_arguments->assoc_providers->reltn_ids[idx3].reltn_id) and
    	ppr.active_ind = 1 and
		ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by ppr.person_id
 
    head report
		person_cnt = 0
	head ppr.person_id
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = ppr.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_ASSOCPROVIDERS)
 
    endif
 
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterAssocProviders"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit FilterAssocProviders(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterAssocProviders found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
 
subroutine FilterAppointments(NULL)
	call log_message("Begin FilterAppointments()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(cnvtlower(query_arguments->appointments->no_appt) = "true")
		call FilterNoAppointments(NULL)
	else
		call FilterYesAppointments(NULL)
	endif
	
	call log_message(build2("Exit FilterAppointments(), Elapsed time:",
	 cnvtint(curtime3-BEGIN_TIME), "0 ms  "), LOG_LEVEL_DEBUG)
end

subroutine FilterYesAppointments (NULL)
	call log_message("Begin FilterYesAppointments()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 	declare ROLE_CD = f8 with noconstant(0), protect
	declare person_cnt = i4 with noconstant(0)
    declare apptCount = i4 with noconstant(0)
	declare parse = vc with noconstant("")
 
    call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
 	;Try to first get the code based on the meaning
	set ROLE_CD = uar_get_code_by("MEANING", 14250, "PATIENT")
 
 	;If that fails or it has multiples, get by display key.
 	if(ROLE_CD <= 0)
 		set ROLE_CD = uar_get_code_by("DISPLAYKEY", 14250, "PATIENT")
 	endif
 
 	;If that fails get the first one by cdf_meaning
 	if(ROLE_CD <= 0)
 		set stat = uar_get_meaning_by_codeset(14250, "PATIENT", 1, ROLE_CD)
 	endif
 
 	;If that fails log a message
 	if(ROLE_CD <= 0)
		call log_message("FilterYesAppointments() failed to get role code", LOG_LEVEL_WARNING)
 	endif

 	set apptCount = size(query_arguments->appointments->status, 5)

	select distinct into "nl:" sa.person_id
	from
		sch_appt sa
	where
		expand(idx,nstart,size(queryPatientlist->patients, 5),sa.person_id, queryPatientlist->patients[idx].person_id)
		and sa.beg_dt_tm between
			;Use curdate, 0 so that it will look back to the beginning of the day. So if the value is 5 days
			; it will look 5 days in the past, but start at the start of the day so the whole day is included
			; and the start of the day isn't excluded
			cnvtlookbehind(build2(query_arguments->appointments->range_back_value, ",",
				query_arguments->appointments->range_unit), cnvtdatetime(curdate, 0))
			;Use curdate, 235959 so that it will look forward to the end of the day. So if the value is 5 days
			; it will look 5 days in the future, but end at the end of the day so the whole day is included
			; and the end of the day isn't excluded
			and cnvtlookahead(build2(query_arguments->appointments->range_forward_value, ",",
				query_arguments->appointments->range_unit), cnvtdatetime(curdate, 235959))
		and sa.sch_role_cd = ROLE_CD
		and expand(idx2,1,apptCount,sa.sch_state_cd,query_arguments->appointments->status[idx2].status_cd)
		and sa.active_ind = 1
    head report
		person_cnt = 0
	detail
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
		patientlist->patients[person_cnt].person_id = sa.person_id
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
	with nocounter, expand = 1
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
	   set failed = 1
		set fail_operation = "FilterYesAppointments"
	   call replyFailure("SELECT")
    endif
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
    	call DeltaCheck(ARGNAME_APPTSTATUS)
	endif
 
	call log_message(build2("Exit FilterYesAppointments(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterYesAppointments found ", person_cnt), LOG_LEVEL_DEBUG)
end

subroutine FilterNoAppointments (NULL)
	call log_message("Begin FilterNoAppointments()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare person_cnt = i4 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)

	select distinct into "nl:" p.person_id
	from
		person p
	where
		expand(idx,nstart,size(queryPatientlist->patients,5),p.person_id, queryPatientlist->patients[idx].person_id)
		and p.person_id NOT IN (
			select sa.person_id from sch_appt sa where sa.person_id = p.person_id 
			and sa.beg_dt_tm between
				;Use curdate, 0 so that it will look back to the beginning of the day. So if the value is 5 days
				; it will look 5 days in the past, but start at the start of the day so the whole day is included
				; and the start of the day isn't excluded
				cnvtlookbehind(build2(query_arguments->appointments->range_back_value, ",",
				query_arguments->appointments->range_unit), cnvtdatetime(curdate, 0))
				;Use curdate, 235959 so that it will look forward to the end of the day. So if the value is 5 days
				; it will look 5 days in the future, but end at the end of the day so the whole day is included
				; and the end of the day isn't excluded
				and cnvtlookahead(build2(query_arguments->appointments->range_forward_value, ",",
				query_arguments->appointments->range_unit), cnvtdatetime(curdate, 235959))
			and sa.active_ind = 1)
	head report
		person_cnt = 0
	detail
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
		patientlist->patients[person_cnt].person_id = p.person_id
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
	with nocounter, expand = 1
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "FilterNoAppointments"
		call replyFailure("SELECT")
    endif
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
		call DeltaCheck(ARGNAME_APPTSTATUS)
	endif
 
	call log_message(build2("Exit FilterNoAppointments(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterNoAppointments found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
 
subroutine RetrieveEncntrTypeCdsFromBedrock(NULL)
	call log_message("Begin RetrieveEncntrTypeCdsFromBedrock()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare encntr_type_cnt = i4 with noconstant(0)
    declare pos_flex_id = f8 with noconstant(0.0)
    declare system_flex_id = f8 with noconstant(0.0)
    declare flex_id_inpt  = f8 with noconstant(0.0)
    declare flex_id_outpt = f8 with noconstant(0.0)
    declare flex_id_ed    = f8 with noconstant(0.0)
    declare flex_id_grp1  = f8 with noconstant(0.0)
    declare flex_id_grp2  = f8 with noconstant(0.0)
    
    set pos_flex_id = GetFlexId(listrequest->pos_cd)
    set system_flex_id = GetFlexId(0.0)
    set dwl_category_id = GetCategoryId(DWL_CATEGORY_MEAN)
    
 
	 ;if nothing exists add "INPT_ENC_TYPE","OUTPT_ENC_TYPE","ED_ENC_TYPE"
  	if(size(query_arguments->encounter_grp, 5) <= 0)
 		set stat = alterlist (query_arguments->encounter_grp, 3)
 		set query_arguments->encounter_grp[1].encounter_grp = "INPT_ENC_TYPE"
 		set query_arguments->encounter_grp[2].encounter_grp = "OUTPT_ENC_TYPE"
 		set query_arguments->encounter_grp[3].encounter_grp = "ED_ENC_TYPE"
 	endif
 	declare encgrpcnt = i4 with noconstant(0)
 	set idx = 0
 	set nstart = 1
 
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and expand(idx,1,size(query_arguments->encounter_grp, 5),bf.filter_mean, query_arguments->encounter_grp[idx].encounter_grp)
		;and bf.filter_mean in ("INPT_ENC_TYPE","OUTPT_ENC_TYPE","ED_ENC_TYPE")
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.parent_entity_name = "CODE_VALUE"
		and bv.parent_entity_id > 0
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc, bf.filter_mean
 
	head report
		encntr_type_cnt = 0
 
	detail
 		if(bv.br_datamart_flex_id = pos_flex_id)
 			if(bf.filter_mean = "INPT_ENC_TYPE" and flex_id_inpt = system_flex_id)
				flex_id_inpt = pos_flex_id
			elseif(bf.filter_mean = "OUTPT_ENC_TYPE" and flex_id_outpt = system_flex_id)
				flex_id_outpt = pos_flex_id
			elseif(bf.filter_mean = "ED_ENC_TYPE" and flex_id_ed = system_flex_id)
				flex_id_ed = pos_flex_id
			elseif(bf.filter_mean = "GROUP1_ENC_TYPE" and flex_id_grp1 = system_flex_id)
				flex_id_grp1 = pos_flex_id
			elseif(bf.filter_mean = "GROUP2_ENC_TYPE" and flex_id_grp2 = system_flex_id)
				flex_id_grp2 = pos_flex_id
			endif
		endif
		if( (bf.filter_mean = "INPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_inpt)	or
			(bf.filter_mean = "OUTPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_outpt)	or
			(bf.filter_mean = "ED_ENC_TYPE"		and bv.br_datamart_flex_id = flex_id_ed)	or
			(bf.filter_mean = "GROUP1_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_grp1)	or
 			(bf.filter_mean = "GROUP2_ENC_TYPE" and bv.br_datamart_flex_id = flex_id_grp2)
 		)
 			if(bv.parent_entity_id > 0)
				encntr_type_cnt = encntr_type_cnt + 1
				if (mod(encntr_type_cnt, 10) = 1)
					stat = alterlist(bedrock_prefs->encntr_types,encntr_type_cnt+9)
				endif
				bedrock_prefs->encntr_types[encntr_type_cnt].encntr_type_cd = bv.parent_entity_id
			endif
 		endif
		
 
	foot report
			stat = alterlist (bedrock_prefs->encntr_types, encntr_type_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveEncntrFromBedrock"
       call replyFailure("SELECT")
    endif
 
	if(size(bedrock_prefs->encntr_types, 5) <= 0)
		/*select into "nl:"
 		from code_value c
 		where c.code_set = 71 and c.cdf_meaning in ("INPATIENT", "OUTPATIENT", "EMERGENCY") and c.active_ind = 1
 		detail
 			stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 			bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = c.code_value
 		with nocounter
 		*/
 		if(size(query_arguments->encounter_grp, 5) <= 0)
			;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "INPATIENT")
			SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3958")
 			SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 			SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 
 			;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "OUTPATIENT")
 			SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3959")
 			SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 			SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 
 			;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "EMERGENCY")
 			SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3957")
 			SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 			SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 		else
 			set encgrpcnt = 1
 
 			for(encgrpcnt = 1 to size(query_arguments->encounter_grp,5))
   				if(query_arguments->encounter_grp[encgrpcnt].encounter_grp = "INPT_ENC_TYPE")
 						;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "INPATIENT")
 						SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3958")
 						SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 						SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 				endif
 				if(query_arguments->encounter_grp[encgrpcnt].encounter_grp = "OUTPT_ENC_TYPE")
 						;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "OUTPATIENT")
 						SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3959")
 						SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 						SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 				endif
 				if(query_arguments->encounter_grp[encgrpcnt].encounter_grp = "ED_ENC_TYPE")
 						;SET encounter_type_cd = uar_get_code_by( "DISPLAYKEY", 71, "EMERGENCY")
 						SET encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3957")
 						SET stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 						SET bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = encounter_type_cd
 				endif
 			endfor
 		endif
	endif
 
	call log_message(build2("Exit RetrieveEncntrTypeCdsFromBedrock(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","RetrieveEncntrTypeCdsFromBedrock found ", encntr_type_cnt
     ), LOG_LEVEL_DEBUG)
end
 
; Get selected individual encounters from query args and add them to bedrock_prefs
subroutine GetIndividualEncounterTypes(NULL)
	call log_message("Begin GetIndividualEncounterTypes()", LOG_LEVEL_DEBUG)
 
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare encntr_cnt = i4 with noconstant(0), private
    declare encntr_types_cnt = i4 with noconstant(0), private
 	declare eCount = i4 with noconstant(0), private
 
    set encntr_cnt = size(query_arguments->individual_encounters, 5)
    set encntr_types_cnt = size(bedrock_prefs->encntr_types, 5)
 
	; alter the encntr_types array size to add individual encounters
	SET stat = alterlist(bedrock_prefs->encntr_types, encntr_types_cnt+encntr_cnt)
 
    ; loop through each individual encounter and add it to encntr_types array
    for(eCount = 1 to encntr_cnt)
		SET bedrock_prefs->encntr_types[encntr_types_cnt+eCount].encntr_type_cd = query_arguments->individual_encounters[eCount].
		encounter_type_cd
    endfor
 
	call log_message(build2("Exit GetIndividualEncounterTypes(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","GetIndividualEncounterTypes found ", encntr_cnt
     ), LOG_LEVEL_DEBUG)
end
 
subroutine BuildEncounterJoin(NULL)
 
	set encntr_parser =
	" expand(idx,nstart,size(queryPatientlist->patients, 5),e.person_id, queryPatientlist->patients[idx].person_id) "
 
 
	if(query_arguments->admission_begin_dt_tm > 0)
 
		set encntr_parser = concat(encntr_parser, " and e.reg_dt_tm >= cnvtdatetime(query_arguments->admission_begin_dt_tm) \
			and e.reg_dt_tm <= cnvtdatetime(curdate,235959) ")
 
	endif
 
 
	if(query_arguments->discharge_dt_tm > 0)
 
		set encntr_parser = concat(encntr_parser, " and e.disch_dt_tm >= cnvtdatetime(query_arguments->discharge_dt_tm) \
			and e.disch_dt_tm <= cnvtdatetime(curdate,235959) ")
 
	elseif (query_arguments->admission_begin_dt_tm = 0)
 
 		set encntr_parser = concat(encntr_parser, " and ( ")
		set encntr_parser = concat(encntr_parser, " (e.reg_dt_tm >= DATETIMEADD(cnvtdatetime(curdate,curtime3),-lookBackMaxDays) \
			and e.reg_dt_tm <= cnvtdatetime(curdate,235959)) ")
		set encntr_parser = concat(encntr_parser, " or ((e.disch_dt_tm >= DATETIMEADD(cnvtdatetime(curdate,curtime3),-\
			lookBackMaxDays) and e.disch_dt_tm <= cnvtdatetime(curdate,235959)) or e.disch_dt_tm = NULL) )")
 
	endif
 
 
	if(size(query_arguments->individual_encounters,5) > 0 or size(query_arguments->encounter_grp,5) > 0)
 
		set encntr_parser = concat(encntr_parser, " and expand(idx2,1,size(bedrock_prefs->encntr_types, 5),e.encntr_type_cd, \
			bedrock_prefs->encntr_types[idx2].encntr_type_cd) ")
 
	endif
 
	;call echo(encntr_parser)
 
end
 
;If modified, may need to modify DeltaCheckEncounterDate
subroutine FilterEncounterDate(NULL)
	call log_message("Begin FilterEncounterDate()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
	set idx = 0
	set idx2 = 0
	set idx3 = 0
 
	call BuildEncounterJoin(NULL)
 
	;call echo(encntr_parser)
 
select if(size(query_arguments->case_status, 5) = 0)
	into 'nl:'
	from encounter e
	plan e  where parser(encntr_parser)
		and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and e.active_ind = 1
 
else
 
	into 'nl:'
	from encounter e,
		 encntr_cmnty_case ecc
	plan e  where parser(encntr_parser)
		and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and e.active_ind = 1
	join ecc where e.encntr_id = ecc.encntr_id
		and expand(idx3,1,size(query_arguments->case_status, 5), ecc.case_status_cd, query_arguments->case_status[idx3].case_status_cd)
		and ecc.active_ind = 1
 
endif
 
order by e.person_id
 
	head report
		person_cnt = 0
	head e.person_id
 
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = e.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
with nocounter, expand=1
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterEncounterDate"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit FilterEncounterDate(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterEncounterDate found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
 
;If modified, may need to modify FilterEncounterDate
subroutine DeltaCheckEncounterDate(NULL)
	call log_message("Begin DeltaCheckEncounterDate()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
 
	call BuildEncounterJoin(NULL)
	call echorecord(bedrock_prefs)
 
    ;Need to reset patientlist so we know what patients don't qualify for the specific filter
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
	set idx = 0
	set idx2 = 0
	set idx3 = 0
 
	;call echo(encntr_parser)
 
  	 select if(size(query_arguments->case_status, 5) = 0)
		into 'nl:'
		from encounter e
		plan e  where parser(encntr_parser)
			and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and e.active_ind = 1
 
	else
 
		into 'nl:'
		from encounter e,
			 encntr_cmnty_case ecc
        ; return all the encounters with selected encounter_type_cd
		plan e where parser(encntr_parser)
			and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and e.active_ind = 1
	    ; return all the encounters with selected case status
		join ecc where e.encntr_id = ecc.encntr_id
			and expand(idx3,1,size(query_arguments->case_status, 5),ecc.case_status_cd,query_arguments->case_status[idx3].case_status_cd)
			and ecc.active_ind = 1
 
	endif
 
	order by e.person_id
 
  	head report
		person_cnt = 0
	head e.person_id
		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
		patientlist->patients[person_cnt].person_id = e.person_id
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter, expand=1

	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "DeltaCheckEncounterDate"
		call replyFailure("SELECT")
	endif

	if(query_arguments->admission_begin_dt_tm > 0		; Admission
		or query_arguments->discharge_dt_tm > 0			; Discharge
		or (size(query_arguments->individual_encounters,5) > 0 or size(query_arguments->encounter_grp,5) > 0) ; Encounter Type
		or size(query_arguments->case_status, 5) > 0	; Case Status
	)
		call DeltaCheck(ARGNAME_ENCOUNTER)
	endif

	call log_message(build2("Exit DeltaCheckEncounterDate(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","DeltaCheckEncounterDate found ", person_cnt), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine FilterOrders(NULL)
	call log_message("Begin FilterOrders()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare person_cnt = i4 with noconstant(0)
    declare orderStatusCount = i4 with noconstant(0)
    declare orderTypeCount = i4 with noconstant(0)
 
    call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
 	set orderStatusCount = size(query_arguments->orders->status, 5)
 	set orderTypeCount = size(query_arguments->orders->type, 5)
	select into "nl:"
	from (dummyt d1 with seq = value(loop_cnt)),
		 orders o
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join o where
		expand(idx,nstart,nstart+(batch_size-1),o.person_id, queryPatientlist->patients[idx].person_id) and
		;Use curdate, 0 so that it will look back to the beginning of the day. So if the value is 5 days
		; it will look 5 days in the past, but start at the start of the day so the whole day is included
		; and the start of the day isn't excluded
		o.current_start_dt_tm >= cnvtlookbehind(build2(query_arguments->orders->range_back_value, ",",
			query_arguments->orders->range_unit), cnvtdatetime(curdate, 0)) and
		;Use curdate, 235959 so that it will look forward to the end of the day. So if the value is 5 days
		; it will look 5 days in the future, but end at the end of the day so the whole day is included
		; and the end of the day isn't excluded
		o.current_start_dt_tm <= cnvtlookahead(build2(query_arguments->orders->range_forward_value, ",",
			query_arguments->orders->range_unit), cnvtdatetime(curdate, 235959)) and
		expand(idx2,1,orderStatusCount,o.order_status_cd,query_arguments->orders->status[idx2].status_cd) and
		expand(idx3,1,orderTypeCount,o.catalog_type_cd,query_arguments->orders->type[idx3].type_cd) and
		o.active_ind = 1
    order by o.person_id
 
    head report
		person_cnt = 0
	head o.person_id
 		person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (patientlist->patients, person_cnt + 49)
		endif
 
		patientlist->patients[person_cnt].person_id = o.person_id
 
	foot report
		stat = alterlist(patientlist->patients, person_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterOrders"
       call replyFailure("SELECT")
    endif
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_ORDERSSTATUS)
 
    endif
 
 
	call log_message(build2("Exit FilterOrders(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterOrders found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
 
subroutine FilterExpectations(NULL)
	call log_message("Begin FilterExpectations()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
    declare curDateUTC = dq8 with constant(datetimetrunc(cnvtdatetimeutc(BEGIN_DATE_TIME,3),"DD"))
	declare person_cnt = i4 with noconstant(0)
	declare expectCount = i4 with noconstant(0)
	declare bCheckDue = i2 with noconstant(0)
	declare bCheckNeardue = i2 with noconstant(0)
	declare bCheckOverdue = i2 with noconstant(0)
	declare bCheckNotDue = i2 with noconstant(0)
 
	call PrepQueryPatientList(default_batch_size)
	set stat = initrec(patientlist)
 
	set expectCount = size(query_arguments->expectations->expectations, 5)
 
	select into "nl:"
	from (dummyt d1 with seq = value(loop_cnt)),
		 hm_recommendation r
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join r where
		expand(idx,nstart,nstart+(batch_size-1),r.person_id, queryPatientlist->patients[idx].person_id) and
		expand(idx2,1,expectCount,r.expect_id,query_arguments->expectations->expectations[idx2].expect_id) and
		r.status_flag in (1,2,3,8) ;1=Pending, 2=Postponed, 3=Refused, 8=Satisfied Pending
    order by r.person_id
	head report
		for(cnt=0 to size(query_arguments->expectations->recommendations,5))
			case(query_arguments->expectations->recommendations[cnt].due_arg)
				of ARGVAL_OVERDUE:
					bCheckOverdue = 1
				of ARGVAL_DUE:
					bCheckDue = 1
				of ARGVAL_NEARDUE:
					bCheckNeardue = 1
				of ARGVAL_NOTDUE:
					bCheckNotDue = 1
			endcase
		endfor
	head r.person_id
	stat = alterlist (patientlist->patients, person_cnt + 50)
	   detail
		if((bCheckOverdue and ((nullind(r.overdue_dt_tm) = 0 and
				curDateUTC >= datetimetrunc(r.overdue_dt_tm,"DD")) or
				(nullind(r.overdue_dt_tm) = 1 and nullind(r.due_dt_tm) = 0 and
				curDateUTC >= datetimetrunc(r.due_dt_tm,"DD"))))
			or (bCheckDue and (nullind(r.due_dt_tm) = 1 or ; if due date is null, then it is considered due
				curDateUTC >= datetimetrunc(r.due_dt_tm,"DD") and curDateUTC < datetimetrunc(r.overdue_dt_tm,"DD")))
			or (bCheckNeardue and nullind(r.near_due_dt_tm) = 0 and
				curDateUTC >= datetimetrunc(r.near_due_dt_tm,"DD") and curDateUTC < datetimetrunc(r.due_dt_tm,"DD"))
			or (bCheckNotDue and ((nullind(r.near_due_dt_tm) = 0 and
				curDateUTC < datetimetrunc(r.near_due_dt_tm,"DD")) or
				(nullind(r.near_due_dt_tm) = 1 and nullind(r.due_dt_tm) = 0 and
				curDateUTC < datetimetrunc(r.due_dt_tm,"DD")))))
 
			patientIndex = locatevalsort(num,1,person_cnt,r.person_id,patientlist->patients[num].person_id)
			if(patientIndex <= 0)
				
				person_cnt = person_cnt + 1
				if(mod(person_cnt,50) = 1)
					stat = alterlist (patientlist->patients, person_cnt + 49)
		 		endif
		    	patientlist->patients[person_cnt].person_id = r.person_id
			 endif
		endif
	foot report
		stat = alterlist (patientlist->patients, person_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "FilterExpectations"
       call replyFailure("SELECT")
    endif
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
    	call DeltaCheck(ARGNAME_EXPECTATIONS)
 
    endif
 
	call log_message(build2("Exit FilterExpectations(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","FilterExpectations found ", person_cnt), LOG_LEVEL_DEBUG)
end
 
;Loads conditions tied to registries that were imported.
subroutine GetPatientsWithRegistryConditions(NULL)
	call log_message("Begin GetPatientsWithRegistryConditions()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare idxClass = i4 with noconstant(0)
	set loop_cnt = 0
	declare person_cnt = i4 with noconstant(0)
	declare class_cnt = i4 with noconstant(0)
	declare person_index = i4 with noconstant(0)
	declare findIndex = i4 with noconstant(0)
 
	set conditionCnt = size(query_arguments->conditions,5)
	call PrepQueryPatientList(default_batch_size)
 
	;select into "nl:"
	select distinct a.person_id, a.ac_class_def_id
	from (dummyt d1 with seq = value(loop_cnt)),
		 ac_class_person_reltn a
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join a where
		expand(idx,nstart,nstart+(batch_size-1),a.person_id, queryPatientlist->patients[idx].person_id) and
		expand(idxClass, 1, conditionCnt, a.ac_class_def_id, query_arguments->conditions[idxClass].class_def_id) and
		a.person_id > 0 and
    	a.active_ind = 1 and
    	a.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by a.person_id, a.ac_class_def_id
 
	head a.person_id
		class_cnt = 0
    	person_cnt = person_cnt + 1
		if(mod(person_cnt,50) = 1)
			stat = alterlist (registry_conditions->patients, person_cnt + 49)
		endif
 
		registry_conditions->patients[person_cnt].person_id = a.person_id
 
	detail
		class_cnt = class_cnt + 1
		if(mod(class_cnt,5) = 1)
			stat = alterlist (registry_conditions->patients[person_cnt].conditions, class_cnt + 4)
		endif
		registry_conditions->patients[person_cnt].conditions[class_cnt].class_id = a.ac_class_def_id
		registry_conditions->patients[person_cnt].conditions[class_cnt].arg_index = \
			locateval(findIndex, 1, conditionCnt, a.ac_class_def_id, query_arguments->conditions[findIndex].class_def_id)
 
	foot a.person_id
		stat = alterlist (registry_conditions->patients[person_cnt].conditions, class_cnt)
 
	foot report
		stat = alterlist(registry_conditions->patients, person_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "GetRegistryConditions"
       call replyFailure("SELECT")
    endif
 
 
    ;if there are NO condition consequents to query for, apply this to the patient list - the condition query is over
    ;if there ARE consequents to query for, continue and let the Health Exerpt Server complete this
 
    if(total_consequent_cnt = 0)
		set stat = initrec(patientlist)
		set stat = alterlist(patientlist->patients, person_cnt)
		for(person_index = 1 to person_cnt)
			if(query_arguments->condition_operator = "AND");if using AND logic, only add if all conditions found
				if(size(registry_conditions->patients[person_index].conditions,5) = conditionCnt)
					set patientlist->patients[person_index].person_id = registry_conditions->patients[person_index].person_id
				endif
			else
				set patientlist->patients[person_index].person_id = registry_conditions->patients[person_index].person_id
			endif
		endfor
 
		;need to do the delta check here for conditions only if there are no condition consequents
		if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
    		call DeltaCheck(ARGNAME_CONDITION)
    	endif
	endif
 
 
 
	;call echorecord(registry_conditions)
	call log_message(build2("Exit GetPatientsWithRegistryConditions(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms  ","GetPatientsWithRegistryConditions found ", person_cnt),
     LOG_LEVEL_DEBUG)
 
end
 
 
;Puts the consequents for meds, conditions, and results into a single structure that can be
;easily parsed and have its operators applied.
subroutine BuildRuleOperators(NULL)
	call log_message("Begin BuildRuleOperators()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare queryArgCounter = i4 with noconstant(0)
	declare groupCnt = i4 with noconstant(0)
	declare conditionsCnt = i4 with constant(size(query_arguments->conditions, 5))
	declare resultCnt = i4 with constant(size(query_arguments->results, 5))
	declare medCnt = i4 with constant(size(query_arguments->meds, 5))
	declare findIndex = i4 with noconstant(0)
 
	;max size is 7: 5 result groups + meds + conditions
	set stat = alterlist(rule_operations->group, 7)
 
	if(conditionsCnt > 0)
		set groupCnt = groupCnt + 1
		set stat = alterlist(rule_operations->group[groupCnt].consequents, conditionsCnt)
		;only conditions have alt qualify list - can qualify from registries too
		set rule_operations->group[groupCnt].alt_qualifier_list = "CONDITION"
		set rule_operations->group[groupCnt].name = "CONDITION"
		set rule_operations->group[groupCnt].operator = query_arguments->condition_operator
 
		for(queryArgCounter = 1 to conditionsCnt)
			set rule_operations->group[groupCnt].consequents[queryArgCounter].name = build2("CONDITION", queryArgCounter)
		endfor
	endif
 
	if(medCnt > 0)
		set groupCnt = groupCnt + 1
		set stat = alterlist(rule_operations->group[groupCnt].consequents, medCnt)
		set rule_operations->group[groupCnt].name = "MEDICATIONS"
 
		for(queryArgCounter = 1 to medCnt)
			if(size(query_arguments->meds[queryArgCounter].operator) > 0)
				set rule_operations->group[groupCnt].operator = query_arguments->meds[queryArgCounter].operator
			endif
			set rule_operations->group[groupCnt].consequents[queryArgCounter].name = build2("MEDICATION", queryArgCounter)
		endfor
	endif
 
	for(queryArgCounter = 1 to resultCnt)
		set groupPos =locateval(findIndex, 1, size(rule_operations->group, 5), query_arguments->results[queryArgCounter].grouper,\
								rule_operations->group[findIndex].name)
		if(groupPos = 0)
			set groupCnt = groupCnt + 1
			set groupPos = groupCnt
			set rule_operations->group[groupPos].name = query_arguments->results[queryArgCounter].grouper
		endif
		set newConsequentSize = size(rule_operations->group[groupPos].consequents, 5) + 1
		set stat = alterlist(rule_operations->group[groupPos].consequents, newConsequentSize)
 
		if(query_arguments->results[queryArgCounter].group_operator != "")
			set rule_operations->group[groupPos].operator = query_arguments->results[queryArgCounter].group_operator
		endif
		set rule_operations->group[groupPos].consequents[newConsequentSize].name = build2("RESULT", queryArgCounter)
	endfor
 
	set stat = alterlist(rule_operations->group, groupCnt)
 
	;call echorecord(rule_operations)
	call log_message(build2("Exit BuildRuleOperators(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
;ruleNames: a comma separated list of rules
;currently supported rule names: "CONDITION"
subroutine ExecuteHealthExpertRules(NULL)
   call log_message("Begin ExecuteHealthExpertRules()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
   declare BEGIN_TIME_BATCH = f8 with noconstant(curtime3), private
   call echo("Executing HE Rules")
 
   declare hConsequent             = i4 with noconstant(0)
   declare sRule                   = vc
   declare counter                 = i4 with noconstant(0)
   declare pl_size                 = i4 with noconstant(0)
   declare personIdString          = vc
   declare returnedConsequents     = vc
   declare qualifyPatCnt           = i4 with noconstant(0)
   declare totalPatients           = i4 with noconstant(0)
   declare DWL_HE_Batch_Size       = i4 with noconstant(0)
   declare loop_count              = i4 with noconstant(0)
 
   ;execute srv runtime library
   execute srvrtl
 
   ;Retrieve the batch size if configured
   select di.info_number
   from dm_info di
   where di.info_domain = "DYNAMIC WORKLIST" and
   		di.info_name = "DWL_HealthExpert_Batch_Size"
   detail
   		DWL_HE_Batch_Size = di.info_number
 
   with nocounter
 
   ;If the batch size is set
   if(DWL_HE_Batch_Size > 0)
   	;log out the size for debugging purposes
   	call log_message(build2("DWL_HealthExpert_Batch_Size Batch Size = ", DWL_HE_Batch_Size), LOG_LEVEL_DEBUG)
 
   else
   	;Otherwise use the default.
   	set DWL_HE_Batch_Size = default_batch_size
   endif
 
   ;determine how many patches are required
   call PrepQueryPatientList(DWL_HE_Batch_Size)
 
   ;if we are doing the delta check set the count of patients to the truePatCnt (actual patients we are doing the delta against)
   if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
   		set totalPatients = truePatCnt
   ;if we are not doing the delta check then set the count of patients to the current size of the queryPatientlist record
   else
   		set totalPatients = cur_list_size
   endif
   
   set loop_count = ceil(cnvtreal(totalPatients)/batch_size)
 
   for(batch_cnt = 1 to loop_count)
	   call log_message(build2("Begin ExecuteHealthExpertRules() Batch ", batch_cnt), LOG_LEVEL_DEBUG)
       set BEGIN_TIME_BATCH = curtime3
	   set hMsg = uar_SrvSelectMessage(966700)
	   set hRequest = uar_SrvCreateRequest(hMsg)
	   set hReply = uar_SrvCreateReply(hMsg)
 
	   set iRet = uar_SrvSetString(hRequest, "knowledge_base_name", "DWL")
	   set iRet = uar_SrvSetString(hRequest, "rule_engine", "Drools")
 
	   	call AddConditionRules(NULL)
	   	call AddResultRules(NULL)
	   	call AddMedRules(NULL)
 
	    ; pass patient list
	    set pt_cnt = 0
	    set startingNumber = (batch_cnt-1)*batch_size + 1
	    set batchEndNumber = batch_size*batch_cnt
	    if(batchEndNumber > totalPatients)
	    	set batchEndNumber = totalPatients
	    endif
 
	    call log_message(build2("Sending patient batch ", startingNumber, " to ", batchEndNumber), LOG_LEVEL_DEBUG)
	    for ( pt_cnt = startingNumber to batchEndNumber)
	       set hitem = uar_SrvAddItem(hRequest, "axises")
	   	   set iRet = uar_SrvSetString(hitem, "name", "PERSON")
	       set iRet = uar_SrvSetString(hitem, "value", nullterm(trim(cnvtstring(queryPatientlist->patients[pt_cnt]->person_id))))
	    endfor
 
	    ;executing request
	    set stat = uar_SrvExecute(hMsg, hRequest, hReply)
	    call echo(build2("HRecommendation Server: SRV Perform, Status:", stat))
	    if (stat > 0)
	        call uar_SrvDestroyInstance(hReply)
			call uar_SrvDestroyInstance(hRequest)
			set failed = 1
		    set fail_operation = "HEALTH EXPERT EXECUTE"
		    call replyFailure("")
	    endif
 
 
	    ;get the status from the server
	    set hStatus = uar_SrvGetStruct(hReply, "status_data")
	    set status = uar_SrvGetStringPtr(hStatus, "status")
	    set statusSize = uar_SrvGetItemCount(hStatus, "subeventstatus")
	    set statusCount = 0
	    for(statusCount = 0 to statusSize)
	      set hSubEvent = uar_SrvGetItem(hStatus, "subeventstatus", statusCount)
 
	      set sTargetObjectName = uar_SrvGetStringPtr(hSubEvent, "TargetObjectName")
	      set sTargetObjectValue = uar_SrvGetStringPtr(hSubEvent, "TargetObjectValue")
	      set sOperationName = uar_SrvGetStringPtr(hSubEvent, "OperationName")
	      set sOperationStatus = uar_SrvGetStringPtr(hSubEvent, "OperationStatus")
 
	      call echo(status)
	      call echo(build2("Target Object Name: ", sTargetObjectName))
	      call echo(build2("Target Object Value: ", sTargetObjectValue))
	      call echo(build2("Operation Name: ", sOperationName))
	      call echo(build2("Operation Status: ", sOperationStatus))
	    endfor
 
	    ;if there is any kind of server failure then we should fail
	    if (status = "F")
			call uar_SrvDestroyInstance(hReply)
			call uar_SrvDestroyInstance(hRequest)
			set failed = 1
			set fail_operation = "HEALTH EXPERT RETURN"
			call replyFailure("")
	 	endif
 
	 	;get the number of persons returned from the server
	 	set axisesCnt = uar_SrvGetItemCount(hReply, "axises")
 
 
	 	call echo("*******")
 
	 	set patientIndex = 0
	 	for(patientIndex = 0 to axisesCnt - 1)
	 		set returnedConsequents = "";Holds a comma separated string of the returned consequents
		 	set hitem = uar_SrvGetItem(hReply, "axises", patientIndex)
 
	 		;call echo(uar_SrvGetStringPtr(hitem, "name"))
	 		set personIdString = uar_SrvGetStringPtr(hitem, "value")
	 		;call echo(build2("personId: ", personIdString))
 
	 		set consequentSize = uar_SrvGetItemCount(hitem, "consequents")
	 		set consequentIndex = 0
	 		for(consequentIndex = 0 to consequentSize - 1)
			    set hConsequent = uar_SrvGetItem(hitem, "consequents", consequentIndex)
		 		set returnedConsequents = concat(returnedConsequents, uar_SrvGetStringPtr(hConsequent, "name"), ", ")
		 	endfor
 
		 	call echo(build2("Pt ", personIdString, " consequents ", returnedConsequents))
 
		 	if(CheckConsequents(returnedConsequents, cnvtreal(personIdString)) = 1)
	            set qualifyPatCnt = qualifyPatCnt + 1
		 		if(mod(qualifyPatCnt,50) = 1)
			   		set stat = alterlist (patientlist->patients, qualifyPatCnt + 49)
		    	endif
		    	set patientlist->patients[qualifyPatCnt].person_id = cnvtreal(personIdString)
		    endif
 
	 	endfor;patients
 
	 	;clean up for next call
	 	call uar_SrvDestroyInstance(hMsg)
	 	call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
 
		call log_message(build2("Exit ExecuteHealthExpertRules() Batch, Elapsed time:",
     	cnvtint(curtime3-BEGIN_TIME_BATCH), "0 ms"), LOG_LEVEL_DEBUG)
 
	endfor ;batch of patients
 
	if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
 
		;Remove the canceled patients
		set staticPatientCount = size(querypatientlist->patients,5)
		declare actualCnt = i4 with noconstant(0)
		set truePatCnt = 0
 
	 	for(num = 1 to staticPatientCount)
	 		if(queryPatientlist->patients[num].person_id > 0.0)
 
	 			;Need to recalculate the truePatCnt as some patients might have been removed
	 			if(truePatCnt = 0)
	 				set truePatCnt = 1
	 			elseif(queryPatientlist->patients[num].person_id != queryPatientlist->patients[num-1].person_id)
	 				set truePatCnt = truePatCnt + 1
	 			endif
 
	 			set actualCnt = actualCnt + 1
	   			set queryPatientlist->patients[actualCnt].person_id = queryPatientlist->patients[num].person_id
	   			set queryPatientlist->patients[actualCnt].new_ind = queryPatientlist->patients[num].new_ind
 
	   		endif
 
		endfor
 
		set stat = alterlist(queryPatientlist->patients, actualCnt)
 
		call echo("current status of master list")
		call echorecord(querypatientlist) ;current disqualified patients with reason
 
		call echo("current disqualified patients with reason")
		call echorecord(reply) ;current disqualified patients with reason
	endif
 
    set stat = alterlist(patientlist->patients, qualifyPatCnt)
 	call echo(build2(qualifyPatCnt, "of ", totalPatients, " patients qualify"))
	call log_message(build2("Exit ExecuteHealthExpertRules(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine AddResultRules(NULL)
   call log_message("Begin AddResultRules()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
 
   declare resultIndex = i4 with noconstant(0), private
   declare sentence = vc with noconstant(""), private
   set resultSize = size(query_arguments->results, 5)
 
   ;determine the clinical event sentence
   for(resultIndex = 1 to resultSize)
 
     ; Add a rule
	 set hRule = uar_SrvAddItem(hRequest, nullterm("rules"))
	 set iRet = uar_SrvSetString(hRule, "name", nullterm(build2("RESULTS", resultIndex)))
	 set iRet = uar_SrvSetShort(hRule, "operator", 1);1 = AND operator
 
	 ; Add a simple consequent with the condition number
	 set hConsequent = uar_SrvAddItem(hRule, "consequents")
	 set iRet = uar_SrvSetString(hConsequent, "key", nullterm("CONSEQUENT_SIMPLE2"))
	 set hParam = uar_SrvAddItem(hConsequent, "parameters")
	 set iRet = uar_SrvSetString(hParam, "key", "%1")
	 set hValue = uar_SrvAddItem(hParam, "values")
	 set iRet = uar_SrvSetString(hValue, "value", nullterm(build2("RESULT", resultIndex)))
 
	 ;set the event set name
     set hCondition = uar_SrvAddItem(hRule, "conditions")
     set hParam = uar_SrvAddItem(hCondition, "parameters")
     set iRet = uar_SrvSetString(hParam, "key", "%1")
     set numOfEventSets = size(query_arguments->results[resultIndex].event_sets, 5)
     for(resultCounter = 1 to numOfEventSets)
     	set hValue = uar_SrvAddItem(hParam, "values")
     	set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex].event_sets[resultCounter].name))
     endfor
 
     ;build the sentence as we determine and set other parameters
     ;for sentences see: https://connect.ucern.com/docs/DOC-191450
     set sentence = "CONDITION_CLNC1" ;default - do they have any any instance of the result
     if(query_arguments->results[resultIndex].result_count.operator = "<")
       if(query_arguments->results[resultIndex].result_count.value = "1")
         set sentence = "CONDITION_CLNC1_NOT" ;if < 1 then test if they have NO instance of result
       else
         set sentence = "CONDITION_CLNC3" ;has fewer then X results
         set hParam = uar_SrvAddItem(hCondition, "parameters")
         set iRet = uar_SrvSetString(hParam, "key", "%2")
         set hValue = uar_SrvAddItem(hParam, "values")
         set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex].result_count.value))
       endif
     elseif(query_arguments->results[resultIndex].result_count.operator = ">=")
       set sentence = "CONDITION_CLNC2" ;has at least X results
       set hParam = uar_SrvAddItem(hCondition, "parameters")
       set iRet = uar_SrvSetString(hParam, "key", "%2")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex].result_count.value))
     endif
     if(query_arguments->results[resultIndex].range_back_value != NULL)
       set sentence = concat(sentence, "A")
       set hParam = uar_SrvAddItem(hCondition, "parameters")
       set iRet = uar_SrvSetString(hParam, "key", "%3")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex].range_back_value))
       set hParam = uar_SrvAddItem(hCondition, "parameters")
       set iRet = uar_SrvSetString(hParam, "key", "%4")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex].range_back_unit))
     endif
 
     set value_size = size(query_arguments->results[resultIndex].values, 5)
     call echo(build2("Number of values: ", value_size))
     if(value_size = 2)
       set sentence = concat(sentence, "C")
       set value_index = 1
       for(value_index = 1 to value_size)
         set hParam = uar_SrvAddItem(hCondition, "parameters")
         if(query_arguments->results[resultIndex]->values[value_index].operator = ">=")
           set iRet = uar_SrvSetString(hParam, "key", "%7")
         elseif(query_arguments->results[resultIndex]->values[value_index].operator = "<=")
           set iRet = uar_SrvSetString(hParam, "key", "%8")
         endif
         set hValue = uar_SrvAddItem(hParam, "values")
         set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex]->values[value_index].value))
       endfor
     elseif(value_size = 1)
       call echo(build2("Found single condition: ", query_arguments->results[resultIndex]->values[1].operator))
         set sentence = concat(sentence, "B")
         set hParam = uar_SrvAddItem(hCondition, "parameters")
         set iRet = uar_SrvSetString(hParam, "key", "%5")
         set hValue = uar_SrvAddItem(hParam, "values")
         set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex]->values[1].operator))
         set hParam = uar_SrvAddItem(hCondition, "parameters")
         set iRet = uar_SrvSetString(hParam, "key", "%6")
         set hValue = uar_SrvAddItem(hParam, "values")
         set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->results[resultIndex]->values[1].value))
     endif
 
     call echo(concat("Condition sentence: ", sentence))
     set iRet = uar_SrvSetString(hCondition, "key", nullterm(sentence))
 
   endfor
 
    call log_message(build2("Exit AddResultRules(), Elapsed time:",
      cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
subroutine AddMedRules(NULL)
   call log_message("Begin AddMedRules()", LOG_LEVEL_DEBUG)
   declare BEGIN_TIME = f8 with constant(curtime3), private
 
   set med_size = size(query_arguments->meds, 5)
   if(med_size = 0)
   	call log_message(build2("Exit AddMedRules(), Elapsed time:",
     	cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
   	return
   endif
 
   declare cur_med_index = i4 with noconstant(0), private
   declare cur_status_index = i4 with noconstant(0), private
 
   declare sentence = vc with noconstant(""), private
 
   ;set the attributes on the SRV object
   ;for sentences see: https://connect.ucern.com/docs/DOC-191450
   for(cur_med_index = 1 to med_size)
 
     ; Add a rule
	 set hRule = uar_SrvAddItem(hRequest, nullterm("rules"))
	 set iRet = uar_SrvSetString(hRule, "name", nullterm(build2("MEDICATION", cur_med_index)))
	 set iRet = uar_SrvSetShort(hRule, "operator", 1);1 = AND operator
 
	 ; Add a simple consequent with the condition number
	 set hConsequent = uar_SrvAddItem(hRule, "consequents")
	 set iRet = uar_SrvSetString(hConsequent, "key", nullterm("CONSEQUENT_SIMPLE2"))
	 set hParam = uar_SrvAddItem(hConsequent, "parameters")
	 set iRet = uar_SrvSetString(hParam, "key", "%1")
	 set hValue = uar_SrvAddItem(hParam, "values")
	 set iRet = uar_SrvSetString(hValue, "value", nullterm(build2("MEDICATION", cur_med_index)))
 
     ;determine the med and sentence
     set hCondition = uar_SrvAddItem(hRule, "conditions")
     set hParam = uar_SrvAddItem(hCondition, "parameters")
     if(query_arguments->meds[cur_med_index].class_id != NULL)
       set sentence = "CONDITION_ORDR5"
       set iRet = uar_SrvSetString(hParam, "key", "%3")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->meds[cur_med_index].class_id))
     elseif(query_arguments->meds[cur_med_index].order_name != NULL)
	   set sentence = "CONDITION_ORDR4"
	   set iRet = uar_SrvSetString(hParam, "key", nullterm("%2"))
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->meds[cur_med_index].order_name))
       call echo(build2("Searching for drug name: ", query_arguments->meds[cur_med_index].order_name))
     endif
 
     ;add the range back argument
     if(query_arguments->meds[cur_med_index].range_back_value != NULL)
       set sentence = concat(sentence, "A")
       set hParam = uar_SrvAddItem(hCondition, "parameters")
       set iRet = uar_SrvSetString(hParam, "key", "%5")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->meds[cur_med_index].range_back_value))
       set hParam = uar_SrvAddItem(hCondition, "parameters")
       set iRet = uar_SrvSetString(hParam, "key", "%6")
       set hValue = uar_SrvAddItem(hParam, "values")
       set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->meds[cur_med_index].range_back_unit))
     endif
 
     ;add the status(es)
     set status_size = size(query_arguments->meds[cur_med_index].status, 5)
     if(status_size > 0);this should always be true
       set hParam = uar_SrvAddItem(hCondition, "parameters")
	   set iRet = uar_SrvSetString(hParam, "key", "%4")
	   for(cur_status_index = 1 to status_size)
         set hValue = uar_SrvAddItem(hParam, "values")
         call echo(build2("Adding med status: ", query_arguments->meds[cur_med_index].status[cur_status_index].meaning))
	     set iRet = uar_SrvSetString(hValue, "value", nullterm(query_arguments->meds[cur_med_index].status[cur_status_index].meaning))
	   endfor
	 endif
 
     ;finally, set the constructed sentence
     call echo(concat("Condition sentence: ", sentence))
     set iRet = uar_SrvSetString(hCondition, "key", nullterm(sentence))
 
   endfor
 
   call log_message(build2("Exit AddMedRules(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
;Create a rule for each condition with a consequent of CONDITION#. Let any consequent mapped under the condition qualify (OR logic)
subroutine AddConditionRules(NULL)
	call log_message("Begin AddConditionRules()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	set conditionSize = size(query_arguments->conditions,5)
	set conditionIndex = 0
	for(conditionIndex = 1 to conditionSize)
		set consequentSize = size(query_arguments->conditions[conditionIndex].consequents,5)
		if(consequentSize > 0)
			; Add a rule
			set hRule = uar_SrvAddItem(hRequest, nullterm("rules"))
			set iRet = uar_SrvSetString(hRule, "name", nullterm(build2("CONDITION", conditionIndex)))
			set iRet = uar_SrvSetShort(hRule, "operator", 2);2 = OR operator
 
			; Add a simple consequent with the condition number
			set hConsequent = uar_SrvAddItem(hRule, "consequents")
		 	set iRet = uar_SrvSetString(hConsequent, "key", "CONSEQUENT_SIMPLE2")
			set hParam = uar_SrvAddItem(hConsequent, "parameters")
			set iRet = uar_SrvSetString(hParam, "key", "%1")
			set hValue = uar_SrvAddItem(hParam, "values")
			set iRet = uar_SrvSetString(hValue, "value", nullterm(build2("CONDITION", conditionIndex)))
 
			set consequentIndex = 0
			for(consequentIndex = 1 to consequentSize)
 
			    ; Add condition details
				set hCondition = uar_SrvAddItem(hRule, "conditions")
			    set iRet = uar_SrvSetString(hCondition, "key", "CONDITION_CONDITION")
			    set hParam = uar_SrvAddItem(hCondition, "parameters")
			    set iRet = uar_SrvSetString(hParam, "key", "%1")
			    set hValue = uar_SrvAddItem(hParam, "values")
			    set iRet = uar_SrvSetString(hValue, "value", \
					nullterm(query_arguments->conditions[conditionIndex].consequents[consequentIndex].name))
			    call echo(build2("building rule for: ", query_arguments->conditions[conditionIndex].consequents[consequentIndex].name))
 
			endfor
 		endif
	endfor
 
	call log_message(build2("Exit AddConditionRules(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
;return zero if the consequent logic contained in rule_operations does not match those given in the list
subroutine CheckConsequents(consequents, patientId)
	call log_message("Begin CheckConsequents()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare groupIterator = i4 with noconstant(0)
	declare groupSize = i4 with constant(size(rule_operations->group, 5))
	declare consequentIterator = i4 with noconstant(0)
	declare groupOperator = vc
	declare consequentsFound = i4 with noconstant(0)
	declare findIndex = i4 with noconstant(0)
	declare returnFlag = i2 with noconstant(1)
 
	;groups are ANDed together, so return false if any fail. ex. Diabetes AND LDL > 7
	for(groupIterator = 1 to groupSize)
 
	call echo(build2("Name1: ", rule_operations->group[groupIterator].name))
 
		set consequentSize = size(rule_operations->group[groupIterator].consequents, 5)
		set consequentsFound = 0
		call echo(build2("consequentSize: ", consequentSize))
		for(consequentIterator = 1 to consequentSize)
 
		call echo(build2("Name2: ", rule_operations->group[groupIterator].consequents[consequentIterator].name))
			if(findstring(build2(rule_operations->group[groupIterator].consequents[consequentIterator].name,","), consequents) > 0)
			   	set consequentsFound = consequentsFound + 1
 
			;if a condition see if this condition was found in the registry
			elseif(rule_operations->group[groupIterator].alt_qualifier_list = "CONDITION")
				set ptPos = locateval(findIndex,1,size(registry_conditions->patients,5),patientId, \
 				   registry_conditions->patients[findIndex].person_id)
 				if(ptPos > 0)
 					if(locateval(findIndex,1,size(registry_conditions->patients[ptPos].conditions,5),consequentIterator, \
 				   	   registry_conditions->patients[ptPos].conditions[findIndex].arg_index) > 0)
 						set consequentsFound = consequentsFound + 1
 					endif
 				endif
			endif
		endfor
 
 ;if we aren't delta check we can return here.  if not we need to continue keeping track of the
 ;rule_operations->group[groupIterator].name as the reason and not return so we continue to check the other rule groups.
 ;then at the end we can do a delta check with all the reasons a patient didn't qualify.
 
		if(rule_operations->group[groupIterator].operator = "AND")
			if(consequentsFound < consequentSize)
 
				set returnFlag = 0
				;if deltacheck call a deltacheck subroutine for a single patient.  for the given argument.  same below.
				if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
					call DeltaCheckForSinglePatient(patientId, rule_operations->group[groupIterator].name)
				else
					return (returnFlag)
				endif
			endif
		else;OR logic
			if(consequentsFound = 0)
 
				set returnFlag = 0
 
				if(listrequest->search_indicator = SEARCH_DELTA_FLAG)
					call DeltaCheckForSinglePatient(patientId, rule_operations->group[groupIterator].name)
				else
					return (returnFlag)
				endif
			endif
		endif
	endfor
 
	call log_message(build2("Exit CheckConsequents(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
	return (returnFlag)
end
 
 
;If called from GetPatientList it will initialize the querypatientlist from the static list and also add new patients to the
;querypatientlist. If called from filters it will add\update patients that no longer qualify to the reply.  If the patient that
;no longer qualifies is an new patient we set the person_id = 0 to know later not to add that patient to the new patient record.
;ms5566 TO DO - can we sort the person ids so we can change to locateevalsort?
subroutine DeltaCheck(disqualify_argument)
 
	call log_message(build2("Begin DeltaCheck() for ", disqualify_argument), LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	call echo(build2("DeltaCheck for: ", disqualify_argument))
 
	declare staticPatientCount = i4 with noconstant(0)
	declare curPatientCount = i4 with noconstant(size(patientlist->patients, 5))
	declare personCnt = i4 with noconstant(0)
	declare pos = i4 with noconstant(0)
	declare pos2 = i4 with noconstant(0)
	declare pos3 = i4 with noconstant(0)
 
	;From GetPatientList we want to prime the querypatient list and also add any new patients that were found.
	;The new patients might eventually be canceled out due to filters.
	if(disqualify_argument = ARGNAME_ACMGROUP or disqualify_argument = ARGNAME_LOCATIONS)
 
		set staticPatientCount = size(listrequest->patients,5)
 
		for(patientIndex = 1 to staticPatientCount)
 
			set personCnt = personCnt + 1
			if(mod(personCnt,50) = 1)
				set stat = alterlist (querypatientlist->patients, personCnt + 49)
			endif
 
			set querypatientlist->patients[personCnt].person_id = listrequest->patients[patientIndex].person_id
			set querypatientlist->patients[personCnt].new_ind = 0
 
		endfor
 
 		set staticPatientCount = size(querypatientlist->patients,5)
 
		;Cycle through the patients from the GetPatientList query (patientlist) and if not in master list (querypatientlist)
		;add it and mark it as a new patient so we know we can remove it later if applicable.
		for(patientIndex = 1 to curPatientCount)
 
			set pos = LOCATEVAL(num, 1, staticPatientCount, patientlist->patients[patientIndex].person_id, querypatientlist->patients[num
				].person_id)
 
			;Was not found in the master list
			if(pos = 0)
 
				set personCnt = personCnt + 1
				if(mod(personCnt,50) = 1)
					set stat = alterlist (querypatientlist->patients, personCnt + 49)
				endif
 
				set querypatientlist->patients[personCnt].person_id = patientlist->patients[patientIndex].person_id
				set querypatientlist->patients[personCnt].new_ind = 1
 
			endif
 
 
		endfor
 
		set stat = alterlist (querypatientlist->patients, personCnt)
 
		;call echo("static patients and new patients")
		;call echorecord(querypatientlist) ;static list passed in
 
		;save off the total patients for the delta checking
		set truePatCnt = personCnt
 
	endif
 
 
	;call echo("current qualifying patients")
	;call echorecord(patientlist) ;current qualifying patients
 
	set staticPatientCount = size(querypatientlist->patients,5)
 
 	;This will see if a patient doesn't qualify for the current filter.  If it doesn't it will add to or update the reply
 	;structure accordingly.
 	;If the patient has the new_ind set to 1 then we will set the person_id to 0 so we know later that we don't need to add it to
 	;the new patient record.
	for(patientIndex = 1 to staticPatientCount)
 
 		;pos > 0 means patient still qualifies.
		set pos = LOCATEVAL(num, 1, curPatientCount, querypatientlist->patients[patientIndex].person_id, patientlist->patients[num
		].person_id)
 
       ; call echo(build2("person_id: ", querypatientlist->patients[patientIndex].person_id, " pos: ", pos))
 
        ;Patient no longer qualifies
		if(pos = 0)
 
			;Not a new patient so update the reply accordingly
			if(querypatientlist->patients[patientIndex].new_ind = 0)
 
				set patientsDeleteCount = size(reply->patients_del,5)
 
				;check to see if we already identified this patient not qualifying
				;pos2 > 0 patient already identified
				set pos2 = LOCATEVAL(num, 1, patientsDeleteCount, querypatientlist->patients[patientIndex].person_id,
	                           reply->patients_del[num].person_id)
 
	           ; call echo(build2("person_id: ", querypatientlist->patients[patientIndex].person_id, " pos2: ", pos2))
 
	 			;This patient was identified as no longer qualifying for the first time need to add the patient and disqualification
	 			;factor
	            if(pos2 = 0)
 
	            	set patientsDeleteCount = patientsDeleteCount + 1
	            	set stat = alterlist (reply->patients_del, patientsDeleteCount)
					set reply->patients_del[patientsDeleteCount].person_id = querypatientlist->patients[patientIndex].person_id
 
					set disqualify_argument_size = size(reply->patients_del[patientsDeleteCount].disqualify_argument,5) + 1
					set stat = alterlist(reply->patients_del[patientsDeleteCount].disqualify_argument, disqualify_argument_size)
					set reply->patients_del[patientsDeleteCount].disqualify_argument[disqualify_argument_size].disqualify_argument =
					 disqualify_argument
 
	 			;This patient was identified as no longer qualifying already.  Just need to update disqualification factor
				else
 
					set disqualify_argument_size = size(reply->patients_del[pos2].disqualify_argument,5)
 
					;Need this check for batch loading.  Don't want to keep adding the same factor for all the instances.
					if(reply->patients_del[pos2].disqualify_argument[disqualify_argument_size].disqualify_argument !=
					disqualify_argument)
 
						set disqualify_argument_size = disqualify_argument_size + 1
						set stat = alterlist(reply->patients_del[pos2].disqualify_argument, disqualify_argument_size )
						set reply->patients_del[pos2].disqualify_argument[disqualify_argument_size].disqualify_argument = disqualify_argument
 
					endif
 
				endif
 
			;A new patient no longer qualifies so 0 out ther person id so we know later not to add it to the new patient record
			else
 
				;call echo(build2("Canceling new patient person_id: ", querypatientlist->patients[patientIndex].person_id))
				set querypatientlist->patients[patientIndex].person_id = 0.0
				set querypatientlist->patients[patientIndex].new_ind = 0
 
			endif
 
		endif
 
	endfor
 
	;Remove the canceled patients
	set staticPatientCount = size(querypatientlist->patients,5)
	declare actualCnt = i4 with noconstant(0)
	set truePatCnt = 0
 
 	for(num = 1 to staticPatientCount)
 		if(queryPatientlist->patients[num].person_id > 0.0)
 
 			;Need to recalculate the truePatCnt as some patients might have been removed
 			if(truePatCnt = 0)
 				set truePatCnt = 1
 			elseif(queryPatientlist->patients[num].person_id != queryPatientlist->patients[num-1].person_id)
 				set truePatCnt = truePatCnt + 1
 			endif
 
 			set actualCnt = actualCnt + 1
   			set queryPatientlist->patients[actualCnt].person_id = queryPatientlist->patients[num].person_id
   			set queryPatientlist->patients[actualCnt].new_ind = queryPatientlist->patients[num].new_ind
 
   		endif
 
	endfor
 
	set stat = alterlist(queryPatientlist->patients, actualCnt)
 
 
 
	;call echo("current status of master list")
	;call echorecord(querypatientlist) ;current disqualified patients with reason
 
	;call echo("current disqualified patients with reason")
	;call echorecord(reply) ;current disqualified patients with reason
 
	call log_message(build2("Exit DeltaCheck() for ", disqualify_argument, " Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine DeltaCheckForSinglePatient(patientId, disqualify_argument)
 
	call log_message(build2("Begin DeltaCheckForSinglePatient() for ", patientId, "/", disqualify_argument), LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	call echo(build2("DeltaCheckForSinglePatient for: ", patientId, "/", disqualify_argument))
 
	declare staticPatientCount = i4 with noconstant(size(querypatientlist->patients,5))
	declare personCnt = i4 with noconstant(0)
	declare pos = i4 with noconstant(0)
 
 	;position of the patient from the master list.
	set pos = LOCATEVAL(num, 1, staticPatientCount, patientId, querypatientlist->patients[num].person_id)
 	;call echo(build2("person_id: ", patientId, " pos: ", pos))
 
 	if(pos > 0)
 
	    ;Not a new patient so update the reply accordingly
		if(querypatientlist->patients[pos].new_ind = 0)
 
			set patientsDeleteCount = size(reply->patients_del,5)
 
			;check to see if we already identified this patient not qualifying
			;pos2 > 0 patient already identified
			set pos2 = LOCATEVAL(num, 1, patientsDeleteCount, patientId, reply->patients_del[num].person_id)
 
	            ;call echo(build2("person_id: ", patientId, " pos2: ", pos2))
	 			;This patient was identified as no longer qualifying for the first time need to add the patient and disqualification
	 			;factor
	            if(pos2 = 0)
 
					set stat = alterlist(reply->patients_del, patientsDeleteCount+1)
					set reply->patients_del[patientsDeleteCount+1].person_id = patientId
 
					set disqualify_argument_size = size(reply->patients_del[patientsDeleteCount+1].disqualify_argument,5)
					set stat = alterlist(reply->patients_del[patientsDeleteCount+1].disqualify_argument, disqualify_argument_size+1)
					set reply->patients_del[patientsDeleteCount+1].disqualify_argument[disqualify_argument_size+1].disqualify_argument =
					 disqualify_argument
 
	 			;This patient was identified as no longer qualifying already.  Just need to update disqualification factor
				else
 
					set disqualify_argument_size = size(reply->patients_del[pos2].disqualify_argument,5)
					set stat = alterlist(reply->patients_del[pos2].disqualify_argument, disqualify_argument_size+1)
					set reply->patients_del[pos2].disqualify_argument[disqualify_argument_size+1].disqualify_argument = disqualify_argument
 
			endif
 
		;A new patient no longer qualifies so 0 out ther person id so we know later not to add it to the new patient record
		else
 
	 		;Need to make sure to 0 out all instances of the patient in case it was repeated for batching
	 		while(pos > 0)
 
				;call echo(build2("Canceling new patient person_id: ", querypatientlist->patients[pos].person_id, " at ", pos))
				set querypatientlist->patients[pos].person_id = 0.0
				set querypatientlist->patients[pos].new_ind = 0
 
				set pos = LOCATEVAL(num, 1, staticPatientCount, patientId, querypatientlist->patients[num].person_id)
 
			endwhile
 
		endif
 
	endif
 
	call log_message(build2("Begin DeltaCheckForSinglePatient() for ", patientId, "/", disqualify_argument, " Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
 
subroutine FillDemographicInfo(NULL)
	call log_message("Begin FillDemographicInfo()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	set patient_count = size(patientlist->patients, 5)
	if (patient_count > 0)
		set stat = alterlist(dem_request->patients, patient_count)
		for (count = 1 to patient_count)
			set dem_request->patients[count].person_id = patientlist->patients[count].person_id
 
		   ;only set in record if in create mode
			if (listrequest->search_indicator = SEARCH_CREATE_FLAG)
	   		 	set updatePatCnt = updatePatCnt + 1
			 	if(mod(updatePatCnt,50) = 1)
					set stat = alterlist (patient_request->patients, updatePatCnt + 49)
		    	endif
 
				set patient_request->patients[updatePatCnt].person_id = patientlist->patients[count].person_id
			endif
		endfor
		execute mp_dcp_get_demographics with replace("REQUEST", "DEM_REQUEST"), replace("REPLY", "DEM_REPLY")
		;call echorecord(dem_reply)
		set stat = moverec(dem_reply->patients, reply->patients)
	endif
 
	call log_message(build2("Exit FillDemographicInfo(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
end
 
subroutine UpdateStaticPatients(NULL)
	call log_message("Begin UpdateStaticPatients()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    ;set stat = moverec(listrequest->search_arguments, patient_request->search_arguments)
    call CopyArgumentsListrequestPatientrequest(NULL)
 
	set patient_request->patient_list_id = 0.0
	set patient_request->patient_list_name = listrequest->patient_list_name
	set patient_request->owner_prsnl_id = listrequest->user_id
 
	set patient_request->clear_arg_ind = 1
	set patient_request->clear_pat_ind = 1
	set patient_request->return_arg_ind = 0
 
   	execute mp_dcp_upd_static_patients ^MINE^ with replace("request",patient_request),\
 		replace("REPLY", upd_static_patients_reply)
 
	set reply->patient_list_id = upd_static_patients_reply->patient_list_id
 
	call log_message(build2("Exit UpdateStaticPatients(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine CopyArgumentsListrequestPatientrequest(NULL)
 
	declare listrequest_size = i4 with noconstant(size(listrequest->search_arguments, 5))
	set stat = alterlist(patient_request->search_arguments, listrequest_size)
 
	for(x = 1 to listrequest_size)
 
		set patient_request->search_arguments[x].parent_entity_name = listrequest->search_arguments[x].parent_entity_name
		set patient_request->search_arguments[x].parent_entity_id = listrequest->search_arguments[x].parent_entity_id
		set patient_request->search_arguments[x].argument_value = listrequest->search_arguments[x].argument_value
		set patient_request->search_arguments[x].argument_name = listrequest->search_arguments[x].argument_name
 
	endfor
 
 
end
 
subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
 
     call log_message(build2("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
 
#exit_script
if(failed = 0)
	if(size(reply->patients, 5) <= 0)
		set reply->status_data.status = "Z"
	else
  		set reply->status_data.status = "S"
  	endif
endif
 
call echo(build2("Patients returned: ", size(reply->patients, 5)))
;call echorecord(reply)
;call echorecord(query_arguments)
end go
