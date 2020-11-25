/***********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************************
      Source file name:     snsro_post_labresults.prg
      Object name:          vigilanz_post_labresults
      Program purpose:      POST a new general lab results in millennium
      Executing from:       Emissary - MPages Discern Web Service
************************************************************************************
                    MODIFICATION CONTROL LOG
************************************************************************************
 Mod Date     Engineer            	Comment
 --- -------- ------------------- 	-----------------------------------------
 001 01/03/19 RJC					Initial Write
 002 01/09/19 RJC					Minor fixes. Comments change
 003 01/15/19 RJC					Added referencenumber check
************************************************************************************/
drop program vigilanz_post_labresults go
create program vigilanz_post_labresults
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Argument List" = ""			;Required - JSON object of data
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, ARGS, DEBUG_FLAG
 
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
set MODIFY MAXVARLEN 200000000
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; 680501 - MSVC_CheckPrivileges
free record 680501_req
 record 680501_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 event_privileges
    2 event_set_level
      3 event_sets [*]
        4 event_set_name = vc
      3 view_results_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
    2 event_code_level
      3 event_codes [*]
        4 event_cd = f8
      3 view_results_ind = i2
      3 document_section_viewing_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
)
 
free record 680501_rep
record 680501_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 event_privileges
    2 view_results
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 document_section_viewing
      3 granted
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 add_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 modify_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 unchart_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 sign_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
;500439 - ord_srv_get_order_rec
free record 500439_req
record 500439_req (
  1 order_id = f8
)
 
