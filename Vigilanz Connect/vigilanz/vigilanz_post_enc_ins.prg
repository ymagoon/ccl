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
      Source file name: snsro_post_enc_ins.prg
      Object name:      vigilanz_post_enc_ins
      Program purpose:  POST new encounter insurance(s) in millennium
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
 001 02/14/20 RJC		Initial Write
 002 02/28/20 RJC		Renamed health_plans rec to health_plan_data due to conflict
 003 03/30/20 DSH		Require either PatientRelationshipToSubscriber or SubscriberRelationToPatientId.
						Fix to allow mutiple insurances with the same subscriber.
 004 04/10/20 RJC		Added active_ind check in GetInsuranceId function
***********************************************************************/
drop program vigilanz_post_enc_ins go
create program vigilanz_post_enc_ins
 
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
  1 insurances[*]
  	2 id					= f8
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
	1 encounterId					= vc	;Required
	1 encounterIdType				= vc	;Optional
	1 insurances[*]
		2 companyId 					= vc	;Not used
		2 companyName					= vc	;Not used
		2 healthPlanId					= vc	;Required
		2 eligibilityStatusId			= vc
		2 eligibilityStatusDate			= vc
		2 subscriberId 					= vc	;Required
		2 subscriber					= vc	;Ignored - subscriberId is required
		2 patientRelationshipToSubscriber = vc	;Required if subscriberRelationshipToPatientId is not populated
		2 subscriberRelationshipToPatientId = vc ;Required if patientRelationshipToSubscriber is not populated
		2 priority						= vc
		2 beginEffectiveDateTime		= vc
		2 endEffectiveDateTime			= vc
		2 insuranceCardCopiedId			= vc
		2 insuranceCardNameLast			= vc
		2 insuranceCardNameFirst		= vc
		2 insuranceCardNameMiddle		= vc
		2 subscriberMemberNumber		= vc
		2 memberNumber					= vc
		2 policyNumber 					= vc
		2 groupName						= vc
		2 groupNumber					= vc
		2 verificationStatusId			= vc
		2 verificationSourceId			= vc
		2 verificationDateTime			= vc
		2 verificationPersonnelId		= vc
		2 assignmentOfBenefitsId		= vc
		2 deductibleAmount				= vc
		2 deductibleRemaining			= vc
		2 deductibleIncludingMaxOutOfPocket = vc
		2 copayAmount					= vc
		2 copayIncludingMaxOutOfPocket	= vc
		2 maxOutOfPocket				= vc
		2 familyDeductibleMetAmount		= vc
		2 address
			3 typeId					= vc
			3 address1					= vc
			3 address2					= vc
			3 address3					= vc
			3 city						= vc
			3 state						= vc
			3 zip						= vc
			3 county					= vc
			3 country					= vc
		2 phones[*]
			3 typeId					= vc
			3 number					= vc
			3 extension					= vc
			3 formatId					= vc
			3 contact					= vc
		2 customFields[*]
			3 fieldId					= vc
			3 responseValue				= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username								= vc
	1 prsnl_id								= f8
	1 patient_id 							= f8
	1 encntr_id								= f8
	1 encntr_type_cd						= f8
	1 insurances[*]
		2 company_id 					= f8
		2 company_name					= vc
		2 health_plan_id				= f8
		2 eligibility_status_cd			= f8
		2 eligibility_status_date		= dq8 ;currently not used in Cerner
		2 subscriber_id					= f8
		2 reltn_internal_seq			= i4
		2 policy_number					= vc
		2 patient_reltn_to_subscriber_cd = f8
		2 subscriber_reltn_to_patient_cd = f8
		2 org_plan_reltn_cd				= f8
		2 priority						= i4
		2 beg_effective_dt_tm			= dq8
		2 end_effective_dt_tm			= dq8
		2 ins_card_copied_cd			= f8
		2 insured_card_name_last		= vc
		2 insured_card_name_first		= vc
		2 insured_card_name_middle		= vc
		2 insured_card_name				= vc
		2 subs_member_nbr				= vc
		2 member_nbr					= vc
		2 group_name					= vc
		2 group_number					= vc
		2 verify_status_cd				= f8
		2 verify_source_cd				= f8
		2 verify_dt_tm					= dq8
		2 verify_prsnl_id				= f8
		2 assign_benefits_cd			= f8
		2 deduct_amt					= f8
		2 deduct_remain_amt				= f8
		2 deduct_inc_max_oop			= f8 ;room_coverage_board_incl_cd where internal_seq = 0
		2 copay_amt						= f8
		2 copay_inc_max_oop				= f8 ;room_coverage_board_incl_cd where internal_seq = 1
		2 max_out_pckt_amt				= f8
		2 fam_deduct_met_amt			= f8
		2 address
			3 address_type_cd			= f8
			3 address1					= vc
			3 address2					= vc
			3 address3					= vc
			3 city						= vc
			3 state						= vc
			3 state_cd					= f8
			3 zip						= vc
			3 county					= vc
			3 county_cd					= f8
			3 country					= vc
			3 country_cd				= f8
		2 phones[*]
			3 phone_type_cd				= f8
			3 number					= vc
			3 extension					= vc
			3 format_id					= f8
			3 contact					= vc
		2 custom_fields[*]
			3 field_id					= f8
			3 response_value			= vc
	 1 custom_fields[*]
	 	2 field_id 						= f8
		2 text_value 					= vc
		2 codeset						= i4
	 	2 field							= vc
	 	2 length						= i4
	 	2 level							= vc
	 	2 type							= vc
	 	2 numeric_value					= f8
	 	2 date_value					= dq8
	 1 other_active_plans[*]
	 	2 plan_reltn_id					= f8
)
 
