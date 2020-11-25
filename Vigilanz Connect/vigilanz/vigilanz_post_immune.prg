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
      Source file name: snsro_post_immune.prg
      Object name:      vigilanz_post_immune
      Program purpose:  POST a immune administration in Millennium
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 1/27/20    STV		   Initial Write
 002 04/6/20    STV        fix for dose and volume string posting
 003 4/10/20    STV        added ablility to post observations
 004 4/20/20    STV        Added to only check Route and Site cd if isnotgiven is false
 ************************************************************************/
 
drop program vigilanz_post_immune go
create program vigilanz_post_immune
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username" = ""
	, "PatientId" = ""
	, "PatientIdType" = ""
	, "OrderId" = ""
	, "ScheduledAdministrationId" = ""
	, "PatientScanned" = ""
	, "PatientNotScannedReason" = ""
	, "MedicationScanned" = ""
	, "MedicationNotScannedReason" = ""
	, "ClinicianId" = ""
	, "AdminDateTime" = ""
	, "DocumentedDateTime" = ""
	, "Action" = ""
	, "Comments" = ""
	, "Route" = ""
	, "Site" = ""
	, "Rate" = ""
	, "RateUnit" = ""
	, "Dose" = ""
	, "DoseUnit" = ""
	, "Volume" = ""
	, "VolumeUnit" = ""
	, "Duration" = ""
	, "DurationUnit" = ""
	, "IsNotGiven" = ""
	, "ReasonNotGiven" = ""
	, "Witness by" = ""
	, "SystemId" = ""
	, "ReferenceNumber" = ""
	, "MedicationBarcode" = ""
	, "EarlyOrLateReason" = ""
	, "EnforceMedInterval:" = ""
	, "Lot Number" = ""
	, "Manufacturer" = ""
	, "Expiration Date" = ""
	, "Vaccine For Children" = ""
	, "Vaccine Information Sheets" = ""
	, "Information Given On Date" = ""
	, "Funding Source" = ""
	, "JSON Args" = ""
	, "Debug" = 0
 
with OUTDEV, USERNAME, PATIENTID, PATIENTIDTYPE, ORDERID, SCHEDADMINID,
	PATIENTSCANNED, PATNOTSCANREASON, MEDICATIONSCANNED, MEDNOTSCANREASON, CLINICIANID,
	ADMINDATETIME, DOCUMENTEDDATETIME, ACTION, COMMENTS, ROUTE, SITE, RATE, RATEUNIT, DOSE,
	DOSEUNIT, VOLUME, VOLUMEUNIT, DURATION, DURATIONUNIT, ISNOTGIVEN, REASONNOTGIVEN,
	WITNESSID, SYSTEMID, REFERENCENUMBER, MED_BARCODE, EAR_OR_LATE_REAS,
	ENF_MED_INTERVAL, LOTNUMBER, MANUFACTURER, EXPIRATIONDATE, VACCINEFORCHILDREN,
	VACCINEINFOSHEETS, INFOGIVENDATE, FUNDINGSOURCE,JSON_ARGS, DEBUG_FLAG
 
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
 
 
 ;601602 - bsc_upd_immun_info
 free record 601602_req
 record 601602_req (
  1 person_id = f8
  1 organization_id = f8
  1 vaccinations_to_chart [*]
    2 vaccine
      3 event_cd = f8
    2 clinical_event_id = f8;this is the event_id
    2 vfc_status_cd = f8
    2 information_statements_given [*]
      3 vis_cd = f8
      3 given_on_dt_tm = dq8
      3 published_dt_tm = dq8
    2 funding_source_cd = f8
    2 default_event_ind = i2
  1 modify_ind = i2
  1 notgiven_ind = i2
  1 reference_nbr = vc
  1 vaccinations_not_given [*]
    2 charted_dt_tm = dq8
    2 charted_personnel_id = f8
    2 reason_cd = f8
    2 comment = vc
)
 
free record 601602_rep
record 601602_rep (
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;966902 Immunization_GetVaccineReference
free record 966902_req
record 966902_req (
  1 vaccine_flag = i2
  1 vaccine = vc
  1 primary_language_type_flag = i2
  1 primary_language = vc  ;this is the person_id
  1 information_statement_flag = i2
)
 
free record 966902_rep
record 966902_rep (
  1 vaccines [*]
    2 vaccine
      3 event_cd = f8
      3 event_display = vc
    2 vaccine_short_name = vc
    2 vaccine_name = vc
    2 products [*]
      3 product_name = vc
      3 synonym_id = f8
    2 information_statements [*]
      3 name = vc
      3 statements [*]
        4 vis_cd = f8
        4 language_iso = vc
        4 language_cd = f8
        4 display = vc
        4 published_dt_tm = dq8
        4 uri = vc
        4 active_ind = i2
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;arglist
free record arglist
record arglist(
	1 ObservationComponents [*]
		2 ObservationId = vc
		2 ComponentId = vc
		2 Value = vc
		2 valueCodes[*] = vc
		2 Comment = vc
 
)
 
; Final reply
free record immunization_create_reply_out
record immunization_create_reply_out(
  1 administration_id      	= f8
  1 observations[*]
  	2 observation_id        = f8
  	2 component
  		3 id                = f8
  		3 name              = vc
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
		2 event_cd = f8
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
	1 sDose                             = vc
	1 dVolume							= f8
	1 dVolumeUnitCd						= f8
	1 sVolume                           = vc
	1 dDuration							= f8
	1 dDurationUnitCd					= f8
	1 iIsNotGiven						= i2
	1 dReasonNotGiven					= f8
    1 dWitnessId                        = f8
	1 dSystemId                         = f8
	1 sReferenceNumber                  = vc
	1 sMedBarcode                       = vc
	1 sEarlyOrLateReason                = vc
	1 dEarlyOrLateReason                = f8
	1 enforceMedInterval                = i2  ;021
	1 sLotNbr                           = vc
	1 dManufacturer						= f8
	1 qExpDate							= dq8
	1 dVaccineForChild                  = f8
	1 dVaccineInfoSheet					= f8
	1 qInfoGivenDate					= dq8
	1 dFundingSource					= f8
	1 qVisPublishDate                   = dq8
	1 dOrg_id                           = f8
	1 medAdminCompCnt                   = i4
	1 medAdminComponents[*]
		2 iNormalcyInd                  = i2
		2 iCriticalInd                  = i2
		2 dNormalHigh                   = f8
		2 dNormalLow                    = f8
		2 dCriticalHigh                 = f8
		2 dCriticalLow                  = f8
		2 valid_ind                     = i2; indicates the event_cd is valid for the med
		2 anchor_dt_tm                  = dq8; this is event_end_dt_tm for comparing acknowledge window
		2 io_type_flag                  = i2
		2 stringResultInd               = i2
		2 numCheckInd                   = i2
		2 dStringResultFormatCd         = f8
		2 codedResultsInd               = i2
		2 providerInd                   = i2
		2 dObservationId                = f8
		2 dEventCd                      = f8
		2 sValue                        = vc
		2 dEventClassCd                 = f8
		2 sEventTitleText               = vc
		2 sCollatingSeq                 = vc
		2 comment                       = vc
		2 commentSize                   = i4
		2 dTaskAssayCd                  = f8
		2 sTaskMnemonic                 = vc
		2 dTaskVersionNbr               = f8
		2 dSequence 					= f8
 		2 sMnemonic 					= vc
 		2 dNormalcyCd 					= f8
		2 sShort_string 				= vc
		2 sReferenceNumber              = vc
		2 dateResultInd                 = i2
		2 dateTypeFlag                  = i2
		2 qDateTimeResVal               = dq8
		2 dResultUnitCd                 = f8
		2 ValueCdCnt                    = i4
		2 ValueCodes[*]
			3 nomenclature_id           = f8
			3 short_string              = vc
			3 description               = vc
			3 mnemonic                  = vc
			3 unit_cd                   = f8
 
)
 
declare sJsonArgs			            = gvc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
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
declare doseStr 						= vc
declare volStr							= vc
declare refNumberStr 					= vc
declare iTimeZone						= i4 with protect, noconstant(0)
declare c_rtf_prefix = vc with protect, constant(concat("{\rtf1\ansi\ansicpg1252\deff0\deflang1033{\fonttbl"
		,"{\f0\fnil\fcharset0 Segoe UI;}}\viewkind4\uc1\pard\f0\fs20 "))
declare c_rtf_suffix = vc with protect, constant("\par")
 
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
declare c_witness_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"WITNESS"))
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
declare c_moderate_alert_severity_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4000041,"MODERATE"))
declare c_earlylatereason_cd =  f8 with protect, constant(uar_get_code_by("MEANING",4000040,"EARLYLATE"))
declare c_cont_task_clss_cd             = f8 with protect, constant(uar_get_code_by("MEANING",6025,"CONT"))
declare c_chgonadmin_dispense_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4032,"CHGONADMIN"))
declare c_earlyLateNoteType_cd         = f8 with protect, constant(uar_get_code_by("MEANING",14,"EARLYLATE RE"))
declare c_asNote_cd                    = f8 with protect, constant(uar_get_code_by("MEANING",23,"AS"))
declare c_Cerner_note_cd               = f8 with protect, constant(uar_get_code_by("MEANING",13,"CERNER"))
declare c_ackowledge_cd = f8 with protect, constant(uar_get_code_by("MEANING",4002218,"ACKNOWLEDGE"))
declare c_io_status_confirmed 		= f8 with protect, constant (uar_get_code_by("MEANING",4000160,"CONFIRMED"))
 
declare c_dcpgeneric_event_cd 			= f8 with protect, noconstant(uar_get_code_by("MEANING",72,"DCPGENERIC"))
if(c_dcpgeneric_event_cd < 1)
	select into "nl:"
	from code_value cv
	plan cv
		where cv.code_set = 72
			and cv.display_key = "DCPGENERICCODE"
			and cv.begin_effective_dt_tm < cnvtdatetime(curdate,curtime3)
			and cv.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and cv.active_ind = 1
	head report
		c_dcpgeneric_event_cd = cv.code_value
	with nocounter
