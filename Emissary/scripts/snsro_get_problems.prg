/*~BB~************************************************************************
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
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       11/11/14
          Source file name:   snsro_get_problems
          Object name:        snsro_get_problems
          Request #:          4170162 - kia_get_problem_list
          Program purpose:    Returns problem information for a patient
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 11/11/14  AAB		    Initial write
  001 11/14/14  AAB		    Added person_id to reply
  002 11/27/14  JCO		    Added ICD9, ICD10 and SNOMED fields
  003 12/06/14  AAB         Remove Username from Input
  004 09/14/15  AAB			Add audit object
  005 03/01/16  AAB 		Use Annotated_display for problem_desc
  006 04/29/16  AAB 		Added version
  007 10/10/16  AAB 		Add DEBUG_FLAG
  008 07/27/17 	JCO			Changed %i to execute; update ErrorHandler2
  009 03/22/18	RJC			Added version code and copyright block
  010 05/16/18	RJC			Added person id to main object
  011 05/30/18	RJC			Added inc inactive flag, resolved date, comments
  012 09/25/18	RJC			Added updt_dt_tm to payload
 ***********************************************************************/
drop program snsro_get_problems go
create program snsro_get_problems
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.00
		, "User Name:" = ""        		;004
		, "IncInactive" = ""			;Optional - 011
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, USERNAME, INC_INACTIVE, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL ;009
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_in
record req_in (
  1 person_id = f8
  1 life_cycle_status_flag = i2
)
 
