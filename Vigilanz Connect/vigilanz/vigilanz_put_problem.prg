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
      Source file name: snsro_put_problem.prg
      Object name:      vigilanz_put_problem
      Program purpose:  Updates a problem in Millennium.
      Tables read:      NOMENCLATURE
      Tables updated:   PROBLEM
	  Services:			4170162 kia_get_problem_list
						680500 MSVC_GetPrivilegesByCodes
						4170165 kia_ens_problem
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
*************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      		*
 ************************************************************************
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ------------------------------------*
  001 05/14/18 RJC					Initial Write
  002 05/30/18 RJC					Added comment_prsnl_id info
 ************************************************************************/
drop program vigilanz_put_problem go
create program vigilanz_put_problem
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        		;Required
		, "ProblemId" = ""				;Required
		, "Classification" = ""			;Required
		, "Status" = ""					;Optional
		, "Priority" = ""				;Optional
		, "Comments" = ""				;Optional
		, "IsChronic" = ""				;Optional - Set to Acute if not true
		, "OnsetDate" = ""				;Optional
		, "Debug" = 0					;Optional
 
with OUTDEV, USERNAME, PROBLEM_ID, CLASS, STATUS, PRIORITY, COMMENT, CHRONIC, ONSET, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 ;4170162 - kia_get_problem_list
free record 4170162_req
record 4170162_req (
  1 person_id = f8
  1 life_cycle_status_flag = i2
)
 
free record 4170162_rep
record 4170162_rep (
    1 person_org_sec_on = i2
    1 problem [* ]
      2 problem_instance_id = f8
      2 problem_id = f8
      2 nomenclature_id = f8
      2 organization_id = f8
      2 source_string = vc
      2 annotated_display = vc
      2 source_vocabulary_cd = f8
      2 source_vocabulary_disp = c40
      2 source_vocabulary_mean = c12
      2 source_identifier = vc
      2 problem_ftdesc = vc
      2 classification_cd = f8
      2 classification_disp = c40
      2 classification_mean = c12
      2 confirmation_status_cd = f8
      2 confirmation_status_disp = c40
      2 confirmation_status_mean = c12
      2 qualifier_cd = f8
      2 qualifier_disp = c40
      2 qualifier_mean = c12
      2 life_cycle_status_cd = f8
      2 life_cycle_status_disp = c40
      2 life_cycle_status_mean = c12
      2 life_cycle_dt_tm = dq8
      2 persistence_cd = f8
      2 persistence_disp = c40
      2 persistence_mean = c12
      2 certainty_cd = f8
      2 certainty_disp = c40
      2 certainty_mean = c12
      2 ranking_cd = f8
      2 ranking_disp = c40
      2 ranking_mean = c12
      2 probability = f8
      2 onset_dt_flag = i2
      2 onset_dt_cd = f8
      2 onset_dt_disp = c40
      2 onset_dt_mean = c12
      2 onset_dt_tm = dq8
      2 course_cd = f8
      2 course_disp = c40
      2 course_mean = c12
      2 severity_class_cd = f8
      2 severity_class_disp = c40
      2 severity_class_mean = c12
      2 severity_cd = f8
      2 severity_disp = c40
      2 severity_mean = c12
      2 severity_ftdesc = vc
      2 prognosis_cd = f8
      2 prognosis_disp = c40
      2 prognosis_mean = c12
      2 person_aware_cd = f8
      2 person_aware_disp = c40
      2 person_aware_mean = c12
      2 family_aware_cd = f8
      2 family_aware_disp = c40
      2 family_aware_mean = c12
      2 person_aware_prognosis_cd = f8
      2 person_aware_prognosis_disp = c40
      2 person_aware_prognosis_mean = c12
      2 beg_effective_dt_tm = dq8
      2 end_effective_dt_tm = dq8
      2 active_ind = i2
      2 status_upt_precision_flag = i2
      2 status_upt_precision_cd = f8
      2 status_upt_precision_disp = c40
      2 status_upt_precision_mean = c12
      2 status_upt_dt_tm = dq8
      2 cancel_reason_cd = f8
      2 cancel_reason_disp = c40
      2 cancel_reason_mean = c12
      2 contributor_system_cd = f8
      2 contributor_system_disp = c40
      2 contributor_system_mean = c12
      2 responsible_prsnl_id = f8
      2 responsible_prsnl_name = vc
      2 recorder_prsnl_id = f8
      2 recorder_prsnl_name = vc
      2 concept_cki = vc
      2 updt_id = f8
      2 updt_name_full_formatted = vc
      2 problem_discipline [* ]
        3 problem_discipline_id = f8
        3 management_discipline_cd = f8
        3 management_discipline_disp = c40
        3 management_discipline_mean = c12
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
        3 active_ind = i2
      2 problem_comment [* ]
        3 problem_comment_id = f8
        3 comment_dt_tm = dq8
        3 comment_tz = i4
        3 comment_prsnl_id = f8
        3 name_full_formatted = vc
        3 problem_comment = vc
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
      2 secondary_desc [* ]
        3 group_sequence = i2
        3 group [* ]
          4 sequence = i2
          4 secondary_desc_id = f8
          4 nomenclature_id = f8
          4 source_string = vc
      2 problem_prsnl [* ]
        3 problem_prsnl_id = f8
        3 problem_reltn_prsnl_id = f8
        3 problem_prsnl_full_name = vc
        3 problem_reltn_dt_tm = dq8
        3 problem_reltn_cd = f8
        3 problem_reltn_disp = c40
        3 problem_reltn_mean = c12
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
        3 active_ind = i2
      2 problem_uuid = vc
      2 problem_instance_uuid = vc
      2 problem_action_dt_tm = dq8
      2 problem_type_flag = i4
      2 show_in_pm_history_ind = i2
      2 life_cycle_dt_cd = f8
      2 life_cycle_dt_flag = i2
      2 laterality_cd = f8
      2 originating_nomenclature_id = f8
      2 originating_source_string = vc
      2 onset_tz = i4
      2 originating_active_ind = i2
      2 originating_end_effective_dt_tm = dq8
      2 originating_source_vocab_cd = f8
      2 active_status_prsnl_id = f8
      2 active_prsnl_name_ful_formatted = vc
    1 related_problem_list [* ]
      2 nomen_entity_reltn_id = f8
      2 parent_entity_id = f8
      2 parent_nomen_id = f8
      2 parent_source_string = vc
      2 parent_ftdesc = vc
      2 child_entity_id = f8
      2 child_nomen_id = f8
      2 child_source_string = vc
      2 child_ftdesc = vc
      2 reltn_subtype_cd = f8
      2 reltn_subtype_disp = vc
      2 reltn_subtype_mean = c12
      2 priority = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;680500 MSVC_GetPrivilegesByCodes
free record 680500_req
record 680500_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 privilege_criteria
    2 privileges [*]
      3 privilege_cd = f8
    2 locations [*]
      3 location_id = f8
)
 
