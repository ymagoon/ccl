drop program mp_dcp_load_static_list:dba go
create program mp_dcp_load_static_list:dba
 
prompt "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
with  OUTDEV , JSON_ARGS
 
/*
record list_request
(
	1 patient_list_id = f8		;(required and > 0)
	1 groups[*]					;(optional) (groups that user has access to, not part of the list criteria)
		2 group_name = vc			;(optional)
		2 group_id = f8				;(required needs to be sorted)
)
*/
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
free record reply
record reply
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
		2 last_comp_action_dt_tm = dq8
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
		2 encntr_ids [*]
			3 encntr_id = f8
	1 list_allowed_ind = i2
%i cclsource:status_block.inc
)
 
 
free record eprs
record eprs
(
	1 epr_cds[*]
		2 epr_cd = f8
)
 
%i cclsource:mp_script_logging.inc
%i cclsource:mp_dcp_pl_includes.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_load_static_list", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare RetrievePatients(NULL) = NULL
declare RetrievePatientDemographics(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL
declare VerifyGroups(NULL) = NULL
declare VerifyLocations(NULL) = NULL
declare InactivateList(NULL) = NULL
declare LoadListEprs(NULL) = NULL
declare LoadEncounterIds(NULL) = NULL
declare EvaluateOrgSecurity(NULL) = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare patient_cnt = i4 with protect,noconstant(0)
declare mrn_meaning = f8 with protect,constant(uar_get_code_by( "MEANING", 4, "MRN"))
declare org_security_ind = i2 with protect,noconstant(0)
declare loc_ind = i2 with protect,noconstant(0)
declare grp_ind = i2 with protect,noconstant(0)
 
declare ORG_SEC_ON = i2 with protect,constant(1)
 
declare phoneNumberFormatted = vc with protect, noconstant("")
 
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
set reply->list_allowed_ind = 1
 
/**************************************************************
; Execution
**************************************************************/
 
if ((validate(list_request->patient_list_id, 0) <= 0.0))
	set reply->status_data->status = "F"
	call replyFailure("patient_list_id not defined")
endif
 
if(validate(list_request->groups) = 1)
	if(size(list_request->groups,5) > 0)
		call VerifyGroups(NULL)
	else
	    set reply->list_allowed_ind = 0
	endif
else
	call VerifyLocations(NULL)
endif
  
if(reply->list_allowed_ind = 0)
	call InactivateList(NULL)
	set reply->status_data->status = "F"
	go to exit_script
endif
 
call RetrievePatients(NULL)
 
if (size(reply->patients,5) <= 0)
	set reply->status_data->status = "Z"
	go to exit_script
endif
 
call RetrievePatientDemographics(NULL)
call LoadListEprs(NULL)
 
if(size(eprs->epr_cds, 5) > 0)
	call EvaluateOrgSecurity(NULL)
	call LoadEncounterIds(NULL)
endif
 
set reply->status_data->status = "S"
 
go to exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
subroutine VerifyGroups(NULL)
	call log_message("In VerifyGroups()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare val = i4 with noconstant(0), protect
	declare listGrpCnt = i4 with noconstant(0), protect
	declare ARGNAME = vc with constant(build2(ARGNAME_ACMGROUP, "_SEARCH")), protect
 
	;Get the groups
	select into "nl:"
	from dcp_pl_argument a
	where a.dcp_mp_patient_list_id = list_request->patient_list_id
		and a.argument_name = ARGNAME
	detail
		if(locatevalsort(val,1,size(list_request->groups,5), a.parent_entity_id,
			validate(list_request->groups[val].group_id, 0)) <= 0)
 
			reply->list_allowed_ind = 0
		endif
	with nocounter
 
	if(reply->list_allowed_ind = 0)
		call log_message(build2("The groups for list ", list_request->patient_list_id,
			" are no longer valid so the list will be inactivated."), LOG_LEVEL_WARNING)
	endif
 
 
	call log_message(build2("Exit VerifyGroups(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine VerifyLocations(NULL)
	call log_message("In VerifyLocations()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	
	declare val = i4 with noconstant(0), protect
	declare listLocCnt = i4 with noconstant(0), protect
	declare ARGNAME = vc with constant(build2(ARGNAME_LOCATIONUNITS, "_SEARCH")), protect
	
	call RetrieveAssociatedOrganizations(reqinfo->UPDT_ID)
 
	;Get the locations
	select into "nl:"
	from dcp_pl_argument a,
		location l
	plan a
	where a.dcp_mp_patient_list_id = list_request->patient_list_id
		and a.argument_name = ARGNAME
	join l where 
		l.location_cd = a.parent_entity_id
		and l.active_ind = 1
		and l.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and l.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	detail
		if(locateval(val,1,size(user_orgs->organizations, 5),l.organization_id,user_orgs->organizations[val].
				organization_id) <= 0)
 			reply->list_allowed_ind = 0
		endif
	with nocounter
	
 
	;call echorecord(list_request)
	if(reply->list_allowed_ind = 0)
		call log_message(build2("The locations for list ", list_request->patient_list_id,
			" are no longer valid so the list will be inactivated."), LOG_LEVEL_WARNING)
	endif
 
 
	call log_message(build2("Exit VerifyLocations(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine InactivateList(NULL)
	call log_message("In InactivateList()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
 
    update into dcp_mp_patient_list d
    set d.default_list_ind = 0
    where d.dcp_mp_patient_list_id =  list_request->patient_list_id
 
    set reqinfo->commit_ind = 1
 
	call log_message(build2("Exit InactivateList(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine RetrievePatients(NULL)
	call log_message("Begin RetrievePatients()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare patient_cnt = i4 with noconstant(0)
 
	select into "nl:"
	from
		dcp_mp_pl_custom_entry dce
	plan dce where
		dce.dcp_mp_patient_list_id = list_request->patient_list_id
	order by
		dce.person_id
 
	head report
		patient_cnt = 0
 
	head dce.person_id
		patient_cnt = patient_cnt + 1
		if(mod(patient_cnt,20) = 1)
			stat = alterlist(reply->patients,patient_cnt + 20)
		endif
 
		reply->patients[patient_cnt].person_id = dce.person_id
		reply->patients[patient_cnt].rank = dce.person_priority_nbr
		reply->patients[patient_cnt].last_action_dt_tm = dce.last_action_dt_tm
		reply->patients[patient_cnt].last_action_desc = dce.last_action_desc
 
	foot report
		stat = alterlist(reply->patients,patient_cnt)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePatients"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit RetrievePatients(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrievePatients found ", patient_cnt), LOG_LEVEL_DEBUG)
 
end
 
subroutine RetrievePatientDemographics(NULL)
	call log_message("Begin RetrievePatientDemographics()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    declare todoTypeCd = f8 with constant(uar_get_code_by("MEANING",14122,"RWLTODO"))
    declare cur_list_size = i4 with noconstant(size(reply->patients, 5))
    declare batch_size = i4 with constant(50)
	declare loop_cnt = i4 with noconstant(ceil(cnvtreal(cur_list_size) / batch_size))
	declare new_list_size = i4 with noconstant(loop_cnt * batch_size)
	declare idx = i4 with protect,noconstant(0)
	declare pos = i4 with protect,noconstant(0)
	declare race_cnt = i4 with protect, noconstant(0)
	declare nstart = i4 with noconstant(1)
 
	declare work_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"BUSINESS")),protect
	declare mobile_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"MOBILE")),protect
	declare home_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"HOME")),protect
	declare multi_race_cd = f8 with Constant(uar_get_code_by("MEANING",282,"MULTIPLE")),protect
 
	set stat = alterlist(reply->patients, new_list_size)
	for(num = cur_list_size + 1 to new_list_size)
	   set reply->patients[num].person_id = reply->patients[cur_list_size].person_id
	endfor
 
	select into "nl:"
	from
		(dummyt d1 with seq = value(loop_cnt)),
		person p,
		person_alias pa,
		sticky_note sn,
		person_code_value_r pr,
		phone ph,
		person_patient pp
	plan d1 where
		initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
	join p where
		expand(idx,nstart,nstart+(batch_size-1),p.person_id, reply->patients[idx].person_id)
	join pa where
		pa.person_id = outerjoin(p.person_id) and
    	pa.person_alias_type_cd = outerjoin(mrn_meaning) and
    	pa.active_ind = outerjoin(1) and
   		pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3)) and
		pa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
	join sn where
		sn.parent_entity_id = outerjoin(p.person_id) and
		sn.parent_entity_name = outerjoin("PERSON") and
		sn.sticky_note_type_cd = outerjoin(todoTypeCd) and
		sn.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3)) and
		sn.end_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3)) ;completed
	join pr where
		pr.person_id = outerjoin(p.person_id) and
		pr.code_set = outerjoin(282) and ;282 is the code set for race
		pr.active_ind = outerjoin(1)
	join ph where
		ph.parent_entity_name = outerjoin("PERSON")  AND
	    outerjoin(p.person_id) = ph.parent_entity_id AND
	    ;(ph.phone_type_cd = outerjoin(home_phone_cd)
	    ;	OR ph.phone_type_cd = outerjoin(mobile_phone_cd)
	    ;	OR ph.phone_type_cd = outerjoin(work_phone_cd))  AND
	    ph.active_ind = outerjoin(1)  AND
	    ph.beg_effective_dt_tm < outerjoin(cnvtdatetime(curdate,curtime3))  AND
	    ph.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join pp where
		pp.person_id = outerjoin(p.person_id) AND
		pp.beg_effective_dt_tm < outerjoin(cnvtdatetime(curdate,curtime3))  AND
	    pp.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))	AND
		pp.active_ind = outerjoin(1)
	order by
		p.person_id
		, sn.updt_dt_tm
		, ph.phone_type_cd
		, ph.phone_type_seq
 
	head p.person_id
		pos = locateval(idx,1,cur_list_size,p.person_id,reply->patients[idx].person_id)
		race_cnt = 0
		if (pos > 0)
			reply->patients[pos].name_full_formatted = p.name_full_formatted
			reply->patients[pos].name_last_key = p.name_last_key
			reply->patients[pos].name_first_key = p.name_first_key
			reply->patients[pos].name_middle_key = p.name_middle_key
			reply->patients[pos].birth_dt_tm =
				trim(format(cnvtdatetimeutc(datetimezone(p.birth_dt_tm, p.birth_tz),1),'YYYY-MM-DDTHH:MM:SSZ;;Q'), 3)
			if(p.deceased_dt_tm != null)
				reply->patients[pos].deceased_dt_tm =
					trim(format(cnvtdatetimeutc(datetimezone(p.deceased_dt_tm, p.birth_tz),1),'YYYY-MM-DDTHH:MM:SSZ;;Q'), 3)
			endif
			reply->patients[pos].birth_date = p.birth_dt_tm
			reply->patients[pos].birth_tz = p.birth_tz
			reply->patients[pos].sex_cd = p.sex_cd
			reply->patients[pos].sex_disp = uar_get_code_display(p.sex_cd)
			reply->patients[pos].marital_type_cd = p.marital_type_cd
			reply->patients[pos].language_cd = p.language_cd
			reply->patients[pos].language_dialect_cd = p.language_dialect_cd
			reply->patients[pos].confid_level_cd = p.confid_level_cd
 			reply->patients[pos].contact_method_cd = pp.contact_method_cd
 
			if(p.race_cd != multi_race_cd)
 
				stat = alterlist(reply->patients[pos]->races,race_cnt+1)
				reply->patients[pos]->races[race_cnt+1].race_cd = p.race_cd
			endif
 
			reply->patients[pos].mrn = pa.alias
		endif
 
	; need to retrieve date of last completed action (todo) here in order to sort list on it
	head sn.sticky_note_id
		if (pos > 0)
			reply->patients[pos].last_comp_action_dt_tm = sn.updt_dt_tm
		endif
 
	head pr.code_value
		if(pr.code_value > 0)
			race_cnt = race_cnt + 1
			if(mod(race_cnt,20) = 1)
				stat = alterlist(reply->patients[pos]->races,race_cnt + 19)
			endif
			reply->patients[pos]->races[race_cnt].race_cd = pr.code_value
		endif
 
	head ph.phone_type_cd
		if(pos > 0)
			phoneNumberFormatted = FormatPhoneNumber(ph.phone_num, ph.phone_format_cd)
 
			if(ph.phone_type_cd = home_phone_cd)
				reply->patients[pos].home_phone = phoneNumberFormatted
				reply->patients[pos].home_ext = ph.extension
			elseif(ph.phone_type_cd = mobile_phone_cd)
				reply->patients[pos].mobile_phone = phoneNumberFormatted
				reply->patients[pos].mobile_ext = ph.extension
			elseif(ph.phone_type_cd = work_phone_cd)
				reply->patients[pos].work_phone = phoneNumberFormatted
	 			reply->patients[pos].work_ext = ph.extension
			endif
		endif
 
	foot p.person_id
		stat = alterlist(reply->patients[pos]->races, race_cnt+1)
 
	with nocounter, expand=1
 
	set stat = alterlist(reply->patients, cur_list_size)
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePatientDemog"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit RetrievePatientDemographics(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrievePatientDemographics found ", curqual),
     LOG_LEVEL_DEBUG)
 
