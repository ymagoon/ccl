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
      Source file name: snsro_del_enc_ins.prg
      Object name:      vigilanz_del_enc_ins
      Program purpose:  Delete encounter insurance in millennium
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
 001 02/20/20 RJC		Initial Write
 002 03/31/20 RJC		Fixed lock check
***********************************************************************/
drop program vigilanz_del_enc_ins go
create program vigilanz_del_enc_ins
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "InsuranceId" = ""			;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, INS_ID, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
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
free record insurance_reply_out
record insurance_reply_out(
  1 insurance_id       		= f8
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
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username						= vc
	1 prsnl_id						= f8
	1 patient_id 					= f8
	1 encntr_id						= f8
	1 encntr_plan_reltn_id			= f8
	1 other_active_plans[*]
	 	2 plan_reltn_id				= f8
)
 
free record priorities
record priorities (
	1 cnt = i4
	1 list[*]
		2 encntr_plan_reltn_id = f8
		2 priority = i4
)
 
; Constants
declare c_error_handler					= vc with protect, constant("DELETE ENC INSURANCE")
declare c_insured_person_reltn_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare PostInsurance(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag = cnvtint($DEBUG_FLAG)
set input->username = trim($USERNAME, 3)
set input->prsnl_id = GetPrsnlIDfromUserName(input->username)
set input->encntr_plan_reltn_id = cnvtreal($INS_ID)
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate insuranceId exists
if(input->encntr_plan_reltn_id = 0) call ErrorMsg("InsuranceId","9999","M") endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, insurance_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Create the Insurance(s)
set iRet = PostInsurance(null)
if(iRet = 0)
  	  call ErrorMsg("Could not post insurance.","9999","E")
else
	set insurance_reply_out->insurance_id = input->encntr_plan_reltn_id
 
	call ErrorHandler2(c_error_handler, "S", c_error_handler, "Insurance deleted successfully.",
  		"0000",build2("Insurance deleted successfully."), insurance_reply_out)
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
set JSONout = CNVTRECTOJSON(insurance_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_delete_enc_ins.json")
	call echo(build2("_file : ", _file))
	call echojson(insurance_reply_out, _file, 0)
	call echorecord(insurance_reply_out)
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
			error_code, build2("Missing required field: ",msg), insurance_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), insurance_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, insurance_reply_out)
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
 
	;Validate InsuranceId
	select into "nl:"
	from encntr_plan_reltn epr
		, encounter e
	plan epr where epr.encntr_plan_reltn_id = input->encntr_plan_reltn_id
;		and epr.active_ind = 1
;		and epr.beg_effective_dt_tm <= sysdate
;		and epr.end_effective_dt_tm > sysdate
	join e where e.encntr_id = epr.encntr_id
	head report
		x = 0
	detail
		input->patient_id = e.person_id
		input->encntr_id = e.encntr_id
	with nocounter
 
	; Validate EncounterId & PatientId
	if(input->encntr_id = 0 or input->patient_id = 0)
		call ErrorMsg("InsuranceId","2055","I")
	endif
 
	;Get other active insurance plans
	select into "nl:"
	from encntr_plan_reltn epr
		, encounter e
	plan epr where epr.encntr_id = input->encntr_id
		and epr.encntr_plan_reltn_id != input->encntr_plan_reltn_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
	join e where e.encntr_id = epr.encntr_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(input->other_active_plans,x)
		input->other_active_plans[x].plan_reltn_id = epr.encntr_plan_reltn_id
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
;  Name: PostInsurance(null) = null
;  Description: Post new insurance(s)
**************************************************************************/
subroutine PostInsurance(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostInsurance Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Add update_reltn_ind to all other active insurances - this prevents them from being inactivated
	;Reduce priority by 1
	if( size(input->other_active_plans,5) > 0)
	 	select into "nl:"
	 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
	 		,(dummyt d2 with seq = 1)
	 		,(dummyt d3 with seq = size(input->other_active_plans,5))
	 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
	 	join d2
	 	join d3 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
	 		input->other_active_plans[d3.seq].plan_reltn_id
	 		and pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].active_ind = 1
	 	detail
	 		pm_obj_req->person.person_person_reltn[d.seq].update_reltn_ind = 1
 
	 		if(pm_obj_req->person.person_person_reltn[d.seq].priority_seq > 1)
	 			pm_obj_req->person.person_person_reltn[d.seq].priority_seq =
	 				pm_obj_req->person.person_person_reltn[d.seq].priority_seq - 1
	 		endif
 
	 		if(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].priority_seq > 1)
	 			pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].priority_seq =
	 				pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].priority_seq - 1
	 		endif
 
	 		if(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn[1].priority_seq > 1)
	 			pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn[1].priority_seq =
	 				pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn[1].priority_seq - 1
	 		endif
	 	with nocounter
	 endif
 
	; Insurance/Subscriber
	; Get indexes of current data
	declare pos = i4
	declare p = i4
	set idx = 1
 
	select into "nl:"
 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
 		,(dummyt d2 with seq = 1)
 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
 	join d2 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
 		input->encntr_plan_reltn_id
 	detail
 		pos = d.seq
 		p = d2.seq
 	with nocounter
 
	;need to create new emtpy object with negative ids to delete it
	set x = size(pm_obj_req->person.person_person_reltn,5) + 1
	set stat = alterlist(pm_obj_req->person.person_person_reltn,x)
 
	set pm_obj_req->person.person_person_reltn[x].update_reltn_ind = 1
	set pm_obj_req->person.person_person_reltn[x].active_ind = 0
	set pm_obj_req->person.person_person_reltn[x].end_effective_dt_tm = cnvtdatetime(curdate, curtime3)
 
 	;Update suscriber information - set ids to negative values
 	set encntr_person_reltn_id = pm_obj_req->person.person_person_reltn[pos].encntr_person_reltn_id
 
 	set pm_obj_req->person.person_person_reltn[x].encntr_person_reltn_id = encntr_person_reltn_id - (2 * encntr_person_reltn_id)
 	set pm_obj_req->person.person_person_reltn[x].person_reltn_type_cd = c_insured_person_reltn_type_cd
 
 
 	;Health Plan - set ids to negative values
 	set person_plan_reltn_id = pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].person_plan_reltn_id
 	set encntr_plan_reltn_id = pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn_id
 
 	set stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn,1)
 	set pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[1].person_plan_reltn_id =
 		person_plan_reltn_id - (2 * person_plan_reltn_id)
 	set pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[1].encntr_plan_reltn_id =
 		encntr_plan_reltn_id - (2 * encntr_plan_reltn_id)
 
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].end_effective_dt_tm = cnvtdatetime(curdate, curtime3)
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].active_ind = 0
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostInsurance Runtime: ",
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
 
end go
set trace notranslatelock go
 
