/***************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

****************************************************************************
      Source file name:     snsro_get_pop_tasks.prg
      Object name:          vigilanz_get_pop_tasks
      Program purpose:      Retrieve tasks listing by time
      Executing from:       Emissary Service
****************************************************************************
                     MODIFICATION CONTROL LOG
****************************************************************************
  Mod Date     Engineer     Comment
  --------------------------------------------------------------------------
  000 02/20/19 RJC			Initial write
  001 04/29/19 STV          Added 115 second Timeout
  002 04/29/19 RJC			Performance improvements - removed dummyt refs
  003 06/11/19 STV          Adding Powerform id and name
  004 08/08/19 STV          Adding task_dt_tm also calculated for this field too
***************************************************************************/
drop program vigilanz_get_pop_tasks go
create program vigilanz_get_pop_tasks
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username"  = ""  			;Required
	, "FromDate" = ""				;Required
	, "ToDate" = ""					;Required
	, "LocationList" = ""			;Optional
	, "TaskTypes" = ""				;Optional
	, "Debug Flag" = 0				;Optional. Verbose logging when set to one (1).
	, "TimeMax" = "3600"			;Only used for debugging purposes
 
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, LOCATION_LIST, TASK_TYPES, DEBUG_FLAG, TIME_MAX
 
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
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
;Final Reply
free record final_reply_out
record final_reply_out (
	1 list[*]
		2 task_id = f8
		2 created_updated_date_time = dq8
		2 scheduled_date_time = dq8
		2 task_dt_tm = dq8
		2 order_id = f8
		2 task_class
			3 id = f8
			3 name = vc
		2 task_type
			3 id = f8
			3 name = vc
		2 task_status
			3 id = f8
			3 name = vc
		2 task_priority
			3 id = f8
			3 name = vc
		2 task_personnel_notification_to[*]
			3 provider_id = f8
			3 provider_name = vc
		2 documented_by
			3 provider_id = f8
			3 provider_name = vc
		2 patient
			3 patient_id = f8
			3 display_name = vc
			3 last_name = vc
			3 first_name = vc
			3 middle_name = vc
			3 mrn = vc
			3 birth_date_time = dq8
			3 sdob = vc
			3 gender
				4 id = f8
				4 name = vc
		2 encounter
			3 encounter_id = f8
			3 encounter_type
				4 id = f8
				4 name = vc
			3 patient_class
				4 id = f8
				4 name = vc
			3 encounter_date_time = dq8
			3 discharge_date_time = dq8
			3 financial_number = vc
			3 location
				4 hospital
					5 id = f8
					5 name = vc
				4 unit
					5 id = f8
					5 name = vc
				4 room
					5 id = f8
					5 name = vc
				4 bed
					5 id = f8
					5 name = vc
		2 other
			3 assign_prsnl_id = f8
			3 assign_group_id = f8
	    2 form
	    	3 id = f8
	    	3 name = vc
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
		2 status 					= c1
		2 subeventstatus[1]
			3 OperationName 		= c25
			3 OperationStatus 		= c1
			3 TargetObjectName 		= c25
			3 TargetObjectValue 	= vc
			3 Code 					= c4
			3 Description 			= vc
)
 
free record temp_locs
record temp_locs (
	1 list[*]
		2 location_cd = f8
)
 
