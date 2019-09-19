/*************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-2014 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ***********************************************************************/
 
/*************************************************************************
 
        Source file name:       hcm_get_at_risk_indicator.PRG
        Object name:            hcm_get_at_risk_indicator
        Request #:              -
 
        Product:                HealtheCare
        Product Team:           HealtheCare Management
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Identifies if a patient has a health plan considered to be At-Risk
 
        Tables read:            -
        Tables updated:         -
 
        Executing from:         MPage Components
 
**************************************************************************/
 
 
/**************************************************************************************************************
*                               GENERATED MODIFICATION CONTROL LOG                                            *
***************************************************************************************************************
*                                                                                                             *
* Mod Date       Engineer                       Comment                                                       *
* --- ---------- ----------------------------- -------------------------------------------------------------- *
* 000 03/18/2016 Doyle Timberlake              HICAREDEV-1403 Initial Release                                 *
* 001 04/05/2016 Doyle Timberlake              HICAREDEV-1500 Call hcm_get_hi_person_demog                    *
* 002 10/01/2017 Rishi Panguluri               HICAREDEV-3281 Changes to correct Array out of bounds error    *
* 003 08/26/2019 Erin Marston				   Add benefit_coverage_beg_iso_dt_tm and save custom include and *
* 										       program files	                                              *
***************************************************************************************************************
 
******************  END OF ALL MODCONTROL BLOCKS  ***********************/
 
 
 
drop program bc_hcm_get_at_risk_indicator go
create program bc_hcm_get_at_risk_indicator
 
/*************************************************************************
*  Include files                                                         *
*************************************************************************/
%i CCLUSERDIR:mp_common.inc
 
/*************************************************************************
* Record Structures                                                      *
*************************************************************************/
/*
record request
(
%i CCLUSERDIR:hcm_get_at_risk_indicator_req.inc
)
*/
 
;003 swap for custom reply include file
if (not validate(reply))
record reply
(
1 person_id = f8
1 at_risk_ind = i2
1 health_plans[*]
  2 plan_name = vc
  2 begin_iso_dt_tm = vc
  2 end_iso_dt_tm = vc
  2 plan_identifiers[*]
    3 value = vc
    3 type = vc
1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
;;%i CCLUSERDIR:bc_hcm_get_at_risk_ind_rep.inc
)
endif
 
