/*~BB~**********************************************************************************
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
  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:     snsro_delete_allergy.prg
      Object name:          snsro_delete_allergy
      Program purpose:    Cancel/Resolve an allergy id in millennium
      Tables read:          	NONE
      Tables updated:		ALLERGY
      Services: 				963006 - cps_get_allergy
									680500 MSVC_GetPrivilegesByCodes
									101706 pm_ens_allergy
      Executing from:     	MPages Discern Web Service
      Special Notes:      	NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      	   *
 ***********************************************************************
 Mod Date     Engineer             Comment                            *
 --- -------- -------------------- -----------------------------------*
 001 05/14/18 RJC					Initial Write
 ******************************************************************************/
drop program snsro_delete_allergy go
create program snsro_delete_allergy
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        			;Required
		, "Allergy Id:" = ""				;Required
		, "Status Id" = ""					;Required
		, "ReasonId" = ""					;Required
		, "Resolved Date" = ""				;Ignored in Cerner
		, "Comments:" = ""					;Optional
		, "Debug Flag:" = 0					;Optional
 
with OUTDEV, USERNAME, ALLERGY_ID, STATUS, REASON_ID, RESOLVED_DT, COMMENTS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;963006 - cps_get_allergy
free record 963006_req
record 963006_req (
  1 person_id = f8
)
 
free record 963006_rep
record 963006_rep (
   1 person_org_sec_on = i2
   1 allergy_qual = i4
   1 allergy [* ]
     2 allergy_id = f8
     2 allergy_instance_id = f8
     2 encntr_id = f8
     2 organization_id = f8
     2 source_string = vc
     2 substance_nom_id = f8
     2 substance_ftdesc = vc
     2 substance_type_cd = f8
     2 substance_type_disp = c40
     2 substance_type_mean = c12
     2 reaction_class_cd = f8
     2 reaction_class_disp = c40
     2 reaction_class_mean = c12
     2 severity_cd = f8
     2 severity_disp = c40
     2 severity_mean = c12
     2 source_of_info_cd = f8
     2 source_of_info_disp = c40
     2 source_of_info_mean = c12
     2 onset_dt_tm = dq8
     2 onset_tz = i4
     2 onset_precision_cd = f8
     2 onset_precision_disp = c40
     2 onset_precision_flag = i2
     2 reaction_status_cd = f8
     2 reaction_status_disp = c40
     2 reaction_status_mean = c12
     2 reaction_status_dt_tm = dq8
     2 created_dt_tm = dq8
     2 created_prsnl_id = f8
     2 created_prsnl_name = vc
     2 reviewed_dt_tm = dq8
     2 reviewed_tz = i4
     2 reviewed_prsnl_id = f8
     2 reviewed_prsnl_name = vc
     2 cancel_reason_cd = f8
     2 cancel_reason_disp = c40
     2 active_ind = i2
     2 orig_prsnl_id = f8
     2 orig_prsnl_name = vc
     2 updt_id = f8
     2 updt_name = vc
     2 updt_dt_tm = dq8
     2 cki = vc
     2 concept_source_cd = f8
     2 concept_source_disp = c40
     2 concept_source_mean = c12
     2 concept_identifier = vc
     2 cancel_dt_tm = dq8
     2 cancel_prsnl_id = f8
     2 cancel_prsnl_name = vc
     2 beg_effective_dt_tm = dq8
     2 beg_effective_tz = i4
     2 end_effective_dt_tm = dq8
     2 data_status_cd = f8
     2 data_status_dt_tm = dq8
     2 data_status_prsnl_id = f8
     2 contributor_system_cd = f8
     2 source_of_info_ft = vc
     2 active_status_cd = f8
     2 active_status_dt_tm = dq8
     2 active_status_prsnl_id = f8
     2 rec_src_identifier = vc
     2 rec_src_string = vc
     2 rec_src_vocab_cd = f8
     2 verified_status_flag = i2
     2 reaction_qual = i4
     2 cmb_instance_id = f8
     2 cmb_flag = i2
     2 cmb_prsnl_id = f8
     2 cmb_prsnl_name = vc
     2 cmb_person_id = f8
     2 cmb_person_name = vc
     2 cmb_dt_tm = dq8
     2 cmb_tz = i4
     2 reaction [* ]
       3 allergy_instance_id = f8
       3 reaction_id = f8
       3 reaction_nom_id = f8
       3 source_string = vc
       3 reaction_ftdesc = vc
       3 beg_effective_dt_tm = dq8
       3 active_ind = i2
       3 end_effective_dt_tm = dq8
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = f8
       3 contributor_system_cd = f8
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 cmb_reaction_id = f8
       3 cmb_flag = i2
       3 cmb_prsnl_id = f8
       3 cmb_prsnl_name = vc
       3 cmb_person_id = f8
       3 cmb_person_name = vc
       3 cmb_dt_tm = dq8
       3 cmb_tz = i4
     2 comment_qual = i4
     2 comment [* ]
       3 allergy_comment_id = f8
       3 allergy_instance_id = f8
       3 organization_id = f8
       3 comment_dt_tm = dq8
       3 comment_tz = i4
       3 comment_prsnl_id = f8
       3 comment_prsnl_name = vc
       3 allergy_comment = vc
       3 beg_effective_dt_tm = dq8
       3 beg_effective_tz = i4
       3 active_ind = i4
       3 end_effective_dt_tm = dq8
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = f8
       3 contributor_system_cd = f8
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 cmb_comment_id = f8
       3 cmb_flag = i2
       3 cmb_prsnl_id = f8
       3 cmb_prsnl_name = vc
       3 cmb_person_id = f8
       3 cmb_person_name = vc
       3 cmb_dt_tm = dq8
       3 cmb_tz = i4
     2 sub_concept_cki = vc
     2 source_vocab_cd = f8
     2 primary_vterm_ind = i2
     2 active_status_prsnl_name = vc
   1 adr_knt = i4
   1 adr [* ]
     2 activity_data_reltn_id = f8
     2 person_id = f8
     2 activity_entity_name = vc
     2 activity_entity_id = f8
     2 activity_entity_inst_id = f8
     2 reltn_entity_name = vc
     2 reltn_entity_id = f8
     2 reltn_entity_all_ind = i2
   1 display_allergy_mode = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c8
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = c100
)
 