free record 680500_rep
record 680500_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 privileges [*]
    2 privilege_cd = f8
    2 default [*]
      3 granted_ind = i2
      3 exceptions [*]
        4 entity_name = vc
        4 type_cd = f8
        4 id = f8
      3 status
        4 success_ind = i2
    2 locations [*]
      3 location_id = f8
      3 privilege
        4 granted_ind = i2
        4 exceptions [*]
          5 entity_name = vc
          5 type_cd = f8
          5 id = f8
        4 status
          5 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
;4170165 kia_ens_problem
free record 4170165_req
record 4170165_req (
  1 person_id = f8
  1 problem [*]
    2 problem_action_ind = i2
    2 problem_id = f8
    2 problem_instance_id = f8
    2 organization_id = f8
    2 nomenclature_id = f8
    2 annotated_display = vc
    2 source_vocabulary_cd = f8
    2 source_identifier = vc
    2 problem_ftdesc = vc
    2 classification_cd = f8
    2 confirmation_status_cd = f8
    2 qualifier_cd = f8
    2 life_cycle_status_cd = f8
    2 life_cycle_dt_tm = dq8
    2 persistence_cd = f8
    2 certainty_cd = f8
    2 ranking_cd = f8
    2 probability = f8
    2 onset_dt_flag = i2
    2 onset_dt_cd = f8
    2 onset_dt_tm = dq8
    2 course_cd = f8
    2 severity_class_cd = f8
    2 severity_cd = f8
    2 severity_ftdesc = vc
    2 prognosis_cd = f8
    2 person_aware_cd = f8
    2 family_aware_cd = f8
    2 person_aware_prognosis_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 status_upt_precision_flag = i2
    2 status_upt_precision_cd = f8
    2 status_upt_dt_tm = dq8
    2 cancel_reason_cd = f8
    2 problem_comment [*]
      3 problem_comment_id = f8
      3 comment_action_ind = i2
      3 comment_dt_tm = dq8
      3 comment_tz = i4
      3 comment_prsnl_id = f8
      3 problem_comment = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
    2 problem_discipline [*]
      3 discipline_action_ind = i2
      3 problem_discipline_id = f8
      3 management_discipline_cd = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
    2 problem_prsnl [*]
      3 prsnl_action_ind = i2
      3 problem_reltn_dt_tm = dq8
      3 problem_reltn_cd = f8
      3 problem_prsnl_id = f8
      3 problem_reltn_prsnl_id = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
    2 secondary_desc_list [*]
      3 group_sequence = i4
      3 group [*]
        4 secondary_desc_id = f8
        4 nomenclature_id = f8
        4 sequence = i4
    2 related_problem_list [*]
      3 active_ind = i2
      3 child_entity_id = f8
      3 reltn_subtype_cd = f8
      3 priority = i4
      3 child_nomen_id = f8
      3 child_ftdesc = vc
    2 contributor_system_cd = f8
    2 problem_uuid = vc
    2 problem_instance_uuid = vc
    2 problem_type_flag = i4
    2 show_in_pm_history_ind = i2
    2 life_cycle_dt_cd = f8
    2 life_cycle_dt_flag = i2
    2 laterality_cd = f8
    2 originating_nomenclature_id = f8
    2 onset_tz = i4
  1 user_id = f8
  1 skip_fsi_trigger = i2
)
 
