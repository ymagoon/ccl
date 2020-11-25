/*~BB~************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.
                                                                   *
   ~BE~***********************************************************************/
/****************************************************************************
      Source file name:     snsro_get_custom_report.prg
      Object name:          vigilanz_get_custom_report
      Program purpose:      Return data created by custom report
      Tables read:			DPROTECT
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:  		There are a few assumptions with this script:
							- The first parameter provided is always for $OUTDEV
							- If the first parameter says anything other than "MINE", it is assumed that a
							  filename has been provided
							- If a filename hasn't been provided, then it would be calling a Sansoro script where
							  the output is sent to _MEMORY_REPLY_STRING
							- If any of the above aren't true, then no data would be returned
**********************************************************************************/
/**********************************************************************
*                   MODIFICATION CONTROL LOG                          *
***********************************************************************
*                                                                     *
*Mod Date     	Engineer      		Comment                            *
*--- -------- 	------------------- -----------------------------------*
 000 09/19/17  	DJP                 Initial write
 001 02/08/18	RJC					Changes to be able to use parameter list
 002 03/21/18	RJC					Added version code and copyright block
***********************************************************************/
 
drop program vigilanz_get_custom_report  go
create program vigilanz_get_custom_report
 
 prompt
	"Output to File/Printer/MINE" = "MINE"
	,"Username:" = ""			;Required
	,"Program Name:" = ""		;Required
	,"PersonId:" = ""			;Optional
	,"Parameters:" = ""  		;Required - Base64 encoded parameter string
	,"Debug Flag" = 0			;Optional
 
with OUTDEV, USERNAME, PROG_NAME, PERSON_ID, PARAMS, DEBUG_FLAG

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record custom_report_reply_out
record custom_report_reply_out
(
 1 person_id 					= f8
 1 program_name					= vc
 1 parameters					= gvc
 1 output						= gvc
 1 filename						= vc
 1 audit
	2 user_id					= f8
	2 user_firstname			= vc
	2 user_lastname				= vc
	2 patient_id				= f8
	2 patient_firstname			= vc
	2 patient_lastname			= vc
	2 service_version			= vc
 1 status_data
    2 status					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
)
 
free record frec
record frec(
 	 1 file_desc					= i4
	 1 file_offset					= i4
	 1 file_dir						= i4
	 1 file_name					= vc
	 1 file_buf						= gvc
 )
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/**************************************************************
;DECLARE VARIABLES
**************************************************************/
declare sUserName				= vc with protect, noconstant("")
declare dPersonId  				= f8 with protect, noconstant(0.0)
declare sProgName				= vc with protect, noconstant("")
declare sParameters				= vc with protect, noconstant("")
declare idebugFlag				= i2 with protect, noconstant(0)
 
/****************************************************************
;INITIALIZE VARIABLES
****************************************************************/
set dPersonId		= cnvtreal($PERSON_ID)
set sUserName		= trim($USERNAME, 3)
set sProgName		= trim($PROG_NAME, 3)
set sParameters		= base64_decode(trim($PARAMS,3))
set idebugFlag		= cnvtint($DEBUG_FLAG)
 
set Modify MAXVARLEN 50000000
 
/**************************************************************
;DECLARE SUBROUTINES
**************************************************************/
declare ValidateProgram(null) = i2 with protect
declare GetCustomReport(null)= null with protect
 
/**************************************************************
;CALL SUBROUTINES
***************************************************************/
 
; Validate Program Name
if(sProgName > " ")
	set iRet = ValidateProgram(null)
	if(iRet = 0)
		call ErrorHandler2("Validate", "F", "GET CUSTOM REPORT", "Invalid URI Parameters: ProgramId",
		"9999", build("The ProgramId provided does not exist: ", sProgName), custom_report_reply_out)
		go to EXIT_SCRIPT
	endif
