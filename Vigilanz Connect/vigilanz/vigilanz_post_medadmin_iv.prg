/***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************
      Source file name: snsro_post_med_admin_iv.prg
      Object name:      snsro_post_med_admin_iv
      Program purpose:  POST a continuous IV medication administration in Millennium
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 08/12/19 RJC		Initial Write
 ************************************************************************/
drop program vigilanz_post_medadmin_iv go
create program vigilanz_post_medadmin_iv
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username" = ""
	, "PatientId" = ""
	, "PatientIdType" = ""
	, "OrderId" = ""
	, "ScheduledAdministrationId" = ""
	, "PatientScanned" = ""
	, "PatientNotScannedReason" = ""
	, "PatientBarcode" = ""				; Not currently implemented. Setup for future use
	, "MedicationScanned" = ""
	, "MedicationNotScannedReason" = ""
	, "MedicationBarcode" = ""
	, "ClinicianId" = ""				;Performed By
	, "WitnessId" = ""					;WitnessedBy
	, "AdminStartDateTime" = ""			;PeformedDateTime for all events except infuse and bolus.
	, "AdminEndDateTime" = ""			;Infuse and Bolus only
	, "DocumentedDateTime" = ""
	, "IVEvent" = ""					;Emissary Enum - BeginBag, SiteChange, Infuse, Bolus, Waste, RateChange
	, "BagNumber" = ""
	, "Volume" = ""						;BeginBag volume, Infuse Volume, Bolus Infuse Volume, Wasted Volume
	, "VolumeUnit" = ""				    ; Only allow mL
	, "Site" = ""
	, "Rate" = ""
	, "RateUnit" = ""					; Only allow mL/HR
	, "Comments" = ""
	, "SystemId" = ""
	, "ReferenceNumber" = ""
	, "Debug" = 0
 