free record 4170165_rep
record 4170165_rep (
   1 person_org_sec_on = i2
   1 person_id = f8
   1 problem_list [* ]
     2 problem_id = f8
     2 problem_instance_id = f8
     2 problem_ftdesc = vc
     2 nomenclature_id = f8
     2 sreturnmsg = vc
     2 review_dt_tm = dq8
     2 comment_list [* ]
       3 problem_comment_id = f8
     2 discipline_list [* ]
       3 problem_discipline_id = f8
       3 management_discipline_cd = f8
       3 sreturnmsg = vc
     2 prsnl_list [* ]
       3 problem_prsnl_id = f8
       3 problem_reltn_cd = f8
       3 sreturnmsg = vc
     2 problem_uuid = vc
     2 problem_instance_uuid = vc
     2 related_problem_list [* ]
       3 active_ind = i2
       3 child_entity_id = f8
       3 reltn_subtype_cd = f8
       3 priority = i4
       3 child_nomen_id = f8
       3 child_ftdesc = vc
     2 beg_effective_dt_tm = dq8
   1 swarnmsg = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
; Final reply
free record problem_reply_out
record problem_reply_out(
  1 problem_id      = f8
  1 audit
    2 user_id             = f8
    2 user_firstname          = vc
    2 user_lastname           = vc
    2 patient_id            = f8
    2 patient_firstname         = vc
    2 patient_lastname          = vc
    2 service_version         = vc
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName				= vc with protect, noconstant("")
declare dProblemId				= f8 with protect, noconstant(0.0)
declare dClassificationCd		= f8 with protect, noconstant(0.0)
declare dStatusCd				= f8 with protect, noconstant(0.0)
declare dPriorityCd				= f8 with protect, noconstant(0.0)
declare sComments				= vc with protect, noconstant("")
declare iIsChronic				= i2 with protect, noconstant(0)
declare sOnsetDate				= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
 
; Other
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare dPatientId				= f8 with protect, noconstant(0.0)
declare iProbIndex				= i4 with protect, noconstant(0)
declare dOnsetDateCd			= f8 with protect, noconstant(0.0)
declare qOnsetDt				= dq8 with protect, noconstant(0)
declare iOnsetFlag				= i2 with protect, noconstant(0)
 
; Constants
declare c_now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_canceled_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12030,"CANCELED"))
declare c_resolved_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12030,"RESOLVED"))
declare c_view_prob_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWPROB"))
declare c_view_prob_item_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWPROBNOM"))
declare c_update_prob_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDATEPROB"))
declare c_update_prob_item_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDTPROBNOM"))
declare c_confirmation_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12031,"CONFIRMED"))
declare c_chronic_persistence_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",12032,"CHRONIC"))
declare c_acute_persistence_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",12032,"ACUTE"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName				= trim($USERNAME, 3)
set dProblemId				= cnvtreal($PROBLEM_ID)
set dClassificationCd		= cnvtreal($CLASS)
set dStatusCd				= cnvtreal($STATUS)
set dPriorityCd				= cnvtreal($PRIORITY)
set sComments				= trim($COMMENT,3)
set iIsChronic				= cnvtreal($CHRONIC)
set sOnsetDate				= trim($ONSET)
set iDebugFlag				= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId				= GetPrsnlIDFromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id		= dPrsnlId
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dProblemId -> ",dProblemId))
	call echo(build("dClassificationCd -> ",dClassificationCd))
	call echo(build("dStatusCd -> ",dStatusCd))
	call echo(build("dPriorityCd -> ",dPriorityCd))
	call echo(build("sComments -> ",sComments))
	call echo(build("iIsChronic -> ",iIsChronic))
	call echo(build("sOnsetDate -> ",sOnsetDate))
	call echo(build("dPrsnlId -> ",dPrsnlId))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetProblemList(null)		= i2 with protect 		;4170162 kia_get_problem_list
