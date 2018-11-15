/*~BB~************************************************************************
*
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*                                                                     *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       08/09/2017
          Source file name:   snsro_get_encounter
          Object name:        snsro_get_encounter
          Request #:       	  N/A
          Program purpose:    Returns individual encounter information.
          					  If a FIN NBR is passed in,  it will return encounter
          					  information for that given encounter.
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 08/09/17  DJP					Initial write
  001 03/21/18	RJC					Added version code and copyright block
***********************************************************************/
drop program snsro_get_encounter go
create program snsro_get_encounter

prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""
		, "Encounter ID:" = ""
		, "Include Insurance Plan" = 0
		, "Include Care Team" = 0
		, "Financial Number:" = ""
		, "Debug Flag" = 0
with OUTDEV, USERNAME, ENCNTR_ID, INC_HEALTHPLAN, INC_CARETEAM, FIN_NBR, DEBUG_FLAG

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record encounter_reply_out
record encounter_reply_out
(
 	1 encounter_id 				= f8	;e.encntr_id
	1 encounter_type_cd			= f8	;e.encntr_type_cd
	1 encounter_type_disp		= vc	;encounter type display
 	1 encounter_type_class_cd	= f8	;encounter_type_class_cd
 	1 encounter_type_class_disp	= vc	;encounter type class display
	1 encounter_status_cd		= f8
	1 encounter_status			= vc
	1 attending_provider		= vc
	1 attending_provider_id		= f8
	1 reason_for_visit     	    = vc
	1 admission_source_cd		= f8
	1 admission_source_disp		= vc
	1 admit_type_cd				= f8
	1 admit_type_disp			= vc
	1 med_service_cd            = f8
	1 med_service_disp          = vc
	1 arrive_date				= dq8	;e.admit_dt_tm
	1 discharge_date			= dq8	;e.discharge_dt_tm
	1 discharge_disposition_cd	= f8
	1 discharge_disposition_disp= vc
	1 fin_nbr					= vc	;ea.alias
	1 patient_id				= f8
	1 patient_location
		2  location_cd              = f8
		2  location_disp            = vc
		2  loc_bed_cd               = f8
		2  loc_bed_disp             = vc
		2  loc_building_cd			= f8
		2  loc_building_disp        = vc
		2  loc_facility_cd          = f8
		2  loc_facility_disp        = vc
		2  loc_nurse_unit_cd        = f8
		2  loc_nurse_unit_disp      = vc
		2  loc_room_cd              = f8
 		2  loc_room_disp            = vc
 		2  loc_temp_cd              = f8
 		2  loc_temp_disp            = vc
 	1 health_plans[*]   				;021
		2 plan_name						= vc
		2 plan_desc						= vc
		2 group_nbr						= vc
		2 group_name					= vc
		2 policy_nbr					= vc
		2 plan_class_cd 				= f8
		2 plan_class_disp				= vc
		2 plan_type_cd    				= f8
		2 plan_type_disp    			= vc
		2 member_nbr					= vc
		2 payor_name					= vc
		2 payor_phone					= vc
		2 payor_state					= vc
	 	2 subscriber_last_name			= vc
		2 subscriber_first_name			= vc
		2 subscriber_date_of_birth		= dq8
		2 subscriber_reltn_to_patient_cd = f8
		2 subscriber_reltn_to_patient_desc = vc
		2 patient_reltn_to_subscriber_cd = f8
		2 patient_reltn_to_subscriber_desc = vc
		2 priority_sequence 			= i2
		2 begin_effective_dt_tm			=dq8
		2 end_effective_dt_tm			=dq8
	1  patient_care_team[*]
	 2 provider_id					= f8
	 2 provider_name				= vc
	 2 reltn_type					= vc
	 2 from_date                 	= dq8
	 2 to_date                		= dq8
	 2 npi							= vc
	 2 phones[*]
	   3 phone_id					= f8
	   3 phone_type_cd				= f8
	   3 phone_type_disp			= vc
	   3 phone_type_mean			= vc
	   3 phone_num					= vc
	   3 sequence_nbr				= i2
  	1 audit
 		2 user_id					 = f8
		2 user_firstname			 = vc
	 	2 user_lastname				 = vc
	 	2 patient_id				 = f8
		 2 patient_firstname		 = vc
	 	2 patient_lastname			 = vc
	 	2 service_version			 = vc
	1 status_data
		2 status = c1
    	2 subeventstatus[1]
     		3 OperationName = c25
      		3 OperationStatus = c1
      		3 TargetObjectName = c25
      		3 TargetObjectValue = vc
      		3 Code = c4
      		3 Description = vc
)
 
 
set encounter_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 
declare sUserName  		= vc with protect, noconstant("")
declare dEncntrID		= f8 with protect, noconstant(0.0)
declare iIncHealthPlan	= i4 with protect, noconstant(0)
declare iIncCareteam	= i4 with protect, noconstant(0)
declare sFIN_NBR		= vc with protect, noconstant("")
declare iDebugFlag	= i4 with protect, noconstant(0)
declare dPersonID		= f8 with protect, noconstant(0.0)
declare dPrsnlID		= f8 with protect, noconstant(0.0)
declare Section_Start_Dt_Tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare dAttend			= f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare dNPI			= f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare dFIN			= f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare dPersonReltnType = f8 with protect, constant(uar_get_code_by("MEANING",351, "INSURED"))
declare dActiveStatusCd	= f8 with protect, constant(uar_get_code_by("MEANING",  48, "ACTIVE"))
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 		= trim($USERNAME, 3)
;set dEncntrID 		= cnvtint($ENCNTR_ID)
set iIncHealthPlan 	= cnvtint($INC_HEALTHPLAN)
set iIncCareteam 	= cnvtint($INC_CARETEAM)
set dPrsnlID 		= GetPrsnlIDfromUserName(sUserName)
set sFIN_NBR		= trim($FIN_NBR,3)
set iDebugFlag		= cnvtint($DEBUG_FLAG)
 
 
if (cnvtint($ENCNTR_ID) = 0.0)
	set dEncntrID = 0
