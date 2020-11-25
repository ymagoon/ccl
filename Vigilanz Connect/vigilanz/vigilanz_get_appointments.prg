/****************************************************************************

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
          Date Written:       10/10/15
          Source file name:   vigilanz_get_appointments
          Object name:        vigilanz_get_appointments
          Program purpose:    Retrieve Appointment information
          Executing from:     EMISSARY SERVICES
******************************************************************************
                   GENERATED MODIFICATION CONTROL LOG
******************************************************************************
 
 Mod Date     Engineer             Comment
 ------------------------------------------------------------------------------
  001 10/10/15 AAB		    		Initial write
  002 11/17/15 AAB		 	   		Support Status and dates as Inputs
  003 11/23/15 AAB 					Add Audit object
  004 04/29/16 AAB 					Added version
  005 10/10/16 AAB 		    		Add DEBUG_FLAG
  006 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  007 08/07/17 JCO					Updated UTC
  008 08/30/17 RJC					Added appt_id to json object
  009 09/22/17 RJC					Updated payload to match UDM more closely
  010 03/21/18 RJC					Added version code and copyright block
  011 10/05/18 RJC					Made post amble match get by id call;
  									Added pastorfuture flag from UDM
  									Added ability to process multiple statuses
  									Added appointment details
  									Code cleanup
 *******************************************************************************/
drop program vigilanz_get_appointments go
create program vigilanz_get_appointments
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "PersonId:" = ""				;Required
		, "Statuses:" = "" 				;Optional
        , "FromDate:" = ""				;Optional
		, "ToDate:" = ""				;Optional
		, "UserName:" = ""				;Optional
		, "PastOrFuture" = ""			;Required - defaults to 0 or all
  		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, STATUS, FROM_DATE, TO_DATE, USERNAME, PAST_FUTURE,DEBUG_FLAG
 
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
;650685 - sch_get_event_schedule
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
 
; 651573 - sch_get_appt_text
free record 651573_req
record 651573_req (
  1 security_ind = i2
  1 security_user_id = f8
  1 call_echo_ind = i2
  1 qual [*]
    2 appt_type_cd = f8
    2 location_cd = f8
    2 text_type_cd = f8
    2 text_type_meaning = c12
    2 check_flex_ind = i2
    2 sch_event_id = f8
    2 schedule_id = f8
    2 schedule_seq = i4
    2 person_id = f8
    2 encntr_id = f8
    2 resource_pass_ind = i2
    2 resource_qual_cnt = i4
    2 resource_qual [*]
      3 resource_cd = f8
    2 order_pass_ind = i2
    2 order_qual_cnt = i4
    2 order_qual [*]
      3 order_id = f8
      3 person_id = f8
      3 encntr_id = f8
      3 synonym_id = f8
      3 catalog_cd = f8
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
    2 temp_index = i4
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
)
 
