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
      Source file name: snsro_pat_enc_ins.prg
      Object name:      vigilanz_pat_enc_ins
      Program purpose:  Patch encounter insurance in millennium
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
 001 02/17/20 RJC		Initial Write
 002 02/28/20 RJC		Renamed health_plans rec to health_plan_data due to conflict
 003 03/31/20 RJC		Fixed lock check
***********************************************************************/
drop program vigilanz_pat_enc_ins go
create program vigilanz_pat_enc_ins
 
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
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
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
free record insurance_reply_out
record insurance_reply_out(
  1 insurance_id       		= f8
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
	1 insuranceId					= vc	;Required
	1 companyId 					= vc	;Not used
	1 companyName					= vc	;Not used
	1 healthPlanId					= vc
	1 eligibilityStatusId			= vc
	1 eligibilityStatusDate			= vc
	1 subscriberId 					= vc
	1 subscriber					= vc	;Ignored
	1 patientRelationshipToSubscriber = vc
	1 subscriberRelationshipToPatientId = vc
	1 priority						= vc
	1 beginEffectiveDateTime		= vc
	1 endEffectiveDateTime			= vc
	1 insuranceCardCopiedId			= vc
	1 insuranceCardNameLast			= vc
	1 insuranceCardNameFirst		= vc
	1 insuranceCardNameMiddle		= vc
	1 subscriberMemberNumber		= vc
	1 memberNumber					= vc
	1 policyNumber 					= vc
	1 groupName						= vc
	1 groupNumber					= vc
	1 verificationStatusId			= vc
	1 verificationSourceId			= vc
	1 verificationDateTime			= vc
	1 verificationPersonnelId		= vc
	1 assignmentOfBenefitsId		= vc
	1 deductibleAmount				= vc
	1 deductibleRemaining			= vc
	1 deductibleIncludingMaxOutOfPocket = vc
	1 copayAmount					= vc
	1 copayIncludingMaxOutOfPocket	= vc
	1 maxOutOfPocket				= vc
	1 familyDeductibleMetAmount		= vc
	1 address
		2 addressId					= vc
		2 typeId					= vc
		2 address1					= vc
		2 address2					= vc
		2 address3					= vc
		2 city						= vc
		2 state						= vc
		2 zip						= vc
		2 county					= vc
		2 country					= vc
	1 phones[*]
		2 phoneId					= vc
		2 typeId					= vc
		2 number					= vc
		2 extension					= vc
		2 formatId					= vc
		2 contact					= vc
	1 customFields[*]
		2 fieldId					= vc
		2 responseValue				= vc
	1 prioritization[*]
		2 insuranceId				= vc
		2 priority					= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username						= vc
	1 prsnl_id						= f8
	1 patient_id 					= f8
	1 encntr_id						= f8
	1 person_plan_reltn_id			= f8
	1 encntr_plan_reltn_id			= f8
	1 company_id 					= f8
	1 company_name					= vc
	1 health_plan_id				= f8
	1 eligibility_status_cd			= f8
	1 eligibility_status_date		= dq8 ;currently not used in Cerner
	1 subscriber_id					= f8
	1 current_subscriber_id			= f8
	1 person_person_reltn_id		= f8
	1 encntr_person_reltn_id		= f8
	1 reltn_internal_seq			= i4
	1 policy_number					= vc
	1 patient_reltn_to_subscriber_cd = f8
	1 subscriber_reltn_to_patient_cd = f8
	1 org_plan_reltn_cd				= f8
	1 priority						= i4
	1 beg_effective_dt_tm			= dq8
	1 end_effective_dt_tm			= dq8
	1 ins_card_copied_cd			= f8
	1 insured_card_name_last		= vc
	1 insured_card_name_first		= vc
	1 insured_card_name_middle		= vc
	1 insured_card_name_suffix		= vc
	1 insured_card_name				= vc
	1 subs_member_nbr				= vc
	1 member_nbr					= vc
	1 group_name					= vc
	1 group_number					= vc
	1 verify_status_cd				= f8
	1 verify_source_cd				= f8
	1 verify_dt_tm					= dq8
	1 verify_prsnl_id				= f8
	1 assign_benefits_cd			= f8
	1 deduct_amt					= f8
	1 deduct_remain_amt				= f8
	1 deduct_inc_max_oop			= f8 ;room_coverage_board_incl_cd where internal_seq = 0
	1 copay_amt						= f8
	1 copay_inc_max_oop				= f8 ;room_coverage_board_incl_cd where internal_seq = 1
	1 max_out_pckt_amt				= f8
	1 fam_deduct_met_amt			= f8
	1 address
		2 db_address_id				= f8
		2 address_id				= f8
		2 address_type_cd			= f8
		2 address1					= vc
		2 address2					= vc
		2 address3					= vc
		2 city						= vc
		2 state						= vc
		2 state_cd					= f8
		2 zip						= vc
		2 county					= vc
		2 county_cd					= f8
		2 country					= vc
		2 country_cd				= f8
	1 phones[*]
		2 phone_id					= f8
		2 phone_type_cd				= f8
		2 number					= vc
		2 extension					= vc
		2 format_id					= f8
		2 contact					= vc
	1 custom_fields[*]
	 	2 field_id 					= f8
		2 text_value 				= vc
		2 codeset					= i4
	 	2 field						= vc
	 	2 length					= i4
	 	2 level						= vc
	 	2 type						= vc
	 	2 numeric_value				= f8
	 	2 date_value				= dq8
	 1 prioritization[*]
	 	2 encntr_plan_reltn_id		= f8
	 	2 priority					= i4
	 1 other_active_plans[*]
	 	2 plan_reltn_id				= f8
)
 