free record problems_reply_out
record problems_reply_out
(
	1 person_org_sec_on              = i2
	1 person_id						= f8        ;001
	1 problem[*]
		2 person_id					   = f8	;010
		2 problem_instance_id          = f8
		2 problem_id                   = f8
		2 nomenclature_id              = f8
		2 organization_id              = f8
		2 source_string                = vc
		2 annotated_display            = vc
		2 source_vocabulary_cd         = f8
		2 source_vocabulary_disp       = vc
		2 source_vocabulary_mean       = vc
		2 source_identifier            = vc
		2 problem_ftdesc               = vc
		2 classification_cd            = f8
		2 classification_disp          = vc
		2 classification_mean          = vc
		2 confirmation_status_cd       = f8
		2 confirmation_status_disp     = vc
		2 confirmation_status_mean     = vc
		2 qualifier_cd                 = f8
		2 qualifier_disp               = vc
		2 qualifier_mean               = vc
		2 life_cycle_status_cd         = f8
		2 life_cycle_status_disp       = vc
		2 life_cycle_status_mean       = vc
		2 life_cycle_dt_tm             = dq8
		2 persistence_cd               = f8
		2 persistence_disp             = vc
		2 persistence_mean             = vc
		2 certainty_cd                 = f8
		2 certainty_disp               = vc
		2 certainty_mean               = vc
		2 ranking_cd                   = f8
		2 ranking_disp                 = vc
		2 ranking_mean                 = vc
		2 probability                  = f8
		2 onset_dt_flag                = i2
		2 onset_dt_cd                  = f8
		2 onset_dt_disp                = vc
		2 onset_dt_mean                = vc
		2 onset_dt_tm                  = dq8
		2 course_cd                    = f8
		2 course_disp                  = vc
		2 course_mean                  = vc
		2 severity_class_cd            = f8
		2 severity_class_disp          = vc
		2 severity_class_mean          = vc
		2 severity_cd                  = f8
		2 severity_disp                = vc
		2 severity_mean                = vc
		2 severity_ftdesc              = vc
		2 prognosis_cd                 = f8
		2 prognosis_disp               = vc
		2 prognosis_mean               = vc
		2 person_aware_cd              = f8
		2 person_aware_disp            = vc
		2 person_aware_mean            = vc
		2 family_aware_cd              = f8
		2 family_aware_disp            = vc
		2 family_aware_mean            = vc
		2 person_aware_prognosis_cd    = f8
		2 person_aware_prognosis_disp  = vc
		2 person_aware_prognosis_mean  = vc
		2 beg_effective_dt_tm          = dq8
		2 end_effective_dt_tm          = dq8
		2 active_ind                   = i2
		2 status_upt_precision_flag    = i2
		2 status_upt_precision_cd      = f8
		2 status_upt_precision_disp    = vc
		2 status_upt_precision_mean    = vc
		2 status_upt_dt_tm             = dq8
		2 cancel_reason_cd             = f8
		2 cancel_reason_disp           = vc
		2 cancel_reason_mean           = vc
		2 contributor_system_cd        = f8
		2 contributor_system_disp      = vc
		2 contributor_system_mean      = vc
		2 responsible_prsnl_id         = f8
		2 responsible_prsnl_name       = vc
		2 recorder_prsnl_id            = f8
		2 recorder_prsnl_name          = vc
		2 concept_cki                  = vc
		2 updt_id                      = f8
		2 updt_name_full_formatted     = vc
		2 updt_dt_tm				   = dq8 ;012
		2 problem_discipline [*]
			3 problem_discipline_id      = f8
			3 management_discipline_cd   = f8
			3 management_discipline_disp = vc
			3 management_discipline_mean = vc
			3 beg_effective_dt_tm        = dq8
			3 end_effective_dt_tm        = dq8
			3 active_ind                 = i2
		2 problem_comment [*]
			3 problem_comment_id         = f8
			3 comment_dt_tm              = dq8
			3 comment_tz                 = i4
			3 comment_prsnl_id           = f8
			3 name_full_formatted        = vc
			3 problem_comment            = vc
			3 beg_effective_dt_tm        = dq8
			3 end_effective_dt_tm        = dq8
		2 secondary_desc [*]
			3 group_sequence             = i2
			3 group[*]
				4 sequence             	 = i2
				4 secondary_desc_id      = f8
				4 nomenclature_id        = f8
				4 source_string          = vc
		2 problem_prsnl[*]
			3 problem_prsnl_id           = f8
			3 problem_reltn_prsnl_id     = f8
			3 problem_prsnl_full_name    = vc
			3 problem_reltn_dt_tm        = dq8
			3 problem_reltn_cd           = f8
			3 problem_reltn_disp         = vc
			3 problem_reltn_mean         = vc
			3 beg_effective_dt_tm        = dq8
			3 end_effective_dt_tm        = dq8
			3 active_ind                 = i2
		2 problem_uuid				   = vc
		2 problem_instance_uuid		   = vc
		2 problem_action_dt_tm         = dq8
		2 problem_type_flag			   = i4
		2 show_in_pm_history_ind	   = i2
		2 life_cycle_dt_cd			   = f8
		2 life_cycle_dt_flag		   = i2
		2 laterality_cd                = f8
		2 originating_nomenclature_id  = f8
		2 originating_source_string	   = vc
		2 onset_tz                 	   = i4
		2 originating_active_ind	   = i2
		2 originating_end_effective_dt_tm = dq8
		2 originating_source_vocab_cd  = f8
		2 active_status_prsnl_id       = f8
		2 active_prsnl_name_ful_formatted  = vc
		2 icd9code						= vc		;002
		2 icd10code						= vc		;002
		2 snomed						= vc		;002
	1 related_problem_list[*]
		2 nomen_entity_reltn_id        = f8
		2 parent_entity_id             = f8
		2 parent_nomen_id              = f8
		2 parent_source_string         = vc
		2 parent_ftdesc                = vc
		2 child_entity_id              = f8
		2 child_nomen_id               = f8
		2 child_source_string          = vc
		2 child_ftdesc                 = vc
		2 reltn_subtype_cd             = f8
		2 reltn_subtype_disp           = vc
		2 reltn_subtype_mean           = vc
		2 priority                     = i4
	1 audit			;004
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc		;006
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4			;025
      3 Description = vc	;025
)
 
set problems_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dPersonId  		= f8 with protect, noconstant(0.0)
declare sUserName  		= vc with protect, noconstant("")
declare iIncInactive	= i2 with protect, noconstant(0) ;011
declare iDebugFlag		= i2 with protect, noconstant(0) ;007
 
;Constants
declare icd9code 			= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD9"))
declare icd10code 			= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD10"))
declare snomed 				= f8 with protect, constant(uar_get_code_by("MEANING",400,"SNMCT"))
declare APPLICATION_NUMBER 	= i4 with protect, constant (600005)
declare TASK_NUMBER 		= i4 with protect, constant (4170146)
declare REQ_NUMBER 			= i4 with protect, constant (4170162)
declare section_startDtTm	= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
 