free record 651573_rep
record 651573_rep (
	1 qual_cnt = i4
    1 qual [* ]
      2 appt_type_cd = f8
      2 location_cd = f8
      2 text_type_cd = f8
      2 qual_cnt = i4
      2 qual [* ]
        3 sub_text_cd = f8
        3 text_type_cd = f8
        3 text_link_id = f8
        3 template_qual_cnt = i4
        3 template_qual [* ]
          4 template_id = f8
          4 required_ind = i2
          4 long_text_id = f8
          4 seq_nbr = i4
          4 text = vc
          4 res_valid_ind = i2
          4 order_valid_ind = i2
          4 sch_flex_id = f8
          4 pass_ind = i2
          4 order_index = i4
          4 template_type_cd = f8
          4 template_rank_nbr = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
; 650723 - sch_get_action_comments
free record 650723_req
record 650723_req (
  1 security_ind = i2
  1 security_user_id = f8
  1 call_echo_ind = i2
  1 qual [*]
    2 sch_event_id = f8
)
free record 650723_rep
record 650723_rep (
	1 qual_cnt = i4
   1 qual [* ]
     2 sch_event_id = f8
     2 qual_cnt = i4
     2 qual [* ]
       3 sch_action_id = f8
       3 text_id = f8
       3 text = vc
       3 text_type_cd = f8
       3 text_type_meaning = vc
       3 sub_text_cd = f8
       3 sub_text_meaning = vc
       3 version_dt_tm = dq8
       3 appt_type_cd = f8
       3 person_name = vc
       3 beg_effective_dt_tm = dq8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
; 650724 - sch_get_event_conv
free record 650724_req
record 650724_req (
  1 call_echo_ind = i2
  1 qual [*]
    2 sch_event_id = f8
)
free record 650724_rep
record 650724_rep (
	1 qual_cnt = i4
   	1 qual [* ]
     2 sch_event_id = f8
     2 action_qual_cnt = i4
     2 action_qual [* ]
       3 sch_action_id = f8
       3 conversation_id = f8
       3 comment_qual_cnt = i4
       3 comment_qual [* ]
         4 text_type_cd = f8
         4 text_type_meaning = vc
         4 sub_text_cd = f8
         4 sub_text_meaning = vc
         4 text_id = f8
         4 text = vc
   	1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;Final reply
free record appt_reply_out
record appt_reply_out (
	1 Appointments[*]
		2 PatientId 					= f8
		2 AppointmentId 				= f8
		2 EncounterId					= f8
		2 FinancialNumber				= vc
		2 Status
			3 Id						= f8
			3 Name						= vc
		2 AppointmentDateTime 			= dq8
		2 Duration 						= i4
		2 VisitType
			3 VisitTypeId 				= f8
			3 VisitTypeName 			= vc
			3 ExternalName				= vc
		2 PatientInstructions			= vc
		2 AppointmentComments			= vc
		2 ResourceDepartments[*]
			3 Department
				4 DepartmentId 			= f8
				4 DepartmentName 		= vc
				4 ExternalName 			= vc
				4 Specialty 			= vc
				4 Address
					5  AddressId       	= f8
					5  Address1			= vc
					5  Address2        	= vc
					5  City            	= vc
					5  State         	= vc
					5  Zip          	= vc
					5  Type
						6 Id			= f8
						6 Name			= vc
				 4 Phones[*]
				   5 PhoneId			= f8
				   5 Number				= vc
				   5 SequenceNumber		= i2
				   5 Type
				   	6 Id				= f8
				   	6 Name				= vc
				 4 DrivingDirections 	= vc
			3 Resource
				4 ProviderId 			= f8
				4 ProviderName 			= vc
		2 ConfirmedDateTime 			= dq8
		2 AppointmentDetails[*]
			3 Field
				4 Id 					= f8
				4 Name 					= vc
			3 Coded_Values[1]
				4 Id 					= f8
				4 Name 					= vc
			3 Text_Values 				= vc
	1 audit
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
		2 service_version				= vc
  1 status_data
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code 							= c4
      3 Description 					= vc
 )
 
 ;Appt status list
 free record appt_status
 record appt_status (
 	1 list[*]
 		2 status_cd = f8
 		2 status_mean = vc
 )
 
 ;Temp record
free record temp_appt
record temp_appt (
	1 list[*]
		2 appt_id = f8
		2 schedule_id = f8
)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName					= vc with protect, noconstant("")
declare dPatientId  				= f8 with protect, noconstant(0.0)
declare sApptStatus					= vc with protect, noconstant("")
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare iPastFuture					= i2 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId					= f8 with protect, noconstant(0.0)
declare qFromDate					= dq8 with protect, noconstant(0)
declare qToDate						= dq8 with protect, noconstant(0)
declare dPastQueryId				= f8 with protect, noconstant(0)
declare dFutureQueryId				= f8 with protect, noconstant(0)
 
;Constants
declare c_error_handler						= vc with protect, constant("GET APPOINTMENTS")
declare c_future_scheduling_query_type_cd 	= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 14349, "APPTINDEXFUT"))
declare c_past_scheduling_query_type_cd		= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 14349, "APPTINDEXPAS"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Inputs
set sUserName		= trim($USERNAME, 3)
set dPatientId 		= cnvtreal($PERSON_ID)
set sApptStatuses	= trim($STATUS,3)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set iPastFuture		= cnvtint($PAST_FUTURE) ;0=Both, 1=Past, 2=Future
set iDebugFlag		= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId		= GetPrsnlIDfromUserName(sUserName)
 
; Dates
if(sFromDate = "")
	if(iPastFuture in (0,1))
		set sFromDate = "01-JAN-1900 00:00:00"
	endif
endif
if(sToDate = "")
	if(iPastFuture in (0,2))
		set sToDate = "31-DEC-2100 00:00:00"
	endif
endif
set qFromDate		= GetDateTime(sFromDate)
set qToDate			= GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName->",sUserName))
	call echo(build("dPatientId->",dPatientId))
	call echo(build("sApptStatuses->",sApptStatuses))
	call echo(build("sFromDate->",sFromDate))
	call echo(build("sToDate->",sToDate))
	call echo(build("iPastFuture->",iPastFuture))
	call echo(build("dPrsnlId->",dPrsnlId))
	call echo(build("qFromDate->",qFromDate))
	call echo(build("qToDate->",qToDate))
	call echo(build("qFromDate->",format(qFromDate,"MM/DD/YYYY HH:MM:SS;;q")))
	call echo(build("qToDate->",format(qToDate,"MM/DD/YYYY HH:MM:SS;;q")))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseStatuses(null)						= null with protect
declare GetAppointmentList(null)				= null with protect
declare GetApptIdDetails(null) 					= i2 with protect 	;650685 - sch_get_event_schedule
declare PostAmble(null)							= null with protect
declare GetInstructions(appt_type_cd = f8, location_cd = f8,
sch_event_id = f8, sched_id = f8, sched_seq = i4) = vc with protect ;651573 - sch_get_appt_text
declare GetComments(appt_id = f8) 				= vc with protect	;650723 - sch_get_action_comments & 650724 - sch_get_event_conv
/*************************************************************************
;MAIN
**************************************************************************/
; Validate PatientId exists
if(dPatientId = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing URI paramters: PatientId",
	"2003","Missing URI paramters: PatientId", appt_reply_out)
	go to exit_script
endif
 
; Validate Username
set iRet = PopulateAudit(sUserName, dPatientId, appt_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid User for Audit",
	"1001", build("UserId is invalid: ",sUserName), appt_reply_out)
	go to exit_script
endif
 
; Verify FromDate is not Greater than ToDate
if(qFromDate > qToDate)
	call ErrorHandler2(c_error_handler, "F", "Validate", "FromDateTime is greater than ToDateTime.",
	"2010","FromDateTime is greater than ToDateTime.", appt_reply_out)
	go to exit_script
endif
 
; Validate PastOrFuture flag
if(iPastFuture < 0 or iPastFuture > 2)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid PastOrFuture flag.",
	"2007","Invalid PastOrFuture flag.", appt_reply_out)
	go to exit_script