free record 500439_rep
record 500439_rep (
   1 order_id = f8
   1 encntr_id = f8
   1 product_id = f8
   1 person_id = f8
   1 catalog_cd = f8
   1 catalog_type_cd = f8
   1 orig_order_dt_tm = dq8
   1 order_status_cd = f8
   1 order_mnemonic = c100
   1 hna_order_mnemonic = c100
   1 last_action_sequence = i4
   1 last_update_provider_id = f8
   1 activity_type_cd = f8
   1 order_detail_display_line = c255
   1 template_order_id = f8
   1 template_order_flag = i2
   1 synonym_id = f8
   1 group_order_id = f8
   1 group_order_flag = i2
   1 oe_format_id = f8
   1 suspend_ind = i2
   1 suspend_effective_dt_tm = dq8
   1 resume_ind = i2
   1 resume_effective_dt_tm = dq8
   1 discontinue_ind = i2
   1 discontinue_effective_dt_tm = dq8
   1 contributor_system_cd = f8
   1 link_order_flag = i2
   1 link_order_id = f8
   1 encntr_financial_id = f8
   1 status_dt_tm = dq8
   1 status_prsnl_id = f8
   1 iv_ind = i2
   1 constant_ind = i2
   1 prn_ind = i2
   1 order_comment_ind = i2
   1 need_rx_verify_ind = i2
   1 need_nurse_review_ind = i2
   1 need_doctor_cosign_ind = i2
   1 current_start_dt_tm = dq8
   1 projected_stop_dt_tm = dq8
   1 cs_order_id = f8
   1 cs_flag = i2
   1 updt_dt_tm = dq8
   1 updt_id = f8
   1 updt_task = i4
   1 updt_cnt = i4
   1 updt_applctx = i4
   1 orig_ord_as_flag = i2
   1 ingredient_ind = i2
   1 dept_status_cd = f8
   1 ref_text_mask = i4
   1 clinical_display_line = c255
   1 interest_dt_tm = dq8
   1 discontinue_type_cd = f8
   1 rx_mask = i4
   1 sch_state_cd = f8
   1 dcp_clin_cat_cd = f8
   1 orig_order_convs_seq = i4
   1 orderable_type_flag = i2
   1 interval_ind = i2
   1 dept_misc_line = c255
   1 hide_flag = i2
   1 med_order_type_cd = f8
   1 cki = c255
   1 ordered_as_mnemonic = c100
   1 last_core_action_sequence = i4
   1 eso_new_order_ind = i2
   1 freq_type_flag = i2
   1 frequency_id = f8
   1 stop_type_cd = f8
   1 modified_start_dt_tm = dq8
   1 comment_type_mask = i4
   1 override_flag = i2
   1 remaining_dose_cnt = i4
   1 valid_dose_dt_tm = dq8
   1 orig_order_tz = i4
   1 soft_stop_tz = i4
   1 projected_stop_tz = i4
   1 resume_effective_tz = i4
   1 discontinue_effective_tz = i4
   1 suspend_effective_tz = i4
   1 current_start_tz = i4
   1 link_nbr = f8
   1 link_type_flag = i2
   1 ad_hoc_order_flag = i2
   1 pathway_catalog_id = f8
   1 simplified_display_line = c1000
   1 source_cd = f8
   1 need_rx_clin_review_flag = i2
   1 clin_relevant_updt_dt_tm = dq8
   1 clin_relevant_updt_tz = i4
   1 iv_set_synonym_id = f8
   1 order_schedule_precision_bit = i4
   1 future_location_facility_cd = f8
   1 future_location_nurse_unit_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;600484 wv_get_template_labels - Get task assay code
free record 600484_req
record 600484_req (
  1 event_cd_list [*]
    2 event_cd = f8
)
 
free record 600484_rep
record 600484_rep (
   1 dtas [* ]
     2 task_assay_cd = f8
     2 template_label_id = f8
     2 event_cd = f8
     2 description = vc
     2 equation_ind = i2
     2 io_total_id = f8
     2 conditional_ind = i2
     2 trigger_ind = i2
     2 ref_range [* ]
       3 species_cd = f8
       3 sex_cd = f8
       3 age_from_minutes = i4
       3 age_to_minutes = i4
       3 service_resource_cd = f8
       3 encntr_type_cd = f8
       3 normal_ind = i2
       3 normal_low = f8
       3 normal_high = f8
       3 critical_ind = i2
       3 critical_low = f8
       3 critical_high = f8
       3 feasible_ind = i2
       3 feasible_low = f8
       3 feasible_high = f8
       3 units_cd = f8
       3 minutes_back = i4
       3 age_from = i4
       3 age_to = i4
       3 age_from_units_cd = f8
       3 age_to_units_cd = f8
       3 age_from_units_meaning = vc
       3 age_to_units_meaning = vc
     2 default_result_type_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;600356 dcp_get_dta_info_all - Get DTA details
free record 600356_req
record 600356_req (
  1 dta [*]
    2 task_assay_cd = f8
)
 
free record 600356_rep
record 600356_rep (
    1 dta [* ]
      2 task_assay_cd = f8
      2 active_ind = i2
      2 mnemonic = vc
      2 description = vc
      2 event_cd = f8
      2 activity_type_cd = f8
      2 activity_type_disp = vc
      2 activity_type_desc = vc
      2 activity_type_mean = vc
      2 default_result_type_cd = f8
      2 default_result_type_disp = c40
      2 default_result_type_desc = c60
      2 default_result_type_mean = vc
      2 code_set = i4
      2 equation [* ]
        3 equation_id = f8
        3 equation_description = vc
        3 equation_postfix = vc
        3 script = vc
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 unknown_age_ind = i2
        3 e_comp_cnt = i4
        3 e_comp [* ]
          4 constant_value = f8
          4 default_value = f8
          4 units_cd = f8
          4 included_assay_cd = f8
          4 name = vc
          4 result_req_flag = i2
          4 look_time_direction_flag = i2
          4 time_window_minutes = i4
          4 time_window_back_minutes = i4
          4 event_cd = f8
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
      2 ref_range_factor [* ]
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 encntr_type_cd = f8
        3 specimen_type_cd = f8
        3 review_ind = i2
        3 review_low = f8
        3 review_high = f8
        3 sensitive_ind = i2
        3 sensitive_low = f8
        3 sensitive_high = f8
        3 normal_ind = i2
        3 normal_low = f8
        3 normal_high = f8
        3 critical_ind = i2
        3 critical_low = f8
        3 critical_high = f8
        3 feasible_ind = i2
        3 feasible_low = f8
        3 feasible_high = f8
        3 units_cd = f8
        3 units_disp = c40
        3 units_desc = c60
        3 code_set = i4
        3 minutes_back = i4
        3 def_result_ind = i2
        3 default_result = vc
        3 default_result_value = f8
        3 unknown_age_ind = i2
        3 alpha_response_ind = i2
        3 alpha_responses_cnt = i4
        3 alpha_responses [* ]
          4 nomenclature_id = f8
          4 source_string = vc
          4 short_string = vc
          4 mnemonic = c25
          4 sequence = i4
          4 default_ind = i2
          4 description = vc
          4 result_value = f8
          4 multi_alpha_sort_order = i4
          4 concept_identifier = vc
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
        3 categories [* ]
          4 category_id = f8
          4 expand_flag = i2
          4 category_name = vc
          4 sequence = i4
          4 alpha_responses [* ]
            5 nomenclature_id = f8
            5 source_string = vc
            5 short_string = vc
            5 mnemonic = c25
            5 sequence = i4
            5 default_ind = i2
            5 description = vc
            5 result_value = f8
            5 multi_alpha_sort_order = i4
            5 concept_identifier = vc
      2 data_map [* ]
        3 data_map_type_flag = i2
        3 result_entry_format = i4
        3 max_digits = i4
        3 min_digits = i4
        3 min_decimal_places = i4
        3 service_resource_cd = f8
      2 modifier_ind = i2
      2 single_select_ind = i2
      2 default_type_flag = i2
      2 version_number = f8
      2 io_flag = i2
      2 io_total_definition_id = f8
      2 label_template_id = f8
      2 template_script_cd = f8
      2 event_set_cd = f8
      2 dta_offset_mins [* ]
        3 dta_offset_min_id = f8
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
        3 offset_min_nbr = i4
        3 offset_min_type_cd = f8
      2 witness_required_ind = i2
    1 cond_exp [* ]
      2 cond_expression_id = f8
      2 cond_expression_name = c100
      2 cond_expression_text = c512
      2 cond_postfix_txt = c512
      2 multiple_ind = i2
      2 prev_cond_expression_id = f8
      2 beg_effective_dt_tm = dq8
      2 end_effective_dt_tm = dq8
      2 exp_comp [* ]
        3 active_ind = i2
        3 beg_effective_dt_tm = dq8
        3 cond_comp_name = c30
        3 cond_expression_comp_id = f8
        3 end_effective_dt_tm = dq8
        3 operator_cd = f8
        3 parent_entity_id = f8
        3 parent_entity_name = c60
        3 prev_cond_expression_comp_id = f8
        3 required_ind = i2
        3 trigger_assay_cd = f8
        3 result_value = f8
        3 cond_expression_id = f8
      2 cond_dtas [* ]
        3 active_ind = i2
        3 age_from_nbr = f8
        3 age_from_unit_cd = f8
        3 age_to_nbr = f8
        3 age_to_unit_cd = f8
        3 beg_effective_dt_tm = dq8
        3 conditional_assay_cd = f8
        3 conditional_dta_id = f8
        3 end_effective_dt_tm = dq8
        3 gender_cd = f8
        3 location_cd = f8
        3 position_cd = f8
        3 prev_conditional_dta_id = f8
        3 required_ind = i2
        3 unknown_age_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
; 100190 - PM_GET_ENCNTR_LOC_TZ
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
    	1 encntrs [*]
		  2 encntr_id = f8
      	  2 time_zone_indx = i4
      	  2 time_zone = vc
      	  2 transaction_dt_tm = dq8
      	  2 check = i2
      	  2 status = i2
      	  2 loc_fac_cd = f8
    	1 facilities_qual_cnt = i4
    	1 facilities [*]
      	  2 loc_facility_cd = f8
      	  2 time_zone_indx = i4
      	  2 time_zone = vc
          2 status = i2
    	1 status_data
      	  2 status = c1
      	  2 subeventstatus [1]
        	3 operationname = c25
        	3 operationstatus = c1
        	3 targetobjectname = c25
        	3 targetobjectvalue = vc
)
 
; 1000042 - event_note_ensure
free record 1000042_req
record 1000042_req (
  1 ensure_type = i2
  1 version_dt_tm = dq8
  1 version_dt_tm_ind = i2
  1 ce_event_note_id = f8
  1 event_note_id = f8
  1 event_id = f8
  1 note_type_cd = f8
  1 note_format_cd = f8
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 entry_method_cd = f8
  1 note_prsnl_id = f8
  1 note_dt_tm = dq8
  1 note_dt_tm_ind = i2
  1 record_status_cd = f8
  1 compression_cd = f8
  1 long_blob = gvc
  1 long_text_id = f8
  1 non_chartable_flag = i2
  1 importance_flag = i2
  1 ensure_type2 = i2
  1 note_tz = i4
)
 
free record 1000042_rep
record 1000042_rep (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
      3 subStatusCd = i4
  1 version_dt_tm = dq8
  1 version_dt_tm_ind = i2
  1 ce_event_note_id = f8
  1 valid_until_dt_tm = dq8
  1 valid_until_dt_tm_ind = i2
  1 event_note_id = f8
  1 event_id = f8
  1 note_type_cd = f8
  1 note_format_cd = f8
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 entry_method_cd = f8
  1 note_prsnl_id = f8
  1 note_dt_tm = dq8
  1 note_dt_tm_ind = i2
  1 record_status_cd = f8
  1 compression_cd = f8
  1 checksum = i4
  1 checksum_ind = i2
  1 long_blob = gvc
  1 long_text_id = f8
  1 non_chartable_flag = i2
  1 importance_flag = i2
  1 note_tz = i4
)
 
;500077 - orm_get_modify_details
free record 500077_req
record 500077_req (
  1 new_action_type_cd = f8
  1 modify_action_type_cd = f8
  1 order_qual [*]
    2 order_id = f8
)
 
free record 500077_rep
record 500077_rep (
  1 qual [* ]
     2 order_id = f8
     2 detqual_cnt = i4
     2 detqual [* ]
       3 action_sequence = i4
       3 detail_sequence = i4
       3 oe_field_id = f8
       3 oe_field_value = f8
       3 oe_field_display_value = vc
       3 oe_field_meaning = c25
       3 oe_field_meaning_id = f8
       3 oe_field_dt_tm_value = dq8
       3 oe_field_tz = i4
       3 action_cd = f8
     2 latest_supervising_provider_id = f8
   1 lookup_status = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c8
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
)
 
;560201 - ORM.OrderWriteSync
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
      3 applyProtocolUpdate [*]
        4 treatmentPeriodDisplay = vc
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
      3 ePrescriptionMgrCalledInd = i2
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
 
; Final Reply
free record labresult_reply_out
record labresult_reply_out(
  1 result_ids[*]			= f8
  1 parent_result_id		= f8
  1 child_results[*]
  	2 id					= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname      	= vc
    2 user_lastname       	= vc
    2 patient_id			= f8
    2 patient_firstname 	= vc
    2 patient_lastname    	= vc
    2 service_version  		= vc
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
 
; Argument List
free record arglist
record arglist (
	1 OrderId 					= vc
	1 OrderStatusId				= vc
	;1 DeptStatusId				= vc
	1 PatientId 				= vc
	1 PatientIdTypeId 			= vc
	1 ReferenceNumber 			= vc
	1 ResultGroupStatusId		= vc
	1 ResultGroupComponentId 	= vc
	1 ResultGroupDateTime		= vc
	1 AccessionNumber 			= vc
	1 Identifiers[*]
		2 CodeId				= vc
		2 TypeId				= vc
	1 Specimen
		2 ReceivedDateTime		= vc
		2 CollectedDateTime		= vc
		2 SourceTypeId			= vc
		2 ContainerTypeId		= vc
		2 BodySiteId			= vc
		2 CollectedByProviderId	= vc
	1 ResultGroups[*]
		2 Comments 				= vc
		2 ComponentId 			= vc
		2 Flag 					= vc
		2 Identifiers[*]
			3 CodeId			= vc
			3 TypeId 			= vc
		2 NormalHigh 			= vc
		2 NormalLow 			= vc
		2 Normalcy 				= vc
		2 PerformingLabId 		= vc
		2 ResultDateTime 		= vc
		2 ResultValue 			= vc
		2 StatusId 				= vc
		2 UnitId 				= vc
	1 UnsolicitedResultOrderInformation
		2 EncounterId 			= vc
		2 EncounterIdTypeId		= vc
		2 OrderDateTime 		= vc
		2 OrderableId 			= vc
		2 OrderingProviderId 	= vc
		2 OrderingProviderTypeId = vc
	1 SystemId					= vc
	1 SourceId					= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sJsonArgs						= vc with protect, noconstant("")
 
free record input
record input (
	1 sUserName 						= vc
	1 sPatientId						= vc
	1 dPatientId						= f8
	1 dPatientIdTypeCd					= f8
	1 dOrderId							= f8
	1 dOrderStatusCd					= f8
	1 dDeptStatusCd						= f8
	1 sReferenceNumber					= vc
	1 dResultStatusCd					= f8
	1 dGroupComponentCd					= f8
	1 sEncounterId						= vc
	1 dEncounterId						= f8
	1 dEncounterIdTypeCd				= f8
	1 dOrderableId						= f8
	1 dOrderingProviderId				= f8
	1 dOrderingProviderTypeCd			= f8
	1 qResultDateTime					= dq8
	1 sAccessionNumber 					= vc
	1 dSystemId							= f8
	1 dSourceId							= f8
	1 specimen
		2 qReceivedDateTime				= dq8
		2 qCollectedDateTime			= dq8
		2 dSourceTypeId					= f8
		2 dContainerTypeId				= f8
		2 dBodySiteId					= f8
		2 dCollectedByPrsnlId			= f8
		2 spec_details
			3 specimen_id				= f8
			3 container_id				= f8
	1 identifiers[*]
		2 sCode							= vc
		2 dTypeCd						= f8
	1 details
		2 task_assay_cd					= f8
	1 result_group[*]
		2 sNotes 						= vgc
		2 dComponentId 					= f8
		2 sFlag							= vc
		2 identifiers[*]
			3 sCode 					= vc
			3 dTypeCd 					= f8
		2 sNormalHigh 					= vc
		2 sNormalLow 					= vc
		2 dNormalcyCd					= f8
		2 dPerformingLabId	 			= f8
		2 qResultDateTime 				= dq8
		2 sResultValue 					= vc
		2 dStatusCd 					= f8
		2 dUnitCd 						= f8
		2 sFinalResultVal				= vc
		2 qFinalResultValDttm			= dq8
		2 details
			3 task_assay_cd				= f8
			3 version_number			= f8
			3 event_class_cd 			= f8
			3 result_type_cd			= f8
			3 normalcy_cd 				= f8
			3 review_high 				= f8
			3 review_low 				= f8
			3 sensitive_high 			= f8
			3 sensitive_low 			= f8
			3 normal_ind				= i2
			3 normal_high 				= f8
			3 normal_low 				= f8
			3 critical_ind				= i2
			3 critical_high 			= f8
			3 critical_low 				= f8
			3 feasible_ind				= i2
			3 feasible_high 			= f8
			3 feasible_low 				= f8
			3 results_units_cd 			= f8
			3 time_zone 				= i4
			3 string_result_check 		= i2
			3 string_result_format_cd 	= f8
			3 date_result_check			= i2
			3 date_type_flag 			= i2
			3 io_type_flag 				= i2
			3 max_digits 				= i4
        	3 min_digits 				= i4
        	3 min_decimal_places 		= i4
        2 event_id						= f8
)
declare iDebugFlag						= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId						= f8 with protect, noconstant(0.0)
declare dConfidentialCd 				= f8 with protect, noconstant(uar_get_code_by("MEANING",87,"ROUTCLINICAL"))
declare iTimeZone						= i4 with protect, noconstant(CURTIMEZONEAPP)
declare iEncntrTimeZone					= i4 with protect, noconstant(0)
declare iPanelTestInd					= i2 with protect, noconstant(0)
declare iTotalCommentCnt				= i4 with protect, noconstant(0)
 
; Constants
declare c_error_handler 				= vc with protect, constant("POST LAB RESULT")
declare c_perform_action_type_cd 		= f8 with protect ,constant(uar_get_code_by ("MEANING" ,21 ,"PERFORM"))
declare c_verify_action_type_cd 		= f8 with protect ,constant(uar_get_code_by ("MEANING" ,21 ,"VERIFY"))
declare c_sign_action_type_cd 			= f8 with protect ,constant(uar_get_code_by ("MEANING" ,21 ,"SIGN"))
declare c_modify_action_type_cd 		= f8 with protect ,constant(uar_get_code_by ("MEANING" ,21 ,"MODIFY"))
declare c_order_action_type_cd 			= f8 with protect ,constant(uar_get_code_by ("MEANING" ,21 ,"ORDER"))
declare c_completed_action_status_cd 	= f8 with protect ,constant(uar_get_code_by ("MEANING" ,103 ,"COMPLETED"))
declare c_pending_action_status_cd 		= f8 with protect ,constant(uar_get_code_by ("MEANING" ,103 ,"PENDING"))
declare c_undefined_entry_mode_cd 		= f8 with protect ,constant(uar_get_code_by ("MEANING" ,29520,"UNDEFINED"))
declare c_auth_status_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_inerror_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",8,"IN ERROR"))
declare c_inerrornomut_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERRNOMUT"))
declare c_inerrornoview_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERRNOVIEW"))
declare c_inerror2_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERROR"))
declare c_altered_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",8,"ALTERED"))
declare c_modified_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",8,"MODIFIED"))
declare c_ctranscribe_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"C_TRANSCRIBE"))
declare c_rejected_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",8,"REJECTED"))
declare c_active_rec_status_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_unspecified_source_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",30200,"UNSPECIFIED"))
declare c_confirmed_io_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000160,"CONFIRMED"))
declare c_unknown_entry_method_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_grp_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_root_event_reltn_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",24,"ROOT"))
declare c_child_event_reltn_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",24,"CHILD"))
declare c_lab_discipline_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",6000,"GENERAL LAB"))
declare c_rescomment_note_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_ah_note_format_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",23,"AH"))
declare c_nocomp_compression_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP"))
declare c_loinc_source_vocabulary_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",400,"LOINC"))
declare c_tms_assignment_method_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4002244,"TMS"))
declare c_event_entity_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",4002271,"EVENT"))
declare c_inprocess_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6004,"INPROCESS"))
declare c_completed_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6004,"COMPLETED"))
declare c_inprocess_dept_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABINPROCESS"))
declare c_completed_dept_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",14281,"COMPLETED"))
declare c_statuschange_action_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6003,"STATUSCHANGE"))
declare c_complete_action_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6003,"COMPLETE"))
declare c_lab_contributor_source_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",73,"LAB"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sJsonArgs 							= trim($ARGS,3)
set jrec 								= cnvtjsontorec(sJsonArgs) ;This loads the arglist record
set input->sUserName					= trim($USERNAME, 3)
set input->sPatientId					= trim(arglist->PatientId,3)
set input->dPatientIdTypeCd				= cnvtreal(arglist->PatientIdTypeId)
set input->dOrderId						= cnvtreal(arglist->OrderId)
set input->dOrderStatusCd				= cnvtreal(arglist->OrderStatusId)
;set input->dDeptStatusCd				= cnvtreal(arglist->DeptStatusId)
set input->sReferenceNumber				= trim(arglist->ReferenceNumber,3)
set input->dResultStatusCd				= cnvtreal(arglist->ResultGroupStatusId)
set input->dGroupComponentCd			= cnvtreal(arglist->ResultGroupComponentId)
set input->qResultDateTime				= GetDateTime(trim(arglist->ResultGroupDateTime,3))
set input->sAccessionNumber				= trim(arglist->AccessionNumber,3)
set input->dSystemId					= cnvtreal(arglist->SystemId)
set input->dSourceId					= cnvtreal(arglist->SourceId)
set input->specimen.dBodySiteId			= cnvtreal(arglist->Specimen.BodySiteId)
set input->specimen.dCollectedByPrsnlId	= cnvtreal(arglist->Specimen.CollectedByProviderId)
set input->specimen.dContainerTypeId	= cnvtreal(arglist->Specimen.ContainerTypeId)
set input->specimen.dSourceTypeId		= cnvtreal(arglist->Specimen.SourceTypeId)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
; Collected/Received DateTime
if(arglist->Specimen.CollectedDateTime > " ")
	set input->specimen.qCollectedDateTime = GetDateTime(arglist->Specimen.CollectedDateTime)
