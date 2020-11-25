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
      Source file name:    	snsro_get_io.prg
      Object name:         	vigilanz_get_io
      Program purpose:      Returns intake & output volume totals for a given
      						patient for a given date range.  The default date
      						range is the last 72 hours if no data range is
      						provided.
      Tables read:			CLINICAL_EVENT
      Executing from:       Emissary Service
***********************************************************************
                     MODIFICATION CONTROL LOG
***********************************************************************
 
 Mod Date     Engineer             Comment
 --- -------- -------------------- -----------------------------------
 000 11/18/15 JCO					Initial write
 001 04/29/16 AAB					Change failure message
 002 04/29/16 AAB 					Added version
 003 10/10/16 AAB 					Add DEBUG_FLAG
 004 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
 005 08/17/17 JCO					Added UTC logic
 006 03/21/18 RJC					Added version code and copyright block
 007 04/10/19 RJC					Code cleanup. Return Z when no io volumes exist
 ***********************************************************************/
 drop program vigilanz_get_io go
 create program vigilanz_get_io
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
  "Output to File/Printer/MINE" = "MINE"
 	,"UserName "			 = ""		;required
    ,"Patient ID"  			 = 0.0		;required
 	,"Encounter ID"		 	 = 0.0		;required
	,"From Date"	 		 = ""		;optional -- default range is 72 hours from today/now
	,"To Date"				 = ""		;optional
	,"IO Cap"				 = "0"		;optional -- default = 0
	,"Debug Flag" = 0					;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PERSON_ID, ENCNTR_ID, FROM_DATE, TO_DATE, IO_CAP, DEBUG_FLAG   ;003
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/****************************************************************************
; DECLARED STRUCTURES
****************************************************************************/
;3200307 - msvc_svr_get_io_volumes_snapshot
free record 3200307_req
record 3200307_req (
  1 patient_id = f8
  1 anchor_date = dq8
  1 target_date = dq8
  1 io_cap = i4
)
 
free record 3200307_rep
record 3200307_rep (
  1 status
    2 success_ind = i2
    2 debug_error_message = vc
  1 results_found_ind = i2
  1 new_target_date = dq8
  1 transaction_key = gvc
)
 
; 3200308 - msvc_svr_get_io_volumes_snapshot
free record 3200308_req
record 3200308_req (
  1 initial
    2 patient_user_criteria
      3 user_id = f8
      3 patient_user_relationship_cd = f8
    2 patient_id = f8
    2 encounter_id = f8
    2 anchor_date = dq8
    2 target_date = dq8
    2 transaction_key = gvc
)
 
free record 3200308_rep
record 3200308_rep (
  1 status
    2 success_ind = i2
    2 debug_error_message = vc
  1 vols_removed_by_security_ind = i2
  1 volume [*]
    2 volume_type_flag = i2
    2 comment_ind = i2
    2 io_start_dt_tm = dq8
    2 io_end_dt_tm = dq8
    2 io_status_cd = f8
    2 io_type_flag = i2
    2 io_volume = f8
    2 composition_id = i4
    2 event
      3 event_id = f8
      3 instance_id = f8
      3 result_status_cd = f8
    2 reference_event
      3 event_cd = f8
      3 event_id = f8
      3 group_label_id = f8
      3 instance_id = f8
      3 iv_event_cd = f8
      3 order_id = f8
  1 composition [*]
    2 composition_id = i4
    2 ingredient [*]
      3 catalog_cd = f8
      3 event_title_text = vc
      3 initial_dose = f8
      3 initial_dose_unit_cd = f8
      3 initial_volume = f8
      3 initial_volume_unit_cd = f8
      3 event_cd = f8
)
 
