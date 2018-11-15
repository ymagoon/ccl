/*~BB~**************************************************************************
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
  ~BE~***************************************************************************/
/********************************************************************************
      Source file name: snsro_put_prior_auth
      Object name:      snsro_put_prior_auth
      Program purpose:  Update the status and start/end dates of a prior authorization
      Tables read:      AUTHORIZATION
      Tables updated:   AUTHORIZATION, AUTHORIZATION_HISTORY
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
********************************************************************************/
 /*******************************************************************************
 *                   MODIFICATION CONTROL LOG
 ********************************************************************************
  Mod 	Date     	Engineer             	Comment
  --- 	-------- 	-------------------- 	-----------------------------------
  001	04/25/18	RJC						Initial Write
  002	05/09/18	RJC						Moved GetDateTime function to snsro_common
 *******************************************************************************/
/*******************************************************************************/
drop program snsro_put_prior_auth go
create program snsro_put_prior_auth
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        		;Required
		, "PriorAuthId" = ""			;Required
		, "PriorAuthNumber" = ""	;Optional - If blank, it will delete current auth number
		, "StatusId" = ""					;Optional - If blank, it will delete current status id
		, "AuthEndDate" = ""			;Optional - if blank, it will delete current date
		, "AuthStartDate" = ""		;Optional - if blank, it will delete current date
		, "Debug Flag:" = ""			;Optional
 
with OUTDEV, USERNAME, AUTH_ID, AUTH_NBR, STATUS, END_DATE, START_DATE, DEBUG_FLAG
 
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
free record auth_hist
record auth_hist(
	1 active_ind = i2
	1 active_status_cd = f8
	1 active_status_dt_tm = dq8
	1 active_status_prsnl_id = f8
	1 admission_beg_dt_tm = dq8
	1 admission_end_dt_tm = dq8
	1 appeal_reason = vc
	1 authorization_id = f8
	1 auth_cnt = i4
	1 auth_cnt_time = f8
	1 auth_cnt_time_cd = f8
	1 auth_cnt_unit = f8
	1 auth_cnt_unit_cd = f8
	1 auth_expire_dt_tm = dq8
	1 auth_id = f8
	1 auth_nbr = vc
	1 auth_obtained_dt_tm = dq8
	1 auth_qual_cd = f8
	1 auth_remain_cnt = i4
	1 auth_required_cd = f8
	1 auth_trans_state_flag = i2
	1 auth_type_cd = f8
	1 auth_used_cnt = i4
	1 beg_effective_dt_tm = dq8
	1 bnft_type_cd = f8
	1 cert_company = vc
	1 cert_nbr = vc
	1 cert_prsnl_id = f8
	1 cert_status_cd = f8
	1 cert_type_cd = f8
	1 change_bit = i4
	1 comment_id = f8
	1 contributor_system_cd = f8
	1 data_status_cd = f8
	1 data_status_dt_tm = dq8
	1 data_status_prsnl_id = f8
	1 delay_reason_cd = f8
	1 delay_reason_comment_id = f8
	1 description = vc
	1 discharge_dt_tm = dq8
	1 encntr_id = f8
	1 end_effective_dt_tm = dq8
	1 facility_cd = f8
	1 health_plan_id = f8
	1 interchange_id = f8
	1 last_update_dt_tm = dq8
	1 person_id = f8
	1 pm_hist_tracking_id = f8
	1 provider_prsnl_id = f8
	1 reference_nbr_txt = vc
	1 reject_reason_cd = f8
	1 rowid = vc
	1 service_beg_dt_tm = dq8
	1 service_end_dt_tm = dq8
	1 service_type_cd = f8
	1 surgical_dt_tm = dq8
	1 taxonomy_id = f8
	1 total_service_nbr = i4
	1 tracking_bit = i4
	1 transaction_dt_tm = dq8
	1 updt_applctx = f8
	1 updt_cnt = i4
	1 updt_dt_tm = dq8
	1 updt_id = f8
	1 updt_task = i4
	1 x12provider_cd = f8
	1 x12service_type_cd = f8
)
 
