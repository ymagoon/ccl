drop program mp_dcp_pl_retrieve_col_data:dba go
create program mp_dcp_pl_retrieve_col_data:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
WITH  OUTDEV , JSON_ARGS
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
/* 
record listrequest
(
	;Patient List Query Parameters
	1 user_id = f8																		(required)
	1 pos_cd = f8																		(required)
	1 patients[*]																		(required)
		2 person_id = f8
	1 load_healthplan_ind = i2
	1 load_visit_status_ind = i2
	1 load_utilization_ind = i2
	1 load_pcps_ind = i2
	1 load_casemgrs_ind = i2
	1 load_conditions_ind = i2
	1 load_comments_ind = i2
	1 load_risks_ind = i2
	1 load_phone_calls_ind = i2
	1 load_mara_ind = i2
	1 condition_args[*]
		2 argument_name = vc
		2 argument_value = vc;name of the condition
		2 parent_entity_id = f8;id of the condition on AC_CLASS_DEF
		2 parent_entity_name = vc
		2 child_arguments[*]
			3 argument_name = vc;name of rule consequents that relate to the condition
			3 argument_value = vc
			3 parent_entity_id = f8;id of the condition on AC_CLASS_DEF
			3 parent_entity_name = vc
	1 case_mgr[*]
		2 case_mgr_cd = f8
	1 pcp[*]
		2 pcp_cd = f8
)
*/
 
free record reply
record reply
(
	1 patients[*]
		2 person_id = f8
		2 risk_value = f8
		2 risk_text = vc
		2 pprs[*]
			3 prsnl_id = f8
			3 prsnl_name = vc
			3 ppr_cd = f8
			3 ppr_cd_meaning = vc
			3 position_cd = f8
			3 email = vc
			3 reltn_group = i4	;0 = no group, 1 = pcp group, 2 = cm group.  add values together if they belong to more than one group
		2 health_plans[*]
			3 plan_id = f8
			3 plan_name = vc
			3 plan_type_cd = f8
			3 plan_type_cd_disp = vc
			3 fin_class_cd = f8
			3 fin_class_cd_disp = vc
		2 encounters[*]
			3 encntr_id = f8
			3 tz = i4
			3 reg_dt_tm = vc
			3 reg_date = dq8
			3 encntr_type_class_cd = f8
			3 encntr_type_class_disp = vc
			3 encntr_type_class_meaning = vc
			3 encntr_type_cd = f8
			3 disch_dt_tm = dq8
			3 encntr_groups[*]
				4 group = i4
		2 conditions[*]
			3 name = vc
		2 registry[*]
			3 name = vc
			3 ac_class_def_id = f8
			3 independent_parent_ind = i2
			3 conditions[*]
				4 name = vc
		2 comments[*]
		    3 comment_id = f8
		    3 comment_text = vc
		    3 comment_type = i4 ;0 = comment, 1 = incomplete todo, 2 = complete todo
		    3 updt_dt_tm = dq8
		    3 updt_id = f8
		    3 updt_name = c40
		2 pending_calls[*]
			3 comm_patient_id = f8
			3 comm_prsnl_name = vc
			3 comm_subject_text = vc
			3 comm_status_dt_tm = dq8
		2 completed_calls[*]
			3 comm_patient_id = f8
			3 comm_prsnl_name = vc
			3 comm_subject_text = vc
			3 comm_status_dt_tm = dq8
	1 encntr_group[*]
		2 encntr_group_label = vc
		2 encntr_group_days = i4
		2 encntr_group = i4 ;1 = inpatient group, 2 = outpatient group, 4 = emergency group.
	1 mara_scores[*]
		2 mara_score_reply  = vc
%i cclsource:status_block.inc
)

free record regCondMapping
record regCondMapping
(
	1 registry[*]
		2 name = vc
		2 ac_class_def_id = f8
		2 parent_class_person_reltn_id = f8
)