; Final reply
free record io_reply_out
record io_reply_out (
  1 patient_id = f8					;person identifier
  1 encntr_id = f8					;encounter identifier
  1 encntr_type_cd = f8				;encounter type
  1 encntr_type_disp = vc
  1 encntr_class_cd = f8			;encounter class
  1 encntr_class_disp = vc
  1 from_dt_tm = dq8				;search start date/time
  1 to_dt_tm = dq8					;search end date/time
  1 io_volumes [*]
    2 result_id = f8				;event_id
    2 result_name = vc				;event_cd display or order_mnemonic
    2 component_id = f8 			;event_cd
    2 order_id = f8					;order_id (optional)
    2 volume_type = vc 				;INTAKE, OUTPUT or UNDEFINED
    2 volume_start_dt_tm = dq8		;start date/time of volume
    2 volume_end_dt_tm = dq8		;end date/time of volume
    2 volume_status = vc			;confirmed or unconfirmed
    2 volume_total = vc				;volume total in mL always
    2 volume_units = vc				;volume units is always mL
    2 iv_type = vc					;only if IV: begin, bolus, infuse, site change, rate change
  1 audit
    2 user_id	= f8
    2 user_firstname = vc
    2 user_lastname = vc
    2 patient_id = f8
    2 patient_firstname = vc
    2 patient_lastname = vc
	2 service_version = vc
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
 
/**************************************************************
; DECLARE and SET VARIABLES
**************************************************************/
; Input
declare sUsername				= vc with protect, noconstant("")
declare dPersonId  				= f8 with protect, noconstant(0.0)
declare dEncounterId           	= f8 with protect, noconstant(0.0)
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare iIOCap					= i4 with protect, noconstant(0)
declare iDebugFlag				= i2 with protect, noconstant(0) ;003
 
; Other
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare dPPRCd					= f8 with protect, noconstant(0.0)
declare sTransactionKey 		= gvc with protect, noconstant("")
declare qToDate					= dq8 with protect, noconstant(0)
declare qFromDate				= dq8 with protect, noconstant(0)
declare qNewFromDate			= dq8 with protect, noconstant(0)
declare sOrderName				= vc with protect, noconstant("")
 
; Constants
declare c_error_handler			= vc with protect, constant("GET IO")
declare sVolumeUnits			= vc with protect, constant("mL")
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUsername		= trim($USERNAME,3)
set dPersonId   	= cnvtreal($PERSON_ID)
set dEncounterId    = cnvtreal($ENCNTR_ID)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set iIOCap			= cnvtint($IO_CAP)
set iDebugFlag		= cnvtint($DEBUG_FLAG)
 
; Other
set dPrsnlId = GetPrsnlIDfromUserName(sUsername)
 
; Set Dates
if(sFromDate <= " ")
	; Default from date is 3 days ago
	set sFromDate = format(cnvtdatetime(curdate-3,curtime),"DD-MMM-YYYY HH:MM:SS;;q")
endif
set qFromDate = GetDateTime(sFromDate)
set	qToDate = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUsername -->",sUsername))
	call echo(build("dPersonId -->",dPersonId))
	call echo(build("dEncounterId -->",dEncounterId))
	call echo(build("sFromDate -->",sFromDate))
	call echo(build("sToDate -->",sToDate))
	call echo(build("qToDate -->",qToDate))
	call echo(build("qFromDate -->",qFromDate))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetTransactionKey(null)			= null with protect
declare GetIOVolumes(null)				= null with protect
declare PostAmble(null)					= null with protect

/**************************************************************
* 	MAIN
**************************************************************/
; Validate PatientId exists
if(dPersonId = 0)
	call ErrorHandler2(c_error_handler,"F","Validate","Missing required field: PatientId",
	"2055", "Missing required field: PatientId", io_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate EncounterId exists
if(dEncounterId = 0)
	call ErrorHandler2(c_error_handler,"F","Validate","Missing required field: EncounterId",
	"2055", "Missing required field: EncounterId", io_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date
if (qFromDate > qToDate)
	call ErrorHandler2(c_error_handler,"F","Validate", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", io_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Username
set iRet = PopulateAudit(sUserName, dPersonId, io_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler,"F","Validate", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), io_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get IO Snapshot - 3200307
call GetTransactionKey(null)
 
; Get IO Volumes - 3200308
call GetIOVolumes(null)
 
; Post Amble
call PostAmble(null)
 
; Set audit to success
call ErrorHandler(c_error_handler,"S","Success", "Process completed successfully.", io_reply_out)
 
/*************************************************************************
 RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(io_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_io.json")
	call echo(build2("_file : ", _file))
	call echojson(io_reply_out, _file, 0)
	call echorecord(io_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************
 Subroutine: GetTransactionKey (null)
 Purpose: 	Retrieve transaction_key required to populate request for 3200308 before execution.
**************************************************************/
subroutine GetTransactionKey(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTransactionKey Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Setup request
	set 3200307_req->patient_id = dPersonId
	set 3200307_req->anchor_date = qToDate
	set 3200307_req->target_date = qFromDate
	set 3200307_req->io_cap = iIOCap
 
	; Execute request
	set stat = tdbexecute(3202004, 3202004, 3200307,"REC",3200307_req,"REC",3200307_rep)
 
	if(3200307_rep->status.success_ind = 1)
		set sTransactionKey = 3200307_rep->transaction_key
		set qNewFromDate = 3200307_rep->new_target_date
 
		;set top-level reply attributes
		set io_reply_out->patient_id = dPersonId
		set io_reply_out->encntr_id = dEncounterId
		set io_reply_out->from_dt_tm = qNewFromDate
		set io_reply_out->encntr_class_cd = GetPatientClass(dEncounterId,1)
		set io_reply_Out->encntr_class_disp = uar_get_code_display(io_reply_out->encntr_class_cd)
		set io_reply_out->encntr_type_cd = GetPatientClass(dEncounterId,2)
		set io_reply_out->encntr_type_disp = uar_get_code_display(io_reply_out->encntr_type_cd)
		set io_reply_out->to_dt_tm = qToDate
 
		if(sTransactionKey = "")
			call ErrorHandler2(c_error_handler,"Z","Execute", "No records found.","0000","No records found.", io_reply_out)
			go to EXIT_SCRIPT
		endif
	else
		call ErrorHandler2(c_error_handler,"F","Validate", "Retreive of sTransactionKey (3200307) failed.",
		"9999","Retreive of sTransactionKey (3200307) failed.", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTransactionKey Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
        " seconds"))
 	endif
end ;End Sub
 
/*************************************************************
 Subroutine: GetIOVoumes (null)
 Purpose: 	Validate input parameters then populate & execute request 3200308.
**************************************************************/
subroutine GetIOVolumes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetIOVolumes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get User/Encntr Relationship
	select into "nl:"
		epr.encntr_prsnl_r_cd
	from encntr_prsnl_reltn epr
	plan epr
		where epr.prsnl_person_id = dPrsnlId
		and epr.encntr_id = dEncounterId
		and epr.active_ind = 1
	detail
		dPPRCd = epr.encntr_prsnl_r_cd
	with nocounter
 
	; Setup request
	set 3200308_req->patient_user_criteria.user_id = dPrsnlId
	set 3200308_req->patient_user_relationship_cd = dPPRCd
	set 3200308_req->patient_id = dPersonId
	set 3200308_req->encounter_id = dEncounterId
	set 3200308_req->anchor_date = qToDate
	set 3200308_req->target_date = qNewFromDate
	set 3200308_req->transaction_key = sTransactionKey
 
 	; Execute request
 	set stat = tdbexecute(3202004, 3202004, 3200308,"REC",3200308_req,"REC",3200308_rep)
 	
 	if(size(3200308_rep->volume,5) = 0)
 		call ErrorHandler("EXECUTE", "Z", "INTAKE OUTPUT", "Get Volumes Query (3203008) returned zero records.", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
 		call echo(concat("GetIOVolumes Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
        " seconds"))
	endif
end ;End Sub
 
/*************************************************************
* Subroutine: PostAmble (null)
* Purpose: 	Post processing step to pouplate io_reply_out
**************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 	endif
 	
 	select into "nl:"
 	from (dummyt d with seq = size(3200308_rep->volume,5))
 		, orders o
 	plan d
 	join o where o.order_id = outerjoin(3200308_rep->volume[d.seq].reference_event.order_id)
 	head report
 		z = 0
 	detail
 		z = z + 1
 		stat = alterlist(io_reply_out->io_volumes,z)
		
		io_reply_out->io_volumes[z].result_id = 3200308_rep->volume[z]->reference_event.event_id
		
		if(3200308_rep->volume[z]->reference_event.order_id > 0)
			io_reply_out->io_volumes[z].order_id = 3200308_rep->volume[z]->reference_event.order_id
			io_reply_out->io_volumes[z].result_name = o.order_mnemonic
		else
			io_reply_out->io_volumes[z].result_name = uar_get_code_display(3200308_rep->volume[z]->reference_event.event_cd)
		endif
 
		io_reply_out->io_volumes[z].component_id = 3200308_rep->volume[z]->reference_event.event_cd
		if(3200308_rep->volume[z].io_type_flag = 1)
			io_reply_out->io_volumes[z].volume_type = "INTAKE"
		elseif(3200308_rep->volume[z].io_type_flag = 2)
			io_reply_out->io_volumes[z].volume_type = "OUTPUT"
		else
			io_reply_out->io_volumes[z].volume_type = "UNDEFINED"
		endif
		
		io_reply_out->io_volumes[z].volume_start_dt_tm = 3200308_rep->volume[z].io_start_dt_tm
		io_reply_out->io_volumes[z].volume_end_dt_tm = 3200308_rep->volume[z].io_end_dt_tm
		io_reply_out->io_volumes[z].volume_status = uar_get_code_display(3200308_rep->volume[z]->event.result_status_cd)
		io_reply_out->io_volumes[z].volume_total = cnvtstring(cnvtint(3200308_rep->volume[z].io_volume))
		io_reply_out->io_volumes[z].volume_units = sVolumeUnits
		io_reply_out->io_volumes[z].iv_type = uar_get_code_display(3200308_rep->volume[z]->reference_event.iv_event_cd)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
        " seconds"))
	endif
end ;End Sub
 
end
go
