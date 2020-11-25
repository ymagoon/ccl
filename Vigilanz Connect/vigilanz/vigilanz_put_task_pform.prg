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
      Source file name:  	snsro_put_task_pform.prg
      Object name:       	vigilanz_put_task_pform
      Program purpose:    	put task tied and fills out the powerform associated with the task
      Tables read:      	MANY
      Tables updated:
      Executing from:   	mPages Discern Web Service
      Special Notes:      	NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                      				*
*********************************************************************************
* Mod 	Date     	Engineer             	Comment                            	*
* --- 	-------- 	-------------------- 	-----------------------------------	*
 
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_put_task_pform go
create program vigilanz_put_task_pform
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Username" = ""
	, "TaskId" = ""
	, "Json Args" = ""
	, "Debug Flag" = ""
 
with OUTDEV, username, task_id, json, debug_flag
 
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;DATA STRUCTURES
**************************************************************************/
 
free record arglist
record arglist(
	1 FieldInputs[*]
		2 FieldId = vc
		2 CodedValueIds[*] = vc
		2 TextValues[*] = vc
)
 
;500415	orm_get_order_by_id
free record 500415_req
record 500415_req (
  1 order_id = f8
)
 
free record 500415_rep
record 500415_rep (
   1 provider_id = f8
   1 encntr_id = f8
   1 catalog_cd = f8
   1 catalog_type_cd = f8
   1 med_type_cd = f8
   1 oe_format_id = f8
   1 activity_type_cd = f8
   1 current_start_dt_tm = dq8
   1 current_start_tz = i4
   1 orig_order_dt_tm = dq8
   1 orig_order_tz = i4
   1 freq_type_flag = i2
   1 hna_order_mnemonic = vc
   1 ordered_as_mnemonic = vc
   1 valid_dose_dt_tm = dq8
   1 person_id = f8
   1 order_status_cd = f8
   1 order_status_disp = vc
   1 clinical_display_line = vc
   1 dcp_clin_cat_cd = f8
   1 dept_status_cd = f8
   1 ref_text_mask = i4
   1 order_comment_ind = i2
   1 ingredient_ind = i2
   1 template_order_flag = i2
   1 template_order_id = f8
   1 cs_flag = i2
   1 cs_order_id = f8
   1 orderable_type_flag = i2
   1 cki = vc
   1 orig_ord_as_flag = i2
   1 synonym_id = f8
   1 prn_ind = i2
   1 rx_mask = i4
   1 comment_type_mask = i4
   1 stop_type_cd = f8
   1 projected_stop_dt_tm = dq8
   1 order_mnemonic = vc
   1 last_updt_cnt = i4
   1 additive_count_for_ivpb = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;3200310 msvc_svr_get_clinctx
free record 3200310_req
record 3200310_req (
  1 patient_id = f8
  1 person_prsnl_reltn_cd = f8
  1 encounter_id = f8
  1 load
    2 patient = i2
    2 encounter = i2
    2 allergy = i2
    2 clinical_fact = i2
    2 clinical_event
      3 event_set_names [*]
        4 name = vc
      3 statuses [*]
        4 code = f8
    2 consent
      3 type_cd = f8
    2 diagnosis = i2
    2 auth_encounter = i2
    2 patient_relationship = i2
    2 encounter_relationship = i2
    2 relationship_by_types
      3 encntr_reltn_types [*]
        4 encntr_reltn_type_cd = f8
      3 patient_reltn_types [*]
        4 patient_reltn_type_cd = f8
    2 patient_details
      3 basic_info = i2
      3 pcp = i2
      3 name = i2
      3 aliases = i2
      3 secure_email = i2
      3 addresses = i2
      3 phones = i2
    2 encounter_details
      3 basic_info = i2
      3 aliases = i2
      3 location = i2
      3 timezone = i2
)
free record 3200310_rep
record 3200310_rep (
  1 patient
    2 patient_id = f8
    2 name
      3 name_full_formatted = vc
      3 prefix = vc
      3 suffix = vc
      3 degree = vc
      3 title = vc
      3 first = vc
      3 middle = vc
      3 last = vc
    2 birth_dt_tm = dq8
    2 birth_dt_cd = f8
    2 birth_tz = i4
    2 gest_age_at_birth = i4
    2 sex_cd = f8
    2 aliases [*]
      3 alias = vc
      3 type_cd = f8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
      3 alias_pool_cd = f8
    2 species_cd = f8
    2 language_cd = f8
    2 race_cd = f8
    2 ethnic_grp_cd = f8
    2 deceased_dt_tm = dq8
    2 deceased_tz = i4
    2 pcp_name = vc
    2 formatted_home_phone = vc
    2 formatted_mobile_phone = vc
    2 formatted_home_addr_single_line = vc
    2 deceased_cd = f8
    2 cause_of_death = vc
    2 secure_emails [*]
      3 email_address = vc
    2 addresses [*]
      3 type_cd = f8
      3 street = vc
      3 street2 = vc
      3 street3 = vc
      3 street4 = vc
      3 city = vc
      3 state = vc
      3 state_cd = f8
      3 postal_code = vc
    2 phones [*]
      3 extension = vc
      3 number = vc
      3 format_cd = f8
      3 type_cd = f8
    2 races [*]
      3 race_cd = f8
  1 encounter
    2 encounter_id = f8
    2 aliases [*]
      3 alias = vc
      3 type_cd = f8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
      3 alias_pool_cd = f8
    2 reg_dt_tm = dq8
    2 arrive_dt_tm = dq8
    2 disch_dt_tm = dq8
    2 med_service_cd = f8
    2 contributor_system_cd = f8
    2 encntr_type_cd = f8
    2 encntr_type_class_cd = f8
    2 reason_for_visit = vc
    2 isolation_cd = f8
    2 diet_cd = f8
    2 encntr_status_cd = f8
    2 encntr_financial_id = f8
    2 organization_id = f8
    2 est_arrive_dt_dm = dq8
    2 est_disch_dt_tm = dq8
    2 facility_id = f8
    2 building_id = f8
    2 nurse_unit_id = f8
    2 room_id = f8
    2 bed_id = f8
    2 temp_id = f8
    2 encounter_tz = i4
    2 org_security_ind = i2
    2 financial_class_cd = f8
  1 allergy
    2 allergies_filtered_ind = i2
    2 resolved_allergies_filtered_ind = i2
    2 allergies [*]
      3 allergy_display = vc
      3 severity_cd = f8
      3 freetext_ind = i2
  1 clinical_fact
    2 abo_cd = f8
    2 rh_cd = f8
  1 clinical_events
    2 results [*]
      3 event_id = f8
      3 person_id = f8
      3 encounter_id = f8
      3 event_cd = f8
      3 effective_date = dq8
      3 effective_date_tz = i4
      3 status_cd = f8
      3 version = i4
      3 info_source_cd = f8
      3 contributor_system_cd = f8
      3 has_comments_ind = i2
      3 not_done_reason_cd = f8
      3 not_done_reason_ft = vc
      3 entry_mode_cd = f8
      3 task_assay_cd = f8
      3 task_assay_version = vc
      3 reference_id = vc
      3 update_date = dq8
      3 service_resource_cd = f8
      3 comments [*]
        4 comment_id = f8
        4 comment_text = gvc
        4 comment_format_cd = f8
        4 comment_author_id = f8
        4 comment_date = dq8
        4 comment_date_tz = i4
        4 chartable_ind = i2
        4 comment_type_cd = f8
      3 orders [*]
        4 order_id = f8
      3 action_requests [*]
        4 action_request_id = f8
        4 action_request_type_cd = f8
        4 action_request_status_cd = f8
        4 action_request_comment = vc
        4 request_date = dq8
        4 request_date_tz = i4
        4 action_date = dq8
        4 action_date_tz = i4
        4 requestor_id = f8
        4 requestor_ft = vc
        4 requestee_id = f8
        4 requestee_ft = vc
        4 modifiers [*]
          5 modifier_type_cd = f8
      3 participations [*]
        4 participation_id = f8
        4 participation_type_cd = f8
        4 participation_comment = vc
        4 participation_date = dq8
        4 participation_date_tz = i4
        4 participation_prsnl_id = f8
        4 participation_prsnl_ft = vc
        4 modifiers [*]
          5 modifier_type_cd = f8
      3 clinical_event_classification = vc
      3 blood_product [*]
        4 product_nbr = vc
        4 product_cd = f8
        4 product_status_cd = f8
        4 abo_cd = f8
        4 rh_cd = f8
        4 volume [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 quantity [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 strength [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 antigens [*]
          5 type_cd = f8
          5 sequence = i4
        4 measurement [*]
          5 measurement_classification = vc
          5 accession_nbr = vc
          5 interpretation_cd = f8
          5 specimen_collection [*]
            6 collect_date = dq8
            6 collect_date_tz = i4
            6 collect_method_cd = f8
            6 collect_performer_id = f8
            6 collect_location_id = f8
            6 specimen
              7 specimen_id = f8
              7 specimen_source_cd = f8
              7 specimen_source_ft = vc
              7 specimen_body_site_cd = f8
            6 received_date = dq8
            6 received_date_tz = i4
          5 string_value [*]
            6 value = vc
            6 unit_cd = f8
            6 numeric_value [*]
              7 number = f8
              7 unit_cd = f8
              7 modifier_cd = f8
              7 digits_past_decimal = i4
          5 quantity_value [*]
            6 number = f8
            6 unit_cd = f8
            6 modifier_cd = f8
            6 digits_past_decimal = i4
          5 code_value [*]
            6 other_response = vc
            6 values [*]
              7 value_nomenclature_id = f8
              7 value_cd = f8
              7 unit_cd = f8
              7 group = i4
              7 code_value_sequence = i4
            6 nomen_string_flag = i2
          5 date_value [*]
            6 value_date = dq8
            6 value_date_tz = i4
            6 date_only_ind = i2
          5 reference_range [*]
            6 critical_low
              7 number = f8
              7 unit_cd = f8
            6 normal_low
              7 number = f8
              7 unit_cd = f8
            6 normal_high
              7 number = f8
              7 unit_cd = f8
            6 critical_high
              7 number = f8
              7 unit_cd = f8
            6 critical_low_text = vc
            6 normal_low_text = vc
            6 normal_high_text = vc
            6 critical_high_text = vc
            6 critical_low_ind = i2
            6 normal_low_ind = i2
            6 normal_high_ind = i2
            6 critical_high_ind = i2
          5 group_label [*]
            6 id = f8
            6 name = vc
            6 status_cd = f8
            6 sequence = i4
            6 performer_id = f8
            6 comments [*]
              7 comment_id = f8
              7 comment_text = gvc
              7 comment_format_cd = f8
              7 comment_author_id = f8
              7 comment_date = dq8
              7 comment_date_tz = i4
              7 chartable_ind = i2
              7 comment_type_cd = f8
          5 encapsulated_value [*]
            6 text = gvc
            6 media_type_cd = f8
        4 attributes [*]
          5 type_cd = f8
          5 sequence = i4
      3 document_container [*]
        4 doc_container_title = vc
        4 doc_container_published_ind = i2
        4 doc_container_viewable_ind = i2
        4 document
          5 result
            6 event_id = f8
            6 person_id = f8
            6 encounter_id = f8
            6 event_cd = f8
            6 effective_date = dq8
            6 effective_date_tz = i4
            6 status_cd = f8
            6 version = i4
            6 info_source_cd = f8
            6 contributor_system_cd = f8
            6 has_comments_ind = i2
            6 not_done_reason_cd = f8
            6 not_done_reason_ft = vc
            6 entry_mode_cd = f8
            6 task_assay_cd = f8
            6 task_assay_version = vc
            6 reference_id = vc
            6 update_date = dq8
            6 service_resource_cd = f8
            6 comments [*]
              7 comment_id = f8
              7 comment_text = gvc
              7 comment_format_cd = f8
              7 comment_author_id = f8
              7 comment_date = dq8
              7 comment_date_tz = i4
              7 chartable_ind = i2
              7 comment_type_cd = f8
            6 orders [*]
              7 order_id = f8
          5 action_requests [*]
            6 action_request_id = f8
            6 action_request_type_cd = f8
            6 action_request_status_cd = f8
            6 action_request_comment = vc
            6 request_date = dq8
            6 request_date_tz = i4
            6 action_date = dq8
            6 action_date_tz = i4
            6 requestor_id = f8
            6 requestor_ft = vc
            6 requestee_id = f8
            6 requestee_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 document_title = vc
          5 document_published_ind = i2
          5 document_viewable_ind = i2
          5 document_sequence = vc
          5 documentation_date = dq8
          5 documentation_date_tz = i4
          5 signature_line_text = gvc
          5 signature_line_type_cd = f8
          5 contributions [*]
            6 clinical_event
              7 event_id = f8
              7 encounter_id = f8
              7 has_comments_ind = i2
              7 not_done_reason_cd = f8
              7 not_done_reason_ft = vc
              7 entry_mode_cd = f8
              7 task_assay_cd = f8
              7 task_assay_version = vc
              7 reference_id = vc
              7 update_date = dq8
              7 service_resource_cd = f8
              7 orders [*]
                8 order_id = f8
            6 action_requests [*]
              7 action_request_id = f8
              7 action_request_type_cd = f8
              7 action_request_status_cd = f8
              7 action_request_comment = vc
              7 request_date = dq8
              7 request_date_tz = i4
              7 action_date = dq8
              7 action_date_tz = i4
              7 requestor_id = f8
              7 requestor_ft = vc
              7 requestee_id = f8
              7 requestee_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 participations [*]
              7 participation_id = f8
              7 participation_type_cd = f8
              7 participation_comment = vc
              7 participation_date = dq8
              7 participation_date_tz = i4
              7 participation_prsnl_id = f8
              7 participation_prsnl_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 sections [*]
              7 result
                8 event_id = f8
                8 person_id = f8
                8 encounter_id = f8
                8 event_cd = f8
                8 effective_date = dq8
                8 effective_date_tz = i4
                8 status_cd = f8
                8 version = i4
                8 info_source_cd = f8
                8 contributor_system_cd = f8
                8 has_comments_ind = i2
                8 not_done_reason_cd = f8
                8 not_done_reason_ft = vc
                8 entry_mode_cd = f8
                8 task_assay_cd = f8
                8 task_assay_version = vc
                8 reference_id = vc
                8 update_date = dq8
                8 service_resource_cd = f8
                8 comments [*]
                  9 comment_id = f8
                  9 comment_text = gvc
                  9 comment_format_cd = f8
                  9 comment_author_id = f8
                  9 comment_date = dq8
                  9 comment_date_tz = i4
                  9 chartable_ind = i2
                  9 comment_type_cd = f8
                8 orders [*]
                  9 order_id = f8
              7 action_requests [*]
                8 action_request_id = f8
                8 action_request_type_cd = f8
                8 action_request_status_cd = f8
                8 action_request_comment = vc
                8 request_date = dq8
                8 request_date_tz = i4
                8 action_date = dq8
                8 action_date_tz = i4
                8 requestor_id = f8
                8 requestor_ft = vc
                8 requestee_id = f8
                8 requestee_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 participations [*]
                8 participation_id = f8
                8 participation_type_cd = f8
                8 participation_comment = vc
                8 participation_date = dq8
                8 participation_date_tz = i4
                8 participation_prsnl_id = f8
                8 participation_prsnl_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 section_title = vc
              7 section_published_ind = i2
              7 section_viewable_ind = i2
              7 section_sequence = vc
              7 documentation_date = dq8
              7 documentation_date_tz = i4
              7 text_bodies [*]
                8 text_storage_cd = f8
                8 text_format_cd = f8
                8 text_body = gvc
                8 location_handle = vc
              7 signature_line_text = gvc
              7 signature_line_type_cd = f8
      3 measurement [*]
        4 measurement_classification = vc
        4 accession_nbr = vc
        4 interpretation_cd = f8
        4 specimen_collection [*]
          5 collect_date = dq8
          5 collect_date_tz = i4
          5 collect_method_cd = f8
          5 collect_performer_id = f8
          5 collect_location_id = f8
          5 specimen
            6 specimen_id = f8
            6 specimen_source_cd = f8
            6 specimen_source_ft = vc
            6 specimen_body_site_cd = f8
          5 received_date = dq8
          5 received_date_tz = i4
        4 string_value [*]
          5 value = vc
          5 unit_cd = f8
          5 numeric_value [*]
            6 number = f8
            6 unit_cd = f8
            6 modifier_cd = f8
            6 digits_past_decimal = i4
        4 quantity_value [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 code_value [*]
          5 other_response = vc
          5 values [*]
            6 value_nomenclature_id = f8
            6 value_cd = f8
            6 unit_cd = f8
            6 group = i4
            6 code_value_sequence = i4
          5 nomen_string_flag = i2
        4 date_value [*]
          5 value_date = dq8
          5 value_date_tz = i4
          5 date_only_ind = i2
        4 reference_range [*]
          5 critical_low
            6 number = f8
            6 unit_cd = f8
          5 normal_low
            6 number = f8
            6 unit_cd = f8
          5 normal_high
            6 number = f8
            6 unit_cd = f8
          5 critical_high
            6 number = f8
            6 unit_cd = f8
          5 critical_low_text = vc
          5 normal_low_text = vc
          5 normal_high_text = vc
          5 critical_high_text = vc
          5 critical_low_ind = i2
          5 normal_low_ind = i2
          5 normal_high_ind = i2
          5 critical_high_ind = i2
        4 group_label [*]
          5 id = f8
          5 name = vc
          5 status_cd = f8
          5 sequence = i4
          5 performer_id = f8
          5 comments [*]
            6 comment_id = f8
            6 comment_text = gvc
            6 comment_format_cd = f8
            6 comment_author_id = f8
            6 comment_date = dq8
            6 comment_date_tz = i4
            6 chartable_ind = i2
            6 comment_type_cd = f8
        4 encapsulated_value [*]
          5 text = gvc
          5 media_type_cd = f8
      3 medication_administration [*]
        4 route_cd = f8
        4 site_cd = f8
        4 refusal_reason_cd = f8
        4 dose
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 strength
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 substance
          5 manufacturer = vc
          5 lot = vc
          5 expiration_date = dq8
        4 admin_note = vc
        4 admin_prov_id = f8
        4 event_id = f8
        4 not_done_ind = i2
        4 not_given_ind = i2
      3 microbiology [*]
        4 microbiology_accession_nbr = vc
        4 microbiology_interpretation_cd = f8
        4 specimen_collection
          5 collect_date = dq8
          5 collect_date_tz = i4
          5 collect_method_cd = f8
          5 collect_performer_id = f8
          5 collect_location_id = f8
          5 specimen
            6 specimen_id = f8
            6 specimen_source_cd = f8
            6 specimen_source_ft = vc
            6 specimen_body_site_cd = f8
          5 received_date = dq8
          5 received_date_tz = i4
        4 isolate_workups [*]
          5 org_occurrence_nbr = vc
          5 organism_cd = f8
          5 organism_type_cd = f8
          5 isolate_workup_sequence = i4
          5 tests [*]
            6 methodology_cd = f8
            6 test_sequence = i4
            6 panels [*]
              7 panel_cd = f8
              7 panel_sequence = i4
              7 antibiotic_results [*]
                8 antibiotic_cd = f8
                8 susceptibility
                  9 susceptibility_id = f8
                  9 susceptibility_type_cd = f8
                  9 susceptibility_status_cd = f8
                  9 susceptibility_prsnl_id = f8
                  9 susceptibility_date = dq8
                  9 susceptibility_date_tz = i4
                  9 dilution_value_cd = f8
                  9 susceptibility_value
                    10 number = f8
                    10 unit_cd = f8
                    10 modifier_cd = f8
                    10 digits_past_decimal = i4
                  9 susceptibility_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                  9 freetext_value = vc
                8 interpretations [*]
                  9 interpretation_id = f8
                  9 interpretation_type_cd = f8
                  9 interpretation_status_cd = f8
                  9 interpretation_prsnl_id = f8
                  9 interpretation_date = dq8
                  9 interpretation_date_tz = i4
                  9 interpretation_cd = f8
                  9 interpretation_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                8 susceptibilities [*]
                  9 susceptibility_id = f8
                  9 susceptibility_type_cd = f8
                  9 susceptibility_status_cd = f8
                  9 susceptibility_prsnl_id = f8
                  9 susceptibility_date = dq8
                  9 susceptibility_date_tz = i4
                  9 dilution_value_cd = f8
                  9 susceptibility_value
                    10 number = f8
                    10 unit_cd = f8
                    10 modifier_cd = f8
                    10 digits_past_decimal = i4
                  9 susceptibility_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                  9 freetext_value = vc
        4 reports [*]
          5 doc_id = f8
          5 doc_published_ind = i2
          5 doc_date = dq8
          5 doc_date_tz = i4
          5 doc_status_cd = f8
          5 doc_text = gvc
          5 doc_format_cd = f8
          5 doc_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 event_cd = f8
          5 isolate_workups [*]
            6 org_occurrence_nbr = vc
            6 organism_cd = f8
            6 organism_type_cd = f8
            6 isolate_workup_sequence = i4
            6 tests [*]
              7 methodology_cd = f8
              7 test_sequence = i4
              7 panels [*]
                8 panel_cd = f8
                8 panel_sequence = i4
                8 antibiotic_results [*]
                  9 antibiotic_cd = f8
                  9 susceptibility
                    10 susceptibility_id = f8
                    10 susceptibility_type_cd = f8
                    10 susceptibility_status_cd = f8
                    10 susceptibility_prsnl_id = f8
                    10 susceptibility_date = dq8
                    10 susceptibility_date_tz = i4
                    10 dilution_value_cd = f8
                    10 susceptibility_value
                      11 number = f8
                      11 unit_cd = f8
                      11 modifier_cd = f8
                      11 digits_past_decimal = i4
                    10 susceptibility_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                    10 freetext_value = vc
                  9 interpretations [*]
                    10 interpretation_id = f8
                    10 interpretation_type_cd = f8
                    10 interpretation_status_cd = f8
                    10 interpretation_prsnl_id = f8
                    10 interpretation_date = dq8
                    10 interpretation_date_tz = i4
                    10 interpretation_cd = f8
                    10 interpretation_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                  9 susceptibilities [*]
                    10 susceptibility_id = f8
                    10 susceptibility_type_cd = f8
                    10 susceptibility_status_cd = f8
                    10 susceptibility_prsnl_id = f8
                    10 susceptibility_date = dq8
                    10 susceptibility_date_tz = i4
                    10 dilution_value_cd = f8
                    10 susceptibility_value
                      11 number = f8
                      11 unit_cd = f8
                      11 modifier_cd = f8
                      11 digits_past_decimal = i4
                    10 susceptibility_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                    10 freetext_value = vc
        4 stains [*]
          5 doc_id = f8
          5 doc_published_ind = i2
          5 doc_date = dq8
          5 doc_date_tz = i4
          5 doc_status_cd = f8
          5 doc_text = gvc
          5 doc_format_cd = f8
          5 doc_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 event_cd = f8
        4 start_date = dq8
        4 start_date_tz = i4
      3 procedure [*]
        4 document_containers [*]
          5 doc_container_title = vc
          5 doc_container_published_ind = i2
          5 doc_container_viewable_ind = i2
          5 document
            6 result
              7 event_id = f8
              7 person_id = f8
              7 encounter_id = f8
              7 event_cd = f8
              7 effective_date = dq8
              7 effective_date_tz = i4
              7 status_cd = f8
              7 version = i4
              7 info_source_cd = f8
              7 contributor_system_cd = f8
              7 has_comments_ind = i2
              7 not_done_reason_cd = f8
              7 not_done_reason_ft = vc
              7 entry_mode_cd = f8
              7 task_assay_cd = f8
              7 task_assay_version = vc
              7 reference_id = vc
              7 update_date = dq8
              7 service_resource_cd = f8
              7 comments [*]
                8 comment_id = f8
                8 comment_text = gvc
                8 comment_format_cd = f8
                8 comment_author_id = f8
                8 comment_date = dq8
                8 comment_date_tz = i4
                8 chartable_ind = i2
                8 comment_type_cd = f8
              7 orders [*]
                8 order_id = f8
            6 action_requests [*]
              7 action_request_id = f8
              7 action_request_type_cd = f8
              7 action_request_status_cd = f8
              7 action_request_comment = vc
              7 request_date = dq8
              7 request_date_tz = i4
              7 action_date = dq8
              7 action_date_tz = i4
              7 requestor_id = f8
              7 requestor_ft = vc
              7 requestee_id = f8
              7 requestee_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 participations [*]
              7 participation_id = f8
              7 participation_type_cd = f8
              7 participation_comment = vc
              7 participation_date = dq8
              7 participation_date_tz = i4
              7 participation_prsnl_id = f8
              7 participation_prsnl_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 document_title = vc
            6 document_published_ind = i2
            6 document_viewable_ind = i2
            6 document_sequence = vc
            6 documentation_date = dq8
            6 documentation_date_tz = i4
            6 signature_line_text = gvc
            6 signature_line_type_cd = f8
            6 contributions [*]
              7 clinical_event
                8 event_id = f8
                8 encounter_id = f8
                8 has_comments_ind = i2
                8 not_done_reason_cd = f8
                8 not_done_reason_ft = vc
                8 entry_mode_cd = f8
                8 task_assay_cd = f8
                8 task_assay_version = vc
                8 reference_id = vc
                8 update_date = dq8
                8 service_resource_cd = f8
                8 orders [*]
                  9 order_id = f8
              7 action_requests [*]
                8 action_request_id = f8
                8 action_request_type_cd = f8
                8 action_request_status_cd = f8
                8 action_request_comment = vc
                8 request_date = dq8
                8 request_date_tz = i4
                8 action_date = dq8
                8 action_date_tz = i4
                8 requestor_id = f8
                8 requestor_ft = vc
                8 requestee_id = f8
                8 requestee_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 participations [*]
                8 participation_id = f8
                8 participation_type_cd = f8
                8 participation_comment = vc
                8 participation_date = dq8
                8 participation_date_tz = i4
                8 participation_prsnl_id = f8
                8 participation_prsnl_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 sections [*]
                8 result
                  9 event_id = f8
                  9 person_id = f8
                  9 encounter_id = f8
                  9 event_cd = f8
                  9 effective_date = dq8
                  9 effective_date_tz = i4
                  9 status_cd = f8
                  9 version = i4
                  9 info_source_cd = f8
                  9 contributor_system_cd = f8
                  9 has_comments_ind = i2
                  9 not_done_reason_cd = f8
                  9 not_done_reason_ft = vc
                  9 entry_mode_cd = f8
                  9 task_assay_cd = f8
                  9 task_assay_version = vc
                  9 reference_id = vc
                  9 update_date = dq8
                  9 service_resource_cd = f8
                  9 comments [*]
                    10 comment_id = f8
                    10 comment_text = gvc
                    10 comment_format_cd = f8
                    10 comment_author_id = f8
                    10 comment_date = dq8
                    10 comment_date_tz = i4
                    10 chartable_ind = i2
                    10 comment_type_cd = f8
                  9 orders [*]
                    10 order_id = f8
                8 action_requests [*]
                  9 action_request_id = f8
                  9 action_request_type_cd = f8
                  9 action_request_status_cd = f8
                  9 action_request_comment = vc
                  9 request_date = dq8
                  9 request_date_tz = i4
                  9 action_date = dq8
                  9 action_date_tz = i4
                  9 requestor_id = f8
                  9 requestor_ft = vc
                  9 requestee_id = f8
                  9 requestee_ft = vc
                  9 modifiers [*]
                    10 modifier_type_cd = f8
                8 participations [*]
                  9 participation_id = f8
                  9 participation_type_cd = f8
                  9 participation_comment = vc
                  9 participation_date = dq8
                  9 participation_date_tz = i4
                  9 participation_prsnl_id = f8
                  9 participation_prsnl_ft = vc
                  9 modifiers [*]
                    10 modifier_type_cd = f8
                8 section_title = vc
                8 section_published_ind = i2
                8 section_viewable_ind = i2
                8 section_sequence = vc
                8 documentation_date = dq8
                8 documentation_date_tz = i4
                8 text_bodies [*]
                  9 text_storage_cd = f8
                  9 text_format_cd = f8
                  9 text_body = gvc
                  9 location_handle = vc
                8 signature_line_text = gvc
                8 signature_line_type_cd = f8
      3 custom_display = vc
  1 consent
    2 consent_status_cd = f8
  1 diagnosis
    2 diagnoses [*]
      3 working_diagnosis = vc
  1 auth_encounter
    2 auth_encounters [*]
      3 encounter_id = f8
  1 patient_relationship
    2 patient_relationships [*]
      3 person_prsnl_reltn_id = f8
      3 person_prsnl_reltn_cd = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 begin_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
  1 encounter_relationship
    2 encounter_relationships [*]
      3 encntr_prsnl_reltn_id = f8
      3 encntr_prsnl_reltn_cd = f8
      3 encntr_id = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 begin_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  1 relationship_by_types
    2 eprs [*]
      3 encntr_prsnl_reltn_id = f8
      3 encntr_prsnl_reltn_cd = f8
      3 encntr_id = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
    2 pprs [*]
      3 person_prsnl_reltn_id = f8
      3 person_prsnl_reltn_cd = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
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
/*
; Input data
free record input_list
record input_list (
	1 qual[*]
		2 dta_cd = f8
		2 multi_select_ind = i2
		2 input_id = f8; dcp_ref_input id
		2 values_cnt = i4
		2 values[*]
			3 response_id = f8
			3 response = vc
)
*/
 
 
;600470 dcp_get_next_avail_seq <--- this gets the form_activty_id that will be used
free record 600470_req
record 600470_req (
  1 sequence_name = vc
)
 
free record 600470_rep
record 600470_rep (
   1 sequence_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 
;680500	MSVC_GetPrivilegesByCodes
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
 
;680501	MSVC_CheckPrivileges
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
 
;600373	dcp_get_dcp_form
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
 
;600471	dcp_get_section_input_runtime
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
;600356	dcp_get_dta_info_all
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
 
;600345 dcp_events_ensured
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
 
;560303	DCP.ModTask
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
 
;;;inputs from the arglist to post in powerform
; Input data
free record input_list
record input_list (
	1 qual_cnt = i4
	1 qual[*]
		2 dcp_section_id = f8
		2 input_id = f8; this is the input_ref_id
		2 dta_cd = f8 ;<-----need to get this dtacd
		2 required_alone = i2; required and is not dependent on conditional logic
		2 required_cond_logic = i2; required with conditional logic
		2 conditonal_logic_ind = i2; conditional_logic
		2 multi_select_ind = i2
		2 values[*]
			3 response_id = f8
			3 mnemonic = vc
			3 short_string = vc
			3 description = vc
			3 response_id_val_float = f8; used for logic comapare
			3 response = vc
)
 
free record form_input
record form_input(
	1 section_cnt = i4
	1 section[*]
		2 section_id = f8
		2 event_cd = f8
		2 description = vc
		2 input_cnt = i4
		2 dcp_section_ref_id = f8
		2 inputs[*]
			3 dcp_section_input_id = f8
			3 dta_cd = f8
			3 multi_select_ind = i2
			3 event_cd = f8
			3 event_class_cd = f8
			3 dta_description= vc
			3 input_ref_seq = i4
			3 coded_response_cnt = i4
			3 coded_response[*]
				4 response_id = f8
			    4 mnemonic = vc
			    4 response_id_val_float = f8; used for logic comapare
			    4 short_string = vc
			    4 description = vc
			3 string_response_cnt = i4
			3 string_response[*]
				4 response = vc
			3 date_response_cnt = i4
			3 date_response[*]
				4 date_response = dq8
				4 date_type_flag = i2
)
 
free record temp_events
record temp_events (
	1 qual[*]
		2 event_id = f8
)
 
free record put_task_pform_reply_out
record put_task_pform_reply_out(
	1 task_id			= f8
	1 form_id           = f8
    1 form              = vc
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
	      	3 OperationName 	= c25
	      	3 OperationStatus 	= c1
	      	3 TargetObjectName 	= c25
	      	3 TargetObjectValue = vc
	      	3 Code 				= c4
	      	3 Description 		= vc
)
 
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input parameters
declare dTasklId		= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare dPrsnlId			= f8 with protect, noconstant(0.0)
declare sJsonArgs			= gvc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare dStatusCd			= f8 with protect, noconstant(0.0)
 
 
; Other
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dEncounterId		= f8 with protect, noconstant(0.0)
declare dOrderId			= f8 with protect, noconstant(0.0)
declare dFormsRefId			= f8 with protect, noconstant(0.0)
declare iTimeZone			= i2 with protect, noconstant(0.0)
declare sReferenceNumber	= c60 with protect, noconstant("")
declare dFormEventId		= f8 with protect, noconstant(0.0)
declare dReferenceTaskId	= f8 with protect, noconstant(0.0)
declare dCurrStatusCd		= f8 with protect, noconstant(0.0)
declare sCurrStatusMean		= vc with protect, noconstant("")
declare sStatusMean			= vc with protect, noconstant("")
declare sTimeZone           = vc
declare off_set_var = i4
declare daylight_var = i4
declare dFormActivityId = f8
declare dResultSetId = f8
declare taskDtTm = dq8
declare sRefNbr = vc
declare dPrereqTaskId = f8
declare dMedAdminEventId = f8
declare dCatalogCd = f8
declare sProviderName = vc
declare sCollatingSeq = vc
declare c_now_dt_tm = dq8
declare coll_seq = vc
 
;constants
declare c_PformEntryTypecd  = f8 with protect, constant(uar_get_code_by("MEANING",255431,"POWERFORMS"))
declare c_ContriSysPCcd = f8 with protect, constant(uar_get_code_by("MEANING",89,"POWERCHART"))
declare c_order_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"ORDER"))
declare c_clinical_event_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"CLINCALEVENT"))
declare c_task_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"RTASKEVENT"))
declare c_pform_entry_mode_cd = f8 with protect, constant(uar_get_code_by("MEANING",29520,"POWERFORMS"))
declare c_task_complete_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"COMPLETE"))
declare c_dcpgeneric_event_cd = f8 with protect, constant(uar_get_code_by("MEANING",72,"DCPGENERIC"))
declare c_record_status_code_active_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_result_status_code_auth_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_inprogress_result_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"IN PROGRESS"))
declare c_order_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"ORDER"))
declare c_verify_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_perform_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_completed_action_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_grp_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_txt_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"TXT"))
declare c_num_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"NUM"))
declare c_date_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"DATE"))
declare c_root_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"ROOT"))
declare c_powerform_entry_mode_cd = f8 with protect, constant(uar_get_code_by("MEANING",29520,"POWERFORMS"))
declare c_contributor_system_cd = f8 with protect, constant(uar_get_code_by("MEANING",89,"POWERCHART"))
declare c_complete_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"COMPLETE"))
declare c_inprocess_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"INPROCESS"))
declare c_charting_agent_cd = f8 with protect, constant(uar_get_code_by("MEANING",255090,"POWERFORM"))
declare c_doc_val_section_priv =  f8 with protect, constant(uar_get_code_by("MEANING",6016,"VALSECONLY"))
declare c_signpowerform_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"SIGNPOWERFRM"))
declare c_child_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"CHILD"))
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dTaskId				        = cnvtreal($TASK_ID)
set sUserName					= trim($USERNAME, 3)
set dPrsnlId					= GetPrsnlIDFromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id			= dPrsnlId  	;003
set sJsonArgs					= trim($JSON,3)
set jrec						= cnvtjsontorec(sJsonArgs)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set sTimeZone = DATETIMEZONEBYINDEX(CURTIMEZONEAPP,off_set_var,daylight_var,7); string used to build ref number,(CDT,CST,PDT etc)
set c_now_dt_tm = cnvtdatetime(curdate,curtime3)
call echorecord(arglist)
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetRelatedForm(null)		= null with protect
declare GetFormDefinition(null)		= i2 with protect 		;600373	dcp_get_dcp_form
declare GetFormSectionDetails(null)		= i2 with protect 		;600471	dcp_get_section_input_runtime
declare GetFormDtaDetails(null)			= i2 with protect 		;600356	dcp_get_dta_info_all
declare GetNextSequence(seq_name = vc)            = f8 with protect ;600470 dcp_get_next_avail_seq
declare Validateinputs(null) = i2 with protect ;validates the inputs are valid responses in the for the sections
declare GetOrderDetails(null)		= i2 with protect ;500415	orm_get_order_by_id
declare GetEncntrDetails(null)		= i2 with protect ;3200310 	msvc_svr_get_clinctx
declare PostForm(null) = null with protect
declare EnsureDcpEvents(null) = null with protect
declare ModifyOrderTask(null)		= i2 with protect ;560303	DCP.ModTask
declare BuildFormInputs(null) = null with protect; this organizes the inputs to fill in request
declare GetInputData(null) = null with protect; moves the arglist to inputdata
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, put_task_pform_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "User is invalid", "Invalid User for Audit.",
  "1001",build2("Invalid user: ",sUserName), put_task_pform_reply_out)
  go to exit_script