endif
 
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
set input->sDose                        = trim($DOSE,3)
set input->dVolume						= cnvtreal($VOLUME)
set input->dVolumeUnitCd				= cnvtreal($VOLUMEUNIT)
set input->sVolume                      = trim($VOLUME,3)
set input->dDuration					= cnvtreal($DURATION)
set input->dDurationUnitCd				= cnvtreal($DURATIONUNIT)
set input->iIsNotGiven					= cnvtint($ISNOTGIVEN)
set input->dReasonNotGiven				= cnvtreal($REASONNOTGIVEN)
set input->dWitnessId                   = cnvtreal(trim($WITNESSID,3))
set input->dSystemId                    = cnvtreal(trim($SystemId,3))
set input->sReferenceNumber             = trim($ReferenceNumber)
set input->sMedBarcode                  = trim($MED_BARCODE,3)
set input->enforceMedInterval			= cnvtint($ENF_MED_INTERVAL)  ;021
set input->sLotNbr                      = trim($LOTNUMBER,3)
set input->dManufacturer                = cnvtreal(trim($MANUFACTURER))
set input->qExpDate                     = GetDateTime($EXPIRATIONDATE)
set input->dVaccineForChild             = cnvtreal(trim($VACCINEFORCHILDREN))
set input->dVaccineInfoSheet            = cnvtreal(trim($VACCINEINFOSHEETS))
set input->qInfoGivenDate               = GetDateTime($INFOGIVENDATE)
set input->dFundingSource               = cnvtreal(trim($FUNDINGSOURCE))
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId 							= GetPrsnlIDfromUserName(input->sUserName)
if(input->dClinicianId = 0)
	set input->dClinicianId = dPrsnlId
endif
set dPositionCd 						= GetPositionByPrsnlId(input->dClinicianId)
 
if(input->sMedBarcode > " ")
	set input->iMedicationScanned = 1
endif
 
;early or late reason flexing
set input->dEarlyOrLateReason = cnvtreal(trim($EAR_OR_LATE_REAS,3))
if(input->dEarlyOrLateReason < 1)
	set input->sEarlyOrLateReason = trim($EAR_OR_LATE_REAS,3)
endif
 
;json arg
set sJsonArgs					= trim($JSON_ARGS,3)
declare runValCodeCheck = i2
if(size(sJsonArgs) > 0)
	set jrec						= cnvtjsontorec(sJsonArgs)
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc
	declare numstr      = vc
 
	;populating the input structure
	execute ccluarxrtl
	select into "nl:"
	from (dummyt d with seq = size(arglist->ObservationComponents,5))
	plan d
	head report
		x = 0
 
		head d.seq
			val_cnt = 0
			y = 0
			x = x + 1
			j = 0
			stat = alterlist(input->medAdminComponents,x)
			input->medAdminComponents[x].dEventCd = cnvtreal(arglist->ObservationComponents[d.seq].ComponentId)
			input->medAdminComponents[x].dObservationId = cnvtreal(arglist->ObservationComponents[d.seq].ObservationId)
			input->medAdminComponents[x].sValue = trim(arglist->ObservationComponents[d.seq].Value)
 
			;collating sequence
			numstr = trim(cnvtstring(x),3)
			input->medAdminComponents[x].sCollatingSeq = build2("000000000",numstr)
 
 			input->medAdminComponents[x].sReferenceNumber = uar_createuuid(0)
 			if(size(arglist->ObservationComponents[d.seq].Comment) > 0)
 				input->medAdminComponents[x].comment = build2(c_rtf_prefix,
 															nullterm(trim(arglist->ObservationComponents[d.seq].Comment)),
 																c_rtf_suffix)
 				input->medAdminComponents[x].commentSize = textlen(nullterm(input->medAdminComponents[x].comment))
 			endif
			;parsing out the value codes
 			val_cnt = size(arglist->ObservationComponents[d.seq].valueCodes,5)
			if(val_cnt > 0)
 				for(y = 1 to val_cnt)
 					if(cnvtreal(arglist->ObservationComponents[d.seq].valueCodes[y]) > 0)
 						j = j + 1
 						stat = alterlist(input->medAdminComponents[d.seq].ValueCodes,j)
 						input->medAdminComponents[d.seq].ValueCodes[j].nomenclature_id =
																	cnvtreal(arglist->ObservationComponents[d.seq].valueCodes[y])
						 runValCodeCheck =1
				     endif
				endfor
			endif
 		foot d.seq
 			input->medAdminComponents[d.seq].ValueCdCnt = size(input->medAdminComponents[d.seq].ValueCodes,5)
	foot report
		input->medAdminCompCnt = x
	with nocounter
 
endif
 
 
if(iDebugFlag > 0)
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("dPositionCd -> ",dPositionCd))
	call echorecord(input)
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) = null with protect
declare ValidateSite(null)				= null with protect ;601571 - bsc_get_med_interval
declare GetOrderDetails(null)			= i2 with protect	;600578 - dcp_get_ord_dtls_for_charting
declare CheckMedicationInterval(null) 	= i2 with protect	;601571 - bsc_get_med_interval
declare GetPrsnlReltn(null)				= i2 with protect	;600320 - pts_get_ppr_yn
declare GetPrivileges(null)				= i2 with protect	;680500 - MSVC_GetPrivilegesByCodes
declare CheckPrivileges(null) 			= i2 with protect 	;680501 - MSVC_CheckPrivileges
declare GetMedTasks(null)				= i2 with protect	;560307 - DCP.QueryTasks
declare PostImmunization(null)			= null with protect	;1000071 - event_batch_ensure
declare EnsureEvents(null)				= null with protect	;600345 - dcp_events_ensured
declare CreatePharmacyCharge(null)		= i2 with protect	;305660 - PHA.AdminCharge
declare UpdateAdminTask(null)			= i2 with protect	;560303 - DCP.ModTask
declare CreateInfusionTask(null)		= i2 with protect 	;601577 - bsc_generate_infusion_task
declare PostMedAdminAudit(null)			= i2 with protect	;600905 - dcp_add_audit_info
declare ProcessMedBarcode(null)        	= i2 with protect 	;601557 - bsc_process_med_barcode
declare EarlyLateReasonCheck(null)      = null with protect
declare GetVaccineReference(null)       = null with protect ;966902 - Immunization_GetVaccineReference
declare UpdateImmunizationInfo(null)    = null with protect ;601602 - bsc_upd_immun_info
declare ValueCodeCheck(null)            = null with protect
declare GetObsCompInfo(null)            = null with protect
declare GetMedDiscretes(null)           = null with protect ;Gets the med and discretes and verfies is it's included
declare ValidateTimeFormat(time = vc) = i4 with protect	; verifies time is 24hr format with four digits
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
if(input->dClinicianId = 0) call ErrorMsg("ClinicianId","2055","M") endif
;checks if dose and volume are present when isnogiven is false
if(input->iIsNotGiven < 1)
	if(input->dDose = 0 and input->dVolume = 0) call ErrorMsg("Dose and/or Volume","2055","M") endif
endif
 
;validate dScheduledAdministrationId is not an IV or continous and is populated
if(input->dScheduledAdministrationId = 0)
	call ErrorMsg("ScheduledAdministrationId","2055","M")
else
	declare iFound = i2
	select into "nl:"
	from task_activity ta
	where ta.task_id = input->dScheduledAdministrationId
		and (ta.task_class_cd = c_cont_task_clss_cd
		or ta.iv_ind = 1)
	detail
		iFound = 1
	with nocounter
 
	if(iFound > 0)
		call ErrorMsg("ScheduledAdministrationId not valid(IV task not allowed)","9999","E")
	endif
 
endif
 
;Validate dates provided aren't in the future
if(input->qAdminDateTime > cnvtdatetime(curdate,curtime3))
	call ErrorMsg("AdministrationDateTime cannot be in the future","9999","E")
endif
if(input->qDocumentedDateTime > cnvtdatetime(curdate,curtime3))
	call ErrorMsg("DocumentedDateTime cannot be in the future","9999","E")
