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
      Source file name:     snsro_post_allergy.prg
      Object name:          snsro_post_allergy
      Program purpose:      POST a new allergy in millennium
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
 001 01/12/18 DJP					Initial Write
 002 03/22/18 RJC					Added version code and copyright block
 003 03/26/18 RJC					Update reqinfo->updt_id to user_id passed in parameters
 004 05/14/18 RJC					Fixed couple of minor issues.
 005 05/30/18 RJC					Added updt* details to final tdbexecute request structure
 ******************************************************************************/
drop program snsro_post_allergy go
create program snsro_post_allergy
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        					;Required
		, "Allergen Id:" = ""						;Required
		, "Category Id" = ""						;Required
		, "Patient Id:" = ""						;Required
		, "Patient Id Type:" = ""			 		;Optional
		, "Comments:" = ""							;Optional
		, "Onset Date" = ""							;Optional
		, "Reaction Type Id:" = ""					;Optional
		, "Severity Id:" = ""						;Optional
		, "Reaction Symptom Ids" = ""				;Optional
		, "Debug Flag:" = 0							;Optional
 
with OUTDEV, USERNAME, ALLERGEN_ID, CAT_ID, PATIENT_ID,PAT_ID_TYPE, COMMENTS, ONSET_DT, REACTION_TYPE_ID, SEVERITY_ID,
 REACTION_SYMPTOM_IDS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
; Final reply structure
free record allergy_reply_out
record allergy_reply_out(
  1 allergy_id       		= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
    2 user_lastname         = vc
    2 patient_id            = f8
    2 patient_firstname     = vc
    2 patient_lastname      = vc
    2 service_version       = vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
 	  3 Description 		= vc
)
 
 free record reactions_req
 record reactions_req (
 1 reactions[*]
 	2 reaction_cd 		=f8
 	2 reaction_desc		= vc
 )
 
 
;allergy request 101706
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
 
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input params
declare sUserName			= vc with protect, noconstant("")
declare dAllergenId			= f8 with protect, noconstant(0.0)
declare dCategoryId			= f8 with protect, noconstant(0.0)
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dPatientIdType		= f8 with protect, noconstant(0.0)
declare sComments			= vc with protect, noconstant("")
declare sOnsetDate			= vc with protect, noconstant("")
declare dReactionId			= vc with protect, noconstant("")
declare dSeverityId			= f8 with protect, noconstant(0.0)
declare sReactionSymptomIds	= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Constants
declare UTCmode				= i2 with protect, constant(CURUTC)
declare c_view_allergy_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWALLERGY"))
declare c_review_allergy_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"REVALLERGY"))
declare c_update_allergy_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDTALLERGY"))
declare c_active_reaction_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",12025,"ACTIVE")) ;004
 
;Othet
declare dPrsnlId			= f8 with protect, noconstant(0.0)
declare dOnsetDateCd			= f8 with protect, noconstant(0.0)
declare qOnsetDt				= dq8 with protect, noconstant(0)
declare iOnsetFlag				= i2 with protect, noconstant(0)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
 declare CheckPrivileges(null)							= i2 with protect 	;680500 MSVC_GetPrivilegesByCodes
 declare ValidateOnsetDate(null)						= null with protect
 declare PostAllergy(null)								= null with protect
 declare ParseReactionSymptoms(sReactionSymptomIds) 	= vc with protect
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName							= trim($USERNAME, 3)
set dAllergenId						    = cnvtreal($ALLERGEN_ID)
set dCategoryId							= cnvtreal($CAT_ID)
set dPatientId							= cnvtreal($PATIENT_ID)
;set dEncntrId							= cnvtreal($ENCNTR_ID)
set dPatientIdType					= cnvtreal($PAT_ID_TYPE)
set sOnsetDate							= trim($ONSET_DT,3)
set dReactionTypeId					= cnvtreal($REACTION_TYPE_ID)
set dSeverityId							= cnvtreal($SEVERITY_ID)
set sReactionSymptomIds			= trim($REACTION_SYMPTOM_IDS)
set sComments							= trim($COMMENTS)
set dPrsnlID							= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id					= dPrsnlID						;003
set sPrsnlName							= GetNameFromPrsnlID(dPrsnlID)  ;defined in snsro_common
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dAllergenId -> ",dAllergenId))
	call echo(build("dCategoryId -> ",dCategoryId))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("dPatientIdType -> ",dPatientIdType))
	call echo(build("sOnsetDate -> ",sOnsetDate))
	call echo(build("dReactionTypeId -> ",dReactionTypeId))
	call echo(build("dSeverityId -> ",dSeverityId))
	call echo(build("sReactionSymptomIds -> ",sReactionSymptomIds))
	call echo(build("sComments -> ",sComments))
	call echo(build2("dPrsnlID -> ",dPrsnlID))
	call echo(build2("sPrsnlName -> ",sPrsnlName))
	call echo(build("iDebugFlag -> ",iDebugFlag))
	call echo(build(" View Allergy Priv --> " , c_view_allergy_priv))
	call echo(build(" Review Allergy Priv --> " , c_review_allergy_priv))
	call echo(build(" Update Allergy Priv --> " , c_update_allergy_priv))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