else
	call ErrorHandler2("Validate", "F", "GET CUSTOM REPORT", "Missing URI Parameters: ProgramId",
	"9999", build("Missing URI Parameters: ProgramId"), custom_report_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate Username
set iRet = PopulateAudit(sUserName, dPersonId, custom_report_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "GET CUSTOM REPORT", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ",sUserName), custom_report_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate parameters exist
if(sParameters <= " ")
	call ErrorHandler2("VALIDATE", "F", "GET CUSTOM REPORT", "Missing URI parameters.",
	"9999", build("Missing URI parameters: Program parameters are required."), custom_report_reply_out)
	go to EXIT_SCRIPT
endif
 
;Execute request
call GetCustomReport(null)
 
; Set Audit to a successful status
call ErrorHandler2("Success", "S", "GET CUSTOM REPORT", "Custom Report retrieved successfully.",
"0000","Custom Report retrieved successfully.",custom_report_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* RETURN JSON
*************************************************************/
set JSONout = CNVTRECTOJSON(custom_report_reply_out)
 
if(idebugFlag > 0)
	call echorecord(custom_report_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_custom_report.json")
	call echo(build2("_file : ", _file))
	call echojson(custom_report_reply_out, _file, 0)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/**************************************************************
;SUBROUTINES
***************************************************************/
 
/**************************************************************
; Name: ValidateProgram(null) = null
; Description: Verify the program name is valid
***************************************************************/
subroutine ValidateProgram(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateProgram Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from dprotect d
	where d.object_name = cnvtupper(sProgName)
	detail
		iValidate = 1
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("ValidateProgram Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/**************************************************************
; Name: GetCustomReport(null) = null
; Description: Execute the custom report
***************************************************************/
subroutine GetCustomReport(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCustomReport Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare isFile = i2
	declare filename = vc
	declare output = gvc
 
	; Verify if filename was provided
	if(findstring(",",sParameters,1,0) > 0)
		set filename = piece(sParameters,",",1,"")
	else
		set filename = sParameters
	endif
	if(filename != "")
		if(findstring("MINE",cnvtupper(filename),1,0) > 0)
			set isFile = 0
			set filename = build(sProgName,".json")
		else
			set isFile = 1
			set filename = replace(filename,"'","")
		endif
	endif
 
	;If a filename is specified, then read the file and encode it for the output
	if(isFile)
 
		;Execute report
		set cmd = build2("execute ", sProgName," ",sParameters," go")
		call parser(cmd)
 
		; Read the file
		declare buff_array = vc
		declare len = i4
 
 		; Open the file for reading
		set frec->file_name = filename
		set frec->file_buf = "r"
		set stat = CCLIO("OPEN",frec)
 
		; Get the length of the file
		set frec->file_dir = 2
		set stat = CCLIO("SEEK",frec)
		set len = CCLIO("TELL", frec)
 
		; Start at beginning of file and save contents to the buff_array
		set frec->file_dir = 0
		set stat = CCLIO("SEEK",frec)
		set stat = memrealloc(buff_array,1,build("C",len))
		set frec->file_buf = notrim(buff_array)
		set stat = CCLIO("READ",frec)
 
 		; Base64 Encode file contents
	 	set custom_report_reply_out->output = base64_encode(frec->file_buf)
 
	 	; Delete file to cleanup directory
	 	set stat = remove(filename)
 
	; If no file specified, then assume the output is written out to _MEMORY_REPLY_STRING (snsro scripts)
	else
		;Execute report
		set cmd = build2("execute ", sProgName," ",sParameters," with replace('_MEMORY_REPLY_STRING',OUTPUT) go")
		call parser(cmd)
 
 		; Base64 Encode output
		set custom_report_reply_out->output =  base64_encode(output)
	endif
 
	; Post Amble
	set custom_report_reply_out->person_id = dPersonId
	set custom_report_reply_out->program_name = sProgName
	set custom_report_reply_out->parameters = sParameters
	set custom_report_reply_out->filename = filename
 
	if(idebugFlag > 0)
		call echo(concat("GetCustomReport Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
set trace notranslatelock go
 
 