endif
 
;validates and sets the form_id
call GetRelatedForm(null)
 
; Get Encounter Details - 3200310 msvc_svr_get_clinctx
set iRet = GetEncntrDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Encounter Details", "Could not retrieve encounter details.",
  "2004","Could not retrieve encounter details.", put_task_pform_reply_out)
  go to exit_script
endif
 
; Get Order Information - 500415 orm_get_order_by_id
set iRet = GetOrderDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "OrderId is invalid", "Invalid OrderId",
  "2079",build("Invalid OrderId: ",dOrderId), put_task_pform_reply_out)
  go to exit_script
endif
 
;getting input_data from arglist
call GetInputData(null)
 
; Get Form Definition details - 600373 dcp_get_dcp_form
set iRet = GetFormDefinition(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Form Definition", "Could not retrieve form definition.",
  "9999","Could not retrieve form definition.", put_task_pform_reply_out)
  go to exit_script
endif
 
; Get privileges by code - 680500 MSVC_GetPrivilegesByCodes
set iRet = GetPrivsByCode(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Get Privileges", "Could not retrieve privileges.",
  "9999","Could not retrieve privileges.", put_task_pform_reply_out)
  go to exit_script
endif
 
; Check priviliges - 680501	MSVC_CheckPrivileges
set iRet = CheckPrivileges(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Check Privileges", "User does not have privileges.",
  "9999","User does not have privileges.", put_task_pform_reply_out)
  go to exit_script
