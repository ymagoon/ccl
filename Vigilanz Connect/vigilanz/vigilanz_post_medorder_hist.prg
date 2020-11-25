/*~BB~**********************************************************************************

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
      Source file name:  	snsro_post_medorder_hist.prg
      Object name:       	vigilanz_post_medorder_hist
      Program purpose:    	POST a medication history order in Millennium
      Tables read:        	NONE
      Tables updated:   	ORDERS
	  Services:				Request 600316 - pts_get_prsnl_demo
							Request 115421 - PM_GET_ENCNTR_BY_ENTITY_ID
							Request 100190 - PM_GET_ENCNTR_LOC_TZ
							Request 680500 - MSVC_GetPrivilegesByCodes
							Request 500693 - orm_get_ocs
							Request 500080 - Get Order Catalog Info
							Request 560000 - ORM.FmtQuery
							Request 500698 - orm_get_next_sequence
							Request 680600 - BuildSimplifiedDisplayLine
							Request 560201 - ORM.OrderWriteSynch
							Request 500511 - orm_add_order_compliance
      Executing from:   	MPages Discern Web Service
      Special Notes:      	NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 12/04/17 RJC					Initial Write
  002 02/01/18 RJC					Fixed validation when invalid medicaiton id entered
  003 03/22/18 RJC					Added version code and copyright block
  004 03/26/18 RJC					Updated reqinfo->updt_id with user_id in parameters
  005 05/09/18 RJC					Moved GetDateTime function to snsro_common
 ***********************************************************************/
/************************************************************************/
drop program vigilanz_post_medorder_hist go
create program vigilanz_post_medorder_hist
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        				;Required
		, "MedicationId:" = ""					;Required
		, "Patientid:" = ""						;Required
		, "EncounterId:" = ""					;Required
		, "AdminInstructions:" = ""				;Required
		, "ProviderId:" = ""					;Optional
		, "StartDateTime:" = ""					;Optional
		, "StopDateTime:" = ""					;Optional
		, "MedicationComments:" = ""			;Optional
		, "DebugFlag:" = 0						;Optional
 
with OUTDEV, USERNAME, MED_ID, PATIENT_ID, ENCNTR_ID, SIG_LINE, PROVIDER_ID, START_DT, STOP_DT, COMMENTS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;Request 600316 - pts_get_prsnl_demo
free record 600316_req
record 600316_req (
  1 person_id = f8
  1 username = c50
  1 providers [*]
    2 person_id = f8
  1 load_credentials_ind = i2
)
 
