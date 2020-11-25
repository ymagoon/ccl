/*~BB~***********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:    snsro_get_pop_enc_ins.prg
      Object name:         vigilanz_get_pop_enc_ins
      Program purpose:    Get Population Encounter Insurances
      Tables read:        MANY
      Tables updated:     NA
      Executing from:     mPages Discern Web Service
      Special Notes:        NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                                    *
*********************************************************************************
 Mod Date     Engineer              Comment                                     *
 --- -------- -------------------   --------------------------------------------*
 001 04/23/20 DSH                   Initial Write
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_get_pop_enc_ins go
create program vigilanz_get_pop_enc_ins
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Beg Date:" = ""
	, "End Date:" = ""
	, "Facility Code List" = "" ; Comma delimited list of location codes
	, "Include Custom Fields:" = 0
	, "Debug Flag" = 0
	, "Time Max" = 3600
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, INC_CUSTOM_FIELDS, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
  go to exit_version
endif

/*************************************************************************
;DATA STRUCTURES
**************************************************************************/
free record pop_enc_ins_reply_out
record pop_enc_ins_reply_out (
  1 encounter_insurances[*]
    2 created_updated_date_time = dq8
    2 patient
      3 patient_id = f8
      3 display_name = vc
      3 last_name = vc
      3 middle_name = vc
      3 first_name = vc
      3 mrn = vc
      3 birth_date_time = dq8
      3 gender
        4 id = f8
        4 name = vc
      3 sdob = vc
      3 deceased_dt_tm = dq8
    2 encounter
      3 encounter_id = f8
      3 encounter_type
        4 id = f8
        4 name = vc
      3 patient_class
        4 id = f8
        4 name = vc
      3 encounter_date_time = dq8
      3 discharge_date_time = dq8
      3 financial_number = vc
      3 location
        4 hospital
          5 id = f8
          5 name = vc
        4 unit
          5 id = f8
          5 name = vc
        4 room
          5 id = f8
          5 name = vc
        4 bed
          5 id = f8
          5 name = vc
      3 insurance_plans[*]
        4 plan_name = vc
        4 plan_desc = vc
        4 group_nbr = vc
        4 group_name = vc
        4 policy_nbr = vc
        4 plan_class_cd = f8
        4 plan_class_disp = vc
        4 plan_type_cd = f8
        4 plan_type_disp = vc
        4 member_nbr = vc
        4 payor_name = vc
        4 payor_phone = vc
        4 payor_state = vc
        4 subscriber_last_name = vc
        4 subscriber_first_name = vc
        4 subscriber_date_of_birth = dq8
        4 subscriber_reltn_to_patient_cd = f8
        4 subscriber_reltn_to_patient_desc = vc
        4 patient_reltn_to_subscriber_cd = f8
        4 patient_reltn_to_subscriber_desc = vc
        4 priority_sequence = i4
        4 begin_effective_dt_tm = dq8
        4 end_effective_dt_tm = dq8
        4 insurance_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
        4 active_status_disp = vc
        4 active_status_prsnl_id = f8
        4 active_status_dt_tm = dq8
        4 data_status_cd = f8
        4 data_status_disp = vc
        4 data_status_prsnl_id = f8
        4 data_status_dt_tm = dq8
        4 ins_card_copied
          5 id = f8
          5 name = vc
        4 health_plan_id = f8
        4 eligibility_status
          5 id = f8
          5 name = vc
        4 subscriber_id = f8
        4 insured_card_name_first = vc
        4 insured_card_name_middle = vc
        4 insured_card_name_last = vc
        4 insured_card_name = vc
        4 subs_member_nbr = vc
        4 verify_status
          5 id = f8
          5 name = vc
        4 verify_source
          5 id = f8
          5 name = vc
        4 verify_prsnl_id = f8
        4 verify_dt_tm = dq8
        4 assign_benefits
          5 id = f8
          5 name = vc
        4 deduct_amt = f8
        4 deduct_remain_amt = f8
        4 deduct_inc_max_oop = f8
        4 copay_amt = f8
        4 copay_inc_max_oop = f8
        4 max_out_pckt_amt = f8
        4 fam_deduct_met_amt = f8
        4 subscriber_address
          5 address_id = f8
          5 address_type_cd = f8
          5 address_type_disp = vc
          5 address_type_mean = vc
          5 street_addr = vc
          5 street_addr2 = vc
          5 street_addr3 = vc
          5 city = vc
          5 state_cd = f8
          5 state_disp = vc
          5 state_mean = vc
          5 zipcode = vc
          5 country_cd = f8
          5 country_disp = vc
          5 county_cd = f8
          5 county_disp = vc
          5 sequence_nbr = i4
          5 end_effective_dt_tm = dq8
        4 subscriber_phones[*]
          5 phone_id = f8
          5 phone_type_cd = f8
          5 phone_type_disp = vc
          5 phone_type_mean = vc
          5 phone_num = vc
          5 sequence_nbr = i4
          5 extension = vc
          5 end_effective_dt_tm = dq8
          5 phone_format
            6 id = f8
            6 name = vc
      3 custom_fields[*]
        4 field
          5 id = f8
          5 name = vc
        4 responsevaluetext[*] = vc
        4 responsevaluecodes[*]
          5 id = f8
          5 name = vc
  1 audit
    2 user_id = f8
    2 user_firstname = vc
    2 user_lastname = vc
    2 patient_id = f8
    2 patient_firstname = vc
    2 patient_lastname = vc
    2 service_version = vc
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

free record location_filter
record location_filter (
  1 location_cnt = i4
  1 locations[*]
    2 facility_cd = f8
)

free record operations
record operations (
  1 total_time_in_seconds = f8
  1 combined_message = vc
  1 operation_cnt = i4
  1 operations[*]
    2 message = vc
    2 begin_dt_tm = dq8
    2 end_dt_tm = dq8
    2 time_in_seconds = f8
)

free record additional_insurance_data
record additional_insurance_data (
  1 insurance_plan_cnt = i4
  1 insurance_plans[*]
    2 encounter_insurance_idx = i4
    2 insurance_plan_idx = i4
    2 insurance_updt_dt_tm = dq8
    2 encntr_plan_reltn_id = f8
    2 health_plan_id = f8
    2 related_person_id = f8
    2 encntr_id = f8
    2 organization_id = f8
    2 person_plan_reltn_id = f8
)

/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common

/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000

; Constants
declare c_script_name = vc with protect, constant("vigilanz_get_pop_enc_ins")
declare c_error_handler = vc with protect, constant("GET POPULATION ENCOUNTER INSURANCES")
declare c_application_id = i4 with protect, constant(600005)
declare c_not_found = vc with protect, constant("<not_found>")
declare c_facility_meaning = vc with protect, constant("FACILITY")
declare c_timeout_threshold_in_seconds = i4 with protect, constant(115)
declare c_maximum_number_of_records = i4 with protect, constant(2000)
declare c_low_expand_value = i4 with protect, constant(0)
declare c_high_expand_value = i4 with protect, constant(2)

declare c_active_status_active_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_encounter_alias_type_mrn_cd = f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_encounter_alias_type_fin_cd = f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_person_relationship_type_insured_cd = f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_userdefined_info_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))

