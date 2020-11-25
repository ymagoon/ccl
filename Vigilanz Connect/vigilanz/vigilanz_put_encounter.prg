/*********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**********************************************************************
      Source file name: snsro_put_encounter.prg
      Object name:      vigilanz_put_encounter
      Program purpose:  Updates an encounter in Millennium.
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
  001 12/19/19 RJC		Initial Write
  002 01/15/20 RJC		Added update_reltn_ind for the person/encntr reltns.
  003 01/21/20 RJC		Fixed issue with custom fields, additional providers and location check, remove guarantor requirement
  004 01/29/20 RJC		Fixed issue with custom fields that have coded values
  005 02/03/20 RJC		Made TreatmentPhaseId and PatientValuablesIds separate fields instead of using customFields block
  006 02/25/20 RJC		Fixed issue with provider address verification
  007 03/03/20 RJC		Updated patientValuables while looop; changed health_plans rec to health_plan_data due to name conflicts
  008 03/31/20 RJC		Fixed lock check; Added ability to remove patientvaluables
***********************************************************************/
drop program vigilanz_put_encounter go
create program vigilanz_put_encounter
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Json Args:" = ""				;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, JSON, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;114382 PM_GET_ZIPCODE_DEFAULTS
free record 114382_req
record 114382_req (
  1 zipcode = vc
  1 city = vc
  1 state_cd = f8
  1 state = vc
  1 search_option = i2
)
 
free record 114382_rep
record 114382_rep (
   1 list [* ]
     2 zipcode = vc
     2 primary_ind = i2
     2 prefix = vc
     2 city_cd = f8
     2 city = vc
     2 county = vc
   1 city = vc
   1 county = vc
   1 county_cd = f8
   1 county_fips = vc
   1 preferred_type = c1
   1 prefix = vc
   1 state = vc
   1 state_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
   1 city_cd = f8
 )
 
;140007 - OCX_ADD_FREETEXT_PROVIDER
free record 140007_req
record 140007_req (
  1 esi_ensure_type = c3
  1 person_qual = i4
  1 person [*]
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 action_type = c3
    2 new_person = c1
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_prsnl_id = f8
    2 active_status_dt_tm = dq8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 person_type_cd = f8
    2 name_last_key = c100
    2 name_first_key = c100
    2 name_full_formatted = c100
    2 name_first_phonetic = c8
    2 name_last_phonetic = c8
    2 autopsy_cd = f8
    2 birth_dt_cd = f8
    2 birth_dt_tm = dq8
    2 conception_dt_tm = dq8
    2 cause_of_death = c100
    2 cause_of_death_cd = f8
    2 deceased_cd = f8
    2 deceased_dt_tm = dq8
    2 ethnic_grp_cd = f8
    2 language_cd = f8
    2 marital_type_cd = f8
    2 purge_option_cd = f8
    2 race_cd = f8
    2 religion_cd = f8
    2 sex_cd = f8
    2 sex_age_change_ind_ind = i2
    2 sex_age_change_ind = i2
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 language_dialect_cd = f8
    2 name_last = c200
    2 name_first = c200
    2 name_phonetic = c8
    2 last_encntr_dt_tm = dq8
    2 species_cd = f8
    2 confid_level_cd = f8
    2 vip_cd = f8
    2 name_first_synonym_id = f8
    2 citizenship_cd = f8
    2 vet_military_status_cd = f8
    2 mother_maiden_name = c100
    2 nationality_cd = f8
    2 ft_entity_name = c32
    2 ft_entity_id = f8
    2 name_middle_key = c100
    2 name_middle = c200
    2 military_rank_cd = f8
    2 military_service_cd = f8
    2 military_base_location = c100
    2 deceased_source_cd = f8
    2 updt_cnt = i4
    2 birth_tz = i4
    2 birth_tz_disp = vc
    2 birth_prec_flag = i2
    2 deceased_id_method_cd = f8
    2 logical_domain_id = f8
    2 logical_domain_id_ind = i2
    2 person_status_cd = f8
    2 race_list_ind = i2
    2 race_list [*]
      3 value_cd = f8
    2 pre_person_id = f8
    2 ethnic_grp_list_ind = i2
    2 ethnic_grp_list [*]
      3 value_cd = f8
    2 emancipation_dt_tm = dq8
    2 deceased_tz = i4
    2 deceased_dt_tm_prec_flag = i2
  1 prsnl_qual = i4
  1 prsnl [*]
    2 action_type = c3
    2 new_person = c1
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 name_last_key = c100
    2 name_first_key = c100
    2 prsnl_type_cd = f8
    2 name_full_formatted = c100
    2 password = c100
    2 email = c100
    2 physician_ind_ind = i2
    2 physician_ind = i2
    2 position_cd = f8
    2 department_cd = f8
    2 free_text_ind_ind = i2
    2 free_text_ind = i2
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 section_cd = f8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 name_last = c200
    2 name_first = c200
    2 username = c50
    2 ft_entity_name = c32
    2 ft_entity_id = f8
    2 prim_assign_loc_cd = f8
    2 log_access_ind_ind = i2
    2 log_access_ind = i2
    2 log_level = i4
    2 updt_cnt = i4
    2 name_middle = c200
    2 name_degree = c200
    2 name_prefix = c200
    2 name_suffix = c200
    2 name_initials = c200
    2 name_title = c100
  1 address_qual = i4
  1 address [*]
    2 action_type = c3
    2 new_person = c1
    2 address_id = f8
    2 parent_entity_name = c32
    2 parent_entity_id = f8
    2 address_type_cd = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 address_format_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 contact_name = c200
    2 residence_type_cd = f8
    2 comment_txt = c200
    2 street_addr = c100
    2 street_addr2 = c100
    2 street_addr3 = c100
    2 street_addr4 = c100
    2 city = c100
    2 state = c100
    2 state_cd = f8
    2 zipcode = c25
    2 zip_code_group_cd = f8
    2 postal_barcode_info = c100
    2 county = c100
    2 county_cd = f8
    2 country = c100
    2 country_cd = f8
    2 residence_cd = f8
    2 mail_stop = c100
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 address_type_seq_ind = i2
    2 address_type_seq = i4
    2 beg_effective_mm_dd_ind = i2
    2 beg_effective_mm_dd = i4
    2 end_effective_mm_dd_ind = i2
    2 end_effective_mm_dd = i4
    2 contributor_system_cd = f8
    2 operation_hours = c255
    2 long_text_id = f8
    2 updt_cnt = i4
    2 address_info_status_cd = f8
    2 primary_care_cd = f8
    2 district_health_cd = f8
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 city_cd = f8
    2 addr_key = c100
    2 addr_key_del_ind = i2
    2 source_identifier = c255
    2 validation_expire_dt_tm = dq8
  1 address_viewer_ind = i2
  1 fsi_unknown_flag = i2
  1 phone_qual = i4
  1 phone [*]
    2 action_type = c3
    2 new_person = c1
    2 phone_id = f8
    2 parent_entity_name = c32
    2 parent_entity_id = f8
    2 phone_type_cd = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 phone_format_cd = f8
    2 phone_num = c100
    2 phone_type_seq_ind = i2
    2 phone_type_seq = i4
    2 description = c100
    2 contact = c100
    2 call_instruction = c100
    2 modem_capability_cd = f8
    2 extension = c100
    2 paging_code = c100
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 beg_effective_mm_dd_ind = i2
    2 beg_effective_mm_dd = i4
    2 end_effective_mm_dd_ind = i2
    2 end_effective_mm_dd = i4
    2 contributor_system_cd = f8
    2 operation_hours = c255
    2 long_text_id = f8
    2 updt_cnt = i4
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 email = c255
    2 contact_method_cd = f8
    2 source_identifier = c255
  1 phone_viewer_ind = i2
  1 prsnl_alias_qual = i4
  1 prsnl_alias [*]
    2 action_type = c3
    2 new_person = c1
    2 prsnl_alias_id = f8
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 alias_pool_cd = f8
    2 prsnl_alias_type_cd = f8
    2 alias = c200
    2 prsnl_alias_sub_type_cd = f8
    2 check_digit = i4
    2 check_digit_method_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 updt_cnt = i4
)
 
free record 140007_rep
record 140007_rep (
   1 person_qual = i4
   1 person [* ]
     2 person_id = f8
   1 prsnl_qual = i4
   1 prsnl [* ]
     2 person_id = f8
   1 address_qual = i4
   1 address [* ]
     2 address_id = f8
   1 phone_qual = i4
   1 phone [* ]
     2 phone_id = f8
   1 prsnl_alias_qual = i4
   1 prsnl_alias [* ] = i4
     2 prsnl_alias_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = c100
 )
 
;4130034 - oaf_get_plan_info
free record 4130034_req
record 4130034_req (
  1 person_id = f8
  1 health_plan_id = f8
  1 priority_seq_ind = i2
  1 priority_seq = i4
  1 organization_id = f8
  1 org_plan_reltn_cdf_mean = vc
  1 authorization_nbr = vc
  1 phone_address_ind = i2
  1 best_phone_address_ind = i2
  1 hp_financial_ind = i2
  1 best_hp_financial_ind = i2
  1 return_all_ind = i2
  1 load_hp_field_format_ind = i2
  1 load_office_orgs_ind = i2
  1 service_type_filter_list [*]
    2 service_type_cd = f8
)
 