free record priorities
record priorities (
	1 cnt = i4
	1 list[*]
		2 encntr_plan_reltn_id = f8
		2 priority = i4
)
 
;Other
declare sJsonArgs						= vc with protect, noconstant("")
 
; Constants
declare c_error_handler					= vc with protect, constant("PATCH ENC INSURANCE")
declare c_now_dt_tm						= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_insured_person_reltn_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_business_address_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare c_userdefined_info_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare ValidatePerson(person_id = f8) 			= i2 with protect
declare GetZipDefaults(zipcode = vc)			= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare GetHealthPlanInfo(null)					= i2 with protect	;4130034 - oaf_get_plan_info
declare ValidatePrioritization					= null with protect
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare PostInsurance(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare GetInsuranceId(null)					= i2 with protect
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag = cnvtint($DEBUG_FLAG)
set input->username = trim($USERNAME, 3)
set input->prsnl_id = GetPrsnlIDfromUserName(input->username)
set sJsonArgs = trim($JSON,3)
set jrec = cnvtjsontorec(sJsonArgs)
 
;Insurance
set input->encntr_plan_reltn_id = cnvtreal(arglist->insuranceId)
if(trim(arglist->healthPlanId,3) != c_null_value)
	set input->health_plan_id = cnvtreal(arglist->healthPlanId)
else
	set input->health_plan_id = -1
endif
if(trim(arglist->eligibilityStatusId,3) != c_null_value)
	set input->eligibility_status_cd = cnvtreal(arglist->eligibilityStatusId)
else
	set input->eligibility_status_cd = -1
endif
if(trim(arglist->subscriberId,3) != c_null_value)
	set input->subscriber_id = cnvtreal(arglist->subscriberId)
else
	set input->subscriber_id = -1
endif
if(trim(arglist->patientRelationshipToSubscriber,3) != c_null_value)
	set input->patient_reltn_to_subscriber_cd =
		cnvtreal(arglist->patientRelationshipToSubscriber)
else
	set input->patient_reltn_to_subscriber_cd = -1
endif
if(trim(arglist->subscriberRelationshipToPatientId,3) != c_null_value)
	set input->subscriber_reltn_to_patient_cd =
		cnvtreal(arglist->subscriberRelationshipToPatientId)
else
	set input->subscriber_reltn_to_patient_cd = -1
endif
if(trim(arglist->priority,3) != c_null_value)
	set input->priority = cnvtint(arglist->priority)
else
	set input->priority = -1
endif
if(cnvtdatetime(arglist->beginEffectiveDateTime) > 0)
	set input->beg_effective_dt_tm = GetDateTime(arglist->beginEffectiveDateTime)
endif
if(cnvtdatetime(arglist->endEffectiveDateTime) > 0)
	set input->end_effective_dt_tm = GetDateTime(arglist->endEffectiveDateTime)
endif
if(trim(arglist->insuranceCardCopiedId,3) != c_null_value)
	set input->ins_card_copied_cd = cnvtreal(arglist->insuranceCardCopiedId)
else
	set input->ins_card_copied_cd = -1
endif
set input->insured_card_name_first = trim(arglist->insuranceCardNameFirst,3)
set input->insured_card_name_last = trim(arglist->insuranceCardNameLast,3)
set input->insured_card_name_middle = trim(arglist->insuranceCardNameMiddle,3)
set input->subs_member_nbr = trim(arglist->subscriberMemberNumber,3)
set input->member_nbr = trim(arglist->memberNumber,3)
set input->policy_number = trim(arglist->policyNumber,3)
set input->group_name = trim(arglist->groupName,3)
set input->group_number = trim(arglist->groupNumber,3)
if(trim(arglist->verificationStatusId,3) != c_null_value)
	set input->verify_status_cd = cnvtreal(arglist->verificationStatusId)
else
	set input->verify_status_cd = -1
endif
if(trim(arglist->verificationSourceId,3) != c_null_value)
	set input->verify_source_cd = cnvtreal(arglist->verificationSourceId)
else
	set input->verify_source_cd = -1
endif
if(cnvtdatetime(arglist->verificationDateTime) > 0)
	set input->verify_dt_tm = GetDateTime(arglist->verificationDateTime)
endif
if(trim(arglist->verificationPersonnelId,3) != c_null_value)
	set input->verify_prsnl_id = cnvtreal(arglist->verificationPersonnelId)
else
	set input->verify_prsnl_id = -1
endif
if(trim(arglist->assignmentOfBenefitsId,3) != c_null_value)
	set input->assign_benefits_cd = cnvtreal(arglist->assignmentOfBenefitsId)
else
	set input->assign_benefits_cd = -1
endif
if(trim(arglist->deductibleAmount,3) != c_null_value)
	set input->deduct_amt = cnvtreal(arglist->deductibleAmount)
else
	set input->deduct_amt = -1
endif
if(trim(arglist->deductibleRemaining,3) != c_null_value)
	set input->deduct_remain_amt = cnvtreal(arglist->deductibleRemaining)
else
	set input->deduct_remain_amt = -1
endif
if(trim(arglist->deductibleIncludingMaxOutOfPocket,3) != c_null_value)
	set input->deduct_inc_max_oop = cnvtreal(arglist->deductibleIncludingMaxOutOfPocket)
else
	set input->deduct_inc_max_oop = -1
endif
if(trim(arglist->copayAmount,3) != c_null_value)
	set input->copay_amt = cnvtreal(arglist->copayAmount)
else
	set input->copay_amt = -1
endif
if(trim(arglist->copayIncludingMaxOutOfPocket,3) != c_null_value)
	set input->copay_inc_max_oop = cnvtreal(arglist->copayIncludingMaxOutOfPocket)
else
	set input->copay_inc_max_oop = -1
endif
if(trim(arglist->maxOutOfPocket,3) != c_null_value)
	set input->max_out_pckt_amt = cnvtreal(arglist->maxOutOfPocket)
else
	set input->max_out_pckt_amt = -1
endif
if(trim(arglist->familyDeductibleMetAmount,3) != c_null_value)
	set input->fam_deduct_met_amt = cnvtreal(arglist->familyDeductibleMetAmount)
else
	set input->fam_deduct_met_amt = -1
endif
 
;Insurance address
if(trim(arglist->address.addressId,3) != c_null_value)
	set input->address.address_id = cnvtreal(arglist->address.addressId)
else
	set input->address.address_id = -1
endif
set input->address.address1 = trim(arglist->address.address1,3)
set input->address.address2 = trim(arglist->address.address2,3)
set input->address.address3 = trim(arglist->address.address3,3)
if(trim(arglist->address.typeId,3) != c_null_value)
	set input->address.address_type_cd = cnvtreal(arglist->address.typeId)
else
	set input->address.address_type_cd = -1
endif
set input->address.city = trim(arglist->address.city,3)
set input->address.zip = trim(arglist->address.zip,3)
 
;State
set input->address.state = trim(arglist->address.state,3)
if(input->address.state != c_null_value)
	if(cnvtreal(input->address.state)> 0)
		set input->address.state_cd = cnvtreal(input->address.state)
	else
		set input->address.state_cd =
			uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->address.state))
	endif
