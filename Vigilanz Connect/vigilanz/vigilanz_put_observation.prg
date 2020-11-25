/*~BB~*******************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~*******************************************************************/
/************************************************************************
      Source file name:     snsro_put_observation.prg
      Object name:          vigilanz_put_observation
      Program purpose:      Modify an observation in millennium
      Tables read:          NONE
      Tables updated:       CLINICAL_EVENT
      Executing from:       MPages Discern Web Service
      Special Notes:      	NONE
*************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      		*
 ************************************************************************
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ------------------------------------*
  001 10/23/17 RJC					Initial Write
  002 03/22/18 RJC					Added version code and copyright block
  003 03/26/18 RJC					Updated reqinfo->updt_id with userid
  004 10/02/18 RJC					Fixed a few minor issues found
 ************************************************************************/
drop program vigilanz_put_observation go
create program vigilanz_put_observation
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;required
		, "Observation ID:" = 0.0		;required
		, "Observation Value:" = ""		;required
		, "Comment:" = ""
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, OBS_ID, OBS_VALUE, COMMENT, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record observation_reply_out
record observation_reply_out(
  1 observation_id      	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname    	= vc
    2 user_lastname       	= vc
    2 patient_id            = f8
    2 patient_firstname    	= vc
    2 patient_lastname    	= vc
    2 service_version 		= vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code			 	= c4
      3 Description 		= vc
)
 
; Gets event code task assay code
free record 600484_req
record 600484_req (
  1 event_cd_list [*]
    2 event_cd = f8
)
 
