/*~BB~********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

***************************************************************************************
      Source file name: snsro_get_pharm_intervs.prg
      Object name:      vigilanz_get_pharm_intervs
      Program purpose:  Get list of pharmacy interventions based on input constraints
      Tables read:      DCP_FORMS_ACTIVITY, CLINICAL_EVENT, PERSON, ENCOUNTER
      Tables updated:   NONE
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
*********************************************************************************
                    MODIFICATION CONTROL LOG
 ********************************************************************************
 Mod 	Date     	Engineer	Comment
 ------------------------------------------------------------------
  001	12/11/17	RJC			Initial Write
  002	02/20/18	RJC			UDM model changes
  003	03/21/18	RJC			Added version code and copyright block
  004	05/09/18	RJC			Moved GetDateTime function to snsro_common
  005	01/09/19	RJC			Added medication_item_id
  006	03/06/19	RJC			Added parent order id
 *******************************************************************************/
drop program vigilanz_get_pharm_intervs go
create program vigilanz_get_pharm_intervs
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        				;Required
		, "Patient Id:" = 0.0					;Required
		, "Encounter Id" = 0.0					;Optional
		, "From DateTime:" = ""					;Optional - set to beginning of time
		, "To DateTime:" = ""					;Optional - set to end of time
		, "Debug Flag:" = 0						;Optional
 
with OUTDEV, USERNAME, PAT_ID, ENC_ID, FROM_DT, TO_DT, DEBUG_FLAG
 
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
free record temp
record temp(
	1 qual_cnt = i4
	1 qual[*]
		2 dcp_forms_activity_id = f8
		2 dcp_forms_ref_id = f8
		2 description = vc
		2 encntr_id = f8
		2 flags = i4
		2 form_status_cd = f8
		2 beg_activity_dt_tm = dq8
		2 last_activity_dt_tm = dq8
		2 person_id = f8
		2 task_id = f8
		2 form_event_id = f8
		2 form_created_by_prsnl_id = f8
		2 child_events[*]
			3 dcp_input_ref_id = f8
			3 clinical_event_id = f8
			3 event_id = f8
			3 valid_until_dt_tm = dq8
			3 clinsig_updt_dt_tm = dq8
			3 view_level = i4
			3 order_id = f8
			3 catalog_cd = f8
			3 series_ref_nbr = vc
			3 person_id = f8
			3 encntr_id = f8
			3 encntr_financial_id = f8
			3 accession_nbr = vc
			3 contributor_system_cd = f8
			3 reference_nbr = vc
			3 parent_event_id = f8
			3 valid_from_dt_tm = dq8
			3 event_class_cd = f8
			3 event_cd = f8
			3 event_tag = vc
			3 event_reltn_cd = f8
			3 event_start_dt_tm = dq8
			3 event_end_dt_tm = dq8
			3 event_end_dt_tm_os = f8
			3 task_assay_cd = f8
			3 record_status_cd = f8
			3 result_status_cd = f8
			3 authentic_flag = i2
			3 inquire_security_cd = f8
			3 resource_group_cd = f8
			3 resource_cd = f8
			3 event_title_text = vc
			3 collating_seq = vc
			3 result_val = vc
			3 result_units_cd = f8
			3 result_time_units_cd = f8
			3 verified_dt_tm = dq8
			3 verified_prsnl_id = f8
			3 performed_dt_tm = dq8
			3 performed_prsnl_id = f8
			3 expiration_dt_tm = dq8
			3 updt_dt_tm = dq8
			3 updt_id = f8
			3 updt_cnt = i4
			3 coded_result[*]
				4 nomenclature_id = f8
				4 descriptor = vc
		2 orders[*]
			3 order_id = f8
			3 parent_order_id = f8
			3 pharmacy_id = f8
			3 pharmacy_name = vc
			3 catalog_cd = f8
			3 synonym_id = f8
			3 last_update_provider_id = f8
			3 hna_order_mnemonic = vc
			3 ordered_as_mnemonic = vc
			3 order_status_cd = f8
			3 details
			   4 med_order_type_cd = f8
			   4 last_core_action_sequence = i4
			   4 catalog_cd = f8
			   4 orig_order_dt_tm = dq8
			   4 orig_order_tz = i4
			   4 action_list [* ]
			     5 action_sequence = i4
			     5 action_type_cd = f8
			     5 communication_type_cd = f8
			     5 order_provider_id = f8
			     5 action_personnel_id = f8
			     5 effective_dt_tm = dq8
			     5 action_dt_tm = dq8
			     5 needs_verify_flag = i2
			     5 action_rejected_ind = i2
			     5 updt_task = f8
			     5 effective_tz = i4
			     5 action_tz = i4
			     5 order_dt_tm = dq8
			     5 order_tz = i4
			     5 ingred_list [* ]
			       6 comp_sequence = i4
			       6 catalog_cd = f8
			       6 synonym_id = f8
			       6 order_mnemonic = vc
			       6 ordered_as_mnemonic = vc
			       6 ordered_as_synonym_id = f8
			       6 hna_order_mnemonic = vc
			       6 strength = f8
			       6 strength_unit = f8
			       6 volume = f8
			       6 volume_unit = f8
			       6 freetext_dose = vc
			       6 freq_cd = f8
			       6 multum_id = vc
			       6 rx_mask = i2
			       6 generic_name = vc
			       6 orderable_type_flag = i2
			       6 clinically_significant_flag = i2
			       6 include_in_total_volume_flag = i2
			       6 ordered_dose = f8
			       6 ordered_dose_unit = f8
			       6 oe_format_id = f8
			       6 real_rx_mask = i4
			       6 catalog_description = vc
			       6 catalog_type_cd = f8
			       6 alt_sel_category_id = f8
			       6 synonym_mnemonic = vc
			       6 dose_calc_long_text_id = f8
			       6 ingred_source_flag = i4
			       6 dose_adjustment_display = c100
			       6 product_list [* ]
			         7 item_id = f8
			         7 order_sentence_id = f8
			         7 dose_quantity = f8
			         7 dose_quantity_unit_cd = f8
			         7 tnf_id = f8
			         7 product_seq = i4
			         7 order_alert1_cd = f8
			         7 order_alert2_cd = f8
			         7 tnf_shell_item_id = f8
			         7 tnf_cost = f8
			         7 tnf_description = vc
			         7 tnf_ndc = vc
			         7 tnf_pkg_qty_per_pkg = f8
			         7 tnf_pkg_disp_more_ind = i2
			         7 on_admin_ind = i2
			         7 unrounded_dose_qty = f8
			         7 strength_with_overfill = f8
			         7 strength_with_overfill_unit_cd = f8
			         7 volume_with_overfill = f8
			         7 volume_with_overfill_unit_cd = f8
			         7 dose_quantity_text = c150
			         7 product_dose_list [* ]
			           8 order_product_dose_id = f8
			           8 item_id = f8
			           8 ingred_sequence = i4
			           8 tnf_id = f8
			           8 schedule_sequence = i2
			           8 dose_quantity = f8
			           8 dose_quantity_unit_cd = f8
			           8 unrounded_dose_quantity = f8
			         7 catalog_cd = f8
			         7 catalog_description = vc
			       6 normalized_rate = f8
			       6 normalized_rate_unit_cd = f8
			       6 concentration = f8
			       6 concentration_unit_cd = f8
			       6 thera_sub_flag = i4
			       6 dosing_capacity = i4
			       6 days_of_administration_display = c100
			       6 ingred_dose_list [* ]
			         7 order_ingred_dose_id = f8
			         7 ingred_sequence = i4
			         7 dose_sequence = i2
			         7 schedule_sequence = i2
			         7 strength_dose_value = f8
			         7 strength_dose_display = c100
			         7 strength_dose_unit_cd = f8
			         7 volume_dose_value = f8
			         7 volume_dose_display = c100
			         7 volume_dose_unit_cd = f8
			         7 ordered_dose_value = f8
			         7 ordered_dose_display = c100
			         7 ordered_dose_unit_cd = f8
			         7 ordered_dose_type_flag = i4
			       6 catalog_active_ind = i2
			     5 action_qualifier_cd = f8
			     5 contributor_system_cd = f8
			     5 decision_source_flag = i2
			     5 decision_value_flag = i2
			     5 decision_reason_cd = f8
			     5 override_on_verify_ind = i2
			     5 deciding_prsnl_id = f8
			     5 order_schedule_precision_bit = i4
			     5 order_status_cd = f8
			     5 source_dot_order_id = f8
			     5 source_dot_action_seq = i4
			     5 source_protocol_action_seq = i4
			     5 ordered_dose_type_flag = i4
			     5 supervising_provider_id = f8
			     5 order_status_reason_bit = i4
			   4 status_data
			     5 status = c1
			     5 subeventstatus [1 ]
			       6 operationname = c25
			       6 operationstatus = c1
			       6 targetobjectname = c25
			       6 targetobjectvalue = vc
)
 