;101706 - PM_ENS_ALLERGY
free record 101706_req
record 101706_req (
  1 allergy_cnt = i4
  1 allergy [*]
    2 allergy_instance_id = f8
    2 allergy_id = f8
    2 person_id = f8
    2 encntr_id = f8
    2 substance_nom_id = f8
    2 substance_ftdesc = vc
    2 substance_type_cd = f8
    2 reaction_class_cd = f8
    2 severity_cd = f8
    2 source_of_info_cd = f8
    2 source_of_info_ft = vc
    2 onset_dt_tm = dq8
    2 onset_tz = i4
    2 onset_precision_cd = f8
    2 onset_precision_flag = i2
    2 reaction_status_cd = f8
    2 cancel_reason_cd = f8
    2 cancel_dt_tm = dq8
    2 cancel_prsnl_id = f8
    2 created_prsnl_id = f8
    2 reviewed_dt_tm = dq8
    2 reviewed_tz = i4
    2 reviewed_prsnl_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 beg_effective_dt_tm = dq8
    2 beg_effective_tz = i4
    2 end_effective_dt_tm = dq8
    2 contributor_system_cd = f8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 verified_status_flag = i2
    2 rec_src_vocab_cd = f8
    2 rec_src_identifier = vc
    2 rec_src_string = vc
    2 cmb_instance_id = f8
    2 cmb_flag = i2
    2 cmb_prsnl_id = f8
    2 cmb_person_id = f8
    2 cmb_dt_tm = dq8
    2 cmb_tz = i2
    2 updt_id = f8
    2 reaction_status_dt_tm = dq8
    2 created_dt_tm = dq8
    2 orig_prsnl_id = f8
    2 reaction_cnt = i4
    2 reaction [*]
      3 reaction_id = f8
      3 allergy_instance_id = f8
      3 allergy_id = f8
      3 reaction_nom_id = f8
      3 reaction_ftdesc = vc
      3 active_ind = i2
      3 active_status_cd = f8
      3 active_status_dt_tm = dq8
      3 active_status_prsnl_id = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 contributor_system_cd = f8
      3 data_status_cd = f8
      3 data_status_dt_tm = dq8
      3 data_status_prsnl_id = f8
      3 cmb_reaction_id = f8
      3 cmb_flag = i2
      3 cmb_prsnl_id = f8
      3 cmb_person_id = f8
      3 cmb_dt_tm = dq8
      3 cmb_tz = i2
      3 updt_id = f8
      3 updt_dt_tm = dq8
    2 allergy_comment_cnt = i4
    2 allergy_comment [*]
      3 allergy_comment_id = f8
      3 allergy_instance_id = f8
      3 allergy_id = f8
      3 comment_dt_tm = dq8
      3 comment_tz = i4
      3 comment_prsnl_id = f8
      3 allergy_comment = vc
      3 active_ind = i2
      3 active_status_cd = f8
      3 active_status_dt_tm = dq8
      3 active_status_prsnl_id = f8
      3 beg_effective_dt_tm = dq8
      3 beg_effective_tz = i4
      3 end_effective_dt_tm = dq8
      3 contributor_system_cd = f8
      3 data_status_cd = f8
      3 data_status_dt_tm = dq8
      3 data_status_prsnl_id = f8
      3 cmb_comment_id = f8
      3 cmb_flag = i2
      3 cmb_prsnl_id = f8
      3 cmb_person_id = f8
      3 cmb_dt_tm = dq8
      3 cmb_tz = i2
      3 updt_id = f8
      3 updt_dt_tm = dq8
    2 sub_concept_cki = vc
    2 pre_generated_id = f8
  1 disable_inactive_person_ens = i2
  1 fail_on_duplicate = i2
)
 
