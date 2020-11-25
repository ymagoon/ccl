/*~BB~************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*****************************************************************************
          Date Written:       11/13/14
          Source file name:   vigilanz_get_medication
          Object name:        vigilanz_get_medication
          Program purpose:    Returns medication details for a given medication
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer             Comment
 -----------------------------------------------------------------------
  000 04/29/15 JCO					Initial write
  001 05/01/15 JCO					Added TherapeuticClass, TherapeuticSubClass and MedicationCategory
  002 05/05/15 JCO					Added ORIG_ORD_AS_FLAG
  003 05/05/15 JCO					Added FREQUENCY_SCHEDULE query for frequency_type
  004 05/15/15 AAB 					Add StopDateTime, MedicationName, AlternativeMedicationName to response
  005 05/27/15 AAB 					Change medication_reply_out to singular
  006 07/25/15 JCO					Added OrigOrderProvider, OrderCommunicationType,
  									DepartmentStatus, PharmOrderPriority, DrugForm
  007 07/27/15 JCO					Added ReferenceTextType
  008 08/21/15 AAB 					Pull CDF MEANING for Order Status instead of Display
  009 08/26/15 AAB					Add Duration and Duration Units to response
  010 09/14/15 AAB					Add audit object
  011 12/14/15 AAB 					Return patient class
  012 01/18/16 JCO					Fixed dPharmacyCd to use codeset 106 instead of 6000
  013 01/19/16 JCO					Fixed counter when getting frequency_type
  014 01/22/16 JCO					Fixed Med Admin list to return all administrations
  015 02/22/16 AAB 					Add encntr_type_cd and encntr_type_disp
  016 04/29/16 AAB 					Added version
  017 10/10/16 AAB 					Add DEBUG_FLAG
  018 12/02/16 DJP					Add NDC value
  019 05/04/17 DJP					Add NDC value to individual ingredient
  020 06/21/17 JCO					Added Medication_Basis for orig_ord_as_flag
  021 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  022 09/21/17 DJP					Added outerjoins to fields on prsnl table in GetOrderDetails
  023 09/22/17 DJP					Added prn_ind, prn_reason and number_of_refills
  024 12/06/17 DJP					Added med fields (brand/generic/dea sch/daw,therapy type)
  025 12/06/17 DJP					Add Default Patient Preferred Pharmacy Object
  026 03/21/18 RJC					Added version code and copyright block
  027 04/10/18 RJC					Added scheduled admins prompt and object
  028 06/19/18 RJC					Added strength, strength unit, dispense from, fixed issue with NDC, brand,
  									generic not showing on all meds, fixed it so ingredient only shows if id differs from med
  	 								and performed code cleanup
  029 06/21/18 RJC					Added Max/Min Dose
  030 07/25/18 RJC					Fixed issue with invalid number where ocs.cki isn't numeric
  031 10/16/18 STV                  Added Titrate to response model
  032 10/26/18 STV                  Added logic to grab children med admins
  033 11/15/18 RJC					Added formulary status
  034 01/09/19 RJC					Fixed ingredient issue and added medication_item_id
  035 01/09/19 RJC					Added OrderRevew object
  036 01/10/19 STV                  Fix to order by d.seq for order ingredients
  037 01/11/19 RJC					Fix NDC in ingredient object
  038 02/19/19 STV                  update to ordering_provider_id
  039 02/25/19 RJC					Added parent order id, requested dispense amt/unit, total daily dose
  040 03/13/19 RJC					Updated reply structure for 3202501
  041 03/18/19 STV                  update for ingredblock to pull from table and not tbd_execute for strength
  042 03/21/19 RJC					Changed max/min dose back to string
  043 03/28/19 STV                  removed the task_class_cd filter and added or statement to properly get sched_admins
  044 04/04/19 STV                  Added Task Class object
  045 05/10/19 RJC					Fixed duplicate items in medication details
  046 05/22/19 STV                  Fix for ingredient block for inconsitiencies
  047 05/23/19 STV                  Added Tasks object
  048 05/24/19 STV                  Fix for order_details missing
  049 05/29/19 STV                  Added ValueCodes object
  050 06/12/19 STV                  Fix for duplicate order_ingredients on the order_prodcut action_sequence
  051 06/17/19 STV                  Added ingredient type flag object
  052 07/15/19 RJC					Removed filtering on order_review object
  053 07/23/19 STV                  Adding outerjoins for order_product ingredient level
  054 08/27/19 RJC					Added VerifiedStatus and IsNurseReviewed fields
  055 05/11/20 STV                  Added Template NonFormulary NDC
 ***********************************************************************/
drop program vigilanz_get_medication go
create program vigilanz_get_medication
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Medication ID:" = 0.0			;Required
		, "Include Rx Norm:" = 0			;Optional
		, "Include Administration:" = 0		;Optional
		, "Include ScheduledAdmins:" = 0 	;Optional - 027
 		, "User Name:" = ""        			;Required - 010
 		, "Include Tasks:" = 0              ;Optional
	    , "Debug Flag" = 0					;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,MEDICATIONID, INC_RX_NORM, INC_ADMIN, INC_SCHEDADMIN, USERNAME, INC_TASKS, DEBUG_FLAG
;017 ;INC_HISTORY, INC_AUDIT ; INC_DETAILS,
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;026
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; 680204 - Orders_GetOrdersById
free record 680204_req
record 680204_req
(
  1 orders [*]
    2 order_id = f8
  1 load_indicators
    2 order_indicators
      3 comment_types
        4 load_order_comment_ind = i2
        4 load_administration_note_ind = i2
      3 review_information_criteria
        4 load_review_status_ind = i2
        4 load_renewal_notification_ind = i2
      3 order_set_info_criteria
        4 load_core_ind = i2
        4 load_name_ind = i2
      3 supergroup_info_criteria
        4 load_core_ind = i2
        4 load_components_ind = i2
      3 load_linked_order_info_ind = i2
      3 care_plan_info_criteria
        4 load_core_ind = i2
        4 load_extended_ind = i2
      3 diagnosis_info_criteria
        4 load_core_ind = i2
        4 load_extended_ind = i2
      3 load_encounter_information_ind = i2
      3 load_pending_status_info_ind = i2
      3 load_venue_ind = i2
      3 load_order_schedule_ind = i2
      3 load_order_ingredients_ind = i2
      3 load_last_action_info_ind = i2
      3 load_extended_attributes_ind = i2
      3 load_order_proposal_info_ind = i2
      3 order_relation_criteria
        4 load_core_ind = i2
      3 appointment_criteria
        4 load_core_ind = i2
      3 therapeutic_substitution
        4 load_accepted_ind = i2
      3 accession_criteria
        4 load_core_ind = i2
      3 load_last_populated_action_ind = i2
      3 clinical_intervention_criteria
        4 load_pharmacy_ind = i2
      3 protocol_criteria
        4 load_core_ind = i2
      3 day_of_treatment_criteria
        4 load_extended_ind = i2
      3 load_order_status_reasons_ind = i2
      3 load_referral_information_ind = i2
      3 load_filtered_resp_provider_ind = i2
  1 mnemonic_criteria
    2 load_mnemonic_ind = i2
    2 simple_build_type
      3 reference_ind = i2
      3 reference_clinical_ind = i2
      3 reference_clinical_dept_ind = i2
      3 reference_department_ind = i2
    2 medication_criteria
      3 build_order_level_ind = i2
      3 build_ingredient_level_ind = i2
      3 complex_build_type
        4 reference_ind = i2
        4 clinical_ind = i2
)
 