free record 4130034_rep
record 4130034_rep (
   1 health_plan_qual = i4
   1 health_plan [* ]
     2 health_plan_id = f8
     2 plan_name = c100
     2 plan_name_key = c100
     2 plan_type_cd = f8
     2 plan_desc = c255
     2 financial_class_cd = f8
     2 ft_entity_name = c32
     2 ft_entity_id = f8
     2 baby_coverage_cd = f8
     2 comb_baby_bill_cd = f8
     2 plan_class_cd = f8
     2 group_nbr = c100
     2 group_name = c200
     2 policy_nbr = c100
     2 financial_class_cd_2 = f8
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 best_policy_nbr = c100
     2 best_policy_nbr_pe = c32
     2 best_contract_code = c100
     2 best_contract_code_pe = c32
     2 sponsor_group_nbr = c100
     2 sponsor_group_name = c200
     2 sponsor_data_status_cd = f8
     2 carrier_plan_reltn_id = f8
     2 carrier_data_status_cd = f8
     2 sponsor_plan_reltn_id = f8
     2 match_address_pe_id = f8
     2 match_address_pe_name = vc
     2 match_address_type_cd = f8
     2 match_address_found = i2
     2 match_phone_pe_id = f8
     2 match_phone_pe_name = vc
     2 match_phone_type_cd = f8
     2 match_phone_found = i2
     2 organization_id = f8
     2 org_name = vc
     2 org_name_key = vc
     2 person_plan_reltn_qual = i4
     2 person_plan_reltn [* ]
       3 person_plan_reltn_id = f8
       3 person_plan_r_cd = f8
       3 person_org_reltn_id = f8
       3 organization_id = f8
       3 member_nbr = c100
       3 priority_seq = i4
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 balance_type_cd = f8
       3 contributor_system_cd = f8
       3 coverage_type_cd = f8
       3 deduct_amt = f8
       3 deduct_met_amt = f8
       3 deduct_met_dt_tm = dq8
       3 fam_deduct_met_amt = f8
       3 fam_deduct_met_dt_tm = dq8
       3 group_name = vc
       3 group_nbr = vc
       3 health_plan_id = f8
       3 insured_card_name = vc
       3 max_out_pckt_amt = f8
       3 max_out_pckt_dt_tm = dq8
       3 person_id = f8
       3 plan_class_cd = f8
       3 plan_type_cd = f8
       3 policy_nbr = vc
       3 rowid = c18
       3 signature_on_file_cd = f8
       3 sponsor_person_org_reltn_id = f8
       3 subscriber_person_id = f8
       3 updt_applctx = i4
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 verify_dt_tm = dq8
       3 verify_prsnl_id = f8
       3 verify_status_cd = f8
       3 insured_card_name_first = vc
       3 insured_card_name_middle = vc
       3 insured_card_name_last = vc
       3 insured_card_name_suffix = vc
       3 verify_source_cd = f8
       3 alt_member_nbr = c100
       3 ext_payer_name = c100
       3 ext_payer_ident = c100
       3 generic_health_plan_name = vc
       3 office_org
         4 organization_id = f8
         4 org_name = vc
       3 card_category_cd = f8
       3 program_status_cd = f8
     2 hp_financial_qual = i4
     2 hp_financial [* ]
       3 hp_financial_id = f8
       3 copay = i4
       3 coinsurance = i4
       3 deductible = i4
       3 max_out_pocket = i4
       3 max_fam_out_pocket = i4
       3 lifetime_max_bnft = i4
       3 location_cd = f8
       3 specialty_cd = f8
       3 parent_entity_name = c50
       3 parent_entity_id = f8
       3 remarks = c200
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
     2 hp_alias_qual = i4
     2 hp_alias [* ]
       3 health_plan_alias_id = f8
       3 alias_pool_cd = f8
       3 alias = c100
       3 check_digit = i4
       3 check_digit_method_cd = f8
     2 address_qual = i4
     2 address [* ]
       3 address_id = f8
       3 parent_entity_name = c32
       3 parent_entity_id = f8
       3 address_type_cd = f8
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 updt_applctx = i4
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 address_format_cd = f8
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 contact_name = c200
       3 residence_type_cd = f8
       3 comment_txt = c200
       3 street_addr = c100
       3 street_addr2 = c100
       3 street_addr3 = c100
       3 street_addr4 = c100
       3 city = c100
       3 state = c100
       3 state_cd = f8
       3 state_disp = vc
       3 state_desc = vc
       3 state_mean = vc
       3 zipcode = c25
       3 zip_code_group_cd = f8
       3 postal_barcode_info = c100
       3 county = c100
       3 county_cd = f8
       3 country = c100
       3 country_cd = f8
       3 residence_cd = f8
       3 mail_stop = c100
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = f8
       3 address_type_seq = i4
       3 beg_effective_mm_dd = i4
       3 end_effective_mm_dd = i4
       3 contributor_system_cd = f8
     2 phone_qual = i4
     2 phone [* ]
       3 phone_id = f8
       3 parent_entity_name = c32
       3 parent_entity_id = f8
       3 phone_type_cd = f8
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 updt_applctx = i4
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 phone_format_cd = f8
       3 phone_num = c100
       3 phone_formatted = c100
       3 phone_type_seq = i4
       3 description = c100
       3 contact = c100
       3 call_instruction = c100
       3 modem_capability_cd = f8
       3 extension = c100
       3 paging_code = c100
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = dq8
       3 beg_effective_mm_dd = i4
       3 end_effective_mm_dd = i4
       3 contributor_system_cd = f8
     2 eligibility_version_cd = f8
     2 claimstatus_version_cd = f8
     2 serviceauth_version_cd = f8
     2 field_format_ind = i2
     2 field_format_list [* ]
       3 field_type_meaning = vc
       3 format_mask = vc
       3 min_format_mask_char_cnt = i4
       3 field_required_ind = i2
     2 office_orgs_ind = i2
     2 office_orgs [* ]
       3 organization_id = f8
       3 org_name = vc
     2 plan_category_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;100080 - PM_LOCK_GET_LOCKS
free record 100080_req
record 100080_req (
  1 person_id = f8
  1 super_user = i2
  1 mode = i2
  1 unmask_alias = i2
)
 
free record 100080_rep
record 100080_rep (
    1 person [* ]
      2 person_id = f8
      2 user_id = f8
      2 user_name = vc
      2 name = vc
      2 mrn = vc
      2 gender = vc
      2 birth_date = dq8
      2 birth_tz = i4
      2 lockkeyid = i4
      2 entname = vc
      2 user_name_full = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;100081 - PM_LOCK_ADD_LOCK
free record 100081_req
record 100081_req (
  1 person_id = f8
)
 
free record 100081_rep
record 100081_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
;114356 - PM_GET_LOC_CENSUS
free record 114356_req
record 114356_req (
  1 facility_cd = f8
  1 building_cd = f8
  1 nurse_unit_or_amb_cd = f8
  1 room_cd = f8
  1 mode = i2
  1 bed_qual = i4
  1 bed [*]
    2 bed_cd = f8
)
 
free record 114356_rep
record 114356_rep (
    1 facility_cd = f8
    1 facility_disp = vc
    1 building_cd = f8
    1 build_disp = vc
    1 nurse_unit_or_amb_cd = f8
    1 nurse_unit_or_amb_disp = vc
    1 room [* ]
      2 room_registration_ind = i2
      2 room_cd = f8
      2 room_disp = vc
      2 isolat_cd = f8
      2 isolat_disp = vc
      2 room_attrib [* ]
        3 attrib_id = f8
        3 attrib_type_cd = f8
        3 loc_template_string = vc
        3 parent_entity_name = vc
        3 parent_entity_id = f8
        3 description = vc
        3 value_type = c1
        3 value_cd = f8
        3 value_id = f8
        3 value_string = vc
        3 value_num = i4
        3 value_dt_tm = dq8
        3 value_time_num = i4
      2 bed [* ]
        3 bed_registration_ind = i2
        3 bed_cd = f8
        3 bed_disp = vc
        3 bed_status_cd = f8
        3 bed_status_disp = vc
        3 bed_status_mean = vc
        3 dup_bed_ind = i4
        3 encntr_pending_ind = i2
        3 pending_encntr_id = f8
        3 est_out_complete_dt_tm = dq8
        3 est_in_complete_dt_tm = dq8
        3 dup_pending_out_ind = i2
        3 patient_id = f8
        3 encntr_id = f8
        3 encntr_type_cd = f8
        3 encntr_type_disp = vc
        3 patient_name = vc
        3 mrn = vc
        3 fin_nbr = vc
        3 age = dq8
        3 sex_cd = f8
        3 sex_disp = vc
        3 vip_cd = f8
        3 vip_disp = vc
        3 birth_dt_tm = dq8
        3 reg_dt_tm = dq8
        3 accommodation_cd = f8
        3 accommodation_disp = vc
        3 med_service_cd = f8
        3 med_service_disp = vc
        3 isolation_cd = f8
        3 isolation_disp = c40
        3 bed_attrib [* ]
          4 attrib_id = f8
          4 attrib_type_cd = f8
          4 loc_template_string = vc
          4 parent_entity_name = vc
          4 parent_entity_id = f8
          4 description = vc
          4 value_type = c1
          4 value_cd = f8
          4 value_id = f8
          4 value_string = c40
          4 value_num = i4
          4 value_dt_tm = dq8
          4 value_time_num = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
free record health_plan_data
record health_plan_data (
   1 health_plan_qual = i4
   1 health_plan [* ]
     2 health_plan_id = f8
     2 plan_name = c100
     2 plan_name_key = c100
     2 plan_type_cd = f8
     2 plan_desc = c255
     2 financial_class_cd = f8
     2 ft_entity_name = c32
     2 ft_entity_id = f8
     2 baby_coverage_cd = f8
     2 comb_baby_bill_cd = f8
     2 plan_class_cd = f8
     2 group_nbr = c100
     2 group_name = c200
     2 policy_nbr = c100
     2 financial_class_cd_2 = f8
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 best_policy_nbr = c100
     2 best_policy_nbr_pe = c32
     2 best_contract_code = c100
     2 best_contract_code_pe = c32
     2 sponsor_group_nbr = c100
     2 sponsor_group_name = c200
     2 sponsor_data_status_cd = f8
     2 carrier_plan_reltn_id = f8
     2 carrier_data_status_cd = f8
     2 sponsor_plan_reltn_id = f8
     2 match_address_pe_id = f8
     2 match_address_pe_name = vc
     2 match_address_type_cd = f8
     2 match_address_found = i2
     2 match_phone_pe_id = f8
     2 match_phone_pe_name = vc
     2 match_phone_type_cd = f8
     2 match_phone_found = i2
     2 organization_id = f8
     2 org_name = vc
     2 org_name_key = vc
     2 person_plan_reltn_qual = i4
     2 person_plan_reltn [* ]
       3 person_plan_reltn_id = f8
       3 person_plan_r_cd = f8
       3 person_org_reltn_id = f8
       3 organization_id = f8
       3 member_nbr = c100
       3 priority_seq = i4
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 balance_type_cd = f8
       3 contributor_system_cd = f8
       3 coverage_type_cd = f8
       3 deduct_amt = f8
       3 deduct_met_amt = f8
       3 deduct_met_dt_tm = dq8
       3 fam_deduct_met_amt = f8
       3 fam_deduct_met_dt_tm = dq8
       3 group_name = vc
       3 group_nbr = vc
       3 health_plan_id = f8
       3 insured_card_name = vc
       3 max_out_pckt_amt = f8
       3 max_out_pckt_dt_tm = dq8
       3 person_id = f8
       3 plan_class_cd = f8
       3 plan_type_cd = f8
       3 policy_nbr = vc
       3 rowid = c18
       3 signature_on_file_cd = f8
       3 sponsor_person_org_reltn_id = f8
       3 subscriber_person_id = f8
       3 updt_applctx = i4
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 verify_dt_tm = dq8
       3 verify_prsnl_id = f8
       3 verify_status_cd = f8
       3 insured_card_name_first = vc
       3 insured_card_name_middle = vc
       3 insured_card_name_last = vc
       3 insured_card_name_suffix = vc
       3 verify_source_cd = f8
       3 alt_member_nbr = c100
       3 ext_payer_name = c100
       3 ext_payer_ident = c100
       3 generic_health_plan_name = vc
       3 office_org
         4 organization_id = f8
         4 org_name = vc
       3 card_category_cd = f8
       3 program_status_cd = f8
     2 hp_financial_qual = i4
     2 hp_financial [* ]
       3 hp_financial_id = f8
       3 copay = i4
       3 coinsurance = i4
       3 deductible = i4
       3 max_out_pocket = i4
       3 max_fam_out_pocket = i4
       3 lifetime_max_bnft = i4
       3 location_cd = f8
       3 specialty_cd = f8
       3 parent_entity_name = c50
       3 parent_entity_id = f8
       3 remarks = c200
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
     2 hp_alias_qual = i4
     2 hp_alias [* ]
       3 health_plan_alias_id = f8
       3 alias_pool_cd = f8
       3 alias = c100
       3 check_digit = i4
       3 check_digit_method_cd = f8
     2 address_qual = i4
     2 address [* ]
       3 address_id = f8
       3 parent_entity_name = c32
       3 parent_entity_id = f8
       3 address_type_cd = f8
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 updt_applctx = i4
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 address_format_cd = f8
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 contact_name = c200
       3 residence_type_cd = f8
       3 comment_txt = c200
       3 street_addr = c100
       3 street_addr2 = c100
       3 street_addr3 = c100
       3 street_addr4 = c100
       3 city = c100
       3 state = c100
       3 state_cd = f8
       3 state_disp = vc
       3 state_desc = vc
       3 state_mean = vc
       3 zipcode = c25
       3 zip_code_group_cd = f8
       3 postal_barcode_info = c100
       3 county = c100
       3 county_cd = f8
       3 country = c100
       3 country_cd = f8
       3 residence_cd = f8
       3 mail_stop = c100
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = f8
       3 address_type_seq = i4
       3 beg_effective_mm_dd = i4
       3 end_effective_mm_dd = i4
       3 contributor_system_cd = f8
     2 phone_qual = i4
     2 phone [* ]
       3 phone_id = f8
       3 parent_entity_name = c32
       3 parent_entity_id = f8
       3 phone_type_cd = f8
       3 updt_cnt = i4
       3 updt_dt_tm = dq8
       3 updt_id = f8
       3 updt_task = i4
       3 updt_applctx = i4
       3 active_ind = i2
       3 active_status_cd = f8
       3 active_status_dt_tm = dq8
       3 active_status_prsnl_id = f8
       3 phone_format_cd = f8
       3 phone_num = c100
       3 phone_formatted = c100
       3 phone_type_seq = i4
       3 description = c100
       3 contact = c100
       3 call_instruction = c100
       3 modem_capability_cd = f8
       3 extension = c100
       3 paging_code = c100
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 data_status_cd = f8
       3 data_status_dt_tm = dq8
       3 data_status_prsnl_id = dq8
       3 beg_effective_mm_dd = i4
       3 end_effective_mm_dd = i4
       3 contributor_system_cd = f8
     2 eligibility_version_cd = f8
     2 claimstatus_version_cd = f8
     2 serviceauth_version_cd = f8
     2 field_format_ind = i2
     2 field_format_list [* ]
       3 field_type_meaning = vc
       3 format_mask = vc
       3 min_format_mask_char_cnt = i4
       3 field_required_ind = i2
     2 office_orgs_ind = i2
     2 office_orgs [* ]
       3 organization_id = f8
       3 org_name = vc
     2 plan_category_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;100082 - PM_LOCK_DEL_LOCKS
free record 100082_req
record 100082_req (
  1 person [*]
    2 person_id = f8
)
 
free record 100082_rep
record 100082_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
; Final reply
free record encounter_reply_out
record encounter_reply_out(
  1 encounter_id       		= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
    2 user_lastname         = vc
    2 patient_id            = f8
    2 patient_firstname     = vc
    2 patient_lastname      = vc
    2 service_version       = vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
 
free record arglist
record arglist (
	1 encounterId							= vc
	1 encounterIdType						= vc
	1 encounter
		2 encounterDateTime 				= vc	;Optional - set to now if not
		2 attendingProviderId 				= vc	;Required
		2 dischargeDateTime 				= vc	;Optional
		2 encounterStatusId 				= vc	;Optional
		2 encounterTypeId					= vc	;Required
		2 estimatedArrivalDateTime 			= vc
		2 estimatedLengthOfStay				= vc
		2 estimatedDischargeDateTime 		= vc
		2 location
			3 bedId 						= vc	;Optional
			3 unitId 						= vc	;Optional
			3 hospitalId 					= vc	;Optional
			3 roomId 						= vc	;Optional
		2 medicalServiceId 					= vc	;Optional
		2 reasonForVisit 					= vc	;Optional
		2 patientClassId 					= vc	;Ignored. Set based on enc type
		2 admitPriorityId 					= vc	;Optional
		2 admitSourceId						= vc	;Optional
		2 guarantorId 						= vc	;Optional
		2 guarantorTypeId					= vc
		2 guarantorRelationshipToPatientId 	= vc
		2 insurances[*]								;Optional
			3 companyId 					= vc	;Required if insurance added
			3 companyName					= vc
			3 healthPlanId					= vc
			3 groupName						= vc
			3 groupNumber					= vc
			3 eligibilityStatusId			= vc
			3 eligibilityStatusDate			= vc
			3 subscriberId 					= vc	;Required if insurance block used
			3 subscriber					= vc	;Ignored - subscriberId is required
			3 policyNumber 					= vc
			3 patientRelationshipToSubscriber = vc
			3 subscriberRelationshipToPatientId = vc
			3 address
				4 addressId					= vc
				4 typeId					= vc
				4 address1					= vc
				4 address2					= vc
				4 city						= vc
				4 state						= vc
				4 zip						= vc
				4 county					= vc
				4 country					= vc
			3 phones[*]
				4 phoneId					= vc
				4 typeId					= vc
				4 number					= vc
				4 extension					= vc
				4 formatId					= vc
			3 customFields[*]
				4 fieldId					= vc
				4 responseValue				= vc
		2 providersType[*]
			3 providerId					= vc	;If this is a real number, then do a lookup for provider prsnl. If not, this
													;will be the name of the free text provider
			3 providerType					= vc
			3 address
				4 addressId					= vc
				4 typeId					= vc
				4 address1					= vc
				4 address2					= vc
				4 city						= vc
				4 state						= vc
				4 zip						= vc
				4 county					= vc
				4 country					= vc
			3 phones[*]
				4 phoneId					= vc
				4 typeId					= vc
				4 number					= vc
				4 extension					= vc
				4 formatId					= vc
			3 email							= vc
			3 npi							= vc
			3 licenseNumber					= vc
		2 icdDxCodeIds[*]					= vc	;Ignored in Cerner until requested
		2 customFields[*]
			3 fieldId						= vc
			3 responseValue					= vc
		2 formType							= vc	;Ignored - used only in Meditech
		2 referClientId						= vc	;Ignored for now
		2 visitorStatusId					= vc
		2 treatmentPhaseId					= vc
		2 patientValuablesIds				= vc
)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username								= vc
	1 prsnl_id								= f8
	1 patient_id							= f8
	1 encntr_id 							= f8
	1 encntrid_type_cd 						= f8
	1 encounter
		2 encounter_date_time 				= dq8
		2 attending_provider_id 			= f8
		2 discharge_date_time 				= dq8
		2 encounter_status_cd 				= f8
		2 encounter_type_cd					= f8
		2 encounter_class_cd 				= f8
		2 est_arrival_date_time 			= dq8
		2 est_length_of_stay				= i4
		2 est_discharge_date_time	 		= dq8
		2 location
			3 organization_id				= f8
			3 facility_cd 					= f8
			3 building_cd					= f8
			3 unit_cd 						= f8
			3 room_cd 						= f8
			3 bed_cd 						= f8
		2 medical_service_cd 				= f8
		2 reason_for_visit 					= vc
		2 admit_type_cd						= f8
		2 admit_source_cd					= f8
		2 visitor_status_cd					= f8
		2 guarantor_id 						= f8
		2 guarantor_type_cd					= f8
		2 guarantor_reltn_to_patient 		= f8
		2 treatment_phase_cd				= f8
		2 insurances[*]
			3 company_id 					= f8
			3 company_name					= vc
			3 health_plan_id				= f8
			3 group_name					= vc
			3 group_number					= vc
			3 eligibility_status_cd			= f8
			3 eligibility_status_date		= dq8
			3 subscriber_id					= f8
			3 policy_number					= vc
			3 patient_reltn_to_subscriber_cd = f8
			3 subscriber_reltn_to_patient_cd = f8
			3 org_plan_reltn_cd				= f8
			3 address
				4 address_id				= f8
				4 address_type_cd			= f8
				4 address1					= vc
				4 address2					= vc
				4 city						= vc
				4 state						= vc
				4 state_cd					= f8
				4 zip						= vc
				4 county					= vc
				4 county_cd					= f8
				4 country					= vc
				4 country_cd				= f8
			3 phones[*]
				4 phone_id					= f8
				4 phone_type_cd				= f8
				4 number					= vc
				4 extension					= vc
				4 format_id					= f8
			3 custom_fields[*]
				4 field_id					= f8
				4 response_value			= vc
			3 encntr_plan_reltn_id			= f8
			3 person_plan_reltn_id			= f8
		2 providers[*]
			3 provider						= vc
			3 provider_id					= f8
			3 provider_type_cd				= f8
			3 first_name					= vc
			3 last_name						= vc
			3 free_text_ind					= i2
			3 address
				4 address_type_cd			= f8
				4 address1					= vc
				4 address2					= vc
				4 city						= vc
				4 state						= vc
				4 state_cd					= f8
				4 zip						= vc
				4 county					= vc
				4 county_cd					= f8
				4 country					= vc
				4 country_cd				= f8
			3 phones[*]
				4 phone_type_cd				= f8
				4 number					= vc
				4 extension					= vc
				4 format_id					= f8
			3 email							= vc
			3 npi							= vc
			3 license_number				= vc
		2 custom_field[*]
			3 field_id 						= f8
			3 response_value 				= vc
	 1 custom_fields[*]
	 	2 field_id 							= f8
		2 text_value 						= vc
		2 codeset							= i4
	 	2 field								= vc
	 	2 length							= i4
	 	2 level								= vc
	 	2 type								= vc
	 	2 numeric_value						= f8
	 	2 date_value						= dq8
	 1 alias_pools[*]
	 	2 alias_pool_cd						= f8
	 	2 alias_type_cd						= f8
	 	2 dup_allowed_flag					= i2
	 	2 sys_assign_flag					= i2
	 	2 next_alias						= vc
	 1 valuables[*]
	 	2 value_cd							= f8
)
 
;Other
declare sEncounterId						= vc with protect, noconstant("")
declare sJsonArgs							= vc with protect, noconstant("")
 
; Constants
declare c_error_handler						= vc with protect, constant("PUT ENCOUNTER")
declare c_now_dt_tm							= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_facility_location_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_building_location_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",222,"BUILDING"))
declare c_nurseunit_location_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",222,"NURSEUNIT"))
declare c_ambunit_location_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",222,"AMBULATORY"))
declare c_room_location_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",222,"ROOM"))
declare c_bed_location_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",222,"BED"))
declare c_attending_encntr_prsnl_r_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",333,"ATTENDDOC"))
declare c_outpatient_encntr_class_cd		= f8 with protect, constant(uar_get_code_by("MEANING",69,"OUTPATIENT"))
declare c_preadmit_encntr_class_cd			= f8 with protect, constant(uar_get_code_by("MEANING",69,"PREADMIT"))
declare c_insured_person_reltn_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_finnbr_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_business_address_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare c_userdefined_info_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
declare c_npi_prsnl_alias_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare ValidatePerson(person_id = f8) 			= i2 with protect
declare ValidateProvider(provider_id = f8)		= i2 with protect
declare SetFreetextProvider(null)				= i2 with protect
declare ValidateLocations(null)					= null with protect
declare GetLocationType(location_cd = f8)		= f8 with protect
declare GetLocCensus(null) 						= i2 with protect	;114356 - pm_get_loc_cenus
declare GetZipDefaults(zipcode = vc)			= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare GetAliasPools(null) 					= i2 with protect
declare GetHealthPlanInfo(null)					= i2 with protect	;4130034 - oaf_get_plan_info
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare PostEncounter(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
declare ReturnAltIdentifiers(null) 				= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag = cnvtint($DEBUG_FLAG)
set input->username = trim($USERNAME, 3)
set input->prsnl_id = GetPrsnlIDfromUserName(input->username)
set sJsonArgs = trim($JSON,3)
set jrec = cnvtjsontorec(sJsonArgs)
 
set sEncounterId = trim(arglist->encounterId,3)
set input->encntrid_type_cd = cnvtreal(arglist->encounterIdType)
set input->encounter.admit_source_cd = cnvtreal(arglist->encounter.admitSourceId)
set input->encounter.admit_type_cd = cnvtreal(arglist->encounter.admitPriorityId)
set input->encounter.attending_provider_id	= cnvtreal(arglist->encounter.attendingProviderId)
if(arglist->encounter.dischargeDateTime > " ")
	set input->encounter.discharge_date_time = GetDateTime(arglist->encounter.dischargeDateTime)
endif
set input->encounter.encounter_date_time = GetDateTime(arglist->encounter.encounterDateTime)
set input->encounter.encounter_status_cd = cnvtreal(arglist->encounter.encounterStatusId)
set input->encounter.encounter_type_cd = cnvtreal(arglist->encounter.encounterTypeId)
if(arglist->encounter.estimatedArrivalDateTime > " ")
	set input->encounter.est_arrival_date_time = GetDateTime(arglist->encounter.estimatedArrivalDateTime)
endif
if(arglist->encounter.estimatedDischargeDateTime > " ")
	set input->encounter.est_discharge_date_time = GetDateTime(arglist->encounter.estimatedDischargeDateTime)
endif
set input->encounter.guarantor_id = cnvtreal(arglist->encounter.guarantorId)
set input->encounter.guarantor_reltn_to_patient = cnvtreal(arglist->encounter.guarantorRelationshipToPatientId)
set input->encounter.guarantor_type_cd = cnvtreal(arglist->encounter.guarantorTypeId)
set input->encounter.location.facility_cd = cnvtreal(arglist->encounter->location.hospitalId)
set input->encounter.location.unit_cd = cnvtreal(arglist->encounter->location.unitId)
set input->encounter.location.room_cd = cnvtreal(arglist->encounter->location.roomId)
set input->encounter.location.bed_cd = cnvtreal(arglist->encounter->location.bedId)
set input->encounter.medical_service_cd = cnvtreal(arglist->encounter.medicalServiceId)
set input->encounter.est_length_of_stay = cnvtint(arglist->encounter.estimatedLengthOfStay)
set input->encounter.reason_for_visit = trim(arglist->encounter.reasonForVisit,3)
set input->encounter.visitor_status_cd = cnvtreal(arglist->encounter.visitorStatusId)
set input->encounter.treatment_phase_cd = cnvtreal(arglist->encounter.treatmentPhaseId)
 
;PatientValuableIds
if(trim(arglist->encounter.patientValuablesIds,3) > " ")
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(trim(arglist->encounter.patientValuablesIds,3),',',num,notfnd)
     	if(str != notfnd)
      		set stat = alterlist(input->valuables, num)
     		set input->valuables[num].value_cd = cnvtint(str)
    	endif
    	set num = num + 1
	endwhile
endif
 
;Custom fields
set custSize = size(arglist->encounter.customFields,5)
if(custSize > 0)
	set stat = alterlist(input->custom_fields,custSize)
	set stat = alterlist(input->encounter.custom_field,custSize)
	for(i = 1 to custSize)
		set input->encounter.custom_field[i].field_id = cnvtreal(arglist->encounter.customFields[i].fieldId)
		set input->encounter.custom_field[i].response_value = trim(arglist->encounter.customFields[i].responseValue,3)
 
		set input->custom_fields[i].field_id = cnvtreal(arglist->encounter.customFields[i].fieldId)
		set input->custom_fields[i].text_value = trim(arglist->encounter.customFields[i].responseValue,3)
	endfor
endif
 
;Insurances
set insSize = size(arglist->encounter.insurances,5)
if(insSize > 0)
	for(i = 1 to insSize)
		set stat = alterlist(input->encounter.insurances,i)
		set input->encounter.insurances[i].company_id = cnvtreal(arglist->encounter.insurances[i].companyId)
		set input->encounter.insurances[i].company_name = trim(arglist->encounter.insurances[i].companyName,3)
		set input->encounter.insurances[i].health_plan_id = cnvtreal(arglist->encounter.insurances[i].healthPlanId)
		set input->encounter.insurances[i].eligibility_status_cd = cnvtreal(arglist->encounter.insurances[i].eligibilityStatusId)
		set input->encounter.insurances[i].eligibility_status_date = cnvtdatetime(arglist->encounter.insurances[i].eligibilityStatusDate)
		set input->encounter.insurances[i].group_name = trim(arglist->encounter.insurances[i].groupName,3)
		set input->encounter.insurances[i].group_number = trim(arglist->encounter.insurances[i].groupNumber,3)
		set input->encounter.insurances[i].patient_reltn_to_subscriber_cd =
			cnvtreal(arglist->encounter.insurances[i].patientRelationshipToSubscriber)
		set input->encounter.insurances[i].policy_number = trim(arglist->encounter.insurances[i].policyNumber,3)
		set input->encounter.insurances[i].subscriber_id = cnvtreal(arglist->encounter.insurances[i].subscriberId)
		set input->encounter.insurances[i].subscriber_reltn_to_patient_cd =
			cnvtreal(arglist->encounter.insurances[i].subscriberRelationshipToPatientId)
 
		;Insurance address
		set input->encounter.insurances[i].address.address1 = trim(arglist->encounter.insurances[i].address.address1,3)
		set input->encounter.insurances[i].address.address2 = trim(arglist->encounter.insurances[i].address.address2,3)
		set input->encounter.insurances[i].address.address_type_cd = cnvtreal(arglist->encounter.insurances[i].address.typeId)
		set input->encounter.insurances[i].address.city = trim(arglist->encounter.insurances[i].address.city,3)
 		set input->encounter.insurances[i].address.zip = trim(arglist->encounter.insurances[i].address.zip,3)
 
		;State
		set input->encounter.insurances[i].address.state = trim(arglist->encounter.insurances[i].address.state,3)
		if(cnvtreal(input->encounter.insurances[i].address.state)> 0)
			set input->encounter.insurances[i].address.state_cd = cnvtreal(input->encounter.insurances[i].address.state)
		else
			set input->encounter.insurances[i].address.state_cd =
				uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->encounter.insurances[i].address.state))
		endif
		;County
		set input->encounter.insurances[i].address.county = trim(arglist->encounter.insurances[i].address.county,3)
		if(cnvtreal(input->encounter.insurances[i].address.county)> 0)
			set input->encounter.insurances[i].address.county_cd = cnvtreal(input->encounter.insurances[i].address.county)
		else
			set input->encounter.insurances[i].address.county_cd =
				uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->encounter.insurances[i].address.county))
		endif
		;Country
		set input->encounter.insurances[i].address.country = trim(arglist->encounter.insurances[i].address.country,3)
		if(cnvtreal(input->encounter.insurances[i].address.country)> 0)
			set input->encounter.insurances[i].address.country_cd = cnvtreal(input->encounter.insurances[i].address.country)
		else
			set input->encounter.insurances[i].address.country_cd =
				uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->encounter.insurances[i].address.country))
		endif
 
		;Insurance phones
		set insPhSize = size(arglist->encounter.insurances[i].phones,5)
		if(insPhSize > 0)
			for(p = 1 to insPhSize)
				set stat = alterlist(input->encounter.insurances[i].phones,p)
				set input->encounter.insurances[i].phones[p].phone_type_cd = cnvtreal(arglist->encounter.insurances[i].phones[p].typeId)
				set input->encounter.insurances[i].phones[p].number = trim(arglist->encounter.insurances[i].phones[p].number,3)
				set input->encounter.insurances[i].phones[p].extension = trim(arglist->encounter.insurances[i].phones[p].extension,3)
				set input->encounter.insurances[i].phones[p].format_id = cnvtreal(arglist->encounter.insurances[i].phones[p].formatId)
			endfor
		endif
 
		;Insurance custom fields
		set insCustSize = size(arglist->encounter.insurances[i].customFields,5)
		if(insCustSize > 0)
			for(c = 1 to insCustSize)
				set stat = alterlist(input->encounter.insurances[i].custom_fields,c)
				set input->encounter.insurances[i].custom_fields[c].field_id =
					cnvtreal(arglist->encounter.insurances[i].customFields[c].fieldId)
				set input->encounter.insurances[i].custom_fields[c].response_value =
					trim(arglist->encounter.insurances[i].customFields[c].responseValue,3)
 
				set custSize = size(input->custom_fields,5) + 1
				set stat = alterlist(input->custom_fields,custSize)
				set input->custom_fields[custSize].field_id = input->encounter.insurances[i].custom_fields[c].field_id
				set input->custom_fields[custSize].text_value = input->encounter.insurances[i].custom_fields[c].response_value
			endfor
		endif
	endfor
