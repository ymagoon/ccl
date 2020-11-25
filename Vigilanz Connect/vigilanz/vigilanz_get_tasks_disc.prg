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
          Source file name:   snsro_get_tasks_disc.prg
          Object name:        vigilanz_get_tasks_disc
          Program purpose:    Provides task types and associated powerform details
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 09/03/19 	RJC			Initial Write
 001 09/09/19   RJC         Renamed file and object
 ***********************************************************************/
;drop program snsro_get_tasks_discovery go
drop program vigilanz_get_tasks_disc go
create program vigilanz_get_tasks_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""       ;Optional
		, "TaskTypes" = ""		;Optional
		, "Debug Flag" = 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,TASKTYPES,DEBUG_FLAG
 
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
; Final reply out
free record final_reply_out
record final_reply_out (
	1 tasks[*]
		2 id = f8
		2 name = vc
		2 task_activity
			3 id = f8
			3 name  = vc
		2 task_type
			3 id = f8
			3 name = vc
		2 form
			3 id = f8
			3 name = vc
	1 audit
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
	    2 service_version		= vc
	    2 query_execute_time	= vc
	    2 query_execute_units	= vc
  1 status_data
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
)
 
free record task_types
record task_types (
	1 list[*]
		2 id = f8
)
 
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUsername					= vc with protect, noconstant("")
declare sTaskTypes					= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("TASKS_DISCOVERY")
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUsername								= trim($USERNAME, 3)
set sTaskTypes								= trim($TASKTYPES,3)
set iDebugFlag								= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("sTaskTypes ->", sTaskTypes))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseTaskTypes(null)	= null with protect
declare GetTasks(null)			= null with protect
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
 
; Parse TaskType list
if(sTaskTypes > " ")
	call ParseTaskTypes(null)
endif
 
; Get Tasks
call GetTasks(null)
 
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
	set _file = build2(trim(file_path),"/snsro_get_tasks_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseTaskTypes(null) = null
;  Description: Subroutine to parse a comma delimited string
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
			set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 6026)
     			call ErrorHandler2(c_error_handler_name, "F", Validate, build("Invalid TaskType: ",trim(str,3)),
				"9999", build("Invalid TaskType: ",trim(str,3)), final_reply_out)
      			go to exit_script
			else
				set stat = alterlist(task_types->list, num)
     			set task_types->list[num].id = cnvtreal(str)
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
;  Description:  Get task list
**************************************************************************/
subroutine GetTasks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTasks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	set total = 0
	if(size(task_types->list,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select
		if(size(task_types->list,5) > 0)
			plan ot where expand(idx,1,size(task_types,5),ot.task_type_cd,task_types->list[idx].id)
				and ot.active_ind = 1
				and ot.dcp_forms_ref_id > 0
		else
			plan ot where ot.active_ind = 1
				and ot.dcp_forms_ref_id > 0
		endif
	into "nl:"
		task_type_disp = uar_get_code_display(ot.task_type_cd)
	from order_task ot
	order by task_type_disp, ot.task_description
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->tasks,x)
 
		final_reply_out->tasks[x].id = ot.reference_task_id
		final_reply_out->tasks[x].name = ot.task_description
		final_reply_out->tasks[x].task_activity.id = ot.task_activity_cd
		final_reply_out->tasks[x].task_activity.name = uar_get_code_display(ot.task_activity_cd)
		final_reply_out->tasks[x].task_type.id = ot.task_type_cd
		final_reply_out->tasks[x].task_type.name = uar_get_code_display(ot.task_type_cd)
		final_reply_out->tasks[x].form.id = ot.dcp_forms_ref_id
	foot report
		total = x
	with nocounter, expand = value(exp)
 
	if(total = 0)
		call ErrorHandler2(c_error_handler_name, "Z", "Success.", "No records found.",
		"0000","No records found.", final_reply_out)
		go to exit_script
	endif
 
	; Get Form Name
	select into "nl:"
	from (dummyt d with seq = total)
	, dcp_forms_ref dfr
	plan d
	join dfr where dfr.dcp_forms_ref_id = final_reply_out->tasks[d.seq].form.id
	detail
		final_reply_out->tasks[d.seq].form.name = dfr.description
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetTasks Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
end
go
 