;Other
declare sCKI				= vc with protect, noconstant("")
declare prbCnt				= i4 with protect, noconstant(0)
declare iRet				= i2 with protect, noconstant(0) 	;004
 
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set dPersonId 			= CNVTINT($PERSON_ID)
set sUserName			= trim($USERNAME, 3)   ;004
set iIncInactive		= cnvtint($INC_INACTIVE) ;011
set iDebugFlag			= cnvtint($DEBUG_FLAG) ;007
 
if(iDebugFlag > 0)
	call echo(build("dPersonId ->", dPersonId))
	call echo(build("sUserName ->", sUserName))
	call echo(build("iIncInactive ->", iIncInactive))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;008
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetProblems(null)	= null with protect ;4170162 - kia_get_problem_list
declare PostAmble(null)		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate PersonId exists
if(dPersonId = 0)
 	call ErrorHandler2("EXECUTE", "F", "PROBLEMS", "No Person ID was passed in",
 	"2055", "Missing required field: PatientId", problems_reply_out)	;008
	go to EXIT_SCRIPT
endif
 
;Populate Audit
set iRet = PopulateAudit(sUserName, dPersonId, problems_reply_out, sVersion)   ;006    ;004
if(iRet = 0)  ;004
	call ErrorHandler2("VALIDATE", "F", "PROBLEMS", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), problems_reply_out)	;008
	go to EXIT_SCRIPT
endif
 
; Get Patient Problems -- 4170162 - kia_get_problem_list
call GetProblems(null)
 
;PostAmble
call PostAmble(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(problems_reply_out)
if(iDebugFlag > 0)
	call echorecord(problems_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_problems.json")
	call echo(build2("_file : ", _file))
	call echojson(problems_reply_out, _file, 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetProblems(null) -- 4170162 - kia_get_problem_list
;  Description: This will retrieve all problems for a patient
**************************************************************************/
subroutine GetProblems(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProblems Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Setup request
	set req_in->person_id = dPersonId           ;001
	if(iIncInactive) 							;011
		set req_in->life_cycle_status_flag = 2
	else
		set req_in->life_cycle_status_flag = 0
	endif
 
	;Execute request
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUMBER,"REC",req_in,"REC",problems_reply_out)
 
	if (problems_reply_out->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "PROBLEMS", "Error retrieving Problem List (4170162)",
		"9999", "Error retrieving Problem List (4170162)", problems_reply_out)	;008
		go to EXIT_SCRIPT
	else
		set problems_reply_out->person_id = dPersonId
		call ErrorHandler("EXECUTE", "S", "PROBLEMS", "Success retrieving Problem List", problems_reply_out)
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetProblems Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps on problems here
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set prbCnt = size(problems_reply_out->problem,5)
 
	if(iDebugFlag > 0)
		call echo("ProblemsPostProcessing...")
		call echo(build("icd9 code: ",icd9code))
		call echo(build("icd10 code: ",icd10code))
		call echo(build("snomed : ",snomed))
		call echo(build("problem count: ",prbCnt))
	endif
 
	/*002 Begin */
	for(x = 1 to prbCnt)
		set sCKI =
			SUBSTRING(FINDSTRING("!", problems_reply_out->problem[x].concept_cki, 1)+1,
				TEXTLEN(problems_reply_out->problem[x].concept_cki), problems_reply_out->problem[x].concept_cki)
	 	call echo(build("sCKI: ",sCKI))
		if (problems_reply_out->problem[x]->source_vocabulary_cd = snomed)
			set problems_reply_out->problem[x]->snomed = sCKI
		elseif (problems_reply_out->problem[x]->source_vocabulary_cd = icd9code)
			set problems_reply_out->problem[x]->icd9code = sCKI
		elseif (problems_reply_out->problem[x]->source_vocabulary_cd = icd10code)
			set problems_reply_out->problem[x]->icd10code = sCKI
		endif
 
		set problems_reply_out->problem[x]->source_string =  problems_reply_out->problem[x]->annotated_display ;005
		set problems_reply_out->problem[x].person_id = problems_reply_out->person_id
	endfor
	/*002 End */
	
	;012 - Add updt_dt_tm to payload
	select into "nl:"
	from (dummyt d with seq = prbCnt)
		, problem p
	plan d
	join p where p.problem_instance_id = problems_reply_out->problem[d.seq].problem_instance_id
	detail
		problems_reply_out->problem[d.seq].updt_dt_tm = p.updt_dt_tm
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end go
