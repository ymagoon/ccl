/*~BB~************************************************************************
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
*                                                                    *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       07/11/2015
          Source file name:   snsro_get_orderlist
          Object name:        snsro_get_orderlist
          Request #:
          Program purpose:    Returns all orders
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 07/11/2015  AAB					Initial write
  001 08/03/2015  AAB  					Add include flag to include all order types
  002 09/07/2015  AAB 					Add List of Order Types as Input parameter
  003 09/14/2015  AAB					Add audit object
  004 12/14/15    AAB 					Return patient class
  005 01/24/2016  AAB					Fix filtering by ORDER_TYPE
  006 02/08/2016  AAB 					Comment out encntr_type_class
  007 02/15/2016  AAB 					Remove blank list item
  008 02/22/2016  AAB 					Return encntr_type and encntr_class
  009 03/1/2016   AAB 					Fix incorrect counter
  010 03/30/2016  AAB 					Fix alterlist when processing INACTIVE orders
  011 04/29/2016  AAB 					Added version
  012 06/10/2016  AAB 					Flex Code Status logic to handle Palo vs. Dignity
  013 10/10/2016  AAB 					Add DEBUG_FLAG
  014 07/27/2017  JCO					Changed %i to execute; update ErrorHandler2; UTC
  015 03/21/18	  RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_orderlist go
create program snsro_get_orderlist
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.0
		, "Encntr ID:" = 0.0
		, "Order Status:" = 1			;default ACTIVE and INACTIVE (1 - ACTIVE, 2 -  BOTH)
		, "Order Types:" = ""			;default ALL		;002
		, "From Date:" = "01-JAN-1900"	;default beginning of time
		, "To Date:" = "31-DEC-2100"	;default end of time
 		, "Maximum records: " = 0		;limit the number of results returned	if 0 then no limit
		, "Include All Orders:" = 0 		;Default is 0 - Return only order types that don't have their own service
		, "User Name:" = ""        ;003
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, ENCNTR_ID, ORDER_STATUS, ORDER_TYPES, FROM_DATE,
	TO_DATE, MAX_RECORDS, INCL_ALL_ORDERS, USERNAME, DEBUG_FLAG   ;013
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;015
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record ordertype_req
record ordertype_req
(
	1 order_types[*]
		2 order_type_cd					= f8
 
)

free record order_request
record order_request
(
  1 patient_id                          = f8
  1 encounter_criteria
    2 encounters[*]
      3 encounter_id                    = f8
    2 encounter_type_classes[*]
      3 encounter_type_class_cd         = f8
    2 override_org_security_ind         = i2
  1 user_criteria
    2 user_id                           = f8
    2 patient_user_relationship_cd      = f8
  1 active_orders_criteria
    2 order_statuses
      3 load_ordered_ind                = i2
      3 load_future_ind                 = i2
      3 load_in_process_ind             = i2
      3 load_on_hold_ind                = i2
      3 load_suspended_ind              = i2
      3 load_incomplete_ind             = i2
    2 date_criteria
      3 begin_dt_tm                     = dq8
      3 end_dt_tm                       = dq8
      3 qualify_on_start_dt_tm_ind      = i2
      3 qualify_on_stop_dt_tm_ind       = i2
      3 qualify_on_clin_rel_dt_tm_ind   = i2
    2 page_criteria
      3 page_size                       = i2
      3 sort_by_primary_column_asc      = i2
  1 inactive_orders_criteria
    2 order_statuses
      3 load_canceled_ind               = i2
      3 load_discontinued_ind           = i2
      3 load_completed_ind              = i2
      3 load_pending_complete_ind       = i2
      3 load_voided_with_results_ind    = i2
      3 load_voided_without_results_ind = i2
      3 load_transfer_canceled_ind      = i2
    2 date_criteria
      3 begin_dt_tm                     = dq8
      3 end_dt_tm                       = dq8
      3 qualify_on_start_dt_tm_ind      = i2
      3 qualify_on_stop_dt_tm_ind       = i2
      3 qualify_on_clin_rel_dt_tm_ind   = i2
    2 page_criteria
      3 page_size                       = i2
      3 sort_by_primary_column_asc      = i2
  1 medication_order_criteria
    2 load_normal_ind                   = i2
    2 load_prescription_ind             = i2
    2 load_documented_ind               = i2
    2 load_patients_own_ind             = i2
    2 load_charge_only_ind              = i2
    2 load_satellite_ind                = i2
    2 catalogs[*]
      3 catalog_id                      = f8
  1 non_medication_order_criteria
    2 load_continuing_instances_ind     = i2
    2 load_all_catalog_types_ind        = i2
    2 catalog_types[*]
      3 catalog_type_cd                 = f8
    2 activity_types[*]
      3 activity_type_cd                = f8
    2 catalogs[*]
      3 catalog_id                      = f8
  1 clinical_categories[*]
    2 clinical_category_cd              = f8
  1 load_indicators
    2 order_profile_indicators
      3 comment_types
        4 load_order_comment_ind        = i2
      3 review_information_criteria
        4 load_review_status_ind        = i2
        4 load_renewal_notification_ind = i2
      3 order_set_info_criteria
        4 load_core_ind                 = i2
        4 load_name_ind                 = i2
      3 supergroup_info_criteria
        4 load_core_ind                 = i2
        4 load_components_ind           = i2
      3 load_linked_order_info_ind      = i2
      3 care_plan_info_criteria
        4 load_core_ind                 = i2
        4 load_extended_ind             = i2
      3 load_encounter_information_ind  = i2
      3 load_pending_status_info_ind    = i2
      3 load_venue_ind                  = i2
      3 load_order_schedule_ind         = i2
      3 load_order_ingredients_ind      = i2
      3 load_last_action_info_ind       = i2
      3 load_extended_attributes_ind    = i2
      3 load_order_proposal_info_ind    = i2
      3 order_relation_criteria
        4 load_core_ind                 = i2
      3 appointment_criteria
        4 load_core_ind                 = i2
      3 therapeutic_substitution
        4 load_accepted_ind             = i2
    2 profile_proposals_indicators
      3 load_core_ind                   = i2
      3 comment_types
        4 load_order_comment_ind        = i2
      3 diagnosis_info_criteria
        4 load_core_ind                 = i2
        4 load_extended_ind             = i2
      3 load_order_ingredients_ind       = i2
      3 load_order_details_ind          = i2
      3 load_venue_ind                  = i2
      3 load_dose_calculator_text_ind   = i2
      3 load_order_set_ind              = i2
  1 order_proposal_criteria
    2 load_new_pending_proposals_ind    = i2
  1 mnemonic_criteria
    2 load_mnemonic_ind                 = i2
    2 simple_build_type
      3 reference_ind                   = i2
      3 reference_clinical_ind          = i2
      3 reference_clinical_dept_ind     = i2
      3 reference_department_ind        = i2
    2 medication_criteria
      3 build_order_level_ind           = i2
      3 build_ingredient_level_ind      = i2
      3 complex_build_type
        4 reference_ind                 = i2
        4 clinical_ind                  = i2
)
 
free record order_reply
record order_reply (
  1 active_orders [*]
    2 core
      3 order_id = f8
      3 patient_id = f8
      3 version = i4
      3 order_status_cd = f8
      3 department_status_cd = f8
      3 responsible_provider_id = f8
      3 action_sequence = i4
      3 source_cd = f8
      3 future_facility_id = f8
      3 future_nurse_unit_id = f8
    2 encounter
      3 encounter_id = f8
      3 encounter_type_class_cd = f8
      3 encounter_facility_id = f8
    2 displays
      3 reference_name = vc
      3 clinical_name = vc
      3 department_name = vc
      3 clinical_display_line = vc
      3 simplified_display_line = vc
    2 comments
      3 comments_exist
        4 order_comment_ind = i2
        4 mar_note_ind = i2
      3 order_comment = vc
      3 administration_note = vc
    2 schedule
      3 current_start_dt_tm = dq8
      3 current_start_tz = i4
      3 projected_stop_dt_tm = dq8
      3 projected_stop_tz = i4
      3 stop_type_cd = f8
      3 original_order_dt_tm = dq8
      3 original_order_tz = i4
      3 valid_dose_dt_tm = dq8
      3 prn_ind = i2
      3 constant_ind = i2
      3 frequency
        4 frequency_id = f8
        4 one_time_ind = i2
        4 time_of_day_ind = i2
        4 day_of_week_ind = i2
        4 interval_ind = i2
        4 unscheduled_ind = i2
      3 clinically_relevant_dt_tm = dq8
      3 clinically_relevant_tz = i4
      3 suspended_dt_tm = dq8
      3 suspended_tz = i4
      3 start_date_estimated_ind = i2
      3 stop_date_estimated_ind = i2
    2 reference_information
      3 catalog_id = f8
      3 synonym_id = f8
      3 catalog_type_cd = f8
      3 activity_type_cd = f8
      3 clinical_category_cd = f8
      3 order_entry_format_id = f8
    2 review_information
      3 pharmacy_verification_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 rejected_ind = i2
      3 physician_cosignature_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 refused_ind = i2
      3 physician_validation_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 refused_ind = i2
      3 need_nurse_review_ind = i2
      3 need_renewal_ind = i2
      3 pharmacy_clin_review_status
        4 unset_ind = i2
        4 needed_ind = i2
        4 completed_ind = i2
        4 rejected_ind = i2
        4 does_not_apply_ind = i2
        4 superceded_ind = i2
    2 pending_status_information
      3 suspend_ind = i2
      3 suspend_effective_dt_tm = dq8
      3 suspend_effective_tz = i4
      3 resume_ind = i2
      3 resume_effective_dt_tm = dq8
      3 resume_effective_tz = i4
      3 discontinue_ind = i2
      3 discontinue_effective_dt_tm = dq8
      3 discontinue_effective_tz = i4
    2 diagnoses [*]
      3 diagnosis_id = f8
      3 nomenclature_id = f8
      3 priority = i4
      3 description = vc
      3 source_vocabulary_cd = f8
    2 medication_information
      3 medication_order_type_cd = f8
      3 originally_ordered_as_type
        4 normal_ind = i2
        4 prescription_ind = i2
        4 documented_ind = i2
        4 patients_own_ind = i2
        4 charge_only_ind = i2
        4 satellite_ind = i2
      3 ingredients [*]
        4 sequence = i4
        4 catalog_id = f8
        4 synonym_id = f8
        4 clinical_name = vc
        4 department_name = vc
        4 dose
          5 strength = f8
          5 strength_unit_cd = f8
          5 volume = f8
          5 volume_unit_cd = f8
          5 freetext = vc
          5 ordered = f8
          5 ordered_unit_cd = f8
          5 adjustment_display = vc
        4 ingredient_type
          5 unknown_ind = i2
          5 medication_ind = i2
          5 additive_ind = i2
          5 diluent_ind = i2
          5 compound_parent_ind = i2
          5 compound_child_ind = i2
        4 clinically_significant_info
          5 unknown_ind = i2
          5 not_significant_ind = i2
          5 significant_ind = i2
      3 pharmacy_type
        4 sliding_scale_ind = i2
      3 therapeutic_substitution
        4 accepted_ind = i2
        4 accepted_alternate_regimen_ind = i2
        4 overridden_ind = i2
      3 iv_set_synonym_id = f8
      3 prescription
        4 group_id = f8
      3 dosing_method_type
        4 normal_ind = i2
        4 variable_ind = i2
      3 pharmacy_interventions [*]
        4 form_activity_id = f8
        4 last_update_personnel_id = f8
        4 last_update_dt_tm = dq8
        4 task_status_cd = f8
    2 last_action_information
      3 action_personnel_id = f8
      3 action_dt_tm = dq8
      3 action_tz = i4
    2 template_information
      3 template_order_id = f8
      3 template_none_ind = i2
      3 template_order_ind = i2
      3 order_instance_ind = i2
      3 future_recurring_template_ind = i2
      3 future_recurring_instance_ind = i2
      3 protocol_order_ind = i2
    2 order_set_information
      3 parent_id = f8
      3 parent_name = vc
    2 supergroup_information
      3 parent_ind = i2
      3 components [*]
        4 order_id = f8
        4 department_status_cd = f8
    2 care_plan_information
      3 care_plan_catalog_id = f8
      3 name = vc
      3 treatment_period_stop_dt_tm = dq8
      3 treatment_period_stop_tz = i4
      3 component
        4 min_tolerance_interval = i4
        4 min_tolerance_interval_unit_cd = f8
      3 patient_mismatch_ind = i2
    2 link_information
      3 link_number = f8
      3 and_link_ind = i2
    2 venue
      3 acute_ind = i2
      3 ambulatory_ind = i2
      3 prescription_ind = i2
      3 unknown_ind = i2
    2 extended
      3 consulting_providers [*]
        4 consulting_provider_id = f8
      3 end_state_reason_cd = f8
      3 patient_pregnant_ind = i2
      3 send_results_to_phys_only_ind = i2
    2 pending_order_proposal_info
      3 order_proposal_id = f8
      3 source_type_cd = f8
    2 order_relations [*]
      3 order_id = f8
      3 action_sequence = i4
      3 relation_type_cd = f8
    2 appointment
      3 appointment_id = f8
      3 appointment_state_cd = f8
    2 order_mnemonic
      3 mnemonic = vc
      3 may_be_truncated_ind = i2
    2 laboratory_information
      3 accessions [*]
        4 identifier = vc
    2 radiology_information
      3 accessions [*]
        4 identifier = vc
    2 last_populated_action
      3 order_location_id = f8
    2 day_of_treatment_information
      3 protocol_order_id = f8
      3 day_of_treatment_sequence = i4
      3 protocol_type
        4 unknown_ind = i2
        4 powerplan_managed_oncology_ind = i2
        4 future_recurring_ind = i2
    2 warnings [*]
      3 warning_type
        4 protocol_patient_mismatch_ind = i2
    2 protocol_information
      3 protocol_type
        4 unknown_ind = i2
        4 powerplan_managed_oncology_ind = i2
        4 future_recurring_ind = i2
    2 order_status_reasons
		3 incomplete_status_reasons [*]
			4 no_synonym_match_ind = i2
			4 missing_order_details_ind = i2
    2 referral_information
		3 referred_to_provider_id = f8
		3 referred_to_freetext_provider = vc
		3 reason_for_referral = vc
    2 filtered_responsible_provider
		3 provider_id = f8
  1 active_orders_page_context
    2 context = vc
    2 has_previous_page_ind = i2
    2 has_next_page_ind = i2
  1 inactive_orders [*]
    2 core
		3 order_id = f8
		3 patient_id = f8
		3 version = i4
		3 order_status_cd = f8
		3 department_status_cd = f8
		3 responsible_provider_id = f8
		3 action_sequence = i4
		3 source_cd = f8
		3 future_facility_id = f8
		3 future_nurse_unit_id = f8
    2 encounter
		3 encounter_id = f8
		3 encounter_type_class_cd = f8
		3 encounter_facility_id = f8
    2 displays
		3 reference_name = vc
		3 clinical_name = vc
		3 department_name = vc
		3 clinical_display_line = vc
		3 simplified_display_line = vc
    2 comments
      3 comments_exist
        4 order_comment_ind = i2
        4 mar_note_ind = i2
      3 order_comment = vc
      3 administration_note = vc
    2 schedule
      3 current_start_dt_tm = dq8
      3 current_start_tz = i4
      3 projected_stop_dt_tm = dq8
      3 projected_stop_tz = i4
      3 stop_type_cd = f8
      3 original_order_dt_tm = dq8
      3 original_order_tz = i4
      3 valid_dose_dt_tm = dq8
      3 prn_ind = i2
      3 constant_ind = i2
      3 frequency
        4 frequency_id = f8
        4 one_time_ind = i2
        4 time_of_day_ind = i2
        4 day_of_week_ind = i2
        4 interval_ind = i2
        4 unscheduled_ind = i2
      3 clinically_relevant_dt_tm = dq8
      3 clinically_relevant_tz = i4
      3 suspended_dt_tm = dq8
      3 suspended_tz = i4
      3 start_date_estimated_ind = i2
      3 stop_date_estimated_ind = i2
    2 reference_information
      3 catalog_id = f8
      3 synonym_id = f8
      3 catalog_type_cd = f8
      3 activity_type_cd = f8
      3 clinical_category_cd = f8
      3 order_entry_format_id = f8
    2 review_information
      3 pharmacy_verification_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 rejected_ind = i2
      3 physician_cosignature_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 refused_ind = i2
      3 physician_validation_status
        4 not_required_ind = i2
        4 required_ind = i2
        4 refused_ind = i2
      3 need_nurse_review_ind = i2
      3 need_renewal_ind = i2
      3 pharmacy_clin_review_status
        4 unset_ind = i2
        4 needed_ind = i2
        4 completed_ind = i2
        4 rejected_ind = i2
        4 does_not_apply_ind = i2
        4 superceded_ind = i2
    2 pending_status_information
      3 suspend_ind = i2
      3 suspend_effective_dt_tm = dq8
      3 suspend_effective_tz = i4
      3 resume_ind = i2
      3 resume_effective_dt_tm = dq8
      3 resume_effective_tz = i4
      3 discontinue_ind = i2
      3 discontinue_effective_dt_tm = dq8
      3 discontinue_effective_tz = i4
    2 diagnoses [*]
      3 diagnosis_id = f8
      3 nomenclature_id = f8
      3 priority = i4
      3 description = vc
      3 source_vocabulary_cd = f8
    2 medication_information
      3 medication_order_type_cd = f8
      3 originally_ordered_as_type
        4 normal_ind = i2
        4 prescription_ind = i2
        4 documented_ind = i2
        4 patients_own_ind = i2
        4 charge_only_ind = i2
        4 satellite_ind = i2
      3 ingredients [*]
        4 sequence = i4
        4 catalog_id = f8
        4 synonym_id = f8
        4 clinical_name = vc
        4 department_name = vc
        4 dose
          5 strength = f8
          5 strength_unit_cd = f8
          5 volume = f8
          5 volume_unit_cd = f8
          5 freetext = vc
          5 ordered = f8
          5 ordered_unit_cd = f8
          5 adjustment_display = vc
        4 ingredient_type
          5 unknown_ind = i2
          5 medication_ind = i2
          5 additive_ind = i2
          5 diluent_ind = i2
          5 compound_parent_ind = i2
          5 compound_child_ind = i2
        4 clinically_significant_info
          5 unknown_ind = i2
          5 not_significant_ind = i2
          5 significant_ind = i2
      3 pharmacy_type
        4 sliding_scale_ind = i2
      3 therapeutic_substitution
        4 accepted_ind = i2
        4 accepted_alternate_regimen_ind = i2
        4 overridden_ind = i2
      3 iv_set_synonym_id = f8
      3 prescription
        4 group_id = f8
      3 dosing_method_type
        4 normal_ind = i2
        4 variable_ind = i2
      3 pharmacy_interventions [*]
        4 form_activity_id = f8
        4 last_update_personnel_id = f8
        4 last_update_dt_tm = dq8
        4 task_status_cd = f8
    2 last_action_information
      3 action_personnel_id = f8
      3 action_dt_tm = dq8
      3 action_tz = i4
    2 template_information
      3 template_order_id = f8
      3 template_none_ind = i2
      3 template_order_ind = i2
      3 order_instance_ind = i2
      3 future_recurring_template_ind = i2
      3 future_recurring_instance_ind = i2
      3 protocol_order_ind = i2
    2 order_set_information
      3 parent_id = f8
      3 parent_name = vc
    2 supergroup_information
      3 parent_ind = i2
      3 components [*]
        4 order_id = f8
        4 department_status_cd = f8
    2 care_plan_information
      3 care_plan_catalog_id = f8
      3 name = vc
      3 treatment_period_stop_dt_tm = dq8
      3 treatment_period_stop_tz = i4
      3 component
        4 min_tolerance_interval = i4
        4 min_tolerance_interval_unit_cd = f8
      3 patient_mismatch_ind = i2
    2 link_information
      3 link_number = f8
      3 and_link_ind = i2
    2 venue
      3 acute_ind = i2
      3 ambulatory_ind = i2
      3 prescription_ind = i2
      3 unknown_ind = i2
    2 extended
      3 consulting_providers [*]
        4 consulting_provider_id = f8
      3 end_state_reason_cd = f8
      3 patient_pregnant_ind = i2
      3 send_results_to_phys_only_ind = i2
    2 pending_order_proposal_info
      3 order_proposal_id = f8
      3 source_type_cd = f8
    2 order_relations [*]
      3 order_id = f8
      3 action_sequence = i4
      3 relation_type_cd = f8
    2 appointment
      3 appointment_id = f8
      3 appointment_state_cd = f8
    2 order_mnemonic
      3 mnemonic = vc
      3 may_be_truncated_ind = i2
    2 laboratory_information
      3 accessions [*]
        4 identifier = vc
    2 radiology_information
      3 accessions [*]
        4 identifier = vc
    2 last_populated_action
      3 order_location_id = f8
    2 day_of_treatment_information
      3 protocol_order_id = f8
      3 day_of_treatment_sequence = i4
      3 protocol_type
        4 unknown_ind = i2
        4 powerplan_managed_oncology_ind = i2
        4 future_recurring_ind = i2
    2 warnings [*]
      3 warning_type
        4 protocol_patient_mismatch_ind = i2
    2 protocol_information
      3 protocol_type
        4 unknown_ind = i2
        4 powerplan_managed_oncology_ind = i2
        4 future_recurring_ind = i2
    2 order_status_reasons
      3 incomplete_status_reasons [*]
        4 no_synonym_match_ind = i2
        4 missing_order_details_ind = i2
    2 referral_information
      3 referred_to_provider_id = f8
      3 referred_to_freetext_provider = vc
      3 reason_for_referral = vc
    2 filtered_responsible_provider
      3 provider_id = f8
  1 inactive_orders_page_context
    2 context = vc
    2 has_previous_page_ind = i2
    2 has_next_page_ind = i2
  1 order_proposals [*]
    2 core
      3 order_proposal_id = f8
      3 order_id = f8
      3 projected_order_id = f8
      3 patient_id = f8
      3 encounter_id = f8
      3 responsible_provider_id = f8
      3 data_enterer_id = f8
      3 resolved_by_personnel_id = f8
      3 status_cd = f8
      3 source_type_cd = f8
      3 proposed_action_type_cd = f8
      3 from_action_sequence = i4
      3 to_action_sequence = i4
      3 communication_type_cd = f8
      3 future_facility_id = f8
      3 future_nurse_unit_id = f8
      3 supervising_provider_id = f8
      3 billing_provider_type
        4 unknown_ind = i2
        4 ordering_provider_ind = i2
        4 supervising_provider_ind = i2
    2 displays
      3 reference_name = vc
      3 clinical_name = vc
      3 department_name = vc
      3 clinical_display_line = vc
      3 simplified_display_line = vc
    2 reference_information
      3 synonym_id = f8
      3 order_entry_format_id = f8
    2 medication_information
      3 medication_order_type_cd = f8
      3 originally_ordered_as_type
        4 normal_ind = i2
        4 prescription_ind = i2
        4 documented_ind = i2
        4 patients_own_ind = i2
        4 charge_only_ind = i2
        4 satellite_ind = i2
      3 ingredients [*]
        4 sequence = i4
        4 synonym_id = f8
        4 clinical_name = vc
        4 department_name = vc
        4 source_type
          5 user_ind = i2
          5 system_balanced_ind = i2
          5 system_auto_product_assign_ind = i2
        4 alter_type
          5 unchanged_ind = i2
          5 added_ind = i2
          5 modified_ind = i2
          5 deleted_ind = i2
        4 dose
          5 strength = f8
          5 strength_unit_cd = f8
          5 volume = f8
          5 volume_unit_cd = f8
          5 freetext = vc
          5 ordered = f8
          5 ordered_unit_cd = f8
          5 calculator_text = vc
          5 adjustment_display = vc
        4 ingredient_type
          5 unknown_ind = i2
          5 medication_ind = i2
          5 additive_ind = i2
          5 diluent_ind = i2
          5 compound_parent_ind = i2
          5 compound_child_ind = i2
        4 clinically_significant_info
          5 unknown_ind = i2
          5 not_significant_ind = i2
          5 significant_ind = i2
        4 bag_frequency_cd = f8
        4 include_in_total_volume_type
          5 unknown_ind = i2
          5 not_included_ind = i2
          5 included_ind = i2
        4 normalized_rate = f8
        4 normalized_rate_unit_cd = f8
        4 concentration = f8
        4 concentration_unit_cd = f8
      3 iv_set_synonym_id = f8
      3 therapeutic_substitution
        4 accepted_ind = i2
        4 accepted_alternate_regimen_ind = i2
        4 overridden_ind = i2
    2 comments
      3 order_comment = vc
    2 diagnoses [*]
      3 diagnosis_id = f8
      3 nomenclature_id = f8
      3 priority = i4
      3 description = vc
      3 alter_type
        4 unchanged_ind = i2
        4 added_ind = i2
        4 modified_ind = i2
        4 deleted_ind = i2
      3 source_vocabulary_cd = f8
      3 source_identifier = vc
    2 order_details [*]
      3 oe_field_id = f8
      3 oe_field_meaning = vc
      3 oe_field_meaning_id = f8
      3 detail_values [*]
        4 oe_field_value = f8
        4 oe_field_display_value = vc
        4 oe_field_dt_tm_value = dq8
        4 oe_field_tz = i4
        4 alter_type
          5 unchanged_ind = i2
          5 added_ind = i2
          5 modified_ind = i2
          5 deleted_ind = i2
        4 default_value = vc
    2 venue
      3 acute_ind = i2
      3 ambulatory_ind = i2
      3 prescription_ind = i2
      3 unknown_ind = i2
    2 adhoc_frequency_times [*]
      3 sequence = i4
      3 time_of_day = i2
    2 order_set_information
      3 parent_id = f8
      3 parent_name = vc
      3 parent_resolved_ind = i2
    2 proposal_mnemonic
      3 mnemonic = vc
      3 may_be_truncated_ind = i2
    2 schedule
      3 start_date_estimated_ind = i2
      3 stop_date_estimated_ind = i2
    2 order_relation
      3 order_id = f8
      3 action_sequence = i4
      3 type_cd = f8
    2 order_status_reasons
      3 incomplete_status_reasons [*]
        4 no_synonym_match_ind = i2
        4 missing_order_details_ind = i2
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
 
free record orders_reply_out
record orders_reply_out(
	1 order_list[*]
		2 order_id 								= f8
		2 person_id 							= f8
		2 encntr_id							    = f8
		2 encntr_type_cd						= f8	;004
		2 encntr_type_disp						= vc	;004
		2 encntr_type_class_cd					= f8	;008
		2 encntr_type_class_disp				= vc	;008
		2 active_flag							= i4
		2 reference_name 						= vc
		2 clinical_name  						= vc
		2 department_name 						= vc
		2 clinical_display_line 				= vc
		2 simplified_display_line 				= vc
		2 notify_display_line 					= vc
		2 current_start_dt_tm 					= dq8
		2 projected_stop_dt_tm					= dq8
		2 stop_dt_tm							= dq8
		2 stop_type 							= vc
		2 orig_date 							= dq8
		2 valid_dose_dt_tm 						= dq8
		2 clinically_relevant_dt_tm 			= dq8
		2 suspended_dt_tm 						= dq8
		2 comment_text							= vc
		2 pharmsig_comment						= vc
		2 ordered_by 							= vc
		2 catalog_cd 							= f8
		2 catalog_disp 							= vc
		2 catalog_type_cd 						= f8
		2 catalog_type_disp 					= vc
		2 activity_type_cd 						= f8
		2 activity_type_disp 					= vc
		2 hna_order_mnemonic					= vc
		2 order_mnemonic						= vc
		2 ordered_as_mnemonic					= vc
		2 frequency								= vc
		2 strength_dose							= vc
		2 strength_dose_unit					= vc
		2 volume_dose							= vc
		2 volume_dose_unit						= vc
		2 route									= vc
		2 pca_mode								= vc
		2 pca_ind								= i2
		2 med_order_type_cd 					= f8
		2 med_order_type_disp 					= vc
		2 order_status_cd 						= f8
		2 order_status_disp 					= vc
		2 orig_ord_as_flag 						= i4
		2 synonym_id 							= f8
		2 concept_cki							= vc
		2 comment_flag 							= i4
		2 order_entry_format_id					= f8
		2 therapeutic_class						= vc
		2 therapeutic_sub_class					= vc
		2 clin_category_cd						= f8
		2 clin_category_disp					= vc
		2 med_category_cd						= f8
		2 med_category_disp						= vc
		2 freq_schedule_id						= f8
		2 frequency_type						= vc
		2 detqual_cnt 							= i4
		2 detqual [*]
			3 oe_field_display_value 			= vc
			3 label_text						= vc
			3 group_seq							= i4
			3 field_seq							= i4
			3 oe_field_id						= f8
			3 oe_field_dt_tm					= dq8
			3 oe_field_tz						= i4
			3 oe_field_meaning_id				= f8
			3 oe_field_meaning  				= vc
			3 oe_field_value					= f8
			3 order_schedule_precision_bit		= i4
	1 audit			;003
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc		;011
;014 %i cclsource:status_block.inc
/*014 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*014 end */
 
)
 
