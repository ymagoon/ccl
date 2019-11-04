drop program op_perigen_esi go
create program op_perigen_esi
 
call log_msg(2, "Starting PeriGen ESI", "PeriGenAud")
call log_msg(2, "{{Script::OP_PERIGEN_ESI}}", "PeriGenAud")
 
%i ccluserdir:perigen_record_structures.inc
  
/***********************************************
* VARIABLE AND SUBROUTINE DECLARATION          *
************************************************/
declare log_msg(loglevel, msg, descrip) = null
declare read_cache(val1, val2, type) = f8
 
declare contrib_sys_disp = vc
declare contrib_sys_cd = f8
declare contrib_source_disp = vc
declare contrib_source_cd = f8
declare msg_dt_tm = vc
declare msg_ctrl_ident = vc
declare message_type = vc
declare message_trigger = vc
declare patient_id = vc
declare patient_id_ident = vc
declare patient_id_alias_pool_cd = f8
declare patient_id_alias_type_cd = f8
declare patient_id_contrib_sys_cd = f8
declare name_last = vc
declare name_first = vc
declare dob = f8
declare sex_disp = vc
declare sex_cd = f8
declare account_nbr = vc
declare account_nbr_ident = vc
declare account_nbr_alias_pool_cd = f8
declare account_nbr_alias_type_cd = f8
declare account_nbr_contrib_sys_cd = f8
declare person_id = f8
declare encntr_id = f8
declare observation_ident = vc
declare observation_value = vc
 
declare acuity_level_id = f8
declare cur_acuity_level_id = f8
declare tracking_id = f8
declare tracking_checkin_id = f8
declare tracking_ref_id = f8
 
set data_status_cd = uar_get_code_by("MEANING",8,"AUTH")
set acuity_cd = uar_get_code_by("MEANING", 16409, "ACUITY")
set start_dt_tm = cnvtdatetime(curdate,curtime3)
 
/***********************************************
* PARSE INBOUND HL7 MESSAGE                    *
************************************************/
call echo("calling oen_setup_requests")
call log_msg(2, "Calling oen_setup_requests", "PeriGenAud")
execute oen_setup_requests
 
set stat = alterlist(request->segs, 3)
 
;populate request to pass into oen_parse_segments
set request->message = oenorgmsg->msg
set request->segs[1].seg_name = "MSH"
set request->segs[2].seg_name = "PID"
set request->segs[3].seg_name = "OBX"
 
;oen_parse_segments parses the HL7 message and saves it in a record structure saved_seg
call echo("calling oen_parse_segments")
call log_msg(2, "Calling oen_parse_segments", "PeriGenAud")
execute oen_parse_segments
 
call echorecord(saved_seg)
 
/***********************************************
* EXTRACT DATA FROM PARSED HL7 MESSAGE         *
************************************************/
 
;MSH
call echo("Extracting MSH data from saved_seg")
call log_msg(2, "Extracting MSH data from saved_seg", "PeriGenAud")
 
set contrib_sys_disp = saved_seg->seg[1].field[2].field_value ;msh.2
 
set pos = read_cache(89,contrib_sys_disp,"ALIAS")
set contrib_sys_cd = read_cache(89, contrib_sys_disp, "ALIAS")
 
if (pos > 0)
  set contrib_sys_cd = cache->alias[pos].code_value