free record 600484_rep
record 600484_rep (
   1 dtas [* ]
     2 task_assay_cd = f8
     2 template_label_id = f8
     2 event_cd = f8
     2 description = vc
     2 equation_ind = i2
     2 io_total_id = f8
     2 conditional_ind = i2
     2 trigger_ind = i2
     2 ref_range [* ]
       3 species_cd = f8
       3 sex_cd = f8
       3 age_from_minutes = i4
       3 age_to_minutes = i4
       3 service_resource_cd = f8
       3 encntr_type_cd = f8
       3 normal_ind = i2
       3 normal_low = f8
       3 normal_high = f8
       3 critical_ind = i2
       3 critical_low = f8
       3 critical_high = f8
       3 feasible_ind = i2
       3 feasible_low = f8
       3 feasible_high = f8
       3 units_cd = f8
       3 minutes_back = i4
       3 age_from = i4
       3 age_to = i4
       3 age_from_units_cd = f8
       3 age_to_units_cd = f8
       3 age_from_units_meaning = vc
       3 age_to_units_meaning = vc
     2 default_result_type_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 ; Gets DTA info
free record 600356_req
record 600356_req (
  1 dta [*]
    2 task_assay_cd = f8
)
 
free record 600356_rep
record 600356_rep (
    1 dta [* ]
      2 task_assay_cd = f8
      2 active_ind = i2
      2 mnemonic = vc
      2 description = vc
      2 event_cd = f8
      2 activity_type_cd = f8
      2 activity_type_disp = vc
      2 activity_type_desc = vc
      2 activity_type_mean = vc
      2 default_result_type_cd = f8
      2 default_result_type_disp = c40
      2 default_result_type_desc = c60
      2 default_result_type_mean = vc
      2 code_set = i4
      2 equation [* ]
        3 equation_id = f8
        3 equation_description = vc
        3 equation_postfix = vc
        3 script = vc
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 unknown_age_ind = i2
        3 e_comp_cnt = i4
        3 e_comp [* ]
          4 constant_value = f8
          4 default_value = f8
          4 units_cd = f8
          4 included_assay_cd = f8
          4 name = vc
          4 result_req_flag = i2
          4 look_time_direction_flag = i2
          4 time_window_minutes = i4
          4 time_window_back_minutes = i4
          4 event_cd = f8
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
      2 ref_range_factor [* ]
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 encntr_type_cd = f8
        3 specimen_type_cd = f8
        3 review_ind = i2
        3 review_low = f8
        3 review_high = f8
        3 sensitive_ind = i2
        3 sensitive_low = f8
        3 sensitive_high = f8
        3 normal_ind = i2
        3 normal_low = f8
        3 normal_high = f8
        3 critical_ind = i2
        3 critical_low = f8
        3 critical_high = f8
        3 feasible_ind = i2
        3 feasible_low = f8
        3 feasible_high = f8
        3 units_cd = f8
        3 units_disp = c40
        3 units_desc = c60
        3 code_set = i4
        3 minutes_back = i4
        3 def_result_ind = i2
        3 default_result = vc
        3 default_result_value = f8
        3 unknown_age_ind = i2
        3 alpha_response_ind = i2
        3 alpha_responses_cnt = i4
        3 alpha_responses [* ]
          4 nomenclature_id = f8
          4 source_string = vc
          4 short_string = vc
          4 mnemonic = c25
          4 sequence = i4
          4 default_ind = i2
          4 description = vc
          4 result_value = f8
          4 multi_alpha_sort_order = i4
          4 concept_identifier = vc
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
        3 categories [* ]
          4 category_id = f8
          4 expand_flag = i2
          4 category_name = vc
          4 sequence = i4
          4 alpha_responses [* ]
            5 nomenclature_id = f8
            5 source_string = vc
            5 short_string = vc
            5 mnemonic = c25
            5 sequence = i4
            5 default_ind = i2
            5 description = vc
            5 result_value = f8
            5 multi_alpha_sort_order = i4
            5 concept_identifier = vc
      2 data_map [* ]
        3 data_map_type_flag = i2
        3 result_entry_format = i4
        3 max_digits = i4
        3 min_digits = i4
        3 min_decimal_places = i4
        3 service_resource_cd = f8
      2 modifier_ind = i2
      2 single_select_ind = i2
      2 default_type_flag = i2
      2 version_number = f8
      2 io_flag = i2
      2 io_total_definition_id = f8
      2 label_template_id = f8
      2 template_script_cd = f8
      2 event_set_cd = f8
      2 dta_offset_mins [* ]
        3 dta_offset_min_id = f8
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
        3 offset_min_nbr = i4
        3 offset_min_type_cd = f8
      2 witness_required_ind = i2
    1 cond_exp [* ]
      2 cond_expression_id = f8
      2 cond_expression_name = c100
      2 cond_expression_text = c512
      2 cond_postfix_txt = c512
      2 multiple_ind = i2
      2 prev_cond_expression_id = f8
      2 beg_effective_dt_tm = dq8
      2 end_effective_dt_tm = dq8
      2 exp_comp [* ]
        3 active_ind = i2
        3 beg_effective_dt_tm = dq8
        3 cond_comp_name = c30
        3 cond_expression_comp_id = f8
        3 end_effective_dt_tm = dq8
        3 operator_cd = f8
        3 parent_entity_id = f8
        3 parent_entity_name = c60
        3 prev_cond_expression_comp_id = f8
        3 required_ind = i2
        3 trigger_assay_cd = f8
        3 result_value = f8
        3 cond_expression_id = f8
      2 cond_dtas [* ]
        3 active_ind = i2
        3 age_from_nbr = f8
        3 age_from_unit_cd = f8
        3 age_to_nbr = f8
        3 age_to_unit_cd = f8
        3 beg_effective_dt_tm = dq8
        3 conditional_assay_cd = f8
        3 conditional_dta_id = f8
        3 end_effective_dt_tm = dq8
        3 gender_cd = f8
        3 location_cd = f8
        3 position_cd = f8
        3 prev_conditional_dta_id = f8
        3 required_ind = i2
        3 unknown_age_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
; Checks Privileges
free record 680501_req
 record 680501_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 event_privileges
    2 event_set_level
      3 event_sets [*]
        4 event_set_name = vc
      3 view_results_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
    2 event_code_level
      3 event_codes [*]
        4 event_cd = f8
      3 view_results_ind = i2
      3 document_section_viewing_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
)
 
free record 680501_rep
record 680501_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 event_privileges
    2 view_results
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 document_section_viewing
      3 granted
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 add_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 modify_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 unchart_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 sign_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
 RECORD cv_atr (
   1 stat = i4
   1 app_nbr = i4
   1 task_nbr = i4
   1 step_nbr = i4
   1 happ = i4
   1 htask = i4
   1 hstep = i4
   1 hrequest = i4
   1 hreply = i4
 ) WITH protect
 
IF ((validate (reply->status_data.status ) = 0 ) )
  FREE
  set reply
  RECORD reply (
    1 sb_severity = i4
    1 sb_status = i4
    1 sb_statustext = vc
    1 event_id = f8
    1 status_data
      2 status = c1
      2 subeventstatus [*]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 ENDIF
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName			= vc with protect, noconstant("")
declare dEventId			= f8 with protect, noconstant(0.0)
declare sComments			= vc	with protect, noconstant("")
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare dPrsnlID			= f8 with protect, noconstant(0.0)
declare dEncntrID  			= f8 with protect, noconstant(0.0)
declare dEventCd			= f8 with protect, noconstant(0.0)
declare sObsValue			= vc with protect, noconstant("")
declare sFinalObsValue		= vc with protect, noconstant("")
declare qFinalObsDateTime	= dq8 with protect, noconstant(cnvtdatetime(curdate,curtime3))
declare iDebugFlag			= i2 with protect, noconstant(0)
 
; Constants
declare c_action_type_perform = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"PERFORM" ) )
declare c_action_type_verify = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"VERIFY" ) )
declare c_action_type_sign = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"SIGN" ) )
declare c_action_type_modify = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"MODIFY" ) )
declare c_action_status_completed = f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"COMPLETED" ) )
declare c_action_status_pending = f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"PENDING" ) )
declare c_entry_mode_cd = f8 with protect ,constant (uar_get_code_by ("MEANING" ,29520 ,"UNDEFINED" ) )
declare c_auth_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_modified_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"MODIFIED"))
declare c_active_rec_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_source_cd = f8 with protect, constant(uar_get_code_by("MEANING",30200,"UNSPECIFIED"))
declare c_io_status_confirmed = f8 with protect, constant (uar_get_code_by("MEANING",4000160,"CONFIRMED"))
declare c_note_type_cd = f8 with protect, constant (uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_note_format_cd = f8 with protect, constant (uar_get_code_by("MEANING",23,"AH"))
declare c_entry_method_cd = f8 with protect, constant (uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_compression_cd = f8 with protect, constant (uar_get_code_by("MEANING",120,"NOCOMP"))
 
; Put process
declare event_start_dt_tm = dq8 with protect, noconstant(0)
declare event_end_dt_tm = dq8 with protect, noconstant(0)
declare parent_event_id = f8 with protect, noconstant(0.0)
declare updt_cnt = i4 with protect, noconstant(0)
declare event_class_cd = f8 with protect, noconstant(0.0)
declare normalcy_cd = f8 with protect, noconstant(0.0)
declare review_high = f8 with protect, noconstant(0.0)
declare review_low = f8 with protect, noconstant(0.0)
declare sensitive_high = f8 with protect, noconstant(0.0)
declare sensitive_low = f8 with protect, noconstant(0.0)
declare normal_high = f8 with protect, noconstant(0.0)
declare normal_low = f8 with protect, noconstant(0.0)
declare critical_high = f8 with protect, noconstant(0.0)
declare critical_low = f8 with protect, noconstant(0.0)
declare feasible_high = f8 with protect, noconstant(0.0)
declare feasible_low = f8 with protect, noconstant(0.0)
declare results_units_cd = f8 with protect, noconstant(0.0)
declare task_assay_cd = f8 with protect, noconstant(0.0)
declare time_zone = i4 with protect, noconstant(0)
declare contributor_system_cd = f8 with protect, noconstant(0.0)
declare string_result_check = i2 with protect, noconstant(0)
declare string_result_format_cd = f8 with protect, noconstant(0.0)
declare date_result_check = i2 with protect, noconstant(0)
declare date_type_flag = i2 with protect, noconstant(0)
declare io_type_flag = i2 with protect, noconstant(0)
 
declare applicationid = i4 WITH constant (600005) ,protect
declare taskid = i4 WITH constant (600108) ,protect
declare requestid = i4 WITH constant (1000071) ,protect
declare cvbeginatr ((p_app_nbr = i4 ) ,(p_task_nbr = i4 ) ,(p_step_nbr = i4 ) ) = i4 WITH protect
declare cvperformatr (null ) = i4 WITH protect
declare cvendatr (null ) = null WITH protect
declare hce = i4 WITH protect
declare hce2 = i4 WITH protect
declare hprsnl = i4 WITH protect
declare hce_type = i4 WITH protect
declare hce_struct = i4 WITH protect
declare hstatus = i4 WITH protect
declare hrb_list = i4 WITH protect
declare hrb = i4 WITH protect
declare rb_cnt = i4 WITH protect
declare rb_idx = i4 WITH protect
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dEventId							= cnvtreal($OBS_ID)
set sComments							= trim($COMMENT,3)
set sObsValue							= trim($OBS_VALUE,3)
set sUserName							= trim($USERNAME, 3)
set dPrsnlID							= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id					= dPrsnlId			;003
set sPrsnlName							= GetNameFromPrsnlID(dPrsnlID)  ;defined in snsro_common
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
set reply->status_data.status = "F"
 
if(iDebugFlag > 0)
	call echo(build2("dEventId -> ",dEventId))
	call echo(build2("sComments -> ",sComments))
	call echo(build2("dPersonID -> ",dPersonID))
	call echo(build2("dEncntrID -> ",dEncntrID))
	call echo(build2("dEventCd -> ",dEventCd))
	call echo(build2("sObsValue -> ",sObsValue))
	call echo(build2("dPrsnlID -> ",dPrsnlID))
	call echo(build2("sPrsnlName -> ",sPrsnlName))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEventDetails(null)	= i4 with protect		;  clinical_event table details
declare GetTaskAssay(null)		= i4 with protect 		; 600484 wv_get_template_labels
declare VerifyPrivs(null)		= i4 with protect  		; 680501 MSVC_CheckPrivileges
declare GetDtaInfo(null)		= i4 with protect		; 600356 dcp_get_dta_info_all
declare ValidateDataEntry(null)	= i4 with protect		; Need to validate user entry with system constraints based on DTA
declare ValidateTimeFormat(time = vc) = i4 with protect		; verifies time is 24hr format with four digits
declare GetNormalcyInfo(null)	= null with protect		; Get normalcy data based on patient's age, gender, etc
declare GetTimezone(null)		= i4 with protect 		; 100190 PM_GET_ENCNTR_LOC_TZ
declare PutObservation(null)	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dEventId > 0)
 
	; Validate username
	set iRet = PopulateAudit(sUserName, dPersonID, observation_reply_out, sVersion)
	if(iRet = 0)
	  call ErrorHandler2("PUT OBSERVATION", "F", "User is invalid", "Invalid User for Audit.",
	  "1001",build("Invalid user: ",sUserName), observation_reply_out)
	  go to exit_script
	endif
 
	; Validate EventId and get necessary details
	set iRet = GetEventDetails(null)
	if(iRet = 0)
		call ErrorHandler2("PUT OBSERVATION", "F", "Validate Observation Id", "Invalid ObservationId.",
		"9999","Invalid ObservationId.", observation_reply_out)
		go to exit_script
	endif
 
	; Verify event_cd has an associated task_assay_cd
	set iRet = GetTaskAssay(null)
	if(iRet = 0)
		call ErrorHandler2("PUT OBSERVATION", "F", "Get TaskAssay", "This component Id is not editable.",
		"2018",build2("This component Id is not editable",dEventCd), observation_reply_out)
		go to exit_script
	endif
 
	; Verify user has privileges to PUT OBSERVATION
	set iRet = VerifyPrivs(null)
	if(iRet = 0)
		call ErrorHandler2("PUT OBSERVATION", "F", "VerifyPrivs", "User does not have privileges to update component id",
		"1003",build2("User does not have privileges for component id ",sEventCd), observation_reply_out)
		go to exit_script
	endif
 
	; Get discrete task assay (DTA) info
	set iRet = GetDtaInfo(null)
	if(iRet = 0)
		call ErrorHandler2("PUT OBSERVATION", "F", "Get DTA Info", "Failed retrieving DTA information",
		"9999",build2("Failed retrieving DTA information"), observation_reply_out)
		go to exit_script
	endif
 
	; Validate user entry with DTA constraints
	call ValidateDataEntry(null)
 
	; Get Normalcy Data
	call GetNormalcyInfo(null)
 
	; Execute Server calls
	EXECUTE crmrtl
	EXECUTE srvrtl
 
	; Post the observation
	call PutObservation(null)
else
	call ErrorHandler2("PUT OBSERVATION", "F", "Invalid URI Parameters", "Missing required field: Observation ID.",
	"2055", "Missing required field: Observation ID", observation_reply_out)
	go to EXIT_SCRIPT
endif
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(observation_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(observation_reply_out)
 	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_observation.json")
	call echo(build2("_file : ", _file))
	call echojson(observation_reply_out, _file, 0)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetEventDetails(null)
;  Description:  Gets the details based on the event id (observation id)
**************************************************************************/
subroutine GetEventDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEventDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iValidate = i2
 
	select into "nl:"
	from clinical_event ce
	where ce.event_id = dEventId
		and ce.valid_until_dt_tm > sysdate
	detail
		iValidate = 1
		dEventCd = ce.event_cd
		dPersonId = ce.person_id
		dEncntrId = ce.encntr_id
		parent_event_id = ce.parent_event_id
		event_start_dt_tm = ce.event_start_dt_tm
		event_end_dt_tm = ce.event_end_dt_tm
		contributor_system_cd = ce.contributor_system_cd
		time_zone = ce.performed_tz
		updt_cnt = ce.updt_cnt
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetEventDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetTaskAssay(null)
;  Description:  Gets the task_assay_cd for the provided component_id(event_cd)
**************************************************************************/
subroutine GetTaskAssay(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskAssay Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 600154
 	set iREQUEST = 600484
 
	declare iValidate = i2
 
	set stat = alterlist(600484_req->event_cd_list,1)
	set 600484_req->event_cd_list[1].event_cd = dEventCd
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",600484_req,"REC",600484_rep)
	if(600484_rep->status_data.status = "S" and 600484_rep->dtas[1].task_assay_cd > 0)
		set task_assay_cd = 600484_rep->dtas[1].task_assay_cd
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskAssay Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyPrivs(null)
;  Description:  Verify user has privileges to update observation
**************************************************************************/
subroutine VerifyPrivs(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get personnel relationship to patient
	declare dPrsnlRelCd = f8
	select into "nl:"
	from encntr_prsnl_reltn epr
	where epr.encntr_id = dEncntrId
		and epr.prsnl_person_id = dPrsnlID
	detail
		dPrsnlRelCd = epr.encntr_prsnl_r_cd
	with nocounter
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 680501
 
	declare iValidate = i2
	set 680501_req->user_id = dPrsnlID
	set 680501_req->patient_user_relationship_cd = dPrsnlRelCd
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = dEventCd
	set 680501_req->event_privileges->event_code_level.add_documentation_ind = 1
	set 680501_req->event_privileges->event_code_level.unchart_documentation_ind = 1
	set 680501_req->event_privileges->event_code_level.modify_documentation_ind = 1
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
	set iValidate = 680501_rep->event_privileges->add_documentation.status.success_ind
	set iValidate = iValidate + 680501_rep->event_privileges->unchart_documentation.status.success_ind
	set iValidate = iValidate + 680501_rep->event_privileges->modify_documentation.status.success_ind
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	if(iValidate = 3)
		return(1)
	else
		return(0)
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDtaInfo(null)
;  Description:  Gets the DTA details - reference range, value type(string, num, date), etc
**************************************************************************/
subroutine GetDtaInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDtaInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 600701
 	set iREQUEST = 600356
 
	declare iValidate = i2
 
	set stat = alterlist(600356_req->dta,1)
	set 600356_req->dta[1].task_assay_cd = task_assay_cd
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",600356_req,"REC",600356_rep)
	if(600356_rep->status_data.status = "S")
		set iValidate = 1
		set io_type_flag = 600356_rep->dta[1].io_flag
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDtaInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateDataEntry(null)
;  Description:  Validate user entry with DTA constraints
**************************************************************************/
subroutine ValidateDataEntry(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateDataEntry Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set result_type = 600356_rep->dta[1].default_result_type_disp
	case(result_type)
			of value("Numeric","Count"):
				set event_class_cd = uar_get_code_by("MEANING",53,"NUM")
				set string_result_check = 1
				set string_result_format_cd = uar_get_code_by("MEANING",14113,"NUMERIC")
				set zero_test = replace(replace(sObsValue,".",""),"0","")
				set real_test = cnvtreal(sObsValue)
 
				; Verify the string is 0 or a valid number
				if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
					set precision = 600356_rep->dta[1].data_map[1].min_decimal_places
					set max_digits = 600356_rep->dta[1].data_map[1].max_digits
					set min_digits = 600356_rep->dta[1].data_map[1].min_digits
 
					; Verify number of digits match constraints
					set digitCheck = textlen(trim(replace(sObsValue,".",""),3))
					if(min_digits > 0)
						if(digitCheck < min_digits)
							call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
							build2("This component id requires a minimum of ",min_digits," digits."),
							"9999", build2("This component id requires a minimum of ",min_digits," digits."),
							observation_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
 
					if(max_digits > 0)
						if(digitCheck > max_digits)
							call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
							build2("This component id only allows a max of ",max_digits," digits."),
							"9999", build2("This component id only allows a max of ",max_digits," digits."),
							observation_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
 
					; Verify precision matches constraints
					set pos = findstring(".",sObsValue,1)
 
					if(precision > 0)
						if(pos > 0)
							set postDecimal = textlen(trim(substring(pos + 1,textlen(sObsValue),sObsValue),3))
							if(postDecimal > precision)
								call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
								build2("This component id only allows a decimal precision of ",precision,"."),
								"9999", build2("This component id only allows a decimal precision of ",precision,"."),
								observation_reply_out)
								go to EXIT_SCRIPT
							endif
						endif
					else
						if(pos > 0)
							call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry", build2("This component id only allows integers."),
							"9999", build2("This component id only allows integers."), observation_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
				else
					call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
					build2("This component Id is a numeric field. Please enter a number"),
					"9999", build2("This component Id is a numeric field. Please enter a number"),
					observation_reply_out)
					go to EXIT_SCRIPT
				endif
 
				; Set final variable with entered value
				set sFinalObsValue = sObsValue
 
			of value("Multi-alpha and Freetext","Alpha and Freetext"):
				set sFinalObsValue = build2("Other: ",sObsValue)
				set event_class_cd = uar_get_code_by("MEANING",53,"TXT")
				set string_result_check = 1
				set string_result_format_cd = uar_get_code_by("MEANING",14113,"ALPHA")
 
			of value("Text","Freetext"):
				set sFinalObsValue = sObsValue
				set event_class_cd = uar_get_code_by("MEANING",53,"TXT")
				set string_result_check = 1
				set string_result_format_cd = uar_get_code_by("MEANING",14113,"ALPHA")
 
			of value("Date and Time","Date","Time"):
				set UTC = curutc
				set event_class_cd = uar_get_code_by("MEANING",53,"DATE")
				set date_result_check = 1
				declare date = vc
				declare time = vc
 
				/* Date Type Flag
				0.00	Date and Time
				1.00	Date only
				2.00	Time only	*/
 
				if(result_type = "Time")
					set date_type_flag = 2
					set timeCheck = ValidateTimeFormat(sObsValue)
					set time = trim(sObsValue,3)
					if(timeCheck)
						if(UTC)
							set qFinalObsDateTime = cnvtdatetimeUTC(cnvtdatetime(curdate,cnvtint(time)))
						else
							set qFinalObsDateTime = cnvtdatetime(curdate,cnvtint(time))
						endif
					else
						call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
						build2("This component Id is a time field and requires 24-hour format HHMM."),
						"9999", build2("This component Id is a time field and requires 24-hour format HHMM."),
						observation_reply_out)
						go to EXIT_SCRIPT
					endif
				elseif(result_type = "Date")
					set date_type_flag = 1
					set date = trim(replace(sObsValue,"/",""),3)
					if(cnvtdate(date))
						if(UTC)
							set qFinalObsDateTime = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),curtime3))
						else
							set qFinalObsDateTime = cnvtdatetime(cnvtdate(date),curtime3)
						endif
					else
						call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
						build2("This component Id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
						"9999", build2("This component Id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
						observation_reply_out)
						go to EXIT_SCRIPT
					endif
				else
					set date_type_flag = 0
					set formatCheck = 0
					set checkSpace = findstring(" ",sObsValue)
					set date = substring(1,checkSpace,sObsValue)
					set date = trim(replace(date,"/",""),3)
					set time = trim(substring(checkSpace + 1,textlen(sObsValue),sObsValue),3)
					set time = trim(replace(time,":",""),3)
					set dateCheck = cnvtdate(date)
					set timeCheck = ValidateTimeFormat(time)
 
					if(dateCheck > 0 and timeCheck > 0)
						if(UTC)
							set qFinalObsDateTime = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
						else
							set qFinalObsDateTime = cnvtdatetime(cnvtdate(date),cnvtint(time))
						endif
					else
						call ErrorHandler2("POST OBSERVATION", "F", "Invalid Entry",
						build2("This component Id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
						" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
						"9999", build2("This component Id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
						" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
						observation_reply_out)
						go to EXIT_SCRIPT
					endif
				endif
			else
 
			/* The following are the other types that currently aren't supported.
				Alpha - predefined list of responses and only one selection is allowed
				Multi - predifined list of responses and multiple selections are allowed
				Calculation - this field gets populated based on a calculation of other fields
				Provider - this is a provider lookup. We could accept a prsnl Id for this field at some point
				Yes / No - yes/no field
				Interp - ??
				Read Only - read only field
				Inventory - ??
				ORC Select  - ??
			*/
 
				call ErrorHandler2("POST OBSERVATION", "F", "Invalid Field",
				build2("This component Id is not eligible to be added or updated. The field type is:  ",result_type),
				"9999", build2("This component Id is not eligible to be added or updated. The field type is:  ",result_type),
				observation_reply_out)
				go to EXIT_SCRIPT
		endcase
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateDataEntry Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateTimeFormat(time)
;  Description:  Validate user entry with DTA constraints
**************************************************************************/
subroutine ValidateTimeFormat(origTime)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateTimeFormat Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iValidate = i2
	declare zero_test = vc
	declare newTime = vc
	declare real_test = i4
 
	set zero_test = trim(replace(replace(origTime,".",""),"0",""),3)
	set newTime = trim(replace(origTime,":",""),3)
	set real_test = cnvtreal(newTime)
 
	if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
		if(textlen(newTime) = 4 and real_test >= 0 and real_test < 2400)
			set iValidate = 1
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateTimeFormat Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNormalcyInfo(null)
;  Description:  Get normalcy data based on age and gender
**************************************************************************/
subroutine GetNormalcyInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNormalcyInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare sex_cd = f8
	declare dob = dq8
	declare ageInMin = i4
	declare dObsValue = f8
	set dObsValue = cnvtreal(sFinalObsValue)
 
	select into "nl:"
	from person p
	where p.person_id = dPersonId
	detail
		sex_cd = p.sex_cd
		dob = p.birth_dt_tm
	with nocounter
 
	set ageInMin = datetimediff(cnvtdatetime(curdate,curtime3),dob,4)
 
	for(i = 1 to size(600356_rep->dta[1].ref_range_factor,5))
		if(600356_rep->dta[1].ref_range_factor[i].sex_cd = 0 or
		  (600356_rep->dta[1].ref_range_factor[i].sex_cd > 0 and
		   600356_rep->dta[1].ref_range_factor[i].sex_cd = sex_cd))
 
			if(ageInMin >= 600356_rep->dta[1].ref_range_factor[i].age_from_minutes and
			   ageInMin <= 600356_rep->dta[1].ref_range_factor[i].age_to_minutes)
 
			   	set review_high = 600356_rep->dta[1].ref_range_factor[i].review_high
				set review_low = 600356_rep->dta[1].ref_range_factor[i].review_low
			  	set sensitive_high = 600356_rep->dta[1].ref_range_factor[i].sensitive_high
			  	set sensitive_low = 600356_rep->dta[1].ref_range_factor[i].sensitive_low
			   	set normal_high = 600356_rep->dta[1].ref_range_factor[i].normal_high
				set normal_low = 600356_rep->dta[1].ref_range_factor[i].normal_low
				set critical_high = 600356_rep->dta[1].ref_range_factor[i].critical_high
				set critical_low = 600356_rep->dta[1].ref_range_factor[i].critical_low
				set feasible_high = 600356_rep->dta[1].ref_range_factor[i].feasible_high
				set feasible_low = 600356_rep->dta[1].ref_range_factor[i].feasible_low
 
			  	; Reject value if outside the feasible range
			  	if( 600356_rep->dta[1].ref_range_factor[i].feasible_ind > 0)
					if(dObsValue < feasible_low or dObsValue > feasible_high)
						call ErrorHandler2("PUT OBSERVATION", "F", "Invalid Entry",
						build2("This field has a feasible range of ",feasible_low, " - ", feasible_high),
						"9999", build2("This field has a feasible range of ",feasible_low, " - ", feasible_high),
						observation_reply_out)
						go to EXIT_SCRIPT
					endif
				endif
 
				case(600356_rep->dta[1].ref_range_factor[i].normal_ind)
					of 1: ;Normal low value exists
						if(dObsValue < normal_low)
							set normalcy_cd = uar_get_code_by("MEANING",52,"LOW")
						endif
					of 2: ;Normal high value exists
						if(dObsValue > normal_high)
							set normalcy_cd = uar_get_code_by("MEANING",52,"HIGH")
						endif
					of 3: ;Normal low and high values exist
						if(dObsValue < normal_low)
							set normalcy_cd = uar_get_code_by("MEANING",52,"LOW")
						endif
						if(dObsValue > normal_high)
							set normalcy_cd = uar_get_code_by("MEANING",52,"HIGH")
						endif
					else
						set normalcy_cd = uar_get_code_by("MEANING",52,"NORMAL")
				endcase
 
				if(normalcy_cd != uar_get_code_by("MEANING",52,"NORMAL"))
					case(600356_rep->dta[1].ref_range_factor[i].critical_ind)
						of 1: ;Critical low value exists
							if(dObsValue < critical_low)
								set normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMELOW")
							endif
						of 2: ;Critical high value exists
							if(dObsValue > critical_high)
								set normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
							endif
						of 3: ;Critical low and high values exist
							if(dObsValue < critical_low)
								set normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMELOW")
							endif
							if(dObsValue > critical_high)
								set normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
							endif
					endcase
				endif
			endif
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetNormalcyInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
;  Description:
**************************************************************************/
SUBROUTINE  cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvbeginatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->app_nbr = p_app_nbr
	set cv_atr->task_nbr = p_task_nbr
	set cv_atr->step_nbr = p_step_nbr
	set cv_atr->stat = uar_crmbeginapp (cv_atr->app_nbr ,cv_atr->happ )
	IF ((cv_atr->stat != 0 ) )
	    call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginApp ", cnvtstring (cv_atr->stat ),
	    "9999", build("Invalid uar_CrmBeginApp Status: ",cnvtstring (cv_atr->stat)),observation_reply_out)
	    RETURN (1 )
	ENDIF
	set cv_atr->stat = uar_crmbegintask (cv_atr->happ ,cv_atr->task_nbr ,cv_atr->htask )
	IF ((cv_atr->stat != 0 ) )
	    call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginTask ", cnvtstring (cv_atr->stat ),
	    "9999", build("Invalid uar_CrmBeginTask: ",cnvtstring (cv_atr->htask)),observation_reply_out)
	    RETURN (2 )
	ENDIF
	set cv_atr->stat = uar_crmbeginreq (cv_atr->htask ,"" ,cv_atr->step_nbr ,cv_atr->hstep )
	IF ((cv_atr->stat != 0 ) )
	    call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginReq ", cnvtstring (cv_atr->stat ),
	    "9999", build("Invalid uar_CrmBeginReq: ", cnvtstring(cv_atr->step_nbr)), observation_reply_out)
		RETURN (3 )
	ENDIF
	set cv_atr->hrequest = uar_crmgetrequest (cv_atr->hstep )
	IF ((cv_atr->hrequest = 0 ) )
	    call ErrorHandler2("VALIDATE", "F", " UAR_CrmGetRequest ", "Failed to allocate hrequest" ,
	    "9999", "Invalid uar_CrmBeginRequest: Failed to allocate hrequest", observation_reply_out)
	   	RETURN (4 )
	ENDIF
	if(iDebugFlag > 0)
		call echo( "CvBeginAtr completed successfully" )
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("cvbeginatr Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
        " seconds"))
	endif
 
	RETURN (0)
 
