/*~BB~**********************************************************************************
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
*
  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name: snsro_post_encounter.prg
      Object name:      snsro_post_encounter
      Program purpose:  POST a new encounter in Millennium.
      Tables read:  	NONE
      Tables updated:   ENCOUNTER
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      	   *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 12/01/17 RJC					Initial Write
  002 01/29/18 RJC					Peer reviewer found bug with attending doc not posting correctly
  003 01/31/18 RJC					Peer reviewer found bug with bed location
  004 02/06/18 RJC					Updated error message for unsupported encounter type
  005 03/22/18 RJC					Added version code and copyright block
  006 03/26/18 RJC					Updated reqinfo->updt_id to user_id with parameters
  006 05/09/18 RJC					Moved GetDateTime function to snsro_common
 ***********************************************************************/
/************************************************************************/
drop program snsro_post_encounter go
create program snsro_post_encounter
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Json Args:" = ""				;Required
		, "Debug Flag:" = 1			;Optional
 
with OUTDEV, USERNAME, JSON, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;005
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record arglist
record arglist (
	1 patientId 		= vc						;Required
	1 patientIdType 	= vc						;Optional
	1 encounter
		2 encounterDateTime 	= vc				;Optional - set to now if not
		2 attendingProviderId 	= vc				;Required
		2 dischargeDateTime = vc					;Optional
		2 encounterStatusId 	= vc				;Optional
		2 encounterTypeId		= vc				;Required
		2 location
			3 bedId 			= vc				;Optional
			3 unitId 			= vc				;Required
			3 hospitalId 		= vc				;Required
			3 roomId 			= vc				;Optional
		2 medicalServiceId 		= vc				;Optional
		2 reasonForVisit 		= vc				;Optional
		2 patientClassId 		= vc				;Ignored. Set based on enc type
		2 admitPriorityId 		= vc				;Optional
		2 admitSourceId			= vc				;Optional
		2 encounterAlias 		= vc				;Ignored for now.
		2 guarantorId 			= vc				;Optional
		2 insurances[*]								;Optional
			3 companyId 		= vc
			3 eligibilityStatusId 	= vc
			3 eligibilityStatusDate = vc
			3 subscriber 		= vc
			3 policyNumber 		= vc
			3 patientRelationshipToSubscriber = vc
		2 financialNumber = vc						; Ignored - This is automatically generated.
)
 
free record insurances
record insurances (
	1 qual[*]
		2 companyId 			= f8
		2 eligStatusCd		 	= f8
		2 eligStatusDate		= dq8
		2 subscriber 			= f8
		2 policyNumber 			= vc
		2 patientReltnToSubscriberCd	= f8
)
 
free record 112505_req
record 112505_req (
  1 org [*]
    2 organization_id = f8
  1 alias_entity_names [*]
    2 alias_entity_name = vc
)
 
free record 112505_rep
record 112505_rep (
  1 org_qual = i4
  1 org [*]
    2 organization_id = f8
    2 alias_cnt = i4
    2 alias [*]
      3 alias_pool_cd = f8
      3 alias_pool_disp = vc
      3 alias_entity_name = vc
      3 alias_entity_alias_type_cd = f8
      3 alias_entity_alias_type_disp = vc
      3 alias_entity_alias_type_mean = vc
      3 updt_cnt = i4
      3 description = vc
      3 numeric_ind = i2
      3 duplicates_allowed_cd = f8
      3 duplicates_allowed_disp = vc
      3 format_mask = vc
      3 check_digit_method_cd = f8
      3 check_digit_method_disp = vc
      3 system_assign_cd = f8
      3 system_assign_disp = vc
      3 prefix_numeric_ind = i2
      3 prefix_length = i4
      3 prefix_default = vc
      3 suffix_numeric_ind = i2
      3 suffix_length = i4
      3 suffix_default = vc
      3 active_ind = i2
      3 dup_allowed_flag = i2
      3 sys_assign_flag = i2
      3 unique_ind = i2
      3 alias_method_cd = f8
      3 alias_method_disp = vc
      3 alias_method_mean = vc
      3 alias_pool_ext_cd = f8
      3 alias_pool_ext_disp = vc
      3 mnemonic = vc
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  1 mnemonic_exists_ind = i2
)
 
free record 114327_req
record 114327_req (
  1 parent_entity_id = f8
  1 parent_entity_name = c32
  1 alias_type_meaning = c12
  1 organization_id = f8
  1 alias_pool_cd = f8
  1 alias_entity_type_cd = f8
  1 alias = vc
  1 action_type = c3
  1 seq_type_name = c32
  1 person_id = f8
  1 encntr_type_cd = f8
)
 
