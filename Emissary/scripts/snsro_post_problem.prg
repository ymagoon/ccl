/*~BB~*******************************************************************
*
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*
  ~BE~*******************************************************************/
/************************************************************************
      Source file name: snsro_post_problem.prg
      Object name:      snsro_post_problem
      Program purpose:  POST a new problem in Millennium.
      Tables read:      NOMENCLATURE
      Tables updated:   PROBLEM
	  Services:			680500 MSVC_GetPrivilegesByCodes
						4174016 Nomen_GetNomenclaturesByIds
						4174018 Nomen_GetConceptAssociationByCki
						4170164 kia_chk_dupl_prob
						4170165 kia_ens_problem
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
*************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      		*
 ************************************************************************
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ------------------------------------*
  001 01/25/18 RJC					Initial Write
  002 02/06/18 RJC					Removed present on admission input param
  003 02/27/18 RJC					Made priority_cd not required.
  004 03/22/18 RJC					Added version code and copyright block
  005 03/26/18 RJC					Updated reqinfo->updt_id with userid
  006 05/30/18 RJC					Added comment_prsnl_id info
 ************************************************************************/
 
drop program snsro_post_problem go
create program snsro_post_problem
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        		;Required
		, "PatientId" = ""				;Required
		, "PatientIdType" = ""			;Optional
		, "ProblemCodeId" = ""			;Required
		, "Classification" = ""			;Required
		, "Comments" = ""				;Optional
		, "IsChronic" = ""				;Set to Acute if not true
		, "OnsetDate" = ""				;Optional
		, "Priority" = ""				;Optional
		, "Debug" = 0					;Optional
 
 
with OUTDEV, USERNAME, PAT_ID, PAT_ID_TYPE, PROBLEM, CLASS, COMMENT, CHRONIC, ONSET, PRIORITY,DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
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
 
;4174016 Nomen_GetNomenclaturesByIds
free record 4174016_req
record 4174016_req (
  1 nomenclature_ids [*]
    2 id = f8
)
 
