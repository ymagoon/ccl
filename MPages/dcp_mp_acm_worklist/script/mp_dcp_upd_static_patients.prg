drop program mp_dcp_upd_static_patients:dba go
create program mp_dcp_upd_static_patients:dba
 
prompt "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
with  OUTDEV , JSON_ARGS
 
/*
record patient_request
(
     1 patient_list_id = f8
     1 patient_list_name = vc
     1 owner_prsnl_id = f8
     1 search_arguments[*]
         2 argument_name = vc
         2 argument_value = vc
         2 parent_entity_id = f8
         2 parent_entity_name = vc
     1 patients[*]
         2 person_id = f8
         2 encntr_id = f8
         2 prsnl_group_id = f8
         2 rank = f8
         2 action_desc = vc
     1 clear_arg_ind = i2
     1 clear_pat_ind = i2
     1 return_arg_ind = i2
)*/

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
call echorecord(patient_request)
 
record reply
(
	1 patient_list_id = f8
	1 patients[*]
		2 patient_id = f8
	1 arguments[*]
		3 argument_name = vc
		3 argument_value = vc
		3 parent_entity_name = vc
		3 parent_entity_id = f8
%i cclsource:status_block.inc
)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_upd_static_patients", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare replyFailure(failMessage = vc) = NULL
declare CnvtCCLRec(NULL) = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare tmp_patient_list_id = f8 with noconstant(0.0)
declare tmp_patient_id = f8 with public, noconstant(0.0)
declare g_patient_count = i4 with public,noconstant(0)
declare cnt = i4 with public, noconstant(0)
declare g_argument_to_add = i4 with public,noconstant(size(patient_request->search_arguments,5))
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; Execution
**************************************************************/
 
set reply->status_data->status = "F"
set tmp_patient_list_id = patient_request->patient_list_id
set ERRCODE = ERROR(ERRMSG,0)
 
if(tmp_patient_list_id <= 0.0)
 
	select into "nl:"
	    nextseqnum = seq(DCP_PATIENT_LIST_SEQ, nextval)
	from dual
	detail
	    tmp_patient_list_id = cnvtreal(nextseqnum)
	with nocounter

	set ERRCODE=error(ERRMSG, 0)
	
	if(ERRCODE != 0)
       call replyFailure("failure on select sequence number","SELECT")
    endif
 
	;**** Insert into DCP_MP_PATIENT_LIST table ****
	insert into dcp_mp_patient_list pl
	set
	    pl.dcp_mp_patient_list_id      = tmp_patient_list_id,
	    ;pl.description                 = substring(1,99,listrequest->description),
	    pl.name                        = patient_request->patient_list_name,
	    pl.owner_prsnl_id              = patient_request->owner_prsnl_id,
	    pl.default_list_ind			   = 1,
	    pl.updt_applctx                = reqinfo->updt_applctx,
	    pl.updt_cnt                    = 0,
	    pl.updt_dt_tm                  = cnvtdatetime(curdate,curtime3),
	    pl.updt_id                     = reqinfo->updt_id,
	    pl.updt_task                   = reqinfo->updt_task
 
  	with nocounter
	
	set ERRCODE=error(ERRMSG, 0)
	
	if(ERRCODE != 0)
       call replyFailure("dcp_mp_patient_list insrt","INSERT")
    endif
 
endif
 
if(patient_request->clear_arg_ind = 1)
		;**** Clear out existing list search arguments ****
	delete from
		dcp_pl_argument pla
	where
		pla.dcp_mp_patient_list_id = tmp_patient_list_id and
		pla.argument_name not in ("LISTDEFAULT","COLUMNPREFS","SORTDEFAULT")
	with nocounter
	
	set ERRCODE=error(ERRMSG, 0)

	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument del","DELETE")
    endif
endif

if(patient_request->clear_pat_ind = 1)
	;**** Clear out existing patients ****
	delete from
		DCP_MP_PL_CUSTOM_ENTRY plce
	where
		plce.dcp_mp_patient_list_id = tmp_patient_list_id
	with nocounter
	
	set ERRCODE=error(ERRMSG, 0)
	
	if(ERRCODE != 0)
       call replyFailure("DCP_MP_PL_CUSTOM_ENTRY del","DELETE")
    endif	