endif
if(arglist->Specimen.ReceivedDateTime > " ")
	set input->specimen.qReceivedDateTime = GetDateTime(arglist->Specimen.ReceivedDateTime)
endif
 
; Identifiers
if(size(arglist->Identifiers,5) > 0)
	for(i = 1 to size(arglist->Identifiers,5))
		set stat = alterlist(input->identifiers,i)
		set input->identifiers[i].sCode = trim(arglist->Identifiers[i].CodeId,3)
		set input->identifiers[i].dTypeCd = cnvtreal(arglist->Identifiers[i].TypeId)
	endfor
endif
 
; Other
set dPrsnlId							= GetPrsnlIDfromUserName(input->sUserName)
 
; Unsolicited results
if(input->dOrderId = 0)
	set input->sEncounterId				= trim(arglist->UnsolicitedResultOrderInformation.EncounterId,3)
	set input->dEncounterIdTypeCd		= cnvtreal(arglist->UnsolicitedResultOrderInformation.EncounterIdTypeId)
	set input->dOrderableId				= cnvtreal(arglist->UnsolicitedResultOrderInformation.OrderableId)
	set input->dOrderingProviderId		= cnvtreal(arglist->UnsolicitedResultOrderInformation.OrderingProviderId)
	set input->dOrderingProviderTypeCd	= cnvtreal(arglist->UnsolicitedResultOrderInformation.OrderingProviderTypeId)
endif
 
; Build input record
set groupSize =  size(arglist->ResultGroups,5)
if(groupSize > 0)
	for(i = 1 to groupSize)
		set stat = alterlist(input->result_group,i)
		set input->result_group[i].sNotes 			= trim(arglist->ResultGroups[i].Comments,3)
		if(input->result_group[i].sNotes > " ")
			set iTotalCommentCnt = iTotalCommentCnt + 1
		endif
		set input->result_group[i].dComponentId 	= cnvtreal(arglist->ResultGroups[i].ComponentId)
		set input->result_group[i].sFlag 			= trim(arglist->ResultGroups[i].Flag,3)
		set input->result_group[i].sNormalHigh 		= trim(arglist->ResultGroups[i].NormalHigh,3)
		set input->result_group[i].sNormalLow 		= trim(arglist->ResultGroups[i].NormalLow,3)
		set input->result_group[i].dNormalcyCd 		= cnvtreal(arglist->ResultGroups[i].Normalcy)
		set input->result_group[i].dPerformingLabId = cnvtreal(arglist->ResultGroups[i].PerformingLabId)
		set input->result_group[i].qResultDateTime 	= GetDateTime(trim(arglist->ResultGroups[i].ResultDateTime,3))
		set input->result_group[i].sResultValue 	= trim(arglist->ResultGroups[i].ResultValue,3)
		set input->result_group[i].dStatusCd 		= cnvtreal(arglist->ResultGroups[i].StatusId)
		set input->result_group[i].dUnitCd 			= cnvtreal(arglist->ResultGroups[i].UnitId)
 
		set identSize = size(arglist->ResultGroups[i].Identifiers,5)
		if(identSize > 0)
			for(j = 1 to identSize)
				set stat = alterlist(input->result_group[i].identifiers,j)
				set input->result_group[i].identifiers[j].sCode = trim(arglist->ResultGroups[i].Identifiers[j].CodeId,3)
				set input->result_group[i].identifiers[j].dTypeCd = cnvtreal(arglist->ResultGroups[i].Identifiers[j].TypeId)
			endfor
		endif
	endfor
else
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing result group data.",
	"2055","Missing result group data.", labresult_reply_out)
	go to exit_script
endif
 
; Set PanelTestInd
if(groupSize = 1 and input->result_group[1].dComponentId = input->dGroupComponentCd)
	set iPanelTestInd = 0
else
	set iPanelTestInd = 1
endif
 
if(iDebugFlag > 0)
	call echo(build("sJsonArgs->",sJsonArgs))
	call echo(build("dPrsnlId->",dPrsnlId))
	call echorecord(input)
endif
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) = null
declare VerifyPrivs(null)				= i2 with protect  		; 680501 MSVC_CheckPrivileges
declare GetOrderInfo(null)				= i2 with protect		; 500439 ord_srv_get_order_rec
declare	GetDefaultEventCd(null)			= null with protect
declare GetSpecimenInfo(null)			= null with protect
declare ValidateLabLocation(labId = f8) = i2 with protect
declare GetTaskAssay(null)				= i2 with protect 		; 600484 wv_get_template_labels
declare GetDtaInfo(null)				= i2 with protect		; 600356 dcp_get_dta_info_all
declare ValidateDataEntry(null)			= i2 with protect		; Need to validate user entry with system constraints based on DTA
declare ValidateTimeFormat(time = vc) 	= i2 with protect		; verifies time is 24hr format with four digits
declare GetNormalcyInfo(null)			= null with protect		; Get normalcy data based on patient's age, gender, etc
declare GetTimezone(null)				= i2 with protect 		; 100190 PM_GET_ENCNTR_LOC_TZ
declare PostLabResult(null)				= null with protect
declare UpdateNotes(null)				= null with protect		;1000042 - event_note_ensure
declare GetOeDetails(null) 				= i2 with protect		;500077 - orm_get_modify_details
declare UpdateOrderStatus(null) 		= i2 with protect		;560201 - ORM.OrderWriteSynch
declare UpdateLoinc(null)				= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate PatientIdTypeCd if it exists and set dPatientId
if(input->dPatientIdTypeCd > 0)
	set iRet = GetCodeSet(input->dPatientIdTypeCd)
	if(iRet != 4)
		call ErrorMsg("PatientIdType","2045","I")
	else
		; Set PatientId
		set input->dPatientId = GetPersonIdByAlias(input->sPatientId, input->dPatientIdTypeCd)
	endif
else
	; Set PatientId
	set input->dPatientId = cnvtreal(input->sPatientId)
endif
 
