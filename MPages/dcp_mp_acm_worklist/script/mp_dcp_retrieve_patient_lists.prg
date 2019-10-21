drop program mp_dcp_retrieve_patient_lists:dba go
create program mp_dcp_retrieve_patient_lists:dba
 
;prompt
;	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
;with OUTDEV
 
 
/**************************************************************
; DECLARED RECORDS
**************************************************************/
/*
free record request
record request
(
   1 owner_prsnl_id = f8
)
*/
 
record reply
(
	1 patient_lists[*]
		2 patient_list_id = f8
		2 patient_list_name = vc
		2 owner_id = f8
		2 arguments[*]
			3 argument_name = vc
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
		2 filters[*]
			3 argument_name = vc
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
		2 proxies[*]
			3 prsnl_id = f8
			3 prsnl_group_id = f8
			3 prsnl_name = vc
			3 prsnl_group_name = vc
			3 list_access_cd = f8
			3 beg_effective_dt_tm = dq8
			3 end_effective_dt_tm = dq8
%i cclsource:status_block.inc
)
 
free record arguments
record arguments
(
	1 patient_lists[*]
		2 patient_list_id = f8
		2 arguments[*]
			3 argument_name = vc
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
		2 proxies[*]
			3 prsnl_id = f8
			3 prsnl_group_id = f8
			3 prsnl_name = vc
			3 prsnl_group_name = vc
			3 list_access_cd = f8
			3 beg_effective_dt_tm = dq8
			3 end_effective_dt_tm = dq8
)
 
call echorecord(request)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_retrieve_patient_lists", LOG_LEVEL_DEBUG)
 
/**************************************************************
;  DECLARED SUBROUTINES
**************************************************************/
declare RetrievePatientList(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CleanUpListArguments(NULL) = NULL

/**************************************************************
 ; DECLARED VARIABLES
**************************************************************/
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; Execution
**************************************************************/
set reply->status_data->status = "Z"
 
if (request->owner_prsnl_id > 0.0)
	call RetrievePatientList(NULL)
endif
 
go to exit_script
 
/**************************************************************
; DEFINED SUBROUTINES
**************************************************************/
subroutine RetrievePatientList(NULL)
	call log_message("Begin RetrievePatientList()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare list_cnt = i4 with noconstant(0)
    declare arg_cnt = i4 with noconstant(0)
    declare proxy_cnt = i4 with noconstant(0)

	;get user lists
   	select into "nl:"
	from
		dcp_mp_patient_list pl,
		dcp_pl_argument pa,
		dcp_pl_reltn pr,
		prsnl p,
		prsnl_group pg
	plan pl where
		pl.owner_prsnl_id = request->owner_prsnl_id
	join pa where
		pa.dcp_mp_patient_list_id = outerjoin(pl.dcp_mp_patient_list_id)
	join pr where
		pr.dcp_mp_patient_list_id = outerjoin(pl.dcp_mp_patient_list_id) and
		pr.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3)) and
		pr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
	join p where
		p.person_id = outerjoin(pr.prsnl_id)
	join pg where
		pg.prsnl_group_id = outerjoin(pr.prsnl_group_id)
	order by pl.dcp_mp_patient_list_id, pa.argument_id, pr.reltn_id
	head report
		list_cnt = 0
	head pl.dcp_mp_patient_list_id
		arg_cnt = 0
		list_cnt = list_cnt + 1
		if (mod(list_cnt, 10) = 1)
			stat = alterlist(reply->patient_lists,list_cnt+9)
		endif
		reply->patient_lists[list_cnt].patient_list_id = pl.dcp_mp_patient_list_id
		reply->patient_lists[list_cnt].patient_list_name = pl.name
		reply->patient_lists[list_cnt].owner_id = pl.owner_prsnl_id
 
 
	head pa.argument_id
		proxy_cnt = 0
 
		if (pa.argument_id > 0.0)
			arg_cnt = arg_cnt + 1
			if (mod(arg_cnt, 10) = 1)
				stat = alterlist(reply->patient_lists[list_cnt]->arguments,arg_cnt+9)
			endif
			
			reply->patient_lists[list_cnt]->arguments[arg_cnt].argument_name = pa.argument_name
			reply->patient_lists[list_cnt]->arguments[arg_cnt].argument_value = pa.argument_value
			reply->patient_lists[list_cnt]->arguments[arg_cnt].parent_entity_name = pa.parent_entity_name
			reply->patient_lists[list_cnt]->arguments[arg_cnt].parent_entity_id = pa.parent_entity_id
		endif
 
	head pr.reltn_id
		if (pr.dcp_mp_patient_list_id > 0.0)
			proxy_cnt = proxy_cnt + 1
			if (mod(proxy_cnt, 10) = 1)
				stat = alterlist(reply->patient_lists[list_cnt]->proxies,proxy_cnt+9)
			endif
			
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_id = pr.prsnl_id
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_group_id = pr.prsnl_group_id
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_name = p.name_full_formatted
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_group_name = pg.prsnl_group_name
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].list_access_cd = pr.list_access_cd
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].beg_effective_dt_tm = pr.beg_effective_dt_tm
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].end_effective_dt_tm = pr.end_effective_dt_tm
		endif
 
	foot pl.dcp_mp_patient_list_id
		
		stat = alterlist(reply->patient_lists[list_cnt]->arguments, arg_cnt)
		stat = alterlist(reply->patient_lists[list_cnt]->proxies, proxy_cnt)
	foot report
		stat = alterlist(reply->patient_lists, list_cnt)
	with nocounter

	;get lists proxied to user
	select into "nl:"
	from
		 dcp_mp_patient_list pl,
		 dcp_pl_reltn pr,
		 dcp_pl_argument pa,
		 person p
	plan pr where
		(pr.prsnl_id = request->owner_prsnl_id or
		 (pr.updt_id != request->owner_prsnl_id and pr.prsnl_group_id > 0 and 
		 	request->owner_prsnl_id in
		 	(select pgr.person_id
	    	 from prsnl_group_reltn pgr
	    	 where pgr.prsnl_group_id = pr.prsnl_group_id and
		 	 pgr.active_ind = 1 and
		 	 pgr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		 	 pgr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)))) and
		pr.dcp_mp_patient_list_id > 0 and	
		pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) and
		pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	join pl where
		pl.dcp_mp_patient_list_id = pr.dcp_mp_patient_list_id and
		(pl.owner_prsnl_id != request->owner_prsnl_id) ;Don't count it if the user is the owner as we would have gotten it above.
	join pa where
		pa.dcp_mp_patient_list_id = outerjoin(pl.dcp_mp_patient_list_id)
	join p where
		p.person_id = pl.owner_prsnl_id
	order by pl.dcp_mp_patient_list_id, pa.argument_id, pr.reltn_id
	head report
		stat = alterlist(reply->patient_lists,list_cnt+9)
	head pl.dcp_mp_patient_list_id
		arg_cnt = 0
		list_cnt = list_cnt + 1
		if (mod(list_cnt, 10) = 1)
			stat = alterlist(reply->patient_lists,list_cnt+9)
		endif
 
		reply->patient_lists[list_cnt].patient_list_id = pl.dcp_mp_patient_list_id
		reply->patient_lists[list_cnt].patient_list_name =
			concat(trim(pl.name)," (",substring(1,1,p.name_first),". ",trim(p.name_last),")")
		reply->patient_lists[list_cnt].owner_id = pl.owner_prsnl_id
 
	head pa.argument_id
		proxy_cnt = 0
 
		if (pa.argument_id > 0.0)
			arg_cnt = arg_cnt + 1
			if (mod(arg_cnt, 10) = 1)
				stat = alterlist(reply->patient_lists[list_cnt]->arguments,arg_cnt+9)
			endif
 			
			reply->patient_lists[list_cnt]->arguments[arg_cnt].argument_name = pa.argument_name
			reply->patient_lists[list_cnt]->arguments[arg_cnt].argument_value = pa.argument_value
			reply->patient_lists[list_cnt]->arguments[arg_cnt].parent_entity_name = pa.parent_entity_name
			reply->patient_lists[list_cnt]->arguments[arg_cnt].parent_entity_id = pa.parent_entity_id
		endif
 
	head pr.reltn_id
		if (pr.dcp_mp_patient_list_id > 0.0)
			proxy_cnt = proxy_cnt + 1
			if (mod(proxy_cnt, 10) = 1)
				stat = alterlist(reply->patient_lists[list_cnt]->proxies,proxy_cnt+9)
			endif
			
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_id = pr.prsnl_id
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].prsnl_group_id = pr.prsnl_group_id
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].list_access_cd = pr.list_access_cd
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].beg_effective_dt_tm = pr.beg_effective_dt_tm
			reply->patient_lists[list_cnt]->proxies[proxy_cnt].end_effective_dt_tm = pr.end_effective_dt_tm
		endif
 
	foot pl.dcp_mp_patient_list_id
		stat = alterlist(reply->patient_lists[list_cnt]->arguments, arg_cnt)
		stat = alterlist(reply->patient_lists[list_cnt]->proxies, proxy_cnt)
	foot report
		stat = alterlist(reply->patient_lists, list_cnt)

	with nocounter
 
 	call CleanUpListArguments(NULL)
 	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePatientList"
       call replyFailure("SELECT")
    endif
 
	;call echorecord(arguments)
	call log_message(build2("Exit RetrievePatientList(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrievePatientList found ", arg_cnt), LOG_LEVEL_DEBUG)
 
