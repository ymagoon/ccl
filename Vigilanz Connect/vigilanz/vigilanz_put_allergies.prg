/*~BB~**********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:     snsro_put_allergies.prg
      Object name:          vigilanz_put_allergies
      Program purpose:      Update patient with NKA and update allergies reviewed datetime
      Tables read:          NONE
      Tables updated:       ALLERGY
      Services: 			680500 MSVC_GetPrivilegesByCodes
      						101706 pm_ens_allergy
      Executing from:     	MPages Discern Web Service
      Special Notes:      	NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      	   *
 ***********************************************************************
 Mod Date     Engineer             Comment                            *
 --- -------- -------------------- -----------------------------------*
 001 05/29/18 RJC					Initial Write
 ******************************************************************************/
drop program vigilanz_put_allergies go
create program vigilanz_put_allergies
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Patient Id" = ""				;Required
		, "PatientIdType" = ""			;Optional - blank defaults to person id
		, "Allergy Ids:" = ""			;Required if NKA option isn't provided
		, "NoKnownAllergies" = ""		;Required if AllergyIds aren't provided
		, "ReviewedStatusId"	= ""	;Ignored in Cerner - reviewed date/time always gets updated with this endpoint
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, PATIENT_ID, PATIENT_ID_TYPE, ALLERGY_IDS, NKA, REVIEWED, DEBUG_FLAG
 
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
 
;Allergy Ids
free record AllergyIds
record AllergyIds (
	1 qual[*]
		2 allergy_id = f8
		2 nka = i2
)
 
; Final reply structure
free record allergy_reply_out
record allergy_reply_out(
  1 allergy_id					= f8
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
declare sPatientId				= vc with protect, noconstant("")
declare dPatientIdType			= f8 with protect, noconstant(0.0)
declare sAllergyIds				= vc with protect, noconstant("")
declare iNKA					= i2 with protect, noconstant(0)
declare iDebugFlag				= i2 with protect, noconstant(0)
 
;Constants
declare UTCmode					= i2 with protect, constant(CURUTC)
declare c_timezone				= i4 with protect, constant(CURTIMEZONEAPP)
declare c_view_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWALLERGY"))
declare c_review_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"REVALLERGY"))
declare c_update_allergy_priv 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDTALLERGY"))
declare c_canceled_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING",12025,"CANCELED"))
declare c_resolved_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING",12025,"RESOLVED"))
declare c_active_reaction_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12025,"ACTIVE"))
declare c_allergy_principle_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",401,"ALLERGY"))
declare c_allergy_reaction_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",12021,"ALLERGY"))
declare c_drug_substance_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",12020,"DRUG"))
 
;Other
declare dPatientId				= f8 with protect, noconstant(0.0)
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare iAllergyIdx				= f8 with protect, noconstant(0.0)
declare iNkaIdx					= i4 with protect, noconstant(0)
declare iActiveStatusCnt		= i4 with protect, noconstant(0)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPatient(null)				= null with protect
declare GetNkaNomenclatureId(null)		= null with protect
declare GetAllergyDetails(null)			= i2 with protect 	;963006 - cps_get_allergy
declare ValidateAllergyIds(null)		= null with protect
declare CheckPrivileges(null)			= i2 with protect 	;680500 MSVC_GetPrivilegesByCodes
declare PostNkaAllergy(null)			= null with protect ;101706 - PM_ENS_ALLERGY
declare ReviewAllergyIds(null)			= null with protect ;101706 - PM_ENS_ALLERGY
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input params
set sUserName						= trim($USERNAME, 3)
set sPatientId						= trim($PATIENT_ID,3)
set dPatientIdType					= cnvtreal($PATIENT_ID_TYPE)
set sAllergyIds						= trim($ALLERGY_IDS,3)
set iNKA							= cnvtint($NKA)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId						= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id				= dPrsnlId
set sPrsnlName						= GetNameFromPrsnlID(dPrsnlId)  ;defined in snsro_common
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sPatientId -> ",sPatientId))
	call echo(build("dPatientIdType -> ",dPatientIdType))
	call echo(build("sAllergyIds -> ",sAllergyIds))
	call echo(build("iNKA -> ",iNKA))
	call echo(build2("dPrsnlId -> ",dPrsnlId))
	call echo(build2("sPrsnlName -> ",sPrsnlName))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Verify PatientId exists
