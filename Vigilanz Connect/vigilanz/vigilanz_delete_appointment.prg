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
                                                                     *
   ~BE~***********************************************************************/
  /****************************************************************************
      Source file name:     snsro_delete_appointment.prg
      Object name:          vigilanz_delete_appointment
      Program purpose:      Retrieves appt data by appointment id
      Tables read:			SCH_EVENT, SCH_APPT
      Services: 			1. 654903	sch_get_event_request
  							2. 651863	sch_check_lock
  							3. 651864	sch_verify_lock
  							4. 650483	sch_get_appt_state
  							5. 651001	sch_chgw_event_state
  							6. 651862	sch_del_lock
      Tables updated:       SCH_EVENT
      Executing from:       Emissary Service
      Special Notes:
******************************************************************************/
/***********************************************************************
  *                   MODIFICATION CONTROL LOG                       *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 08/30/17 RJC                	Initial write
  002 03/21/18 RJC					Added version code and copyright block
  003 03/26/18 RJC					Set reqinfo->updt_id to user_id passed in parameters
 
***********************************************************************/
drop program vigilanz_delete_appointment go
create program vigilanz_delete_appointment
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
  "Output to File/Printer/MINE" = "MINE"
    ,"Appointment ID" = 0.0 ; Required.  Sch_event_id
	,"ReasonCd" = 0.0		; Optional - defaulted to Cancel meaning. Scheduling Reason code - codeset 14229
	,"Comment" = ""			; Optional - Free text comment
	,"User Name" = ""		; Required
	,"Debug Flag" = 0
 