endif
 
 
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
set iRet = PopulateAudit(input->sUserName, input->dPatientId, immunization_create_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
;Validate RouteCd if isNotGiven is false
if(input->iIsNotGiven < 1)
	set iRet = GetCodeSet(input->dRouteCd)
	if(iRet != 4001)
		call ErrorMsg("RouteCd","9999","I")
	else
		;Verify if site should be required - 600906 - bsc_get_code_value_by_ext
		call ValidateSite(null)
	endif
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
 
;validate SystemId and ReferenceNumber
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
				call ErrorMsg("The ReferenceNumber already exists. Please provide a unique number.","9999","E")
			endif
		endif
	endif
else
	set input->dSystemId = reqdata->contributor_system_cd
 
	;Check reference number is null
	if(input->sReferenceNumber > " ")
		call ErrorMsg("A systemId is required for a reference number to be used.","9999","E")
	else;sets the reference_number to be used
		execute ccluarxrtl
		set input->sReferenceNumber = uar_createuuid(0)
	endif
endif
 
;validate WitnessId is a valid
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
 
	if(valid_witness < 1)
		call ErrorMsg("WitnessId is not a valid provider","9999", "E")
	endif
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
			if(iRet != 4000040) call ErrorMsg("MedicationNotScannedReasonCd","9999","I") endif
		endif
	endif
endif
 
;validate the earlylatereason_cd
if(input->dEarlyOrLateReason > 0)
	set iRet = GetCodeSet(input->dEarlyOrLateReason)
	if(iRet !=  4000020	) call ErrorMsg("EarlyOrLateReasonCd","9999","I") endif
 
endif
 
;validate manufacturer code
if(input->dManufacturer > 0)
	set iRet = GetCodeSet(input->dManufacturer)
	if(iRet !=  221	) call ErrorMsg("Manufacturer","9999","I") endif
 
endif
 
;validate Vaccine for Children code
if(input->dVaccineForChild > 0)
	set iRet = GetCodeSet(input->dVaccineForChild)
	if(iRet !=  30741	) call ErrorMsg("Vaccine For Children","9999","I") endif
 
endif
 
 
 
;validate Funding source code
if(input->dFundingSource > 0)
	set iRet = GetCodeSet(input->dFundingSource)
	if(iRet != 4002904	) call ErrorMsg("Vaccine Info Sheet","9999","I") endif
 
endif
 
;Checking if there needs to be an early/late reason with 15 minute window
;020
;call EarlyLateReasonCheck(null)
 
; Get order details -- 600578 - dcp_get_ord_dtls_for_charting
set iRet = GetOrderDetails(null)
if(iRet = 0) call ErrorMsg("Could not get order details (600578).","9999","E") endif
 
;validate Vaccine Info Sheet code
if(input->dVaccineInfoSheet > 0)
	set iRet = GetCodeSet(input->dVaccineInfoSheet)
	if(iRet !=  4002875	)
		call ErrorMsg("Vaccine Info Sheet","9999","I")
	else
		;gets the vaccine reference if passed in
		call GetVaccineReference(null)
	endif
 
endif
 
 
;validate the earlylatereason_cd
if(input->dEarlyOrLateReason > 0)
	set iRet = GetCodeSet(input->dEarlyOrLateReason)
	if(iRet !=  4000020	) call ErrorMsg("EarlyOrLateReasonCd","9999","I") endif
 
endif
 
 
;Checking if there needs to be an early/late reason with 15 minute window
;020
;call EarlyLateReasonCheck(null)
 
; Get order details -- 600578 - dcp_get_ord_dtls_for_charting
set iRet = GetOrderDetails(null)
if(iRet = 0) call ErrorMsg("Could not get order details (600578).","9999","E") endif
 
;Validation if Observation Components need to be verified and validated
if(input->medAdminCompCnt > 0)
	call GetObsCompInfo(null)
	call GetMedDiscretes(null)
endif
 
;Validate Value Codes
if(runValCodeCheck > 0)
	call ValueCodeCheck(null)
endif
 
; Get medication tasks -- 560307 - DCP.QueryTasks
set iRet = GetMedTasks(null)
if(iRet = 0) call ErrorMsg("Could not get medication tasks (560307).","9999","E") endif
 
if(input->iIsNotGiven = 0)
	; Check Medication Interval -- 601571 - bsc_get_med_interval
    ;021
    if(input->enforceMedInterval > 0)
	   set iRet = CheckMedicationInterval(null)
	   if(iRet = 0) call ErrorMsg("Could not get medication interval data(601571).","9999","E") endif
	endif
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
 
; Process med barcode -- 601557 - bsc_process_med_barcode
if(size(input->sMedBarcode) > 0)
	set iRet = ProcessMedBarcode(null)
	if(iRet = 0) call ErrorMsg("Could not process medication barcode (601557).","9999","E") endif
endif
 
 
; Post Immunization -- 1000071 - event_batch_ensure
call PostImmunization(null)
 
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
 
; Updating Imunization information
call UpdateImmunizationInfo(null)
 
;Set audit to successful
call ErrorHandler2(c_error_handler, "S", "Success", "Med administration posted successfully.",
"0000", "Med administration posted successfully.", immunization_create_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(immunization_create_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(immunization_create_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_immune.json")
	call echo(build2("_file : ", _file))
	call echojson(immunization_create_reply_out, _file, 0)
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
			error_code, build2("Missing required field: ",msg), immunization_create_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), immunization_create_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, immunization_create_reply_out)
	endcase
 
	if(iDebugFlag > 0)
		call echo(concat("ErrorMsg Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateSite(null) = null - 600906 - bsc_get_code_value_by_ext
;  Description: Verify if the site field is required based on route provided
**************************************************************************/
subroutine ValidateSite(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateSite Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from code_value cv
		,code_value_extension cve
	plan cv where cv.code_value = input->dRouteCd
		and cv.code_set = 4001
	join cve where cve.code_value = outerjoin(cv.code_value)
		and cve.field_name = outerjoin("IV_SITE_REQ")
	detail
		if(cnvtint(cve.field_value) > 0)
			iSiteRequired = cnvtint(cve.field_value)
		elseif(cv.cdf_meaning in ("IV","IM","SQ","TOP","SC"))
			iSiteRequired = 2
		endif
	with nocounter
 
 	if(iSiteRequired = 2)
		;Validate SiteCd
		if(input->dSiteCd > 0)
			set iRet = GetCodeSet(input->dSiteCd)
			if(iRet != 97) call ErrorMsg("SiteCd","9999","I") endif
		else
			call ErrorMsg("SiteCd","9999","M")
		endif
 
		; Validate the site goes with the route if code set grouping is defined
		set grouping_exists = 0
		set site_found = 0
 
		select into "nl:"
		from code_value_group cvg
			, code_value cv
		plan cvg where cvg.parent_code_value = input->dRouteCd
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
			"9999", "PatientId/OrderId mismatch.", immunization_create_reply_out)
			go to exit_script
		endif
 
		; Get Facility, Nurse Unit, and Encounter timezone
		select into "nl:"
		from encounter e
		, time_zone_r t
		plan e where e.encntr_id = 600578_rep->encntr_id
		join t where t.parent_entity_name = "LOCATION"
			and t.parent_entity_id = e.loc_facility_cd
		detail
			dFacilityCd = e.loc_facility_cd
			dNurseUnitCd = e.loc_nurse_unit_cd
			iTimeZone =  datetimezonebyname(trim(t.time_zone,3))
			input->dOrg_id = e.organization_id
		with nocounter
 
 		; Set infused volume flag
 		if(input->iIsNotGiven < 1)
			for(i = 1 to size(600578_rep->ingred_qual,5))
				if(600578_rep->ingred_qual[i].strength > 0 and 600578_rep->ingred_qual[i].volume > 0)
					set iInfusedVolume = 1
 
					if(input->dVolume = 0 or input->dDose = 0)
						call ErrorMsg("This medication requires a dose and a volume.","9999","E")
					endif
				endif
			endfor
 		endif
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
 
 	;checks if witness is required
		set req_size = size(600578_rep->ingred_qual,5)
		if(input->dWitnessId = 0 and req_size > 0)
			declare witness_req = i2
			set witness_req = 0
			select into "nl:"
			from (dummyt d with seq = req_size)
			plan d
				where 600578_rep->ingred_qual[d.seq].witness_required_ind > 0
			head report
				witness_req = 1
			with nocounter
 
			if(witness_req > 0)
				call ErrorMsg("Witness required for this Med Admin.","9999","E")
			endif
		endif
 
	endif
 
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
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
		set 560307_req->task_type_list[2].task_type_cd = uar_get_code_by("MEANING",6026,"MED")
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
 
				; Validate task order id matches provided order id
				if(560307_rep->task_list[i].order_id != input->dOrderId)
					call ErrorMsg(build2("Incorrect OrderId provided. Expecting ",560307_rep->task_list[i].order_id),"9999","E")
				endif
			endif
		endfor
 
		if(taskCheck = 0)
			call ErrorMsg("ScheduledAdministrationId.","9999", "I")
		endif
 
	elseif(560307_rep->status_data.status = "Z")
		call ErrorMsg("No administration tasks exist.","9999","E")
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedTasks Runtime: ",
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
					call ErrorMsg("Medication interval violation.","9999","E")
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
;  Name: ProcessMedBarcode(null) = i2 with protect ;601577 - bsc_generate_infusion_task
;  Description: Create infusion task if applicable
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
 
	;Setup request
	set 601557_req->barcode = input->sMedBarcode
	set 601557_req->person_id = input->dPatientId
	set 601557_req->location_cd = dFacilityCd
	set stat = alterlist(601557_req->encntr_list,1)
	set 601557_req->encntr_list[1].encntr_id = 600578_rep->encntr_id
	set 601557_req->order_info_ind = 1
	set 601557_req->multi_ingred_ind = 1
 
	;Execute request
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
;  Name: PostImmunization(null)	= null with protect	;1000071 - event_batch_ensure
;  Description: Post the Immunization event
**************************************************************************/
subroutine PostImmunization(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostImmunization Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
			call uar_crmendapp (happ )
			call ErrorMsg(build2("BEGINTASK=" ,cnvtstring (crmstatus)),"9999","E")
		endif
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			call uar_crmendapp (happ )
			call ErrorMsg(concat ("BEGINREQ=" ,cnvtstring(crmstatus)),"9999","E")
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
 
		    ;create medadmin structure
		    if(size(input->sMedBarcode) > 0)
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
				set stat = uar_srvsetdouble(hce,"order_id",input->dOrderId)
				set stat = uar_srvsetdouble(hce,"catalog_cd",600578_rep->catalog_cd)
				set stat = uar_srvsetdouble(hce,"person_id",600578_rep->person_id)
				set stat = uar_srvsetdouble(hce,"encntr_id",600578_rep->encntr_id)
				set stat = uar_srvsetdouble(hce,"contributor_system_cd",input->dSystemId)
				set stat = uar_srvsetdouble(hce,"event_class_cd",c_grp_event_class_cd)
				set stat = uar_srvsetdouble(hce,"event_cd",c_dcpgeneric_event_cd)
				set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(input->qAdminDateTime))
				set stat = uar_srvsetdouble(hce,"record_status_cd",c_active_record_status_cd)
				set stat = uar_srvsetdouble(hce,"result_status_cd",c_auth_result_status_cd)
				set stat = uar_srvsetshort(hce,"authentic_flag",1)
				set stat = uar_srvsetshort(hce,"publish_flag",1)
				set stat = uar_srvsetlong(hce,"order_action_sequence",600578_rep->last_action_sequence)
				set stat = uar_srvsetdouble(hce,"entry_mode_cd",c_medadmin_entry_mode_cd)
				set stat = uar_srvsetlong(hce,"event_end_tz",iTimeZone)
 				set stat = uar_srvsetdouble(hce,"replacement_event_id",1.0)
 				set stat = uar_srvsetdouble(hce,"updt_id",input->dClinicianId)
 
 				;sets the event note if it is late
 				if(input->dEarlyOrLateReason or size(input->sEarlyOrLateReason) > 0)
 					set henote1 = uar_srvadditem(hce,"event_note_list")
 					declare earlyLateStr = vc
 					declare earlyLateSize = i4
 					if(size(input->sEarlyOrLateReason) > 0)
 						set earlyLateStr = trim(input->sEarlyOrLateReason)
 					elseif(input->dEarlyOrLateReason > 0)
 						set earlyLateStr = trim(uar_get_code_display(input->dEarlyOrLateReason))
 					endif
 					set earlyLateSize = size(earlyLateStr)
 					if(henote1)
							set stat = uar_srvsetdouble(henote1,"note_type_cd", c_earlyLateNoteType_cd)
							set stat = uar_srvsetdouble(henote1,"note_format_cd",c_asNote_cd)
							set stat = uar_srvsetdouble(henote1,"entry_method_cd",c_Cerner_note_cd)
							set stat = uar_srvsetdouble(henote1,"note_prsnl_id",input->dClinicianId)
							set stat = uar_srvsetdate(henote1,"note_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
							set stat = uar_srvsetdouble(henote1,"record_status_cd",c_active_record_status_cd)
							set stat = uar_srvsetdouble(henote1,"compression_cd",c_ocf_compression_cd)
							set stat = uar_srvsetasis(henote1,"long_blob",earlyLateStr,earlyLateSize)
							set stat = uar_srvsetlong(henote1,"note_tz",iTimeZone)
						else
							call ErrorMsg("Could not create henote1.","9999","E")
						endif
 				endif
 
/*
 				if(input->sReferenceNumber > " ")
					set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(input->sReferenceNumber))
					set stat = uar_srvsetstring(hce,"series_ref_nbr",nullterm(input->sReferenceNumber))
				endif
*/
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
						set stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
 
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
 
				; Result Set Link List
				set hres = uar_srvadditem(hce,"result_set_link_list")
				if(hres)
					set stat = uar_srvsetdouble(hres,"entry_type_cd",c_medadmin_entry_type_cd)
					set stat = uar_srvsetdouble(hres,"result_set_group",1.0)
				else
					call ErrorMsg("Could not create hres.","9999","E")
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
					set stat = uar_srvsetdouble(hce2,"contributor_system_cd",input->dSystemId)
					set stat = uar_srvsetdouble(hce2,"event_class_cd",c_med_event_class_cd)
					set stat = uar_srvsetdouble(hce2,"event_cd",600578_rep->event_cd)
 					set stat = uar_srvsetstring(hce2,"reference_nbr",nullterm(input->sReferenceNumber))
 
 
 
					declare event_tag = vc
					if(input->iIsNotGiven = 0)
						if(iMedChanged)
							if(input->dDose > 0)
								set doseStr = trim(input->sDose,3)
								if(size(doseStr) < 4)
									set event_tag = build2(doseStr," ",trim(uar_get_code_display(input->dDoseUnitCd),3))
								elseif(size(doseStr) < 7)
									set event_tag = build2(format(doseStr,"###,###;;c")," ",trim(uar_get_code_display(input->dDoseUnitCd),3))
								else
									set event_tag = build2(format(doseStr,"###,###,###;;c")," ",trim(uar_get_code_display(input->dDoseUnitCd),3))
								endif
							else
								set volStr = trim(input->sVolume,3)
								if(size(volStr) < 4)
									set event_tag = build2(volStr," ",trim(uar_get_code_display(input->dVolumeUnitCd),3))
								elseif(size(volStr) < 7)
									set event_tag = build2(format(volStr,"###,###;;c")," ",trim(uar_get_code_display(input->dVolumeUnitCd),3))
								else
									set event_tag = build2(format(volStr,"###,###,###;;c")," ",trim(uar_get_code_display(input->dVolumeUnitCd),3))
								endif
							endif
						else
							set event_tag = trim(piece(600578_rep->clinical_display_line,",",1,""),3)
						endif
					else
						set event_tag = build2("Not Given: ",trim(uar_get_code_display(input->dReasonNotGiven),3))
					endif
 
					set stat = uar_srvsetstring(hce2,"event_tag",nullterm(event_tag))
					set stat = uar_srvsetdate(hce2,"event_end_dt_tm",cnvtdatetime(input->qAdminDateTime))
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
					set stat = uar_srvsetlong(hce2,"event_end_tz",iTimeZone)
					set stat = uar_srvsetlong(hce2,"order_action_sequence",600578_rep->last_action_sequence)
					set stat = uar_srvsetdouble(hce2,"updt_id",input->dClinicianId)
					set stat = uar_srvsetstring(hce2,"collating_seq",nullterm("0000000000"))
 
 
 					if(input->iIsNotGiven = 0)
						;Med Result List
						set hmed = uar_srvadditem(hce2 ,"med_result_list")
						if(hmed)
							set stat = uar_srvsetshort(hmed,"ensure_type",2)
 
 							/*
 							if(size(nullterm(input->sComments)) > 120)
 								declare admin_note_st = c120
 								set admin_note_st = nullterm(input->sComments)
 								set stat = uar_srvsetstring(hmed,"admin_note",admin_note_st)
 							else
 								set stat = uar_srvsetstring(hmed,"admin_note",nullterm(input->sComments))
 							endif
 							*/
 							set stat = uar_srvsetdouble(hmed,"admin_method",input->dActionCd)
							set stat = uar_srvsetdouble(hmed,"admin_prov_id",input->dClinicianId)
							set stat = uar_srvsetdate(hmed,"admin_start_dt_tm",cnvtdatetime(input->qAdminDateTime))
							set stat = uar_srvsetdate(hmed,"admin_end_dt_tm",cnvtdatetime(input->qAdminDateTime))
							set stat = uar_srvsetdouble(hmed,"admin_route_cd",input->dRouteCd)
 
							if(iSiteRequired > 0)
								set stat = uar_srvsetdouble(hmed,"admin_site_cd",input->dSiteCd)
							endif
 
							;infusions
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
							set stat = uar_srvsetstring(hmed,"substance_lot_number",nullterm(input->sLotNbr))
							set stat = uar_srvsetdate(hmed,"substance_exp_dt_tm",cnvtdatetime(input->qExpDate))
							set stat = uar_srvsetdouble(hmed,"substance_manufacturer_cd",input->dManufacturer)
							set stat = uar_srvsetdouble(hmed,"infusion_rate",input->dRate)
							set stat = uar_srvsetdouble(hmed,"infusion_unit_cd",input->dRateUnitCd)
							set stat = uar_srvsetdouble(hmed,"synonym_id",600578_rep->synonym_id)
							set stat = uar_srvsetlong(hmed,"admin_start_tz",iTimeZone)
						else
							call ErrorMsg("Could not create hmed.","9999","E")
						endif
 
						;setting med_admin_reltn_list
				  		if(size(input->sMedBarcode) > 0)
				  			set hmar2 = uar_srvadditem(hce2,"med_admin_reltn_list")
				  			if(hmar2)
				  				set stat = uar_srvsetdouble(hmar2,"med_admin_reltn",1.0)
				  			endif
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
							call ErrorMsg("Could not create hcode.","9999","E")
						endif
					endif
 
					; Comments
					if(input->sComments > " ")
						declare final_comment = vc
						declare final_comment_size = i4
 
						set final_comment = build2("{\rtf1\ansi\ansicpg1252\deff0\deflang1033{\fonttbl"
													,"{\f0\fnil\fcharset0 Segoe UI;}}\viewkind4\"
															,"uc1\pard\f0\fs20 ",nullterm(input->sComments),"\par")
						set final_comment_size = textlen(final_comment)
 
						set henote = uar_srvadditem(hce2,"event_note_list")
						if(henote)
							set stat = uar_srvsetdouble(henote,"note_type_cd",c_rescomment_note_type_cd)
							set stat = uar_srvsetdouble(henote,"note_format_cd",c_rtf_note_format_cd)
							set stat = uar_srvsetdouble(henote,"entry_method_cd",c_unknown_entry_method_cd)
							set stat = uar_srvsetdouble(henote,"note_prsnl_id",input->dClinicianId)
							set stat = uar_srvsetdate(henote,"note_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
							set stat = uar_srvsetdouble(henote,"record_status_cd",c_active_record_status_cd)
							set stat = uar_srvsetdouble(henote,"compression_cd",c_ocf_compression_cd)
							set stat = uar_srvsetasis(henote,"long_blob",final_comment,final_comment_size)
							set stat = uar_srvsetlong(henote,"note_tz",iTimeZone)
						else
							call ErrorMsg("Could not create henote.","9999","E")
						endif
					endif
 
					; Event Prsnl
					set hprsnl2 = uar_srvadditem(hce2,"event_prsnl_list")
					if(hprsnl2)
						set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_perform_action_type_cd)
						set stat = uar_srvsetdate(hprsnl2,"action_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
						set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",input->dClinicianId)
						set stat = uar_srvsetdouble(hprsnl2,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl2,"action_tz",iTimeZone)
					else
						call ErrorMsg("Could not create hprsnl2.","9999","E")
					endif
 
					; Result Set Link List
					set hres2 = uar_srvadditem(hce2,"result_set_link_list")
					if(hres2)
						set stat = uar_srvsetdouble(hres2,"entry_type_cd",c_medadmin_entry_type_cd)
						set stat = uar_srvsetdouble(hres2,"result_set_group",1.0)
					else
						call ErrorMsg("Could not create hres2.","9999","E")
					endif
				else
					call ErrorMsg("Could not create hce2.","9999","E")
				endif
			else
				call ErrorMsg("Could not create HCE.","9999","E")
			endif
 
			;;;This is where the for loop for the child events go
			;;building out the obs that are attached to the Med Admin
			if(input->medAdminCompCnt > 0)
 
				for(i = 1 to input->medAdminCompCnt)
 
					if(input->medAdminComponents[i].dObservationId = 0)
			  			;set hce_type = uar_srvcreatetypefrom (hreq ,"clin_event" )
						;set hce_struct = uar_srvgetstruct (hreq ,"clin_event" )
						;set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
						set hce3 = uar_srvadditem (hce_struct ,"child_event_list" )
 
						if(hce3)
							call uar_srvbinditemtype (hce3 ,"child_event_list" ,hce_type )
 							set stat = uar_srvsetlong (hce3 ,"view_level" ,1 )
 							set stat = uar_srvsetdouble(hce3,"order_id",input->dOrderId)
 							set stat = uar_srvsetdouble(hce3,"catalog_cd",600578_rep->catalog_cd)
 							set stat = uar_srvsetdouble(hce3,"person_id", input->dPatientId)
							set stat = uar_srvsetdouble(hce3,"encntr_id",600578_rep->encntr_id)
							set stat = uar_srvsetdouble(hce3,"contributor_system_cd",input->dSystemId)
							set stat = uar_srvsetdouble (hce3,"event_class_cd" ,input->medAdminComponents[i].dEventClassCd )
							set stat = uar_srvsetdouble (hce3 ,"event_cd" ,input->medAdminComponents[i].dEventCd )
							set stat = uar_srvsetdate (hce3 ,"event_start_dt_tm" ,cnvtdatetime(input->qAdminDateTime ))
							set stat = uar_srvsetdate (hce3 ,"event_end_dt_tm" ,cnvtdatetime(input->qAdminDateTime ))
							set stat = uar_srvsetdouble (hce3 ,"task_assay_cd" ,input->medAdminComponents[i].dTaskAssayCd )
							set stat = uar_srvsetdouble (hce3 ,"record_status_cd" ,c_active_record_status_cd )
							set stat = uar_srvsetdouble (hce3 ,"result_status_cd" ,c_auth_result_status_cd)
							set stat = uar_srvsetshort (hce3 ,"authentic_flag" ,1 )
							set stat = uar_srvsetshort (hce3 ,"publish_flag" ,1 )
 
							;normalcy code
							if(input->medAdminComponents[i].iNormalcyInd > 0)
								set stat = uar_srvsetdouble (hce3 ,"normalcy_cd",input->medAdminComponents[i].dNormalcyCd)
								set stat = uar_srvsetstring (hce3 ,"normal_high"
												,nullterm(cnvtstring(input->medAdminComponents[i].dNormalHigh)))
								set stat = uar_srvsetstring (hce3 ,"normal_low"
															,nullterm(cnvtstring(input->medAdminComponents[i].dNormalLow)))
							endif
 
							if(input->medAdminComponents[i].iCriticalInd > 0)
								set stat = uar_srvsetstring (hce3 ,"critical_high"
																	,nullterm(cnvtstring(input->medAdminComponents[i].dCriticalHigh)))
								set stat = uar_srvsetstring (hce3 ,"critical_low"
																	,nullterm(cnvtstring(input->medAdminComponents[i].dCriticalHigh)))
							endif
 
							set stat = uar_srvsetdouble (hce3 ,"result_units_cd",input->medAdminComponents[i].dResultUnitCd)
							set stat = uar_srvsetshort (hce3 ,"event_start_tz",iTimeZone)
							set stat = uar_srvsetshort (hce3 ,"event_end_tz",iTimeZone)
							set stat = uar_srvsetshort (hce3 ,"replacement_event_id",1)
							set stat = uar_srvsetdouble (hce3 ,"task_assay_version_nbr",input->medAdminComponents[i].dTaskVersionNbr)
 							set stat = uar_srvsetstring(hce3,"reference_nbr",nullterm(input->medAdminComponents[i].sReferenceNumber))
 
 							; Text based results including numeric results
 							if(input->medAdminComponents[i].stringResultInd > 0)
								set hstring = uar_srvadditem (hce3 ,"string_result" )
								if(hstring)
									set stat = uar_srvsetstring (hstring ,"string_result_text"
														,nullterm(input->medAdminComponents[i].sValue))
									set stat = uar_srvsetdouble (hstring ,"string_result_format_cd"
														,input->medAdminComponents[i].dStringResultFormatCd)
									set stat = uar_srvsetdouble (hstring ,"unit_of_measure_cd"
																					,input->medAdminComponents[i].dResultUnitCd)
 								endif
							endif
 
							; Date based results
							if(input->medAdminComponents[i].dateResultInd > 0)
								set hdate = uar_srvadditem (hce3 ,"date_result" )
								if(hdate)
									call echo(build2("qFinalObsDateTime->",input->medAdminComponents[i].qDateTimeResVal))
									set stat = uar_srvsetdate (hdate ,"result_dt_tm",input->medAdminComponents[i].qDateTimeResVal)
									set stat = uar_srvsetshort (hdate ,"date_type_flag",input->medAdminComponents[i].dateTypeFlag)
								endif
							endif
 
							; Coded results
							if(input->medAdminComponents[i].codedResultsInd > 0)
								set crCnt = 0
								for(r = 1 to input->medAdminComponents[i].ValueCdCnt)
									set crCnt = crCnt + 1
									set hcoded = uar_srvadditem(hce3,"coded_result_list")
									if(hcoded)
										set stat = uar_srvsetlong(hcoded,"sequence_nbr",crCnt)
	 									set stat = uar_srvsetdouble(hcoded,"nomenclature_id"
	 												,input->medAdminComponents[i].ValueCodes[r].nomenclature_id)
	 									set stat = uar_srvsetstring(hcoded,"mnemonic"
	 												,nullterm(input->medAdminComponents[i].ValueCodes[r].mnemonic))
										set stat = uar_srvsetstring(hcoded,"short_string"
													,nullterm(input->medAdminComponents[i].ValueCodes[r].short_string))
										set stat = uar_srvsetstring(hcoded,"descriptor"
													,nullterm(input->medAdminComponents[i].ValueCodes[r].description))
										set stat = uar_srvsetdouble(hcoded,"unit_of_measure_cd"
													,input->medAdminComponents[i].ValueCodes[r].unit_cd)
									else
										call ErrorMsg("Could not Create hce3 hcoded","9999","E")
									endif
								endfor
							endif
							; Additional section for IO results
							if(input->medAdminComponents[i].io_type_flag > 0)
								set hio = uar_srvadditem (hce3 ,"intake_output_result" )
								if(hio)
									set stat = uar_srvsetdate (hio ,"io_start_dt_tm" ,input->qDocumentedDateTime )
									set stat = uar_srvsetdate (hio ,"io_end_dt_tm" ,input->qDocumentedDateTime )
									set stat = uar_srvsetshort(hio ,"io_type_flag", input->medAdminComponents[i].io_type_flag)
									set stat = uar_srvsetdouble(hio,"io_volume",cnvtreal(input->medAdminComponents[i].sValue))
									set stat = uar_srvsetdouble(hio,"io_status_cd",c_io_status_confirmed)
									set stat = uar_srvsetdouble(hio,"reference_event_cd",input->medAdminComponents[i].dEventCd)
								endif
							endif
 
							; Add comments if they exist
 							if(size(input->medAdminComponents[i].comment) > 0)
 
								set hnote = uar_srvadditem(hce3,"event_note_list")
								if(hnote)
									set stat = uar_srvsetdouble(hnote,"note_type_cd",c_rescomment_note_type_cd)
									set stat = uar_srvsetdouble(hnote,"note_format_cd",c_rtf_note_format_cd)
									set stat = uar_srvsetdouble(hnote,"entry_method_cd",c_unknown_entry_method_cd)
									set stat = uar_srvsetdouble(hnote,"note_prsnl_id",input->dClinicianId)
									set stat = uar_srvsetdate(hnote,"note_dt_tm",cnvtdatetime(input->qDocumentedDateTime))
									set stat = uar_srvsetdouble(hnote,"record_status_cd",c_active_record_status_cd)
									set stat = uar_srvsetdouble(hnote,"compression_cd",c_ocf_compression_cd)
									set stat = uar_srvsetasis(hnote,"long_blob",
														input->medAdminComponents[i].comment,input->medAdminComponents[i].commentSize)
									set stat = uar_srvsetshort(hnote,"note_tz",iTimeZone)
								else
									call ErrorMsg("Could not create hce3 henote.","9999","E")
								endif
							endif
 
							 ;hprsnl
							set ePrsnlSize = 2
 
							for(j = 1 to ePrsnlSize )
								set hprsnl = uar_srvadditem (hce3 ,"event_prsnl_list" )
								if(hprsnl)
									set stat = uar_srvsetshort (hprsnl, "action_tz", iTimeZone)
									set stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,input->dClinicianId)
									set stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,cnvtdatetime(input->qDocumentedDateTime) )
 
									if(j = 1)
										set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_perform_action_type_cd )
										set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_completed_action_status_cd)
											;set sMsgTxt = "Perform"
									else
										set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_verify_action_type_cd)
										set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_completed_action_status_cd )
											;set sMsgTxt = "Verify"
									endif
								 else
									call ErrorMsg("Could not create hprsnl3","9999","E")
 
								endif
							endfor
 
							; Result Set Link List
							set hres3 = uar_srvadditem(hce3,"result_set_link_list")
							if(hres3)
								set stat = uar_srvsetdouble(hres3,"entry_type_cd",c_medadmin_entry_type_cd)
								set stat = uar_srvsetdouble(hres3,"result_set_group",1.0)
							else
								call ErrorMsg("Could not create hres3.","9999","E")
							endif
						endif;end if hce3
					endif;end if(input->medAdminComponents[i].dObservationId = 0)
 
				endfor;end for(i = 1 to input->medAdminCompCnt)
			endif;end if(input->medAdminCompCnt > 0)
		endif;end if(hce)
 
		;creates the new request of the acknowledge
 		if(input->medAdminCompCnt > 0)
 			for(i = 1 to input->medAdminCompCnt)
 				if(input->medAdminComponents[i].dObservationId > 0)
 					set hreq = uar_srvadditem(hrequest,"req")
					set stat = uar_srvsetshort (hreq,"ensure_type", 2 )
 
					;clin_event
					set hce = uar_srvgetstruct (hreq ,"clin_event")
					if(hce)
						set stat = uar_srvsetdouble(hreq,"event_id", input->medAdminComponents[i].dObservationId)
						set stat = uar_srvsetshort(hreq,"view_level_ind",1)
						set stat = uar_srvsetshort(hreq,"event_start_dt_tm_ind",1)
						set stat = uar_srvsetshort(hreq,"event_end_dt_tm_ind",1)
						set stat = uar_srvsetshort(hreq,"event_end_dt_tm_os_ind",1)
						set stat = uar_srvsetshort(hreq,"authentic_flag_ind",1)
						set stat = uar_srvsetshort(hreq,"publish_flag_ind",1)
						set stat = uar_srvsetshort(hreq,"expiration_dt_tm_ind",1)
 
						; Result Set Link List
						set hres = uar_srvadditem(hce,"result_set_link_list")
						if(hres)
							set stat = uar_srvsetdouble(hres,"entry_type_cd",c_medadmin_entry_type_cd)
							set stat = uar_srvsetdouble(hres,"result_set_group",1.0)
							set stat = uar_srvsetdouble(hres,"relation_type_cd",c_ackowledge_cd)
						else
							call ErrorMsg("Could not create hresackknmowledge.","9999","E")
						endif
					endif
				endif;if(input->medAdminComponents[i].dObservationId = 0)
 			endfor;	input->medAdminCompCnt
 		endif;input->medAdminCompCnt > 0
 
 
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
							set temp->list[i].event_cd = uar_srvgetdouble(hrb,"event_cd")
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
 
 	; Set administration id
 	set immunization_create_reply_out->administration_id = temp->list[2].event_id
 	if(input->medAdminCompCnt > 0)
 		set temp_list_size = size(temp->list,5)
 		declare i_cnt = i4;size holder
 		for(x = 3 to temp_list_size)
 			set i_cnt = i_cnt + 1
 			set stat = alterlist(immunization_create_reply_out->observations,i_cnt)
 			set immunization_create_reply_out->observations[i_cnt].observation_id = temp->list[x].event_id
 			set immunization_create_reply_out->observations[i_cnt].component.id = temp->list[x].event_cd
 			set immunization_create_reply_out->observations[i_cnt].component.name = trim(uar_get_code_display(temp->list[x].event_cd))
 		endfor
 
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostImmunization Runtime: ",
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
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = iTimeZone
 
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
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = iTimeZone
 		set 600905_req->med_admin_alerts[maSize].next_calc_dt_tm = qNextScheduledDttm
		set 600905_req->med_admin_alerts[maSize].next_calc_tz = iTimeZone
	endif
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600905_req,"REC",600905_req)
 
 
 	;doing the earlylate reason if entered
 	if(input->dEarlyOrLateReason > 0 or size(input->sEarlyOrLateReason) > 0)
 		set stat = initrec(600905_req)
 		;Setup request
		set stat = alterlist(600905_req->admin_events,1)
		set 600905_req->admin_events[1].source_application_flag = 3
		set 600905_req->admin_events[1].event_id = temp->list[2].event_id
		set 600905_req->admin_events[1].order_id = input->dOrderId
		set 600905_req->admin_events[1].documented_action_seq = 1
		set 600905_req->admin_events[1].clinical_warning_cnt = 1
		set 600905_req->admin_events[1].prsnl_id = input->dClinicianId
		set 600905_req->admin_events[1].position_cd = dPositionCd
		set 600905_req->admin_events[1].nurse_unit_cd = dNurseUnitCd
		set 600905_req->admin_events[1].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
		set 600905_req->admin_events[1].event_type_cd = c_taskcomplete_alert_type_cd
 
		;building out med_admin Alerts
		set maSize = size(600905_req->med_admin_alerts,5)
		set maSize  = maSize + 1
		set stat = alterlist(600905_req->med_admin_alerts,maSize)
		set 600905_req->med_admin_alerts[maSize].source_application_flag = 3
		set 600905_req->med_admin_alerts[maSize].alert_type_cd = c_earlylatereason_cd
		set 600905_req->med_admin_alerts[maSize].alert_severity_cd = c_moderate_alert_severity_cd
		set 600905_req->med_admin_alerts[maSize].prsnl_id = input->dClinicianId
		set 600905_req->med_admin_alerts[maSize].position_cd = dPositionCd
		set 600905_req->med_admin_alerts[maSize].nurse_unit_cd = dNurseUnitCd
		set 600905_req->med_admin_alerts[maSize].event_dt_tm = cnvtdatetime(input->qAdminDateTime)
 
		;build out the med_admin alert errro
		set stat = alterlist(600905_req->med_admin_alerts[maSize].med_admin_med_error,1)
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].person_id = input->dPatientId
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].encounter_id = 600578_rep->encntr_id
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].order_id = input->dOrderId
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].action_sequence = 1
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_route_cd = input->dRouteCd
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].event_id = temp->list[2].event_id
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_dt_tm = cnvtdatetime(qTaskSchedDtTm)
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].scheduled_tz = iTaskSchedTz
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_dt_tm = input->qAdminDateTime
		set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].admin_tz = iTimeZone
		if(input->dEarlyOrLateReason > 0)
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = input->dEarlyOrLateReason
		else
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].reason_cd = freeTextReasonCd
			set 600905_req->med_admin_alerts[maSize].med_admin_med_error[1].freetext_reason = input->sEarlyOrLateReason
		endif
 
		;building out the ingredient
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
		;Execute request
 		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600905_req,"REC",600905_req)
 	endif
 
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
 
