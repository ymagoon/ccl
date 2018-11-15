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
*
   ~BE~***********************************************************************
      Source file name:     snsro_get_appointment.prg
      Object name:          snsro_get_appointment
      Program purpose:      Retrieves appt data by appointment id
      Executing from:       Emissary Service
*****************************************************************************
                     MODIFICATION CONTROL LOG
*****************************************************************************
 
 Mod Date     Engineer             Comment
 --- -------- -------------------- ------------------------------------------
  001 08/25/17 RJC                	Initial write
  002 09/21/17 RJC					Modified outbound record to match Emissary
  003 03/21/18 RJC					Added version code and copyright block
  004 10/01/18 RJC					Added Appointment Details Object. Minor rewrite
****************************************************************************/
drop program snsro_get_appointment go
create program snsro_get_appointment
 
prompt
  "Output to File/Printer/MINE" = "MINE"
    ,"Appointment ID" = 0.0
	,"User Name" = ""
	,"Debug Flag" = 0
 
with OUTDEV, APPT_ID, USERNAME, DEBUG_FLAG
 
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
 
; Final reply
free record appt_reply_out
record appt_reply_out (
	1 PatientId 					= f8
	1 AppointmentId 				= f8
	1 EncounterId					= f8
	1 FinancialNumber 				= vc
	1 Status
		2 Id 						= f8
		2 Name						= vc
	1 AppointmentDateTime 			= dq8
	1 Duration 						= i4
	1 VisitType
		2 VisitTypeId				= f8
		2 VisitTypeName 			= vc
		2 ExternalName 				= vc
	1 PatientInstructions 			= vc
	1 AppointmentComments 			= vc
	1 ResourceDepartments[*]
		2 Department
			3 DepartmentId 			= f8
			3 DepartmentName 		= vc
			3 ExternalName 			= vc
			3 Specialty 			= vc
			3 Address
				4  AddressId       	= f8
				4  Address1			= vc
				4  Address2        	= vc
				4  City             = vc
				4  State         	= vc
				4  Zip          	= vc
				4  Type
					5 Id			= f8
					5 Name			= vc
			 3 Phones[*]
			   4 PhoneId			= f8
			   4 Number				= vc
			   4 SequenceNumber		= i2
			   4  Type
					5 Id			= f8
					5 Name			= vc
			 3 DrivingDirections 	= vc
		2 Resource
			3 ProviderId 			= f8
			3 ProviderName 			= vc
	1 ConfirmedDateTime = dq8
	1 AppointmentDetails[*]
		2 Field
			3 Id 					= f8
			3 Name 					= vc
		2 Coded_Values[1]
			3 Id 					= f8
			3 Name 					= vc
		2 Text_Values 				= vc
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
		2 service_version			= vc
	1 status_data
		2 status 					= c1
		2 subeventstatus[1]
			3 OperationName 		= c25
			3 OperationStatus 		= c1
			3 TargetObjectName 		= c25
			3 TargetObjectValue 	= vc
			3 Code 					= c4
			3 Description 			= vc
 
)
;002 end
set appt_reply_out->status_data.status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dAppointmentId  	= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Other
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dScheduleId			= f8 with protect, noconstant(0.0)
declare dUserId				= f8 with protect, noconstant(0.0)
declare sInstructions 		= vc with protect, noconstant("")
declare sComments			= vc with protect, noconstant("")
 
;Constants
declare c_error_handler		= vc with protect, constant("GET APPOINTMENT ID")
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set dAppointmentId 			= cnvtreal($APPT_ID)
set sUserName 				= trim($USERNAME, 3)
set iDebugFlag 				= cnvtint($DEBUG_FLAG)
 
