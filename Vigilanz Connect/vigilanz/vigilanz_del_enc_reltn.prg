/*********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**********************************************************************
      Source file name: snsro_del_enc_reltn.prg
      Object name:      vigilanz_del_enc_reltn
      Program purpose:  Updates an encounter person relation in Millennium.
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
  001 01/21/20 RJC		Initial Write
  002 03/31/20 RJC		Fixed lock check
***********************************************************************/
drop program vigilanz_del_enc_reltn go
create program vigilanz_del_enc_reltn
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "EncounterRelationshipId"		;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, ENC_RELTN_ID, DEBUG_FLAG
 
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
;100080 - PM_LOCK_GET_LOCKS
free record 100080_req
record 100080_req (
  1 person_id = f8
  1 super_user = i2
  1 mode = i2
  1 unmask_alias = i2
)
 
free record 100080_rep
record 100080_rep (
    1 person [* ]
      2 person_id = f8
      2 user_id = f8
      2 user_name = vc
      2 name = vc
      2 mrn = vc
      2 gender = vc
      2 birth_date = dq8
      2 birth_tz = i4
      2 lockkeyid = i4
      2 entname = vc
      2 user_name_full = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;100081 - PM_LOCK_ADD_LOCK
free record 100081_req
record 100081_req (
  1 person_id = f8
)
 
free record 100081_rep
record 100081_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
;100082 - PM_LOCK_DEL_LOCKS
free record 100082_req
record 100082_req (
  1 person [*]
    2 person_id = f8
)
 
free record 100082_rep
record 100082_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
; Final reply
free record encounter_reply_out
record encounter_reply_out(
  1 encounter_reltn_id      = f8
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
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username								= vc
	1 prsnl_id								= f8
	1 patient_id 							= f8
	1 encntr_id								= f8
	1 encntr_reltn_id						= f8
	1 person_reltn_id						= f8
	1 related_person_id						= f8
	1 person_reltn_type_cd					= f8
	1 related_person_reltn_cd 				= f8
	1 family_reltn_sub_type_cd				= f8
)
 
; Constants
declare c_error_handler						= vc with protect, constant("DELETE ENCOUNTER RELATION")
declare c_now_dt_tm							= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_insured_person_reltn_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare UpdateEncounter(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag = cnvtint($DEBUG_FLAG)
set input->username = trim($USERNAME, 3)
set input->prsnl_id = GetPrsnlIDfromUserName(input->username)
set input->encntr_reltn_id = cnvtreal($ENC_RELTN_ID)
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, encounter_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Create the Encounter
set iRet = UpdateEncounter(null)
if(iRet = 0)
  	  call ErrorMsg("Could not post encounter relationship.","9999","E")
else
	call ErrorHandler2("POST ENCOUNTER", "S", "Post Encounter", "Encounter relationship deleted successfully.",
  	"0000",build2("Encounter relationship deleted successfully."), encounter_reply_out)
 
  	set encounter_reply_out->encounter_reltn_id = input->encntr_reltn_id
endif
 
#EXIT_SCRIPT
 
; Delete Lock - 100082
if(100081_rep->status_data.status = "S")
	set iRet = DeleteLock(null)
	if(iRet = 0) call ErrorMsg("Could not delete patient lock (100082).","9999","E") endif
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(encounter_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_encounter_reltn.json")
	call echo(build2("_file : ", _file))
	call echojson(encounter_reply_out, _file, 0)
	call echorecord(encounter_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ErrorMsg(msg = vc, error_code = c4, type = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for input params
**************************************************************************/
subroutine ErrorMsg(msg, error_code, type)
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), encounter_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), encounter_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, encounter_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate EncounterRelationshipId
	if(input->encntr_reltn_id = 0)
		call ErrorMsg("EncounterRelationshipId","2055","M")
	else
		select into "nl:"
		from encntr_person_reltn epr
			,encounter e
		plan epr where epr.encntr_person_reltn_id = input->encntr_reltn_id
			and epr.active_ind = 1
			and epr.beg_effective_dt_tm <= sysdate
			and epr.end_effective_dt_tm > sysdate
		join e where e.encntr_id = epr.encntr_id
		detail
			input->encntr_id = epr.encntr_id
			input->patient_id = e.person_id
			input->related_person_id = epr.related_person_id
			input->person_reltn_type_cd = epr.person_reltn_type_cd
			input->related_person_reltn_cd = epr.related_person_reltn_cd
			input->family_reltn_sub_type_cd = epr.family_reltn_sub_type_cd
		with nocounter
 
		if(input->encntr_id = 0)
			call ErrorMsg("EncounterRelationshipId","2055","I")
		endif
	endif
 
	;Get PersonRelationshipId if it exists
	select into "nl:"
	from person_person_reltn ppr
	plan ppr where ppr.person_id = input->patient_id
		and ppr.related_person_id = input->related_person_id
		and ppr.person_reltn_type_cd = input->person_reltn_type_cd
		and ppr.related_person_reltn_cd = input->related_person_reltn_cd
		and ppr.family_reltn_sub_type_cd = input->family_reltn_sub_type_cd
	detail
		input->person_reltn_id = ppr.person_person_reltn_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetLocks(null) = i2
;  Description: Request 100080 - Get patient locks
**************************************************************************/
subroutine GetLocks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100080
 
 	; Setup request
	set 100080_req->person_id = input->patient_id
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		if(size(100080_rep->person,5) = 0)
			set iValidate = 1
		else
			call ErrorMsg("Person is locked. Please try updating again later.","9999","E")
		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2
;  Description:  Request 100081 - create patient lock
**************************************************************************/
subroutine AddLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100081
 
	set 100081_req->person_id = input->patient_id
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100081_req,"REC",100081_rep)
	if(100081_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateEncounter(null) = null
;  Description:  Request 3200154 - post a new encounter
**************************************************************************/
subroutine UpdateEncounter(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateEncounter Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Update object
	set rSize = size(pm_obj_req->person.person_person_reltn,5) + 1
	set stat = alterlist(pm_obj_req->person.person_person_reltn,rSize)
 
	;Set Ids to negative
	set pers_id =  input->person_reltn_id
 	set enc_id = input->encntr_reltn_id
 	set pm_obj_req->person.person_person_reltn[rSize].person_person_reltn_id = pers_id - (pers_id * 2)
	set pm_obj_req->person.person_person_reltn[rSize].encntr_person_reltn_id = enc_id - (enc_id *2)
	set pm_obj_req->person.person_person_reltn[rSize].person_reltn_type_cd = input->person_reltn_type_cd
	set pm_obj_req->person.person_person_reltn[rSize].update_reltn_ind = 1
 
	;Allow updates of all other relations. This avoids an issue where all relationships go away at the person level
	for(i = 1 to rSize-1)
		if(pm_obj_req->person.person_person_reltn[i].person_person_reltn_id = input->person_reltn_id
		or pm_obj_req->person.person_person_reltn[rSize].encntr_person_reltn_id = input->encntr_reltn_id)
			set pm_obj_req->person.person_person_reltn[i].update_reltn_ind = 0
		else
			set pm_obj_req->person.person_person_reltn[i].update_reltn_ind = 1
		endif
	endfor
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateEncounter Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Request 100082 - Remove patient lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100082
 
 	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = input->patient_id
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100082_req,"REC",100082_rep)
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ReturnReltnId(null) = null
;  Description: Return the relation ids
**************************************************************************/
subroutine ReturnReltnId(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ReturnReltnId Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from encntr_person_reltn epr
	plan epr where epr.encntr_id = input->encntr_id
		and epr.related_person_id = input->related_person_id
		and epr.person_reltn_type_cd = input->current_reltn_type_cd
		and epr.person_reltn_cd = input->related_person_reltn_2_patient_cd
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
	detail
		encounter_reply_out->encounter_reltn_id = epr.encntr_person_reltn_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ReturnReltnId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go
