/*~BB~***********************************************************************************

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
      Source file name:    snsro_pat_pwrform.prg
      Object name:         vigilanz_pat_pwrform
      Program purpose:    Updates an adhoc powerform associated with a task
      Tables read:        MANY
      Tables updated:
      Executing from:     mPages Discern Web Service
      Special Notes:        NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                                    *
*********************************************************************************
 Mod Date     Engineer              Comment                                     *
 --- -------- -------------------   --------------------------------------------*
 001 01/13/20 DSH                   Initial Write
 002 03/02/20 DSH                   Defect corrections
 003 03/06/20 DSH                   Fix to not reuse the form reference_nbr
 004 03/10/20 DSH                   Added support for RTF input
 005 03/24/20 DSH                   Update to support low and high values on DTAs
 006 04/15/20 DSH                   RTF field inputs must now be base-64 encoded.
 007 04/28/20 DSH                   Enhanced error message for FieldInput missing from the form.
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_pat_pwrform go
create program vigilanz_pat_pwrform
 
prompt
  "Output to File/Printer/MINE" = "MINE" ;Required
  , "Username" = "" ;Required
  , "JSON Args" = "" ;Required
  , "DebugFlag" = "" ;Optional
 
with OUTDEV, USERNAME, JSON_ARGS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
  go to exit_version
endif
 
/*************************************************************************
;DATA STRUCTURES
**************************************************************************/
; JSON input argument list
free record arglist
record arglist(
  1 FormId = vc
  1 EnforceFieldControlLogic = i2
  1 PerformedDateTime = vc
  1 FieldInputs[*]
    ; dcp_input_ref_id (or name_value_prefs.parent_entity_id)
    2 FieldId = vc
    ; nomenclature_ids for coded results
    2 CodedValueIds[*] = vc
    ; text values
    2 TextValues[*] = vc
    ; numeric values
    2 NumericValues[*]
        3 Value = vc
        3 UnitId = vc
  1 UnableToObtainSocialHistoryInd = vc
  1 SocialHistoryInputs[*]
    ; shx_element_id
    2 FieldId = vc
    ; nomenclature_ids for coded results
    2 CodedValueIds[*] = vc
    ; text values
    2 TextValues[*] = vc
    ; numeric values
    2 NumericValues[*]
      3 Value = vc
      3 UnitId = vc
      3 ModifierFlag = vc
)
 
free record powerform_reference
record powerform_reference (
  1 dcp_forms_ref_id = f8
  1 description = vc
  1 task_type_cd = f8
  1 task_type_meaning = vc
  1 task_updt_cnt = i4
  1 event_cd = f8
  1 required_control_cnt = i4
  1 components
    2 social_history_ind = i2
  1 document_event_cd = f8
  1 section_cnt = i4
  1 sections[*]
    2 dcp_section_ref_id = f8
    2 dcp_section_instance_id = f8
    2 description = vc
    2 event_cd = f8
    2 components
      3 social_history_ind = i2
    2 control_cnt = i4
    2 controls[*]
      3 dcp_input_ref_id = f8
      3 found_in_arglist_ind = i2
      3 description = vc
      3 input_ref_seq = i4
      3 input_type = i4
      3 caption = vc
      3 question_role = vc
      3 discrete_task_assay = vc
      3 task_assay_cd = f8
      3 multi_select_ind = i2
      3 required_ind = i2
      3 ref_range_factor_cnt = i4
      3 ref_range_factor[*]
        4 units_cd = f8
        4 normal_ind = i2
        4 normal_low = f8
        4 normal_high = f8
        4 critical_ind = i2
        4 critical_low = f8
        4 critical_high = f8
        4 feasible_ind = i2
        4 feasible_low = f8
        4 feasible_high = f8
        4 alpha_responses_cnt = i4
        4 alpha_responses[*]
          5 nomenclature_id = f8
          5 source_string = vc
          5 short_string = vc
          5 mnemonic = vc
          5 sequence = i4
      3 event_cd = f8
      3 event_class_cd = f8
      3 default_result_type_cd = f8
      3 date_type_flag = i2
      3 value_type
        4 nomenclature_ind = i2
        4 freetext_ind = i2
        4 numeric_ind = i2
        4 rtf_ind = i2
        4 date_time_ind = i2
)
 
free record powerform_date_time
record powerform_date_time (
  1 new_event_end_dt_tm = dq8
  1 new_event_end_tz = i4
  1 new_action_dt_tm = dq8
  1 new_action_tz = i4
  1 original_event_end_dt_tm = dq8
  1 original_event_end_tz = i4
  1 original_action_dt_tm = dq8
  1 original_action_tz = i4
  1 document_new_event_end_dt_tm = dq8
  1 document_new_event_end_tz = i4
  1 document_new_action_dt_tm = dq8
  1 document_new_action_tz = i4
  1 document_original_event_end_dt_tm = dq8
  1 document_original_event_end_tz = i4
  1 document_original_action_dt_tm = dq8
  1 document_original_action_tz = i4
)
 
free record powerform_activity
record powerform_activity (
  ; Reference
  1 dcp_forms_ref_id = f8
  1 description = vc
  1 task_type_cd = f8
  1 task_type_meaning = vc
  1 task_updt_cnt = i4
  1 event_cd = f8
  1 required_control_cnt = i4
  1 components
    2 social_history_ind = i2
 
  ; Activity
  1 form_activity_id = f8
  1 reference_nbr = vc
  1 reference_nbr_length = i4
  1 result_set_id = f8
  1 task_id = f8
  1 event_id = f8
  1 collating_seq = vc
  1 collating_seq_length = i4
  1 required_control_answered_cnt = i4
  1 control_answered_cnt = i4
  1 updt_cnt = i4
  1 form_dt_tm = dq8
  1 form_tz = i4
  1 document_event_cd = f8
  1 document_reference_nbr = vc
  1 document_reference_nbr_length = i4
  1 document_blob = gvc
  1 document_blob_length = i4
  1 document_event_id = f8
  1 document_updt_cnt = i4
  1 document_xml_blob = gvc
  1 document_xml_blob_length = i4
  1 document_child_reference_nbr = vc
  1 document_child_reference_nbr_length = i4
  1 document_child_collating_seq = vc
  1 document_child_collating_seq_length = i4
  1 document_child_event_id = f8
  1 document_child_updt_cnt = i4
  1 document_child_event_class_cd = f8
  1 document_event_prsnl_cnt = i4
  1 document_event_prsnl_list [*]
    2 event_prsnl_id = f8
    2 action_type_cd = f8
    2 action_dt_tm = dq8
    2 action_prsnl_id = f8
    2 action_status_cd = f8
    2 action_tz = i4
  1 event_prsnl_cnt = i4
  1 event_prsnl_list [*]
    2 event_prsnl_id = f8
    2 action_type_cd = f8
    2 action_dt_tm = dq8
    2 action_prsnl_id = f8
    2 action_status_cd = f8
    2 action_tz = i4
  1 section_cnt = i4
  1 sections[*]
    ; Section Reference
    2 dcp_section_ref_id = f8
    2 dcp_section_instance_id = f8
    2 description = vc
    2 event_cd = f8
    2 components
      3 social_history_ind = i2
 
    ; Section Activity
    2 reference_nbr = vc
    2 reference_nbr_length = i4
    2 event_id = f8
    2 collating_seq = vc
    2 collating_seq_length = i4
    2 updt_cnt = i4
    2 event_prsnl_cnt = i4
    2 event_prsnl_list [*]
      3 event_prsnl_id = f8
      3 action_type_cd = f8
      3 action_dt_tm = dq8
      3 action_prsnl_id = f8
      3 action_status_cd = f8
      3 action_tz = i4
 
    2 control_cnt = i4
    2 controls[*]
      ; Control Reference
      3 dcp_input_ref_id = f8
      3 found_in_arglist_ind = i2
      3 description = vc
      3 input_ref_seq = i4
      3 input_type = i4
      3 caption = vc
      3 question_role = vc
      3 discrete_task_assay = vc
      3 task_assay_cd = f8
      3 multi_select_ind = i2
      3 required_ind = i2
      3 ref_range_factor_cnt = i4
      3 ref_range_factor[*]
        4 units_cd = f8
        4 normal_ind = i2
        4 normal_low = f8
        4 normal_high = f8
        4 critical_ind = i2
        4 critical_low = f8
        4 critical_high = f8
        4 feasible_ind = i2
        4 feasible_low = f8
        4 feasible_high = f8
        4 alpha_responses_cnt = i4
        4 alpha_responses[*]
          5 nomenclature_id = f8
          5 source_string = vc
          5 short_string = vc
          5 mnemonic = vc
          5 sequence = i4
      3 event_cd = f8
      3 event_class_cd = f8
      3 default_result_type_cd = f8
      3 value_type
        4 nomenclature_ind = i2
        4 freetext_ind = i2
        4 numeric_ind = i2
        4 rtf_ind = i2
        4 date_time_ind = i2
 
      ; Control Activity
      3 reference_nbr = vc
      3 reference_nbr_length = i4
      3 collating_seq = vc
      3 collating_seq_length = i4
      3 date_type_flag = i2
      3 event_id = f8
      3 updt_cnt = i4
      3 normal_ind = i2
      3 normal_low = f8
      3 normal_high = f8
      3 critical_ind = i2
      3 critical_low = f8
      3 critical_high = f8
      3 normalcy_cd = f8
      3 event_prsnl_cnt = i4
      3 event_prsnl_list [*]
        4 event_prsnl_id = f8
        4 action_type_cd = f8
        4 action_dt_tm = dq8
        4 action_prsnl_id = f8
        4 action_status_cd = f8
        4 action_tz = i4
      3 clear_value_ind = i2
      3 value_cnt = i4
      3 values[*]
        4 value_invalid_ind = i2
        4 nomenclature
          5 sequence_nbr = i4
          5 nomenclature_id = f8
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
        4 text_value = vc
        4 rtf_value = gvc
        4 rtf_value_size = i4
        4 out_buffer = c1000
        4 out_buffer_length = i4
        4 return_buffer_length = i4
        4 stripped_rtf_value = gvc
        4 stripped_rtf_value_size = i4
        4 numeric_value = f8
        4 numeric_display = vc
        4 unit_cd = f8
        4 date_time_value = dq8
      3 action_cnt = i4
      3 actions[*]
        4 status_cd = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_tz = i4
        4 action_dt_tm = dq8
        4 action_tz = i4
        4 action_prsnl_id = f8
        ; If this is empty then no values were changed for the action
        4 value_cnt = i4
        4 values[*]
          5 nomenclature
            6 nomenclature_id = f8
            6 short_string = vc
          5 text_value = vc
          5 numeric_display = vc
          5 unit_cd = f8
          5 date_time_value = dq8
          5 rtf_value = gvc
          5 rtf_value_size = i4
)
 
free record modification_information
record modification_information (
  1 modification_cnt = i4
  1 modifications[*]
    2 valid_from_dt_tm = dq8
    2 action_dt_tm = dq8
    2 action_tz = i4
    2 action_prsnl_id = f8
    2 action_prsnl_full_name = vc
)
 
free record powerform_rtf
record powerform_rtf (
  1 event_id = f8
  1 description = vc
  1 event_end_dt_tm = dq8
  1 event_end_tz = i4
  1 event_end_prsnl_full_name = vc
  1 perform_action_dt_tm = dq8
  1 perform_action_tz = i4
  1 perform_action_prsnl_id = f8
  1 perform_action_prsnl_full_name = vc
  1 components
    2 social_history_ind = i2
  1 section_cnt = i4
  1 sections[*]
    2 event_id = f8
    2 description = vc
    2 reference_index = i4
    2 components
      3 social_history_ind = i2
    2 control_cnt = i4
    2 controls[*]
      3 event_id = f8
      3 reference_index = i4
      3 caption = vc
      3 value_type
        4 nomenclature_ind = i2
        4 freetext_ind = i2
        4 numeric_ind = i2
        4 rtf_ind = i2
        4 date_time_ind = i2
      3 date_type_flag = i2
      3 modification_cnt = i4
      3 modifications[*]
        4 in_error_ind = f8
        4 action_dt_tm = dq8
        4 action_tz = i4
        4 action_prsnl_id = f8
        4 action_prsnl_full_name = vc
        4 value_cnt = i4
        4 values[*]
          5 nomenclature
            6 nomenclature_id = f8
            6 short_string = vc
          5 text_value = vc
          5 numeric_display = vc
          5 numeric_value = f8
          5 unit_cd = f8
          5 date_time_value = dq8
          5 date_time_tz = i4
          5 rtf_value = gvc
          5 rtf_value_size = i4
          5 out_buffer = c1000
          5 out_buffer_length = i4
          5 return_buffer_length = i4
          5 stripped_rtf_value = gvc
          5 stripped_rtf_value_size = i4
          5 normal_ind = i2
          5 normal_low = f8
          5 normal_high = f8
          5 critical_ind = i2
          5 critical_low = f8
          5 critical_high = f8
          5 normalcy_cd = f8
)
 
free record social_history
record social_history (
  1 required_element_cnt = i4 ; For logic
  1 required_element_answered_cnt = i4 ; For logic
  1 element_cnt = i4 ; For logic
  1 element_answered_cnt = i4 ; For logic
  1 unable_to_obtain_ind = i2
  1 unable_to_obtain_provided_ind = i2
  1 previous_unable_to_obtain_ind = i2
  1 category_cnt = i4
  1 categories[*]
    2 shx_category_ref_id = f8
    2 category_cd = f8
    2 description = vc
    2 shx_category_def_id = f8
    2 comment_ind = i2
    2 element_answered_cnt = i4 ; For logic
    2 element_cnt = i4
    2 elements[*]
      3 shx_element_id = f8
      3 element_seq = i4
      3 task_assay_cd = f8
      3 input_type_cd = f8
      3 response_label = vc
      3 response_label_layout_flag = i2
      3 required_ind = i2
      3 event_cd = f8
      3 default_result_type_cd = f8
      3 ref_range_factor_cnt = i4
      3 ref_range_factor[*]
        4 units_cd = f8
        4 alpha_responses_cnt = i4
        4 alpha_responses[*]
          5 nomenclature_id = f8
          5 source_string = vc
          5 short_string = vc
          5 mnemonic = vc
          5 sequence = i4
      3 value_type
        4 nomenclature_ind = i2
        4 freetext_ind = i2
        4 numeric_ind = i2
        4 date_time_ind = i2
      3 multi_select_ind = i2
      3 value_cnt = i4
      3 values[*]
        4 value_invalid_ind = i2
        4 nomenclature
          5 sequence_nbr = i4
          5 nomenclature_id = f8
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
        4 text_value = vc
        4 numeric_value = f8
        4 numeric_display = vc
        4 unit_cd = f8
        4 modifier_flag = i4
        4 date_time_value = dq8
)
 
free record dcp_get_form_activity_600354_req
record dcp_get_form_activity_600354_req (
  1 form_activity_id = f8
  1 primary_event_id = f8
  1 document_event_id = f8
  1 get_form_task_ind = i2
)
 
free record dcp_get_form_activity_600354_rep
record dcp_get_form_activity_600354_rep (
  1 dcp_forms_activity_id = f8
  1 dcp_forms_ref_id = f8
  1 person_id = f8
  1 encntr_id = f8
  1 updt_cnt = i4
  1 form_dt_tm = dq8
  1 form_tz = i4
  1 form_status_cd = f8
  1 flags = i4
  1 beg_activity_dt_tm = dq8
  1 last_activity_dt_tm = dq8
  1 active_ind = i2
  1 version_dt_tm = dq8
  1 prsnl [*]
    2 prsnl_id = f8
    2 prsnl_ft = vc
    2 proxy_id = f8
    2 activity_dt_tm = dq8
    2 activity_tz = i4
  1 comp [*]
    2 parent_entity_name = vc
    2 parent_entity_id = f8
    2 component_cd = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  1 task_id = f8
  1 description = vc
  1 ignore_req_ind = i2
  1 task_type_cd = f8
  1 task_updt_cnt = i4
  1 task_dt_tm = dq8
  1 charges [*]
    2 provider_id = f8
    2 location_cd = f8
    2 diagnosis [*]
      3 nomen_id = f8
      3 source_string = vc
      3 source_identifier = vc
    2 cpt_modifier [*]
      3 modifier_cd = f8
      3 display = vc
      3 description = vc
  1 long_blob = gvc
)
 
free record dcp_get_dcp_form_600373_req
record dcp_get_dcp_form_600373_req (
  1 dcp_forms_ref_id = f8
  1 version_dt_tm = dq8
)
 
free record dcp_get_dcp_form_600373_rep
record dcp_get_dcp_form_600373_rep (
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
   1 sect_list [*]
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
     2 input_cnt = i2
     2 input_list [* ]
		3 dcp_input_ref_id = f8
		3 input_ref_seq = i4
		3 description = vc
		3 module = vc
		3 input_type = i4
		3 updt_cnt = i4
		3 nv_cnt = i2
		3 nv [* ]
			4 pvc_name = vc
			4 pvc_value = vc
			4 merge_id = f8
			4 sequence = i4
   	 2 cki = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
   1 event_set_name = vc
)
 
free record event_detail_query_1000011_req
record event_detail_query_1000011_req (
  1 query_mode  = i4
  1 query_mode_ind = i2
  1 event_id = f8
  1 contributor_system_cd = f8
  1 reference_nbr = vc
  1 dataset_uid = vc
  1 subtable_bit_map = i4
  1 subtable_bit_map_ind = i2
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 decode_flag = i2
  1 ordering_provider_id = f8
  1 action_prsnl_id = f8
  1 event_id_list [*]
    2 event_id = f8
  1 action_type_cd_list [*]
    2 action_type_cd = f8
  1 src_event_id_ind = i2
  1 action_prsnl_group_id = f8
)
 
free record event_detail_query_1000011_rep
record event_detail_query_1000011_rep (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
      3 subStatusCd = i4
  1 rb_list [*]
    2 clinical_event_id = f8
    2 event_id = f8
    2 valid_until_dt_tm = dq8
    2 valid_until_dt_tm_ind = i2
    2 clinsig_updt_dt_tm = dq8
    2 clinsig_updt_dt_tm_ind = i2
    2 view_level = i4
    2 view_level_ind = i2
    2 order_id = f8
    2 catalog_cd = f8
    2 catalog_cd_disp = vc
    2 series_ref_nbr = vc
    2 person_id = f8
    2 encntr_id = f8
    2 encntr_financial_id = f8
    2 accession_nbr = vc
    2 contributor_system_cd = f8
    2 contributor_system_cd_disp = vc
    2 reference_nbr = vc
    2 parent_event_id = f8
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 event_class_cd = f8
    2 event_class_cd_disp = vc
    2 event_cd = f8
    2 event_cd_disp = vc
    2 event_cd_desc = vc
    2 event_tag = vc
    2 event_reltn_cd = f8
    2 event_reltn_cd_disp = vc
    2 event_start_dt_tm = dq8
    2 event_start_dt_tm_ind = i2
    2 event_end_dt_tm = dq8
    2 event_end_dt_tm_ind = i2
    2 event_end_dt_tm_os = f8
    2 event_end_dt_tm_os_ind = i2
    2 task_assay_cd = f8
    2 record_status_cd = f8
    2 record_status_cd_disp = vc
    2 result_status_cd = f8
    2 result_status_cd_disp = vc
    2 authentic_flag = i2
    2 authentic_flag_ind = i2
    2 publish_flag = i2
    2 publish_flag_ind = i2
    2 qc_review_cd = f8
    2 qc_review_cd_disp = vc
    2 normalcy_cd = f8
    2 normalcy_cd_disp = vc
    2 normalcy_cd_mean = vc
    2 normalcy_method_cd = f8
    2 normalcy_method_cd_disp = vc
    2 inquire_security_cd = f8
    2 inquire_security_cd_disp = vc
    2 resource_group_cd = f8
    2 resource_group_cd_disp = vc
    2 resource_cd = f8
    2 resource_cd_disp = vc
    2 subtable_bit_map = i4
    2 subtable_bit_map_ind = i2
    2 event_title_text = vc
    2 collating_seq = vc
    2 result_val = vc
    2 result_units_cd = f8
    2 result_units_cd_disp = vc
    2 result_time_units_cd = f8
    2 result_time_units_cd_disp = vc
    2 verified_dt_tm = dq8
    2 verified_dt_tm_ind = i2
    2 verified_prsnl_id = f8
    2 performed_dt_tm = dq8
    2 performed_dt_tm_ind = i2
    2 performed_prsnl_id = f8
    2 normal_low = vc
    2 normal_high = vc
    2 critical_low = vc
    2 critical_high = vc
    2 expiration_dt_tm = dq8
    2 expiration_dt_tm_ind = i2
    2 note_importance_bit_map = i2
    2 event_tag_set_flag = i2
    2 updt_dt_tm = dq8
    2 updt_dt_tm_ind = i2
    2 updt_id = f8
    2 updt_task = i4
    2 updt_task_ind = i2
    2 updt_cnt = i4
    2 updt_cnt_ind = i2
    2 updt_applctx = i4
    2 updt_applctx_ind = i2
    2 io_result [*]
      3 ce_io_result_id = f8
      3 event_id = f8
      3 person_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 io_dt_tm = dq8
      3 io_dt_tm_ind = i2
      3 type_cd = f8
      3 type_cd_disp = vc
      3 type_cd_mean = vc
      3 group_cd = f8
      3 group_cd_disp = vc
      3 group_cd_mean = vc
      3 volume = f8
      3 volume_ind = i2
      3 authentic_flag = i2
      3 authentic_flag_ind = i2
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 record_status_cd_mean = vc
      3 io_comment = vc
      3 system_note = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 specimen_coll [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 specimen_id = f8
      3 container_id = f8
      3 container_type_cd = f8
      3 container_type_cd_disp = vc
      3 container_type_cd_mean = vc
      3 specimen_status_cd = f8
      3 specimen_status_cd_disp = vc
      3 specimen_status_cd_mean = vc
      3 collect_dt_tm = dq8
      3 collect_dt_tm_ind = i2
      3 collect_method_cd = f8
      3 collect_method_cd_disp = vc
      3 collect_method_cd_mean = vc
      3 collect_loc_cd = f8
      3 collect_loc_cd_disp = vc
      3 collect_loc_cd_mean = vc
      3 collect_prsnl_id = f8
      3 collect_volume = f8
      3 collect_volume_ind = i2
      3 collect_unit_cd = f8
      3 collect_unit_cd_disp = vc
      3 collect_unit_cd_mean = vc
      3 collect_priority_cd = f8
      3 collect_priority_cd_disp = vc
      3 collect_priority_cd_mean = vc
      3 source_type_cd = f8
      3 source_type_cd_disp = vc
      3 source_type_cd_mean = vc
      3 source_text = vc
      3 body_site_cd = f8
      3 body_site_cd_disp = vc
      3 body_site_cd_mean = vc
      3 danger_cd = f8
      3 danger_cd_disp = vc
      3 danger_cd_mean = vc
      3 positive_ind = i2
      3 positive_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 specimen_trans_list [*]
        4 event_id = f8
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 transfer_dt_tm = dq8
        4 transfer_dt_tm_ind = i2
        4 transfer_prsnl_id = f8
        4 transfer_loc_cd = f8
        4 transfer_loc_cd_disp = vc
        4 receive_dt_tm = dq8
        4 receive_dt_tm_ind = i2
        4 receive_prsnl_id = f8
        4 receive_loc_cd = f8
        4 receive_loc_cd_disp = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 collect_tz = i4
      3 recvd_dt_tm = dq8
      3 recvd_tz = i4
    2 blob_result [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 max_sequence_nbr = i4
      3 max_sequence_nbr_ind = i2
      3 checksum = i4
      3 checksum_ind = i2
      3 succession_type_cd = f8
      3 succession_type_cd_disp = vc
      3 sub_series_ref_nbr = vc
      3 storage_cd = f8
      3 storage_cd_disp = vc
      3 format_cd = f8
      3 format_cd_disp = vc
      3 device_cd = f8
      3 device_cd_disp = vc
      3 blob_handle = vc
      3 blob_attributes = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 blob [*]
        4 event_id = f8
        4 blob_seq_num = i4
        4 blob_seq_num_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 blob_length = i4
        4 blob_length_ind = i2
        4 compression_cd = f8
        4 compression_cd_disp = vc
        4 blob_contents = gvc
        4 blob_contents_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 blob_summary [*]
        4 ce_blob_summary_id = f8
        4 blob_summary_id = f8
        4 blob_length = i4
        4 blob_length_ind = i2
        4 format_cd = f8
        4 compression_cd = f8
        4 checksum = i4
        4 checksum_ind = i2
        4 long_blob = gvc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 event_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
    2 string_result [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 string_result_text = vc
      3 string_result_format_cd = f8
      3 string_result_format_cd_disp = vc
      3 equation_id = f8
      3 last_norm_dt_tm = dq8
      3 last_norm_dt_tm_ind = i2
      3 unit_of_measure_cd = f8
      3 unit_of_measure_cd_disp = vc
      3 feasible_ind = i2
      3 feasible_ind_ind = i2
      3 inaccurate_ind = i2
      3 inaccurate_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 interp_comp_list [*]
        4 event_id = f8
        4 comp_idx = i4
        4 comp_idx_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 comp_event_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 comp_name = vc
      3 calculation_equation = vc
      3 string_long_text_id = f8
    2 blood_transfuse [*]
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 transfuse_start_dt_tm = dq8
      3 transfuse_start_dt_tm_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 transfuse_end_dt_tm = dq8
      3 transfuse_end_dt_tm_ind = i2
      3 transfuse_note = vc
      3 transfuse_route_cd = f8
      3 transfuse_site_cd = f8
      3 transfuse_pt_loc_cd = f8
      3 initial_volume = f8
      3 total_intake_volume = f8
      3 transfusion_rate = f8
      3 transfusion_unit_cd = f8
      3 transfusion_time_cd = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 apparatus [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 apparatus_type_cd = f8
      3 apparatus_type_cd_disp = vc
      3 apparatus_serial_nbr = vc
      3 apparatus_size_cd = f8
      3 apparatus_size_cd_disp = vc
      3 body_site_cd = f8
      3 body_site_cd_disp = vc
      3 insertion_pt_loc_cd = f8
      3 insertion_pt_loc_cd_disp = vc
      3 insertion_prsnl_id = f8
      3 removal_pt_loc_cd = f8
      3 removal_pt_loc_cd_disp = vc
      3 removal_prsnl_id = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 assistant_list [*]
        4 event_id = f8
        4 assistant_type_cd = f8
        4 assistant_type_cd_disp = vc
        4 assistant_type_cd_mean = vc
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 assistant_prsnl_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
    2 product [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 product_id = f8
      3 product_nbr = vc
      3 product_cd = f8
      3 product_cd_disp = vc
      3 product_cd_mean = vc
      3 abo_cd = f8
      3 abo_cd_disp = vc
      3 abo_cd_mean = vc
      3 rh_cd = f8
      3 rh_cd_disp = vc
      3 rh_cd_mean = vc
      3 product_status_cd = f8
      3 product_status_cd_disp = vc
      3 product_status_cd_mean = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 product_antigen_list [*]
        4 event_id = f8
        4 prod_ant_seq_nbr = i4
        4 prod_ant_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 antigen_cd = f8
        4 antigen_cd_disp = vc
        4 antigen_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 attribute_ind = i2
      3 product_volume = f8
      3 product_volume_unit_cd = f8
      3 product_quantity = f8
      3 product_quantity_unit_cd = f8
      3 product_strength = f8
      3 product_strength_unit_cd = f8
    2 date_result [*]
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 result_dt_tm = dq8
      3 result_dt_tm_ind = i2
      3 result_dt_tm_os = f8
      3 result_dt_tm_os_ind = i2
      3 date_type_flag = i2
      3 date_type_flag_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 result_tz = i4
      3 result_tz_ind = i2
    2 med_result_list [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 admin_note = vc
      3 admin_prov_id = f8
      3 admin_start_dt_tm = dq8
      3 admin_start_dt_tm_ind = i2
      3 admin_end_dt_tm = dq8
      3 admin_end_dt_tm_ind = i2
      3 admin_route_cd = f8
      3 admin_route_cd_disp = vc
      3 admin_route_cd_mean = vc
      3 admin_site_cd = f8
      3 admin_site_cd_disp = vc
      3 admin_site_cd_mean = vc
      3 admin_method_cd = f8
      3 admin_method_cd_disp = vc
      3 admin_method_cd_mean = vc
      3 admin_pt_loc_cd = f8
      3 admin_pt_loc_cd_disp = vc
      3 admin_pt_loc_cd_mean = vc
      3 initial_dosage = f8
      3 initial_dosage_ind = i2
      3 admin_dosage = f8
      3 admin_dosage_ind = i2
      3 dosage_unit_cd = f8
      3 dosage_unit_cd_disp = vc
      3 dosage_unit_cd_mean = vc
      3 initial_volume = f8
      3 initial_volume_ind = i2
      3 total_intake_volume = f8
      3 total_intake_volume_ind = i2
      3 diluent_type_cd = f8
      3 diluent_type_cd_disp = vc
      3 diluent_type_cd_mean = vc
      3 ph_dispense_id = f8
      3 infusion_rate = f8
      3 infusion_rate_ind = i2
      3 infusion_unit_cd = f8
      3 infusion_unit_cd_disp = vc
      3 infusion_unit_cd_mean = vc
      3 infusion_time_cd = f8
      3 infusion_time_cd_disp = vc
      3 infusion_time_cd_mean = vc
      3 medication_form_cd = f8
      3 medication_form_cd_disp = vc
      3 medication_form_cd_mean = vc
      3 reason_required_flag = i2
      3 reason_required_flag_ind = i2
      3 response_required_flag = i2
      3 response_required_flag_ind = i2
      3 admin_strength = i4
      3 admin_strength_ind = i2
      3 admin_strength_unit_cd = f8
      3 admin_strength_unit_cd_disp = vc
      3 admin_strength_unit_cd_mean = vc
      3 substance_lot_number = vc
      3 substance_exp_dt_tm = dq8
      3 substance_exp_dt_tm_ind = i2
      3 substance_manufacturer_cd = f8
      3 substance_manufacturer_cd_disp = vc
      3 substance_manufacturer_cd_mean = vc
      3 refusal_cd = f8
      3 refusal_cd_disp = vc
      3 refusal_cd_mean = vc
      3 system_entry_dt_tm = dq8
      3 system_entry_dt_tm_ind = i2
      3 iv_event_cd = f8
      3 infused_volume = f8
      3 infused_volume_unit_cd = f8
      3 infused_volume_unit_cd_disp = vc
      3 infused_volume_unit_cd_mean = vc
      3 remaining_volume = f8
      3 remaining_volume_unit_cd = f8
      3 remaining_volume_unit_cd_disp = vc
      3 remaining_volume_unit_cd_mean = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 synonym_id = f8
      3 immunization_type_cd = f8
      3 immunization_type_cd_disp = vc
      3 immunization_type_cd_mean = vc
      3 admin_start_tz = i4
      3 admin_end_tz = i4
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
      3 weight_value = f8
      3 weight_unit_cd = f8
    2 event_note_list [*]
      3 ce_event_note_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 event_note_id = f8
      3 event_id = f8
      3 note_type_cd = f8
      3 note_type_cd_disp = vc
      3 note_type_cd_mean = vc
      3 note_format_cd = f8
      3 note_format_cd_disp = vc
      3 note_format_cd_mean = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 entry_method_cd = f8
      3 entry_method_cd_disp = vc
      3 entry_method_cd_mean = vc
      3 note_prsnl_id = f8
      3 note_dt_tm = dq8
      3 note_dt_tm_ind = i2
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 record_status_cd_mean = vc
      3 compression_cd = f8
      3 compression_cd_disp = vc
      3 compression_cd_mean = vc
      3 checksum = i4
      3 checksum_ind = i2
      3 long_blob = gvc
      3 long_text = vc
      3 long_text_id = f8
      3 non_chartable_flag = i2
      3 importance_flag = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 note_tz = i4
    2 event_prsnl_list [*]
      3 ce_event_prsnl_id = f8
      3 event_prsnl_id = f8
      3 person_id = f8
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 action_type_cd = f8
      3 action_type_cd_disp = vc
      3 request_dt_tm = dq8
      3 request_dt_tm_ind = i2
      3 request_prsnl_id = f8
      3 request_prsnl_ft = vc
      3 request_comment = vc
      3 action_dt_tm = dq8
      3 action_dt_tm_ind = i2
      3 action_prsnl_id = f8
      3 action_prsnl_ft = vc
      3 proxy_prsnl_id = f8
      3 proxy_prsnl_ft = vc
      3 action_status_cd = f8
      3 action_status_cd_disp = vc
      3 action_comment = vc
      3 change_since_action_flag = i2
      3 change_since_action_flag_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 long_text_id = f8
      3 long_text = vc
      3 linked_event_id = f8
      3 request_tz = i4
      3 action_tz = i4
      3 system_comment = vc
      3 event_action_modifier_list [*]
        4 ce_event_action_modifier_id = f8
        4 event_action_modifier_id = f8
        4 event_id = f8
        4 event_prsnl_id = f8
        4 action_type_modifier_cd = f8
        4 action_type_modifier_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 digital_signature_ident = vc
      3 action_prsnl_group_id = f8
      3 request_prsnl_group_id = f8
      3 receiving_person_id = f8
      3 receiving_person_ft = vc
    2 microbiology_list [*]
      3 event_id = f8
      3 micro_seq_nbr = i4
      3 micro_seq_nbr_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 organism_cd = f8
      3 organism_cd_disp = vc
      3 organism_cd_desc = vc
      3 organism_cd_mean = vc
      3 organism_occurrence_nbr = i4
      3 organism_occurrence_nbr_ind = i2
      3 organism_type_cd = f8
      3 organism_type_cd_disp = vc
      3 organism_type_cd_mean = vc
      3 observation_prsnl_id = f8
      3 biotype = vc
      3 probability = f8
      3 positive_ind = i2
      3 positive_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 susceptibility_list [*]
        4 event_id = f8
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 suscep_seq_nbr = i4
        4 suscep_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 susceptibility_test_cd = f8
        4 susceptibility_test_cd_disp = vc
        4 susceptibility_test_cd_mean = vc
        4 detail_susceptibility_cd = f8
        4 detail_susceptibility_cd_disp = vc
        4 detail_susceptibility_cd_mean = vc
        4 panel_antibiotic_cd = f8
        4 panel_antibiotic_cd_disp = vc
        4 panel_antibiotic_cd_mean = vc
        4 antibiotic_cd = f8
        4 antibiotic_cd_disp = vc
        4 antibiotic_cd_desc = vc
        4 antibiotic_cd_mean = vc
        4 diluent_volume = f8
        4 diluent_volume_ind = i2
        4 result_cd = f8
        4 result_cd_disp = vc
        4 result_cd_mean = vc
        4 result_text_value = vc
        4 result_numeric_value = f8
        4 result_numeric_value_ind = i2
        4 result_unit_cd = f8
        4 result_unit_cd_disp = vc
        4 result_unit_cd_mean = vc
        4 result_dt_tm = dq8
        4 result_dt_tm_ind = i2
        4 result_prsnl_id = f8
        4 susceptibility_status_cd = f8
        4 susceptibility_status_cd_disp = vc
        4 susceptibility_status_cd_mean = vc
        4 abnormal_flag = i2
        4 abnormal_flag_ind = i2
        4 chartable_flag = i2
        4 chartable_flag_ind = i2
        4 nomenclature_id = f8
        4 antibiotic_note = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 result_tz = i4
    2 coded_result_list [*]
      3 event_id = f8
      3 sequence_nbr = i4
      3 sequence_nbr_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 nomenclature_id = f8
      3 result_set = i4
      3 result_set_ind = i2
      3 result_cd = f8
      3 result_cd_disp = vc
      3 acr_code_str = vc
      3 proc_code_str = vc
      3 pathology_str = vc
      3 group_nbr = i4
      3 group_nbr_ind = i2
      3 mnemonic = vc
      3 short_string = vc
      3 descriptor = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 unit_of_measure_cd = f8
      3 source_string = vc
    2 linked_result_list [*]
      3 linked_event_id = f8
      3 order_id = f8
      3 encntr_id = f8
      3 accession_nbr = vc
      3 contributor_system_cd = f8
      3 contributor_system_cd_disp = vc
      3 reference_nbr = vc
      3 event_class_cd = f8
      3 event_class_cd_disp = vc
      3 series_ref_nbr = vc
      3 sub_series_ref_nbr = vc
      3 succession_type_cd = f8
      3 succession_type_cd_disp = vc
      3 child_event [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 event_modifier_list [*]
      3 modifier_cd = f8
      3 modifier_cd_disp = vc
      3 modifier_value_cd = f8
      3 modifier_value_cd_disp = vc
      3 modifier_val_ft = vc
      3 modifier_value_person_id = f8
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 group_sequence = i4
      3 item_sequence = i4
    2 suscep_footnote_r_list [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 micro_seq_nbr = i4
      3 micro_seq_nbr_ind = i2
      3 suscep_seq_nbr = i4
      3 suscep_seq_nbr_ind = i2
      3 suscep_footnote_id = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 suscep_footnote [*]
      4 event_id = f8
      4 valid_from_dt_tm = dq8
      4 valid_from_dt_tm_ind = i2
      4 valid_until_dt_tm = dq8
      4 valid_until_dt_tm_ind = i2
      4 ce_suscep_footnote_id = f8
      4 suscep_footnote_id = f8
      4 checksum = i4
      4 checksum_ind = i2
      4 compression_cd = f8
      4 format_cd = f8
      4 contributor_system_cd = f8
      4 blob_length = i4
      4 blob_length_ind = i2
      4 reference_nbr = vc
      4 long_blob = gvc
      4 updt_dt_tm = dq8
      4 updt_dt_tm_ind = i2
      4 updt_id = f8
      4 updt_task = i4
      4 updt_task_ind = i2
      4 updt_cnt = i4
      4 updt_cnt_ind = i2
      4 updt_applctx = i4
      4 updt_applctx_ind = i2
    2 inventory_result_list [*]
      3 item_id = f8
      3 serial_nbr = vc
      3 serial_mnemonic = vc
      3 description = vc
      3 item_nbr = vc
      3 quantity = f8
      3 quantity_ind = i2
      3 body_site = vc
      3 reference_entity_id = f8
      3 reference_entity_name = vc
      3 implant_result [*]
      4 item_id = f8
      4 item_size = vc
      4 harvest_site = vc
      4 culture_ind = i2
      4 culture_ind_ind = i2
      4 tissue_graft_type_cd = f8
      4 tissue_graft_type_cd_disp = vc
      4 explant_reason_cd = f8
      4 explant_reason_cd_disp = vc
      4 explant_disposition_cd = f8
      4 explant_disposition_cd_disp = vc
      4 reference_entity_id = f8
      4 reference_entity_name = vc
      4 manufacturer_cd = f8
      4 manufacturer_cd_disp = vc
      4 manufacturer_ft = vc
      4 model_nbr = vc
      4 lot_nbr = vc
      4 other_identifier = vc
      4 expiration_dt_tm = dq8
      4 expiration_dt_tm_ind = i2
      4 ecri_code = vc
      4 batch_nbr = vc
      4 event_id = f8
      4 valid_from_dt_tm = dq8
      4 valid_from_dt_tm_ind = i2
      4 valid_until_dt_tm = dq8
      4 valid_until_dt_tm_ind = i2
      4 updt_dt_tm = dq8
      4 updt_dt_tm_ind = i2
      4 updt_task = i4
      4 updt_task_ind = i2
      4 updt_id = f8
      4 updt_cnt = i4
      4 updt_cnt_ind = i2
      4 updt_applctx = i4
      4 updt_applctx_ind = i2
      3 inv_time_result_list [*]
      4 item_id = f8
      4 start_dt_tm = dq8
      4 start_dt_tm_ind = i2
      4 end_dt_tm = dq8
      4 end_dt_tm_ind = i2
      4 event_id = f8
      4 valid_from_dt_tm = dq8
      4 valid_from_dt_tm_ind = i2
      4 valid_until_dt_tm = dq8
      4 valid_until_dt_tm_ind = i2
      4 updt_dt_tm = dq8
      4 updt_dt_tm_ind = i2
      4 updt_task = i4
      4 updt_task_ind = i2
      4 updt_id = f8
      4 updt_cnt = i4
      4 updt_cnt_ind = i2
      4 updt_applctx = i4
      4 updt_applctx_ind = i2
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 child_event_list [*]
      3 clinical_event_id = f8
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 clinsig_updt_dt_tm = dq8
      3 clinsig_updt_dt_tm_ind = i2
      3 view_level = i4
      3 view_level_ind = i2
      3 order_id = f8
      3 catalog_cd = f8
      3 catalog_cd_disp = vc
      3 series_ref_nbr = vc
      3 person_id = f8
      3 encntr_id = f8
      3 encntr_financial_id = f8
      3 accession_nbr = vc
      3 contributor_system_cd = f8
      3 contributor_system_cd_disp = vc
      3 reference_nbr = vc
      3 parent_event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 event_class_cd = f8
      3 event_class_cd_disp = vc
      3 event_cd = f8
      3 event_cd_disp = vc
      3 event_cd_desc = vc
      3 event_tag = vc
      3 event_reltn_cd = f8
      3 event_reltn_cd_disp = vc
      3 event_start_dt_tm = dq8
      3 event_start_dt_tm_ind = i2
      3 event_end_dt_tm = dq8
      3 event_end_dt_tm_ind = i2
      3 event_end_dt_tm_os = f8
      3 event_end_dt_tm_os_ind = i2
      3 task_assay_cd = f8
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 result_status_cd = f8
      3 result_status_cd_disp = vc
      3 authentic_flag = i2
      3 authentic_flag_ind = i2
      3 publish_flag = i2
      3 publish_flag_ind = i2
      3 qc_review_cd = f8
      3 qc_review_cd_disp = vc
      3 normalcy_cd = f8
      3 normalcy_cd_disp = vc
      3 normalcy_cd_mean = vc
      3 normalcy_method_cd = f8
      3 normalcy_method_cd_disp = vc
      3 inquire_security_cd = f8
      3 inquire_security_cd_disp = vc
      3 resource_group_cd = f8
      3 resource_group_cd_disp = vc
      3 resource_cd = f8
      3 resource_cd_disp = vc
      3 subtable_bit_map = i4
      3 subtable_bit_map_ind = i2
      3 event_title_text = vc
      3 collating_seq = vc
      3 result_val = vc
      3 result_units_cd = f8
      3 result_units_cd_disp = vc
      3 result_time_units_cd = f8
      3 result_time_units_cd_disp = vc
      3 verified_dt_tm = dq8
      3 verified_dt_tm_ind = i2
      3 verified_prsnl_id = f8
      3 performed_dt_tm = dq8
      3 performed_dt_tm_ind = i2
      3 performed_prsnl_id = f8
      3 normal_low = vc
      3 normal_high = vc
      3 critical_low = vc
      3 critical_high = vc
      3 expiration_dt_tm = dq8
      3 expiration_dt_tm_ind = i2
      3 note_importance_bit_map = i2
      3 event_tag_set_flag = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 io_result [*]
        4 ce_io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 io_dt_tm = dq8
        4 io_dt_tm_ind = i2
        4 type_cd = f8
        4 type_cd_disp = vc
        4 type_cd_mean = vc
        4 group_cd = f8
        4 group_cd_disp = vc
        4 group_cd_mean = vc
        4 volume = f8
        4 volume_ind = i2
        4 authentic_flag = i2
        4 authentic_flag_ind = i2
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 record_status_cd_mean = vc
        4 io_comment = vc
        4 system_note = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 specimen_coll [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 specimen_id = f8
        4 container_id = f8
        4 container_type_cd = f8
        4 container_type_cd_disp = vc
        4 container_type_cd_mean = vc
        4 specimen_status_cd = f8
        4 specimen_status_cd_disp = vc
        4 specimen_status_cd_mean = vc
        4 collect_dt_tm = dq8
        4 collect_dt_tm_ind = i2
        4 collect_method_cd = f8
        4 collect_method_cd_disp = vc
        4 collect_method_cd_mean = vc
        4 collect_loc_cd = f8
        4 collect_loc_cd_disp = vc
        4 collect_loc_cd_mean = vc
        4 collect_prsnl_id = f8
        4 collect_volume = f8
        4 collect_volume_ind = i2
        4 collect_unit_cd = f8
        4 collect_unit_cd_disp = vc
        4 collect_unit_cd_mean = vc
        4 collect_priority_cd = f8
        4 collect_priority_cd_disp = vc
        4 collect_priority_cd_mean = vc
        4 source_type_cd = f8
        4 source_type_cd_disp = vc
        4 source_type_cd_mean = vc
        4 source_text = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 body_site_cd_mean = vc
        4 danger_cd = f8
        4 danger_cd_disp = vc
        4 danger_cd_mean = vc
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 specimen_trans_list [*]
        5 event_id = f8
        5 sequence_nbr = i4
        5 sequence_nbr_ind = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 transfer_dt_tm = dq8
        5 transfer_dt_tm_ind = i2
        5 transfer_prsnl_id = f8
        5 transfer_loc_cd = f8
        5 transfer_loc_cd_disp = vc
        5 receive_dt_tm = dq8
        5 receive_dt_tm_ind = i2
        5 receive_prsnl_id = f8
        5 receive_loc_cd = f8
        5 receive_loc_cd_disp = vc
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 collect_tz = i4
        4 recvd_dt_tm = dq8
        4 recvd_tz = i4
      3 blob_result [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 max_sequence_nbr = i4
        4 max_sequence_nbr_ind = i2
        4 checksum = i4
        4 checksum_ind = i2
        4 succession_type_cd = f8
        4 succession_type_cd_disp = vc
        4 sub_series_ref_nbr = vc
        4 storage_cd = f8
        4 storage_cd_disp = vc
        4 format_cd = f8
        4 format_cd_disp = vc
        4 device_cd = f8
        4 device_cd_disp = vc
        4 blob_handle = vc
        4 blob_attributes = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 blob [*]
          5 event_id = f8
          5 blob_seq_num = i4
          5 blob_seq_num_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 blob_length = i4
          5 blob_length_ind = i2
          5 compression_cd = f8
          5 compression_cd_disp = vc
          5 blob_contents = gvc
          5 blob_contents_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 blob_summary [*]
          5 ce_blob_summary_id = f8
          5 blob_summary_id = f8
          5 blob_length = i4
          5 blob_length_ind = i2
          5 format_cd = f8
          5 compression_cd = f8
          5 checksum = i4
          5 checksum_ind = i2
          5 long_blob = gvc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 event_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
      3 string_result [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 string_result_text = vc
        4 string_result_format_cd = f8
        4 string_result_format_cd_disp = vc
        4 equation_id = f8
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
        4 feasible_ind = i2
        4 feasible_ind_ind = i2
        4 inaccurate_ind = i2
        4 inaccurate_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 interp_comp_list [*]
        5 event_id = f8
        5 comp_idx = i4
        5 comp_idx_ind = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 comp_event_id = f8
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 comp_name = vc
        4 calculation_equation = vc
        4 string_long_text_id = f8
      3 blood_transfuse [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 transfuse_start_dt_tm = dq8
        4 transfuse_start_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 transfuse_end_dt_tm = dq8
        4 transfuse_end_dt_tm_ind = i2
        4 transfuse_note = vc
        4 transfuse_route_cd = f8
        4 transfuse_site_cd = f8
        4 transfuse_pt_loc_cd = f8
        4 initial_volume = f8
        4 total_intake_volume = f8
        4 transfusion_rate = f8
        4 transfusion_unit_cd = f8
        4 transfusion_time_cd = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 apparatus [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 apparatus_type_cd = f8
        4 apparatus_type_cd_disp = vc
        4 apparatus_serial_nbr = vc
        4 apparatus_size_cd = f8
        4 apparatus_size_cd_disp = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 insertion_pt_loc_cd = f8
        4 insertion_pt_loc_cd_disp = vc
        4 insertion_prsnl_id = f8
        4 removal_pt_loc_cd = f8
        4 removal_pt_loc_cd_disp = vc
        4 removal_prsnl_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 assistant_list [*]
        5 event_id = f8
        5 assistant_type_cd = f8
        5 assistant_type_cd_disp = vc
        5 assistant_type_cd_mean = vc
        5 sequence_nbr = i4
        5 sequence_nbr_ind = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 assistant_prsnl_id = f8
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
      3 product [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 product_id = f8
        4 product_nbr = vc
        4 product_cd = f8
        4 product_cd_disp = vc
        4 product_cd_mean = vc
        4 abo_cd = f8
        4 abo_cd_disp = vc
        4 abo_cd_mean = vc
        4 rh_cd = f8
        4 rh_cd_disp = vc
        4 rh_cd_mean = vc
        4 product_status_cd = f8
        4 product_status_cd_disp = vc
        4 product_status_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 product_antigen_list [*]
        5 event_id = f8
        5 prod_ant_seq_nbr = i4
        5 prod_ant_seq_nbr_ind = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 antigen_cd = f8
        5 antigen_cd_disp = vc
        5 antigen_cd_mean = vc
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 attribute_ind = i2
        4 product_volume = f8
        4 product_volume_unit_cd = f8
        4 product_quantity = f8
        4 product_quantity_unit_cd = f8
        4 product_strength = f8
        4 product_strength_unit_cd = f8
      3 date_result [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 result_dt_tm = dq8
        4 result_dt_tm_ind = i2
        4 result_dt_tm_os = f8
        4 result_dt_tm_os_ind = i2
        4 date_type_flag = i2
        4 date_type_flag_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 result_tz = i4
        4 result_tz_ind = i2
      3 med_result_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 admin_note = vc
        4 admin_prov_id = f8
        4 admin_start_dt_tm = dq8
        4 admin_start_dt_tm_ind = i2
        4 admin_end_dt_tm = dq8
        4 admin_end_dt_tm_ind = i2
        4 admin_route_cd = f8
        4 admin_route_cd_disp = vc
        4 admin_route_cd_mean = vc
        4 admin_site_cd = f8
        4 admin_site_cd_disp = vc
        4 admin_site_cd_mean = vc
        4 admin_method_cd = f8
        4 admin_method_cd_disp = vc
        4 admin_method_cd_mean = vc
        4 admin_pt_loc_cd = f8
        4 admin_pt_loc_cd_disp = vc
        4 admin_pt_loc_cd_mean = vc
        4 initial_dosage = f8
        4 initial_dosage_ind = i2
        4 admin_dosage = f8
        4 admin_dosage_ind = i2
        4 dosage_unit_cd = f8
        4 dosage_unit_cd_disp = vc
        4 dosage_unit_cd_mean = vc
        4 initial_volume = f8
        4 initial_volume_ind = i2
        4 total_intake_volume = f8
        4 total_intake_volume_ind = i2
        4 diluent_type_cd = f8
        4 diluent_type_cd_disp = vc
        4 diluent_type_cd_mean = vc
        4 ph_dispense_id = f8
        4 infusion_rate = f8
        4 infusion_rate_ind = i2
        4 infusion_unit_cd = f8
        4 infusion_unit_cd_disp = vc
        4 infusion_unit_cd_mean = vc
        4 infusion_time_cd = f8
        4 infusion_time_cd_disp = vc
        4 infusion_time_cd_mean = vc
        4 medication_form_cd = f8
        4 medication_form_cd_disp = vc
        4 medication_form_cd_mean = vc
        4 reason_required_flag = i2
        4 reason_required_flag_ind = i2
        4 response_required_flag = i2
        4 response_required_flag_ind = i2
        4 admin_strength = i4
        4 admin_strength_ind = i2
        4 admin_strength_unit_cd = f8
        4 admin_strength_unit_cd_disp = vc
        4 admin_strength_unit_cd_mean = vc
        4 substance_lot_number = vc
        4 substance_exp_dt_tm = dq8
        4 substance_exp_dt_tm_ind = i2
        4 substance_manufacturer_cd = f8
        4 substance_manufacturer_cd_disp = vc
        4 substance_manufacturer_cd_mean = vc
        4 refusal_cd = f8
        4 refusal_cd_disp = vc
        4 refusal_cd_mean = vc
        4 system_entry_dt_tm = dq8
        4 system_entry_dt_tm_ind = i2
        4 iv_event_cd = f8
        4 infused_volume = f8
        4 infused_volume_unit_cd = f8
        4 infused_volume_unit_cd_disp = vc
        4 infused_volume_unit_cd_mean = vc
        4 remaining_volume = f8
        4 remaining_volume_unit_cd = f8
        4 remaining_volume_unit_cd_disp = vc
        4 remaining_volume_unit_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 synonym_id = f8
        4 immunization_type_cd = f8
        4 immunization_type_cd_disp = vc
        4 immunization_type_cd_mean = vc
        4 admin_start_tz = i4
        4 admin_end_tz = i4
        4 contributor_link_list [*]
        5 event_id = f8
        5 contributor_event_id = f8
        5 ce_valid_from_dt_tm = dq8
        5 type_flag = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 ce_valid_until_dt_tm = dq8
        5 ce_result_value = vc
        5 ce_performed_prsnl_id = f8
        5 ce_event_end_dt_tm = dq8
        5 ce_event_cd = f8
        5 ce_event_cd_disp = vc
        5 ce_clinical_event_id = f8
        5 ce_event_class_cd = f8
        5 ce_event_class_cd_disp = vc
        5 string_result_list [*]
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 string_result_text = vc
          6 string_result_format_cd = f8
          6 string_result_format_cd_disp = vc
          6 equation_id = f8
          6 last_norm_dt_tm = dq8
          6 last_norm_dt_tm_ind = i2
          6 unit_of_measure_cd = f8
          6 unit_of_measure_cd_disp = vc
          6 feasible_ind = i2
          6 feasible_ind_ind = i2
          6 inaccurate_ind = i2
          6 inaccurate_ind_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 interp_comp_list [*]
          7 event_id = f8
          7 comp_idx = i4
          7 comp_idx_ind = i2
          7 valid_from_dt_tm = dq8
          7 valid_from_dt_tm_ind = i2
          7 valid_until_dt_tm = dq8
          7 valid_until_dt_tm_ind = i2
          7 comp_event_id = f8
          7 updt_dt_tm = dq8
          7 updt_dt_tm_ind = i2
          7 updt_id = f8
          7 updt_task = i4
          7 updt_task_ind = i2
          7 updt_cnt = i4
          7 updt_cnt_ind = i2
          7 updt_applctx = i4
          7 updt_applctx_ind = i2
          7 comp_name = vc
          6 calculation_equation = vc
          6 string_long_text_id = f8
        5 coded_result_list [*]
          6 event_id = f8
          6 sequence_nbr = i4
          6 sequence_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 nomenclature_id = f8
          6 result_set = i4
          6 result_set_ind = i2
          6 result_cd = f8
          6 result_cd_disp = vc
          6 acr_code_str = vc
          6 proc_code_str = vc
          6 pathology_str = vc
          6 group_nbr = i4
          6 group_nbr_ind = i2
          6 mnemonic = vc
          6 short_string = vc
          6 descriptor = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 unit_of_measure_cd = f8
          6 source_string = vc
        5 date_result_list [*]
          6 event_id = f8
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 result_dt_tm = dq8
          6 result_dt_tm_ind = i2
          6 result_dt_tm_os = f8
          6 result_dt_tm_os_ind = i2
          6 date_type_flag = i2
          6 date_type_flag_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 result_tz = i4
          6 result_tz_ind = i2
        5 ce_result_status_cd = f8
        5 ce_result_status_cd_disp = vc
        5 ce_event_end_tz = i4
        4 weight_value = f8
        4 weight_unit_cd = f8
      3 event_note_list [*]
        4 ce_event_note_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 event_note_id = f8
        4 event_id = f8
        4 note_type_cd = f8
        4 note_type_cd_disp = vc
        4 note_type_cd_mean = vc
        4 note_format_cd = f8
        4 note_format_cd_disp = vc
        4 note_format_cd_mean = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 entry_method_cd = f8
        4 entry_method_cd_disp = vc
        4 entry_method_cd_mean = vc
        4 note_prsnl_id = f8
        4 note_dt_tm = dq8
        4 note_dt_tm_ind = i2
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 record_status_cd_mean = vc
        4 compression_cd = f8
        4 compression_cd_disp = vc
        4 compression_cd_mean = vc
        4 checksum = i4
        4 checksum_ind = i2
        4 long_blob = gvc
        4 long_text = vc
        4 long_text_id = f8
        4 non_chartable_flag = i2
        4 importance_flag = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 note_tz = i4
      3 event_prsnl_list [*]
        4 ce_event_prsnl_id = f8
        4 event_prsnl_id = f8
        4 person_id = f8
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 action_type_cd = f8
        4 action_type_cd_disp = vc
        4 request_dt_tm = dq8
        4 request_dt_tm_ind = i2
        4 request_prsnl_id = f8
        4 request_prsnl_ft = vc
        4 request_comment = vc
        4 action_dt_tm = dq8
        4 action_dt_tm_ind = i2
        4 action_prsnl_id = f8
        4 action_prsnl_ft = vc
        4 proxy_prsnl_id = f8
        4 proxy_prsnl_ft = vc
        4 action_status_cd = f8
        4 action_status_cd_disp = vc
        4 action_comment = vc
        4 change_since_action_flag = i2
        4 change_since_action_flag_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 long_text_id = f8
        4 long_text = vc
        4 linked_event_id = f8
        4 request_tz = i4
        4 action_tz = i4
        4 system_comment = vc
        4 event_action_modifier_list [*]
        5 ce_event_action_modifier_id = f8
        5 event_action_modifier_id = f8
        5 event_id = f8
        5 event_prsnl_id = f8
        5 action_type_modifier_cd = f8
        5 action_type_modifier_cd_disp = vc
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 digital_signature_ident = vc
        4 action_prsnl_group_id = f8
        4 request_prsnl_group_id = f8
        4 receiving_person_id = f8
        4 receiving_person_ft = vc
      3 microbiology_list [*]
        4 event_id = f8
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 organism_cd = f8
        4 organism_cd_disp = vc
        4 organism_cd_desc = vc
        4 organism_cd_mean = vc
        4 organism_occurrence_nbr = i4
        4 organism_occurrence_nbr_ind = i2
        4 organism_type_cd = f8
        4 organism_type_cd_disp = vc
        4 organism_type_cd_mean = vc
        4 observation_prsnl_id = f8
        4 biotype = vc
        4 probability = f8
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 susceptibility_list [*]
        5 event_id = f8
        5 micro_seq_nbr = i4
        5 micro_seq_nbr_ind = i2
        5 suscep_seq_nbr = i4
        5 suscep_seq_nbr_ind = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 susceptibility_test_cd = f8
        5 susceptibility_test_cd_disp = vc
        5 susceptibility_test_cd_mean = vc
        5 detail_susceptibility_cd = f8
        5 detail_susceptibility_cd_disp = vc
        5 detail_susceptibility_cd_mean = vc
        5 panel_antibiotic_cd = f8
        5 panel_antibiotic_cd_disp = vc
        5 panel_antibiotic_cd_mean = vc
        5 antibiotic_cd = f8
        5 antibiotic_cd_disp = vc
        5 antibiotic_cd_desc = vc
        5 antibiotic_cd_mean = vc
        5 diluent_volume = f8
        5 diluent_volume_ind = i2
        5 result_cd = f8
        5 result_cd_disp = vc
        5 result_cd_mean = vc
        5 result_text_value = vc
        5 result_numeric_value = f8
        5 result_numeric_value_ind = i2
        5 result_unit_cd = f8
        5 result_unit_cd_disp = vc
        5 result_unit_cd_mean = vc
        5 result_dt_tm = dq8
        5 result_dt_tm_ind = i2
        5 result_prsnl_id = f8
        5 susceptibility_status_cd = f8
        5 susceptibility_status_cd_disp = vc
        5 susceptibility_status_cd_mean = vc
        5 abnormal_flag = i2
        5 abnormal_flag_ind = i2
        5 chartable_flag = i2
        5 chartable_flag_ind = i2
        5 nomenclature_id = f8
        5 antibiotic_note = vc
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 result_tz = i4
      3 coded_result_list [*]
        4 event_id = f8
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 nomenclature_id = f8
        4 result_set = i4
        4 result_set_ind = i2
        4 result_cd = f8
        4 result_cd_disp = vc
        4 acr_code_str = vc
        4 proc_code_str = vc
        4 pathology_str = vc
        4 group_nbr = i4
        4 group_nbr_ind = i2
        4 mnemonic = vc
        4 short_string = vc
        4 descriptor = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 unit_of_measure_cd = f8
        4 source_string = vc
      3 linked_result_list [*]
        4 linked_event_id = f8
        4 order_id = f8
        4 encntr_id = f8
        4 accession_nbr = vc
        4 contributor_system_cd = f8
        4 contributor_system_cd_disp = vc
        4 reference_nbr = vc
        4 event_class_cd = f8
        4 event_class_cd_disp = vc
        4 series_ref_nbr = vc
        4 sub_series_ref_nbr = vc
        4 succession_type_cd = f8
        4 succession_type_cd_disp = vc
        4 child_event [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 event_modifier_list [*]
        4 modifier_cd = f8
        4 modifier_cd_disp = vc
        4 modifier_value_cd = f8
        4 modifier_value_cd_disp = vc
        4 modifier_val_ft = vc
        4 modifier_value_person_id = f8
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 group_sequence = i4
        4 item_sequence = i4
      3 suscep_footnote_r_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 suscep_seq_nbr = i4
        4 suscep_seq_nbr_ind = i2
        4 suscep_footnote_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 suscep_footnote [*]
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 ce_suscep_footnote_id = f8
        5 suscep_footnote_id = f8
        5 checksum = i4
        5 checksum_ind = i2
        5 compression_cd = f8
        5 format_cd = f8
        5 contributor_system_cd = f8
        5 blob_length = i4
        5 blob_length_ind = i2
        5 reference_nbr = vc
        5 long_blob = gvc
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
      3 inventory_result_list [*]
        4 item_id = f8
        4 serial_nbr = vc
        4 serial_mnemonic = vc
        4 description = vc
        4 item_nbr = vc
        4 quantity = f8
        4 quantity_ind = i2
        4 body_site = vc
        4 reference_entity_id = f8
        4 reference_entity_name = vc
        4 implant_result [*]
        5 item_id = f8
        5 item_size = vc
        5 harvest_site = vc
        5 culture_ind = i2
        5 culture_ind_ind = i2
        5 tissue_graft_type_cd = f8
        5 tissue_graft_type_cd_disp = vc
        5 explant_reason_cd = f8
        5 explant_reason_cd_disp = vc
        5 explant_disposition_cd = f8
        5 explant_disposition_cd_disp = vc
        5 reference_entity_id = f8
        5 reference_entity_name = vc
        5 manufacturer_cd = f8
        5 manufacturer_cd_disp = vc
        5 manufacturer_ft = vc
        5 model_nbr = vc
        5 lot_nbr = vc
        5 other_identifier = vc
        5 expiration_dt_tm = dq8
        5 expiration_dt_tm_ind = i2
        5 ecri_code = vc
        5 batch_nbr = vc
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_id = f8
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 inv_time_result_list [*]
        5 item_id = f8
        5 start_dt_tm = dq8
        5 start_dt_tm_ind = i2
        5 end_dt_tm = dq8
        5 end_dt_tm_ind = i2
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_id = f8
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 child_event_list [*]
          4 clinical_event_id = f8
          4 event_id = f8
          4 valid_until_dt_tm = dq8
          4 valid_until_dt_tm_ind = i2
          4 clinsig_updt_dt_tm = dq8
          4 clinsig_updt_dt_tm_ind = i2
          4 view_level = i4
          4 view_level_ind = i2
          4 order_id = f8
          4 catalog_cd = f8
          4 catalog_cd_disp = vc
          4 series_ref_nbr = vc
          4 person_id = f8
          4 encntr_id = f8
          4 encntr_financial_id = f8
          4 accession_nbr = vc
          4 contributor_system_cd = f8
          4 contributor_system_cd_disp = vc
          4 reference_nbr = vc
          4 parent_event_id = f8
          4 valid_from_dt_tm = dq8
          4 valid_from_dt_tm_ind = i2
          4 event_class_cd = f8
          4 event_class_cd_disp = vc
          4 event_cd = f8
          4 event_cd_disp = vc
          4 event_cd_desc = vc
          4 event_tag = vc
          4 event_reltn_cd = f8
          4 event_reltn_cd_disp = vc
          4 event_start_dt_tm = dq8
          4 event_start_dt_tm_ind = i2
          4 event_end_dt_tm = dq8
          4 event_end_dt_tm_ind = i2
          4 event_end_dt_tm_os = f8
          4 event_end_dt_tm_os_ind = i2
          4 task_assay_cd = f8
          4 record_status_cd = f8
          4 record_status_cd_disp = vc
          4 result_status_cd = f8
          4 result_status_cd_disp = vc
          4 authentic_flag = i2
          4 authentic_flag_ind = i2
          4 publish_flag = i2
          4 publish_flag_ind = i2
          4 qc_review_cd = f8
          4 qc_review_cd_disp = vc
          4 normalcy_cd = f8
          4 normalcy_cd_disp = vc
          4 normalcy_cd_mean = vc
          4 normalcy_method_cd = f8
          4 normalcy_method_cd_disp = vc
          4 inquire_security_cd = f8
          4 inquire_security_cd_disp = vc
          4 resource_group_cd = f8
          4 resource_group_cd_disp = vc
          4 resource_cd = f8
          4 resource_cd_disp = vc
          4 subtable_bit_map = i4
          4 subtable_bit_map_ind = i2
          4 event_title_text = vc
          4 collating_seq = vc
          4 result_val = vc
          4 result_units_cd = f8
          4 result_units_cd_disp = vc
          4 result_time_units_cd = f8
          4 result_time_units_cd_disp = vc
          4 verified_dt_tm = dq8
          4 verified_dt_tm_ind = i2
          4 verified_prsnl_id = f8
          4 performed_dt_tm = dq8
          4 performed_dt_tm_ind = i2
          4 performed_prsnl_id = f8
          4 normal_low = vc
          4 normal_high = vc
          4 critical_low = vc
          4 critical_high = vc
          4 expiration_dt_tm = dq8
          4 expiration_dt_tm_ind = i2
          4 note_importance_bit_map = i2
          4 event_tag_set_flag = i2
          4 updt_dt_tm = dq8
          4 updt_dt_tm_ind = i2
          4 updt_id = f8
          4 updt_task = i4
          4 updt_task_ind = i2
          4 updt_cnt = i4
          4 updt_cnt_ind = i2
          4 updt_applctx = i4
          4 updt_applctx_ind = i2
          4 io_result [*]
            5 ce_io_result_id = f8
            5 event_id = f8
            5 person_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 io_dt_tm = dq8
            5 io_dt_tm_ind = i2
            5 type_cd = f8
            5 type_cd_disp = vc
            5 type_cd_mean = vc
            5 group_cd = f8
            5 group_cd_disp = vc
            5 group_cd_mean = vc
            5 volume = f8
            5 volume_ind = i2
            5 authentic_flag = i2
            5 authentic_flag_ind = i2
            5 record_status_cd = f8
            5 record_status_cd_disp = vc
            5 record_status_cd_mean = vc
            5 io_comment = vc
            5 system_note = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
          4 specimen_coll [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 specimen_id = f8
            5 container_id = f8
            5 container_type_cd = f8
            5 container_type_cd_disp = vc
            5 container_type_cd_mean = vc
            5 specimen_status_cd = f8
            5 specimen_status_cd_disp = vc
            5 specimen_status_cd_mean = vc
            5 collect_dt_tm = dq8
            5 collect_dt_tm_ind = i2
            5 collect_method_cd = f8
            5 collect_method_cd_disp = vc
            5 collect_method_cd_mean = vc
            5 collect_loc_cd = f8
            5 collect_loc_cd_disp = vc
            5 collect_loc_cd_mean = vc
            5 collect_prsnl_id = f8
            5 collect_volume = f8
            5 collect_volume_ind = i2
            5 collect_unit_cd = f8
            5 collect_unit_cd_disp = vc
            5 collect_unit_cd_mean = vc
            5 collect_priority_cd = f8
            5 collect_priority_cd_disp = vc
            5 collect_priority_cd_mean = vc
            5 source_type_cd = f8
            5 source_type_cd_disp = vc
            5 source_type_cd_mean = vc
            5 source_text = vc
            5 body_site_cd = f8
            5 body_site_cd_disp = vc
            5 body_site_cd_mean = vc
            5 danger_cd = f8
            5 danger_cd_disp = vc
            5 danger_cd_mean = vc
            5 positive_ind = i2
            5 positive_ind_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 specimen_trans_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 transfer_dt_tm = dq8
            6 transfer_dt_tm_ind = i2
            6 transfer_prsnl_id = f8
            6 transfer_loc_cd = f8
            6 transfer_loc_cd_disp = vc
            6 receive_dt_tm = dq8
            6 receive_dt_tm_ind = i2
            6 receive_prsnl_id = f8
            6 receive_loc_cd = f8
            6 receive_loc_cd_disp = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            5 collect_tz = i4
            5 recvd_dt_tm = dq8
            5 recvd_tz = i4
          4 blob_result [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 max_sequence_nbr = i4
            5 max_sequence_nbr_ind = i2
            5 checksum = i4
            5 checksum_ind = i2
            5 succession_type_cd = f8
            5 succession_type_cd_disp = vc
            5 sub_series_ref_nbr = vc
            5 storage_cd = f8
            5 storage_cd_disp = vc
            5 format_cd = f8
            5 format_cd_disp = vc
            5 device_cd = f8
            5 device_cd_disp = vc
            5 blob_handle = vc
            5 blob_attributes = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 blob [*]
              6 event_id = f8
              6 blob_seq_num = i4
              6 blob_seq_num_ind = i2
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 blob_length = i4
              6 blob_length_ind = i2
              6 compression_cd = f8
              6 compression_cd_disp = vc
              6 blob_contents = gvc
              6 blob_contents_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 blob_summary [*]
              6 ce_blob_summary_id = f8
              6 blob_summary_id = f8
              6 blob_length = i4
              6 blob_length_ind = i2
              6 format_cd = f8
              6 compression_cd = f8
              6 checksum = i4
              6 checksum_ind = i2
              6 long_blob = gvc
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 event_id = f8
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_id = f8
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
          4 string_result [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 string_result_text = vc
            5 string_result_format_cd = f8
            5 string_result_format_cd_disp = vc
            5 equation_id = f8
            5 last_norm_dt_tm = dq8
            5 last_norm_dt_tm_ind = i2
            5 unit_of_measure_cd = f8
            5 unit_of_measure_cd_disp = vc
            5 feasible_ind = i2
            5 feasible_ind_ind = i2
            5 inaccurate_ind = i2
            5 inaccurate_ind_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
            5 calculation_equation = vc
            5 string_long_text_id = f8
          4 blood_transfuse [*]
            5 event_id = f8
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 transfuse_start_dt_tm = dq8
            5 transfuse_start_dt_tm_ind = i2
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 transfuse_end_dt_tm = dq8
            5 transfuse_end_dt_tm_ind = i2
            5 transfuse_note = vc
            5 transfuse_route_cd = f8
            5 transfuse_site_cd = f8
            5 transfuse_pt_loc_cd = f8
            5 initial_volume = f8
            5 total_intake_volume = f8
            5 transfusion_rate = f8
            5 transfusion_unit_cd = f8
            5 transfusion_time_cd = f8
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
          4 apparatus [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 apparatus_type_cd = f8
            5 apparatus_type_cd_disp = vc
            5 apparatus_serial_nbr = vc
            5 apparatus_size_cd = f8
            5 apparatus_size_cd_disp = vc
            5 body_site_cd = f8
            5 body_site_cd_disp = vc
            5 insertion_pt_loc_cd = f8
            5 insertion_pt_loc_cd_disp = vc
            5 insertion_prsnl_id = f8
            5 removal_pt_loc_cd = f8
            5 removal_pt_loc_cd_disp = vc
            5 removal_prsnl_id = f8
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 assistant_list [*]
            6 event_id = f8
            6 assistant_type_cd = f8
            6 assistant_type_cd_disp = vc
            6 assistant_type_cd_mean = vc
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 assistant_prsnl_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
          4 product [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 product_id = f8
            5 product_nbr = vc
            5 product_cd = f8
            5 product_cd_disp = vc
            5 product_cd_mean = vc
            5 abo_cd = f8
            5 abo_cd_disp = vc
            5 abo_cd_mean = vc
            5 rh_cd = f8
            5 rh_cd_disp = vc
            5 rh_cd_mean = vc
            5 product_status_cd = f8
            5 product_status_cd_disp = vc
            5 product_status_cd_mean = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 product_antigen_list [*]
            6 event_id = f8
            6 prod_ant_seq_nbr = i4
            6 prod_ant_seq_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 antigen_cd = f8
            6 antigen_cd_disp = vc
            6 antigen_cd_mean = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 attribute_ind = i2
            5 product_volume = f8
            5 product_volume_unit_cd = f8
            5 product_quantity = f8
            5 product_quantity_unit_cd = f8
            5 product_strength = f8
            5 product_strength_unit_cd = f8
          4 date_result [*]
            5 event_id = f8
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 result_dt_tm = dq8
            5 result_dt_tm_ind = i2
            5 result_dt_tm_os = f8
            5 result_dt_tm_os_ind = i2
            5 date_type_flag = i2
            5 date_type_flag_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 result_tz = i4
            5 result_tz_ind = i2
          4 med_result_list [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 admin_note = vc
            5 admin_prov_id = f8
            5 admin_start_dt_tm = dq8
            5 admin_start_dt_tm_ind = i2
            5 admin_end_dt_tm = dq8
            5 admin_end_dt_tm_ind = i2
            5 admin_route_cd = f8
            5 admin_route_cd_disp = vc
            5 admin_route_cd_mean = vc
            5 admin_site_cd = f8
            5 admin_site_cd_disp = vc
            5 admin_site_cd_mean = vc
            5 admin_method_cd = f8
            5 admin_method_cd_disp = vc
            5 admin_method_cd_mean = vc
            5 admin_pt_loc_cd = f8
            5 admin_pt_loc_cd_disp = vc
            5 admin_pt_loc_cd_mean = vc
            5 initial_dosage = f8
            5 initial_dosage_ind = i2
            5 admin_dosage = f8
            5 admin_dosage_ind = i2
            5 dosage_unit_cd = f8
            5 dosage_unit_cd_disp = vc
            5 dosage_unit_cd_mean = vc
            5 initial_volume = f8
            5 initial_volume_ind = i2
            5 total_intake_volume = f8
            5 total_intake_volume_ind = i2
            5 diluent_type_cd = f8
            5 diluent_type_cd_disp = vc
            5 diluent_type_cd_mean = vc
            5 ph_dispense_id = f8
            5 infusion_rate = f8
            5 infusion_rate_ind = i2
            5 infusion_unit_cd = f8
            5 infusion_unit_cd_disp = vc
            5 infusion_unit_cd_mean = vc
            5 infusion_time_cd = f8
            5 infusion_time_cd_disp = vc
            5 infusion_time_cd_mean = vc
            5 medication_form_cd = f8
            5 medication_form_cd_disp = vc
            5 medication_form_cd_mean = vc
            5 reason_required_flag = i2
            5 reason_required_flag_ind = i2
            5 response_required_flag = i2
            5 response_required_flag_ind = i2
            5 admin_strength = i4
            5 admin_strength_ind = i2
            5 admin_strength_unit_cd = f8
            5 admin_strength_unit_cd_disp = vc
            5 admin_strength_unit_cd_mean = vc
            5 substance_lot_number = vc
            5 substance_exp_dt_tm = dq8
            5 substance_exp_dt_tm_ind = i2
            5 substance_manufacturer_cd = f8
            5 substance_manufacturer_cd_disp = vc
            5 substance_manufacturer_cd_mean = vc
            5 refusal_cd = f8
            5 refusal_cd_disp = vc
            5 refusal_cd_mean = vc
            5 system_entry_dt_tm = dq8
            5 system_entry_dt_tm_ind = i2
            5 iv_event_cd = f8
            5 infused_volume = f8
            5 infused_volume_unit_cd = f8
            5 infused_volume_unit_cd_disp = vc
            5 infused_volume_unit_cd_mean = vc
            5 remaining_volume = f8
            5 remaining_volume_unit_cd = f8
            5 remaining_volume_unit_cd_disp = vc
            5 remaining_volume_unit_cd_mean = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 synonym_id = f8
            5 immunization_type_cd = f8
            5 immunization_type_cd_disp = vc
            5 immunization_type_cd_mean = vc
            5 admin_start_tz = i4
            5 admin_end_tz = i4
            5 contributor_link_list [*]
            6 event_id = f8
            6 contributor_event_id = f8
            6 ce_valid_from_dt_tm = dq8
            6 type_flag = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 ce_valid_until_dt_tm = dq8
            6 ce_result_value = vc
            6 ce_performed_prsnl_id = f8
            6 ce_event_end_dt_tm = dq8
            6 ce_event_cd = f8
            6 ce_event_cd_disp = vc
            6 ce_clinical_event_id = f8
            6 ce_event_class_cd = f8
            6 ce_event_class_cd_disp = vc
            6 string_result_list [*]
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 string_result_text = vc
              7 string_result_format_cd = f8
              7 string_result_format_cd_disp = vc
              7 equation_id = f8
              7 last_norm_dt_tm = dq8
              7 last_norm_dt_tm_ind = i2
              7 unit_of_measure_cd = f8
              7 unit_of_measure_cd_disp = vc
              7 feasible_ind = i2
              7 feasible_ind_ind = i2
              7 inaccurate_ind = i2
              7 inaccurate_ind_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 interp_comp_list [*]
              8 event_id = f8
              8 comp_idx = i4
              8 comp_idx_ind = i2
              8 valid_from_dt_tm = dq8
              8 valid_from_dt_tm_ind = i2
              8 valid_until_dt_tm = dq8
              8 valid_until_dt_tm_ind = i2
              8 comp_event_id = f8
              8 updt_dt_tm = dq8
              8 updt_dt_tm_ind = i2
              8 updt_id = f8
              8 updt_task = i4
              8 updt_task_ind = i2
              8 updt_cnt = i4
              8 updt_cnt_ind = i2
              8 updt_applctx = i4
              8 updt_applctx_ind = i2
              8 comp_name = vc
              7 calculation_equation = vc
              7 string_long_text_id = f8
            6 coded_result_list [*]
              7 event_id = f8
              7 sequence_nbr = i4
              7 sequence_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 nomenclature_id = f8
              7 result_set = i4
              7 result_set_ind = i2
              7 result_cd = f8
              7 result_cd_disp = vc
              7 acr_code_str = vc
              7 proc_code_str = vc
              7 pathology_str = vc
              7 group_nbr = i4
              7 group_nbr_ind = i2
              7 mnemonic = vc
              7 short_string = vc
              7 descriptor = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 unit_of_measure_cd = f8
              7 source_string = vc
            6 date_result_list [*]
              7 event_id = f8
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 result_dt_tm = dq8
              7 result_dt_tm_ind = i2
              7 result_dt_tm_os = f8
              7 result_dt_tm_os_ind = i2
              7 date_type_flag = i2
              7 date_type_flag_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 result_tz = i4
              7 result_tz_ind = i2
            6 ce_result_status_cd = f8
            6 ce_result_status_cd_disp = vc
            6 ce_event_end_tz = i4
            5 weight_value = f8
            5 weight_unit_cd = f8
          4 event_note_list [*]
            5 ce_event_note_id = f8
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 event_note_id = f8
            5 event_id = f8
            5 note_type_cd = f8
            5 note_type_cd_disp = vc
            5 note_type_cd_mean = vc
            5 note_format_cd = f8
            5 note_format_cd_disp = vc
            5 note_format_cd_mean = vc
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 entry_method_cd = f8
            5 entry_method_cd_disp = vc
            5 entry_method_cd_mean = vc
            5 note_prsnl_id = f8
            5 note_dt_tm = dq8
            5 note_dt_tm_ind = i2
            5 record_status_cd = f8
            5 record_status_cd_disp = vc
            5 record_status_cd_mean = vc
            5 compression_cd = f8
            5 compression_cd_disp = vc
            5 compression_cd_mean = vc
            5 checksum = i4
            5 checksum_ind = i2
            5 long_blob = gvc
            5 long_text = vc
            5 long_text_id = f8
            5 non_chartable_flag = i2
            5 importance_flag = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 note_tz = i4
          4 event_prsnl_list [*]
            5 ce_event_prsnl_id = f8
            5 event_prsnl_id = f8
            5 person_id = f8
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 action_type_cd = f8
            5 action_type_cd_disp = vc
            5 request_dt_tm = dq8
            5 request_dt_tm_ind = i2
            5 request_prsnl_id = f8
            5 request_prsnl_ft = vc
            5 request_comment = vc
            5 action_dt_tm = dq8
            5 action_dt_tm_ind = i2
            5 action_prsnl_id = f8
            5 action_prsnl_ft = vc
            5 proxy_prsnl_id = f8
            5 proxy_prsnl_ft = vc
            5 action_status_cd = f8
            5 action_status_cd_disp = vc
            5 action_comment = vc
            5 change_since_action_flag = i2
            5 change_since_action_flag_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 long_text_id = f8
            5 long_text = vc
            5 linked_event_id = f8
            5 request_tz = i4
            5 action_tz = i4
            5 system_comment = vc
            5 event_action_modifier_list [*]
            6 ce_event_action_modifier_id = f8
            6 event_action_modifier_id = f8
            6 event_id = f8
            6 event_prsnl_id = f8
            6 action_type_modifier_cd = f8
            6 action_type_modifier_cd_disp = vc
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            5 digital_signature_ident = vc
            5 action_prsnl_group_id = f8
            5 request_prsnl_group_id = f8
            5 receiving_person_id = f8
            5 receiving_person_ft = vc
          4 microbiology_list [*]
            5 event_id = f8
            5 micro_seq_nbr = i4
            5 micro_seq_nbr_ind = i2
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 organism_cd = f8
            5 organism_cd_disp = vc
            5 organism_cd_desc = vc
            5 organism_cd_mean = vc
            5 organism_occurrence_nbr = i4
            5 organism_occurrence_nbr_ind = i2
            5 organism_type_cd = f8
            5 organism_type_cd_disp = vc
            5 organism_type_cd_mean = vc
            5 observation_prsnl_id = f8
            5 biotype = vc
            5 probability = f8
            5 positive_ind = i2
            5 positive_ind_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 susceptibility_list [*]
            6 event_id = f8
            6 micro_seq_nbr = i4
            6 micro_seq_nbr_ind = i2
            6 suscep_seq_nbr = i4
            6 suscep_seq_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 susceptibility_test_cd = f8
            6 susceptibility_test_cd_disp = vc
            6 susceptibility_test_cd_mean = vc
            6 detail_susceptibility_cd = f8
            6 detail_susceptibility_cd_disp = vc
            6 detail_susceptibility_cd_mean = vc
            6 panel_antibiotic_cd = f8
            6 panel_antibiotic_cd_disp = vc
            6 panel_antibiotic_cd_mean = vc
            6 antibiotic_cd = f8
            6 antibiotic_cd_disp = vc
            6 antibiotic_cd_desc = vc
            6 antibiotic_cd_mean = vc
            6 diluent_volume = f8
            6 diluent_volume_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 result_cd_mean = vc
            6 result_text_value = vc
            6 result_numeric_value = f8
            6 result_numeric_value_ind = i2
            6 result_unit_cd = f8
            6 result_unit_cd_disp = vc
            6 result_unit_cd_mean = vc
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_prsnl_id = f8
            6 susceptibility_status_cd = f8
            6 susceptibility_status_cd_disp = vc
            6 susceptibility_status_cd_mean = vc
            6 abnormal_flag = i2
            6 abnormal_flag_ind = i2
            6 chartable_flag = i2
            6 chartable_flag_ind = i2
            6 nomenclature_id = f8
            6 antibiotic_note = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
          4 coded_result_list [*]
            5 event_id = f8
            5 sequence_nbr = i4
            5 sequence_nbr_ind = i2
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 nomenclature_id = f8
            5 result_set = i4
            5 result_set_ind = i2
            5 result_cd = f8
            5 result_cd_disp = vc
            5 acr_code_str = vc
            5 proc_code_str = vc
            5 pathology_str = vc
            5 group_nbr = i4
            5 group_nbr_ind = i2
            5 mnemonic = vc
            5 short_string = vc
            5 descriptor = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 unit_of_measure_cd = f8
            5 source_string = vc
          4 linked_result_list [*]
            5 linked_event_id = f8
            5 order_id = f8
            5 encntr_id = f8
            5 accession_nbr = vc
            5 contributor_system_cd = f8
            5 contributor_system_cd_disp = vc
            5 reference_nbr = vc
            5 event_class_cd = f8
            5 event_class_cd_disp = vc
            5 series_ref_nbr = vc
            5 sub_series_ref_nbr = vc
            5 succession_type_cd = f8
            5 succession_type_cd_disp = vc
            5 child_event [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_id = f8
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
          4 event_modifier_list [*]
            5 modifier_cd = f8
            5 modifier_cd_disp = vc
            5 modifier_value_cd = f8
            5 modifier_value_cd_disp = vc
            5 modifier_val_ft = vc
            5 modifier_value_person_id = f8
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_id = f8
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 group_sequence = i4
            5 item_sequence = i4
          4 suscep_footnote_r_list [*]
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 micro_seq_nbr = i4
            5 micro_seq_nbr_ind = i2
            5 suscep_seq_nbr = i4
            5 suscep_seq_nbr_ind = i2
            5 suscep_footnote_id = f8
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 suscep_footnote [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 ce_suscep_footnote_id = f8
            6 suscep_footnote_id = f8
            6 checksum = i4
            6 checksum_ind = i2
            6 compression_cd = f8
            6 format_cd = f8
            6 contributor_system_cd = f8
            6 blob_length = i4
            6 blob_length_ind = i2
            6 reference_nbr = vc
            6 long_blob = gvc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
          4 inventory_result_list [*]
            5 item_id = f8
            5 serial_nbr = vc
            5 serial_mnemonic = vc
            5 description = vc
            5 item_nbr = vc
            5 quantity = f8
            5 quantity_ind = i2
            5 body_site = vc
            5 reference_entity_id = f8
            5 reference_entity_name = vc
            5 implant_result [*]
            6 item_id = f8
            6 item_size = vc
            6 harvest_site = vc
            6 culture_ind = i2
            6 culture_ind_ind = i2
            6 tissue_graft_type_cd = f8
            6 tissue_graft_type_cd_disp = vc
            6 explant_reason_cd = f8
            6 explant_reason_cd_disp = vc
            6 explant_disposition_cd = f8
            6 explant_disposition_cd_disp = vc
            6 reference_entity_id = f8
            6 reference_entity_name = vc
            6 manufacturer_cd = f8
            6 manufacturer_cd_disp = vc
            6 manufacturer_ft = vc
            6 model_nbr = vc
            6 lot_nbr = vc
            6 other_identifier = vc
            6 expiration_dt_tm = dq8
            6 expiration_dt_tm_ind = i2
            6 ecri_code = vc
            6 batch_nbr = vc
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_id = f8
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            5 inv_time_result_list [*]
            6 item_id = f8
            6 start_dt_tm = dq8
            6 start_dt_tm_ind = i2
            6 end_dt_tm = dq8
            6 end_dt_tm_ind = i2
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_id = f8
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            5 event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_id = f8
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
          4 child_event_list [*]
          4 hla_list [*]
          4 order_action_sequence = i4
          4 entry_mode_cd = f8
          4 source_cd = f8
          4 source_cd_disp = vc
          4 source_cd_mean = vc
          4 clinical_seq = vc
          4 event_start_tz = i4
          4 event_end_tz = i4
          4 verified_tz = i4
          4 performed_tz = i4
          4 calculation_result_list [*]
            5 event_id = f8
            5 equation = vc
            5 calculation_result = vc
            5 calculation_result_frmt_cd = f8
            5 calculation_result_frmt_cd_disp = vc
            5 last_norm_dt_tm = dq8
            5 last_norm_dt_tm_ind = i2
            5 unit_of_measure_cd = f8
            5 unit_of_measure_cd_disp = vc
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 contributor_link_list [*]
            6 event_id = f8
            6 contributor_event_id = f8
            6 ce_valid_from_dt_tm = dq8
            6 type_flag = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 ce_valid_until_dt_tm = dq8
            6 ce_result_value = vc
            6 ce_performed_prsnl_id = f8
            6 ce_event_end_dt_tm = dq8
            6 ce_event_cd = f8
            6 ce_event_cd_disp = vc
            6 ce_clinical_event_id = f8
            6 ce_event_class_cd = f8
            6 ce_event_class_cd_disp = vc
            6 string_result_list [*]
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 string_result_text = vc
              7 string_result_format_cd = f8
              7 string_result_format_cd_disp = vc
              7 equation_id = f8
              7 last_norm_dt_tm = dq8
              7 last_norm_dt_tm_ind = i2
              7 unit_of_measure_cd = f8
              7 unit_of_measure_cd_disp = vc
              7 feasible_ind = i2
              7 feasible_ind_ind = i2
              7 inaccurate_ind = i2
              7 inaccurate_ind_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 interp_comp_list [*]
              8 event_id = f8
              8 comp_idx = i4
              8 comp_idx_ind = i2
              8 valid_from_dt_tm = dq8
              8 valid_from_dt_tm_ind = i2
              8 valid_until_dt_tm = dq8
              8 valid_until_dt_tm_ind = i2
              8 comp_event_id = f8
              8 updt_dt_tm = dq8
              8 updt_dt_tm_ind = i2
              8 updt_id = f8
              8 updt_task = i4
              8 updt_task_ind = i2
              8 updt_cnt = i4
              8 updt_cnt_ind = i2
              8 updt_applctx = i4
              8 updt_applctx_ind = i2
              8 comp_name = vc
              7 calculation_equation = vc
              7 string_long_text_id = f8
            6 coded_result_list [*]
              7 event_id = f8
              7 sequence_nbr = i4
              7 sequence_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 nomenclature_id = f8
              7 result_set = i4
              7 result_set_ind = i2
              7 result_cd = f8
              7 result_cd_disp = vc
              7 acr_code_str = vc
              7 proc_code_str = vc
              7 pathology_str = vc
              7 group_nbr = i4
              7 group_nbr_ind = i2
              7 mnemonic = vc
              7 short_string = vc
              7 descriptor = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 unit_of_measure_cd = f8
              7 source_string = vc
            6 date_result_list [*]
              7 event_id = f8
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 result_dt_tm = dq8
              7 result_dt_tm_ind = i2
              7 result_dt_tm_os = f8
              7 result_dt_tm_os_ind = i2
              7 date_type_flag = i2
              7 date_type_flag_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 result_tz = i4
              7 result_tz_ind = i2
            6 ce_result_status_cd = f8
            6 ce_result_status_cd_disp = vc
            6 ce_event_end_tz = i4
          4 task_assay_version_nbr = f8
          4 modifier_long_text = vc
          4 modifier_long_text_id = f8
          4 result_set_link_list [*]
            5 event_id = f8
            5 result_set_id = f8
            5 entry_type_cd = f8
            5 entry_type_cd_disp = vc
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 relation_type_cd = f8
          4 event_order_link_list [*]
            5 event_id = f8
            5 order_id = f8
            5 order_action_sequence = i4
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 template_order_id = f8
            5 event_end_dt_tm = dq8
            5 parent_order_ident = f8
            5 person_id = f8
            5 encntr_id = f8
            5 catalog_type_cd = f8
            5 ce_event_order_link_id = f8
          4 scd_modifier_list [*]
            5 event_id = f8
            5 concept_cki = vc
            5 phrase = vc
            5 display = vc
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 valid_from_dt_tm = dq8
          4 endorse_ind = i2
          4 new_result_ind = i2
          4 organization_id = f8
          4 intake_output_result [*]
            5 ce_io_result_id = f8
            5 io_result_id = f8
            5 event_id = f8
            5 person_id = f8
            5 encntr_id = f8
            5 io_start_dt_tm = dq8
            5 io_start_dt_tm_ind = i2
            5 io_end_dt_tm = dq8
            5 io_end_dt_tm_ind = i2
            5 io_type_flag = i2
            5 io_volume = f8
            5 io_status_cd = f8
            5 io_status_cd_disp = vc
            5 io_status_cd_mean = vc
            5 reference_event_id = f8
            5 reference_event_cd = f8
            5 reference_event_cd_disp = vc
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
          4 io_total_result_list [*]
            5 ce_io_total_result_id = f8
            5 io_total_definition_id = f8
            5 event_id = f8
            5 encntr_id = f8
            5 encntr_focused_ind = i2
            5 person_id = f8
            5 io_total_start_dt_tm = dq8
            5 io_total_end_dt_tm = dq8
            5 io_total_value = f8
            5 io_total_unit_cd = f8
            5 io_total_unit_disp = vc
            5 io_total_unit_mean = vc
            5 suspect_flag = i2
            5 last_io_result_clinsig_dt_tm = dq8
            5 valid_from_dt_tm = dq8
            5 valid_until_dt_tm = dq8
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 contributor_link_list [*]
            6 event_id = f8
            6 contributor_event_id = f8
            6 ce_valid_from_dt_tm = dq8
            6 type_flag = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 ce_valid_until_dt_tm = dq8
            6 ce_result_value = vc
            6 ce_performed_prsnl_id = f8
            6 ce_event_end_dt_tm = dq8
            6 ce_event_cd = f8
            6 ce_event_cd_disp = vc
            6 ce_clinical_event_id = f8
            6 ce_event_class_cd = f8
            6 ce_event_class_cd_disp = vc
            6 string_result_list [*]
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 string_result_text = vc
              7 string_result_format_cd = f8
              7 string_result_format_cd_disp = vc
              7 equation_id = f8
              7 last_norm_dt_tm = dq8
              7 last_norm_dt_tm_ind = i2
              7 unit_of_measure_cd = f8
              7 unit_of_measure_cd_disp = vc
              7 feasible_ind = i2
              7 feasible_ind_ind = i2
              7 inaccurate_ind = i2
              7 inaccurate_ind_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 interp_comp_list [*]
              8 event_id = f8
              8 comp_idx = i4
              8 comp_idx_ind = i2
              8 valid_from_dt_tm = dq8
              8 valid_from_dt_tm_ind = i2
              8 valid_until_dt_tm = dq8
              8 valid_until_dt_tm_ind = i2
              8 comp_event_id = f8
              8 updt_dt_tm = dq8
              8 updt_dt_tm_ind = i2
              8 updt_id = f8
              8 updt_task = i4
              8 updt_task_ind = i2
              8 updt_cnt = i4
              8 updt_cnt_ind = i2
              8 updt_applctx = i4
              8 updt_applctx_ind = i2
              8 comp_name = vc
              7 calculation_equation = vc
              7 string_long_text_id = f8
            6 coded_result_list [*]
              7 event_id = f8
              7 sequence_nbr = i4
              7 sequence_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 nomenclature_id = f8
              7 result_set = i4
              7 result_set_ind = i2
              7 result_cd = f8
              7 result_cd_disp = vc
              7 acr_code_str = vc
              7 proc_code_str = vc
              7 pathology_str = vc
              7 group_nbr = i4
              7 group_nbr_ind = i2
              7 mnemonic = vc
              7 short_string = vc
              7 descriptor = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 unit_of_measure_cd = f8
              7 source_string = vc
            6 date_result_list [*]
              7 event_id = f8
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 result_dt_tm = dq8
              7 result_dt_tm_ind = i2
              7 result_dt_tm_os = f8
              7 result_dt_tm_os_ind = i2
              7 date_type_flag = i2
              7 date_type_flag_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 result_tz = i4
              7 result_tz_ind = i2
            6 ce_result_status_cd = f8
            6 ce_result_status_cd_disp = vc
            6 ce_event_end_tz = i4
            5 io_total_result_val = vc
          4 src_event_id = f8
          4 src_clinsig_updt_dt_tm = dq8
          4 nomen_string_flag = i2
          4 ce_dynamic_label_id = f8
          4 dynamic_label_list [*]
            5 ce_dynamic_label_id = f8
            5 label_name = vc
            5 label_prsnl_id = f8
            5 label_status_cd = f8
            5 label_seq_nbr = i4
            5 valid_from_dt_tm = dq8
            5 label_comment = vc
          4 device_free_txt = vc
          4 trait_bit_map = i4
      3 hla_list [*]
      3 order_action_sequence = i4
      3 entry_mode_cd = f8
      3 source_cd = f8
      3 source_cd_disp = vc
      3 source_cd_mean = vc
      3 clinical_seq = vc
      3 event_start_tz = i4
      3 event_end_tz = i4
      3 verified_tz = i4
      3 performed_tz = i4
      3 calculation_result_list [*]
        4 event_id = f8
        4 equation = vc
        4 calculation_result = vc
        4 calculation_result_frmt_cd = f8
        4 calculation_result_frmt_cd_disp = vc
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 contributor_link_list [*]
        5 event_id = f8
        5 contributor_event_id = f8
        5 ce_valid_from_dt_tm = dq8
        5 type_flag = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 ce_valid_until_dt_tm = dq8
        5 ce_result_value = vc
        5 ce_performed_prsnl_id = f8
        5 ce_event_end_dt_tm = dq8
        5 ce_event_cd = f8
        5 ce_event_cd_disp = vc
        5 ce_clinical_event_id = f8
        5 ce_event_class_cd = f8
        5 ce_event_class_cd_disp = vc
        5 string_result_list [*]
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 string_result_text = vc
          6 string_result_format_cd = f8
          6 string_result_format_cd_disp = vc
          6 equation_id = f8
          6 last_norm_dt_tm = dq8
          6 last_norm_dt_tm_ind = i2
          6 unit_of_measure_cd = f8
          6 unit_of_measure_cd_disp = vc
          6 feasible_ind = i2
          6 feasible_ind_ind = i2
          6 inaccurate_ind = i2
          6 inaccurate_ind_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 interp_comp_list [*]
          7 event_id = f8
          7 comp_idx = i4
          7 comp_idx_ind = i2
          7 valid_from_dt_tm = dq8
          7 valid_from_dt_tm_ind = i2
          7 valid_until_dt_tm = dq8
          7 valid_until_dt_tm_ind = i2
          7 comp_event_id = f8
          7 updt_dt_tm = dq8
          7 updt_dt_tm_ind = i2
          7 updt_id = f8
          7 updt_task = i4
          7 updt_task_ind = i2
          7 updt_cnt = i4
          7 updt_cnt_ind = i2
          7 updt_applctx = i4
          7 updt_applctx_ind = i2
          7 comp_name = vc
          6 calculation_equation = vc
          6 string_long_text_id = f8
        5 coded_result_list [*]
          6 event_id = f8
          6 sequence_nbr = i4
          6 sequence_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 nomenclature_id = f8
          6 result_set = i4
          6 result_set_ind = i2
          6 result_cd = f8
          6 result_cd_disp = vc
          6 acr_code_str = vc
          6 proc_code_str = vc
          6 pathology_str = vc
          6 group_nbr = i4
          6 group_nbr_ind = i2
          6 mnemonic = vc
          6 short_string = vc
          6 descriptor = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 unit_of_measure_cd = f8
          6 source_string = vc
        5 date_result_list [*]
          6 event_id = f8
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 result_dt_tm = dq8
          6 result_dt_tm_ind = i2
          6 result_dt_tm_os = f8
          6 result_dt_tm_os_ind = i2
          6 date_type_flag = i2
          6 date_type_flag_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 result_tz = i4
          6 result_tz_ind = i2
        5 ce_result_status_cd = f8
        5 ce_result_status_cd_disp = vc
        5 ce_event_end_tz = i4
      3 task_assay_version_nbr = f8
      3 modifier_long_text = vc
      3 modifier_long_text_id = f8
      3 result_set_link_list [*]
        4 event_id = f8
        4 result_set_id = f8
        4 entry_type_cd = f8
        4 entry_type_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 relation_type_cd = f8
      3 event_order_link_list [*]
        4 event_id = f8
        4 order_id = f8
        4 order_action_sequence = i4
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 template_order_id = f8
        4 event_end_dt_tm = dq8
        4 parent_order_ident = f8
        4 person_id = f8
        4 encntr_id = f8
        4 catalog_type_cd = f8
        4 ce_event_order_link_id = f8
      3 scd_modifier_list [*]
        4 event_id = f8
        4 concept_cki = vc
        4 phrase = vc
        4 display = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 valid_from_dt_tm = dq8
      3 endorse_ind = i2
      3 new_result_ind = i2
      3 organization_id = f8
      3 intake_output_result [*]
        4 ce_io_result_id = f8
        4 io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 encntr_id = f8
        4 io_start_dt_tm = dq8
        4 io_start_dt_tm_ind = i2
        4 io_end_dt_tm = dq8
        4 io_end_dt_tm_ind = i2
        4 io_type_flag = i2
        4 io_volume = f8
        4 io_status_cd = f8
        4 io_status_cd_disp = vc
        4 io_status_cd_mean = vc
        4 reference_event_id = f8
        4 reference_event_cd = f8
        4 reference_event_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 io_total_result_list [*]
        4 ce_io_total_result_id = f8
        4 io_total_definition_id = f8
        4 event_id = f8
        4 encntr_id = f8
        4 encntr_focused_ind = i2
        4 person_id = f8
        4 io_total_start_dt_tm = dq8
        4 io_total_end_dt_tm = dq8
        4 io_total_value = f8
        4 io_total_unit_cd = f8
        4 io_total_unit_disp = vc
        4 io_total_unit_mean = vc
        4 suspect_flag = i2
        4 last_io_result_clinsig_dt_tm = dq8
        4 valid_from_dt_tm = dq8
        4 valid_until_dt_tm = dq8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 contributor_link_list [*]
        5 event_id = f8
        5 contributor_event_id = f8
        5 ce_valid_from_dt_tm = dq8
        5 type_flag = i2
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        5 ce_valid_until_dt_tm = dq8
        5 ce_result_value = vc
        5 ce_performed_prsnl_id = f8
        5 ce_event_end_dt_tm = dq8
        5 ce_event_cd = f8
        5 ce_event_cd_disp = vc
        5 ce_clinical_event_id = f8
        5 ce_event_class_cd = f8
        5 ce_event_class_cd_disp = vc
        5 string_result_list [*]
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 string_result_text = vc
          6 string_result_format_cd = f8
          6 string_result_format_cd_disp = vc
          6 equation_id = f8
          6 last_norm_dt_tm = dq8
          6 last_norm_dt_tm_ind = i2
          6 unit_of_measure_cd = f8
          6 unit_of_measure_cd_disp = vc
          6 feasible_ind = i2
          6 feasible_ind_ind = i2
          6 inaccurate_ind = i2
          6 inaccurate_ind_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 interp_comp_list [*]
          7 event_id = f8
          7 comp_idx = i4
          7 comp_idx_ind = i2
          7 valid_from_dt_tm = dq8
          7 valid_from_dt_tm_ind = i2
          7 valid_until_dt_tm = dq8
          7 valid_until_dt_tm_ind = i2
          7 comp_event_id = f8
          7 updt_dt_tm = dq8
          7 updt_dt_tm_ind = i2
          7 updt_id = f8
          7 updt_task = i4
          7 updt_task_ind = i2
          7 updt_cnt = i4
          7 updt_cnt_ind = i2
          7 updt_applctx = i4
          7 updt_applctx_ind = i2
          7 comp_name = vc
          6 calculation_equation = vc
          6 string_long_text_id = f8
        5 coded_result_list [*]
          6 event_id = f8
          6 sequence_nbr = i4
          6 sequence_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 nomenclature_id = f8
          6 result_set = i4
          6 result_set_ind = i2
          6 result_cd = f8
          6 result_cd_disp = vc
          6 acr_code_str = vc
          6 proc_code_str = vc
          6 pathology_str = vc
          6 group_nbr = i4
          6 group_nbr_ind = i2
          6 mnemonic = vc
          6 short_string = vc
          6 descriptor = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 unit_of_measure_cd = f8
          6 source_string = vc
        5 date_result_list [*]
          6 event_id = f8
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 result_dt_tm = dq8
          6 result_dt_tm_ind = i2
          6 result_dt_tm_os = f8
          6 result_dt_tm_os_ind = i2
          6 date_type_flag = i2
          6 date_type_flag_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 result_tz = i4
          6 result_tz_ind = i2
        5 ce_result_status_cd = f8
        5 ce_result_status_cd_disp = vc
        5 ce_event_end_tz = i4
        4 io_total_result_val = vc
      3 src_event_id = f8
      3 src_clinsig_updt_dt_tm = dq8
      3 nomen_string_flag = i2
      3 ce_dynamic_label_id = f8
      3 dynamic_label_list [*]
        4 ce_dynamic_label_id = f8
        4 label_name = vc
        4 label_prsnl_id = f8
        4 label_status_cd = f8
        4 label_seq_nbr = i4
        4 valid_from_dt_tm = dq8
        4 label_comment = vc
      3 device_free_txt = vc
      3 trait_bit_map = i4
    2 hla_list [*]
    2 order_action_sequence = i4
    2 entry_mode_cd = f8
    2 source_cd = f8
    2 source_cd_disp = vc
    2 source_cd_mean = vc
    2 clinical_seq = vc
    2 event_start_tz = i4
    2 event_end_tz = i4
    2 verified_tz = i4
    2 performed_tz = i4
    2 calculation_result_list [*]
      3 event_id = f8
      3 equation = vc
      3 calculation_result = vc
      3 calculation_result_frmt_cd = f8
      3 calculation_result_frmt_cd_disp = vc
      3 last_norm_dt_tm = dq8
      3 last_norm_dt_tm_ind = i2
      3 unit_of_measure_cd = f8
      3 unit_of_measure_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
    2 task_assay_version_nbr = f8
    2 modifier_long_text = vc
    2 modifier_long_text_id = f8
    2 result_set_link_list [*]
      3 event_id = f8
      3 result_set_id = f8
      3 entry_type_cd = f8
      3 entry_type_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 relation_type_cd = f8
    2 event_order_link_list [*]
      3 event_id = f8
      3 order_id = f8
      3 order_action_sequence = i4
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 template_order_id = f8
      3 event_end_dt_tm = dq8
      3 parent_order_ident = f8
      3 person_id = f8
      3 encntr_id = f8
      3 catalog_type_cd = f8
      3 ce_event_order_link_id = f8
    2 scd_modifier_list [*]
      3 event_id = f8
      3 concept_cki = vc
      3 phrase = vc
      3 display = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 valid_from_dt_tm = dq8
    2 endorse_ind = i2
    2 new_result_ind = i2
    2 organization_id = f8
    2 intake_output_result [*]
      3 ce_io_result_id = f8
      3 io_result_id = f8
      3 event_id = f8
      3 person_id = f8
      3 encntr_id = f8
      3 io_start_dt_tm = dq8
      3 io_start_dt_tm_ind = i2
      3 io_end_dt_tm = dq8
      3 io_end_dt_tm_ind = i2
      3 io_type_flag = i2
      3 io_volume = f8
      3 io_status_cd = f8
      3 io_status_cd_disp = vc
      3 io_status_cd_mean = vc
      3 reference_event_id = f8
      3 reference_event_cd = f8
      3 reference_event_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 io_total_result_list [*]
      3 ce_io_total_result_id = f8
      3 io_total_definition_id = f8
      3 event_id = f8
      3 encntr_id = f8
      3 encntr_focused_ind = i2
      3 person_id = f8
      3 io_total_start_dt_tm = dq8
      3 io_total_end_dt_tm = dq8
      3 io_total_value = f8
      3 io_total_unit_cd = f8
      3 io_total_unit_disp = vc
      3 io_total_unit_mean = vc
      3 suspect_flag = i2
      3 last_io_result_clinsig_dt_tm = dq8
      3 valid_from_dt_tm = dq8
      3 valid_until_dt_tm = dq8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
      3 io_total_result_val = vc
    2 src_event_id = f8
    2 src_clinsig_updt_dt_tm = dq8
    2 nomen_string_flag = i2
    2 ce_dynamic_label_id = f8
    2 dynamic_label_list [*]
      3 ce_dynamic_label_id = f8
      3 label_name = vc
      3 label_prsnl_id = f8
      3 label_status_cd = f8
      3 label_seq_nbr = i4
      3 valid_from_dt_tm = dq8
      3 label_comment = vc
    2 device_free_txt = vc
    2 trait_bit_map = i4
  1 person_list [*]
    2 person_id = f8
    2 name_full_formatted = vc
    2 prsnl_name_full_formatted = vc
)
 
free record event_detail_batch_query_1000079_req
record event_detail_batch_query_1000079_req (
  1 req_list [*]
    2 query_mode  = i4
    2 query_mode_ind = i2
    2 event_id = f8
    2 contributor_system_cd = f8
    2 reference_nbr = vc
    2 dataset_uid = vc
    2 subtable_bit_map = i4
    2 subtable_bit_map_ind = i2
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 decode_flag = i2
    2 ordering_provider_id = f8
    2 action_prsnl_id = f8
    2 event_id_list [*]
      3 event_id = f8
    2 action_type_cd_list [*]
      3 action_type_cd = f8
    2 src_event_id_ind = i2
    2 action_prsnl_group_id = f8
    2 query_mode2  = i4
    2 event_uuid = vc
)
 
free record event_detail_batch_query_1000079_rep
record event_detail_batch_query_1000079_rep (
  1 sb
      2 severityCd = i4
      2 statusCd = i4
      2 statusText = vc
      2 subStatusList [*]
        3 subStatusCd = i4
  1 rep_list [*]
    2 sb
      3 severityCd = i4
      3 statusCd = i4
      3 statusText = vc
      3 subStatusList [*]
        4 subStatusCd = i4
    2 rb_list [*]
      3 clinical_event_id = f8
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 clinsig_updt_dt_tm = dq8
      3 clinsig_updt_dt_tm_ind = i2
      3 view_level = i4
      3 view_level_ind = i2
      3 order_id = f8
      3 catalog_cd = f8
      3 catalog_cd_disp = vc
      3 series_ref_nbr = vc
      3 person_id = f8
      3 encntr_id = f8
      3 encntr_financial_id = f8
      3 accession_nbr = vc
      3 contributor_system_cd = f8
      3 contributor_system_cd_disp = vc
      3 reference_nbr = vc
      3 parent_event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 event_class_cd = f8
      3 event_class_cd_disp = vc
      3 event_cd = f8
      3 event_cd_disp = vc
      3 event_cd_desc = vc
      3 event_tag = vc
      3 event_reltn_cd = f8
      3 event_reltn_cd_disp = vc
      3 event_start_dt_tm = dq8
      3 event_start_dt_tm_ind = i2
      3 event_end_dt_tm = dq8
      3 event_end_dt_tm_ind = i2
      3 event_end_dt_tm_os = f8
      3 event_end_dt_tm_os_ind = i2
      3 task_assay_cd = f8
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 result_status_cd = f8
      3 result_status_cd_disp = vc
      3 authentic_flag = i2
      3 authentic_flag_ind = i2
      3 publish_flag = i2
      3 publish_flag_ind = i2
      3 qc_review_cd = f8
      3 qc_review_cd_disp = vc
      3 normalcy_cd = f8
      3 normalcy_cd_disp = vc
      3 normalcy_cd_mean = vc
      3 normalcy_method_cd = f8
      3 normalcy_method_cd_disp = vc
      3 inquire_security_cd = f8
      3 inquire_security_cd_disp = vc
      3 resource_group_cd = f8
      3 resource_group_cd_disp = vc
      3 resource_cd = f8
      3 resource_cd_disp = vc
      3 subtable_bit_map = i4
      3 subtable_bit_map_ind = i2
      3 event_title_text = vc
      3 collating_seq = vc
      3 result_val = vc
      3 result_units_cd = f8
      3 result_units_cd_disp = vc
      3 result_time_units_cd = f8
      3 result_time_units_cd_disp = vc
      3 verified_dt_tm = dq8
      3 verified_dt_tm_ind = i2
      3 verified_prsnl_id = f8
      3 performed_dt_tm = dq8
      3 performed_dt_tm_ind = i2
      3 performed_prsnl_id = f8
      3 normal_low = vc
      3 normal_high = vc
      3 critical_low = vc
      3 critical_high = vc
      3 expiration_dt_tm = dq8
      3 expiration_dt_tm_ind = i2
      3 note_importance_bit_map = i2
      3 event_tag_set_flag = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 io_result [*]
        4 ce_io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 io_dt_tm = dq8
        4 io_dt_tm_ind = i2
        4 type_cd = f8
        4 type_cd_disp = vc
        4 type_cd_mean = vc
        4 group_cd = f8
        4 group_cd_disp = vc
        4 group_cd_mean = vc
        4 volume = f8
        4 volume_ind = i2
        4 authentic_flag = i2
        4 authentic_flag_ind = i2
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 record_status_cd_mean = vc
        4 io_comment = vc
        4 system_note = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 specimen_coll [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 specimen_id = f8
        4 container_id = f8
        4 container_type_cd = f8
        4 container_type_cd_disp = vc
        4 container_type_cd_mean = vc
        4 specimen_status_cd = f8
        4 specimen_status_cd_disp = vc
        4 specimen_status_cd_mean = vc
        4 collect_dt_tm = dq8
        4 collect_dt_tm_ind = i2
        4 collect_method_cd = f8
        4 collect_method_cd_disp = vc
        4 collect_method_cd_mean = vc
        4 collect_loc_cd = f8
        4 collect_loc_cd_disp = vc
        4 collect_loc_cd_mean = vc
        4 collect_prsnl_id = f8
        4 collect_volume = f8
        4 collect_volume_ind = i2
        4 collect_unit_cd = f8
        4 collect_unit_cd_disp = vc
        4 collect_unit_cd_mean = vc
        4 collect_priority_cd = f8
        4 collect_priority_cd_disp = vc
        4 collect_priority_cd_mean = vc
        4 source_type_cd = f8
        4 source_type_cd_disp = vc
        4 source_type_cd_mean = vc
        4 source_text = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 body_site_cd_mean = vc
        4 danger_cd = f8
        4 danger_cd_disp = vc
        4 danger_cd_mean = vc
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 specimen_trans_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 transfer_dt_tm = dq8
          5 transfer_dt_tm_ind = i2
          5 transfer_prsnl_id = f8
          5 transfer_loc_cd = f8
          5 transfer_loc_cd_disp = vc
          5 receive_dt_tm = dq8
          5 receive_dt_tm_ind = i2
          5 receive_prsnl_id = f8
          5 receive_loc_cd = f8
          5 receive_loc_cd_disp = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 collect_tz = i4
        4 recvd_dt_tm = dq8
        4 recvd_tz = i4
      3 blob_result [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 max_sequence_nbr = i4
        4 max_sequence_nbr_ind = i2
        4 checksum = i4
        4 checksum_ind = i2
        4 succession_type_cd = f8
        4 succession_type_cd_disp = vc
        4 sub_series_ref_nbr = vc
        4 storage_cd = f8
        4 storage_cd_disp = vc
        4 format_cd = f8
        4 format_cd_disp = vc
        4 device_cd = f8
        4 device_cd_disp = vc
        4 blob_handle = vc
        4 blob_attributes = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 blob [*]
          5 event_id = f8
          5 blob_seq_num = i4
          5 blob_seq_num_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 blob_length = i4
          5 blob_length_ind = i2
          5 compression_cd = f8
          5 compression_cd_disp = vc
          5 blob_contents = gvc
          5 blob_contents_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 blob_summary [*]
          5 ce_blob_summary_id = f8
          5 blob_summary_id = f8
          5 blob_length = i4
          5 blob_length_ind = i2
          5 format_cd = f8
          5 compression_cd = f8
          5 checksum = i4
          5 checksum_ind = i2
          5 long_blob = gvc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 event_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
      3 string_result [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 string_result_text = vc
        4 string_result_format_cd = f8
        4 string_result_format_cd_disp = vc
        4 equation_id = f8
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
        4 feasible_ind = i2
        4 feasible_ind_ind = i2
        4 inaccurate_ind = i2
        4 inaccurate_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 interp_comp_list [*]
          5 event_id = f8
          5 comp_idx = i4
          5 comp_idx_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 comp_event_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 comp_name = vc
        4 calculation_equation = vc
        4 string_long_text_id = f8
      3 blood_transfuse [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 transfuse_start_dt_tm = dq8
        4 transfuse_start_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 transfuse_end_dt_tm = dq8
        4 transfuse_end_dt_tm_ind = i2
        4 transfuse_note = vc
        4 transfuse_route_cd = f8
        4 transfuse_site_cd = f8
        4 transfuse_pt_loc_cd = f8
        4 initial_volume = f8
        4 total_intake_volume = f8
        4 transfusion_rate = f8
        4 transfusion_unit_cd = f8
        4 transfusion_time_cd = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 apparatus [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 apparatus_type_cd = f8
        4 apparatus_type_cd_disp = vc
        4 apparatus_serial_nbr = vc
        4 apparatus_size_cd = f8
        4 apparatus_size_cd_disp = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 insertion_pt_loc_cd = f8
        4 insertion_pt_loc_cd_disp = vc
        4 insertion_prsnl_id = f8
        4 removal_pt_loc_cd = f8
        4 removal_pt_loc_cd_disp = vc
        4 removal_prsnl_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 assistant_list [*]
          5 event_id = f8
          5 assistant_type_cd = f8
          5 assistant_type_cd_disp = vc
          5 assistant_type_cd_mean = vc
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 assistant_prsnl_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
      3 product [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 product_id = f8
        4 product_nbr = vc
        4 product_cd = f8
        4 product_cd_disp = vc
        4 product_cd_mean = vc
        4 abo_cd = f8
        4 abo_cd_disp = vc
        4 abo_cd_mean = vc
        4 rh_cd = f8
        4 rh_cd_disp = vc
        4 rh_cd_mean = vc
        4 product_status_cd = f8
        4 product_status_cd_disp = vc
        4 product_status_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 product_antigen_list [*]
          5 event_id = f8
          5 prod_ant_seq_nbr = i4
          5 prod_ant_seq_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 antigen_cd = f8
          5 antigen_cd_disp = vc
          5 antigen_cd_mean = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 attribute_ind = i2
        4 product_volume = f8
        4 product_volume_unit_cd = f8
        4 product_quantity = f8
        4 product_quantity_unit_cd = f8
        4 product_strength = f8
        4 product_strength_unit_cd = f8
      3 date_result [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 result_dt_tm = dq8
        4 result_dt_tm_ind = i2
        4 result_dt_tm_os = f8
        4 result_dt_tm_os_ind = i2
        4 date_type_flag = i2
        4 date_type_flag_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 result_tz = i4
        4 result_tz_ind = i2
      3 med_result_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 admin_note = vc
        4 admin_prov_id = f8
        4 admin_start_dt_tm = dq8
        4 admin_start_dt_tm_ind = i2
        4 admin_end_dt_tm = dq8
        4 admin_end_dt_tm_ind = i2
        4 admin_route_cd = f8
        4 admin_route_cd_disp = vc
        4 admin_route_cd_mean = vc
        4 admin_site_cd = f8
        4 admin_site_cd_disp = vc
        4 admin_site_cd_mean = vc
        4 admin_method_cd = f8
        4 admin_method_cd_disp = vc
        4 admin_method_cd_mean = vc
        4 admin_pt_loc_cd = f8
        4 admin_pt_loc_cd_disp = vc
        4 admin_pt_loc_cd_mean = vc
        4 initial_dosage = f8
        4 initial_dosage_ind = i2
        4 admin_dosage = f8
        4 admin_dosage_ind = i2
        4 dosage_unit_cd = f8
        4 dosage_unit_cd_disp = vc
        4 dosage_unit_cd_mean = vc
        4 initial_volume = f8
        4 initial_volume_ind = i2
        4 total_intake_volume = f8
        4 total_intake_volume_ind = i2
        4 diluent_type_cd = f8
        4 diluent_type_cd_disp = vc
        4 diluent_type_cd_mean = vc
        4 ph_dispense_id = f8
        4 infusion_rate = f8
        4 infusion_rate_ind = i2
        4 infusion_unit_cd = f8
        4 infusion_unit_cd_disp = vc
        4 infusion_unit_cd_mean = vc
        4 infusion_time_cd = f8
        4 infusion_time_cd_disp = vc
        4 infusion_time_cd_mean = vc
        4 medication_form_cd = f8
        4 medication_form_cd_disp = vc
        4 medication_form_cd_mean = vc
        4 reason_required_flag = i2
        4 reason_required_flag_ind = i2
        4 response_required_flag = i2
        4 response_required_flag_ind = i2
        4 admin_strength = i4
        4 admin_strength_ind = i2
        4 admin_strength_unit_cd = f8
        4 admin_strength_unit_cd_disp = vc
        4 admin_strength_unit_cd_mean = vc
        4 substance_lot_number = vc
        4 substance_exp_dt_tm = dq8
        4 substance_exp_dt_tm_ind = i2
        4 substance_manufacturer_cd = f8
        4 substance_manufacturer_cd_disp = vc
        4 substance_manufacturer_cd_mean = vc
        4 refusal_cd = f8
        4 refusal_cd_disp = vc
        4 refusal_cd_mean = vc
        4 system_entry_dt_tm = dq8
        4 system_entry_dt_tm_ind = i2
        4 iv_event_cd = f8
        4 infused_volume = f8
        4 infused_volume_unit_cd = f8
        4 infused_volume_unit_cd_disp = vc
        4 infused_volume_unit_cd_mean = vc
        4 remaining_volume = f8
        4 remaining_volume_unit_cd = f8
        4 remaining_volume_unit_cd_disp = vc
        4 remaining_volume_unit_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 synonym_id = f8
        4 immunization_type_cd = f8
        4 immunization_type_cd_disp = vc
        4 immunization_type_cd_mean = vc
        4 admin_start_tz = i4
        4 admin_end_tz = i4
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
        4 weight_value = f8
        4 weight_unit_cd = f8
      3 event_note_list [*]
        4 ce_event_note_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 event_note_id = f8
        4 event_id = f8
        4 note_type_cd = f8
        4 note_type_cd_disp = vc
        4 note_type_cd_mean = vc
        4 note_format_cd = f8
        4 note_format_cd_disp = vc
        4 note_format_cd_mean = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 entry_method_cd = f8
        4 entry_method_cd_disp = vc
        4 entry_method_cd_mean = vc
        4 note_prsnl_id = f8
        4 note_dt_tm = dq8
        4 note_dt_tm_ind = i2
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 record_status_cd_mean = vc
        4 compression_cd = f8
        4 compression_cd_disp = vc
        4 compression_cd_mean = vc
        4 checksum = i4
        4 checksum_ind = i2
        4 long_blob = gvc
        4 long_text = vc
        4 long_text_id = f8
        4 non_chartable_flag = i2
        4 importance_flag = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 note_tz = i4
      3 event_prsnl_list [*]
        4 ce_event_prsnl_id = f8
        4 event_prsnl_id = f8
        4 person_id = f8
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 action_type_cd = f8
        4 action_type_cd_disp = vc
        4 request_dt_tm = dq8
        4 request_dt_tm_ind = i2
        4 request_prsnl_id = f8
        4 request_prsnl_ft = vc
        4 request_comment = vc
        4 action_dt_tm = dq8
        4 action_dt_tm_ind = i2
        4 action_prsnl_id = f8
        4 action_prsnl_ft = vc
        4 proxy_prsnl_id = f8
        4 proxy_prsnl_ft = vc
        4 action_status_cd = f8
        4 action_status_cd_disp = vc
        4 action_comment = vc
        4 change_since_action_flag = i2
        4 change_since_action_flag_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 long_text_id = f8
        4 long_text = vc
        4 linked_event_id = f8
        4 request_tz = i4
        4 action_tz = i4
        4 system_comment = vc
        4 event_action_modifier_list [*]
          5 ce_event_action_modifier_id = f8
          5 event_action_modifier_id = f8
          5 event_id = f8
          5 event_prsnl_id = f8
          5 action_type_modifier_cd = f8
          5 action_type_modifier_cd_disp = vc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 digital_signature_ident = vc
        4 action_prsnl_group_id = f8
        4 request_prsnl_group_id = f8
        4 receiving_person_id = f8
        4 receiving_person_ft = vc
      3 microbiology_list [*]
        4 event_id = f8
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 organism_cd = f8
        4 organism_cd_disp = vc
        4 organism_cd_desc = vc
        4 organism_cd_mean = vc
        4 organism_occurrence_nbr = i4
        4 organism_occurrence_nbr_ind = i2
        4 organism_type_cd = f8
        4 organism_type_cd_disp = vc
        4 organism_type_cd_mean = vc
        4 observation_prsnl_id = f8
        4 biotype = vc
        4 probability = f8
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 susceptibility_list [*]
          5 event_id = f8
          5 micro_seq_nbr = i4
          5 micro_seq_nbr_ind = i2
          5 suscep_seq_nbr = i4
          5 suscep_seq_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 susceptibility_test_cd = f8
          5 susceptibility_test_cd_disp = vc
          5 susceptibility_test_cd_mean = vc
          5 detail_susceptibility_cd = f8
          5 detail_susceptibility_cd_disp = vc
          5 detail_susceptibility_cd_mean = vc
          5 panel_antibiotic_cd = f8
          5 panel_antibiotic_cd_disp = vc
          5 panel_antibiotic_cd_mean = vc
          5 antibiotic_cd = f8
          5 antibiotic_cd_disp = vc
          5 antibiotic_cd_desc = vc
          5 antibiotic_cd_mean = vc
          5 diluent_volume = f8
          5 diluent_volume_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 result_cd_mean = vc
          5 result_text_value = vc
          5 result_numeric_value = f8
          5 result_numeric_value_ind = i2
          5 result_unit_cd = f8
          5 result_unit_cd_disp = vc
          5 result_unit_cd_mean = vc
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_prsnl_id = f8
          5 susceptibility_status_cd = f8
          5 susceptibility_status_cd_disp = vc
          5 susceptibility_status_cd_mean = vc
          5 abnormal_flag = i2
          5 abnormal_flag_ind = i2
          5 chartable_flag = i2
          5 chartable_flag_ind = i2
          5 nomenclature_id = f8
          5 antibiotic_note = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
      3 coded_result_list [*]
        4 event_id = f8
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 nomenclature_id = f8
        4 result_set = i4
        4 result_set_ind = i2
        4 result_cd = f8
        4 result_cd_disp = vc
        4 acr_code_str = vc
        4 proc_code_str = vc
        4 pathology_str = vc
        4 group_nbr = i4
        4 group_nbr_ind = i2
        4 mnemonic = vc
        4 short_string = vc
        4 descriptor = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 unit_of_measure_cd = f8
        4 source_string = vc
      3 linked_result_list [*]
        4 linked_event_id = f8
        4 order_id = f8
        4 encntr_id = f8
        4 accession_nbr = vc
        4 contributor_system_cd = f8
        4 contributor_system_cd_disp = vc
        4 reference_nbr = vc
        4 event_class_cd = f8
        4 event_class_cd_disp = vc
        4 series_ref_nbr = vc
        4 sub_series_ref_nbr = vc
        4 succession_type_cd = f8
        4 succession_type_cd_disp = vc
        4 child_event [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 event_modifier_list [*]
        4 modifier_cd = f8
        4 modifier_cd_disp = vc
        4 modifier_value_cd = f8
        4 modifier_value_cd_disp = vc
        4 modifier_val_ft = vc
        4 modifier_value_person_id = f8
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 group_sequence = i4
        4 item_sequence = i4
      3 suscep_footnote_r_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 suscep_seq_nbr = i4
        4 suscep_seq_nbr_ind = i2
        4 suscep_footnote_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 suscep_footnote [*]
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 ce_suscep_footnote_id = f8
        5 suscep_footnote_id = f8
        5 checksum = i4
        5 checksum_ind = i2
        5 compression_cd = f8
        5 format_cd = f8
        5 contributor_system_cd = f8
        5 blob_length = i4
        5 blob_length_ind = i2
        5 reference_nbr = vc
        5 long_blob = gvc
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_id = f8
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
      3 inventory_result_list [*]
        4 item_id = f8
        4 serial_nbr = vc
        4 serial_mnemonic = vc
        4 description = vc
        4 item_nbr = vc
        4 quantity = f8
        4 quantity_ind = i2
        4 body_site = vc
        4 reference_entity_id = f8
        4 reference_entity_name = vc
        4 implant_result [*]
        5 item_id = f8
        5 item_size = vc
        5 harvest_site = vc
        5 culture_ind = i2
        5 culture_ind_ind = i2
        5 tissue_graft_type_cd = f8
        5 tissue_graft_type_cd_disp = vc
        5 explant_reason_cd = f8
        5 explant_reason_cd_disp = vc
        5 explant_disposition_cd = f8
        5 explant_disposition_cd_disp = vc
        5 reference_entity_id = f8
        5 reference_entity_name = vc
        5 manufacturer_cd = f8
        5 manufacturer_cd_disp = vc
        5 manufacturer_ft = vc
        5 model_nbr = vc
        5 lot_nbr = vc
        5 other_identifier = vc
        5 expiration_dt_tm = dq8
        5 expiration_dt_tm_ind = i2
        5 ecri_code = vc
        5 batch_nbr = vc
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_id = f8
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 inv_time_result_list [*]
        5 item_id = f8
        5 start_dt_tm = dq8
        5 start_dt_tm_ind = i2
        5 end_dt_tm = dq8
        5 end_dt_tm_ind = i2
        5 event_id = f8
        5 valid_from_dt_tm = dq8
        5 valid_from_dt_tm_ind = i2
        5 valid_until_dt_tm = dq8
        5 valid_until_dt_tm_ind = i2
        5 updt_dt_tm = dq8
        5 updt_dt_tm_ind = i2
        5 updt_task = i4
        5 updt_task_ind = i2
        5 updt_id = f8
        5 updt_cnt = i4
        5 updt_cnt_ind = i2
        5 updt_applctx = i4
        5 updt_applctx_ind = i2
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 child_event_list [*]
        4 clinical_event_id = f8
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 clinsig_updt_dt_tm = dq8
        4 clinsig_updt_dt_tm_ind = i2
        4 view_level = i4
        4 view_level_ind = i2
        4 order_id = f8
        4 catalog_cd = f8
        4 catalog_cd_disp = vc
        4 series_ref_nbr = vc
        4 person_id = f8
        4 encntr_id = f8
        4 encntr_financial_id = f8
        4 accession_nbr = vc
        4 contributor_system_cd = f8
        4 contributor_system_cd_disp = vc
        4 reference_nbr = vc
        4 parent_event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 event_class_cd = f8
        4 event_class_cd_disp = vc
        4 event_cd = f8
        4 event_cd_disp = vc
        4 event_cd_desc = vc
        4 event_tag = vc
        4 event_reltn_cd = f8
        4 event_reltn_cd_disp = vc
        4 event_start_dt_tm = dq8
        4 event_start_dt_tm_ind = i2
        4 event_end_dt_tm = dq8
        4 event_end_dt_tm_ind = i2
        4 event_end_dt_tm_os = f8
        4 event_end_dt_tm_os_ind = i2
        4 task_assay_cd = f8
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 result_status_cd = f8
        4 result_status_cd_disp = vc
        4 authentic_flag = i2
        4 authentic_flag_ind = i2
        4 publish_flag = i2
        4 publish_flag_ind = i2
        4 qc_review_cd = f8
        4 qc_review_cd_disp = vc
        4 normalcy_cd = f8
        4 normalcy_cd_disp = vc
        4 normalcy_cd_mean = vc
        4 normalcy_method_cd = f8
        4 normalcy_method_cd_disp = vc
        4 inquire_security_cd = f8
        4 inquire_security_cd_disp = vc
        4 resource_group_cd = f8
        4 resource_group_cd_disp = vc
        4 resource_cd = f8
        4 resource_cd_disp = vc
        4 subtable_bit_map = i4
        4 subtable_bit_map_ind = i2
        4 event_title_text = vc
        4 collating_seq = vc
        4 result_val = vc
        4 result_units_cd = f8
        4 result_units_cd_disp = vc
        4 result_time_units_cd = f8
        4 result_time_units_cd_disp = vc
        4 verified_dt_tm = dq8
        4 verified_dt_tm_ind = i2
        4 verified_prsnl_id = f8
        4 performed_dt_tm = dq8
        4 performed_dt_tm_ind = i2
        4 performed_prsnl_id = f8
        4 normal_low = vc
        4 normal_high = vc
        4 critical_low = vc
        4 critical_high = vc
        4 expiration_dt_tm = dq8
        4 expiration_dt_tm_ind = i2
        4 note_importance_bit_map = i2
        4 event_tag_set_flag = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 io_result [*]
          5 ce_io_result_id = f8
          5 event_id = f8
          5 person_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 io_dt_tm = dq8
          5 io_dt_tm_ind = i2
          5 type_cd = f8
          5 type_cd_disp = vc
          5 type_cd_mean = vc
          5 group_cd = f8
          5 group_cd_disp = vc
          5 group_cd_mean = vc
          5 volume = f8
          5 volume_ind = i2
          5 authentic_flag = i2
          5 authentic_flag_ind = i2
          5 record_status_cd = f8
          5 record_status_cd_disp = vc
          5 record_status_cd_mean = vc
          5 io_comment = vc
          5 system_note = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 specimen_coll [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 specimen_id = f8
          5 container_id = f8
          5 container_type_cd = f8
          5 container_type_cd_disp = vc
          5 container_type_cd_mean = vc
          5 specimen_status_cd = f8
          5 specimen_status_cd_disp = vc
          5 specimen_status_cd_mean = vc
          5 collect_dt_tm = dq8
          5 collect_dt_tm_ind = i2
          5 collect_method_cd = f8
          5 collect_method_cd_disp = vc
          5 collect_method_cd_mean = vc
          5 collect_loc_cd = f8
          5 collect_loc_cd_disp = vc
          5 collect_loc_cd_mean = vc
          5 collect_prsnl_id = f8
          5 collect_volume = f8
          5 collect_volume_ind = i2
          5 collect_unit_cd = f8
          5 collect_unit_cd_disp = vc
          5 collect_unit_cd_mean = vc
          5 collect_priority_cd = f8
          5 collect_priority_cd_disp = vc
          5 collect_priority_cd_mean = vc
          5 source_type_cd = f8
          5 source_type_cd_disp = vc
          5 source_type_cd_mean = vc
          5 source_text = vc
          5 body_site_cd = f8
          5 body_site_cd_disp = vc
          5 body_site_cd_mean = vc
          5 danger_cd = f8
          5 danger_cd_disp = vc
          5 danger_cd_mean = vc
          5 positive_ind = i2
          5 positive_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 specimen_trans_list [*]
          6 event_id = f8
          6 sequence_nbr = i4
          6 sequence_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 transfer_dt_tm = dq8
          6 transfer_dt_tm_ind = i2
          6 transfer_prsnl_id = f8
          6 transfer_loc_cd = f8
          6 transfer_loc_cd_disp = vc
          6 receive_dt_tm = dq8
          6 receive_dt_tm_ind = i2
          6 receive_prsnl_id = f8
          6 receive_loc_cd = f8
          6 receive_loc_cd_disp = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          5 collect_tz = i4
          5 recvd_dt_tm = dq8
          5 recvd_tz = i4
        4 blob_result [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 max_sequence_nbr = i4
          5 max_sequence_nbr_ind = i2
          5 checksum = i4
          5 checksum_ind = i2
          5 succession_type_cd = f8
          5 succession_type_cd_disp = vc
          5 sub_series_ref_nbr = vc
          5 storage_cd = f8
          5 storage_cd_disp = vc
          5 format_cd = f8
          5 format_cd_disp = vc
          5 device_cd = f8
          5 device_cd_disp = vc
          5 blob_handle = vc
          5 blob_attributes = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 blob [*]
          6 event_id = f8
          6 blob_seq_num = i4
          6 blob_seq_num_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 blob_length = i4
          6 blob_length_ind = i2
          6 compression_cd = f8
          6 compression_cd_disp = vc
          6 blob_contents = gvc
          6 blob_contents_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          5 blob_summary [*]
          6 ce_blob_summary_id = f8
          6 blob_summary_id = f8
          6 blob_length = i4
          6 blob_length_ind = i2
          6 format_cd = f8
          6 compression_cd = f8
          6 checksum = i4
          6 checksum_ind = i2
          6 long_blob = gvc
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 event_id = f8
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_id = f8
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
        4 string_result [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
          6 event_id = f8
          6 comp_idx = i4
          6 comp_idx_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 comp_event_id = f8
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 blood_transfuse [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 transfuse_start_dt_tm = dq8
          5 transfuse_start_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 transfuse_end_dt_tm = dq8
          5 transfuse_end_dt_tm_ind = i2
          5 transfuse_note = vc
          5 transfuse_route_cd = f8
          5 transfuse_site_cd = f8
          5 transfuse_pt_loc_cd = f8
          5 initial_volume = f8
          5 total_intake_volume = f8
          5 transfusion_rate = f8
          5 transfusion_unit_cd = f8
          5 transfusion_time_cd = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 apparatus [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 apparatus_type_cd = f8
          5 apparatus_type_cd_disp = vc
          5 apparatus_serial_nbr = vc
          5 apparatus_size_cd = f8
          5 apparatus_size_cd_disp = vc
          5 body_site_cd = f8
          5 body_site_cd_disp = vc
          5 insertion_pt_loc_cd = f8
          5 insertion_pt_loc_cd_disp = vc
          5 insertion_prsnl_id = f8
          5 removal_pt_loc_cd = f8
          5 removal_pt_loc_cd_disp = vc
          5 removal_prsnl_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 assistant_list [*]
          6 event_id = f8
          6 assistant_type_cd = f8
          6 assistant_type_cd_disp = vc
          6 assistant_type_cd_mean = vc
          6 sequence_nbr = i4
          6 sequence_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 assistant_prsnl_id = f8
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
        4 product [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 product_id = f8
          5 product_nbr = vc
          5 product_cd = f8
          5 product_cd_disp = vc
          5 product_cd_mean = vc
          5 abo_cd = f8
          5 abo_cd_disp = vc
          5 abo_cd_mean = vc
          5 rh_cd = f8
          5 rh_cd_disp = vc
          5 rh_cd_mean = vc
          5 product_status_cd = f8
          5 product_status_cd_disp = vc
          5 product_status_cd_mean = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 product_antigen_list [*]
          6 event_id = f8
          6 prod_ant_seq_nbr = i4
          6 prod_ant_seq_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 antigen_cd = f8
          6 antigen_cd_disp = vc
          6 antigen_cd_mean = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 attribute_ind = i2
          5 product_volume = f8
          5 product_volume_unit_cd = f8
          5 product_quantity = f8
          5 product_quantity_unit_cd = f8
          5 product_strength = f8
          5 product_strength_unit_cd = f8
        4 date_result [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 med_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 admin_note = vc
          5 admin_prov_id = f8
          5 admin_start_dt_tm = dq8
          5 admin_start_dt_tm_ind = i2
          5 admin_end_dt_tm = dq8
          5 admin_end_dt_tm_ind = i2
          5 admin_route_cd = f8
          5 admin_route_cd_disp = vc
          5 admin_route_cd_mean = vc
          5 admin_site_cd = f8
          5 admin_site_cd_disp = vc
          5 admin_site_cd_mean = vc
          5 admin_method_cd = f8
          5 admin_method_cd_disp = vc
          5 admin_method_cd_mean = vc
          5 admin_pt_loc_cd = f8
          5 admin_pt_loc_cd_disp = vc
          5 admin_pt_loc_cd_mean = vc
          5 initial_dosage = f8
          5 initial_dosage_ind = i2
          5 admin_dosage = f8
          5 admin_dosage_ind = i2
          5 dosage_unit_cd = f8
          5 dosage_unit_cd_disp = vc
          5 dosage_unit_cd_mean = vc
          5 initial_volume = f8
          5 initial_volume_ind = i2
          5 total_intake_volume = f8
          5 total_intake_volume_ind = i2
          5 diluent_type_cd = f8
          5 diluent_type_cd_disp = vc
          5 diluent_type_cd_mean = vc
          5 ph_dispense_id = f8
          5 infusion_rate = f8
          5 infusion_rate_ind = i2
          5 infusion_unit_cd = f8
          5 infusion_unit_cd_disp = vc
          5 infusion_unit_cd_mean = vc
          5 infusion_time_cd = f8
          5 infusion_time_cd_disp = vc
          5 infusion_time_cd_mean = vc
          5 medication_form_cd = f8
          5 medication_form_cd_disp = vc
          5 medication_form_cd_mean = vc
          5 reason_required_flag = i2
          5 reason_required_flag_ind = i2
          5 response_required_flag = i2
          5 response_required_flag_ind = i2
          5 admin_strength = i4
          5 admin_strength_ind = i2
          5 admin_strength_unit_cd = f8
          5 admin_strength_unit_cd_disp = vc
          5 admin_strength_unit_cd_mean = vc
          5 substance_lot_number = vc
          5 substance_exp_dt_tm = dq8
          5 substance_exp_dt_tm_ind = i2
          5 substance_manufacturer_cd = f8
          5 substance_manufacturer_cd_disp = vc
          5 substance_manufacturer_cd_mean = vc
          5 refusal_cd = f8
          5 refusal_cd_disp = vc
          5 refusal_cd_mean = vc
          5 system_entry_dt_tm = dq8
          5 system_entry_dt_tm_ind = i2
          5 iv_event_cd = f8
          5 infused_volume = f8
          5 infused_volume_unit_cd = f8
          5 infused_volume_unit_cd_disp = vc
          5 infused_volume_unit_cd_mean = vc
          5 remaining_volume = f8
          5 remaining_volume_unit_cd = f8
          5 remaining_volume_unit_cd_disp = vc
          5 remaining_volume_unit_cd_mean = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 synonym_id = f8
          5 immunization_type_cd = f8
          5 immunization_type_cd_disp = vc
          5 immunization_type_cd_mean = vc
          5 admin_start_tz = i4
          5 admin_end_tz = i4
          5 contributor_link_list [*]
          6 event_id = f8
          6 contributor_event_id = f8
          6 ce_valid_from_dt_tm = dq8
          6 type_flag = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 ce_valid_until_dt_tm = dq8
          6 ce_result_value = vc
          6 ce_performed_prsnl_id = f8
          6 ce_event_end_dt_tm = dq8
          6 ce_event_cd = f8
          6 ce_event_cd_disp = vc
          6 ce_clinical_event_id = f8
          6 ce_event_class_cd = f8
          6 ce_event_class_cd_disp = vc
          6 string_result_list [*]
            7 event_id = f8
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 string_result_text = vc
            7 string_result_format_cd = f8
            7 string_result_format_cd_disp = vc
            7 equation_id = f8
            7 last_norm_dt_tm = dq8
            7 last_norm_dt_tm_ind = i2
            7 unit_of_measure_cd = f8
            7 unit_of_measure_cd_disp = vc
            7 feasible_ind = i2
            7 feasible_ind_ind = i2
            7 inaccurate_ind = i2
            7 inaccurate_ind_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 interp_comp_list [*]
            8 event_id = f8
            8 comp_idx = i4
            8 comp_idx_ind = i2
            8 valid_from_dt_tm = dq8
            8 valid_from_dt_tm_ind = i2
            8 valid_until_dt_tm = dq8
            8 valid_until_dt_tm_ind = i2
            8 comp_event_id = f8
            8 updt_dt_tm = dq8
            8 updt_dt_tm_ind = i2
            8 updt_id = f8
            8 updt_task = i4
            8 updt_task_ind = i2
            8 updt_cnt = i4
            8 updt_cnt_ind = i2
            8 updt_applctx = i4
            8 updt_applctx_ind = i2
            8 comp_name = vc
            7 calculation_equation = vc
            7 string_long_text_id = f8
          6 coded_result_list [*]
            7 event_id = f8
            7 sequence_nbr = i4
            7 sequence_nbr_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 nomenclature_id = f8
            7 result_set = i4
            7 result_set_ind = i2
            7 result_cd = f8
            7 result_cd_disp = vc
            7 acr_code_str = vc
            7 proc_code_str = vc
            7 pathology_str = vc
            7 group_nbr = i4
            7 group_nbr_ind = i2
            7 mnemonic = vc
            7 short_string = vc
            7 descriptor = vc
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 unit_of_measure_cd = f8
            7 source_string = vc
          6 date_result_list [*]
            7 event_id = f8
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 result_dt_tm = dq8
            7 result_dt_tm_ind = i2
            7 result_dt_tm_os = f8
            7 result_dt_tm_os_ind = i2
            7 date_type_flag = i2
            7 date_type_flag_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 result_tz = i4
            7 result_tz_ind = i2
          6 ce_result_status_cd = f8
          6 ce_result_status_cd_disp = vc
          6 ce_event_end_tz = i4
          5 weight_value = f8
          5 weight_unit_cd = f8
        4 event_note_list [*]
          5 ce_event_note_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 event_note_id = f8
          5 event_id = f8
          5 note_type_cd = f8
          5 note_type_cd_disp = vc
          5 note_type_cd_mean = vc
          5 note_format_cd = f8
          5 note_format_cd_disp = vc
          5 note_format_cd_mean = vc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 entry_method_cd = f8
          5 entry_method_cd_disp = vc
          5 entry_method_cd_mean = vc
          5 note_prsnl_id = f8
          5 note_dt_tm = dq8
          5 note_dt_tm_ind = i2
          5 record_status_cd = f8
          5 record_status_cd_disp = vc
          5 record_status_cd_mean = vc
          5 compression_cd = f8
          5 compression_cd_disp = vc
          5 compression_cd_mean = vc
          5 checksum = i4
          5 checksum_ind = i2
          5 long_blob = gvc
          5 long_text = vc
          5 long_text_id = f8
          5 non_chartable_flag = i2
          5 importance_flag = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 note_tz = i4
        4 event_prsnl_list [*]
          5 ce_event_prsnl_id = f8
          5 event_prsnl_id = f8
          5 person_id = f8
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 action_type_cd = f8
          5 action_type_cd_disp = vc
          5 request_dt_tm = dq8
          5 request_dt_tm_ind = i2
          5 request_prsnl_id = f8
          5 request_prsnl_ft = vc
          5 request_comment = vc
          5 action_dt_tm = dq8
          5 action_dt_tm_ind = i2
          5 action_prsnl_id = f8
          5 action_prsnl_ft = vc
          5 proxy_prsnl_id = f8
          5 proxy_prsnl_ft = vc
          5 action_status_cd = f8
          5 action_status_cd_disp = vc
          5 action_comment = vc
          5 change_since_action_flag = i2
          5 change_since_action_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 long_text_id = f8
          5 long_text = vc
          5 linked_event_id = f8
          5 request_tz = i4
          5 action_tz = i4
          5 system_comment = vc
          5 event_action_modifier_list [*]
          6 ce_event_action_modifier_id = f8
          6 event_action_modifier_id = f8
          6 event_id = f8
          6 event_prsnl_id = f8
          6 action_type_modifier_cd = f8
          6 action_type_modifier_cd_disp = vc
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          5 digital_signature_ident = vc
          5 action_prsnl_group_id = f8
          5 request_prsnl_group_id = f8
          5 receiving_person_id = f8
          5 receiving_person_ft = vc
        4 microbiology_list [*]
          5 event_id = f8
          5 micro_seq_nbr = i4
          5 micro_seq_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 organism_cd = f8
          5 organism_cd_disp = vc
          5 organism_cd_desc = vc
          5 organism_cd_mean = vc
          5 organism_occurrence_nbr = i4
          5 organism_occurrence_nbr_ind = i2
          5 organism_type_cd = f8
          5 organism_type_cd_disp = vc
          5 organism_type_cd_mean = vc
          5 observation_prsnl_id = f8
          5 biotype = vc
          5 probability = f8
          5 positive_ind = i2
          5 positive_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 susceptibility_list [*]
          6 event_id = f8
          6 micro_seq_nbr = i4
          6 micro_seq_nbr_ind = i2
          6 suscep_seq_nbr = i4
          6 suscep_seq_nbr_ind = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 susceptibility_test_cd = f8
          6 susceptibility_test_cd_disp = vc
          6 susceptibility_test_cd_mean = vc
          6 detail_susceptibility_cd = f8
          6 detail_susceptibility_cd_disp = vc
          6 detail_susceptibility_cd_mean = vc
          6 panel_antibiotic_cd = f8
          6 panel_antibiotic_cd_disp = vc
          6 panel_antibiotic_cd_mean = vc
          6 antibiotic_cd = f8
          6 antibiotic_cd_disp = vc
          6 antibiotic_cd_desc = vc
          6 antibiotic_cd_mean = vc
          6 diluent_volume = f8
          6 diluent_volume_ind = i2
          6 result_cd = f8
          6 result_cd_disp = vc
          6 result_cd_mean = vc
          6 result_text_value = vc
          6 result_numeric_value = f8
          6 result_numeric_value_ind = i2
          6 result_unit_cd = f8
          6 result_unit_cd_disp = vc
          6 result_unit_cd_mean = vc
          6 result_dt_tm = dq8
          6 result_dt_tm_ind = i2
          6 result_prsnl_id = f8
          6 susceptibility_status_cd = f8
          6 susceptibility_status_cd_disp = vc
          6 susceptibility_status_cd_mean = vc
          6 abnormal_flag = i2
          6 abnormal_flag_ind = i2
          6 chartable_flag = i2
          6 chartable_flag_ind = i2
          6 nomenclature_id = f8
          6 antibiotic_note = vc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 result_tz = i4
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 linked_result_list [*]
          5 linked_event_id = f8
          5 order_id = f8
          5 encntr_id = f8
          5 accession_nbr = vc
          5 contributor_system_cd = f8
          5 contributor_system_cd_disp = vc
          5 reference_nbr = vc
          5 event_class_cd = f8
          5 event_class_cd_disp = vc
          5 series_ref_nbr = vc
          5 sub_series_ref_nbr = vc
          5 succession_type_cd = f8
          5 succession_type_cd_disp = vc
          5 child_event [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 event_modifier_list [*]
          5 modifier_cd = f8
          5 modifier_cd_disp = vc
          5 modifier_value_cd = f8
          5 modifier_value_cd_disp = vc
          5 modifier_val_ft = vc
          5 modifier_value_person_id = f8
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 group_sequence = i4
          5 item_sequence = i4
        4 suscep_footnote_r_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 micro_seq_nbr = i4
          5 micro_seq_nbr_ind = i2
          5 suscep_seq_nbr = i4
          5 suscep_seq_nbr_ind = i2
          5 suscep_footnote_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 suscep_footnote [*]
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 ce_suscep_footnote_id = f8
          6 suscep_footnote_id = f8
          6 checksum = i4
          6 checksum_ind = i2
          6 compression_cd = f8
          6 format_cd = f8
          6 contributor_system_cd = f8
          6 blob_length = i4
          6 blob_length_ind = i2
          6 reference_nbr = vc
          6 long_blob = gvc
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
        4 inventory_result_list [*]
          5 item_id = f8
          5 serial_nbr = vc
          5 serial_mnemonic = vc
          5 description = vc
          5 item_nbr = vc
          5 quantity = f8
          5 quantity_ind = i2
          5 body_site = vc
          5 reference_entity_id = f8
          5 reference_entity_name = vc
          5 implant_result [*]
          6 item_id = f8
          6 item_size = vc
          6 harvest_site = vc
          6 culture_ind = i2
          6 culture_ind_ind = i2
          6 tissue_graft_type_cd = f8
          6 tissue_graft_type_cd_disp = vc
          6 explant_reason_cd = f8
          6 explant_reason_cd_disp = vc
          6 explant_disposition_cd = f8
          6 explant_disposition_cd_disp = vc
          6 reference_entity_id = f8
          6 reference_entity_name = vc
          6 manufacturer_cd = f8
          6 manufacturer_cd_disp = vc
          6 manufacturer_ft = vc
          6 model_nbr = vc
          6 lot_nbr = vc
          6 other_identifier = vc
          6 expiration_dt_tm = dq8
          6 expiration_dt_tm_ind = i2
          6 ecri_code = vc
          6 batch_nbr = vc
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_id = f8
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          5 inv_time_result_list [*]
          6 item_id = f8
          6 start_dt_tm = dq8
          6 start_dt_tm_ind = i2
          6 end_dt_tm = dq8
          6 end_dt_tm_ind = i2
          6 event_id = f8
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_id = f8
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 child_event_list [*]
            5 clinical_event_id = f8
            5 event_id = f8
            5 valid_until_dt_tm = dq8
            5 valid_until_dt_tm_ind = i2
            5 clinsig_updt_dt_tm = dq8
            5 clinsig_updt_dt_tm_ind = i2
            5 view_level = i4
            5 view_level_ind = i2
            5 order_id = f8
            5 catalog_cd = f8
            5 catalog_cd_disp = vc
            5 series_ref_nbr = vc
            5 person_id = f8
            5 encntr_id = f8
            5 encntr_financial_id = f8
            5 accession_nbr = vc
            5 contributor_system_cd = f8
            5 contributor_system_cd_disp = vc
            5 reference_nbr = vc
            5 parent_event_id = f8
            5 valid_from_dt_tm = dq8
            5 valid_from_dt_tm_ind = i2
            5 event_class_cd = f8
            5 event_class_cd_disp = vc
            5 event_cd = f8
            5 event_cd_disp = vc
            5 event_cd_desc = vc
            5 event_tag = vc
            5 event_reltn_cd = f8
            5 event_reltn_cd_disp = vc
            5 event_start_dt_tm = dq8
            5 event_start_dt_tm_ind = i2
            5 event_end_dt_tm = dq8
            5 event_end_dt_tm_ind = i2
            5 event_end_dt_tm_os = f8
            5 event_end_dt_tm_os_ind = i2
            5 task_assay_cd = f8
            5 record_status_cd = f8
            5 record_status_cd_disp = vc
            5 result_status_cd = f8
            5 result_status_cd_disp = vc
            5 authentic_flag = i2
            5 authentic_flag_ind = i2
            5 publish_flag = i2
            5 publish_flag_ind = i2
            5 qc_review_cd = f8
            5 qc_review_cd_disp = vc
            5 normalcy_cd = f8
            5 normalcy_cd_disp = vc
            5 normalcy_cd_mean = vc
            5 normalcy_method_cd = f8
            5 normalcy_method_cd_disp = vc
            5 inquire_security_cd = f8
            5 inquire_security_cd_disp = vc
            5 resource_group_cd = f8
            5 resource_group_cd_disp = vc
            5 resource_cd = f8
            5 resource_cd_disp = vc
            5 subtable_bit_map = i4
            5 subtable_bit_map_ind = i2
            5 event_title_text = vc
            5 collating_seq = vc
            5 result_val = vc
            5 result_units_cd = f8
            5 result_units_cd_disp = vc
            5 result_time_units_cd = f8
            5 result_time_units_cd_disp = vc
            5 verified_dt_tm = dq8
            5 verified_dt_tm_ind = i2
            5 verified_prsnl_id = f8
            5 performed_dt_tm = dq8
            5 performed_dt_tm_ind = i2
            5 performed_prsnl_id = f8
            5 normal_low = vc
            5 normal_high = vc
            5 critical_low = vc
            5 critical_high = vc
            5 expiration_dt_tm = dq8
            5 expiration_dt_tm_ind = i2
            5 note_importance_bit_map = i2
            5 event_tag_set_flag = i2
            5 updt_dt_tm = dq8
            5 updt_dt_tm_ind = i2
            5 updt_id = f8
            5 updt_task = i4
            5 updt_task_ind = i2
            5 updt_cnt = i4
            5 updt_cnt_ind = i2
            5 updt_applctx = i4
            5 updt_applctx_ind = i2
            5 io_result [*]
              6 ce_io_result_id = f8
              6 event_id = f8
              6 person_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 io_dt_tm = dq8
              6 io_dt_tm_ind = i2
              6 type_cd = f8
              6 type_cd_disp = vc
              6 type_cd_mean = vc
              6 group_cd = f8
              6 group_cd_disp = vc
              6 group_cd_mean = vc
              6 volume = f8
              6 volume_ind = i2
              6 authentic_flag = i2
              6 authentic_flag_ind = i2
              6 record_status_cd = f8
              6 record_status_cd_disp = vc
              6 record_status_cd_mean = vc
              6 io_comment = vc
              6 system_note = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 specimen_coll [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 specimen_id = f8
              6 container_id = f8
              6 container_type_cd = f8
              6 container_type_cd_disp = vc
              6 container_type_cd_mean = vc
              6 specimen_status_cd = f8
              6 specimen_status_cd_disp = vc
              6 specimen_status_cd_mean = vc
              6 collect_dt_tm = dq8
              6 collect_dt_tm_ind = i2
              6 collect_method_cd = f8
              6 collect_method_cd_disp = vc
              6 collect_method_cd_mean = vc
              6 collect_loc_cd = f8
              6 collect_loc_cd_disp = vc
              6 collect_loc_cd_mean = vc
              6 collect_prsnl_id = f8
              6 collect_volume = f8
              6 collect_volume_ind = i2
              6 collect_unit_cd = f8
              6 collect_unit_cd_disp = vc
              6 collect_unit_cd_mean = vc
              6 collect_priority_cd = f8
              6 collect_priority_cd_disp = vc
              6 collect_priority_cd_mean = vc
              6 source_type_cd = f8
              6 source_type_cd_disp = vc
              6 source_type_cd_mean = vc
              6 source_text = vc
              6 body_site_cd = f8
              6 body_site_cd_disp = vc
              6 body_site_cd_mean = vc
              6 danger_cd = f8
              6 danger_cd_disp = vc
              6 danger_cd_mean = vc
              6 positive_ind = i2
              6 positive_ind_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 specimen_trans_list [*]
              7 event_id = f8
              7 sequence_nbr = i4
              7 sequence_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 transfer_dt_tm = dq8
              7 transfer_dt_tm_ind = i2
              7 transfer_prsnl_id = f8
              7 transfer_loc_cd = f8
              7 transfer_loc_cd_disp = vc
              7 receive_dt_tm = dq8
              7 receive_dt_tm_ind = i2
              7 receive_prsnl_id = f8
              7 receive_loc_cd = f8
              7 receive_loc_cd_disp = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              6 collect_tz = i4
              6 recvd_dt_tm = dq8
              6 recvd_tz = i4
            5 blob_result [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 max_sequence_nbr = i4
              6 max_sequence_nbr_ind = i2
              6 checksum = i4
              6 checksum_ind = i2
              6 succession_type_cd = f8
              6 succession_type_cd_disp = vc
              6 sub_series_ref_nbr = vc
              6 storage_cd = f8
              6 storage_cd_disp = vc
              6 format_cd = f8
              6 format_cd_disp = vc
              6 device_cd = f8
              6 device_cd_disp = vc
              6 blob_handle = vc
              6 blob_attributes = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 blob [*]
              7 event_id = f8
              7 blob_seq_num = i4
              7 blob_seq_num_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 blob_length = i4
              7 blob_length_ind = i2
              7 compression_cd = f8
              7 compression_cd_disp = vc
              7 blob_contents = gvc
              7 blob_contents_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              6 blob_summary [*]
              7 ce_blob_summary_id = f8
              7 blob_summary_id = f8
              7 blob_length = i4
              7 blob_length_ind = i2
              7 format_cd = f8
              7 compression_cd = f8
              7 checksum = i4
              7 checksum_ind = i2
              7 long_blob = gvc
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_id = f8
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
            5 string_result [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 string_result_text = vc
              6 string_result_format_cd = f8
              6 string_result_format_cd_disp = vc
              6 equation_id = f8
              6 last_norm_dt_tm = dq8
              6 last_norm_dt_tm_ind = i2
              6 unit_of_measure_cd = f8
              6 unit_of_measure_cd_disp = vc
              6 feasible_ind = i2
              6 feasible_ind_ind = i2
              6 inaccurate_ind = i2
              6 inaccurate_ind_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
              6 calculation_equation = vc
              6 string_long_text_id = f8
            5 blood_transfuse [*]
              6 event_id = f8
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 transfuse_start_dt_tm = dq8
              6 transfuse_start_dt_tm_ind = i2
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 transfuse_end_dt_tm = dq8
              6 transfuse_end_dt_tm_ind = i2
              6 transfuse_note = vc
              6 transfuse_route_cd = f8
              6 transfuse_site_cd = f8
              6 transfuse_pt_loc_cd = f8
              6 initial_volume = f8
              6 total_intake_volume = f8
              6 transfusion_rate = f8
              6 transfusion_unit_cd = f8
              6 transfusion_time_cd = f8
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 apparatus [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 apparatus_type_cd = f8
              6 apparatus_type_cd_disp = vc
              6 apparatus_serial_nbr = vc
              6 apparatus_size_cd = f8
              6 apparatus_size_cd_disp = vc
              6 body_site_cd = f8
              6 body_site_cd_disp = vc
              6 insertion_pt_loc_cd = f8
              6 insertion_pt_loc_cd_disp = vc
              6 insertion_prsnl_id = f8
              6 removal_pt_loc_cd = f8
              6 removal_pt_loc_cd_disp = vc
              6 removal_prsnl_id = f8
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 assistant_list [*]
              7 event_id = f8
              7 assistant_type_cd = f8
              7 assistant_type_cd_disp = vc
              7 assistant_type_cd_mean = vc
              7 sequence_nbr = i4
              7 sequence_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 assistant_prsnl_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
            5 product [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 product_id = f8
              6 product_nbr = vc
              6 product_cd = f8
              6 product_cd_disp = vc
              6 product_cd_mean = vc
              6 abo_cd = f8
              6 abo_cd_disp = vc
              6 abo_cd_mean = vc
              6 rh_cd = f8
              6 rh_cd_disp = vc
              6 rh_cd_mean = vc
              6 product_status_cd = f8
              6 product_status_cd_disp = vc
              6 product_status_cd_mean = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 product_antigen_list [*]
              7 event_id = f8
              7 prod_ant_seq_nbr = i4
              7 prod_ant_seq_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 antigen_cd = f8
              7 antigen_cd_disp = vc
              7 antigen_cd_mean = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 attribute_ind = i2
              6 product_volume = f8
              6 product_volume_unit_cd = f8
              6 product_quantity = f8
              6 product_quantity_unit_cd = f8
              6 product_strength = f8
              6 product_strength_unit_cd = f8
            5 date_result [*]
              6 event_id = f8
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 result_dt_tm = dq8
              6 result_dt_tm_ind = i2
              6 result_dt_tm_os = f8
              6 result_dt_tm_os_ind = i2
              6 date_type_flag = i2
              6 date_type_flag_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 result_tz = i4
              6 result_tz_ind = i2
            5 med_result_list [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 admin_note = vc
              6 admin_prov_id = f8
              6 admin_start_dt_tm = dq8
              6 admin_start_dt_tm_ind = i2
              6 admin_end_dt_tm = dq8
              6 admin_end_dt_tm_ind = i2
              6 admin_route_cd = f8
              6 admin_route_cd_disp = vc
              6 admin_route_cd_mean = vc
              6 admin_site_cd = f8
              6 admin_site_cd_disp = vc
              6 admin_site_cd_mean = vc
              6 admin_method_cd = f8
              6 admin_method_cd_disp = vc
              6 admin_method_cd_mean = vc
              6 admin_pt_loc_cd = f8
              6 admin_pt_loc_cd_disp = vc
              6 admin_pt_loc_cd_mean = vc
              6 initial_dosage = f8
              6 initial_dosage_ind = i2
              6 admin_dosage = f8
              6 admin_dosage_ind = i2
              6 dosage_unit_cd = f8
              6 dosage_unit_cd_disp = vc
              6 dosage_unit_cd_mean = vc
              6 initial_volume = f8
              6 initial_volume_ind = i2
              6 total_intake_volume = f8
              6 total_intake_volume_ind = i2
              6 diluent_type_cd = f8
              6 diluent_type_cd_disp = vc
              6 diluent_type_cd_mean = vc
              6 ph_dispense_id = f8
              6 infusion_rate = f8
              6 infusion_rate_ind = i2
              6 infusion_unit_cd = f8
              6 infusion_unit_cd_disp = vc
              6 infusion_unit_cd_mean = vc
              6 infusion_time_cd = f8
              6 infusion_time_cd_disp = vc
              6 infusion_time_cd_mean = vc
              6 medication_form_cd = f8
              6 medication_form_cd_disp = vc
              6 medication_form_cd_mean = vc
              6 reason_required_flag = i2
              6 reason_required_flag_ind = i2
              6 response_required_flag = i2
              6 response_required_flag_ind = i2
              6 admin_strength = i4
              6 admin_strength_ind = i2
              6 admin_strength_unit_cd = f8
              6 admin_strength_unit_cd_disp = vc
              6 admin_strength_unit_cd_mean = vc
              6 substance_lot_number = vc
              6 substance_exp_dt_tm = dq8
              6 substance_exp_dt_tm_ind = i2
              6 substance_manufacturer_cd = f8
              6 substance_manufacturer_cd_disp = vc
              6 substance_manufacturer_cd_mean = vc
              6 refusal_cd = f8
              6 refusal_cd_disp = vc
              6 refusal_cd_mean = vc
              6 system_entry_dt_tm = dq8
              6 system_entry_dt_tm_ind = i2
              6 iv_event_cd = f8
              6 infused_volume = f8
              6 infused_volume_unit_cd = f8
              6 infused_volume_unit_cd_disp = vc
              6 infused_volume_unit_cd_mean = vc
              6 remaining_volume = f8
              6 remaining_volume_unit_cd = f8
              6 remaining_volume_unit_cd_disp = vc
              6 remaining_volume_unit_cd_mean = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 synonym_id = f8
              6 immunization_type_cd = f8
              6 immunization_type_cd_disp = vc
              6 immunization_type_cd_mean = vc
              6 admin_start_tz = i4
              6 admin_end_tz = i4
              6 contributor_link_list [*]
              7 event_id = f8
              7 contributor_event_id = f8
              7 ce_valid_from_dt_tm = dq8
              7 type_flag = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 ce_valid_until_dt_tm = dq8
              7 ce_result_value = vc
              7 ce_performed_prsnl_id = f8
              7 ce_event_end_dt_tm = dq8
              7 ce_event_cd = f8
              7 ce_event_cd_disp = vc
              7 ce_clinical_event_id = f8
              7 ce_event_class_cd = f8
              7 ce_event_class_cd_disp = vc
              7 string_result_list [*]
                8 event_id = f8
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 string_result_text = vc
                8 string_result_format_cd = f8
                8 string_result_format_cd_disp = vc
                8 equation_id = f8
                8 last_norm_dt_tm = dq8
                8 last_norm_dt_tm_ind = i2
                8 unit_of_measure_cd = f8
                8 unit_of_measure_cd_disp = vc
                8 feasible_ind = i2
                8 feasible_ind_ind = i2
                8 inaccurate_ind = i2
                8 inaccurate_ind_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 interp_comp_list [*]
                9 event_id = f8
                9 comp_idx = i4
                9 comp_idx_ind = i2
                9 valid_from_dt_tm = dq8
                9 valid_from_dt_tm_ind = i2
                9 valid_until_dt_tm = dq8
                9 valid_until_dt_tm_ind = i2
                9 comp_event_id = f8
                9 updt_dt_tm = dq8
                9 updt_dt_tm_ind = i2
                9 updt_id = f8
                9 updt_task = i4
                9 updt_task_ind = i2
                9 updt_cnt = i4
                9 updt_cnt_ind = i2
                9 updt_applctx = i4
                9 updt_applctx_ind = i2
                9 comp_name = vc
                8 calculation_equation = vc
                8 string_long_text_id = f8
              7 coded_result_list [*]
                8 event_id = f8
                8 sequence_nbr = i4
                8 sequence_nbr_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 nomenclature_id = f8
                8 result_set = i4
                8 result_set_ind = i2
                8 result_cd = f8
                8 result_cd_disp = vc
                8 acr_code_str = vc
                8 proc_code_str = vc
                8 pathology_str = vc
                8 group_nbr = i4
                8 group_nbr_ind = i2
                8 mnemonic = vc
                8 short_string = vc
                8 descriptor = vc
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 unit_of_measure_cd = f8
                8 source_string = vc
              7 date_result_list [*]
                8 event_id = f8
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 result_dt_tm = dq8
                8 result_dt_tm_ind = i2
                8 result_dt_tm_os = f8
                8 result_dt_tm_os_ind = i2
                8 date_type_flag = i2
                8 date_type_flag_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 result_tz = i4
                8 result_tz_ind = i2
              7 ce_result_status_cd = f8
              7 ce_result_status_cd_disp = vc
              7 ce_event_end_tz = i4
              6 weight_value = f8
              6 weight_unit_cd = f8
            5 event_note_list [*]
              6 ce_event_note_id = f8
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 event_note_id = f8
              6 event_id = f8
              6 note_type_cd = f8
              6 note_type_cd_disp = vc
              6 note_type_cd_mean = vc
              6 note_format_cd = f8
              6 note_format_cd_disp = vc
              6 note_format_cd_mean = vc
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 entry_method_cd = f8
              6 entry_method_cd_disp = vc
              6 entry_method_cd_mean = vc
              6 note_prsnl_id = f8
              6 note_dt_tm = dq8
              6 note_dt_tm_ind = i2
              6 record_status_cd = f8
              6 record_status_cd_disp = vc
              6 record_status_cd_mean = vc
              6 compression_cd = f8
              6 compression_cd_disp = vc
              6 compression_cd_mean = vc
              6 checksum = i4
              6 checksum_ind = i2
              6 long_blob = gvc
              6 long_text = vc
              6 long_text_id = f8
              6 non_chartable_flag = i2
              6 importance_flag = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 note_tz = i4
            5 event_prsnl_list [*]
              6 ce_event_prsnl_id = f8
              6 event_prsnl_id = f8
              6 person_id = f8
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 action_type_cd = f8
              6 action_type_cd_disp = vc
              6 request_dt_tm = dq8
              6 request_dt_tm_ind = i2
              6 request_prsnl_id = f8
              6 request_prsnl_ft = vc
              6 request_comment = vc
              6 action_dt_tm = dq8
              6 action_dt_tm_ind = i2
              6 action_prsnl_id = f8
              6 action_prsnl_ft = vc
              6 proxy_prsnl_id = f8
              6 proxy_prsnl_ft = vc
              6 action_status_cd = f8
              6 action_status_cd_disp = vc
              6 action_comment = vc
              6 change_since_action_flag = i2
              6 change_since_action_flag_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 long_text_id = f8
              6 long_text = vc
              6 linked_event_id = f8
              6 request_tz = i4
              6 action_tz = i4
              6 system_comment = vc
              6 event_action_modifier_list [*]
              7 ce_event_action_modifier_id = f8
              7 event_action_modifier_id = f8
              7 event_id = f8
              7 event_prsnl_id = f8
              7 action_type_modifier_cd = f8
              7 action_type_modifier_cd_disp = vc
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              6 digital_signature_ident = vc
              6 action_prsnl_group_id = f8
              6 request_prsnl_group_id = f8
              6 receiving_person_id = f8
              6 receiving_person_ft = vc
            5 microbiology_list [*]
              6 event_id = f8
              6 micro_seq_nbr = i4
              6 micro_seq_nbr_ind = i2
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 organism_cd = f8
              6 organism_cd_disp = vc
              6 organism_cd_desc = vc
              6 organism_cd_mean = vc
              6 organism_occurrence_nbr = i4
              6 organism_occurrence_nbr_ind = i2
              6 organism_type_cd = f8
              6 organism_type_cd_disp = vc
              6 organism_type_cd_mean = vc
              6 observation_prsnl_id = f8
              6 biotype = vc
              6 probability = f8
              6 positive_ind = i2
              6 positive_ind_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 susceptibility_list [*]
              7 event_id = f8
              7 micro_seq_nbr = i4
              7 micro_seq_nbr_ind = i2
              7 suscep_seq_nbr = i4
              7 suscep_seq_nbr_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 susceptibility_test_cd = f8
              7 susceptibility_test_cd_disp = vc
              7 susceptibility_test_cd_mean = vc
              7 detail_susceptibility_cd = f8
              7 detail_susceptibility_cd_disp = vc
              7 detail_susceptibility_cd_mean = vc
              7 panel_antibiotic_cd = f8
              7 panel_antibiotic_cd_disp = vc
              7 panel_antibiotic_cd_mean = vc
              7 antibiotic_cd = f8
              7 antibiotic_cd_disp = vc
              7 antibiotic_cd_desc = vc
              7 antibiotic_cd_mean = vc
              7 diluent_volume = f8
              7 diluent_volume_ind = i2
              7 result_cd = f8
              7 result_cd_disp = vc
              7 result_cd_mean = vc
              7 result_text_value = vc
              7 result_numeric_value = f8
              7 result_numeric_value_ind = i2
              7 result_unit_cd = f8
              7 result_unit_cd_disp = vc
              7 result_unit_cd_mean = vc
              7 result_dt_tm = dq8
              7 result_dt_tm_ind = i2
              7 result_prsnl_id = f8
              7 susceptibility_status_cd = f8
              7 susceptibility_status_cd_disp = vc
              7 susceptibility_status_cd_mean = vc
              7 abnormal_flag = i2
              7 abnormal_flag_ind = i2
              7 chartable_flag = i2
              7 chartable_flag_ind = i2
              7 nomenclature_id = f8
              7 antibiotic_note = vc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 result_tz = i4
            5 coded_result_list [*]
              6 event_id = f8
              6 sequence_nbr = i4
              6 sequence_nbr_ind = i2
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 nomenclature_id = f8
              6 result_set = i4
              6 result_set_ind = i2
              6 result_cd = f8
              6 result_cd_disp = vc
              6 acr_code_str = vc
              6 proc_code_str = vc
              6 pathology_str = vc
              6 group_nbr = i4
              6 group_nbr_ind = i2
              6 mnemonic = vc
              6 short_string = vc
              6 descriptor = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 unit_of_measure_cd = f8
              6 source_string = vc
            5 linked_result_list [*]
              6 linked_event_id = f8
              6 order_id = f8
              6 encntr_id = f8
              6 accession_nbr = vc
              6 contributor_system_cd = f8
              6 contributor_system_cd_disp = vc
              6 reference_nbr = vc
              6 event_class_cd = f8
              6 event_class_cd_disp = vc
              6 series_ref_nbr = vc
              6 sub_series_ref_nbr = vc
              6 succession_type_cd = f8
              6 succession_type_cd_disp = vc
              6 child_event [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_id = f8
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 event_modifier_list [*]
              6 modifier_cd = f8
              6 modifier_cd_disp = vc
              6 modifier_value_cd = f8
              6 modifier_value_cd_disp = vc
              6 modifier_val_ft = vc
              6 modifier_value_person_id = f8
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_id = f8
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 group_sequence = i4
              6 item_sequence = i4
            5 suscep_footnote_r_list [*]
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 micro_seq_nbr = i4
              6 micro_seq_nbr_ind = i2
              6 suscep_seq_nbr = i4
              6 suscep_seq_nbr_ind = i2
              6 suscep_footnote_id = f8
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 suscep_footnote [*]
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 ce_suscep_footnote_id = f8
              7 suscep_footnote_id = f8
              7 checksum = i4
              7 checksum_ind = i2
              7 compression_cd = f8
              7 format_cd = f8
              7 contributor_system_cd = f8
              7 blob_length = i4
              7 blob_length_ind = i2
              7 reference_nbr = vc
              7 long_blob = gvc
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
            5 inventory_result_list [*]
              6 item_id = f8
              6 serial_nbr = vc
              6 serial_mnemonic = vc
              6 description = vc
              6 item_nbr = vc
              6 quantity = f8
              6 quantity_ind = i2
              6 body_site = vc
              6 reference_entity_id = f8
              6 reference_entity_name = vc
              6 implant_result [*]
              7 item_id = f8
              7 item_size = vc
              7 harvest_site = vc
              7 culture_ind = i2
              7 culture_ind_ind = i2
              7 tissue_graft_type_cd = f8
              7 tissue_graft_type_cd_disp = vc
              7 explant_reason_cd = f8
              7 explant_reason_cd_disp = vc
              7 explant_disposition_cd = f8
              7 explant_disposition_cd_disp = vc
              7 reference_entity_id = f8
              7 reference_entity_name = vc
              7 manufacturer_cd = f8
              7 manufacturer_cd_disp = vc
              7 manufacturer_ft = vc
              7 model_nbr = vc
              7 lot_nbr = vc
              7 other_identifier = vc
              7 expiration_dt_tm = dq8
              7 expiration_dt_tm_ind = i2
              7 ecri_code = vc
              7 batch_nbr = vc
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_id = f8
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              6 inv_time_result_list [*]
              7 item_id = f8
              7 start_dt_tm = dq8
              7 start_dt_tm_ind = i2
              7 end_dt_tm = dq8
              7 end_dt_tm_ind = i2
              7 event_id = f8
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_id = f8
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              6 event_id = f8
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_id = f8
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 child_event_list [*]
            5 hla_list [*]
            5 order_action_sequence = i4
            5 entry_mode_cd = f8
            5 source_cd = f8
            5 source_cd_disp = vc
            5 source_cd_mean = vc
            5 clinical_seq = vc
            5 event_start_tz = i4
            5 event_end_tz = i4
            5 verified_tz = i4
            5 performed_tz = i4
            5 calculation_result_list [*]
              6 event_id = f8
              6 equation = vc
              6 calculation_result = vc
              6 calculation_result_frmt_cd = f8
              6 calculation_result_frmt_cd_disp = vc
              6 last_norm_dt_tm = dq8
              6 last_norm_dt_tm_ind = i2
              6 unit_of_measure_cd = f8
              6 unit_of_measure_cd_disp = vc
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 contributor_link_list [*]
              7 event_id = f8
              7 contributor_event_id = f8
              7 ce_valid_from_dt_tm = dq8
              7 type_flag = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 ce_valid_until_dt_tm = dq8
              7 ce_result_value = vc
              7 ce_performed_prsnl_id = f8
              7 ce_event_end_dt_tm = dq8
              7 ce_event_cd = f8
              7 ce_event_cd_disp = vc
              7 ce_clinical_event_id = f8
              7 ce_event_class_cd = f8
              7 ce_event_class_cd_disp = vc
              7 string_result_list [*]
                8 event_id = f8
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 string_result_text = vc
                8 string_result_format_cd = f8
                8 string_result_format_cd_disp = vc
                8 equation_id = f8
                8 last_norm_dt_tm = dq8
                8 last_norm_dt_tm_ind = i2
                8 unit_of_measure_cd = f8
                8 unit_of_measure_cd_disp = vc
                8 feasible_ind = i2
                8 feasible_ind_ind = i2
                8 inaccurate_ind = i2
                8 inaccurate_ind_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 interp_comp_list [*]
                9 event_id = f8
                9 comp_idx = i4
                9 comp_idx_ind = i2
                9 valid_from_dt_tm = dq8
                9 valid_from_dt_tm_ind = i2
                9 valid_until_dt_tm = dq8
                9 valid_until_dt_tm_ind = i2
                9 comp_event_id = f8
                9 updt_dt_tm = dq8
                9 updt_dt_tm_ind = i2
                9 updt_id = f8
                9 updt_task = i4
                9 updt_task_ind = i2
                9 updt_cnt = i4
                9 updt_cnt_ind = i2
                9 updt_applctx = i4
                9 updt_applctx_ind = i2
                9 comp_name = vc
                8 calculation_equation = vc
                8 string_long_text_id = f8
              7 coded_result_list [*]
                8 event_id = f8
                8 sequence_nbr = i4
                8 sequence_nbr_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 nomenclature_id = f8
                8 result_set = i4
                8 result_set_ind = i2
                8 result_cd = f8
                8 result_cd_disp = vc
                8 acr_code_str = vc
                8 proc_code_str = vc
                8 pathology_str = vc
                8 group_nbr = i4
                8 group_nbr_ind = i2
                8 mnemonic = vc
                8 short_string = vc
                8 descriptor = vc
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 unit_of_measure_cd = f8
                8 source_string = vc
              7 date_result_list [*]
                8 event_id = f8
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 result_dt_tm = dq8
                8 result_dt_tm_ind = i2
                8 result_dt_tm_os = f8
                8 result_dt_tm_os_ind = i2
                8 date_type_flag = i2
                8 date_type_flag_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 result_tz = i4
                8 result_tz_ind = i2
              7 ce_result_status_cd = f8
              7 ce_result_status_cd_disp = vc
              7 ce_event_end_tz = i4
            5 task_assay_version_nbr = f8
            5 modifier_long_text = vc
            5 modifier_long_text_id = f8
            5 result_set_link_list [*]
              6 event_id = f8
              6 result_set_id = f8
              6 entry_type_cd = f8
              6 entry_type_cd_disp = vc
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 relation_type_cd = f8
            5 event_order_link_list [*]
              6 event_id = f8
              6 order_id = f8
              6 order_action_sequence = i4
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 template_order_id = f8
              6 event_end_dt_tm = dq8
              6 parent_order_ident = f8
              6 person_id = f8
              6 encntr_id = f8
              6 catalog_type_cd = f8
              6 ce_event_order_link_id = f8
            5 scd_modifier_list [*]
              6 event_id = f8
              6 concept_cki = vc
              6 phrase = vc
              6 display = vc
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 valid_from_dt_tm = dq8
            5 endorse_ind = i2
            5 new_result_ind = i2
            5 organization_id = f8
            5 intake_output_result [*]
              6 ce_io_result_id = f8
              6 io_result_id = f8
              6 event_id = f8
              6 person_id = f8
              6 encntr_id = f8
              6 io_start_dt_tm = dq8
              6 io_start_dt_tm_ind = i2
              6 io_end_dt_tm = dq8
              6 io_end_dt_tm_ind = i2
              6 io_type_flag = i2
              6 io_volume = f8
              6 io_status_cd = f8
              6 io_status_cd_disp = vc
              6 io_status_cd_mean = vc
              6 reference_event_id = f8
              6 reference_event_cd = f8
              6 reference_event_cd_disp = vc
              6 valid_from_dt_tm = dq8
              6 valid_from_dt_tm_ind = i2
              6 valid_until_dt_tm = dq8
              6 valid_until_dt_tm_ind = i2
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
            5 io_total_result_list [*]
              6 ce_io_total_result_id = f8
              6 io_total_definition_id = f8
              6 event_id = f8
              6 encntr_id = f8
              6 encntr_focused_ind = i2
              6 person_id = f8
              6 io_total_start_dt_tm = dq8
              6 io_total_end_dt_tm = dq8
              6 io_total_value = f8
              6 io_total_unit_cd = f8
              6 io_total_unit_disp = vc
              6 io_total_unit_mean = vc
              6 suspect_flag = i2
              6 last_io_result_clinsig_dt_tm = dq8
              6 valid_from_dt_tm = dq8
              6 valid_until_dt_tm = dq8
              6 updt_dt_tm = dq8
              6 updt_dt_tm_ind = i2
              6 updt_id = f8
              6 updt_task = i4
              6 updt_task_ind = i2
              6 updt_cnt = i4
              6 updt_cnt_ind = i2
              6 updt_applctx = i4
              6 updt_applctx_ind = i2
              6 contributor_link_list [*]
              7 event_id = f8
              7 contributor_event_id = f8
              7 ce_valid_from_dt_tm = dq8
              7 type_flag = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 ce_valid_until_dt_tm = dq8
              7 ce_result_value = vc
              7 ce_performed_prsnl_id = f8
              7 ce_event_end_dt_tm = dq8
              7 ce_event_cd = f8
              7 ce_event_cd_disp = vc
              7 ce_clinical_event_id = f8
              7 ce_event_class_cd = f8
              7 ce_event_class_cd_disp = vc
              7 string_result_list [*]
                8 event_id = f8
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 string_result_text = vc
                8 string_result_format_cd = f8
                8 string_result_format_cd_disp = vc
                8 equation_id = f8
                8 last_norm_dt_tm = dq8
                8 last_norm_dt_tm_ind = i2
                8 unit_of_measure_cd = f8
                8 unit_of_measure_cd_disp = vc
                8 feasible_ind = i2
                8 feasible_ind_ind = i2
                8 inaccurate_ind = i2
                8 inaccurate_ind_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 interp_comp_list [*]
                9 event_id = f8
                9 comp_idx = i4
                9 comp_idx_ind = i2
                9 valid_from_dt_tm = dq8
                9 valid_from_dt_tm_ind = i2
                9 valid_until_dt_tm = dq8
                9 valid_until_dt_tm_ind = i2
                9 comp_event_id = f8
                9 updt_dt_tm = dq8
                9 updt_dt_tm_ind = i2
                9 updt_id = f8
                9 updt_task = i4
                9 updt_task_ind = i2
                9 updt_cnt = i4
                9 updt_cnt_ind = i2
                9 updt_applctx = i4
                9 updt_applctx_ind = i2
                9 comp_name = vc
                8 calculation_equation = vc
                8 string_long_text_id = f8
              7 coded_result_list [*]
                8 event_id = f8
                8 sequence_nbr = i4
                8 sequence_nbr_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 nomenclature_id = f8
                8 result_set = i4
                8 result_set_ind = i2
                8 result_cd = f8
                8 result_cd_disp = vc
                8 acr_code_str = vc
                8 proc_code_str = vc
                8 pathology_str = vc
                8 group_nbr = i4
                8 group_nbr_ind = i2
                8 mnemonic = vc
                8 short_string = vc
                8 descriptor = vc
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 unit_of_measure_cd = f8
                8 source_string = vc
              7 date_result_list [*]
                8 event_id = f8
                8 valid_until_dt_tm = dq8
                8 valid_until_dt_tm_ind = i2
                8 valid_from_dt_tm = dq8
                8 valid_from_dt_tm_ind = i2
                8 result_dt_tm = dq8
                8 result_dt_tm_ind = i2
                8 result_dt_tm_os = f8
                8 result_dt_tm_os_ind = i2
                8 date_type_flag = i2
                8 date_type_flag_ind = i2
                8 updt_dt_tm = dq8
                8 updt_dt_tm_ind = i2
                8 updt_id = f8
                8 updt_task = i4
                8 updt_task_ind = i2
                8 updt_cnt = i4
                8 updt_cnt_ind = i2
                8 updt_applctx = i4
                8 updt_applctx_ind = i2
                8 result_tz = i4
                8 result_tz_ind = i2
              7 ce_result_status_cd = f8
              7 ce_result_status_cd_disp = vc
              7 ce_event_end_tz = i4
              6 io_total_result_val = vc
            5 src_event_id = f8
            5 src_clinsig_updt_dt_tm = dq8
            5 nomen_string_flag = i2
            5 ce_dynamic_label_id = f8
            5 dynamic_label_list [*]
              6 ce_dynamic_label_id = f8
              6 label_name = vc
              6 label_prsnl_id = f8
              6 label_status_cd = f8
              6 label_seq_nbr = i4
              6 valid_from_dt_tm = dq8
              6 label_comment = vc
            5 device_free_txt = vc
            5 trait_bit_map = i4
        4 hla_list [*]
        4 order_action_sequence = i4
        4 entry_mode_cd = f8
        4 source_cd = f8
        4 source_cd_disp = vc
        4 source_cd_mean = vc
        4 clinical_seq = vc
        4 event_start_tz = i4
        4 event_end_tz = i4
        4 verified_tz = i4
        4 performed_tz = i4
        4 calculation_result_list [*]
          5 event_id = f8
          5 equation = vc
          5 calculation_result = vc
          5 calculation_result_frmt_cd = f8
          5 calculation_result_frmt_cd_disp = vc
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 contributor_link_list [*]
          6 event_id = f8
          6 contributor_event_id = f8
          6 ce_valid_from_dt_tm = dq8
          6 type_flag = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 ce_valid_until_dt_tm = dq8
          6 ce_result_value = vc
          6 ce_performed_prsnl_id = f8
          6 ce_event_end_dt_tm = dq8
          6 ce_event_cd = f8
          6 ce_event_cd_disp = vc
          6 ce_clinical_event_id = f8
          6 ce_event_class_cd = f8
          6 ce_event_class_cd_disp = vc
          6 string_result_list [*]
            7 event_id = f8
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 string_result_text = vc
            7 string_result_format_cd = f8
            7 string_result_format_cd_disp = vc
            7 equation_id = f8
            7 last_norm_dt_tm = dq8
            7 last_norm_dt_tm_ind = i2
            7 unit_of_measure_cd = f8
            7 unit_of_measure_cd_disp = vc
            7 feasible_ind = i2
            7 feasible_ind_ind = i2
            7 inaccurate_ind = i2
            7 inaccurate_ind_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 interp_comp_list [*]
            8 event_id = f8
            8 comp_idx = i4
            8 comp_idx_ind = i2
            8 valid_from_dt_tm = dq8
            8 valid_from_dt_tm_ind = i2
            8 valid_until_dt_tm = dq8
            8 valid_until_dt_tm_ind = i2
            8 comp_event_id = f8
            8 updt_dt_tm = dq8
            8 updt_dt_tm_ind = i2
            8 updt_id = f8
            8 updt_task = i4
            8 updt_task_ind = i2
            8 updt_cnt = i4
            8 updt_cnt_ind = i2
            8 updt_applctx = i4
            8 updt_applctx_ind = i2
            8 comp_name = vc
            7 calculation_equation = vc
            7 string_long_text_id = f8
          6 coded_result_list [*]
            7 event_id = f8
            7 sequence_nbr = i4
            7 sequence_nbr_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 nomenclature_id = f8
            7 result_set = i4
            7 result_set_ind = i2
            7 result_cd = f8
            7 result_cd_disp = vc
            7 acr_code_str = vc
            7 proc_code_str = vc
            7 pathology_str = vc
            7 group_nbr = i4
            7 group_nbr_ind = i2
            7 mnemonic = vc
            7 short_string = vc
            7 descriptor = vc
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 unit_of_measure_cd = f8
            7 source_string = vc
          6 date_result_list [*]
            7 event_id = f8
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 result_dt_tm = dq8
            7 result_dt_tm_ind = i2
            7 result_dt_tm_os = f8
            7 result_dt_tm_os_ind = i2
            7 date_type_flag = i2
            7 date_type_flag_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 result_tz = i4
            7 result_tz_ind = i2
          6 ce_result_status_cd = f8
          6 ce_result_status_cd_disp = vc
          6 ce_event_end_tz = i4
        4 task_assay_version_nbr = f8
        4 modifier_long_text = vc
        4 modifier_long_text_id = f8
        4 result_set_link_list [*]
          5 event_id = f8
          5 result_set_id = f8
          5 entry_type_cd = f8
          5 entry_type_cd_disp = vc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 relation_type_cd = f8
        4 event_order_link_list [*]
          5 event_id = f8
          5 order_id = f8
          5 order_action_sequence = i4
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 template_order_id = f8
          5 event_end_dt_tm = dq8
          5 parent_order_ident = f8
          5 person_id = f8
          5 encntr_id = f8
          5 catalog_type_cd = f8
          5 ce_event_order_link_id = f8
        4 scd_modifier_list [*]
          5 event_id = f8
          5 concept_cki = vc
          5 phrase = vc
          5 display = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 valid_from_dt_tm = dq8
        4 endorse_ind = i2
        4 new_result_ind = i2
        4 organization_id = f8
        4 intake_output_result [*]
          5 ce_io_result_id = f8
          5 io_result_id = f8
          5 event_id = f8
          5 person_id = f8
          5 encntr_id = f8
          5 io_start_dt_tm = dq8
          5 io_start_dt_tm_ind = i2
          5 io_end_dt_tm = dq8
          5 io_end_dt_tm_ind = i2
          5 io_type_flag = i2
          5 io_volume = f8
          5 io_status_cd = f8
          5 io_status_cd_disp = vc
          5 io_status_cd_mean = vc
          5 reference_event_id = f8
          5 reference_event_cd = f8
          5 reference_event_cd_disp = vc
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 io_total_result_list [*]
          5 ce_io_total_result_id = f8
          5 io_total_definition_id = f8
          5 event_id = f8
          5 encntr_id = f8
          5 encntr_focused_ind = i2
          5 person_id = f8
          5 io_total_start_dt_tm = dq8
          5 io_total_end_dt_tm = dq8
          5 io_total_value = f8
          5 io_total_unit_cd = f8
          5 io_total_unit_disp = vc
          5 io_total_unit_mean = vc
          5 suspect_flag = i2
          5 last_io_result_clinsig_dt_tm = dq8
          5 valid_from_dt_tm = dq8
          5 valid_until_dt_tm = dq8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 contributor_link_list [*]
          6 event_id = f8
          6 contributor_event_id = f8
          6 ce_valid_from_dt_tm = dq8
          6 type_flag = i2
          6 valid_from_dt_tm = dq8
          6 valid_from_dt_tm_ind = i2
          6 valid_until_dt_tm = dq8
          6 valid_until_dt_tm_ind = i2
          6 updt_dt_tm = dq8
          6 updt_dt_tm_ind = i2
          6 updt_id = f8
          6 updt_task = i4
          6 updt_task_ind = i2
          6 updt_cnt = i4
          6 updt_cnt_ind = i2
          6 updt_applctx = i4
          6 updt_applctx_ind = i2
          6 ce_valid_until_dt_tm = dq8
          6 ce_result_value = vc
          6 ce_performed_prsnl_id = f8
          6 ce_event_end_dt_tm = dq8
          6 ce_event_cd = f8
          6 ce_event_cd_disp = vc
          6 ce_clinical_event_id = f8
          6 ce_event_class_cd = f8
          6 ce_event_class_cd_disp = vc
          6 string_result_list [*]
            7 event_id = f8
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 string_result_text = vc
            7 string_result_format_cd = f8
            7 string_result_format_cd_disp = vc
            7 equation_id = f8
            7 last_norm_dt_tm = dq8
            7 last_norm_dt_tm_ind = i2
            7 unit_of_measure_cd = f8
            7 unit_of_measure_cd_disp = vc
            7 feasible_ind = i2
            7 feasible_ind_ind = i2
            7 inaccurate_ind = i2
            7 inaccurate_ind_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 interp_comp_list [*]
            8 event_id = f8
            8 comp_idx = i4
            8 comp_idx_ind = i2
            8 valid_from_dt_tm = dq8
            8 valid_from_dt_tm_ind = i2
            8 valid_until_dt_tm = dq8
            8 valid_until_dt_tm_ind = i2
            8 comp_event_id = f8
            8 updt_dt_tm = dq8
            8 updt_dt_tm_ind = i2
            8 updt_id = f8
            8 updt_task = i4
            8 updt_task_ind = i2
            8 updt_cnt = i4
            8 updt_cnt_ind = i2
            8 updt_applctx = i4
            8 updt_applctx_ind = i2
            8 comp_name = vc
            7 calculation_equation = vc
            7 string_long_text_id = f8
          6 coded_result_list [*]
            7 event_id = f8
            7 sequence_nbr = i4
            7 sequence_nbr_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 nomenclature_id = f8
            7 result_set = i4
            7 result_set_ind = i2
            7 result_cd = f8
            7 result_cd_disp = vc
            7 acr_code_str = vc
            7 proc_code_str = vc
            7 pathology_str = vc
            7 group_nbr = i4
            7 group_nbr_ind = i2
            7 mnemonic = vc
            7 short_string = vc
            7 descriptor = vc
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 unit_of_measure_cd = f8
            7 source_string = vc
          6 date_result_list [*]
            7 event_id = f8
            7 valid_until_dt_tm = dq8
            7 valid_until_dt_tm_ind = i2
            7 valid_from_dt_tm = dq8
            7 valid_from_dt_tm_ind = i2
            7 result_dt_tm = dq8
            7 result_dt_tm_ind = i2
            7 result_dt_tm_os = f8
            7 result_dt_tm_os_ind = i2
            7 date_type_flag = i2
            7 date_type_flag_ind = i2
            7 updt_dt_tm = dq8
            7 updt_dt_tm_ind = i2
            7 updt_id = f8
            7 updt_task = i4
            7 updt_task_ind = i2
            7 updt_cnt = i4
            7 updt_cnt_ind = i2
            7 updt_applctx = i4
            7 updt_applctx_ind = i2
            7 result_tz = i4
            7 result_tz_ind = i2
          6 ce_result_status_cd = f8
          6 ce_result_status_cd_disp = vc
          6 ce_event_end_tz = i4
          5 io_total_result_val = vc
        4 src_event_id = f8
        4 src_clinsig_updt_dt_tm = dq8
        4 nomen_string_flag = i2
        4 ce_dynamic_label_id = f8
        4 dynamic_label_list [*]
          5 ce_dynamic_label_id = f8
          5 label_name = vc
          5 label_prsnl_id = f8
          5 label_status_cd = f8
          5 label_seq_nbr = i4
          5 valid_from_dt_tm = dq8
          5 label_comment = vc
        4 device_free_txt = vc
        4 trait_bit_map = i4
      3 hla_list [*]
      3 order_action_sequence = i4
      3 entry_mode_cd = f8
      3 source_cd = f8
      3 source_cd_disp = vc
      3 source_cd_mean = vc
      3 clinical_seq = vc
      3 event_start_tz = i4
      3 event_end_tz = i4
      3 verified_tz = i4
      3 performed_tz = i4
      3 calculation_result_list [*]
        4 event_id = f8
        4 equation = vc
        4 calculation_result = vc
        4 calculation_result_frmt_cd = f8
        4 calculation_result_frmt_cd_disp = vc
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
      3 task_assay_version_nbr = f8
      3 modifier_long_text = vc
      3 modifier_long_text_id = f8
      3 result_set_link_list [*]
        4 event_id = f8
        4 result_set_id = f8
        4 entry_type_cd = f8
        4 entry_type_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 relation_type_cd = f8
      3 event_order_link_list [*]
        4 event_id = f8
        4 order_id = f8
        4 order_action_sequence = i4
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 template_order_id = f8
        4 event_end_dt_tm = dq8
        4 parent_order_ident = f8
        4 person_id = f8
        4 encntr_id = f8
        4 catalog_type_cd = f8
        4 ce_event_order_link_id = f8
      3 scd_modifier_list [*]
        4 event_id = f8
        4 concept_cki = vc
        4 phrase = vc
        4 display = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 valid_from_dt_tm = dq8
      3 endorse_ind = i2
      3 new_result_ind = i2
      3 organization_id = f8
      3 intake_output_result [*]
        4 ce_io_result_id = f8
        4 io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 encntr_id = f8
        4 io_start_dt_tm = dq8
        4 io_start_dt_tm_ind = i2
        4 io_end_dt_tm = dq8
        4 io_end_dt_tm_ind = i2
        4 io_type_flag = i2
        4 io_volume = f8
        4 io_status_cd = f8
        4 io_status_cd_disp = vc
        4 io_status_cd_mean = vc
        4 reference_event_id = f8
        4 reference_event_cd = f8
        4 reference_event_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 io_total_result_list [*]
        4 ce_io_total_result_id = f8
        4 io_total_definition_id = f8
        4 event_id = f8
        4 encntr_id = f8
        4 encntr_focused_ind = i2
        4 person_id = f8
        4 io_total_start_dt_tm = dq8
        4 io_total_end_dt_tm = dq8
        4 io_total_value = f8
        4 io_total_unit_cd = f8
        4 io_total_unit_disp = vc
        4 io_total_unit_mean = vc
        4 suspect_flag = i2
        4 last_io_result_clinsig_dt_tm = dq8
        4 valid_from_dt_tm = dq8
        4 valid_until_dt_tm = dq8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
        4 io_total_result_val = vc
      3 src_event_id = f8
      3 src_clinsig_updt_dt_tm = dq8
      3 nomen_string_flag = i2
      3 ce_dynamic_label_id = f8
      3 dynamic_label_list [*]
        4 ce_dynamic_label_id = f8
        4 label_name = vc
        4 label_prsnl_id = f8
        4 label_status_cd = f8
        4 label_seq_nbr = i4
        4 valid_from_dt_tm = dq8
        4 label_comment = vc
      3 device_free_txt = vc
      3 trait_bit_map = i4
    2 person_list [*]
      3 person_id = f8
      3 name_full_formatted = vc
      3 prsnl_name_full_formatted = vc
)
 
free record shx_get_social_history_def_601050_req
record shx_get_social_history_def_601050_req (
  1 category_qual [*]
    2 category_ref_id = f8
  1 all_categories_ind = i2
)
 
free record shx_get_social_history_def_601050_rep
record shx_get_social_history_def_601050_rep (
  1 category_qual [* ]
    2 shx_category_ref_id = f8
    2 category_cd = f8
    2 description = vc
    2 shx_category_def_id = f8
    2 comment_ind = i2
    2 element_qual [* ]
      3 shx_element_id = f8
      3 element_seq = i4
      3 task_assay_cd = f8
      3 input_type_cd = f8
      3 response_label = vc
      3 response_label_layout_flag = i2
      3 required_ind = i2
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record shx_get_activity_previous_601052_req
record shx_get_activity_previous_601052_req (
  1 person_id = f8
  1 prsnl_id = f8
  1 category_qual [*]
    2 shx_category_ref_id = f8
)
 
free record shx_get_activity_previous_601052_rep
record shx_get_activity_previous_601052_rep (
  1 activity_qual [* ]
    2 shx_category_ref_id = f8
    2 shx_category_def_id = f8
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 person_id = f8
    2 organization_id = f8
    2 type_mean = c12
    2 unable_to_obtain_ind = i2
    2 status_cd = f8
    2 assessment_cd = f8
    2 detail_summary_text_id = f8
    2 detail_summary = vc
    2 last_review_dt_tm = dq8
    2 last_updt_prsnl_id = f8
    2 last_updt_prsnl_name = vc
    2 last_updt_dt_tm = dq8
    2 updt_cnt = i4
    2 comment_qual [* ]
      3 shx_comment_id = f8
      3 long_text_id = f8
      3 long_text = vc
      3 comment_prsnl_id = f8
      3 comment_prsnl_full_name = vc
      3 comment_dt_tm = dq8
      3 comment_dt_tm_tz = i4
      3 updt_cnt = i4
    2 action_qual [* ]
      3 shx_action_id = f8
      3 prsnl_id = f8
      3 prsnl_full_name = vc
      3 action_type_mean = c12
      3 action_dt_tm = dq8
      3 action_tz = i4
      3 updt_cnt = i4
    2 beg_effective_dt_tm = dq8
    2 last_updt_tz = i4
  1 incomplete_data_ind = i2
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record shx_get_activity_new_601052_req
record shx_get_activity_new_601052_req (
  1 person_id = f8
  1 prsnl_id = f8
  1 category_qual [*]
    2 shx_category_ref_id = f8
)
 
free record shx_get_activity_new_601052_rep
record shx_get_activity_new_601052_rep (
  1 activity_qual [* ]
    2 shx_category_ref_id = f8
    2 shx_category_def_id = f8
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 person_id = f8
    2 organization_id = f8
    2 type_mean = c12
    2 unable_to_obtain_ind = i2
    2 status_cd = f8
    2 assessment_cd = f8
    2 detail_summary_text_id = f8
    2 detail_summary = vc
    2 last_review_dt_tm = dq8
    2 last_updt_prsnl_id = f8
    2 last_updt_prsnl_name = vc
    2 last_updt_dt_tm = dq8
    2 updt_cnt = i4
    2 comment_qual [* ]
      3 shx_comment_id = f8
      3 long_text_id = f8
      3 long_text = vc
      3 comment_prsnl_id = f8
      3 comment_prsnl_full_name = vc
      3 comment_dt_tm = dq8
      3 comment_dt_tm_tz = i4
      3 updt_cnt = i4
    2 action_qual [* ]
      3 shx_action_id = f8
      3 prsnl_id = f8
      3 prsnl_full_name = vc
      3 action_type_mean = c12
      3 action_dt_tm = dq8
      3 action_tz = i4
      3 updt_cnt = i4
    2 beg_effective_dt_tm = dq8
    2 last_updt_tz = i4
  1 incomplete_data_ind = i2
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record shx_ens_activity_601051_req
record shx_ens_activity_601051_req (
  1 organization_id = f8
  1 person_id = f8
  1 activity_qual [*]
    2 ensure_type = c12
    2 shx_category_ref_id = f8
    2 shx_category_def_id = f8
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 type_mean = c12
    2 unable_to_obtain_ind = i2
    2 assessment_cd = f8
    2 detail_summary_text_id = f8
    2 detail_summary = vc
    2 shx_comment_id = f8
    2 comment = vc
    2 perform_dt_tm = dq8
    2 perform_tz = i4
    2 updt_cnt = i4
    2 response_qual [*]
      3 shx_response_id = f8
      3 task_assay_cd = f8
      3 response_type = c12
      3 response_val = c255
      3 response_unit_cd = f8
      3 modifier_flag = i4
      3 long_text_id = f8
      3 long_text = vc
      3 alpha_response_qual [*]
        4 shx_alpha_response_id = f8
        4 nomenclature_id = f8
        4 other_text = c255
    2 shx_pre_generated_id = f8
)
 
free record shx_ens_activity_601051_rep
record shx_ens_activity_601051_rep (
  1 person_id = f8
  1 activity_qual [* ]
    2 shx_category_ref_id = f8
    2 shx_category_def_id = f8
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 type_mean = c12
    2 detail_summary_text_id = f8
    2 shx_comment_id = f8
    2 updt_cnt = i4
    2 response_qual [* ]
      3 shx_response_id = f8
      3 task_assay_cd = f8
      3 long_text_id = f8
      3 alpha_response_qual [* ]
        4 shx_alpha_response_id = f8
        4 nomenclature_id = f8
        4 other_text = c255
    2 beg_effective_dt_tm = dq8
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record dcp_get_dta_info_all_600356_req
record dcp_get_dta_info_all_600356_req (
  1 dta [*]
    2 task_assay_cd = f8
)
 
free record dcp_get_dta_info_all_600356_rep
record dcp_get_dta_info_all_600356_rep (
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
 
free record dcp_add_task_560300_req
record dcp_add_task_560300_req (
  1 person_id = f8
  1 encntr_id = f8
  1 stat_ind = i2
  1 task_type_cd = f8
  1 task_type_meaning = c12
  1 reference_task_id = f8
  1 task_dt_tm = dq8
  1 task_activity_meaning = c12
  1 msg_text = c32768
  1 msg_subject_cd = f8
  1 msg_subject = c255
  1 confidential_ind = i2
  1 read_ind = i2
  1 delivery_ind = i2
  1 event_id = f8
  1 event_class_meaning = c12
  1 order_id = f8
  1 catalog_cd = f8
  1 task_class_cd = f8
  1 med_order_type_cd = f8
  1 catalog_type_cd = f8
  1 assign_prsnl_list [*]
    2 assign_prsnl_id = f8
  1 task_status_meaning = c12
  1 charted_by_agent_cd = f8
  1 charted_by_agent_identifier = c255
  1 charting_context_reference = c255
  1 result_set_id = f8
  1 container_id = f8
  1 collection_priority_cd = f8
  1 source_tag = c255
)
 
free record dcp_add_task_560300_rep
record dcp_add_task_560300_rep (
  1 task_status = c1
  1 task_id = f8
  1 assign_prsnl_list [*]
    2 assign_prsnl_id = f8
)
 
; 600353 dcp_upd_forms_activity
free record 600353_req
record 600353_req (
  1 form_activity_id = f8
  1 form_reference_id = f8
  1 person_id = f8
  1 encntr_id = f8
  1 task_id = f8
  1 form_dt_tm = dq8
  1 form_tz = i4
  1 form_status_cd = f8
  1 flags = i4
  1 description = vc
  1 version_dt_tm = dq8
  1 component [*]
    2 parent_entity_name = vc
    2 parent_entity_id = f8
    2 component_cd = f8
  1 prsnl [*]
    2 prsnl_id = f8
    2 prsnl_ft = vc
    2 proxy_id = f8
    2 activity_dt_tm = dq8
  1 reference_nbr = vc
)
 
; 600353 dcp_upd_forms_activity
free record 600353_rep
record 600353_rep (
  1 activity_form_id = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
free record dcp_upd_form_activity_comp_600416_req
record dcp_upd_form_activity_comp_600416_req (
1 req_list [*]
  2 dcp_forms_activity_id = f8
  2 component_cd = f8
  2 parent_entity_id = f8
  2 parent_entity_name = vc
  2 reference_nbr = vc
)
 
free record dcp_upd_form_activity_comp_600416_rep
record dcp_upd_form_activity_comp_600416_rep (
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record dcp_write_form_xml_blob_600181_req
record dcp_write_form_xml_blob_600181_req (
  1 dcp_forms_activity_id = f8
  1 long_blob = gvc
)
 
free record dcp_write_form_xml_blob_600181_rep
record dcp_write_form_xml_blob_600181_rep (
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record MSVC_CheckPrivileges_680501_req
record MSVC_CheckPrivileges_680501_req (
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
 
free record MSVC_CheckPrivileges_680501_rep
record MSVC_CheckPrivileges_680501_rep (
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
 
free record MSVC_GetPrivilegesByCodes_680500_req
record MSVC_GetPrivilegesByCodes_680500_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 privilege_criteria
    2 privileges [*]
      3 privilege_cd = f8
    2 locations [*]
      3 location_id = f8
)
 
free record MSVC_GetPrivilegesByCodes_680500_rep
record MSVC_GetPrivilegesByCodes_680500_rep (
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
 
free record pat_pwrform_reply_out
record pat_pwrform_reply_out (
  1 form_id = f8
  1 audit
    2 user_id = f8
    2 user_firstname = vc
    2 user_lastname = vc
    2 patient_id = f8
    2 patient_firstname = vc
    2 patient_lastname = vc
    2 service_version = vc
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
;INCLUDES
**************************************************************************/
execute snsro_common
execute crmrtl
execute srvrtl
 
/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
; Constants
declare c_json_args = gvc with protect, constant(trim($JSON_ARGS,3))
declare iDebugFlag = i2 with protect, constant(cnvtint($DEBUG_FLAG))
declare c_time_zone_index = i4 with protect, constant(CURTIMEZONEAPP)
declare c_time_zone_short_name_mode = i2 with protect, constant(7) ; Only used for calling DATETIMEZONEBYINDEX
declare lOffset = i4 with protect, noconstant(0) ; Only used for calling DATETIMEZONEBYINDEX
declare lDaylight = i4 with protect, noconstant(0) ; Only used for calling DATETIMEZONEBYINDEX
declare c_time_zone_suffix = vc with protect,
  constant(DATETIMEZONEBYINDEX(c_time_zone_index,lOffset,lDaylight,c_time_zone_short_name_mode))
declare c_now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_script_name = vc with protect, constant("vigilanz_pat_pwrform")
declare c_error_handler = vc with protect, constant("PATCH POWERFORM")
declare c_reference_nbr_date = vc with protect, constant(format(c_now_dt_tm,"yyyymmddhhmmss00;;q"))
 
; PowerForm Section Control Input Types
declare c_input_type_label = i4 with protect, constant(1)
declare c_input_type_problem_list_diagnosis = i4 with protect, constant(2)
declare c_input_type_social_history = i4 with protect, constant(8)
declare c_input_type_rtf = i4 with protect, constant(13)
 
; Social History Response Modifier Flags
declare c_shx_modifier_actual_age = i4 with protect, constant(0)
declare c_shx_modifier_about_age = i4 with protect, constant(1)
declare c_shx_modifier_before_age = i4 with protect, constant(2)
declare c_shx_modifier_after_age = i4 with protect, constant(4)
declare c_shx_modifier_unknown = i4 with protect, constant(5)
 
; Social History Response Modifier Displays
declare c_shx_modifier_about_age_display = vc with protect, constant("About")
declare c_shx_modifier_before_age_display = vc with protect, constant("Before")
declare c_shx_modifier_after_age_display = vc with protect, constant("After")
declare c_shx_modifier_unknown_display = vc with protect, constant("Unknown")
 
; Social History Label Layout Flags
declare c_shx_response_label_layout_prefix = i4 with protect, constant(1)
declare c_shx_response_label_layout_suffix = i4 with protect, constant(2)
 
; Code Set 8
declare c_result_status_code_auth_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_result_status_code_modified_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"MODIFIED"))
declare c_result_status_code_altered_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"ALTERED"))
declare c_result_status_code_in_error_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"IN ERROR"))
 
; Code Set 21
declare c_verify_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_perform_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_sign_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"SIGN"))
declare c_modify_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"MODIFY"))
 
; Code Set 23
declare c_format_rtf_cd = f8 with protect, constant(uar_get_code_by("MEANING",23,"RTF"))
 
; Code Set 24
declare c_root_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"ROOT"))
declare c_child_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"CHILD"))
 
; Code Set 25
declare c_storage_blob_cd = f8 with protect, constant(uar_get_code_by("MEANING",25,"BLOB"))
 
; Code Set 48
declare c_record_status_code_active_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))

; Code Set 52
declare c_normalcy_extreme_high_cd = f8 with protect, constant(uar_get_code_by("MEANING",52,"EXTREMEHIGH"))
declare c_normalcy_extreme_low_cd = f8 with protect, constant(uar_get_code_by("MEANING",52,"EXTREMELOW"))
declare c_normalcy_high_cd = f8 with protect, constant(uar_get_code_by("MEANING",52,"HIGH"))
declare c_normalcy_low_cd = f8 with protect, constant(uar_get_code_by("MEANING",52,"LOW"))
 
; Code Set 53
declare c_grp_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_txt_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"TXT"))
declare c_num_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"NUM"))
declare c_date_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"DATE"))
declare c_doc_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"DOC"))
declare c_mdoc_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"MDOC"))
 
; Code Set 63
declare c_succession_type_interim_cd = f8 with protect, constant(uar_get_code_by("MEANING",63,"INTERIM"))
 
; Code Set 72
declare c_event_code_set = i4 with protect, constant(72)
 
; Code Set 73
declare c_contributor_source_powerchart_cd = f8 with protect, constant(uar_get_code_by("MEANING",73,"POWERCHART"))
 
; Code Set 79
declare c_complete_task_status_meaning = vc with protect, constant("COMPLETE")
declare c_complete_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,c_complete_task_status_meaning))
 
; Code Set 103
declare c_completed_action_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
 
; Code Set 289 - DTA Result Type
declare c_result_type_text_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"1"))
declare c_result_type_alpha_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"2"))
declare c_result_type_numeric_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"3"))
declare c_result_type_interp_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"4"))
declare c_result_type_multi_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"5"))
declare c_result_type_date_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"6"))
declare c_result_type_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"7"))
declare c_result_type_calculation_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"8"))
declare c_result_type_on_line_code_set_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"9"))
declare c_result_type_time_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"10"))
declare c_result_type_date_time_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"11"))
declare c_result_type_read_only_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"12"))
declare c_result_type_count_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"13"))
declare c_result_type_provider_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"14"))
declare c_result_type_orc_select_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"15"))
declare c_result_type_inventory_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"16"))
declare c_result_type_bill_only_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"17"))
declare c_result_type_yes_no_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"18"))
declare c_result_type_date_time_time_zone_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"19"))
declare c_result_type_alpha_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"21"))
declare c_result_type_multi_alpha_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"22"))
 
; Code Set 6016 (Privilege)
declare c_privilege_document_validation_section_cd = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VALSECONLY"))
declare c_privilege_sign_powerform_cd = f8 with protect, constant(uar_get_code_by("MEANING",6016,"SIGNPOWERFRM"))
declare c_privilege_view_social_history_cd = f8 with protect, constant(uar_get_code_by("MEANING",6016,"VIEWSOCHIST"))
declare c_privilege_update_social_history_cd = f8 with protect, constant(uar_get_code_by("MEANING",6016,"UPDSOCHIST"))
 
; Code Set 6025
declare c_task_class_adhoc_cd = f8 with protect, constant(uar_get_code_by("MEANING",6025,"ADHOC"))
 
; Code Set 14024
declare c_task_status_reason_dcp_chart_cd = f8 with protect, constant(uar_get_code_by("MEANING",14024,"DCP_CHART"))
 
; Code Set 14113
declare c_result_format_numeric_cd = f8 with protect, constant(uar_get_code_by("MEANING",14113,"NUMERIC"))
declare c_result_format_alpha_cd = f8 with protect, constant(uar_get_code_by("MEANING",14113,"ALPHA"))
 
; Code Set 18189
declare c_clinical_event_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"CLINCALEVENT"))
declare c_text_rendition_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"TEXTREND"))
 
; Code Set 29520
declare c_powerforms_entry_mode_cd = f8 with protect, constant(uar_get_code_by("MEANING",29520,"POWERFORMS"))
 
; Code Set 255090
declare c_charting_agent_powerform_cd = f8 with protect, constant(uar_get_code_by("MEANING",255090,"POWERFORM"))
 
; Code Set 255431
declare c_entry_type_powerforms_cd  = f8 with protect, constant(uar_get_code_by("MEANING",255431,"POWERFORMS"))
 
; Code Set 4002172
declare c_shx_activity_status_active_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4002172,"ACTIVE"))
 
 
declare c_application_id = i4 with protect, constant(600005)
declare iApplicationId = i4 with protect, noconstant(0)
declare iTransactionTaskId = i4 with protect, noconstant(0)
declare iStepId = i4 with protect, noconstant(0)
declare hApp = i4 with protect, noconstant(0)
declare hTask = i4 with protect, noconstant(0)
declare hStep = i4 with protect, noconstant(0)
declare crmstatus = i2 with protect, noconstant(0)
 
declare iEncounterTimeZoneIndex = i4 with protect, noconstant(0)
declare dOrganizationId = f8 with protect, noconstant(0.00)
declare dSectionEventCd = f8 with protect, noconstant(0.00)
declare dResultSetId = f8 with protect, noconstant(0.00)
declare dSocialHistoryActivityId = f8 with protect, noconstant(0.00)
declare dEncounterId = f8 with protect, noconstant(0.00)
declare dPersonId = f8 with protect, noconstant(0.00)
declare dContributorSystemCd = f8 with protect, noconstant(0.00)
declare dUnitCd = f8 with protect, noconstant(0.00)
declare dSexCd = f8 with protect, noconstant(0.00)
declare dAgeInMinutes = f8 with protect, noconstant(0.00)
 
declare iIndex = i4 with protect, noconstant(0)
declare iSectionIndex = i4 with protect, noconstant(0)
declare iControlIndex = i4 with protect, noconstant(0)
declare iModificationIndex = i4 with protect, noconstant(0)
declare iValueIndex = i4 with protect, noconstant(0)
declare iDTAIndex = i4 with protect, noconstant(0)
declare iNewRefRangeIndex = i4 with protect, noconstant(0)
declare iRefRangeIndex = i4 with protect, noconstant(0)
declare iRefRangeSize = i4 with protect, noconstant(0)
declare iAlphaResponseIndex = i4 with protect, noconstant(0)
declare iAlphaResponseSize = i4 with protect, noconstant(0)
declare iFieldIdsFound = i4 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set jrec = cnvtjsontorec(c_json_args)
declare dFormId = f8 with protect, noconstant(cnvtreal(arglist->FormId))
declare sUsername = vc with protect, noconstant(trim($USERNAME, 3))
; Use snsro_common GetPrsnlIDFromUserName to get the prsnl_id from the username
declare dUserId = f8 with protect, noconstant(GetPrsnlIDFromUserName(sUsername))
set reqinfo->updt_id = dUserId
declare sUserFullname = vc with protect, noconstant(GetNameFromPrsnID(dUserId))
declare performedDateTime = dq8 with protect, noconstant(GetDateTime(nullterm(trim(arglist->PerformedDateTime, 3))))
 
if(iDebugFlag > 0)
  call echorecord(arglist)
  call echo(build("reqinfo->updt_id  ->", reqinfo->updt_id))
  call echo(build("performedDateTime  ->", format(performedDateTime, ";;Q")))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetNextSequence(sSequenceName = vc) = f8 with protect
declare CompleteTask(null) = null with protect ; Call to DCP.ModTask (560303)
declare GetReferenceNumber(iIndex = i4) = vc with protect ; Gets the reference number for signing a PowerForm event
declare EndCrmCall(appHandle = i4, taskHandle = i4, stepHandle = i4) = null with protect
declare CreateTypeFromSrvField(hParent = i4, sParentFieldName = vc, hCopyFrom = i4, sCopyFromFieldName = vc) = i4 with protect
declare AddItemFromType(hParent = i4, sParentFieldName = vc, hType = i4) = i4 with protect
declare GetFormActivity(null) = null with protect ; Call dcp_get_form_activity (600354)
declare GetFormDefinition(null) = null with protect ; Call dcp_get_dcp_form (600373)
declare GetSectionEventCode(null) = null with protect ; Call dcp_get_code_alias (600336)
declare GetDiscreteTaskAssayDetails(null) = null with protect ; Call dcp_get_dta_info_all (600356)
declare PopulatePowerFormReference(null) = null with protect ; Populates the powerform_reference record structure
declare PopulatePowerFormActivity(null) = null with protect ; Populates the powerform_activity record structure
declare GetPreviousFormResults(null) = null with protect ; Gets the previous form results
declare GetPreviousFormRTFResults(null) = null with protect ; Gets the previous form RTF results
declare GetHistoricalFormResults(null) = null with protect ; Gets the historical form results
declare ValidatePowerFormActivity(null) = null with protect ; Validates that the powerform is properly filled out
declare PopulateSocialHistoryValues(null) = null with protect ; Populates the social_history record structure with values
declare ValidateSocialHistory(null) = null with protect ; Validates that social_history is properly filled out
declare PostPowerForm(null) = null with protect ; Posts a PowerForm
declare PostPowerFormRTF(null) = null with protect ; Posts a PowerForm RTF Millennium Document
declare EnsureEvents(null) = null with protect ; Call dcp_events_ensured (600345)
declare UpdateFormsActivity(null) = null with protect ; Call dcp_upd_forms_activity (600353)
declare UpdateFormActivityComponent(null) = null with protect ; Call dcp_upd_form_activity_comp (600416)
declare CheckPrivileges(null) = null with protect ; Checks all privileges for the workflow
declare GetSocialHistoryReference(null) = null with protect ; Call shx_get_social_history_def (601050)
declare GetPreviousSocialHistoryActivity(null) = null with protect ; Call shx_get_activity to get the previous activity (601052)
declare GetNewSocialHistoryActivity(null) = null with protect ; Call shx_get_activity to get the new activity (601052)
declare WriteSocialHistory(null) = null with protect ; Call shx_ens_activity (601051)
declare BuildSocialHistoryDetailSummary(iCategoryIndex = i4) = vc with protect
declare PopulateSocialHistoryElements(iCategoryIndex = i4, iActivityIndex = i4) = null with protect
declare GetSocialHistoryModifierFlagDisplay(modifierFlag = i4) = vc with protect
declare GetUnitDisplay(unitCd = f8) = vc with protect
declare GetRTFFormattedString(sOriginal = vc) = vc with protect ; Formats a string for RTF
declare GetRTFFormattedDateTimeToMinute(qDateTime = dq8, iTimeZoneIndex = i4) = vc with protect ; Formats a date/time for RTF
declare GetRTFFormattedDateTimeToSecond(qDateTime = dq8, iTimeZoneIndex = i4) = vc with protect ; Formats a date/time for RTF
declare BuildPowerFormRTFDocument(null) = null with protect ; Populates the powerform_activity RTF document
declare GetInformationForRTF(null) = null with protect
declare StripDateTimeSeconds(qDateTime = dq8, iTimeZoneIndex = i4) = dq8 with protect ; Strips the seconds from a date/time
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set dResultSetId = GetNextSequence("result_set_seq")
 
if(iDebugFlag > 0)
  call echo(build("dResultSetId  ->", dResultSetId))
endif
 
if(dFormId <= 0.00)
  call ErrorHandler2(c_error_handler, "F", "FormId",
    "FormId is required", "9999",
    "FormId is required", pat_pwrform_reply_out)
  go to exit_script
endif
 
call GetFormActivity(null)
 
set iRet = PopulateAudit(sUsername, dPersonId, pat_pwrform_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit",
    "PopulateAudit failed", "9999",
    "PopulateAudit failed", pat_pwrform_reply_out)
  go to exit_script
endif
 
call PopulatePowerFormReference(null)
 
call PopulatePowerFormActivity(null)
call ValidatePowerFormActivity(null)
 
call PopulateSocialHistoryValues(null)
call ValidateSocialHistory(null)
 
; Privilege checks must happen after the PowerForm activity information is populated
; to know if the social history privileges should be checked (they will only be
; checked if there are social history questions being answered)
call CheckPrivileges(null)
 
; Write Social History if any new information was provided
if((social_history->unable_to_obtain_ind = 1 and social_history->unable_to_obtain_provided_ind = 1)
  or social_history->element_answered_cnt > 0)
  call WriteSocialHistory(null)
endif
 
; If there is a social history component on the PowerForm then load the activity data to use to construct the XML
if(powerform_activity->components.social_history_ind = 1)
  call GetNewSocialHistoryActivity(null)
endif
 
call PostPowerForm(null)
call UpdateFormsActivity(null)
 
call GetInformationForRTF(null)
 
if(powerform_activity->document_event_cd > 0.0)
  call BuildPowerFormRTFDocument(null)
  call PostPowerFormRTF(null)
  call UpdateFormActivityComponent(null)
endif
 
call EnsureEvents(null)
 
call CompleteTask(null)
 
set pat_pwrform_reply_out->form_id = powerform_activity->form_activity_id
 
;Set audit to successful
call ErrorHandler2( c_error_handler, "S", "Success", "PowerForm task posted successfully.",
  "0000", "PowerForm task posted successfully.", pat_pwrform_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
if(iDebugFlag > 1)
  set sJsonOut = CNVTRECTOJSON(powerform_activity)
else
  set sJsonOut = CNVTRECTOJSON(pat_pwrform_reply_out)
endif

if(validate(_MEMORY_REPLY_STRING))
  set _MEMORY_REPLY_STRING = trim(sJsonOut, 3)
endif
 
if(iDebugFlag > 0)
  call echo("NOTE: Additional errors may be found in the latest $cer_temp/cmb_0200_*.out file")
 
  set _file = build2(trim(logical("ccluserdir"), 3), "/", c_script_name, ".json")
  call echo(build("_file  ->", _file))
 
  call echorecord(pat_pwrform_reply_out)
  call echojson(pat_pwrform_reply_out, _file, 0)
  call echo(build("sJsonOut  ->", sJsonOut))
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetNextSequence(sSequenceName = vc) = f8
;  Description: Gets the next sequence for a sequence name.
;  Parameters:
;    sSequenceName: The name of the sequence.
;  Return: The positive next sequence (if successful).
**************************************************************************/
subroutine GetNextSequence(sSequenceName)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetNextSequence Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  free record 600470_req
  record 600470_req (
    1 sequence_name = vc
  )
 
  free record 600470_rep
  record 600470_rep (
    1 sequence_id = f8
    1 status_data
      2 status = c1
      2 subeventstatus [1]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
  set iTransactionTaskId = 600701
  set iStepId = 600470
  set 600470_req->sequence_name = sSequenceName
 
   set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 600470_req, "REC", 600470_rep)
 
  set dSequenceId = 600470_rep->sequence_id
 
  if(iDebugFlag > 0 and dSequenceId <= 0.00)
    call echorecord(600470_rep)
  endif
 
  free record 600470_req
  free record 600470_rep
 
  if(dSequenceId <= 0.00)
    call ErrorHandler2(c_error_handler, "F", "GetNextSequence",
      concat("Unable to generate new sequence (sSequenceName=",sSequenceName,")"), "9999",
      concat("Unable to generate new sequence (sSequenceName=",sSequenceName,")"), pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    call echo(concat("GetNextSequence Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(dSequenceId)
end ; End subroutine GetNextSequence
 
/*************************************************************************
;  Name: AddTask(null) = null
;  Description:  Call DCP.AddTask (560300)
**************************************************************************/
subroutine AddTask(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("AddTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set dcp_add_task_560300_req->person_id = dPersonId
  set dcp_add_task_560300_req->encntr_id = dEncounterId
  set dcp_add_task_560300_req->task_type_cd = powerform_reference->task_type_cd
  set dcp_add_task_560300_req->task_type_meaning = trim(powerform_reference->task_type_meaning, 3)
  set dcp_add_task_560300_req->task_dt_tm = cnvtdatetime(powerform_date_time->new_action_dt_tm)
  set dcp_add_task_560300_req->task_activity_meaning = "CHART RESULT"
  set dcp_add_task_560300_req->task_class_cd = c_task_class_adhoc_cd
  set dcp_add_task_560300_req->task_status_meaning = "DROPPED"
  set dcp_add_task_560300_req->charted_by_agent_cd = c_charting_agent_powerform_cd
 
  set iTransactionTaskId = 560300
  set iStepId = 560300
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", dcp_add_task_560300_req, "REC", dcp_add_task_560300_rep)
 
  if(dcp_add_task_560300_rep->task_status != "S")
    ; call echorecord(dcp_add_task_560300_req)
    ; call echorecord(dcp_add_task_560300_rep)
    free record dcp_add_task_560300_req
    free record dcp_add_task_560300_rep
 
    call ErrorHandler2(c_error_handler, "F", "AddTask",
      "Call to DCP.AddTask failed (step_id=560300)", "9999",
      "Call to DCP.AddTask failed (step_id=560300)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(dcp_add_task_560300_req)
    ; call echorecord(dcp_add_task_560300_rep)
 
    call echo(concat("AddTask Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine AddTask
 
/*************************************************************************
;  Name: CompleteTask(null) = null
;  Description:  Call DCP.CompleteTask (560303)
**************************************************************************/
subroutine CompleteTask(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("CompleteTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  free record 560303_req
  record 560303_req (
    1 mod_list [*]
      2 task_id = f8
      2 updt_cnt = i4
      2 task_status_meaning = c12
      2 task_dt_tm = dq8
      2 task_status_reason_cd = f8
      2 task_status_reason_meaning = c12
      2 event_id = f8
      2 reschedule_ind = i2
      2 reschedule_reason_cd = f8
      2 reschedule_reason_meaning = c12
      2 provider_id = f8
      2 perf_loc_cd = f8
      2 duration_mins = vc
      2 research_acct_id = f8
      2 quantity = i4
      2 diagnosis_list [*]
        3 diagnosis_id = f8
        3 source_string = vc
        3 source_identifier = vc
        3 priority = i4
      2 cpt_modifier_list [*]
        3 cpt_modifier_cd = f8
        3 modifier_description = vc
        3 modifier_display = vc
        3 priority = i4
      2 charted_by_agent_cd = f8
      2 charted_by_agent_identifier = c255
      2 charting_context_reference = c255
      2 result_set_id = f8
      2 performed_prsnl_id = f8
      2 performed_dt_tm = dq8
      2 container_id = f8
    1 device_location_cd = f8
    1 workflow [*]
      2 bagCountingInd = i2
    1 enhanced_validation
      2 honor_zero_updt_cnt_ind = i2
  )
 
  free record 560303_rep
  record 560303_rep (
    1 task_status = c1
    1 task_list [*]
      2 task_id = f8
      2 updt_cnt = i4
      2 updt_id = f8
      2 task_status_cd = f8
      2 parent_task_id = f8
      2 task_class_cd = f8
      2 task_dt_tm = dq8
      2 task_status_meaning = c12
      2 task_status_display = c40
      2 task_type_cd = f8
      2 task_type_meaning = c12
    1 task_ordstatus_list [*]
      2 task_id = f8
      2 order_id = f8
      2 predicted_order_status_cd = f8
    1 proposal_list [*]
      2 task_id = f8
      2 proposed_dt_tm = dq8
      2 task_list [*]
        3 task_id = f8
        3 updt_cnt = i4
        3 updt_id = f8
        3 task_status_cd = f8
        3 task_class_cd = f8
        3 task_dt_tm = dq8
        3 task_status_meaning = c12
        3 task_status_display = c40
        3 task_type_cd = f8
        3 task_type_meaning = c12
        3 task_description = vc
    1 failure_list [*]
      2 task_id = f8
      2 parent_task_id = f8
      2 updt_id = f8
      2 task_description = vc
    1 enhanced_reply
      2 successful_updates [*]
        3 task_id = f8
        3 updt_cnt = i4
        3 task_status_cd = f8
      2 failed_updates [*]
        3 task_id = f8
        3 updt_cnt = i4
        3 task_status_cd = f8
        3 error_message = vc
      2 transaction_error_message = vc
  )
 
  set stat = alterlist(560303_req->mod_list, 1)
  set 560303_req->mod_list[1].task_id = powerform_activity->task_id
  set 560303_req->mod_list[1].updt_cnt = powerform_activity->updt_cnt
  set 560303_req->mod_list[1].task_status_meaning = trim(c_complete_task_status_meaning, 3)
  set 560303_req->mod_list[1].task_dt_tm = powerform_rtf->event_end_dt_tm
  set 560303_req->mod_list[1].task_status_reason_cd = c_task_status_reason_dcp_chart_cd
  set 560303_req->mod_list[1].event_id = powerform_activity->event_id
  set 560303_req->mod_list[1].result_set_id = dResultSetId
  set 560303_req->mod_list[1].performed_prsnl_id = powerform_rtf->perform_action_prsnl_id
  set 560303_req->mod_list[1].performed_dt_tm = powerform_rtf->perform_action_dt_tm
 
  set iTransactionTaskId = 560300
  set iStepId = 560303
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 560303_req, "REC", 560303_rep)
 
  if(560303_rep->task_status != "S"
    or size(560303_rep->enhanced_reply.successful_updates, 5) != 1
    or 560303_rep->enhanced_reply.successful_updates[1].task_id != powerform_activity->task_id
    or 560303_rep->enhanced_reply.successful_updates[1].task_status_cd != c_complete_task_status_cd)
    ; call echorecord(560303_req)
    ; call echorecord(560303_rep)
    free record 560303_req
    free record 560303_rep
 
    call ErrorHandler2(c_error_handler, "F", "CompleteTask",
      "Call to DCP.ModTask failed or did not complete the task (step_id=560303)", "9999",
      "Call to DCP.ModTask failed or did not complete the task (step_id=560303)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(560303_req)
    ; call echorecord(560303_rep)
 
    call echo(concat("CompleteTask Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  free record 560303_req
  free record 560303_rep
end ; End subroutine CompleteTask
 
/*************************************************************************
;  Name: GetReferenceNumber(iIndex = i4) = vc
;  Description:  Gets the reference number for signing a PowerForm event
;  Parameters:
;    iIndex: The index for the reference number (starting at 0).
;  Return: The reference number (if successful).
**************************************************************************/
subroutine GetReferenceNumber(iIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetReferenceNumber Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare get_reference_number::sRootReferenceNumber = vc with privateprotect
  set get_reference_number::sRootReferenceNumber = trim(cnvtstring(dFormId, 25, 6), 3)
 
  declare get_reference_number::sReferenceNumber = vc with privateprotect,
    constant(build2(get_reference_number::sRootReferenceNumber,
      "!", c_reference_nbr_date, " ", c_time_zone_suffix, "!", trim(cnvtstring(iIndex), 3)))
 
  if(iDebugFlag > 0)
    call echo(build("get_reference_number::sReferenceNumber  ->", get_reference_number::sReferenceNumber))
    call echo(concat("GetReferenceNumber Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(get_reference_number::sReferenceNumber)
end ; End subroutine GetReferenceNumber
 
/*************************************************************************
;  Name: EndCrmCall(appHandle = i4, taskHandle = i4, stepHandle = i4) = null
;  Description:  Ends a Crm call safely
**************************************************************************/
subroutine EndCrmCall(appHandle, taskHandle, stepHandle)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("EndCrmCall Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("appHandle  ->", appHandle))
    call echo(build("taskHandle  ->", taskHandle))
    call echo(build("stepHandle  ->", stepHandle))
  endif
 
  if(stepHandle != 0)
    call uar_crmendreq(stepHandle)
  endif
 
  if(taskHandle != 0)
    call uar_crmendtask(taskHandle)
  endif
 
  if(appHandle != 0)
    call uar_crmendapp(appHandle)
  endif
 
  if(iDebugFlag > 0)
    call echo(concat("EndCrmCall Runtime: ",
    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
    " seconds"))
  endif
end ; End subroutine EndCrmCall
 
/*************************************************************************
;  Name: CreateTypeFromSrvField(hParent = i4, sParentFieldName = vc, hCopyFrom = i4, sCopyFromFieldName = vc) = i4
;  Description:  Creates a type from an srv field
**************************************************************************/
subroutine CreateTypeFromSrvField(hParent, sParentFieldName, hCopyFrom, sCopyFromFieldName)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("CreateTypeFromSrvField Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("hParent  ->", hParent))
    call echo(build("sParentFieldName  ->", sParentFieldName))
    call echo(build("hCopyFrom  ->", hCopyFrom))
    call echo(build("sCopyFromFieldName  ->", sCopyFromFieldName))
  endif
 
  declare create_type::hType = i4 with privateprotect, noconstant(0)
 
  if(hParent != 0)
    set create_type::hType = uar_srvcreatetypefrom(hCopyFrom, sCopyFromFieldName)
    if(create_type::hType != 0)
      set stat = uar_srvbinditemtype(hParent, sParentFieldName, create_type::hType)
    endif
  endif
 
  if(iDebugFlag > 0)
    call echo(build("create_type::hType  ->", create_type::hType))
 
    call echo(concat("CreateTypeFromSrvField Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(create_type::hType)
end ; End subroutine CreateTypeFromSrvField
 
/*************************************************************************
;  Name: AddItemFromType(hParent = i4, sParentFieldName = vc, hType = i4) = i4
;  Description:  Adds an srv item from a type
**************************************************************************/
subroutine AddItemFromType(hParent, sParentFieldName, hType)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("AddItemFromType Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("hParent  ->", hParent))
    call echo(build("sParentFieldName  ->", sParentFieldName))
    call echo(build("hType  ->", hType))
  endif
 
  declare add_item::hChild = i4 with privateprotect, noconstant(0)
 
  if(hParent != 0 and hType != 0)
    set add_item::hChild = uar_srvadditem(hParent, sParentFieldName)
    set stat = uar_srvbinditemtype(add_item::hChild, sParentFieldName, hType)
  endif
 
  if(iDebugFlag > 0)
    call echo(build("add_item::hChild  ->", add_item::hChild))
 
    call echo(concat("AddItemFromType Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(add_item::hChild)
end ; End subroutine AddItemFromType
 
/*************************************************************************
;  Name: GetFormActivity(null) = null with protect
;  Description:  Get the form definition by calling dcp_get_form_activity (600354)
**************************************************************************/
subroutine GetFormActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetFormActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set dcp_get_form_activity_600354_req->form_activity_id = dFormId
 
  set iTransactionTaskId = 600701
  set iStepId = 600354
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", dcp_get_form_activity_600354_req, "REC", dcp_get_form_activity_600354_rep)
 
  if(dcp_get_form_activity_600354_rep->status_data.status != "S")
    ; call echorecord(dcp_get_form_activity_600354_req)
    ; call echorecord(dcp_get_form_activity_600354_rep)
    free record dcp_get_form_activity_600354_req
    free record dcp_get_form_activity_600354_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetFormActivity",
      "Call to dcp_get_form_activity (step_id=600354)", "9999",
      "Call to dcp_get_form_activity (step_id=600354)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  set dEncounterId = dcp_get_form_activity_600354_rep->encntr_id
  set dPersonId = dcp_get_form_activity_600354_rep->person_id
 
  select into "nl:"
    e.organization_id
    , encounter_tz = decode(tzr.time_zone,datetimezonebyname(trim(tzr.time_zone, 3)), 0)
  from
    encounter e
    , encntr_pending ep
    , time_zone_r tzr
  plan e where e.encntr_id = dEncounterId
  join ep where ep.encntr_id = outerjoin(e.encntr_id)
  join tzr where tzr.parent_entity_id in (e.loc_facility_cd, ep.pend_facility_cd)
    and tzr.parent_entity_name = outerjoin("LOCATION")
  head report
    dummy=0
  detail
    dOrganizationId = e.organization_id
    iEncounterTimeZoneIndex = encounter_tz
  with nocounter
 
  if(curqual = 0)
    call ErrorHandler2(c_error_handler, "F", "GetFormActivity",
      "Unable to find encounter information", "9999",
      "Unable to find encounter information", post_task_pform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(dcp_get_form_activity_600354_req)
    ; call echorecord(dcp_get_form_activity_600354_rep)
    call echo(build("dEncounterId  ->", dEncounterId))
    call echo(build("dPersonId  ->", dPersonId))
    call echo(build("dOrganizationId  ->", dOrganizationId))
    call echo(build("iEncounterTimeZoneIndex  ->", iEncounterTimeZoneIndex))
 
    call echo(concat("GetFormActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetFormActivity
 
/*************************************************************************
;  Name: GetFormDefinition(null) = null with protect
;  Description:  Get the form definition by calling dcp_get_dcp_form (600373)
**************************************************************************/
subroutine GetFormDefinition(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetFormDefinition Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set dcp_get_dcp_form_600373_req->dcp_forms_ref_id = dcp_get_form_activity_600354_rep->dcp_forms_ref_id
  set dcp_get_dcp_form_600373_req->version_dt_tm = cnvtdatetime(c_now_dt_tm)
 
  set iTransactionTaskId = 600701
  set iStepId = 600373
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", dcp_get_dcp_form_600373_req, "REC", dcp_get_dcp_form_600373_rep)
 
  if(dcp_get_dcp_form_600373_rep->status_data.status != "S")
    ; call echorecord(dcp_get_dcp_form_600373_req)
    ; call echorecord(dcp_get_dcp_form_600373_rep)
    free record dcp_get_dcp_form_600373_req
    free record dcp_get_dcp_form_600373_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetFormDefinition",
      "Call to dcp_get_dcp_form (step_id=600373)", "9999",
      "Call to dcp_get_dcp_form (step_id=600373)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(dcp_get_dcp_form_600373_req)
    ; call echorecord(dcp_get_dcp_form_600373_rep)
 
    call echo(concat("GetFormDefinition Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetFormDefinition
 
/*************************************************************************
;  Name: GetSectionEventCode(null) = null with protect
;  Description: Gets the section event code by calling dcp_get_code_alias (600336)
**************************************************************************/
subroutine GetSectionEventCode(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetSectionEventCode Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  free record 600336_req
  record 600336_req (
    1 mode_flag = i2
    1 code_list [*]
      2 code_set = i4
      2 contributor_source_cd = f8
      2 alias = vc
      2 code_value = f8
  )
 
  free record 600336_rep
  record 600336_rep (
    1 qual_cnt = i4
    1 qual [* ]
      2 code_set = i4
      2 contributor_source_cd = f8
      2 alias = vc
      2 alias_type_meaning = vc
      2 primary_ind = i2
      2 code_value = f8
      2 collation_seq = i4
      2 cdf_meaning = vc
      2 display = vc
      2 display_key = vc
      2 description = vc
      2 definition = vc
      2 active_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
  set 600336_req->mode_flag = 2
  set stat = alterlist(600336_req->code_list, 1)
  set 600336_req->code_list[1].code_set = c_event_code_set
  set 600336_req->code_list[1].contributor_source_cd = c_contributor_source_powerchart_cd
  set 600336_req->code_list[1].alias = "DCPGENERIC"
 
  set iTransactionTaskId = 600105
  set iStepId = 600336
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 600336_req, "REC", 600336_rep)
 
  if(600336_rep->status_data.status != "S"
    or 600336_rep->qual_cnt < 1)
    ; call echorecord(600336_req)
    ; call echorecord(600336_rep)
    free record 600336_req
    free record 600336_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetSectionEventCode",
      "Call to dcp_get_code_alias failed (step_id=600336)", "9999",
      "Call to dcp_get_code_alias failed (step_id=600336)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  set dSectionEventCd = 600336_rep->qual[1].code_value
 
  if(iDebugFlag > 0)
    ; call echorecord(600336_req)
    ; call echorecord(600336_rep)
    call echo(build("iEncounterTimeZoneIndex  ->", iEncounterTimeZoneIndex))
 
    call echo(concat("GetSectionEventCode Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  free record 600336_req
  free record 600336_rep
end ; End subroutine GetSectionEventCode
 
/*************************************************************************
;  Name: GetDiscreteTaskAssayDetails(null) = null with protect
;  Description:  Gets the discrete task assay (DTA) details by calling dcp_get_dta_info_all (600356)
;  Note that dcp_get_dta_info_all_600356_req must be populated prior to calling this subroutine.
**************************************************************************/
subroutine GetDiscreteTaskAssayDetails(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetDiscreteTaskAssayDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    ; call echorecord(dcp_get_dta_info_all_600356_req)
  endif
 
  if(size(dcp_get_dta_info_all_600356_req->dta, 5) = 0)
    free record dcp_get_dta_info_all_600356_req
    free record dcp_get_dta_info_all_600356_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetDiscreteTaskAssayDetails",
      "Request for dcp_get_dta_info_all contained no DTAs (step_id=600356)", "9999",
      "Request for dcp_get_dta_info_all contained no DTAs (step_id=600356)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  set iTransactionTaskId = 600701
  set iStepId = 600356
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", dcp_get_dta_info_all_600356_req, "REC", dcp_get_dta_info_all_600356_rep)
 
  if(dcp_get_dta_info_all_600356_rep->status_data.status != "S")
    ; call echorecord(dcp_get_dta_info_all_600356_rep)
    free record dcp_get_dta_info_all_600356_req
    free record dcp_get_dta_info_all_600356_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetDiscreteTaskAssayDetails",
      "Call to dcp_get_dta_info_all failed (step_id=600356)", "9999",
      "Call to dcp_get_dta_info_all failed (step_id=600356)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(dcp_get_dta_info_all_600356_rep)
 
    call echo(concat("GetDiscreteTaskAssayDetails Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetDiscreteTaskAssayDetails
 
/*************************************************************************
;  Name: PopulatePowerFormReference(null)
;  Description:  Populates the powerform_reference record structure
**************************************************************************/
subroutine PopulatePowerFormReference(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PopulatePowerFormReference Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  select into "nl:"
    ta.dcp_forms_ref_id
    , ta.task_description
    , ta.task_type_cd
    , cv.cdf_meaning
  from
    task_activity ta
    , code_value cv
  plan ta where ta.task_id = dcp_get_form_activity_600354_rep->task_id
  join cv where cv.code_value = ta.task_type_cd
  detail
    powerform_reference->task_type_cd = ta.task_type_cd
    powerform_reference->task_type_meaning = trim(cv.cdf_meaning, 3)
    powerform_reference->task_updt_cnt = ta.updt_cnt
  with nocounter
 
  if(curqual < 1)
    call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormReference",
      build2("Unable to find activity task information for taskId=",
        dcp_get_form_activity_600354_rep->task_id), "9999",
      build2("Unable to find activity task information for taskId=",
        dcp_get_form_activity_600354_rep->task_id), pat_pwrform_reply_out)
    go to exit_script
  endif
 
  call GetFormDefinition(null)
 
  ; Populate from form definition
  set powerform_reference->dcp_forms_ref_id = dcp_get_form_activity_600354_rep->dcp_forms_ref_id
  set powerform_reference->event_cd = dcp_get_dcp_form_600373_rep->event_cd
  set powerform_reference->description = nullterm(trim(dcp_get_dcp_form_600373_rep->description, 3))
  set powerform_reference->document_event_cd = dcp_get_dcp_form_600373_rep->text_rendition_event_cd
 
  call GetSectionEventCode(null)
 
  ; PowerForm Sections
  set powerform_reference->section_cnt = dcp_get_dcp_form_600373_rep->sect_cnt
  set stat = alterlist(powerform_reference->sections, powerform_reference->section_cnt)
  for(iSectionIndex = 1 to powerform_reference->section_cnt)
    set powerform_reference->sections[iSectionIndex].dcp_section_ref_id =
      dcp_get_dcp_form_600373_rep->sect_list[iSectionIndex].dcp_section_ref_id
    set powerform_reference->sections[iSectionIndex].dcp_section_instance_id =
      dcp_get_dcp_form_600373_rep->sect_list[iSectionIndex].dcp_section_instance_id
    set powerform_reference->sections[iSectionIndex].description =
      trim(dcp_get_dcp_form_600373_rep->sect_list[iSectionIndex].description, 3)
    set powerform_reference->sections[iSectionIndex].event_cd = dSectionEventCd
  endfor
 
  ; Get the section controls by querying the tables
  select into "nl:"
    dsr.dcp_section_ref_id
    , dir.dcp_input_ref_id
    , dir.input_ref_seq
    , nvp.name_value_prefs_id
  from
    (dummyt d with seq = value(powerform_reference->section_cnt))
    , dcp_section_ref dsr
    , dcp_input_ref dir
    , name_value_prefs nvp
  plan d
  join dsr where dsr.dcp_section_instance_id = powerform_reference->sections[d.seq].dcp_section_instance_id
  join dir where dir.dcp_section_instance_id = dsr.dcp_section_instance_id
  join nvp where nvp.parent_entity_id = dir.dcp_input_ref_id
    and nvp.parent_entity_name = "DCP_INPUT_REF"
    and nvp.active_ind = 1
  order by
    dsr.dcp_section_ref_id
    , dir.input_ref_seq
    , dir.dcp_input_ref_id
    , nvp.sequence
  head report
    iControlIndex = 0
  head dir.dcp_input_ref_id
    iControlIndex = 0
 
    if(dir.dcp_input_ref_id > 0.00)
      powerform_reference->sections[d.seq].control_cnt += 1
      iControlIndex = powerform_reference->sections[d.seq].control_cnt
      stat = alterlist(powerform_reference->sections[d.seq].controls, iControlIndex)
 
      powerform_reference->sections[d.seq].controls[iControlIndex].dcp_input_ref_id = dir.dcp_input_ref_id
      powerform_reference->sections[d.seq].controls[iControlIndex].description = nullterm(trim(dir.description, 3))
      powerform_reference->sections[d.seq].controls[iControlIndex].input_ref_seq = dir.input_ref_seq
      powerform_reference->sections[d.seq].controls[iControlIndex].input_type = dir.input_type
 
      ; Social History control
      if(dir.input_type = c_input_type_social_history)
        powerform_reference->components.social_history_ind = 1
        powerform_reference->sections[d.seq]->components.social_history_ind = 1
      ; Label control
      elseif(dir.input_type = c_input_type_label)
        if(nullterm(trim(dir.module, 3)) = "PFPMCtrls" and nullterm(trim(dir.description, 3)) = null)
          powerform_reference->sections[d.seq].controls[iControlIndex].description = "Gestational Age Person"
        endif
      ; Problem List/Diagnosis control
      elseif(dir.input_type = c_input_type_problem_list_diagnosis)
        if(nullterm(trim(dir.module, 3)) = "PFPMCtrls" and nullterm(trim(dir.description, 3)) = null)
          powerform_reference->sections[d.seq].controls[iControlIndex].description = "Gestational Age Encntr"
        endif
      endif
 
      for(i = 1 to size(arglist->FieldInputs, 5))
        if(cnvtreal(arglist->FieldInputs[i].FieldId) = dir.dcp_input_ref_id)
          powerform_reference->sections[d.seq].controls[iControlIndex].found_in_arglist_ind = 1
        endif
      endfor
    endif
  detail
    if(nvp.name_value_prefs_id > 0.00)
      case(nullterm(trim(nvp.pvc_name, 3)))
        of "caption":
          powerform_reference->sections[d.seq].controls[iControlIndex].caption = nullterm(trim(nvp.pvc_value, 3))
        of "question_role":
          powerform_reference->sections[d.seq].controls[iControlIndex].question_role = nullterm(trim(nvp.pvc_value, 3))
        of "multi_select":
          if(nullterm(trim(nvp.pvc_value, 3)) = "true")
            powerform_reference->sections[d.seq].controls[iControlIndex].multi_select_ind = 1
          endif
        of "required":
          if(nullterm(trim(nvp.pvc_value, 3)) = "true")
            powerform_reference->sections[d.seq].controls[iControlIndex].required_ind = 1
            powerform_reference->required_control_cnt += 1
          endif
        of "date_time_type":
          powerform_reference->sections[d.seq].controls[iControlIndex].date_type_flag = cnvtint(nullterm(trim(nvp.pvc_value, 3)))
        of "discrete_task_assay":
          powerform_reference->sections[d.seq].controls[iControlIndex].caption =
            trim(powerform_reference->sections[d.seq].controls[iControlIndex].description, 3)
          powerform_reference->sections[d.seq].controls[iControlIndex].discrete_task_assay = nullterm(trim(nvp.pvc_value, 3))
          powerform_reference->sections[d.seq].controls[iControlIndex].task_assay_cd = nvp.merge_id
 
          ; Add the task_assay_cd to the list of DTAs to load
          iDTAIndex = locateval(iDTAIndex, 1, size(dcp_get_dta_info_all_600356_req->dta, 5), nvp.merge_id,
            dcp_get_dta_info_all_600356_req->dta[iDTAIndex].task_assay_cd)
          if(iDTAIndex = 0)
            iDTAIndex = size(dcp_get_dta_info_all_600356_req->dta, 5) + 1
            stat = alterlist(dcp_get_dta_info_all_600356_req->dta, iDTAIndex)
            dcp_get_dta_info_all_600356_req->dta[iDTAIndex].task_assay_cd = nvp.merge_id
          endif
      endcase
    endif
  foot dir.dcp_input_ref_id
    iControlIndex = 0
  foot report
    iControlIndex = 0
  with nocounter

  ; Validate that all field ids in the input are actual controls in the form
  set iFieldIdsFound = 0
  for(i = 1 to size(arglist->FieldInputs, 5))
    for(iSectionIndex = 1 to powerform_reference->section_cnt)
      for(iControlIndex = 1 to powerform_reference->sections[iSectionIndex].control_cnt)
        if(cnvtreal(arglist->FieldInputs[i].FieldId) =
          powerform_reference->sections[iSectionIndex].controls[iControlIndex].dcp_input_ref_id)
          set iFieldIdsFound += 1
        endif
      endfor
    endfor
  endfor

  if(size(arglist->FieldInputs, 5) != iFieldIdsFound)
    call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
      "Some FieldIds could not be found in the active version of the form", "9999",
      "Some FieldIds could not be found in the active version of the form", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  call GetDiscreteTaskAssayDetails(null)

  ; Load the patient's demographics for filtering the reference ranges
  select into "nl:"
    p.sex_cd,
    age_in_minutes = datetimediff(cnvtdatetime(curdate,curtime3), cnvtdatetime(p.birth_dt_tm), 4)
  from
    person p
  plan p where p.person_id = dPersonId
  detail
    dSexCd = p.sex_cd
    dAgeInMinutes = age_in_minutes
  with nocounter

  ; Handle no patient data returned
  if(curqual < 1)
    call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
      "Query to load patient demographics did not return any data", "9999",
      "Query to load patient demographics did not return any data", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate the DTA information into the powerform_reference->sections->controls
  for(iSectionIndex = 1 to powerform_reference->section_cnt)
    for(iControlIndex = 1 to powerform_reference->sections[iSectionIndex].control_cnt)
      if(powerform_reference->sections[iSectionIndex].controls[iControlIndex].task_assay_cd > 0.0)
        set iDTAIndex = locateval(iDTAIndex, 1, size(dcp_get_dta_info_all_600356_rep->dta, 5),
          powerform_reference->sections[iSectionIndex].controls[iControlIndex].task_assay_cd,
          dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].task_assay_cd)
        if(iDTAIndex < 1 and powerform_reference->sections[iSectionIndex].controls[iControlIndex].found_in_arglist_ind = 1)
          call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormReference",
            build2("Unable to find DTA information for task_assay_cd=",
              powerform_reference->sections[iSectionIndex].controls[iControlIndex].task_assay_cd), "9999",
            build2("Unable to find DTA information for task_assay_cd=",
              powerform_reference->sections[iSectionIndex].controls[iControlIndex].task_assay_cd), pat_pwrform_reply_out)
          go to exit_script
        endif

        if(iDTAIndex > 0)
          ; Populate controls from DTA details
          set powerform_reference->sections[iSectionIndex].controls[iControlIndex].event_cd =
            dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].event_cd
          set powerform_reference->sections[iSectionIndex].controls[iControlIndex].default_result_type_cd =
            dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].default_result_type_cd

          ; Reference Range Factors
          set iRefRangeSize = size(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor, 5)
          set iNewRefRangeIndex = 0

          for(iRefRangeIndex = 1 to iRefRangeSize)
            ; Only add the reference range factor if the patient demographics match
            if((dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor[iRefRangeIndex].sex_cd = 0
                or dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor[iRefRangeIndex].sex_cd = dSexCd)
              and
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor[iRefRangeIndex].age_from_minutes < dAgeInMinutes
              and
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor[iRefRangeIndex].age_to_minutes > dAgeInMinutes
            )
              set iNewRefRangeIndex += 1
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex].ref_range_factor_cnt = iNewRefRangeIndex
              set stat = alterlist(powerform_reference->sections[iSectionIndex].controls[iControlIndex].ref_range_factor,
                iNewRefRangeIndex)

              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].units_cd =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].units_cd
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].normal_ind =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].normal_ind
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].normal_low =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].normal_low
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].normal_high =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].normal_high
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].critical_ind =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].critical_ind
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].critical_low =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].critical_low
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].critical_high =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].critical_high
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].feasible_ind =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].feasible_ind
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].feasible_low =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].feasible_low
              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iNewRefRangeIndex].feasible_high =
                dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                  .ref_range_factor[iRefRangeIndex].feasible_high

              ; Alpha Responses
              set iAlphaResponseSize = dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses_cnt

              set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iNewRefRangeIndex].alpha_responses_cnt = iAlphaResponseSize

              set stat = alterlist(powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iNewRefRangeIndex].alpha_responses,
                iAlphaResponseSize)

              for(iAlphaResponseIndex = 1 to iAlphaResponseSize)
                set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                    .ref_range_factor[iNewRefRangeIndex].alpha_responses[iAlphaResponseIndex].nomenclature_id =
                  dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                    .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].nomenclature_id

                ; FUTURE For form logic this will need to be converted to a numeric value (if possible)
                set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                    .ref_range_factor[iNewRefRangeIndex].alpha_responses[iAlphaResponseIndex].source_string =
                  nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                    .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].source_string, 3))

                set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                    .ref_range_factor[iNewRefRangeIndex].alpha_responses[iAlphaResponseIndex].short_string =
                  nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                    .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].short_string, 3))

                set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                    .ref_range_factor[iNewRefRangeIndex].alpha_responses[iAlphaResponseIndex].mnemonic =
                  nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                    .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].mnemonic, 3))

                set powerform_reference->sections[iSectionIndex].controls[iControlIndex]
                    .ref_range_factor[iNewRefRangeIndex].alpha_responses[iAlphaResponseIndex].sequence =
                  dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                    .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].sequence
              endfor
            endif
          endfor
        endif
      endif
    endfor
  endfor
 
  ; Copy the caption and question_roles to the DTA components for ease of use
  for(i = 1 to powerform_reference->section_cnt)
      for(j = 1 to powerform_reference->sections[i].control_cnt)
        set iTaskAssayIndex = 0
        if(powerform_reference->sections[i].controls[j].task_assay_cd > 0.0)
          set iTaskAssayIndex = j
        endif
 
        for(k = 1 to powerform_reference->sections[i].control_cnt)
          if(nullterm(trim(powerform_reference->sections[i].controls[iTaskAssayIndex].discrete_task_assay, 3)) =
            nullterm(trim(powerform_reference->sections[i].controls[k].question_role, 3)))
 
            set powerform_reference->sections[i].controls[iTaskAssayIndex].caption =
              powerform_reference->sections[i].controls[k].caption
            set powerform_reference->sections[i].controls[iTaskAssayIndex].question_role =
              powerform_reference->sections[i].controls[k].question_role
          endif
        endfor
      endfor
  endfor
 
  ; Determine value_type/event_class_cd for PowerForm
  for(i = 1 to powerform_reference->section_cnt)
    for(j = 1 to powerform_reference->sections[i].control_cnt)
      ; Nomenclature Values
      if(powerform_reference->sections[i].controls[j].default_result_type_cd
        in (c_result_type_alpha_cd, c_result_type_multi_cd, c_result_type_alpha_freetext_cd,
          c_result_type_multi_alpha_freetext_cd))
 
        set powerform_reference->sections[i].controls[j].value_type.nomenclature_ind = 1
        set powerform_reference->sections[i].controls[j].event_class_cd = c_txt_event_class_cd
      ; Freetext Values
      elseif(powerform_reference->sections[i].controls[j].default_result_type_cd
        in (c_result_type_text_cd, c_result_type_freetext_cd, c_result_type_provider_cd)
        and powerform_reference->sections[i].controls[j].input_type != c_input_type_rtf)
 
        set powerform_reference->sections[i].controls[j].value_type.freetext_ind = 1
        set powerform_reference->sections[i].controls[j].event_class_cd = c_txt_event_class_cd
      ; RTF Values
      elseif(powerform_reference->sections[i].controls[j].default_result_type_cd in (c_result_type_text_cd)
        and powerform_reference->sections[i].controls[j].input_type = c_input_type_rtf)
        set powerform_reference->sections[i].controls[j].value_type.rtf_ind = 1
        set powerform_reference->sections[i].controls[j].event_class_cd = c_doc_event_class_cd
      ; Numeric Values
      elseif(powerform_reference->sections[i].controls[j].default_result_type_cd
        in (c_result_type_numeric_cd, c_result_type_count_cd))
 
        set powerform_reference->sections[i].controls[j].value_type.numeric_ind = 1
        set powerform_reference->sections[i].controls[j].event_class_cd = c_num_event_class_cd
      ; Date/Time Values
      elseif(powerform_reference->sections[i].controls[j].default_result_type_cd
        in (c_result_type_date_cd, c_result_type_time_cd, c_result_type_date_time_cd, c_result_type_date_time_time_zone_cd))
 
        set powerform_reference->sections[i].controls[j].value_type.date_time_ind = 1
        set powerform_reference->sections[i].controls[j].event_class_cd = c_date_event_class_cd
      endif
    endfor
  endfor
 
  ; Populate the DTA information into the social_history->categories->elements
  for(i = 1 to social_history->category_cnt)
    for(j = 1 to social_history->categories[i].element_cnt)
      set iDTAIndex = locateval(iDTAIndex, 1, size(dcp_get_dta_info_all_600356_rep->dta, 5),
        social_history->categories[i].elements[j].task_assay_cd,
        dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].task_assay_cd)
      if(iDTAIndex < 1)
        call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormReference",
          build2("Unable to find DTA information for task_assay_cd=",
            social_history->categories[i].elements[j].task_assay_cd), "9999",
          build2("Unable to find DTA information for task_assay_cd=",
            social_history->categories[i].elements[j].task_assay_cd), pat_pwrform_reply_out)
        go to exit_script
      endif
 
      if(iDTAIndex > 0)
        ; Populate controls from DTA details
        set social_history->categories[i].elements[j].event_cd =
          dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].event_cd
        set social_history->categories[i].elements[j].default_result_type_cd =
          dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].default_result_type_cd
 
        ; Reference Range Factors
        set iRefRangeSize = size(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex].ref_range_factor, 5)
        set social_history->categories[i].elements[j].ref_range_factor_cnt = iRefRangeSize
        set stat = alterlist(social_history->categories[i].elements[j].ref_range_factor,
          iRefRangeSize)
 
        for(iRefRangeIndex = 1 to iRefRangeSize)
 
          set social_history->categories[i].elements[j]
              .ref_range_factor[iRefRangeIndex].units_cd =
            dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
              .ref_range_factor[iRefRangeIndex].units_cd
 
          ; Alpha Responses
          set iAlphaResponseSize = dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
            .ref_range_factor[iRefRangeIndex].alpha_responses_cnt
 
          set social_history->categories[i].elements[j]
            .ref_range_factor[iRefRangeIndex].alpha_responses_cnt = iAlphaResponseSize
 
          set stat = alterlist(social_history->categories[i].elements[j]
            .ref_range_factor[iRefRangeIndex].alpha_responses,
            iAlphaResponseSize)
 
          for(iAlphaResponseIndex = 1 to iAlphaResponseSize)
            set social_history->categories[i].elements[j]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].nomenclature_id =
              dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].nomenclature_id
 
            ; TODO For form logic this will need to be converted to a numeric value (if possible)
            set social_history->categories[i].elements[j]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].source_string =
              nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].source_string, 3))
 
            set social_history->categories[i].elements[j]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].short_string =
              nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].short_string, 3))
 
            set social_history->categories[i].elements[j]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].mnemonic =
              nullterm(trim(dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].mnemonic, 3))
 
            set social_history->categories[i].elements[j]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].sequence =
              dcp_get_dta_info_all_600356_rep->dta[iDTAIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].sequence
          endfor
        endfor
      endif
 
      ; Nomenclature Values
      if(social_history->categories[i].elements[j].default_result_type_cd
        in (c_result_type_alpha_cd, c_result_type_multi_cd, c_result_type_alpha_freetext_cd,
          c_result_type_multi_alpha_freetext_cd))
 
        set social_history->categories[i].elements[j].value_type.nomenclature_ind = 1
 
        if(social_history->categories[i].elements[j].default_result_type_cd
          in (c_result_type_multi_cd, c_result_type_multi_alpha_freetext_cd))
          set social_history->categories[i].elements[j].multi_select_ind = 1
        endif
      ; Freetext Values
      elseif(social_history->categories[i].elements[j].default_result_type_cd
        in (c_result_type_text_cd, c_result_type_freetext_cd, c_result_type_provider_cd))
 
        set social_history->categories[i].elements[j].value_type.freetext_ind = 1
      ; Numeric Values
      elseif(social_history->categories[i].elements[j].default_result_type_cd
        in (c_result_type_numeric_cd, c_result_type_count_cd))
 
        set social_history->categories[i].elements[j].value_type.numeric_ind = 1
      ; Date/Time Values
      elseif(social_history->categories[i].elements[j].default_result_type_cd
        in (c_result_type_date_cd, c_result_type_time_cd, c_result_type_date_time_cd, c_result_type_date_time_time_zone_cd))
 
        set social_history->categories[i].elements[j].value_type.date_time_ind = 1
      endif
    endfor
  endfor
 
  if(iDebugFlag > 0)
    ; call echorecord(powerform_reference)
    ; call echorecord(social_history)
 
    call echo(concat("PopulatePowerFormReference Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PopulatePowerFormReference
 
/*************************************************************************
;  Name: PopulatePowerFormActivity(null) = null
;  Description:  Populates the powerform_activity record structure
**************************************************************************/
subroutine PopulatePowerFormActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PopulatePowerFormActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare iReferenceNumberIndex = i4 with privateprotect, noconstant(0)
 
  ; Reference Values
  set powerform_activity->dcp_forms_ref_id = powerform_reference->dcp_forms_ref_id
  set powerform_activity->description = nullterm(trim(powerform_reference->description, 3))
  set powerform_activity->task_type_cd = powerform_reference->task_type_cd
  set powerform_activity->task_type_meaning = powerform_reference->task_type_meaning
  set powerform_activity->task_updt_cnt = powerform_reference->task_updt_cnt
  set powerform_activity->event_cd = powerform_reference->event_cd
  set powerform_activity->required_control_cnt = powerform_reference->required_control_cnt
  set powerform_activity->components.social_history_ind = powerform_reference->components.social_history_ind
  set powerform_activity->document_event_cd = powerform_reference->document_event_cd
 
  ; Activity Values
  set powerform_activity->form_activity_id = dFormId
  set powerform_activity->reference_nbr = trim(GetReferenceNumber(iReferenceNumberIndex), 3)
  set iReferenceNumberIndex += 1
  set powerform_activity->reference_nbr_length = size(powerform_activity->reference_nbr)
  set powerform_activity->result_set_id = dResultSetId
  set powerform_activity->task_id = dcp_get_form_activity_600354_rep->task_id
  set powerform_activity->updt_cnt = dcp_get_form_activity_600354_rep->updt_cnt
  set powerform_activity->form_dt_tm = cnvtdatetime(dcp_get_form_activity_600354_rep->form_dt_tm)
  set powerform_activity->form_tz = dcp_get_form_activity_600354_rep->form_tz
 
  for(i = 1 to size(dcp_get_form_activity_600354_rep->comp, 5))
    if(trim(dcp_get_form_activity_600354_rep->comp[i].parent_entity_name, 3) = "CLINICAL_EVENT")
      if(dcp_get_form_activity_600354_rep->comp[i].component_cd = c_clinical_event_comp_cd)
        set powerform_activity->event_id = dcp_get_form_activity_600354_rep->comp[i].parent_entity_id
      elseif(dcp_get_form_activity_600354_rep->comp[i].component_cd = c_text_rendition_comp_cd)
        set powerform_activity->document_event_id = dcp_get_form_activity_600354_rep->comp[i].parent_entity_id
      endif
    endif
  endfor
 
  if(powerform_activity->event_id <= 0.00 or
    (powerform_activity->document_event_cd > 0.00 and powerform_activity->document_event_id <= 0.00))
    call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
      "Unable to find form event ids", "9999",
      "Unable to find form event ids", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  declare dFieldId = f8 with privateprotect, noconstant(0.00)
  declare bSectionAdded = i2 with privateprotect, noconstant(FALSE)
  declare iValueSize = i4 with privateprotect, noconstant(0)
 
  ; Populate the Sections and Controls based on the user input (arlist->FieldInputs)
  for(i = 1 to powerform_reference->section_cnt)
    set bSectionAdded = FALSE
    for(j = 1 to powerform_reference->sections[i].control_cnt)
      ; Field Inputs
      if(powerform_reference->sections[i].controls[j].found_in_arglist_ind = 1)
        for(k = 1 to size(arglist->FieldInputs, 5))
          set dFieldId = cnvtreal(arglist->FieldInputs[k].FieldId)
          if(powerform_reference->sections[i].controls[j].dcp_input_ref_id = dFieldId)
            ; Add Activity Section
            if(bSectionAdded = FALSE)
              set bSectionAdded = TRUE
              set powerform_activity->section_cnt += 1
              set iSectionIndex = powerform_activity->section_cnt
              set stat = alterlist(powerform_activity->sections, iSectionIndex)
 
              ; Populate Section Reference
              set powerform_activity->sections[iSectionIndex].dcp_section_ref_id =
                powerform_reference->sections[i].dcp_section_ref_id
              set powerform_activity->sections[iSectionIndex].dcp_section_instance_id =
                powerform_reference->sections[i].dcp_section_instance_id
              set powerform_activity->sections[iSectionIndex].description =
                trim(powerform_reference->sections[i].description, 3)
              set powerform_activity->sections[iSectionIndex].event_cd =
                powerform_reference->sections[i].event_cd
              set powerform_activity->sections[iSectionIndex].components.social_history_ind =
                powerform_reference->sections[i].components.social_history_ind
 
              ; Populate Section Activity
              set powerform_activity->sections[iSectionIndex].reference_nbr = trim(GetReferenceNumber(iReferenceNumberIndex), 3)
              set iReferenceNumberIndex += 1
              set powerform_activity->sections[iSectionIndex].reference_nbr_length =
                size(powerform_activity->sections[iSectionIndex].reference_nbr)
              set powerform_activity->sections[iSectionIndex].collating_seq =
                cnvtstring(powerform_reference->sections[i].dcp_section_ref_id)
              set powerform_activity->sections[iSectionIndex].collating_seq_length =
                size(powerform_activity->sections[iSectionIndex].collating_seq)
            endif
 
            ; Add Activity Control
            set powerform_activity->sections[iSectionIndex].control_cnt += 1
            set iControlIndex = powerform_activity->sections[iSectionIndex].control_cnt
            set stat = alterlist(powerform_activity->sections[iSectionIndex].controls, iControlIndex)
 
            ; Populate Control Reference
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].dcp_input_ref_id =
              powerform_reference->sections[i].controls[j].dcp_input_ref_id
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].found_in_arglist_ind =
              powerform_reference->sections[i].controls[j].found_in_arglist_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].description =
              powerform_reference->sections[i].controls[j].description
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].input_ref_seq =
              powerform_reference->sections[i].controls[j].input_ref_seq
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].input_type =
              powerform_reference->sections[i].controls[j].input_type
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].caption =
              powerform_reference->sections[i].controls[j].caption
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].question_role =
              powerform_reference->sections[i].controls[j].question_role
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].discrete_task_assay =
              powerform_reference->sections[i].controls[j].discrete_task_assay
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].task_assay_cd =
              powerform_reference->sections[i].controls[j].task_assay_cd
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].multi_select_ind =
              powerform_reference->sections[i].controls[j].multi_select_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].required_ind =
              powerform_reference->sections[i].controls[j].required_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_cd =
              powerform_reference->sections[i].controls[j].event_cd
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_class_cd =
              powerform_reference->sections[i].controls[j].event_class_cd
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].default_result_type_cd =
              powerform_reference->sections[i].controls[j].default_result_type_cd
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].date_type_flag =
              powerform_reference->sections[i].controls[j].date_type_flag
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind =
              powerform_reference->sections[i].controls[j].value_type.nomenclature_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind =
              powerform_reference->sections[i].controls[j].value_type.freetext_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind =
              powerform_reference->sections[i].controls[j].value_type.numeric_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind =
              powerform_reference->sections[i].controls[j].value_type.rtf_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind =
              powerform_reference->sections[i].controls[j].value_type.date_time_ind
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq =
              cnvtstring(powerform_reference->sections[i].controls[j].input_ref_seq, 10, 0, "L")
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq_length =
              size(powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq)
 
            ; Populate DTA Reference Range Factors
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor_cnt =
              powerform_reference->sections[i].controls[j].ref_range_factor_cnt
            set stat = alterlist(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor,
              powerform_reference->sections[i].controls[j].ref_range_factor_cnt)
            set iRefRangeIndex = 0
 
            for(l = 1 to powerform_reference->sections[i].controls[j].ref_range_factor_cnt)
              set iRefRangeIndex += 1
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].units_cd =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].units_cd
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].normal_ind =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].normal_ind
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].normal_low =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].normal_low
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].normal_high =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].normal_high
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].critical_ind =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].critical_ind
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].critical_low =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].critical_low
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].critical_high =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].critical_high
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].feasible_ind =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].feasible_ind
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].feasible_low =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].feasible_low
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].feasible_high =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].feasible_high
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses_cnt =
                powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses_cnt
              set stat = alterlist(powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                .ref_range_factor[iRefRangeIndex].alpha_responses,
                powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses_cnt)
              set iAlphaResponseIndex = 0
 
              for(m = 1 to powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses_cnt)
                set iAlphaResponseIndex += 1
 
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].nomenclature_id =
                  powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses[m].nomenclature_id
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].source_string =
                  trim(powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses[m].source_string, 3)
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].short_string =
                  trim(powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses[m].short_string, 3)
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].mnemonic =
                  trim(powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses[m].mnemonic, 3)
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .ref_range_factor[iRefRangeIndex].alpha_responses[iAlphaResponseIndex].sequence =
                  powerform_reference->sections[i].controls[j].ref_range_factor[l].alpha_responses[m].sequence
              endfor
            endfor
 
            ; Populate Control Activity
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr =
              trim(GetReferenceNumber(iReferenceNumberIndex), 3)
            set iReferenceNumberIndex += 1
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr_length =
              size(powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr)
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq =
              cnvtstring(powerform_reference->sections[i].controls[j].input_ref_seq, 10, 0, "L")
            set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq_length =
              size(powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq)
 
            ; Nomenclature (Coded) Values
            if(size(arglist->FieldInputs[k].CodedValueIds, 5) > 0)
              set iValueSize = size(arglist->FieldInputs[k].CodedValueIds, 5)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt = iValueSize
              set stat = alterlist(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values, iValueSize)
 
              for(l = 1 to iValueSize)
                if(textlen(trim(arglist->FieldInputs[k].CodedValueIds[l], 3)) < 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].clear_value_ind = 1
                  ; FUTURE Remove this error reason when clearing (uncharting) values is supported
                  call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
                    "Clearing/uncharting responses is not currently supported", "9999",
                    "Clearing/uncharting responses is not currently supported", pat_pwrform_reply_out)
                  go to exit_script
                elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind = 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].nomenclature.nomenclature_id =
                    cnvtreal(arglist->FieldInputs[k].CodedValueIds[l])
                  if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor_cnt > 0)
                    ; Find the alpha response with the same nomenclature id as the value
                    ; NOTE: Currently only the first reference range factor is used.
                    ; This can be enhanced in the future to actually support reference ranges.
                    set iAlphaResponseIndex = locateval(iAlphaResponseIndex, 1,
                      ; Max is alpha response size
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .ref_range_factor[1].alpha_responses_cnt,
                      ; Searching for the value nomenclature_id
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .values[l].nomenclature.nomenclature_id,
                      ; Searching the alpha responses for the nomenclature id
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .ref_range_factor[1].alpha_responses[iAlphaResponseIndex].nomenclature_id)
 
                    ; Populate additional value information from the alpha response
                    if(iAlphaResponseIndex > 0)
                      set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .values[l].nomenclature.sequence_nbr =
                        powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1]
                          .alpha_responses[iAlphaResponseIndex].sequence
                      set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .values[l].nomenclature.mnemonic =
                        trim(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1]
                          .alpha_responses[iAlphaResponseIndex].mnemonic, 3)
                      set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .values[l].nomenclature.short_string =
                        trim(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1]
                          .alpha_responses[iAlphaResponseIndex].short_string, 3)
                      set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                        .values[l].nomenclature.descriptor =
                        trim(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1]
                          .alpha_responses[iAlphaResponseIndex].source_string, 3)
                    else
                      set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].value_invalid_ind = 1
                    endif
 
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].unit_cd =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].units_cd
                  endif
                else
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].value_invalid_ind = 1
                endif
              endfor
            ; Text Values
            elseif(size(arglist->FieldInputs[k].TextValues, 5) > 0)
              set iValueSize = size(arglist->FieldInputs[k].TextValues, 5)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt = iValueSize
              set stat = alterlist(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values, iValueSize)
 
              for(l = 1 to iValueSize)
                ; Freetext Value
                if(textlen(trim(arglist->FieldInputs[k].TextValues[l], 3)) < 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].clear_value_ind = 1
                  ; FUTURE Remove this error reason when clearing (uncharting) values is supported
                  call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
                    "Clearing/uncharting responses is not currently supported", "9999",
                    "Clearing/uncharting responses is not currently supported", pat_pwrform_reply_out)
                  go to exit_script
                elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind = 1
                  and textlen(trim(arglist->FieldInputs[k].TextValues[l], 3)) <= 255)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].text_value =
                    trim(arglist->FieldInputs[k].TextValues[l], 3)
                ; RTF Value
                elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind = 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].rtf_value =
                    base64_decode(trim(arglist->FieldInputs[k].TextValues[l], 3))
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].rtf_value_size =
                    textlen(nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].rtf_value))
                ; Date/Time Value
                elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind = 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].date_time_value =
                    GetDateTime(arglist->FieldInputs[k].TextValues[l])
                else
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].value_invalid_ind = 1
                endif
              endfor
            ; Numeric Values
            elseif(size(arglist->FieldInputs[k].NumericValues, 5) > 0)
              set iValueSize = size(arglist->FieldInputs[k].NumericValues, 5)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt = iValueSize
              set stat = alterlist(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values, iValueSize)
 
              for(l = 1 to iValueSize)
                set dUnitCd = 0.00
                if(textlen(trim(arglist->FieldInputs[k].NumericValues[l].UnitId, 3)) > 0)
                  set dUnitCd = -1.00
                  if(isnumeric(trim(arglist->FieldInputs[k].NumericValues[l].UnitId, 3)) > 0)
                    set dUnitCd = cnvtreal(trim(arglist->FieldInputs[k].NumericValues[l].UnitId, 3))
                    if(GetCodeSet(dUnitCd) != 54.00)
                      set dUnitCd = -1.00
                    endif
                  endif
                endif

                if(textlen(trim(arglist->FieldInputs[k].NumericValues[l].Value, 3)) < 1)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].clear_value_ind = 1
                  ; FUTURE Remove this error reason when clearing (uncharting) values is supported
                  call ErrorHandler2(c_error_handler, "F", "PopulatePowerFormActivity",
                    "Clearing/uncharting responses is not currently supported", "9999",
                    "Clearing/uncharting responses is not currently supported", pat_pwrform_reply_out)
                  go to exit_script
                elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind = 1
                  and isnumeric(trim(arglist->FieldInputs[k].NumericValues[l].Value, 3)) > 0
                  and dUnitCd >= 0.00
                  and (powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[iRefRangeIndex].
                    feasible_ind = 0
                    or (
                      cnvtreal(arglist->FieldInputs[k].NumericValues[l].Value) >= powerform_activity->sections[iSectionIndex].
                        controls[iControlIndex].ref_range_factor[iRefRangeIndex].feasible_low
                      and
                      cnvtreal(arglist->FieldInputs[k].NumericValues[l].Value) <= powerform_activity->sections[iSectionIndex].
                        controls[iControlIndex].ref_range_factor[iRefRangeIndex].feasible_high
                    )
                  ))
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].numeric_value =
                    cnvtreal(arglist->FieldInputs[k].NumericValues[l].Value)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].numeric_display =
                    trim(arglist->FieldInputs[k].NumericValues[l].Value, 3)
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].unit_cd = dUnitCd
 
                  if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].unit_cd <= 0.0
                    and powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor_cnt > 0)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].unit_cd =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].units_cd
                  endif

                  if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor_cnt > 0)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_ind =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].normal_ind
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_low =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].normal_low
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_high =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].normal_high
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_ind =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].critical_ind
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_low =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].critical_low
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_high =
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].ref_range_factor[1].critical_high
                  endif

                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd = -1.00

                  ; Critical Low
                  if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_ind > 0
                    and powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].numeric_value <
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_low)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd = c_normalcy_extreme_low_cd
                  ; Critical High
                  elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_ind > 0
                    and powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].numeric_value >
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_high)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd = c_normalcy_extreme_high_cd
                  ; Normal Low
                  elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_ind > 0
                    and powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].numeric_value <
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_low)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd = c_normalcy_low_cd
                  ; Normal High
                  elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_ind > 0
                    and powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].numeric_value >
                      powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_high)
                    set powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd = c_normalcy_high_cd
                  endif
                else
                  set powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[l].value_invalid_ind = 1
                endif
              endfor
            endif
 
            if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt > 0)
              ; Mark number of answered controls
              set powerform_activity->control_answered_cnt += 1
              if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].required_ind = 1)
                ; Mark number of answered required controls
                set powerform_activity->required_control_answered_cnt += 1
              endif
            endif
          endif
        endfor
      endif
    endfor
  endfor
 
  set powerform_activity->document_reference_nbr = trim(GetReferenceNumber(iReferenceNumberIndex), 3)
  set iReferenceNumberIndex += 1
  set powerform_activity->document_reference_nbr_length = size(powerform_activity->document_reference_nbr)
  set powerform_activity->document_child_reference_nbr = trim(GetReferenceNumber(iReferenceNumberIndex), 3)
  set iReferenceNumberIndex += 1
  set powerform_activity->document_child_reference_nbr_length = size(powerform_activity->document_child_reference_nbr)
 
  ; Load the previous PowerForm results
  call GetPreviousFormResults(null)
 
  declare iRbSize = i4 with privateprotect, noconstant(0)
  declare iRbIndex = i4 with privateprotect, noconstant(0)
  declare iEventPrsnlSize = i4 with privateprotect, noconstant(0)
  declare iEventPrsnlIndex = i4 with privateprotect, noconstant(0)
  declare iSectionEventSize = i4 with privateprotect, noconstant(0)
  declare iSectionEventIndex = i4 with privateprotect, noconstant(0)
  declare iControlEventSize = i4 with privateprotect, noconstant(0)
  declare iControlEventIndex = i4 with privateprotect, noconstant(0)
 
  ; For PowerForm
  set iRbSize = size(event_detail_query_1000011_rep->rb_list, 5)
  for(iRbListIndex = 1 to iRbSize)
    ; Form
    if(event_detail_query_1000011_rep->rb_list[iRbIndex].event_id = powerform_activity->event_id)
      set powerform_activity->reference_nbr = trim(event_detail_query_1000011_rep->rb_list[iRbIndex].reference_nbr, 3)
      set powerform_activity->reference_nbr_length = size(powerform_activity->reference_nbr)
      set powerform_activity->updt_cnt = event_detail_query_1000011_rep->rb_list[iRbIndex].updt_cnt
      set powerform_activity->collating_seq = trim(event_detail_query_1000011_rep->rb_list[iRbIndex].collating_seq, 3)
      set powerform_activity->collating_seq_length = size(powerform_activity->collating_seq)
      set dContributorSystemCd = event_detail_query_1000011_rep->rb_list[iRbIndex].contributor_system_cd
 
      ; Event End Date/Time
      set powerform_date_time->original_event_end_dt_tm = event_detail_query_1000011_rep->rb_list[iRbIndex].event_end_dt_tm
      set powerform_date_time->original_event_end_tz = event_detail_query_1000011_rep->rb_list[iRbIndex].event_end_tz
 
      ; Form Event Prsnl
      set iEventPrsnlSize = size(event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list, 5)
      set iEventPrsnlIndex = 0
      set powerform_activity->event_prsnl_cnt = iEventPrsnlSize
      set stat = alterlist(powerform_activity->event_prsnl_list, iEventPrsnlSize)
      for(iEventPrsnlIndex = 1 to iEventPrsnlSize)
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].event_prsnl_id =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_type_cd =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].action_type_cd
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_dt_tm =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].action_dt_tm
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_prsnl_id =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_status_cd =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].action_status_cd
        set powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_tz =
          event_detail_query_1000011_rep->rb_list[iRbIndex].event_prsnl_list[iEventPrsnlIndex].action_tz
 
        if(powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_type_cd = c_perform_action_type_cd)
          set powerform_date_time->original_action_dt_tm = powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_dt_tm
          set powerform_date_time->original_action_tz = powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_tz
        endif
      endfor
 
      ; Section Event
      set iSectionEventSize = size(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list, 5)
      set iSectionEventIndex = 0
      for(iSectionEventIndex = 1 to iSectionEventSize)
        declare sCollatingSeq = vc with privateprotect,
          noconstant(trim(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].collating_seq, 3))
        set iSectionIndex = locateval(iSectionIndex, 1, powerform_activity->section_cnt,
          cnvtreal(trim(sCollatingSeq, 3)),
          powerform_activity->sections[iSectionIndex].dcp_section_ref_id)
        if(iSectionIndex > 0)
          ; Section
          set powerform_activity->sections[iSectionIndex].reference_nbr =
            trim(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].reference_nbr, 3)
          set powerform_activity->sections[iSectionIndex].reference_nbr_length =
            size(powerform_activity->sections[iSectionIndex].reference_nbr)
          set powerform_activity->sections[iSectionIndex].event_id =
            event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].event_id
          set powerform_activity->sections[iSectionIndex].updt_cnt =
            event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].updt_cnt
          set powerform_activity->sections[iSectionIndex].collating_seq = sCollatingSeq
          set powerform_activity->sections[iSectionIndex].collating_seq_length = size(sCollatingSeq)
 
          ; Section Event Prsnl
          set iEventPrsnlSize =
            size(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].event_prsnl_list, 5)
          set iEventPrsnlIndex = 0
          set powerform_activity->sections[iSectionIndex].event_prsnl_cnt = iEventPrsnlSize
          set stat = alterlist(powerform_activity->sections[iSectionIndex].event_prsnl_list, iEventPrsnlSize)
          for(iEventPrsnlIndex = 1 to iEventPrsnlSize)
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].event_prsnl_id
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_type_cd =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].action_type_cd
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_dt_tm =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].action_dt_tm
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].action_prsnl_id
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_status_cd =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].action_status_cd
            set powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_tz =
              event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .event_prsnl_list[iEventPrsnlIndex].action_tz
          endfor
 
          ; Control Event
          set iControlEventSize =
            size(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex].child_event_list, 5)
          set iControlEventIndex = 0
          for(iControlEventIndex = 1 to iControlEventSize)
            declare dControlEventCd = f8 with privateprotect,
              noconstant(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
              .child_event_list[iControlEventIndex].event_cd)
            set iControlIndex = locateval(iControlIndex, 1, powerform_activity->sections[iSectionIndex].control_cnt,
              dControlEventCd,
              powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_cd)
            if(iControlIndex > 0)
              ; Control
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr =
                trim(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].reference_nbr, 3)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr_length =
                size(powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_id =
                event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].event_id
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].updt_cnt =
                event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].updt_cnt
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_class_cd =
                event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].event_class_cd
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq =
                trim(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].collating_seq, 3)
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq_length =
                size(powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq)
 
              ; Control Event Prsnl
              set iEventPrsnlSize =
                size(event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                .child_event_list[iControlEventIndex].event_prsnl_list, 5)
              set iEventPrsnlIndex = 0
              set powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_cnt = iEventPrsnlSize
              set stat = alterlist(powerform_activity->sections[iSectionIndex]
                .controls[iControlIndex].event_prsnl_list, iEventPrsnlSize)
              for(iEventPrsnlIndex = 1 to iEventPrsnlSize)
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].event_prsnl_id =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].action_type_cd =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].action_type_cd
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].action_dt_tm =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].action_dt_tm
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].action_prsnl_id =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].action_status_cd =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].action_status_cd
                set powerform_activity->sections[iSectionIndex].controls[iControlIndex]
                  .event_prsnl_list[iEventPrsnlIndex].action_tz =
                    event_detail_query_1000011_rep->rb_list[iRbIndex].child_event_list[iSectionEventIndex]
                  .child_event_list[iControlEventIndex].event_prsnl_list[iEventPrsnlIndex].action_tz
              endfor
            endif
          endfor
        endif
      endfor
    endif
  endfor
 
  ; Load the previous PowerForm RTF results
  set stat = copyrec(event_detail_query_1000011_req, event_detail_query_rtf_1000011_req, 0)
  set stat = copyrec(event_detail_query_1000011_rep, event_detail_query_rtf_1000011_rep, 0)
  if(powerform_activity->document_event_cd > 0.00)
    call GetPreviousFormRTFResults(null)
  endif
 
  if(size(event_detail_query_rtf_1000011_rep->rb_list, 5) > 0)
    ; RTF Document
    if(event_detail_query_rtf_1000011_rep->rb_list[1].event_id = powerform_activity->document_event_id)
      set powerform_activity->document_updt_cnt = event_detail_query_rtf_1000011_rep->rb_list[1].updt_cnt
 
      ; Event End Date/Time
      set powerform_date_time->document_original_event_end_dt_tm =
        event_detail_query_rtf_1000011_rep->rb_list[iRbIndex].event_end_dt_tm
      set powerform_date_time->document_original_event_end_tz =
        event_detail_query_rtf_1000011_rep->rb_list[iRbIndex].event_end_tz
 
      ; RTF Document Event Prsnl
      set iEventPrsnlSize = size(event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list, 5)
      set iEventPrsnlIndex = 0
      set powerform_activity->document_event_prsnl_cnt = iEventPrsnlSize
      set stat = alterlist(powerform_activity->document_event_prsnl_list, iEventPrsnlSize)
      for(iEventPrsnlIndex = 1 to iEventPrsnlSize)
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].event_prsnl_id =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_type_cd =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].action_type_cd
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_dt_tm =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].action_dt_tm
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_prsnl_id =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_status_cd =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].action_status_cd
        set powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_tz =
          event_detail_query_rtf_1000011_rep->rb_list[1].event_prsnl_list[iEventPrsnlIndex].action_tz
 
        if(powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_type_cd = c_perform_action_type_cd)
          set powerform_date_time->document_original_action_dt_tm =
            powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_dt_tm
          set powerform_date_time->document_original_action_tz =
            powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_tz
        endif
      endfor
 
      ; Section Event
      if(size(event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list, 5) > 0)
        set powerform_activity->document_child_reference_nbr =
          trim(event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list[1].reference_nbr, 3)
        set powerform_activity->document_child_reference_nbr_length = size(powerform_activity->document_child_reference_nbr)
        set powerform_activity->document_child_event_id =
          event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list[1].event_id
        set powerform_activity->document_child_updt_cnt =
          event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list[1].updt_cnt
        set powerform_activity->document_child_event_class_cd =
          event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list[1].event_class_cd
        set powerform_activity->document_child_collating_seq =
          trim(event_detail_query_rtf_1000011_rep->rb_list[1].child_event_list[1].collating_seq, 3)
        set powerform_activity->document_child_collating_seq_length = size(powerform_activity->document_child_collating_seq)
      endif
    endif
  endif
 
  ; Event End Date/Time
  set powerform_date_time->new_event_end_dt_tm = powerform_date_time->original_event_end_dt_tm
  set powerform_date_time->new_event_end_tz = powerform_date_time->original_event_end_tz
  set powerform_date_time->document_new_event_end_dt_tm = powerform_date_time->document_original_event_end_dt_tm
  set powerform_date_time->document_new_event_end_tz = powerform_date_time->document_original_event_end_tz
 
  ; Strip the seconds
  set powerform_date_time->new_event_end_dt_tm = StripDateTimeSeconds(powerform_date_time->new_event_end_dt_tm,
    powerform_date_time->new_event_end_tz)
  set powerform_date_time->document_new_event_end_dt_tm = StripDateTimeSeconds(powerform_date_time->document_new_event_end_dt_tm,
    powerform_date_time->document_new_event_end_tz)
 
  ; Action Date/Time
  if(textlen(nullterm(trim(arglist->PerformedDateTime, 3))) > 0)
    set powerform_date_time->new_action_dt_tm = performedDateTime
    set powerform_date_time->new_action_tz = c_time_zone_index
    set powerform_date_time->document_new_action_dt_tm = performedDateTime
    set powerform_date_time->document_new_action_tz = c_time_zone_index
  else
    set powerform_date_time->new_action_dt_tm = c_now_dt_tm
    set powerform_date_time->new_action_tz = c_time_zone_index
    set powerform_date_time->document_new_action_dt_tm = c_now_dt_tm
    set powerform_date_time->document_new_action_tz = c_time_zone_index
  endif
 
  if(iDebugFlag > 0)
    call echorecord(powerform_activity)
    call echorecord(powerform_date_time)
    call echo(build("dContributorSystemCd  ->", dContributorSystemCd))
 
    call echo(concat("PopulatePowerFormActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PopulatePowerFormActivity
 
/*************************************************************************
;  Name: GetPreviousFormResults(null) = null
;  Description:  Gets previous form results
**************************************************************************/
subroutine GetPreviousFormResults(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetPreviousFormResults Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set event_detail_query_1000011_req->query_mode = 3
	set event_detail_query_1000011_req->event_id = powerform_activity->event_id
	set event_detail_query_1000011_req->subtable_bit_map_ind = 1
	set event_detail_query_1000011_req->valid_from_dt_tm_ind = 1
 
  set iTransactionTaskId = 600107
  set iStepId = 1000011
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", event_detail_query_1000011_req, "REC", event_detail_query_1000011_rep)
 
  if(size(event_detail_query_1000011_rep->rb_list, 5) < 1)
    ; call echorecord(event_detail_query_1000011_req)
    ; call echorecord(event_detail_query_1000011_rep)
    free record event_detail_query_1000011_req
    free record event_detail_query_1000011_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetPreviousFormResults",
      "Call to event_detail_query failed (step_id=1000011)", "9999",
      "Call to event_detail_query failed (step_id=1000011)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(event_detail_query_1000011_req)
    ; call echorecord(event_detail_query_1000011_rep)
 
    call echo(concat("GetPreviousFormResults Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetPreviousFormResults
 
/*************************************************************************
;  Name: GetPreviousFormRTFResults(null) = null
;  Description:  Gets previous form RTF results
**************************************************************************/
subroutine GetPreviousFormRTFResults(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetPreviousFormRTFResults Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set event_detail_query_rtf_1000011_req->query_mode = 3
	set event_detail_query_rtf_1000011_req->event_id = powerform_activity->document_event_id
	set event_detail_query_rtf_1000011_req->subtable_bit_map_ind = 1
	set event_detail_query_rtf_1000011_req->valid_from_dt_tm_ind = 1
 
  set iTransactionTaskId = 600107
  set iStepId = 1000011
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", event_detail_query_rtf_1000011_req, "REC", event_detail_query_rtf_1000011_rep)
 
  if(size(event_detail_query_rtf_1000011_rep->rb_list, 5) < 1)
    ; call echorecord(event_detail_query_rtf_1000011_req)
    ; call echorecord(event_detail_query_rtf_1000011_rep)
    free record event_detail_query_rtf_1000011_req
    free record event_detail_query_rtf_1000011_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetPreviousFormRTFResults",
      "Call to event_detail_query failed (step_id=1000011)", "9999",
      "Call to event_detail_query failed (step_id=1000011)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(event_detail_query_rtf_1000011_req)
    ; call echorecord(event_detail_query_rtf_1000011_rep)
 
    call echo(concat("GetPreviousFormRTFResults Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetPreviousFormRTFResults
 
/*************************************************************************
;  Name: GetHistoricalFormResults(null) = null
;  Description:  Gets historical form results
**************************************************************************/
subroutine GetHistoricalFormResults(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetHistoricalFormResults Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set iTransactionTaskId = 600701
  set iStepId = 1000079
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", event_detail_batch_query_1000079_req, "REC", event_detail_batch_query_1000079_rep)
 
  if(size(event_detail_batch_query_1000079_rep->rep_list, 5) < 1)
    ; call echorecord(event_detail_batch_query_1000079_req)
    ; call echorecord(event_detail_batch_query_1000079_rep)
    free record event_detail_batch_query_1000079_req
    free record event_detail_batch_query_1000079_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetHistoricalFormResults",
      "Call to event_detail_batch_query failed (step_id=1000079)", "9999",
      "Call to event_detail_batch_query failed (step_id=1000079)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(event_detail_batch_query_1000079_req)
    ; call echorecord(event_detail_batch_query_1000079_rep)
 
    call echo(concat("GetHistoricalFormResults Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetHistoricalFormResults
 
/*************************************************************************
;  Name: ValidatePowerFormActivity(null)
;  Description:  Validates that the powerform is properly filled out
**************************************************************************/
subroutine ValidatePowerFormActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("ValidatePowerFormActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; FUTURE Validate this if possible
  ; ; Validate that all required fields are populated
  ; if(powerform_activity->required_control_cnt != powerform_activity->required_control_answered_cnt)
  ;   call ErrorHandler2(c_error_handler, "F", "ValidatePowerFormActivity",
  ;     "Not all required fields were provided", "9999",
  ;     "Not all required fields were provided", pat_pwrform_reply_out)
  ;   go to exit_script
  ; endif
 
  ; Validate that all provided fields are on the form
  if(powerform_activity->control_answered_cnt != size(arglist->FieldInputs, 5))
    if(iDebugFlag > 0)
      call echorecord(powerform_activity)
    endif
 
    call ErrorHandler2(c_error_handler, "F", "ValidatePowerFormActivity",
      "Not all provided fields were on the form", "9999",
      "Not all provided fields were on the form", pat_pwrform_reply_out)
    go to exit_script
  endif

  for(iSectionIndex = 1 to powerform_activity->section_cnt)
    for(iControlIndex = 1 to powerform_activity->sections[iSectionIndex].control_cnt)
      ; Validate that single response fields only have one value
      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].multi_select_ind = 0
        and powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt > 1)
 
        if(iDebugFlag > 0)
          call echorecord(powerform_activity)
        endif
 
        call ErrorHandler2(c_error_handler, "F", "ValidatePowerFormActivity",
          "Multiple values were provided for a field that does not support multiple values", "9999",
          "Multiple values were provided for a field that does not support multiple values", pat_pwrform_reply_out)
        go to exit_script
      endif

      ; Validate that the values for the control are valid
      for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
        if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].value_invalid_ind = 1)
          if(iDebugFlag > 0)
            call echorecord(powerform_activity)
          endif

          call ErrorHandler2(c_error_handler, "F", "ValidatePowerFormActivity",
            build("An invalid value was provided for FieldId=",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].dcp_input_ref_id), "9999",
            build("An invalid value was provided for FieldId=",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].dcp_input_ref_id), pat_pwrform_reply_out)
          go to exit_script
        endif
      endfor
    endfor
  endfor
 
  if(iDebugFlag > 0)
    call echo(concat("ValidatePowerFormActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidatePowerFormActivity
 
/*************************************************************************
;  Name: PopulateSocialHistoryValues(null)
;  Description:  Populates values into the social_history record structure
**************************************************************************/
subroutine PopulateSocialHistoryValues(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PopulateSocialHistoryValues Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; Load the Social History reference information
  if(powerform_reference->components.social_history_ind = 1)
    for(i = 1 to social_history->category_cnt)
      for(j = 1 to social_history->categories[i].element_cnt)
        ; Unable to obtain was provided
        if(textlen(trim(arglist->UnableToObtainSocialHistoryInd, 3)) > 0
          and isnumeric(trim(arglist->UnableToObtainSocialHistoryInd, 3)))
          set social_history->unable_to_obtain_provided_ind = 1
 
          if(cnvtreal(arglist->UnableToObtainSocialHistoryInd) != 0.0)
            set social_history->unable_to_obtain_ind = 1
          else
            set social_history->unable_to_obtain_ind = 0
          endif
        else
          ; Loop through arglist->SocialHistoryInputs
          for(k = 1 to size(arglist->SocialHistoryInputs, 5))
            ; Found Social History field in arglist->SocialHistoryInputs
            if(cnvtreal(arglist->SocialHistoryInputs[k].FieldId) =
              shx_get_social_history_def_601050_rep->category_qual[i].element_qual[j].shx_element_id)
 
              ; Nomenclature (Coded) Values
              if(size(arglist->SocialHistoryInputs[k].CodedValueIds, 5) > 0)
                set iValueSize = size(arglist->SocialHistoryInputs[k].CodedValueIds, 5)
                set social_history->categories[i].elements[j].value_cnt = iValueSize
                set stat = alterlist(social_history->categories[i].elements[j].values, iValueSize)
 
                for(l = 1 to iValueSize)
                  if(social_history->categories[i].elements[j].value_type.nomenclature_ind = 1)
                    set social_history->categories[i].elements[j].values[l].nomenclature.nomenclature_id =
                      cnvtreal(arglist->SocialHistoryInputs[k].CodedValueIds[l])
                    if(social_history->categories[i].elements[j].ref_range_factor_cnt > 0)
                      ; Find the alpha response with the same nomenclature id as the value
                      ; NOTE: Currently only the first reference range factor is used.
                      ; This can be enhanced in the future to actually support reference ranges.
                      set iAlphaResponseIndex = locateval(iAlphaResponseIndex, 1,
                        ; Max is alpha response size
                        social_history->categories[i].elements[j].ref_range_factor[1].alpha_responses_cnt,
                        ; Searching for the value nomenclature_id
                        social_history->categories[i].elements[j].values[l].nomenclature.nomenclature_id,
                        ; Searching the alpha responses for the nomenclature id
                        social_history->categories[i].elements[j]
                          .ref_range_factor[1].alpha_responses[iAlphaResponseIndex].nomenclature_id)
 
                      ; Populate additional value information from the alpha response
                      if(iAlphaResponseIndex > 0)
                        set social_history->categories[i].elements[j]
                            .values[l].nomenclature.sequence_nbr =
                          social_history->categories[i].elements[j].ref_range_factor[1]
                            .alpha_responses[iAlphaResponseIndex].sequence
                        set social_history->categories[i].elements[j]
                            .values[l].nomenclature.mnemonic =
                          trim(social_history->categories[i].elements[j].ref_range_factor[1]
                            .alpha_responses[iAlphaResponseIndex].mnemonic, 3)
                        set social_history->categories[i].elements[j]
                            .values[l].nomenclature.short_string =
                          trim(social_history->categories[i].elements[j].ref_range_factor[1]
                            .alpha_responses[iAlphaResponseIndex].short_string, 3)
                        set social_history->categories[i].elements[j]
                            .values[l].nomenclature.descriptor =
                          trim(social_history->categories[i].elements[j].ref_range_factor[1]
                            .alpha_responses[iAlphaResponseIndex].source_string, 3)
                      endif
 
                      set social_history->categories[i].elements[j].values[l].unit_cd =
                        social_history->categories[i].elements[j].ref_range_factor[1].units_cd
                    endif
                  else
                    set social_history->categories[i].elements[j].values[l].value_invalid_ind = 1
                  endif
                endfor
              ; Text Values
              elseif(size(arglist->SocialHistoryInputs[k].TextValues, 5) > 0)
                set iValueSize = size(arglist->SocialHistoryInputs[k].TextValues, 5)
                set social_history->categories[i].elements[j].value_cnt = iValueSize
                set stat = alterlist(social_history->categories[i].elements[j].values, iValueSize)
 
                for(l = 1 to iValueSize)
                  ; Freetext Value
                  if(social_history->categories[i].elements[j].value_type.freetext_ind = 1)
                    set social_history->categories[i].elements[j].values[l].text_value =
                      trim(arglist->SocialHistoryInputs[k].TextValues[l], 3)
                  ; Date/Time Value
                  elseif(social_history->categories[i].elements[j].value_type.date_time_ind = 1)
                    set social_history->categories[i].elements[j].values[l].date_time_value =
                      GetDateTime(arglist->SocialHistoryInputs[k].TextValues[l])
                  else
                    set social_history->categories[i].elements[j].values[l].value_invalid_ind = 1
                  endif
                endfor
              ; Numeric Values
              elseif(size(arglist->SocialHistoryInputs[k].NumericValues, 5) > 0)
                set iValueSize = size(arglist->SocialHistoryInputs[k].NumericValues, 5)
                set social_history->categories[i].elements[j].value_cnt = iValueSize
                set stat = alterlist(social_history->categories[i].elements[j].values, iValueSize)
 
                for(l = 1 to iValueSize)
                  if(social_history->categories[i].elements[j].value_type.numeric_ind = 1
                    and isnumeric(arglist->SocialHistoryInputs[k].NumericValues[l].Value) > 0)
                    set social_history->categories[i].elements[j].values[l].numeric_value =
                      cnvtreal(arglist->SocialHistoryInputs[k].NumericValues[l].Value)
                    set social_history->categories[i].elements[j].values[l].numeric_display =
                      trim(arglist->SocialHistoryInputs[k].NumericValues[l].Value, 3)
                    set social_history->categories[i].elements[j].values[l].unit_cd =
                      cnvtreal(arglist->SocialHistoryInputs[k].NumericValues[l].UnitId)
                    set social_history->categories[i].elements[j].values[l].modifier_flag =
                      cnvtreal(arglist->SocialHistoryInputs[k].NumericValues[l].ModifierFlag)
 
                    if(social_history->categories[i].elements[j].values[l].unit_cd <= 0.0
                      and social_history->categories[i].elements[j].ref_range_factor_cnt > 0)
                      set social_history->categories[i].elements[j].values[l].unit_cd =
                        social_history->categories[i].elements[j].ref_range_factor[1].units_cd
                    endif
                  else
                    set social_history->categories[i].elements[j].values[l].value_invalid_ind = 1
                  endif
                endfor
              endif
 
              if(social_history->categories[i].elements[j].value_cnt > 0)
                ; Mark number of answered elements
                set social_history->element_answered_cnt += 1
                set social_history->categories[i].element_answered_cnt += 1
                if(social_history->categories[i].elements[j].required_ind = 1)
                  ; Mark number of answered required elements
                  set social_history->required_element_answered_cnt += 1
                endif
              endif
            endif
          endfor
        endif
      endfor
    endfor
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(social_history)
 
    call echo(concat("PopulateSocialHistoryValues Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PopulateSocialHistoryValues
 
/*************************************************************************
;  Name: ValidateSocialHistory(null)
;  Description:  Validates the social_history record structure
**************************************************************************/
subroutine ValidateSocialHistory(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("ValidateSocialHistory Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; Validate that all required fields are populated
  if(social_history->required_element_cnt != social_history->required_element_answered_cnt)
    ; call echorecord(social_history)
    call ErrorHandler2(c_error_handler, "F", "ValidateSocialHistory",
      "Not all required fields were provided", "9999",
      "Not all required fields were provided", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Validate that unable to obtain and the social history questions are not both populated
  if(social_history->unable_to_obtain_ind = 1 and size(arglist->SocialHistoryInputs, 5) > 0)
    ; call echorecord(social_history)
    call ErrorHandler2(c_error_handler, "F", "ValidateSocialHistory",
      "Both unable to obtain and social history questions were populated", "9999",
      "Both unable to obtain and social history questions were populated", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Validate that all provided fields are a valid social history question
  if(social_history->element_answered_cnt != size(arglist->SocialHistoryInputs, 5))
    ; call echorecord(social_history)
    call ErrorHandler2(c_error_handler, "F", "ValidateSocialHistory",
      "Not all provided fields were a valid social history question", "9999",
      "Not all provided fields were a valid social history question", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Validate that single response fields only have one value
  for(i = 1 to social_history->category_cnt)
    for(j = 1 to social_history->categories[i].element_cnt)
      if(social_history->categories[i].elements[j].multi_select_ind = 0
        and social_history->categories[i].elements[j].value_cnt > 1)
        ; call echorecord(social_history)
        call ErrorHandler2(c_error_handler, "F", "ValidateSocialHistory",
          "Multiple values were provided for a field that does not support multiple values", "9999",
          "Multiple values were provided for a field that does not support multiple values", pat_pwrform_reply_out)
        go to exit_script
      endif
    endfor
  endfor
 
  if(iDebugFlag > 0)
    call echo(concat("ValidateSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidateSocialHistory
 
/*************************************************************************
;  Name: PostPowerForm(null)
;  Description:  Posts a PowerForm
**************************************************************************/
subroutine PostPowerForm(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PostPowerForm Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    ; call echorecord(powerform_activity)
  endif
 
  ; Call transaction 1000012 (task 600108, application 600005)
  ; under namespace post_form in subroutine PostPowerForm for c_error_handler
  ; Error record structure - pat_pwrform_reply_out
 
  ; Constants
  set iTransactionTaskId = 600108
  set iStepId = 1000012
  set hApp = 0
  set hTask = 0
  set hStep = 0
  set crmstatus = 0
 
  ; Begin Application
  set crmstatus = uar_crmbeginapp(c_application_id, hApp)
  if(crmstatus != 0 or hApp = 0)
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Begin application failed (application_id=600005)", "9999",
      "Begin application failed (application_id=600005)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Begin Task
  set crmstatus = uar_crmbegintask(hApp, iTransactionTaskId, hTask)
  if(crmstatus != 0 or hTask = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Begin task failed (task_id=600108)", "9999",
      "Begin task failed (task_id=600108)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Begin Request
  set crmstatus = uar_crmbeginreq(hTask, "", iStepId, hStep)
  if(crmstatus != 0 or hStep = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Begin request failed (step_id=1000012)", "9999",
      "Begin request failed (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Get Request
  declare hRequest = i4 with privateprotect, constant(uar_crmgetrequest(hStep))
  if(hRequest = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Unable to get request (step_id=1000012)", "9999",
      "Unable to get request (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request
  set stat = uar_srvsetshort(hRequest, "ensure_type", 2) ; 2 - Modify
 
  ; Get Request -> Clinical Event
  declare hClinEvent = i4 with privateprotect, noconstant(uar_srvgetstruct(hRequest, "clin_event"))
  if(hClinEvent = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Unable to get request->clin_event (step_id=1000012)", "9999",
      "Unable to get request->clin_event (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event
  set stat = uar_srvsetdouble(hClinEvent, "event_id", powerform_activity->event_id)
  set stat = uar_srvsetlong(hClinEvent, "view_level", 1)
  set stat = uar_srvsetdouble(hClinEvent, "person_id", dPersonId)
  set stat = uar_srvsetdouble(hClinEvent, "encntr_id", dEncounterId)
  set stat = uar_srvsetdouble(hClinEvent, "contributor_system_cd", dContributorSystemCd)
  set stat = uar_srvsetstringfixed(hClinEvent, "reference_nbr",
    powerform_activity->reference_nbr, powerform_activity->reference_nbr_length)
  set stat = uar_srvsetdouble(hClinEvent, "parent_event_id", powerform_activity->event_id)
  set stat = uar_srvsetdouble(hClinEvent, "event_class_cd", c_grp_event_class_cd)
  set stat = uar_srvsetdouble(hClinEvent, "event_cd", powerform_activity->event_cd)
  set stat = uar_srvsetdouble(hClinEvent, "event_reltn_cd", c_root_event_reltn_cd)
  set stat = uar_srvsetdate(hClinEvent, "event_end_dt_tm", cnvtdatetime(powerform_date_time->new_event_end_dt_tm))
  set stat = uar_srvsetlong(hClinEvent, "event_end_tz", powerform_date_time->new_event_end_tz)
  set stat = uar_srvsetdouble(hClinEvent, "record_status_cd", c_record_status_code_active_cd)
  set stat = uar_srvsetdouble(hClinEvent, "result_status_cd", c_result_status_code_modified_cd)
  set stat = uar_srvsetshort(hClinEvent, "authentic_flag", 1)
  set stat = uar_srvsetshort(hClinEvent, "publish_flag", 1)
  set stat = uar_srvsetstring(hClinEvent, "event_title_text", nullterm(trim(powerform_activity->description, 3)))
  set stat = uar_srvsetstringfixed(hClinEvent, "collating_seq",
    powerform_activity->collating_seq, powerform_activity->collating_seq_length)
  set stat = uar_srvsetdouble(hClinEvent, "entry_mode_cd", c_powerforms_entry_mode_cd)
  set stat = uar_srvsetlong(hClinEvent, "updt_cnt", powerform_activity->updt_cnt)
 
  declare hEventPrsnl = i4 with privateprotect, noconstant(0)
  declare iEventPrsnlIndex = i4 with privateprotect, noconstant(0)
 
  ; Existing Event Prsnl
  for(iEventPrsnlIndex = 1 to powerform_activity->event_prsnl_cnt)
    ; Add Request -> Clinical Event -> Event Prsnl for existing action
    set hEventPrsnl = uar_srvadditem(hClinEvent, "event_prsnl_list")
    if(hEventPrsnl = 0)
      call EndCrmCall(hApp, hTask, hStep)
 
      call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
        "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", "9999",
        "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
      go to exit_script
    endif
 
    ; Populate Request -> Clinical Event -> Event Prsnl
    set stat = uar_srvsetdouble(hEventPrsnl, "event_prsnl_id",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].event_prsnl_id)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_prsnl_id)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_type_cd)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_status_cd)
    set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_dt_tm)
    set stat = uar_srvsetlong(hEventPrsnl, "action_tz",
	    powerform_activity->event_prsnl_list[iEventPrsnlIndex].action_tz)
  endfor
 
  ; Add Request -> Clinical Event -> Event Prsnl for Modify Action
  set hEventPrsnl = uar_srvadditem(hClinEvent, "event_prsnl_list")
  if(hEventPrsnl = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", "9999",
      "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Event Prsnl for Modify Action
  set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id", reqinfo->updt_id)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_modify_action_type_cd)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd", c_completed_action_status_cd)
  set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm", cnvtdatetime(powerform_date_time->new_action_dt_tm))
  set stat = uar_srvsetlong(hEventPrsnl, "action_tz", powerform_date_time->new_action_tz)
 
  ; Add Request -> Clinical Event -> Child Event (Section)
  declare hChildEventType = i4 with privateprotect, noconstant(0)
  declare hChildEventSection = i4 with privateprotect, noconstant(0)
  declare hChildEventControl = i4 with privateprotect, noconstant(0)
 
  set hChildEventType = CreateTypeFromSrvField(hClinEvent, "child_event_list", hRequest, "clin_event")
  if(hChildEventType = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Unable to create type from request->clin_event (step_id=1000012)", "9999",
      "Unable to create type from request->clin_event (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  for(iSectionIndex = 1 to powerform_activity->section_cnt)
    set hChildEventSection = AddItemFromType(hClinEvent, "child_event_list", hChildEventType)
    if(hChildEventSection = 0)
      call EndCrmCall(hApp, hTask, hStep)
 
      call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
        "Unable to add request->clin_event.child_event_list (step_id=1000012)", "9999",
        "Unable to add request->clin_event.child_event_list (step_id=1000012)", pat_pwrform_reply_out)
      go to exit_script
    endif
 
    ; Populate Request -> Clinical Event -> Child Event (Section)
    set stat = uar_srvsetdouble(hChildEventSection, "person_id", dPersonId)
    set stat = uar_srvsetdouble(hChildEventSection, "encntr_id", dEncounterId)
    set stat = uar_srvsetdouble(hChildEventSection, "contributor_system_cd", dContributorSystemCd)
    set stat = uar_srvsetstringfixed(hChildEventSection, "reference_nbr",
      powerform_activity->sections[iSectionIndex].reference_nbr, powerform_activity->sections[iSectionIndex].reference_nbr_length)
    set stat = uar_srvsetdouble(hChildEventSection, "parent_event_id", powerform_activity->event_id)
    set stat = uar_srvsetdouble(hChildEventSection, "event_class_cd", c_grp_event_class_cd)
    set stat = uar_srvsetdouble(hChildEventSection, "event_cd", powerform_activity->sections[iSectionIndex].event_cd)
    set stat = uar_srvsetdouble(hChildEventSection, "event_reltn_cd", c_root_event_reltn_cd)
    set stat = uar_srvsetdate(hChildEventSection, "event_end_dt_tm", cnvtdatetime(powerform_date_time->new_event_end_dt_tm))
    set stat = uar_srvsetlong(hChildEventSection, "event_end_tz", powerform_date_time->new_event_end_tz)
    set stat = uar_srvsetdouble(hChildEventSection, "record_status_cd", c_record_status_code_active_cd)
    set stat = uar_srvsetshort(hChildEventSection, "authentic_flag", 1)
    set stat = uar_srvsetshort(hChildEventSection, "publish_flag", 1)
    set stat = uar_srvsetstring(hChildEventSection, "event_title_text",
      trim(powerform_activity->sections[iSectionIndex].description, 3))
    set stat = uar_srvsetstringfixed(hChildEventSection, "collating_seq",
      powerform_activity->sections[iSectionIndex].collating_seq, powerform_activity->sections[iSectionIndex].collating_seq_length)
    set stat = uar_srvsetdouble(hChildEventSection, "entry_mode_cd", c_powerforms_entry_mode_cd)

    ; Existing section
    if(powerform_activity->sections[iSectionIndex].event_id > 0.00)
      set stat = uar_srvsetdouble(hChildEventSection, "event_id", powerform_activity->sections[iSectionIndex].event_id)
      set stat = uar_srvsetdouble(hChildEventSection, "result_status_cd", c_result_status_code_modified_cd)
      set stat = uar_srvsetlong(hChildEventSection, "updt_cnt", powerform_activity->sections[iSectionIndex].updt_cnt)
    ; New section
    else
      set stat = uar_srvsetdouble(hChildEventSection, "result_status_cd", c_result_status_code_auth_cd)
    endif

    ; Existing Event Prsnl
    for(iEventPrsnlIndex = 1 to powerform_activity->sections[iSectionIndex].event_prsnl_cnt)
      ; Add Request -> Clinical Event -> Child Event (Section) -> Event Prsnl for existing action
      set hEventPrsnl = uar_srvadditem(hChildEventSection, "event_prsnl_list")
      if(hEventPrsnl = 0)
        call EndCrmCall(hApp, hTask, hStep)
 
        call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
          "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", "9999",
          "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
        go to exit_script
      endif
 
      ; Populate Request -> Clinical Event -> Child Event (Section) -> Event Prsnl
      set stat = uar_srvsetdouble(hEventPrsnl, "event_prsnl_id",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_type_cd)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_status_cd)
      set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_dt_tm)
      set stat = uar_srvsetlong(hEventPrsnl, "action_tz",
        powerform_activity->sections[iSectionIndex].event_prsnl_list[iEventPrsnlIndex].action_tz)
    endfor
 
    ; Add Request -> Clinical Event -> Child Event (Section) -> Event Prsnl for Modify Action
    set hEventPrsnl = uar_srvadditem(hChildEventSection, "event_prsnl_list")
    if(hEventPrsnl = 0)
      call EndCrmCall(hApp, hTask, hStep)
 
      call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
        "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", "9999",
        "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
      go to exit_script
    endif
 
    ; Populate Request -> Clinical Event -> Child Event (Section) -> Event Prsnl for Modify Action
    set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id", reqinfo->updt_id)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd", c_completed_action_status_cd)
    set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm", cnvtdatetime(powerform_date_time->new_action_dt_tm))
    set stat = uar_srvsetlong(hEventPrsnl, "action_tz", powerform_date_time->new_action_tz)

    ; Existing section
    if(powerform_activity->sections[iSectionIndex].event_id > 0.00)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_modify_action_type_cd)
    else
      set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_perform_action_type_cd)
    endif

    ; Add Request -> Clinical Event -> Child Event (Section) -> Child Event (Control)
    for(iControlIndex = 1 to powerform_activity->sections[iSectionIndex].control_cnt)
      set hChildEventControl = AddItemFromType(hChildEventSection, "child_event_list", hChildEventType)
      if(hChildEventControl = 0)
        call EndCrmCall(hApp, hTask, hStep)
 
        call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
          "Unable to add request->clin_event.child_event_list.child_event_list (step_id=1000012)", "9999",
          "Unable to add request->clin_event.child_event_list.child_event_list (step_id=1000012)", pat_pwrform_reply_out)
        go to exit_script
      endif
 
      ; Populate Request -> Clinical Event -> Child Event (Section) -> Child Event (Control)
      set stat = uar_srvsetlong(hChildEventControl, "view_level", 1)
      set stat = uar_srvsetdouble(hChildEventControl, "person_id", dPersonId)
      set stat = uar_srvsetdouble(hChildEventControl, "encntr_id", dEncounterId)
      set stat = uar_srvsetdouble(hChildEventControl, "contributor_system_cd", dContributorSystemCd)
      set stat = uar_srvsetstringfixed(hChildEventControl, "reference_nbr",
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr,
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].reference_nbr_length)
      set stat = uar_srvsetdouble(hChildEventControl, "parent_event_id", powerform_activity->sections[iSectionIndex]->event_id)
      set stat = uar_srvsetdouble(hChildEventControl, "event_class_cd",
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_class_cd)
      set stat = uar_srvsetdouble(hChildEventControl, "event_cd",
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_cd)
      set stat = uar_srvsetdate(hChildEventControl, "event_end_dt_tm", cnvtdatetime(powerform_date_time->new_event_end_dt_tm))
      set stat = uar_srvsetlong(hChildEventControl, "event_end_tz", powerform_date_time->new_event_end_tz)
      set stat = uar_srvsetdouble(hChildEventControl, "task_assay_cd",
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].task_assay_cd)
      set stat = uar_srvsetdouble(hChildEventControl, "record_status_cd", c_record_status_code_active_cd)
      set stat = uar_srvsetshort(hChildEventControl, "authentic_flag", 1)
      set stat = uar_srvsetshort(hChildEventControl, "publish_flag", 1)
      set stat = uar_srvsetstring(hChildEventControl, "event_title_text",
        trim(powerform_activity->sections[iSectionIndex].controls[iControlIndex].discrete_task_assay, 3))
      set stat = uar_srvsetstringfixed(hChildEventControl, "collating_seq",
        nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq),
        powerform_activity->sections[iSectionIndex].controls[iControlIndex].collating_seq_length)
      set stat = uar_srvsetdouble(hChildEventControl, "entry_mode_cd", c_powerforms_entry_mode_cd)
 
      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].clear_value_ind = 1)
        set stat = uar_srvsetdouble(hChildEventControl, "result_status_cd", c_result_status_code_in_error_cd)
      endif

      ; Existing control
      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_id > 0.00)
        set stat = uar_srvsetdouble(hChildEventControl, "event_id",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_id)
        set stat = uar_srvsetdouble(hChildEventControl, "result_status_cd", c_result_status_code_modified_cd)
        set stat = uar_srvsetlong(hChildEventControl, "updt_cnt",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].updt_cnt)
      ; New control
      else
        set stat = uar_srvsetdouble(hChildEventControl, "result_status_cd", c_result_status_code_auth_cd)
      endif

      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_ind > 0)
        set stat = uar_srvsetstring(hChildEventControl, "normal_low",
          build(powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_low))
        set stat = uar_srvsetstring(hChildEventControl, "normal_high",
          build(powerform_activity->sections[iSectionIndex].controls[iControlIndex].normal_high))
      endif

      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_ind > 0)
        set stat = uar_srvsetstring(hChildEventControl, "critical_low",
          build(powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_low))
        set stat = uar_srvsetstring(hChildEventControl, "critical_high",
          build(powerform_activity->sections[iSectionIndex].controls[iControlIndex].critical_high))
      endif
 
      ; Existing Event Prsnl
      for(iEventPrsnlIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_cnt)
        ; Add Request -> Clinical Event -> Child Event (Section) -> Child Event (Control) -> Event Prsnl for existing action
        set hEventPrsnl = uar_srvadditem(hChildEventControl, "event_prsnl_list")
        if(hEventPrsnl = 0)
          call EndCrmCall(hApp, hTask, hStep)
 
          call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
            "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", "9999",
            "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
          go to exit_script
        endif
 
        ; Populate Request -> Clinical Event -> Child Event (Section) -> Child Event (Control) -> Event Prsnl
        set stat = uar_srvsetdouble(hEventPrsnl, "event_prsnl_id",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].event_prsnl_id)
        set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].action_prsnl_id)
        set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].action_type_cd)
        set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].action_status_cd)
        set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].action_dt_tm)
        set stat = uar_srvsetlong(hEventPrsnl, "action_tz",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_prsnl_list[iEventPrsnlIndex].action_tz)
      endfor
 
      ; Add Request -> Clinical Event -> Child Event (Section) -> Child Event (Control) -> Event Prsnl for Modify Action
      set hEventPrsnl = uar_srvadditem(hChildEventControl, "event_prsnl_list")
      if(hEventPrsnl = 0)
        call EndCrmCall(hApp, hTask, hStep)
 
        call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
          "Unable to add request->clin_event.child_event_list.child_event_list.event_prsnl_list (step_id=1000012)",
            "9999",
          "Unable to add request->clin_event.child_event_list.child_event_list.event_prsnl_list (step_id=1000012)",
            pat_pwrform_reply_out)
        go to exit_script
      endif
 
      ; Populate Request -> Clinical Event -> Child Event (Section) -> Child Event (Control) -> Event Prsnl for Modify Action
      set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id", reqinfo->updt_id)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_modify_action_type_cd)
      set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd", c_completed_action_status_cd)
      set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm", cnvtdatetime(powerform_date_time->new_action_dt_tm))
      set stat = uar_srvsetlong(hEventPrsnl, "action_tz", powerform_date_time->new_action_tz)

      ; Existing control
      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_id > 0.00)
        set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_modify_action_type_cd)
      ; New control
      else
        set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_perform_action_type_cd)
      endif
 
      ; Nomenclature Values
      if(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind = 1)
        for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
          declare hStringResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"string_result"))
          if(hStringResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetshort(hStringResult, "ensure_type", 512)
 
          declare hCodedResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"coded_result_list"))
          if(hCodedResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.coded_result_list (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.coded_result_list (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetshort(hCodedResult, "ensure_type", 258)
          set stat = uar_srvsetlong(hCodedResult, "sequence_nbr",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].nomenclature.sequence_nbr)
          set stat = uar_srvsetdouble(hCodedResult, "nomenclature_id",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].nomenclature.nomenclature_id)
          set stat = uar_srvsetstring(hCodedResult, "mnemonic",
            nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex]
              .values[iValueIndex].nomenclature.mnemonic))
          set stat = uar_srvsetstring(hCodedResult, "short_string",
            nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex]
              .values[iValueIndex].nomenclature.short_string))
          set stat = uar_srvsetstring(hCodedResult, "descriptor",
            nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex]
              .values[iValueIndex].nomenclature.descriptor))
          set stat = uar_srvsetdouble(hCodedResult, "unit_of_measure_cd",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].unit_cd)
 
          ; Populate the result unit code on the child event for the control
          set stat = uar_srvsetdouble(hChildEventControl, "result_unit_cd",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].unit_cd)
        endfor
      ; Freetext Values
      elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind = 1)
        for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
          declare hStringResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"string_result"))
          if(hStringResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetstring(hStringResult, "string_result_text",
            nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].text_value))
          set stat = uar_srvsetdouble(hStringResult, "string_result_format_cd", c_result_format_alpha_cd)
        endfor
      ; Numeric Values
      elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind = 1)
        set stat = uar_srvsetdouble(hChildEventControl, "normalcy_cd",
          powerform_activity->sections[iSectionIndex].controls[iControlIndex].normalcy_cd)
 
        for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
          declare hStringResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"string_result"))
          if(hStringResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.string_result (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetstring(hStringResult, "string_result_text",
            nullterm(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].numeric_display))
          set stat = uar_srvsetdouble(hStringResult, "string_result_format_cd", c_result_format_numeric_cd)
          set stat = uar_srvsetdouble(hStringResult, "unit_of_measure_cd",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].unit_cd)
 
          ; Populate the result unit code on the child event for the control
          set stat = uar_srvsetdouble(hChildEventControl, "result_unit_cd",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].unit_cd)
        endfor
      ; RTF Values
      elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind = 1)
        for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
          declare hBlobResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"blob_result"))
          if(hBlobResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.blob_result (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.blob_result (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetdouble(hBlobResult, "succession_type_cd", c_succession_type_interim_cd)
          set stat = uar_srvsetdouble(hBlobResult, "storage_cd", c_storage_blob_cd)
          set stat = uar_srvsetdouble(hBlobResult, "format_cd", c_format_rtf_cd)
 
          declare hBlob = i4 with privateprotect, noconstant(uar_srvadditem(hBlobResult,"blob"))
          if(hBlob = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.blob_result.blob (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.blob_result.blob (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetasis(hBlob, "blob_contents",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].rtf_value,
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].rtf_value_size)
          set stat = uar_srvsetlong(hBlob, "blob_length",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].rtf_value_size)
        endfor
      ; Date/Time Values
      elseif(powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind = 1)
        for(iValueIndex = 1 to powerform_activity->sections[iSectionIndex].controls[iControlIndex].value_cnt)
          declare hDateResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventControl,"date_result"))
          if(hDateResult = 0)
            call EndCrmCall(hApp, hTask, hStep)
 
            call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
              "Unable to add request->clin_event.child_event_list.child_event_list.date_result (step_id=1000012)", "9999",
              "Unable to add request->clin_event.child_event_list.child_event_list.date_result (step_id=1000012)",
              pat_pwrform_reply_out)
            go to exit_script
          endif
 
          set stat = uar_srvsetdate(hDateResult, "result_dt_tm",
            cnvtdatetime(powerform_activity->sections[iSectionIndex].controls[iControlIndex].values[iValueIndex].date_time_value))
          set stat = uar_srvsetshort(hDateResult, "date_type_flag",
            powerform_activity->sections[iSectionIndex].controls[iControlIndex].date_type_flag)
        endfor
      endif
    endfor
  endfor
 
  ; Perform
  set crmstatus = uar_crmperform(hStep)
  if(crmstatus != 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Perform failed (1000012)", "9999",
      "Perform failed (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Get Reply
  declare hReply = i4 with privateprotect, constant(uar_crmgetreply(hStep))
  if(hReply = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Unable to get reply (1000012)", "9999",
      "Unable to get reply (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  declare iRbListSize = i4 with privateprotect, constant(uar_srvgetitemcount(hReply, "rb_list"))
  declare iRbListIndex = i4 with privateprotect, noconstant(0)
 
  if(iRbListSize < 1)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerForm",
      "Reply.rb_list was empty (1000012)", "9999",
      "Reply.rb_list was empty (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  call EndCrmCall(hApp, hTask, hStep)
 
  if(iDebugFlag > 0)
    ; call echorecord(powerform_activity)
 
    call echo(concat("PostPowerForm Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PostPowerForm
 
/*************************************************************************
;  Name: PostPowerFormRTF(null)
;  Description:  Posts a PowerForm RTF Millennium Document
**************************************************************************/
subroutine PostPowerFormRTF(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PostPowerFormRTF Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; Call transaction 1000012 (task 600108, application 600005)
  ; under namespace post_form in subroutine PostPowerFormRTF for c_error_handler
  ; Error record structure - pat_pwrform_reply_out
 
  ; Constants
  set iTransactionTaskId = 600108
  set iStepId = 1000012
  set hApp = 0
  set hTask = 0
  set hStep = 0
  set crmstatus = 0
 
  ; Begin Application
  set crmstatus = uar_crmbeginapp(c_application_id, hApp)
  if(crmstatus != 0 or hApp = 0)
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Begin application failed (application_id=600005)", "9999",
      "Begin application failed (application_id=600005)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Begin Task
  set crmstatus = uar_crmbegintask(hApp, iTransactionTaskId, hTask)
  if(crmstatus != 0 or hTask = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Begin task failed (task_id=600108)", "9999",
      "Begin task failed (task_id=600108)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Begin Request
  set crmstatus = uar_crmbeginreq(hTask, "", iStepId, hStep)
  if(crmstatus != 0 or hStep = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Begin request failed (step_id=1000012)", "9999",
      "Begin request failed (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Get Request
  declare hRequest = i4 with privateprotect, constant(uar_crmgetrequest(hStep))
  if(hRequest = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to get request (step_id=1000012)", "9999",
      "Unable to get request (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request
  set stat = uar_srvsetshort(hRequest, "ensure_type", 2) ; 2 - Modify
 
  ; Get Request -> Clinical Event
  declare hClinEvent = i4 with privateprotect, noconstant(uar_srvgetstruct(hRequest, "clin_event"))
  if(hClinEvent = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to get request->clin_event (step_id=1000012)", "9999",
      "Unable to get request->clin_event (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event
  set stat = uar_srvsetdouble(hClinEvent, "event_id", powerform_activity->document_event_id)
  set stat = uar_srvsetlong(hClinEvent, "view_level", 1)
  set stat = uar_srvsetdouble(hClinEvent, "person_id", dPersonId)
  set stat = uar_srvsetdouble(hClinEvent, "encntr_id", dEncounterId)
  set stat = uar_srvsetdouble(hClinEvent, "contributor_system_cd", dContributorSystemCd)
  set stat = uar_srvsetstringfixed(hClinEvent, "reference_nbr",
    powerform_activity->document_reference_nbr, powerform_activity->document_reference_nbr_length)
  set stat = uar_srvsetdouble(hClinEvent, "parent_event_id", powerform_activity->document_event_id)
  set stat = uar_srvsetdouble(hClinEvent, "event_class_cd", c_mdoc_event_class_cd)
  set stat = uar_srvsetdouble(hClinEvent, "event_cd", powerform_activity->document_event_cd)
  set stat = uar_srvsetdouble(hClinEvent, "event_reltn_cd", c_root_event_reltn_cd)
  set stat = uar_srvsetdate(hClinEvent, "event_end_dt_tm", cnvtdatetime(powerform_date_time->document_new_event_end_dt_tm))
  set stat = uar_srvsetlong(hClinEvent, "event_end_tz", powerform_date_time->document_new_event_end_tz)
  set stat = uar_srvsetdouble(hClinEvent, "record_status_cd", c_record_status_code_active_cd)
  set stat = uar_srvsetdouble(hClinEvent, "result_status_cd", c_result_status_code_modified_cd)
  set stat = uar_srvsetshort(hClinEvent, "authentic_flag", 1)
  set stat = uar_srvsetshort(hClinEvent, "publish_flag", 1)
  set stat = uar_srvsetstring(hClinEvent, "event_title_text", nullterm(trim(powerform_activity->description, 3)))
  set stat = uar_srvsetdouble(hClinEvent, "entry_mode_cd", c_powerforms_entry_mode_cd)
  set stat = uar_srvsetlong(hClinEvent, "updt_cnt", powerform_activity->document_updt_cnt)
 
  declare hEventPrsnl = i4 with privateprotect, noconstant(0)
  declare iEventPrsnlIndex = i4 with privateprotect, noconstant(0)
 
  ; Existing Event Prsnl
  for(iEventPrsnlIndex = 1 to powerform_activity->document_event_prsnl_cnt)
    ; Add Request -> Clinical Event -> Event Prsnl for existing action
    set hEventPrsnl = uar_srvadditem(hClinEvent, "event_prsnl_list")
    if(hEventPrsnl = 0)
      call EndCrmCall(hApp, hTask, hStep)
 
      call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
        "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", "9999",
        "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
      go to exit_script
    endif
 
    ; Populate Request -> Clinical Event -> Event Prsnl
    set stat = uar_srvsetdouble(hEventPrsnl, "event_prsnl_id",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].event_prsnl_id)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_prsnl_id)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_type_cd)
    set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_status_cd)
    set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_dt_tm)
    set stat = uar_srvsetlong(hEventPrsnl, "action_tz",
	    powerform_activity->document_event_prsnl_list[iEventPrsnlIndex].action_tz)
  endfor
 
  ; Add Request -> Clinical Event -> Event Prsnl for Modify Action
  set hEventPrsnl = uar_srvadditem(hClinEvent, "event_prsnl_list")
  if(hEventPrsnl = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", "9999",
      "Unable to add request->clin_event.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Event Prsnl for Modify Action
  set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id", reqinfo->updt_id)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_modify_action_type_cd)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd", c_completed_action_status_cd)
  set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm", cnvtdatetime(powerform_date_time->document_new_action_dt_tm))
  set stat = uar_srvsetlong(hEventPrsnl, "action_tz", powerform_date_time->document_new_action_tz)
 
  ; Add Request -> Clinical Event -> Child Event (Section)
  declare hChildEventType = i4 with privateprotect, noconstant(0)
  declare hChildEventSection = i4 with privateprotect, noconstant(0)
  declare hChildEventControl = i4 with privateprotect, noconstant(0)
 
  set hChildEventType = CreateTypeFromSrvField(hClinEvent, "child_event_list", hRequest, "clin_event")
  if(hChildEventType = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to create type from request->clin_event (step_id=1000012)", "9999",
      "Unable to create type from request->clin_event (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  set hChildEventSection = AddItemFromType(hClinEvent, "child_event_list", hChildEventType)
  if(hChildEventSection = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to add request->clin_event.child_event_list (step_id=1000012)", "9999",
      "Unable to add request->clin_event.child_event_list (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Child Event (Section)
  set stat = uar_srvsetdouble(hChildEventSection, "event_id", powerform_activity->document_child_event_id)
  set stat = uar_srvsetdouble(hChildEventSection, "person_id", dPersonId)
  set stat = uar_srvsetdouble(hChildEventSection, "encntr_id", dEncounterId)
  set stat = uar_srvsetdouble(hChildEventSection, "contributor_system_cd", dContributorSystemCd)
  set stat = uar_srvsetstringfixed(hChildEventSection, "reference_nbr",
    powerform_activity->document_child_reference_nbr, powerform_activity->document_child_reference_nbr_length)
  set stat = uar_srvsetdouble(hChildEventSection, "parent_event_id", powerform_activity->document_event_id)
  set stat = uar_srvsetdouble(hChildEventSection, "event_class_cd", powerform_activity->document_child_event_class_cd)
  set stat = uar_srvsetdouble(hChildEventSection, "event_cd", powerform_activity->document_event_cd)
  set stat = uar_srvsetdouble(hChildEventSection, "event_reltn_cd", c_child_event_reltn_cd)
  set stat = uar_srvsetdate(hChildEventSection, "event_end_dt_tm", cnvtdatetime(powerform_date_time->document_new_event_end_dt_tm))
  set stat = uar_srvsetlong(hChildEventSection, "event_end_tz", powerform_date_time->document_new_event_end_tz)
  set stat = uar_srvsetdouble(hChildEventSection, "record_status_cd", c_record_status_code_active_cd)
  set stat = uar_srvsetdouble(hChildEventSection, "result_status_cd", c_result_status_code_auth_cd)
  set stat = uar_srvsetshort(hChildEventSection, "authentic_flag", 1)
  set stat = uar_srvsetshort(hChildEventSection, "publish_flag", 1)
  set stat = uar_srvsetstringfixed(hChildEventSection, "collating_seq",
    powerform_activity->document_child_collating_seq, powerform_activity->document_child_collating_seq_length)
  set stat = uar_srvsetdouble(hChildEventSection, "entry_mode_cd", c_powerforms_entry_mode_cd)
  set stat = uar_srvsetlong(hChildEventSection, "updt_cnt", powerform_activity->document_child_updt_cnt)
 
  ; Add Request -> Clinical Event -> Child Event (Section) -> Event Prsnl for Perform Action
  set hEventPrsnl = uar_srvadditem(hChildEventSection, "event_prsnl_list")
  if(hEventPrsnl = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", "9999",
      "Unable to add request->clin_event.child_event_list.event_prsnl_list (step_id=1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Child Event (Section) -> Event Prsnl for Perform Action
  set stat = uar_srvsetdouble(hEventPrsnl, "action_prsnl_id", reqinfo->updt_id)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_type_cd", c_perform_action_type_cd)
  set stat = uar_srvsetdouble(hEventPrsnl, "action_status_cd", c_completed_action_status_cd)
  set stat = uar_srvsetdate(hEventPrsnl, "action_dt_tm", cnvtdatetime(powerform_date_time->document_new_action_dt_tm))
  set stat = uar_srvsetlong(hEventPrsnl, "action_tz", powerform_date_time->document_new_action_tz)
 
  ; Add Request -> Clinical Event -> Child Event (Section) -> Blob Result
  declare hBlobResult = i4 with privateprotect, noconstant(uar_srvadditem(hChildEventSection,"blob_result"))
  if(hBlobResult = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to add request->clin_event.child_event_list.blob_result (step_id=1000012)", "9999",
      "Unable to add request->clin_event.child_event_list.blob_result (step_id=1000012)",
      pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Child Event (Section) -> Blob Result
  set stat = uar_srvsetdouble(hBlobResult, "succession_type_cd", c_succession_type_interim_cd)
  set stat = uar_srvsetdouble(hBlobResult, "storage_cd", c_storage_blob_cd)
  set stat = uar_srvsetdouble(hBlobResult, "format_cd", c_format_rtf_cd)
 
  ; Add Request -> Clinical Event -> Child Event (Section) -> Blob Result -> Blob
  declare hBlob = i4 with privateprotect, noconstant(uar_srvadditem(hBlobResult,"blob"))
  if(hBlob = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to add request->clin_event.child_event_list.blob_result.blob (step_id=1000012)", "9999",
      "Unable to add request->clin_event.child_event_list.blob_result.blob (step_id=1000012)",
      pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate Request -> Clinical Event -> Child Event (Section) -> Blob Result -> Blob
  set stat = uar_srvsetasis(hBlob, "blob_contents", powerform_activity->document_blob, powerform_activity->document_blob_length)
  set stat = uar_srvsetlong(hBlob, "blob_length", powerform_activity->document_blob_length)
 
  ; Perform
  set crmstatus = uar_crmperform(hStep)
  if(crmstatus != 0)
    call EndCrmCall(hApp, hTask, hStep)

    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Perform failed (1000012)", "9999",
      "Perform failed (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Get Reply
  declare hReply = i4 with privateprotect, constant(uar_crmgetreply(hStep))
  if(hReply = 0)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Unable to get reply (1000012)", "9999",
      "Unable to get reply (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  declare iRbListSize = i4 with privateprotect, constant(uar_srvgetitemcount(hReply, "rb_list"))
  declare iRbListIndex = i4 with privateprotect, noconstant(0)
 
  if(iRbListSize < 1)
    call EndCrmCall(hApp, hTask, hStep)
 
    call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
      "Reply.rb_list was empty (1000012)", "9999",
      "Reply.rb_list was empty (1000012)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  for(iRbListIndex = 0 to value(iRbListSize - 1))
    declare hRb = i4 with privateprotect, noconstant(uar_srvgetitem(hReply, "rb_list", iRbListIndex))
    if(hRb = 0)
      call EndCrmCall(hApp, hTask, hStep)
 
      call ErrorHandler2(c_error_handler, "F", "PostPowerFormRTF",
        "Unable to get reply.rb_list (1000012)", "9999",
        "Unable to get reply.rb_list (1000012)", pat_pwrform_reply_out)
      go to exit_script
    endif
 
    declare dRbEventId = f8 with privateprotect, noconstant(uar_srvgetdouble(hRb, "event_id"))
    declare sRbReferenceNumber = vc with privateprotect, noconstant(nullterm(trim(uar_srvgetstringptr(hRb, "reference_nbr"), 3)))
    declare dRbEventCd = f8 with privateprotect, noconstant(uar_srvgetdouble(hRb, "event_cd"))
 
    ; The rb is for the parent
    if (powerform_activity->document_reference_nbr = sRbReferenceNumber
      and powerform_activity->document_event_cd = dRbEventCd)
      set powerform_activity->document_event_id = dRbEventId
    ; The rb is for the child
    elseif (powerform_activity->document_child_reference_nbr = sRbReferenceNumber
      and powerform_activity->document_event_cd = dRbEventCd)
      set powerform_activity->document_child_event_id = dRbEventId
    endif
  endfor
 
  call EndCrmCall(hApp, hTask, hStep)
 
  if(iDebugFlag > 0)
    ; call echorecord(powerform_activity)
 
    call echo(concat("PostPowerFormRTF Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PostPowerFormRTF
 
/*************************************************************************
;  Name: EnsureEvents(null) = null
;  Description:  Call dcp_events_ensured (600345)
**************************************************************************/
subroutine EnsureEvents(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("EnsureEvents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  free record 600345_req
  record 600345_req (
    1 elist [*]
      2 event_id = f8
      2 order_id = f8
      2 task_id = f8
    1 charge_details
      2 provider_id = f8
      2 location_cd = f8
      2 diagnosis [*]
        3 nomen_id = f8
        3 source_string = vc
        3 source_identifier = vc
        3 priority = i4
      2 cpt_modifier [*]
        3 modifier_cd = f8
        3 display = vc
        3 description = vc
        3 priority = i4
      2 duration_mins = i4
      2 research_acct_id = f8
      2 quantity = i4
  )
 
  free record 600345_rep
  record 600345_rep (
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c15
        3 operationstatus = c1
        3 targetobjectname = c15
        3 targetobjectvalue = vc
  )
 
  declare iEventListSize = i4 with privateprotect, noconstant(0)
  set iEventListSize += 1
  set stat = alterlist(600345_req->elist, iEventListSize)
  set 600345_req->elist[iEventListSize].event_id = powerform_activity->event_id
  set 600345_req->elist[iEventListSize].task_id = powerform_activity->task_id
 
  for(iSectionIndex = 1 to powerform_activity->section_cnt)
    set iEventListSize += 1
    set stat = alterlist(600345_req->elist, iEventListSize)
    set 600345_req->elist[iEventListSize].event_id = powerform_activity->sections[iSectionIndex].event_id
    set 600345_req->elist[iEventListSize].task_id = powerform_activity->task_id
 
    for(iControlIndex = 1 to powerform_activity->sections[iSectionIndex].control_cnt)
      set iEventListSize += 1
      set stat = alterlist(600345_req->elist, iEventListSize)
      set 600345_req->elist[iEventListSize].event_id = powerform_activity->sections[iSectionIndex].controls[iControlIndex].event_id
      set 600345_req->elist[iEventListSize].task_id = powerform_activity->task_id
    endfor
  endfor
 
  if(powerform_activity->document_event_id > 0.0)
    set iEventListSize += 1
    set stat = alterlist(600345_req->elist, iEventListSize)
    set 600345_req->elist[iEventListSize].event_id = powerform_activity->document_event_id
    set 600345_req->elist[iEventListSize].task_id = powerform_activity->task_id
    set iEventListSize += 1
    set stat = alterlist(600345_req->elist, iEventListSize)
    set 600345_req->elist[iEventListSize].event_id = powerform_activity->document_child_event_id
    set 600345_req->elist[iEventListSize].task_id = powerform_activity->task_id
  endif
 
  set iTransactionTaskId = 600108
  set iStepId = 600345
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 600345_req, "REC", 600345_rep)
 
  if(600345_rep->status_data.status != "S")
    ; call echorecord(600345_req)
    ; call echorecord(600345_rep)
    free record 600345_req
    free record 600345_rep
 
    call ErrorHandler2(c_error_handler, "F", "EnsureEvents",
      "Call to dcp_events_ensured failed (step_id=600345)", "9999",
      "Call to dcp_events_ensured failed (step_id=600345)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(600345_req)
    ; call echorecord(600345_rep)
 
    call echo(concat("EnsureEvents Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  free record 600345_req
  free record 600345_rep
end ; End subroutine EnsureEvents
 
/*************************************************************************
;  Name: UpdateFormsActivity(null) = null
;  Description:  Call dcp_upd_forms_activity (600353)
**************************************************************************/
subroutine UpdateFormsActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("UpdateFormsActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set 600353_req->form_activity_id = dFormId
  set 600353_req->form_reference_id = powerform_activity->dcp_forms_ref_id
  set 600353_req->person_id = dPersonId
  set 600353_req->encntr_id = dEncounterId
  set 600353_req->task_id = powerform_activity->task_id
  set 600353_req->form_dt_tm = powerform_activity->form_dt_tm
  set 600353_req->form_tz = powerform_activity->form_tz
  set 600353_req->form_status_cd = c_result_status_code_modified_cd
  set 600353_req->flags = 2
  set 600353_req->description = nullterm(trim(powerform_activity->description, 3))
  set 600353_req->version_dt_tm = dcp_get_dcp_form_600373_req->version_dt_tm
  set 600353_req->reference_nbr = trim(powerform_activity->reference_nbr)
 
  ; Components
  declare iComponentSize = i4 with privateprotect, constant(size(dcp_get_form_activity_600354_rep->comp, 5))
  set stat = alterlist(600353_req->component, iComponentSize)
  for(i = 1 to iComponentSize)
    set 600353_req->component[i].parent_entity_name = dcp_get_form_activity_600354_rep->comp[i].parent_entity_name
    set 600353_req->component[i].parent_entity_id = dcp_get_form_activity_600354_rep->comp[i].parent_entity_id
    set 600353_req->component[i].component_cd = dcp_get_form_activity_600354_rep->comp[i].component_cd
  endfor
 
  ; Populate Prsnl
  set stat = alterlist(600353_req->prsnl, 1)
  set 600353_req->prsnl[1].prsnl_ft = trim(sUserFullname, 3)
  set 600353_req->prsnl[1].activity_dt_tm = powerform_date_time->new_action_dt_tm
 
  set iTransactionTaskId = 600701
  set iStepId = 600353
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 600353_req, "REC", 600353_rep)
 
  if(600353_rep->status_data.status != "S")
    ; call echorecord(600353_req)
    ; call echorecord(600353_rep)
    call ErrorHandler2(c_error_handler, "F", "UpdateFormsActivity",
      "Call to dcp_upd_forms_activity failed (step_id=600353)", "9999",
      "Call to dcp_upd_forms_activity failed (step_id=600353)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(600353_req)
    ; call echorecord(600353_rep)
 
    call echo(concat("UpdateFormsActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine UpdateFormsActivity
 
/*************************************************************************
;  Name: UpdateFormActivityComponent(null) = null
;  Description:  Call dcp_upd_form_activity_comp (600416)
**************************************************************************/
subroutine UpdateFormActivityComponent(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("UpdateFormActivityComponent Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set stat = alterlist(dcp_upd_form_activity_comp_600416_req->req_list, 1)
  set dcp_upd_form_activity_comp_600416_req->req_list[1].dcp_forms_activity_id = dFormId
  set dcp_upd_form_activity_comp_600416_req->req_list[1].component_cd = c_text_rendition_comp_cd
  set dcp_upd_form_activity_comp_600416_req->req_list[1].parent_entity_name = "CLINICAL_EVENT"
  set dcp_upd_form_activity_comp_600416_req->req_list[1].parent_entity_id = powerform_activity->document_event_id
  set dcp_upd_form_activity_comp_600416_req->req_list[1].reference_nbr = trim(powerform_activity->document_reference_nbr)
 
  set iTransactionTaskId = 600701
  set iStepId = 600416
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC",
    dcp_upd_form_activity_comp_600416_req, "REC", dcp_upd_form_activity_comp_600416_rep)
 
  if(dcp_upd_form_activity_comp_600416_rep->status_data.status != "S")
    ; call echorecord(dcp_upd_form_activity_comp_600416_req)
    ; call echorecord(dcp_upd_form_activity_comp_600416_rep)
    call ErrorHandler2(c_error_handler, "F", "UpdateFormActivityComponent",
      "Call to dcp_upd_forms_activity_comp failed (step_id=600416)", "9999",
      "Call to dcp_upd_forms_activity_comp failed (step_id=600416)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(dcp_upd_form_activity_comp_600416_req)
    ; call echorecord(dcp_upd_form_activity_comp_600416_rep)
 
    call echo(concat("UpdateFormActivityComponent Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine UpdateFormActivityComponent
 
/*************************************************************************
;  Name: CheckPrivileges(null) = null
;  Description: Checks privileges
**************************************************************************/
subroutine CheckPrivileges(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("CheckPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; Check privileges for the PowerForm event code
  set MSVC_CheckPrivileges_680501_req->patient_user_criteria.user_id = dUserId
	set stat = alterlist(MSVC_CheckPrivileges_680501_req->event_privileges.event_code_level.event_codes, 1)
	set MSVC_CheckPrivileges_680501_req->event_privileges.event_code_level.event_codes[1].event_cd = powerform_activity->event_cd
	set MSVC_CheckPrivileges_680501_req->event_privileges.event_code_level.view_results_ind = 1
  set MSVC_CheckPrivileges_680501_req->event_privileges.event_code_level.add_documentation_ind = 1
 
  set iTransactionTaskId = 3202004
  set iStepId = 680501
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", MSVC_CheckPrivileges_680501_req, "REC", MSVC_CheckPrivileges_680501_rep)
 
  if(MSVC_CheckPrivileges_680501_rep->transaction_status.success_ind = 0
    or MSVC_CheckPrivileges_680501_rep->event_privileges.view_results.success_ind = 0
    or MSVC_CheckPrivileges_680501_rep->event_privileges.add_documentation.success_ind = 0)
    ; call echorecord(MSVC_CheckPrivileges_680501_req)
    ; call echorecord(MSVC_CheckPrivileges_680501_rep)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_req)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_rep)
    free record MSVC_CheckPrivileges_680501_req
    free record MSVC_CheckPrivileges_680501_rep
    free record MSVC_GetPrivilegesByCodes_680500_req
    free record MSVC_GetPrivilegesByCodes_680500_rep
 
    call ErrorHandler2(c_error_handler, "F", "CheckPrivileges",
      "Call to MSVC_CheckPrivileges failed or not all privileges were granted (step_id=680501)", "9999",
      "Call to MSVC_CheckPrivileges failed or not all privileges were granted (step_id=680501)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Check privileges by codes
  set MSVC_GetPrivilegesByCodes_680500_req->patient_user_criteria.user_id = dUserId
 
  declare iPrivilegeSize = i4 with privateprotect, noconstant(2)
	set stat = alterlist(MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges, iPrivilegeSize)
	set MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges[1].privilege_cd =
    c_privilege_document_validation_section_cd
	set MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges[2].privilege_cd =
    c_privilege_sign_powerform_cd
 
  if(powerform_activity->components.social_history_ind = 1)
    set iPrivilegeSize += 2
    set stat = alterlist(MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges, iPrivilegeSize)
    set MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges[3].privilege_cd =
      c_privilege_view_social_history_cd
    set MSVC_GetPrivilegesByCodes_680500_req->privilege_criteria.privileges[4].privilege_cd =
      c_privilege_update_social_history_cd
  endif
 
  set iTransactionTaskId = 3202004
  set iStepId = 680500
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", MSVC_GetPrivilegesByCodes_680500_req, "REC", MSVC_GetPrivilegesByCodes_680500_rep)
 
  if(MSVC_GetPrivilegesByCodes_680500_rep->transaction_status.success_ind = 0
    or size(MSVC_GetPrivilegesByCodes_680500_rep->privileges, 5) < iPrivilegeSize)
    ; call echorecord(MSVC_CheckPrivileges_680501_req)
    ; call echorecord(MSVC_CheckPrivileges_680501_rep)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_req)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_rep)
    free record MSVC_CheckPrivileges_680501_req
    free record MSVC_CheckPrivileges_680501_rep
    free record MSVC_GetPrivilegesByCodes_680500_req
    free record MSVC_GetPrivilegesByCodes_680500_rep
 
    call ErrorHandler2(c_error_handler, "F", "CheckPrivileges",
      "Call to MSVC_GetPrivilegesByCodes failed (step_id=680500)", "9999",
      "Call to MSVC_GetPrivilegesByCodes failed (step_id=680500)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  declare iPrivilegeGrantedCount = i4 with privateprotect, noconstant(iPrivilegeSize)
  for(i = 1 to iPrivilegeSize)
    if(MSVC_GetPrivilegesByCodes_680500_rep->privileges[i].default[1].granted_ind = 0)
      set iPrivilegeGrantedCount -= 1
    endif
  endfor
 
  if(iPrivilegeGrantedCount != iPrivilegeSize)
    ; call echorecord(MSVC_CheckPrivileges_680501_req)
    ; call echorecord(MSVC_CheckPrivileges_680501_rep)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_req)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_rep)
    free record MSVC_CheckPrivileges_680501_req
    free record MSVC_CheckPrivileges_680501_rep
    free record MSVC_GetPrivilegesByCodes_680500_req
    free record MSVC_GetPrivilegesByCodes_680500_rep
 
    call ErrorHandler2(c_error_handler, "F", "CheckPrivileges",
      "Not all privileges were granted (step_id=680500)", "9999",
      "Not all privileges were granted (step_id=680500)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(MSVC_CheckPrivileges_680501_req)
    ; call echorecord(MSVC_CheckPrivileges_680501_rep)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_req)
    ; call echorecord(MSVC_GetPrivilegesByCodes_680500_rep)
 
    call echo(concat("CheckPrivileges Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine CheckPrivileges
 
/*************************************************************************
;  Name: GetSocialHistoryReference(null) = null with protect
;  Description:  Get the social history reference by calling shx_get_social_history_def (601050)
**************************************************************************/
subroutine GetSocialHistoryReference(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetSocialHistoryReference Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set shx_get_social_history_def_601050_req->all_categories_ind = 1
 
  set iTransactionTaskId = 601029
  set iStepId = 601050
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", shx_get_social_history_def_601050_req, "REC", shx_get_social_history_def_601050_rep)
 
  if(shx_get_social_history_def_601050_rep->status_data.status != "S")
    ; call echorecord(shx_get_social_history_def_601050_req)
    ; call echorecord(shx_get_social_history_def_601050_rep)
    free record shx_get_social_history_def_601050_req
    free record shx_get_social_history_def_601050_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetSocialHistoryReference",
      "Call to shx_get_social_history_def (step_id=601050)", "9999",
      "Call to shx_get_social_history_def (step_id=601050)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(shx_get_social_history_def_601050_req)
    ; call echorecord(shx_get_social_history_def_601050_rep)
 
    call echo(concat("GetSocialHistoryReference Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetSocialHistoryReference
 
/*************************************************************************
;  Name: GetPreviousSocialHistoryActivity(null) = null with protect
;  Description:  Get the previous social history activity by calling shx_get_activity (601052)
**************************************************************************/
subroutine GetPreviousSocialHistoryActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetPreviousSocialHistoryActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set shx_get_activity_previous_601052_req->person_id = dPersonId
  set shx_get_activity_previous_601052_req->prsnl_id = dUserId
  set stat = alterlist(shx_get_activity_previous_601052_req->category_qual,
    size(shx_get_social_history_def_601050_rep->category_qual, 5) + 1)
  for(i = 1 to size(shx_get_social_history_def_601050_rep->category_qual, 5))
    set shx_get_activity_previous_601052_req->category_qual[i].shx_category_ref_id =
      shx_get_social_history_def_601050_rep->category_qual[i].shx_category_ref_id
  endfor
 
  set shx_get_activity_previous_601052_req->category_qual[size(shx_get_activity_previous_601052_req->category_qual, 5)]
    .shx_category_ref_id = 0.0
 
  set iTransactionTaskId = 601029
  set iStepId = 601052
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", shx_get_activity_previous_601052_req, "REC", shx_get_activity_previous_601052_rep)
 
  if(shx_get_activity_previous_601052_rep->status_data.status != "S")
    ; call echorecord(shx_get_activity_previous_601052_req)
    ; call echorecord(shx_get_activity_previous_601052_rep)
    free record shx_get_activity_previous_601052_req
    free record shx_get_activity_previous_601052_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetPreviousSocialHistoryActivity",
      "Call to shx_get_activity (step_id=601052)", "9999",
      "Call to shx_get_activity (step_id=601052)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(shx_get_activity_previous_601052_req)
    ; call echorecord(shx_get_activity_previous_601052_rep)
 
    call echo(concat("GetPreviousSocialHistoryActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetPreviousSocialHistoryActivity
 
/*************************************************************************
;  Name: GetNewSocialHistoryActivity(null) = null with protect
;  Description:  Get the new social history activity by calling shx_get_activity (601052)
**************************************************************************/
subroutine GetNewSocialHistoryActivity(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetNewSocialHistoryActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  set shx_get_activity_new_601052_req->person_id = dPersonId
  set shx_get_activity_new_601052_req->prsnl_id = dUserId
  set stat = alterlist(shx_get_activity_new_601052_req->category_qual,
    size(shx_get_social_history_def_601050_rep->category_qual, 5) + 1)
  for(i = 1 to size(shx_get_social_history_def_601050_rep->category_qual, 5))
    set shx_get_activity_new_601052_req->category_qual[i].shx_category_ref_id =
      shx_get_social_history_def_601050_rep->category_qual[i].shx_category_ref_id
  endfor
 
  set shx_get_activity_new_601052_req->category_qual[size(shx_get_activity_new_601052_req->category_qual, 5)]
    .shx_category_ref_id = 0.0
 
  set iTransactionTaskId = 601029
  set iStepId = 601052
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", shx_get_activity_new_601052_req, "REC", shx_get_activity_new_601052_rep)
 
  if(shx_get_activity_new_601052_rep->status_data.status != "S")
    ; call echorecord(shx_get_activity_new_601052_req)
    ; call echorecord(shx_get_activity_new_601052_rep)
    free record shx_get_activity_new_601052_req
    free record shx_get_activity_new_601052_rep
 
    call ErrorHandler2(c_error_handler, "F", "GetNewSocialHistoryActivity",
      "Call to shx_get_activity (step_id=601052)", "9999",
      "Call to shx_get_activity (step_id=601052)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(shx_get_activity_new_601052_req)
    ; call echorecord(shx_get_activity_new_601052_rep)
 
    call echo(concat("GetNewSocialHistoryActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine GetNewSocialHistoryActivity
 
/*************************************************************************
;  Name: WriteSocialHistory(null) = null with protect
;  Description:  Write social history information by calling shx_ens_activity (601051)
**************************************************************************/
subroutine WriteSocialHistory(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("WriteSocialHistory Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
    ; call echorecord(social_history)
  endif
 
  call GetPreviousSocialHistoryActivity(null)
 
  set shx_ens_activity_601051_req->organization_id = dOrganizationId
  set shx_ens_activity_601051_req->person_id = dPersonId
 
  declare iCategoryIndex = i4 with privateprotect, noconstant(0)
  declare iActivityIndex = i4 with privateprotect, noconstant(0)
  declare iElementIndex = i4 with privateprotect, noconstant(0)
  declare iValueIndex = i4 with privateprotect, noconstant(0)
  declare iResponseIndex = i4 with privateprotect, noconstant(0)
  declare iAlphaResponseIndex = i4 with privateprotect, noconstant(0)
  declare iExistingUnableToObtainIndex = i2 with privateprotect, noconstant(0)
  declare iExistingDetailIndex = i2 with privateprotect, noconstant(0)
 
  ; Determine if there are any existing active rows
  set iExistingUnableToObtainIndex = locateval(iExistingUnableToObtainIndex, 1,
    size(shx_get_activity_previous_601052_rep->activity_qual, 5),
    c_shx_activity_status_active_cd,
    shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].status_cd,
    "PERSON",
    shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].type_mean)
 
  set iExistingDetailIndex = locateval(iExistingDetailIndex, 1, size(shx_get_activity_previous_601052_rep->activity_qual, 5),
    c_shx_activity_status_active_cd,
    shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].status_cd,
    "DETAIL",
    shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean)
 
  ; Has existing unable to obtain
  if(iExistingUnableToObtainIndex > 0)
    ; Has existing unable to obtain and unable to obtain social history was provided
    if(social_history->unable_to_obtain_provided_ind = 1)
      ; Update the existing unable to obtain
      set iActivityIndex += 1
      set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "MODIFY"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_category_ref_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_category_def_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_activity_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_activity_group_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean =
        trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].type_mean, 3)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind = social_history->unable_to_obtain_ind
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
        cnvtdatetime(powerform_date_time->new_action_dt_tm)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].updt_cnt = 0
 
      ; Remove any existing details
      for(iExistingDetailIndex = 1 to size(shx_get_activity_previous_601052_rep->activity_qual, 5))
        if(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_id > 0.00
          and shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].status_cd = c_shx_activity_status_active_cd
          and shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean = "DETAIL")
          set iActivityIndex += 1
          set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "REMOVE"
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_ref_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_def_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_group_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean =
            trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean, 3)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].unable_to_obtain_ind
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].updt_cnt =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].updt_cnt
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].assessment_cd =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].assessment_cd
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary_text_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary_text_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
            trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary, 3)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_comment_id = 0
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
            cnvtdatetime(powerform_date_time->new_action_dt_tm)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
        endif
      endfor
    ; Has existing unable to obtain and social history answers were be provided
    elseif(social_history->element_answered_cnt > 0)
      ; Update the existing unable to obtain to 0
      set iActivityIndex += 1
      set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "MODIFY"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_category_ref_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_category_def_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_activity_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id =
        shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].shx_activity_group_id
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean =
        trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingUnableToObtainIndex].type_mean, 3)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind = 0
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
        cnvtdatetime(powerform_date_time->new_action_dt_tm)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].updt_cnt = 0
 
      for(iCategoryIndex = 1 to social_history->category_cnt)
        ; Only process categories whose elements have answers
        if(social_history->categories[iCategoryIndex].element_answered_cnt > 0)
          set iResponseIndex = 0
          set iAlphaResponseIndex = 0
 
          ; Look for the category
          set iExistingDetailIndex = locateval(iExistingDetailIndex, 1,
            size(shx_get_activity_previous_601052_rep->activity_qual, 5),
            c_shx_activity_status_active_cd,
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].status_cd,
            "DETAIL",
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean,
            social_history->categories[iCategoryIndex].shx_category_def_id,
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_def_id)
 
          ; FUTURE If the category exists then update it
          if(iExistingDetailIndex > 0)
            call ErrorHandler2(c_error_handler, "F", "WriteSocialHistory",
              "Cannot currently modify social history categories on post", "9999",
              "Cannot currently modify social history categories on post", pat_pwrform_reply_out)
            go to exit_script
          else
            set iActivityIndex += 1
            set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "CREATE"
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id = 0.00
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id = -1.00
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean = "DETAIL"
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
              social_history->categories[iCategoryIndex].shx_category_ref_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
              social_history->categories[iCategoryIndex].shx_category_def_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
              cnvtdatetime(powerform_date_time->new_action_dt_tm)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
              nullterm(trim(BuildSocialHistoryDetailSummary(iCategoryIndex), 3))
            call PopulateSocialHistoryElements(iCategoryIndex, iActivityIndex)
          endif
        endif ; No existing data and no answers were provided for this social history category
      endfor ; No existing data - social history categories
    else ; Has existing unable to obtain and no social history input was provided
      if(iDebugFlag > 0)
        call echo("No social history information will be updated.")
 
        call echo(concat("WriteSocialHistory Runtime: ",
          trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
          " seconds"))
      endif
 
      return
    endif ; Has existing unable to obtain and no social history input was provided
  ; Has existing social history answers
  elseif(iExistingDetailIndex > 0)
    ; Has existing social history answers and unable to obtain social history was provided
    if(social_history->unable_to_obtain_provided_ind = 1)
      ; Delete all existing social history answers
      for(iExistingDetailIndex = 1 to size(shx_get_activity_previous_601052_rep->activity_qual, 5))
        if(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_id > 0.00
          and shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].status_cd = c_shx_activity_status_active_cd
          and shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean = "DETAIL")
          set iActivityIndex += 1
          set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "REMOVE"
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_ref_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_def_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_group_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean =
            trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean, 3)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].unable_to_obtain_ind
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].updt_cnt =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].updt_cnt
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].assessment_cd =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].assessment_cd
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary_text_id =
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary_text_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
            trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary, 3)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_comment_id = 0
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
            cnvtdatetime(powerform_date_time->new_action_dt_tm)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
        endif
      endfor
 
      ; Create unable to obtain
      set iActivityIndex += 1
      set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "CREATE"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id = -1.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean = "PERSON"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind = social_history->unable_to_obtain_ind
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
        cnvtdatetime(powerform_date_time->new_action_dt_tm)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
    ; Has existing social history answers and social history answers were be provided
    elseif(social_history->element_answered_cnt > 0)
      for(iCategoryIndex = 1 to social_history->category_cnt)
        ; Only process categories whose elements have answers
        if(social_history->categories[iCategoryIndex].element_answered_cnt > 0)
          set iResponseIndex = 0
          set iAlphaResponseIndex = 0
 
          ; Look for the category
          set iExistingDetailIndex = locateval(iExistingDetailIndex, 1,
            size(shx_get_activity_previous_601052_rep->activity_qual, 5),
            c_shx_activity_status_active_cd,
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].status_cd,
            "DETAIL",
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean,
            social_history->categories[iCategoryIndex].shx_category_def_id,
            shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_def_id)
 
          ; If the category exists then remove it
          if(iExistingDetailIndex > 0)
            set iActivityIndex += 1
            set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "REMOVE"
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_ref_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_category_def_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].shx_activity_group_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean =
              trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].type_mean, 3)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].unable_to_obtain_ind
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].updt_cnt =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].updt_cnt
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].assessment_cd =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].assessment_cd
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary_text_id =
              shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary_text_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
              trim(shx_get_activity_previous_601052_rep->activity_qual[iExistingDetailIndex].detail_summary, 3)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_comment_id = 0
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
              cnvtdatetime(powerform_date_time->new_action_dt_tm)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
          else
            set iActivityIndex += 1
            set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "CREATE"
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id = 0.00
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id = -1.00
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean = "DETAIL"
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
              social_history->categories[iCategoryIndex].shx_category_ref_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
              social_history->categories[iCategoryIndex].shx_category_def_id
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
              cnvtdatetime(powerform_date_time->new_action_dt_tm)
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
            set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
              nullterm(trim(BuildSocialHistoryDetailSummary(iCategoryIndex), 3))
            call PopulateSocialHistoryElements(iCategoryIndex, iActivityIndex)
          endif
        endif ; No existing data and no answers were provided for this social history category
      endfor ; No existing data - social history categories
 
      ; Update answered elements that are existing
      ; Create answered elements that are new
      set dummy = 0
    else ; Has existing social history answers and no social history input was provided
      if(iDebugFlag > 0)
        call echo("No social history information will be updated.")
 
        call echo(concat("WriteSocialHistory Runtime: ",
          trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
          " seconds"))
      endif
 
      return
    endif ; Has existing social history answers and no social history input was provided
  ; No existing data
  else
    ; No existing data and unable to obtain social history was provided
    if(social_history->unable_to_obtain_provided_ind = 1)
      set iActivityIndex += 1
      set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "CREATE"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id = 0.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id = -1.00
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean = "PERSON"
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].unable_to_obtain_ind = social_history->unable_to_obtain_ind
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
        cnvtdatetime(powerform_date_time->new_action_dt_tm)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
    ; No existing data and social history answers are provided
    elseif(social_history->element_answered_cnt > 0)
      for(iCategoryIndex = 1 to social_history->category_cnt)
        ; Only process categories whose elements have answers
        if(social_history->categories[iCategoryIndex].element_answered_cnt > 0)
          set iActivityIndex += 1
          set iResponseIndex = 0
          set iAlphaResponseIndex = 0
          set stat = alterlist(shx_ens_activity_601051_req->activity_qual, iActivityIndex)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].ensure_type = "CREATE"
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_ref_id =
            social_history->categories[iCategoryIndex].shx_category_ref_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_category_def_id =
            social_history->categories[iCategoryIndex].shx_category_def_id
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_id = 0.00
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].shx_activity_group_id = -1.00
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].type_mean = "DETAIL"
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_dt_tm =
            cnvtdatetime(powerform_date_time->new_action_dt_tm)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].perform_tz = iEncounterTimeZoneIndex
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].detail_summary =
            nullterm(trim(BuildSocialHistoryDetailSummary(iCategoryIndex), 3))
          call PopulateSocialHistoryElements(iCategoryIndex, iActivityIndex)
        endif ; No existing data and no answers were provided for this social history category
      endfor ; No existing data - social history categories
    else ; No existing data and no social history input are provided
      if(iDebugFlag > 0)
        call echo("No social history information will be updated.")
 
        call echo(concat("WriteSocialHistory Runtime: ",
          trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
          " seconds"))
      endif
 
      return
    endif ; No existing data and no social history input are provided
  endif ; No existing data
 
  set iTransactionTaskId = 601030
  set iStepId = 601051
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId,
    "REC", shx_ens_activity_601051_req, "REC", shx_ens_activity_601051_rep)
 
  if(shx_ens_activity_601051_rep->status_data.status != "S")
    ; call echorecord(shx_ens_activity_601051_req)
    ; call echorecord(shx_ens_activity_601051_rep)
    free record shx_ens_activity_601051_req
    free record shx_ens_activity_601051_rep
 
    call ErrorHandler2(c_error_handler, "F", "WriteSocialHistory",
      "Call to shx_ens_activity (step_id=601051)", "9999",
      "Call to shx_ens_activity (step_id=601051)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  if(iDebugFlag > 0)
    ; call echorecord(shx_ens_activity_601051_req)
    ; call echorecord(shx_ens_activity_601051_rep)
 
    call echo(concat("WriteSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ;End subroutine WriteSocialHistory
 
/*************************************************************************
;  Name: BuildSocialHistoryDetailSummary(iCategoryIndex = i4) = vc
;  Description:  Builds the social history detail summary
**************************************************************************/
subroutine BuildSocialHistoryDetailSummary(iCategoryIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("BuildSocialHistoryDetailSummary Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare sDetailSummary = vc with privateprotect, noconstant("")
  declare iElementIndex = i4 with privateprotect, noconstant(0)
  declare iValueIndex  = i4 with privateprotect, noconstant(0)
  declare iResponseIndex = i4 with privateprotect, noconstant(0)
  declare iAlphaResponseIndex = i4 with privateprotect, noconstant(0)
 
  for(iElementIndex = 1 to social_history->categories[iCategoryIndex].element_cnt)
    ; Only process elements with values
    if(social_history->categories[iCategoryIndex].elements[iElementIndex].value_cnt > 0)
      set iResponseIndex += 1
      set iAlphaResponseIndex = 0
 
      ; FUTURE Support suffix response labels
 
      if(iResponseIndex = 1)
        set sDetailSummary = notrim(concat(notrim(sDetailSummary),
          trim(social_history->categories[iCategoryIndex].elements[iElementIndex].response_label, 3)
        ))
      else
        set sDetailSummary = notrim(concat(notrim(sDetailSummary), "  ",
          trim(social_history->categories[iCategoryIndex].elements[iElementIndex].response_label, 3)
        ))
      endif
 
      ; Nomenclature value type
      if(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.nomenclature_ind = 1)
 
        for(iValueIndex = 1 to social_history->categories[iCategoryIndex].elements[iElementIndex].value_cnt)
          set iAlphaResponseIndex += 1
          ; FUTURE Support "other_text" field for alpha responses
 
          if(iAlphaResponseIndex = 1)
            set sDetailSummary = notrim(concat(notrim(sDetailSummary), " ",
              trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[iValueIndex]
                .nomenclature.short_string, 3)
            ))
          else
            set sDetailSummary = notrim(concat(notrim(sDetailSummary), ", ",
              trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[iValueIndex]
                .nomenclature.short_string, 3)
            ))
          endif
        endfor
      ; Text
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.freetext_ind = 1)
 
        set sDetailSummary = notrim(concat(notrim(sDetailSummary), " ",
          trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].text_value, 3)
        ))
      ; Numeric
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.numeric_ind = 1)
 
        set sDetailSummary = notrim(concat(notrim(sDetailSummary), " ",
          notrim(GetSocialHistoryModifierFlagDisplay(
            social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].modifier_flag)),
          trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].numeric_display, 3),
          GetUnitDisplay(social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].unit_cd)
        ))
      ; Date
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.date_time_ind = 1)
 
        ; FUTURE Support date values
        set dummy = 0
      endif
 
      set sDetailSummary = notrim(concat(notrim(sDetailSummary), "."))
    endif
  endfor
 
  if(iDebugFlag > 0)
    call echo(build("sDetailSummary  ->", sDetailSummary))
    call echo(concat("BuildSocialHistoryDetailSummary Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sDetailSummary)
end ; End subroutine BuildSocialHistoryDetailSummary
 
/*************************************************************************
;  Name: PopulateSocialHistoryElements(iCategoryIndex = i4, iActivityIndex = i4) = null
;  Description:  Builds the social history detail summary
**************************************************************************/
subroutine PopulateSocialHistoryElements(iCategoryIndex, iActivityIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PopulateSocialHistoryElements Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare iElementIndex = i4 with privateprotect, noconstant(0)
  declare iValueIndex = i4 with privateprotect, noconstant(0)
  declare iResponseIndex = i4 with privateprotect, noconstant(0)
  declare iAlphaResponseIndex = i4 with privateprotect, noconstant(0)
 
  for(iElementIndex = 1 to social_history->categories[iCategoryIndex].element_cnt)
    ; Only process elements with values
    if(social_history->categories[iCategoryIndex].elements[iElementIndex].value_cnt > 0)
      set iResponseIndex += 1
      set iAlphaResponseIndex = 0
      set stat = alterlist(shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual, iResponseIndex)
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
        .shx_response_id = -iResponseIndex
      set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
        .task_assay_cd = social_history->categories[iCategoryIndex].elements[iElementIndex].task_assay_cd
 
      ; Nomenclature value type
      if(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.nomenclature_ind = 1)
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_type = "ALPHA"
        for(iValueIndex = 1 to social_history->categories[iCategoryIndex].elements[iElementIndex].value_cnt)
          set iAlphaResponseIndex += 1
          set stat = alterlist(shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
            .alpha_response_qual, iAlphaResponseIndex)
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
            .alpha_response_qual[iAlphaResponseIndex].shx_alpha_response_id = -iAlphaResponseIndex
          set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
              .alpha_response_qual[iAlphaResponseIndex].nomenclature_id =
            social_history->categories[iCategoryIndex].elements[iElementIndex].values[iValueIndex].nomenclature.nomenclature_id
          ; FUTURE Support "other_text" field for alpha responses
        endfor ; No existing data - social history category element values
      ; Text
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.freetext_ind = 1)
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_type = "FREETEXT"
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_val = trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].text_value, 3)
      ; Numeric
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.numeric_ind = 1)
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_type = "NUMERIC"
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_val = trim(social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].numeric_display, 3)
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_unit_cd = social_history->categories[iCategoryIndex].elements[iElementIndex].values[1].unit_cd
      ; Date
      elseif(social_history->categories[iCategoryIndex].elements[iElementIndex].value_type.date_time_ind = 1)
        set shx_ens_activity_601051_req->activity_qual[iActivityIndex].response_qual[iResponseIndex]
          .response_type = "DATE"
 
        ; FUTURE Support date values
        set dummy = 0
      endif
    endif
  endfor
 
  if(iDebugFlag > 0)
    call echo(concat("PopulateSocialHistoryElements Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PopulateSocialHistoryElements
 
/*************************************************************************
;  Name: GetSocialHistoryModifierFlagDisplay(modifierFlag = i4) = vc
;  Description:  Gets a social history display for a modifier flag for a numeric value (i.e. About, Before, etc)
**************************************************************************/
subroutine GetSocialHistoryModifierFlagDisplay(modifierFlag)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetSocialHistoryModifierFlagDisplay Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare sDisplay = vc with privateprotect, noconstant("")
 
  case(modifierFlag)
    of c_shx_modifier_about_age:
      set sDisplay = notrim(concat(c_shx_modifier_about_age_display, " "))
    of c_shx_modifier_before_age:
      set sDisplay = notrim(concat(c_shx_modifier_before_age_display, " "))
    of c_shx_modifier_after_age:
      set sDisplay = notrim(concat(c_shx_modifier_after_age_display, " "))
    of c_shx_modifier_unknown:
      set sDisplay = notrim(concat(c_shx_modifier_unknown_display, " "))
  endcase
 
  if(iDebugFlag > 0)
    call echo(concat("GetSocialHistoryModifierFlagDisplay Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sDisplay)
end ; End subroutine GetSocialHistoryModifierFlagDisplay
 
/*************************************************************************
;  Name: GetUnitDisplay(unitCd = f8) = vc
;  Description:  Gets a social history display for a modifier flag for a numeric value (i.e. About, Before, etc)
**************************************************************************/
subroutine GetUnitDisplay(unitCd)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetUnitDisplay Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare sDisplay = vc with privateprotect, noconstant("")
 
  if(unitCd > 0.00)
    declare sCodeDisplay = vc with privateprotect, noconstant("")
    set sCodeDisplay = trim(uar_get_code_display(unitCd), 3)
    if(textlen(nullterm(sCodeDisplay)) > 0)
      set sDisplay = notrim(concat(" ", sCodeDisplay))
    endif
  endif
 
  if(iDebugFlag > 0)
    call echo(concat("GetUnitDisplay Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sDisplay)
end ; End subroutine GetUnitDisplay
 
/*************************************************************************
;  Name: GetRTFFormattedString(sOriginal = vc) = vc
;  Description:  Gets a string formatted for RTF
**************************************************************************/
subroutine GetRTFFormattedString(sOriginal)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetRTFFormattedString Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("sOriginal  ->", sOriginal))
  endif
 
  declare sFormattedString = vc with privateprotect,
    noconstant(notrim(replace(replace(replace(sOriginal, char(92), concat(char(92), char(92))), "{", "\{"), "}", "\}")))
 
  if(iDebugFlag > 0)
    call echo(build("sFormattedString  ->", sFormattedString))
 
    call echo(concat("GetRTFFormattedString Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sFormattedString)
end ; End subroutine GetRTFFormattedString
 
/*************************************************************************
;  Name: GetRTFFormattedDateTimeToMinute(qDateTime = dq8, iTimeZoneIndex = i4) = vc
;  Description:  Gets the date formatted for RTF
**************************************************************************/
subroutine GetRTFFormattedDateTimeToMinute(qDateTime, iTimeZoneIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetRTFFormattedDateTimeToMinute Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("qDateTime  ->", format(cnvtdatetime(qDateTime), ";;Q")))
    call echo(build("iTimeZoneIndex  ->", iTimeZoneIndex))
  endif
 
  declare sFormattedDate = vc with privateprotect,
    noconstant(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "M/d/yyyy"))
  declare iHour = i4 with privateprotect,
    noconstant(mod(cnvtint(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "H")), 12))
  declare sFormattedTimeSuffix = vc with privateprotect,
    noconstant(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "HH:mm tt ZZZ"))
 
  if(iHour = 0)
    set iHour = 12
  endif
 
  declare sFormattedHour = vc with privateprotect, noconstant(cnvtstring(iHour))
  declare sFormattedDateTime = vc with privateprotect,
    noconstant(concat(sFormattedDate, " ", sFormattedHour, ":",
      substring(4, textlen(nullterm(sFormattedTimeSuffix)) - 3, sFormattedTimeSuffix)))
 
  if(iDebugFlag > 0)
    call echo(build("sFormattedDateTime  ->", sFormattedDateTime))
 
    call echo(concat("GetRTFFormattedDateTimeToMinute Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sFormattedDateTime)
end ; End subroutine GetRTFFormattedDateTimeToMinute
 
/*************************************************************************
;  Name: GetRTFFormattedDateTimeToSecond(qDateTime = dq8, iTimeZoneIndex = i4) = vc
;  Description:  Gets the date formatted for RTF
**************************************************************************/
subroutine GetRTFFormattedDateTimeToSecond(qDateTime, iTimeZoneIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetRTFFormattedDateTimeToSecond Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("qDateTime  ->", format(cnvtdatetime(qDateTime), ";;Q")))
    call echo(build("iTimeZoneIndex  ->", iTimeZoneIndex))
  endif
 
  declare sFormattedDate = vc with privateprotect,
    noconstant(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "M/d/yyyy"))
  declare iHour = i4 with privateprotect,
    noconstant(mod(cnvtint(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "H")), 12))
  declare sFormattedTimeSuffix = vc with privateprotect,
    noconstant(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "HH:mm:ss tt ZZZ"))
 
  if(iHour = 0)
    set iHour = 12
  endif
 
  declare sFormattedHour = vc with privateprotect, noconstant(cnvtstring(iHour))
  declare sFormattedDateTime = vc with privateprotect,
    noconstant(concat(sFormattedDate, " ", sFormattedHour, ":",
      substring(4, textlen(nullterm(sFormattedTimeSuffix)) - 3, sFormattedTimeSuffix)))
 
  if(iDebugFlag > 0)
    call echo(build("sFormattedDateTime  ->", sFormattedDateTime))
 
    call echo(concat("GetRTFFormattedDateTimeToSecond Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(sFormattedDateTime)
end ; End subroutine GetRTFFormattedDateTimeToSecond
 
/*************************************************************************
;  Name: BuildPowerFormRTFDocument(null) = null
;  Description:  Builds and populates the powerform_activity->document_blob
;  Note: Currently the only supported locale is US English
**************************************************************************/
subroutine BuildPowerFormRTFDocument(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("BuildPowerFormRTFDocument Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  declare sNowDateTimeToSecond = vc with protect,
    noconstant(GetRTFFormattedDateTimeToSecond(cnvtdatetime(powerform_date_time->document_new_action_dt_tm),
      powerform_date_time->document_new_action_tz))
 
  ; RTF Constants
  declare c_alignment_centered = vc with privateprotect, constant("\qc")
  declare c_alignment_left = vc with privateprotect, constant("\ql")
  declare c_alignment_right = vc with privateprotect, constant("\qr")
  declare c_bold_begin = vc with privateprotect, constant("\b")
  declare c_bold_end = vc with privateprotect, constant("\b0")
  declare c_color_table = vc with privateprotect, constant(concat(
      "{\colortbl ",
        ; RGB #000000 as color #1
        ";\red0\green0\blue0",
        ; RGB #C0C0C0 as color #2
        ";\red192\green192\blue192",
        ; RGB #FF0000 as color #3
        ";\red255\green0\blue0",
        ; RGB #00FF00 as color #4
        ";\red0\green255\blue0",
        ; RGB #000000 as color #5
        ";\red0\green0\blue0",
      "}"
    ))
  declare c_font_0 = vc with privateprotect, constant("\f0")
  declare c_font_1 = vc with privateprotect, constant("\f1")
  declare c_font_2 = vc with privateprotect, constant("\f2")
  declare c_font_size_20 = vc with privateprotect, constant("\fs20")
  declare c_font_size_24 = vc with privateprotect, constant("\fs24")
  declare c_font_table = vc with privateprotect, constant(concat(
      "{\fonttbl",
        ; Defines Arial as font #0
        "{\f0\fswiss\fcharset0 Arial;}",
        ; Defines Verdana as font #1
        "{\f1\fswiss\fprq2\fcharset0 Verdana;}",
        ; Defines Microsoft Sans Serif as font #2
        "{\f2\fswiss\fprq2\fcharset0 Microsoft Sans Serif;}",
      "}"
    ))
  declare c_highlight_end = vc with privateprotect, constant("\highlight0")
  declare c_italic_begin = vc with privateprotect, constant("\i")
  declare c_italic_end = vc with privateprotect, constant("\i0")
  declare c_nomal_view = vc with privateprotect, constant("\viewkind4")
  declare c_paragraph_default = vc with privateprotect, constant("\pard")
  declare c_paragraph_new = vc with privateprotect, constant("\par")
  declare c_rtf_begin = vc with privateprotect, constant("{\rtf1\ansi\ansicpg1252\deff0\deflang1033")
  declare c_rtf_end = vc with privateprotect, constant("}")
  declare c_space = c1 with privateprotect, constant(" ")
  declare c_double_space = c2 with privateprotect, constant("  ")
  declare c_triple_space = c3 with privateprotect, constant("   ")
  declare c_strikethrough_begin = vc with privateprotect, constant("\strike")
  declare c_strikethrough_end = vc with privateprotect, constant("\strike0")
  declare c_underline_begin = vc with privateprotect, constant("\ul")
  declare c_underline_end = vc with privateprotect, constant("\ulnone")
  declare c_unicode_bytes_1 = vc with privateprotect, constant("\uc1")
 
  ; RTF Table Constants
  declare c_table_row_begin = vc with privateprotect, constant("\trowd")
  declare c_table_row_end = vc with privateprotect, constant("\row")
  declare c_table_row_header = vc with privateprotect, constant("\trgaph30\trpaddl30\trpaddr30\trpaddfl3\trpaddfr3")
  declare c_table_cell_end = vc with privateprotect, constant("\cell")
  declare c_table_cell_2880 = vc with privateprotect, constant("\cellx2880")
  declare c_table_cell_4320 = vc with privateprotect, constant("\cellx4320")
  declare c_table_cell_8640 = vc with privateprotect, constant("\cellx8640")
  declare c_table_paragraph = vc with privateprotect, constant("\intbl")
 
  ; PowerForm Constants
  declare c_question_suffix = c5 with privateprotect, constant(" :   ")
  declare c_normal_low = c5 with privateprotect, constant("(LOW)")
  declare c_normal_high = c4 with privateprotect, constant("(HI)")
  declare c_critical_low = c7 with privateprotect, constant("(<LLOW)")
  declare c_critical_high = c6 with privateprotect, constant("(>HHI)")
 
  ; Social History Constants
  declare c_table_cells_social_history = vc with privateprotect, constant(concat(c_table_cell_2880, c_table_cell_8640))
  declare c_table_cells_social_history_footer = vc with privateprotect, constant(concat(c_table_cell_4320))
 
  call echo(build("myString  ->", GetRTFFormattedString("{this\bob}")))
 
  declare sRTFDocument = gvc with privateprotect
 
  ; RTF Header
  set sRTFDocument = notrim(concat(
    c_rtf_begin, c_font_table, c_color_table, c_nomal_view, c_unicode_bytes_1
  ))
 
  ; Document Title - First Line
  set sRTFDocument = notrim(concat(notrim(sRTFDocument),
    c_paragraph_default, c_font_0, c_font_size_24, c_highlight_end, c_font_2, c_font_size_20,
      c_bold_begin, c_alignment_centered,
        c_space,
        GetRTFFormattedString(powerform_rtf->description),
        c_space,
        "Entered On:",
        c_double_space,
        GetRTFFormattedDateTimeToMinute(powerform_rtf->event_end_dt_tm, powerform_rtf->event_end_tz),
        c_space,
      c_bold_end,
    c_highlight_end, c_space
  ))
 
  ; Document Title - Second Line
  set sRTFDocument = notrim(concat(notrim(sRTFDocument),
    c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20,
      c_bold_begin, c_alignment_centered,
        c_double_space,
        "Performed On:",
        c_double_space,
        GetRTFFormattedDateTimeToMinute(powerform_rtf->perform_action_dt_tm, powerform_rtf->perform_action_tz),
        c_space,
        "by",
        c_space,
        GetRTFFormattedString(powerform_rtf->perform_action_prsnl_full_name),
        c_space,
      c_bold_end,
    c_highlight_end, c_space
  ))
 
  ; Space bewteen title and body
  set sRTFDocument = notrim(concat(notrim(sRTFDocument),
    c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20,
      c_bold_begin, c_alignment_left,
        c_double_space,
      c_bold_end,
    c_highlight_end, c_space,
    c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20,
      c_bold_begin, c_alignment_left,
        c_double_space,
      c_bold_end,
    c_highlight_end, c_space,
    c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
        c_double_space,
    c_highlight_end, c_space,
    c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
        c_double_space,
    c_highlight_end, c_space
  ))
 
  for(iSectionIndex = 1 to powerform_rtf->section_cnt)
    ; Section
    set sRTFDocument = notrim(concat(notrim(sRTFDocument),
      c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20,
        c_bold_begin, c_alignment_left,
          c_space,
          GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].description),
          c_space,
        c_bold_end,
      c_highlight_end, c_space
    ))
 
    for(iControlIndex = 1 to powerform_rtf->sections[iSectionIndex].control_cnt)
      for(iModificationIndex = 1 to powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modification_cnt)
        ; First Modification
        if(iModificationIndex = 1)
          ; Control - Begin
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
            c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20,
              c_alignment_left, c_space, c_highlight_end, c_font_2, c_alignment_left
          ))
 
          if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].in_error_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
                c_strikethrough_begin
            ))
          endif
 
          ; Control - Question
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              c_italic_begin,
                c_space,
                GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].caption),
                c_question_suffix,
              c_italic_end, c_highlight_end
          ))
        ; Subsequent Modifications
        else
          ; Control modification
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
            c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_right,
              c_strikethrough_begin,
              "\{ ["
          ))
        endif
 
        for(iValueIndex = 1 to powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
          modifications[iModificationIndex].value_cnt)
          if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind = 1)
            if(iValueIndex <= 1)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space,
                GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                  modifications[iModificationIndex].values[iValueIndex].nomenclature.short_string)))
            else
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), ", ",
                GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                  modifications[iModificationIndex].values[iValueIndex].nomenclature.short_string)))
            endif
          elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space,
              GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                modifications[iModificationIndex].values[iValueIndex].text_value)))
          elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space,
              GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                modifications[iModificationIndex].values[iValueIndex].numeric_display)))
 
            if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
              values[iValueIndex].unit_cd > 0.0)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space,
                GetRTFFormattedString(trim(uar_get_code_display(powerform_rtf->sections[iSectionIndex].controls[iControlIndex]
                .modifications[iModificationIndex].values[iValueIndex].unit_cd), 3))))
            endif

            ; Normalcy
            if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                  modifications[iModificationIndex].values[iValueIndex].normalcy_cd > 0)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, "(",
                GetRTFFormattedString(trim(uar_get_code_display(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                  modifications[iModificationIndex].values[iValueIndex].normalcy_cd), 3)), ")"))
            endif

            ; Critical Low
            if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].critical_ind > 0
              and powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].numeric_value <
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].critical_low)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, c_critical_low))
            ; Critical High
            elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].critical_ind > 0
              and powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].numeric_value >
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].critical_high)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, c_critical_high))
            ; Normal Low
            elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].normal_ind > 0
              and powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].numeric_value <
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                    values[iValueIndex].normal_low)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, c_normal_low))
            ; Normal High
            elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].normal_ind > 0
              and powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].numeric_value >
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                  values[iValueIndex].normal_high)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, c_normal_high))
            endif
          elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind = 1)
            if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
              values[iValueIndex].stripped_rtf_value_size > 0)
              set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space, powerform_rtf->sections[iSectionIndex].
                controls[iControlIndex].modifications[iModificationIndex].values[iValueIndex].stripped_rtf_value))
            endif
          elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument), c_space,
              GetRTFFormattedDateTimeToMinute(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                modifications[iModificationIndex].values[iValueIndex].date_time_value,
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                  modifications[iModificationIndex].values[iValueIndex].date_time_tz)))
          endif
        endfor
 
        ; First Modification
        if(iModificationIndex = 1)
          if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].in_error_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
                c_space,
                "[IN ERROR]",
                c_strikethrough_end
            ))
          endif
 
          ; Control - End
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
            c_space, c_highlight_end, c_space))
 
          ; Control footer
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
            c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_right,
              c_space,
              GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex]
                  .modifications[iModificationIndex].action_prsnl_full_name),
              " - ",
              GetRTFFormattedDateTimeToMinute(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                modifications[iModificationIndex].action_dt_tm,
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].action_tz),
              c_space,
            c_highlight_end, c_space
          ))
        ; Subsequent Modifications
        else
          ; Control footer begin
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              "]  - previously charted by ",
              GetRTFFormattedString(powerform_rtf->sections[iSectionIndex].controls[iControlIndex]
                  .modifications[iModificationIndex].action_prsnl_full_name),
              " at ",
              GetRTFFormattedDateTimeToMinute(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                modifications[iModificationIndex].action_dt_tm,
                powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].action_tz),
              c_space,
            c_highlight_end, c_space
          ))
 
          if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].in_error_ind = 1)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
                c_space,
                "[IN ERROR]",
                c_space
            ))
          endif
 
          ; Control footer end
          set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              "\};", c_space, c_space, c_strikethrough_end,
            c_highlight_end, c_space
          ))
        endif
      endfor
    endfor
 
    if(powerform_rtf->sections[iSectionIndex].components.social_history_ind = 1)
      ; Social History
      if(powerform_rtf->components.social_history_ind = 1)
        ; Social History header
        set sRTFDocument = notrim(concat(notrim(sRTFDocument),
          c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_left, c_strikethrough_end,
            c_underline_begin,
              c_space,
              "Social History",
              c_space,
            c_underline_end,
          c_highlight_end, c_space
        ))
 
        ; As Of Section for Social History
        set sRTFDocument = notrim(concat(notrim(sRTFDocument),
          c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_right,
            c_space,
            "(As Of: ",
            sNowDateTimeToSecond,
            ")",
            c_space,
          c_highlight_end, c_space
        ))
 
        if(size(shx_get_activity_new_601052_rep->activity_qual, 5) > 0)
          set iIndex = locateval(iIndex, 1, size(shx_get_activity_new_601052_rep->activity_qual, 5),
                c_shx_activity_status_active_cd,
                shx_get_activity_new_601052_rep->activity_qual[iIndex].status_cd,
                1,
                shx_get_activity_new_601052_rep->activity_qual[iIndex].unable_to_obtain_ind,
                "PERSON",
                shx_get_activity_new_601052_rep->activity_qual[iIndex].type_mean)
          ; Unable to obtain
          if(iIndex > 0)
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              c_paragraph_new, c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
                  c_space,
                  "       Unable To Obtain",
                  c_space,
              c_highlight_end, c_space
            ))
          else
            ; Table begin
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              c_paragraph_new
            ))
 
            for(i = 1 to size(shx_get_activity_new_601052_rep->activity_qual, 5))
              if(trim(shx_get_activity_new_601052_rep->activity_qual[i].type_mean, 3) = "DETAIL"
                and shx_get_activity_new_601052_rep->activity_qual[i].status_cd = c_shx_activity_status_active_cd)
                set iIndex = locateval(iIndex, 1, size(shx_get_social_history_def_601050_rep->category_qual, 5),
                  shx_get_activity_new_601052_rep->activity_qual[i].shx_category_ref_id,
                  shx_get_social_history_def_601050_rep->category_qual[iIndex].shx_category_ref_id,
                  shx_get_activity_new_601052_rep->activity_qual[i].shx_category_def_id,
                  shx_get_social_history_def_601050_rep->category_qual[iIndex].shx_category_def_id)
                if(iIndex < 0)
                  call ErrorHandler2(c_error_handler, "F", "BuildPowerFormRTFDocument",
                    build2("Unable to find social history category shx_category_def_id=",
                      shx_get_activity_new_601052_rep->activity_qual[i].shx_category_def_id), "9999",
                    build2("Unable to find social history category shx_category_def_id=",
                      shx_get_activity_new_601052_rep->activity_qual[i].shx_category_def_id), pat_pwrform_reply_out)
                  go to exit_script
                endif
 
                set sRTFDocument = notrim(concat(notrim(sRTFDocument),
                  c_table_row_begin, c_table_row_header, c_table_cells_social_history,
                    c_paragraph_default, c_table_paragraph, c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
                      c_space,
                      GetRTFFormattedString(trim(shx_get_social_history_def_601050_rep->category_qual[iIndex].description, 3)),
                      c_space,
                    c_highlight_end, c_space, c_table_cell_end,
                    c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
                      c_double_space,
                    c_highlight_end, c_space, c_table_cell_end,
                  c_table_row_end,
                  c_table_row_begin, c_table_row_header, c_table_cells_social_history,
                    c_paragraph_default, c_table_paragraph, c_highlight_end, c_font_2, c_alignment_left,
                      c_double_space,
                    c_highlight_end, c_space, c_table_cell_end,
                    c_highlight_end, c_font_2, c_font_size_20, c_alignment_left,
                      c_space,
                      trim(shx_get_activity_new_601052_rep->activity_qual[i].detail_summary, 3),
                      c_triple_space,
                      "(Last Updated:",
                      c_space,
                      notrim(GetRTFFormattedDateTimeToSecond(
                        cnvtdatetime(shx_get_activity_new_601052_rep->activity_qual[i].last_updt_dt_tm),
                        shx_get_activity_new_601052_rep->activity_qual[i].last_updt_tz)),
                      c_space,
                      "by",
                      c_space,
                      GetRTFFormattedString(trim(shx_get_activity_new_601052_rep->activity_qual[i].last_updt_prsnl_name, 3)),
                      ")",
                      c_triple_space,
                    c_highlight_end, c_space, c_table_cell_end,
                  c_table_row_end,
                  c_table_row_begin, c_table_row_header, c_table_cells_social_history_footer,
                    c_paragraph_default, c_table_paragraph, c_highlight_end, c_font_2, c_alignment_left,
                      c_double_space,
                    c_highlight_end, c_space, c_table_cell_end,
                  c_table_row_end
                ))
              endif
            endfor
 
            ; Table end
            set sRTFDocument = notrim(concat(notrim(sRTFDocument),
              c_paragraph_default
            ))
          endif
        endif
      endif
    endif
  endfor
 
  ; RTF footer
  set sRTFDocument = notrim(concat(notrim(sRTFDocument),
    c_paragraph_new, c_rtf_end
  ))
 
  set powerform_activity->document_blob = notrim(sRTFDocument)
  set powerform_activity->document_blob_length = textlen(nullterm(powerform_activity->document_blob))
 
  if(iDebugFlag > 0)
    call echo(concat("BuildPowerFormRTFDocument Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine BuildPowerFormRTFDocument
 
/*************************************************************************
;  Name: GetInformationForRTF(null) = null
;  Description:  Gets the information for the RTF
**************************************************************************/
subroutine GetInformationForRTF(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetInformationForRTF Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif
 
  ; Load the latest results
  set stat = alterlist(event_detail_query_1000011_rep->rb_list, 0)
  call GetPreviousFormResults(null)
 
  if(size(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list, 5) < 1)
    call ErrorHandler2(c_error_handler, "F", "GetInformationForRTF",
      "Call to event_detail_query did not return any results (step_id=1000011)", "9999",
      "Call to event_detail_query did not return any results (step_id=1000011)", pat_pwrform_reply_out)
    go to exit_script
  endif
 
  ; Populate initial powerform_rtf
  set powerform_rtf->event_id = event_detail_query_1000011_rep->rb_list[1].event_id
  set powerform_rtf->description = trim(event_detail_query_1000011_rep->rb_list[1].event_title_text, 3)
  set powerform_rtf->event_end_dt_tm = cnvtdatetime(event_detail_query_1000011_rep->rb_list[1].event_end_dt_tm)
  set powerform_rtf->event_end_tz = event_detail_query_1000011_rep->rb_list[1].event_end_tz
  set powerform_rtf->event_end_prsnl_full_name = GetNameFromPrsnID(event_detail_query_1000011_rep->rb_list[1].performed_prsnl_id)
  set powerform_rtf->perform_action_dt_tm = cnvtdatetime(event_detail_query_1000011_rep->rb_list[1].performed_dt_tm)
  set powerform_rtf->perform_action_tz = event_detail_query_1000011_rep->rb_list[1].performed_tz
  set powerform_rtf->perform_action_prsnl_id = event_detail_query_1000011_rep->rb_list[1].performed_prsnl_id
  set powerform_rtf->perform_action_prsnl_full_name =
    GetNameFromPrsnID(event_detail_query_1000011_rep->rb_list[1].performed_prsnl_id)
 
  declare iEventPrsnlSize = i4 with privateprotect, noconstant(0)
  declare iEventPrsnlIndex = i4 with privateprotect, noconstant(0)
  declare iSectionEventSize = i4 with privateprotect, noconstant(0)
  declare iSectionEventIndex = i4 with privateprotect, noconstant(0)
  declare iControlEventSize = i4 with privateprotect, noconstant(0)
  declare iControlEventIndex = i4 with privateprotect, noconstant(0)
 
  ; Sections
  set iSectionEventSize = size(event_detail_query_1000011_rep->rb_list[1].child_event_list, 5)
 
  for(iSectionIndex = 1 to powerform_reference->section_cnt)
    set iSectionEventIndex = locateval(iSectionEventIndex, 1, iSectionEventSize,
      powerform_reference->sections[iSectionIndex].dcp_section_ref_id,
      cnvtreal(trim(event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].collating_seq, 3)))
    if(iSectionEventIndex > 0)
      set powerform_rtf->section_cnt += 1
      set stat = alterlist(powerform_rtf->sections, powerform_rtf->section_cnt)
 
      ; Section Activity
      set powerform_rtf->sections[powerform_rtf->section_cnt].event_id =
        event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].event_id
      set powerform_rtf->sections[powerform_rtf->section_cnt].description =
        trim(event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].event_title_text, 3)
 
      ; Section Reference
      set powerform_rtf->sections[powerform_rtf->section_cnt].reference_index = iSectionIndex
      set powerform_rtf->sections[powerform_rtf->section_cnt].components.social_history_ind =
        powerform_reference->sections[iSectionIndex].components.social_history_ind
 
      if(powerform_reference->sections[iSectionIndex].components.social_history_ind = 1)
        set powerform_rtf->components.social_history_ind = 1
      endif
 
      ; Controls
      set iIndex = 0
      set iControlEventSize =
        size(event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].child_event_list, 5)
 
      for(iControlIndex = 1 to powerform_reference->sections[iSectionIndex].control_cnt)
        set iControlEventIndex = locateval(iControlEventIndex, 1, iControlEventSize,
          powerform_reference->sections[iSectionIndex].controls[iControlIndex].event_cd,
          event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].
          child_event_list[iControlEventIndex].event_cd)
        if(iControlEventIndex > 0)
          set iIndex += 1
          set powerform_rtf->sections[powerform_rtf->section_cnt].control_cnt = iIndex
          set stat = alterlist(powerform_rtf->sections[powerform_rtf->section_cnt].controls, iIndex)
 
          ; Control Activity
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].event_id =
              event_detail_query_1000011_rep->rb_list[1].child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].
            event_id
 
          ; Control Reference
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].reference_index = iControlIndex
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].caption =
            trim(powerform_reference->sections[iSectionIndex].controls[iControlIndex].caption, 3)
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].date_type_flag =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].date_type_flag
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].value_type.nomenclature_ind =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].value_type.freetext_ind =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].value_type.numeric_ind =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].value_type.rtf_ind =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind
          set powerform_rtf->sections[powerform_rtf->section_cnt].controls[iIndex].value_type.date_time_ind =
            powerform_reference->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind
        endif
      endfor
    endif
  endfor
 
  select into "nl:"
    p.name_full_formatted
  from
    (dummyt d with seq = value(size(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list, 5)))
    , prsnl p
  plan d
  join p where p.person_id = event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_prsnl_id
  order by event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_dt_tm desc
  head report
    iIndex = 0
  detail
    if(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_type_cd in
        (c_perform_action_type_cd, c_modify_action_type_cd))
      iIndex += 1
 
      ; Previous Modifications
      modification_information->modification_cnt = iIndex
      stat = alterlist(modification_information->modifications, iIndex)
 
      modification_information->modifications[iIndex].valid_from_dt_tm =
        cnvtdatetime(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].valid_from_dt_tm)
      modification_information->modifications[iIndex].action_dt_tm =
        cnvtdatetime(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_dt_tm)
      modification_information->modifications[iIndex].action_tz =
        event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_tz
      modification_information->modifications[iIndex].action_prsnl_id =
        event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].action_prsnl_id
      modification_information->modifications[iIndex].action_prsnl_full_name =
        trim(p.name_full_formatted, 3)
 
      ; 1000079 Request
      stat = alterlist(event_detail_batch_query_1000079_req->req_list, iIndex)
      event_detail_batch_query_1000079_req->req_list[iIndex].query_mode = 3
      event_detail_batch_query_1000079_req->req_list[iIndex].event_id = powerform_activity->event_id
      event_detail_batch_query_1000079_req->req_list[iIndex].subtable_bit_map_ind = 1
      event_detail_batch_query_1000079_req->req_list[iIndex].valid_from_dt_tm =
        cnvtdatetime(event_detail_query_1000011_rep->rb_list[1].event_prsnl_list[d.seq].valid_from_dt_tm)
    endif
  with nocounter
 
  if(iDebugFlag > 0)
    call echorecord(modification_information)
  endif
 
  call GetHistoricalFormResults(null)
 
  declare iRepSize = i4 with privateprotect, noconstant(0)
  declare iRepIndex = i4 with privateprotect, noconstant(0)
  declare iRbSize = i4 with privateprotect, noconstant(0)
  declare iRbIndex = i4 with privateprotect, noconstant(0)
  declare iValueIndex = i4 with privateprotect, noconstant(0)

  set CURALIAS = rtf_modifications powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex]
  set CURALIAS = rtf_values powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
    values[iValueIndex]
 
  ; Modifications
  set iRepSize = size(event_detail_batch_query_1000079_rep->rep_list, 5)
  for(iIndex = 1 to modification_information->modification_cnt)
 
    ; Reply List
    for(iRepIndex = 1 to iRepSize)
 
      ; Rb List
      set iRbSize = size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list, 5)
      for(iRbIndex = 1 to iRbSize)
 
        ; If Rb List matches a valid modification date/time
        if(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].event_id = powerform_rtf->event_id
          and cnvtdatetime(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].valid_from_dt_tm) =
          modification_information->modifications[iIndex].valid_from_dt_tm)
 
          ; Sections
          set iSectionEventSize = size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
            child_event_list, 5)
          for(iSectionEventIndex = 1 to iSectionEventSize)
 
            ; Find the section index for the event id
            set iSectionIndex = locateval(iSectionIndex, 1, powerform_rtf->section_cnt,
              event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].child_event_list[iSectionEventIndex].
              event_id,
              powerform_rtf->sections[iSectionIndex].event_id)
            if(iSectionIndex > 0)
 
              ; Controls
              set iControlEventSize = size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                child_event_list[iSectionEventIndex].child_event_list, 5)
              for(iControlEventIndex = 1 to iControlEventSize)
 
                ; Find the control index for the event id
                set iControlIndex = locateval(iControlIndex, 1, powerform_rtf->sections[iSectionIndex].control_cnt,
                  event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].child_event_list[iSectionEventIndex].
                  child_event_list[iControlEventIndex].event_id,
                  powerform_rtf->sections[iSectionIndex].controls[iControlIndex].event_id)
                ; If the control was found and the valid from date/time matches then add a modification
                if(iControlIndex > 0 and
                  cnvtdatetime(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                    child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].valid_from_dt_tm) =
                  cnvtdatetime(modification_information->modifications[iIndex].valid_from_dt_tm))
 
                  ; Add Modification
                  set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modification_cnt += 1
                  set iModificationIndex = powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modification_cnt
                  set stat = alterlist(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications,
                    iModificationIndex)
 
                  ; In Error result
                  if(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                    child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].result_status_cd =
                    c_result_status_code_in_error_cd)
                    set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                      in_error_ind = 1
                  endif
 
                  ; From Modification List
                  set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                    action_dt_tm = cnvtdatetime(modification_information->modifications[iIndex].action_dt_tm)
                  set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                    action_tz = modification_information->modifications[iIndex].action_tz
                  set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                    action_prsnl_id = modification_information->modifications[iIndex].action_prsnl_id
                  set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                    action_prsnl_full_name = trim(modification_information->modifications[iIndex].action_prsnl_full_name, 3)
 
                  set iValueIndex = 0
                  if(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.nomenclature_ind = 1)
                    for(i = 1 to size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].coded_result_list, 5))
 
                      set iValueIndex += 1
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        value_cnt = iValueIndex
                      set stat = alterlist(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                        modifications[iModificationIndex].values, iValueIndex)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].nomenclature.
                        nomenclature_id =
                        event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].coded_result_list[i].
                        nomenclature_id
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].nomenclature.
                        short_string =
                        trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].coded_result_list[i].
                        short_string, 3)
                    endfor
                  elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.freetext_ind = 1)
                    for(i = 1 to size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result, 5))
 
                      set iValueIndex += 1
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        value_cnt = iValueIndex
                      set stat = alterlist(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                        modifications[iModificationIndex].values, iValueIndex)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].text_value =
                        trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result[i].
                        string_result_text, 3)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].unit_cd =
                        event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result[i].
                        unit_of_measure_cd
                    endfor
                  elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.numeric_ind = 1)
                    for(i = 1 to size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result, 5))
 
                      set iValueIndex += 1
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        value_cnt = iValueIndex
                      set stat = alterlist(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                        modifications[iModificationIndex].values, iValueIndex)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].numeric_display =
                        trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result[i].
                        string_result_text, 3)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].unit_cd =
                        event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].string_result[i].
                        unit_of_measure_cd
                      
                      set rtf_values->numeric_value = cnvtreal(rtf_values->numeric_display)

                      set rtf_values->normalcy_cd = event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normalcy_cd
                      
                      if(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                          child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normalcy_cd <= 0.00)
                        ; Normal Low
                        if(textlen(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_low, 3)) > 0
                          and isnumeric(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_low, 3)) > 0)
                          set rtf_values->normal_ind = 1
                          set rtf_values->normal_low =
                            cnvtreal(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_low, 3))
                        endif

                        ; Normal High
                        if(textlen(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_high, 3)) > 0
                          and isnumeric(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_high, 3)) > 0)
                          set rtf_values->normal_ind = 1
                          set rtf_values->normal_high =
                            cnvtreal(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].normal_high, 3))
                        endif

                        ; Critical Low
                        if(textlen(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_low, 3)) > 0
                          and isnumeric(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_low, 3)) > 0)
                          set rtf_values->critical_ind = 1
                          set rtf_values->critical_low =
                            cnvtreal(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_low, 3))
                        endif

                        ; Critical High
                        if(textlen(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_high, 3)) > 0
                          and isnumeric(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_high, 3)) > 0)
                          set rtf_values->critical_ind = 1
                          set rtf_values->critical_high =
                            cnvtreal(trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                            child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].critical_high, 3))
                        endif

                        ; Critical Low
                        if(rtf_values->critical_ind > 0 and rtf_values->numeric_value < rtf_values->critical_low)
                          set rtf_values->normalcy_cd = c_normalcy_extreme_low_cd
                        ; Critical High
                        elseif(rtf_values->critical_ind > 0 and rtf_values->numeric_value > rtf_values->critical_high)
                          set rtf_values->normalcy_cd = c_normalcy_extreme_high_cd
                        ; Normal Low
                        elseif(rtf_values->normal_ind > 0 and rtf_values->numeric_value < rtf_values->normal_low)
                          set rtf_values->normalcy_cd = c_normalcy_low_cd
                        ; Normal High
                        elseif(rtf_values->normal_ind > 0 and rtf_values->numeric_value > rtf_values->normal_high)
                          set rtf_values->normalcy_cd = c_normalcy_high_cd
                        endif
                      endif
                    endfor
                  elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.rtf_ind = 1)
                    if(size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].blob_result, 5) > 0
                      and size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].blob_result[1].blob, 5) > 0)
 
                      set iValueIndex += 1
                      set rtf_modifications->value_cnt = iValueIndex
                      set stat = alterlist(rtf_modifications->values, iValueIndex)
                      set rtf_values->rtf_value =
                        trim(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].blob_result[1].blob[1].
                        blob_contents, 3)
                      set rtf_values->rtf_value_size =
                        event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].blob_result[1].blob[1].
                        blob_length

                      set rtf_values->stripped_rtf_value = rtf_values->rtf_value
                      set rtf_values->stripped_rtf_value = replace(rtf_values->stripped_rtf_value, "\pard", "~!@#$%^&pard", 0)
                      set rtf_values->stripped_rtf_value = replace(rtf_values->stripped_rtf_value, "\line", "~!@#$%^&line", 0)
                      set rtf_values->stripped_rtf_value = replace(rtf_values->stripped_rtf_value, "\par", "~!@#$%^&line", 0)
                      set rtf_values->stripped_rtf_value = replace(rtf_values->stripped_rtf_value, "~!@#$%^&pard", "\pard", 0)
                      set rtf_values->stripped_rtf_value_size = textlen(rtf_values->stripped_rtf_value)
                      set rtf_values->out_buffer_length = 1000

                      call uar_rtf2(rtf_values->stripped_rtf_value, rtf_values->stripped_rtf_value_size,
                          rtf_values->out_buffer, rtf_values->out_buffer_length,
                          rtf_values->return_buffer_length, 1)

                      set rtf_values->stripped_rtf_value = trim(rtf_values->out_buffer, 3)
                      set rtf_values->stripped_rtf_value = replace(rtf_values->stripped_rtf_value, "~!@#$%^&line", "\line ", 0)
                      set rtf_values->stripped_rtf_value_size = textlen(rtf_values->stripped_rtf_value)
                    endif
                  elseif(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].value_type.date_time_ind = 1)
                    for(i = 1 to size(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                      child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].date_result, 5))
 
                      set iValueIndex += 1
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        value_cnt = iValueIndex
                      set stat = alterlist(powerform_rtf->sections[iSectionIndex].controls[iControlIndex].
                        modifications[iModificationIndex].values, iValueIndex)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].date_time_value =
                        cnvtdatetime(event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].date_result[i].
                        result_dt_tm)
                      set powerform_rtf->sections[iSectionIndex].controls[iControlIndex].modifications[iModificationIndex].
                        values[iValueIndex].date_time_tz =
                        event_detail_batch_query_1000079_rep->rep_list[iRepIndex].rb_list[iRbIndex].
                        child_event_list[iSectionEventIndex].child_event_list[iControlEventIndex].date_result[i].
                        result_tz
                    endfor
                  endif
                endif
              endfor
            endif
          endfor
        endif
      endfor
    endfor
  endfor

  set CURALIAS rtf_modifications OFF
  set CURALIAS rtf_values OFF
 
  if(iDebugFlag > 0)
    call echorecord(powerform_reference)
    call echorecord(powerform_rtf)
    call echorecord(powerform_activity)
 
    call echo(concat("GetInformationForRTF Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine GetInformationForRTF
 
/*************************************************************************
;  Name: StripDateTimeSeconds(qDateTime = dq8, iTimeZoneIndex = i4) = dq8
;  Description:  Strips the seconds and smaller from a date/time
**************************************************************************/
subroutine StripDateTimeSeconds(qDateTime, iTimeZoneIndex)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("StripDateTimeSeconds Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
    call echo(build("qDateTime  ->", format(cnvtdatetime(qDateTime), ";;Q")))
  endif
 
  declare qStrippedDateTime = dq8 with privateprotect, noconstant(qDateTime)
  if(qStrippedDateTime != null)
    set qStrippedDateTime = cnvtdatetime(datetimezoneformat(cnvtdatetime(qDateTime), iTimeZoneIndex, "dd-MMM-yyyy HH:mm"))
  endif
 
  if(iDebugFlag > 0)
    call echo(build("qStrippedDateTime  ->", format(cnvtdatetime(qStrippedDateTime), ";;Q")))
 
    call echo(concat("StripDateTimeSeconds Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
 
  return(qStrippedDateTime)
end ; End subroutine StripDateTimeSeconds
 
end
go
