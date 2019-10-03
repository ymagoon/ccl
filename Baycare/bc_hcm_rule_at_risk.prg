/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  bc_hcm_rule_at_risk
 *  Object name:  bc_hcm_rule_at_risk
 *  Description:  Identify if a patient is at risk by defining at risk plans and calling hcm_get_hi_person_demog
 *                to determine if the patient has an at risk health plan
 *  Testing: 	  execute bc_hcm_rule_at_risk go
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Creation Date:  09/18/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Engineer           Description & Requestor Information
 *  --- --------   -------------------- ----------------------------------------------
 *  000   09/18/19  Yitzhak Magoon      Initial Release
 *  ---------------------------------------------------------------------------------------------
*/
drop program bc_hcm_rule_at_risk go
create program bc_hcm_rule_at_risk
 
record at_risk_plans (
  1 health_plans[*]
    2 plan_name = vc
    2 plan_identifiers[1]
      3 value = vc
      3 type = vc
)
 
record demographics (
  1 person_id = f8
  1 hi_person_identifier = vc
  1 demographics_test_uri = vc
  1 benefit_coverage_source_type = vc
)
 
record demographics_reply (
  1 person_id = f8
  1 hi_person_identifier = vc
  1 given_names [*]
    2 given_name = vc
  1 family_names [*]
    2 family_name = vc
  1 full_name = vc
  1 date_of_birth = vc
  1 gender_details
    2 id = vc
    2 coding_system_id = vc
  1 address
    2 street_addresses [*]
      3 street_address = vc
    2 type
      3 id = vc
      3 coding_system_id = vc
    2 city = vc
    2 state_or_province_details
      3 id = vc
      3 coding_system_id = vc
    2 postal_code = vc
    2 county_or_parish = vc
    2 county_or_parish_details
      3 id = vc
      3 coding_system_id = vc
    2 country_details
      3 id = vc
      3 coding_system_id = vc
  1 telecoms [*]
    2 preferred = vc
    2 number = vc
    2 country_code = vc
    2 type
      3 id = vc
      3 coding_system_id = vc
      3 display = vc
  1 email_addresses [*]
    2 address = vc
    2 type
      3 id = vc
      3 coding_system_id = vc
  1 health_plans [* ]
    2 mill_health_plan_id = f8
    2 payer_name = vc
    2 plan_name = vc
    2 begin_iso_dt_tm = vc
    2 end_iso_dt_tm = vc
    2 member_nbr = vc
    2 line_of_business = vc
    2 source
      3 contributing_organization = vc
      3 partition_description = vc
      3 type = vc
    2 plan_identifiers [* ]
      3 value = vc
      3 type = vc
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
/*************************************************************************
*  Populate at_risk_plans record structure                               *
*************************************************************************/
set stat = alterlist(at_risk_plans->health_plans, 24)
 
set at_risk_plans->health_plans[1]->plan_name = "*BPP ACO MSSP"
set at_risk_plans->health_plans[1]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[1]->plan_identifiers[1]->value = "004000000000500000009990000000999"
set at_risk_plans->health_plans[2]->plan_name = "*BPP Aetna Adv"
set at_risk_plans->health_plans[2]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[2]->plan_identifiers[1]->value = "10021"
set at_risk_plans->health_plans[3]->plan_name = "*BPP Aetna Adv"
set at_risk_plans->health_plans[3]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[3]->plan_identifiers[1]->value = "10023"
set at_risk_plans->health_plans[4]->plan_name = "*BPP Aetna FI"
set at_risk_plans->health_plans[4]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[4]->plan_identifiers[1]->value = "10000"
set at_risk_plans->health_plans[5]->plan_name = "*BPP Aetna FI"
set at_risk_plans->health_plans[5]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[5]->plan_identifiers[1]->value = "10002"
set at_risk_plans->health_plans[6]->plan_name = "*BPP Aetna FI"
set at_risk_plans->health_plans[6]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[6]->plan_identifiers[1]->value = "10001"
set at_risk_plans->health_plans[7]->plan_name = "*BPP Aetna SI"
set at_risk_plans->health_plans[7]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[7]->plan_identifiers[1]->value = "10018"
set at_risk_plans->health_plans[8]->plan_name = "*BPP Aetna SI"
set at_risk_plans->health_plans[8]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[8]->plan_identifiers[1]->value = "10020"
set at_risk_plans->health_plans[9]->plan_name = "*BPP Aetna SI"
set at_risk_plans->health_plans[9]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[9]->plan_identifiers[1]->value = "10019"
set at_risk_plans->health_plans[10]->plan_name = "*BPP BCBS Commercial"
set at_risk_plans->health_plans[10]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[10]->plan_identifiers[1]->value = "10003"
set at_risk_plans->health_plans[11]->plan_name = "*BPP BCBS Commercial"
set at_risk_plans->health_plans[11]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[11]->plan_identifiers[1]->value = "10005"
set at_risk_plans->health_plans[12]->plan_name = "*BPP BCBS Commercial"
set at_risk_plans->health_plans[12]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[12]->plan_identifiers[1]->value = "10004"
set at_risk_plans->health_plans[13]->plan_name = "*BPP BCBS Medicare"
set at_risk_plans->health_plans[13]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[13]->plan_identifiers[1]->value = "10006"
set at_risk_plans->health_plans[14]->plan_name = "*BPP BCBS Medicare"
set at_risk_plans->health_plans[14]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[14]->plan_identifiers[1]->value = "10008"
set at_risk_plans->health_plans[15]->plan_name = "*BPP BCBS Medicare"
set at_risk_plans->health_plans[15]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[15]->plan_identifiers[1]->value = "10007"
set at_risk_plans->health_plans[16]->plan_name = "*BPP Cigna BC"
set at_risk_plans->health_plans[16]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[16]->plan_identifiers[1]->value = "10012"
set at_risk_plans->health_plans[17]->plan_name = "*BPP Cigna BC"
set at_risk_plans->health_plans[17]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[17]->plan_identifiers[1]->value = "10011"
set at_risk_plans->health_plans[18]->plan_name = "*BPP Cigna East"
set at_risk_plans->health_plans[18]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[18]->plan_identifiers[1]->value = "10014"
set at_risk_plans->health_plans[19]->plan_name = "*BPP Cigna East"
set at_risk_plans->health_plans[19]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[19]->plan_identifiers[1]->value = "10013"
set at_risk_plans->health_plans[20]->plan_name = "*BPP UHC"
set at_risk_plans->health_plans[20]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[20]->plan_identifiers[1]->value = "10015"
set at_risk_plans->health_plans[21]->plan_name = "*BPP UHC"
set at_risk_plans->health_plans[21]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[21]->plan_identifiers[1]->value = "10017"
set at_risk_plans->health_plans[22]->plan_name = "*BPP UHC"
set at_risk_plans->health_plans[22]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[22]->plan_identifiers[1]->value = "10016"
set at_risk_plans->health_plans[23]->plan_name = "BayCarePlus Complete - Medical"
set at_risk_plans->health_plans[23]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[23]->plan_identifiers[1]->value = "H2235001_M"
set at_risk_plans->health_plans[24]->plan_name = "BayCarePlus Rewards - Medical"
set at_risk_plans->health_plans[24]->plan_identifiers[1]->type = "EDI"
set at_risk_plans->health_plans[24]->plan_identifiers[1]->value = "H2235002_M"
 
;this makes testing dynamic. We only want to define mock plans if we are not in p30.
if (curdomain != "P30")
  set hp_cnt = size(at_risk_plans->health_plans,5)
  set stat = alterlist(at_risk_plans->health_plans, hp_cnt + 3) ; add one for each mock health plan
 
  set at_risk_plans->health_plans[hp_cnt + 1]->plan_name = "Mock Health Plan A"
  set at_risk_plans->health_plans[hp_cnt + 1]->plan_identifiers[1]->type = "HPID"
  set at_risk_plans->health_plans[hp_cnt + 1]->plan_identifiers[1]->value = "HPVAL1"
  set at_risk_plans->health_plans[hp_cnt + 2]->plan_name = "Mock Health Plan B"
  set at_risk_plans->health_plans[hp_cnt + 2]->plan_identifiers[1]->type = "HPID"
  set at_risk_plans->health_plans[hp_cnt + 2]->plan_identifiers[1]->value = "HPVAL2"
  set at_risk_plans->health_plans[hp_cnt + 3]->plan_name = "Mock Health Plan D"
  set at_risk_plans->health_plans[hp_cnt + 3]->plan_identifiers[1]->type = "HPID"
  set at_risk_plans->health_plans[hp_cnt + 3]->plan_identifiers[1]->value = "HPVAL4"
endif
 
;call echorecord(at_risk_plans)
 
/*********************** END POPULATING AT_RISK_PLANS *****************************/
 
/*************************************************************************
*  Variable Declaration                                                  *
*************************************************************************/
declare in_personid = f8
declare source_type = vc with protect, noconstant("ENROLLMENT")
declare risk_hp_cnt = i2 with protect, noconstant(size(at_risk_plans->health_plans,5))
declare at_risk_ind = i2 with protect, noconstant(0)
declare health_plan_name = vc
declare health_plan_begin_iso_dt_tm = vc
declare active_hp_plan_type = vc
declare active_hp_plan_value = vc
declare total_active_hp = i2
 
declare at_risk_cd = f8 with protect, noconstant(uar_get_code_by("DISPLAYKEY",72,"ATRISKINDICATORBANNER"))
declare ptcancelcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"CANCELLED"))
declare ptinerrorspacecd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"IN ERROR"))
declare ptinerrnomutcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERRNOMUT"))
declare ptinerrnoviewcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERRNOVIEW"))
declare ptinerrorcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERROR"))
declare ptnotdonecd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"NOT DONE"))
declare ptrejectcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"REJECTED"))
declare ptplaceholder = f8 with protect, noconstant(uar_get_code_by("MEANING",53,"PLACEHOLDER"))
 