free record 114327_rep
record 114327_rep (
	1 alias_info [* ]
      2 parent_entity_id = f8
      2 alias = vc
      2 alias_pool_cd = f8
      2 alias_format = vc
      2 alias_type_cd = f8
      2 alias_sub_type_cd = f8
      2 check_digit = i2
      2 check_digit_method_cd = f8
      2 organization_id = f8
      2 visit_seq_number = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
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
 
free record structure_map
record structure_map (
	1 addresses[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 phones[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 aliases[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 names[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 prsnl[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 orgs[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
	1 reltn[*]
		2 struct_name = vc
		2 code_value = f8
		2 code_display = vc
)
 
free record 3200154_req
record 3200154_req (
  1 transaction_type = i2
  1 log_req_ind = i2
  1 transaction_info
    2 unauthentication_flag = i2
    2 transaction_reason_cd = f8
    2 trans_dt_tm = dq8
  1 person
    2 person_id = f8
    2 create_dt_tm = dq8
    2 create_prsnl_id = f8
    2 name_last_key = vc
    2 name_first_key = vc
    2 name_full_formatted = vc
    2 name_middle_key = vc
    2 name_first_synonym_id = f8
    2 person_type_cd = f8
    2 autopsy_cd = f8
    2 birth_dt_cd = f8
    2 birth_dt_tm = dq8
    2 conception_dt_tm = dq8
    2 confid_level_cd = f8
    2 cause_of_death_cd = f8
    2 cause_of_death = c100
    2 citizenship_cd = f8
    2 data_status_cd = f8
    2 deceased_cd = f8
    2 deceased_source_cd = f8
    2 deceased_dt_tm = dq8
    2 ethnic_grp_cd = f8
    2 ft_entity_id = f8
    2 ft_entity_name = c32
    2 language_cd = f8
    2 marital_type_cd = f8
    2 purge_option_cd = f8
    2 mother_maiden_name = c100
    2 nationality_cd = f8
    2 race_cd = f8
    2 religion_cd = f8
    2 species_cd = f8
    2 sex_cd = f8
    2 sex_age_change_ind = f8
    2 language_dialect_cd = f8
    2 name_last = vc
    2 name_first = vc
    2 name_middle = vc
    2 name_phonetic = c8
    2 last_encntr_dt_tm = dq8
    2 military_rank_cd = f8
    2 military_service_cd = f8
    2 military_base_location = vc
    2 vet_military_status_cd = f8
    2 vip_cd = f8
    2 birth_tz = i4
    2 birth_tz_disp = vc
    2 birth_prec_flag = i2
    2 raw_birth_dt_tm = dq8
    2 email_address
      3 street_addr = vc
      3 address_type_cd = f8
      3 parent_entity_name = vc
    2 patient
      3 person_id = f8
      3 adopted_cd = f8
      3 bad_debt_cd = f8
      3 baptised_cd = f8
      3 birth_order = f8
      3 birth_length = f8
      3 birth_length_units_cd = f8
      3 birth_multiple_cd = f8
      3 birth_name = c100
      3 birth_weight = f8
      3 birth_weight_units_cd = f8
      3 church_cd = f8
      3 credit_hrs_taking = f8
      3 cumm_leave_days = f8
      3 current_balance = f8
      3 current_grade = f8
      3 custody_cd = f8
      3 diet_type_cd = f8
      3 disease_alert_cd = f8
      3 degree_complete_cd = f8
      3 family_income = f8
      3 family_size = f8
      3 highest_grade_complete_cd = f8
      3 immun_on_file_cd = f8
      3 interp_required_cd = f8
      3 interp_type_cd = f8
      3 microfilm_cd = f8
      3 nbr_of_brothers = f8
      3 nbr_of_sisters = f8
      3 living_arrangement_cd = f8
      3 living_dependency_cd = f8
      3 living_will_cd = f8
      3 nbr_of_pregnancies = f8
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
      3 last_trauma_dt_tm = dq8
      3 mother_identifier = c100
      3 mother_identifier_cd = f8
      3 process_alert_cd = f8
    2 addresses [*]
      3 address_type_name = c20
      3 address_id = f8
      3 parent_entity_name = c32
      3 parent_entity_id = f8
      3 address_type_cd = f8
      3 address_format_cd = f8
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
      3 zipcode = c25
      3 zip_code_group_cd = f8
      3 postal_barcode_info = c100
      3 county = c100
      3 county_cd = f8
      3 country = c100
      3 country_cd = f8
      3 residence_cd = f8
      3 mail_stop = c100
      3 address_type_seq = f8
      3 operation_hours = c255
    2 phones [*]
      3 phone_id = f8
      3 parent_entity_name = c32
      3 parent_entity_id = f8
      3 phone_type_cd = f8
      3 phone_format_cd = f8
      3 phone_num = c100
      3 phone_type_seq = f8
      3 description = c100
      3 contact = c100
      3 call_instruction = c100
      3 modem_capability_cd = f8
      3 extension = c100
      3 paging_code = c100
      3 beg_effective_mm_dd = c100
      3 end_effective_mm_dd = c100
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 email = vc
      3 contact_method_cd = f8
      3 source_identifier = vc
      3 operation_hours = c255
    2 person_aliases [*]
      3 alias_type_name = c20
      3 person_alias_id = f8
      3 person_id = f8
      3 alias_pool_cd = f8
      3 person_alias_type_cd = f8
      3 person_alias_status_cd = f8
      3 alias = c200
      3 person_alias_sub_type_cd = f8
      3 check_digit = i4
      3 check_digit_method_cd = f8
      3 visit_seq_nbr = i4
      3 health_card_province = c3
      3 health_card_ver_code = c3
      3 data_status_cd = f8
    2 person_names [*]
      3 person_name_type_name = c20
      3 person_name_id = f8
      3 person_id = f8
      3 name_type_cd = f8
      3 name_original = c100
      3 name_format_cd = f8
      3 name_full = c100
      3 name_first = c100
      3 name_middle = c100
      3 name_last = c100
      3 name_degree = c100
      3 name_title = c100
      3 name_prefix = c100
      3 name_suffix = c100
      3 name_initials = c100
      3 data_status_cd = f8
    2 person_person_reltns [*]
      3 reltn_type_name = c20
      3 person_person_reltn_id = f8
      3 encntr_person_reltn_id = f8
      3 guarantor_org_ind = i2
      3 prior_guarantor_org_ind = i2
      3 data_status_cd = f8
      3 person_reltn_type_cd = f8
      3 person_id = f8
      3 person_reltn_cd = f8
      3 prior_person_reltn_cd = f8
      3 related_person_reltn_cd = f8
      3 prior_related_person_reltn_cd = f8
      3 related_person_id = f8
      3 contact_role_cd = f8
      3 genetic_relationship_ind = f8
      3 living_with_ind = f8
      3 visitation_allowed_cd = f8
      3 priority_seq = f8
      3 free_text_cd = f8
      3 ft_rel_person_name = vc
      3 internal_seq = f8
      3 encntr_id = f8
      3 free_text_person_ind = i2
      3 encntr_updt_flag = i2
      3 encntr_only_ind = i2
      3 guarantor_org
        4 encntr_id = f8
        4 organization_id = f8
        4 person_org_nbr = c100
        4 ft_org_name = c100
        4 priority_seq = i4
        4 remove_guarantor_org_ind = i2
        4 encntr_org_reltn_id = f8
        4 encntr_org_reltn_type_cd = f8
        4 encntr_org_reltn_cd = f8
        4 free_text_ind = i2
      3 person
        4 person_id = f8
        4 create_dt_tm = dq8
        4 create_prsnl_id = f8
        4 name_last_key = vc
        4 name_first_key = vc
        4 name_full_formatted = vc
        4 name_middle_key = vc
        4 name_first_synonym_id = f8
        4 person_type_cd = f8
        4 autopsy_cd = f8
        4 birth_dt_cd = f8
        4 birth_dt_tm = dq8
        4 conception_dt_tm = dq8
        4 confid_level_cd = f8
        4 cause_of_death_cd = f8
        4 cause_of_death = c100
        4 citizenship_cd = f8
        4 data_status_cd = f8
        4 deceased_cd = f8
        4 deceased_source_cd = f8
        4 deceased_dt_tm = dq8
        4 ethnic_grp_cd = f8
        4 ft_entity_id = f8
        4 ft_entity_name = c32
        4 sex_cd = f8
        4 language_cd = f8
        4 marital_type_cd = f8
        4 purge_option_cd = f8
        4 mother_maiden_name = c100
        4 nationality_cd = f8
        4 race_cd = f8
        4 religion_cd = f8
        4 species_cd = f8
        4 sex_age_change_ind = f8
        4 language_dialect_cd = f8
        4 name_last = vc
        4 name_first = vc
        4 name_middle = vc
        4 name_phonetic = c8
        4 last_encntr_dt_tm = dq8
        4 military_rank_cd = f8
        4 military_service_cd = f8
        4 military_base_location = vc
        4 vet_military_status_cd = f8
        4 vip_cd = f8
        4 birth_tz = i4
        4 birth_tz_disp = vc
        4 birth_prec_flag = i2
        4 raw_birth_dt_tm = dq8
        4 addresses [*]
          5 address_type_name = c20
          5 address_id = f8
          5 parent_entity_name = c32
          5 parent_entity_id = f8
          5 address_type_cd = f8
          5 address_format_cd = f8
          5 contact_name = c200
          5 residence_type_cd = f8
          5 comment_txt = c200
          5 street_addr = c100
          5 street_addr2 = c100
          5 street_addr3 = c100
          5 street_addr4 = c100
          5 city = c100
          5 state = c100
          5 state_cd = f8
          5 zipcode = c25
          5 zip_code_group_cd = f8
          5 postal_barcode_info = c100
          5 county = c100
          5 county_cd = f8
          5 country = c100
          5 country_cd = f8
          5 residence_cd = f8
          5 mail_stop = c100
          5 address_type_seq = f8
          5 operation_hours = c255
        4 phones [*]
          5 phone_type_name = c20
          5 phone_id = f8
          5 parent_entity_name = c32
          5 parent_entity_id = f8
          5 phone_type_cd = f8
          5 phone_format_cd = f8
          5 phone_num = c100
          5 phone_type_seq = f8
          5 description = c100
          5 contact = c100
          5 call_instruction = c100
          5 modem_capability_cd = f8
          5 extension = c100
          5 paging_code = c100
          5 beg_effective_mm_dd = c100
          5 end_effective_mm_dd = c100
          5 beg_effective_dt_tm = dq8
          5 end_effective_dt_tm = dq8
          5 email = vc
          5 contact_method_cd = f8
          5 source_identifier = vc
          5 operation_hours = c255
        4 person_aliases [*]
          5 alias_type_name = c20
          5 person_alias_id = f8
          5 person_id = f8
          5 alias_pool_cd = f8
          5 person_alias_type_cd = f8
          5 alias = c200
          5 person_alias_sub_type_cd = f8
          5 check_digit = i4
          5 check_digit_method_cd = f8
          5 visit_seq_nbr = i4
          5 health_card_province = c3
          5 health_card_ver_code = c3
          5 data_status_cd = f8
          5 person_alias_status_cd = f8
        4 person_names [*]
          5 person_name_type_name = c20
          5 person_name_id = f8
          5 person_id = f8
          5 name_type_cd = f8
          5 name_original = c100
          5 name_format_cd = f8
          5 name_full = c100
          5 name_first = c100
          5 name_middle = c100
          5 name_last = c100
          5 name_degree = c100
          5 name_title = c100
          5 name_prefix = c100
          5 name_suffix = c100
          5 name_initials = c100
          5 data_status_cd = f8
        4 health_plan
          5 person_plan_reltn_id = f8
          5 encntr_plan_reltn_id = f8
          5 health_plan_id = f8
          5 person_id = f8
          5 person_plan_r_cd = f8
          5 person_org_reltn_id = f8
          5 sponsor_person_org_reltn_id = f8
          5 subscriber_person_id = f8
          5 organization_id = f8
          5 priority_seq = f8
          5 member_nbr = c100
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
          5 insured_card_name = c100
          5 pat_member_nbr = vc
          5 eligible_ind = i2
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
            6 parent_entity_name = c32
            6 parent_entity_id = f8
            6 phone_type_cd = f8
            6 phone_format_cd = f8
            6 phone_num = c100
            6 phone_type_seq = f8
            6 description = c100
            6 contact = c100
            6 call_instruction = c100
            6 modem_capability_cd = f8
            6 extension = c100
            6 paging_code = c100
            6 beg_effective_mm_dd = c100
            6 end_effective_mm_dd = c100
            6 beg_effective_dt_tm = dq8
            6 end_effective_dt_tm = dq8
            6 email = vc
            6 contact_method_cd = f8
            6 source_identifier = vc
            6 operation_hours = c255
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
          5 benefit_sch
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
          5 plan_info
            6 health_plan_id = f8
            6 plan_type_cd = f8
            6 plan_name = c100
            6 plan_desc = c255
            6 financial_class_cd = f8
            6 baby_coverage_cd = f8
            6 comb_baby_bill_cd = f8
            6 plan_class_cd = f8
          5 org_plan
            6 org_plan_reltn_id = f8
            6 health_plan_id = f8
            6 org_plan_reltn_cd = f8
            6 organization_id = f8
            6 group_nbr = vc
            6 group_name = vc
            6 policy_nbr = vc
            6 data_status_cd = f8
            6 data_status_dt_tm = dq8
            6 data_status_prsnl_id = f8
          5 org_info
            6 organization_id = f8
            6 org_name = vc
          5 visit_info
            6 encntr_plan_reltn_id = f8
            6 encntr_id = f8
            6 person_id = f8
            6 person_plan_reltn_id = f8
            6 health_plan_id = f8
            6 organization_id = f8
            6 person_org_reltn_id = f8
            6 sponsor_person_org_reltn_id = f8
            6 subscriber_type_cd = f8
            6 orig_priority_seq = f8
            6 priority_seq = f8
            6 member_nbr = c100
            6 subs_member_nbr = c100
            6 insur_source_info_cd = f8
            6 balance_type_cd = f8
            6 deduct_amt = f8
            6 deduct_met_amt = f8
            6 deduct_met_dt_tm = dq8
            6 assign_benefits_cd = f8
            6 coord_benefits_cd = f8
            6 health_card_province = c3
            6 health_card_ver_code = c3
            6 health_card_nbr = c100
            6 health_card_type = c32
            6 health_card_issue_dt_tm = dq8
            6 health_card_expiry_dt_tm = dq8
            6 insured_card_name = c100
            6 military_rank_cd = f8
            6 military_service_cd = f8
            6 military_status_cd = f8
            6 military_base_location = vc
            6 ins_card_copied_cd = f8
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
            6 denial_reason_cd = f8
            6 coverage_comments = vc
    2 person_prsnl_reltns [*]
      3 reltn_type_name = c20
      3 person_prsnl_reltn_id = f8
      3 prsnl_person_id = f8
      3 person_id = f8
      3 person_prsnl_r_cd = f8
      3 free_text_cd = f8
      3 ft_prsnl_name = c100
      3 priority_seq = f8
      3 internal_seq = f8
      3 notification_cd = f8
      3 data_status_cd = f8
      3 beg_eff_dt_tm = dq8
    2 person_org_reltns [*]
      3 reltn_type_name = c20
      3 person_org_reltn_cd = f8
      3 organization_id = f8
      3 person_org_reltn_id = f8
      3 person_id = f8
      3 priority_seq = f8
      3 empl_contact = vc
      3 empl_occupation_cd = f8
      3 empl_occupation_text = vc
      3 empl_position = vc
      3 empl_status_cd = f8
      3 empl_title = vc
      3 empl_type_cd = f8
      3 person_org_nbr = c100
      3 person_org_alias = c100
      3 empl_contact_title = c100
      3 free_text_ind = f8
      3 ft_org_name = c100
      3 empl_hire_dt_tm = dq8
      3 empl_term_dt_tm = dq8
      3 empl_retire_dt_tm = dq8
      3 internal_seq = f8
      3 prior_empl_status_cd = f8
      3 phone
        4 phone_id = f8
        4 parent_entity_name = c32
        4 parent_entity_id = f8
        4 phone_type_cd = f8
        4 phone_format_cd = f8
        4 phone_num = c100
        4 phone_type_seq = f8
        4 description = c100
        4 contact = c100
        4 call_instruction = c100
        4 modem_capability_cd = f8
        4 extension = c100
        4 paging_code = c100
        4 beg_effective_mm_dd = c100
        4 end_effective_mm_dd = c100
        4 beg_effective_dt_tm = dq8
        4 end_effective_dt_tm = dq8
        4 email = vc
        4 contact_method_cd = f8
        4 source_identifier = vc
        4 operation_hours = c255
      3 address
        4 address_id = f8
        4 parent_entity_name = c32
        4 parent_entity_id = f8
        4 address_type_cd = f8
        4 address_format_cd = f8
        4 contact_name = c200
        4 residence_type_cd = f8
        4 comment_txt = c200
        4 street_addr = c100
        4 street_addr2 = c100
        4 street_addr3 = c100
        4 street_addr4 = c100
        4 city = c100
        4 state = c100
        4 state_cd = f8
        4 zipcode = c25
        4 zip_code_group_cd = f8
        4 postal_barcode_info = c100
        4 county = c100
        4 county_cd = f8
        4 country = c100
        4 country_cd = f8
        4 residence_cd = f8
        4 mail_stop = c100
        4 address_type_seq = f8
        4 operation_hours = c255
      3 email_address
        4 address_id = f8
        4 parent_entity_name = c32
        4 parent_entity_id = f8
        4 address_type_cd = f8
        4 address_format_cd = f8
        4 contact_name = c200
        4 residence_type_cd = f8
        4 comment_txt = c200
        4 street_addr = c100
        4 street_addr2 = c100
        4 street_addr3 = c100
        4 street_addr4 = c100
        4 city = c100
        4 state = c100
        4 state_cd = f8
        4 zipcode = c25
        4 zip_code_group_cd = f8
        4 postal_barcode_info = c100
        4 county = c100
        4 county_cd = f8
        4 country = c100
        4 country_cd = f8
        4 residence_cd = f8
        4 mail_stop = c100
        4 address_type_seq = f8
        4 operation_hours = c255
      3 fax
        4 phone_id = f8
        4 parent_entity_name = c32
        4 parent_entity_id = f8
        4 phone_type_cd = f8
        4 phone_format_cd = f8
        4 phone_num = c100
        4 phone_type_seq = f8
        4 description = c100
        4 contact = c100
        4 call_instruction = c100
        4 modem_capability_cd = f8
        4 extension = c100
        4 paging_code = c100
        4 beg_effective_mm_dd = c100
        4 end_effective_mm_dd = c100
        4 beg_effective_dt_tm = dq8
        4 end_effective_dt_tm = dq8
        4 email = vc
        4 contact_method_cd = f8
        4 source_identifier = vc
        4 operation_hours = c255
    2 user_defined [*]
      3 field_name_id = f8
      3 field_name = c100
      3 value_cd = f8
      3 value_dt_tm = dq8
      3 value_string = vc
    2 comments [*]
      3 field_name = c20
      3 info_type_cd = f8
      3 long_text = c32000
      3 internal_seq = f8
    2 questionnaire_01
      3 questionnaire_id = f8
      3 parent_entity_name = c32
      3 parent_entity_id = f8
      3 questions [*]
        4 question_id = f8
        4 value_type = c1
        4 value_chc = i4
        4 value_dt_tm = dq8
        4 value_nbr = f8
        4 value_cd = f8
        4 value_text = vc
        4 value_ind = i2
    2 encounter
      3 accommodation_cd = f8
      3 accommodation_request_cd = f8
      3 admit_src_cd = f8
      3 admit_type_cd = f8
      3 admit_with_medication_cd = f8
      3 arrive_dt_tm = dq8
      3 alt_result_dest_cd = f8
      3 alt_lvl_care_cd = f8
      3 ambulatory_cond_cd = f8
      3 loc_bed_cd = f8
      3 loc_building_cd = f8
      3 confid_level_cd = f8
      3 courtesy_cd = f8
      3 data_status_cd = f8
      3 depart_dt_tm = dq8
      3 diet_type_cd = f8
      3 disch_dt_tm = dq8
      3 disch_disposition_cd = f8
      3 disch_to_loctn_cd = f8
      3 encntr_id = f8
      3 encntr_type_cd = f8
      3 est_arrive_dt_tm = dq8
      3 est_depart_dt_tm = dq8
      3 loc_facility_cd = f8
      3 financial_class_cd = f8
      3 guarantor_type_cd = f8
      3 isolation_cd = f8
      3 loc_temp_cd = f8
      3 med_service_cd = f8
      3 loc_nurse_unit_cd = f8
      3 person_id = f8
      3 preadmit_nbr = c100
      3 preadmit_testing_cd = f8
      3 pre_reg_dt_tm = dq8
      3 pre_reg_prsnl_id = f8
      3 reg_dt_tm = dq8
      3 reg_prsnl_id = f8
      3 readmit_cd = f8
      3 reason_for_visit = vc
      3 referring_comment = c100
      3 result_dest_cd = f8
      3 loc_room_cd = f8
      3 vip_cd = f8
      3 visitor_status_cd = f8
      3 inpatient_admit_dt_tm = dq8
      3 organization_id = f8
      3 create_dt_tm = dq8
      3 create_prsnl_id = f8
      3 encntr_class_cd = f8
      3 encntr_type_class_cd = f8
      3 encntr_status_cd = f8
      3 admit_mode_cd = f8
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
      3 encntr_financial_id = f8
      3 name_first_synonym_id = f8
      3 bbd_procedure_cd = f8
      3 info_given_by = vc
      3 safekeeping_cd = f8
      3 trauma_cd = f8
      3 trauma_dt_tm = dq8
      3 triage_cd = f8
      3 triage_dt_tm = dq8
      3 valuables_cd = f8
      3 security_access_cd = f8
      3 refer_facility_cd = f8
      3 accomp_by_cd = f8
      3 accommodation_reason_cd = f8
      3 service_category_cd = f8
      3 est_length_of_stay = f8
      3 contract_status_cd = f8
      3 assign_to_loc_dt_tm = dq8
      3 program_service_cd = f8
      3 specialty_unit_cd = f8
      3 mental_health_cd = f8
      3 mental_health_dt_tm = dq8
      3 region_cd = f8
      3 sitter_required_cd = f8
      3 alc_reason_cd = f8
      3 alt_lvl_care_dt_tm = dq8
      3 alc_decomp_dt_tm = dq8
      3 doc_rcvd_dt_tm = dq8
      3 referral_rcvd_dt_tm = dq8
      3 place_auth_prsnl_id = f8
      3 encntr_aliases [*]
        4 alias_type_name = c20
        4 data_status_cd = f8
        4 alias = c200
        4 alias_pool_cd = f8
        4 encntr_alias_type_cd = f8
        4 encntr_alias_id = f8
        4 encntr_id = f8
        4 encntr_alias_sub_type_cd = f8
        4 check_digit = i4
        4 check_digit_method_cd = f8
      3 encntr_prsnl_reltns [*]
        4 reltn_type_name = c20
        4 encntr_prsnl_reltn_id = f8
        4 prsnl_person_id = f8
        4 encntr_prsnl_r_cd = f8
        4 expiration_ind = f8
        4 internal_seq = f8
        4 encntr_id = f8
        4 free_text_cd = f8
        4 ft_prsnl_name = vc
        4 priority_seq = f8
        4 notification_cd = f8
      3 user_defined [*]
        4 field_name = c100
        4 field_name_id = f8
        4 value_cd = f8
        4 value_dt_tm = dq8
        4 value_string = vc
      3 comments [*]
        4 field_name = c20
        4 info_type_cd = f8
        4 long_text = c32000
        4 internal_seq = f8
      3 accidents [*]
        4 accident_type_name = c12
        4 encntr_accident_id = f8
        4 ambulance_arrive_cd = f8
        4 ambulance_geo_cd = f8
        4 ambulance_serv_nbr = vc
        4 accident_dt_tm = dq8
        4 acc_death_cd = f8
        4 acc_job_related_cd = f8
        4 accident_loctn = vc
        4 place_cd = f8
        4 police_badge_nbr = vc
        4 police_force_cd = f8
        4 police_involve_cd = f8
        4 acc_state_cd = f8
        4 accident_text = vc
        4 accident_cd = f8
      3 transfer
        4 req_accommodation_cd = f8
        4 req_alt_lvl_care_cd = f8
        4 req_encntr_type_cd = f8
        4 req_isolation_cd = f8
        4 req_med_service_cd = f8
        4 location_cd = f8
        4 loc_facility_cd = f8
        4 loc_building_cd = f8
        4 loc_nurse_unit_cd = f8
        4 loc_room_cd = f8
        4 loc_bed_cd = f8
      3 discharge
        4 req_disch_to_loctn_cd = f8
        4 transaction_dt_tm = dq8
)
 
free record 3200154_rep
record 3200154_rep (
  1 person_id = f8
  1 encntr_id = f8
  1 pm_hist_tracking_id = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
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
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
declare sUserName			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare dPrsnlId			= f8 with protect, noconstant(0)
declare sJsonArgs			= vc with protect, noconstant("")
declare sPatientId			= vc with protect, noconstant("")
declare dPersonId			= f8 with protect, noconstant(0)
declare dPatientIdType		= f8 with protect, noconstant(0)
declare qEncDateTime  		= dq8 with protect, noconstant(cnvtdatetime(curdate,curtime3))
declare dAttendingProvId	= f8 with protect, noconstant(0)
declare qEncDischDateTime	= dq8 with protect, noconstant(0)
declare dEncStatusCd		= f8 with protect, noconstant(0)
declare dEncTypeCd			= f8 with protect, noconstant(0)
declare dLocBedCd			= f8 with protect, noconstant(0)
declare dLocRoomCd			= f8 with protect, noconstant(0)
declare dLocUnitCd			= f8 with protect, noconstant(0)
declare dLocBuildingCd		= f8 with protect, noconstant(0)
declare dLocFacilityCd		= f8 with protect, noconstant(0)
declare dMedicalServiceCd	= f8 with protect, noconstant(0)
declare sReasonForVisit		= vc with protect, noconstant("")
declare dPatientClassCd		= f8 with protect, noconstant(0)
declare dAdmitPriorityCd	= f8 with protect, noconstant(0)
declare dAdmitSourceCd		= f8 with protect, noconstant(0)
;declare sEncAlias			= vc with protect, noconstant("")  ;Ignored for now
declare dGuarantorId		= f8 with protect, noconstant(0)
declare sGuarantorId		= vc with protect, noconstant("")
;declare sFinancialNumber	= vc with protect, noconstant("") ;Ignored for now
 
; Other
declare UTCmode				= i2 with protect, noconstant(0)
declare dOrganizationId		= f8 with protect, noconstant(0)
declare iInsSize			= i4 with protect, noconstant(0)
 
; Constants
declare c_facility_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_building_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"BUILDING"))
declare c_nurse_unit_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"NURSEUNIT"))
declare c_amb_unit_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"AMBULATORY"))
declare c_room_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"ROOM"))
declare c_bed_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"BED"))
declare c_attending_doc_cd = f8 with protect, constant(uar_get_code_by("MEANING",333,"ATTENDDOC"))
declare c_admitting_doc_cd = f8 with protect, constant(uar_get_code_by("MEANING",333,"ADMITDOC"))
declare c_visit_class_outpatient = f8 with protect, constant(uar_get_code_by("MEANING",69,"OUTPATIENT"))
declare c_visit_class_preadmit = f8 with protect, constant(uar_get_code_by("MEANING",69,"PREADMIT"))
declare c_self_person_reltn = f8 with protect, constant(uar_get_code_by("MEANING",40,"SELF"))
declare c_unspecified_person_reltn = f8 with protect, constant(uar_get_code_by("MEANING",40,"UNSPECIFIED"))
declare c_guarantor_person_reltn_type = f8 with protect, constant(uar_get_code_by("MEANING",351,"GUARANTOR"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParamMessage(param_name = vc)			= null with protect
declare ValidateLocations(null)					= null with protect
declare GetAliasPools(null) 					= i2 with protect  	;Request 112505
declare ValidatePatientIdType(null)				= i2 with protect
declare ValidatePerson(alias = vc, alias_pool_cd = f8) = f8 with protect
declare ValidateProvider(provider_id = f8)		= i2 with protect
declare ValidateEncType(null)					= i2 with protect
declare ValidateInsuranceData(null)				= null with protect
declare GetNewEncntrAlias(null) 				= i2 with protect 	;Request 114327
declare GetLocks(null) 							= i2 with protect 	;Request 100080
declare AddLock(null) 							= i2 with protect	;Request 100081
declare GetLocCensus(null) 						= i2 with protect	;Request 114356
declare BuildStructureMap(null)					= null with protect
declare PostEncounter(null) 					= null with protect	;Request 3200154
declare DeleteLock(null) 						= i2 with protect	;Request 100082
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName			= trim($USERNAME, 3)
set iDebugFlag			= cnvtreal($DEBUG_FLAG)
set dPrsnlID			= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id	= dPrsnlID 		;006
set sJsonArgs 			= trim($JSON,3)
set jrec 				= cnvtjsontorec(sJsonArgs)
set sPatientId			= trim(arglist->patientId,3)
set dPatientIdType		= cnvtreal(arglist->patientIdType)
set qEncDateTime		= GetDateTime(arglist->encounter.encounterDateTime)
if(arglist->encounter->dischargeDateTime > " ")
	set qEncDischDateTime = GetDateTime(arglist->encounter.dischargeDateTime)
endif
set dAttendingProvId	= cnvtreal(arglist->encounter.attendingProviderId)
set dEncStatusCd		= cnvtreal(arglist->encounter.encounterStatusId)
set dEncTypeCd			= cnvtreal(arglist->encounter.encounterTypeId)
set dLocBedCd			= cnvtreal(arglist->encounter->location.bedId)
set dLocRoomCd			= cnvtreal(arglist->encounter->location.roomId)
set dLocUnitCd			= cnvtreal(arglist->encounter->location.unitId)
set dLocFacilityCd		= cnvtreal(arglist->encounter->location.hospitalId)
set dMedicalServiceCd	= cnvtreal(arglist->encounter.medicalServiceId)
set sReasonForVisit		= trim(arglist->encounter.reasonForVisit,3)
set dAdmitPriorityCd	= cnvtreal(arglist->encounter.admitPriorityId)
set dAdmitSourceCd		= cnvtreal(arglist->encounter.admitSourceId)
set sGuarantorId		= trim(arglist->encounter.guarantorId,3)
set UTCmode				= CURUTC
set iInsSize 			= size(arglist->encounter.insurances,5)
 
if(idebugFlag > 0)
	call echo(build2("sUserName -> ",sUserName))
	call echo(build2("sJsonArgs -> ",sJsonArgs))
	call echo(build2("sPatientId -> ",sPatientId))
	call echo(build2("dPatientIdType -> ",dPatientIdType))
	call echo(build2("qEncDateTime -> ",qEncDateTime))
	call echo(build2("qEncDischDateTime -> ",qEncDischDateTime))
	call echo(build2("dAttendingProvId -> ",dAttendingProvId))
	call echo(build2("dEncStatusCd -> ",dEncStatusCd))
	call echo(build2("dEncTypeCd -> ",dEncTypeCd))
	call echo(build2("dLocBedCd -> ",dLocBedCd))
	call echo(build2("dLocUnitCd -> ",dLocUnitCd))
	call echo(build2("dLocFacilityCd -> ",dLocFacilityCd))
	call echo(build2("dMedicalServiceCd -> ",dMedicalServiceCd))
	call echo(build2("sReasonForVisit -> ",sReasonForVisit))
	call echo(build2("dPatientClassCd -> ",dPatientClassCd))
	call echo(build2("dAdmitPriorityCd -> ",dAdmitPriorityCd))
	call echo(build2("dAdmitSourceCd -> ",dAdmitSourceCd))
	call echo(build2("sGuarantorId -> ",sGuarantorId))
	call echo(build2("iInsSize -> ",iInsSize))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify Required params exist
if(sPatientId = "") call ParamMessage("PatientId") endif
if(dAttendingProvId = 0) call ParamMessage("AttendingProviderId") endif
if(dEncTypeCd = 0) call ParamMessage("EncounterTypeId") endif
if(dLocFacilityCd = 0 and dLocUnitCd = 0 and dLocRoomCd = 0 and dLocBedCd = 0)
	call ErrorHandler2("POST ENCOUNTER", "F", "Invalid URI Parameters", build2("Missing required field. ",
	"At least one of the location fields is required."),
  	"9999",build2("Missing required field. ","At least one of the location fields is required."), encounter_reply_out)
  	go to exit_script
endif
 
; Validate Location Codes
call ValidateLocations(null)
 
; Get Alias Pools for Organization - Request 112505
set iRet = GetAliasPools(null)
if(iRet = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Get Alias Pools", "Could not retrieve alias pools.",
  	  "9999",build2("Could not retrieve alias pools"), encounter_reply_out)
  	  go to exit_script
endif
 
; Validate Patient Id Type
if(dPatientIdType > 0)
	set iRet = ValidatePatientIdType(null)
	if(iRet = 0)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate PatientIdType", "Invalid PatientIdType",
		"2045",build2("Invalid PatientIdType: ",dPatientIdType), encounter_reply_out)
		go to exit_script
	endif
endif
 
; Validate Person Id
set dPersonId = ValidatePerson(sPatientId,dPatientIdType)
if(dPersonId = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Validate Patient", "Invalid PatientId.",
  	  "2003",build2("Invalid PatientId: ",dPersonId), encounter_reply_out)
  	  go to exit_script
endif
 
; Validate Guarantor Id
if(sGuarantorId > " ")
	set dGuarantorId = ValidatePerson(sGuarantorId,0.0)
	if(dGuarantorId = 0)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate Guarantor", "Invalid GuarantorId",
		"9999",build2("Invalid GuarantorId: ",dGuarantorId), encounter_reply_out)
		go to exit_script
	endif
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPersonID, encounter_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("POST ENCOUNTER", "F", "User is invalid", "Invalid User for Audit.",
	"1001",build2("Invalid user: ",sUserName), encounter_reply_out)
	go to exit_script