endif
 
 
/*
; Get Powerform Section details - 600471 dcp_get_section_input_runtime
set iRet = GetFormSectionDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Section Details", "Could not retrieve section details.",
  "9999","Could not retrieve section details.", put_task_pform_reply_out)
  go to exit_script
endif
*/
;get next sequences for for dcp_activity
set dFormActivityId = GetNextSequence("carenet_seq")
 
;get next sequence for result_set id
set dResultSetId = GetNextSequence("result_set_seq")
 
;organize the inputdata
call BuildFormInputs(null)
 
/*
; Update DCP Activity Lock - 600908	dcp_upd_lock_forms_activity
set iRet = UpdateDcpLocks(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "DTA Details", "Could not create lock.",
  "9999","Could not create lock.", put_task_pform_reply_out)
  go to exit_script
endif
 
; Check DCP Activity Locks - 600907 dcp_chk_lock_forms_activity
set iRet = CheckDcpLocks(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "DTA Details", "Lock not found.",
  "9999","Lock not found.", put_task_pform_reply_out)
  go to exit_script
endif
*/

;post powerform
call PostForm(null)
 
 
; Update Forms Activity Table - 600353 dcp_upd_forms_activity
set iRet = UpdateFormsActivity(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Update Forms Activity", "Could not update forms activity.",
  "9999","Could not update forms activity.", put_task_pform_reply_out)
  go to exit_script