declare most_recent_result = vc
 
if (validate(link_personid,0) = 0)
  set in_personid = $1 ;allow the person_id to be passed in via CCL
  call echo(build2("Script called from CCL, person_id = ", in_personid))
else
  set in_personid = link_personid
endif
 
/***************************************************************************
* Gather Most Recent Result for At Risk Indicator Banner on CLINICAL_EVENT *
***************************************************************************/
 
select into "nl:"
from
  clinical_event ce
where ce.person_id = in_personid
  and ce.event_cd = at_risk_cd
  and ce.valid_until_dt_tm >= cnvtdatetime("31-DEC-2100 00:00:00")
  and ce.event_end_dt_tm > cnvtdatetime ("01-JAN-1900 00:00:00")
  and ce.view_level > 0
  and ce.publish_flag = 1
  and ce.result_status_cd not in (ptcancelcd
    							  , ptinerrorspacecd
    							  , ptinerrnomutcd
    							  , ptinerrnoviewcd
    							  , ptinerrorcd
    							  , ptnotdonecd
    							  , ptrejectcd)
  and ce.event_class_cd != ptplaceholder
order by
  ce.valid_from_dt_tm desc
detail
  most_recent_result = ce.result_val
with maxrec = 1
 
/*************************************************************************
* Gather Active Patient Health Plans                                     *
*************************************************************************/
set demographics->person_id = in_personid
set demographics->benefit_coverage_source_type = source_type
 
