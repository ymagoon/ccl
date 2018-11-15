/*****************************************************************************************
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
******************************************************************************************
	Source file name:   snsro_put_appointment
	Object name:        snsro_put_appointment
	Program purpose:    Updates an appointment in millennium
	Executing from:     MPages Discern Web Service
	Special Notes:      NONE
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date    Engineer    	Comment
------------------------------------------------------------------------------------------
000	09/10/18	RJC				Initial write
001 10/08/18	RJC				Fixed OE details updates and validated OE DateTime format
******************************************************************************************/
drop program snsro_put_appointment go
create program snsro_put_appointment
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		,"Username" = ""
		,"AppointmentId" = ""
		,"Json Object" = ""
		,"Debug Flag" = 0
 
with OUTDEV, USERNAME, APPT_ID, JSON, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;654903 - sch_get_event_schedule
free record 650685_req
record 650685_req (
  1 security_ind = i2
  1 security_user_id = f8
  1 call_echo_ind = i2
  1 qual [*]
    2 sch_event_id = f8
    2 schedule_seq = i4
    2 schedule_id = f8
    2 req_action_id = f8
    2 event_ind = i2
    2 detail_ind = i2
    2 comment_ind = i2
    2 patient_ind = i2
    2 location_ind = i2
    2 appt_ind = i2
    2 attach_ind = i2
    2 schedule_ind = i2
    2 recur_ind = i2
    2 recur_sibling_ind = i2
    2 denormalize_ind = i2
    2 lock_ind = i2
    2 option_ind = i2
    2 modification_ind = i2
    2 confirm_ind = i2
    2 request_ind = i2
    2 version_ind = i2
    2 protocol_sibling_ind = i2
    2 checkin_ind = i2
    2 request_info_ind = i2
    2 checkout_ind = i2
    2 patseen_ind = i2
    2 event_alias_ind = i2
    2 warning_ind = i2
    2 action_ind = i2
    2 move_criteria_ind = i2
    2 to_follow_ind = i2
    2 link_sibling_ind = i2
    2 restore_ind = i2
    2 apptdefer_ind = i2
)
 
free record 650685_rep
record 650685_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 sch_event_id = f8
     2 schedule_id = f8
     2 schedule_seq = i4
     2 requested_action_id = f8
     2 appt_type_cd = f8
     2 appt_type_disp = vc
     2 appt_synonym_cd = f8
     2 appt_synonym_free = vc
     2 surg_case_nbr_locn_cd = f8
     2 surg_case_nbr_yr = i4
     2 surg_case_nbr_cnt = i4
     2 accn_site_prefix = c5
     2 oe_format_id = f8
     2 order_sentence_id = f8
     2 sch_state_cd = f8
     2 state_meaning = vc
     2 res_list_id = f8
     2 recur_type_flag = i2
     2 recur_parent_id = f8
     2 days_of_week = c7
     2 recur_template_id = f8
     2 recur_seq_nbr = i4
     2 event_recur_id = f8
     2 recur_beg_dt_tm = dq8
     2 recur_parent_dt_tm = dq8
     2 sch_lock_id = f8
     2 lock_status_flag = i2
     2 granted_prsnl_id = f8
     2 protocol_type_flag = i2
     2 protocol_parent_id = f8
     2 protocol_appt_type_cd = f8
     2 protocol_seq_nbr = i4
     2 prot_loc_type_cd = f8
     2 prot_loc_type_meaning = vc
     2 protocol_location_cd = f8
     2 protocol_location_disp = vc
     2 offset_event_id = f8
     2 offset_seq_nbr = i4
     2 offset_pat_beg_dt_tm = dq8
     2 offset_pat_end_dt_tm = dq8
     2 offset_pat_setup = i4
     2 offset_pat_cleanup = i4
     2 offset_pat_duration = i4
     2 offset_res_beg_dt_tm = dq8
     2 offset_res_end_dt_tm = dq8
     2 offset_res_setup = i4
     2 offset_res_cleanup = i4
     2 offset_res_duration = i4
     2 offset_from_cd = f8
     2 offset_from_meaning = vc
     2 offset_type_cd = f8
     2 offset_type_meaning = vc
     2 offset_beg_units = i4
     2 offset_beg_units_cd = f8
     2 offset_beg_units_meaning = vc
     2 offset_end_units = i4
     2 offset_end_units_cd = f8
     2 offset_end_units_meaning = vc
     2 case_mod_allowed_ind = i2
     2 detail_qual_cnt = i4
     2 detail_qual [* ]
       3 oe_field_id = f8
       3 oe_field_value = f8
       3 oe_field_display_value = vc
       3 oe_field_dt_tm_value = dq8
       3 oe_field_meaning_id = f8
       3 oe_field_meaning = vc
       3 field_seq = i4
       3 candidate_id = f8
       3 version_dt_tm = dq8
     2 comment_qual_cnt = i4
     2 comment_qual [* ]
       3 text_type_cd = f8
       3 text_type_meaning = vc
       3 sub_text_cd = f8
       3 sub_text_meaning = vc
       3 text_id = f8
       3 text = vc
       3 version_dt_tm = dq8
     2 patient_qual_cnt = i4
     2 patient_qual [* ]
       3 person_id = f8
       3 encntr_id = f8
       3 name = vc
       3 sex = vc
       3 mrn = vc
       3 age = vc
       3 birth_dt_tm = dq8
       3 birth_tz = i4
       3 candidate_id = f8
       3 version_dt_tm = dq8
     2 location_qual_cnt = i4
     2 location_qual [* ]
       3 location_type_cd = f8
       3 location_type_meaning = vc
       3 location_cd = f8
       3 location_disp = vc
       3 organization_id = f8
     2 attach_qual_cnt = i4
     2 attach_qual [* ]
       3 sch_attach_id = f8
       3 attach_type_cd = f8
       3 attach_type_meaning = vc
       3 order_status_cd = f8
       3 order_status_meaning = vc
       3 order_id = f8
       3 primary_ind = i2
       3 concurrent_ind = i2
       3 order_seq_nbr = i4
     2 appt_qual_cnt = i4
     2 appt_qual [* ]
       3 sch_appt_id = f8
       3 resource_cd = f8
       3 resource_disp = vc
       3 person_id = f8
       3 booking_id = f8
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 apply_slot_id = f8
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 sch_role_cd = f8
       3 role_meaning = vc
       3 role_description = vc
       3 role_seq = i4
       3 primary_role_ind = i2
       3 appt_scheme_id = f8
       3 slot_type_id = f8
       3 slot_mnemonic = vc
       3 slot_scheme_id = f8
       3 description = vc
       3 apply_list_id = f8
       3 slot_state_cd = f8
       3 slot_state_meaning = vc
       3 list_role_id = f8
       3 bit_mask = i4
       3 interval = i4
       3 warn_bit_mask = i4
       3 setup_duration = i4
       3 duration = i4
       3 contiguous_ind = i4
       3 cleanup_duration = i4
       3 confirm_action_id = f8
       3 service_resource_cd = f8
     2 recur_qual_cnt = i4
     2 recur_qual [* ]
       3 event_recur_id = f8
       3 recur_state_cd = f8
       3 recur_state_meaning = c12
       3 recur_template_id = f8
       3 days_of_week = vc
       3 duration_type_flag = i2
       3 duration_units = i4
       3 duration_units_cd = f8
       3 duration_units_meaning = c12
       3 last_seq_nbr = i4
       3 start_dt_tm = dq8
       3 end_dt_tm = dq8
       3 last_dt_tm = dq8
       3 freq_qual_cnt = i4
       3 freq_qual [* ]
         4 frequency_id = f8
         4 beg_dt_tm = dq8
         4 end_dt_tm = dq8
         4 next_dt_tm = dq8
         4 end_type_cd = f8
         4 end_type_meaning = vc
         4 occurance = i4
         4 max_occurance = i4
         4 interval = i4
         4 counter = i4
         4 days_of_week = c10
         4 day_string = c31
         4 week_string = c6
         4 month_string = c12
         4 units = i4
         4 units_cd = f8
         4 units_meaning = vc
         4 freq_pattern_cd = f8
         4 freq_pattern_meaning = vc
         4 pattern_option = i4
         4 freq_date_qual_cnt = i4
         4 freq_date_qual [* ]
           5 frequency_id = f8
           5 date_dt_tm = dq8
           5 occurance = i4
           5 seq_nbr = i4
     2 sibling_qual_cnt = i4
     2 sibling_qual [* ]
       3 sch_event_id = f8
       3 schedule_id = f8
       3 schedule_seq = i4
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 req_action_id = f8
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
     2 denormalize_qual_cnt = i4
     2 denormalize_qual [* ]
       3 disp_field_id = f8
       3 disp_field_meaning = vc
       3 disp_value = f8
       3 disp_dt_tm = dq8
       3 disp_display = vc
       3 parent_table = vc
       3 parent_id = f8
     2 option_qual_cnt = i4
     2 option_qual [* ]
       3 sch_option_cd = f8
       3 option_meaning = vc
     2 modification_qual_cnt = i4
     2 modification_qual [* ]
       3 event_mod_id = f8
       3 list_role_id = f8
       3 resource_cd = f8
       3 slot_type_id = f8
       3 selected_ind = i2
     2 protocol_qual_cnt = i4
     2 protocol_qual [* ]
       3 sch_event_id = f8
       3 schedule_id = f8
       3 schedule_seq = i4
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 appt_type_cd = f8
       3 appt_type_disp = vc
       3 appt_synonym_cd = f8
       3 appt_synonym_disp = vc
       3 protocol_seq_nbr = i4
       3 loc_cnt = i4
       3 loc [* ]
         4 location_cd = f8
         4 offset_seq_nbr = i4
         4 offset_from_cd = f8
         4 offset_from_meaning = vc
         4 offset_type_cd = f8
         4 offset_type_meaning = vc
         4 offset_beg_units = i4
         4 offset_beg_units_cd = f8
         4 offset_beg_units_meaning = vc
         4 offset_end_units = i4
         4 offset_end_units_cd = f8
         4 offset_end_units_meaning = vc
     2 checkin_qual_cnt = i4
     2 checkin_qual [* ]
       3 checkin_dt_tm = dq8
     2 req_date_qual_cnt = i4
     2 req_date_qual [* ]
       3 scenario_nbr = i4
       3 seq_nbr = i4
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 days_of_week = c10
       3 time_restr_cd = f8
       3 time_restr_meaning = c12
       3 except_qual_cnt = i4
       3 except_qual [* ]
         4 exc_seq_nbr = i4
         4 beg_dt_tm = dq8
         4 end_dt_tm = dq8
     2 req_loc_qual_cnt = i4
     2 req_loc_qual [* ]
       3 scenario_nbr = i4
       3 seq_nbr = i4
       3 parent_seq_nbr = i4
       3 location_seq_nbr = i4
       3 location_type_cd = f8
       3 location_type_meaning = c12
       3 location_cd = f8
       3 location_disp = vc
       3 res_list_id = f8
       3 mod_qual_cnt = i4
       3 mod_qual [* ]
         4 action_mod_id = f8
         4 list_role_id = f8
         4 resource_cd = f8
         4 slot_type_id = f8
         4 selected_ind = i2
       3 organization_id = f8
     2 req_detail_qual_cnt = i4
     2 req_detail_qual [* ]
       3 oe_field_id = f8
       3 oe_field_value = f8
       3 oe_field_display_value = vc
       3 oe_field_dt_tm_value = dq8
       3 oe_field_meaning_id = f8
       3 oe_field_meaning = vc
       3 field_seq = i4
       3 candidate_id = f8
       3 version_dt_tm = dq8
     2 req_comment_qual_cnt = i4
     2 req_comment_qual [* ]
       3 text_type_cd = f8
       3 text_type_meaning = vc
       3 sub_text_cd = f8
       3 sub_text_meaning = vc
       3 text_id = f8
       3 text = vc
       3 version_dt_tm = dq8
     2 checkin_dt_tm = dq8
     2 checkout_dt_tm = dq8
     2 patseen_dt_tm = dq8
     2 patseen_comments = vc
     2 event_alias_qual_cnt = i4
     2 event_alias_qual [* ]
       3 sch_event_alias_id = f8
       3 alias = vc
       3 event_alias_type_cd = f8
       3 event_alias_sub_type_cd = f8
       3 alias_pool_cd = f8
       3 check_digit = i4
       3 check_digit_method_cd = f8
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
       3 data_status_cd = f8
       3 contributor_system_cd = f8
       3 updt_cnt = i4
       3 active_ind = i2
       3 active_status_cd = f8
     2 warning_qual_cnt = i4
     2 warning_qual [* ]
       3 sch_warn_id = f8
       3 schedule_id = f8
       3 sch_appt_id = f8
       3 warn_type_cd = f8
       3 warn_type_meaning = c12
       3 warn_batch_cd = f8
       3 warn_batch_meaning = c12
       3 warn_level_cd = f8
       3 warn_level_meaning = c12
       3 warn_class_cd = f8
       3 warn_class_meaning = c12
       3 warn_reason_cd = f8
       3 warn_reason_meaning = c12
       3 warn_state_cd = f8
       3 warn_state_meaning = c12
       3 warn_option_cd = f8
       3 warn_option_meaning = c12
       3 warn_prsnl_id = f8
       3 warn_dt_tm = dq8
       3 bit_mask = i4
       3 option_qual_cnt = i4
       3 option_qual [* ]
         4 sch_option_id = f8
         4 warn_level_cd = f8
         4 warn_level_meaning = c12
         4 warn_class_cd = f8
         4 warn_class_meaning = c12
         4 warn_reason_cd = f8
         4 warn_reason_meaning = c12
         4 warn_prsnl_id = f8
         4 comment_qual_cnt = i4
         4 comment_qual [* ]
           5 text_type_cd = f8
           5 text_type_meaning = c12
           5 sub_text_cd = f8
           5 sub_text_meaning = c12
           5 text_id = f8
           5 long_text = vc
     2 action_qual_cnt = i4
     2 action_qual [* ]
       3 sch_action_id = f8
       3 schedule_id = f8
       3 sch_action_cd = f8
       3 action_meaning = c12
       3 action_prsnl_id = f8
       3 action_dt_tm = dq8
       3 perform_dt_tm = dq8
       3 sch_reason_cd = f8
       3 reason_meaning = c12
       3 conversation_id = f8
       3 eso_action_cd = f8
       3 eso_action_meaning = c12
       3 orig_action_id = f8
       3 req_action_id = f8
       3 req_action_cd = f8
       3 req_action_meaning = c12
       3 ver_interchange_id = f8
       3 ver_status_cd = f8
       3 ver_status_meaning = c12
       3 abn_conv_id = f8
       3 product_cd = f8
       3 hipaa_action_cd = f8
     2 candidate_id = f8
     2 grpsession_id = f8
     2 grp_desc = vc
     2 grp_capacity = i4
     2 grp_nbr_sched = i4
     2 grp_flag = i2
     2 grp_shared_ind = i2
     2 grp_closed_ind = i2
     2 grp_beg_dt_tm = dq8
     2 grp_end_dt_tm = dq8
     2 move_criteria_qual_cnt = i4
     2 move_criteria_qual [* ]
       3 move_flag = i2
       3 move_pref_beg_tm = i4
       3 move_pref_end_tm = i4
       3 move_requestor = vc
       3 move_comment = vc
       3 version_dt_tm = dq8
     2 link_sibling_qual_cnt = i4
     2 link_sibling_qual [* ]
       3 sch_event_id = f8
       3 sch_link_id = f8
       3 schedule_id = f8
       3 schedule_seq = i4
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 req_action_id = f8
       3 appt_synonym_cd = f8
       3 appt_synonym_disp = vc
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
     2 tofollow_exists_ind = i2
     2 recur_cd = f8
     2 recur_meaning = vc
     2 link_parent_flag = i2
     2 req_complete_ind = i2
     2 completed_order_ind = i2
     2 patientdefercount = i4
     2 hospitaldefercount = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
 
;650613 - sch_get_appt_type_by_id
free record 650613_req
record 650613_req (
  1 qual [*]
    2 appt_type_cd = f8
)
 