free record 680204_rep
record 680204_rep (
  1 orders [*]
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
      3 pharmacy_instance_ind = i2
      3 future_recurring_template_ind = i2
      3 future_recurring_instance_ind = i2
      3 task_instance_ind = i2
      3 protocol_order_ind = i2
    2 order_set_information
      3 parent_ind = i2
      3 child_ind = i2
      3 parent_id = f8
      3 parent_name = vc
    2 supergroup_information
      3 parent_ind = i2
      3 child_ind = i2
      3 parent_id = f8
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
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;380003 - rx_get_item
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
 
;3202501 - Pharmacy_RetrievePharmaciesByIds - 025
free record 3202501_req
record 3202501_req (
  1 active_status_flag = i2
  1 transmit_capability_flag = i2
  1 ids [*]
    2 id = vc
)
free record 3202501_rep
record 3202501_rep (
  1 pharmacies [*]
    2 id = vc
    2 version_dt_tm = dq8
    2 pharmacy_name = vc
    2 pharmacy_number = vc
    2 active_begin_dt_tm = dq8
    2 active_end_dt_tm = dq8
    2 pharmacy_contributions [*]
      3 contributor_system_cd = f8
      3 version_dt_tm = dq8
      3 contribution_id = vc
      3 pharmacy_name = vc
      3 pharmacy_number = vc
      3 active_begin_dt_tm = dq8
      3 active_end_dt_tm = dq8
      3 addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 street_address_lines [*]
          5 street_address_line = vc
        4 city = vc
        4 state = vc
        4 postal_code = vc
        4 country = vc
        4 cross_street = vc
      3 telecom_addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 contact_method_cd = f8
        4 value = vc
        4 extension = vc
      3 service_level = vc
      3 partner_account = vc
      3 service_levels
        4 new_rx_ind = i2
        4 ref_req_ind = i2
        4 epcs_ind = i2
        4 cancel_rx_ind = i2
      3 specialties
        4 mail_order_ind = i2
        4 retail_ind = i2
        4 specialty_ind = i2
        4 twenty_four_hour_ind = i2
        4 long_term_ind = i2
    2 primary_business_address
      3 type_cd = f8
      3 type_seq = i2
      3 street_address_lines [*]
        4 street_address_line = vc
      3 city = vc
      3 state = vc
      3 postal_code = vc
      3 country = vc
      3 cross_street = vc
    2 primary_business_telephone
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_fax
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_email
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
 
;380104 - rx_get_drc_rules_by_cki - 029
free record 380104_req
record 380104_req (
  1 age_in_days = i2
  1 qual [*]
    2 cki = vc
    2 type_flag = i2
)
 
free record 380104_rep
RECORD 380104_rep (
   1 cki_list [* ]
     2 cki = vc
     2 dose_range_list [* ]
       3 dose_range_id = f8
       3 premise_id = f8
       3 min_value = f8
       3 max_value = f8
       3 dose_range_unit_cd = f8
       3 age_one = f8
       3 age_two = f8
       3 age_reltn_operator = i2
       3 age_unit_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
; Final Reply
free record medication_reply_out
record medication_reply_out(
	1 order_list[*]
		2 order_id 								= f8
		2 person_id 							= f8
		2 encntr_id							    = f8
		2 encntr_type_cd						= f8	;011
		2 encntr_type_disp						= vc	;011
		2 encntr_type_class_cd					= f8	;015
		2 encntr_type_class_disp				= vc	;015
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
		2 strength								= vc 	;028
		2 strength_unit									;028
			3 id 								= f8
			3 name 								= vc
		2 strength_dose							= vc
		2 strength_dose_unit					= vc
		2 volume_dose							= vc
		2 volume_dose_unit						= vc
		2 duration								= vc	;009
		2 duration_unit							= vc	;009
		2 route									= vc
		2 pca_mode								= vc
		2 pca_ind								= i2
		2 med_order_type_cd 					= f8
		2 med_order_type_disp 					= vc
		2 order_status_cd 						= f8
		2 order_status_disp 					= vc
		2 orig_ord_as_flag 						= i4
		2 synonym_id 							= f8
		2 o_cki									= vc	;029
		2 concept_cki							= vc
		2 comment_flag 							= i4
		2 order_entry_format_id					= f8
		2 therapeutic_class						= vc	;001
		2 therapeutic_sub_class					= vc	;001
		2 med_category_cd						= f8	;001
		2 med_category_disp						= vc	;001
		2 freq_schedule_id						= f8	;003
		2 frequency_type						= vc	;003
		2 drug_form								= vc	;006
		2 department_status						= vc	;006
		2 ordering_provider						= vc	;006
		2 ordering_provider_id					= f8	;006
		2 pharm_order_priority					= vc	;006
		2 order_communication_type_cd			= f8    ;006
		2 order_communication_type_disp			= vc	;006
		2 reference_text_type					= vc	;007
		2 medication_basis						= vc	;020
		2 prn_ind								= i4 	;023
		2 prn_reason							= vc   	;023
		2 prn_instructions						= vc    ;023
		2 number_of_refills						= i4	;023
		2 total_refills							= i4   	;023
		2 long_term_med							= i4    ;024
		2 type_of_therapy						= vc	;024
		2 previous_order_id						= vc    ;024
		2 DAW									= vc    ;024
		2 dispense_as_written					= i4    ;024
		2 DEA_schedule							= vc    ;024
		2 brand_name							= vc    ;024
		2 generic_name							= vc    ;024
		2 titrate                               = i4    ;031
		2 admin_instructions					= vc	;028
		2 rate									= f8	;028
		2 rate_unit										;028
			3 id								= f8
			3 name								= vc
		2 medication_item_id					= f8	;034
		2 tnf_id                                = f8
 		2 detqual_cnt 							= i4
		2 detqual [*]
			3 oe_field_display_value 			= vc
			3 value_code
				4 id = f8
				4 name = vc
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
		2 ingred_action_seq = i4
		2 ingred_list [*]
			3 item_id                           = f8
			3 order_mnemonic 					= vc
			3 ordered_as_mnemonic 				= vc
			3 order_detail_display_line 		= vc
		  	3 synonym_id 						= f8
			3 catalog_cd 						= f8
			3 catalog_disp 						= vc
			3 volume_value 						= f8
			3 volume_unit_cd 					= f8
			3 volume_unit_disp 					= vc
			3 strength							= vc 	;028
			3 strength_unit
				4 id 							= f8
				4 name 							= vc
			3 strength_dose						= f8 	;028
			3 strength_dose_unit_disp			= vc 	;028
			3 freetext_dose 					= vc
			3 frequency_cd 						= f8
			3 frequency_disp 					= vc
			3 comp_sequence 					= i4
			3 ingredient_type_flag 				= i2
			3 ingredient_type
				4 id = f8
				4 name = vc
			3 iv_seq 							= i4
			3 hna_order_mnemonic 				= vc
			3 dose_quantity 					= f8
			3 dose_quantity_unit 				= f8
			3 event_cd 							= f8
			3 normalized_rate 					= f8
			3 normalized_rate_unit_cd 			= f8
			3 normalized_rate_unit_disp 		= vc
			3 concentration 					= f8
			3 concentration_unit_cd 			= f8
			3 concentration_unit_disp			= vc
			3 include_in_total_volume_flag 		= i2
			3 ingredient_source_flag 			= i2
			3 ndc								= vc
	      	3 rx_norm [*]
	        	4 code                  		= vc
	        	4 code_type             		= vc
	        	4 term_type             		= vc
	    2 med_admin_cnt                         = i4
		2 med_admin_list [*]
			3 event_id 							= f8
			3 valid_from_dt_tm 					= dq8
			3 valid_until_dt_tm 				= dq8
			3 admin_note 						= vc
			3 admin_prov_id 					= f8
			3 admin_provider 					= vc
			3 admin_start_dt_tm 				= dq8
			3 admin_end_dt_tm 					= dq8
			3 admin_route_cd 					= f8
			3 admin_route_disp 					= vc
			3 admin_site_cd 					= f8
			3 admin_site_disp 					= vc
			3 admin_method_cd 					= f8
			3 admin_method_disp 				= vc
			3 admin_pt_loc_cd 					= f8
			3 admin_pt_loc_disp 				= vc
			3 initial_dosage 					= f8
			3 admin_dosage 						= f8
			3 dosage_unit_cd 					= f8
			3 dosage_unit_disp 					= vc
			3 initial_volume 					= f8
			3 total_intake_volume 				= f8
			3 diluent_type_cd 					= f8
			3 diluent_type_disp 				= vc
			3 ph_dispense_id 					= f8
			3 infusion_rate 					= f8
			3 infusion_rate_ind 				= i2
			3 infusion_unit_cd 					= f8
			3 infusion_unit_disp 				= vc
			3 infusion_unit_cd_mean 			= vc
			3 infusion_time_cd 					= f8
			3 infusion_time_cd_disp 			= vc
			3 medication_form_cd 				= f8
			3 medication_form_disp 				= vc
			3 reason_required_flag 				= i2
			3 response_required_flag			= i2
			3 admin_strength 					= i4
			3 admin_strength_ind 				= i2
			3 admin_strength_unit_cd 			= f8
			3 admin_strength_unit_disp 			= vc
			3 substance_lot_number 				= vc
			3 substance_exp_dt_tm 				= dq8
			3 substance_manufacturer_cd 		= f8
			3 substance_manufacturer_disp 		= vc
			3 refusal_cd 						= f8
			3 refusal_cd_disp 					= vc
			3 system_entry_dt_tm 				= dq8
			3 iv_event_cd 						= f8
			3 infused_volume 					= f8
			3 infused_volume_unit_cd 			= f8
			3 infused_volume_unit_disp 			= vc
			3 remaining_volume 					= f8
			3 remaining_volume_unit_cd 			= f8
			3 remaining_volume_unit_disp 		= vc
			3 synonym_id 						= f8
			3 immunization_type_cd 				= f8
			3 immunization_type_disp 			= vc
			3 admin_start_tz 					= i4
			3 admin_end_tz 						= i4
		2 rx_norm[*]
			3 code								= vc
			3 code_type							= vc
			3 term_type							= vc
		2 ndc									= vc 	;018
	 	2 preferred_pharmacy							;025+
  			3 pharmacy_id						= vc
  			3 pharmacy_name						= vc
  			3 NCPDP								= vc
  			3 is_integrated_retail				= i2 	;025-
  		2 scheduled_med_adminstrations[*]				;027
  			3 id 								= f8
  			3 status
  				4 id 							= f8
  				4 name 							= vc
  			3 dose 								= f8
  			3 dose_unit
  				4 id 							= f8
  				4 name 							= vc
  			3 scheduled_date_time 				= dq8
  		2 dispense_from									;028
  			3 pharmacy_id 						= f8
  			3 pharmacy_name						= vc
  		2 max_single_dose						= vc 	;029
  		2 max_single_dose_unit
  			3 id 								= f8
  			3 name 								= vc
  		2 min_single_dose						= vc	;029
  		2 min_single_dose_unit
  			3 id 								= f8
  			3 name 								= vc
  		2 rx_get_item_details							;028
  			3 item_id 							= f8
  			3 care_locn_cd 						= f8
  			3 facility_loc_cd 					= f8
  			3 birthdate 						= dq8
  			3 financial_class_cd 				= f8
  			3 cki_id 							= vc
  		2 formulary_status								;033
  			3 id 								= f8
  			3 name 								= vc
  		2 order_review[*]								;035
			3 review_type
				4 id							= f8
				4 name							= vc
			3 review_status
				4 id							= f8
				4 name							= vc
			3 reviewed_by
				4 provider_id					= f8
				4 provider_name					= vc
			3 reviewed_date_time				= dq8
		2 parent_order_id						= f8
		2 verified_status						= vc
		2 is_nurse_reviewed						= i2
		2 max_daily_dose						= vc
		2 max_daily_dose_unit
			3 id								= f8
			3 name								= vc
		2 requested_dispense_amount				= f8
		2 requested_dispense_unit
			3 id								= f8
			3 name								= vc
	    2 task_class
	    	3 id = f8
	    	3 name = vc
	    	3 description = vc
	    2 tasks[*]
  			3 task_id = f8
  			3 task_class
  				4 id = f8
  				4 name = vc
  			3 task_type
  				4 id = f8
  				4 name = vc
  			3 task_status
  				4 id = f8
  				4 name = vc
  		2 dispense_hx[*]
  			3 dispense_hx_id = f8
  			3 dispense_dt_tm = dq8
	1 audit												;010
		2 user_id								= f8
		2 user_firstname						= vc
		2 user_lastname							= vc
		2 patient_id							= f8
		2 patient_firstname						= vc
		2 patient_lastname						= vc
	    2 service_version						= vc	;016
  1 status_data
    2 status 									= c1
    2 subeventstatus[1]
      3 OperationName 							= c25
      3 OperationStatus 						= c1
      3 TargetObjectName 						= c25
      3 TargetObjectValue 						= vc
      3 Code 									= c4
      3 Description 							= vc
)
 
set medication_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dOrderID  					= f8 with protect, noconstant(0.0)
declare iIncRxNorm					= i4 with protect, noconstant(0)
declare iIncAdmin					= i4 with protect, noconstant(0)
declare iIncHistory					= i4 with protect, noconstant(0)
declare iIncAudit					= i4 with protect, noconstant(0)
declare iIncSchedAdmin				= i4 with protect, noconstant(0) 	;027
declare sUserName					= vc with protect, noconstant("")   ;010
declare iIncTasks                   = i4 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0) 	;017
 
;Constants
declare dPharmacyCd 				= f8 with protect ,constant(uar_get_code_by("MEANING" ,106 ,"PHARMACY" ) )		;012
declare dActiveCd 					= f8 with protect ,constant(uar_get_code_by("MEANING" ,48 ,"ACTIVE" ) )
declare comment_type_cd  			= f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare pharmsig_type_cd  			= f8 with protect, constant(uar_get_code_by("MEANING", 14, "PHARMSIG"))
declare new_action_type_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ORDER"))
declare dcp_clin_cat_cd  			= f8 with protect, constant(uar_get_code_by("MEANING", 16389, "MEDICATIONS"))
declare map_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING", 29223, "MULTUM=RXN"))
declare mnemonic_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING", 6011, "PRIMARY"))
declare dMedIdentifierTypeCd		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))  			;018
declare dPharmacyTypeCd				= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT")) 		;018
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (600060)
declare REQ_NUM	 					= i4 with protect, constant (680204)
declare ADMIN_TASK_NUMBER 			= i4 with protect, constant (600015)
declare ADMIN_REQ_NUM	 			= i4 with protect, constant (601588)
declare sRefText1 					= vc with protect, constant("PoliciesAndProcedures")							;007
declare sRefText2 					= vc with protect, constant("NursePrep")										;007
declare sRefText4 					= vc with protect, constant("PatientEducation")									;007
declare sRefText8 					= vc with protect, constant("SchedulingInfo")									;007
declare sRefText16 					= vc with protect, constant("CareplanInfo")										;007
declare sRefText32					= vc with protect, constant("ChartingGuidelines")								;007
declare sRefText64 					= vc with protect, constant("Multum")											;007
declare brand_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING", 11000, "BRAND_NAME")) 	;024
declare generic_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING", 11000, "GENERIC_NAME"))	;024
declare dPharmID					= f8 with protect, constant(uar_get_code_by("MEANING", 355 , "DEFPATPHARM")) 	;025
declare c_scheduled_task_class_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",6025,"SCH")) 				;027
declare c_medication_task_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6026,"MED")) 				;028
declare c_generic_ndc_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
 