with OUTDEV, APPT_ID, REASON, COMMENT, USERNAME, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; 650685 sch_get_event_schedule
free record 650685_req_in
record 650685_req_in (
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
 
free record 650685_rep_out
record 650685_rep_out (
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
 
; 659100 SCH.VerifyLocks
free record 659100_req_in
record 659100_req_in (
  1 qual_cnt = i4
  1 qual [*]
    2 user_id = f8
    2 sec_type_cd = f8
    2 sec_type_mean = c12
    2 parent1_id = f8
    2 parent2_id = f8
    2 parent3_id = f8
    2 position_cd = f8
)
 
free record 659100_rep_out
record 659100_rep_out (
  1 qual_cnt = i4
  1 qual [*]
    2 sec_type_cd = f8
    2 sec_type_mean = c12
    2 parent1_id = f8
    2 parent2_id = f8
    2 parent3_id = f8
    2 user_id = f8
    2 sec_id = f8
    2 granted_ind = i2
    2 position_cd = f8)
 
;654903	sch_get_event_request
free record 654903_req_in
record 654903_req_in (
    1 call_echo_ind = i2
    1 qual [*]
      2 sch_event_id = f8
      2 schedule_id = f8
      2 sch_action_id = f8
      2 perform_action_cd = f8
      2 perform_action_meaning = vc
      2 req_action_cd = f8
      2 req_action_meaning = vc
)
 
free record 654903_rep_out
record 654903_rep_out (
	1 qual_cnt = i4
    1 qual [*]
     2 sch_event_id = f8
     2 schedule_id = f8
     2 sch_action_id = f8
     2 perform_action_cd = f8
     2 perform_action_meaning = vc
     2 req_action_cd = f8
     2 req_action_meaning = vc
     2 entry_cnt = i4
     2 entry [*]
       3 sch_action_id = f8
       3 req_action_cd = f8
       3 req_action_disp = vc
       3 req_action_meaning = vc
       3 action_cd = f8
       3 action_disp = vc
       3 action_mean = vc
       3 request_made_dt_tm = dq8
       3 request_made_person_id = f8
       3 request_made_person_name = vc
       3 selected_ind = i2
       3 modify_ind = i2
       3 result_flag = i4
       3 entry_state_meaning = vc
       3 cab_cancel_queue_ind = i2
	1 status_data
		2 status = vc
		2 subeventstatus[*]
			3 operationname = vc
			3 operationstatus = vc
			3 targetobjectname = vc
			3 targetobjectvalue = vc
)
 
;651863	sch_check_lock
free record 651863_req_in
record 651863_req_in (
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
 
free record 651863_rep_out
record 651863_rep_out(
	 1 qual_cnt = i4
     1 qual [*]
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
		2 status = vc
		2 subeventstatus[*]
			3 operationname = vc
			3 operationstatus = vc
			3 targetobjectname = vc
			3 targetobjectvalue = vc
)
 
;650483	sch_get_appt_state
free record 650483_req_in
record 650483_req_in (
    1 qual [*]
       2 appt_type_cd = f8
)
 
free record 650483_rep_out
record 650483_rep_out (
 	1 qual_cnt = i4
   	1 qual [* ]
     2 appt_type_cd = f8
     2 qual_cnt = i4
     2 qual [* ]
       3 state_meaning = vc
       3 disp_scheme_id = f8
       3 sch_state_cd = f8
	1 status_data
		2 status = vc
		2 subeventstatus[*]
			3 operationname = vc
			3 operationstatus = vc
			3 targetobjectname = vc
			3 targetobjectvalue = vc
)
 
;651001	sch_chgw_event_state
free record 651001_req_in
record 651001_req_in (
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
    1 displacement_ind = i2
    1 program_name = vc
    1 pm_output_dest_cd = f8
    1 deceased_skip_notify_ind = i2
)
 
free record 651001_rep_out
record 651001_rep_out (
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
		2 status = vc
		2 subeventstatus[*]
			3 operationname = vc
			3 operationstatus = vc
			3 targetobjectname = vc
			3 targetobjectvalue = vc
)
 
;651862	sch_del_lock
free record 651862_req_in
record 651862_req_in (
    1 call_echo_ind = i2
    1 qual [*]
      2 sch_lock_id = f8
      2 updt_cnt = i4
      2 allow_partial_ind = i2
      2 force_updt_ind = i2
)
 
free record 651862_rep_out
record 651862_rep_out (
 	1 qual_cnt = i4
    1 qual [* ]
		2 status = i4
	1 status_data
		2 status = vc
		2 subeventstatus[*]
			3 operationname = vc
			3 operationstatus = vc
			3 targetobjectname = vc
			3 targetobjectvalue = vc
)
 
free record appointment_reply_out
record appointment_reply_out (
 	1 sch_event_id = f8
 	1 schedule_id = f8
 	1 person_id = f8
 	1 appt_type_cd = f8
 	1 sch_state_cd = f8
 	1 candidate_id = f8
 	1 appt_scheme_id = f8
 	1 schedule_seq = i4
	1 audit
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
		2 service_version		= vc
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
 
set appointment_reply_out->status_data->status = "S"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dApptId  			= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare dUserId			= f8 with protect, noconstant(0)
declare iReturn				= i2 with protect, noconstant(0)
declare idebugFlag			= i2 with protect, noconstant(0)
declare iQualCnt			= i4 with protect, noconstant(0)
declare dCancelActionCd		= f8 with protect, constant(uar_get_code_by("MEANING",14232,"CANCEL"))
declare dCancelStateCd		= f8 with protect, constant(uar_get_code_by("MEANING",14233,"CANCELED"))
declare iAPPLICATION		= i4 with protect, constant(650001)
declare iTASK				= i4 with protect, noconstant(0)
declare iREQUEST			= i4 with protect, noconstant(0)
declare dReasonCd			= f8 with protect, noconstant(0.0)
declare sComment			= vc with protect, noconstant("")
declare dScheduleLockID		= f8 with protect, noconstant(0.0)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dApptId = cnvtreal($APPT_ID)
set sUserName = trim($USERNAME, 3)
set dUserId = GetPrsnlIDfromUserName(sUserName)
set reqinfo->updt_id = dUserId					;003
set idebugFlag = cnvtint($DEBUG_FLAG)
set dReasonCd = cnvtreal($REASON)
set sComment = trim($COMMENT,3)
 
; Validate Reason Code
set iRet = GetCodeSet(dReasonCd)
if(iRet != 14229)
	set dReasonCd = 0
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetDetails(null) = i2 with protect
declare Req_650685(null) = i2 with protect
declare Req_659100(null) = i2 with protect
declare Req_654903(null) = i2 with protect
declare Req_651863(null) = i2 with protect
declare Req_650483(null) = i2 with protect
declare Req_651001(null) = i2 with protect
declare Req_651862(null) = i2 with protect
 
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dApptId > 0.0)
 
	; Validate Appt ID and get Schedule_ID and Person_ID and current state
	set iReturn = GetDetails(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Invalid Appointment ID.",
		"1001", build2("ApptID is invalid: ", dApptId), appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
 	; Validate username
	set iReturn = PopulateAudit(sUserName, appointment_reply_out->person_id, appointment_reply_out, sVersion)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Invalid User for Audit.",
		"1002", build2("UserId is invalid: ", sUserName), appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Get Full Appt detail
	set iReturn = Req_650685(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Could not retrieve appointment details.",
		"9999", "Could not get appointment details", appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate appt is not already canceled
	if(appointment_reply_out->sch_state_cd = dCancelStateCd)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Appointment already canceled.",
		"9999", build2("Appt is already canceled: ", appointment_reply_out->sch_state_cd), appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Appt Type can be set to CANCELED
	set iReturn = Req_650483(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Invalid state for Appointment Type.",
		"9999", build2("State code:",dCancelStateCd," is invalid for appt type: ",
		appointment_reply_out->appt_type_cd ), appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Verify locks and setup user security
	;set iReturn = Req_659100(null)
	;if(iReturn = 0)
		;call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "659100 - Could not verify locks and security.",
		;"9999", "659100 - Verify locks and security failed ", appointment_reply_out)
		;go to EXIT_SCRIPT
	;endif
 
	; Submit get event request
	set iReturn = Req_654903(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Sched get event request failed.",
		"9999", "Sched get event request failed", appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Create a Sched Lock during the update process
	set iReturn = Req_651863(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Sched lock creation failed.",
		"9999", "Sched lock creation failed", appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Cancel Orders tied to appointment?
	; 650686
 
	; Update the appointment to Canceled
	set iReturn = Req_651001(null)
	if(iReturn = 0)
		call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Appointment state update failed.",
		"9999", "Appointment state update failed", appointment_reply_out)
		go to EXIT_SCRIPT
	endif
 
else
	call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Missing required field: Appt ID.",
	"2055", "Missing required field: ApptId", appointment_reply_out)
	go to EXIT_SCRIPT
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
	; Remove the Sched Lock if it exists
	if(dScheduleLockID > 0)
		set iReturn = Req_651862(null)
		if(iReturn = 0)
			call ErrorHandler2("VALIDATE", "F", "APPT DELETE", "Sched lock release failed.",
			"9999", "Sched lock release failed", appointment_reply_out)
		endif
	endif
 
	/*************************************************************************
	; RETURN JSON
	**************************************************************************/
	set JSONout = CNVTRECTOJSON(appointment_reply_out)
 
	if(idebugFlag > 0)
		set file_path = logical("ccluserdir")
		set _file = build2(trim(file_path),"/snsro_delete_appointment.json")
		call echo(build2("_file : ", _file))
		call echojson(appointment_reply_out, _file, 0)
 
		call echo(JSONout)
		call echorecord(appointment_reply_out)
		;call echorecord(659100_req_in,"snsro_delete_echorecord")
		;call echorecord(659100_rep_out,"snsro_delete_echorecord2")
 
 
	endif
 
	if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetDetails(null)
;  Description: Retrieves details from SCH_APPT & SCH_EVENT table based on Sch_Event_Id (Appt_ID)
**************************************************************************/
subroutine GetDetails(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get schedule_id
	set iQualCnt = 0
	select into "nl:"
	from sch_event se
	, sch_appt sa
	plan se where se.sch_event_id = dApptId
	join sa where sa.sch_event_id = se.sch_event_id
	detail
		iQualCnt = iQualCnt + 1
 
		appointment_reply_out->person_id = sa.person_id
		appointment_reply_out->sch_event_id = se.sch_event_id
		appointment_reply_out->schedule_id = sa.schedule_id
		appointment_reply_out->sch_state_cd = sa.sch_state_cd
		appointment_reply_out->appt_type_cd = se.appt_type_cd
		appointment_reply_out->candidate_id = sa.candidate_id
		appointment_reply_out->appt_scheme_id = sa.appt_scheme_id
		appointment_reply_out->schedule_seq = se.schedule_seq
	with nocounter
 
	return (iQualCnt)
 
	if(idebugFlag > 0)
		call echo(concat("GetDetails Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
/*************************************************************************
;  Name:  Req_650685
;  Description: sch_get_event_schedule
**************************************************************************/
subroutine Req_650685(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_650685 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iTASK = 650550
 	set iREQUEST = 650685
 
 	set 650685_req_in->security_ind = 1
 	set 650685_req_in->security_user_id = dUserId
 	set stat = alterlist(650685_req_in->qual,1)
 	set 650685_req_in->qual[1].sch_event_id = dApptId
 	set 650685_req_in->qual[1].schedule_seq = appointment_reply_out->schedule_seq
 	set 650685_req_in->qual[1].schedule_id = appointment_reply_out->schedule_id
 	set 650685_req_in->qual[1].detail_ind = 1
 	set 650685_req_in->qual[1].comment_ind = 1
 	set 650685_req_in->qual[1].patient_ind = 1
 	set 650685_req_in->qual[1].location_ind = 1
 	set 650685_req_in->qual[1].appt_ind = 1
 	set 650685_req_in->qual[1].attach_ind = 1
 	set 650685_req_in->qual[1].schedule_ind = 1
 	set 650685_req_in->qual[1].recur_sibling_ind = 1
 	set 650685_req_in->qual[1].denormalize_ind = 1
 	set 650685_req_in->qual[1].lock_ind = 1
 	set 650685_req_in->qual[1].option_ind = 1
 	set 650685_req_in->qual[1].modification_ind = 1
 	set 650685_req_in->qual[1].confirm_ind = 1
 	set 650685_req_in->qual[1].protocol_sibling_ind = 1
 	set 650685_req_in->qual[1].move_criteria_ind = 1
 	set 650685_req_in->qual[1].to_follow_ind = 1
 	set 650685_req_in->qual[1].link_sibling_ind = 1
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",650685_req_in,"REC",650685_rep_out)
 
 	set iValidate = 0
 	if(650685_rep_out->status_data.status = "S")
 		set iValidate = 1
 	endif
 
 	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_650685 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name:  Req_659100
;  Description: SCH.VerifyLocks
**************************************************************************/
subroutine Req_659100(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_659100 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get position cd for user
	declare dPositionCd = f8
	select into "nl:"
	from prsnl p
	where p.person_id = dUserId
	detail
		dPositionCd = p.position_cd
	with nocounter
 
 	declare iValidate = i4
 	set iTASK = 659100
 	set iREQUEST = 659100
 
 	for(j = 1 to 8)
 		case(j)
 			of value(1):
 				set stat = alterlist(659100_req_in->qual,8)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"PERSONENCNTR"))
					 		set 659100_req_in->qual[i].parent1_id = value(uar_get_code_by("MEANING",16166,"SETENCNTR"))
			 			of value(3,4):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"PERSONENCNTR"))
					 		set 659100_req_in->qual[i].parent1_id = value(uar_get_code_by("MEANING",16166,"CANENCNTR"))
			 			of value(5,6):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"PERSONENCNTR"))
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"DISENCNTR"))
			 			of value(7,8):
 							set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"TASKS"))
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"VIEWTASKS"))
					 endcase
				endfor
 			of value(2):
	 			set stat = alterlist(659100_req_in->qual,12)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"VIEW"))
			 			of value(3,4):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"LOCATION"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"VIEW"))
			 			of value(5,6):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTLOC"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"CANCEL"))
			 			of value(7,8):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESOURCE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_qual[1].resource_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"VIEW"))
			 			of value(9,10):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESLOC"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_qual[1].resource_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"CANCEL"))
			 			of value(11,12):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESSLOT"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_qual[1].resource_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].appt_qual[1].slot_type_id
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"CANCEL"))
					endcase
				endfor
			of value(3):
				set stat = alterlist(659100_req_in->qual,10)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTLOC"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"UNLOCK"))
			 			of value(3,4):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESLOC"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_qual[1].resource_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"UNLOCK"))
			 			of value(5,6):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESSLOT"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_qual[1].resource_cd
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].appt_qual[1].slot_type_id
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"UNLOCK"))
			 			of value(7,8):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESLOC"))
					 		set 659100_req_in->qual[i].parent1_id = 0
					 		set 659100_req_in->qual[i].parent2_id = 650685_rep_out->qual[1].location_qual[1].location_cd
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"UNLOCK"))
			 			of value(9,10):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"RESSLOT"))
					 		set 659100_req_in->qual[i].parent1_id = 0
					 		set 659100_req_in->qual[i].parent2_id = 0
					 		set 659100_req_in->qual[i].parent3_id = value(uar_get_code_by("MEANING",16166,"UNLOCK"))
			 		endcase
	 			endfor
	 		of value(4):
				set stat = alterlist(659100_req_in->qual,2)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"EXTORDER"))
			 		endcase
	 			endfor
	 		of value(5):
				set stat = alterlist(659100_req_in->qual,1)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"NEWORDER"))
			 		endcase
	 			endfor
	 		of value(6):
				set stat = alterlist(659100_req_in->qual,2)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"CANCELORD"))
			 		endcase
	 			endfor
	 		of value(7):
				set stat = alterlist(659100_req_in->qual,2)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"DISORDER"))
			 		endcase
	 			endfor
	 		of value(8):
				set stat = alterlist(659100_req_in->qual,2)
	 			for(i = 0 to size(659100_req_in->qual,5))
	 				set 659100_req_in->qual[i].user_id = dUserId
	 				if(mod(i,2) = 0)
						set 659100_req_in->qual[i].position_cd = dPositionCd
					endif
 
			  		case(i)
			 			of value(1,2):
			 				set 659100_req_in->qual[i].sec_type_cd = value(uar_get_code_by("MEANING",16165,"APPTTYPE"))
					 		set 659100_req_in->qual[i].parent1_id = 650685_rep_out->qual[1].appt_type_cd
					 		set 659100_req_in->qual[i].parent2_id = value(uar_get_code_by("MEANING",16166,"MOVEORDER"))
			 		endcase
	 			endfor
	 	endcase
	 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",659100_req_in,"REC",659100_rep_out)
	 	set iValidate = iValidate + 659100_rep_out->qual_cnt
 
	endfor
 	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_659100 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name:  Req_650483