free record 4174016_rep
record 4174016_rep (
  1 nomenclatures [*]
    2 nomenclature_id = f8
    2 source_identifier = vc
    2 description = vc
    2 short_description = vc
    2 mnemonic = vc
    2 terminology_cd = f8
    2 terminology_axis_cd = f8
    2 principle_type_cd = f8
    2 language_cd = f8
    2 primary_vterm_ind = i2
    2 primary_cterm_ind = i2
    2 cki = vc
    2 active_ind = i2
    2 extensions [*]
      3 icd9 [*]
        4 age = vc
        4 gender = vc
        4 billable = vc
      3 apc [*]
        4 minimum_unadjusted_coinsurance = f8
        4 national_unadjusted_coinsurance = f8
        4 payment_rate = f8
        4 status_indicator = vc
      3 drg [*]
        4 amlos = f8
        4 gmlos = f8
        4 drg_category = vc
        4 drg_weight = f8
        4 mdc_code = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 concept_identifier = vc
    2 concept_source_cd = f8
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;4174018 Nomen_GetConceptAssociationByCki
free record 4174018_req
record 4174018_req (
  1 concept_cki [*]
    2 cki = vc
    2 preferred_nomenclature_flag = i2
    2 effective_dt_tm = dq8
    2 local_time_zone = i4
    2 target_vocabularies [*]
      3 target_vocabulary = f8
  1 mapping_direction_flag = i2
)
 
free record 4174018_rep
record 4174018_rep (
  1 concepts [*]
    2 concept_cki = vc
    2 associations [*]
      3 target_concept
        4 cki = vc
        4 concept_identifier = vc
        4 concept_source_cd = f8
        4 concept_name = vc
        4 active_ind = i2
        4 nomenclatures [*]
          5 nomenclature_id = f8
          5 source_identifier = vc
          5 description = vc
          5 short_description = vc
          5 mnemonic = vc
          5 terminology_cd = f8
          5 terminology_axis_cd = f8
          5 principle_type_cd = f8
          5 language_cd = f8
          5 primary_vterm_ind = i2
          5 primary_cterm_ind = i2
          5 cki = vc
          5 active_ind = i2
          5 extensions [*]
            6 icd9 [*]
              7 age = vc
              7 gender = vc
              7 billable = vc
            6 apc [*]
              7 minimum_unadjusted_coinsurance = f8
              7 national_unadjusted_coinsurance = f8
              7 payment_rate = f8
              7 status_indicator = vc
            6 drg [*]
              7 amlos = f8
              7 gmlos = f8
              7 drg_category = vc
              7 drg_weight = f8
              7 mdc_code = f8
          5 beg_effective_dt_tm = dq8
          5 end_effective_dt_tm = dq8
          5 concept_identifier = vc
          5 concept_source_cd = f8
        4 beg_effective_dt_tm = dq8
        4 end_effective_dt_tm = dq8
        4 extensions [*]
          5 extension_type_cd = f8
          5 extension_value = vc
      3 association_type_cd = f8
      3 group_sequence = i4
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;4170164 kia_chk_dupl_prob
free record 4170164_req
record 4170164_req (
  1 person_id = f8
  1 nomenclature_id = f8
  1 problem_ftdesc = vc
)
 
free record 4170164_rep
record 4170164_rep (
   1 dupl_ind = i2
   1 dupl_problem_id = f8
   1 vocab_qual = i2
   1 vocab [* ]
     2 source_vocab_cd = f8
     2 source_vocab_disp = c40
     2 source_identifier = vc
     2 source_string = vc
     2 concept_cki = vc
   1 dupl_problem_knt = i2
   1 dupl_problem [* ]
     2 dupl_ind = i2
     2 dupl_problem_id = f8
     2 nomenclature_id = f8
     2 life_cycle_status_cd = f8
     2 life_cycle_status_display = c40
     2 source_vocabulary_cd = f8
     2 source_vocabulary_disp = c40
     2 source_vocabulary_mean = c12
     2 source_identifier = vc
     2 source_string = vc
     2 concept_cki = vc
     2 contributor_system_cd = f8
     2 contributor_system_disp = c40
     2 contributor_system_mean = c12
     2 classification_cd = f8
     2 classification_disp = c40
     2 classification_mean = c12
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
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
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare sPatientId				= vc with protect, noconstant("")
declare dPersonId				= f8 with protect, noconstant(0.0)
declare dProblemCodeId			= f8 with protect, noconstant(0.0)
declare dClassificationCd		= f8 with protect, noconstant(0.0)
declare sComments				= vc with protect, noconstant("")
declare iIsChronic				= i2 with protect, noconstant(0)
declare sOnsetDate				= vc with protect, noconstant("")
declare dPatientIdType			= f8 with protect, noconstant(0.0)
declare dPriorityCd				= f8 with protect, noconstant(0.0)
declare iDebugFlag				= i2 with protect, noconstant(0)
 
; Other
declare dFinalNomenclatureId	= f8 with protect, noconstant(0.0)
declare sAnnotatedDisplay		= vc with protect, noconstant("")
declare dSourceVocabularyCd		= f8 with protect, noconstant(0.0)
declare sSourceIdentifier		= vc with protect, noconstant("")
declare dOnsetDateCd			= f8 with protect, noconstant(0.0)
declare qOnsetDt				= dq8 with protect, noconstant(0)
declare iOnsetFlag				= i2 with protect, noconstant(0)
 
; Constants
declare c_now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_view_prob_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWPROB"))
declare c_view_prob_item_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWPROBNOM"))
declare c_update_prob_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDATEPROB"))
declare c_update_prob_item_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDTPROBNOM"))
declare c_snomed_nomenclature = f8 with protect, constant(uar_get_code_by("MEANING",12100,"SNOMED"))
declare c_confirmation_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12031,"CONFIRMED"))
declare c_life_cycle_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12030,"ACTIVE"))
declare c_chronic_persistence_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",12032,"CHRONIC"))
declare c_acute_persistence_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",12032,"ACUTE"))
declare c_recorder_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",12030,"RECORDER"))
declare c_contributor_system_cd = f8 with protect, constant(uar_get_code_by("MEANING",89,"POWERCHART"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName				= trim($USERNAME, 3)
set dPrsnlId				= GetPrsnlIDFromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id		= dPrsnlId  		;005
set sPatientId				= trim($PAT_ID,3)
set dProblemCodeId			= cnvtreal($PROBLEM)
set dClassificationCd		= cnvtreal($CLASS)
set sComments				= trim($COMMENT,3)
set iIsChronic				= cnvtreal($CHRONIC)
set sOnsetDate				= trim($ONSET)
set dPatientIdType			= cnvtreal($PAT_ID_TYPE)
set dPriorityCd				= cnvtreal($PRIORITY)
set iDebugFlag				= cnvtint($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("sPatientId -> ",sPatientId))
	call echo(build("dProblemCodeId -> ",dProblemCodeId))
	call echo(build("dClassificationCd -> ",dClassificationCd))
	call echo(build("iIsChronic -> ",iIsChronic))
	call echo(build("sOnsetDate -> ",sOnsetDate))
	call echo(build("dPatientIdType -> ",dPatientIdType))
	call echo(build("dPriorityCd -> ",dPriorityCd))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPatient(null)				= null with protect
declare CheckPrivileges(null)			= i2 with protect 	;680500 MSVC_GetPrivilegesByCodes
declare GetNomenclatureByIds(id = f8) 	= i2 with protect 	;4174016 Nomen_GetNomenclaturesByIds
declare GetAssociationsByCki(null) 		= i2 with protect 	;4174018 Nomen_GetConceptAssociationByCki
declare DuplicateProblemCheck(null) 	= i2 with protect 	;4170164 kia_chk_dupl_prob
declare ValidateOnsetDate(null)			= null with protect
declare PostProblem(null)				= null with protect ;4170165 kia_ens_problem
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify Patient Id Exists
if(sPatientId > " ")
	call GetPatient(null)
else
	call ErrorHandler2("POST PROBLEM", "F", "Invalid URI Parameters", "Missing required field: PatientId.",
	"2055", "Missing required field: PatientId", problem_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPersonId, problem_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("POST PROBLEM", "F", "User is invalid", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), problem_reply_out)
	go to exit_script
endif
 
; Check Privileges - 680500	MSVC_GetPrivilegesByCodes
set iRet = CheckPrivileges(null)
if(iRet < 4)
	call ErrorHandler2("POST PROBLEM", "F", "Privileges", "User does not have privileges to post problems.",
	"9999","User does not have privileges to post problems.", problem_reply_out)
	go to exit_script
endif
 
; Verify Problem Code - 4174016 Nomen_GetNomenclaturesByIds
set iRet = GetNomenclatureByIds(dProblemCodeId)
if(iRet = 0)
	call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid ProblemCodeId.",
	"9999",build2("Invalid ProblemCodeId:",dProblemCodeId), problem_reply_out)
	go to exit_script
endif
 
; Validate input parameters - ClassificationId
set iRet = GetCodeSet(dClassificationCd)
if(iRet != 12033)
	call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid ClassificationId.",
	"9999",build2("Invalid ClassificationId:",dClassificationCd), problem_reply_out)
	go to exit_script