/*************************************************************************
;  Name: EarlyLateReasonCheck(null)
;  Description: Checks if early late reason is needed
**************************************************************************/
subroutine EarlyLateReasonCheck(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("EarlyLateReasonCheck Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare constantind_det_fnd = i2
	select into "nl:"
	from order_detail od
	where od.order_id =  input->dOrderId
		and od.oe_field_meaning = "CONSTANTIND"
	head report
		constantind_det_fnd = 1
	with nocounter
 
	declare anchor_task_dt_tm = dq8
 
	select into "nl:"
	from task_activity ta
	where ta.task_id =  input->dScheduledAdministrationId
	head report
		anchor_task_dt_tm = ta.task_dt_tm
	with nocounter
 
	set time_diff1 = datetimediff(cnvtdatetime(curdate,curtime3),anchor_task_dt_tm,4);check for too late
	set time_diff2 = datetimediff(anchor_task_dt_tm, cnvtdatetime(curdate,curtime3),4);check for too early
	set ear_late_reas_size = size(trim($EAR_OR_LATE_REAS,3))
 
	if(time_diff1 > 15 and constantind_det_fnd > 0 and ear_late_reas_size < 1)
		call ErrorMsg("EarlyLateReason required because outside time window","9999","E")
	elseif(time_diff2 > 15 and constantind_det_fnd > 0 and ear_late_reas_size < 1)
		call ErrorMsg("EarlyLateReason required because outside time window","9999","E")
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("EarlyLateReasonCheck Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end;
 
/*************************************************************************
;  Name: GetVaccineReference(null)
;  Description: gets the information of vaccine
**************************************************************************/
subroutine GetVaccineReference(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetVaccineReference Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 600907
	set iREQUEST = 966902
 
	declare pid_str = vc
	declare vacc_str = vc
	set pid_str = trim(cnvtstring(input->dPatientId),3)
	set vacc_str = trim(cnvtstring(600578_rep->event_cd),3)
 
	set 966902_req->vaccine_flag = 1
	set 966902_req->vaccine = vacc_str
	set 966902_req->primary_language_type_flag = 3
	set 966902_req->primary_language = pid_str
	set 966902_req->information_statement_flag = 3
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",966902_req,"REC",966902_rep)
 
	if(966902_rep->status_data.status != "S")
		call ErrorMsg("Getting Vaccine Information Error.(966902)","9999","E")
	endif
 
	;getting the publication date of the info sheet
	declare valid = i2
	select into "nl:"
	from (dummyt d1 with seq = size(966902_rep->vaccines[1].information_statements,5))
		 ,(dummyt d2 with seq = 1)
	plan d1
		where maxrec(d2,size(966902_rep->vaccines[1].information_statements[d1.seq].statements,5))
	join d2
		where 966902_rep->vaccines[1].information_statements[d1.seq].statements[d2.seq].vis_cd = input->dVaccineInfoSheet
	head report
		valid = 1
		input->qVisPublishDate = 966902_rep->vaccines[1].information_statements[d1.seq].statements[d2.seq].published_dt_tm
	with nocounter
 
	;checks to see if entered VaccineInfoSheet is valid
	if(valid < 1)
		call ErrorMsg("Vaccine Information Sheet not found for vaccine","9999","I")
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetVaccineReference Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end;GetVaccineReference(null)
 
/*************************************************************************
;  Name: UpdateImmunizationInfo(null)
;  Description: gets the information of vaccine
**************************************************************************/
subroutine UpdateImmunizationInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateImmunizationInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
	set iREQUEST = 601602
 
	set 601602_req->person_id = input->dPatientId
	set 601602_req->organization_id = input->dOrg_id
 
	if(input->iIsNotGiven > 0)
		set stat = alterlist(601602_req->vaccinations_not_given,1)
		set 601602_req->vaccinations_not_given[1].charted_dt_tm = input->qDocumentedDateTime
		set 601602_req->vaccinations_not_given[1].charted_personnel_id = input->dClinicianId
		set 601602_req->vaccinations_not_given[1].reason_cd = input->dReasonNotGiven
	else;updates if given
		set stat = alterlist(601602_req->vaccinations_to_chart,1)
		set 601602_req->vaccinations_to_chart[1].vaccine.event_cd = 600578_rep->event_cd
		set 601602_req->vaccinations_to_chart[1].vfc_status_cd = input->dVaccineForChild
		set 601602_req->vaccinations_to_chart[1].funding_source_cd = input->dFundingSource
		set 601602_req->reference_nbr = input->sReferenceNumber
 
		set stat = alterlist(601602_req->vaccinations_to_chart[1].information_statements_given,1)
		set 601602_req->vaccinations_to_chart[1].clinical_event_id = immunization_create_reply_out->administration_id
		set 601602_req->vaccinations_to_chart[1].information_statements_given[1].vis_cd = input->dVaccineInfoSheet
		set 601602_req->vaccinations_to_chart[1].information_statements_given[1].given_on_dt_tm =
																				cnvtdatetime(input->qInfoGivenDate)
		set 601602_req->vaccinations_to_chart[1].information_statements_given[1].published_dt_tm =
																				cnvtdatetime(input->qVisPublishDate)
	endif
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",601602_req,"REC",601602_rep)
 
	if(601602_rep->status_data.status != "S")
		call ErrorMsg("Getting Vaccine Information Error.(601602)","9999","E")
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateImmunizationInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end;upate immunzation
 
 
/*************************************************************************
;  Name: ValueCodeCheck
;  Description: Subroutine to check nomenclature values
**************************************************************************/
subroutine ValueCodeCheck(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValueCodeCheck Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare check = i2
	declare rec_size = i4
	declare val_code_size = i4
	set rec_size = size(input->medAdminComponents,5)
	for(x = 1 to rec_size)
		set val_code_size = size(input->medAdminComponents[x].ValueCodes,5)
		for(y = 1 to val_code_size)
			set check = 0
			select into "nl:"
			from nomenclature n
				 ,alpha_responses ar
				 ,reference_range_factor rrf
			plan n
			where n.nomenclature_id = input->medAdminComponents[x].ValueCodes[y].nomenclature_id
				and n.active_ind = 1
			join ar
				where ar.nomenclature_id = n.nomenclature_id
					and ar.active_ind = 1
			join rrf
				where rrf.reference_range_factor_id = ar.reference_range_factor_id
					and rrf.active_ind = 1
					and rrf.task_assay_cd = input->medAdminComponents[x].dTaskAssayCd
		    head report
		    	check = 1
		    	input->medAdminComponents[x].ValueCodes[y].mnemonic = trim(n.mnemonic)
		    	input->medAdminComponents[x].ValueCodes[y].short_string = trim(n.short_string)
		    	input->medAdminComponents[x].ValueCodes[y].description = trim(ar.description)
		    	input->medAdminComponents[x].ValueCodes[y].unit_cd = rrf.units_cd
		    with nocounter
 
		    ;check if found
		    if(check < 1)
		    	declare err_msg = vc
		    	set err_msg = build2("Invalid Code Response(",
		    			trim(cnvtstring(input->medAdminComponents[x].ValueCodes[y].nomenclature_id)),")")
		    	call ErrorMsg(err_msg,"9999","E")
				go to exit_script
			endif
 
		endfor;y
	endfor;x
 
 
	if(iDebugFlag > 0)
		call echo(concat("ValueCodeCheck Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end; valuecodecheck
 
/*************************************************************************
;  Name: GetObsCompInfo(null)
;  Description: Subroutine to to fetch the obs info
**************************************************************************/
subroutine GetObsCompInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetObsCompInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare err_res_msg = vc
	declare date = vc
	declare time = vc
	declare numeric_check = i2
	declare Prov_check = i2
 
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
 
	;gets the event_cd for the acknowledged obs
	select into "nl:"
	from (dummyt d with seq = input->medAdminCompCnt)
	     ,clinical_event ce
	plan d
		where input->medAdminComponents[d.seq].dObservationId > 0
	join ce
		where ce.event_id = input->medAdminComponents[d.seq].dObservationId
	head d.seq
		input->medAdminComponents[d.seq].dEventCd = ce.event_cd
		input->medAdminComponents[d.seq].anchor_dt_tm = ce.event_end_dt_tm
	with nocounter
 
	;gets the task info now
	select into "nl:"
	from discrete_task_assay dta
	     ,(dummyt d with seq = input->medAdminCompCnt)
	     ,reference_range_factor rrf
	plan d
	join dta
		where dta.event_cd = input->medAdminComponents[d.seq].dEventCd
			and dta.active_ind = 1
			and dta.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dta.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join rrf
		where dta.task_assay_cd = rrf.task_assay_cd
			and rrf.active_ind = 1
			and rrf.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and rrf.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		dObsVal = 0.00
 
	head d.seq
		input->medAdminComponents[d.seq].dTaskAssayCd = dta.task_assay_cd
		input->medAdminComponents[d.seq].dTaskVersionNbr = dta.version_number
		input->medAdminComponents[d.seq].sTaskMnemonic = trim(dta.mnemonic)
		input->medAdminComponents[d.seq].io_type_flag = dta.io_flag
		input->medAdminComponents[d.seq].dResultUnitCd = rrf.units_cd
 
		;checking normalcy and critical
		dObsVal = 0.0
		input->medAdminComponents[d.seq].iNormalcyInd = rrf.normal_ind
		input->medAdminComponents[d.seq].dNormalHigh = rrf.normal_high
		input->medAdminComponents[d.seq].dNormalLow = rrf.normal_low
		input->medAdminComponents[d.seq].dCriticalHigh = rrf.critical_high
		input->medAdminComponents[d.seq].dCriticalLow = rrf.critical_low
		input->medAdminComponents[d.seq].iCriticalInd = rrf.critical_ind
		;setting up the vals for comparisons
		dObsVal = cnvtreal(input->medAdminComponents[d.seq].sValue)
		if(rrf.feasible_ind > 0)
			if(dObsVal < rrf.feasible_low or dObsVal > rrf.feasible_high)
				err_res_msg = build2("This field has a feasible range of ",trim(cnvtstring(rrf.feasible_ind))
									," - ",trim(cnvtstring(rrf.feasible_high)))
				call ErrorMsg(err_res_msg,"9999","E")
			endif
		endif
		;normalcy checks
		case(rrf.normal_ind)
			of 1: ;Normal low value exists
				if(dObsVal < rrf.normal_low)
					input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"LOW")
				else
					input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"NORMAL")
				endif
			of 2: ;Normal high value exists
				 if(dObsVal > rrf.critical_high)
				 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"HIGH")
				 else
				 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"NORMAL")
				 endif
			of 3: ;Normal low and high values exist
				if(dObsVal < rrf.normal_low)
					input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"LOW")
				elseif(dObsVal > rrf.normal_high)
					input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"HIGH")
				else
					input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"NORMAL")
			    endif
			else
				input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"NORMAL")
		endcase
 
		;checking critical
		if(input->medAdminComponents[d.seq].dNormalcyCd != uar_get_code_by("MEANING",52,"NORMAL"))
			case(rrf.critical_ind)
				of 1: ;Critical low value exists
					 if(dObsVal < rrf.critical_low)
					 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"EXTREMELOW")
					 endif
				of 2: ;Critical high value exists
					 if(dObsVal > rrf.critical_high)
					 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
					 endif
				of 3: ;Critical low and high values exist
					 if(dObsVal < rrf.critical_low)
					 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"EXTREMELOW")
					 elseif(dObsVal > rrf.critical_high)
					 	input->medAdminComponents[d.seq].dNormalcyCd = uar_get_code_by("MEANING",52,"EXTREMEHIGH")
					 endif
			endcase
		endif
 
		;this is to determine event_class
		if(dta.default_result_type_cd in(c_result_type_numeric_cd, c_result_type_count_cd))
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"NUM")
			input->medAdminComponents[d.seq].stringResultInd = 1
			input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"NUMERIC")
			;for checking precision
			input->medAdminComponents[d.seq].numCheckInd = 1
			numeric_check = 1
		elseif(dta.default_result_type_cd = c_result_type_alpha_cd)
			if(input->medAdminComponents[d.seq].ValueCdCnt > 1)
				call ErrorMsg("This ComponentId accepts only one Value.","9999","E")
			else
				input->medAdminComponents[d.seq].codedResultsInd = 1
				input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
			endif
		elseif(dta.default_result_type_cd = c_result_type_alpha_freetext_cd)
			if(input->medAdminComponents[d.seq].ValueCdCnt > 1)
				call ErrorMsg("This ComponentId accepts only one Value.","9999","E")
			else
				if(input->medAdminCompCnt > 0 and input->medAdminComponents[d.seq].sValue > " ")
					call ErrorMsg("This ComponentId accepts only coded responses or text but not both.","9999","E")
				endif
				if(input->medAdminCompCnt > 1)
					input->medAdminComponents[d.seq].codedResultsInd = 1
				else
					input->medAdminComponents[d.seq].stringResultInd = 1
					input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"ALPHA")
					input->medAdminComponents[d.seq].sValue = build2("Other: ", input->medAdminComponents[d.seq].sValue)
			    endif
			endif
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
		elseif(dta.default_result_type_cd = c_result_type_multi_cd)
			if(input->medAdminComponents[d.seq].ValueCdCnt > 0)
				input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
				input->medAdminComponents[d.seq].codedResultsInd = 1
			else
				call ErrorMsg("This ComponentId requires coded responses and none were provided.","9999","E")
			endif
		elseif(dta.default_result_type_cd = c_result_type_multi_alpha_freetext_cd)
			if(input->medAdminComponents[d.seq].ValueCdCnt > 0)
				input->medAdminComponents[d.seq].codedResultsInd = 1
			else
				input->medAdminComponents[d.seq].stringResultInd = 1
				input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"ALPHA")
				input->medAdminComponents[d.seq].sValue = build2("Other: ", input->medAdminComponents[d.seq].sValue)
			endif
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
		elseif(dta.default_result_type_cd = c_result_type_provider_cd)
			;this will be checked outside the query
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
			input->medAdminComponents[d.seq].stringResultInd = 1
			input->medAdminComponents[d.seq].providerInd = 1
			Prov_check = 1
			input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"ALPHA")
		elseif(dta.default_result_type_cd = c_result_type_yes_no_cd)
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
		    if(input->medAdminCompCnt > 0)
				if(input->medAdminCompCnt > 1)
					call ErrorMsg("This ComponentId only allows one value.","9999","E")
				else
					input->medAdminComponents[d.seq].codedResultsInd = 1
				endif
			else
				input->medAdminComponents[d.seq].stringResultInd = 1
				input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"ALPHA")
			endif
		elseif(dta.default_result_type_cd in(c_result_type_text_cd, c_result_type_freetext_cd))
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"TXT")
			input->medAdminComponents[d.seq].stringResultInd = 1
			input->medAdminComponents[d.seq].dStringResultFormatCd = uar_get_code_by("MEANING",14113,"ALPHA")
 
		elseif(dta.default_result_type_cd in(c_result_type_date_cd,c_result_type_time_cd,c_result_type_date_time_cd))
			input->medAdminComponents[d.seq].dEventClassCd = uar_get_code_by("MEANING",53,"DATE")
			input->medAdminComponents[d.seq].dateResultInd = 1
			UTC = curutc
 
			/* Date Type Flag
			0.00	Date and Time
			1.00	Date only
			2.00	Time only	*/
			if(dta.default_result_type_cd = c_result_type_time_cd)
				input->medAdminComponents[d.seq].dateTypeFlag = 2
				timecheck = ValidateTimeFormat(input->medAdminComponents[d.seq].sValue)
				time = trim(input->medAdminComponents[d.seq].sValue,3)
				if(timecheck)
					if(UTC)
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetimeUTC(cnvtdatetime(curdate,cnvtint(time)))
					else
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetime(curdate,cnvtint(time))
					endif
				else
					call ErrorMsg("This component Id is a time field and requires 24-hour format HHMM.","9999","E")
				endif
			elseif(dta.default_result_type_cd = c_result_type_date_cd)
				input->medAdminComponents[d.seq].dateTypeFlag = 1
				date = trim(replace(input->medAdminComponents[d.seq].sValue,"/",""),3)
				if(cnvtdate(date))
					if(UTC)
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),curtime3))
					else
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetime(cnvtdate(date),curtime3)
					endif
				else
					call ErrorMsg("This component Id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY","9999","E")
				endif
			else
				input->medAdminComponents[d.seq].dateTypeFlag = 0
				format_check = 0
				checkSpace = findstring(" ",input->medAdminComponents[d.seq].sValue)
				date = substring(1,checkSpace,input->medAdminComponents[d.seq].sValue)
				date = trim(replace(date,"/",""),3)
				time = trim(substring(checkSpace + 1,textlen(input->medAdminComponents[d.seq].sValue)
									,input->medAdminComponents[d.seq].sValue),3)
				time = trim(replace(time,":",""),3)
				timeCheck = ValidateTimeFormat(time)
 				dateCheck = cnvtdate(date)
				if(dateCheck > 0 and timeCheck > 0)
					if(UTC)
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
					else
						input->medAdminComponents[d.seq].qDateTimeResVal = cnvtdatetime(cnvtdate(date),cnvtint(time))
					endif
				else
					err_res_msg = build2("This component Id is a datetime field and requires a format of 'MM/DD/YY HHMM', "
											," 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'")
					call ErrorMsg(err_res_msg,"9999","E")
				endif
			endif
 
		else
			err_res_msg = build2("This Endpoint does not support this result type: "
								,trim(uar_get_code_display(dta.default_result_type_cd)))
			call ErrorMsg(err_res_msg,"9999","E")
		endif
 
	with nocounter
 
	;validating the provider result type
	if(Prov_check > 0)
		set check = 0
		select into "nl:"
		from (dummyt d with seq = input->medAdminComponents)
	    	 ,prsnl p
		plan d
			where input->medAdminComponents[d.seq].providerInd > 0
		join p
			where p.person_id = cnvtreal(input->medAdminComponents[d.seq].sValue)
		head report
			check = 1
			input->medAdminComponents[d.seq].sValue = trim(p.name_full_formatted)
		with nocounter
 
		if(check < 1)
			call ErrorMsg("Invalid Provider for Observation Value","9999","E")
		endif
	endif
 
	;validating the Numeric
	if(numeric_check > 0)
		declare digit_str = vc
		select into "nl:"
		from (dummyt d with seq = input->medAdminCompCnt)
		     ,data_map dm
		plan d
			where input->medAdminComponents[d.seq].numCheckInd > 1
		join dm
			where dm.task_assay_cd = input->medAdminComponents[d.seq].dTaskAssayCd
				and dm.active_ind = 1
		head d.seq
			if(isnumeric(input->medAdminComponents[d.seq].sValue) > 0)
				digitCheck = textlen(trim(replace(input->medAdminComponents[d.seq].sValue,".",""),3))
				if(dm.min_digits > 0)
					if(digitCheck < dm.min_digits)
						digit_str = trim(cnvtsting(dm.min_digits))
						err_res_msg = build2("This component id requires a minimum of ",digit_str," digits")
						call ErrorMsg("err_res_msg","9999","E")
					endif
				endif
 
				if(dm.max_digits > 0)
					if(digitCheck > dm.max_digits)
						digit_str = trim(cnvtsting(dm.max_digits))
						err_res_msg = build2("This component id only allows a max of  ",digit_str," digits")
						call ErrorMsg("err_res_msg","9999","E")
					endif
				endif
 
				; Verify precision matches constraints
				pos = findstring(".",input->medAdminComponents[d.seq].sValue,1)
				if(dm.min_decimal_places > 0)
					if(pos > 0)
						postDecimal = textlen(trim(substring(pos + 1,textlen(input->medAdminComponents[d.seq].sValue)
																,input->medAdminComponents[d.seq].sValue),3))
						if(postDecimal > dm.min_decimal_places)
							digit_str = trim(cnvtsting(dm.min_decimal_places))
							err_res_msg = build2("This component id only allows a decimal precision of ",digit_str)
							call ErrorMsg(err_res_msg,"9999","E")
						endif
					endif
				else
					if(pos > 0)
 
						err_res_msg = "This component id only allows integers"
						call ErrorMsg("err_res_msg","9999","E")
					endif
				endif
		    else
		    	err_res_msg = "This component Id is a numeric field. Please enter a number"
				call ErrorMsg("err_res_msg","9999","E")
 
			endif
		with nocounter
	endif
 
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetObsCompInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end; GetObsCompInfo(null)
 