endif
 
;**** Insert into DCP_PL_ARGUMENT table ****
if(g_argument_to_add > 0)
	insert into
		dcp_pl_argument pla,
		(dummyt d with seq = value(g_argument_to_add))
	set
		pla.argument_id                = cnvtreal(seq(DCP_PATIENT_LIST_SEQ, nextval)),
		pla.argument_name              = patient_request->search_arguments[d.seq].argument_name,
		pla.argument_value             = patient_request->search_arguments[d.seq].argument_value,
		pla.parent_entity_id           = patient_request->search_arguments[d.seq].parent_entity_id,
		pla.parent_entity_name         = patient_request->search_arguments[d.seq].parent_entity_name,
		pla.patient_list_id            = 0,
		pla.dcp_mp_patient_list_id     = tmp_patient_list_id,
		pla.sequence                   = 0,
		pla.updt_applctx               = reqinfo->updt_applctx,
		pla.updt_cnt                   = 0,
		pla.updt_dt_tm                 = cnvtdatetime(curdate,curtime3),
		pla.updt_id                    = reqinfo->updt_id,
		pla.updt_task                  = reqinfo->updt_task
	plan d
	join pla
	with nocounter
	
	set ERRCODE=error(ERRMSG, 0)
	
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument insrt","INSERT")
    endif
endif

set g_patient_count = size(patient_request->patients,5)
 
if (g_patient_count > 0)
   ;set stat = alterlist(reply->patients,g_patient_count)
   insert into  
   		DCP_MP_PL_CUSTOM_ENTRY plce,
   		(dummyt d with seq = value(g_patient_count)) 
   
   		set
            plce.dcp_mp_pl_custom_entry_id  = cnvtreal(seq(DCP_PATIENT_LIST_SEQ,nextval)),
            plce.dcp_mp_patient_list_id     = tmp_patient_list_id,
            plce.encntr_id                  = 0,
            plce.person_id                  = patient_request->patients[d.seq].person_id,
            plce.prsnl_group_id             = 0,
            plce.last_action_dt_tm          = cnvtdatetime(curdate,curtime3),
            plce.last_action_desc           = "",
            plce.person_priority_nbr        = 0,
            plce.updt_cnt                   = 0,
            plce.updt_dt_tm                 = cnvtdatetime(curdate,curtime3),
            plce.updt_id                    = reqinfo->updt_id,
            plce.updt_task                  = reqinfo->updt_task,
            plce.updt_applctx               = reqinfo->updt_applctx
    plan d
    	where patient_request->patients[d.seq].person_id > 0
    join plce
    	with nocounter
 
 		set ERRCODE=error(ERRMSG, 0)
 
		if(ERRCODE != 0)
		   call replyFailure("DCP_MP_PL_CUSTOM_ENTRY insrt","INSERT")
		endif
 
   if (curqual = 0)
     	set failed = 1
     	go to exit_script
  	endif 
endif

set reply->patient_list_id = tmp_patient_list_id
if(patient_request->return_arg_ind = 1)
	select into "nl:" 
	from 
		dcp_pl_argument pla
	where 
		pla.dcp_mp_patient_list_id = tmp_patient_list_id
	order by
	   	pla.argument_id
	head report
		cnt = 0
	detail
		cnt = cnt + 1
		if(mod(cnt,10) = 1)
			stat = alterlist(reply->arguments,cnt+9)
		endif
		
		reply->arguments[cnt].argument_name = pla.argument_name
		reply->arguments[cnt].argument_value = pla.argument_value
		reply->arguments[cnt].parent_entity_name = pla.parent_entity_name
		reply->arguments[cnt].parent_entity_id = pla.parent_entity_id
	foot report
		stat = alterlist(reply->arguments,cnt)
	with nocounter
endif

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/

subroutine replyFailure(failMessage,targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
	 set failed = 1
	 
	 call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = failMessage
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
  if(failed = 1)
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
 
end go
 
 