endif
 
;Providers
set provSize = size(arglist->encounter.providersType,5)
if(provSize > 0)
	for(i = 1 to provSize)
		set stat = alterlist(input->encounter.providers,i)
		set input->encounter.providers[i].provider = trim(arglist->encounter.providersType[i].providerId,3)
		set input->encounter.providers[i].provider_id = cnvtreal(arglist->encounter.providersType[i].providerId)
		set input->encounter.providers[i].provider_type_cd = cnvtreal(arglist->encounter.providersType[i].providerType)
		set input->encounter.providers[i].email = trim(arglist->encounter.providersType[i].email,3)
		set input->encounter.providers[i].npi = trim(arglist->encounter.providersType[i].npi,3)
		set input->encounter.providers[i].license_number = trim(arglist->encounter.providersType[i].licenseNumber,3)
 
		;Provider Address
		set input->encounter.providers[i].address.address_type_cd = cnvtreal(arglist->encounter.providersType[i].address.typeId)
		if(input->encounter.providers[i].address.address_type_cd > 0)
			set input->encounter.providers[i].address.address1 = trim(arglist->encounter.providersType[i].address.address1,3)
			set input->encounter.providers[i].address.address2 = trim(arglist->encounter.providersType[i].address.address2,3)
			set input->encounter.providers[i].address.city = trim(arglist->encounter.providersType[i].address.city,3)
 
			;State
			set input->encounter.providers[i].address.state = trim(arglist->encounter.providersType[i].address.state,3)
			if(cnvtreal(input->encounter.providers[i].address.state)> 0)
				set input->encounter.providers[i].address.state_cd = cnvtreal(input->encounter.providers[i].address.state)
			else
				set input->encounter.providers[i].address.state_cd =
					uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->encounter.providers[i].address.state))
			endif
			;County
			set input->encounter.providers[i].address.county = trim(arglist->encounter.providersType[i].address.county,3)
			if(cnvtreal(input->encounter.providers[i].address.county)> 0)
				set input->encounter.providers[i].address.county_cd = cnvtreal(input->encounter.providers[i].address.county)
			else
				set input->encounter.providers[i].address.county_cd =
					uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->encounter.providers[i].address.county))
			endif
			;Country
			set input->encounter.providers[i].address.country = trim(arglist->encounter.providersType[i].address.country,3)
			if(cnvtreal(input->encounter.providers[i].address.country)> 0)
				set input->encounter.providers[i].address.country_cd = cnvtreal(input->encounter.providers[i].address.country)
			else
				set input->encounter.providers[i].address.country_cd =
					uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->encounter.providers[i].address.country))
			endif
		endif
 
		;Provider Phone
		set phSize = size(arglist->encounter.providersType[i].phones,5)
		if(phSize > 0)
			set stat = alterlist(input->encounter.providers[i].phones,phSize)
			for(p = 1 to phSize)
				set input->encounter.providers[i].phones[p].phone_type_cd = cnvtreal(arglist->encounter.providersType[i].phones[p].typeId)
				set input->encounter.providers[i].phones[p].number = trim(arglist->encounter.providersType[i].phones[p].number,3)
				set input->encounter.providers[i].phones[p].extension = trim(arglist->encounter.providersType[i].phones[p].extension,3)
				set input->encounter.providers[i].phones[p].format_id = cnvtreal(arglist->encounter.providersType[i].phones[p].formatId)
			endfor
		endif
	endfor