end

; Remove all the child rows from dcp_pl_argument table when no default is returned by the above queries
; and a row still exists on the table for the current User.
subroutine CleanUpListArguments(NULL)
	call log_message("Begin CleanUpListArguments()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare i = i4 with NOCONSTANT(0), private
	declare j = i4 with NOCONSTANT(0), private
	declare default_exists = i4 with NOCONSTANT(0), private
	
	;Looking for LISTDEFAULT in the retrieved patient lists
	while(i < size(reply->patient_lists, 5) and default_exists = 0)
		set i = i + 1
		set default_exists = locateval(j,1,size(reply->patient_lists[i].arguments, 5),"LISTDEFAULT", reply->patient_lists[i].
		arguments[j].argument_name)  
	endwhile
	
	;If a default list is not found above delete the row with LISTDEFAULT
	if(default_exists = 0)
		delete from dcp_pl_argument pla
		where
		pla.argument_name = "LISTDEFAULT" and
		pla.parent_entity_id = request->owner_prsnl_id and
    	pla.parent_entity_name = "PRSNL" 
		with nocounter
	endif
	
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "CleanUpListArguments"
		call replyFailure("DELETE")
	endif
	
	call log_message(build2("Exit CleanUpListArguments(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
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
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
#exit_script
	free record arguments
	if (failed = 1)
		set reply->status_data->status = "F"
		set reqinfo->commit_ind = 0 ; rollback
	else
		set reqinfo->commit_ind = 1 ; commit
		if (size(reply->patient_lists,5) > 0)
			set reply->status_data->status = "S"
		endif 
	endif

call echorecord(reply)
 
end
go
 