; Validate username
set iRet = PopulateAudit(input->sUserName, input->dPatientId, labresult_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Validate SystemId
if(input->dSystemId > 0)
	set iRet = GetCodeSet(input->dSystemId)
	if(iRet != 89)
		call ErrorMsg("SystemId","9999","I")
	else
		; Validate ReferenceNumber exists on the request and is unique on the table
		if(input->sReferenceNumber = "")
			call ErrorMsg("ReferenceNumber required when SystemId provided.","9999","E")
		else
			;Validate external doc id doesn't already exist
			set check = 0
			select into "nl:"
			from clinical_event ce
			where ce.reference_nbr = input->sReferenceNumber
				and ce.contributor_system_cd = input->dSystemId
			detail
				check = 1
			with nocounter
 
			if(check > 0)
				call ErrorMsg("The ReferenceNumber already exists. Please provide a unique number","9999","E")
			endif
		endif
	endif
else
	set input->dSystemId = reqdata->contributor_system_cd
 
	; Verify ReferenceNumber is null
	if(input->sReferenceNumber > " ")
		call ErrorMsg("A systemId is required for a reference number to be used.","9999","E")
	endif
endif
 
; Validate SourceId
 if(input->dSourceId > 0)
	set iRet = GetCodeSet(input->dSourceId)
	if(iRet != 30200) call ErrorMsg("SourceId","9999","I") endif
endif
 
; Get order information if provided
if(input->dOrderId > 0)
	; Validate Order Status
	if(input->dOrderStatusCd = 0)
		 call ErrorMsg("OrderStatusId","2055","M")
	else
		if(input->dOrderStatusCd not in (c_inprocess_order_status_cd,c_completed_order_status_cd))
			call ErrorMsg("OrderStatusId","9999","I")
		else
			; Set Dept Status
			if(input->dOrderStatusCd = c_inprocess_order_status_cd)
				set input->dDeptStatusCd = c_inprocess_dept_status_cd
			else
				set input->dDeptStatusCd = c_completed_dept_status_cd
			endif
		endif
	endif
 
	; Order Info - 500439 - ord_srv_get_order_rec
	set iRet = GetOrderInfo(null)
	if(iRet = 0) call ErrorMsg("Could not get order info (500439).","9999","E") endif
 
	;Get OE details - 500077 - orm_get_modify_details
	set iRet = GetOeDetails(null)
	if(iRet = 0) call ErrorMsg("Could not get oe details (500077).","9999","E") endif
 
	; Specimen details
	if(input->specimen.qCollectedDateTime >  0  or input->specimen.qReceivedDateTime > 0)
		call GetSpecimenInfo(null)
	endif
else
	; Validate EncounterTypeCd if it exists and set dEncounterId
	if(input->dEncounterIdTypeCd > 0)
		set iRet = GetCodeSet(input->dEncounterIdTypeCd)
		if(iRet != 319)
			call ErrorMsg("EncounterTypeCd","2045","I")
		else
			; Set EncounterId
			set input->dEncounterId = GetEncntrIdByAlias(input->sEncounterId, input->dEncounterIdTypeCd)
		endif
	else
		; Set EncounterId
		set input->dEncounterId = cnvtreal(input->sEncounterId)
	endif
 
	; Validate unsolicited result data
	;OrderableId
	set iRet = GetCodeSet(input->dOrderableId)
	if(iRet != 200)call ErrorMsg("OrderableId","2045","I") endif
 
	; Validate OrderingProviderType
	if(input->dOrderingProviderTypeCd > 0)
		set iRet = GetCodeSet(input->dOrderingProviderTypeCd)
		if(iRet != 333) call ErrorMsg("OrderingProviderTypeId","2045","I") endif
	endif
 
	; Validate OrderingProviderId
	if(input->dOrderingProviderId > 0)
		set sRet = GetNameFromPrsnlID(input->dOrderingProviderId)
		if(sRet = "") call ErrorMsg("OrderingProviderId","2045","I") endif
	endif
endif
 
; Check privs - 680501 MSVC_CheckPrivileges
set iRet = VerifyPrivs(null)
if(iRet = 0) call ErrorMsg( "User does not have privileges to add result (680501).","9999","E") endif
 
; Verify required parameters exist
if(input->dPatientId = 0) call ErrorMsg("PatientId","2055","M") endif
if(input->dEncounterId = 0) call ErrorMsg("EncounterId","2055","M") endif
if(input->dResultStatusCd = 0) call ErrorMsg("ResultStatusId","2055","M") endif
 
; Validate Patient/Encounter Relationship
set iRet = ValidateEncntrPatientReltn(input->dPatientId,input->dEncounterId)
if(iRet = 0) call ErrorMsg("EncounterId provided is not tied to PatientId provided.","9999","E") endif
 
; Validate ResultGroupComponentId
if(input->dGroupComponentCd > 0)
	set iRet = GetCodeSet(input->dGroupComponentCd)
	if(iRet != 72) call ErrorMsg("ResultGroupComponentId","9999","I") endif
else
	call GetDefaultEventCd(null)
endif
 
; Validate ResultStatusId
set iRet = GetCodeSet(input->dResultStatusCd)
if(iRet != 8)
	call ErrorMsg("ResultStatusId","9999","I")
else
	if(input->dResultStatusCd in (c_inerror_status_cd, c_inerrornomut_status_cd,
								c_inerrornoview_status_cd, c_inerror2_status_cd,
								c_inerror2_status_cd, c_altered_status_cd,
								c_modified_status_cd, c_ctranscribe_status_cd,
								c_rejected_status_cd))
		call ErrorMsg("ResultStatusId","9999","I")
	endif
endif
 
; Validate Identifiers
if(size(input->identifiers,5) > 0)
	for(j = 1 to size(input->identifiers,5))
		if(input->identifiers[j].dTypeCd != c_loinc_source_vocabulary_cd) call ErrorMsg("Identifier.TypeId","9999","I") endif
	endfor
endif
 
;Validate Specimen data if provided
; BodySiteId
if(input->specimen.dBodySiteId > 0)
	set iRet = GetCodeSet(input->specimen.dBodySiteId)
	if(iRet != 1028) call ErrorMsg("BodySiteId","9999","I") endif
endif
 
; CollectedByPrsnlId
if(input->specimen.dCollectedByPrsnlId > 0)
	set sRet = GetNameFromPrsnlID(input->specimen.dCollectedByPrsnlId)
	if(sRet = "") call ErrorMsg("CollectedByProviderId","9999","I") endif
endif
 
; ContainerTypeId
if(input->specimen.dContainerTypeId > 0)
	set iRet = GetCodeSet(input->specimen.dContainerTypeId)
	if(iRet != 2051) call ErrorMsg("ContainerTypeId","9999","I") endif
endif
 
; SourceTypeId
if(input->specimen.dSourceTypeId > 0)
	set iRet = GetCodeSet(input->specimen.dSourceTypeId)
	if(iRet != 2052) call ErrorMsg("SourceId","9999","I") endif
endif
 
; Validate Result group data
for(i = 1 to groupSize)
	; Validate ComponentId
	set iRet = GetCodeSet(input->result_group[i].dComponentId)
	if(iRet != 72) call ErrorMsg("ComponentId","9999","I") endif
	; Validate NormalcyCd exists if high/low values exist
	if(input->result_group[i].sNormalHigh > " " or input->result_group[i].sNormalLow > " ")
		if(input->result_group[i].dNormalcyCd = 0) call ErrorMsg("Normalcy","9999","M") endif
	endif
	; Validate NormalcyCd
	if(input->result_group[i].dNormalcyCd > 0)
		set iRet = GetCodeSet(input->result_group[i].dNormalcyCd)
		if(iRet != 52) call ErrorMsg("Normalcy","9999","I") endif
	endif
	; Performing LabId
	if(input->result_group[i].dPerformingLabId > 0)
		set iRet = ValidateLabLocation(input->result_group[i].dPerformingLabId)
		if(iRet = 0) call ErrorMsg("PerformingLabId","9999","I") endif
	endif
	; StatusId
	set iRet = GetCodeSet(input->result_group[i].dStatusCd)
	if(iRet != 8) call ErrorMsg("StatusId","9999","I") endif
	; UnitId
	if(input->result_group[i].dUnitCd > 0)
		set iRet = GetCodeSet(input->result_group[i].dUnitCd)
		if(iRet != 54) call ErrorMsg("ComponentId","9999","I") endif
	endif
	; Identifiers
	if(identSize > 0)
		for(j = 1 to identSize)
			if(input->result_group[i].identifiers[j].dTypeCd != c_loinc_source_vocabulary_cd)
				call ErrorMsg("Identifier.TypeId","9999","I")
			endif
		endfor
	endif
endfor
 
; Get DTA code - 600484 wv_get_template_labels
set iRet = GetTaskAssay(null)
if(iRet = 0) call ErrorMsg("Could not get DTA info (600484).","9999","E") endif
 
; Get DTA details - 600356 dcp_get_dta_info_all
set iRet = GetDtaInfo(null)
if(iRet = 0) call ErrorMsg("Could not get DTA details (600356).","9999","E") endif
 
; Validate data entry
set iRet = ValidateDataEntry(null)
 
; Get normalcy information
call GetNormalcyInfo(null)
 
; Get Encounter Timezone
set iRet = GetTimezone(null)
if(iRet = 0) call ErrorMsg("Could not get encounter timezone (100190).","9999","E") endif
 
; Post Lab Result
call PostLabResult(null)
 
; Update Notes
if(iTotalCommentCnt > 1)
	set iRet = UpdateNotes(null)
	if(iRet = 0) call ErrorMsg("Could not update result notes (1000042).","9999","E") endif
endif
 
; Update Order status - 560201 - ORM.OrderWriteSynch
if(input->dOrderId > 0)
	if(input->dOrderStatusCd != 500439_rep->order_status_cd)
		set iRet = UpdateOrderStatus(null)
		if(iRet = 0) call ErrorMsg("Could not update order (560201).","9999","E") endif
	endif
endif
 
; Update LOINC information to nomenclature table if provided
if(identSize > 0 or size(input->identifiers,5) > 0)
	call UpdateLoinc(null)
endif
 
; Update audit to success
call ErrorHandler2(c_error_handler, "S", "Success", "Lab result posted successfully",
"0000","Lab result posted successfully", labresult_reply_out)
 
#EXIT_SCRIPT
call echorecord(input)
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(labresult_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(labresult_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_labresult.json")
	call echo(build2("_file : ", _file))
	call echojson(labresult_reply_out, _file, 0)
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
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ErrorMsg Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), labresult_reply_out)
			go to exit_script
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), labresult_reply_out)
			go to exit_script
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, labresult_reply_out)
			go to exit_script
	endcase
 
	if(iDebugFlag > 0)
		call echo(concat("ErrorMsg Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyPrivs(null) = i2
;  Description:  Verify user has privileges to add observation
**************************************************************************/
subroutine VerifyPrivs(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get personnel relationship to patient
	declare dPrsnlRelCd = f8
	select into "nl:"
	from encntr_prsnl_reltn epr
	where epr.encntr_id = input->dEncounterId
		and epr.prsnl_person_id = dPrsnlId
	detail
		dPrsnlRelCd = epr.encntr_prsnl_r_cd
	with nocounter
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
 	set iRequest = 680501
 
 	; Setup request
	set 680501_req->user_id = dPrsnlId
	set 680501_req->patient_user_relationship_cd = dPrsnlRelCd
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = input->dGroupComponentCd
	set 680501_req->event_privileges->event_code_level.add_documentation_ind = 1
 
	; Execute request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
 
	set iValidate = 680501_rep->event_privileges->add_documentation.status.success_ind
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderInfo(null) = i2 -- 500439 - ord_srv_get_order_rec
;  Description:  Gets order information
**************************************************************************/
subroutine GetOrderInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 967100
	set iTask = 967100
 	set iRequest = 500439
 
 	;Setup request
 	set 500439_req->order_id = input->dOrderId
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500439_req,"REC",500439_rep)
 
	if(500439_rep->status_data.status = "S")
		set iValidate = 1
		set input->dEncounterId = 500439_rep->encntr_id
		set input->dOrderableId = 500439_rep->catalog_cd
 
		;Get event_cd tied to catalog_cd
		select into "nl:"
		from code_value_event_r cver
		where cver.parent_cd = 500439_rep->catalog_cd
		detail
			input->dGroupComponentCd = cver.event_cd
		with nocounter
 
		;Get Ordering ProviderId
		select into "nl:"
		from order_action oa
		where oa.order_id = input->dOrderId
		and oa.action_sequence = 1
		detail
			input->dOrderingProviderId = oa.order_provider_id
		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOeDetails(null) = i2 -- 500077 - orm_get_modify_details
;  Description:  Gets order entry details
**************************************************************************/
subroutine GetOeDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOeDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
 	set iRequest = 500077
 
 	;Setup request
 	set stat = alterlist(500077_req->order_qual,1)
 	set 500077_req->order_qual[1].order_id = input->dOrderId
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500077_req,"REC",500077_rep)
 
	if(500077_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOeDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDefaultEventCd(null) = null
;  Description:  Get default lab event cd if not provided
**************************************************************************/
subroutine GetDefaultEventCd(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDefaultEventCd Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Check if Orderable has an event_cd link
	select into "nl:"
	from code_value_event_r cr
	where cr.parent_cd = input->dOrderableId
	detail
		input->dGroupComponentCd = cr.event_cd
	with nocounter
 
	; Get default generic lab event_cd if not tied to orderable
	if(input->dGroupComponentCd = 0)
		select into "nl:"
		from code_value_event_r cr
		plan cr where cr.parent_cd = c_lab_contributor_source_cd
		detail
			input->dGroupComponentCd = cr.event_cd
		with nocounter
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("GetDefaultEventCd Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetSpecimenInfo(null) = null
;  Description:  Get specimen info
**************************************************************************/
subroutine GetSpecimenInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSpecimenInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from order_serv_res_container oc
		, container c
		, v500_specimen vs
	plan oc where oc.order_id = input->dOrderId
	join c where c.container_id = oc.container_id
	join vs where vs.specimen_id = c.specimen_id
	detail
		if(input->specimen.qCollectedDateTime = 0)
			if(vs.drawn_dt_tm > 0)
				input->specimen.qCollectedDateTime = vs.drawn_dt_tm
			else
				input->specimen.qCollectedDateTime = vs.creation_dt_tm
			endif
		endif
 
		if(input->specimen.qReceivedDateTime = 0)
			input->specimen.qReceivedDateTime = cnvtdatetime(curdate,curtime3)
		endif
 
		if(input->specimen.dBodySiteId = 0)
			input->specimen.dBodySiteId = vs.body_site_cd
		endif
 
		if(input->specimen.dContainerTypeId = 0)
			input->specimen.dContainerTypeId = c.spec_cntnr_cd
		endif
 
		if(input->specimen.dSourceTypeId = 0)
			input->specimen.dSourceTypeId = vs.specimen_type_cd
		endif
 
		input->specimen.spec_details.container_id = c.container_id
		input->specimen.spec_details.specimen_id = c.specimen_id
	with nocounter
 
 	if(iDebugFlag > 0)
		call echo(concat("GetSpecimenInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateLabLocation(labId = f8) = i2
;  Description:  Validates the lab location provided
**************************************************************************/
subroutine ValidateLabLocation(labId)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateLabLocation Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from service_resource sr
	where sr.discipline_type_cd = c_lab_discipline_type_cd
		and sr.service_resource_cd = labId
		and sr.active_ind = 1
		and sr.location_cd > 0
	detail
		iValidate = 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateLabLocation Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
/*************************************************************************
;  Name: GetTaskAssay(null) = i2
;  Description:  Gets the task_assay_cd for the provided component_id(event_cd)
**************************************************************************/
subroutine GetTaskAssay(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskAssay Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	; Group Component Task Assay
 	select into "nl:"
	from  code_value_event_r cver
		, code_value cv
	plan cver where cver.event_cd = input->dGroupComponentCd
	join cv where cv.code_value = cver.parent_cd
		and cv.code_set = 14003
		and cv.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and cv.active_ind = 1
	detail
		input->details.task_assay_cd = cver.parent_cd
	with nocounter
 
 	; Result group task assays
	select into "nl:"
	from (dummyt d with seq = size(input->result_group,5))
		, code_value_event_r cver
		, code_value cv
	plan d
	join cver where cver.event_cd = input->result_group[d.seq].dComponentId
	join cv where cv.code_value = cver.parent_cd
		and cv.code_set = 14003
		and cv.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and cv.active_ind = 1
	detail
		iValidate = 1
		input->result_group[d.seq].details.task_assay_cd = cver.parent_cd
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskAssay Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDtaInfo(null) = i2
;  Description:  Gets the DTA details - reference range, value type(string, num, date), etc
**************************************************************************/
subroutine GetDtaInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDtaInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 600701
 	set iRequest = 600356
 
	; Setup request
	set x = 0
	for(i = 1 to size(input->result_group,5))
		set stat = initrec(600356_req)
		set stat = initrec(600356_rep)
		if(input->result_group[i].details.task_assay_cd > 0)
			set stat = alterlist(600356_req->dta,1)
			set 600356_req->dta[1].task_assay_cd = input->result_group[i].details.task_assay_cd
		else
			call ErrorMsg("ComponentId","9999","I")
		endif
 
		; Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
 		; Update data if successful
		if(600356_rep->status_data.status = "S")
			set iValidate = 1
 
	 		set input->result_group[i].details.result_type_cd = 600356_rep->dta[1].default_result_type_cd
			set input->result_group[i].details.version_number = 600356_rep->dta[1].version_number
			set input->result_group[i].details.io_type_flag =  600356_rep->dta[1].io_flag
 
			; Get DTA map info
			select into "nl:"
			from (dummyt d with seq = size(600356_rep->dta[1].data_map,5))
			plan d
			order by 600356_rep->dta[1].data_map[d.seq].service_resource_cd
			head report
				x = 0
			detail
				if(600356_rep->dta[1].data_map[d.seq].service_resource_cd = 0 or
				   600356_rep->dta[1].data_map[d.seq].service_resource_cd = input->result_group[i].dPerformingLabId)
					if(x >= 600356_rep->dta[1].data_map[d.seq].service_resource_cd)
						x = 600356_rep->dta[1].data_map[d.seq].service_resource_cd
						input->result_group[i].details.max_digits = 600356_rep->dta[1].data_map[d.seq].max_digits
						input->result_group[i].details.min_digits = 600356_rep->dta[1].data_map[d.seq].min_digits
						input->result_group[i].details.min_decimal_places = 600356_rep->dta[1].data_map[d.seq].min_decimal_places
					endif
				endif
			with nocounter
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetDtaInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateDataEntry(null) = null
;  Description:  Validate user entry with DTA constraints
**************************************************************************/
subroutine ValidateDataEntry(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateDataEntry Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare result_type = vc
	for(i = 1 to size(input->result_group,5))
		set result_type = uar_get_code_display(input->result_group[i].details.result_type_cd)
		case(result_type)
			of value("Numeric","Count"):
				set input->result_group[i].details.event_class_cd = uar_get_code_by("MEANING",53,"NUM")
				set input->result_group[i].details.string_result_check = 1
				set input->result_group[i].details.string_result_format_cd = uar_get_code_by("MEANING",14113,"NUMERIC")
				set zero_test = replace(replace(input->result_group[i].sResultValue,".",""),"0","")
				set real_test = cnvtreal(input->result_group[i].sResultValue)
 
				; Verify the string is 0 or a valid number
				if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
					set precision = input->result_group[i].details.min_decimal_places
					set max_digits = input->result_group[i].details.max_digits
					set min_digits = input->result_group[i].details.min_digits
 
					; Verify number of digits match constraints
					set digitCheck = textlen(trim(replace(input->result_group[i].sResultValue,".",""),3))
					if(min_digits > 0)
						if(digitCheck < min_digits)
							call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
							build2("This component id requires a minimum of ",min_digits," digits."),
							"9999", build2("This component id requires a minimum of ",min_digits," digits."),
							labresult_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
 
					if(max_digits > 0)
						if(digitCheck > max_digits)
							call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
							build2("This component id only allows a max of ",max_digits," digits."),
							"9999", build2("This component id only allows a max of ",max_digits," digits."),
							labresult_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
 
					; Verify precision matches constraints
					set pos = findstring(".",input->result_group[i].sResultValue,1)
 
					if(precision > 0)
						if(pos > 0)
							set postDecimal = textlen(trim(substring(pos + 1,textlen(input->result_group[i].sResultValue),
							input->result_group[i].sResultValue),3))
							if(postDecimal > precision)
								call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
								build2("This component id only allows a decimal precision of ",precision,"."),
								"9999", build2("This component id only allows a decimal precision of ",precision,"."),
								labresult_reply_out)
								go to EXIT_SCRIPT
							endif
						endif
					else
						if(pos > 0)
							call ErrorHandler2(c_error_handler, "F", "Invalid Entry", build2("This component id only allows integers."),
							"9999", build2("This component id only allows integers."), labresult_reply_out)
							go to EXIT_SCRIPT
						endif
					endif
				else
					call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
					build2("This component Id is a numeric field. Please enter a number"),
					"9999", build2("This component Id is a numeric field. Please enter a number"),
					labresult_reply_out)
					go to EXIT_SCRIPT
				endif
 
				; Set final variable with entered value
				set input->result_group[i].sFinalResultVal = input->result_group[i].sResultValue
 
			of value("Multi-alpha and Freetext","Alpha and Freetext"):
				set input->result_group[i].sFinalResultVal = build2("Other: ",input->result_group[i].sResultValue)
				set input->result_group[i].details.event_class_cd = uar_get_code_by("MEANING",53,"TXT")
				set input->result_group[i].details.string_result_check = 1
				set input->result_group[i].details.string_result_format_cd = uar_get_code_by("MEANING",14113,"ALPHA")
 
			of value("Text","Freetext"):
				set input->result_group[i].sFinalResultVal = input->result_group[i].sResultValue
				set input->result_group[i].details.event_class_cd = uar_get_code_by("MEANING",53,"TXT")
				set input->result_group[i].details.string_result_check = 1
				set input->result_group[i].details.string_result_format_cd = uar_get_code_by("MEANING",14113,"ALPHA")
 
			of value("Date and Time","Date","Time"):
				set UTC = curutc
				set input->result_group[i].details.event_class_cd = uar_get_code_by("MEANING",53,"DATE")
				set input->result_group[i].details.date_result_check = 1
				declare date = vc
				declare time = vc
 
				/* Date Type Flag
				0.00	Date and Time
				1.00	Date only
				2.00	Time only	*/
 
				if(result_type = "Time")
					set input->result_group[i].details.date_type_flag = 2
					set timeCheck = ValidateTimeFormat(input->result_group[i].sResultValue)
					set time = trim(input->result_group[i].sResultValue,3)
					if(timeCheck)
						if(UTC)
							set input->result_group[i].qFinalResultValDttm = cnvtdatetimeUTC(cnvtdatetime(curdate,cnvtint(time)))
						else
							set input->result_group[i].qFinalResultValDttm = cnvtdatetime(curdate,cnvtint(time))
						endif
					else
						call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
						build2("This component Id is a time field and requires 24-hour format HHMM."),
						"9999", build2("This component Id is a time field and requires 24-hour format HHMM."),
						labresult_reply_out)
						go to EXIT_SCRIPT
					endif
				elseif(result_type = "Date")
					set input->result_group[i].details.date_type_flag = 1
					set date = trim(replace(input->result_group[i].sResultValue,"/",""),3)
					if(cnvtdate(date))
						if(UTC)
							set input->result_group[i].qFinalResultValDttm = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),curtime3))
						else
							set input->result_group[i].qFinalResultValDttm = cnvtdatetime(cnvtdate(date),curtime3)
						endif
					else
						call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
						build2("This component Id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
						"9999", build2("This component Id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
						labresult_reply_out)
						go to EXIT_SCRIPT
					endif
				else
					set input->result_group[i].details.date_type_flag = 0
					set formatCheck = 0
					set checkSpace = findstring(" ",input->result_group[i].sResultValue)
					set date = substring(1,checkSpace,input->result_group[i].sResultValue)
					set date = trim(replace(date,"/",""),3)
					set time = trim(substring(checkSpace + 1,textlen(input->result_group[i].sResultValue),input->result_group[i].sResultValue),3)
					set time = trim(replace(time,":",""),3)
					set dateCheck = cnvtdate(date)
					set timeCheck = ValidateTimeFormat(time)
 
					if(dateCheck > 0 and timeCheck > 0)
						if(UTC)
							set input->result_group[i].qFinalResultValDttm = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
						else
							set input->result_group[i].qFinalResultValDttm = cnvtdatetime(cnvtdate(date),cnvtint(time))
						endif
					else
						call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
						build2("This component Id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
						" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
						"9999", build2("This component Id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
						" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
						labresult_reply_out)
						go to EXIT_SCRIPT
					endif
				endif
			else
				call ErrorHandler2(c_error_handler, "F", "Invalid Field",
				build2("This component Id is not eligible to be added or updated. ComponentId: ",input->result_group[i].dComponentId,
				"  The field type is:  ",result_type),
				"9999", build2("This component Id is not eligible to be added or updated. ComponentId: ",input->result_group[i].dComponentId,
				"  The field type is:  ",result_type),
				labresult_reply_out)
				go to EXIT_SCRIPT
		endcase
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateDataEntry Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateTimeFormat(time) = i2
;  Description:  Validate user entry with DTA constraints
**************************************************************************/
subroutine ValidateTimeFormat(origTime)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateTimeFormat Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iValidate = i2
	declare zero_test = vc
	declare newTime = vc
	declare real_test = i4
 
	set zero_test = trim(replace(replace(origTime,".",""),"0",""),3)
	set newTime = trim(replace(origTime,":",""),3)
	set real_test = cnvtreal(newTime)
 
	if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
		if(textlen(newTime) = 4 and real_test >= 0 and real_test < 2400)
			set iValidate = 1
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateTimeFormat Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNormalcyInfo(null) = null
;  Description:  Get normalcy data based on age and gender
**************************************************************************/
subroutine GetNormalcyInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNormalcyInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare sex_cd = f8
	declare dob = dq8
	declare ageInMin = i4
	declare dResValue = f8
	declare index = i4
 
	for(z = 1 to size(input->result_group,5))
		set dResValue = cnvtreal(input->result_group[z].sResultValue)
 
		select into "nl:"
		from person p
		where p.person_id = input->dPatientId
		detail
			sex_cd = p.sex_cd
			dob = p.birth_dt_tm
		with nocounter
 
		set ageInMin = datetimediff(cnvtdatetime(curdate,curtime3),dob,4)
 
		select into "nl:"
		from (dummyt d with seq = size(600356_rep,5))
		plan d where 600356_rep->dta[d.seq].task_assay_cd = input->result_group[z].details.task_assay_cd
		detail
			index = d.seq
		with nocounter
 
		if(size(600356_rep->dta[index].ref_range_factor,5) > 0)
			for(i = 1 to size(600356_rep->dta[index].ref_range_factor,5))
				if(600356_rep->dta[index].ref_range_factor[i].sex_cd = 0 or
				  (600356_rep->dta[index].ref_range_factor[i].sex_cd > 0 and
				   600356_rep->dta[index].ref_range_factor[i].sex_cd = sex_cd))
 
					if(ageInMin >= 600356_rep->dta[index].ref_range_factor[i].age_from_minutes and
					   ageInMin <= 600356_rep->dta[index].ref_range_factor[i].age_to_minutes)
 
 						if(600356_rep->dta[index].ref_range_factor[i].review_ind)
					   		set input->result_group[z].details.review_high = 600356_rep->dta[index].ref_range_factor[i].review_high
							set input->result_group[z].details.review_low = 600356_rep->dta[index].ref_range_factor[i].review_low
						endif
 
						if(600356_rep->dta[index].ref_range_factor[i].sensitive_ind)
					  		set input->result_group[z].details.sensitive_high = 600356_rep->dta[index].ref_range_factor[i].sensitive_high
					  		set input->result_group[z].details.sensitive_low = 600356_rep->dta[index].ref_range_factor[i].sensitive_low
					  	endif
 
					  	if(600356_rep->dta[index].ref_range_factor[i].normal_ind)
					   		set input->result_group[z].details.normal_high = 600356_rep->dta[index].ref_range_factor[i].normal_high
							set input->result_group[z].details.normal_low = 600356_rep->dta[index].ref_range_factor[i].normal_low
						endif
 
						if(600356_rep->dta[index].ref_range_factor[i].critical_ind)
							set input->result_group[z].details.critical_high = 600356_rep->dta[index].ref_range_factor[i].critical_high
							set input->result_group[z].details.critical_low = 600356_rep->dta[index].ref_range_factor[i].critical_low
						endif
 
						if(600356_rep->dta[index].ref_range_factor[i].feasible_ind)
							set input->result_group[z].details.feasible_high = 600356_rep->dta[index].ref_range_factor[i].feasible_high
							set input->result_group[z].details.feasible_low = 600356_rep->dta[index].ref_range_factor[i].feasible_low
						endif
 
						set input->result_group[z].details.results_units_cd = 600356_rep->dta[index].ref_range_factor[i].units_cd
 
					  	; Reject value if outside the feasible range
					  	if( 600356_rep->dta[index].ref_range_factor[i].feasible_ind > 0)
							if(dResValue < feasible_low or dResValue > feasible_high)
								call ErrorHandler2(c_error_handler, "F", "Invalid Entry",
								build2("This field has a feasible range of ",feasible_low, " - ", feasible_high),
								"9999", build2("This field has a feasible range of ",feasible_low, " - ", feasible_high),
								labresult_reply_out)
								go to EXIT_SCRIPT
							endif
						endif
 
						case(600356_rep->dta[index].ref_range_factor[i].normal_ind)
							of 1: ;Normal low value exists
								if(dResValue <= input->result_group[z].details.normal_low)
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"LOW")
								else
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"NORMAL")
								endif
							of 2: ;Normal high value exists
								if(dResValue >= input->result_group[z].details.normal_high)
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"HIGH")
								else
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"NORMAL")
								endif
							of 3: ;Normal low and high values exist
								if(dResValue <= input->result_group[z].details.normal_low)
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"LOW")
								elseif(dResValue >= input->result_group[z].details.normal_high)
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"HIGH")
								else
									set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"NORMAL")
								endif
							else
								set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"NORMAL")
						endcase
 
						if(input->result_group[z].details.normalcy_cd != uar_get_code_by("MEANING",52,"NORMAL"))
							case(600356_rep->dta[index].ref_range_factor[i].critical_ind)
								of 1: ;Critical low value exists
									if(dResValue <= input->result_group[z].details.critical_low)
										set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMELOW")
									endif
								of 2: ;Critical high value exists
									if(dResValue >= input->result_group[z].details.critical_high)
										set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
									endif
								of 3: ;Critical low and high values exist
									if(dResValue <= input->result_group[z].details.critical_low)
										set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMELOW")
									elseif(dResValue >= input->result_group[z].details.critical_high)
										set input->result_group[z].details.normalcy_cd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
									endif
							endcase
						endif
					endif
				endif
			endfor
		endif
 	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetNormalcyInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetTimezone(null) = i2
