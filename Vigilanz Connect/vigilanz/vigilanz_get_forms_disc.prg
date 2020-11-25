/***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************
          Date Written:       09/03/19
          Source file name:   snsro_get_forms_disc.prg
          Object name:        vigilanz_get_forms_disc
          Program purpose:    Provides powerform details
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 09/03/19 	RJC			Initial Write
 001 09/09/19   RJC         Renamed file and object
 ***********************************************************************/
;drop program snsro_get_forms_discovery go
drop program vigilanz_get_forms_disc go
create program vigilanz_get_forms_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""       ;Optional
		, "FormId" = ""			;Required
		, "Debug Flag" = 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,FORMID,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
if(validate(snsro_get_forms_disc_includes_executed, 0) = 0)
  declare snsro_get_forms_disc_includes_executed = i2 with persistscript, constant(1)
  execute snsro_common
  execute snsro_common_pwrform
endif

/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUsername					= vc with protect, noconstant("")
declare dFormId						= f8 with protect, noconstant(0.0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("TASKS_DISCOVERY")
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUsername								= trim($USERNAME, 3)
set dFormId									= cnvtreal($FORMID)
set iDebugFlag								= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dFormId  ->", dFormId))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/

/*************************************************************************
; MAIN
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUsername, 0.0, final_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUsername), final_reply_out)
 	go to exit_script
endif
 
; Validate FormId exists
if(dFormId = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "FormId is required.",
	"9999","FormId is required.", final_reply_out)
 	go to exit_script
endif
 
; Get Form Detail -- 600373 - dcp_get_dcp_form
set iRet = common_pwrform::GetFormDetail(dFormId)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve form details (600373).",
	"9999","Could not retrieve form details (600373).", final_reply_out)
 	go to exit_script
endif
 
; Get Section Detail -- 600471 - dcp_get_section_input_runtime
set iRet = common_pwrform::GetSectionDetail(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve section details (600471).",
	"9999","Could not retrieve section details (600471).", final_reply_out)
 	go to exit_script
endif
 
; Get Form Detail -- 600356 - dcp_get_dta_info_all
set iRet = common_pwrform::GetDtaDetail(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve response details (600356).",
	"9999","Could not retrieve response details (600356).", final_reply_out)
 	go to exit_script
endif
 
;PostAmble - finalize reply out
call common_pwrform::PostAmble(null)
 
; Set audit to success
call ErrorHandler2(c_error_handler_name, "S", "Success", "Completed successfully.",
"0000","Completed successfully.", final_reply_out)
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_forms_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
 
end
go
 