free record person_qual
record person_qual
(
	1 data_partition_person_ids[*] = i4
)
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_pl_retrieve_col_data", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare BufferReply(NULL) = NULL
declare RetrieveHealthPlans(NULL) = NULL
declare RetrieveEncounters(NULL) = NULL
declare RetrievePPRs(NULL) = NULL
declare RetrieveRuleConditions(NULL) = NULL
declare RetrieveRegistryConditions(NULL) = NULL
declare RetrieveComments(NULL) = NULL
declare RetrieveRisks(NULL) = NULL
declare RetrieveMaraScore(NULL) = NULL
declare GetMaraScore(start_count = i4, end_count = i4) = NULL
declare CreateHealtheIntentJson(start_count = i4, end_count = i4) = vc
declare UnbufferReply(NULL) = NULL
declare RetrieveEncounterTypeFromBedrock(NULL) = NULL
declare RetrievePhoneCalls(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare person_cnt = i4 with noconstant(0)
declare loop_cnt = i4 with noconstant(0)
declare batch_size = i4 with noconstant(10)
declare new_list_size = i4 with noconstant(0)
declare cur_list_size = i4 with noconstant(0)
declare pcp_size = i4 with noconstant(0)
declare ppr_size = i4 with noconstant(0)
declare cm_size = i4 with noconstant(0)
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
declare lookBackMaxDays = i4 with constant(546)

set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
free record ppr_reltns
record ppr_reltns
(
	1 ppr_reltns[*]
		2 ppr_cd = f8
)
 
/*
free record encntr_types
record encntr_types
(
	1 encntr_types[*]
		2 encntr_type_cd = f8
		2 encntr_group = i4 ;1 = inpatient group, 2 = outpatient group, 4 = emergency group.
)
*/
 
/**************************************************************
; Execution
**************************************************************/
	if(validate(listrequest->patients) = 0)
		call replyFailure("patient structure invalid")		
	endif
	
	if(validate(listrequest->user_id) = 0)
		call replyFailure("user_id not set")		
	endif
	
	if(validate(listrequest->pos_cd) = 0)
		call replyFailure("pos_cd not set")		
	endif
	
	call BufferReply(NULL)
 
	if (validate(listrequest->load_healthplan_ind, 0) > 0)
		call RetrieveHealthPlans(NULL)
	endif
 
	if (validate(listrequest->load_visit_status_ind, 0) > 0 or validate(listrequest->load_utilization_ind, 0) > 0)
		call RetrieveEncounterTypeFromBedrock(NULL)
		call RetrieveEncounters(NULL)
	endif
 
 	if(validate(listrequest->case_mgr) = 1)
		set cm_size = size(listrequest->case_mgr, 5)
	 	set stat = alterlist(ppr_reltns->ppr_reltns,cm_size)
	 	for(x = 1 to cm_size)
	 		set ppr_reltns->ppr_reltns[x].ppr_cd = validate(listrequest->case_mgr[x].case_mgr_cd, 0)
	 	endfor
	endif
 
	set ppr_size = size(ppr_reltns->ppr_reltns, 5)
	
	if(validate(listrequest->pcp) = 1)
		set pcp_size = size(listrequest->pcp,5)
	endif
	
	set stat = alterlist(ppr_reltns->ppr_reltns,ppr_size+pcp_size)
	for(x = 1 to pcp_size)
		set ppr_reltns->ppr_reltns[ppr_size + x].ppr_cd = validate(listrequest->pcp[x].pcp_cd, 0)
	endfor
 
	if (validate(listrequest->load_pcps_ind, 0) > 0 or validate(listrequest->load_casemgrs_ind, 0) > 0)
		call RetrievePPRs(NULL)
	endif
 
	if(validate(listrequest->load_conditions_ind,0) > 0)
		call RetrieveRuleConditions(NULL)
		call RetrieveRegistryConditions(NULL)
	endif
	
	if(validate(listrequest->load_comments_ind,0) > 0)
		call RetrieveComments(NULL)
	endif
	
	if(validate(listrequest->load_risks_ind,0) > 0)
		call RetrieveRisks(NULL)
	endif
 
	if(validate(listrequest->load_phone_calls_ind,0) > 0)
		call RetrievePhoneCalls(NULL)
	endif
 
	if(validate(listrequest->load_mara_ind,0) > 0)
		call RetrieveMaraScore(NULL)
	endif
 
	call UnbufferReply(NULL)
 
	set reply->status_data->status = "S"
 
go to exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/

/**
 * Gets the MARA score from Healthe Intent Registries service and
 * calls a subroutine to update the reply with that.
 * @param: start_count - Start count of the loop for the current batch.
 * @param: end_count - End count of the loop for the current batch.
 */
subroutine GetMaraScore(start_count, end_count)

	call log_message("Begin GetMaraScore()", LOG_LEVEL_DEBUG)
	
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare hi_request_json = vc with noconstant(''), public
	declare PAT_PERSON_ID = f8 with constant(0.0), public
	declare USR_PERSON_ID = f8 with constant(0.0), public
	declare TEMPLATE_VARIABLES = vc with constant(''), public 
	declare mara_score_cnt = i4 with noconstant(0), private

	set hi_request_json = CreateHealtheIntentJson(start_count, end_count)
			
	execute HI_HTTP_PROXY_POST_REQUEST 'MINE','HI_REGISTRIES_PERSON_REGISTRIES_BATCH','RECORD',PAT_PERSON_ID,USR_PERSON_ID,\
	hi_request_json,'application/json',TEMPLATE_VARIABLES  

	set mara_score_cnt = size(reply->mara_scores,5) + 1
	set stat = alterlist(reply->mara_scores,mara_score_cnt)
	set reply->mara_scores[mara_score_cnt].mara_score_reply = memoryProxyReply->HTTPREPLY->BODY
	
	call log_message(build2("Exit GetMaraScore(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

/**
 * Creates the JSON string for the healthe intent service request.
 * @param: start_count - Start count of the loop for the current batch.
 * @param: end_count - End count of the loop for the current batch.
 */
subroutine CreateHealtheIntentJson(start_count, end_count)

	call log_message("Begin CreateHealtheIntentJson()", LOG_LEVEL_DEBUG)
	
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare batch_count = i4 with noconstant(0),private
	declare patient_count = i4 with noconstant(0),private
	
	for(batch_count = start_count to end_count)
	   if(reply->patients[batch_count].person_id > 0)
	       set patient_count = patient_count + 1
	  	   if (mod(patient_count, 100) = 1)
	    	  set stat = alterlist(person_qual->data_partition_person_ids, patient_count+99)
	       endif
	     set person_qual->data_partition_person_ids[batch_count] = CNVTLONG(reply->patients[batch_count].person_id)
	   endif
	endfor
	
	set stat = alterlist(person_qual->data_partition_person_ids, patient_count)
   
   	set hi_request_json = cnvtrectojson(person_qual, 7)
 

	call log_message(build2("Exit CreateHealtheIntentJson(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(hi_request_json)
end

/**
 * Retrieves the MARA score for the list patients passed in.
 */
subroutine RetrieveMaraScore(NULL)
	call log_message("Begin RetrieveMaraScore()", LOG_LEVEL_DEBUG)
	
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare HI_BATCH_SIZE = i4 with constant(100), private ; 100 = max batch size supported by healthe intent
	declare col_load_batch_size = i4 with constant(size(reply->patients,5)), private
	declare num_of_batches = i4 with noconstant(0), private
	declare i = i4 with noconstant(0), private
	declare start_count = i4 with noconstant(0), private
	declare end_count = i4 with noconstant(0), private
	
	if(col_load_batch_size > HI_BATCH_SIZE)
	
		set num_of_batches = ceil(cnvtreal(col_load_batch_size) / HI_BATCH_SIZE)
		
		for(i = 0 to num_of_batches)
			
			set start_count = (i * HI_BATCH_SIZE) + 1 ; 1, 101, 201, ...
			set end_count = (i + 1) * HI_BATCH_SIZE ; 100, 200, 300, ...
			
			; If it is the last batch set the end_count to size of the list.
			if(end_count > col_load_batch_size)
				set end_count = col_load_batch_size
			endif
			
			call GetMaraScore(start_count, end_count)
			
		endfor		
	else
		call GetMaraScore(1, col_load_batch_size)
	endif
	
	call log_message(build2("Exit RetrieveMaraScore(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine RetrieveRisks(NULL)
	call log_message("Begin RetrieveRisks()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare TABLE_EXISTS_WITH_ACCESS = i2 with constant(2), protect
 
	if(CHECKDIC("LH_CNT_READMIT_RISK", "T", 0) = TABLE_EXISTS_WITH_ACCESS
		AND CHECKDIC("LH_CNT_READMIT_WORKLIST", "T", 0) = TABLE_EXISTS_WITH_ACCESS)
 	
	    declare idx = i4 with noconstant(0)
		declare nstart = i4 with noconstant(1)
		declare size = i4 with noconstant(0)
		declare num = i4 with noconstant(0)
	 
	    set size = size(reply->patients, 5)
	 
	    select into "nl:"
	    from
	    	lh_cnt_readmit_worklist lhw,
	    	lh_cnt_readmit_risk lhr
	    plan lhw where
	    	expand(idx,nstart,size,lhw.person_id, reply->patients[idx].person_id) and
	    	lhw.active_ind = 1
	    join lhr where
	    	lhw.lh_cnt_readmit_worklist_id = lhr.lh_cnt_readmit_worklist_id and
	    	lhr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
	        lhr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) and
	        lhr.risk_factor_flag = 5
	    order by
	    	lhr.beg_effective_dt_tm
	    head lhw.person_id
			pos = LOCATEVAL(num, 1, size(reply->patients,5), lhw.person_id, reply->patients[num].person_id)
			if (pos > 0)
				reply->patients[pos].risk_value = lhr.risk_factor_value
				reply->patients[pos].risk_text = lhr.risk_factor_txt
			endif
	 
		with nocounter
	 
	    set ERRCODE = ERROR(ERRMSG,0)
	    if(ERRCODE != 0)
	       set failed = 1
	       set fail_operation = "RetrieveRisks"
	       call replyFailure("SELECT")
	    endif
	    
	else
	
		call log_message("Tables lh_cnt_readmit_risk and lh_cnt_readmit_worklist do not exist.", LOG_LEVEL_DEBUG)
	
	endif
 
	call log_message(build2("Exit RetrieveRisks(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine RetrieveHealthPlans(NULL)
	call log_message("Begin RetrieveHealthPlans()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
	call echo("Loading Health Plans")
 
	declare idx = i4 with noconstant(0)
	declare idx2 = i4 with noconstant(0)
	declare nstart = i4 with noconstant(1)
	declare num = i4 with noconstant(0)
	declare plan_cnt = i4 with noconstant(0)
 
	select into "nl:"
	from (dummyt d1 with seq = value(loop_cnt)),
		 person_plan_reltn phr,
		 health_plan hp
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join phr where
		expand(idx,nstart,nstart+(batch_size-1),phr.person_id, reply->patients[idx].person_id) and
		phr.active_ind = 1 and
		phr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		phr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join hp where
		hp.health_plan_id = phr.health_plan_id and
		hp.active_ind = 1
	order by phr.person_id,phr.priority_seq
	head phr.person_id
	call echo(phr.person_id)
		plan_cnt = 0
	detail
		pos = LOCATEVAL(num, 1, size(reply->patients,5), phr.person_id, reply->patients[num].person_id)
		if (pos > 0)
			call echo(build("RetrieveHealthPlans: Found patient ", phr.person_id, "pos=", pos))
			plan_cnt = plan_cnt + 1
			stat = alterlist (reply->patients[pos]->health_plans, plan_cnt)
 
			reply->patients[pos]->health_plans[plan_cnt].plan_id = hp.health_plan_id
			reply->patients[pos]->health_plans[plan_cnt].plan_name = hp.plan_name
			reply->patients[pos]->health_plans[plan_cnt].plan_type_cd = hp.plan_type_cd
			reply->patients[pos]->health_plans[plan_cnt].plan_type_cd_disp = uar_get_code_display(hp.plan_type_cd)
			reply->patients[pos]->health_plans[plan_cnt].fin_class_cd = hp.financial_class_cd
			reply->patients[pos]->health_plans[plan_cnt].fin_class_cd_disp = uar_get_code_display(hp.financial_class_cd)
		else
			call echo(build("RetrieveHealthPlans: Unable to find patient ", phr.person_id))
		endif
 
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveHealthPlans"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit RetrieveHealthPlans(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrieveHealthPlans found ", plan_cnt), LOG_LEVEL_DEBUG)
end


;This subroutine brings back all encounters because a filter on the front-end expects them
subroutine RetrieveEncounters(NULL)
	call log_message("Begin RetrieveEncounters()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
	call echo("Loading Encounters")
 
	;TO DO - Org Security
	call echorecord(reply)
 
	declare idx = i4 with noconstant(0)
	declare nstart = i4 with noconstant(1)
	declare num = i4 with noconstant(0)
	declare encntr_cnt = i4 with noconstant(0)
	declare group_idx = i4 with noconstant(0)
 
	call echorecord(reply)
	call echorecord(bedrock_prefs)
 
	select into "nl:"
	from encounter e
	where
		expand(idx,nstart,size(reply->patients,5),e.person_id, reply->patients[idx].person_id) and
		e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
        e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) and
		;restrict down to a small date range.  546 days since that is the limit for the bucket?
		((e.reg_dt_tm >= DATETIMEADD(cnvtdatetime(curdate,000000),-lookBackMaxDays) 
		 and e.reg_dt_tm <= cnvtdatetime(curdate,235959)) or
		 ((e.disch_dt_tm >= DATETIMEADD(cnvtdatetime(curdate,000000),-lookBackMaxDays) and
		 e.disch_dt_tm <= cnvtdatetime(curdate,235959)) or e.disch_dt_tm = NULL)) and
		e.active_ind = 1
	order by e.person_id
	head e.person_id
		encntr_cnt = 0
	detail
		pos = LOCATEVAL(num, 1, size(reply->patients,5), e.person_id, reply->patients[num].person_id)
		if (pos > 0)
			encntr_cnt = encntr_cnt + 1
			stat = alterlist (reply->patients[pos]->encounters, encntr_cnt)
			
			; Reset the group_idx
		    group_idx = 0
 
			reply->patients[pos]->encounters[encntr_cnt].encntr_id = e.encntr_id
			reply->patients[pos]->encounters[encntr_cnt].reg_dt_tm =
				trim(format(cnvtdatetimeutc(e.reg_dt_tm, 3),"YYYY-MM-DDTHH:MM:SSZ;3;Q"), 3)
			reply->patients[pos]->encounters[encntr_cnt].reg_date = e.reg_dt_tm
			reply->patients[pos]->encounters[encntr_cnt].encntr_type_class_cd = e.encntr_type_class_cd
			reply->patients[pos]->encounters[encntr_cnt].encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			reply->patients[pos]->encounters[encntr_cnt].encntr_type_class_meaning = uar_get_code_meaning(e.encntr_type_class_cd)
			reply->patients[pos]->encounters[encntr_cnt].encntr_type_cd = e.encntr_type_cd
			reply->patients[pos]->encounters[encntr_cnt].disch_dt_tm = e.disch_dt_tm

			; Loop through all the bedrock encunter groups and add them to the patient encounters if they match the current encounter row
			for(count = 1 to size(bedrock_prefs->encntr_types,5))
				; Check if the current encounter is associated to a group
				if (bedrock_prefs->encntr_types[count].encntr_type_cd = e.encntr_type_cd)
					group_idx = group_idx + 1
					stat = alterlist (reply->patients[pos]->encounters[encntr_cnt].encntr_groups, group_idx)
				       
					; Update the encounter groups array for the patients encounter
					reply->patients[pos]->encounters[encntr_cnt].encntr_groups[group_idx].group = bedrock_prefs->encntr_types[count].encntr_group
				endif
			endfor
		else
			call echo(build("RetrieveEncounters: Unable to find patient ", e.person_id))
		endif
 
	with nocounter, expand = 1
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveEncounters"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit RetrieveEncounters(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrieveEncounters found ", encntr_cnt), LOG_LEVEL_DEBUG)
end
 
subroutine RetrievePPRs(NULL)
	call log_message("Begin RetrievePPRs()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	declare PCPReltn = i4 with constant(1)
	declare CMReltn = i4 with constant(2)
	call echo("Retrieve PPRs")
 
	declare idx = i4 with noconstant(0)
	declare idx2 = i4 with noconstant(0)
	declare nstart = i4 with noconstant(1)
	declare num = i4 with noconstant(0)
	declare ppr_cnt = i4 with noconstant(0)
 
 	;call echorecord(ppr_reltns)
 
 ;TO DO - rewrite this using expand = 1 control option?  or dummyt?
	select into "nl:"
	from person_prsnl_reltn ppr,
		 prsnl p
	plan ppr where
		expand(idx,nstart,size(reply->patients, 5),ppr.person_id, reply->patients[idx].person_id) and
		expand(idx2,nstart,size(ppr_reltns->ppr_reltns, 5),ppr.person_prsnl_r_cd, ppr_reltns->ppr_reltns[idx2].ppr_cd) and
		ppr.active_ind = 1 and
		ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join p where
		p.person_id = ppr.prsnl_person_id
	order by ppr.person_id, ppr.person_prsnl_r_cd, cnvtdatetime(ppr.beg_effective_dt_tm) desc
	head ppr.person_id
		ppr_cnt = 0
		pos = LOCATEVAL(num, 1, size(reply->patients,5), ppr.person_id, reply->patients[num].person_id)
	detail
		if (pos > 0)
			reltn_group = 0
 
			ppr_cnt = ppr_cnt + 1
			stat = alterlist (reply->patients[pos]->pprs, ppr_cnt)
 
			reply->patients[pos]->pprs[ppr_cnt].prsnl_id = p.person_id
			reply->patients[pos]->pprs[ppr_cnt].prsnl_name = p.name_full_formatted
			reply->patients[pos]->pprs[ppr_cnt].ppr_cd = ppr.person_prsnl_r_cd
			reply->patients[pos]->pprs[ppr_cnt].ppr_cd_meaning = uar_get_code_meaning(ppr.person_prsnl_r_cd)
			reply->patients[pos]->pprs[ppr_cnt].position_cd = p.position_cd
			reply->patients[pos]->pprs[ppr_cnt].email = p.email
 
 			pos3 = LOCATEVAL(num, 1, pcp_size, ppr.person_prsnl_r_cd, validate(listrequest->pcp[num].pcp_cd, 0))
 			if(pos3 > 0)
 				reltn_group = reltn_group + PCPReltn
 			endif
 
			pos2 = LOCATEVAL(num, 1, cm_size, ppr.person_prsnl_r_cd, validate(listrequest->case_mgr[num].case_mgr_cd,0))
			if(pos2 > 0)
				reltn_group = reltn_group + CMReltn
			endif
 
			reply->patients[pos]->pprs[ppr_cnt].reltn_group = reltn_group
 
		else
			call echo(build("RetrievePPRs: Unable to find patient ", ppr.person_id))
		endif
 
	with nocounter, expand = 1
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePPRs"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit RetrievePPRs(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrievePPRs found ", ppr_cnt), LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveRegistryConditions(NULL)
	call log_message("Begin RetrieveRegistryConditions()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	declare idx = i4 with noconstant(0)
	declare idx2 = i4 with noconstant(0)
	declare nstart = i4 with noconstant(1)
	declare num = i4 with noconstant(0)
	
	declare registrySize = i4 with noconstant(0)
	declare regCondMappingSize = i4 with noconstant(0)
	declare regPos = i4 with noconstant(0)
	declare regPos2 = i4 with noconstant(0)
 
	select into "nl:" ;distinct a.person_id, a.ac_class_def_id
	from (dummyt d1 with seq = value(loop_cnt)),
		 ac_class_person_reltn a,
		 ac_class_def d
    plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join a where
		expand(idx,nstart,nstart+(batch_size-1),a.person_id , reply->patients[idx].person_id) and
		a.person_id > 0 and
		a.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) and
		a.active_ind = 1
	join d where
		d.ac_class_def_id = a.ac_class_def_id
	order by
		a.parent_class_person_reltn_id, d.class_type_flag ascending
 
	detail
		
		patientPos = LOCATEVAL(num, 1, size(reply->patients,5), a.person_id, reply->patients[num].person_id)
		if(patientPos > 0)
 
			;for registry
			if( a.ac_class_person_reltn_id = a.parent_class_person_reltn_id )
				registrySize = size(reply->patients[patientPos].registry,5)
				if(registrySize <=0)
					registrySize = 0
				endif
				regPos = LOCATEVAL(num,1,registrySize,d.class_display_name,reply->patients[patientPos]->registry[num].name)
				if(regPos <= 0)
					stat1 = alterlist(reply->patients[patientPos].registry, registrySize+1)
					reply->patients[patientpos].registry[registrySize+1].name = d.class_display_name
					reply->patients[patientpos].registry[registrySize+1].ac_class_def_id = a.ac_class_def_id
					reply->patients[patientpos].registry[registrySize+1].independent_parent_ind = a.independent_parent_ind
				endif

				regCondMappingSize = size(regCondMapping->registry,5) + 1
				stat1 = alterlist(regCondMapping->registry, regCondMappingSize)
				regCondMapping->registry[regCondMappingSize].name = d.class_display_name
				regCondMapping->registry[regCondMappingSize].ac_class_def_id = d.ac_class_def_id
				regCondMapping->registry[regCondMappingSize].parent_class_person_reltn_id = a.parent_class_person_reltn_id				
				
			else
				
				;for conditions
				conditionSize = size(reply->patients[patientPos].conditions,5)
				condPos = LOCATEVAL(num, 1, conditionSize, d.class_display_name, reply->patients[patientPos].conditions[num].name)
				if(condPos <= 0)
					stat = alterlist(reply->patients[patientPos].conditions, conditionSize+1)
					reply->patients[patientPos].conditions[conditionSize+1].name = d.class_display_name
				endif
 
				;for registry conditions
				registrySize = size(reply->patients[patientPos].registry,5)
				regCondMappingSize = size(regCondMapping->registry,5)

				num = 0
				regPos = LOCATEVAL(num,1,regCondMappingSize,a.parent_class_person_reltn_id,regCondMapping->registry[num]
					.parent_class_person_reltn_id)

				num = 0
				regPos2 = LOCATEVAL(num,1,registrySize,regCondMapping->registry[regPos].ac_class_def_id,
					reply->patients[patientPos]->registry[num].ac_class_def_id)
	
				if(regPos2 > 0)
				
					regCondSize = size(reply->patients[patientPos].registry[regPos2].conditions,5)
					if(regCondSize <=0)
						regCondSize = 0
					endif
					regCondPos = LOCATEVAL(num,1,regCondSize,d.class_display_name,reply->patients[patientPos].registry[regPos2]
					.conditions[num].name)
					if(regCondPos <= 0)
						stat2 = alterlist(reply->patients[patientPos].registry[regPos2].conditions, regCondSize+1)
						reply->patients[patientpos].registry[regPos2].conditions[regCondSize+1].name = d.class_display_name
					endif
					
				endif
			endif
		endif
 
	with nocounter
	
	call echorecord(reply)
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveRegistryCondition"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit RetrieveRegistryConditions(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrieveRegistryConditions found ", curqual), LOG_LEVEL_DEBUG)
end
 
;This must be run before RetrieveRegistryConditions since it does not look for existing conditions on the reply
subroutine RetrieveRuleConditions(NULL)
	call log_message("Begin RetrieveRuleConditions()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	set consequentsSet = false
	declare hCondition		= i4 with noconstant(0), private
	declare hParam     		= i4 with noconstant(0), private
	declare hValue    		= i4 with noconstant(0), private
	declare iRet      		= i4 with noconstant(0), private
	declare hRule      		= i4 with noconstant(0), private
	declare hitem      	 	= i4 with noconstant(0), private
	declare num 			= i4 with noconstant(0), private
	declare condition_size 	= i4 with noconstant(0), private
	declare condition_count = i4 with noconstant(0), private
	declare consequent_size = i4 with noconstant(0), private
 
	execute srvrtl
 
	set hMsg = uar_SrvSelectMessage(966700)
	set hRequest = uar_SrvCreateRequest(hMsg)
	set hReply = uar_SrvCreateReply(hMsg)
 
	set iRet = uar_SrvSetString(hRequest, "knowledge_base_name", "DWL")
	set iRet = uar_SrvSetString(hRequest, "rule_engine", "Drools")
 
 	if(validate(listrequest->condition_args) = 1)
    	set condition_size = size(listrequest->condition_args, 5)
    else
    	call replyFailure("Incorrect condition structure")
    endif
    call echorecord(listrequest)
    set condition_count = 0
    for( condition_count = 1 to condition_size)
    	if(validate(listrequest->condition_args[condition_count].child_arguments) = 1)
	    	set consequent_size = size(listrequest->condition_args[condition_count].child_arguments,5)
	    	call echo(consequent_size)
	    	if(consequent_size > 0)
	    		set consequentsSet = true
	 
		    	call echo("setting condition")
				set hRule = uar_SrvAddItem(hRequest, nullterm("rules"))
				set iRet = uar_SrvSetString(hRule, "name", build("CONDITION", condition_count))
				set iRet = uar_SrvSetShort(hRule, "operator", 2)
	 
				set consequent_cnt = 0
				for( consequent_cnt = 1 to consequent_size )
					if(validate(listrequest->condition_args[condition_count].child_arguments[consequent_cnt].argument_value) = 1)
						set hCondition = uar_SrvAddItem(hRule, "conditions")
						set iRet = uar_SrvSetString(hCondition, "key", "CONDITION_CONDITION")
						set hParam = uar_SrvAddItem(hCondition, "parameters")
						set iRet = uar_SrvSetString(hParam, "key", "%1")
						set hValue = uar_SrvAddItem(hParam, "values")
						set iRet = uar_SrvSetString(hValue, "value", nullterm(listrequest->condition_args[condition_count]\
							.child_arguments[consequent_cnt].argument_value))
					else
					
						call replyFailure("Incorrect condition structure")
					
					endif
				endfor
	 
	 			if(validate(listrequest->condition_args[condition_count].argument_value) = 1)
					set hConsequent = uar_SrvAddItem(hRule, "consequents")
				    set iRet = uar_SrvSetString(hConsequent, "key", "CONSEQUENT_SIMPLE2")
				    set hParam = uar_SrvAddItem(hConsequent, "parameters")
				    set iRet = uar_SrvSetString(hParam, "key", "%1")
				    set hValue = uar_SrvAddItem(hParam, "values")
				    set iRet = uar_SrvSetString(hValue, "value", nullterm(listrequest->condition_args[condition_count].argument_value))
				else
						call replyFailure("Incorrect condition structure")
				endif
			endif
		else
			call replyFailure("Incorrect condition structure")		
		endif
	endfor
 
	;test if no consequents were found to search
	if(consequentsSet = false)
		call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		return
	endif
 
    ; pass patient list
    set pl_size = size(listrequest->patients, 5)
    set pt_cnt = 0
    for ( pt_cnt = 1 to pl_size)
       call echo("setting patient")
       set hitem = uar_SrvAddItem(hRequest, "axises")
   	   set iRet = uar_SrvSetString(hitem, "name", "PERSON")
   	   call echo(build("status from setting person ", iRet))
       set iRet = uar_SrvSetString(hitem, "value", nullterm(trim(cnvtstring(listrequest->patients[pt_cnt]->person_id))))
       call echo(build("status from setting person val ", iRet))
    endfor
 
    ;executing request
    set stat = uar_SrvExecute(hMsg, hRequest, hReply)
    call echo(build("HRecommendation Server: SRV Perform, Status:", stat))
    if (stat > 0)
        call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		set failed = 1
		set fail_operation = "RetrieveRuleCondition"	
        call replyFailure("")
    endif
 
 
    ;get the status from the server
    set hStatus = uar_SrvGetStruct(hReply, "status_data")
    set status = uar_SrvGetStringPtr(hStatus, "status")
    set statusSize = uar_SrvGetItemCount(hStatus, "subeventstatus")
    set statusCount = 0
    for(statusCount = 0 to statusSize)
      set hSubEvent = uar_SrvGetItem(hStatus, "subeventstatus", statusCount)
 
      set sTargetObjectName = uar_SrvGetStringPtr(hSubEvent, "TargetObjectName")
      set sTargetObjectValue = uar_SrvGetStringPtr(hSubEvent, "TargetObjectValue")
      set sOperationName = uar_SrvGetStringPtr(hSubEvent, "OperationName")
      set sOperationStatus = uar_SrvGetStringPtr(hSubEvent, "OperationStatus")
 
      call echo(status)
      call echo(build("Target Object Name: ", sTargetObjectName))
      call echo(build("Target Object Value: ", sTargetObjectValue))
      call echo(build("Operation Name: ", sOperationName))
      call echo(build("Operation Status: ", sOperationStatus))
    endfor
 
    ;if there is any kind of server failure then we should fail
    if (status = "F")
		call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		set failed = 1
		set fail_operation = "HEALTH EXPERT RETURN"
		call replyFailure("")
 	endif
 
 	;get the number of persons returned from the server
 	set axisesCnt = uar_SrvGetItemCount(hReply, "axises")
 	call echo(build("found axis: ", axisesCnt))
 	set personIterator = 0
 	set consequentIterator = 0
 	for(personIterator = 0 to axisesCnt - 1)
	 	set hPerson = uar_SrvGetItem(hReply, "axises", personIterator)
 
 		;find the patient in the reply
 		set personIdString = uar_SrvGetStringPtr(hPerson, "value")
 		set personId = cnvtreal(personIdString)
 		set pos = LOCATEVAL(num, 1, size(reply->patients,5), personId, reply->patients[num].person_id)
 
 		;set the consequent as the condition name
 		set consequentCnt = uar_SrvGetItemCount(hPerson, "consequents")
 		if(consequentCnt > 0)
 			call echo("found a consequent!")
 			set stat = alterlist (reply->patients[pos].conditions, consequentCnt)
 		endif
 		for(consequentIterator = 0 to consequentCnt - 1)
 			call echo("found a consequent")
 			set hConsequent = uar_SrvGetItem(hPerson, "consequents", consequentIterator)
 
 			set consequentName = uar_SrvGetStringPtr(hConsequent, "name")
		 	set reply->patients[pos].conditions[consequentIterator+1].name = consequentName
 		endfor
 	endfor
	
	call log_message(build2("Exit RetrieveRuleConditions(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine RetrieveComments(NULL)
	call log_message("Begin RetrieveComments()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
	call echo ("Retrieving Comments")
	
	declare idx = i4 with noconstant(0)
	declare nstart = i4 with noconstant(1)
	declare num = i4 with noconstant(0)
	declare patSize = i4 with noconstant(0)
	declare comment_cnt = i4 with noconstant(0)
	declare noteType = i4 with noconstant(0)
	declare COMM_TYPE_CD = f8 with constant(uar_get_code_by("MEANING",14122,"REGWORKLIST"))
	declare TODO_TYPE_CD = f8 with constant(uar_get_code_by("MEANING",14122,"RWLTODO"))
 
	select into "nl:"
	from 
		(dummyt d with seq = value(loop_cnt)), sticky_note sn, prsnl pl, long_text lt
    plan d where
		initarray(nstart,evaluate(d.seq,1,1,nstart+batch_size))
	join sn where
		expand(idx,nstart,nstart+(batch_size-1),sn.parent_entity_id,reply->patients[idx].person_id) and
		sn.parent_entity_name = "PERSON" and
		sn.sticky_note_type_cd in (COMM_TYPE_CD,TODO_TYPE_CD) and
		((NULLIND(sn.beg_effective_dt_tm) = 1 or sn.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)))
	join pl where
		pl.person_id = sn.updt_id
	join lt where
		lt.long_text_id = outerjoin(sn.long_text_id)
	order by
		sn.parent_entity_id, sn.updt_dt_tm desc
	head report
		patSize = size(reply->patients,5)
	head sn.parent_entity_id
		comment_cnt = 0
		pos = LOCATEVAL(num, 1, patSize, sn.parent_entity_id, reply->patients[num].person_id)
    detail
		if(pos > 0)	
			comment_cnt = comment_cnt + 1
			if(mod(comment_cnt,10) = 1)
				stat = alterlist(reply->patients[pos]->comments, comment_cnt + 9)
			endif
					
			noteType = 0 ;regular RWL comment
			if(sn.sticky_note_type_cd = TODO_TYPE_CD)
				noteType = 1 ;incomplete todo					
				if(sn.end_effective_dt_tm <= cnvtdatetime(curdate,curtime3))
					noteType = 2 ;complete todo
				endif
			endif						
 
			reply->patients[pos].comments[comment_cnt].comment_id = sn.sticky_note_id
			if(sn.long_text_id > 0)
				reply->patients[pos].comments[comment_cnt].comment_text = lt.long_text
			else
				reply->patients[pos].comments[comment_cnt].comment_text = sn.sticky_note_text
			endif
			reply->patients[pos].comments[comment_cnt].comment_type = noteType
			reply->patients[pos].comments[comment_cnt].updt_dt_tm = sn.updt_dt_tm
			reply->patients[pos].comments[comment_cnt].updt_id = pl.person_id
			reply->patients[pos].comments[comment_cnt].updt_name = pl.name_full_formatted
		else
			call echo(build("RetrieveComments: Unable to find patient ", sn.parent_entity_id))
		endif
	foot sn.parent_entity_id
		stat = alterlist(reply->patients[pos]->comments, comment_cnt)
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveComments"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit RetrieveComments(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"),LOG_LEVEL_DEBUG)
end

subroutine RetrievePhoneCalls(NULL)
	call log_message("Begin RetrievePhoneCalls()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare GEN_COMM_STATUS_CODESET = i4 with constant(4116002), protect
	declare CALLED_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"CALLED")),protect
	declare CREATED_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"CREATED")),protect
	declare idx = i4 with noconstant(0),protect
	declare nstart = i4 with noconstant(1),protect
	declare pending_cnt = i4 with noconstant(0),protect
	declare complete_cnt = i4 with noconstant(0),protect
	declare pos = i4 with noconstant(0),protect
	declare num = i4 with noconstant(0),protect
	declare pat_cnt = i4 with noconstant(size(reply->patients,5)),protect

	select into "nl:"
	from
		dcp_mp_pl_comm c,
		dcp_mp_pl_comm_patient cp,
		prsnl p
	plan c where
		c.active_ind = 1
	join cp where
		cp.dcp_mp_pl_comm_id = c.dcp_mp_pl_comm_id and
		expand(idx,nstart,pat_cnt,cp.person_id,reply->patients[idx].person_id) and
		cp.comm_type_flag = 0 and
		cp.active_ind = 1 and
		(cp.comm_status_cd = CREATED_CD or
			cp.comm_status_cd = CALLED_CD)
	join p where
		p.person_id = cp.last_updt_prsnl_id
	order by
		cp.person_id, cp.comm_status_dt_tm desc
	head cp.person_id
		pending_cnt = 0
		complete_cnt = 0
		pos = LOCATEVAL(num, 1, pat_cnt, cp.person_id, reply->patients[num].person_id)
	detail
		if(cp.comm_status_cd = CREATED_CD)
			pending_cnt = pending_cnt + 1
			if(mod(pending_cnt,10) = 1)
				stat = alterlist(reply->patients[pos].pending_calls, pending_cnt + 9)
			endif
			reply->patients[pos].pending_calls[pending_cnt].comm_patient_id = cp.dcp_mp_pl_comm_patient_id
			reply->patients[pos].pending_calls[pending_cnt].comm_subject_text = c.comm_subject_txt
			reply->patients[pos].pending_calls[pending_cnt].comm_prsnl_name = p.name_full_formatted
			reply->patients[pos].pending_calls[pending_cnt].comm_status_dt_tm = cp.comm_status_dt_tm
		else
			if(complete_cnt < 3 or cp.comm_status_dt_tm >= CNVTLOOKBEHIND("7,D"))
				complete_cnt = complete_cnt + 1
				if(mod(complete_cnt,10) = 1)
					stat = alterlist(reply->patients[pos].completed_calls, complete_cnt + 9)
				endif
				reply->patients[pos].completed_calls[complete_cnt].comm_patient_id = cp.dcp_mp_pl_comm_patient_id
				reply->patients[pos].completed_calls[complete_cnt].comm_subject_text = c.comm_subject_txt
				reply->patients[pos].completed_calls[complete_cnt].comm_prsnl_name = p.name_full_formatted
				reply->patients[pos].completed_calls[complete_cnt].comm_status_dt_tm = cp.comm_status_dt_tm
			endif
		endif
	foot cp.person_id
		stat = alterlist(reply->patients[pos].pending_calls, pending_cnt)
		stat = alterlist(reply->patients[pos].completed_calls, complete_cnt)
	with nocounter, expand = 1
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePhoneCalls"
       call replyFailure("SELECT")
    endif

	call log_message(build2("Exit RetrievePhoneCalls(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"),LOG_LEVEL_DEBUG)
end

subroutine BufferReply(NULL)
	call log_message("Begin BufferReply()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	call echo("Buffer Reply")
 
	if(validate(listrequest->patients) = 1)
		set cur_list_size = size(listrequest->patients,5)
	else
		call replyFailure("patient rec not defined")
	endif
	
	if(cur_list_size = 0)
		call log_message("No patients passed in", LOG_LEVEL_DEBUG)
		go to exit_script
	endif
	
	set stat = alterlist (reply->patients, cur_list_size)
 
	for (i = 1 to cur_list_size)
		if(validate(listrequest->patients[i].person_id, 0) > 0)
			set reply->patients[i].person_id = listrequest->patients[i].person_id
		else
			call replyFailure("patient_id rec not defined")
		endif
	endfor
 
	set cur_list_size = size(reply->patients,5)
	set loop_cnt = ceil( cnvtreal(cur_list_size) / batch_size)
 
	;don't need to do it in batches if it will only be 1 batch.
	if(loop_cnt < 2)
		set batch_size = cur_list_size
	endif
 
	set new_list_size = loop_cnt * batch_size
	set stat = alterlist(reply->patients, new_list_size)
	
	call log_message(build2("Exit BufferReply(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine UnbufferReply(NULL)
	call echo("Unbuffer Reply")
 
	set stat = alterlist(reply->patients, cur_list_size)
end
 
;TO DO - might be able to rewrite this cleaner
subroutine RetrieveEncounterTypeFromBedrock(NULL)
	call log_message("Begin RetrieveEncounterTypeFromBedrock()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	declare encntr_type_cnt = i4 with noconstant(0)
	
	; Temporary Variables
	declare x = i4 with noconstant(0), protect

	; Holds the value for all the encounter groups configured in bedrock
	declare group_cnt = i4 with noconstant(0)

	; Store the location of each encounter group within the encntr_group array
	declare inpt_index 	 = i4 with noconstant(0)
	declare outpt_index  = i4 with noconstant(0)
	declare ed_index 	 = i4 with noconstant(0)
	declare group1_index = i4 with noconstant(0)
	declare group2_index = i4 with noconstant(0)

	declare group1_days = i4 with noconstant(0)
	declare group2_days = i4 with noconstant(0)

	declare dwl_category_id = f8 with noconstant(0.0)
	declare pos_flex_id = f8 with noconstant(0.0)
	declare system_flex_id = f8 with noconstant(0.0)
	
	set dwl_category_id = GetCategoryId(DWL_CATEGORY_MEAN)
	set pos_flex_id = GetFlexId(listrequest->pos_cd)
	set system_flex_id = GetFlexId(0.0)
	
	declare flex_id_inpt = f8 with noconstant(0.0)
	declare flex_id_outpt= f8 with noconstant(0.0)
	declare flex_id_ed   = f8 with noconstant(0.0)
	declare flex_id_grp1 = f8 with noconstant(0.0)
	declare flex_id_grp2 = f8 with noconstant(0.0)
	
	; Indicator to check if encounter group label is configured in bedrock
	declare ind_lbl_inpt = i2 with noconstant(0)
	declare ind_lbl_outpt= i2 with noconstant(0)
	declare ind_lbl_ed   = i2 with noconstant(0)
	declare ind_lbl_grp1 = i2 with noconstant(0)
	declare ind_lbl_grp2 = i2 with noconstant(0)
	
	; Indicator to check if look back days is configured in bedrock for the encounter group
	declare ind_days_inpt = i2 with noconstant(0)
	declare ind_days_outpt= i2 with noconstant(0)
	declare ind_days_ed   = i2 with noconstant(0)
	declare ind_days_grp1 = i2 with noconstant(0)
	declare ind_days_grp2 = i2 with noconstant(0)
	
	declare temp_encntr_grp = i4 with noconstant(0)
 
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"INPT_ENC_TYPE",
				"OUTPT_ENC_TYPE",
				"ED_ENC_TYPE",
				"GROUP1_ENC_TYPE",
				"GROUP2_ENC_TYPE"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.logical_domain_id = 0
	order by bv.br_datamart_value_id desc, bf.filter_mean
 
	head report
		encntr_type_cnt = 0
 
	detail
 
		if(bv.parent_entity_id > 0)
			if(bv.br_datamart_flex_id = pos_flex_id)
				if(bf.filter_mean = "INPT_ENC_TYPE" and flex_id_inpt = system_flex_id)
					flex_id_inpt = pos_flex_id
				elseif(bf.filter_mean = "OUTPT_ENC_TYPE" and flex_id_outpt = system_flex_id)
					flex_id_outpt = pos_flex_id
				elseif(bf.filter_mean = "ED_ENC_TYPE" and flex_id_ed = system_flex_id)
					flex_id_ed = pos_flex_id
				elseif(bf.filter_mean = "GROUP1_ENC_TYPE" and flex_id_grp1 = system_flex_id)
					flex_id_grp1 = pos_flex_id
				elseif(bf.filter_mean = "GROUP2_ENC_TYPE" and flex_id_grp2 = system_flex_id)
					flex_id_grp2 = pos_flex_id
				endif
			endif
			if( (bf.filter_mean = "INPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_inpt)	or
				(bf.filter_mean = "OUTPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_outpt)	or
				(bf.filter_mean = "ED_ENC_TYPE"		and bv.br_datamart_flex_id = flex_id_ed)	or
				(bf.filter_mean = "GROUP1_ENC_TYPE" and bv.br_datamart_flex_id = flex_id_grp1)	or
				(bf.filter_mean = "GROUP2_ENC_TYPE" and bv.br_datamart_flex_id = flex_id_grp2)
			)
				encntr_type_cnt = encntr_type_cnt + 1
				if (mod(encntr_type_cnt, 10) = 1)
		    		stat = alterlist(bedrock_prefs->encntr_types,encntr_type_cnt+9)
				endif
				bedrock_prefs->encntr_types[encntr_type_cnt].encntr_type_cd = bv.parent_entity_id
				case(bf.filter_mean)
					of "INPT_ENC_TYPE":
						temp_encntr_grp = 1
					of "OUTPT_ENC_TYPE":
						temp_encntr_grp = 2
					of "ED_ENC_TYPE":
						temp_encntr_grp = 4
					of "GROUP1_ENC_TYPE":
						temp_encntr_grp = 8
					of "GROUP2_ENC_TYPE":
						temp_encntr_grp = 16
				endcase
				bedrock_prefs->encntr_types[encntr_type_cnt].encntr_group = temp_encntr_grp
			endif
		endif
 
	foot report
			stat = alterlist (bedrock_prefs->encntr_types, encntr_type_cnt)
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "Bedrock prefs select"
       call replyFailure("SELECT")
    endif
 
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"INPT_ENC_TYPE_LABEL",	"INPATIENT_DAYS",
				"OUTPT_ENC_TYPE_LABEL",	"OUTPATIENT_DAYS",
				"ED_ENC_TYPE_LABEL",	"ED_DAYS",
				"GROUP1_ENC_TYPE_LABEL","GROUP1_ENC_TYPE_DAYS",
				"GROUP2_ENC_TYPE_LABEL","GROUP2_ENC_TYPE_DAYS"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc, bv.updt_dt_tm
	head bv.br_datamart_filter_id

		if(bv.freetext_desc != "" and bv.freetext_desc != null)
			; Update the group count and store it as respective encounter group index if not updated previously
			if((bf.filter_mean = "INPT_ENC_TYPE_LABEL" or bf.filter_mean = "INPATIENT_DAYS") and inpt_index = 0)
				group_cnt = group_cnt + 1
				inpt_index = group_cnt
			elseif((bf.filter_mean = "OUTPT_ENC_TYPE_LABEL" or bf.filter_mean = "OUTPATIENT_DAYS") and outpt_index = 0)
				group_cnt = group_cnt + 1
				outpt_index = group_cnt
			elseif((bf.filter_mean = "ED_ENC_TYPE_LABEL" or bf.filter_mean = "ED_DAYS") and ed_index = 0)
				group_cnt = group_cnt + 1
				ed_index = group_cnt
			; Display custom group data only if a label is configured in bedrock
			elseif(bf.filter_mean = "GROUP1_ENC_TYPE_LABEL")
				group_cnt = group_cnt + 1
				group1_index = group_cnt
			; Display custom group data only if a label is configured in bedrock
			elseif(bf.filter_mean = "GROUP2_ENC_TYPE_LABEL")
				group_cnt = group_cnt + 1
				group2_index = group_cnt
			endif

			; Alter the encntr_group size to add new encounter group index
			stat = alterlist(reply->encntr_group, group_cnt)

			if(bf.filter_mean = "INPT_ENC_TYPE_LABEL" and
				(bv.br_datamart_flex_id = pos_flex_id or 
					(ind_lbl_inpt = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_lbl_inpt = 1
				reply->encntr_group[inpt_index].encntr_group_label = bv.freetext_desc
				reply->encntr_group[inpt_index].encntr_group = 1
			elseif (bf.filter_mean = "INPATIENT_DAYS" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_days_inpt = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_days_inpt = 1
				reply->encntr_group[inpt_index].encntr_group_days = cnvtint(bv.freetext_desc)
				reply->encntr_group[inpt_index].encntr_group = 1
			elseif (bf.filter_mean = "OUTPT_ENC_TYPE_LABEL" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_lbl_outpt = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_lbl_outpt = 1
				reply->encntr_group[outpt_index].encntr_group_label = bv.freetext_desc
				reply->encntr_group[outpt_index].encntr_group = 2
			elseif (bf.filter_mean = "OUTPATIENT_DAYS" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_days_outpt = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_days_outpt = 1
				reply->encntr_group[outpt_index].encntr_group_days = cnvtint(bv.freetext_desc)
				reply->encntr_group[outpt_index].encntr_group = 2
			elseif (bf.filter_mean = "ED_ENC_TYPE_LABEL" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_lbl_ed = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_lbl_ed = 1
				reply->encntr_group[ed_index].encntr_group_label = bv.freetext_desc
				reply->encntr_group[ed_index].encntr_group = 4
			elseif (bf.filter_mean = "ED_DAYS" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_days_ed = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_days_ed = 1
				reply->encntr_group[ed_index].encntr_group_days = cnvtint(bv.freetext_desc)
				reply->encntr_group[ed_index].encntr_group = 4
			elseif (bf.filter_mean = "GROUP1_ENC_TYPE_LABEL" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_lbl_grp1 = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_lbl_grp1 = 1
				reply->encntr_group[group1_index].encntr_group_label = bv.freetext_desc
				reply->encntr_group[group1_index].encntr_group = 8
			elseif (bf.filter_mean = "GROUP1_ENC_TYPE_DAYS" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_days_grp1 = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_days_grp1 = 1
				group1_days = cnvtint(bv.freetext_desc)
			elseif (bf.filter_mean = "GROUP2_ENC_TYPE_LABEL" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_lbl_grp2 = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_lbl_grp2 = 1
				reply->encntr_group[group2_index].encntr_group_label = bv.freetext_desc
				reply->encntr_group[group2_index].encntr_group = 16
			elseif (bf.filter_mean = "GROUP2_ENC_TYPE_DAYS" and
				(bv.br_datamart_flex_id = pos_flex_id or
					(ind_days_grp2 = 0 and bv.br_datamart_flex_id = system_flex_id)
				)
			)
				ind_days_grp2 = 1
				group2_days = cnvtint(bv.freetext_desc)
			endif
 
		endif
 
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "Encounter group select"
       call replyFailure("SELECT")
    endif

	; Check if any default group is already added to encntr_groups, if not, create a location for the default encounter group
	if(inpt_index = 0)
		set group_cnt = group_cnt + 1
		set inpt_index = group_cnt
		set stat = alterlist(reply->encntr_group, inpt_index)
	endif
	if(outpt_index = 0)
		set group_cnt = group_cnt + 1
		set outpt_index = group_cnt
		set stat = alterlist(reply->encntr_group, outpt_index)
	endif
	if(ed_index = 0)
		set group_cnt = group_cnt + 1
		set ed_index = group_cnt
		set stat = alterlist(reply->encntr_group, ed_index)
	endif
	
 	;Set the default labels for default groups which have no customization defined in bedrock
 	if(ind_lbl_inpt = 0 or ind_lbl_outpt = 0 or ind_lbl_ed = 0)
 
 		set x = 0
		/***Set Defaults***/
 		select into "nl:"
 		from code_value c
 		where c.code_set = 71 and c.cki in ("CKI.CODEVALUE!3957","CKI.CODEVALUE!3958","CKI.CODEVALUE!3959") and c.active_ind = 1
 		detail
 			; Set default values only if encounter group labels are not set in bedrock
 			if(c.cki = "CKI.CODEVALUE!3958" and ind_lbl_inpt = 0 and
 			   locateval(x,1,size(bedrock_prefs->encntr_types,5),1,bedrock_prefs->encntr_types[x].encntr_group) = 0)
 				stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
 				bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_group = 1
 				bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = c.code_value
 			elseif(c.cki = "CKI.CODEVALUE!3959" and ind_lbl_outpt = 0 and
 			       locateval(x,1,size(bedrock_prefs->encntr_types,5),2,bedrock_prefs->encntr_types[x].encntr_group) = 0)
	 			stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
				bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_group = 2
				bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = c.code_value
 			elseif(c.cki = "CKI.CODEVALUE!3957" and ind_lbl_ed = 0 and
 			       locateval(x,1,size(bedrock_prefs->encntr_types,5),4,bedrock_prefs->encntr_types[x].encntr_group) = 0)
	 			stat = alterlist(bedrock_prefs->encntr_types,size(bedrock_prefs->encntr_types, 5)+1)
	 			bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_group = 4
	 			bedrock_prefs->encntr_types[size(bedrock_prefs->encntr_types, 5)].encntr_type_cd = c.code_value
 			endif
 		with nocounter
 
;include i18n function declarations
%i cclsource:i18n_uar.inc
 
		;initialize variable that will keep the handle to i18n data
		declare i18n_Handle = i4
		set i18n_Handle = 0
		declare h = i4
		set h = uar_i18nlocalizationinit(i18n_Handle, curprog, "", curcclrev)

 		; Add the default labels for default groups which are not configured in bedrock
		if(ind_lbl_inpt = 0)
			declare i18n_InpatientLabel = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_InpatientLabel", "Inpatient"))
			set reply->encntr_group[inpt_index].encntr_group_label = i18n_InpatientLabel
			set reply->encntr_group[inpt_index].encntr_group = 1
		endif
		if(ind_lbl_outpt = 0)
			declare i18n_OutPatientLabel = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_OutpatientLabel", "Outpatient"))
			set reply->encntr_group[outpt_index].encntr_group_label = i18n_OutPatientLabel
			set reply->encntr_group[outpt_index].encntr_group = 2
		endif
		if(ind_lbl_ed = 0)
			declare i18n_EmergencyLabel = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_EmergencyLabel", "Emergency"))
			set reply->encntr_group[ed_index].encntr_group_label = i18n_EmergencyLabel
			set reply->encntr_group[ed_index].encntr_group = 4
		endif
 
	endif

	; Set the default days for default groups which are not configured in bedrock
	if(ind_days_inpt = 0 or
		reply->encntr_group[inpt_index].encntr_group_days <= 0 or
    	reply->encntr_group[inpt_index].encntr_group_days > lookBackMaxDays
	)
		set reply->encntr_group[inpt_index].encntr_group_days = 180
	endif
	if(ind_days_outpt = 0 or
    	reply->encntr_group[outpt_index].encntr_group_days <= 0 or
    	reply->encntr_group[outpt_index].encntr_group_days > lookBackMaxDays
	)
		set reply->encntr_group[outpt_index].encntr_group_days = 180
	endif
	if(ind_days_ed = 0 or
    	reply->encntr_group[ed_index].encntr_group_days <= 0 or
    	reply->encntr_group[ed_index].encntr_group_days > lookBackMaxDays
	)
		set reply->encntr_group[ed_index].encntr_group_days = 180
	endif

	; Set the default days for custom group, if the group label is present and the look back days are out of range
	if(ind_lbl_grp1 != 0)
		if(group1_days <= 0 or group1_days > lookBackMaxDays)
			set group1_days = 180
		endif
		set reply->encntr_group[group1_index].encntr_group_days = group1_days
	endif
	if(ind_lbl_grp2 != 0)
		if(group2_days <= 0 or group2_days > lookBackMaxDays)
			set group2_days = 180
		endif
		set reply->encntr_group[group2_index].encntr_group_days = group2_days
	endif
	
	call log_message(build2("Exit RetrieveEncounterTypeFromBedrock(), Elapsed time:",
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
 
#exit_script
 
call echorecord(bedrock_prefs)
call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif

free record getREQUEST
free record getREPLY

end go