else
  call echo(build2("Invalid contributor system: ", contrib_sys_disp))
  call log_msg(0, build2("Invalid contrib system: ", contrib_sys_disp), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("Invalid contributor system in MSH.3: ", contrib_sys_disp)
  go to exit_script
endif
 
set msg_dt_tm = saved_seg->seg[1].field[6].field_value ;msh.7
set message_type = saved_seg->seg[1].field[8].repeat.comp.comp_value ;msh.9.1
set message_trigger = saved_seg->seg[1].field[8].repeat.comp[2].comp_value ;msh.9.2
set msg_ctrl_ident = saved_seg->seg[1].field[9].field_value ;msh.10
 
;PID
call echo("Extracting PID data from saved_seg")
call log_msg(2, "Extracting PID data from saved_seg", "PeriGenAud")
 
set patient_id = saved_seg->seg[2].field[3].repeat.comp.comp_value
set patient_id_ident = saved_seg->seg[2].field[3].repeat.comp[5].comp_value ;only coded to take esi_alias_type at the moment
 
set pos = read_cache(contrib_sys_cd,patient_id_ident,"TRANS")
 
if (pos > 0)
  set patient_id_alias_pool_cd = cache->esi_alias_trans[pos].alias_pool_cd
  set patient_id_alias_type_cd = cache->esi_alias_trans[pos].alias_entity_alias_type_cd
  set patient_id_contrib_sys_cd = cache->esi_alias_trans[pos].contrib_sys_cd
else
  call echo(build2("Invalid patient identifier: ", patient_id_ident))
  call log_msg(0, build2("Invalid patient identifier: ", patient_id_ident), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("Invalid patient identifier: ", patient_id_ident)
  go to exit_script
endif
 
set name_last = saved_seg->seg[2].field[5].repeat.comp.comp_value
set name_first = saved_seg->seg[2].field[5].repeat.comp[2].comp_value
set dob = cnvtdatetime("12-OCT-1961") ;cnvtdatetime(saved_seg->seg[2].field[7].field_value) ;;; todo - fix dob
set sex_disp = saved_seg->seg[2].field[8].field_value
 
set pos = read_cache(57,sex_disp,"ALIAS")
 
if (pos > 0)
  set sex_cd = cache->alias[pos].code_value
else
  call echo(build2("Invalid sex_cd: ", sex_disp))
  call log_msg(0, build2("Invalid sex_cd: ", sex_disp), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("Invalid sex_cd: ", sex_disp)
  go to exit_script
endif
 
set account_nbr = saved_seg->seg[2].field[18].repeat.comp.comp_value
set account_nbr_ident = saved_seg->seg[2].field[18].repeat.comp[5].comp_value ;only coded to take esi_alias_type at the moment
 
set pos = read_cache(contrib_sys_cd,account_nbr_ident,"TRANS")
 
if (pos > 0)
  set account_nbr_alias_pool_cd = cache->esi_alias_trans[pos].alias_pool_cd
  set account_nbr_alias_type_cd = cache->esi_alias_trans[pos].alias_entity_alias_type_cd
  set account_nbr_contrib_sys_cd = cache->esi_alias_trans[pos].contrib_sys_cd
else
  call echo(build2("Invalid patient identifier: ", account_nbr_ident))
  call log_msg(0, build2("Invalid patient identifier: ", account_nbr_ident), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("Invalid patient identifier: ", account_nbr_ident)
  go to exit_script
endif
 
;all of this logic will likely change because at the time of the script writing we have no idea how PeriGen is sending in results
 
;OBR
;Possibly Need OBR.16 or OBR.32?
 
;OBX
call echo("Extracting OBX data from saved_seg")
call log_msg(2, "Extracting OBX data from saved_seg", "PeriGenAud")
 
set observation_ident = saved_seg->seg[3].field[3].field_value
set observation_value = saved_seg->seg[3].field[5].field_value
 
/***********************************************
* PERFORM PERSON MATCH LOGIC                   *
************************************************/
call echo("Performing person match logic")
call log_msg(2, "Performing person match logic", "PeriGenAud")
 
set stat = alterlist(request119995->person,1)
 
set request119995->person_qual = 1
set request119995->person.data_status_cd = data_status_cd
set request119995->person.name_last = name_last ;pid 5.1
set request119995->person.name_last_key = cnvtupper(name_last) ;pid 5.1
set request119995->person.name_first = name_first ;pid 5.2
set request119995->person.name_first_key = cnvtupper(name_first) ;pid 5.2
set request119995->person.name_full_formatted = build2(cnvtupper(name_last),", ",cnvtupper(name_first)) ;pid 5.1 + pid 5.2
set request119995->person.contributor_system_cd = contrib_sys_cd ;msh.3
set request119995->person.birth_dt_tm = dob ;pid 7 ;;; todo - fix
set request119995->person.sex_cd = sex_cd ;pid.8
 
set stat = alterlist(request119995->person.person_alias,1)
 
set request119995->person.person_alias.alias = patient_id ;pid 2.1
set request119995->person.person_alias.alias_pool_cd = patient_id_alias_pool_cd
set request119995->person.person_alias.person_alias_type_cd = patient_id_alias_type_cd
set request119995->person.person_alias.contributor_system_cd = patient_id_contrib_sys_cd
 
set request119995->person.person_alias_qual = 1
set request119995->match_unauth_reconcile_flag = 1
 
call echorecord(request119995)
 
set trace recpersist
call echo("Executing pm_match_person")
call log_msg(2, "Executing pm_match_person", "PeriGenAud")
 
execute pm_match_person with replace("REQUEST",request119995), replace("REPLY",reply119995)
 
call echorecord(reply119995)
set trace norecpersist
 
if (reply119995->status_data.status = "F")
  call echo("pm_match_person failed")
  call log_msg(0, build2("pm_match_person failed, patient identifier: ", patient_id), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("pm_match_person failed, patient identifier: ", patient_id)
  go to exit_script
endif
 
if (reply119995->person.person_id > 0)
  set person_id = reply119995->person.person_id
else
  call echo("pm_match_person did not return any patients")
  call log_msg(0, build2("pm_match_person did not return any patients for identifier: ", patient_id), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("pm_match_person did not return any patients for identifier: ", patient_id)
  go to exit_script
endif
 
/**************************************************
* PERFORM ENCOUNTER MATCH LOGIC                   *
***************************************************/
call echo("Performing encounter match logic")
call log_msg(2, "Performing encounter match logic", "PeriGenAud")
 
set stat = alterlist(request100301->encntr_alias,1)
 
set request100301->person_id = person_id
set request100301->encntr_alias.alias = account_nbr ;pid.18.1
set request100301->encntr_alias.alias_pool_cd = account_nbr_alias_pool_cd ;pid.18.5
set request100301->encntr_alias.encntr_alias_type_cd = account_nbr_alias_type_cd
set request100301->encntr_alias.contributor_system_cd = account_nbr_contrib_sys_cd
 
set request100301->encntr_alias_qual = 1
 
set trace recpersist
call echo("Executing pm_val_encounter")
call log_msg(2, "Executing pm_val_encounter", "PeriGenAud")
 
execute pm_val_encounter with replace("REQUEST",request100301), replace("REPLY",reply100301)
 
call echorecord(reply100301)
set trace norecpersist
 
if (reply100301->status_data.status = "F")
  call echo("pm_val_encounter failed")
  call log_msg(0, build2("pm_val_encounter failed, account identifier: ", account_nbr), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("pm_val_encounter failed, account identifier: ", account_nbr)
  go to exit_script
endif
 
;;; todo - just so happens my patient has more than one encounter :(
 
;if (reply100301->record_found_qual > 1)
;  call echo("pm_val_encounter found more than one encounter on the patient")
;  call log_msg(0, "pm_val_encounter found more than one encounter on the patient", "PeriGenErr")
;  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
;  set request1200040->esi_log.error_text = "pm_val_encounter found more than one encounter on the patient"
;  go to exit_script
;endif
 
if (reply100301->match_record.encntr_id > 0)
  set encntr_id = reply100301->match_record.encntr_id
else
  call echo("pm_val_encounter did not return any encounters")
  call log_msg(0, build2("pm_val_encounter did not return any encounters for identifier: ", account_nbr), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("pm_val_encounter did not return any encounters for identifier: ", account_nbr)
  go to exit_script
endif
 
/***********************************************
* UPDATE PATIENT'S ACUITY LEVEL IN FIRSTNET    *
************************************************/
call echo("Update patients acuity level in FirstNet")
call log_msg(2, "Update patients acuity level in FirstNet", "PeriGenAud")

set pos = read_cache(16589,observation_value,"ALIAS")
 
if (pos > 0)
  set acuity_level_id = cache->alias[pos].id_nbr
else
  call echo(build2("Acuity level not found for alias: ", observation_value))
  call log_msg(0, build2("Acuity level not found for alias: ", observation_value), "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = build2("Acuity level not found for alias: ", observation_value)
  go to exit_script
endif
 
select into "nl:"
  tc.acuity_level_id
  , ti.tracking_id
  , tc.tracking_checkin_id
  , tr.tracking_ref_id
from
  tracking_item ti
  , tracking_checkin tc
  , track_reference tr
plan ti
  where ti.encntr_id = 126339190.00 ;encntr_id ;
    and ti.active_ind = 1
join tc
  where tc.tracking_id = ti.tracking_id
join tr
  where tr.tracking_ref_id = tc.acuity_level_id
    and tr.active_ind = 1
    and tr.tracking_ref_type_cd = acuity_cd
detail
  cur_acuity_level_id = tc.acuity_level_id
  tracking_id = ti.tracking_id
  tracking_checkin_id = tc.tracking_checkin_id
  tracking_ref_id = tr.tracking_ref_id
with nocounter
 
if (curqual < 1)
  call echo("Select statement did not find an acuity level for patient")
  call log_msg(0, "Select statement did not find an acuity level for patient", "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_FAILURE"
  set request1200040->esi_log.error_text = "Select statement did not find an acuity level for patient"
  go to exit_script
endif

if (cur_acuity_level_id = acuity_level_id)
  call echo("Current acuity level matches acuity level from HL7. Ignoring message")
  call log_msg(0, "Current acuity level matches acuity level from HL7. Ignoring message", "PeriGenErr")
  set request1200040->esi_log.error_stat = "ESI_STAT_INFO"
  set request1200040->esi_log.error_text = "Current acuity level matches acuity level from HL7. Ignoring message"
  go to exit_script
else
;;;update
set x =1
/*
  update into tracking_checkin tc
    set
      tc.acuity_level_id = acuity_level_id
      , tc.updt_cnt = tc.updt_cnt + 1
      , tc.updt_dt_tm = cnvtdatetime(curdate, curtime3)
      , tc.updt_id = reqinfo->updt_id
      , tc.updt_task = reqinfo->updt_task
      , tc.updt_applctx = reqinfo->updt_applctx
  where tc.tracking_checkin_id = tracking_checkin_id
  commit
 
  update into tracking_item ti
    set
      ti.updt_cnt = tc.updt_cnt + 1
      , ti.updt_dt_tm = cnvtdatetime(curdate, curtime3)
      , ti.updt_id = reqinfo->updt_id
      , ti.updt_task = reqinfo->updt_task
      , ti.updt_applctx = reqinfo->updt_applctx
  where ti.tracking_id = tracking_id
  commit
  */
endif

/***************************************
* POPULATE THE ESI_LOG TABLE           *
****************************************/
set request1200040->esi_log.error_stat = "ESI_STAT_SUCCESS"
set request1200040->esi_log.error_text = build2("Acuity level changed from: ", cur_acuity_level_id, " to ", acuity_level_id)

#exit_script

set request1200040->esi_log.esi_log_qual = 1
set request1200040->esi_log.contributor_system_cd = contrib_sys_cd
set request1200040->esi_log.msh_sending_app = contrib_sys_disp
set request1200040->esi_log.msh_date = msg_dt_tm
set request1200040->esi_log.msh_msg_type = message_type
set request1200040->esi_log.msh_msg_trig = message_trigger
set request1200040->esi_log.msh_ctrl_ident = msg_ctrl_ident
set request1200040->esi_log.hl7_entity_code = tracking_id

set request1200040->esi_log.start_dt_tm = start_dt_tm
set request1200040->esi_log.end_dt_tm = cnvtdatetime(curdate,curtime3)
set request1200040->esi_log.name_full_formatted = build2(cnvtupper(name_last),", ",cnvtupper(name_first))
set request1200040->esi_log.person_id = person_id
set request1200040->esi_log.encntr_id = encntr_id
set request1200040->esi_log.person_alias = patient_id
set request1200040->esi_log.encntr_alias = account_nbr

execute esi_add_log_table with replace("request", request1200040)
 
/********************************************************
* ECHO AND LOG VARIABLES TO LISTING AND MSGLOG          *
*********************************************************/
 
call log_msg(4, build2("contrib_sys_disp => ",contrib_sys_disp), "PeriGenDbg")
call log_msg(4, build2("contrib_sys_cd => ",contrib_sys_cd), "PeriGenDbg")
call log_msg(4, build2("message_type => ",message_type), "PeriGenDbg")
call log_msg(4, build2("message_trigger => ",message_trigger), "PeriGenDbg")
call log_msg(4, build2("patient_id => ",patient_id), "PeriGenDbg")
call log_msg(4, build2("patient_id_ident => ",patient_id_ident), "PeriGenDbg")
call log_msg(4, build2("patient_id_alias_pool_cd => ",patient_id_alias_pool_cd), "PeriGenDbg")
call log_msg(4, build2("patient_id_alias_type_cd => ",patient_id_alias_type_cd), "PeriGenDbg")
call log_msg(4, build2("patient_id_contrib_sys_cd => ",patient_id_contrib_sys_cd), "PeriGenDbg")
call log_msg(4, build2("name_last => ",name_last), "PeriGenDbg")
call log_msg(4, build2("name_first => ",name_first), "PeriGenDbg")
call log_msg(4, build2("dob => ",dob), "PeriGenDbg") ;;; todo - fix dob
call log_msg(4, build2("sex_disp => ",sex_disp), "PeriGenDbg")
call log_msg(4, build2("sex_cd => ",sex_cd), "PeriGenDbg")
call log_msg(4, build2("account_nbr => ",account_nbr), "PeriGenDbg")
call log_msg(4, build2("account_nbr_ident => ",account_nbr_ident), "PeriGenDbg")
call log_msg(4, build2("account_nbr_alias_pool_cd => ",account_nbr_alias_pool_cd), "PeriGenDbg")
call log_msg(4, build2("account_nbr_alias_type_cd => ",account_nbr_alias_type_cd), "PeriGenDbg")
call log_msg(4, build2("account_nbr_contrib_sys_cd => ",account_nbr_contrib_sys_cd), "PeriGenDbg")
call log_msg(4, build2("person_id => ",person_id), "PeriGenDbg")
call log_msg(4, build2("encntr_id => ",encntr_id), "PeriGenDbg")
call log_msg(4, build2("observation_ident => ",observation_ident), "PeriGenDbg")
call log_msg(4, build2("observation_value => ",observation_value), "PeriGenDbg")
call log_msg(4, build2("cur_acuity_level_id => ",cur_acuity_level_id), "PeriGenDbg")
call log_msg(4, build2("acuity_level_id => ",acuity_level_id), "PeriGenDbg")
call log_msg(4, build2("tracking_id => ",tracking_id), "PeriGenDbg")
call log_msg(4, build2("tracking_checkin_id => ",tracking_checkin_id), "PeriGenDbg")
call log_msg(4, build2("tracking_ref_id => ",tracking_ref_id), "PeriGenDbg")
 
subroutine log_msg(loglevel, msg, descrip)
  call echo(msg)
  /* Initialize the System Event UAR */
  set hSys = 0
  set SysStat = 0
 
  call uar_SysCreateHandle(hSys,SysStat) ;create handle
 
  call uar_SysEvent(hSys, loglevel, descrip, msg)
  call uar_SysDestroyHandle(hSys)
end
 
subroutine read_cache(val1, val2, type)
  declare idx = i2
 
  if (type = "ALIAS")
    set pos = locateval(idx,1,size(cache->alias,5),val2,cache->alias[idx].alias
											   ,val1,cache->alias[idx].code_set)
 
    if (pos > 0)
      return (pos)
    else
      return (-1)
    endif
  elseif (type = "TRANS")
    set pos = locateval(idx,1,size(cache->esi_alias_trans,5),val1,cache->esi_alias_trans[idx].contrib_sys_cd
											   ,val2,cache->esi_alias_trans[idx].esi_alias_type)
 
    if (pos > 0)
      return (pos)
    else
      return (-1)
    endif
  endif
end
 
end
go
 
 