;Other
set dUserId					= GetPrsnlIDfromUserName(sUserName)
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetScheduleId(null)				= i2 with protect
declare GetApptIdDetails(null)			= i2 with protect	;650685 - sch_get_event_schedule
declare GetInstructions(null)			= i2 with protect	;651573 - sch_get_appt_text
declare GetComments(null)				= i2 with protect	;650723 - sch_get_action_comments & 650724 - sch_get_event_conv
declare PostAmble(null) 				= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate AppointmentId exists
if(dAppointmentId = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing required field: AppointmentId.",
	"2055", "Missing required field: AppointmentId", appt_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get ScheduleId & PatientId
set iRet = GetScheduleId(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid AppointmentId",
	"9999",build2("Invalid AppointmentId"), appt_reply_out)
	go to exit_script
endif
 
;Validate User
set iRet = PopulateAudit(sUserName, dPatientId, appt_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), appt_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get AppointmentId Details - 650685 - sch_get_event_schedule
set iRet = GetApptIdDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not get appointment details (650685).",
	"9999",build2("Could not get appointment details (650685). "), appt_reply_out)
	go to exit_script
endif
 
; Get Instructions - 651573 - sch_get_appt_text
set iRet = GetInstructions(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not get appointment instructions (651573).",
	"9999","Could not get appointment instructions (651573).", appt_reply_out)
	go to exit_script
endif
 
; Get Appointment Comments - 650723 - sch_get_action_comments & 650724 - sch_get_event_conv
set iRet = GetComments(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not get appointment comments.",
	"9999","Could not get appointment comments.", appt_reply_out)
	go to exit_script
endif
 
;Post Amble
call PostAmble(null)
 