declare iIndex = i4 with protect, noconstant(0)
declare iStart = i4 with protect, noconstant(0)
declare iStop = i4 with protect, noconstant(0)
declare sLocationCd = vc with protect, noconstant("")
declare iLocationIndex = i4 with protect, noconstant(0)
declare iLocationSize = i4 with protect, noconstant(0)
declare iLocationIsFacility = i2 with protect, noconstant(0)
declare iOperationIndex = i4 with protect, noconstant(0)
declare iEncounterIndex = i4 with protect, noconstant(0)
declare iEncounterInsurancesIndex = i4 with protect, noconstant(0)
declare iCustomFieldIndex = i4 with protect, noconstant(0)
declare iTextValueIndex = i4 with protect, noconstant(0)
declare iCodifiedValueIndex = i4 with protect, noconstant(0)
declare iExpandValue = i2 with protect, noconstant(0)

/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
; Input
declare iDebugFlag = i2 with protect, noconstant(cnvtint($DEBUG_FLAG))
declare sUserName = vc with protect, noconstant(trim($USERNAME, 3))
declare sFromDate = vc with protect, noconstant(trim($BEG_DATE, 3))
declare qFromDateTime = dq8 with protect, noconstant(GetDateTime(sFromDate))
declare sToDate = vc with protect, noconstant(trim($END_DATE, 3))
declare qToDateTime = dq8 with protect, noconstant(GetDateTime(sToDate))
declare sLocFacilities = vc with protect, noconstant(trim($LOC_LIST,3))
declare iTimeMax = i4 with protect, noconstant(cnvtint($TIME_MAX))
declare iIncCustomFields = i2 with protect, noconstant(cnvtint($INC_CUSTOM_FIELDS))

if(iDebugFlag > 0)
  call echo(build("sUserName ->", sUserName))
  call echo(build("sFromDate -> ",sFromDate))
  call echo(build("qFromDateTime -> ", format(qFromDateTime, "@LONGDATETIME")))
  call echo(build("sToDate -> ",sToDate))
  call echo(build("qToDateTime -> ", format(qToDateTime, "@LONGDATETIME")))
  call echo(build("sLocFacilities -> ",sLocFacilities))
  call echo(build("iDebugFlag -> ", iDebugFlag))
  call echo(build("iTimeMax -> ", iTimeMax))
  call echo(build("iIncCustomFields ->", iIncCustomFields))
endif
 

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParameters(null) = null with protect ; Validates the script parameters
declare ParseLocations(sLocFacilties = vc) = null with protect ; Validates the script parameters
declare GetEncounterInsurancePlans(null) = null with protect
declare GetCustomFields(null) = null with protect
declare BeginOperation(sMessage = vc) = i4 with protect
declare HandleScriptTimeout(iIndex = i4) = null with protect

/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Populate the audit information for the script
set iRet = PopulateAudit(sUsername, 0.00, pop_enc_ins_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit", "Invalid User for Audit", "1001", "Invalid User for Audit",
    pop_enc_ins_reply_out)
  go to exit_script
endif

; Validate the input parameters
call ValidateParameters(null)

; Parse locations if provided
if(textlen(sLocFacilities) > 0)
  call ParseLocations(sLocFacilities)
endif

; Load the encounter insurance plan activity
call GetEncounterInsurancePlans(null)

; Set audit to successful
if(size(pop_enc_ins_reply_out->encounter_insurances, 5) > 0)
  call ErrorHandler2( c_error_handler, "S", "Success", "Population encounter insurances found successfully.", "0000",
    "Population encounter insurances found successfully.", pop_enc_ins_reply_out)
  
  ; Load the encounter custom fields
  if(iIncCustomFields > 0)
    call GetCustomFields(null)
  endif
else
  call ErrorHandler2( c_error_handler, "Z", "Success", "No population encounter insurances found.", "0000",
    "No population encounter insurances found.", pop_enc_ins_reply_out)
endif
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set sJsonOut = CNVTRECTOJSON(pop_enc_ins_reply_out)
if(validate(_MEMORY_REPLY_STRING))
  set _MEMORY_REPLY_STRING = trim(sJsonOut, 3)
endif
 
if(iDebugFlag > 0)
  set _file = build2(trim(logical("ccluserdir"), 3), "/", c_script_name, ".json")
  call echo(build("_file  ->", _file))

  call echorecord(pop_enc_ins_reply_out)
  call echojson(pop_enc_ins_reply_out, _file, 0)
  call echo(build("sJsonOut  ->", sJsonOut))
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/