declare CheckPrivileges(null)		= i2 with protect 		;680500 MSVC_GetPrivilegesByCodes
declare ValidateOnsetDate(null)		= null with protect
declare PostProblem(null)			= null with protect 	;4170165 kia_ens_problem
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify ProblemId exists
if(dProblemId > 0)
	set iRet = GetProblemList(null)
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid ProblemId.",
		"9999",build("Invalid ProblemId."), problem_reply_out)
		go to exit_script
	endif
else
	call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Missing URI parameters: ProblemId.",
	"1001",build("Missing URI parameters: ProblemId."), problem_reply_out)
	go to exit_script
endif
 
; Validate Username
set iRet = PopulateAudit(sUserName, dPatientId, problem_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), problem_reply_out)
	go to exit_script
endif
 
; Validate StatusId
set iRet = GetCodeSet(dStatusCd)
if(iRet != 12030)
	call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid StatusId.",
	"2006",build("Invalid StatusId: ",dStatusCd), problem_reply_out)
	go to exit_script
else
	if(dStatusCd in (c_resolved_status_cd, c_canceled_status_cd))
		call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "The status update requested is not available for this endpoint.",
		"2006", build("The status update requested is not available for this endpoint."), problem_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Validate ClassificationId
set iRet = GetCodeSet(dClassificationCd)
if(iRet != 12033)
	call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid ClassificationId.",
	"9999",build2("Invalid ClassificationId:",dClassificationCd), problem_reply_out)
	go to exit_script
endif
 
; Validate input parameters - PriorityId
if(dPriorityCd > 0)
	set iRet = GetCodeSet(dPriorityCd)
	if(iRet != 12034)
		call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid PriorityId.",
		"9999",build2("Invalid PriorityId:",dPriorityCd), problem_reply_out)
		go to exit_script
	endif
endif
 
; Validate onset date
call ValidateOnsetDate(null)
 
; Check Privileges - 680500	MSVC_GetPrivilegesByCodes
set iRet = CheckPrivileges(null)
if(iRet < 4)
	call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "User does not have privileges to post problems.",
	"9999","User does not have privileges to post problems.", problem_reply_out)
	go to exit_script
endif
 
; Post Problems - 4170165 kia_ens_problem
call PostProblem(null)
 