with OUTDEV, USERNAME, PATIENTID, PATIENTIDTYPE, ORDERID, SCHEDADMINID,
	PATIENTSCANNED, PATNOTSCANREASON, PATIENT_BARCODE, MEDICATIONSCANNED, MEDNOTSCANREASON, MED_BARCODE,
	CLINICIANID, WITNESSID, ADMIN_STARTDATETIME, ADMIN_ENDDATETIME, DOCUMENTEDDATETIME, IV_EVENT,
	BAG_NUMBER, VOLUME, VOLUME_UNIT, SITE, RATE, RATE_UNIT, COMMENTS, SYSTEM_ID, REF_NUMBER, DEBUG_FLAG
 
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
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;600578 - dcp_get_ord_dtls_for_charting
free record 600578_req
record 600578_req (
  1 order_id = f8
  1 action_sequence = i4
  1 template_dose_sequence = i4
)
free record 600578_rep
record 600578_rep (
   1 person_id = f8
   1 encntr_id = f8
   1 hna_order_mnemonic = vc
   1 ordered_as_mnemonic = vc
   1 order_mnemonic = vc
   1 synonym_id = f8
   1 catalog_cd = f8
   1 catalog_type_cd = f8
   1 activity_type_cd = f8
   1 event_cd = f8
   1 action_sequence = i4
   1 last_action_sequence = i4
   1 updt_cnt = i4
   1 iv_ind = i2
   1 clinical_display_line = vc
   1 effective_dt_tm = dq8
   1 effective_tz = i4
   1 orig_order_dt_tm = dq8
   1 orig_order_tz = i4
   1 order_provider_id = f8
   1 order_status_cd = f8
   1 template_order_id = f8
   1 template_core_action_sequence = f8
   1 need_rx_verify_ind = i2
   1 need_rx_clin_review_flag = i2
   1 prn_ind = i2
   1 orderable_type_flag = i2
   1 dcp_clin_cat_cd = f8
   1 med_order_type_cd = f8
   1 oe_format_id = f8
   1 product_action_seq = i4
   1 root_event_id = f8
   1 need_nurse_review_ind = i2
   1 comment_type_mask = i4
   1 order_comment_text = vc
   1 ingred_action_seq = i4
   1 plan_ind = i2
   1 taper_ind = i2
   1 detail_qual [* ]
     2 oe_field_display_value = vc
     2 oe_field_dt_tm_value = dq8
     2 oe_field_tz = i4
     2 oe_field_id = f8
     2 oe_field_meaning_id = f8
     2 oe_field_value = f8
     2 detail_value [* ]
       3 oe_field_value = f8
       3 oe_field_display_value = vc
       3 oe_field_dt_tm_value = dq8
       3 oe_field_tz = i4
     2 min_val = f8
     2 max_val = f8
     2 input_mask = vc
     2 label_text = vc
     2 filter_params = vc
     2 oe_field_meaning = vc
   1 ingred_qual [* ]
     2 hna_order_mnemonic = vc
     2 ordered_as_mnemonic = vc
     2 order_mnemonic = vc
     2 order_detail_display_line = vc
     2 ingredient_type_flag = i2
     2 ingredient_source_flag = i2
     2 comp_sequence = i4
     2 strength = f8
     2 strength_unit = f8
     2 volume = f8
     2 volume_unit = f8
     2 freetext_dose = vc
     2 ordered_dose = f8
     2 ordered_dose_unit_cd = f8
     2 ordered_dose_unit_cd_disp = vc
     2 ordered_dose_unit_cd_desc = vc
     2 ordered_dose_unit_cd_mean = vc
     2 freq_cd = f8
     2 catalog_cd = f8
     2 catalog_type_cd = f8
     2 synonym_id = f8
     2 event_cd = f8
     2 clinically_significant_flag = i2
     2 include_in_total_volume_flag = i2
     2 witness_required_ind = i2
     2 product_qual [* ]
       3 item_id = f8
       3 dispense_category_cd = f8
       3 dose_quantity = f8
       3 dose_quantity_unit_cd = f8
     2 iv_seq = i4
     2 dose_quantity = f8
     2 dose_quantity_unit = f8
     2 normalized_rate = f8
     2 normalized_rate_unit_cd = f8
     2 normalized_rate_unit_cd_disp = vc
     2 normalized_rate_unit_cd_desc = vc
     2 normalized_rate_unit_cd_mean = vc
     2 concentration = f8
     2 concentration_unit_cd = f8
     2 concentration_unit_cd_disp = vc
     2 concentration_unit_cd_desc = vc
     2 concentration_unit_cd_mean = vc
     2 ingredient_rate_conversion_ind = i2
     2 clinically_significant_flag = i2
     2 cki = vc
     2 display_additives_first_ind = i2
     2 last_admin_disp_basis_flag = i2
     2 med_interval_warn_flag = i2
     2 autoprog_syn_ind = i2
     2 autoprogramming_id = f8
   1 freq_type_flag = i2
   1 immunization_ind = i2
   1 parent_order_last_action_seq = i4
   1 dosing_method_flag = i2
   1 template_dose_sequence = i4
   1 projected_stop_dt_tm = dq8
   1 projected_stop_tz = i4
   1 stop_type_cd = f8
   1 core_action_sequence = i4
   1 applicable_fields_bit = i4
   1 finished_bags_cnt = i4
   1 total_bags_nbr = i4
   1 order_iv_info_updt_cnt = i4
   1 iv_sequence_ind = i2
   1 updated_to_verified_flag = i2
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;3200285 - msvc_svr_get_medication_administrations
free record 3200285_req
record 3200285_req (
  1 patient_id = f8
  1 anchor_date = dq8
  1 target_date = dq8
  1 encntr_ids [*]
    2 encntr_id = f8
  1 statuses [*]
    2 status_cd = f8
  1 load_indicators
    2 ce_med_admin
      3 basic_attributes_ind = i2
      3 action_providers_ind = i2
      3 comments_ind = i2
      3 orders_ind = i2
      3 not_given_reason_ind = i2
      3 associated_measurements_ind = i2
      3 acknowledged_measurements_ind = i2
    2 ce_measurement
      3 basic_attributes_ind = i2
      3 action_providers_ind = i2
      3 comments_ind = i2
      3 orders_ind = i2
      3 reference_range_ind = i2
      3 value_ind = i2
    2 ce_not_done
      3 basic_attributes_ind = i2
      3 action_providers_ind = i2
      3 comments_ind = i2
      3 orders_ind = i2
      3 not_done_reason_ind = i2
    2 ce_placeholder
      3 basic_attributes_ind = i2
      3 orders_ind = i2
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
)
 
free record 3200285_rep
record 3200285_rep (
  1 status_data
    2 success_ind = i2
    2 debug_error_message = vc
  1 has_more_ind = i2
  1 next_retrieval_date = dq8
  1 removed_clinical_events_ind = i2
  1 medication_administrations [*]
    2 event_id = f8
    2 patient_id = f8
    2 encounter_id = f8
    2 administration_date = dq8
    2 administration_date_tz = i4
    2 start_date = dq8
    2 start_date_tz = i4
    2 update_date = dq8
    2 status_cd = f8
    2 not_given_reason_cd = f8
    2 not_given_reason_ft = vc
    2 perform_provider_id = f8
    2 perform_date = dq8
    2 perform_date_tz = i4
    2 verify_provider_id = f8
    2 verify_date = dq8
    2 verify_date_tz = i4
    2 catalog_cd = f8
    2 custom_display = vc
    2 associated_weight = f8
    2 associated_weight_unit_cd = f8
    2 route_cd = f8
    2 site_cd = f8
    2 is_continuous_ind = i2
    2 refusal_reason_cd = f8
    2 continuous_information [*]
      3 iv_action_cd = f8
      3 initial_volume = f8
      3 initial_volume_unit_cd = f8
      3 volume = f8
      3 volume_unit_cd = f8
      3 dose = f8
      3 dose_unit_cd = f8
      3 volume_rate = f8
      3 volume_rate_unit_cd = f8
      3 initial_dose = f8
      3 initial_dose_unit_cd = f8
    2 has_admin_notes_ind = i2
    2 admin_notes [*]
      3 id = f8
      3 type_cd = f8
      3 comment_date = dq8
      3 comment_tz = i4
      3 author_id = f8
      3 text = gvc
      3 media_type_cd = f8
    2 clinical_event_order [*]
      3 order_id = f8
      3 template_order_id = f8
      3 catalog_type_cd = f8
      3 order_action_sequence = i4
    2 action_providers [*]
      3 id = f8
      3 type_cd = f8
      3 action_provider_date = dq8
      3 action_provider_tz = i4
      3 comment = vc
      3 provider_id = f8
      3 provider_ft = vc
      3 proxy_provider_ft = vc
      3 proxy_provider_id = f8
    2 removed_med_ingredients_ind = i2
    2 medication_ingredients [*]
      3 event_id = f8
      3 event_cd = f8
      3 status_cd = f8
      3 initial_dose = f8
      3 initial_dose_unit_cd = f8
      3 dose = f8
      3 dose_unit_cd = f8
      3 initial_volume = f8
      3 initial_volume_unit_cd = f8
      3 volume = f8
      3 volume_unit_cd = f8
      3 dose_rate = f8
      3 dose_rate_unit_cd = f8
      3 strength = f8
      3 strength_unit_cd = f8
      3 order_synonym_id = f8
      3 order_catalog_cd = f8
      3 lot_number = vc
      3 custom_display = vc
      3 collating_sequence = i4
    2 removed_measurements_ind = i2
    2 associated_measurements [*]
      3 measurement_classification = vc
      3 event_id = f8
      3 patient_id = f8
      3 event_cd = f8
      3 encounter_id = f8
      3 effective_date = dq8
      3 effective_date_tz = i4
      3 update_date = dq8
      3 status_cd = f8
      3 value_interpretation_cd = f8
      3 perform_provider_id = f8
      3 perform_date = dq8
      3 perform_date_tz = i4
      3 verify_provider_id = f8
      3 verify_date = dq8
      3 verify_date_tz = i4
      3 custom_display = vc
      3 has_comments_ind = i2
      3 comments [*]
        4 id = f8
        4 type_cd = f8
        4 comment_date = dq8
        4 comment_tz = i4
        4 author_id = f8
        4 text = gvc
        4 media_type_cd = f8
      3 clinical_event_orders [*]
        4 order_id = f8
        4 template_order_id = f8
        4 catalog_type_cd = f8
        4 order_action_sequence = i4
      3 action_providers [*]
        4 id = f8
        4 type_cd = f8
        4 action_provider_date = dq8
        4 action_provider_tz = i4
        4 comment = vc
        4 provider_id = f8
        4 provider_ft = vc
        4 proxy_provider_ft = vc
        4 proxy_provider_id = f8
      3 codified_values [*]
        4 values [*]
          5 nomenclature_id = f8
          5 value_cd = f8
          5 value_unit_cd = f8
          5 group = i4
          5 sequence = i4
        4 other_response = vc
        4 nomen_string_short_ind = i2
        4 nomen_string_mnemonic_ind = i2
        4 nomen_string_source_ind = i2
      3 string_value [*]
        4 text = vc
        4 numeric_value [*]
          5 number = f8
          5 number_unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
          5 leading_zeros = i4
      3 quantity_value [*]
        4 number = f8
        4 number_unit_cd = f8
        4 modifier_cd = f8
        4 digits_past_decimal = i4
        4 leading_zeros = i4
      3 date_value [*]
        4 date_time_ind = i2
        4 date_only_ind = i2
        4 time_only_ind = i2
        4 date_value = dq8
        4 date_value_tz = i4
        4 time_value = vc
      3 encapsulated_value [*]
        4 text = gvc
        4 media_type_cd = f8
      3 reference_range [*]
        4 normal_high_text = vc
        4 normal_high_quantity [*]
          5 number = f8
          5 number_unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
          5 leading_zeros = i4
        4 normal_low_text = vc
        4 normal_low_quantity [*]
          5 number = f8
          5 number_unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
          5 leading_zeros = i4
      3 group_label [*]
        4 id = f8
        4 name = vc
      3 contributor_system_cd = f8
      3 note_importance = i2
      3 is_acknowledged_ind = i2
    2 is_immunization_ind = i2
    2 contributor_system_cd = f8
    2 note_importance = i2
    2 end_date = dq8
    2 end_date_tz = i4
  1 measurements [*]
    2 measurement_classification = vc
    2 event_id = f8
    2 patient_id = f8
    2 event_cd = f8
    2 encounter_id = f8
    2 effective_date = dq8
    2 effective_date_tz = i4
    2 update_date = dq8
    2 status_cd = f8
    2 value_interpretation_cd = f8
    2 perform_provider_id = f8
    2 perform_date = dq8
    2 perform_date_tz = i4
    2 verify_provider_id = f8
    2 verify_date = dq8
    2 verify_date_tz = i4
    2 custom_display = vc
    2 has_comments_ind = i2
    2 comments [*]
      3 id = f8
      3 type_cd = f8
      3 comment_date = dq8
      3 comment_tz = i4
      3 author_id = f8
      3 text = gvc
      3 media_type_cd = f8
    2 clinical_event_orders [*]
      3 order_id = f8
      3 template_order_id = f8
      3 catalog_type_cd = f8
      3 order_action_sequence = i4
    2 action_providers [*]
      3 id = f8
      3 type_cd = f8
      3 action_provider_date = dq8
      3 action_provider_tz = i4
      3 comment = vc
      3 provider_id = f8
      3 provider_ft = vc
      3 proxy_provider_ft = vc
      3 proxy_provider_id = f8
    2 codified_values [*]
      3 values [*]
        4 nomenclature_id = f8
        4 value_cd = f8
        4 value_unit_cd = f8
        4 group = i4
        4 sequence = i4
      3 other_response = vc
      3 nomen_string_short_ind = i2
      3 nomen_string_mnemonic_ind = i2
      3 nomen_string_source_ind = i2
    2 string_value [*]
      3 text = vc
      3 numeric_value [*]
        4 number = f8
        4 number_unit_cd = f8
        4 modifier_cd = f8
        4 digits_past_decimal = i4
        4 leading_zeros = i4
    2 quantity_value [*]
      3 number = f8
      3 number_unit_cd = f8
      3 modifier_cd = f8
      3 digits_past_decimal = i4
      3 leading_zeros = i4
    2 date_value [*]
      3 date_time_ind = i2
      3 date_only_ind = i2
      3 time_only_ind = i2
      3 date_value = dq8
      3 date_value_tz = i4
      3 time_value = vc
    2 encapsulated_value [*]
      3 text = gvc
      3 media_type_cd = f8
    2 reference_range [*]
      3 normal_high_text = vc
      3 normal_high_quantity [*]
        4 number = f8
        4 number_unit_cd = f8
        4 modifier_cd = f8
        4 digits_past_decimal = i4
        4 leading_zeros = i4
      3 normal_low_text = vc
      3 normal_low_quantity [*]
        4 number = f8
        4 number_unit_cd = f8
        4 modifier_cd = f8
        4 digits_past_decimal = i4
        4 leading_zeros = i4
    2 group_label [*]
      3 id = f8
      3 name = vc
    2 contributor_system_cd = f8
    2 note_importance = i2
    2 is_acknowledged_ind = i2
  1 not_dones [*]
    2 event_id = f8
    2 patient_id = f8
    2 encounter_id = f8
    2 event_cd = f8
    2 effective_date = dq8
    2 effective_date_tz = i4
    2 update_date = dq8
    2 perform_provider_id = f8
    2 perform_date = dq8
    2 perform_date_tz = i4
    2 verify_provider_id = f8
    2 verify_date = dq8
    2 verify_date_tz = i4
    2 not_done_reason_cd = f8
    2 not_done_reason_ft = vc
    2 has_comments_ind = i2
    2 comments [*]
      3 id = f8
      3 type_cd = f8
      3 comment_date = dq8
      3 comment_tz = i4
      3 author_id = f8
      3 text = gvc
      3 media_type_cd = f8
    2 action_providers [*]
      3 id = f8
      3 type_cd = f8
      3 action_provider_date = dq8
      3 action_provider_tz = i4
      3 comment = vc
      3 provider_id = f8
      3 provider_ft = vc
      3 proxy_provider_ft = vc
      3 proxy_provider_id = f8
    2 clinical_event_orders [*]
      3 order_id = f8
      3 template_order_id = f8
      3 catalog_type_cd = f8
      3 order_action_sequence = i4
    2 contributor_system_cd = f8
    2 note_importance = i2
  1 placeholders [*]
    2 event_id = f8
    2 actual_event_id = f8
    2 patient_id = f8
    2 encounter_id = f8
    2 event_cd = f8
    2 effective_date = dq8
    2 effective_date_tz = i4
    2 update_date = dq8
    2 clinical_event_orders [*]
      3 order_id = f8
      3 template_order_id = f8
      3 catalog_type_cd = f8
      3 order_action_sequence = i4
)
 
;601589 - bsc_get_mar_tasks
free record 601589_req
record 601589_req (
  1 person_id = f8
  1 start_dt_tm = dq8
  1 end_dt_tm = dq8
  1 overdue_look_back = i4
  1 debug_ind = i2
  1 load_delta_ind = i2
  1 encntr_list [*]
    2 encntr_id = f8
  1 enable_protocol_ind = i2
)
 
free record 601589_rep
record 601589_rep (
   1 overdue_tasks_exist = i2
   1 earliest_overdue_task_dt_tm = dq8
   1 earliest_overdue_task_tz = i4
   1 orders [* ]
     2 order_id = f8
     2 template_order_id = f8
     2 protocol_order_id = f8
     2 task_cnt = i4
     2 co_cnt = i4
     2 last_action_sequence = i4
     2 need_rx_verify_ind = i2
     2 need_rx_clin_review_flag = i2
     2 verification_prsnl_id = f8
     2 verification_pos_cd = f8
     2 encntr_id = f8
     2 med_order_type_cd = f8
     2 med_order_type_disp = vc
     2 med_order_type_mean = vc
     2 catalog_cd = f8
     2 catalog_type_cd = f8
     2 freq_type_flag = i2
     2 tasks [* ]
       3 task_id = f8
       3 reference_task_id = f8
       3 order_id = f8
       3 task_status_cd = f8
       3 task_status_disp = vc
       3 task_status_mean = vc
       3 task_class_cd = f8
       3 task_class_disp = vc
       3 task_class_mean = vc
       3 task_activity_cd = f8
       3 task_activity_disp = vc
       3 task_activity_mean = vc
       3 task_priority_cd = f8
       3 task_priority_disp = vc
       3 task_priority_mean = vc
       3 template_order_action_sequence = i4
       3 task_dt_tm = dq8
       3 task_tz = i4
       3 event_id = f8
       3 careset_id = f8
       3 iv_ind = i2
       3 tpn_ind = i2
       3 updt_cnt = i4
       3 last_action_sequence = i4
       3 description = vc
       3 dcp_forms_ref_id = f8
       3 event_cd = f8
       3 task_type_cd = f8
       3 task_type_disp = vc
       3 task_type_mean = vc
       3 chart_not_done_ind = i2
       3 quick_chart_ind = i2
       3 reschedule_time = i4
       3 priv_ind = i2
       3 delta_ind = i2
       3 day_of_treatment_sequence = i4
       3 future_ind = i2
     2 child_orders [* ]
       3 order_id = f8
       3 encntr_id = f8
       3 catalog_cd = f8
       3 catalog_type_cd = f8
       3 core_action_sequence = i4
       3 need_nurse_review_ind = i2
       3 med_order_type_cd = f8
       3 current_start_dt_tm = dq8
       3 current_start_tz = i4
       3 link_nbr = f8
       3 link_type_flag = i2
       3 freq_type_flag = i2
       3 need_rx_clin_review_flag = i2
       3 need_rx_verify_ind = i2
       3 display_line = vc
       3 order_details [* ]
         4 oe_field_id = f8
         4 oe_field_meaning = vc
         4 oe_field_meaning_id = f8
         4 oe_field_value = f8
         4 oe_field_display_value = vc
         4 oe_field_dt_tm = dq8
         4 oe_field_tz = i4
     2 order_actions [* ]
       3 action_sequence = i4
       3 action_dt_tm = dq8
       3 action_tz = i4
       3 action_type_cd = f8
       3 action_type_disp = vc
       3 action_type_mean = vc
       3 need_rx_verify_ind = i2
       3 need_rx_clin_review_flag = i2
       3 verification_prsnl_id = f8
       3 verification_pos_cd = f8
       3 prn_ind = i2
       3 constant_ind = i2
       3 core_ind = i2
       3 order_details [* ]
         4 action_sequence = i4
         4 oe_field_id = f8
         4 oe_field_meaning = vc
         4 oe_field_meaning_id = f8
         4 oe_field_value = f8
         4 oe_field_display_value = vc
         4 oe_field_dt_tm = dq8
         4 oe_field_tz = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;601547 - dcp_get_syn_witness_req_data
free record 601547_req
record 601547_req (
  1 synonym_id_list [*]
    2 synonym_id = f8
  1 col_name_cd = f8
  1 facility_cd_list [*]
    2 facility_cd = f8
)
 
free record 601547_rep
record 601547_rep (
   1 synonym_id_list [* ]
     2 synonym_id = f8
     2 qual [* ]
       3 facility_cd = f8
       3 facility_disp = c40
       3 facility_desc = vc
       3 facility_mean = c12
       3 value = f8
       3 string_value = vc
       3 group_id = f8
       3 col_name_cd = f8
       3 col_name_disp = c40
       3 col_name_desc = vc
       3 col_name_mean = c12
       3 attrib_list [* ]
         4 object_cd = f8
         4 object_disp = c40
         4 object_desc = vc
         4 object_mean = c12
         4 object_type_cd = f8
         4 object_type_disp = c40
         4 object_type_desc = vc
         4 object_type_mean = c12
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;600320 - pts_get_ppr_yn
free record 600320_req
record 600320_req (
  1 person_id = f8
  1 prsnl_person_id = f8
  1 encntr_id = f8
  1 person_list [*]
    2 person_id = f8
    2 encntr_id = f8
  1 single_encntr_ind = i2
)
free record 600320_rep
record 600320_rep (
1 ppr_yn_ind = i2
   1 ppr_cd = f8
   1 lookup_status = i4
   1 person_list [* ]
     2 ppr_yn_ind = i2
     2 ppr_cd = f8
     2 person_id = f8
     2 encntr_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c8
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
 )
 
;680500 - MSVC_GetPrivilegesByCodes
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
 
;680501 - MSVC_CheckPrivileges
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
 
 ;560312 - oar_update_bags_given
free record 560312_req
record 560312_req (
  1 iv_orders [*]
    2 order_id = f8
    2 bags_given
      3 bags_given_cnt = i4
      3 begin_bag_events [*]
        4 event_id = f8
    2 bags_given_in_error
      3 bags_given_in_error_cnt = i4
      3 begin_bag_events [*]
        4 event_id = f8
)
 
free record 560312_rep
record 560312_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
   1 update_failures [* ]
     2 order_id = f8
     2 error_message = vc
 )
 
;305660 - PHA.AdminCharge
free record 305660_req
record 305660_req (
  1 qual [*]
    2 order_id = f8
    2 action_sequence = i4
    2 event_id = f8
    2 valid_thru_dt_tm = dq8
    2 dispense_type_cd = f8
    2 route_cd = f8
    2 admin_dt_tm = dq8
    2 prsnl_id = f8
    2 ingred_action_seq = i4
    2 ingred_list [*]
      3 comp_sequence = i4
      3 dose = f8
      3 dose_unit_cd = f8
)
free record 305660_rep
record 305660_rep (
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
  1 qual [*]
    2 order_id = f8
    2 event_id = f8
    2 status = vc
)
 
;600905 - dcp_add_audit_info (no reply record)
free record 600905_req
record 600905_req (
  1 admin_events [*]
    2 source_application_flag = i2
    2 event_type_cd = f8
    2 event_id = f8
    2 order_id = f8
    2 documented_action_seq = i4
    2 positive_pt_identification = i2
    2 positive_med_identification = i2
    2 order_result_variance = i2
    2 clinical_warning_cnt = i4
    2 prsnl_id = f8
    2 position_cd = f8
    2 nurse_unit_cd = f8
    2 event_dt_tm = dq8
    2 verification_dt_tm = dq8
    2 verification_tz = i4
    2 verified_prsnl_id = f8
    2 needs_verify_flag = i2
    2 scheduled_dt_tm = dq8
    2 scheduled_tz = i4
    2 template_order_id = f8
    2 careaware_used_ind = i2
    2 med_admin_alerts [*]
      3 source_application_flag = i2
      3 alert_type_cd = f8
      3 alert_severity_cd = f8
      3 prsnl_id = f8
      3 position_cd = f8
      3 nurse_unit_cd = f8
      3 event_dt_tm = dq8
      3 careaware_used_ind = i2
      3 med_admin_pt_error [*]
        4 expected_pt_id = f8
        4 identifier = vc
        4 identified_pt_id = f8
        4 reason_cd = f8
        4 freetext_reason = vc
      3 med_admin_med_error [*]
        4 person_id = f8
        4 encounter_id = f8
        4 order_id = f8
        4 action_sequence = i4
        4 admin_route_cd = f8
        4 event_id = f8
        4 verification_dt_tm = dq8
        4 verification_tz = i4
        4 verified_prsnl_id = f8
        4 needs_verify_flag = i2
        4 template_order_id = f8
        4 med_event_ingreds [*]
          5 catalog_cd = f8
          5 synonym_id = f8
          5 strength = f8
          5 strength_unit_cd = f8
          5 volume = f8
          5 volume_unit_cd = f8
          5 drug_form_cd = f8
          5 identification_process_cd = f8
        4 scheduled_dt_tm = dq8
        4 scheduled_tz = i4
        4 admin_dt_tm = dq8
        4 admin_tz = i4
        4 reason_cd = f8
        4 freetext_reason = vc
        4 critical_ind = i2
      3 next_calc_dt_tm = dq8
      3 next_calc_tz = i4
    2 critical_ind = i2
  1 identification_errors [*]
    2 source_application_flag = i2
    2 alert_type_cd = f8
    2 identifier = vc
    2 event_dt_tm = dq8
    2 prsnl_id = f8
    2 nurse_unit_cd = f8
    2 careaware_used_ind = i2
    2 med_event_ingreds [*]
      3 catalog_cd = f8
      3 synonym_id = f8
      3 strength = f8
      3 strength_unit_cd = f8
      3 volume = f8
      3 volume_unit_cd = f8
      3 drug_form_cd = f8
      3 identification_process_cd = f8
  1 med_admin_alerts [*]
    2 source_application_flag = i2
    2 alert_type_cd = f8
    2 alert_severity_cd = f8
    2 prsnl_id = f8
    2 position_cd = f8
    2 nurse_unit_cd = f8
    2 event_dt_tm = dq8
    2 careaware_used_ind = i2
    2 med_admin_pt_error [*]
      3 expected_pt_id = f8
      3 identifier = vc
      3 identified_pt_id = f8
      3 reason_cd = f8
      3 freetext_reason = vc
    2 med_admin_med_error [*]
      3 person_id = f8
      3 encounter_id = f8
      3 order_id = f8
      3 action_sequence = i4
      3 admin_route_cd = f8
      3 event_id = f8
      3 verification_dt_tm = dq8
      3 verification_tz = i4
      3 verified_prsnl_id = f8
      3 needs_verify_flag = i2
      3 template_order_id = f8
      3 med_event_ingreds [*]
        4 catalog_cd = f8
        4 synonym_id = f8
        4 strength = f8
        4 strength_unit_cd = f8
        4 volume = f8
        4 volume_unit_cd = f8
        4 drug_form_cd = f8
        4 identification_process_cd = f8
      3 scheduled_dt_tm = dq8
      3 scheduled_tz = i4
      3 admin_dt_tm = dq8
      3 admin_tz = i4
      3 reason_cd = f8
      3 freetext_reason = vc
      3 critical_ind = i2
    2 next_calc_dt_tm = dq8
    2 next_calc_tz = i4
)
 
;560303 - DCP.ModTask
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
 
;601577 - bsc_generate_infusion_task
free record 601577_req
record 601577_req (
  1 order_list [*]
    2 order_id = f8
  1 debug_ind = i2
  1 force_update_ind = i2
)
free record 601577_rep
record 601577_rep (
	1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;601557 - bsc_process_med_barcode
free record 601557_req
record 601557_req (
  1 barcode = vc
  1 location_cd = f8
  1 audit_solution_cd = f8
  1 order_info_ind = i2
  1 person_id = f8
  1 multi_ingred_ind = i2
  1 encntr_list [*]
    2 encntr_id = f8
)
 
free record 601557_rep
record 601557_rep(
   1 qual [* ]
     2 catalog_cd = f8
     2 item_id = f8
     2 synonym_id = f8
     2 strength = f8
     2 strength_unit_cd = f8
     2 volume = f8
     2 volume_unit_cd = f8
     2 form_cd = f8
     2 event_cd = f8
     2 oe_format_flag = i2
     2 med_type_flag = i4
     2 order_mnemonic = vc
     2 ordered_as_mnemonic = vc
     2 hna_order_mnemonic = vc
     2 route_qual [* ]
       3 route_cd = f8
     2 medproductqual [* ]
       3 manf_item_id = f8
       3 label_description = vc
       3 manufacturer_cd = f8
     2 synonym_qual [* ]
       3 synonym_id = f8
     2 identification_ind = i2
     2 expiration_ind = i2
     2 ingred_qual [* ]
       3 item_id = f8
       3 synonym_id = f8
       3 catalog_cd = f8
       3 event_cd = f8
       3 strength = f8
       3 strength_unit_cd = f8
       3 volume = f8
       3 volume_unit_cd = f8
       3 order_mnemonic = vc
       3 ordered_as_mnemonic = vc
       3 hna_order_mnemonic = vc
       3 synonym_qual [* ]
         4 synonym_id = f8
     2 barcode = vc
     2 barcode_source_cd = f8
     2 med_product_id = f8
     2 exp_date = dq8
     2 exp_date_tz = i4
     2 lot_number = vc
     2 compatable_form_qual [* ]
       3 form_cd = f8
     2 inv_master_id = f8
     2 recalled_ind = i2
     2 waste_charge_ind = i2
   1 execution_notes [* ]
     2 note = vc
   1 active_order_found_ind = i2
   1 inactive_order_found_ind = i2
   1 found_order_id = f8
   1 multi_found_ind = i2
   1 found_order_status = f8
   1 synonym_mismatch_id = f8
   1 mismatch_order_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
; Final reply
free record medadmin_reply_out
record medadmin_reply_out(
  1 administration_id      	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
    2 user_lastname         = vc
    2 patient_id         	= f8
    2 patient_firstname  	= vc
    2 patient_lastname  	= vc
    2 service_version   	= vc
  1 status_data
    2 status				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
 
;Temp events
free record temp
record temp (
	1 list[*]
		2 event_id = f8
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
free record input
record input (
	1 sUserName							= vc
	1 sPatientId						= vc
	1 dPatientId						= f8
	1 dPatientIdTypeCd					= f8
	1 dOrderId							= f8
    1 dScheduledAdministrationId		= f8
	1 iPatientScanned					= i2
	1 sPatientNotScannedReason			= vc
	1 dPatientNotScannedReasonCd		= f8
    1 sPatientBarcode                   = vc
	1 iMedicationScanned				= i2
	1 sMedicationNotScannedReason		= vc
	1 dMedicationNotScannedReasonCd		= f8
    1 sMedicationBarcode                = vc
	1 dClinicianId						= f8
    1 dWitnessId                        = f8
	1 qAdminStartDateTime				= dq8
	1 qAdminEndDateTime					= dq8
	1 qDocumentedDateTime				= dq8
	1 sIVEvent                          = vc
    1 iBagNumber                        = i4
    1 dVolume							= f8
	1 dVolumeUnitCd						= f8
    1 dSiteCd							= f8
    1 dRate								= f8
	1 dRateUnitCd						= f8
	1 sComments							= vc
	1 dSystemId                         = f8
	1 sReferenceNumber                  = vc
)
 
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Other
free record other
record other (
	1 dPrsnlId							= f8
	1 dPositionCd						= f8
	1 qTaskSchedDtTm					= dq8
	1 iTaskSchedTz						= i4
	1 dFacilityCd 						= f8
	1 dNurseUnitCd 						= f8
	1 iTimeZone							= i4
	1 sRefNumberStr 					= vc
	1 dActionEventCd					= f8
	1 iCollatingSeq						= i4
	1 dAdminRouteCd						= f8
	1 dInitialVolume					= f8
	1 dInitialVolumeUnitCd				= f8
	1 dRate								= f8
	1 dRateUnitCd						= f8
	1 iBagNumber						= i4
	1 iMedChanged						= i2
)
 
; Constants
declare c_error_handler 				= vc with protect, constant("POST MEDICATION ADMIN")
declare c_active_record_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_auth_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_grp_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_med_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"MED"))
declare c_perform_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_verify_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_order_action_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",21,"ORDER"))
declare c_witness_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"WITNESS"))
declare c_completed_action_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_rescomment_note_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_rtf_note_format_cd			= f8 with protect, constant(uar_get_code_by("MEANING",23,"RTF"))
declare c_unknown_entry_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_ocf_compression_cd			= f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
declare c_dcpchart_task_status_reason_cd = f8 with protect, constant(uar_get_code_by("MEANING",14024,"DCP_CHART"))
declare c_ppidover_alert_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"PPIDOVER"))
declare c_medscanover_alert_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"MEDSCANOVER"))
declare c_taskcomplete_alert_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"TASKCOMPLETE"))
declare c_minor_alert_severity_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000041,"MINOR"))
declare c_ml_volume_unit				= f8 with protect, constant(uar_get_code_by("MEANING",54,"ML"))
declare c_mlhr_rate_unit				= f8 with protect, constant(uar_get_code_by("MEANING",54,"ML/HR"))
declare c_future_order_status_cd 		= f8 with constant(uar_get_code_by("MEANING",6004,"FUTURE"))
declare c_incomplete_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"INCOMPLETE"))
declare c_inprocess_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"INPROCESS"))
declare c_medstudent_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"MEDSTUDENT"))
declare c_ordered_order_status_cd 		= f8 with constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare c_pending_order_status_cd 		= f8 with constant(uar_get_code_by("MEANING",6004,"PENDING"))
declare c_pending_rev_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"PENDING REV"))
declare c_suspended_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"SUSPENDED"))
declare c_unscheduled_order_status_cd 	= f8 with constant(uar_get_code_by("MEANING",6004,"UNSCHEDULED"))
declare c_witness_req_col_name_cd		= f8 with constant(uar_get_code_by("MEANING",4000046,"WITNESSREQ"))
declare c_ivparent_event_cd				= f8 with constant(uar_get_code_by("MEANING",72,"IVPARENT"))
declare c_confirmed_io_status_cd		= f8 with constant(uar_get_code_by("MEANING",4000160,"CONFIRMED"))
declare c_chgonadmin_dispense_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4032,"CHGONADMIN"))
declare c_pharmacy_catalog_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6000,"PHARMACY"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set input->sUserName					= trim($USERNAME,3)
set input->sPatientId					= trim($PATIENTID,3)
set input->dPatientIdTypeCd				= cnvtreal($PATIENTIDTYPE)
set input->dOrderId						= cnvtreal($ORDERID)
set input->dScheduledAdministrationId	= cnvtreal($SCHEDADMINID)
set input->iPatientScanned				= cnvtint($PATIENTSCANNED)
set input->sPatientNotScannedReason		= trim($PATNOTSCANREASON,3)
set input->dPatientNotScannedReasonCd	= cnvtreal($PATNOTSCANREASON)
set input->sPatientBarcode              = trim($PATIENT_BARCODE,3)
set input->sMedicationBarcode           = trim($MED_BARCODE,3)
if(input->sMedicationBarcode > " ")
	set input->iMedicationScanned 		= 1