free record 650613_rep
record 650613_rep (
  1 qual_cnt = i4
  1 catalog_type_cd = f8
  1 catalog_type_meaning = vc
  1 mnemonic_type_cd = f8
  1 mnemonic_type_meaning = vc
  1 qual [*]
    2 appt_type_cd = f8
    2 appt_type_flag = i2
    2 desc = vc
    2 oe_format_id = f8
    2 info_sch_text_id = f8
    2 info_sch_text = vc
    2 info_sch_text_updt_cnt = i4
    2 recur_cd = f8
    2 recur_meaning = vc
    2 person_accept_cd = f8
    2 person_accept_meaning = vc
    2 grp_resource_cd = f8
    2 grp_resource_mnem = vc
    2 updt_cnt = i4
    2 active_ind = i2
    2 candidate_id = f8
    2 object_cnt = i4
    2 object [*]
      3 assoc_type_cd = f8
      3 sch_object_id = f8
      3 object_mnemonic = vc
      3 assoc_type_meanin = vc
      3 assoc_type_disp = vc
      3 seq_nbr = i4
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
    2 routing_cnt = i4
    2 routing [*]
      3 object_mnemonic = vc
      3 location_cd = f8
      3 location_meaning = vc
      3 location_disp = vc
      3 sch_action_cd = f8
      3 sch_action_disp = vc
      3 seq_nbr = i4
      3 action_meaning = vc
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 beg_units_disp = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 end_units_disp = vc
      3 routing_table = vc
      3 routing_id = f8
      3 routing_meaning = vc
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
      3 sch_flex_id = f8
    2 catalog_qual_cnt = i4
    2 catalog_qual [*]
      3 child_cd = f8
      3 child_meaning = vc
      3 child_disp = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 mnemonic_qual_cnt = i4
    2 mnemonic_qual [*]
      3 child_cd = f8
      3 child_meaning = vc
      3 child_disp = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 syn_cnt = i4
    2 syn [*]
      3 appt_synonym_cd = f8
      3 mnem = vc
      3 allow_selection_flag = i2
      3 info_sch_text_id = f8
      3 info_sch_text = vc
      3 info_sch_text_updt_cnt = i4
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 primary_ind = i2
      3 order_sentence_id = f8
    2 states_cnt = i4
    2 states [*]
      3 sch_state_cd = f8
      3 disp_scheme_id = f8
      3 state_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 locs_cnt = i4
    2 locs [*]
      3 location_cd = f8
      3 location_disp = vc
      3 location_desc = vc
      3 location_mean = vc
      3 sch_flex_id = f8
      3 res_list_id = f8
      3 res_list_mnem = vc
      3 grp_res_list_id = f8
      3 grp_res_list_mnem = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 option_cnt = i4
    2 option [*]
      3 sch_option_cd = f8
      3 option_disp = vc
      3 option_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 product_cnt = i4
    2 product [*]
      3 product_cd = f8
      3 product_disp = vc
      3 product_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 text_cnt = i4
    2 text [*]
      3 text_link_id = f8
      3 location_cd = f8
      3 location_meaning = vc
      3 location_display = vc
      3 text_type_cd = f8
      3 text_type_meaning = vc
      3 sub_text_cd = f8
      3 sub_text_meaning = vc
      3 text_accept_cd = f8
      3 text_accept_meaning = vc
      3 template_accept_cd = f8
      3 template_accept_meaning = vc
      3 sch_action_cd = f8
      3 action_meaning = vc
      3 expertise_level = i4
      3 lapse_units = i4
      3 lapse_units_cd = f8
      3 lapse_units_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sub_list_cnt = i4
      3 sub_list [*]
        4 template_id = f8
        4 seq_nbr = i4
        4 mnem = vc
        4 required_ind = i2
        4 updt_cnt = i4
        4 active_ind = i2
        4 candidate_id = f8
        4 sch_flex_id = f8
        4 temp_flex_cnt = i4
        4 temp_flex [*]
          5 parent2_table = vc
          5 parent2_id = f8
          5 flex_seq_nbr = i4
          5 updt_cnt = i4
          5 active_ind = i2
          5 candidate_id = f8
          5 mnemonic = vc
    2 order_cnt = i4
    2 orders [*]
      3 required_ind = i2
      3 seq_nbr = i4
      3 synonym_id = f8
      3 alt_sel_category_id = f8
      3 mnemonic = vc
      3 catalog_cd = f8
      3 catalog_type_cd = f8
      3 activity_type_cd = f8
      3 mnemonic_type_cd = f8
      3 oe_format_id = f8
      3 order_sentence_id = f8
      3 orderable_type_flag = i2
      3 ref_text_mask = i4
      3 hide_flag = i2
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 comp_cnt = i4
    2 comp [*]
      3 appt_type_cd = f8
      3 location_cd = f8
      3 location_disp = vc
      3 location_meaning = vc
      3 seq_nbr = i4
      3 comp_appt_synonym = vc
      3 comp_appt_synonym_cd = f8
      3 comp_appt_type_cd = f8
      3 offset_from_cd = f8
      3 offset_from_meaning = vc
      3 offset_type_cd = f8
      3 offset_type_meaning = vc
      3 offset_seq_nbr = i4
      3 offset_beg_units = i4
      3 offset_beg_units_cd = f8
      3 offset_beg_units_meaning = vc
      3 offset_end_units = i4
      3 offset_end_units_cd = f8
      3 offset_end_units_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 comp_loc_cnt = i4
      3 comp_loc [*]
        4 comp_location_cd = f8
        4 comp_location_disp = vc
        4 comp_location_desc = vc
        4 comp_location_mean = vc
        4 updt_cnt = i4
        4 active_ind = i2
        4 candidate_id = f8
    2 inter_cnt = i4
    2 inter [*]
      3 location_cd = f8
      3 inter_type_cd = f8
      3 inter_type_meaning = vc
      3 seq_group_id = f8
      3 mnemonic = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 dup_cnt = i4
    2 dup [*]
      3 dup_type_cd = f8
      3 dup_disp = vc
      3 dup_mean = vc
      3 location_cd = f8
      3 location_disp = vc
      3 location_mean = vc
      3 seq_nbr = i4
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 beg_units_disp = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 end_units_disp = vc
      3 dup_action_cd = f8
      3 dup_action_meaning = vc
      3 holiday_weekend_flag = i2
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
    2 nomen_cnt = i4
    2 nomen [*]
      3 appt_nomen_cd = f8
      3 appt_nomen_disp = vc
      3 appt_nomen_mean = vc
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
      3 nomen_list_cnt = i4
      3 nomen_list [*]
        4 seq_nbr = i4
        4 beg_nomenclature_id = f8
        4 end_nomenclature_id = f8
        4 source_string = vc
        4 updt_cnt = i4
        4 candidate_id = f8
        4 active_ind = i2
    2 notify_cnt = i4
    2 notify [*]
      3 location_cd = f8
      3 sch_flex_id = f8
      3 location_disp = vc
      3 sch_action_cd = f8
      3 action_mean = vc
      3 seq_nbr = i4
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 sch_route_id = f8
      3 route_mnemonic = vc
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
    2 appt_action_cnt = i4
    2 appt_action [*]
      3 location_cd = f8
      3 location_disp = vc
      3 location_mean = vc
      3 sch_action_cd = f8
      3 sch_action_disp = vc
      3 sch_action_mean = vc
      3 seq_nbr = i4
      3 child_appt_syn_cd = f8
      3 child_appt_syn_disp = vc
      3 child_appt_syn_mean = vc
      3 sch_flex_id = f8
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
      3 offset_beg_units = i4
      3 offset_beg_units_cd = f8
      3 offset_beg_units_disp = vc
      3 offset_beg_units_mean = vc
      3 offset_end_units = i4
      3 offset_end_units_cd = f8
      3 offset_end_units_disp = vc
      3 offset_end_units_mean = vc
    2 grp_prompt_cd = f8
    2 grp_prompt_meaning = vc
    2 rel_appt_syn_qual_cnt = i4
    2 rel_appt_syn_qual [*]
      3 appt_synonym_cd = f8
      3 mnem = vc
      3 allow_selection_flag = i2
      3 info_sch_text_id = f8
      3 info_sch_text = vc
      3 info_sch_text_updt_cnt = i4
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 primary_ind = i2
      3 order_sentence_id = f8
      3 sch_appt_type_syn_r_id = f8
      3 appt_type_cd = f8
      3 rel_syn_type_cd = f8
      3 default_ind = i2
    2 rel_med_svc_cnt = i4
    2 rel_med_svc_qual [*]
      3 med_service_id = f8
      3 med_service_cd = f8
      3 med_service_disp = vc
      3 med_service_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sch_action_cd = f8
    2 rel_enc_type_cnt = i4
    2 rel_enc_type_qual [*]
      3 encntr_type_id = f8
      3 encntr_type_cd = f8
      3 encntr_type_disp = vc
      3 encntr_type_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sch_action_cd = f8
      3 seq_nbr = i4
    2 rel_specialty_cnt = i4
    2 rel_specialty_qual [*]
      3 sch_at_specialty_r_id = f8
      3 specialty_cd = f8
      3 specialty_disp = vc
      3 specialty_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 priority_seq = i4
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;560000 - ORM.FmtQuery
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
 
;650328 - sch_get_appt_block
free record 650328_req
record 650328_req (
  1 call_echo_ind = i2
  1 security_ind = i2
  1 security_user_id = f8
  1 secured_scheme_ind = i2
  1 secured_scheme_id = f8
  1 qual [*]
    2 resource_cd = f8
    2 person_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 resource_ind = i2
    2 person_ind = i2
)
 
free record 650328_rep
record 650328_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 resource_cd = f8
     2 person_id = f8
     2 qual_cnt = i4
     2 appointment [* ]
       3 view_sec_ind = i2
       3 sch_appt_id = f8
       3 appt_type_cd = f8
       3 appt_type_desc = vc
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 orig_beg_dt_tm = dq8
       3 orig_end_dt_tm = dq8
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 sch_event_id = f8
       3 schedule_seq = i4
       3 schedule_id = f8
       3 location_cd = f8
       3 appt_reason_free = vc
       3 location_freetext = vc
       3 appt_synonym_cd = f8
       3 appt_synonym_free = vc
       3 duration = i4
       3 setup_duration = i4
       3 cleanup_duration = i4
       3 appt_scheme_id = f8
       3 req_prsnl_id = f8
       3 req_prsnl_name = vc
       3 primary_resource_cd = f8
       3 primary_resource_mnem = vc
       3 slot_type_id = f8
       3 sch_flex_id = f8
       3 interval = i4
       3 apply_def_id = f8
       3 slot_mnemonic = vc
       3 slot_scheme_id = f8
       3 description = vc
       3 apply_list_id = f8
       3 slot_state_cd = f8
       3 slot_state_meaning = vc
       3 def_slot_id = f8
       3 border_style = i4
       3 border_size = i4
       3 border_color = i4
       3 shape = i4
       3 pen_shape = i4
       3 apply_slot_id = f8
       3 booking_id = f8
       3 contiguous_ind = i2
       3 primary_synonym_id = f8
       3 primary_description = vc
       3 surgeon_id = f8
       3 surgeon_disp = vc
       3 surgeon2_id = f8
       3 surgeon2_disp = vc
       3 surgeon3_id = f8
       3 surgeon3_disp = vc
       3 surgeon4_id = f8
       3 surgeon4_disp = vc
       3 surgeon5_id = f8
       3 surgeon5_disp = vc
       3 anesthesia_id = f8
       3 anesthesia_disp = vc
       3 anesthesia2_id = f8
       3 anesthesia2_disp = vc
       3 anesthesia3_id = f8
       3 anesthesia3_disp = vc
       3 anesthesia4_id = f8
       3 anesthesia4_disp = vc
       3 anesthesia5_id = f8
       3 anesthesia5_disp = vc
       3 priority_cd = f8
       3 priority_display = vc
       3 anesthesia_type_cd = f8
       3 anesthesia_type_display = vc
       3 sch_role_cd = f8
       3 role_meaning = vc
       3 surg_case_id = f8
       3 surg_case_display = vc
       3 encntr_type_cd = f8
       3 encntr_type_display = vc
       3 last_verified_dt_tm = dq8
       3 t_appttype_granted = i2
       3 t_location_granted = i2
       3 t_slottype_granted = i2
       3 qual_cnt = i4
       3 patient [* ]
         4 person_id = f8
         4 name = vc
         4 encntr_id = f8
         4 parent_id = f8
         4 person_hom_phone = vc
         4 person_bus_phone = vc
         4 birth_dt_tm = dq8
         4 birth_tz = i4
       3 bit_mask = i4
       3 warn_bit_mask = i4
       3 release_ind = i2
       3 def_qual_cnt = i4
       3 def_qual [* ]
         4 appt_def_id = f8
         4 beg_dt_tm = dq8
         4 end_dt_tm = dq8
         4 duration = i4
         4 slot_type_id = f8
         4 sch_flex_id = f8
         4 interval = i4
         4 slot_mnemonic = vc
         4 description = vc
         4 slot_scheme_id = f8
         4 t_slottype_granted = i2
       3 role_seq = i2
       3 grpsession_id = f8
       3 grp_desc = vc
       3 grp_capacity = i4
       3 grp_nbr_sched = i4
       3 grp_appt_type_cd = f8
       3 grp_appt_type_syn_free = vc
       3 grp_location_cd = f8
       3 grp_location_free = vc
       3 link_flag = i4
       3 par_release_ind = i2
       3 ubrn = vc
       3 t_grp_location_granted = i2
       3 t_grp_appttype_granted = i2
       3 mrn = vc
       3 ssn = vc
       3 referral_encntr_closed_ind = i2
       3 cdi_work_items_cnt = i4
       3 cdi_work_items [* ]
         4 cdi_work_item_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;654633 - sch_get_order_roles
free record 654633_req
record 654633_req (
  1 security_ind = i2
  1 security_user_id = f8
  1 call_echo_ind = i2
  1 qual [*]
    2 sch_event_id = f8
    2 appt_type_cd = f8
    2 protocol_appt_type_cd = f8
    2 person_accept_meaning = c12
    2 location_cd = f8
    2 res_list_id = f8
    2 person_id = f8
    2 encntr_id = f8
    2 dyn_roles_flag = i2
    2 dyn_duration_flag = i2
    2 dyn_appt_prsnl_flag = i2
    2 dyn_appt_prsnl_setup_flag = i2
    2 dyn_appt_prsnl_cleanup_flag = i2
    2 dyn_order_prsnl_flag = i2
    2 dyn_order_prsnl_setup_flag = i2
    2 dyn_order_prsnl_cleanup_flag = i2
    2 dyn_order_pref_flag = i2
    2 dyn_order_pref_setup_flag = i2
    2 dyn_order_pref_cleanup_flag = i2
    2 token_pass_ind = i2
    2 token_qual_cnt = i4
    2 token_qual [*]
      3 flex_token_meaning = c12
      3 data_type_meaning = c12
      3 oe_field_id = f8
      3 oe_field_meaning_id = f8
      3 oe_field_meaning = c25
      3 dt_tm_value = dq8
      3 double_value = f8
      3 string_value = vc
    2 prsnl_qual_cnt = i4
    2 prsnl_qual [*]
      3 prsnl_id = f8
      3 resource_cd = f8
      3 role_meaning = vc
      3 role_description = vc
      3 resource_quota = i4
    2 order_qual_cnt = i4
    2 order_qual [*]
      3 order_id = f8
      3 catalog_cd = f8
      3 seq_nbr = i4
      3 concurrent_ind = i2
      3 event_concurrent_ind = i2
      3 override_setup_ind = i2
      3 setup = i4
      3 override_duration_ind = i2
      3 duration = i4
      3 override_cleanup_ind = i2
      3 cleanup = i4
      3 override_arrival_ind = i2
      3 arrival = i4
      3 override_recovery_ind = i2
      3 recovery = i4
      3 token_pass_ind = i2
      3 token_qual_cnt = i4
      3 token_qual [*]
        4 flex_token_meaning = c12
        4 data_type_meaning = c12
        4 oe_field_id = f8
        4 oe_field_meaning_id = f8
        4 oe_field_meaning = c25
        4 dt_tm_value = dq8
        4 double_value = f8
        4 string_value = vc
      3 prsnl_qual_cnt = i4
      3 prsnl_qual [*]
        4 prsnl_id = f8
        4 resource_cd = f8
        4 role_meaning = vc
        4 role_description = vc
        4 resource_quota = i4
      3 pref_qual_cnt = i4
      3 pref_qual [*]
        4 list_role_id = f8
        4 quantity = i4
    2 grp_flag = i2
  1 flex_check_ind = i2
)
 
free record 654633_rep
record 654633_rep (
   1 call_echo_ind = i2
   1 qual_cnt = i4
   1 qual [* ]
     2 sch_event_id = f8
     2 appt_type_cd = f8
     2 location_cd = f8
     2 person_id = f8
     2 encntr_id = f8
     2 setup_defined_ind = i2
     2 setup = i4
     2 duration_defined_ind = i2
     2 duration = i4
     2 cleanup_defined_ind = i2
     2 cleanup = i4
     2 arrival_defined_ind = i2
     2 arrival = i4
     2 recovery_defined_ind = i2
     2 recovery = i4
     2 concurrent_defined_ind = i2
     2 concurrent = i4
     2 order_qual_cnt = i4
     2 order_qual [* ]
       3 order_id = f8
       3 catalog_cd = f8
       3 seq_nbr = i4
       3 concurrent_ind = i2
       3 event_concurrent_ind = i2
       3 setup_defined_ind = i2
       3 setup = i4
       3 duration_defined_ind = i2
       3 duration = i4
       3 cleanup_defined_ind = i2
       3 cleanup = i4
       3 arrival_defined_ind = i2
       3 arrival = i4
       3 recovery_defined_ind = i2
       3 recovery = i4
     2 res_list_mnem = vc
     2 role_qual_cnt = i4
     2 role_qual [* ]
       3 list_role_id = f8
       3 generic_role_ind = i2
       3 order_role_override_dur_ind = i2
       3 sch_role_cd = f8
       3 role_meaning = c12
       3 role_seq = i4
       3 description = vc
       3 primary_ind = i2
       3 optional_ind = i2
       3 defining_ind = i2
       3 algorithm_cd = f8
       3 algorithm_meaning = c12
       3 prompt_accept_cd = f8
       3 prompt_accept_meaning = c12
       3 selected_ind = i2
       3 role_type_cd = f8
       3 role_type_meaning = c12
       3 mnemonic = vc
       3 sch_flex_id = f8
       3 resch_prev_res_ind = i2
       3 res_qual_cnt = i4
       3 res_qual [* ]
         4 resource_cd = f8
         4 resource_disp = c40
         4 resource_desc = c60
         4 resource_mean = c12
         4 pref_ind = i2
         4 search_seq = i4
         4 display_seq = i4
         4 selected_ind = i2
         4 view_sec_ind = i2
         4 schedule_sec_ind = i2
         4 res_sch_cd = f8
         4 res_sch_meaning = c12
         4 sch_flex_id = f8
         4 service_resource_cd = f8
         4 resource_quota = i4
         4 slot_qual_cnt = i4
         4 slot_qual [* ]
           5 slot_type_id = f8
           5 mnem = vc
           5 sch_flex_id = f8
           5 contiguous_ind = i2
           5 setup_units = i4
           5 setup_units_cd = f8
           5 setup_units_meaning = c12
           5 setup_role_id = f8
           5 duration_role_id = f8
           5 duration_units = i4
           5 duration_units_cd = f8
           5 duration_units_meaning = c12
           5 cleanup_units = i4
           5 cleanup_units_cd = f8
           5 cleanup_units_meaning = c12
           5 cleanup_role_id = f8
           5 offset_type_cd = f8
           5 offset_type_meaning = c12
           5 offset_role_id = f8
           5 offset_beg_units = i4
           5 offset_beg_units_cd = f8
           5 offset_beg_units_meaning = c12
           5 offset_end_units = i4
           5 offset_end_units_cd = f8
           5 offset_end_units_meaning = c12
           5 view_slot_ind = i2
           5 selected_ind = i2
           5 flex_pass_ind = i2
         4 res_type_flag = i2
         4 person_id = f8
         4 flex_pass_ind = i2
       3 order_role_duration_flag = i2
       3 flex_pass_ind = i2
       3 role_concurrent_ind = i2
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;651603 - sch_check_times
free record 651603_req
record 651603_req (
  1 call_echo_ind = i2
  1 qual [*]
    2 resource_cd = f8
    2 resource_quota = i4
    2 person_id = f8
    2 encntr_id = f8
    2 apply_slot_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 release_offset = i4
    2 force_create_ind = i2
    2 appt_type_cd = f8
    2 location_cd = f8
    2 sch_role_cd = f8
    2 role_meaning = vc
    2 outside_ind = i2
    2 order_qual_cnt = i4
    2 order_qual [*]
      3 catalog_cd = f8
      3 synonym_id = f8
      3 order_mnemonic = vc
      3 order_status_cd = f8
      3 order_status_meaning = c12
    2 seq_nbr = i4
    2 orig_beg_dt_tm = dq8
    2 orig_end_dt_tm = dq8
    2 group_uuid = vc
    2 event_uuid = vc
    2 participant_uuid = vc
  1 resource_quota_ind = i2
  1 hold_qual_cnt = i4
  1 hold_qual [*]
    2 booking_id = f8
    2 status = i2
  1 quota_ind = i2
  1 security_ind = i2
  1 load_resource_ind = i2
)
 
free record 651603_rep
record 651603_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 resource_cd = f8
     2 person_id = f8
     2 encntr_id = f8
     2 apply_slot_id = f8
     2 beg_dt_tm = dq8
     2 end_dt_tm = dq8
     2 booking_id = f8
     2 candidate_id = f8
     2 status = i2
     2 conflict_qual_cnt = i4
     2 conflict [* ]
       3 booking_id = f8
       3 apply_slot_id = f8
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 status_flag = i2
       3 status_meaning = c12
       3 granted_dt_tm = dq8
       3 granted_prsnl_id = f8
       3 granted_prsnl_name = vc
       3 verify_dt_tm = dq8
       3 written_dt_tm = dq8
       3 release_dt_tm = dq8
       3 appt_type_cd = f8
       3 appt_type_display = vc
       3 t_appttype_granted = i2
       3 location_cd = f8
       3 location_display = vc
       3 sch_role_cd = f8
       3 sch_role_display = vc
       3 role_meaning = vc
       3 pat_prnsl_conflict = i2
       3 t_location_granted = i2
     2 order_qual_cnt = i4
     2 order_qual [* ]
       3 status = i2
     2 quota_limit_qual_cnt = i4
     2 quota_limit_qual [* ]
       3 quota_type_cd = f8
       3 quota_limit = i4
       3 quota_overbook_limit = i4
       3 beg_tm = i4
       3 end_tm = i4
       3 quota_cnt = i4
       3 time_restr_cd = f8
       3 days_of_week = c7
     2 quota_limit_flag = i2
     2 quota_override_flag = i2
     2 group_uuid = vc
     2 event_uuid = vc
     2 participant_uuid = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;651604 - sch_verify_times
free record 651604_req
record 651604_req (
  1 call_echo_ind = i2
  1 resource_quota_ind = i2
  1 qual [*]
    2 booking_id = f8
    2 resource_cd = f8
    2 person_id = f8
    2 encntr_id = f8
    2 apply_slot_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 release_offset = i4
    2 force_create_ind = i2
    2 updt_cnt = i4
    2 appt_type_cd = f8
    2 location_cd = f8
    2 sch_role_cd = f8
    2 role_meaning = vc
    2 resource_quota = i4
    2 outside_ind = i2
    2 order_qual_cnt = i4
    2 order_qual [*]
      3 catalog_cd = f8
      3 synonym_id = f8
      3 order_mnemonic = vc
      3 order_status_cd = f8
      3 order_status_meaning = c12
    2 seq_nbr = i4
  1 hold_qual_cnt = i4
  1 hold_qual [*]
    2 booking_id = f8
    2 status = i2
  1 quota_ind = i2
  1 security_ind = i2
)
 
free record 651604_rep
record 651604_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 booking_id = f8
     2 new_booking_id = f8
     2 new_candidate_id = f8
     2 release_dt_tm = dq8
     2 release_prsnl_id = f8
     2 release_prsnl_name = vc
     2 status = i2
     2 conflict_qual_cnt = i4
     2 conflict [* ]
       3 booking_id = f8
       3 apply_slot_id = f8
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 status_flag = i2
       3 status_meaning = c12
       3 granted_dt_tm = dq8
       3 granted_prsnl_id = f8
       3 granted_prsnl_name = vc
       3 verify_dt_tm = dq8
       3 written_dt_tm = dq8
       3 release_dt_tm = dq8
       3 appt_type_cd = f8
       3 appt_type_display = vc
       3 t_appttype_granted = i2
       3 location_cd = f8
       3 location_display = vc
       3 sch_role_cd = f8
       3 sch_role_display = vc
       3 role_meaning = vc
     2 order_qual_cnt = i4
     2 order_qual [* ]
       3 status = i2
     2 quota_limit_qual_cnt = i4
     2 quota_limit_qual [* ]
       3 quota_type_cd = f8
       3 quota_limit = i4
       3 quota_overbook_limit = i4
       3 beg_tm = i4
       3 end_tm = i4
       3 quota_cnt = i4
     2 quota_limit_flag = i2
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
; 651853 - sch_get_order_seq
free record 651853_req
record 651853_req (
  1 call_echo_ind = i2
  1 number = i4
  1 event_number = i4
)
 
free record 651853_rep
record 651853_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 order_id = f8
   1 event_qual_cnt = i4
   1 event_qual [* ]
     2 sch_event_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;651863 - sch_check_lock
free record 651863_req
record 651863_req (
  1 call_echo_ind = i2
  1 qual [*]
    2 parent_table = vc
    2 parent_id = f8
    2 release_offset = i4
    2 force_create_ind = i2
    2 sch_action_cd = f8
    2 action_meaning = vc
    2 hold_qual_cnt = i4
    2 hold_qual [*]
      3 sch_lock_id = f8
)
 
free record 651863_rep
record 651863_rep (
	1 qual_cnt = i4
    1 qual [* ]
      2 parent_table = vc
      2 parent_id = f8
      2 sch_lock_id = f8
      2 candidate_id = f8
      2 status = i2
      2 sch_action_cd = f8
      2 action_meaning = vc
      2 status_flag = i2
      2 status_meaning = c12
      2 conflict_qual_cnt = i4
      2 conflict [* ]
        3 sch_lock_id = f8
        3 status_flag = i2
        3 status_meaning = c12
        3 granted_dt_tm = dq8
        3 granted_prsnl_id = f8
        3 granted_prsnl_name = vc
        3 verify_dt_tm = dq8
        3 written_dt_tm = dq8
        3 release_dt_tm = dq8
        3 sch_action_cd = f8
        3 sch_action_disp = vc
        3 action_meaning = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;651864 - sch_verify_lock
free record 651864_req
record 651864_req (
  1 call_echo_ind = i2
  1 stop_auto_create_ind = i2
  1 qual [*]
    2 sch_lock_id = f8
    2 parent_table = vc
    2 parent_id = f8
    2 release_offset = i4
    2 force_create_ind = i2
    2 updt_cnt = i4
    2 sch_action_cd = f8
    2 action_meaning = vc
    2 hold_qual_cnt = i4
    2 hold_qual [*]
      3 sch_lock_id = f8
)
 
free record 651864_rep
record 651864_rep (
    1 qual_cnt = i4
    1 qual [* ]
      2 sch_lock_id = f8
      2 new_sch_lock_id = f8
      2 new_candidate_id = f8
      2 release_dt_tm = dq8
      2 release_prsnl_id = f8
      2 release_prsnl_name = vc
      2 status = i2
      2 sch_action_cd = f8
      2 action_meaning = vc
      2 conflict_qual_cnt = i4
      2 conflict [* ]
        3 sch_lock_id = f8
        3 status_flag = i2
        3 status_meaning = c12
        3 granted_dt_tm = dq8
        3 granted_prsnl_id = f8
        3 granted_prsnl_name = vc
        3 verify_dt_tm = dq8
        3 written_dt_tm = dq8
        3 release_dt_tm = dq8
        3 sch_action_cd = f8
        3 sch_action_disp = vc
        3 action_meaning = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;651864 - sch_del_lock
free record 651862_req
record 651862_req (
  1 call_echo_ind = i2
  1 qual [*]
    2 sch_lock_id = f8
    2 updt_cnt = i4
    2 allow_partial_ind = i2
    2 force_updt_ind = i2
)
 
free record 651862_rep
record 651862_rep (
    1 qual_cnt = i4
    1 qual [* ]
      2 status = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;651000 - sch_write_event
free record 651000_req
record 651000_req (
  1 conversation_id = f8
  1 call_echo_ind = i2
  1 action_dt_tm = dq8
  1 allow_partial_ind = i2
  1 product_cd = f8
  1 product_meaning = c12
  1 add_on_ind = i2
  1 addl_supplies_ind = i2
  1 anesth_prsnl_id = f8
  1 sch_event_id = f8
  1 cancel_dt_tm = dq8
  1 cancel_reason_cd = f8
  1 cancel_req_by_id = f8
  1 cancel_req_by_text = vc
  1 encntr_id = f8
  1 person_id = f8
  1 sched_case_type_cd = f8
  1 sched_dur = i4
  1 sched_op_loc_cd = f8
  1 sched_pat_type_cd = f8
  1 sched_setup_dur = i4
  1 sched_start_dt_tm = dq8
  1 sched_surg_area_cd = f8
  1 sched_type_cd = f8
  1 surg_area_cd = f8
  1 surg_case_id = f8
  1 surg_start_dt_tm = dq8
  1 surg_stop_dt_tm = dq8
  1 surg_specialty_id = f8
  1 case_level_cd = f8
  1 wound_class_cd = f8
  1 asa_class_cd = f8
  1 surg_op_loc_cd = f8
  1 surgeon_prsnl_id = f8
  1 transaction = i2
  1 changes = i4
  1 comment_partial_ind = i2
  1 comment_qual_cnt = i4
  1 comment_qual [*]
    2 action = i2
    2 text_type_cd = f8
    2 text_type_meaning = vc
    2 sub_text_cd = f8
    2 sub_text_meaning = vc
    2 text_action = i2
    2 text = vc
    2 text_id = f8
    2 text_updt_cnt = i4
    2 text_active_ind = i2
    2 text_active_status_cd = f8
    2 text_force_updt_ind = i2
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 summary_partial_ind = i2
  1 summary_qual_cnt = i4
  1 summary_qual [*]
    2 action = i2
    2 sch_notify_id = f8
    2 base_route_id = f8
    2 sch_report_id = f8
    2 output_dest_id = f8
    2 to_prsnl_id = f8
    2 suffix = vc
    2 email = vc
    2 transmit_dt_tm = dq8
    2 nbr_copies = i4
    2 source_type_cd = f8
    2 source_type_meaning = vc
    2 report_type_cd = f8
    2 report_type_meaning = vc
    2 requested_dt_tm = dq8
    2 printed_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 itinerary_partial_ind = i2
  1 itinerary_qual_cnt = i4
  1 itinerary_qual [*]
    2 action = i2
    2 sch_notify_id = f8
    2 base_route_id = f8
    2 sch_report_id = f8
    2 output_dest_id = f8
    2 to_prsnl_id = f8
    2 suffix = vc
    2 email = vc
    2 transmit_dt_tm = dq8
    2 nbr_copies = i4
    2 source_type_cd = f8
    2 source_type_meaning = vc
    2 report_type_cd = f8
    2 report_type_meaning = vc
    2 report_table = vc
    2 report_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 requested_dt_tm = dq8
    2 printed_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 qual [*]
    2 action = i2
    2 sch_action_cd = f8
    2 action_meaning = vc
    2 sch_event_id = f8
    2 skip_tofollow_ind = i2
    2 surg_case_nbr_locn_cd = f8
    2 surg_case_nbr_yr = i4
    2 surg_case_nbr_cnt = i4
    2 accn_site_prefix = vc
    2 tci_dt_tm = dq8
    2 schedule_seq = i4
    2 request_action_id = f8
    2 occurance_number = i4
    2 appt_type_cd = f8
    2 appt_synonym_cd = f8
    2 appt_synonym_mnem = vc
    2 appt_reason = vc
    2 rscd_appt_scheme_id = f8
    2 rscd_schedule_id = f8
    2 sch_reason_cd = f8
    2 reason_meaning = vc
    2 contributor_system_cd = f8
    2 oe_format_id = f8
    2 order_sentence_id = f8
    2 appt_beg_dt_tm = dq8
    2 appt_end_dt_tm = dq8
    2 appt_duration = i4
    2 sch_state_cd = f8
    2 state_meaning = vc
    2 sch_action_id = f8
    2 rscd_action_id = f8
    2 lock_flag = i2
    2 unlock_action_id = f8
    2 verify_flag = i2
    2 abn_flag = i2
    2 confirm_flag = i2
    2 confirm_action_id = f8
    2 sch_lock_id = f8
    2 req_prsnl_id = f8
    2 req_prsnl_desc = vc
    2 recur_type_flag = i2
    2 recur_parent_id = f8
    2 recur_parent_index = i4
    2 recur_template_id = f8
    2 recur_template_index = i4
    2 recur_seq_nbr = i4
    2 event_recur_id = f8
    2 event_recur_index = i4
    2 protocol_type_flag = i2
    2 protocol_parent_id = f8
    2 protocol_parent_index = i4
    2 protocol_seq_nbr = i4
    2 protocol_location_cd = f8
    2 protocol_location_freetext = vc
    2 offset_event_id = f8
    2 offset_event_index = i4
    2 offset_from_cd = f8
    2 offset_from_meaning = vc
    2 offset_type_cd = f8
    2 offset_type_meaning = vc
    2 offset_beg_units = i4
    2 offset_beg_units_cd = f8
    2 offset_beg_units_meaning = vc
    2 offset_end_units = i4
    2 offset_end_units_cd = f8
    2 offset_end_units_meaning = vc
    2 version_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
    2 comment_partial_ind = i2
    2 comment_qual_cnt = i4
    2 comment_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 text_type_cd = f8
      3 text_type_meaning = vc
      3 sub_text_cd = f8
      3 sub_text_meaning = vc
      3 text_action = i2
      3 text = vc
      3 text_id = f8
      3 text_updt_cnt = i4
      3 text_active_ind = i2
      3 text_active_status_cd = f8
      3 text_force_updt_ind = i2
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
    2 patient_partial_ind = i2
    2 patient_qual_cnt = i4
    2 patient_qual [*]
      3 action = i2
      3 patient_person_id = f8
      3 patient_encntr_id = f8
      3 person_desc = vc
      3 encntr_desc = vc
      3 encntr_type_cd = f8
      3 encntr_type_display = vc
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 capacity_planned_ind = i2
      3 sch_loc_booking_id = f8
      3 release_capacity_flag = i2
      3 profile_type_cd = f8
    2 alias_partial_ind = i2
    2 alias_qual_cnt = i4
    2 alias_qual [*]
      3 action = i2
      3 sch_event_alias_id = f8
      3 alias = vc
      3 event_alias_type_cd = f8
      3 event_alias_sub_type_cd = f8
      3 alias_pool_cd = f8
      3 check_digit = i4
      3 check_digit_method_cd = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
    2 detail_partial_ind = i2
    2 detail_qual_cnt = i4
    2 detail_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 oe_field_id = f8
      3 oe_field_value = f8
      3 oe_field_display_value = vc
      3 oe_field_dt_tm_value = dq8
      3 oe_field_meaning = vc
      3 oe_field_meaning_id = f8
      3 value_required_ind = i2
      3 group_seq = i4
      3 field_seq = i4
      3 modified_ind = i2
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
    2 attach_partial_ind = i2
    2 attach_qual_cnt = i4
    2 attach_qual [*]
      3 action = i2
      3 primary_ind = i2
      3 concurrent_ind = i2
      3 order_seq_nbr = i4
      3 sch_attach_id = f8
      3 attach_type_cd = f8
      3 attach_type_meaning = vc
      3 order_status_cd = f8
      3 order_status_meaning = vc
      3 seq_nbr = i4
      3 order_id = f8
      3 sch_state_cd = f8
      3 state_meaning = c12
      3 beg_schedule_seq = i4
      3 end_schedule_seq = i4
      3 event_dt_tm = dq8
      3 order_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 synonym_id = f8
      3 description = vc
      3 attach_source_flag = i2
    2 option_pass_ind = i2
    2 option_qual_cnt = i4
    2 option_qual [*]
      3 sch_option_cd = f8
      3 option_meaning = vc
    2 recur_partial_ind = i2
    2 recur_qual_cnt = i4
    2 recur_qual [*]
      3 action = i2
      3 event_recur_id = f8
      3 recur_state_cd = f8
      3 recur_state_meaning = vc
      3 recur_template_id = f8
      3 recur_template_index = i4
      3 days_of_week = c7
      3 duration_type_flag = i2
      3 duration_units = i4
      3 duration_units_cd = f8
      3 duration_units_meaning = vc
      3 last_seq_nbr = i4
      3 start_dt_tm = dq8
      3 end_dt_tm = dq8
      3 last_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 freq_qual_cnt = i4
      3 freq_qual [*]
        4 action = i2
        4 frequency_id = f8
        4 freq_type_cd = f8
        4 freq_type_meaning = c12
        4 freq_state_cd = f8
        4 freq_state_meaning = c12
        4 end_type_cd = f8
        4 end_type_meaning = c12
        4 beg_dt_tm = dq8
        4 end_dt_tm = dq8
        4 next_dt_tm = dq8
        4 max_dt_tm = dq8
        4 max_occurance = i4
        4 occurance = i4
        4 interval = i4
        4 days_of_week = c7
        4 day_string = c31
        4 week_string = c6
        4 month_string = c12
        4 counter = i4
        4 units = i4
        4 units_cd = f8
        4 units_meaning = c12
        4 freq_pattern_cd = f8
        4 freq_pattern_meaning = c12
        4 pattern_option = i4
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
        4 date_qual_cnt = i4
        4 date_qual [*]
          5 action = i2
          5 occurance = i4
          5 date_dt_tm = dq8
          5 seq_nbr = i4
    2 carry_warning_partial_ind = i2
    2 carry_warning_qual_cnt = i4
    2 carry_warning_qual [*]
      3 warn_type_cd = f8
      3 warn_type_meaning = vc
    2 warning_partial_ind = i2
    2 warning_qual_cnt = i4
    2 warning_qual [*]
      3 action = i2
      3 sch_warn_id = f8
      3 warn_type_cd = f8
      3 warn_type_meaning = vc
      3 warn_batch_cd = f8
      3 warn_batch_meaning = vc
      3 warn_level_cd = f8
      3 warn_level_meaning = vc
      3 warn_class_cd = f8
      3 warn_class_meaning = vc
      3 warn_reason_cd = f8
      3 warn_reason_meaning = vc
      3 warn_state_cd = f8
      3 warn_state_meaning = vc
      3 warn_option_cd = f8
      3 warn_option_meaning = vc
      3 bit_mask = i4
      3 schedule_id = f8
      3 schedule_index = i4
      3 sch_appt_id = f8
      3 sch_appt_index = i4
      3 sch_action_id = f8
      3 sch_action_index = i4
      3 warn_prsnl_id = f8
      3 warn_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 option_partial_ind = i2
      3 option_qual_cnt = i4
      3 option_qual [*]
        4 action = i2
        4 sch_option_id = f8
        4 warn_reason_cd = f8
        4 warn_reason_meaning = vc
        4 warn_option_cd = f8
        4 warn_option_meaning = vc
        4 warn_level_cd = f8
        4 warn_level_meaning = vc
        4 warn_class_cd = f8
        4 warn_class_meaning = vc
        4 warn_prsnl_id = f8
        4 warn_dt_tm = dq8
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
        4 comment_partial_ind = i2
        4 comment_qual_cnt = i4
        4 comment_qual [*]
          5 action = i2
          5 text_type_cd = f8
          5 text_type_meaning = vc
          5 sub_text_cd = f8
          5 sub_text_meaning = vc
          5 text_action = i2
          5 text = vc
          5 text_id = f8
          5 text_updt_cnt = i4
          5 text_active_ind = i2
          5 text_active_status_cd = f8
          5 text_force_updt_ind = i2
          5 updt_cnt = i4
          5 version_ind = i2
          5 force_updt_ind = i2
          5 candidate_id = f8
          5 active_ind = i2
          5 active_status_cd = f8
    2 action_partial_ind = i2
    2 action_qual_cnt = i4
    2 action_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 schedule_id = f8
      3 schedule_index = i4
      3 sch_action_cd = f8
      3 action_meaning = vc
      3 action_prsnl_id = f8
      3 action_dt_tm = dq8
      3 sch_reason_cd = f8
      3 reason_meaning = vc
      3 ver_interchange_id = f8
      3 ver_status_cd = f8
      3 ver_status_meaning = c12
      3 abn_conv_id = f8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 practice_org_id = f8
      3 referring_resource_cd = f8
    2 schedule_partial_ind = i2
    2 schedule_qual_cnt = i4
    2 schedule_qual [*]
      3 action = i2
      3 schedule_id = f8
      3 sch_state_cd = f8
      3 state_meaning = vc
      3 appt_location_cd = f8
      3 appt_location_freetext = vc
      3 res_list_id = f8
      3 unconfirm_count = i4
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 schedule_beg_flag = i4
      3 schedule_beg_dt_tm = dq8
      3 modification_partial_ind = i2
      3 modification_qual_cnt = i4
      3 modification_qual [*]
        4 action = i2
        4 event_mod_id = f8
        4 list_role_id = f8
        4 resource_cd = f8
        4 slot_type_id = f8
        4 selected_ind = i2
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
      3 notification_partial_ind = i2
      3 notification_qual_cnt = i4
      3 notification_qual [*]
        4 action = i2
        4 sch_notify_id = f8
        4 sch_action_id = f8
        4 base_route_id = f8
        4 sch_report_id = f8
        4 output_dest_id = f8
        4 to_prsnl_id = f8
        4 suffix = vc
        4 email = vc
        4 transmit_dt_tm = dq8
        4 nbr_copies = i4
        4 source_type_cd = f8
        4 source_type_meaning = vc
        4 report_type_cd = f8
        4 report_type_meaning = vc
        4 requested_dt_tm = dq8
        4 printed_dt_tm = dq8
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
      3 resource_partial_ind = i2
      3 resource_qual_cnt = i4
      3 resource_qual [*]
        4 action = i2
        4 sch_appt_id = f8
        4 resource_cd = f8
        4 old_beg_dt_tm = dq8
        4 old_end_dt_tm = dq8
        4 beg_dt_tm = dq8
        4 end_dt_tm = dq8
        4 vis_beg_dt_tm = dq8
        4 vis_end_dt_tm = dq8
        4 orig_beg_dt_tm = dq8
        4 orig_end_dt_tm = dq8
        4 resource_offset = i4
        4 duration = i4
        4 setup_duration = i4
        4 cleanup_duration = i4
        4 res_type_flag = i2
        4 person_id = f8
        4 encntr_id = f8
        4 service_resource_cd = f8
        4 patient_ind = i2
        4 overbook_ind = i2
        4 slot_type_id = f8
        4 slot_mnemonic = vc
        4 slot_scheme_id = f8
        4 description = vc
        4 appt_scheme_id = f8
        4 contiguous_ind = i2
        4 border_size = i4
        4 border_style = i4
        4 border_color = i4
        4 shape = i4
        4 pen_shape = i4
        4 slot_state_cd = f8
        4 slot_state_meaning = vc
        4 slot_vis_beg_dt_tm = dq8
        4 slot_vis_end_dt_tm = dq8
        4 apply_slot_id = f8
        4 sch_role_cd = f8
        4 sch_role_meaning = vc
        4 primary_role_ind = i2
        4 allow_sub_cd = f8
        4 allow_sub_meaning = vc
        4 sch_state_cd = f8
        4 state_meaning = vc
        4 resource_desc = vc
        4 apply_list_id = f8
        4 apply_def_id = f8
        4 exclude_ind = i2
        4 sch_type_id = f8
        4 holiday_weekend_flag = i2
        4 def_slot_id = f8
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
        4 booking_id = f8
        4 list_role_id = f8
        4 role_seq = i4
        4 bit_mask = i4
        4 warn_bit_mask = i4
        4 alert_bit_mask = i4
        4 defining_ind = i2
        4 role_description = vc
        4 comment_partial_ind = i2
        4 comment_qual_cnt = i4
        4 comment_qual [*]
          5 action = i2
          5 text_type_cd = f8
          5 text_type_meaning = vc
          5 sub_text_cd = f8
          5 sub_text_meaning = vc
          5 text_action = i2
          5 text = vc
          5 text_id = f8
          5 text_updt_cnt = i4
          5 text_active_ind = i2
          5 text_active_status_cd = f8
          5 text_force_updt_ind = i2
          5 updt_cnt = i4
          5 version_ind = i2
          5 force_updt_ind = i2
          5 candidate_id = f8
          5 active_ind = i2
          5 active_status_cd = f8
        4 detail_partial_ind = i2
        4 detail_qual_cnt = i4
        4 detail_qual [*]
          5 action = i2
          5 sch_action_id = f8
          5 oe_field_id = f8
          5 oe_field_value = f8
          5 oe_field_display_value = vc
          5 oe_field_dt_tm_value = dq8
          5 oe_field_meaning = vc
          5 oe_field_meaning_id = f8
          5 value_required_ind = i2
          5 group_seq = i4
          5 field_seq = i4
          5 modified_ind = i2
          5 updt_cnt = i4
          5 version_ind = i2
          5 force_updt_ind = i2
          5 candidate_id = f8
          5 active_ind = i2
          5 active_status_cd = f8
        4 sch_date_apply_id = f8
        4 group_slot_link_value = f8
      3 grpsession_id = f8
      3 additional_minute_nbr = i4
    2 requests_pass_ind = i2
    2 requests_qual_cnt = i4
    2 requests_qual [*]
      3 request_action_id = f8
      3 sch_action_cd = f8
      3 action_meaning = c12
    2 move_criteria_partial_ind = i2
    2 move_criteria_qual_cnt = i4
    2 move_criteria_qual [*]
      3 action = i2
      3 move_flag = i2
      3 move_pref_beg_tm = i4
      3 move_pref_end_tm = i4
      3 move_requestor = vc
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 comment_partial_ind = i2
      3 comment_qual_cnt = i4
      3 comment_qual [*]
        4 action = i2
        4 text_type_cd = f8
        4 text_type_meaning = vc
        4 sub_text_cd = f8
        4 sub_text_meaning = vc
        4 text_action = i2
        4 text = vc
        4 text_id = f8
        4 text_updt_cnt = i4
        4 text_active_ind = i2
        4 text_active_status_cd = f8
        4 text_force_updt_ind = i2
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
    2 offer_qual_cnt = i4
    2 offer_qual [*]
      3 pm_offer_id = f8
      3 encntr_id = f8
      3 schedule_id = f8
      3 arrived_on_time_ind = i2
      3 reasonable_offer_ind = i2
      3 remove_from_wl_ind = i2
      3 pat_initiated_ind = i2
      3 attendance_cd = f8
      3 admit_offer_outcome_cd = f8
      3 offer_type_cd = f8
      3 outcome_of_attendance_cd = f8
      3 sch_reason_cd = f8
      3 wl_reason_for_removal_cd = f8
      3 offer_dt_tm = dq8
      3 offer_made_dt_tm = dq8
      3 tci_dt_tm = dq8
      3 wl_removal_dt_tm = dq8
      3 appt_dt_tm = dq8
      3 cancel_dt_tm = dq8
      3 dna_dt_tm = dq8
      3 active_ind = i2
      3 active_ind_ind = i2
      3 episode_activity_status_cd = f8
    2 grp_flag = i2
    2 grp_desc = vc
    2 grp_capacity = i4
    2 grp_nbr_sched = i4
    2 grp_resource_cd = f8
    2 grp_slot_beg_dt_tm = dq8
    2 grp_slot_end_dt_tm = dq8
    2 rscd_grpsession_id = f8
    2 link_ind = i2
    2 grp_shared_ind = i2
    2 grp_closed_ind = i2
    2 grp_beg_dt_tm = dq8
    2 grp_end_dt_tm = dq8
    2 cab_ind = i2
    2 refer_dt_tm = dq8
    2 orig_action_prsnl_id = f8
    2 orig_perform_dt_tm = dq8
    2 abn_total_price = f8
    2 abn_total_price_format = vc
    2 comment_ind = i2
    2 susp_phys_ovr_cnt = i4
    2 susp_phys_ovr [*]
      3 physician_type_cd = f8
      3 physician_prsnl_id = f8
      3 authorized_prsnl_id = f8
      3 comment_text = vc
  1 pm_output_dest_cd = f8
)
 
free record 651000_rep
record 651000_rep (
    1 surg_case_id = f8
    1 status = i2
    1 create_dt_tm = dq8
    1 surg_case_nbr = vc
    1 surg_case_nbr_locn_cd = f8
    1 surg_area_cd = f8
    1 surg_case_nbr_yr = i4
    1 surg_case_nbr_cnt = i4
    1 accn_site_prefix = c5
    1 err_title = vc
    1 errors [* ]
      2 err_msg = vc
    1 conversation_id = f8
    1 comment_qual_cnt = i4
    1 comment_qual [* ]
      2 candidate_id = f8
      2 text_id = f8
      2 status = i2
    1 summary_qual_cnt = i4
    1 summary_qual [* ]
      2 sch_notify_id = f8
      2 candidate_id = f8
      2 status = i2
    1 itinerary_qual_cnt = i4
    1 itinerary_qual [* ]
      2 sch_notify_id = f8
      2 candidate_id = f8
      2 status = i2
    1 qual_cnt = i4
    1 qual [* ]
      2 sch_event_id = f8
      2 candidate_id = f8
      2 status = i2
      2 sch_action_id = f8
      2 action_candidate_id = f8
      2 action_status = i2
      2 rscd_action_id = f8
      2 rscd_status = i2
      2 rscd_candidate_id = f8
      2 unlock_action_id = f8
      2 unlock_status = i2
      2 unlock_candidate_id = f8
      2 confirm_action_id = f8
      2 confirm_status = i2
      2 confirm_candidate_id = f8
      2 comment_qual_cnt = i4
      2 comment_qual [* ]
        3 candidate_id = f8
        3 text_id = f8
        3 status = i2
      2 patient_qual_cnt = i4
      2 patient_qual [* ]
        3 candidate_id = f8
        3 status = i2
      2 alias_qual_cnt = i4
      2 alias_qual [* ]
        3 sch_event_alias_id = f8
        3 candidate_id = f8
        3 status = i2
      2 detail_qual_cnt = i4
      2 detail_qual [* ]
        3 candidate_id = f8
        3 status = i2
      2 attach_qual_cnt = i4
      2 attach_qual [* ]
        3 sch_attach_id = f8
        3 candidate_id = f8
        3 status = i2
      2 recur_qual_cnt = i4
      2 recur_qual [* ]
        3 event_recur_id = f8
        3 candidate_id = f8
        3 status = i2
        3 freq_qual_cnt = i4
        3 freq_qual [* ]
          4 frequency_id = f8
          4 candidate_id = f8
          4 status = i2
          4 sch_action_id = f8
          4 date_qual_cnt = i4
          4 date_qual [* ]
            5 candidate_id = f8
            5 status = i2
      2 action_qual_cnt = i4
      2 action_qual [* ]
        3 sch_action_id = f8
        3 candidate_id = f8
        3 status = i2
      2 warning_qual_cnt = i4
      2 warning_qual [* ]
        3 sch_warn_id = f8
        3 candidate_id = f8
        3 status = i2
        3 option_qual_cnt = i4
        3 option_qual [* ]
          4 sch_option_id = f8
          4 candidate_id = f8
          4 status = i2
          4 comment_qual_cnt = i4
          4 comment_qual [* ]
            5 text_id = f8
            5 candidate_id = f8
            5 status = i2
      2 schedule_qual_cnt = i4
      2 schedule_qual [* ]
        3 schedule_id = f8
        3 candidate_id = f8
        3 text_id = f8
        3 status = i2
        3 modification_qual_cnt = i4
        3 modification_qual [* ]
          4 event_mod_id = f8
          4 candidate_id = f8
          4 status = i2
        3 notification_qual_cnt = i4
        3 notification_qual [* ]
          4 sch_notify_id = f8
          4 candidate_id = f8
          4 status = i2
        3 resource_qual_cnt = i4
        3 resource_qual [* ]
          4 sch_appt_id = f8
          4 candidate_id = f8
          4 booking_id = f8
          4 booking_candidate_id = f8
          4 status = i2
          4 comment_qual_cnt = i4
          4 comment_qual [* ]
            5 text_id = f8
            5 candidate_id = f8
            5 status = i2
          4 detail_qual_cnt = i4
          4 detail_qual [* ]
            5 text_id = f8
            5 candidate_id = f8
            5 status = i2
      2 requests_qual_cnt = i4
      2 requests_qual [* ]
        3 status = i2
      2 move_criteria_qual_cnt = i4
      2 move_criteria_qual [* ]
        3 candidate_id = f8
        3 status = i2
        3 comment_qual_cnt = i4
        3 comment_qual [* ]
          4 text_id = f8
          4 candidate_id = f8
          4 status = i2
      2 offer_qual_cnt = i4
      2 offer_qual [* ]
        3 pm_offer_id = f8
        3 status = i2
      2 sch_state_cd = f8
      2 state_meaning = vc
      2 susp_phys_ovr_cnt = i4
      2 susp_phys_ovr [* ]
        3 sch_warning_id = f8
        3 comment_text_id = f8
        3 status = i2
    1 grp_capacity_fail_ind = i2
    1 invalid_referral_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;651001 - sch_chgw_event_state
free record 651001_req
record 651001_req (
  1 call_echo_ind = i2
  1 action_dt_tm = dq8
  1 conversation_id = f8
  1 skip_post_event_ind = i2
  1 product_cd = f8
  1 product_meaning = c12
  1 comment_partial_ind = i2
  1 comment_qual_cnt = i4
  1 comment_qual [*]
    2 action = i2
    2 text_type_cd = f8
    2 text_type_meaning = vc
    2 sub_text_cd = f8
    2 sub_text_meaning = vc
    2 text_action = i2
    2 text = vc
    2 text_id = f8
    2 text_updt_cnt = i4
    2 text_active_ind = i2
    2 text_active_status_cd = f8
    2 text_force_updt_ind = i2
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 summary_partial_ind = i2
  1 summary_qual_cnt = i4
  1 summary_qual [*]
    2 action = i2
    2 sch_notify_id = f8
    2 base_route_id = f8
    2 sch_report_id = f8
    2 output_dest_id = f8
    2 to_prsnl_id = f8
    2 suffix = vc
    2 email = vc
    2 transmit_dt_tm = dq8
    2 nbr_copies = i4
    2 source_type_cd = f8
    2 source_type_meaning = vc
    2 report_type_cd = f8
    2 report_type_meaning = vc
    2 requested_dt_tm = dq8
    2 printed_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 itinerary_partial_ind = i2
  1 itinerary_qual_cnt = i4
  1 itinerary_qual [*]
    2 action = i2
    2 sch_notify_id = f8
    2 base_route_id = f8
    2 sch_report_id = f8
    2 output_dest_id = f8
    2 to_prsnl_id = f8
    2 suffix = vc
    2 email = vc
    2 transmit_dt_tm = dq8
    2 nbr_copies = i4
    2 source_type_cd = f8
    2 source_type_meaning = vc
    2 report_type_cd = f8
    2 report_type_meaning = vc
    2 report_table = vc
    2 report_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 requested_dt_tm = dq8
    2 printed_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 active_ind = i2
    2 active_status_cd = f8
  1 allow_partial_ind = i2
  1 qual [*]
    2 sch_event_id = f8
    2 skip_tofollow_ind = i2
    2 schedule_seq = i4
    2 schedule_id = f8
    2 request_action_id = f8
    2 sch_action_cd = f8
    2 action_meaning = vc
    2 sch_reason_cd = f8
    2 reason_meaning = vc
    2 sch_state_cd = f8
    2 state_meaning = vc
    2 sch_action_id = f8
    2 lock_flag = i2
    2 unlock_action_id = f8
    2 sch_lock_id = f8
    2 appt_scheme_id = f8
    2 perform_dt_tm = dq8
    2 verify_flag = i2
    2 ver_interchange_id = f8
    2 ver_status_cd = f8
    2 ver_status_meaning = c12
    2 verify_action_id = f8
    2 abn_flag = i2
    2 retain_review_ind = i2
    2 abn_conv_id = f8
    2 abn_action_id = f8
    2 move_appt_ind = i2
    2 move_appt_dt_tm = dq8
    2 tci_dt_tm = dq8
    2 version_dt_tm = dq8
    2 updt_cnt = i4
    2 version_ind = i2
    2 force_updt_ind = i2
    2 candidate_id = f8
    2 cancel_order_flag = i2
    2 comment_partial_ind = i2
    2 comment_qual_cnt = i4
    2 comment_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 text_type_cd = f8
      3 text_type_meaning = vc
      3 sub_text_cd = f8
      3 sub_text_meaning = vc
      3 text_action = i2
      3 text = vc
      3 text_id = f8
      3 text_updt_cnt = i4
      3 text_active_ind = i2
      3 text_active_status_cd = f8
      3 text_force_updt_ind = i2
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 predefined_comm_cd = f8
    2 detail_partial_ind = i2
    2 detail_qual_cnt = i4
    2 detail_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 oe_field_id = f8
      3 oe_field_value = f8
      3 oe_field_display_value = vc
      3 oe_field_dt_tm_value = dq8
      3 oe_field_meaning = vc
      3 oe_field_meaning_id = f8
      3 value_required_ind = i2
      3 group_seq = i4
      3 field_seq = i4
      3 modified_ind = i2
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
    2 attach_partial_ind = i2
    2 attach_qual_cnt = i4
    2 attach_qual [*]
      3 action = i2
      3 primary_ind = i2
      3 order_seq_nbr = i4
      3 concurrent_ind = i2
      3 sch_attach_id = f8
      3 attach_type_cd = f8
      3 attach_type_meaning = vc
      3 order_status_cd = f8
      3 order_status_meaning = vc
      3 seq_nbr = i4
      3 order_id = f8
      3 sch_state_cd = f8
      3 state_meaning = c12
      3 beg_schedule_seq = i4
      3 end_schedule_seq = i4
      3 event_dt_tm = dq8
      3 order_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 synonym_id = f8
      3 description = vc
      3 attach_source_flag = i2
    2 option_pass_ind = i2
    2 option_qual_cnt = i4
    2 option_qual [*]
      3 sch_option_cd = f8
      3 option_meaning = vc
    2 notification_pass_ind = i2
    2 notification_partial_ind = i2
    2 notification_qual_cnt = i4
    2 notification_qual [*]
      3 action = i2
      3 sch_action_id = f8
      3 sch_notify_id = f8
      3 base_route_id = f8
      3 sch_report_id = f8
      3 output_dest_id = f8
      3 to_prsnl_id = f8
      3 suffix = vc
      3 email = vc
      3 transmit_dt_tm = dq8
      3 nbr_copies = i4
      3 source_type_cd = f8
      3 source_type_meaning = vc
      3 report_type_cd = f8
      3 report_type_meaning = vc
      3 requested_dt_tm = dq8
      3 printed_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
    2 schedule_partial_ind = i2
    2 schedule_qual_cnt = i4
    2 schedule_qual [*]
      3 schedule_id = f8
      3 sch_state_cd = f8
      3 state_meaning = vc
      3 unconfirm_count = i4
      3 appt_partial_ind = i2
      3 appt_qual_cnt = i4
      3 appt_qual [*]
        4 sch_appt_id = f8
        4 sch_state_cd = f8
        4 state_meaning = vc
    2 warning_partial_ind = i2
    2 warning_qual_cnt = i4
    2 warning_qual [*]
      3 action = i2
      3 sch_warn_id = f8
      3 warn_type_cd = f8
      3 warn_type_meaning = vc
      3 warn_batch_cd = f8
      3 warn_batch_meaning = vc
      3 warn_level_cd = f8
      3 warn_level_meaning = vc
      3 warn_class_cd = f8
      3 warn_class_meaning = vc
      3 warn_reason_cd = f8
      3 warn_reason_meaning = vc
      3 warn_state_cd = f8
      3 warn_state_meaning = vc
      3 warn_option_cd = f8
      3 warn_option_meaning = vc
      3 bit_mask = i4
      3 sch_appt_id = f8
      3 sch_appt_index = i4
      3 sch_action_id = f8
      3 sch_action_index = i4
      3 warn_prsnl_id = f8
      3 warn_dt_tm = dq8
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 option_partial_ind = i2
      3 option_qual_cnt = i4
      3 option_qual [*]
        4 action = i2
        4 sch_option_id = f8
        4 warn_reason_cd = f8
        4 warn_reason_meaning = vc
        4 warn_option_cd = f8
        4 warn_option_meaning = vc
        4 warn_level_cd = f8
        4 warn_level_meaning = vc
        4 warn_class_cd = f8
        4 warn_class_meaning = vc
        4 warn_prsnl_id = f8
        4 warn_dt_tm = dq8
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
        4 comment_partial_ind = i2
        4 comment_qual_cnt = i4
        4 comment_qual [*]
          5 action = i2
          5 text_type_cd = f8
          5 text_type_meaning = vc
          5 sub_text_cd = f8
          5 sub_text_meaning = vc
          5 text_action = i2
          5 text = vc
          5 text_id = f8
          5 text_updt_cnt = i4
          5 text_active_ind = i2
          5 text_active_status_cd = f8
          5 text_force_updt_ind = i2
          5 updt_cnt = i4
          5 version_ind = i2
          5 force_updt_ind = i2
          5 candidate_id = f8
          5 active_ind = i2
          5 active_status_cd = f8
    2 requests_pass_ind = i2
    2 requests_qual_cnt = i4
    2 requests_qual [*]
      3 request_action_id = f8
      3 sch_action_cd = f8
      3 action_meaning = c12
    2 move_criteria_partial_ind = i2
    2 move_criteria_qual_cnt = i4
    2 move_criteria_qual [*]
      3 action = i2
      3 move_flag = i2
      3 move_pref_beg_tm = i4
      3 move_pref_end_tm = i4
      3 move_requestor = c255
      3 updt_cnt = i4
      3 version_ind = i2
      3 force_updt_ind = i2
      3 candidate_id = f8
      3 active_ind = i2
      3 active_status_cd = f8
      3 comment_partial_ind = i2
      3 comment_qual_cnt = i4
      3 comment_qual [*]
        4 action = i2
        4 text_type_cd = f8
        4 text_type_meaning = vc
        4 sub_text_cd = f8
        4 sub_text_meaning = vc
        4 text_action = i2
        4 text = vc
        4 text_id = f8
        4 text_updt_cnt = i4
        4 text_active_ind = i2
        4 text_active_status_cd = f8
        4 text_force_updt_ind = i2
        4 updt_cnt = i4
        4 version_ind = i2
        4 force_updt_ind = i2
        4 candidate_id = f8
        4 active_ind = i2
        4 active_status_cd = f8
    2 link_partial_ind = i2
    2 link_qual_cnt = i4
    2 link_qual [*]
      3 action = i2
      3 sch_link_id = f8
      3 sch_event_id = f8
      3 force_updt_ind = i2
      3 active_ind = i2
      3 updt_cnt = i4
      3 auto_generated_ind = i2
    2 offer_qual_cnt = i4
    2 offer_qual [*]
      3 pm_offer_id = f8
      3 encntr_id = f8
      3 schedule_id = f8
      3 arrived_on_time_ind = i2
      3 reasonable_offer_ind = i2
      3 remove_from_wl_ind = i2
      3 pat_initiated_ind = i2
      3 attendance_cd = f8
      3 admit_offer_outcome_cd = f8
      3 offer_type_cd = f8
      3 outcome_of_attendance_cd = f8
      3 sch_reason_cd = f8
      3 wl_reason_for_removal_cd = f8
      3 offer_dt_tm = dq8
      3 offer_made_dt_tm = dq8
      3 tci_dt_tm = dq8
      3 wl_removal_dt_tm = dq8
      3 appt_dt_tm = dq8
      3 cancel_dt_tm = dq8
      3 dna_dt_tm = dq8
      3 episode_activity_status_cd = f8
    2 grp_desc = vc
    2 grp_capacity = i4
    2 grp_flag = i2
    2 grpsession_id = f8
    2 grpsession_cancel_ind = i2
    2 grp_shared_ind = i2
    2 grp_closed_ind = i2
    2 grp_beg_dt_tm = dq8
    2 grp_end_dt_tm = dq8
    2 hcv_flag = i2
    2 hcv_interchange_id = f8
    2 hcv_ver_status_cd = f8
    2 hcv_ver_status_meaning = c12
    2 hcv_action_id = f8
    2 orig_action_prsnl_id = f8
    2 cab_flag = i2
    2 abn_total_price = f8
    2 abn_total_price_format = vc
    2 susp_phys_ovr_cnt = i4
    2 susp_phys_ovr [*]
      3 physician_type_cd = f8
      3 physician_prsnl_id = f8
      3 authorized_prsnl_id = f8
      3 comment_text = vc
    2 contact_follow_up_dt_tm = dq8
  1 displacement_ind = i2
  1 program_name = vc
  1 pm_output_dest_cd = f8
  1 deceased_skip_notify_ind = i2
)
 
free record 651001_rep
record 651001_rep (
    1 qual_cnt = i4
    1 conversation_id = f8
    1 comment_qual_cnt = i4
    1 comment_qual [* ]
      2 candidate_id = f8
      2 text_id = f8
      2 status = i2
    1 summary_qual_cnt = i4
    1 summary_qual [* ]
      2 sch_notify_id = f8
      2 candidate_id = f8
      2 status = i2
    1 itinerary_qual_cnt = i4
    1 itinerary_qual [* ]
      2 sch_notify_id = f8
      2 candidate_id = f8
      2 status = i2
    1 qual [* ]
      2 sch_event_id = f8
      2 status = i2
      2 sch_action_id = f8
      2 action_candidate_id = f8
      2 action_status = i2
      2 unlock_action_id = f8
      2 unlock_status = i2
      2 unlock_candidate_id = f8
      2 verify_action_id = f8
      2 verify_status = i2
      2 verify_candidate_id = f8
      2 abn_action_id = f8
      2 abn_status = i2
      2 abn_candidate_id = f8
      2 sch_lock_id = f8
      2 candidate_id = f8
      2 comment_qual_cnt = i4
      2 comment_qual [* ]
        3 candidate_id = f8
        3 text_id = f8
        3 status = i2
      2 detail_qual_cnt = i4
      2 detail_qual [* ]
        3 candidate_id = f8
        3 status = i2
      2 attach_qual_cnt = i4
      2 attach_qual [* ]
        3 sch_attach_id = f8
        3 candidate_id = f8
        3 status = i2
      2 notification_qual_cnt = i4
      2 notification_qual [* ]
        3 sch_notify_id = f8
        3 candidate_id = f8
        3 status = i2
      2 schedule_qual_cnt = i4
      2 schedule_qual [* ]
        3 schedule_id = f8
        3 candidate_id = f8
        3 status = i2
        3 resource_qual_cnt = i4
        3 resource_qual [* ]
          4 sch_appt_id = f8
          4 candidate_id = f8
          4 new_appt_id = f8
          4 status = i2
      2 warning_qual_cnt = i4
      2 warning_qual [* ]
        3 sch_warn_id = f8
        3 candidate_id = f8
        3 status = i2
        3 option_qual_cnt = i4
        3 option_qual [* ]
          4 sch_option_id = f8
          4 candidate_id = f8
          4 status = i2
          4 comment_qual_cnt = i4
          4 comment_qual [* ]
            5 text_id = f8
            5 candidate_id = f8
            5 status = i2
      2 requests_qual_cnt = i4
      2 requests_qual [* ]
        3 status = i2
      2 move_criteria_qual_cnt = i4
      2 move_criteria_qual [* ]
        3 candidate_id = f8
        3 status = i2
        3 comment_qual_cnt = i4
        3 comment_qual [* ]
          4 text_id = f8
          4 candidate_id = f8
          4 status = i2
      2 link_qual_cnt = i4
      2 link_qual [* ]
        3 candidate_id = f8
        3 status = i2
      2 offer_qual_cnt = i4
      2 offer_qual [* ]
        3 pm_offer_id = f8
        3 status = i2
      2 remaining_link_cnt = i4
      2 hcv_candidate_id = f8
      2 hcv_status = i2
      2 hcv_action_id = f8
      2 can_cancel_ind = i2
      2 suppress_cab_notification_ind = i2
      2 susp_phys_ovr_cnt = i4
      2 susp_phys_ovr [* ]
        3 sch_warning_id = f8
        3 comment_text_id = f8
        3 status = i2
    1 grp_capacity_fail_ind = i2
    1 displacement_filename = vc
    1 rad_cancel_fail = i2
    1 linked_event_updated_ind = i2
    1 link_prsnl_lock_id = f8
    1 link_username = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
 
;651612 - sch_delw_booking
free record 651612_req
record 651612_req (
  1 call_echo_ind = i2
  1 qual [*]
    2 booking_id = f8
    2 updt_cnt = i4
    2 allow_partial_ind = i2
    2 force_updt_ind = i2
)
 
free record 651612_rep
record 651612_rep (
	1 qual_cnt = i4
    1 qual [* ]
      2 status = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
free record appt_oe_details
record appt_oe_details (
	1 qual[*]
		2 oe_field_id = f8
		2 oe_field_meaning = vc
		2 oe_field_meaning_id = f8
		2 value_required_ind = i2
		2 group_seq = i4
		2 field_seq = i4
		2 accept_flag = i2
		2 default_value = vc
		2 min_val = i4
		2 max_val = i4
		2 field_type_flag = i4
		2 accept_size = i4
		2 validation_type_flag = i4
		2 allow_multiple_ind = i2
		2 codeset = f8
		2 response = vc
		2 oe_field_value = f8
		2 oe_field_display_value = vc
		2 oe_field_dt_tm_value = dq8
		2 event_cd = f8
		2 candidate_id = f8
)
 
; Final Reply
free record appointment_reply_out
record appointment_reply_out (
  1 appointment_id       	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname     	= vc
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
 
; Inputted argument list
free record arglist
record arglist(
	1 encounterId 		= vc
	1 encounterAlias 	= vc
	1 statusId			= vc
	1 slots[*]
		2 slotId		= vc
		2 resourceCd 	= vc
		2 locationCd 	= vc
		2 apptDateTime 	= vc
		2 duration		= vc
	1 apptComments		= vc
	1 apptDetails[*]
		2 fieldId 		= vc
		2 response	 	= vc
	1 reasonId			= vc
	1 reasonComments	= vc
)
 
; Slots
free record slots_temp
record slots_temp (
	1 qual[*]
		2 slot_id 		= f8
		2 list_role_id 	= f8
		2 role_type_cd 	= f8
		2 sch_role_cd 	= f8
		2 role_meaning 	= vc
		2 role_description = vc
		2 role_seq 		= i4
		2 resource_cd 	= f8
		2 beg_date_time	= dq8
		2 end_date_time = dq8
		2 duration 		= i4
		2 booking_id 	= f8
     	2 candidate_id	= f8
     	2 primary_role_ind = i2
     	2 res_type_flag = i2
)
 
;Set initial audit status to fail
set appointment_reply_out->status_data.status = "F"
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParamMessage(param_name = vc, error_code = c4) = null with protect
declare GetScheduleId(null)					= i2 with protect
declare GetApptIdDetails(null)				= i2 with protect	;650685 - sch_get_event_schedule
declare GetApptTypeDetails(null) 			= i2 with protect 	;650184 - sch_get_loc_by_appt_type
declare GetOeFormat(null)					= i2 with protect 	;560000 - ORM.FmtQuery
declare GetApptBlock(null)					= i2 with protect 	;650328 - sch_get_appt_block
declare GetSchRoles(null) 					= i2 with protect 	;654633 - sch_get_order_roles
declare VerifyLocksSecurity(null)			= i2 with protect	;659100 - SCH.VerifyLocks
declare CheckLock(null)						= i2 with protect	;651863 - sch_check_lock
declare VerifyLock(null)					= i2 with protect	;651864 - sch_verify_lock
declare DeleteLock(null)					= i2 with protect	;651862 = sch_del_lock
declare CheckTimes(null) 					= i2 with protect 	;651603 - sch_check_times
declare VerifyTimes(null) 					= i2 with protect 	;651604 - sch_verify_times
declare GetNextSeq(null) 					= i2 with protect 	;651853 - sch_get_order_seq
declare PostAppointment(null) 				= null with protect ;651000 - sch_write_event
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName 							= vc with protect, noconstant("")
declare dAppointmentId						= f8 with protect, noconstant(0.0)
declare dEncounterId 						= f8 with protect, noconstant(0.0)
declare sEncounterAlias 					= vc with protect, noconstant("")
declare dLocationCd							= f8 with protect, noconstant(0.0)
declare iDebugFlag							= i2 with protect, noconstant(0)
declare dReasonCd							= f8 with protect, noconstant(0.0)
declare sReasonComments						= vc with protect, noconstant("")
 
;Other
declare dPatientId 							= f8 with protect, noconstant(0.0)
declare dScheduleId							= f8 with protect, noconstant(0.0)
declare dUserId								= f8 with protect, noconstant(0.0)
declare dPositionCd							= f8 with protect, noconstant(0.0)
declare dApptTypeCd							= f8 with protect, noconstant(0.0)
declare dApptStateCd						= f8 with protect, noconstant(0.0)
declare dApptOeFormatId						= f8 with protect, noconstant(0.0)
declare dApptSchemeId						= f8 with protect, noconstant(0.0)
declare iBookingCreated						= i2 with protect, noconstant(0)
declare dResListId							= f8 with protect, noconstant(0.0)
declare qApptBegDateTime					= dq8 with protect, noconstant(0)
declare qApptEndDateTime					= dq8 with protect, noconstant(0)
declare iApptDuration						= i4 with protect, noconstant(0)
declare dScheduleLockId						= f8 with protect, noconstant(0.0)
declare iErrorInd							= i2 with protect, noconstant(0)
 
;Constants
declare UTCmode								= i2 with protect, constant(CURUTC)
declare c_error_handler_name 				= vc with protect, constant("PUT APPOINTMENT")
declare c_fin_alias_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_apptbook_sched_product_cd 		= f8 with constant(uar_get_code_by("MEANING",23026,"APPTBOOK"))
declare c_appointment_scheduling_action_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",14232,"APPOINTMENT"))
declare c_sched_order_format_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14124,"SCHEDULING"))
declare c_booking_text_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",15149,"BOOKING"))
declare c_booking_sub_text_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",15589,"BOOKING"))
declare c_confirmed_scheduling_state_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",14233,"CONFIRMED"))
declare c_rescheduled_scheduling_state_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",14233,"RESCHEDULED"))
declare c_noshow_scheduling_state_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14233,"NOSHOW"))
declare c_hold_scheduling_state_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",14233,"HOLD"))
declare c_schedule_sch_action_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",14232,"SCHEDULE"))
declare c_reschedule_sch_action_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",14232,"RESCHEDULE"))
declare c_modify_sch_action_cd				= f8 with protect, constant(uar_get_code_by("MEANING",14232,"MODIFY"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName 								= trim($USERNAME,3)
set dAppointmentId							= cnvtreal($APPT_ID)
set sJsonArgs 								= trim($JSON,3)
set jrec 									= cnvtjsontorec(sJsonArgs)
set dEncounterId 							= cnvtreal(arglist->encounterId)
set sEncounterAlias 						= trim(arglist->encounterAlias,3)
set dApptStateCd							= cnvtreal(arglist->statusId)
set dReasonCd								= cnvtreal(arglist->reasonId)
set sReasonComments							= trim(arglist->reasonComments,3)
set iDebugFlag								= cnvtint($DEBUG_FLAG)
 
;Other
set dUserId									= GetPrsnlIDfromUserName(sUserName)
set dPositionCd								= GetPositionByPrsnlId(dUserId)
 
 
;Setup slots_temp record
set slotSize = size(arglist->slots,5)
if(slotSize > 0)
	set stat = alterlist(slots_temp->qual,slotSize)
	for(s = 1 to slotSize)
		set slots_temp->qual[s].slot_id = cnvtreal(arglist->slots[s].slotId)
		set slots_temp->qual[s].resource_cd = cnvtreal(arglist->slots[s].resourceCd)
		set slots_temp->qual[s].beg_date_time = GetDateTime(arglist->slots[s].apptDateTime)
		set slots_temp->qual[s].duration = cnvtint(arglist->slots[s].duration)
		if(slots_temp->qual[s].duration > 0)
			set slots_temp->qual[s].end_date_time =
			cnvtlookahead(build(slots_temp->qual[s].duration,",MIN"),cnvtdatetime(slots_temp->qual[s].beg_date_time))
		endif
 
		if(dLocationCd = 0)
			set dLocationCd = cnvtreal(arglist->slots[s].locationCd)
		else
			if(dLocationCd != cnvtreal(arglist->slots[s].locationCd))
				call ErrorHandler2(c_error_handler_name, "F", "Validate", "Cannot have multiple locations per appointment type.",
				"9999",build2("Cannot have multiple locations per appointment type."), appointment_reply_out)
				go to exit_script
			endif
		endif
	endfor
endif
 
if(iDebugFlag > 0)
	call echo(build("sUserName -->",sUserName))
	call echo(build("dAppointmentId -->",dAppointmentId))
	call echo(build("dEncounterId -->",dEncounterId))
	call echo(build("sEncounterAlias -->",sEncounterAlias))
	call echo(build("dApptStateCd -->",dApptStateCd))
	call echo(build("dReasonCd -->",dReasonCd))
	call echo(build("sReasonComments -->",sReasonComments))
	call echo(build("sJsonArgs -->",sJsonArgs))
	call echorecord(arglist)
endif
/*************************************************************************
;MAIN
**************************************************************************/
; Validate appointment id exists
if(dAppointmentId = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Missing AppointmentId",
	"9999",build2("Missing AppointmentId"), appointment_reply_out)
	go to exit_script
endif
 
; Get ScheduleId & PatientId
set iRet = GetScheduleId(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid AppointmentId",
	"9999",build2("Invalid AppointmentId"), appointment_reply_out)
	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, appointment_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build2("Invalid user: ",sUserName), appointment_reply_out)
	go to exit_script
endif
 
; Validate LocationId
if(dLocationCd > 0)
	set iRet = GetCodeSet(dLocationCd)
	if(iRet != 220)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid LocationId",
		"2040",build2("Invalid LocationId"), appointment_reply_out)
		go to exit_script
	endif
endif
 
;Set EncounterId if alias provided
if(dEncounterId = 0)
	if(sEncounterAlias > " ")
		set dEncounterId = GetEncntrIdByAlias(sEncounterAlias,c_fin_alias_type_cd)
	endif
 
 	;Validate Patient/Encounter relation
 	if(dEncounterId > 0)
		set iRet = ValidateEncntrPatientReltn(dPatientId,dEncounterId)
		if(iRet = 0)
			call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid PatientId/EncounterId combination.",
			"9999","Invalid PatientId/EncounterId combination.", appointment_reply_out)
			go to exit_script
		endif
	endif
endif
 
; Validate ApptStateCd if provided
if(dApptStateCd > 0)
	set iRet = GetCodeSet(dApptStateCd)
	if(iRet != 14233)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid AppointmentStateId.",
		"9999",build2("Invalid AppointmentStateId. "), appointment_reply_out)
		go to exit_script
	else
		if(dApptStateCd != c_hold_scheduling_state_cd)
			call ErrorHandler2(c_error_handler_name, "F", "Validate",
			"The appointment state can only be changed manually to HOLD.",
			"9999","The appointment state can only be changed manually to HOLD", appointment_reply_out)
			go to exit_script
		endif
	endif
elseif(slotSize > 0)
	set dApptStateCd = c_rescheduled_scheduling_state_cd
endif
 
; Validate ReasonId
set iRet = GetCodeSet(dReasonCd)
if(iRet != 14229)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ReasonId",
	"9999","Invalid ReasonId.", appointment_reply_out)
	go to exit_script
endif
 
; Get AppointmentId Details - 650685 - sch_get_event_schedule
set iRet = GetApptIdDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not get appointment details (650685).",
	"9999",build2("Could not get appointment details (650685). "), appointment_reply_out)
	go to exit_script
endif
 
; Get AppointmentTypeCd details - 650613 - sch_get_appt_type_by_id
set iRet = GetApptTypeDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve appointment details (650184).",
	"9999","Could not retrieve appointment details (650184).", appointment_reply_out)
	go to exit_script