;Other
declare ord_cnt 					= i4  with protect ,noconstant (0 )
declare comment_flag 				= i2 with protect, noconstant(0)
declare iRet						= i2 with protect, noconstant(0) 												;010
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dOrderID 					= cnvtint($MEDICATIONID)
set iIncRxNorm					= cnvtint($INC_RX_NORM)
set iIncAdmin					= cnvtint($INC_ADMIN)
set iIncSchedAdmin				= cnvtint($INC_SCHEDADMIN) ;027
set iIncTasks                       = cnvtint($INC_TASKS)
set sUserName					= trim($USERNAME, 3)   ;010
set iDebugFlag					= cnvtint($DEBUG_FLAG)  ;017
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dOrderId  ->", dOrderID))
	call echo(build("iIncRxNorm  ->", iIncRxNorm))
	call echo(build("iIncAdmin  ->", iIncAdmin))
	call echo(build("iIncSchedAdmin  ->", iIncSchedAdmin))
 	call echo(build("MED IDENT TYPE->",dMedIdentifierTypeCd))
	call echo(build("PHARM TYPE - >", dPharmacyTypeCd))
	call echo(build("INC Tasks - >",iIncTasks))
	call echo(build("BRAND PHARM TYPE - >",brand_type_cd )) ;
	call echo(build("GENERIC PHARM TYPE - >",generic_type_cd )) ;
endif
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;021
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetMedicationOrder(null)				 			= null with protect
declare GetOrderDetails(null)					 			= null with protect
declare GetMedicationDetails(null)							= null with protect ;028
declare GetOrderIngredients (null)				 			= null with protect
declare GetOrderComments (null)				     			= null with protect
declare GetMedsAdmin (null)				     	 			= null with protect
declare GetRxNorm (null)				     	 			= null with protect;018
declare GetNDC (null)				     	 				= null with protect
declare ParseComponents(sConceptCKI = vc , item = i2)	    = vc with Protect
declare GetPharmacyNCPDP(null)								= null with protect ;025
declare GetSchedAdmins(null)								= null with protect ;027
declare GetOrderReviewDetails(null)							= null with protect
declare GetTaskClass(null)                                  = null with protect
declare GetTasks(null)                              		= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Order Id exists
if(dOrderID = 0)
	call ErrorHandler2("EXECUTE", "F", "MEDICATION", "No ORDER ID was passed in",
	"2055", "Missing required field: OrderId", 	medication_reply_out)	;021
	go to EXIT_SCRIPT
endif
 
;Get Medication Order
call GetMedicationOrder(null)
 
; Get Order Details
call GetOrderDetails(null)
 
; Get Medication Details - 028
call GetMedicationDetails(null)
 
; Get Order Comments
call GetOrderComments (null)
 
; Get Order Ingredients
call GetOrderIngredients (null)
 
;Get Med Admins if requested
if(iIncAdmin > 0)
	call GetMedsAdmin(null)
	if(size(medication_reply_out->order_list,5) > 0)
		call GetChildMedAdmins(null)
	endif
endif
 
;Get Scheduled Med Admins if requested
if(iIncSchedAdmin) 				;027
	call GetSchedAdmins(null)
endif
 
;Get Preferred Pharmacy Details
 call GetPharmacyNCPDP(null)
 
; Get Task class
if(iIncTasks > 0)
	call GetTasks(null)
endif
 
;Populate Audit
set iRet = PopulateAudit(sUserName, medication_reply_out->order_list[1]->person_id, medication_reply_out, sVersion)   ;016   ;010
if(iRet = 0)  ;010
	call ErrorHandler2("VALIDATE", "F", "MEDICATION", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), medication_reply_out)	;021
	go to EXIT_SCRIPT
endif
 
; Get Order Review Details
call GetOrderReviewDetails(null)
 