free record temp_types
record temp_types (
	1 list[*]
		2 type_cd = f8
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName						= vc with protect, noconstant("")
declare sFromDate						= vc with protect, noconstant("")
declare sToDate							= vc with protect, noconstant("")
declare sLocations						= vc with protect, noconstant("")
declare sTaskTypes						= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
declare iTimeMax						= i4 with protect, noconstant(0)
 
;Other
declare qFromDate						= dq8 with protect, noconstant(0)
declare qToDate							= dq8 with protect, noconstant(0)
declare iMaxRecs						= i4 with protect, constant(2000)
declare timeOutThreshold 				= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 					= dq8
 
;Constants
declare c_error_handler					= vc with protect, constant("POP TASKS")
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_prn_class_cd                  = f8 with protect,constant(uar_get_code_by("MEANING",6025,"PRN"))
declare c_cont_class_cd                  = f8 with protect,constant(uar_get_code_by("MEANING",6025,"CONT"))
declare c_nosched_class_cd 				 = f8 with protect,constant(uar_get_code_by("MEANING",6025,"NSCH"))
declare c_pending_status_cd             = f8 with protect,constant(uar_get_code_by("MEANING",79,"PENDING"))
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($FROM_DATE,3)
set sToDate						= trim($TO_DATE,3)
set sLocations					= trim($LOCATION_LIST,3)
set sTaskTypes					= trim($TASK_TYPES,3)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
;Other
set qFromDate					= GetDateTime(sFromDate)
set qToDate						= GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ", sUserName))
	call echo(build("sFromDate -> ", sFromDate))
	call echo(build("sToDate -> ", sToDate))
	call echo(build("sLocations -> ", sLocations))
	call echo(build("sTaskTypes -> ", sTaskTypes))
	call echo(build("qFromDate -> ", qFromDate))
	call echo(build("qToDate -> ", qToDate))
endif
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseLocations(null)	= null with protect
declare ParseTaskTypes(null)	= null with protect
declare GetTasks(null)			= null with protect
declare PostAmble(null)			= null with protect
declare GetRelatedForm(null)    = null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, final_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F","Validate", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),final_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date
if (qFromDate > qToDate)
	call ErrorHandler2(c_error_handler,"F","Validate", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", final_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan doesn't exceed threshold - 012
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDate,qToDate)
if(iRet = 0)
	call ErrorHandler2(c_error_handler,"F","Validate", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",final_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse Locations if provided
if(sLocations > " ")
	call ParseLocations(null)
endif
 
; Parse Categories if provided
if(sTaskTypes> " ")
	call ParseTaskTypes(null)
endif
 
; Get Tasks
call GetTasks(null)
 
; Get Related Form
call GetRelatedForm(null)
 
; Get Task Prsnl
call GetTaskPrsnl(null)
 
; Post Amble
call PostAmble(null)
 
; Set audit to success
call ErrorHandler2(c_error_handler,"S","Success", "Process completed successfully.",
	"0000","Process completed successfully.",final_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_tasks.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
    call echorecord(final_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null) = null
;  Description: Subroutine to parse a comma delimited location list
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sLocations,',',num,notfnd)
     	if(str != notfnd)
      		set stat = alterlist(temp_locs->list, num)
     		set temp_locs->list[num].location_cd = cnvtint(str)
 
			select into "nl:"
			from code_value cv
			where cv.code_set = 220
				and cdf_meaning = "FACILITY"
				and temp_locs->list[num].location_cd = cv.code_value
 
     		if (curqual = 0)
     			call ErrorHandler2(c_error_handler,"F","Validate", build2("Invalid LocationId: ", temp_locs->list[num].location_cd),
				"2040", build2("Invalid LocationId: ", temp_locs->list[num].location_cd),final_reply_out)
				go to EXIT_SCRIPT
			endif
      	endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseTaskTypes(null) = null
;  Description: Subroutine to parse a comma delimited task types list
**************************************************************************/
subroutine ParseTaskTypes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseTaskTypes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sTaskTypes,',',num,notfnd)
     	if(str != notfnd)
      		set stat = alterlist(temp_types->list, num)
     		set temp_types->list[num].type_cd = cnvtint(str)
 
			set iRet = GetCodeSet(temp_types->list[num].type_cd)
			if(iRet != 6026)
     			call ErrorHandler2(c_error_handler,"F","Validate", build2("Invalid TaskTypeId: ", temp_locs->list[num].location_cd),
				"9999", build2("Invalid TaskTypeId: ", temp_locs->list[num].location_cd),final_reply_out)
				go to EXIT_SCRIPT
			endif
      	endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseTaskTypes Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetTasks(null) = null
;  Description: Subroutine to return tasks
**************************************************************************/
subroutine GetTasks(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTasks Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare ndx = i4
	declare endx = i4
	declare types_clause = vc
	set locSize = size(temp_locs->list,5)
	set typeSize = size(temp_types->list,5)
 
	; Set task types clause
	if(typeSize > 0)
		set types_clause = " expand(ndx,1,size(temp_types->list,5),ta.task_type_cd,temp_types->list[ndx].type_cd)"
	else
		set types_clause = " ta.task_type_cd > 0"
	endif
 
	;Set expand control value
	if(locSize > 200 or typeSize > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Tasks query
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(locSize > 0)
			from task_activity ta
				, task_activity_assignment taa
				, encounter e
			plan ta where ta.updt_dt_tm >= cnvtdatetime(qFromDate)
				and ta.updt_dt_tm <= cnvtdatetime(qToDate)
				and parser(types_clause)
			join taa where taa.task_id = outerjoin(ta.task_id)
				and taa.active_ind = outerjoin(1)
				and taa.beg_eff_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
				and taa.end_eff_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
			join e where e.encntr_id = ta.encntr_id
				and expand(endx,1,locSize,e.loc_facility_cd,temp_locs->list[endx].location_cd)
			order by ta.updt_dt_tm
		else
			from task_activity ta
				, task_activity_assignment taa
			plan ta where ta.updt_dt_tm >= cnvtdatetime(qFromDate)
				and ta.updt_dt_tm <= cnvtdatetime(qToDate)
				and parser(types_clause)
			join taa where taa.task_id = outerjoin(ta.task_id)
				and taa.active_ind = outerjoin(1)
				and taa.beg_eff_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
				and taa.end_eff_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
			order by ta.updt_dt_tm
		endif
		into "nl:"
		head report
			x = 0
			max_reached = 0
			stat = alterlist(final_reply_out->list,iMaxRecs)
		head ta.updt_dt_tm
			if(x > iMaxRecs)
				max_reached = 1
			endif
		detail
			if(max_reached = 0)
				x = x + 1
				if(mod(x,100) = 1 and x > iMaxRecs)
					stat = alterlist(final_reply_out->list,x + 99)
				endif
 
				final_reply_out->list[x].task_id = ta.task_id
				final_reply_out->list[x].order_id = ta.order_id
				final_reply_out->list[x].created_updated_date_time = ta.updt_dt_tm
				final_reply_out->list[x].documented_by.provider_id = ta.performed_prsnl_id
				final_reply_out->list[x].encounter.encounter_id = ta.encntr_id
				final_reply_out->list[x].patient.patient_id = ta.person_id
				final_reply_out->list[x].scheduled_date_time = ta.scheduled_dt_tm
				final_reply_out->list[x].task_class.id = ta.task_class_cd
				final_reply_out->list[x].task_class.name = uar_get_code_display(ta.task_class_cd)
				final_reply_out->list[x].task_priority.id = ta.task_priority_cd
				final_reply_out->list[x].task_priority.name = uar_get_code_display(ta.task_priority_cd)
				final_reply_out->list[x].task_status.id = ta.task_status_cd
				final_reply_out->list[x].task_status.name = uar_get_code_display(ta.task_status_cd)
				final_reply_out->list[x].task_type.id = ta.task_type_cd
				final_reply_out->list[x].task_type.name = uar_get_code_display(ta.task_type_cd)
				final_reply_out->list[x].other.assign_prsnl_id = taa.assign_prsnl_id
				final_reply_out->list[x].other.assign_group_id = taa.assign_prsnl_group_id
				final_reply_out->list[x].patient.patient_id = ta.person_id
				final_reply_out->list[x].encounter.encounter_id = ta.encntr_id
 
				if(ta.task_class_cd in(c_prn_class_cd,c_cont_class_cd,c_nosched_class_cd)
					and ta.task_status_cd = c_pending_status_cd)
 
					if(cnvtdatetime(curdate ,curtime) > cnvtdatetime(ta.task_dt_tm))
						final_reply_out->list[x].task_dt_tm = cnvtdatetime(curdate ,curtime)
					endif
				else
					final_reply_out->list[x].task_dt_tm = ta.task_dt_tm
				endif
			endif
		foot report
			stat = alterlist(final_reply_out->list,x)
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
		if(size(final_reply_out->list,5) = 0)
			call ErrorHandler2(c_error_handler,"Z","Success", "No records found.","0000", "No records found.",final_reply_out)
			go to EXIT_SCRIPT
 		endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTasks Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetRelatedForm(null) = null
;  Description: Subroutine to return task's related form
**************************************************************************/
subroutine GetRelatedForm(null)
 
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRelatedForm Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	set task_cnt = size(final_reply_out->list,5)
	if(task_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	select into "nl:"
 	from task_activity ta
	     ,order_task ot
	     ,dcp_forms_ref dfr
	plan ta
		where expand(idx,1,task_cnt,ta.task_id,final_reply_out->list[idx].task_id)
			and ta.reference_task_id > 0
	join ot
		where ot.reference_task_id = ta.reference_task_id
			and ot.dcp_forms_ref_id > 0
	join dfr
		where dfr.dcp_forms_ref_id = ot.dcp_forms_ref_id
			and dfr.active_ind = 1
			and dfr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dfr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	detail
		next = 1
 		pos = locateval(idx,next,task_cnt,ta.task_id,final_reply_out->list[idx].task_id)
 
 		while(pos > 0 and next <= task_cnt)
 			final_reply_out->list[pos].form.id = ot.dcp_forms_ref_id
 			final_reply_out->list[pos].form.name = trim(dfr.description)
 
 			next = pos + 1
 			pos = locateval(idx,next,task_cnt,ta.task_id,final_reply_out->list[idx].task_id)
 		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetRelatedForm Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end;End Sub
/*************************************************************************
;  Name: GetTaskPrsnl(null) = null
;  Description: Subroutine to return task assigned prsnl
**************************************************************************/
subroutine GetTaskPrsnl(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskPrsnl Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	set task_cnt = size(final_reply_out->list,5)
	if(task_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	; Get prsnl
	select into "nl:"
	from prsnl p
	where expand(idx,1,task_cnt,p.person_id,final_reply_out->list[idx].other.assign_prsnl_id)
		and p.person_id > 0
	order by p.person_id
	head p.person_id
		x = 0
	detail
		x = x + 1
		next = 1
		pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].other.assign_prsnl_id)
 
		while(pos > 0 and next <= task_cnt)
			stat = alterlist(final_reply_out->list[pos].task_personnel_notification_to,x)
 
			final_reply_out->list[pos].task_personnel_notification_to[x].provider_id = p.person_id
			final_reply_out->list[pos].task_personnel_notification_to[x].provider_name = p.name_full_formatted
 
			next = pos + 1
			pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].other.assign_prsnl_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	; Get Group prsnl
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from prsnl_group_reltn pgr
		, prsnl p
	plan pgr where expand(idx,1,task_cnt,pgr.prsnl_group_id,final_reply_out->list[idx].other.assign_group_id)
		and pgr.prsnl_group_id > 0
		and pgr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pgr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and pgr.active_ind = 1
	join p where p.person_id = pgr.person_id
	order by pgr.prsnl_group_id
	head pgr.prsnl_group_id
		next = 1
		pos = locateval(idx,next,task_cnt,pgr.prsnl_group_id,final_reply_out->list[idx].other.assign_group_id)
		x = size(final_reply_out->list[pos].task_personnel_notification_to,5)
	detail
		x = x + 1
		next = 1
		pos = locateval(idx,next,task_cnt,pgr.prsnl_group_id,final_reply_out->list[idx].other.assign_group_id)
		while(pos > 0 and next <= task_cnt)
			stat = alterlist(final_reply_out->list[pos].task_personnel_notification_to,x)
 
			final_reply_out->list[pos].task_personnel_notification_to[x].provider_id = p.person_id
			final_reply_out->list[pos].task_personnel_notification_to[x].provider_name = p.name_full_formatted
 
			next = pos + 1
			pos = locateval(idx,next,task_cnt,pgr.prsnl_group_id,final_reply_out->list[idx].other.assign_group_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskPrsnl Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Subroutine to get remaining data
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set idx = 1
	set task_cnt = size(final_reply_out->list,5)
	if(task_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Get Patient Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from person p
 	plan p where expand(idx,1,task_cnt,p.person_id,final_reply_out->list[idx].patient.patient_id)
 	detail
 		next = 1
 		pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].patient.patient_id)
 
 		while(pos > 0 and next <= task_cnt)
	 		final_reply_out->list[pos].patient.birth_date_time = p.birth_dt_tm
	 		final_reply_out->list[pos].patient.display_name = p.name_full_formatted
	 		final_reply_out->list[pos].patient.first_name = p.name_first
	 		final_reply_out->list[pos].patient.gender.id = p.sex_cd
	 		final_reply_out->list[pos].patient.gender.name = uar_get_code_display(p.sex_cd)
	 		final_reply_out->list[pos].patient.last_name = p.name_last
	 		final_reply_out->list[pos].patient.middle_name = p.name_middle
	 		final_reply_out->list[pos].patient.sdob = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
	 		next = pos + 1
 			pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].patient.patient_id)
 		endwhile
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get Encounter Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encounter e
		, encntr_alias ea
		, encntr_alias ea2
	plan e where expand(idx,1,task_cnt,e.encntr_id,final_reply_out->list[idx].encounter.encounter_id)
	join ea where ea.encntr_id =  outerjoin(e.encntr_id)
		and ea.beg_effective_dt_tm <=  outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm >  outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.active_ind =  outerjoin(1)
		and ea.encntr_alias_type_cd =  outerjoin(c_mrn_encntr_alias_type_cd)
	join ea2 where ea2.encntr_id =  outerjoin(e.encntr_id)
		and ea2.beg_effective_dt_tm <=  outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm >  outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.active_ind =  outerjoin(1)
		and ea2.encntr_alias_type_cd =  outerjoin(c_fin_encntr_alias_type_cd)
	order by e.encntr_id
 	detail
 		next = 1
 		pos = locateval(idx,next,task_cnt,e.encntr_id,final_reply_out->list[idx].encounter.encounter_id)
 
 		while(pos > 0 and next <= task_cnt)
	 		final_reply_out->list[pos].encounter.discharge_date_time = e.disch_dt_tm
	 		if (e.arrive_dt_tm is null)
				final_reply_out->list[pos].encounter.encounter_date_time = e.reg_dt_tm
			else
				final_reply_out->list[pos].encounter.encounter_date_time = e.arrive_dt_tm
			endif
	 		final_reply_out->list[pos].encounter.encounter_type.id = e.encntr_type_cd
	 		final_reply_out->list[pos].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
	 		final_reply_out->list[pos].encounter.patient_class.id = e.encntr_type_class_cd
	 		final_reply_out->list[pos].encounter.patient_class.name = uar_get_code_display(e.encntr_type_class_cd)
	 		final_reply_out->list[pos].encounter.location.hospital.id = e.loc_facility_cd
	 		final_reply_out->list[pos].encounter.location.hospital.name = uar_get_code_display(e.loc_facility_cd)
	 		final_reply_out->list[pos].encounter.location.unit.id = e.loc_nurse_unit_cd
	 		final_reply_out->list[pos].encounter.location.unit.name = uar_get_code_display(e.loc_nurse_unit_cd)
	 		final_reply_out->list[pos].encounter.location.room.id = e.loc_room_cd
	 		final_reply_out->list[pos].encounter.location.room.name = uar_get_code_display(e.loc_room_cd)
	 		final_reply_out->list[pos].encounter.location.bed.id = e.loc_bed_cd
	 		final_reply_out->list[pos].encounter.location.bed.name = uar_get_code_display(e.loc_bed_cd)
 			final_reply_out->list[pos].patient.mrn = ea.alias
 			final_reply_out->list[pos].encounter.financial_number = ea2.alias
 
 			next = pos + 1
 			pos = locateval(idx,next,task_cnt,e.encntr_id,final_reply_out->list[idx].encounter.encounter_id)
 		endwhile
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	; Get Documented By Prsnl
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from prsnl p
 	plan p where expand(idx,1,task_cnt,p.person_id,final_reply_out->list[idx].documented_by.provider_id)
 	detail
 		next = 1
 		pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].documented_by.provider_id)
 
 		while(pos > 0 and next <= task_cnt)
 			final_reply_out->list[pos].documented_by.provider_name = p.name_full_formatted
 
 			next = pos + 1
 			pos = locateval(idx,next,task_cnt,p.person_id,final_reply_out->list[idx].documented_by.provider_id)
 		endwhile
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end
go