endif
 
; Validate Attending Provider Id
set iRet = ValidateProvider(dAttendingProvId)
if(iRet = 0)
	call ErrorHandler2("POST ENCOUNTER", "F", "Validate AttendingProvider", "Invalid AttendingProviderId",
	"2031",build2("Invalid AttendingProviderId: ",dAttendingProvId), encounter_reply_out)
	go to exit_script
endif
 
; Validate Encounter Status
if(dEncStatusCd > 0)
	set iRet = GetCodeSet(dEncStatusCd)
	if(iRet != 261)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate EncounterStatus", "Invalid EncounterStatusId",
		"9999",build2("Invalid EncounterStatusId: ",dEncStatusCd), encounter_reply_out)
		go to exit_script
	endif
endif
 
; Validate Encounter Type & Set Patient Class
set iRet = ValidateEncType(null)
if(iRet = 0)
	call ErrorHandler2("POST ENCOUNTER", "F", "Validate EncounterType", "Invalid EncounterTypeId",
	"9999",build2("The provided EncounterTypeId is currently not supported for this endpoint: ",dEncTypeCd), encounter_reply_out) ;004
	go to exit_script
endif
 
; Validate Medical Service Code
if(dMedicalServiceCd > 0)
	set iRet = GetCodeSet(dMedicalServiceCd)
	if(iRet != 34)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate MedicalService", "Invalid MedicalServiceId",
		"9999",build2("Invalid MedicalServiceId: ",dMedicalServiceCd), encounter_reply_out)
		go to exit_script
	endif
endif
 
; Validate Admit Priority Code
if(dAdmitPriorityCd > 0)
	set iRet = GetCodeSet(dAdmitPriorityCd)
	if(iRet != 3)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate AdmitPriority", "Invalid AdmitPriorityId",
		"9999",build2("Invalid AdmitPriorityId: ",dAdmitPriorityCd), encounter_reply_out)
		go to exit_script
	endif
endif
 
; Validate Admit Source Code
if(dAdmitSourceCd > 0)
	set iRet = GetCodeSet(dAdmitSourceCd)
	if(iRet != 2)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate AdmitSource", "Invalid AdmitSourceId",
		"9999",build2("Invalid AdmitSourceId: ",dAdmitSourceCd), encounter_reply_out)
		go to exit_script
	endif
endif
 
/* Not currently used
; Validate Insurance information
if(iInsSize > 0)
	call ValidateInsuranceData(null)
endif
*/
 
; Get New Encounter Alias number - Request 114327
set iRet = GetNewEncntrAlias(null)
if(iRet = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Get Encntr Alias", "Could not retrieve encounter alias",
  	  "9999",build2("Could not retrieve encounter alias"), encounter_reply_out)
  	  go to exit_script
endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Get Locks", "Could not retrieve patient locks",
  	  "9999",build2("Patient could not retrieve patient locks"), encounter_reply_out)
  	  go to exit_script
endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Set Lock", "Could not set patient lock",
  	  "9999",build2("Could not set patient lock"), encounter_reply_out)
  	  go to exit_script
endif
 
; Get Location Census - Request 114356
if(dLocUnitCd > 0 and dLocRoomCd > 0 and dLocBedCd > 0)
	set iRet = GetLocCensus(null)
	if(iRet = 0)
	  	  call ErrorHandler2("POST ENCOUNTER", "F", "Get Census", "Could not retrieve location census",
	  	  "9999",build2("Could not retrieve location census"), encounter_reply_out)
	  	  go to exit_script
	endif
endif
 
; Build Structure Map
call BuildStructureMap(null)
 
; Execute Server calls
EXECUTE crmrtl
EXECUTE srvrtl
 
; Create the Encounter
set iRet = PostEncounter(null)
if(iRet = 0)
  	  call ErrorHandler2("POST ENCOUNTER", "F", "Post Encounter", "Could not post encounter",
  	  "9999",build2("Could not post encounter"), encounter_reply_out)
  	  go to exit_script
else
	call ErrorHandler2("POST ENCOUNTER", "S", "Post Encounter", "Encounter created successfully.",
  	  "0000",build2("Encounter created successfully."), encounter_reply_out)
endif
 
#EXIT_SCRIPT
 