free record 101706_rep
record 101706_rep (
    1 person_org_sec_on = i2
    1 allergy_cnt = i4
    1 allergy [* ]
      2 allergy_instance_id = f8
      2 allergy_id = f8
      2 adr_added_ind = i2
      2 status_flag = i2
      2 reaction_cnt = i4
      2 reaction [* ]
        3 reaction_id = f8
        3 status_flag = i2
      2 allergy_comment_cnt = i4
      2 allergy_comment [* ]
        3 allergy_comment_id = f8
        3 status_flag = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;680500 - MSVC_GetPrivilegesByCodes
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
 
; Final reply structure
free record allergy_reply_out
record allergy_reply_out(
  1 allergy_id       			= f8
  1 audit
    2 user_id             		= f8
    2 user_firstname        	= vc
    2 user_lastname         	= vc
    2 patient_id           		= f8
    2 patient_firstname     	= vc
    2 patient_lastname      	= vc
    2 service_version       	= vc
  1 status_data
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
 	  3 Description 			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input params
declare sUserName				= vc with protect, noconstant("")
declare dAllergyId				= f8 with protect, noconstant(0.0)
declare dStatusId				= f8 with protect, noconstant(0.0)
declare sComments				= vc with protect, noconstant("")
declare qResolvedDate			= dq8 with protect, noconstant(0)
declare dReasonId				= f8 with protect, noconstant(0.0)
declare iDebugFlag				= i2 with protect, noconstant(0)
 
;Constants
declare UTCmode					= i2 with protect, constant(CURUTC)
declare c_timezone				= i4 with protect, constant(CURTIMEZONEAPP)
declare c_view_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWALLERGY"))
declare c_review_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"REVALLERGY"))
declare c_update_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDTALLERGY"))
declare c_canceled_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING",12025,"CANCELED"))
declare c_resolved_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING",12025,"RESOLVED"))
 
