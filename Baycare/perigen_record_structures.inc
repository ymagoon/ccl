;pm_match_person
free record request119995
record request119995 (
  1 match_unauth_reconcile_flag = i2
  1 person_qual = i4
  1 person [*]
    2 person_id = f8
    2 person_type_cd = f8
    2 name_last_key = c100
    2 name_first_key = c100
    2 name_full_formatted = c100
    2 blood_group_cd = f8
    2 blood_type_cd = f8
    2 ethnic_grp_cd = f8
    2 language_cd = f8
    2 marital_type_cd = f8
    2 race_cd = f8
    2 birth_dt_tm = dq8
    2 sex_cd = f8
    2 data_status_cd = f8
    2 name_last = c200
    2 name_first = c200
    2 contributor_system_cd = f8
    2 person_alias_qual = i4
    2 person_alias [*]
      3 person_alias_id = f8
      3 person_id = f8
      3 alias_pool_cd = f8
      3 person_alias_type_cd = f8
      3 alias = c200
      3 person_alias_sub_type_cd = f8
      3 active_ind = i4
      3 check_digit_ind = i4
      3 check_digit = i4
      3 check_digit_method_cd = f8
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
  1 person_match_rev_qual = i4
  1 person_match_rev [*]
    2 person_match_rev_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 match_rev_flag_ind = i2
    2 match_rev_flag = i2
    2 a_person_id = f8
    2 b_person_id = f8
    2 a_alias1 = c200
    2 a_alias_type1_cd = f8
    2 a_alias_pool1_cd = f8
    2 b_alias1 = c200
    2 b_alias_type1_cd = f8
    2 b_alias_pool1_cd = f8
    2 match_val1_cd = f8
    2 a_alias2 = c200
    2 a_alias_type2_cd = f8
    2 a_alias_pool2_cd = f8
    2 b_alias2 = c200
    2 b_alias_type2_cd = f8
    2 b_alias_pool2_cd = f8
    2 match_val2_cd = f8
    2 a_alias3 = c200
    2 a_alias_type3_cd = f8
    2 a_alias_pool3_cd = f8
    2 b_alias3 = c200
    2 b_alias_type3_cd = f8
    2 b_alias_pool3_cd = f8
    2 match_val3_cd = f8
    2 a_name_last_key = c100
    2 b_name_last_key = c100
    2 match_val4_cd = f8
    2 a_name_first_key = c100
    2 b_name_first_key = c100
    2 match_val5_cd = f8
    2 a_name_full = c100
    2 b_name_full = c100
    2 match_val6_cd = f8
    2 a_birth_dt_tm = dq8
    2 b_birth_dt_tm = dq8
    2 match_val7_cd = f8
    2 a_sex_cd = f8
    2 b_sex_cd = f8
    2 match_val8_cd = f8
    2 match_dt_tm = dq8
    2 contributor_system_cd = f8
)
 
;pm_val_encounter
free record request10031
record request100301 (
  1 encntr_id = f8
  1 person_id = f8
  1 encntr_alias_qual = i4
  1 encntr_alias [*]
    2 encntr_alias_id = f8
    2 alias_pool_cd = f8
    2 encntr_alias_type_cd = f8
    2 alias = c200
    2 encntr_alias_sub_type_cd = f8
    2 check_digit_ind = i4
    2 check_digit = i4
    2 check_digit_method_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 contributor_system_cd = f8
)
 
 
;esi_add_log_table
free record request1200040
record request1200040 (
  1 esi_log_alias = i4
  1 esi_log [*]
    2 esi_log_id = f8
    2 msgid = c16
    2 queue_id = f8
    2 batch_event_id = f8
    2 contributor_system_cd = f8
    2 error_stat = c32
    2 binding = c32
    2 esi_instance = i4
    2 msh_msg_type = c8
    2 msh_msg_trig = c8
    2 msh_ctrl_ident = c100
    2 msh_date = c32
    2 msh_sending_app = c32
    2 start_dt_tm = dq8
    2 start_time = vc
    2 end_dt_tm = dq8
    2 end_time = vc
    2 error_text = c500
    2 name_full_formatted = c100
    2 order_ctrl = c8
    2 care_set_flag = i2
    2 entity_name = c32
    2 entity_count = i4
    2 entity_list = c128
    2 hl7_entity_code = c128
    2 person_id = f8
    2 encntr_id = f8
    2 order_id = f8
    2 event_id = f8
    2 sch_event_id = f8
    2 hold_alias_flag = i4
    2 hold_release_stat = i4
    2 task_id = f8
    2 domain_error_stat_cd = f8
    2 domain_error_text = c500
    2 hl7_entity_alias = c128
    2 esi_log_orig_id = f8
    2 tx_key = c27
    2 esi_tx_key = c27
    2 accession_id = f8
    2 hl7_accession_nbr = c20
    2 procd_restore_flag = i2
    2 person_alias = vc
    2 encntr_alias = vc
    2 scriptinfo [*]
      3 scriptname = vc
      3 elapsedtime = i4
)
 