else
	set input->address.state_cd = -1
endif
;County
set input->address.county = trim(arglist->address.county,3)
if(input->address.county != c_null_value)
	if(cnvtreal(input->address.county)> 0)
		set input->address.county_cd = cnvtreal(input->address.county)
	else
		set input->address.county_cd =
			uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->address.county))
	endif
else
	set input->address.county_cd = -1
endif
;Country
set input->address.country = trim(arglist->address.country,3)
if(input->address.country != c_null_value)
	if(cnvtreal(input->address.country)> 0)
		set input->address.country_cd = cnvtreal(input->address.country)
	else
		set input->address.country_cd =
			uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->address.country))
	endif
else
	set input->address.country_cd = -1
endif
 
;Insurance phones
set insPhSize = size(arglist->phones,5)
if(insPhSize > 0)
	for(p = 1 to insPhSize)
		set stat = alterlist(input->phones,p)
		set input->phones[p].phone_id = cnvtreal(arglist->phones[p].phoneId)
		if(trim(arglist->phones[p].typeId,3) != c_null_value)
			set input->phones[p].phone_type_cd = cnvtreal(arglist->phones[p].typeId)
		else
			set input->phones[p].phone_type_cd = -1
		endif
		if(trim(arglist->phones[p].formatId,3) != c_null_value)
			set input->phones[p].format_id = cnvtreal(arglist->phones[p].formatId)
		else
			set input->phones[p].format_id = -1
		endif
		set input->phones[p].number = trim(arglist->phones[p].number,3)
		set input->phones[p].extension = trim(arglist->phones[p].extension,3)
		set input->phones[p].contact = trim(arglist->phones[p].contact,3)
	endfor
endif
 
;Insurance custom fields
set insCustSize = size(arglist->customFields,5)
if(insCustSize > 0)
	for(c = 1 to insCustSize)
		set stat = alterlist(input->custom_fields,c)
		set input->custom_fields[c].field_id =
			cnvtreal(arglist->customFields[c].fieldId)
		set input->custom_fields[c].text_value =
			trim(arglist->customFields[c].responseValue,3)
	endfor
endif
 
;Prioritization
set priSize = size(arglist->prioritization,5)
if(priSize > 0)
	for(i = 1 to priSize)
		set stat = alterlist(input->prioritization,i)
		set input->prioritization[i].encntr_plan_reltn_id = cnvtreal(arglist->prioritization[i].insuranceId)
		set input->prioritization[i].priority = cnvtint(arglist->prioritization[i].priority)
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
;Validate insuranceId exists
if(input->encntr_plan_reltn_id = 0) call ErrorMsg("InsuranceId","9999","M") endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, insurance_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get health plan data - 4130034 - oaf_get_plan_info
if(input->health_plan_id > 0)
	set iRet = GetHealthPlanInfo(null)
	if(iRet = 0) call ErrorMsg("Could not retrieve health plan info (4130034).","9999","E") endif
