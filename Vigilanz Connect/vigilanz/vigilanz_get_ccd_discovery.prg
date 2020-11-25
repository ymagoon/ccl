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
          Source file name:   	vigilanz_get_ccd_discovery
          Object name:       	vigilanz_get_ccd_discovery
          Request #:
          Program purpose:	Queries CR_REPORT_TEMPLATE for CCD reports.
          					Report TEMPLATE_NAME_KEY must have "CCD" in the name.
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
  000 10/22/15 JCO		    		Initial write
  001 04/29/16 AAB 					Added version
  002 10/10/16 AAB 					Add DEBUG_FLAG
  003 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  004 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
 
drop program vigilanz_get_ccd_discovery go
create program vigilanz_get_ccd_discovery

prompt
	"Output to File/Printer/MINE"	= "MINE"
	,"Include Inactive "			= 0
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, INC_INACTIVE, DEBUG_FLAG   ;002
 
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
free record ccd_report_reply_out
record ccd_report_reply_out (
  1 reports[*]
    2 report_id		= f8
    2 report_name			= vc
    2 report_name_key		= vc
    2 report_active_ind		= i2
    2 report_beg_eff_dt_tm	= dq8
    2 report_end_eff_dt_tm	= dq8
 1 audit			 ;001
	2 user_id					= f8
	2 user_firstname			= vc
	2 user_lastname				= vc
	2 patient_id				= f8
	2 patient_firstname			= vc
	2 patient_lastname			= vc
	2 service_version			= vc
/*003 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*003 end */
)
 
set ccd_report_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare iIncInactive		= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm = DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare idebugFlag			= i2 with protect, noconstant(0) ;002
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set iIncInactive		= cnvtint($INC_INACTIVE)
set idebugFlag			= cnvtint($DEBUG_FLAG)  ;002
 
if(idebugFlag > 0)
 
	call echo(build("iIncInactive --> ", iIncInactive))
 
endif
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;003 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetCCDReports(null)	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
call GetCCDReports(null)
set iRet = PopulateAudit("", 0.0, ccd_report_reply_out, sVersion)      ;001
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
set JSONout = CNVTRECTOJSON(ccd_report_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_ccd_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(ccd_report_reply_out, _file, 0)
 
	call echorecord(ccd_report_reply_out)
	call echo(JSONout)
 
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetCCDReports(null)
;  Description: Returns report template reference data for CCD reports
;
**************************************************************************/
subroutine GetCCDReports(null)
 
declare parseInactiveStr	= vc with  protect, noconstant("")
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetCCDReports Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
if(iIncInactive > 0)
	set parseInactiveStr = ' cr.active_ind in(0,1) '
else
	set parseInactiveStr = ' cr.active_ind = 1 '
endif
 
set i = 0
 
	select into "nl:"
		cr.report_template_id
		,cr.template_name
	from cr_report_template cr
	plan cr
	where cr.template_name_key = "*CCD*"
		and parser(parseInactiveStr)
		and cr.beg_effective_dt_tm + 0 <= cnvtdatetime(curdate, curtime3)
		and cr.end_effective_dt_tm + 0 >= cnvtdatetime(curdate, curtime3)
	order cr.report_template_id
 
	detail
	  i = i + 1
	  stat = alterlist(ccd_report_reply_out->reports,i)
	  ccd_report_reply_out->reports[i].report_id = cr.report_template_id
	  ccd_report_reply_out->reports[i].report_name = trim(cr.template_name, 3)
	  ccd_report_reply_out->reports[i].report_name_key = trim(cr.template_name_key, 3)
	  ccd_report_reply_out->reports[i].report_active_ind = cr.active_ind
	  ccd_report_reply_out->reports[i].report_beg_eff_dt_tm = cr.beg_effective_dt_tm
	  ccd_report_reply_out->reports[i].report_end_eff_dt_tm = cr.end_effective_dt_tm
	with nocounter
 
if (curqual = 0)
  call ErrorHandler("SELECT", "Z", "CR_REPORT_TEMPLATE", "No CCD report templates found.", ccd_report_reply_out);002
 
else
  call ErrorHandler("SELECT", "S", "CR_REPORT_TEMPLATE", "Successfully retrieved CCD report templates.", ccd_report_reply_out)
 
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetCCDReports Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