;Verify Person Id exists
 if(dPatientId = 0)
	call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Missing required field: Person ID.",
	"2055", "Missing required field: Person ID", allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
; Verify PatientIdType is valid and get correct Person ID, assign to dPatientId
if (dPatientIdType > 0)
	set iRet = GetCodeSet(dPatientIdType)
	if(iRet != 4)
		call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Invalid PatientIdTypeId.",
		"2026", build("Invalid PatientIdTypeId: ",dPatientIdType), allergy_reply_out)
		go to EXIT_SCRIPT
	else
		select pa.person_id
		from person_alias pa
		where pa.alias = cnvtstring(dPatientId)
			and pa.person_alias_type_cd = dPatientIdType
			and pa.active_ind = 1
		detail
			dPatientId = pa.person_id ; change from alias to Person Id
	endif
endif
 
;Verify allergen exists and allergen code is valid
if (dAllergenId > 0)
 	select into "nl:"
 	from nomenclature
	where nomenclature_id = dAllergenId
 
	if (curqual = 0)
		call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Missing required field: Allergen ID.",
		"2086", build("Invalid Allergen ID: ",dAllergenId), allergy_reply_out)
		go to EXIT_SCRIPT
	endif
else
	call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Missing required field: Allergen ID.",
	"2086", build("Invalid Allergen ID: ",dAllergenId), allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, allergy_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("POST ALLERGY", "F", "User is invalid", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), allergy_reply_out)
  	go to exit_script
endif
 
; Validate the Category Id
set iRet = GetCodeSet(dCategoryId)
if(iRet != 12020)
	call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Invalid field id : CategoryID.",
	"2026", build("Invalid Category ID: ",dCategoryId), allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Reaction Type Id
set iRet = GetCodeSet(dReactionTypeId)
if(iRet !=  12021)
	call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Invalid field id : ReactionTypeID.",
	"2091", build("Invalid ReactionTypeID: ",dReactionTypeId), allergy_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate severity id