;  Description: sch_get_appt_state
**************************************************************************/
subroutine Req_650483(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_650483 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set stat = alterlist(650483_req_in->qual,1)
 	set 650483_req_in->qual[1].appt_type_cd = appointment_reply_out->appt_type_cd
 	set iTASK = 650444
 	set iREQUEST = 650483
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",650483_req_in,"REC",650483_rep_out)
 
 	set iValidate = 0
 	for(i = 1 to 650483_rep_out->qual_cnt)
 		for(j = 0 to 650483_rep_out->qual[i].qual_cnt)
 			if(650483_rep_out->qual[i].qual[j].sch_state_cd = dCancelStateCd)
 				set iValidate = 1
 			endif
 		endfor
 	endfor
 
 	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_650483 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name: Req_654903(null)
;  Description: sch_get_event_request
**************************************************************************/
subroutine Req_654903(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_654903 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set stat = alterlist(654903_req_in->qual,1)
	set 654903_req_in->qual[1].sch_event_id = dApptId
	set 654903_req_in->qual[1].schedule_id = appointment_reply_out->schedule_id
	set 654903_req_in->qual[1].perform_action_cd = dCancelActionCd
	set 654903_req_in->qual[1].perform_action_meaning = uar_get_code_meaning(dCancelActionCd)
	set iTASK = 654913
 	set iREQUEST = 654903
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",654903_req_in,"REC",654903_rep_out)
 
 	set iValidate = 0
	if(654903_rep_out->status_data.status = "S")
		set iValidate = 1
	endif
 
	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_654903 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name: Req_651863(null)
;  Description: sch_check_lock
**************************************************************************/
subroutine Req_651863(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_651863 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iTASK = 651862
 	set iREQUEST = 651863
 
 	set stat = alterlist(651863_req_in->qual,1)
 	set 651863_req_in->qual[1].parent_table = "SCH_EVENT"
 	set 651863_req_in->qual[1].parent_id = dApptId
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",651863_req_in,"REC",651863_rep_out)
 
 	set iValidate = 0
 	if(651863_rep_out->status_data.status = "S")
 		set iValidate = 1
 		set dScheduleLockID = 651863_rep_out->qual[1].sch_lock_id
 	endif
 
 	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_651863 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
 
/*************************************************************************
;  Name: Req_651001(null)
;  Description: sch_chgw_event_state
**************************************************************************/
subroutine Req_651001(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_651001 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iTASK = 650551
 	set iREQUEST = 651001
 
 	;Validate cancel reason if submitted, otherwise default one.
 	if(dReasonCd = 0)
	 	select into "nl:"
	 	from code_value cv
	 	where cv.code_set = 14229 and cv.display_key like ("*CANCEL*")
	 	detail
	 		dReasonCd = cv.code_value
	 	with nocounter
	endif
 
 	set 651001_req_in->call_echo_ind = 1
 	set stat = alterlist(651001_req_in->qual,1)
 	set 651001_req_in->qual[1].sch_event_id = dApptId
 	set 651001_req_in->qual[1].skip_tofollow_ind = 1
 	set 651001_req_in->qual[1].schedule_seq = appointment_reply_out->schedule_seq
 	set 651001_req_in->qual[1].schedule_id = appointment_reply_out->schedule_id
 	set 651001_req_in->qual[1].sch_action_cd = dCancelActionCd
 	set 651001_req_in->qual[1].action_meaning = uar_get_code_meaning(dCancelActionCd)
 	set 651001_req_in->qual[1].sch_reason_cd = dReasonCd
 	set 651001_req_in->qual[1].sch_state_cd = dCancelStateCd
 	set 651001_req_in->qual[1].state_meaning = uar_get_code_meaning(dCancelStateCd)
 	set 651001_req_in->qual[1].appt_scheme_id = appointment_reply_out->appt_scheme_id
 	set 651001_req_in->qual[1].force_updt_ind = 1
 	set 651001_req_in->qual[1].candidate_id = appointment_reply_out->candidate_id
 	; Comments
 	set 651001_req_in->qual[1].comment_qual_cnt = 1
 	set stat = alterlist(651001_req_in->qual[1].comment_qual,1)
 	set 651001_req_in->qual[1].comment_qual[1].action = 1
 	set 651001_req_in->qual[1].comment_qual[1].sch_action_id = -1
 	set 651001_req_in->qual[1].comment_qual[1].text = build2(sComment)
 	set 651001_req_in->qual[1].comment_qual[1].text_active_ind = 1
 	set 651001_req_in->qual[1].comment_qual[1].active_ind = 1
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",651001_req_in,"REC",651001_rep_out)
 
	set iValidate = 0
	if(651001_rep_out->status_data.status = "S")
		set iValidate = 1
	endif
 
	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_651001 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name: Req_651862(null)
;  Description: sch_del_lock
**************************************************************************/
subroutine Req_651862(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_651862 Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iTASK = 651862
 	set iREQUEST = 651862
 
 	set stat = alterlist(651862_req_in->qual,1)
 	set 651862_req_in->qual[1].sch_lock_id = 651863_rep_out->qual[1].sch_lock_id
 	set 651862_req_in->qual[1].allow_partial_ind = 1
 	set 651862_req_in->qual[1].force_updt_ind = 1
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",651862_req_in,"REC",651862_rep_out)
 
 	set iValidate = 0
 	if(651862_rep_out->status_data.status= "S")
 		set iValidate = 1
 	endif
 
 	return(iValidate)
 
	if(idebugFlag > 0)
		call echo(concat("Req_651862 Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
 
 
end go
set trace notranslatelock go
 
 