;  Description:  Retrieves the timezone for the encounter
**************************************************************************/
subroutine GetTimezone(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTimezone Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iAPPLICATION = 600005
	set iTASK = 600701
 	set iREQUEST = 100190
 
 	; Setup request
	set stat = alterlist(100190_req->encntrs,1)
	set 100190_req->encntrs[1].encntr_id = input->dEncounterId
 
 	; Execute request
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100190_req,"REC",100190_rep)
 
 	if(100190_rep->status_data->status = "S")
 		set iValidate = 1
		set iEncntrTimeZone = 100190_rep->encntrs[1].time_zone_indx
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTimezone Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostLabResult(null) = null
;  Description: Post the lab result to clinical_event table
**************************************************************************/
subroutine PostLabResult(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostLabResult Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare error_msg = vc
 	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare crmstatus = i2
 
	set error_msg = "None"
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 1000012
 
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ))
			call uar_crmendapp (happ )
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, labresult_reply_out)
			go to exit_script
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
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, labresult_reply_out)
			go to exit_script
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep)
			set stat = uar_srvsetshort(hrequest,"ensure_type",2)
			set hce = uar_srvgetstruct (hrequest ,"clin_event")
 
			; Clinical Event
			if(hce)
				set stat = uar_srvsetlong (hce ,"view_level" ,0 )
				set stat = uar_srvsetdouble (hce ,"order_id" ,input->dOrderId )
				set stat = uar_srvsetdouble (hce ,"catalog_cd" , input->dOrderableId)
				set stat = uar_srvsetdouble (hce ,"person_id" ,input->dPatientId )
				set stat = uar_srvsetdouble (hce ,"encntr_id" ,input->dEncounterId )
				set stat = uar_srvsetstring(hce,"accession_nbr",nullterm(input->sAccessionNumber))
				set stat = uar_srvsetdouble (hce ,"contributor_system_cd" ,input->dSystemId )
				if(input->sReferenceNumber > " ")
					set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(input->sReferenceNumber))
				endif
				set stat = uar_srvsetdouble (hce ,"event_class_cd",c_grp_event_class_cd)
				set stat = uar_srvsetdouble (hce ,"event_cd" ,input->dGroupComponentCd )
				if(input->details.task_assay_cd > 0)
					set stat = uar_srvsetstring(hce, "event_tag",nullterm(uar_get_code_description(input->details.task_assay_cd)))
				else
					set stat = uar_srvsetstring(hce, "event_tag",nullterm(uar_get_code_description(input->dOrderableId)))
				endif
				set stat = uar_srvsetdouble(hce, "event_reltn_cd",c_root_event_reltn_cd)
				set stat = uar_srvsetdate (hce ,"event_start_dt_tm",cnvtdatetime(input->qResultDateTime))
				set stat = uar_srvsetdate (hce ,"event_end_dt_tm",cnvtdatetime(input->qResultDateTime))
				set stat = uar_srvsetdouble (hce ,"record_status_cd",c_active_rec_status_cd )
				set stat = uar_srvsetdouble (hce ,"result_status_cd", input->dResultStatusCd )
				set stat = uar_srvsetshort (hce ,"authentic_flag",1 )
				set stat = uar_srvsetshort (hce ,"publish_flag",1 )
				set stat = uar_srvsetdouble (hce ,"inquire_security_cd",dConfidentialCd)
 				set stat = uar_srvsetdouble (hce,"updt_id",dPrsnlId)
				set stat = uar_srvsetdouble (hce ,"entry_mode_cd",c_undefined_entry_mode_cd)
				set stat = uar_srvsetdouble (hce ,"source_cd",input->dSourceId)
				set stat = uar_srvsetshort (hce ,"event_start_tz",iTimeZone)
				set stat = uar_srvsetshort (hce ,"event_end_tz",iTimeZone)
				set stat = uar_srvsetshort (hce ,"verified_tz",iTimeZone)
				set stat = uar_srvsetshort (hce ,"performed_tz",iTimeZone)
				set stat = uar_srvsetshort (hce ,"replacement_event_id",1)
				set stat = uar_srvsetdouble(hce,"updt_id",dPrsnlId)
 
				; Child Event
				set hce_type = uar_srvcreatetypefrom (hrequest ,"clin_event" )
				set hce_struct = uar_srvgetstruct (hrequest ,"clin_event" )
				set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
 
				for(i = 1 to size(input->result_group,5))
					set hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
					if(hce2)
						call uar_srvbinditemtype(hce2,"child_event_list",hce_type)
						set stat = uar_srvsetlong(hce2,"view_level",1 )
						set stat = uar_srvsetdouble(hce2,"order_id",input->dOrderId )
						set stat = uar_srvsetdouble(hce2,"catalog_cd",input->dOrderableId)
						set stat = uar_srvsetdouble(hce2,"person_id",input->dPatientId )
						set stat = uar_srvsetdouble(hce2,"encntr_id",input->dEncounterId )
						set stat = uar_srvsetstring(hce2,"accession_nbr",nullterm(input->sAccessionNumber))
						set stat = uar_srvsetdouble(hce2,"contributor_system_cd",input->dSystemId )
						if(input->sReferenceNumber > " ")
							set stat = uar_srvsetstring(hce2,"reference_nbr",nullterm(build(input->sReferenceNumber,"0000.",i)))
						endif
						set stat = uar_srvsetdouble(hce2,"event_class_cd" ,input->result_group[i].details.event_class_cd)
						set stat = uar_srvsetdouble(hce2,"event_cd" ,input->result_group[i].dComponentId )
						set stat = uar_srvsetdouble(hce2,"event_reltn_cd",c_child_event_reltn_cd)
						set stat = uar_srvsetdate(hce2,"event_start_dt_tm" ,cnvtdatetime(input->result_group[i].qResultDateTime))
						set stat = uar_srvsetdate(hce2,"event_end_dt_tm" ,cnvtdatetime(input->result_group[i].qResultDateTime))
						set stat = uar_srvsetdouble(hce2,"task_assay_cd" ,input->result_group[i].details.task_assay_cd )
						set stat = uar_srvsetdouble(hce2,"record_status_cd" ,c_active_rec_status_cd )
						set stat = uar_srvsetdouble(hce2,"result_status_cd" , input->result_group[i].dStatusCd )
						set stat = uar_srvsetshort(hce2,"authentic_flag" ,1 )
						set stat = uar_srvsetshort(hce2,"publish_flag" ,1 )
						set stat = uar_srvsetdouble(hce2,"updt_id",dPrsnlId)
 						set stat = uar_srvsetdouble(hce2,"inquire_security_cd",dConfidentialCd)
						set stat = uar_srvsetdouble(hce2,"resource_cd",input->result_group[i].dPerformingLabId)
						set stat = uar_srvsetdouble(hce2,"result_units_cd",input->result_group[i].dUnitCd)
		 				set stat = uar_srvsetdouble(hce2,"updt_id",dPrsnlId)
						set stat = uar_srvsetdouble(hce2,"entry_mode_cd",c_undefined_entry_mode_cd)
						set stat = uar_srvsetdouble(hce2,"source_cd",input->dSourceId)
						set stat = uar_srvsetshort(hce2,"event_start_tz",iTimeZone)
						set stat = uar_srvsetshort(hce2,"event_end_tz",iTimeZone)
						set stat = uar_srvsetshort(hce2,"verified_tz",iTimeZone)
						set stat = uar_srvsetshort(hce2,"performed_tz",iTimeZone)
						set stat = uar_srvsetshort(hce2,"replacement_event_id",1)
						set stat = uar_srvsetdouble(hce2,"task_assay_version_nbr",input->result_group[i].details.version_number)
 
						if(input->result_group[i].dNormalcyCd > 0)
							set stat = uar_srvsetdouble(hce2,"normalcy_cd",input->result_group[i].dNormalcyCd)
						else
							set stat = uar_srvsetdouble(hce2,"normalcy_cd",input->result_group[i].details.normalcy_cd)
						endif
 
						if(input->result_group[i].sNormalHigh > " ")
							set stat = uar_srvsetstring(hce2,"normal_high",nullterm(input->result_group[i].sNormalHigh))
						else
							set stat = uar_srvsetstring(hce2,"normal_high",
								nullterm(cnvtstring(input->result_group[i].details.normal_high)))
						endif
 
						if(input->result_group[i].sNormalLow > " ")
							set stat = uar_srvsetstring(hce2,"normal_low",nullterm(input->result_group[i].sNormalLow))
						else
							set stat = uar_srvsetstring(hce2,"normal_low",
								nullterm(cnvtstring(input->result_group[i].details.normal_low)))
						endif
 
 						if(input->result_group[i].details.critical_ind)
							set stat = uar_srvsetstring(hce2,"critical_high",
								nullterm(cnvtstring(input->result_group[i].details.critical_high)))
							set stat = uar_srvsetstring(hce2,"critical_low",
								nullterm(cnvtstring(input->result_group[i].details.critical_low)))
						endif
 
						; Specimen Collection
						if(input->specimen.qCollectedDateTime > 0 or input->specimen.qReceivedDateTime > 0)
							set spec = uar_srvadditem(hce2,"specimen_coll")
							if(spec)
								set stat = uar_srvsetdouble(spec,"specimen_id",input->specimen.spec_details.specimen_id)
								set stat = uar_srvsetdouble(spec,"container_id",input->specimen.spec_details.container_id)
								set stat = uar_srvsetdouble(spec,"container_type_cd",input->specimen.dContainerTypeId)
								set stat = uar_srvsetdate(spec,"collect_dt_tm",cnvtdatetime(input->specimen.qCollectedDateTime))
								set stat = uar_srvsetdouble(spec,"collect_prsnl_id",input->specimen.dCollectedByPrsnlId)
								set stat = uar_srvsetdouble(spec,"source_type_cd",input->specimen.dSourceTypeId)
								set stat = uar_srvsetdouble(spec,"body_site_cd",input->specimen.dBodySiteId)
								set stat = uar_srvsetdate(spec,"recvd_dt_tm",cnvtdatetime(input->specimen.qReceivedDateTime))
							endif
 
							;Assignment Method Code
							set aml = uar_srvadditem(hce2,"assignment_method_list")
							if(aml)
								set stat = uar_srvsetdouble(aml,"assignment_method_code",c_tms_assignment_method_cd)
							endif
						endif
 
						; Text based results including numeric results
						if(input->result_group[i].details.string_result_check)
							set hstring = uar_srvadditem (hce2 ,"string_result" )
							if(hstring)
								set stat = uar_srvsetstring (hstring ,"string_result_text",input->result_group[i].sFinalResultVal)
								set stat = uar_srvsetdouble (hstring ,"string_result_format_cd",input->result_group[i].details.string_result_format_cd)
								set stat = uar_srvsetdouble (hstring ,"unit_of_measure_cd",input->result_group[i].dUnitCd)
							endif
						endif
 
					 	; Date based results
						if(input->result_group[i].details.date_result_check)
							set hdate = uar_srvadditem (hce2 ,"date_result" )
							if(hdate)
								set stat = uar_srvsetdate(hdate ,"result_dt_tm",cnvtdatetime(input->result_group[i].qFinalResultValDttm))
								set stat = uar_srvsetshort(hdate ,"date_type_flag",input->result_group[i].details.date_type_flag)
							endif
						endif
 
						; Additional section for IO results
						if(input->result_group[i].details.io_type_flag)
							set hio = uar_srvadditem (hce2 ,"intake_output_result" )
							if(hio)
								set stat = uar_srvsetdate (hio ,"io_start_dt_tm" ,cnvtdatetime(input->result_group[i].qResultDateTime))
								set stat = uar_srvsetdate (hio ,"io_end_dt_tm" ,cnvtdatetime(input->result_group[i].qResultDateTime))
								set stat = uar_srvsetshort(hio ,"io_type_flag", input->result_group[i].details.io_type_flag)
								set stat = uar_srvsetdouble(hio,"io_volume",cnvtreal(input->result_group[i].sFinalResultVal))
								set stat = uar_srvsetdouble(hio,"io_status_cd",c_confirmed_io_status_cd)
								set stat = uar_srvsetdouble(hio,"reference_event_cd",input->result_group[i].dComponentId)
							endif
						endif
 
 						;Event_Note_List - Add comments if only 1 total exist. If more exist, UpdateNotes will be used
 						if(iTotalCommentCnt = 1)
	 						if(input->result_group[i].sNotes > " ")
								set henote = uar_srvadditem(hce2,"event_note_list")
								if(henote)
									set stat = uar_srvsetdouble(henote,"note_type_cd",c_rescomment_note_type_cd)
									set stat = uar_srvsetdouble(henote,"note_format_cd",c_ah_note_format_cd)
									set stat = uar_srvsetdouble(henote,"entry_method_cd",c_unknown_entry_method_cd)
									set stat = uar_srvsetdouble(henote,"note_prsnl_id",dPrsnlId)
									set stat = uar_srvsetdate(henote,"note_dt_tm",cnvtdatetime(input->result_group[i].qResultDateTime))
									set stat = uar_srvsetdouble(henote,"record_status_cd",c_active_rec_status_cd)
									set stat = uar_srvsetdouble(henote,"compression_cd",c_nocomp_compression_cd)
									set stat = uar_srvsetasis(henote,"long_blob",nullterm(input->result_group[i].sNotes),
										textlen(input->result_group[i].sNotes))
								else
									set error_msg = "Could not create henote."
									call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, labresult_reply_out)
									go to exit_script
								endif
							endif
						endif
 
						; Event Prsnl
						set epSize = 2
						if(input->result_group[i].dStatusCd = c_auth_status_cd)
							set epSize = epSize + 1
						endif
 
						for(ep = 1 to epSize)
							set hprsnl2 = uar_srvadditem(hce2,"event_prsnl_list")
							if(hprsnl2)
								set stat = uar_srvsetdouble(hprsnl2,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetdate(hprsnl2,"action_dt_tm",cnvtdatetime(input->result_group[i].qResultDateTime))
								case(ep)
									of 1:
										set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_perform_action_type_cd)
										set stat = uar_srvsetlong(hprsnl2,"action_tz",iTimeZone)
										set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",dPrsnlId)
									of 2:
										set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_order_action_type_cd)
										set stat = uar_srvsetlong(hprsnl2,"action_tz",iEncntrTimeZone)
										set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",input->dOrderingProviderId)
									of 3:
										set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_verify_action_type_cd)
										set stat = uar_srvsetlong(hprsnl2,"action_tz",iTimeZone)
										set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",dPrsnlId)
								endcase
							else
								set error_msg = "Could not create hprsnl2."
								call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, labresult_reply_out)
								go to exit_script
							endif
						endfor
					else
						set error_msg = "Could not create hce2."
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, labresult_reply_out)
						go to exit_script
					endif
				endfor
			else
				set error_msg = "Could not create hce."
				call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, labresult_reply_out)
				go to exit_script
			endif
		endif
 
		; Execute request
		set crmstatus = uar_crmperform (hstep)
		if ((crmstatus = 0 ) )
			set hrep = uar_crmgetreply (hstep )
			if ((hrep > 0 ) )
				;Rb
				set rb_cnt = uar_srvgetitemcount(hrep,"rb_list")
				set x = 0
				if(rb_cnt > 0)
					for(i = 1 to rb_cnt)
						set hrb = uar_srvgetitem(hrep,"rb_list",i-1)
						set parent_id = uar_srvgetdouble(hrb,"parent_event_id")
						set child_id = uar_srvgetdouble(hrb,"event_id")
						set event_cd = uar_srvgetdouble(hrb,"event_cd")
						set result_status_cd = uar_srvgetdouble(hrb,"result_status_cd")
 
						set x = x + 1
						set stat = alterlist(labresult_reply_out->child_results,x)
						set labresult_reply_out->child_results[x].id = child_id
						set stat = alterlist(labresult_reply_out->result_ids,x)
 						set labresult_reply_out->result_ids[x] = child_id
 
						if(parent_id = child_id)
							set labresult_reply_out->parent_result_id = parent_id
						else
							select into "nl:"
							from (dummyt d with seq = size(input->result_group,5))
							plan d where input->result_group[d.seq].dComponentId = event_cd
								and input->result_group[d.seq].dStatusCd = result_status_cd
							detail
								input->result_group[d.seq].event_id = child_id
							with nocounter
						endif
					endfor
				else
					set error_msg = "Rb_list is empty. Could not post lab result."
					call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, labresult_reply_out)
					go to exit_script
				endif
			else
				set error_msg = "Failed to create hreply."
				call ErrorHandler2(c_error_handler, "F","uar_crmgetreply", error_msg,"9999", error_msg, labresult_reply_out)
				go to exit_script
			endif
		else
			set error_msg = "Failed to execute request 1000071."
			call ErrorHandler2(c_error_handler, "F","CRMPERFORM", error_msg,"9999", error_msg, labresult_reply_out)
			go to exit_script
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostLabResult Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: UpdateNotes(null) = i2
;  Description: Add result notes
**************************************************************************/
subroutine UpdateNotes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateNotes Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 1
	set rgSize = size(input->result_group,5)
	set iApplication = 1000042
	set iTask = 1000042
	set iRequest = 1000042
 
	; Setup request
	for(i = 1 to rgSize)
		if(iValidate = 1)
			if(input->result_group[i].sNotes > " ")
				set stat = initrec(1000042_req)
				set stat = initrec(1000042_rep)
				set 1000042_req->ensure_type = 2
				set 1000042_req->event_id = input->result_group[i].event_id
				set 1000042_req->note_type_cd = c_rescomment_note_type_cd
				set 1000042_req->note_format_cd = c_ah_note_format_cd
				set 1000042_req->valid_from_dt_tm_ind = 1
				set 1000042_req->entry_method_cd = c_unknown_entry_method_cd
				set 1000042_req->note_prsnl_id = dPrsnlId
				set 1000042_req->note_dt_tm = input->result_group[i].qResultDateTime
				set 1000042_req->record_status_cd = c_active_rec_status_cd
				set 1000042_req->compression_cd = c_nocomp_compression_cd
				set 1000042_req->long_blob = input->result_group[i].sNotes
 
				set stat = tdbexecute(iApplication,iTask,iRequest,"REC",1000042_req,"REC",1000042_rep)
 
				if(1000042_rep->sb.statusCd > 0 or trim(1000042_rep->sb.statusText,3) > " ")
					set iValidate = 0
					if(iDebugFlag > 0)
						call echorecord(1000042_rep)
					endif
				endif
			endif
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateNotes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: UpdateOrderStatus(null) = i2
;  Description: Update order and department status
**************************************************************************/
subroutine UpdateOrderStatus(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateOrderStatus Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 560201
 
	;High level request info
	set 560201_req->personId = input->dPatientId
	set 560201_req->replyInfoFlag = 1
	set stat = alterlist(560201_req->orderList,1)
	set 560201_req->orderList[1].orderId = 500439_rep->order_id
	set 560201_req->orderList[1].orderDtTm = 500439_rep->orig_order_dt_tm
	set 560201_req->orderList[1].oeFormatId = 500439_rep->oe_format_id
	set 560201_req->orderList[1].catalogTypeCd = 500439_rep->catalog_type_cd
	set 560201_req->orderList[1].accessionNbr = input->sAccessionNumber
	set 560201_req->orderList[1].lastUpdtCnt = 500439_rep->updt_cnt
	set 560201_req->orderList[1].catalogCd = 500439_rep->catalog_cd
	set 560201_req->orderList[1].synonymId = 500439_rep->synonym_id
	set 560201_req->orderList[1].orderMnemonic = 500439_rep->order_mnemonic
	set 560201_req->orderList[1].primaryMnemonic = 500439_rep->hna_order_mnemonic
	set 560201_req->orderList[1].activityTypeCd = 500439_rep->activity_type_cd
	set 560201_req->orderList[1].resourceRouteLevel = 1
	set 560201_req->orderList[1].dupCheckingInd = 1
	set 560201_req->orderList[1].dcpClinCatCd = 500439_rep->dcp_clin_cat_cd
	set 560201_req->orderList[1].encntrId = 500439_rep->encntr_id
	set 560201_req->orderList[1].orderedAsMnemonic = 500439_rep->ordered_as_mnemonic
	set 560201_req->orderList[1].lastUpdateActionSequence = 500439_rep->last_action_sequence
	set 560201_req->errorLogOverrideFlag = 1
 
	; Order Catalog Info
	select into "nl:"
	from order_catalog oc
	where oc.catalog_cd = 500439_rep->catalog_cd
	detail
		560201_req->orderList[1].deptDisplayName = oc.dept_display_name
		560201_req->orderList[1].activitySubtypeCd = oc.activity_subtype_cd
	with nocounter
 
	; Ordering Provider
	select into "nl:"
	from order_action oa
	where oa.order_id = input->dOrderId
		and oa.action_sequence = 1
	detail
		560201_req->orderList[1].orderProviderId = oa.order_provider_id
	with nocounter
 
	; OE Details
	select into "nl:"
	from (dummyt d with seq = 500077_rep->qual[1].detqual_cnt)
		,oe_format_fields off
	plan d
	join off where off.action_type_cd = 500077_rep->qual[1].detqual[d.seq].action_cd
		and off.oe_format_id = 500439_rep->oe_format_id
		and off.oe_field_id = 500077_rep->qual[1].detqual[d.seq].oe_field_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(560201_req->orderList[1].detailList,x)
 
		560201_req->orderList[1].detailList[x].oeFieldId = 500077_rep->qual[1].detqual[d.seq].oe_field_id
		560201_req->orderList[1].detailList[x].oeFieldValue = 500077_rep->qual[1].detqual[d.seq].oe_field_value
		560201_req->orderList[1].detailList[x].oeFieldDisplayValue = 500077_rep->qual[1].detqual[d.seq].oe_field_display_value
		560201_req->orderList[1].detailList[x].oeFieldDtTmValue = 500077_rep->qual[1].detqual[d.seq].oe_field_dt_tm_value
		560201_req->orderList[1].detailList[x].oeFieldMeaning = 500077_rep->qual[1].detqual[d.seq].oe_field_meaning
		560201_req->orderList[1].detailList[x].oeFieldMeaningId = 500077_rep->qual[1].detqual[d.seq].oe_field_meaning_id
		560201_req->orderList[1].detailList[x].groupSeq = off.group_seq
		560201_req->orderList[1].detailList[x].fieldSeq = off.field_seq
		560201_req->orderList[1].detailList[x].modifiedInd = 0
	with nocounter
 
	;Status info
	set 560201_req->orderList[1].actionTypeCd = c_statuschange_action_type_cd
	set 560201_req->orderList[1].orderStatusCd = input->dOrderStatusCd
	set 560201_req->orderList[1].deptStatusCd = input->dDeptStatusCd
 
	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560201_req,"REC",560201_rep)
 
 	if(560201_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateOrderStatus Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
/*************************************************************************
;  Name: UpdateLoinc(null) = null
;  Description: Update loinc data on ref_cd_map_header, ref_cd_map_detail, nomenclature details
**************************************************************************/
subroutine UpdateLoinc(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateLoinc Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare topIndex = i4
 	declare rh_detail_id = f8
 	declare now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
 
	free record temp_events
	record temp_events (
		1 list_cnt = i4
		1 list[*]
			2 event_id = f8
			2 event_cd = f8
			2 loinc = vc
			2 top_ind = i2
			2 nom_detail
				3 nomenclature_id = f8
				3 ref_cd_map_header_id = f8
				3 cmti = vc							;nln
				3 concept_cki = vc					;nln
				3 contributor_system_cd = f8 		;nln
				3 disallowed_ind = i2				;nln
				3 language_cd = f8					;nln
				3 mnemonic = vc						;nln
				3 primary_cterm_ind = i2			;nln
				3 primary_vterm_ind = i2			;nln
				3 principle_type_cd = f8			;nln
				3 short_string = vc					;nln
				3 source_identifier = vc			;nln
				3 source_identifier_keycap = vc
				3 source_string = vc				;nln
				3 source_vocabulary_cd = f8			;nln
				3 vocab_axis_cd = f8				;nln
	)
 
	; Get clinical event ids that were just created
	select into "nl:"
	from clinical_event ce
	where ce.parent_event_id = labresult_reply_out->parent_result_id
		and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	order by ce.event_id
	head report
		x = 0
	head ce.event_id
		if(iPanelTestInd > 0)
			x = x + 1
			stat = alterlist(temp_events->list,x)
			temp_events->list[x].event_id = ce.event_id
			temp_events->list[x].event_cd = ce.event_cd
			if(ce.event_id = ce.parent_event_id)
				temp_events->list[x].top_ind = 1
				topIndex = x
			endif
		else
			if(ce.event_id != ce.parent_event_id)
				x = x + 1
				stat = alterlist(temp_events->list,x)
				temp_events->list[x].event_id = ce.event_id
				temp_events->list[x].event_cd = ce.event_cd
			endif
		endif
	foot report
		temp_events->list_cnt = x
	with nocounter
 
	call echorecord(temp_events)
 
 	if(temp_events->list_cnt > 0)
		; Add loinc codes to temp record
		select into "nl:"
		from (dummyt d with seq = temp_events->list_cnt)
			,(dummyt d2 with seq = size(input->result_group,5))
		plan d
		join d2 where input->result_group[d2.seq].dComponentId = temp_events->list[d.seq].event_cd
		detail
			if(temp_events->list[d.seq].top_ind = 1)
				if(size(input->identifiers,5) > 0)
					temp_events->list[d.seq].loinc = input->identifiers[1].sCode
				endif
			else
				if(size(input->result_group[d2.seq].identifiers,5) > 0)
					temp_events->list[d.seq].loinc = input->result_group[d2.seq].identifiers[1].sCode
				endif
			endif
		with nocounter
 
		; Validate if loinc already exists on nomenclature table
		select into "nl:"
		from (dummyt d with seq = temp_events->list_cnt)
			,nomenclature n
		plan d
		join n where n.source_identifier = temp_events->list[d.seq].loinc
			and n.source_vocabulary_cd = c_loinc_source_vocabulary_cd
			and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and n.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		detail
			temp_events->list[d.seq].nom_detail.nomenclature_id = n.nomenclature_id
		with nocounter
 
		; Add nomenclature detail to temp record if loinc isn't on nomenclature table
		select into "nl:"
		from (dummyt d with seq = temp_events->list_cnt)
		, nomenclature_load_ns nln
		plan d where temp_events->list[d.seq].loinc > " "
			and temp_events->list[d.seq].nom_detail.nomenclature_id = 0
		join nln where nln.source_identifier = temp_events->list[d.seq].loinc
		detail
			temp_events->list[d.seq].nom_detail.cmti = nln.cmti
			temp_events->list[d.seq].nom_detail.concept_cki = nln.concept_cki
			temp_events->list[d.seq].nom_detail.contributor_system_cd = nln.contributor_system_cd
			temp_events->list[d.seq].nom_detail.disallowed_ind = nln.disallowed_ind
			temp_events->list[d.seq].nom_detail.language_cd = nln.language_cd
			temp_events->list[d.seq].nom_detail.mnemonic = nln.mnemonic
			temp_events->list[d.seq].nom_detail.primary_cterm_ind = nln.primary_cterm_ind
			temp_events->list[d.seq].nom_detail.primary_vterm_ind = nln.primary_vterm_ind
			temp_events->list[d.seq].nom_detail.principle_type_cd = nln.principle_type_cd
			temp_events->list[d.seq].nom_detail.short_string = nln.short_string
			temp_events->list[d.seq].nom_detail.source_identifier = nln.source_identifier
			temp_events->list[d.seq].nom_detail.source_identifier_keycap = nln.source_identifier
			temp_events->list[d.seq].nom_detail.source_string = nln.source_string
			temp_events->list[d.seq].nom_detail.source_vocabulary_cd = nln.source_vocabulary_cd
			temp_events->list[d.seq].nom_detail.vocab_axis_cd = nln.vocab_axis_cd
		with nocounter
 
		; Loop through inserting nomenclature updates
		for(i = 1 to temp_events->list_cnt)
			if(temp_events->list[i].loinc > " ")
 
	 			if(temp_events->list[i].nom_detail.nomenclature_id = 0)
		 			; Get nomenclature_id and store it
					select into "nl:"
						nid = seq(NOMENCLATURE_SEQ,NEXTVAL)
					from dual
					detail
						 temp_events->list[i].nom_detail.nomenclature_id = nid
					with nocounter
 
					;nomenclature
					insert into nomenclature
					set
						nomenclature_id = temp_events->list[i].nom_detail.nomenclature_id
						,active_ind = 1
						,active_status_cd = c_active_rec_status_cd
						,active_status_dt_tm = cnvtdatetime(now_dt_tm)
						,beg_effective_dt_tm = cnvtdatetime(now_dt_tm)
						,cmti = temp_events->list[i].nom_detail.cmti
						,concept_cki = temp_events->list[i].nom_detail.concept_cki
						,contributor_system_cd = temp_events->list[i].nom_detail.contributor_system_cd
						,data_status_cd = c_auth_status_cd
						,data_status_dt_tm = cnvtdatetime(now_dt_tm)
						,disallowed_ind = temp_events->list[i].nom_detail.disallowed_ind
						,end_effective_dt_tm = cnvtdatetime("31-DEC-2100 23:59:59")
						,language_cd = temp_events->list[i].nom_detail.language_cd
						,mnemonic = temp_events->list[i].nom_detail.mnemonic
						,primary_cterm_ind = temp_events->list[i].nom_detail.primary_cterm_ind
						,primary_vterm_ind = temp_events->list[i].nom_detail.primary_vterm_ind
						,principle_type_cd = temp_events->list[i].nom_detail.principle_type_cd
						,short_string = temp_events->list[i].nom_detail.short_string
						,source_identifier = temp_events->list[i].nom_detail.source_identifier
						,source_identifier_keycap = temp_events->list[i].nom_detail.source_identifier_keycap
						,source_string = temp_events->list[i].nom_detail.source_string
						,source_vocabulary_cd = temp_events->list[i].nom_detail.source_vocabulary_cd
						,updt_dt_tm = cnvtdatetime(now_dt_tm)
						,updt_id = reqinfo->updt_id
						,updt_applctx = reqinfo->updt_applctx
						,updt_task = reqinfo->updt_task
						,vocab_axis_cd = temp_events->list[i].nom_detail.vocab_axis_cd
					with nocounter
					commit
				endif
			endif
		endfor
 
		; Loop through and make ref_cd_map_header and ref_cd_map_detail updates
		for(i = 1 to temp_events->list_cnt)
			if(temp_events->list[i].loinc > " ")
				if(temp_events->list[i].top_ind = 0)
 
					; Get ref_cd_map_header_id and store it
					select into "nl:"
						nid = seq(NOMENCLATURE_SEQ,NEXTVAL)
					from dual
					detail
						temp_events->list[i].nom_detail.ref_cd_map_header_id = nid
					with nocounter
 
					;ref_cd_map_header
					insert into ref_cd_map_header
					set
						ref_cd_map_header_id = temp_events->list[i].nom_detail.ref_cd_map_header_id
						,event_id = temp_events->list[i].event_id
						,person_id = input->dPatientId
						,encntr_id = input->dEncounterId
						,updt_dt_tm = cnvtdatetime(now_dt_tm)
						,updt_id = reqinfo->updt_id
						,updt_applctx = reqinfo->updt_applctx
						,updt_task = reqinfo->updt_task
					with nocounter
					commit
 
	 				; Get ref_cd_map_header_id and store it
					select into "nl:"
						nid = seq(NOMENCLATURE_SEQ,NEXTVAL)
					from dual
					detail
						rh_detail_id = nid
					with nocounter
 
					;ref_cd_map_detail
					insert into ref_cd_map_detail
					set
						assignment_method_cd = c_tms_assignment_method_cd
						,begin_effective_dt_tm = cnvtdatetime(now_dt_tm)
						,end_effective_dt_tm = cnvtdatetime("31-DEC-2100 23:59:59")
						,entity_cd = c_event_entity_cd
						,entity_column_value = temp_events->list[i].event_id
						,nomenclature_id = temp_events->list[i].nom_detail.nomenclature_id
						,parent_ref_cd_map_detail_id = rh_detail_id
						,prev_ref_cd_map_detail_id = rh_detail_id
						,ref_cd_map_detail_id = rh_detail_id
						,ref_cd_map_header_id = temp_events->list[i].nom_detail.ref_cd_map_header_id
						,updt_dt_tm = cnvtdatetime(now_dt_tm)
						,updt_id = reqinfo->updt_id
						,updt_applctx = reqinfo->updt_applctx
						,updt_task = reqinfo->updt_task
					with nocounter
					commit
				endif
 
				if(iPanelTestInd > 0) ;Add grouptest nomenclature id for every component test in ref_cd_map_detail
					; Get ref_cd_map_header_id and store it
					select into "nl:"
						nid = seq(NOMENCLATURE_SEQ,NEXTVAL)
					from dual
					detail
						rh_detail_id = nid
					with nocounter
 
					;ref_cd_map_detail
					insert into ref_cd_map_detail
					set
						assignment_method_cd = c_tms_assignment_method_cd
						,begin_effective_dt_tm = cnvtdatetime(now_dt_tm)
						,end_effective_dt_tm = cnvtdatetime("31-DEC-2100 23:59:59")
						,entity_cd = c_event_entity_cd
						,entity_column_value = temp_events->list[i].event_id
						,nomenclature_id = temp_events->list[topIndex].nom_detail.nomenclature_id
						,parent_ref_cd_map_detail_id = rh_detail_id
						,prev_ref_cd_map_detail_id = rh_detail_id
						,ref_cd_map_detail_id = rh_detail_id
						,ref_cd_map_header_id = temp_events->list[i].nom_detail.ref_cd_map_header_id
						,updt_dt_tm = cnvtdatetime(now_dt_tm)
						,updt_id = reqinfo->updt_id
						,updt_applctx = reqinfo->updt_applctx
						,updt_task = reqinfo->updt_task
					with nocounter
					commit
				endif
			endif
		endfor
	else
		call ErrorHandler2(c_error_handler, "F", "Execute","Could not find event list. Nomenclature update failed.",
		"9999", "Could not find event list. Nomenclature update failed.",
		labresult_reply_out)
		go to EXIT_SCRIPT
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateLoinc Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end go
 
 