set orders_reply_out->status_data->status = "F"

/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare dEncntrID  			= f8 with protect, noconstant(0.0)
declare iDateType			= i4 with protect, noconstant(0)
declare iOrderStatus		= i4 with protect, noconstant(0)
declare sOrderTypes			= vc with protect, noconstant("")
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare iMax_recs	 		= i4 with protect, noconstant(0)
declare iInc_All_Ord	 	= i4 with protect, noconstant(0)
declare ord_type_cnt 		= i4 with protect, noconstant(0)
declare sUserName			= vc with protect, noconstant("")
declare iRet				= i2 with protect, noconstant(0) 	;003
 
 
declare dPharmacyCd 		= f8 with protect, constant(uar_get_code_by("MEANING" ,106 ,"PHARMACY" ) )
declare dCommunicationTypeCd 		= f8 with protect, constant(uar_get_code_by("MEANING" ,106 ,"COMMUNICATIO" ) )  ;12
declare dCodeStatusCd		= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 200, "CODESTATUS"))		;12
 
declare dActiveCd 			= f8 with protect, constant(uar_get_code_by("MEANING" ,48 ,"ACTIVE" ) )
 
declare comment_type_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare pharmsig_type_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 14, "PHARMSIG"))
declare new_action_type_cd  	= f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ORDER"))
declare dcp_clin_cat_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 16389, "MEDICATIONS"))
declare mnemonic_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING", 6011, "PRIMARY"))
declare lab_cat_cd 		= f8 with protect, constant(uar_get_code_by("MEANING", 16389, "LABORATORY"))
declare med_cat_cd 		= f8 with protect, constant(uar_get_code_by("MEANING", 16389, "MEDICATIONS"))
 