endif
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate EncounterTypeId if used and set EncounterId
if(input->encntrid_type_cd > 0)
	set iRet = GetCodeSet(input->encntrid_type_cd)
	if(iRet != 319) call ErrorMsg("EncounterIdTypeId","2065","I") endif
	set input->encntr_id = GetEncntrIdByAlias(sEncounterId,input->encntrid_type_cd)
else
	set input->encntr_id = cnvtreal(sEncounterId)
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username,input->patient_id, encounter_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get health plan data - 4130034 - oaf_get_plan_info
if(size(input->encounter.insurances,5) > 0)
	set iRet = GetHealthPlanInfo(null)
	if(iRet = 0) call ErrorMsg("Could not retrieve health plan info (4130034).","9999","E") endif
endif
 
;Create FreeText providers if they exist
call SetFreetextProvider(null)
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Update the Encounter
set iRet = PostEncounter(null)
if(iRet = 0)
	call ErrorMsg("Could not update encounter.","9999","E")
else
	call ErrorHandler2("PUT ENCOUNTER", "S", "Put Encounter", "Encounter updated successfully.",
	"0000",build2("Encounter updated successfully."), encounter_reply_out)
endif
 
#EXIT_SCRIPT
 
; Delete Lock - 100082
if(100081_rep->status_data.status = "S")
	set iRet = DeleteLock(null)
	if(iRet = 0) call ErrorMsg("Could not delete patient lock (100082).","9999","E") endif
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(encounter_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_encounter.json")
	call echo(build2("_file : ", _file))
	call echojson(encounter_reply_out, _file, 0)
	call echorecord(encounter_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ErrorMsg(msg = vc, error_code = c4, type = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for input params
**************************************************************************/
subroutine ErrorMsg(msg, error_code, type)
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), encounter_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), encounter_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, encounter_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate EncounterId
	if(input->encntr_id = 0)
		call ErrorMsg("EncounterId","2055","M")
	else
		set input->patient_id = GetPersonIdByEncntrId(input->encntr_id)
		if(ValidateEncounter(input->encntr_id) = 0) call ErrorMsg("EncounterId","9999","I") endif
	endif
 
	;Validate Location data
	if(input->encounter.location.facility_cd = 0
		and input->encounter.location.unit_cd = 0
		and input->encounter.location.room_cd = 0
		and input->encounter.location.bed_cd = 0
	   )
		call ErrorMsg("At least one of the location fields is required.","9999","M")
	else
		call ValidateLocations(null)
	endif
 
	;Validate AdmitSourceId
	if(input->encounter.admit_source_cd > 0)
		set iRet = GetCodeSet(input->encounter.admit_source_cd)
		if(iRet != 2) call ErrorMsg("AdmitSourceId","9999","I") endif
	endif
 
	;Validate AdmitPriorityId
	if(input->encounter.admit_type_cd > 0)
		set iRet = GetCodeSet(input->encounter.admit_type_cd)
		if(iRet != 3) call ErrorMsg("AdmitPriorityId","9999","I") endif
	endif
 
	;Validate MedicalServiceId
	if(input->encounter.medical_service_cd > 0)
		set iRet = GetCodeSet(input->encounter.medical_service_cd)
		if(iRet != 34) call ErrorMsg("MedicalServiceId","9999","I") endif
	endif
 
	;Validate VisitorStatusId
 	if(input->encounter.visitor_status_cd > 0)
		set iRet = GetCodeSet(input->encounter.visitor_status_cd)
		if(iRet != 14754) call ErrorMsg("VisitorStatusId","9999","I") endif
	endif
 
	;Validate AttendingProviderId
	if(input->encounter.attending_provider_id = 0)
		call ErrorMsg("AttendingProviderId","2055","M")
	else
		set provSize = size(input->encounter.providers,5) + 1
		set stat = alterlist(input->encounter.providers,provSize)
		set input->encounter.providers[provSize].provider_id = input->encounter.attending_provider_id
		set input->encounter.providers[provSize].provider_type_cd = c_attending_encntr_prsnl_r_cd
	endif
 
	;Validate Provider Data
	set provSize = size(input->encounter.providers,5)
	if(provSize > 0)
		for(i = 1 to provSize)
			;ProviderTypeCd
			set iRet = GetCodeSet(input->encounter.providers[i].provider_type_cd)
			if(iRet != 333) call ErrorMsg("Provider.TypeId","9999","I") endif
 
 			;ProviderId
 			if(input->encounter.providers[i].provider_id > 0)
				if(ValidateProvider(input->encounter.providers[i].provider_id) = 0) call ErrorMsg("ProviderId","9999","I") endif
			else
				set input->encounter.providers[i].free_text_ind = 1
			endif
 
			;Validate Address/Phone data for free text providers
 			if(input->encounter.providers[i].free_text_ind = 1)
				if(input->encounter.providers[i].address.address1 > " "
				or input->encounter.providers[i].address.address2 > " "
				or input->encounter.providers[i].address.city > " "
				or input->encounter.providers[i].address.state > " "
				or input->encounter.providers[i].address.county > " "
				or input->encounter.providers[i].address.country > " "
				or input->encounter.providers[i].address.zip > " ")
					;Validate AddressTypeId
					set iRet = GetCodeSet(input->encounter.providers[i].address.address_type_cd)
					if(iRet != 212) call ErrorMsg("Provider.AddressTypeId","9999","I") endif
				endif
 
				; Get Zipcode defaults
				if(input->encounter.providers[i].address.zip > " ")
					set stat = initrec(114382_req)
					set stat = initrec(114382_rep)
					call GetZipDefaults(input->encounter.providers[i].address.zip)
					if(input->encounter.providers[i].address.county_cd = 0)
						set input->encounter.providers[i].address.county_cd = 114382_rep->county_cd
					endif
					if(input->encounter.providers[i].address.county = "")
						set input->encounter.providers[i].address.county = 114382_rep->county
					endif
					if(input->encounter.providers[i].address.state_cd <= 0)
						set input->encounter.providers[i].address.state_cd = 114382_rep->state_cd
					endif
				endif
 
				;Get Country
				if(input->encounter.providers[i].address.country_cd = 0 or input->encounter.providers[i].address.country = "")
					select into "nl:"
					from code_value_group cvg
					, code_value cv
					plan cvg where cvg.child_code_value = input->encounter.providers[i].address.state_cd
					join cv where cv.code_value = cvg.parent_code_value
							and cv.code_set = 15
					detail
						if(input->encounter.providers[i].address.country_cd <= 0)
							input->encounter.providers[i].address.country_cd = cv.code_value
						endif
						if(input->encounter.providers[i].address.country = "")
							input->encounter.providers[i].address.country = cv.display
						endif
					with nocounter
				endif
			endif
 
			;Provider Phone
			set pSize = size(input->encounter.providers[i].phones,5)
			if(pSize > 0)
				for(p = 1 to pSize)
					;Validate PhoneTypeId
					set iRet = GetCodeSet(input->encounter.providers[i].phones[p].phone_type_cd)
					if(iRet != 43) Call ErrorMsg("Provider.PhoneTypeId","9999","I") endif
 
					;Validate FormatId
					if(input->encounter.providers[i].phones[p].format_id > 0)
						set iRet = GetCodeSet(input->encounter.providers[i].phones[p].format_id)
						if(iRet != 281) call ErrorMsg("Provider.FormatId","9999","I") endif
					endif
				endfor
			endif
		endfor
 	endif
 
	;Validate DischargeDateTime
	if(input->encounter.discharge_date_time > 0 and input->encounter.discharge_date_time > input->encounter.encounter_date_time)
		call ErrorMsg("DischargeDateTime","9999","I")
	endif
 
	;Validate EncounterTypeId & set EncounterClass
	if(input->encounter.encounter_type_cd = 0)
		call ErrorMsg("EncounterTypeId","2055","M")
	else
		set iRet = GetCodeSet(input->encounter.encounter_type_cd)
		if(iRet != 71) call ErrorMsg("EncounterTypeId","9999","I") endif
 
		;Set encounter class
		select into "nl:"
		from code_value_group cvg
			, code_value cv1
			, code_value cv2
		plan cvg where cvg.child_code_value = input->encounter.encounter_type_cd
		join cv1 where cv1.code_value = cvg.child_code_value
		join cv2 where cv2.code_value = cvg.parent_code_value
				   and cv2.code_set = 69
		detail
			input->encounter.encounter_class_cd = cv2.code_value
		with nocounter
	endif
 
	;Validate EncounterDateTime
	if(input->encounter.encounter_date_time = 0) call ErrorMsg("EncounterDateTime","2055","M") endif
 
	;Validate EncounterStatusId
	if(input->encounter.encounter_status_cd > 0)
		set iRet = GetCodeSet(input->encounter.encounter_status_cd)
		if(iRet != 261) call ErrorMsg("EncounterStatusId","9999","I") endif
	endif
 
	;Estimated dates - validate dates as well as set dates and/or length of stay
	if(input->encounter.est_arrival_date_time > 0)
		if(input->encounter.est_discharge_date_time > 0)
			if(input->encounter.est_discharge_date_time < input->encounter.est_arrival_date_time)
				call ErrorMsg("EstimatedDischargeDateTime cannot be earlier than EstimatedArrivalDateTime.","9999","E")
			endif
			if(input->encounter.est_length_of_stay = 0)
				set input->encounter.est_length_of_stay = cnvtint(datetimediff(input->encounter.est_discharge_date_time,
					input->encounter.est_arrival_date_time))
			endif
		elseif(input->encounter.est_length_of_stay > 0)
			set input->encounter.est_discharge_date_time = datetimeadd(input->encounter.est_arrival_date_time,
				input->encounter.est_length_of_stay)
		endif
	elseif(input->encounter.est_discharge_date_time > 0)
		if(input->encounter.est_length_of_stay > 0)
			set days = input->encounter.est_length_of_stay - (2 * input->encounter.est_length_of_stay)
			set input->encounter.est_arrival_date_time = datetimeadd(input->encounter.est_discharge_date_time,days)
		endif
	endif
 
	;Validate GuarantorId if it exists
	if(input->encounter.guarantor_id > 0)
		if(ValidatePerson(input->encounter.guarantor_id) = 0)
			call ErrorMsg("GuarantorId","9999","I")
		endif
 
		;Validate GuarantorRealtionToPatientId
		set iRet = GetCodeSet(input->encounter.guarantor_reltn_to_patient)
		if(iRet != 40) call ErrorMsg("GuarantorRelationshipToPatientId","9999","I") endif
 
		;Validate GuarantorTypeId
		set iRet = GetCodeSet(input->encounter.guarantor_type_cd)
		if(iRet != 351)
			call ErrorMsg("GuarantorTypeCd","9999","I")
		else
			if(uar_get_code_meaning(input->encounter.guarantor_type_cd) not in ("DEFGUAR","GUARANTOR"))
				call ErrorMsg("GuarantorTypeId","9999","I")
			endif
		endif
	endif
 
	;Validate Insurance data
	set insSize = size(input->encounter.insurances,5)
	if(insSize > 0)
		for(i = 1 to insSize)
 
			;Get encntr_plan_reltn_id and person_plan_reltn_id if they exist
			select into "nl:"
			from encntr_plan_reltn epr
			plan epr where epr.encntr_id = input->encntr_id
				and epr.health_plan_id = input->encounter.insurances[i].subscriber_id
				and epr.active_ind = 1
				and epr.beg_effective_dt_tm <= sysdate
				and epr.end_effective_dt_tm > sysdate
			detail
				input->encounter.insurances[i].encntr_plan_reltn_id = epr.encntr_plan_reltn_id
				input->encounter.insurances[i].person_plan_reltn_id = epr.person_plan_reltn_id
			with nocounter
 
			;Validate EligiblityStatusCd
			set iRet = GetCodeSet(input->encounter.insurances[i].eligibility_status_cd)
			if(iRet != 26307) call ErrorMsg("EligibilityStatusId","9999","I") endif
 
			;Validate HealthPlan
			set iRet = 0
			select into "nl:"
			from health_plan hp
			where hp.health_plan_id = input->encounter.insurances[i].health_plan_id
				and hp.active_ind = 1
				and hp.beg_effective_dt_tm <= sysdate
				and hp.end_effective_dt_tm > sysdate
			detail
				iRet = 1
			with nocounter
			if(iRet = 0) call ErrorMsg("HealthPlanId","9999","I") endif
 
			;Validate Subscriber
			set iRet = ValidatePerson(input->encounter.insurances[i].subscriber_id)
			if(iRet = 0) call ErrorMsg("SubscriberId","9999","I") endif
 
			;Validate PatientRelationshipToSubscriberId
			if(input->encounter.insurances[i].patient_reltn_to_subscriber_cd > 0)
				set iRet = GetCodeSet(input->encounter.insurances[i].patient_reltn_to_subscriber_cd)
				if(iRet != 40) call ErrorMsg("Subscriber.PatientRelationshipToSubscriber","9999","I") endif
			endif
 
			;Validate SubscriberRelationToPatientId
			set iRet = GetCodeSet(input->encounter.insurances[i].subscriber_reltn_to_patient_cd)
			if(iRet != 40) call ErrorMsg("Subscriber.SubscriberRelationToPatientId","9999","I") endif
 
			;Validate AddressTypeId
			if(input->encounter.insurances[i].address.address_id > 0
			or input->encounter.insurances[i].address.address1 > " "
			or input->encounter.insurances[i].address.address2 > " "
			or input->encounter.insurances[i].address.city > " "
			or input->encounter.insurances[i].address.state > " "
			or input->encounter.insurances[i].address.county > " "
			or input->encounter.insurances[i].address.country > " "
			or input->encounter.insurances[i].address.zip > " ")
				set iRet = GetCodeSet(input->encounter.insurances[i].address.address_type_cd)
				if(iRet != 212) call ErrorMsg("Insurance.Address.TypeId","9999","I") endif
			endif
 
			;Validate AddressId
			if(input->encounter.insurances[i].address.address_id > 0)
				set iRet = 0
				select into "nl:"
				from address a
				where a.address_id = input->encounter.insurances[i].address.address_id
					and a.parent_entity_id = input->encounter.insurances[i].encntr_plan_reltn_id
				detail
					iRet = 1
				with nocounter
				if(iRet = 0) call ErrorMsg("Provider.AddressId","9999","I") endif
			endif
 
			; Get Zipcode defaults
			if(input->encounter.insurances[i].address.zip > " ")
				set stat = initrec(114382_req)
				set stat = initrec(114382_rep)
				call GetZipDefaults(input->encounter.insurances[i].address.zip)
				if(input->encounter.insurances[i].address.county_cd = 0)
					set input->encounter.insurances[i].address.county_cd = 114382_rep->county_cd
				endif
				if(input->encounter.insurances[i].address.county = "")
					set input->encounter.insurances[i].address.county = 114382_rep->county
				endif
				if(input->encounter.insurances[i].address.state_cd <= 0)
					set input->encounter.insurances[i].address.state_cd = 114382_rep->state_cd
				endif
			endif
 
			;Get Country
			if(input->encounter.insurances[i].address.country_cd = 0 or input->encounter.insurances[i].address.country = "")
				select into "nl:"
				from code_value_group cvg
				, code_value cv
				plan cvg where cvg.child_code_value = input->encounter.insurances[i].address.state_cd
				join cv where cv.code_value = cvg.parent_code_value
						and cv.code_set = 15
				detail
					if(input->encounter.insurances[i].address.country_cd <= 0)
						input->encounter.insurances[i].address.country_cd = cv.code_value
					endif
					if(input->encounter.insurances[i].address.country = "")
						input->encounter.insurances[i].address.country = cv.display
					endif
				with nocounter
			endif
 
			;Validate Phone Data
			set ipSize = size(input->encounter.insurances[i].phones,5)
			if(ipSize > 0)
				for(p = 1 to ipSize)
					;Validate TypeId
					set iRet = GetCodeSet(input->encounter.insurances[i].phones[p].phone_type_cd)
					if(iRet != 43) call ErrorMsg("Insurance.Phone.TypeId","9999","I") endif
 
					;Validate FormatType
					if(input->encounter.insurances[i].phones[p].format_id > 0)
						set iRet = GetCodeSet(input->encounter.insurances[i].phones[p].format_id)
						if(iRet != 281) call ErrorMsg("Insurance.Phone.FormatId","9999","I") endif
					endif
 
					;Validate PhoneId
					if(input->encounter.insurances[i].phones[p].phone_id > 0)
						set iRet = 0
						select into "nl:"
						from phone p
						where p.phone_id = input->encounter.insurances[i].phones[p].phone_id
							and p.parent_entity_id = input->encounter.insurances[i].encntr_plan_reltn_id
						detail
							iRet = 1
						with nocounter
						if(iRet = 0) call ErrorMsg("Provider.PhoneId","9999","I") endif
					endif
				endfor
			endif
 
		endfor
	endif
 
	;Validate TreatmentPhaseId
	if(input->encounter.treatment_phase_cd > 0)
		set iRet = GetCodeSet(input->treatment_phase_cd)
		if(iRet != 4018002) call ErrorMsg("TreatmentPhaseId","9999","I") endif
	endif
 
	;Validate PatientValuablesIds
	set vSize = size(input->valuables,5)
	if(vSize > 0)
		for(i = 1 to vSize)
			set iRet = GetCodeSet(input->valuables[i].value_cd)
			if(iRet != 14751) call ErrorMsg("PatientValuablesId","9999","I") endif
		endfor
	endif
 
 	;Validate custom fields
 	set customSize = size(input->custom_fields,5)
 	if(customSize > 0)
 		declare temp_date = vc
 		declare temp_time = vc
 		declare date_format = vc
 		set valsCnt = 0
 
 		for(i = 1 to customSize)
 			set iRet = GetCodeSet(input->custom_fields[i].field_id)
 			if(iRet = 356)
 				select into "nl:"
 				from code_value_extension cve
 				where cve.code_value = input->custom_fields[i].field_id
 				detail
 					case(cve.field_name)
 						of "CODE_SET": input->custom_fields[i].codeset = cnvtint(cve.field_value)
 						of "FIELD": input->custom_fields[i].field = trim(cve.field_value,3)
 						of "LENGTH": input->custom_fields[i].length = cnvtint(cve.field_value)
 						of "LEVEL": input->custom_fields[i].level = trim(cve.field_value,3)
 						of "TYPE": input->custom_fields[i].type = trim(cve.field_value,3)
					endcase
				with nocounter
 
	 			;Validate fieldtype CODE
				if(input->custom_fields[i].type = "CODE")
					set input->custom_fields[i].numeric_value = cnvtreal(input->custom_fields[i].text_value)
					if(input->custom_fields[i].numeric_value > 0)
 						set iRet = GetCodeSet(input->custom_fields[i].numeric_value)
 						if(iRet != input->custom_fields[i].codeset)
 							call ErrorMsg(build2(input->custom_fields[i].field_id,
 							" FieldId requires a coded value from codeset ", input->custom_fields[i].codeset),"9999","E")
 						endif
					else
						call ErrorMsg(build2(input->custom_fields[i].field_id," FieldId requires a coded value."),"9999","E")
					endif
				endif
 
				;Validate fieldtype STRING
				if(input->custom_fields[i].type = "STRING")
					if(input->custom_fields[i].length > 0 and textlen(input->custom_fields[i].text_value) > input->custom_fields[i].length)
					   call ErrorMsg(build2(input->custom_fields[i].field_id,
					   " FieldId has a max length of ",input->custom_fields[i].length ),"9999","E")
					endif
				endif
 
				;Validate fieldtype DATE
				if(input->custom_fields[i].type = "DATE")
				 	set temp_date = ""
 					set temp_time = ""
 					set date_format = ""
 
					set input->custom_fields[i].text_value = replace(input->custom_fields[i].text_value,"T"," ")
					set checkSpace = findstring(" ",input->custom_fields[i].text_value)
					if(checkSpace = 0)
						set temp_date = input->custom_fields[i].text_value
					else
						set temp_date = substring(1,checkSpace,input->custom_fields[i].text_value)
						set temp_time = substring(checkSpace + 1, textlen(input->custom_fields[i].text_value),
						input->custom_fields[i].text_value)
					endif
 
					set temp_date = trim(replace(temp_date,"/",""),3)
					set temp_time = trim(replace(temp_time,":",""),3)
 
					if(cnvtdate2(temp_date,"MMDDYY") != 0)
						set date_format = "MMDDYY"
					elseif(cnvtdate2(temp_date,"MMDDYYYY") != 0)
						set date_format = "MMDDYYYY"
					elseif(cnvtdate2(temp_date,"YYYYMMDD") != 0)
						set date_format = "YYYYMMDD"
					else
					   	call ErrorMsg(build2("Invalid Date format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
					endif
 
					if(temp_time > " ")
						if(textlen(temp_time) = 4)
							if(cnvtreal(temp_time) >= 2400)
								call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
							endif
						elseif(textlen(temp_time) = 6)
							if(cnvtreal(temp_time) >= 240000)
								call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
							endif
						else
							call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
						endif
					else
						set temp_time = "0"
					endif
 
					set input->custom_fields[i].date_value = cnvtdatetime(cnvtdate2(temp_date,date_format),cnvtint(temp_time))
				endif
 
				;Validate fieldtype NUMERIC
				if(input->custom_fields[i].type = "NUMERIC")
					if(cnvtreal(input->custom_fields[i].text_value) = 0)
						call ErrorMsg(build2(input->custom_fields[i].field_id," FieldId is a numeric field." ),"9999","E")
					else
						if(input->custom_fields[i].length > 0 and textlen(input->custom_fields[i].text_value) > input->custom_fields[i].length)
							call ErrorMsg(build2(input->custom_fields[i].field_id,
					   		" FieldId has a max length of ",input->custom_fields[i].length ),"9999","E")
						endif
 
						set input->custom_fields[i].numeric_value = cnvtreal(input->custom_fields[i].text_value)
					endif
				endif
 			else
 				call ErrorMsg("CustomFieldId","9999","I")
 			endif
 		endfor
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ValidatePerson(person_id = f8) = i2
;  Description: Validate the person id if prsnl or not
**************************************************************************/
subroutine ValidatePerson(person_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePerson Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from person p
	plan p where p.person_id = person_id
		and p.active_ind = 1
		and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and ( p.deceased_cd = value(uar_get_code_by("MEANING",268,"NO"))
			or p.deceased_cd = 0)
 	detail
		iValidate = 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidatePerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
 	return (iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateProvider(provider_id) = i2
;  Description:  Validates the provider is a valid person on the prsnl table.
**************************************************************************/
subroutine ValidateProvider(provider_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateProvider Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from prsnl_org_reltn por
	, prsnl pr
	plan por where por.person_id = provider_id
		and por.organization_id = input->encounter.location.organization_id
	join pr where pr.person_id = por.person_id
		and pr.active_ind = 1
		and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		;and pr.physician_ind = 1
	detail
		iValidate = iValidate + 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateProvider Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: SetFreetextProvider(null) = i2
;  Description: Add free text provider
**************************************************************************/
subroutine SetFreetextProvider(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("SetFreetextProvider Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 1
 
	set iApplication = 100000
	set iTask = 140001
	set iRequest = 140007
 
	;Setup request
	for(i = 1 to size(input->encounter.providers,5))
		if(input->encounter.providers[i].free_text_ind = 1)
			;Set Person Name
			set stat = alterlist(140007_req->person,1)
			set 140007_req->person[1].name_last = piece(input->encounter.providers[i].provider,",",1,"")
			set 140007_req->person[1].name_first = piece(input->encounter.providers[i].provider,",",2,"")
 
 			;Set Prsnl Name
			set stat = alterlist(140007_req->prsnl,1)
			set 140007_req->prsnl[1].name_last = piece(input->encounter.providers[i].provider,",",1,"")
			set 140007_req->prsnl[1].name_first = piece(input->encounter.providers[i].provider,",",2,"")
 
 			;Set Address
			if(input->encounter.providers[i].address.address_type_cd > 0)
				set 140007_req->address_qual = 1
				set stat = alterlist(140007_req->address,1)
				set 140007_req->address[1].address_type_cd = input->encounter.providers[i].address.address_type_cd
				set 140007_req->address[1].street_addr = input->encounter.providers[i].address.address1
				set 140007_req->address[1].street_addr2 = input->encounter.providers[i].address.address2
				set 140007_req->address[1].city = input->encounter.providers[i].address.city
				set 140007_req->address[1].state = input->encounter.providers[i].address.state
				set 140007_req->address[1].state_cd = input->encounter.providers[i].address.state_cd
				set 140007_req->address[1].zipcode = input->encounter.providers[i].address.zip
				set 140007_req->address[1].county = input->encounter.providers[i].address.county
				set 140007_req->address[1].county_cd = input->encounter.providers[i].address.county_cd
				set 140007_req->address[1].country = input->encounter.providers[i].address.country
				set 140007_req->address[1].country_cd = input->encounter.providers[i].address.country_cd
			endif
 
			;Set Phone
			set pSize = size(input->encounter.providers[i].phones,5)
			if(pSize > 0)
				for(p = 1 to pSize)
					set 140007_req->phone_qual = p
					set stat = alterlist(140007_req->phone,p)
					set 140007_req->phone[p].phone_type_cd = input->encounter.providers[i].phones[p].phone_type_cd
					set 140007_req->phone[p].phone_num = input->encounter.providers[i].phones[p].number
					set 140007_req->phone[p].extension = input->encounter.providers[i].phones[p].extension
					set 140007_req->phone[p].phone_format_cd = input->encounter.providers[i].phones[p].format_id
				endfor
			endif
 
			;Set email
			if(input->encounter.providers[i].email > " ")
				set 140007_req->prsnl[1].email = input->encounter.providers[i].email
			endif
 
			;Set NPI
			if(input->encounter.providers[i].npi > " ")
				set 140007_req->prsnl_alias_qual = 1
				set stat = alterlist(140007_req->prsnl_alias,1)
				set 140007_req->prsnl_alias[1].prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
				set 140007_req->prsnl_alias[1].alias = input->encounter.providers[i].npi
 
				select into "nl:"
			 	from prsnl_org_reltn por
			 		, org_alias_pool_reltn oapr
			 	plan por where por.person_id = input->prsnl_id
			 		and por.active_ind = 1
			 		and por.beg_effective_dt_tm <= sysdate
			 		and por.end_effective_dt_tm > sysdate
			 	join oapr where oapr.organization_id = por.organization_id
			 		and oapr.alias_entity_name = "PRSNL_ALIAS"
			 		and oapr.alias_entity_alias_type_cd = c_npi_prsnl_alias_type_cd
			 		and oapr.active_ind = 1
			 		and oapr.beg_effective_dt_tm <= sysdate
			 		and oapr.end_effective_dt_tm > sysdate
			 	detail
			 		140007_req->prsnl_alias[1].alias_pool_cd = oapr.alias_pool_cd
			 	with nocounter
			 endif
 
			;Execute request
			set stat = tdbexecute(iApplication,iTask,iRequest,"REC",140007_req,"REC",140007_rep)
 
			if(140007_rep->status_data.status = "F")
				set iValidate = 0
			else
				;Set new person id
				set input->encounter.providers[i].provider_id = 140007_rep->person[1].person_id
			endif
		endif
 	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("SetFreetextProvider Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateLocations(null) = null
;  Description: Validate each location field is correct based on type
**************************************************************************/
subroutine ValidateLocations(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateLocations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate Bed
	if(input->encounter.location.bed_cd > 0)
		set iRet = GetCodeSet(input->encounter.location.bed_cd)
		if(iRet = 220)
			set dCheck = GetLocationType(input->encounter.location.bed_cd)
			if(dCheck != c_bed_location_type_cd)
				call ErrorMsg("BedId","9999","I")
			endif
		else
			call ErrorMsg("BedId","9999","I")
		endif
 
		;Set Room if not set
		if(input->encounter.location.room_cd = 0)
			select into "nl:"
			from location_group lg
			where lg.child_loc_cd = input->encounter.location.bed_cd
				and lg.location_group_type_cd = c_room_location_type_cd
			detail
				input->encounter.location.room_cd = lg.parent_loc_cd
			with nocounter
		endif
	endif
 
	; Validate Room
	if(input->encounter.location.room_cd > 0)
		set iRet = GetCodeSet(input->encounter.location.room_cd)
		if(iRet = 220)
			set dCheck = GetLocationType(input->encounter.location.room_cd)
			if(dCheck != c_room_location_type_cd)
				call ErrorMsg("RoomId","9999","I")
			endif
		else
			call ErrorMsg("RoomId","9999","I")
		endif
 
		;Set Unit Code if not set
		if(input->encounter.location.unit_cd = 0)
			select into "nl:"
			from location_group lg
			where lg.child_loc_cd = input->encounter.location.room_cd
				and lg.location_group_type_cd in (c_ambunit_location_type_cd, c_nurseunit_location_type_cd)
			detail
				input->encounter.location.unit_cd = lg.parent_loc_cd
			with nocounter
		endif
	endif
 
	; Validate Unit
	if(input->encounter.location.unit_cd > 0)
		set iRet = GetCodeSet(input->encounter.location.unit_cd)
		if(iRet = 220)
			set dCheck = GetLocationType(input->encounter.location.unit_cd)
			if(dCheck not in(c_ambunit_location_type_cd, c_nurseunit_location_type_cd))
				call ErrorMsg("UnitId","9999","I")
			endif
		else
			call ErrorMsg("UnitId","9999","I")
		endif
 
		;Set Building Code
		select into "nl:"
		from location_group lg
		where lg.child_loc_cd = input->encounter.location.unit_cd
			and lg.location_group_type_cd = c_building_location_type_cd
		detail
			input->encounter.location.building_cd = lg.parent_loc_cd
		with nocounter
 
		;Set Facility if Blank
		if(input->encounter.location.facility_cd = 0)
			select into "nl:"
			from location_group lg
			where lg.child_loc_cd = input->encounter.location.building_cd
				and lg.location_group_type_cd = c_facility_location_type_cd
			detail
				input->encounter.location.facility_cd = lg.parent_loc_cd
			with nocounter
		endif
	endif
 
	; Validate Facility
	set dCheck = GetLocationType(input->encounter.location.facility_cd)
	if(dCheck != c_facility_location_type_cd)
		call ErrorMsg("HospitalId","9999","I")
	endif
 
	; Verify the codes provided line up in the hierarchy
	set check = 0
	select
		if(input->encounter.location.bed_cd > 0)
			from location_group bldg
			, location_group unit
			, location_group room
			, location_group bed
			plan bed where bed.child_loc_cd = input->encounter.location.bed_cd
				and bed.active_ind = 1
				and bed.beg_effective_dt_tm <= sysdate
				and bed.end_effective_dt_tm > sysdate
			join room where room.child_loc_cd = bed.parent_loc_cd
				and room.child_loc_cd = input->encounter.location.room_cd
				and room.active_ind = 1
				and room.beg_effective_dt_tm <= sysdate
				and room.end_effective_dt_tm > sysdate
			join unit where unit.child_loc_cd = room.parent_loc_cd
				and unit.child_loc_cd = input->encounter.location.unit_cd
				and unit.active_ind = 1
				and unit.beg_effective_dt_tm <= sysdate
				and unit.end_effective_dt_tm > sysdate
			join bldg where bldg.child_loc_cd = unit.parent_loc_cd
				and bldg.child_loc_cd = input->encounter.location.building_cd
				and bldg.parent_loc_cd = input->encounter.location.facility_cd
				and bldg.active_ind = 1
				and bldg.beg_effective_dt_tm <= sysdate
				and bldg.end_effective_dt_tm > sysdate
		elseif(input->encounter.location.room_cd > 0)
			from location_group bldg
			, location_group unit
			, location_group room
			plan room where room.child_loc_cd = input->encounter.location.room_cd
				and room.active_ind = 1
				and room.beg_effective_dt_tm <= sysdate
				and room.end_effective_dt_tm > sysdate
			join unit where unit.child_loc_cd = room.parent_loc_cd
				and unit.child_loc_cd = input->encounter.location.unit_cd
				and unit.active_ind = 1
				and unit.beg_effective_dt_tm <= sysdate
				and unit.end_effective_dt_tm > sysdate
			join bldg where bldg.child_loc_cd = unit.parent_loc_cd
				and bldg.child_loc_cd = input->encounter.location.building_cd
				and bldg.parent_loc_cd = input->encounter.location.facility_cd
				and bldg.active_ind = 1
				and bldg.beg_effective_dt_tm <= sysdate
				and bldg.end_effective_dt_tm > sysdate
		elseif(input->encounter.location.unit_cd > 0)
			from location_group bldg
			, location_group unit
			plan unit where unit.child_loc_cd = input->encounter.location.unit_cd
				and unit.active_ind = 1
				and unit.beg_effective_dt_tm <= sysdate
				and unit.end_effective_dt_tm > sysdate
			join bldg where bldg.child_loc_cd = unit.parent_loc_cd
				and bldg.child_loc_cd = input->encounter.location.building_cd
				and bldg.parent_loc_cd = input->encounter.location.facility_cd
				and bldg.active_ind = 1
				and bldg.beg_effective_dt_tm <= sysdate
				and bldg.end_effective_dt_tm > sysdate
		elseif(input->encounter.location.building_cd > 0)
			from location_group bldg
			plan bldg where bldg.child_loc_cd = input->encounter.location.building_cd
				and bldg.child_loc_cd = input->encounter.location.building_cd
				and bldg.parent_loc_cd = input->encounter.location.facility_cd
				and bldg.active_ind = 1
				and bldg.beg_effective_dt_tm <= sysdate
				and bldg.end_effective_dt_tm > sysdate
		else
			from location l
			plan l where l.location_cd = input->encounter.location.facility_cd
				and l.location_type_cd = c_facility_location_type_cd
				and l.active_ind = 1
				and l.beg_effective_dt_tm <= sysdate
				and l.end_effective_dt_tm > sysdate
		endif
	detail
		check = 1
	with nocounter
 
	if(check = 0)
		call ErrorMsg("Facility and child locations aren't associated","9999","E")
	endif
 
	; Get Location Census - Bed must be available - Request 114356
	if(input->encounter.location.unit_cd > 0 and input->encounter.location.room_cd > 0 and input->encounter.location.bed_cd > 0)
		set iRet = GetLocCensus(null)
		if(iRet = 0) call ErrorMsg("Could not retrieve location census","9999","E") endif
	endif
 
	; Set Organization Id
	select into "nl:"
	from location l
	where l.location_cd = input->encounter.location.facility_cd
	detail
		input->encounter.location.organization_id = l.organization_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocationType(location_cd) = f8
;  Description: Returns the location_type_cd from the location table
**************************************************************************/
subroutine GetLocationType(location_cd)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocationType Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare type_cd = f8
 
	select into "nl:"
	from location l
	where l.location_cd = location_cd
	detail
		type_cd = l.location_type_cd
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocationType Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(type_cd)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocCensus(null) = i2
;  Description: Request 114356 - Gets available bed information per location
**************************************************************************/
subroutine GetLocCensus(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocCensus Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 100000
	set iTask = 100003
 	set iRequest = 114356
 
	; Setup request
	set 114356_req->facility_cd = input->encounter.location.facility_cd
	set 114356_req->building_cd = input->encounter.location.building_cd
	set 114356_req->nurse_unit_or_amb_cd = input->encounter.location.unit_cd
	set 114356_req->room_cd = input->encounter.location.room_cd
 
	if(input->encounter.location.bed_cd > 0)
 		set stat = alterlist(114356_req->bed,1)
	 	set 114356_req->bed[1].bed_cd = input->encounter.location.bed_cd
	endif
 
	; Execute Request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",114356_req,"REC",114356_rep)
	if(114356_rep->status_data.status = "S")
		set iValidate = 1
		for(i = 1 to size(114356_rep->room[1].bed,5))
			if(114356_rep->room[1].bed[1].bed_status_mean != "AVAILABLE")
				if(114356_rep->room[1].bed[1].encntr_id != input->encntr_id)
					call ErrorMsg("The BedId is occupied. Please choose another bed location.","9999","E")
				endif
			endif
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocCensus Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetZipDefaults(zipcode = vc)	= null 114382 - PM_GET_ZIPCODE_DEFAULTS
;  Description: Gets data based on zipcode
**************************************************************************/
subroutine GetZipDefaults(zipcode)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetZipDefaults Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 100000
	set iTask = 100003
	set iRequest = 114382
 
	;Set request params
	set 114382_req->zipcode = zipcode
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114382_req,"REC",114382_rep)
 
	if(iDebugFlag > 0)
		call echo(concat("GetZipDefaults Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetAliasPools(null) = i2
;  Description: Get FIN NBR alias pool listing for the facility
**************************************************************************/
subroutine GetAliasPools(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPools Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from prsnl_org_reltn por
 		, org_alias_pool_reltn oapr
 		, location l
 		, organization o
 		, alias_pool ap
 	plan por where por.person_id = input->prsnl_id
 		and por.active_ind = 1
 		and por.beg_effective_dt_tm <= sysdate
 		and por.end_effective_dt_tm > sysdate
 	join oapr where oapr.organization_id = por.organization_id
 		and oapr.alias_entity_name = "ENCNTR_ALIAS"
 		and oapr.alias_entity_alias_type_cd = c_finnbr_encntr_alias_type_cd
 		and oapr.active_ind = 1
 		and oapr.beg_effective_dt_tm <= sysdate
 		and oapr.end_effective_dt_tm > sysdate
 	join l where l.location_cd = input->facility_cd
 		and l.organization_id = oapr.organization_id
 		and l.active_ind = 1
 		and l.beg_effective_dt_tm <= sysdate
 		and l.end_effective_dt_tm > sysdate
 	join o where o.organization_id = oapr.organization_id
 		and o.active_ind = 1
 		and o.beg_effective_dt_tm <= sysdate
 		and o.end_effective_dt_tm > sysdate
 	join ap where ap.alias_pool_cd = oapr.alias_pool_cd
 		and ap.active_ind = 1
 		and ap.beg_effective_dt_tm <= sysdate
 		and ap.end_effective_dt_tm > sysdate
 	order by oapr.alias_pool_cd
 	head report
 		x = 0
	head oapr.alias_pool_cd
		iValidate = 1
 
		x = x + 1
		stat = alterlist(input->alias_pools,x)
 
		input->alias_pools[x].alias_pool_cd = oapr.alias_pool_cd
		input->alias_pools[x].alias_type_cd = oapr.alias_entity_alias_type_cd
		input->alias_pools[x].dup_allowed_flag = ap.dup_allowed_flag
		input->alias_pools[x].sys_assign_flag = ap.sys_assign_flag
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetAliasPools Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;	Name: ;  GetHealthPlanInfo(null) = i2  - 4130034 - oaf_get_plan_info
;	Description: Gets health plan information
**************************************************************************/
subroutine GetHealthPlanInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetHealthPlanInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 100000
	set iTask = 4130034
	set iRequest = 4130034
 
	set iValidate = 1
	for(i = 1 to size(arglist->encounter.insurances,5))
 
		;Initialize records
		set stat = initrec(4130034_req)
		set stat = initrec(4130034_rep)
 
		;Setup request
		set check = 0
		select into "nl:"
		from org_plan_reltn opr
		plan opr where opr.health_plan_id = input->encounter.insurances[i].health_plan_id
			and opr.active_ind = 1
			and opr.beg_effective_dt_tm <= sysdate
			and opr.end_effective_dt_tm > sysdate
		detail
			check = 1
 			input->encounter.insurances[i].org_plan_reltn_cd = opr.org_plan_reltn_cd
 
			4130034_req->health_plan_id = opr.health_plan_id
			4130034_req->organization_id = opr.organization_id
			4130034_req->org_plan_reltn_cdf_mean = uar_get_code_meaning(opr.org_plan_reltn_cd)
			4130034_req->phone_address_ind = 1
			4130034_req->hp_financial_ind = 1
		with nocounter
 
		if(check = 0) call ErrorMsg("The health plan provided isn't tied to an organization.","9999","E") endif
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",4130034_req,"REC",4130034_rep)
 
		if(4130034_rep->status_data.status = "F")
			set iValidate = 0
		else
			set hpSize = health_plan_data->health_plan_qual + 1
			set health_plan_data->health_plan_qual = hpSize
			set stat = alterlist(health_plan_data->health_plan,hpSize)
			set stat = movereclist(4130034_rep->health_plan,health_plan_data->health_plan,1,hpSize,1,false)
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetHealthPlanInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocks(null) = i2
;  Description: Request 100080 - Get patient locks
**************************************************************************/
subroutine GetLocks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100080
 
 	; Setup request
	set 100080_req->person_id = input->patient_id
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		if(size(100080_rep->person,5) = 0)
			set iValidate = 1
		else
			call ErrorMsg("Person is locked. Please try updating again later.","9999","E")
		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2
;  Description:  Request 100081 - create patient lock
**************************************************************************/
subroutine AddLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100081
 
	set 100081_req->person_id = input->patient_id
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100081_req,"REC",100081_rep)
	if(100081_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostEncounter(null) = null
;  Description:  Request 3200154 - post a new encounter
**************************************************************************/
subroutine PostEncounter(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostEncounter Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Guarantor
	;Check if guarantor already exists. This will prevent duplicate guarantors
	set idx = 1
	set pos = locateval(idx,1,size(pm_obj_req->person.person_person_reltn,5),
		input->encounter.guarantor_id,pm_obj_req->person.person_person_reltn[idx].related_person_id,
		input->encounter.guarantor_type_cd,pm_obj_req->person.person_person_reltn[idx].person_reltn_type_cd)
	if(pos > 0)
		set pm_obj_req->person.person_person_reltn[pos].update_reltn_ind = 1
		set pm_obj_req->person.person_person_reltn[pos].person_reltn_cd = input->encounter.guarantor_reltn_to_patient
	else
		set pprSize = size(pm_obj_req->person.person_person_reltn,5) + 1
		set stat = alterlist(pm_obj_req->person.person_person_reltn,pprSize)
		set pm_obj_req->person.person_person_reltn[pprSize].update_reltn_ind = 1
		set pm_obj_req->person.person_person_reltn[pprSize].person_reltn_type_cd = input->encounter.guarantor_type_cd
		set pm_obj_req->person.person_person_reltn[pprSize].person_reltn_cd = input->encounter.guarantor_reltn_to_patient
		set pm_obj_req->person.person_person_reltn[pprSize].related_person_id = input->encounter.guarantor_id
	endif
 
 	; Insurance/Subscriber
 	set insSize = size(input->encounter.insurances,5)
 	set idx = 1
 	if(insSize > 0)
		select into "nl:"
			subscriberid = input->encounter.insurances[d.seq].subscriber_id,
			planid = input->encounter.insurances[d.seq].health_plan_id
		from (dummyt d with seq = insSize)
		plan d
		order by subscriberid,planid
		head subscriberid
			p = 0
 			x = 0
			pos = locateval(idx,1,size(pm_obj_req->person.person_person_reltn,5),
				input->encounter.insurances[d.seq].subscriber_id,pm_obj_req->person.person_person_reltn[idx].related_person_id,
				c_insured_person_reltn_type_cd,pm_obj_req->person.person_person_reltn[idx].person_reltn_type_cd)
			if(pos > 0)
				pm_obj_req->person.person_person_reltn[pos].update_reltn_ind = 1
				pm_obj_req->person.person_person_reltn[pos].person_reltn_cd =
					input->encounter.insurances[d.seq].subscriber_reltn_to_patient_cd
				pm_obj_req->person.person_person_reltn[pos].related_person_reltn_cd =
					input->encounter.insurances[d.seq].patient_reltn_to_subscriber_cd
			else
				pprSize = size(pm_obj_req->person.person_person_reltn,5) + 1
				stat = alterlist(pm_obj_req->person.person_person_reltn,pprSize)
 
 				pm_obj_req->person.person_person_reltn[pprSize].update_reltn_ind = 1
				pm_obj_req->person.person_person_reltn[pprSize].person_reltn_type_cd = c_insured_person_reltn_type_cd
				pm_obj_req->person.person_person_reltn[pprSize].person_reltn_cd =
					input->encounter.insurances[d.seq].subscriber_reltn_to_patient_cd
				pm_obj_req->person.person_person_reltn[pprSize].related_person_reltn_cd =
					input->encounter.insurances[d.seq].patient_reltn_to_subscriber_cd
				pm_obj_req->person.person_person_reltn[pprSize].related_person_id =
					input->encounter.insurances[d.seq].subscriber_id
 
				;Following fields make it so the reltn is just encounter and not person - possible future functionality
				;pm_obj_req->person.person_person_reltn[pprSize]encntr_only_ind = 1
				;pm_obj_req->person.person_person_reltn[pprSize]encntr_updt_flag = 1
			endif
		head planid
			;Health Plan
 
			;If pos > 0 subscriber exists
			if(pos > 0)
				x = pos
				hpSize = size(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn,5)
				hpos = locateval(idx,1,hpSize,input->encounter.insurances[d.seq].encntr_plan_reltn_id,
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[idx].encntr_plan_reltn_id)
			else
				x = pprSize
				hpos = 0
				stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn,0)
			endif
 
			if(hpos > 0) ;existing health plan updated
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].person_id =
					pm_obj_req->person.person_person_reltn[x].related_person_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].policy_nbr =
					input->encounter.insurances[d.seq].policy_number
				;Plan Info
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].plan_info.eligibility_status_cd =
					input->encounter.insurances[d.seq].eligibility_status_cd
				;Org Plan
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].org_plan.org_plan_reltn_cd =
					input->encounter.insurances[d.seq].org_plan_reltn_cd
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].org_plan.group_nbr =
					input->encounter.insurances[d.seq].group_number
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].org_plan.group_name =
					input->encounter.insurances[d.seq].group_name
				;Address
				if(input->encounter.insurances[d.seq].address.address1 > " "
				or input->encounter.insurances[d.seq].address.city > " "
				or input->encounter.insurances[d.seq].address.state > " "
				or input->encounter.insurances[d.seq].address.zip > " ")
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.address_type_cd =
						input->encounter.insurances[d.seq].address.address_type_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.street_addr =
						input->encounter.insurances[d.seq].address.address1
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.street_addr2 =
						input->encounter.insurances[d.seq].address.address2
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.city =
						input->encounter.insurances[d.seq].address.city
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.state =
						input->encounter.insurances[d.seq].address.state
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.state_cd =
						input->encounter.insurances[d.seq].address.state_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.zipcode =
						input->encounter.insurances[d.seq].address.zip
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.county =
						input->encounter.insurances[d.seq].address.county
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.county_cd =
						input->encounter.insurances[d.seq].address.county_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.country =
						input->encounter.insurances[d.seq].address.country
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].address.country_cd =
						input->encounter.insurances[d.seq].address.country_cd
				endif
 
				;Phone
				phSize =  size(input->encounter.insurances[d.seq].phones,5)
				if(phSize > 0)
					for(ph = 1 to phSize)
						if(ph = 1)
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].phone.phone_type_cd =
								input->encounter.insurances[d.seq].phones[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].phone.phone_num =
								input->encounter.insurances[d.seq].phones[ph].number
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].phone.extension =
								input->encounter.insurances[d.seq].phones[ph].extension
						else
							x = ph - 1
							stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].addtnl_phone,x)
 
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].addtnl_phone[x].phone_type_cd =
								input->encounter.insurances[d.seq].phones[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].addtnl_phone[x].phone_num =
								input->encounter.insurances[d.seq].phones[ph].number
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[hpos].addtnl_phone[x].extension =
								input->encounter.insurances[d.seq].phones[ph].extension
						endif
					endfor
				endif
			else ;health plan doesn't exist so new one added
				p = p + 1
				idx = 1
				hp = locateval(idx,1,health_plan_data->health_plan_qual,input->encounter.insurances[d.seq].health_plan_id,
					health_plan_data->health_plan[idx].health_plan_id)
 
				stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn,p)
 
 				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].person_id =
					pm_obj_req->person.person_person_reltn[x].related_person_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].health_plan_id =
					health_plan_data->health_plan[hp].health_plan_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].organization_id =
					health_plan_data->health_plan[hp].organization_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].priority_seq = p
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].policy_nbr =
					input->encounter.insurances[d.seq].policy_number
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].beg_effective_dt_tm =
					health_plan_data->health_plan[hp].beg_effective_dt_tm
 
				;Plan Info
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.health_plan_id =
					health_plan_data->health_plan[hp].health_plan_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.plan_type_cd =
					health_plan_data->health_plan[hp].plan_type_cd
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.plan_name =
					health_plan_data->health_plan[hp].plan_name
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.plan_desc =
					health_plan_data->health_plan[hp].plan_desc
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.financial_class_cd =
					health_plan_data->health_plan[hp].financial_class_cd
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.plan_class_cd =
					health_plan_data->health_plan[hp].plan_class_cd
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].plan_info.eligibility_status_cd =
					input->encounter.insurances[d.seq].eligibility_status_cd
 
				;Org Info
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_info.organization_id =
					health_plan_data->health_plan[hp].organization_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_info.org_name =
					health_plan_data->health_plan[hp].org_name
 
				;Org Plan
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_plan.health_plan_id =
					health_plan_data->health_plan[hp].health_plan_id
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_plan.org_plan_reltn_cd =
					input->encounter.insurances[d.seq].org_plan_reltn_cd
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_plan.group_nbr =
					input->encounter.insurances[d.seq].group_number
				pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].org_plan.group_name =
					input->encounter.insurances[d.seq].group_name
 
				;Address
				if(input->encounter.insurances[d.seq].address.address1 > " "
				or input->encounter.insurances[d.seq].address.city > " "
				or input->encounter.insurances[d.seq].address.state > " "
				or input->encounter.insurances[d.seq].address.zip > " ")
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.address_type_cd =
						input->encounter.insurances[d.seq].address.address_type_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.street_addr =
						input->encounter.insurances[d.seq].address.address1
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.street_addr2 =
						input->encounter.insurances[d.seq].address.address2
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.city =
						input->encounter.insurances[d.seq].address.city
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.state =
						input->encounter.insurances[d.seq].address.state
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.state_cd =
						input->encounter.insurances[d.seq].address.state_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.zipcode =
						input->encounter.insurances[d.seq].address.zip
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.county =
						input->encounter.insurances[d.seq].address.county
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.county_cd =
						input->encounter.insurances[d.seq].address.county_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.country =
						input->encounter.insurances[d.seq].address.country
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.country_cd =
						input->encounter.insurances[d.seq].address.country_cd
				else
					ha = locateval(idx,1,size(health_plan_data->health_plan[hp].address,5),c_business_address_type_cd,
					health_plan_data->health_plan[hp].address[idx].address_type_cd)
 
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.address_type_cd =
						health_plan_data->health_plan[hp].address[ha].address_type_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.street_addr =
						health_plan_data->health_plan[hp].address[ha].street_addr
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.street_addr2 =
						health_plan_data->health_plan[hp].address[ha].street_addr2
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.city =
						health_plan_data->health_plan[hp].address[ha].city
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.state =
						health_plan_data->health_plan[hp].address[ha].state
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.state_cd =
						health_plan_data->health_plan[hp].address[ha].state_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.zipcode =
						health_plan_data->health_plan[hp].address[ha].zipcode
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.county =
						health_plan_data->health_plan[hp].address[ha].county
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.county_cd =
						health_plan_data->health_plan[hp].address[ha].county_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.country =
						health_plan_data->health_plan[hp].address[ha].country
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.country_cd =
						health_plan_data->health_plan[hp].address[ha].country_cd
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.beg_effective_dt_tm =
						health_plan_data->health_plan[hp].address[ha].beg_effective_dt_tm
					pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].address.end_effective_dt_tm =
						health_plan_data->health_plan[hp].address[ha].end_effective_dt_tm
				endif
 
				;Phone
				phSize =  size(input->encounter.insurances[d.seq].phones,5)
				if(phSize > 0)
					for(ph = 1 to phSize)
						if(ph = 1)
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_type_cd =
								input->encounter.insurances[d.seq].phones[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_num =
								input->encounter.insurances[d.seq].phones[ph].number
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.extension =
								input->encounter.insurances[d.seq].phones[ph].extension
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_format_cd =
								input->encounter.insurances[d.seq].phones[ph].format_id
						else
							x = ph - 1
							stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone,x)
 
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
								input->encounter.insurances[d.seq].phones[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
								input->encounter.insurances[d.seq].phones[ph].number
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].extension =
								input->encounter.insurances[d.seq].phones[ph].extension
							pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
								input->encounter.insurances[d.seq].phones[ph].format_id
						endif
					endfor
				else
					hphSize =  size(health_plan_data->health_plan[hp].phone,5)
					if(hphSize > 0)
						for(ph = 1 to hphSize)
							if(ph = 1)
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_type_cd =
									health_plan_data->health_plan[hp].phone[ph].phone_type_cd
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_num =
									health_plan_data->health_plan[hp].phone[ph].phone_num
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.extension =
									health_plan_data->health_plan[hp].phone[ph].extension
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].phone.phone_format_cd =
									health_plan_data->health_plan[hp].phone[ph].phone_format_cd
							else
								x = ph - 1
								stat = alterlist(pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone,x)
 
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
									health_plan_data->health_plan[hp].phone[ph].phone_type_cd
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
									health_plan_data->health_plan[hp].phone[ph].phone_num
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].extension =
									health_plan_data->health_plan[hp].phone[ph].extension
								pm_obj_req->person.person_person_reltn[x].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
									health_plan_data->health_plan[hp].phone[ph].phone_format_cd
							endif
						endfor
					endif
				endif
			endif
		with nocounter ;End Insurance/Subscriber
	endif
 
 	;Update Related Persons Person object
 	for(i = 1 to size(pm_obj_req->person.person_person_reltn,5))
 		if(pm_obj_req->person.person_person_reltn[i].encntr_person_reltn_id = 0 and
 			pm_obj_req->person.person_person_reltn[i].update_reltn_ind = 1)
			;Person
			select into "nl:"
			from person p
			where p.person_id = pm_obj_req->person.person_person_reltn[i].related_person_id
			detail
				pm_obj_req->person.person_person_reltn[i].person.person.person_id = p.person_id
				pm_obj_req->person.person_person_reltn[i].person.person.create_dt_tm = cnvtdatetime(p.create_dt_tm)
				pm_obj_req->person.person_person_reltn[i].person.person.create_prsnl_id = p.create_prsnl_id
				pm_obj_req->person.person_person_reltn[i].person.person.name_last_key = p.name_last_key
				pm_obj_req->person.person_person_reltn[i].person.person.name_first_key = p.name_first_key
				pm_obj_req->person.person_person_reltn[i].person.person.name_full_formatted = p.name_full_formatted
				pm_obj_req->person.person_person_reltn[i].person.person.name_middle_key = p.name_middle_key
				pm_obj_req->person.person_person_reltn[i].person.person.name_first_synonym_id = p.name_first_synonym_id
				pm_obj_req->person.person_person_reltn[i].person.person.person_type_cd = p.person_type_cd
				pm_obj_req->person.person_person_reltn[i].person.person.autopsy_cd = p.autopsy_cd
				pm_obj_req->person.person_person_reltn[i].person.person.birth_dt_cd = p.birth_dt_cd
				pm_obj_req->person.person_person_reltn[i].person.person.birth_dt_tm = cnvtdatetime(p.birth_dt_tm)
				pm_obj_req->person.person_person_reltn[i].person.person.conception_dt_tm = cnvtdatetime(p.conception_dt_tm)
				pm_obj_req->person.person_person_reltn[i].person.person.confid_level_cd = p.confid_level_cd
				pm_obj_req->person.person_person_reltn[i].person.person.cause_of_death = p.cause_of_death
				pm_obj_req->person.person_person_reltn[i].person.person.cause_of_death_cd = p.cause_of_death_cd
				pm_obj_req->person.person_person_reltn[i].person.person.citizenship_cd = p.citizenship_cd
				pm_obj_req->person.person_person_reltn[i].person.person.data_status_cd = p.data_status_cd
				pm_obj_req->person.person_person_reltn[i].person.person.deceased_cd = p.deceased_cd
				pm_obj_req->person.person_person_reltn[i].person.person.deceased_source_cd = p.deceased_source_cd
				pm_obj_req->person.person_person_reltn[i].person.person.deceased_dt_tm = cnvtdatetime(p.deceased_dt_tm)
				pm_obj_req->person.person_person_reltn[i].person.person.ethnic_grp_cd = p.ethnic_grp_cd
				pm_obj_req->person.person_person_reltn[i].person.person.ft_entity_id = p.ft_entity_id
				pm_obj_req->person.person_person_reltn[i].person.person.ft_entity_name = p.ft_entity_name
				pm_obj_req->person.person_person_reltn[i].person.person.language_cd = p.language_cd
				pm_obj_req->person.person_person_reltn[i].person.person.marital_type_cd = p.marital_type_cd
				pm_obj_req->person.person_person_reltn[i].person.person.purge_option_cd = p.purge_option_cd
				pm_obj_req->person.person_person_reltn[i].person.person.mother_maiden_name = p.mother_maiden_name
				pm_obj_req->person.person_person_reltn[i].person.person.nationality_cd = p.nationality_cd
				pm_obj_req->person.person_person_reltn[i].person.person.race_cd = p.race_cd
				pm_obj_req->person.person_person_reltn[i].person.person.religion_cd = p.religion_cd
				pm_obj_req->person.person_person_reltn[i].person.person.species_cd = p.species_cd
				pm_obj_req->person.person_person_reltn[i].person.person.sex_cd = p.sex_cd
				pm_obj_req->person.person_person_reltn[i].person.person.sex_age_change_ind = p.sex_age_change_ind
				pm_obj_req->person.person_person_reltn[i].person.person.language_dialect_cd = p.language_dialect_cd
				pm_obj_req->person.person_person_reltn[i].person.person.name_last = p.name_last
				pm_obj_req->person.person_person_reltn[i].person.person.name_first = p.name_first
				pm_obj_req->person.person_person_reltn[i].person.person.name_middle = p.name_middle
				pm_obj_req->person.person_person_reltn[i].person.person.name_phonetic = p.name_phonetic
				pm_obj_req->person.person_person_reltn[i].person.person.last_encntr_dt_tm = cnvtdatetime(p.last_encntr_dt_tm)
				pm_obj_req->person.person_person_reltn[i].person.person.military_rank_cd = p.military_rank_cd
				pm_obj_req->person.person_person_reltn[i].person.person.military_service_cd = p.military_service_cd
				pm_obj_req->person.person_person_reltn[i].person.person.military_base_location = p.military_base_location
				pm_obj_req->person.person_person_reltn[i].person.person.vet_military_status_cd = p.vet_military_status_cd
				pm_obj_req->person.person_person_reltn[i].person.person.vip_cd = p.vip_cd
				pm_obj_req->person.person_person_reltn[i].person.person.birth_tz = p.birth_tz
				pm_obj_req->person.person_person_reltn[i].person.person.birth_tz_disp = datetimezonebyindex(p.birth_tz)
				pm_obj_req->person.person_person_reltn[i].person.person.birth_prec_flag = p.birth_prec_flag
				pm_obj_req->person.person_person_reltn[i].person.person.raw_birth_dt_tm = cnvtdatetimeutc(p.birth_dt_tm)
			with nocounter
		endif
	endfor
 
 	;Person level User Defined Fields
 	set pudfSize = size(input->custom_fields,5)
 	if(pudfSize > 0)
 		set idx = 1
 		for(i = 1 to pudfSize)
 			if(input->custom_fields[i].level = "PERSON")
 				set pos = locateval(idx,1,size(pm_obj_req->person.person_info,5),input->custom_fields[i].field_id,
 					pm_obj_req->person.person_info[idx].info_sub_type_cd)
 
 				if(pos > 0)
 					case(input->custom_fields[i].type)
 						of "STRING": set pm_obj_req->person.person_info[pos].long_text = input->custom_fields[i].text_value
						of "DATE": set pm_obj_req->person.person_info[pos].value_dt_tm = input->custom_fields[i].date_value
						of "NUMERIC": set pm_obj_req->person.person_info[pos].value_numeric = input->custom_fields[i].numeric_value
						of "CODE": set pm_obj_req->person.person_info[pos].value_cd = input->custom_fields[i].numeric_value
					endcase
 				else
 					set piSize = size(pm_obj_req->person.person_info,5) + 1
 					set stat = alterlist(pm_obj_req->person.person_info,piSize)
 
 					set pm_obj_req->person.person_info[piSize].info_sub_type_cd = input->custom_fields[i].field_id
 					set pm_obj_req->person.person_info[piSize].info_type_cd = c_userdefined_info_type_cd
 
 					case(input->custom_fields[i].type)
 						of "STRING": set pm_obj_req->person.person_info[piSize].long_text = input->custom_fields[i].text_value
						of "DATE": set pm_obj_req->person.person_info[piSize].value_dt_tm = input->custom_fields[i].date_value
						of "NUMERIC": set pm_obj_req->person.person_info[piSize].value_numeric = input->custom_fields[i].numeric_value
						of "CODE": set pm_obj_req->person.person_info[piSize].value_cd = input->custom_fields[i].numeric_value
					endcase
 				endif
 			endif
 		endfor
 	endif
 
 	; Encounter
 	set pm_obj_req->encounter.encounter.encntr_type_cd = input->encounter.encounter_type_cd
 	set pm_obj_req->encounter.encounter.encntr_type_class_cd = input->encounter.encounter_class_cd
 	set pm_obj_req->encounter.encounter.encntr_status_cd = input->encounter.encounter_status_cd
 	set pm_obj_req->encounter.encounter.admit_type_cd = input->encounter.admit_type_cd
 	set pm_obj_req->encounter.encounter.admit_src_cd = input->encounter.admit_source_cd
 	set pm_obj_req->encounter.encounter.est_arrive_dt_tm = input->encounter.est_arrival_date_time
 	set pm_obj_req->encounter.encounter.est_depart_dt_tm = input->encounter.est_discharge_date_time
 	set pm_obj_req->encounter.encounter.est_length_of_stay = input->encounter.est_length_of_stay
 	set pm_obj_req->encounter.encounter.vip_cd = pm_obj_req->person.person.vip_cd
 	set pm_obj_req->encounter.encounter.med_service_cd = input->encounter.medical_service_cd
 	set pm_obj_req->encounter.encounter.organization_id = input->encounter.location.organization_id
 	set pm_obj_req->encounter.encounter.reason_for_visit = nullterm(input->encounter.reason_for_visit)
 	set pm_obj_req->encounter.encounter.loc_facility_cd = input->encounter.location.facility_cd
 	set pm_obj_req->encounter.encounter.loc_building_cd = input->encounter.location.building_cd
 	set pm_obj_req->encounter.encounter.loc_nurse_unit_cd = input->encounter.location.unit_cd
 	set pm_obj_req->encounter.encounter.loc_room_cd = input->encounter.location.room_cd
 	set pm_obj_req->encounter.encounter.loc_bed_cd = input->encounter.location.bed_cd
 	set pm_obj_req->encounter.encounter.visitor_status_cd = input->encounter.visitor_status_cd
 	set pm_obj_req->encounter.encounter.treatment_phase_cd = input->encounter.treatment_phase_cd
 	if(size(input->valuables,5) > 0)
 		set pm_obj_req->encounter.encounter.valuables_list_ind = 1
 		set stat = moverec(input->valuables,pm_obj_req->encounter.encounter.valuables)
 	else
 		set pm_obj_req->encounter.encounter.valuables_list_ind = 1
 		set stat = alterlist(pm_obj_req->encounter.encounter.valuables,0)
 	endif
 
	; Set Dates
 	if(input->encounter.encounter_class_cd = c_preadmit_encntr_class_cd)
 		set pm_obj_req->encounter.encounter.pre_reg_dt_tm = input->encounter.encounter_date_time
 		set pm_obj_req->encounter.encounter.pre_reg_prsnl_id = input->prsnl_id
 	else
 		set pm_obj_req->encounter.encounter.reg_dt_tm = input->encounter.encounter_date_time
 		set pm_obj_req->encounter.encounter.reg_prsnl_id = input->prsnl_id
	 	set pm_obj_req->encounter.encounter.arrive_dt_tm = input->encounter.encounter_date_time
 	endif
 
 	; Encounter personnel reltns
	for(i = 1 to size(input->encounter.providers,5))
		set eprSize = size(pm_obj_req->encounter.encntr_prsnl_reltn,5)
		set idx = 1
		set pos = locateval(idx,1,eprSize,
			input->encounter.providers[i].provider_id, pm_obj_req->encounter.encntr_prsnl_reltn[idx].prsnl_person_id,
			input->encounter.providers[i].provider_type_cd,pm_obj_req->encounter.encntr_prsnl_reltn[idx].encntr_prsnl_r_cd)
 
		if(pos = 0)
			set eprSize = eprSize + 1
			set stat = alterlist(pm_obj_req->encounter.encntr_prsnl_reltn,eprSize)
			set pm_obj_req->encounter.encntr_prsnl_reltn[eprSize].encntr_prsnl_r_cd = input->encounter.providers[i].provider_type_cd
			set pm_obj_req->encounter.encntr_prsnl_reltn[eprSize].prsnl_person_id = input->encounter.providers[i].provider_id
		endif
	endfor
 
 	;Encounter User Defined fields
 	set eudfSize = size(input->custom_fields,5)
 	if(eudfSize > 0)
 		for(i = 1 to eudfSize)
 			if(input->custom_fields[i].level = "ENCOUNTER")
 				set pos = locateval(idx,1,size(pm_obj_req->encounter.encntr_info,5),input->custom_fields[i].field_id,
 				pm_obj_req->encounter.encntr_info[idx].info_sub_type_cd)
 
	 			if(pos > 0)
	 				case(input->custom_fields[i].type)
	 					of "STRING": set pm_obj_req->encounter.encntr_info[pos].long_text = input->custom_fields[i].text_value
						of "DATE": set pm_obj_req->encounter.encntr_info[pos].value_dt_tm = input->custom_fields[i].date_value
						of "NUMERIC": set pm_obj_req->encounter.encntr_info[pos].value_numeric = input->custom_fields[i].numeric_value
						of "CODE": set pm_obj_req->encounter.encntr_info[pos].value_cd = input->custom_fields[i].numeric_value
					endcase
	 			else
	 				set piSize = size(pm_obj_req->encounter.encntr_info,5) + 1
	 				set stat = alterlist(pm_obj_req->encounter.encntr_info,piSize)
 
 					set pm_obj_req->encounter.encntr_info[piSize].info_sub_type_cd = input->custom_fields[i].field_id
 					set pm_obj_req->encounter.encntr_info[piSize].info_type_cd = c_userdefined_info_type_cd
 
	 				case(input->custom_fields[i].type)
	 					of "STRING": set pm_obj_req->encounter.encntr_info[piSize].long_text = input->custom_fields[i].text_value
						of "DATE": set pm_obj_req->encounter.encntr_info[piSize].value_dt_tm = input->custom_fields[i].date_value
						of "NUMERIC": set pm_obj_req->encounter.encntr_info[piSize].value_numeric = input->custom_fields[i].numeric_value
						of "CODE": set pm_obj_req->encounter.encntr_info[piSize].value_cd = input->custom_fields[i].numeric_value
					endcase
	 			endif
	 		endif
 		endfor
 	endif
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 		set encounter_reply_out->encounter_id = pm_obj_rep->encntr_id
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostEncounter Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Request 100082 - Remove patient lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100082
 
 	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = input->patient_id
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100082_req,"REC",100082_rep)
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