;Other
declare sEncounterId					= vc with protect, noconstant("")
declare sJsonArgs						= vc with protect, noconstant("")
 
; Constants
declare c_error_handler					= vc with protect, constant("POST ENC INSURANCE")
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
 
set sEncounterId = trim(arglist->encounterId,3)
set input->encntr_type_cd = cnvtreal(arglist->encounterIdType)
 
;Insurances
set insSize = size(arglist->insurances,5)
if(insSize > 0)
	for(i = 1 to insSize)
		set stat = alterlist(input->insurances,i)
		set input->insurances[i].company_id = cnvtreal(arglist->insurances[i].companyId)
		set input->insurances[i].company_name = trim(arglist->insurances[i].companyName,3)
		set input->insurances[i].health_plan_id = cnvtreal(arglist->insurances[i].healthPlanId)
		set input->insurances[i].eligibility_status_cd = cnvtreal(arglist->insurances[i].eligibilityStatusId)
		set input->insurances[i].eligibility_status_date = cnvtdatetime(arglist->insurances[i].eligibilityStatusDate)
		set input->insurances[i].subscriber_id = cnvtreal(arglist->insurances[i].subscriberId)
		set input->insurances[i].patient_reltn_to_subscriber_cd =
			cnvtreal(arglist->insurances[i].patientRelationshipToSubscriber)
		set input->insurances[i].subscriber_reltn_to_patient_cd =
			cnvtreal(arglist->insurances[i].subscriberRelationshipToPatientId)
		set input->insurances[i].priority = cnvtint(arglist->insurances[i].priority)
		set input->insurances[i].beg_effective_dt_tm = cnvtdatetime(arglist->insurances[i].beginEffectiveDateTime)
		set input->insurances[i].end_effective_dt_tm = cnvtdatetime(arglist->insurances[i].endEffectiveDateTime)
		set input->insurances[i].ins_card_copied_cd = cnvtreal(arglist->insurances[i].insuranceCardCopiedId)
		set input->insurances[i].insured_card_name_first = trim(arglist->insurances[i].insuranceCardNameFirst,3)
		set input->insurances[i].insured_card_name_last = trim(arglist->insurances[i].insuranceCardNameLast,3)
		set input->insurances[i].insured_card_name_middle = trim(arglist->insurances[i].insuranceCardNameMiddle,3)
		set input->insurances[i].subs_member_nbr = trim(arglist->insurances[i].subscriberMemberNumber,3)
		set input->insurances[i].member_nbr = trim(arglist->insurances[i].memberNumber,3)
		set input->insurances[i].policy_number = trim(arglist->insurances[i].policyNumber,3)
		set input->insurances[i].group_name = trim(arglist->insurances[i].groupName,3)
		set input->insurances[i].group_number = trim(arglist->insurances[i].groupNumber,3)
		set input->insurances[i].verify_status_cd = cnvtreal(arglist->insurances[i].verificationStatusId)
		set input->insurances[i].verify_source_cd = cnvtreal(arglist->insurances[i].verificationSourceId)
		set input->insurances[i].verify_dt_tm = cnvtdatetime(arglist->insurances[i].verificationDateTime)
		set input->insurances[i].verify_prsnl_id = cnvtreal(arglist->insurances[i].verificationPersonnelId)
		set input->insurances[i].assign_benefits_cd = cnvtreal(arglist->insurances[i].assignmentOfBenefitsId)
		set input->insurances[i].deduct_amt = cnvtreal(arglist->insurances[i].deductibleAmount)
		set input->insurances[i].deduct_remain_amt = cnvtreal(arglist->insurances[i].deductibleRemaining)
		set input->insurances[i].deduct_inc_max_oop = cnvtreal(arglist->insurances[i].deductibleIncludingMaxOutOfPocket)
		set input->insurances[i].copay_amt = cnvtreal(arglist->insurances[i].copayAmount)
		set input->insurances[i].copay_inc_max_oop = cnvtreal(arglist->insurances[i].copayIncludingMaxOutOfPocket)
		set input->insurances[i].max_out_pckt_amt = cnvtreal(arglist->insurances[i].maxOutOfPocket)
		set input->insurances[i].fam_deduct_met_amt = cnvtreal(arglist->insurances[i].familyDeductibleMetAmount)
 
		;Insurance address
		set input->insurances[i].address.address1 = trim(arglist->insurances[i].address.address1,3)
		set input->insurances[i].address.address2 = trim(arglist->insurances[i].address.address2,3)
		set input->insurances[i].address.address3 = trim(arglist->insurances[i].address.address3,3)
		set input->insurances[i].address.address_type_cd = cnvtreal(arglist->insurances[i].address.typeId)
		set input->insurances[i].address.city = trim(arglist->insurances[i].address.city,3)
 		set input->insurances[i].address.zip = trim(arglist->insurances[i].address.zip,3)
 
		;State
		set input->insurances[i].address.state = trim(arglist->insurances[i].address.state,3)
		if(cnvtreal(input->insurances[i].address.state)> 0)
			set input->insurances[i].address.state_cd = cnvtreal(input->insurances[i].address.state)
		else
			set input->insurances[i].address.state_cd =
				uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->insurances[i].address.state))
		endif
		;County
		set input->insurances[i].address.county = trim(arglist->insurances[i].address.county,3)
		if(cnvtreal(input->insurances[i].address.county)> 0)
			set input->insurances[i].address.county_cd = cnvtreal(input->insurances[i].address.county)
		else
			set input->insurances[i].address.county_cd =
				uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->insurances[i].address.county))
		endif
		;Country
		set input->insurances[i].address.country = trim(arglist->insurances[i].address.country,3)
		if(cnvtreal(input->insurances[i].address.country)> 0)
			set input->insurances[i].address.country_cd = cnvtreal(input->insurances[i].address.country)
		else
			set input->insurances[i].address.country_cd =
				uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->insurances[i].address.country))
		endif
 
		;Insurance phones
		set insPhSize = size(arglist->insurances[i].phones,5)
		if(insPhSize > 0)
			for(p = 1 to insPhSize)
				set stat = alterlist(input->insurances[i].phones,p)
				set input->insurances[i].phones[p].phone_type_cd = cnvtreal(arglist->insurances[i].phones[p].typeId)
				set input->insurances[i].phones[p].number = trim(arglist->insurances[i].phones[p].number,3)
				set input->insurances[i].phones[p].extension = trim(arglist->insurances[i].phones[p].extension,3)
				set input->insurances[i].phones[p].format_id = cnvtreal(arglist->insurances[i].phones[p].formatId)
				set input->insurances[i].phones[p].contact = trim(arglist->insurances[i].phones[p].contact,3)
			endfor
		endif
 
		;Insurance custom fields
		set insCustSize = size(arglist->insurances[i].customFields,5)
		if(insCustSize > 0)
			for(c = 1 to insCustSize)
				set stat = alterlist(input->insurances[i].custom_fields,c)
				set input->insurances[i].custom_fields[c].field_id =
					cnvtreal(arglist->insurances[i].customFields[c].fieldId)
				set input->insurances[i].custom_fields[c].response_value =
					trim(arglist->insurances[i].customFields[c].responseValue,3)
 
				set custSize = size(input->custom_fields,5) + 1
				set stat = alterlist(input->custom_fields,custSize)
				set input->custom_fields[custSize].field_id = input->insurances[i].custom_fields[c].field_id
				set input->custom_fields[custSize].text_value = input->insurances[i].custom_fields[c].response_value
			endfor
		endif
	endfor