if(sPatientId > " ")
	call GetPatient(null)
else
	call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Missing required field: PatientId.",
	"9999", "Missing required field: PatientId", allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, allergy_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), allergy_reply_out)
  	go to exit_script
endif
 
; Validate AllergyIds exist if NKA is not checked
if(iNKA = 0 and sAllergyIds <= " ")
	call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Either AllergyIds or NoKnownAllergies is required.",
	"9999", "Either AllergyIds or NoKnownAllergies is required.", allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate AllergyIds and NKA don't exist together
if(iNKA = 1 and sAllergyIds > " ")
	call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Either AllergyIds or NoKnownAllergies is required, but not both.",
	"9999", "Either AllergyIds or NoKnownAllergies is required, but not both.", allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
;Get Patient Allergy List -- 963006 - cps_get_allergy
set iRet = GetAllergyDetails(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT ALLERGY", "Could not retrieve allergy list.",
	"1001",build("Could not retrieve allergy list."), allergy_reply_out)
  	go to exit_script
endif
 
;Validate user doesn't have allergies if NoKnownAllergies was submitted
if(iNKA = 1 and 963006_rep->allergy_qual > 0)
	if(iNkaIdx = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Cannot update patient with NoKnownAllergies when allergies already exist.",
		"9999", "Cannot update patient with NoKnownAllergies when allergies already exist.", allergy_reply_out)
		go to EXIT_SCRIPT
	else
		if(iActiveStatusCnt > 1)
			call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Cannot update patient with NoKnownAllergies when allergies already exist.",
			"9999", "Cannot update patient with NoKnownAllergies when allergies already exist.", allergy_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
endif
 
;Check Privileges -- 680500	MSVC_GetPrivilegesByCodes
set iRet = CheckPrivileges(null)
if(iRet < 3)
	call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "User does not have privileges to update allergies.",
	"9999","User does not have privileges to update allergies.", allergy_reply_out)
	go to exit_script
endif
 
;Post the allergy -- 101706 - PM_ENS_ALLERGY
if(iNKA)
	call PostNkaAllergy(null)
else
	call ValidateAllergyIds(null)
	call ReviewAllergyIds(null)
endif
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(allergy_reply_out)
 