if(dSeverityId > 0)
	set iRet = GetCodeSet(dSeverityId)
	if(iRet != 12022)
		call ErrorHandler2("POST ALLERGY", "F", "Invalid URI Parameters", "Invalid field id : SeverityID.",
		"2087", build("Invalid Severity ID: ",dSeverityId), allergy_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Validate Reaction Symptom Ids
if (sReactionSymptomIds != "")
	call ParseReactionSymptoms(sReactionSymptomIds)
endif
 
; Check Privileges - 680500	MSVC_GetPrivilegesByCodes
set iRet = CheckPrivileges(null)
if(iRet < 3)
	call ErrorHandler2("POST ALLERGY", "F", "Privileges", "User does not have privileges to post allergies.",
	"9999","User does not have privileges to post allergies.", allergy_reply_out)
	go to exit_script
endif
 
; Validate onset date
call ValidateOnsetDate(null)
 
;Post the allergy
call PostAllergy(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(allergy_reply_out)
 
if(idebugFlag > 0)
	call echorecord(allergy_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_allergy.json")
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
;  Name: PostAllergy()
;  Description: Subroutine to post the allergy
;
**************************************************************************/
subroutine PostAllergy(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAllergy Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 961706
	set iRequest = 101706
 
 	set 101706_req->allergy_cnt = 1
	set stat = alterlist(101706_req->allergy,1)
	set 101706_req->allergy[1].person_id  = dPatientId
	set 101706_req->allergy[1].substance_nom_id = dAllergenId
	set 101706_req->allergy[1].substance_type_cd = dCategoryId
	set 101706_req->allergy[1].reaction_class_cd  = dReactionTypeId
	set 101706_req->allergy[1].severity_cd = dSeverityId
	set 101706_req->allergy[1].onset_tz = CURTIMEZONEAPP
	set 101706_req->allergy[1].reaction_status_cd = c_active_reaction_status_cd ;004
	set 101706_req->allergy[1].reviewed_dt_tm = cnvtdatetime(curdate,curtime3)
	set 101706_req->allergy[1].reviewed_tz = CURTIMEZONEAPP
	set 101706_req->allergy[1].reviewed_prsnl_id = dPrsnlId
	set 101706_req->allergy[1].active_ind = 1
	set 101706_req->allergy[1].updt_id = dPrsnlId ;005
	
 	;Onset Date
 	set 101706_req->allergy[1].onset_precision_cd = dOnsetDateCd
	set 101706_req->allergy[1].onset_dt_tm = qOnsetDt
	;10 = not entered, 20 = date, 30 = week of, 40 = month, 50 = year, 60 = date and time
	set 101706_req->allergy[1].onset_precision_flag = iOnsetFlag
 
 	;Reactions
	set reactions = size(reactions_req->reactions,5)
	set stat = alterlist(101706_req->allergy->reaction,reactions)
	set 101706_req->allergy[1]->reaction_cnt = reactions
	for (idx = 1 to reactions)
		set 101706_req->allergy[1]->reaction[idx]->reaction_nom_id = reactions_req->reactions[idx].reaction_cd
		set 101706_req->allergy[1]->reaction[idx]->active_ind = 1
		set 101706_req->allergy[1]->reaction[idx]->beg_effective_dt_tm = cnvtdatetime(curdate,curtime3)
		set 101706_req->allergy[1]->reaction[idx].updt_dt_tm = cnvtdatetime(curdate,curtime3) ;005
		set 101706_req->allergy[1]->reaction[idx].updt_id = dPrsnlId ;005
	endfor
 
 	;Comments
	if(sComments > " ")
		set 101706_req->allergy[1].allergy_comment_cnt = 1
		set stat = alterlist(101706_req->allergy[1].allergy_comment,1)
		set 101706_req->allergy[1].allergy_comment[1].comment_dt_tm = cnvtdatetime(curdate,curtime3)
		set 101706_req->allergy[1].allergy_comment[1].comment_tz = CURTIMEZONEAPP
		set 101706_req->allergy[1].allergy_comment[1].comment_prsnl_id = dPrsnlId
		set 101706_req->allergy[1].allergy_comment[1].allergy_comment = sComments
		set 101706_req->allergy[1].allergy_comment[1].active_ind = 1
	endif
 
	set 101706_req->disable_inactive_person_ens = 1
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",101706_req,"REC",101706_rep)
 
 	if(101706_rep->status_data.status != "F")
		set allergy_reply_out->allergy_id  = 101706_rep->allergy[1].allergy_id
		
	  	call ErrorHandler2("POST ALLERGY", "S", "Process completed", "Allergy has been created successfully",
		"0000", build2("Allergy ID: ",allergy_reply_out->allergy_id, " has been created."), allergy_reply_out)
	else
		call ErrorHandler2("POST ALLERGY", "F", "Execute", "Error adding allergy.",
		"9999",build2("Error adding allergy: ",101706_rep->status_data.subeventstatus.targetobjectvalue), allergy_reply_out)
		go to exit_script
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostAllergy Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end; subroutine Post Allergy
/*************************************************************************
;  Name: ParseReactionSymptoms(sReactionSymptomIds = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseReactionSymptoms(sReactionSymptomIds)
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	declare sOfReactions		= i4 with noconstant(0)
 
	set sOfReactions = size(reactions_req,5)
	call echo(build("size of Reactions array:---->", sOfReactions))
	call echo(build("sReactionSymptomIds in subroutine to parse    ", sReactionSymptomIds))
 
	if(sReactionSymptomIds != "")
	 	while (str != notfnd)
	     	set str =  piece(sReactionSymptomIds,',',num,notfnd)
 
	     	if(str != notfnd)
	      		set stat = alterlist(reactions_req->reactions, num)
	     		set reactions_req->reactions[num]->reaction_cd = cnvtint(str)
 
	     		select into "nl:"
	     		from nomenclature
				where nomenclature_id = reactions_req->reactions[num]->reaction_cd
 
	     		if (curqual = 0)
	     			call ErrorHandler2("EXECUTE", "F", "POST ALLERGY", build("Invalid Reaction Code: ",reactions_req->reactions[num]->
					reaction_cd),"2088", build("Invalid Reaction Code: ",trim(str,3)), allergy_reply_out)
 
					set stat = alterlist(allergy_reply_out->reaction,0)
 
					go to exit_ecript
				endif
 
	        endif
 
	      	set num = num + 1
 
	 	endwhile
	endif
 
end ;subroutine Parse Reaction Ids
 
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
;  Name: ValidateOnsetDate(null) = null
;  Description:  Build onset fields based on input
**************************************************************************/
subroutine ValidateOnsetDate(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateOnsetDate Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;onset_dt_flag values
	; 10.0  not entered
    ; 20.0	day
    ; 30.0  week
    ; 40.0	month
    ; 50.0	year
    ; 60.0  date and time
 
	if(sOnsetDate = "")
		set dOnsetDateCd = uar_get_code_by("MEANING",25320,"NOTENTERED")
		set iOnsetFlag = 10
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
					set iOnsetFlag = 50 ;year
					set qOnsetDt = cnvtdatetime(cnvtdate(build(month,day,trim(sOnsetDate,3))),0)
				of 7:
					set iOnsetFlag = 40 ;month
						set mo = substring(1,2,trim(sOnsetDate,3))
						set yr = substring(4,4,trim(sOnsetDate,3))
						set qOnsetDt = cnvtdatetime(cnvtdate(build(mo,day,yr)),0)
				of 10:
					set iOnsetFlag = 20 ;day
					set qOnsetDt = cnvtdatetime(cnvtdate2(trim(sOnsetDate,3),"MM/DD/YYYY"),0)
				else
					call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), allergy_reply_out)
					go to exit_script
			endcase
 
			if(qOnsetDt = 0)
				call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate format.",
				"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), allergy_reply_out)
				go to exit_script
			endif
		else
			if(first = last)
				set prep = cnvtupper(trim(piece(sOnsetDate," ",1,"NF"),3))
				set date = trim(piece(sOnsetDate," ",2,"NF"),3)
 
				set dOnsetDateCd = uar_get_code_by("MEANING",25320,prep)
 
				if(dOnsetDateCd < 1)
					call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate preposition",
					"9999",build2("Invalid OnsetDate preposition: ",prep), allergy_reply_out)
					go to exit_script
				endif
 
				case(size(date,1))
					of 4:
						set iOnsetFlag = 50 ;year
						set qOnsetDt = cnvtdatetime(cnvtdate(build(month,day,date)),0)
					of 7:
						set iOnsetFlag = 40 ;month
						set mo = substring(1,2,date)
						set yr = substring(4,4,date)
						set qOnsetDt = cnvtdatetime(cnvtdate(build(mo,day,yr)),0)
					of 10:
						set iOnsetFlag = 20 ;day
						set qOnsetDt = cnvtdatetime(cnvtdate2(date,"MM/DD/YYYY"),0)
					else
						call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate format.",
						"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), allergy_reply_out)
						go to exit_script
				endcase
 
				if(qOnsetDt = 0)
					call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate format.",
					"9999",build2("Valid formats are YYYY, MM/YYYY, MM/DD/YYYY"), allergy_reply_out)
					go to exit_script
				endif
			else
				call ErrorHandler2("POST ALLERGY", "F", "Validate", "Invalid OnsetDate format.",
				"9999","Invalid OnsetDate format.", allergy_reply_out)
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
 
end
go
 
