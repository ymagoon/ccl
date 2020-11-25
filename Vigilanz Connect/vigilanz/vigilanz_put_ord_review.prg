/***************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

****************************************************************************
      Source file name:     snsro_put_ord_review.prg
      Object name:          vigilanz_put_ord_review
      Program purpose:      Performs the Review task
      Executing from:       Emissary Service
****************************************************************************
                     MODIFICATION CONTROL LOG
****************************************************************************
  Mod Date     Engineer     Comment
  --------------------------------------------------------------------------
  000 4/29/19  STV          Initial Release
  001 7/8/19   STV          update to remove nurse_review check for now
***************************************************************************/
drop program vigilanz_put_ord_review go
create program vigilanz_put_ord_review
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Order Id" = ""
	, "Review Type" = ""
	, "User Name" = ""
	, "Debug Flag" = ""
 
with OUTDEV, order_id, review_type, username, debug_flag
 
 
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
;;Privileges
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
 
;nurse_review structures
free record 680226_req
record 680226_req (
  1 review_personnel
    2 personnel_id = f8
    2 personnel_tz = i4
    2 personnel_group_id = f8
  1 reviews [*]
    2 nurse_reviews [*]
      3 order_id = f8
      3 action_sequence = i4
      3 review_action
        4 complete_ind = i2
    2 doctor_cosigns [*]
      3 order_id = f8
      3 action_sequence = i4
      3 bypass_rx_req_printing_ind = i2
      3 review_action
        4 admin_clear_ind = i2
        4 complete_ind = i2
)
 
free record 680226_rep
 record 680226_rep (
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
  1 reviews [*]
    2 nurse_reviews [*]
      3 successes [*]
        4 order_id = f8
        4 action_sequence = i4
      3 failures [*]
        4 order_id = f8
        4 action_sequence = i4
        4 debug_error_message = vc
    2 doctor_cosigns [*]
      3 successes [*]
        4 order_id = f8
        4 action_sequence = i4
      3 failures [*]
        4 order_id = f8
        4 action_sequence = i4
        4 debug_error_message = vc
)
 
free record ord_review_reply_out
record ord_review_reply_out(
  1 order_id             = f8
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
declare dOrderID			= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare dPrsnlID			= f8 with protect, noconstant(0.0)
declare iReviewType         = i4 with protect, noconstant(0)
declare idebugFlag			= i2 with protect, noconstant(0)
 
;other
declare c_privilege_cd_review = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDATEREGIME"))
 
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dOrderID						= cnvtreal($ORDER_ID)
set sUserName						= trim($USERNAME, 3)
set dPrsnlID						= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set iReviewType                     = cnvtint($review_type)
set idebugFlag                      = cnvtint($debug_flag)
/*ReviewType enum (This is not dm_flag value )
	1 = Nurse Review
 
*/
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare VerifyPrivileges(null) = i4 with protect
declare VerifyNurseReview(null) = i4 with protect;
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, dPrsnlID, ord_review_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("PUT ORDER REVIEW", "F", "PopulateAudit", "Invalid User for Audit.",
  		"1002",build2("Invalid user: ",sUserName), ord_review_reply_out)
		go to exit_script
endif
 
;Check for reviewtype to be valid
;;;FOR THE MOMENT; NURSE REVIEW IS THE ONLY ONLY ONE SUPPORTED
/*ReviewType enum (This is not dm_flag value )
	1 = Nurse Review
 

if(iReviewType != 1)
	call ErrorHandler2("PUT ORDER REVIEW", "F", "Reveiew Type Validation", "Cerner only allows Nurse Review for now",
  		"9999","Cerner only allows Nurse Review for now", ord_review_reply_out)
		go to exit_script
endif
*/
; Verify Privs
set iRet = VerifyPrivileges(null)
if(iRet = 0)
	call ErrorHandler2("ORDER REVIEW", "F", "Verify Privs", "Could not Validate Privileges",
  		"1004",build2("Invalid user: ",sUserName), ord_review_reply_out)
		go to exit_script
endif
 
; Verify Privs
set iRet = VerifyNurseReview(null)
if(iRet = 0)
	call ErrorHandler2("ORDER REVIEW", "F", "Verify Privs", "Could Perform Order Review",
  		"1002",build2("Invalid user: ",sUserName), ord_review_reply_out)
		go to exit_script
endif
 
 
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(ord_review_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_put_ord_review.json")
	  call echo(build2("_file : ", _file))
	  call echojson(ord_review_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(ord_review_reply_out)
 
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
;  Name: VerifyPrivileges(null) = i4 with protect
;  Description: Checks the privileges of the user
**************************************************************************/
subroutine VerifyPrivileges(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivileges ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
	set iREQUEST = 680500
 
	set 680500_req->patient_user_criteria[1].user_id = dPrsnlID
	set stat = alterlist(680500_req->privilege_criteria.privileges,1)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_privilege_cd_review
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680500_req,"REC",680500_rep)
 
	if(680500_rep->transaction_status.success_ind > 0)
		return(1)
	else
		return(0)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("VerifyPrivileges: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end
 
/*************************************************************************
;  Name: VerifyNurseReview(null)
;  Description: Verifis the Nurse Review
**************************************************************************/
subroutine VerifyNurseReview(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyNurseReview(null)", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare c_nurse_review_cd = i4
	declare c_needs_review_cd = i4
	select into "nl:"
	from dm_flags dm
	where dm.table_name = "ORDER_REVIEW"
		and dm.column_name in("REVIEW_TYPE_FLAG","REVIEWED_STATUS_FLAG")
	order by dm.column_name
	detail
		if(cnvtupper(dm.description) = "NURSE REVIEW")
			c_nurse_review_cd = cnvtint(dm.flag_value)
		elseif(cnvtupper(dm.description) = "NOT REVIEWED")
			c_needs_review_cd = cnvtint(dm.flag_value)
		endif
	with nocounter
 
	;;query to see if nurse review is needed
	select into "nl:"
	from order_review ord
	where ord.order_id = dOrderID
		and ord.review_type_flag = c_nurse_review_cd
		and ord.reviewed_status_flag = c_needs_review_cd
	head report
		680226_req->review_personnel.personnel_id = dPrsnlID
		680226_req->review_personnel.personnel_tz = curtimezoneapp
		stat = alterlist(680226_req->reviews,1)
		stat = alterlist(680226_req->reviews[1].nurse_reviews,1)
		680226_req->reviews[1].nurse_reviews[1].order_id = ord.order_id
		680226_req->reviews[1].nurse_reviews[1].action_sequence = ord.action_sequence
		680226_req->reviews[1].nurse_reviews[1].review_action.complete_ind = 1
	with nocounter
 
	if(680226_req->review_personnel.personnel_id > 0); this will do the tbd execute
		set iAPPLICATION = 600005
		set iTASK = 500196
		set iREQUEST = 680226
 		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680226_req,"REC",680226_rep)
 
 		if(680226_rep->transaction_status.success_ind = 1)
 			set ord_review_reply_out->order_id = dOrderID
 			call ErrorHandler2("Success", "S", "PUT ORDER REVIEW", "Successfully Reviewed Order.","0000",
					"Successfully Reviewed Order.", ord_review_reply_out) ;006
 			return(1)
 		else
 			return(0)
 		endif
 	else
 		return(0)
 	endif
 
 
	if(idebugFlag > 0)
		call echo(concat("VerifyNurseReview(null): ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end
go
 