if (curdomain != "P30")
  set demographics->demographics_test_uri =
  "https://test.record.healtheintent.com/mock_api/populations/ab9176be-4303-4e6c-aa8d-219d31e29d76/people/1"
endif
 
execute hcm_get_hi_person_demog with replace("REQUEST", demographics), replace("REPLY", demographics_reply)
 
/*************************************************************************
* TESTING                                                                *
*************************************************************************/
 
/*
  SCENARIO 1: If they are not in an at risk plan and they do not have a plan.
  If there are no records on CE table for patient, you do not need to set most_recent_result to null
*/
;set most_recent_result = null
;set stat = alterlist(demographics_reply->health_plans,0)
 
/*
  SCENARIO 2: Net new patient with a single health plan
  If there are no records on CE table for patient, you do not need to set most_recent_result to null
  This is going to take the first health plan on the patient (not necessarily the most recent)
*/
;set most_recent_result = null
;set stat = alterlist(demographics_reply->health_plans,1)
 
/*
  SCENARIO 3: Net new patient with more than one health plan
  If there are no records on CE table for patient, you do not need to set most_recent_result to null
*/
;set most_recent_result = null
 
/*
  SCENARIO 4: Existing patient with more than one health plan (same plan as scenario 3)
  Nothing needs to be commented out. This scenario should not write anything to CE table.
*/
 