;Set audit to Success
call ErrorHandler("EXECUTE", "S", "MEDICATION", "Successfully retrieved Medication Order", medication_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(medication_reply_out)
if(iDebugFlag > 0)
 	call echorecord(medication_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_medication.json")
	call echo(build2("_file : ", _file))
	call echojson(medication_reply_out, _file, 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetMedicationOrders(null)
;  Description: This will retrieve all medication orders for a patient
**************************************************************************/
subroutine GetMedicationOrder(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedicationOrder Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare orderActiveCnt 			= i4 with protect ,noconstant (0 )
	declare orderInActiveCnt 		= i4 with protect ,noconstant (0 )
	declare parseEncStr 			= vc with  protect, noconstant("")
	declare parseOrderStat 			= vc with  protect, noconstant("")
 
	set state = alterlist(680204_req->orders,1)
	set 680204_req->orders[1].order_id = dOrderID
	set 680204_req->load_indicators.order_indicators.comment_types.load_order_comment_ind = 1
	set 680204_req->load_indicators.order_indicators.order_set_info_criteria.load_core_ind = 1
	set 680204_req->load_indicators.order_indicators.order_set_info_criteria.load_name_ind = 1
	set 680204_req->load_indicators.order_indicators.load_order_schedule_ind = 1
	set 680204_req->load_indicators.order_indicators.load_encounter_information_ind = 1
	set 680204_req->load_indicators.order_indicators.load_order_ingredients_ind = 1
	set 680204_req->load_indicators.order_indicators.load_pending_status_info_ind = 1
	set 680204_req->load_indicators.order_indicators.load_venue_ind = 1
	set 680204_req->load_indicators.order_indicators.load_last_action_info_ind = 1
	set 680204_req->load_indicators.order_indicators.load_extended_attributes_ind = 1
	set 680204_req->load_indicators.order_indicators.load_order_proposal_info_ind = 1
 
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM,"REC",680204_req,"REC", 680204_rep)
 
	if (680204_rep->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "MEDICATION", "Error retrieving PHARMACY order.",
		"9999", "Error retrieving PHARMACY order.", medication_reply_out)	;021
		go to EXIT_SCRIPT
	endif
 
	set orderCnt = size(680204_rep->orders, 5)
	if (orderCnt = 0)
		call ErrorHandler2("EXECUTE", "S", "MEDICATIONS", "No orders found.",
		"0000", "No orders found.", medication_reply_out)	;029
		go to EXIT_SCRIPT
	else
		set stat = alterlist(medication_reply_out->order_list, orderCnt)
		for(x = 1 to orderCnt)
			set medication_reply_out->order_list[x]->order_id = 680204_rep->orders[x]->core->order_id
			set medication_reply_out->order_list[x]->person_id = 680204_rep->orders[x]->core->patient_id
			set medication_reply_out->order_list[x]->active_flag = 1
			set medication_reply_out->order_list[x]->encntr_id = 680204_rep->orders[x]->encounter->encounter_id
			set medication_reply_out->order_list[x]->encntr_type_cd =
				GetPatientClass(medication_reply_out->order_list[x]->encntr_id,1)  			;011
			set medication_reply_out->order_list[x]->encntr_type_disp =
				uar_get_code_display(medication_reply_out->order_list[x]->encntr_type_cd) 	;011
			set medication_reply_out->order_list[x]->encntr_type_class_cd =
				GetPatientClass(medication_reply_out->order_list[x]->encntr_id,2)  			;015
			set medication_reply_out->order_list[x]->encntr_type_class_disp =
				uar_get_code_display(medication_reply_out->order_list[x]->encntr_type_class_cd) 	;015
			set medication_reply_out->order_list[x]->order_status_cd  = 680204_rep->orders[x]->core->order_status_cd
			set medication_reply_out->order_list[x]->order_status_disp =
				uar_get_code_meaning (680204_rep->orders[x]->core->order_status_cd )  ;008
			set medication_reply_out->order_list[x]->reference_name = 680204_rep->orders[x]->displays->reference_name
			set medication_reply_out->order_list[x]->clinical_name = 680204_rep->orders[x]->displays->clinical_name
			set medication_reply_out->order_list[x]->department_name = 680204_rep->orders[x]->displays->department_name
			set medication_reply_out->order_list[x]->clinical_display_line = 680204_rep->orders[x]->displays->clinical_display_line
			set medication_reply_out->order_list[x]->simplified_display_line = 680204_rep->orders[x]->displays->simplified_display_line
			set medication_reply_out->order_list[x]->current_start_dt_tm =	 680204_rep->orders[x]->schedule->current_start_dt_tm
			set medication_reply_out->order_list[x]->projected_stop_dt_tm = 680204_rep->orders[x]->schedule->projected_stop_dt_tm
			set medication_reply_out->order_list[x]->stop_type = uar_get_code_display(680204_rep->orders[x]->schedule->stop_type_cd)
			set medication_reply_out->order_list[x]->orig_date = 680204_rep->orders[x]->schedule->original_order_dt_tm
			set medication_reply_out->order_list[x]->valid_dose_dt_tm = 680204_rep->orders[x]->schedule->valid_dose_dt_tm
			set medication_reply_out->order_list[x]->clinically_relevant_dt_tm = 680204_rep->orders[x]->schedule->clinically_relevant_dt_tm
			set medication_reply_out->order_list[x]->suspended_dt_tm = 680204_rep->orders[x]->schedule->suspended_dt_tm
			set	medication_reply_out->order_list[x]->med_order_type_cd   =
				680204_rep->orders[x]->medication_information->medication_order_type_cd
			set	medication_reply_out->order_list[x]->med_order_type_disp   =
				uar_get_code_display(680204_rep->orders[x]->medication_information->medication_order_type_cd)
			set	medication_reply_out->order_list[x]->order_mnemonic = 680204_rep->orders[x]->order_mnemonic->mnemonic
			set	medication_reply_out->order_list[x]->synonym_id = 680204_rep->orders[x]->reference_information->synonym_id
			set	medication_reply_out->order_list[x]->activity_type_cd = 680204_rep->orders[x]->reference_information->activity_type_cd
			set	medication_reply_out->order_list[x]->activity_type_disp =
				uar_get_code_display(680204_rep->orders[x]->reference_information->activity_type_cd)
			set	medication_reply_out->order_list[x]->catalog_type_cd = 680204_rep->orders[x]->reference_information->catalog_type_cd
			set	medication_reply_out->order_list[x]->catalog_type_disp =
				uar_get_code_display(680204_rep->orders[x]->reference_information->catalog_type_cd)
			set	medication_reply_out->order_list[x]->catalog_cd = 680204_rep->orders[x]->reference_information->catalog_id
			set	medication_reply_out->order_list[x]->catalog_disp =
				uar_get_code_display(680204_rep->orders[x]->reference_information->catalog_id)
			set	medication_reply_out->order_list[x]->order_entry_format_id =
				680204_rep->orders[x]->reference_information->order_entry_format_id
			set	medication_reply_out->order_list[x].parent_order_id = 680204_rep->orders[x].template_information.template_order_id
		endfor
	endif
 
	select into "nl:"
	from dispense_hx dh
	    ,(dummyt d with seq = size(medication_reply_out->order_list,5))
	plan d
		where medication_reply_out->order_list[d.seq].order_id > 0
	join dh
		where dh.order_id = medication_reply_out->order_list[d.seq].order_id
	order by d.seq
	head d.seq
		x = 0
		detail
			x = x + 1
			stat = alterlist(medication_reply_out->order_list[d.seq].dispense_hx,x)
			medication_reply_out->order_list[d.seq].dispense_hx[x].dispense_hx_id = dh.dispense_hx_id
			medication_reply_out->order_list[d.seq].dispense_hx[x].dispense_dt_tm = dh.dispense_dt_tm
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedicationOrders Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderDetails(null)
;  Description: This will retrieve all order details for an order
**************************************************************************/
subroutine GetOrderDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set meds_cnt 		= size(medication_reply_out->order_list,5)
 
	if(meds_cnt > 0)
 
		select into "nl:"
	    from   (dummyt d with seq = value(meds_cnt)),
	            order_detail od,
	            orders os,
			    oe_format_fields  off,
			    order_action oa, /*006*/
	            prsnl p			 /*006*/
		plan d
	    join os where  os.order_id = medication_reply_out->order_list[d.seq ]->order_id
	    join od where od.order_id = outerjoin(os.order_id)
	    join off where (off.oe_format_id = os.oe_format_id  AND
	                    off.oe_field_id = od.oe_field_id)
	    join oa where oa.order_id = os.order_id and oa.action_sequence = 1 		/*006*/
	    join p  where p.person_id = outerjoin(oa.order_provider_id) and p.active_ind = outerjoin(1)	/*006*/ ;022
	    order by os.order_id, od.oe_field_id, od.action_sequence desc
		head os.order_id
			detail_cnt = 0
			medication_reply_out->order_list[d.seq]->order_mnemonic = os.order_mnemonic
			medication_reply_out->order_list[d.seq]->hna_order_mnemonic = os.hna_order_mnemonic
			medication_reply_out->order_list[d.seq]->ordered_as_mnemonic = os.ordered_as_mnemonic
	/*002*/	medication_reply_out->order_list[d.seq]->orig_ord_as_flag = os.orig_ord_as_flag
	/*020*/ medication_reply_out->order_list[d.seq]->medication_basis = getMedicationBasis(os.orig_ord_as_flag)
	/*006*/ medication_reply_out->order_list[d.seq]->department_status = UAR_GET_CODE_DISPLAY(os.dept_status_cd)
	/*023*/	medication_reply_out->order_list[d.seq]->prn_ind = os.prn_ind
 
 			if(os.need_nurse_review_ind = 0)
 				medication_reply_out->order_list[d.seq].is_nurse_reviewed = 1
 			endif
 
			case(os.need_rx_verify_ind)
				of 0: medication_reply_out->order_list[d.seq].verified_status = "Verified"
				of 1: medication_reply_out->order_list[d.seq].verified_status = "Unverified"
				of 2: medication_reply_out->order_list[d.seq].verified_status = "Rejected"
			endcase
	/*007*/	case(os.ref_text_mask)
				/* REFERENCE TEXT TYPES:
					1 - PoliciesAndProcedures	Description: Policies and Procedures
 					2 - NursePrep				Description: Nurse Prep
 					4 - PatientEducation		Description: Patient Education
 					8 - SchedulingInfo			Description: Scheduling Info
 					16 - CareplanInfo			Description: CarePlan Info
 					32 - ChartingGuidelines		Description: Charting Guidelines
 					64 - Multum					Description: Multum */
				of 1:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText1
				of 2:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText2
				of 4:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText4
				of 8:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText8
				of 16:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText16
				of 32:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText32
				of 64:
					medication_reply_out->order_list[d.seq]->reference_text_type = sRefText64
			endcase
		head od.oe_field_id
			case(trim(od.oe_field_meaning,3))
				of "FREQ":
					medication_reply_out->order_list[d.seq ]->frequency = trim(od.oe_field_display_value,3)
				of "RXROUTE":
					medication_reply_out->order_list[d.seq ]->route = trim(od.oe_field_display_value,3)
				of "STRENGTHDOSE":
					medication_reply_out->order_list[d.seq ]->strength_dose = trim(od.oe_field_display_value,3)
				of "VOLUMEDOSE":
					medication_reply_out->order_list[d.seq ]->volume_dose = trim(od.oe_field_display_value,3)
				of "STRENGTHDOSEUNIT":
					medication_reply_out->order_list[d.seq ]->strength_dose_unit = trim(od.oe_field_display_value,3)
				of "VOLUMEDOSEUNIT":
					medication_reply_out->order_list[d.seq ]->volume_dose_unit = trim(od.oe_field_display_value,3)
				of "PCAMODE":
					medication_reply_out->order_list[d.seq ]->pca_mode = trim(od.oe_field_display_value,3)
					medication_reply_out->order_list[d.seq ]->pca_ind = 1
				of "FREQSCHEDID":
		/*003*/		medication_reply_out->order_list[d.seq]->freq_schedule_id = od.oe_field_value
		/*004*/	of "STOPDTTM":
					medication_reply_out->order_list[d.seq ]->stop_dt_tm = od.oe_field_dt_tm_value
		/*006*/	of "DRUGFORM":
					medication_reply_out->order_list[d.seq ]->drug_form = trim(od.oe_field_display_value,3)
		/*006*/	of "RXPRIORITY":
					medication_reply_out->order_list[d.seq ]->pharm_order_priority = trim(od.oe_field_display_value,3)
		/*009*/	of "DURATIONUNIT":
					medication_reply_out->order_list[d.seq ]->duration_unit	= trim(od.oe_field_display_value,3)
		/*009*/	of "DURATION":
					medication_reply_out->order_list[d.seq ]->duration = trim(od.oe_field_display_value,3)
 		/*023*/	of "PRNREASON":
					medication_reply_out->order_list[d.seq ]->prn_reason = trim(od.oe_field_display_value,3)
 		/*023*/	of "PRNINSTRUCTIONS":
					medication_reply_out->order_list[d.seq ]->prn_instructions = trim(od.oe_field_display_value,3)
		/*023*/	of "NUMBEROFREFILLS":
					medication_reply_out->order_list[d.seq ]->number_of_refills = cnvtint(trim(od.oe_field_display_value,3))
		/*023*/	of "TOTALREFILLS":
					medication_reply_out->order_list[d.seq ]->total_refills = cnvtint(trim(od.oe_field_display_value,3))
		/*024*/	of "DAW":
					medication_reply_out->order_list[d.seq]->DAW = trim(od.oe_field_display_value,3)
		/*024*/	of "TYPEOFTHERAPY":
					medication_reply_out->order_list[d.seq]->type_of_therapy  = trim(od.oe_field_display_value,3)
 		/*025*/	of "ROUTINGPHARMACYID":
					medication_reply_out->order_list[d.seq]->preferred_pharmacy[1]->pharmacy_id = trim(od.oe_field_display_value,3)
 		/*025*/	of "ROUTINGPHARMACYNAME":
					medication_reply_out->order_list[d.seq]->preferred_pharmacy[1]->pharmacy_name = trim(od.oe_field_display_value,3)
 		/*028*/ of "DISPENSEFROMLOC":
 					medication_reply_out->order_list[d.seq]->dispense_from.pharmacy_id = od.oe_field_value
 					medication_reply_out->order_list[d.seq]->dispense_from.pharmacy_name  = trim(od.oe_field_display_value,3)
 		/*028*/ of "SPECINX":
 					medication_reply_out->order_list[d.seq]->admin_instructions = trim(od.oe_field_display_value,3)
 		/*028*/ of "RATE":
 					medication_reply_out->order_list[d.seq]->rate = od.oe_field_value
 		/*028*/ of "RATEUNIT":
 					medication_reply_out->order_list[d.seq]->rate_unit.id = od.oe_field_value
 					medication_reply_out->order_list[d.seq]->rate_unit.name = trim(od.oe_field_display_value,3)
 		/*031*/ of "TITRATEIND":
 					medication_reply_out->order_list[d.seq]->titrate = cnvtint(trim(od.oe_field_display_value,3))
 				of "DISPENSEQTY":
 					if(oa.action_sequence = 1)
 						medication_reply_out->order_list[d.seq].requested_dispense_amount = od.oe_field_value
 					endif
 				of "DISPENSEQTYUNIT":
 					if(oa.action_sequence = 1)
						medication_reply_out->order_list[d.seq].requested_dispense_unit.id = od.oe_field_value
						medication_reply_out->order_list[d.seq].requested_dispense_unit.name = trim(od.oe_field_display_value)
					endif
			endcase
 
	/*001*/ medication_reply_out->order_list[d.seq]->med_category_cd = os.dcp_clin_cat_cd
	/*001*/ medication_reply_out->order_list[d.seq]->med_category_disp = UAR_GET_CODE_DISPLAY(os.dcp_clin_cat_cd)
	/*024*/
			if (medication_reply_out->order_list[d.seq]->type_of_therapy = "Maintenance")
				 medication_reply_out->order_list[d.seq]->long_term_med = 1
			endif ;024
 
			if (cnvtupper(medication_reply_out->order_list[d.seq].DAW) = "YES")
				 medication_reply_out->order_list[d.seq].dispense_as_written = 1
			endif ;024
 
			;Medication Details
			detail_cnt = detail_cnt + 1
			stat = alterlist(medication_reply_out->order_list[d.seq]->detqual, detail_cnt)
 
			if (size(od.oe_field_display_value,1) > 0)
				medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_display_value
				= trim(od.oe_field_display_value,1)
			endif
 
		    if (od.oe_field_dt_tm_value > NULL)
                 medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_dt_tm = od.oe_field_dt_tm_value
		    endif
 
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_id 		   = od.oe_field_id
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->label_text          = off.label_text
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->group_seq           = off.group_seq
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->field_seq           = off.field_seq
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_tz         = od.oe_field_tz
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_meaning_id = od.oe_field_meaning_id
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_meaning    = od.oe_field_meaning
			medication_reply_out->order_list[d.seq]->detqual[detail_cnt]->oe_field_value      = od.oe_field_value
	 	    medication_reply_out->order_list[d.seq]->detqual_cnt = detail_cnt
 
	 	head oa.order_id /*006*/
	 		medication_reply_out->order_list[d.seq]->order_communication_type_cd = oa.communication_type_cd
	 		medication_reply_out->order_list[d.seq]->order_communication_type_disp = UAR_GET_CODE_DISPLAY(oa.communication_type_cd)
 
	 	head p.person_id /*006*/
			medication_reply_out->order_list[d.seq]->ordering_provider = p.name_full_formatted
			medication_reply_out->order_list[d.seq]->ordering_provider_id = p.person_id
		with nocounter
	endif
 
	;getting the codeset_input type flage
	;seperating this query to not break above query if codeset flag is not found
	declare flag_fnd = i2
	declare codeset_type = i2
	select into "nl:"
	from dm_flags dm
	where dm.table_name = "ORDER_ENTRY_FIELDS"
		and dm.column_name = "FIELD_TYPE_FLAG"
		and dm.definition = "CODESET"
	head report
		flag_fnd = 1
		codeset_type = dm.flag_value
	with nocounter
 
	;getting the value_codes coded object
	if(flag_fnd > 0)
		select into "nl:"
		from order_entry_fields oef
		     ,(dummyt d1 with seq = value(meds_cnt))
		     ,(dummyt d2 with seq = 1)
		plan d1
			where maxrec(d2,size(medication_reply_out->order_list[d1.seq].detqual,5))
		join d2
			where medication_reply_out->order_list[d1.seq].detqual[d2.seq].oe_field_id > 0
		join oef
			where oef.oe_field_id = medication_reply_out->order_list[d1.seq].detqual[d2.seq].oe_field_id
				and oef.field_type_flag = codeset_type
		order by d1.seq, d2.seq
		head d1.seq
			nocnt = 0
			head d2.seq
				medication_reply_out->order_list[d1.seq].detqual[d2.seq].value_code.id =
						medication_reply_out->order_list[d1.seq].detqual[d2.seq].oe_field_value
				medication_reply_out->order_list[d1.seq].detqual[d2.seq].value_code.name =
						medication_reply_out->order_list[d1.seq].detqual[d2.seq].oe_field_display_value
		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetMedicationDetails(null)
;  Description: Get Medication Details - brand, generic, therapeutic class, strength, etc.
**************************************************************************/
subroutine GetMedicationDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedicationDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set meds_cnt = size(medication_reply_out->order_list,5)
 	declare cki_id = vc
 	declare ord_mnemonic = vc
 	declare drug_synonym_id = vc
 
	for(i = 1 to meds_cnt)
		; Set Concept CKI
		select into "nl:"
		from orders o
			, order_catalog_synonym ocs
		plan o where o.order_id = medication_reply_out->order_list[i].order_id
		join ocs where ocs.synonym_id = o.synonym_id
			and ocs.concept_cki > " "
		detail
			medication_reply_out->order_list[i].concept_cki = ParseComponents(o.cki,2)
			medication_reply_out->order_list[i].o_cki = o.cki
			cki_id = ParseComponents(ocs.concept_cki,2)
		with nocounter
 
		;Check order_product table
		select into "nl:"
		from orders o
			, encounter e
			, order_product op
			, person p
		plan o where o.order_id = medication_reply_out->order_list[i].order_id
		join e where e.encntr_id = o.encntr_id
		join p where p.person_id = e.person_id
		join op where op.order_id = o.order_id
		detail
			medication_reply_out->order_list[i].rx_get_item_details.item_id = op.item_id
			medication_reply_out->order_list[i].medication_item_id = op.item_id
			medication_reply_out->order_list[i].rx_get_item_details.care_locn_cd = e.loc_nurse_unit_cd
			medication_reply_out->order_list[i].rx_get_item_details.facility_loc_cd = e.loc_facility_cd
			medication_reply_out->order_list[i].rx_get_item_details.birthdate = cnvtdatetime(p.birth_dt_tm)
			medication_reply_out->order_list[i].rx_get_item_details.financial_class_cd = e.financial_class_cd
			if(op.item_id = 0)
				medication_reply_out->order_list[i].tnf_id = op.tnf_id
			endif
		with nocounter
 
		if(medication_reply_out->order_list[i].rx_get_item_details.item_id > 0)
			set iApplication = 380000
			set iTask = 380000
			set iRequest = 380003
 
			set stat = initrec(380003_req)
			set stat = initrec(380003_rep)
 
			set 380003_req->care_locn_cd = medication_reply_out->order_list[i].rx_get_item_details.care_locn_cd
			set 380003_req->pharm_type_cd = dPharmacyTypeCd
			set 380003_req->facility_loc_cd = medication_reply_out->order_list[i].rx_get_item_details.facility_loc_cd
			set stat = alterlist(380003_req->qual,1)
			set 380003_req->qual[1].item_id = medication_reply_out->order_list[i].rx_get_item_details.item_id
			set 380003_req->get_ord_sent_info_ind = 1
			set 380003_req->encounter_type_cd = medication_reply_out->order_list[i].encntr_type_cd
			set 380003_req->birthdate = medication_reply_out->order_list[i].rx_get_item_details.birthdate
			set 380003_req->financial_class_cd = medication_reply_out->order_list[i].rx_get_item_details.financial_class_cd
 
			set stat = tdbexecute(iApplication,iTask,iRequest,"REC",380003_req,"REC",380003_rep)
 
			if(380003_rep->status_data.status = "F")
				call ErrorHandler2("EXECUTE", "F", "MEDICATIONS", "Could not execute request 380003.",
				"9999", build("Could not execute request 380003."), medication_reply_out)
				go to EXIT_SCRIPT
			else
				set medication_reply_out->order_list[i].brand_name = 380003_rep->qual[1].brand_name
				set medication_reply_out->order_list[i].generic_name = 380003_rep->qual[1].generic_name
				set medication_reply_out->order_list[i].strength = cnvtstring(380003_rep->qual[1].strength)
				set medication_reply_out->order_list[i].strength_unit.id = 380003_rep->qual[1].strength_unit_cd
				set medication_reply_out->order_list[i].strength_unit.name = uar_get_code_display(380003_rep->qual[1].strength_unit_cd)
				set medication_reply_out->order_list[i].ndc = 380003_rep->qual[1].ndc
				set medication_reply_out->order_list[i].formulary_status.id = 380003_rep->qual[i].formulary_status_cd
				set medication_reply_out->order_list[i].formulary_status.name =
					uar_get_code_display(380003_rep->qual[i].formulary_status_cd)
			endif
		else
			set check = 0
 
			; Check Med Identifier Table
			select into "nl:"
			from synonym_item_r sir
				,med_identifier mi
			plan sir where sir.synonym_id = medication_reply_out->order_list[i].synonym_id
			join mi where mi.item_id = sir.item_id
			 	and mi.active_ind = 1
				and mi.sequence = 1
			detail
				check = 1
				case(uar_get_code_meaning(mi.med_identifier_type_cd))
					of "BRAND_NAME":
						if(mi.med_product_id = 0)
							medication_reply_out->order_list[i].brand_name = mi.value
						endif
					of "GENERIC_NAME":
						if(mi.med_product_id = 0)
							medication_reply_out->order_list[i].generic_name = mi.value
						endif
					of "NDC": medication_reply_out->order_list[i].ndc = mi.value
				endcase
			with nocounter
 
			if(check = 0 and cki_id > " ")
				; Check against med guide link table
				select into "nl:"
				from mltm_med_guide_link mmgl
				, mltm_ndc_core_description mncd
				, mltm_ndc_main_drug_code mnmdc
				, mltm_product_strength mps
				plan mmgl where (mmgl.brand_description_ident = cki_id
					or mmgl.generic_description_ident = cki_id
					or mmgl.trade_description_ident = cki_id)
				join mncd where mncd.main_multum_drug_code = mmgl.main_multum_drug_code
					and mncd.ndc_code = mmgl.ndc_code
					and mncd.repackaged = "F"
					and mncd.obsolete_date is null
				join mnmdc where mnmdc.main_multum_drug_code = mncd.main_multum_drug_code
				join mps where mps.product_strength_code = mnmdc.product_strength_code
				detail
					check = 1
					medication_reply_out->order_list[i].brand_name = mmgl.brand_description
					medication_reply_out->order_list[i].generic_name = mmgl.primary_description
					medication_reply_out->order_list[i].strength = mps.product_strength_description
					medication_reply_out->order_list[i].ndc = mncd.ndc_formatted
					medication_reply_out->order_list[i].DEA_schedule = mnmdc.csa_schedule
				with nocounter
 			endif
 
			if(check = 0 and cki_id > " " and cnvtreal(cki_id) > 0) ;030 added cnvtreal(cki_id) > 0
				; Brand/Generic based on ordered as mnemonic
				set pos = findstring(" ",medication_reply_out->order_list[i].ordered_as_mnemonic)
				set ord_mnemonic = cnvtlower(substring(1,pos,medication_reply_out->order_list[i].ordered_as_mnemonic))
 
				select into "nl:"
				from  mlld_rxn_map mrm
					, mlld_ndc_main_drug_code mnmdc
					, mlld_ndc_core_description mncd
					, mlld_ndc_brand_name mnbn
					, mltm_product_strength mps
					, med_identifier mi
					, med_identifier mi2
				plan mrm where mrm.drug_synonym_id = cnvtreal(cki_id)
				join mncd where mncd.main_multum_drug_code = mrm.main_multum_drug_code
					and mncd.repackaged = "F"
					and mncd.obsolete_date is null
				join mnbn where mnbn.brand_code = mncd.brand_code
					and cnvtlower(substring(1,pos,mnbn.brand_description)) = ord_mnemonic
				join mnmdc where mnmdc.main_multum_drug_code = mrm.main_multum_drug_code
				join mps where mps.product_strength_code = mnmdc.product_strength_code
				join mi where mi.value = mncd.ndc_formatted
				join mi2 where mi2.item_id = mi.item_id
				order by mncd.ndc_code
				detail
					case(uar_get_code_meaning(mi2.med_identifier_type_cd))
						of "GENERIC_NAME":
							if(mi.med_product_id = 0)
								medication_reply_out->order_list[i].generic_name = mi2.value
							endif
					endcase
					medication_reply_out->order_list[i].brand_name = mnbn.brand_description
					medication_reply_out->order_list[i].strength = mps.product_strength_description
					medication_reply_out->order_list[i].ndc = mncd.ndc_formatted
				with nocounter
			endif
		endif
	endfor
	
	;getting the template_non_formulary NDC
	select into "nl:"
	from (dummyt d with seq = meds_cnt)
		 ,template_nonformulary tn
	plan d
		where medication_reply_out->order_list[d.seq].tnf_id > 0
	join tn
		where tn.tnf_id = medication_reply_out->order_list[d.seq].tnf_id
			and tn.tnf_id > 0
	head d.seq
		if(medication_reply_out->order_list[d.seq].medication_item_id < 1)
			medication_reply_out->order_list[d.seq].medication_item_id = tn.shell_item_id
		endif
		;fills in the tnf ndc 
		if(trim(tn.ndc) > "")
			medication_reply_out->order_list[d.seq].ndc = trim(tn.ndc)
		endif
	with nocounter
			
 
	; Therapeutic Class/Subclass
		select into "nl:"
	    from (dummyt d with seq = meds_cnt)
	    	, mltm_category_drug_xref mcdx
			,mltm_drug_categories c
			,mltm_category_sub_xref mcsx
			,mltm_drug_categories c1
			,mltm_ndc_main_drug_code   mnmdc
			,mltm_product_strength mps
		plan d
		join mcdx where mcdx.drug_identifier = medication_reply_out->order_list[d.seq].concept_cki
		join mnmdc where mcdx.drug_identifier = mnmdc.drug_identifier
		join c where c.multum_category_id = outerjoin(mcdx.multum_category_id)
		join mcsx where mcsx.sub_category_id = outerjoin(c.multum_category_id)
		join c1 where c1.multum_category_id = outerjoin(mcsx.multum_category_id)
		join mps where mps.product_strength_code = mnmdc.product_strength_code
		detail
	 		medication_reply_out->order_list[d.seq]->therapeutic_sub_class = trim(c.category_name,3)  ;12
			medication_reply_out->order_list[d.seq]->therapeutic_class = trim(c1.category_name,3)	   ;12
			medication_reply_out->order_list[d.seq]->DEA_schedule = mnmdc.csa_schedule ;032
			if(medication_reply_out->order_list[d.seq].strength <= " ")
				medication_reply_out->order_list[d.seq].strength = mps.product_strength_description
			endif
		with nocounter
 
	;009 - Get Freqeuncy Type by Frequency Code Value
	select into "nl:"
		fs.frequency_id
	from (dummyt d with seq = value(meds_cnt))
		,frequency_schedule fs
	plan d
	join fs where fs.frequency_id = medication_reply_out->order_list[d.seq]->freq_schedule_id
		and fs.active_ind = 1
		and (fs.activity_type_cd = dPharmacyCd OR fs.activity_type_cd = 0)
	detail
		case(fs.frequency_type)
			of 0: ;not set
				medication_reply_out->order_list[d.seq]->frequency_type = "NOT SET"
			of 1: ;scheduled (e.g. BID)
				medication_reply_out->order_list[d.seq]->frequency_type = "SCHEDULED"
			of 2: ;scheduled (e.g. qDay (M-T-F))
				medication_reply_out->order_list[d.seq]->frequency_type = "SCHEDULED"
			of 3: ;interval (e.g. qWeek)
				medication_reply_out->order_list[d.seq]->frequency_type = "INTERVAL"
			of 4: ;one time only -- (e.g. paramedic)
				medication_reply_out->order_list[d.seq]->frequency_type = "ONE-TIME ONLY"
			of 5: ;unscheduled -- (e.g. FLUSH)
				medication_reply_out->order_list[d.seq]->frequency_type = "UNSCHEDULED"
		endcase
	with nocounter
 
	; Get RxNorm if requested
	if(iIncRxNorm > 0)
		select into "nl:"
		from (dummyt d with seq = meds_cnt)
			,order_catalog_synonym ocs
			,cmt_cross_map ccm
		plan d
		join ocs where ocs.synonym_id = medication_reply_out->order_list[d.seq]->synonym_id	;027
			and ocs.active_ind = 1														;027
		join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki) and ccm.map_type_cd = outerjoin(map_type_cd)
		order by d.seq
		head d.seq
			rxn = 0
		detail
			if(ccm.target_concept_cki > " ")
				rxn = rxn + 1
				stat = alterlist(medication_reply_out->order_list[d.seq]->rx_norm,rxn)
 
				medication_reply_out->order_list[d.seq]->rx_norm[rxn]->code = ParseComponents(ccm.target_concept_cki,2)
				medication_reply_out->order_list[d.seq]->rx_norm[rxn]->code_type = ParseComponents(ccm.target_concept_cki, 1)
				medication_reply_out->order_list[d.seq]->rx_norm[rxn]->term_type = ParseComponents(ccm.target_concept_cki, 1)
			endif
		with nocounter
	endif
 
	; Get Max/Min dose ranges - 029
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 380104
	declare max_dose = f8
	for(i = 1 to meds_cnt)
		if(medication_reply_out->order_list[i].o_cki > " ")
			for(f = 1 to 2)
				set stat = initrec(380104_req)
				set stat = initrec(380104_rep)
 
				select into "nl:"
				from person p
				where p.person_id = medication_reply_out->order_list[i].person_id
				detail
					380104_req->age_in_days = datetimediff(cnvtdatetime(curdate,curtime3),p.birth_dt_tm)
				with nocounter
 
				set stat = 	alterlist(380104_req->qual,1)
				set 380104_req->qual[1].cki = medication_reply_out->order_list[i].o_cki
				set 380104_req->qual[1].type_flag = f ;1 = Single Dose, 2 = Daily Dose
				set stat = tdbexecute(iApplication,iTask,iRequest,"REC",380104_req,"REC",380104_rep)
call echorecord(380104_rep)
				if(380104_rep->status_data.status = "F")
					call ErrorHandler2("EXECUTE", "F", "MEDICATIONS", "Could not retrieve dose range data (380104).",
					"9999", build("Could not retrieve dose range data (380104)."), medication_reply_out)
					go to EXIT_SCRIPT
				else
					if(size(380104_rep->cki_list[1]->dose_range_list,5) > 0)
						select distinct into "nl:"
							dose_range_id = 380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_id
						from (dummyt d with seq = size(380104_rep->cki_list[1]->dose_range_list,5))
						order by dose_range_id
						head report
							x = max_dose
						head dose_range_id
							if(max_dose < 380104_rep->cki_list[1]->dose_range_list[d.seq].max_value)
								max_dose = 380104_rep->cki_list[1]->dose_range_list[d.seq].max_value
 
	 							if(f = 1) ;Single Dose
									medication_reply_out->order_list[i].max_single_dose =
									cnvtstring(380104_rep->cki_list[1]->dose_range_list[d.seq].max_value)
 
									medication_reply_out->order_list[i].max_single_dose_unit.id =
									380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd
 
									medication_reply_out->order_list[i].max_single_dose_unit.name =
									uar_get_code_display(380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd)
 
									medication_reply_out->order_list[i].min_single_dose =
									cnvtstring(380104_rep->cki_list[1]->dose_range_list[d.seq].min_value)
 
									medication_reply_out->order_list[i].min_single_dose_unit.id =
									380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd
 
									medication_reply_out->order_list[i].min_single_dose_unit.name =
									uar_get_code_display(380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd)
								endif
								if(f = 2) ;Daily Dose
									medication_reply_out->order_list[i].max_daily_dose =
									cnvtstring(380104_rep->cki_list[1]->dose_range_list[d.seq].max_value)
 
									medication_reply_out->order_list[i].max_daily_dose_unit.id =
									380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd
 
									medication_reply_out->order_list[i].max_daily_dose_unit.name =
									uar_get_code_display(380104_rep->cki_list[1]->dose_range_list[d.seq].dose_range_unit_cd)
 
		 						endif
							endif
						with nocounter
					endif
				endif
			endfor
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedicationDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderIngredients(null)
;  Description: This will retrieve all order ingredients for an order
**************************************************************************/
subroutine GetOrderIngredients(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderIngredients Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	;flag query and structure for performance
	free record flags
	record flags(
		1 ingred_type_cnt = i4
		1 ingred_type[*]
			2 flag_val = f8
			2 desc = vc
	)
 
	select into "nl:"
	from dm_flags dm
	where dm.table_name = "ORDER_INGREDIENT"
		and dm.column_name = "INGREDIENT_TYPE_FLAG"
 
	order by dm.column_name
	head report
		x = 0
		detail
			x = x + 1
			stat = alterlist(flags->ingred_type,x)
			flags->ingred_type[x].flag_val = dm.flag_value
			flags->ingred_type[x].desc = trim(dm.description,3)
	foot report
		flags->ingred_type_cnt = x
	with nocounter
 
 
	declare pos				= i4  with protect ,noconstant (-1 );019
	declare ingred_cnt 		= i4  with protect ,noconstant (0 )
	set ingred_cnt 			= size(medication_reply_out->order_list, 5)
 
	if(ingred_cnt > 0)
		select  into "nl:"
			o.order_id ,
			oi.order_id ,
			oi.comp_sequence
		from
			(dummyt d with seq = value(ingred_cnt))
			,order_ingredient oi
			,order_product op
			,orders o
			,code_value_event_r cver
	    	,order_catalog_synonym ocs
	    	,cmt_cross_map ccm
		plan d
		join o where o.order_id = medication_reply_out->order_list[d.seq ]->order_id
		join oi	where oi.order_id =  medication_reply_out->order_list[d.seq ]->order_id
			and oi.action_sequence = o.last_ingred_action_sequence
		join cver where cver.parent_cd =  oi.catalog_cd
		join ocs where ocs.synonym_id = oi.synonym_id
	 			and ocs.active_ind = 1
	    join op
			where op.order_id = outerjoin(oi.order_id)
				and op.ingred_sequence = outerjoin(oi.comp_sequence)
				and op.action_sequence = outerjoin(oi.action_sequence)
	  	join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
	  				and ccm.map_type_cd = outerjoin(map_type_cd)
		order by d.seq, oi.action_sequence, oi.comp_sequence
	  	head d.seq
	 		icnt = 0
	 		medication_reply_out->order_list[d.seq].ingred_action_seq = o.last_ingred_action_sequence
		head oi.synonym_id ;;;019
			icnt = icnt + 1
			irx_cnt = 0
 
			stat = alterlist (medication_reply_out->order_list[d.seq]->ingred_list ,icnt)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->item_id = op.item_id
	 		medication_reply_out->order_list[d.seq]->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->synonym_id = oi.synonym_id
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->volume_value = oi.volume
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
			if(oi.strength > 0)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength = cnvtstring(oi.strength)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength_dose = oi.strength
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength_dose_unit_disp = uar_get_code_display(oi.strength_unit)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_dose_unit_disp = uar_get_code_display(oi.strength_unit)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_unit.id = oi.strength_unit
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_unit.name = uar_get_code_display(oi.strength_unit)
			endif
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->freetext_dose = oi.freetext_dose
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->frequency_cd = oi.freq_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->comp_sequence = oi.comp_sequence
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->iv_seq = oi.iv_seq
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->dose_quantity = oi.dose_quantity
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->event_cd = cver.event_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate = oi.normalized_rate
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_disp =
				uar_get_code_display(oi.normalized_rate_unit_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration = oi.concentration
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration_unit_disp =
				uar_get_code_display(oi.concentration_unit_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->include_in_total_volume_flag = oi.include_in_total_volume_flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
 
			;ingredient type flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.id = oi.ingredient_type_flag
			for(i = 1 to flags->ingred_type_cnt)
				if(medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.id = flags->ingred_type[i].flag_val)
					medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.name = flags->ingred_type[i].desc
				endif
			endfor
 
			; RxNorm data
			if(iIncRxNorm > 0)
				if(ccm.target_concept_cki > " ")
					irx_cnt = irx_cnt + 1
					stat = alterlist(medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm,irx_cnt)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->code =
					ParseComponents(ccm.target_concept_cki,2)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->code_type =
					ParseComponents(ccm.target_concept_cki, 1)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->term_type =
					ParseComponents(ccm.target_concept_cki, 1)
				endif
			endif
		with nocounter
 
 
	;getting the ingredient if its a child order
	select  into "nl:"
			o.order_id ,
			oi.order_id ,
			oi.comp_sequence
		from
			(dummyt d with seq = value(ingred_cnt))
			,order_ingredient oi
			,order_product op
			,orders o
			,code_value_event_r cver
	    	,order_catalog_synonym ocs
	    	,cmt_cross_map ccm
		plan d
		join o where o.order_id = medication_reply_out->order_list[d.seq ].parent_order_id
		join oi	where oi.order_id =  o.order_id
			and oi.action_sequence = o.last_ingred_action_sequence
		join cver where cver.parent_cd =  oi.catalog_cd
		join ocs where ocs.synonym_id = oi.synonym_id
	 			and ocs.active_ind = 1
	    join op	where op.order_id = outerjoin(oi.order_id)
					and op.ingred_sequence = outerjoin(oi.comp_sequence)
					and op.action_sequence = outerjoin(oi.action_sequence)
	  	join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki) and ccm.map_type_cd = outerjoin(map_type_cd)
		order by d.seq, oi.action_sequence, oi.comp_sequence
	  	head d.seq
	 		icnt = 0
	 		medication_reply_out->order_list[d.seq].ingred_action_seq = o.last_ingred_action_sequence
		head oi.synonym_id ;;;019
			icnt = icnt + 1
			irx_cnt = 0
 
			stat = alterlist (medication_reply_out->order_list[d.seq]->ingred_list ,icnt)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->item_id = op.item_id
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->synonym_id = oi.synonym_id
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->volume_value = oi.volume
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
			if(oi.strength > 0)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength = cnvtstring(oi.strength)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength_dose = oi.strength
				medication_reply_out->order_list[d.seq]->ingred_list[icnt]->strength_dose_unit_disp = uar_get_code_display(oi.strength_unit)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_dose_unit_disp = uar_get_code_display(oi.strength_unit)
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_unit.id = oi.strength_unit
				medication_reply_out->order_list[d.seq]->ingred_list[icnt].strength_unit.name = uar_get_code_display(oi.strength_unit)
			endif
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->freetext_dose = oi.freetext_dose
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->frequency_cd = oi.freq_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->comp_sequence = oi.comp_sequence
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->iv_seq = oi.iv_seq
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->dose_quantity = oi.dose_quantity
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->event_cd = cver.event_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate = oi.normalized_rate
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_disp =
				uar_get_code_display(oi.normalized_rate_unit_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration = oi.concentration
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->concentration_unit_disp =
				uar_get_code_display(oi.concentration_unit_cd)
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->include_in_total_volume_flag = oi.include_in_total_volume_flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
 
			;ingredient type flag
			medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.id = oi.ingredient_type_flag
			for(i = 1 to flags->ingred_type_cnt)
				if(medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.id = flags->ingred_type[i].flag_val)
					medication_reply_out->order_list[d.seq]->ingred_list[icnt].ingredient_type.name = flags->ingred_type[i].desc
				endif
			endfor
 
			; RxNorm data
			if(iIncRxNorm > 0)
				if(ccm.target_concept_cki > " ")
					irx_cnt = irx_cnt + 1
					stat = alterlist(medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm,irx_cnt)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->code =
					ParseComponents(ccm.target_concept_cki,2)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->code_type =
					ParseComponents(ccm.target_concept_cki, 1)
 
					medication_reply_out->order_list[d.seq]->ingred_list[icnt]->rx_norm[irx_cnt]->term_type =
					ParseComponents(ccm.target_concept_cki, 1)
				endif
			endif
		with nocounter
	endif
 
	;Get Ingredient Strength & NDC
	select into "nl:"
 		from (dummyt d1 with seq = ingred_cnt)
	     	,(dummyt d2 with seq = 1)
	    	,med_identifier mi
	    	,medication_definition md
		plan d1
			where maxrec(d2,size(medication_reply_out->order_list[d1.seq].ingred_list,5))
		join d2
			where medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].item_id > 0
		join mi
			where mi.item_id = medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].item_id
	    		and mi.active_ind = 1
				and mi.med_identifier_type_cd = c_generic_ndc_type_cd
		join md
			where md.item_id = mi.item_id
		order by d1.seq, d2.seq
		head d1.seq
	    	 nocnt = 0
		head d2.seq
			if(size(medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].strength) < 1)
				 medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].strength = trim(md.given_strength)
			endif
		    medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].ndc = trim(mi.value)
		with nocounter
 
 
   	;getting the ndc if it was dispensed
   		select into "nl:"
		from (dummyt d1 with seq = ingred_cnt)
	     	,(dummyt d2 with seq = 1)
	    	,order_catalog_synonym ocs
	    	,dispense_hx dh
	    	,prod_dispense_hx pd
	    	,med_identifier mi
	    plan d1
			where maxrec(d2,size(medication_reply_out->order_list[d1.seq].ingred_list,5))
		join d2
		join ocs
			where ocs.synonym_id = medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].synonym_id
				and (ocs.concept_cki = null
					  or substring(1,6,ocs.concept_cki) != "MULTUM")
		join dh
			where dh.order_id = medication_reply_out->order_list[d1.seq].order_id
				and dh.action_sequence = medication_reply_out->order_list[d1.seq].ingred_action_seq
		join pd
			where pd.dispense_hx_id = dh.dispense_hx_id
				and ocs.item_id = pd.item_id
		join mi
				where mi.med_product_id = pd.med_product_id
				and mi.active_ind = 1
				and mi.med_identifier_type_cd = c_generic_ndc_type_cd
		order by d1.seq,d2.seq
		head d1.seq
			nocnt = 0
		head d2.seq
			medication_reply_out->order_list[d1.seq].ingred_list[d2.seq].ndc = trim(mi.value)
		with nocounter
 
 
 
	; Remove ingredient object if only 1 ingredient exists and MedicationId and IngredientId matches
	for(x = 1 to size(medication_reply_out->order_list,5))
		set ingredSize = size(medication_reply_out->order_list[x].ingred_list,5)
		if(ingredSize = 1)
			if(medication_reply_out->order_list[x].synonym_id = medication_reply_out->order_list[x].ingred_list[1].synonym_id)
				set stat = alterlist(medication_reply_out->order_list[x].ingred_list,0)
			endif
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderIngredients Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
/*************************************************************************
;  Name: GetOrderComments(null)
;  Description: Retrieve the latest order comment
**************************************************************************/
subroutine GetOrderComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare ord_comment_text 	= vc
	declare pharmsig_comment_text = vc
	declare comment_cnt 		= i4  with protect ,noconstant (0 )
	set comment_cnt 			= size(medication_reply_out->order_list, 5)
 
    select into "nl:"
        lt.long_text_id,
        oc.order_id,
        oc.action_sequence,
        oc.comment_type_cd
    from (dummyt d with seq = value(comment_cnt)),
		order_comment oc,
        long_text lt
    plan d
	join oc where oc.order_id = medication_reply_out->order_list[d.seq ]->order_id
        and oc.comment_type_cd in (comment_type_cd, pharmsig_type_cd)
    join lt where lt.long_text_id = oc.long_text_id and
        lt.active_ind = 1
    order by d.seq,oc.order_id, oc.action_sequence
    head d.seq
    	ord_comment_text = ""
    	pharmsig_comment_text = ""
    detail
		if (oc.comment_type_cd = comment_type_cd)
			medication_reply_out->order_list[d.seq]->comment_flag = 1
			ord_comment_text = concat(ord_comment_text, " ", lt.long_text)
		else
			pharmsig_comment_text = concat(pharmsig_comment_text," ",lt.long_text)
		endif
	foot d.seq
		medication_reply_out->order_list[d.seq]->comment_text = trim(ord_comment_text,3)
		medication_reply_out->order_list[d.seq]->pharmsig_comment = trim(pharmsig_comment_text,3)
    with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderComments Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetMedsAdmin(null)