;Request 600373 - dcp_get_dcp_form
free record 600373_req
record 600373_req (
	1 dcp_forms_ref_id = f8
	1 version_dt_tm = dq8
)
 
free record 600373_rep
record 600373_rep (
	1 dcp_forms_ref_id = f8
	1 dcp_form_instance_id = f8
   1 description = vc
   1 definition = vc
   1 task_assay_cd = f8
   1 task_assay_disp = vc
   1 event_cd = f8
   1 event_cd_disp = vc
   1 done_charting_ind = i2
   1 active_ind = i2
   1 height = i4
   1 width = i4
   1 flags = i4
   1 beg_effective_dt_tm = dq8
   1 end_effective_dt_tm = dq8
   1 updt_cnt = i4
   1 sect_cnt = i2
   1 text_rendition_event_cd = f8
   1 sect_list [* ]
     2 dcp_forms_def_id = f8
     2 section_seq = i4
     2 dcp_section_ref_id = f8
     2 dcp_section_instance_id = f8
     2 description = vc
     2 definition = vc
     2 flags = i4
     2 width = i4
     2 height = i4
     2 task_assay_cd = f8
     2 task_assay_disp = vc
     2 event_cd = f8
     2 event_disp = vc
     2 active_ind = i2
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 updt_cnt = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
   1 event_set_name = vc
)
 
;Request 600471 - dcp_get_section_input_runtime
free record 600471_req
record 600471_req (
  1 dcp_section_ref_id = f8
  1 dcp_section_instance_id = f8
  1 cki = vc
)
 