/*
  SCENARIO 5: Existing patient with a single health plan
  This is going to take the first health plan on the patient (not necessarily the most recent)
*/
;set stat = alterlist(demographics_reply->health_plans,1)
 
/*
  SCENARIO 6: Existing patient that no longer has a health plan
  This will write an asterisk to the CE table.
*/
;set stat = alterlist(demographics_reply->health_plans,0)
 
/*
  SCENARIO 7: Existing patient with health plan removed; still no longer has a health plan
  This scenario will work only if an asterisk is written to the CE table.
  You can uncomment the first line to force the test to think the most recent result is an asterisk
  If the most recent result is an asterisk, you do not need to uncomment line #1
*/
;set most_recent_result = "*"
;set stat = alterlist(demographics_reply->health_plans,0)
 
/*************************************************************************
* Compare at risk plans to active health plans and find most recent plan *
*************************************************************************/
set active_hp_cnt = size(demographics_reply->health_plans, 5)
 
call echorecord(demographics_reply)

call echo(build("most_recent_result=",most_recent_result))
call echo(build("active_hp_cnt=",active_hp_cnt))
 
for (idx = 1 to active_hp_cnt)
  if (demographics_reply->health_plans[idx].end_iso_dt_tm = null)
    set end_iso_dt_tm = ""
  else
    set end_iso_dt_tm = demographics_reply->health_plans[idx].end_iso_dt_tm
  endif
  
  /* 
    Sometimes there may be dummy data where the end_iso_dt_tm makes the plan look active even though there isn't a plan name
    or any plan identifiers. The code below skips processing of the dummy data using ident_ind variable.
  */
  set ident_ind = 1
  
  if (size(demographics_reply->health_plans[idx].plan_identifiers,5) > 1)
    set active_hp_plan_type = demographics_reply->health_plans[idx].plan_identifiers.type
    set active_hp_plan_value = demographics_reply->health_plans[idx].plan_identifiers.value
  else
    set ident_ind = 0
  endif
  
  set num = 0
  
  call echo(build("*** hp ",idx, " ***"))
  call echo(build("active_hp_plan_type=",active_hp_plan_type))
  call echo(build("active_hp_plan_value=",active_hp_plan_value))
  call echo(build("end_iso_dt_tm=",end_iso_dt_tm))
 
  ;only check current health plans that are not dummy data
  if ((end_iso_dt_tm = null or cnvtIsoDtTmToDQ8(end_iso_dt_tm) > cnvtdatetime(curdate,curtime3)) and ident_ind = 1)
    call echo("end_iso_dt_tm is either null or greater than current date time")
    
    ;find matching at risk health plans that match active patient health plans
    set pos = locateval(num, 1, risk_hp_cnt, active_hp_plan_value, at_risk_plans->health_plans[num].plan_identifiers.value
    	, active_hp_plan_type, at_risk_plans->health_plans[num].plan_identifiers.type)
    
    call echo(build("pos=",pos))
    ;if a match is found
    if (pos > 0)
      set at_risk_ind = 1
      set total_active_hp = total_active_hp + 1
      
      ;only save the plan with the most recent begin_iso_dt_tm
      if (cnvtIsoDtTmToDQ8(demographics_reply->health_plans[idx].begin_iso_dt_tm) > cnvtIsoDtTmToDQ8(health_plan_begin_iso_dt_tm))
        set health_plan_name = demographics_reply->health_plans[idx].plan_name
        set health_plan_begin_iso_dt_tm = demographics_reply->health_plans[idx].begin_iso_dt_tm
      endif
    endif
  endif
