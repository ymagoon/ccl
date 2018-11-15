/***********************************************************************
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
************************************************************************
      Source file name: snsro_post_med_admin.prg
      Object name:      snsro_post_med_admin
      Program purpose:  POST a medication administration in Millennium
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 10/19/18 RJC		Initial Write
 ************************************************************************/
drop program snsro_post_med_admin go
create program snsro_post_med_admin
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        			;Required
		, "PatientId" = ""					;Required
		, "PatientIdType" = ""				;Optional
		, "OrderId" = ""					;Required
		, "ScheduledAdministrationId" = ""	;Required
		, "PatientScanned" = ""				;Required
		, "PatientNotScannedReason" = ""	;Required if patientScanned = 0
		, "MedicationScanned" = ""			;Required
		, "MedicationNotScannedReason" = ""	;Required if medicationScanned = 0
		, "ClinicianId" = ""				;Required
		, "AdminDateTime" = ""				;Optional - assume now if not provided
		, "DocumentedDateTime" = ""			;Optional - assume now if not provided
		, "Action" = ""						;Optional
		, "Comments" = ""					;Optional
		, "Route" = ""						;Required
		, "Site" = ""						;Required
		, "Rate" = ""						;Optional
		, "RateUnit" = ""					;Optional
		, "Dose" = ""						;Required
		, "DoseUnit" = ""					;Required
		, "Volume" = ""						;Required if volume based med
		, "VolumeUnit" = ""					;Required if volume based med
		, "Duration" = ""					;Optional
		, "DurationUnit" = ""				;Optional
		, "IsNotGiven" = ""					;Optional
		, "ReasonNotGiven" = ""				;Optional
		, "Debug" = 0						;Optional
 
 
