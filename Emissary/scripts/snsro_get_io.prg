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
      Source file name:    	snsro_get_io.prg
      Object name:         	snsro_get_io
      Program purpose:      Returns intake & output volume totals for a given
      						patient for a given date range.  The default date
      						range is the last 72 hours if no data range is
      						provided.
      Tables read:			CLINICAL_EVENT
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:	    NONE
******************************************************************************/
 /***********************************************************************
  *                   MODIFICATION CONTROL LOG                		   *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 11/18/15 JCO					Initial write
 *001 04/29/16 AAB					Change failure message
 *002 04/29/16 AAB 					Added version
 *003 10/10/16 AAB 					Add DEBUG_FLAG
 *004 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
 *005 08/17/17 JCO					Added UTC logic
 *006 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
 drop program snsro_get_io go
 create program snsro_get_io
 
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
	,"Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PERSON_ID, ENCNTR_ID, FROM_DATE, TO_DATE, IO_CAP, DEBUG_FLAG   ;003
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;006
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
; DECLARED STRUCTURES
****************************************************************************/
free record 3200307_req_in
record 3200307_req_in (
  1 patient_id = f8
  1 anchor_date = dq8
  1 target_date = dq8
  1 io_cap = i4
)
 
free record 3200307_rep_out
record 3200307_rep_out (
  1 status
    2 success_ind = i2
    2 debug_error_message = vc
  1 results_found_ind = i2
  1 new_target_date = dq8
  1 transaction_key = gvc
)
 
