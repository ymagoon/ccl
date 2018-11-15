/*****************************************************************************
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
/*****************************************************************************
  Date Written:     03/12/18
  Source file name: snsro_put_patient
  Object name:      snsro_put_patient
  Program purpose:  PUTS a person into Millennium
  Tables read:      Person, Address, Phone, Person_alias
  Tables updated:   NONE
  Requests:			112505 - PM_GET_ALIAS_POOL
					114327 - PM_GET_ALIAS
					114328 - PM_GET_ALIAS_MASK
					114327 - PM_GET_ALIAS
					114382 - PM_GET_ZIPCODE_DEFAULTS
					100080 - PM_LOCK_GET_LOCKS
					100081 - PM_LOCK_ADD_LOCK
					114609 - PM.UpdatePersonData
					500726 - orm_get_custom_pat_pref_pharm
					500727 - orm_add_custom_pat_pref_pharm
					500728 - orm_del_custom_pat_pref_pharm
					100082 - PM_LOCK_DEL_LOCKS
  Executing from:   EMISSARY SERVICES
  Special Notes:	NONE
 ************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG    				*
 ************************************************************************
 * Mod 	Date     	Engineer  	Comment                            		*
 * --- 	------- 	--------- 	----------------------------------------*
 * 001 	03/17/18	RJC			V2 Initial write
 * 002  9/30/18     SVO         adjust to work for v1 and posted UDM
 ************************************************************************/
 drop program snsro_put_patient go
create program snsro_put_patient
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username" = ""
	, "PatientId" = ""
	, "PATIENT_ID_TYPE" = ""
	, "JSON Args" = ""
	, "DebugFlag" = ""
 
with OUTDEV, USERNAME, PATIENT_ID, PATIENT_ID_TYPE, JSON_ARGS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
;execute snsro2_common
execute snsro_common
;execute snsro2_common_object_init
;execute snsro2_common_object_load
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Inputs
declare sUserName				= vc with protect, noconstant("")
declare dPatientId				= f8 with protect, noconstant(0.0)
declare iDebugFlag				= i2 with protect, noconstant(0)
declare sJsonArgs				= gvc with protect, noconstant("")
declare dFacilityCd				= f8 with protect, noconstant(0.0)
declare qBirthDate				= dq8 with protect, noconstant(0)
declare dConfidentialityCd		= f8 with protect, noconstant(0.0)
declare qDeceasedDate			= dq8 with protect, noconstant(0)
declare dEthnicityCd			= f8 with protect, noconstant(0.0)
declare sFirstName				= vc with protect, noconstant("")
declare dGenderCd				= f8 with protect, noconstant(0.0)
declare dInterpreterCd			= f8 with protect, noconstant(0.0)
declare dLanguageCd				= f8 with protect, noconstant(0.0)
declare sLastName				= vc with protect, noconstant("")
declare dMaritalStatusCd		= f8 with protect, noconstant(0.0)
declare sMiddleName				= vc with protect, noconstant("")
declare sPrefix					= vc with protect, noconstant("")
declare dRaceCd					= f8 with protect, noconstant(0.0)
declare dReligionCd				= f8 with protect, noconstant(0.0)
declare sSSN					= vc with protect, noconstant("")
declare sSuffix					= vc with protect, noconstant("")
declare dVipCd					= f8 with protect, noconstant(0.0)
 
; Other
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare cr						= c1 with protect, constant(char(13)) ;Carriage Return
declare sp						= c1 with protect, constant(" ")	  ;Space
declare JSONout					= gvc with protect, noconstant("")
declare dMRNAliasPoolCd			= f8 with protect, noconstant(0.0)
declare dCMRNAliasPoolCd		= f8 with protect, noconstant(0.0)
declare dSSNAliasPoolCd			= f8 with protect, noconstant(0.0)
declare dOrganizationId			= f8 with protect, noconstant(0.0)
declare sNextMRN				= vc with protect, noconstant("")
declare sNextCMRN				= vc with protect, noconstant("")
declare iAddressSeq				= i2 with protect, noconstant(0)
declare iPhoneSeq				= i2 with protect, noconstant(0)
declare iMRNExists				= i2 with protect, noconstant(0)
declare iCMRNExists				= i2 with protect, noconstant(0)
declare iSSNExists				= i2 with protect, noconstant(0)
declare dPatientTypeCd            = f8 with protect, noconstant(0.0)
declare sNeedsInterpreter       = vc with protect, noconstant("")
declare dNeedsIntrepreter_id 	= f8 with protect, noconstant(0.0)
declare dNeedsIntrepreter_type = f8 with protect, noconstant(0.0)
declare iDeleteLock            = i2 with protect, noconstant(0)
 
; Constants
declare c_facility_location_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_now_dt_tm					= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_tel_contact_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",23056,"TEL"))
declare c_active_active_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
;declare c_no_interpreter_required_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",329,"NOINTERPRETERREQUIRED"))
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; Person Data
free record person_data
record person_data (
	1 person
		2 person_id = f8
		2 new_person_ind = i2
		2 create_dt_tm = dq8
		2 create_prsnl_id = f8
		2 person_type_cd = f8
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_full_formatted = vc
		2 autopsy_cd = f8
		2 birth_dt_cd = f8
		2 birth_dt_tm = dq8
		2 conception_dt_tm = dq8
		2 cause_of_death = vc
		2 cause_of_death_cd = f8
		2 deceased_cd = f8
		2 deceased_dt_tm = dq8
		2 deceased_source_cd = f8
		2 ethnic_grp_cd = f8
		2 language_cd = f8
		2 marital_type_cd = f8
		2 purge_option_cd = f8
		2 race_cd = f8
		2 religion_cd = f8
		2 sex_cd = f8
		2 sex_age_change_ind = f8
		2 language_dialect_cd = f8
		2 name_last = vc
		2 name_first = vc
		2 name_phonetic = c8
		2 last_encntr_dt_tm = dq8
		2 species_cd = f8
		2 confid_level_cd = f8
		2 vip_cd = f8
		2 name_first_synonym_id = f8
		2 citizenship_cd = f8
		2 mother_maiden_name = vc
		2 nationality_cd = f8
		2 ft_entity_name = c32
		2 ft_entity_id = f8
		2 name_middle_key = vc
		2 name_middle = vc
		2 data_status_cd = f8
		2 military_rank_cd = f8
		2 military_service_cd = f8
		2 vet_military_status_cd = f8
		2 military_base_location = vc
		2 birth_tz = i4
		2 birth_tz_disp = vc
		2 birth_prec_flag = i2
		2 raw_birth_dt_tm = dq8
		2 pre_person_id = f8
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 person_patient
		2 person_id = f8
		2 adopted_cd = f8
		2 bad_debt_cd = f8
		2 baptised_cd = f8
		2 birth_multiple_cd = f8
		2 birth_order = f8
		2 birth_length = f8
		2 birth_length_units_cd = f8
		2 birth_name = vc
		2 birth_weight = f8
		2 birth_weight_units_cd = f8
		2 church_cd = f8
		2 credit_hrs_taking = f8
		2 cumm_leave_days = f8
		2 current_balance = f8
		2 current_grade = f8
		2 custody_cd = f8
		2 degree_complete_cd = f8
		2 diet_type_cd = f8
		2 family_income = f8
		2 family_size = f8
		2 highest_grade_complete_cd = f8
		2 immun_on_file_cd = f8
		2 interp_required_cd = f8
		2 interp_type_cd = f8
		2 microfilm_cd = f8
		2 nbr_of_brothers = f8
		2 nbr_of_sisters = f8
		2 organ_donor_cd = f8
		2 parent_marital_status_cd = f8
		2 smokes_cd = f8
		2 tumor_registry_cd = f8
		2 last_bill_dt_tm = dq8
		2 last_bind_dt_tm = dq8
		2 last_discharge_dt_tm = dq8
		2 last_event_updt_dt_tm = dq8
		2 last_payment_dt_tm = dq8
		2 last_atd_activity_dt_tm = dq8
		2 student_cd = f8
		2 living_dependency_cd = f8
		2 living_arrangement_cd = f8
		2 living_will_cd = f8
		2 nbr_of_pregnancies = f8
		2 last_trauma_dt_tm = dq8
		2 mother_identifier = c100
		2 mother_identifier_cd = f8
		2 data_status_cd = f8
		2 disease_alert_cd = f8
		2 disease_alert_list_ind = i2
		2 disease_alert [*]
			3 value_cd = f8
		2 process_alert_cd = f8
		2 process_alert_list_ind = i2
		2 process_alert [*]
			3 value_cd = f8
		2 contact_list_cd = f8
		2 birth_order_cd = f8
		2 contact_method_cd = f8
		2 contact_time = vc
		2 callback_consent_cd = f8
		2 written_format_cd = f8
		2 prev_contact = i2
		2 source_version_number = c255
		2 source_sync_level_flag = f8
		2 iqh_participant_cd = f8
		2 family_nbr_of_minors_cnt = i4
		2 fin_statement_expire_dt_tm = dq8
		2 fin_statement_verified_dt_tm = dq8
		2 fam_income_source_list_ind = i2
		2 fam_income_source [*]
			3 value_cd = f8
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 person_names [*]
		2 action_type = c3
		2 new_person = c1
		2 person_name_id = f8
		2 person_id = f8
		2 pm_hist_tracking_id = f8
		2 transaction_dt_tm = dq8
		2 name_type_cd = f8
		2 active_ind_ind = i2
		2 active_ind = i2
		2 active_status_cd = f8
		2 active_status_dt_tm = dq8
		2 active_status_prsnl_id = f8
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
		2 name_original = c100
		2 name_format_cd = f8
		2 name_full = c100
		2 name_first = c100
		2 name_middle = c100
		2 name_last = c100
		2 name_degree = c100
		2 name_title = c100
		2 name_prefix = c100
		2 name_suffix = c100
		2 name_initials = c100
		2 data_status_cd = f8
		2 data_status_dt_tm = dq8
		2 data_status_prsnl_id = f8
		2 contributor_system_cd = f8
		2 updt_cnt = i4
		2 source_identifier = c255
		2 name_type_seq = i4
		2 change_flag = i2
		2 updt_dt_tm = dq8
		2 updt_id = f8
		2 updt_task = i4
		2 updt_applctx = i4
	1 address [*]
		2 address_id = f8
		2 parent_entity_name = vc
		2 parent_entity_id = f8
		2 address_type_cd = f8
		2 address_format_cd = f8
		2 contact_name = vc
		2 residence_type_cd = f8
		2 comment_txt = vc
		2 street_addr = vc
		2 street_addr2 = vc
		2 street_addr3 = vc
		2 street_addr4 = vc
		2 city = vc
		2 state = vc
		2 state_cd = f8
		2 zipcode = vc
		2 postal_code_help = i2
		2 zip_code_group_cd = f8
		2 postal_barcode_info = vc
		2 county = vc
		2 county_cd = f8
		2 country = vc
		2 country_cd = f8
		2 residence_cd = f8
		2 mail_stop = vc
		2 address_type_seq = f8
		2 beg_effective_mm_dd = vc
		2 end_effective_mm_dd = vc
		2 operation_hours = vc
		2 address_info_status_cd = f8
		2 prior_zipcode = vc
		2 data_status_cd = f8
		2 primary_care_cd = f8
		2 district_health_cd = f8
		2 addr_key = vc
		2 source_identifier = vc
		2 postal_help_ind = i2
		2 city_cd = f8
		2 change_flag = i2
		2 validation_expire_dt_tm = dq8
		2 validation_warning_override_ind = i2
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 phone[*]
		2 phone_id = f8
		2 parent_entity_name = vc
		2 parent_entity_id = f8
		2 phone_type_cd = f8
		2 phone_format_cd = f8
		2 phone_num = vc
		2 phone_type_seq = f8
		2 description = vc
		2 contact = vc
		2 call_instruction = vc
		2 modem_capability_cd = f8
		2 extension = vc
		2 paging_code = vc
		2 beg_effective_mm_dd = vc
		2 end_effective_mm_dd = vc
		2 operation_hours = vc
		2 data_status_cd = f8
		2 contact_method_cd = f8
		2 email = vc
		2 source_identifier = vc
		2 change_flag = i2
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 person_org_reltn[*]
		2 person_org_reltn_id = f8
		2 person_id = f8
		2 person_org_reltn_cd = f8
		2 organization_id = f8
		2 person_org_nbr = vc
		2 person_org_alias = vc
		2 empl_hire_dt_tm = dq8
		2 empl_term_dt_tm = dq8
		2 empl_retire_dt_tm = dq8
		2 empl_type_cd = f8
		2 empl_status_cd = f8
		2 empl_occupation_text = vc
		2 empl_occupation_cd = f8
		2 empl_title = vc
		2 empl_position = vc
		2 empl_contact = vc
		2 empl_contact_title = vc
		2 free_text_ind = f8
		2 ft_org_name = vc
		2 priority_seq = f8
		2 internal_seq = f8
		2 data_status_cd = f8
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 person_person_reltn [*]
		2 person_person_reltn_id = f8
		2 encntr_person_reltn_id = f8
		2 person_reltn_type_cd = f8
		2 person_id = f8
		2 encntr_id = f8
		2 person_reltn_cd = f8
		2 prior_person_reltn_cd = f8
		2 related_person_reltn_cd = f8
		2 prior_related_person_reltn_cd = f8
		2 related_person_id = f8
		2 contact_role_cd = f8
		2 genetic_relationship_ind = f8
		2 living_with_ind = f8
		2 visitation_allowed_cd = f8
		2 priority_seq = f8
		2 free_text_cd = f8
		2 ft_rel_person_name = vc
		2 internal_seq = f8
		2 free_text_person_ind = i2
		2 encntr_only_ind = i2
		2 data_status_cd = f8
		2 encntr_updt_flag = i2
		2 family_reltn_sub_type_cd = f8
		2 copy_correspondence_cd = f8
		2 source_identifier = vc
		2 person_relation_organizer_ind = i2
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 person_alias[*]
		2 person_alias_id = f8
		2 person_id = f8
		2 alias_pool_cd = f8
		2 person_alias_type_cd = f8
		2 alias = vc
		2 person_alias_sub_type_cd = f8
		2 check_digit = f8
		2 check_digit_method_cd = f8
		2 visit_seq_nbr = i4
		2 health_card_province = c3
		2 health_card_ver_code = c3
		2 data_status_cd = f8
		2 health_card_type = c32
		2 health_card_issue_dt_tm = dq8
		2 health_card_expiry_dt_tm = dq8
		2 person_alias_status_cd = f8
		2 response_cd = f8
		2 temp_ver_code = vc
		2 active_status_cd = f8
		2 active_ind = i2
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
	1 race_list_ind = i2
	1 race_list [*]
		2 value_cd = f8
)
;112505 - PM_GET_ALIAS_POOL
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
 