if(idebugFlag > 0)
	call echorecord(allergy_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_patient_allergies.json")
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
			"2045",build2("Invalid PatientIdType:",dPatientIdType), allergy_reply_out)
			go to exit_script
		else
			select into "nl:"
			from person_alias pa
			where pa.person_alias_type_cd = dPatientIdType
				and pa.active_ind = 1
				and pa.beg_effective_dt_tm < sysdate
				and pa.end_effective_dt_tm > sysdate
			detail
				dPatientId = pa.person_id
			with nocounter
		endif
	else
		set dPatientId = cnvtreal(sPatientId)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPatient Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
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
 
	set 963006_req->person_id = dPatientId
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",963006_req,"REC",963006_rep)
 
	if(963006_rep->status_data.status != "F")
		set iValidate = 1
 
		for(i = 1 to 963006_rep->allergy_qual)
			if(963006_rep->allergy[i].source_string = "NKA")
				set iNkaIdx = i
			endif
 
			if(963006_rep->allergy[i].reaction_status_mean = "ACTIVE")
				set iActiveStatusCnt = iActiveStatusCnt + 1
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
;  Name: PostNkaAllergy(null) = null
;  Description:  Post NKA
**************************************************************************/
subroutine PostNkaAllergy(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostNkaAllergy Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare dNkaNomenclatureId = f8
	set iValidate = 0
 
 	; Post a new NKA allergy if NKA wasn't a part of the patient's profile
	if(iNkaIdx = 0)
 
	 	; Find the NKA nomenclature id
	 	select into "nl:"
	 	from nomenclature n
	 	where n.source_string = "NKA"
	 	and n.principle_type_cd = c_allergy_principle_type_cd
	 	detail
	 		dNkaNomenclatureId = n.nomenclature_id
	 		iValidate = 1
	 	with nocounter
 
	 	if(iValidate = 0)
			call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Could not find the NKA nomenclature id.",
			"9999", "Could not find the NKA nomenclature id.", allergy_reply_out)
			go to EXIT_SCRIPT
		endif
 
	 	; Setup request
	 	set 101706_req->allergy_cnt = 1
		set stat = alterlist(101706_req->allergy,1)
		set 101706_req->allergy[1].person_id = dPatientId
		set 101706_req->allergy[1].substance_nom_id = dNkaNomenclatureId
		set 101706_req->allergy[1].reaction_class_cd = c_allergy_reaction_class_cd
		set 101706_req->allergy[1].reaction_status_cd = c_active_reaction_status_cd
		set 101706_req->allergy[1].reviewed_dt_tm = cnvtdatetime(curdate,curtime3)
		set 101706_req->allergy[1].reviewed_prsnl_id = dPrsnlId
		set 101706_req->allergy[1].reviewed_tz = c_timezone
		set 101706_req->allergy[1].active_ind = 1
		set 101706_req->disable_inactive_person_ens = 1
 
	else
	 	if(963006_rep->allergy[iNkaIdx].reaction_status_mean = "ACTIVE")
			call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Patient already has NoKnownAllergies documented.",
			"9999", "Patient already has NoKnownAllergies documented.", allergy_reply_out)
			go to EXIT_SCRIPT
		else
			; Activate the NKA allergy if it is inactive
			set stat = alterlist(AllergyIds->qual,1)
			set AllergyIds->qual[1].allergy_id = 963006_rep->allergy[iNkaIdx].allergy_id
			call ReviewAllergyIds(null)
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostNkaAllergy Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateAllergyIds(null) = null
;  Description: Parse comma delimited string and validate allergy ids
**************************************************************************/
subroutine ValidateAllergyIds(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateAllergyIds Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare str = vc
	set str = "-"
	set num = 1
 
	while(str != "")
		set str = trim(piece(sAllergyIds,",",num,""),3)
		if(str != "")
			set stat = alterlist(AllergyIds->qual,num)
			set AllergyIds->qual[num].allergy_id = cnvtreal(str)
 
 			select into "nl:"
 			d.seq
			from (dummyt d with seq = 963006_rep->allergy_qual)
			plan d where 963006_rep->allergy[d.seq].allergy_id = AllergyIds->qual[num].allergy_id
			detail
				if(iNkaIdx = d.seq)
					AllergyIds->qual[num].nka = 1
				endif
			with nocounter
 
			if(curqual = 0)
				call ErrorHandler2("VALIDATE", "F", "PUT ALLERGY", "Invalid AllergyId.",
				"9999",build2("Invalid AllergyId: ",trim(str)), allergy_reply_out)
				go to exit_script
			endif
 
			set num = num + 1
		endif
 	endwhile
 
	if(idebugFlag > 0)
		call echo(concat("ValidateAllergyIds Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ReviewAllergyIds(null)
;  Description: Subroutine to mark the allergy reviewed
**************************************************************************/
subroutine ReviewAllergyIds(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ReviewAllergyIds Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 961706
	set iRequest = 101706
 
 	;Setup Request
 	set allergySize = size(AllergyIds->qual,5)
 	set 101706_req->allergy_cnt = allergySize
	set stat = alterlist(101706_req->allergy,allergySize)
 
	for(i = 1 to allergySize)
		select into "nl:"
		from (dummyt d with seq = 963006_rep->allergy_qual)
		plan d where 963006_rep->allergy[d.seq].allergy_id = AllergyIds->qual[i].allergy_id
		detail
			iAllergyIdx = d.seq
		with nocounter
 
		;Reviewed
		set 101706_req->allergy[i].reviewed_dt_tm = cnvtdatetime(curdate,curtime3)
		set 101706_req->allergy[i].reviewed_tz = c_timezone
		set 101706_req->allergy[i].reviewed_prsnl_id = dPrsnlId
		set 101706_req->allergy[i].updt_id = dPrsnlId
 
		; Activate NKA allergy if requested
		if(iNKA)
			set 101706_req->allergy[i].reaction_status_cd = c_active_reaction_status_cd
			set 101706_req->allergy[i].reaction_status_dt_tm = cnvtdatetime(curdate,curtime3)
			set 101706_req->allergy[i].active_ind = 1
		else
			set 101706_req->allergy[i].reaction_status_cd = 963006_rep->allergy[iAllergyIdx].reaction_status_cd
			set 101706_req->allergy[i].reaction_status_dt_tm = 963006_rep->allergy[iAllergyIdx].reaction_status_dt_tm
			set 101706_req->allergy[i].active_ind = 963006_rep->allergy[iAllergyIdx].active_ind
	 	endif
 
		;Existing data
		set 101706_req->allergy[i].allergy_instance_id = 963006_rep->allergy[iAllergyIdx].allergy_instance_id
		set 101706_req->allergy[i].allergy_id = 963006_rep->allergy[iAllergyIdx].allergy_id
		set 101706_req->allergy[i].person_id = dPatientId
		set 101706_req->allergy[i].encntr_id = 963006_rep->allergy[iAllergyIdx].encntr_id
		set 101706_req->allergy[i].substance_nom_id = 963006_rep->allergy[iAllergyIdx].substance_nom_id
		set 101706_req->allergy[i].substance_type_cd = 963006_rep->allergy[iAllergyIdx].substance_type_cd
		set 101706_req->allergy[i].source_of_info_cd = 963006_rep->allergy[iAllergyIdx].source_of_info_cd
		set 101706_req->allergy[i].created_prsnl_id = 963006_rep->allergy[iAllergyIdx].created_prsnl_id
		set 101706_req->allergy[i].contributor_system_cd = 963006_rep->allergy[iAllergyIdx].contributor_system_cd
		set 101706_req->allergy[i].verified_status_flag = 963006_rep->allergy[iAllergyIdx].verified_status_flag
		set 101706_req->allergy[i].rec_src_vocab_cd = 963006_rep->allergy[iAllergyIdx].rec_src_vocab_cd
		set 101706_req->allergy[i].rec_src_identifier = 963006_rep->allergy[iAllergyIdx].rec_src_identifier
		set 101706_req->allergy[i].rec_src_string = 963006_rep->allergy[iAllergyIdx].rec_src_string
		set 101706_req->allergy[i].created_dt_tm = 963006_rep->allergy[iAllergyIdx].created_dt_tm
		set 101706_req->allergy[i].orig_prsnl_id = 963006_rep->allergy[iAllergyIdx].orig_prsnl_id
		set 101706_req->allergy[i].severity_cd = 963006_rep->allergy[iAllergyIdx].severity_cd
		set 101706_req->allergy[i].onset_dt_tm = 963006_rep->allergy[iAllergyIdx].onset_dt_tm
		set 101706_req->allergy[i].onset_tz = 963006_rep->allergy[iAllergyIdx].onset_tz
		set 101706_req->allergy[i].onset_precision_cd = 963006_rep->allergy[iAllergyIdx].onset_precision_cd
		set 101706_req->allergy[i].onset_precision_flag = 963006_rep->allergy[iAllergyIdx].onset_precision_flag
 
		; Reactions
		set 101706_req->allergy[i].reaction_class_cd = 963006_rep->allergy[iAllergyIdx].reaction_class_cd
		set reactionSize = size(963006_rep->allergy[iAllergyIdx].reaction,5)
		set stat = alterlist(101706_req->allergy[i]->reaction,reactionSize)
		for(x = 1 to reactionSize)
			set 101706_req->allergy[i].reaction[x].reaction_id = 963006_rep->allergy[iAllergyIdx].reaction[x].reaction_id
			set 101706_req->allergy[i].reaction[x].allergy_instance_id = 963006_rep->allergy[iAllergyIdx].allergy_instance_id
			set 101706_req->allergy[i].reaction[x].allergy_id = 963006_rep->allergy[iAllergyIdx].allergy_id
			set 101706_req->allergy[i].reaction[x].reaction_nom_id = 963006_rep->allergy[iAllergyIdx].reaction[x].reaction_nom_id
			set 101706_req->allergy[i].reaction[x].active_ind = 963006_rep->allergy[iAllergyIdx].reaction[x].active_ind
			set 101706_req->allergy[i].reaction[x].beg_effective_dt_tm = 963006_rep->allergy[iAllergyIdx].reaction[x].beg_effective_dt_tm
			set 101706_req->allergy[i].reaction[x].updt_dt_tm = cnvtdatetime(curdate,curtime3)
			set 101706_req->allergy[i].reaction[x].updt_id = dPrsnlId
		endfor
 
		;Comments
		if(963006_rep->allergy[iAllergyIdx].comment_qual > 0)
			set 101706_req->allergy[i].allergy_comment_cnt = 963006_rep->allergy[iAllergyIdx].comment_qual
			set stat = alterlist(101706_req->allergy[i].allergy_comment,963006_rep->allergy[iAllergyIdx].comment_qual)
			for(cmt = 1 to 963006_rep->allergy[iAllergyIdx].comment_qual)
				set 101706_req->allergy[i].allergy_comment[cmt].allergy_comment_id =
				963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_comment_id
				set 101706_req->allergy[i].allergy_comment[cmt].allergy_instance_id =
				963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_instance_id
				set 101706_req->allergy[i].allergy_comment[cmt].allergy_id =
				963006_rep->allergy[iAllergyIdx].allergy_id
				set 101706_req->allergy[i].allergy_comment[cmt].comment_dt_tm =
				963006_rep->allergy[iAllergyIdx].comment[cmt].comment_dt_tm
				set 101706_req->allergy[i].allergy_comment[cmt].comment_tz =
				963006_rep->allergy[iAllergyIdx].comment[cmt].comment_tz
				set 101706_req->allergy[i].allergy_comment[cmt].comment_prsnl_id =
				963006_rep->allergy[iAllergyIdx].comment[cmt].comment_prsnl_id
				set 101706_req->allergy[i].allergy_comment[cmt].allergy_comment =
				963006_rep->allergy[iAllergyIdx].comment[cmt].allergy_comment
				set 101706_req->allergy[i].allergy_comment[cmt].active_ind =
				963006_rep->allergy[iAllergyIdx].comment[cmt].active_ind
			endfor
		endif
 
		;Misc
		set 101706_req->disable_inactive_person_ens = 1
 	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",101706_req,"REC",101706_rep)
 
	if(101706_rep->status_data.status = "S")
		call ErrorHandler2("SUCCESS", "S", "PUT ALLERGY", "Allergies have been updated successfully.",
		"0000", build2("Allergies have been updated successfully."), allergy_reply_out)
	else
		call ErrorHandler2("EXECUTE", "F", "PUT ALLERGY", "Error updating allergies.",
		"9999",build2("Error updating allergies:",101706_rep->status_data.subeventstatus[1].targetobjectvalue)
		, allergy_reply_out)
		go to exit_script
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ReviewAllergyIds Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end; End Sub
 
end
go
 
 