else
	set dEncntrID = cnvtint($ENCNTR_ID)
endif
 
 
if (sFIN_NBR != "")
 
select * from encntr_alias ea
where ea.encntr_alias_type_cd = dFIN;1077.0
and sFIN_NBR like ea.alias
 
head ea.encntr_alias_id
dEncntrID = ea.encntr_id
 
endif
 
 call echo(build("iDebugFlag -->",iDebugFlag))
 
if(iDebugFlag > 0)
 
	call echo(build("sUserName  ->", sUserName))
 
	call echo(build("dEncntrID ->", dEncntrID))
	call echo(build("dPrsnlID ->", dPrsnlID))
 
	call echo(build("iIncHealthPlan ->",iIncHealthPlan))
	call echo(build("iIncCareTeam ->", iIncCareTeam))
	call echo(build("sFIN -->",sFIN_NBR))
	call echo(build("FIN---->: ", dFIN))
 	call echo(build("dAttend -->",dAttend))
 	call echo(build("NPI---->: ", dNPI))
 
endif
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounter(null)		= null with protect
declare GetHealthPlans(null)	= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUserName, dPersonID, encounter_reply_out, sVersion)   ;017      ;014
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "ENCOUNTER", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), encounter_reply_out)	;022
		go to EXIT_SCRIPT
 
	endif
 