endif
 
; Get OE Formats - 560000 - ORM.FmtQuery
set iRet = GetOeFormat(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve OE formats (560000).",
	"9999","Could not retrieve OE formats (560000).", appointment_reply_out)
	go to exit_script
endif
 
; Check for patient/appt locks - 651863 - sch_check_lock
set iRet = CheckLock(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "The appointment is locked. Please try again later (651863).",
	"9999","The appointment is locked. Please try again later (651863).", appointment_reply_out)
	go to exit_script
endif
 
; Reschedule appointment
if(slotSize > 0)
	; Get Appointment Block - 650328 - sch_get_appt_block
	set iRet = GetApptBlock(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve appointment block (650328).",
		"9999","Could not retrieve appointment block (650328).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	; Get Scheduling Roles - 654633 - sch_get_order_roles
	set iRet = GetSchRoles(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve scheduling roles (654633).",
		"9999","Could not retrieve scheduling roles (654633).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	; Check slot times for conflicts - 651603 - sch_check_times
	set iRet = CheckTimes(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not check schedule times (651603).",
		"9999","Could not check schedule times (651603).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	; Verify slot times - 651604 - sch_verify_times
	set iRet = VerifyTimes(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not verify schedule times (651604).",
		"9999","Could not verify schedule times (651604).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	; Verify Lock - 651864 - sch_verify_lock
	set iRet = VerifyLock(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not set lock (651864).",
		"9999","Could not set lock (651864).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	; Reschedule Appointment - 651000 - sch_write_event
	call RescheduleAppointment(null)
 
else
	; Verify Lock - 651864 - sch_verify_lock
	set iRet = VerifyLock(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not set lock (651864).",
		"9999","Could not set lock (651864).", appointment_reply_out)
		set iErrorInd = 1
		go to exit_script
	endif
 
	;Update Apppointment details but not date, time or resources - 651001 - sch_chg_event_state
	call UpdateAppointment(null)
endif
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
; Delete booking ids if created and script has an error
if(iErrorInd > 0 and iBookingCreated > 0)
	call DeleteBooking(null)
endif
 
; Delete scheduling lock if created - 651862 - sch_del_lock
if(dScheduleLockId > 0)
	set iRet = DeleteLock(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not release lock (651864).",
		"9999","Could not set lock (651864).", appointment_reply_out)
	endif
endif
 
set JSONout = CNVTRECTOJSON(appointment_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(slots_temp)
	call echorecord(appointment_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_put_appointment.json")
	call echo(build2("_file : ", _file))
	call echojson(appointment_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetScheduleId(null) = i2
;  Description: Get ScheduleId & PatientId
**************************************************************************/
subroutine GetScheduleId(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetScheduleId Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from sch_appt sa
	plan sa where sa.sch_event_id = dAppointmentId
		and sa.schedule_seq = 1
		and sa.role_meaning = "PATIENT"
		and sa.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
	detail
		dPatientId = sa.person_id
		dScheduleId = sa.schedule_id
		iValidate = 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetScheduleId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetApptIdDetails(null) = i2
;  Description: Get AppointmentId Details - 650685 - sch_get_event_schedule
**************************************************************************/
subroutine GetApptIdDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetApptIdDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650550
	set iRequest = 650685
 
	set stat = alterlist(650685_req->qual,1)
	set 650685_req->security_ind = 1
 	set 650685_req->security_user_id = dUserId
 	set 650685_req->qual[1].sch_event_id = dAppointmentId
 	set 650685_req->qual[1].schedule_seq = 1
 	set 650685_req->qual[1].schedule_id = dScheduleId
 	set 650685_req->qual[1].detail_ind = 1
 	set 650685_req->qual[1].comment_ind = 1
 	set 650685_req->qual[1].patient_ind = 1
 	set 650685_req->qual[1].location_ind = 1
 	set 650685_req->qual[1].appt_ind = 1
 	set 650685_req->qual[1].attach_ind = 1
 	set 650685_req->qual[1].schedule_ind = 1
 	set 650685_req->qual[1].recur_sibling_ind = 1
 	set 650685_req->qual[1].denormalize_ind = 1
 	set 650685_req->qual[1].lock_ind = 1
 	set 650685_req->qual[1].option_ind = 1
 	set 650685_req->qual[1].modification_ind = 1
 	set 650685_req->qual[1].confirm_ind = 1
 	set 650685_req->qual[1].protocol_sibling_ind = 1
 	set 650685_req->qual[1].move_criteria_ind = 1
 	set 650685_req->qual[1].to_follow_ind = 1
 	set 650685_req->qual[1].link_sibling_ind = 1
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",650685_req,"REC",650685_rep)
 
 	set iValidate = 0
 	if(650685_rep->status_data.status = "S")
 		set iValidate = 650685_rep->qual_cnt
 		set dApptTypeCd = 650685_rep->qual[1].appt_type_cd
 		if(dApptStateCd = 0)
 			set dApptStateCd = 650685_rep->qual[1].sch_state_cd
 		endif
 		if(dEncounterId = 0)
 			set dEncounterId = 650685_rep->qual[1].patient_qual[1].encntr_id
 		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetApptIdDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetApptTypeDetails(null) = i2 - 650613 - sch_get_appt_type_by_id
;  Description: Get the appointment type code details
**************************************************************************/
subroutine GetApptTypeDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetApptTypeDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650001
	set iRequest = 650613
 
	free record role_temp
	record role_temp (
		1 roles[*]
			2 list_role_id 		= f8
			2 role_type_cd 		= f8
			2 resources[*]
				3 resource_cd 	= f8
				3 res_type_flag = i2
				3 description	= vc
	)
 
	;Setup request
	set stat = alterlist(650613_req->qual,1)
	set 650613_req->qual[1].appt_type_cd = dApptTypeCd
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650613_req,"REC",650613_rep)
 
	;Validate success and process through details
	if(650613_rep->status_data.status != "F")
		set iValidate = 1
		if(650613_rep->qual_cnt > 0)
			for(i = 1 to 650613_rep->qual_cnt)
 
				; Set OE FormatId
				set dApptOeFormatId = 650613_rep->qual[i].oe_format_id
 
				; Verify Appt State has dApptStateCd
				if(650613_rep->qual[i].states_cnt > 0)
					set stateCheck = 0
					for(s = 1 to 650613_rep->qual[i].states_cnt)
						if(650613_rep->qual[i].states[s].sch_state_cd = dApptStateCd)
							set stateCheck = 1
							set dApptSchemeId = 650613_rep->qual[i].states[s].disp_scheme_id
						endif
					endfor
 
					if(stateCheck = 0)
						call ErrorHandler2(c_error_handler_name, "F", "Validate",
						build2("The appt type cannot be in a ",uar_get_code_display(dApptStateCd)," state."),
						"9999",build2("The appt type cannot be in a ",uar_get_code_display(dApptStateCd)," state."), appointment_reply_out)
						go to exit_script
					endif
				endif
 
				; Verify location provided matches one of the available locations if slots data provided
				if(size(slots_temp->qual,5) > 0)
					if(650613_rep->qual[i].locs_cnt > 0)
						set locCheck = 0
						set resCheck = 0
						for(j = 1 to size(slots_temp->qual,5))
							for(k = 1 to 650613_rep->qual[i].locs_cnt)
								if(dLocationCd = 650613_rep->qual[i].locs[k].location_cd)
									set locCheck = 1
									set dResListId = 650613_rep->qual[i].locs[k].res_list_id
 
									;Validate resource code is valid for appt type and location and validate all roles/resources
									;provided
									select distinct into "nl:"
									 slro.list_role_id
									 , sr.resource_cd
									from sch_list_role slro
									, sch_list_res slr
									, sch_resource sr
									, sch_list_slot sls
									plan slro where slro.res_list_id = dResListId
										and (slro.role_meaning != "PATIENT" or slro.role_meaning is null)
										and slro.sch_role_cd > 0
										and slro.res_list_id > 0
										and slro.active_ind = 1
										and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
										and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
									join slr where slr.list_role_id = slro.list_role_id
										and slr.active_ind = 1
										and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
										and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
									join sr where sr.resource_cd = slr.resource_cd
										and sr.active_ind = 1
										and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
										and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
									join sls where outerjoin(sls.list_role_id) = slro.list_role_id
										and sls.active_ind = 1
										and sls.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
										and sls.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
									order by slro.list_role_id
									head report
										y = 0
									head slro.role_type_cd
										z = 0
										y = y + 1
										stat = alterlist(role_temp->roles,y)
 
										role_temp->roles[y].role_type_cd = slro.role_type_cd
										role_temp->roles[y].list_role_id = slro.list_role_id
									head sr.resource_cd
										z = z + 1
					 					stat = alterlist(role_temp->roles[y].resources,z)
 
										role_temp->roles[y].resources[z].resource_cd = sr.resource_cd
										role_temp->roles[y].resources[z].res_type_flag = sr.res_type_flag
										role_temp->roles[y].resources[z].description = sr.description
									with nocounter
 
									;Validate provided slot data matches appt setup
									set slotSize = size(slots_temp->qual,5)
									set roleSize = size(role_temp->roles,5)
 
									if(slotSize != roleSize)
										call ErrorHandler2(c_error_handler_name, "F", "Validate",
										"The number of slots provided does not match required number of roles.",
										"9999","The number of slots provided does not match required number of roles.", appointment_reply_out)
										go to exit_script
									else
										for(r = 1 to roleSize)
											for(u = 1 to size(role_temp->roles[r].resources,5))
												for(t = 1 to slotSize)
													if(role_temp->roles[r].resources[u].resource_cd = slots_temp->qual[t].resource_cd)
														set slots_temp->qual[t].list_role_id = role_temp->roles[r].list_role_id
														set slots_temp->qual[t].role_type_cd = role_temp->roles[r].role_type_cd
														set slots_temp->qual[t].res_type_flag = role_temp->roles[r].resources[u].res_type_flag
														set slots_temp->qual[t].role_description = role_temp->roles[r].resources[u].description
														set resCheck = 1
													endif
												endfor
											endfor
										endfor
									endif
 
									if(locCheck = 0)
										call ErrorHandler2(c_error_handler_name, "F", "Validate",
										"The LocationCd provided does not match any locations associated with the appointment type.",
										"9999","The LocationCd provided does not match any locations associated with the appointment type.",
										appointment_reply_out)
										go to exit_script
									endif
 
									if(resCheck = 0)
										call ErrorHandler2(c_error_handler_name, "F", "Validate",
										"The ResourceCd provided does not match any resources associated with the appointment type and location.",
										"9999","The ResourceCd provided does not match any resources associated with the appointment type and location.",
										appointment_reply_out)
										go to exit_script
									endif
								endif
							endfor
						endfor
					endif
				endif
 
				; Check appointment attributes
				if(650613_rep->qual[i].option_cnt > 0)
					for(j = 1 to 650613_rep->qual[i].option_cnt)
						case(650613_rep->qual[i].option[j].option_mean)
							;of "ABNSCH": 		;Require medical necessity check at booking
							;of "AUTOENCTR01": 	;Require automatic encounter creation at booking
							;of "AUTOENCTR02": 	;Require automatic encounter creation on move to Work In Progress window
							;of "CLIENTBILL":	;Marks an appointment as a Client Billing Type
							;of "EEMSCH":		;Require Eligibility Check at booking
							;of "SURGMULTIOC":	;Allow multiple location values
							of value("ENCNTRBOOK","ENCNTRWIP"):	;Require encounter at booking ;Require encounter on move to the Work In Progress window
								if(dEncounterId = 0)
									call ErrorHandler2(c_error_handler_name, "F", "Validate",
									"An encounter id is required for this appointment type.",
									"9999","An encounter id is required for this appointment type.", appointment_reply_out)
									go to exit_script
								endif
 
							of value("GRPEVENTAPPT","GRPSESSION"):	;Group event appointment ;Group session appointment
								call ErrorHandler2(c_error_handler_name, "F", "Validate",
								"Group type appointments are not allowed to be created with this endpoint.",
								"9999","Group type appointments are not allowed to be created with this endpoint.", appointment_reply_out)
								go to exit_script
 
							of "REQORDER":		;Require order association
								call ErrorHandler2(c_error_handler_name, "F", "Validate",
								"Appointments with required orders are not allowed with this endpoint.",
								"9999","Appointments with required orders are not allowed with this endpoint.", appointment_reply_out)
								go to exit_script
 
							of "WALKIN":		;Use for walk-in workflow
								call ErrorHandler2(c_error_handler_name, "F", "Validate",
								"Walk-In appointments are not allowed with this endpoint.",
								"9999","Walk-In appointments are not allowed with this endpoint.", appointment_reply_out)
								go to exit_script
						else
							if(substring(1,2,650613_rep->qual[i].option[j].option_mean) = "IQ")
								call ErrorHandler2(c_error_handler_name, "F", "Validate",
								"Patient portal appointments are not allowed with this endpoint.",
								"9999","Patient portal appointments are not allowed with this endpoint.", appointment_reply_out)
								go to exit_script
							endif
						endcase
					endfor
				endif
			endfor
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetApptTypeDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOeFormat(null) = i2 - 560000 - ORM.FmtQuery
;  Description: Get OE Format details
**************************************************************************/
subroutine GetOeFormat(null)
	if(iDebugFlag > 0)
	set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOeFormat Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare date = vc
	declare zero_test = vc
	declare newTime = vc
	declare real_test = i4
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 655020
	set iRequest = 560000
 
	; Setup request
	set 560000_req->oeFormatId = dApptOeFormatId
	set 560000_req->actionTypeCd = c_appointment_scheduling_action_cd
	set 560000_req->positionCd = dPositionCd
	set 560000_req->applicationCd = c_sched_order_format_type_cd
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560000_req,"REC",560000_rep)
 
	; Update temp record appt_oe_details
	if(560000_rep->status_data.status != "F")
		set iValidate = 1
		set oeSize = size(560000_rep->fieldList,5)
		set stat = alterlist(appt_oe_details->qual,oeSize)
		for(i = 1 to oeSize)
			set appt_oe_details->qual[i].accept_flag = 560000_rep->fieldList[i].acceptFlag
			set appt_oe_details->qual[i].oe_field_id = 560000_rep->fieldList[i].oeFieldId
			set appt_oe_details->qual[i].oe_field_meaning_id = 560000_rep->fieldList[i].oeFieldMeaningId
			set appt_oe_details->qual[i].oe_field_meaning = 560000_rep->fieldList[i].oeFieldMeaning
			set appt_oe_details->qual[i].value_required_ind = 560000_rep->fieldList[i].valueRequiredInd
			set appt_oe_details->qual[i].group_seq = 560000_rep->fieldList[i].groupSeq
			set appt_oe_details->qual[i].field_seq = 560000_rep->fieldList[i].fieldSeq
			set appt_oe_details->qual[i].accept_size = 560000_rep->fieldList[i].acceptSize
			set appt_oe_details->qual[i].allow_multiple_ind = 560000_rep->fieldList[i].allowMultipleInd
			set appt_oe_details->qual[i].default_value = 560000_rep->fieldList[i].defaultValue
			set appt_oe_details->qual[i].event_cd = 560000_rep->fieldList[i].eventCd
			set appt_oe_details->qual[i].field_type_flag = 560000_rep->fieldList[i].fieldTypeFlag
			set appt_oe_details->qual[i].max_val = 560000_rep->fieldList[i].maxVal
			set appt_oe_details->qual[i].min_val = 560000_rep->fieldList[i].minVal
			set appt_oe_details->qual[i].validation_type_flag = 560000_rep->fieldList[i].validationTypeFlag
			set appt_oe_details->qual[i].codeset = 560000_rep->fieldList[i].codeset
 
			; Get provided responses
			for(x = 1 to size(arglist->apptDetails,5))
				if(cnvtreal(arglist->apptDetails[x].fieldId) = 560000_rep->fieldList[i].oeFieldId)
					set appt_oe_details->qual[i].response = arglist->apptDetails[x].response
				endif
			endfor
		endfor
 
		; Validate data provided
		for(i = 1 to oeSize)
			; Validate value submitted fits within constraints of field
			if(appt_oe_details->qual[i].response > " ")
				case(appt_oe_details->qual[i].field_type_flag)
					of 0: 	;ALPHANUMERIC
						if(size(trim(appt_oe_details->qual[i].response,3)) <= appt_oe_details->qual[i].accept_size)
							set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
						else
							set appt_oe_details->qual[i].oe_field_display_value =
							substring(1,appt_oe_details->qual[i].accept_size,trim(appt_oe_details->qual[i].response,3))
						endif
					of 1:	;INTEGER
						set appt_oe_details->qual[i].oe_field_value = cnvtint(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
					of 2:	;DECIMIAL
						set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
					of 3:	;DATE
						set date = trim(replace(appt_oe_details->qual[i].response,"/",""),3)
						if(cnvtdate(date))
							if(UTC)
								set appt_oe_details->qual[i].oe_field_dt_tm_value = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),0))
							else
								set appt_oe_details->qual[i].oe_field_dt_tm_value = cnvtdatetime(cnvtdate(date),0)
							endif
						else
							call ErrorHandler2(c_error_handler, "F", "Validate",build2(appt_oe_details->qual[i].oe_field_id,
							" field id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),"9999",
							build2(appt_oe_details->qual[i].oe_field_id,
							" field id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
							order_reply_out)
							go to EXIT_SCRIPT
						endif
					of 5:	;DATE/TIME
						set checkSpace = findstring(" ", appt_oe_details->qual[i].response)
						set date = substring(1,checkSpace, appt_oe_details->qual[i].response)
						set date = trim(replace(date,"/",""),3)
						set time = trim(substring(checkSpace + 1,textlen( appt_oe_details->qual[i].response), appt_oe_details->qual[i].response),3)
						set time = trim(replace(time,":",""),3)
						set dateCheck = cnvtdate(date)
 
						; Validate Time
						set zero_test = trim(replace(replace(origTime,".",""),"0",""),3)
						set newTime = trim(replace(origTime,":",""),3)
						set real_test = cnvtreal(newTime)
 
						if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
							if(textlen(newTime) = 4 and real_test >= 0 and real_test < 2400)
								set timeCheck = 1
							endif
						endif
 
						if(dateCheck > 0 and timeCheck > 0)
							if(UTC)
								set appt_oe_details->qual[i].oe_field_dt_tm_value = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
							else
								set appt_oe_details->qual[i].oe_field_dt_tm_value = cnvtdatetime(cnvtdate(date),cnvtint(time))
							endif
						else
							call ErrorHandler2(c_error_handler, "F", "Validate",
							build2(oe_fields->qual[iSeq].oe_field_id," field id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
							" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
							"9999", build2(oe_fields->qual[iSeq].oe_field_id," field id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
							" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
							order_reply_out)
							go to EXIT_SCRIPT
						endif
					of 6:	;CODESET
						set iRet = GetCodeSet(cnvtreal(appt_oe_details->qual[i].response))
						if(iRet != appt_oe_details->qual[i].codeset)
							call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid codeset response.",
							"9999","Invalid codeset response.", appointment_reply_out)
							go to exit_script
						else
							set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
							set appt_oe_details->qual[i].oe_field_value =
								uar_get_code_display(appt_oe_details->qual[i].oe_field_value)
						endif
					of 7:	;YES/NO
						if(cnvtlower(trim(appt_oe_details->qual[i].response,3)) = "yes")
							set appt_oe_details->qual[i].oe_field_value = 1
							set appt_oe_details->qual[i].oe_field_display_value = "Yes"
						elseif(cnvtlower(trim(appt_oe_details->qual[i].response,3)) = "no")
							set appt_oe_details->qual[i].oe_field_value = 0
							set appt_oe_details->qual[i].oe_field_display_value = "No"
						else
							call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid yes/no response.",
							"9999","Invalid yes/no response.", appointment_reply_out)
							go to exit_script
						endif
					of 8:	;PROVIDER
						set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value = GetNameFromPrsnID(appt_oe_details->qual[i].oe_field_value)
					of 9:	;LOCATION
						set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value =
							uar_get_code_display(appt_oe_details->qual[i].oe_field_value)
						set iRet = GetCodeSet(appt_oe_details->qual[i].oe_field_value)
						if(iRet != 220)
							call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid location response.",
							"9999","Invalid location response.", appointment_reply_out)
							go to exit_script
						endif
					of 10:	;ICD9
						select into "nl:"
						from nomenclature n
						where n.nomenclature_id = cnvtreal(appt_oe_details->qual[i].response)
							and n.principle_type_cd = value(uar_get_code_by("MEANING",401,"DIAG"))
						detail
							appt_oe_details->qual[i].oe_field_value = n.nomenclature_id
							appt_oe_details->qual[i].oe_field_display_value = n.source_string
						with nocounter
						if(curqual = 0)
							call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid DiagnosisId.",
							"9999","Invalid DiagnosisId.", appointment_reply_out)
							go to exit_script
						endif
					of 11:	;PRINTER
						select into "nl:"
						from device d
						where d.device_cd = cnvtreal(appt_oe_details->qual[i].response)
						detail
							appt_oe_details->qual[i].oe_field_value = d.device_cd
							appt_oe_details->qual[i].oe_field_display_value = d.description
						with nocounter
						if(curqual = 0)
							call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid Device Code.",
							"9999","Invalid Device Code.", appointment_reply_out)
							go to exit_script
						endif
					of 12:	;LIST
						if(appt_oe_details->qual[i].codeset = 0)
							set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
						else
							set iRet = GetCodeSet(cnvtreal(appt_oe_details->qual[i].response))
							if(iRet != appt_oe_details->qual[i].codeset)
								call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid list response.",
								"9999","Invalid list response.", appointment_reply_out)
								go to exit_script
							else
								set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
								set appt_oe_details->qual[i].oe_field_display_value =
									uar_get_code_display(appt_oe_details->qual[i].oe_field_value)
							endif
						endif
					of 13:	;USER/PERSONNEL
						set appt_oe_details->qual[i].oe_field_value = cnvtreal(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value = GetNameFromPrsnID( appt_oe_details->qual[i].oe_field_value)
					of 14:	;ACCESSION
						if(size(trim(appt_oe_details->qual[i].response,3)) <= appt_oe_details->qual[i].accept_size)
							set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
						else
							set appt_oe_details->qual[i].oe_field_display_value =
							substring(1,appt_oe_details->qual[i].accept_size,trim(appt_oe_details->qual[i].response,3))
						endif
					of 15:	;SURGICAL DURATION
						set appt_oe_details->qual[i].oe_field_value = cnvtint(appt_oe_details->qual[i].response)
						set appt_oe_details->qual[i].oe_field_display_value = trim(appt_oe_details->qual[i].response,3)
				endcase
			endif
		endfor
 
		; Populate needed data from 650685
		select into "nl:"
		from (dummyt d with seq = size(appt_oe_details->qual,5))
			,(dummyt d2 with seq = 650685_rep->qual[1].detail_qual_cnt)
		plan d
		join d2 where 650685_rep->qual[1].detail_qual[d2.seq].oe_field_id =
			appt_oe_details->qual[d.seq].oe_field_id
		detail
			appt_oe_details->qual[d.seq].candidate_id = 650685_rep->qual[1].detail_qual[d2.seq].candidate_id
		with nocounter
	endif
 
	return(iValidate)
 
	if(iDebugFlag > 0)
		call echo(concat("GetOeFormat Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckLock(null) = i2
;  Description: Check for patient/appt locks - 651863 - sch_check_lock
**************************************************************************/
subroutine CheckLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 650001
	set iTask = 651862
	set iRequest = 651863
 
 	;Setup request
 	set stat = alterlist(651863_req->qual,1)
 	set 651863_req->qual[1].parent_table = "SCH_EVENT"
 	set 651863_req->qual[1].parent_id = dAppointmentId
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651863_req,"REC",651863_rep)
 
 	if(651863_rep->status_data.status = "S")
 		set iValidate = 1
 		set dScheduleLockId = 651863_rep->qual[1].sch_lock_id
 	else
 		call echorecord(651863_rep)
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetApptBlock(null) = i2 - 650328 - sch_get_appt_block
;  Description: Get available slots for a resource
**************************************************************************/
subroutine GetApptBlock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetApptBlock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650553
	set iRequest = 650328
 
	;Setup request
	set 650328_req->security_ind = 1
	set 650328_req->secured_scheme_ind = 1
	set 650328_req->security_user_id = dUserId
 
	for(s = 1 to size(slots_temp->qual,5))
		set stat = alterlist(650328_req->qual,s)
		set 650328_req->qual[s].resource_cd = slots_temp->qual[s].resource_cd
		set 650328_req->qual[s].resource_ind = 1
		set 650328_req->qual[s].beg_dt_tm = cnvtdatetime(slots_temp->qual[s].beg_date_time)
		set 650328_req->qual[s].end_dt_tm = datetimeadd(650328_req->qual[1].beg_dt_tm,1)
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650328_req,"REC",650328_rep)
 
		if(650328_rep->status_data.status != "F")
			set iValidate = 1
 
			; Check if slotid provided is available
			set slotCheck = 0
			if(650328_rep->qual_cnt > 0)
				for(h = 1 to 650328_rep->qual_cnt)
					if(650328_rep->qual[h].qual_cnt > 0)
						for(i = 1 to 650328_rep->qual[h].qual_cnt)
							if(650328_rep->qual[h].appointment[i].apply_slot_id = slots_temp->qual[s].slot_id)
								if(slots_temp->qual[s].beg_date_time between
									650328_rep->qual[h].appointment[i].beg_dt_tm and
									650328_rep->qual[h].appointment[i].end_dt_tm)
									set slotCheck = 1
								endif
							endif
						endfor
					endif
				endfor
			endif
 
			if(slotCheck = 0)
				call ErrorHandler2(c_error_handler_name, "F", "Validate","Invalid SlotID.",
				"9999","Invalid SlotId.", appointment_reply_out)
				go to exit_script
			endif
		endif
 	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetApptBlock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetSchRoles(null) = i2 - 654633 - sch_get_order_roles
;  Description: Get scheduling roles
**************************************************************************/
subroutine GetSchRoles(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSchRoles Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650550
	set iRequest = 654633
 
	;Setup request
	set 654633_req->security_ind = 1
	set 654633_req->security_user_id = dUserId
	set stat = alterlist(654633_req->qual,1)
	set 654633_req->qual[1].appt_type_cd = dApptTypeCd
	set 654633_req->qual[1].person_accept_meaning = 650613_rep->qual[1].person_accept_meaning
	set 654633_req->qual[1].location_cd = dLocationCd
	set 654633_req->qual[1].res_list_id = dResListId
	set 654633_req->qual[1].person_id = dPatientId
	set 654633_req->qual[1].encntr_id = dEncounterId
	set 654633_req->qual[1].dyn_duration_flag = 1
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",654633_req,"REC",654633_rep)
 
 	if(654633_rep->status_data.status != "F")
 		set iValidate = 1
 		set slotSize = size(slots_temp->qual,5)
 
 		for(j = 1 to 654633_rep->qual_cnt)
 			for(k = 1 to 654633_rep->qual[j].role_qual_cnt)
 				if(654633_rep->qual[j].role_qual[k].role_meaning = "PATIENT")
 					set stat = alterlist(slots_temp->qual,slotSize + 1)
 					set slots_temp->qual[value(slotSize+1)].list_role_id = 654633_rep->qual[j].role_qual[k].list_role_id
 				endif
 			endfor
 		endfor
 
 		set idx = 0
 		select into "nl:"
 		from (dummyt d with seq = 654633_rep->qual[1].role_qual_cnt)
 			,(dummyt d2 with seq = size(slots_temp->qual,5))
 		plan d
 		join d2 where slots_temp->qual[d2.seq].list_role_id = 654633_rep->qual[1].role_qual[d.seq].list_role_id
 		detail
 			if(654633_rep->qual[1].role_qual[d.seq].role_meaning != "PATIENT")
 				if(slots_temp->qual[d.seq].duration = 0)
		 			slots_temp->qual[d2.seq].duration = 654633_rep->qual[1].role_qual[d.seq].res_qual[1].slot_qual[1].duration_units
					slots_temp->qual[d2.seq].end_date_time =
					cnvtlookahead(build('"',slots_temp->qual[d2.seq].duration,',MIN"'),slots_temp->qual[d2.seq].beg_date_time)
				endif
			else
				idx = d2.seq
				slots_temp->qual[d2.seq].duration = 654633_rep->qual[1].role_qual[d.seq].res_qual[1].slot_qual[1].duration_units
			endif
 
 			slots_temp->qual[d2.seq].role_meaning = 654633_rep->qual[1].role_qual[d.seq].role_meaning
			slots_temp->qual[d2.seq].role_seq = 654633_rep->qual[1].role_qual[d.seq].role_seq
			slots_temp->qual[d2.seq].sch_role_cd = 654633_rep->qual[1].role_qual[d.seq].sch_role_cd
			slots_temp->qual[d2.seq].primary_role_ind = 654633_rep->qual[1].role_qual[d.seq].primary_ind
 
			; Set earliest start time
			if(qApptBegDateTime = 0)
				qApptBegDateTime = slots_temp->qual[d2.seq].beg_date_time
			else
				if(slots_temp->qual[d2.seq].beg_date_time > 0 and slots_temp->qual[d2.seq].beg_date_time < qApptBegDateTime)
					qApptBegDateTime = slots_temp->qual[d2.seq].beg_date_time
				endif
			endif
 
			; Set latest end time
			if(qApptEndDateTime = 0)
				qApptEndDateTime = slots_temp->qual[d2.seq].end_date_time
			else
				if(slots_temp->qual[d2.seq].end_date_time > qApptEndDateTime)
					qApptEndDateTime = slots_temp->qual[d2.seq].end_date_time
				endif
			endif
		with nocounter
 
		; Set start time, end time and duration for the PATIENT role
		set slots_temp->qual[idx].beg_date_time = qApptBegDateTime
		set slots_temp->qual[idx].end_date_time = qApptEndDateTime
		set slots_temp->qual[idx].duration = datetimediff(qApptEndDateTime,qApptBegDateTime,4)
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSchRoles Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckTimes(null) = i2 - 651603 - sch_check_times
;  Description: Check slot times
**************************************************************************/
subroutine CheckTimes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckTimes Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 652103
	set iRequest = 651603
 
 	set slotSize = size(slots_temp->qual,5)
 
	; Setup request
	for(i = 1 to slotSize)
		set stat = initrec(651603_req)
		set stat = initrec(651603_rep)
 
		set 651603_req->resource_quota_ind = 1
		set 651603_req->quota_ind = 1
		set 651603_req->security_ind = 1
 
		set stat = alterlist(651603_req->qual,1)
 
		if(slots_temp->qual[i].role_meaning = "PATIENT")
			set 651603_req->qual[1].person_id = dPatientId
			set 651603_req->qual[1].beg_dt_tm = qApptBegDateTime
			set 651603_req->qual[1].end_dt_tm = qApptEndDateTime
		else
			set 651603_req->qual[1].resource_cd = slots_temp->qual[i].resource_cd
			set 651603_req->qual[1].beg_dt_tm = slots_temp->qual[i].beg_date_time
			set 651603_req->qual[1].end_dt_tm = slots_temp->qual[i].end_date_time
		endif
 
		set 651603_req->qual[1].appt_type_cd = dApptTypeCd
		set 651603_req->qual[1].location_cd = dLocationCd
		set 651603_req->qual[1].sch_role_cd = slots_temp->qual[i].sch_role_cd
		set 651603_req->qual[1].role_meaning = slots_temp->qual[i].role_meaning
		set 651603_req->qual[1].seq_nbr = slots_temp->qual[i].role_seq
 
		; Execute request
 		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651603_req,"REC",651603_rep)
 
	 	if(651603_rep->status_data.status = "S")
			set iValidate = 1
			set iBookingCreated = 1
			set slots_temp->qual[i].booking_id = 651603_rep->qual[1].booking_id
		else
			call ErrorHandler2(c_error_handler_name, "F", "Execute",
			"Conflict exist during this time period (651603).",
			"9999","Conflict exist during this time period (651603).", appointment_reply_out)
			call echorecord(651603_rep)
			go to exit_script
		endif
		call echorecord(651603_req)
		call echorecord(651603_rep)
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("CheckTimes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyTimes(null) = i2 - 651604 - sch_verify_times
;  Description: Verify slot times
**************************************************************************/
subroutine VerifyTimes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyTimes Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 652103
	set iRequest = 651604
 
	; Setup request
	set slotSize = size(slots_temp->qual,5)
	for(i = 1 to slotSize)
		set stat = initrec(651604_req)
		set stat = initrec(651604_rep)
 
		set 651604_req->resource_quota_ind = 1
		set 651604_req->quota_ind = 1
		set 651604_req->security_ind = 1
 
		set stat = alterlist(651604_req->qual,1)
		set 651604_req->qual[1].booking_id = slots_temp->qual[i].booking_id
		set 651604_req->qual[1].resource_cd = slots_temp->qual[i].resource_cd
		set 651604_req->qual[1].person_id = dPatientId
		set 651604_req->qual[1].encntr_id = dEncounterId
		set 651604_req->qual[1].beg_dt_tm = slots_temp->qual[i].beg_date_time
		set 651604_req->qual[1].end_dt_tm = slots_temp->qual[i].end_date_time
		set 651604_req->qual[1].appt_type_cd = dApptTypeCd
		set 651604_req->qual[1].location_cd = dLocationCd
		set 651604_req->qual[1].sch_role_cd = slots_temp->qual[i].sch_role_cd
		set 651604_req->qual[1].role_meaning = slots_temp->qual[i].role_meaning
		;set 651604_req->qual[1].order_qual				- future - Add orders
 
		; Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651604_req,"REC",651604_rep)
 
		if(651604_rep->status_data.status = "S")
			set iValidate = 1
			set slots_temp->qual[i].booking_id = 651604_rep->qual[1].new_booking_id
		else
			call ErrorHandler2(c_error_handler_name, "F", "Execute",
			"Conflict exist during this time period (651604).",
			"9999","Conflict exist during this time period (651604).", appointment_reply_out)
			go to exit_script
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyTimes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyLock(null) = i2
;  Description: Verify Lock - 651864 - sch_verify_lock
**************************************************************************/
subroutine VerifyLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 651862
	set iRequest = 651864
 
 	;Setup request
 	set stat = alterlist(651864_req->qual,1)
 	set 651864_req->qual[1].parent_table = "SCH_EVENT"
 	set 651864_req->qual[1].parent_id = dAppointmentId
 	set 651864_req->qual[1].sch_lock_id = 651863_rep->qual[1].sch_lock_id
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651864_req,"REC",651864_rep)
 
 	if(651864_rep->status_data.status = "S")
 		set iValidate = 1
 		set dScheduleLockId = 651864_rep->qual[1].new_sch_lock_id
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: RescheduleAppointment(null) = null - 651000 - sch_write_event
;  Description: Reschedule current appointment
**************************************************************************/
subroutine RescheduleAppointment(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("RescheduleAppointment Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650550
	set iRequest = 651000
 
	;------Setup request--------
	;Comments
	if(arglist->apptComments > " ")
		set 651000_req->comment_qual_cnt = 1
		set stat = alterlist(651000_req->comment_qual,651000_req->comment_qual_cnt)
		set 651000_req->comment_qual[1].action = 1
		set 651000_req->comment_qual[1].force_updt_ind = 1
		set 651000_req->comment_qual[1].text_force_updt_ind = 1
		set 651000_req->comment_qual[1].text_type_cd = c_booking_text_type_cd
		set 651000_req->comment_qual[1].text_type_meaning = uar_get_code_meaning(c_booking_text_type_cd)
		set 651000_req->comment_qual[1].sub_text_cd = c_booking_sub_text_cd
		set 651000_req->comment_qual[1].sub_text_meaning = uar_get_code_meaning(c_booking_sub_text_cd)
		set 651000_req->comment_qual[1].text = trim(arglist->apptComments,3)
	endif
 
	;High Level Scheduling info
	for(j = 1 to 650685_rep->qual_cnt)
		set stat = alterlist(651000_req->qual,j)
 		set 651000_req->qual[j].action = 2
		set 651000_req->qual[j].sch_event_id = dAppointmentId
		set 651000_req->qual[j].sch_action_cd = c_reschedule_sch_action_cd
		set 651000_req->qual[j].action_meaning = uar_get_code_meaning(c_reschedule_sch_action_cd)
		set 651000_req->qual[j].skip_tofollow_ind = 1
		set 651000_req->qual[j].schedule_seq = 650685_rep->qual[j].schedule_seq + 1
		set 651000_req->qual[j].appt_type_cd = dApptTypeCd
		set 651000_req->qual[j].appt_synonym_cd = 650685_rep->qual[j].appt_synonym_cd
		set 651000_req->qual[j].appt_synonym_mnem = 650685_rep->qual[j].appt_synonym_free
		set 651000_req->qual[j].oe_format_id = 650685_rep->qual[j].oe_format_id
		set 651000_req->qual[j].order_sentence_id = 650685_rep->qual[j].order_sentence_id
		set 651000_req->qual[j].rscd_appt_scheme_id = 650685_rep->qual[j].appt_qual[1].appt_scheme_id
		set 651000_req->qual[j].rscd_schedule_id = 650685_rep->qual[j].schedule_id
		set 651000_req->qual[j].sch_reason_cd = dReasonCd
		set 651000_req->qual[j].reason_meaning = uar_get_code_meaning(dReasonCd)
		set 651000_req->qual[j].confirm_flag = 2
		set 651000_req->qual[j].force_updt_ind = 1
		set 651000_req->qual[j].candidate_id = 650685_rep->qual[j].candidate_id
		set 651000_req->qual[j].active_ind = 1
		set 651000_req->qual[j].req_prsnl_id = dUserId
 
		;Reason Comment
		if(sReasonComments > " ")
			set 651000_req->qual[j].comment_qual_cnt = 1
			set stat = alterlist(651000_req->qual[j].comment_qual,1)
			set 651000_req->qual[j].comment_qual[1].sch_action_id = -1
			set 651000_req->qual[j].comment_qual[1].text = sReasonComments
			set 651000_req->qual[j].comment_qual[1].text_active_ind = 1
			set 651000_req->qual[j].comment_qual[1].text_force_updt_ind = 1
			set 651000_req->qual[j].comment_qual[1].force_updt_ind = 1
			set 651000_req->qual[j].comment_qual[1].active_ind = 1
		endif
 
		;Patient Info
		set 651000_req->qual[j].patient_qual_cnt = 650685_rep->qual[j].patient_qual_cnt
		for(p = 1 to 651000_req->qual[j].patient_qual_cnt)
			set stat = alterlist(651000_req->qual[j].patient_qual,p)
			set 651000_req->qual[j].patient_qual[p].action = 2
			set 651000_req->qual[j].patient_qual[p].patient_person_id = 650685_rep->qual[j].patient_qual[p].person_id
			set 651000_req->qual[j].patient_qual[p].patient_encntr_id = dEncounterId
			set 651000_req->qual[j].patient_qual[p].encntr_type_cd = GetPatientClass(dEncounterId,1)
			set 651000_req->qual[j].patient_qual[p].encntr_type_display =
				uar_get_code_display(651000_req->qual[j].patient_qual[p].encntr_type_cd)
			set 651000_req->qual[j].patient_qual[p].force_updt_ind = 1
			set 651000_req->qual[j].patient_qual[p].candidate_id = 650685_rep->qual[j].patient_qual[p].candidate_id
			set 651000_req->qual[j].patient_qual[p].active_ind = 1
		endfor
 
		;OE Format Details
		if(size(arglist->apptDetails,5) > 0)
			set d = 0
			for(i = 1 to size(appt_oe_details->qual,5))
				if(appt_oe_details->qual[i].response > " ")
					set d = d + 1
					set 651000_req->qual[j].detail_qual_cnt = d
					set stat = alterlist(651000_req->qual[j].detail_qual,d)
 
					set 651000_req->qual[j].detail_qual[d].action = 2
					set 651000_req->qual[j].detail_qual[d].oe_field_id = appt_oe_details->qual[i].oe_field_id
					set 651000_req->qual[j].detail_qual[d].oe_field_value = appt_oe_details->qual[i].oe_field_value
					set 651000_req->qual[j].detail_qual[d].oe_field_display_value = appt_oe_details->qual[i].oe_field_display_value
					set 651000_req->qual[j].detail_qual[d].oe_field_dt_tm_value = appt_oe_details->qual[i].oe_field_dt_tm_value
					set 651000_req->qual[j].detail_qual[d].oe_field_meaning = appt_oe_details->qual[i].oe_field_meaning
					set 651000_req->qual[j].detail_qual[d].oe_field_meaning_id = appt_oe_details->qual[i].oe_field_meaning_id
					set 651000_req->qual[j].detail_qual[d].value_required_ind  = appt_oe_details->qual[i].value_required_ind
					;set 651000_req->qual[j].detail_qual[d].group_seq = appt_oe_details->qual[i].group_seq
					;set 651000_req->qual[j].detail_qual[d].field_seq = appt_oe_details->qual[i].field_seq
					set 651000_req->qual[j].detail_qual[d].active_ind = 1
					set 651000_req->qual[j].detail_qual[d].force_updt_ind = 1
					set 651000_req->qual[j].detail_qual[d].candidate_id = appt_oe_details->qual[i].candidate_id
					set 651000_req->qual[j].detail_qual[d].modified_ind = 1
				endif
		 	endfor
		 endif
 
	 	;Attach Qual - Orders - Future functionality
 
	 	;Recur Qual
	 	set 651000_req->qual[j].recur_qual_cnt = 1
	 	set stat = alterlist(651000_req->qual[j].recur_qual,1)
	 	set 651000_req->qual[j].recur_qual[1].action = 1
	 	set 651000_req->qual[j].recur_qual[1].force_updt_ind = 1
	 	set 651000_req->qual[j].recur_qual[1].active_ind = 1
 
	 	;Schedule Qual
	 	set 651000_req->qual[j].schedule_qual_cnt = 1
	 	set stat = alterlist(651000_req->qual[j].schedule_qual,1)
	 	set 651000_req->qual[j].schedule_qual[1].appt_location_cd = dLocationCd
	 	set 651000_req->qual[j].schedule_qual[1].appt_location_freetext = uar_get_code_display(dLocationCd)
	 	set 651000_req->qual[j].schedule_qual[1].res_list_id = dResListId
	 	set 651000_req->qual[j].schedule_qual[1].force_updt_ind = 1
	 	set 651000_req->qual[j].schedule_qual[1].active_ind = 1
 
	 	; Resources
	 	set slotSize = size(slots_temp->qual,5)
	 	set stat = alterlist(651000_req->qual[j].schedule_qual[1].resource_qual,slotSize)
	 	set 651000_req->qual[j].schedule_qual[1].resource_qual_cnt = slotSize
 
	 	for(x = 1 to slotSize)
	 		if(slots_temp->qual[x].res_type_flag = 0)
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].person_id = dPatientId
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].encntr_id = dEncounterId
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].patient_ind = 1
	 		else
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].resource_cd = slots_temp->qual[x].resource_cd
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].apply_slot_id = slots_temp->qual[x].slot_id
	 			set 651000_req->qual[j].schedule_qual[1].resource_qual[x].res_type_flag = slots_temp->qual[x].res_type_flag
 
	 		endif
 
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].old_beg_dt_tm = slots_temp->qual[x].beg_date_time
		 	set 651000_req->qual[j].schedule_qual[1].resource_qual[x].old_end_dt_tm = slots_temp->qual[x].end_date_time
		 	set 651000_req->qual[j].schedule_qual[1].resource_qual[x].beg_dt_tm = slots_temp->qual[x].beg_date_time
		 	set 651000_req->qual[j].schedule_qual[1].resource_qual[x].end_dt_tm = slots_temp->qual[x].end_date_time
		 	set 651000_req->qual[j].schedule_qual[1].resource_qual[x].duration = slots_temp->qual[x].duration
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].appt_scheme_id = dApptSchemeId
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].sch_role_cd = slots_temp->qual[x].sch_role_cd
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].sch_role_meaning =
	 			uar_get_code_meaning(slots_temp->qual[x].sch_role_cd)
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].primary_role_ind = slots_temp->qual[x].primary_role_ind
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].sch_state_cd = c_confirmed_scheduling_state_cd
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].state_meaning = uar_get_code_meaning(c_confirmed_scheduling_state_cd)
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].force_updt_ind = 1
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].active_ind = 1
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].list_role_id = slots_temp->qual[x].list_role_id
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].role_seq = slots_temp->qual[x].list_role_id
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].role_description = slots_temp->qual[x].role_description
	 		set 651000_req->qual[j].schedule_qual[1].resource_qual[x].booking_id = slots_temp->qual[x].candidate_id
		endfor
	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651000_req,"REC",651000_rep)
 
	if(651000_rep->status_data.status != "S")
		call ErrorHandler2(c_error_handler_name, "F", "Execute",
		"Could not update appointment (651000).",
		"9999","Could not update appointment (651000).", appointment_reply_out)
 
		call echorecord(651000_req)
		call echorecord(651000_rep)
		set iErrorInd = 1
		go to exit_script
	else
		set appointment_reply_out->appointment_id = 651000_rep->qual[1].sch_event_id
 
		;Set audit to successful status
		call ErrorHandler2(c_error_handler_name, "S", "Success","Appointment updated successfully.",
		"0000","Appointment updated successfully.", appointment_reply_out)
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("RescheduleAppointment Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateAppointment(null)   - 651001 - sch_chgw_event_state
;  Description: Update all appointment details but date, time and resources
**************************************************************************/
subroutine UpdateAppointment(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateAppointment Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 650551
	set iRequest = 651001
 
	;------Setup request--------
 	;Comments
	if(arglist->apptComments > " ")
		set 651001_req->comment_qual_cnt = 1
		set stat = alterlist(651001_req->comment_qual,651001_req->comment_qual_cnt)
		set 651001_req->comment_qual[1].action = 1
		set 651001_req->comment_qual[1].active_ind = 1
		set 651001_req->comment_qual[1].text_active_ind = 1
		set 651001_req->comment_qual[1].force_updt_ind = 1
		set 651001_req->comment_qual[1].text_force_updt_ind = 1
		set 651001_req->comment_qual[1].text_type_cd = c_booking_text_type_cd
		set 651001_req->comment_qual[1].text_type_meaning = uar_get_code_meaning(c_booking_text_type_cd)
		set 651001_req->comment_qual[1].sub_text_cd = c_booking_sub_text_cd
		set 651001_req->comment_qual[1].sub_text_meaning = uar_get_code_meaning(c_booking_sub_text_cd)
		set 651001_req->comment_qual[1].text = trim(arglist->apptComments,3)
	endif
 
	;High Level Scheduling Info
	for(i = 1 to 650685_rep->qual_cnt)
	 	set stat = alterlist(651001_req->qual,i)
	 	set 651001_req->qual[i].sch_event_id = dAppointmentid
	 	set 651001_req->qual[i].skip_tofollow_ind = 1
	 	set 651001_req->qual[i].schedule_seq = 650685_rep->qual[i].schedule_seq
	 	set 651001_req->qual[i].schedule_id = 650685_rep->qual[i].schedule_id
	 	set 651001_req->qual[i].sch_action_cd = c_modify_sch_action_cd
	 	set 651001_req->qual[i].action_meaning = uar_get_code_meaning(c_modify_sch_action_cd)
	 	set 651001_req->qual[i].sch_reason_cd = dReasonCd
	 	set 651001_req->qual[i].reason_meaning = uar_get_code_meaning(dReasonCd)
	 	set 651001_req->qual[i].sch_state_cd = dApptStateCd
	 	set 651001_req->qual[i].state_meaning = uar_get_code_meaning(dApptStateCd)
	 	set 651001_req->qual[i].appt_scheme_id = dApptSchemeId
	 	set 651001_req->qual[i].force_updt_ind = 1
	 	set 651001_req->qual[i].candidate_id = 650685_rep->qual[i].candidate_id
 
	 	;Modification Reason
	 	if(sReasonComments > " ")
	 		set 651001_req->qual[i].comment_qual_cnt = 1
	 		set stat = alterlist(651001_req->qual[i].comment_qual,651001_req->qual[i].comment_qual_cnt)
	 		set 651001_req->qual[i].comment_qual[1].action = 1
	 		set 651001_req->qual[i].comment_qual[1].sch_action_id = -1
	 		set 651001_req->qual[i].comment_qual[1].text = sReasonComments
	 		set 651001_req->qual[i].comment_qual[1].text_active_ind = 1
	 		set 651001_req->qual[i].comment_qual[1].active_ind = 1
	 		set 651001_req->qual[i].comment_qual[1].force_updt_ind = 1
	 	endif
 
	 	; Apppointment Details
	 	if(size(arglist->apptDetails,5) > 0)
	 		set x = 0
	 		for(y = 1 to size(appt_oe_details->qual,5))
	 			if(appt_oe_details->qual[y].response > " ")
	 				set x = x + 1
	 				set 651001_req->qual[i].detail_qual_cnt = x
	 				set stat = alterlist(651001_req->qual[i].detail_qual,x)
	 				set 651001_req->qual[i].detail_qual[x].action = 2
	 				set 651001_req->qual[i].detail_qual[x].oe_field_id = appt_oe_details->qual[y].oe_field_id
	 				set 651001_req->qual[i].detail_qual[x].oe_field_value = appt_oe_details->qual[y].oe_field_value
	 				set 651001_req->qual[i].detail_qual[x].oe_field_display_value = appt_oe_details->qual[y].oe_field_display_value
	 				set 651001_req->qual[i].detail_qual[x].oe_field_dt_tm_value = appt_oe_details->qual[y].oe_field_dt_tm_value
	 				set 651001_req->qual[i].detail_qual[x].oe_field_meaning = appt_oe_details->qual[y].oe_field_meaning
	 				set 651001_req->qual[i].detail_qual[x].oe_field_meaning_id = appt_oe_details->qual[y].oe_field_meaning_id
	 				set 651001_req->qual[i].detail_qual[x].value_required_ind = appt_oe_details->qual[y].value_required_ind
	 				;set 651001_req->qual[i].detail_qual[x].group_seq = appt_oe_details->qual[y].group_seq
	 				;set 651001_req->qual[i].detail_qual[x].field_seq = appt_oe_details->qual[y].field_seq
	 				set 651001_req->qual[i].detail_qual[x].modified_ind = 1
	 				set 651001_req->qual[i].detail_qual[x].force_updt_ind = 1
	 				set 651001_req->qual[i].detail_qual[x].candidate_id = appt_oe_details->qual[y].candidate_id
	 				set 651001_req->qual[i].detail_qual[x].active_ind = 1
	 			endif
	 		endfor
	 	endif
	 endfor
 
 	; Execute Request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651001_req,"REC",651001_rep)
 
 	if(651001_rep->status_data.status != "S")
		call ErrorHandler2(c_error_handler_name, "F", "Execute",
		"Could not update appointment (651001).",
		"9999","Could not update appointment (651001).", appointment_reply_out)
 
		call echorecord(651001_req)
		call echorecord(651001_rep)
		set iErrorInd = 1
		go to exit_script
	else
		set appointment_reply_out->appointment_id = 651001_rep->qual[1].sch_event_id
 
		;Set audit to successful status
		call ErrorHandler2(c_error_handler_name, "S", "Success","Appointment updated successfully.",
		"0000","Appointment updated successfully.", appointment_reply_out)
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateAppointment Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteBooking(null)
;  Description: Delete Booking if one was created and something failed
**************************************************************************/
subroutine DeleteBooking(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteBooking Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 652103
	set iRequest = 651612
 
	; Setup request
	for(i = 1 to size(slots_temp->qual,5))
		if(slots_temp->qual[i].booking_id > 0)
			set stat = alterlist(651612_req->qual,i)
			set 651612_req->qual[i].booking_id = slots_temp->qual[i].booking_id
			set 651612_req->qual[i].force_updt_ind = 1
			set 651612_req->qual[i].allow_partial_ind = 1
		endif
	endfor
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651612_req,"REC",651612_rep)
 
	if(651612_rep->status_data.status != "F")
		set iValidate = 1
		call echorecord(651612_rep)
	else
		call ErrorHandler2(c_error_handler_name, "F", "Execute",
		"Could not delete booking (651612).",
		"9999","Could not delete booking (651612).", appointment_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteBooking Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Delete scheduling lock - 651862 - sch_del_lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 651862
	set iRequest = 651862
 
 	;Setup request
 	set stat = alterlist(651862_req->qual,1)
 	set 651862_req->qual[1].sch_lock_id = dScheduleLockId
 	set 651862_req->qual[1].allow_partial_ind = 1
 	set 651862_req->qual[1].force_updt_ind = 1
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651862_req,"REC",651862_rep)
 
 	if(651862_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