free record 3200308_req_in
record 3200308_req_in (
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
 
free record 3200308_reply_out
record 3200308_reply_out (
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
	2 service_version			= vc		;002
/*004 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*004 end */
)
 
/**************************************************************
; DECLARE and SET VARIABLES
**************************************************************/
declare JSONout 				= vc with protect, noconstant("")
declare sUsername				= vc with protect, noconstant("")
declare dPersonId  				= f8 with protect, noconstant(0.0)
declare dEncntrId           	= f8 with protect, noconstant(0.0)
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare dPPRCd					= f8 with protect, noconstant(0.0)
declare sTransactionKey 		= gvc with protect, noconstant("")
declare anchorDate				= dq8
declare targetDate				= dq8
declare newTargetDate			= dq8
declare iIOCap					= i4 with protect, noconstant(0)
declare vCnt					= i4 with protect, noconstant(0)
declare sOrderName				= vc with protect, noconstant("")
declare sVolumeUnits			= vc with protect, constant("mL")
declare idebugFlag				= i2 with protect, noconstant(0) ;003
declare section_startDtTm		= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare UTCmode					= i2 with protect, noconstant(0);005
declare UTCpos 					= i2 with protect, noconstant(0);005
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;004 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetTransactionKey(null)			= null with protect
declare GetIOVolumes(null)				= null with protect
declare PostAmble(null)					= null with protect
declare GetResultName(dOrderId = f8)	= vc with protect
 
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
 
set file_name 		= $OUTDEV
set sUsername		= $USERNAME
set dPersonID   	= cnvtint($PERSON_ID)
set dEncntrID    	= cnvtint($ENCNTR_ID)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set iIOCap			= cnvtint($IO_CAP)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;003
set UTCmode			= CURUTC ;005
set UTCpos			= findstring("Z",sFromDate,1,0);005
 
 
if(idebugFlag > 0)
 
	call echo(build("$FROM_DATE -->",sFromDate))
	call echo(build("$TO_DATE -->",sToDate))
	call echo(build("sUsername -->",sUsername))
	call echo(build("dPersonID -->",dPersonID))
	call echo(build("dEncntrID -->",dEncntrID))
	call echo(build("UTC MODE -->",UTCmode));005
 	call echo(build("UTC POS -->",UTCpos));005
 
 
endif
 
 
 
/*005 UTC begin */
 if (UTCmode = 1 and UTCpos > 0)
 
	if(sFromDate > " ")
		set startDtTm = cnvtdatetimeUTC(sFromDate) ;;;
	else
		set startDtTm = cnvtdatetimeUTC(curdate-3,curtime)
	endif
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(sToDate)
	endif
else
	if(sFromDate > " ")
		set startDtTm = cnvtdatetime(sFromDate) ;;;
	else
		set startDtTm = cnvtdatetime(curdate-3,curtime)
	endif
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(sToDate)
	endif
endif
	set targetDate = startDtTm
	set anchorDate = endDtTm
/*005 UTC end */
 
if(idebugFlag > 0)
 
	call echo(build("anchorDate -->",anchorDate))
	call echo(build("targetDate -->",targetDate))
 
endif
 
call GetTransactionKey(null)
call GetIOVolumes(null)
 
/**************************************************************
* Execute MSVC_SVR_GET_IO_VOLUMES (3200308)
* through TDBEXECUTE
**************************************************************/
call echorecord(3200308_req_in)
set stat = tdbexecute(3202004, 3202004, 3200308,"REC",3200308_req_in,"REC",3200308_reply_out)
call echorecord(3200308_reply_out)
 
/*************************************************************
* Evaluate STAT for error handling
**************************************************************/
if(idebugFlag > 0)
 
	call echo(build("tdbexecute=",stat))
 
endif
 
if (stat = 0)
		call PostAmble(null)
		call PopulateAudit(sUserName, dPersonId, io_reply_out, sVersion)   ;002
else
		call ErrorHandler2("EXECUTE", "F", "INTAKE OUTPUT", "Error retrieving I/O records - 3200308",
		"9999", "Error retrieving I/O records - 3200308", io_reply_out)   ;001
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(io_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_io.json")
	call echo(build2("_file : ", _file))
	call echojson(io_reply_out, _file, 0)
	call echo(JSONout)
 
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************
* Subroutine: GetTransactionKey (null)
* Purpose: 	Retrieve transaction_key required to populate
			request for 3200308 before execution.
**************************************************************/
subroutine GetTransactionKey(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetTransactionKey Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	set 3200307_req_in->patient_id = dPersonId
	set 3200307_req_in->anchor_date = anchorDate ;cnvtdatetime("07-JUL-2012 05:59:59.00")
	set 3200307_req_in->target_date = targetDate ;cnvtdatetime("05-JUL-2012 04:59:59.00")
	set 3200307_req_in->io_cap = 0
 
	call echorecord(3200307_req_in)
	set stat = tdbexecute(3202004, 3202004, 3200307,"REC",3200307_req_in,"REC",3200307_rep_out)
	call echorecord(3200307_rep_out)
 
	set sTransactionKey = 3200307_rep_out->transaction_key
	set newTargetDate = 3200307_rep_out->new_target_date
	if(sTransactionKey = "")
		call ErrorHandler2("EXECUTE", "F", "INTAKE OUTPUT", "Retreive of sTransactionKey (3200307) failed.",
		"9999","Retreive of sTransactionKey (3200307) failed.", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetTransactionKey Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/*************************************************************
* Subroutine: GetIOVoumes (null)
* Purpose: 	Validate input parameters then populate &
* 			execute request 3200308.
**************************************************************/
subroutine GetIOVolumes(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetIOVolumes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	if(sUsername > "")
		set dPrsnlId = GetPrsnlIDfromUserName(sUsername)
		if (dPrsnlId = 0)
			call ErrorHandler2("VALIDATE", "F", "INTAKE OUTPUT", build("sUsername: ",sUsername," is invalid."),
			"1001", build("UserId is invalid: ", sUserName), io_reply_out)
			go to EXIT_SCRIPT
		endif
	else
		call ErrorHandler2("VALIDATE", "F", "INTAKE OUTPUT", "UserId is empty and required.",
		"2055", "Missing required field: UserId", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(dPersonId = 0)
		call ErrorHandler2("VALIDATE", "F", "INTAKE OUTPUT", "PersonId is 0.0 and required.",
		"2055", "Missing required field: PatientId", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(dEncntrId = 0)
		call ErrorHandler2("VALIDATE", "F", "INTAKE OUTPUT", "EncntrId is 0.0 and required.",
		"2055", "Missing required field: EncntrId", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	/************************
	* Get relationship code *
	************************/
	select into "nl:"
		epr.encntr_prsnl_r_cd
	from encntr_prsnl_reltn epr
	plan epr
		where epr.prsnl_person_id = dPrsnlId
		and epr.encntr_id = dEncntrId
		and epr.active_ind = 1
	detail
		dPPRCd = epr.encntr_prsnl_r_cd
	with nocounter
	if(curqual = 0)
		call ErrorHandler2("VALIDATE", "F", "INTAKE OUTPUT", "Unable to find patient_user_relationship_cd.",
		"2030", "Unable to find ENCNTR_PRSNL_RELTN_CD.", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;set stat = alterlist(req_inrequest->adminEventList,1)
	;set stat = alterlist(adhoc_admin_pharm_request->adminEventList[1].ingredientList,1)
	;set stat = alterlist(adhoc_admin_pharm_request->adminEventList[1].ingredientList[1].productList,1)
 
	set 3200308_req_in->patient_user_criteria.user_id = dPrsnlId
	set 3200308_req_in->patient_user_relationship_cd = dPPRCd
	set 3200308_req_in->patient_id = dPersonId
	set 3200308_req_in->encounter_id = dEncntrId
	set 3200308_req_in->anchor_date = anchorDate ;cnvtdatetime("07-JUL-2012 05:59:59.00") ;cnvtdatetime(sFromDate)
	set 3200308_req_in->target_date = newTargetDate ;cnvtdatetime("05-JUL-2012 04:59:59.00") ;cnvtdatetime(sToDate)
	set 3200308_req_in->transaction_key = sTransactionKey ;"7"
 
if(idebugFlag > 0)
 
	call echo(concat("GetIOVolumes Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************
* Subroutine: PostAmble (null)
* Purpose: 	Post processing step to pouplate io_reply_out
**************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	set vCnt = size(3200308_reply_out->volume,5)
if(idebugFlag > 0)
 
	call echo("Get IO Post Amble Processing...")
	call echo(build("volume count: ",vCnt))
 
endif
 
	;set top-level reply attributes
	set io_reply_out->patient_id = dPersonId
	set io_reply_out->encntr_id = dEncntrId
	set io_reply_out->from_dt_tm = cnvtdatetime("07-JUL-2012 05:59:59.00") ;cnvtdatetime(sFromDate)
	set io_reply_out->encntr_class_cd = GetPatientClass(dEncntrId,1)
	set io_reply_Out->encntr_class_disp = uar_get_code_display(io_reply_out->encntr_class_cd)
	set io_reply_out->encntr_type_cd = GetPatientClass(dEncntrId,2)
	set io_reply_out->encntr_type_disp = uar_get_code_display(io_reply_out->encntr_type_cd)
	set io_reply_out->to_dt_tm = newTargetDate
 
	if(vCnt > 0)
		set stat = alterlist(io_reply_out->io_volumes,vCnt)
		for(z = 1 to vCnt)
			call echo(build("z: ",z))
			set io_reply_out->io_volumes[z].result_id = 3200308_reply_out->volume[z]->reference_event.event_id
			if(3200308_reply_out->volume[z]->reference_event.order_id > 0)
				set io_reply_out->io_volumes[z].order_id = 3200308_reply_out->volume[z]->reference_event.order_id
				set io_reply_out->io_volumes[z].result_name = GetResultName(3200308_reply_out->volume[z]->reference_event.order_id)
			else
				set io_reply_out->io_volumes[z].result_name = uar_get_code_display(3200308_reply_out->volume[z]->reference_event.event_cd)
			endif
 
			set io_reply_out->io_volumes[z].component_id = 3200308_reply_out->volume[z]->reference_event.event_cd
			if(3200308_reply_out->volume[z].io_type_flag = 1)
				set io_reply_out->io_volumes[z].volume_type = "INTAKE"
			elseif(3200308_reply_out->volume[z].io_type_flag = 2)
				set io_reply_out->io_volumes[z].volume_type = "OUTPUT"
			else
				set io_reply_out->io_volumes[z].volume_type = "UNDEFINED"
			endif
			set io_reply_out->io_volumes[z].volume_start_dt_tm = 3200308_reply_out->volume[z].io_start_dt_tm
			set io_reply_out->io_volumes[z].volume_end_dt_tm = 3200308_reply_out->volume[z].io_end_dt_tm
			set io_reply_out->io_volumes[z].volume_status = uar_get_code_display(3200308_reply_out->volume[z]->event.result_status_cd)
			set io_reply_out->io_volumes[z].volume_total = cnvtstring(cnvtint(3200308_reply_out->volume[z].io_volume))
			set io_reply_out->io_volumes[z].volume_units = sVolumeUnits
			set io_reply_out->io_volumes[z].iv_type = uar_get_code_display(3200308_reply_out->volume[z]->reference_event.iv_event_cd)
 
		endfor
		call ErrorHandler("EXECUTE", "S", "INTAKE OUTPUT", "Get Volumes Query (3203008) successful.", io_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "INTAKE OUTPUT", "Get Volumes Query (3203008) returned zero records.", io_reply_out)
		go to EXIT_SCRIPT
	endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************
* Subroutine: GetResultName (dOrderId = f8)
* Purpose: 	Look up & return order_mnemonic for given order id
**************************************************************/
subroutine GetResultName(dOrderId)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetResultName Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 if(dOrderId > 0)
	select into "nl:"
		o.order_mnemonic
	from orders o
	plan o
	where o.order_id = dOrderId
	detail
		sOrderName = o.order_mnemonic
 
	with nocounter
 
	return (sOrderName)
 endif
 
 return ("")
 
if(idebugFlag > 0)
 
	call echo(concat("GetResultName Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end
go
 
