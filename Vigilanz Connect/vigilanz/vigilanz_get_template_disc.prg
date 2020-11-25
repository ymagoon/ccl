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
/*****************************************************************************
          Date Written:       	10/22/15
          Source file name:   	snsro_get_template_disc.prg
          Object name:       	vigilanz_get_template_disc
          Request #:
          Program purpose:	Queries CR_REPORT_TEMPLATE for custom template reports.
          Tables read:		CR_REPORT_TEMPLATE
          Tables updated:	NONE
          Executing from:	EMISSARY SERVICES
          Special Notes:	NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 10/23/17 DJP		    		Initial write (copied/updated CCD discovery)
  001 03/21/18 RJC					Added version code and copyright block
  002 09/09/19 RJC                  Renamed file and object
 ***********************************************************************/
;drop program snsro_get_template_discovery go
drop program vigilanz_get_template_disc go
create program vigilanz_get_template_disc
 
prompt
	"Output to File/Printer/MINE"	= "MINE"
	,"User Name: " = ""
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, DEBUG_FLAG

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;001
if($OUTDEV = "VERSION")
	go to exit_version
endif 
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record custom_template_reply_out
record custom_template_reply_out (
  1 reports[*]
    2 report_id				= f8
    2 report_name			= vc
    2 report_name_key		= vc
    2 report_active_ind		= i2
    2 report_beg_eff_dt_tm	= dq8
    2 report_end_eff_dt_tm	= dq8
 1 audit
	2 user_id					= f8
	2 user_firstname			= vc
	2 user_lastname				= vc
	2 patient_id				= f8
	2 patient_firstname			= vc
	2 patient_lastname			= vc
	2 service_version			= vc
 
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
 
set custom_template_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName				= vc with protect, noconstant("")
;declare iIncInactive		= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm = DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare idebugFlag			= i2 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName			= trim($USERNAME, 3)
;set iIncInactive		= cnvtint($INC_INACTIVE)
set idebugFlag			= cnvtint($DEBUG_FLAG)
 
/*
if(idebugFlag > 0)
 
	call echo(build("iIncInactive --> ", iIncInactive))
 
endif
*/
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetCustomTemplateReports(null)	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
set iRet = PopulateAudit(sUserName, 0.0, custom_template_reply_out, sVersion)
if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "User is invalid", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), custom_template_reply_out)
		go to EXIT_SCRIPT
 
	endif
	call GetCustomTemplateReports(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
set JSONout = CNVTRECTOJSON(custom_template_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_custom_template_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(custom_template_reply_out, _file, 0)
 
	call echorecord(custom_template_reply_out)
	call echo(JSONout)
 
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif

#EXIT_VERSION
/*************************************************************************
;  Name: GetCustomTemplateReports(null)
;  Description: Returns report template reference data for custom reports
;
**************************************************************************/
subroutine GetCustomTemplateReports(null)
 
declare parseInactiveStr	= vc with  protect, noconstant("")
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetCustomTemplateReports Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
/* remove Inactive Flag
if(iIncInactive > 0)
	set parseInactiveStr = ' cr.active_ind in(0,1) '
else
	set parseInactiveStr = ' cr.active_ind = 1 '
endif
*/
set i = 0
 
	select into "nl:"
		cr.report_template_id
		,cr.template_name
	from cr_report_template cr
	plan cr
	where cr.active_ind = 1 ; parser(parseInactiveStr)
		and cr.beg_effective_dt_tm + 0 <= cnvtdatetime(curdate, curtime3)
		and cr.end_effective_dt_tm + 0 >= cnvtdatetime(curdate, curtime3)
	order cr.report_template_id
 
	detail
	  i = i + 1
	  stat = alterlist(custom_template_reply_out->reports,i)
	 custom_template_reply_out->reports[i].report_id = cr.report_template_id
	 custom_template_reply_out->reports[i].report_name = trim(cr.template_name, 3)
	 custom_template_reply_out->reports[i].report_name_key = trim(cr.template_name_key, 3)
	 custom_template_reply_out->reports[i].report_active_ind = cr.active_ind
	 custom_template_reply_out->reports[i].report_beg_eff_dt_tm = cr.beg_effective_dt_tm
	 custom_template_reply_out->reports[i].report_end_eff_dt_tm = cr.end_effective_dt_tm
	with nocounter
 
if (curqual = 0)
  call ErrorHandler("SELECT", "Z", "CR_REPORT_TEMPLATE", "No report templates found.", custom_template_reply_out);002
 
else
  call ErrorHandler("SELECT", "S", "CR_REPORT_TEMPLATE", "Successfully retrieved report templates.", custom_template_reply_out)
 
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetCustomTemplateReports Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