;114327 - PM_GET_ALIAS
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
 
;114328 - PM_GET_ALIAS_MASK
free record 114328_req
record 114328_req (
  1 alias_pool_cd = f8
  1 organization_id = f8
  1 alias_entity_name = c32
  1 alias_entity_type = c32
)
 
free record 114328_rep
record 114328_rep (
   1 mask = vc
   1 alias_entity_type_cd = f8
   1 alias_pool_cd = f8
   1 sys_assign_flag = i2
   1 auto_assign_flag = i2
   1 dup_allowed_flag = i2
   1 unique_ind = i2
   1 alias_method_cd = f8
   1 alias_pool_ext_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c8
       3 operationstatus = c1
       3 targetobjectname = c8
       3 targetobjectvalue = c100
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
 
;500726 - orm_get_custom_pat_pref_pharm
/*
free record 500726_req
record 500726_req (
  1 person_id = f8
  1 max_pharm_return_cnt = i2
)
 
 
free record 500726_rep
record 500726_rep (
   1 pharmacies [* ]
     2 pharmacy_id_str = vc
     2 default_ind = i2
     2 active_ind = i2
     2 updt_dt_tm = dq8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
*/
/*
;500727 - orm_add_custom_pat_pref_pharm
free record 500727_req
record 500727_req (
  1 person_id = f8
  1 pharmacies [*]
    2 pharmacy_id_str = vc
    2 default_ind = i2
    2 inactive_ind = i2
)
 
free record 500727_rep
record 500727_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;500728 - orm_del_custom_pat_pref_pharm
free record 500728_req
record 500728_req (
  1 person_id = f8
  1 pharmacies [*]
    2 pharmacy_id_str = vc
)
 
free record 500728_rep
record 500728_rep (
   1 person_id = f8
   1 pharmacies [* ]
     2 pharmacy_id_str = vc
     2 action_status = c1
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
*/
 ;Argument List
 free record arglist
 record arglist(
 	1 LastName = vc
 	1 FirstName = vc
 	1 MiddleName = vc
 	1 Prefix = vc
 	1 Suffix = vc
 	1 ConfidentialityId = vc
 	1 GenderId = vc
 	1 SSN = vc
 	1 VipId = vc
 	1 BirthDateTime = vc
 	1 DeceasedDateTime= vc
 	1 extendedinfo
 		2 Email = vc
 		2 Ethnicity = vc
 		2 Language = vc
 		2 Marital_Status = vc
 		2 NeedsInterpreter = vc
		2 Race = vc
		2 Religion = vc
		2 Needs_Interpreter_id = vc
 		2 Addresses[*]
 			3 Address_Id = vc
			3 Address1 = vc
			3 Address2 = vc
			3 City = vc
			3 State = vc
			3 Address_Type_cd = vc
			3 Zip = vc
	    2 Phones[*]
			3 PhoneId = vc
			3 Number = vc
			3 Phone_type_cd = vc
 
)
 
 /*
 free record arglist
 record arglist (
	1 FacilityId = vc
	1 Addresses[*]
		2 Id = vc
		2 Address1 = vc
		2 Address2 = vc
		2 City = vc
		2 State = vc
		2 TypeId = vc
		2 Zip = vc
	1 BirthDate = vc
	1 ConfidentialityId = vc
	1 DeceasedDate = vc
	1 Emails[*]
		2 Id = vc
		2 Email = vc
	1 EthnicityId = vc
	1 FirstName = vc
	1 GenderId = vc
	1 Languages[*]
		2 InterpreterId = vc
		2 IsPreferred = vc
		2 LanguageId = vc
		2 TypeId = vc
	1 LastName = vc
	1 MaritalStatusId = vc
	1 MiddleName = vc
	1 OtherKnownNames[*]
		2 Id = vc
		2 FirstName = vc
		2 MiddleName = vc
		2 LastName = vc
		2 Prefix = vc
		2 Suffix = vc
		2 TypeId = vc
	1 Phones[*]
		2 Id = vc
		2 Number = vc
		2 TypeId = vc
	1 PreferredPharmaciesIds[*] = vc
	1 Prefix = vc
	1 RaceIds[*] = vc
	1 ReligionId = vc
	1 SSN = vc
	1 Suffix = vc
	1 VipId = vc
 )
*/
; Final Reply
/*
declare final_reply = gvc
call parser("free record put_patient_reply_out go")
set final_reply = build2(
	"record put_patient_reply_out (",cr,
	"1 patient_id = f8",cr,
	CernerAudit(1),
	CernerStatusData(1),
	CernerDebug(1),
	") go")
call parser(final_reply)
*/
 
free record put_patient_reply_out
record put_patient_reply_out(
  1 patient_id       	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname     	= vc
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
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set dPatientId						= cnvtreal($PATIENT_ID)
set dPatientTypeCd                  = cnvtreal(trim($PATIENT_ID_TYPE,3))
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sJsonArgs 						= trim($JSON_ARGS,3)
 
set jrec 							= cnvtjsontorec(sJsonArgs) ;This loads the arglist record
;set dFacilityCd 					= cnvtreal(arglist->FacilityId)
set qBirthDate 						= cnvtdatetime(arglist->BirthDateTime)
set dConfidentialityCd  			= cnvtreal(arglist->ConfidentialityId)
set qDeceasedDate  					= cnvtdatetime(arglist->DeceasedDateTime)
set dEthnicityCd 					= cnvtreal(arglist->extendedinfo->Ethnicity)
set sFirstName 						= trim(arglist->FirstName,3)
set dGenderCd  						= cnvtreal(arglist->GenderId)
set dLanguageCd                     = cnvtreal(trim(arglist->extendedinfo->Language,3))
/*
if(size(arglist->Languages,5) > 0)
	set dLanguageCd 				= cnvtreal(arglist->Languages[1].LanguageId)
	set dInterpreterCd  			= cnvtreal(arglist->Languages[1].InterpreterId)
endif
*/
set sLastName 						= trim(arglist->LastName,3)
set dMaritalStatusCd 				= cnvtreal(arglist->extendedinfo->Marital_Status)
set sMiddleName   					= trim(arglist->MiddleName,3)
set sPrefix 						= trim(arglist->Prefix,3)
set dReligionCd 					= cnvtreal(arglist->extendedinfo->Religion)
set sSSN 							= trim(arglist->SSN)
set sSuffix 						= trim(arglist->Suffix)
set dVipCd 							= cnvtreal(arglist->VipId)
set sNeedsInterpreter       		= trim(arglist->extendedinfo->NeedsInterpreter,3)
set dNeedsIntrepreter_id = cnvtreal(trim(arglist->extendedinfo->Needs_Interpreter_id,3))
;set dNeedsInterpreter_type          = cnvtreal(trim(arglist->extendedinfo->Needs_Interpreter_id->name,3))
set dRaceCd = cnvtreal(trim(arglist->extendedinfo->Race,3))
;Other
set dPrsnlId						= GetPrsnlIDfromUserName(sUserName)
 
 
if(iDebugFlag)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("sJsonArgs -> ",sJsonArgs))
	call echo(build("dFacilityCd -> ",dFacilityCd))
	call echo(build("qBirthDate -> ",qBirthDate))
	call echo(build("dConfidentialityCd -> ",dConfidentialityCd))
	call echo(build("qDeceasedDate -> ",qDeceasedDate))
	call echo(build("dEthnicityCd -> ",dEthnicityCd))
	call echo(build("sFirstName -> ",sFirstName))
	call echo(build("dGenderCd -> ",dGenderCd))
	call echo(build("dInterpreterCd -> ",dInterpreterCd))
	call echo(build("dLanguageCd -> ",dLanguageCd))
	call echo(build("sLastName -> ",sLastName))
	call echo(build("dMaritalStatusCd -> ",dMaritalStatusCd))
	call echo(build("sMiddleName -> ",sMiddleName))
	call echo(build("sPrefix -> ",sPrefix))
	call echo(build("dReligionCd -> ",dReligionCd))
	call echo(build("sSSN -> ",sSSN))
	call echo(build("sSuffix -> ",sSuffix))
	call echo(build("dVipCd -> ",dVipCd))
endif
 
 
 
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateInputParams(null)					= null with protect
declare GetAliasPools(null)							= i2 with protect ;112505 - PM_GET_ALIAS_POOL
declare GetPersonData(null)							= i2 with protect
declare ValidateInputIds(null)						= null with protect
declare GetNextMrn(alias_pool = f8, type = vc)		= i2 with protect ;114327 - PM_GET_ALIAS
declare GetSSNAliasPoolAttributes(null)				= i2 with protect ;114328 - PM_GET_ALIAS_MASK
declare CheckSSNDuplicates(null)					= i2 with protect ;114327 - PM_GET_ALIAS
declare GetLocks(null)								= i2 with protect ;100080 pm_lock_get_locks
declare AddLock(null)								= i2 with protect ;100081 pm_lock_add_lock
declare AddPerson(null)								= null with protect ;114609 - PM.UpdatePersonData
declare GetZipDefaults(zipcode = vc)				= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare UpdatePhoneAddressData(null)				= null with protect
declare DeleteLock(null)							= i2 with protect ;100082 - PM_LOCK_DEL_LOCKS
;declare AddPreferredPharmacy(null)					= i2 with protect ;500727 - orm_add_custom_pat_pref_pharm
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
;Validate Username
set iRet = PopulateAudit(sUserName, dPatientId, put_patient_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate PatientId
if(dPatientId = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid PatientId.",
	"2003", build("Invalid PatientId: ", trim($PATIENT_ID,3)), put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
 
; Get Alias Pools for the Facility -- 112505 - PM_GET_ALIAS_POOL
set iRet = GetAliasPools(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not retrieve Alias Pools - 112505.",
	"9999", "Could not retrieve Alias Pools - 112505.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Person Data
set iRet = GetPersonData(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Invalid PatientId.",
	"2003", "Invalid PatientId.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Input Ids (Address, Phone, Email, OtherName)
call ValidateInputIds(null)
 
; Get Next MRN sequence -- 114327 - PM_GET_ALIAS
if(dMRNAliasPoolCd > 0 and iMRNExists = 0)
	set iRet = GetNextMrn(dMRNAliasPoolCd, "MRN")
	if(iRet = 0)
		call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not retrieve MRN - 114327.",
		"9999", "Could not retrieve MRN - 114327.", put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Get Next CMRN sequence if the site uses it -- 114327 - PM_GET_ALIAS
if(dCMRNAliasPoolCd > 0 and iCMRNExists = 0)
	set iRet = GetNextMrn(dCMRNAliasPoolCd, "CMRN")
	if(iRet = 0)
		call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not retrieve CMRN - 114327.",
		"9999", "Could not retrieve CMRN - 114327.", put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Get SSN Alias pool attributes -- 114328 - PM_GET_ALIAS_MASK
set iRet = GetSSNAliasPoolAttributes(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not retrieve SSN alias pool data - 114328.",
	"9999", "Could not retrieve SSN alias pool data - 114328.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; If duplicates are not allowed, Check if SSN already exists in the system -- 114327 - PM_GET_ALIAS
if(sSSN > " ")
	if(114328_rep->dup_allowed_flag = 3)
		set iRet = CheckSSNDuplicates(null)
		if(iRet = 0)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "SSN already exists and duplicates are not allowed.",
			"9999", "SSN already exists and duplicates are not allowed.", put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
endif
 
; Check for PM Lock -- 100080 - PM_LOCK_GET_LOCKS
set iRet = GetLocks(null)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Person is locked. Please try updating again later.",
	"9999", "Person is locked. Please try updating again later.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Add PM Lock -- 100081 - PM_LOCK_ADD_LOCK
set iRet = AddLock(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not add lock - 100081",
	"9999", "Could not add lock - 100081.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Update Person
set iRet = UpdatePerson(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not update  person- 114609.",
	"9999", "Could not update  person- 114609.", put_patient_reply_out)
	;deletes the lock if there is an error
	set lockDelete = DeleteLock(null)
	go to EXIT_SCRIPT
endif
 
 ; Delete PM Lock -- 100082 - PM_LOCK_DEL_LOCKS
set iRet = DeleteLock(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not remove lock - 100082.",
	"9999", "Could not remove lock - 100082.", put_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
;Update Phone & Address data status codes
call UpdatePhoneAddressData(null)
 
/*
; Add Preferred Pharmacy -- 500727 - orm_add_custom_pat_pref_pharm
 
if(size(arglist->PreferredPharmaciesIds,5) > 0)
	set iRet = AddPreferredPharmacy(null)
	if(iRet = 0)
		call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not add preferred pharmacy - 101107.",
		"9999", "Could not add preferred pharmacy - 101107.", put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 endif
*/
 
;Set Audit to Successful
call ErrorHandler2("SUCCESS", "S", "PUT PATIENT", "Process completed successfully.",
"0000", "Process completed successfully.", put_patient_reply_out)
 
#EXIT_SCRIPT
 
;deletes locks if errors inside updatePerson
if(iDeleteLock > 0)
	set lockDelete = DeleteLock(null)
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
;call ErrorHandler2("SUCCESS", "S", "PUT PATIENT", "Process completed successfully.",
;"0000", "Process completed successfully.", put_patient_reply_out)
set JSONout = CNVTRECTOJSON(put_patient_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_patient.json")
	call echo(build2("_file : ", _file))
	call echojson(put_patient_reply_out, _file, 0)
	call echo(JSONout)
	call echorecord(put_patient_reply_out)
endif
 
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
 
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Validate Facility
/*
	set iRet = GetLocationTypeCode(dFacilityCd)
	if(iRet != c_facility_location_type_cd)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Facility.",
		"2073", build2("Invalid Facility: ",arglist->FacilityId), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
*/
	;Validate Address Exists
	if(size(arglist->extendedinfo->Addresses,5) = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "An address is required.",
		"9999", build2("An address is required."), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Validate Phone Exists
	if(size(arglist->extendedinfo->Phones,5) = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "A phone number is required.",
		"9999", build2("A phone number is required."), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Validate Birthdate
	if(qBirthDate = 0 or qBirthDate > sysdate)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid DateOfBirth.",
		"2037", build2("Invalid DateOfBirth: ",arglist->BirthDate), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Confidentiality
	if(dConfidentialityCd > 0)
		set iRet = GetCodeSet(dConfidentialityCd)
		if(iRet != 87)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Confientiality.",
			"2063", build2("Invalid Confientiality: ",dConfidentialityCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate DeceasedDate
	if(qDeceasedDate > 0)
		if(qDeceasedDate < qBirthDate or qDeceasedDate > sysdate)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid DeceasedDate.",
			"2064", build2("Invalid DeceasedDate: ",arglist->DeceasedDate), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Ethnicity
	if(dEthnicityCd > 0)
		set iRet = GetCodeSet(dEthnicityCd)
		if(iRet != 27)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Ethnicity.",
			"2068", build2("Invalid Ethnicity: ",dEthnicityCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate FirstName
	if(sFirstName <= " ")
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid FirstName.",
		"2057", build2("Invalid FirstName: ",sFirstName), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate LastName
	if(sLastName <= " ")
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid LastName.",
		"2058", build2("Invalid LastName: ",sLastName), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Gender
	set iRet = GetCodeSet(dGenderCd)
	if(iRet != 57)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Gender.",
		"2038", build2("Invalid Gender: ",dGenderCd), put_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Interpreter
	if(dNeedsIntrepreter_id > 0)
		set iRet = GetCodeSet(dNeedsIntrepreter_id)
		if(iRet != 329)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid InterpreterId.",
			"2111", build2("Invalid InterpreterId: ",dInterpreterCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	 ; Validate Language
	 if(dLanguageCd > 0)
		set iRet = GetCodeSet(dLanguageCd)
		if(iRet != 36)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Language.",
			"2069", build2("Invalid Language: ",dLanguageCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Marital Status
	if(dMaritalStatusCd > 0)
		set iRet = GetCodeSet(dMaritalStatusCd)
		if(iRet != 38)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid MaritalStatus.",
			"2072", build2("Invalid MaritalStatus: ",dMaritalStatusCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Religion
	if(dReligionCd > 0)
		set iRet = GetCodeSet(dReligionCd)
		if(iRet != 49)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Religion.",
			"2070", build2("Invalid Religion: ",dReligionCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Race
	if(dRaceCd > 0)
		set iRet = GetCodeSet(dRaceCd)
		if(iRet != 282)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Race.",
			"2071", build2("Invalid Race: ",dRaceCd), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
 
	; Validate SSN
	if(sSSN > " ")
		set sSSN = trim(replace(sSSN,"-",""),3)
		if(size(sSSN) != 9 and cnvtreal(sSSN) > 0)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid SSN.",
			"2061", build2("Invalid SSN: ",sSSN), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate VIP
	if(dVipCd > 0)
		set iRet = GetCodeSet(dVipCd)
		if(iRet != 67)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid VIP.",
			"2062", build2("Invalid VIP: ",sSSN), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate PatientType
	if( dPatientTypeCd > 0)
		set iRet = GetCodeSet(dPatientTypeCd)
		if(iRet != 71)
			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Patient Type.",
			"2065", build2("Invalid PatientType: ",cnvtstring(dPatientTypeCd)), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
 	;Validate Email
 	if(size(arglist->extendedinfo->Email) > 0)
 		set found = findstring("@",arglist->extendedinfo->Email)
 		if(found < 0)
 			call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid email.",
			"9999", build2("Invalid email: ",cnvtstring(dPatientTypeCd)), put_patient_reply_out)
			go to EXIT_SCRIPT
		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
 
/*************************************************************************
;  Name: GetAliasPools(null)	= null ;112505 - PM_GET_ALIAS_POOL
;  Description: Get Alias pool listing for the facility. This determines which pool to use for SSN and MRN
**************************************************************************/
subroutine GetAliasPools(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPools Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from encounter e
	plan e
		where e.person_id = dPatientId
			and e.active_ind = 1
		order by e.reg_dt_tm desc
	head report
		dFacilityCd = e.loc_facility_cd
	with nocounter
 
	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 112505
 
	;Get Org Id
	select into "nl:"
	from location l
	where l.location_cd = dFacilityCd
	detail
		dOrganizationId = l.organization_id
	with nocounter
 
	;Set request params
	set stat = alterlist(112505_req->org,1)
	set 112505_req->org[1].organization_id = dOrganizationId
 
	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",112505_req,"REC",112505_rep)
	;Verify status & Set variables
	if(112505_rep->status_data.status = "S")
		set iValidate = 1
 
		select into "nl:"
		from (dummyt d with seq = size(112505_rep->org[1].alias,5))
		where 112505_rep->org[1].alias[d.seq].alias_entity_name = "PERSON_ALIAS"
		detail
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "SSN")
				dSSNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "MRN")
				dMRNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "CMRN")
				dCMRNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
 		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAliasPools Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetPersonData(null) = i2
;  Description: Gets Person demographics
**************************************************************************/
 
subroutine GetPersonData(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPersonData Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	; Person
	select into "nl:"
	from person p
	plan p where p.person_id  = dPatientId
	detail
		iValidate = 1
		person_data->person.person_id = p.person_id
		person_data->person.create_dt_tm = p.create_dt_tm
		person_data->person.create_prsnl_id = p.create_prsnl_id
		person_data->person.person_type_cd = p.person_type_cd
		person_data->person.name_last_key = p.name_last_key
		person_data->person.name_first_key = p.name_first_key
		person_data->person.name_full_formatted = p.name_full_formatted
		person_data->person.autopsy_cd = p.autopsy_cd
		person_data->person.birth_dt_cd = p.birth_dt_cd
		person_data->person.birth_dt_tm = p.birth_dt_tm
		person_data->person.conception_dt_tm = p.conception_dt_tm
		person_data->person.cause_of_death = p.cause_of_death
		person_data->person.cause_of_death_cd = p.cause_of_death_cd
		person_data->person.deceased_cd = p.deceased_cd
		person_data->person.deceased_dt_tm = p.deceased_dt_tm
		person_data->person.deceased_source_cd = p.deceased_source_cd
		person_data->person.ethnic_grp_cd = p.ethnic_grp_cd
		person_data->person.language_cd = p.language_cd
		person_data->person.marital_type_cd = p.marital_type_cd
		person_data->person.purge_option_cd = p.purge_option_cd
		person_data->person.race_cd = p.race_cd
		person_data->person.religion_cd = p.religion_cd
		person_data->person.sex_cd = p.sex_cd
		person_data->person.sex_age_change_ind = p.sex_age_change_ind
		person_data->person.language_dialect_cd = p.language_dialect_cd
		person_data->person.name_last = p.name_last
		person_data->person.name_first = p.name_first
		person_data->person.name_phonetic = p.name_phonetic
		person_data->person.last_encntr_dt_tm = p.last_encntr_dt_tm
		person_data->person.species_cd = p.species_cd
		person_data->person.confid_level_cd = p.confid_level_cd
		person_data->person.vip_cd = p.vip_cd
		person_data->person.name_first_synonym_id = p.name_first_synonym_id
		person_data->person.citizenship_cd = p.citizenship_cd
		person_data->person.mother_maiden_name = p.mother_maiden_name
		person_data->person.nationality_cd = p.nationality_cd
		person_data->person.ft_entity_name = p.ft_entity_name
		person_data->person.ft_entity_id = p.ft_entity_id
		person_data->person.name_middle_key = p.name_middle_key
		person_data->person.name_middle = p.name_middle
		person_data->person.data_status_cd = p.data_status_cd
		person_data->person.military_rank_cd = p.military_rank_cd
		person_data->person.military_service_cd = p.military_service_cd
		person_data->person.vet_military_status_cd = p.vet_military_status_cd
		person_data->person.military_base_location = p.military_base_location
		person_data->person.birth_tz = p.birth_tz
		person_data->person.birth_tz_disp = datetimezonebyindex(p.birth_tz)
		person_data->person.birth_prec_flag = p.birth_prec_flag
		person_data->person.raw_birth_dt_tm	= p.birth_dt_tm
		person_data->person.active_ind = p.active_ind
		person_data->person.active_status_cd = p.active_status_cd
		person_data->person.beg_effective_dt_tm = p.beg_effective_dt_tm
		person_data->person.end_effective_dt_tm = p.end_effective_dt_tm
	with nocounter
 
	if(iValidate)
		;Person Patient
		select into "nl:"
		from person_patient pp
		where pp.person_id = dPatientId
		detail
			person_data->person_patient.person_id = pp.person_id
			person_data->person_patient.adopted_cd = pp.adopted_cd
			person_data->person_patient.bad_debt_cd = pp.bad_debt_cd
			person_data->person_patient.baptised_cd = pp.baptised_cd
			person_data->person_patient.birth_multiple_cd = pp.birth_multiple_cd
			person_data->person_patient.birth_order = pp.birth_order
			person_data->person_patient.birth_length = pp.birth_length
			person_data->person_patient.birth_length_units_cd = pp.birth_length_units_cd
			person_data->person_patient.birth_name = pp.birth_name
			person_data->person_patient.birth_weight = pp.birth_weight
			person_data->person_patient.birth_weight_units_cd = pp.birth_weight_units_cd
			person_data->person_patient.church_cd = pp.church_cd
			person_data->person_patient.credit_hrs_taking = pp.credit_hrs_taking
			person_data->person_patient.cumm_leave_days = pp.cumm_leave_days
			person_data->person_patient.current_balance = pp.current_balance
			person_data->person_patient.current_grade = pp.current_grade
			person_data->person_patient.custody_cd = pp.custody_cd
			person_data->person_patient.degree_complete_cd = pp.degree_complete_cd
			person_data->person_patient.diet_type_cd = pp.diet_type_cd
			person_data->person_patient.family_income = pp.family_income
			person_data->person_patient.family_size = pp.family_size
			person_data->person_patient.highest_grade_complete_cd = pp.highest_grade_complete_cd
			person_data->person_patient.immun_on_file_cd = pp.immun_on_file_cd
			person_data->person_patient.interp_required_cd = pp.interp_required_cd
			person_data->person_patient.interp_type_cd = pp.interp_type_cd
			person_data->person_patient.microfilm_cd = pp.microfilm_cd
			person_data->person_patient.nbr_of_brothers = pp.nbr_of_brothers
			person_data->person_patient.nbr_of_sisters = pp.nbr_of_sisters
			person_data->person_patient.organ_donor_cd = pp.organ_donor_cd
			person_data->person_patient.parent_marital_status_cd = pp.parent_marital_status_cd
			person_data->person_patient.smokes_cd = pp.smokes_cd
			person_data->person_patient.tumor_registry_cd = pp.tumor_registry_cd
			person_data->person_patient.last_bill_dt_tm = pp.last_bill_dt_tm
			person_data->person_patient.last_bind_dt_tm = pp.last_bind_dt_tm
			person_data->person_patient.last_discharge_dt_tm = pp.last_discharge_dt_tm
			person_data->person_patient.last_event_updt_dt_tm = pp.last_event_updt_dt_tm
			person_data->person_patient.last_payment_dt_tm = pp.last_payment_dt_tm
			person_data->person_patient.last_atd_activity_dt_tm = pp.last_atd_activity_dt_tm
			person_data->person_patient.student_cd = pp.student_cd
			person_data->person_patient.living_dependency_cd = pp.living_dependency_cd
			person_data->person_patient.living_arrangement_cd = pp.living_arrangement_cd
			person_data->person_patient.living_will_cd = pp.living_will_cd
			person_data->person_patient.nbr_of_pregnancies = pp.nbr_of_pregnancies
			person_data->person_patient.last_trauma_dt_tm = pp.last_trauma_dt_tm
			person_data->person_patient.mother_identifier = pp.mother_identifier
			person_data->person_patient.data_status_cd = pp.data_status_cd
			person_data->person_patient.disease_alert_cd = pp.disease_alert_cd
			person_data->person_patient.process_alert_cd = pp.process_alert_cd
			person_data->person_patient.contact_list_cd = pp.contact_list_cd
			person_data->person_patient.birth_order_cd = pp.birth_order_cd
			person_data->person_patient.contact_method_cd = pp.contact_method_cd
			person_data->person_patient.contact_time = pp.contact_time
			person_data->person_patient.callback_consent_cd = pp.callback_consent_cd
			person_data->person_patient.written_format_cd = pp.written_format_cd
			person_data->person_patient.prev_contact = pp.prev_contact_ind
			person_data->person_patient.source_version_number = pp.source_version_number
			person_data->person_patient.iqh_participant_cd = pp.iqh_participant_cd
			person_data->person_patient.family_nbr_of_minors_cnt = pp.family_nbr_of_minors_cnt
			person_data->person_patient.fin_statement_expire_dt_tm = pp.fin_statement_expire_dt_tm
			person_data->person_patient.fin_statement_verified_dt_tm = pp.fin_statement_verified_dt_tm
			person_data->person_patient.active_ind = pp.active_ind
			person_data->person_patient.active_status_cd = pp.active_status_cd
			person_data->person_patient.beg_effective_dt_tm = pp.beg_effective_dt_tm
			person_data->person_patient.end_effective_dt_tm = pp.end_effective_dt_tm
		with nocounter
 
		; Person Names
		select into "nl:"
		from person_name pn
		plan pn where pn.person_id = dPatientId
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->person_names,x)
 
			person_data->person_names[x].person_name_id = pn.person_name_id
			person_data->person_names[x].person_id = pn.person_id
			person_data->person_names[x].name_type_cd = pn.name_type_cd
			person_data->person_names[x].active_ind = pn.active_ind
			person_data->person_names[x].active_status_cd = pn.active_status_cd
			person_data->person_names[x].active_status_dt_tm = pn.active_status_dt_tm
			person_data->person_names[x].active_status_prsnl_id = pn.active_status_prsnl_id
			person_data->person_names[x].beg_effective_dt_tm = pn.beg_effective_dt_tm
			person_data->person_names[x].end_effective_dt_tm = pn.end_effective_dt_tm
			person_data->person_names[x].name_original = pn.name_original
			person_data->person_names[x].name_format_cd = pn.name_format_cd
			person_data->person_names[x].name_full = pn.name_full
			person_data->person_names[x].name_first = pn.name_first
			person_data->person_names[x].name_middle = pn.name_middle
			person_data->person_names[x].name_last = pn.name_last
			person_data->person_names[x].name_degree = pn.name_degree
			person_data->person_names[x].name_title = pn.name_title
			person_data->person_names[x].name_prefix = pn.name_prefix
			person_data->person_names[x].name_suffix = pn.name_suffix
			person_data->person_names[x].name_initials = pn.name_initials
			person_data->person_names[x].data_status_cd = pn.data_status_cd
			person_data->person_names[x].data_status_dt_tm = pn.data_status_dt_tm
			person_data->person_names[x].data_status_prsnl_id = pn.data_status_prsnl_id
			person_data->person_names[x].contributor_system_cd = pn.contributor_system_cd
			person_data->person_names[x].updt_cnt = pn.updt_cnt
			person_data->person_names[x].source_identifier = pn.source_identifier
			person_data->person_names[x].name_type_seq = pn.name_type_seq
			person_data->person_names[x].updt_dt_tm = pn.updt_dt_tm
			person_data->person_names[x].updt_id = pn.updt_id
			person_data->person_names[x].updt_task = pn.updt_task
			person_data->person_names[x].updt_applctx = pn.updt_applctx
		with nocounter
 
		; Addresses
		select into "nl:"
		from address a
		where a.parent_entity_id = dPatientId
			and a.parent_entity_name = "PERSON"
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->address,x)
 
			person_data->address[x].address_id = a.address_id
			person_data->address[x].parent_entity_name = a.parent_entity_name
			person_data->address[x].parent_entity_id = a.parent_entity_id
			person_data->address[x].address_type_cd = a.address_type_cd
			person_data->address[x].address_format_cd = a.address_format_cd
			person_data->address[x].contact_name = a.contact_name
			person_data->address[x].residence_type_cd = a.residence_type_cd
			person_data->address[x].comment_txt = a.comment_txt
			person_data->address[x].street_addr = a.street_addr
			person_data->address[x].street_addr2 = a.street_addr2
			person_data->address[x].street_addr3 = a.street_addr3
			person_data->address[x].street_addr4 = a.street_addr4
			person_data->address[x].city = a.city
			person_data->address[x].state = a.state
			person_data->address[x].state_cd = a.state_cd
			person_data->address[x].zipcode = a.zipcode
			person_data->address[x].zip_code_group_cd = a.zip_code_group_cd
			person_data->address[x].postal_barcode_info = a.postal_barcode_info
			person_data->address[x].county = a.county
			person_data->address[x].county_cd = a.county_cd
			person_data->address[x].country = a.country
			person_data->address[x].country_cd = a.country_cd
			person_data->address[x].residence_cd = a.residence_cd
			person_data->address[x].mail_stop = a.mail_stop
			person_data->address[x].address_type_seq = a.address_type_seq
			person_data->address[x].beg_effective_mm_dd = cnvtstring(a.beg_effective_mm_dd)
			person_data->address[x].end_effective_mm_dd = cnvtstring(a.end_effective_mm_dd)
			person_data->address[x].operation_hours = a.operation_hours
			person_data->address[x].address_info_status_cd = a.address_info_status_cd
			person_data->address[x].beg_effective_dt_tm = a.beg_effective_dt_tm
			person_data->address[x].end_effective_dt_tm = a.end_effective_dt_tm
			person_data->address[x].data_status_cd = a.data_status_cd
			person_data->address[x].primary_care_cd = a.primary_care_cd
			person_data->address[x].district_health_cd = a.district_health_cd
			person_data->address[x].source_identifier = a.source_identifier
			person_data->address[x].city_cd = a.city_cd
			person_data->address[x].validation_expire_dt_tm = a.validation_expire_dt_tm
			person_data->address[x].active_ind = a.active_ind
			person_data->address[x].active_status_cd = a.active_status_cd
		with nocounter
 
		; Phones
		select into "nl:"
		from phone p
		where p.parent_entity_id = dPatientId
			and p.parent_entity_name = "PERSON"
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->phone,x)
 
			person_data->phone[x].phone_id = p.phone_id
			person_data->phone[x].parent_entity_name = p.parent_entity_name
			person_data->phone[x].parent_entity_id = p.parent_entity_id
			person_data->phone[x].phone_type_cd = p.phone_type_cd
			person_data->phone[x].phone_format_cd = p.phone_format_cd
			person_data->phone[x].phone_num = p.phone_num
			person_data->phone[x].phone_type_seq = p.phone_type_seq
			person_data->phone[x].description = p.description
			person_data->phone[x].contact = p.contact
			person_data->phone[x].call_instruction = p.call_instruction
			person_data->phone[x].modem_capability_cd = p.modem_capability_cd
			person_data->phone[x].extension = p.extension
			person_data->phone[x].paging_code = p.paging_code
			person_data->phone[x].beg_effective_mm_dd = cnvtstring(p.beg_effective_mm_dd)
			person_data->phone[x].end_effective_mm_dd = cnvtstring(p.end_effective_mm_dd)
			person_data->phone[x].operation_hours = p.operation_hours
			person_data->phone[x].data_status_cd = p.data_status_cd
			person_data->phone[x].beg_effective_dt_tm = p.beg_effective_dt_tm
			person_data->phone[x].end_effective_dt_tm = p.end_effective_dt_tm
			person_data->phone[x].contact_method_cd = p.contact_method_cd
			person_data->phone[x].source_identifier = p.source_identifier
			person_data->phone[x].active_ind = p.active_ind
			person_data->phone[x].active_status_cd = p.active_status_cd
		with nocounter
 
		; Person Org Reltn
		select into "nl:"
		from person_org_reltn por
		where por.person_id = dPatientId
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->person_org_reltn,x)
 
			person_data->person_org_reltn[x].person_org_reltn_id = por.person_org_reltn_id
			person_data->person_org_reltn[x].person_id = por.person_id
			person_data->person_org_reltn[x].person_org_reltn_cd = por.person_org_reltn_cd
			person_data->person_org_reltn[x].organization_id = por.organization_id
			person_data->person_org_reltn[x].person_org_nbr = por.person_org_nbr
			person_data->person_org_reltn[x].person_org_alias = por.person_org_alias
			person_data->person_org_reltn[x].empl_hire_dt_tm = por.empl_hire_dt_tm
			person_data->person_org_reltn[x].empl_term_dt_tm = por.empl_term_dt_tm
			person_data->person_org_reltn[x].empl_retire_dt_tm = por.empl_retire_dt_tm
			person_data->person_org_reltn[x].empl_type_cd = por.empl_type_cd
			person_data->person_org_reltn[x].empl_status_cd = por.empl_status_cd
			person_data->person_org_reltn[x].empl_occupation_text = por.empl_occupation_text
			person_data->person_org_reltn[x].empl_occupation_cd = por.empl_occupation_cd
			person_data->person_org_reltn[x].empl_title = por.empl_title
			person_data->person_org_reltn[x].empl_position = por.empl_position
			person_data->person_org_reltn[x].empl_contact = por.empl_contact
			person_data->person_org_reltn[x].empl_contact_title = por.empl_contact_title
			person_data->person_org_reltn[x].free_text_ind = por.free_text_ind
			person_data->person_org_reltn[x].ft_org_name = por.ft_org_name
			person_data->person_org_reltn[x].priority_seq = por.priority_seq
			person_data->person_org_reltn[x].internal_seq = por.internal_seq
			person_data->person_org_reltn[x].data_status_cd = por.data_status_cd
			person_data->person_org_reltn[x].active_ind = por.active_ind
			person_data->person_org_reltn[x].active_status_cd = por.active_status_cd
			person_data->person_org_reltn[x].beg_effective_dt_tm = por.beg_effective_dt_tm
			person_data->person_org_reltn[x].end_effective_dt_tm = por.end_effective_dt_tm
		with nocounter
 
		; Person Person Reltn
		select into "nl:"
		from person_person_reltn ppr
		where ppr.person_id = dPatientId
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->person_person_reltn,x)
 
			person_data->person_person_reltn[x].person_person_reltn_id = ppr.person_person_reltn_id
			person_data->person_person_reltn[x].person_reltn_type_cd = ppr.person_reltn_type_cd
			person_data->person_person_reltn[x].person_id = ppr.person_id
			person_data->person_person_reltn[x].person_reltn_cd = ppr.person_reltn_cd
			person_data->person_person_reltn[x].related_person_reltn_cd = ppr.related_person_reltn_cd
			person_data->person_person_reltn[x].related_person_id = ppr.related_person_id
			person_data->person_person_reltn[x].contact_role_cd = ppr.contact_role_cd
			person_data->person_person_reltn[x].genetic_relationship_ind = ppr.genetic_relationship_ind
			person_data->person_person_reltn[x].living_with_ind = ppr.living_with_ind
			person_data->person_person_reltn[x].visitation_allowed_cd = ppr.visitation_allowed_cd
			person_data->person_person_reltn[x].priority_seq = ppr.priority_seq
			person_data->person_person_reltn[x].free_text_cd = ppr.free_text_cd
			person_data->person_person_reltn[x].ft_rel_person_name = ppr.ft_rel_person_name
			person_data->person_person_reltn[x].internal_seq = ppr.internal_seq
			person_data->person_person_reltn[x].data_status_cd = ppr.data_status_cd
			person_data->person_person_reltn[x].family_reltn_sub_type_cd = ppr.family_reltn_sub_type_cd
			person_data->person_person_reltn[x].copy_correspondence_cd = ppr.copy_correspondence_cd
			person_data->person_person_reltn[x].source_identifier = ppr.source_identifier
			person_data->person_person_reltn[x].active_ind = ppr.active_ind
			person_data->person_person_reltn[x].active_status_cd = ppr.active_status_cd
			person_data->person_person_reltn[x].beg_effective_dt_tm = ppr.beg_effective_dt_tm
			person_data->person_person_reltn[x].end_effective_dt_tm = ppr.end_effective_dt_tm
		with nocounter
 
		; Person Alias
		select into "nl:"
		from person_alias pa
		where pa.person_id = dPatientId
			and pa.active_ind = 1
			and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->person_alias,x)
 
			if(dMRNAliasPoolCd = pa.alias_pool_cd)
				iMRNExists = 1
			endif
 
			if(dCMRNAliasPoolCd = pa.alias_pool_cd)
				iCMRNExists = 1
			endif
 
			if(dSSNAliasPoolCd = pa.alias_pool_cd)
				iSSNExists = 1
			endif
 
			person_data->person_alias[x].person_alias_id = pa.person_alias_id
			person_data->person_alias[x].person_id = pa.person_id
			person_data->person_alias[x].alias_pool_cd = pa.alias_pool_cd
			person_data->person_alias[x].person_alias_type_cd = pa.person_alias_type_cd
			person_data->person_alias[x].alias = pa.alias
			person_data->person_alias[x].person_alias_sub_type_cd = pa.person_alias_sub_type_cd
			person_data->person_alias[x].check_digit = pa.check_digit
			person_data->person_alias[x].check_digit_method_cd = pa.check_digit_method_cd
			person_data->person_alias[x].visit_seq_nbr = pa.visit_seq_nbr
			person_data->person_alias[x].health_card_province = pa.health_card_province
			person_data->person_alias[x].health_card_ver_code = pa.health_card_ver_code
			person_data->person_alias[x].data_status_cd = pa.data_status_cd
			person_data->person_alias[x].health_card_type = pa.health_card_type
			person_data->person_alias[x].health_card_issue_dt_tm = pa.health_card_issue_dt_tm
			person_data->person_alias[x].health_card_expiry_dt_tm = pa.health_card_expiry_dt_tm
			person_data->person_alias[x].person_alias_status_cd = pa.person_alias_status_cd
			person_data->person_alias[x].active_ind = pa.active_ind
			person_data->person_alias[x].active_status_cd = pa.active_status_cd
			person_data->person_alias[x].beg_effective_dt_tm = pa.beg_effective_dt_tm
			person_data->person_alias[x].end_effective_dt_tm = pa.end_effective_dt_tm
		with nocounter
 
		; Person Code_Value_R (Race List)
		select into "nl:"
		from person_code_value_r pcvr
		where pcvr.person_id = dPatientId
			and pcvr.active_ind = 1
			and pcvr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pcvr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and pcvr.code_set = 282
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(person_data->race_list,x)
 
			person_data->race_list[x].value_cd = pcvr.code_value
		with nocounter

	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPersonData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;  Name: ValidateInputIds(null)	= null
;  Description: Ensures the Address, Phone, Email, OtherNames Ids are for the PatientId provided
**************************************************************************/
 
subroutine ValidateInputIds(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputIds Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Validate Address Ids
	set addrSize = size(arglist->extendedinfo->Addresses,5)
	if(addrSize > 0)
		declare addrId = f8
		for(i = 1 to addrSize)
			set addrId = cnvtreal(arglist->extendedinfo->Addresses[i].Address_Id)
			if(addrId > 0)
				set check = 0
				select into "nl:"
				from (dummyt d with seq = size(person_data->address,5))
				plan d where person_data->address[d.seq].address_id = addrId
				detail
					check = 1
				with nocounter
 
				if(check = 0)
					call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Address_Id for Patient.",
					"9999", build2("Invalid Address_Id: ",arglist->extendedinfo->Addresses[i].Address_Id), put_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
		endfor
	endif
 
	;Validate Phone Ids
	set phSize = size(arglist->extendedinfo->Phones,5)
	if(phSize > 0)
		declare phId = f8
		for(i = 1 to phSize)
			set phId = cnvtreal(arglist->extendedinfo->Phones[i].PhoneId)
			if(phId > 0)
				set check = 0
				select into "nl:"
				from (dummyt d with seq = size(person_data->phone,5))
				plan d where person_data->phone[d.seq].phone_id = phId
				detail
					check = 1
				with nocounter
 
				if(check = 0)
					call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid PhoneId for Patient.",
					"9999", build2("Invalid PhoneId: ",arglist->extendedinfo->Phones[i].PhoneId), put_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
		endfor
	endif
 
/*
	;Validate OtherNames Ids
	set oknSize = size(arglist->OtherKnownNames,5)
	if(oknSize > 0)
		declare oknId = f8
		for(i = 1 to oknSize)
			set oknId = cnvtreal(arglist->OtherKnownNames[i].Id)
			if(oknId > 0)
				set check = 0
				select into "nl:"
				from (dummyt d with seq = size(person_data->person_names,5))
				plan d where person_data->person_names[d.seq].person_name_id = oknId
				detail
					check = 1
				with nocounter
 
				if(check = 0)
					call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid OtherKnownNameId for Patient.",
					"9999", build2("Invalid OtherKnownNameId: ",arglist->OtherKnownNames[i].Id), put_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
		endfor
	endif
 
*/
/*
	;Validate Email Ids
	set emailSize = size(arglist->Emails,5)
	if(emailSize > 0)
		declare emId = f8
		for(i = 1 to emailSize)
			set emId = cnvtreal(arglist->Emails[i].Id)
			if(emId > 0)
				set check = 0
				select into "nl:"
				from (dummyt d with seq = size(person_data->address,5))
				plan d where person_data->address[d.seq].address_id = emId
				detail
					check = 1
				with nocounter
 
				if(check = 0)
					call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid EmailId for Patient.",
					"9999", build2("Invalid EmailId: ",arglist->Emails[i].Id), put_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
		endfor
	endif
*/
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputIds Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetNextMrn(alias_pool = f8, type = vc)		= i2 ;114327 - PM_GET_ALIAS
;  Description: Gets the next MRN sequence in the alias pool
**************************************************************************/
 
subroutine GetNextMrn(alias_pool, type)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextMrn Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Initialize 114327 record structures
 	set stat = initrec(114327_req)
 	set stat = initrec(114327_rep)
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114327
 
	;Set request params
	set 114327_req->alias_pool_cd = alias_pool
	set 114327_req->action_type = "NEW"
	set 114327_req->seq_type_name = "DEFAULT"
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114327_req,"REC",114327_rep)
 
	;Verify status
	if(114327_rep->status_data.status = "S")
		set iValidate = 1
		if(type = "MRN")
			set sNextMRN = 114327_rep->alias_info[1].alias
		else
			set sNextCMRN = 114327_rep->alias_info[1].alias
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetNextMrn Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetSSNAliasPoolAttributes(null) = null ;114328 - PM_GET_ALIAS_MASK
;  Description: Gets the attributes for the SSN alias pool. Need to know if duplicates are allowed
**************************************************************************/
 
subroutine GetSSNAliasPoolAttributes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSSNAliasPoolAttributes Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 100000
	set iTask = 100003
	set iRequest = 114328
 
	; Duplicates flag value meanings
	      ;0.00	Duplicates are allowed
          ;1.00	Duplicates are allowed
          ;2.00	Duplicates are allowed but warn user
          ;3.00	Duplicates are not allowed
 
	;Set request params
	set 114328_req->alias_pool_cd = dSSNAliasPoolCd
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114328_req,"REC",114328_rep)
 
	;Verify status
	if(114328_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSSNAliasPoolAttributes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: CheckSSNDuplicates(null)	= null   ;114327 - PM_GET_ALIAS
;  Description: Verifies if the SSN provided already exists in the system
**************************************************************************/
 
subroutine CheckSSNDuplicates(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckSSNDuplicates Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Initialize 114327 record structures
 	set stat = initrec(114327_req)
 	set stat = initrec(114327_rep)
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114327
 
	;Set request params
	set 114327_req->alias_pool_cd = dSSNAliasPoolCd
	set 114327_req->action_type = "DUP"
	set 114327_req->alias = sSSN
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114327_req,"REC",114327_rep)
 
	;Verify status
	if(114327_rep->status_data.status = "F") ;Failure means no duplicates exist
		set iValidate = 1
	else
		;Check that no other patient has the SSN
		set qualCnt = 0
		select into "nl:"
		from person_alias pa
		where pa.alias_pool_cd = dSSNAliasPoolCd
			and pa.alias = sSSN
			and pa.person_id != dPatientId
		detail
			qualCnt = qualCnt + 1
		with nocounter
 
		if(qualCnt = 0)
			set iValidate = 1
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckSSNDuplicates Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetLocks(null) = i2 ;100080 - PM_LOCK_GET_LOCKS
;  Description: Get PM locks
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
	set 100080_req->person_id = dPatientId
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		if(size(100080_rep->person,5) = 0)
			set iValidate = 1
		endif
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2 ;100081 - PM_LOCK_ADD_LOCK
;  Description:  Add PM Lock
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
 
	set 100081_req->person_id = dPatientId
 
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
;  Name: UpdatePerson(null) = null  ;114609 - PM.UpdatePersonData
;  Description: Update the Person
**************************************************************************/
 
subroutine UpdatePerson(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdatePerson Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare error_msg = vc
	declare iRequest = i4
	declare iApplication = i4
	declare happ = i4
	declare iTask = i4
	declare htask = i4
	declare hstep = i4
	declare hrequest = i4
	declare hreply = i4
	declare event_id = f8
	declare hperson = i4
	declare htemplate = i4
	declare hfield = i4
	declare crmstatus = i2
 
	set error_msg = "None"
 
	; Get PM  Record Template
	set iApplication = 3200000
	set iTask = 3200032
	set iRequest = 114606
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
		endif
	else
		set error_msg = concat ("BEGINAPP=" ,cnvtstring (crmstatus ) )
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINREQ=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
		else
			set hrequest = uar_crmgetrequest (hstep )
			set issuccess = uar_srvsetlong (hrequest ,"type_flag" ,114998 )
			call echo (build ("SrvSetLong for type_flag returned:" ,issuccess ) )
			set crmstatus = uar_crmperform (hstep )
			if ((crmstatus = 0 ) )
				set htemplate = uar_crmgetreply (hstep )
				if ((htemplate = 0 ) )
					set error_msg = "ERR: 114998 Template = null"
				endif
			else
				set error_msg = concat ("ERR: 114998 Perform " ,cnvtstring (crmstatus ) )
			endif
		endif
	endif
 
	if ((error_msg != "None" ) )
		call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", error_msg,"9999", error_msg, put_patient_reply_out)
		set iDeleteLock = 1
		go to EXIT_SCRIPT
  	endif
 
	; Put Patient
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114609
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ))
			call uar_crmendapp (happ )
			call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", error_msg,"9999", error_msg, put_patient_reply_out)
			set iDeleteLock = 1
			go to EXIT_SCRIPT
		endif
	else
		set error_msg = concat ("BEGINAPP=" ,cnvtstring (crmstatus ) )
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		call echo (build ("hStep->" ,hstep ) )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINREQ=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
			call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", error_msg,"9999", error_msg, put_patient_reply_out)
			set iDeleteLock = 1
			go to EXIT_SCRIPT
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
			set hsrvtype = uar_srvcreatetypefrom (htemplate ,0 )
 
			set issuccess = uar_srvrecreateinstance (hrequest ,hsrvtype )
 
			; Transaction Info
			set stat = uar_srvsetshort(hrequest ,"transaction_type" ,101 ) ;101 - update person
			set htransactioninfo = uar_srvgetstruct (hrequest ,"transaction_info" )
			set stat = uar_srvsetdouble(htransactioninfo,"prsnl_id",dPrsnlId)
			set stat = uar_srvsetdate(htransactioninfo ,"trans_dt_tm" ,c_now_dt_tm )
			set stat = uar_srvsetlong(htransactioninfo ,"type_flag" ,114998 ) ;This is the request structure used for the call - found above
			set stat = uar_srvsetlong(htransactioninfo,"access_sensitive_data_bits",63) ;This allows filing phone and address data
 
			; Person
			set htemplateperson = uar_srvgetstruct (htemplate ,"person" )
			set hperson = uar_srvgetstruct (hrequest ,"person" )
			set stat = uar_srvsetdouble (hperson,"person_id",person_data->person.person_id)
			set stat = uar_srvsetshort(hperson,"new_person_ind",0)
			set stat = uar_srvsetdate(hperson,"create_dt_tm",person_data->person.create_dt_tm)
			set stat = uar_srvsetdouble(hperson,"create_prsnl_id",person_data->person.create_prsnl_id)
			set stat = uar_srvsetdouble(hperson,"person_type_cd",person_data->person.person_type_cd)
			set stat = uar_srvsetstring(hperson,"name_last",nullterm(sLastName))
			set stat = uar_srvsetstring(hperson,"name_first",nullterm(sFirstName))
			set stat = uar_srvsetstring(hperson,"name_middle",nullterm(sMiddleName))
			set stat = uar_srvsetstring(hperson,"name_phonetic",nullterm(person_data->person.name_phonetic))
			set stat = uar_srvsetstring(hperson,"name_last_key",nullterm(person_data->person.name_last_key))
			set stat = uar_srvsetstring(hperson,"name_first_key",nullterm(person_data->person.name_first_key))
			set stat = uar_srvsetstring(hperson,"name_middle_key",nullterm(person_data->person.name_middle_key))
			set stat = uar_srvsetstring(hperson,"name_full_formatted",nullterm(person_data->person.name_full_formatted))
			set stat = uar_srvsetdouble(hperson,"autopsy_cd",person_data->person.autopsy_cd)
			set stat = uar_srvsetdouble(hperson,"birth_dt_cd",person_data->person.birth_dt_cd)
			set stat = uar_srvsetdate(hperson,"birth_dt_tm",cnvtdatetimeutc(qBirthDate))
			set stat = uar_srvsetdate(hperson,"conception_dt_tm",person_data->person.conception_dt_tm)
			set stat = uar_srvsetstring(hperson,"cause_of_death",nullterm(person_data->person.cause_of_death))
			set stat = uar_srvsetdouble(hperson,"cause_of_death_cd",person_data->person.cause_of_death_cd)
			set stat = uar_srvsetdate(hperson,"deceased_dt_tm",cnvtdatetime(qDeceasedDate))
			set stat = uar_srvsetdouble(hperson,"deceased_source_cd",person_data->person.deceased_source_cd)
 
 
			set stat = uar_srvsetdouble(hperson,"purge_option_cd",person_data->person.purge_option_cd)
			set stat = uar_srvsetdouble(hperson,"sex_cd",dGenderCd )
 			set stat = uar_srvsetdate(hperson,"last_encntr_dt_tm",person_data->person.last_encntr_dt_tm)
 			set stat = uar_srvsetdouble(hperson,"species_cd",person_data->person.species_cd)
 
			set stat = uar_srvsetdouble(hperson,"name_first_synonym_id",person_data->person.name_first_synonym_id)
			set stat = uar_srvsetdouble(hperson,"citizenship_cd",person_data->person.citizenship_cd)
			set stat = uar_srvsetstring(hperson,"mother_maiden_name",nullterm(person_data->person.mother_maiden_name))
			set stat = uar_srvsetdouble(hperson,"nationality_cd",person_data->person.nationality_cd)
			set stat = uar_srvsetstring(hperson,"ft_entity_name",nullterm(person_data->person.ft_entity_name))
			set stat = uar_srvsetdouble(hperson,"ft_entity_id",person_data->person.ft_entity_id)
 			set stat = uar_srvsetdouble(hperson,"data_status_cd",person_data->person.data_status_cd)
 			set stat = uar_srvsetdouble(hperson,"military_rank_cd",person_data->person.military_rank_cd)
 			set stat = uar_srvsetdouble(hperson,"military_service_cd",person_data->person.military_service_cd)
 			set stat = uar_srvsetdouble(hperson,"vet_military_status_cd",person_data->person.vet_military_status_cd)
 			set stat = uar_srvsetstring(hperson,"military_base_location",nullterm(person_data->person.military_base_location))
			set stat = uar_srvsetlong (hperson,"birth_tz" ,person_data->person.birth_tz )
			set stat = uar_srvsetstring (hperson,"birth_tz_disp" ,nullterm(datetimezonebyindex(person_data->person.birth_tz)))
 
			;if(dEthnicityCd > 0)
				set stat = uar_srvsetdouble(hperson,"ethnic_grp_cd",dEthnicityCd )
			;else
			;	set stat = uar_srvsetdouble(hperson,"ethnic_grp_cd",person_data->person.ethnic_grp_cd )
			;endif
 
			;if(dMaritalStatusCd > 0)
				set stat = uar_srvsetdouble(hperson,"marital_type_cd",dMaritalStatusCd )
			;else
			;   set stat = uar_srvsetdouble(hperson,"marital_type_cd",person_data->person.marital_type_cd )
			;endif
 
			;if(dLanguageCd > 0)
				set stat = uar_srvsetdouble(hperson,"language_cd",dLanguageCd)
			;else
			;	set stat = uar_srvsetdouble(hperson,"language_cd",person_data->person.language_cd)
			;endif
 
			;if(dReligionCd > 0)
				set stat = uar_srvsetdouble(hperson,"religion_cd",dReligionCd )
			;else
			;	set stat = uar_srvsetdouble(hperson,"religion_cd",person_data->person.religion_cd )
			;endif
 
			;if(dConfidentialityCd > 0)
				set stat = uar_srvsetdouble(hperson,"confid_level_cd" ,dConfidentialityCd )
			;else
			;	set stat = uar_srvsetdouble(hperson,"confid_level_cd" ,person_data->person.confid_level_cd)
			;endif
 
			;if(dVipCd > 0)
				set stat = uar_srvsetdouble(hperson,"vip_cd" ,dVipCd )
			;else
			;	set stat = uar_srvsetdouble(hperson,"vip_cd" ,person_data->person.vip_cd)
			;endif
 
 
			;Patient - InterpreterCd
			set hpatient = uar_srvgetstruct (hperson ,"patient" )
			set stat = uar_srvsetdouble(hpatient,"person_id",person_data->person_patient.person_id)
			set stat = uar_srvsetdouble(hpatient,"adopted_cd",person_data->person_patient.adopted_cd)
			set stat = uar_srvsetdouble(hpatient,"bad_debt_cd",person_data->person_patient.bad_debt_cd)
			set stat = uar_srvsetdouble(hpatient,"baptised_cd",person_data->person_patient.baptised_cd)
			set stat = uar_srvsetdouble(hpatient,"birth_multiple_cd",person_data->person_patient.birth_multiple_cd)
			set stat = uar_srvsetdouble(hpatient,"birth_order",person_data->person_patient.birth_order)
			set stat = uar_srvsetdouble(hpatient,"birth_length",person_data->person_patient.birth_length)
			set stat = uar_srvsetdouble(hpatient,"birth_length_units_cd",person_data->person_patient.birth_length_units_cd)
			set stat = uar_srvsetstring(hpatient,"birth_name",nullterm(person_data->person_patient.birth_name))
			set stat = uar_srvsetdouble(hpatient,"birth_weight",person_data->person_patient.birth_weight)
			set stat = uar_srvsetdouble(hpatient,"birth_weight_units_cd",person_data->person_patient.birth_weight_units_cd)
			set stat = uar_srvsetdouble(hpatient,"church_cd",person_data->person_patient.church_cd)
			set stat = uar_srvsetdouble(hpatient,"credit_hrs_taking",person_data->person_patient.credit_hrs_taking)
			set stat = uar_srvsetdouble(hpatient,"cumm_leave_days",person_data->person_patient.cumm_leave_days)
			set stat = uar_srvsetdouble(hpatient,"current_balance",person_data->person_patient.current_balance)
			set stat = uar_srvsetdouble(hpatient,"current_grade",person_data->person_patient.current_grade)
			set stat = uar_srvsetdouble(hpatient,"custody_cd",person_data->person_patient.custody_cd)
			set stat = uar_srvsetdouble(hpatient,"degre_complete_cd",person_data->person_patient.degree_complete_cd)
			set stat = uar_srvsetdouble(hpatient,"diet_type_cd",person_data->person_patient.diet_type_cd)
			set stat = uar_srvsetdouble(hpatient,"family_income",person_data->person_patient.family_income)
			set stat = uar_srvsetdouble(hpatient,"family_size",person_data->person_patient.family_size)
			set stat = uar_srvsetdouble(hpatient,"highest_grade_complete_cd",person_data->person_patient.highest_grade_complete_cd)
			set stat = uar_srvsetdouble(hpatient,"immun_on_file_cd",person_data->person_patient.immun_on_file_cd)
 
			set stat = uar_srvsetdouble(hpatient,"interp_type_cd",person_data->person_patient.interp_type_cd)
			set stat = uar_srvsetdouble(hpatient,"microfilm_cd",person_data->person_patient.microfilm_cd)
			set stat = uar_srvsetdouble(hpatient,"nbr_of_brothers",person_data->person_patient.nbr_of_brothers)
			set stat = uar_srvsetdouble(hpatient,"nbr_of_sisters",person_data->person_patient.nbr_of_sisters)
			set stat = uar_srvsetdouble(hpatient,"organ_donor_cd",person_data->person_patient.organ_donor_cd)
			set stat = uar_srvsetdouble(hpatient,"parent_marital_status_cd",person_data->person_patient.parent_marital_status_cd)
			set stat = uar_srvsetdouble(hpatient,"smokes_cd",person_data->person_patient.smokes_cd)
 
			set stat = uar_srvsetdouble(hpatient,"tumor_registry_cd",person_data->person_patient.tumor_registry_cd)
			set stat = uar_srvsetdate(hpatient,"last_bill_dt_tm",person_data->person_patient.last_bill_dt_tm)
			set stat = uar_srvsetdate(hpatient,"last_bind_dt_tm",person_data->person_patient.last_bind_dt_tm)
			set stat = uar_srvsetdate(hpatient,"last_discharge_dt_tm",person_data->person_patient.last_discharge_dt_tm)
			set stat = uar_srvsetdate(hpatient,"last_event_updt_dt_tm",person_data->person_patient.last_event_updt_dt_tm)
			set stat = uar_srvsetdate(hpatient,"last_payment_dt_tm",person_data->person_patient.last_payment_dt_tm)
			set stat = uar_srvsetdate(hpatient,"last_atd_activity_dt_tm",person_data->person_patient.last_atd_activity_dt_tm)
			set stat = uar_srvsetdouble(hpatient,"student_cd",person_data->person_patient.student_cd)
			set stat = uar_srvsetdouble(hpatient,"living_dependency_cd",person_data->person_patient.living_dependency_cd)
			set stat = uar_srvsetdouble(hpatient,"living_arrangement_cd",person_data->person_patient.living_arrangement_cd)
			set stat = uar_srvsetdouble(hpatient,"living_will_cd",person_data->person_patient.living_will_cd)
			set stat = uar_srvsetdouble(hpatient,"nbr_of_pregnancies",person_data->person_patient.nbr_of_pregnancies)
			set stat = uar_srvsetdate(hpatient,"last_trauma_dt_tm",person_data->person_patient.last_trauma_dt_tm)
			set stat = uar_srvsetstring(hpatient,"mother_indentifier",nullterm(person_data->person_patient.mother_identifier))
			set stat = uar_srvsetdouble(hpatient,"data_status_cd",person_data->person_patient.data_status_cd)
			set stat = uar_srvsetdouble(hpatient,"disease_alert_cd",person_data->person_patient.disease_alert_cd)
			set stat = uar_srvsetdouble(hpatient,"process_alert_cd",person_data->person_patient.process_alert_cd)
			set stat = uar_srvsetdouble(hpatient,"contact_list_cd",person_data->person_patient.contact_list_cd)
			set stat = uar_srvsetdouble(hpatient,"birth_order_cd",person_data->person_patient.birth_order_cd)
			set stat = uar_srvsetdouble(hpatient,"contact_method_cd",person_data->person_patient.contact_method_cd)
			set stat = uar_srvsetstring(hpatient,"contact_time",nullterm(person_data->person_patient.contact_time))
			set stat = uar_srvsetdouble(hpatient,"callback_consent_cd",person_data->person_patient.callback_consent_cd)
			set stat = uar_srvsetdouble(hpatient,"written_format_cd",person_data->person_patient.written_format_cd)
			set stat = uar_srvsetshort(hpatient,"prev_contact",person_data->person_patient.prev_contact)
			set stat = uar_srvsetstring(hpatient,"source_version_number",nullterm(person_data->person_patient.source_version_number))
			set stat = uar_srvsetdouble(hpatient,"source_sync_level_flag",person_data->person_patient.source_sync_level_flag)
			set stat = uar_srvsetdouble(hpatient,"iqh_participant_cd",person_data->person_patient.iqh_participant_cd)
			set stat = uar_srvsetlong(hpatient,"family_nbr_of_minors_cnt",person_data->person_patient.family_nbr_of_minors_cnt)
			set stat = uar_srvsetdate(hpatient,"fin_statement_expire_dt_tm",person_data->person_patient.fin_statement_expire_dt_tm)
			set stat = uar_srvsetdouble(hpatient,"fin_statement_verified_dt_tm",person_data->person_patient.fin_statement_verified_dt_tm)
 
			;if(dNeedsIntrepreter_id > 0)
				set stat = uar_srvsetdouble(hpatient,"interp_required_cd",dNeedsIntrepreter_id)
			;else
			;	set stat = uar_srvsetdouble(hpatient,"interp_required_cd",person_data->person_patient.interp_required_cd)
			;endif
 
			;if(dRaceCd > 0)
				set stat = uar_srvsetdouble(hperson,"race_cd",dRaceCd)
			;else
			;	set stat = uar_srvsetdouble(hperson,"race_cd",person_data->person.race_cd)
			;endif
 
			; Emails
			if(size(arglist->extendedinfo->Email) > 0)
				set hemail = uar_srvadditem(hperson ,"addresses" )
					;set stat = uar_srvsetdouble(hemail,"address_id",cnvtreal(arglist->Emails[emailCnt].Id))
					set stat = uar_srvsetdouble(hemail,"address_type_cd" ,uar_get_code_by("MEANING",212,"EMAIL"))
					set stat = uar_srvsetstring(hemail,"street_addr" ,nullterm (arglist->extendedinfo->Email))
					set stat = uar_srvsetstring(hemail,"parent_entity_name",nullterm("PERSON"))
					set stat = uar_srvsetdouble(hemail,"parent_entity_id",dPatientId)
			endif
/*			;this maybe needed if we start putting in multiple emails
			set emailSize = size(arglist->Emails,5)
			if(emailSize > 0)
				for(emailCnt = 1 to emailSize)
					set hemail = uar_srvadditem(hperson ,"addresses" )
					set stat = uar_srvsetdouble(hemail,"address_id",cnvtreal(arglist->Emails[emailCnt].Id))
					set stat = uar_srvsetdouble(hemail,"address_type_cd" ,uar_get_code_by("MEANING",212,"EMAIL"))
					set stat = uar_srvsetstring(hemail,"street_addr" ,nullterm (arglist->Emails[emailCnt].Email))
					set stat = uar_srvsetstring(hemail,"parent_entity_name",nullterm("PERSON"))
					set stat = uar_srvsetdouble(hemail,"parent_entity_id",dPatientId)
				endfor
			endif
*/
 
/*
 			;Races this maybe needed if we put in multiple races
 			set raceSize = size(arglist->RaceIds,5)
 			if(raceSize > 0)
 				; If only one race cd, add to person table
 				if(raceSize = 1)
 					set stat = uar_srvsetdouble(hperson,"race_cd",cnvtreal(arglist->RaceIds[1]))
 
 				; If multiple race codes exist, add to race_list which updates the PERSON_CODE_VALUE_R table
 				else
 					for(rc = 1 to raceSize)
 						set dRaceCd = cnvtreal(arglist->RaceIds[rc])
 						set hrace = uar_srvadditem (hperson ,"race_list")
 						set stat = uar_srvsetdouble(hrace,"value_cd",dRaceCd)
 					endfor
 				endif
 			endif
*/
 
 
			; Addresses
			set addrSize = size(arglist->extendedinfo->Addresses,5)
			if(addrSize > 0)
				declare addr_type_cd = f8
				declare dCountyCd = f8
				declare sCounty = vc
				declare dCountryCd = f8
				declare sCountry = vc
				declare dStateCd = f8
 
				for(addr = 1 to addrSize)
					;Validate Address Type Code
					set addr_type_cd = cnvtreal(arglist->extendedinfo->Addresses[addr].Address_Type_CD)
					set iRet = GetCodeSet(addr_type_cd)
					if(iRet != 212)
						call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Address TypeId.",
						"9999", build2("Invalid Address_Type_CD.: ",arglist->extendedinfo->Addresses[addr].TypeId), put_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
 
					; Get Zipcode defaults
					if(arglist->extendedinfo->Addresses[addr].Zip > " ")
						set stat = initrec(114382_req)
						set stat = initrec(114382_rep)
						call GetZipDefaults(arglist->extendedinfo->Addresses[addr].Zip)
						set dCountyCd = 114382_rep->county_cd
						set sCounty = 114382_rep->county
						set dStateCd = 114382_rep->state_cd
					endif
 
					;Get Country
					if(arglist->extendedinfo->Addresses[addr].State > " " or dStateCd > 0)
						set dStateCd = uar_get_code_by("MEANING",62,trim(arglist->Addresses[addr].State,3))
						select into "nl:"
						from code_value_group cvg
						, code_value cv
						plan cvg where cvg.child_code_value = dStateCd
						join cv where cv.code_value = cvg.parent_code_value
								and cv.code_set = 15
						detail
							dCountryCd = cv.code_value
							sCountry = cv.display
						with nocounter
					endif
 
					; Update request structure
					set haddr = uar_srvadditem(hperson,"addresses")
					if(haddr)
 
						set stat = uar_srvsetstring(haddr,"parent_entity_name",nullterm("PERSON"))
						set stat = uar_srvsetdouble(haddr,"parent_entity_id",dPatientId)
						set stat = uar_srvsetdouble(haddr,"address_id",cnvtreal(arglist->extendedinfo->addresses[addr].Address_Id))
						set stat = uar_srvsetdouble(haddr,"address_type_cd",addr_type_cd)
						set stat = uar_srvsetstring(haddr,"street_addr",nullterm(trim(arglist->extendedinfo->Addresses[addr].Address1,3)))
						set stat = uar_srvsetstring(haddr,"street_addr2",nullterm(trim(arglist->extendedinfo->Addresses[addr].Address2,3)))
						set stat = uar_srvsetstring(haddr,"city",nullterm(trim(arglist->extendedinfo->Addresses[addr].City,3)))
						set stat = uar_srvsetstring(haddr,"state",nullterm(trim(arglist->extendedinfo->Addresses[addr].State,3)))
						set stat = uar_srvsetdouble(haddr,"state_cd",dStateCd)
						set stat = uar_srvsetstring(haddr,"zipcode",nullterm(trim(arglist->extendedinfo->Addresses[addr].Zip,3)))
						set stat = uar_srvsetstring(haddr,"county",nullterm(sCounty))
						set stat = uar_srvsetdouble(haddr,"county_cd",dCountyCd)
						set stat = uar_srvsetstring(haddr,"country",nullterm(sCountry))
						set stat = uar_srvsetdouble(haddr,"country_cd",dCountryCd)
					else
						call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not create HADDR.",
						"9999", "Could not create HADDR", put_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
				endfor
			endif
 
			; Phones
			set phoneSize = size(arglist->extendedinfo->Phones,5)
			if(phoneSize > 0)
				declare phone_type_cd = f8
				for(ph = 1 to phoneSize)
					;Validate Phone Type Code
					set phone_type_cd = cnvtreal(arglist->extendedinfo->Phones[ph].Phone_type_cd)
					set iRet = GetCodeSet(phone_type_cd)
					if(iRet != 43)
						call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid Phone TypeId.",
						"9999", build2("Invalid Phone TypeId.: ",arglist->extendedinfo->Phones[ph].TypeId), put_patient_reply_out)
						go to EXIT_SCRIPT
					endif
					set hphone = uar_srvadditem(hperson,"phones")
					if(hphone)
						set stat = uar_srvsetdouble(hphone,"phone_id",cnvtreal(arglist->extendedinfo->Phones[ph].phoneid))
						set stat = uar_srvsetstring(hphone,"parent_entity_name",nullterm("PERSON"))
						set stat = uar_srvsetdouble(hphone,"parent_entity_id",dPatientId)
						set stat = uar_srvsetdouble(hphone,"phone_type_cd",phone_type_cd)
						set stat = uar_srvsetdouble(hphone,"phone_format_cd",uar_get_code_by("MEANING",281,"DEFAULT"))
						set stat = uar_srvsetstring(hphone,"phone_num",nullterm(trim(arglist->extendedinfo->Phones[ph].Number,3)))
					else
						call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not create HPHONE.",
						"9999", "Could not create HPHONE.", put_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
				endfor
			endif
/*
			; Other Names
			set otherNameSize = size(arglist->OtherKnownNames,5)
			if(otherNameSize > 0)
				declare name_type_cd = f8
				declare name_type_mean = vc
				declare current_check = i2
				for(okn = 1 to otherNameSize)
					;Validate Name Type Code
					set name_type_cd = cnvtreal(arglist->OtherKnownNames[okn].TypeId)
					set iRet = GetCodeSet(name_type_cd)
					if(iRet != 213)
						call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "Invalid OtherKnownName TypeId.",
						"9999", build2("Invalid OtherKnownName TypeId.: ",arglist->OtherKnownNames[okn].TypeId), put_patient_reply_out)
						go to EXIT_SCRIPT
					endif
					set name_type_mean = uar_get_code_meaning(name_type_cd)
					if(name_type_mean = "CURRENT")
						set current_check = 1
					endif
 					set hothername = uar_srvadditem(hperson,"person_names")
					if(hothername)
						set stat = uar_srvsetdouble(hothername,"person_id",dPatientId)
						set stat = uar_srvsetdouble(hothername,"person_name_id",cnvtreal(arglist->OtherKnownNames[okn].Id))
						set stat = uar_srvsetdouble(hothername,"name_type_cd", name_type_cd)
						set stat = uar_srvsetstring(hothername,"name_first",nullterm(trim(arglist->OtherKnownNames[okn].FirstName,3)))
						set stat = uar_srvsetstring(hothername,"name_middle",nullterm(trim(arglist->OtherKnownNames[okn].MiddleName,3)))
						set stat = uar_srvsetstring(hothername,"name_last",nullterm(trim(arglist->OtherKnownNames[okn].LastName,3)))
						set stat = uar_srvsetstring(hothername,"name_prefix",nullterm(trim(arglist->OtherKnownNames[okn].Prefix,3)))
						set stat = uar_srvsetstring(hothername,"name_suffix",nullterm(trim(arglist->OtherKnownNames[okn].Suffix,3)))
					else
						call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not create HOTHERNAME.",
						"9999", "Could not create HOTHERNAME", put_patient_reply_out)
						go to EXIT_SCRIPT
					endif
				endfor
*/
 				;Current name is always sent regardless if added by consumer
;				if(current_check = 0)
					set hothername = uar_srvadditem(hperson,"person_names")
					if(hothername)
						select into "nl:"
						from (dummyt d with seq = size(person_data->person_names,5))
						plan d where person_data->person_names[d.seq].name_type_cd = value(uar_get_code_by("MEANING",213,"CURRENT"))
						detail
							stat = uar_srvsetdouble(hothername,"person_name_id",person_data->person_names[d.seq].person_name_id)
						with nocounter
 
						set stat = uar_srvsetdouble(hothername,"name_type_cd", uar_get_code_by("MEANING",213,"CURRENT"))
						set stat = uar_srvsetstring(hothername,"name_first",nullterm(sFirstName))
						set stat = uar_srvsetstring(hothername,"name_middle",nullterm(sMiddleName))
						set stat = uar_srvsetstring(hothername,"name_last",nullterm(sLastName))
						set stat = uar_srvsetstring(hothername,"name_prefix",nullterm(sPrefix))
						set stat = uar_srvsetstring(hothername,"name_suffix",nullterm(sSuffix))
					else
						call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not create HOTHERNAME.",
						"9999", "Could not create HOTHERNAME", put_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
;				endif
/*
			else
				;Current name is always sent regardless if added by consumer
				set hothername = uar_srvadditem(hperson,"person_names")
				if(hothername)
					select into "nl:"
					from (dummyt d with seq = size(person_data->person_names,5))
					plan d where person_data->person_names[d.seq].name_type_cd = value(uar_get_code_by("MEANING",213,"CURRENT"))
					detail
						stat = uar_srvsetdouble(hothername,"person_name_id",person_data->person_names[d.seq].person_name_id)
					with nocounter
 
					set stat = uar_srvsetstring (hothername,"name_first",nullterm(sFirstName))
					set stat = uar_srvsetstring (hothername,"name_middle",nullterm(sMiddleName))
					set stat = uar_srvsetstring (hothername,"name_last",nullterm(sLastName))
					set stat = uar_srvsetstring (hothername,"name_prefix",nullterm(sPrefix))
					set stat = uar_srvsetstring (hothername,"name_suffix",nullterm(sSuffix))
				else
					call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", "Could not create HOTHERNAME.",
					"9999", "Could not create HOTHERNAME", put_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
*/
 			;Person Aliases
			for(pa = 1 to size(person_data->person_alias,5))
				set hpersonalias = uar_srvadditem(hperson,"mrn_list")
				set stat = uar_srvsetdouble(hpersonalias,"person_alias_id",person_data->person_alias[pa].person_alias_id)
				set stat = uar_srvsetdouble(hpersonalias,"person_id",person_data->person_alias[pa].person_id)
				set stat = uar_srvsetdouble(hpersonalias,"alias_pool_cd",person_data->person_alias[pa].alias_pool_cd)
				set stat = uar_srvsetdouble(hpersonalias,"person_alias_type_cd",person_data->person_alias[pa].person_alias_type_cd)
				if(person_data->person_alias[pa].alias_pool_cd = dSSNAliasPoolCd)
					set stat = uar_srvsetstring(hpersonalias,"alias",nullterm(sSSN))
				else
					set stat = uar_srvsetstring(hpersonalias,"alias",nullterm(person_data->person_alias[pa].alias))
				endif
				set stat = uar_srvsetdouble(hpersonalias,"person_alias_sub_type_cd",person_data->person_alias[pa].person_alias_sub_type_cd)
				set stat = uar_srvsetdouble(hpersonalias,"check_digit",person_data->person_alias[pa].check_digit)
				set stat = uar_srvsetdouble(hpersonalias,"check_digit_method_cd",person_data->person_alias[pa].check_digit_method_cd)
				set stat = uar_srvsetlong(hpersonalias,"visit_seq_nbr",person_data->person_alias[pa].visit_seq_nbr)
				set stat = uar_srvsetstring(hpersonalias,"health_card_province",nullterm(person_data->person_alias[pa].health_card_province))
				set stat = uar_srvsetstring(hpersonalias,"health_card_ver_code",nullterm(person_data->person_alias[pa].health_card_ver_code))
				set stat = uar_srvsetdouble(hpersonalias,"data_status_cd",person_data->person_alias[pa].data_status_cd)
				set stat = uar_srvsetstring(hpersonalias,"health_card_type",nullterm(person_data->person_alias[pa].health_card_type))
				set stat = uar_srvsetdate(hpersonalias,"health_card_issue_dt_tm",person_data->person_alias[pa].health_card_issue_dt_tm)
				set stat = uar_srvsetdate(hpersonalias,"health_card_expiry_dt_tm",person_data->person_alias[pa].health_card_expiry_dt_tm)
				set stat = uar_srvsetdouble(hpersonalias,"person_alias_status_cd",person_data->person_alias[pa].person_alias_status_cd)
				set stat = uar_srvsetdouble(hpersonalias,"response_cd",person_data->person_alias[pa].response_cd)
				set stat = uar_srvsetstring(hpersonalias,"temp_ver_code",nullterm(person_data->person_alias[pa].temp_ver_code))
			endfor
 
			; Add MRN if not already defined for this facility
			if(iMRNExists = 0 and dMRNAliasPoolCd > 0)
				set hmrn = uar_srvgetstruct(hperson,"mrn")
				set stat = uar_srvsetdouble(hmrn,"alias_pool_cd", dMRNAliasPoolCd)
				set stat = uar_srvsetdouble(hmrn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"MRN"))
				set stat = uar_srvsetstring(hmrn,"alias",nullterm(sNextMRN))
			endif
 
			; Add CMRN if not already defined for this facility
			if(iCMRNExists = 0 and dCMRNAliasPoolCd > 0)
				set hmrn = uar_srvgetstruct(hperson,"cmrn")
				set stat = uar_srvsetdouble(hmrn,"alias_pool_cd", dCMRNAliasPoolCd)
				set stat = uar_srvsetdouble(hmrn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"CMRN"))
				set stat = uar_srvsetstring(hmrn,"alias",nullterm(sNextCMRN))
			endif
 
			; Add SSN if not already defined for this facility
			if(sSSN > " " and iSSNExists = 0)
				set hssn = uar_srvgetstruct(hperson,"ssn")
				set stat = uar_srvsetdouble(hssn,"alias_pool_cd", dSSNAliasPoolCd)
				set stat = uar_srvsetdouble(hssn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"SSN"))
				set stat = uar_srvsetstring(hssn,"alias",nullterm(sSSN))
			endif
 
 
			; Person Relations
			set prSize = size(person_data->person_person_reltn,5)
			if( prSize > 0)
				for(pr = 1 to prSize)
					set hperreltn = uar_srvadditem(hperson,"person_relation_list")
					set stat = uar_srvsetdouble(hperreltn,"person_person_reltn_id",person_data->person_person_reltn[pr].person_person_reltn_id)
					set stat = uar_srvsetdouble(hperreltn,"person_reltn_type_cd",person_data->person_person_reltn[pr].person_reltn_type_cd)
					set stat = uar_srvsetdouble(hperreltn,"person_id",person_data->person_person_reltn[pr].person_id)
					set stat = uar_srvsetdouble(hperreltn,"person_reltn_cd",person_data->person_person_reltn[pr].person_reltn_cd)
					set stat = uar_srvsetdouble(hperreltn,"prior_person_reltn_cd",person_data->person_person_reltn[pr].prior_person_reltn_cd)
					set stat = uar_srvsetdouble(hperreltn,"related_person_reltn_cd",person_data->person_person_reltn[pr].related_person_reltn_cd)
					set stat = uar_srvsetdouble(hperreltn,"prior_related_person_reltn_cd",
					person_data->person_person_reltn[pr].prior_related_person_reltn_cd)
					set stat = uar_srvsetdouble(hperreltn,"related_person_id",person_data->person_person_reltn[pr].related_person_id)
					set stat = uar_srvsetdouble(hperreltn,"contact_role_cd",person_data->person_person_reltn[pr].contact_role_cd)
					set stat = uar_srvsetdouble(hperreltn,"genetic_relationship_ind",person_data->person_person_reltn[pr].genetic_relationship_ind)
					set stat = uar_srvsetdouble(hperreltn,"living_with_ind",person_data->person_person_reltn[pr].living_with_ind)
					set stat = uar_srvsetdouble(hperreltn,"visitation_allowed_cd",person_data->person_person_reltn[pr].visitation_allowed_cd)
					set stat = uar_srvsetdouble(hperreltn,"priority_seq",person_data->person_person_reltn[pr].priority_seq)
					set stat = uar_srvsetdouble(hperreltn,"free_text_cd",person_data->person_person_reltn[pr].free_text_cd)
					set stat = uar_srvsetstring(hperreltn,"ft_rel_person_name",nullterm(person_data->person_person_reltn[pr].ft_rel_person_name))
					set stat = uar_srvsetdouble(hperreltn,"internal_seq",person_data->person_person_reltn[pr].internal_seq)
					set stat = uar_srvsetshort(hperreltn,"free_text_person_ind",person_data->person_person_reltn[pr].free_text_person_ind)
					set stat = uar_srvsetshort(hperreltn,"encntr_only_ind",person_data->person_person_reltn[pr].encntr_only_ind)
					set stat = uar_srvsetdouble(hperreltn,"data_status_cd",person_data->person_person_reltn[pr].data_status_cd)
					set stat = uar_srvsetdouble(hperreltn,"family_reltn_sub_type_cd",person_data->person_person_reltn[pr].family_reltn_sub_type_cd)
					set stat = uar_srvsetdouble(hperreltn,"copy_correspondence_cd",person_data->person_person_reltn[pr].copy_correspondence_cd)
					set stat = uar_srvsetstring(hperreltn,"source_identifier",nullterm(person_data->person_person_reltn[pr].source_identifier))
				endfor
			endif
 
 			; Execute request
			set crmstatus = uar_crmperform (hstep)
			if ((crmstatus = 0 ) )
				set hreply = uar_crmgetreply (hstep )
				if ((hreply > 0 ) )
					set put_patient_reply_out->patient_id = uar_srvgetdouble (hreply ,"person_id" )
					set hstatus_data = uar_srvgetstruct (hreply ,"status_data" )
					set status = uar_srvgetstringptr (hstatus_data ,"status" )
					if(status = "S")
						set iValidate = 1
					endif
				else
					set error_msg = "ERR: Reply = null"
					call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", error_msg,"9999", error_msg, put_patient_reply_out)
				endif
			else
				set error_msg = concat ("PERFORM=" ,cnvtstring (crmstatus ) )
				call ErrorHandler2("EXECUTE", "F", "PUT PATIENT", error_msg,"9999", error_msg, put_patient_reply_out)
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdatePerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
 
/*************************************************************************
;  Name: GetZipDefaults(zipcode = vc)	= null 114382 - PM_GET_ZIPCODE_DEFAULTS
;  Description: Gets data based on zipcode
**************************************************************************/
 
subroutine GetZipDefaults(zipcode)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetZipDefaults Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: DeleteLock(null)	= null ;100082 - PM_LOCK_DEL_LOCKS
;  Description: Deletes the PM lock
**************************************************************************/
 
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100080
	set iRequest = 100082
 
	;Set request params
	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = dPatientId
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100082_req,"REC",100082_rep)
 
	;Verify status
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
	endif
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: UpdatePhoneAddressData(null) = null
;  Description: Updates the active_ind and active_status_cd columns
**************************************************************************/
 
subroutine UpdatePhoneAddressData(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdatePhoneAddressData Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Address Table
 	update into address
 		set
 		 active_ind = 1
 		,active_status_cd = c_active_active_status_cd
 		,active_status_dt_tm = cnvtdatetime(curdate,curtime3)
 		,active_status_prsnl_id = dPrsnlId
 		,data_status_prsnl_id = dPrsnlId
 		,updt_dt_tm = cnvtdatetime(curdate,curtime3)
 		,updt_id = dPrsnlId
 	where parent_entity_name = "PERSON"
 		and parent_entity_id = dPatientId
 		and active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
 		and updt_dt_tm > cnvtlookbehind("60,S")
 
 	; Commit changes
 	commit
 
 	;Phone Table
 	update into phone
 		set
 		 active_ind = 1
 		,active_status_cd = c_active_active_status_cd
 		,active_status_dt_tm = cnvtdatetime(curdate,curtime3)
 		,active_status_prsnl_id = dPrsnlId
 		,data_status_prsnl_id = dPrsnlId
 		,updt_dt_tm = cnvtdatetime(curdate,curtime3)
 		,updt_id = dPrsnlId
 	where parent_entity_name = "PERSON"
 		and parent_entity_id = dPatientId
 		and active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
 		and updt_dt_tm > cnvtlookbehind("60,S")
 
 	; Commit changes
 	commit
 
	if(iDebugFlag > 0)
		call echo(concat("UpdatePhoneAddressData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: AddPreferredPharmacy(null)	 = null
	500726 - orm_get_custom_pat_pref_pharm
	500727 - orm_add_custom_pat_pref_pharm
	500728 - orm_del_custom_pat_pref_pharm
;  Description: Adds the preferred pharmacy and removes any other preferred pharmacy if not added to the call
**************************************************************************/
/*
subroutine AddPreferredPharmacy(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPreferredPharmacy Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	;Get preferred pharmacy list
 	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500726
 
	set 500726_req->person_id = dPatientId
	set 500726_req->max_pharm_return_cnt = 10
 
	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500726_req,"REC",500726_rep)
 
	if(size(500726_rep->pharmacies,5) > 0)
		; Remove all pharmacies that aren't in the request
		set iApplication = 600005
		set iTask = 500196
		set iRequest = 500728
		set removeCnt = 0
		set 500728_req->person_id = dPatientId
 
		for(x = 1 to size(500726_rep->pharmacies,5))
			set check = 0
			select into "nl:"
			from (dummyt d with seq = size(arglist->PreferredPharmaciesIds,5))
			plan d where  trim(arglist->PreferredPharmaciesIds[d.seq],3) = 500726_rep->pharmacies[x].pharmacy_id_str
			detail
				check = 1
			with nocounter
 
			if(check = 0)
				set removeCnt = removeCnt + 1
				set stat = alterlist(500728_req->pharmacies,removeCnt)
				set 500728_req->pharmacies[removeCnt].pharmacy_id_str = 500726_rep->pharmacies[x].pharmacy_id_str
			endif
		endfor
 
		set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500728_req,"REC",500728_rep)
	endif
 
 	; Add Preferred Pharmacy
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 500727
 
	;Set request params
	set 500727_req->person_id = dPatientId
	set phaSize = size(arglist->PreferredPharmaciesIds,5)
	set stat = alterlist(500727_req->pharmacies,phaSize)
	for(i = 1 to phaSize)
		set 500727_req->pharmacies[i].pharmacy_id_str = arglist->PreferredPharmaciesIds[i]
	endfor
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500727_req,"REC",500727_rep)
 
	;Verify status
	if(500727_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddPreferredPharmacy Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
*/
 
end go
set trace notranslatelock go
 
