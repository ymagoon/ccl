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
          Date Written:       09/03/14
          Source file name:   snsro_add_prsnl_reltn
          Object name:        snsro_add_prsnl_reltn
          Request #:          Executes 600312 (PTS_ADD_PRSNL_RELTN)
          Program purpose:    Adds one or more entries to the
                              PERSON_PRSNL_RELTN and ENCNTR_PRSNL_RELTN
          Tables read:        PERSON_PRSNL_RELTN and ENCNTR_PRSNL_RELTN
          Tables updated:     PERSON_PRSNL_RELTN and ENCNTR_PRSNL_RELTN
          Executing from:     EMISSARY
          Special Notes:	  NONE
 /***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 9/03/14  AAB
  001 10/25/14 AAB					Change PRSNLID to USERNAME
  002 11/15/14 AAB/JCO				Changed task number, beg_dt_tm and
									          reqinfo->updt_id
  003 11/16/14 AAB          		Changed reply_out to patient_relationship_reply_out
  004 05/26/15 AAB					Removed PersonID as input parameter. Derive PersonId from EncntrID
  005 07/04/15 AAB 					Do not set Person ID or it goes into Prsnl_reltn logic in Cerner script
  006 11/05/15 JCO                  Fixed USERNAME field, removed CNVTSTRING( )
  007 11/05/15 JCO					Changed Application and Task to 3202004 for audit purposes
  008 01/05/16 JCO                  Added PreAmble for checking existence of relationship
  009 04/26/16 AAB					Added version
  010 10/10/16 AAB 					Add DEBUG_FLAG
  011 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  012 03/21/18 RJC					Added version code & copyright block
  013 03/23/18 RJC					Made encntr_id required. Minor code cleanup
 ***********************************************************************/
drop program snsro_add_prsnl_reltn go
create program snsro_add_prsnl_reltn

prompt
		"Output to File/Printer/MINE" = "MINE"
		, "User Name:" = ""
		, "Person Prsnl Reltn:" = 0.00
		, "Encntr Prsnl Reltn:" = 0.00
		, "Encntr Id:" = 0.00
		, "Begin Date:" = "01-JAN-1900"
		, "End Date:" = "31-DEC-2100"
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PERSON_PRSNL_RELTN, ENCNTR_PRSNL_RELTN, ENCNTRID, BEG_DT, END_DT, DEBUG_FLAG   ;010
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;012
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record request
record request
(
  1 prsnl_person_id 		  = f8
  1 person_prsnl_reltn_cd     = f8
  1 person_id                 = f8
  1 encntr_id                 = f8
  1 encntr_prsnl_reltn_cd     = f8
  1 beg_effective_dt_tm	      = dq8
  1 end_effective_dt_tm       = dq8
)
 
free record patient_relationship_reply_out
record patient_relationship_reply_out
(
 
  1 person_prsnl_reltn_id     = f8
  1 encntr_prsnl_reltn_id     = f8
  1 lookup_status = I4
/*011 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*011 end */
)
 
set patient_relationship_reply_out->status_data->status = "F"
 
/*************************************************************************
; INCLUDES
**************************************************************************/
;011 %i ccluserdir:snsro_common.inc
execute snsro_common	;011
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare APPLICATION_NUMBER 			= i4 with protect, constant (3202004)
declare TASK_NUMBER 				= i4 with protect, constant (3202004)
declare REQUEST_NUMBER 				= i4 with protect, constant (600312)
declare dPersonID	 				= f8 with protect, noconstant(0.0)
declare dPersonPrsnlReltnCd 		= f8 with protect, noconstant(cnvtint($PERSON_PRSNL_RELTN))
declare dEncntrPrsnlReltnCd 		= f8 with protect, noconstant(cnvtint($ENCNTR_PRSNL_RELTN))
declare dEncntrId		 			= f8 with protect, noconstant(cnvtint($ENCNTRID))
declare dPrsnlId                    = f8 with protect, noconstant(0.0)            ;008
declare begDt 						= vc with protect, noconstant($BEG_DT)
declare endDt 						= vc with protect, noconstant($END_DT)
declare sUserName 					= vc with protect, noconstant($USERNAME)     ;006
declare idebugFlag					= i2 with protect, noconstant(0)			;010
declare section_start_dt_tm 		= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare AddPrsnlReltn(null) 				 = null with protect
declare PreAmble(null)                       = null with protect                ;008
 
/****************************************************************************
;CALL SUBROUTINES
****************************************************************************/

;Validate input parameters
call PreAmble(null)     ;008

;Post Prsnl Relation
call AddPrsnlReltn(null)