end
 
subroutine LoadListEprs(NULL)
	call log_message("In LoadListEprs()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare epr_cnt = i4 with noconstant(0)
 
	select into "nl:"
		from dcp_pl_argument arg where
		arg.dcp_mp_patient_list_id = list_request->patient_list_id
		and arg.argument_name = "EPRCODES_SEARCH"
		and arg.parent_entity_name = "CODE_VALUE"
 
	head arg.parent_entity_id
		epr_cnt = epr_cnt + 1
		if(mod(epr_cnt,20) = 1)
			stat = alterlist(eprs->epr_cds, epr_cnt + 20)
		endif
		eprs->epr_cds[epr_cnt].epr_cd = arg.parent_entity_id
	with nocounter
 
	if(epr_cnt > 0)
		set stat = alterlist(eprs->epr_cds, epr_cnt)
	endif
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "LoadListEprs"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit LoadListEprs(), Elapsed time:",
    cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine LoadEncounterIds(NULL)
	call log_message("In loadEncounterIds()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare idx = i4 with protect,noconstant(0)
	declare org_pos = i4 with protect,noconstant(0)
	declare patient_pos = i4 with protect,noconstant(0)
 
	if(org_security_ind = ORG_SEC_ON)
		; Get organizations current user has access to through org security
		if(validate(sac_org) = 0)
%i cclsource:sacrtl_org.inc
		endif
	endif
 
	select
	if(org_security_ind = ORG_SEC_ON) ;Check security for orgs
		head e.person_id
			org_pos = locateval(idx,1,size(sac_org->organizations, 5),e.organization_id,sac_org->organizations[idx].
				organization_id)
			if(org_pos > 0)
				patient_pos = locateval(idx,1,size(reply->patients, 5),e.person_id,reply->patients[idx].person_id)
				if(patient_pos > 0)
					stat = alterlist(reply->patients[patient_pos]->encntr_ids, size(reply->patients[patient_pos]->encntr_ids, 5) + 1)
					reply->patients[patient_pos]->encntr_ids[size(reply->patients[patient_pos]->encntr_ids, 5)].encntr_id = e.encntr_id
				endif
			endif
	else
		head e.person_id
			patient_pos = locateval(idx,1,size(reply->patients, 5),e.person_id,reply->patients[idx].person_id)
			if(patient_pos > 0)
				stat = alterlist(reply->patients[patient_pos]->encntr_ids, size(reply->patients[patient_pos]->encntr_ids, 5) + 1)
				reply->patients[patient_pos]->encntr_ids[size(reply->patients[patient_pos]->encntr_ids, 5)].encntr_id = e.encntr_id
			endif
	endif
	into "nl:" from
		encntr_prsnl_reltn epr,
		encounter e
	plan epr where
		expand(idx, 1, size(eprs->epr_cds, 5), epr.encntr_prsnl_r_cd, eprs->epr_cds[idx]->epr_cd)
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join e where
		expand(idx, 1, size(reply->patients, 5), e.person_id, reply->patients[idx].person_id)
		and e.encntr_id = epr.encntr_id
		and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and e.active_ind = 1
	order by e.depart_dt_tm desc
 
	with nocounter, expand = 2
 
	call log_message(build2("Exit loadEncounterIds(), Elapsed time:",
    cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
    set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "LoadEncounterIds"
       call replyFailure("SELECT")
    endif
end
 
;see if encntr_org security is turned on
subroutine EvaluateOrgSecurity (NULL)
    call log_message("In EvaluateOrgSecurity()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    select into "nl:" from
		dm_info di
	plan di where
		di.info_domain = "SECURITY"
		and di.info_name = "SEC_ORG_RELTN"
		and di.info_number = ORG_SEC_ON
	head report
		org_security_ind = ORG_SEC_ON
	with nocounter
 
	call log_message(build2("Exit EvaluateOrgSecurity(), Elapsed time:",
    cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
    set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "EvaluateOrgSecurity"
       call replyFailure("SELECT")
    endif
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
 
call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif
 
end go
 
 