;  Description: This will retrieve Meds Administration information
**************************************************************************/
subroutine GetMedsAdmin(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedsAdmin Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare med_admin_cnt 		= i4  with protect ,noconstant (0)
	declare med_cnt 			= i4  with protect ,noconstant (0)
	set med_admin_cnt 			= size(medication_reply_out->order_list, 5)
 
	select into "nl:"
	from (dummyt d with seq = value(med_admin_cnt))
	,clinical_event ce, ce_med_result cmr, prsnl p
	plan d
	join ce where ce.order_id = medication_reply_out->order_list[d.seq ]->order_id
	join cmr where ce.event_id = outerjoin(cmr.event_id)
	join p where p.person_id = outerjoin(cmr.admin_prov_id)
	head ce.order_id ;014 head cmr.event_id
		med_cnt = 0
	detail
		med_cnt = med_cnt + 1
		stat = alterlist(medication_reply_out->order_list[d.seq]->med_admin_list, med_cnt)
 
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->event_id = cmr.event_id
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->valid_from_dt_tm = cmr.valid_from_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->valid_until_dt_tm = cmr.valid_until_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_note 	= cmr.admin_note
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_prov_id = cmr.admin_prov_id
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_provider = p.name_full_formatted
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_start_dt_tm = cmr.admin_start_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_end_dt_tm = cmr.admin_end_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_route_cd = cmr.admin_route_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_route_disp = uar_get_code_display(cmr.admin_route_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_site_cd = cmr.admin_site_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_site_disp	= uar_get_code_display(cmr.admin_site_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_method_cd = cmr.admin_method_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_method_disp = uar_get_code_display(cmr.admin_method_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_pt_loc_cd = cmr.admin_pt_loc_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_pt_loc_disp = uar_get_code_display(cmr.admin_pt_loc_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->initial_dosage 	= cmr.initial_dosage
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_dosage = cmr.admin_dosage
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->dosage_unit_cd 	= cmr.dosage_unit_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->dosage_unit_disp = uar_get_code_display(cmr.dosage_unit_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->initial_volume 	= cmr.initial_volume
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->total_intake_volume = cmr.total_intake_volume
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->diluent_type_cd = cmr.diluent_type_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->diluent_type_disp = uar_get_code_display(cmr.diluent_type_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->ph_dispense_id = cmr.ph_dispense_id
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infusion_rate = cmr.infusion_rate
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infusion_unit_cd = cmr.infusion_unit_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infusion_unit_disp = uar_get_code_display(cmr.infusion_unit_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infusion_time_cd = cmr.infusion_time_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infusion_time_cd_disp =
			uar_get_code_display(cmr.infusion_time_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->medication_form_cd 	= cmr.medication_form_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->medication_form_disp =
			uar_get_code_display(cmr.medication_form_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->reason_required_flag = cmr.reason_required_flag
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->response_required_flag	= cmr.response_required_flag
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_strength 	= cmr.admin_strength
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_strength_unit_cd 	= cmr.admin_strength_unit_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_strength_unit_disp =
			uar_get_code_display(cmr.admin_strength_unit_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->substance_lot_number = cmr.substance_lot_number
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->substance_exp_dt_tm = cmr.substance_exp_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->substance_manufacturer_cd = cmr.substance_manufacturer_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->substance_manufacturer_disp =
			uar_get_code_display(cmr.substance_manufacturer_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->refusal_cd 	= cmr.refusal_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->refusal_cd_disp = uar_get_code_display(cmr.refusal_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->system_entry_dt_tm 	= cmr.system_entry_dt_tm
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->iv_event_cd = cmr.iv_event_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infused_volume 	= cmr.infused_volume
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infused_volume_unit_cd 	= cmr.infused_volume_unit_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->infused_volume_unit_disp =
			uar_get_code_display(cmr.infused_volume_unit_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->remaining_volume = cmr.remaining_volume
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->remaining_volume_unit_cd = cmr.remaining_volume_unit_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->remaining_volume_unit_disp =
			uar_get_code_display(cmr.remaining_volume_unit_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->synonym_id 	= cmr.synonym_id
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->immunization_type_cd = cmr.immunization_type_cd
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->immunization_type_disp =
			uar_get_code_display(cmr.immunization_type_cd)
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_start_tz 	= cmr.admin_start_tz
		medication_reply_out->order_list[d.seq]->med_admin_list[med_cnt]->admin_end_tz = cmr.admin_end_tz
	foot ce.order_id
		medication_reply_out->order_list[d.seq].med_admin_cnt = med_cnt
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedsAdmin Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseComponents((sConceptCKI = vc , item = i2))
;  Description: Subroutine to parse a ! delimited string
**************************************************************************/
subroutine ParseComponents(sConceptCKI, item)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
	declare return_str1 	= vc with noconstant("")
	declare return_str 	= vc with noconstant("")
 
	if(sConceptCKI > " ")
	;call echo(build("sConceptCKI -->", sConceptCKI))
		while (str != notfnd)
	     	set str =  piece(sConceptCKI,'!',num,notfnd)
	     	if(str != notfnd)
				if((item = 1) and (num = 1))
					;call echo(build("FIRST -->", str))
					set return_str1 = str
					return  (trim(return_str1,3))
				elseif((item = 2) and (num = 2))
					;call echo(build("SECOND -->", str))
					set return_str = str
					return  (trim(return_str,3))
				endif
	     	endif
	      	set num = num + 1
	 	endwhile
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetPharmacyNCPDP(null)
;  Description: Subroutine to return the Default Preferred Pharmacy Object ;025
**************************************************************************/
subroutine GetPharmacyNCPDP(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPharmacyNCPDP Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set count= count + 1
	set stat = alterlist(3202501_req->ids,count)
	set 3202501_req->active_status_flag = 1
	set 3202501_req->transmit_capability_flag = 1
	set 3202501_req->ids[count].id = medication_reply_out->order_list[1].preferred_pharmacy[1].pharmacy_id
 
	set stat =  tdbexecute(3202004,3202004 ,3202501, "REC",3202501_req,"REC",3202501_rep)
 
	if(iDebugFlag)
		call echorecord(3202501_req)
		call echorecord(3202501_rep)
	endif
 
	set rep_size = size(3202501_rep->pharmacies,5)
	if (rep_size > 0)
		set medication_reply_out->order_list[1]->preferred_pharmacy[1].NCPDP =
		3202501_rep->pharmacies[1].pharmacy_contributions[1].contribution_id
 
		set medication_reply_out->order_list[1]->preferred_pharmacy[1].is_integrated_retail =
		3202501_rep->pharmacies[1].pharmacy_contributions[1].specialties.retail_ind
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPharmacyNCPDP Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSchedAdmins(null) = null   ;027
;  Description: Get all of the scheduled administrations tied to the order
**************************************************************************/
subroutine GetSchedAdmins(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSchedAdmins Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
		orderid = medication_reply_out->order_list[d.seq].order_id
		,ta.task_id
		,ta.task_id
		,ta.scheduled_dt_tm
		,od.oe_field_meaning
		,od.oe_field_value
		,od2.oe_field_meaning
		,od2.oe_field_value
		,od3.oe_field_meaning
		,od3.oe_field_value
		,od4.oe_field_meaning
		,od4.oe_field_value
	from (dummyt d with seq = size(medication_reply_out->order_list,5))
	, orders o
	, order_detail od
	, order_detail od2
	, order_detail od3
	, order_detail od4
	, task_activity ta
	plan d
	join o
		where (o.template_order_id = medication_reply_out->order_list[d.seq].order_id
				or o.order_id =  medication_reply_out->order_list[d.seq].order_id)
	join od where od.order_id = outerjoin(o.order_id)
		and od.oe_field_meaning = outerjoin("STRENGTHDOSE")
	join od2 where od2.order_id = outerjoin(o.order_id)
		and od2.oe_field_meaning = outerjoin("VOLUMEDOSE")
	join od3 where od3.order_id = outerjoin(o.order_id)
		and od3.oe_field_meaning = outerjoin("STRENGTHDOSEUNIT")
	join od4 where od4.order_id = outerjoin(o.order_id)
		and od4.oe_field_meaning = outerjoin("VOLUMEDOSEUNIT")
	join ta
		where ta.order_id = outerjoin(o.order_id)
			and ta.active_ind = outerjoin(1)
			;and ta.task_class_cd = c_scheduled_task_class_cd
			and ta.task_type_cd = outerjoin(c_medication_task_type_cd)
 
	order by d.seq
	head d.seq
		x = 0
	detail
 
		x = x + 1
		stat = alterlist(medication_reply_out->order_list[d.seq].scheduled_med_adminstrations,x)
 
 		medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].id = ta.task_id
		medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].status.id = ta.task_status_cd
		medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].status.name =
																		uar_get_code_display(ta.task_status_cd)
		medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].scheduled_date_time =
																								ta.scheduled_dt_tm
 
 
		if(od.oe_field_value > 0)
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose = od.oe_field_value
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose_unit.id = od3.oe_field_value
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose_unit.name =
			uar_get_code_display(od3.oe_field_value)
		else
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose = od2.oe_field_value
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose_unit.id = od4.oe_field_value
			medication_reply_out->order_list[d.seq].scheduled_med_adminstrations[x].dose_unit.name =
			uar_get_code_display(od4.oe_field_value)
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSchedAdmins Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
 /*************************************************************************
;  Name: GetChildMedAdmins(null) = null
;  Description: Get all of the scheduled administrations tied to the order
**************************************************************************/
subroutine GetChildMedAdmins(null)
 
if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetChildMedsAdmins Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
	;declare x = i4  with protect ,noconstant (0)
 
select into "nl:"
from orders o
     ,clinical_event ce
     ,ce_med_result cmr
     ,prsnl p
     ,(dummyt d with seq = size(medication_reply_out->order_list,5))
plan d
	where medication_reply_out->order_list[d.seq]->order_id > 0
join o
	where o.template_order_id = medication_reply_out->order_list[d.seq]->order_id
join ce
	where ce.order_id = o.order_id
join cmr
	where cmr.event_id = ce.event_id
join p
	where p.person_id = outerjoin(cmr.admin_prov_id)
order by d.seq,ce.order_id,cmr.event_id
 
head d.seq
	x = medication_reply_out->order_list[d.seq].med_admin_cnt
 
 
	;head cmr.event_id
	detail
 
		med_admin_size = size(medication_reply_out->order_list[d.seq].med_admin_list,5)
		continue = 0
	    ;checks to see if admin needs to be added
		if(med_admin_size < 1)
			continue = 1
		elseif(ce.order_id != medication_reply_out->order_list[d.seq]->order_id)
			continue = 1
		endif
 
		;adds the medadmin to structure as needed
		if(continue > 0)
			x = x + 1
			stat = alterlist(medication_reply_out->order_list[d.seq].med_admin_list,x)
			;medication_reply_out->order_list[d.seq]->med_admin_list[x]->order_id = ce.order_id
			medication_reply_out->order_list[d.seq]->med_admin_list[x].event_id = ce.event_id
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->valid_from_dt_tm = cmr.valid_from_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->valid_until_dt_tm = cmr.valid_until_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_note 	= cmr.admin_note
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_prov_id = cmr.admin_prov_id
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_provider = p.name_full_formatted
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_start_dt_tm = cmr.admin_start_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_end_dt_tm = cmr.admin_end_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_route_cd = cmr.admin_route_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_route_disp = uar_get_code_display(cmr.admin_route_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_site_cd = cmr.admin_site_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_site_disp	= uar_get_code_display(cmr.admin_site_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_method_cd = cmr.admin_method_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_method_disp = uar_get_code_display(cmr.admin_method_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_pt_loc_cd = cmr.admin_pt_loc_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_pt_loc_disp = uar_get_code_display(cmr.admin_pt_loc_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->initial_dosage 	= cmr.initial_dosage
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_dosage = cmr.admin_dosage
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->dosage_unit_cd 	= cmr.dosage_unit_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->dosage_unit_disp = uar_get_code_display(cmr.dosage_unit_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->initial_volume 	= cmr.initial_volume
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->total_intake_volume = cmr.total_intake_volume
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->diluent_type_cd = cmr.diluent_type_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->diluent_type_disp = uar_get_code_display(cmr.diluent_type_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->ph_dispense_id = cmr.ph_dispense_id
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infusion_rate = cmr.infusion_rate
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infusion_unit_cd = cmr.infusion_unit_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infusion_unit_disp = uar_get_code_display(cmr.infusion_unit_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infusion_time_cd = cmr.infusion_time_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infusion_time_cd_disp = uar_get_code_display(cmr.infusion_time_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->medication_form_cd 	= cmr.medication_form_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->medication_form_disp =uar_get_code_display(cmr.medication_form_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->reason_required_flag = cmr.reason_required_flag
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->response_required_flag	= cmr.response_required_flag
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_strength 	= cmr.admin_strength
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_strength_unit_cd 	= cmr.admin_strength_unit_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_strength_unit_disp =
				uar_get_code_display(cmr.admin_strength_unit_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->substance_lot_number = cmr.substance_lot_number
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->substance_exp_dt_tm = cmr.substance_exp_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->substance_manufacturer_cd = cmr.substance_manufacturer_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->substance_manufacturer_disp =
				uar_get_code_display(cmr.substance_manufacturer_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->refusal_cd 	= cmr.refusal_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->refusal_cd_disp = uar_get_code_display(cmr.refusal_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->system_entry_dt_tm 	= cmr.system_entry_dt_tm
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->iv_event_cd = cmr.iv_event_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infused_volume 	= cmr.infused_volume
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infused_volume_unit_cd 	= cmr.infused_volume_unit_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->infused_volume_unit_disp =
				uar_get_code_display(cmr.infused_volume_unit_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->remaining_volume = cmr.remaining_volume
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->remaining_volume_unit_cd = cmr.remaining_volume_unit_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->remaining_volume_unit_disp =
				uar_get_code_display(cmr.remaining_volume_unit_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->synonym_id 	= cmr.synonym_id
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->immunization_type_cd = cmr.immunization_type_cd
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->immunization_type_disp =
				uar_get_code_display(cmr.immunization_type_cd)
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_start_tz 	= cmr.admin_start_tz
			medication_reply_out->order_list[d.seq]->med_admin_list[x]->admin_end_tz = cmr.admin_end_tz
 
		endif
with nocounter
 
if(iDebugFlag > 0)
		call echo(concat("GetChildMedsAdmins Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ; end Sub
 
/*************************************************************************
;  Name: GetOrderReviewDetails(null) = null
;  Description: Order Review details
**************************************************************************/
subroutine GetOrderReviewDetails(null)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderReviewDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d with seq = size(medication_reply_out->order_list,5))
		, order_review o
		,dm_flags dstat
		,dm_flags dtype
		, prsnl p
	plan d
	join o where o.order_id = medication_reply_out->order_list[d.seq].order_id
	join dstat where dstat.table_name = "ORDER_REVIEW"
		and dstat.column_name = "REVIEWED_STATUS_FLAG"
		and dstat.flag_value = o.reviewed_status_flag
	join dtype where dtype.table_name = "ORDER_REVIEW"
		and dtype.column_name = "REVIEW_TYPE_FLAG"
		and dtype.flag_value = o.review_type_flag
	join p where p.person_id = outerjoin(o.review_personnel_id)
	order by d.seq, o.action_sequence
	head d.seq
		x = 0
	detail
		x = x + 1
		stat = alterlist(medication_reply_out->order_list[d.seq].order_review,x)
 
		medication_reply_out->order_list[d.seq].order_review[x].review_status.id = o.reviewed_status_flag
		medication_reply_out->order_list[d.seq].order_review[x].review_status.name = dstat.description
		medication_reply_out->order_list[d.seq].order_review[x].review_type.id = o.review_type_flag
		medication_reply_out->order_list[d.seq].order_review[x].review_type.name = dtype.description
		medication_reply_out->order_list[d.seq].order_review[x].reviewed_by.provider_id = o.review_personnel_id
		medication_reply_out->order_list[d.seq].order_review[x].reviewed_by.provider_name = p.name_full_formatted
		medication_reply_out->order_list[d.seq].order_review[x].reviewed_date_time = o.review_dt_tm
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderReviewDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetTaskClass(null) = null
;  Description: Task Class
**************************************************************************/
subroutine GetTaskClass(null)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskClass Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d with seq = size(medication_reply_out->order_list,5))
	    ,clinical_event ce
	    ,task_activity ta
 	plan d
 		where medication_reply_out->order_list[d.seq].order_id > 0
 	join ta
 		where ta.order_id = medication_reply_out->order_list[d.seq].order_id
 			and ta.task_type_cd = c_medication_task_type_cd
 			and ta.active_ind = 1
 	join ce
 		where ce.parent_event_id = ta.event_id
 	order by d.seq
 	head d.seq
 		medication_reply_out->order_list[d.seq].task_class.description = trim(uar_get_code_description(ta.task_class_cd))
 		medication_reply_out->order_list[d.seq].task_class.id = ta.task_class_cd
 		medication_reply_out->order_list[d.seq].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskClass Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetTasks(null) = null
;  Description: Tasks associated with order
**************************************************************************/
subroutine GetTasks(null)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTasks Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d with seq = size(medication_reply_out->order_list,5))
	    ,task_activity ta
	plan d
		where medication_reply_out->order_list[d.seq].order_id > 0
 	join ta
 		where ta.order_id = medication_reply_out->order_list[d.seq].order_id
 			and ta.active_ind = 1
 
 	order by d.seq, ta.task_id
 	head d.seq
 		x = 0
 		head ta.task_id
 			x = x + 1
 			stat = alterlist(medication_reply_out->order_list[d.seq].tasks,x)
 			medication_reply_out->order_list[d.seq].tasks[x].task_id= ta.task_id
			medication_reply_out->order_list[d.seq].tasks[x].task_class.id = ta.task_class_cd
			medication_reply_out->order_list[d.seq].tasks[x].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
			medication_reply_out->order_list[d.seq].tasks[x].task_type.id = ta.task_type_cd
			medication_reply_out->order_list[d.seq].tasks[x].task_type.name = trim(uar_get_code_display(ta.task_type_cd))
			medication_reply_out->order_list[d.seq].tasks[x].task_status.id = ta.task_status_cd
			medication_reply_out->order_list[d.seq].tasks[x].task_status.name = trim(uar_get_code_display(ta.task_status_cd))
 	with nocounter
 
 	if(iDebugFlag > 0)
		call echo(concat("GetTasks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
end go
set trace notranslatelock go