endfor
 
call echo(build("plan_name=",health_plan_name))
call echo(build("total_active_hp=",total_active_hp))
 
/*************************************************************************
* Based on most recent result and at risk plan, determine what to do     *
*************************************************************************/
 
;if they are not in an at risk plan, do nothing
if (most_recent_result = null and at_risk_ind = 0)
  set retval = 0
  set log_message = "Patient has no risk plan"
  call echo("Patient has no risk plan")
;if they are in an at risk plan, write the most recent active plan name to the CE table
elseif (most_recent_result = null and at_risk_ind = 1)
  set retval = 100
  set log_message = build2("Patient has a risk plan = ", health_plan_name)
 
  ;if there is more than one active health plan write an ellipsis after the health plan name
  if (total_active_hp > 1)
    set log_misc1 = build(char(34),health_plan_name,"...",char(34))
  else
    set log_misc1 = build(char(34),health_plan_name,char(34))
  endif
 
  call echo(build2("Patient has a risk plan = ", log_misc1))
elseif (most_recent_result != null and at_risk_ind = 1)
  ;if there is more than one health plan, truncate the result if it contains an ellipsis
  if (total_active_hp > 1)
    set most_recent_result = replace(most_recent_result,"...","")
    call echo(build("most recent result after truncation=",most_recent_result))
  endif
 
  if (most_recent_result = health_plan_name) ;if they are the same, do nothing
    set retval = 0
    set log_message = build2("Patient's health plan has not changed = ", health_plan_name)
    call echo(build2("Patient's health plan has not changed = ", health_plan_name))
  else ;if they are different, write the new health plan name to the CE table
    set retval = 100
    set log_message = build2("Patient's health plan has changed old = ", most_recent_result, " new = ", health_plan_name)
 
    ;if there is more than one active health plan write an ellipsis after the health plan name
    if (total_active_hp > 1)
      set log_misc1 = build(char(34),health_plan_name,"...",char(34))
    else
      set log_misc1 = build(char(34),health_plan_name,char(34))
    endif
 
    call echo(build2("Patient's health plan has changed old = ", most_recent_result, " new = ", log_misc1))
  endif
elseif (most_recent_result != null and at_risk_ind = 0)
;if the patient's risk plan was removed and the patient still does not have a risk plan
  if (most_recent_result = char(42))
    set retval = 0
    set log_message = build2("Patient's health plan was formerly removed and still does not have one")
    call echo(build("Patient does not have a health plan"))
;if the patient does not have an at risk plan anymore, but did before
  else
    set retval = 100
    set log_message = build2("Patient no longer has a risk plan. Former plan = ", most_recent_result)
    set log_misc1 = build(char(34),"*",char(34))
    call echo(build2("Patient no longer has a risk plan. Former plan = ", most_recent_result))
  endif
endif
 
subroutine cnvtIsoDtTmToDQ8(isoDtTmStr)
	declare convertedDq8 = dq8 with protect, noconstant(0)
 
	set convertedDq8 =
		cnvtdatetimeutc2(substring(1,10,isoDtTmStr),"YYYY-MM-DD",substring(12,8,isoDtTmStr),"HH:MM:SS", 4, CURTIMEZONEDEF)
 
	return(convertedDq8)
end  ;subroutine cnvtIsoDtTmToDQ8
 
end
go
; execute ym_hcm_rule_at_risk 27686542 go
 
 