; Set audit to a successful status
call ErrorHandler2("SUCCESS", "S", "PUT PROBLEM", "Problem updated successfully.",
"0000","Problem updated successfully.", problem_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  set JSONout = CNVTRECTOJSON(problem_reply_out)
  if(iDebugFlag > 0)
	  call echorecord(problem_reply_out)
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_post_problem.json")
	  call echo(build2("_file : ", _file))
	  call echojson(problem_reply_out, _file, 0)
	  call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetProblemList(null) = i2 - 4170162 kia_get_problem_list
;  Description: Get the patient's problem list.
**************************************************************************/
subroutine GetProblemList(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProblemList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 4170146
	set iRequest = 4170162
 
	;Get PatientId from ProblemId provided
 	select into "nl:"
	from problem p
	where p.problem_id = dProblemId
	detail
		dPatientId = p.person_id
		iValidate = 1
	with nocounter
 
	;Get Problem list
	set 4170162_req->person_id = dPatientId
	set 4170162_req->life_cycle_status_flag = 2
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4170162_req,"REC",4170162_rep)
	if(4170162_rep->status_data.status != "S")
		set iValidate = 0
	else
		for(i = 1 to size(4170162_rep->problem,5))
			if(dProblemId = 4170162_rep->problem[i].problem_id)
				set iProbIndex = i
			endif
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetProblemList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateOnsetDate(null) = null
;  Description:  Build onset fields based on input
**************************************************************************/
subroutine ValidateOnsetDate(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateOnsetDate Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;onset_dt_flag values
    ; 0.00	day
    ; 1.00	month
    ; 2.00	year
 
	if(sOnsetDate = "")
		set dOnsetDateCd = uar_get_code_by("MEANING",25320,"NOTENTERED")
	else
		; Variables
		declare prep = vc
		declare date = vc
		declare dob = dq8
		declare month = vc
		declare day = vc
 
		; Get Patient's DOB
		select into "nl:"
		from person p
		where p.person_id = dPatientId
		detail
			dob = p.birth_dt_tm
		with nocounter
 
		set month = format(dob,"MM;;q")
		set day = format(dob,"DD;;q")
 
		; Get number of spaces
		set first = findstring(" ",sOnsetDate,0)
		set last = findstring(" ",sOnsetDate,1)
 
		if(first = 0)
			case(size(trim(sOnsetDate,3),1))
				of 4:
					set iOnsetFlag = 2 ;year
					set qOnsetDt = cnvtdatetime(cnvtdate(build(month,day,trim(sOnsetDate,3))),0)
				of 7:
					set iOnsetFlag = 1 ;month
						set mo = substring(1,2,trim(sOnsetDate,3))
						set yr = substring(4,4,trim(sOnsetDate,3))
						set qOnsetDt = cnvtdatetime(cnvtdate(build(mo,day,yr)),0)
				of 10:
					set iOnsetFlag = 0 ;day
					set qOnsetDt = cnvtdatetime(cnvtdate2(trim(sOnsetDate,3),"MM/DD/YYYY"),0)
				else
					call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
					go to exit_script
			endcase
 
			if(qOnsetDt = 0)
				call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate format.",
				"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
				go to exit_script
			endif
		else
			if(first = last)
				set prep = cnvtupper(trim(piece(sOnsetDate," ",1,"NF"),3))
				set date = trim(piece(sOnsetDate," ",2,"NF"),3)
 
				set dOnsetDateCd = uar_get_code_by("MEANING",25320,prep)
 
				if(dOnsetDateCd < 1)
					call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate preposition",
					"9999",build2("Invalid OnsetDate preposition: ",prep), problem_reply_out)
					go to exit_script
				endif
 
				case(size(date,1))
					of 4:
						set iOnsetFlag = 2 ;year
						set qOnsetDt = cnvtdatetime(cnvtdate(build(month,day,date)),0)
					of 7:
						set iOnsetFlag = 1 ;month
						set mo = substring(1,2,date)
						set yr = substring(4,4,date)
						set qOnsetDt = cnvtdatetime(cnvtdate(build(mo,day,yr)),0)
					of 10:
						set iOnsetFlag = 0 ;day
						set qOnsetDt = cnvtdatetime(cnvtdate2(date,"MM/DD/YYYY"),0)
					else
						call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate format.",
						"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
						go to exit_script
				endcase
 
				if(qOnsetDt = 0)
					call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
					go to exit_script
				endif
			else
				call ErrorHandler2("VALIDATE", "F", "PUT PROBLEM", "Invalid OnsetDate format.",
				"9999","Invalid OnsetDate format.", problem_reply_out)
				go to exit_script
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateOnsetDate Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckPrivileges(null) = i2 680500 MSVC_GetPrivilegesByCodes
;  Description:  Check user privileges to ensure they can add problems
**************************************************************************/
subroutine CheckPrivileges(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 680500
 
	set 680500_req->patient_user_criteria.user_id = dPrsnlId
	set stat = alterlist(680500_req->privilege_criteria.privileges,4)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_view_prob_priv
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = c_view_prob_item_priv
	set 680500_req->privilege_criteria.privileges[3].privilege_cd = c_update_prob_priv
	set 680500_req->privilege_criteria.privileges[4].privilege_cd = c_update_prob_item_priv
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
	if(680500_rep->transaction_status.success_ind)
		for(i = 1 to size(680500_rep->privileges,5))
			set iValidate = iValidate + 680500_rep->privileges[i].default[1].granted_ind
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostProblem(null)	= null - 4170165 kia_ens_problem
;  Description:  Post the problem to the patient's record
**************************************************************************/
subroutine PostProblem(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostProblem Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 4170147
	set iRequest = 4170165
 
	;Set items based on current data
	set 4170165_req->person_id = dPatientId
	set stat = alterlist(4170165_req->problem,1)
	set 4170165_req->problem[1].problem_action_ind = 2
	set 4170165_req->problem[1].problem_id = 4170162_rep->problem[iProbIndex].problem_id
	set 4170165_req->problem[1].problem_instance_id = 4170162_rep->problem[iProbIndex].problem_instance_id
	set 4170165_req->problem[1].nomenclature_id = 4170162_rep->problem[iProbIndex].nomenclature_id
	set 4170165_req->problem[1].annotated_display = 4170162_rep->problem[iProbIndex].annotated_display
	set 4170165_req->problem[1].source_vocabulary_cd = 4170162_rep->problem[iProbIndex].source_vocabulary_cd
	set 4170165_req->problem[1].source_identifier = 4170162_rep->problem[iProbIndex].source_identifier
	set 4170165_req->problem[1].confirmation_status_cd = 4170162_rep->problem[iProbIndex].confirmation_status_cd
	set 4170165_req->problem[1].beg_effective_dt_tm = 4170162_rep->problem[iProbIndex].beg_effective_dt_tm
	set 4170165_req->problem[1].end_effective_dt_tm = 4170162_rep->problem[iProbIndex].end_effective_dt_tm
	set 4170165_req->problem[1].status_upt_dt_tm = c_now_dt_tm
	set 4170165_req->problem[1].contributor_system_cd = 4170162_rep->problem[iProbIndex].contributor_system_cd
	set 4170165_req->problem[1].problem_uuid = 4170162_rep->problem[iProbIndex].problem_uuid
	set 4170165_req->problem[1].problem_instance_uuid = 4170162_rep->problem[iProbIndex].problem_instance_uuid
	set 4170165_req->problem[1].problem_type_flag = 4170162_rep->problem[iProbIndex].problem_type_flag
	set 4170165_req->problem[1].show_in_pm_history_ind = 4170162_rep->problem[iProbIndex].show_in_pm_history_ind
	set 4170165_req->problem[1].life_cycle_dt_cd = 4170162_rep->problem[iProbIndex].life_cycle_dt_cd
	set 4170165_req->problem[1].life_cycle_dt_flag = 4170162_rep->problem[iProbIndex].life_cycle_dt_flag
	set 4170165_req->problem[1].laterality_cd = 4170162_rep->problem[iProbIndex].laterality_cd
	set 4170165_req->problem[1].originating_nomenclature_id = 4170162_rep->problem[iProbIndex].originating_nomenclature_id
 
	; Problem Prsnl
	set prsnlCheck = 0
	for(p = 1 to size(4170162_rep->problem[iProbIndex].problem_prsnl,5))
		set stat = alterlist(4170165_req->problem[1].problem_prsnl,p)
		set 4170165_req->problem[1].problem_prsnl[p].prsnl_action_ind = 2
 
		set 4170165_req->problem[1].problem_prsnl[p].problem_reltn_dt_tm =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].problem_reltn_dt_tm
 
		set 4170165_req->problem[1].problem_prsnl[p].problem_reltn_cd =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].problem_reltn_cd
 
		set 4170165_req->problem[1].problem_prsnl[p].problem_prsnl_id =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].problem_prsnl_id
 
		set 4170165_req->problem[1].problem_prsnl[p].problem_reltn_prsnl_id =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].problem_reltn_prsnl_id
 
		set 4170165_req->problem[1].problem_prsnl[p].beg_effective_dt_tm =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].beg_effective_dt_tm
 
		set 4170165_req->problem[1].problem_prsnl[p].end_effective_dt_tm =
		4170162_rep->problem[iProbIndex].problem_prsnl[p].end_effective_dt_tm
 
		;Check if Prsnl making change is already related to problem
		if(4170162_rep->problem[iProbIndex].problem_prsnl[p].problem_reltn_prsnl_id = dPrsnlId)
			set prsnlCheck = 1
		endif
	endfor
	; Only add new instance if prsnl isn't already related
	if(prsnlCheck = 0)
		set rpSize = size(4170165_req->problem[1].problem_prsnl,5) + 1
		set stat = alterlist(4170165_req->problem[1].problem_prsnl,rpSize)
		set 4170165_req->problem[1].problem_prsnl[rpSize].prsnl_action_ind = 2
		set 4170165_req->problem[1].problem_prsnl[rpSize].problem_reltn_dt_tm = c_now_dt_tm
		set 4170165_req->problem[1].problem_prsnl[rpSize].problem_reltn_cd = c_recorder_reltn_cd
		set 4170165_req->problem[1].problem_prsnl[rpSize].problem_prsnl_id = -1
		set 4170165_req->problem[1].problem_prsnl[rpSize].problem_reltn_prsnl_id = dPrsnlId
		set 4170165_req->problem[1].problem_prsnl[rpSize].beg_effective_dt_tm = c_now_dt_tm
	endif
 
	;Problem Comments
	for(c = 1 to size(4170162_rep->problem[iProbIndex].problem_comment,5))
		set stat = alterlist(4170165_req->problem[1].problem_comment,c)
		set 4170165_req->problem[1].problem_comment[c].problem_comment_id =
		4170162_rep->problem[iProbIndex].problem_comment[c].problem_comment_id
 
		set 4170165_req->problem[1].problem_comment[c].comment_action_ind = 2
 
		set 4170165_req->problem[1].problem_comment[c].comment_dt_tm=
		4170162_rep->problem[iProbIndex].problem_comment[c].comment_dt_tm
 
		set 4170165_req->problem[1].problem_comment[c].comment_tz=
		4170162_rep->problem[iProbIndex].problem_comment[c].comment_tz
 
		set 4170165_req->problem[1].problem_comment[c].comment_prsnl_id=
		4170162_rep->problem[iProbIndex].problem_comment[c].comment_prsnl_id
 
		set 4170165_req->problem[1].problem_comment[c].problem_comment=
		4170162_rep->problem[iProbIndex].problem_comment[c].problem_comment
 
		set 4170165_req->problem[1].problem_comment[c].beg_effective_dt_tm=
		4170162_rep->problem[iProbIndex].problem_comment[c].beg_effective_dt_tm
 
		set 4170165_req->problem[1].problem_comment[c].end_effective_dt_tm=
		4170162_rep->problem[iProbIndex].problem_comment[c].end_effective_dt_tm
	endfor
 
	if(sComments > " ")
		set commSize = size(4170165_req->problem[1].problem_comment,5) + 1
		set stat = alterlist(4170165_req->problem[1].problem_comment,commSize)
		set 4170165_req->problem[1].problem_comment[commSize].problem_comment_id = -1
		set 4170165_req->problem[1].problem_comment[commSize].comment_action_ind = 4
		set 4170165_req->problem[1].problem_comment[commSize].comment_dt_tm = c_now_dt_tm
		set 4170165_req->problem[1].problem_comment[commSize].comment_tz = CURTIMEZONEAPP
		set 4170165_req->problem[1].problem_comment[commSize].problem_comment = sComments
		set 4170165_req->problem[1].problem_comment[commSize].end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
		set 4170165_req->problem[1].problem_comment[commSize].comment_prsnl_id = dPrsnlId
	endif
 
	;Problem Discipline
	for(pd = 1 to size(4170162_rep->problem[iProbIndex].problem_discipline,5))
		set stat = alterlist(4170165_req->problem[1].problem_discipline,pd)
		set 4170165_req->problem[1].problem_discipline[pd].discipline_action_ind = 2
 
		set 4170165_req->problem[1].problem_discipline[pd].problem_discipline_id =
		4170162_rep->problem[iProbIndex].problem_discipline[pd].problem_discipline_id
 
		set 4170165_req->problem[1].problem_discipline[pd].management_discipline_cd =
		4170162_rep->problem[iProbIndex].problem_discipline[pd].management_discipline_cd
 
		set 4170165_req->problem[1].problem_discipline[pd].beg_effective_dt_tm =
		4170162_rep->problem[iProbIndex].problem_discipline[pd].beg_effective_dt_tm
 
		set 4170165_req->problem[1].problem_discipline[pd].end_effective_dt_tm =
		4170162_rep->problem[iProbIndex].problem_discipline[pd].end_effective_dt_tm
	endfor
 
	;Secondary Desc List
	for(s = 1 to size(4170162_rep->problem[iProbIndex].secondary_desc,5))
		set stat = alterlist(4170165_req->problem[1].secondary_desc_list,s)
 
		set 4170165_req->problem[1].secondary_desc_list[s].group_sequence =
		4170162_rep->problem[iProbIndex].secondary_desc[s].group_sequence
 
		set stat = alterlist(4170165_req->problem[1].secondary_desc_list[s].group,
		size(4170162_rep->problem[iProbIndex].secondary_desc[s].group,5))
 
		for(g = 1 to size(4170162_rep->problem[iProbIndex].secondary_desc[s].group,5))
			set 4170165_req->problem[1].secondary_desc_list[s].group[g].nomenclature_id =
			4170162_rep->problem[iProbIndex].secondary_desc[s].group[g].nomenclature_id
 
			set 4170165_req->problem[1].secondary_desc_list[s].group[g].secondary_desc_id =
			4170162_rep->problem[iProbIndex].secondary_desc[s].group[g].secondary_desc_id
 
			set 4170165_req->problem[1].secondary_desc_list[s].group[g].sequence =
			4170162_rep->problem[iProbIndex].secondary_desc[s].group[g].sequence
		endfor
	endfor
 
	; Related Problems
	for(rp = 1 to size(4170162_rep->related_problem_list,5))
		set stat = alterlist(4170165_req->problem[1].related_problem_list,rp)
 
		set 4170165_req->problem[1].related_problem_list[rp].child_entity_id =
		4170162_rep->related_problem_list[rp].child_entity_id
 
		set 4170165_req->problem[1].related_problem_list[rp].reltn_subtype_cd=
		4170162_rep->related_problem_list[rp].reltn_subtype_cd
 
		set 4170165_req->problem[1].related_problem_list[rp].priority =
		4170162_rep->related_problem_list[rp].priority
 
		set 4170165_req->problem[1].related_problem_list[rp].child_nomen_id =
		4170162_rep->related_problem_list[rp].child_nomen_id
 
		set 4170165_req->problem[1].related_problem_list[rp].child_ftdesc =
		4170162_rep->related_problem_list[rp].child_ftdesc
	endfor
 
	;Status
	set 4170165_req->problem[1].life_cycle_status_cd = dStatusCd
	set 4170165_req->problem[1].life_cycle_dt_tm = c_now_dt_tm
 
	;Classification
	set 4170165_req->problem[1].classification_cd = dClassificationCd
 
	;Chronicity
	if(iIsChronic)
		set 4170165_req->problem[1].persistence_cd = c_chronic_persistence_cd
	else
		set 4170165_req->problem[1].persistence_cd = c_acute_persistence_cd
	endif
 
	;Onset Date
	set 4170165_req->problem[1].onset_dt_flag = iOnsetFlag
	set 4170165_req->problem[1].onset_dt_cd = dOnsetDateCd
	set 4170165_req->problem[1].onset_dt_tm = qOnsetDt
	set 4170165_req->problem[1].onset_tz = CURTIMEZONEAPP
 
 	;Priority
 	set 4170165_req->problem[1].ranking_cd = dPriorityCd
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4170165_req,"REC",4170165_rep)
 
	if(4170165_rep->status_data.status = "S")
		set problem_reply_out->problem_id = 4170165_rep->problem_list[1].problem_id
	else
		call ErrorHandler2("EXECUTE", "F", "PUT PROBLEM", "Could not update problem.",
		"9999","Could not update problem.", problem_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostProblem Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