free record 600471_rep
record 600471_rep (
	1 dcp_section_instance_id = f8
    1 dcp_section_ref_id = f8
    1 description = vc
    1 definition = vc
    1 task_assay_cd = f8
    1 task_assay_disp = vc
    1 event_cd = f8
    1 event_disp = vc
    1 active_ind = i2
    1 beg_effective_dt_tm = dq8
    1 end_effective_dt_tm = dq8
    1 updt_cnt = i4
    1 input_cnt = i2
    1 input_list [* ]
      2 dcp_input_ref_id = f8
      2 input_ref_seq = i4
      2 description = vc
      2 module = vc
      2 input_type = i4
      2 updt_cnt = i4
      2 nv_cnt = i2
      2 nv [* ]
        3 pvc_name = vc
        3 pvc_value = vc
        3 merge_id = f8
        3 sequence = i4
    1 cki = vc
    1 width = i4
    1 height = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;Request 600356 - dcp_get_dta_info_all
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
 
;Request 380043 - rx_get_order_action
free record 380043_req
record 380043_req (
  1 order_id = f8
  1 get_all_ind = i2
  1 get_review_decision_ind = i2
  1 on_admin_ind = i2
)
 
free record 380043_rep
record 380043_rep (
   1 med_order_type_cd = f8
   1 last_core_action_sequence = i4
   1 catalog_cd = f8
   1 orig_order_dt_tm = dq8
   1 orig_order_tz = i4
   1 action_list [* ]
     2 action_sequence = i4
     2 action_type_cd = f8
     2 communication_type_cd = f8
     2 order_provider_id = f8
     2 action_personnel_id = f8
     2 effective_dt_tm = dq8
     2 action_dt_tm = dq8
     2 needs_verify_flag = i2
     2 action_rejected_ind = i2
     2 updt_task = f8
     2 effective_tz = i4
     2 action_tz = i4
     2 order_dt_tm = dq8
     2 order_tz = i4
     2 ingred_list [* ]
       3 comp_sequence = i4
       3 catalog_cd = f8
       3 synonym_id = f8
       3 order_mnemonic = vc
       3 ordered_as_mnemonic = vc
       3 ordered_as_synonym_id = f8
       3 hna_order_mnemonic = vc
       3 strength = f8
       3 strength_unit = f8
       3 volume = f8
       3 volume_unit = f8
       3 freetext_dose = vc
       3 freq_cd = f8
       3 multum_id = vc
       3 rx_mask = i2
       3 generic_name = vc
       3 orderable_type_flag = i2
       3 clinically_significant_flag = i2
       3 include_in_total_volume_flag = i2
       3 ordered_dose = f8
       3 ordered_dose_unit = f8
       3 oe_format_id = f8
       3 real_rx_mask = i4
       3 catalog_description = vc
       3 catalog_type_cd = f8
       3 alt_sel_category_id = f8
       3 synonym_mnemonic = vc
       3 dose_calc_long_text_id = f8
       3 ingred_source_flag = i4
       3 dose_adjustment_display = c100
       3 product_list [* ]
         4 item_id = f8
         4 order_sentence_id = f8
         4 dose_quantity = f8
         4 dose_quantity_unit_cd = f8
         4 tnf_id = f8
         4 product_seq = i4
         4 order_alert1_cd = f8
         4 order_alert2_cd = f8
         4 tnf_shell_item_id = f8
         4 tnf_cost = f8
         4 tnf_description = vc
         4 tnf_ndc = vc
         4 tnf_pkg_qty_per_pkg = f8
         4 tnf_pkg_disp_more_ind = i2
         4 on_admin_ind = i2
         4 unrounded_dose_qty = f8
         4 strength_with_overfill = f8
         4 strength_with_overfill_unit_cd = f8
         4 volume_with_overfill = f8
         4 volume_with_overfill_unit_cd = f8
         4 dose_quantity_text = c150
         4 product_dose_list [* ]
           5 order_product_dose_id = f8
           5 item_id = f8
           5 ingred_sequence = i4
           5 tnf_id = f8
           5 schedule_sequence = i2
           5 dose_quantity = f8
           5 dose_quantity_unit_cd = f8
           5 unrounded_dose_quantity = f8
         4 catalog_cd = f8
         4 catalog_description = vc
       3 normalized_rate = f8
       3 normalized_rate_unit_cd = f8
       3 concentration = f8
       3 concentration_unit_cd = f8
       3 thera_sub_flag = i4
       3 dosing_capacity = i4
       3 days_of_administration_display = c100
       3 ingred_dose_list [* ]
         4 order_ingred_dose_id = f8
         4 ingred_sequence = i4
         4 dose_sequence = i2
         4 schedule_sequence = i2
         4 strength_dose_value = f8
         4 strength_dose_display = c100
         4 strength_dose_unit_cd = f8
         4 volume_dose_value = f8
         4 volume_dose_display = c100
         4 volume_dose_unit_cd = f8
         4 ordered_dose_value = f8
         4 ordered_dose_display = c100
         4 ordered_dose_unit_cd = f8
         4 ordered_dose_type_flag = i4
       3 catalog_active_ind = i2
     2 action_qualifier_cd = f8
     2 contributor_system_cd = f8
     2 decision_source_flag = i2
     2 decision_value_flag = i2
     2 decision_reason_cd = f8
     2 override_on_verify_ind = i2
     2 deciding_prsnl_id = f8
     2 order_schedule_precision_bit = i4
     2 order_status_cd = f8
     2 source_dot_order_id = f8
     2 source_dot_action_seq = i4
     2 source_protocol_action_seq = i4
     2 ordered_dose_type_flag = i4
     2 supervising_provider_id = f8
     2 order_status_reason_bit = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;Request 380003 - rx_get_item
free record 380003_req
record 380003_req (
  1 care_locn_cd = f8
  1 pharm_type_cd = f8
  1 facility_loc_cd = f8
  1 qual [*]
    2 item_id = f8
  1 get_orc_info_ind = i2
  1 get_comment_text_ind = i2
  1 get_ord_sent_info_ind = i2
  1 def_dispense_category_cd = f8
  1 encounter_type_cd = f8
  1 parent_item_id = f8
  1 options_pref = i4
  1 birthdate = dq8
  1 financial_class_cd = f8
)
 
free record 380003_rep
record 380003_rep (
  1 qual [* ]
     2 item_id = f8
     2 form_cd = f8
     2 dispense_category_cd = f8
     2 alternate_dispense_category_cd = f8
     2 order_sentence_id = f8
     2 med_type_flag = i2
     2 med_filter_ind = i2
     2 intermittent_filter_ind = i2
     2 continuous_filter_ind = i2
     2 floorstock_ind = i2
     2 always_dispense_from_flag = i2
     2 oe_format_flag = i2
     2 strength = f8
     2 strength_unit_cd = f8
     2 volume = f8
     2 volume_unit_cd = f8
     2 used_as_base_ind = i2
     2 divisible_ind = i2
     2 base_issue_factor = f8
     2 prn_reason_cd = f8
     2 infinite_div_ind = i2
     2 reusable_ind = i2
     2 alert_qual [* ]
       3 order_alert_cd = f8
     2 order_alert1_cd = f8
     2 order_alert2_cd = f8
     2 comment1_id = f8
     2 comment1_type = i4
     2 comment2_id = f8
     2 comment2_type = i4
     2 comment1 = vc
     2 comment2 = vc
     2 given_strength = c25
     2 default_par_doses = i4
     2 max_par_supply = i4
     2 cki = vc
     2 multumid = vc
     2 manf_item_id = f8
     2 awp = f8
     2 awp_factor = f8
     2 cost1 = f8
     2 cost2 = f8
     2 dispense_qty = f8
     2 dispense_qty_cd = f8
     2 price_sched_id = f8
     2 ndc = vc
     2 item_description = vc
     2 brand_name = vc
     2 generic_name = vc
     2 manufacturer_cd = f8
     2 manufacturer_disp = c40
     2 manufacturer_desc = c60
     2 primary_manf_item_id = f8
     2 formulary_status_cd = f8
     2 long_description = vc
     2 oeformatid = f8
     2 orderabletypeflag = i2
     2 synonymid = f8
     2 catalogcd = f8
     2 catalogdescription = vc
     2 catalogtypecd = f8
     2 mnemonicstr = vc
     2 primarymnemonic = vc
     2 altselcatid = f8
     2 qual [* ]
       3 sequence = i4
       3 oe_field_value = f8
       3 oe_field_id = f8
       3 oe_field_display_value = vc
       3 oe_field_meaning_id = f8
       3 field_type_flag = i2
     2 med_oe_defaults_id = f8
     2 med_oe_strength = f8
     2 med_oe_strength_unit_cd = f8
     2 med_oe_volume = f8
     2 med_oe_volume_unit_cd = f8
     2 legal_status_cd = f8
     2 freetext_dose = vc
     2 frequency_cd = f8
     2 route_cd = f8
     2 prn_ind = i2
     2 infuse_over = f8
     2 infuse_over_cd = f8
     2 duration = f8
     2 duration_unit_cd = f8
     2 stop_type_cd = f8
     2 nbr_labels = i4
     2 ord_as_synonym_id = f8
     2 rx_qty = f8
     2 daw_cd = f8
     2 sig_codes = vc
     2 dispense_factor = f8
     2 base_pkg_type_id = f8
     2 base_pkg_qty = f8
     2 base_pkg_uom_cd = f8
     2 pkg_qty_per_pkg = f8
     2 pkg_disp_more_ind = i2
     2 medproductqual [* ]
       3 active_ind = i2
       3 med_product_id = f8
       3 manf_item_id = f8
       3 inner_pkg_type_id = f8
       3 inner_pkg_qty = f8
       3 inner_pkg_uom_cd = f8
       3 bio_equiv_ind = i2
       3 brand_ind = i2
       3 unit_dose_ind = i2
       3 manufacturer_cd = f8
       3 manufacturer_name = vc
       3 label_description = vc
       3 ndc = vc
       3 sequence = i2
       3 awp = f8
       3 awp_factor = f8
       3 formulary_status_cd = f8
       3 item_master_id = f8
       3 base_pkg_type_id = f8
       3 base_pkg_qty = f8
       3 base_pkg_uom_cd = f8
     2 active_ind = i2
     2 dispcat_flex_ind = i4
     2 pricesch_flex_ind = i4
     2 workflow_cd = f8
     2 cmpd_qty = f8
     2 warning_labels [* ]
       3 label_nbr = i4
       3 label_seq = i2
       3 label_text = vc
       3 label_default_print = i2
       3 label_exception_ind = i2
     2 tpn_balance_method_cd = f8
     2 tpn_chloride_pct = f8
     2 tpn_default_ingred_item_id = f8
     2 tpn_fill_method_cd = f8
     2 tpn_include_ions_flag = i2
     2 tpn_overfill_amt = f8
     2 tpn_overfill_unit_cd = f8
     2 tpn_preferred_cation_cd = f8
     2 tpn_product_type_flag = i2
     2 lot_tracking_ind = i2
     2 rate = f8
     2 rate_cd = f8
     2 normalized_rate = f8
     2 normalized_rate_cd = f8
     2 freetext_rate = vc
     2 ord_detail_opts [* ]
       3 facility_cd = f8
       3 age_range_id = f8
       3 oe_field_meaning_id = f8
       3 restrict_ind = i4
       3 opt_list [* ]
         4 opt_txt = vc
         4 opt_cd = f8
         4 opt_nbr = f8
         4 default_ind = i4
         4 display_seq = i4
     2 catalog_cki = vc
     2 awp_unchanged = f8
     2 skip_dispense_flag = i2
     2 waste_charge_ind = i2
     2 cms_waste_billing_unit_amt = f8
     2 cms_waste_billing_unit_uom_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
; Final Reply
free record intervention_reply_out
record intervention_reply_out(
	1 interventions[*]
		2 intervention_id       = f8
		2 intervention_name		= vc
		2 types
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 subtypes
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 status
			3 id = f8
			3 name = vc
		2 significance
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 response
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 outcomes
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 time_spent
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 value
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 additional_details[*]
			3 field
				4 id = f8
				4 name = vc
			3 coded_values[*]
				4 id = f8
				4 name = vc
			3 text_values = vc
		2 created_by
			3 provider_id = f8
			3 provider_name = vc
		2 pharmacy
			3 pharmacy_id = f8
			3 pharmacy_name = vc
		2 associated_users[*]
			3 user
				4 provider_id = f8
				4 provider_name = vc
			3 role
				4 id = f8
				4 name = vc
		2 linked_orders[*]
			3 orders
				4 medication_order_id = f8
				4 medication_id = f8
				4 medication_item_id = f8
				4 medication_name = vc
				4 medication_order_status
					5 id = f8
					5 name = vc
				4 medication_ordering_provider
					5 provider_id = f8
					5 provider_name = vc
				4 ndc = vc
				4 rxnorms[*]
					5 code = f8
					5 code_type = vc
					5 term_type = vc
				4 ingredients[*]
					5 ahfs = vc
					5 ingredient_id = f8
					5 ingredient_name = vc
					5 ingredient_rxnorms[*]
						6 code = f8
						6 code_type = vc
						6 term_type = vc
					5 ndc = vc
					5 dose = f8
					5 dose_unit
						6 id = f8
						6 name = vc
				4 parent_order_id = f8
			3 link_type
				4 id = f8
				4 name = vc
		2 scoring_system
			3 scoring_system_id = f8
			3 scoring_system_name = vc
		2 documentation = gvc
		2 notes = gvc
		2 created_date_time = dq8
		2 closed_date_time = dq8
		2 audits[*]
			3 types
				4 id = f8
				4 name = vc
			3 subtype
				4 id = f8
				4 name = vc
			3 status
				4 id = f8
				4 name = vc
			3 significance
				4 id = f8
				4 name = vc
			3 value
				4 id = f8
				4 name = vc
			3 response
				4 id = f8
				4 name = vc
			3 outcomes[*]
				4 id = f8
				4 name = vc
			3 time_spent
				4 id = f8
				4 name = vc
			3 user
				4 provider_id = f8
				4 provider_name = vc
			3 order_ids = vc
			3 audit_date_time = dq8
		2 patient
			3 person_id = f8
			3 name_full_formatted = vc
			3 name_last = vc
			3 name_first = vc
			3 name_middle = vc
			3 mrn = vc
			3 dob = dq8
			3 gender
				4 id = f8
				4 name = vc
		2 encounter
			3 encounter_id = f8
			3 encounter_type
				4 id = f8
				4 name = vc
			3 encounter_class
				4 id = f8
				4 name = vc
			3 arrive_date = dq8
			3 discharge_date	= dq8
			3 fin_nbr = vc
			3 patient_location
				4 location_cd = f8
				4 location_disp  = vc
				4 loc_bed_cd  = f8
				4 loc_bed_disp = vc
				4 loc_building_cd = f8
				4 loc_building_disp = vc
				4 loc_facility_cd = f8
				4 loc_facility_disp  = vc
				4 loc_nurse_unit_cd = f8
				4 loc_nurse_unit_disp = vc
				4 loc_room_cd = f8
				4 loc_room_disp = vc
				4 loc_temp_cd  = f8
				4 loc_temp_disp = vc
		2 created_updated_dttm = dq8
	1 audit
		2 user_id             = f8
		2 user_firstname          = vc
		2 user_lastname           = vc
		2 patient_id            = f8
		2 patient_firstname         = vc
		2 patient_lastname          = vc
		2 service_version         = vc
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
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName			= vc with protect, noconstant("")
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dEncounterId		= f8 with protect, noconstant(0.0)
declare sFromDateTime		= vc with protect, noconstant("")
declare sToDateTime			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
; Other
declare qFromDateTime		= dq8 with protect, noconstant(0)
declare qToDateTime			= dq8 with protect, noconstant(0)
declare UTCpos 				= i2 with protect, noconstant(0)
 
; Constants
declare UTCmode				= i2 with protect, constant(CURUTC)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetInterventionsList(null)		= i2 with protect
declare GetDcpFormData(dcp_form_ref_id = f8) = i2	with protect ;Request 600373 - dcp_get_dcp_form
declare GetDcpSectionInput(null)		= i2 with protect	;Request 600471 - dcp_get_section_input_runtime
declare GetDtaInfo(null)				= i2 with protect	;Request 600356 - dcp_get_dta_info_all
declare GetEventDetails(index = i4)		= i2 with protect
declare GetOrderDetails(index = i4)		= i2 with protect ;Request 380043 - rx_get_order_action
declare GetItemDetails(index = i4)		= i2 with protect ;Request 380003 - rx_get_item
declare PostAmble(index = i4)			= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName							= trim($USERNAME, 3)
set dPatientId							= cnvtreal($PAT_ID)
set dEncounterId						= cnvtreal($ENC_ID)
set sFromDateTime						= trim($FROM_DT,3)
set sToDateTime							= trim($TO_DT,3)
set iDebugFlag							= cnvtreal($DEBUG_FLAG)
 
; Set Time parameters
if(sFromDateTime > " ")
	set qFromDateTime = GetDateTime(sFromDateTime)
else
	set qFromDateTime = GetDateTime("01-JAN-1900 00:00:00")
endif
 
if(sToDateTime > " ")
	set qToDateTime = GetDateTime(sToDateTime)
else
	set qToDateTime = GetDateTime("31-DEC-2100 23:59:59")
endif
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("dEncounterId -> ",dEncounterId))
	call echo(build("sFromDateTime -> ",sFromDateTime))
	call echo(build("sToDateTime -> ",sToDateTime))
	call echo(build("qFromDateTime -> ",format(qFromDateTime,"MM/DD/YY HH:MM;;q")))
	call echo(build("qToDateTime -> ",format(qToDateTime,"MM/DD/YY HH:MM;;q")))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPatientId > 0)
	; Validate username
	set iRet = PopulateAudit(sUserName, dPatientId, intervention_reply_out, sVersion)
	if(iRet = 0)
	  call ErrorHandler2("GET INTERVENTION", "F", "User is invalid", "Invalid User for Audit.",
	  "1001",build("Invalid user: ",sUserName), intervention_reply_out)
	  go to exit_script
	endif
 
	; Validate time parameters
	if(sFromDateTime > " ")
		if(qFromDateTime > qToDateTime)
			call ErrorHandler2("GET INTERVENTION", "F", "Invalid URI parameters", "FromDateTime is greater than ToDateTime",
			"2010",build( "FromDateTime is greater than ToDateTime"), intervention_reply_out)
			go to exit_script
		endif
	endif
 
	; Get Intervention List
	set iRet = GetInterventionsList(null)
	if(iRet = 0)
		call ErrorHandler2("GET INTERVENTION", "S", "Success", "No interventions found.",
		"0000",build( "No interventions found."), intervention_reply_out)
		go to exit_script
	endif
 
	; Loop through intervention list and gather necessary data
	for(i = 1 to temp->qual_cnt)
 
		; Get Powerform layout data - Request 600373 - dcp_get_dcp_form
		set iRet = GetDcpFormData(temp->qual[i].dcp_forms_ref_id)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "Form Data", "Could not retrieve form data.",
		  "9999","Could not retrieve form data.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Get Powerform section data - Request 600471 - dcp_get_section_input_runtime
		set iRet = GetDcpSectionInput(null)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "Section Data", "Could not retrieve section data.",
		  "9999","Could not retrieve section data.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Get Discrete Task Assay info - Request 600356 - dcp_get_dta_info_all
		set iRet = GetDtaInfo(null)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "DTA Info", "Could not retrieve DTA info.",
		  "9999","Could not retrieve DTA info.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Get Clinical Event data
		set iRet = GetEventDetails(i)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "Event Details", "Could not retrieve event details.",
		  "9999","Could not retrieve event details.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Get Order Details - Request 380043 - rx_get_order_action
		set iRet = GetOrderDetails(i)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "Order Details", "Could not retrieve order details.",
		  "9999","Could not retrieve order details.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Get Medication Details - Request 380003 - rx_get_item
		set iRet = GetItemDetails(i)
		if(iRet = 0)
		  call ErrorHandler2("GET INTERVENTION", "F", "Med Details", "Could not retrieve medication details.",
		  "9999","Could not retrieve medication details.", intervention_reply_out)
		  go to exit_script
		endif
 
		; Build final record structure
		call PostAmble(i)
	endfor
else
	 call ErrorHandler2("GET INTERVENTION", "F", "Invalid URI Parameters", "Missing required field: PersonId.",
		  "2003","Missing required field: PersonId.", intervention_reply_out)
		  go to exit_script
endif
 
; Update audit with success
call ErrorHandler2("GET INTERVENTION", "S", "Success", "Operation completed successfully.",
"0000","Operation completed successfully.", intervention_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(intervention_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_pharm_intervns.json")
	  call echo(build2("_file : ", _file))
	  call echojson(intervention_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(intervention_reply_out)
 
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
;  Name: GetInterventionsList(null) = i2
;  Description:  Gets list of interventions based on date parameters
**************************************************************************/
subroutine GetInterventionsList(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInterventionsList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select
		if(dEncounterId = 0)
			from dcp_forms_activity dfa
			, dcp_forms_activity_comp dfac
			plan dfa where dfa.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
								and dfa.person_id = dPatientId
			join dfac where dfac.dcp_forms_activity_id = dfa.dcp_forms_activity_id
								and dfac.component_cd = value(uar_get_code_by("MEANING",18189,"PHARMINTERV"))
			order by dfa.dcp_forms_activity_id
		else
			from dcp_forms_activity dfa
			, dcp_forms_activity_comp dfac
			plan dfa where dfa.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
								and dfa.person_id = dPatientId
								and dfa.encntr_id = dEncounterId
			join dfac where dfac.dcp_forms_activity_id = dfa.dcp_forms_activity_id
								and dfac.component_cd = value(uar_get_code_by("MEANING",18189,"PHARMINTERV"))
			order by dfa.dcp_forms_activity_id
		endif
	head report
		x = 0
	head dfa.dcp_forms_activity_id
		y = 0
		x = x + 1
		stat = alterlist(temp->qual,x)
 
		temp->qual[x].dcp_forms_activity_id = dfa.dcp_forms_activity_id
		temp->qual[x].dcp_forms_ref_id = dfa.dcp_forms_ref_id
		temp->qual[x].description = dfa.description
		temp->qual[x].person_id = dfa.person_id
		temp->qual[x].encntr_id = dfa.encntr_id
		temp->qual[x].task_id = dfa.task_id
		temp->qual[x].beg_activity_dt_tm = dfa.beg_activity_dt_tm
		temp->qual[x].last_activity_dt_tm = dfa.last_activity_dt_tm
		temp->qual[x].flags = dfa.flags
		temp->qual[x].form_status_cd = dfa.form_status_cd
	detail
		if(cnvtupper(dfac.parent_entity_name) = "ORDER")
			y = y + 1
			stat = alterlist(temp->qual[x].orders,y)
 
			temp->qual[x].orders[y].order_id = dfac.parent_entity_id
		endif
 	foot report
 		temp->qual_cnt = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetInterventionsList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(temp->qual_cnt)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDcpFormData(dcp_form_ref_id = f8) = i2 ;Request 600373 - dcp_get_dcp_form
;  Description: Gets the powerform layout data
**************************************************************************/
subroutine GetDcpFormData(dcp_form_ref_id)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDcpFormData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600373
 
	set 600373_req->dcp_forms_ref_id = dcp_form_ref_id
	set 600373_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600373_req,"REC",600373_rep)
 
	if(600373_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetDcpFormData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDcpSectionInput(null)	= i2  ;Request 600471 - dcp_get_section_input_runtime
;  Description: Get powerform section data
**************************************************************************/
subroutine GetDcpSectionInput(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDcpSectionInput Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600471
 
	set 600471_req->dcp_section_ref_id = 600373_rep->sect_list[1].dcp_section_ref_id
	set 600471_req->dcp_section_instance_id = 600373_rep->sect_list[1].dcp_section_instance_id
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600471_req,"REC",600471_rep)
 
	if(600471_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetDcpSectionInput Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDtaInfo(null)	= i2 	;Request 600356 - dcp_get_dta_info_all
;  Description: Get Discrete Task Assay data
**************************************************************************/
subroutine GetDtaInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDtaInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
	set dtaCnt = 0
	for(x = 1 to size(600471_rep->input_list,5))
		for(y = 1 to 600471_rep->input_list[x].nv_cnt)
			if(600471_rep->input_list[x].nv[y].pvc_name = "discrete_task_assay")
				set dtaCnt = dtaCnt + 1
				set stat = alterlist(600356_req->dta,dtaCnt)
				set 600356_req->dta[dtaCnt].task_assay_cd = 600471_rep->input_list[x].nv[y].merge_id
			endif
		endfor
	endfor
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetDtaInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetEventDetails(index = i4) = i2
;  Description: Get the clinical event data for the powerform
**************************************************************************/
subroutine GetEventDetails(index)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEventDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select distinct into "nl:"
	from task_activity ta
		, clinical_event form
		, clinical_event section
		, clinical_event child
		, (left join ce_coded_result ccr on ccr.event_id = child.event_id
				and ccr.valid_until_dt_tm > sysdate)
	where ta.task_id = temp->qual[index].task_id
	and form.event_id = ta.event_id
	and section.parent_event_id = form.event_id
	and child.parent_event_id = section.event_id
		and child.view_level > 0
		and child.event_reltn_cd = value(uar_get_code_by("MEANING",24,"CHILD"))
	order by child.event_id
	head report
		x = 0
	head child.event_id
		x = x + 1
		y = 0
		stat = alterlist(temp->qual[index].child_events,x)
 
		temp->qual[index].form_event_id = ta.event_id
		temp->qual[index].form_created_by_prsnl_id = form.performed_prsnl_id
 
		temp->qual[index].child_events[x].clinical_event_id = child.clinical_event_id
		temp->qual[index].child_events[x].event_id = child.event_id
		temp->qual[index].child_events[x].event_cd = child.event_cd
		temp->qual[index].child_events[x].order_id = child.order_id
		temp->qual[index].child_events[x].clinsig_updt_dt_tm = child.clinsig_updt_dt_tm
		temp->qual[index].child_events[x].catalog_cd = child.catalog_cd
		temp->qual[index].child_events[x].collating_seq = child.collating_seq
		temp->qual[index].child_events[x].encntr_id = child.encntr_id
		temp->qual[index].child_events[x].event_class_cd = child.event_class_cd
		temp->qual[index].child_events[x].event_end_dt_tm = child.event_end_dt_tm
		temp->qual[index].child_events[x].event_reltn_cd = child.event_reltn_cd
		temp->qual[index].child_events[x].event_start_dt_tm = child.event_start_dt_tm
		temp->qual[index].child_events[x].event_end_dt_tm = child.event_end_dt_tm
		temp->qual[index].child_events[x].event_tag = child.event_tag
		temp->qual[index].child_events[x].event_title_text = child.event_title_text
		temp->qual[index].child_events[x].expiration_dt_tm = child.expiration_dt_tm
		temp->qual[index].child_events[x].parent_event_id = child.parent_event_id
		temp->qual[index].child_events[x].performed_dt_tm = child.performed_dt_tm
		temp->qual[index].child_events[x].performed_prsnl_id = child.performed_prsnl_id
		temp->qual[index].child_events[x].person_id = child.person_id
		temp->qual[index].child_events[x].record_status_cd = child.record_status_cd
		temp->qual[index].child_events[x].result_status_cd = child.result_status_cd
		temp->qual[index].child_events[x].result_time_units_cd = child.result_time_units_cd
		temp->qual[index].child_events[x].result_units_cd = child.result_units_cd
		temp->qual[index].child_events[x].result_val = child.result_val
		temp->qual[index].child_events[x].task_assay_cd = child.task_assay_cd
		temp->qual[index].child_events[x].updt_cnt = child.updt_cnt
		temp->qual[index].child_events[x].updt_dt_tm = child.updt_dt_tm
		temp->qual[index].child_events[x].updt_id = child.updt_id
		temp->qual[index].child_events[x].valid_from_dt_tm = child.valid_from_dt_tm
		temp->qual[index].child_events[x].valid_until_dt_tm = child.valid_until_dt_tm
		temp->qual[index].child_events[x].verified_dt_tm = child.verified_dt_tm
		temp->qual[index].child_events[x].verified_prsnl_id = child.verified_prsnl_id
		temp->qual[index].child_events[x].view_level = child.view_level
	detail
		if(ccr.event_id > 0)
			y = y + 1
			stat = alterlist(temp->qual[index].child_events[x].coded_result,y)
			temp->qual[index].child_events[x].coded_result[y].nomenclature_id = ccr.nomenclature_id
			temp->qual[index].child_events[x].coded_result[y].descriptor = ccr.descriptor
		endif
	foot report
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetEventDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(index = i4)	= i2  ;Request 380043 - rx_get_order_action
;  Description: Gets the order details
**************************************************************************/
subroutine GetOrderDetails(index)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 380000
	set iRequest = 380043
 
	for(x = 1 to size(temp->qual[index].orders,5))
		set 380043_req->order_id = temp->qual[index].orders[x].order_id
		set 380043_req->get_all_ind = 1
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",380043_req,"REC",380043_rep)
 
		if(380043_rep->status_data.status != "F")
			set iValidate  = 1
			set stat = moverec(380043_rep,temp->qual[index].orders[x].details)
		endif
 
		select into "nl:"
		from order_detail od
		plan od where od.order_id = temp->qual[index].orders[x].order_id
				and od.oe_field_meaning = "DISPENSEFROMLOC"
		detail
			temp->qual[index].orders[x].pharmacy_id = od.oe_field_value
			temp->qual[index].orders[x].pharmacy_name = od.oe_field_display_value
		with nocounter
 
		select into "nl:"
		from orders o
		where o.order_id = temp->qual[index].orders[x].order_id
		detail
			temp->qual[index].orders[x].last_update_provider_id = o.last_update_provider_id
			temp->qual[index].orders[x].catalog_cd = o.catalog_cd
			temp->qual[index].orders[x].hna_order_mnemonic = o.hna_order_mnemonic
			temp->qual[index].orders[x].order_status_cd = o.order_status_cd
			temp->qual[index].orders[x].ordered_as_mnemonic = o.ordered_as_mnemonic
			temp->qual[index].orders[x].synonym_id = o.synonym_id
			temp->qual[index].orders[x].parent_order_id = o.template_order_id
		with nocounter
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetItemDetails(null) = i2  ;Request 380003 - rx_get_item
;  Description: Get medication details
**************************************************************************/
subroutine GetItemDetails(index)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetItemDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 380000
	set iRequest = 380003
 
	;set 380003_req->care_locn_cd =
	set 380003_req->pharm_type_cd = uar_get_code_by("MEANING",4500,"INPATIENT")
	;set 380003_req->facility_loc_cd =
	set stat = alterlist(380003_req->qual,size(temp->qual[index].orders,5))
	for(x = 1 to size(temp->qual[index].orders,5))
		set 380003_req->qual[x].item_id = temp->qual[index].orders[x].details.action_list[1].ingred_list[1].product_list[1].item_id
	endfor
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",380003_req,"REC",380003_rep)
 
	if(380003_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetItemDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null)	= null
;  Description: Build final record structure
**************************************************************************/
subroutine PostAmble(index)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	; Temp structure for powerform elements
	free record powerform
	record powerform (
		1 dcp_forms_ref_id = f8
		1 dcp_form_instance_id = f8
		1 description = vc
		1 event_cd = f8
		1 sections[*]
			2 dcp_forms_def_id = f8
			2 section_seq = i4
			2 dcp_section_ref_id = f8
			2 description = vc
			2 definition = vc
			2 inputs[*]
				3 input_ref_id = f8
				3 caption = vc
				3 position = vc
				3 dta_description = vc
				3 dta_cd = f8
				3 required_ind = i2
				3 dta_event_cd = f8
				3 dta_result_type_disp = vc
				3 dta_result_type_cd = f8
				3 alpha_responses[*]
					4 nomenclature_id = f8
					4 source_string = vc
					4 sequence = i4
	)
 
	set powerform->dcp_forms_ref_id = 600373_rep->dcp_forms_ref_id
	set powerform->dcp_form_instance_id = 600373_rep->dcp_form_instance_id
	set powerform->description = 600373_rep->description
	set powerform->event_cd = 600373_rep->event_cd
	set stat = alterlist(powerform->sections,size(600373_rep->sect_list,5))
 
	for(a = 1 to size(600373_rep->sect_list,5))
		set powerform->sections[a].dcp_forms_def_id = 600373_rep->sect_list[a].dcp_forms_def_id
		set powerform->sections[a].dcp_section_ref_id = 600373_rep->sect_list[a].dcp_section_ref_id
		set powerform->sections[a].description = 600373_rep->sect_list[a].description
		set powerform->sections[a].definition = 600373_rep->sect_list[a].definition
		set powerform->sections[a].section_seq = 600373_rep->sect_list[a].section_seq
 
 
		set stat = alterlist(powerform->sections[a].inputs,size(600471_rep->input_list,5))
		for(b = 1 to size(600471_rep->input_list,5))
			for(c = 1 to size(600471_rep->input_list[b].nv,5))
				set powerform->sections[a].inputs[b].input_ref_id = 600471_rep->input_list[b].dcp_input_ref_id
				case(600471_rep->input_list[b].nv[c].pvc_name)
					of "caption":
						set powerform->sections[a].inputs[b].caption = 600471_rep->input_list[b].nv[c].pvc_value
					of "position":
						set powerform->sections[a].inputs[b].position = 600471_rep->input_list[b].nv[c].pvc_value
					of "discrete_task_assay":
						set powerform->sections[a].inputs[b].dta_description = 600471_rep->input_list[b].nv[c].pvc_value
						set powerform->sections[a].inputs[b].dta_cd = 600471_rep->input_list[b].nv[c].merge_id
 
						for(x = 1 to size(600356_rep->dta,5))
							if(600356_rep->dta[x].task_assay_cd = powerform->sections[a].inputs[b].dta_cd)
								set powerform->sections[a].inputs[b].dta_result_type_cd = 600356_rep->dta[x].default_result_type_cd
								set powerform->sections[a].inputs[b].dta_result_type_disp = 600356_rep->dta[x].default_result_type_disp
								set powerform->sections[a].inputs[b].dta_event_cd = 600356_rep->dta[x].event_cd
 
								set alpha_size = size(600356_rep->dta[x].ref_range_factor[1].alpha_responses,5)
 
								if(alpha_size > 0)
									set stat = alterlist(powerform->sections[a].inputs[b].alpha_responses,alpha_size)
 
									for(y = 1 to alpha_size)
										set powerform->sections[a].inputs[b].alpha_responses[y].nomenclature_id =
										600356_rep->dta[x].ref_range_factor[1].alpha_responses[y].nomenclature_id
 
										set powerform->sections[a].inputs[b].alpha_responses[y].source_string =
										600356_rep->dta[x].ref_range_factor[1].alpha_responses[y].source_string
 
										set powerform->sections[a].inputs[b].alpha_responses[y].sequence =
										600356_rep->dta[x].ref_range_factor[1].alpha_responses[y].sequence
									endfor
								endif
							endif
						endfor
 
					of "required":
						if(600471_rep->input_list[b].nv[c].pvc_value = "true")
							set powerform->sections[a].inputs[b].required_ind = 1
						endif
				endcase
			endfor
		endfor
	endfor
 
 
	; Build final reply structure
	set stat = alterlist(intervention_reply_out->interventions,index)
	set intervention_reply_out->interventions[index].intervention_id = temp->qual[index].dcp_forms_activity_id
	set intervention_reply_out->interventions[index].intervention_name = temp->qual[index].description
 
	;Intervention Status
	set intervention_reply_out->interventions[index].status.id = temp->qual[index].form_status_cd
	set intervention_reply_out->interventions[index].status.name = uar_get_code_display(temp->qual[index].form_status_cd)
 
	; Loop through child events
	set addDetailsCnt = 0
	set auditOutcomeCnt = 0
	declare fieldId = f8
	declare fieldDisplay = vc
	declare textResult = vc
 
	select into "nl:"
	from (dummyt d with seq = size(temp->qual[index].child_events,5))
	plan d
	head report
		updt_cnt = 0
	detail
		inputNum = 0
		latestCheck = 0
		updt_cnt = 0
		for(x = 1 to size(powerform->sections,5))
			for(y = 1 to size(powerform->sections[x].inputs,5))
				if(temp->qual[index].child_events[d.seq].event_cd = powerform->sections[x].inputs[y].dta_event_cd)
					temp->qual[index].child_events[d.seq].dcp_input_ref_id = powerform->sections[x].inputs[y].input_ref_id
					dtaDescription = cnvtupper(powerform->sections[x].inputs[y].dta_description)
					if(temp->qual[index].child_events[d.seq].updt_cnt > updt_cnt)
						updt_cnt = temp->qual[index].child_events[d.seq].updt_cnt
						stat = alterlist(intervention_reply_out->interventions[index].audits,updt_cnt)
					endif
				endif
			endfor
		endfor
 
		if(temp->qual[index].child_events[d.seq].valid_until_dt_tm > cnvtdatetime(qToDateTime))
			latestCheck = 1
		endif
 
		fieldId = temp->qual[index].child_events[d.seq].dcp_input_ref_id
		fieldDisplay = uar_get_code_display(temp->qual[index].child_events[d.seq].task_assay_cd)
		textResult = temp->qual[index].child_events[d.seq].result_val
		codedResults = size(temp->qual[index].child_events[d.seq].coded_result,5)
 
		;Intervention Type
		if(dtaDescription like "*TYPE*")
			if(latestCheck)
				intervention_reply_out->interventions[index].types.field.id = fieldId
				intervention_reply_out->interventions[index].types.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].types.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].types.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].types.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].types.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].audits[updt_cnt].types.id = fieldId
	 		intervention_reply_out->interventions[index].audits[updt_cnt].types.name = textResult
 
		;Intervention Sub-Type
		elseif(dtaDescription like "*SUB*TYPE*")
			if(latestCheck)
				intervention_reply_out->interventions[index].subtypes.field.id = fieldId
				intervention_reply_out->interventions[index].subtypes.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].subtypes.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].subtypes.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].subtypes.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].subtypes.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].audits[updt_cnt].subtype.id = fieldId
	 		intervention_reply_out->interventions[index].audits[updt_cnt].subtype.name = textResult
 
		;Intervention Signficance
		elseif(dtaDescription like "*SIGNIFIC*" or dtaDescription like "*IMPORTAN*")
			if(latestCheck)
				intervention_reply_out->interventions[index].significance.field.id = fieldId
				intervention_reply_out->interventions[index].significance.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].significance.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].significance.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].significance.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].significance.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].audits[updt_cnt].significance.id = fieldId
	 		intervention_reply_out->interventions[index].audits[updt_cnt].significance.name = textResult
 
	 	;Intervention Time Spent
		elseif(dtaDescription like "*TIME*")
			if(latestCheck)
				intervention_reply_out->interventions[index].time_spent.field.id = fieldId
				intervention_reply_out->interventions[index].time_spent.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].time_spent.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].time_spent.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].time_spent.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].time_spent.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].time_spent.id = fieldId
	 		intervention_reply_out->interventions[index].time_spent.name = textResult
 
	 	;Intervention Value (Pharmacoeconomic impact)
		elseif(dtaDescription like "*ECONOMIC*" or dtaDescription like "*VALUE*" or dtaDescription like "*MONE*")
			if(latestCheck)
				intervention_reply_out->interventions[index].value.field.id = fieldId
				intervention_reply_out->interventions[index].value.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].value.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].value.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].value.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].value.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].value.id = fieldId
	 		intervention_reply_out->interventions[index].value.name = textResult
 
		;Intervention Response
		elseif(dtaDescription like "*RESPONSE*")
			if(latestCheck)
				intervention_reply_out->interventions[index].response.field.id = fieldId
				intervention_reply_out->interventions[index].response.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].response.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].response.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].response.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].response.text_values = textResult
				endif
			endif
			;Audit
			intervention_reply_out->interventions[index].audits[updt_cnt].response.id = fieldId
	 		intervention_reply_out->interventions[index].audits[updt_cnt].response.name = textResult
 
		;Intervention Outcomes
		elseif(dtaDescription like "*OUTCOME*")
			if(latestCheck)
				intervention_reply_out->interventions[index].outcomes.field.id = fieldId
				intervention_reply_out->interventions[index].outcomes.field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].outcomes.coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].outcomes.coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].outcomes.coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].outcomes.text_values = textResult
				endif
			endif
			;Audit
			auditOutcomeCnt = auditOutcomeCnt + 1
			stat = alterlist(intervention_reply_out->interventions[index].audits[updt_cnt].outcomes,auditOutcomeCnt)
			intervention_reply_out->interventions[index].audits[updt_cnt].outcomes[auditOutcomeCnt].id = fieldId
	 		intervention_reply_out->interventions[index].audits[updt_cnt].outcomes[auditOutcomeCnt].name = textResult
 
		;Intervention Scoring
		elseif(dtaDescription like "*SCOR*")
			if(latestCheck)
				intervention_reply_out->interventions[index].scoring_system.scoring_system_id = fieldId
				intervention_reply_out->interventions[index].scoring_system.scoring_system_name = textResult
			endif
 
		;Additional Details
		else
			if(latestCheck)
				addDetailsCnt = addDetailsCnt + 1
				stat = alterlist(intervention_reply_out->interventions[index].additional_details,addDetailsCnt)
 
				intervention_reply_out->interventions[index].additional_details[addDetailsCnt].field.id = fieldId
				intervention_reply_out->interventions[index].additional_details[addDetailsCnt].field.name = fieldDisplay
				if(codedResults)
					stat = alterlist(intervention_reply_out->interventions[index].additional_details[addDetailsCnt].coded_values,codedResults)
					for(i = 1 to codedResults)
						intervention_reply_out->interventions[index].additional_details[addDetailsCnt].coded_values[i].id =
						temp->qual[index].child_events[d.seq].coded_result[i].nomenclature_id
 
						intervention_reply_out->interventions[index].additional_details[addDetailsCnt].coded_values[i].name =
						temp->qual[index].child_events[d.seq].coded_result[i].descriptor
					endfor
				else
					intervention_reply_out->interventions[index].additional_details[addDetailsCnt].text_values = textResult
				endif
			endif
 
		endif
 
		;Audit data
		intervention_reply_out->interventions[index].audits[updt_cnt].audit_date_time = temp->qual[index].child_events[d.seq].updt_dt_tm
	 	intervention_reply_out->interventions[index].audits[updt_cnt].user.provider_id = temp->qual[index].child_events[d.seq].updt_id
	 	intervention_reply_out->interventions[index].audits[updt_cnt].order_ids =
	 	cnvtstring(temp->qual[index].child_events[d.seq].order_id)
 
	 	intervention_reply_out->interventions[index].audits[updt_cnt].status.id = temp->qual[index].child_events[d.seq].result_status_cd
	 	intervention_reply_out->interventions[index].audits[updt_cnt].status.name =
	 	uar_get_code_display(temp->qual[index].child_events[d.seq].result_status_cd)
		;intervention_reply_out->interventions[index].audits[?].value
	with nocounter
 
	; Set Audit Provider Name
	for(au = 1 to size(intervention_reply_out->interventions[index].audits,5))
	 	set intervention_reply_out->interventions[index].audits[au].user.provider_name =
	 	GetNameFromPrsnID(intervention_reply_out->interventions[index].audits[au].user.provider_id)
	endfor
	; Date Fields
	;set intervention_reply_out->interventions[index].documentation
	;set intervention_reply_out->interventions[index].closed_date_time
	set intervention_reply_out->interventions[index].created_date_time = temp->qual[index].beg_activity_dt_tm
	set intervention_reply_out->interventions[index].created_updated_dttm = temp->qual[index].last_activity_dt_tm
 
	; Created by provider
	set intervention_reply_out->interventions[index].created_by.provider_id = temp->qual[index].form_created_by_prsnl_id
	set intervention_reply_out->interventions[index].created_by.provider_name =
		GetNameFromPrsnID(temp->qual[index].form_created_by_prsnl_id)
 
	;Pharmacy info
	set intervention_reply_out->interventions[index].pharmacy.pharmacy_id = temp->qual[index].orders[1].pharmacy_id
	set intervention_reply_out->interventions[index].pharmacy.pharmacy_name = temp->qual[index].orders[1].pharmacy_name
 
	;Associated Users
	select into "nl:"
	from dcp_forms_activity_prsnl dfap
	, person pr
	, encntr_prsnl_reltn epr
	plan dfap where dfap.dcp_forms_activity_id = temp->qual[index].dcp_forms_activity_id
	join pr where pr.person_id = dfap.dcp_forms_activity_prsnl_id
	join epr where epr.encntr_id = temp->qual[index].encntr_id
				and epr.prsnl_person_id = dfap.dcp_forms_activity_prsnl_id
	head report
		p = 0
	detail
		p = p + 1
		stat = alterlist(intervention_reply_out->interventions[index].associated_users,p)
 
		intervention_reply_out->interventions[index].associated_users[p].role.id = epr.encntr_prsnl_r_cd
		intervention_reply_out->interventions[index].associated_users[p].role.name = uar_get_code_display(epr.encntr_prsnl_r_cd)
		intervention_reply_out->interventions[index].associated_users[p].user.provider_id = dfap.dcp_forms_activity_prsnl_id
		intervention_reply_out->interventions[index].associated_users[p].user.provider_name = pr.name_full_formatted
	with nocounter
 
	;Linked Orders
	for(o = 1 to size(temp->qual[index].orders,5))
		set stat = alterlist(intervention_reply_out->interventions[index].linked_orders,o)
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_order_id =
		temp->qual[index].orders[o].order_id
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_id =
		temp->qual[index].orders[o].synonym_id
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_item_id =
		temp->qual[index].orders[o].details.action_list[1].ingred_list[1].product_list[1].item_id
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_name =
		temp->qual[index].orders[o].ordered_as_mnemonic
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_order_status.id =
		temp->qual[index].orders[o].order_status_cd
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_order_status.name =
		uar_get_code_display(temp->qual[index].orders[o].order_status_cd)
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_ordering_provider.provider_id =
		temp->qual[index].orders[o].last_update_provider_id
		set intervention_reply_out->interventions[index].linked_orders[o].orders.medication_ordering_provider.provider_name =
		GetNameFromPrsnID(temp->qual[index].orders[o].last_update_provider_id)
		set intervention_reply_out->interventions[index].linked_orders[o].orders.parent_order_id =
		temp->qual[index].orders[o].parent_order_id
 
		; Set NDC
		set check = 0
		set 380003_size = size(380003_rep->qual,5)
		select into "nl:"
		from (dummyt d with seq = 380003_size)
		plan d where 380003_rep->qual[d.seq].synonymid = temp->qual[index].orders[o].synonym_id
		detail
			check = check + 1
			intervention_reply_out->interventions[index].linked_orders[o].orders.ndc = 380003_rep->qual[d.seq].ndc
		with nocounter
 
		if(check = 0 and 380003_size = 1)
			set intervention_reply_out->interventions[index].linked_orders[o].orders.ndc = 380003_rep->qual[1].ndc
		endif
 
		; Set RxNorms
		select rxnorm = trim(replace(ccm.target_concept_cki,"RXNORM!",""),3)
		from order_catalog_synonym ocs
	    ,cmt_cross_map ccm
	    ,order_catalog oc
		plan ocs where ocs.synonym_id = temp->qual[index].orders[o].synonym_id
	 		and ocs.active_ind = 1
		join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
			and ccm.map_type_cd = outerjoin(value(uar_get_code_by("MEANING", 29223, "MULTUM=RXN")))
		join oc where oc.catalog_cd = outerjoin(ocs.catalog_cd)
		head report
			r = 0
		detail
			r = r + 1
			stat = alterlist(intervention_reply_out->interventions[index].linked_orders[o].orders.rxnorms,r)
 
			intervention_reply_out->interventions[index].linked_orders[o].orders.rxnorms[r].code = cnvtint(rxnorm)
			intervention_reply_out->interventions[index].linked_orders[o].orders.rxnorms[r].code_type = "RXNORM"
			intervention_reply_out->interventions[index].linked_orders[o].orders.rxnorms[r].term_type = "RXNORM"
		with nocounter
 
		; Build Ingredient list
		set ingredSize = size(temp->qual[index].orders[o].details[1].action_list[1].ingred_list,5)
		set stat = alterlist(intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients,ingredSize)
		for(f = 1 to ingredSize)
 
			select into "nl:"
			from (dummyt d with seq = size(380003_rep->qual,5))
			plan d where 380003_rep->qual[d.seq].item_id =
				temp->qual[index].orders[o].details[1].action_list[1].ingred_list[f].product_list[1].item_id
			detail
				;intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ahfs
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_id =
				380003_rep->qual[d.seq].ord_as_synonym_id
 
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_name =
				380003_rep->qual[d.seq].item_description
 
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ndc = 380003_rep->qual[d.seq].ndc
 
				; Set Dose
				if(380003_rep->qual[d.seq].strength > 0)
					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose = 380003_rep->qual[d.seq].strength
 
 					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose_unit.id =
					380003_rep->qual[d.seq].strength_unit_cd
 
					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose_unit.name =
					uar_get_code_display(380003_rep->qual[d.seq].strength_unit_cd)
				else
					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose = 380003_rep->qual[d.seq].volume
 
 					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose_unit.id =
					380003_rep->qual[d.seq].volume_unit_cd
 
					intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].dose_unit.name =
					uar_get_code_display(380003_rep->qual[d.seq].volume_unit_cd)
				endif
 
 
			with nocounter
 
			; Set Ingredient RxNorms
			select rxnorm = trim(replace(ccm.target_concept_cki,"RXNORM!",""),3)
			from order_catalog_synonym ocs
		    ,cmt_cross_map ccm
		    ,order_catalog oc
			plan ocs where ocs.synonym_id = intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_id
		 		and ocs.active_ind = 1
			join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
				and ccm.map_type_cd = outerjoin(value(uar_get_code_by("MEANING", 29223, "MULTUM=RXN")))
			join oc where oc.catalog_cd = outerjoin(ocs.catalog_cd)
			head report
				r = 0
			detail
				r = r + 1
				stat = alterlist(intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_rxnorms,r)
 
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_rxnorms[r].code = cnvtint(rxnorm)
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_rxnorms[r].code_type = "RXNORM"
				intervention_reply_out->interventions[index].linked_orders[o].orders.ingredients[f].ingredient_rxnorms[r].term_type = "RXNORM"
			with nocounter
		endfor
 	endfor
 
	; Patient Data
	select into "nl:"
	from person p
	, person_alias pa
	plan p where p.person_id = temp->qual[index].person_id
	join pa where pa.person_id = p.person_id
				and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
				and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
	detail
		intervention_reply_out->interventions[index].patient.person_id = p.person_id
		intervention_reply_out->interventions[index].patient.name_full_formatted = p.name_full_formatted
		intervention_reply_out->interventions[index].patient.name_last = p.name_last
		intervention_reply_out->interventions[index].patient.name_first = p.name_first
		intervention_reply_out->interventions[index].patient.name_middle = p.name_middle
		intervention_reply_out->interventions[index].patient.mrn = pa.alias
		intervention_reply_out->interventions[index].patient.dob = p.birth_dt_tm
		intervention_reply_out->interventions[index].patient.gender.id = p.sex_cd
		intervention_reply_out->interventions[index].patient.gender.name = uar_get_code_display(p.sex_cd)
	with nocounter
 
 	; Encounter Data
 	select into "nl:"
 	from encounter e
 	, encntr_alias ea
 	plan e where e.encntr_id = temp->qual[index].encntr_id
 	join ea where ea.encntr_id = e.encntr_id
 		and ea.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
 		and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
 	detail
	 	intervention_reply_out->interventions[index].encounter.encounter_id = e.encntr_id
		intervention_reply_out->interventions[index].encounter.encounter_type.id = e.encntr_type_cd
		intervention_reply_out->interventions[index].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
		intervention_reply_out->interventions[index].encounter.encounter_class.id = e.encntr_type_class_cd
		intervention_reply_out->interventions[index].encounter.encounter_class.name = uar_get_code_display(e.encntr_type_class_cd)
		intervention_reply_out->interventions[index].encounter.arrive_date = e.reg_dt_tm
		intervention_reply_out->interventions[index].encounter.discharge_date = e.disch_dt_tm
		intervention_reply_out->interventions[index].encounter.fin_nbr = ea.alias
		intervention_reply_out->interventions[index].encounter.patient_location.location_cd = e.location_cd
		intervention_reply_out->interventions[index].encounter.patient_location.location_disp = uar_get_code_display(e.location_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_facility_cd = e.loc_facility_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_facility_disp =
		uar_get_code_display(e.loc_facility_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_building_cd = e.loc_building_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_building_disp =
		uar_get_code_display(e.loc_building_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_nurse_unit_cd = e.loc_nurse_unit_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_nurse_unit_disp =
		uar_get_code_display(e.loc_nurse_unit_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_room_cd = e.loc_room_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_room_disp = uar_get_code_display(e.loc_room_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_bed_cd = e.loc_bed_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
		intervention_reply_out->interventions[index].encounter.patient_location.loc_temp_cd = e.loc_temp_cd
		intervention_reply_out->interventions[index].encounter.patient_location.loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
 	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