endif
 
; Validate input parameters - PriorityId
if(dPriorityCd > 0) 						;003
	set iRet = GetCodeSet(dPriorityCd)
	if(iRet != 12034)
		call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid PriorityId.",
		"9999",build2("Invalid PriorityId:",dPriorityCd), problem_reply_out)
		go to exit_script
	endif
endif
 
; Get Associations by CKI - 4174018	Nomen_GetConceptAssociationByCki
set iRet = GetAssociationsByCki(null)
if(iRet = 0)
	call ErrorHandler2("POST PROBLEM", "F", "Get Associations", "Could not retrieve associations.",
	"9999","Could not retrieve associations.", problem_reply_out)
	go to exit_script
endif
 
; Check for duplicate problems - 4170164 kia_chk_dupl_prob
set iRet = DuplicateProblemCheck(null)
if(iRet = 0)
	call ErrorHandler2("POST PROBLEM", "F", "Get Associations", "Duplicate problem detected. Could not add problem. ",
	"9999","Duplicate problem detected. Could not add problem.", problem_reply_out)
	go to exit_script
endif
 
; Validate onset date
call ValidateOnsetDate(null)
 
; Post Problems - 4170165 kia_ens_problem
call PostProblem(null)
 
; Set audit to a successful status
call ErrorHandler2("POST PROBLEM", "S", "Success", "Problem posted successfully.",
"0000","Problem posted successfully.", problem_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(problem_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_post_problem.json")
	  call echo(build2("_file : ", _file))
	  call echojson(problem_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(problem_reply_out)
 
  if(idebugFlag > 0)
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
;  Name: GetPatient(null) = null
;  Description: Get Patient Id by Type
**************************************************************************/
subroutine GetPatient(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPatient Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; If PatientIdType = 0 ,then assume person_id was provided as patient_id
	if(dPatientIdType > 0)
		if(GetCodeSet(dPatientIdType) != 4)
			call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid PatientIdType.",
			"2045",build2("Invalid PatientIdType:",dPatientIdType), problem_reply_out)
			go to exit_script
		else
			select into "nl:"
			from person_alias pa
			where pa.person_alias_type_cd = dPatientIdType
				and pa.active_ind = 1
				and pa.beg_effective_dt_tm < sysdate
				and pa.end_effective_dt_tm > sysdate
			detail
				dPersonId = pa.person_id
			with nocounter
		endif
	else
		set dPersonId = cnvtreal(sPatientId)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPatient Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
 
/*************************************************************************
;  Name: CheckPrivileges(null) = i2 680500 MSVC_GetPrivilegesByCodes
;  Description:  Check user privileges to ensure they can add problems
**************************************************************************/
subroutine CheckPrivileges(null)
	if(idebugFlag > 0)
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
 
	if(idebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNomenclatureByIds(id = f8) 	= i2 - 4174016 Nomen_GetNomenclaturesByIds
;  Description: Get nomenclature data by id
**************************************************************************/
subroutine GetNomenclatureByIds(id)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNomenclatureByIds Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 4171505
	set iRequest = 4174016
 
	set stat = alterlist(4174016_req->nomenclature_ids,1)
	set 4174016_req->nomenclature_ids[1].id = id
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4174016_req,"REC",4174016_rep)
 
	if(4174016_rep->status_data.status = "S")
		set iValidate = 1
		set sAnnotatedDisplay = 4174016_rep->nomenclatures[1].description
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetNomenclatureByIds Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetAssociationsByCki(null) 	= i2 ;4174018 Nomen_GetConceptAssociationByCki
;  Description: Get associations by CKI
**************************************************************************/
subroutine GetAssociationsByCki(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAssociationsByCki Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 4171505
	set iRequest = 4174018
 
	set stat = alterlist(4174018_req->concept_cki,1)
	set 4174018_req->concept_cki[1].cki = 4174016_rep->nomenclatures[1].cki
	set 4174018_req->concept_cki[1].preferred_nomenclature_flag = 2
	set 4174018_req->concept_cki[1].local_time_zone = CURTIMEZONEAPP
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4174018_req,"REC",4174018_rep)
 
	if(4174018_rep->status_data.status = "S")
		for(c = 1 to size(4174018_rep->concepts,5))
			for(a = 1 to size(4174018_rep->concepts[c].associations,5))
				if(4174018_rep->concepts[c].associations[a].target_concept.concept_source_cd = c_snomed_nomenclature)
					for(n = 1 to size(4174018_rep->concepts[c].associations[a].target_concept.nomenclatures,5))
						set dFinalNomenclatureId = 4174018_rep->concepts[c].associations[a].target_concept.nomenclatures[n].nomenclature_id
						set sSourceIdentifier = 4174018_rep->concepts[c].associations[a].target_concept.nomenclatures[n].source_identifier
						set dSourceVocabularyCd = 4174018_rep->concepts[c].associations[a].target_concept.nomenclatures[n].terminology_cd
					endfor
				endif
			endfor
		endfor
 
		set iValidate = dFinalNomenclatureId
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetAssociationsByCki Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
 
/*************************************************************************
;  Name: DuplicateProblemCheck(null) 	= i2 	;4170164 kia_chk_dupl_prob
;  Description:  Duplicate problem check
**************************************************************************/
subroutine DuplicateProblemCheck(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DuplicateProblemCheck Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 4170146
	set iRequest = 4170164
 
	set 4170164_req->nomenclature_id = dFinalNomenclatureId
	set 4170164_req->person_id = dPersonId
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4170164_req,"REC",4170164_rep)
 
	if(4170164_rep->status_data.status = "S")
		if(4170164_rep->dupl_ind = 0)
			set iValidate = 1
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("DuplicateProblemCheck Runtime: ",
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
	if(idebugFlag > 0)
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
		where p.person_id = dPersonId
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
					call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
					go to exit_script
			endcase
 
			if(qOnsetDt = 0)
				call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate format.",
				"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
				go to exit_script
			endif
		else
			if(first = last)
				set prep = cnvtupper(trim(piece(sOnsetDate," ",1,"NF"),3))
				set date = trim(piece(sOnsetDate," ",2,"NF"),3)
 
				set dOnsetDateCd = uar_get_code_by("MEANING",25320,prep)
 
				if(dOnsetDateCd < 1)
					call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate preposition",
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
						call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate format.",
						"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
						go to exit_script
				endcase
 
				if(qOnsetDt = 0)
					call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), problem_reply_out)
					go to exit_script
				endif
			else
				call ErrorHandler2("POST PROBLEM", "F", "Validate", "Invalid OnsetDate format.",
				"9999","Invalid OnsetDate format.", problem_reply_out)
				go to exit_script
			endif
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ValidateOnsetDate Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
/*************************************************************************
;  Name: PostProblem(null)	= null - 4170165 kia_ens_problem
;  Description:  Post the problem to the patient's record
**************************************************************************/
subroutine PostProblem(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostProblem Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 4170147
	set iRequest = 4170165
 
	set 4170165_req->person_id = dPersonId
	set stat = alterlist(4170165_req->problem,1)
	set 4170165_req->problem[1].problem_action_ind = 1
	set 4170165_req->problem[1].problem_id = 0
	set 4170165_req->problem[1].organization_id = 0
	set 4170165_req->problem[1].nomenclature_id = dFinalNomenclatureId
	set 4170165_req->problem[1].annotated_display = sAnnotatedDisplay
	set 4170165_req->problem[1].source_vocabulary_cd = dSourceVocabularyCd
	set 4170165_req->problem[1].source_identifier = sSourceIdentifier
	set 4170165_req->problem[1].classification_cd = dClassificationCd
	set 4170165_req->problem[1].confirmation_status_cd = c_confirmation_status_cd
	set 4170165_req->problem[1].life_cycle_status_cd = c_life_cycle_status_cd
	set 4170165_req->problem[1].life_cycle_dt_tm = c_now_dt_tm
	if(iIsChronic)
		set 4170165_req->problem[1].persistence_cd = c_chronic_persistence_cd
	else
		set 4170165_req->problem[1].persistence_cd = c_acute_persistence_cd
	endif
	set 4170165_req->problem[1].ranking_cd = dPriorityCd
	set 4170165_req->problem[1].probability = -1
	set 4170165_req->problem[1].onset_dt_flag = iOnsetFlag
	set 4170165_req->problem[1].onset_dt_cd = dOnsetDateCd
	set 4170165_req->problem[1].onset_dt_tm = qOnsetDt
	set 4170165_req->problem[1].status_upt_dt_tm = c_now_dt_tm
 
	;Comments
	if(sComments > " ")
		set stat = alterlist(4170165_req->problem[1].problem_comment,1)
		set 4170165_req->problem[1].problem_comment[1].problem_comment_id = -1
		set 4170165_req->problem[1].problem_comment[1].comment_action_ind = 4
		set 4170165_req->problem[1].problem_comment[1].comment_dt_tm = c_now_dt_tm
		set 4170165_req->problem[1].problem_comment[1].comment_tz = CURTIMEZONEAPP
		set 4170165_req->problem[1].problem_comment[1].problem_comment = sComments
		set 4170165_req->problem[1].problem_comment[1].end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
		set 4170165_req->problem[1].problem_comment[1].comment_prsnl_id = dPrsnlId
	endif
 
	set stat = alterlist(4170165_req->problem[1].problem_prsnl,1)
	set 4170165_req->problem[1].problem_prsnl[1].problem_reltn_dt_tm = c_now_dt_tm
	set 4170165_req->problem[1].problem_prsnl[1].problem_reltn_cd = c_recorder_reltn_cd
	set 4170165_req->problem[1].problem_prsnl[1].problem_prsnl_id = -1
	set 4170165_req->problem[1].problem_prsnl[1].problem_reltn_prsnl_id = dPrsnlId
	set 4170165_req->problem[1].problem_prsnl[1].beg_effective_dt_tm = c_now_dt_tm
 
	set 4170165_req->problem[1].contributor_system_cd = c_contributor_system_cd
	set 4170165_req->problem[1].originating_nomenclature_id = dProblemCodeId
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4170165_req,"REC",4170165_rep)
 
	if(4170165_rep->status_data.status = "S")
		set problem_reply_out->problem_id = 4170165_rep->problem_list[1].problem_id
	else
		call ErrorHandler2("POST PROBLEM", "F", "Post Problem", "Could not post problem.",
		"9999","Could not post problem.", problem_reply_out)
		go to exit_script
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostProblem Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