/*************************************************************************
;  Name: GetMedDiscretes(null)
;  Description: Subroutine to check for obs components are valid
**************************************************************************/
subroutine GetMedDiscretes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedDiscretes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare acknow_result_cd = f8 with constant (uar_get_code_by ("MEANING" ,4002164 ,"ACKRESULTMIN"))
 
	free record discrete
	record discrete(
		1 qual_cnt = i4
		1 qual [* ]
     		2 reference_task_id = f8
    		2 required_ind = i2
     		2 sequence = i4
     		2 task_assay_cd = f8
     		2 documentation_ind = i2
     		2 acknowledge_ind = i2
     		2 read_only_ind = i2
     		2 ack_look_back_minutes = i4
	)
 
	select into "nl:"
	from order_task_xref otx
	     ,task_discrete_r tdr
	     ,dta_offset_min dom
	plan otx
		where otx.catalog_cd = 600578_rep->catalog_cd
	join tdr
		where tdr.reference_task_id = otx.reference_task_id
			and tdr.active_ind = 1
	join dom
		where dom.task_assay_cd = outerjoin(tdr.task_assay_cd)
			and dom.offset_min_type_cd = outerjoin(acknow_result_cd)
			and dom.active_ind = outerjoin(1)
	order by tdr.sequence, tdr.task_assay_cd
	head report
		x = 0
		head tdr.task_assay_cd
 
				x = x + 1
				stat = alterlist(discrete->qual,x)
				discrete->qual[x].reference_task_id = tdr.reference_task_id
				discrete->qual[x].required_ind = tdr.required_ind
				discrete->qual[x].task_assay_cd = tdr.task_assay_cd
				discrete->qual[x].sequence = tdr.sequence
				discrete->qual[x].documentation_ind = tdr.document_ind
				discrete->qual[x].read_only_ind = tdr.view_only_ind
				discrete->qual[x].acknowledge_ind = tdr.acknowledge_ind
				discrete->qual[x].ack_look_back_minutes = dom.offset_min_nbr
 
	foot report
		discrete->qual_cnt = x
    with nocounter
 
    if(discrete->qual_cnt < 1)
    	call ErrorMsg("No Observations Needed for This Med","9999","E")
    endif
 
   ;validates the component is part of the MedAdmin Discretes
   select into "nl:"
   from (dummyt d1 with seq = input->medAdminCompCnt)
        ,(dummyt d2 with seq = discrete->qual_cnt)
   plan d1
   		where input->medAdminComponents[d1.seq].dTaskAssayCd > 0
   join d2
   		where discrete->qual[d2.seq].task_assay_cd = input->medAdminComponents[d1.seq].dTaskAssayCd
   head d1.seq
   		input->medAdminComponents[d1.seq].valid_ind = 1
   with nocounter
 
 
 
   ;now checking to make sure all are valid
   set check = 0
   for(x = 1 to input->medAdminCompCnt)
   		if(input->medAdminComponents[x].valid_ind = 0)
   			call ErrorMsg("Invalid Component for this Med Admin","9999","E")
   		endif
   endfor
 
   ;now checking lookback time
   select into "nl:"
   from (dummyt d1 with seq = input->medAdminCompCnt)
        ,(dummyt d2 with seq = discrete->qual_cnt)
   plan d1
   		where input->medAdminComponents[d1.seq].dObservationId > 0
   join d2
   		where discrete->qual[d2.seq].task_assay_cd = input->medAdminComponents[d1.seq].dTaskAssayCd
   head d1.seq
   		timediff = datetimediff(cnvtdatetime(curdate,curtime3),cnvtdatetime(input->medAdminComponents[d1.seq].anchor_dt_tm),4)
   		if(timediff > discrete->qual[d2.seq].ack_look_back_minutes)
   			call ErrorMsg("Acknowledged Observation outside time window","9999","E")
   		endif
    with nocounter
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedDiscretes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end; GetMedDiscretes(null)
 
/*************************************************************************
;  Name: ValidateTimeFormat(time)
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
 
end go