with OUTDEV, USERNAME, PATIENTID, PATIENTIDTYPE, ORDERID, SCHEDADMINID, PATIENTSCANNED, PATNOTSCANREASON,
MEDICATIONSCANNED, MEDNOTSCANREASON, CLINICIANID, ADMINDATETIME, DOCUMENTEDDATETIME, ACTION, COMMENTS,
ROUTE, SITE, RATE, RATEUNIT, DOSE, DOSEUNIT, VOLUME, VOLUMEUNIT, DURATION, DURATIONUNIT, ISNOTGIVEN,
REASONNOTGIVEN, DEBUG_FLAG
 
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
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;600906 - bsc_get_code_value_by_ext
free record 600906_req
record 600906_req (
  1 code_set = i4
  1 field_name = vc
  1 get_all_values = i2
)
free record 600906_rep
record 600906_rep (
   1 qual [* ]
     2 code_value = f8
     2 field_name = c32
     2 code_set = i4
     2 field_type = i4
     2 field_value = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
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
 
;601571 - bsc_get_med_interval
free record 601571_req
record 601571_req (
	1 frequency_schedule_list [*]
		2 frequency_schedule_id = f8
	1 order_list [*]
		2 order_id = f8
	1 facility_cd = f8
)
free record 601571_rep
record 601571_rep (
   1 frequency_min_list [* ]
     2 frequency_schedule_id = f8
     2 order_id = f8
     2 interval_minutes = i4
     2 frequency_cd = f8
   1 administration_grace_period = i4
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
 
;560307 - DCP.QueryTasks
free record 560307_req
record 560307_req (
  1 task_list [*]
    2 task_id = f8
  1 assign_prsnl_list [*]
    2 assign_prsnl_id = f8
  1 person_list [*]
    2 person_id = f8
  1 location_list [*]
    2 location_cd = f8
  1 order_list [*]
    2 order_id = f8
  1 encntr_list [*]
    2 encntr_id = f8
  1 event_list [*]
    2 event_id = f8
  1 task_status_list [*]
    2 status_cd = f8
  1 task_class_list [*]
    2 class_cd = f8
  1 task_type_list [*]
    2 task_type_cd = f8
  1 assign_prsnl_only_ind = i2
  1 user_position_cd = f8
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
  1 force_encounter_sec_ind = i2
  1 dcp_task_limit = i4
  1 get_encounter_info = i2
  1 get_ce_med_result_info = i2
  1 get_person_info = i2
  1 get_prsnl_info = i2
  1 get_order_info = i2
  1 get_floating_dosage_info = i2
  1 ignore_beg_dt_on_overdue_ind = i2
  1 ignore_beg_dt_on_working_ind = i2
  1 get_pathway_info = i2
  1 get_container_info = i2
  1 get_protocol_order_info = i2
)
free record 560307_rep
record 560307_rep (
  1 task_list [*]
    2 task_id = f8
    2 catalog_type_cd = f8
    2 catalog_type_disp = vc
    2 catalog_type_mean = vc
    2 catalog_cd = f8
    2 stat_ind = i2
    2 location_cd = f8
    2 location_disp = vc
    2 location_mean = vc
    2 reference_task_id = f8
    2 task_type_cd = f8
    2 task_type_disp = vc
    2 task_type_mean = vc
    2 task_class_cd = f8
    2 task_class_disp = vc
    2 task_class_mean = vc
    2 task_status_cd = f8
    2 task_status_mean = vc
    2 task_status_disp = vc
    2 task_status_reason_cd = f8
    2 task_status_reason_mean = vc
    2 task_status_reason_disp = vc
    2 task_dt_tm = dq8
    2 task_tz = i4
    2 event_id = f8
    2 task_activity_cd = f8
    2 task_activity_disp = vc
    2 task_activity_mean = vc
    2 msg_text_id = f8
    2 msg_subject_cd = f8
    2 msg_subject = vc
    2 msg_sender_id = f8
    2 msg_sender_name = vc
    2 confidential_ind = i2
    2 read_ind = i2
    2 delivery_ind = i2
    2 event_class_cd = f8
    2 event_class_disp = vc
    2 event_class_mean = vc
    2 task_create_dt_tm = dq8
    2 updt_cnt = i2
    2 updt_dt_tm = dq8
    2 updt_id = f8
    2 reschedule_ind = i2
    2 reschedule_reason_cd = f8
    2 reschedule_reason_disp = vc
    2 reschedule_reason_mean = vc
    2 template_task_flag = i2
    2 task_description = vc
    2 chart_not_cmplt_ind = i2
    2 quick_chart_done_ind = i2
    2 quick_chart_notdone_ind = i2
    2 quick_chart_ind = i2
    2 allpositionchart_ind = i2
    2 event_cd = f8
    2 reschedule_time = i4
    2 cernertask_flag = i2
    2 ability_ind = i2
    2 dcp_forms_ref_id = f8
    2 capture_bill_info_ind = i2
    2 order_id = f8
    2 order_comment_ind = i2
    2 order_comment_text = vc
    2 order_status_cd = f8
    2 template_order_id = f8
    2 stop_type_cd = f8
    2 projected_stop_dt_tm = dq8
    2 projected_stop_tz = i4
    2 comment_type_mask = i4
    2 hna_mnemonic = vc
    2 order_mnemonic = vc
    2 ordered_as_mnemonic = vc
    2 additive_cnt = i4
    2 order_detail_display_line = vc
    2 order_provider_id = f8
    2 order_dt_tm = dq8
    2 order_tz = i4
    2 activity_type_cd = f8
    2 ref_text_mask = i4
    2 cki = vc
    2 need_rx_verify_ind = i2
    2 orderable_type_flag = i4
    2 need_nurse_review_ind = i2
    2 freq_type_flag = i4
    2 current_start_dt_tm = dq8
    2 current_start_tz = i4
    2 template_order_flag = i4
    2 parent_order_status_cd = f8
    2 parent_need_rx_verify_ind = i2
    2 parent_need_nurse_review_ind = i2
    2 parent_freq_type_flag = i4
    2 parent_stop_type_cd = f8
    2 parent_current_start_dt_tm = dq8
    2 parent_current_start_tz = i4
    2 parent_projected_stop_dt_tm = dq8
    2 parent_projected_stop_tz = i4
    2 route_detail_display = vc
    2 freq_detail_display = vc
    2 rsn_detail_display = vc
    2 frequency_cd = f8
    2 encntr_id = f8
    2 loc_room_cd = f8
    2 loc_room_disp = vc
    2 loc_room_mean = vc
    2 loc_bed_cd = f8
    2 loc_bed_disp = vc
    2 loc_bed_mean = vc
    2 isolation_cd = f8
    2 isolation_disp = vc
    2 isolation_mean = vc
    2 med_order_type_cd = f8
    2 finnbr = vc
    2 mrn = vc
    2 person_id = f8
    2 person_name = vc
    2 updt_person_name = vc
    2 infusion_rate = f8
    2 infusion_unit_cd = f8
    2 initial_dosage = f8
    2 initial_volume = f8
    2 admin_dosage = f8
    2 admin_site_cd = f8
    2 dosage_unit_cd = f8
    2 iv_event_cd = f8
    2 last_done_dt_tm = dq8
    2 last_done_tz = i4
    2 response_required_flag = i2
    2 ignore_req_ind = i2
    2 task_priority_cd = f8
    2 task_priority_disp = vc
    2 task_priority_mean = vc
    2 task_security_flag = i2
    2 assign_prsnl_list [*]
      3 assign_prsnl_id = f8
      3 assign_prsnl_name = vc
      3 updt_cnt = i4
    2 charted_by_agent_cd = f8
    2 charted_by_agent_identifier = vc
    2 charting_context_reference = vc
    2 charting_agent_list [*]
      3 charting_agent_cd = f8
      3 charting_agent_entity_name = vc
      3 charting_agent_entity_id = f8
      3 charting_agent_identifier = vc
    2 result_set_id = f8
    2 grace_period_mins = i4
    2 link_nbr = f8
    2 link_type_flag = i2
    2 scheduled_dt_tm = dq8
    2 template_core_action_sequence = i4
    2 need_rx_clin_review_flag = i2
    2 comments = vc
    2 suggested_entity_name = vc
    2 suggested_entity_id = f8
    2 source_tag = vc
    2 performed_prsnl_id = f8
    2 performed_prsnl_name = vc
    2 last_action_sequence = i4
    2 pathway_catalog_id = f8
    2 container_id = f8
    2 spec_cntnr_cd = f8
    2 volume = f8
    2 units_cd = f8
    2 accession_container_nbr = i4
    2 parent_container_id = f8
    2 accession = vc
    2 specimen_type_cd = f8
    2 protocol_order_info [*]
      3 warning_type_list [*]
        4 protocol_patient_mismatch_ind = i2
    2 pathway_info [*]
      3 pathway_type_cd = f8
  1 more_data_ind = i2
  1 status_data
    2 status = vc
    2 subeventstatus
      3 OperationName = c15
      3 OperationStatus = vc
      3 TargetObjectName = c15
      3 TargetObjectValue = vc
)
 
;600345 - dcp_events_ensured (no reply record)
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
	1 iPatientScanned					= i2
	1 sPatientNotScannedReason			= vc
	1 dPatientNotScannedReasonCd		= f8
	1 iMedicationScanned				= i2
	1 sMedicationNotScannedReason		= vc
	1 dMedicationNotScannedReasonCd		= f8
	1 dClinicianId						= f8
	1 qAdminDateTime					= dq8
	1 qDocumentedDateTime				= dq8
	1 dScheduledAdministrationId		= f8
	1 dActionCd							= f8 ;Admin_Method_cd (ce_med_result table)
	1 sComments							= vc
	1 dRouteCd							= f8
	1 dSiteCd							= f8
	1 dRate								= f8
	1 dRateUnitCd						= f8
	1 dDose								= f8
	1 dDoseUnitCd						= f8
	1 dVolume							= f8
	1 dVolumeUnitCd						= f8
	1 dDuration							= f8
	1 dDurationUnitCd					= f8
	1 iIsNotGiven						= i2
	1 dReasonNotGiven					= f8
)
 
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Other
declare dPrsnlId						= f8 with protect, noconstant(0)
declare dPositionCd						= f8 with protect, noconstant(0)
declare iInfusedVolume					= i2 with protect, noconstant(0)
declare iMedChanged						= i2 with protect, noconstant(0)
declare iMedIntervalViolation			= i2 with protect, noconstant(0)
declare dTaskEventId					= f8 with protect, noconstant(0)
declare iSiteRequired					= i2 with protect, noconstant(0)
declare qTaskSchedDtTm					= dq8 with protect, noconstant(0)
declare iTaskSchedTz					= i4 with protect, noconstant(0)
declare dFacilityCd 					= f8 with protect, noconstant(0.0)
declare dNurseUnitCd 					= f8 with protect, noconstant(0.0)
declare qNextScheduledDttm				= dq8 with protect, noconstant(0)
 
; Constants
declare c_error_handler 				= vc with protect, constant("POST MEDICATION ADMIN")
declare c_active_record_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_auth_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_unauth_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"UNAUTH"))
declare c_altered_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"ALTERED"))
declare c_modified_result_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",8,"MODIFIED"))
declare c_notdone_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"NOT DONE"))
declare c_grp_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_med_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"MED"))
declare c_perform_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_verify_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_order_action_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",21,"ORDER"))
declare c_completed_action_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_medadmin_entry_mode_cd		= f8 with protect, constant(uar_get_code_by("MEANING",29520,"MEDADMIN"))
declare c_medadmin_entry_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",255431,"MEDADMIN"))
declare c_rescomment_note_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_rtf_note_format_cd			= f8 with protect, constant(uar_get_code_by("MEANING",23,"RTF"))
declare c_unknown_entry_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_ocf_compression_cd			= f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
declare c_dcpchart_task_status_reason_cd = f8 with protect, constant(uar_get_code_by("MEANING",14024,"DCP_CHART"))
declare c_dcpnotdone_task_status_reason_cd = f8 with protect, constant(uar_get_code_by("MEANING",14024,"DCP_NOTDONE"))
declare c_ppidover_alert_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"PPIDOVER"))
declare c_medscanover_alert_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"MEDSCANOVER"))
declare c_taskcomplete_alert_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"TASKCOMPLETE"))
declare c_notgiven_alert_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"NOTGIVEN"))
declare c_medinterval_alert_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"MEDINTALERT"))
declare c_minor_alert_severity_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000041,"MINOR"))
declare c_dcpgeneric_event_cd 			= f8 with protect, noconstant(uar_get_code_by("DISPLAYKEY",72,"DCPGENERICCODE"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set input->sUserName					= trim($USERNAME,3)
set input->sPatientId					= trim($PATIENTID,3)
set input->dPatientIdTypeCd				= cnvtreal($PATIENTIDTYPE)
set input->dOrderId						= cnvtreal($ORDERID)
set input->iPatientScanned				= cnvtint($PATIENTSCANNED)
set input->sPatientNotScannedReason		= trim($PATNOTSCANREASON,3)
set input->dPatientNotScannedReasonCd	= cnvtreal($PATNOTSCANREASON)
set input->iMedicationScanned			= cnvtint($MEDICATIONSCANNED)
set input->sMedicationNotScannedReason	= trim($MEDNOTSCANREASON,3)
set input->dMedicationNotScannedReasonCd = cnvtreal($MEDNOTSCANREASON)
set input->dClinicianId					= cnvtreal($CLINICIANID)
set input->qAdminDateTime				= GetDateTime($ADMINDATETIME)
set input->qDocumentedDateTime			= GetDateTime($DOCUMENTEDDATETIME)
set input->dScheduledAdministrationId	= cnvtreal($SCHEDADMINID)
set input->dActionCd					= cnvtreal($ACTION)
set input->sComments					= trim($COMMENTS,3)
set input->dRouteCd						= cnvtreal($ROUTE)
set input->dSiteCd						= cnvtreal($SITE)
set input->dRate						= cnvtreal($RATE)
set input->dRateUnitCd					= cnvtreal($RATEUNIT)
set input->dDose						= cnvtreal($DOSE)
set input->dDoseUnitCd					= cnvtreal($DOSEUNIT)
set input->dVolume						= cnvtreal($VOLUME)
set input->dVolumeUnitCd				= cnvtreal($VOLUMEUNIT)
set input->dDuration					= cnvtreal($DURATION)
set input->dDurationUnitCd				= cnvtreal($DURATIONUNIT)
set input->iIsNotGiven					= cnvtint($ISNOTGIVEN)
set input->dReasonNotGiven				= cnvtreal($REASONNOTGIVEN)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId 							= GetPrsnlIDfromUserName(input->sUserName)
if(input->dClinicianId = 0)
	set input->dClinicianId = dPrsnlId
endif
set dPositionCd 						= GetPositionByPrsnlId(input->dClinicianId)
 
if(iDebugFlag > 0)
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("dPositionCd -> ",dPositionCd))
	call echorecord(input)
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) = null with protect
declare ValidateSite(null)			= i2 with protect ;601571 - bsc_get_med_interval
declare GetOrderDetails(null)		= i2 with protect	;600578 - dcp_get_ord_dtls_for_charting
declare CheckMedicationInterval(null) = i2 with protect	;601571 - bsc_get_med_interval
declare GetPrsnlReltn(null)			= i2 with protect	;600320 - pts_get_ppr_yn
declare GetPrivileges(null)			= i2 with protect	;680500 - MSVC_GetPrivilegesByCodes
declare CheckPrivileges(null) 		= i2 with protect 	;680501 - MSVC_CheckPrivileges
declare GetMedTasks(null)			= i2 with protect	;560307 - DCP.QueryTasks
declare PostMedAdmin(null)			= null with protect	;1000071 - event_batch_ensure
declare EnsureEvents(null)			= null with protect	;600345 - dcp_events_ensured
declare CreatePharmacyCharge(null)	= i2 with protect	;305660 - PHA.AdminCharge
declare UpdateAdminTask(null)		= i2 with protect	;560303 - DCP.ModTask
declare CreateInfusionTask(null)	= i2 with protect 	;601577 - bsc_generate_infusion_task
declare PostMedAdminAudit(null)		= i2 with protect	;600905 - dcp_add_audit_info
 
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
 