; Delete Lock
if(100081_rep->status_data.status = "S")
	set iRet = DeleteLock(null)
	if(iRet = 0)
	  	  call ErrorHandler2("POST ENCOUNTER", "F", "Delete Lock", "Could not delete patient lock",
	  	  "9999",build2("Could not delete patient lock"), encounter_reply_out)
	  	  go to exit_script
	endif
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(encounter_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_post_encounter.json")
	  call echo(build2("_file : ", _file))
	  call echojson(encounter_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(encounter_reply_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
	call echorecord(3200154_req)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ParamMessage(param_name = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for the multiple required params
**************************************************************************/
subroutine ParamMessage(param_name)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParamMessage Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	call ErrorHandler2("POST ENCOUNTER", "F", "Invalid URI Parameters", build2("Missing required field: ",param_name),
	"2055", build2("Missing required field: ",param_name), encounter_reply_out)
	go to EXIT_SCRIPT
 
	if(idebugFlag > 0)
		call echo(concat("ParamMessage Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateLocations(null) = null
;  Description: Validate each location field is correct based on type
**************************************************************************/
subroutine ValidateLocations(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateLocations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iRet = i4
	declare dCheck = f8
 
	; Validate Bed
	if(dLocBedCd > 0)
		set fail = 0
		set iRet = GetCodeSet(dLocBedCd)
		if(iRet = 220)
			set dCheck = GetLocationType(dLocBedCd)
			if(dCheck != c_bed_type_cd)
				set fail = 1
			endif
		else
			set fail = 1
		endif
		if(fail)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Bed", "Invalid BedId",
			"9999",build2("Invalid BedId"), encounter_reply_out)
			go to exit_script
		else
			;Set Room if not set
			if(dLocRoomCd = 0)
				select into "nl:"
				from location_group lg
				where lg.child_loc_cd = dLocBedCd
					and lg.location_group_type_cd = c_room_type_cd
				detail
					dLocRoomCd = lg.parent_loc_cd
				with nocounter
			endif
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ValidateLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	; Validate Room
	if(dLocRoomCd > 0)
		set fail = 0
		set iRet = GetCodeSet(dLocRoomCd)
		if(iRet = 220)
			set dCheck = GetLocationType(dLocRoomCd)
			if(dCheck != c_room_type_cd)
				set fail = 1
			endif
		else
			set fail = 1
		endif
		if(fail)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Room", "Invalid RoomId",
			"9999",build2("Invalid RoomId"), encounter_reply_out)
			go to exit_script
		else
			;Set Unit Code if not set
			if(dLocUnitCd = 0)
				select into "nl:"
				from location_group lg
				where lg.child_loc_cd = dLocRoomCd
					and lg.location_group_type_cd in (c_amb_unit_type_cd, c_nurse_unit_type_cd)
				detail
					dLocUnitCd = lg.parent_loc_cd
				with nocounter
			endif
		endif
	endif
 
	; Validate Unit
	if(dLocUnitCd > 0)
		set fail = 0
		set iRet = GetCodeSet(dLocUnitCd)
		if(iRet = 220)
			set dCheck = GetLocationType(dLocUnitCd)
			if(dCheck not in(c_amb_unit_type_cd, c_nurse_unit_type_cd))
				set fail = 1
			endif
		else
			set fail = 1
		endif
		if(fail)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Unit", "Invalid UnitId",
			"9999",build2("Invalid UnitId"), encounter_reply_out)
			go to exit_script
		else
			;Set Building Code
			select into "nl:"
			from location_group lg
			where lg.child_loc_cd = dLocUnitCd
				and lg.location_group_type_cd = c_building_type_cd
			detail
				dLocBuildingCd = lg.parent_loc_cd
			with nocounter
 
			;Set Facility if Blank
			if(dLocFacilityCd = 0)
				select into "nl:"
				from location_group lg
				where lg.child_loc_cd = dLocBuildingCd
					and lg.location_group_type_cd = c_facility_type_cd
				detail
					dLocFacilityCd = lg.parent_loc_cd
				with nocounter
			endif
		endif
	endif
 
	; Validate Facility
	set dCheck = GetLocationType(dLocFacilityCd)
	if(dCheck != c_facility_type_cd)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate Facility", "Invalid Facility Code",
		"9999",build2("Invalid facility code"), encounter_reply_out)
		go to exit_script
	endif
 
	set fac_check = 0
 
	; Verify the lower codes link to the right facility if they exist
	if(dLocBuildingCd > 0)
		select into "nl:"
		from location_group lg
		where lg.child_loc_cd = dLocBuildingCd
		detail
			if(lg.parent_loc_cd = dLocFacilityCd)
				fac_check = 1
			endif
		with nocounter
 
		if(fac_check = 0)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Facility", "Facility and child locations aren't associated",
			"9999",build2("Facility and child locations aren't associated"), encounter_reply_out)
			go to exit_script
		endif
	endif
 
	; Set Organization Id
	select into "nl:"
	from location l
	where l.location_cd = dLocFacilityCd
	detail
		dOrganizationId = l.organization_id
	with nocounter
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocationType(location_cd) = f8
;  Description: Returns the location_type_cd from the location table
**************************************************************************/
subroutine GetLocationType(location_cd)
	if(idebugFlag > 0)
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
 
	if(idebugFlag > 0)
		call echo(concat("GetLocationType Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(type_cd)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetAliasPools(null) = i2
;  Description:  Request 112505 - Get Alias pools based on Org Id
**************************************************************************/
subroutine GetAliasPools(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPools Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iAPPLICATION = 100000
	set iTASK = 100000
 	set iREQUEST = 112505
	set iValidate = 0
 
	; Setup request
	set stat = alterlist(112505_req->org,1)
	set 112505_req->org[1].organization_id = dOrganizationId
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",112505_req,"REC",112505_rep)
 
	if(112505_rep->status_data.status = "S")
		set iValidate = 112505_rep->org_qual
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetAliasPools Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidatePatientIdType(null) = i2
;  Description: Validate the patient id type is valid.
**************************************************************************/
subroutine ValidatePatientIdType(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePatientIdType Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	select into "nl:"
	from (dummyt d with seq = 112505_rep->org[1].alias_cnt)
	plan d where 112505_rep->org[1].alias[d.seq].alias_entity_name = "PERSON_ALIAS"
			and  112505_rep->org[1].alias[d.seq].alias_pool_cd = dPatientIdType
	detail
		iValidate = iValidate + 1
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("ValidatePatientIdType Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidatePerson(alias,alias_pool_cd) = f8
;  Description: Validate the person by alias and type. Return person_id
**************************************************************************/
subroutine ValidatePerson(alias,alias_pool_cd)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePerson Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	declare person_id = f8
 
	if(alias_pool_cd = 0) ;If PatientIdType isn't provided, then assume person_id is given
		set person_id = cnvtreal(alias)
 
		select into "nl:"
		from person p
		where p.person_id = person_id
			and p.active_ind = 1
			and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
			and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and ( p.deceased_cd = value(uar_get_code_by("MEANING",268,"NO"))
				or p.deceased_cd = 0)
		detail
			iValidate = 1
		with nocounter
	else
		select into "nl:"
		from person_alias pa
		, person p
		plan pa where pa.alias_pool_cd = alias_pool_cd
			and pa.alias = alias
			and pa.active_ind = 1
			and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		join p where p.person_id = pa.person_id
			and p.active_ind = 1
			and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
			and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and ( p.deceased_cd = value(uar_get_code_by("MEANING",268,"NO"))
				or p.deceased_cd = 0)
		detail
			iValidate = 1
			person_id = pa.person_id
		with nocounter
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ValidatePerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	if(iValidate > 0)
		return(person_id)
	else
		return (0)
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateProvider(provider_id) = i2
;  Description:  Validates the provider is a valid person on the prsnl table.
**************************************************************************/
subroutine ValidateProvider(provider_id)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateProvider Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from prsnl_org_reltn por
	, prsnl pr
	plan por where por.person_id = provider_id
		and por.organization_id = dOrganizationId
	join pr where pr.person_id = por.person_id
		and pr.active_ind = 1
		and pr.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
		and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and pr.physician_ind = 1
	detail
		iValidate = iValidate + 1
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("ValidateProvider Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateEncType(null) = i2
;  Description:  Validate the encounter type and class. This Endpoint only allows
; 				 PreAdmit, Outpatient, Ambulatory, Clinic
**************************************************************************/
subroutine ValidateEncType(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateEncType Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	set iRet = GetCodeSet(dEncTypeCd)
	if(iRet != 71)
		call ErrorHandler2("POST ENCOUNTER", "F", "Validate EncounterType", "Invalid EncounterTypeId",
		"2032",build2("Invalid EncounterType Code: ",dEncTypeCd), encounter_reply_out)
		go to exit_script
	endif
 
	declare parent_cd = f8
 
	select into "nl:"
	from code_value_group cvg
		, code_value cv1
		, code_value cv2
	plan cvg where cvg.child_code_value = dEncTypeCd
	join cv1 where cv1.code_value = cvg.child_code_value
	join cv2 where cv2.code_value = cvg.parent_code_value
			   and cv2.code_set = 69
			   and cv2.code_value in (c_visit_class_outpatient, c_visit_class_preadmit)
	detail
		dPatientClassCd = cv2.code_value
		iValidate = 1
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("ValidateEncType Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInsuranceData(null) = null
;  Description:  Validate insurance data
**************************************************************************/
subroutine ValidateInsuranceData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInsuranceData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iRet = i4
 
	set stat = alterlist(insurances->qual,insSize)
	for(i = 1 to insSize)
 
		; Verify Insurance Companies
		set insurances->qual[i].companyId = cnvtreal(arglist->encounter->insurances[i].companyId)
 
		set iRet = 0
		select into "nl:"
		from organization o
		, org_type_reltn otr
		plan o where o.organization_id = insurances->qual[i].companyId
		join otr where  otr.organization_id = o.organization_id
			and otr.org_type_cd = value(uar_get_code_by("MEANING",278,"INSCO"))
		detail
			iRet = iRet + 1
		with nocounter
 
		if(iRet = 0)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate InsuranceCompanyId", "Invalid InsuranceCompanyId",
			"9999",build2("Invalid InsuranceCompanyId: ",insurances->qual[i].companyId), encounter_reply_out)
			go to exit_script
		endif
 
		; Veriy Eligibility Status Code
		set insurances->qual[i].eligStatusCd = cnvtreal(arglist->encounter->insurances[i].eligibilityStatusId)
		set iRet = GetCodeSet(insurances->qual[i].eligStatusCd)
		if(iRet != 14665)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate EligibilityStatus", "Invalid EligibilityStatusId",
			"9999",build2("Invalid EligibilityStatusId: ",insurances->qual[i].eligStatusCd), encounter_reply_out)
			go to exit_script
		endif
 
		; Verify Subscriber
		set insurances->qual[i].subscriber = ValidatePerson(arglist->encounter->insurances[i].subscriber,0.0)
		if(insurances->qual[i].subscriber = 0)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Subscriber", "Invalid SubscriberId",
			"9999",build2("Invalid SubscriberId: ",insurances->qual[i].subscriber), encounter_reply_out)
			go to exit_script
		endif
 
		; Set Policy Number
		set insurances->qual[i].policyNumber = trim(arglist->encounter->insurances[i].policyNumber,3)
 
		; Verify Patient Relationship to Subscriber
		set insurances->qual[i].patientReltnToSubscriberCd = cnvtreal(arglist->encounter->insurances[i].patientRelationshipToSubscriber)
		set iRet = GetCodeSet(insurances->qual[i].patientReltnToSubscriberCd)
		if(iRet != 40)
			call ErrorHandler2("POST ENCOUNTER", "F", "Validate Patient Reltn", "Invalid PatientRelationshipToSubscriberId",
			"9999",build2("Invalid PatientRelationshipToSubscriberId: ",insurances->qual[i].patientReltnToSubscriberCd), encounter_reply_out)
			go to exit_script
		endif
 
		; Set Eligibility Status Date if it exists
		if(arglist->encounter->insurances[i].eligibilityStatusDate > " ")
			set insurances->qual[i].eligStatusDate = GetDateTime(arglist->encounter->insurances[i].eligibilityStatusDate)
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("ValidateInsuranceData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNewEncntrAlias(null) = i2 with protect
;  Description:  Request 114327 - Retrieves the next sequence for the FIN alias pool
**************************************************************************/
subroutine GetNewEncntrAlias(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNewEncntrAlias Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	set iAPPLICATION = 100000
	set iTASK = 100000
 	set iREQUEST = 114327
 
	; Get Alias Pool Code for FIN NBR
	select into "nl:"
	from (dummyt d with seq = 112505_rep->org[1].alias_cnt)
	plan d where 112505_rep->org[1].alias[d.seq].alias_entity_name = "ENCNTR_ALIAS"
			and  112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "FIN NBR"
	detail
		114327_req->alias_pool_cd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
	with nocounter
 
	; Set other defaults
	set 114327_req->action_type = "NEW"
	set 114327_req->seq_type_name = "DEFAULT"
	set 114327_req->person_id = dPersonId
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",114327_req,"REC",114327_rep)
	if(114327_rep->status_data.status = "S")
		set iValidate = size(114327_rep->alias_info,5)
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetNewEncntrAlias Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
 
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocks(null) = i2
;  Description: Request 100080 - Get patient locks
**************************************************************************/
subroutine GetLocks(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100080
 
 	; Setup request
	set 100080_req->person_id = dPersonId
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2
;  Description:  Request 100081 - create patient lock
**************************************************************************/
subroutine AddLock(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100081
 
	set 100081_req->person_id = dPersonId
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100081_req,"REC",100081_rep)
	if(100081_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("AddLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocCensus(null) = i2
;  Description: Request 114356 - Gets available bed information per location
**************************************************************************/
subroutine GetLocCensus(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocCensus Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100003
 	set iREQUEST = 114356
 
	; Setup request
	set 114356_req->facility_cd = dLocFacilityCd
	set 114356_req->building_cd = dLocBuildingCd
	set 114356_req->nurse_unit_or_amb_cd = dLocUnitCd
	set 114356_req->room_cd = dLocRoomCd
 
	if(dLocBedCd > 0)
 		set stat = alterlist(114356_req->bed,1)
	 	set 114356_req->bed[1].bed_cd = dLocBedCd
	endif
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",114356_req,"REC",114356_rep)
	if(114356_rep->status_data.status = "S")
		for(i = 1 to size(114356_rep->room[1].bed,5))
			if(114356_rep->room[1].bed[1].bed_status_mean = "AVAILABLE")
				set iValidate = 1
			else
				call ErrorHandler2("POST ENCOUNTER", "F", "Get Census", "The BedId is not currently available",
		  	  	"9999",build2("The BedId is not available"), encounter_reply_out)
		  	  	go to exit_script
			endif
		endfor
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetLocCensus Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: BuildStructureMap(null) = null
;  Description:  Req 3200154 calls request 114609 and there are
; 	structures that need to be defined a certain way for phone, address, names, aliases, etc.
; 	This routine maps the 114609 structures to code values
**************************************************************************/
subroutine BuildStructureMap(origdttm)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildStructureMap Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare root = vc
 	declare root_type = vc
 
 	; Addresses
 	set stat = alterlist(structure_map->addresses,50)
 	set a = 0
 	set a = a + 1, set structure_map->addresses[a].struct_name = "home_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "prev_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "alt_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "temp_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "bill_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "birth_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "bus_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "mail_address"
	set a = a + 1, set structure_map->addresses[a].struct_name = "email_address"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "home_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "pri_home_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "vac_home_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "bus_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "aam_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "emc_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "paging_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "mobile_email"
	;set a = a + 1, set structure_map->addresses[a].struct_name = "secure_email"
	set stat = alterlist(structure_map->addresses,a)
 
	for(x = 1 to a)
		set root = cnvtupper(piece(structure_map->addresses[x].struct_name,"_",1,structure_map->addresses[x].struct_name))
		set rootsize = size(trim(root,3))
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 212
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root)
		detail
			structure_map->addresses[x].code_value = cv.code_value
			structure_map->addresses[x].code_display = cv.display
		with nocounter
	endfor
 
 	;Phones
 	set stat = alterlist(structure_map->phones,50)
 	set b = 0
	set b = b + 1, set structure_map->phones[b].struct_name = "home_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "home_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "home_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "prev_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "prev_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "prev_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "alt_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "alt_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "alt_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "temp_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "temp_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "temp_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "bill_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "bill_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "bill_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "bus_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "bus_pager"
	set b = b + 1, set structure_map->phones[b].struct_name = "bus_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "home_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "pri_home_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "pri_home_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "pri_home_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "vac_home_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "vac_home_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "vac_home_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "bus_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "aam_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "aam_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "aam_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "emc_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "emc_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "emc_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "paging_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "paging_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "paging_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "mobile_phone"
	set b = b + 1, set structure_map->phones[b].struct_name = "mobile_fax"
	set b = b + 1, set structure_map->phones[b].struct_name = "mobile_textphone"
	set b = b + 1, set structure_map->phones[b].struct_name = "home_fax2"
	set b = b + 1, set structure_map->phones[b].struct_name = "bus_fax2"
 	set stat = alterlist(structure_map->phones,b)
 
 	declare strname = vc
 	for(x = 1 to b)
 		set strname = structure_map->phones[x].struct_name
 		set pos = findstring("_",strname,1,1)
 		set root = substring(1,pos-1,strname)
		set root = cnvtupper(replace(root,"_","*"))
		set root = build2("*",root,"*")
		set root_type = cnvtupper(trim(substring(pos+1,15,strname),3))
 
		if(root_type = "PHONE")
			select into "nl:"
			from code_value cv
			where cv.code_set = 43
				and cv.display_key not in("*PAGER*","*FAX*","*TEXT*")
				and cv.cdf_meaning not in ("*PAGER*","*FAX*","*TEXT*")
				and (  cv.cdf_meaning = patstring(root)
					or cv.display_key = patstring(root))
			order by cv.code_value
			head report
				z = 0
			detail
				if(z = 0) ;Set to first occurence
					structure_map->phones[x].code_value = cv.code_value
					structure_map->phones[x].code_display = cv.display
					z = z + 1
				endif
			with nocounter
		else
			set root_type = build2("*",root_type,"*")
 
			select into "nl:"
			from code_value cv
			where cv.code_set = 43
				and (cv.display_key = patstring(root_type)
					or cv.cdf_meaning = patstring(root_type))
				and (  cv.cdf_meaning = patstring(root)
					or cv.display_key = patstring(root))
			order by cv.code_value
			head report
				z = 0
			detail
				if(z = 0) ;Set to first occurence
					structure_map->phones[x].code_value = cv.code_value
					structure_map->phones[x].code_display = cv.display
					z = z + 1
				endif
			with nocounter
		endif
	endfor
 
	; Alias Types
	set stat = alterlist(structure_map->aliases,50)
	set c = 0
	set c = c + 1, set structure_map->aliases[c].struct_name = "mrn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "ssn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "cmrn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "drivers_license"
	set c = c + 1, set structure_map->aliases[c].struct_name = "donor_number"
	set c = c + 1, set structure_map->aliases[c].struct_name = "military_number"
	set c = c + 1, set structure_map->aliases[c].struct_name = "passport_number"
	set c = c + 1, set structure_map->aliases[c].struct_name = "nhn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "shn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "ref_mrn"
	set c = c + 1, set structure_map->aliases[c].struct_name = "messaging"
	set c = c + 1, set structure_map->aliases[c].struct_name = "donor_id"
	set c = c + 1, set structure_map->aliases[c].struct_name = "outreach"
 	set stat = alterlist(structure_map->aliases,c)
 
 	for(x = 1 to c)
 		set root = cnvtupper(piece(structure_map->aliases[x].struct_name,"_",1,structure_map->aliases[x].struct_name))
		set rootsize = size(trim(root,3))
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 4
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root)
		detail
			structure_map->aliases[x].code_value = cv.code_value
			structure_map->aliases[x].code_display = cv.display
		with nocounter
	endfor
 
	; Names
	set stat = alterlist(structure_map->names,50)
	set d = 0
	set d = d  + 1, set structure_map->names[d].struct_name = "current_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "prev_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "alt_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "maiden_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "preferred_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "alt_char_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "birth_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "bachelor_name"
	set d = d  + 1, set structure_map->names[d].struct_name = "nonhist_prev_name"
 	set stat = alterlist(structure_map->names,d)
 
 	for(x = 1 to d)
 		if(structure_map->names[x].struct_name = "alt_char_name")
 			set root = "ALT_CHAR"
 		else
			set root = cnvtupper(piece(structure_map->names[x].struct_name,"_",1,structure_map->names[x].struct_name))
		endif
		set rootsize = size(trim(root,3))
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 213
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root)
		detail
			structure_map->names[x].code_value = cv.code_value
			structure_map->names[x].code_display = cv.display
		with nocounter
	endfor
 
	; Prsnl
	set stat = alterlist(structure_map->prsnl,50)
	set e = 0
	set e = e + 1, set structure_map->prsnl[e].struct_name = "birth_physician"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "death_physician"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "family_physician"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "obgyn"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "pediatrician"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "pcp"
	set e = e + 1, set structure_map->prsnl[e].struct_name = "sponsor"
	set stat = alterlist(structure_map->prsnl,e)
	;doc_01 - doc_10
 
	for(x = 1 to e)
		set root = cnvtupper(piece(structure_map->prsnl[x].struct_name,"_",1,structure_map->prsnl[x].struct_name))
		set rootsize = size(trim(root,3))
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 331
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root)
		detail
			structure_map->prsnl[x].code_value = cv.code_value
			structure_map->prsnl[x].code_display = cv.display
		with nocounter
	endfor
 
	; Orgs
	set stat = alterlist(structure_map->orgs,50)
	set f = 0
	set f = f + 1, set structure_map->orgs[f].struct_name = "employer"
	set f = f + 1, set structure_map->orgs[f].struct_name = "school"
	set f = f + 1, set structure_map->orgs[f].struct_name = "reg_practice"
	set f = f + 1, set structure_map->orgs[f].struct_name = "child_health_org"
	set f = f + 1, set structure_map->orgs[f].struct_name = "sponsoring_advocate"
 	set stat = alterlist(structure_map->orgs,f)
 
 	for(x = 1 to f)
 		set root = cnvtupper(piece(structure_map->orgs[x].struct_name,"_",1,structure_map->orgs[x].struct_name))
		set rootsize = size(trim(root,3))
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 278
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root)
		detail
			structure_map->orgs[x].code_value = cv.code_value
			structure_map->orgs[x].code_display = cv.display
		with nocounter
	endfor
 
	; Reltns
	set stat = alterlist(structure_map->reltn,50)
	set g = 0
	set g = g + 1, set structure_map->reltn[g].struct_name = "subscriber"
	set g = g + 1, set structure_map->reltn[g].struct_name = "insured"
	set g = g + 1, set structure_map->reltn[g].struct_name = "guarantor"
	set g = g + 1, set structure_map->reltn[g].struct_name = "guarantor"
	set g = g + 1, set structure_map->reltn[g].struct_name = "guarantor"
	set g = g + 1, set structure_map->reltn[g].struct_name = "agent"
	set g = g + 1, set structure_map->reltn[g].struct_name = "guardian"
	set g = g + 1, set structure_map->reltn[g].struct_name = "nok"
	set g = g + 1, set structure_map->reltn[g].struct_name = "mother"
	set g = g + 1, set structure_map->reltn[g].struct_name = "father"
	set g = g + 1, set structure_map->reltn[g].struct_name = "emc" ;Emergency Contact
	;relation_01 - relation_06
	set stat = alterlist(structure_map->reltn,g)
 
 	set guar_cnt = 0
	for(x = 1 to g)
		set root = cnvtupper(structure_map->reltn[x].struct_name)
		if(root = "EMC")
			set root = "EMERG"
		endif
		set rootsize = size(trim(root,3))
 
 		if(root = "GUARANTOR")
 			set guar_cnt = guar_cnt + 1
 		endif
 
		select into "nl:"
		from code_value cv
		where cv.code_set in (351,40)
			and (  substring(1,rootsize,cv.cdf_meaning) = root
				or substring(1,rootsize,cv.display_key) = root
				or cv.display_key = patstring(build("*",root,"*")))
		head report
			z = 0
		detail
			if(root = "GUARANTOR")
				z = z + 1
				if(z = guar_cnt)
					structure_map->reltn[x].code_value = cv.code_value
					structure_map->reltn[x].code_display = cv.display
				endif
			else
				structure_map->reltn[x].code_value = cv.code_value
				structure_map->reltn[x].code_display = cv.display
			endif
		with nocounter
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("BuildStructureMap Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostEncounter(null) = null
;  Description:  Request 3200154 - post a new encounter
**************************************************************************/
subroutine PostEncounter(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostEncounter Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 3202004
 	set iREQUEST = 3200154
 
 	; Setup Request
 
 	; Transaction Info
 	set 3200154_req->transaction_type = 200
 	set 3200154_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
 	;Person Data
 	select into "nl:"
	from person p
	where p.person_id = dPersonId
	detail
		3200154_req->person.person_id = p.person_id
		3200154_req->person.create_dt_tm = p.create_dt_tm
		3200154_req->person.create_prsnl_id = p.create_prsnl_id
		3200154_req->person.name_last_key = p.name_last_key
		3200154_req->person.name_first_key = p.name_first_key
		3200154_req->person.name_full_formatted = p.name_full_formatted
		3200154_req->person.name_middle_key = p.name_middle_key
		3200154_req->person.name_first_synonym_id = p.name_first_synonym_id
		3200154_req->person.person_type_cd = p.person_type_cd
		3200154_req->person.autopsy_cd = p.autopsy_cd
		3200154_req->person.birth_dt_cd = p.birth_dt_cd
		3200154_req->person.birth_dt_tm = p.birth_dt_tm
		3200154_req->person.conception_dt_tm = p.conception_dt_tm
		3200154_req->person.confid_level_cd = p.confid_level_cd
		3200154_req->person.cause_of_death = p.cause_of_death
		3200154_req->person.cause_of_death_cd = p.cause_of_death_cd
		3200154_req->person.citizenship_cd = p.citizenship_cd
		3200154_req->person.data_status_cd = p.data_status_cd
		3200154_req->person.deceased_cd = p.deceased_cd
		3200154_req->person.deceased_source_cd = p.deceased_source_cd
		3200154_req->person.deceased_dt_tm = p.deceased_dt_tm
		3200154_req->person.ethnic_grp_cd = p.ethnic_grp_cd
		3200154_req->person.ft_entity_id = p.ft_entity_id
		3200154_req->person.ft_entity_name = p.ft_entity_name
		3200154_req->person.language_cd = p.language_cd
		3200154_req->person.marital_type_cd = p.marital_type_cd
		3200154_req->person.purge_option_cd = p.purge_option_cd
		3200154_req->person.mother_maiden_name = p.mother_maiden_name
		3200154_req->person.nationality_cd = p.nationality_cd
		3200154_req->person.race_cd = p.race_cd
		3200154_req->person.religion_cd = p.religion_cd
		3200154_req->person.species_cd = p.species_cd
		3200154_req->person.sex_cd = p.sex_cd
		3200154_req->person.sex_age_change_ind = p.sex_age_change_ind
		3200154_req->person.language_dialect_cd = p.language_dialect_cd
		3200154_req->person.name_last = p.name_last
		3200154_req->person.name_first = p.name_first
		3200154_req->person.name_middle = p.name_middle
		3200154_req->person.name_phonetic = p.name_phonetic
		3200154_req->person.last_encntr_dt_tm = p.last_encntr_dt_tm
		3200154_req->person.military_rank_cd = p.military_rank_cd
		3200154_req->person.military_service_cd = p.military_service_cd
		3200154_req->person.military_base_location = p.military_base_location
		3200154_req->person.vet_military_status_cd = p.vet_military_status_cd
		3200154_req->person.vip_cd = p.vip_cd
		3200154_req->person.birth_tz = p.birth_tz
		3200154_req->person.birth_tz_disp = datetimezonebyindex(p.birth_tz)
		3200154_req->person.birth_prec_flag = p.birth_prec_flag
		3200154_req->person.raw_birth_dt_tm = cnvtdatetimeutc(p.birth_dt_tm)
	with nocounter
 
 	; Person Patient Data
 	select into "nl:"
 	from person_patient pp
 	where pp.person_id = dPersonId
	detail
		3200154_req->person.patient.person_id = pp.person_id
	 	3200154_req->person.patient.adopted_cd = pp.adopted_cd
	 	3200154_req->person.patient.bad_debt_cd = pp.bad_debt_cd
	 	3200154_req->person.patient.baptised_cd = pp.baptised_cd
	 	3200154_req->person.patient.birth_order = pp.birth_order
	 	3200154_req->person.patient.birth_length = pp.birth_length
	 	3200154_req->person.patient.birth_length_units_cd = pp.birth_length_units_cd
	 	3200154_req->person.patient.birth_multiple_cd = pp.birth_multiple_cd
	 	3200154_req->person.patient.birth_name = pp.birth_name
	 	3200154_req->person.patient.birth_weight = pp.birth_weight
	 	3200154_req->person.patient.birth_weight_units_cd = pp.birth_weight_units_cd
	 	3200154_req->person.patient.church_cd = pp.church_cd
	 	3200154_req->person.patient.credit_hrs_taking = pp.credit_hrs_taking
	 	3200154_req->person.patient.cumm_leave_days = pp.cumm_leave_days
	 	3200154_req->person.patient.current_balance = pp.current_balance
	 	3200154_req->person.patient.current_grade = pp.current_grade
	 	3200154_req->person.patient.custody_cd = pp.custody_cd
	 	3200154_req->person.patient.diet_type_cd = pp.diet_type_cd
	 	3200154_req->person.patient.disease_alert_cd = pp.disease_alert_cd
	 	3200154_req->person.patient.degree_complete_cd = pp.degree_complete_cd
	 	3200154_req->person.patient.family_income = pp.family_income
	 	3200154_req->person.patient.family_size = pp.family_size
	 	3200154_req->person.patient.highest_grade_complete_cd = pp.highest_grade_complete_cd
	 	3200154_req->person.patient.immun_on_file_cd = pp.immun_on_file_cd
	 	3200154_req->person.patient.interp_required_cd = pp.interp_required_cd
	 	3200154_req->person.patient.interp_type_cd = pp.interp_type_cd
	 	3200154_req->person.patient.microfilm_cd = pp.microfilm_cd
	 	3200154_req->person.patient.nbr_of_brothers = pp.nbr_of_brothers
	 	3200154_req->person.patient.nbr_of_sisters = pp.nbr_of_sisters
	 	3200154_req->person.patient.living_arrangement_cd = pp.living_arrangement_cd
	 	3200154_req->person.patient.living_dependency_cd = pp.living_dependency_cd
	 	3200154_req->person.patient.living_will_cd = pp.living_will_cd
	 	3200154_req->person.patient.nbr_of_pregnancies = pp.nbr_of_pregnancies
	 	3200154_req->person.patient.organ_donor_cd = pp.organ_donor_cd
	 	3200154_req->person.patient.parent_marital_status_cd = pp.parent_marital_status_cd
	 	3200154_req->person.patient.smokes_cd = pp.smokes_cd
	 	3200154_req->person.patient.tumor_registry_cd = pp.tumor_registry_cd
	 	3200154_req->person.patient.last_bill_dt_tm = pp.last_bill_dt_tm
	 	3200154_req->person.patient.last_bind_dt_tm = pp.last_bind_dt_tm
	 	3200154_req->person.patient.last_discharge_dt_tm = pp.last_discharge_dt_tm
	 	3200154_req->person.patient.last_event_updt_dt_tm = pp.last_payment_dt_tm
	 	3200154_req->person.patient.last_payment_dt_tm = pp.last_payment_dt_tm
	 	3200154_req->person.patient.last_atd_activity_dt_tm = pp.last_atd_activity_dt_tm
	 	3200154_req->person.patient.student_cd = pp.student_cd
	 	3200154_req->person.patient.last_trauma_dt_tm = pp.last_trauma_dt_tm
	 	3200154_req->person.patient.mother_identifier = pp.mother_identifier
	 	3200154_req->person.patient.mother_identifier_cd = pp.mother_identifier_cd
	 	3200154_req->person.patient.process_alert_cd = pp.process_alert_cd
 	with nocounter
 
 	; Addresses
 	select into "nl:"
	from address a
	where a.parent_entity_name = "PERSON"
		and a.parent_entity_id = dPersonId
		and a.active_ind = 1
	head report
		x = 0
	detail
		if(a.address_type_cd = value(uar_get_code_by("MEANING",212,"EMAIL")))
 			3200154_req->person.email_address.street_addr = a.street_addr
 			3200154_req->person.email_address.address_type_cd = a.address_type_cd
 			3200154_req->person.email_address.parent_entity_name = a.parent_entity_name
 		else
 			x = x + 1
 			stat = alterlist(3200154_req->person.addresses,x)
 
			3200154_req->person.addresses[x].address_id = a.address_id
			3200154_req->person.addresses[x].parent_entity_name = a.parent_entity_name
			3200154_req->person.addresses[x].parent_entity_id = a.parent_entity_id
			3200154_req->person.addresses[x].address_type_cd = a.address_type_cd
			3200154_req->person.addresses[x].address_format_cd = a.address_format_cd
			3200154_req->person.addresses[x].contact_name = a.contact_name
			3200154_req->person.addresses[x].residence_type_cd = a.residence_type_cd
			3200154_req->person.addresses[x].comment_txt = a.comment_txt
			3200154_req->person.addresses[x].street_addr = a.street_addr
			3200154_req->person.addresses[x].street_addr2 = a.street_addr2
			3200154_req->person.addresses[x].street_addr3 = a.street_addr3
			3200154_req->person.addresses[x].street_addr4 = a.street_addr4
			3200154_req->person.addresses[x].city = a.city
			3200154_req->person.addresses[x].state = a.state
			3200154_req->person.addresses[x].state_cd = a.state_cd
			3200154_req->person.addresses[x].zipcode = a.zipcode
			3200154_req->person.addresses[x].zip_code_group_cd = a.zip_code_group_cd
			3200154_req->person.addresses[x].postal_barcode_info = a.postal_barcode_info
			3200154_req->person.addresses[x].county = a.county
			3200154_req->person.addresses[x].county_cd = a.county_cd
			3200154_req->person.addresses[x].country = a.country
			3200154_req->person.addresses[x].country_cd = a.country_cd
			3200154_req->person.addresses[x].residence_cd = a.residence_cd
			3200154_req->person.addresses[x].mail_stop = a.mail_stop
			3200154_req->person.addresses[x].address_type_seq = a.address_type_seq
			3200154_req->person.addresses[x].operation_hours = a.operation_hours
		endif
 	with nocounter
 
	 	;Set Structure name
	 	for(i = 1 to size(3200154_req->person.addresses,5))
	 		select into "nl:"
	 		from (dummyt d with seq = size(structure_map->addresses,5))
	 		plan d where structure_map->addresses[d.seq].code_value =
	 			3200154_req->person.addresses[i].address_type_cd
	 		detail
	 			3200154_req->person.addresses[i].address_type_name = structure_map->addresses[d.seq].struct_name
	 		with nocounter
	 	endfor
 
 	; Phones
 	select into "nl:"
 	from phone p
 	where p.parent_entity_name = "PERSON"
 		and p.parent_entity_id = dPersonId
 		and p.active_ind = 1
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(3200154_req->person.phones,x)
 
		3200154_req->person.phones[x].phone_id = p.phone_id
	 	3200154_req->person.phones[x].parent_entity_name = p.parent_entity_name
	 	3200154_req->person.phones[x].parent_entity_id = p.parent_entity_id
	 	3200154_req->person.phones[x].phone_type_cd = p.phone_type_cd
	 	3200154_req->person.phones[x].phone_format_cd = p.phone_format_cd
	 	3200154_req->person.phones[x].phone_num = p.phone_num
	 	3200154_req->person.phones[x].phone_type_seq = p.phone_type_seq
	 	3200154_req->person.phones[x].description = p.description
	 	3200154_req->person.phones[x].contact = p.contact
	 	3200154_req->person.phones[x].call_instruction = p.call_instruction
	 	3200154_req->person.phones[x].modem_capability_cd = p.modem_capability_cd
	 	3200154_req->person.phones[x].extension = p.extension
	 	3200154_req->person.phones[x].paging_code = p.paging_code
	 	3200154_req->person.phones[x].beg_effective_dt_tm = p.beg_effective_dt_tm
	 	3200154_req->person.phones[x].end_effective_dt_tm = p.end_effective_dt_tm
	 	3200154_req->person.phones[x].contact_method_cd = p.contact_method_cd
	 	3200154_req->person.phones[x].source_identifier = p.source_identifier
	 	3200154_req->person.phones[x].operation_hours = p.operation_hours
	 with nocounter
 
 	; Person Aliases
 	select into "nl:"
 	from person_alias pa
 	where pa.person_id = dPersonId
 		and pa.active_ind = 1
 		and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
 		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(3200154_req->person.person_aliases,x)
 
	 	3200154_req->person.person_aliases[x].person_alias_id = pa.person_alias_id
	 	3200154_req->person.person_aliases[x].person_id = pa.person_id
	 	3200154_req->person.person_aliases[x].alias_pool_cd = pa.alias_pool_cd
	 	3200154_req->person.person_aliases[x].person_alias_type_cd = pa.person_alias_type_cd
	 	3200154_req->person.person_aliases[x].person_alias_status_cd = pa.person_alias_status_cd
	 	3200154_req->person.person_aliases[x].alias = pa.alias
	 	3200154_req->person.person_aliases[x].person_alias_sub_type_cd = pa.person_alias_sub_type_cd
	 	3200154_req->person.person_aliases[x].check_digit = pa.check_digit
	 	3200154_req->person.person_aliases[x].check_digit_method_cd = pa.check_digit_method_cd
	 	3200154_req->person.person_aliases[x].visit_seq_nbr = pa.visit_seq_nbr
	 	3200154_req->person.person_aliases[x].health_card_province = pa.health_card_province
	 	3200154_req->person.person_aliases[x].health_card_ver_code = pa.health_card_ver_code
	 	3200154_req->person.person_aliases[x].data_status_cd = pa.data_status_cd
	 with nocounter
 
		 ;Set structure name
		 for(i = 1 to size(3200154_req->person.person_aliases,5))
		 	select into "nl:"
		 	from (dummyt d with seq = size(structure_map->aliases,5))
		 	plan d where structure_map->aliases[d.seq].code_value = 3200154_req->person.person_aliases[i].person_alias_type_cd
		 	detail
		 		3200154_req->person.person_aliases[i].alias_type_name = structure_map->aliases[d.seq].struct_name
		 	with nocounter
		 endfor
 
 	; Person Names
 	select into "nl:"
	from person_name pn
	where pn.person_id = dPersonId
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(3200154_req->person.person_names,x)
 
		3200154_req->person.person_names[x].person_name_id = pn.person_name_id
	 	3200154_req->person.person_names[x].person_id = pn.person_id
	 	3200154_req->person.person_names[x].name_type_cd = pn.name_type_cd
	 	3200154_req->person.person_names[x].name_original = pn.name_original
	 	3200154_req->person.person_names[x].name_format_cd = pn.name_format_cd
	 	3200154_req->person.person_names[x].name_full = pn.name_full
	 	3200154_req->person.person_names[x].name_first = pn.name_first
	 	3200154_req->person.person_names[x].name_middle = pn.name_middle
	 	3200154_req->person.person_names[x].name_last = pn.name_last
	 	3200154_req->person.person_names[x].name_degree = pn.name_degree
	 	3200154_req->person.person_names[x].name_title = pn.name_title
	 	3200154_req->person.person_names[x].name_prefix = pn.name_prefix
	 	3200154_req->person.person_names[x].name_suffix = pn.name_suffix
	 	3200154_req->person.person_names[x].name_initials = pn.name_initials
	 	3200154_req->person.person_names[x].data_status_cd = pn.data_status_cd
	 with nocounter
 
	 ;Set Structure name
	 for(i = 1 to size(3200154_req->person.person_names,5))
	 	select into "nl:"
	 	from (dummyt d with seq = size(3200154_req->person.person_names,5))
	 	plan d where structure_map->names[d.seq].code_value = 3200154_req->person.person_names[i].name_type_cd
	 	detail
	 		3200154_req->person.person_names[i].person_name_type_name = structure_map->names[d.seq].struct_name
	 	with nocounter
	 endfor
 
 	; Person Person Reltns
 	set guarantorCheck = 0
 	select into "nl:"
 	from person_person_reltn ppr
 	where ppr.person_id = dPersonId
 		and ppr.active_ind = 1
 		and ppr.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
 		and ppr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and ppr.person_reltn_type_cd > 0
 	head report
 		x = 0
 	detail
 		store = 1
 
 		if(dGuarantorId > 0)
 			pos = findstring("GUARANTOR",cnvtupper(uar_get_code_display(ppr.person_reltn_type_cd)),1)
 			if(pos)
		 		if(ppr.related_person_id = dGuarantorId)
		 			guarantorCheck = 1
				else
					store = 0
		 		endif
		 	endif
 		endif
 
 		if(store)
 			x = x + 1
 			stat = alterlist(3200154_req->person.person_person_reltns,x)
 
	 		3200154_req->person.person_person_reltns[x].person_reltn_cd = ppr.person_reltn_cd
		 	3200154_req->person.person_person_reltns[x].person_person_reltn_id = ppr.person_person_reltn_id
		 	3200154_req->person.person_person_reltns[x].data_status_cd = ppr.data_status_cd
		 	3200154_req->person.person_person_reltns[x].person_reltn_type_cd = ppr.person_reltn_type_cd
		 	3200154_req->person.person_person_reltns[x].person_id = ppr.person_id
		 	3200154_req->person.person_person_reltns[x].related_person_reltn_cd = ppr.related_person_reltn_cd
		 	3200154_req->person.person_person_reltns[x].related_person_id = ppr.related_person_id
		 	3200154_req->person.person_person_reltns[x].contact_role_cd = ppr.contact_role_cd
		 	3200154_req->person.person_person_reltns[x].genetic_relationship_ind = ppr.genetic_relationship_ind
		 	3200154_req->person.person_person_reltns[x].living_with_ind = ppr.living_with_ind
		 	3200154_req->person.person_person_reltns[x].visitation_allowed_cd = ppr.visitation_allowed_cd
		 	3200154_req->person.person_person_reltns[x].priority_seq = ppr.priority_seq
		 	3200154_req->person.person_person_reltns[x].free_text_cd = ppr.free_text_cd
		 	3200154_req->person.person_person_reltns[x].ft_rel_person_name = ppr.ft_rel_person_name
		 	3200154_req->person.person_person_reltns[x].internal_seq = ppr.internal_seq
		 	3200154_req->person.person_person_reltns[x].free_text_person_ind = 0
		 endif
 	with nocounter
 
 	set ppr_size = size(3200154_req->person.person_person_reltns,5)
 
 	; Add Guarantor if not already defined
 	if(dGuarantorId > 0 and guarantorCheck = 0)
 		set ppr_size = ppr_size + 1
 		set stat = alterlist(3200154_req->person.person_person_reltns,ppr_size)
 
 		; Set person reltn
 		if(dGuarantorId = dPersonId)
 			set 3200154_req->person.person_person_reltns[ppr_size].person_reltn_cd = c_self_person_reltn
 			set 3200154_req->person.person_person_reltns[ppr_size].related_person_reltn_cd = c_self_person_reltn
 		else
 			set 3200154_req->person.person_person_reltns[ppr_size].person_reltn_cd = c_unspecified_person_reltn
 			set 3200154_req->person.person_person_reltns[ppr_size].related_person_reltn_cd = c_unspecified_person_reltn
 		endif
	 	set 3200154_req->person.person_person_reltns[ppr_size].person_reltn_type_cd = c_guarantor_person_reltn_type
	 	set 3200154_req->person.person_person_reltns[ppr_size].person_id = dPersonId
	 	set 3200154_req->person.person_person_reltns[ppr_size].related_person_id = dGuarantorId
	 	set 3200154_req->person.person_person_reltns[ppr_size].priority_seq = 1
 		endif
 
 		;Set Structure name
 		set guarCnt = 0
 		set subsCnt = 0
 		set reltnCnt = 0
 
 		call echo(build2("ppr_size ",ppr_size))
	 	for(x = 1 to ppr_size)
	 		set check = 0
 
	 		select into "nl:"
	 		from (dummyt d with seq = size(structure_map->reltn,5))
	 		plan d where structure_map->reltn[d.seq].code_value =
	 			3200154_req->person.person_person_reltns[x].person_reltn_type_cd
	 		detail
	 			check = 1
	 			rec_cd = 3200154_req->person.person_person_reltns[x].person_reltn_type_cd
	 			struct_cd = structure_map->reltn[d.seq].code_value
 
	 			if(structure_map->reltn[d.seq].struct_name = "guarantor")
	 				guarCnt = guarCnt + 1
		 			3200154_req->person.person_person_reltns[x].reltn_type_name =
		 			build(structure_map->reltn[d.seq].struct_name,"_0",guarCnt)
		 			3200154_req->person.person_person_reltns[x].internal_seq = guarCnt
		 			3200154_req->person.person_person_reltns[x].priority_seq = guarCnt
		 		elseif(structure_map->reltn[d.seq].struct_name = "subscriber"
		 			or structure_map->reltn[d.seq].struct_name = "insured")
		 			subsCnt = subsCnt + 1
		 			3200154_req->person.person_person_reltns[x].reltn_type_name = build("subscriber_0",subsCnt)
		 			3200154_req->person.person_person_reltns[x].internal_seq = subsCnt
		 			3200154_req->person.person_person_reltns[x].priority_seq = subsCnt
		 		else
		 			3200154_req->person.person_person_reltns[x].reltn_type_name =
		 			structure_map->reltn[d.seq].struct_name
		 		endif
	 		with nocounter
 
	 		if(check = 0)
 				set reltnCnt = reltnCnt + 1
 				set 3200154_req->person.person_person_reltns[x].reltn_type_name = build("relation_0",reltnCnt)
	 		endif
	 	endfor
 
		; Not needed currently
	 	/*
	 	3200154_req->person.person_person_reltns[].encntr_person_reltn_id = ppr.enc
	 	3200154_req->person.person_person_reltns[].encntr_updt_flag
	 	3200154_req->person.person_person_reltns[].encntr_only_ind
	 	3200154_req->person.person_person_reltns[].guarantor_org_ind =
	 	3200154_req->person.person_person_reltns[].prior_guarantor_org_ind
	 	3200154_req->person.person_person_reltns[].encntr_id
 
	 	; Guarantor Org
 		3200154_req->person.person_person_reltns[].guarantor_org.encntr_id
 		3200154_req->person.person_person_reltns[].guarantor_org.organization_id
 		3200154_req->person.person_person_reltns[].guarantor_org.person_org_nbr
 		3200154_req->person.person_person_reltns[].guarantor_org.ft_org_name
 		3200154_req->person.person_person_reltns[].guarantor_org.priority_seq
 		3200154_req->person.person_person_reltns[].guarantor_org.remove_guarantor_org_ind
 		3200154_req->person.person_person_reltns[].guarantor_org.encntr_org_reltn_id
 		3200154_req->person.person_person_reltns[].guarantor_org.encntr_org_reltn_type_cd
 		3200154_req->person.person_person_reltns[].guarantor_org.encntr_org_reltn_cd
 		3200154_req->person.person_person_reltns[].guarantor_org.free_text_ind
 		*/
 
 		if( ppr_size > 0)
 			for(i = 1 to ppr_size)
 				;Related Person Info
 				select into "nl:"
				from person p
				where p.person_id = 3200154_req->person.person_person_reltns[i].related_person_id
				detail
					3200154_req->person.person_person_reltns[i].person.person_id = p.person_id
					3200154_req->person.person_person_reltns[i].person.create_dt_tm = p.create_dt_tm
					3200154_req->person.person_person_reltns[i].person.create_prsnl_id = p.create_prsnl_id
					3200154_req->person.person_person_reltns[i].person.name_last_key = p.name_last_key
					3200154_req->person.person_person_reltns[i].person.name_first_key = p.name_first_key
					3200154_req->person.person_person_reltns[i].person.name_full_formatted = p.name_full_formatted
					3200154_req->person.person_person_reltns[i].person.name_middle_key = p.name_middle_key
					3200154_req->person.person_person_reltns[i].person.name_first_synonym_id = p.name_first_synonym_id
					3200154_req->person.person_person_reltns[i].person.person_type_cd = p.person_type_cd
					3200154_req->person.person_person_reltns[i].person.autopsy_cd = p.autopsy_cd
					3200154_req->person.person_person_reltns[i].person.birth_dt_cd = p.birth_dt_cd
					3200154_req->person.person_person_reltns[i].person.birth_dt_tm = p.birth_dt_tm
					3200154_req->person.person_person_reltns[i].person.conception_dt_tm = p.conception_dt_tm
					3200154_req->person.person_person_reltns[i].person.confid_level_cd = p.confid_level_cd
					3200154_req->person.person_person_reltns[i].person.cause_of_death = p.cause_of_death
					3200154_req->person.person_person_reltns[i].person.cause_of_death_cd = p.cause_of_death_cd
					3200154_req->person.person_person_reltns[i].person.citizenship_cd = p.citizenship_cd
					3200154_req->person.person_person_reltns[i].person.data_status_cd = p.data_status_cd
					3200154_req->person.person_person_reltns[i].person.deceased_cd = p.deceased_cd
					3200154_req->person.person_person_reltns[i].person.deceased_source_cd = p.deceased_source_cd
					3200154_req->person.person_person_reltns[i].person.deceased_dt_tm = p.deceased_dt_tm
					3200154_req->person.person_person_reltns[i].person.ethnic_grp_cd = p.ethnic_grp_cd
					3200154_req->person.person_person_reltns[i].person.ft_entity_id = p.ft_entity_id
					3200154_req->person.person_person_reltns[i].person.ft_entity_name = p.ft_entity_name
					3200154_req->person.person_person_reltns[i].person.language_cd = p.language_cd
					3200154_req->person.person_person_reltns[i].person.marital_type_cd = p.marital_type_cd
					3200154_req->person.person_person_reltns[i].person.purge_option_cd = p.purge_option_cd
					3200154_req->person.person_person_reltns[i].person.mother_maiden_name = p.mother_maiden_name
					3200154_req->person.person_person_reltns[i].person.nationality_cd = p.nationality_cd
					3200154_req->person.person_person_reltns[i].person.race_cd = p.race_cd
					3200154_req->person.person_person_reltns[i].person.religion_cd = p.religion_cd
					3200154_req->person.person_person_reltns[i].person.species_cd = p.species_cd
					3200154_req->person.person_person_reltns[i].person.sex_cd = p.sex_cd
					3200154_req->person.person_person_reltns[i].person.sex_age_change_ind = p.sex_age_change_ind
					3200154_req->person.person_person_reltns[i].person.language_dialect_cd = p.language_dialect_cd
					3200154_req->person.person_person_reltns[i].person.name_last = p.name_last
					3200154_req->person.person_person_reltns[i].person.name_first = p.name_first
					3200154_req->person.person_person_reltns[i].person.name_middle = p.name_middle
					3200154_req->person.person_person_reltns[i].person.name_phonetic = p.name_phonetic
					3200154_req->person.person_person_reltns[i].person.last_encntr_dt_tm = p.last_encntr_dt_tm
					3200154_req->person.person_person_reltns[i].person.military_rank_cd = p.military_rank_cd
					3200154_req->person.person_person_reltns[i].person.military_service_cd = p.military_service_cd
					3200154_req->person.person_person_reltns[i].person.military_base_location = p.military_base_location
					3200154_req->person.person_person_reltns[i].person.vet_military_status_cd = p.vet_military_status_cd
					3200154_req->person.person_person_reltns[i].person.vip_cd = p.vip_cd
					3200154_req->person.person_person_reltns[i].person.birth_tz = p.birth_tz
					3200154_req->person.person_person_reltns[i].person.birth_tz_disp = datetimezonebyindex(p.birth_tz)
					3200154_req->person.person_person_reltns[i].person.birth_prec_flag = p.birth_prec_flag
					3200154_req->person.person_person_reltns[i].person.raw_birth_dt_tm = cnvtdatetimeutc(p.birth_dt_tm)
				with nocounter
 
 				;Related Person Addresses
 				select into "nl:"
				from address a
				where a.parent_entity_name = "PERSON"
					and a.parent_entity_id = 3200154_req->person.person_person_reltns[i].related_person_id
					and a.active_ind = 1
				head report
					x = 0
				detail
					x = x + 1
		 			stat = alterlist(3200154_req->person.person_person_reltns[i].person.addresses,x)
 
					3200154_req->person.person_person_reltns[i].person.addresses[x].address_id = a.address_id
					3200154_req->person.person_person_reltns[i].person.addresses[x].parent_entity_name = a.parent_entity_name
					3200154_req->person.person_person_reltns[i].person.addresses[x].parent_entity_id = a.parent_entity_id
					3200154_req->person.person_person_reltns[i].person.addresses[x].address_type_cd = a.address_type_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].address_format_cd = a.address_format_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].contact_name = a.contact_name
					3200154_req->person.person_person_reltns[i].person.addresses[x].residence_type_cd = a.residence_type_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].comment_txt = a.comment_txt
					3200154_req->person.person_person_reltns[i].person.addresses[x].street_addr = a.street_addr
					3200154_req->person.person_person_reltns[i].person.addresses[x].street_addr2 = a.street_addr2
					3200154_req->person.person_person_reltns[i].person.addresses[x].street_addr3 = a.street_addr3
					3200154_req->person.person_person_reltns[i].person.addresses[x].street_addr4 = a.street_addr4
					3200154_req->person.person_person_reltns[i].person.addresses[x].city = a.city
					3200154_req->person.person_person_reltns[i].person.addresses[x].state = a.state
					3200154_req->person.person_person_reltns[i].person.addresses[x].state_cd = a.state_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].zipcode = a.zipcode
					3200154_req->person.person_person_reltns[i].person.addresses[x].zip_code_group_cd = a.zip_code_group_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].postal_barcode_info = a.postal_barcode_info
					3200154_req->person.person_person_reltns[i].person.addresses[x].county = a.county
					3200154_req->person.person_person_reltns[i].person.addresses[x].county_cd = a.county_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].country = a.country
					3200154_req->person.person_person_reltns[i].person.addresses[x].country_cd = a.country_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].residence_cd = a.residence_cd
					3200154_req->person.person_person_reltns[i].person.addresses[x].mail_stop = a.mail_stop
					3200154_req->person.person_person_reltns[i].person.addresses[x].address_type_seq = a.address_type_seq
					3200154_req->person.person_person_reltns[i].person.addresses[x].operation_hours = a.operation_hours
		 		with nocounter
 
			 	;Set Structure name
			 	for(x = 1 to size(3200154_req->person.person_person_reltns[i].person.addresses,5))
			 		select into "nl:"
			 		from (dummyt d with seq = size(structure_map->addresses,5))
			 		plan d where structure_map->addresses[d.seq].code_value =
			 			3200154_req->person.person_person_reltns[i].person.addresses[x].address_type_cd
			 		detail
			 			3200154_req->person.person_person_reltns[i].person.addresses[x].address_type_name =
			 			structure_map->addresses[d.seq].struct_name
			 		with nocounter
			 	endfor
 
 				;Related Person Phones
 				select into "nl:"
			 	from phone p
			 	where p.parent_entity_name = "PERSON"
			 		and p.parent_entity_id = 3200154_req->person.person_person_reltns[i].related_person_id
			 		and p.active_ind = 1
			 	head report
			 		x = 0
			 	detail
			 		x = x + 1
			 		stat = alterlist(3200154_req->person.person_person_reltns[i].person.phones,x)
 
					3200154_req->person.person_person_reltns[i].person.phones[x].phone_id = p.phone_id
				 	3200154_req->person.person_person_reltns[i].person.phones[x].parent_entity_name = p.parent_entity_name
				 	3200154_req->person.person_person_reltns[i].person.phones[x].parent_entity_id = p.parent_entity_id
				 	3200154_req->person.person_person_reltns[i].person.phones[x].phone_type_cd = p.phone_type_cd
				 	3200154_req->person.person_person_reltns[i].person.phones[x].phone_format_cd = p.phone_format_cd
				 	3200154_req->person.person_person_reltns[i].person.phones[x].phone_num = p.phone_num
				 	3200154_req->person.person_person_reltns[i].person.phones[x].phone_type_seq = p.phone_type_seq
				 	3200154_req->person.person_person_reltns[i].person.phones[x].description = p.description
				 	3200154_req->person.person_person_reltns[i].person.phones[x].contact = p.contact
				 	3200154_req->person.person_person_reltns[i].person.phones[x].call_instruction = p.call_instruction
				 	3200154_req->person.person_person_reltns[i].person.phones[x].modem_capability_cd = p.modem_capability_cd
				 	3200154_req->person.person_person_reltns[i].person.phones[x].extension = p.extension
				 	3200154_req->person.person_person_reltns[i].person.phones[x].paging_code = p.paging_code
				 	3200154_req->person.person_person_reltns[i].person.phones[x].beg_effective_dt_tm = p.beg_effective_dt_tm
				 	3200154_req->person.person_person_reltns[i].person.phones[x].end_effective_dt_tm = p.end_effective_dt_tm
				 	3200154_req->person.person_person_reltns[i].person.phones[x].contact_method_cd = p.contact_method_cd
				 	3200154_req->person.person_person_reltns[i].person.phones[x].source_identifier = p.source_identifier
				 	3200154_req->person.person_person_reltns[i].person.phones[x].operation_hours = p.operation_hours
				 with nocounter
 
	 				;Set Structure name
				 	for(x = 1 to size(3200154_req->person.person_person_reltns[i].person.phones,5))
				 		select into "nl:"
				 		from (dummyt d with seq = size(structure_map->phones,5))
				 		plan d where structure_map->phones[d.seq].code_value =
				 			3200154_req->person.person_person_reltns[i].person.phones[x].phone_type_cd
				 		detail
				 			3200154_req->person.person_person_reltns[i].person.phones[x].phone_type_name =
				 			structure_map->phones[d.seq].struct_name
				 		with nocounter
				 	endfor
 
 				;Related Person Person Aliases
 				select into "nl:"
			 	from person_alias pa
			 	where pa.person_id = 3200154_req->person.person_person_reltns[i].related_person_id
			 		and pa.active_ind = 1
			 		and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
			 		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			 	head report
			 		x = 0
			 	detail
			 		x = x + 1
			 		stat = alterlist(3200154_req->person.person_person_reltns[i].person.person_aliases,x)
 
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_id = pa.person_alias_id
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_id = pa.person_id
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].alias_pool_cd = pa.alias_pool_cd
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_type_cd = pa.person_alias_type_cd
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_status_cd = pa.person_alias_status_cd
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].alias = pa.alias
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_sub_type_cd = pa.person_alias_sub_type_cd
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].check_digit = pa.check_digit
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].check_digit_method_cd = pa.check_digit_method_cd
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].visit_seq_nbr = pa.visit_seq_nbr
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].health_card_province = pa.health_card_province
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].health_card_ver_code = pa.health_card_ver_code
				 	3200154_req->person.person_person_reltns[i].person.person_aliases[x].data_status_cd = pa.data_status_cd
				 with nocounter
 
					 ;Set structure name
					 for(x = 1 to size(3200154_req->person.person_person_reltns[i].person.person_aliases,5))
					 	set check = 0
					 	select into "nl:"
					 	from (dummyt d with seq = size(structure_map->aliases,5))
					 	plan d where structure_map->aliases[d.seq].code_value =
					 		3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_type_cd
					 	detail
					 		check = 1
					 		3200154_req->person.person_person_reltns[i].person.person_aliases[x].alias_type_name =
					 		structure_map->aliases[d.seq].struct_name
					 	with nocounter
 
					 	if(check = 0)
					 		set 3200154_req->person.person_person_reltns[i].person.person_aliases[x].alias_type_name =
					 		uar_get_code_meaning(3200154_req->person.person_person_reltns[i].person.person_aliases[x].person_alias_type_cd)
					 	endif
					 endfor
 
 				;Related Person Person Names
 				select into "nl:"
				from person_name pn
				where pn.person_id = 3200154_req->person.person_person_reltns[i].related_person_id
				head report
					x = 0
				detail
					x = x + 1
					stat = alterlist(3200154_req->person.person_person_reltns[i].person.person_names,x)
 
					3200154_req->person.person_person_reltns[i].person.person_names[x].person_name_id = pn.person_name_id
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].person_id = pn.person_id
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_type_cd = pn.name_type_cd
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_original = pn.name_original
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_format_cd = pn.name_format_cd
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_full = pn.name_full
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_first = pn.name_first
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_middle = pn.name_middle
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_last = pn.name_last
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_degree = pn.name_degree
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_title = pn.name_title
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_prefix = pn.name_prefix
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_suffix = pn.name_suffix
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].name_initials = pn.name_initials
				 	3200154_req->person.person_person_reltns[i].person.person_names[x].data_status_cd = pn.data_status_cd
				 with nocounter
 
				 ;Set Structure name
				 for(x = 1 to size(3200154_req->person.person_person_reltns[i].person.person_names,5))
				 	select into "nl:"
				 	from (dummyt d with seq = size(3200154_req->person.person_person_reltns[i].person.person_names,5))
				 	plan d where structure_map->names[d.seq].code_value =
				 		3200154_req->person.person_person_reltns[i].person.person_names[x].name_type_cd
				 	detail
				 		3200154_req->person.person_person_reltns[i].person.person_names[x].person_name_type_name =
				 		structure_map->names[d.seq].struct_name
				 	with nocounter
				 endfor
 
 				;Related Person Health Plan
 					;****Insurance is not currently updated with this API****
 			endfor
 		endif
 
 	; Person Prsnl Reltns
 	select into "nl:"
 	from person_prsnl_reltn ppr
 	where ppr.person_id = dPersonId
 		and ppr.active_ind = 1
 		and ppr.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
 		and ppr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(3200154_req->person.person_prsnl_reltns,x)
 
	 	3200154_req->person.person_prsnl_reltns[x].person_prsnl_reltn_id = ppr.person_prsnl_reltn_id
	 	3200154_req->person.person_prsnl_reltns[x].prsnl_person_id = ppr.prsnl_person_id
	 	3200154_req->person.person_prsnl_reltns[x].person_id = ppr.person_id
	 	3200154_req->person.person_prsnl_reltns[x].person_prsnl_r_cd = ppr.person_prsnl_r_cd
	 	3200154_req->person.person_prsnl_reltns[x].free_text_cd = ppr.free_text_cd
	 	3200154_req->person.person_prsnl_reltns[x].ft_prsnl_name = ppr.ft_prsnl_name
	 	3200154_req->person.person_prsnl_reltns[x].priority_seq = ppr.priority_seq
	 	3200154_req->person.person_prsnl_reltns[x].internal_seq = ppr.internal_seq
	 	3200154_req->person.person_prsnl_reltns[x].notification_cd = ppr.notification_cd
	 	3200154_req->person.person_prsnl_reltns[x].data_status_cd = ppr.data_status_cd
	 	3200154_req->person.person_prsnl_reltns[x].beg_eff_dt_tm = ppr.beg_effective_dt_tm
	 with nocounter
 
	 ;Set the proper structure name
	 set docCnt = 0
 
	 for(y = 1 to size(3200154_req->person.person_prsnl_reltns,5))
	 	set check = 0
	 	select into "nl:"
	 	from (dummyt d with seq = size(structure_map->prsnl,5))
	 	plan d where structure_map->prsnl[d.seq].code_value =
	 		3200154_req->person.person_prsnl_reltns[y].person_prsnl_r_cd
	 	detail
	 		check = 1
	 		3200154_req->person.person_prsnl_reltns[y].reltn_type_name = structure_map->prsnl[d.seq].struct_name
	 	with nocounter
 
	 	if(check = 0)
	 		set docCnt = docCnt + 1
	 		if(docCnt < 10)
	 			set 3200154_req->person.person_prsnl_reltns[y].reltn_type_name = build("doc_0",docCnt)
	 		else
	 			set 3200154_req->person.person_prsnl_reltns[y].reltn_type_name = build("doc_",docCnt)
	 		endif
	 	endif
	 endfor
 
 	; Person Org Reltns
 	select into "nl:"
 	from person_org_reltn por
 	where por.person_id = dPersonId
 		and por.active_ind = 1
 		and por.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
 		and por.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(3200154_req->person.person_org_reltns,x)
 
 		3200154_req->person.person_org_reltns[x].person_org_reltn_cd = por.person_org_reltn_cd
 		3200154_req->person.person_org_reltns[x].organization_id = por.organization_id
 		3200154_req->person.person_org_reltns[x].person_org_reltn_id = por.person_org_reltn_id
 		3200154_req->person.person_org_reltns[x].person_id = por.person_id
 		3200154_req->person.person_org_reltns[x].priority_seq = por.priority_seq
 		3200154_req->person.person_org_reltns[x].empl_contact = por.empl_contact
 		3200154_req->person.person_org_reltns[x].empl_occupation_cd = por.empl_occupation_cd
 		3200154_req->person.person_org_reltns[x].empl_occupation_text = por.empl_occupation_text
 		3200154_req->person.person_org_reltns[x].empl_position = por.empl_position
 		3200154_req->person.person_org_reltns[x].empl_status_cd = por.empl_status_cd
 		3200154_req->person.person_org_reltns[x].empl_title = por.empl_title
 		3200154_req->person.person_org_reltns[x].empl_type_cd = por.empl_type_cd
 		3200154_req->person.person_org_reltns[x].person_org_nbr = por.person_org_nbr
 		3200154_req->person.person_org_reltns[x].person_org_alias = por.person_org_alias
 		3200154_req->person.person_org_reltns[x].empl_contact_title = por.empl_contact_title
 		3200154_req->person.person_org_reltns[x].free_text_ind = por.free_text_ind
 		3200154_req->person.person_org_reltns[x].ft_org_name = por.ft_org_name
 		3200154_req->person.person_org_reltns[x].empl_hire_dt_tm = por.empl_hire_dt_tm
 		3200154_req->person.person_org_reltns[x].empl_term_dt_tm = por.empl_term_dt_tm
 		3200154_req->person.person_org_reltns[x].empl_retire_dt_tm = por.empl_retire_dt_tm
 		3200154_req->person.person_org_reltns[x].internal_seq = por.internal_seq
 		;3200154_req->person.person_org_reltns[x].prior_empl_status_cd =
 	with nocounter
 
 	set por_size = size(3200154_req->person.person_org_reltns,5)
 	if(por_size > 0)
 		set empCnt = 0
 		for(i = 1 to por_size)
 			; Set structure name
 			set check = 0
 			select into "nl:"
 			from (dummyt d with seq = size(structure_map->orgs,5))
 			plan d where structure_map->orgs[d.seq].code_value =
 			3200154_req->person.person_org_reltns[i].person_org_reltn_cd
 			detail
 				check = 1
 				if(structure_map->orgs[d.seq].struct_name = "employer")
 					empCnt = empCnt + 1
 					3200154_req->person.person_org_reltns[i].reltn_type_name = build("employer_0",empCnt)
 				else
 					3200154_req->person.person_org_reltns[i].reltn_type_name =
 						structure_map->orgs[d.seq].struct_name
 				endif
 			with nocounter
 
	 		; Person Org Reltn Phone
	 		select into "nl:"
 				phone_type_mean = uar_get_code_meaning(p.phone_type_cd)
	 		from phone p
	 		plan p where p.parent_entity_name = "ORGANIZATION"
	 			and p.parent_entity_id = 3200154_req->person.person_org_reltns[i].organization_id
	 			and p.active_ind = 1
	 			and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
	 			and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	 		detail
	 			if(phone_type_mean not like "*FAX*")
			 		3200154_req->person.person_org_reltns[i].phone.phone_id = p.phone_id
			 		3200154_req->person.person_org_reltns[i].phone.parent_entity_name = p.parent_entity_name
			 		3200154_req->person.person_org_reltns[i].phone.parent_entity_id = p.parent_entity_id
			 		3200154_req->person.person_org_reltns[i].phone.phone_type_cd = p.phone_type_cd
			 		3200154_req->person.person_org_reltns[i].phone.phone_format_cd = p.phone_format_cd
			 		3200154_req->person.person_org_reltns[i].phone.phone_num = p.phone_num
			 		3200154_req->person.person_org_reltns[i].phone.phone_type_seq = p.phone_type_seq
			 		3200154_req->person.person_org_reltns[i].phone.description = p.description
			 		3200154_req->person.person_org_reltns[i].phone.contact = p.contact
			 		3200154_req->person.person_org_reltns[i].phone.call_instruction = p.call_instruction
			 		3200154_req->person.person_org_reltns[i].phone.modem_capability_cd = p.modem_capability_cd
			 		3200154_req->person.person_org_reltns[i].phone.extension = p.extension
			 		3200154_req->person.person_org_reltns[i].phone.paging_code = p.paging_code
			 		3200154_req->person.person_org_reltns[i].phone.beg_effective_dt_tm = p.beg_effective_dt_tm
			 		3200154_req->person.person_org_reltns[i].phone.end_effective_dt_tm = p.end_effective_dt_tm
			 		3200154_req->person.person_org_reltns[i].phone.contact_method_cd = p.contact_method_cd
			 		3200154_req->person.person_org_reltns[i].phone.source_identifier = p.source_identifier
		 			3200154_req->person.person_org_reltns[i].phone.operation_hours = p.operation_hours
 				else
			 		; Person Org Reltn Fax
			 		3200154_req->person.person_org_reltns[i].fax.phone_id = p.phone_id
			 		3200154_req->person.person_org_reltns[i].fax.parent_entity_name = p.parent_entity_name
			 		3200154_req->person.person_org_reltns[i].fax.parent_entity_id = p.parent_entity_id
			 		3200154_req->person.person_org_reltns[i].fax.phone_type_cd = p.phone_type_cd
			 		3200154_req->person.person_org_reltns[i].fax.phone_format_cd = p.phone_format_cd
			 		3200154_req->person.person_org_reltns[i].fax.phone_num = p.phone_num
			 		3200154_req->person.person_org_reltns[i].fax.phone_type_seq = p.phone_type_seq
			 		3200154_req->person.person_org_reltns[i].fax.description = p.description
			 		3200154_req->person.person_org_reltns[i].fax.contact = p.contact
			 		3200154_req->person.person_org_reltns[i].fax.call_instruction = p.call_instruction
			 		3200154_req->person.person_org_reltns[i].fax.modem_capability_cd = p.modem_capability_cd
			 		3200154_req->person.person_org_reltns[i].fax.extension = p.extension
			 		3200154_req->person.person_org_reltns[i].fax.paging_code = p.paging_code
			 		3200154_req->person.person_org_reltns[i].fax.beg_effective_dt_tm = p.beg_effective_dt_tm
			 		3200154_req->person.person_org_reltns[i].fax.end_effective_dt_tm = p.end_effective_dt_tm
			 		3200154_req->person.person_org_reltns[i].fax.contact_method_cd = p.contact_method_cd
			 		3200154_req->person.person_org_reltns[i].fax.source_identifier = p.source_identifier
		 			3200154_req->person.person_org_reltns[i].fax.operation_hours = p.operation_hours
 				endif
 			with nocounter
 
	 		; Person Org Reltn Address
	 		select into "nl:"
	 			addr_type_mean = uar_get_code_meaning(a.address_type_cd)
	 		from address a
	 		where a.parent_entity_name = "ORGANIZATION"
	 			and a.parent_entity_id = 3200154_req->person.person_org_reltns[i].organization_id
 				and a.active_ind = 1
	 			and a.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
	 			and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	 		detail
	 			if(addr_type_mean not like "*EMAIL*")
	 				3200154_req->person.person_org_reltns[i].address.address_id = a.address_id
	 				3200154_req->person.person_org_reltns[i].address.parent_entity_name = a.parent_entity_name
	 				3200154_req->person.person_org_reltns[i].address.parent_entity_id  = a.parent_entity_id
	 				3200154_req->person.person_org_reltns[i].address.address_type_cd = a.address_type_cd
	 				3200154_req->person.person_org_reltns[i].address.address_format_cd = a.address_format_cd
	 				3200154_req->person.person_org_reltns[i].address.contact_name = a.contact_name
	 				3200154_req->person.person_org_reltns[i].address.residence_type_cd = a.residence_type_cd
	 				3200154_req->person.person_org_reltns[i].address.comment_txt = a.comment_txt
	 				3200154_req->person.person_org_reltns[i].address.street_addr = a.street_addr
	 				3200154_req->person.person_org_reltns[i].address.street_addr2 = a.street_addr2
	 				3200154_req->person.person_org_reltns[i].address.street_addr3 = a.street_addr3
	 				3200154_req->person.person_org_reltns[i].address.street_addr4 = a.street_addr4
	 				3200154_req->person.person_org_reltns[i].address.city = a.city
	 				3200154_req->person.person_org_reltns[i].address.state = a.state
	 				3200154_req->person.person_org_reltns[i].address.state_cd = a.state_cd
	 				3200154_req->person.person_org_reltns[i].address.zipcode = a.zipcode
	 				3200154_req->person.person_org_reltns[i].address.zip_code_group_cd = a.zip_code_group_cd
	 				3200154_req->person.person_org_reltns[i].address.postal_barcode_info = a.postal_barcode_info
					3200154_req->person.person_org_reltns[i].address.county = a.county
	 				3200154_req->person.person_org_reltns[i].address.county_cd = a.county_cd
	 				3200154_req->person.person_org_reltns[i].address.country = a.country
	 				3200154_req->person.person_org_reltns[i].address.country_cd = a.country_cd
	 				3200154_req->person.person_org_reltns[i].address.residence_cd = a.residence_cd
	 				3200154_req->person.person_org_reltns[i].address.mail_stop = a.mail_stop
	 				3200154_req->person.person_org_reltns[i].address.address_type_seq = a.address_type_seq
	 				3200154_req->person.person_org_reltns[i].address.operation_hours = a.operation_hours
	 			else ; Person Org Reltn Email Address
	 				3200154_req->person.person_org_reltns[i].email_address.address_id = a.address_id
	 				3200154_req->person.person_org_reltns[i].email_address.parent_entity_name = a.parent_entity_name
	 				3200154_req->person.person_org_reltns[i].email_address.parent_entity_id  = a.parent_entity_id
	 				3200154_req->person.person_org_reltns[i].email_address.address_type_cd = a.address_type_cd
	 				3200154_req->person.person_org_reltns[i].email_address.address_format_cd = a.address_format_cd
	 				3200154_req->person.person_org_reltns[i].email_address.contact_name = a.contact_name
	 				3200154_req->person.person_org_reltns[i].email_address.residence_type_cd = a.residence_type_cd
	 				3200154_req->person.person_org_reltns[i].email_address.comment_txt = a.comment_txt
	 				3200154_req->person.person_org_reltns[i].email_address.street_addr = a.street_addr
	 				3200154_req->person.person_org_reltns[i].email_address.street_addr2 = a.street_addr2
	 				3200154_req->person.person_org_reltns[i].email_address.street_addr3 = a.street_addr3
	 				3200154_req->person.person_org_reltns[i].email_address.street_addr4 = a.street_addr4
	 				3200154_req->person.person_org_reltns[i].email_address.city = a.city
	 				3200154_req->person.person_org_reltns[i].email_address.state = a.state
	 				3200154_req->person.person_org_reltns[i].email_address.state_cd = a.state_cd
	 				3200154_req->person.person_org_reltns[i].email_address.zipcode = a.zipcode
	 				3200154_req->person.person_org_reltns[i].email_address.zip_code_group_cd = a.zip_code_group_cd
	 				3200154_req->person.person_org_reltns[i].email_address.postal_barcode_info = a.postal_barcode_info
					3200154_req->person.person_org_reltns[i].email_address.county = a.county
	 				3200154_req->person.person_org_reltns[i].email_address.county_cd = a.county_cd
	 				3200154_req->person.person_org_reltns[i].email_address.country = a.country
	 				3200154_req->person.person_org_reltns[i].email_address.country_cd = a.country_cd
	 				3200154_req->person.person_org_reltns[i].email_address.residence_cd = a.residence_cd
	 				3200154_req->person.person_org_reltns[i].email_address.mail_stop = a.mail_stop
	 				3200154_req->person.person_org_reltns[i].email_address.address_type_seq = a.address_type_seq
	 				3200154_req->person.person_org_reltns[i].email_address.operation_hours = a.operation_hours
	 			endif
	 		with nocounter
	 	endfor
 	endif
 
 	; User Defined - Not used for this API
 	; Comments - Not used for this API
 	; Questionnaire_01 - Not used for this API
 
 	; Encounter
 	set 3200154_req->person.encounter.create_prsnl_id = dPrsnlId
 	set 3200154_req->person.encounter.encntr_type_cd = dEncTypeCd
 	set 3200154_req->person.encounter.admit_type_cd = dAdmitPriorityCd
 	set 3200154_req->person.encounter.med_service_cd = dMedicalServiceCd
 	set 3200154_req->person.encounter.est_arrive_dt_tm = qEncDateTime
 	set 3200154_req->person.encounter.organization_id = dOrganizationId
 	set 3200154_req->person.encounter.reason_for_visit = sReasonForVisit
 	set 3200154_req->person.encounter.loc_facility_cd = dLocFacilityCd
 	set 3200154_req->person.encounter.loc_building_cd = dLocBuildingCd
 	set 3200154_req->person.encounter.loc_nurse_unit_cd = dLocUnitCd
 	set 3200154_req->person.encounter.loc_room_cd = dLocRoomCd
 	set 3200154_req->person.encounter.loc_bed_cd = dLocBedCd
 
 	; Set Location
 	if(dLocUnitCd > 0)
 		if(dLocRoomCd > 0)
 			if(dLocBedCd > 0)
 				set 3200154_req->person.encounter.location_cd = dLocBedCd
 			else
 				set 3200154_req->person.encounter.location_cd = dLocRoomCd
 			endif
 		else
 			set 3200154_req->person.encounter.location_cd = dLocUnitCd
 		endif
 	else
 		set 3200154_req->person.encounter.location_cd = dLocFacilityCd
 	endif
 
	; Set Dates
 	if(dPatientClassCd = c_visit_class_preadmit)
 		set 3200154_req->person.encounter.pre_reg_dt_tm = qEncDateTime
 		set 3200154_req->person.encounter.pre_reg_prsnl_id = dPrsnlId
 	else
 		set 3200154_req->person.encounter.reg_dt_tm = qEncDateTime
	 	set 3200154_req->person.encounter.reg_prsnl_id = dPrsnlId
	 	set 3200154_req->person.encounter.arrive_dt_tm = qEncDateTime
 	endif
 
 		; Encounter Aliases
		set aliasSize = size(114327_rep->alias_info,5)
 		set stat = alterlist(3200154_req->person.encounter.encntr_aliases,aliasSize)
		declare aliasName = vc
		for(i = 1 to aliasSize)
			set aliasName = "finnbr"
	 		set 3200154_req->person.encounter.encntr_aliases[i].alias_type_name = aliasName
	 		set 3200154_req->person.encounter.encntr_aliases[i].alias = 114327_rep->alias_info[i].alias
	 		set 3200154_req->person.encounter.encntr_aliases[i].alias_pool_cd = 114327_rep->alias_info[i].alias_pool_cd
	 		set 3200154_req->person.encounter.encntr_aliases[i].encntr_alias_type_cd =
	 		value(uar_get_code_by("MEANING",319,"FIN NBR"))
		endfor
 
 		; Encounter personnel reltns
 		set stat = alterlist(3200154_req->person.encounter.encntr_prsnl_reltns,2)
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[1].reltn_type_name = "attenddoc"
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[1].prsnl_person_id = dAttendingProvId
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[1].encntr_prsnl_r_cd = c_attending_doc_cd
 
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[2].reltn_type_name = "admitdoc"
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[2].prsnl_person_id = dAttendingProvId
 		set 3200154_req->person.encounter.encntr_prsnl_reltns[2].encntr_prsnl_r_cd = c_admitting_doc_cd
 
 
 		;User Defined - Not used for this API
 		;Comments - Not used for this API
 		;Accidents - Not used for this API
 		;Transfer - Not used for this API
 		;Discharge - Not used for this API
 
 	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",3200154_req,"REC",3200154_rep)
 
 	if(3200154_rep->status_data.status = "S")
 		set iValidate = 1
 		set encounter_reply_out->encounter_id = 3200154_rep->encntr_id
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostEncounter Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Request 100082 - Remove patient lock
**************************************************************************/
subroutine DeleteLock(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100082
 
 	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = dPersonId
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100082_req,"REC",100082_rep)
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
