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
      Source file name:     snsro_get_pop_meddispense.prg
      Object name:          vigilanz_get_pop_meddispense
      Program purpose:      Retrieve med dispenses within a timeframe
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
************************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer     Comment
  --- -------- ------------	--------------------------------------------
  000 03/08/20 STV         Intitial Release
  001 05/12/20 STV         Query Adjustment
***********************************************************************/
drop program vigilanz_get_pop_meddispense go
create program vigilanz_get_pop_meddispense
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:"  = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:"  = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:"  = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max"   = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
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
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_meddispense_reply_out
record pop_meddispense_reply_out(
	1 dispense_cnt = i4
	1 dispense[*]
		2 create_updt_dt_tm = dq8
		2 order_id = f8
  	 	2 dispense_hx[*]
  			3 dispense_hx_id = f8
  			3 dispense_dt_tm = dq8
 
   1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
	    2 query_execute_time		= vc
	    2 query_execute_units		= vc
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
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
;initialize status to FAIL
set pop_meddispense_reply_out->status_data.status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName				= vc with protect, noconstant("")
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare sLocFacilities			= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
declare iTimeMax				= i4 with protect, noconstant(0)
 
;Other
declare qFromDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff				= i4 with protect, noconstant(0)
declare sLocWhereClause				= vc with protect, noconstant("")
declare sEncWhereClause					= vc with protect, noconstant("")
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
declare iMaxRecs						= i4 with protect, constant(2001)
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseLocations(sLocFacilities = vc)	= null with protect
declare GetDispense(null)                   = null with protect
 
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($BEG_DATE,3)
set sToDate						= trim($END_DATE,3)
set sLocFacilities				= trim($LOC_LIST,3)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
;Other
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("Time Maximum -> ", iTimeMax))
	call echo (build("iTimeMax---->",iTimeMax))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
 	call echo(build("sLocFacilities -> ", sLocFacilities))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Check for future dates ;012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_meddispense_reply_out)
	go to EXIT_SCRIPT
endif
 
; Check difference between start and end date/time does not exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_MEDDISPENSE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_meddispense_reply_out) ;006
	go to EXIT_SCRIPT
endif
 
 ;Populate audit
set iRet = PopulateAudit(sUserName,  0.0, pop_meddispense_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_MEDDISPENSE", "Invalid User for Audit.",
	"1001",build("UseriD is invalid: ",sUserName),pop_meddispense_reply_out) ;006
	set pop_meddispense_reply_out->status_data->status = "F"
	go to EXIT_SCRIPT
endif
 
;Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;getting the dispense
call GetDispense(null)
 
;getting the procedure related info
if(pop_meddispense_reply_out->dispense_cnt > 0)
	call ErrorHandler("EXECUTE", "S", "POP_MEDDISPENSE", "Success retrieving med dispense activity",  pop_meddispense_reply_out) ;019
else
    set pop_meddispense_reply_out->status_data->status = "Z"
    call ErrorHandler("EXECUTE", "Z", "POP_MEDDISPENSE", "No records qualify.", pop_meddispense_reply_out)
 
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_meddispense_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_meddispense.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_meddispense_reply_out, _file, 0)
    call echorecord(pop_meddispense_reply_out)
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
;  Name: ParseLocations(sLocFacilties = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
 	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
 
	if(cnvtstring(sLocFacilities) != "")
		while (str != notfnd)
			set str =  piece(sLocFacilities,',',num,notfnd)
			if(str != notfnd)
				set stat = alterlist(loc_req->codes, num)
				set loc_req->codes[num]->code_value = cnvtint(str)
 
				set check = 0
				select into "nl:"
				from code_value
				where code_set = 220 and cdf_meaning = "FACILITY"
					and loc_req->codes[num]->code_value = code_value
				detail
					check = 1
				with nocounter
 
				if (check = 0)
					call ErrorHandler2("EXECUTE", "F", "POP_MEDDISPENSE", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_meddispense_reply_out)
					set stat = alterlist(pop_meddispense_reply_out,0)
					go to exit_script
				endif
			endif
			set num = num + 1
		endwhile
	endif
 
	if(iDebugFlag)
		call echorecord(loc_req)
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetDispense(null)
;  Description: Subroutine to grab med_dispenses rolled up by medication order_id
**************************************************************************/
subroutine GetDispense(null)
 
	if(iDebugFlag > 0)
		set GetDispense_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDispense Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Location filter
	if(size(loc_req->codes,5) > 0)
		set sLocWhereClause = "expand(num,1,size(loc_req->codes,5),e.loc_facility_cd,loc_req->codes[num].code_value)"
	else
		set sLocWhereClause = "e.loc_facility_cd > 0.0 "
	endif
 
	;Set expand control value
	if(size(loc_req->codes,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	;getting the medispense_population
 	select into "nl:"
 	from dispense_hx hx1
 	     ,orders o
 	     ,encounter e
 	     ,dispense_hx hx2
 	plan hx1
 		where hx1.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
 			and hx1.order_id > 0
 	join o
 		where o.order_id = hx1.order_id
 	join e
 		where e.encntr_id = o.encntr_id
 			and parser(sLocWhereClause)
 	join hx2
 		where hx2.order_id = o.order_id
 	order by hx1.order_id, hx1.updt_dt_tm desc, hx2.dispense_hx_id
 	head report
 		x = 0
 
 		head hx1.order_id
 			y = 0
 			x = x + 1
 			if(x < iMaxRecs)
 				stat = alterlist(pop_meddispense_reply_out->dispense,x)
 				pop_meddispense_reply_out->dispense[x].create_updt_dt_tm = hx1.updt_dt_tm
 				pop_meddispense_reply_out->dispense[x].order_id = hx1.order_id
 			endif
 
 			head hx2.dispense_hx_id
 				y = y + 1
 				stat = alterlist(pop_meddispense_reply_out->dispense[x].dispense_hx,y)
 				pop_meddispense_reply_out->dispense[x].dispense_hx[y].dispense_dt_tm = hx2.dispense_dt_tm
 				pop_meddispense_reply_out->dispense[x].dispense_hx[y].dispense_hx_id = hx2.dispense_hx_id
 	foot report
 		pop_meddispense_reply_out->dispense_cnt = x
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
    ;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
 	if(iDebugFlag > 0)
		call echo(concat("GetDispense Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), GetDispense_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end; end subroutine
 
 
end
go