; Final Reply
free record priorauth_reply_out
record priorauth_reply_out(
	1 prior_authorization_id 	= f8
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
			3 OperationName 	= c25
			3 OperationStatus 	= c1
			3 TargetObjectName 	= c25
			3 TargetObjectValue = vc
			3 Code 				= c4
			3 Description 		= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName			= vc with protect, noconstant("")
declare dPriorAuthId		= f8 with protect, noconstant(0.0)
declare sPriorAuthNumber 	= vc with protect, noconstant("")
declare sAuthEndDate		= vc with protect, noconstant("")
declare sAuthStartDate		= vc with protect, noconstant("")
declare qAuthEndDate		= dq8 with protect, noconstant(0)
declare qAuthStartDate		= dq8 with protect, noconstant(0)
declare dStatusId			= f8 with protect, noconstant(0.0)
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId			= f8 with protect, noconstant(0.0)
 
 ; Constants
declare c_utc_mode			= i2 with protect, constant(CURUTC)
declare c_now_dt_tm			= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAuthDetails(null) 			= i2 with protect
declare UpdateAuthorization(null) 		= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set sUserName				= trim($USERNAME, 3)
set dPriorAuthId			= cnvtreal($AUTH_ID)
set sPriorAuthNumber		= trim($AUTH_NBR)
set sAuthEndDate			= trim($END_DATE)
set sAuthStartDate			= trim($START_DATE)
set dStatusId				= cnvtreal($STATUS)
set iDebugFlag				= cnvtreal($DEBUG_FLAG)
 
;Other
if(sAuthEndDate > " ")
	set qAuthEndDate = GetDateTime(sAuthEndDate)
endif
 
if(sAuthStartDate > " ")
	set qAuthStartDate = GetDateTime(sAuthStartDate)
endif
 
set dPrsnlId = GetPrsnlIDfromUserName(sUserName)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPriorAuthId -> ",dPriorAuthId))
	call echo(build("dStatusId -> ",dStatusId))
	call echo(build("sPriorAuthNumber -> ",sPriorAuthNumber))
	call echo(build("sAuthEndDate -> ",sAuthEndDate))
	call echo(build("sAuthStartDate -> ",sAuthStartDate))
	call echo(build("qAuthEndDate -> ",qAuthEndDate))
	call echo(build("qAuthStartDate -> ",qAuthStartDate))
	call echo(build("dPrsnlId -> ",dPrsnlId))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate username
set iRet = PopulateAudit(sUserName, 0.0, priorauth_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("VALIDATE", "F", "PUT PRIOR_AUTH", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), priorauth_reply_out)
  go to exit_script
endif
 
;Validate Status if provided
if(dStatusId > 0)
	set iRet = GetCodeSet(dStatusId)
	if(iRet != 14155)
		call ErrorHandler2("VALIDATE", "F", "PUT PRIOR_AUTH", "Invalid status.",
		"2006",build("Invalid status: ",dStatusId), priorauth_reply_out)
		go to exit_script
	endif
endif
 
;Get current authorization details
set iRet = GetAuthDetails(null)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT PRIOR_AUTH", "Invalid PriorAuthorizationId.",
	"9999",build("Invalid PriorAuthorizationId: ",dPriorAuthId), priorauth_reply_out)
	go to exit_script
endif
 
;Update Authorization
call UpdateAuthorization(null)
 
