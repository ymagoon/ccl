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
      Source file name: vigilanz_common_pm_obj
      Object name:      vigilanz_common_pm_obj
      Program purpose:  Builds pm object record
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
---------------------------------------------------------------------
  001 12/19/19 RJC		Initial Write
  002 01/15/20 RJC		Fixed issues with person_person_reltn. Added update_ind param to ensure only reltns that need updating
  						are updated. Fixed issue with relations and internal seq
  003 02/28/20 RJC		Added changes to support insurance authorization updates
  004 03/30/20 DSH		Insurance begin/end effective date/times can now be updated
  005 04/27/20 RJC		Fixed issue with est_length_of_stay; hardcoded sensitive data bits value
**********************************************************************/
drop program vigilanz_common_pm_obj go
create program vigilanz_common_pm_obj
 
/*************************************************************************
	CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
 
/*************************************************************************
	DECLARE SUBROUTINES
**************************************************************************/
declare GetPersonData(action = i4, person_id = f8, encntr_id = f8) = null with persistscript	;114606 - PM.GetPersonInfo
declare UpdatePersonData(null)	= null with persistscript
 
/************************************************************************
	INITIALIZE RECORDS
************************************************************************/
;114604 - PM.GetPersonInfo
free record 114604_req
record 114604_req(
  1 action = i2
  1 person_id = f8
  1 encntr_id = f8
  1 organization_id = f8
  1 conversation_id = f8
  1 swap_person_id = f8
  1 swap_encntr_id = f8
  1 all_person_aliases = i2
  1 hp_expire_ind = i2
  1 access_sensitive_data_bits = i4
  1 person_plan_profile_type_cd = f8
) with persistscript
 
free record pm_obj_req
record pm_obj_req(
  1 transaction_type = i2
  1 transaction_id = f8
  1 swap_transaction_id = f8
  1 transaction_info
	2 prsnl_id = f8
	2 position_cd = f8
	2 applctx = i4
	2 updt_task = i4
	2 trans_dt_tm = dq8
	2 transaction_txt = vc
	2 print_doc_ind = i2
	2 unauthentication_flag = i2
	2 pc_identifier = vc
	2 encntr_reltn_updt_ind = i2
	2 default_location_cd = f8
	2 conversation_task = i4
	2 type_flag = i4
	2 transaction_reason_cd = f8
	2 last_trans_dt_tm = dq8
	2 output_dest_cd = f8
	2 movement_id = vc
	2 access_sensitive_data_bits = i4 ;Added
  1 person
	2 person
	  3 person_id = f8
	  3 new_person_ind = i2	;Added
	  3 pre_person_id = f8	;Added
	  3 create_dt_tm = dq8
	  3 create_prsnl_id = f8
	  3 person_type_cd = f8
	  3 name_last_key = vc
	  3 name_first_key = vc
	  3 name_full_formatted = vc
	  3 autopsy_cd = f8
	  3 birth_dt_cd = f8
	  3 birth_dt_tm = dq8
	  3 conception_dt_tm = dq8
	  3 cause_of_death = vc
	  3 cause_of_death_cd = f8
	  3 deceased_cd = f8
	  3 deceased_dt_tm = dq8
	  3 deceased_source_cd = f8
	  3 ethnic_grp_cd = f8
	  3 language_cd = f8
	  3 marital_type_cd = f8
	  3 purge_option_cd = f8
	  3 race_cd = f8
	  3 religion_cd = f8
	  3 sex_cd = f8
	  3 sex_age_change_ind = i2
	  3 language_dialect_cd = f8
	  3 name_last = vc
	  3 name_first = vc
	  3 name_phonetic = c8
	  3 last_encntr_dt_tm = dq8
	  3 species_cd = f8
	  3 confid_level_cd = f8
	  3 vip_cd = f8
	  3 name_first_synonym_id = f8
	  3 citizenship_cd = f8
	  3 vet_military_status_cd = f8
	  3 mother_maiden_name = vc
	  3 nationality_cd = f8
	  3 military_rank_cd = f8
	  3 military_service_cd = f8
	  3 military_base_location = vc
	  3 ft_entity_name = c32
	  3 ft_entity_id = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 name_middle_key = vc
	  3 name_middle = vc
	  3 birth_tz = i4
	  3 birth_tz_disp = vc
	  3 birth_prec_flag = i2
	  3 raw_birth_dt_tm = dq8
	  3 deceased_id_method_cd = f8
	  3 abs_birth_date = vc
	  3 person_code_value_r_ind = i2
	  3 person_code_value_r [*]
		4 code_set = i4
		4 code_value = f8
		4 person_code_value_r_id = f8
		4 person_id = f8
	  3 person_status_cd = f8
	  3 abn_checks
		4 abn_checks_list [*]
		  5 person_id = f8
		  5 procedure_source_ident = vc
		  5 procedure_vocab_cd = f8
		  5 diagnosis_source_ident = vc
		  5 diagnosis_vocab_cd = f8
		  5 payer_id = f8
		  5 health_plan_id = f8
		  5 sponsor_id = f8
		  5 parent1_id = f8
		  5 parent1_table = vc
		  5 parent2_id = f8
		  5 parent2_table = vc
		  5 parent3_id = f8
		  5 parent3_table = vc
		  5 abn_check_id = f8
		  5 abn_state_cd = f8
		  5 abn_state_meaning = vc
		  5 prev_abn_form_id = f8
		  5 high_status_cd = f8
		  5 high_status_meaning = vc
		  5 location_cd = f8
		  5 diag_qual_list [*]
			6 diagnosis_source_ident = vc
			6 diagnosis_vocab_cd = f8
		  5 mod_qual_list [*]
			6 mod_nomen_id = f8
			6 mod_source_ident = vc
			6 mod_vocab_cd = f8
			6 mod_vocab_meaning = vc
		  5 med_status_cd = f8
		  5 med_status_meaning = vc
		  5 parent_mnemonic = vc
	  3 race_list_ind = i2
	  3 race_list [*]
		4 value_cd = f8
	  3 ethnic_grp_list_ind = i2
	  3 ethnic_grp_list [*]
		4 value_cd = f8
	  3 person_military
		4 assigned_unit_org_id = f8
		4 assigned_unit_org_name = vc
		4 attached_unit_org_id = f8
		4 attached_unit_org_name = vc
		4 command_security_cd = f8
		4 flying_status_cd = f8
	  3 data_not_collected
		4 home_address_cd = f8
		4 home_email_cd = f8
		4 phone_cd = f8
		4 ssn_cd = f8
		4 nhn_cd = f8
	  3 emancipation_dt_tm = dq8
	  3 deceased_tz = i4
	  3 deceased_dt_tm_prec_flag = i2
	2 person_patient
	  3 person_id = f8
	  3 adopted_cd = f8
	  3 bad_debt_cd = f8
	  3 baptised_cd = f8
	  3 birth_multiple_cd = f8
	  3 birth_order = i4
	  3 birth_length = f8
	  3 birth_length_units_cd = f8
	  3 birth_name = vc
	  3 birth_weight = f8
	  3 birth_weight_units_cd = f8
	  3 church_cd = f8
	  3 credit_hrs_taking = i4
	  3 cumm_leave_days = i4
	  3 current_balance = f8
	  3 current_grade = i4
	  3 custody_cd = f8
	  3 degree_complete_cd = f8
	  3 diet_type_cd = f8
	  3 family_income = f8
	  3 family_size = i4
	  3 highest_grade_complete_cd = f8
	  3 immun_on_file_cd = f8
	  3 interp_required_cd = f8
	  3 interp_type_cd = f8
	  3 microfilm_cd = f8
	  3 nbr_of_brothers = i4
	  3 nbr_of_sisters = i4
	  3 organ_donor_cd = f8
	  3 parent_marital_status_cd = f8
	  3 smokes_cd = f8
	  3 tumor_registry_cd = f8
	  3 last_bill_dt_tm = dq8
	  3 last_bind_dt_tm = dq8
	  3 last_discharge_dt_tm = dq8
	  3 last_event_updt_dt_tm = dq8
	  3 last_payment_dt_tm = dq8
	  3 last_atd_activity_dt_tm = dq8
	  3 student_cd = f8
	  3 living_dependency_cd = f8
	  3 living_arrangement_cd = f8
	  3 living_will_cd = f8
	  3 nbr_of_pregnancies = i4
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 last_trauma_dt_tm = dq8
	  3 mother_identifier = c100
	  3 mother_identifier_cd = f8
	  3 disease_alert_cd = f8
	  3 disease_alert_list_ind = i2
	  3 disease_alert [*]
		4 value_cd = f8
	  3 process_alert_cd = f8
	  3 process_alert_list_ind = i2
	  3 process_alert [*]
		4 value_cd = f8
	  3 contact_list_cd = f8
	  3 birth_number = i2
	  3 gestation_length = i2
	  3 int_delivery_loc_type = f8
	  3 act_delivery_loc_type = f8
	  3 delivery_loc_reason = c100
	  3 live_still_birth = f8
	  3 susp_congenital_anomaly = f8
	  3 contact_method_cd = f8
	  3 contact_time = c255
	  3 callback_consent_cd = f8
	  3 prev_contact_ind = i2
	  3 birth_order_cd = f8
	  3 written_format_cd = f8
	  3 source_version_number = c255
	  3 source_sync_level_flag = f8
	  3 iqh_participant_cd = f8
	  3 family_nbr_of_minors_cnt = i4
	  3 family_income_source_cd = f8
	  3 fin_statement_expire_dt_tm = dq8
	  3 fin_statement_verified_dt_tm = dq8
	  3 fam_income_source_list_ind = i2
	  3 fam_income_source [*]
		4 value_cd = f8
	  3 health_info_access_offered_cd = f8
	  3 birth_sex_cd = f8
	  3 health_app_access_offered_cd = f8
	  3 financial_risk_level_cd = f8
	  3 source_last_sync_dt_tm = dq8
	2 person_name [*]
	  3 change_flag = i2	;Added
	  3 person_name_id = f8
	  3 person_id = f8
	  3 name_type_cd = f8
	  3 name_original = vc
	  3 name_format_cd = f8
	  3 name_full = vc
	  3 name_first = vc
	  3 name_middle = vc
	  3 name_last = vc
	  3 name_degree = vc
	  3 name_title = vc
	  3 name_prefix = vc
	  3 name_suffix = vc
	  3 name_initials = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 source_identifier = vc
	  3 name_type_seq = i4
	2 person_alias [*]
	  3 person_alias_id = f8
	  3 person_id = f8
	  3 alias_pool_cd = f8
	  3 person_alias_type_cd = f8
	  3 alias = vc
	  3 person_alias_sub_type_cd = f8
	  3 check_digit = i4
	  3 check_digit_method_cd = f8
	  3 visit_seq_nbr = i4
	  3 health_card_province = vc
	  3 health_card_ver_code = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 alias_pool_ext_cd = f8
	  3 sys_assign_flag = i2
	  3 health_card_type = c32
	  3 health_card_issue_dt_tm = dq8
	  3 health_card_expiry_dt_tm = dq8
	  3 person_alias_status_cd = f8
	  3 response_cd = f8
	  3 validation_dt_tm = dq8
	  3 alias_expiry_dt_tm = dq8
	  3 person_alias_record_status_cd = f8
	2 address [*]
	  3 change_flag = i2	;Added
	  3 address_id = f8
	  3 parent_entity_name = vc
	  3 parent_entity_id = f8
	  3 address_type_cd = f8
	  3 address_format_cd = f8
	  3 contact_name = vc
	  3 residence_type_cd = f8
	  3 comment_txt = vc
	  3 street_addr = vc
	  3 street_addr2 = vc
	  3 street_addr3 = vc
	  3 street_addr4 = vc
	  3 city = vc
	  3 state = vc
	  3 state_cd = f8
	  3 zipcode = vc
	  3 zip_code_group_cd = f8
	  3 postal_barcode_info = vc
	  3 county = vc
	  3 county_cd = f8
	  3 country = vc
	  3 country_cd = f8
	  3 residence_cd = f8
	  3 mail_stop = vc
	  3 address_type_seq = i4
	  3 beg_effective_mm_dd = i4
	  3 end_effective_mm_dd = i4
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 operation_hours = vc
	  3 address_info_status_cd = f8
	  3 primary_care_cd = f8
	  3 district_health_cd = f8
	  3 addr_key = vc
	  3 source_identifier = vc
	  3 city_cd = f8
	  3 validation_expire_dt_tm = dq8
	  3 validation_warning_override_ind = i2
	2 phone [*]
	  3 change_flag = i2	;Added
	  3 phone_id = f8
	  3 parent_entity_name = vc
	  3 parent_entity_id = f8
	  3 phone_type_cd = f8
	  3 phone_format_cd = f8
	  3 phone_num = vc
	  3 phone_type_seq = i4
	  3 description = vc
	  3 contact = vc
	  3 call_instruction = vc
	  3 modem_capability_cd = f8
	  3 extension = vc
	  3 paging_code = vc
	  3 beg_effective_mm_dd = i4
	  3 end_effective_mm_dd = i4
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 operation_hours = vc
	  3 contact_method_cd = f8
	  3 email = vc
	  3 source_identifier = vc
	  3 texting_permission_cd = f8
	2 person_info [*]
	  3 person_info_id = f8
	  3 person_id = f8
	  3 info_type_cd = f8
	  3 info_sub_type_cd = f8
	  3 long_text_id = f8
	  3 long_text = vc
	  3 value_numeric = i4
	  3 value_dt_tm = dq8
	  3 chartable_ind = i2
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 contributor_system_cd = f8
	  3 value_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 value_numeric_ind = i2
	2 person_org_reltn [*]
	  3 person_org_reltn_id = f8
	  3 person_id = f8
	  3 person_org_reltn_cd = f8
	  3 organization_id = f8
	  3 person_org_nbr = vc
	  3 person_org_alias = vc
	  3 empl_type_cd = f8
	  3 empl_status_cd = f8
	  3 empl_occupation_text = vc
	  3 empl_occupation_cd = f8
	  3 empl_title = vc
	  3 empl_position = vc
	  3 empl_contact = vc
	  3 empl_contact_title = vc
	  3 free_text_ind = i2
	  3 ft_org_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 empl_hire_dt_tm = dq8
	  3 empl_term_dt_tm = dq8
	  3 empl_retire_dt_tm = dq8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 address
		4 address_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 address_type_cd = f8
		4 address_format_cd = f8
		4 contact_name = vc
		4 residence_type_cd = f8
		4 comment_txt = vc
		4 street_addr = vc
		4 street_addr2 = vc
		4 street_addr3 = vc
		4 street_addr4 = vc
		4 city = vc
		4 state = vc
		4 state_cd = f8
		4 zipcode = vc
		4 zip_code_group_cd = f8
		4 postal_barcode_info = vc
		4 county = vc
		4 county_cd = f8
		4 country = vc
		4 country_cd = f8
		4 residence_cd = f8
		4 mail_stop = vc
		4 address_type_seq = i4
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 address_info_status_cd = f8
		4 primary_care_cd = f8
		4 district_health_cd = f8
		4 addr_key = vc
		4 source_identifier = vc
		4 city_cd = f8
		4 validation_expire_dt_tm = dq8
		4 validation_warning_override_ind = i2
	  3 email_address
		4 address_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 address_type_cd = f8
		4 address_format_cd = f8
		4 contact_name = vc
		4 residence_type_cd = f8
		4 comment_txt = vc
		4 street_addr = vc
		4 street_addr2 = vc
		4 street_addr3 = vc
		4 street_addr4 = vc
		4 city = vc
		4 state = vc
		4 state_cd = f8
		4 zipcode = vc
		4 zip_code_group_cd = f8
		4 postal_barcode_info = vc
		4 county = vc
		4 county_cd = f8
		4 country = vc
		4 country_cd = f8
		4 residence_cd = f8
		4 mail_stop = vc
		4 address_type_seq = i4
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 address_info_status_cd = f8
		4 primary_care_cd = f8
		4 district_health_cd = f8
		4 addr_key = vc
		4 source_identifier = vc
		4 city_cd = f8
		4 validation_expire_dt_tm = dq8
		4 validation_warning_override_ind = i2
	  3 phone
		4 phone_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 phone_type_cd = f8
		4 phone_format_cd = f8
		4 phone_num = vc
		4 phone_type_seq = i4
		4 description = vc
		4 contact = vc
		4 call_instruction = vc
		4 modem_capability_cd = f8
		4 extension = vc
		4 paging_code = vc
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 contact_method_cd = f8
		4 email = vc
		4 source_identifier = vc
		4 texting_permission_cd = f8
	  3 fax
		4 phone_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 phone_type_cd = f8
		4 phone_format_cd = f8
		4 phone_num = vc
		4 phone_type_seq = i4
		4 description = vc
		4 contact = vc
		4 call_instruction = vc
		4 modem_capability_cd = f8
		4 extension = vc
		4 paging_code = vc
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 contact_method_cd = f8
		4 email = vc
		4 source_identifier = vc
		4 texting_permission_cd = f8
	  3 pcp_org = vc
	  3 empl_title_cd = f8
	2 person_prsnl_reltn [*]
	  3 person_prsnl_reltn_id = f8
	  3 person_id = f8
	  3 person_prsnl_r_cd = f8
	  3 prsnl_person_id = f8
	  3 free_text_cd = f8
	  3 ft_prsnl_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 notification_cd = f8
	  3 demog_reltn_id = f8
	2 person_person_reltn [*]
	  3 update_reltn_ind = i2	;Added - datica only param. Prevents unnecessary updates if relationships aren't changing
	  3 encntr_only_ind = i2	;Added
	  3 encntr_updt_flag = i2	;Added
	  3 prior_person_reltn_cd = f8	;Added
	  3 prior_related_person_reltn_cd = f8 ;Added
	  3 person_person_reltn_id = f8
	  3 encntr_person_reltn_id = f8
	  3 person_reltn_type_cd = f8
	  3 person_id = f8
	  3 encntr_id = f8
	  3 person_reltn_cd = f8
	  3 related_person_reltn_cd = f8
	  3 related_person_id = f8
	  3 contact_role_cd = f8
	  3 genetic_relationship_ind = i2
	  3 living_with_ind = i2
	  3 visitation_allowed_cd = f8
	  3 priority_seq = i4
	  3 free_text_cd = f8
	  3 ft_rel_person_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 internal_seq = i4
	  3 family_reltn_sub_type_cd = f8
	  3 person
		4 person
		  5 person_id = f8
		  5 create_dt_tm = dq8
		  5 create_prsnl_id = f8
		  5 person_type_cd = f8
		  5 name_last_key = vc
		  5 name_first_key = vc
		  5 name_full_formatted = vc
		  5 autopsy_cd = f8
		  5 birth_dt_cd = f8
		  5 birth_dt_tm = dq8
		  5 conception_dt_tm = dq8
		  5 cause_of_death = vc
		  5 cause_of_death_cd = f8
		  5 deceased_cd = f8
		  5 deceased_dt_tm = dq8
		  5 deceased_source_cd = f8
		  5 ethnic_grp_cd = f8
		  5 language_cd = f8
		  5 marital_type_cd = f8
		  5 purge_option_cd = f8
		  5 race_cd = f8
		  5 religion_cd = f8
		  5 sex_cd = f8
		  5 sex_age_change_ind = i2
		  5 language_dialect_cd = f8
		  5 name_last = vc
		  5 name_first = vc
		  5 name_phonetic = c8
		  5 last_encntr_dt_tm = dq8
		  5 species_cd = f8
		  5 confid_level_cd = f8
		  5 vip_cd = f8
		  5 name_first_synonym_id = f8
		  5 citizenship_cd = f8
		  5 vet_military_status_cd = f8
		  5 mother_maiden_name = vc
		  5 nationality_cd = f8
		  5 military_rank_cd = f8
		  5 military_service_cd = f8
		  5 military_base_location = vc
		  5 ft_entity_name = c32
		  5 ft_entity_id = f8
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 name_middle_key = vc
		  5 name_middle = vc
		  5 birth_tz = i4
		  5 birth_tz_disp = vc
		  5 birth_prec_flag = i2
		  5 raw_birth_dt_tm = dq8
		  5 deceased_id_method_cd = f8
		  5 abs_birth_date = vc
		  5 person_code_value_r_ind = i2
		  5 person_code_value_r [*]
			6 code_set = i4
			6 code_value = f8
			6 person_code_value_r_id = f8
			6 person_id = f8
		  5 person_status_cd = f8
		  5 abn_checks
			6 abn_checks_list [*]
			  7 person_id = f8
			  7 procedure_source_ident = vc
			  7 procedure_vocab_cd = f8
			  7 diagnosis_source_ident = vc
			  7 diagnosis_vocab_cd = f8
			  7 payer_id = f8
			  7 health_plan_id = f8
			  7 sponsor_id = f8
			  7 parent1_id = f8
			  7 parent1_table = vc
			  7 parent2_id = f8
			  7 parent2_table = vc
			  7 parent3_id = f8
			  7 parent3_table = vc
			  7 abn_check_id = f8
			  7 abn_state_cd = f8
			  7 abn_state_meaning = vc
			  7 prev_abn_form_id = f8
			  7 high_status_cd = f8
			  7 high_status_meaning = vc
			  7 location_cd = f8
			  7 diag_qual_list [*]
				8 diagnosis_source_ident = vc
				8 diagnosis_vocab_cd = f8
			  7 mod_qual_list [*]
				8 mod_nomen_id = f8
				8 mod_source_ident = vc
				8 mod_vocab_cd = f8
				8 mod_vocab_meaning = vc
			  7 med_status_cd = f8
			  7 med_status_meaning = vc
			  7 parent_mnemonic = vc
		  5 race_list_ind = i2
		  5 race_list [*]
			6 value_cd = f8
		  5 ethnic_grp_list_ind = i2
		  5 ethnic_grp_list [*]
			6 value_cd = f8
		  5 person_military
			6 assigned_unit_org_id = f8
			6 assigned_unit_org_name = vc
			6 attached_unit_org_id = f8
			6 attached_unit_org_name = vc
			6 command_security_cd = f8
			6 flying_status_cd = f8
		  5 data_not_collected
			6 home_address_cd = f8
			6 home_email_cd = f8
			6 phone_cd = f8
			6 ssn_cd = f8
			6 nhn_cd = f8
		  5 emancipation_dt_tm = dq8
		  5 deceased_tz = i4
		  5 deceased_dt_tm_prec_flag = i2
		4 person_patient
		  5 person_id = f8
		  5 adopted_cd = f8
		  5 bad_debt_cd = f8
		  5 baptised_cd = f8
		  5 birth_multiple_cd = f8
		  5 birth_order = i4
		  5 birth_length = f8
		  5 birth_length_units_cd = f8
		  5 birth_name = vc
		  5 birth_weight = f8
		  5 birth_weight_units_cd = f8
		  5 church_cd = f8
		  5 credit_hrs_taking = i4
		  5 cumm_leave_days = i4
		  5 current_balance = f8
		  5 current_grade = i4
		  5 custody_cd = f8
		  5 degree_complete_cd = f8
		  5 diet_type_cd = f8
		  5 family_income = f8
		  5 family_size = i4
		  5 highest_grade_complete_cd = f8
		  5 immun_on_file_cd = f8
		  5 interp_required_cd = f8
		  5 interp_type_cd = f8
		  5 microfilm_cd = f8
		  5 nbr_of_brothers = i4
		  5 nbr_of_sisters = i4
		  5 organ_donor_cd = f8
		  5 parent_marital_status_cd = f8
		  5 smokes_cd = f8
		  5 tumor_registry_cd = f8
		  5 last_bill_dt_tm = dq8
		  5 last_bind_dt_tm = dq8
		  5 last_discharge_dt_tm = dq8
		  5 last_event_updt_dt_tm = dq8
		  5 last_payment_dt_tm = dq8
		  5 last_atd_activity_dt_tm = dq8
		  5 student_cd = f8
		  5 living_dependency_cd = f8
		  5 living_arrangement_cd = f8
		  5 living_will_cd = f8
		  5 nbr_of_pregnancies = i4
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 last_trauma_dt_tm = dq8
		  5 mother_identifier = c100
		  5 mother_identifier_cd = f8
		  5 disease_alert_cd = f8
		  5 disease_alert_list_ind = i2
		  5 disease_alert [*]
			6 value_cd = f8
		  5 process_alert_cd = f8
		  5 process_alert_list_ind = i2
		  5 process_alert [*]
			6 value_cd = f8
		  5 contact_list_cd = f8
		  5 birth_number = i2
		  5 gestation_length = i2
		  5 int_delivery_loc_type = f8
		  5 act_delivery_loc_type = f8
		  5 delivery_loc_reason = c100
		  5 live_still_birth = f8
		  5 susp_congenital_anomaly = f8
		  5 contact_method_cd = f8
		  5 contact_time = c255
		  5 callback_consent_cd = f8
		  5 prev_contact_ind = i2
		  5 birth_order_cd = f8
		  5 written_format_cd = f8
		  5 source_version_number = c255
		  5 source_sync_level_flag = f8
		  5 iqh_participant_cd = f8
		  5 family_nbr_of_minors_cnt = i4
		  5 family_income_source_cd = f8
		  5 fin_statement_expire_dt_tm = dq8
		  5 fin_statement_verified_dt_tm = dq8
		  5 fam_income_source_list_ind = i2
		  5 fam_income_source [*]
			6 value_cd = f8
		  5 health_info_access_offered_cd = f8
		  5 birth_sex_cd = f8
		  5 health_app_access_offered_cd = f8
		  5 financial_risk_level_cd = f8
		  5 source_last_sync_dt_tm = dq8
		4 person_name [*]
		  5 person_name_id = f8
		  5 person_id = f8
		  5 name_type_cd = f8
		  5 name_original = vc
		  5 name_format_cd = f8
		  5 name_full = vc
		  5 name_first = vc
		  5 name_middle = vc
		  5 name_last = vc
		  5 name_degree = vc
		  5 name_title = vc
		  5 name_prefix = vc
		  5 name_suffix = vc
		  5 name_initials = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 source_identifier = vc
		  5 name_type_seq = i4
		4 address [*]
		  5 address_id = f8
		  5 parent_entity_name = vc
		  5 parent_entity_id = f8
		  5 address_type_cd = f8
		  5 address_format_cd = f8
		  5 contact_name = vc
		  5 residence_type_cd = f8
		  5 comment_txt = vc
		  5 street_addr = vc
		  5 street_addr2 = vc
		  5 street_addr3 = vc
		  5 street_addr4 = vc
		  5 city = vc
		  5 state = vc
		  5 state_cd = f8
		  5 zipcode = vc
		  5 zip_code_group_cd = f8
		  5 postal_barcode_info = vc
		  5 county = vc
		  5 county_cd = f8
		  5 country = vc
		  5 country_cd = f8
		  5 residence_cd = f8
		  5 mail_stop = vc
		  5 address_type_seq = i4
		  5 beg_effective_mm_dd = i4
		  5 end_effective_mm_dd = i4
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 operation_hours = vc
		  5 address_info_status_cd = f8
		  5 primary_care_cd = f8
		  5 district_health_cd = f8
		  5 addr_key = vc
		  5 source_identifier = vc
		  5 city_cd = f8
		  5 validation_expire_dt_tm = dq8
		  5 validation_warning_override_ind = i2
		4 phone [*]
		  5 phone_id = f8
		  5 parent_entity_name = vc
		  5 parent_entity_id = f8
		  5 phone_type_cd = f8
		  5 phone_format_cd = f8
		  5 phone_num = vc
		  5 phone_type_seq = i4
		  5 description = vc
		  5 contact = vc
		  5 call_instruction = vc
		  5 modem_capability_cd = f8
		  5 extension = vc
		  5 paging_code = vc
		  5 beg_effective_mm_dd = i4
		  5 end_effective_mm_dd = i4
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 operation_hours = vc
		  5 contact_method_cd = f8
		  5 email = vc
		  5 source_identifier = vc
		  5 texting_permission_cd = f8
		4 person_alias [*]
		  5 person_alias_id = f8
		  5 person_id = f8
		  5 alias_pool_cd = f8
		  5 person_alias_type_cd = f8
		  5 alias = vc
		  5 person_alias_sub_type_cd = f8
		  5 check_digit = i4
		  5 check_digit_method_cd = f8
		  5 visit_seq_nbr = i4
		  5 health_card_province = vc
		  5 health_card_ver_code = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 alias_pool_ext_cd = f8
		  5 sys_assign_flag = i2
		  5 health_card_type = c32
		  5 health_card_issue_dt_tm = dq8
		  5 health_card_expiry_dt_tm = dq8
		  5 person_alias_status_cd = f8
		  5 response_cd = f8
		  5 validation_dt_tm = dq8
		  5 alias_expiry_dt_tm = dq8
		  5 person_alias_record_status_cd = f8
		4 person_org_reltn [*]
		  5 person_org_reltn_id = f8
		  5 person_id = f8
		  5 person_org_reltn_cd = f8
		  5 organization_id = f8
		  5 person_org_nbr = vc
		  5 person_org_alias = vc
		  5 empl_type_cd = f8
		  5 empl_status_cd = f8
		  5 empl_occupation_text = vc
		  5 empl_occupation_cd = f8
		  5 empl_title = vc
		  5 empl_position = vc
		  5 empl_contact = vc
		  5 empl_contact_title = vc
		  5 free_text_ind = i2
		  5 ft_org_name = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 empl_hire_dt_tm = dq8
		  5 empl_term_dt_tm = dq8
		  5 empl_retire_dt_tm = dq8
		  5 priority_seq = i4
		  5 internal_seq = i4
		  5 address
			6 address_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 address_type_cd = f8
			6 address_format_cd = f8
			6 contact_name = vc
			6 residence_type_cd = f8
			6 comment_txt = vc
			6 street_addr = vc
			6 street_addr2 = vc
			6 street_addr3 = vc
			6 street_addr4 = vc
			6 city = vc
			6 state = vc
			6 state_cd = f8
			6 zipcode = vc
			6 zip_code_group_cd = f8
			6 postal_barcode_info = vc
			6 county = vc
			6 county_cd = f8
			6 country = vc
			6 country_cd = f8
			6 residence_cd = f8
			6 mail_stop = vc
			6 address_type_seq = i4
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 address_info_status_cd = f8
			6 primary_care_cd = f8
			6 district_health_cd = f8
			6 addr_key = vc
			6 source_identifier = vc
			6 city_cd = f8
			6 validation_expire_dt_tm = dq8
			6 validation_warning_override_ind = i2
		  5 email_address
			6 address_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 address_type_cd = f8
			6 address_format_cd = f8
			6 contact_name = vc
			6 residence_type_cd = f8
			6 comment_txt = vc
			6 street_addr = vc
			6 street_addr2 = vc
			6 street_addr3 = vc
			6 street_addr4 = vc
			6 city = vc
			6 state = vc
			6 state_cd = f8
			6 zipcode = vc
			6 zip_code_group_cd = f8
			6 postal_barcode_info = vc
			6 county = vc
			6 county_cd = f8
			6 country = vc
			6 country_cd = f8
			6 residence_cd = f8
			6 mail_stop = vc
			6 address_type_seq = i4
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 address_info_status_cd = f8
			6 primary_care_cd = f8
			6 district_health_cd = f8
			6 addr_key = vc
			6 source_identifier = vc
			6 city_cd = f8
			6 validation_expire_dt_tm = dq8
			6 validation_warning_override_ind = i2
		  5 phone
			6 phone_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 phone_type_cd = f8
			6 phone_format_cd = f8
			6 phone_num = vc
			6 phone_type_seq = i4
			6 description = vc
			6 contact = vc
			6 call_instruction = vc
			6 modem_capability_cd = f8
			6 extension = vc
			6 paging_code = vc
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 contact_method_cd = f8
			6 email = vc
			6 source_identifier = vc
			6 texting_permission_cd = f8
		  5 fax
			6 phone_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 phone_type_cd = f8
			6 phone_format_cd = f8
			6 phone_num = vc
			6 phone_type_seq = i4
			6 description = vc
			6 contact = vc
			6 call_instruction = vc
			6 modem_capability_cd = f8
			6 extension = vc
			6 paging_code = vc
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 contact_method_cd = f8
			6 email = vc
			6 source_identifier = vc
			6 texting_permission_cd = f8
		  5 pcp_org = vc
		  5 empl_title_cd = f8
		4 person_plan_reltn [*]
		  5 person_plan_reltn_id = f8
		  5 encntr_plan_reltn_id = f8
		  5 health_plan_id = f8
		  5 person_id = f8
		  5 person_plan_r_cd = f8
		  5 person_org_reltn_id = f8
		  5 sponsor_person_org_reltn_id = f8
		  5 subscriber_person_id = f8
		  5 organization_id = f8
		  5 priority_seq = i4
		  5 member_nbr = vc
		  5 signature_on_file_cd = f8
		  5 balance_type_cd = f8
		  5 deduct_amt = f8
		  5 deduct_met_amt = f8
		  5 deduct_met_dt_tm = dq8
		  5 coverage_type_cd = f8
		  5 max_out_pckt_amt = f8
		  5 max_out_pckt_dt_tm = dq8
		  5 fam_deduct_met_amt = f8
		  5 fam_deduct_met_dt_tm = dq8
		  5 verify_status_cd = f8
		  5 verify_dt_tm = dq8
		  5 verify_prsnl_id = f8
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 contributor_system_cd = f8
		  5 insured_card_name = vc
		  5 pat_member_nbr = vc
		  5 member_person_code = vc
		  5 life_rsv_days = i4
		  5 life_rsv_remain_days = i4
		  5 life_rsv_daily_ded_amt = f8
		  5 life_rsv_daily_ded_qual_cd = f8
		  5 card_issue_nbr = i4
		  5 card_category_cd = f8
		  5 program_status_cd = f8
		  5 verify_phone
			6 phone_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 phone_type_cd = f8
			6 phone_format_cd = f8
			6 phone_num = vc
			6 phone_type_seq = i4
			6 description = vc
			6 contact = vc
			6 call_instruction = vc
			6 modem_capability_cd = f8
			6 extension = vc
			6 paging_code = vc
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 contact_method_cd = f8
			6 email = vc
			6 source_identifier = vc
			6 texting_permission_cd = f8
		  5 person_benefit_r_id = f8
		  5 benefit_plan_cd = f8
		  5 service_type_cd = f8
		  5 coverage_days = i4
		  5 coverage_remain_days = i4
		  5 non_coverage_days = i4
		  5 coinsurance_days = i4
		  5 coinsurance_remain_days = i4
		  5 coinsurance_pct = f8
		  5 copay_amt = f8
		  5 deduct_pct = f8
		  5 deduct_remain_amt = f8
		  5 room_coverage_amt = f8
		  5 room_coverage_amt_qual_cd = f8
		  5 room_coverage_type_cd = f8
		  5 room_coverage_board_incl_cd = f8
		  5 comment_id = f8
		  5 comment_txt = vc
		  5 benefit_sch [*]
			6 person_benefit_sch_r_id = f8
			6 person_benefit_r_id = f8
			6 member_resp_type_cd = f8
			6 resp_range_start_nbr = i4
			6 resp_range_end_nbr = i4
			6 resp_type_qual_cd = f8
			6 resp_range_amt = f8
			6 resp_range_qual_cd = f8
		  5 denial_reason_cd = f8
		  5 coverage_comments = vc
		  5 address
			6 address_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 address_type_cd = f8
			6 address_format_cd = f8
			6 contact_name = vc
			6 residence_type_cd = f8
			6 comment_txt = vc
			6 street_addr = vc
			6 street_addr2 = vc
			6 street_addr3 = vc
			6 street_addr4 = vc
			6 city = vc
			6 state = vc
			6 state_cd = f8
			6 zipcode = vc
			6 zip_code_group_cd = f8
			6 postal_barcode_info = vc
			6 county = vc
			6 county_cd = f8
			6 country = vc
			6 country_cd = f8
			6 residence_cd = f8
			6 mail_stop = vc
			6 address_type_seq = i4
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 address_info_status_cd = f8
			6 primary_care_cd = f8
			6 district_health_cd = f8
			6 addr_key = vc
			6 source_identifier = vc
			6 city_cd = f8
			6 validation_expire_dt_tm = dq8
			6 validation_warning_override_ind = i2
		  5 addtnl_address [*]
			6 address_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 address_type_cd = f8
			6 address_format_cd = f8
			6 contact_name = vc
			6 residence_type_cd = f8
			6 comment_txt = vc
			6 street_addr = vc
			6 street_addr2 = vc
			6 street_addr3 = vc
			6 street_addr4 = vc
			6 city = vc
			6 state = vc
			6 state_cd = f8
			6 zipcode = vc
			6 zip_code_group_cd = f8
			6 postal_barcode_info = vc
			6 county = vc
			6 county_cd = f8
			6 country = vc
			6 country_cd = f8
			6 residence_cd = f8
			6 mail_stop = vc
			6 address_type_seq = i4
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 address_info_status_cd = f8
			6 primary_care_cd = f8
			6 district_health_cd = f8
			6 addr_key = vc
			6 source_identifier = vc
			6 city_cd = f8
			6 validation_expire_dt_tm = dq8
			6 validation_warning_override_ind = i2
		  5 phone
			6 phone_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 phone_type_cd = f8
			6 phone_format_cd = f8
			6 phone_num = vc
			6 phone_type_seq = i4
			6 description = vc
			6 contact = vc
			6 call_instruction = vc
			6 modem_capability_cd = f8
			6 extension = vc
			6 paging_code = vc
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 contact_method_cd = f8
			6 email = vc
			6 source_identifier = vc
			6 texting_permission_cd = f8
		  5 addtnl_phone [*]
			6 phone_id = f8
			6 parent_entity_name = vc
			6 parent_entity_id = f8
			6 phone_type_cd = f8
			6 phone_format_cd = f8
			6 phone_num = vc
			6 phone_type_seq = i4
			6 description = vc
			6 contact = vc
			6 call_instruction = vc
			6 modem_capability_cd = f8
			6 extension = vc
			6 paging_code = vc
			6 beg_effective_mm_dd = i4
			6 end_effective_mm_dd = i4
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 operation_hours = vc
			6 contact_method_cd = f8
			6 email = vc
			6 source_identifier = vc
			6 texting_permission_cd = f8
		  5 plan_info
			6 health_plan_id = f8
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 plan_type_cd = f8
			6 plan_name = vc
			6 plan_desc = vc
			6 financial_class_cd = f8
			6 ft_entity_name = vc
			6 ft_entity_id = f8
			6 baby_coverage_cd = f8
			6 comb_baby_bill_cd = f8
			6 plan_class_cd = f8
			6 eligibility_version_cd = f8
			6 claimstatus_version_cd = f8
			6 serviceauth_version_cd = f8
			6 eligibility_transaction_uuid = vc
			6 eligibility_status_cd = f8
			6 eligibility_sent_dt_tm = dq8
			6 eligibility_cache_dt_tm = dq8
			6 eligibility_cache_expire_dt_tm = dq8
		  5 org_info
			6 organization_id = f8
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 org_name = vc
			6 org_name_key = vc
			6 federal_tax_id_nbr = vc
			6 org_status_cd = f8
			6 ft_entity_name = vc
			6 ft_entity_id = f8
			6 org_class_cd = f8
		  5 org_plan
			6 org_plan_reltn_id = f8
			6 health_plan_id = f8
			6 org_plan_reltn_cd = f8
			6 organization_id = f8
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 contributor_system_cd = f8
			6 group_nbr = vc
			6 group_name = vc
			6 policy_nbr = vc
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prnsl_id = f8
			6 address
			  7 address_id = f8
			  7 parent_entity_name = vc
			  7 parent_entity_id = f8
			  7 address_type_cd = f8
			  7 address_format_cd = f8
			  7 contact_name = vc
			  7 residence_type_cd = f8
			  7 comment_txt = vc
			  7 street_addr = vc
			  7 street_addr2 = vc
			  7 street_addr3 = vc
			  7 street_addr4 = vc
			  7 city = vc
			  7 state = vc
			  7 state_cd = f8
			  7 zipcode = vc
			  7 zip_code_group_cd = f8
			  7 postal_barcode_info = vc
			  7 county = vc
			  7 county_cd = f8
			  7 country = vc
			  7 country_cd = f8
			  7 residence_cd = f8
			  7 mail_stop = vc
			  7 address_type_seq = i4
			  7 beg_effective_mm_dd = i4
			  7 end_effective_mm_dd = i4
			  7 updt_cnt = i4
			  7 updt_dt_tm = dq8
			  7 updt_id = f8
			  7 updt_task = i4
			  7 updt_applctx = i4
			  7 active_ind = i2
			  7 active_status_cd = f8
			  7 active_status_dt_tm = dq8
			  7 active_status_prsnl_id = f8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 data_status_cd = f8
			  7 data_status_dt_tm = dq8
			  7 data_status_prsnl_id = f8
			  7 contributor_system_cd = f8
			  7 operation_hours = vc
			  7 address_info_status_cd = f8
			  7 primary_care_cd = f8
			  7 district_health_cd = f8
			  7 addr_key = vc
			  7 source_identifier = vc
			  7 city_cd = f8
			  7 validation_expire_dt_tm = dq8
			  7 validation_warning_override_ind = i2
			6 addtnl_address [*]
			  7 address_id = f8
			  7 parent_entity_name = vc
			  7 parent_entity_id = f8
			  7 address_type_cd = f8
			  7 address_format_cd = f8
			  7 contact_name = vc
			  7 residence_type_cd = f8
			  7 comment_txt = vc
			  7 street_addr = vc
			  7 street_addr2 = vc
			  7 street_addr3 = vc
			  7 street_addr4 = vc
			  7 city = vc
			  7 state = vc
			  7 state_cd = f8
			  7 zipcode = vc
			  7 zip_code_group_cd = f8
			  7 postal_barcode_info = vc
			  7 county = vc
			  7 county_cd = f8
			  7 country = vc
			  7 country_cd = f8
			  7 residence_cd = f8
			  7 mail_stop = vc
			  7 address_type_seq = i4
			  7 beg_effective_mm_dd = i4
			  7 end_effective_mm_dd = i4
			  7 updt_cnt = i4
			  7 updt_dt_tm = dq8
			  7 updt_id = f8
			  7 updt_task = i4
			  7 updt_applctx = i4
			  7 active_ind = i2
			  7 active_status_cd = f8
			  7 active_status_dt_tm = dq8
			  7 active_status_prsnl_id = f8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 data_status_cd = f8
			  7 data_status_dt_tm = dq8
			  7 data_status_prsnl_id = f8
			  7 contributor_system_cd = f8
			  7 operation_hours = vc
			  7 address_info_status_cd = f8
			  7 primary_care_cd = f8
			  7 district_health_cd = f8
			  7 addr_key = vc
			  7 source_identifier = vc
			  7 city_cd = f8
			  7 validation_expire_dt_tm = dq8
			  7 validation_warning_override_ind = i2
			6 addtnl_phone [*]
			  7 phone_id = f8
			  7 parent_entity_name = vc
			  7 parent_entity_id = f8
			  7 phone_type_cd = f8
			  7 phone_format_cd = f8
			  7 phone_num = vc
			  7 phone_type_seq = i4
			  7 description = vc
			  7 contact = vc
			  7 call_instruction = vc
			  7 modem_capability_cd = f8
			  7 extension = vc
			  7 paging_code = vc
			  7 beg_effective_mm_dd = i4
			  7 end_effective_mm_dd = i4
			  7 updt_cnt = i4
			  7 updt_dt_tm = dq8
			  7 updt_id = f8
			  7 updt_task = i4
			  7 updt_applctx = i4
			  7 active_ind = i2
			  7 active_status_cd = f8
			  7 active_status_dt_tm = dq8
			  7 active_status_prsnl_id = f8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 data_status_cd = f8
			  7 data_status_dt_tm = dq8
			  7 data_status_prsnl_id = f8
			  7 contributor_system_cd = f8
			  7 operation_hours = vc
			  7 contact_method_cd = f8
			  7 email = vc
			  7 source_identifier = vc
			  7 texting_permission_cd = f8
		  5 encntr_plan_reltn [*]
			6 encntr_plan_reltn_id = f8
			6 encntr_id = f8
			6 person_id = f8
			6 person_plan_reltn_id = f8
			6 health_plan_id = f8
			6 organization_id = f8
			6 person_org_reltn_id = f8
			6 sponsor_person_org_reltn_id = f8
			6 subscriber_type_cd = f8
			6 orig_priority_seq = i4
			6 priority_seq = i4
			6 member_nbr = vc
			6 subs_member_nbr = vc
			6 insur_source_info_cd = f8
			6 balance_type_cd = f8
			6 deduct_amt = f8
			6 deduct_met_amt = f8
			6 deduct_met_dt_tm = dq8
			6 assign_benefits_cd = f8
			6 coord_benefits_cd = f8
			6 plan_type_cd = f8
			6 plan_class_cd = f8
			6 health_card_province = c3
			6 health_card_ver_code = c3
			6 health_card_nbr = vc
			6 health_card_type = c32
			6 health_card_issue_dt_tm = dq8
			6 health_card_expiry_dt_tm = dq8
			6 updt_cnt = i4
			6 updt_dt_tm = dq8
			6 updt_id = f8
			6 updt_task = i4
			6 updt_applctx = i4
			6 active_ind = i2
			6 active_status_cd = f8
			6 active_status_dt_tm = dq8
			6 active_status_prsnl_id = f8
			6 beg_effective_dt_tm = dq8
			6 end_effective_dt_tm = dq8
			6 data_status_cd = f8
			6 data_status_dt_tm = dq8
			6 data_status_prsnl_id = f8
			6 contributor_system_cd = f8
			6 insured_card_name = vc
			6 military_rank_cd = f8
			6 military_service_cd = f8
			6 military_status_cd = f8
			6 military_base_location = vc
			6 ins_card_copied_cd = f8
			6 member_person_code = vc
			6 life_rsv_days = i4
			6 life_rsv_remain_days = i4
			6 life_rsv_daily_ded_amt = f8
			6 life_rsv_daily_ded_qual_cd = f8
			6 card_issue_nbr = i4
			6 card_category_cd = f8
			6 program_status_cd = f8
			6 verify_prsnl_id = f8
			6 verify_dt_tm = dq8
			6 verify_status_cd = f8
			6 encntr_benefit_r_id = f8
			6 benefit_plan_cd = f8
			6 service_type_cd = f8
			6 coverage_days = i4
			6 coverage_remain_days = i4
			6 non_coverage_days = i4
			6 coinsurance_days = i4
			6 coinsurance_remain_days = i4
			6 coinsurance_pct = f8
			6 copay_amt = f8
			6 deduct_pct = f8
			6 deduct_remain_amt = f8
			6 room_coverage_amt = f8
			6 room_coverage_amt_qual_cd = f8
			6 room_coverage_type_cd = f8
			6 room_coverage_board_incl_cd = f8
			6 comment_id = f8
			6 comment_txt = vc
			6 benefit_sch [*]
			  7 encntr_benefit_sch_r_id = f8
			  7 encntr_benefit_r_id = f8
			  7 member_resp_type_cd = f8
			  7 resp_range_start_nbr = i4
			  7 resp_range_end_nbr = i4
			  7 resp_type_qual_cd = f8
			  7 resp_range_amt = f8
			  7 resp_range_qual_cd = f8
			6 denial_reason_cd = f8
			6 coverage_comments = vc
			6 auth_info [*]
			  7 authorization_id = f8
			  7 encntr_plan_reltn_id = f8
			  7 person_id = f8
			  7 health_plan_id = f8
			  7 auth_nbr = vc
			  7 auth_type_cd = f8
			  7 description = vc
			  7 cert_status_cd = f8
			  7 appeal_reason = vc
			  7 total_service_nbr = i4
			  7 bnft_type_cd = f8
			  7 last_update_dt_tm = dq8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 active_ind = i2
			  7 auth_cnt = i4
			  7 auth_remain_cnt = i4
			  7 auth_qual_cd = f8
			  7 auth_required_cd = f8
			  7 auth_obtained_dt_tm = dq8
			  7 comment_id = f8
			  7 comment_txt = vc
			  7 interchange_id = f8
			  7 auth_trans_state_flag = i2
			  7 cert_type_cd = f8
			  7 delay_reason_cd = f8
			  7 reject_reason_cd = f8
			  7 admission_beg_dt_tm = dq8
			  7 admission_end_dt_tm = dq8
			  7 discharge_dt_tm = dq8
			  7 surgical_dt_tm = dq8
			  7 service_beg_dt_tm = dq8
			  7 service_end_dt_tm = dq8
			  7 auth_cnt_unit_cd = f8
			  7 auth_cnt_unit = f8
			  7 auth_cnt_time_cd = f8
			  7 auth_cnt_time = f8
			  7 x12service_type_cd = f8
			  7 provider_prsnl_id = f8
			  7 taxonomy_id = f8
			  7 auth_expire_dt_tm = dq8
			  7 x12provider_cd = f8
			  7 facility_cd = f8
			  7 auth_detail [*]
				8 auth_detail_id = f8
				8 authorization_id = f8
				8 prsnl_id = f8
				8 auth_company = vc
				8 auth_phone_num = vc
				8 auth_contact = vc
				8 auth_dt_tm = dq8
				8 plan_contact_id = f8
				8 long_text_id = f8
				8 beg_effective_dt_tm = dq8
				8 end_effective_dt_tm = dq8
				8 auth_phone_id = f8
				8 phone_format_cd = f8
				8 auth_fax
				  9 phone_id = f8
				  9 parent_entity_name = vc
				  9 parent_entity_id = f8
				  9 phone_type_cd = f8
				  9 phone_format_cd = f8
				  9 phone_num = vc
				  9 phone_type_seq = i4
				  9 description = vc
				  9 contact = vc
				  9 call_instruction = vc
				  9 modem_capability_cd = f8
				  9 extension = vc
				  9 paging_code = vc
				  9 beg_effective_mm_dd = i4
				  9 end_effective_mm_dd = i4
				  9 updt_cnt = i4
				  9 updt_dt_tm = dq8
				  9 updt_id = f8
				  9 updt_task = i4
				  9 updt_applctx = i4
				  9 active_ind = i2
				  9 active_status_cd = f8
				  9 active_status_dt_tm = dq8
				  9 active_status_prsnl_id = f8
				  9 beg_effective_dt_tm = dq8
				  9 end_effective_dt_tm = dq8
				  9 data_status_cd = f8
				  9 data_status_dt_tm = dq8
				  9 data_status_prsnl_id = f8
				  9 contributor_system_cd = f8
				  9 operation_hours = vc
				  9 contact_method_cd = f8
				  9 email = vc
				  9 source_identifier = vc
				  9 texting_permission_cd = f8
			  7 reference_nbr_txt = vc
			  7 delay_reason_comment_id = f8
			  7 delay_reason_comment_txt = vc
			6 encntr_fin [*]
			  7 encntr_benefit_r_id = f8
			  7 encntr_plan_reltn_id = f8
			  7 deduct_amt = f8
			  7 deduct_met_amt = f8
			  7 deduct_met_dt_tm = dq8
			  7 benefit_plan_cd = f8
			  7 service_type_cd = f8
			  7 coverage_days = i4
			  7 coverage_remain_days = i4
			  7 non_coverage_days = i4
			  7 coinsurance_days = i4
			  7 coinsurance_remain_days = i4
			  7 coinsurance_pct = f8
			  7 copay_amt = f8
			  7 deduct_pct = f8
			  7 deduct_remain_amt = f8
			  7 room_coverage_amt = f8
			  7 room_coverage_amt_qual_cd = f8
			  7 room_coverage_type_cd = f8
			  7 room_coverage_board_incl_cd = f8
			  7 comment_id = f8
			  7 comment_txt = vc
			  7 benefit_sch [*]
				8 encntr_benefit_sch_r_id = f8
				8 encntr_benefit_r_id = f8
				8 member_resp_type_cd = f8
				8 resp_range_start_nbr = i4
				8 resp_range_end_nbr = i4
				8 resp_type_qual_cd = f8
				8 resp_range_amt = f8
				8 resp_range_qual_cd = f8
			6 pricing_agency_cd = f8
			6 insured_card_name_first = vc
			6 insured_card_name_middle = vc
			6 insured_card_name_last = vc
			6 insured_card_name_suffix = vc
			6 signature_source_cd = f8
			6 accept_assignment_cd = f8
			6 encntr_plan_eligibility [*]
			  7 encntr_plan_eligibility_id = f8
			  7 encntr_plan_reltn_id = f8
			  7 auth_required_cd = f8
			  7 coverage_level_cd = f8
			  7 eligibility_status_cd = f8
			  7 in_plan_network_cd = f8
			  7 insurance_type_cd = f8
			  7 payer_prov_plan_name = vc
			  7 service_type_cd = f8
			  7 change_flag = i2
			  7 encntr_plan_elig_benefit [*]
				8 encntr_plan_elig_benefit_id = f8
				8 encntr_plan_eligibility_id = f8
				8 benefit_comments = vc
				8 benefit_comments_long_text_id = f8
				8 benefit_monetary_amt = f8
				8 benefit_monetary_amt_null_ind = i2
				8 benefit_pct = f8
				8 benefit_pct_null_ind = i2
				8 benefit_qty = f8
				8 benefit_qty_null_ind = i2
				8 benefit_qty_qual_cd = f8
				8 benefit_time_period_qual_cd = f8
				8 benefit_type_cd = f8
				8 info_source_cd = f8
				8 selected_ind = i2
				8 transaction_source_ident = vc
				8 change_flag = i2
			  7 procedure
				8 terminology_cd = f8
				8 source_identifier = vc
				8 nomenclature_id = f8
				8 description = vc
			  7 modifiers [*]
				8 modifier = vc
				8 nomenclature_id = f8
				8 description = vc
			6 eligibility_transaction_uuid = vc
			6 eligibility_status_cd = f8
			6 eligibility_sent_dt_tm = dq8
			6 eligibility_submit_ind = i2
			6 eligibility_cache_dt_tm = dq8
			6 eligibility_cache_expire_dt_tm = dq8
			6 verify_source_cd = f8
			6 resubmit_278n_cd = f8
			6 alt_member_nbr = vc
			6 ext_payer_name = vc
			6 ext_payer_ident = vc
			6 alt_payer_id = f8
			6 alt_payer_elig
			  7 eligibility_transaction_uuid = vc
			  7 eligibility_status_cd = f8
			  7 eligibility_sent_dt_tm = dq8
			  7 eligibility_submit_ind = i2
			  7 eligibility_cache_dt_tm = dq8
			  7 eligibility_cache_expire_dt_tm = dq8
			6 notify_source_cd = f8
			6 notify_dt_tm = dq8
			6 notify_prsnl_id = f8
			6 auth_required_cd = f8
		  5 review_group [*]
			6 review_group_reltn_id = f8
			6 organization_id = f8
			6 organization_name = vc
			6 specialty_cd = f8
			6 review_reltn_flag = i4
			6 address [*]
			  7 address_id = f8
			  7 parent_entity_name = vc
			  7 parent_entity_id = f8
			  7 address_type_cd = f8
			  7 address_format_cd = f8
			  7 contact_name = vc
			  7 residence_type_cd = f8
			  7 comment_txt = vc
			  7 street_addr = vc
			  7 street_addr2 = vc
			  7 street_addr3 = vc
			  7 street_addr4 = vc
			  7 city = vc
			  7 state = vc
			  7 state_cd = f8
			  7 zipcode = vc
			  7 zip_code_group_cd = f8
			  7 postal_barcode_info = vc
			  7 county = vc
			  7 county_cd = f8
			  7 country = vc
			  7 country_cd = f8
			  7 residence_cd = f8
			  7 mail_stop = vc
			  7 address_type_seq = i4
			  7 beg_effective_mm_dd = i4
			  7 end_effective_mm_dd = i4
			  7 updt_cnt = i4
			  7 updt_dt_tm = dq8
			  7 updt_id = f8
			  7 updt_task = i4
			  7 updt_applctx = i4
			  7 active_ind = i2
			  7 active_status_cd = f8
			  7 active_status_dt_tm = dq8
			  7 active_status_prsnl_id = f8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 data_status_cd = f8
			  7 data_status_dt_tm = dq8
			  7 data_status_prsnl_id = f8
			  7 contributor_system_cd = f8
			  7 operation_hours = vc
			  7 address_info_status_cd = f8
			  7 primary_care_cd = f8
			  7 district_health_cd = f8
			  7 addr_key = vc
			  7 source_identifier = vc
			  7 city_cd = f8
			  7 validation_expire_dt_tm = dq8
			  7 validation_warning_override_ind = i2
			6 phone [*]
			  7 phone_id = f8
			  7 parent_entity_name = vc
			  7 parent_entity_id = f8
			  7 phone_type_cd = f8
			  7 phone_format_cd = f8
			  7 phone_num = vc
			  7 phone_type_seq = i4
			  7 description = vc
			  7 contact = vc
			  7 call_instruction = vc
			  7 modem_capability_cd = f8
			  7 extension = vc
			  7 paging_code = vc
			  7 beg_effective_mm_dd = i4
			  7 end_effective_mm_dd = i4
			  7 updt_cnt = i4
			  7 updt_dt_tm = dq8
			  7 updt_id = f8
			  7 updt_task = i4
			  7 updt_applctx = i4
			  7 active_ind = i2
			  7 active_status_cd = f8
			  7 active_status_dt_tm = dq8
			  7 active_status_prsnl_id = f8
			  7 beg_effective_dt_tm = dq8
			  7 end_effective_dt_tm = dq8
			  7 data_status_cd = f8
			  7 data_status_dt_tm = dq8
			  7 data_status_prsnl_id = f8
			  7 contributor_system_cd = f8
			  7 operation_hours = vc
			  7 contact_method_cd = f8
			  7 email = vc
			  7 source_identifier = vc
			  7 texting_permission_cd = f8
		  5 fin [*]
			6 person_benefit_r_id = f8
			6 person_plan_reltn_id = f8
			6 coverage_type_cd = f8
			6 balance_type_cd = f8
			6 deduct_amt = f8
			6 deduct_met_amt = f8
			6 deduct_met_dt_tm = dq8
			6 fam_deduct_met_amt = f8
			6 fam_deduct_met_dt_tm = dq8
			6 max_out_pckt_amt = f8
			6 max_out_pckt_dt_tm = dq8
			6 benefit_plan_cd = f8
			6 service_type_cd = f8
			6 coverage_days = i4
			6 coverage_remain_days = i4
			6 non_coverage_days = i4
			6 coinsurance_days = i4
			6 coinsurance_remain_days = i4
			6 coinsurance_pct = f8
			6 copay_amt = f8
			6 deduct_pct = f8
			6 deduct_remain_amt = f8
			6 room_coverage_amt = f8
			6 room_coverage_amt_qual_cd = f8
			6 room_coverage_type_cd = f8
			6 room_coverage_board_incl_cd = f8
			6 comment_id = f8
			6 comment_txt = vc
			6 benefit_sch [*]
			  7 person_benefit_sch_r_id = f8
			  7 person_benefit_r_id = f8
			  7 member_resp_type_cd = f8
			  7 resp_range_start_nbr = i4
			  7 resp_range_end_nbr = i4
			  7 resp_type_qual_cd = f8
			  7 resp_range_amt = f8
			  7 resp_range_qual_cd = f8
		  5 insured_card_name_first = vc
		  5 insured_card_name_middle = vc
		  5 insured_card_name_last = vc
		  5 insured_card_name_suffix = vc
		  5 verify_source_cd = f8
		  5 alt_member_nbr = vc
		  5 ext_payer_name = vc
		  5 ext_payer_ident = vc
		  5 alt_payer_id = f8
		4 person_plan_grp [*]
		  5 person_plan_grp_id = f8
		  5 parent_id = f8
		  5 child_id = f8
		  5 person_plan_grp_cd = f8
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 contributor_system_cd = f8
		4 person_prsnl_reltn [*]
		  5 person_prsnl_reltn_id = f8
		  5 person_id = f8
		  5 person_prsnl_r_cd = f8
		  5 prsnl_person_id = f8
		  5 free_text_cd = f8
		  5 ft_prsnl_name = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 priority_seq = i4
		  5 internal_seq = i4
		  5 notification_cd = f8
		  5 demog_reltn_id = f8
		4 person_portal_invite
		  5 person_portal_invite_id = f8
		  5 challenge_question_cd = f8
		  5 challenge_answer_txt = vc
		  5 invite_action_cd = f8
		  5 online_identity_link_status_ind = i2
		  5 invite_status_cd = f8
		  5 error_reason_cd = f8
		4 person_payment_propensity [*]
		  5 person_payment_propensity_id = f8
		  5 data_source_cd = f8
		  5 score_value_txt = vc
		  5 score_desc = vc
		  5 healthcare_credit_score_value = f8
		  5 estimated_household_size_cnt = i4
		  5 estimated_household_income_amt = f8
		  5 number_of_bankruptcies_cnt = i4
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 comments [*]
			6 rvc_comment_id = f8
			6 comment_text = vc
			6 comment_type_cd = f8
			6 comment_type_class_cd = f8
	  3 rel_encounter [*]
		4 rel_encounter
		  5 encntr_id = f8
		  5 person_id = f8
		  5 create_dt_tm = dq8
		  5 create_prsnl_id = f8
		  5 encntr_class_cd = f8
		  5 encntr_type_cd = f8
		  5 encntr_type_class_cd = f8
		  5 encntr_status_cd = f8
		  5 pre_reg_dt_tm = dq8
		  5 pre_reg_prsnl_id = f8
		  5 reg_dt_tm = dq8
		  5 reg_prsnl_id = f8
		  5 est_arrive_dt_tm = dq8
		  5 est_depart_dt_tm = dq8
		  5 arrive_dt_tm = dq8
		  5 depart_dt_tm = dq8
		  5 admit_type_cd = f8
		  5 admit_src_cd = f8
		  5 admit_mode_cd = f8
		  5 admit_with_medication_cd = f8
		  5 referring_comment = vc
		  5 disch_disposition_cd = f8
		  5 disch_to_loctn_cd = f8
		  5 preadmit_nbr = vc
		  5 preadmit_testing_cd = f8
		  5 preadmit_testing_list_ind = i2
		  5 preadmit_testing [*]
			6 value_cd = f8
		  5 readmit_cd = f8
		  5 accommodation_cd = f8
		  5 accommodation_request_cd = f8
		  5 alt_result_dest_cd = f8
		  5 ambulatory_cond_cd = f8
		  5 courtesy_cd = f8
		  5 diet_type_cd = f8
		  5 isolation_cd = f8
		  5 med_service_cd = f8
		  5 result_dest_cd = f8
		  5 confid_level_cd = f8
		  5 vip_cd = f8
		  5 name_last_key = vc
		  5 name_first_key = vc
		  5 name_full_formatted = vc
		  5 name_last = vc
		  5 name_first = vc
		  5 name_phonetic = vc
		  5 sex_cd = f8
		  5 birth_dt_cd = f8
		  5 birth_dt_tm = dq8
		  5 species_cd = f8
		  5 location_cd = f8
		  5 loc_facility_cd = f8
		  5 loc_building_cd = f8
		  5 loc_nurse_unit_cd = f8
		  5 loc_room_cd = f8
		  5 loc_bed_cd = f8
		  5 disch_dt_tm = dq8
		  5 guarantor_type_cd = f8
		  5 loc_temp_cd = f8
		  5 organization_id = f8
		  5 reason_for_visit = vc
		  5 encntr_financial_id = f8
		  5 name_first_synonym_id = f8
		  5 financial_class_cd = f8
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 bbd_procedure_cd = f8
		  5 info_given_by = vc
		  5 safekeeping_cd = f8
		  5 trauma_cd = f8
		  5 trauma_dt_tm = dq8
		  5 triage_cd = f8
		  5 triage_dt_tm = dq8
		  5 visitor_status_cd = f8
		  5 valuables_cd = f8
		  5 valuables_list_ind = i2
		  5 valuables [*]
			6 value_cd = f8
		  5 security_access_cd = f8
		  5 refer_facility_cd = f8
		  5 accomp_by_cd = f8
		  5 accommodation_reason_cd = f8
		  5 service_category_cd = f8
		  5 est_length_of_stay = i4
		  5 contract_status_cd = f8
		  5 assign_to_loc_dt_tm = dq8
		  5 alt_lvl_care_cd = f8
		  5 program_service_cd = f8
		  5 specialty_unit_cd = f8
		  5 mental_health_cd = f8
		  5 mental_health_dt_tm = dq8
		  5 region_cd = f8
		  5 sitter_required_cd = f8
		  5 doc_rcvd_dt_tm = dq8
		  5 referral_rcvd_dt_tm = dq8
		  5 alt_lvl_care_dt_tm = dq8
		  5 alc_reason_cd = f8
		  5 alc_decomp_dt_tm = dq8
		  5 place_auth_prsnl_id = f8
		  5 inpatient_admit_dt_tm = dq8
		  5 birth_tz = i4
		  5 birth_tz_disp = vc
		  5 birth_prec_flag = i2
		  5 raw_birth_dt_tm = dq8
		  5 patient_classification_cd = f8
		  5 mental_category_cd = f8
		  5 psychiatric_status_cd = f8
		  5 disch_prsnl_id = f8
		  5 location_capacity
			6 begin_dt_tm = dq8
			6 end_dt_tm = dq8
			6 booking_id = f8
			6 booking_beg_dt_tm = dq8
			6 booking_end_dt_tm = dq8
			6 pend_booking_id = f8
			6 pend_booking_beg_dt_tm = dq8
			6 pend_booking_end_dt_tm = dq8
		  5 result_acc_dt_tm = dq8
		  5 reltn_encntrs [*]
			6 encntr_id = f8
		  5 episode
			6 episode_id = f8
			6 episode_breach_dt_tm = dq8
			6 episode_status_cd = f8
			6 episode_start_dt_tm = dq8
			6 episode_stop_dt_tm = dq8
			6 episode_pause_days_cnt = i4
			6 days_till_breach_cnt = i4
			6 episode_encntr_id = f8
			6 episode_type_cd = f8
			6 episode_display = vc
			6 cancel_encntr_episode_id = f8
			6 refer_facility_cd = f8
			6 service_category_cd = f8
			6 attenddoc
			  7 prsnl_person_id = f8
		  5 pregnancy_status_cd = f8
		  5 expected_delivery_dt_tm = dq8
		  5 last_menstrual_period_dt_tm = dq8
		  5 onset_dt_tm = dq8
		  5 level_of_service_cd = f8
		  5 encntr_code_value_r_ind = i2
		  5 encntr_code_value_r [*]
			6 code_set = i4
			6 code_value = f8
			6 encntr_code_value_r_id = f8
			6 encntr_id = f8
		  5 encntr_care_mgmt
			6 encntr_care_mgmt_id = f8
			6 utlztn_mgmt_status_cd = f8
			6 clinical_review_due_dt_tm = dq8
			6 disch_plan_status_cd = f8
			6 disch_plan_due_dt_tm = dq8
		  5 suspensions_ind = i2
		  5 suspensions
			6 suspensions_list [*]
			  7 action_flag = i2
			  7 pm_wait_list_id = f8
			  7 pm_wait_list_status_id = f8
			  7 status_dt_tm = dq8
			  7 status_end_dt_tm = dq8
			  7 reason_for_change_cd = f8
			  7 status_cd = f8
			  7 comments_text = vc
			  7 updt_dt_tm = dq8
			  7 comment_long_text_id = f8
			  7 updt_id = f8
			  7 username = vc
			  7 status_review_dt_tm = dq8
		  5 filter_by_field = f8
		  5 abn_status_cd = f8
		  5 place_of_svc_org_id = f8
		  5 place_of_svc_org_name = vc
		  5 place_of_svc_type_cd = f8
		  5 place_of_svc_admit_dt_tm = dq8
		  5 patient_events [*]
			6 patient_event_id = f8
			6 event_type_cd = f8
			6 event_dt_tm = dq8
			6 action = vc
		  5 est_financial_resp_amt = f8
		  5 treatment_phase_cd = f8
		  5 incident_cd = f8
		  5 client_organization_id = f8
		  5 client_organization_name = vc
		4 rel_diagnosis [*]
		  5 diagnosis_id = f8
		  5 person_id = f8
		  5 encntr_id = f8
		  5 nomenclature_id = f8
		  5 diag_dt_tm = dq8
		  5 diag_type_cd = f8
		  5 diagnostic_category_cd = f8
		  5 diag_priority = i4
		  5 diag_prsnl_id = f8
		  5 diag_prsnl_name = vc
		  5 diag_class_cd = f8
		  5 confid_level_cd = f8
		  5 attestation_dt_tm = dq8
		  5 reference_nbr = vc
		  5 seg_unique_key = vc
		  5 diag_ftdesc = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 contributor_system_cd = f8
		  5 priority_seq = i4
		  5 internal_seq = i4
		4 rel_encntr_alias [*]
		  5 encntr_alias_id = f8
		  5 encntr_id = f8
		  5 alias_pool_cd = f8
		  5 encntr_alias_type_cd = f8
		  5 alias = vc
		  5 encntr_alias_sub_type_cd = f8
		  5 check_digit = i4
		  5 check_digit_method_cd = f8
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 alias_pool_ext_cd = f8
		  5 sys_assign_flag = i2
		4 rel_encntr_info [*]
		  5 encntr_info_id = f8
		  5 encntr_id = f8
		  5 info_type_cd = f8
		  5 info_sub_type_cd = f8
		  5 long_text_id = f8
		  5 long_text = vc
		  5 value_numeric = i4
		  5 value_dt_tm = dq8
		  5 chartable_ind = i2
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 contributor_system_cd = f8
		  5 value_cd = f8
		  5 priority_seq = i4
		  5 internal_seq = i4
		  5 value_numeric_ind = i2
		4 rel_encntr_prsnl_reltn [*]
		  5 encntr_prsnl_reltn_id = f8
		  5 prsnl_person_id = f8
		  5 encntr_prsnl_r_cd = f8
		  5 encntr_id = f8
		  5 free_text_cd = f8
		  5 ft_prsnl_name = vc
		  5 updt_cnt = i4
		  5 updt_dt_tm = dq8
		  5 updt_id = f8
		  5 updt_task = i4
		  5 updt_applctx = i4
		  5 active_ind = i2
		  5 active_status_cd = f8
		  5 active_status_dt_tm = dq8
		  5 active_status_prsnl_id = f8
		  5 beg_effective_dt_tm = dq8
		  5 end_effective_dt_tm = dq8
		  5 data_status_cd = f8
		  5 data_status_dt_tm = dq8
		  5 data_status_prsnl_id = f8
		  5 contributor_system_cd = f8
		  5 priority_seq = i4
		  5 internal_seq = i4
		  5 expiration_ind = i2
		  5 notification_cd = f8
		  5 demog_reltn_id = f8
	  3 copy_correspondence_cd = f8
	  3 relation_seq = i2
	  3 source_identifier = vc
	  3 person_reltn_organizer_ind = i2
	2 removed_reltns[*]
		3 person_person_reltn_id = f8
		3 related_person_id = f8
		3 person_reltn_cd = f8
		3 related_person_reltn_cd = f8
		3 family_reltn_sub_type_cd = f8
		3 removed_reltn = i2
		3 removed_suggest_reltn = i2
	2 questionnaire [*]
	  3 questionnaire_id = f8
	  3 parent_entity_name = vc
	  3 parent_entity_id = f8
	  3 questions [*]
		4 question_id = f8
		4 value_type = vc
		4 value_nbr = f8
		4 value_dt_tm = dq8
		4 value_cd = f8
		4 value_text = vc
		4 value_ind = i2
		4 value_chc = i4
		4 question_meaning = vc
	  3 completed_by = vc
	  3 completed_date = dq8
	  3 reviewed_by = vc
	  3 reviewed_date = dq8
	  3 status_cd = f8
	2 eemtransaction
	  3 transaction [*]
		4 interchange_id = f8
		4 transaction_cd = f8
	2 new_questionnaire
	  3 questionnaire_id = f8
	  3 parent_entity_name = vc
	  3 parent_entity_id = f8
	  3 questions [*]
		4 question_id = f8
		4 value_type = vc
		4 value_nbr = f8
		4 value_dt_tm = dq8
		4 value_cd = f8
		4 value_text = vc
		4 value_ind = i2
		4 value_chc = i4
		4 question_meaning = vc
	  3 completed_by = vc
	  3 completed_date = dq8
	  3 reviewed_by = vc
	  3 reviewed_date = dq8
	  3 status_cd = f8
	2 person_portal_invite
	  3 person_portal_invite_id = f8
	  3 challenge_question_cd = f8
	  3 challenge_answer_txt = vc
	  3 invite_action_cd = f8
	  3 online_identity_link_status_ind = i2
	  3 invite_status_cd = f8
	  3 error_reason_cd = f8
	2 social_healthcare
	  3 social_healthcare_id = f8
	  3 verify_status_cd = f8
	  3 verify_source_cd = f8
	  3 verify_prsnl_id = f8
	  3 verify_dt_tm = dq8
	  3 eligibility_expire_dt_tm = dq8
	  3 eligibility_status_cd = f8
	2 person_payment_propensity [*]
	  3 person_payment_propensity_id = f8
	  3 data_source_cd = f8
	  3 score_value_txt = vc
	  3 score_desc = vc
	  3 healthcare_credit_score_value = f8
	  3 estimated_household_size_cnt = i4
	  3 estimated_household_income_amt = f8
	  3 number_of_bankruptcies_cnt = i4
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 comments [*]
		4 rvc_comment_id = f8
		4 comment_text = vc
		4 comment_type_cd = f8
		4 comment_type_class_cd = f8
  1 encounter
	2 encounter
      3 new_encntr_ind = i2		;Added
      3 encntr_pending_id = f8	;Added
	  3 encntr_id = f8
	  3 person_id = f8
	  3 create_dt_tm = dq8
	  3 create_prsnl_id = f8
	  3 encntr_class_cd = f8
	  3 encntr_type_cd = f8
	  3 encntr_type_class_cd = f8
	  3 encntr_status_cd = f8
	  3 pre_reg_dt_tm = dq8
	  3 pre_reg_prsnl_id = f8
	  3 reg_dt_tm = dq8
	  3 reg_prsnl_id = f8
	  3 est_arrive_dt_tm = dq8
	  3 est_depart_dt_tm = dq8
	  3 arrive_dt_tm = dq8
	  3 depart_dt_tm = dq8
	  3 admit_type_cd = f8
	  3 admit_src_cd = f8
	  3 admit_mode_cd = f8
	  3 admit_with_medication_cd = f8
	  3 referring_comment = vc
	  3 disch_disposition_cd = f8
	  3 disch_to_loctn_cd = f8
	  3 preadmit_nbr = vc
	  3 preadmit_testing_cd = f8
	  3 preadmit_testing_list_ind = i2
	  3 preadmit_testing [*]
		4 value_cd = f8
	  3 readmit_cd = f8
	  3 accommodation_cd = f8
	  3 accommodation_request_cd = f8
	  3 alt_result_dest_cd = f8
	  3 ambulatory_cond_cd = f8
	  3 courtesy_cd = f8
	  3 diet_type_cd = f8
	  3 isolation_cd = f8
	  3 med_service_cd = f8
	  3 result_dest_cd = f8
	  3 confid_level_cd = f8
	  3 vip_cd = f8
	  3 name_last_key = vc
	  3 name_first_key = vc
	  3 name_full_formatted = vc
	  3 name_last = vc
	  3 name_first = vc
	  3 name_phonetic = vc
	  3 sex_cd = f8
	  3 birth_dt_cd = f8
	  3 birth_dt_tm = dq8
	  3 species_cd = f8
	  3 location_cd = f8
	  3 loc_facility_cd = f8
	  3 loc_building_cd = f8
	  3 loc_nurse_unit_cd = f8
	  3 loc_room_cd = f8
	  3 loc_bed_cd = f8
	  3 disch_dt_tm = dq8
	  3 guarantor_type_cd = f8
	  3 loc_temp_cd = f8
	  3 organization_id = f8
	  3 reason_for_visit = vc
	  3 encntr_financial_id = f8
	  3 name_first_synonym_id = f8
	  3 financial_class_cd = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 bbd_procedure_cd = f8
	  3 info_given_by = vc
	  3 safekeeping_cd = f8
	  3 trauma_cd = f8
	  3 trauma_dt_tm = dq8
	  3 triage_cd = f8
	  3 triage_dt_tm = dq8
	  3 visitor_status_cd = f8
	  3 valuables_cd = f8
	  3 valuables_list_ind = i2
	  3 valuables [*]
		4 value_cd = f8
	  3 security_access_cd = f8
	  3 refer_facility_cd = f8
	  3 accomp_by_cd = f8
	  3 accommodation_reason_cd = f8
	  3 service_category_cd = f8
	  3 est_length_of_stay = i4
	  3 contract_status_cd = f8
	  3 assign_to_loc_dt_tm = dq8
	  3 alt_lvl_care_cd = f8
	  3 program_service_cd = f8
	  3 specialty_unit_cd = f8
	  3 mental_health_cd = f8
	  3 mental_health_dt_tm = dq8
	  3 region_cd = f8
	  3 sitter_required_cd = f8
	  3 doc_rcvd_dt_tm = dq8
	  3 referral_rcvd_dt_tm = dq8
	  3 alt_lvl_care_dt_tm = dq8
	  3 alc_reason_cd = f8
	  3 alc_decomp_dt_tm = dq8
	  3 place_auth_prsnl_id = f8
	  3 inpatient_admit_dt_tm = dq8
	  3 birth_tz = i4
	  3 birth_tz_disp = vc
	  3 birth_prec_flag = i2
	  3 raw_birth_dt_tm = dq8
	  3 patient_classification_cd = f8
	  3 mental_category_cd = f8
	  3 psychiatric_status_cd = f8
	  3 disch_prsnl_id = f8
	  3 location_capacity
		4 begin_dt_tm = dq8
		4 end_dt_tm = dq8
		4 booking_id = f8
		4 booking_beg_dt_tm = dq8
		4 booking_end_dt_tm = dq8
		4 pend_booking_id = f8
		4 pend_booking_beg_dt_tm = dq8
		4 pend_booking_end_dt_tm = dq8
	  3 result_acc_dt_tm = dq8
	  3 reltn_encntrs [*]
		4 encntr_id = f8
	  3 episode
		4 episode_id = f8
		4 episode_breach_dt_tm = dq8
		4 episode_status_cd = f8
		4 episode_start_dt_tm = dq8
		4 episode_stop_dt_tm = dq8
		4 episode_pause_days_cnt = i4
		4 days_till_breach_cnt = i4
		4 episode_encntr_id = f8
		4 episode_type_cd = f8
		4 episode_display = vc
		4 cancel_encntr_episode_id = f8
		4 refer_facility_cd = f8
		4 service_category_cd = f8
		4 attenddoc
		  5 prsnl_person_id = f8
	  3 pregnancy_status_cd = f8
	  3 expected_delivery_dt_tm = dq8
	  3 last_menstrual_period_dt_tm = dq8
	  3 onset_dt_tm = dq8
	  3 level_of_service_cd = f8
	  3 encntr_code_value_r_ind = i2
	  3 encntr_code_value_r [*]
		4 code_set = i4
		4 code_value = f8
		4 encntr_code_value_r_id = f8
		4 encntr_id = f8
	  3 encntr_care_mgmt
		4 encntr_care_mgmt_id = f8
		4 utlztn_mgmt_status_cd = f8
		4 clinical_review_due_dt_tm = dq8
		4 disch_plan_status_cd = f8
		4 disch_plan_due_dt_tm = dq8
	  3 suspensions_ind = i2
	  3 suspensions
		4 suspensions_list [*]
		  5 action_flag = i2
		  5 pm_wait_list_id = f8
		  5 pm_wait_list_status_id = f8
		  5 status_dt_tm = dq8
		  5 status_end_dt_tm = dq8
		  5 reason_for_change_cd = f8
		  5 status_cd = f8
		  5 comments_text = vc
		  5 updt_dt_tm = dq8
		  5 comment_long_text_id = f8
		  5 updt_id = f8
		  5 username = vc
		  5 status_review_dt_tm = dq8
	  3 filter_by_field = f8
	  3 abn_status_cd = f8
	  3 place_of_svc_org_id = f8
	  3 place_of_svc_org_name = vc
	  3 place_of_svc_type_cd = f8
	  3 place_of_svc_admit_dt_tm = dq8
	  3 patient_events [*]
		4 patient_event_id = f8
		4 event_type_cd = f8
		4 event_dt_tm = dq8
		4 action = vc
	  3 est_financial_resp_amt = f8
	  3 treatment_phase_cd = f8
	  3 incident_cd = f8
	  3 client_organization_id = f8
	  3 client_organization_name = vc
	2 diagnosis [*]
	  3 diagnosis_id = f8
	  3 person_id = f8
	  3 encntr_id = f8
	  3 nomenclature_id = f8
	  3 diag_dt_tm = dq8
	  3 diag_type_cd = f8
	  3 diagnostic_category_cd = f8
	  3 diag_priority = i4
	  3 diag_prsnl_id = f8
	  3 diag_prsnl_name = vc
	  3 diag_class_cd = f8
	  3 confid_level_cd = f8
	  3 attestation_dt_tm = dq8
	  3 reference_nbr = vc
	  3 seg_unique_key = vc
	  3 diag_ftdesc = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 contributor_system_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	2 encntr_alias [*]
	  3 encntr_alias_id = f8
	  3 encntr_id = f8
	  3 alias_pool_cd = f8
	  3 encntr_alias_type_cd = f8
	  3 alias = vc
	  3 encntr_alias_sub_type_cd = f8
	  3 check_digit = i4
	  3 check_digit_method_cd = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 alias_pool_ext_cd = f8
	  3 sys_assign_flag = i2
	2 encntr_info [*]
	  3 encntr_info_id = f8
	  3 encntr_id = f8
	  3 info_type_cd = f8
	  3 info_sub_type_cd = f8
	  3 long_text_id = f8
	  3 long_text = vc
	  3 value_numeric = i4
	  3 value_dt_tm = dq8
	  3 chartable_ind = i2
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 contributor_system_cd = f8
	  3 value_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 value_numeric_ind = i2
	2 encntr_org_reltn [*]
	  3 encntr_org_reltn_id = f8
	  3 encntr_id = f8
	  3 encntr_org_reltn_type_cd = f8
	  3 encntr_org_reltn_cd = f8
	  3 organization_id = f8
	  3 encntr_org_nbr = vc
	  3 encntr_org_alias = vc
	  3 free_text_ind = i2
	  3 ft_org_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 research_account_id = f8
	  3 research_account_nbr = vc
	  3 address
		4 address_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 address_type_cd = f8
		4 address_format_cd = f8
		4 contact_name = vc
		4 residence_type_cd = f8
		4 comment_txt = vc
		4 street_addr = vc
		4 street_addr2 = vc
		4 street_addr3 = vc
		4 street_addr4 = vc
		4 city = vc
		4 state = vc
		4 state_cd = f8
		4 zipcode = vc
		4 zip_code_group_cd = f8
		4 postal_barcode_info = vc
		4 county = vc
		4 county_cd = f8
		4 country = vc
		4 country_cd = f8
		4 residence_cd = f8
		4 mail_stop = vc
		4 address_type_seq = i4
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 address_info_status_cd = f8
		4 primary_care_cd = f8
		4 district_health_cd = f8
		4 addr_key = vc
		4 source_identifier = vc
		4 city_cd = f8
		4 validation_expire_dt_tm = dq8
		4 validation_warning_override_ind = i2
	  3 phone
		4 phone_id = f8
		4 parent_entity_name = vc
		4 parent_entity_id = f8
		4 phone_type_cd = f8
		4 phone_format_cd = f8
		4 phone_num = vc
		4 phone_type_seq = i4
		4 description = vc
		4 contact = vc
		4 call_instruction = vc
		4 modem_capability_cd = f8
		4 extension = vc
		4 paging_code = vc
		4 beg_effective_mm_dd = i4
		4 end_effective_mm_dd = i4
		4 updt_cnt = i4
		4 updt_dt_tm = dq8
		4 updt_id = f8
		4 updt_task = i4
		4 updt_applctx = i4
		4 active_ind = i2
		4 active_status_cd = f8
		4 active_status_dt_tm = dq8
		4 active_status_prsnl_id = f8
		4 beg_effective_dt_tm = dq8
		4 end_effective_dt_tm = dq8
		4 data_status_cd = f8
		4 data_status_dt_tm = dq8
		4 data_status_prsnl_id = f8
		4 contributor_system_cd = f8
		4 operation_hours = vc
		4 contact_method_cd = f8
		4 email = vc
		4 source_identifier = vc
		4 texting_permission_cd = f8
	2 encntr_person_reltn [*]
	  3 encntr_person_reltn_id = f8
	  3 person_reltn_type_cd = f8
	  3 encntr_id = f8
	  3 person_reltn_cd = f8
	  3 related_person_reltn_cd = f8
	  3 related_person_id = f8
	  3 contact_role_cd = f8
	  3 genetic_relationship_ind = i2
	  3 living_with_ind = i2
	  3 visitation_allowed_cd = f8
	  3 priority_seq = i4
	  3 free_text_cd = f8
	  3 ft_rel_person_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 internal_seq = i4
	  3 family_reltn_sub_type_cd = f8
	2 encntr_prsnl_reltn [*]
	  3 encntr_prsnl_reltn_id = f8
	  3 prsnl_person_id = f8
	  3 encntr_prsnl_r_cd = f8
	  3 encntr_id = f8
	  3 free_text_cd = f8
	  3 ft_prsnl_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 expiration_ind = i2
	  3 notification_cd = f8
	  3 demog_reltn_id = f8
	2 encntr_accident [*]
	  3 encntr_accident_id = f8
	  3 encntr_id = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 accident_dt_tm = dq8
	  3 accident_cd = f8
	  3 accident_loctn = vc
	  3 accident_text = vc
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 acc_state_cd = f8
	  3 acc_job_related_cd = f8
	  3 acc_death_cd = f8
	  3 police_involve_cd = f8
	  3 police_force_cd = f8
	  3 police_badge_nbr = vc
	  3 ambulance_arrive_cd = f8
	  3 ambulance_geo_cd = f8
	  3 ambulance_serv_nbr = vc
	  3 acc_empl_org_id = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 place_cd = f8
	2 wait_list [*]
	  3 pend_notification_dt_tm = dq8
	  3 pend_acceptance_dt_tm = dq8
	  3 pend_place_priority_cd = f8
	  3 pend_place_priority_dt_tm = dq8
	  3 pm_wait_list_id = f8
	  3 person_id = f8
	  3 encntr_id = f8
	  3 auto_blood_ind = i2
	  3 decline_status_cd = f8
	  3 decline_status_dt_tm = dq8
	  3 delay_status_cd = f8
	  3 delay_status_dt_tm = dq8
	  3 est_length_procedure_cd = f8
	  3 other_med_condition = vc
	  3 financial_class_eff_dt_tm = dq8
	  3 reason_for_change_cd = f8
	  3 reason_for_removal_cd = f8
	  3 reason_for_removal = vc
	  3 recommend_dt_tm = dq8
	  3 removal_dt_tm = dq8
	  3 location_cd = f8
	  3 loc_facility_cd = f8
	  3 loc_building_cd = f8
	  3 loc_nurse_unit_cd = f8
	  3 loc_room_cd = f8
	  3 loc_bed_cd = f8
	  3 planned_procedure_cd = f8
	  3 planned_procedure_dt_tm = dq8
	  3 pre_admit_attend_ind = i2
	  3 pre_admit_clin_appt_dt_tm = dq8
	  3 provisional_admit_dt_tm = dq8
	  3 urgency_cd = f8
	  3 urgency_dt_tm = dq8
	  3 stand_by_cd = f8
	  3 status_dt_tm = dq8
	  3 status_review_cd = f8
	  3 status_review_dt_tm = dq8
	  3 status_cd = f8
	  3 program_service_cd = f8
	  3 specialty_unit_cd = f8
	  3 region_cd = f8
	  3 security_access_cd = f8
	  3 sitter_required_cd = f8
	  3 doc_rcvd_dt_tm = dq8
	  3 referral_rcvd_dt_tm = dq8
	  3 alt_lvl_care_dt_tm = dq8
	  3 alc_reason_cd = f8
	  3 alc_decomp_dt_tm = dq8
	  3 admit_category_cd = f8
	  3 admit_booking_cd = f8
	  3 management_cd = f8
	  3 status_end_dt_tm = dq8
	  3 referral_source_cd = f8
	  3 service_type_requested_cd = f8
	  3 functional_deficiency_cd = f8
	  3 functional_deficiency_cause_cd = f8
	  3 attend_cd = f8
	  3 supra_service_request_cd = f8
	  3 commissioner_reference = c50
	  3 appointment_cd = f8
	  3 referral_type_cd = f8
	  3 referral_reason_cd = f8
	  3 attendance_cd = f8
	  3 referral_dt_tm = dq8
	  3 attenddoc_clinical_service_cd = f8
	  3 orig_request_received_dt_tm = dq8
	  3 accommodation_cd = f8
	  3 admit_type_cd = f8
	  3 financial_class_cd = f8
	  3 med_service_cd = f8
	  3 comments_re_discharge = vc
	  3 admitting_prsnl_id = f8
	  3 last_dna_dt_tm = dq8
	  3 admit_offer_outcome_cd = f8
	  3 admit_guaranteed_dt_tm = dq8
	  3 admit_decision_dt_tm = dq8
	  3 prev_prov_admit_dt_tm = dq8
	  3 operation_cd = f8
	  3 anesthetic_cd = f8
	  3 comment_long_text_id = f8
	  3 comment_long_text = vc
	  3 suspended_days = f8
	  3 waiting_start_dt_tm = dq8
	  3 waiting_end_dt_tm = dq8
	  3 adj_waiting_start_dt_tm = dq8
	  3 adj_waiting_time = i4
	  3 waiting_time = i4
	  3 adj_waiting_time_formatted = vc
	  3 waiting_time_formatted = vc
	  3 comment_long_text_new = vc
	  3 ncepod_cd = f8
	  3 cancer_referral_cd = f8
	  3 readmit_wait_list_needed_ind = i2
	  3 readmit_wait_list_answer_ind = i2
	  3 readmitted_wait_list_ind = i2
	  3 readmitted_parent_encntr_id = f8
	  3 copy_wait_list_suspend_ind = i2
	  3 gen_sch_request_ind = i2
	  3 copy_encntr_procedure_ind = i2
	  3 reschd_appt_by_dt_tm = dq8
	  3 refused_first_available_ind = f8
	  3 status_detail_cd = f8
	  3 from_ed_ind = i2
	2 encntr_condition_code [*]
	  3 condition_code_id = f8
	  3 encntr_id = f8
	  3 condition_cd = f8
	  3 sequence = i4
	2 encntr_value_code [*]
	  3 value_code_id = f8
	  3 encntr_id = f8
	  3 value_cd = f8
	  3 amount = f8
	  3 sequence = i4
	2 encntr_occurrence_code [*]
	  3 occurrence_code_id = f8
	  3 encntr_id = f8
	  3 occurrence_cd = f8
	  3 occurrence_dt_tm = dq8
	  3 sequence = i4
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	2 encntr_span_code [*]
	  3 span_code_id = f8
	  3 encntr_id = f8
	  3 span_cd = f8
	  3 span_from_dt_tm = dq8
	  3 span_to_dt_tm = dq8
	  3 sequence = i4
	2 encntr_leave
	  3 encntr_leave_id = f8
	  3 encntr_id = f8
	  3 leave_comment = vc
	  3 leave_dt_tm = dq8
	  3 leave_ind = i2
	  3 leave_location = vc
	  3 leave_reason_cd = f8
	  3 leave_user_id = f8
	  3 est_return_dt_tm = dq8
	  3 return_comment = vc
	  3 return_dt_tm = dq8
	  3 location_cd = f8
	  3 loc_facility_cd = f8
	  3 loc_building_cd = f8
	  3 loc_nurse_unit_cd = f8
	  3 loc_room_cd = f8
	  3 loc_bed_cd = f8
	  3 return_reason_cd = f8
	  3 return_user_id = f8
	  3 cancel_comment = vc
	  3 cancel_dt_tm = dq8
	  3 cancel_reason_cd = f8
	  3 cancel_user_id = f8
	  3 program_service_cd = f8
	  3 specialty_unit_cd = f8
	  3 contact_list_cd = f8
	  3 leave_type_cd = f8
	  3 hold_rmvl_dt_tm = dq8
	  3 auto_disch_dt_tm = dq8
	2 encntr_pending [*]
	  3 encntr_pending_id = f8
	  3 encntr_id = f8
	  3 accommodation_cd = f8
	  3 accommodation_reason_cd = f8
	  3 alt_lvl_care_cd = f8
	  3 disch_disposition_cd = f8
	  3 disch_to_loctn_cd = f8
	  3 encntr_type_cd = f8
	  3 est_complete_dt_tm = dq8
	  3 isolation_cd = f8
	  3 pend_facility_cd = f8
	  3 pend_building_cd = f8
	  3 pend_nurse_unit_cd = f8
	  3 pend_room_cd = f8
	  3 pend_bed_cd = f8
	  3 med_service_cd = f8
	  3 pending_dt_tm = dq8
	  3 pending_priority_cd = f8
	  3 pending_status_cd = f8
	  3 pending_prsnl_id = f8
	  3 process_status_flag = i2
	  3 pending_type_flag = i2
	  3 service_category_cd = f8
	  3 transaction_reason_cd = f8
	  3 transaction_reason = vc
	  3 priority_seq = i2
	  3 pend_program_service_cd = f8
	  3 pend_specialty_unit_cd = f8
	  3 alt_lvl_care_dt_tm = dq8
	  3 alc_reason_cd = f8
	  3 alc_decomp_dt_tm = dq8
	  3 attenddoc_id = f8
	2 ACP [*]
	  3 sub_action_flag = i2
	  3 encntr_augm_care_period_id = f8
	  3 encntr_id = f8
	  3 person_id = f8
	  3 augm_care_period_plan_cd = f8
	  3 augm_medical_service_cd = f8
	  3 num_organ_sys_support_nbr = i4
	  3 high_depend_care_lvl_days = i4
	  3 intensive_care_lvl_days = i4
	  3 transaction_dt_tm = dq8
	  3 augm_care_period_source_cd = f8
	  3 augm_care_period_disposal_cd = f8
	2 service_alloc
	  3 service_line_agreement = vc
	  3 commissioner_code = vc
	  3 commissioner_name = vc
	  3 commissioner_id = f8
	  3 benefit_alloc_id = f8
	  3 eem_benefit_id = f8
	  3 contract_id = f8
	  3 contract_name = vc
	  3 nca_ind = i2
	2 movement
	  3 movement_id = f8
	  3 administratif_event_cd = f8
	  3 movement_alias = vc
	  3 movement_dt_tm = dq8
	  3 movement_end_dt_tm = dq8
	  3 movement_action_cd = f8
	  3 historical_movement_ind = i2
	  3 original_trigger_event_cd = f8
	  3 ward_of_medical_resp_cd = f8
	  3 ward_of_care_resp_cd = f8
	  3 movement_event_cd = f8
	  3 establish_of_origin_loc_id = f8
	  3 prior_admit_dt_tm = dq8
	  3 mode_transport_on_exit_cd = f8
	  3 entry_mode_pmsi_cd = f8
	  3 exit_mode_pmsi_cd = f8
	  3 origin_mode_pmsi_cd = f8
	  3 dest_mode_pmsi_cd = f8
	  3 DMT_cd = f8
	  3 managed_care_cd = f8
	  3 disch_to_loc_id = f8
	  3 socio_prof_activity_cd = f8
	  3 socio_prof_category_cd = f8
	  3 historical_attenddoc_id = f8
	  3 reason_for_visit_cd = f8
	2 social_healthcare
	  3 social_healthcare_id = f8
	  3 verify_status_cd = f8
	  3 verify_source_cd = f8
	  3 verify_prsnl_id = f8
	  3 verify_dt_tm = dq8
	  3 eligibility_expire_dt_tm = dq8
	  3 eligibility_status_cd = f8
  1 combine_list [*]
	2 combine_entity = vc
	2 combine_id = f8
	2 to_entity_id = f8
	2 from_entity_id = f8
	2 encntr_id = f8
  1 person_swap
	2 person
	  3 person_id = f8
	  3 create_dt_tm = dq8
	  3 create_prsnl_id = f8
	  3 person_type_cd = f8
	  3 name_last_key = vc
	  3 name_first_key = vc
	  3 name_full_formatted = vc
	  3 autopsy_cd = f8
	  3 birth_dt_cd = f8
	  3 birth_dt_tm = dq8
	  3 conception_dt_tm = dq8
	  3 cause_of_death = vc
	  3 cause_of_death_cd = f8
	  3 deceased_cd = f8
	  3 deceased_dt_tm = dq8
	  3 deceased_source_cd = f8
	  3 ethnic_grp_cd = f8
	  3 language_cd = f8
	  3 marital_type_cd = f8
	  3 purge_option_cd = f8
	  3 race_cd = f8
	  3 religion_cd = f8
	  3 sex_cd = f8
	  3 sex_age_change_ind = i2
	  3 language_dialect_cd = f8
	  3 name_last = vc
	  3 name_first = vc
	  3 name_phonetic = c8
	  3 last_encntr_dt_tm = dq8
	  3 species_cd = f8
	  3 confid_level_cd = f8
	  3 vip_cd = f8
	  3 name_first_synonym_id = f8
	  3 citizenship_cd = f8
	  3 vet_military_status_cd = f8
	  3 mother_maiden_name = vc
	  3 nationality_cd = f8
	  3 military_rank_cd = f8
	  3 military_service_cd = f8
	  3 military_base_location = vc
	  3 ft_entity_name = c32
	  3 ft_entity_id = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 name_middle_key = vc
	  3 name_middle = vc
	  3 birth_tz = i4
	  3 birth_tz_disp = vc
	  3 birth_prec_flag = i2
	  3 raw_birth_dt_tm = dq8
	  3 deceased_id_method_cd = f8
	  3 abs_birth_date = vc
	  3 person_code_value_r_ind = i2
	  3 person_code_value_r [*]
		4 code_set = i4
		4 code_value = f8
		4 person_code_value_r_id = f8
		4 person_id = f8
	  3 person_status_cd = f8
	  3 abn_checks
		4 abn_checks_list [*]
		  5 person_id = f8
		  5 procedure_source_ident = vc
		  5 procedure_vocab_cd = f8
		  5 diagnosis_source_ident = vc
		  5 diagnosis_vocab_cd = f8
		  5 payer_id = f8
		  5 health_plan_id = f8
		  5 sponsor_id = f8
		  5 parent1_id = f8
		  5 parent1_table = vc
		  5 parent2_id = f8
		  5 parent2_table = vc
		  5 parent3_id = f8
		  5 parent3_table = vc
		  5 abn_check_id = f8
		  5 abn_state_cd = f8
		  5 abn_state_meaning = vc
		  5 prev_abn_form_id = f8
		  5 high_status_cd = f8
		  5 high_status_meaning = vc
		  5 location_cd = f8
		  5 diag_qual_list [*]
			6 diagnosis_source_ident = vc
			6 diagnosis_vocab_cd = f8
		  5 mod_qual_list [*]
			6 mod_nomen_id = f8
			6 mod_source_ident = vc
			6 mod_vocab_cd = f8
			6 mod_vocab_meaning = vc
		  5 med_status_cd = f8
		  5 med_status_meaning = vc
		  5 parent_mnemonic = vc
	  3 race_list_ind = i2
	  3 race_list [*]
		4 value_cd = f8
	  3 ethnic_grp_list_ind = i2
	  3 ethnic_grp_list [*]
		4 value_cd = f8
	  3 person_military
		4 assigned_unit_org_id = f8
		4 assigned_unit_org_name = vc
		4 attached_unit_org_id = f8
		4 attached_unit_org_name = vc
		4 command_security_cd = f8
		4 flying_status_cd = f8
	  3 data_not_collected
		4 home_address_cd = f8
		4 home_email_cd = f8
		4 phone_cd = f8
		4 ssn_cd = f8
		4 nhn_cd = f8
	  3 emancipation_dt_tm = dq8
	  3 deceased_tz = i4
	  3 deceased_dt_tm_prec_flag = i2
	2 person_patient
	  3 person_id = f8
	  3 adopted_cd = f8
	  3 bad_debt_cd = f8
	  3 baptised_cd = f8
	  3 birth_multiple_cd = f8
	  3 birth_order = i4
	  3 birth_length = f8
	  3 birth_length_units_cd = f8
	  3 birth_name = vc
	  3 birth_weight = f8
	  3 birth_weight_units_cd = f8
	  3 church_cd = f8
	  3 credit_hrs_taking = i4
	  3 cumm_leave_days = i4
	  3 current_balance = f8
	  3 current_grade = i4
	  3 custody_cd = f8
	  3 degree_complete_cd = f8
	  3 diet_type_cd = f8
	  3 family_income = f8
	  3 family_size = i4
	  3 highest_grade_complete_cd = f8
	  3 immun_on_file_cd = f8
	  3 interp_required_cd = f8
	  3 interp_type_cd = f8
	  3 microfilm_cd = f8
	  3 nbr_of_brothers = i4
	  3 nbr_of_sisters = i4
	  3 organ_donor_cd = f8
	  3 parent_marital_status_cd = f8
	  3 smokes_cd = f8
	  3 tumor_registry_cd = f8
	  3 last_bill_dt_tm = dq8
	  3 last_bind_dt_tm = dq8
	  3 last_discharge_dt_tm = dq8
	  3 last_event_updt_dt_tm = dq8
	  3 last_payment_dt_tm = dq8
	  3 last_atd_activity_dt_tm = dq8
	  3 student_cd = f8
	  3 living_dependency_cd = f8
	  3 living_arrangement_cd = f8
	  3 living_will_cd = f8
	  3 nbr_of_pregnancies = i4
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 last_trauma_dt_tm = dq8
	  3 mother_identifier = c100
	  3 mother_identifier_cd = f8
	  3 disease_alert_cd = f8
	  3 disease_alert_list_ind = i2
	  3 disease_alert [*]
		4 value_cd = f8
	  3 process_alert_cd = f8
	  3 process_alert_list_ind = i2
	  3 process_alert [*]
		4 value_cd = f8
	  3 contact_list_cd = f8
	  3 birth_number = i2
	  3 gestation_length = i2
	  3 int_delivery_loc_type = f8
	  3 act_delivery_loc_type = f8
	  3 delivery_loc_reason = c100
	  3 live_still_birth = f8
	  3 susp_congenital_anomaly = f8
	  3 contact_method_cd = f8
	  3 contact_time = c255
	  3 callback_consent_cd = f8
	  3 prev_contact_ind = i2
	  3 birth_order_cd = f8
	  3 written_format_cd = f8
	  3 source_version_number = c255
	  3 source_sync_level_flag = f8
	  3 iqh_participant_cd = f8
	  3 family_nbr_of_minors_cnt = i4
	  3 family_income_source_cd = f8
	  3 fin_statement_expire_dt_tm = dq8
	  3 fin_statement_verified_dt_tm = dq8
	  3 fam_income_source_list_ind = i2
	  3 fam_income_source [*]
		4 value_cd = f8
	  3 health_info_access_offered_cd = f8
	  3 birth_sex_cd = f8
	  3 health_app_access_offered_cd = f8
	  3 financial_risk_level_cd = f8
	  3 source_last_sync_dt_tm = dq8
	2 person_name [*]
	  3 person_name_id = f8
	  3 person_id = f8
	  3 name_type_cd = f8
	  3 name_original = vc
	  3 name_format_cd = f8
	  3 name_full = vc
	  3 name_first = vc
	  3 name_middle = vc
	  3 name_last = vc
	  3 name_degree = vc
	  3 name_title = vc
	  3 name_prefix = vc
	  3 name_suffix = vc
	  3 name_initials = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 source_identifier = vc
	  3 name_type_seq = i4
	2 person_alias [*]
	  3 person_alias_id = f8
	  3 person_id = f8
	  3 alias_pool_cd = f8
	  3 person_alias_type_cd = f8
	  3 alias = vc
	  3 person_alias_sub_type_cd = f8
	  3 check_digit = i4
	  3 check_digit_method_cd = f8
	  3 visit_seq_nbr = i4
	  3 health_card_province = vc
	  3 health_card_ver_code = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 alias_pool_ext_cd = f8
	  3 sys_assign_flag = i2
	  3 health_card_type = c32
	  3 health_card_issue_dt_tm = dq8
	  3 health_card_expiry_dt_tm = dq8
	  3 person_alias_status_cd = f8
	  3 response_cd = f8
	  3 validation_dt_tm = dq8
	  3 alias_expiry_dt_tm = dq8
	  3 person_alias_record_status_cd = f8
	2 person_info [*]
	  3 person_info_id = f8
	  3 person_id = f8
	  3 info_type_cd = f8
	  3 info_sub_type_cd = f8
	  3 long_text_id = f8
	  3 long_text = vc
	  3 value_numeric = i4
	  3 value_dt_tm = dq8
	  3 chartable_ind = i2
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 contributor_system_cd = f8
	  3 value_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 value_numeric_ind = i2
  1 encounter_swap
	2 encounter
	  3 encntr_id = f8
	  3 person_id = f8
	  3 create_dt_tm = dq8
	  3 create_prsnl_id = f8
	  3 encntr_class_cd = f8
	  3 encntr_type_cd = f8
	  3 encntr_type_class_cd = f8
	  3 encntr_status_cd = f8
	  3 pre_reg_dt_tm = dq8
	  3 pre_reg_prsnl_id = f8
	  3 reg_dt_tm = dq8
	  3 reg_prsnl_id = f8
	  3 est_arrive_dt_tm = dq8
	  3 est_depart_dt_tm = dq8
	  3 arrive_dt_tm = dq8
	  3 depart_dt_tm = dq8
	  3 admit_type_cd = f8
	  3 admit_src_cd = f8
	  3 admit_mode_cd = f8
	  3 admit_with_medication_cd = f8
	  3 referring_comment = vc
	  3 disch_disposition_cd = f8
	  3 disch_to_loctn_cd = f8
	  3 preadmit_nbr = vc
	  3 preadmit_testing_cd = f8
	  3 preadmit_testing_list_ind = i2
	  3 preadmit_testing [*]
		4 value_cd = f8
	  3 readmit_cd = f8
	  3 accommodation_cd = f8
	  3 accommodation_request_cd = f8
	  3 alt_result_dest_cd = f8
	  3 ambulatory_cond_cd = f8
	  3 courtesy_cd = f8
	  3 diet_type_cd = f8
	  3 isolation_cd = f8
	  3 med_service_cd = f8
	  3 result_dest_cd = f8
	  3 confid_level_cd = f8
	  3 vip_cd = f8
	  3 name_last_key = vc
	  3 name_first_key = vc
	  3 name_full_formatted = vc
	  3 name_last = vc
	  3 name_first = vc
	  3 name_phonetic = vc
	  3 sex_cd = f8
	  3 birth_dt_cd = f8
	  3 birth_dt_tm = dq8
	  3 species_cd = f8
	  3 location_cd = f8
	  3 loc_facility_cd = f8
	  3 loc_building_cd = f8
	  3 loc_nurse_unit_cd = f8
	  3 loc_room_cd = f8
	  3 loc_bed_cd = f8
	  3 disch_dt_tm = dq8
	  3 guarantor_type_cd = f8
	  3 loc_temp_cd = f8
	  3 organization_id = f8
	  3 reason_for_visit = vc
	  3 encntr_financial_id = f8
	  3 name_first_synonym_id = f8
	  3 financial_class_cd = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 bbd_procedure_cd = f8
	  3 info_given_by = vc
	  3 safekeeping_cd = f8
	  3 trauma_cd = f8
	  3 trauma_dt_tm = dq8
	  3 triage_cd = f8
	  3 triage_dt_tm = dq8
	  3 visitor_status_cd = f8
	  3 valuables_cd = f8
	  3 valuables_list_ind = i2
	  3 valuables [*]
		4 value_cd = f8
	  3 security_access_cd = f8
	  3 refer_facility_cd = f8
	  3 accomp_by_cd = f8
	  3 accommodation_reason_cd = f8
	  3 service_category_cd = f8
	  3 est_length_of_stay = i4
	  3 contract_status_cd = f8
	  3 assign_to_loc_dt_tm = dq8
	  3 alt_lvl_care_cd = f8
	  3 program_service_cd = f8
	  3 specialty_unit_cd = f8
	  3 mental_health_cd = f8
	  3 mental_health_dt_tm = dq8
	  3 region_cd = f8
	  3 sitter_required_cd = f8
	  3 doc_rcvd_dt_tm = dq8
	  3 referral_rcvd_dt_tm = dq8
	  3 alt_lvl_care_dt_tm = dq8
	  3 alc_reason_cd = f8
	  3 alc_decomp_dt_tm = dq8
	  3 place_auth_prsnl_id = f8
	  3 inpatient_admit_dt_tm = dq8
	  3 birth_tz = i4
	  3 birth_tz_disp = vc
	  3 birth_prec_flag = i2
	  3 raw_birth_dt_tm = dq8
	  3 patient_classification_cd = f8
	  3 mental_category_cd = f8
	  3 psychiatric_status_cd = f8
	  3 disch_prsnl_id = f8
	  3 location_capacity
		4 begin_dt_tm = dq8
		4 end_dt_tm = dq8
		4 booking_id = f8
		4 booking_beg_dt_tm = dq8
		4 booking_end_dt_tm = dq8
		4 pend_booking_id = f8
		4 pend_booking_beg_dt_tm = dq8
		4 pend_booking_end_dt_tm = dq8
	  3 result_acc_dt_tm = dq8
	  3 reltn_encntrs [*]
		4 encntr_id = f8
	  3 episode
		4 episode_id = f8
		4 episode_breach_dt_tm = dq8
		4 episode_status_cd = f8
		4 episode_start_dt_tm = dq8
		4 episode_stop_dt_tm = dq8
		4 episode_pause_days_cnt = i4
		4 days_till_breach_cnt = i4
		4 episode_encntr_id = f8
		4 episode_type_cd = f8
		4 episode_display = vc
		4 cancel_encntr_episode_id = f8
		4 refer_facility_cd = f8
		4 service_category_cd = f8
		4 attenddoc
		  5 prsnl_person_id = f8
	  3 pregnancy_status_cd = f8
	  3 expected_delivery_dt_tm = dq8
	  3 last_menstrual_period_dt_tm = dq8
	  3 onset_dt_tm = dq8
	  3 level_of_service_cd = f8
	  3 encntr_code_value_r_ind = i2
	  3 encntr_code_value_r [*]
		4 code_set = i4
		4 code_value = f8
		4 encntr_code_value_r_id = f8
		4 encntr_id = f8
	  3 encntr_care_mgmt
		4 encntr_care_mgmt_id = f8
		4 utlztn_mgmt_status_cd = f8
		4 clinical_review_due_dt_tm = dq8
		4 disch_plan_status_cd = f8
		4 disch_plan_due_dt_tm = dq8
	  3 suspensions_ind = i2
	  3 suspensions
		4 suspensions_list [*]
		  5 action_flag = i2
		  5 pm_wait_list_id = f8
		  5 pm_wait_list_status_id = f8
		  5 status_dt_tm = dq8
		  5 status_end_dt_tm = dq8
		  5 reason_for_change_cd = f8
		  5 status_cd = f8
		  5 comments_text = vc
		  5 updt_dt_tm = dq8
		  5 comment_long_text_id = f8
		  5 updt_id = f8
		  5 username = vc
		  5 status_review_dt_tm = dq8
	  3 filter_by_field = f8
	  3 abn_status_cd = f8
	  3 place_of_svc_org_id = f8
	  3 place_of_svc_org_name = vc
	  3 place_of_svc_type_cd = f8
	  3 place_of_svc_admit_dt_tm = dq8
	  3 patient_events [*]
		4 patient_event_id = f8
		4 event_type_cd = f8
		4 event_dt_tm = dq8
		4 action = vc
	  3 est_financial_resp_amt = f8
	  3 treatment_phase_cd = f8
	  3 incident_cd = f8
	  3 client_organization_id = f8
	  3 client_organization_name = vc
	2 encntr_alias [*]
	  3 encntr_alias_id = f8
	  3 encntr_id = f8
	  3 alias_pool_cd = f8
	  3 encntr_alias_type_cd = f8
	  3 alias = vc
	  3 encntr_alias_sub_type_cd = f8
	  3 check_digit = i4
	  3 check_digit_method_cd = f8
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 alias_pool_ext_cd = f8
	  3 sys_assign_flag = i2
	2 encntr_info [*]
	  3 encntr_info_id = f8
	  3 encntr_id = f8
	  3 info_type_cd = f8
	  3 info_sub_type_cd = f8
	  3 long_text_id = f8
	  3 long_text = vc
	  3 value_numeric = i4
	  3 value_dt_tm = dq8
	  3 chartable_ind = i2
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 contributor_system_cd = f8
	  3 value_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 value_numeric_ind = i2
	2 encntr_prsnl_reltn [*]
	  3 encntr_prsnl_reltn_id = f8
	  3 prsnl_person_id = f8
	  3 encntr_prsnl_r_cd = f8
	  3 encntr_id = f8
	  3 free_text_cd = f8
	  3 ft_prsnl_name = vc
	  3 updt_cnt = i4
	  3 updt_dt_tm = dq8
	  3 updt_id = f8
	  3 updt_task = i4
	  3 updt_applctx = i4
	  3 active_ind = i2
	  3 active_status_cd = f8
	  3 active_status_dt_tm = dq8
	  3 active_status_prsnl_id = f8
	  3 beg_effective_dt_tm = dq8
	  3 end_effective_dt_tm = dq8
	  3 data_status_cd = f8
	  3 data_status_dt_tm = dq8
	  3 data_status_prsnl_id = f8
	  3 contributor_system_cd = f8
	  3 priority_seq = i4
	  3 internal_seq = i4
	  3 expiration_ind = i2
	  3 notification_cd = f8
	  3 demog_reltn_id = f8
  1 person_image
	2 exists_ind = i2
	2 long_blob = gvc
  1  status_data
	2  status  = c1
	2  subeventstatus[1]
		3  operationname = c15
		3  operationstatus = c1
		3  targetobjectname = c15
		3  targetobjectvalue = vc
  1  execution_start_dt_tm = dq8
  1  execution_stop_dt_tm = dq8
) with persistscript
 
free record pm_obj_rep
record pm_obj_rep (
  1 person_id = f8
  1 encntr_id = f8
  1 pm_hist_tracking_id = f8
  1 status_data
    2 status = vc
    2 subeventstatus[1]
      3 OperationName = c15
      3 OperationStatus = vc
      3 TargetObjectName = c15
      3 TargetObjectValue = vc
  1 process_internal_flag = i2
  1 e9y_server_call_failed_ind = i2
  1 modify_person_373_failed_ind = i2
) with persistscript
 
/*************************************************************************
;  Name: GetPersonData(action = i4, person_id = f8, encntr_id = f8)	= null - 114606 - PM.GetPersonInfo
;  Description: Get Person Data
 
	Possible Action options
		100 = Add Person
		101 = Modify Person
		102 = View Person
		103 = Summarize Person
		104 = Remove Person
		105 = Get Person
		200 = Add Encounter
		201 = Modify Encounter
		202 = View Encounter
		203 = Cancel Encounter
		204 = Add Newborn
**************************************************************************/
subroutine GetPersonData(action, person_id, encntr_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPersonData Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114604
 
	;Setup request
	set 114604_req->action = action
	set 114604_req->person_id = person_id
	set 114604_req->encntr_id = encntr_id
	set 114604_req->all_person_aliases = 1
	set 114604_req->hp_expire_ind = 1
	set 114604_req->access_sensitive_data_bits = 63
 
	;Execute Request
	;set stat = tdbexecute(iApplication,iTask,iRequest,"REC",114604_req,"REC",pm_obj_req)
 	execute pm_get_patient_data with replace("REQUEST","114604_REQ"), replace("REPLY","PM_OBJ_REQ")
 
	if(iDebugFlag > 0)
		call echo(concat("GetPersonData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: UpdatePersonData(null)	= null
;  Description: Executes request 114609
**************************************************************************/
subroutine UpdatePersonData(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdatePersonData Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Variables
	declare docVar = vc
	declare commentVar = vc
	declare aliasVar = vc
	declare orgVar = vc
 
	declare c_userdefnum_info_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFNUM"))
	declare c_userdefstring_info_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFSTRNG"))
	declare c_userdefined_info_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
	declare c_userdefdate_info_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFDATE"))
	declare c_fin_nbr_encntr_alias_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
	declare c_visitid_encntr_alias_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",319,"VISITID"))
	declare c_reqnbr_encntr_alias_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",319,"REQ NBR"))
	declare c_comment_info_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",355,"COMMENT"))
 	declare c_mailto_contact_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",23056,"MAILTO"))
 	declare c_home_phone_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",43,"HOME"))
 	declare c_freetext_person_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",302,"FREETEXT"))
 
 	free record temp_userdef
	record temp_userdef(
	 	1 list_cnt = i4
	 	1 list[*]
	 		2 name = vc
	 		2 type = vc
	 		2 value_text =  vc
	 		2 value_cd = f8
	 		2 value_numeric = f8
	 		2 value_dt_tm = dq8
	)
 
	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare hrequest = i4
	declare hreply = i4
	declare hperson = i4
	declare htemplate = i4
	declare hfield = i4
	declare crmstatus = i2
 
 	declare error_msg = vc
	set error_msg = "None"
 
	; Get PM  Record Template
	set iApplication = 3200000
	set iTask = 3200032
	set iRequest = 114606
	execute crmrtl
	execute srvrtl
 
	call echo("Beginning the Application")
	set crmstatus = uar_crmbeginapp(iApplication ,happ)
	if(crmstatus = 0)
		set crmstatus = uar_crmbegintask(happ,iTask,htask)
		if(crmstatus != 0)
			set error_msg = concat("BEGINTASK=" ,cnvtstring(crmstatus))
			call uar_crmendapp(happ)
		endif
	else
		set error_msg = concat("BEGINAPP=" ,cnvtstring(crmstatus))
	endif
 
	if(htask > 0)
		call echo("Beginning the Step")
		set crmstatus = uar_crmbeginreq(htask ,"",iRequest,hstep)
		if(crmstatus != 0)
			set error_msg = concat("BEGINREQ=",cnvtstring(crmstatus))
			call uar_crmendapp(happ)
		else
			set hrequest = uar_crmgetrequest(hstep)
			set issuccess = uar_srvsetlong(hrequest,"type_flag",114999)
			set crmstatus = uar_crmperform(hstep)
			if(crmstatus = 0)
				set htemplate = uar_crmgetreply(hstep)
				if((htemplate = 0))
					set error_msg = "ERR: 114999 Template = null"
				endif
			else
				set error_msg = concat("ERR: 114999 Perform ",cnvtstring(crmstatus))
			endif
		endif
	endif
 
	if(error_msg != "None")
		set pm_obj_rep->status_data.status = "F"
		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = error_msg
		return
	endif
 
	; Update Patient Data
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114609
	execute crmrtl
	execute srvrtl
 
	set crmstatus = uar_crmbeginapp(iApplication ,happ)
	if(crmstatus = 0)
		set crmstatus = uar_crmbegintask(happ ,iTask ,htask)
		if(crmstatus != 0)
			set error_msg = concat("BEGINTASK=",cnvtstring(crmstatus))
			call uar_crmendapp(happ)
		endif
	else
		set error_msg = concat("BEGINAPP=" ,cnvtstring(crmstatus))
	endif
 
	if(error_msg != "None")
		set pm_obj_rep->status_data.status = "F"
		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = error_msg
		return
	endif
 
	if((htask > 0))
		call echo("Beginning the Step")
		set crmstatus = uar_crmbeginreq(htask ,"",iRequest ,hstep)
		if(crmstatus != 0)
			set error_msg = concat("BEGINREQ=",cnvtstring(crmstatus))
			call uar_crmendapp(happ)
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = error_msg
			return
		endif
 
		; Create request
		set hrequest = uar_crmgetrequest(hstep)
		set hsrvtype = uar_srvcreatetypefrom(htemplate,"")
		set issuccess = uar_srvrecreateinstance (hrequest,hsrvtype)
 
		; Transaction Info
		call echo("Transaction Info")
		set stat = uar_srvsetshort(hrequest ,"transaction_type",pm_obj_req->transaction_type)
		set htransactioninfo = uar_srvgetstruct (hrequest ,"transaction_info")
		set stat = uar_srvsetdouble(htransactioninfo,"prsnl_id",pm_obj_req->transaction_info.prsnl_id)
		set stat = uar_srvsetdate(htransactioninfo ,"trans_dt_tm",cnvtdatetime(pm_obj_req->transaction_info.trans_dt_tm))
		set stat = uar_srvsetlong(htransactioninfo ,"type_flag",114999)
		set stat = uar_srvsetlong(htransactioninfo,"access_sensitive_data_bits",63)
 		set stat = uar_srvsetshort(htransactioninfo,"encntr_reltn_updt_ind",pm_obj_req->transaction_info.encntr_reltn_updt_ind)
 
		;Person
		call echo("Person")
		set htemplateperson = uar_srvgetstruct(htemplate,"person")
		set hperson = uar_srvgetstruct(hrequest,"person")
 		set stat = uar_srvsetshort(hperson,"new_person_ind",pm_obj_req->person.person.new_person_ind)
 		set stat = uar_srvsetdouble(hperson,"pre_person_id",pm_obj_req->person.person.pre_person_id)
		set stat = uar_srvsetdouble(hperson,"person_id",pm_obj_req->person.person.person_id)
		set stat = uar_srvsetdate(hperson,"create_dt_tm",cnvtdatetime(pm_obj_req->person.person.create_dt_tm))
		set stat = uar_srvsetdouble(hperson,"create_prsnl_id",pm_obj_req->person.person.create_prsnl_id)
		set stat = uar_srvsetdouble(hperson,"person_type_cd",pm_obj_req->person.person.person_type_cd)
		set stat = uar_srvsetstring(hperson,"name_last_key",nullterm(pm_obj_req->person.person.name_last_key))
		set stat = uar_srvsetstring(hperson,"name_first_key",nullterm(pm_obj_req->person.person.name_first_key))
		set stat = uar_srvsetstring(hperson,"name_full_formatted",nullterm(pm_obj_req->person.person.name_full_formatted))
		set stat = uar_srvsetdouble(hperson,"autopsy_cd",pm_obj_req->person.person.autopsy_cd)
		set stat = uar_srvsetdouble(hperson,"birth_dt_cd",pm_obj_req->person.person.birth_dt_cd)
		set stat = uar_srvsetdate(hperson,"birth_dt_tm",cnvtdatetime(pm_obj_req->person.person.birth_dt_tm))
		set stat = uar_srvsetdate(hperson,"conception_dt_tm",cnvtdatetime(pm_obj_req->person.person.conception_dt_tm))
		set stat = uar_srvsetstring(hperson,"cause_of_death",nullterm(pm_obj_req->person.person.cause_of_death))
		set stat = uar_srvsetdouble(hperson,"cause_of_death_cd",pm_obj_req->person.person.cause_of_death_cd)
		set stat = uar_srvsetdouble(hperson,"deceased_cd",pm_obj_req->person.person.deceased_cd)
		set stat = uar_srvsetdate(hperson,"deceased_dt_tm",cnvtdatetime(pm_obj_req->person.person.deceased_dt_tm))
		set stat = uar_srvsetdouble(hperson,"deceased_source_cd",pm_obj_req->person.person.deceased_source_cd)
		set stat = uar_srvsetdouble(hperson,"ethnic_grp_cd",pm_obj_req->person.person.ethnic_grp_cd)
		set stat = uar_srvsetdouble(hperson,"language_cd",pm_obj_req->person.person.language_cd)
		set stat = uar_srvsetdouble(hperson,"marital_type_cd",pm_obj_req->person.person.marital_type_cd)
		set stat = uar_srvsetdouble(hperson,"purge_option_cd",pm_obj_req->person.person.purge_option_cd)
		set stat = uar_srvsetdouble(hperson,"race_cd",pm_obj_req->person.person.race_cd)
		set stat = uar_srvsetdouble(hperson,"religion_cd",pm_obj_req->person.person.religion_cd)
		set stat = uar_srvsetdouble(hperson,"sex_cd",pm_obj_req->person.person.sex_cd)
		set stat = uar_srvsetshort(hperson,"sex_age_change_ind",pm_obj_req->person.person.sex_age_change_ind)
		set stat = uar_srvsetdouble(hperson,"language_dialect_cd",pm_obj_req->person.person.language_dialect_cd)
		set stat = uar_srvsetstring(hperson,"name_last",nullterm(pm_obj_req->person.person.name_last))
		set stat = uar_srvsetstring(hperson,"name_first",nullterm(pm_obj_req->person.person.name_first))
		set stat = uar_srvsetstring(hperson,"name_phonetic",nullterm(pm_obj_req->person.person.name_phonetic))
		set stat = uar_srvsetdate(hperson,"last_encntr_dt_tm",cnvtdatetime(pm_obj_req->person.person.last_encntr_dt_tm))
		set stat = uar_srvsetdouble(hperson,"species_cd",pm_obj_req->person.person.species_cd)
		set stat = uar_srvsetdouble(hperson,"confid_level_cd",pm_obj_req->person.person.confid_level_cd)
		set stat = uar_srvsetdouble(hperson,"vip_cd",pm_obj_req->person.person.vip_cd)
		set stat = uar_srvsetdouble(hperson,"name_first_synonym_id",pm_obj_req->person.person.name_first_synonym_id)
		set stat = uar_srvsetdouble(hperson,"citizenship_cd",pm_obj_req->person.person.citizenship_cd)
		set stat = uar_srvsetstring(hperson,"mother_maiden_name",nullterm(pm_obj_req->person.person.mother_maiden_name))
		set stat = uar_srvsetdouble(hperson,"nationality_cd",pm_obj_req->person.person.nationality_cd)
		set stat = uar_srvsetstring(hperson,"ft_entity_name",nullterm(pm_obj_req->person.person.ft_entity_name))
		set stat = uar_srvsetdouble(hperson,"ft_entity_id",pm_obj_req->person.person.ft_entity_id)
		set stat = uar_srvsetstring(hperson,"name_middle_key",nullterm(pm_obj_req->person.person.name_middle_key))
		set stat = uar_srvsetstring(hperson,"name_middle",nullterm(pm_obj_req->person.person.name_middle))
		set stat = uar_srvsetdouble(hperson,"data_status_cd",pm_obj_req->person.person.data_status_cd)
		set stat = uar_srvsetdouble(hperson,"military_rank_cd",pm_obj_req->person.person.military_rank_cd)
		set stat = uar_srvsetdouble(hperson,"military_service_cd",pm_obj_req->person.person.military_service_cd)
		set stat = uar_srvsetdouble(hperson,"vet_military_status_cd",pm_obj_req->person.person.vet_military_status_cd)
		set stat = uar_srvsetstring(hperson,"military_base_location",nullterm(pm_obj_req->person.person.military_base_location))
		set stat = uar_srvsetlong(hperson,"birth_tz",pm_obj_req->person.person.birth_tz)
		set stat = uar_srvsetstring(hperson,"birth_tz_disp",nullterm(pm_obj_req->person.person.birth_tz_disp))
		set stat = uar_srvsetshort(hperson,"birth_prec_flag",pm_obj_req->person.person.birth_prec_flag)
		set stat = uar_srvsetdate(hperson,"raw_birth_dt_tm",cnvtdatetimeutc(pm_obj_req->person.person.raw_birth_dt_tm))
 
		;Patient
		call echo("Person Patient")
		set hpatient = uar_srvgetstruct(hperson ,"patient")
 		set stat = uar_srvsetdouble(hpatient,"person_id",pm_obj_req->person.person_patient.person_id)
		set stat = uar_srvsetdouble(hpatient,"adopted_cd",pm_obj_req->person.person_patient.adopted_cd)
		set stat = uar_srvsetdouble(hpatient,"bad_debt_cd",pm_obj_req->person.person_patient.bad_debt_cd)
		set stat = uar_srvsetdouble(hpatient,"baptised_cd",pm_obj_req->person.person_patient.baptised_cd)
		set stat = uar_srvsetdouble(hpatient,"birth_multiple_cd",pm_obj_req->person.person_patient.birth_multiple_cd)
		set stat = uar_srvsetlong(hpatient,"birth_order",pm_obj_req->person.person_patient.birth_order)
		set stat = uar_srvsetdouble(hpatient,"birth_length",pm_obj_req->person.person_patient.birth_length)
		set stat = uar_srvsetdouble(hpatient,"birth_length_units_cd",pm_obj_req->person.person_patient.birth_length_units_cd)
		set stat = uar_srvsetstring(hpatient,"birth_name",nullterm(pm_obj_req->person.person_patient.birth_name))
		set stat = uar_srvsetdouble(hpatient,"birth_weight",pm_obj_req->person.person_patient.birth_weight)
		set stat = uar_srvsetdouble(hpatient,"birth_weight_units_cd",pm_obj_req->person.person_patient.birth_weight_units_cd)
		set stat = uar_srvsetdouble(hpatient,"church_cd",pm_obj_req->person.person_patient.church_cd)
		set stat = uar_srvsetlong(hpatient,"credit_hrs_taking",pm_obj_req->person.person_patient.credit_hrs_taking)
		set stat = uar_srvsetlong(hpatient,"cumm_leave_days",pm_obj_req->person.person_patient.cumm_leave_days)
		set stat = uar_srvsetdouble(hpatient,"current_balance",pm_obj_req->person.person_patient.current_balance)
		set stat = uar_srvsetlong(hpatient,"current_grade",pm_obj_req->person.person_patient.current_grade)
		set stat = uar_srvsetdouble(hpatient,"custody_cd",pm_obj_req->person.person_patient.custody_cd)
		set stat = uar_srvsetdouble(hpatient,"degree_complete_cd",pm_obj_req->person.person_patient.degree_complete_cd)
		set stat = uar_srvsetdouble(hpatient,"diet_type_cd",pm_obj_req->person.person_patient.diet_type_cd)
		set stat = uar_srvsetdouble(hpatient,"family_income",pm_obj_req->person.person_patient.family_income)
		set stat = uar_srvsetlong(hpatient,"family_size",pm_obj_req->person.person_patient.family_size)
		set stat = uar_srvsetdouble(hpatient,"highest_grade_complete_cd",pm_obj_req->person.person_patient.highest_grade_complete_cd)
		set stat = uar_srvsetdouble(hpatient,"immun_on_file_cd",pm_obj_req->person.person_patient.immun_on_file_cd)
		set stat = uar_srvsetdouble(hpatient,"interp_required_cd",pm_obj_req->person.person_patient.interp_required_cd)
		set stat = uar_srvsetdouble(hpatient,"interp_type_cd",pm_obj_req->person.person_patient.interp_type_cd)
		set stat = uar_srvsetdouble(hpatient,"microfilm_cd",pm_obj_req->person.person_patient.microfilm_cd)
		set stat = uar_srvsetlong(hpatient,"nbr_of_brothers",pm_obj_req->person.person_patient.nbr_of_brothers)
		set stat = uar_srvsetlong(hpatient,"nbr_of_sisters",pm_obj_req->person.person_patient.nbr_of_sisters)
		set stat = uar_srvsetdouble(hpatient,"organ_donor_cd",pm_obj_req->person.person_patient.organ_donor_cd)
		set stat = uar_srvsetdouble(hpatient,"parent_marital_status_cd",pm_obj_req->person.person_patient.parent_marital_status_cd)
		set stat = uar_srvsetdouble(hpatient,"smokes_cd",pm_obj_req->person.person_patient.smokes_cd)
		set stat = uar_srvsetdouble(hpatient,"tumor_registry_cd",pm_obj_req->person.person_patient.tumor_registry_cd)
		set stat = uar_srvsetdate(hpatient,"last_bill_dt_tm",cnvtdatetime(pm_obj_req->person.person_patient.last_bill_dt_tm))
		set stat = uar_srvsetdate(hpatient,"last_bind_dt_tm",cnvtdatetime(pm_obj_req->person.person_patient.last_bind_dt_tm))
		set stat = uar_srvsetdate(hpatient,"last_discharge_dt_tm",cnvtdatetime(pm_obj_req->person.person_patient.last_discharge_dt_tm))
		set stat = uar_srvsetdate(hpatient,"last_event_updt_dt_tm",
			cnvtdatetime(pm_obj_req->person.person_patient.last_event_updt_dt_tm))
		set stat = uar_srvsetdate(hpatient,"last_payment_dt_tm",cnvtdatetime(pm_obj_req->person.person_patient.last_payment_dt_tm))
		set stat = uar_srvsetdate(hpatient,"last_atd_activity_dt_tm",
			cnvtdatetime(pm_obj_req->person.person_patient.last_atd_activity_dt_tm))
		set stat = uar_srvsetdouble(hpatient,"student_cd",pm_obj_req->person.person_patient.student_cd)
		set stat = uar_srvsetdouble(hpatient,"living_dependency_cd",pm_obj_req->person.person_patient.living_dependency_cd)
		set stat = uar_srvsetdouble(hpatient,"living_arrangement_cd",pm_obj_req->person.person_patient.living_arrangement_cd)
		set stat = uar_srvsetdouble(hpatient,"living_will_cd",pm_obj_req->person.person_patient.living_will_cd)
		set stat = uar_srvsetlong(hpatient,"nbr_of_pregnancies",pm_obj_req->person.person_patient.nbr_of_pregnancies)
		set stat = uar_srvsetdate(hpatient,"last_trauma_dt_tm",cnvtdatetime(pm_obj_req->person.person_patient.last_trauma_dt_tm))
		set stat = uar_srvsetstring(hpatient,"mother_identifier",nullterm(pm_obj_req->person.person_patient.mother_identifier))
		set stat = uar_srvsetdouble(hpatient,"mother_identifier_cd",pm_obj_req->person.person_patient.mother_identifier_cd)
		set stat = uar_srvsetdouble(hpatient,"data_status_cd",pm_obj_req->person.person_patient.data_status_cd)
		set stat = uar_srvsetdouble(hpatient,"disease_alert_cd",pm_obj_req->person.person_patient.disease_alert_cd)
		set stat = uar_srvsetshort(hpatient,"disease_alert_list_ind",pm_obj_req->person.person_patient.disease_alert_list_ind)
		set stat = uar_srvsetdouble(hpatient,"process_alert_cd",pm_obj_req->person.person_patient.process_alert_cd)
		set stat = uar_srvsetshort(hpatient,"process_alert_list_ind",pm_obj_req->person.person_patient.process_alert_list_ind)
		set stat = uar_srvsetdouble(hpatient,"contact_list_cd",pm_obj_req->person.person_patient.contact_list_cd)
		set stat = uar_srvsetdouble(hpatient,"birth_order_cd",pm_obj_req->person.person_patient.birth_order_cd)
		set stat = uar_srvsetdouble(hpatient,"contact_method_cd",pm_obj_req->person.person_patient.contact_method_cd)
		set stat = uar_srvsetstring(hpatient,"contact_time",nullterm(pm_obj_req->person.person_patient.contact_time))
		set stat = uar_srvsetdouble(hpatient,"callback_consent_cd",pm_obj_req->person.person_patient.callback_consent_cd)
		set stat = uar_srvsetdouble(hpatient,"written_format_cd",pm_obj_req->person.person_patient.written_format_cd)
		set stat = uar_srvsetshort(hpatient,"prev_contact",pm_obj_req->person.person_patient.prev_contact_ind)
		set stat = uar_srvsetstring(hpatient,"source_version_number",nullterm(pm_obj_req->person.person_patient.source_version_number))
		set stat = uar_srvsetdouble(hpatient,"source_sync_level_flag",pm_obj_req->person.person_patient.source_sync_level_flag)
		set stat = uar_srvsetdouble(hpatient,"iqh_participant_cd",pm_obj_req->person.person_patient.iqh_participant_cd)
		set stat = uar_srvsetlong(hpatient,"family_nbr_of_minors_cnt",pm_obj_req->person.person_patient.family_nbr_of_minors_cnt)
		set stat = uar_srvsetdouble(hpatient,"fin_statement_expire_dt_tm",pm_obj_req->person.person_patient.fin_statement_expire_dt_tm)
		set stat = uar_srvsetdouble(hpatient,"fin_statement_verified_dt_tm",
			pm_obj_req->person.person_patient.fin_statement_verified_dt_tm)
		set stat = uar_srvsetshort(hpatient,"fam_income_source_list_ind",pm_obj_req->person.person_patient.fam_income_source_list_ind)
		set stat = uar_srvsetdouble(hpatient,"health_info_access_offered_cd",
			pm_obj_req->person.person_patient.health_info_access_offered_cd)
		set stat = uar_srvsetdouble(hpatient,"birth_sex_cd",pm_obj_req->person.person_patient.birth_sex_cd)
		set stat = uar_srvsetdouble(hpatient,"health_app_access_offered_cd",
			pm_obj_req->person.person_patient.health_app_access_offered_cd)
		set stat = uar_srvsetdouble(hpatient,"financial_risk_level_cd",pm_obj_req->person.person_patient.financial_risk_level_cd)
		set stat = uar_srvsetdate(hpatient,"source_last_sync_dt_tm",
			cnvtdatetime(pm_obj_req->person.person_patient.source_last_sync_dt_tm))
 
		set daSize = size(pm_obj_req->person.person_patient.disease_alert,5)
		if(daSize > 0)
			for(i = 1 to daSize)
				set hdisalert = uar_srvadditem(hpatient,"disease_alert")
				set stat = uar_srvsetdouble(hdisalert,"value_cd",pm_obj_req->person.person_patient.disease_alert[i].value_cd)
			endfor
		endif
 
		set paSize = size(pm_obj_req->person.person_patient.process_alert,5)
		if(paSize > 0)
			for(i = 1 to paSize)
				set hprocalert = uar_srvadditem(hpatient,"process_alert")
				set stat = uar_srvsetdouble(hprocalert,"value_cd",pm_obj_req->person.person_patient.process_alert[i].value_cd)
			endfor
		endif
 
		set fiSize = size(pm_obj_req->person.person_patient.fam_income_source,5)
		if(fiSize > 0)
			for(i = 1 to fiSize)
				set hfamincsrc = uar_srvadditem(hpatient,"fam_income_source")
				set stat = uar_srvsetdouble(hfamincsrc,"value_cd",pm_obj_req->person.person_patient.fam_income_source[i].value_cd)
			endfor
		endif
 
		;Addresses
		call echo("Person Address")
		set addrSize = size(pm_obj_req->person.address,5)
		if(addrSize > 0)
			for(i = 1 to addrSize)
				set haddress = uar_srvadditem(hperson,"addresses")
				if(haddress)
					set stat = uar_srvsetshort(haddress,"change_flag",pm_obj_req->person.address[i].change_flag)
					set stat = uar_srvsetdouble(haddress,"address_id",pm_obj_req->person.address[i].address_id)
					set stat = uar_srvsetstring(haddress,"parent_entity_name",nullterm(pm_obj_req->person.address[i].parent_entity_name))
					set stat = uar_srvsetdouble(haddress,"parent_entity_id",pm_obj_req->person.address[i].parent_entity_id)
					set stat = uar_srvsetdouble(haddress,"address_type_cd",pm_obj_req->person.address[i].address_type_cd)
					set stat = uar_srvsetdouble(haddress,"address_format_cd",pm_obj_req->person.address[i].address_format_cd)
					set stat = uar_srvsetstring(haddress,"contact_name",nullterm(pm_obj_req->person.address[i].contact_name))
					set stat = uar_srvsetdouble(haddress,"residence_type_cd",pm_obj_req->person.address[i].residence_type_cd)
					set stat = uar_srvsetstring(haddress,"comment_txt",nullterm(pm_obj_req->person.address[i].comment_txt))
					set stat = uar_srvsetstring(haddress,"street_addr",nullterm(pm_obj_req->person.address[i].street_addr))
					set stat = uar_srvsetstring(haddress,"street_addr2",nullterm(pm_obj_req->person.address[i].street_addr2))
					set stat = uar_srvsetstring(haddress,"street_addr3",nullterm(pm_obj_req->person.address[i].street_addr3))
					set stat = uar_srvsetstring(haddress,"street_addr4",nullterm(pm_obj_req->person.address[i].street_addr4))
					set stat = uar_srvsetstring(haddress,"city",nullterm(pm_obj_req->person.address[i].city))
					set stat = uar_srvsetdouble(haddress,"city_cd",pm_obj_req->person.address[i].city_cd)
					set stat = uar_srvsetstring(haddress,"state",nullterm(pm_obj_req->person.address[i].state))
					set stat = uar_srvsetdouble(haddress,"state_cd",pm_obj_req->person.address[i].state_cd)
					set stat = uar_srvsetstring(haddress,"zipcode",nullterm(pm_obj_req->person.address[i].zipcode))
					set stat = uar_srvsetdouble(haddress,"zip_code_group_cd",pm_obj_req->person.address[i].zip_code_group_cd)
					set stat = uar_srvsetstring(haddress,"postal_barcode_info",nullterm(pm_obj_req->person.address[i].postal_barcode_info))
					set stat = uar_srvsetstring(haddress,"county",nullterm(pm_obj_req->person.address[i].county))
					set stat = uar_srvsetdouble(haddress,"county_cd",pm_obj_req->person.address[i].county_cd)
					set stat = uar_srvsetstring(haddress,"country",nullterm(pm_obj_req->person.address[i].country))
					set stat = uar_srvsetdouble(haddress,"country_cd",pm_obj_req->person.address[i].country_cd)
					set stat = uar_srvsetdouble(haddress,"residence_cd",pm_obj_req->person.address[i].residence_cd)
					set stat = uar_srvsetstring(haddress,"mail_stop",nullterm(pm_obj_req->person.address[i].mail_stop))
					set stat = uar_srvsetlong(haddress,"address_type_seq",pm_obj_req->person.address[i].address_type_seq)
					set stat = uar_srvsetstring(haddress,"beg_effective_mm_dd",cnvtstring(pm_obj_req->person.address[i].beg_effective_mm_dd))
					set stat = uar_srvsetstring(haddress,"end_effective_mm_dd",cnvtstring(pm_obj_req->person.address[i].end_effective_mm_dd))
					set stat = uar_srvsetstring(haddress,"operation_hours",nullterm(pm_obj_req->person.address[i].operation_hours))
					set stat = uar_srvsetdouble(haddress,"address_info_status_cd",pm_obj_req->person.address[i].address_info_status_cd)
					set stat = uar_srvsetdate(haddress,"beg_effective_dt_tm",cnvtdatetime(pm_obj_req->person.address[i].beg_effective_dt_tm))
					set stat = uar_srvsetdate(haddress,"end_effective_dt_tm",cnvtdatetime(pm_obj_req->person.address[i].end_effective_dt_tm))
					set stat = uar_srvsetdouble(haddress,"data_status_cd",pm_obj_req->person.address[i].data_status_cd)
					set stat = uar_srvsetdouble(haddress,"primary_care_cd",pm_obj_req->person.address[i].primary_care_cd)
					set stat = uar_srvsetdouble(haddress,"district_health_cd",pm_obj_req->person.address[i].district_health_cd)
					set stat = uar_srvsetstring(haddress,"addr_key",nullterm(pm_obj_req->person.address[i].addr_key))
					set stat = uar_srvsetstring(haddress,"source_identifier",nullterm(pm_obj_req->person.address[i].source_identifier))
					set stat = uar_srvsetdate(haddress,"validation_expire_dt_tm",
						cnvtdatetime(pm_obj_req->person.address[i].validation_expire_dt_tm))
					set stat = uar_srvsetshort(haddress,"validation_warning_override_ind",
						pm_obj_req->person.address[i].validation_warning_override_ind)
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = "Could not create haddress."
					return
				endif
			endfor
		endif
 
		;Phones
		call echo("Person Phones")
		set phSize = size(pm_obj_req->person.phone,5)
		if(phSize > 0)
			for(i = 1 to phSize)
				set hphone = uar_srvadditem(hperson,"phones")
				if(hphone)
					set stat = uar_srvsetshort(hphone,"change_flag",pm_obj_req->person.phone[i].change_flag)
					set stat = uar_srvsetdouble(hphone,"phone_id",pm_obj_req->person.phone[i].phone_id)
					set stat = uar_srvsetstring(hphone,"parent_entity_name",nullterm(pm_obj_req->person.phone[i].parent_entity_name))
					set stat = uar_srvsetdouble(hphone,"parent_entity_id",pm_obj_req->person.phone[i].parent_entity_id)
					set stat = uar_srvsetdouble(hphone,"phone_type_cd",pm_obj_req->person.phone[i].phone_type_cd)
					set stat = uar_srvsetdouble(hphone,"phone_format_cd",pm_obj_req->person.phone[i].phone_format_cd)
					set stat = uar_srvsetstring(hphone,"phone_num",nullterm(pm_obj_req->person.phone[i].phone_num))
					set stat = uar_srvsetlong(hphone,"phone_type_seq",pm_obj_req->person.phone[i].phone_type_seq)
					set stat = uar_srvsetstring(hphone,"description",nullterm(pm_obj_req->person.phone[i].description))
					set stat = uar_srvsetstring(hphone,"contact",nullterm(pm_obj_req->person.phone[i].contact))
					set stat = uar_srvsetstring(hphone,"call_instruction",nullterm(pm_obj_req->person.phone[i].call_instruction))
					set stat = uar_srvsetdouble(hphone,"modem_capability_cd",pm_obj_req->person.phone[i].modem_capability_cd)
					set stat = uar_srvsetstring(hphone,"extension",nullterm(pm_obj_req->person.phone[i].extension))
					set stat = uar_srvsetstring(hphone,"paging_code",nullterm(pm_obj_req->person.phone[i].paging_code))
					set stat = uar_srvsetstring(hphone,"beg_effective_mm_dd",cnvtstring(pm_obj_req->person.phone[i].beg_effective_mm_dd))
					set stat = uar_srvsetstring(hphone,"end_effective_mm_dd",cnvtstring(pm_obj_req->person.phone[i].end_effective_mm_dd))
					set stat = uar_srvsetstring(hphone,"operation_hours",nullterm(pm_obj_req->person.phone[i].operation_hours))
					set stat = uar_srvsetdouble(hphone,"data_status_cd",pm_obj_req->person.phone[i].data_status_cd)
					set stat = uar_srvsetdate(hphone,"beg_effective_dt_tm",cnvtdatetime(pm_obj_req->person.phone[i].beg_effective_dt_tm))
					set stat = uar_srvsetdate(hphone,"end_effective_dt_tm",cnvtdatetime(pm_obj_req->person.phone[i].end_effective_dt_tm))
					set stat = uar_srvsetdouble(hphone,"contact_method_cd",pm_obj_req->person.phone[i].contact_method_cd)
					if(pm_obj_req->person.phone[i].contact_method_cd = c_mailto_contact_method_cd)
						set stat = uar_srvsetstring(hphone,"email",nullterm(pm_obj_req->person.phone[i].phone_num))
					endif
					set stat = uar_srvsetstring(hphone,"source_identifier",nullterm(pm_obj_req->person.phone[i].source_identifier))
					set stat = uar_srvsetdouble(hphone,"texting_permission_cd",pm_obj_req->person.phone[i].texting_permission_cd)
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = "Could not create hphone."
					return
				endif
			endfor
		endif
 
		;Person Aliases - mrn_list
		call echo("Person Aliases")
		set paSize = size(pm_obj_req->person.person_alias,5)
		if(paSize > 0)
			for(i = 1 to paSize)
				set hpersonalias = uar_srvadditem(hperson,"mrn_list")
				if(hpersonalias)
					set stat = uar_srvsetdouble(hpersonalias,"person_alias_id",pm_obj_req->person.person_alias[i].person_alias_id)
					set stat = uar_srvsetdouble(hpersonalias,"person_id",pm_obj_req->person.person_alias[i].person_id)
					set stat = uar_srvsetdouble(hpersonalias,"alias_pool_cd",pm_obj_req->person.person_alias[i].alias_pool_cd)
					set stat = uar_srvsetdouble(hpersonalias,"person_alias_type_cd",pm_obj_req->person.person_alias[i].person_alias_type_cd)
					set stat = uar_srvsetstring(hpersonalias,"alias",nullterm(pm_obj_req->person.person_alias[i].alias))
					set stat = uar_srvsetdouble(hpersonalias,"person_alias_sub_type_cd",
						pm_obj_req->person.person_alias[i].person_alias_sub_type_cd)
					set stat = uar_srvsetlong(hpersonalias,"check_digit",pm_obj_req->person.person_alias[i].check_digit)
					set stat = uar_srvsetdouble(hpersonalias,"check_digit_method_cd",pm_obj_req->person.person_alias[i].check_digit_method_cd)
					set stat = uar_srvsetlong(hpersonalias,"visit_seq_nbr",pm_obj_req->person.person_alias[i].visit_seq_nbr)
					set stat = uar_srvsetstring(hpersonalias,"health_card_province",
						nullterm(pm_obj_req->person.person_alias[i].health_card_province))
					set stat = uar_srvsetstring(hpersonalias,"health_card_ver_code",
						nullterm(pm_obj_req->person.person_alias[i].health_card_ver_code))
					set stat = uar_srvsetdouble(hpersonalias,"data_status_cd",pm_obj_req->person.person_alias[i].data_status_cd)
					set stat = uar_srvsetstring(hpersonalias,"health_card_type",nullterm(pm_obj_req->person.person_alias[i].health_card_type))
					set stat = uar_srvsetdate(hpersonalias,"health_card_issue_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_alias[i].health_card_issue_dt_tm))
					set stat = uar_srvsetdate(hpersonalias,"health_card_expiry_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_alias[i].health_card_expiry_dt_tm))
					set stat = uar_srvsetdouble(hpersonalias,"person_alias_status_cd",pm_obj_req->person.person_alias[i].person_alias_status_cd)
					set stat = uar_srvsetdouble(hpersonalias,"response_cd",pm_obj_req->person.person_alias[i].response_cd)
					set stat = uar_srvsetdate(hpersonalias,"alias_expiry_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_alias[i].alias_expiry_dt_tm))
					set stat = uar_srvsetdouble(hpersonalias,"person_alias_record_status_cd",
						pm_obj_req->person.person_alias[i].person_alias_record_status_cd)
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = "Could not create hpersonalias."
					return
				endif
			endfor
		endif
 
		;Person Names
		call echo("Person Names")
		set pnSize = size(pm_obj_req->person.person_name,5)
		if(pnSize > 0)
			for(i = 1 to pnSize)
				set hpersonname = uar_srvadditem(hperson,"person_names")
				if(hpersonname)
					;set 114609_req->person.person_names[i].action_type
					;set 114609_req->person.person_names[i].new_person
					;set 114609_req->person.person_names[i].pm_hist_tracking_id
					;set 114609_req->person.person_names[i].transaction_dt_tm
					;set 114609_req->person.person_names[i].active_ind_ind
					set stat = uar_srvsetshort(hpersonname,"change_flag",pm_obj_req->person.person_name[i].change_flag)
					set stat = uar_srvsetdouble(hpersonname,"person_name_id",pm_obj_req->person.person_name[i].person_name_id)
					set stat = uar_srvsetdouble(hpersonname,"person_id",pm_obj_req->person.person_name[i].person_id)
					set stat = uar_srvsetdouble(hpersonname,"name_type_cd",pm_obj_req->person.person_name[i].name_type_cd)
					set stat = uar_srvsetshort(hpersonname,"active_ind",pm_obj_req->person.person_name[i].active_ind)
					set stat = uar_srvsetdouble(hpersonname,"active_status_cd",pm_obj_req->person.person_name[i].active_status_cd)
					set stat = uar_srvsetdate(hpersonname,"active_status_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_name[i].active_status_dt_tm))
					set stat = uar_srvsetdouble(hpersonname,"active_status_prsnl_id",pm_obj_req->person.person_name[i].active_status_prsnl_id)
					set stat = uar_srvsetdate(hpersonname,"beg_effective_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_name[i].beg_effective_dt_tm))
					set stat = uar_srvsetdate(hpersonname,"end_effective_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_name[i].end_effective_dt_tm))
					set stat = uar_srvsetstring(hpersonname,"name_original",nullterm(pm_obj_req->person.person_name[i].name_original))
					set stat = uar_srvsetdouble(hpersonname,"name_format_cd",pm_obj_req->person.person_name[i].name_format_cd)
					set stat = uar_srvsetstring(hpersonname,"name_full",nullterm(pm_obj_req->person.person_name[i].name_full))
					set stat = uar_srvsetstring(hpersonname,"name_first",nullterm(pm_obj_req->person.person_name[i].name_first))
					set stat = uar_srvsetstring(hpersonname,"name_middle",nullterm(pm_obj_req->person.person_name[i].name_middle))
					set stat = uar_srvsetstring(hpersonname,"name_last",nullterm(pm_obj_req->person.person_name[i].name_last))
					set stat = uar_srvsetstring(hpersonname,"name_degree",nullterm(pm_obj_req->person.person_name[i].name_degree))
					set stat = uar_srvsetstring(hpersonname,"name_title",nullterm(pm_obj_req->person.person_name[i].name_title))
					set stat = uar_srvsetstring(hpersonname,"name_prefix",nullterm(pm_obj_req->person.person_name[i].name_prefix))
					set stat = uar_srvsetstring(hpersonname,"name_suffix",nullterm(pm_obj_req->person.person_name[i].name_suffix))
					set stat = uar_srvsetstring(hpersonname,"name_initials",nullterm(pm_obj_req->person.person_name[i].name_initials))
					set stat = uar_srvsetdouble(hpersonname,"data_status_cd",pm_obj_req->person.person_name[i].data_status_cd)
					set stat = uar_srvsetdate(hpersonname,"data_status_dt_tm",cnvtdatetime(pm_obj_req->person.person_name[i].data_status_dt_tm))
					set stat = uar_srvsetdouble(hpersonname,"data_status_prsnl_id",pm_obj_req->person.person_name[i].data_status_prsnl_id)
					set stat = uar_srvsetdouble(hpersonname,"contributor_system_cd",pm_obj_req->person.person_name[i].contributor_system_cd)
					set stat = uar_srvsetlong(hpersonname,"updt_cnt",pm_obj_req->person.person_name[i].updt_cnt)
					set stat = uar_srvsetstring(hpersonname,"source_identifier",pm_obj_req->person.person_name[i].source_identifier)
					set stat = uar_srvsetlong(hpersonname,"name_type_seq",pm_obj_req->person.person_name[i].name_type_seq)
					set stat = uar_srvsetdate(hpersonname,"updt_dt_tm",cnvtdatetime(pm_obj_req->person.person_name[i].updt_dt_tm))
					set stat = uar_srvsetdouble(hpersonname,"updt_id",pm_obj_req->person.person_name[i].updt_id)
					set stat = uar_srvsetlong(hpersonname,"updt_task",pm_obj_req->person.person_name[i].updt_task)
					set stat = uar_srvsetlong(hpersonname,"updt_applctx",pm_obj_req->person.person_name[i].updt_applctx)
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = "Could not create hpersonname."
					return
				endif
			endfor
		endif
 
		;Person Prsnl Reltns
		call echo("Person Prsnl Reltns")
		set ppSize = size(pm_obj_req->person.person_prsnl_reltn,5)
		if(ppSize > 0)
			set docCnt = 0
			for(i = 1 to ppSize)
				case(uar_get_code_cki(pm_obj_req->person.person_prsnl_reltn[i].person_prsnl_r_cd))
					;Birth Physician
					of "CKI.CODEVALUE!4588": set docVar = "birth_physician"
					;Death Physician
					of "CKI.CODEVALUE!4589": set docVar = "death_physician"
					;Family Physician
					of "CKI.CODEVALUE!4590": set docVar = "family_physician"
					;OB/Gyn
					of "CKI.CODEVALUE!4591": set docVar = "obgyn"
					;Pediatrician
					of "CKI.CODEVALUE!4592": set docVar = "pediatrician"
					;Primary Care Physician
					of "CKI.CODEVALUE!4593": set docVar = "pcp"
					;Sponsor
					of "CKI.CODEVALUE!2814776": set docVar = "sponsor"
					;OtherDocs
					else
						set docCnt = docCnt + 1
						if(docCnt < 10)
							set docVar = build("doc_0",docCnt)
						else
							set docVar = build("doc_",docCnt)
						endif
				endcase
				set hpersonprsnl = uar_srvgetstruct(hperson ,nullterm(docVar))
				if(hpersonprsnl)
					set stat = uar_srvsetdouble(hpersonprsnl,"person_prsnl_reltn_id",
						pm_obj_req->person.person_prsnl_reltn[i].person_prsnl_reltn_id)
					set stat = uar_srvsetdouble(hpersonprsnl,"person_id",pm_obj_req->person.person_prsnl_reltn[i].person_id)
					set stat = uar_srvsetdouble(hpersonprsnl,"person_prsnl_r_cd",pm_obj_req->person.person_prsnl_reltn[i].person_prsnl_r_cd)
					set stat = uar_srvsetdouble(hpersonprsnl,"prsnl_person_id",pm_obj_req->person.person_prsnl_reltn[i].prsnl_person_id)
					set stat = uar_srvsetdouble(hpersonprsnl,"free_text_cd",pm_obj_req->person.person_prsnl_reltn[i].free_text_cd)
					set stat = uar_srvsetstring(hpersonprsnl,"ft_prsnl_name",
						nullterm(pm_obj_req->person.person_prsnl_reltn[i].ft_prsnl_name))
					set stat = uar_srvsetlong(hpersonprsnl,"priority_seq",pm_obj_req->person.person_prsnl_reltn[i].priority_seq)
					set stat = uar_srvsetlong(hpersonprsnl,"internal_seq",pm_obj_req->person.person_prsnl_reltn[i].internal_seq)
					set stat = uar_srvsetdouble(hpersonprsnl,"notification_cd",pm_obj_req->person.person_prsnl_reltn[i].notification_cd)
					set stat = uar_srvsetdouble(hpersonprsnl,"data_status_cd",pm_obj_req->person.person_prsnl_reltn[i].data_status_cd)
					set stat = uar_srvsetdouble(hpersonprsnl,"demog_reltn_id",pm_obj_req->person.person_prsnl_reltn[i].demog_reltn_id)
					set stat = uar_srvsetdate(hpersonprsnl,"beg_effective_dt_tm",
						cnvtdatetime(pm_obj_req->person.person_prsnl_reltn[i].beg_effective_dt_tm))
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpersonprsnl: ",docVar)
					return
				endif
			endfor
		endif
 
		;Person Comments(person_info)
		call echo("Person Comments")
		set piSize = size(pm_obj_req->person.person_info,5)
		if(piSize > 0)
			for(i = 1 to piSize)
				if(pm_obj_req->person.person_info[i].info_type_cd = c_comment_info_type_cd)
					if(pm_obj_req->person.person_info[i].internal_seq < 10)
						set commentVar = build("comment_0",cnvtstring(pm_obj_req->person.person_info[i].internal_seq))
					else
						set commentVar = build("comment_",cnvtstring(pm_obj_req->person.person_info[i].internal_seq))
					endif
 
					set hpersoncomment = uar_srvgetstruct(hperson ,nullterm(commentVar))
					if(hpersoncomment)
						set stat = uar_srvsetdouble(hpersoncomment,"person_info_id",pm_obj_req->person.person_info[i].person_info_id)
						set stat = uar_srvsetdouble(hpersoncomment,"person_id",pm_obj_req->person.person_info[i].person_id)
						set stat = uar_srvsetdouble(hpersoncomment,"info_type_cd",pm_obj_req->person.person_info[i].info_type_cd)
						set stat = uar_srvsetdouble(hpersoncomment,"info_sub_type_cd",pm_obj_req->person.person_info[i].info_sub_type_cd)
						set stat = uar_srvsetdouble(hpersoncomment,"long_text_id",pm_obj_req->person.person_info[i].long_text_id)
						set stat = uar_srvsetstring(hpersoncomment,"long_text",nullterm(pm_obj_req->person.person_info[i].long_text))
						set stat = uar_srvsetlong(hpersoncomment,"value_numeric",pm_obj_req->person.person_info[i].value_numeric)
						set stat = uar_srvsetdate(hpersoncomment,"value_dt_tm",cnvtdatetime(pm_obj_req->person.person_info[i].value_dt_tm))
						set stat = uar_srvsetshort(hpersoncomment,"chartable_ind",pm_obj_req->person.person_info[i].chartable_ind)
						set stat = uar_srvsetlong(hpersoncomment,"priority_seq",pm_obj_req->person.person_info[i].priority_seq)
						set stat = uar_srvsetlong(hpersoncomment,"internal_seq",pm_obj_req->person.person_info[i].internal_seq)
						set stat = uar_srvsetdouble(hpersoncomment,"value_cd",pm_obj_req->person.person_info[i].value_cd)
						;set stat = uar_srvsetdouble(hpersoncomment,"data_status_cd", -- Not used)
					else
						set pm_obj_rep->status_data.status = "F"
						set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpersoncomment: ",commentVar)
						return
					endif
				endif
			endfor
		endif
 
		;Person Org Reltns
		call echo("Person Org Reltns")
		set porSize = size(pm_obj_req->person.person_org_reltn,5)
		if(porSize > 0)
			set empCnt = 0
			declare temp = vc
			declare loopVar = vc
			for(i = 1 to porSize)
				case(uar_get_code_cki(pm_obj_req->person.person_org_reltn[i].person_org_reltn_cd))
					;Employer
					of "CKI.CODEVALUE!9459":
						set empCnt = empCnt + 1
						set orgVar = build("employer_0",cnvtstring(empCnt))
						set temp = "employer"
					;School
					of "CKI.CODEVALUE!9516":
						set orgVar = "school"
						set temp = orgVar
					;Sponsoring Advocate
					of "CKI.CODEVALUE!2819059":
						set orgVar = "sponsoring_advocate"
						set temp = orgVar
					else
						set orgVar = ""
						set temp = ""
				endcase
 
				if(orgVar > " ")
					set hperorgreltn = uar_srvgetstruct(hperson ,nullterm(orgVar))
					if(hperorgreltn)
						set stat = uar_srvsetdouble(hperorgreltn,"person_org_reltn_id",pm_obj_req->person.person_org_reltn[i].person_org_reltn_id)
						set stat = uar_srvsetdouble(hperorgreltn,"person_id",pm_obj_req->person.person_org_reltn[i].person_id)
						set stat = uar_srvsetdouble(hperorgreltn,"person_org_reltn_cd",pm_obj_req->person.person_org_reltn[i].person_org_reltn_cd)
						set stat = uar_srvsetdouble(hperorgreltn,"organization_id",pm_obj_req->person.person_org_reltn[i].organization_id)
						set stat = uar_srvsetstring(hperorgreltn,"person_org_nbr",
							nullterm(pm_obj_req->person.person_org_reltn[i].person_org_nbr))
						set stat = uar_srvsetstring(hperorgreltn,"person_org_alias",
							nullterm(pm_obj_req->person.person_org_reltn[i].person_org_alias))
						set stat = uar_srvsetshort(hperorgreltn,"free_text_ind",pm_obj_req->person.person_org_reltn[i].free_text_ind)
						set stat = uar_srvsetstring(hperorgreltn,"ft_org_name",
							nullterm(pm_obj_req->person.person_org_reltn[i].ft_org_name))
						set stat = uar_srvsetlong(hperorgreltn,"priority_seq",pm_obj_req->person.person_org_reltn[i].priority_seq)
						set stat = uar_srvsetlong(hperorgreltn,"internal_seq",pm_obj_req->person.person_org_reltn[i].internal_seq)
						set stat = uar_srvsetdouble(hperorgreltn,"data_status_cd",pm_obj_req->person.person_org_reltn[i].data_status_cd)
 
						if(temp in("employer","school"))
							set stat = uar_srvsetdate(hperorgreltn,"empl_hire_dt_tm",
								cnvtdatetime(pm_obj_req->person.person_org_reltn[i].empl_hire_dt_tm))
							set stat = uar_srvsetdate(hperorgreltn,"empl_term_dt_tm",
								cnvtdatetime(pm_obj_req->person.person_org_reltn[i].empl_term_dt_tm))
							set stat = uar_srvsetdate(hperorgreltn,"empl_retire_dt_tm",
								cnvtdatetime(pm_obj_req->person.person_org_reltn[i].empl_retire_dt_tm))
							set stat = uar_srvsetdouble(hperorgreltn,"empl_type_cd",pm_obj_req->person.person_org_reltn[i].empl_type_cd)
							set stat = uar_srvsetdouble(hperorgreltn,"empl_status_cd",pm_obj_req->person.person_org_reltn[i].empl_status_cd)
							set stat = uar_srvsetstring(hperorgreltn,"empl_occupation_text",
								nullterm(pm_obj_req->person.person_org_reltn[i].empl_occupation_text))
							set stat = uar_srvsetdouble(hperorgreltn,"empl_occupation_cd",pm_obj_req->person.person_org_reltn[i].empl_occupation_cd)
							set stat = uar_srvsetstring(hperorgreltn,"empl_title",
								nullterm(pm_obj_req->person.person_org_reltn[i].empl_title))
							set stat = uar_srvsetstring(hperorgreltn,"empl_position",
								nullterm(pm_obj_req->person.person_org_reltn[i].empl_position))
							set stat = uar_srvsetstring(hperorgreltn,"empl_contact",
								nullterm(pm_obj_req->person.person_org_reltn[i].empl_contact))
							set stat = uar_srvsetstring(hperorgreltn,"empl_contact_title",
								nullterm(pm_obj_req->person.person_org_reltn[i].empl_contact_title))
 
							if(temp = "employer")
								set stat = uar_srvsetdouble(hperorgreltn,"empl_title_cd",pm_obj_req->person.person_org_reltn[i].empl_title_cd)
							endif
						endif
 
						set loopCnt = 1
						if(temp = "employer")
							set loopCnt = 2
						endif
 
						;Addresses
						call echo("Person Org Reltn Addresses")
						for(x = 1 to loopCnt)
							if(x = 1)
								set loopVar = "address"
							else
								set loopVar = "email_address"
							endif
							set hporgaddr = uar_srvgetstruct(hperorgreltn,nullterm(loopVar))
							if(hporgaddr)
								;set stat = uar_srvsetdouble(hporgaddr,"change_flag",--Not used)
								set stat = uar_srvsetdouble(hporgaddr,"address_id",pm_obj_req->person.person_org_reltn[i].address.address_id)
								set stat = uar_srvsetstring(hporgaddr,"parent_entity_name",
									nullterm(pm_obj_req->person.person_org_reltn[i].address.parent_entity_name))
								set stat = uar_srvsetdouble(hporgaddr,"parent_entity_id",pm_obj_req->person.person_org_reltn[i].address.parent_entity_id)
								set stat = uar_srvsetdouble(hporgaddr,"address_type_cd",pm_obj_req->person.person_org_reltn[i].address.address_type_cd)
								set stat = uar_srvsetdouble(hporgaddr,"address_format_cd",pm_obj_req->person.person_org_reltn[i].address.address_format_cd)
								set stat = uar_srvsetstring(hporgaddr,"contact_name",nullterm(pm_obj_req->person.person_org_reltn[i].address.contact_name))
								set stat = uar_srvsetdouble(hporgaddr,"residence_type_cd",pm_obj_req->person.person_org_reltn[i].address.residence_type_cd)
								set stat = uar_srvsetstring(hporgaddr,"comment_txt",nullterm(pm_obj_req->person.person_org_reltn[i].address.comment_txt))
								set stat = uar_srvsetstring(hporgaddr,"street_addr",nullterm(pm_obj_req->person.person_org_reltn[i].address.street_addr))
								set stat = uar_srvsetstring(hporgaddr,"street_addr2",nullterm(pm_obj_req->person.person_org_reltn[i].address.street_addr2))
								set stat = uar_srvsetstring(hporgaddr,"street_addr3",nullterm(pm_obj_req->person.person_org_reltn[i].address.street_addr3))
								set stat = uar_srvsetstring(hporgaddr,"street_addr4",nullterm(pm_obj_req->person.person_org_reltn[i].address.street_addr4))
								set stat = uar_srvsetstring(hporgaddr,"city",nullterm(pm_obj_req->person.person_org_reltn[i].address.city))
								set stat = uar_srvsetdouble(hporgaddr,"city_cd",pm_obj_req->person.person_org_reltn[i].address.city_cd)
								set stat = uar_srvsetstring(hporgaddr,"state",nullterm(pm_obj_req->person.person_org_reltn[i].address.state))
								set stat = uar_srvsetdouble(hporgaddr,"state_cd",pm_obj_req->person.person_org_reltn[i].address.state_cd)
								set stat = uar_srvsetstring(hporgaddr,"zipcode",nullterm(pm_obj_req->person.person_org_reltn[i].address.zipcode))
								set stat = uar_srvsetdouble(hporgaddr,"zip_code_group_cd",pm_obj_req->person.person_org_reltn[i].address.zip_code_group_cd)
								set stat = uar_srvsetstring(hporgaddr,"postal_barcode_info",
									nullterm(pm_obj_req->person.person_org_reltn[i].address.postal_barcode_info))
								set stat = uar_srvsetstring(hporgaddr,"county",nullterm(pm_obj_req->person.person_org_reltn[i].address.county))
								set stat = uar_srvsetdouble(hporgaddr,"county_cd",pm_obj_req->person.person_org_reltn[i].address.county_cd)
								set stat = uar_srvsetstring(hporgaddr,"country",nullterm(pm_obj_req->person.person_org_reltn[i].address.country))
								set stat = uar_srvsetdouble(hporgaddr,"country_cd",pm_obj_req->person.person_org_reltn[i].address.country_cd)
								set stat = uar_srvsetdouble(hporgaddr,"residence_cd",pm_obj_req->person.person_org_reltn[i].address.residence_cd)
								set stat = uar_srvsetstring(hporgaddr,"mail_stop",nullterm(pm_obj_req->person.person_org_reltn[i].address.mail_stop))
								set stat = uar_srvsetlong(hporgaddr,"address_type_seq",pm_obj_req->person.person_org_reltn[i].address.address_type_seq)
								set stat = uar_srvsetstring(hporgaddr,"beg_effective_mm_dd",
									cnvtstring(pm_obj_req->person.person_org_reltn[i].address.beg_effective_mm_dd))
								set stat = uar_srvsetstring(hporgaddr,"end_effective_mm_dd",
									cnvtstring(pm_obj_req->person.person_org_reltn[i].address.end_effective_mm_dd))
								set stat = uar_srvsetstring(hporgaddr,"operation_hours",
									nullterm(pm_obj_req->person.person_org_reltn[i].address.operation_hours))
								set stat = uar_srvsetdouble(hporgaddr,"address_info_status_cd",
									pm_obj_req->person.person_org_reltn[i].address.address_info_status_cd)
								set stat = uar_srvsetdate(hporgaddr,"beg_effective_dt_tm",
									cnvtdatetime(pm_obj_req->person.person_org_reltn[i].address.beg_effective_dt_tm))
								set stat = uar_srvsetdate(hporgaddr,"end_effective_dt_tm",
									cnvtdatetime(pm_obj_req->person.person_org_reltn[i].address.end_effective_dt_tm))
								set stat = uar_srvsetdouble(hporgaddr,"data_status_cd",pm_obj_req->person.person_org_reltn[i].address.data_status_cd)
								set stat = uar_srvsetdouble(hporgaddr,"primary_care_cd",pm_obj_req->person.person_org_reltn[i].address.primary_care_cd)
								set stat = uar_srvsetdouble(hporgaddr,"district_health_cd",
									pm_obj_req->person.person_org_reltn[i].address.district_health_cd)
								set stat = uar_srvsetstring(hporgaddr,"addr_key",
									nullterm(pm_obj_req->person.person_org_reltn[i].address.addr_key))
								set stat = uar_srvsetstring(hporgaddr,"source_identifier",
									nullterm(pm_obj_req->person.person_org_reltn[i].address.source_identifier))
								set stat = uar_srvsetdate(hporgaddr,"validation_expire_dt_tm",
									cnvtdatetime(pm_obj_req->person.person_org_reltn[i].address.validation_expire_dt_tm))
								set stat = uar_srvsetshort(hporgaddr,"validation_warning_override_ind",
									pm_obj_req->person.person_org_reltn[i].address.validation_warning_override_ind)
							else
								set pm_obj_rep->status_data.status = "F"
								set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hporgaddr: ",loopVar)
								return
							endif
						endfor
 
						;Phones
						call echo("Person Org Reltns Phones")
						for(x = 1 to loopCnt)
							if(x = 1)
								set loopVar = "phone"
							else
								set loopVar = "fax"
							endif
							set hporgphone = uar_srvgetstruct(hperorgreltn,nullterm(loopVar))
							if(hporgphone)
								;set stat = uar_srvsetshort(hporgphone,"change_flag",**ADD TO REQUEST)
								set stat = uar_srvsetdouble(hporgphone,"phone_id",pm_obj_req->person.person_org_reltn[i].phone.phone_id)
								set stat = uar_srvsetstring(hporgphone,"parent_entity_name",
									nullterm(pm_obj_req->person.person_org_reltn[i].phone.parent_entity_name))
								set stat = uar_srvsetdouble(hporgphone,"parent_entity_id",pm_obj_req->person.person_org_reltn[i].phone.parent_entity_id)
								set stat = uar_srvsetdouble(hporgphone,"phone_type_cd",pm_obj_req->person.person_org_reltn[i].phone.phone_type_cd)
								set stat = uar_srvsetdouble(hporgphone,"phone_format_cd",pm_obj_req->person.person_org_reltn[i].phone.phone_format_cd)
								set stat = uar_srvsetstring(hporgphone,"phone_num",nullterm(pm_obj_req->person.person_org_reltn[i].phone.phone_num))
								set stat = uar_srvsetlong(hporgphone,"phone_type_seq",pm_obj_req->person.person_org_reltn[i].phone.phone_type_seq)
								set stat = uar_srvsetstring(hporgphone,"description",nullterm(pm_obj_req->person.person_org_reltn[i].phone.description))
								set stat = uar_srvsetstring(hporgphone,"contact",nullterm(pm_obj_req->person.person_org_reltn[i].phone.contact))
								set stat = uar_srvsetstring(hporgphone,"call_instruction",
									nullterm(pm_obj_req->person.person_org_reltn[i].phone.call_instruction))
								set stat = uar_srvsetdouble(hporgphone,"modem_capability_cd",
									pm_obj_req->person.person_org_reltn[i].phone.modem_capability_cd)
								set stat = uar_srvsetstring(hporgphone,"extension",nullterm(pm_obj_req->person.person_org_reltn[i].phone.extension))
								set stat = uar_srvsetstring(hporgphone,"paging_code",
									nullterm(pm_obj_req->person.person_org_reltn[i].phone.paging_code))
								set stat = uar_srvsetstring(hporgphone,"beg_effective_mm_dd",
									cnvtstring(pm_obj_req->person.person_org_reltn[i].phone.beg_effective_mm_dd))
								set stat = uar_srvsetstring(hporgphone,"end_effective_mm_dd",
									cnvtstring(pm_obj_req->person.person_org_reltn[i].phone.end_effective_mm_dd))
								set stat = uar_srvsetstring(hporgphone,"operation_hours",
									nullterm(pm_obj_req->person.person_org_reltn[i].phone.operation_hours))
								set stat = uar_srvsetdouble(hporgphone,"data_status_cd",pm_obj_req->person.person_org_reltn[i].phone.data_status_cd)
								set stat = uar_srvsetdate(hporgphone,"beg_effective_dt_tm",
									cnvtdatetime(pm_obj_req->person.person_org_reltn[i].phone.beg_effective_dt_tm))
								set stat = uar_srvsetdate(hporgphone,"end_effective_dt_tm",
									cnvtdatetime(pm_obj_req->person.person_org_reltn[i].phone.end_effective_dt_tm))
								set stat = uar_srvsetdouble(hporgphone,"contact_method_cd",pm_obj_req->person.person_org_reltn[i].phone.contact_method_cd)
								set stat = uar_srvsetstring(hporgphone,"email",nullterm(pm_obj_req->person.person_org_reltn[i].phone.email))
								set stat = uar_srvsetstring(hporgphone,"source_identifier",
									nullterm(pm_obj_req->person.person_org_reltn[i].phone.source_identifier))
								set stat = uar_srvsetdouble(hporgphone,"texting_permission_cd",
									pm_obj_req->person.person_org_reltn[i].phone.texting_permission_cd)
							else
								set pm_obj_rep->status_data.status = "F"
								set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hporgphone: ",loopVar)
								return
							endif
						endfor
					else
						set pm_obj_rep->status_data.status = "F"
						set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hperorgreltn: ",orgVar)
						return
					endif
				endif
			endfor
		endif
 
	 	;Person User Defined fields
	 	call echo("Person User Defined Fields")
 		if(size(pm_obj_req->person.person_info,5) > 0)
			select into "nl:"
			from(dummyt d with seq = size(pm_obj_req->person.person_info,5))
				, code_value_extension lvl
				, code_value_extension tpe
				, code_value_extension fld
			plan d where pm_obj_req->person.person_info[d.seq].info_type_cd in(c_userdefnum_info_type_cd,
					c_userdefstring_info_type_cd,c_userdefined_info_type_cd,c_userdefdate_info_type_cd)
			join lvl where lvl.code_value = pm_obj_req->person.person_info[d.seq].info_sub_type_cd
				and lvl.field_name = "LEVEL" and lvl.field_value = "PERSON"
			join tpe where tpe.code_value = lvl.code_value
				and tpe.field_name = "TYPE"
			join fld where fld.code_value = tpe.code_value
				and fld.field_name = "FIELD"
			head report
				x = 0
			detail
				x = x + 1
				stat = alterlist(temp_userdef->list,x)
 
				temp_userdef->list[x].name = fld.field_value
				temp_userdef->list[x].type = tpe.field_value
 
				case(tpe.field_value)
					of "CODE": temp_userdef->list[x].value_cd = pm_obj_req->person.person_info[d.seq].value_cd
					of "STRING": temp_userdef->list[x].value_text = pm_obj_req->person.person_info[d.seq].long_text
					of "NUMERIC": temp_userdef->list[x].value_numeric = pm_obj_req->person.person_info[d.seq].value_numeric
					of "DATE": temp_userdef->list[x].value_dt_tm = pm_obj_req->person.person_info[d.seq].value_dt_tm
				endcase
			foot report
				temp_userdef->list_cnt = x
			with nocounter
 
			if(temp_userdef->list_cnt > 0)
				set hpuserdef = uar_srvgetstruct(hperson,"user_defined")
				if(hpuserdef)
					for(i = 1 to temp_userdef->list_cnt)
						case(temp_userdef->list[i].type)
							of "CODE": set stat = uar_srvsetdouble(hpuserdef,temp_userdef->list[i].name,
								temp_userdef->list[i].value_cd)
							of "STRING": set stat = uar_srvsetstring(hpuserdef,temp_userdef->list[i].name
								,nullterm(temp_userdef->list[i].value_text))
							of "NUMERIC": set stat = uar_srvsetdouble(hpuserdef,temp_userdef->list[i].name,
								temp_userdef->list[i].name,temp_userdef->list[i].value_numeric)
							of "DATE": set stat = uar_srvsetdate(hpuserdef,temp_userdef->list[i].name,
								cnvtdatetime(temp_userdef->list[i].value_dt_tm))
						endcase
					endfor
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpuserdef.")
					return
				endif
			endif
		endif
 
		;Person person reltns
		call echo("Person Person Reltns")
		set prSize = size(pm_obj_req->person.person_person_reltn,5)
		set eprSize = size(pm_obj_req->encounter.encntr_person_reltn,5)
		if(prSize > 0)
			declare structVar = vc
			set subCnt = 0
			set guarCnt = 0
			for(i = 1 to prSize)
				;Prevent unnecessary updates if relationships aren't changing
				if(pm_obj_req->person.person_person_reltn[i].update_reltn_ind > 0)
 
				set subscriberCheck = 0
				set guarCheck = 0
				set idx = 1
 
				;Add encntr_person_reltn_id if it doesn't exist
				if(eprSize > 0 and pm_obj_req->person.person_person_reltn[i].encntr_person_reltn_id = 0)
					set pos = locateval(idx,1,eprSize,
						pm_obj_req->person.person_person_reltn[i].person_reltn_type_cd,
						pm_obj_req->encounter.encntr_person_reltn[idx].person_reltn_type_cd,
						pm_obj_req->person.person_person_reltn[i].related_person_id,
						pm_obj_req->encounter.encntr_person_reltn[idx].related_person_id,
						pm_obj_req->person.person_person_reltn[i].person_reltn_cd,
						pm_obj_req->encounter.encntr_person_reltn[idx].person_reltn_cd)
 
					if(pos > 0)
						set pm_obj_req->person.person_person_reltn[i].encntr_person_reltn_id =
						pm_obj_req->encounter.encntr_person_reltn[pos].encntr_person_reltn_id
 
						set pm_obj_req->person.person_person_reltn[i].encntr_id =
						pm_obj_req->encounter.encntr_person_reltn[pos].encntr_id
					endif
				endif
 
				case(uar_get_code_cki(pm_obj_req->person.person_person_reltn[i].person_reltn_type_cd))
					;Insured(subscriber)
					of "CKI.CODEVALUE!9521":
						set subCnt = subCnt + 1
						if(pm_obj_req->person.person_person_reltn[i].priority_seq > 0)
							set structVar = build("subscriber_0",cnvtstring(pm_obj_req->person.person_person_reltn[i].priority_seq))
						else
							set structVar = build("subscriber_0",cnvtstring(subCnt))
						endif
						set subscriberCheck = 1
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm(structVar))
					; Guarantor/Defualt Guarantor
					of value("CKI.CODEVALUE!9519","CKI.CODEVALUE!9520"):
						set guarCnt = guarCnt + 1
						set structVar = build("guarantor_0",cnvtstring(guarCnt))
						set guarCheck = 0
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm(structVar))
					;Agent
					of "CKI.CODEVALUE!2510010049":
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm("agent"))
					;Guardian
					of "CKI.CODEVALUE!17057":
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm("guardian"))
					;Emergency Contact
					of "CKI.CODEVALUE!6328":
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm("emc"))
					;Next of Kin
					of "CKI.CODEVALUE!9522":
						set hpersonreltn = uar_srvgetstruct(hperson,nullterm("nok"))
					else
						if(pm_obj_req->person.person_person_reltn[i].internal_seq = 0)
							set hpersonreltn = uar_srvgetstruct(hperson,nullterm("mother"))
						else
							set structVar = build("relation_0",cnvtstring(pm_obj_req->person.person_person_reltn[i].internal_seq))
							set hpersonreltn = uar_srvgetstruct(hperson,nullterm(structVar))
						endif
				endcase
 
				if(hpersonreltn)
					set stat = uar_srvsetdouble(hpersonreltn,"person_person_reltn_id",
						pm_obj_req->person.person_person_reltn[i].person_person_reltn_id)
					set stat = uar_srvsetdouble(hpersonreltn,"encntr_person_reltn_id",
						pm_obj_req->person.person_person_reltn[i].encntr_person_reltn_id)
					set stat = uar_srvsetdouble(hpersonreltn,"person_reltn_type_cd",
						pm_obj_req->person.person_person_reltn[i].person_reltn_type_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"person_id",pm_obj_req->person.person_person_reltn[i].person_id)
					set stat = uar_srvsetdouble(hpersonreltn,"encntr_id",pm_obj_req->person.person_person_reltn[i].encntr_id)
					set stat = uar_srvsetdouble(hpersonreltn,"person_reltn_cd",pm_obj_req->person.person_person_reltn[i].person_reltn_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"prior_person_reltn_cd",
						pm_obj_req->person.person_person_reltn[i].prior_person_reltn_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"related_person_reltn_cd",
						pm_obj_req->person.person_person_reltn[i].related_person_reltn_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"prior_related_person_reltn_cd",
						pm_obj_req->person.person_person_reltn[i].prior_related_person_reltn_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"related_person_id",pm_obj_req->person.person_person_reltn[i].related_person_id)
					set stat = uar_srvsetdouble(hpersonreltn,"contact_role_cd",pm_obj_req->person.person_person_reltn[i].contact_role_cd)
					set stat = uar_srvsetshort(hpersonreltn,"genetic_relationship_ind",
						pm_obj_req->person.person_person_reltn[i].genetic_relationship_ind)
					set stat = uar_srvsetshort(hpersonreltn,"living_with_ind",pm_obj_req->person.person_person_reltn[i].living_with_ind)
					set stat = uar_srvsetdouble(hpersonreltn,"visitation_allowed_cd",
						pm_obj_req->person.person_person_reltn[i].visitation_allowed_cd)
					set stat = uar_srvsetlong(hpersonreltn,"priority_seq",pm_obj_req->person.person_person_reltn[i].priority_seq)
					set stat = uar_srvsetdouble(hpersonreltn,"free_text_cd",pm_obj_req->person.person_person_reltn[i].free_text_cd)
					set stat = uar_srvsetstring(hpersonreltn,"ft_rel_person_name",
						nullterm(pm_obj_req->person.person_person_reltn[i].ft_rel_person_name))
					set stat = uar_srvsetlong(hpersonreltn,"internal_seq",pm_obj_req->person.person_person_reltn[i].internal_seq)
					set stat = uar_srvsetshort(hpersonreltn,"encntr_updt_flag",pm_obj_req->person.person_person_reltn[i].encntr_updt_flag)
					set stat = uar_srvsetshort(hpersonreltn,"encntr_only_ind",pm_obj_req->person.person_person_reltn[i].encntr_only_ind)
					set stat = uar_srvsetdouble(hpersonreltn,"data_status_cd",pm_obj_req->person.person_person_reltn[i].data_status_cd)
					set stat = uar_srvsetdouble(hpersonreltn,"family_reltn_sub_type_cd",
						pm_obj_req->person.person_person_reltn[i].family_reltn_sub_type_cd)
					if(pm_obj_req->person.person_person_reltn[i].person.person.person_type_cd = c_freetext_person_type_cd)
						set stat = uar_srvsetshort(hpersonreltn,"free_text_person_ind",1)
					endif
 
					/*;Guarantor Org related fields - Ignored for now
						"guarantor_org_ind"
						"prior_guarantor_orig_ind"
						"research_account_ind"
						"research_account_nbr"
						"research_account_id"
						"encntr_org_reltn_id"
						"encntr_org_reltn_cd"
						"encntr_org_reltn_type_cd"
						"organization_id"
						"guarantor_org" - object
						"verification_attemtped_ind"
					*/
 
					;Person_Reltn_list reltn_type_info - Ignored for now
 
					;RelatedPerson Person
					call echo("RelatedPerson Person")
					set hpprperson = uar_srvgetstruct(hpersonreltn,"person")
					if(hpprperson)
						;set stat = uar_srvsetdouble(hpprperson,"pre_person_id",
							;pm_obj_req->person.person_person_reltn[i].person.person.pre_person_id)
						set stat = uar_srvsetdouble(hpprperson,"person_id",pm_obj_req->person.person_person_reltn[i].person.person.person_id)
						set stat = uar_srvsetdate(hpprperson,"create_dt_tm",
							cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person.create_dt_tm))
						set stat = uar_srvsetdouble(hpprperson,"create_prsnl_id",
							pm_obj_req->person.person_person_reltn[i].person.person.create_prsnl_id)
						set stat = uar_srvsetdouble(hpprperson,"person_type_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.person_type_cd)
						set stat = uar_srvsetstring(hpprperson,"name_last_key",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_last_key))
						set stat = uar_srvsetstring(hpprperson,"name_first_key",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_first_key))
						set stat = uar_srvsetstring(hpprperson,"name_full_formatted",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_full_formatted))
						set stat = uar_srvsetdouble(hpprperson,"autopsy_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.autopsy_cd)
						set stat = uar_srvsetdouble(hpprperson,"birth_dt_cd",pm_obj_req->person.person_person_reltn[i].person.person.birth_dt_cd)
						set stat = uar_srvsetdate(hpprperson,"birth_dt_tm",
							cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person.birth_dt_tm))
						set stat = uar_srvsetdate(hpprperson,"conception_dt_tm",
							cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person.conception_dt_tm))
						set stat = uar_srvsetstring(hpprperson,"cause_of_death",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.cause_of_death))
						set stat = uar_srvsetdouble(hpprperson,"cause_of_death_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.cause_of_death_cd)
						set stat = uar_srvsetdouble(hpprperson,"deceased_cd",pm_obj_req->person.person_person_reltn[i].person.person.deceased_cd)
						set stat = uar_srvsetdate(hpprperson,"deceased_dt_tm",
							cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person.deceased_dt_tm))
						set stat = uar_srvsetdouble(hpprperson,"deceased_source_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.deceased_source_cd)
						set stat = uar_srvsetdouble(hpprperson,"ethnic_grp_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.ethnic_grp_cd)
						set stat = uar_srvsetdouble(hpprperson,"language_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.language_cd)
						set stat = uar_srvsetdouble(hpprperson,"marital_type_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.marital_type_cd)
						set stat = uar_srvsetdouble(hpprperson,"purge_option_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.purge_option_cd)
						set stat = uar_srvsetdouble(hpprperson,"race_cd",pm_obj_req->person.person_person_reltn[i].person.person.race_cd)
						set stat = uar_srvsetdouble(hpprperson,"religion_cd",pm_obj_req->person.person_person_reltn[i].person.person.religion_cd)
						set stat = uar_srvsetdouble(hpprperson,"sex_cd",pm_obj_req->person.person_person_reltn[i].person.person.sex_cd)
						set stat = uar_srvsetshort(hpprperson,"sex_age_change_ind",
							pm_obj_req->person.person_person_reltn[i].person.person.sex_age_change_ind)
						set stat = uar_srvsetdouble(hpprperson,"language_dialect_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.language_dialect_cd)
						set stat = uar_srvsetstring(hpprperson,"name_last",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_last))
						set stat = uar_srvsetstring(hpprperson,"name_first",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_first))
						set stat = uar_srvsetstring(hpprperson,"name_phonetic",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_phonetic))
						set stat = uar_srvsetdate(hpprperson,"last_encntr_dt_tm",
							cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person.last_encntr_dt_tm))
						set stat = uar_srvsetdouble(hpprperson,"species_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.species_cd)
						set stat = uar_srvsetdouble(hpprperson,"confid_level_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.confid_level_cd)
						set stat = uar_srvsetdouble(hpprperson,"vip_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.vip_cd)
						set stat = uar_srvsetdouble(hpprperson,"name_first_synonym_id",
							pm_obj_req->person.person_person_reltn[i].person.person.name_first_synonym_id)
						set stat = uar_srvsetdouble(hpprperson,"citizenship_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.citizenship_cd)
						set stat = uar_srvsetstring(hpprperson,"mother_maiden_name",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.mother_maiden_name))
						set stat = uar_srvsetdouble(hpprperson,"nationality_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.nationality_cd)
						set stat = uar_srvsetstring(hpprperson,"ft_entity_name",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.ft_entity_name))
						set stat = uar_srvsetdouble(hpprperson,"ft_entity_id",
							pm_obj_req->person.person_person_reltn[i].person.person.ft_entity_id)
						set stat = uar_srvsetstring(hpprperson,"name_middle_key",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_middle_key))
						set stat = uar_srvsetstring(hpprperson,"name_middle",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.name_middle))
						set stat = uar_srvsetdouble(hpprperson,"data_status_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.data_status_cd)
						set stat = uar_srvsetdouble(hpprperson,"military_rank_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.military_rank_cd)
						set stat = uar_srvsetdouble(hpprperson,"military_service_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.military_service_cd)
						set stat = uar_srvsetdouble(hpprperson,"vet_military_status_cd",
							pm_obj_req->person.person_person_reltn[i].person.person.vet_military_status_cd)
						set stat = uar_srvsetstring(hpprperson,"military_base_location",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.military_base_location))
						set stat = uar_srvsetlong(hpprperson,"birth_tz",
							pm_obj_req->person.person_person_reltn[i].person.person.birth_tz)
						set stat = uar_srvsetstring(hpprperson,"birth_tz_disp",
							nullterm(pm_obj_req->person.person_person_reltn[i].person.person.birth_tz_disp))
						set stat = uar_srvsetshort(hpprperson,"birth_prec_flag",
							pm_obj_req->person.person_person_reltn[i].person.person.birth_prec_flag)
						set stat = uar_srvsetdate(hpprperson,"raw_birth_dt_tm",
							cnvtdatetimeutc(pm_obj_req->person.person_person_reltn[i].person.person.raw_birth_dt_tm))
 
						if(subscriberCheck)
							;Health Plan
							call echo("Health Plan")
							set subHpSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn,5)
							if(subHpSize > 0)
								for(h = 1 to subHpSize)
									set hsubhealthplan = uar_srvgetstruct(hpprperson,nullterm("health_plan"))
									if(hsubhealthplan)
										set stat = uar_srvsetdouble(hsubhealthplan,"person_plan_reltn_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].person_plan_reltn_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"encntr_plan_reltn_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"health_plan_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].health_plan_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"person_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].person_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"person_plan_r_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].person_plan_r_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"person_org_reltn_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].person_org_reltn_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"sponsor_person_org_reltn_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].sponsor_person_org_reltn_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"subscriber_person_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].subscriber_person_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"organization_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].organization_id)
										set stat = uar_srvsetlong(hsubhealthplan,"priority_seq",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].priority_seq)
										set stat = uar_srvsetstring(hsubhealthplan,"member_nbr",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].member_nbr))
										set stat = uar_srvsetdouble(hsubhealthplan,"signature_on_file_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].signature_on_file_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"balance_type_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].balance_type_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"deduct_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].deduct_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"deduct_met_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].deduct_met_amt)
										set stat = uar_srvsetdate(hsubhealthplan,"deduct_met_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].deduct_met_dt_tm))
										set stat = uar_srvsetdouble(hsubhealthplan,"coverage_type_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coverage_type_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"max_out_pckt_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].max_out_pckt_amt)
										set stat = uar_srvsetdate(hsubhealthplan,"max_out_pckt_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].max_out_pckt_dt_tm))
										set stat = uar_srvsetdouble(hsubhealthplan,"fam_deduct_met_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fam_deduct_met_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"fam_deduct_met_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fam_deduct_met_dt_tm))
										set stat = uar_srvsetdouble(hsubhealthplan,"verify_status_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_status_cd)
										set stat = uar_srvsetdate(hsubhealthplan,"verify_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_dt_tm))
										set stat = uar_srvsetdouble(hsubhealthplan,"verify_prsnl_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_prsnl_id)
										set stat = uar_srvsetstring(hsubhealthplan,"insured_card_name",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].insured_card_name))
										set stat = uar_srvsetstring(hsubhealthplan,"pat_member_nbr",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].pat_member_nbr))
										;set stat = uar_srvsetdouble(hsubhealthplan,"eligible_ind",Not used)
										set stat = uar_srvsetstring(hsubhealthplan,"member_person_code",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].member_person_code))
										set stat = uar_srvsetlong(hsubhealthplan,"life_rsv_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].life_rsv_days)
										set stat = uar_srvsetlong(hsubhealthplan,"life_rsv_remain_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].life_rsv_remain_days)
										set stat = uar_srvsetdouble(hsubhealthplan,"life_rsv_daily_ded_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].life_rsv_daily_ded_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"life_rsv_daily_ded_qual_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].life_rsv_daily_ded_qual_cd)
										set stat = uar_srvsetlong(hsubhealthplan,"card_issue_nbr",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].card_issue_nbr)
										set stat = uar_srvsetdouble(hsubhealthplan,"card_category_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].card_category_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"program_status_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].program_status_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"person_benefit_r_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].person_benefit_r_id)
										set stat = uar_srvsetdouble(hsubhealthplan,"benefit_plan_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_plan_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"service_type_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].service_type_cd)
										set stat = uar_srvsetlong(hsubhealthplan,"coverage_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coverage_days)
										set stat = uar_srvsetlong(hsubhealthplan,"coverage_remain_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coverage_remain_days)
										set stat = uar_srvsetlong(hsubhealthplan,"non_coverage_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].non_coverage_days)
										set stat = uar_srvsetlong(hsubhealthplan,"coinsurance_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coinsurance_days)
										set stat = uar_srvsetlong(hsubhealthplan,"coinsurance_remain_days",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coinsurance_remain_days)
										set stat = uar_srvsetdouble(hsubhealthplan,"coinsurance_pct",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coinsurance_pct)
										set stat = uar_srvsetdouble(hsubhealthplan,"copay_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].copay_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"deduct_pct",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].deduct_pct)
										set stat = uar_srvsetdouble(hsubhealthplan,"deduct_remain_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].deduct_remain_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"room_coverage_amt",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].room_coverage_amt)
										set stat = uar_srvsetdouble(hsubhealthplan,"room_coverage_amt_qual_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].room_coverage_amt_qual_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"room_coverage_type_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].room_coverage_type_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"room_coverage_board_incl_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].room_coverage_board_incl_cd)
										set stat = uar_srvsetdouble(hsubhealthplan,"comment_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].comment_id)
										set stat = uar_srvsetstring(hsubhealthplan,"comment_txt",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].comment_txt))
										set stat = uar_srvsetdouble(hsubhealthplan,"denial_reason_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].denial_reason_cd)
										set stat = uar_srvsetstring(hsubhealthplan,"coverage_comments",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].coverage_comments))
 
										set stat = uar_srvsetstring(hsubhealthplan,"insured_card_name_first",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].insured_card_name_first))
										set stat = uar_srvsetstring(hsubhealthplan,"insured_card_name_last",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].insured_card_name_last))
										set stat = uar_srvsetstring(hsubhealthplan,"insured_card_name_middle",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].insured_card_name_middle))
										set stat = uar_srvsetstring(hsubhealthplan,"insured_card_name_suffix",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].insured_card_name_suffix))
										;set stat = uar_srvsetdouble(hsubhealthplan,"signature_source_cd",
											;pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].)
										;set stat = uar_srvsetdouble(hsubhealthplan,"assignment_cd",
											;pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].)
										set stat = uar_srvsetdouble(hsubhealthplan,"verify_source_cd",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_source_cd)
										;set stat = uar_srvsetdouble(hsubhealthplan,"resubmit_278n_cd",
											;pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].)
 										set stat = uar_srvsetstring(hsubhealthplan,"alt_member_nbr",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].alt_member_nbr))
										set stat = uar_srvsetdouble(hsubhealthplan,"alt_payer_id",
											pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].alt_payer_id)
										set stat = uar_srvsetstring(hsubhealthplan,"ext_payer_name",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].ext_payer_name))
										set stat = uar_srvsetstring(hsubhealthplan,"ext_payer_ident",
											nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].ext_payer_ident))
										set stat = uar_srvsetdate(hsubhealthplan,"beg_effective_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].beg_effective_dt_tm))
										set stat = uar_srvsetdate(hsubhealthplan,"end_effective_dt_tm",
											cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].end_effective_dt_tm))
 
										;Benefit sch
										call echo("Benefit Sch")
										if(size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch,5) > 0)
											set hbensch = uar_srvgetstruct(hsubhealthplan,"benefit_sch")
											set stat = uar_srvsetdouble(hbensch,"person_benefit_sch_r_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].person_benefit_sch_r_id)
											set stat = uar_srvsetdouble(hbensch,"person_benefit_r_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].person_benefit_r_id)
											set stat = uar_srvsetdouble(hbensch,"member_resp_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].member_resp_type_cd)
											set stat = uar_srvsetlong(hbensch,"resp_range_start_nbr",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].resp_range_start_nbr)
											set stat = uar_srvsetdouble(hbensch,"resp_range_end_nbr",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].resp_range_end_nbr)
											set stat = uar_srvsetdouble(hbensch,"resp_type_qual_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].resp_type_qual_cd)
											set stat = uar_srvsetdouble(hbensch,"resp_range_amt",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].resp_range_amt)
											set stat = uar_srvsetdouble(hbensch,"resp_range_qual_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].benefit_sch[1].resp_range_qual_cd)
										endif
 
										;Verify phone
										call echo("Verify phone")
										set hhpverphone = uar_srvgetstruct(hsubhealthplan,"verify_phone")
										if(hhpverphone)
											set stat = uar_srvsetdouble(hhpverphone,"phone_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.phone_id)
											set stat = uar_srvsetstring(hhpverphone,"parent_entity_name",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.parent_entity_name)
											set stat = uar_srvsetdouble(hhpverphone,"parent_entity_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.parent_entity_id)
											set stat = uar_srvsetdouble(hhpverphone,"phone_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.phone_type_cd)
											set stat = uar_srvsetdouble(hhpverphone,"phone_format_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.phone_format_cd)
											set stat = uar_srvsetstring(hhpverphone,"phone_num",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.phone_num))
											set stat = uar_srvsetlong(hhpverphone,"phone_type_seq",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.phone_type_seq)
											set stat = uar_srvsetstring(hhpverphone,"description",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.description))
											set stat = uar_srvsetstring(hhpverphone,"contact",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.contact))
											set stat = uar_srvsetstring(hhpverphone,"call_instruction",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.call_instruction))
											set stat = uar_srvsetdouble(hhpverphone,"modem_capability_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.modem_capability_cd)
											set stat = uar_srvsetstring(hhpverphone,"extension",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.extension))
											set stat = uar_srvsetstring(hhpverphone,"paging_code",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.paging_code))
											set stat = uar_srvsetstring(hhpverphone,"beg_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.beg_effective_mm_dd))
											set stat = uar_srvsetstring(hhpverphone,"end_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.end_effective_mm_dd))
											set stat = uar_srvsetdate(hhpverphone,"beg_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.beg_effective_dt_tm))
											set stat = uar_srvsetdouble(hhpverphone,"end_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.end_effective_dt_tm))
											set stat = uar_srvsetstring(hhpverphone,"email",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.email))
											set stat = uar_srvsetdouble(hhpverphone,"contact_method_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.contact_method_cd)
											set stat = uar_srvsetstring(hhpverphone,"source_identifier",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.source_identifier))
											set stat = uar_srvsetstring(hhpverphone,"operation_hours",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].verify_phone.operation_hours))
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpverphone: ",structVar)
											return
										endif
 
										;Plan info
										call echo("Plan Info")
										set hhpplaninfo = uar_srvgetstruct(hsubhealthplan,"plan_info")
										if(hhpplaninfo)
											set stat = uar_srvsetdouble(hhpplaninfo,"health_plan_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.health_plan_id)
											set stat = uar_srvsetdouble(hhpplaninfo,"plan_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.plan_type_cd)
											set stat = uar_srvsetstring(hhpplaninfo,"plan_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.plan_name))
											set stat = uar_srvsetstring(hhpplaninfo,"plan_desc",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.plan_desc))
											set stat = uar_srvsetdouble(hhpplaninfo,"financial_class_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.financial_class_cd)
											set stat = uar_srvsetdouble(hhpplaninfo,"baby_coverage_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.baby_coverage_cd)
											set stat = uar_srvsetdouble(hhpplaninfo,"comb_baby_bill_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.comb_baby_bill_cd)
											set stat = uar_srvsetdouble(hhpplaninfo,"plan_class_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].plan_info.plan_class_cd)
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpplaninfo: ",structVar)
											return
										endif
 
										;Org plan
										call echo("Org Plan")
										set hhporgplan = uar_srvgetstruct(hsubhealthplan,"org_plan")
										if(hhporgplan)
											set stat = uar_srvsetdouble(hhporgplan,"org_plan_reltn_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.org_plan_reltn_id)
											set stat = uar_srvsetdouble(hhporgplan,"health_plan_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.health_plan_id)
											set stat = uar_srvsetdouble(hhporgplan,"org_plan_reltn_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.org_plan_reltn_cd)
											set stat = uar_srvsetdouble(hhporgplan,"organization_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.organization_id)
											set stat = uar_srvsetstring(hhporgplan,"group_nbr",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.group_nbr))
											set stat = uar_srvsetstring(hhporgplan,"group_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.group_name))
											set stat = uar_srvsetstring(hhporgplan,"policy_nbr",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.policy_nbr))
											set stat = uar_srvsetdouble(hhporgplan,"data_status_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.data_status_cd)
											set stat = uar_srvsetdate(hhporgplan,"data_status_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.data_status_dt_tm))
											set stat = uar_srvsetdouble(hhporgplan,"data_status_prnsl_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_plan.data_status_prnsl_id)
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhporgplan: ",structVar)
											return
										endif
 
										;Org info
										call echo("Org Info")
										set hhporginfo = uar_srvgetstruct(hsubhealthplan,"org_info")
										if(hhporginfo)
											set stat = uar_srvsetdouble(hhporginfo,"organization_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_info.organization_id)
											set stat = uar_srvsetstring(hhporginfo,"org_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].org_info.org_name))
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhporginfo: ",structVar)
											return
										endif
 
										;Visit info
										call echo("Visit Info")
										if(size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn,5) > 0)
											set hhpvisitinfo = uar_srvgetstruct(hsubhealthplan,"visit_info")
											if(hhpvisitinfo)
												set stat = uar_srvsetdouble(hhpvisitinfo,"encntr_plan_reltn_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].encntr_plan_reltn_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"encntr_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].encntr_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"person_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].person_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"person_plan_reltn_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].person_plan_reltn_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"health_plan_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].health_plan_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"organization_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].organization_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"person_org_reltn_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].person_org_reltn_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"sponsor_person_org_reltn_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].sponsor_person_org_reltn_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"subscriber_type_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].subscriber_type_cd)
												set stat = uar_srvsetlong(hhpvisitinfo,"orig_priority_seq",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].orig_priority_seq)
												set stat = uar_srvsetlong(hhpvisitinfo,"priority_seq",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].priority_seq)
												set stat = uar_srvsetstring(hhpvisitinfo,"member_nbr",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].member_nbr))
												set stat = uar_srvsetstring(hhpvisitinfo,"subs_member_nbr",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].subs_member_nbr))
												set stat = uar_srvsetdouble(hhpvisitinfo,"insur_source_info_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].insur_source_info_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"balance_type_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].balance_type_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"deduct_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].deduct_amt)
												set stat = uar_srvsetdouble(hhpvisitinfo,"deduct_met_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].deduct_met_amt)
												set stat = uar_srvsetdate(hhpvisitinfo,"deduct_met_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].deduct_met_dt_tm))
												set stat = uar_srvsetdouble(hhpvisitinfo,"assign_benefits_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].assign_benefits_cd)
												set stat = uar_srvsetdate(hhpvisitinfo,"beg_effective_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].beg_effective_dt_tm))
												set stat = uar_srvsetdate(hhpvisitinfo,"end_effective_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].end_effective_dt_tm))
												set stat = uar_srvsetdouble(hhpvisitinfo,"coord_benefits_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].coord_benefits_cd)
												set stat = uar_srvsetstring(hhpvisitinfo,"health_card_province",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].health_card_province))
												set stat = uar_srvsetstring(hhpvisitinfo,"health_card_ver_code",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].health_card_ver_code))
												set stat = uar_srvsetstring(hhpvisitinfo,"health_card_nbr",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].health_card_nbr))
												set stat = uar_srvsetstring(hhpvisitinfo,"health_card_type",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].health_card_type))
												set stat = uar_srvsetdate(hhpvisitinfo,"health_card_issue_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].health_card_issue_dt_tm))
												set stat = uar_srvsetdate(hhpvisitinfo,"health_card_expiry_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].health_card_expiry_dt_tm))
												set stat = uar_srvsetstring(hhpvisitinfo,"insured_card_name",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].insured_card_name))
												set stat = uar_srvsetdouble(hhpvisitinfo,"military_rank_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].military_rank_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"military_service_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].military_service_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"military_status_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].military_status_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"ins_card_copied_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].ins_card_copied_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"encntr_benefit_r_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].encntr_benefit_r_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"benefit_plan_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].benefit_plan_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"service_type_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].service_type_cd)
												set stat = uar_srvsetlong(hhpvisitinfo,"coverage_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coverage_days)
												set stat = uar_srvsetlong(hhpvisitinfo,"coverage_remain_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coverage_remain_days)
												set stat = uar_srvsetlong(hhpvisitinfo,"non_coverage_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].non_coverage_days)
												set stat = uar_srvsetlong(hhpvisitinfo,"coinsurance_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coinsurance_days)
												set stat = uar_srvsetlong(hhpvisitinfo,"coinsurance_remain_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coinsurance_remain_days)
												set stat = uar_srvsetdouble(hhpvisitinfo,"coinsurance_pct",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coinsurance_pct)
												set stat = uar_srvsetdouble(hhpvisitinfo,"copay_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
													encntr_plan_reltn[1].copay_amt)
												set stat = uar_srvsetdouble(hhpvisitinfo,"deduct_pct",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].deduct_pct)
												set stat = uar_srvsetdouble(hhpvisitinfo,"deduct_remain_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].deduct_remain_amt)
												set stat = uar_srvsetdouble(hhpvisitinfo,"room_coverage_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].room_coverage_amt)
												set stat = uar_srvsetdouble(hhpvisitinfo,"room_coverage_amt_qual_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].room_coverage_amt_qual_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"room_coverage_type_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].room_coverage_type_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"room_coverage_board_incl_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].room_coverage_board_incl_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"comment_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].comment_id)
												set stat = uar_srvsetstring(hhpvisitinfo,"comment_txt",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].comment_txt))
 
											 	;Benefit Sch
											 	call echo("Benefit Sch")
											 	set bschSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
													benefit_sch,5)
											 	if(bschSize > 0)
											 		for(bsch = 1 to bschSize)
												 		set hhpvisitinfobsch = uar_srvadditem(hhpvisitinfo,"benefit_sch")
														if(hhpvisitinfobsch)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"encntr_benefit_sch_r_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].encntr_benefit_sch_r_id)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"encntr_benefit_r_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].encntr_benefit_r_id)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"member_resp_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].member_resp_type_cd)
															set stat = uar_srvsetlong(hhpvisitinfobsch,"resp_range_start_nbr",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].resp_range_start_nbr)
															set stat = uar_srvsetlong(hhpvisitinfobsch,"resp_range_end_nbr",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].resp_range_end_nbr)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"resp_type_qual_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].resp_type_qual_cd)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"resp_range_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].resp_range_amt)
															set stat = uar_srvsetdouble(hhpvisitinfobsch,"resp_range_qual_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].\
																benefit_sch[bsch].resp_range_qual_cd)
														else
															set pm_obj_rep->status_data.status = "F"
															set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																build2("Could not create hhpvisitinfobsch: ",structVar)
															return
														endif
													endfor
											 	endif
 
												set stat = uar_srvsetdouble(hhpvisitinfo,"denial_reason_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].denial_reason_cd)
												set stat = uar_srvsetstring(hhpvisitinfo,"coverage_comments",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].coverage_comments))
 
												;Auth Info
												call echo("Auth Info")
												set authSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
													.encntr_plan_reltn[1].auth_info,5)
												if(authSize > 0)
													declare authStructVar = vc
													for(auth = 1 to authSize)
														set authStructVar = build("auth_info_0",cnvtstring(auth))
														set hhpvisitinfoauth = uar_srvgetstruct(hhpvisitinfo,nullterm(authStructVar))
														if(hhpvisitinfoauth)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"authorization_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].authorization_id)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"encntr_plan_reltn_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
																.encntr_plan_reltn[1].auth_info[auth].encntr_plan_reltn_id)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"person_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].person_id)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"health_plan_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].health_plan_id)
															set stat = uar_srvsetstring(hhpvisitinfoauth,"auth_nbr",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_nbr))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_type_cd)
															set stat = uar_srvsetstring(hhpvisitinfoauth,"description",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].description))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"cert_status_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].cert_status_cd)
															set stat = uar_srvsetstring(hhpvisitinfoauth,"appeal_reason",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].appeal_reason))
															set stat = uar_srvsetlong(hhpvisitinfoauth,"total_service_nbr",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].total_service_nbr)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"bnft_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].bnft_type_cd)
															set stat = uar_srvsetdate(hhpvisitinfoauth,"beg_effective_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].beg_effective_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"end_effective_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].end_effective_dt_tm))
															;set stat = uar_srvsetdouble(hhpvisitinfoauth,"data_status_cd",--Not Used)
															set stat = uar_srvsetlong(hhpvisitinfoauth,"auth_cnt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].auth_info[auth].auth_cnt)
															set stat = uar_srvsetlong(hhpvisitinfoauth,"auth_remain_cnt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_remain_cnt)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_qual_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_qual_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_required_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_required_cd)
															set stat = uar_srvsetdate(hhpvisitinfoauth,"auth_obtained_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_obtained_dt_tm))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"comment_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].comment_id)
															set stat = uar_srvsetstring(hhpvisitinfoauth,"comment_txt",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].comment_txt))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"interchange_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].interchange_id)
															set stat = uar_srvsetshort(hhpvisitinfoauth,"auth_trans_state_flag",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_trans_state_flag)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"cert_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].cert_type_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"delay_reason_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].delay_reason_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"reject_reason_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].reject_reason_cd)
															set stat = uar_srvsetdate(hhpvisitinfoauth,"admission_beg_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].admission_beg_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"admission_end_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].admission_end_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"discharge_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].discharge_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"surgical_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].surgical_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"service_beg_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].service_beg_dt_tm))
															set stat = uar_srvsetdate(hhpvisitinfoauth,"service_end_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].service_end_dt_tm))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_cnt_unit_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_cnt_unit_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_cnt_unit",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_cnt_unit)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_cnt_time_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_cnt_time_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"auth_cnt_time",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_cnt_time)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"x12service_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].x12service_type_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"provider_prsnl_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].provider_prsnl_id)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"taxonomy_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].taxonomy_id)
															set stat = uar_srvsetdate(hhpvisitinfoauth,"auth_expire_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].auth_expire_dt_tm))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"x12provider_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].x12provider_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"facility_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].facility_cd)
 
															;Auth Detail
															call echo("Auth Detail")
															set authDetSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
															.auth_info[auth].auth_detail,5)
															if(authDetSize > 0)
																set hhpvisitinfoauthdet = uar_srvgetstruct(hhpvisitinfoauth,"auth_detail")
																if(hhpvisitinfoauthdet)
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"auth_detail_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_detail_id)
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"authorization_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].authorization_id)
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"prsnl_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].prsnl_id)
																	set stat = uar_srvsetstring(hhpvisitinfoauthdet,"auth_company",
																		nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_company))
																	set stat = uar_srvsetstring(hhpvisitinfoauthdet,"auth_phone_num",
																		nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_phone_num))
																	set stat = uar_srvsetstring(hhpvisitinfoauthdet,"auth_contact",
																		nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_contact))
																	set stat = uar_srvsetdate(hhpvisitinfoauthdet,"auth_dt_tm",
																		cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_dt_tm))
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"plan_contact_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].plan_contact_id)
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"long_text_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].long_text_id)
																	set stat = uar_srvsetdate(hhpvisitinfoauthdet,"beg_effective_dt_tm",
																		cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].beg_effective_dt_tm))
																	set stat = uar_srvsetdate(hhpvisitinfoauthdet,"end_effective_dt_tm",
																		cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].end_effective_dt_tm))
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"phone_format_cd",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].phone_format_cd)
																	;set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"data_status_cd", --Not used)
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"auth_phone_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_phone_id)
 
																	;Auth Fax
																	call echo("Auth Fax")
																	set hhpvisitinfoauthdetfax = uar_srvgetstruct(hhpvisitinfoauthdet,"auth_fax")
																	if(hhpvisitinfoauthdetfax)
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"phone_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.phone_id)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"parent_entity_name",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.parent_entity_name))
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"parent_entity_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.parent_entity_id)
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"phone_type_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.phone_type_cd)
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"phone_format_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.phone_format_cd)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"phone_num",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.phone_num))
																		set stat = uar_srvsetlong(hhpvisitinfoauthdetfax,"phone_type_seq",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.phone_type_seq)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"description",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.description))
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"contact",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.contact))
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"call_instruction",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.call_instruction))
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"modem_capability_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.modem_capability_cd)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"extension",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.extension))
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"paging_code",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.paging_code))
																		set stat = uar_srvsetlong(hhpvisitinfoauthdetfax,"beg_effective_mm_dd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.beg_effective_mm_dd)
																		set stat = uar_srvsetlong(hhpvisitinfoauthdetfax,"end_effective_mm_dd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.end_effective_mm_dd)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"operation_hours",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.operation_hours))
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"data_status_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.data_status_cd)
																		set stat = uar_srvsetdate(hhpvisitinfoauthdetfax,"beg_effective_dt_tm",
																			cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.beg_effective_dt_tm))
																		set stat = uar_srvsetdate(hhpvisitinfoauthdetfax,"end_effective_dt_tm",
																			cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.end_effective_dt_tm))
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"contact_method_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.contact_method_cd)
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"email",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.email))
																		set stat = uar_srvsetstring(hhpvisitinfoauthdetfax,"source_identifier",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.source_identifier))
																		;set stat = uar_srvsetshort(hhpvisitinfoauthdetfax,"change_flag",--Not Used)
																		set stat = uar_srvsetdouble(hhpvisitinfoauthdetfax,"texting_permission_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.auth_info[auth].auth_detail[1].auth_fax.texting_permission_cd)
																	else
																		set pm_obj_rep->status_data.status = "F"
																		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																			build2("Could not create hhpvisitinfoauthdetfax: ",structVar)
																		return
																	endif
																	set stat = uar_srvsetdouble(hhpvisitinfoauthdet,"auth_phone_id",
																		pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																		.auth_info[auth].auth_detail[1].auth_phone_id)
																else
																	set pm_obj_rep->status_data.status = "F"
																	set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																		build2("Could not create hhpvisitinfoauthdet: ",structVar)
																	return
																endif
															endif
															set stat = uar_srvsetstring(hhpvisitinfoauth,"reference_nbr_txt",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].reference_nbr_txt))
															set stat = uar_srvsetdouble(hhpvisitinfoauth,"delay_reason_comment_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].delay_reason_comment_id)
															set stat = uar_srvsetstring(hhpvisitinfoauth,"delay_reason_comment_txt",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.auth_info[auth].delay_reason_comment_txt))
															;set stat = uar_srvsetdouble(hhpvisitinfoauth,"new_comment_txt", --Not used)
															;set stat = uar_srvsetdouble(hhpvisitinfoauth,"new_delay_reason_comment_txt", --Not used)
														else
															set pm_obj_rep->status_data.status = "F"
															set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																build2("Could not create hhpvisitinfoauth: ",structVar)
															return
														endif
													endfor
												endif
 
												;Encntr Fin
												call echo("Encntr Fin")
												set eFinSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
												.encntr_fin,5)
												if(eFinSize > 0)
													for(ef = 1 to eFinSize)
														set hhpvisitinfoefin = uar_srvadditem(hhpvisitinfo,"encntr_fin")
														if(hhpvisitinfoefin)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"encntr_benefit_r_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].encntr_benefit_r_id)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"encntr_plan_reltn_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].encntr_plan_reltn_id)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"deduct_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].deduct_amt)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"deduct_met_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].deduct_met_amt)
															set stat = uar_srvsetdate(hhpvisitinfoefin,"deduct_met_dt_tm",
																cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].deduct_met_dt_tm))
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"benefit_plan_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].benefit_plan_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"service_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].service_type_cd)
															set stat = uar_srvsetlong(hhpvisitinfoefin,"coverage_days",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].coverage_days)
															set stat = uar_srvsetlong(hhpvisitinfoefin,"coverage_remain_days",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].coverage_remain_days)
															set stat = uar_srvsetlong(hhpvisitinfoefin,"non_coverage_days",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].non_coverage_days)
															set stat = uar_srvsetlong(hhpvisitinfoefin,"coinsurance_days",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].coinsurance_days)
															set stat = uar_srvsetlong(hhpvisitinfoefin,"coinsurance_remain_days",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].coinsurance_remain_days)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"coinsurance_pct",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].coinsurance_pct)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"copay_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].copay_amt)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"deduct_pct",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].deduct_pct)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"deduct_remain_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].deduct_remain_amt)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"room_coverage_amt",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].room_coverage_amt)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"room_coverage_amt_qual_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].room_coverage_amt_qual_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"room_coverage_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].room_coverage_type_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"room_coverage_board_incl_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].room_coverage_board_incl_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoefin,"comment_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].comment_id)
															set stat = uar_srvsetstring(hhpvisitinfoefin,"comment_txt",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_fin[ef].comment_txt))
 
															;Benefit Sch
															call echo("Encntr Fin Benefit Sch")
															set eFinBenSchSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].
																encntr_plan_reltn[1].encntr_fin[ef].benefit_sch,5)
															if(eFinBenSchSize > 0)
																for(efbs = 1 to eFinBenSchSize)
																	set hhpvisitinfoefinbsch = uar_srvadditem(hhpvisitinfoefin,"benefit_sch")
																	if(hhpvisitinfoefinbsch)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"encntr_benefit_sch_r_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].encntr_benefit_sch_r_id)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"encntr_benefit_r_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].encntr_benefit_r_id)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"member_resp_type_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].member_resp_type_cd)
																		set stat = uar_srvsetlong(hhpvisitinfoefin,"resp_range_start_nbr",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].resp_range_start_nbr)
																		set stat = uar_srvsetlong(hhpvisitinfoefin,"resp_range_end_nbr",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].resp_range_end_nbr)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"resp_type_qual_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].resp_type_qual_cd)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"resp_range_amt",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].resp_range_amt)
																		set stat = uar_srvsetdouble(hhpvisitinfoefin,"resp_range_qual_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_fin[ef].benefit_sch[efbs].resp_range_qual_cd)
																	else
																		set pm_obj_rep->status_data.status = "F"
																		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																			build2("Could not create hhpvisitinfoefinbsch: ",structVar)
																		return
																	endif
																endfor
															endif
														else
															set pm_obj_rep->status_data.status = "F"
															set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																build2("Could not create hhpvisitinfoefin: ",structVar)
															return
														endif
													endfor
												endif
 
												set stat = uar_srvsetdouble(hhpvisitinfo,"pricing_agency_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].pricing_agency_cd)
												set stat = uar_srvsetstring(hhpvisitinfo,"insured_card_name_first",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.insured_card_name_first))
												set stat = uar_srvsetstring(hhpvisitinfo,"insured_card_name_middle",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.insured_card_name_middle))
												set stat = uar_srvsetstring(hhpvisitinfo,"insured_card_name_last",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.insured_card_name_last))
												set stat = uar_srvsetstring(hhpvisitinfo,"insured_card_name_suffix",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.insured_card_name_suffix))
												set stat = uar_srvsetdouble(hhpvisitinfo,"signature_source_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].signature_source_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"accept_assignment_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].accept_assignment_cd)
 
												;Encntr Plan Eligibility
												call echo("Encntr Plan Eligibility")
												set epEligSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
													.encntr_plan_reltn[1].encntr_plan_eligibility,5)
												if(epEligSize > 0)
													for(epe = 1 to epEligSize)
														set hhpvisitinfoepelig = uar_srvadditem(hhpvisitinfo,"encntr_plan_eligibility")
														if(hhpvisitinfoepelig)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"encntr_plan_eligibility_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
																.encntr_plan_reltn[1].encntr_plan_eligibility[epe].encntr_plan_eligibility_id)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"encntr_plan_reltn_id",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].encntr_plan_reltn_id)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"auth_required_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].auth_required_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"coverage_level_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].coverage_level_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"eligibility_status_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].eligibility_status_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"in_plan_network_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].in_plan_network_cd)
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"insurance_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].insurance_type_cd)
															set stat = uar_srvsetstring(hhpvisitinfoepelig,"payer_prov_plan_name",
																nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].payer_prov_plan_name))
															set stat = uar_srvsetdouble(hhpvisitinfoepelig,"service_type_cd",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].service_type_cd)
															set stat = uar_srvsetshort(hhpvisitinfoepelig,"change_flag",
																pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																.encntr_plan_eligibility[epe].change_flag)
 
															;Encntr Plan Elig Benefit
															call echo("Encntr Plan Elig Benefit")
															set epEligBenSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
																.encntr_plan_reltn[1].encntr_plan_eligibility[epe].encntr_plan_elig_benefit,5)
															if(epEligBenSize > 0)
																for(epeb = 1 to epEligBenSize)
																	set hhpvisitinfoepeligben = uar_srvadditem(hhpvisitinfoepelig,"encntr_plan_elig_benefit")
																	if(hhpvisitinfoepeligben)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"encntr_plan_elig_benefit_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].encntr_plan_elig_benefit_id)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"encntr_plan_eligibility_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].encntr_plan_eligibility_id)
																		set stat = uar_srvsetstring(hhpvisitinfoepeligben,"benefit_comments",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_comments))
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_comments_long_text_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_comments_long_text_id)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_monetary_amt",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_monetary_amt)
																		set stat = uar_srvsetshort(hhpvisitinfoepeligben,"benefit_monetary_amt_null_ind",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_monetary_amt_null_ind)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_pct",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_pct)
																		set stat = uar_srvsetshort(hhpvisitinfoepeligben,"benefit_pct_null_ind",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_pct_null_ind)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_qty",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_qty)
																		set stat = uar_srvsetshort(hhpvisitinfoepeligben,"benefit_qty_null_ind",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_qty_null_ind)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_qty_qual_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_qty_qual_cd)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"benefit_time_period_qual_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].benefit_time_period_qual_cd)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"info_source_cd",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].info_source_cd)
																		set stat = uar_srvsetshort(hhpvisitinfoepeligben,"selected_ind",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].selected_ind)
																		set stat = uar_srvsetstring(hhpvisitinfoepeligben,"transaction_source_ident",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].transaction_source_ident))
																		set stat = uar_srvsetshort(hhpvisitinfoepeligben,"change_flag",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb].change_flag)
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligben,"",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].encntr_plan_elig_benefit[epeb])
																	else
																		set pm_obj_rep->status_data.status = "F"
																		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																			build2("Could not create hhpvisitinfoepeligben: ",structVar)
																		return
																	endif
																endfor
															endif
 
															;Procedure
															call echo("Procedure")
															set hhpvisitinfoepeligproc = uar_srvgetstruct(hhpvisitinfoepelig,"procedure")
															if(hhpvisitinfoepeligproc)
																set stat = uar_srvsetdouble(hhpvisitinfoepeligproc,"terminology_cd",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																	.encntr_plan_eligibility[epe].procedure.terminology_cd)
																set stat = uar_srvsetstring(hhpvisitinfoepeligproc,"source_identifier",
																	nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																	.encntr_plan_eligibility[epe].procedure.source_identifier))
																set stat = uar_srvsetdouble(hhpvisitinfoepeligproc,"nomenclature_id",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																	.encntr_plan_eligibility[epe].procedure.nomenclature_id)
																set stat = uar_srvsetstring(hhpvisitinfoepeligproc,"description",
																	nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																	.encntr_plan_eligibility[epe].procedure.description))
															else
																set pm_obj_rep->status_data.status = "F"
																set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																	build2("Could not create hhpvisitinfoepeligproc: ",structVar)
																return
															endif
 
															;Modifiers
															call echo("Modifiers")
															set epModSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h]
																.encntr_plan_reltn[1].encntr_plan_eligibility[epe].modifiers,5)
															if(epModSize > 0)
																for(em = 1 to epModSize)
																	set hhpvisitinfoepeligmod = uar_srvadditem(hhpvisitinfoepelig,"modifiers")
																	if(hhpvisitinfoepeligmod)
																		set stat = uar_srvsetstring(hhpvisitinfoepeligmod,"modifier",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].modifiers[em].modifier))
																		set stat = uar_srvsetdouble(hhpvisitinfoepeligmod,"nomenclature_id",
																			pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].modifiers[em].nomenclature_id)
																		set stat = uar_srvsetstring(hhpvisitinfoepeligmod,"description",
																			nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
																			.encntr_plan_eligibility[epe].modifiers[em].description))
																	else
																		set pm_obj_rep->status_data.status = "F"
																		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																			build2("Could not create hhpvisitinfoepeligmod: ",structVar)
																		return
																	endif
																endfor
															endif
														else
															set pm_obj_rep->status_data.status = "F"
															set pm_obj_rep->status_data.subeventstatus[1].OperationStatus =
																build2("Could not create hhpvisitinfoepelig: ",structVar)
															return
														endif
													endfor
												endif
 
												;Elig Transaction -- Not used
 
												;set stat = uar_srvsetlong(hhpvisitinfo,"dirty_flag",--Not Used)
												set stat = uar_srvsetstring(hhpvisitinfo,"eligibility_transaction_uuid",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_transaction_uuid))
												set stat = uar_srvsetdouble(hhpvisitinfo,"eligibility_status_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_status_cd)
												set stat = uar_srvsetdate(hhpvisitinfo,"eligibility_sent_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_sent_dt_tm))
												set stat = uar_srvsetlong(hhpvisitinfo,"eligibility_submit_ind",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_submit_ind)
												set stat = uar_srvsetdate(hhpvisitinfo,"eligibility_cache_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_cache_dt_tm))
												set stat = uar_srvsetdate(hhpvisitinfo,"eligibility_cache_expire_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.eligibility_cache_expire_dt_tm))
												set stat = uar_srvsetdouble(hhpvisitinfo,"resubmit_278n_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.resubmit_278n_cd)
												set stat = uar_srvsetstring(hhpvisitinfo,"alt_member_nbr",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.alt_member_nbr))
												set stat = uar_srvsetdouble(hhpvisitinfo,"alt_payer_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.alt_payer_id)
 
												;Alt Payer Elig
												call echo("Alt Payer Elig")
												set hhpvisitinfoalt = uar_srvgetstruct(hhpvisitinfo,"alt_payer_elig")
												if(hhpvisitinfoalt)
													set stat = uar_srvsetstring(hhpvisitinfoalt,"eligibility_transaction_uuid",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_transaction_uuid))
													set stat = uar_srvsetdouble(hhpvisitinfoalt,"eligibility_status_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_status_cd)
													set stat = uar_srvsetdate(hhpvisitinfoalt,"eligibility_sent_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_sent_dt_tm))
													set stat = uar_srvsetshort(hhpvisitinfoalt,"eligibility_transaction_uuid",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_submit_ind)
													set stat = uar_srvsetdate(hhpvisitinfoalt,"eligibility_cache_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_cache_dt_tm))
													set stat = uar_srvsetdate(hhpvisitinfoalt,"eligibility_cache_expire_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
														.alt_payer_elig.eligibility_cache_expire_dt_tm))
												else
													set pm_obj_rep->status_data.status = "F"
													set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpvisitinfoalt: ",structVar)
													return
												endif
 
												set stat = uar_srvsetdouble(hhpvisitinfo,"notify_source_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].notify_source_cd)
												set stat = uar_srvsetdate(hhpvisitinfo,"notify_dt_tm",
													cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].notify_dt_tm))
												set stat = uar_srvsetdouble(hhpvisitinfo,"notify_prsnl_id",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].notify_prsnl_id)
												set stat = uar_srvsetdouble(hhpvisitinfo,"auth_required_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].auth_required_cd)
												set stat = uar_srvsetstring(hhpvisitinfo,"member_person_code",
													nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1]
													.member_person_code))
												set stat = uar_srvsetlong(hhpvisitinfo,"life_rsv_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].life_rsv_days)
												set stat = uar_srvsetlong(hhpvisitinfo,"life_rsv_remain_days",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].life_rsv_remain_days)
												set stat = uar_srvsetdouble(hhpvisitinfo,"life_rsv_daily_ded_amt",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].life_rsv_daily_ded_amt)
												set stat = uar_srvsetdouble(hhpvisitinfo,"life_rsv_daily_ded_qual_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].life_rsv_daily_ded_qual_cd)
												set stat = uar_srvsetlong(hhpvisitinfo,"card_issue_nbr",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].card_issue_nbr)
												set stat = uar_srvsetdouble(hhpvisitinfo,"card_category_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].card_category_cd)
												set stat = uar_srvsetdouble(hhpvisitinfo,"program_status_cd",
													pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].encntr_plan_reltn[1].program_status_cd)
											else
												set pm_obj_rep->status_data.status = "F"
												set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpvisitinfo: ",structVar)
												return
											endif
										endif
 
										;Health Plan Address
										call echo("Health Plan Address")
										set hhpaddress = uar_srvgetstruct(hsubhealthplan,"address")
										if(hhpaddress)
											set stat = uar_srvsetdouble(hhpaddress,"address_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.address_id)
											set stat = uar_srvsetstring(hhpaddress,"parent_entity_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.parent_entity_name))
											set stat = uar_srvsetdouble(hhpaddress,"parent_entity_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.parent_entity_id)
											set stat = uar_srvsetdouble(hhpaddress,"address_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.address_type_cd)
											set stat = uar_srvsetdouble(hhpaddress,"address_format_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.address_format_cd)
											set stat = uar_srvsetstring(hhpaddress,"contact_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.contact_name))
											set stat = uar_srvsetdouble(hhpaddress,"residence_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.residence_type_cd)
											set stat = uar_srvsetstring(hhpaddress,"comment_txt",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.comment_txt))
											set stat = uar_srvsetstring(hhpaddress,"street_addr",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.street_addr))
											set stat = uar_srvsetstring(hhpaddress,"street_addr2",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.street_addr2))
											set stat = uar_srvsetstring(hhpaddress,"street_addr3",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.street_addr3))
											set stat = uar_srvsetstring(hhpaddress,"street_addr4",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.street_addr4))
											set stat = uar_srvsetstring(hhpaddress,"city",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.city))
											set stat = uar_srvsetdouble(hhpaddress,"city_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.city_cd)
											set stat = uar_srvsetstring(hhpaddress,"state",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.state))
											set stat = uar_srvsetdouble(hhpaddress,"state_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.state_cd)
											set stat = uar_srvsetstring(hhpaddress,"zipcode",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.zipcode))
											set stat = uar_srvsetdouble(hhpaddress,"zip_code_group_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.zip_code_group_cd)
											set stat = uar_srvsetstring(hhpaddress,"postal_barcode_info",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.postal_barcode_info))
											set stat = uar_srvsetstring(hhpaddress,"county",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.county))
											set stat = uar_srvsetdouble(hhpaddress,"county_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.county_cd)
											set stat = uar_srvsetstring(hhpaddress,"country",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.country))
											set stat = uar_srvsetdouble(hhpaddress,"country_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.country_cd)
											set stat = uar_srvsetdouble(hhpaddress,"residence_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.residence_cd)
											set stat = uar_srvsetstring(hhpaddress,"mail_stop",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.mail_stop))
											set stat = uar_srvsetlong(hhpaddress,"address_type_seq",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.address_type_seq)
											set stat = uar_srvsetstring(hhpaddress,"beg_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.beg_effective_mm_dd))
											set stat = uar_srvsetstring(hhpaddress,"end_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.end_effective_mm_dd))
											set stat = uar_srvsetstring(hhpaddress,"operation_hours",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.operation_hours))
											set stat = uar_srvsetdouble(hhpaddress,"address_info_status_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.address_info_status_cd)
											set stat = uar_srvsetdate(hhpaddress,"beg_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.beg_effective_dt_tm))
											set stat = uar_srvsetdate(hhpaddress,"end_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.end_effective_dt_tm))
											set stat = uar_srvsetdouble(hhpaddress,"data_status_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.data_status_cd)
											set stat = uar_srvsetdouble(hhpaddress,"primary_care_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.primary_care_cd)
											set stat = uar_srvsetdouble(hhpaddress,"district_health_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.district_health_cd)
											set stat = uar_srvsetstring(hhpaddress,"addr_key",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.addr_key))
											set stat = uar_srvsetstring(hhpaddress,"source_identifier",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.source_identifier))
											set stat = uar_srvsetdate(hhpaddress,"validation_expire_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.validation_expire_dt_tm))
											set stat = uar_srvsetshort(hhpaddress,"validation_warning_override_ind",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].address.validation_warning_override_ind)
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpaddress: ",structVar)
											return
										endif
 
										;Health Plan Phone
										call echo("Health Plan Phone")
										set hhpphone = uar_srvgetstruct(hsubhealthplan,"phone")
										if(hhpphone)
											set stat = uar_srvsetdouble(hhpphone,"phone_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.phone_id)
											set stat = uar_srvsetstring(hhpphone,"parent_entity_name",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.parent_entity_name))
											set stat = uar_srvsetdouble(hhpphone,"parent_entity_id",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.parent_entity_id)
											set stat = uar_srvsetdouble(hhpphone,"phone_type_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.phone_type_cd)
											set stat = uar_srvsetdouble(hhpphone,"phone_format_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.phone_format_cd)
											set stat = uar_srvsetstring(hhpphone,"phone_num",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.phone_num))
											set stat = uar_srvsetlong(hhpphone,"phone_type_seq",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.phone_type_seq)
											set stat = uar_srvsetstring(hhpphone,"description",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.description))
											set stat = uar_srvsetstring(hhpphone,"contact",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.contact))
											set stat = uar_srvsetstring(hhpphone,"call_instruction",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.call_instruction))
											set stat = uar_srvsetdouble(hhpphone,"modem_capability_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.modem_capability_cd)
											set stat = uar_srvsetstring(hhpphone,"extension",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.extension))
											set stat = uar_srvsetstring(hhpphone,"paging_code",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.paging_code))
											set stat = uar_srvsetstring(hhpphone,"beg_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.beg_effective_mm_dd))
											set stat = uar_srvsetstring(hhpphone,"end_effective_mm_dd",
												cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.end_effective_mm_dd))
											set stat = uar_srvsetstring(hhpphone,"operation_hours",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.operation_hours))
											set stat = uar_srvsetdouble(hhpphone,"data_status_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.data_status_cd)
											set stat = uar_srvsetdate(hhpphone,"beg_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.beg_effective_dt_tm))
											set stat = uar_srvsetdate(hhpphone,"end_effective_dt_tm",
												cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.end_effective_dt_tm))
											set stat = uar_srvsetdouble(hhpphone,"contact_method_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.contact_method_cd)
											set stat = uar_srvsetstring(hhpphone,"email",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.email))
											set stat = uar_srvsetstring(hhpphone,"source_identifier",
												nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.source_identifier))
											set stat = uar_srvsetdouble(hhpphone,"texting_permission_cd",
												pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].phone.texting_permission_cd)
										else
											set pm_obj_rep->status_data.status = "F"
											set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpphone")
											return
										endif
 
										;Health Plan Addtnl Address
										call echo("Health Plan Addtnl Address")
										set hpAddPlusSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address,5)
										if(hpAddPlusSize > 0)
											for(a = 1 to hpAddPlusSize)
												set hhpaddrplus = uar_srvadditem(hsubhealthplan,"addtnl_address")
												if(hhpaddrplus)
													set stat = uar_srvsetdouble(hhpaddrplus,"address_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].address_id)
													set stat = uar_srvsetstring(hhpaddrplus,"parent_entity_name",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].parent_entity_name))
													set stat = uar_srvsetdouble(hhpaddrplus,"parent_entity_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].parent_entity_id)
													set stat = uar_srvsetdouble(hhpaddrplus,"address_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].address_type_cd)
													set stat = uar_srvsetdouble(hhpaddrplus,"address_format_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].address_format_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"contact_name",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].contact_name))
													set stat = uar_srvsetdouble(hhpaddrplus,"residence_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].residence_type_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"comment_txt",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].comment_txt))
													set stat = uar_srvsetstring(hhpaddrplus,"street_addr",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].street_addr))
													set stat = uar_srvsetstring(hhpaddrplus,"street_addr2",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].street_addr2))
													set stat = uar_srvsetstring(hhpaddrplus,"street_addr3",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].street_addr3))
													set stat = uar_srvsetstring(hhpaddrplus,"street_addr4",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].street_addr4))
													set stat = uar_srvsetstring(hhpaddrplus,"city",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].city))
													set stat = uar_srvsetdouble(hhpaddrplus,"city_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].city_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"state",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].state))
													set stat = uar_srvsetdouble(hhpaddrplus,"state_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].state_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"zipcode",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].zipcode))
													set stat = uar_srvsetdouble(hhpaddrplus,"zip_code_group_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].zip_code_group_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"postal_barcode_info",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].postal_barcode_info))
													set stat = uar_srvsetstring(hhpaddrplus,"county",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].county))
													set stat = uar_srvsetdouble(hhpaddrplus,"county_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].county_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"country",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].country))
													set stat = uar_srvsetdouble(hhpaddrplus,"country_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].country_cd)
													set stat = uar_srvsetdouble(hhpaddrplus,"residence_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].residence_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"mail_stop",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].mail_stop))
													set stat = uar_srvsetlong(hhpaddrplus,"address_type_seq",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].address_type_seq)
													set stat = uar_srvsetstring(hhpaddrplus,"beg_effective_mm_dd",
														cnvtstring(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].beg_effective_mm_dd))
													set stat = uar_srvsetstring(hhpaddrplus,"end_effective_mm_dd",
														cnvtstring(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].end_effective_mm_dd))
													set stat = uar_srvsetstring(hhpaddrplus,"operation_hours",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].operation_hours))
													set stat = uar_srvsetdouble(hhpaddrplus,"address_info_status_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].address_info_status_cd)
													set stat = uar_srvsetdate(hhpaddrplus,"beg_effective_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].beg_effective_dt_tm))
													set stat = uar_srvsetdate(hhpaddrplus,"end_effective_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].end_effective_dt_tm))
													set stat = uar_srvsetdouble(hhpaddrplus,"data_status_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].data_status_cd)
													set stat = uar_srvsetdouble(hhpaddrplus,"primary_care_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].primary_care_cd)
													set stat = uar_srvsetdouble(hhpaddrplus,"district_health_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].district_health_cd)
													set stat = uar_srvsetstring(hhpaddrplus,"addr_key",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].addr_key))
													set stat = uar_srvsetstring(hhpaddrplus,"source_identifier",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_address[a].source_identifier))
													set stat = uar_srvsetdate(hhpaddrplus,"validation_expire_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].validation_expire_dt_tm))
													set stat = uar_srvsetshort(hhpaddrplus,"validation_warning_override_ind",
														pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_address[a].validation_warning_override_ind)
												else
													set pm_obj_rep->status_data.status = "F"
													set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpaddrplus")
													return
												endif
											endfor
										endif
 
										;Health Plan Addtnl Phone
										call echo("Health Plan Addtnl Phone")
										set hpPhPlusSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone,5)
										if(hpPhPlusSize > 0)
											for(p = 1 to hpPhPlusSize)
												set hhpphoneplus = uar_srvadditem(hsubhealthplan,"addtnl_phone")
												if(hhpphoneplus)
													set stat = uar_srvsetdouble(hhpphoneplus,"phone_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].phone_id)
													set stat = uar_srvsetstring(hhpphoneplus,"parent_entity_name",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].parent_entity_name))
													set stat = uar_srvsetdouble(hhpphoneplus,"parent_entity_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].parent_entity_id)
													set stat = uar_srvsetdouble(hhpphoneplus,"phone_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].phone_type_cd)
													set stat = uar_srvsetdouble(hhpphoneplus,"phone_format_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].phone_format_cd)
													set stat = uar_srvsetstring(hhpphoneplus,"phone_num",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].phone_num))
													set stat = uar_srvsetlong(hhpphoneplus,"phone_type_seq",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].phone_type_seq)
													set stat = uar_srvsetstring(hhpphoneplus,"description",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].description))
													set stat = uar_srvsetstring(hhpphoneplus,"contact",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].contact))
													set stat = uar_srvsetstring(hhpphoneplus,"call_instruction",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].call_instruction))
													set stat = uar_srvsetdouble(hhpphoneplus,"modem_capability_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].modem_capability_cd)
													set stat = uar_srvsetstring(hhpphoneplus,"extension",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].extension))
													set stat = uar_srvsetstring(hhpphoneplus,"paging_code",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].paging_code))
													set stat = uar_srvsetstring(hhpphoneplus,"beg_effective_mm_dd",
														cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].beg_effective_mm_dd))
													set stat = uar_srvsetstring(hhpphoneplus,"end_effective_mm_dd",
														cnvtstring(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].end_effective_mm_dd))
													set stat = uar_srvsetstring(hhpphoneplus,"operation_hours",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].operation_hours))
													set stat = uar_srvsetdouble(hhpphoneplus,"data_status_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].data_status_cd)
													set stat = uar_srvsetdate(hhpphoneplus,"beg_effective_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_phone[p].beg_effective_dt_tm))
													set stat = uar_srvsetdate(hhpphoneplus,"end_effective_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.\
														person_plan_reltn[h].addtnl_phone[p].end_effective_dt_tm))
													set stat = uar_srvsetdouble(hhpphoneplus,"contact_method_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].contact_method_cd)
													set stat = uar_srvsetstring(hhpphoneplus,"email",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].email))
													set stat = uar_srvsetstring(hhpphoneplus,"source_identifier",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].source_identifier))
													set stat = uar_srvsetdouble(hhpphoneplus,"texting_permission_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].addtnl_phone[p].texting_permission_cd)
												else
													set pm_obj_rep->status_data.status = "F"
													set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpphoneplus")
													return
												endif
											endfor
										endif
 
										;Fin
										call echo("Fin")
										set finSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin,5)
										if(finSize > 0)
											for(f = 1 to finSize)
												set hhpfin = uar_srvadditem(hsubhealthplan,"fin")
												if(hhpfin)
													set stat = uar_srvsetdouble(hhpfin,"person_benefit_r_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].person_benefit_r_id)
													set stat = uar_srvsetdouble(hhpfin,"person_plan_reltn_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].person_plan_reltn_id)
													set stat = uar_srvsetdouble(hhpfin,"coverage_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coverage_type_cd)
													set stat = uar_srvsetdouble(hhpfin,"balance_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].balance_type_cd)
													set stat = uar_srvsetdouble(hhpfin,"deduct_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].deduct_amt)
													set stat = uar_srvsetdouble(hhpfin,"deduct_met_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].deduct_met_amt)
													set stat = uar_srvsetdate(hhpfin,"deduct_met_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].deduct_met_dt_tm))
													set stat = uar_srvsetdouble(hhpfin,"fam_deduct_met_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].fam_deduct_met_amt)
													set stat = uar_srvsetdate(hhpfin,"fam_deduct_met_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].fam_deduct_met_dt_tm))
													set stat = uar_srvsetdouble(hhpfin,"max_out_pckt_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].max_out_pckt_amt)
													set stat = uar_srvsetdate(hhpfin,"max_out_pckt_dt_tm",
														cnvtdatetime(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].max_out_pckt_dt_tm))
													set stat = uar_srvsetdouble(hhpfin,"benefit_plan_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_plan_cd)
													set stat = uar_srvsetdouble(hhpfin,"service_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].service_type_cd)
													set stat = uar_srvsetlong(hhpfin,"coverage_days",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coverage_days)
													set stat = uar_srvsetlong(hhpfin,"coverage_remain_days",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coverage_remain_days)
													set stat = uar_srvsetlong(hhpfin,"non_coverage_days",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].non_coverage_days)
													set stat = uar_srvsetlong(hhpfin,"coinsurance_days",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coinsurance_days)
													set stat = uar_srvsetlong(hhpfin,"coinsurance_remain_days",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coinsurance_remain_days)
													set stat = uar_srvsetdouble(hhpfin,"coinsurance_pct",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].coinsurance_pct)
													set stat = uar_srvsetdouble(hhpfin,"copay_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].copay_amt)
													set stat = uar_srvsetdouble(hhpfin,"deduct_pct",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].deduct_pct)
													set stat = uar_srvsetdouble(hhpfin,"deduct_remain_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].deduct_remain_amt)
													set stat = uar_srvsetdouble(hhpfin,"room_coverage_amt",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].room_coverage_amt)
													set stat = uar_srvsetdouble(hhpfin,"room_coverage_amt_qual_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].room_coverage_amt_qual_cd)
													set stat = uar_srvsetdouble(hhpfin,"room_coverage_type_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].room_coverage_type_cd)
													set stat = uar_srvsetdouble(hhpfin,"room_coverage_board_incl_cd",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].room_coverage_board_incl_cd)
													set stat = uar_srvsetdouble(hhpfin,"comment_id",
														pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].comment_id)
													set stat = uar_srvsetstring(hhpfin,"comment_txt",
														nullterm(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].comment_txt))
 
													;Benefit Sch
													call echo("Fin Benefit Sch")
													set bSchSize = size(pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch,5)
													if(bSchSize > 0)
														for(b = 1 to bSchSize)
															set hhpfinbsch = uar_srvadditem(hhpfin,"benefit_sch")
															if(hhpfinbsch)
																set stat = uar_srvsetdouble(hhpfin,"person_benefit_sch_r_id",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].\
																	person_benefit_sch_r_id)
																set stat = uar_srvsetdouble(hhpfin,"person_benefit_r_id",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].person_benefit_r_id)
																set stat = uar_srvsetdouble(hhpfin,"member_resp_type_cd",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].member_resp_type_cd)
																set stat = uar_srvsetlong(hhpfin,"resp_range_start_nbr",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].resp_range_start_nbr)
																set stat = uar_srvsetlong(hhpfin,"resp_range_end_nbr",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].resp_range_end_nbr)
																set stat = uar_srvsetdouble(hhpfin,"resp_type_qual_cd",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].resp_type_qual_cd)
																set stat = uar_srvsetdouble(hhpfin,"resp_range_amt",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].resp_range_amt)
																set stat = uar_srvsetdouble(hhpfin,"resp_range_qual_cd",
																	pm_obj_req->person.person_person_reltn[i].person.person_plan_reltn[h].fin[f].benefit_sch[b].resp_range_qual_cd)
															else
																set pm_obj_rep->status_data.status = "F"
																set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpfinbsch")
																return
															endif
														endfor
													endif
												else
													set pm_obj_rep->status_data.status = "F"
													set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hhpfin")
													return
												endif
											endfor
										endif
									else
										set pm_obj_rep->status_data.status = "F"
										set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hsubhealthplan: ",structVar)
										return
									endif
								endfor
							endif
						endif
					else
						set pm_obj_rep->status_data.status = "F"
						set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpprperson: ",structVar)
						return
					endif
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpersonreltn: ",structVar)
					return
				endif
				endif ;End if update_reltn_ind
			endfor
		endif
 
		;Encounter
		call echo("Encounter")
		set hencounter = uar_srvgetstruct(hperson,"encounter")
		if(hencounter = 0)
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencounter.")
			return
		endif
		set stat = uar_srvsetshort(hencounter,"new_encntr_ind",pm_obj_req->encounter.encounter.new_encntr_ind)
	 	set stat = uar_srvsetdouble(hencounter,"encntr_pending_id",pm_obj_req->encounter.encounter.encntr_pending_id)
		set stat = uar_srvsetdouble(hencounter,"mental_health_cd",pm_obj_req->encounter.encounter.mental_health_cd)
		set stat = uar_srvsetdate(hencounter,"mental_health_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.mental_health_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"encntr_id",pm_obj_req->encounter.encounter.encntr_id)
		set stat = uar_srvsetdouble(hencounter,"person_id",pm_obj_req->encounter.encounter.person_id)
		set stat = uar_srvsetdate(hencounter,"create_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.create_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"create_prsnl_id",pm_obj_req->encounter.encounter.create_prsnl_id)
		set stat = uar_srvsetdouble(hencounter,"encntr_class_cd",pm_obj_req->encounter.encounter.encntr_class_cd)
		set stat = uar_srvsetdouble(hencounter,"encntr_type_cd",pm_obj_req->encounter.encounter.encntr_type_cd)
		set stat = uar_srvsetdouble(hencounter,"encntr_type_class_cd",pm_obj_req->encounter.encounter.encntr_type_class_cd)
		set stat = uar_srvsetdouble(hencounter,"encntr_status_cd",pm_obj_req->encounter.encounter.encntr_status_cd)
		set stat = uar_srvsetdate(hencounter,"pre_reg_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.pre_reg_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"pre_reg_prsnl_id",pm_obj_req->encounter.encounter.pre_reg_prsnl_id)
		set stat = uar_srvsetdate(hencounter,"reg_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.reg_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"reg_prsnl_id",pm_obj_req->encounter.encounter.reg_prsnl_id)
		set stat = uar_srvsetdate(hencounter,"est_arrive_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.est_arrive_dt_tm))
		set stat = uar_srvsetdate(hencounter,"est_depart_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.est_depart_dt_tm))
		set stat = uar_srvsetdate(hencounter,"arrive_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.arrive_dt_tm))
		set stat = uar_srvsetdate(hencounter,"depart_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.depart_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"admit_type_cd",pm_obj_req->encounter.encounter.admit_type_cd)
		set stat = uar_srvsetdouble(hencounter,"admit_src_cd",pm_obj_req->encounter.encounter.admit_src_cd)
		set stat = uar_srvsetdouble(hencounter,"admit_mode_cd",pm_obj_req->encounter.encounter.admit_mode_cd)
		set stat = uar_srvsetdouble(hencounter,"admit_with_medication_cd",pm_obj_req->encounter.encounter.admit_with_medication_cd)
		set stat = uar_srvsetstring(hencounter,"referring_comment",
			nullterm(pm_obj_req->encounter.encounter.referring_comment))
		set stat = uar_srvsetdouble(hencounter,"disch_disposition_cd",pm_obj_req->encounter.encounter.disch_disposition_cd)
		set stat = uar_srvsetdouble(hencounter,"disch_to_loctn_cd",pm_obj_req->encounter.encounter.disch_to_loctn_cd)
		set stat = uar_srvsetstring(hencounter,"preadmit_nbr",
			nullterm(pm_obj_req->encounter.encounter.preadmit_nbr))
		set stat = uar_srvsetdouble(hencounter,"preadmit_testing_cd",pm_obj_req->encounter.encounter.preadmit_testing_cd)
		set stat = uar_srvsetshort(hencounter,"preadmit_testing_list_ind",pm_obj_req->encounter.encounter.preadmit_testing_list_ind)
		set encPreSize = size(pm_obj_req->encounter.encounter.preadmit_testing,5)
		if(encPreSize > 0)
			for(i = 1 to encPreSize)
				set hencpreadm = uar_srvadditem(hencounter,"preadmit_testing")
				set stat = uar_srvsetdouble(hencpreadm,"value_cd",pm_obj_req->encounter.encounter.preadmit_testing[i].value_cd)
			endfor
		endif
		set stat = uar_srvsetdouble(hencounter,"readmit_cd",pm_obj_req->encounter.encounter.readmit_cd)
		set stat = uar_srvsetdouble(hencounter,"accommodation_cd",pm_obj_req->encounter.encounter.accommodation_cd)
		set stat = uar_srvsetdouble(hencounter,"accommodation_request_cd",pm_obj_req->encounter.encounter.accommodation_request_cd)
		set stat = uar_srvsetdouble(hencounter,"alt_result_dest_cd",pm_obj_req->encounter.encounter.alt_result_dest_cd)
		set stat = uar_srvsetdouble(hencounter,"ambulatory_cond_cd",pm_obj_req->encounter.encounter.ambulatory_cond_cd)
		set stat = uar_srvsetdouble(hencounter,"courtesy_cd",pm_obj_req->encounter.encounter.courtesy_cd)
		set stat = uar_srvsetdouble(hencounter,"diet_type_cd",pm_obj_req->encounter.encounter.diet_type_cd)
		set stat = uar_srvsetdouble(hencounter,"isolation_cd",pm_obj_req->encounter.encounter.isolation_cd)
		set stat = uar_srvsetdouble(hencounter,"med_service_cd",pm_obj_req->encounter.encounter.med_service_cd)
		set stat = uar_srvsetdouble(hencounter,"result_dest_cd",pm_obj_req->encounter.encounter.result_dest_cd)
		set stat = uar_srvsetdouble(hencounter,"confid_level_cd",pm_obj_req->encounter.encounter.confid_level_cd)
		set stat = uar_srvsetdouble(hencounter,"vip_cd",pm_obj_req->encounter.encounter.vip_cd)
		set stat = uar_srvsetstring(hencounter,"name_last_key",
			nullterm(pm_obj_req->encounter.encounter.name_last_key))
		set stat = uar_srvsetstring(hencounter,"name_first_key",
			nullterm(pm_obj_req->encounter.encounter.name_first_key))
		set stat = uar_srvsetstring(hencounter,"name_full_formatted",
			nullterm(pm_obj_req->encounter.encounter.name_full_formatted))
		set stat = uar_srvsetstring(hencounter,"name_last",
			nullterm(pm_obj_req->encounter.encounter.name_last))
		set stat = uar_srvsetstring(hencounter,"name_first",
			nullterm(pm_obj_req->encounter.encounter.name_first))
		set stat = uar_srvsetstring(hencounter,"name_phonetic",
			nullterm(pm_obj_req->encounter.encounter.name_phonetic))
		set stat = uar_srvsetdouble(hencounter,"sex_cd",pm_obj_req->encounter.encounter.sex_cd)
		set stat = uar_srvsetdouble(hencounter,"birth_dt_cd",pm_obj_req->encounter.encounter.birth_dt_cd)
		set stat = uar_srvsetdate(hencounter,"birth_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.birth_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"species_cd",pm_obj_req->encounter.encounter.species_cd)
		set stat = uar_srvsetdouble(hencounter,"location_cd",pm_obj_req->encounter.encounter.location_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_facility_cd",pm_obj_req->encounter.encounter.loc_facility_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_building_cd",pm_obj_req->encounter.encounter.loc_building_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_nurse_unit_cd",pm_obj_req->encounter.encounter.loc_nurse_unit_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_room_cd",pm_obj_req->encounter.encounter.loc_room_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_bed_cd",pm_obj_req->encounter.encounter.loc_bed_cd)
		set stat = uar_srvsetdate(hencounter,"disch_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.disch_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"guarantor_type_cd",pm_obj_req->encounter.encounter.guarantor_type_cd)
		set stat = uar_srvsetdouble(hencounter,"loc_temp_cd",pm_obj_req->encounter.encounter.loc_temp_cd)
		set stat = uar_srvsetdouble(hencounter,"organization_id",pm_obj_req->encounter.encounter.organization_id)
		set stat = uar_srvsetstring(hencounter,"reason_for_visit",
			nullterm(pm_obj_req->encounter.encounter.reason_for_visit))
		set stat = uar_srvsetdouble(hencounter,"encntr_financial_id",pm_obj_req->encounter.encounter.encntr_financial_id)
		set stat = uar_srvsetdouble(hencounter,"name_first_synonym_id",pm_obj_req->encounter.encounter.name_first_synonym_id)
		set stat = uar_srvsetdouble(hencounter,"financial_class_cd",pm_obj_req->encounter.encounter.financial_class_cd)
		set stat = uar_srvsetdouble(hencounter,"bbd_procedure_cd",pm_obj_req->encounter.encounter.bbd_procedure_cd)
		set stat = uar_srvsetstring(hencounter,"info_given_by",
			nullterm(pm_obj_req->encounter.encounter.info_given_by))
		set stat = uar_srvsetdouble(hencounter,"safekeeping_cd",pm_obj_req->encounter.encounter.safekeeping_cd)
		set stat = uar_srvsetdouble(hencounter,"trauma_cd",pm_obj_req->encounter.encounter.trauma_cd)
		set stat = uar_srvsetdate(hencounter,"trauma_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.trauma_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"triage_cd",pm_obj_req->encounter.encounter.triage_cd)
		set stat = uar_srvsetdate(hencounter,"triage_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.triage_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"visitor_status_cd",pm_obj_req->encounter.encounter.visitor_status_cd)
		set stat = uar_srvsetdouble(hencounter,"valuables_cd",pm_obj_req->encounter.encounter.valuables_cd)
		set stat = uar_srvsetshort(hencounter,"valuables_list_ind",pm_obj_req->encounter.encounter.valuables_list_ind)
		set encValSize = size(pm_obj_req->encounter.encounter.valuables,5)
		if(encValSize > 0)
			for(i = 1 to encValSize)
				set hencvaluable = uar_srvadditem(hencounter,"valuables")
				set stat = uar_srvsetdouble(hencvaluable,"value_cd",pm_obj_req->encounter.encounter.valuables[i].value_cd)
			endfor
		endif
		set stat = uar_srvsetdouble(hencounter,"security_access_cd",pm_obj_req->encounter.encounter.security_access_cd)
		set stat = uar_srvsetdouble(hencounter,"refer_facility_cd",pm_obj_req->encounter.encounter.refer_facility_cd)
		set stat = uar_srvsetdouble(hencounter,"accomp_by_cd",pm_obj_req->encounter.encounter.accomp_by_cd)
		set stat = uar_srvsetdouble(hencounter,"accommodation_reason_cd",pm_obj_req->encounter.encounter.accommodation_reason_cd)
		set stat = uar_srvsetdouble(hencounter,"service_category_cd",pm_obj_req->encounter.encounter.service_category_cd)
		set stat = uar_srvsetdouble(hencounter,"est_length_of_stay",cnvtreal(pm_obj_req->encounter.encounter.est_length_of_stay))
		set stat = uar_srvsetdouble(hencounter,"contract_status_cd",pm_obj_req->encounter.encounter.contract_status_cd)
		set stat = uar_srvsetdouble(hencounter,"data_status_cd",pm_obj_req->encounter.encounter.data_status_cd)
		set stat = uar_srvsetdate(hencounter,"assign_to_loc_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.assign_to_loc_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"alt_lvl_care_cd",pm_obj_req->encounter.encounter.alt_lvl_care_cd)
		set stat = uar_srvsetdouble(hencounter,"program_service_cd",pm_obj_req->encounter.encounter.program_service_cd)
		set stat = uar_srvsetdouble(hencounter,"specialty_unit_cd",pm_obj_req->encounter.encounter.specialty_unit_cd)
		set stat = uar_srvsetdouble(hencounter,"region_cd",pm_obj_req->encounter.encounter.region_cd)
		set stat = uar_srvsetdouble(hencounter,"sitter_required_cd",pm_obj_req->encounter.encounter.sitter_required_cd)
		set stat = uar_srvsetdate(hencounter,"doc_rcvd_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.doc_rcvd_dt_tm))
		set stat = uar_srvsetdate(hencounter,"referral_rcvd_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.referral_rcvd_dt_tm))
		set stat = uar_srvsetdate(hencounter,"alt_lvl_care_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.alt_lvl_care_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"alc_reason_cd",pm_obj_req->encounter.encounter.alc_reason_cd)
		set stat = uar_srvsetdate(hencounter,"alc_decomp_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.alc_decomp_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"place_auth_prsnl_id",pm_obj_req->encounter.encounter.place_auth_prsnl_id)
		set stat = uar_srvsetlong(hencounter,"birth_tz",pm_obj_req->encounter.encounter.birth_tz)
		set stat = uar_srvsetstring(hencounter,"birth_tz_disp",
			nullterm(pm_obj_req->encounter.encounter.birth_tz_disp))
		set stat = uar_srvsetshort(hencounter,"birth_prec_flag",pm_obj_req->encounter.encounter.birth_prec_flag)
		set stat = uar_srvsetdate(hencounter,"raw_birth_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.raw_birth_dt_tm))
		set stat = uar_srvsetdate(hencounter,"inpatient_admit_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.inpatient_admit_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"patient_classification_cd",pm_obj_req->encounter.encounter.patient_classification_cd)
		set stat = uar_srvsetdouble(hencounter,"mental_category_cd",pm_obj_req->encounter.encounter.mental_category_cd)
		set stat = uar_srvsetdouble(hencounter,"psychiatric_status_cd",pm_obj_req->encounter.psychiatric_status_cd)
		set stat = uar_srvsetdate(hencounter,"result_acc_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.result_acc_dt_tm))
		;set stat = uar_srvsetdouble(hencounter,"cancel_transfer_cd",--Not used)
		set stat = uar_srvsetdouble(hencounter,"filter_by_field",pm_obj_req->encounter.encounter.filter_by_field)
		set stat = uar_srvsetdouble(hencounter,"abn_status_cd",pm_obj_req->encounter.encounter.abn_status_cd)
		;set stat = uar_srvsetdate(hencounter,"eligibility_beg_dt_tm",)
		;set stat = uar_srvsetdate(hencounter,"eligibility_end_dt_tm",)
		set stat = uar_srvsetdouble(hencounter,"est_financial_resp_amt",pm_obj_req->encounter.encounter.est_financial_resp_amt)
		;set stat = uar_srvsetdate(hencounter,"observation_start_dt_tm"	--Not used)
		;set stat = uar_srvsetdate(hencounter,"observation_end_dt_tm"	--Not used)
		;set stat = uar_srvsetdate(hencounter,"clinical_discharge_dt_tm" --Not used)
		;set stat = uar_srvsetdate(hencounter,"outpatient_in_bed_dt_tm"	--Not used)
		;set stat = uar_srvsetdouble(hencounter,"ce_dynamic_label_id"	--Not used)
		set stat = uar_srvsetdouble(hencounter,"treatment_phase_cd",pm_obj_req->encounter.encounter.treatment_phase_cd)
		;set stat = uar_srvsetstring(hencounter,"new_general_comment_txt",--Not used)
		;set stat = uar_srvsetdouble(hencounter,"billing_impact_status_cd",	--Not used)
		;set stat = uar_srvsetdouble(hencounter,"billing_impact_reason_cd",	--Not used)
		set stat = uar_srvsetdouble(hencounter,"incident_cd",pm_obj_req->encounter.encounter.incident_cd)
		set stat = uar_srvsetdouble(hencounter,"client_organization_id",pm_obj_req->encounter.encounter.client_organization_id)
		set stat = uar_srvsetstring(hencounter,"client_organization_name",
			nullterm(pm_obj_req->encounter.encounter.client_organization_name))
		;set stat = uar_srvsetdouble(hencounter,"copy_from_encntr_id",--Not used)
 
		;Encounter Transfer - Ignored for now - Action = 300
 
		;Encounter Discharge - Ignored for now - Action = 400
 
		;Encounter Aliases
		call echo("Encounter Aliases")
		set eaSize = size(pm_obj_req->encounter.encntr_alias,5)
		if(eaSize > 0)
			for(i = 1 to eaSize)
				case(pm_obj_req->encounter.encntr_alias[i].encntr_alias_type_cd)
					of c_fin_nbr_encntr_alias_type_cd: set aliasVar = "finnbr"
					of c_visitid_encntr_alias_type_cd: set aliasVar = "visitnbr"
					of c_reqnbr_encntr_alias_type_cd: set aliasVar = "reqnbr"
					else
						set aliasVar = ""
				endcase
 
				if(aliasVar > " ")
					set hencalias = uar_srvgetstruct(hencounter,nullterm(aliasVar))
					if(hencalias)
						set stat = uar_srvsetdouble(hencalias,"encntr_alias_id",pm_obj_req->encounter.encntr_alias[i].encntr_alias_id)
						set stat = uar_srvsetdouble(hencalias,"encntr_id",pm_obj_req->encounter.encntr_alias[i].encntr_id)
						set stat = uar_srvsetdouble(hencalias,"alias_pool_cd",pm_obj_req->encounter.encntr_alias[i].alias_pool_cd)
						set stat = uar_srvsetdouble(hencalias,"encntr_alias_type_cd",pm_obj_req->encounter.encntr_alias[i].encntr_alias_type_cd)
						set stat = uar_srvsetstring(hencalias,"alias",nullterm(pm_obj_req->encounter.encntr_alias[i].alias))
						set stat = uar_srvsetdouble(hencalias,"encntr_alias_sub_type_cd",
							pm_obj_req->encounter.encntr_alias[i].encntr_alias_sub_type_cd)
						set stat = uar_srvsetlong(hencalias,"check_digit",pm_obj_req->encounter.encntr_alias[i].check_digit)
						set stat = uar_srvsetdouble(hencalias,"check_digit_method_cd",pm_obj_req->encounter.encntr_alias[i].check_digit_method_cd)
						set stat = uar_srvsetdouble(hencalias,"data_status_cd",pm_obj_req->encounter.encntr_alias[i].data_status_cd)
					else
						set pm_obj_rep->status_data.status = "F"
						set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencalias: ",aliasVar)
						return
					endif
				endif
			endfor
		endif
 
		;Encounter Prsnl Reltns
		call echo("Encounter Prsnl Reltns")
		set epSize = size(pm_obj_req->encounter.encntr_prsnl_reltn,5)
		if(epSize > 0)
			set docCnt = 1
			for(i = 1 to epSize)
				case(uar_get_code_cki(pm_obj_req->encounter.encntr_prsnl_reltn[i].encntr_prsnl_r_cd))
					;AdmitDoc
					of "CKI.CODEVALUE!4023": set docVar = "admitdoc"
					;AttendDoc
					of "CKI.CODEVALUE!4024": set docVar = "attenddoc"
					;CaseMgr
					of "CKI.CODEVALUE!4594": set docVar = "casemgr"
					;ReferDoc
					of "CKI.CODEVALUE!4597": set docVar = "referdoc"
					;SocialWorker
					of "CKI.CODEVALUE!2910505": set docVar = "socialworker"
					;LocumAdmit
					of "CKI.CODEVALUE!2989549": set docVar = "locumadmit"
					;LocumAttend
					of "CKI.CODEVALUE!2989550": set docVar = "locumattend"
					;Coordinator
					of "CKI.CODEVALUE!2814778": set docVar = "coordinator"
					;OtherDocs
					else
						if(docCnt < 10)
							set docVar = build("doc_0",docCnt)
						else
							set docVar = build("doc_",docCnt)
						endif
 
						set docCnt = docCnt + 1
				endcase
 
	 			set hencprsnlreltn = uar_srvgetstruct(hencounter,nullterm(docVar))
				if(hencprsnlreltn)
					set stat = uar_srvsetdouble(hencprsnlreltn,"encntr_prsnl_reltn_id",
						pm_obj_req->encounter.encntr_prsnl_reltn[i].encntr_prsnl_reltn_id)
					set stat = uar_srvsetdouble(hencprsnlreltn,"prsnl_person_id",pm_obj_req->encounter.encntr_prsnl_reltn[i].prsnl_person_id)
					set stat = uar_srvsetdouble(hencprsnlreltn,"encntr_prsnl_r_cd",pm_obj_req->encounter.encntr_prsnl_reltn[i].encntr_prsnl_r_cd)
					set stat = uar_srvsetdouble(hencprsnlreltn,"encntr_id",pm_obj_req->encounter.encntr_prsnl_reltn[i].encntr_id)
					set stat = uar_srvsetdouble(hencprsnlreltn,"free_text_cd",pm_obj_req->encounter.encntr_prsnl_reltn[i].free_text_cd)
					set stat = uar_srvsetstring(hencprsnlreltn,"ft_prsnl_name",
						nullterm(pm_obj_req->encounter.encntr_prsnl_reltn[i].ft_prsnl_name))
					set stat = uar_srvsetlong(hencprsnlreltn,"priority_seq",pm_obj_req->encounter.encntr_prsnl_reltn[i].priority_seq)
					set stat = uar_srvsetlong(hencprsnlreltn,"internal_seq",pm_obj_req->encounter.encntr_prsnl_reltn[i].internal_seq)
					set stat = uar_srvsetshort(hencprsnlreltn,"expiration_ind",pm_obj_req->encounter.encntr_prsnl_reltn[i].expiration_ind)
					set stat = uar_srvsetdouble(hencprsnlreltn,"notification_cd",pm_obj_req->encounter.encntr_prsnl_reltn[i].notification_cd)
					set stat = uar_srvsetdouble(hencprsnlreltn,"data_status_cd",pm_obj_req->encounter.encntr_prsnl_reltn[i].data_status_cd)
					set stat = uar_srvsetdouble(hencprsnlreltn,"demog_reltn_id",pm_obj_req->encounter.encntr_prsnl_reltn[i].demog_reltn_id)
					;set stat = uar_srvsetdouble(hencprsnlreltn,"phys_override_comments",-- Not used)
					;set stat = uar_srvsetdouble(hencprsnlreltn,"phys_override_prsnl_id",--Not used)
					;set stat = uar_srvsetdouble(hencprsnlreltn,"phys_override_ind",--Not used)
					set stat = uar_srvsetdouble(hencprsnlreltn,"beg_effective_dt_tm",
						cnvtdatetime(pm_obj_req->encounter.encntr_prsnl_reltn[i].beg_effective_dt_tm))
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencprsnlreltn: ",docVar)
					return
				endif
			endfor
		endif
 
		;Encounter Comments(encntr_info)
		call echo("Encounter Comments")
		set eiSize = size(pm_obj_req->encounter.encntr_info,5)
		if(eiSize > 0)
			for(i = 1 to eiSize)
				if(pm_obj_req->encounter.encntr_info[i].info_type_cd = c_comment_info_type_cd)
					if(pm_obj_req->encounter.encntr_info[i].internal_seq < 10)
						set commentVar = build("comment_0",cnvtstring(pm_obj_req->encounter.encntr_info[i].internal_seq))
					else
						set commentVar = build("comment_",cnvtstring(pm_obj_req->encounter.encntr_info[i].internal_seq))
					endif
 
					set henccomment = uar_srvgetstruct(hencounter,nullterm(commentVar))
					if(henccomment)
						set stat = uar_srvsetdouble(henccomment,"encntr_info_id",pm_obj_req->encounter.encntr_info[i].encntr_info_id)
						set stat = uar_srvsetdouble(henccomment,"encntr_id",pm_obj_req->encounter.encntr_info[i].encntr_id)
						set stat = uar_srvsetdouble(henccomment,"info_type_cd",pm_obj_req->encounter.encntr_info[i].info_type_cd)
						set stat = uar_srvsetdouble(henccomment,"info_sub_type_cd",pm_obj_req->encounter.encntr_info[i].info_sub_type_cd)
						set stat = uar_srvsetdouble(henccomment,"long_text_id",pm_obj_req->encounter.encntr_info[i].long_text_id)
						set stat = uar_srvsetstring(henccomment,"long_text",
							nullterm(pm_obj_req->encounter.encntr_info[i].long_text))
						set stat = uar_srvsetlong(henccomment,"value_numeric",pm_obj_req->encounter.encntr_info[i].value_numeric)
						set stat = uar_srvsetdate(henccomment,"value_dt_tm",
							cnvtdatetime(pm_obj_req->encounter.encntr_info[i].value_dt_tm))
						set stat = uar_srvsetshort(henccomment,"chartable_ind",pm_obj_req->encounter.encntr_info[i].chartable_ind)
						set stat = uar_srvsetlong(henccomment,"priority_seq",pm_obj_req->encounter.encntr_info[i].priority_seq)
						set stat = uar_srvsetlong(henccomment,"internal_seq",pm_obj_req->encounter.encntr_info[i].internal_seq)
						set stat = uar_srvsetdouble(henccomment,"value_cd",pm_obj_req->encounter.encntr_info[i].value_cd)
						;set pm_obj_req->person.encounter.comment_01.data_status_cd -- Not used
					else
						set pm_obj_rep->status_data.status = "F"
						set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create henccomment: ",commentVar)
						return
					endif
				endif
			endfor
		endif
 
		;Encounter Diagnoses
		call echo("Encounter Diagnoses")
		set edSize = size(pm_obj_req->encounter.diagnosis,5)
		declare diagVar = vc
		if(edSize > 0)
			for(i = 1 to edSize)
				if(i < 10)
					set diagVar = build("diagnosis_0",cnvtstring(diagVar))
				else
					set diagVar = build("diagnosis_",cnvtstring(diagVar))
				endif
 
				set hencdiag = uar_srvgetstruct(hencounter,nullterm(diagVar))
				if(hencdiag)
					set stat = uar_srvsetdouble(hencdiag,"diagnosis_id",pm_obj_req->encounter.diagnosis[i].diagnosis_id)
					set stat = uar_srvsetdouble(hencdiag,"person_id",pm_obj_req->encounter.diagnosis[i].person_id)
					set stat = uar_srvsetdouble(hencdiag,"encntr_id",pm_obj_req->encounter.diagnosis[i].encntr_id)
					set stat = uar_srvsetdouble(hencdiag,"nomenclature_id",pm_obj_req->encounter.diagnosis[i].nomenclature_id)
					set stat = uar_srvsetdate(hencdiag,"diag_dt_tm",
						cnvtdatetime(pm_obj_req->encounter.diagnosis[i].diag_dt_tm))
					set stat = uar_srvsetdouble(hencdiag,"diag_type_cd",pm_obj_req->encounter.diagnosis[i].diag_type_cd)
					set stat = uar_srvsetdouble(hencdiag,"diagnostic_category_cd",pm_obj_req->encounter.diagnosis[i].diagnostic_category_cd)
					set stat = uar_srvsetlong(hencdiag,"diag_priority",pm_obj_req->encounter.diagnosis[i].diag_priority)
					set stat = uar_srvsetdouble(hencdiag,"diag_prsnl_id",pm_obj_req->encounter.diagnosis[i].diag_prsnl_id)
					set stat = uar_srvsetstring(hencdiag,"diag_prsnl_name",
						nullterm(pm_obj_req->encounter.diagnosis[i].diag_prsnl_name))
					set stat = uar_srvsetdouble(hencdiag,"diag_class_cd",pm_obj_req->encounter.diagnosis[i].diag_class_cd)
					set stat = uar_srvsetdouble(hencdiag,"confid_level_cd",pm_obj_req->encounter.diagnosis[i].confid_level_cd)
					set stat = uar_srvsetdate(hencdiag,"attestation_dt_tm",
						cnvtdatetime(pm_obj_req->encounter.diagnosis[i].attestation_dt_tm))
					set stat = uar_srvsetstring(hencdiag,"reference_nbr",
						nullterm(pm_obj_req->encounter.diagnosis[i].reference_nbr))
					set stat = uar_srvsetstring(hencdiag,"seg_unique_key",
						nullterm(pm_obj_req->encounter.diagnosis[i].seg_unique_key))
					set stat = uar_srvsetstring(hencdiag,"diag_ftdesc",
						nullterm(pm_obj_req->encounter.diagnosis[i].diag_ftdesc))
					set stat = uar_srvsetdouble(hencdiag,"contributor_system_cd",pm_obj_req->encounter.diagnosis[i].contributor_system_cd)
					;set 114609_req->person.encounter.diagnosis_01.data_status_cd
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencdiag: ",diagVar)
					return
				endif
			endfor
		endif
 
		;Encounter Accidents
		call echo("Encounter Accidents")
		set eaSize = size(pm_obj_req->encounter.encntr_accident,5)
		if(eaSize > 0)
			declare accVar = vc
			for(i = 1 to eaSize)
				set accVar = build("accident_0",cnvtstring(i))
 
	 			set hencaccident = uar_srvgetstruct(hencounter,nullterm(accVar))
				if(hencaccident)
					set stat = uar_srvsetdouble(hencaccident,"encntr_accident_id",pm_obj_req->encounter.encntr_accident[i].encntr_accident_id)
					set stat = uar_srvsetdouble(hencaccident,"encntr_id",pm_obj_req->encounter.encntr_accident[i].encntr_id)
					set stat = uar_srvsetdate(hencaccident,"accident_dt_tm",
						cnvtdatetime(pm_obj_req->encounter.encntr_accident[i].accident_dt_tm))
					set stat = uar_srvsetdouble(hencaccident,"accident_cd",pm_obj_req->encounter.encntr_accident[i].accident_cd)
					set stat = uar_srvsetstring(hencaccident,"accident_loctn",
						nullterm(pm_obj_req->encounter.encntr_accident[i].accident_loctn))
					set stat = uar_srvsetstring(hencaccident,"accident_text",
						nullterm(pm_obj_req->encounter.encntr_accident[i].accident_text))
					set stat = uar_srvsetdouble(hencaccident,"acc_state_cd",pm_obj_req->encounter.encntr_accident[i].acc_state_cd)
					set stat = uar_srvsetdouble(hencaccident,"acc_job_related_cd",pm_obj_req->encounter.encntr_accident[i].acc_job_related_cd)
					set stat = uar_srvsetdouble(hencaccident,"acc_death_cd",pm_obj_req->encounter.encntr_accident[i].acc_death_cd)
					set stat = uar_srvsetdouble(hencaccident,"police_involve_cd",pm_obj_req->encounter.encntr_accident[i].police_involve_cd)
					set stat = uar_srvsetdouble(hencaccident,"police_force_cd",pm_obj_req->encounter.encntr_accident[i].police_force_cd)
					set stat = uar_srvsetstring(hencaccident,"police_badge_nbr",
						nullterm(pm_obj_req->encounter.encntr_accident[i].police_badge_nbr))
					set stat = uar_srvsetdouble(hencaccident,"ambulance_arrive_cd",pm_obj_req->encounter.encntr_accident[i].ambulance_arrive_cd)
					set stat = uar_srvsetdouble(hencaccident,"ambulance_geo_cd",pm_obj_req->encounter.encntr_accident[i].ambulance_geo_cd)
					set stat = uar_srvsetstring(hencaccident,"ambulance_serv_nbr",
						nullterm(pm_obj_req->encounter.encntr_accident[i].ambulance_serv_nbr))
					set stat = uar_srvsetdouble(hencaccident,"acc_empl_org_id",pm_obj_req->encounter.encntr_accident[i].acc_empl_org_id)
					set stat = uar_srvsetdouble(hencaccident,"data_status_cd",pm_obj_req->encounter.encntr_accident[i].data_status_cd)
					set stat = uar_srvsetdouble(hencaccident,"place_cd",pm_obj_req->encounter.encntr_accident[i].place_cd)
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencaccident: ",accVar)
					return
				endif
			endfor
		endif
 
		;Encounter User Defined fields
		call echo("Encounter User Defined Fields")
	 	if(size(pm_obj_req->encounter.encntr_info,5) > 0)
	 		set stat = initrec(temp_userdef)
 
			select into "nl:"
			from(dummyt d with seq = size(pm_obj_req->encounter.encntr_info,5))
				, code_value_extension lvl
				, code_value_extension tpe
				, code_value_extension fld
			plan d where pm_obj_req->encounter.encntr_info[d.seq].info_type_cd in(c_userdefnum_info_type_cd,
					c_userdefstring_info_type_cd,c_userdefined_info_type_cd,c_userdefdate_info_type_cd)
			join lvl where lvl.code_value = pm_obj_req->encounter.encntr_info[d.seq].info_sub_type_cd
				and lvl.field_name = "LEVEL" and lvl.field_value = "ENCOUNTER"
			join tpe where tpe.code_value = lvl.code_value
				and tpe.field_name = "TYPE"
			join fld where fld.code_value = tpe.code_value
				and fld.field_name = "FIELD"
			head report
				x = 0
			detail
				x = x + 1
				stat = alterlist(temp_userdef->list,x)
 
				temp_userdef->list[x].name = fld.field_value
				temp_userdef->list[x].type = tpe.field_value
 
				case(tpe.field_value)
					of "CODE": temp_userdef->list[x].value_cd = pm_obj_req->encounter.encntr_info[d.seq].value_cd
					of "STRING": temp_userdef->list[x].value_text = pm_obj_req->encounter.encntr_info[d.seq].long_text
					of "NUMERIC": temp_userdef->list[x].value_numeric = pm_obj_req->encounter.encntr_info[d.seq].value_numeric
					of "DATE": temp_userdef->list[x].value_dt_tm = pm_obj_req->encounter.encntr_info[d.seq].value_dt_tm
				endcase
			foot report
				temp_userdef->list_cnt = x
			with nocounter
 
			if(temp_userdef->list_cnt > 0)
				set hencuserdef = uar_srvgetstruct(hencounter,"user_defined")
				if(hencuserdef)
					for(i = 1 to temp_userdef->list_cnt)
						case(temp_userdef->list[i].type)
							of "CODE": set stat = uar_srvsetdouble(hencuserdef,temp_userdef->list[i].name
								,temp_userdef->list[i].value_cd)
							of "STRING": set stat = uar_srvsetstring(hencuserdef,temp_userdef->list[i].name
								,nullterm(temp_userdef->list[i].value_text))
							of "NUMERIC": set stat = uar_srvsetdouble(hencuserdef,temp_userdef->list[i].name
								,temp_userdef->list[i].value_numeric)
							of "DATE": set stat = uar_srvsetdate(hencuserdef,temp_userdef->list[i].name
								,cnvtdatetime(temp_userdef->list[i].value_dt_tm))
						endcase
					endfor
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencuserdef.")
					return
				endif
			endif
		endif
 
		;Encounter Tracking - Ignored for now
 
		;Encounter Waitlist - Ignored for now
 
		;Encounter Alt Locations - Ignored for now
 
		;Encntr Condition Code
		call echo("Encntr Condition Code")
		set encCondSize = size(pm_obj_req->encounter.encntr_condition_code,5)
		if(encCondSize > 0)
			for(i = 1 to encCondSize)
				set henccond = uar_srvadditem(hencounter,"encntr_condition_code")
				set stat = uar_srvsetdouble(henccond,"condition_code_id",pm_obj_req->encounter.encntr_condition_code[i].condition_code_id)
				set stat = uar_srvsetdouble(henccond,"encntr_id",pm_obj_req->encounter.encntr_condition_code[i].encntr_id)
				set stat = uar_srvsetdouble(henccond,"condition_cd",pm_obj_req->encounter.encntr_condition_code[i].condition_cd)
				set stat = uar_srvsetlong(henccond,"sequence",pm_obj_req->encounter.encntr_condition_code[i].sequence)
			endfor
		endif
 
		;Encntr Value Code
		call echo("Encntr Value Code")
		set encValSize = size(pm_obj_req->encounter.encntr_value_code,5)
		if(encValSize > 0)
			for(i = 1 to encValSize)
				set hencvalcode = uar_srvadditem(hencounter,"encntr_value_code")
				set stat = uar_srvsetdouble(hencvalcode,"value_code_id",pm_obj_req->encounter.encntr_value_code[i].value_code_id)
				set stat = uar_srvsetdouble(hencvalcode,"encntr_id",pm_obj_req->encounter.encntr_value_code[i].encntr_id)
				set stat = uar_srvsetdouble(hencvalcode,"value_cd",pm_obj_req->encounter.encntr_value_code[i].value_cd)
				set stat = uar_srvsetlong(hencvalcode,"sequence",pm_obj_req->encounter.encntr_value_code[i].sequence)
				set stat = uar_srvsetdouble(hencvalcode,"amount",pm_obj_req->encounter.encntr_value_code[i].amount)
			endfor
		endif
 
		;Encntr Occurrence Code
		call echo("Encntr Occurrence Code")
		set encOccSize = size(pm_obj_req->encounter.encntr_occurrence_code,5)
		if(encOccSize > 0)
			for(i = 1 to encOccSize)
				set hencocccode = uar_srvadditem(hencounter,"encntr_occurrence_code")
				set stat = uar_srvsetdouble(hencocccode,"occurrence_code_id",pm_obj_req->encounter.encntr_occurrence_code[i].occurrence_code_id)
				set stat = uar_srvsetdouble(hencocccode,"encntr_id",pm_obj_req->encounter.encntr_occurrence_code[i].encntr_id)
				set stat = uar_srvsetdouble(hencocccode,"occurrence_cd",pm_obj_req->encounter.encntr_occurrence_code[i].occurrence_cd)
				set stat = uar_srvsetlong(hencocccode,"sequence",pm_obj_req->encounter.encntr_occurrence_code[i].sequence)
				set stat = uar_srvsetdate(hencocccode,"occurrence_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encntr_occurrence_code[i].occurrence_dt_tm))
				set stat = uar_srvsetdate(hencocccode,"beg_effective_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encntr_occurrence_code[i].beg_effective_dt_tm))
				set stat = uar_srvsetdate(hencocccode,"end_effective_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encntr_occurrence_code[i].end_effective_dt_tm))
			endfor
		endif
 
		;Encntr Span code
		call echo("Encntr Span Code")
		set encSpanSize = size(pm_obj_req->encounter.encntr_span_code,5)
		if(encSpanSize > 0)
			for(i = 1 to encSpanSize)
				set hencspancode = uar_srvadditem(hencounter,"encntr_span_code")
				set stat = uar_srvsetdouble(hencspancode,"span_code_id",pm_obj_req->encounter.encntr_span_code[i].span_code_id)
				set stat = uar_srvsetdouble(hencspancode,"encntr_id",pm_obj_req->encounter.encntr_span_code[i].encntr_id)
				set stat = uar_srvsetdouble(hencspancode,"span_cd",pm_obj_req->encounter.encntr_span_code[i].span_cd)
				set stat = uar_srvsetlong(hencspancode,"sequence",pm_obj_req->encounter.encntr_span_code[i].sequence)
				set stat = uar_srvsetdate(hencspancode,"span_from_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encntr_span_code[i].span_from_dt_tm))
				set stat = uar_srvsetdate(hencspancode,"span_to_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encntr_span_code[i].span_to_dt_tm))
			endfor
		endif
 
		; Encounter Episode
		call echo("Encntr Episode")
		set hencepisode = uar_srvgetstruct(hencounter,"episode")
		if(hencepisode)
			;set stat = uar_srvsetdouble(hencepisode,"template_used_ind)
			;set stat = uar_srvsetdouble(hencepisode,"end_effective_dt_tm)
			;set stat = uar_srvsetdouble(hencepisode,"beg_effective_dt_tm)
			set stat = uar_srvsetdouble(hencepisode,"episode_id",pm_obj_req->encounter.encounter.episode.episode_id)
			set stat = uar_srvsetdouble(hencepisode,"episode_encntr_id",pm_obj_req->encounter.encounter.episode.episode_encntr_id)
			set stat = uar_srvsetstring(hencepisode,"episode_display",
				nullterm(pm_obj_req->encounter.encounter.episode.episode_display))
			set stat = uar_srvsetdouble(hencepisode,"episode_type_cd",pm_obj_req->encounter.encounter.episode.episode_type_cd)
			set stat = uar_srvsetdate(hencepisode,"episode_breach_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.episode.episode_breach_dt_tm))
			set stat = uar_srvsetdouble(hencepisode,"episode_status_cd",pm_obj_req->encounter.encounter.episode.episode_status_cd)
			set stat = uar_srvsetdate(hencepisode,"episode_start_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.episode.episode_start_dt_tm))
			set stat = uar_srvsetdate(hencepisode,"episode_stop_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.episode.episode_stop_dt_tm))
			set stat = uar_srvsetlong(hencepisode,"episode_pause_days_cnt",pm_obj_req->encounter.encounter.episode.episode_pause_days_cnt)
			set stat = uar_srvsetlong(hencepisode,"days_till_breach_cnt",pm_obj_req->encounter.encounter.episode.days_till_breach_cnt)
			set stat = uar_srvsetdouble(hencepisode,"cancel_encntr_episode_id",
				pm_obj_req->encounter.encounter.episode.cancel_encntr_episode_id)
			set stat = uar_srvsetdouble(hencepisode,"refer_facility_cd",pm_obj_req->encounter.encounter.episode.refer_facility_cd)
			set stat = uar_srvsetdouble(hencepisode,"service_category_cd",pm_obj_req->encounter.encounter.episode.service_category_cd)
 
			set hencepattend = uar_srvgetstruct(hencounter,"attenddoc")
			set stat = uar_srvsetdouble(hencepattend,"prsnl_person_id",
				pm_obj_req->encounter.encounter.episode.attenddoc.prsnl_person_id)
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencepisode.")
			return
		endif
 
		;Encounter Leave
		call echo("Encntr Leave")
		set hencleave = uar_srvgetstruct(hencounter,"encntr_leave")
		if(hencleave)
			;set stat = uar_srvsetdouble(hencleave,"action",	--Not used)
			set stat = uar_srvsetdouble(hencleave,"encntr_leave_id",pm_obj_req->encounter.encntr_leave.encntr_leave_id)
			set stat = uar_srvsetdouble(hencleave,"encntr_id",pm_obj_req->encounter.encntr_leave.encntr_id)
			set stat = uar_srvsetstring(hencleave,"leave_comment",
				nullterm(pm_obj_req->encounter.encntr_leave.leave_comment))
			set stat = uar_srvsetdate(hencleave,"leave_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.leave_dt_tm))
			set stat = uar_srvsetshort(hencleave,"leave_ind",pm_obj_req->encounter.encntr_leave.leave_ind)
			set stat = uar_srvsetstring(hencleave,"leave_location",
				nullterm(pm_obj_req->encounter.encntr_leave.leave_location))
			set stat = uar_srvsetdouble(hencleave,"leave_reason_cd",pm_obj_req->encounter.encntr_leave.leave_reason_cd)
			set stat = uar_srvsetdouble(hencleave,"leave_user_id",pm_obj_req->encounter.encntr_leave.leave_user_id)
			set stat = uar_srvsetdate(hencleave,"est_return_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.est_return_dt_tm))
			set stat = uar_srvsetstring(hencleave,"return_comment",
				nullterm(pm_obj_req->encounter.encntr_leave.return_comment))
			set stat = uar_srvsetdate(hencleave,"return_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.return_dt_tm))
			set stat = uar_srvsetdouble(hencleave,"location_cd",pm_obj_req->encounter.encntr_leave.location_cd)
			set stat = uar_srvsetdouble(hencleave,"loc_facility_cd",pm_obj_req->encounter.encntr_leave.loc_facility_cd)
			set stat = uar_srvsetdouble(hencleave,"loc_building_cd",pm_obj_req->encounter.encntr_leave.loc_building_cd)
			set stat = uar_srvsetdouble(hencleave,"loc_nurse_unit_cd",pm_obj_req->encounter.encntr_leave.loc_nurse_unit_cd)
			set stat = uar_srvsetdouble(hencleave,"loc_room_cd",pm_obj_req->encounter.encntr_leave.loc_room_cd)
			set stat = uar_srvsetdouble(hencleave,"loc_bed_cd",pm_obj_req->encounter.encntr_leave.loc_bed_cd)
			set stat = uar_srvsetdouble(hencleave,"return_reason_cd",pm_obj_req->encounter.encntr_leave.return_reason_cd)
			set stat = uar_srvsetdouble(hencleave,"return_user_id",pm_obj_req->encounter.encntr_leave.return_user_id)
			set stat = uar_srvsetstring(hencleave,"cancel_comment",
				nullterm(pm_obj_req->encounter.encntr_leave.cancel_comment))
			set stat = uar_srvsetdate(hencleave,"cancel_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.cancel_dt_tm))
			set stat = uar_srvsetdouble(hencleave,"cancel_reason_cd",pm_obj_req->encounter.encntr_leave.cancel_reason_cd)
			set stat = uar_srvsetdouble(hencleave,"cancel_user_id",pm_obj_req->encounter.encntr_leave.cancel_user_id)
			set stat = uar_srvsetdouble(hencleave,"contact_list_cd",pm_obj_req->encounter.encntr_leave.contact_list_cd)
			set stat = uar_srvsetdouble(hencleave,"leave_type_cd",pm_obj_req->encounter.encntr_leave.leave_type_cd)
			set stat = uar_srvsetdate(hencleave,"hold_rmvl_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.hold_rmvl_dt_tm))
			set stat = uar_srvsetdate(hencleave,"auto_disch_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encntr_leave.auto_disch_dt_tm))
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencleave.")
			return
		endif
 
	 	;Encounter ACP
	 	call echo("Encntr ACP")
	 	set acpSize = size(pm_obj_req->encounter.ACP,5)
	 	if(acpSize > 0)
	 		for(i = 1 to acpSize)
	 			set hencacp = uar_srvadditem(hencounter,"ACP")
	 			if(hencap)
		 			;set stat = uar_srvsetdouble(hencacp,"augm_care_period_status_cd",--Not used)
		 			set stat = uar_srvsetdouble(hencacp,"encntr_augm_care_period_id",pm_obj_req->encounter.ACP[i].encntr_augm_care_period_id)
		 			set stat = uar_srvsetdouble(hencacp,"encntr_id",pm_obj_req->encounter.ACP[i].encntr_id)
		 			set stat = uar_srvsetdouble(hencacp,"person_id",pm_obj_req->encounter.ACP[i].person_id)
		 			set stat = uar_srvsetdouble(hencacp,"augm_care_period_plan_cd",pm_obj_req->encounter.ACP[i].augm_care_period_plan_cd)
		 			set stat = uar_srvsetdouble(hencacp,"augm_medical_service_cd",pm_obj_req->encounter.ACP[i].augm_medical_service_cd)
		 			set stat = uar_srvsetlong(hencacp,"num_organ_sys_support_nbr",pm_obj_req->encounter.ACP[i].num_organ_sys_support_nbr)
		 			set stat = uar_srvsetlong(hencacp,"high_depend_care_lvl_days",pm_obj_req->encounter.ACP[i].high_depend_care_lvl_days)
		 			set stat = uar_srvsetlong(hencacp,"intensive_care_lvl_days",pm_obj_req->encounter.ACP[i].intensive_care_lvl_days)
		 			set stat = uar_srvsetdouble(hencacp,"augm_care_period_source_cd",pm_obj_req->encounter.ACP[i].augm_care_period_source_cd)
		 			set stat = uar_srvsetdouble(hencacp,"augm_care_period_disposal_cd",pm_obj_req->encounter.ACP[i].augm_care_period_disposal_cd)
	 			else
		 			set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencap.")
					return
				endif
	 		endfor
	 	endif
 
		;Encounter service_alloc
		call echo("Encounter service_alloc")
		set hencsvcalloc = uar_srvgetstruct(hencounter,"service_alloc")
		if(hencsvcalloc)
			set stat = uar_srvsetstring(hencsvcalloc,"service_line_agreement",
				nullterm(pm_obj_req->encounter.service_alloc.service_line_agreement))
			set stat = uar_srvsetstring(hencsvcalloc,"commissioner_code",
				nullterm(pm_obj_req->encounter.service_alloc.commissioner_code))
			set stat = uar_srvsetstring(hencsvcalloc,"commissioner_name",
				nullterm(pm_obj_req->encounter.service_alloc.commissioner_name))
			set stat = uar_srvsetdouble(hencsvcalloc,"commissioner_id",pm_obj_req->encounter.service_alloc.commissioner_id)
			set stat = uar_srvsetdouble(hencsvcalloc,"benefit_alloc_id",pm_obj_req->encounter.service_alloc.benefit_alloc_id)
			set stat = uar_srvsetdouble(hencsvcalloc,"eem_benefit_id",pm_obj_req->encounter.service_alloc.eem_benefit_id)
			set stat = uar_srvsetdouble(hencsvcalloc,"contract_id",pm_obj_req->encounter.service_alloc.contract_id)
			set stat = uar_srvsetstring(hencsvcalloc,"contract_name",
				nullterm(pm_obj_req->encounter.service_alloc.contract_name))
			set stat = uar_srvsetshort(hencsvcalloc,"nca_ind",pm_obj_req->encounter.service_alloc.nca_ind)
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencsvcalloc.")
			return
		endif
 
		;Encounter location_capacity
		call echo("Encounter location_capacity")
		set hencloccap = uar_srvgetstruct(hencounter,"location_capacity")
		if(hencloccap)
			set stat = uar_srvsetdate(hencloccap,"begin_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.begin_dt_tm))
			set stat = uar_srvsetdate(hencloccap,"end_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.end_dt_tm))
			set stat = uar_srvsetdouble(hencloccap,"booking_id",pm_obj_req->encounter.encounter.location_capacity.booking_id)
			set stat = uar_srvsetdate(hencloccap,"booking_beg_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.booking_beg_dt_tm))
			set stat = uar_srvsetdate(hencloccap,"booking_end_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.booking_end_dt_tm))
			set stat = uar_srvsetdouble(hencloccap,"pend_booking_id",pm_obj_req->encounter.encounter.location_capacity.pend_booking_id)
			set stat = uar_srvsetdate(hencloccap,"pend_booking_beg_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.pend_booking_beg_dt_tm))
			set stat = uar_srvsetdate(hencloccap,"pend_booking_end_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.location_capacity.pend_booking_end_dt_tm))
	 	else
	 		set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencloccap.")
			return
	 	endif
 
		;Encounter reltn_encntrs
		call echo("Encounter reltn_encntrs")
		set relEncSize = size(pm_obj_req->encounter.encounter.reltn_encntrs,5)
		if(relEncSize > 0)
			for(i = 1 to relEncSize)
				set hencrelencntr = uar_srvadditem(hencounter,"reltn_encntrs")
				if(hencrelencntr)
					set stat = uar_srvsetdouble(hencrelencntr,"encntr_id",pm_obj_req->encounter.encounter.reltn_encntrs[i].encntr_id)
				else
			 		set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencrelencntr.")
					return
			 	endif
			endfor
		endif
 
		;Episode Activity
      	;set 114609_req->person.encounter.episode_activity	--Not used
 
		;set 114609_req->person.encounter.remove_newborn_flag	--Not used
		set stat = uar_srvsetdate(hencounter,"expected_delivery_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.expected_delivery_dt_tm))
		set stat = uar_srvsetdate(hencounter,"last_menstrual_period_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.last_menstrual_period_dt_tm))
		set stat = uar_srvsetdate(hencounter,"onset_dt_tm",
			cnvtdatetime(pm_obj_req->encounter.encounter.onset_dt_tm))
		set stat = uar_srvsetdouble(hencounter,"level_of_service_cd",pm_obj_req->encounter.encounter.level_of_service_cd)
		set stat = uar_srvsetdouble(hencounter,"pregnancy_status_cd",pm_obj_req->encounter.encounter.pregnancy_status_cd)
		set stat = uar_srvsetshort(hencounter,"encntr_code_value_r_ind",pm_obj_req->encounter.encounter.encntr_code_value_r_ind)
 
		;Encounter service_type
	 	;set 114609_req->person.encounter.service_type --Not used
 
		;Encncntr care_mgmt
		call echo("Encounter care_mgmt")
		set henccarmgmt = uar_srvgetstruct(hencounter,"location_capacity")
		if(henccarmgmt)
			set stat = uar_srvsetdouble(henccarmgmt,"encntr_care_mgmt_id",
				pm_obj_req->encounter.encounter.encntr_care_mgmt.encntr_care_mgmt_id)
			set stat = uar_srvsetdouble(henccarmgmt,"utlztn_mgmt_status_cd",
				pm_obj_req->encounter.encounter.encntr_care_mgmt.utlztn_mgmt_status_cd)
			set stat = uar_srvsetdate(henccarmgmt,"clinical_review_due_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.encntr_care_mgmt.clinical_review_due_dt_tm))
			set stat = uar_srvsetdouble(henccarmgmt,"disch_plan_status_cd",
				pm_obj_req->encounter.encounter.encntr_care_mgmt.disch_plan_status_cd)
			set stat = uar_srvsetdate(henccarmgmt,"disch_plan_due_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.encntr_care_mgmt.disch_plan_due_dt_tm))
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencrelencntr.")
			return
		endif
 
		;Encntr suspensions
		call echo("Encounter suspensions")
		set stat = uar_srvsetlong(hencounter,"suspensions_ind",pm_obj_req->encounter.encounter.suspensions_ind)
	  	if(pm_obj_req->encounter.encounter.suspensions_ind > 0)
			set hencsuspension = uar_srvgetstruct(hencounter,"suspensions")
			if(hencsuspension)
				set suspSize = size(pm_obj_req->encounter.encounter.suspensions.suspensions_list,5)
				if(suspSize > 0)
					for(i = 1 to suspSize)
						set hencsusplist = uar_srvadditem(hencsuspension,"suspension_list")
		    			set stat = uar_srvsetlong(hencsusplist,"action_flag",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].action_flag)
		    			set stat = uar_srvsetdouble(hencsusplist,"pm_wait_list_id",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].pm_wait_list_id)
		    			set stat = uar_srvsetdouble(hencsusplist,"pm_wait_list_status_id",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].pm_wait_list_status_id)
		    			set stat = uar_srvsetdate(hencsusplist,"status_dt_tm",
							cnvtdatetime(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].status_dt_tm))
		    			set stat = uar_srvsetdate(hencsusplist,"status_end_dt_tm",
							cnvtdatetime(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].status_end_dt_tm))
		    			set stat = uar_srvsetdouble(hencsusplist,"reason_for_change_cd",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].reason_for_change_cd)
		    			set stat = uar_srvsetdouble(hencsusplist,"status_cd",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].status_cd)
		    			set stat = uar_srvsetstring(hencsusplist,"comments_text",
							nullterm(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].comments_text))
		    			set stat = uar_srvsetdate(hencsusplist,"updt_dt_tm",
							cnvtdatetime(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].updt_dt_tm))
		    			set stat = uar_srvsetdouble(hencsusplist,"comment_long_text_id",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].comment_long_text_id)
		    			set stat = uar_srvsetdouble(hencsusplist,"updt_id",
		    				pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].updt_id)
		    			set stat = uar_srvsetstring(hencsusplist,"username",
							nullterm(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].username))
		    			set stat = uar_srvsetdate(hencsusplist,"status_review_dt_tm",
							cnvtdatetime(pm_obj_req->encounter.encounter.suspensions.suspensions_list[i].status_review_dt_tm))
					endfor
				endif
			else
				set pm_obj_rep->status_data.status = "F"
				set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencsuspension.")
				return
			endif
		endif
 
		;Encntr place_of_service
		call echo("Encounter place_of_service")
		set hencpos = uar_srvgetstruct(hencounter,"place_of_service")
		if(hencpos)
			set stat = uar_srvsetdouble(hencpos,"organization_id",pm_obj_req->encounter.encounter.place_of_svc_org_id)
			set stat = uar_srvsetstring(hencpos,"ft_org_name",
				nullterm(pm_obj_req->encounter.encounter.place_of_svc_org_name))
			set stat = uar_srvsetdouble(hencpos,"type_cd",pm_obj_req->encounter.encounter.place_of_svc_type_cd)
			set stat = uar_srvsetdate(hencpos,"admit_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.encounter.place_of_svc_admit_dt_tm))
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencpos.")
			return
		endif
 
		;Encounter Patient Events
		call echo("Encounter Patient Events")
		set peSize = size(pm_obj_req->encounter.encounter.patient_events,5)
		if(peSize > 0)
			for(i = 1 to peSize)
				set hepatevents = uar_srvadditem(hencounter,"patient_events")
				set stat = uar_srvsetdouble(hepatevents,"patient_event_id",
					pm_obj_req->encounter.encounter.patient_events[i].patient_event_id)
				set stat = uar_srvsetdouble(hepatevents,"event_type_cd",
					pm_obj_req->encounter.encounter.patient_events[i].event_type_cd)
				set stat = uar_srvsetdate(hepatevents,"event_dt_tm",
					cnvtdatetime(pm_obj_req->encounter.encounter.patient_events[i].event_dt_tm))
				set stat = uar_srvsetstring(hepatevents,"action",
					nullterm(pm_obj_req->encounter.encounter.patient_events[i].action))
			endfor
		endif
 
		;Social HealthCare
		call echo("Social HealthCare")
		set hencsochc = uar_srvgetstruct(hencounter,"social_healthcare")
		if(hencsochc)
			set stat = uar_srvsetdouble(hencsochc,"verify_status_cd",pm_obj_req->encounter.social_healthcare.verify_status_cd)
			set stat = uar_srvsetdouble(hencsochc,"verify_source_cd",pm_obj_req->encounter.social_healthcare.verify_source_cd)
			set stat = uar_srvsetdouble(hencsochc,"verify_prsnl_id",pm_obj_req->encounter.social_healthcare.verify_prsnl_id)
			set stat = uar_srvsetdate(hencsochc,"verify_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.social_healthcare.verify_dt_tm))
			set stat = uar_srvsetdouble(hencsochc,"social_healthcare_id",pm_obj_req->encounter.social_healthcare.social_healthcare_id)
			set stat = uar_srvsetdate(hencsochc,"eligibility_expire_dt_tm",
				cnvtdatetime(pm_obj_req->encounter.social_healthcare.eligibility_expire_dt_tm))
			set stat = uar_srvsetdouble(hencsochc,"eligibility_status_cd",pm_obj_req->encounter.social_healthcare.eligibility_status_cd)
			;set 114609_req->person.encounter.social_healthcare.social_healthcare_detail	--Not used
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hencsochc.")
			return
		endif
 		;End encounter
 
		;Questionnaire_01
		call echo("Questionnaire")
		set questSize = size(pm_obj_req->person.questionnaire,5)
		if(questSize > 0)
			declare questVar = vc
			for(i = 1 to questSize)
				set questVar = build("questionnaire_0",cnvtstring(i))
				set hquestion = uar_srvgetstruct(hperson,questVar)
				if(hquestion)
					set stat = uar_srvsetdouble(hquestion,"questionnaire_id",pm_obj_req->person.questionnaire[i].questionnaire_id)
					set stat = uar_srvsetstring(hquestion,"parent_entity_name",
						nullterm(pm_obj_req->person.questionnaire[i].parent_entity_name))
					set stat = uar_srvsetdouble(hquestion,"parent_entity_id",pm_obj_req->person.questionnaire[i].parent_entity_id)
					set stat = uar_srvsetstring(hquestion,"completed_by",
						nullterm(pm_obj_req->person.questionnaire[i].completed_by))
					set stat = uar_srvsetdate(hquestion,"completed_date",
						cnvtdatetime(pm_obj_req->person.questionnaire[i].completed_date))
					set stat = uar_srvsetstring(hquestion,"reviewed_by",
						nullterm(pm_obj_req->person.questionnaire[i].reviewed_by))
					set stat = uar_srvsetdate(hquestion,"reviewed_date",
						cnvtdatetime(pm_obj_req->person.questionnaire[i].reviewed_date))
					set stat = uar_srvsetdouble(hquestion,"status_cd",pm_obj_req->person.questionnaire[i].status_cd)
 
					;Questions
					set qSize = size(pm_obj_req->person.questionnaire[i].questions,5)
					if(qSize > 0)
						for(q = 1 to qSize)
							set hquests = uar_srvadditem(hquestion,"questions")
							if(hquests)
								set stat = uar_srvsetdouble(hquests,"question_id",pm_obj_req->person.questionnaire[i].questions[q].question_id)
								set stat = uar_srvsetstring(hquests,"value_type",
									nullterm(pm_obj_req->person.questionnaire[i].questions[q].value_type))
								set stat = uar_srvsetdouble(hquests,"value_nbr",pm_obj_req->person.questionnaire[i].questions[q].value_nbr)
								set stat = uar_srvsetdate(hquests,"value_dt_tm",
									cnvtdatetime(pm_obj_req->person.questionnaire[i].questions[q].value_dt_tm))
								set stat = uar_srvsetdouble(hquests,"value_cd",pm_obj_req->person.questionnaire[i].questions[q].value_cd)
								set stat = uar_srvsetstring(hquests,"value_text",
									nullterm(pm_obj_req->person.questionnaire[i].questions[q].value_text))
								set stat = uar_srvsetshort(hquests,"value_ind",pm_obj_req->person.questionnaire[i].questions[q].value_ind)
								set stat = uar_srvsetlong(hquests,"value_chc",pm_obj_req->person.questionnaire[i].questions[q].value_chc)
								set stat = uar_srvsetstring(hquests,"question_meaning",
									nullterm(pm_obj_req->person.questionnaire[i].questions[q].question_meaning))
							else
								set pm_obj_rep->status_data.status = "F"
								set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hquests.")
								return
							endif
						endfor
					endif
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hquestion: ",questVar)
					return
				endif
			endfor
		endif
 
		;Image
		call echo("Image")
		if(pm_obj_req->person_image.exists_ind > 0)
			set himage = uar_srvgetstruct(hperson,"image")
			if(himage)
				set hpic = uar_srvgetstruct(himage,"pic_01")
				if(hpic)
					;set stat = uar_srvsetshort("hpic",modified_ind",NOT USED)
					set stat = uar_srvsetshort(hpic,"exists_ind",pm_obj_req->person_image.exists_ind)
					set stat = uar_srvsetstring(hpic,"long_blob",nullterm(pm_obj_req->person_image.long_blob))
				else
					set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpic.")
					return
				endif
			else
				set pm_obj_rep->status_data.status = "F"
				set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create himage.")
				return
			endif
		endif
 
		;set pm_obj_req->person.track1 --Not used
		;set pm_obj_req->person.track1 --Not used
 
	 	;eemtransaction
	 	call echo("EEMTransaction")
	 	set eemSize = size(pm_obj_req->person.eemtransaction.transaction,5)
	 	if(eemSize > 0)
	 		set heemtrans = uar_srvgetstruct(hperson,"eemtransaction")
	 		if(heemtrans)
	 			for(i = 1 to eemSize)
	 				set heemtranslist = uar_srvadditem(heemtrans,"transaction")
	 				set stat = uar_srvsetdouble(heemtranslist,"interchange_id",pm_obj_req->person.eemtransaction.transaction[i].interchange_id)
	 				set stat = uar_srvsetdouble(heemtranslist,"transaction_cd",pm_obj_req->person.eemtransaction.transaction[i].transaction_cd)
	 			endfor
	 		else
	 			set pm_obj_rep->status_data.status = "F"
				set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create heemtrans.")
				return
	 		endif
	 	endif
 
	 	;Removed Reltns
	 	set rmSize = size(pm_obj_req->person.removed_reltns,5)
	 	if(rmSize > 0)
	 		for(i = 1 to rmSize)
	 			set hremreltn = uar_srvadditem(hperson,"removed_reltns")
	 			if(hremreltn)
	 				set stat = uar_srvsetdouble(heemtranslist,"person_person_reltn_id",
	 					pm_obj_req->person.removed_reltns[i].person_person_reltn_id)
	 				set stat = uar_srvsetdouble(heemtranslist,"related_person_id",
	 					pm_obj_req->person.removed_reltns[i].related_person_id)
	 				set stat = uar_srvsetdouble(heemtranslist,"person_reltn_cd",
	 					pm_obj_req->person.removed_reltns[i].person_reltn_cd)
	 				set stat = uar_srvsetdouble(heemtranslist,"related_person_reltn_cd",
	 					pm_obj_req->person.removed_reltns[i].related_person_reltn_cd)
	 				set stat = uar_srvsetdouble(heemtranslist,"family_reltn_sub_type_cd",
	 					pm_obj_req->person.removed_reltns[i].family_reltn_sub_type_cd)
	 				set stat = uar_srvsetshort(heemtranslist,"removed_reltn",
	 					pm_obj_req->person.removed_reltns[i].removed_reltn)
	 				set stat = uar_srvsetshort(heemtranslist,"removed_suggest_reltn",
	 					pm_obj_req->person.removed_reltns[i].removed_suggest_reltn)
	 			else
	 				set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hremreltn.")
					return
	 			endif
	 		endfor
	 	endif
 
 
	 	;Lock key ids - Ignored for wnow
	 	;set 114609_req->person.main_pat_enabled --Not used
	 	;set 114609_req->person.phone_viewer_ind --Not used
	 	;set 114609_req->person.address_viewer_ind --Not used
	 	;Health Card name - ignored for now
	 	;ABN checks - ignored for now
 
	 	;Race list
	 	call echo("Race list")
	 	set stat = uar_srvsetshort(hperson,"race_list_ind",pm_obj_req->person.person.race_list_ind)
	 	set raceSize = size(pm_obj_req->person.person.race_list,5)
	 	if(raceSize > 0)
	 		for(i = 1 to raceSize)
	 			set hracelist = uar_srvadditem(hperson,"race_list")
	 			if(hracelist)
	 				set stat = uar_srvsetdouble(hracelist,"value_cd",pm_obj_req->person.person.race_list[i].value_cd)
	 			else
	 				set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hracelist.")
					return
	 			endif
	 		endfor
	 	endif
 
	 	;Social healthcare
	 	call echo("Social Healthcare")
	 	set hpersocial = uar_srvgetstruct(hperson,"social_healthcare")
	 	if(hpersocial)
	 		set stat = uar_srvsetdouble(hpersocial,"verify_status_cd",pm_obj_req->person.social_healthcare.verify_status_cd)
	 		set stat = uar_srvsetdouble(hpersocial,"verify_source_cd",pm_obj_req->person.social_healthcare.verify_source_cd)
	 		set stat = uar_srvsetdouble(hpersocial,"verify_prsnl_id",pm_obj_req->person.social_healthcare.verify_prsnl_id)
	 		set stat = uar_srvsetdate(hpersocial,"verify_dt_tm",
	 			cnvtdatetime(pm_obj_req->person.social_healthcare.verify_dt_tm))
	 		set stat = uar_srvsetdouble(hpersocial,"social_healthcare_id",pm_obj_req->person.social_healthcare.social_healthcare_id)
	 		set stat = uar_srvsetdate(hpersocial,"eligibility_expire_dt_tm",
	 			cnvtdatetime(pm_obj_req->person.social_healthcare.eligibility_expire_dt_tm))
	 		set stat = uar_srvsetdouble(hpersocial,"eligibility_status_cd",pm_obj_req->person.social_healthcare.eligibility_status_cd)
	 		;set stat = uar_srvsetdouble(hpersocial,"social_healthcare_detail",NOT USED)
	 	else
	 		set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hpersocial.")
			return
	 	endif
 
	 	;Ethnic Group List
	 	call echo("Ethnic Group List")
	 	set stat = uar_srvsetshort(hperson,"ethnic_grp_list_ind",pm_obj_req->person.person.ethnic_grp_list_ind)
	 	set ethnicSize = size(pm_obj_req->person.person.ethnic_grp_list,5)
	 	if(ethnicSize > 0)
	 		for(i = 1 to ethnicSize)
	 			set hethniclist = uar_srvadditem(hperson,"ethnic_grp_list")
	 			if(hethniclist)
	 				set stat = uar_srvsetdouble(hethniclist,"value_cd",pm_obj_req->person.person.ethnic_grp_list[i].value_cd)
	 			else
	 				set pm_obj_rep->status_data.status = "F"
					set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hethniclist.")
					return
	 			endif
	 		endfor
	 	endif
 
	 	;Constenst status list - Ignored for now
	 	;set 114609_req->person.new_general_comment_txt --Not used
 
	 	;New questionnaire
	 	call echo("New Questionnaire")
	 	if(pm_obj_req->person.new_questionnaire.questionnaire_id > 0)
	 		set hnewquestionnaire = uar_srvgetstruct(hperson,"new_questionnaire")
	 		if(hnewquestionnaire)
	 			set stat = uar_srvsetdouble(hnewquestionnaire,"questionnaire_id",pm_obj_req->person.new_questionnaire.questionnaire_id)
	 			set stat = uar_srvsetstring(hnewquestionnaire,"parent_entity_name",
	 				nullterm(pm_obj_req->person.new_questionnaire.parent_entity_name))
	 			set stat = uar_srvsetdouble(hnewquestionnaire,"parent_entity_id",pm_obj_req->person.new_questionnaire.parent_entity_id)
	 			set stat = uar_srvsetstring(hnewquestionnaire,"completed_by",
	 				nullterm(pm_obj_req->person.new_questionnaire.completed_by))
	 			set stat = uar_srvsetdate(hnewquestionnaire,"completed_date",
	 				cnvtdatetime(pm_obj_req->person.new_questionnaire.completed_date))
	 			set stat = uar_srvsetstring(hnewquestionnaire,"reviewed_by",
	 				nullterm(pm_obj_req->person.new_questionnaire.reviewed_by))
	 			set stat = uar_srvsetdate(hnewquestionnaire,"reviewed_date",
	 				cnvtdatetime(pm_obj_req->person.new_questionnaire.reviewed_date))
	 			set stat = uar_srvsetdouble(hnewquestionnaire,"status_cd",pm_obj_req->person.new_questionnaire.status_cd)
 
 				;Questions
	 			set qSize = size(pm_obj_req->person.new_questionnaire.questions,5)
	 			if(qSize > 0)
					for(q = 1 to qSize)
						set hnewquests = uar_srvadditem(hnewquestionnaire,"questions")
						if(hnewquests)
							set stat = uar_srvsetdouble(hnewquests,"question_id",pm_obj_req->person.new_questionnaire.questions[q].question_id)
							set stat = uar_srvsetstring(hnewquests,"value_type",
								nullterm(pm_obj_req->person.new_questionnaire.questions[q].value_type))
							set stat = uar_srvsetdouble(hnewquests,"value_nbr",pm_obj_req->person.new_questionnaire.questions[q].value_nbr)
							set stat = uar_srvsetdate(hnewquests,"value_dt_tm",
								cnvtdatetime(pm_obj_req->person.new_questionnaire.questions[q].value_dt_tm))
							set stat = uar_srvsetdouble(hnewquests,"value_cd",pm_obj_req->person.new_questionnaire.questions[q].value_cd)
							set stat = uar_srvsetstring(hnewquests,"value_text",
								nullterm(pm_obj_req->person.new_questionnaire.questions[q].value_text))
							set stat = uar_srvsetshort(hnewquests,"value_ind",pm_obj_req->person.new_questionnaire.questions[q].value_ind)
							set stat = uar_srvsetlong(hnewquests,"value_chc",pm_obj_req->person.new_questionnaire.questions[q].value_chc)
							set stat = uar_srvsetstring(hnewquests,"question_meaning",
								nullterm(pm_obj_req->person.new_questionnaire.questions[q].question_meaning))
						else
							set pm_obj_rep->status_data.status = "F"
							set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hnewquests.")
							return
						endif
					endfor
				endif
	 		else
	 			set pm_obj_rep->status_data.status = "F"
				set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hnewquestionnaire.")
				return
	 		endif
	 	endif
 
	 	;Person military
	 	call echo("Person Military")
	 	set hpersmilitary = uar_srvgetstruct(hperson,"person_military")
	 	if(hpersmilitary)
	 		set hpermassignunit = uar_srvgetstruct(hperson,"assigned_unit")
	 		set stat = uar_srvsetdouble(hpermassignunit,"org_id",pm_obj_req->person.person.person_military.assigned_unit_org_id)
	 		set stat = uar_srvsetstring(hpermassignunit,"org_name",
	 			nullterm(pm_obj_req->person.person.person_military.assigned_unit_org_name))
 
	 		set hpermattachunit = uar_srvgetstruct(hperson,"attached_unit")
	 		set stat = uar_srvsetdouble(hpermattachunit,"org_id",pm_obj_req->person.person.person_military.attached_unit_org_id)
	 		set stat = uar_srvsetstring(hpermattachunit,"org_name",
	 			nullterm(pm_obj_req->person.person.person_military.attached_unit_org_name))
 
	 		set stat = uar_srvsetdouble(hpersmilitary,"command_security_cd",pm_obj_req->person.person.person_military.command_security_cd)
	 		set stat = uar_srvsetdouble(hpersmilitary,"flying_status_cd",pm_obj_req->person.person.person_military.flying_status_cd)
	 	else
	 		set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hnewquestionnaire.")
			return
	 	endif
 
	 	;Data not collected
	 	call echo("Data not collected")
	 	set hdatanotcoll = uar_srvgetstruct(hperson,"data_not_collected")
	 	if(hdatanotcoll)
			set stat = uar_srvsetdouble(hdatanotcoll,"home_address_cd",pm_obj_req->person.person.data_not_collected.home_address_cd)
			set stat = uar_srvsetdouble(hdatanotcoll,"home_email_cd",pm_obj_req->person.person.data_not_collected.home_email_cd)
			set stat = uar_srvsetdouble(hdatanotcoll,"phone_cd",pm_obj_req->person.person.data_not_collected.phone_cd)
			set stat = uar_srvsetdouble(hdatanotcoll,"ssn_cd",pm_obj_req->person.person.data_not_collected.ssn_cd)
			set stat = uar_srvsetdouble(hdatanotcoll,"nhn_cd",pm_obj_req->person.person.data_not_collected.nhn_cd)
		else
			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hdatanotcoll.")
			return
		endif
 
	 	;Person portal invite
	 	call echo("Person Portal Invite")
	 	set hportal = uar_srvgetstruct(hperson,"person_portal_invite")
	 	if(hportal)
		 	set stat = uar_srvsetdouble(hportal,"person_portal_invite_id",pm_obj_req->person.person_portal_invite.person_portal_invite_id)
		 	set stat = uar_srvsetdouble(hportal,"challenge_question_cd",pm_obj_req->person.person_portal_invite.challenge_question_cd)
		 	set stat = uar_srvsetstring(hportal,"challenge_answer_txt",
		 		nullterm(pm_obj_req->person.person_portal_invite.challenge_answer_txt))
		 	set stat = uar_srvsetdouble(hportal,"invite_action_cd",pm_obj_req->person.person_portal_invite.invite_action_cd)
		 	;set stat = uar_srvsetdouble(hportal,"online_identity_link_status_cd",NOT USED)
		 	set stat = uar_srvsetdouble(hportal,"invite_status_cd",pm_obj_req->person.person_portal_invite.invite_status_cd)
		 	set stat = uar_srvsetdouble(hportal,"error_reason_cd",pm_obj_req->person.person_portal_invite.error_reason_cd)
 		else
 			set pm_obj_rep->status_data.status = "F"
			set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = build2("Could not create hportal.")
			return
 		endif
 
	 	;Patient events - Ignored
	 	;Prev person payment propensity - Ignored for now
 
	 	; Execute request
		set crmstatus = uar_crmperform (hstep)
		if (crmstatus = 0)
			set hreply = uar_crmgetreply (hstep)
			if (hreply > 0 )
				set pm_obj_rep->person_id = uar_srvgetdouble (hreply ,"person_id" )
		      	set pm_obj_rep->encntr_id = uar_srvgetdouble (hreply ,"encntr_id" )
		      	set pm_obj_rep->pm_hist_tracking_id = uar_srvgetdouble (hreply ,"pm_hist_tracking_id" )
		      	set hstatus_data = uar_srvgetstruct (hreply ,"status_data" )
		      	set pm_obj_rep->status_data.status = uar_srvgetstringptr (hstatus_data ,"status" )
		      	set subeventstatuscnt = uar_srvgetitemcount (hstatus_data ,"subeventstatus" )
		      	if(subeventstatuscnt > 0)
		       		set hsubeventstatus = uar_srvgetitem(hstatus_data,"subeventstatus",1)
		        	set pm_obj_rep->status_data.subeventstatus[1].operationname = uar_srvgetstringptr(hsubeventstatus,"OperationName")
		        	set pm_obj_rep->status_data.subeventstatus[1].operationstatus = uar_srvgetstringptr(hsubeventstatus,"OperationStatus")
		        	set pm_obj_rep->status_data.subeventstatus[1].targetobjectname = uar_srvgetstringptr(hsubeventstatus,"TargetObjectName")
		        	set pm_obj_rep->status_data.subeventstatus[1].targetobjectvalue =
		        		uar_srvgetstringptr(hsubeventstatus,"TargetObjectValue" )
		       endif
			else
				set error_msg = "ERR: Reply = null"
			endif
		else
			set error_msg = concat ("PERFORM=" ,cnvtstring (crmstatus ) )
		endif
	else
		set error_msg = "Could not create htask."
	endif
 
	if(error_msg != "None")
		set pm_obj_rep->status_data.status = "F"
		set pm_obj_rep->status_data.subeventstatus[1].OperationStatus = error_msg
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdatePersonData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
end go
 
 
 
 
