drop program mp_dcp_get_patient_delta:dba go
create program mp_dcp_get_patient_delta:dba
 
prompt "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
with  OUTDEV , JSON_ARGS
 
/*
record listrequest
(
	1 patient_list_id = f8
	1 patient_id = f8
	1 arguments[*]
		2 argument_name = vc
		2 argument_value = vc
		2 parent_entity_name = vc
		2 parent_entity_id = f8
		2 child_arguments[*]
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
	1 delta_identifier = i4 -- used to distinguish between script calls
	1 pos_cd = f8
)
*/

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
free record reply
record reply
(
	1 patients [*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
   1 patients_del[*]
		2 person_id = f8
		2 disqualify_argument[*]
			3 disqualify_argument = vc
	1 delta_identifier = i4
%i cclsource:status_block.inc
)
 
free record getlistrequest
record getlistrequest
(
	1 patients[*]
	  2 person_id = f8
	1 arguments[*]
		2 argument_name = vc
		2 argument_value = vc
		2 parent_entity_id = f8
		2 parent_entity_name = vc
		2 child_arguments[*]
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
	1 search_indicator = i2
    1 load_demographics = i2
    1 pos_cd = f8
)
 
free record getlistreply
record getlistreply
(
	1 patients[*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
	1 patients_del[*]
		2 person_id = f8
		2 disqualify_argument[*]
			3 disqualify_argument = vc
%i cclsource:status_block.inc
)

 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_get_patient_delta", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare RetrieveStaticPatientList(NULL) = NULL
declare CopyArguments(NULL) = NULL
declare GetPatientDelta(NULL) = NULL
declare RetrievePatientDemographics(NULL) = NULL
declare replyFailure(target = vc) = NULL
declare CnvtCCLRec(NULL) = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare mrn_meaning = f8 with constant(uar_get_code_by( "MEANING", 4, "MRN")), public
declare fail_operation = vc with noconstant(""), private
declare failed = i2 with NOCONSTANT(0), private
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; Execution
**************************************************************/
set reply->status_data->status = "Z"
set reply->delta_identifier = listrequest->delta_identifier

if (listrequest->patient_list_id > 0.0 or listrequest->patient_id > 0.0)
	if(listrequest->patient_list_id > 0.0)
		call RetrieveStaticPatientList(NULL)
		set getlistrequest->load_demographics = 1
	else
		set stat = alterlist(getlistrequest->patients,1)
		set getlistrequest->patients[1].person_id = listrequest->patient_id
		set getlistrequest->load_demographics = 0
	endif
	
	call CopyArguments(NULL)
 
	set getlistrequest->search_indicator = 2
	set getlistrequest->pos_cd = listrequest->pos_cd
	execute mp_dcp_get_patient_list with replace("LISTREQUEST", "GETLISTREQUEST")
 
	if(getlistreply->status_data.status = "F")
		set stat = moverec(getlistreply->status_data,reply->status_data)
		go to exit_script
	endif
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "mp_dcp_get_patient_list"
       call replyFailure("")
    endif
 
endif
 
go to exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
subroutine RetrieveStaticPatientList(NULL)
	call log_message("Begin RetrieveStaticPatientList()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare count = i4 with noconstant(0), private
 
   select into "nl:"
   from dcp_mp_pl_custom_entry pce
   where pce.dcp_mp_patient_list_id = listrequest->patient_list_id
   order by pce.person_id
   head report
      count = 0
   head pce.person_id
      count = count + 1
 
		if (mod(count, 10) = 1)
			stat = alterlist(getlistrequest->patients,count+9)
		endif
		getlistrequest->patients[count].person_id = pce.person_id

   foot report
		stat = alterlist(getlistrequest->patients, count)
   with nocounter
 
   set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveStaticPatientList"
       call replyFailure("SELECT")
    endif
 
   call log_message(build2("Exit RetrieveStaticPatientList(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrieveStaticPatientList found ", count), LOG_LEVEL_DEBUG)
end
 
subroutine CopyArguments(NULL)
	call log_message("Begin CopyArguments()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
   ;manually copy values
	set argIndex = 0
	set argSize = size(listrequest->arguments,5)
	set stat = alterlist(getlistrequest->arguments, argSize)
	for(argIndex = 1 to argSize)
		set getlistrequest->arguments[argIndex].argument_name = listrequest->arguments[argIndex].argument_name
		set getlistrequest->arguments[argIndex].argument_value = listrequest->arguments[argIndex].argument_value
		set getlistrequest->arguments[argIndex].parent_entity_id = listrequest->arguments[argIndex].parent_entity_id
		set getlistrequest->arguments[argIndex].parent_entity_name = listrequest->arguments[argIndex].parent_entity_name
		set subArgSize = size(listrequest->arguments[argIndex].child_arguments,5)
		set stat = alterlist(getlistrequest->arguments[argIndex].child_arguments, subArgSize)
		set subArgIndex = 0
		for(subArgIndex = 1 to subArgSize)
		 set getlistrequest->arguments[argIndex].child_arguments[subArgIndex].argument_value \
			= listrequest->arguments[argIndex].child_arguments[subArgIndex].argument_value
		 set getlistrequest->arguments[argIndex].child_arguments[subArgIndex].parent_entity_id \
			= listrequest->arguments[argIndex].child_arguments[subArgIndex].parent_entity_id
		 set getlistrequest->arguments[argIndex].child_arguments[subArgIndex].parent_entity_name \
			= listrequest->arguments[argIndex].child_arguments[subArgIndex].parent_entity_name
		endfor
 
	endfor
 
	call log_message(build2("Exit CopyArguments(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
 
     call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call CnvtCCLRec(null)
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
subroutine CnvtCCLRec(null)
     call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     declare strJSON = vc
 
     set strJSON = cnvtrectojson(reply)
     set _Memory_Reply_String = strJSON
 
     call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
 
/******************************************************************************/
/*      Exit Script                                                           */
/******************************************************************************/
#exit_script
 
;call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif
 
end go
 
 