;Update audit with success
set priorauth_reply_out->prior_authorization_id = dPriorAuthId
call ErrorHandler2("SUCCESS", "S", "PUT PRIOR_AUTH", "Operation completed successfully.",
"0000","Operation completed successfully.", priorauth_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(priorauth_reply_out)
 
if(idebugFlag > 0)
	call echorecord(priorauth_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_prior_auths.json")
	call echo(build2("_file : ", _file))
	call echojson(priorauth_reply_out, _file, 0)
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
;  Name: GetAuthDetails(null) = null
;  Description: Get details of authorization
**************************************************************************/
subroutine GetAuthDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAuthDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	; Get current authorization info
	select into "nl:"
	from authorization a
	where a.authorization_id = dPriorAuthId
	detail
		iValidate = 1
 
		auth_hist->active_ind = a.active_ind
		auth_hist->active_status_cd = a.active_status_cd
		auth_hist->active_status_dt_tm = a.active_status_dt_tm
		auth_hist->active_status_prsnl_id = a.active_status_prsnl_id
		auth_hist->admission_beg_dt_tm = a.admission_beg_dt_tm
		auth_hist->admission_end_dt_tm = a.admission_end_dt_tm
		auth_hist->appeal_reason = a.appeal_reason
		auth_hist->auth_cnt = a.auth_cnt
		auth_hist->auth_cnt_time = a.auth_cnt_time
		auth_hist->auth_cnt_time_cd = a.auth_cnt_time_cd
		auth_hist->auth_cnt_unit = a.auth_cnt_unit
		auth_hist->auth_cnt_unit_cd = a.auth_cnt_unit_cd
		auth_hist->auth_expire_dt_tm = a.auth_expire_dt_tm
		auth_hist->auth_id = a.auth_id
		auth_hist->auth_nbr = a.auth_nbr
		auth_hist->auth_obtained_dt_tm = a.auth_obtained_dt_tm
		auth_hist->auth_qual_cd = a.auth_qual_cd
		auth_hist->auth_remain_cnt = a.auth_remain_cnt
		auth_hist->auth_required_cd = a.auth_required_cd
		auth_hist->auth_trans_state_flag = a.auth_trans_state_flag
		auth_hist->auth_type_cd = a.auth_type_cd
		auth_hist->auth_used_cnt = a.auth_used_cnt
		auth_hist->authorization_id = a.authorization_id
		auth_hist->beg_effective_dt_tm = a.beg_effective_dt_tm
		auth_hist->bnft_type_cd = a.bnft_type_cd
		auth_hist->cert_company = a.cert_company
		auth_hist->cert_nbr = a.cert_nbr
		auth_hist->cert_prsnl_id = a.cert_prsnl_id
		auth_hist->cert_status_cd = a.cert_status_cd
		auth_hist->cert_type_cd = a.cert_type_cd
		auth_hist->comment_id = a.comment_id
		auth_hist->contributor_system_cd = a.contributor_system_cd
		auth_hist->data_status_cd = a.data_status_cd
		auth_hist->data_status_dt_tm = a.data_status_dt_tm
		auth_hist->data_status_prsnl_id = a.data_status_prsnl_id
		auth_hist->delay_reason_cd = a.delay_reason_cd
		auth_hist->delay_reason_comment_id = a.delay_reason_comment_id
		auth_hist->description = a.description
		auth_hist->discharge_dt_tm = a.discharge_dt_tm
		auth_hist->encntr_id = a.encntr_id
		auth_hist->end_effective_dt_tm = a.end_effective_dt_tm
		auth_hist->facility_cd = a.facility_cd
		auth_hist->health_plan_id = a.health_plan_id
		auth_hist->interchange_id = a.interchange_id
		auth_hist->last_update_dt_tm = a.last_update_dt_tm
		auth_hist->person_id = a.person_id
		auth_hist->provider_prsnl_id = a.provider_prsnl_id
		auth_hist->reference_nbr_txt = a.reference_nbr_txt
		auth_hist->reject_reason_cd = a.reject_reason_cd
		auth_hist->service_beg_dt_tm = a.service_beg_dt_tm
		auth_hist->service_end_dt_tm = a.service_end_dt_tm
		auth_hist->service_type_cd = a.service_type_cd
		auth_hist->surgical_dt_tm = a.surgical_dt_tm
		auth_hist->taxonomy_id = a.taxonomy_id
		auth_hist->total_service_nbr = a.total_service_nbr
		auth_hist->x12provider_cd = a.x12provider_cd
		auth_hist->x12service_type_cd = a.x12service_type_cd
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetAuthDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateAuthorization(null) = null
;  Description: Update the authorization details
**************************************************************************/
subroutine UpdateAuthorization(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateAuthorization Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Update Authorization table
	update into authorization a
	set
		a.auth_nbr = sPriorAuthNumber
		,a.service_beg_dt_tm = cnvtdatetime(qAuthStartDate)
		,a.service_end_dt_tm = cnvtdatetime(qAuthEndDate)
		,a.cert_status_cd = dStatusId
		,a.updt_applctx = reqinfo->updt_applctx
		,a.updt_cnt = a.updt_cnt + 1
		,a.updt_dt_tm = cnvtdatetime(c_now_dt_tm)
		,a.updt_id = dPrsnlId
		,a.updt_task = reqinfo->updt_task
		,a.last_utc_ts = cnvtdatetime(c_now_dt_tm)
	where a.authorization_id = dPriorAuthId
	with nocounter
	commit
 
	;Insert row into PM_Hist_Tracking table
	insert into pm_hist_tracking pht
	set
		pht.pm_hist_tracking_id = seq(PERSON_SEQ,NEXTVAL)
		,pht.transaction_type_txt = "UNKN"
		,pht.transaction_reason_txt = "UNKNOWN"
		,pht.person_id = auth_hist->person_id
		,pht.encntr_id = auth_hist->encntr_id
		,pht.create_prsnl_id = dPrsnlId
		,pht.create_task = reqinfo->updt_task
		,pht.updt_applctx = reqinfo->updt_applctx
		,pht.updt_cnt = 0
		,pht.updt_dt_tm = cnvtdatetime(c_now_dt_tm)
		,pht.updt_id = dPrsnlId
		,pht.updt_task = reqinfo->updt_task
		,pht.last_utc_ts = cnvtdatetime(c_now_dt_tm)
		,pht.transaction_dt_tm = cnvtdatetime(c_now_dt_tm)
		,pht.create_dt_tm = cnvtdatetime(c_now_dt_tm)
	with nocounter
	commit
 
	; Get the newly created pm_hist_tracking_id
	declare dPmHistTrackingId = f8
	select into "nl:"
		tracking_id = max(pht.pm_hist_tracking_id)
	from pm_hist_tracking pht
	where pht.person_id = auth_hist->person_id
		and pht.updt_id = dPrsnlId
		and pht.updt_task = reqinfo->updt_task
	detail
		dPmHistTrackingId = tracking_id
	with nocounter
 
	;Insert row into Authorization_Hist table
	insert into authorization_hist ah
	set
		; Fields to update
		ah.authorization_hist_id = seq(HEALTH_PLAN_SEQ,NEXTVAL)
		,ah.cert_status_cd = dStatusId
		,ah.auth_nbr = sPriorAuthNumber
		,ah.service_beg_dt_tm = cnvtdatetime(qAuthStartDate)
		,ah.service_end_dt_tm = cnvtdatetime(qAuthEndDate)
		,ah.transaction_dt_tm = cnvtdatetime(c_now_dt_tm)
		,ah.updt_applctx = reqinfo->updt_applctx
		,ah.updt_cnt = auth_hist->updt_cnt + 1
		,ah.updt_dt_tm = cnvtdatetime(c_now_dt_tm)
		,ah.updt_id = dPrsnlId
		,ah.updt_task = reqinfo->updt_task
		,ah.pm_hist_tracking_id = dPmHistTrackingId
 
		; Fields that won't change with this transaction
		,ah.last_update_dt_tm = cnvtdatetime(auth_hist->last_update_dt_tm)
		,ah.active_ind = auth_hist->active_ind
		,ah.active_status_cd = auth_hist->active_status_cd
		,ah.active_status_dt_tm = cnvtdatetime(auth_hist->active_status_dt_tm)
		,ah.active_status_prsnl_id = auth_hist->active_status_prsnl_id
		,ah.admission_beg_dt_tm = cnvtdatetime(auth_hist->admission_beg_dt_tm)
		,ah.admission_end_dt_tm = cnvtdatetime(auth_hist->admission_end_dt_tm)
		,ah.appeal_reason = auth_hist->appeal_reason
		,ah.authorization_id = auth_hist->authorization_id
		,ah.auth_cnt = auth_hist->auth_cnt
		,ah.auth_cnt_time = auth_hist->auth_cnt_time
		,ah.auth_cnt_time_cd = auth_hist->auth_cnt_time_cd
		,ah.auth_cnt_unit = auth_hist->auth_cnt_unit
		,ah.auth_cnt_unit_cd = auth_hist->auth_cnt_unit_cd
		,ah.auth_expire_dt_tm = cnvtdatetime(auth_hist->auth_expire_dt_tm)
		,ah.auth_id = auth_hist->auth_id
		,ah.auth_obtained_dt_tm = cnvtdatetime(auth_hist->auth_obtained_dt_tm)
		,ah.auth_qual_cd = auth_hist->auth_qual_cd
		,ah.auth_remain_cnt = auth_hist->auth_remain_cnt
		,ah.auth_required_cd = auth_hist->auth_required_cd
		,ah.auth_trans_state_flag = auth_hist->auth_trans_state_flag
		,ah.auth_type_cd = auth_hist->auth_type_cd
		,ah.auth_used_cnt = auth_hist->auth_used_cnt
		,ah.beg_effective_dt_tm = cnvtdatetime(auth_hist->beg_effective_dt_tm)
		,ah.bnft_type_cd = auth_hist->bnft_type_cd
		,ah.cert_company = auth_hist->cert_company
		,ah.cert_nbr = auth_hist->cert_nbr
		,ah.cert_prsnl_id = auth_hist->cert_prsnl_id
		,ah.cert_type_cd = auth_hist->cert_type_cd
		,ah.change_bit = auth_hist->change_bit
		,ah.comment_id = auth_hist->comment_id
		,ah.contributor_system_cd = auth_hist->contributor_system_cd
		,ah.data_status_cd = auth_hist->data_status_cd
		,ah.data_status_dt_tm = cnvtdatetime(auth_hist->data_status_dt_tm)
		,ah.data_status_prsnl_id = auth_hist->data_status_prsnl_id
		,ah.delay_reason_cd = auth_hist->delay_reason_cd
		,ah.delay_reason_comment_id = auth_hist->delay_reason_comment_id
		,ah.description = auth_hist->description
		,ah.discharge_dt_tm = cnvtdatetime(auth_hist->discharge_dt_tm)
		,ah.encntr_id = auth_hist->encntr_id
		,ah.end_effective_dt_tm = cnvtdatetime(auth_hist->end_effective_dt_tm)
		,ah.facility_cd = auth_hist->facility_cd
		,ah.health_plan_id = auth_hist->health_plan_id
		,ah.interchange_id = auth_hist->interchange_id
		,ah.person_id = auth_hist->person_id
		,ah.provider_prsnl_id = auth_hist->provider_prsnl_id
		,ah.reference_nbr_txt = auth_hist->reference_nbr_txt
		,ah.reject_reason_cd = auth_hist->reject_reason_cd
		,ah.service_type_cd = auth_hist->service_type_cd
		,ah.surgical_dt_tm = cnvtdatetime(auth_hist->surgical_dt_tm)
		,ah.taxonomy_id = auth_hist->taxonomy_id
		,ah.total_service_nbr = auth_hist->total_service_nbr
		,ah.tracking_bit = auth_hist->tracking_bit
		,ah.x12provider_cd = auth_hist->x12provider_cd
		,ah.x12service_type_cd = auth_hist->x12service_type_cd
	with nocounter
 
	commit
 
 
	if(idebugFlag > 0)
		call echo(concat("UpdateAuthorization Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
 
 
 