if (dEncntrID > 0)
call GetEncounter(null)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
/******  Log reply to JSON file -BEGIN- *******/
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_encounter.json")
	call echo(build2("_file : ", _file))
	call echojson(encounter_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
 
    call echorecord(encounter_reply_out)
	set JSONout = CNVTRECTOJSON(encounter_reply_out)
	call echo(JSONout)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetEncounter(null)
;  Description: This will retrieve the specific encounter for a patient
;
**************************************************************************/
subroutine GetEncounter(null)
call echo("GetEncounter")
 
/*if (cnvtint($ENCNTR_ID) = 0.0)
	set dEncntrID = 0
else
	set dEncntrID = cnvtint($ENCNTR_ID)
endif
 
 
if (sFIN_NBR != "")
 
select * from encntr_alias ea
where ea.encntr_alias_type_cd = 1077.0
and sFIN_NBR like ea.alias
 
head ea.encntr_alias_id
dEncntrID = ea.encntr_id
 
endif
*/
 
select into "nl:"
	from encounter e
	,encntr_alias ea
	,encntr_prsnl_reltn epr
	,person p
 
 
plan e
where e.encntr_id = dEncntrID
 
join ea
where e.encntr_id = ea.encntr_id
and ea.encntr_alias_type_cd = dFIN; 1077.0 ;replace with dFIN
and ea.active_ind = 1
 
join epr
where e.encntr_id = epr.encntr_id
and epr.active_ind = 1
and epr.encntr_prsnl_r_cd = dAttend
 
join p
where epr.prsnl_person_id = p.person_id
 
 
 
 
head e.encntr_id
 
	encounter_reply_out->encounter_id = e.encntr_id
	encounter_reply_out->encounter_type_cd = e.encntr_type_cd
	encounter_reply_out->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
	encounter_reply_out->encounter_type_class_cd = e.encntr_type_class_cd
	encounter_reply_out->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
	encounter_reply_out->encounter_status_cd = e.encntr_status_cd
	encounter_reply_out->encounter_status = uar_get_code_display(e.encntr_status_cd)
	encounter_reply_out->attending_provider = p.name_full_formatted
	encounter_reply_out->attending_provider_id = epr.prsnl_person_id
	encounter_reply_out->reason_for_visit = e.reason_for_visit
	encounter_reply_out->admission_source_cd = e.admit_src_cd
	encounter_reply_out->admission_source_disp = uar_get_code_display(e.admit_src_cd)
	encounter_reply_out->admit_type_cd = e.admit_type_cd
	encounter_reply_out->admit_type_disp = uar_get_code_display(e.admit_type_cd)
	encounter_reply_out->med_service_cd = e.med_service_cd
	encounter_reply_out->med_service_disp = uar_get_code_display(e.med_service_cd)
	encounter_reply_out->arrive_date = e.arrive_dt_tm
	if (e.arrive_dt_tm is null)
			encounter_reply_out->arrive_date = e.reg_dt_tm
	endif
	encounter_reply_out->discharge_date = e.disch_dt_tm
	encounter_reply_out->discharge_disposition_cd = e.disch_disposition_cd
	encounter_reply_out->discharge_disposition_disp = uar_get_code_display(e.disch_disposition_cd)
	encounter_reply_out->fin_nbr = ea.alias
	encounter_reply_out->patient_id = e.person_id
	encounter_reply_out->patient_location.location_cd = e.location_cd
	encounter_reply_out->patient_location.location_disp = uar_get_code_display(e.location_cd)
	encounter_reply_out->patient_location.loc_bed_cd = e.loc_bed_cd
	encounter_reply_out->patient_location.loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
	encounter_reply_out->patient_location.loc_building_cd = e.loc_building_cd
	encounter_reply_out->patient_location.loc_building_disp = uar_get_code_display(e.loc_building_cd)
	encounter_reply_out->patient_location.loc_facility_cd = e.loc_facility_cd
	encounter_reply_out->patient_location.loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
	encounter_reply_out->patient_location.loc_nurse_unit_cd = e.loc_nurse_unit_cd
	encounter_reply_out->patient_location.loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
	encounter_reply_out->patient_location.loc_room_cd = e.loc_room_cd
	encounter_reply_out->patient_location.loc_room_disp = uar_get_code_display(e.loc_room_cd)
	encounter_reply_out->patient_location.loc_temp_cd = e.loc_temp_cd
	encounter_reply_out->patient_location.loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
 
with nocounter
 
 
 
if(iIncCareteam > 0)
 
  set eReltnCnt = 0
 
  select into "nl:"
 
    epr.*, c.code_set
 
  from encntr_prsnl_reltn  epr
  , code_value c
  , prsnl p
  , phone ph
  , prsnl_alias pra
 
  plan epr
 
  where epr.active_ind = 1  and epr.encntr_id = dEncntrID
 
  join p
 
  where p.person_id = epr.prsnl_person_id
 
 join c
 
  where epr.encntr_prsnl_r_cd = c.code_value
 
  join pra
 
  where pra.person_id = outerjoin(p.person_id)
  and pra.prsnl_alias_type_cd = outerjoin(dNPI)
 
 
 
 join ph
  where ph.parent_entity_id = outerjoin(p.person_id)
  		and ph.parent_entity_name = outerjoin("PERSON")
 		and ph.active_ind = outerjoin(1)
	  	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
	   	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
  head report
 
    eReltnCnt = 0
    ePhCnt = 0	/*012*/
 
  head epr.encntr_prsnl_reltn_id
 
  	ePhCnt = 0	/*012*/
 
	if (c.code_set =  333)
 
		eReltnCnt = eReltnCnt + 1
 
 		/*stat = alterlist(encounter_reply_out->patient_care_team, 10)
 
	    if (mod(eReltnCnt, 5) = 1)
 
	       stat = alterlist(encounter_reply_out->patient_care_team, eReltnCnt + 4)
 
	    endif */
 		stat = alterlist(encounter_reply_out->patient_care_team,eReltnCnt)
		encounter_reply_out->patient_care_team[eReltnCnt]->reltn_type = uar_get_code_display (epr.encntr_prsnl_r_cd)
 		encounter_reply_out->patient_care_team[eReltnCnt]->provider_id = p.person_id
 		encounter_reply_out->patient_care_team[eReltnCnt]->provider_name = p.name_full_formatted
		encounter_reply_out->patient_care_team[eReltnCnt]->from_date = epr.beg_effective_dt_tm
		encounter_reply_out->patient_care_team[eReltnCnt]->to_date = epr.end_effective_dt_tm
 		encounter_reply_out->patient_care_team[eReltnCnt]->npi = pra.alias
 	endif
 
 
 
 	head ph.phone_id
 	if (ph.phone_id > 0)
	  	ePhCnt = ePhCnt + 1
 		call echo(build("PHONE CNT: ",ePhCnt))
	    stat = alterlist(encounter_reply_out->patient_care_team[eReltnCnt]->phones, ePhCnt)
 
 
 
	  	encounter_reply_out->patient_care_team[eReltnCnt]->phones[ePhCnt]->phone_id = ph.phone_id
		encounter_reply_out->patient_care_team[eReltnCnt]->phones[ePhCnt]->phone_type_cd = ph.phone_type_cd
	 	encounter_reply_out->patient_care_team[eReltnCnt]->phones[ePhCnt]->phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
	  	encounter_reply_out->patient_care_team[eReltnCnt]->phones[ePhCnt]->phone_num = ph.phone_num
   	  	encounter_reply_out->patient_care_team[eReltnCnt]->phones[ePhCnt]->sequence_nbr = ph.phone_type_seq
	endif
 
 
  with nocounter
 
  ;set stat = alterlist(encounter_reply_out->patient_care_team, eReltnCnt)
 
endif
 
if(iIncHealthPlan > 0 )
 
declare iHP_cnt				= i4 with protect, noconstant(0)
 
	SELECT INTO "nl:"
FROM
	encntr_plan_reltn   eplr
	, health_plan   HP
	, encntr_person_reltn   epr
	, person   p
	, organization   o
	, address   ad
	, phone   ph
 
plan eplr
		where eplr.encntr_id = dEncntrID
		and eplr.active_ind = 1
		and eplr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and eplr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	join HP
		 where HP.health_plan_id = eplr.health_plan_id
			and HP.active_ind = 1
			and HP.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and HP.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join epr
		where epr.person_reltn_type_cd = dPersonReltnType;1158.0
		and epr.related_person_id = eplr.person_id
		and epr.encntr_id = eplr.encntr_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 		and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
 	join p
 	where epr.related_person_id = p.person_id
 
	join o
 	  where o.organization_id = outerjoin(eplr.organization_id)
 	  and o.active_ind = outerjoin(1)
 	  and o.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	  and o.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 	join ad
 		where ad.parent_entity_id = outerjoin(o.organization_id)
 		and ad.parent_entity_name = outerjoin("ORGANIZATION")
 		and ad.active_ind = outerjoin(1)
 		and ad.active_status_cd = outerjoin(dActiveStatusCd); 188.0
 		and ad.address_type_seq <= outerjoin(1)
 		and ad.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ad.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 	join ph
 	 	where ph.parent_entity_id = outerjoin(o.organization_id)
 	 	and ph.parent_entity_name = outerjoin("ORGANIZATION")
 	 	and ph.active_ind = outerjoin(1)
 	 	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 
 
 
 
ORDER BY
	eplr.priority_seq
	, HP.plan_name
 
head eplr.priority_seq
 ;iHP_cnt = 0
;detail
		iHP_cnt =  iHP_cnt + 1
		stat = alterlist(encounter_reply_out->health_plans, iHP_cnt)
 
 
		encounter_reply_out->health_plans[iHP_cnt]->plan_name		= HP.plan_name
		encounter_reply_out->health_plans[iHP_cnt]->plan_desc		= HP.plan_desc
		encounter_reply_out->health_plans[iHP_cnt]->group_nbr		= eplr.group_nbr
		encounter_reply_out->health_plans[iHP_cnt]->group_name	= eplr.group_name
		encounter_reply_out->health_plans[iHP_cnt]->policy_nbr	=   eplr.policy_nbr   ;HP.policy_nbr
		encounter_reply_out->health_plans[iHP_cnt]->plan_type_cd = HP.plan_type_cd
		encounter_reply_out->health_plans[iHP_cnt]->plan_type_disp = uar_get_code_display(HP.plan_type_cd)
		encounter_reply_out->health_plans[iHP_cnt]->plan_class_cd	= HP.plan_class_cd
		encounter_reply_out->health_plans[iHP_cnt]->plan_class_disp = uar_get_code_display(HP.plan_class_cd)
		encounter_reply_out->health_plans[iHP_cnt]->member_nbr = eplr.member_nbr
 		encounter_reply_out->health_plans[iHP_cnt].payor_name = o.org_name
 		encounter_reply_out->health_plans[iHP_cnt].payor_phone = ph.phone_num
 		if (ad.state_cd = 0.0)
 			encounter_reply_out->health_plans[iHP_cnt].payor_state = trim(ad.state)
 		else
 			encounter_reply_out->health_plans[iHP_cnt].payor_state = uar_get_code_display(ad.state_cd)
 		endif
		encounter_reply_out->health_plans[iHP_cnt].subscriber_last_name = p.name_last_key
		encounter_reply_out->health_plans[iHP_cnt].subscriber_first_name = p.name_first_key
		encounter_reply_out->health_plans[iHP_cnt].subscriber_date_of_birth = p.birth_dt_tm
		encounter_reply_out->health_plans[iHP_cnt].subscriber_reltn_to_patient_cd = epr.person_reltn_cd
		encounter_reply_out->health_plans[iHP_cnt].subscriber_reltn_to_patient_desc =
			uar_get_code_display(epr.person_reltn_cd)
		encounter_reply_out->health_plans[iHP_cnt].patient_reltn_to_subscriber_cd = epr.related_person_reltn_cd
		encounter_reply_out->health_plans[iHP_cnt].patient_reltn_to_subscriber_desc =
			uar_get_code_display(epr.related_person_reltn_cd)
		encounter_reply_out->health_plans[iHP_cnt].priority_sequence = eplr.priority_seq
		encounter_reply_out->health_plans[iHP_cnt].begin_effective_dt_tm = eplr.beg_effective_dt_tm
		encounter_reply_out->health_plans[iHP_cnt].end_effective_dt_tm = eplr.end_effective_dt_tm
 
WITH nocounter
 
endif
 
 if (curqual = 0)
 
 call ErrorHandler2("EXECUTE", "F", "ENCOUNTER", "No Encounter Found",
	"9999", "No Encounter Found", encounter_reply_out)
	go to EXIT_SCRIPT
 else
 
 
    call ErrorHandler("EXECUTE", "S", "ENCOUNTERS", "Success returned Encounter",
    encounter_reply_out)
 
endif
 
end ; end subroutine GetEncounter
 
end
 
go
set trace notranslatelock go