if(idebugFlag > 0 )
	call echo(build("Beg Dt ->", request->beg_effective_dt_tm))
	call echo(build("USERNAME -->",sUserName))
	call echo(build("Prsnl_Id -->",request->prsnl_person_id))
	call echo(build("dEncntrId -->",dEncntrId))
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
;RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(patient_relationship_reply_out)
 
	if(idebugFlag > 0 )
		set file_path = logical("ccluserdir")
		set _file = build2(trim(file_path),"/snsro_add_prsnl_reltn.json")
		call echo(build2("_file : ", _file))
		call echojson(patient_relationship_reply_out, _file, 0)
 
	    call echorecord(patient_relationship_reply_out)
	endif
 
	if(idebugFlag > 0 )
		call echo(JSONout)
	endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/**008***********************************************************************
;  Name: PreAmble
;  Description: Pre-processing steps before executing AddPrsnlReltn
**************************************************************************/
subroutine PreAmble(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PreAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	 
	; Validate EncntrId exists ;013
	if(dEncntrId = 0)
		call ErrorHandler2("EXECUTE", "F", "PRSNL_LOOKUP", "PrsnlId not found from USERNAME",
	    "1001", build("PrsnlId not found from username: ",sUserName), patient_relationship_reply_out)	;011
	    go to EXIT_SCRIPT
	endif
	
	; Validate PrsnlId exists
	set dPrsnlId = GetPrsnlIDfromUserName(sUserName)
	if(dPrsnlId = 0)
	    call ErrorHandler2("EXECUTE", "F", "PRSNL_LOOKUP", "PrsnlId not found from USERNAME",
	    "1001", build("PrsnlId not found from username: ",sUserName), patient_relationship_reply_out)	;011
	    go to EXIT_SCRIPT
	endif
	 
	;Check ENCNTR_PRSNL_RELTN code value against code_set 333
	if(dEncntrPrsnlReltnCd > 0)
	    set iRet = GetCodeSet(dEncntrPrsnlReltnCd)
	    if(iRet != 333)
	        call ErrorHandler2("EXECUTE", "F", "VALIDATE",
	        build("ENCNTR_PRSNL_RELTN code value: ",cnvtint(dEncntrPrsnlReltnCd)," is not valid"),
	        "2030", build("ENCNTR_PRSNL_RELTN code invalid: ",cnvtint(dEncntrPrsnlReltnCd)), patient_relationship_reply_out)
	        go to EXIT_SCRIPT
	    endif
	    
	    ;Check to see if user already has corresponding ENCNTR_PRSNL relation with patient
	    select into "nl:"
	        epr.encntr_prsnl_reltn_id
	    from encntr_prsnl_reltn epr
	    where epr.prsnl_person_id = dPrsnlId
	        and epr.encntr_prsnl_r_cd = dEncntrPrsnlReltnCd
	        and epr.encntr_id = dEncntrId
	    with nocounter
	 
	    if(curqual > 0)
	        call ErrorHandler2("EXECUTE", "F", "DUPLICATE", "ENCNTR_PRSNL_RELTN already exists",
	        "9999", "ENCNTR_PRSNL_RELTN already exists", patient_relationship_reply_out)	;011
	        go to EXIT_SCRIPT
	    endif
	endif
	 
	;Check PERSON_PRSNL_RELTN code value against code_set 331
	if(dPersonPrsnlReltnCd > 0)
		set iRet = GetCodeSet(dPersonPrsnlReltnCd)
		if(iRet != 331)
	        call ErrorHandler2("EXECUTE", "F", "VALIDATE",
	        	build("PERSON_PRSNL_RELTN code value: ",cnvtint(dPersonPrsnlReltnCd)," is not valid"),
	        	"2029",build("PERSON_PRSNL_RELTN code invalid: ",cnvtint(dPersonPrsnlReltnCd)), patient_relationship_reply_out)
	        go to EXIT_SCRIPT
	    endif
	    
	    ;Check to see if user already has corresponding PERSON_PRSNL relation with patient
	    select into "nl:"
	        ppr.person_prsnl_reltn_id
	    from person_prsnl_reltn ppr
	    where ppr.prsnl_person_id = dPrsnlId
	    	and ppr.person_id = dPersonId
	        and ppr.person_prsnl_r_cd = dPersonPrsnlReltnCd
	    with nocounter
	 
	    if(curqual > 0)
	        call ErrorHandler2("EXECUTE", "F", "DUPLICATE", "PERSON_PRSNL_RELTN already exists",
	        "9999", "PERSON_PRSNL_RELTN already exists", patient_relationship_reply_out)	;011
	        go to EXIT_SCRIPT
	    endif
	endif

	if(idebugFlag > 0)
		call echo(concat("PreAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: AddPrsnlReltn
;  Description: Adds one or more entries to the PERSON_PRSNL_RELTN and ENCNTR_PRSNL_RELTN
**************************************************************************/
subroutine AddPrsnlReltn(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPrsnlReltn Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echorecord(request)
	endif
	
	set request->person_prsnl_reltn_cd	= dPersonPrsnlReltnCd
 
	if(dPersonPrsnlReltnCd > 0) ;005
		set request->person_id	= GetPersonIdByEncntrId(dEncntrId)
	endif
	 
	set request->encntr_prsnl_reltn_cd	= dEncntrPrsnlReltnCd
	set request->encntr_id				= dEncntrId
	set request->beg_effective_dt_tm	= cnvtdatetime(curdate, curtime) ;cnvtdatetime(begDt)
	set	request->prsnl_person_id		= dPrsnlId
	set	reqinfo->updt_id 				= request->prsnl_person_id
	set reqinfo->updt_task              =  TASK_NUMBER ;500195
	 
	if(endDt = "")
		set request->end_effective_dt_tm	= cnvtdatetime("31-DEC-2100")
	else
		set request->end_effective_dt_tm	= cnvtdatetime(endDt)
	endif
	 
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER,"REC",request,"REC",patient_relationship_reply_out)
	 
	if (patient_relationship_reply_out->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "STEP_FAILED",
		"Error setting patient relationship in step: 600312",
		"9999", "CRM STEP 600312 FAILED", patient_relationship_reply_out)	;011
		go to EXIT_SCRIPT
	else
	 	call ErrorHandler("EXECUTE", "S", "SUCCESS", "Success Adding User relationship", patient_relationship_reply_out)
	endif
	 
	if(idebugFlag > 0)
		call echo(concat("AddPrsnlReltn Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
end go
 
