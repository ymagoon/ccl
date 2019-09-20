/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  ym_hcm_rule_at_risk
 *  Object name:  hcm_rule_at_risk
 *  Description:  Identify if a patient is at risk by defining at risk plans and calling hcm_get_at_risk_indicator
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
drop program ym_hcm_rule_at_risk go
create program ym_hcm_rule_at_risk

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

call echorecord(at_risk_plans)

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
* TESTING *
*************************************************************************/
;if they are not in an at risk plan, do nothing
;set most_recent_result = null
;set stat = alterlist(demographics_reply->health_plans,0)

;if they are in an at risk plan, write the most recent active plan name to the CE table
;set most_recent_result = null
;set demographics_reply->health_plans[1].begin_iso_dt_tm = "2012-12-05T05:00:00Z"

;if there is a recent result and they are in the same health plan
;set demographics_reply->health_plans[1].begin_iso_dt_tm = "2012-12-05T05:00:00Z"

;if there is a recent result and they are in a different health plan
;no modification needed Mock A -> B

;if the patient does not have an at risk plan anymore, write an asterisk (*)
;set stat = alterlist(demographics_reply->health_plans,0)

;if the patient does not have an at risk plan (* is written to CE), but now does
;no modification needed Mock * -> B

;set most_recent_result = "test"
;set stat = alterlist(demographics_reply->health_plans,0)

/*************************************************************************
* Compare at risk plans to active health plans and find most recent plan *
*************************************************************************/
set active_hp_cnt = size(demographics_reply->health_plans, 5)

call echo(build("most_recent_result=",most_recent_result))
call echorecord(demographics_reply)

for (idx = 1 to active_hp_cnt)
  set end_iso_dt_tm = demographics_reply->health_plans[idx].end_iso_dt_tm
  set active_hp_plan_type = demographics_reply->health_plans[idx].plan_identifiers.type
  set active_hp_plan_value = demographics_reply->health_plans[idx].plan_identifiers.value
  set num = 0
  
  ;only check current health plans
  if (end_iso_dt_tm = null or cnvtIsoDtTmToDQ8(end_iso_dt_tm) > cnvtdatetime(curdate,curtime3))
    ;find matching at risk health plans that match active patient health plans
    set pos = locateval(num, 1, risk_hp_cnt, active_hp_plan_value, at_risk_plans->health_plans[num].plan_identifiers.value
    	, active_hp_plan_type, at_risk_plans->health_plans[num].plan_identifiers.type)
    
    ;if a match is found
    if (pos > 0)
      set at_risk_ind = 1
      
      ;only save the plan with the most recent begin_iso_dt_tm 
      if (cnvtIsoDtTmToDQ8(demographics_reply->health_plans[idx].begin_iso_dt_tm) > cnvtIsoDtTmToDQ8(health_plan_begin_iso_dt_tm))
        set health_plan_name = demographics_reply->health_plans[idx].plan_name
        set health_plan_begin_iso_dt_tm = demographics_reply->health_plans[idx].begin_iso_dt_tm
      endif
    endif
  endif
endfor

call echo(build("plan_name=",health_plan_name))

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
  set log_misc1 = build(char(34),health_plan_name,char(34))
  call echo(build2("Patient has a risk plan = ", health_plan_name))
elseif (most_recent_result != null and at_risk_ind = 1)
  if (most_recent_result = health_plan_name) ;if they are the same, do nothing
    set retval = 0
    set log_message = build2("Patient's health plan has not changed = ", health_plan_name)
    call echo(build2("Patient's health plan has not changed = ", health_plan_name))
  else ;if they are different, write the new health plan name to the CE table
    set retval = 100
    set log_message = build2("Patient's health plan has changed old = ", most_recent_result, " new = ", health_plan_name)
    set log_misc1 = build(char(34),health_plan_name,char(34))
    call echo(build2("Patient's health plan has changed old = ", most_recent_result, " new = ", health_plan_name))
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
 