declare ord_cnt 				= i4  with protect ,noconstant (0 )
declare comment_flag 			= i2 with protect, noconstant(0)
 
declare APPLICATION_NUMBER 	= i4 with protect, constant (600005)
declare TASK_NUMBER 		= i4 with protect, constant (500195)
declare REQ_NUM	 			= i4 with protect, constant (680200)
 
declare Section_Start_Dt_Tm 	= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare idebugFlag			= i2 with protect, noconstant(0) ;013
declare UTCmode						= i2 with protect, noconstant(0);014
declare UTCpos 						= i2 with protect, noconstant(0);014
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPersonID 							    = cnvtint($PERSON_ID)
set dEncntrID							    = cnvtint($ENCNTR_ID)
set iOrderStatus						    = cnvtint($ORDER_STATUS)
set sOrderTypes								= trim($ORDER_TYPES, 3)  ;002
set sFromDate								= trim($FROM_DATE, 3)
set sToDate 								= trim($TO_DATE, 3)
set iMax_recs	 							= cnvtint($MAX_RECORDS)
set iInc_All_Ord	 						= cnvtint($INCL_ALL_ORDERS) ;001
set sUserName								= trim($USERNAME, 3)   ;003
set UTCmode									= CURUTC ;014
set UTCpos									= findstring("Z",sFromDate,1,0);014
 
 
 /*014 UTC begin */