free record 600316_rep
record 600316_rep (
   1 person_id = f8
   1 name_full_formatted = vc
   1 name_last = vc
   1 name_first = vc
   1 username = vc
   1 position_cd = f8
   1 position_disp = vc
   1 physician_ind = i2
   1 department_cd = f8
   1 department_disp = vc
   1 section_cd = f8
   1 section_disp = vc
   1 email = vc
   1 active_ind = i2
   1 lookup_status = i4
   1 providers [* ]
     2 person_id = f8
     2 name_full_formatted = vc
     2 name_last = vc
     2 name_first = vc
     2 name_middle = vc
     2 username = vc
     2 email = vc
     2 physician_ind = i2
     2 position_cd = f8
     2 position_disp = vc
     2 position_mean = vc
     2 department_cd = f8
     2 department_disp = vc
     2 department_mean = vc
     2 physician_status_cd = f8
     2 physician_status_disp = vc
     2 physician_status_mean = vc
     2 section_cd = f8
     2 section_disp = vc
     2 section_mean = vc
     2 active_ind = i2
     2 name_hist [* ]
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 name_full_formatted = vc
       3 name_last = vc
       3 name_first = vc
       3 name_middle = vc
       3 normal_record = i2
       3 name_suffix = vc
     2 credentials [* ]
       3 credential_mean = vc
       3 credential_display = vc
       3 credential_cd = f8
       3 cred_type_mean = vc
       3 cred_type_display = vc
       3 cred_type_cd = f8
       3 cred_beg_effective_dt_tm = dq8
       3 cred_end_effective_dt_tm = dq8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;Request 115421 - PM_GET_ENCNTR_BY_ENTITY_ID
free record 115421_req
record 115421_req (
  1 call_echo_ind = i2
  1 load
    2 encntr_ind = i2
    2 encntr_alias_ind = i2
    2 encntr_info_ind = i2
    2 encntr_org_reltn_ind = i2
    2 encntr_person_reltn_ind = i2
    2 encntr_plan_reltn_ind = i2
    2 encntr_prsnl_reltn_ind = i2
    2 episode_encntr_reltn_ind = i2
    2 encntr_diagnoses_ind = i2
    2 encntr_wait_list_ind = i2
  1 eor_type_cd_qual [*]
    2 encntr_org_r_type_cd = f8
  1 e_person_r_type_cd_qual [*]
    2 person_r_type_cd = f8
  1 e_prsnl_r_qual [*]
    2 encntr_prsnl_r_cd = f8
  1 entity_qual [*]
    2 entity_id = f8
    2 entity_name = vc
  1 skip_clncl_encntr_type_cd_ind = i2
  1 exclude_expired_eprs = i2
  1 include_ineffective_e_per_r_ind = i2
  1 user_authorization
    2 all_encntr_person_reltns_ind = i2
    2 encntr_person_reltn_type_cds [*]
      3 person_r_type_cd = f8
)
 
free record 115421_rep
record 115421_rep (
  1 entity_qual_cnt = i4
  1 entity_qual [*]
    2 entity_id = f8
    2 entity_name = vc
    2 status = i2
    2 encntr
      3 accommodation_cd = f8
      3 accommodation_request_cd = f8
      3 admit_mode_cd = f8
      3 admit_src_cd = f8
      3 admit_type_cd = f8
      3 admit_with_medication_cd = f8
      3 alt_lvl_care_cd = f8
      3 alt_result_dest_cd = f8
      3 ambulatory_cond_cd = f8
      3 arrive_dt_tm = dq8
      3 beg_effective_dt_tm = dq8
      3 confid_level_cd = f8
      3 contributor_system_cd = f8
      3 courtesy_cd = f8
      3 data_status_cd = f8
      3 depart_dt_tm = dq8
      3 diet_type_cd = f8
      3 disch_dispostion_cd = f8
      3 disch_dt_tm = dq8
      3 disch_to_loctn_cd = f8
      3 encntr_class_cd = f8
      3 encntr_id = f8
      3 encntr_status_cd = f8
      3 encntr_type_cd = f8
      3 encntr_type_class_cd = f8
      3 end_effective_dt_tm = dq8
      3 est_arrive_dt_tm = dq8
      3 est_depart_dt_tm = dq8
      3 financial_class_cd = f8
      3 encntr_financial_id = f8
      3 guarantor_type_cd = f8
      3 isolation_cd = f8
      3 location_cd = f8
      3 loc_bed_cd = f8
      3 loc_building_cd = f8
      3 loc_facility_cd = f8
      3 loc_nurse_unit_cd = f8
      3 loc_room_cd = f8
      3 loc_temp_cd = f8
      3 med_service_cd = f8
      3 organization_id = f8
      3 person_id = f8
      3 preadmit_nbr = vc
      3 preadmit_testing_cd = f8
      3 pre_reg_dt_tm = dq8
      3 pre_reg_prsnl_id = f8
      3 readmit_cd = f8
      3 reason_for_visit = vc
      3 referring_comment = vc
      3 reg_dt_tm = dq8
      3 reg_prsnl_id = f8
      3 result_dest_cd = f8
      3 vip_cd = f8
      3 clinical_encntr_type_cd = f8
      3 updt_cnt = i4
      3 service_category_cd = f8
      3 program_service_cd = f8
      3 specialty_unit_cd = f8
      3 est_length_of_stay = i4
      3 updt_dt_tm = dq8
      3 accomp_by_cd = f8
      3 create_dt_tm = dq8
      3 create_prsnl_id = f8
      3 info_given_by = vc
      3 inpatient_admit_dt_tm = dq8
      3 accommodation_reason_cd = f8
      3 assign_to_loc_dt_tm = dq8
      3 alc_reason_cd = f8
      3 alt_lvl_care_dt_tm = dq8
      3 alc_decomp_dt_tm = dq8
      3 placement_auth_prsnl_id = f8
      3 contract_status_cd = f8
      3 patient_classification_cd = f8
      3 refer_facility_cd = f8
      3 region_cd = f8
      3 safekeeping_cd = f8
      3 security_access_cd = f8
      3 sitter_required_cd = f8
      3 visitor_status_cd = f8
      3 doc_rcvd_dt_tm = dq8
      3 referral_rcvd_dt_tm = dq8
      3 trauma_cd = f8
      3 trauma_dt_tm = dq8
      3 triage_cd = f8
      3 triage_dt_tm = dq8
      3 preadmit_testing_cnt = i4
      3 preadmit_testing [*]
        4 preadmit_testing_cd = f8
      3 valuables_cnt = i4
      3 valuables [*]
        4 valuables_cd = f8
      3 wait_list
        4 referral_source_cd = f8
    2 alias_qual_cnt = i4
    2 alias_qual [*]
      3 alias_id = f8
      3 alias = vc
      3 alias_formatted = vc
      3 alias_pool_cd = f8
      3 alias_type_cd = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 person_alias_status_cd = f8
      3 updt_cnt = i4
      3 health_card_expiry_dt_tm = dq8
      3 health_card_issue_dt_tm = dq8
      3 health_card_province = c3
      3 health_card_type = c32
      3 health_card_ver_code = c3
      3 updt_dt_tm = dq8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
    2 encntr_info_qual_cnt = i4
    2 encntr_info_qual [*]
      3 beg_effective_dt_tm = dq8
      3 chartable_ind = i2
      3 encntr_id = f8
      3 encntr_info_id = f8
      3 end_effective_dt_tm = dq8
      3 info_type_cd = f8
      3 info_sub_type_cd = f8
      3 long_text = vc
      3 long_text_id = f8
      3 priority_seq = i4
      3 value_numeric = i4
      3 value_dt_tm = dq8
      3 value_cd = f8
      3 updt_cnt = i4
      3 updt_dt_tm = dq8
    2 encntr_org_r_qual_cnt = i4
    2 encntr_org_r_qual [*]
      3 beg_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 encntr_id = f8
      3 encntr_org_reltn_cd = f8
      3 encntr_org_reltn_id = f8
      3 encntr_org_reltn_type_cd = f8
      3 end_effective_dt_tm = dq8
      3 organization_id = f8
      3 priority_seq = i4
      3 updt_cnt = i4
      3 updt_dt_tm = dq8
    2 encntr_person_r_qual_cnt = i4
    2 encntr_person_r_qual [*]
      3 beg_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 encntr_id = f8
      3 encntr_person_reltn_id = f8
      3 end_effective_dt_tm = dq8
      3 person_reltn_cd = f8
      3 person_reltn_type_cd = f8
      3 priority_seq = i4
      3 related_person_id = f8
      3 related_person_reltn_cd = f8
      3 updt_cnt = i4
      3 updt_dt_tm = dq8
    2 encntr_plan_r_qual_cnt = i4
    2 encntr_plan_r_qual [*]
      3 encntr_plan_reltn_id = f8
    2 encntr_prsnl_r_qual_cnt = i4
    2 encntr_prsnl_r_qual [*]
      3 beg_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 encntr_id = f8
      3 encntr_prsnl_r_cd = f8
      3 encntr_prsnl_reltn_id = f8
      3 end_effective_dt_tm = dq8
      3 expiration_ind = i2
      3 expiration_dt_tm = dq8
      3 priority_seq = i4
      3 prsnl_person_id = f8
      3 updt_cnt = i4
      3 active_status_cd = f8
      3 active_ind = i2
      3 updt_dt_tm = dq8
    2 episode_qual_cnt = i4
    2 episode_qual [*]
      3 episode_id = f8
      3 episode_type_cd = f8
      3 display = vc
    2 encntr_diagnoses_cnt = i4
    2 encntr_diagnoses [*]
      3 diagnosis_id = f8
      3 updt_cnt = i4
      3 updt_dt_tm = dq8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 contributor_system_cd = f8
      3 nomenclature_id = f8
      3 diag_dt_tm = dq8
      3 diag_type_cd = f8
      3 diagnostic_category_cd = f8
      3 diag_priority = i4
      3 diag_prsnl_id = f8
      3 diag_class_cd = f8
      3 confid_level_cd = f8
      3 attestation_dt_tm = dq8
      3 reference_nbr = vc
      3 diag_ftdesc = vc
      3 ranking_cd = f8
      3 confirmation_status_cd = f8
      3 clinical_service_cd = f8
      3 diagnosis_display = vc
  1 debug_cnt = i4
  1 debug [*]
    2 line = vc
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;Request 100190 - PM_GET_ENCNTR_LOC_TZ
free record 100190_req
record 100190_req (
  1 encntrs [*]
    2 encntr_id = f8
    2 transaction_dt_tm = dq8
  1 facilities [*]
    2 loc_facility_cd = f8
)
 
free record 100190_rep
record 100190_rep (
	1 encntrs_qual_cnt = i4
    1 encntrs [* ]
      2 encntr_id = f8
      2 time_zone_indx = i4
      2 time_zone = vc
      2 transaction_dt_tm = dq8
      2 check = i2
      2 status = i2
      2 loc_fac_cd = f8
    1 facilities_qual_cnt = i4
    1 facilities [* ]
      2 loc_facility_cd = f8
      2 time_zone_indx = i4
      2 time_zone = vc
      2 status = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;Request 680500 - MSVC_GetPrivilegesByCodes
free record 680500_req
record 680500_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 privilege_criteria
    2 privileges [*]
      3 privilege_cd = f8
    2 locations [*]
      3 location_id = f8
)
 
free record 680500_rep
record 680500_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 privileges [*]
    2 privilege_cd = f8
    2 default [*]
      3 granted_ind = i2
      3 exceptions [*]
        4 entity_name = vc
        4 type_cd = f8
        4 id = f8
      3 status
        4 success_ind = i2
    2 locations [*]
      3 location_id = f8
      3 privilege
        4 granted_ind = i2
        4 exceptions [*]
          5 entity_name = vc
          5 type_cd = f8
          5 id = f8
        4 status
          5 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
;Request 500693 - orm_get_ocs
free record 500693_req
record 500693_req (
	1 qual [*]
		2 synonym_id = f8
)
 
free record 500693_rep
record 500693_rep (
	1 qual [* ]
		 2 active_ind = i2
		 2 active_status_cd = f8
		 2 active_status_dt_tm = dq8
		 2 active_status_prsnl_id = f8
		 2 activity_subtype_cd = f8
		 2 activity_type_cd = f8
		 2 catalog_cd = f8
		 2 catalog_type_cd = f8
		 2 cki = vc
		 2 concentration_strength = f8
		 2 concentration_strength_unit_cd = f8
		 2 concentration_volume = f8
		 2 concentration_volume_unit_cd = f8
		 2 concept_cki = vc
		 2 dcp_clin_cat_cd = f8
		 2 filtered_od_ind = i2
		 2 hide_flag = i2
		 2 ingredient_rate_conversion_ind = i2
		 2 mnemonic = vc
		 2 mnemonic_type_cd = f8
		 2 multiple_ord_sent_ind = i2
		 2 oe_format_id = f8
		 2 orderable_type_flag = i2
		 2 order_sentence_id = f8
		 2 rx_mask = i4
		 2 synonym_id = f8
		 2 updt_applctx = f8
		 2 updt_cnt = i4
		 2 updt_dt_tm = dq8
		 2 updt_id = f8
		 2 updt_task = i4
		 2 witness_flag = i2
		 2 high_alert_ind = i2
		 2 high_alert_required_ntfy_ind = i2
		 2 high_alert_long_text_id = f8
		 2 high_alert_text = vc
		 2 intermittent_ind = i2
		 2 display_additives_first_ind = i2
		 2 rounding_rule_cd = f8
		 2 lock_target_dose_ind = i2
		 2 max_final_dose = f8
		 2 max_final_dose_unit_cd = f8
		 2 max_dose_calc_bsa_value = f8
		 2 preferred_dose_flag = i2
	   1 status_data
		 2 status = c1
		 2 subeventstatus [1 ]
		   3 operationname = c25
		   3 operationstatus = c1
		   3 targetobjectname = c25
		   3 targetobjectvalue = vc
)
 
;Request 500080 - Get Order Catalog Info
free record 500080_req
record 500080_req (
	  1 request_type = i2
	  1 prep_text_type_cd = f8
	  1 qual [*]
		2 catalog_cd = f8
)
 
free record 500080_rep
record 500080_rep (
	1 qual [* ]
     2 catalog_cd = f8
     2 activity_type_cd = f8
     2 resource_route_cd = f8
     2 resource_route_lvl = i2
     2 consent_form_ind = i2
     2 active_ind = i2
     2 prompt_ind = i2
     2 catalog_type_cd = f8
     2 requisition_format_cd = f8
     2 requisition_routing_cd = f8
     2 inst_restriction_ind = i2
     2 schedule_ind = i2
     2 description = vc
     2 print_req_ind = i2
     2 oe_format_id = f8
     2 orderable_type_flag = i2
     2 quick_chart_ind = i2
     2 complete_upon_order_ind = i2
     2 comment_template_flag = i2
     2 prep_info_flag = i2
     2 event_cd = f8
     2 activity_subtype_cd = f8
     2 dup_checking_ind = i2
     2 bill_only_ind = i2
     2 cont_order_method_flag = i2
     2 dept_dup_check_ind = i2
     2 primary_mnemonic = vc
     2 order_review_ind = i2
     2 consent_form_format_cd = f8
     2 consent_form_routing_cd = f8
     2 updt_cnt = i4
     2 prep_level_flag = i2
     2 dept_display_name = vc
     2 abn_review_ind = i2
     2 review_hierarchy_id = f8
     2 ref_text_mask = i4
     2 ord_com_template_long_text_id = f8
     2 dcp_clin_cat_cd = f8
     2 cki = vc
     2 stop_type_cd = f8
     2 stop_duration = i4
     2 stop_duration_unit_cd = f8
     2 form_id = f8
     2 form_level = i4
     2 disable_order_comment_ind = i2
     2 modifiable_flag = i2
     2 dc_interaction_days = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;Request 560000 - ORM.FmtQuery
free record 560000_req
record 560000_req (
  1 oeFormatId = f8
  1 actionTypeCd = f8
  1 positionCd = f8
  1 ordLocationCd = f8
  1 patLocationCd = f8
  1 applicationCd = f8
  1 encntrTypeCd = f8
  1 includePromptInd = i2
  1 catalogCd = f8
  1 origOrdAsFlag = i2
)
 
free record 560000_rep
record 560000_rep (
  1 status = i4
  1 oeFormatName = c200
  1 fieldList [*]
    2 oeFieldId = f8
    2 acceptFlag = i2
    2 defaultValue = c100
    2 inputMask = c50
    2 requireCosignInd = i2
    2 prologMethod = i4
    2 epilogMethod = i4
    2 statusLine = c200
    2 labelText = c200
    2 groupSeq = i4
    2 fieldSeq = i4
    2 valueRequiredInd = i2
    2 maxNbrOccur = i4
    2 description = c100
    2 codeset = i4
    2 oeFieldMeaningId = f8
    2 oeFieldMeaning = c25
    2 request = i4
    2 minVal = f8
    2 maxVal = f8
    2 fieldTypeFlag = i2
    2 acceptSize = i4
    2 validationTypeFlag = i2
    2 helpContextId = f8
    2 allowMultipleInd = i2
    2 spinIncrementCnt = i4
    2 clinLineInd = i2
    2 clinLineLabel = c25
    2 clinSuffixInd = i2
    2 deptLineInd = i2
    2 deptLineLabel = c25
    2 deptSuffixInd = i2
    2 dispYesNoFlag = i2
    2 defPrevOrderInd = i2
    2 dispDeptYesNoFlag = i2
    2 promptEntityName = c32
    2 promptEntityId = f8
    2 commonFlag = i2
    2 eventCd = f8
    2 filterParams = c255
    2 depList [*]
      3 dependencyFieldId = f8
      3 depSeqList [*]
        4 dependencySeq = i4
        4 dependencyMethod = i4
        4 dependencyAction = i4
        4 depDomSeqList [*]
          5 depDomainSeq = i4
          5 dependencyValue = c200
          5 dependencyOperator = i4
    2 cki = c30
    2 coreInd = i2
    2 defaultParentEntityId = f8
    2 lockOnModifyFlag = i2
    2 carryForwardPlanInd = i2
  1 status_data
    2 status = vc
    2 subEventStatus [*]
      3 OperationName = vc
      3 OperationStatus = vc
      3 TargetObjectName = vc
      3 TargetObjectValue = vc
)
 
;Request 500698 - orm_get_next_sequence
free record 500698_req
record 500698_req (
	1 seq_name = vc
	1 number = i2
)
 
free record 500698_rep
record 500698_rep (
	1 qual [* ]
		2 seq_value = f8
	1 status_data
		2 status = c1
		2 subeventstatus [1 ]
			3 operationname = c25
			3 operationstatus = c1
			3 targetobjectname = c25
			3 targetobjectvalue = vc
)
 
;Request 680600 - BuildSimplifiedDisplayLine
free record 680600_req
record 680600_req (
	1 display_line_criteria [*]
		2 display_line_id = vc
		2 custom_dose_display_criteria
		  3 dose_delimiter = vc
		  3 dose_display_suppression_ind = i2
		2 medication_display_criteria
		  3 simple_medication_criteria
			4 simple_medication_type_ind = i2
			4 order_display_criteria
			  5 variable_dose_admin_order_ind = i2
		  3 iv_medication_criteria
			4 iv_medication_type_ind = i2
		  3 intermittent_med_criteria
			4 intermittent_med_type_ind = i2
		  3 originally_ordered_as_type
			4 normal_ind = i2
			4 prescription_ind = i2
			4 documented_ind = i2
			4 patients_own_ind = i2
			4 charge_only_ind = i2
			4 satellite_ind = i2
		  3 product_level_synonym_ind = i2
		2 detail_list [*]
		  3 meaning_id = i4
		  3 boolean_detail_values [*]
			4 boolean_ind = i2
			4 display = vc
			4 cleared_ind = i2
		  3 date_detail_values [*]
			4 estimated_ind = i2
			4 display = vc
			4 cleared_ind = i2
		  3 text_detail_values [*]
			4 display = vc
			4 cleared_ind = i2
)
 
free record 680600_rep
record 680600_rep (
	1 successes [*]
		2 display_line_id = vc
		2 display_line = vc
		2 evaluated_meanings [*]
		  3 meaning_id = i4
	  1 failures [*]
		2 display_line_id = vc
		2 debug_error_message = vc
	  1 status_data
		2 status = c1
		2 subeventstatus [*]
		  3 OperationName = c25
		  3 OperationStatus = c1
		  3 TargetObjectName = c25
		  3 TargetObjectValue = vc
)
;Request 560201 - ORM.OrderWriteSynch
free record 560201_req
record 560201_req (
	  1 productId = f8
	  1 personId = f8
	  1 encntrId = f8
	  1 passingEncntrInfoInd = i2
	  1 encntrFinancialId = f8
	  1 locationCd = f8
	  1 locFacilityCd = f8
	  1 locNurseUnitCd = f8
	  1 locRoomCd = f8
	  1 locBedCd = f8
	  1 actionPersonnelId = f8
	  1 contributorSystemCd = f8
	  1 orderLocnCd = f8
	  1 replyInfoFlag = i2
	  1 commitGroupInd = i2
	  1 needsATLDupCheckInd = i2
	  1 orderSheetInd = i2
	  1 orderSheetPrinterName = vc
	  1 logLevelOverride = i2
	  1 unlockProfileInd = i2
	  1 lockKeyId = i4
	  1 orderList [*]
		2 orderId = f8
		2 actionTypeCd = f8
		2 communicationTypeCd = f8
		2 orderProviderId = f8
		2 orderDtTm = dq8
		2 currentStartDtTm = dq8
		2 oeFormatId = f8
		2 catalogTypeCd = f8
		2 accessionNbr = vc
		2 accessionId = f8
		2 noChargeInd = i2
		2 billOnlyInd = i2
		2 lastUpdtCnt = i4
		2 detailList [*]
		  3 oeFieldId = f8
		  3 oeFieldValue = f8
		  3 oeFieldDisplayValue = vc
		  3 oeFieldDtTmValue = dq8
		  3 oeFieldMeaning = vc
		  3 oeFieldMeaningId = f8
		  3 valueRequiredInd = i2
		  3 groupSeq = i4
		  3 fieldSeq = i4
		  3 modifiedInd = i2
		  3 detailHistoryList [*]
			4 oeFieldValue = f8
			4 oeFieldDisplayValue = vc
			4 oeFieldDtTmValue = dq8
			4 detailAlterFlag = i2
			4 detailAlterTriggerCd = f8
		2 miscList [*]
		  3 fieldMeaning = vc
		  3 fieldMeaningId = f8
		  3 fieldValue = f8
		  3 fieldDisplayValue = vc
		  3 fieldDtTmValue = dq8
		  3 modifiedInd = i2
		  3 groups [*]
			4 groupIdentifier = i2
		2 promptTestList [*]
		  3 fieldValue = f8
		  3 fieldDisplayValue = vc
		  3 fieldDtTmValue = dq8
		  3 promptEntityName = vc
		  3 promptEntityId = f8
		  3 modifiedInd = i2
		  3 fieldTypeFlag = i2
		  3 oeFieldId = f8
		2 commentList [*]
		  3 commentType = f8
		  3 commentText = vc
		2 reviewList [*]
		  3 reviewTypeFlag = i2
		  3 providerId = f8
		  3 locationCd = f8
		  3 rejectedInd = i2
		  3 reviewPersonnelId = f8
		  3 proxyPersonnelId = f8
		  3 proxyReasonCd = f8
		  3 catalogTypeCd = f8
		  3 actionSequence = i2
		  3 override [*]
			4 value
			  5 noReviewRequiredInd = i2
			  5 reviewRequiredInd = i2
			  5 systemDetermineInd = i2
			4 overrideReasonCd = f8
		2 deptMiscLine = vc
		2 catalogCd = f8
		2 synonymId = f8
		2 orderMnemonic = vc
		2 passingOrcInfoInd = i2
		2 primaryMnemonic = vc
		2 activityTypeCd = f8
		2 activitySubtypeCd = f8
		2 contOrderMethodFlag = i2
		2 completeUponOrderInd = i2
		2 orderReviewInd = i2
		2 printReqInd = i2
		2 requisitionFormatCd = f8
		2 requisitionRoutingCd = f8
		2 resourceRouteLevel = i4
		2 consentFormInd = i2
		2 consentFormFormatCd = f8
		2 consentFormRoutingCd = f8
		2 deptDupCheckInd = i2
		2 dupCheckingInd = i2
		2 deptDisplayName = vc
		2 refTextMask = i4
		2 abnReviewInd = i2
		2 reviewHierarchyId = f8
		2 orderableTypeFlag = i2
		2 dcpClinCatCd = f8
		2 cki = vc
		2 stopTypeCd = f8
		2 stopDuration = i4
		2 stopDurationUnitCd = f8
		2 needsIntervalCalcInd = i2
		2 templateOrderFlag = i2
		2 templateOrderId = f8
		2 groupOrderFlag = i2
		2 groupCompCount = i4
		2 linkOrderFlag = i2
		2 linkCompCount = i4
		2 linkTypeCd = f8
		2 linkElementFlag = i2
		2 linkElementCd = f8
		2 processingFlag = i2
		2 origOrdAsFlag = i2
		2 orderStatusCd = f8
		2 deptStatusCd = f8
		2 schStateCd = f8
		2 discontinueTypeCd = f8
		2 rxMask = i4
		2 schEventId = f8
		2 encntrId = f8
		2 passingEncntrInfoInd = i2
		2 encntrFinancialId = f8
		2 locationCd = f8
		2 locFacilityCd = f8
		2 locNurseUnitCd = f8
		2 locRoomCd = f8
		2 locBedCd = f8
		2 medOrderTypeCd = f8
		2 undoActionTypeCd = f8
		2 orderedAsMnemonic = vc
		2 getLatestDetailsInd = i2
		2 studentActionTypeCd = f8
		2 aliasList [*]
		  3 alias = vc
		  3 orderAliasTypeCd = f8
		  3 orderAliasSubtypeCd = f8
		  3 aliasPoolCd = f8
		  3 checkDigit = i4
		  3 checkDigitMethodCd = f8
		  3 begEffectiveDtTm = dq8
		  3 endEffectiveDtTm = dq8
		  3 dataStatusCd = f8
		  3 activeStatusCd = f8
		  3 activeInd = i2
		  3 billOrdNbrInd = i2
		  3 primaryDisplayInd = i2
		2 subComponentList [*]
		  3 scCatalogCd = f8
		  3 scSynonymId = f8
		  3 scOrderMnemonic = vc
		  3 scOeFormatId = f8
		  3 scStrengthDose = f8
		  3 scStrengthDoseDisp = vc
		  3 scStrengthUnit = f8
		  3 scStrengthUnitDisp = vc
		  3 scVolumeDose = f8
		  3 scVolumeDoseDisp = vc
		  3 scVolumeUnit = f8
		  3 scVolumeUnitDisp = vc
		  3 scFreetextDose = vc
		  3 scFrequency = f8
		  3 scFrequencyDisp = vc
		  3 scIVSeq = i4
		  3 scDoseQuantity = f8
		  3 scDoseQuantityDisp = vc
		  3 scDoseQuantityUnit = f8
		  3 scDoseQuantityUnitDisp = vc
		  3 scOrderedAsMnemonic = vc
		  3 scHnaOrderMnemonic = vc
		  3 scDetailList [*]
			4 oeFieldId = f8
			4 oeFieldValue = f8
			4 oeFieldDisplayValue = vc
			4 oeFieldDtTmValue = dq8
			4 oeFieldMeaning = vc
			4 oeFieldMeaningId = f8
			4 valueRequiredInd = i2
			4 groupSeq = i4
			4 fieldSeq = i4
			4 modifiedInd = i2
		  3 scProductList [*]
			4 item_id = f8
			4 dose_quantity = f8
			4 dose_quantity_unit_cd = f8
			4 tnf_id = f8
			4 tnf_description = vc
			4 tnf_cost = f8
			4 tnf_ndc = vc
			4 tnfLegalStatusCd = f8
			4 packageTypeId = f8
			4 medProductId = f8
			4 manfItemId = f8
			4 dispQty = f8
			4 dispQtyUnitCd = f8
			4 ignoreInd = i2
			4 compoundFlag = i2
			4 cmpdBaseInd = i2
			4 premanfInd = i2
			4 productSeq = i2
			4 parentProductSeq = i2
			4 labelDesc = vc
			4 brandDesc = vc
			4 genericDesc = vc
			4 drugIdentifier = vc
			4 pkg_qty_per_pkg = f8
			4 pkg_disp_more_ind = i2
			4 unrounded_dose_quantity = f8
			4 overfillStrengthDose = f8
			4 overfillStrengthUnitCd = f8
			4 overfillStrengthUnitDisp = vc
			4 overfillVolumeDose = f8
			4 overfillVolumeUnitCd = f8
			4 overfillVolumeUnitDisp = vc
			4 doseList [*]
			  5 scheduleSequence = i2
			  5 doseQuantity = f8
			  5 doseQuantityUnitCd = f8
			  5 unroundedDoseQuantity = f8
		  3 scIngredientTypeFlag = i2
		  3 scPrevIngredientSeq = i4
		  3 scModifiedFlag = i2
		  3 scIncludeInTotalVolumeFlag = i2
		  3 scClinicallySignificantFlag = i2
		  3 scAutoAssignFlag = i2
		  3 scOrderedDose = f8
		  3 scOrderedDoseDisp = vc
		  3 scOrderedDoseUnitCd = f8
		  3 scOrderedDoseUnitDisp = vc
		  3 scDoseCalculatorLongText = c32000
		  3 scIngredientSourceFlag = i2
		  3 scNormalizedRate = f8
		  3 scNormalizedRateDisp = vc
		  3 scNormalizedRateUnitCd = f8
		  3 scNormalizedRateUnitDisp = vc
		  3 scConcentration = f8
		  3 scConcentrationDisp = vc
		  3 scConcentrationUnitCd = f8
		  3 scConcentrationUnitDisp = vc
		  3 scTherapeuticSbsttnList [*]
			4 therapSbsttnId = f8
			4 acceptFlag = i2
			4 overrideReasonCd = f8
			4 itemId = f8
		  3 scHistoryList [*]
			4 scAlterTriggerCd = f8
			4 scSynonymId = f8
			4 scStrengthDose = f8
			4 scStrengthUnit = f8
			4 scVolumeDose = f8
			4 scVolumeUnit = f8
			4 scFreetextDose = vc
			4 scModifiedFlag = i2
		  3 scDosingInfo [*]
			4 dosingCapacity = i2
			4 daysOfAdministrationDisplay = vc
			4 doseList [*]
			  5 scheduleInfo
				6 doseSequence = i2
				6 scheduleSequence = i2
			  5 strengthDose [*]
				6 value = f8
				6 valueDisplay = vc
				6 unitOfMeasureCd = f8
			  5 volumeDose [*]
				6 value = f8
				6 valueDisplay = vc
				6 unitOfMeasureCd = f8
			  5 orderedDose [*]
				6 value = f8
				6 valueDisplay = vc
				6 unitOfMeasureCd = f8
				6 doseType
				  7 strengthInd = i2
				  7 volumeInd = i2
		  3 scDoseAdjustmentInfo [*]
			4 doseAdjustmentDisplay = vc
			4 carryForwardOverrideInd = i2
		  3 scOrderedAsSynonymId = f8
		2 resourceList [*]
		  3 serviceResourceCd = f8
		  3 csLoginLocCd = f8
		  3 serviceAreaCd = f8
		  3 assayList [*]
			4 taskAssayCd = f8
		2 relationshipList [*]
		  3 relationshipMeaning = vc
		  3 valueList [*]
			4 entityId = f8
			4 entityDisplay = vc
			4 rankSequence = i4
		  3 inactivateAllInd = i2
		2 miscLongTextList [*]
		  3 textId = f8
		  3 textTypeCd = f8
		  3 text = vc
		  3 textModifier1 = i4
		  3 textModified2 = i4
		2 deptCommentList [*]
		  3 commentTypeCd = f8
		  3 commentSeq = i4
		  3 commentId = f8
		  3 longTextId = f8
		  3 deptCommentMisc = i4
		  3 deptCommentText = vc
		2 adHocFreqTimeList [*]
		  3 adHocTime = i4
		2 ingredientReviewInd = i2
		2 taskStatusReasonMean = f8
		2 badOrderInd = i2
		2 origOrderDtTm = dq8
		2 validDoseDtTm = dq8
		2 userOverrideTZ = i4
		2 linkNbr = f8
		2 linkTypeFlag = i2
		2 supervisingProviderId = f8
		2 digitalSignatureIdent = c64
		2 bypassPrescriptionReqPrinting = i2
		2 pathwayCatalogId = f8
		2 patientOverrideTZ = i4
		2 actionQualifierCd = f8
		2 acceptProposalId = f8
		2 addOrderReltnList [*]
		  3 relatedFromOrderId = f8
		  3 relatedFromActionSeq = i4
		  3 relationTypeCd = f8
		2 scheduleExceptionList [*]
		  3 scheduleExceptionTypeCd = f8
		  3 origInstanceDtTm = dq8
		  3 newInstanceDtTm = dq8
		  3 scheduleExceptionOrderId = f8
		2 inactiveScheduleExceptionList [*]
		  3 orderScheduleExceptionId = f8
		  3 scheduleExceptionOrderId = f8
		2 actionInitiatedDtTm = dq8
		2 ivSetSynonymId = f8
		2 futureInfo [*]
		  3 scheduleNewOrderAsEstimated [*]
			4 startDateTimeInd = i2
			4 stopDateTimeInd = i2
		  3 changeScheduleToPrecise [*]
			4 startDateTimeInd = i2
			4 stopDateTimeInd = i2
		  3 location [*]
			4 facilityCd = f8
			4 nurseUnitCd = f8
			4 sourceModifiers
			  5 scheduledAppointmentLocationInd = i2
		  3 applyStartRange [*]
			4 value = i4
			4 unit
			  5 daysInd = i2
			  5 weeksInd = i2
			  5 monthsInd = i2
			4 rangeAnchorPoint
			  5 startInd = i2
			  5 centerInd = i2
		  3 encounterTypeCd = f8
		2 addToPrescriptionGroup [*]
		  3 relatedOrderId = f8
		2 dayOfTreatmentInfo [*]
		  3 protocolOrderId = f8
		  3 dayOfTreatmentSequence = i4
		  3 protocolVersionCheck [*]
			4 protocolVersion = i4
		2 billingProviderInfo [*]
		  3 orderProviderInd = i2
		  3 supervisingProviderInd = i2
		2 tracingTicket = vc
		2 lastUpdateActionSequence = i4
		2 protocolInfo [*]
		  3 protocolType = i2
		2 incompleteToPharmacy [*]
		  3 newOrder [*]
			4 noSynonymMatchInd = i2
			4 missingOrderDetailsInd = i2
		  3 resolveOrder [*]
			4 resolvedInd = i2
		2 actionQualifiers [*]
		  3 autoVerificationInd = i2
		2 originatingEncounterId = f8
	  1 errorLogOverrideFlag = i2
	  1 actionPersonnelGroupId = f8
	  1 workflow [*]
		2 pharmacyInd = i2
	  1 trigger_app = i4
)
 
free record 560201_rep
record 560201_rep (
	  1 badOrderCnt = i2
	  1 groupRollbackInd = i2
	  1 groupBadOrderIndex = i2
	  1 orderList [*]
		2 orderId = f8
		2 orderStatusCd = f8
		2 accessionNbr = vc
		2 errorStr = vc
		2 errorNbr = i4
		2 deptStatusCd = f8
		2 prevDeptStatusCd = f8
		2 schStateCd = f8
		2 orderDetailDisplayLine = vc
		2 origOrderDtTm = dq8
		2 orderCommentInd = i2
		2 needNurseReviewInd = i2
		2 needDoctorCosignInd = i2
		2 actionSequence = i4
		2 reviewCnt = i4
		2 detailCnt = i4
		2 ingredCnt = i4
		2 ingredDetailCntList [*]
		  3 ingDetCnt = i4
		2 miscList [*]
		  3 fieldMeaning = vc
		  3 fieldMeaningId = f8
		  3 fieldValue = f8
		  3 fieldDisplayValue = vc
		  3 fieldDtTmValue = dq8
		  3 modifiedInd = i2
		2 clinicalDisplayLine = vc
		2 incompleteOrderInd = i2
		2 orderActionId = f8
		2 specificErrorNbr = i4
		2 specificErrorStr = vc
		2 actionStatus = i2
		2 needRxClinReviewFlag = i2
		2 needRxProdAssignFlag = i2
		2 simplifiedDisplayLine = vc
		2 errorReasonCd = f8
		2 externalServicesCalledInfo
		  3 poolRoutingCalledInd = i2
		  3 receiptCreationCalledInd = i2
		  3 powerPlanServiceCalledInd = i2
		  3 schedulingScriptCalledInd = i2
		2 lastActionSequence = i4
		2 needRxVerifyInd = i2
		2 projectedStopDtTm = dq8
		2 projectedStopTz = i4
		2 stopTypeCd = f8
	  1 status_data
		2 status = vc
		2 subEventStatus [*]
		  3 OperationName = vc
		  3 OperationStatus = vc
		  3 TargetObjectName = vc
		  3 TargetObjectValue = vc
		  3 RequestNumber = i4
		  3 OrderId = f8
		  3 ActionSeq = i4
		  3 SubStatus = vc
	  1 errorNbr = i4
	  1 errorStr = vc
	  1 specificErrorNbr = i4
	  1 specificErrorStr = vc
	  1 transactionStatus = i2
)
;Request 500511 - orm_add_order_compliance
free record 500511_req
record 500511_req (
	  1 encntr_id = f8
	  1 encntr_compliance_status_flag = i2
	  1 performed_dt_tm = dq8
	  1 performed_tz = i4
	  1 performed_prsnl_id = f8
	  1 no_known_home_meds_ind = i2
	  1 unable_to_obtain_ind = i2
	  1 order_list [*]
		2 order_nbr = f8
		2 compliance_status_cd = f8
		2 information_source_cd = f8
		2 last_occurred_dt_tm = dq8
		2 last_occurred_tz = i4
		2 order_compliance_comment = vc
		2 last_occurred_dt_only_ind = i2
)
 
free record 500511_rep
record 500511_rep (
	 1 status_data
		 2 status = c1
		 2 subeventstatus [1]
		   3 operationname = c25
		   3 operationstatus = c1
		   3 targetobjectname = c25
		   3 targetobjectvalue = vc
)
 
; Final reply structure
free record medorder_reply_out
record medorder_reply_out(
  1 order_id       			= f8
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
;Input params
declare sUserName			= vc with protect, noconstant("")
declare dPrsnlId			= f8 with protect, noconstant(0.0)
declare dMedicationId		= f8 with protect, noconstant(0.0)
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dEncounterId		= f8 with protect, noconstant(0.0)
declare sSigLine			= vc with protect, noconstant("")
declare dProviderId			= f8 with protect, noconstant(0.0)
declare sStartDateTime		= vc with protect, noconstant("")
declare sStopDateTime		= vc with protect, noconstant("")
declare qStartDateTime		= dq8 with protect, noconstant(0)
declare qStopDateTime		= dq8 with protect, noconstant(0)
declare sComments			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Constants
declare UTCmode					= i2 with protect, constant(CURUTC)
declare c_rx_wo_supervising_dr 	= f8 with protect, constant(uar_get_code_by("MEANING",6016,"RXPHYSPROXY"))
declare c_rx_wo_cosign			= f8 with protect, constant(uar_get_code_by("MEANING",6016,"MLSKIPCOSIGN"))
declare c_action_type_order		= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare c_oe_format_appl		= f8 with protect, constant(uar_get_code_by("MEANING",14124,"POWERCHART"))
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
 declare GetUserProviderInfo(null)					= i2 with protect	;Request 600316 - pts_get_prsnl_demo
 declare GetEncntrInfo(null)						= i2 with protect	;Request 115421 - PM_GET_ENCNTR_BY_ENTITY_ID
 declare GetEncntrTimezone(null)					= i2 with protect	;Request 100190 - PM_GET_ENCNTR_LOC_TZ
 declare GetPrivileges(null)						= i2 with protect	;Request 680500 - MSVC_GetPrivilegesByCodes
 declare GetOrderCatalogSynonymInfo(null) 			= i2 with protect	;Request 500693 - orm_get_ocs
 declare GetOrderCatalogInfo(null) 					= i2 with protect	;Request 500080 - Get Order Catalog Info
 declare GetOrmFormatInfo(null)						= i2 with protect 	;Request 560000 - ORM.FmtQuery
 declare GetOrderNextSeq(null)						= i2 with protect	;Request 500698 - orm_get_next_sequence
 declare BuildSimplifiedDisplayLine(null)			= i2 with protect	;Request 680600 - BuildSimplifiedDisplayLine
 declare PostMedicationOrder(null)					= i2 with protect	;Request 560201 - ORM.OrderWriteSynch
 declare AddOrderCompliance(null)					= i2 with protect	;Request 500511 - orm_add_order_compliance
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName							= trim($USERNAME, 3)
set dPrsnlId							= GetPrsnlIDfromUserName(sUserName)
set reqinfo->updt_id					= dPrsnlId  			;004
set dMedicationId						= cnvtreal($MED_ID)
set dPatientId							= cnvtreal($PATIENT_ID)
set dEncounterId						= cnvtreal($ENCNTR_ID)
set sSigLine							= trim($SIG_LINE,3)
set dProviderId							= cnvtreal($PROVIDER_ID)
set sStartDateTime						= trim($START_DT,3)
set sStopDateTime						= trim($STOP_DT,3)
set sComments							= trim($COMMENTS)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
set qStartDateTime						= GetDateTime(trim($START_DT,3))
 
if( sStopDateTime > " ")
	set qStopDateTime = GetDateTime(sStopDateTime)
 
	;Validate Time fields
	if(qStartDateTime > qStopDateTime)
		call ErrorHandler2("POST MEDORDER", "F", "Invalid Start Time", "Start time cannot be greater than stop time",
		"9999",build("Start time cannot be greater than stop time"), medorder_reply_out)
		go to exit_script
	endif
endif
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("dMedicationId -> ",dMedicationId))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("dEncounterId -> ",dEncounterId))
	call echo(build("sSigLine -> ",sSigLine))
	call echo(build("dProviderId -> ",dProviderId))
	call echo(build("qStartDateTime -> ",qStartDateTime))
	call echo(build("qStopDateTime -> ",qStopDateTime))
	call echo(build("sStartDateTime -> ",sStartDateTime))
	call echo(build("sStopDateTime -> ",sStopDateTime))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify Person Id exists
if(dPatientId = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Invalid URI Parameters", "Missing required field: Person ID.",
	"2055", "Missing required field: Person ID", medorder_reply_out)
	go to EXIT_SCRIPT
endif
 
;Verify Medication Id exists
if(dMedicationId = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Invalid URI Parameters", "Missing required field: Medication ID.",
	"2074", "Missing required field: Medication ID", medorder_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, medorder_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "User is invalid", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), medorder_reply_out)
  go to exit_script
endif
 
; Get user information - Request 600316 - pts_get_prsnl_demo
set iRet = GetUserProviderInfo(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "User Info", "Could not retrieve user information.",
  "9999",build("Could not retrieve information for userId: ",dPrsnlId), medorder_reply_out)
  go to exit_script
endif
 
; Get encounter information - Request 115421 - PM_GET_ENCNTR_BY_ENTITY_ID
set iRet = GetEncntrInfo(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "Encounter Info", "Could not retrieve encounter information.",
  "9999",build("Could not retrieve information for encounterId: ",dEncounterId), medorder_reply_out)
  go to exit_script
endif
 
; Get encounter timezone if UTC enabled - Request 100190 - PM_GET_ENCNTR_LOC_TZ
if(UTCmode)
	set iRet = GetEncntrTimezone(null)
	if(iRet = 0)
	  call ErrorHandler2("POST MEDORDER", "F", "Encounter TZ", "Could not retrieve encounter timezone.",
	  "9999",build("Could not retrieve encounter timezone."), medorder_reply_out)
	  go to exit_script
	endif
endif
 
; Verify user privileges - Request 680500 - MSVC_GetPrivilegesByCodes
set iRet = GetPrivileges(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "User Privileges", "User does not have privileges to create med orders.",
  "9999",build("User does not have privileges to create med orders."), medorder_reply_out)
  go to exit_script
endif
 
; Get Order Catalog Synonym Details - Request 500693 - orm_get_ocs
set iRet = GetOrderCatalogSynonymInfo(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "Validate MedicationId", "Invalid MedicationId.",
  "9999",build("Invalid MedicationId: ",dMedicationId), medorder_reply_out)
  go to exit_script
endif
 
; Get Order Catalog Details - Request 500080 - Get Order Catalog Info
set iRet =  GetOrderCatalogInfo(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "Retrieve Data", "Could not retrieve catalog data.",
  "9999",build("Could not retrieve order catalog data."), medorder_reply_out)
  go to exit_script
endif
 
; Get OE format data - Request 560000 - ORM.FmtQuery
set iRet = GetOrmFormatInfo(null)
if(iRet = 0)
  call ErrorHandler2("POST MEDORDER", "F", "Order Format Data", "Could not retrieve order format data.",
  "9999",build("Could not retrieve order format data."), medorder_reply_out)
  go to exit_script
endif
 
; Get the next order id number - Request 500698 - orm_get_next_sequence
set iRet =  GetOrderNextSeq(null)
if(iRet = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Get NextSeq", "Could not retrieve order id.",
	"9999",build("Could not retrieve order id."), medorder_reply_out)
	go to exit_script
endif
 
; Build the simplified display line - Request 680600 - BuildSimplifiedDisplayLine
set iRet =  BuildSimplifiedDisplayLine(null)
if(iRet = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Build Display Line", "Could not build simplified display line.",
	"9999",build("Could not build simplified display line."), medorder_reply_out)
	go to exit_script
endif
 
; Create the Med Order - Request 560201 - ORM.OrderWriteSynch
set iRet =  PostMedicationOrder(null)
if(iRet = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Post Medication", "Could not post medication order",
	"9999",build("Could not post medication order."), medorder_reply_out)
	go to exit_script
endif
 
; Add order to order_compliance table - Request 500511 - orm_add_order_compliance
set iRet =  AddOrderCompliance(null)
if(iRet = 0)
	call ErrorHandler2("POST MEDORDER", "F", "Order Compliance", "Could not add order to compliance table.",
	"9999",build("Could not add order to compliance table."), medorder_reply_out)
	go to exit_script
endif
 
; If all is successful, update audit
call ErrorHandler2("POST MEDORDER", "S", "Order Created", "Medication Order created successfully.",
"0000",build("Medication Order created successfully."), medorder_reply_out)
go to exit_script
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(medorder_reply_out)
 
if(idebugFlag > 0)
	call echorecord(medorder_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_medorder.json")
	call echo(build2("_file : ", _file))
	call echojson(medorder_reply_out, _file, 0)
endif
 
if(idebugFlag > 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name:  GetUserProviderInfo(null) = i2 with protect	;Request 600316 - pts_get_prsnl_demo
;  Description:  Gets information on user submitting the order
**************************************************************************/
subroutine GetUserProviderInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetUserProviderInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600105
	set iRequest = 600316
 
 	if(dProviderId > 0)
		set stat = alterlist(600316_req->providers,2)
		set 600316_req->providers[1].person_id = dPrsnlId
		set 600316_req->providers[2].person_id = dProviderId
	else
 		set stat = alterlist(600316_req->providers,1)
		set 600316_req->providers[1].person_id = dPrsnlId
	endif
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",600316_req,"REC",600316_rep)
 
	if(600316_rep->status_data.status != "F")
		if(dProviderId > 0)
			if(size(600316_rep->providers,5) > 1)
				set iValidate = 1
			endif
		else
			set iValidate = 1
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetUserProviderInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetEncntrInfo(null) = i2 with protect	;Request 115421 - PM_GET_ENCNTR_BY_ENTITY_ID
;  Description:  Gets encounter data
**************************************************************************/
subroutine GetEncntrInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncntrInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 115421
 
	set 115421_req->load.encntr_ind = 1
	set 115421_req->load.encntr_alias_ind = 1
	set 115421_req->load.encntr_prsnl_reltn_ind = 1
	set stat = alterlist(115421_req->entity_qual,1)
	set 115421_req->entity_qual[1].entity_id = dEncounterId
	set 115421_req->entity_qual[1].entity_name = "encounter_id"
	set 115421_req->skip_clncl_encntr_type_cd_ind = 1
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",115421_req,"REC",115421_rep)
 
	if(115421_rep->status_data.status != "F")
		set iValidate = 115421_rep->entity_qual_cnt
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetEncntrInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetEncntrTimezone(null) = i2 with protect	;Request 100190 - PM_GET_ENCNTR_LOC_TZ
;  Description: Gets the timezone for the encounter
**************************************************************************/
subroutine GetEncntrTimezone(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncntrTimezone Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600701
	set iRequest = 100190
 
	set stat = alterlist(100190_req->encntrs,1)
	set 100190_req->encntrs[1].encntr_id = dEncounterId
 
 	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100190_req,"REC",100190_rep)
 
 	if(100190_rep->status_data.status != "F")
 		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetEncntrTimezone Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrivileges(null) = i2 with protect	;Request 680500 - MSVC_GetPrivilegesByCodes
;  Description:  Get user privileges
**************************************************************************/
subroutine GetPrivileges(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 680500
 
	set 680500_req->patient_user_criteria.user_id = dPrsnlId
 
	; Set the encntnr prsnl reltn code from request 115421
	select into "nl:"
	from (dummyt d with seq = size(115421_rep->entity_qual[1].encntr_prsnl_r_qual,5))
	plan d where 115421_rep->entity_qual[1].encntr_prsnl_r_qual[d.seq].prsnl_person_id = dPrsnlId
	detail
		680500_req ->patient_user_criteria.patient_user_relationship_cd =
		115421_rep->entity_qual[1].encntr_prsnl_r_qual[d.seq].encntr_prsnl_r_cd
	with nocounter
 
	set stat = alterlist(680500_req->privilege_criteria.privileges,2)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_rx_wo_supervising_dr
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = c_rx_wo_cosign
	set stat = alterlist(680500_req->privilege_criteria.locations,1)
	set 680500_req->privilege_criteria.locations[1].location_id = 115421_rep->entity_qual[1].encntr.loc_facility_cd
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",680500_req,"REC",680500_rep)
 
	if(680500_rep->transaction_status.success_ind = 1)
		for(i = 1 to size(680500_rep->privileges,5))
			set iValidate = iValidate + 680500_rep->privileges[i].locations[1].privilege.status.success_ind
		endfor
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderCatalogSynonymInfo(null) = i2 with protect	;Request 500693 - orm_get_ocs
;  Description:  Get Order Catalog Synonym details
**************************************************************************/
subroutine GetOrderCatalogSynonymInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderCatalogSynonymInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500693
 
	set stat = alterlist(500693_req->qual,1)
	set 500693_req->qual[1].synonym_id = dMedicationId
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500693_req,"REC",500693_rep)
 
	if(500693_rep->status_data.status != "F")
		set iValidate = size(500693_rep->qual,5)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderCatalogSynonymInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderCatalogInfo(null) = i2 with protect	;Request 500080 - Get Order Catalog Info
;  Description:  Get Order Catalog Details
**************************************************************************/
subroutine GetOrderCatalogInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderCatalogInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 500080
 
	set stat = alterlist(500080_req->qual,1)
	set 500080_req->qual[1].catalog_cd = 500693_rep->qual[1].catalog_cd
 
 	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500080_req,"REC",500080_rep)
 
	if(500080_rep->status_data.status != "F")
		set iValidate = size(500080_rep->qual,5)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderCatalogInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrmFormatInfo(null) = i2 with protect 	;Request 560000 - ORM.FmtQuery
;  Description:  Get OE Format fields
**************************************************************************/
subroutine GetOrmFormatInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrmFormatInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 560000
 
 	set 560000_req->oeFormatId = 500693_rep->qual[1].oe_format_id
 	set 560000_req->actionTypeCd = c_action_type_order
 	set 560000_req->positionCd = 600316_rep->providers[1].position_cd
 	set 560000_req->patLocationCd = 115421_rep->entity_qual[1].encntr.location_cd
 	set 560000_req->applicationCd = c_oe_format_appl
 	set 560000_req->encntrTypeCd = 115421_rep->entity_qual[1].encntr.encntr_type_cd
 	set 560000_req->includePromptInd = 1
 	set 560000_req->origOrdAsFlag = 1
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",560000_req,"REC",560000_rep)
 
	if(560000_rep->status_data.status != "F")
		set iValidate = size(560000_rep->fieldList,5)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetOrmFormatInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderNextSeq(null)	= i2 with protect	;Request 500698 - orm_get_next_sequence
;  Description:  Gets the next order id
**************************************************************************/
subroutine GetOrderNextSeq(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderNextSeq Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500698
 
	set 500698_req->seq_name = "order_seq"
	set 500698_req->number = 1
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500698_req,"REC",500698_rep)
 
	if(500698_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderNextSeq Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: BuildSimplifiedDisplayLine(null)	= i2 with protect	;Request 680600 - BuildSimplifiedDisplayLine
;  Description:  Builds the simplified display line based on details entered
**************************************************************************/
subroutine BuildSimplifiedDisplayLine(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildSimplifiedDisplayLine Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 680600
 
	set stat = alterlist(680600_req->display_line_criteria,1)
	set 680600_req->display_line_criteria[1].display_line_id = cnvtstring(500698_rep->qual[1].seq_value)
	set 680600_req->display_line_criteria[1].custom_dose_display_criteria.dose_display_suppression_ind = 1
	set 680600_req->display_line_criteria[1].medication_display_criteria.simple_medication_criteria.simple_medication_type_ind = 1
	set 680600_req->display_line_criteria[1].medication_display_criteria.originally_ordered_as_type.documented_ind = 1
 
	set detCnt = 0
	for(i = 1 to size(560000_rep->fieldList,5))
		case(560000_rep->fieldList[i].oeFieldMeaning)
			of "FREETXTDOSE":
				set detCnt = detCnt + 1
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list,detCnt)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].meaning_id = 560000_rep->fieldList[i].oeFieldMeaningId
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values,1)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values[1].display = "See Instructions"
 
			of "SPECINX":
				set detCnt = detCnt + 1
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list,detCnt)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].meaning_id = 560000_rep->fieldList[i].oeFieldMeaningId
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values,1)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values[1].display = sSigLine
 
			of "NBRREFILLS":
				set detCnt = detCnt + 1
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list,detCnt)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].meaning_id = 560000_rep->fieldList[i].oeFieldMeaningId
				set stat = alterlist(680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values,1)
				set 680600_req->display_line_criteria[1].detail_list[detCnt].text_detail_values[1].display = "0"
		endcase
	endfor
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",680600_req,"REC",680600_rep)
 
	if(680600_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("BuildSimplifiedDisplayLine Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name:  PostMedicationOrder(null) = i2 with protect	;Request 560201 - ORM.OrderWriteSynch
;  Description:  Posts the historical medication to the encounter
**************************************************************************/
subroutine PostMedicationOrder(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostMedicationOrder Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 560201
 
	set 560201_req->personId = dPatientId
	set 560201_req->actionPersonnelId = dPrsnlId
	set 560201_req->replyInfoFlag = 1
	set stat = alterlist(560201_req->orderList,1)
	set 560201_req->orderList[1].orderId = 500698_rep->qual[1].seq_value
	set 560201_req->orderList[1].actionTypeCd = c_action_type_order
	set 560201_req->orderList[1].orderDtTm = cnvtdatetime(curdate,curtime3)
	set 560201_req->orderList[1].oeFormatId = 500693_rep->qual[1].oe_format_id
	if(dProviderId > 0)
		set 560201_req->orderList[1].orderProviderId = dProviderId
	endif
	set 560201_req->orderList[1].catalogTypeCd = 500080_rep->qual[1].catalog_type_cd
	set 560201_req->orderList[1].catalogCd = 500080_rep->qual[1].catalog_cd
	set 560201_req->orderList[1].synonymId = dMedicationId
	set 560201_req->orderList[1].primaryMnemonic = 500080_rep->qual[1].primary_mnemonic
	set 560201_req->orderList[1].activityTypeCd = 500080_rep->qual[1].activity_type_cd
	set 560201_req->orderList[1].contOrderMethodFlag = 500080_rep->qual[1].cont_order_method_flag
	set 560201_req->orderList[1].orderReviewInd = 500080_rep->qual[1].order_review_ind
	set 560201_req->orderList[1].printReqInd = 500080_rep->qual[1].print_req_ind
	set 560201_req->orderList[1].requisitionFormatCd = 500080_rep->qual[1].requisition_format_cd
	set 560201_req->orderList[1].requisitionRoutingCd = 500080_rep->qual[1].requisition_routing_cd
	set 560201_req->orderList[1].deptDisplayName = 500080_rep->qual[1].dept_display_name
	set 560201_req->orderList[1].dcpClinCatCd = 500080_rep->qual[1].dcp_clin_cat_cd
	set 560201_req->orderList[1].cki = 500080_rep->qual[1].cki
	if(qStopDateTime > 0)
		set 560201_req->orderList[1].stopTypeCd = uar_get_code_by("MEANING",4009,"HARD")
		set 560201_req->orderList[1].stopDuration = datetimediff(qStopDateTime,qStartDateTime,1)
		set 560201_req->orderList[1].stopDurationUnitCd = uar_get_code_by("MEANING",54,"DAYS")
	endif
	set 560201_req->orderList[1].origOrdAsFlag = 2  ; 2 = Recorded / Home Meds
	set 560201_req->orderList[1].rxMask = 4 		; 4 = Med
	set 560201_req->orderList[1].encntrId = dEncounterId
	set 560201_req->orderList[1].medOrderTypeCd = uar_get_code_by("MEANING",18309,"MED")
	set 560201_req->orderList[1].orderedAsMnemonic = 500693_rep->qual[1].mnemonic
	set stat = alterlist(560201_req->orderList[1].subComponentList,1)
	set 560201_req->orderList[1].subComponentList[1].scCatalogCd = 500080_rep->qual[1].catalog_cd
	set 560201_req->orderList[1].subComponentList[1].scSynonymId = dMedicationId
	set 560201_req->orderList[1].subComponentList[1].scFreetextDose = "See Instructions"
	set 560201_req->orderList[1].subComponentList[1].scOrderedAsMnemonic = 500693_rep->qual[1].mnemonic
	set 560201_req->orderList[1].subComponentList[1].scHnaOrderMnemonic = 500080_rep->qual[1].primary_mnemonic
	set 560201_req->orderList[1].subComponentList[1].scIngredientTypeFlag = 1
	set 560201_req->orderList[1].subComponentList[1].scModifiedFlag = 1
 
	if(sComments > " ")
		set stat = alterlist(560201_req->orderList[1].commentList,1)
		set 560201_req->orderList[1].commentList[1].commentText = sComments
		set 560201_req->orderList[1].commentList[1].commentType = uar_get_code_by("MEANING",14,"ORD COMMENT")
	endif
 
	set stat = alterlist(560201_req->orderList[1].detailList,size(560000_rep->fieldList,5))
	for(i = 1 to size(560000_rep->fieldList,5))
 
		set 560201_req->orderList[1].detailList[i].oeFieldId = 560000_rep->fieldList[i].oeFieldId
		set 560201_req->orderList[1].detailList[i].oeFieldMeaning = 560000_rep->fieldList[i].oeFieldMeaning
		set 560201_req->orderList[1].detailList[i].oeFieldMeaningId = 560000_rep->fieldList[i].oeFieldMeaningId
		set 560201_req->orderList[1].detailList[i].groupSeq = 560000_rep->fieldList[i].groupSeq
		set 560201_req->orderList[1].detailList[i].fieldSeq = 560000_rep->fieldList[i].fieldSeq
		set 560201_req->orderList[1].detailList[i].valueRequiredInd = 560000_rep->fieldList[i].valueRequiredInd
 
		case(560000_rep->fieldList[i].oeFieldMeaning)
 
			of "FREETXTDOSE":
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = "See Instructions"
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of "SPECINX":
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = sSigLine
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of "NBRREFILLS":
				set 560201_req->orderList[1].detailList[i].oeFieldValue = 0
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = "0"
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of "REQSTARTDTTM":
				set 560201_req->orderList[1].detailList[i].oeFieldDtTmValue = qStartDateTime
				if(UTCmode)
					set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue =
						datetimezoneformat(qStartDateTime,100190_rep->encntrs[1].time_zone_indx, "MM/DD/YY HH:MM ZZZ")
				else
					set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue =
						datetimezoneformat(qStartDateTime,curtimezoneapp,"MM/DD/YY HH:MM ZZZ")
				endif
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of "STOPTYPE":
				set 560201_req->orderList[1].detailList[i].oeFieldValue = uar_get_code_by("MEANING",4009,"SOFT")
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = "Maintenance"
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of  "STOPDTTM":
				if(qStopDateTime > 0)
					set 560201_req->orderList[1].detailList[i].oeFieldDtTmValue = qStopDateTime
					if(UTCmode)
						set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue =
							datetimezoneformat(qStopDateTime,100190_rep->encntrs[1].time_zone_indx, "MM/DD/YY HH:MM ZZZ")
					else
						set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue =
							datetimezoneformat(qStopDateTime,curtimezoneapp,"MM/DD/YY HH:MM ZZZ")
					endif
					set 560201_req->orderList[1].detailList[i].modifiedInd = 1
				endif
 
			of value("DAW","PRINTDEANUMBER","SAMPLESGIVEN"):
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = "No"
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
 
			of value("INSTREPLACEREQUIREDDETS","CONSTANTIND"):
				set 560201_req->orderList[1].detailList[i].oeFieldDisplayValue = "Yes"
				set 560201_req->orderList[1].detailList[i].modifiedInd = 1
		endcase
	endfor
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",560201_req,"REC",560201_rep)
 
	if(560201_rep->status_data.status != "F")
		set iValidate = 1
		set medorder_reply_out->order_id = 560201_rep->orderList[1].orderId
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostMedicationOrder Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddOrderCompliance(null) = i2 with protect	;Request 500511 - orm_add_order_compliance
;  Description:  Adds Order to compliance tables?
**************************************************************************/
subroutine AddOrderCompliance(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddOrderCompliance Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500511
 
	set 500511_req->encntr_id = dEncounterId
	set 500511_req->performed_dt_tm = cnvtdatetime(curdate,curtime3)
	if(UTCmode)
		set 500511_req->performed_tz = 100190_rep->encntrs[1].time_zone_indx
	else
		set 500511_req->performed_tz = curtimezoneapp
	endif
	set 500511_req->performed_prsnl_id = dPrsnlId
	set stat = alterlist(500511_req->order_list,1)
	set 500511_req->order_list[1].order_nbr = 560201_rep->orderList[1].orderId
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500511_req,"REC",500511_rep)
 
	if(500511_rep->status_data.status!= "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("AddOrderCompliance Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