endif
 
; Parse and Validate statuses if provided
if(sApptStatuses > " ")
	call ParseStatuses(null)
endif
 
; Get Appointment List
call GetAppointmentList(null)
 
; Get Appointment Id Details - 650685 - sch_get_event_schedule
set iRet = GetApptIdDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not get appointment details (650685).",
	"9999","Could not get appointment details (650685).", appt_reply_out)
	go to exit_script
endif
 
; Get Appointment Details and build final reply - 650685 - sch_get_event_schedule
call PostAmble(null)
 
; Set Audit to success
call ErrorHandler(c_error_handler, "S", "Success", "Patient appointments retrieved successfully.", appt_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(appt_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_appointments.json")
	call echo(build2("_file : ", _file))
	call echojson(appt_reply_out, _file, 0)
    call echorecord(appt_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseStatuses(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseStatuses(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseStatuses Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sApptStatuses,',',num,notfnd)
     	if(str != notfnd)
      		set stat = alterlist(appt_status->list, num)
     		set appt_status->list[num].status_cd = cnvtreal(str)
 
     		set iRet = GetCodeSet(appt_status->list[num].status_cd)
     		if(iRet != 14233)
     			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid StatusId: ",str),
				"9999",build2("Invalid StatusId: ",str), appt_reply_out)
				go to exit_script
			endif
			set appt_status->list[num].status_mean = uar_get_code_meaning(appt_status->list[num].status_cd)
     	endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseStatuses Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetAppointmentList(null) = null
;  Description: Get AppointmentList
**************************************************************************/
subroutine GetAppointmentList(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAppointmentList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	;Use the person schedule inquiry query to get appointment list
	set num = 1
	select
		if(size(appt_status->list,5) > 0)
			plan a where a.person_id = dPatientId
				and expand(num,1,size(appt_status->list,5),a.sch_state_cd,appt_status->list[num].status_cd)
				and a.beg_dt_tm >= 	cnvtdatetime(qFromDate)
				and	a.beg_dt_tm <= cnvtdatetime(qToDate)
				and	a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
				and	a.role_meaning = "PATIENT"
			join e where e.sch_event_id = a.sch_event_id
			order a.beg_dt_tm
		else
			plan a where a.person_id = dPatientId
				and a.beg_dt_tm >= 	cnvtdatetime(qFromDate)
				and	a.beg_dt_tm <= cnvtdatetime(qToDate)
				and	a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
				and	a.role_meaning = "PATIENT"
				and a.schedule_seq = 1
			join e where e.sch_event_id = a.sch_event_id
			order a.beg_dt_tm
		endif
	into "nl:"
	from sch_appt a,
	     sch_event e
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(temp_appt->list,x)
 
		temp_appt->list[x].appt_id = a.sch_event_id
		temp_appt->list[x].schedule_id = a.schedule_id
	with nocounter
 
	;If no records found, exit script
	if(size(temp_appt->list,5) = 0)
		call ErrorHandler(c_error_handler, "Z", "Success", "No appointments found.", appt_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetFutureAppointments Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end
 
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
 
 	; Setup request
 	for(i = 1 to size(temp_appt->list,5))
		set stat = alterlist(650685_req->qual,i)
 
		set 650685_req->security_ind = 1
	 	set 650685_req->security_user_id = dPrsnlId
	 	set 650685_req->qual[i].sch_event_id = temp_appt->list[i].appt_id
	 	set 650685_req->qual[i].schedule_seq = 1
	 	set 650685_req->qual[i].schedule_id = temp_appt->list[i].schedule_id
	 	set 650685_req->qual[i].event_ind = 1
	 	set 650685_req->qual[i].detail_ind = 1
	 	set 650685_req->qual[i].comment_ind = 1
	 	set 650685_req->qual[i].patient_ind = 1
	 	set 650685_req->qual[i].location_ind = 1
	 	set 650685_req->qual[i].appt_ind = 1
	 	set 650685_req->qual[i].attach_ind = 1
	 	set 650685_req->qual[i].schedule_ind = 1
	 	set 650685_req->qual[i].recur_ind = 1
	 	set 650685_req->qual[i].recur_sibling_ind = 1
	 	set 650685_req->qual[i].denormalize_ind = 1
	 	set 650685_req->qual[i].lock_ind = 1
	 	set 650685_req->qual[i].option_ind = 1
	 	set 650685_req->qual[i].modification_ind = 1
	 	set 650685_req->qual[i].confirm_ind = 1
	 	set 650685_req->qual[i].request_ind = 1
	 	set 650685_req->qual[i].version_ind = 1
	 	set 650685_req->qual[i].protocol_sibling_ind = 1
	 	set 650685_req->qual[i].checkin_ind = 1
	 	set 650685_req->qual[i].request_info_ind = 1
	 	set 650685_req->qual[i].checkout_ind = 1
	 	set 650685_req->qual[i].patseen_ind = 1
	 	set 650685_req->qual[i].event_alias_ind = 1
	 	set 650685_req->qual[i].warning_ind = 1
	 	set 650685_req->qual[i].action_ind = 1
	 	set 650685_req->qual[i].move_criteria_ind = 1
	 	set 650685_req->qual[i].to_follow_ind = 1
	 	set 650685_req->qual[i].link_sibling_ind = 1
	 	set 650685_req->qual[i].restore_ind = 1
	 	set 650685_req->qual[i].apptdefer_ind = 1
 	endfor
 
 	;Execute Request
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",650685_req,"REC",650685_rep)
 
 	set iValidate = 0
 	if(650685_rep->status_data.status = "S")
 		set iValidate = 650685_rep->qual_cnt
 	endif

	if(iDebugFlag > 0)
		call echo(concat("GetApptIdDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Build Final Reply
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set stat = alterlist(appt_reply_out->Appointments,650685_rep->qual_cnt)
 	for(idx = 1 to 650685_rep->qual_cnt)
 
	 	; High level details
		set appt_reply_out->Appointments[idx].PatientId = 650685_rep->qual[idx].patient_qual[1].person_id
		set appt_reply_out->Appointments[idx].AppointmentId = 650685_rep->qual[idx].sch_event_id
		set appt_reply_out->Appointments[idx].EncounterId = 650685_rep->qual[idx].patient_qual[1].encntr_id
		set appt_reply_out->Appointments[idx].Status.Id = 650685_rep->qual[idx].sch_state_cd
		set appt_reply_out->Appointments[idx].Status.Name = uar_get_code_display(650685_rep->qual[idx].sch_state_cd)
		set appt_reply_out->Appointments[idx].VisitType.VisitTypeId = 650685_rep->qual[idx].appt_type_cd
		set appt_reply_out->Appointments[idx].VisitType.VisitTypeName = 650685_rep->qual[idx].appt_type_disp
		set appt_reply_out->Appointments[idx].VisitType.ExternalName = 650685_rep->qual[idx].appt_synonym_free
 
		; Resources
		set x = 0
		for(i = 1 to 650685_rep->qual[idx].appt_qual_cnt)
			if(650685_rep->qual[idx].appt_qual[i].role_meaning = "PATIENT")
				set appt_reply_out->Appointments[idx].Duration = 650685_rep->qual[idx].appt_qual[i].duration
				set appt_reply_out->Appointments[idx].AppointmentDateTime = 650685_rep->qual[idx].appt_qual[i].beg_dt_tm
			else
				set x = x + 1
				set stat = alterlist( appt_reply_out->Appointments[idx].ResourceDepartments,x)
				set appt_reply_out->Appointments[idx].ResourceDepartments[x]->Department->DepartmentId =
					650685_rep->qual[idx].location_qual[1].location_cd
				set appt_reply_out->Appointments[idx].ResourceDepartments[x]->Department->DepartmentName =
					650685_rep->qual[idx].location_qual[1].location_disp
				set appt_reply_out->Appointments[idx].ResourceDepartments[x]->Department->ExternalName =
					650685_rep->qual[idx].location_qual[1].location_disp
				set appt_reply_out->Appointments[idx].ResourceDepartments[x]->Resource[1]->ProviderId =
					650685_rep->qual[idx].appt_qual[i].resource_cd
				set appt_reply_out->Appointments[idx].ResourceDepartments[x]->Resource[1]->ProviderName =
					650685_rep->qual[idx].appt_qual[i].resource_disp
 
				; Location Address
				select into "nl:"
				from address a
				plan a where a.parent_entity_name = "LOCATION"
					 and a.parent_entity_id = 650685_rep->qual[idx].location_qual[1].location_cd
					 and a.address_type_cd = value(uar_get_code_by("MEANING",212,"BUSINESS"))
					 and a.active_ind = 1
					 and a.end_effective_dt_tm > sysdate
					 and a.beg_effective_dt_tm <= sysdate
				detail
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.AddressId = a.address_id
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.Type.Id = a.address_type_cd
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.Type.Name = uar_get_code_display(a.address_type_cd)
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.Address1 = a.street_addr
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.Address2 = a.street_addr2
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.City = a.city
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.Zip = a.zipcode
					if(a.state_cd > 0)
						appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.State = uar_get_code_display(a.state_cd)
					else
						appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Address.State = a.state
					endif
				with nocounter
 
	 			; Location Phones
				select into "nl:"
				from phone ph
				where ph.parent_entity_name = "LOCATION"
					and ph.parent_entity_id = 650685_rep->qual[idx].location_qual[1].location_cd
					and ph.active_ind = 1
					and ph.end_effective_dt_tm > sysdate
					and ph.beg_effective_dt_tm <= sysdate
				head report
					p = 0
				detail
					p = p + 1
					stat = alterlist(appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones,p)
 
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones[p].PhoneId = ph.phone_id
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones[p].Number = ph.phone_num
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones[p].SequenceNumber = ph.seq
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones[p].Type.Id = ph.phone_type_cd
					appt_reply_out->Appointments[idx].ResourceDepartments[x].Department.Phones[p].Type.Name =
						uar_get_code_display(ph.phone_type_cd)
				with nocounter
			endif
		endfor
 
	 	; Confirmed Date/Time
	 	for(a = 1 to 650685_rep->qual[idx].action_qual_cnt)
	 		if(trim(650685_rep->qual[idx].action_qual[a].action_meaning,3) = "CONFIRM")
				set appt_reply_out->Appointments[idx].ConfirmedDateTime = 650685_rep->qual[idx].action_qual[a].action_dt_tm
			endif
		endfor
 
	 	; Patient Instructions
	 	set appt_reply_out->Appointments[idx].PatientInstructions =
	 	GetInstructions( 650685_rep->qual[idx].appt_type_cd,
	 					 650685_rep->qual[idx].location_qual[1].location_cd,
	 					 650685_rep->qual[idx].sch_event_id,
	 					 650685_rep->qual[idx].schedule_id,
	 					 650685_rep->qual[idx].schedule_seq)
 
	 	; Appointment Comments
	 	set appt_reply_out->Appointments[idx].AppointmentComments = GetComments(650685_rep->qual[idx].sch_event_id)
 
		; Get Financial Number
		select into "nl:"
		from encntr_alias ea
		where ea.encntr_id = appt_reply_out->Appointments[idx].EncounterId
			and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
			and ea.active_ind = 1
			and ea.end_effective_dt_tm > sysdate
			and ea.beg_effective_dt_tm <= sysdate
		detail
			appt_reply_out->Appointments[idx].FinancialNumber = ea.alias
		with nocounter
		
		; Appointment Details
		if(650685_rep->qual[idx].detail_qual_cnt > 0)
			set j = 0
			for(i = 1 to 650685_rep->qual[idx].detail_qual_cnt)
				if(650685_rep->qual[idx].detail_qual[i].version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00"))
					set j = j + 1
					set stat = alterlist(appt_reply_out->Appointments[idx].AppointmentDetails,j)
					set appt_reply_out->Appointments[idx].AppointmentDetails[j].Field.Id = 650685_rep->qual[idx].detail_qual[i].oe_field_id
		 
					;Field Text
					select into "nl:"
					from order_entry_fields oef
					plan oef where oef.oe_field_id = 650685_rep->qual[idx].detail_qual[i].oe_field_id
					detail
						appt_reply_out->Appointments[idx].AppointmentDetails[j].Field.Name = oef.description
		 
						;Field Type Flags
							;0 	;ALPHANUMERIC
				        	;1 	;INTEGER
				          	;2 	;DECIMIAL
				          	;3 	;DATE
				          	;5 	;DATE/TIME
				          	;6 	;CODESET
				          	;7 	;YES/NO
				          	;8 	;PROVIDER
				          	;9 	;LOCATION
				         	;10 ;ICD9
				         	;11	;PRINTER
				         	;12	;LIST
				         	;13	;USER/PERSONNEL
				         	;14	;ACCESSION
				         	;15	;SURGICAL DURATION
						if(oef.field_type_flag in (6,7,8,9,10,11,13))
							appt_reply_out->Appointments[idx].AppointmentDetails[j].Coded_Values[1].Id = 
								650685_rep->qual[idx].detail_qual[i].oe_field_value
							appt_reply_out->Appointments[idx].AppointmentDetails[j].Coded_Values[1].Name = 
								650685_rep->qual[idx].detail_qual[i].oe_field_display_value
						else
							if(oef.field_type_flag = 12 and oef.codeset > 0)
								appt_reply_out->Appointments[idx].AppointmentDetails[j].Coded_Values[1].Id = 
									650685_rep->qual[idx].detail_qual[i].oe_field_value
								appt_reply_out->Appointments[idx].AppointmentDetails[j].Coded_Values[1].Name = 
									650685_rep->qual[idx].detail_qual[i].oe_field_display_value
							else
								appt_reply_out->Appointments[idx].AppointmentDetails[j].Text_Values = 
									650685_rep->qual[idx].detail_qual[i].oe_field_display_value
							endif
						endif
					with nocounter
				endif
			endfor
		endif
 	endfor
 
 	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name: GetInstructions(appt_type_cd, location_cd, sch_event_id, sched_id, sched_seq) = vc
	651573 - sch_get_appt_text
;  Description: Get appointment patient instructions
**************************************************************************/
subroutine GetInstructions(appt_type_cd, location_cd, sch_event_id, sched_id, sched_seq)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInstructions Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare sInstructions = vc
 	set sInstructions = ""
 
 	set iValidate = 0
	set iApplication = 650001
	set iTask = 652003
	set iRequest = 651573
 
 
	; Setup request
	select into "nl:"
	from sch_code_group scg
	where scg.code_group_meaning = "INSTRUCTIONS"
	head report
		x = 0
	detail
		651573_req->security_ind = 1
		651573_req->security_user_id = dPrsnlId
 
		x = x + 1
		stat = alterlist(651573_req->qual,x)
		651573_req->qual[x].appt_type_cd = appt_type_cd
		651573_req->qual[x].location_cd = location_cd
		651573_req->qual[x].text_type_cd= scg.code_value
		651573_req->qual[x].check_flex_ind = 1
		651573_req->qual[x].sch_event_id = sch_event_id
		651573_req->qual[x].schedule_id = sched_id
		651573_req->qual[x].schedule_seq = sched_seq
	with nocounter
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",651573_req,"REC",651573_rep)
 
	if(651573_rep->status_data.status != "F")
		set iValidate = 1
	 	if(651573_rep->qual_cnt > 0)
	 		for(h = 1 to 651573_rep->qual_cnt)
	 			if(651573_rep->qual[h].qual_cnt > 0)
	 				for(i = 1 to 651573_rep->qual[h].qual_cnt)
	 					if(651573_rep->qual[h].qual[i].template_qual_cnt > 0)
	 						set j = 1
	 						select into "nl:"
	 						from long_text lt
	 						where expand(j,1,651573_rep->qual[h].qual[h].template_qual_cnt,
	 							lt.long_text_id,651573_rep->qual[h].qual[h].template_qual[j].long_text_id)
	 						head report
	 							k = 0
	 						detail
	 							if(k = 1)
	 								sInstructions = lt.long_text
	 							else
	 								sInstructions = build2(sInstructions, char(10), lt.long_text)
	 							endif
	 						with nocounter
	 					endif
	 				endfor
	 			endif
	 		endfor
	 	endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetInstructions Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(sInstructions)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetComments(appt_id = f8) = vc 	650723 - sch_get_action_comments & 650724 - sch_get_event_conv
;  Description: Get all appointment comments
**************************************************************************/
subroutine GetComments(appt_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetComments Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare sComments = vc
 	set sComments = ""
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 651703
 
	; 650723 - sch_get_action_comments
	set iRequest = 650723
 
	set 650723_req->security_ind = 1
	set 650723_req->security_user_id = dPrsnlId
	set stat = alterlist(650723_req->qual,1)
	set 650723_req->qual[1].sch_event_id = appt_id
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650723_req,"REC",650723_rep)
 
	if(650723_rep->status_data.status != "F")
		set iValidate = 1
		if(650723_rep->qual_cnt > 0)
			for(h = 1 to 650723_rep->qual_cnt)
				if(650723_rep->qual[h].qual_cnt > 0)
					for(i = 1 to 650723_rep->qual[h].qual_cnt)
						if(i = 1)
							set sComments = 650723_rep->qual[h].qual[i].text
						else
							set sComments = build2(sComments, char(10), 650723_rep->qual[h].qual[i].text)
						endif
					endfor
				endif
			endfor
		endif
 
		; 650724 - sch_get_event_conv
		set iRequest = 650724
 
		free record 650724_temp
		record 650724_temp (
			1 list[*]
				2 text_id = f8
				2 text = vc
		)
 
		set stat = alterlist(650724_req->qual,1)
		set 650724_req->qual[1].sch_event_id = appt_id
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650724_req,"REC",650724_rep)
 
		if(650724_rep->status_data.status = "F")
			set iValidate = 0
		else
			if(650724_rep->qual_cnt > 0)
				for(h = 1 to 650724_rep->qual_cnt)
					if(650724_rep->qual[h].action_qual_cnt > 0)
						for(i = 1 to 650724_rep->qual[h].action_qual_cnt)
							if(650724_rep->qual[h].action_qual[i].comment_qual_cnt > 0)
								for(j = 1 to 650724_rep->qual[h].action_qual[i].comment_qual_cnt)
									set stat = alterlist(650724_temp->list,j)
									set 650724_temp->list[j].text_id = 650724_rep->qual[h].action_qual[i].comment_qual[j].text_id
									set 650724_temp->list[j].text = 650724_rep->qual[h].action_qual[i].comment_qual[j].text
								endfor
							endif
						endfor
					endif
				endfor
			endif
		endif
 
		if(size(650724_temp->list,5) > 0)
			select into "nl:"
				textid = 650724_temp->list[d.seq].text_id
			from (dummyt d with seq = size(650724_temp->list,5))
			order by 650724_temp->list[d.seq].text_id
			head textid
				if(sComments > " ")
					sComments = build2(sComments, char(10),650724_temp->list[d.seq].text)
				else
					sComments = 650724_temp->list[d.seq].text
				endif
			with nocounter
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(sComments)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