if(sFromDate = "")
	set sFromDate = "01-JAN-1900"
endif
 
 if (UTCmode = 1 and UTCpos > 0)
	set startDtTm = cnvtdatetimeUTC(sFromDate) ;;;
	if (sToDate = "")
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(sToDate)
	endif
else
	set startDtTm = cnvtdatetime(sFromDate)
	if (sToDate = "")
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(sToDate)
	endif
endif
/*014 UTC end */
 
set idebugFlag				= cnvtint($DEBUG_FLAG)  ;013
 
if(idebugFlag > 0)
 
	call echo(build("dPersonID  ->", dPersonID))
	call echo(build("dEncntrID  ->", dEncntrID))
	call echo(build("iOrderStatus  ->", iOrderStatus))
	call echo(build("sOrderTypes  ->", sOrderTypes))
	call echo(build("sFromDate  ->", sFromDate))
	call echo(build("sToDate  ->",   sToDate))
	call echo(build("iMax_recs  ->", iMax_recs))
	call echo(build("iInc_All_Ord  ->", iInc_All_Ord))
	call echo(build("UTC MODE -->",UTCmode));014
 	call echo(build("UTC POS -->",UTCpos));014
 
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;014 %i ccluserdir:snsro_common.inc
execute snsro_common	;014
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrders(null)				 						= null with protect
declare ParseOrderTypes(sOrderTypes = vc)					= null with protect
declare CheckOrderTypes(order_type_cd = f8)					= i2 with protect
declare GetDetail(order_id = f8) 							= vc with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPersonID > 0)
 
	set iRet = PopulateAudit(sUserName, dPersonID, orders_reply_out, sVersion)   ;011    ;003
 
	if(iRet = 0)  ;003
		call ErrorHandler2("VALIDATE", "F", "ORDERS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), orders_reply_out)	;014
		go to EXIT_SCRIPT
 
	endif
 
 
	if(sOrderTypes != "")
		call ParseOrderTypes(sOrderTypes)
		call GetOrders(null)
 
	else
		call GetOrders(null)
 
    endif
 
	call ErrorHandler("EXECUTE", "S", "ORDERS", "Successfully retrieved Orders", orders_reply_out)
 
else
 
	call ErrorHandler2("VALIDATE", "F", "No Person ID was passed in", "No Person ID was passed in",
	"2055", "Missing required field: PatientId", orders_reply_out)	;014
	go to EXIT_SCRIPT
 
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(orders_reply_out)
 
if(idebugFlag > 0)
 
 	call echorecord(orders_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_orderlist.json")
	call echo(build2("_file : ", _file))
	call echojson(orders_reply_out, _file, 0)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetOrders(null)
;  Description: This will retrieve all orders for a patient
;
**************************************************************************/
subroutine GetOrders(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrders Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare orderActiveCnt 			= i4 with protect ,noconstant (0 )
declare filter_ind 				= i2 with protect ,noconstant (0 )
declare orderInActiveCnt 		= i4 with protect ,noconstant (0 )
declare parseEncStr 			= vc with  protect, noconstant("")
declare parseOrderStat 			= vc with  protect, noconstant("")
 
set order_request->patient_id = dPersonID
 
if(dEncntrID > 0)
 
	set stat = alterlist(order_request->encounter_criteria.encounters, 1)
	set order_request->encounter_criteria.encounters[1].encounter_id = dEncntrID
 
endif
 
 
;****configure request parameters
set order_request->encounter_criteria.override_org_security_ind = 0
set order_request->user_criteria.user_id = reqinfo->updt_id
 
if (iOrderStatus = 1)
	set order_request->active_orders_criteria.order_statuses.load_future_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_in_process_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_incomplete_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_on_hold_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_ordered_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_suspended_ind = 1
 
	set order_request->active_orders_criteria.date_criteria.begin_dt_tm = cnvtdatetime(sFromDate)
 
	if(sToDate = "")
 
		set order_request->active_orders_criteria.date_criteria.end_dt_tm = cnvtdatetime(curdate,curtime3)
 
	else
 
		set order_request->active_orders_criteria.date_criteria.end_dt_tm = cnvtdatetime(sToDate)
 
	endif
 
	set order_request->active_orders_criteria.date_criteria.qualify_on_start_dt_tm_ind = 1
	set order_request->active_orders_criteria.date_criteria.qualify_on_stop_dt_tm_ind = 0
	set order_request->active_orders_criteria.date_criteria.qualify_on_clin_rel_dt_tm_ind = 0
 
else
 
	set order_request->active_orders_criteria.order_statuses.load_future_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_in_process_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_incomplete_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_on_hold_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_ordered_ind = 1
	set order_request->active_orders_criteria.order_statuses.load_suspended_ind = 1
 
	set order_request->inactive_orders_criteria.order_statuses.load_canceled_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_discontinued_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_completed_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_pending_complete_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_voided_with_results_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_voided_without_results_ind = 1
	set order_request->inactive_orders_criteria.order_statuses.load_transfer_canceled_ind = 1
 
	set order_request->inactive_orders_criteria.date_criteria.begin_dt_tm = cnvtdatetime(sFromDate)
 
	if(sToDate = "")
 
		set order_request->inactive_orders_criteria.date_criteria.end_dt_tm = cnvtdatetime(curdate,curtime3)
 
	else
 
		set order_request->inactive_orders_criteria.date_criteria.end_dt_tm = cnvtdatetime(sToDate)
 
	endif
 
	set order_request->inactive_orders_criteria.date_criteria.qualify_on_start_dt_tm_ind = 1
	set order_request->inactive_orders_criteria.date_criteria.qualify_on_stop_dt_tm_ind = 0
	set order_request->inactive_orders_criteria.date_criteria.qualify_on_clin_rel_dt_tm_ind = 0
 
endif
 
if(iInc_All_Ord > 0)   ;001
set order_request->medication_order_criteria.load_charge_only_ind = 1
set order_request->medication_order_criteria.load_documented_ind = 1
set order_request->medication_order_criteria.load_normal_ind = 1
set order_request->medication_order_criteria.load_patients_own_ind = 1
set order_request->medication_order_criteria.load_prescription_ind = 1
set order_request->medication_order_criteria.load_satellite_ind = 1
 
endif
 
set order_request->non_medication_order_criteria.load_continuing_instances_ind = 0
set order_request->non_medication_order_criteria.load_all_catalog_types_ind = 1
 
 
set order_request->load_indicators.order_profile_indicators.comment_types.load_order_comment_ind = 1
set order_request->load_indicators.order_profile_indicators.load_order_schedule_ind = 1
set order_request->load_indicators.order_profile_indicators.load_encounter_information_ind = 1
set order_request->load_indicators.order_profile_indicators.load_order_ingredients_ind = 1
set order_request->load_indicators.order_profile_indicators.load_pending_status_info_ind = 1
set order_request->load_indicators.order_profile_indicators.load_venue_ind = 1
set order_request->load_indicators.order_profile_indicators.load_last_action_info_ind = 1
set order_request->load_indicators.order_profile_indicators.load_extended_attributes_ind = 1
set order_request->load_indicators.order_profile_indicators.load_order_proposal_info_ind = 1
 
set order_request-> review_information_criteria.load_review_status_ind = 1
set order_request-> review_information_criteria.load_renewal_notification_ind = 1
 
set order_request->load_indicators.order_profile_indicators.order_set_info_criteria.load_core_ind = 1
set order_request->load_indicators.order_profile_indicators.order_set_info_criteria.load_name_ind = 1
set order_request->load_indicators.order_profile_indicators.supergroup_info_criteria.load_core_ind = 1
set order_request->load_indicators.order_profile_indicators.supergroup_info_criteria.load_components_ind = 1
set order_request->load_indicators.order_profile_indicators.load_linked_order_info_ind = 1
set order_request->load_indicators.order_profile_indicators.care_plan_info_criteria.load_core_ind = 1
set order_request->load_indicators.order_profile_indicators.care_plan_info_criteria.load_extended_ind = 1
;set order_request->load_indicators.order_profile_indicators.diagnosis_info_criteria.load_core_ind = 0
;set order_request->load_indicators.order_profile_indicators.diagnosis_info_criteria.load_extended_ind = 0
set order_request->load_indicators.order_profile_indicators.load_encounter_information_ind = 0
set order_request->load_indicators.order_profile_indicators.load_pending_status_info_ind = 1
set order_request->load_indicators.order_profile_indicators.load_venue_ind = 1
set order_request->load_indicators.order_profile_indicators.load_order_schedule_ind = 1
set order_request->load_indicators.order_profile_indicators.load_order_ingredients_ind = 1
set order_request->load_indicators.order_profile_indicators.load_last_action_info_ind = 1
set order_request->load_indicators.order_profile_indicators.load_extended_attributes_ind = 0
set order_request->load_indicators.order_profile_indicators.load_order_proposal_info_ind = 1
set order_request->load_indicators.order_profile_indicators.order_relation_criteria.load_core_ind = 0
set order_request->load_indicators.order_profile_indicators.appointment_criteria.load_core_ind = 1
set order_request->load_indicators.order_profile_indicators.therapeutic_substitution.load_accepted_ind = 1
 
 
;call echorecord( order_request)
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM,"REC",order_request,"REC", order_reply)
 
if (order_reply->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "Error", "Error retrieving PHARMACY orders",
	"9999", "Error retrieving PHARMACY orders (680200)", orders_reply_out)
	go to EXIT_SCRIPT
endif
 
;call echorecord(order_reply)
 
set x = 0
if(idebugFlag > 0)
 
	call echo(build("iOrderStatus -->", iOrderStatus))
 
endif
 
if(iOrderStatus = 1)
	set orderActiveCnt = size(order_reply->active_orders, 5)
	if(iMax_recs > 0)
 
		if(size(order_reply->active_orders, 5) > iMax_recs )
 
			set orderActiveCnt = iMax_recs
 
		endif
 
	endif
 
if(idebugFlag > 0)
 
	call echo(build("ACTIVE orders -->", orderActiveCnt))
 
endif
	;set stat = alterlist(orders_reply_out->order_list, orderActiveCnt) ;001
	set k = 0  ;009
	for(x = 1 to orderActiveCnt)
		if(sOrderTypes != "")  ;007
			;set filter_ind = CheckOrderTypes(order_reply->active_orders[x]->reference_information->clinical_category_cd)
			set filter_ind = CheckOrderTypes(order_reply->active_orders[x]->reference_information->activity_type_cd)	;005
 
			if(idebugFlag > 0)
				call echo(build("filter_ind -->", filter_ind))
 
			endif
 
			if(filter_ind > 0) ;001 ;002
 				set k = k + 1  ;009
				set stat = alterlist(orders_reply_out->order_list, k)
 
				set orders_reply_out->order_list[k]->order_id = order_reply->active_orders[x]->core->order_id
				set orders_reply_out->order_list[k]->person_id = order_reply->active_orders[x]->core->patient_id
				set orders_reply_out->order_list[k]->active_flag = 1
				set orders_reply_out->order_list[k]->encntr_id = order_reply->active_orders[x]->encounter->encounter_id
				set orders_reply_out->order_list[k]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[k]->encntr_id, 1 )			;004
				set orders_reply_out->order_list[k]->encntr_type_disp =
					uar_get_code_display(orders_reply_out->order_list[k]->encntr_type_cd)  	;004
				set orders_reply_out->order_list[k]->encntr_type_class_cd =
					GetPatientClass(orders_reply_out->order_list[k]->encntr_id, 2 )		;008
				set orders_reply_out->order_list[k]->encntr_type_class_disp =
					uar_get_code_display(orders_reply_out->order_list[k]->encntr_type_class_cd)  ;008
				set orders_reply_out->order_list[k]->order_status_cd  = order_reply->active_orders[x]->core->order_status_cd
				set orders_reply_out->order_list[k]->order_status_disp =
					uar_get_code_display (order_reply->active_orders[x]->core->order_status_cd )
				set orders_reply_out->order_list[k]->reference_name = order_reply->active_orders[x]->displays->reference_name
				set orders_reply_out->order_list[k]->clinical_name = order_reply->active_orders[x]->displays->clinical_name
				set orders_reply_out->order_list[k]->department_name = order_reply->active_orders[x]->displays->department_name
				set orders_reply_out->order_list[k]->clinical_display_line = order_reply->active_orders[x]->displays->clinical_display_line
				set orders_reply_out->order_list[k]->simplified_display_line = order_reply->active_orders[x]->displays->simplified_display_line
				set orders_reply_out->order_list[k]->current_start_dt_tm =	 order_reply->active_orders[x]->schedule->current_start_dt_tm
				set orders_reply_out->order_list[k]->projected_stop_dt_tm = order_reply->active_orders[x]->schedule->projected_stop_dt_tm
				set orders_reply_out->order_list[k]->stop_type = uar_get_code_display(order_reply->active_orders[x]->schedule->stop_type_cd)
				set orders_reply_out->order_list[k]->orig_date = order_reply->active_orders[x]->schedule->original_order_dt_tm
				set orders_reply_out->order_list[k]->valid_dose_dt_tm = order_reply->active_orders[x]->schedule->valid_dose_dt_tm
				set orders_reply_out->order_list[k]->clinically_relevant_dt_tm =
					order_reply->active_orders[x]->schedule->clinically_relevant_dt_tm
				set orders_reply_out->order_list[k]->suspended_dt_tm = order_reply->active_orders[x]->schedule->suspended_dt_tm
				set orders_reply_out->order_list[k]->med_order_type_cd   =
					order_reply->active_orders[x]->medication_information->medication_order_type_cd
				set orders_reply_out->order_list[k]->med_order_type_disp   =
					uar_get_code_display(order_reply->active_orders[x]->medication_information->medication_order_type_cd)
				set orders_reply_out->order_list[k]->order_mnemonic = order_reply->active_orders[x]->order_mnemonic->mnemonic
				set orders_reply_out->order_list[k]->synonym_id = order_reply->active_orders[x]->reference_information->synonym_id
				set orders_reply_out->order_list[k]->activity_type_cd = order_reply->active_orders[x]->reference_information->activity_type_cd
				set orders_reply_out->order_list[k]->activity_type_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->activity_type_cd)
 
				set orders_reply_out->order_list[k]->catalog_type_cd = order_reply->active_orders[x]->reference_information->catalog_type_cd
				set orders_reply_out->order_list[k]->catalog_type_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_type_cd)
				set orders_reply_out->order_list[k]->catalog_cd =
					order_reply->active_orders[x]->reference_information->catalog_id
				set orders_reply_out->order_list[k]->catalog_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_id)
 
				; 012 +
				if (orders_reply_out->order_list[k]->catalog_cd = dCodeStatusCd
						and orders_reply_out->order_list[k]->activity_type_cd = dCommunicationTypeCd)
					set orders_reply_out->order_list[k]->activity_type_disp = "Code Status"
					set orders_reply_out->order_list[k]->reference_name	= ""
					set orders_reply_out->order_list[k]->reference_name = GetDetail(orders_reply_out->order_list[k]->order_id)
				endif
				; 012 -
 
				set orders_reply_out->order_list[k]->order_entry_format_id =
					order_reply->active_orders[x]->reference_information->order_entry_format_id
				set orders_reply_out->order_list[k]->clin_category_cd =
					order_reply->active_orders[x]->reference_information->clinical_category_cd
				set orders_reply_out->order_list[k]->clin_category_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->clinical_category_cd)
			endif
		else
			set stat = alterlist(orders_reply_out->order_list, x)
 
			set orders_reply_out->order_list[x]->order_id = order_reply->active_orders[x]->core->order_id
			set orders_reply_out->order_list[x]->person_id = order_reply->active_orders[x]->core->patient_id
			set orders_reply_out->order_list[x]->active_flag = 1
			set orders_reply_out->order_list[x]->encntr_id = order_reply->active_orders[x]->encounter->encounter_id
			set orders_reply_out->order_list[x]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[x]->encntr_id, 1 )			;004
			set orders_reply_out->order_list[x]->encntr_type_disp =
				uar_get_code_display(orders_reply_out->order_list[x]->encntr_type_cd)  	;004
			set orders_reply_out->order_list[x]->encntr_type_class_cd = GetPatientClass(orders_reply_out->order_list[x]->encntr_id, 2 )		;008
			set orders_reply_out->order_list[x]->encntr_type_class_disp =
					uar_get_code_display(orders_reply_out->order_list[x]->encntr_type_class_cd)  ;008
			set orders_reply_out->order_list[x]->order_status_cd  = order_reply->active_orders[x]->core->order_status_cd
			set orders_reply_out->order_list[x]->order_status_disp =
				uar_get_code_display (order_reply->active_orders[x]->core->order_status_cd )
			set orders_reply_out->order_list[x]->reference_name = order_reply->active_orders[x]->displays->reference_name
			set orders_reply_out->order_list[x]->clinical_name = order_reply->active_orders[x]->displays->clinical_name
			set orders_reply_out->order_list[x]->department_name = order_reply->active_orders[x]->displays->department_name
			set orders_reply_out->order_list[x]->clinical_display_line = order_reply->active_orders[x]->displays->clinical_display_line
			set orders_reply_out->order_list[x]->simplified_display_line = order_reply->active_orders[x]->displays->simplified_display_line
			set orders_reply_out->order_list[x]->current_start_dt_tm =	 order_reply->active_orders[x]->schedule->current_start_dt_tm
			set orders_reply_out->order_list[x]->projected_stop_dt_tm = order_reply->active_orders[x]->schedule->projected_stop_dt_tm
			set orders_reply_out->order_list[x]->stop_type = uar_get_code_display(order_reply->active_orders[x]->schedule->stop_type_cd)
			set orders_reply_out->order_list[x]->orig_date = order_reply->active_orders[x]->schedule->original_order_dt_tm
			set orders_reply_out->order_list[x]->valid_dose_dt_tm = order_reply->active_orders[x]->schedule->valid_dose_dt_tm
			set orders_reply_out->order_list[x]->clinically_relevant_dt_tm =
				order_reply->active_orders[x]->schedule->clinically_relevant_dt_tm
			set orders_reply_out->order_list[x]->suspended_dt_tm = order_reply->active_orders[x]->schedule->suspended_dt_tm
			set orders_reply_out->order_list[x]->med_order_type_cd   =
				order_reply->active_orders[x]->medication_information->medication_order_type_cd
			set orders_reply_out->order_list[x]->med_order_type_disp   =
				uar_get_code_display(order_reply->active_orders[x]->medication_information->medication_order_type_cd)
			set orders_reply_out->order_list[x]->order_mnemonic = order_reply->active_orders[x]->order_mnemonic->mnemonic
			set orders_reply_out->order_list[x]->synonym_id = order_reply->active_orders[x]->reference_information->synonym_id
			set orders_reply_out->order_list[x]->activity_type_cd = order_reply->active_orders[x]->reference_information->activity_type_cd
			set orders_reply_out->order_list[x]->activity_type_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->activity_type_cd)
			set orders_reply_out->order_list[x]->catalog_type_cd =
				order_reply->active_orders[x]->reference_information->catalog_type_cd
			set orders_reply_out->order_list[x]->catalog_type_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_type_cd)
 
			; 012 +
			if (orders_reply_out->order_list[x]->catalog_cd =
					dCodeStatusCd and orders_reply_out->order_list[x]->activity_type_cd = dCommunicationTypeCd)
				set orders_reply_out->order_list[x]->activity_type_disp = "Code Status"
				set orders_reply_out->order_list[x]->reference_name	= ""
				set orders_reply_out->order_list[x]->reference_name = GetDetail(orders_reply_out->order_list[x]->order_id)
			endif
			; 012 -
 
			set orders_reply_out->order_list[x]->catalog_cd = order_reply->active_orders[x]->reference_information->catalog_id
			set orders_reply_out->order_list[x]->catalog_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_id)
			set orders_reply_out->order_list[x]->order_entry_format_id =
				order_reply->active_orders[x]->reference_information->order_entry_format_id
			set orders_reply_out->order_list[x]->clin_category_cd =
				order_reply->active_orders[x]->reference_information->clinical_category_cd
			set orders_reply_out->order_list[x]->clin_category_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->clinical_category_cd)
 
		endif
	endfor
 
	if (orderActiveCnt = 0)
		call ErrorHandler("EXECUTE", "Z", "ORDERS", "No Active orders found", orders_reply_out)
		go to EXIT_SCRIPT
	endif
 
