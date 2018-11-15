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
*                                                                     *
  ~BE~***********************************************************************/
/*****************************************************************************
 
        Source file name:     snsro_get_ccd.prg
        Object name:          SNSRO_GET_CCD
        Request #:            Executes XMLDocumentGenerationSync_GenerateAndReturn
                              (1370052)
 
        Program purpose:      Read Continuity of Care Document by
                              FIN number
 
 
        Tables read:          XR Report Writer
        Tables updated:       NONE
        Executing from:       CCL
 
        Special Notes:        NONE
*******************************************************************************/
/*;~DB~*********************`***************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     001 10/16/15 JCO        	        Initial Release                     *
;	  002 11/23/15 AAB 					Add Audit object					*
;     003 03/07/16 AAB					Base64 encode the XML CCD			*
;	  004 04/29/16 AAB 					Added version
;     005 10/10/16 AAB 					Add DEBUG_FLAG
;     006 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
;     007 08/17/17 JCO					Updated UTC
;	  008 03/21/18 RJC					Added version control and copyright block
;~DE~************************************************************************/
 
drop program snsro_get_ccd go
create program snsro_get_ccd
 
/**************************************************************
* SCRIPT INPUT PARAMETERS
**************************************************************/
prompt
 
 "Output to File/Printer/MINE" = "MINE"	;* Enter or select the printer or file name to send this report to.
 ,"Username" = ""					;(optional) for audit purposes, the user requesting the CCD
 ,"Financial Number" = ""			;(optionally required) patient & visit identifier
 ,"Person Id" = 0.0					;(optionally required) if Financial Number is passed, this field is ignored
 ,"Encounter Id" = 0.0				;(optionally required) if Financial Number is passed, this field is ignored
 ,"From Date" = "01-JAN-1900"		;(optional) begin date of CCD report. default is 1900-JAN01 00:00:00.00
 ,"End Date" = "31-DEC-2100"		;(optional) end date of CCD report.  default is 2100-DEC-31 12:59:59.59
 ,"Report Template" = 0.0			;(required) CCD report template is required to pass in since client can have many
 ,"Debug Flag" = 0					;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, FIN, PERSON_ID, ENCNTR_ID, FROM_DATE, TO_DATE, REPORT_TEMP, DEBUG_FLAG   ;005

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif

/**************************************************************
; DECLARE and SET VARIABLES
**************************************************************/
declare JSONout 				= vc with protect, noconstant("")
declare sFinNbr 				= vc with protect, noconstant("")
declare sUsername				= vc with protect, noconstant("")
declare dPersonID  				= f8 with protect, noconstant(0.0)
declare dEncntrID           	= f8 with protect, noconstant(0.0)
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare dReportTemplate 		= f8 with protect, noconstant(0.0)
declare iRet					= i2 with protect, noconstant(0) 	 ;002
declare iBase64Size         	= i4 with protect, noconstant(0)     ;003
declare strEncoded          	= gvc with protect, noconstant("")   ;003
declare nResponseSize   		= i4 with protect, noconstant(0)     ;003
declare idebugFlag				= i2 with protect, noconstant(0) 	 ;005
declare UTCmode					= i2 with protect, noconstant(0)	 ;007
declare UTCpos 					= i2 with protect, noconstant(0)	 ;007
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;006 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare PopulateRequest(null)			= null with protect
declare uar_si_encode_base64 (p1=vc(ref), p2=i4(ref), p3=i4(ref) ) = vc   ;003
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
 
set file_name 		= $OUTDEV
set sFinNbr 		= $FIN
set sUsername		= $USERNAME
set dPersonID   	= cnvtint($PERSON_ID)
set dEncntrID    	= cnvtint($ENCNTR_ID)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set dReportTemplate = cnvtint($REPORT_TEMP)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;005
set UTCmode			= CURUTC ;007
set UTCpos			= findstring("Z",sFromDate,1,0);007
 
 
if(idebugFlag > 0)
 
	call echo(build("$FROM_DATE -->",sFromDate))
	call echo(build("$TO_DATE -->",sToDate))
	call echo(build("sFinNbr -->",sFinNbr))
	call echo(build("sUsername -->",sUsername))
	call echo(build("UTC MODE -->",UTCmode));007
 	call echo(build("UTC POS -->",UTCpos));007
 
 
endif
 
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record req_in
record req_in (
  1 person_id = f8
  1 encntr_id = f8
  1 report_template_id = f8
  1 archive_ind = f8
  1 authorization_mode = i2
  1 provider_patient_reltn_cd = f8
  1 begin_qual_date = dq8
  1 end_qual_date = dq8
  1 debug_ind = i2
  1 custodial_organization_id = f8
)
 
free record ccd_reply_out
record ccd_reply_out (
 1 document = gvc
 1 handle = vc
/*006 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*006 end */
 1 document_info_id = f8
 1 audit
  2 user_id	= f8
  2 user_firstname = vc
  2 user_lastname = vc
  2 patient_id = f8
  2 patient_firstname = vc
  2 patient_lastname = vc
  2 service_version			= vc	;004
)
 
