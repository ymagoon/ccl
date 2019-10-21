drop program mp_dcp_upd_patient_list:dba go
create program mp_dcp_upd_patient_list:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
WITH  OUTDEV , JSON_ARGS
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record listrequest
(
     1 patient_list_id = f8
     1 description = vc
     1 name = vc
     1 owner_prsnl_id = f8
     1 default_change_flag = i2
     1 default_list_id = f8
     1 rename_ind = i2
     1 delete_ind = i2
     1 proxy_ind = i2
     1 column_prefs_ind = i2
     1 default_sort_ind = i2
     1 default_sort_by = vc
     1 proxies[*]
     	2 prsnl_id = f8
     	2 prsnl_group_id = f8
     	2 end_date = vc
     1 arguments[*]
     	2 argument_name = vc
     	2 argument_value = vc
     	2 sequence = i2
)
*/
 
call echorecord(listrequest)
 
record reply
(
	1  patient_list_id  =  f8
%i cclsource:status_block.inc
)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_upd_patient_list", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare replyFailure(failMessage = vc) = NULL
declare CnvtCCLRec(NULL) = NULL
 
/**************************************************************
; DECLARED VARIABLES
**************************************************************/
declare g_proxies_to_add = i4 with public, noconstant(0)
if(validate(listrequest->proxies) > 0)
	set g_proxies_to_add = size(listrequest->proxies, 5)
endif
 
declare x = i4 with public, noconstant(0)
declare y = i4 with public, noconstant(0)
declare cur_updt_cnt = i4 with public, noconstant(0)
declare tmp_patient_list_id = f8 with public, noconstant(0.0)
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************/
 
set reply->status_data->status = "F"
 
/******************************************************************************
 *     Insert/Update into DCP_MP_PATIENT_LIST table                              *
 ******************************************************************************/
 
 if(validate(listrequest->patient_list_id) = 0)
 
 	call replyFailure("patient list id not set","RECORD")
 
 endif
 
;Just deleting a list
if (validate(listrequest->delete_ind) = 1)
	delete from dcp_pl_reltn r
		where r.dcp_mp_patient_list_id = listrequest->patient_list_id
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_reltn delete","DELETE")
	endif
 
	delete from dcp_pl_argument pla
		where pla.dcp_mp_patient_list_id = listrequest->patient_list_id
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument delete","DELETE")
	endif
 
	delete from dcp_mp_pl_custom_entry pce
	  where pce.dcp_mp_patient_list_id = listrequest->patient_list_id
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_mp_pl_custom_entry","DELETE")
	endif
	
	update into dcp_mp_pl_comm c
	set c.list_id = 0.0
	where c.list_id = listrequest->patient_list_id
	
	if(ERRCODE != 0)
       call replyFailure("dcp_mp_pl_comm","UPDATE")
	endif
 
	delete from dcp_mp_patient_list pl
		where pl.dcp_mp_patient_list_id = listrequest->patient_list_id
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_mp_patient_list del","DELETE")
	endif
 
	go to exit_script
 
;Just renaming a list
elseif (validate(listrequest->rename_ind) = 1)
 
	if(validate(listrequest->name) = 0)
		call replyFailure("Missing list name","RECORD")
	endif
 
	update into dcp_mp_patient_list pl set
		pl.name						= listrequest->name,
		pl.updt_applctx             = reqinfo->updt_applctx,
    	pl.updt_cnt                 = pl.updt_cnt + 1,
    	pl.updt_dt_tm               = cnvtdatetime(curdate,curtime3),
    	pl.updt_id                  = reqinfo->updt_id,
    	pl.updt_task                = reqinfo->updt_task
	where pl.dcp_mp_patient_list_id = listrequest->patient_list_id
  	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_mp_patient_list upd","UPDATE")
	endif
 
	go to exit_script
;adding default sort parameter
;default_sort_by: 1-Last Name, 2-Rank, 3-Qualified Date
elseif (validate(listrequest->default_sort_ind) = 1)
 
	if(validate(listrequest->default_sort_by) = 0)
		call replyFailure("default sort missing","RECORD")
	endif
 
	delete from dcp_pl_argument pla
	where
		pla.dcp_mp_patient_list_id	= listrequest->patient_list_id and
    	pla.argument_name			= "SORTDEFAULT"
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument delete","DELETE")
	endif
 
    insert into dcp_pl_argument pla
	set
		pla.argument_id             = seq(DCP_PATIENT_LIST_SEQ, nextval),
		pla.argument_name			= "SORTDEFAULT",
		pla.argument_value			= listrequest->default_sort_by,
		pla.dcp_mp_patient_list_id	= listrequest->patient_list_id,
		pla.updt_applctx            = reqinfo->updt_applctx,
		pla.updt_cnt                = 0,
      	pla.updt_dt_tm              = cnvtdatetime(curdate,curtime3),
      	pla.updt_id                 = reqinfo->updt_id,
      	pla.updt_task               = reqinfo->updt_task
    with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument insert","INSERT")
	endif
 
 	go to exit_script