;Other
declare dPatientId				= f8 with protect, noconstant(0.0)
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare iAllergyIdx				= i4 with protect, noconstant(0)
declare iNkaIdx					= i4 with protect, noconstant(0)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAllergyDetails(null)	= i2 with protect 	;963006 - cps_get_allergy
declare CheckPrivileges(null)	= i2 with protect 	;680500 MSVC_GetPrivilegesByCodes
declare PostAllergy(null)		= null with protect ;101706 - PM_ENS_ALLERGY
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input params
set sUserName					= trim($USERNAME, 3)
set dAllergyId					= cnvtreal($ALLERGY_ID)
set dStatusId					= cnvtreal($STATUS)
set dReasonId					= cnvtreal($REASON_ID)
set qResolvedDate				= GetDateTime(trim($RESOLVED_DT,3)) ;defined in snsro_common
set sComments					= trim($COMMENTS)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlID					= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id			= dPrsnlID
set sPrsnlName					= GetNameFromPrsnlID(dPrsnlID)  ;defined in snsro_common
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dAllergyId -> ",dAllergyId))
	call echo(build("dStatusId -> ",dStatusId))
	call echo(build("dReasonId -> ",dReasonId))
	call echo(build("qResolvedDate -> ",qResolvedDate))
	call echo(build("sComments -> ",sComments))
	call echo(build2("dPrsnlID -> ",dPrsnlID))
	call echo(build2("sPrsnlName -> ",sPrsnlName))
	call echo(build("iDebugFlag -> ",iDebugFlag))
	call echo(build("View Allergy Priv -> " , c_view_allergy_priv))
	call echo(build("Review Allergy Priv -> " , c_review_allergy_priv))
	call echo(build("Update Allergy Priv -> " , c_update_allergy_priv))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Verify AllergyId exists
 if(dAllergyId = 0)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "Missing required field: AllergyId.",
	"9999", "Missing required field: AllergyId", allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
;Get Allergy Id details -- 963006 - cps_get_allergy
set iRet = GetAllergyDetails(null)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "Invalid AllergyId",
	"1001",build("Invalid AllergyId: ",trim($ALLERGY_ID,3)), allergy_reply_out)
  	go to exit_script
endif
 
 ; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, allergy_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), allergy_reply_out)
  	go to exit_script
endif
 
;Validate StatusId and status is applicable for this endpoint
set iRet = GetCodeSet(dStatusId)
if(iRet != 12025)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "Invalid URI parameters: StatusId.",
	"2091", build("Invalid StatusId:",dStatusId), allergy_reply_out)
	go to EXIT_SCRIPT
else
	if(dStatusId not in (c_resolved_status_cd, c_canceled_status_cd))
		call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "The status update requested is not available for this endpoint.",
		"2006", build("The status update requested is not available for this endpoint."), allergy_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
;Validate ReasonId
set iRet = GetCodeSet(dReasonId)
if(iRet != 14004)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "Invalid URI parameters: ReasonId.",
	"2006", build("Invalid URI parameters: ReasonId."), allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
; Check Privileges -- 680500	MSVC_GetPrivilegesByCodes
set iRet = CheckPrivileges(null)
if(iRet < 3)
	call ErrorHandler2("VALIDATE", "F", "DELETE ALLERGY", "User does not have privileges to update allergies.",
	"9999","User does not have privileges to update allergies.", allergy_reply_out)
	go to exit_script
endif
 