endif
 
 
; Ensure DCP events - 600345 dcp_events_ensured
call EnsureDcpEvents(null)
 
; Modify the task tied to the order and powerform - 560303 DCP.ModTask
set iRet = ModifyOrderTask(null)
if(iRet = 0)
  call ErrorHandler2("PUT TASK", "F", "Complete Task", "Could not complete task.",
  "9999","Could not complete task.", put_task_pform_reply_out)
  go to exit_script
endif

; Update Audit with successful status
call ErrorHandler2("PUT TASK", "S", "Success", "TASK updated successfully.",
"0000", "TASK updated successfully", put_task_pform_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(put_task_pform_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_put_task_pform.json")
	  call echo(build2("_file : ", _file))
	  call echojson(put_task_pform_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(put_task_pform_reply_out)
 
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
;  Name: GetRelatedForm(null)		= null with protect
;  Description:  Get's the powerform related to that id
**************************************************************************/
subroutine GetRelatedForm(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRelatedForm", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;getting the prereq task and checking if prereq task is completed
	select into "nl:"
	from task_reltn tr
	     ,task_activity ta
	plan tr
		where tr.task_id = dTaskId
	join ta
		where ta.task_id = tr.prereq_task_id
			and ta.task_status_cd = c_task_complete_status_cd
	head report
		dPrereqTaskId = tr.prereq_task_id
		dMedAdminEventId = ta.event_id
	with nocounter
 
 
	select into "nl:"
	from task_activity ta
	     ,order_task ot
	plan ta
		where ta.task_id = dTaskId
	join ot
		where ot.reference_task_id = ta.reference_task_id
	head report
		dFormsRefId = ot.dcp_forms_ref_id
		dOrderId = ta.order_id
		dEncounterId = ta.encntr_id
		dPatientId = ta.person_id
		taskDtTm = ta.task_dt_tm
	with nocounter
 
 	;getting the provider name
 	select into "nl:"
 	from prsnl p
 	where p.person_id = reqinfo->updt_id
 	head report
 		sProviderName = trim(p.name_full_formatted)
 	with nocounter
 
	if(dFormsRefId < 1)
		 call ErrorHandler2("PUT Task", "F", "Form Definition", "Could not retrieve form tied to taskId",
  			"9999","Could not retrieve form tied to taskId.", put_task_pform_reply_out)
  			go to exit_script
	endif
 
end;GetRelatedForm(null)
 
/*************************************************************************
;  Name: GetEncntrDetails(null)		= i2 with protect ;3200310 	msvc_svr_get_clinctx
;  Description: Get Encounter Details
**************************************************************************/
subroutine GetEncntrDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncntrDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600206
	set iRequest = 3200310
 
	set 3200310_req->patient_id = dPatientId
	set 3200310_req->encounter_id = dEncounterId
	set 3200310_req->load.patient = 1
	set 3200310_req->load.encounter = 1
	set 3200310_req->load.auth_encounter = 1
	set 3200310_req->load.patient_relationship = 1
	set 3200310_req->load.encounter_relationship = 1
	set 3200310_req->load.patient_details.basic_info = 1
	set 3200310_req->load.patient_details.pcp = 1
	set 3200310_req->load.patient_details.name = 1
	set 3200310_req->load.patient_details.aliases = 1
	set 3200310_req->load.patient_details.secure_email = 1
	set 3200310_req->load.patient_details.addresses = 1
	set 3200310_req->load.patient_details.phones = 1
	set 3200310_req->load.encounter_details.basic_info = 1
	set 3200310_req->load.encounter_details.aliases = 1
	set 3200310_req->load.encounter_details.location = 1
	set 3200310_req->load.encounter_details.timezone = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3200310_req,"REC",3200310_rep)
 
	if(3200310_rep->status_data.status = "S")
		set iValidate = 1
		set iTimeZone = 3200310_rep->encounter.encounter_tz
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetEncntrDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(null)		= i2 with protect ;500415	orm_get_order_by_id
;  Description:  Get Order Information
**************************************************************************/
subroutine GetOrderDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 500415
 
	set 500415_req->order_id = dOrderId
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500415_req,"REC",500415_rep)
 
	if(500415_rep->status_data.status = "S")
		set iValidate = 1
	endif
call echorecord(500415_rep)
	if(idebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormDefinition(null)		= i2 with protect ;600373	dcp_get_dcp_form
;  Description:  Get the form definition
**************************************************************************/
subroutine GetFormDefinition(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormDefinition Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600373
 
	set 600373_req->dcp_forms_ref_id = dFormsRefId
	set 600373_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600373_req,"REC",600373_rep)
 
	if(600373_rep->status_data = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetFormDefinition Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormSectionDetails(null)	= i2 with protect ;600471	dcp_get_section_input_runtime
;  Description:  Get form section details
**************************************************************************/
subroutine GetFormSectionDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormSectionDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;;;;required input helper record
	free record required_helper
	record required_helper(
		1 qual_cnt = i4
		1 qual[*]
			2 input_ref__id = f8
			2 dta_cd = f8
	)
 
	;;;;required conditional input heler record
	free record cond_helper
	record cond_helper(
		1 qual_cnt = i4
		1 qual[*]
			2 required_ind = i2
			2 input_ref_id = f8
			2 dta_cd = f8;top/parent dta
			2 value = f8
			2 pvc_value = vc
			2 merge_id = f8;condional merge dta to match up to the parent dta
	)
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600471
	declare dta_cond_val = vc
 	set input_list->qual_cnt = size(input_list->qual,5)
	for(i = 1 to size(600373_rep->sect_list,5))
		set 600471_req->dcp_section_ref_id = 600373_rep->sect_list[i].dcp_section_ref_id
		set 600471_req->dcp_section_instance_id = 600373_rep->sect_list[i].dcp_section_instance_id
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600471_req,"REC",600471_rep)
 
 
		if(600471_rep->status_data.status = "S")
 
 			set stat = initrec(required_helper)
 			set stat = initrec(cond_helper)
			select into "nl:"
			from (dummyt d1 with seq = 600471_rep->input_cnt)
			     ,(dummyt d2 with seq = 1)
			plan d1
				where maxrec(d2,600471_rep->input_list[d1.seq].nv_cnt)
					and 600471_rep->input_list[d1.seq].description != "Label"
			join d2
			order by d1.seq, d2.seq
			head report
				x = 0
				y = 0
			head d1.seq
				required_fnd = 0
				conditional_fnd = 0
				merge_id = 0.0
				dta_cond_val = ""
				merge_id_dta_cond = 0.0
				head d2.seq
					x = x
					detail
 
					;finding the required ones
					if(600471_rep->input_list[d1.seq].nv[d2.seq].pvc_name = "required" and
								600471_rep->input_list[d1.seq].nv[d2.seq].pvc_value = "true")
						required_fnd = 1
					endif
 
					;checking if there is conditional
					if(600471_rep->input_list[d1.seq].nv[d2.seq].pvc_name = "conditional_control_unit")
						conditional_fnd = 1
					endif
 
					;grabbing the dta_cd(merge_id) for conditional logic
					if(600471_rep->input_list[d1.seq].nv[d2.seq].pvc_name = "discrete_task_assay")
						merge_id = 600471_rep->input_list[d1.seq].nv[d2.seq].merge_id
					endif
 
					;grabbing the dta condition for value comparison
					if(600471_rep->input_list[d1.seq].nv[d2.seq].pvc_name = "dta_condition")
						dta_cond_val = 600471_rep->input_list[d1.seq].nv[d2.seq].pvc_value
						merge_id_dta_cond = 600471_rep->input_list[d1.seq].nv[d2.seq].merge_id
					endif
 
				foot d2.seq;this fills in the structures
 
					;filling in required helper
					if(required_fnd > 0 and conditional_fnd < 1)
						x = x + 1
						stat = alterlist(required_helper->qual,x)
						required_helper->qual[x].input_ref__id = 600471_rep->input_list[d1.seq].dcp_input_ref_id
					elseif(conditional_fnd > 0)
						y = y + 1
						stat = alterlist(cond_helper->qual,y)
						cond_helper->qual[y].input_ref_id = 600471_rep->input_list[d1.seq].dcp_input_ref_id
						cond_helper->qual[y].dta_cd = merge_id
						cond_helper->qual[y].merge_id = merge_id_dta_cond
						cond_helper->qual[y].pvc_value = dta_cond_val
						if(required_fnd > 0)
							cond_helper->qual[y].required_ind = 1
						endif
					endif
			foot report
				required_helper->qual_cnt = x
				cond_helper->qual_cnt = y
			with nocounter
 
			;Looping through the required structure to make sure the required input fields are available
 			if(required_helper->qual_cnt > 0)
 				declare required_check = i2
 				for(i = 1 to required_helper->qual_cnt)
 					set required_check = 0
 					for(z = 1 to input_list->qual_cnt)
 						if(required_helper->qual[i].input_ref__id = input_list->qual[z].input_id)
 							set required_check = 1
 						endif
 					endfor
 					;verifys input_id is present for required input
 					if(required_check < 1)
 						 call ErrorHandler2("PUT TASK", "F", "Required Field not entered", "Required Field not entered",
  							"9999","Required Field not entered", put_task_pform_reply_out)
 							 go to exit_script
 					endif
 				endfor
 			endif
 
 			;Looping to check if conditional logic is met
 			if(cond_helper->qual_cnt > 0)
 				declare cond_id_fnd = i2
 				declare logical = i4
 				declare val_to_compare = f8
 				;looping through input list to see if conditionals are present.
 				for(i = 1 to input_list->qual_cnt)
 
 					;looping through the conditional list
 					for(z = 1 to cond_helper->qual_cnt)
 						;if found. checking the logic to see if condtions are met
 						set cond_id_fnd = 0
 						if(input_list->qual[i].input_id = cond_helper->qual[z].input_ref_id)
 							set cond_id_fnd = 1
 							if(cond_id_fnd > 0)
 								for(j = 1 to input_list->qual_cnt)
 									if(input_list->qual[j].dta_cd = cond_helper->qual[z].merge_id
 														and input_list->qual[j].multi_select_ind = 0);have to make sure input_dta is right dta
 										;have to perform the logic to see if the value actually unlocks the input section
 										set logical = cnvtint(substring(1,1,cond_helper->qual[z].pvc_value))
 										set val_to_compare = cnvtreal(substring(3,size(cond_helper->qual[z].pvc_value)-2,cond_helper->qual[z].pvc_value))
 
 										;;performing the logic compare
 										/*
 										 0 = Exactly Equal
 										 1 = Less Than
 										 2 = Greater Than
 										 3 = Less than or equal to
 										 4 = Greater than or equal to
 										 5 = Enables control/section if selected = 5 (multi-select only)
 										 6 = Not Equal to
 										 7 = Disables control/section if selected = 7 (multi-select only)
 										*/
 										if(logical = 0)
 											if(val_to_compare != input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 
 											endif
 										elseif(logical = 1);less than but checking equal to greater than logical for logic
 											if(val_to_compare >= input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 											endif
 										elseif(logical = 2); greater than but checking equal to < than logical for logic
 											if(val_to_compare <= input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 											endif
 										elseif(logical = 3);less than or equal to but checking greater than
 											if(val_to_compare > input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 											endif
 										elseif(logical = 4);greater than or equal to but checking less than
 											if(val_to_compare < input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 											endif
 										elseif(logical = 6); not equal to but checking equal to
 											if(val_to_compare = input_list->qual[j].values[1].response_id_val_float)
 												call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not satisfied", "Conditional Logic Field not satisfied",
  													"9999","Conditional Logic Field not satisfied", put_task_pform_reply_out)
 											 		go to exit_script
 											endif
 										endif
 
 
 									else;exits because a condtiional field was not entered
 										call ErrorHandler2("PUT TASK", "F", "Conditional Logic Field not entered", "Conditional Logic Field not entered",
  											"9999","Conditional Logic Field not entered", put_task_pform_reply_out)
 											 go to exit_script
 									endif
 
							    endfor
 							endif
 						endif
 					endfor
 				endfor
			set iValidate = 1
			;set 600373_rep->sect_list[i].cki = 600471_rep->cki
			;set 600373_rep->sect_list[i].input_cnt = 600471_rep->input_cnt
			;set stat = moverec(600471_rep->input_list,600373_rep->sect_list[i].input_list)
 
 
			endif
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetFormSectionDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormDtaDetails(null)		= i2 with protect ;600356	dcp_get_dta_info_all
;  Description:  Get DTA details
**************************************************************************/
subroutine GetFormDtaDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormDtaDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
	set dtaCnt = 0
	for(i = 1 to size(600373_rep->sect_list,5))
		for(x = 1 to 600373_rep->sect_list[i].input_cnt)
			for(y = 1 to 600373_rep->sect_list[i].input_list[x].nv_cnt)
				if(600373_rep->sect_list[i].input_list[x].nv[y].pvc_name = "discrete_task_assay")
					set dtaCnt = dtaCnt + 1
					set stat = alterlist(600356_req->dta,dtaCnt)
					set 600356_req->dta[dtaCnt].task_assay_cd = 600373_rep->sect_list[i].input_list[x].nv[y].merge_id
				endif
			endfor
		endfor
	endfor
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetFormDtaDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetInputData
;  Description: moves the arglist
**************************************************************************/
subroutine GetInputData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInputData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare inputCnt = i2
 
	set addlSize =	size(arglist->FieldInputs,5)
	if(addlSize > 0)
		for(i = 1 to addlSize)
			if(cnvtreal(arglist->FieldInputs[i].FieldId) > 0)
				set inputCnt = size(input_list->qual,5)
				set inputCnt = inputCnt + 1
				set stat = alterlist(input_list->qual,inputCnt)
				;set input_list->qual[inputCnt].dta_cd = cnvtreal(arglist->FieldInputs[i].FieldId);<----Change to field input
 				set input_list->qual[inputCnt].input_id = cnvtreal(arglist->FieldInputs[i].FieldId)
				set idSize = size(arglist->FieldInputs[i].CodedValueIds,5)
				set valSize = size(arglist->FieldInputs[i].TextValues,5)
				set inputSize = 0
				if(idSize >= valSize)
					set inputSize = idSize
				else
					set inputSize = valSize
				endif
 
				set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
				for(inp = 1 to inputSize)
					if(inp <= idSize)
						set input_list->qual[inputCnt].values[inp].response_id = cnvtreal(arglist->FieldInputs[i].CodedValueIds[inp])
					endif
					if(inp <= valSize)
						set input_list->qual[inputCnt].values[inp].response = arglist->FieldInputs[i].TextValues[inp]
					endif
				endfor
			endif
		endfor
	endif
call echorecord(input_list)
	set input_list->qual_cnt = size(input_list->qual,5)
	;assign the dta_code
 
	select into "nl:"
	from dcp_forms_ref dfr
     	,dcp_forms_def dfd
     	,dcp_section_ref dsr
     	,dcp_input_ref dir
     	,name_value_prefs nvp
     	,(dummyt d with seq = input_list->qual_cnt)
     plan dfr
   		where dfr.dcp_forms_ref_id = dFormsRefId
   			and dfr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dfr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  	 join dfd
		where dfd.dcp_form_instance_id = dfr.dcp_form_instance_id
   	 join dsr
		where dsr.dcp_section_ref_id = dfd.dcp_section_ref_id
			and dsr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dsr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
     join dir
		where dir.dcp_section_instance_id = dsr.dcp_section_instance_id
     join nvp
   		where nvp.parent_entity_id = dir.dcp_input_ref_id
   			;and nvp.merge_id = input_list->qual[d1.seq].dta_cd
   			and nvp.parent_entity_name = "DCP_INPUT_REF"
			and nvp.active_ind = 1
			and nvp.pvc_name = "discrete_task_assay"
			;and nvp.merge_id = 3790106
			and nvp.merge_id > 0
	join d
		where input_list->qual[d.seq].input_id = nvp.parent_entity_id
	head d.seq
		input_list->qual[d.seq].dta_cd = nvp.merge_id
	with nocounter

call echo("line 2636")

	;getting the mulitselect
	select into "nl:"
	from (dummyt d with seq = input_list->qual_cnt)
	     ,name_value_prefs n
	plan d
		where input_list->qual[d.seq].input_id > 0
	join n
		where n.parent_entity_id = input_list->qual[d.seq].input_id
			and n.pvc_name = "multi_select"
			and n.active_ind = 1
	order by d.seq
	detail
 
		if(n.pvc_value = "true")
			input_list->qual[d.seq].multi_select_ind = 1
		endif
	with nocounter
 
	;getting the nomenclatures of the response_ids for comparison
	;;;get the mmonic and etc from nomenclature table.
	select into "nl:"
	from (dummyt d1 with seq = size(input_list->qual,5))
		 ,(dummyt d2 with seq = 1)
	     ,nomenclature n
	plan d1
		where maxrec(d2,size(input_list->qual[d1.seq].values,5))
	join d2
		where input_list->qual[d1.seq].values[d2.seq].response_id > 0
	join n
		where n.nomenclature_id = input_list->qual[d1.seq].values[d2.seq].response_id
	order by d1.seq, d2.seq
	head d1.seq
		nocnt = 0
		head d2.seq
			nocnt = 0
			detail
				input_list->qual[d1.seq].values[d2.seq].mnemonic = trim(n.mnemonic)
				input_list->qual[d1.seq].values[d2.seq].short_string = trim(n.short_string)
				input_list->qual[d1.seq].values[d2.seq].description = trim(n.source_string)
				if(isnumeric(n.source_string) > 0)
					input_list->qual[d1.seq].values[d2.seq].response_id_val_float = cnvtreal(n.source_string)
				endif
	with nocounter
call echorecord(input_list)
 
	if(idebugFlag > 0)
		call echo(concat("GetInputData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	    ;call echorecord(input_list)
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ; EnsureDcpEvents(null) = null - 600345 dcp_events_ensured
;  Description:  Ensure DCP events
**************************************************************************/
subroutine EnsureDcpEvents(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("EnsureDcpEvents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication  = 380000
	set iTask = 600108
	set iRequest = 600345
 
	for(i = 1 to size(temp_events->qual,5))
		set stat = alterlist(600345_req->elist,i)
		set 600345_req->elist[i].event_id = temp_events->qual[i].event_id
		set 600345_req->elist[i].order_id = dOrderId
		set 600345_req->elist[i].task_id = dTaskId
	endfor
call echorecord(600345_req)
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600345_req,"REC",600345_rep)
 
	set iValidate = stat
call echorecord(600345_rep)
	if(idebugFlag > 0)
		call echo(concat("EnsureDcpEvents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ModifyOrderTask(null)		= i2 with protect ;560303	DCP.ModTask
;  Description:  Modify the task that was generated above
**************************************************************************/
subroutine ModifyOrderTask(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ModifyOrderTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication  = 380000
	set iTask = 560300
	set iRequest = 560303
 
	set stat = alterlist(560303_req->mod_list,1)
	set 560303_req->mod_list[1].task_id = dTaskId
	;if(sStatusMean in ("AUTH","MODIFIED"))
		set 560303_req->mod_list[1].task_status_meaning = uar_get_code_meaning(c_complete_task_status_cd)
	;else
	;	set 560303_req->mod_list[1].task_status_meaning = uar_get_code_meaning(c_inprocess_task_status_cd)
	;endif
 
	set 560303_req->mod_list[1].task_dt_tm = c_now_dt_tm
	set 560303_req->mod_list[1].event_id = dFormEventId
	set 560303_req->mod_list[1].charted_by_agent_cd = c_charting_agent_cd
	set 560303_req->mod_list[1].result_set_id = dResultSetId
	set 560303_req->mod_list[1].performed_prsnl_id = dPrsnlId
	set 560303_req->mod_list[1].performed_dt_tm = c_now_dt_tm
 
	set stat = alterlist(560303_req->workflow,1)
	set 560303_req->workflow[1].bagCountingInd = 1
call echorecord(560303_req)
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560303_req,"REC",560303_rep)
 
	if(560303_rep->task_status = "S")
		set iValidate = 1
	endif
call echorecord(560303_rep)
	if(idebugFlag > 0)
		call echo(concat("ModifyOrderTask Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckPrivileges(null)		= i2 with protect ;680501	MSVC_CheckPrivileges
;  Description:  Check priviliges - ensure user can add and sign the powerform
**************************************************************************/
subroutine CheckPrivileges(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 380000
	set iTask = 3202004
	set iRequest = 680501
 
	set 680501_req->patient_user_criteria.user_id = dPrsnlId
	set stat = alterlist(680501_req->event_privileges.event_code_level.event_codes,1)
	set 680501_req->event_privileges.event_code_level.event_codes[1].event_cd = 600373_rep->event_cd
	set 680501_req->event_privileges.event_code_level.add_documentation_ind = 1
	set 680501_req->event_privileges.event_code_level.sign_documentation_ind = 1
	set 680501_req->event_privileges.event_code_level.modify_documentation_ind = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680501_req,"REC",680501_rep)
 
	set priv_check = 0
	set priv_check = priv_check + 680501_rep->event_privileges.add_documentation.status.success_ind
	set priv_check = priv_check + 680501_rep->event_privileges.sign_documentation.status.success_ind
 	set priv_check = priv_check + 680501_rep->event_privileges.modify_documentation.status.success_ind
 
	if(priv_check > 2)
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrivsByCode(null)		= i2 with protect ;680500	MSVC_GetPrivilegesByCodes
;  Description:  Get privileges by code = make sure user has privs to review powerforms
**************************************************************************/
subroutine GetPrivsByCode(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrivsByCode Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 3202004
	set iRequest = 680500
 
	set 680500_req->patient_user_criteria.user_id = dPrsnlId
 
	set stat = alterlist(680500_req->privilege_criteria.privileges,2)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_doc_val_section_priv
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = c_signpowerform_priv
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
	set priv_check = 0
	for(i = 1 to size(680500_rep->privileges,5))
		set priv_check = priv_check + 680500_rep->privileges[i].default[1].granted_ind
	endfor
 
	if(priv_check > 1)
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPrivsByCode Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateFormsActivity(null)	= i2 with protect ;600353 dcp_upd_forms_activity
;  Description:  Update forms activity table
**************************************************************************/
subroutine UpdateFormsActivity(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateFormsActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 600005
	set iTask = 600701
	set iRequest = 600353
 
	set 600353_req->form_activity_id = dFormActivityId
	set 600353_req->form_reference_id = dFormsRefId
	set 600353_req->person_id = dPatientId
	set 600353_req->encntr_id = dEncounterId
	set 600353_req->task_id = dTaskId
	set 600353_req->form_dt_tm = cnvtdatetime(curdate,curtime3)
	set 600353_req->form_tz = iTimeZone
	set 600353_req->form_status_cd = c_result_status_code_auth_cd
	set 600353_req->flags = 2
	set 600353_req->description = 600373_rep->description
	set 600353_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
	;set 600353_req->reference_nbr = build(sReferenceNumber,0)
 
	; Components
	set componentSize = 3
	set stat = alterlist(600353_req->component,componentSize)
	for(i = 1 to componentSize)
		case(i)
			of 1:
				set 600353_req->component[i].parent_entity_name = "CLINICAL_EVENT"
				set 600353_req->component[i].parent_entity_id = 0.0
				set 600353_req->component[i].component_cd = c_clinical_event_comp_cd
			of 2:
				set 600353_req->component[i].parent_entity_name = "Order"
				set 600353_req->component[i].parent_entity_id = dOrderId
				set 600353_req->component[i].component_cd = c_order_comp_cd
			of 3:
				set 600353_req->component[i].parent_entity_name = "CLINICAL_EVENT"
				set 600353_req->component[i].parent_entity_id = dMedAdminEventId
				set 600353_req->component[i].component_cd = c_task_comp_cd
		endcase
	endfor
call echorecord(600353_req)
	;Prsnl
	set stat = alterlist(600353_req->prsnl,1)
	set 600353_req->prsnl[1].prsnl_id = dPrsnlId
	set 600353_req->prsnl[1].prsnl_ft = GetNameFromPrsnID(dPrsnlId)
	set 600353_req->prsnl[1].activity_dt_tm = cnvtdatetime(curdate,curtime3)
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600353_req,"REC",600353_rep)
 
	if(600353_rep->status_data.status = "S")
		set iValidate = 1
 
	endif
call echorecord(600353_rep)
	if(idebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNextSequence(seq_name = vc)            = null 600470 dcp_get_next_avail_seq
;  Description:  Finds the dcp_activity_id to use
**************************************************************************/
subroutine GetNextSequence(seq_name)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextSequence Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare dSequence = f8
	set iApplication = 600005
	set iTask  = 600701
	set iRequest = 600470
 
	set  600470_req->sequence_name = seq_name
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600470_req,"REC",600470_rep)
 	set dSequence = 600470_rep->sequence_id
 
 	if(dSequence < 1)
 		 call ErrorHandler2("PUT TASK", "F", "GetNextSequence Begin", "Could not set next sequence_id",
  				"9999","Could not set next sequence_id.", put_task_pform_reply_out)
 		 go to exit_script
  	endif
 
  	return(dSequence)
 
 
	if(idebugFlag > 0)
		call echo(concat("GetDcpSequence Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 
end ;End Subroutine
 
/*************************************************************************
;  Name:  Validateinputs(null) = i2
;  Description:  Validates the inputs are within the responses and input field
**************************************************************************/
subroutine Validateinputs(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Validateinputs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
    declare valid_ind = i2
 
 
 	;check against multi-response
 	declare value_size = i4
 	declare error_input_id_st = vc
	select into "nl:"
	from (dummyt d with seq = size(input_list->qual,5))
	plan d
	head report
	  x = 0
	head d.seq
		value_size = size(input_list->qual[d.seq].values,5)
		if(input_list->qual[d.seq].multi_select_ind = 0 and value_size > 1)
			x = x + 1
			if(x < 2)
				error_input_id_st = trim(cnvtstring(input_list->qual[d.seq].input_id),3)
			else
				error_input_id_st = build2(error_input_id_st,", ",trim(cnvtstring(input_list->qual[d.seq].input_id),3))
			endif
		endif
	with nocounter
 
	if(size(error_input_id_st) > 0)
		 call ErrorHandler2("PUT TASK", "F", "Only one response allowed",build("Multi-Select violations FieldIds: ",
		 error_input_id_st), "9999"
		 		,build("Multi-Select violations FieldIds: ",error_input_id_st), put_task_pform_reply_out)
  		go to exit_script
  	endif
 
	;check to make sure the input id's exists on the form
	declare pos = i4
	declare num = i4
	declare err_fnd = i2
	for(i = 1 to size(input_list->qual,5))
		set pos = locateval(num,1,600471_rep->input_cnt,input_list->qual[i].input_id,600471_rep->input_list[num].dcp_input_ref_id)
		if(pos = 0)
			set err_fnd = 1
			set error_input_id_st = trim(cnvtstring(input_list->qual[i].input_id),3)
		endif
	endfor
 
	if(err_fnd > 0)
		call ErrorHandler2("PUT TASK", "F", "Invalid FieldID", "FieldId not found on form",
  		"9999",build2("Invalid FieldId: ",error_input_id_st), put_task_pform_reply_out)
 		 go to exit_script
  	endif
 
 
 
	if(idebugFlag > 0)
		call echo(concat("Validateinputs Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 
end ;End Subroutine
 
/*************************************************************************
;  Name:   BuildFormInputs(null) = null with protect; this organizes the inputs to fill in request
;  Description:  builds the forminputs
**************************************************************************/
subroutine BuildFormInputs(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildForminputs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	declare num = i4
	select into "nl:"
	from dcp_forms_ref dfr
     	,dcp_forms_def dfd
     	,dcp_section_ref dsr
     	,dcp_input_ref dir
     	,name_value_prefs nvp
     	;,(dummyt d1 with seq = input_list->qual_cnt)
     ;,(dummyt d2 with seq = 1)
   plan dfr
   		where dfr.dcp_forms_ref_id = dFormsRefId
   			and dfr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dfr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
   join dfd
		where dfd.dcp_form_instance_id = dfr.dcp_form_instance_id
   join dsr
		where dsr.dcp_section_ref_id = dfd.dcp_section_ref_id
			and dsr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dsr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
   join dir
		where dir.dcp_section_instance_id = dsr.dcp_section_instance_id
			;and dir.description != outerjoin("Label")
   ;join d1
   	;	where input_list->qual[d1.seq].input_id = dir.dcp_input_ref_id
   			;and maxrec(d2,size(input_list->qual[d1.seq].values,5))
   ;join d2
   join nvp
   		where nvp.parent_entity_id = dir.dcp_input_ref_id
   			;and nvp.merge_id = input_list->qual[d1.seq].input_id;input_list->qual[d1.seq].dta_cd
   			and expand(num,1,input_list->qual_cnt,nvp.merge_id,input_list->qual[num].dta_cd)
   			and nvp.parent_entity_name = "DCP_INPUT_REF"
			and nvp.active_ind = 1
			and nvp.pvc_name = "discrete_task_assay"
			and nvp.merge_id > 0
   order by dsr.dcp_section_ref_id, dir.dcp_input_ref_id,nvp.merge_id
   head report
   	  x = 0
   	  head dsr.dcp_section_ref_id
   	  	y = 0
   	  	x = x + 1
   	  	stat = alterlist(form_input->section,x)
   	  	form_input->section[x].dcp_section_ref_id = dsr.dcp_section_ref_id
   	  	form_input->section[x].description = dsr.description
   	  	form_input->section[x].event_cd = dsr.event_cd
 
   	  	head dir.dcp_input_ref_id
   	  		y = y + 1
   	  		stat = alterlist(form_input->section[x].inputs,y)
   	  		form_input->section[x].inputs[y].dcp_section_input_id = dir.dcp_input_ref_id
   	  		form_input->section[x].inputs[y].dta_cd = nvp.merge_id
   	  		form_input->section[x].inputs[y].input_ref_seq = dir.input_ref_seq
   	  		;form_input->section[x].inputs[y].dta_description = trim(uar_get_code_description(nvp.merge_id))
   	  		;form_input->section[x].inputs[y].event_cd = dsr.event_cd
 
   	   foot dsr.dcp_section_ref_id
   	   		form_input->section[x].input_cnt = y
   	  foot report
   	  	form_input->section_cnt = x
   	  with nocounter
 
 
 
	set dtaCnt = 0
 
	;looping through the size to fill out the 300356 request structure
	select into "nl:"
		dtaCd = form_input->section[d1.seq].inputs[d2.seq].dta_cd
	from (dummyt d1 with seq = form_input->section_cnt)
	     ,(dummyt d2 with seq = 1)
	plan d1
		where maxrec(d2,form_input->section[d1.seq].input_cnt)
	join d2
		where form_input->section[d1.seq].inputs[d2.seq].dta_cd > 0
	order by dtaCd
	head report
		x = 0
	head dtaCd
		x = x + 1
		stat = alterlist(600356_req->dta,x)
		600356_req->dta[x].task_assay_cd = dtaCd
	with nocounter
 
	;performing tbd exectute to get dta details for inputs
	set iValidate = 0
 	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status != "S")
		call ErrorHandler2("PUT TASK", "F", "ForminputFields(600356)", "Could not retrieve form input Fields(600356).",
  			"9999","Could not retrieve form input Fields(600356).", put_task_pform_reply_out)
  		go to exit_script
	endif
 
 
 
   	  ;filing out input portions
   	  select into "nl:"
   	  from (dummyt d1 with seq = form_input->section_cnt)
   	       ,(dummyt d2 with seq = 1)
   	       ,(dummyt d3 with seq = size(600356_rep->dta,5))
   	  plan d1
   	  	where maxrec(d2,form_input->section[d1.seq].input_cnt)
   	  join d2
   	  join d3
   	  	where 600356_rep->dta[d3.seq].task_assay_cd = form_input->section[d1.seq].inputs[d2.seq].dta_cd
   	  order by d1.seq, d2.seq
   	  head d1.seq
   	  	x = 0
 
   	  	head d2.seq
   	  		form_input->section[d1.seq].inputs[d2.seq].dta_description =  600356_rep->dta[d3.seq].description
   	  		form_input->section[d1.seq].inputs[d2.seq].event_cd = 600356_rep->dta[d3.seq].event_cd
 
   	  		case(600356_rep->dta[d3.seq].default_result_type_disp)
   	  			of "Alpha": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_txt_event_class_cd
   	  			of "Numeric": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_num_event_class_cd
   	  			of "Count": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_num_event_class_cd
   	  			of "Text": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_txt_event_class_cd
   	  			of "Freetext": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_txt_event_class_cd
   	  			of "Date and Time": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_date_event_class_cd
   	  			of "Date": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_date_event_class_cd
   	  			of "Time": form_input->section[d1.seq].inputs[d2.seq].event_class_cd = c_date_event_class_cd
   	  		endcase
   	  with nocounter
 
   	  ;looping through to put in the input values
   	  declare valIdx = i4
   	  declare ValSize = i4
   	  for(a = 1 to form_input->section_cnt)
   	  		;going through input fields
   	  		for(b = 1 to form_input->section[a].input_cnt)
 
   	  			;now have to loop through the input structure to match up input field
   	  			for(c = 1 to input_list->qual_cnt)
 
   	  			   ;checking if the input_fields are the same
   	  			   if(form_input->section[a].inputs[b].dcp_section_input_id = input_list->qual[c].input_id)
 
   	  			   		set valIdx = 0
   	  			   		set valSize = size(input_list->qual[c].values,5)
 						set textvalidx = 0
 						set dtIdx = 0
   	  			   		for(d = 1 to valSize)
   	  			   			;input response filler
 
   	  			   			;checking if it's a coded response
   	  			   			if(input_list->qual[c].values[d].response_id > 0)
   	  			   				set valIdx = valIdx + 1
   	  			   				set stat = alterlist(form_input->section[a].inputs[b].coded_response,valIdx)
   	  			   				set form_input->section[a].inputs[b].coded_response_cnt =
   	  			   												form_input->section[a].inputs[b].coded_response_cnt + 1
 
   	  			   				set form_input->section[a].inputs[b].coded_response[valIdx].response_id =
   	  			   																input_list->qual[c].values[d].response_id
   	  			   				set form_input->section[a].inputs[b].coded_response[valIdx].short_string =
   	  			   																input_list->qual[c].values[d].short_string
   	  			   				set form_input->section[a].inputs[b].coded_response[valIdx].description =
   	  			   																input_list->qual[c].values[d].description
   	  			   				set form_input->section[a].inputs[b].coded_response[valIdx].mnemonic =
   	  			   																input_list->qual[c].values[d].mnemonic
   	  			   			else
   	  			   				if(form_input->section[a].inputs[b].event_class_cd = c_date_event_class_cd)
   	  			   					set dtIdx = dtIdx + 1
   	  			   					set form_input->section[a].inputs[b].date_response_cnt =
   	  			   												form_input->section[a].inputs[b].date_response_cnt + 1
   	  			   					set stat = alterlist(form_input->section[a].inputs[b].date_response,dtIdx)
   	  			   					set form_input->section[a].inputs[b].date_response[dtIdx].date_response =
   	  			   											cnvtdatetime(input_list->qual[c].values[d].response)
 
   	  			   						;check if its a valid date
   	  			   				elseif(form_input->section[a].inputs[b].event_class_cd = c_txt_event_class_cd)
   	  			   					set textvalidx = textvalidx + 1
   	  			   					set form_input->section[a].inputs[b].string_response_cnt =
   	  			   												form_input->section[a].inputs[b].string_response_cnt + 1
   	  			   					set stat = alterlist(form_input->section[a].inputs[b].string_response,textvalidx)
   	  			   					set form_input->section[a].inputs[b].string_response[textvalidx].response =
   	  			   												 input_list->qual[c].values[d].response
   	  			   				endif
 
 
   	  			   			endif;;;
 
 
 
 
 
   	  			   		endfor;end d
 
 
   	  			   endif;input field checker
 
 				endfor; end c
 			endfor; end b
 	  endfor; end a
call echorecord(form_input)
 
 
	if(idebugFlag > 0)
		call echo(concat("BuildForminputs Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end;sub
 
 
/*************************************************************************
;  Name:  PostForm(null) = null 1000012 Add to clinical event table
;  Description:  Post the Form
**************************************************************************/
subroutine PostForm(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostForm Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iApplication = i4 WITH protect ,constant (600005)
	declare iTask = i4 WITH protect ,constant (600108)
	declare iRequest = i4 WITH protect ,constant (1000012)
 
	declare stepnum = i4
	declare happ = i4
	declare tasknum = i4
	declare htask = i4
	declare hstep = i4
	declare hrequest = i4
	declare hreply = i4
	declare hperson = i4
	declare htemplate = i4
	declare hfield = i4
	declare crmstatus = i2
 
	;Set Reference number
	declare iRefSeq = i4
	set iRefSeq = 0
	declare refLen = i4
 
 
 
	;;;starting the post
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			call ErrorHandler2("PUT TASK", "F", "UAR_CRMBEGINTASK",
			build2("Invalid uar_crmbegintask: ",cnvtstring(crmstatus)),"9999",
			build2("Invalid uar_crmbegintask: ",cnvtstring(crmstatus)), put_task_pform_reply_out)
			call uar_crmendapp (happ )
			go to exit_script
		endif
	else
	  call ErrorHandler2("PUT TASK", "F", "UAR_CRMBEGINAPP",
	  build2("Invalid uar_crmbeginapp: ",cnvtstring(crmstatus)),"9999",
	  build2("Invalid uar_crmbeginapp: ",cnvtstring(crmstatus)), put_task_pform_reply_out)
	  go to exit_script
	endif
 
	call echo ("Beginning the Request" )
	set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
	if ((crmstatus != 0 ) )
		call ErrorHandler2("PUT TASK", "F", "UAR_CRMBEGINREQ",
		build2("Invalid uar_crmbeginreq: ",cnvtstring(crmstatus)),"9999",
		build2("Invalid uar_crmbeginreq: ",cnvtstring(crmstatus)), put_task_pform_reply_out)
		go to exit_script
		call uar_crmendapp (happ )
	else
		set hrequest = uar_crmgetrequest (hstep )
 
		;;setting up the request
		;clin_event
		set stat = uar_srvsetshort(hrequest,"ensure_type", 1) ;1 - add new; 2 - update existing
 		set hce = uar_srvgetstruct(hrequest,"clin_event")
 
 
		if(hce)
 
			set stat = uar_srvsetlong(hce,"view_level",1)
			set stat = uar_srvsetdouble(hce,"order_id",dOrderId)
			set stat = uar_srvsetdouble(hce,"catalog_cd",500415_rep->catalog_cd)
			set stat = uar_srvsetdouble(hce,"person_id",dPatientId)
			set stat = uar_srvsetdouble(hce,"encntr_id",dEncounterId)
			set stat = uar_srvsetdouble(hce,"contributor_system_cd", c_ContriSysPCcd)
 
 
			declare dt_st = vc
			set dt_st = format(sysdate,"yyyymmddhhmmss00;;q")
			set sReferenceNumber = build2(trim(cnvtstring(dFormActivityId,25,6),3)
													,"!",dt_st," ",sTimeZone,"!",trim(cnvtstring(iRefSeq),3))
call echo(sReferenceNumber)
			set refLen = size(sReferenceNumber)
			set stat = uar_srvsetstringfixed(hce,"reference_nbr",sReferenceNumber,refLen)
			set stat = uar_srvsetdouble(hce,"event_class_cd",c_grp_event_class_cd)
			set stat = uar_srvsetdouble(hce,"event_cd",600373_rep->event_cd)
			set stat = uar_srvsetdouble(hce,"event_reltn_cd",c_root_event_reltn_cd)
 
			set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(curdate,curtime3))
			set stat = uar_srvsetdouble(hce,"record_status_cd",c_record_status_code_active_cd)
			set stat = uar_srvsetdouble(hce,"result_status_cd",c_result_status_code_auth_cd)
			set stat = uar_srvsetstring(hce,"event_title_text",600373_rep->description)
			set stat = uar_srvsetshort(hce,"authentic_flag",1)
			set stat = uar_srvsetshort(hce,"publish_flag",1)
 
			set coll_seq = trim(cnvtstring(600373_rep->dcp_forms_ref_id),3)
			set stat = uar_srvsetstring(hce,"collating_seq",coll_seq)
 
			set stat = uar_srvsetdouble(hce,"entry_mode_cd",c_powerform_entry_mode_cd)
			set stat = uar_srvsetlong(hce,"event_end_tz",3200310_rep->encounter.encounter_tz)
 
			; Result Set Link List
			set hreslink = uar_srvadditem(hce,"result_set_link_list")
			if(hreslink)
				set stat = uar_srvsetdouble(hreslink,"result_set_id",dResultSetId)
				set stat = uar_srvsetdouble(hreslink,"entry_type_cd",c_PformEntryTypecd)
			else
				call ErrorHandler2("PUT Task", "F", "HRESLINK",
				build2("Could not create HRESLINK"),"9999",
				build2("Could not create HRESLINK"), put_task_pform_reply_out)
				go to exit_script
			endif
 
 
			; Event_prsl
			set ePrsnlSize = 3
			for(i = 1 to ePrsnlSize )
					set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
					if(hprsnl)
						set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl,"action_tz",curtimezoneapp)
 
						case(i)
							of 1:;Order
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_order_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(500415_rep->orig_order_dt_tm))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",500415_rep->provider_id)
							of 2: ;Verify
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_verify_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",reqinfo->updt_id)
							of 3:  ;Perform
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_perform_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",reqinfo->updt_id)
 
						endcase
					else
						set error_msg = "Could not create hprsnl"
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, medadmin_reply_out)
						go to exit_script
					endif
				endfor
 
 
 
				;child_event sections
				for(x = 1 to form_input->section_cnt)
					set hce_type = uar_srvcreatetypefrom(hrequest,"clin_event")
					set hce_struct = uar_srvgetstruct(hrequest,"clin_event")
					set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type)
					set hsection = uar_srvadditem(hce_struct,"child_event_list")
 
call echo(build2("hce_type", hce_type))
call echo(build2("hce_struct",hce_struct))
call echo(build2("hsection",hsection))
 
 					if(hsection)
						call uar_srvbinditemtype (hsection ,"child_event_list" ,hce_type)
						set stat = uar_srvsetdouble(hsection,"order_id",dOrderId)
						set stat = uar_srvsetdouble(hsection,"catalog_cd",500415_rep->catalog_cd)
						set stat = uar_srvsetdouble(hsection,"person_id",dPatientId)
						set stat = uar_srvsetdouble(hsection,"encntr_id",dEncounterId)
						set stat = uar_srvsetdouble(hsection,"contributor_system_cd", c_ContriSysPCcd)
 
						set iRefSeq = iRefSeq + 1
						set sReferenceNumber = build2(trim(cnvtstring(dFormActivityId,25,6),3)
													,"!",dt_st," ",sTimeZone,"!",trim(cnvtstring(iRefSeq),3))
call echo(sReferenceNumber)
						set refLen = size(sReferenceNumber)
						set stat = uar_srvsetstringfixed(hsection,"reference_nbr",sReferenceNumber,refLen)
 
 						set stat = uar_srvsetdouble(hsection,"event_reltn_cd",c_child_event_reltn_cd)
						set stat = uar_srvsetdouble(hsection,"event_class_cd",c_grp_event_class_cd)
						set stat = uar_srvsetdouble(hsection,"event_cd",c_dcpgeneric_event_cd)
						set stat = uar_srvsetdate(hsection,"event_end_dt_tm",c_now_dt_tm)
						set stat = uar_srvsetdouble(hsection,"record_status_cd",c_record_status_code_active_cd)
						set stat = uar_srvsetdouble(hsection,"result_status_cd",c_result_status_code_auth_cd)
						set stat = uar_srvsetshort(hsection,"authentic_flag",1)
						set stat = uar_srvsetshort(hsection,"publish_flag",1)
						set stat = uar_srvsetstring(hsection,"event_title_text",nullterm(form_input->section[x].description))
						set coll_seq = trim(cnvtstring(form_input->section[x].dcp_section_ref_id),3)
						set stat = uar_srvsetstring(hsection,"collating_seq",coll_seq)
 
						set stat = uar_srvsetdouble(hsection,"entry_mode_cd",c_powerform_entry_mode_cd)
						set stat = uar_srvsetlong(hsection,"event_end_tz",iTimeZone)
 
						;event_prsnl
						set hsecprsnl = uar_srvadditem(hsection,"event_prsnl_list")
						if(hsecprsnl)
							set stat = uar_srvsetdouble(hsecprsnl,"action_type_cd",c_perform_action_type_cd)
							set stat = uar_srvsetdate(hsecprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
							set stat = uar_srvsetdouble(hsecprsnl,"action_prsnl_id",reqinfo->updt_id)
							set stat = uar_srvsetdouble(hsecprsnl,"action_status_cd",c_completed_action_status_cd)
							set stat = uar_srvsetlong(hsecprsnl,"action_tz",iTimeZone)
						endif
 
						;input dta's for the sections
						for(i = 1 to form_input->section[x].input_cnt)
							set hinput = uar_srvadditem(hsection,"child_event_list")
							if(hinput)
								call uar_srvbinditemtype (hinput ,"child_event_list" ,hce_type)
								set stat = uar_srvsetlong(hinput,"view_level",1)
								set stat = uar_srvsetdouble(hinput,"order_id",dOrderId)
								set stat = uar_srvsetdouble(hinput,"catalog_cd",500415_rep->catalog_cd)
								set stat = uar_srvsetdouble(hinput,"person_id",dPatientId)
								set stat = uar_srvsetdouble(hinput,"encntr_id",dEncounterId)
								set stat = uar_srvsetdouble(hinput,"contributor_system_cd",c_contributor_system_cd)
 
								set iRefSeq = iRefSeq + 1
								set sReferenceNumber = build2(trim(cnvtstring(dFormActivityId,25,6),3)
													,"!",dt_st," ",sTimeZone,"!",trim(cnvtstring(iRefSeq),3))
 								set refLen = size(sReferenceNumber)
								set stat = uar_srvsetstringfixed(hinput,"reference_nbr",sReferenceNumber,refLen)
call echo(sReferenceNumber)
 								set stat = uar_srvsetdouble(hinput,"event_reltn_cd",c_child_event_reltn_cd)
								set stat = uar_srvsetdouble(hinput,"event_class_cd"
															,form_input->section[x].inputs[i].event_class_cd);
								set stat = uar_srvsetdouble(hinput,"event_cd",form_input->section[x].inputs[i].event_cd)
								set stat = uar_srvsetdate(hinput,"event_end_dt_tm",c_now_dt_tm)
								set stat = uar_srvsetdouble(hinput,"task_assay_cd",form_input->section[x].inputs[i].dta_cd)
								set stat = uar_srvsetdouble(hinput,"record_status_cd",c_record_status_code_active_cd)
								set stat = uar_srvsetdouble(hinput,"result_status_cd",c_result_status_code_auth_cd)
								set stat = uar_srvsetshort(hinput,"authentic_flag",1)
								set stat = uar_srvsetshort(hinput,"publish_flag",1)
								set stat = uar_srvsetstring(hinput,"event_title_text"
															,nullterm(form_input->section[x].inputs[i].dta_description))
								set stat = uar_srvsetdouble(hinput,"entry_mode_cd",c_powerform_entry_mode_cd)
								set stat = uar_srvsetlong(hinput,"event_end_tz",iTimeZone)
								if(form_input->section[x].inputs[i].input_ref_seq < 10)
									set sCollatingSeq = build("000000000"
															,trim(cnvtstring(form_input->section[x].inputs[i].input_ref_seq,3)))
								else
									set sCollatingSeq = build("00000000"
															,trim(cnvtstring(form_input->section[x].inputs[i].input_ref_seq,3)))
								endif
								set stat = uar_srvsetstring(hinput,"collating_seq",nullterm(sCollatingSeq))
								; Event Prsnl
								set hinpprsnl = uar_srvadditem(hinput,"event_prsnl_list")
								if(hinpprsnl)
									set stat = uar_srvsetdouble(hinpprsnl,"action_type_cd",c_perform_action_type_cd)
									set stat = uar_srvsetdate(hinpprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
									set stat = uar_srvsetdouble(hinpprsnl,"action_prsnl_id",reqinfo->updt_id)
									set stat = uar_srvsetdouble(hinpprsnl,"action_status_cd",c_completed_action_status_cd)
									set stat = uar_srvsetlong(hinpprsnl,"action_tz",iTimeZone)
								endif
							endif
 
							;coded_response
							;if(form_input->section[x].inputs[i].coded_response_cnt > 0)
							;	set stat = uar_srvsetshort(hinput,"nomen_string_flag",2)
							;endif
							for(z = 1 to form_input->section[x].inputs[i].coded_response_cnt)
								set hcoded = uar_srvadditem(hinput,"coded_result_list")
								if(hcoded)
									set stat = uar_srvsetshort(hcoded,"ensure_type",2)
									set stat = uar_srvsetlong(hcoded,"sequence_nbr",z)
									set stat = uar_srvsetdouble(hcoded,"nomenclature_id"
										,form_input->section[x].inputs[i].coded_response[z].response_id)
									set stat = uar_srvsetstring(hcoded,"mnemonic"
										,nullterm(form_input->section[x].inputs[i].coded_response[z].mnemonic))
									set stat = uar_srvsetstring(hcoded,"short_string"
										,nullterm(form_input->section[x].inputs[i].coded_response[z].short_string))
									set stat = uar_srvsetstring(hcoded,"descriptor"
										,nullterm(form_input->section[x].inputs[i].coded_response[z].description))
 
								endif
							endfor
 
							;string result
							for(z = 1 to form_input->section[x].inputs[i].string_response_cnt)
								set hstring = uar_srvadditem(hinput,"string_result")
								if(hstring)
									set stringLen = size(form_input->section[x].inputs[i].string_response[z].response)
									set stat = uar_srvsetstringfixed(hstring,"string_result_text",
											form_input->section[x].inputs[i].string_response[z].response,stringLen)
 
									;;have to look at units of measure and string format code
								endif
							endfor
 
							;date result
							for(z = 1 to form_input->section[x].inputs[i].date_response_cnt)
								set hdate = uar_srvadditem(hinput,"date_result")
 
								set stat = uar_srvsetdate(hdate,"result_dt_tm"
										,form_input->section[x].inputs[i].date_response[z].date_response)
 
								set stat = uar_srvsetshort(hdate,"date_type_flag"
									,form_input->section[x].inputs[i].date_response[z].date_type_flag)
							endfor
 
						endfor
 
					endif
 
 
				endfor
 		endif
 
 		; Perform the request
		set crmstatus = uar_crmperform(hstep)
 
		if (crmstatus = 0)
			set hreply = uar_crmgetreply (hstep)
			if (hreply = 0)
		  	  	call ErrorHandler2("PUT TASK", "F", "UAR_CRMGETREPLY",
		  	  	build2("Invalid uar_crmgetreply: ",cnvtstring(hreply)),"9999",
		  	  	build2("Invalid uar_crmbeginapp: ",cnvtstring(hreply)), put_task_pform_reply_out)
		  	  	go to exit_script
			else
				; Get the Event Ids
				set rb_cnt = uar_srvgetitemcount (hreply ,"rb_list" )
				if (rb_cnt >= 1)
					set stat = alterlist(temp_events->qual,rb_cnt)
					set j = 0
					for(i = 1 to rb_cnt)
						set hrb = uar_srvgetitem (hreply ,"rb_list" ,j )
						if(i = 1)
							set dFormEventId = uar_srvgetdouble (hrb ,"parent_event_id" )
							set iValidate = 1
						endif
call echo(uar_srvgetdouble (hrb ,"event_id"))
						set temp_events->qual[i].event_id = uar_srvgetdouble (hrb ,"event_id")
						set j = j + 1
					endfor
				else
					call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Reply rb_list is empty",
					"9999", "Reply rb_list is empty", put_task_pform_reply_out)
					go to exit_script
				endif
			endif
		else
			  call ErrorHandler2("PUT TASK", "F", "UAR_CRMPERFORM",
			  build2("Invalid uar_crmperform: ",cnvtstring(crmstatus)),"9999",
			  build2("Invalid uar_crmperform: ",cnvtstring(crmstatus)), put_task_pform_reply_out)
			  go to exit_script
		endif
	endif;end crmstatus !=0
call echorecord(temp_events)
	if(idebugFlag > 0)
		call echo(concat("PostForm Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end;endsub
 
end
go