;Update Audit
call ErrorHandler(c_error_handler, "S", "Success","Appointment details retrieved successfully.", appt_reply_out)
 
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
	set _file = build2(trim(file_path),"/snsro_get_appointment.json")
	call echo(build2("_file : ", _file))
	call echojson(appt_reply_out, _file, 0)
	call echorecord(appt_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
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
 
 	; Setup request
	set stat = alterlist(650685_req->qual,1)
	set 650685_req->security_ind = 1
 	set 650685_req->security_user_id = dUserId
 	set 650685_req->qual[1].sch_event_id = dAppointmentId
 	set 650685_req->qual[1].schedule_seq = 1
 	set 650685_req->qual[1].schedule_id = dScheduleId
 	set 650685_req->qual[1].event_ind = 1
 	set 650685_req->qual[1].detail_ind = 1
 	set 650685_req->qual[1].comment_ind = 1
 	set 650685_req->qual[1].patient_ind = 1
 	set 650685_req->qual[1].location_ind = 1
 	set 650685_req->qual[1].appt_ind = 1
 	set 650685_req->qual[1].attach_ind = 1
 	set 650685_req->qual[1].schedule_ind = 1
 	set 650685_req->qual[1].recur_ind = 1
 	set 650685_req->qual[1].recur_sibling_ind = 1
 	set 650685_req->qual[1].denormalize_ind = 1
 	set 650685_req->qual[1].lock_ind = 1
 	set 650685_req->qual[1].option_ind = 1
 	set 650685_req->qual[1].modification_ind = 1
 	set 650685_req->qual[1].confirm_ind = 1
 	set 650685_req->qual[1].request_ind = 1
 	set 650685_req->qual[1].version_ind = 1
 	set 650685_req->qual[1].protocol_sibling_ind = 1
 	set 650685_req->qual[1].checkin_ind = 1
 	set 650685_req->qual[1].request_info_ind = 1
 	set 650685_req->qual[1].checkout_ind = 1
 	set 650685_req->qual[1].patseen_ind = 1
 	set 650685_req->qual[1].event_alias_ind = 1
 	set 650685_req->qual[1].warning_ind = 1
 	set 650685_req->qual[1].action_ind = 1
 	set 650685_req->qual[1].move_criteria_ind = 1
 	set 650685_req->qual[1].to_follow_ind = 1
 	set 650685_req->qual[1].link_sibling_ind = 1
 	set 650685_req->qual[1].restore_ind = 1
 	set 650685_req->qual[1].apptdefer_ind = 1
 
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
;  Name: GetInstructions(null) = i2 	651573 - sch_get_appt_text
;  Description: Get appointment patient instructions
**************************************************************************/
subroutine GetInstructions(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInstructions Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
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
		651573_req->security_user_id = dUserId
 
		x = x + 1
		stat = alterlist(651573_req->qual,x)
		651573_req->qual[x].appt_type_cd = 650685_rep->qual[1].appt_type_cd
		651573_req->qual[x].location_cd = 650685_rep->qual[1].location_qual[1].location_cd
		651573_req->qual[x].text_type_cd= scg.code_value
		651573_req->qual[x].check_flex_ind = 1
		651573_req->qual[x].sch_event_id = 650685_rep->qual[1].sch_event_id
		651573_req->qual[x].schedule_id = 650685_rep->qual[1].schedule_id
		651573_req->qual[x].schedule_seq = 650685_rep->qual[1].schedule_seq
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
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetComments(null) = i2 	650723 - sch_get_action_comments & 650724 - sch_get_event_conv
;  Description: Get all appointment comments
**************************************************************************/
subroutine GetComments(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetComments Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 650001
	set iTask = 651703
 
	; 650723 - sch_get_action_comments
	set iRequest = 650723
 
	set 650723_req->security_ind = 1
	set 650723_req->security_user_id = dUserId
	set stat = alterlist(650723_req->qual,1)
	set 650723_req->qual[1].sch_event_id = dAppointmentId
 
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
		set 650724_req->qual[1].sch_event_id = dAppointmentId
 
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
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Retrieve appt details by appointment_id
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; High level details
	set appt_reply_out->PatientId = dPatientId
	set appt_reply_out->AppointmentId = dAppointmentId
	set appt_reply_out->EncounterId = 650685_rep->qual[1].patient_qual[1].encntr_id
	set appt_reply_out->Status.Id = 650685_rep->qual[1].sch_state_cd
	set appt_reply_out->Status.Name = uar_get_code_display(650685_rep->qual[1].sch_state_cd)
	set appt_reply_out->VisitType.VisitTypeId = 650685_rep->qual[1].appt_type_cd
	set appt_reply_out->VisitType.VisitTypeName = 650685_rep->qual[1].appt_type_disp
	set appt_reply_out->VisitType.ExternalName = 650685_rep->qual[1].appt_synonym_free
 
	; Resources
	set x = 0
	for(i = 1 to 650685_rep->qual[1].appt_qual_cnt)
		if(650685_rep->qual[1].appt_qual[i].role_meaning = "PATIENT")
			set appt_reply_out->Duration = 650685_rep->qual[1].appt_qual[i].duration
			set appt_reply_out->AppointmentDateTime = 650685_rep->qual[1].appt_qual[i].beg_dt_tm
		else
			set x = x + 1
			set stat = alterlist( appt_reply_out->ResourceDepartments,x)
			set appt_reply_out->ResourceDepartments[x]->Department->DepartmentId = 650685_rep->qual[1].location_qual[1].location_cd
			set appt_reply_out->ResourceDepartments[x]->Department->DepartmentName = 650685_rep->qual[1].location_qual[1].location_disp
			set appt_reply_out->ResourceDepartments[x]->Department->ExternalName =
			650685_rep->qual[1].location_qual[1].location_disp
			set appt_reply_out->ResourceDepartments[x]->Resource[1]->ProviderId = 650685_rep->qual[1].appt_qual[i].resource_cd
			set appt_reply_out->ResourceDepartments[x]->Resource[1]->ProviderName =
			650685_rep->qual[1].appt_qual[i].resource_disp
 
			; Location Address
			select into "nl:"
			from address a
			plan a where a.parent_entity_name = "LOCATION"
				 and a.parent_entity_id = 650685_rep->qual[1].location_qual[1].location_cd
				 and a.address_type_cd = value(uar_get_code_by("MEANING",212,"BUSINESS"))
				 and a.active_ind = 1
				 and a.end_effective_dt_tm > sysdate
				 and a.beg_effective_dt_tm <= sysdate
			detail
				appt_reply_out->ResourceDepartments[x].Department.Address.AddressId = a.address_id
				appt_reply_out->ResourceDepartments[x].Department.Address.Type.Id = a.address_type_cd
				appt_reply_out->ResourceDepartments[x].Department.Address.Type.Name = uar_get_code_display(a.address_type_cd)
				appt_reply_out->ResourceDepartments[x].Department.Address.Address1 = a.street_addr
				appt_reply_out->ResourceDepartments[x].Department.Address.Address2 = a.street_addr2
				appt_reply_out->ResourceDepartments[x].Department.Address.City = a.city
				appt_reply_out->ResourceDepartments[x].Department.Address.Zip = a.zipcode
				if(a.state_cd > 0)
					appt_reply_out->ResourceDepartments[x].Department.Address.State = uar_get_code_display(a.state_cd)
				else
					appt_reply_out->ResourceDepartments[x].Department.Address.State = a.state
				endif
			with nocounter
 
 			; Location Phones
			select into "nl:"
			from phone ph
			where ph.parent_entity_name = "LOCATION"
				and ph.parent_entity_id = 650685_rep->qual[1].location_qual[1].location_cd
				and ph.active_ind = 1
				and ph.end_effective_dt_tm > sysdate
				and ph.beg_effective_dt_tm <= sysdate
			head report
				p = 0
			detail
				p = p + 1
				stat = alterlist(appt_reply_out->ResourceDepartments[x].Department.Phones,p)
 
				appt_reply_out->ResourceDepartments[x].Department.Phones[p].PhoneId = ph.phone_id
				appt_reply_out->ResourceDepartments[x].Department.Phones[p].Number = ph.phone_num
				appt_reply_out->ResourceDepartments[x].Department.Phones[p].SequenceNumber = ph.seq
				appt_reply_out->ResourceDepartments[x].Department.Phones[p].Type.Id = ph.phone_type_cd
				appt_reply_out->ResourceDepartments[x].Department.Phones[p].Type.Name = uar_get_code_display(ph.phone_type_cd)
			with nocounter
		endif
	endfor
 
 	; Confirmed Date/Time
 	for(a = 1 to 650685_rep->qual[1].action_qual_cnt)
 		if(trim(650685_rep->qual[1].action_qual[a].action_meaning,3) = "CONFIRM")
			set appt_reply_out->ConfirmedDateTime = 650685_rep->qual[1].action_qual[a].action_dt_tm
		endif
	endfor
 
 	; Patient Instructions
 	set appt_reply_out->PatientInstructions = sInstructions
 
 	; Appointment Comments
 	set appt_reply_out->AppointmentComments = sComments
 
	; Get Financial Number
	select into "nl:"
	from encntr_alias ea
	where ea.encntr_id = appt_reply_out->EncounterId
		and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
		and ea.active_ind = 1
		and ea.end_effective_dt_tm > sysdate
		and ea.beg_effective_dt_tm <= sysdate
	detail
		appt_reply_out->FinancialNumber = ea.alias
	with nocounter
 
	; Appointment Details
	if(650685_rep->qual[1].detail_qual_cnt > 0)
		set j = 0
		for(i = 1 to 650685_rep->qual[1].detail_qual_cnt)
			if(650685_rep->qual[1].detail_qual[i].version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00"))
				set j = j + 1
				set stat = alterlist(appt_reply_out->AppointmentDetails,j)
				set appt_reply_out->AppointmentDetails[j].Field.Id = 650685_rep->qual[1].detail_qual[i].oe_field_id
	 
				;Field Text
				select into "nl:"
				from order_entry_fields oef
				plan oef where oef.oe_field_id = 650685_rep->qual[1].detail_qual[i].oe_field_id
				detail
					appt_reply_out->AppointmentDetails[j].Field.Name = oef.description
	 
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
						appt_reply_out->AppointmentDetails[j].Coded_Values[1].Id = 650685_rep->qual[1].detail_qual[i].oe_field_value
						appt_reply_out->AppointmentDetails[j].Coded_Values[1].Name = 650685_rep->qual[1].detail_qual[i].oe_field_display_value
					else
						if(oef.field_type_flag = 12 and oef.codeset > 0)
							appt_reply_out->AppointmentDetails[j].Coded_Values[1].Id = 650685_rep->qual[1].detail_qual[i].oe_field_value
							appt_reply_out->AppointmentDetails[j].Coded_Values[1].Name = 650685_rep->qual[1].detail_qual[i].oe_field_display_value
						else
							appt_reply_out->AppointmentDetails[j].Text_Values = 650685_rep->qual[1].detail_qual[i].oe_field_display_value
						endif
					endif
				with nocounter
			endif
		endfor
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ; End Subroutine
 
 
end go
set trace notranslatelock go