endif
 
;Validate priority sequences if changed
if(input->priority > 0)
	call ValidatePrioritization(null)
endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Create the Insurance(s)
set iRet = PostInsurance(null)
if(iRet = 0)
  	  call ErrorMsg("Could not post insurance.","9999","E")
else
	set iRet = GetInsuranceId(null)
	if(iRet = 0)
		call ErrorMsg("Could not post insurance.","9999","E")
	else
		call ErrorHandler2(c_error_handler, "S", c_error_handler, "Insurance updated successfully.",
  		"0000",build2("Insurance updated successfully."), insurance_reply_out)
  	endif
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
set JSONout = CNVTRECTOJSON(insurance_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_patch_enc_ins.json")
	call echo(build2("_file : ", _file))
	call echojson(insurance_reply_out, _file, 0)
	call echorecord(insurance_reply_out)
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
			error_code, build2("Missing required field: ",msg), insurance_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), insurance_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, insurance_reply_out)
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
 
	;Validate InsuranceId
	select into "nl:"
	from encntr_plan_reltn epr
		, encounter e
	plan epr where epr.encntr_plan_reltn_id = input->encntr_plan_reltn_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
	join e where e.encntr_id = epr.encntr_id
	head report
		x = 0
	detail
		input->patient_id = e.person_id
		input->encntr_id = e.encntr_id
		input->person_plan_reltn_id = epr.person_plan_reltn_id
		input->current_subscriber_id = epr.person_id
 
		if(input->insured_card_name_first = c_null_value)
			input->insured_card_name_first = epr.insured_card_name_first
		endif
		if(input->insured_card_name_middle = c_null_value)
			input->insured_card_name_middle = epr.insured_card_name_middle
		endif
		if(input->insured_card_name_last = c_null_value)
			input->insured_card_name_last = epr.insured_card_name_last
		endif
		input->insured_card_name_suffix = epr.insured_card_name_suffix
	with nocounter
 
	; Validate EncounterId & PatientId
	if(input->encntr_id = 0 or input->patient_id = 0)
		call ErrorMsg("InsuranceId","2055","I")
	endif
 
	;Get other active insurance plans
	select into "nl:"
	from encntr_plan_reltn epr
		, encounter e
	plan epr where epr.encntr_id = input->encntr_id
		and epr.encntr_plan_reltn_id != input->encntr_plan_reltn_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
	join e where e.encntr_id = epr.encntr_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(input->other_active_plans,x)
		input->other_active_plans[x].plan_reltn_id = epr.encntr_plan_reltn_id
	with nocounter
 
	;Validate HealthPlan
	if(input->health_plan_id > 0)
		set iRet = 0
		select into "nl:"
		from health_plan hp
		where hp.health_plan_id = input->health_plan_id
			and hp.active_ind = 1
			and hp.beg_effective_dt_tm <= sysdate
			and hp.end_effective_dt_tm > sysdate
		detail
			iRet = 1
		with nocounter
		if(iRet = 0) call ErrorMsg("HealthPlanId","9999","I") endif
	endif
 
	;Validate EligiblityStatusCd
	if(input->eligibility_status_cd > 0)
		set iRet = GetCodeSet(input->eligibility_status_cd)
		if(iRet != 26307) call ErrorMsg("EligibilityStatusId","9999","I") endif
	endif
 
	;Validate SubscriberId
	if(input->subscriber_id > 0)
		set iRet = ValidatePerson(input->subscriber_id)
		if(iRet = 0) call ErrorMsg("SubscriberId","9999","I") endif
	endif
 
	;Validate PatientRelationshipToSubscriberId
	if(input->patient_reltn_to_subscriber_cd > 0)
		set iRet = GetCodeSet(input->patient_reltn_to_subscriber_cd)
		if(iRet != 40) call ErrorMsg("Subscriber.PatientRelationshipToSubscriber","9999","I") endif
 
		set iRet = GetCodeSet(input->subscriber_reltn_to_patient_cd)
		if(iRet != 40) call ErrorMsg("Subscriber.SubscriberRelationToPatientId","9999","I") endif
	endif
 
	;Validate SubscriberRelationToPatientId
	if(input->subscriber_reltn_to_patient_cd > 0)
		set iRet = GetCodeSet(input->subscriber_reltn_to_patient_cd)
		if(iRet != 40) call ErrorMsg("Subscriber.SubscriberRelationToPatientId","9999","I") endif
	endif
 
	;Validate if person/relationship type already exists - set internal_seq
	if(input->subscriber_id > 0 and input->subscriber_id != input->current_subscriber_id)
		set iRet = 0
		select into "nl:"
		from encntr_person_reltn epr
		plan epr where epr.encntr_id = input->encntr_id
			and epr.person_reltn_type_cd = c_insured_person_reltn_type_cd
		detail
			if(epr.person_reltn_cd = input->subscriber_reltn_to_patient_cd)
				if(epr.related_person_id != input->subscriber_id)
					if(epr.internal_seq >= input->reltn_internal_seq)
						input->reltn_internal_seq = epr.internal_seq + 1
					endif
				else
					input->reltn_internal_seq = epr.internal_seq
				endif
			endif
		with nocounter
	endif
 
	;Get Encntr_Person_Reltn_Id
	select into "nl:"
	from encntr_person_reltn epr
	plan epr where epr.encntr_id = input->encntr_id
		and epr.related_person_id = input->current_subscriber_id
		and epr.person_reltn_type_cd = c_insured_person_reltn_type_cd
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
		and epr.active_ind = 1
	detail
		input->encntr_person_reltn_id = epr.encntr_person_reltn_id
	with nocounter
 
	;Validate InsuranceCardCopiedId
	if(input->ins_card_copied_cd > 0)
		set iRet = GetCodeSet(input->ins_card_copied_cd)
		if(iRet != 14167) call ErrorMsg("InsuranceCardCopiedId","9999","I") endif
	endif
 
	;Validate VerificationStatusId
	if(input->verify_status_cd > 0)
		set iRet = GetCodeSet(input->verify_status_cd)
		if(iRet != 14665) call ErrorMsg("VerificationStatusId","9999","I") endif
	endif
 
	;Validate VerificationSourceId
	if(input->verify_source_cd > 0)
		set iRet = GetCodeSet(input->verify_source_cd)
		if(iRet != 4002563) call ErrorMsg("VerificationStatusId","9999","I") endif
	endif
 
	;Validate VerificationPersonnelId
	if(input->verify_prsnl_id > 0)
		set iRet = GetPositionByPrsnlId(input->verify_prsnl_id)
		if(iRet = 0) call ErrorMsg("VerificationPersonnelId","9999","I") endif
	endif
 
	;Validate AssignmentOfBenefitsId
	if(input->assign_benefits_cd > 0)
		set iRet = GetCodeSet(input->assign_benefits_cd)
		if(iRet != 14142) call ErrorMsg("AssignmentOfBenefitsId","9999","I") endif
	endif
 
	;Set insured card name if insured_card fields are sent
	set input->insured_card_name = trim(build2(input->insured_card_name_first,
		" ",input->insured_card_name_middle,
		" ",input->insured_card_name_last,
		" ",input->insured_card_name_suffix),3)
	set input->insured_card_name = replace(input->insured_card_name,"  "," ")
 
	;Get current address data for null values
	select into "nl:"
	from address a
	plan a where a.parent_entity_id = input->encntr_plan_reltn_id
		and a.parent_entity_name = "ENCNTR_PLAN_RELTN"
	detail
		input->address.db_address_id = a.address_id
		if(input->address.address_id = -1)
			input->address.address_id = a.address_id
		endif
		if(input->address.address_type_cd = -1)
			input->address.address_type_cd = a.address_type_cd
		endif
		if(input->address.address1 = c_null_value)
			input->address.address1 = a.street_addr
		endif
		if(input->address.address2 = c_null_value)
			input->address.address2 = a.street_addr2
		endif
		if(input->address.address3 = c_null_value)
			input->address.address3 = a.street_addr3
		endif
		if(input->address.city = c_null_value)
			input->address.city = a.city
		endif
		if(input->address.state = c_null_value)
			input->address.state = a.state
			input->address.state_cd = a.state_cd
		endif
		if(input->address.county = c_null_value)
			input->address.county = a.county
			input->address.county_cd = a.county_cd
		endif
		if(input->address.country = c_null_value)
			input->address.country = a.country
			input->address.country_cd = a.country_cd
		endif
		if(input->address.zip = c_null_value)
			input->address.zip = a.zipcode
		endif
	with nocounter
 
	;Validate AddressId
	if(input->address.address_id > 0)
		if(input->address.address_id != input->address.db_address_id)
			call ErrorMsg("AddressId","9999","I")
		endif
	endif
 
	;Validate AddressTypeId
	set iRet = GetCodeSet(input->address.address_type_cd)
	if(iRet != 212) call ErrorMsg("Address.TypeId","9999","I") endif
 
	; Get Zipcode defaults
	if(input->address.zip > " ")
		set stat = initrec(114382_req)
		set stat = initrec(114382_rep)
		call GetZipDefaults(input->address.zip)
		if(input->address.county_cd = 0)
			set input->address.county_cd = 114382_rep->county_cd
		endif
		if(input->address.county = "")
			set input->address.county = 114382_rep->county
		endif
		if(input->address.state_cd <= 0)
			set input->address.state_cd = 114382_rep->state_cd
		endif
	endif
 
	;Get Country
	if(input->address.country_cd = 0 or input->address.country = "")
		select into "nl:"
		from code_value_group cvg
		, code_value cv
		plan cvg where cvg.child_code_value = input->address.state_cd
		join cv where cv.code_value = cvg.parent_code_value
				and cv.code_set = 15
		detail
			if(input->address.country_cd <= 0)
				input->address.country_cd = cv.code_value
			endif
			if(input->address.country = "")
				input->address.country = cv.display
			endif
		with nocounter
	endif
 
	;Validate Phone Data
	set ipSize = size(input->phones,5)
	if(ipSize > 0)
		for(p = 1 to ipSize)
			; Get current values for the null fields
			if(input->phones[p].phone_id > 0)
				set check = 0
				select into "nl:"
				from phone p
				plan p where p.parent_entity_id = input->encntr_plan_reltn_id
					and p.parent_entity_name = "ENCNTR_PLAN_RELTN"
					and p.phone_id = input->phones[p].phone_id
				detail
					check = 1
					if(input->phones[p].phone_type_cd = -1)
						input->phones[p].phone_type_cd = p.phone_type_cd
					endif
					if(input->phones[p].number = c_null_value)
						input->phones[p].number = p.phone_num
					endif
					if(input->phones[p].extension = c_null_value)
						input->phones[p].extension = p.extension
					endif
					if(input->phones[p].contact = c_null_value)
						input->phones[p].contact = p.contact
					endif
					if(input->phones[p].format_id = -1)
						input->phones[p].format_id = p.phone_format_cd
					endif
				with nocounter
 
				if(check = 0) call ErrorMsg("PhoneId","9999","I") endif
			endif
 
			;Validate TypeId
			set iRet = GetCodeSet(input->phones[p].phone_type_cd)
			if(iRet != 43) call ErrorMsg("Insurance.Phone.TypeId","9999","I") endif
 
			;Validate FormatType
			if(input->phones[p].format_id > 0)
				set iRet = GetCodeSet(input->phones[p].format_id)
				if(iRet != 281) call ErrorMsg("Insurance.Phone.FormatId","9999","I") endif
			endif
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
;	Name: GetHealthPlanInfo(null) = i2  - 4130034 - oaf_get_plan_info
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
 
	;Setup request
	set check = 0
	select into "nl:"
	from org_plan_reltn opr
	plan opr where opr.health_plan_id = input->health_plan_id
		and opr.active_ind = 1
		and opr.beg_effective_dt_tm <= sysdate
		and opr.end_effective_dt_tm > sysdate
	detail
		check = 1
 			input->org_plan_reltn_cd = opr.org_plan_reltn_cd
 
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
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetHealthPlanInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidatePrioritization(null) = null
;  Description: Validate prioritization sequencing
**************************************************************************/
subroutine ValidatePrioritization(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePrioritization Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Add priorities to list from existing data
	if(input->priority > 0)
		select into "nl:"
		from encntr_plan_reltn epr
		plan epr where epr.encntr_id = input->encntr_id
			and epr.beg_effective_dt_tm <= sysdate
			and epr.end_effective_dt_tm > sysdate
			and epr.active_ind = 1
		order by epr.priority_seq
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(priorities->list,x)
 
 			priorities->list[x].encntr_plan_reltn_id = epr.encntr_plan_reltn_id
			priorities->list[x].priority = epr.priority_seq
		foot report
			priorities->cnt = x
		with nocounter
 
		;Validate prioritization block is correct
		set pSize = size(input->prioritization,5)
		if(pSize = 0 and priorities->cnt > 1)
			call ErrorMsg("The prioritization object is required when the priority is being updated and multiple plans exist.","9999","E")
		endif
 
		;Add main plan to prioritization block if not already there
		set idx = 1
		set pos = locateval(idx,1,pSize,input->encntr_plan_reltn_id,input->prioritization[idx].encntr_plan_reltn_id)
		if(pos = 0)
			set pSize = pSize + 1
			set stat = alterlist(input->prioritization,pSize)
			set input->prioritization[pSize].encntr_plan_reltn_id = input->encntr_plan_reltn_id
			set input->prioritization[pSize].priority = input->priority
		endif
 
		;Check prioritization block for all health plans - update priority
		for(i = 1 to priorities->cnt)
			set pos = locateval(idx,1,size(input->prioritization,5),priorities->list[i].encntr_plan_reltn_id,
				input->prioritization[idx].encntr_plan_reltn_id)
			if(pos = 0)
				call ErrorMsg("Prioritization object is missing health plans","9999","E")
			else
				set priorities->list[i].priority = input->prioritization[pos].priority
			endif
		endfor
 
		;Validate priorities - sequencing goes 1,2,3..etc, no duplicates, no missing sequences
		set errorCheck = 0
		for(t = 1 to priorities->cnt)
			set posCnt = 0
			set idx = 1
			set next = 1
			set pos = locateval(idx,next,priorities->cnt,t,priorities->list[idx].priority)
			if(pos > 0)
				while(pos > 0 and next < priorities->cnt)
					set posCnt = posCnt + 1
 
					set next = pos + 1
					set pos = locateval(idx,next,priorities->cnt,t,priorities->list[idx].priority)
				endwhile
				if(posCnt > 1)
					set errorCheck = 1
				endif
			else
				set errorCheck = 1
			endif
		endfor
 
		if(errorCheck)
			call ErrorMsg("Priority sequencing for insurances is invalid","9999","E")
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidatePrioritization Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
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
;  Name: PostInsurance(null) = null
;  Description: Post new insurance(s)
**************************************************************************/
subroutine PostInsurance(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostInsurance Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	; Insurance/Subscriber
	; Get indexes of current data
	declare pos = i4
	declare p = i4
	set idx = 1
 
	select into "nl:"
 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
 		,(dummyt d2 with seq = 1)
 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
 	join d2 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
 		input->encntr_plan_reltn_id
 	detail
 		pos = d.seq
 		p = d2.seq
 	with nocounter
 
 	;Add update_reltn_ind to all active insurances - this prevents them from being inactivated
 	if(size(input->other_active_plans,5) > 0)
	 	select into "nl:"
	 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
	 		,(dummyt d2 with seq = 1)
	 		,(dummyt d3 with seq = size(input->other_active_plans,5))
	 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
	 	join d2
	 	join d3 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
	 		input->other_active_plans[d3.seq].plan_reltn_id
	 	detail
	 		pm_obj_req->person.person_person_reltn[d.seq].update_reltn_ind = 1
	 	with nocounter
 	endif
 
 	;Update suscriber information
 	set pm_obj_req->person.person_person_reltn[pos].update_reltn_ind = 1
 	if(input->subscriber_id > 0 and input->subscriber_id != input->current_subscriber_id)
 		set pm_obj_req->person.person_person_reltn[pos].encntr_person_reltn_id =
 			input->encntr_plan_reltn_id - (2 * input->encntr_plan_reltn_id)
 		set pm_obj_req->person.person_person_reltn[pos].related_person_id = input->subscriber_id
 		set pm_obj_req->person.person_person_reltn[pos].person_reltn_type_cd = c_insured_person_reltn_type_cd
 		set pm_obj_req->person.person_person_reltn[pos].prior_person_reltn_cd =
 			pm_obj_req->person.person_person_reltn[pos].person_reltn_cd
 		set pm_obj_req->person.person_person_reltn[pos].person_reltn_cd =
			input->subscriber_reltn_to_patient_cd
		set pm_obj_req->person.person_person_reltn[pos].related_person_reltn_cd =
			input->patient_reltn_to_subscriber_cd
 	else
 		if(input->subscriber_reltn_to_patient_cd > 0)
 			set pm_obj_req->person.person_person_reltn[pos].person_reltn_cd =
				input->subscriber_reltn_to_patient_cd
		endif
		if(input->patient_reltn_to_subscriber_cd > -1)
			set pm_obj_req->person.person_person_reltn[pos].related_person_reltn_cd =
				input->patient_reltn_to_subscriber_cd
		endif
	endif
 
 	;Below fields make it so only encounter reltn is done and not person - possible future functionality
		;pm_obj_req->person.person_person_reltn[pos]encntr_only_ind = 1
		;pm_obj_req->person.person_person_reltn[pos]encntr_updt_flag = 1
 
 	;Health Plan
 	if(input->health_plan_id > 0)
		set hp = locateval(idx,1,health_plan_data->health_plan_qual,input->health_plan_id
			,health_plan_data->health_plan[idx].health_plan_id)
 
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].health_plan_id =
			health_plan_data->health_plan[hp].health_plan_id
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].organization_id =
			health_plan_data->health_plan[hp].organization_id
 
		;Plan Info
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.health_plan_id =
			health_plan_data->health_plan[hp].health_plan_id
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.plan_type_cd =
			health_plan_data->health_plan[hp].plan_type_cd
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.plan_name =
			health_plan_data->health_plan[hp].plan_name
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.plan_desc =
			health_plan_data->health_plan[hp].plan_desc
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.financial_class_cd =
			health_plan_data->health_plan[hp].financial_class_cd
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.plan_class_cd =
			health_plan_data->health_plan[hp].plan_class_cd
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].plan_info.eligibility_status_cd =
			input->eligibility_status_cd
 
		;Org Info
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_info.organization_id =
			health_plan_data->health_plan[hp].organization_id
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_info.org_name =
			health_plan_data->health_plan[hp].org_name
 	endif
 
	if(input->member_nbr != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].member_nbr = input->member_nbr
	endif
	if(input->deduct_amt > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].deduct_amt = input->deduct_amt
	endif
	if(input->deduct_remain_amt > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].deduct_remain_amt = input->deduct_remain_amt
	endif
	if(input->max_out_pckt_amt > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].max_out_pckt_amt = input->max_out_pckt_amt
	endif
	if(input->fam_deduct_met_amt > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].fam_deduct_met_amt = input->fam_deduct_met_amt
	endif
	if(input->verify_status_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].verify_status_cd = input->verify_status_cd
	endif
	if(input->verify_dt_tm > 0)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].verify_dt_tm = input->verify_dt_tm
	endif
	if(input->verify_prsnl_id > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].verify_prsnl_id = input->verify_prsnl_id
	endif
	if(input->verify_source_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].verify_source_cd = input->verify_source_cd
	endif
	if(input->beg_effective_dt_tm > 0)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].beg_effective_dt_tm = input->beg_effective_dt_tm
	endif
	if(input->end_effective_dt_tm > 0)
 		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].end_effective_dt_tm = input->end_effective_dt_tm
 	endif
	if(input->copay_amt > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].copay_amt = input->copay_amt
	endif
	if(input->deduct_inc_max_oop > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].room_coverage_board_incl_cd =
			input->deduct_inc_max_oop
	endif
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].insured_card_name_first =
		input->insured_card_name_first
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].insured_card_name_last =
		input->insured_card_name_last
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].insured_card_name_middle =
		input->insured_card_name_middle
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].insured_card_name =
		input->insured_card_name
 
	;Org Plan
	if(input->health_plan_id > 0)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_plan.health_plan_id =
			input->health_plan_id
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_plan.org_plan_reltn_cd =
			input->org_plan_reltn_cd
	endif
 
	if(input->group_number != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_plan.group_nbr = input->group_number
	endif
	if(input->group_name != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].org_plan.group_name = input->group_name
	endif
 
	;Address
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.address_id =
		input->address.address_id
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.address_type_cd =
		input->address.address_type_cd
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.street_addr =
		input->address.address1
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.street_addr2 =
		input->address.address2
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.street_addr3 =
		input->address.address3
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.city =
		input->address.city
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.state =
		input->address.state
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.state_cd =
		input->address.state_cd
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.zipcode =
		input->address.zip
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.county =
		input->address.county
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.county_cd =
		input->address.county_cd
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.country =
		input->address.country
	set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].address.country_cd =
		input->address.country_cd
 
	;Phone
	set phSize =  size(input->phones,5)
	if(phSize > 0)
		for(ph = 1 to phSize)
			if(input->phones[ph].phone_id > 0)
				if(input->phones[ph].phone_id = pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.phone_id)
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.phone_type_cd =
						input->phones[ph].phone_type_cd
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.phone_num =
						input->phones[ph].number
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.extension =
						input->phones[ph].extension
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.phone_format_cd =
						input->phones[ph].format_id
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].phone.contact =
						input->phones[ph].contact
				else
					set idx = 1
					set aphSize = size(pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone,5)
					set x = locateval(idx,1,aphSize,input->phones[ph].phone_id,
						pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[idx].phone_id)
 
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
						input->phones[ph].phone_type_cd
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
						input->phones[ph].number
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].extension =
						input->phones[ph].extension
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
						input->phones[ph].format_id
					set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].contact =
						input->phones[ph].contact
				endif
			else
				set x = size(pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone,5) + 1
				set stat = alterlist(pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone,x)
 
				set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
					input->phones[ph].phone_type_cd
				set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
					input->phones[ph].number
				set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].extension =
					input->phones[ph].extension
				set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
					input->phones[ph].format_id
				set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].addtnl_phone[x].contact =
					input->phones[ph].contact
			endif
		endfor
	endif
 
	;Encntr_Plan_Reltn
	if(input->subs_member_nbr != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn[1].subs_member_nbr =
			input->subs_member_nbr
	endif
	if(input->ins_card_copied_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn[1].ins_card_copied_cd =
			input->ins_card_copied_cd
	endif
	if(input->assign_benefits_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn[1].assign_benefits_cd =
			input->assign_benefits_cd
	endif
	if(input->beg_effective_dt_tm > 0)
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn[1].beg_effective_dt_tm =
			input->beg_effective_dt_tm
	endif
	if(input->end_effective_dt_tm > 0)
 		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].encntr_plan_reltn[1].end_effective_dt_tm =
			input->end_effective_dt_tm
	endif
 
	;Fin
	if(input->copay_inc_max_oop > -1)
		set finSize = size(pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].fin,5)
		if(finSize = 0)
			set finSize = finSize + 1
			set stat = alterlist(pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].fin,1)
		endif
		set pm_obj_req->person.person_person_reltn[pos].person.person_plan_reltn[p].fin[1].room_coverage_board_incl_cd	=
				input->copay_inc_max_oop
	endif
 
 	;Update Related Persons Person object
 	if(input->subscriber_id > 0 and input->subscriber_id != input->current_subscriber_id)
	 	for(i = 1 to size(pm_obj_req->person.person_person_reltn,5))
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
		endfor
	endif
 
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
 
 	;Update priorities if entered
 	if(input->priority > 0)
 		select into "nl:"
 		from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
 			,(dummyt d2 with seq = 1)
 			,(dummyt d3 with seq = priorities->cnt)
 		plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
 		join d2
 		join d3 where priorities->list[d3.seq].encntr_plan_reltn_id =
 			pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id
 		detail
 			pm_obj_req->person.person_person_reltn[d.seq].priority_seq =
 				priorities->list[d3.seq].priority
 
 			pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].priority_seq =
 				priorities->list[d3.seq].priority
 
 			pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn[1].priority_seq =
 				priorities->list[d3.seq].priority
 		with nocounter
	endif
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostInsurance Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetInsuranceId(null) = i2
;  Description: Get the newly created encntr_plan_reltn id
**************************************************************************/
subroutine GetInsuranceId(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInsuranceId Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from encntr_plan_reltn epr
	where epr.encntr_id = input->encntr_id
		and epr.priority_seq = epr.priority_seq
	detail
		iValidate = 1
		insurance_reply_out->insurance_id = epr.encntr_plan_reltn_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetInsuranceId Runtime: ",
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