set ccd_reply_out->status_data->status = "F"
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dReportTemplate > 0)
 
	set iRet = PopulateAudit(sUserName, dPersonID, ccd_reply_out, sVersion)    ;003   004
 
	if(iRet = 0)  ;003
		call ErrorHandler2("VALIDATE", "F", "User is invalid", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), ccd_reply_out)	;006
		go to exit_script
 
	endif
 
	call PopulateRequest(null)
	call PopulateAudit(sUserName, req_in->person_id, ccd_reply_out, sVersion)    ;003   004
else
 	call ErrorHandler2("VALIDATE", "F", "REPORT_TEMPLATE", "Report template is empty.",
	"2027", "Report TemplateId is zero or empty", ccd_reply_out)	;006
	go to exit_script
 
endif
 
/*************************************************************
* Get the patient information from the fin number
**************************************************************/
subroutine PopulateRequest(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PopulateRequest Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	set req_in->archive_ind = 0
	set req_in->authorization_mode = 0
	set req_in->provider_patient_reltn_cd = 0.0
	set req_in->debug_ind = 0
	set req_in->custodial_organization_id = 0.0
	set req_in->report_template_id = dReportTemplate
 
	if(sFromDate > " ")
		set req_in->begin_qual_date = cnvtdatetime(sFromDate)
	else
		set req_in->begin_qual_date = cnvtdatetime("1900-JAN-01 00:00:00")
	endif
 
/*007 UTC begin */
 if (UTCmode = 1 and UTCpos > 0)
	set startDtTm = cnvtdatetimeUTC(sFromDate) ;;;
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(sToDate)
	endif
else
	set startDtTm = cnvtdatetime(sFromDate)
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(sToDate)
	endif
endif
/*007 UTC end */
 
/*007 begin
if(sToDate > " ")
		set req_in->end_qual_date = cnvtdatetime(sToDate)
	else
		set req_in->end_qual_date = cnvtdatetime("2100-DEC-31 00:00:00")
	endif
007 end */
 
	if(sFinNbr > " ")
		select into "nl:"
		    p.person_id
	    	,e.encntr_id
		from encntr_alias ea
			,encounter e
			,person p
		plan ea
			where ea.alias = sFinNbr
		join e
			where e.encntr_id = ea.encntr_id
		join p
			where p.person_id = e.person_id
		detail
		    req_in->person_id = p.person_id
		    req_in->encntr_id = e.encntr_id
 
		with nocounter, maxrec=100
 
		if(curqual =0)
			call ErrorHandler2("SELECT", "F", "ENCNTR_ALIAS", "Invalid FIN",
			"2039", build("FinancialNumber is invalid: ",sFinNbr), ccd_reply_out)	;006
			go to exit_script
	    endif
	endif
 
	if(req_in->person_id < 1)
		if(dPersonID > 0)
			set req_in->person_id = dPersonID
		else
			call ErrorHandler2("SELECT", "F", "ENCNTR_ALIAS", "Invalid PersonId",
			"2003", build("PatientId is invalid: ",dPersonID), ccd_reply_out)	;006
			go to exit_script
		endif
	endif
 
	if(req_in->encntr_id < 1)
		if(dEncntrID > 0)
			set req_in->encntr_id = dEncntrID
		endif
	endif
 
if(idebugFlag > 0)
 
	call echo(build("person id: ",req_in->person_id))
	call echo(build("encntr id: ",req_in->encntr_id))
 
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("PopulateRequest Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/**************************************************************
* Execute XMLDocumentGeneratorSync_GenerateAndReturn (1370052)
* through TDBEXECUTE
**************************************************************/
if(idebugFlag > 0)
 
	call echorecord(req_in)
 
endif
 
set stat = tdbexecute(3202004, 3202004, 1370052,"REC",req_in,"REC",ccd_reply_out)
 
;003 +
set nResponseSize   =   size(notrim(ccd_reply_out->document))
 
if(idebugFlag > 0)
 
	call echo(build("Stat --->", stat))
	call echo(build("nResponseSize -->"))
 
endif
 
set strEncoded = uar_si_encode_base64(ccd_reply_out->document, nResponseSize, iBase64Size)
set strEncoded = substring(1, iBase64Size, strEncoded)
set ccd_reply_out->document = ""
set ccd_reply_out->document = strEncoded
;003 -
if(idebugFlag > 0)
 
	call echorecord(ccd_reply_out)
 
endif
 
 
/*************************************************************
* Evaluate STAT for error handling
**************************************************************/
call echo(build("tdbexecute=",stat))
if (stat = 0)
	    go to EXIT_SCRIPT
else
		call ErrorHandler2("SELECT", "F", "TDBEXECUTE", "Request 1370052 Failure",
		"9999", build("Execution of request 1370052 failed.  Stat: ",stat), ccd_reply_out)	;006
		go to exit_script
 
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_ccd.json")
	call echo(build2("_file : ", _file))
	call echojson(ccd_reply_out, _file, 0)
 
endif
 
set JSONout = CNVTRECTOJSON(ccd_reply_out)
 
if(idebugFlag > 0)
 	call echorecord(ccd_reply_out)
	call echo(JSONout)
 
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif

#EXIT_VERSION

end
go