/*************************************************************************
;  Name: ValidateParameters(null) = null
;  Description:  Validates the script parameters
**************************************************************************/
subroutine ValidateParameters(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("ValidateParameters Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(textlen(sUsername) = 0)
    call ErrorHandler2(c_error_handler, "F", "ValidateParameters", "Username is required", "9999", "Username is required",
      pop_enc_ins_reply_out)
    go to exit_script
  endif

  if(qFromDateTime > qToDateTime)
    call ErrorHandler2(c_error_handler, "F", "ValidateParameters", "From Date Greater than To Date. Refine Dates Entered.",
      "2010", "From Date Greater than To Date. Refine Dates Entered.", pop_enc_ins_reply_out)
    go to exit_script
  endif

  set iRet = ThreshHoldValidator(iTimeMax, "s", qFromDateTime, qToDateTime)
  if(iRet = 0)
    call ErrorHandler2(c_error_handler, "F", "ValidateParameters", "Date Range Too Long. Refine Query.",
      "2011", "Date Range Too Long. Refine Query.", pop_enc_ins_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echo(concat("ValidateParameters Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidateParameters

/*************************************************************************
;  Name: ParseLocations(sLocFacilties = vc) = null
;  Description: Parses the locations from a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("ParseLocations Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set iLocationIndex = 1

  while(sLocationCd != c_not_found)
    set sLocationCd = piece(sLocFacilities, ',', iLocationIndex, c_not_found)

    if(sLocationCd != c_not_found)
      set location_filter->location_cnt = iLocationIndex
      set stat = alterlist(location_filter->locations, iLocationIndex)
      set location_filter->locations[iLocationIndex].facility_cd = cnvtreal(sLocationCd)

      if(location_filter->locations[iLocationIndex].facility_cd <= 0.00)
        call ErrorHandler2(c_error_handler, "F", "ParseLocations",
          build("Invalid Facility Code: ", sLocationCd), "2040",
          build("Invalid Facility Code: ", sLocationCd), pop_enc_ins_reply_out)
          go to exit_script
      endif

      set iLocationIsFacility = 0

      select into "nl:"
        cv.code_value
      from
        code_value cv
      plan cv where cv.code_value = location_filter->locations[iLocationIndex].facility_cd
        and cv.code_set = 220
        and cv.cdf_meaning = c_facility_meaning
      detail
        iLocationIsFacility = 1
      with nocounter

      if(iLocationIsFacility = 0)
        call ErrorHandler2(c_error_handler, "F", "ParseLocations",
          build("Invalid Facility Code: ", location_filter->locations[iLocationIndex].facility_cd), "2040",
          build("Invalid Facility Code: ", location_filter->locations[iLocationIndex].facility_cd), pop_enc_ins_reply_out)
        go to exit_script
			endif
    endif

    set iLocationIndex += 1
  endwhile

  if(iDebugFlag > 0)
    call echorecord(location_filter)

    call echo(concat("ParseLocations Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3), " seconds"))
  endif
end ; End subroutine ParseLocations

/*************************************************************************
;  Name: GetEncounterInsurancePlans(null) = null
;  Description:  Gets the encounter insurance plans
**************************************************************************/
subroutine GetEncounterInsurancePlans(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetEncounterPlanRelationships Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set CURALIAS = reply_encounter_insurance pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex]
  set CURALIAS = reply_insurance_plan pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].
    insurance_plans[iInsurancePlanIndex]
  set CURALIAS = additional_insurance_plan
    additional_insurance_data->insurance_plans[additional_insurance_data->insurance_plan_cnt]

  ; Load Encounter/Plan Relationships
  set iOperationIndex = BeginOperation("Load encounter insurances")

  if(location_filter->location_cnt > 200)
    set iExpandValue = c_high_expand_value
  else
    set iExpandValue = c_low_expand_value
  endif

  select
    if(location_filter->location_cnt <= 0)
      plan epr where epr.updt_dt_tm >= cnvtdatetime(qFromDateTime)
        and epr.updt_dt_tm <= cnvtdatetime(qToDateTime)
        and epr.person_id > 0.00
        and epr.encntr_id > 0.00
      join e where e.encntr_id = epr.encntr_id
        and e.loc_facility_cd > 0.00
      join p where p.person_id = e.person_id
      join ea1 where ea1.encntr_id = outerjoin(e.encntr_id)
        and ea1.encntr_alias_type_cd = outerjoin(c_encounter_alias_type_fin_cd)
        and ea1.active_ind = outerjoin(1)
        and ea1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
        and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
      join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
        and ea2.encntr_alias_type_cd = outerjoin(c_encounter_alias_type_mrn_cd)
        and ea2.active_ind = outerjoin(1)
        and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
        and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    else
      plan epr where epr.updt_dt_tm >= cnvtdatetime(qFromDateTime)
        and epr.updt_dt_tm <= cnvtdatetime(qToDateTime)
        and epr.person_id > 0.00
        and epr.encntr_id > 0.00
      join e where e.encntr_id = epr.encntr_id
        and expand(iIndex, 1, location_filter->location_cnt, e.loc_facility_cd, location_filter->locations[iIndex].facility_cd)
      join p where p.person_id = e.person_id
      join ea1 where ea1.encntr_id = outerjoin(e.encntr_id)
        and ea1.encntr_alias_type_cd = outerjoin(c_encounter_alias_type_fin_cd)
        and ea1.active_ind = outerjoin(1)
        and ea1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
        and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
      join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
        and ea2.encntr_alias_type_cd = outerjoin(c_encounter_alias_type_mrn_cd)
        and ea2.active_ind = outerjoin(1)
        and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
        and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    endif
  into "nl:"
    epr.updt_dt_tm,
    e.person_id,
    e.encntr_id,
    epr.priority_seq,
    epr.orig_priority_seq,
    epr.encntr_plan_reltn_id
  from
    encntr_plan_reltn epr,
    encounter e,
    person p,
    encntr_alias ea1,
		encntr_alias ea2
  order by
    epr.updt_dt_tm,
    e.person_id,
    e.encntr_id,
    epr.priority_seq,
    epr.encntr_plan_reltn_id
  head report
    iMaxReached = 0
    iLocationFound = 0
    iLocationIndex = 0
    iEncounterInsurancesIndex = 0
    iInsurancePlanIndex = 0

		stat = alterlist(pop_enc_ins_reply_out->encounter_insurances, c_maximum_number_of_records)
  head epr.updt_dt_tm
    iLocationFound = 0
    iLocationIndex = 0
    iInsurancePlanIndex = 0

		if(iEncounterInsurancesIndex > c_maximum_number_of_records)
			iMaxReached = 1
		endif
  head e.encntr_id
    iLocationFound = 0
    iLocationIndex = 0
    iInsurancePlanIndex = 0

    if(iMaxReached = 0)
			iEncounterInsurancesIndex += 1
			if(mod(iEncounterInsurancesIndex, 100) = 1 and iEncounterInsurancesIndex > c_maximum_number_of_records)
				stat = alterlist(pop_enc_ins_reply_out->encounter_insurances, iEncounterInsurancesIndex + 99)
			endif

      reply_encounter_insurance->created_updated_date_time = cnvtdatetime(epr.updt_dt_tm)

      ; Patient Information
      reply_encounter_insurance->patient.patient_id = p.person_id
      reply_encounter_insurance->patient.display_name = trim(p.name_full_formatted, 3)
      reply_encounter_insurance->patient.last_name = trim(p.name_full_formatted, 3)
      reply_encounter_insurance->patient.middle_name = trim(p.name_full_formatted, 3)
      reply_encounter_insurance->patient.first_name = trim(p.name_full_formatted, 3)
      reply_encounter_insurance->patient.mrn = trim(ea2.alias, 3)
      reply_encounter_insurance->patient.birth_date_time = cnvtdatetime(p.birth_dt_tm)
      reply_encounter_insurance->patient.gender.id = p.sex_cd
      reply_encounter_insurance->patient.gender.name = trim(uar_get_code_display(p.sex_cd), 3)
      reply_encounter_insurance->patient.sdob = datetimezoneformat(p.birth_dt_tm, p.birth_tz, "YYYY-MM-DD", curtimezonedef)
      reply_encounter_insurance->patient.deceased_dt_tm = cnvtdatetime(p.deceased_dt_tm)

      ; Encounter Information
      reply_encounter_insurance->encounter.encounter_id = e.encntr_id
      reply_encounter_insurance->encounter.encounter_type.id = e.encntr_type_cd
      reply_encounter_insurance->encounter.encounter_type.name = trim(uar_get_code_display(e.encntr_type_cd), 3)
      reply_encounter_insurance->encounter.patient_class.id = e.encntr_type_class_cd
      reply_encounter_insurance->encounter.patient_class.name = trim(uar_get_code_display(e.encntr_type_class_cd), 3)
      reply_encounter_insurance->encounter.encounter_date_time = cnvtdatetime(e.arrive_dt_tm)
      reply_encounter_insurance->encounter.discharge_date_time = cnvtdatetime(e.disch_dt_tm)
      reply_encounter_insurance->encounter.financial_number = trim(ea1.alias, 3)

      ; Encounter Location
      reply_encounter_insurance->encounter.location.hospital.id = e.loc_facility_cd
      reply_encounter_insurance->encounter.location.hospital.name = trim(uar_get_code_display(e.loc_facility_cd), 3)
      reply_encounter_insurance->encounter.location.unit.id = e.loc_nurse_unit_cd
      reply_encounter_insurance->encounter.location.unit.name = trim(uar_get_code_display(e.loc_nurse_unit_cd), 3)
      reply_encounter_insurance->encounter.location.room.id = e.loc_room_cd
      reply_encounter_insurance->encounter.location.room.name = trim(uar_get_code_display(e.loc_room_cd), 3)
      reply_encounter_insurance->encounter.location.bed.id = e.loc_bed_cd
      reply_encounter_insurance->encounter.location.bed.name = trim(uar_get_code_display(e.loc_bed_cd), 3)
    endif
  head epr.encntr_plan_reltn_id
    if(iMaxReached = 0)
      iInsurancePlanIndex += 1
      stat = alterlist(reply_encounter_insurance->insurance_plans, iInsurancePlanIndex)

      ; Encounter/Plan Relationship
      reply_insurance_plan->insurance_id = epr.encntr_plan_reltn_id
      reply_insurance_plan->group_nbr = trim(epr.group_nbr, 3)
      reply_insurance_plan->group_name = trim(epr.group_name, 3)
      reply_insurance_plan->policy_nbr = trim(epr.policy_nbr, 3)
      reply_insurance_plan->member_nbr = trim(epr.member_nbr, 3)
      reply_insurance_plan->priority_sequence = epr.priority_seq
      reply_insurance_plan->begin_effective_dt_tm = cnvtdatetime(epr.beg_effective_dt_tm)
      reply_insurance_plan->end_effective_dt_tm = cnvtdatetime(epr.end_effective_dt_tm)
      reply_insurance_plan->active_ind = epr.active_ind
      reply_insurance_plan->active_status_cd = epr.active_status_cd
      reply_insurance_plan->active_status_disp = trim(uar_get_code_display(epr.active_status_cd), 3)
      reply_insurance_plan->active_status_prsnl_id = epr.active_status_prsnl_id
      reply_insurance_plan->active_status_dt_tm = cnvtdatetime(epr.active_status_dt_tm)
      reply_insurance_plan->data_status_cd = epr.data_status_cd
      reply_insurance_plan->data_status_disp = trim(uar_get_code_display(epr.data_status_cd), 3)
      reply_insurance_plan->data_status_prsnl_id = epr.data_status_prsnl_id
      reply_insurance_plan->data_status_dt_tm = cnvtdatetime(epr.data_status_dt_tm)
      reply_insurance_plan->ins_card_copied.id = epr.ins_card_copied_cd
      reply_insurance_plan->ins_card_copied.name = trim(uar_get_code_display(epr.ins_card_copied_cd), 3)
      reply_insurance_plan->health_plan_id = epr.health_plan_id
      reply_insurance_plan->insured_card_name_first = trim(epr.insured_card_name_first, 3)
      reply_insurance_plan->insured_card_name_middle = trim(epr.insured_card_name_middle, 3)
      reply_insurance_plan->insured_card_name_last = trim(epr.insured_card_name_last, 3)
      reply_insurance_plan->insured_card_name = trim(epr.insured_card_name, 3)
      reply_insurance_plan->subs_member_nbr = trim(epr.subs_member_nbr, 3)
      reply_insurance_plan->verify_status.id = epr.verify_status_cd
      reply_insurance_plan->verify_status.name = trim(uar_get_code_display(epr.verify_status_cd), 3)
      reply_insurance_plan->verify_source.id = epr.verify_source_cd
      reply_insurance_plan->verify_source.name = trim(uar_get_code_display(epr.verify_source_cd), 3)
      reply_insurance_plan->verify_prsnl_id = epr.verify_prsnl_id
      reply_insurance_plan->verify_dt_tm = cnvtdatetime(epr.verify_dt_tm)
      reply_insurance_plan->assign_benefits.id = epr.assign_benefits_cd
      reply_insurance_plan->assign_benefits.name = trim(uar_get_code_display(epr.assign_benefits_cd), 3)

      additional_insurance_data->insurance_plan_cnt += 1
      stat = alterlist(additional_insurance_data->insurance_plans, additional_insurance_data->insurance_plan_cnt)
      additional_insurance_plan->encounter_insurance_idx = iEncounterInsurancesIndex
      additional_insurance_plan->insurance_plan_idx = iInsurancePlanIndex
      additional_insurance_plan->insurance_updt_dt_tm = cnvtdatetime(epr.updt_dt_tm)
      additional_insurance_plan->encntr_plan_reltn_id = epr.encntr_plan_reltn_id
      additional_insurance_plan->health_plan_id = epr.health_plan_id
      additional_insurance_plan->related_person_id = e.person_id
      additional_insurance_plan->encntr_id = e.encntr_id
      additional_insurance_plan->organization_id = epr.organization_id
      additional_insurance_plan->person_plan_reltn_id = epr.person_plan_reltn_id
    endif
  with nocounter, expand = value(iExpandValue)
  call HandleScriptTimeout(iOperationIndex)

  set CURALIAS reply_encounter_insurance OFF
  set CURALIAS reply_insurance_plan OFF
  set CURALIAS additional_insurance_plan OFF

  ; Load Additional Insurance Plan Information
  if(additional_insurance_data->insurance_plan_cnt > 0)
    set CURALIAS = reply_insurance_plan pop_enc_ins_reply_out->
      encounter_insurances[additional_insurance_data->insurance_plans[iIndex].encounter_insurance_idx].
      insurance_plans[additional_insurance_data->insurance_plans[iIndex].insurance_plan_idx]
    set CURALIAS = additional_insurance_plan additional_insurance_data->insurance_plans[iIndex]

    if(additional_insurance_data->insurance_plan_cnt > 200)
      set iExpandValue = c_high_expand_value
    else
      set iExpandValue = c_low_expand_value
    endif

    ; Load Health Plans
    set iOperationIndex = BeginOperation("Load health plans")
    select into "nl:"
      hp.health_plan_id
    from
      health_plan hp
    plan hp where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        hp.health_plan_id, additional_insurance_plan->health_plan_id)
      and hp.active_ind = 1
      and hp.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
      and hp.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    order by
      hp.health_plan_id
    detail
      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        hp.health_plan_id, additional_insurance_plan->health_plan_id)
      reply_insurance_plan->plan_name = trim(hp.plan_name, 3)
      reply_insurance_plan->plan_desc = trim(hp.plan_desc, 3)
      reply_insurance_plan->plan_class_cd = hp.plan_class_cd
      reply_insurance_plan->plan_class_disp = trim(uar_get_code_display(hp.plan_class_cd), 3)
      reply_insurance_plan->plan_type_cd = hp.plan_type_cd
      reply_insurance_plan->plan_type_disp = trim(uar_get_code_display(hp.plan_type_cd), 3)
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    ; Load Encounter/Person Relationships
    set iOperationIndex = BeginOperation("Load encounter/person relationships")
    select into "nl:"
      epr.encntr_person_reltn_id,
      p.person_id,
      epr.encntr_id,
      ad.address_id,
      ph.phone_type_cd,
      ph.phone_type_seq,
      ph.phone_id
    from
      encntr_person_reltn epr,
      person p,
      address ad,
      phone ph
    plan epr where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        epr.related_person_id, additional_insurance_plan->related_person_id,
        epr.encntr_id, additional_insurance_plan->encntr_id)
      and epr.person_reltn_type_cd = c_person_relationship_type_insured_cd
      and epr.active_ind = 1
      and epr.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
      and epr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    join p where epr.related_person_id = p.person_id
    join ad where ad.parent_entity_id = outerjoin(epr.related_person_id)
      and ad.parent_entity_name = outerjoin("PERSON")
      and ad.active_ind = outerjoin(1)
      and ad.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ad.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    join ph where ph.parent_entity_id = outerjoin(epr.related_person_id)
      and ph.parent_entity_name = outerjoin("PERSON")
      and ph.active_ind = outerjoin(1)
      and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ph.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    order by
      epr.encntr_person_reltn_id,
      p.person_id,
      epr.encntr_id,
      ad.address_id,
      ph.phone_type_cd,
      ph.phone_type_seq,
      ph.phone_id
    head report
      iPhoneIndex = 0
    head epr.encntr_person_reltn_id
      iPhoneIndex = 0

      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        epr.related_person_id, additional_insurance_plan->related_person_id,
        epr.encntr_id, additional_insurance_plan->encntr_id)

      ; Subscriber
      reply_insurance_plan->subscriber_id = p.person_id
      reply_insurance_plan->subscriber_last_name = trim(p.name_last_key, 3)
      reply_insurance_plan->subscriber_first_name = trim(p.name_first_key, 3)
      reply_insurance_plan->subscriber_date_of_birth = cnvtdatetime(p.birth_dt_tm)
      reply_insurance_plan->subscriber_reltn_to_patient_cd = epr.person_reltn_cd
      reply_insurance_plan->subscriber_reltn_to_patient_desc = trim(uar_get_code_display(epr.person_reltn_cd), 3)
      reply_insurance_plan->patient_reltn_to_subscriber_cd = epr.related_person_reltn_cd
      reply_insurance_plan->patient_reltn_to_subscriber_desc = trim(uar_get_code_display(epr.related_person_reltn_cd), 3)

      ; Subscriber Address
      reply_insurance_plan->subscriber_address.address_id = ad.address_id
      reply_insurance_plan->subscriber_address.address_type_cd = ad.address_type_cd
      reply_insurance_plan->subscriber_address.address_type_disp = trim(uar_get_code_display(ad.address_type_cd), 3)
      reply_insurance_plan->subscriber_address.address_type_mean = trim(uar_get_code_meaning(ad.address_type_cd), 3)
      reply_insurance_plan->subscriber_address.street_addr = trim(ad.street_addr, 3)
      reply_insurance_plan->subscriber_address.street_addr2 = trim(ad.street_addr2, 3)
      reply_insurance_plan->subscriber_address.street_addr3 = trim(ad.street_addr3, 3)
      reply_insurance_plan->subscriber_address.city = trim(ad.city, 3)
      reply_insurance_plan->subscriber_address.state_cd = ad.state_cd
      reply_insurance_plan->subscriber_address.state_disp = trim(uar_get_code_display(ad.state_cd), 3)
      reply_insurance_plan->subscriber_address.state_mean = trim(uar_get_code_meaning(ad.state_cd), 3)
      reply_insurance_plan->subscriber_address.zipcode = trim(ad.zipcode, 3)
      reply_insurance_plan->subscriber_address.country_cd = ad.country_cd
      reply_insurance_plan->subscriber_address.country_disp = trim(uar_get_code_display(ad.country_cd), 3)
      reply_insurance_plan->subscriber_address.county_cd = ad.county_cd
      reply_insurance_plan->subscriber_address.county_disp = trim(uar_get_code_display(ad.county_cd), 3)
      reply_insurance_plan->subscriber_address.end_effective_dt_tm = cnvtdatetime(ad.end_effective_dt_tm)
    head ph.phone_id
      if(ph.phone_id > 0.00)
        iPhoneIndex += 1
        stat = alterlist(reply_insurance_plan->subscriber_phones, iPhoneIndex)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_id = ph.phone_id
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_type_cd = ph.phone_type_cd
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_type_disp = trim(uar_get_code_display(ph.phone_type_cd), 3)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_type_mean = trim(uar_get_code_meaning(ph.phone_type_cd), 3)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_num = trim(ph.phone_num, 3)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].sequence_nbr = ph.phone_type_seq
        reply_insurance_plan->subscriber_phones[iPhoneIndex].extension = trim(ph.extension, 3)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].end_effective_dt_tm = cnvtdatetime(ph.end_effective_dt_tm)
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_format.id = ph.phone_format_cd
        reply_insurance_plan->subscriber_phones[iPhoneIndex].phone_format.name = trim(uar_get_code_display(ph.phone_format_cd), 3)
      endif
    foot report
      stat = alterlist(pop_enc_ins_reply_out->encounter_insurances, iEncounterInsurancesIndex)
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    ; Load Organization
    set iOperationIndex = BeginOperation("Load organization")
    select into "nl:"
      o.organization_id,
      ad.address_id,
      ph.phone_type_cd,
      ph.phone_type_seq,
      ph.phone_id
    from
      organization o,
      address ad,
      phone ph
    plan o where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        o.organization_id, additional_insurance_plan->organization_id)
      and o.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
      and o.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    join ad where ad.parent_entity_id = outerjoin(o.organization_id)
      and ad.parent_entity_name = outerjoin("ORGANIZATION")
      and ad.active_ind = outerjoin(1)
      and ad.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ad.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    join ph where ph.parent_entity_id = outerjoin(o.organization_id)
      and ph.parent_entity_name = outerjoin("ORGANIZATION")
      and ph.active_ind = outerjoin(1)
      and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ph.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    order by
      o.organization_id,
      ad.address_id,
      ph.phone_type_cd,
      ph.phone_type_seq,
      ph.phone_id
    detail
      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        o.organization_id, additional_insurance_plan->organization_id)

      reply_insurance_plan->payor_name = trim(o.org_name, 3)
      reply_insurance_plan->payor_phone = trim(ph.phone_num, 3)

      if (ad.state_cd = 0.0)
        reply_insurance_plan->payor_state = trim(ad.state, 3)
      else
        reply_insurance_plan->payor_state = trim(uar_get_code_display(ad.state_cd), 3)
      endif
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    ; Load Elegibility Status
    set iOperationIndex = BeginOperation("Load elegibility status")
    select into "nl:"
      epe.encntr_plan_reltn_id
    from
      encntr_plan_eligibility epe
    plan epe where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        epe.encntr_plan_reltn_id, additional_insurance_plan->encntr_plan_reltn_id)
      and epe.active_ind = 1
    order by
      epe.encntr_plan_reltn_id
    detail
      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        epe.encntr_plan_reltn_id, additional_insurance_plan->encntr_plan_reltn_id)

      reply_insurance_plan->eligibility_status.id = epe.eligibility_status_cd
      reply_insurance_plan->eligibility_status.name = trim(uar_get_code_display(epe.eligibility_status_cd), 3)
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    ; Load Encounter/Benefit Relationships
    set iOperationIndex = BeginOperation("Load encounter/benefit relationships")
    select into "nl:"
      ebr.encntr_plan_reltn_id
    from
      encntr_benefit_r ebr
    plan ebr where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        ebr.encntr_plan_reltn_id, additional_insurance_plan->encntr_plan_reltn_id)
      and ebr.active_ind = 1
      and ebr.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
      and ebr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    order by
      ebr.encntr_plan_reltn_id
    detail
      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        ebr.encntr_plan_reltn_id, additional_insurance_plan->encntr_plan_reltn_id)

      reply_insurance_plan->deduct_amt = ebr.deduct_amt
      reply_insurance_plan->deduct_remain_amt = ebr.deduct_remain_amt
      reply_insurance_plan->copay_amt = ebr.copay_amt

      case(ebr.internal_seq)
        of 0:
          reply_insurance_plan->deduct_inc_max_oop = ebr.room_coverage_board_incl_cd
        of 1:
          reply_insurance_plan->copay_inc_max_oop = ebr.room_coverage_board_incl_cd
      endcase
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    ; Load Person/Plan Relationships
    set iOperationIndex = BeginOperation("Load person/plan relationships")
    select into "nl:"
      ppr.person_plan_reltn_id
    from
      person_plan_reltn ppr
    plan ppr where
      expand(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        ppr.person_plan_reltn_id, additional_insurance_plan->person_plan_reltn_id)
      and ppr.active_ind = 1
      and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
      and ppr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    order by
      ppr.person_plan_reltn_id
    detail
      iIndex = locateval(iIndex, 1, additional_insurance_data->insurance_plan_cnt,
        ppr.person_plan_reltn_id, additional_insurance_plan->person_plan_reltn_id)

      reply_insurance_plan->max_out_pckt_amt = ppr.max_out_pckt_amt
      reply_insurance_plan->fam_deduct_met_amt = ppr.fam_deduct_met_amt
    with nocounter, expand = value(iExpandValue)
    call HandleScriptTimeout(iOperationIndex)

    set CURALIAS reply_insurance_plan OFF
    set CURALIAS additional_insurance_plan OFF
  endif

  if(iDebugFlag > 0)
    call echo(concat("GetEncounterPlanRelationships Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetEncounterPlanRelationships

/*************************************************************************
;  Name: GetCustomFields(null)
;  Description:  Gets the custom encounter fields
**************************************************************************/
subroutine GetCustomFields(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetCustomFields Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set iOperationIndex = BeginOperation("Load custom fields")

  free record encounter_info
  record encounter_info (
    1 encounter_cnt = i4
    1 encounters[*]
      2 encounter_id = f8
      2 custom_fields[*]
        3 field
          4 id = f8
          4 name = vc
        3 responsevaluetext[*] = vc
        3 responsevaluecodes[*]
          4 id = f8
          4 name = vc
      2 encounter_insurance_cnt = i4
      2 encounter_insurances[*]
        3 encounter_insurance_idx = i4
  )

  for(iIndex = 1 to size(pop_enc_ins_reply_out->encounter_insurances, 5))
    set iEncounterIndex = locateval(iEncounterIndex, 1, encounter_info->encounter_cnt,
      pop_enc_ins_reply_out->encounter_insurances[iIndex].encounter.encounter_id,
      encounter_info->encounters[iEncounterIndex].encounter_id)
    
    if(iEncounterIndex = 0)
      set encounter_info->encounter_cnt += 1
      set iEncounterIndex = encounter_info->encounter_cnt
      set stat = alterlist(encounter_info->encounters, iEncounterIndex)
    endif

    set encounter_info->encounters[iEncounterIndex].encounter_id =
      pop_enc_ins_reply_out->encounter_insurances[iIndex].encounter.encounter_id

    set encounter_info->encounters[iEncounterIndex].encounter_insurance_cnt += 1
    set iEncounterInsurancesIndex = encounter_info->encounters[iEncounterIndex].encounter_insurance_cnt
    set stat = alterlist(encounter_info->encounters[iEncounterIndex].encounter_insurances, iEncounterInsurancesIndex)
    set encounter_info->encounters[iEncounterIndex].encounter_insurances[iEncounterInsurancesIndex].encounter_insurance_idx =
      iIndex
  endfor

  if(encounter_info->encounter_cnt > 200)
    set iExpandValue = c_high_expand_value
  else
    set iExpandValue = c_low_expand_value
  endif

  select into "nl:"
    e.encntr_id,
    e.info_sub_type_cd,
    e.value_cd
  from
    encntr_info e,
    long_text lt
  plan e where
    expand(iIndex, 1, encounter_info->encounter_cnt, e.encntr_id, encounter_info->encounters[iIndex].encounter_id)
    and e.info_type_cd = c_userdefined_info_type_cd
    and e.active_ind  = 1
    and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  join lt where e.long_text_id = lt.long_text_id
  order by
    e.encntr_id,
    e.info_sub_type_cd,
    e.value_cd
  head report
    iCustomFieldIndex = 0
    iTextValueIndex = 0
    iCodifiedValueIndex = 0
  head e.encntr_id
    iCustomFieldIndex = 0
    iTextValueIndex = 0
    iCodifiedValueIndex = 0

    iEncounterIndex = locateval(iEncounterIndex, 1, encounter_info->encounter_cnt, e.encntr_id,
      encounter_info->encounters[iEncounterIndex].encounter_id)
  head e.info_sub_type_cd
    iCustomFieldIndex += 1

    stat = alterlist(encounter_info->encounters[iEncounterIndex].custom_fields, iCustomFieldIndex)
    encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].field.id =
      e.info_sub_type_cd
    encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].field.name =
      trim(uar_get_code_display(e.info_sub_type_cd), 3)
  detail
    if(textlen(trim(lt.long_text)) > 0)
      iTextValueIndex += 1
      stat = alterlist(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
        responsevaluetext, iTextValueIndex)
      encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
        responsevaluetext[iTextValueIndex] = trim(lt.long_text, 3)
    endif

    if(e.value_cd > 0)
      iCodifiedValueIndex += 1
      stat = alterlist(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
        responsevaluecodes, iCodifiedValueIndex)
      encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
        responsevaluecodes[iCodifiedValueIndex].id = e.value_cd
      encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
        responsevaluecodes[iCodifiedValueIndex].name = trim(uar_get_code_display(e.value_cd), 3)
    endif
	with nocounter, expand = value(iExpandValue)
  call HandleScriptTimeout(iOperationIndex)

  ; Loaded encounter info
  for(iEncounterIndex = 1 to encounter_info->encounter_cnt)
    if(size(encounter_info->encounters[iEncounterIndex].custom_fields, 5) > 0)
      ; Existing encounter insurances
      for(iIndex = 1 to encounter_info->encounters[iEncounterIndex].encounter_insurance_cnt)
        set iEncounterInsurancesIndex =
          encounter_info->encounters[iEncounterIndex].encounter_insurances[iIndex].encounter_insurance_idx
        set stat = alterlist(pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.custom_fields,
          size(encounter_info->encounters[iEncounterIndex].custom_fields, 5))

        ; Loaded custom fields
        for(iCustomFieldIndex = 1 to size(encounter_info->encounters[iEncounterIndex].custom_fields, 5))
          set pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.custom_fields[iCustomFieldIndex].
            field.id = encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].field.id
          set pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.custom_fields[iCustomFieldIndex].
            field.name = trim(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].field.name, 3)

          ; Text values
          if(size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluetext, 5) > 0)
            set stat = alterlist(pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.
              custom_fields[iCustomFieldIndex].responsevaluetext,
              size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluetext, 5))

            for(iTextValueIndex = 1 to
              size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluetext, 5))

              set pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.
                custom_fields[iCustomFieldIndex].responsevaluetext[iTextValueIndex] =
                trim(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
                  responsevaluetext[iTextValueIndex], 3)
            endfor
          endif

          ; Codified values
          if(size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluecodes, 5) > 0)
            set stat = alterlist(pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.
              custom_fields[iCustomFieldIndex].responsevaluecodes,
              size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluecodes, 5))
              
            for(iCodifiedValueIndex = 1 to
              size(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].responsevaluecodes, 5))

              set pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.
                custom_fields[iCustomFieldIndex].responsevaluecodes[iCodifiedValueIndex].id =
                encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
                  responsevaluecodes[iCodifiedValueIndex].id
              set pop_enc_ins_reply_out->encounter_insurances[iEncounterInsurancesIndex].encounter.
                custom_fields[iCustomFieldIndex].responsevaluecodes[iCodifiedValueIndex].name =
                trim(encounter_info->encounters[iEncounterIndex].custom_fields[iCustomFieldIndex].
                  responsevaluecodes[iCodifiedValueIndex].name, 3)
            endfor
          endif
        endfor
      endfor
    endif
  endfor

  if(iDebugFlag > 0)
    call echo(concat("GetCustomFields Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetCustomFields

/*************************************************************************
;  Name: BeginOperation(sMessage = vc) = i4
;  Description:  Begins an operation and returns the operation index
**************************************************************************/
subroutine BeginOperation(sMessage)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("BeginOperation Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set operations->operation_cnt += 1
  set iIndex = operations->operation_cnt
  set stat = alterlist(operations->operations, iIndex)
  set operations->operations[iIndex].message = trim(sMessage, 3)
  set operations->operations[iIndex].begin_dt_tm = cnvtdatetime(curdate,curtime3)

  if(iDebugFlag > 0)
    call echo(concat("BeginOperation Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(iIndex)
end ; End subroutine BeginOperation

/*************************************************************************
;  Name: HandleScriptTimeout(iIndex = vc) = null
;  Description:  Handles the script timeout
**************************************************************************/
subroutine HandleScriptTimeout(iIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("HandleScriptTimeout Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(iIndex <= 0 or iIndex > operations->operation_cnt)
    call ErrorHandler2(c_error_handler, "F", "HandleScriptTimeout", "Invalid operation index",
      "9999", "Invalid operation index", pop_enc_ins_reply_out)
    go to exit_script
  endif

  set operations->operations[iIndex].end_dt_tm = cnvtdatetime(curdate,curtime3)
  set operations->operations[iIndex].time_in_seconds = datetimediff(cnvtdatetime(operations->operations[iIndex].end_dt_tm),
    cnvtdatetime(operations->operations[iIndex].begin_dt_tm), 5)
  set operations->total_time_in_seconds += operations->operations[iIndex].time_in_seconds
  if(textlen(operations->combined_message) = 0)
    set operations->combined_message = concat("[Operations=([Operation=(", operations->operations[iIndex].message,
      "),Time=", trim(cnvtstring(operations->operations[iIndex].time_in_seconds), 3), "s]")
  else
    set operations->combined_message = concat(operations->combined_message,
      concat("|[Operation=(", operations->operations[iIndex].message,
      "),Time=", trim(cnvtstring(operations->operations[iIndex].time_in_seconds), 3), "s]"))
  endif

	if(operations->total_time_in_seconds > c_timeout_threshold_in_seconds)
    set operations->combined_message = concat(operations->combined_message, concat("),Total Time=",
      trim(cnvtstring(operations->total_time_in_seconds), 3), "s]"))

    set stat = alterlist(pop_enc_ins_reply_out->encounter_insurances, 0)
    call ErrorHandler2(c_error_handler, "F", "HandleScriptTimeout", concat("Script Timeout=", operations->combined_message),
      "9999", concat("Script Timeout=", operations->combined_message), pop_enc_ins_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echorecord(operations)

    call echo(concat("HandleScriptTimeout Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine HandleScriptTimeout

end
go