;Post the allergy -- 101706 - PM_ENS_ALLERGY
call PostAllergy(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(allergy_reply_out)
 
if(idebugFlag > 0)
	call echorecord(allergy_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_delete_allergy.json")
	call echo(build2("_file : ", _file))
	call echojson(allergy_reply_out, _file, 0)
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
;  Name: GetAllergyDetails(null) = i2
;  Description: Get the details for the AllergyId
**************************************************************************/
subroutine GetAllergyDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAllergyDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 963006
	set iRequest = 963006
 
	; Get person id
	select into "nl:"
	from allergy a
	where a.allergy_id = dAllergyId
	detail
		dPatientId = a.person_id
		iValidate = 1
	with nocounter
 
	set 963006_req->person_id = dPatientId
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",963006_req,"REC",963006_rep)
 
	if(963006_rep->status_data.status != "S")
		set iValidate = 0
	else
		for(i = 1 to 963006_rep->allergy_qual)
			if(963006_rep->allergy[i].allergy_id = dAllergyId)
				set iAllergyIdx = i
			endif
			if(963006_rep->allergy[i].source_string = "NKA")
				set iNkaIdx = i
			endif
		endfor
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetAllergyDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
 /*************************************************************************
;  Name: CheckPrivileges(null) = i2 680500 MSVC_GetPrivilegesByCodes
;  Description:  Check user privileges to ensure they can add allergies
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
	set stat = alterlist(680500_req->privilege_criteria.privileges,3)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_view_allergy_priv
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = c_review_allergy_priv
	set 680500_req->privilege_criteria.privileges[3].privilege_cd = c_update_allergy_priv
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
	call echorecord(680500_rep)
 
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
;  Name: PostAllergy()
;  Description: Subroutine to post the allergy
**************************************************************************/
subroutine PostAllergy(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAllergy Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 961706
	set iRequest = 101706
 
 	;Setup Request
 	set 101706_req->allergy_cnt = 1
	set stat = alterlist(101706_req->allergy,1)
 
	;Existing data
	set 101706_req->allergy[1].allergy_instance_id = 963006_rep->allergy[iAllergyIdx].allergy_instance_id
	set 101706_req->allergy[1].allergy_id = 963006_rep->allergy[iAllergyIdx].allergy_id
	set 101706_req->allergy[1].person_id = dPatientId
	set 101706_req->allergy[1].encntr_id = 963006_rep->allergy[iAllergyIdx].encntr_id
	set 101706_req->allergy[1].substance_nom_id = 963006_rep->allergy[iAllergyIdx].substance_nom_id
	set 101706_req->allergy[1].substance_type_cd = 963006_rep->allergy[iAllergyIdx].substance_type_cd
	set 101706_req->allergy[1].source_of_info_cd = 963006_rep->allergy[iAllergyIdx].source_of_info_cd
	set 101706_req->allergy[1].created_prsnl_id = 963006_rep->allergy[iAllergyIdx].created_prsnl_id
	set 101706_req->allergy[1].contributor_system_cd = 963006_rep->allergy[iAllergyIdx].contributor_system_cd
	set 101706_req->allergy[1].verified_status_flag = 963006_rep->allergy[iAllergyIdx].verified_status_flag
	set 101706_req->allergy[1].rec_src_vocab_cd = 963006_rep->allergy[iAllergyIdx].rec_src_vocab_cd
	set 101706_req->allergy[1].rec_src_identifier = 963006_rep->allergy[iAllergyIdx].rec_src_identifier
	set 101706_req->allergy[1].rec_src_string = 963006_rep->allergy[iAllergyIdx].rec_src_string
	set 101706_req->allergy[1].created_dt_tm = 963006_rep->allergy[iAllergyIdx].created_dt_tm
	set 101706_req->allergy[1].orig_prsnl_id = 963006_rep->allergy[iAllergyIdx].orig_prsnl_id
	set 101706_req->allergy[1].active_ind = 1
	set 101706_req->disable_inactive_person_ens = 1
	set 101706_req->allergy[1].severity_cd = 963006_rep->allergy[iAllergyIdx].severity_cd
	set 101706_req->allergy[1].onset_dt_tm = 963006_rep->allergy[iAllergyIdx].onset_dt_tm
	set 101706_req->allergy[1].onset_tz = 963006_rep->allergy[iAllergyIdx].onset_tz
	set 101706_req->allergy[1].onset_precision_cd = 963006_rep->allergy[iAllergyIdx].onset_precision_cd
	set 101706_req->allergy[1].onset_precision_flag = 963006_rep->allergy[iAllergyIdx].onset_precision_flag
	set 101706_req->allergy[1].updt_id = dPrsnlId
 
	; Reactions
	set 101706_req->allergy[1].reaction_class_cd = 963006_rep->allergy[iAllergyIdx].reaction_class_cd
	set reactionSize = size(963006_rep->allergy[iAllergyIdx].reaction,5)
	set stat = alterlist(101706_req->allergy->reaction,reactionSize)
	set 101706_req->allergy[1].reaction_cnt = reactionSize
	for(x = 1 to reactionSize)
		set 101706_req->allergy[1].reaction[x].reaction_id = 963006_rep->allergy[iAllergyIdx].reaction[x].reaction_id
		set 101706_req->allergy[1].reaction[x].allergy_instance_id = 963006_rep->allergy[iAllergyIdx].allergy_instance_id
		set 101706_req->allergy[1].reaction[x].allergy_id = 963006_rep->allergy[iAllergyIdx].allergy_id
		set 101706_req->allergy[1].reaction[x].reaction_nom_id = 963006_rep->allergy[iAllergyIdx].reaction[x].reaction_nom_id
		set 101706_req->allergy[1].reaction[x].active_ind = 963006_rep->allergy[iAllergyIdx].reaction[x].active_ind
		set 101706_req->allergy[1].reaction[x].beg_effective_dt_tm = 963006_rep->allergy[iAllergyIdx].reaction[x].beg_effective_dt_tm
		set 101706_req->allergy[1].reaction[x].end_effective_dt_tm = 963006_rep->allergy[iAllergyIdx].reaction[x].end_effective_dt_tm
	endfor
 
	; Cancel/Resolved
	set 101706_req->allergy[1].reaction_status_cd = dStatusId
	set 101706_req->allergy[1].reaction_status_dt_tm = cnvtdatetime(curdate,curtime3)
	set 101706_req->allergy[1].cancel_reason_cd = dReasonId
	set 101706_req->allergy[1].cancel_dt_tm = cnvtdatetime(curdate,curtime3)
	set 101706_req->allergy[1].cancel_prsnl_id = dPrsnlId
 
	;Reviewed
	set 101706_req->allergy[1].reviewed_dt_tm = cnvtdatetime(curdate,curtime3)
	set 101706_req->allergy[1].reviewed_tz = c_timezone
	set 101706_req->allergy[1].reviewed_prsnl_id = dPrsnlId
 
	;Comments
	if(963006_rep->allergy[iAllergyIdx].comment_qual > 0)
		set 101706_req->allergy[1].allergy_comment_cnt = 963006_rep->allergy[iAllergyIdx].comment_qual
		set stat = alterlist(101706_req->allergy[1].allergy_comment,963006_rep->allergy[iAllergyIdx].comment_qual)
 
		for(cmt = 1 to 963006_rep->allergy[iAllergyIdx].comment_qual)
			set 101706_req->allergy[1].allergy_comment[cmt].allergy_comment_id =
			963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_comment_id
			set 101706_req->allergy[1].allergy_comment[cmt].allergy_instance_id =
			963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_instance_id
			set 101706_req->allergy[1].allergy_comment[cmt].allergy_id = 963006_rep->allergy[iAllergyIdx].allergy_id
			set 101706_req->allergy[1].allergy_comment[cmt].comment_dt_tm = 963006_rep->allergy[iAllergyIdx].comment[cmt].comment_dt_tm
			set 101706_req->allergy[1].allergy_comment[cmt].comment_tz = c_timezone
			set 101706_req->allergy[1].allergy_comment[cmt].comment_prsnl_id =
			963006_rep->allergy[iAllergyIdx].comment[cmt].comment_prsnl_id
			set 101706_req->allergy[1].allergy_comment[cmt].allergy_comment = 963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_comment
			set 101706_req->allergy[1].allergy_comment[cmt].active_ind = 963006_rep->allergy[iAllergyIdx].comment[cmt].active_ind
		endfor
	endif
 
	if(sComments > " ")
		set commSize = value(963006_rep->allergy[iAllergyIdx].comment_qual + 1)
		set stat = alterlist(101706_req->allergy[1].allergy_comment,commSize)
		set 101706_req->allergy[1].allergy_comment_cnt = commSize
		set 101706_req->allergy[1].allergy_comment[commSize].active_ind = 1
		set 101706_req->allergy[1].allergy_comment[commSize].comment_dt_tm = cnvtdatetime(curdate,curtime3)
		set 101706_req->allergy[1].allergy_comment[commSize].comment_tz = c_timezone
		set 101706_req->allergy[1].allergy_comment[commSize].comment_prsnl_id = dPrsnlId
		set 101706_req->allergy[1].allergy_comment[commSize].allergy_comment = sComments
	endif
	
	set 101706_req->allergy[1].allergy_comment_cnt = size(101706_req->allergy[1].allergy_comment,5)
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",101706_req,"REC",101706_rep)
 
	if(101706_rep->status_data.status = "S")
		set allergy_reply_out->allergy_id  = 101706_rep->allergy[1].allergy_id
		call ErrorHandler2("SUCCESS", "S", "DELETE ALLERGY", "Allergy has been updated successfully",
		"0000", build2("Allergy ID: ",allergy_reply_out->allergy_id, " has been updated."), allergy_reply_out)
	else
		call ErrorHandler2("EXECUTE", "F", "DELETE ALLERGY", "Error updating allergy.",
		"9999",build2("Error updating allergy:",101706_rep->status_data.subeventstatus[1].targetobjectvalue)
		, allergy_reply_out)
		go to exit_script
	endif
 
end; End Sub
 
end
go
 