FREE RECORD hcm_get_hi_demographics_request
 RECORD hcm_get_hi_demographics_request (
   1 person_id = f8
   1 hi_person_identifier = vc
   1 demographics_test_uri = vc
   1 benefit_coverage_source_type = vc
 )
 FREE RECORD hcm_get_hi_demographics_reply
 RECORD hcm_get_hi_demographics_reply (
   1 person_id = f8
   1 hi_person_identifier = vc
   1 given_names [* ]
     2 given_name = vc
   1 family_names [* ]
     2 family_name = vc
   1 full_name = vc
   1 date_of_birth = vc
   1 gender_details
     2 id = vc
     2 coding_system_id = vc
   1 address
     2 street_addresses [* ]
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
   1 telecoms [* ]
     2 preferred = vc
     2 number = vc
     2 country_code = vc
     2 type
       3 id = vc
       3 coding_system_id = vc
       3 display = vc
   1 email_addresses [* ]
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
*  Constant Declarations                                                 *
*************************************************************************/
declare DEMOGRAPHICS_TEST_URI = vc with protect, constant(request->demographics_test_uri)
declare RISK_BENEFIT_COVERAGES_CNT = i4 with protect, constant(size(request->health_plans, 5))
declare HI_BENEFITS_FILTER_SOURCE_TYPE = vc with protect, constant(request->source_type)
 
/*************************************************************************
*  Variable Declarations                                                 *
*************************************************************************/
declare person_id = f8 with protect, noconstant(request->person_id)
declare hi_benefit_coverages_cnt = i4 with protect, noconstant(0)
declare hi_benefit_coverages_idx = i4 with protect, noconstant(0)
declare hi_plan_ids_cnt = i4 with protect, noconstant(0)
declare hi_plan_ids_idx = i4 with protect, noconstant(0)
declare risk_benefit_coverages_idx = i4 with protect, noconstant(0)
declare risk_plan_ids_cnt = i4 with protect, noconstant(0)
declare risk_plan_ids_idx = i4 with protect, noconstant(0)
declare benefit_coverage_end_iso_dt_tm = vc with protect, noconstant("")
declare benefit_coverage_beg_iso_dt_tm = vc with protect, noconstant("") ;003
declare matched_at_risk_plan_cnt = i4 with protect, noconstant(0)
declare matched_at_risk_plan_id_cnt = i4 with protect, noconstant(0)
declare hi_plan_type = vc with protect, noconstant("")
declare hi_plan_value = vc with protect, noconstant("")
declare risk_plan_type = vc with protect, noconstant("")
declare risk_plan_value = vc with protect, noconstant("")
declare curr_hi_plan_name = vc with protect, noconstant("")
declare plan_added_ind = i2 with protect, noconstant(0)
 
/*************************************************************************
*  Begin Program                                                         *
*************************************************************************/
set reply->at_risk_ind = 0
set reply->person_id = person_id
set reply->status_data->status = "F"
 
if (person_id = 0)
  set reply->status_data->subeventstatus[1]->TargetObjectValue = "Invalid person id, person_id = 0"
  go to END_SCRIPT
endif
 
 
 
; Call hcm_get_hi_person_demog.prg to get patients HI health plans
set hcm_get_hi_demographics_request->person_id = cnvtreal(person_id)
set hcm_get_hi_demographics_request->demographics_test_uri = DEMOGRAPHICS_TEST_URI
set hcm_get_hi_demographics_request->benefit_coverage_source_type = HI_BENEFITS_FILTER_SOURCE_TYPE
 
execute hcm_get_hi_person_demog with replace("REQUEST", hcm_get_hi_demographics_request),
  replace("REPLY", hcm_get_hi_demographics_reply)
 
if (hcm_get_hi_demographics_reply->status_data->status = "S")
  set hi_benefit_coverages_cnt = size(hcm_get_hi_demographics_reply->health_plans, 5)
 
  ; Loop 1 Patients HI health plans
  for(hi_benefit_coverages_idx = 1 to hi_benefit_coverages_cnt)
    set benefit_coverage_end_iso_dt_tm = hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->end_iso_dt_tm
    set plan_added_ind = 0
    set matched_at_risk_plan_id_cnt = 0
 
    ; Only match on current health plans
    if (textlen(benefit_coverage_end_iso_dt_tm) = 0 or cnvtIsoDtTmToDQ8(benefit_coverage_end_iso_dt_tm) > CURRENT_DATE_TIME)
 
      ; Loop 2 Current HI health plan plan_identifiers array
      set hi_plan_ids_cnt = size(hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->plan_identifiers, 5)
      set curr_hi_plan_name = hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->plan_name
      set benefit_coverage_beg_iso_dt_tm = hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->begin_iso_dt_tm  ;003
 
      for(hi_plan_ids_idx = 1 to hi_plan_ids_cnt)
        set hi_plan_type =
          hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->plan_identifiers[hi_plan_ids_idx]->type
        set hi_plan_value =
          hcm_get_hi_demographics_reply->health_plans[hi_benefit_coverages_idx]->plan_identifiers[hi_plan_ids_idx]->value
 
            ; Loop 3 at risk health plans from request
            for(risk_benefit_coverages_idx = 1 to RISK_BENEFIT_COVERAGES_CNT)
              set risk_plan_ids_cnt = size(request->health_plans[risk_benefit_coverages_idx]->plan_identifiers, 5)
 
              ; loop 4 current at risk health plan plan_identifiers array
              for (risk_plan_ids_idx = 1 to risk_plan_ids_cnt)
                  set risk_plan_type =
                    request->health_plans[risk_benefit_coverages_idx]->plan_identifiers[risk_plan_ids_idx]->type
                  set risk_plan_value =
                    request->health_plans[risk_benefit_coverages_idx]->plan_identifiers[risk_plan_ids_idx]->value
 
                  if(hi_plan_type = risk_plan_type and hi_plan_value = risk_plan_value)
                    ; This will ensure we increment reply plan array size only once per every matching plan
 
                    if (plan_added_ind = 0)
                      set matched_at_risk_plan_cnt = matched_at_risk_plan_cnt + 1
                      if (mod(matched_at_risk_plan_cnt, 10) = 1)
                        set stat = alterlist(reply->health_plans, matched_at_risk_plan_cnt + 9)
                      endif
                      set reply->health_plans[matched_at_risk_plan_cnt]->plan_name = curr_hi_plan_name
                      set reply->health_plans[matched_at_risk_plan_cnt]->begin_iso_dt_tm  = benefit_coverage_beg_iso_dt_tm  ;003
                      set reply->health_plans[matched_at_risk_plan_cnt]->end_iso_dt_tm = benefit_coverage_end_iso_dt_tm ;003
                    endif
                    set plan_added_ind = 1
                    set matched_at_risk_plan_id_cnt = matched_at_risk_plan_id_cnt + 1
                    set stat = alterlist(reply->health_plans[matched_at_risk_plan_cnt]->plan_identifiers,
                      matched_at_risk_plan_id_cnt)
                    set reply->health_plans[matched_at_risk_plan_cnt]->plan_identifiers[matched_at_risk_plan_id_cnt]->type =
                      risk_plan_type
                    set reply->health_plans[matched_at_risk_plan_cnt]->plan_identifiers[matched_at_risk_plan_id_cnt]->value =
                      risk_plan_value
                    set reply->at_risk_ind = 1
                    ; Break out of loops 3 and 4 as match is found for the current HI plan identifier
                    set risk_plan_ids_idx = risk_plan_ids_cnt + 1
                    set risk_benefit_coverages_idx = RISK_BENEFIT_COVERAGES_CNT + 1
                  endif ; end comparison
              endfor; End loop 4
            endfor ; End loop 3
      endfor ; End loop 2
    endif; end textlen(benefit_coverage_end_iso_dt_tm) = 0 or cnvtIsoDtTmToDQ8(benefit_coverage_end_iso_dt_tm) > CURRENT_DATE_TIME
  endfor ; end loop 1
else
  set reply->status_data->subeventstatus[1]->TargetObjectValue =
    build2(reply->status_data->subeventstatus[1]->TargetObjectValue, " ",
      hcm_get_hi_demographics_reply->status_data->subeventstatus[1]->TargetObjectValue)
  go to END_SCRIPT
endif
 
set stat = alterlist(reply->health_plans, matched_at_risk_plan_cnt)
set reply->status_data->status = "S"
 
#END_SCRIPT
 
if (validate(debug_ind, 0) = 1)
  call echorecord(reply)
endif
 
set last_mod = "003"
set mod_date = "Aug 26, 2019"
 
end
go
 