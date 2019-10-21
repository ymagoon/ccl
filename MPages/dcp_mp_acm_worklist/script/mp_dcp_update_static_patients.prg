drop program mp_dcp_update_static_patients:dba go
create program mp_dcp_update_static_patients:dba
 
prompt "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
with  OUTDEV , JSON_ARGS
 
call echo($JSON_ARGS)
 
record patient_request
(
     1 patient_list_id = f8
     1 patients[*]
         2 person_id = f8           
         2 remove_ind = i2
         2 rank = i4
         2 action_desc = vc
)

call echorecord(patient_request)

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
record reply
(
%i cclsource:status_block.inc
)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_update_static_patients", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare g_patient_count = i4 with public,noconstant(0)
declare cur_updt_cnt = i4 with public, noconstant(0)
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; update into DCP_MP_PL_CUSTOM_ENTRY
**************************************************************/
set reply->status_data->status = "F"
set g_patient_count = size(patient_request->patients,5)
set ERRCODE = ERROR(ERRMSG,0)

;Lock row for update
for ( x = 1 to g_patient_count)		
	select into "nl:"
		plce.dcp_mp_pl_custom_entry_id
	from 
		dcp_mp_pl_custom_entry plce
	where 
		plce.dcp_mp_patient_list_id = patient_request->patient_list_id and
		plce.person_id = patient_request->patients[x]->person_id
	detail
		cur_updt_cnt = plce.updt_cnt
	with nocounter, forupdate(plce)
	if (curqual = 0)
		call echo("Lock row for dcp_mp_pl_custom_entry update failed")
		set failed = 1
		go to exit_script
	endif
	
	if(patient_request->patients[x]->remove_ind = 1)
		;Delete patient row
		delete from 
			dcp_mp_pl_custom_entry plce
		where 
			plce.dcp_mp_patient_list_id = patient_request->patient_list_id and
			plce.person_id = patient_request->patients[x]->person_id
		with nocounter	
		
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "pl_custom_entry sel"
		   call replyFailure("SELECT")
		endif

	else		 	 
		;Update Table
		update into 
			dcp_mp_pl_custom_entry plce 
		set
			plce.person_priority_nbr         = patient_request->patients[x]->rank,
			plce.last_action_desc            = substring(1,99,patient_request->patients[x]->action_desc),
			plce.updt_applctx                = reqinfo->updt_applctx,
			plce.updt_cnt                    = plce.updt_cnt + 1,
			plce.updt_dt_tm                  = cnvtdatetime(curdate,curtime3),
			plce.updt_id                     = reqinfo->updt_id,
			plce.updt_task                   = reqinfo->updt_task		
		where 
			plce.dcp_mp_patient_list_id = patient_request->patient_list_id and
			plce.person_id = patient_request->patients[x]->person_id
		with nocounter
		
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "pl_custom_entry upd"
		   call replyFailure("UPDATE")
		endif

	endif
endfor
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
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
 
     call log_message(build("Exit replyFailure(), Elapsed time in seconds:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end

subroutine CnvtCCLRec(null)
     call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     declare strJSON = vc
 
     set strJSON = cnvtrectojson(reply)
     set _Memory_Reply_String = strJSON
 
     call log_message(build("Exit CnvtCCLRec(), Elapsed time in seconds:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end 
 
/******************************************************************************/
/*      Exit Script                                                           */
/******************************************************************************/
# exit_script
  if (failed = 1)
     set reply->status_data->status = "F"
     set reqinfo->commit_ind = 0 ; rollback
  else
     set reply->status_data->status = "S"
     set reqinfo->commit_ind = 1 ; commit
  endif
 
call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif
call echojson(reply)
 
end
go
 