END ;Subroutine
 
/*************************************************************************
;  Name: cvperformatr (null )
;  Description:
**************************************************************************/
subroutine cvperformatr (null )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvperformatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->stat = uar_crmperform (cv_atr->hstep )
	if ((cv_atr->stat != 0 ) )
		call errorhandler2("VALIDATE", "F", " UAR_CRMPERFORM ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_crmperform: ", cnvtstring(cv_atr->stat)), observation_reply_out)
		return (1 )
	endif
	set cv_atr->hreply = uar_crmgetreply (cv_atr->hstep )
	if ((cv_atr->hreply = 0 ) )
		call errorhandler2("VALIDATE", "F", " UAR_CRMGETREPLY ", "Failed to allocate hreply",
		"9999", "Failed to allocate hreply.", observation_reply_out)
		return (2 )
	endif
 
	if(iDebugFlag > 0)
		call echo( "CVPERFORMATR completed succesfully" )
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("cvbeginatr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return(0)
 
end ;Subroutine
 
/*************************************************************************
;  Name:  cvendatr (null )
;  Description:
**************************************************************************/
subroutine cvendatr (null )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvendatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if (cv_atr->hstep )
	   call uar_crmendreq (cv_atr->hstep )
	endif
	if (cv_atr->htask )
	   call uar_crmendtask (cv_atr->htask )
	endif
	if (cv_atr->happ )
		call uar_crmendapp (cv_atr->happ )
	endif
	set stat = initrec (cv_atr )
 
	if(iDebugFlag > 0)
		call echo(concat("cvendatr Runtime: ",
	     trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	     " seconds"))
	endif
end ;Subroutine
 
/*************************************************************************
;  Name: PutObservation(null)
;  Description: Post the Observation to clinical_event table
**************************************************************************/
subroutine PutObservation(null)
 
if(iDebugFlag > 0)
	set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PutObservation Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
 if ((cvbeginatr (applicationid ,taskid ,requestid ) != 0 ) )
  call ErrorHandler2("VALIDATE", "F", " FApp, task, Req", "Field to Begin ATR",
  "9999", "Faild to Begin ATR.", observation_reply_out)
  go to EXIT_SCRIPT
 endif
 
 set hreq = uar_srvadditem(cv_atr->hrequest,"req")
 
 if(iDebugFlag > 0)
	 call echo(build("hreq--->", hreq))
 endif
 
 set stat = uar_srvsetshort (hreq,"ensure_type", 2 )
 set stat = uar_srvsetstring(hreq,"eso_action_meaning","ESOSKIP")
 set stat = uar_srvsetshort (hreq,"ensure_type2", 64 )
 
 set hce = uar_srvgetstruct (hreq ,"clin_event" )
 if(iDebugFlag > 0)
	call echo(build("hce--->", hce))
 endif
 
 IF (hce )
	set stat = uar_srvsetdouble(hce,"event_id",dEventId)
	set stat = uar_srvsetlong (hce ,"view_level" ,1 )
	set stat = uar_srvsetdouble (hce ,"person_id" ,dPersonID )
	set stat = uar_srvsetdouble (hce ,"encntr_id" ,dEncntrID )
	set stat = uar_srvsetdouble (hce ,"contributor_system_cd",contributor_system_cd )
	set stat = uar_srvsetdouble(hce,"parent_event_id",parent_event_id)
	set stat = uar_srvsetdouble (hce ,"event_class_cd" ,event_class_cd )
	set stat = uar_srvsetdouble (hce ,"event_cd" ,dEventCd )
	set stat = uar_srvsetdate (hce ,"event_start_dt_tm" ,event_start_dt_tm )
	set stat = uar_srvsetdate (hce ,"event_end_dt_tm" ,event_end_dt_tm )
	set stat = uar_srvsetdouble (hce ,"task_assay_cd" ,task_assay_cd )
	set stat = uar_srvsetdouble (hce ,"record_status_cd" ,c_active_rec_status_cd )
	set stat = uar_srvsetdouble (hce ,"result_status_cd" , c_modified_status_cd )
	set stat = uar_srvsetshort (hce ,"authentic_flag" ,0 )
	set stat = uar_srvsetshort (hce ,"publish_flag" ,1 )
	set stat = uar_srvsetdouble (hce ,"normalcy_cd",normalcy_cd)
	set stat = uar_srvsetstring (hce ,"normal_high",nullterm(cnvtstring(normal_high)))
	set stat = uar_srvsetstring (hce ,"normal_low",nullterm(cnvtstring(normal_low)))
	set stat = uar_srvsetstring (hce ,"critical_high",nullterm(cnvtstring(critical_high)))
	set stat = uar_srvsetstring (hce ,"critical_low",nullterm(cnvtstring(critical_low)))
	set stat = uar_srvsetdouble (hce ,"result_units_cd",results_units_cd)
	set stat = uar_srvsetdouble (hce ,"entry_mode_cd",c_entry_mode_cd)
	set stat = uar_srvsetdouble (hce ,"source_cd",c_source_cd)
	set stat = uar_srvsetshort (hce ,"event_start_tz",time_zone)
	set stat = uar_srvsetshort (hce ,"event_end_tz",time_zone)
	set stat = uar_srvsetdouble (hce ,"task_assay_version_nbr",600356_rep->dta[1].version_number)
	set stat = uar_srvsetshort(hce,"updt_cnt",updt_cnt)
 
 	; Text based results including numeric results
	if(string_result_check)
		set hstring = uar_srvadditem (hce ,"string_result" )
		if(hstring)
			set stat = uar_srvsetstring (hstring ,"string_result_text",sFinalObsValue)
			set stat = uar_srvsetdouble (hstring ,"string_result_format_cd",string_result_format_cd)
			set stat = uar_srvsetdouble (hstring ,"unit_of_measure_code",results_units_cd)
		endif
	endif
 
 	; Date based results
	if(date_result_check)
		set hdate = uar_srvadditem (hce ,"date_result" )
		if(hdate)
			set stat = uar_srvsetdate (hdate ,"result_dt_tm",qFinalObsDateTime)
			set stat = uar_srvsetshort (hdate ,"date_type_flag",date_type_flag)
		endif
	endif
 
	; Additional section for IO results
	if(io_type_flag)
		set hio = uar_srvadditem (hce ,"intake_output_result" )
		if(hio)
			set stat = uar_srvsetdate (hio ,"io_start_dt_tm" ,event_start_dt_tm )
			set stat = uar_srvsetdate (hio ,"io_end_dt_tm" ,event_end_dt_tm )
			set stat = uar_srvsetshort(hio ,"io_type_flag", io_type_flag)
			set stat = uar_srvsetdouble(hio,"io_volume",cnvtreal(sFinalObsValue))
			set stat = uar_srvsetdouble(hio,"io_status_cd",c_io_status_confirmed)
			set stat = uar_srvsetdouble(hio,"reference_event_cd",dEventCd)
		endif
	endif
 
	; Add comments if they exist
	if(sComments > " ")
		set noteSize = textlen(sComments)
		set hnote = uar_srvadditem(hce,"event_note_list")
		if(hnote)
			set stat = uar_srvsetdouble(hnote,"note_type_cd",c_note_type_cd)
			set stat = uar_srvsetdouble(hnote,"note_format_cd",c_note_format_cd)
			set stat = uar_srvsetdouble(hnote,"entry_method_cd",c_entry_method_cd)
			set stat = uar_srvsetdouble(hnote,"note_prsnl_id",dPrsnlID)
			set stat = uar_srvsetdate(hnote,"note_dt_tm",cnvtdatetime(curdate,curtime3))
			set stat = uar_srvsetdouble(hnote,"record_status_cd",c_active_rec_status_cd)
			set stat = uar_srvsetdouble(hnote,"compression_cd",c_compression_cd)
			set stat = uar_srvsetasis(hnote,"long_blob",sComments,noteSize)
			set stat = uar_srvsetshort(hnote,"note_tz",time_zone)
		else
			call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_note_list",
			"9999", "Failed to allocate event_note_list", observation_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	declare ePrsnlSize = i2
	declare sMsgTxt = vc
	set ePrsnlSize = 3
 
	for(i = 1 to ePrsnlSize )
		set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
		if (hprsnl )
			set stat = uar_srvsetshort (hprsnl, "action_tz", time_zone)
			set stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dPrsnlID)
			set stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,cnvtdatetime(curdate,curtime3))
 
			case(i)
				of 1:
					set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_perform )
					set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
					set sMsgTxt = "Perform"
				of 2:
					set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_verify )
					set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
					set sMsgTxt = "Verify"
				of 3:
					set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_modify )
					set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
					set sMsgTxt = "Verify"
			endcase
		else
			call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
			"9999", build2("Failed to allocate event_prsnl_list - ",sMsgTxt), observation_reply_out)
			go to EXIT_SCRIPT
		endif
	endfor
 
 ELSE
    call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Failed to allocate clin_event",
    "9999", "Failed to allocate clin_event", observation_reply_out)
    GO TO EXIT_SCRIPT
 ENDIF
 
 IF ((cvperformatr (null ) != 0 ) )
 	GO TO EXIT_SCRIPT
 ENDIF
 
 set hstatus = uar_srvgetstruct (cv_atr->hreply ,"sb" )
 IF (hstatus )
	set reply->sb_severity = uar_srvgetlong (hstatus ,"severityCd" )
	set reply->sb_status = uar_srvgetlong (hstatus ,"statusCd" )
	set reply->sb_statustext = uar_srvgetstringptr (hstatus ,"statusText" )
 ELSE
    call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "hStatus returned F",
    "9999", "Invalid hStatus: F", observation_reply_out)
 ENDIF
 
 set rep_cnt = uar_srvgetitemcount (cv_atr->hreply,"rep")
 if(rep_cnt > 0)
	 set rep = uar_srvgetitem(cv_atr->hreply ,"rep" ,0)
 
	 set rb_cnt = uar_srvgetitemcount (rep ,"rb_list" )
	 IF ((rb_cnt >= 1 ) )
		set hrb = uar_srvgetitem (rep ,"rb_list" ,0 )
		set observation_reply_out->observation_id = uar_srvgetdouble (hrb ,"parent_event_id" )
		call ErrorHandler2("PUT OBSERVATION", "S", "Process completed", "Observation has been updated successfully",
		"0000", build2("Observation ID: ",observation_reply_out->observation_id, " has been updated."), observation_reply_out)
 
		if(iDebugFlag > 0)
			call echo(build("parent_event_id -->", observation_reply_out->observation_id))
		endif
 
	 ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Reply rb_list is empty",
		"9999", "Reply rb_list is empty", observation_reply_out)
	 ENDIF
 endif
 
 
if(iDebugFlag > 0)
	call echo(concat("PutObservation Runtime: ",
    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
    " seconds"))
endif
 
end ;End Sub
 
end go
set trace notranslatelock go