; Verify required parameters exist
if(input->dPatientId = 0) call ErrorMsg("PatientId","2055","M") endif
if(input->dOrderId = 0) call ErrorMsg("OrderId","2055","M") endif
if(input->dScheduledAdministrationId = 0) call ErrorMsg("ScheduledAdministrationId","2055","M") endif
if(input->dClinicianId = 0) call ErrorMsg("ClinicianId","2055","M") endif
if(input->dDose = 0 and input->dVolume = 0) call ErrorMsg("Dose and/or Volume","2055","M") endif
 
;Validate DoseUnitCd
if(input->dDose > 0)
	set iRet = GetCodeSet(input->dDoseUnitCd)
	if(iRet != 54) call ErrorMsg("DoseUnitCd","9999","I") endif
endif
 
;Validate VolumeUnitCd
if(input->dVolume > 0)
	set iRet = GetCodeSet(input->dVolumeUnitCd)
	if(iRet != 54) call ErrorMsg("VolumeUnitCd","9999","I") endif
endif
 
; Validate username and update audit
set iRet = PopulateAudit(input->sUserName, input->dPatientId, medadmin_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
;Validate RouteCd
set iRet = GetCodeSet(input->dRouteCd)
if(iRet != 4001)
	call ErrorMsg("RouteCd","9999","I")
else
	;Verify if site should be required - 600906 - bsc_get_code_value_by_ext
	call ValidateSite(null)
endif
 
;Validate RateUnitCd
if(input->dRateUnitCd > 0)
	set iRet = GetCodeSet(input->dRateUnitCd)
	if(iRet != 54) call ErrorMsg("RateUnitCd","9999","I") endif
endif
 
;Validate ActionCd
if(input->dActionCd > 0)
	set iRet = GetCodeSet(input->dActionCd)
	if(iRet != 99) call ErrorMsg("ActionCd","9999","I") endif
endif
 
;Validate Not Given ReasonCd
if(input->iIsNotGiven > 0)
	set iRet = GetCodeSet(input->dReasonNotGiven)
	if(iRet != 27920) call ErrorMsg("ReasonNotGiven","9999","I") endif
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
			if(iRet != 4003287) call ErrorMsg("PatientNotScannedReasonCd","9999","I") endif
		endif
	endif
endif
 
; Get order details -- 600578 - dcp_get_ord_dtls_for_charting
set iRet = GetOrderDetails(null)
if(iRet = 0) call ErrorMsg("Could not get order details (600578).","9999","E") endif
 
if(input->iIsNotGiven = 0)
	; Check Medication Interval -- 601571 - bsc_get_med_interval
	set iRet = CheckMedicationInterval(null)
	if(iRet = 0) call ErrorMsg("Could not get medication interval data(601571).","9999","E") endif
endif
 
; Get patient prsnl reltn -- 600320 - pts_get_ppr_yn
set iRet = GetPrsnlReltn(null)
if(iRet = 0) call ErrorMsg("Could not get patient prsnl relation (600320).","9999","E") endif
 
; Get user privileges -- 680500 - MSVC_GetPrivilegesByCodes
set iRet = GetPrivileges(null)
if(iRet = 0) call ErrorMsg("Could not get privileges (680500).","9999","E") endif
 
; Check user privileges -- 680501 - MSVC_CheckPrivileges
set iRet = CheckPrivileges(null)
if(iRet = 0) call ErrorMsg("Could not check privileges (680501).","9999","E") endif
 
; Get medication tasks -- 560307 - DCP.QueryTasks
set iRet = GetMedTasks(null)
if(iRet = 0) call ErrorMsg("Could not get medication tasks (560307).","9999","E") endif
 
; Post medication administration -- 1000071 - event_batch_ensure
call PostMedAdmin(null)
 
; Ensure task events -- 600345 - dcp_events_ensured
if(input->dScheduledAdministrationId > 0)
	call EnsureEvents(null)
endif
 
; Create Pharmacy Administration charge -- 305660 - PHA.AdminCharge
set iRet = CreatePharmacyCharge(null)
if(iRet = 0) call ErrorMsg("Could not create admin charge (305660).","9999","E") endif
 
; Update the medication administration task -- 560303 - DCP.ModTask
set iRet = UpdateAdminTask(null)
if(iRet = 0) call ErrorMsg("Could not update med admin task (560303).","9999","E") endif
 
; Generate infusion task if applicable -- 601577 - bsc_generate_infusion_task
set iRet = CreateInfusionTask(null)
if(iRet = 0) call ErrorMsg("Could not generate infusion task (601577).","9999","E") endif
 
; Add the med admin audit information -- 600905 - dcp_add_audit_info
set iRet = PostMedAdminAudit(null)
if(iRet = 0) call ErrorMsg("Could not post med admin audit (600905).","9999","E") endif
 
;Set audit to successful
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
	set _file = build2(trim(file_path),"/snsro_post_medadmin.json")
	call echo(build2("_file : ", _file))
	call echojson(medadmin_reply_out, _file, 0)
endif
 
#EXIT_VERSION
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
			error_code, build2("Missing required field: ",msg), medadmin_reply_out)
			go to exit_script
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), medadmin_reply_out)
			go to exit_script
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, medadmin_reply_out)
			go to exit_script
	endcase
 
	if(iDebugFlag > 0)
		call echo(concat("ErrorMsg Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateSite(null) = i2 - 600906 - bsc_get_code_value_by_ext
;  Description: Verify if the site field is required
**************************************************************************/
subroutine ValidateSite(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateSite Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600906
	set iRequest = 600906
 
	; Setup request
	set 600906_req->code_set = 4001
	set 600906_req->field_name = "IV_SITE_REQ"
	set 600906_req->get_all_values = 1
 
	;Execute
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600906_req,"REC",600906_rep)
 
	if(600906_rep->status_data.status != "F")
		for(i = 1 to size(600906_rep->qual,5))
			if(600906_rep->qual[i].code_value = input->dRouteCd)
				set iSiteRequired = 1
 
				;Validate SiteCd
				if(input->dSiteCd > 0)
					set iRet = GetCodeSet(input->dSiteCd)
					if(iRet != 97) call ErrorMsg("SiteCd","9999","I") endif
				else
					call ErrorMsg("SiteCd",9999,"M")
				endif
			endif
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateSite Runtime: ",
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
			call ErrorHandler2(c_error_handler, "F", "Validate", "PatientId/OrderId mismatch.",
			"9999", "PatientId/OrderId mismatch.", medadmin_reply_out)
			go to exit_script
		endif
 
		; Get Facility and Nurse Unit codes
		select into "nl:"
		from encounter e
		where e.encntr_id = 600578_rep->encntr_id
		detail
			dFacilityCd = e.loc_facility_cd
			dNurseUnitCd = e.loc_nurse_unit_cd
		with nocounter
 
 		; Set infused volume flag
		for(i = 1 to size(600578_rep->ingred_qual,5))
			if(600578_rep->ingred_qual[i].strength > 0 and 600578_rep->ingred_qual[i].volume > 0)
				set iInfusedVolume = 1
				
				if(input->dVolume = 0 or input->dDose = 0)
					call ErrorHandler2(c_error_handler, "F", "Validate", "This medication requires a dose and a volume.",
					"9999", "This medication requires a dose and a volume.", medadmin_reply_out)
					go to exit_script
				endif
			endif
		endfor
 
 		; Set med changed flag
		for(i = 1 to size(600578_rep->detail_qual,5))
			case(600578_rep->detail_qual[i].oe_field_meaning)
				of "STRENGTHDOSE":
					if(input->dDose != 600578_rep->detail_qual[i].oe_field_value)
						call echo("STRENGTHDOSE changed")
						set iMedChanged = 1
					endif
				of "STRENGTHDOSEUNIT":
					if(input->dDoseUnitCd != 600578_rep->detail_qual[i].oe_field_value)
					call echo("STRENGTHDOSEUNIT changed")
						set iMedChanged = 1
					endif
				of "VOLUMEDOSE":
					if(input->dVolume != 600578_rep->detail_qual[i].oe_field_value)
						call echo("VOLUMEDOSE changed")
						set iMedChanged = 1
					endif
				of "VOLUMEDOSEUNIT":
					if(input->dVolumeUnitCd != 600578_rep->detail_qual[i].oe_field_value)
						call echo("VOLUMEDOSEUNIT changed")
						set iMedChanged = 1
					endif
				of "RATE":
					if(input->dRate != 600578_rep->detail_qual[i].oe_field_value)
						call echo("RATE changed")
						set iMedChanged = 1
					endif
				of "RATEUNIT":
					if(input->dRateUnitCd != 600578_rep->detail_qual[i].oe_field_value)
						call echo("RATEUNIT changed")
						set iMedChanged = 1
					endif
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
;  Name: CheckMedicationInterval(null) = i2 with protect	;601571 - bsc_get_med_interval
;  Description: Get the medication interval and verify if this post admin event violates the frequency
**************************************************************************/
subroutine CheckMedicationInterval(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckMedicationInterval Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600015
	set iRequest = 601571
 
	; Setup request
	set stat = alterlist(601571_req->order_list,1)
	set 601571_req->order_list[1].order_id = input->dOrderId
	set 601571_req->facility_cd = dFacilityCd
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",601571_req,"REC",601571_rep)
 
	if(601571_rep->status_data.status != "F")
		set iValidate = 1
 
		; Find any admins within the frequency window
		if(size(601571_rep->frequency_min_list,5) > 0)
			set freqMin = 601571_rep->frequency_min_list[1].interval_minutes
 
			select into "nl:"
			from clinical_event ce,
				ce_med_result cmr
			plan ce where ce.view_level = 1
				and ce.order_id = input->dOrderId
				and ce.person_id = input->dPatientId
				and ce.result_status_cd in (c_auth_result_status_cd, c_unauth_result_status_cd,
					c_altered_result_status_cd, c_modified_result_status_cd)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
			join cmr where cmr.event_id = ce.event_id
				and cmr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
				and cmr.admin_end_dt_tm >= cnvtlookbehind(build('"',freqMin,',MIN"'),cnvtdatetime(input->qAdminDateTime))
			detail
				iMedIntervalViolation = 1
				qNextScheduledDttm = cnvtlookahead(build('"',freqMin,',MIN"'),cnvtdatetime(cmr.admin_end_dt_tm))
			with nocounter
 
 			if(input->iIsNotGiven = 0)
				if(iMedIntervalViolation)
					call ErrorHandler2(c_error_handler, "F", "Validate", "Medication interval violation.",
					"9999", "Medication interval violation.", medadmin_reply_out)
					go to exit_script
				endif
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckMedicationInterval Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
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
;  Name: GetPrivileges(null) = i2 with protect	;680500 - MSVC_GetPrivilegesByCodes
;  Description: Get user privileges
**************************************************************************/
subroutine GetPrivileges(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 1
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
			   set iValidate = 0
			endif
		endfor
	else
		set iValidate = 0
	endif
 
	if(iValidate = 1)
		; Setup request with relationship
		set 680500_req->patient_user_criteria.user_id = input->dClinicianId
		set 680500_req->patient_user_criteria.patient_user_relationship_cd = 600320_rep->ppr_cd
		set stat = alterlist(680500_req->privilege_criteria.privileges,2)
		set 680500_req->privilege_criteria.privileges[1].privilege_cd = uar_get_code_by("MEANING",6016,"CHARTDONE")
		set 680500_req->privilege_criteria.privileges[2].privilege_cd = uar_get_code_by("MEANING",6016,"CHARTNOTDONE")
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
		if(680500_rep->transaction_status.success_ind = 1)
			for(i = 1 to size(680500_rep->privileges,5))
				if(680500_rep->privileges[i].default[1].granted_ind != 1)
				   set iValidate = 0
				endif
			endfor
		else
			set iValidate = 0
		endif
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
;  Name: GetMedTasks(null) = i2 with protect	;560307 - DCP.QueryTasks
;  Description: Get patient's medication tasks
**************************************************************************/
subroutine GetMedTasks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedTasks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 560307
	set iRequest = 560307
 
	; Setup request
		;Person
		set stat = alterlist(560307_req->person_list,1)
		set 560307_req->person_list[1].person_id = input->dPatientId
		;Encounter
		set stat = alterlist(560307_req->encntr_list,1)
		set 560307_req->encntr_list[1].encntr_id = 600578_rep->encntr_id
		;Task Type
		set stat = alterlist(560307_req->task_type_list,2)
		set 560307_req->task_type_list[1].task_type_cd = uar_get_code_by("MEANING",6026,"IV")
		set 560307_req->task_type_list[1].task_type_cd = uar_get_code_by("MEANING",6026,"MED")
		;Task Status
		set stat = alterlist(560307_req->task_status_list,2)
		set 560307_req->task_status_list[1].status_cd = uar_get_code_by("MEANING",79,"PENDING")
		set 560307_req->task_status_list[2].status_cd = uar_get_code_by("MEANING",79,"OVERDUE")
		;Task Class
		set stat = alterlist(560307_req->task_class_list,5)
		set 560307_req->task_class_list[1].class_cd = uar_get_code_by("MEANING",6025,"CONT")
		set 560307_req->task_class_list[2].class_cd = uar_get_code_by("MEANING",6025,"NSCH")
		set 560307_req->task_class_list[3].class_cd = uar_get_code_by("MEANING",6025,"PRN")
		set 560307_req->task_class_list[4].class_cd = uar_get_code_by("MEANING",6025,"SCH")
		set 560307_req->task_class_list[5].class_cd = uar_get_code_by("MEANING",6025,"ADHOC")
		;Other
		set 560307_req->user_position_cd = dPositionCd
		set 560307_req->beg_dt_tm = cnvtdatetime("01-JAN-1900 00:00:00")
		set 560307_req->end_dt_tm = cnvtdatetime("31-DEC-2100 23:59:59")
		set 560307_req->get_order_info = 1
		set 560307_req->ignore_beg_dt_on_overdue_ind = 1
		set 560307_req->ignore_beg_dt_on_working_ind = 1
		set 560307_req->get_pathway_info = 1
 
	;Execute
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560307_req,"REC",560307_rep)
 
	if(560307_rep->status_data.status = "S")
		set iValidate = 1
		set taskCheck = 0
		for(i = 1 to size(560307_rep->task_list,5))
			if(560307_rep->task_list[i].task_id = input->dScheduledAdministrationId)
				set taskCheck = 1
				set qTaskSchedDtTm = 560307_rep->task_list[i].scheduled_dt_tm
				set iTaskSchedTz = 560307_rep->task_list[i].task_tz
			endif
		endfor
 
		if(taskCheck = 0)
			call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid ScheduledAdministrationId.",
			"9999", "Invalid ScheduledAdministrationId.", medadmin_reply_out)
			go to EXIT_SCRIPT
		endif
 
	elseif(560307_rep->status_data.status = "Z")
		call ErrorHandler2(c_error_handler, "F", "Validate", "No administration tasks exist.",
		"9999","No administration tasks exist.", medadmin_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedTasks Runtime: ",
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
 
	declare error_msg = vc
 	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare crmstatus = i2
 
	set error_msg = "None"
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 1000071
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ))
			call uar_crmendapp (happ )
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, medadmin_reply_out)
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
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, medadmin_reply_out)
			go to exit_script
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
			set hreq = uar_srvadditem(hrequest,"req")
			set stat = uar_srvsetshort(hreq,"ensure_type",1)
			set hce = uar_srvgetstruct (hreq ,"clin_event")
 
			; Clinical Event
			if(hce)
				set stat = uar_srvsetdouble(hce,"order_id",input->dOrderId)
				set stat = uar_srvsetdouble(hce,"catalog_cd",600578_rep->catalog_cd)
				set stat = uar_srvsetdouble(hce,"person_id",600578_rep->person_id)
				set stat = uar_srvsetdouble(hce,"encntr_id",600578_rep->encntr_id)
				set stat = uar_srvsetdouble(hce,"contributor_system_cd",reqdata->contributor_system_cd)
				set stat = uar_srvsetdouble(hce,"event_class_cd",c_grp_event_class_cd)
				set stat = uar_srvsetdouble(hce,"event_cd",c_dcpgeneric_event_cd)
				set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
				set stat = uar_srvsetdouble(hce,"record_status_cd",c_active_record_status_cd)
				set stat = uar_srvsetdouble(hce,"result_status_cd",c_auth_result_status_cd)
				set stat = uar_srvsetshort(hce,"authentic_flag",1)
				set stat = uar_srvsetshort(hce,"publish_flag",1)
				set stat = uar_srvsetlong(hce,"order_action_sequence",600578_rep->last_action_sequence)
				set stat = uar_srvsetdouble(hce,"entry_mode_cd",c_medadmin_entry_mode_cd)
				set stat = uar_srvsetlong(hce,"event_end_tz",curtimezoneapp)
 				set stat = uar_srvsetdouble(hce,"replacement_event_id",2.0)
 				set stat = uar_srvsetdouble(hce,"updt_id",input->dClinicianId)
 
				; Event Prsnl List
				set ePrsnlSize = 3
				for(i = 1 to ePrsnlSize )
					set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
					if(hprsnl)
						set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl,"action_tz",curtimezoneapp)
 
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
						endcase
					else
						set error_msg = "Could not create hprsnl"
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
						go to exit_script
					endif
				endfor
 
				; Result Set Link List
				set hres = uar_srvadditem(hce,"result_set_link_list")
				if(hres)
					set stat = uar_srvsetdouble(hres,"entry_type_cd",c_medadmin_entry_type_cd)
					set stat = uar_srvsetdouble(hres,"result_set_group",1.0)
				else
					set error_msg = "Could not create hres."
					call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
					go to exit_script
				endif
 
				; Child Event
				set hce_type = uar_srvcreatetypefrom (hreq ,"clin_event" )
				set hce_struct = uar_srvgetstruct (hreq ,"clin_event" )
				set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
				set hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
 
				if(hce2)
					call uar_srvbinditemtype (hce2 ,"child_event_list" ,hce_type )
					set stat = uar_srvsetlong(hce2,"view_level",1)
					set stat = uar_srvsetdouble(hce2,"order_id",input->dOrderId)
					set stat = uar_srvsetdouble(hce2,"catalog_cd",600578_rep->catalog_cd)
					set stat = uar_srvsetdouble(hce2,"person_id",600578_rep->person_id)
					set stat = uar_srvsetdouble(hce2,"encntr_id",600578_rep->encntr_id)
					set stat = uar_srvsetdouble(hce2,"contributor_system_cd",reqdata->contributor_system_cd)
					set stat = uar_srvsetdouble(hce2,"event_class_cd",c_med_event_class_cd)
					set stat = uar_srvsetdouble(hce2,"event_cd",600578_rep->event_cd)
 
					declare event_tag = vc
					if(input->iIsNotGiven = 0)
						if(iMedChanged)
							if(input->dDose > 0)
								set doseStr = trim(cnvtstring(input->dDose),3)
								if(size(doseStr) < 4)
									set event_tag = build2(doseStr," ",cnvtcap(uar_get_code_display(input->dDoseUnitCd)))
								elseif(size(doseStr) < 7)
									set event_tag = build2(format(doseStr,"###,###;;c")," ",cnvtcap(uar_get_code_display(input->dDoseUnitCd)))
								else
									set event_tag = build2(format(doseStr,"###,###,###;;c")," ",cnvtcap(uar_get_code_display(input->dDoseUnitCd)))
								endif
							else
								set volStr = trim(cnvtstring(input->dVolume),3)
								if(size(volStr) < 4)
									set event_tag = build2(volStr," ",cnvtcap(uar_get_code_display(input->dVolumeUnitCd)))
								elseif(size(volStr) < 7)
									set event_tag = build2(format(volStr,"###,###;;c")," ",cnvtcap(uar_get_code_display(input->dVolumeUnitCd)))
								else
									set event_tag = build2(format(volStr,"###,###,###;;c")," ",cnvtcap(uar_get_code_display(input->dVolumeUnitCd)))
								endif
							endif
						else
							set event_tag = trim(piece(600578_rep->clinical_display_line,",",1,""),3)
						endif
					else
						set event_tag = build2("Not Given: ",uar_get_code_display(input->dReasonNotGiven))
					endif
 
					set stat = uar_srvsetstring(hce2,"event_tag",nullterm(event_tag))
					set stat = uar_srvsetdate(hce2,"event_end_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
					set stat = uar_srvsetdouble(hce2,"record_status_cd",c_active_record_status_cd)
					if(input->iIsNotGiven = 0)
						set stat = uar_srvsetdouble(hce2,"result_status_cd",c_auth_result_status_cd)
					else
						set stat = uar_srvsetdouble(hce2,"result_status_cd",c_notdone_result_status_cd)
					endif
					set stat = uar_srvsetshort(hce2,"authentic_flag",1)
					set stat = uar_srvsetshort(hce2,"publish_flag",1)
					set stat = uar_srvsetstring(hce2,"event_title_text",nullterm(uar_get_code_display(600578_rep->event_cd)))
					set stat = uar_srvsetdouble(hce2,"entry_mode_cd",c_medadmin_entry_mode_cd)
					set stat = uar_srvsetlong(hce2,"event_end_tz",curtimezoneapp)
					set stat = uar_srvsetlong(hce2,"order_action_sequence",600578_rep->last_action_sequence)
					set stat = uar_srvsetdouble(hce2,"updt_id",input->dClinicianId)
					set stat = uar_srvsetstring(hce2,"collating_seq",nullterm("0000000000"))
 
 
 					if(input->iIsNotGiven = 0)
						;Med Result List
						set hmed = uar_srvadditem(hce2 ,"med_result_list")
						if(hmed)
							set stat = uar_srvsetshort(hmed,"ensure_type",2)
							set stat = uar_srvsetstring(hmed,"admin_note",nullterm(input->sComments))
							set stat = uar_srvsetdouble(hmed,"admin_method",input->dActionCd)
							set stat = uar_srvsetdouble(hmed,"admin_prov_id",input->dClinicianId)
							set stat = uar_srvsetdate(hmed,"admin_start_dt_tm",cnvtdatetime(input->qAdminDateTime))
							set stat = uar_srvsetdate(hmed,"admin_end_dt_tm",cnvtdatetime(input->qAdminDateTime))
							set stat = uar_srvsetdouble(hmed,"admin_route_cd",input->dRouteCd)
							if(iSiteRequired)
								set stat = uar_srvsetdouble(hmed,"admin_site_cd",input->dSiteCd)
							endif
							set stat = uar_srvsetdouble(hmed,"synonym_id",600578_rep->synonym_id)
							if(iInfusedVolume > 0)
								set stat = uar_srvsetdouble(hmed,"admin_dosage",input->dDose)
								set stat = uar_srvsetdouble(hmed,"dosage_unit_cd",input->dDoseUnitCd)
								set stat = uar_srvsetdouble(hmed,"infused_volume",input->dVolume)
								set stat = uar_srvsetdouble(hmed,"infused_volume_unit_cd",input->dVolumeUnitCd)
							else
								if(input->dDose > 0)
									set stat = uar_srvsetdouble(hmed,"admin_dosage",input->dDose)
									set stat = uar_srvsetdouble(hmed,"dosage_unit_cd",input->dDoseUnitCd)
								else
									set stat = uar_srvsetdouble(hmed,"admin_dosage",input->dVolume)
									set stat = uar_srvsetdouble(hmed,"dosage_unit_cd",input->dVolumeUnitCd)
								endif
							endif
							set stat = uar_srvsetdouble(hmed,"infusion_rate",input->dRate)
							set stat = uar_srvsetdouble(hmed,"infusion_unit_cd",input->dRateUnitCd)
							set stat = uar_srvsetdouble(hmed,"synonym_id",600578_rep->synonym_id)
							set stat = uar_srvsetlong(hmed,"admin_start_tz",curtimezoneapp)
						else
							set error_msg = "Could not create hmed."
							call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
							go to exit_script
						endif
					else
						; Coded Result List
						set hcode = uar_srvadditem(hce2 ,"coded_result_list")
						if(hcode)
							set stat = uar_srvsetshort(hcode,"ensure_type",2)
							set stat = uar_srvsetlong(hcode,"sequence_nbr",1)
							set stat = uar_srvsetlong(hcode,"result_set",27920)
							set stat = uar_srvsetdouble(hcode,"result_cd",input->dReasonNotGiven)
						else
							set error_msg = "Could not create hcode."
							call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
							go to exit_script
						endif
					endif
 
					; Comments
					if(input->sComments > " ")
						set henote = uar_srvadditem(hce2,"event_note_list")
						if(henote)
							set stat = uar_srvsetdouble(henote,"note_type_cd",c_rescomment_note_type_cd)
							set stat = uar_srvsetdouble(henote,"note_format_cd",c_rtf_note_format_cd)
							set stat = uar_srvsetdouble(henote,"entry_method_cd",c_unknown_entry_method_cd)
							set stat = uar_srvsetdouble(henote,"note_prsnl_id",input->dClinicianId)
							set stat = uar_srvsetdate(henote,"note_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
							set stat = uar_srvsetdouble(henote,"record_status_cd",c_active_record_status_cd)
							set stat = uar_srvsetdouble(henote,"compression_cd",c_ocf_compression_cd)
							set stat = uar_srvsetasis(henote,"long_blob",nullterm(input->sComments))
							set stat = uar_srvsetlong(henote,"note_tz",curtimezoneapp)
						else
							set error_msg = "Could not create henote."
							call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
							go to exit_script
						endif
					endif
 
					; Event Prsnl
					set hprsnl2 = uar_srvadditem(hce2,"event_prsnl_list")
					if(hprsnl2)
						set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_perform_action_type_cd)
						set stat = uar_srvsetdate(hprsnl2,"action_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
						set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",input->dClinicianId)
						set stat = uar_srvsetdouble(hprsnl2,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl2,"action_tz",curtimezoneapp)
					else
						set error_msg = "Could not create hprsnl2."
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
						go to exit_script
					endif
 
					; Result Set Link List
					set hres2 = uar_srvadditem(hce2,"result_set_link_list")
					if(hres2)
						set stat = uar_srvsetdouble(hres2,"entry_type_cd",c_medadmin_entry_type_cd)
						set stat = uar_srvsetdouble(hres2,"result_set_group",1.0)
					else
						set error_msg = "Could not create hres2."
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
						go to exit_script
					endif
 
				else
					set error_msg = "Could not create hce2."
					call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
					go to exit_script
				endif
			else
				set error_msg = "Could not create HCE."
				call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, medadmin_reply_out)
				go to exit_script
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
						endfor
					else
						set error_msg = "Rb_list is empty. Could not post administration event."
						call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, medadmin_reply_out)
						go to exit_script
					endif
				else
					set error_msg = "Rep list is empty. Could not post administration event."
					call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, medadmin_reply_out)
					go to exit_script
				endif
			else
				set error_msg = "Failed to create hreply."
				call ErrorHandler2(c_error_handler, "F","uar_crmgetreply", error_msg,"9999", error_msg, medadmin_reply_out)
				go to exit_script
			endif
		else
			set error_msg = "Failed to execute request 1000071."
			call ErrorHandler2(c_error_handler, "F","CRMPERFORM", error_msg,"9999", error_msg, medadmin_reply_out)
			go to exit_script
		endif
	endif
 
 	; Set administration id
 	set medadmin_reply_out->administration_id = temp->list[2].event_id
 	
	if(iDebugFlag > 0)
		call echo(concat("PostMedAdmin Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: EnsureEvents(null)	= null with protect	;600345 - dcp_events_ensured
;  Description: Ensure tasks
**************************************************************************/
subroutine EnsureEvents(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("EnsureEvents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 600345
 
	;Setup request
	for(i = 1 to size(temp->list,5))
		set stat = alterlist(600345_req->elist,i)
		set 600345_req->elist[i].event_id = temp->list[i].event_id
		set 600345_req->elist[i].order_id = input->dOrderId
		set 600345_req->elist[i].task_id = input->dScheduledAdministrationId
	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600345_req,"REC",600345_req)
 
	if(iDebugFlag > 0)
		call echo(concat("EnsureEvents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
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
 
 	declare c_chgonadmin_dispense_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",4032,"CHGONADMIN"))
	;Setup request
	set stat = alterlist(305660_req->qual,1)
	set 305660_req->qual[1].order_id = input->dOrderId
	set 305660_req->qual[1].action_sequence = 600578_rep->last_action_sequence
	set 305660_req->qual[1].event_id = temp->list[1].event_id
	set 305660_req->qual[1].dispense_type_cd = c_chgonadmin_dispense_type_cd
	if(input->iIsNotGiven = 0)
		set 305660_req->qual[1].route_cd = input->dRouteCd
	endif
	set 305660_req->qual[1].admin_dt_tm = input->qAdminDateTime
	set 305660_req->qual[1].prsnl_id = input->dClinicianId
	set 305660_req->qual[1].ingred_action_seq = 600578_rep->ingred_action_seq
	set stat = alterlist(305660_req->qual[1].ingred_list, size(600578_rep->ingred_qual,5))
	for(i = 1 to size(600578_rep->ingred_qual,5))
		set 305660_req->qual[1].ingred_list[i].comp_sequence = 600578_rep->ingred_qual[1].comp_sequence
		if(input->iIsNotGiven = 0)
			if(input->dDose > 0)
				set 305660_req->qual[1].ingred_list[i].dose = input->dDose
				set 305660_req->qual[1].ingred_list[i].dose_unit_cd = input->dDoseUnitCd
			else
				set 305660_req->qual[1].ingred_list[i].dose = input->dVolume
				set 305660_req->qual[1].ingred_list[i].dose_unit_cd = input->dVolumeUnitCd
			endif
		endif
	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",305660_req,"REC",305660_rep)
 
	if(305660_rep->status_data.status = "S")
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
	if(input->iIsNotGiven = 0)
		set 560303_req->mod_list[1].task_status_reason_cd = c_dcpchart_task_status_reason_cd
		set 560303_req->mod_list[1].task_status_reason_meaning = uar_get_code_meaning(c_dcpchart_task_status_reason_cd)
	else
		set 560303_req->mod_list[1].task_status_reason_cd = c_dcpnotdone_task_status_reason_cd
		set 560303_req->mod_list[1].task_status_reason_meaning = uar_get_code_meaning(c_dcpnotdone_task_status_reason_cd)
	endif
	set 560303_req->mod_list[1].event_id = temp->list[1].event_id
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
	set 600905_req->admin_events[1].event_id = temp->list[2].event_id
	set 600905_req->admin_events[1].order_id = input->dOrderId
	set 600905_req->admin_events[1].documented_action_seq = 1
	set 600905_req->admin_events[1].clinical_warning_cnt = 0
	set 600905_req->admin_events[1].prsnl_id = input->dClinicianId
	set 600905_req->admin_events[1].position_cd = dPositionCd
	set 600905_req->admin_events[1].nurse_unit_cd = dNurseUnitCd
	set 600905_req->admin_events[1].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
 
	if(input->iIsNotGiven > 0)
		set 600905_req->admin_events[1].event_type_cd = c_notgiven_alert_type_cd
		set 600905_req->admin_events[1].order_result_variance = 1
	else
		set 600905_req->admin_events[1].event_type_cd = c_taskcomplete_alert_type_cd
		set 600905_req->admin_events[1].order_result_variance = iMedChanged
 
	 	; Patient Scan error
		if(input->iPatientScanned = 0)
			set maSize = size(600905_req->med_admin_alerts,5)
			set maSize  = maSize + 1
			set stat = alterlist(600905_req->med_admin_alerts,maSize)
			set 600905_req->med_admin_alerts[maSize].source_application_flag = 0
			set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_ppidover_alert_type_cd
			set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_minor_alert_severity_cd
			set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
			set 600905_req->med_admin_alerts[maSize].position_cd = dPositionCd
			set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = dNurseUnitCd
			set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
			set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_pt_error,1)
			set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].expected_pt_id = 600578_rep->person_id
			set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].identified_pt_id = input->dPatientId
 
			if(input->dPatientNotScannedReasonCd > 0)
				set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].reason_cd = input->dPatientNotScannedReasonCd
			else
				set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].reason_cd = freeTextReasonCd
				set 600905_req->med_admin_alerts[maSize].med_admin_pt_error[1].freetext_reason = input->sMedicationNotScannedReason
			endif
		endif
 
	 	; Medication Scan error
		if(input->iMedicationScanned = 0)
	 		set maSize = size(600905_req->med_admin_alerts,5)
			set maSize  = maSize + 1
			set stat = alterlist(600905_req->med_admin_alerts,maSize)
			set 600905_req->med_admin_alerts[maSize].source_application_flag = 0
			set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_medscanover_alert_type_cd
			set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_minor_alert_severity_cd
			set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
			set 600905_req->med_admin_alerts[maSize].position_cd = dPositionCd
			set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = dNurseUnitCd
			set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
			set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error,1)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].person_id = input->dPatientId
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].encounter_id = 600578_rep->encntr_id
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].order_id = input->dOrderId
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].action_sequence = 1
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_route_cd = input->dRouteCd
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].event_id = temp->list[2].event_id
 
			for(m = 1 to size(600578_rep->ingred_qual,5))
				set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds,m)
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].catalog_cd = 600578_rep->catalog_cd
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].synonym_id = 600578_rep->synonym_id
 
				if(iInfusedVolume > 0)
					set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength = input->dDose
					set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength_unit_cd = input->dDoseUnitCd
					set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].volume = input->dVolume
					set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].volume_unit_cd = input->dVolumeUnitCd
				else
					if(input->dVolume > 0)
						set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength = input->dVolume
						set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength_unit_cd = input->dVolumeUnitCd
					else
						set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength = input->dDose
						set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].strength_unit_cd = input->dDoseUnitCd
					endif
				endif
			endfor
 
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_dt_tm = cnvtdatetime(qTaskSchedDtTm)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_tz = iTaskSchedTz
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_dt_tm = input->qAdminDateTime
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = curtimezoneapp
 
			if(input->dMedicationNotScannedReasonCd > 0)
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = input->dMedicationNotScannedReasonCd
			else
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = freeTextReasonCd
				set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].freetext_reason = input->sMedicationNotScannedReason
			endif
		endif
 	endif
 
 	; Medication Interval Error
 	if(iMedIntervalViolation)
 		set maSize = size(600905_req->med_admin_alerts,5)
		set maSize  = maSize + 1
		set stat = alterlist(600905_req->med_admin_alerts,maSize)
		set 600905_req->med_admin_alerts[maSize].source_application_flag = 0
		set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_medinterval_alert_type_cd
		set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_minor_alert_severity_cd
		set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
		set 600905_req->med_admin_alerts[maSize].position_cd = dPositionCd
		set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = dNurseUnitCd
		set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
		set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error,1)
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].person_id = input->dPatientId
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].encounter_id = 600578_rep->encntr_id
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].order_id = input->dOrderId
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].action_sequence = 1
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_route_cd = input->dRouteCd
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].event_id = temp->list[2].event_id
 
		for(m = 1 to size(600578_rep->ingred_qual,5))
			set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds,m)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].med_event_ingreds[m].catalog_cd = 600578_rep->catalog_cd
		endfor
 
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_dt_tm = cnvtdatetime(qTaskSchedDtTm)
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_tz = iTaskSchedTz
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_dt_tm = input->qAdminDateTime
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = curtimezoneapp
 		set 600905_req->med_admin_alerts[maSize].next_calc_dt_tm = qNextScheduledDttm
		set 600905_req->med_admin_alerts[maSize].next_calc_tz = curtimezoneapp
	endif
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600905_req,"REC",600905_req)
 
 	; Check the update occurred
 	call pause(5) ;one second delay
 
 	select into "nl:"
 	from med_admin_event mae
 	where mae.event_id =  temp->list[2].event_id
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
 
end go
 
 