else
	set input->iMedicationScanned		= cnvtint($MEDICATIONSCANNED)
endif
set input->sMedicationNotScannedReason	= trim($MEDNOTSCANREASON,3)
set input->dMedicationNotScannedReasonCd = cnvtreal($MEDNOTSCANREASON)
set input->dClinicianId					= cnvtreal($CLINICIANID)
set input->dWitnessId                   = cnvtreal($WITNESSID)
set input->qAdminStartDateTime			= GetDateTime($ADMIN_STARTDATETIME)
set input->qAdminEndDateTime			= GetDateTime($ADMIN_ENDDATETIME)
set input->qDocumentedDateTime			= GetDateTime($DOCUMENTEDDATETIME)
set input->sIVEvent                     = cnvtupper(trim($IV_EVENT,3))
set input->iBagNumber                   = cnvtint($BAG_NUMBER)
set input->dVolume						= cnvtreal($VOLUME)
set input->dVolumeUnitCd				= cnvtreal($VOLUME_UNIT)
set input->dSiteCd						= cnvtreal($SITE)
set input->dRate						= cnvtreal($RATE)
set input->dRateUnitCd					= cnvtreal($RATE_UNIT)
set input->sComments					= trim($COMMENTS,3)
set input->dSystemId                    = cnvtreal(trim($SYSTEM_ID,3))
set input->sReferenceNumber             = trim($REF_NUMBER,3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
; Set dates depending on IV Event
if(input->sIVEvent in ("INFUSE","BOLUS"))
	if(trim($ADMIN_STARTDATETIME,3) <= " ")
		set input->qAdminStartDateTime = 0
	endif
 
	if(trim($ADMIN_ENDDATETIME,3) <= " ")
		set input->qAdminEndDateTime = 0
	endif
else
	set input->qAdminEndDateTime = input->qAdminStartDateTime
endif
 
;Other
set other->dPrsnlId = GetPrsnlIDfromUserName(input->sUserName)
if(input->dClinicianId = 0)
	set input->dClinicianId = other->dPrsnlId
endif
set other->dPositionCd = GetPositionByPrsnlId(input->dClinicianId)
 
if(iDebugFlag > 0)
	call echo(build("other->dPrsnlId -> ",other->dPrsnlId))
	call echo(build("other->dPositionCd -> ",other->dPositionCd))
	call echorecord(input)
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) = null with protect
declare ValidateInput(null)			= null with protect
declare GetOrderDetails(null)		= i2 with protect	;600578 - dcp_get_ord_dtls_for_charting
declare ValidateSite(null)			= null with protect
declare GetMedAdmins(null)			= i2 with protect	;3200285 - msvc_svr_get_medication_administrations
declare GetMedTasks(null)			= i2 with protect	;601589 - bsc_get_mar_tasks
declare ProcessMedBarcode(null)     = null with protect ;601557 - bsc_process_med_barcode
declare GetWitnessRequirement(null) = i2 with protect
declare GetPrsnlReltn(null)			= i2 with protect	;600320 - pts_get_ppr_yn
declare GetPrivileges(null)			= i2 with protect	;680500 - MSVC_GetPrivilegesByCodes
declare CheckPrivileges(null) 		= i2 with protect 	;680501 - MSVC_CheckPrivileges
declare PostMedAdmin(null)			= null with protect	;1000071 - event_batch_ensure
declare UpdateBagsGiven(null)       = i2 with protect   ;560312 - oar_update_bags_given
declare CreatePharmacyCharge(null)	= i2 with protect	;305660 - PHA.AdminCharge
declare PostMedAdminAudit(null)		= i2 with protect	;600905 - dcp_add_audit_info
declare UpdateAdminTask(null)		= i2 with protect	;560303 - DCP.ModTask
declare CreateInfusionTask(null)	= i2 with protect 	;601577 - bsc_generate_infusion_task
declare GetCollatingSeq(null) 		= vc with protect
declare BuildEventTag(number = f8, codevalue = f8) = vc with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username and update audit
set iRet = PopulateAudit(input->sUserName, input->dPatientId, medadmin_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Validate input parameters
call ValidateInput(null)
 
; Get order details -- 600578 - dcp_get_ord_dtls_for_charting
set iRet = GetOrderDetails(null)
if(iRet = 0) call ErrorMsg("Could not get order details (600578).","9999","E") endif
 
; Get patient prsnl reltn -- 600320 - pts_get_ppr_yn
set iRet = GetPrsnlReltn(null)
if(iRet = 0) call ErrorMsg("Could not get patient prsnl relation (600320).","9999","E") endif
 
; Validate SiteId goes with route
call ValidateSite(null)
 
; Get Medication Admins if this isn't a begin bag event -- 3200285 - msvc_svr_get_medication_administrations
if(input->sIVEvent != "BEGINBAG")
	set iRet = GetMedAdmins(null)
	if(iRet = 0) call ErrorMsg("Could not get medication administrations (3200285).","9999","E") endif
endif
 
; Get medication tasks -- 560307 - DCP.QueryTasks
set iRet = GetMedTasks(null)
if(iRet = 0) call ErrorMsg("Could not get medication tasks (560307).","9999","E") endif
 
; Process medication barcode -- 601557 - bsc_process_med_barcode
if(input->sMedicationBarcode > " ")
	set iRet = ProcessMedBarcode(null)
	if(iRet = 0) call ErrorMsg("Could not process medication barcode (601557).","9999","E") endif
endif
 
; Verify witness requirements
set iRet = GetWitnessRequirement(null)
if(iRet = 0) call ErrorMsg("Could verify witness requirements.","9999","E") endif
 
; Get user privileges -- 680500 - MSVC_GetPrivilegesByCodes
set iRet = GetPrivileges(null)
if(iRet = 0) call ErrorMsg("Could not get privileges (680500).","9999","E") endif
 
; Check user privileges -- 680501 - MSVC_CheckPrivileges
set iRet = CheckPrivileges(null)
if(iRet = 0) call ErrorMsg("Could not check privileges (680501).","9999","E") endif
 
; Post medication administration -- 1000071 - event_batch_ensure
call PostMedAdmin(null)
 
if(input->sIVEvent = "BEGINBAG")
	; Update Bags Given -- 560312 - oar_update_bags_given
	set iRet = UpdateBagsGiven(null)
	if(iRet = 0) call ErrorMsg("Could not update bags given (560312).","9999","E") endif
 
	; Create Pharmacy Administration charge -- 305660 - PHA.AdminCharge
	set iRet = CreatePharmacyCharge(null)
	if(iRet = 0) call ErrorMsg("Could not create admin charge (305660).","9999","E") endif
endif
 
; Add the med admin audit information -- 600905 - dcp_add_audit_info
set iRet = PostMedAdminAudit(null)
if(iRet = 0) call ErrorMsg("Could not post med admin audit (600905).","9999","E") endif
 
; Update the medication administration task -- 560303 - DCP.ModTask
set iRet = UpdateAdminTask(null)
if(iRet = 0) call ErrorMsg("Could not update med admin task (560303).","9999","E") endif
 
; Generate infusion task if applicable -- 601577 - bsc_generate_infusion_task
set iRet = CreateInfusionTask(null)
if(iRet = 0) call ErrorMsg("Could not generate infusion task (601577).","9999","E") endif
 
;Set Emissary audit to successful
call ErrorHandler2(c_error_handler, "S", "Success", "Med administration posted successfully.",
"0000", "Med administration posted successfully.", medadmin_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(medadmin_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(medadmin_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_medadmin_iv.json")
	call echo(build2("_file : ", _file))
	call echojson(medadmin_reply_out, _file, 0)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: ErrorMsg(msg = vc, error_code = c4, type = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for input params
**************************************************************************/
subroutine ErrorMsg(msg, error_code, type)
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), medadmin_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), medadmin_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, medadmin_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInput(null) = null
;  Description: Validate input data
**************************************************************************/
subroutine ValidateInput(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInput Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
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
 
	; Verify required parameters exist
	if(input->dPatientId = 0) call ErrorMsg("PatientId","2055","M") endif
	if(input->dOrderId = 0) call ErrorMsg("OrderId","2055","M") endif
	if(input->dClinicianId = 0) call ErrorMsg("ClinicianId","2055","M") endif
	if(input->dScheduledAdministrationId = 0) call ErrorMsg("ScheduledAdministrationId","2055","M") endif
	if(input->dSiteCd = 0) call ErrorMsg("SiteId","2055","M") endif
 
 
	; Verify required parameters for the particular IV Event
	case(input->sIVEvent)
	    of "BEGINBAG":
			if(input->dVolume = 0) call ErrorMsg("Volume","2055","M") endif
			if(input->dVolumeUnitCd = 0) call ErrorMsg("VolumeUnitId","2055","M") endif
			if(input->dRate = 0) call ErrorMsg("Rate","2055","M") endif
			if(input->dRateUnitCd = 0) call ErrorMsg("RateUnitId","2055","M") endif
 			if(input->iBagNumber = 0) call ErrorMsg("BagNumber","2055","M") endif
 
			; On begin bag events, these fields will be set by the input. Other events, they get set by the last administration
			set other->dActionEventCd = uar_get_code_by("MEANING",180,"BEGIN")
			set other->dInitialVolume = input->dVolume
			set other->dInitialVolumeUnitCd = input->dVolumeUnitCd
			set other->dRate = input->dRate
			set other->dRateUnitCd = input->dRateUnitCd
			set other->iBagNumber = input->iBagNumber
	    of value("INFUSE","BOLUS"):
			if(input->dVolume = 0) call ErrorMsg("Volume","2055","M") endif
			if(input->dVolumeUnitCd = 0) call ErrorMsg("VolumeUnitId","2055","M") endif
			if(input->qAdminStartDateTime = 0) call ErrorMsg("AdminStartDateTime","2055","M") endif
			if(input->qAdminEndDateTime = 0) call ErrorMsg("AdminEndDateTime","2055","M") endif
			if(input->sIVEvent = "INFUSE")
				set other->dActionEventCd = uar_get_code_by("MEANING",180,"INFUSE")
			else
				set other->dActionEventCd = uar_get_code_by("MEANING",180,"BOLUS")
			endif
	    of "WASTE":
			if(input->dVolume = 0) call ErrorMsg("Volume","2055","M") endif
			if(input->dVolumeUnitCd = 0) call ErrorMsg("VolumeUnitId","2055","M") endif
			set other->dActionEventCd = uar_get_code_by("MEANING",180,"WASTE")
	    of "RATECHANGE":
			if(input->dRate = 0) call ErrorMsg("Rate","2055","M") endif
			if(input->dRateUnitCd = 0) call ErrorMsg("RateUnitId","2055","M") endif
			set other->dActionEventCd = uar_get_code_by("MEANING",180,"RATECHG")
 
			; On rateChange events, these fields will be set by the input. Other events, they get set by the last administration
			set other->dRate = input->dRate
			set other->dRateUnitCd = input->dRateUnitCd
		of "SITECHANGE":
			set other->dActionEventCd = uar_get_code_by("MEANING",180,"SITECHG")
		else
			call ErrorMsg("Unknown IV Event.","9999","E")
	endcase
 
	;Validate dates aren't in the future
	if(input->qAdminStartDateTime > cnvtdatetime(curdate,curtime3))
		call ErrorMsg("AdministrationStartDateTime cannot be in the future.","9999","E")
	endif
	if(input->qAdminEndDateTime > cnvtdatetime(curdate,curtime3))
		call ErrorMsg("AdministrationEndDateTime cannot be in the future.","9999","E")
	endif
	if(input->qDocumentedDateTime > cnvtdatetime(curdate,curtime3))
		call ErrorMsg("DocumentedDateTime cannot be in the future.","9999","E")
	endif
 
	;Validate SiteCd
	set iRet = GetCodeSet(input->dSiteCd)
	if(iRet != 97) call ErrorMsg("SiteCd","9999","I") endif
 
	;Validate VolumeUnitCd
	if(input->dVolumeUnitCd > 0)
		if(input->dVolumeUnitCd != c_ml_volume_unit) call ErrorMsg("VolumeUnit must be mL.","9999","E") endif
	endif
 
	;Validate RateUnitCd
	if(input->dRateUnitCd > 0)
		if(input->dRateUnitCd != c_mlhr_rate_unit) call ErrorMsg("RateUnit must be mL/HR","9999","E") endif
	endif
 
	; Validate Patient Not Scanned reason is provided if patient wasn't scanned
	if(input->iPatientScanned = 0)
		if(input->sPatientNotScannedReason = "")
			call ErrorMsg("PatientNotScannedReason","2055","M")
		else
			set input->dPatientNotScannedReasonCd = cnvtreal(input->sPatientNotScannedReason)
			if(input->dPatientNotScannedReasonCd > 0)
				set iRet = GetCodeSet(input->dPatientNotScannedReasonCd)
				if(iRet != 4003287) call ErrorMsg("PatientNotScannedReasonCd","9999","I") endif
			endif
		endif
	endif
 
	; Validate Medication Not Scanned reason is provided if medication wasn't scanned
	if(input->iMedicationScanned = 0)
		if(input->sMedicationNotScannedReason = "")
			call ErrorMsg("MedicationNotScannedReason","2055","M")
		else
			set input->dMedicationNotScannedReasonCd = cnvtreal(input->sMedicationNotScannedReason)
			if(input->dMedicationNotScannedReasonCd > 0)
				set iRet = GetCodeSet(input->dMedicationNotScannedReasonCd)
				if(iRet != 4000040) call ErrorMsg("MedicationNotScannedReasonCd","9999","I") endif
			endif
		endif
	endif
 
	;Validate WitnessId is valid
	if(input->dWitnessId > 0)
		set valid_witness = 0
		select into "nl:"
		from prsnl p
		where p.person_id = input->dWitnessId
			and p.active_ind = 1
			and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		head report
			valid_witness = 1
		with nocounter
 
		if(valid_witness < 1) call ErrorMsg("WitnessId","9999","I") endif
	endif
 
	;Validate SystemId and ReferenceNumber
	if(input->dSystemId > 0)
		set iRet = GetCodeSet(input->dSystemId)
		if(iRet != 89)
			call ErrorMsg("SystemId","9999","I")
		else
			; Validate ReferenceNumber exists on the request and is unique on the table
			if(input->sReferenceNumber = "")
				call ErrorMsg("ReferenceNumber","9999","M")
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
 
				if(check > 0) call ErrorMsg("The ReferenceNumber already exists. Please provide a unique number.","9999","E") endif
			endif
		endif
	else
		set input->dSystemId = reqdata->contributor_system_cd
 
		;Check reference number is null
		if(input->sReferenceNumber > " ") call ErrorMsg("A systemId is required for a reference number to be used.","9999","E") endif
	endif
 
	if(iDebugFlag > 0)
		call echorecord(other)
 
		call echo(concat("ValidateInput Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(null)	= i2 with protect	;600578 - dcp_get_ord_dtls_for_charting
;  Description: Get order details
**************************************************************************/
subroutine GetOrderDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600532
	set iRequest = 600578
 
	; Setup request
	set 600578_req->order_id = input->dOrderId
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600578_req,"REC",600578_rep)
 
	if(600578_rep->status_data.status = "S")
		set iValidate = 1
 
		; Validate PatientId/OrderId match
		if(input->dPatientId != 600578_rep->person_id)
			call ErrorMsg("PatientId/OrderId mismatch.","9999", "E")
		endif
 
		; Validate the medication is an IV
		if(600578_rep->iv_ind = 0)
			call ErrorMsg("The medication order provided is not an IV medication.","9999", "E")
		endif
 
		; Validate order status is valid
		if(600578_rep->order_status_cd not in ( c_future_order_status_cd,
												c_incomplete_order_status_cd,
												c_inprocess_order_status_cd,
												c_medstudent_order_status_cd,
												c_ordered_order_status_cd,
												c_pending_order_status_cd,
												c_pending_rev_order_status_cd,
												c_suspended_order_status_cd,
												c_unscheduled_order_status_cd))
			call ErrorMsg("Provided order is in an invalid status.","9999", "E")
		endif
 
		; Get Facility, Nurse Unit and TimeZone
		select into "nl:"
		from encounter e
		, time_zone_r t
		plan e where e.encntr_id = 600578_rep->encntr_id
		join t where t.parent_entity_name = outerjoin("LOCATION")
				and t.parent_entity_id = outerjoin(e.loc_facility_cd)
		detail
			other->dFacilityCd = e.loc_facility_cd
			other->dNurseUnitCd = e.loc_nurse_unit_cd
			other->iTimeZone = datetimezonebyname(trim(t.time_zone,3))
		with nocounter
 
 		; Set med changed flag; get rxroute
		for(i = 1 to size(600578_rep->detail_qual,5))
			case(600578_rep->detail_qual[i].oe_field_meaning)
				of "VOLUMEDOSE":
					if(input->dVolume != 600578_rep->detail_qual[i].oe_field_value)
						call echo("VOLUMEDOSE changed")
						set other->iMedChanged = 1
					endif
				of "VOLUMEDOSEUNIT":
					if(input->dVolumeUnitCd != 600578_rep->detail_qual[i].oe_field_value)
						call echo("VOLUMEDOSEUNIT changed")
						set other->iMedChanged = 1
					endif
				of "RATE":
					if(input->dRate != 600578_rep->detail_qual[i].oe_field_value)
						call echo("RATE changed")
						set other->iMedChanged = 1
					endif
				of "RATEUNIT":
					if(input->dRateUnitCd != 600578_rep->detail_qual[i].oe_field_value)
						call echo("RATEUNIT changed")
						set other->iMedChanged = 1
					endif
				of "RXROUTE":
					set other->dAdminRouteCd = 600578_rep->detail_qual[i].oe_field_value
				of "REQSTARTDTTM":
					set other->qTaskSchedDtTm = 600578_rep->detail_qual[i].oe_field_dt_tm_value
			endcase
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateSite(null) = null with protect
;  Description: Validate site goes with the route based on codevalue grouping
**************************************************************************/
subroutine ValidateSite(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateSite Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set grouping_exists = 0
	set site_found = 0
 
	select into "nl:"
	from code_value_group cvg
		, code_value cv
	plan cvg where cvg.parent_code_value = other->dAdminRouteCd
		and cvg.code_set = 97
	join cv where cv.code_value = cvg.child_code_value
		and cv.code_set = cvg.code_set
		and cv.active_ind = 1
	head report
		grouping_exists = 1
	detail
		if(input->dSiteCd = cv.code_value)
			site_found = 1
		endif
	with nocounter
 
	if(grouping_exists = 1)
		if(site_found = 0)
			call ErrorMsg("Invalid site for the route provided.","9999","E")
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateSite Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrsnlReltn(null) = i2 with protect	;600320 - pts_get_ppr_yn
;  Description: Get patient prsnl relationship
**************************************************************************/
subroutine GetPrsnlReltn(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrsnlReltn Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600600
	set iRequest = 600320
 
	; Setup request
	set 600320_req->prsnl_person_id = input->dClinicianId
	set stat = alterlist(600320_req->person_list,1)
	set 600320_req->person_list[1].person_id = 600578_rep->person_id
	set 600320_req->person_list[1].encntr_id = 600578_rep->encntr_id
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600320_req,"REC",600320_rep)
 
	if(600320_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPrsnlReltn Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetMedAdmins(null) = i2	;3200285 - msvc_svr_get_medication_administrations
;  Description: Get Med Administrations to retrieve initial volume and rate data
**************************************************************************/
subroutine GetMedAdmins(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedAdmins Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600015
	set iRequest = 3200285
 
	; Setup request
	set 3200285_req->patient_id = input->dPatientId
	set 3200285_req->anchor_date = cnvtdatetime(curdate,curtime3)
	set 3200285_req->target_date = cnvtdatetime(curdate-2,curtime3)
 
	set stat = alterlist(3200285_req->encntr_ids,1)
	set 3200285_req->encntr_ids[1].encntr_id = 600578_rep->encntr_id
 
	set stat = alterlist(3200285_req->statuses,4)
	set 3200285_req->statuses[1].status_cd = uar_get_code_by("MEANING",8,"ALTERED")
	set 3200285_req->statuses[2].status_cd = uar_get_code_by("MEANING",8,"AUTH")
	set 3200285_req->statuses[3].status_cd = uar_get_code_by("MEANING",8,"MODIFIED")
	set 3200285_req->statuses[4].status_cd = uar_get_code_by("MEANING",8,"UNAUTH")
 
	set 3200285_req->load_indicators.ce_med_admin.basic_attributes_ind = 1
	set 3200285_req->load_indicators.ce_med_admin.orders_ind = 1
	set 3200285_req->load_indicators.ce_med_admin.not_given_reason_ind = 1
	set 3200285_req->load_indicators.ce_med_admin.associated_measurements_ind = 1
	set 3200285_req->load_indicators.ce_med_admin.acknowledged_measurements_ind = 1
	set 3200285_req->load_indicators.ce_measurement.basic_attributes_ind = 1
	set 3200285_req->load_indicators.ce_measurement.orders_ind = 1
	set 3200285_req->load_indicators.ce_measurement.reference_range_ind = 1
	set 3200285_req->load_indicators.ce_measurement.value_ind = 1
 
	set 3200285_req->patient_user_criteria.user_id = other->dPrsnlId
	set 3200285_req->patient_user_criteria.patient_user_relationship_cd = 600320_rep->ppr_cd
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3200285_req,"REC",3200285_rep)
 
	if(3200285_rep->status_data.success_ind)
		set iValidate = 1
 
		select into "nl:"
		from (dummyt d with seq = size(3200285_rep->medication_administrations,5))
			, (dummyt d2 with seq = 1)
		plan d where maxrec(d2,size(3200285_rep->medication_administrations[d.seq].clinical_event_order,5))
		join d2 where 3200285_rep->medication_administrations[d.seq].clinical_event_order[d2.seq].order_id = input->dOrderId
		order by 3200285_rep->medication_administrations[d.seq].event_id
		detail
			if(size(3200285_rep->medication_administrations[d.seq].continuous_information,5) > 0)
				if(other->dInitialVolume = 0)
					other->dInitialVolume = 3200285_rep->medication_administrations[d.seq].continuous_information[1].initial_volume
				endif
				if(other->dInitialVolumeUnitCd = 0)
					other->dInitialVolumeUnitCd = 3200285_rep->medication_administrations[d.seq].continuous_information[1].initial_volume_unit_cd
				endif
				if(other->dRate = 0)
					other->dRate = 3200285_rep->medication_administrations[d.seq].continuous_information[1].volume_rate
				endif
				if(other->dRateUnitCd = 0)
					other->dRateUnitCd = 3200285_rep->medication_administrations[d.seq].continuous_information[1].volume_rate_unit_cd
				endif
				if(other->iBagNumber = 0)
					other->iBagNumber =
					cnvtint(3200285_rep->medication_administrations[d.seq].medication_ingredients[1].lot_number)
				endif
 
			endif
		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedAdmins Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetMedTasks(null) = i2 with protect	- 601589 bsc_get_mar_tasks
;  Description: Get patient's medication tasks
**************************************************************************/
subroutine GetMedTasks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedTasks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600015
	set iRequest = 601589
 
	; Setup request
	set 601589_req->person_id = input->dPatientId
	set 601589_req->start_dt_tm = cnvtdatetime(curdate-3,curtime3)
	set 601589_req->end_dt_tm = cnvtdatetime(curdate,curtime3)
	set 601589_req->overdue_look_back = 8
	set 601589_req->load_delta_ind = 1
	set stat = alterlist(601589_req->encntr_list,1)
	set 601589_req->encntr_list[1].encntr_id = 600578_rep->encntr_id
 
	;Execute
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",601589_req,"REC",601589_rep)
 
	if(601589_rep->status_data.status != "F")
		set iValidate = 1
		set idx = 1
 
		set opos = locateval(idx,1,size(601589_rep->orders,5),input->dOrderId,601589_rep->orders[idx].order_id)
		if(opos = 0)
			call ErrorMsg("OrderId","9999","I")
		else
			set tpos = locateval(idx,1,601589_rep->orders[opos].task_cnt,input->dScheduledAdministrationId,
			601589_rep->orders[opos].tasks[idx].task_id)
 
			if(tpos = 0)
				call ErrorMsg("ScheduledAdministrationId","9999","I")
			else
				;Validate status and class
				if(601589_rep->orders[opos].tasks[tpos].task_status_mean != "PENDING")
					call ErrorMsg("The ScheduledAdministration status should be pending.","9999","E")
				endif
 
				if(601589_rep->orders[opos].tasks[tpos].task_class_mean != "CONT")
				   	call ErrorMsg("The ScheduledAdministration class should be continuous.","9999","E")
				endif
 
				; Set task timezone
				set other->iTaskSchedTz = 601589_rep->orders[opos].tasks[tpos].task_tz
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedTasks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: ProcessMedBarcode(null) = i2 with protect ;601557 - bsc_process_med_barcode
;  Description: Process the medication barcode
**************************************************************************/
subroutine ProcessMedBarcode(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ProcessMedBarcode Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600900
	set iRequest = 601557
 
	; Setup request
 	set 601557_req->barcode = input->sMedicationBarcode
 	set 601557_req->person_id = input->dPatientId
 	set 601557_req->location_cd = other->dFacilityCd
 	set stat = alterlist(601557_req->encntr_list,1)
 	set 601557_req->encntr_list[1].encntr_id = 600578_rep->encntr_id
 	set 601557_req->order_info_ind = 1
 	set 601557_req->multi_ingred_ind = 1
 
 	; Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",601557_req,"REC",601557_rep)
 
 	if(601557_rep->status_data.status != "F")
 		set iValidate = 1
 		set scan_success = 1
 
 		;If found order_id matches, no further checks required.
 		if(601557_rep->found_order_id != input->dOrderId)
	 		if(601557_rep->active_order_found_ind != 1)
	 			set scan_success = 0
	 		endif
	 		set syn_check = 0
	 		set cat_check = 0
	 		for(i = 1 to size(601557_rep->qual,5))
	 			; Verify catalog code matches
	 			if(601557_rep->qual[i].catalog_cd = 600578_rep->catalog_cd)
	 				set cat_check = 1
	 			endif
 
	 			; Verify synonym id matches
	 			if(601557_rep->qual[i].synonym_id = 600578_rep->synonym_id)
	 				set syn_check = 1
	 			endif
	 		endfor
 
	 		if(syn_check != 1 and cat_check != 1)
	 			set scan_success = 0
	 		endif
 
	 		if(scan_success = 0)
	 			call ErrorMsg("Medication barcode scan failed to find matching medication to order.","9999","E")
	 		endif
	 	endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ProcessMedBarcode Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetWitnessRequirement(null) = i2 with protect	;601547 - dcp_get_syn_witness_req_data
;  Description: Verify if the medication and event type requires a witness
**************************************************************************/
subroutine GetWitnessRequirement(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetWitnessRequirement Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set idx = 1
 
	free record temp_synonyms
	record temp_synonyms (
		1 cnt = i4
		1 list[*]
			2 synonym_id = f8
	)
 
	; Build synonym list
	set stat = alterlist(temp_synonyms->list,1)
	set temp_synonyms->list[1].synonym_id = 600578_rep->synonym_id
	for(i = 1 to size(600578_rep->ingred_qual,5))
		set idx = i + 1
		set stat = alterlist(temp_synonyms->list,idx)
		set temp_synonyms->list[idx].synonym_id = 600578_rep->ingred_qual[i].synonym_id
	endfor
 
	; Verify if witness is required based on facility, synonym and IV action
	set check = 0
 
	select into "nl:"
	from ocs_attr_xcptn oax
	plan oax where oax.facility_cd = other->dFacilityCd
		and oax.ocs_col_name_cd = c_witness_req_col_name_cd
		and expand(idx,1,temp_synonyms->cnt,oax.synonym_id,temp_synonyms->list[idx].synonym_id)
		and oax.flex_obj_cd = other->dActionEventCd
	detail
		check = 1
	with nocounter
 
	if(check)
 		if(input->dWitnessId = 0)
 			call ErrorMsg("Witness is required for this IV action and medication.","9999","E")
 		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetWitnessRequirement Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(1)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrivileges(null) = i2 with protect	;680500 - MSVC_GetPrivilegesByCodes
;  Description: Get user privileges
**************************************************************************/
subroutine GetPrivileges(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 1
	set permissions_check = 1
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 680500
 
	; Setup first request without relationship
	set 680500_req->patient_user_criteria.user_id = input->dClinicianId
	set stat = alterlist(680500_req->privilege_criteria.privileges,3)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = uar_get_code_by("MEANING",6016,"RESULTCOPY")
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = uar_get_code_by("MEANING",6016,"ADDMEDIA")
	set 680500_req->privilege_criteria.privileges[3].privilege_cd = uar_get_code_by("MEANING",6016,"SIGNPOWERFRM")
 
	; Execute
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
	if(680500_rep->transaction_status.success_ind = 1)
		for(i = 1 to size(680500_rep->privileges,5))
			if(680500_rep->privileges[i].default[1].granted_ind != 1)
			   set permissions_check = 0
			endif
		endfor
	else
		set iValidate = 0
	endif
 
	if(iValidate = 1)
		; Setup request with relationship
		set 680500_req->patient_user_criteria.user_id = input->dClinicianId
		set 680500_req->patient_user_criteria.patient_user_relationship_cd = 600320_rep->ppr_cd
		set stat = alterlist(680500_req->privilege_criteria.privileges,8)
		set 680500_req->privilege_criteria.privileges[1].privilege_cd = uar_get_code_by("MEANING",6016,"CHARTDONE")
		set 680500_req->privilege_criteria.privileges[2].privilege_cd = uar_get_code_by("MEANING",6016,"CHARTNOTDONE")
		set 680500_req->privilege_criteria.privileges[3].privilege_cd = uar_get_code_by("MEANING",6016,"VIEWRSLTS")
		set 680500_req->privilege_criteria.privileges[4].privilege_cd = uar_get_code_by("MEANING",6016,"VIEWORDER")
		set 680500_req->privilege_criteria.privileges[5].privilege_cd = uar_get_code_by("MEANING",6016,"NURSEREVIEW")
		set 680500_req->privilege_criteria.privileges[6].privilege_cd = uar_get_code_by("MEANING",6016,"RESCHEDORDER")
		set 680500_req->privilege_criteria.privileges[7].privilege_cd = uar_get_code_by("MEANING",6016,"DOCINFSNBILL")
		set 680500_req->privilege_criteria.privileges[8].privilege_cd = uar_get_code_by("MEANING",6016,"CANCELORDER")
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
		if(680500_rep->transaction_status.success_ind = 1)
			for(i = 1 to size(680500_rep->privileges,5))
				if(680500_rep->privileges[i].default[1].granted_ind != 1)
					if(size(680500_rep->privileges[i].default[1].exceptions,5) > 0)
						set exception_check = 0
						for(e = 1 to size(680500_rep->privileges[i].default[1].exceptions,5))
							if(680500_rep->privileges[i].default[1].exceptions[e].entity_name = "CATALOG TYPE"
								and 680500_rep->privileges[i].default[1].exceptions[e].id = c_pharmacy_catalog_type_cd )
									set exception_check = 1
							endif
						endfor
						if(exception_check = 0)
							set permissions_check = 0
						endif
					else
						set permissions_check = 0
					endif
				endif
			endfor
		else
			set iValidate = 0
		endif
	endif
 
	if(permissions_check = 0)
		call ErrorMsg("User does not have permissions/privileges to administer IV medications.","9999","E")
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckPrivileges(null) = i2 with protect 	;680501 - MSVC_CheckPrivileges
;  Description: Check user privileges
**************************************************************************/
subroutine CheckPrivileges(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 1
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 680501
 
	; Setup request
	set 680501_req->patient_user_criteria.user_id = input->dClinicianId
	set 680501_req->patient_user_criteria.patient_user_relationship_cd = 600320_rep->ppr_cd
	set stat = alterlist(680501_req->event_privileges.event_code_level.event_codes,1)
	set 680501_req->event_privileges.event_code_level.event_codes[1].event_cd = 600578_rep->event_cd
	set 680501_req->event_privileges.event_code_level.view_results_ind = 1
	set 680501_req->event_privileges.event_code_level.add_documentation_ind = 1
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680501_req,"REC",680501_rep)
 
	if(680501_rep->transaction_status.success_ind = 1)
		if(680501_rep->event_privileges.view_results.status.success_ind = 0)
			set iValidate = 0
		endif
		if(680501_rep->event_privileges.add_documentation.status.success_ind = 0)
			set iValidate = 0
		endif
	else
		set iValidate = 0
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: PostMedAdmin(null)	= null with protect	;1000071 - event_batch_ensure
;  Description: Post the medication administration event
**************************************************************************/
subroutine PostMedAdmin(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostMedAdmin Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare crmstatus = i2
 
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 1000071
	execute crmrtl
	execute srvrtl
 
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			call uar_crmendapp (happ )
			call ErrorMsg(concat("BEGINTASK=",cnvtstring(crmstatus)),"9999","E")
		endif
	endif
 
	if ((htask > 0 ) )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			call uar_crmendapp (happ )
			call ErrorMsg(concat("BEGINREQ=",cnvtstring(crmstatus)),"9999","E")
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
 
		    ;create medadmin structure
		    if(input->sMedicationBarcode > " ")
		    	set hmai = uar_srvadditem(hrequest,"med_admin_identifier")
		    	set stat = uar_srvsetstring(hmai,"med_admin_barcode",nullterm(601557_rep->qual[1].barcode))
		    	set stat = uar_srvsetdouble(hmai,"barcode_source_cd",601557_rep->qual[1].barcode_source_cd)
		    	set stat = uar_srvsetdouble(hmai,"item_id",601557_rep->qual[1].item_id)
		    	set stat = uar_srvsetdouble(hmai,"med_product_id",601557_rep->qual[1].med_product_id)
		    	set stat = uar_srvsetdouble(hmai,"scan_qty",1.00)
		    	set stat = uar_srvsetdouble(hmai,"med_admin_reltn",1.00)
		    endif
 
			;req part of the request
			set hreq = uar_srvadditem(hrequest,"req")
			set stat = uar_srvsetshort(hreq,"ensure_type",1)
			set hce = uar_srvgetstruct (hreq ,"clin_event")
 
			; Clinical Event
			if(hce)
				set stat = uar_srvsetlong(hce,"view_level",1)
				set stat = uar_srvsetdouble(hce,"order_id",input->dOrderId)
				set stat = uar_srvsetdouble(hce,"person_id",600578_rep->person_id)
				set stat = uar_srvsetdouble(hce,"encntr_id",600578_rep->encntr_id)
				set stat = uar_srvsetdouble(hce,"contributor_system_cd",input->dSystemId)
				if(input->sReferenceNumber > " ")
					set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(input->sReferenceNumber))
					set stat = uar_srvsetstring(hce,"series_ref_nbr",nullterm(input->sReferenceNumber))
				endif
				set stat = uar_srvsetdouble(hce,"event_class_cd",c_med_event_class_cd)
				set stat = uar_srvsetdouble(hce,"event_cd",c_ivparent_event_cd)
				set stat = uar_srvsetdate(hce,"event_start_dt_tm",cnvtdatetime(input->qAdminStartDateTime))
				set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(input->qAdminEndDateTime))
				set stat = uar_srvsetdouble(hce,"record_status_cd",c_active_record_status_cd)
				set stat = uar_srvsetdouble(hce,"result_status_cd",c_auth_result_status_cd)
				set stat = uar_srvsetshort(hce,"authentic_flag",1)
				set stat = uar_srvsetshort(hce,"publish_flag",1)
				set stat = uar_srvsetstring(hce,"event_title_text",nullterm(uar_get_code_meaning(c_ivparent_event_cd)))
				set stat = uar_srvsetstring(hce,"collating_seq",nullterm(GetCollatingSeq(null)))
				set stat = uar_srvsetlong(hce,"order_action_sequence",600578_rep->last_action_sequence)
				set stat = uar_srvsetlong(hce,"event_start_tz",other->iTimeZone)
				set stat = uar_srvsetlong(hce,"event_end_tz",other->iTimeZone)
 				set stat = uar_srvsetdouble(hce,"replacement_event_id",1.0)
 				set stat = uar_srvsetdouble(hce,"updt_id",input->dClinicianId)
 
				;Event Tag
				declare event_tag = vc
				case(input->sIVEvent)
					of "BEGINBAG":
						set event_tag = build2(trim(uar_get_code_display(other->dActionEventCd),3),
						" ",BuildEventTag(input->dVolume,input->dVolumeUnitCd))
					of "INFUSE":
						set event_tag = BuildEventTag(input->dVolume,input->dVolumeUnitCd)
					of "BOLUS":
						set event_tag = BuildEventTag(input->dVolume,input->dVolumeUnitCd)
					of "RATECHANGE":
						set event_tag = BuildEventTag(input->dRate,input->dRateUnitCd)
					of "SITECHANGE":
						set event_tag = uar_get_code_display(input->dSiteCd)
 				endcase
				set stat = uar_srvsetstring(hce,"event_tag",nullterm(event_tag))
 
				; Med Result List
				set hmedr = uar_srvadditem(hce,"med_result_list")
				if(hmedr)
					set stat = uar_srvsetshort(hmedr,"ensure_type",2)
					set stat = uar_srvsetdate(hmedr,"admin_start_dt_tm",cnvtdatetime(input->qAdminStartDateTime))
					set stat = uar_srvsetdouble(hmedr,"admin_route_cd",other->dAdminRouteCd)
					set stat = uar_srvsetdouble(hmedr,"admin_site_cd",input->dSiteCd)
					if(input->sIVEvent in ("BOLUS","WASTE","INFUSE"))
						set stat = uar_srvsetdouble(hmedr,"admin_dosage",input->dVolume) ;Bolus,Infuse,Waste
					endif
					set stat = uar_srvsetdouble(hmedr,"dosage_unit_cd",other->dInitialVolumeUnitCd)
					set stat = uar_srvsetdouble(hmedr,"initial_volume",other->dInitialVolume)
					set stat = uar_srvsetdouble(hmedr,"infusion_rate",other->dRate)
					set stat = uar_srvsetdouble(hmedr,"infusion_unit_cd",other->dRateUnitCd)
					set stat = uar_srvsetstring(hmedr,"substance_lot_number",nullterm(cnvtstring(other->iBagNumber)))
					set stat = uar_srvsetdouble(hmedr,"iv_event_cd",other->dActionEventCd)
					set stat = uar_srvsetdouble(hmedr,"infused_volume_unit_cd",other->dInitialVolumeUnitCd)
					set stat = uar_srvsetlong(hmedr,"admin_start_tz",other->iTimeZone)
				endif
 
				; Comments
				if(input->sComments > " ")
					declare final_comment = vc
					declare final_comment_size = i4
 
					set final_comment = nullterm(build2("{\rtf1\ansi\ansicpg1252\deff0\deflang1033{\fonttbl"
												,"{\f0\fnil\fcharset0 Segoe UI;}}\viewkind4\"
														,"uc1\pard\f0\fs20 ",nullterm(input->sComments),"\par"))
					set final_comment_size = textlen(final_comment)
 
					set henote = uar_srvadditem(hce,"event_note_list")
					if(henote)
						set stat = uar_srvsetdouble(henote,"note_type_cd",c_rescomment_note_type_cd)
						set stat = uar_srvsetdouble(henote,"note_format_cd",c_rtf_note_format_cd)
						set stat = uar_srvsetdouble(henote,"entry_method_cd",c_unknown_entry_method_cd)
						set stat = uar_srvsetdouble(henote,"note_prsnl_id",input->dClinicianId)
						set stat = uar_srvsetdate(henote,"note_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
						set stat = uar_srvsetdouble(henote,"record_status_cd",c_active_record_status_cd)
						set stat = uar_srvsetdouble(henote,"compression_cd",c_ocf_compression_cd)
						set stat = uar_srvsetasis(henote,"long_blob",final_comment,final_comment_size)
 						set stat = uar_srvsetlong(henote,"note_tz",other->iTimeZone)
					else
						call ErrorMsg("Could not create henote.","9999","E")
					endif
				endif
 
				; Event Prsnl List
				if(input->dWitnessId > 0)
					set ePrsnlSize = 4
				else
					set ePrsnlSize = 3
				endif
				for(i = 1 to ePrsnlSize )
					set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
					if(hprsnl)
						set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl,"action_tz",other->iTimeZone)
 
						case(i)
							of 1: ;Perform
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_perform_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
							of 2: ;Verify
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_verify_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
							of 3: ;Order
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_order_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(600578_rep->orig_order_dt_tm))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",600578_rep->order_provider_id)
							of 4: ;Witness
								 if(input->dWitnessId > 0)
								 	set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_witness_action_type_cd)
									set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
									set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dWitnessId)
								 endif
						endcase
					else
						call ErrorMsg("Could not create hprsnl","9999","E")
					endif
				endfor
 
				; Intake Output Result
				if(input->sIVEvent in ("BOLUS","INFUSE"))
					set hio = uar_srvadditem (hce ,"intake_output_result")
					if(hio)
						set stat = uar_srvsetdate(hio,"io_start_dt_tm",cnvtdatetime(input->qAdminStartDateTime))
						set stat = uar_srvsetdate(hio,"io_end_dt_tm",cnvtdatetime(input->qAdminEndDateTime))
						set stat = uar_srvsetshort(hio,"io_type_flag",1) ;0-Not Defined, 1-Intake, 2-Output
						set stat = uar_srvsetdouble(hio,"io_volume",input->dVolume)
						set stat = uar_srvsetdouble(hio,"io_status_cd",c_confirmed_io_status_cd)
						set stat = uar_srvsetdouble(hio,"reference_event_cd",c_ivparent_event_cd)
						set stat = uar_srvsetdouble(hio,"replacement_event_id",1.0)
					else
						call ErrorMsg("Could not create hio.","9999","E")
					endif
 				endif
 
				; Child Event
				set hce_type = uar_srvcreatetypefrom (hreq ,"clin_event" )
				set hce_struct = uar_srvgetstruct (hreq ,"clin_event" )
				set stat = uar_srvbinditemtype (hce_struct ,"child_event_list",hce_type)
 
				for(c = 1 to size(600578_rep->ingred_qual,5))
					set hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
					if(hce2)
						call uar_srvbinditemtype (hce2 ,"child_event_list",hce_type )
						set stat = uar_srvsetlong(hce2,"view_level",1)
						set stat = uar_srvsetdouble(hce2,"order_id",input->dOrderId)
						set stat = uar_srvsetdouble(hce2,"catalog_cd",600578_rep->ingred_qual[c].catalog_cd)
						set stat = uar_srvsetdouble(hce2,"person_id",600578_rep->person_id)
						set stat = uar_srvsetdouble(hce2,"encntr_id",600578_rep->encntr_id)
						set stat = uar_srvsetdouble(hce2,"contributor_system_cd",input->dSystemId)
						set stat = uar_srvsetdouble(hce2,"parent_event_id",-1.0)
						set stat = uar_srvsetdouble(hce2,"event_class_cd",c_med_event_class_cd)
						set stat = uar_srvsetdouble(hce2,"event_cd",600578_rep->ingred_qual[c].event_cd)
 
						if(input->sReferenceNumber > " ")
							set other->sRefNumberStr = build2(input->sReferenceNumber,"!",cnvtstring(c))
							set stat = uar_srvsetstring(hce2,"reference_nbr",nullterm(other->sRefNumberStr))
							set stat = uar_srvsetstring(hce2,"series_ref_nbr",nullterm(other->sRefNumberStr))
						endif
 
						;Event Tag
						declare amt = f8
						declare amt_unit = f8
						if(600578_rep->ingred_qual[c].strength > 0)
							set amt = 600578_rep->ingred_qual[c].strength
							set amt_unit = 600578_rep->ingred_qual[c].strength_unit
						else
							set amt = 600578_rep->ingred_qual[c].volume
							set amt_unit = 600578_rep->ingred_qual[c].volume_unit
						endif
						case(input->sIVEvent)
							of "BEGINBAG":
								set event_tag = build2(trim(uar_get_code_display(other->dActionEventCd),3), " ",BuildEventTag(amt,amt_unit))
							of "INFUSE":
								set event_tag = BuildEventTag(amt,amt_unit)
							of "BOLUS":
								set event_tag = BuildEventTag(amt,amt_unit)
							of "RATECHANGE":
								set event_tag = ""
							of "SITECHANGE":
								set event_tag = uar_get_code_display(input->dSiteCd)
 						endcase
						set stat = uar_srvsetstring(hce,"event_tag",nullterm(event_tag))
 
						set stat = uar_srvsetdate(hce2,"event_start_dt_tm",cnvtdatetime(input->qAdminStartDateTime))
						set stat = uar_srvsetdate(hce2,"event_end_dt_tm",cnvtdatetime(input->qAdminEndDateTime))
						set stat = uar_srvsetdouble(hce2,"record_status_cd",c_active_record_status_cd)
						set stat = uar_srvsetdouble(hce2,"result_status_cd",c_auth_result_status_cd)
						set stat = uar_srvsetshort(hce2,"authentic_flag",1)
						set stat = uar_srvsetshort(hce2,"publish_flag",1)
						set stat = uar_srvsetstring(hce2,"event_title_text",nullterm(uar_get_code_display(600578_rep->ingred_qual[c].catalog_cd)))
						set stat = uar_srvsetstring(hce2,"collating_seq",nullterm(GetCollatingSeq(null)))
						set stat = uar_srvsetlong(hce2,"order_action_sequence",600578_rep->last_action_sequence)
						set stat = uar_srvsetlong(hce2,"event_start_tz",other->iTimeZone)
						set stat = uar_srvsetlong(hce2,"event_end_tz",other->iTimeZone)
						set stat = uar_srvsetdouble(hce2,"updt_id",input->dClinicianId)
 
						;Med Result List
						set hmed = uar_srvadditem(hce2 ,"med_result_list")
						if(hmed)
							set stat = uar_srvsetshort(hmed,"ensure_type",2)
							set stat = uar_srvsetdate(hmed,"admin_start_dt_tm",cnvtdatetime(input->qAdminStartDateTime))
							set stat = uar_srvsetdouble(hmed,"admin_route_cd",other->dAdminRouteCd)
							set stat = uar_srvsetdouble(hmed,"admin_site_cd",input->dSiteCd)
							set stat = uar_srvsetdouble(hmed,"initial_dosage",amt)
							set stat = uar_srvsetdouble(hmed,"dosage_unit_cd",amt_unit)
 
							/* Ingredient type flag
							          0.00	Not Set
							          1.00	Medication
							          2.00	Base
							          3.00	Additive
							          4.00	Compound Parent
							          5.00	Compound Child
							*/
							if(600578_rep->ingred_qual[c].ingredient_type_flag in (2,3))
								set stat = uar_srvsetdouble(hmed,"diluent_type_cd",600578_rep->ingred_qual[c].event_cd)
							endif
							set stat = uar_srvsetstring(hmed,"substance_lot_number",nullterm(cnvtstring(other->iBagNumber)))
							set stat = uar_srvsetdouble(hmed,"iv_event_cd",other->dActionEventCd)
							set stat = uar_srvsetdouble(hmed,"infused_volume_unit_cd",other->dInitialVolumeUnitCd)
							set stat = uar_srvsetdouble(hmed,"synonym_id",600578_rep->ingred_qual[c].synonym_id)
							set stat = uar_srvsetlong(hmed,"admin_start_tz",other->iTimeZone)
						else
							call ErrorMsg("Could not create hmed.","9999","E")
						endif
 
						;setting med_admin_reltn_list
				  		if(size(input->sMedicationBarcode) > 0)
				  			set hmar2 = uar_srvadditem(hce2,"med_admin_reltn_list")
				  			if(hmar2)
				  				set stat = uar_srvsetdouble(hmar2,"med_admin_reltn",1.0)
				  			else
				  				call ErrorMsg("Could not create hmar2.","9999","E")
				  			endif
 				  		endif
					else
						call ErrorMsg("Could not create hce2.","9999","E")
					endif
				endfor
			else
				call ErrorMsg("Could not create HCE.","9999","E")
			endif
		endif
 
		; Execute request
		set crmstatus = uar_crmperform (hstep)
		if ((crmstatus = 0 ) )
			set hreply = uar_crmgetreply (hstep )
			if ((hreply > 0 ) )
 
				;Rep
				set rep_cnt = uar_srvgetitemcount(hreply,"rep")
				if(rep_cnt > 0)
					set hrep = uar_srvgetitem(hreply,"rep", 0)
 
					;Rb
					set rb_cnt = uar_srvgetitemcount(hrep,"rb_list")
					set stat = alterlist(temp->list,rb_cnt)
					if(rb_cnt > 0)
						for(i = 1 to rb_cnt)
							set hrb = uar_srvgetitem(hrep,"rb_list",i-1)
							set temp->list[i].event_id = uar_srvgetdouble(hrb,"event_id")
 
							; Set administration id
 							set medadmin_reply_out->administration_id = uar_srvgetdouble(hrb,"parent_event_id")
						endfor
					else
						call ErrorMsg("Rb_list is empty. Could not post administration event.","9999","E")
					endif
				else
					call ErrorMsg("Rep list is empty. Could not post administration event.","9999","E")
				endif
			else
				call ErrorMsg("Failed to create hreply.","9999","E")
			endif
		else
			call ErrorMsg("Failed to execute request 1000071.","9999","E")
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostMedAdmin Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateBagsGiven(null) = i2	- 560312 - oar_update_bags_given
;  Description: Update # of Bags Given
**************************************************************************/
subroutine UpdateBagsGiven(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateBagsGiven Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 560312
 
	;Setup request
 	set stat = alterlist(560312_req->iv_orders,1)
 	set 560312_req->iv_orders[1].order_id = input->dOrderId
 	set 560312_req->iv_orders[1].bags_given.bags_given_cnt = 1
 	set stat = alterlist(560312_req->iv_orders[1].bags_given.begin_bag_events,1)
 	set 560312_req->iv_orders[1].bags_given.begin_bag_events[1].event_id = medadmin_reply_out->administration_id
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560312_req,"REC",560312_rep)
 	call echorecord(560312_req)
 	call echorecord(560312_rep)
	if(560312_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateBagsGiven Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: CreatePharmacyCharge(null) = i2  - 305660 - PHA.AdminCharge
;  Description: Creates the charge for the med administration
**************************************************************************/
subroutine CreatePharmacyCharge(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreatePharmacyCharge Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 305660
	set iRequest = 305660
 
	;Setup request
	set stat = alterlist(305660_req->qual,1)
	set 305660_req->qual[1].order_id = input->dOrderId
	set 305660_req->qual[1].action_sequence = 600578_rep->last_action_sequence
	set 305660_req->qual[1].event_id = medadmin_reply_out->administration_id
	set 305660_req->qual[1].dispense_type_cd = c_chgonadmin_dispense_type_cd
	set 305660_req->qual[1].route_cd = other->dAdminRouteCd
	set 305660_req->qual[1].admin_dt_tm = input->qAdminStartDateTime
	set 305660_req->qual[1].prsnl_id = input->dClinicianId
	set 305660_req->qual[1].ingred_action_seq = 600578_rep->ingred_action_seq
	set stat = alterlist(305660_req->qual[1].ingred_list, size(600578_rep->ingred_qual,5))
	for(i = 1 to size(600578_rep->ingred_qual,5))
		set 305660_req->qual[1].ingred_list[i].comp_sequence = 600578_rep->ingred_qual[1].comp_sequence
		set 305660_req->qual[1].ingred_list[i].dose = other->dInitialVolume
		set 305660_req->qual[1].ingred_list[i].dose_unit_cd = other->dInitialVolumeUnitCd
	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",305660_req,"REC",305660_rep)
 
 	if(305660_rep->status_data.status != "F")
 		set iValidate = 1
 	endif
	if(iDebugFlag > 0)
		call echo(concat("CreatePharmacyCharge Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostMedAdminAudit(null) = i2 with protect	;600905 - dcp_add_audit_info
;  Description: Add med admin audit data
**************************************************************************/
subroutine PostMedAdminAudit(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostMedAdminAudit Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600905
	set iRequest = 600905
 
	declare freeTextReasonCd = f8
	select into "nl:"
	from code_value_extension cve
	where cve.code_set = 4003287
		and cve.field_name = "freetext_reason"
	detail
		freeTextReasonCd = cve.code_value
	with nocounter
 
	;Setup request
	set stat = alterlist(600905_req->admin_events,1)
	set 600905_req->admin_events[1].source_application_flag = 0
	set 600905_req->admin_events[1].event_id = medadmin_reply_out->administration_id
	set 600905_req->admin_events[1].order_id = input->dOrderId
	set 600905_req->admin_events[1].documented_action_seq = 2
	set 600905_req->admin_events[1].clinical_warning_cnt = 1
	set 600905_req->admin_events[1].prsnl_id = input->dClinicianId
	set 600905_req->admin_events[1].position_cd = other->dPositionCd
	set 600905_req->admin_events[1].nurse_unit_cd = other->dNurseUnitCd
	set 600905_req->admin_events[1].event_dt_tm = cnvtdatetime(input->qDocumentedDateTime)
 
 
	set 600905_req->admin_events[1].event_type_cd = c_taskcomplete_alert_type_cd
	set 600905_req->admin_events[1].order_result_variance = other->iMedChanged
 
 	; Patient Scan error
	if(input->iPatientScanned = 1)
		set 600905_req->admin_events[1].positive_pt_identification = 1
	else
		set maSize = size(600905_req->med_admin_alerts,5)
		set maSize  = maSize + 1
		set stat = alterlist(600905_req->med_admin_alerts,maSize)
		set 600905_req->med_admin_alerts[maSize].source_application_flag = 0
		set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_ppidover_alert_type_cd
		set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_minor_alert_severity_cd
		set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
		set 600905_req->med_admin_alerts[maSize].position_cd = other->dPositionCd
		set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = other->dNurseUnitCd
		set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qDocumentedDateTime)
		set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_pt_error,1)
		set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].expected_pt_id = 600578_rep->person_id
		set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].identified_pt_id = input->dPatientId
 
		if(input->dPatientNotScannedReasonCd > 0)
			set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].reason_cd = input->dPatientNotScannedReasonCd
		else
			set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].reason_cd = freeTextReasonCd
			set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].freetext_reason = input->sMedicationNotScannedReason
		endif
 
	 	; Medication Scan error
		if(input->iMedicationScanned = 1)
			set 600905_req->admin_events[1].positive_med_identification = 1
		else
	 		set maSize = size(600905_req->med_admin_alerts,5)
			set maSize  = maSize + 1
			set stat = alterlist(600905_req->med_admin_alerts,maSize)
			set 600905_req->med_admin_alerts[maSize].source_application_flag = 0
			set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_medscanover_alert_type_cd
			set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_minor_alert_severity_cd
			set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
			set 600905_req->med_admin_alerts[maSize].position_cd = other->dPositionCd
			set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = other->dNurseUnitCd
			set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qDocumentedDateTime)
			set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error,1)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].person_id = input->dPatientId
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].encounter_id = 600578_rep->encntr_id
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].order_id = input->dOrderId
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].action_sequence = 600578_rep->last_action_sequence
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_route_cd = other->dAdminRouteCd
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].event_id = medadmin_reply_out->administration_id
 
			set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds,1)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[1].strength_unit_cd =
				other->dInitialVolumeUnitCd
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[1].volume_unit_cd =
				other->dInitialVolumeUnitCd
 
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_dt_tm = cnvtdatetime(other->qTaskSchedDtTm)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_tz = other->iTaskSchedTz
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_dt_tm = input->qAdminStartDateTime
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = other->iTimeZone
 
			if(input->dMedicationNotScannedReasonCd > 0)
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = input->dMedicationNotScannedReasonCd
			else
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = freeTextReasonCd
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].freetext_reason = input->sMedicationNotScannedReason
			endif
		endif
 	endif
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600905_req,"REC",600905_req)
 
 	; Check the update occurred
 	call pause(5) ;5 second delay
 
 	select into "nl:"
 	from med_admin_event mae
 	where mae.event_id =  medadmin_reply_out->administration_id
 	and mae.updt_dt_tm > cnvtlookbehind("1,MIN",cnvtdatetime(curdate,curtime3))
 	detail
 		iValidate = 1
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("PostMedAdminAudit Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateAdminTask(null) = i2 with protect	;560303 - DCP.ModTask
;  Description: Update status of administration task
**************************************************************************/
subroutine UpdateAdminTask(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateAdminTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 560300
	set iRequest = 560303
 
	;Setup request
	set stat = alterlist(560303_req->mod_list,1)
	set 560303_req->mod_list[1].task_id = input->dScheduledAdministrationId
	set 560303_req->mod_list[1].task_status_meaning = "COMPLETE"
	set 560303_req->mod_list[1].task_dt_tm = cnvtdatetime(input->qDocumentedDateTime)
	set 560303_req->mod_list[1].task_status_reason_cd = c_dcpchart_task_status_reason_cd
	set 560303_req->mod_list[1].task_status_reason_meaning = uar_get_code_meaning(c_dcpchart_task_status_reason_cd)
	set 560303_req->mod_list[1].event_id = medadmin_reply_out->administration_id
	set 560303_req->mod_list[1].performed_prsnl_id = input->dClinicianId
	set 560303_req->mod_list[1].performed_dt_tm = cnvtdatetime(input->qDocumentedDateTime)
	set stat = alterlist(560303_req->workflow,1)
	set 560303_req->workflow[1].bagCountingInd = 1
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560303_req,"REC",560303_rep)
 
	if(560303_rep->task_status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateAdminTask Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: CreateInfusionTask(null) = i2 with protect ;601577 - bsc_generate_infusion_task
;  Description: Create infusion task if applicable
**************************************************************************/
subroutine CreateInfusionTask(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreateInfusionTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 560300
	set iRequest = 601577
 
	;Setup request
	set stat = alterlist(601577_req->order_list,1)
	set 601577_req->order_list[1].order_id = input->dOrderId
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",601577_req,"REC",601577_rep)
 
	if(601577_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CreateInfusionTask Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
 
/*************************************************************************
;  Name: GetCollatingSeq(null) = vc
;  Description: Return the collating sequence string
**************************************************************************/
subroutine GetCollatingSeq(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCollatingSeq Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare prefix = vc with protect, constant("0000000001;-")
	declare collating_str = vc
	set other->iCollatingSeq = other->iCollatingSeq + 1
	set collating_str = build(prefix, cnvtstring(other->iCollatingSeq))
 
	if(iDebugFlag > 0)
		call echo(build("collating_str: ",collating_str))
 
		call echo(concat("GetCollatingSeq Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(collating_str)
end ;End Subroutine
 
/*************************************************************************
;  Name: BuildEventTag(number = f8, codevalue = f8) = vc
;  Description: Return properly formatted event tag text
**************************************************************************/
subroutine BuildEventTag(number, codevalue)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildEventTag Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	declare event_tag_str = vc
 	declare numberStr = vc
 
	set numberStr = trim(nullterm(cnvtstring(number)),3)
	if(size(numberStr) < 4)
		set event_tag_str = build2(numberStr," ",trim(uar_get_code_display(codevalue),3))
	elseif(size(numberStr) < 7)
		set event_tag_str = build2(format(numberStr,"###,###;;c")," ",trim(uar_get_code_display(codevalue),3))
	else
		set event_tag_str = build2(format(numberStr,"###,###,###;;c")," ",trim(uar_get_code_display(codevalue),3))
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("BuildEventTag Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(event_tag_str)
end ;End Subroutine
 
 
end go
 