else
	call ErrorMsg("No insurances were provided.","9999","E")
endif
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echo(build("sEncounterId--->",sEncounterId))
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate encounterIdType if used and set EncounterId
if(input->encntr_type_cd > 0)
	set iRet = GetCodeSet(input->encntr_type_cd)
	if(iRet != 319) call ErrorMsg("encounterIdType","2065","I") endif
	set input->encntr_id = GetEncntrIdByAlias(sEncounterId,input->encntr_type_cd)
else
	set input->encntr_id = cnvtreal(sEncounterId)
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, insurance_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get health plan data - 4130034 - oaf_get_plan_info
if(size(input->insurances,5) > 0)
	set iRet = GetHealthPlanInfo(null)
	if(iRet = 0) call ErrorMsg("Could not retrieve health plan info (4130034).","9999","E") endif
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
		call ErrorHandler2(c_error_handler, "S", c_error_handler, "Insurance created successfully.",
  		"0000",build2("Insurance created successfully."), insurance_reply_out)
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
	set _file = build2(trim(file_path),"/snsro_post_enc_ins.json")
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
 
	; Validate EncounterId
	if(input->encntr_id = 0)
		call ErrorMsg("EncounterId","2055","M")
	else
		;Set PatientId
		set input->patient_id = GetPersonIdByEncntrId(input->encntr_id)
	endif
 
	;Add priorities to list from existing data
	free record priorities
	record priorities (
		1 list[*]
			2 priority = i4
	)
 
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
		stat = alterlist(input->other_active_plans,x)
 
		priorities->list[x].priority = epr.priority_seq
		input->other_active_plans[x].plan_reltn_id = epr.encntr_plan_reltn_id
	with nocounter
 
	;Validate Insurance data
	set insSize = size(input->insurances,5)
	if(insSize > 0)
		for(i = 1 to insSize)
			;Validate HealthPlan
			set iRet = 0
			select into "nl:"
			from health_plan hp
			where hp.health_plan_id = input->insurances[i].health_plan_id
				and hp.active_ind = 1
				and hp.beg_effective_dt_tm <= sysdate
				and hp.end_effective_dt_tm > sysdate
			detail
				iRet = 1
			with nocounter
			if(iRet = 0) call ErrorMsg("HealthPlanId","9999","I") endif
 
			;Validate EligiblityStatusCd
			if(input->insurances[i].eligibility_status_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].eligibility_status_cd)
				if(iRet != 26307) call ErrorMsg("EligibilityStatusId","9999","I") endif
			endif
 
			;Validate SubscriberId
			set iRet = ValidatePerson(input->insurances[i].subscriber_id)
			if(iRet = 0) call ErrorMsg("SubscriberId","9999","I") endif
 
			;Validate PatientRelationshipToSubscriberId
			if(input->insurances[i].patient_reltn_to_subscriber_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].patient_reltn_to_subscriber_cd)
				if(iRet != 40) call ErrorMsg("Subscriber.PatientRelationshipToSubscriber","9999","I") endif
			elseif(input->insurances[i].subscriber_reltn_to_patient_cd > 0)
				;Validate SubscriberRelationToPatientId
				set iRet = GetCodeSet(input->insurances[i].subscriber_reltn_to_patient_cd)
				if(iRet != 40) call ErrorMsg("Subscriber.SubscriberRelationToPatientId","9999","I") endif
			else
				call ErrorMsg("Subscriber.PatientRelationshipToSubscriber or Subscriber.SubscriberRelationToPatientId","9999","M")
			endif
 
			;Validate if person/relationship type already exists - set internal_seq
			set iRet = 0
			select into "nl:"
			from encntr_person_reltn epr
			plan epr where epr.encntr_id = input->encntr_id
				and epr.person_reltn_type_cd = c_insured_person_reltn_type_cd
			detail
				if(epr.person_reltn_cd = input->insurances[i].subscriber_reltn_to_patient_cd)
					if(epr.related_person_id != input->insurances[i].subscriber_id)
						if(epr.internal_seq >= input->insurances[i].reltn_internal_seq)
							input->insurances[i].reltn_internal_seq = epr.internal_seq + 1
						endif
					else
						input->insurances[i].reltn_internal_seq = epr.internal_seq
					endif
				endif
			with nocounter
 
			;Validate Priority
			if(input->insurances[i].priority < 0)
				call ErrorMsg("Priority","9999","I")
			else
				;Add priority to list
				set priSize = size(priorities->list,5) + 1
				set stat = alterlist(priorities->list,priSize)
				set priorities->list[priSize].priority = input->insurances[i].priority
			endif
 
			;Validate InsuranceCardCopiedId
			if(input->insurances[i].ins_card_copied_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].ins_card_copied_cd)
				if(iRet != 14167) call ErrorMsg("InsuranceCardCopiedId","9999","I") endif
			endif
 
			;Validate VerificationStatusId
			if(input->insurances[i].verify_status_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].verify_status_cd)
				if(iRet != 14665) call ErrorMsg("VerificationStatusId","9999","I") endif
			endif
 
			;Validate VerificationSourceId
			if(input->insurances[i].verify_source_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].verify_source_cd)
				if(iRet != 4002563) call ErrorMsg("VerificationStatusId","9999","I") endif
			endif
 
			;Validate VerificationPersonnelId
			if(input->insurances[i].verify_prsnl_id > 0)
				set iRet = GetPositionByPrsnlId(input->insurances[i].verify_prsnl_id)
				if(iRet = 0) call ErrorMsg("VerificationPersonnelId","9999","I") endif
			endif
 
			;Validate AssignmentOfBenefitsId
			if(input->insurances[i].assign_benefits_cd > 0)
				set iRet = GetCodeSet(input->insurances[i].assign_benefits_cd)
				if(iRet != 14142) call ErrorMsg("AssignmentOfBenefitsId","9999","I") endif
			endif
 
			;Validate DeductibleAmount
			if(input->insurances[i].deduct_amt < 0) call ErrorMsg("DeductibleAmount","9999","I") endif
 
			;Validate DeductibleRemaining
			if(input->insurances[i].deduct_remain_amt < 0) call ErrorMsg("DeductibleRemaining","9999","I") endif
 
			;Validate DeductibleRemaining
			if(input->insurances[i].deduct_remain_amt < 0) call ErrorMsg("DeductibleRemaining","9999","I") endif
 
			;Validate DeductibleIncludingMaxOutOfPocket
			if(input->insurances[i].deduct_inc_max_oop < 0) call ErrorMsg("DeductibleIncludingMaxOutOfPocket","9999","I") endif
 
			;Validate CopayAmount
			if(input->insurances[i].copay_amt < 0) call ErrorMsg("CopayAmount","9999","I") endif
 
			;Validate CopayIncludingMaxOutOfPocket
			if(input->insurances[i].copay_inc_max_oop < 0) call ErrorMsg("CopayIncludingMaxOutOfPocket","9999","I") endif
 
			;Validate MaxOutOfPocketAmount
			if(input->insurances[i].max_out_pckt_amt < 0) call ErrorMsg("MaxOutOfPocketAmount","9999","I") endif
 
			;Validate FamilyDeductibleMetAmount
			if(input->insurances[i].fam_deduct_met_amt < 0) call ErrorMsg("FamilyDeductibleMetAmount","9999","I") endif
 
			;Set insured card name if insured_card fields are sent
			set input->insurances[i].insured_card_name = trim(build2(input->insurances[i].insured_card_name_first,
				" ",input->insurances[i].insured_card_name_middle,
				" ",input->insurances[i].insured_card_name_last),3)
			set input->insurances[i].insured_card_name = replace(input->insurances[i].insured_card_name,"  "," ")
 
			;Validate Address data
			if(input->insurances[i].address.address1 > " "
			or input->insurances[i].address.address2 > " "
			or input->insurances[i].address.address3 > " "
			or input->insurances[i].address.city > " "
			or input->insurances[i].address.state > " "
			or input->insurances[i].address.county > " "
			or input->insurances[i].address.country > " "
			or input->insurances[i].address.zip > " ")
				set iRet = GetCodeSet(input->insurances[i].address.address_type_cd)
				if(iRet != 212) call ErrorMsg("Insurance.Address.TypeId","9999","I") endif
			endif
 
			; Get Zipcode defaults
			if(input->insurances[i].address.zip > " ")
				set stat = initrec(114382_req)
				set stat = initrec(114382_rep)
				call GetZipDefaults(input->insurances[i].address.zip)
				if(input->insurances[i].address.county_cd = 0)
					set input->insurances[i].address.county_cd = 114382_rep->county_cd
				endif
				if(input->insurances[i].address.county = "")
					set input->insurances[i].address.county = 114382_rep->county
				endif
				if(input->insurances[i].address.state_cd <= 0)
					set input->insurances[i].address.state_cd = 114382_rep->state_cd
				endif
			endif
 
			;Get Country
			if(input->insurances[i].address.country_cd = 0 or input->insurances[i].address.country = "")
				select into "nl:"
				from code_value_group cvg
				, code_value cv
				plan cvg where cvg.child_code_value = input->insurances[i].address.state_cd
				join cv where cv.code_value = cvg.parent_code_value
						and cv.code_set = 15
				detail
					if(input->insurances[i].address.country_cd <= 0)
						input->insurances[i].address.country_cd = cv.code_value
					endif
					if(input->insurances[i].address.country = "")
						input->insurances[i].address.country = cv.display
					endif
				with nocounter
			endif
 
			;Validate Phone Data
			set ipSize = size(input->insurances[i].phones,5)
			if(ipSize > 0)
				for(p = 1 to ipSize)
					;Validate TypeId
					set iRet = GetCodeSet(input->insurances[i].phones[p].phone_type_cd)
					if(iRet != 43) call ErrorMsg("Insurance.Phone.TypeId","9999","I") endif
 
					;Validate FormatType
					if(input->insurances[i].phones[p].format_id > 0)
						set iRet = GetCodeSet(input->insurances[i].phones[p].format_id)
						if(iRet != 281) call ErrorMsg("Insurance.Phone.FormatId","9999","I") endif
					endif
				endfor
			endif
		endfor
	endif
 
	;Validate priorities - sequencing goes 1,2,3..etc, no duplicates, no missing sequences
	set priSize = size(priorities->list,5)
	set errorCheck = 0
	for(t = 1 to priSize)
		set posCnt = 0
		set idx = 1
		set next = 1
		set pos = locateval(idx,next,priSize,t,priorities->list[idx].priority)
		if(pos > 0)
			while(pos > 0 and next < priSize)
				set posCnt = posCnt + 1
 
				set next = pos + 1
				set pos = locateval(idx,next,priSize,t,priorities->list[idx].priority)
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
	for(i = 1 to size(arglist->insurances,5))
 
		;Initialize records
		set stat = initrec(4130034_req)
		set stat = initrec(4130034_rep)
 
		;Setup request
		set check = 0
		select into "nl:"
		from org_plan_reltn opr
		plan opr where opr.health_plan_id = input->insurances[i].health_plan_id
			and opr.active_ind = 1
			and opr.beg_effective_dt_tm <= sysdate
			and opr.end_effective_dt_tm > sysdate
		detail
			check = 1
 			input->insurances[i].org_plan_reltn_cd = opr.org_plan_reltn_cd
 
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
		set iValidate = 1
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
 
 	; Insurance/Subscriber
 	set insSize = size(input->insurances,5)
 	if(insSize > 0)
		select into "nl:"
			subscriberid = input->insurances[d.seq].subscriber_id,
			planid = input->insurances[d.seq].health_plan_id
		from (dummyt d with seq = insSize)
		plan d
		order by subscriberid,planid
		detail
			p = 0
 
 			;Verify if subscriber already exists
 			idx = 1
 			pos = locateval(idx,1,size(pm_obj_req->person.person_person_reltn,5),
 				input->insurances[d.seq].subscriber_id,pm_obj_req->person.person_person_reltn[idx].related_person_id,
 				c_insured_person_reltn_type_cd,pm_obj_req->person.person_person_reltn[idx].person_reltn_type_cd,
 				input->insurances[d.seq].subscriber_reltn_to_patient_cd, pm_obj_req->person.person_person_reltn[idx].person_reltn_cd,
 				input->insurances[d.seq].patient_reltn_to_subscriber_cd,
 				pm_obj_req->person.person_person_reltn[idx].related_person_reltn_cd,
 				; Only search for subscribers that are not being updated in the same call
 				0,
 				pm_obj_req->person.person_person_reltn[idx].update_reltn_ind)
 
 			if(pos = 0)
				pprSz = size(pm_obj_req->person.person_person_reltn,5) + 1
				stat = alterlist(pm_obj_req->person.person_person_reltn,pprSz)
	 		else
	 			pprSz = pos
	 		endif
 
	 		;Update suscriber information
 			pm_obj_req->person.person_person_reltn[pprSz].update_reltn_ind = 1
 			pm_obj_req->person.person_person_reltn[pprSz].related_person_id = input->insurances[d.seq].subscriber_id
			pm_obj_req->person.person_person_reltn[pprSz].person_reltn_type_cd = c_insured_person_reltn_type_cd
			pm_obj_req->person.person_person_reltn[pprSz].person_reltn_cd =
				input->insurances[d.seq].subscriber_reltn_to_patient_cd
			pm_obj_req->person.person_person_reltn[pprSz].related_person_reltn_cd =
				input->insurances[d.seq].patient_reltn_to_subscriber_cd
			pm_obj_req->person.person_person_reltn[pprSz].encntr_id = input->encntr_id
 			pm_obj_req->person.person_person_reltn[pprSz].person_id = input->patient_id
 			pm_obj_req->person.person_person_reltn[pprSz].priority_seq = input->insurances[d.seq].priority
 
			;Below fields make it so only encounter reltn is done and not person - possible future functionality
			;pm_obj_req->person.person_person_reltn[pprSz]encntr_only_ind = 1
			;pm_obj_req->person.person_person_reltn[pprSz]encntr_updt_flag = 1
 
			;Health Plan
			idx = 1
			hp = locateval(idx,1,health_plan_data->health_plan_qual,input->insurances[d.seq].health_plan_id,
				health_plan_data->health_plan[idx].health_plan_id)
 
 			ppSize = size(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn,5)
 			next = 1
 			pos2 = locateval(idx,1,ppSize,input->insurances[d.seq].subscriber_id,
 				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[idx].subscriber_person_id,
 				input->insurances[d.seq].health_plan_id,
 				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[idx].health_plan_id)
 
 			;Get current person_plan_id if it exists
 			if(pos2 > 0)
	 			while (pos2 > 0)
	 				if(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[pos2].end_effective_dt_tm > sysdate)
	 					p = pos2
	 				endif
	 				next = pos2 + 1
		 			pos2 = locateval(idx,1,ppSize,input->insurances[d.seq].subscriber_id,
		 				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[idx].subscriber_person_id,
		 				input->insurances[d.seq].health_plan_id,
		 				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[idx].health_plan_id)
			 	endwhile
			 	if(p = 0)
			 		p = ppSize + 1
					stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn,p)
				endif
 			else
 				p = ppSize + 1
				stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn,p)
			endif
 
 			;Person_Plan_Reltn
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].health_plan_id =
				health_plan_data->health_plan[hp].health_plan_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].organization_id =
				health_plan_data->health_plan[hp].organization_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].priority_seq =
				input->insurances[d.seq].priority
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].member_nbr =
				input->insurances[d.seq].member_nbr
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].deduct_amt =
				input->insurances[d.seq].deduct_amt
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].deduct_remain_amt =
				input->insurances[d.seq].deduct_remain_amt
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].max_out_pckt_amt =
				input->insurances[d.seq].max_out_pckt_amt
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].fam_deduct_met_amt =
				input->insurances[d.seq].fam_deduct_met_amt
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].verify_status_cd =
				input->insurances[d.seq].verify_status_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].verify_dt_tm =
				input->insurances[d.seq].verify_dt_tm
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].verify_prsnl_id =
				input->insurances[d.seq].verify_prsnl_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].verify_source_cd =
				input->insurances[d.seq].verify_source_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].beg_effective_dt_tm =
				input->insurances[d.seq].beg_effective_dt_tm
 			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].end_effective_dt_tm =
				input->insurances[d.seq].end_effective_dt_tm
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].copay_amt =
				input->insurances[d.seq].copay_amt
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].room_coverage_board_incl_cd =
				input->insurances[d.seq].deduct_inc_max_oop
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].insured_card_name_first =
				input->insurances[d.seq].insured_card_name_first
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].insured_card_name_last =
				input->insurances[d.seq].insured_card_name_last
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].insured_card_name_middle =
				input->insurances[d.seq].insured_card_name_middle
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].insured_card_name =
				input->insurances[d.seq].insured_card_name
 
			;Plan Info
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.health_plan_id =
				health_plan_data->health_plan[hp].health_plan_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.plan_type_cd =
				health_plan_data->health_plan[hp].plan_type_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.plan_name =
				health_plan_data->health_plan[hp].plan_name
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.plan_desc =
				health_plan_data->health_plan[hp].plan_desc
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.financial_class_cd =
				health_plan_data->health_plan[hp].financial_class_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.plan_class_cd =
				health_plan_data->health_plan[hp].plan_class_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].plan_info.eligibility_status_cd =
				input->insurances[d.seq].eligibility_status_cd
 
			;Org Info
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_info.organization_id =
				health_plan_data->health_plan[hp].organization_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_info.org_name =
				health_plan_data->health_plan[hp].org_name
 
			;Org Plan
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_plan.health_plan_id =
				health_plan_data->health_plan[hp].health_plan_id
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_plan.org_plan_reltn_cd =
				input->insurances[d.seq].org_plan_reltn_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_plan.group_nbr =
				input->insurances[d.seq].group_number
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].org_plan.group_name =
				input->insurances[d.seq].group_name
 
			;Address
			ha = locateval(idx,1,size(health_plan_data->health_plan[hp].address,5),c_business_address_type_cd,
				health_plan_data->health_plan[hp].address[idx].address_type_cd)
 
			if(input->insurances[d.seq].address.address1 > " "
			or input->insurances[d.seq].address.address2 > " "
			or input->insurances[d.seq].address.address3 > " "
			or input->insurances[d.seq].address.city > " "
			or input->insurances[d.seq].address.state > " "
			or input->insurances[d.seq].address.zip > " ")
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.address_type_cd =
					input->insurances[d.seq].address.address_type_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr =
					input->insurances[d.seq].address.address1
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr2 =
					input->insurances[d.seq].address.address2
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr3 =
					input->insurances[d.seq].address.address3
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.city =
					input->insurances[d.seq].address.city
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.state =
					input->insurances[d.seq].address.state
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.state_cd =
					input->insurances[d.seq].address.state_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.zipcode =
					input->insurances[d.seq].address.zip
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.county =
					input->insurances[d.seq].address.county
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.county_cd =
					input->insurances[d.seq].address.county_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.country =
					input->insurances[d.seq].address.country
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.country_cd =
					input->insurances[d.seq].address.country_cd
			else
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.address_type_cd =
					health_plan_data->health_plan[hp].address[ha].address_type_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr =
					health_plan_data->health_plan[hp].address[ha].street_addr
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr2 =
					health_plan_data->health_plan[hp].address[ha].street_addr2
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.street_addr3 =
					health_plan_data->health_plan[hp].address[ha].street_addr3
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.city =
					health_plan_data->health_plan[hp].address[ha].city
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.state =
					health_plan_data->health_plan[hp].address[ha].state
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.state_cd =
					health_plan_data->health_plan[hp].address[ha].state_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.zipcode =
					health_plan_data->health_plan[hp].address[ha].zipcode
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.county =
					health_plan_data->health_plan[hp].address[ha].county
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.county_cd =
					health_plan_data->health_plan[hp].address[ha].county_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.country =
					health_plan_data->health_plan[hp].address[ha].country
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.country_cd =
					health_plan_data->health_plan[hp].address[ha].country_cd
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.beg_effective_dt_tm =
					health_plan_data->health_plan[hp].address[ha].beg_effective_dt_tm
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].address.end_effective_dt_tm =
					health_plan_data->health_plan[hp].address[ha].end_effective_dt_tm
			endif
 
			;Phone
			phSize =  size(input->insurances[d.seq].phones,5)
			if(phSize > 0)
				for(ph = 1 to phSize)
					if(ph = 1)
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_type_cd =
							input->insurances[d.seq].phones[ph].phone_type_cd
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_num =
							input->insurances[d.seq].phones[ph].number
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.extension =
							input->insurances[d.seq].phones[ph].extension
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_format_cd =
							input->insurances[d.seq].phones[ph].format_id
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.contact =
							input->insurances[d.seq].phones[ph].contact
					else
						x = ph - 1
						stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone,x)
 
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
							input->insurances[d.seq].phones[ph].phone_type_cd
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
							input->insurances[d.seq].phones[ph].number
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].extension =
							input->insurances[d.seq].phones[ph].extension
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
							input->insurances[d.seq].phones[ph].format_id
						pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].contact =
							input->insurances[d.seq].phones[ph].contact
					endif
				endfor
			else
				hphSize =  size(health_plan_data->health_plan[hp].phone,5)
				if(hphSize > 0)
					for(ph = 1 to hphSize)
						if(ph = 1)
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_type_cd =
								health_plan_data->health_plan[hp].phone[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_num =
								health_plan_data->health_plan[hp].phone[ph].phone_num
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.extension =
								health_plan_data->health_plan[hp].phone[ph].extension
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].phone.phone_format_cd =
								health_plan_data->health_plan[hp].phone[ph].phone_format_cd
						else
							x = ph - 1
							stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone,x)
 
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_type_cd =
								health_plan_data->health_plan[hp].phone[ph].phone_type_cd
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_num =
								health_plan_data->health_plan[hp].phone[ph].phone_num
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].extension =
								health_plan_data->health_plan[hp].phone[ph].extension
							pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].addtnl_phone[x].phone_format_cd =
								health_plan_data->health_plan[hp].phone[ph].phone_format_cd
						endif
					endfor
				endif
			endif
 
			;Encntr_Plan_Reltn
			stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn,1)
 
 			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].priority_seq =
				input->insurances[d.seq].priority
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].subs_member_nbr =
				input->insurances[d.seq].subs_member_nbr
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].ins_card_copied_cd =
				input->insurances[d.seq].ins_card_copied_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].assign_benefits_cd =
				input->insurances[d.seq].assign_benefits_cd
			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].beg_effective_dt_tm =
				input->insurances[d.seq].beg_effective_dt_tm
 			pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].encntr_plan_reltn[1].end_effective_dt_tm =
				input->insurances[d.seq].end_effective_dt_tm
 
			;Fin
			if(input->insurances[d.seq].copay_inc_max_oop > 0)
				finSize = size(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].fin,5)
				if(finSize = 0)
					finSize = finSize + 1
					stat = alterlist(pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].fin,1)
				endif
				pm_obj_req->person.person_person_reltn[pprSz].person.person_plan_reltn[p].fin[1].room_coverage_board_incl_cd	=
						input->insurances[d.seq].copay_inc_max_oop
			endif
		with nocounter ;End Insurance/Subscriber
	endif
 
 	;Update Related Persons Person object
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
		,(dummyt d with seq = size(input->insurances,5))
	plan d
	join epr where epr.encntr_id = input->encntr_id
		and epr.priority_seq = input->insurances[d.seq].priority
		and epr.health_plan_id = input->insurances[d.seq].health_plan_id
		and epr.active_ind = 1
	head report
		x = 0
	detail
		iValidate = 1
		x = x + 1
		stat = alterlist(insurance_reply_out->insurances,x)
		insurance_reply_out->insurances[x].id = epr.encntr_plan_reltn_id
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
 