else
 
	set tempCnt = 0
	set newCnt = 0
	set orderActiveCnt = size(order_reply->active_orders, 5)
	if(iMax_recs > 0)
 
		if(size(order_reply->active_orders, 5) > iMax_recs )
 
			set orderActiveCnt = iMax_recs
 
		endif
 
	endif
 
if(idebugFlag > 0)
 
	call echo(build("Active Order Cnt 2 -->", orderActiveCnt))
 
endif
	;set stat = alterlist(orders_reply_out->order_list, orderActiveCnt)   ;001
	set j = 0
	for(x = 1 to orderActiveCnt)
 
		if(sOrderTypes != "")  ;007
 
			if(idebugFlag > 0)
 
				call echo(build("sOrderTypes -->", sOrderTypes))
 
			endif
 
			;set filter_ind = CheckOrderTypes(order_reply->active_orders[x]->reference_information->clinical_category_cd)
			set filter_ind = CheckOrderTypes(order_reply->active_orders[x]->reference_information->activity_type_cd)	;005
			if(idebugFlag > 0)
 
				call echo(build("filter_ind -->", filter_ind))
 
			endif
 
			if(filter_ind > 0) ;001 ;002
				set j = j + 1
				set stat = alterlist(orders_reply_out->order_list, j)
				set orders_reply_out->order_list[j]->order_id = order_reply->active_orders[x]->core->order_id
				set orders_reply_out->order_list[j]->person_id = order_reply->active_orders[x]->core->patient_id
				set orders_reply_out->order_list[j]->active_flag = 1
				set orders_reply_out->order_list[j]->encntr_id = order_reply->active_orders[x]->encounter->encounter_id
				set orders_reply_out->order_list[j]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[j]->encntr_id,1 )		   ;004
				set orders_reply_out->order_list[j]->encntr_type_disp =
					uar_get_code_display(orders_reply_out->order_list[j]->encntr_type_cd)  ;004
				set orders_reply_out->order_list[j]->encntr_type_class_cd = GetPatientClass(orders_reply_out->order_list[j]->encntr_id ,2)		;008
				set orders_reply_out->order_list[j]->encntr_type_class_disp =
					uar_get_code_display(orders_reply_out->order_list[j]->encntr_type_class_cd)  ;008
				set orders_reply_out->order_list[j]->order_status_cd  = order_reply->active_orders[x]->core->order_status_cd
				set orders_reply_out->order_list[j]->order_status_disp =
					uar_get_code_display (order_reply->active_orders[x]->core->order_status_cd )
				set orders_reply_out->order_list[j]->reference_name = order_reply->active_orders[x]->displays->reference_name
				set orders_reply_out->order_list[j]->clinical_name = order_reply->active_orders[x]->displays->clinical_name
				set orders_reply_out->order_list[j]->department_name = order_reply->active_orders[x]->displays->department_name
				set orders_reply_out->order_list[j]->clinical_display_line = order_reply->active_orders[x]->displays->clinical_display_line
				set orders_reply_out->order_list[j]->simplified_display_line = order_reply->active_orders[x]->displays->simplified_display_line
				set orders_reply_out->order_list[j]->current_start_dt_tm =	 order_reply->active_orders[x]->schedule->current_start_dt_tm
				set orders_reply_out->order_list[j]->projected_stop_dt_tm = order_reply->active_orders[x]->schedule->projected_stop_dt_tm
				set orders_reply_out->order_list[j]->stop_type = uar_get_code_display(order_reply->active_orders[x]->schedule->stop_type_cd)
				set orders_reply_out->order_list[j]->orig_date = order_reply->active_orders[x]->schedule->original_order_dt_tm
				set orders_reply_out->order_list[j]->valid_dose_dt_tm = order_reply->active_orders[x]->schedule->valid_dose_dt_tm
				set orders_reply_out->order_list[j]->clinically_relevant_dt_tm =
					order_reply->active_orders[x]->schedule->clinically_relevant_dt_tm
				set orders_reply_out->order_list[j]->suspended_dt_tm = order_reply->active_orders[x]->schedule->suspended_dt_tm
				set orders_reply_out->order_list[j]->med_order_type_cd   =
					order_reply->active_orders[x]->medication_information->medication_order_type_cd
				set orders_reply_out->order_list[j]->med_order_type_disp   =
					uar_get_code_display(order_reply->active_orders[x]->medication_information->medication_order_type_cd)
				set orders_reply_out->order_list[j]->order_mnemonic = order_reply->active_orders[x]->order_mnemonic->mnemonic
				set orders_reply_out->order_list[j]->synonym_id = order_reply->active_orders[x]->reference_information->synonym_id
				set orders_reply_out->order_list[j]->activity_type_cd = order_reply->active_orders[x]->reference_information->activity_type_cd
				set orders_reply_out->order_list[j]->activity_type_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->activity_type_cd)
				set orders_reply_out->order_list[j]->catalog_type_cd = order_reply->active_orders[x]->reference_information->catalog_type_cd
				set orders_reply_out->order_list[j]->catalog_type_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_type_cd)
				set orders_reply_out->order_list[j]->catalog_cd = order_reply->active_orders[x]->reference_information->catalog_id
				set orders_reply_out->order_list[j]->catalog_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_id)
 
				; 012 +
				if (orders_reply_out->order_list[j]->catalog_cd =
					dCodeStatusCd and orders_reply_out->order_list[j]->activity_type_cd = dCommunicationTypeCd)
					set orders_reply_out->order_list[j]->activity_type_disp = "Code Status"
					set orders_reply_out->order_list[j]->reference_name	= ""
					set orders_reply_out->order_list[j]->reference_name = GetDetail(orders_reply_out->order_list[j]->order_id)
				endif
				; 012 -
 
				set orders_reply_out->order_list[j]->order_entry_format_id =
					order_reply->active_orders[x]->reference_information->order_entry_format_id
				set orders_reply_out->order_list[j]->clin_category_cd =
					order_reply->active_orders[x]->reference_information->clinical_category_cd
				set orders_reply_out->order_list[j]->clin_category_disp =
					uar_get_code_display(order_reply->active_orders[x]->reference_information->clinical_category_cd)
 
			endif
		else
 
			if(idebugFlag > 0)
 
				call echo(build("iInc_All_Ord -->", iInc_All_Ord))
 
			endif
 
			set stat = alterlist(orders_reply_out->order_list, x)
			set orders_reply_out->order_list[x]->order_id = order_reply->active_orders[x]->core->order_id
			set orders_reply_out->order_list[x]->person_id = order_reply->active_orders[x]->core->patient_id
			set orders_reply_out->order_list[x]->active_flag = 1
			set orders_reply_out->order_list[x]->encntr_id = order_reply->active_orders[x]->encounter->encounter_id
			set orders_reply_out->order_list[x]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[x]->encntr_id,1 )		   ;004
			set orders_reply_out->order_list[x]->encntr_type_disp =
				uar_get_code_display(orders_reply_out->order_list[x]->encntr_type_cd)  ;004
			set orders_reply_out->order_list[x]->encntr_type_class_cd =
				GetPatientClass(orders_reply_out->order_list[x]->encntr_id,2 )	   ;008
			set orders_reply_out->order_list[x]->encntr_type_class_disp =
				uar_get_code_display(orders_reply_out->order_list[x]->encntr_type_class_cd)  ;008
 
			set orders_reply_out->order_list[x]->order_status_cd  = order_reply->active_orders[x]->core->order_status_cd
			set orders_reply_out->order_list[x]->order_status_disp =
				uar_get_code_display (order_reply->active_orders[x]->core->order_status_cd )
			set orders_reply_out->order_list[x]->reference_name = order_reply->active_orders[x]->displays->reference_name
			set orders_reply_out->order_list[x]->clinical_name = order_reply->active_orders[x]->displays->clinical_name
			set orders_reply_out->order_list[x]->department_name = order_reply->active_orders[x]->displays->department_name
			set orders_reply_out->order_list[x]->clinical_display_line = order_reply->active_orders[x]->displays->clinical_display_line
			set orders_reply_out->order_list[x]->simplified_display_line = order_reply->active_orders[x]->displays->simplified_display_line
			set orders_reply_out->order_list[x]->current_start_dt_tm =	 order_reply->active_orders[x]->schedule->current_start_dt_tm
			set orders_reply_out->order_list[x]->projected_stop_dt_tm = order_reply->active_orders[x]->schedule->projected_stop_dt_tm
			set orders_reply_out->order_list[x]->stop_type = uar_get_code_display(order_reply->active_orders[x]->schedule->stop_type_cd)
			set orders_reply_out->order_list[x]->orig_date = order_reply->active_orders[x]->schedule->original_order_dt_tm
			set orders_reply_out->order_list[x]->valid_dose_dt_tm = order_reply->active_orders[x]->schedule->valid_dose_dt_tm
			set orders_reply_out->order_list[x]->clinically_relevant_dt_tm =
				order_reply->active_orders[x]->schedule->clinically_relevant_dt_tm
			set orders_reply_out->order_list[x]->suspended_dt_tm =
				order_reply->active_orders[x]->schedule->suspended_dt_tm
			set orders_reply_out->order_list[x]->med_order_type_cd   =
				order_reply->active_orders[x]->medication_information->medication_order_type_cd
			set orders_reply_out->order_list[x]->med_order_type_disp   =
				uar_get_code_display(order_reply->active_orders[x]->medication_information->medication_order_type_cd)
			set orders_reply_out->order_list[x]->order_mnemonic = order_reply->active_orders[x]->order_mnemonic->mnemonic
			set orders_reply_out->order_list[x]->synonym_id = order_reply->active_orders[x]->reference_information->synonym_id
			set orders_reply_out->order_list[x]->activity_type_cd = order_reply->active_orders[x]->reference_information->activity_type_cd
			set orders_reply_out->order_list[x]->activity_type_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->activity_type_cd)
			set orders_reply_out->order_list[x]->catalog_type_cd = order_reply->active_orders[x]->reference_information->catalog_type_cd
			set orders_reply_out->order_list[x]->catalog_type_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_type_cd)
			set orders_reply_out->order_list[x]->catalog_cd = order_reply->active_orders[x]->reference_information->catalog_id
			set orders_reply_out->order_list[x]->catalog_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->catalog_id)
 
			; 012 +
			if (orders_reply_out->order_list[x]->catalog_cd = dCodeStatusCd
					and orders_reply_out->order_list[x]->activity_type_cd = dCommunicationTypeCd)
				set orders_reply_out->order_list[x]->activity_type_disp = "Code Status"
				set orders_reply_out->order_list[x]->reference_name	= ""
				set orders_reply_out->order_list[x]->reference_name = GetDetail(orders_reply_out->order_list[x]->order_id)
			endif
			; 012 -
 
			set orders_reply_out->order_list[x]->order_entry_format_id =
				order_reply->active_orders[x]->reference_information->order_entry_format_id
			set orders_reply_out->order_list[x]->clin_category_cd =
				order_reply->active_orders[x]->reference_information->clinical_category_cd
			set orders_reply_out->order_list[x]->clin_category_disp =
				uar_get_code_display(order_reply->active_orders[x]->reference_information->clinical_category_cd)
 
 
		endif
 
 
	endfor
 
	set orderInActiveCnt = size(order_reply->inactive_orders, 5)
	if(idebugFlag > 0)
 
		call echo(build("# of INACTIVE orders -->", orderInActiveCnt))
 
	endif
 
	if(iMax_recs > 0)
 
		if(size(order_reply->inactive_orders, 5) > iMax_recs )
 
			set orderInActiveCnt = iMax_recs
 
		endif
 
	endif
 
 	;set orderInActiveCnt = size(order_reply->inactive_orders, 5)
	set tempCnt = orderActiveCnt + orderInActiveCnt
	if(iMax_recs > 0)
 
		if(tempCnt > iMax_recs)
 
			set tempCnt = iMax_recs
 
		endif
 
	endif
 
 
 
	;set stat = alterlist(orders_reply_out->order_list, tempCnt)  ;001
	set newCnt = orderActiveCnt + 1
	if(idebugFlag > 0)
 
		call echo(build("Start count for INACTIVE -->", newCnt))
		call echo(build("ALL Order count -->", tempCnt))
		call echo(build("New Order List size -->", size(orders_reply_out->order_list,5)))
 
	endif
	set y =0
    set z = 0
 
	for(z = 1 to orderInActiveCnt)   ;010
 
		if(sOrderTypes != "")  ;007
 
			;set filter_ind = CheckOrderTypes(order_reply->inactive_orders[z]->reference_information->clinical_category_cd)
			set filter_ind = CheckOrderTypes(order_reply->inactive_orders[z]->reference_information->activity_type_cd) ;005
			if(idebugFlag > 0)
 
				call echo(build("filter_ind -->", filter_ind))
 
			endif
 
			if(filter_ind > 0) ;001 ;002
 				set y = size(orders_reply_out->order_list,5)		 ;010
				set y = y + 1										 ;010
				set stat = alterlist(orders_reply_out->order_list, y);010
 
				set orders_reply_out->order_list[y]->order_id = order_reply->inactive_orders[z]->core->order_id
				set orders_reply_out->order_list[y]->person_id = order_reply->inactive_orders[z]->core->patient_id
				set orders_reply_out->order_list[y]->active_flag = 0
				set orders_reply_out->order_list[y]->encntr_id = order_reply->inactive_orders[z]->encounter->encounter_id
				set orders_reply_out->order_list[y]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[y]->encntr_id,1 )			   ;004
				set orders_reply_out->order_list[y]->encntr_type_disp =
					uar_get_code_display(orders_reply_out->order_list[y]->encntr_type_cd)  ;004
				set orders_reply_out->order_list[y]->encntr_type_class_cd =
					GetPatientClass(orders_reply_out->order_list[y]->encntr_id,2 )			   ;008
				set orders_reply_out->order_list[y]->encntr_type_class_disp =
					uar_get_code_display(orders_reply_out->order_list[y]->encntr_type_class_cd)  ;008
				set orders_reply_out->order_list[y]->order_status_cd  = order_reply->inactive_orders[z]->core->order_status_cd
				set orders_reply_out->order_list[y]->order_status_disp =
					uar_get_code_display (order_reply->inactive_orders[z]->core->order_status_cd )
				set orders_reply_out->order_list[y]->reference_name = order_reply->inactive_orders[z]->displays->reference_name
				set orders_reply_out->order_list[y]->clinical_name = order_reply->inactive_orders[z]->displays->clinical_name
				set orders_reply_out->order_list[y]->department_name = order_reply->inactive_orders[z]->displays->department_name
				set orders_reply_out->order_list[y]->clinical_display_line = order_reply->inactive_orders[z]->displays->clinical_display_line
				set orders_reply_out->order_list[y]->simplified_display_line =
					order_reply->inactive_orders[z]->displays->simplified_display_line
				set orders_reply_out->order_list[y]->current_start_dt_tm =	 order_reply->inactive_orders[z]->schedule->current_start_dt_tm
				set orders_reply_out->order_list[y]->projected_stop_dt_tm = order_reply->inactive_orders[z]->schedule->projected_stop_dt_tm
				set orders_reply_out->order_list[y]->stop_type = uar_get_code_display(order_reply->inactive_orders[z]->schedule->stop_type_cd)
				set orders_reply_out->order_list[y]->orig_date = order_reply->inactive_orders[z]->schedule->original_order_dt_tm
				set orders_reply_out->order_list[y]->valid_dose_dt_tm =
					order_reply->inactive_orders[z]->schedule->valid_dose_dt_tm
				set orders_reply_out->order_list[y]->clinically_relevant_dt_tm =
					order_reply->inactive_orders[z]->schedule->clinically_relevant_dt_tm
				set orders_reply_out->order_list[y]->suspended_dt_tm =
					order_reply->inactive_orders[z]->schedule->suspended_dt_tm
				set orders_reply_out->order_list[y]->med_order_type_cd   =
					order_reply->inactive_orders[z]->medication_information->medication_order_type_cd
				set orders_reply_out->order_list[y]->med_order_type_disp   =
					uar_get_code_display(order_reply->inactive_orders[z]->medication_information->medication_order_type_cd)
				set orders_reply_out->order_list[y]->order_mnemonic = order_reply->inactive_orders[z]->order_mnemonic->mnemonic
				set orders_reply_out->order_list[y]->synonym_id = order_reply->inactive_orders[z]->reference_information->synonym_id
				set orders_reply_out->order_list[y]->activity_type_cd = order_reply->inactive_orders[z]->reference_information->activity_type_cd
				set orders_reply_out->order_list[y]->activity_type_disp =
					uar_get_code_display(order_reply->inactive_orders[z]->reference_information->activity_type_cd)
				set orders_reply_out->order_list[y]->catalog_type_cd = order_reply->inactive_orders[z]->reference_information->catalog_type_cd
				set orders_reply_out->order_list[y]->catalog_type_disp =
					uar_get_code_display(order_reply->inactive_orders[z]->reference_information->catalog_type_cd)
				set orders_reply_out->order_list[y]->catalog_cd = order_reply->inactive_orders[z]->reference_information->catalog_id
				set orders_reply_out->order_list[y]->catalog_disp =
					uar_get_code_display(order_reply->inactive_orders[z]->reference_information->catalog_id)
 
				; 012 +
				if (orders_reply_out->order_list[y]->catalog_cd = dCodeStatusCd
						and orders_reply_out->order_list[y]->activity_type_cd = dCommunicationTypeCd)
					set orders_reply_out->order_list[y]->activity_type_disp = "Code Status"
					set orders_reply_out->order_list[y]->reference_name	= ""
					set orders_reply_out->order_list[y]->reference_name = GetDetail(orders_reply_out->order_list[y]->order_id)
				endif
				; 012 -
 
				set orders_reply_out->order_list[y]->order_entry_format_id =
					order_reply->inactive_orders[z]->reference_information->order_entry_format_id
				set orders_reply_out->order_list[y]->clin_category_cd =
					order_reply->inactive_orders[z]->reference_information->clinical_category_cd
				set orders_reply_out->order_list[y]->clin_category_disp =
					uar_get_code_display(order_reply->inactive_orders[z]->reference_information->clinical_category_cd)
 
			endif
 
 		else
 
 			set y = size(orders_reply_out->order_list,5)			;010
			set y = y + 1											;010
			set stat = alterlist(orders_reply_out->order_list, y)	;010
 
			;set stat = alterlist(orders_reply_out->order_list, z)
			set orders_reply_out->order_list[y]->order_id = order_reply->inactive_orders[z]->core->order_id
			set orders_reply_out->order_list[y]->person_id = order_reply->inactive_orders[z]->core->patient_id
			set orders_reply_out->order_list[y]->active_flag = 0
			set orders_reply_out->order_list[y]->encntr_id = order_reply->inactive_orders[z]->encounter->encounter_id
			set orders_reply_out->order_list[y]->encntr_type_cd = GetPatientClass(orders_reply_out->order_list[y]->encntr_id,1 )			   ;004
			set orders_reply_out->order_list[y]->encntr_type_disp =
				uar_get_code_display(orders_reply_out->order_list[y]->encntr_type_cd)  ;004
			set orders_reply_out->order_list[y]->encntr_type_class_cd =
				GetPatientClass(orders_reply_out->order_list[y]->encntr_id,2 )			   ;008
			set orders_reply_out->order_list[y]->encntr_type_class_disp =
				uar_get_code_display(orders_reply_out->order_list[y]->encntr_type_class_cd)  ;008
 
			set orders_reply_out->order_list[y]->order_status_cd  = order_reply->inactive_orders[z]->core->order_status_cd
			set orders_reply_out->order_list[y]->order_status_disp =
				uar_get_code_display (order_reply->inactive_orders[z]->core->order_status_cd )
			set orders_reply_out->order_list[y]->reference_name = order_reply->inactive_orders[z]->displays->reference_name
			set orders_reply_out->order_list[y]->clinical_name = order_reply->inactive_orders[z]->displays->clinical_name
			set orders_reply_out->order_list[y]->department_name = order_reply->inactive_orders[z]->displays->department_name
			set orders_reply_out->order_list[y]->clinical_display_line = order_reply->inactive_orders[z]->displays->clinical_display_line
			set orders_reply_out->order_list[y]->simplified_display_line = order_reply->inactive_orders[z]->displays->simplified_display_line
			set orders_reply_out->order_list[y]->current_start_dt_tm =	 order_reply->inactive_orders[z]->schedule->current_start_dt_tm
			set orders_reply_out->order_list[y]->projected_stop_dt_tm = order_reply->inactive_orders[z]->schedule->projected_stop_dt_tm
			set orders_reply_out->order_list[y]->stop_type = uar_get_code_display(order_reply->inactive_orders[z]->schedule->stop_type_cd)
			set orders_reply_out->order_list[y]->orig_date = order_reply->inactive_orders[z]->schedule->original_order_dt_tm
			set orders_reply_out->order_list[y]->valid_dose_dt_tm = order_reply->inactive_orders[z]->schedule->valid_dose_dt_tm
			set orders_reply_out->order_list[y]->clinically_relevant_dt_tm =
				order_reply->inactive_orders[z]->schedule->clinically_relevant_dt_tm
			set orders_reply_out->order_list[y]->suspended_dt_tm = order_reply->inactive_orders[z]->schedule->suspended_dt_tm
			set orders_reply_out->order_list[y]->med_order_type_cd   =
				order_reply->inactive_orders[z]->medication_information->medication_order_type_cd
			set orders_reply_out->order_list[y]->med_order_type_disp   =
				uar_get_code_display(order_reply->inactive_orders[z]->medication_information->medication_order_type_cd)
			set orders_reply_out->order_list[y]->order_mnemonic = order_reply->inactive_orders[z]->order_mnemonic->mnemonic
			set orders_reply_out->order_list[y]->synonym_id = order_reply->inactive_orders[z]->reference_information->synonym_id
			set orders_reply_out->order_list[y]->activity_type_cd = order_reply->inactive_orders[z]->reference_information->activity_type_cd
			set orders_reply_out->order_list[y]->activity_type_disp =
				uar_get_code_display(order_reply->inactive_orders[z]->reference_information->activity_type_cd)
			set orders_reply_out->order_list[y]->catalog_type_cd = order_reply->inactive_orders[z]->reference_information->catalog_type_cd
			set orders_reply_out->order_list[y]->catalog_type_disp =
				uar_get_code_display(order_reply->inactive_orders[z]->reference_information->catalog_type_cd)
			set orders_reply_out->order_list[y]->catalog_cd =
				order_reply->inactive_orders[z]->reference_information->catalog_id
			set orders_reply_out->order_list[y]->catalog_disp =
				uar_get_code_display(order_reply->inactive_orders[z]->reference_information->catalog_id)
 
			; 012 +
			if (orders_reply_out->order_list[y]->catalog_cd = dCodeStatusCd
					and orders_reply_out->order_list[y]->activity_type_cd = dCommunicationTypeCd)
				set orders_reply_out->order_list[y]->activity_type_disp = "Code Status"
				set orders_reply_out->order_list[y]->reference_name	= ""
				set orders_reply_out->order_list[y]->reference_name = GetDetail(orders_reply_out->order_list[y]->order_id)
			endif
			; 012 -
 
			set orders_reply_out->order_list[y]->order_entry_format_id =
				order_reply->inactive_orders[z]->reference_information->order_entry_format_id
			set orders_reply_out->order_list[y]->clin_category_cd =
				order_reply->inactive_orders[z]->reference_information->clinical_category_cd
			set orders_reply_out->order_list[y]->clin_category_disp =
				uar_get_code_display(order_reply->inactive_orders[z]->reference_information->clinical_category_cd)
 
 
 		endif
 
	endfor
 
 
 	if ((orderActiveCnt = 0)AND (orderInActiveCnt = 0))
		call ErrorHandler("EXECUTE", "Z", "ORDERS", "No Active or Inactive orders found", orders_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetOrders Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: ParseOrderTypes(sOrderTypes = vc)
;  Description: Subroutine to parse a comma delimited string ;002
;
**************************************************************************/
subroutine ParseOrderTypes(sOrderTypes)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("ParseOrderTypes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare notfnd 		= vc with constant("<not_found>")
declare num 		= i4 with noconstant(1)
declare str 		= vc with noconstant("")
 
if(sOrderTypes != "")
 
	while (str != notfnd)
 
     	set str =  piece(sOrderTypes,',',num,notfnd)
 
     	if(str != notfnd)
      		set stat = alterlist(ordertype_req->order_types, num)
     		set ordertype_req->order_types[num]->order_type_cd = cnvtreal(str)
     	endif
 
      	set num = num + 1
 
 	endwhile
 
    set ord_type_cnt = size(ordertype_req->order_types,5)
	if(idebugFlag > 0)
 
		call echorecord(ordertype_req)
 
	endif
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("ParseOrderTypes Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: CheckOrderTypes(order_type_cd = f8)
;  Description: Subroutine to parse a comma delimited string ;002
;
**************************************************************************/
subroutine CheckOrderTypes(clin_cat_cd)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("CheckOrderTypes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare bExist 				= i2 with noconstant(0)
declare dClin_cat_cd 		= f8 with protect, noconstant(0.0)
 
set dClin_cat_cd = clin_cat_cd
if(idebugFlag > 0)
 
	call echo(build("1 clin_cat_cd-->",dClin_cat_cd ))
 
endif
 
set q = 0
 
	for (q = 1 to ord_type_cnt)
 
		if(ordertype_req->order_types[q]->order_type_cd = dClin_cat_cd )
			set bExist = 1
			call echo(build("order_type_cd-->",ordertype_req->order_types[q]->order_type_cd ))
		endif
 
	endfor
 
	return (bExist)
 
if(idebugFlag > 0)
 
	call echo(concat("CheckOrderTypes Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*************************************************************************
;  Name: GetDetail(order_id = f8)
;  Description: Subroutine to return order detail
;  012
**************************************************************************/
subroutine GetDetail(order_id)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetDetail Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare oe_field_value 	= vc  with protect ,noconstant ("")
 
 
 
   select into "nl:"
 
    from
            order_detail od
 
 
    where od.order_id = order_id
 
	head od.oe_field_meaning
 
		case(trim(od.oe_field_meaning,3))
 
				of "RESUSCITATIONSTATUS":
 
					oe_field_value  = trim(od.oe_field_display_value,3)
 
		endcase
 
 
	with nocounter
 
 	return (oe_field_value)
 
if(idebugFlag > 0)
 
	call echo(concat("GetDetail Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
end go
 