;updating column prefs
elseif(validate(listrequest->column_prefs_ind) = 1)
	delete from dcp_pl_argument pla
	where
		pla.dcp_mp_patient_list_id	= listrequest->patient_list_id and
    	pla.argument_name			= "COLUMNPREFS"
	with nocounter
 
 
	if(validate(listrequest->arguments) != 0)
		for(y = 1 to size(listrequest->arguments, 5))
 
			if(validate(listrequest->arguments[y].argument_name) = 0 or
				validate(listrequest->arguments[y].argument_value) = 0 or
				validate(listrequest->arguments[y].sequence) = 0)
 
				call replyFailure("col prefs not defined","RECORD")
 
			else
 
				insert into dcp_pl_argument pla set
					pla.argument_id					= cnvtreal(seq(DCP_PATIENT_LIST_SEQ, nextval)),
					pla.dcp_mp_patient_list_id		= listrequest->patient_list_id,
					pla.argument_name				= listrequest->arguments[y].argument_name,
					pla.argument_value				= listrequest->arguments[y].argument_value,
					pla.sequence					= listrequest->arguments[y].sequence
				with nocounter
			endif
		endfor
	endif
;updating proxy information
elseif(validate(listrequest->proxy_ind) = 1)
	delete from dcp_pl_reltn r
		where r.dcp_mp_patient_list_id = listrequest->patient_list_id
	with nocounter
	declare maintain_var = f8 with constant(uar_get_code_by("MEANING",27380,"MAINTAIN"))
 
	for (x = 1 to g_proxies_to_add)
		if(validate(listrequest->proxies[x].prsnl_id) = 0 or
				validate(listrequest->proxies[x].prsnl_group_id) = 0 or
				validate(listrequest->proxies[x].end_date) = 0)
 
				call replyFailure("proxies not defined","RECORD")
 
		else
 
			insert into dcp_pl_reltn plr set
				plr.reltn_id					= seq(DCP_PATIENT_LIST_SEQ, nextval),
				plr.dcp_mp_patient_list_id		= listrequest->patient_list_id,
				plr.prsnl_id					= listrequest->proxies[x]->prsnl_id,
				plr.prsnl_group_id				= listrequest->proxies[x]->prsnl_group_id,
				plr.list_access_cd				= maintain_var,
				plr.beg_effective_dt_tm			= cnvtdatetime(curdate,curtime3),
				plr.end_effective_dt_tm			= CNVTDATETIME(CNVTDATE(listrequest->proxies[x]->end_date), 235959),
				plr.updt_applctx				= reqinfo->updt_applctx,
				plr.updt_cnt					= 0,
				plr.updt_dt_tm					= cnvtdatetime(curdate,curtime3),
				plr.updt_id						= reqinfo->updt_id,
				plr.updt_task					= reqinfo->updt_task
			with nocounter
 
		endif
 
		if(ERRCODE != 0)
			call replyFailure("dcp_pl_reltn insert","INSERT")
		endif
	endfor
 
 
endif
 
; If changing default list to load, clear out arguments for all user's lists
; default_list_id: -1=no default, 0=updated list is default, id=change default to existing list
if (validate(listrequest->default_change_flag) = 1)
 
	if(validate(listrequest->default_list_id) = 0 or
		validate(listrequest->owner_prsnl_id) = 0)
 
		call replyFailure("default list not set","RECORD")
 
	endif
 
    delete from dcp_pl_argument pla
	where
		pla.argument_name			= "LISTDEFAULT" and
		pla.parent_entity_id = listrequest->owner_prsnl_id and
    		pla.parent_entity_name = "PRSNL"
 
	with nocounter
 
	if(ERRCODE != 0)
       call replyFailure("dcp_pl_argument delete","DELETE")
	endif
 
    if(listrequest->default_list_id >= 0)
	    if(listrequest->default_list_id = 0)
	    	set listrequest->default_list_id = tmp_patient_list_id
	    endif
 
		call echo(listrequest->default_list_id)
	    insert into dcp_pl_argument pla
		set
			pla.argument_id             = seq(DCP_PATIENT_LIST_SEQ, nextval),
			pla.argument_name			= "LISTDEFAULT",;ARGNAME_DEFAULT,
			pla.argument_value			= "1",
			pla.parent_entity_name 		= "PRSNL",
			pla.parent_entity_id 		= listrequest->owner_prsnl_id,
			pla.dcp_mp_patient_list_id	= listrequest->default_list_id,
			pla.updt_applctx            = reqinfo->updt_applctx,
			pla.updt_cnt                = 0,
	      	pla.updt_dt_tm              = cnvtdatetime(curdate,curtime3),
	      	pla.updt_id                 = reqinfo->updt_id,
	      	pla.updt_task               = reqinfo->updt_task
	    with nocounter
 
		if(ERRCODE != 0)
			call replyFailure("dcp_pl_argument insert","INSERT")
		endif
	endif
endif
 
/******************************************************************************/
/*  Return the patient_list_id in the reply                                   */
/******************************************************************************/
 
set reply->patient_list_id = tmp_patient_list_id
 
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
 
end go
 
 
 
